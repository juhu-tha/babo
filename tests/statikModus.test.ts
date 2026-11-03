// Statischer Betrieb auf Vercel (Entscheidung 02.11.2026, docs/betrieb-vercel.md): Build-Schalter BB_STATISCH,
// keine /api-Aufrufe ohne Server, Server-Bundle nicht im veröffentlichten Ordner, vercel.json aktuell.
import fs from 'fs';
import { STATISCH, SERVER_FUNKTIONEN } from '../src/data/betriebsart';
import { KI_FUNKTION_AKTIV } from '../src/data/kiSchalter';
import { abweichungen, csp, leseKonfig, weiterleitungen, VERCEL_HOST } from '../scripts/vercelKonfig';
import { AKTIVE_MODULE, INAKTIVE_ADRESSEN } from '../src/registry/modules';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const lies = (f: string) => fs.readFileSync(f, 'utf8');
console.log('--- Test: Statik-Modus und Server-Bundle ---');

// 1. Schalter: ohne Build (tsx) Serverbetrieb; Build-Schalter in vite.config.ts für Client und Vorrendern
pruefe(STATISCH === false && SERVER_FUNKTIONEN === true, 'ohne BB_STATISCH gilt der Serverbetrieb');
const vite = lies('vite.config.ts');
pruefe(/const statisch = process\.env\.BB_STATISCH === '1'/.test(vite) && vite.includes('__BB_STATISCH__: JSON.stringify(statisch)'), 'vite.config.ts setzt __BB_STATISCH__ aus BB_STATISCH');
pruefe(KI_FUNKTION_AKTIV === false && /KI_EINGESCHALTET && !STATISCH/.test(lies('src/data/kiSchalter.ts')), 'KI im statischen Betrieb immer aus');
pruefe(lies('src/data/kiSchalter.ts').includes("from './betriebsart.ts'"), 'kiSchalter.ts importiert mit .ts-Endung (node server.ts ohne Bundler)');

