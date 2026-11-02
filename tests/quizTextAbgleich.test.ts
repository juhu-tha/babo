// Quiz-Text-Abgleich (scripts/qa/quiz-text-abgleich.mjs, Auftrag 02.11.2026 nach Nachstichprobe 4):
// (1) Erkennung des Prüfskripts, (2) Dauerprüfung: zentrale Lehrwerte, die in Quiztexten stehen, müssen mit den
// Konstanten übereinstimmen – ändert sich eine Konstante, fällt jede Frage auf, die noch den alten Wert nennt.
import fs from 'fs';
import { text, groessenWerte, klassen, quizFelder, pruefeFrage, indexAusText } from '../scripts/qa/quiz-text-abgleich.mjs';
import { ladeReferenzen, pruefeKennwerte, registryAusgaben } from '../scripts/qa/kennwert-abgleich.mjs';
import { ALPHA_E } from '../src/calc/betonkennwerte';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };

console.log('--- Test: Quiz-Text-Abgleich ---');

type Frage = { id: string; question: string; options: string[]; correctIdx: number; explanation: string; distraktorFeedback?: string[]; gapAnalysis?: Record<string, string>; normRef?: string; bloom?: string };
const QUIZ = JSON.parse(fs.readFileSync('src/data/quiz.json', 'utf8')) as Frage[];

// 1. Erkennung
pruefe(text('$\\mu_{lim} = 0{,}295$').includes('μ_lim = 0,295'), 'LaTeX wird vereinheitlicht (μ_lim = 0,295)');
const g = groessenWerte('Für XC4 gilt w/z ≤ 0,60 und c_min,dur = 25 mm; Sporthallen stehen in CC2.');
pruefe(g.some(x => x.key === 'w/z' && x.werte[0] === 0.6), 'w/z ≤ 0,60 als Größe mit Wert erkannt');
pruefe(g.some(x => x.key === 'c_min,dur' && x.einheit === 'mm' && x.werte[0] === 25), 'c_min,dur = 25 mm erkannt');
pruefe(klassen('Sporthallen stehen in CC2, Versammlungsstätten in CC3.').map(k => k.klasse).join() === 'CC2,CC3', 'Schadensfolgeklassen erkannt');
const idx = indexAusText('Nach DIN 1045-2:2023-08 gilt für XC4 c_min,dur = 25 mm. Sporthallen und Schulen gehören zu CC2.');
const frage = (erklaerung: string): Frage => ({ id: 't', question: 'Testfrage?', options: ['a', 'b', 'c'], correctIdx: 0, explanation: erklaerung });
const ctx = { registry: registryAusgaben(), referenzen: await ladeReferenzen() };
pruefe(pruefeFrage(frage('Für XC4 gilt c_min,dur = 25 mm.'), idx, ctx).length === 0, 'übereinstimmender Wert ergibt keinen Treffer');
pruefe(pruefeFrage(frage('Für XC4 gilt c_min,dur = 30 mm.'), idx, ctx).some(t => t.art === 'W'), 'abweichender Wert derselben Größe wird gemeldet');
pruefe(pruefeFrage(frage('Nach DIN 1045-2:2008-08 ist das so.'), idx, ctx).some(t => t.art === 'N'), 'abweichende Normausgabe wird gemeldet');
pruefe(pruefeFrage(frage('Große Sporthallen gehören zu CC3.'), indexAusText('Sporthallen gehören zu CC2. Sporthallen mit Tribüne bleiben CC2.'), ctx).some(t => t.art === 'K'),
  'Klasse neben einem Bezugswort, das im Modul nur bei einer anderen Klasse steht, wird gemeldet');

// 2. Dauerprüfung: Kennwerte in Antwort, Erklärung, Rückmeldungen und Lernhilfe gegen die zentralen Konstanten
//    (Zuordnung wie scripts/qa/kennwert-abgleich.mjs). Bekannte, geprüfte Abweichungen (docs/pruefung/quiz-text-abgleich-2026-11-02.md):
const ERLAUBT = new Set([
  'q_oe_1|16 kg CO₂-Äq./(m² NRF·a)', // Rückmeldung zu einem absichtlich falschen Distraktor
  'qn_lca_rechner_1|0,03 kg CO₂/(t·km)', 'qn_lca_rechner_1|0,15 kg CO₂/(t·km)', // Werte stehen in der Aufgabe (Quiz-Abgleich 30.10., DSB-LC-11)
  'qn_emodul_4|39,4 GPa', // E_cm mit α_E = 1,2 (Basalt), kein Tabellenwert
  'qn_materialoptimierung_3|0,42 kg CO₂-Äq./kg', // Lehrwert Elektroofenstahl mit Grünstrom wie im Modul
  'qt_bauwerksdiagnose_2|31 N/mm²', // f_ck,is/0,85 = 31,2, kein Tabellenwert
]);
const gefunden = new Set<string>();
for (const q of QUIZ) {
  for (const [feld, roh] of quizFelder(q) as [string, string][]) {
    if (feld === 'Frage' || feld === 'normRef') continue;
    for (const t of pruefeKennwerte(roh, ctx.referenzen).treffer) {
      if (t.ok || t.fiktiv) continue;
      const k = `${q.id}|${t.roh}`;
      gefunden.add(k);
      pruefe(ERLAUBT.has(k), `${q.id} (${feld}): ${t.roh} weicht von ${t.ref.konstante} = ${t.ref.werte.join(' / ')} ab`);
    }
  }
}
for (const k of ERLAUBT) pruefe(gefunden.has(k), `Ausnahme ${k} tritt nicht mehr auf – aus ERLAUBT streichen (Ratsche)`);

// 3. Beiwert α_E (DIN EN 1992-1-1, 3.1.3(2); src/calc/betonkennwerte.ts) in Fragen, die α_E nennen
const GESTEIN: Record<string, keyof typeof ALPHA_E> = { Basalt: 'basalt', Quarzit: 'quarzit', Kalkstein: 'kalkstein', Sandstein: 'sandstein' };
let alphaZahl = 0;
for (const q of QUIZ) {
  const s = (quizFelder(q) as [string, string][]).filter(([f]) => f !== 'normRef').map(([, v]) => v).join(' ');
  if (!s.includes('α_E')) continue;
  for (const m of s.matchAll(/(Basalt|Quarzit|Kalkstein|Sandstein)[^.;,\d]{0,30}?(\d,\d+)/g)) {
    alphaZahl++;
    const w = Number(m[2].replace(',', '.'));
    pruefe(Math.abs(w - ALPHA_E[GESTEIN[m[1]]]) < 1e-9, `${q.id}: α_E ${m[1]} = ${m[2]}, zentral ${ALPHA_E[GESTEIN[m[1]]]}`);
  }
}
pruefe(alphaZahl >= 10, `nur ${alphaZahl} α_E-Angaben in Quiztexten gefunden (Erkennung prüfen)`);

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log(`OK: Erkennung, ${gefunden.size} geprüfte Kennwert-Ausnahmen, ${alphaZahl} α_E-Angaben`);
