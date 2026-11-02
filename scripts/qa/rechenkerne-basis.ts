/**
 * Erzeugt die Basiseingaben für tests/rechenkerneGrenzfaelle.test.ts (Grenzfallprüfung der Rechenkerne, 02.11.2026).
 *   npx tsx scripts/qa/rechenkerne-basis.ts        → schreibt tests/fixtures/rechenkerne-basis.json
 * Vorgehen: Die Parametertypen aller exportierten Funktionen in src/calc/ und den Rechenkernen in src/utils/ werden mit
 * dem TypeScript-Compiler gelesen. Für jede Funktion wird eine gültige Basiseingabe gesucht (alle Zahlenfelder gleich,
 * Kandidaten 1, 10, 30, 0,5, 100, 3, 1000, 0,3, 5; Literaltypen: erste Wahl; Texte „x“; Wahrheitswerte false).
 * Gültig heißt: keine Ausnahme, Ergebnis nicht als ungültig markiert, mindestens eine endliche Zahl, keine NaN.
 * Festgehalten werden die Eingabe, die Pfade der Zahlenfelder vom Typ number (Literaltypen wie 1 | 2 | 3 nicht),
 * die Art (kern: Ergebnis mit gueltig/hinweise; formel: sonst) und die Rechenzeit. Funktionen ohne gefundene Basis
 * stehen in „ohneBasis“; der Test verlangt für sie eine handgeschriebene Basis oder eine begründete Ausnahme.
 */
import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
export const KERN_DATEIEN = [
  ...fs.readdirSync(path.join(ROOT, 'src/calc')).filter(f => f.endsWith('.ts')).sort().map(f => `src/calc/${f}`),
  'src/utils/bestandKern.ts', 'src/utils/ec2Spannbeton.ts', 'src/utils/rheologySim.ts', 'src/utils/schadensKern.ts',
];

type Typ =
  | { k: 'num' } | { k: 'str' } | { k: 'bool' } | { k: 'undef' } | { k: 'fn' } | { k: 'unbekannt' }
  | { k: 'lit'; v: string | number | boolean }
  | { k: 'union'; of: Typ[] } | { k: 'arr'; of: Typ } | { k: 'tuple'; of: Typ[] } | { k: 'rec'; of: Typ }
  | { k: 'obj'; props: Record<string, Typ> };
type Pfad = (string | number)[];

function schema() {
  const dateien = KERN_DATEIEN.map(f => path.join(ROOT, f));
  const prog = ts.createProgram(dateien, { strict: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, skipLibCheck: true, jsx: ts.JsxEmit.ReactJSX, resolveJsonModule: true, noEmit: true });
  const chk = prog.getTypeChecker();
  const typ = (t: ts.Type, tiefe: number): Typ => {
    if (tiefe > 5) return { k: 'unbekannt' };
    if (t.flags & ts.TypeFlags.NumberLiteral) return { k: 'lit', v: (t as ts.NumberLiteralType).value };
    if (t.flags & ts.TypeFlags.StringLiteral) return { k: 'lit', v: (t as ts.StringLiteralType).value };
    if (t.flags & ts.TypeFlags.BooleanLiteral) return { k: 'lit', v: chk.typeToString(t) === 'true' };
    if (t.flags & ts.TypeFlags.Number) return { k: 'num' };
    if (t.flags & ts.TypeFlags.String) return { k: 'str' };
    if (t.flags & ts.TypeFlags.Boolean) return { k: 'bool' };
    if (t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)) return { k: 'undef' };
    if (t.isUnion()) {
      const teile = t.types.filter(x => !(x.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)));
      if (teile.length && teile.every(x => x.flags & ts.TypeFlags.BooleanLiteral)) return { k: 'bool' };
      if (teile.length === 1) return typ(teile[0], tiefe);
      return { k: 'union', of: teile.map(x => typ(x, tiefe + 1)) };
    }
    if (chk.isArrayType(t)) return { k: 'arr', of: typ(chk.getTypeArguments(t as ts.TypeReference)[0], tiefe + 1) };
    if (chk.isTupleType(t)) return { k: 'tuple', of: chk.getTypeArguments(t as ts.TypeReference).map(a => typ(a, tiefe + 1)) };
    if (t.getCallSignatures().length) return { k: 'fn' };
    if (t.flags & ts.TypeFlags.Object) {
      const props: Record<string, Typ> = {};
      for (const p of chk.getPropertiesOfType(t)) {
        const decl = p.valueDeclaration ?? p.declarations?.[0];
        props[p.name] = typ(decl ? chk.getTypeOfSymbolAtLocation(p, decl) : chk.getDeclaredTypeOfSymbol(p), tiefe + 1);
      }
      const idx = chk.getIndexInfosOfType(t);
      if (idx.length && !Object.keys(props).length) return { k: 'rec', of: typ(idx[0].type, tiefe + 1) };
      return { k: 'obj', props };
    }
    return { k: 'unbekannt' };
  };
  const aus: Record<string, Record<string, Typ[]>> = {};
  for (const f of dateien) {
    const sf = prog.getSourceFile(f); const sym = sf && chk.getSymbolAtLocation(sf); if (!sym) continue;
    const rel = path.relative(ROOT, f); aus[rel] = {};
    for (const e of chk.getExportsOfModule(sym)) {
      let s = e; if (s.flags & ts.SymbolFlags.Alias) s = chk.getAliasedSymbol(s);
      const decl = s.valueDeclaration; if (!decl) continue;
      if (decl.getSourceFile().fileName !== f) continue; // Re-Exporte werden in ihrer Herkunftsdatei geprüft
      const sig = chk.getTypeOfSymbolAtLocation(s, decl).getCallSignatures()[0]; if (!sig) continue;
      aus[rel][e.name] = sig.getParameters().map(p => typ(chk.getTypeOfSymbolAtLocation(p, p.valueDeclaration!), 0));
    }
  }
  return aus;
}

