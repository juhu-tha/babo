// „Das Wichtigste in 5 Punkten“ (Umsetzungsplan Phase 3, AP 3.8)
import { MODUL_BY_ID } from '../src/registry/modules';
import { KURZFASSUNG, KURZFASSUNG_PFLICHT } from '../src/data/kurzfassung';

console.log('--- Test: Kurzfassungen ---');
const fehler: string[] = [];
for (const id of KURZFASSUNG_PFLICHT) if (!KURZFASSUNG[id]) fehler.push(`${id}: Kurzfassung fehlt`);
for (const [id, p] of Object.entries(KURZFASSUNG)) {
  if (!MODUL_BY_ID.has(id)) fehler.push(`${id}: keine Route`);
  if (p.length !== 5) fehler.push(`${id}: ${p.length} statt 5 Punkte`);
  for (const t of p) {
    if (t.length < 60 || t.length > 240 || !t.endsWith('.')) fehler.push(`${id}: Punkt „${t.slice(0, 40)}…“ – 60–240 Zeichen mit Punkt`);
    if (/\d\.\d/.test(t)) fehler.push(`${id}: Dezimalpunkt in „${t.slice(0, 40)}…“`);
  }
}
if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: ${Object.keys(KURZFASSUNG).length} Module mit Kurzfassung`);
