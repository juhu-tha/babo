// Ratsche für explizite `any` in src/ (Phase 5, AP 5.1) – gleiche Zähllogik wie scripts/qa/check-any.mjs
import fs from 'fs';
import os from 'os';
import path from 'path';
import { zaehleAny, SCHWELLE } from '../scripts/qa/check-any.mjs';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };

console.log('--- Test: any-Ratsche ---');

// 1. Zähllogik: alle Schreibweisen zählen, Kommentare/Strings/Bezeichner nicht
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'any-ratsche-'));
fs.writeFileSync(path.join(tmp, 'probe.ts'), [
  'const a: any = 1;',
  'const b = a as any;',
  'const c = <any>a;',
  'const d: any[] = [];',
  'const e: Record<string, any> = {};',
  'function f(x: Array<any>): void {}',
  '// any im Kommentar zählt nicht: any',
  "const s = 'any as any';",
  'const anyWert = 1; const many = 2;',
].join('\n'));
const probe = zaehleAny(tmp);
pruefe(probe.gesamt === 6, `Zähllogik: 6 erwartet, ${probe.gesamt} gezählt`);
fs.rmSync(tmp, { recursive: true, force: true });

// 2. Ratsche: src/ darf nicht mehr explizite any enthalten als SCHWELLE
const { gesamt, proDatei } = zaehleAny();
if (gesamt > SCHWELLE) {
  for (const [datei, n, zeilen] of proDatei) fehler.push(`${datei}: ${n} any (Zeilen ${zeilen.join(', ')})`);
  fehler.push(`explizite any in src/: ${gesamt} > Schwelle ${SCHWELLE} – bitte typisieren (node scripts/qa/check-any.mjs --show)`);
}

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log(`OK: ${gesamt} explizite any in src/ (Schwelle ${SCHWELLE})`);
