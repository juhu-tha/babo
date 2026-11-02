#!/usr/bin/env node
/**
 * Performance-Messung (Umsetzungsplan Phase 5, AP 5.5) – Ersatz für Lighthouse ohne zusätzliche Abhängigkeit.
 * Misst auf Referenzseiten mit Mobil-Emulation (390 × 844, CPU 4× gedrosselt, Netz „Fast 3G“ per CDP, Cache aus):
 *   LCP, CLS (bis vor der ersten Interaktion), TBT-Näherung (Summe der Long-Task-Anteile über 50 ms nach FCP),
 *   Interaktionslatenz eines Klicks (Event Timing, Ersatz für INP), übertragene Bytes.
 * Je Seite N Läufe in frischem Browserkontext, berichtet wird der Median.
 *
 *   npm run build && NODE_ENV=production PORT=4206 node dist/server.cjs &
 *   node scripts/qa/perf-messung.mjs [--basis http://localhost:4206/] [--laeufe 3] [--routen a,b] [--ohne-datei] [--dunkel]
 * --dunkel: Systemeinstellung dunkel (prefers-color-scheme), ohne eigene Wahl – wie ein Erstbesuch im Dunkelmodus.
 *
 * Playwright ist KEINE Projektabhängigkeit und läuft nicht in der CI: einmalig global installieren
 * (`npm i -g playwright && npx playwright install chromium`) oder `npm i --no-save playwright`.
 * Ein vorhandenes Chromium wird über CHROMIUM_PATH bzw. /opt/pw-browsers/chromium genutzt.
 * Ergebnis: Tabelle auf stdout und (ohne --ohne-datei) docs/performance.md.
 */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { execSync } from 'child_process';
import { seitenUrl } from './seitenUrl.mjs';

async function ladePlaywright() {
  try { return await import('playwright'); } catch { /* lokal nicht installiert → global */ }
  const global = execSync('npm root -g', { encoding: 'utf8' }).trim();
  return createRequire(path.join(global, 'noop.js'))('playwright');
}
const { chromium } = await ladePlaywright();

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const ai = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const BASIS = (ai('--basis') ?? 'http://localhost:4206/').replace(/\/?$/, '/');
const LAEUFE = Number(ai('--laeufe') ?? 3);
const ROUTEN = ai('--routen')?.split(',') ?? ['start', 'mischungsberechnung', 'biegebemessung', 'bauphysik', 'feuchteschutz', 'oekobilanz_lca', 'abfaelle', 'spannbeton_grundlagen', 'glas', 'aufgaben_trainer'];
const DUNKEL = process.argv.includes('--dunkel');
const ZIEL = { lcp: 2500, cls: 0.1, tbt: 200, klick: 200 };

// Chrome DevTools „Fast 3G“ (wie Lighthouse-Vorgabe der DevTools): 562,5 ms RTT, 1,44 Mbit/s ↓, 675 kbit/s ↑
const NETZ = { offline: false, latency: 562.5, downloadThroughput: (1.6 * 1024 * 1024 / 8) * 0.9, uploadThroughput: (750 * 1024 / 8) * 0.9 };
const CPU = 4;

const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});

// Beobachter vor jedem Seitenskript registrieren
const BEOBACHTER = () => {
  const p = (window.__perf = { lcp: 0, lcpEl: '', cls: 0, fcp: 0, longtasks: [], events: [] });
  const obs = (type, cb, extra = {}) => { try { new PerformanceObserver(l => l.getEntries().forEach(cb)).observe({ type, buffered: true, ...extra }); } catch { /* nicht unterstützt */ } };
  obs('largest-contentful-paint', e => { p.lcp = e.startTime; p.lcpEl = e.element ? e.element.tagName + (e.element.className ? '.' + String(e.element.className).split(' ')[0] : '') : ''; });
  obs('layout-shift', e => { if (!e.hadRecentInput) p.cls += e.value; });
  obs('paint', e => { if (e.name === 'first-contentful-paint') p.fcp = e.startTime; });
  obs('longtask', e => p.longtasks.push([e.startTime, e.duration]));
  obs('event', e => { if (e.interactionId) p.events.push([e.name, e.duration]); }, { durationThreshold: 16 });
  obs('first-input', e => p.events.push([e.name, e.duration]));
};

