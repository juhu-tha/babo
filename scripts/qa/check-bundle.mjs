#!/usr/bin/env node
/**
 * Bundle-Budget (Umsetzungsplan Phase 5, AP 5.4)
 * Liest dist/ nach `npm run build` und prüft die gzip-Größen:
 *   - Einstiegs-Chunk (das <script type="module"> in dist/index.html) samt statisch importierter Chunks
 *   - größter JS-Chunk; jeder Chunk ≤ GRENZE_CHUNK (ohne Ausnahmen)
 * Die Grenzen sind eine Ratsche auf den erreichten Werten (+ kleiner Puffer): sinkt ein Wert dauerhaft,
 * die Grenze nachziehen; steigt er, ist das ein Befund (lazy laden statt Grenze anheben).
 *   node scripts/qa/check-bundle.mjs [--dist dist] [--top 10]
 */
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const KB = 1024;
// Ratsche (gzip -9, kB) – Stand Phase 5: Einstieg 138,9 kB (vorher 638,6), größter Chunk
// 247,7 kB (three.js/drei, nur Holz/Mauerwerk 3D). Der Fragenpool (früher quizData 382 kB) wird seit
// AP 5.4 je Modul (≤ 5 kB) bzw. in 4 Teilpaketen (≤ 100 kB) geladen (Vite-Plugin scripts/quizPool.ts).
// AP 5.5: Einstieg (Chunk „app“) 138,7 kB; Modulkopf-Daten je Modul (virtual:modul-kopf), KaTeX (77 kB) und
// Chart.js (70 kB) nur bei Bedarf, gemeinsame Modulbausteine in „modul-basis“ (~38 kB), Icons in „icons“ (~14 kB).
// AP 5.5 Nachtrag: Einstieg 135,8 → 103,2 kB (Stand main nach #138) – Registry nur als Auszug
// (scripts/registryKern.ts), Meta-Beschreibungen und Suchbegriffe bei Bedarf. Grenze mit ~5 kB Puffer für
// anstehende Registry-Einträge (je Modul ≈ 20 Byte gzip im Auszug).
const GRENZE_EINSTIEG = 108;
const GRENZE_CHUNK = 300;
// Ausnahmen mit eigener Ratsche (Basisname des Chunks → kB); derzeit keine.
const AUSNAHMEN = {};

const ai = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const DIST = path.resolve(ROOT, ai('--dist') ?? 'dist');
const TOP = Number(ai('--top') ?? 10);
const ASSETS = path.join(DIST, 'assets');

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error(`check-bundle: ${path.relative(ROOT, DIST)}/index.html fehlt – erst \`npm run build\` ausführen.`);
  process.exit(2);
}

const gz = datei => zlib.gzipSync(fs.readFileSync(datei), { level: 9 }).length;
const kb = n => (n / KB).toFixed(1).replace('.', ',');
const basis = name => name.replace(/-[A-Za-z0-9_-]{8}\.js$/, '');

const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const einstiegSrc = [...html.matchAll(/<script[^>]*type="module"[^>]*src="([^"]+)"/g)].map(m => m[1]).find(s => s.includes('/assets/'));
if (!einstiegSrc) { console.error('check-bundle: kein Einstiegs-Chunk in dist/index.html gefunden'); process.exit(2); }
const einstieg = path.basename(einstiegSrc);

// statische Importe des Einstiegs (werden beim ersten Aufruf sofort geladen)
const statisch = new Set([einstieg]);
const offen = [einstieg];
while (offen.length) {
  const code = fs.readFileSync(path.join(ASSETS, offen.pop()), 'utf8');
  for (const m of code.matchAll(/(?:^|[;}\n])\s*import\s*(?:[\w${},\s*]+from\s*)?["']\.\/([^"']+\.js)["']/g)) {
    if (!statisch.has(m[1])) { statisch.add(m[1]); offen.push(m[1]); }
  }
}

const chunks = fs.readdirSync(ASSETS).filter(f => f.endsWith('.js')).map(f => ({ f, roh: fs.statSync(path.join(ASSETS, f)).size, gz: gz(path.join(ASSETS, f)) }));
chunks.sort((a, b) => b.gz - a.gz);
const css = fs.readdirSync(ASSETS).filter(f => f.endsWith('.css')).map(f => ({ f, gz: gz(path.join(ASSETS, f)) }));
const einstiegGz = chunks.filter(c => statisch.has(c.f)).reduce((s, c) => s + c.gz, 0);
const groesster = chunks[0];
const groessterOhneAusnahme = chunks.find(c => !(basis(c.f) in AUSNAHMEN));

console.log(`Bundle (${chunks.length} JS-Chunks, gesamt ${kb(chunks.reduce((s, c) => s + c.gz, 0))} kB gzip)`);
console.log(`  Einstieg ${einstieg}${statisch.size > 1 ? ` + ${statisch.size - 1} statische Importe` : ''}: ${kb(einstiegGz)} kB gzip (Grenze ${String(GRENZE_EINSTIEG).replace(".", ",")} kB)`);
for (const c of css) console.log(`  CSS ${c.f}: ${kb(c.gz)} kB gzip`);
console.log(`  größter Chunk: ${groesster.f} ${kb(groesster.gz)} kB gzip; ohne Ausnahmen: ${groessterOhneAusnahme?.f} ${kb(groessterOhneAusnahme?.gz ?? 0)} kB (Grenze ${GRENZE_CHUNK} kB)`);
console.log(`  Top ${TOP}:`);
for (const c of chunks.slice(0, TOP)) console.log(`    ${kb(c.gz).padStart(7)} kB gz  ${kb(c.roh).padStart(8)} kB roh  ${c.f}`);

// selbst gehostete Schriften (nur Bericht)
const schriften = [];
const sammle = dir => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) sammle(p); else if (/\.(woff2?|ttf|otf|eot)$/i.test(e.name)) schriften.push({ p, n: fs.statSync(p).size }); } };
sammle(DIST);
if (schriften.length) console.log(`  Schriften: ${schriften.length} Dateien, ${kb(schriften.reduce((s, x) => s + x.n, 0))} kB`);

const fehler = [];
if (einstiegGz > GRENZE_EINSTIEG * KB) fehler.push(`Einstieg ${kb(einstiegGz)} kB > ${String(GRENZE_EINSTIEG).replace(".", ",")} kB`);
for (const c of chunks) {
  const grenze = AUSNAHMEN[basis(c.f)] ?? GRENZE_CHUNK;
  if (c.gz > grenze * KB) fehler.push(`${c.f} ${kb(c.gz)} kB > ${grenze} kB`);
}
if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  console.error('→ große Teile per React.lazy/import() nachladen statt die Grenze anzuheben (docs/architektur.md).');
  process.exit(1);
}
console.log('OK: Bundle-Budget eingehalten');
