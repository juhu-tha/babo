// Kleinpunkte 04.11.2026 (docs/pruefung/kleinpunkte-2026-11-04.md): offene Punkte aus den Berichten vom 03.11.
//  1. Modulüberschriften zfp, ausbau, nawaro, aufgaben_kennwerte nach der Regel „Modultitel“ (Quelltext; Build: tests/modultitel.test.ts)
//  2. Lernhilfen mit alten Modulnamen auf den Modultitel angeglichen, Freigaben unverändert
//  3. Ergebnisansagen gebündelt: eine Eingabe, die mehrere Rechenweg-Boxen ändert, ergibt eine Ansage
//  4. Fragen zu den Restlernzielen (bauschaeden#1, schadensbilder#3–5, historisch#4–5), verified:false mit Pflichtfeldern
import fs from 'node:fs';
import quiz from '../src/data/quiz.json';
import { MODUL_BY_ID } from '../src/registry/modules';
import { erzeugeAnsageBuendel, buendelText, ANSAGE_MAX } from '../src/components/ui/ErgebnisAnsage';
import { fehlendeWoerter, AUSNAHMEN_UEBERSCHRIFT } from '../scripts/qa/modultitel.mjs';
import * as h from '../src/utils/suchNormalisierung';

const fehler: string[] = [];
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
console.log('--- Test: Kleinpunkte 04.11.2026 ---');

type Frage = { id: string; moduleId: string; options: string[]; correctIdx: number; bloom?: string; niveau?: string; normRef?: string;
  distraktorFeedback?: string[]; verified: boolean; reviewer?: string; reviewedAt?: string; explanation: string;
  gapAnalysis?: { actionableAdvice?: string; targetModuleTab: string; targetModuleLabel?: string }; vorpruefung?: { am: string; ergebnis: string; hinweis?: string } };
const fragen = quiz as unknown as Frage[];
const frage = (id: string) => fragen.find(q => q.id === id)!;
const titel = (id: string) => MODUL_BY_ID.get(id)!.baum?.titel ?? MODUL_BY_ID.get(id)!.label;

// 1. Modulüberschriften
for (const id of ['zfp', 'ausbau', 'nawaro', 'aufgaben_kennwerte']) gilt(!(id in AUSNAHMEN_UEBERSCHRIFT), `${id}: noch in der Ausnahmeliste`);
const zfp = JSON.parse(fs.readFileSync('content/zfp/ZfP.json', 'utf8')).texte;
const ausbau = JSON.parse(fs.readFileSync('content/ausbau/Ausbau.json', 'utf8')).texte;
const nawaro = JSON.parse(fs.readFileSync('content/nawaro/Nawaro.json', 'utf8')).texte;
gilt(zfp.zfpModultitel === titel('zfp'), 'zfp: Überschrift = Modultitel');
gilt(ausbau.ausbauModultitel === titel('ausbau'), 'ausbau: Überschrift = Modultitel');
gilt(`${nawaro.nawaroModultitel} ${nawaro.nawaroModulZusatz}` === titel('nawaro'), 'nawaro: Überschrift = Modultitel');
gilt(/<h2[^>]*>\s*<Search[^>]*\/><MdText text=\{inhalt\.texte\.zfpModultitel\} \/><\/h2>/.test(fs.readFileSync('src/modules/ZfP.tsx', 'utf8')), 'ZfP.tsx: h2 mit Modultitel vor den Reitern');
gilt(/<h2[^>]*>\s*<Layers[^>]*\/><MdText text=\{inhalt\.texte\.ausbauModultitel\} \/><\/h2>/.test(fs.readFileSync('src/modules/Ausbau.tsx', 'utf8')), 'Ausbau.tsx: h2 mit Modultitel vor den Reitern');
const kategorie = /id: 'aufgaben_kennwerte',\s*name: '([^']+)'/.exec(fs.readFileSync('src/data/aufgabenData.ts', 'utf8'))?.[1] ?? '';
gilt(fehlendeWoerter(MODUL_BY_ID.get('aufgaben_kennwerte')!.label, `Übungsaufgaben: ${kategorie}`, h).length === 0, `aufgaben_kennwerte: Überschrift „Übungsaufgaben: ${kategorie}“ nennt das Modul nicht`);

