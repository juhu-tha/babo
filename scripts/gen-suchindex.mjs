#!/usr/bin/env node
/**
 * Erzeugt public/suchindex.json für die Volltextsuche (Umsetzungsplan Phase 2, AP 2.9).
 * Rendert jede Modulroute im Browser und speichert Überschriften und Fließtext-Wörter.
 *   node scripts/gen-suchindex.mjs [--basis URL]       (gebaute App muss laufen)
 * Voraussetzung: npm i --no-save playwright
 */
import fs from 'fs';
import path from 'path';
const { chromium } = await import('playwright');
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const i = process.argv.indexOf('--basis');
const BASIS = i > 0 ? process.argv[i + 1] : 'http://localhost:4173/';
const reg = fs.readFileSync(path.join(ROOT, 'src/registry/modules.ts'), 'utf8');
const teil = reg.slice(reg.indexOf('export const MODULE = ['), reg.indexOf('] as const satisfies readonly ModulEintrag[]'));
const routen = [...teil.matchAll(/^ {2}\{ id: '([a-z0-9_-]+)'/gm)].map(m => m[1]).filter(id => !id.startsWith('divider_') && !['admin', 'impressum', 'datenschutz', 'barrierefreiheit', 'versionen'].includes(id));
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
  if (!d) continue;
  const woerter = [...new Set((d.text.toLowerCase().match(/[a-zäöüß0-9][a-zäöüß0-9-]{2,}/g) || []))].filter(w => !/^\d+$/.test(w));
  index.push({ id, h: d.ueberschriften, w: woerter.join(' ') }); // ohne Volltext: Index bleibt < 1 MB
}
await b.close();
fs.writeFileSync(path.join(ROOT, 'public/suchindex.json'), JSON.stringify({ stand: new Date().toISOString().slice(0, 10), module: index }));
const groesse = fs.statSync(path.join(ROOT, 'public/suchindex.json')).size;
console.log(`suchindex.json: ${index.length} Module, ${(groesse / 1024).toFixed(0)} kB`);
