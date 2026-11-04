#!/usr/bin/env node
/**
 * Bundle-Budget (Umsetzungsplan Phase 5, AP 5.4)
 * Liest dist/ nach `npm run build`, prüft die Vollständigkeit (dist/server.cjs – nicht im Statik-Modus –,
 * dist/modul/routen.json; sonst Exit 1)
 * und die gzip-Größen:
 *   - Einstiegs-Chunk (das <script type="module"> in dist/index.html) samt statisch importierter Chunks
 *   - größter JS-Chunk; jeder Chunk ≤ GRENZE_CHUNK (ohne Ausnahmen)
 * Die Grenzen sind eine Ratsche auf den erreichten Werten (+ kleiner Puffer): sinkt ein Wert dauerhaft,
 * die Grenze nachziehen; steigt er, ist das ein Befund (lazy laden statt Grenze anheben).
 *   node scripts/qa/check-bundle.mjs [--dist dist] [--top 10] [--statisch]
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
// TBT 04.11.2026: Einstieg in „app“ (React, ReactDOM, Kontexte) und „rahmen“ (App.tsx, per import()) geteilt, damit
// das Auswerten zwei Tasks statt einer langen braucht (TBT Modulseiten −80–100 ms). Gleicher Code, aber zwei
// getrennt komprimierte Dateien: 107,9 → 109,2 kB gzip. Grenze 108 → 110 kB (Puffer wie bisher ≈ 1 kB).
const GRENZE_EINSTIEG = 110;
const GRENZE_CHUNK = 300;
// LCP 02.11.2026: Erstpfad je vorgerenderter Modulseite (Summe der vorgeladenen JS-Chunks ohne Einstieg, gzip -9).
// Vorher max. 235,2 kB (Lebenszykluskosten mit jsPDF), nachher 217,5 kB (KI-Module, Chunk KiBaustoffe); Grenze mit Puffer.
const GRENZE_ERSTPFAD = 225;
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

// Vollständigkeit des Builds (Gutachten 27.10.2026 abends, Nr. 4): Bricht `npm run build` nach dem Client-Build ab
// (z. B. Speicher, rc 137), fehlen Vorrendern und Server – das Budget allein würde trotzdem „OK“ melden.
// Statik-Modus (Vercel, docs/betrieb-vercel.md): BB_STATISCH=1, --statisch oder dist/404.html (nur der buildCommand
// in vercel.json legt sie an, nach dem vollständigen Build). Dort wird server.cjs bewusst gelöscht und nicht verlangt.
const STATISCH = process.env.BB_STATISCH === '1' || process.argv.includes('--statisch') || fs.existsSync(path.join(DIST, '404.html'));
const PFLICHT = [
  ...(STATISCH ? [] : [['server.cjs', 'Server-Bundle (esbuild-Schritt von npm run build)']]),
  ['modul/routen.json', 'Routenliste des Vorrenderns (scripts/vorrendern.ts)'],
];
const fehlend = PFLICHT.filter(([f]) => !fs.existsSync(path.join(DIST, f)));
for (const [f, was] of fehlend) console.error(`FAIL: ${path.relative(ROOT, DIST)}/${f} fehlt – ${was}; Build unvollständig`);
if (fehlend.length) process.exit(1);
try {
  const routen = JSON.parse(fs.readFileSync(path.join(DIST, 'modul/routen.json'), 'utf8'));
  if (!Array.isArray(routen?.ids) || routen.ids.length === 0) throw new Error('keine Modul-IDs');
  console.log(`Build vollständig${STATISCH ? ' (Statik-Modus, ohne server.cjs)' : ''}: ${STATISCH ? '' : 'server.cjs, '}modul/routen.json (${routen.ids.length} Modulseiten)`);
} catch (e) {
  console.error(`FAIL: dist/modul/routen.json unbrauchbar (${e instanceof Error ? e.message : e})`);
  process.exit(1);
}

const gz = datei => zlib.gzipSync(fs.readFileSync(datei), { level: 9 }).length;
const kb = n => (n / KB).toFixed(1).replace('.', ',');
const basis = name => name.replace(/-[A-Za-z0-9_-]{8}\.js$/, '');

const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const einstiegSrc = [...html.matchAll(/<script[^>]*type="module"[^>]*src="([^"]+)"/g)].map(m => m[1]).find(s => s.includes('/assets/'));
if (!einstiegSrc) { console.error('check-bundle: kein Einstiegs-Chunk in dist/index.html gefunden'); process.exit(2); }
const einstieg = path.basename(einstiegSrc);

// statische Importe des Einstiegs (werden beim ersten Aufruf sofort geladen). Der Rahmen der App (Chunk „rahmen“,
// src/main.tsx lädt App.tsx per import() – eigene Task beim Auswerten, TBT 04.11.2026) war bis dahin Teil des
// Einstiegs und wird auf jeder Seite sofort mitgeladen: zählt weiter zum Einstieg, nicht zum Erstpfad.
const rahmen = fs.readdirSync(ASSETS).filter(f => /^rahmen-[A-Za-z0-9_-]{8}\.js$/.test(f));
const statisch = new Set([einstieg, ...rahmen]);
const offen = [einstieg, ...rahmen];
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
console.log(`  Einstieg ${einstieg}${rahmen.length ? ` + ${rahmen.join(", ")}` : ''}${statisch.size > 1 + rahmen.length ? ` + ${statisch.size - 1 - rahmen.length} statische Importe` : ''}: ${kb(einstiegGz)} kB gzip (Grenze ${String(GRENZE_EINSTIEG).replace(".", ",")} kB)`);
for (const c of css) console.log(`  CSS ${c.f}: ${kb(c.gz)} kB gzip`);
console.log(`  größter Chunk: ${groesster.f} ${kb(groesster.gz)} kB gzip; ohne Ausnahmen: ${groessterOhneAusnahme?.f} ${kb(groessterOhneAusnahme?.gz ?? 0)} kB (Grenze ${GRENZE_CHUNK} kB)`);
console.log(`  Top ${TOP}:`);
for (const c of chunks.slice(0, TOP)) console.log(`    ${kb(c.gz).padStart(7)} kB gz  ${kb(c.roh).padStart(8)} kB roh  ${c.f}`);

// selbst gehostete Schriften (nur Bericht)
const schriften = [];
const sammle = dir => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) sammle(p); else if (/\.(woff2?|ttf|otf|eot)$/i.test(e.name)) schriften.push({ p, n: fs.statSync(p).size }); } };
sammle(DIST);
if (schriften.length) console.log(`  Schriften: ${schriften.length} Dateien, ${kb(schriften.reduce((s, x) => s + x.n, 0))} kB`);

// Erstpfad der vorgerenderten Modulseiten (LCP 02.11.2026, docs/pruefung/lcp-module-2026-11-02.md): was die
// Vorlade-Karte je Seite sofort anfordert (ohne Einstieg). Schwere Bibliotheken nur bei Bedarf (Export, 3D, Excel).
const ERSTPFAD_VERBOTEN = ['jspdf.es.min', 'html2canvas.esm', 'xlsx', 'shapes', 'QuizDashboard'];
const gzCache = new Map();
const gzAsset = f => { if (!gzCache.has(f)) gzCache.set(f, fs.existsSync(path.join(ASSETS, f)) ? gz(path.join(ASSETS, f)) : 0); return gzCache.get(f); };
const erstpfad = [];
const modulDir = path.join(DIST, 'modul');
for (const datei of fs.readdirSync(modulDir).filter(f => f.endsWith('.html'))) {
  const id = datei.slice(0, -5);
  const m = /<script type="application\/json" id="modul-vorladen">([\s\S]*?)<\/script>/.exec(fs.readFileSync(path.join(modulDir, datei), 'utf8'));
  if (!m) continue;
  const k = JSON.parse(m[1]);
  const hat = (o, s) => Object.prototype.hasOwnProperty.call(o, s);
  const c = hat(k.t, id) ? k.t[id] : k.p.find(([p]) => id.startsWith(p))?.[1];
  const dateien = [...new Set([...k.i, ...k.k, ...(c === undefined ? [] : k.c[c]), ...(hat(k.h, id) ? [k.h[id]] : [])].map(i => k.d[i]).filter(f => f.endsWith('.js') && !statisch.has(f)))];
  erstpfad.push({ id, gz: dateien.reduce((s, f) => s + gzAsset(f), 0), verboten: dateien.filter(f => ERSTPFAD_VERBOTEN.includes(basis(f))) });
}
erstpfad.sort((a, b) => b.gz - a.gz);
if (erstpfad.length) console.log(`  Erstpfad Modulseiten (Vorlade-Karte, ohne Einstieg): max. ${erstpfad[0].id} ${kb(erstpfad[0].gz)} kB gzip (Grenze ${GRENZE_ERSTPFAD} kB), Median ${kb(erstpfad[Math.floor(erstpfad.length / 2)].gz)} kB`);

const fehler = [];
for (const e of erstpfad) {
  if (e.verboten.length) fehler.push(`Modulseite ${e.id} lädt ${e.verboten.join(', ')} im Erstpfad vor (nur bei Bedarf per import() laden)`);
  if (e.gz > GRENZE_ERSTPFAD * KB) fehler.push(`Erstpfad ${e.id} ${kb(e.gz)} kB > ${GRENZE_ERSTPFAD} kB`);
}
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