// 2. Lernhilfen mit alten Modulnamen
const ANGEGLICHEN: Record<string, string> = {
  q_bpm_1: 'bp_mineralisch', q_bpm_2: 'bp_mineralisch', q_bpt_1: 'bp_metallisch', q_bpt_2: 'bp_metallisch', q_son_1: 'sonstiges', q_son_2: 'sonstiges',
  q_bwu_2: 'pruefverfahren_katalog', q_bpr_1: 'bp_recht_grundlagen', q_bpr_2: 'bp_recht_grundlagen', q_bpr_3: 'bp_recht_grundlagen',
  q_bpr_4: 'bp_recht_grundlagen', q_bpr_5: 'bp_recht_grundlagen',
  q_bwu_1: 'bauwerksdiagnose', qn_bauwerksuntersuchung_1: 'bauwerksdiagnose', qn_bauwerksuntersuchung_2: 'bauwerksdiagnose', qn_bauwerksuntersuchung_3: 'bauwerksdiagnose',
};
const ALT = ['Mineralische Bauprodukte', 'Metallische Bauprodukte', 'Sonstige Baustoffe', 'Bauwerksdiagnose & ZfP', 'BauPVO & CE-Kennzeichnung'];
for (const [id, modul] of Object.entries(ANGEGLICHEN)) {
  const q = frage(id);
  gilt(q.gapAnalysis!.targetModuleTab === modul && q.gapAnalysis!.actionableAdvice!.includes(`im Modul ${titel(modul)} noch einmal durch.`), `${id}: Lernhilfe nennt nicht den Modultitel`);
  gilt(q.verified && !!q.reviewer && !!q.reviewedAt, `${id}: Freigabe durch die Namensangleichung aufgehoben`);
  gilt((q.vorpruefung?.hinweis ?? '').includes('Modulname angeglichen 04.11.'), `${id}: Vermerk fehlt`);
}
const altNamen = fragen.filter(q => ALT.some(a => (q.gapAnalysis?.actionableAdvice ?? '').includes(`im Modul ${a} `)));
gilt(altNamen.length === 0, `Lernhilfen mit altem Modulnamen: ${altNamen.map(q => q.id).join(', ')}`);

// 3. Ansagebündel (Zeitgeber von Hand)
const zeitgeber: { f: () => void; id: number }[] = [];
let nr = 0;
const planer = { setTimeout: (f: () => void) => { zeitgeber.push({ f, id: ++nr }); return nr; }, clearTimeout: (id: number) => { const i = zeitgeber.findIndex(z => z.id === id); if (i >= 0) zeitgeber.splice(i, 1); } };
const ablaufen = () => { while (zeitgeber.length) zeitgeber.shift()!.f(); };
const b = erzeugeAnsageBuendel(700, planer);
b.anmelden('a', 'Knicklast: 10 kN'); b.anmelden('b', 'Spannung: 5 N/mm²'); b.anmelden('c', 'Ausnutzung: 50 %');
b.melde('a', 'Knicklast: 10 kN'); b.melde('b', 'Spannung: 5 N/mm²'); b.melde('c', 'Ausnutzung: 50 %');
ablaufen();
gilt(b.angesagt() === '' && b.sprecher() === 'a', 'Seitenaufbau: keine Ansage, erste Region spricht');
// eine Eingabe ändert alle drei Boxen, dazu Zwischenwerte beim Ziehen → eine einzige Meldung
b.melde('a', 'Knicklast: 11 kN'); b.melde('b', 'Spannung: 6 N/mm²'); b.melde('c', 'Ausnutzung: 55 %');
b.melde('a', 'Knicklast: 12 kN'); b.melde('b', 'Spannung: 7 N/mm²'); b.melde('c', 'Ausnutzung: 60 %');
gilt(zeitgeber.length === 1, `Entprellung: ${zeitgeber.length} Zeitgeber statt 1`);
let meldungen = 0;
const ab = b.abonniere(() => { meldungen++; });
ablaufen();
gilt(meldungen === 1 && b.angesagt() === 'Knicklast: 12 kN – und 2 weitere Ergebnisse aktualisiert', `Bündel: „${b.angesagt()}“ (${meldungen} Meldungen)`);
b.melde('c', 'Ausnutzung: 65 %'); ablaufen();
gilt(b.angesagt() === 'Ausnutzung: 65 %', `nur eine Box geändert: „${b.angesagt()}“`);
b.abmelden('a');
gilt(b.sprecher() === 'b' && b.angesagt() === '', 'Sprecher abgemeldet: nächste Region übernimmt leer');
ab();
gilt(buendelText(['x'.repeat(400), 'y']).length === ANSAGE_MAX && buendelText(['x'.repeat(400), 'y']).endsWith('weiteres Ergebnis aktualisiert'), 'Bündeltext gekürzt, Zusatz bleibt');
const komp = fs.readFileSync('src/components/ui/ErgebnisAnsage.tsx', 'utf8');
gilt(/useSyncExternalStore/.test(komp) && /b\.sprecher\(\) === id/.test(komp), 'ErgebnisAnsage: nur die Sprecher-Region trägt Text');
gilt(/Mehrfachansage/.test(fs.readFileSync('scripts/qa/a11y-tastatur.mjs', 'utf8')), 'a11y-tastatur.mjs prüft Mehrfachansagen');

