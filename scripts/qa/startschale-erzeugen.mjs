#!/usr/bin/env node
/**
 * Startseiten-Schale neu erzeugen (Umsetzungsplan Phase 5, AP 5.5 Nachtrag).
 * Liest die von React gerenderte Startseite (frischer Browserkontext, 1280 × 900) und schreibt den sichtbaren
 * Anfang – Rahmen (Seitenleiste ohne Menüeinträge, Kopfzeile) und Begrüßungskarte bis zur Versionszeile – nach
 * scripts/startschale.html. Das Vite-Plugin scripts/startSchale.ts setzt sie beim Build in <div id="root">.
 * Nach Änderungen an Rahmen oder Begrüßung in App.tsx/Startseite.tsx neu erzeugen; tests/startSchale.test.ts
 * prüft, dass Texte und Klassen der Schale noch im Quelltext vorkommen.
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
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' })).newPage();
await page.goto(BASIS, { waitUntil: 'networkidle' });
await page.waitForSelector('main h2');
const html = await page.evaluate(() => {
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
await browser.close();
const schale = html.replace(/Version v[\d.]+ \([\d.]+\)/, 'Version %BB_VERSION%');
if (!schale.includes('%BB_VERSION%')) { console.error('Versionszeile nicht gefunden'); process.exit(1); }
const datei = path.join(ROOT, 'scripts/startschale.html');
fs.writeFileSync(datei, schale + '\n');
console.log(`${path.relative(ROOT, datei)}: ${schale.length} Zeichen`);
