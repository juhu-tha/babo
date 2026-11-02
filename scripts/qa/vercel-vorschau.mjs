#!/usr/bin/env node
/**
 * Lokale Vorschau des statischen Betriebs wie auf Vercel (docs/betrieb-vercel.md) – ohne Express-Server.
 * Liefert dist/ aus und wendet vercel.json an: redirects, Dateisystem mit cleanUrls/trailingSlash, rewrites,
 * 404.html, headers (Sicherheits-Header einschließlich CSP, Cache-Control). /api/* gibt es nicht (404).
 *
 *   BB_STATISCH=1 npm run build && rm -f dist/server.cjs && cp dist/index.html dist/404.html   (= buildCommand)
 *   PORT=4501 node scripts/qa/vercel-vorschau.mjs [dist]
 *
 * Kompression wie Vercel: Brotli (bzw. gzip) für Text-Typen, wenn der Browser es anbietet (Ladezeitmessung mit
 * scripts/qa/perf-messung.mjs unter „Fast 3G“, docs/pruefung/lcp-module-2026-11-02.md). Ergebnis je Datei zwischengespeichert.
 *
 * Nachbildung nur für die in vercel.json benutzten Muster (feste Pfade und „/<präfix>/(.*)“).
 */
import fs from 'fs';
import http from 'http';
import path from 'path';
import zlib from 'zlib';

const wurzel = path.resolve(process.argv[2] ?? 'dist');
const konfig = JSON.parse(fs.readFileSync(path.resolve('vercel.json'), 'utf8'));
const port = Number(process.env.PORT) || 4501;

const TYPEN = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.webmanifest': 'application/manifest+json', '.wasm': 'application/wasm',
};

/** fester Pfad, „/(.*)“, „/assets/(.*)“ oder „/modul/(a|b)“ → RegExp (Klammergruppen bleiben reguläre Ausdrücke) */
const muster = q => new RegExp('^' + q.replace(/\./g, '\\.').replace(/\\\.\*/g, '.*') + '$');
/** has-Bedingung „host“ (Wert als regulärer Ausdruck, ganzer Hostname) */
const hostPasst = (has, host) => (has ?? []).every(h => h.type !== 'host' || new RegExp('^' + h.value + '$').test(host));
const kopfRegeln = (konfig.headers ?? []).map(r => ({ re: muster(r.source), has: r.has, headers: r.headers }));

function datei(p) {
  const f = path.join(wurzel, p);
  if (!f.startsWith(wurzel)) return null;
  try { return fs.statSync(f).isFile() ? f : null; } catch { return null; }
}

const KOMPRIMIERBAR = /^(text\/|application\/(json|javascript|xml|manifest\+json)|image\/svg)/;
const gepackt = new Map();
/** Datei als Brotli/gzip (Qualität wie typische CDN-Einstellung), zwischengespeichert nach Pfad und Verfahren */
function packen(f, verfahren) {
  const k = verfahren + ':' + f;
  if (!gepackt.has(k)) {
    const roh = fs.readFileSync(f);
    gepackt.set(k, verfahren === 'br'
      ? zlib.brotliCompressSync(roh, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 6 } })
      : zlib.gzipSync(roh, { level: 6 }));
  }
  return gepackt.get(k);
}

let host = '';
let annahme = '';
function senden(res, pfad, status, f, kopf = {}) {
  for (const r of kopfRegeln) if (r.re.test(pfad) && hostPasst(r.has, host)) for (const h of r.headers) res.setHeader(h.key, h.value);
  for (const [k, v] of Object.entries(kopf)) res.setHeader(k, v);
  if (!f) { res.writeHead(status); return res.end(); }
  const typ = TYPEN[path.extname(f).toLowerCase()] ?? 'application/octet-stream';
  res.setHeader('Content-Type', typ);
  const verfahren = !KOMPRIMIERBAR.test(typ) ? '' : /\bbr\b/.test(annahme) ? 'br' : /\bgzip\b/.test(annahme) ? 'gzip' : '';
  if (verfahren) {
    res.setHeader('Content-Encoding', verfahren);
    res.setHeader('Vary', 'Accept-Encoding');
    res.writeHead(status);
    return res.end(packen(f, verfahren));
  }
  res.writeHead(status);
  fs.createReadStream(f).pipe(res);
}

http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://x');
  host = String(req.headers.host ?? '').replace(/:\d+$/, '');
  annahme = String(req.headers['accept-encoding'] ?? '');
  let pfad;
  try { pfad = decodeURIComponent(url.pathname); } catch { return senden(res, url.pathname, 400, null); }
  const suche = url.search;
  // 1. trailingSlash: false
  if (konfig.trailingSlash === false && pfad.length > 1 && pfad.endsWith('/')) return senden(res, pfad, 308, null, { Location: pfad.replace(/\/+$/, '') + suche });
  // 2. redirects (vor dem Dateisystem)
  for (const r of konfig.redirects ?? []) if (muster(r.source).test(pfad)) return senden(res, pfad, r.permanent ? 308 : 307, null, { Location: r.destination + suche });
  // 3. cleanUrls: *.html und /index → saubere Adresse
  if (konfig.cleanUrls && /\.html$/.test(pfad) && datei(pfad)) {
    const sauber = pfad.replace(/(\/index)?\.html$/, '') || '/';
    return senden(res, pfad, 308, null, { Location: sauber + suche });
  }
  // 4. Dateisystem
  const f = pfad === '/' ? datei('/index.html') : datei(pfad) ?? (konfig.cleanUrls ? datei(pfad + '.html') : null);
  if (f) return senden(res, pfad, 200, f);
  // 5. rewrites
  for (const r of konfig.rewrites ?? []) if (muster(r.source).test(pfad)) { const z = datei(r.destination); if (z) return senden(res, pfad, 200, z); }
  // 6. 404.html
  return senden(res, pfad, 404, datei('/404.html'));
}).listen(port, '127.0.0.1', () => console.log(`Vercel-Vorschau (statisch) auf http://127.0.0.1:${port} – ${wurzel}`));
