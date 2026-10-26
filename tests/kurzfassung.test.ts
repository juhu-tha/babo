// „Das Wichtigste in 5 Punkten“ (Umsetzungsplan Phase 3, AP 3.8)
import { MODUL_BY_ID } from '../src/registry/modules';
import { KURZFASSUNG, KURZFASSUNG_PFLICHT } from '../src/data/kurzfassung';
import { FACHMODULE } from '../src/data/pruefvermerke';
import { fliesstextWoerter, modulDateien } from './hilfen/fliesstext';

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

// Längenschwelle: Jedes Fachmodul mit eigener Komponente, dessen Fließtext (Moduldatei samt modul-eigener Importe,
// Zählweise tests/hilfen/fliesstext.ts) die Schwelle überschreitet, braucht eine Kurzfassung. Kalibriert an den
// Pflichtmodulen von AP 3.8 („mehr als ca. 4 000 Wörter“ in der damaligen Zählung): Deren kleinste mit eigener
// Komponente liegen in dieser Zählung bei rund 3 250 Wörtern. Reitermodule mit gemeinsamer Komponente stehen in
// KURZFASSUNG_PFLICHT.
const FLIESSTEXT_SCHWELLE = 3000;
const dateien = modulDateien();
let lang = 0;
for (const m of FACHMODULE) {
  const datei = dateien.get(m.id);
  if (!datei) continue;
  const w = fliesstextWoerter(datei);
  if (w <= FLIESSTEXT_SCHWELLE) continue;
  lang++;
  if (!KURZFASSUNG[m.id]) fehler.push(`${m.id}: ${w} Wörter Fließtext (> ${FLIESSTEXT_SCHWELLE}) ohne Kurzfassung`);
  if (!KURZFASSUNG_PFLICHT.includes(m.id)) fehler.push(`${m.id}: ${w} Wörter Fließtext – in KURZFASSUNG_PFLICHT aufnehmen`);
}
if (lang < 15) fehler.push(`nur ${lang} lange Fachmodule erkannt – Zuordnung in tests/hilfen/fliesstext.ts prüfen`);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: ${Object.keys(KURZFASSUNG).length} Module mit Kurzfassung, ${lang} Fachmodule über ${FLIESSTEXT_SCHWELLE} Wörter abgedeckt`);
