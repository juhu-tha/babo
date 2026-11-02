#!/usr/bin/env node
/**
 * Startseiten-Schale neu erzeugen (Umsetzungsplan Phase 5, AP 5.5 Nachtrag).
 * Liest die von React gerenderte Startseite (frischer Browserkontext, 1280 × 900) und schreibt den sichtbaren
 * Anfang – Rahmen (Seitenleiste ohne Menüeinträge, Kopfzeile) und Begrüßungskarte bis zur Versionszeile – nach
 * scripts/startschale.html. Das Vite-Plugin scripts/startSchale.ts setzt sie beim Build in <div id="root">.
 * Nach Änderungen an Rahmen oder Begrüßung in App.tsx/Startseite.tsx neu erzeugen; tests/startSchale.test.ts
 * prüft, dass Texte und Klassen der Schale noch im Quelltext vorkommen. Liest die Seite hell und dunkel und bricht ab,
 * wenn sich das Markup unterscheidet (die Schale steht auch im Dunkelmodus, scripts/startschale-boot.js); ebenso in
 * Standard- und Vollbreite (Seitenbreite als Klasse an <html>, 02.11.2026).
 *
 *   npm run build && NODE_ENV=production PORT=4206 node dist/server.cjs &
 *   node scripts/qa/startschale-erzeugen.mjs [--basis http://localhost:4206/]
 * Playwright ist keine Projektabhängigkeit (s. scripts/qa/perf-messung.mjs).
 */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { execSync } from 'child_process';

async function ladePlaywright() {
  try { return await import('playwright'); } catch { /* lokal nicht installiert → global */ }
  const global = execSync('npm root -g', { encoding: 'utf8' }).trim();
  return createRequire(path.join(global, 'noop.js'))('playwright');
}
const { chromium } = await ladePlaywright();
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const ai = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const BASIS = (ai('--basis') ?? 'http://localhost:4206/').replace(/\/?$/, '/');
const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
// hell und dunkel (Systemeinstellung) lesen: Die Schale steht seit 02.11.2026 auch im Dunkelmodus und muss dafür
// in beiden Darstellungen dasselbe Markup haben (Farben über dark:-Klassen; title/aria-label unsichtbar, ausgenommen)
const lies = async (colorScheme, breite) => {
const kontext = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE', colorScheme });
if (breite) await kontext.addInitScript(b => localStorage.setItem('baustoffboard_screen_width', b), breite);
const page = await kontext.newPage();
await page.goto(BASIS, { waitUntil: 'networkidle' });
await page.waitForSelector('main h2');
return page.evaluate(() => {
  const root = document.getElementById('root').cloneNode(true);
  // Menüeinträge (je Nutzer verschieden) weglassen, Rahmen behalten
  root.querySelector('aside nav').replaceChildren();
  // Begrüßungskarte bis zur Versionszeile; alles danach (Themen, Hinweise, Fußzeile) kommt mit React
  const karte = root.querySelector('main h2').parentElement;
  const version = [...karte.children].find(e => /Version v/.test(e.textContent || ''));
  while (version.nextElementSibling) version.nextElementSibling.remove();
  for (let e = karte; e && e.tagName !== 'MAIN'; e = e.parentElement) while (e.nextElementSibling) e.nextElementSibling.remove();
  root.querySelector('aside')?.removeAttribute('inert');
  return root.innerHTML;
});
};
const html = await lies('light');
const varianten = { dunkel: await lies('dark'), standard: await lies('light', 'standard'), voll: await lies('light', 'full') };
await browser.close();
const ohne = s => s.replace(/ (?:title|aria-label)="[^"]*"/g, '');
for (const [name, anders] of Object.entries(varianten)) {
  if (ohne(html) === ohne(anders)) continue;
  const a = ohne(html), b = ohne(anders);
  let i = 0; while (i < a.length && a[i] === b[i]) i++;
  console.error(`Schale hell/Breit und ${name} verschieden (ab Zeichen ${i}): …${a.slice(Math.max(0, i - 120), i + 80)}… / …${b.slice(Math.max(0, i - 120), i + 80)}…`);
  console.error('Komponente per Klasse an <html> (dark:, breite-standard:, breite-full:) statt nach Zustand umschalten (s. src/App.tsx).');
  process.exit(1);
}
// Druckzeilen (Datum, Version) ebenfalls als Platzhalter – scripts/startSchale.ts setzt sie beim Build
const schale = html.replace(/Version v[\d.]+ \([\d.]+\)/, 'Version %BB_VERSION%')
  .replace(/ · \d{2}\.\d{2}\.\d{4} · v[\d.]+</, ' · %BB_DATUM% · %BB_VNR%<')
  .replace(/(Datum|Date): [\d./]+</, '$1: %BB_DATUM%<');
if (!schale.includes('%BB_VERSION%')) { console.error('Versionszeile nicht gefunden'); process.exit(1); }
const datei = path.join(ROOT, 'scripts/startschale.html');
fs.writeFileSync(datei, schale + '\n');
console.log(`${path.relative(ROOT, datei)}: ${schale.length} Zeichen`);