// 4. Neue Fragen
const NEU: Record<string, [string, string]> = {
  qlz_bauschaeden_1: ['bauschaeden', 'Verstehen'], qlz_schadensbilder_1: ['schadensbilder', 'Anwenden'], qlz_schadensbilder_2: ['schadensbilder', 'Analysieren'],
  qlz_schadensbilder_3: ['schadensbilder', 'Bewerten'], qlz_historisch_1: ['historisch', 'Analysieren'], qlz_historisch_2: ['historisch', 'Bewerten'],
};
for (const [id, [modul, bloom]] of Object.entries(NEU)) {
  const q = frage(id);
  gilt(!!q && q.moduleId === modul && q.bloom === bloom && !!q.niveau && !!q.normRef && q.distraktorFeedback?.length === q.options.length, `${id}: Pflichtfelder`);
  gilt(q && !q.verified && !q.reviewer && !q.reviewedAt, `${id}: nicht zur Freigabe offen`);
  gilt(q && q.options.some((o, i) => i !== q.correctIdx && o.length >= q.options[q.correctIdx].length), `${id}: richtige Antwort ist die längste`);
}
// qlz_schadensbilder_1 nachgerechnet: b_erf = L · α_T · ΔT / ZGV
const dL = 4000 * 10e-6 * 80;
gilt(Math.abs(dL - 3.2) < 1e-9 && Math.abs(dL / 0.25 - 12.8) < 1e-9, 'Nachrechnung Fugenbreite');
const sb1 = frage('qlz_schadensbilder_1');
gilt(sb1.options[sb1.correctIdx] === 'rund 12,8 mm' && sb1.explanation.includes('3,2 mm') && sb1.explanation.includes('12,8 mm'), 'qlz_schadensbilder_1: Antwort');
// Modulbeispiel (6,0 m → 4,8 mm → 19,2 mm) als Bezug unverändert
const tb = fs.readFileSync('content/typischebauschaeden/TypischeBauschaeden.json', 'utf8');
gilt(tb.includes('b_{erf} = \\\\frac{4{,}8}{0{,}25} = 19{,}2'), 'Modulbeispiel Mindestfugenbreite geändert');
gilt(frage('qlz_historisch_2').normRef!.includes('vorläufig, Normprüfung ausstehend'), 'qlz_historisch_2: Vorbehalt der Sekundärquellen');

if (fehler.length) { fehler.forEach(f => console.error('FAIL: ' + f)); process.exit(1); }
console.log('OK: Kleinpunkte 04.11.2026');