// 2. Jeder /api-Aufruf im Client ist hinter dem Schalter (Datei → erwartete Sperre)
const sperren: Record<string, (s: string) => boolean> = {
  'src/App.tsx': s => /if \(!SERVER_FUNKTIONEN\) return;\s*\n\s*fetch\('\/api\/analytics\/visit'/.test(s)
    && s.includes('{SERVER_FUNKTIONEN && <React.Suspense fallback={null}><Kurzfragebogen /></React.Suspense>}')
    && /if \(SERVER_FUNKTIONEN && typeof window !== 'undefined'\) \{\s*\n\s*const params = new URLSearchParams\(window\.location\.search\);\s*\n\s*const poll/.test(s),
  'src/modules/Vorlesungen.tsx': s => s.includes('{SERVER_FUNKTIONEN && <LecturePollSession'),
  'src/modules/Admin.tsx': s => /if \(!SERVER_FUNKTIONEN\) return;\s*\n\s*let active = true;\s*\n\s*verifyAdminSession\(\)/.test(s) && s.includes('{SERVER_FUNKTIONEN ? (\n          <form onSubmit={handleLogin}'),
  'src/utils/adminAuth.ts': s => s.includes("if (!SERVER_FUNKTIONEN) return { ok: false") && s.includes('if (!token || !SERVER_FUNKTIONEN) return false;'),
};
// Aufrufer, die nur hinter einer der Sperren erreichbar sind (Abstimmung, Kurzfragebogen, Admin nach Anmeldung, KI)
const nurHinterSperre = new Set([
  'src/components/polls/LecturePollSession.tsx', 'src/components/polls/StudentPollVoteView.tsx',
  'src/components/feedback/Kurzfragebogen.tsx', 'src/components/admin/KurzfragebogenAuswertung.tsx',
  'src/modules/KiBaustoffe.tsx',
]);
function dateien(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? dateien(`${dir}/${e.name}`) : /\.tsx?$/.test(e.name) ? [`${dir}/${e.name}`] : []);
}
for (const f of dateien('src')) {
  const s = lies(f);
  if (!/fetch\(\s*[`'"]\/api\//.test(s)) continue;
  if (sperren[f]) pruefe(sperren[f](s), `${f}: /api-Aufruf hinter SERVER_FUNKTIONEN`);
  else pruefe(nurHinterSperre.has(f), `${f}: neuer /api-Aufruf – im statischen Betrieb abschalten (src/data/betriebsart.ts) und hier eintragen`);
}
for (const f of Object.keys(sperren)) pruefe(lies(f).includes('betriebsart'), `${f} nutzt src/data/betriebsart.ts`);

// 3. Server-Bundle: npm start/Dockerfile unverändert (dist/server.cjs), auf Vercel nicht veröffentlicht
const paket = JSON.parse(lies('package.json'));
pruefe(paket.scripts.build.includes('--outfile=dist/server.cjs'), 'npm run build erzeugt weiterhin dist/server.cjs (Dockerfile, check-bundle)');
pruefe(/CMD \["node", "dist\/server\.cjs"\]/.test(lies('Dockerfile')), 'Dockerfile startet dist/server.cjs');
const k = leseKonfig() as Record<string, unknown>;
const bau = String(k.buildCommand ?? '');
pruefe(/^BB_STATISCH=1 npm run build && /.test(bau), 'vercel.json: Build mit BB_STATISCH=1 über npm run build');
pruefe(/&& rm -f dist\/server\.cjs(\s|&|$)/.test(bau), 'vercel.json: dist/server.cjs wird vor der Veröffentlichung entfernt');
pruefe(/&& node scripts\/seite404\.mjs$/.test(bau), 'vercel.json: 404.html (App mit Hinweis „Seite nicht gefunden“, Status 404) für unbekannte Adressen');
pruefe(k.outputDirectory === 'dist' && k.framework === 'vite', 'vercel.json: Ausgabeordner dist, Vite');
pruefe(!fs.existsSync('.vercelignore') || !/server/.test(lies('.vercelignore')), '.vercelignore wirkt nicht auf Build-Ausgaben – nicht als Schutz verwenden');

// 4. Adressen: /modul/<id> über cleanUrls, Aliase als Weiterleitung, admin ohne Vorrendern über rewrite
pruefe(k.cleanUrls === true && k.trailingSlash === false, 'vercel.json: cleanUrls (/modul/<id> → modul/<id>.html), ohne Schrägstrich am Ende');
const ids = new Set(AKTIVE_MODULE.map(m => m.id));
const wl = weiterleitungen();
pruefe(wl.length > 10 && wl[0].source === '/modul/start' && wl.slice(1).every(w => w.source.startsWith('/modul/') && !ids.has(w.source.slice(7))), 'Weiterleitungen nur für Aliase, nie für echte Modul-IDs');
pruefe(wl.every(w => w.destination === '/' || ids.has(w.destination.slice(7))), 'Weiterleitungsziele sind aktive Module');
const rewrites = (k.rewrites ?? []) as { source: string; destination: string }[];
pruefe(rewrites.some(r => r.source === '/modul/admin' && r.destination === '/index.html'), 'rewrite /modul/admin → index.html (nicht vorgerendert)');
pruefe(!rewrites.some(r => r.source.startsWith('/api')), 'kein rewrite für /api (bleibt 404)');

// 5. Sicherheits-Header
const regeln = (k.headers ?? []) as { source: string; has?: { type: string; value: string }[]; headers: { key: string; value: string }[] }[];
const alle = new Map((regeln.find(r => r.source === '/(.*)' && !r.has)?.headers ?? []).map(h => [h.key, h.value]));
const richtlinie = alle.get('Content-Security-Policy') ?? '';
pruefe(richtlinie === csp(), 'CSP aus scripts/vercelKonfig.ts');
pruefe(richtlinie.includes("default-src 'self'") && !richtlinie.includes('unsafe-eval'), "CSP: default-src 'self', kein 'unsafe-eval'");
const skript = richtlinie.split('; ').find(d => d.startsWith('script-src ')) ?? '';
pruefe(!skript.includes("'unsafe-inline'") && (skript.match(/'sha256-/g) ?? []).length === 2, "CSP: script-src ohne 'unsafe-inline', zwei Inline-Skripte per Hash");
pruefe(/frame-ancestors 'self' https:\/\/baustoffboard\.de/.test(richtlinie) && richtlinie.includes("object-src 'none'"), 'CSP: frame-ancestors (Einbettung über baustoffboard.de), object-src none');
pruefe(alle.get('X-Content-Type-Options') === 'nosniff', 'X-Content-Type-Options: nosniff');
pruefe(alle.get('Referrer-Policy') === 'strict-origin-when-cross-origin', 'Referrer-Policy wie server.ts');
pruefe(/camera=\(\)/.test(alle.get('Permissions-Policy') ?? ''), 'Permissions-Policy wie server.ts');
pruefe(!alle.has('X-Frame-Options'), 'kein X-Frame-Options (würde die Einbettung über baustoffboard.de verhindern)');
const cache = (q: string) => regeln.find(r => r.source === q)?.headers.find(h => h.key === 'Cache-Control')?.value ?? '';
pruefe(/max-age=31536000, immutable/.test(cache('/assets/(.*)')), 'gehashte Assets: ein Jahr, immutable');
// noindex: *.vercel.app (baustoffboard.de bleibt kanonisch) und abgeschaltete Seiten
const vercelRegel = regeln.find(r => r.has?.some(h => h.type === 'host'));
const hostRe = new RegExp('^' + VERCEL_HOST + '$');
pruefe(!!vercelRegel && vercelRegel.source === '/(.*)' && vercelRegel.headers.some(h => h.key === 'X-Robots-Tag' && h.value === 'noindex'), 'X-Robots-Tag noindex für *.vercel.app');
pruefe(hostRe.test('babo-zeta.vercel.app') && hostRe.test('babo-git-x-juhu.vercel.app') && !hostRe.test('baustoffboard.de') && !hostRe.test('www.baustoffboard.de'), 'Host-Bedingung trifft nur *.vercel.app');
pruefe(!regeln.some(r => !r.has && r.source === '/(.*)' && r.headers.some(h => h.key === 'X-Robots-Tag')), 'kein noindex ohne Host-Bedingung');
const inaktivRegel = regeln.find(r => r.source.startsWith('/modul/(') && r.headers.some(h => h.key === 'X-Robots-Tag'));
pruefe(!!inaktivRegel && INAKTIVE_ADRESSEN.every(a => new RegExp('^' + inaktivRegel.source + '$').test('/modul/' + a)) && !new RegExp('^' + inaktivRegel!.source + '$').test('/modul/glas'), 'noindex für abgeschaltete Seiten (Lernpfade)');
const sitemap = lies('public/sitemap.xml');
pruefe(sitemap.includes('https://baustoffboard.de/') && !sitemap.includes('vercel.app') && lies('index.html').includes('<link rel="canonical" href="https://baustoffboard.de/" />'), 'canonical und Sitemap bleiben auf baustoffboard.de');
pruefe(abweichungen().length === 0, `vercel.json aktuell (${abweichungen().join('; ')}) – npx tsx scripts/vercelKonfig.ts --schreiben`);

// 6. Mit statischem Build (BB_STATISCH=1 npm run build): dist ohne /api-Aufrufe im vorgerenderten Vorlesungsbereich
if (fs.existsSync('dist/modul/vl_baustoffkunde.html') && !fs.existsSync('dist/server.cjs') && fs.existsSync('dist/404.html')) {
  const vl = lies('dist/modul/vl_baustoffkunde.html');
  pruefe(!/Hörsaal-Live-Voting|Publikumsvoting/.test(vl.slice(vl.indexOf('id="root"'))), 'statischer Build: Vorlesung ohne Live-Abstimmung vorgerendert');
}

if (fehler.length) { fehler.forEach(f => console.log('FAIL', f)); process.exit(1); }
console.log('OK: Statik-Modus (Schalter, /api-Sperren, vercel.json, Server-Bundle)');
