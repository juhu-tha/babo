#!/usr/bin/env node
/**
 * Barrierefreiheits-Prüfung über alle Modulrouten (Umsetzungsplan Phase 2, AP 2.1)
 *
 * Prüft jede Route der Modul-Registry mit axe-core (WCAG 2.1 A/AA) in Desktop (1440 px) und
 * Mobil (390 px), hell; dazu eine Stichprobe im Dunkelmodus. Gezählt werden Verstöße der
 * Schwere „critical“ und „serious“.
 *
 *   node scripts/qa/a11y.mjs [--basis URL] [--schreiben] [--vergleich] [--modi desk,mob,desk-dunkel]
 *                            [--routen-mob a,b] [--teil k/n]
 *     --schreiben  schreibt docs/a11y-baseline.json (nur beim vollständigen Lauf)
 *     --vergleich  bricht ab, wenn eine Route mehr Verstöße hat als in der Baseline (Ratchet)
 *     --modi       nur diese Modi prüfen (Pull Requests: desk vollständig, mob/desk-dunkel eingeschränkt)
 *     --routen-mob Mobil-Modus nur auf der Stichprobe DUNKEL und diesen Routen (z. B. aus scripts/qa/a11y-routen.mjs)
 *     --teil k/n   nur jede n-te Route ab k (parallele CI-Jobs); gilt für desk und mob
 *   Der Vergleich betrifft nur die geprüften Schlüssel (Modus:Route); die Baseline bleibt unverändert.
 *
 * Voraussetzungen (nicht in package.json, damit der AI-Studio-Import unverändert bleibt):
 *   npm i --no-save playwright @axe-core/playwright   und ein gebauter, laufender Server
 */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { seitenUrl } from './seitenUrl.mjs';
import { inaktiveIds } from '../suchindex-routen.mjs';

// lokal installiert (CI: npm i --no-save) oder über NODE_PATH (createRequire beachtet NODE_PATH, import() nicht)
const lade = async n => { try { return await import(n); } catch { return createRequire(import.meta.url)(n); } };
const { chromium } = await lade('playwright');
const { AxeBuilder } = await lade('@axe-core/playwright');

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const arg = n => process.argv.includes(n);
const basisIdx = process.argv.indexOf('--basis');
const BASIS = basisIdx > 0 ? process.argv[basisIdx + 1] : 'http://localhost:4173/';
const BASELINE = path.join(ROOT, 'docs/a11y-baseline.json');
const wert = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const MODI = wert('--modi')?.split(',');
const ROUTEN_MOB = wert('--routen-mob')?.split(',').filter(Boolean);
const [TEIL_K, TEIL_N] = (wert('--teil') ?? '1/1').split('/').map(Number);
const eingeschraenkt = !!(MODI || ROUTEN_MOB || TEIL_N > 1);
if (arg('--schreiben') && eingeschraenkt) { console.error('--schreiben nur beim vollständigen Lauf (ohne --modi/--routen-mob/--teil)'); process.exit(2); }
if (!(TEIL_N >= 1 && TEIL_K >= 1 && TEIL_K <= TEIL_N)) { console.error('--teil k/n mit 1 ≤ k ≤ n'); process.exit(2); }
const anteil = liste => liste.filter((_, i) => i % TEIL_N === TEIL_K - 1);

const reg = fs.readFileSync(path.join(ROOT, 'src/registry/modules.ts'), 'utf8');
const modulTeil = reg.slice(reg.indexOf('export const MODULE = ['), reg.indexOf('] as const satisfies readonly ModulEintrag[]'));
const inaktiv = inaktiveIds(reg); // abgeschaltete Seiten (INAKTIVE_GRUPPEN) liefern nur die 404-Hinweisseite
const routen = [...modulTeil.matchAll(/^ {2}\{ id: '([a-z0-9_-]+)'/gm)].map(m => m[1]).filter(id => !id.startsWith('divider_') && id !== 'admin' && !inaktiv.includes(id));
const DUNKEL = ['start', 'mischungsberechnung', 'oekobilanz_lca', 'bauphysik', 'expositionsklassen', 'glossar', 'abfaelle', 'aufgaben_quiz', 'stahlbeton_bemessung', 'holz'];

const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const ergebnis = {};
const unbekannt = (ROUTEN_MOB ?? []).filter(id => !routen.includes(id));
if (unbekannt.length) { console.error(`Unbekannte Routen: ${unbekannt.join(', ')}`); process.exit(2); }
const modi = [
  { name: 'desk', viewport: { width: 1440, height: 900 }, scheme: 'light', routen: anteil(routen) },
  { name: 'mob', viewport: { width: 390, height: 844 }, scheme: 'light', routen: anteil(ROUTEN_MOB ? [...new Set([...DUNKEL, ...ROUTEN_MOB])] : routen), mobil: true },
  { name: 'desk-dunkel', viewport: { width: 1440, height: 900 }, scheme: 'dark', routen: DUNKEL },
].filter(m => !MODI || MODI.includes(m.name));
for (const m of modi) console.log(`${m.name}: ${m.routen.length} Routen`);
for (const m of modi) {
  const ctx = await browser.newContext({ viewport: m.viewport, colorScheme: m.scheme, isMobile: !!m.mobil, hasTouch: !!m.mobil });
  await ctx.addInitScript(s => { try { localStorage.setItem('theme', s); } catch { /* ignorieren */ } }, m.scheme);
  const page = await ctx.newPage();
  for (const id of m.routen) {
    await page.goto('about:blank');
    await page.goto(seitenUrl(BASIS, id), { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const v = {};
    for (const x of r.violations) if (x.impact === 'critical' || x.impact === 'serious') v[x.id] = x.nodes.length;
    ergebnis[`${m.name}:${id}`] = v;
  }
  await ctx.close();
}
await browser.close();

const summe = {};
let gesamt = 0;
for (const v of Object.values(ergebnis)) for (const [k, n] of Object.entries(v)) { summe[k] = (summe[k] || 0) + n; gesamt += n; }
const seitenMit = Object.values(ergebnis).filter(v => Object.keys(v).length).length;
console.log(`${Object.keys(ergebnis).length} Prüfungen, ${seitenMit} mit Verstößen, ${gesamt} betroffene Elemente`);
console.log(Object.entries(summe).sort((a, b) => b[1] - a[1]).map(([k, n]) => `  ${k}: ${n}`).join('\n'));

if (arg('--schreiben')) fs.writeFileSync(BASELINE, JSON.stringify({ stand: new Date().toISOString().slice(0, 10), summe, ergebnis }, null, 1) + '\n');
if (arg('--vergleich')) {
  const alt = JSON.parse(fs.readFileSync(BASELINE, 'utf8')).ergebnis;
  const schlechter = [];
  for (const [k, v] of Object.entries(ergebnis)) for (const [id, n] of Object.entries(v)) if (n > ((alt[k] || {})[id] || 0)) schlechter.push(`${k} ${id}: ${(alt[k] || {})[id] || 0} → ${n}`);
  if (schlechter.length) { console.error('Neue Verstöße:\n' + schlechter.join('\n')); process.exit(1); }
  console.log('Keine neuen Verstöße gegenüber der Baseline.');
}
