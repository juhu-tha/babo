#!/usr/bin/env node
/**
 * E2E-Smoke je Meta-Cluster (Umsetzungsplan Phase 5, AP 5.6)
 *
 * Öffnet je Meta-Cluster I–VI eine repräsentative Route im gebauten Frontend und prüft:
 *   – genau eine Hauptüberschrift (h1) mit dem Modulnamen („… – BaustoffBoard“, nicht die Startseite),
 *   – keine Seitenfehler (pageerror, d. h. nicht abgefangene Ausnahmen),
 *   – Lernziele-Kopf (section[aria-label="Lernziele"]) und Modul-Selbsttest (im Modul oder über MODULTEST_IN_APP).
 *
 *   npm run build                       # bzw. vorhandenes dist/
 *   npx vite preview --port 4207 --strictPort &
 *   node scripts/qa/e2e-smoke.mjs [--basis http://localhost:4207/]
 *
 * Playwright ist bewusst keine Projektabhängigkeit: Das Skript nutzt ein lokal (npm i --no-save playwright)
 * oder global (npm i -g playwright) installiertes Playwright. Chromium: $CHROMIUM_PATH, sonst
 * /opt/pw-browsers/chromium, sonst der Playwright-eigene Browser.
 * Exit-Code 1, sobald eine Route eine Prüfung nicht besteht.
 */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { execSync } from 'child_process';

async function ladePlaywright() {
  try { return await import('playwright'); } catch { /* nicht lokal installiert → global versuchen */ }
  const global = execSync('npm root -g', { encoding: 'utf8' }).trim();
  return createRequire(path.join(global, 'noop.js'))('playwright');
}
const { chromium } = await ladePlaywright();

const basisIdx = process.argv.indexOf('--basis');
const BASIS = basisIdx > 0 ? process.argv[basisIdx + 1] : 'http://localhost:4207/';
const START_H1 = 'BaustoffBoard – Lern- und Wissensplattform der TH Augsburg';

/** Eine Route je Meta-Cluster; selbsttest: Route zeigt <ModulTest> (im Modul oder über MODULTEST_IN_APP in App.tsx) */
const ROUTEN = [
  { cluster: 'I', id: 'messen_pruefen', selbsttest: true },
  { cluster: 'II', id: 'keramik_ziegel', selbsttest: true },
  { cluster: 'III', id: 'bindemittel', selbsttest: true },
  { cluster: 'IV', id: 'kreislauf_dpp', selbsttest: true },
  { cluster: 'V', id: 'bim_baustoffe', selbsttest: true },
  { cluster: 'VI', id: 'rechnung_beton', selbsttest: true },
];

const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
let seitenfehler = [];
let konsolenfehler = [];
page.on('pageerror', e => seitenfehler.push(String(e.message || e).slice(0, 200)));
page.on('console', m => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) konsolenfehler.push(m.text().slice(0, 200)); });
// /api/* fehlt unter „vite preview“ (kein Express-Backend) – dort erwartete 404 nicht melden
page.on('response', a => { if (a.status() >= 400 && !new URL(a.url()).pathname.startsWith('/api/')) konsolenfehler.push(`HTTP ${a.status()} ${a.url().replace(BASIS, '/')}`); });

const ergebnisse = [];
for (const r of ROUTEN) {
  seitenfehler = []; konsolenfehler = [];
  const fehler = [];
  await page.goto('about:blank');
  await page.goto(`${BASIS}#${r.id}`, { waitUntil: 'networkidle' });
  const h1 = page.locator('h1');
  const h1Text = (await h1.count()) === 1 ? (await h1.first().textContent())?.trim() ?? '' : '';
  if ((await h1.count()) !== 1) fehler.push(`${await h1.count()} h1 statt 1`);
  else if (h1Text === START_H1 || !h1Text.endsWith('– BaustoffBoard')) fehler.push(`h1 „${h1Text}“ ist kein Modultitel`);
  try {
    await page.locator('section[aria-label="Lernziele"]').first().waitFor({ state: 'visible', timeout: 10000 });
  } catch { fehler.push('Lernziele fehlen'); }
  let selbsttest = false;
  try {
    // Kennung des Modul-Selbsttests (ModulTest) unabhängig vom Titel; „Selbsttest: N Fragen“ im Lernziele-Kopf zählt nicht
    await page.getByText('Stufe 4 des Lehrpfads').first().waitFor({ state: 'attached', timeout: r.selbsttest ? 10000 : 1500 });
    selbsttest = true;
  } catch { /* nicht vorhanden */ }
  if (r.selbsttest && !selbsttest) fehler.push('Selbsttest fehlt');
  await page.waitForTimeout(300);
  if (seitenfehler.length) fehler.push(`Seitenfehler: ${seitenfehler.join(' | ')}`);
  ergebnisse.push({ ...r, h1: h1Text, selbsttestGefunden: selbsttest, konsolenfehler: [...konsolenfehler], fehler });
}
await browser.close();

for (const e of ergebnisse) {
  const status = e.fehler.length ? 'FAIL' : 'ok  ';
  console.log(`${status} ${e.cluster.padEnd(3)} #${e.id.padEnd(16)} h1=„${e.h1}“ Selbsttest=${e.selbsttestGefunden ? 'ja' : 'nein'}${e.konsolenfehler.length ? ` Konsole: ${e.konsolenfehler.length} Fehler` : ''}`);
  for (const f of e.fehler) console.log(`     FAIL: ${f}`);
  for (const k of e.konsolenfehler) console.log(`     Konsole: ${k}`);
}
const n = ergebnisse.filter(e => e.fehler.length).length;
console.log(n ? `FAIL: ${n} von ${ergebnisse.length} Routen` : `OK: ${ergebnisse.length} Routen (Cluster I–VI)`);
process.exit(n ? 1 : 0);