async function messe(route) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'de-DE', colorScheme: DUNKEL ? 'dark' : 'light' });
  await ctx.addInitScript(BEOBACHTER);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', NETZ);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
  let bytes = 0;
  cdp.on('Network.loadingFinished', e => { bytes += e.encodedDataLength; });

  const url = seitenUrl(BASIS, route);
  await page.goto(url, { waitUntil: 'load', timeout: 120000 });
  await page.waitForLoadState('networkidle', { timeout: 120000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const vor = await page.evaluate(() => {
    const p = window.__perf;
    const tbt = p.longtasks.filter(([s]) => s >= p.fcp).reduce((a, [, d]) => a + Math.max(0, d - 50), 0);
    return { lcp: p.lcp, lcpEl: p.lcpEl, cls: p.cls, fcp: p.fcp, tbt, longtasks: p.longtasks.length };
  });

  // Interaktion: ein Klick auf ein sichtbares Bedienelement im Inhalt (Aufklapper bevorzugt)
  const ziel = await page.evaluate(() => {
    const sichtbar = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= innerHeight && getComputedStyle(el).visibility !== 'hidden'; };
    const kandidaten = [...document.querySelectorAll('main button[aria-expanded], main [role=tab], main button:not([disabled])')].filter(sichtbar);
    const el = kandidaten[0];
    if (!el) return null;
    el.setAttribute('data-perf-ziel', '1');
    return (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
  });
  let klick = null;
  if (ziel !== null) {
    await page.click('[data-perf-ziel]', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1500);
    klick = await page.evaluate(() => {
      const ev = window.__perf.events.filter(([n]) => /click|pointer|mouse|touch/.test(n));
      return ev.length ? Math.max(...ev.map(([, d]) => d)) : 0; // 0 = unter 16 ms (Event-Timing-Schwelle)
    });
  }
  await ctx.close();
  return { ...vor, klick, ziel, kb: bytes / 1024 };
}

const median = a => { const s = a.filter(x => x !== null && x !== undefined).sort((x, y) => x - y); return s.length ? s[Math.floor((s.length - 1) / 2)] : null; };
const de = (n, d = 0) => n === null ? '–' : n.toFixed(d).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const sek = ms => de(ms / 1000, 2) + ' s';

const zeilen = [];
for (const r of ROUTEN) {
  const laeufe = [];
  for (let i = 0; i < LAEUFE; i++) laeufe.push(await messe(r));
  const m = k => median(laeufe.map(x => x[k]));
  const z = { route: r, fcp: m('fcp'), lcp: m('lcp'), cls: m('cls'), tbt: m('tbt'), klick: m('klick'), kb: m('kb'), lcpEl: laeufe.at(-1).lcpEl, ziel: laeufe.at(-1).ziel };
  zeilen.push(z);
  console.log(`${r}: FCP ${sek(z.fcp)}, LCP ${sek(z.lcp)}, CLS ${de(z.cls, 3)}, TBT ${de(z.tbt)} ms, Klick ${z.klick === 0 ? '< 16' : de(z.klick)} ms, ${de(z.kb)} kB`);
}
await browser.close();

const ok = (wert, grenze) => wert === null ? '' : wert < grenze ? ' ✓' : ' ✗';
const tabelle = [
  '| Seite | FCP | LCP (Ziel < 2,5 s) | CLS (Ziel < 0,1) | TBT ≈ (Ziel < 200 ms) | Klick-Latenz (Ziel < 200 ms) | Übertragen | LCP-Element | geklickt |',
  '|---|---:|---:|---:|---:|---:|---:|---|---|',
  ...zeilen.map(z => `| ${z.route} | ${sek(z.fcp)} | ${sek(z.lcp)}${ok(z.lcp, ZIEL.lcp)} | ${de(z.cls, 3)}${ok(z.cls, ZIEL.cls)} | ${de(z.tbt)} ms${ok(z.tbt, ZIEL.tbt)} | ${z.klick === null ? '–' : z.klick === 0 ? '< 16 ms ✓' : de(z.klick) + ' ms' + ok(z.klick, ZIEL.klick)} | ${de(z.kb)} kB | \`${z.lcpEl || '–'}\` | ${z.ziel ?? '–'} |`),
].join('\n');
console.log('\n' + tabelle);

if (!process.argv.includes('--ohne-datei')) {
  const datei = path.join(ROOT, 'docs/performance.md');
  const alt = fs.existsSync(datei) ? fs.readFileSync(datei, 'utf8') : '';
  const A = '<!-- perf-messung:start -->', E = '<!-- perf-messung:ende -->';
  const block = `${A}\nStand ${new Date().toISOString().slice(0, 10)} · ${LAEUFE} Läufe je Seite (Median)${DUNKEL ? ' · Dunkelmodus' : ''} · ${BASIS}\n\n${tabelle}\n${E}`;
  const neu = alt.includes(A) ? alt.replace(new RegExp(`${A}[\\s\\S]*?${E}`), block) : `${alt.trimEnd()}\n\n${block}\n`;
  fs.writeFileSync(datei, neu.trimStart());
  console.log(`→ ${path.relative(ROOT, datei)} aktualisiert`);
}