function erzeuge(t: Typ, n: number, wahl: number): unknown {
  switch (t.k) {
    case 'num': return n;
    case 'str': return 'x';
    case 'bool': return false;
    case 'lit': return t.v;
    case 'union': { const o = t.of.filter(x => x.k !== 'undef'); return erzeuge(o[wahl % o.length] ?? o[0], n, 0); }
    case 'arr': return [erzeuge(t.of, n, wahl), erzeuge(t.of, n * 2, wahl), erzeuge(t.of, n * 3, wahl)];
    case 'tuple': return t.of.map(x => erzeuge(x, n, wahl));
    case 'rec': return { a: erzeuge(t.of, n, wahl) };
    case 'obj': return Object.fromEntries(Object.entries(t.props).filter(([, v]) => v.k !== 'fn').map(([k, v]) => [k, erzeuge(v, n, wahl)]));
    default: return undefined;
  }
}
function zahlPfade(t: Typ | undefined, x: unknown, p: Pfad, aus: Pfad[]) {
  if (!t) return;
  if (t.k === 'num' && typeof x === 'number') aus.push(p);
  else if (t.k === 'union' && typeof x === 'number' && t.of.some(u => u.k === 'num')) aus.push(p);
  else if (t.k === 'arr' && Array.isArray(x)) x.slice(0, 2).forEach((v, i) => zahlPfade(t.of, v, [...p, i], aus));
  else if (t.k === 'tuple' && Array.isArray(x)) x.forEach((v, i) => zahlPfade(t.of[i], v, [...p, i], aus));
  else if ((t.k === 'obj' || t.k === 'rec') && x && typeof x === 'object') for (const [k, v] of Object.entries(x)) zahlPfade(t.k === 'obj' ? t.props[k] : t.of, v, [...p, k], aus);
}
export function zahlen(r: unknown, tiefe = 0, aus: number[] = [], gesehen = new Set<unknown>()): number[] {
  if (typeof r === 'number') aus.push(r);
  else if (r && typeof r === 'object' && tiefe < 6 && !gesehen.has(r) && aus.length < 5000) { gesehen.add(r); for (const v of Object.values(r)) zahlen(v, tiefe + 1, aus, gesehen); }
  return aus;
}
export function ungueltig(r: unknown): boolean {
  if (r === null || r === undefined) return true;
  if (typeof r !== 'object') return false;
  const o = r as Record<string, unknown>;
  if (o.gueltig === false || o.ok === false) return true;
  if (typeof o.fehler === 'string' && o.fehler) return true;
  const fehlerIn = (v: unknown) => Array.isArray(v) && v.some(x => x && typeof x === 'object' && (x as { stufe?: string }).stufe === 'fehler');
  return fehlerIn(r) || Object.values(o).some(fehlerIn);
}

async function main() {
  const s = schema();
  const basis: Record<string, Record<string, { args: unknown[]; pfade: Pfad[]; art: 'kern' | 'formel'; ms: number }>> = {};
  const ohneBasis: Record<string, string[]> = {};
  for (const [rel, fns] of Object.entries(s)) {
    const mod = await import(path.join(ROOT, rel)) as Record<string, unknown>;
    for (const [name, params] of Object.entries(fns)) {
      const fn = mod[name]; if (typeof fn !== 'function') continue;
      let gefunden: { args: unknown[]; r: unknown } | null = null;
      if (!params.some(p => p.k === 'fn' || p.k === 'unbekannt')) {
        suche: for (const wahl of [0, 1, 2]) for (const n of [1, 10, 30, 0.5, 100, 3, 1000, 0.3, 5]) {
          const args = params.map(p => erzeuge(p, n, wahl));
          try {
            const r = fn(...args); const z = zahlen(r);
            if (!ungueltig(r) && z.some(Number.isFinite) && !z.some(Number.isNaN)) { gefunden = { args, r }; break suche; }
          } catch { /* nächster Kandidat */ }
        }
      }
      if (!gefunden) { (ohneBasis[rel] ??= []).push(name); continue; }
      const pfade: Pfad[] = []; params.forEach((p, i) => zahlPfade(p, gefunden!.args[i], [i], pfade));
      const t0 = performance.now(); for (let i = 0; i < 3; i++) fn(...gefunden.args); const ms = (performance.now() - t0) / 3;
      const r = gefunden.r as Record<string, unknown>;
      const art = r && typeof r === 'object' && !Array.isArray(r) && ('gueltig' in r || 'hinweise' in r) ? 'kern' : 'formel';
      (basis[rel] ??= {})[name] = { args: gefunden.args, pfade, art, ms: Math.round(ms * 100) / 100 };
    }
  }
  const ziel = path.join(ROOT, 'tests/fixtures/rechenkerne-basis.json');
  fs.writeFileSync(ziel, JSON.stringify({ stand: '2026-11-02', hinweis: 'Erzeugt mit scripts/qa/rechenkerne-basis.ts – nicht von Hand ändern', basis, ohneBasis }, null, 1) + '\n');
  const n = Object.values(basis).reduce((a, o) => a + Object.keys(o).length, 0);
  const m = Object.values(ohneBasis).reduce((a, o) => a + o.length, 0);
  console.log(`${n} Funktionen mit Basis, ${m} ohne Basis → ${path.relative(ROOT, ziel)}`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) await main();
