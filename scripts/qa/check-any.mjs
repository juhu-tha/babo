// AP 5.1: Ratsche für explizite `any` in src/**/*.ts(x).
// Gezählt wird jedes `any`-Schlüsselwort in Typposition (SyntaxKind.AnyKeyword) per TS-Parser —
// also `: any`, `as any`, `<any>`, `any[]`, `Record<string, any>` usw.; Kommentare und Strings zählen nicht.
// Aufruf: node scripts/qa/check-any.mjs [--show]   → Exit 1, wenn die Zahl über SCHWELLE steigt.
import ts from 'typescript'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';

/** Ratsche (AP 5.1: 298 → 0). Nur nach unten anpassen; tests/anyRatsche.test.ts prüft dieselbe Zahl. */
export const SCHWELLE = 0;

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function* dateien(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') yield* dateien(p); }
    else if (/\.tsx?$/.test(e.name)) yield p;
  }
}

/** Zählt explizite `any` je Datei. Rückgabe: { gesamt, proDatei: [[datei, n, zeilen[]], …] absteigend }. */
export function zaehleAny(srcDir = path.join(REPO, 'src')) {
  const proDatei = [];
  let gesamt = 0;
  for (const f of dateien(srcDir)) {
    const text = fs.readFileSync(f, 'utf8');
    if (!/\bany\b/.test(text)) continue;
    const sf = ts.createSourceFile(f, text, ts.ScriptTarget.Latest, true, f.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const zeilen = [];
    const v = (n) => { if (n.kind === ts.SyntaxKind.AnyKeyword) zeilen.push(sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1); ts.forEachChild(n, v); };
    v(sf);
    if (zeilen.length) { proDatei.push([path.relative(REPO, f), zeilen.length, zeilen]); gesamt += zeilen.length; }
  }
  proDatei.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return { gesamt, proDatei };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { gesamt, proDatei } = zaehleAny();
  const show = process.argv.includes('--show');
  console.log(`explizite any in src/: ${gesamt} (Schwelle ${SCHWELLE})`);
  for (const [f, n, z] of proDatei.slice(0, show ? Infinity : 15)) console.log(`  ${String(n).padStart(4)}  ${f}${show ? '  :' + z.join(',') : ''}`);
  if (gesamt > SCHWELLE) { console.error(`FEHLER: ${gesamt} > ${SCHWELLE} – neue any bitte typisieren.`); process.exit(1); }
  if (gesamt < SCHWELLE) console.log(`Hinweis: Ratsche kann auf ${gesamt} gesenkt werden.`);
}
