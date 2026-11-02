// Routen mit Rechenkern (Prüfung „Kein Ergebnis in der Anzeige“, 02.11.2026): alle Module vom Typ 'calculator'
// der Registry und alle Module, deren Komponente (transitiv über statische und lazy-Importe) einen Rechenkern aus
// src/calc/ oder src/utils/{bestandKern,ec2Spannbeton,rheologySim,schadensKern} einbindet.
//   node scripts/qa/rechner-routen.mjs            → kommagetrennte Liste
//   node scripts/qa/rechner-routen.mjs --tabelle  → id, Typ, Kerne
import fs from 'node:fs'; import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const KERN = /\/src\/calc\/|\/src\/utils\/(bestandKern|ec2Spannbeton|rheologySim|schadensKern)\.ts$/;

function aufloesen(von, spec) {
  let basis;
  if (spec.startsWith('@/')) basis = path.join(ROOT, spec.slice(2));
  else if (spec.startsWith('.')) basis = path.resolve(path.dirname(von), spec);
  else return null;
  for (const k of ['', '.ts', '.tsx', '/index.ts', '/index.tsx']) if (fs.existsSync(basis + k) && fs.statSync(basis + k).isFile()) return basis + k;
  return null;
}
const importe = new Map();
function importeVon(f) {
  if (importe.has(f)) return importe.get(f);
  const s = fs.readFileSync(f, 'utf8');
  const l = [...s.matchAll(/(?:from\s+|import\s*\(\s*)['"]([^'"]+)['"]/g)].map((m) => aufloesen(f, m[1])).filter(Boolean);
  importe.set(f, l); return l;
}
function kerneVon(start) {
  const gesehen = new Set(); const kerne = new Set(); const stapel = [start];
  while (stapel.length) {
    const f = stapel.pop(); if (gesehen.has(f)) continue; gesehen.add(f);
    if (KERN.test(f)) { kerne.add(path.relative(ROOT, f)); continue; }
    // Registry, Routing und gemeinsame Kontexte nicht durchlaufen (sonst hängt jedes Modul an allen)
    if (/\/src\/(registry|routing|contexts)\//.test(f) && f !== start) continue;
    for (const i of importeVon(f)) stapel.push(i);
  }
  return [...kerne].sort();
}

export function rechnerRouten() {
  const reg = fs.readFileSync(path.join(ROOT, 'src/registry/modules.ts'), 'utf8');
  const teil = reg.slice(reg.indexOf('export const MODULE = ['), reg.indexOf('] as const satisfies readonly ModulEintrag[]'));
  const typ = new Map();
  for (const m of teil.matchAll(/^ {2}\{ id: '([a-z0-9_-]+)'[\s\S]*?(?=^ {2}\{ id: |$(?![\s\S]))/gm)) {
    const t = m[0].match(/typ: '([a-z]+)'/); typ.set(m[1], t ? t[1] : '');
  }
  const mi = path.join(ROOT, 'src/routing/ModulInhalt.tsx');
  const src = fs.readFileSync(mi, 'utf8');
  const komp = new Map([...src.matchAll(/const (\w+) = React\.lazy\(\(\) => import\('([^']+)'\)/g)].map((m) => [m[1], aufloesen(mi, m[2])]));
  const aus = [];
  const paare = [...src.matchAll(/activeTab === '([a-z0-9_-]+)' && <(\w+)/g)].map((m) => [m[1], m[2]]);
  // Sammelzeilen: {(activeTab === 'a' || activeTab === 'b') && ( <Komponente …
  for (const m of src.matchAll(/\{\(((?:\(?activeTab(?: as string\))? === '[a-z0-9_-]+'\)?\s*(?:\|\|\s*)?)+)\)\s*&&\s*\(?\s*<(\w+)/g)) {
    for (const i of m[1].matchAll(/'([a-z0-9_-]+)'/g)) paare.push([i[1], m[2]]);
  }
  for (const [id, k] of paare) {
    const f = komp.get(k); if (!f || id === 'admin') continue;
    const kerne = kerneVon(f);
    if (typ.get(id) === 'calculator' || kerne.length) aus.push({ id, typ: typ.get(id) ?? '', kerne });
  }
  // doppelte IDs (mehrere Zeilen) zusammenfassen
  const m = new Map(); for (const a of aus) if (!m.has(a.id)) m.set(a.id, a);
  return [...m.values()];
}

if (process.argv[1]?.endsWith('rechner-routen.mjs')) {
  const r = rechnerRouten();
  if (process.argv.includes('--tabelle')) for (const x of r) console.log(`${x.id}\t${x.typ}\t${x.kerne.map((k) => path.basename(k, '.ts')).join(', ')}`);
  else console.log(r.map((x) => x.id).join(','));
  console.error(`${r.length} Routen (${r.filter((x) => x.typ === 'calculator').length} vom Typ calculator)`);
}
