#!/usr/bin/env node
/**
 * Inhaltsvergleich zweier Builds (Umsetzungsplan Phase 5, AP 5.3 – Auslagerung nach content/)
 * Rendert jede Modulroute (Desktop 1440×900, Mobil 390×844) und hält je Ansicht fest:
 * innerText von #module-content, Anzahl gerenderter KaTeX-Formeln (.katex) und Seitenfehler.
 * Ansichten: Startzustand + nacheinander jeder Reiter ([role=tab]) und jede Umschaltfläche
 * (button[aria-pressed]) im Modul.
 *
 *   node scripts/qa/inhalt-vergleich.mjs aufnehmen --basis http://localhost:4182/ --aus alt.json [--routen a,b]
 *   node scripts/qa/inhalt-vergleich.mjs vergleichen alt.json neu.json
 *
 * Ablauf: alten Stand bauen und mit `vite preview` ausliefern → aufnehmen; neuen Stand ebenso → vergleichen.
 * Exit-Code 1 bei Abweichungen. Playwright wie in e2e-smoke.mjs (lokal oder global).
 */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { execSync } from 'child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const [modus, ...rest] = process.argv.slice(2);
const arg = n => { const i = rest.indexOf(n); return i >= 0 ? rest[i + 1] : undefined; };

if (modus === 'vergleichen') {
  // Datei oder Ordner mit Teilaufnahmen (--teil)
  const lies = f => fs.statSync(f).isDirectory()
    ? Object.assign({}, ...fs.readdirSync(f).filter(x => x.endsWith('.json')).sort().map(x => JSON.parse(fs.readFileSync(path.join(f, x), 'utf8'))))
    : JSON.parse(fs.readFileSync(f, 'utf8'));
  const [a, b] = rest.map(lies);
  let abw = 0, ansichten = 0, formeln = 0;
  for (const k of Object.keys(a)) {
    const x = a[k], y = b[k];
    if (!y) { console.log(`FEHLT im neuen Stand: ${k}`); abw++; continue; }
    if (y.fehler.length) { console.log(`SEITENFEHLER ${k}: ${y.fehler.join(' | ').slice(0, 300)}`); abw++; }
    const n = Math.max(x.ansichten.length, y.ansichten.length);
    for (let i = 0; i < n; i++) {
      ansichten++;
      const p = x.ansichten[i], q = y.ansichten[i];
      if (!p || !q) { console.log(`${k} Ansicht ${i}: nur in einem Stand vorhanden`); abw++; continue; }
      formeln += q.katex;
      if (p.text !== q.text) {
        let j = 0; while (j < p.text.length && p.text[j] === q.text[j]) j++;
        console.log(`${k} Ansicht ${i} (${p.name}): Text weicht ab bei Zeichen ${j}\n  alt: ${JSON.stringify(p.text.slice(Math.max(0, j - 60), j + 80))}\n  neu: ${JSON.stringify(q.text.slice(Math.max(0, j - 60), j + 80))}`);
        abw++;
      }
      if (p.katex !== q.katex) { console.log(`${k} Ansicht ${i} (${p.name}): Formeln ${p.katex} → ${q.katex}`); abw++; }
    }
  }
  console.log(`\n${Object.keys(a).length} Routen×Ansichtsgrößen, ${ansichten} Ansichten, ${formeln} Formeln (neu) – ${abw} Abweichungen`);
  process.exit(abw ? 1 : 0);
}

if (modus !== 'aufnehmen') { console.error('Modus: aufnehmen | vergleichen'); process.exit(2); }
const req = createRequire(import.meta.url);
let pw;
try { pw = req('playwright'); } catch { pw = req(path.join(execSync('npm root -g', { encoding: 'utf8' }).trim(), 'playwright')); }
const BASIS = arg('--basis') ?? 'http://localhost:4182/';
const AUS = arg('--aus') ?? 'inhalt-aufnahme.json';
const reg = fs.readFileSync(path.join(ROOT, 'src/registry/modules.ts'), 'utf8');
const teil = reg.slice(reg.indexOf('export const MODULE = ['), reg.indexOf('] as const satisfies readonly ModulEintrag[]'));
let routen = [...teil.matchAll(/^ {2}\{ id: '([a-z0-9_-]+)'/gm)].map(m => m[1]).filter(id => !id.startsWith('divider_'));
if (arg('--routen')) routen = arg('--routen').split(',');
// --teil i/n: nur den i-ten von n Abschnitten aufnehmen (kurze Läufe, z. B. unter einer gemeinsamen Sperre)
if (arg('--teil')) { const [i, n] = arg('--teil').split('/').map(Number); const g = Math.ceil(routen.length / n); routen = routen.slice((i - 1) * g, i * g); }
const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await pw.chromium.launch(exe ? { executablePath: exe } : {});
const ergebnis = {};
const GROESSEN = { desktop: { width: 1440, height: 900 }, mobil: { width: 390, height: 844 } };

const zustand = p => p.evaluate(() => {
  const r = document.getElementById('module-content');
  return { text: r ? r.innerText : '', katex: r ? r.querySelectorAll('.katex').length : 0 };
});
const ruhig = async p => {
  let alt = '';
  for (let i = 0; i < 20; i++) {
    await p.waitForTimeout(150);
    const z = await zustand(p);
    const k = z.text.length + ':' + z.katex;
    if (k === alt) return z;
    alt = k;
  }
  return zustand(p);
};

for (const [gname, vp] of Object.entries(GROESSEN)) {
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'reduce' });
  await ctx.route('**/api/**', r => r.fulfill({ status: 204, body: '' }));
  const p = await ctx.newPage();
  let fehler = [];
  p.on('pageerror', e => fehler.push(String(e.message).slice(0, 200)));
  for (const id of routen) {
    fehler = [];
    await p.goto('about:blank');
    const t0 = Date.now();
    await p.goto(`${BASIS}#${id}`, { waitUntil: 'load' }).catch(e => fehler.push('goto: ' + e.message));
    await p.waitForSelector('#module-content h1, #module-content h2', { timeout: 15000 }).catch(() => {});
    await p.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    if (process.env.ZEIT) console.log('geladen', id, Date.now() - t0);
    const ansichten = [{ name: 'start', ...(await ruhig(p)) }];
    const anzahl = await p.locator('#module-content [role="tab"], #module-content button[aria-pressed]').count();
    for (let i = 0; i < Math.min(anzahl, 40); i++) {
      const el = p.locator('#module-content [role="tab"], #module-content button[aria-pressed]').nth(i);
      const name = ((await el.innerText().catch(() => '')) || '').trim().slice(0, 40);
      try { await el.click({ timeout: 2000 }); } catch { continue; }
      ansichten.push({ name: `${i}:${name}`, ...(await ruhig(p)) });
    }
    ergebnis[`${gname}:${id}`] = { ansichten, fehler: [...fehler] };
    process.stdout.write(`${gname}:${id} ${ansichten.length}\n`);
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(AUS, JSON.stringify(ergebnis));
console.log(`gespeichert: ${AUS}`);
