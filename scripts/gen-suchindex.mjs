#!/usr/bin/env node
/**
 * Erzeugt public/suchindex.json für die Volltextsuche (Umsetzungsplan Phase 2, AP 2.9).
 * Rendert jede Modulroute im Browser und speichert Überschriften und Fließtext-Wörter.
 *   node scripts/gen-suchindex.mjs [--basis URL]       (gebaute App muss laufen)
 * Voraussetzung: npm i --no-save playwright (oder NODE_PATH auf ein playwright-Paket)
 * tests/suchindexAktuell.test.ts schlägt fehl, wenn die Registry Module enthält, die im Index fehlen.
 */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { suchindexRouten } from './suchindex-routen.mjs';
// lokal installiert (npm i --no-save) oder über NODE_PATH (createRequire beachtet NODE_PATH, import() nicht)
const lade = async n => { try { return await import(n); } catch { return createRequire(import.meta.url)(n); } };
const { chromium } = await lade('playwright');
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const i = process.argv.indexOf('--basis');
const BASIS = i > 0 ? process.argv[i + 1] : 'http://localhost:4173/';
const routen = suchindexRouten();
const leer = [];
const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const b = await chromium.launch(exe ? { executablePath: exe } : {});
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const index = [];
for (const id of routen) {
  await p.goto('about:blank');
  await p.goto(`${BASIS}#${id}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(200);
  const d = await p.evaluate(() => {
    const root = document.getElementById('module-content');
    if (!root) return null;
    const k = root.cloneNode(true);
    k.querySelectorAll('script, style, svg, [aria-hidden="true"], button, select, input').forEach(n => n.remove());
    const ueberschriften = [...k.querySelectorAll('h2, h3, h4')].map(h => h.textContent.replace(/\s+/g, ' ').trim()).filter(t => t.length > 2).slice(0, 40);
    const text = k.textContent.replace(/\s+/g, ' ').trim();
    return { ueberschriften, text };
  });
  if (!d) { leer.push(id); continue; }
  const woerter = [...new Set((d.text.toLowerCase().match(/[a-zäöüß0-9][a-zäöüß0-9-]{2,}/g) || []))].filter(w => !/^\d+$/.test(w));
  index.push({ id, h: d.ueberschriften, w: woerter.join(' ') }); // ohne Volltext: Index bleibt bei rund 1 MB (gzip ~ 300 kB), wird erst beim Suchen geladen
}
await b.close();
// Fehlende Module ließen tests/suchindexAktuell.test.ts scheitern – lieber hier abbrechen
if (leer.length) { console.error(`Kein #module-content gerendert: ${leer.join(', ')}`); process.exit(1); }
fs.writeFileSync(path.join(ROOT, 'public/suchindex.json'), JSON.stringify({ stand: new Date().toISOString().slice(0, 10), module: index }));
const groesse = fs.statSync(path.join(ROOT, 'public/suchindex.json')).size;
console.log(`suchindex.json: ${index.length} Module, ${(groesse / 1024).toFixed(0)} kB`);
