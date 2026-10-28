// „Das Wichtigste in 5 Punkten“ (Umsetzungsplan Phase 3, AP 3.8)
import { MODUL_BY_ID } from '../src/registry/modules';
import { KURZFASSUNG, KURZFASSUNG_PFLICHT } from '../src/data/kurzfassung';
import { FACHMODULE } from '../src/data/pruefvermerke';
import { ansichtWoerter, fliesstextWoerter, modulDateien } from './hilfen/fliesstext';

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

// Ratsche Z53 (Entscheidung, 27.10.2026: „Module über 3 000 Wörtern teilen + Kurzfassung“):
// Jedes Fachmodul, dessen Ansicht (sichtbarer Fließtext unter der Modul-ID samt content/*.json, ohne Formeln,
// Code und Quiz; Zählweise ansichtWoerter in tests/hilfen/fliesstext.ts) die Schwelle überschreitet, braucht
//   (1) die Kurzfassung „Das Wichtigste in 5 Punkten“ und
//   (2) eine Reitergliederung über ModuleTabs bzw. GruppierteModuleTabs mit höchstens 2 Ebenen
//       (≤ 7 Reiter je Leiste prüft tests/komponenten-reiter.test.ts).
// Ausnahmen nur begründet in AUSNAHMEN. Die Schwelle war bis Z53 an AP 3.8 kalibriert (rund 3 250 Wörter für die
// kleinsten Pflichtmodule); seit Z53 gilt sie für alle Fachmodule einschließlich der Reiter-Routen geteilter Komponenten.
const FLIESSTEXT_SCHWELLE = 3000;
const MAX_EBENEN = 2;
/** Begründete Ausnahmen: Modul-ID → Begründung */
const AUSNAHMEN: Readonly<Record<string, string>> = {
  // Teilmodule der Bauwerksdiagnose (Aufteilung 28.10.2026, src/registry/teilmodule.ts): je ein Bereich, daher keine Reiterleiste
  pruefverfahren_katalog: 'Katalog mit Kategorie-Filter, Suche und Verfahrensauswahl (je ein Verfahren sichtbar); eine Reiterleiste mit einem Reiter brächte nichts',
  zfp: 'eigene Reiterleiste (ReiterLeiste) mit sechs Verfahrensgruppen und DGZfP, formal kein ModuleTabs',
};

const dateien = modulDateien();
let lang = 0;
for (const m of FACHMODULE) {
  const a = ansichtWoerter(m.id);
  // Gegenprobe: Die Ansichtszählung darf bei Modulen mit eigener Komponente nicht weit unter der Dateizählung
  // liegen (sonst werden Kindkomponenten, etwa über ein neues Lade-Muster, nicht gefunden).
  const datei = dateien.get(m.id);
  const w0 = datei ? fliesstextWoerter(datei) : 0;
  if (w0 > 1500 && a.woerter < 0.7 * w0) fehler.push(`${m.id}: Ansicht ${a.woerter} Wörter, Moduldatei ${w0} – Zählung in tests/hilfen/fliesstext.ts prüfen`);
  if (a.ebenen > MAX_EBENEN) fehler.push(`${m.id}: ${a.ebenen} Reiterebenen (höchstens ${MAX_EBENEN})`);
  if (a.woerter <= FLIESSTEXT_SCHWELLE) continue;
  lang++;
  if (AUSNAHMEN[m.id]) continue;
  if (!KURZFASSUNG[m.id]) fehler.push(`${m.id}: ${a.woerter} Wörter (> ${FLIESSTEXT_SCHWELLE}) ohne Kurzfassung`);
  if (!KURZFASSUNG_PFLICHT.includes(m.id)) fehler.push(`${m.id}: ${a.woerter} Wörter – in KURZFASSUNG_PFLICHT aufnehmen`);
  if (!a.reiter) fehler.push(`${m.id}: ${a.woerter} Wörter (> ${FLIESSTEXT_SCHWELLE}) ohne Reitergliederung (ModuleTabs/GruppierteModuleTabs) – gliedern, teilen oder in AUSNAHMEN begründen`);
}
for (const id of Object.keys(AUSNAHMEN)) if (!FACHMODULE.some(m => m.id === id)) fehler.push(`AUSNAHMEN: ${id} ist kein Fachmodul`);
if (lang < 30) fehler.push(`nur ${lang} lange Fachmodule erkannt – Zählung in tests/hilfen/fliesstext.ts prüfen`);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: ${Object.keys(KURZFASSUNG).length} Module mit Kurzfassung, ${lang} Fachmodule über ${FLIESSTEXT_SCHWELLE} Wörter mit Kurzfassung und Reitern`);
