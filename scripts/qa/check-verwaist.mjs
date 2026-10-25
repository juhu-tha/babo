#!/usr/bin/env node
/**
 * Verwaiste Dateien (Umsetzungsplan Phase 5, AP 5.7)
 * Baut einen einfachen statischen Importgraphen ab src/main.tsx (import/export … from, import('…'),
 * React.lazy, Alias @/ → Projektwurzel, Seiteneffekt-Importe wie CSS) und listet Dateien unter src/,
 * die nicht erreichbar sind. Dateien, die nur von tests/ oder scripts/ genutzt werden, gelten nicht
 * als verwaist (eigene Liste).
 *   node scripts/qa/check-verwaist.mjs [--strict]   (--strict: Exit 1, wenn neue verwaiste Dateien)
 * Grenzen: dynamische Pfade (import(`./${x}`)), import.meta.glob und Verweise aus HTML/public/ werden
 * nicht erkannt – vor dem Löschen immer mit grep gegenprüfen.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const SRC = path.join(ROOT, 'src');
const EXT = ['', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '/index.ts', '/index.tsx', '/index.js'];
const CODE = /\.(tsx?|jsx?|mjs|cjs)$/;
// Bewusst behaltene, nicht importierte Dateien (Begründung in docs/architektur.md)
const ERLAUBT = new Set([
  'src/vite-env.d.ts',
]);

const alleDateien = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? alleDateien(p) : [p];
});

function aufloesen(von, spec) {
  let basis;
  if (spec.startsWith('@/')) basis = path.join(ROOT, spec.slice(2));
  else if (spec.startsWith('.')) basis = path.resolve(path.dirname(von), spec);
  else return null; // Paket
  basis = basis.replace(/\?.*$/, '');
  for (const e of EXT) {
    const p = basis + e;
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  }
  return null;
}

const RE = [
  /\bimport\s+(?:type\s+)?[\w${}\s,*]*?\s*from\s*['"]([^'"]+)['"]/g,
  /\bexport\s+(?:type\s+)?[\w${}\s,*]*?\s*from\s*['"]([^'"]+)['"]/g,
  /\bimport\s*['"]([^'"]+)['"]/g,
  /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
  /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g,
  /\burl\(\s*['"]?(\.{1,2}\/[^'")]+)['"]?\s*\)/g, // CSS
];

function graph(starts) {
  const besucht = new Set();
  const offen = [...starts];
  while (offen.length) {
    const f = offen.pop();
    if (besucht.has(f)) continue;
    besucht.add(f);
    if (!CODE.test(f) && !f.endsWith('.css')) continue;
    const code = fs.readFileSync(f, 'utf8');
    for (const re of RE) for (const m of code.matchAll(re)) {
      const z = aufloesen(f, m[1]);
      if (z && !besucht.has(z)) offen.push(z);
    }
  }
  return besucht;
}

const rel = p => path.relative(ROOT, p).split(path.sep).join('/');
const app = graph([path.join(SRC, 'main.tsx')]);
const extra = [path.join(ROOT, 'tests'), path.join(ROOT, 'scripts')]
  .filter(d => fs.existsSync(d))
  .flatMap(alleDateien)
  .filter(f => CODE.test(f) && !rel(f).startsWith('scripts/archiv/'));
const nebenbei = graph(extra);

// Dateien unter src/, die von Skripten/Tests per Pfad gelesen werden (readFileSync('src/…'))
const perPfad = new Set();
for (const f of extra) {
  const code = fs.readFileSync(f, 'utf8');
  for (const m of code.matchAll(/['"`](src\/[\w./-]+\.\w+)['"`]/g)) perPfad.add(m[1]);
}

const src = alleDateien(SRC).filter(f => !rel(f).includes('/__') && !f.endsWith('.DS_Store'));
const verwaist = [], nurTests = [];
for (const f of src) {
  const r = rel(f);
  if (app.has(f) || ERLAUBT.has(r)) continue;
  if (r.endsWith('.d.ts')) continue;
  if (nebenbei.has(f) || perPfad.has(r)) nurTests.push(r);
  else verwaist.push(r);
}

console.log(`Importgraph ab src/main.tsx: ${app.size} Dateien erreichbar, ${src.length} Dateien unter src/`);
console.log(`Nur von tests/ oder scripts/ genutzt (${nurTests.length}):`);
for (const r of nurTests.sort()) console.log(`  ${r}`);
console.log(`Verwaist (${verwaist.length}):`);
for (const r of verwaist.sort()) console.log(`  ${r}`);
if (process.argv.includes('--strict') && verwaist.length) process.exit(1);
