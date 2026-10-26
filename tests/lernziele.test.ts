// Lernziele je Fachmodul (Umsetzungsplan Phase 3, AP 3.6) – Aufbau, Verweise, Abdeckung
import { MODULE, MODUL_BY_ID, type ModulEintrag } from '../src/registry/modules';
import { LERNZIELE } from '../src/data/lernziele';
import { FACHMODULE, istFachmodul } from '../src/data/pruefvermerke';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Lernziele ---');

const STUFEN = new Set(['Erinnern', 'Verstehen', 'Anwenden', 'Analysieren', 'Bewerten', 'Erschaffen']);
// Operationalisierung: Ziel endet auf ein beobachtbares Verb („… berechnen.“), keine Verben wie „kennen“, „wissen“, „verstehen“
const UNSCHARF = /\b(kennen|wissen|verstehen|kennenlernen|vertraut sein|ein Gefühl)\b/i;
for (const [id, l] of Object.entries(LERNZIELE)) {
  pruefe(MODUL_BY_ID.has(id), `${id}: kein Modul in der Registry`);
  pruefe(['B', 'M', 'B/M'].includes(l.niveau), `${id}: Niveau ungültig`);
  pruefe(l.minuten >= 10 && l.minuten <= 600, `${id}: Bearbeitungszeit ${l.minuten} min unplausibel`);
  pruefe(l.ziele.length >= 3 && l.ziele.length <= 5, `${id}: ${l.ziele.length} Ziele (3–5 verlangt)`);
  for (const v of l.vorwissen) pruefe(MODUL_BY_ID.has(v) && v !== id, `${id}: Vorwissen „${v}“ ist keine andere Modul-ID`);
  for (const z of l.ziele) {
    pruefe(STUFEN.has(z.stufe), `${id}: Bloom-Stufe „${z.stufe}“ unbekannt`);
    pruefe(z.text.trim().endsWith('.') && z.text.length >= 30 && z.text.length <= 220, `${id}: Ziel „${z.text.slice(0, 40)}…“ – Länge 30–220 Zeichen, mit Punkt`);
    pruefe(!UNSCHARF.test(z.text), `${id}: Ziel nicht operationalisiert („${z.text.slice(0, 50)}…“)`);
  }
  pruefe(l.ziele.some(z => z.stufe !== 'Erinnern' && z.stufe !== 'Verstehen'), `${id}: mindestens ein Ziel ab „Anwenden“`);
}

// Abdeckung: jedes Fachmodul nach istFachmodul (Typ standard, calculator, norm oder database außerhalb der
// Info-/Studienbereiche, src/data/pruefvermerke.ts) hat Lernziele – 100 %, keine Ausnahmen
const fach = (MODULE as readonly ModulEintrag[]).filter(m => istFachmodul(m));
pruefe(fach.length === FACHMODULE.length, `Fachmodule laut Registry (${fach.length}) und Registry-Kern (${FACHMODULE.length}) weichen ab`);
const fehlend = fach.filter(m => !LERNZIELE[m.id]).map(m => m.id);
const ohne = fehlend.length;
pruefe(ohne === 0, `${ohne} Fachmodule ohne Lernziele: ${fehlend.join(', ')}`);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: ${Object.keys(LERNZIELE).length} Module mit Lernzielen, ${fach.length - ohne}/${fach.length} Fachmodule abgedeckt`);
