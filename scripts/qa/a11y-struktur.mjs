#!/usr/bin/env node
/**
 * Screenreader-Struktur (Stichprobe): prüft den Zugänglichkeitsbaum (Playwright ariaSnapshot) ausgewählter Routen.
 * Ergänzt die axe-Läufe (a11y.mjs, a11y-reiter.mjs) um Strukturregeln, die axe nicht oder nur teilweise abdeckt:
 *   – genau eine Überschrift der Ebene 1
 *   – Landmarken: genau ein main, mindestens ein navigation
 *   – jede Schaltfläche und jeder Link mit zugänglichem Namen
 *   – Reiter/Optionen: jede tablist/radiogroup mit Namen, darin mindestens ein Eintrag; jedes tabpanel mit Namen
 * Ersetzt keine manuelle Prüfung mit echtem Screenreader (BITV-Test).
 *
 *   node scripts/qa/a11y-struktur.mjs [--routen a,b] [--modi desk,mob] [--basis URL] [--details]
 *     ohne --routen: feste Stichprobe (STICHPROBE)
 * Voraussetzungen wie a11y.mjs: playwright (npm i --no-save oder NODE_PATH), gebaute App muss laufen.
 */
import fs from 'fs';
import { createRequire } from 'module';
import { seitenUrl } from './seitenUrl.mjs';

const lade = async n => { try { return await import(n); } catch { return createRequire(import.meta.url)(n); } };
const { chromium } = await lade('playwright');

const wert = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const BASIS = wert('--basis') ?? 'http://localhost:4173/';
const DETAILS = process.argv.includes('--details');
/** Stichprobe: Startseite, Module mit Reiterleisten, Optionsgruppen, Rechnern und Checklisten */
const STICHPROBE = ['start', 'zfp', 'beton_info', 'energieausweis', 'lebenszyklus_kosten', 'bestand_checklisten',
  'labor', 'fortbildungen', 'ki_ueberblick', 'rechnung_beton', 'stahl', 'feedback'];
const ROUTEN = (wert('--routen') ?? STICHPROBE.join(',')).split(',').filter(Boolean);
const MODI = (wert('--modi') ?? 'desk').split(',');
const ALLE = {
  desk: { viewport: { width: 1440, height: 900 } },
  mob: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
};

/** Zeilen eines ariaSnapshot (YAML) in {tiefe, rolle, name, attr} zerlegen */
export function knoten(yaml) {
  const out = [];
  for (const zeile of yaml.split('\n')) {
    const m = zeile.match(/^(\s*)- '?([a-z]+)(?: "((?:[^"\\]|\\.)*)")?((?: \[[^\]]*\])*)/);
    if (!m) continue;
    out.push({ tiefe: m[1].length / 2, rolle: m[2], name: (m[3] ?? '').trim(), attr: m[4] ?? '' });
  }
  return out;
}

/** Strukturregeln auf die Knotenliste anwenden; Rückgabe: Liste der Befunde */
export function befunde(k) {
  const f = [];
  const h1 = k.filter(n => n.rolle === 'heading' && /\[level=1\]/.test(n.attr));
  if (h1.length !== 1) f.push(`h1: ${h1.length} statt 1${h1.length ? ` (${h1.map(n => n.name).join(' | ').slice(0, 120)})` : ''}`);
  const main = k.filter(n => n.rolle === 'main').length;
  if (main !== 1) f.push(`main: ${main} statt 1`);
  if (!k.some(n => n.rolle === 'navigation')) f.push('navigation: keine');
  const ohne = k.filter(n => (n.rolle === 'button' || n.rolle === 'link') && !n.name);
  if (ohne.length) f.push(`${ohne.length} Schaltflächen/Links ohne Namen`);
  for (const rolle of ['tablist', 'radiogroup', 'tabpanel']) {
    const n = k.filter(x => x.rolle === rolle && !x.name).length;
    if (n) f.push(`${n}× ${rolle} ohne Namen`);
  }
  k.forEach((n, i) => {
    if (n.rolle !== 'tablist' && n.rolle !== 'radiogroup') return;
    const kind = n.rolle === 'tablist' ? 'tab' : 'radio';
    let hat = false;
    for (let j = i + 1; j < k.length && k[j].tiefe > n.tiefe; j++) if (k[j].rolle === kind) { hat = true; break; }
    if (!hat) f.push(`${n.rolle} „${n.name}“ ohne ${kind}`);
  });
  return f;
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(new URL(import.meta.url).pathname)) {
  const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const fehler = [];
  let n = 0;
  for (const modus of MODI) {
    const m = ALLE[modus];
    if (!m) { console.error(`Unbekannter Modus ${modus}`); process.exit(2); }
    const ctx = await browser.newContext(m);
    const page = await ctx.newPage();
    for (const id of ROUTEN) {
      await page.goto(seitenUrl(BASIS, id), { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      const yaml = await page.locator('body').ariaSnapshot();
      const k = knoten(yaml);
      const b = befunde(k);
      n++;
      const zeile = `${modus}:${id} – ${k.length} Knoten, ${k.filter(x => x.rolle === 'tablist').length} Reiterleisten, ${k.filter(x => x.rolle === 'radiogroup').length} Optionsgruppen`;
      if (b.length) {
        fehler.push(`${modus}:${id}: ${b.join('; ')}`);
        if (DETAILS) {
          const ohne = k.filter(x => (x.rolle === 'button' || x.rolle === 'link') && !x.name);
          if (ohne.length) fehler.push(`    unbenannt: ${ohne.map(x => x.rolle + x.attr).slice(0, 8).join(', ')}`);
        }
      }
      console.log(`${b.length ? 'FEHLER' : 'ok    '} ${zeile}`);
    }
    await ctx.close();
  }
  await browser.close();
  console.log(`${n} Seiten geprüft (${MODI.join(', ')})`);
  if (fehler.length) { console.error(fehler.join('\n')); process.exit(1); }
  console.log('0 Strukturbefunde.');
}
