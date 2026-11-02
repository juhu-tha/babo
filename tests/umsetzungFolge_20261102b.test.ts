// Umsetzung 02.11.2026 (Folge b): Entscheidungen zum Rechtsstand 11/2026 (docs/pruefung/rechtsstand-2026-11.md) und zu den
// Nachstichproben 5a/5b (docs/pruefung/nachstichprobe5a-2026-11-02.md, nachstichprobe5b-2026-11-02.md), je Abschnitt
// „Umsetzung 02.11.2026“, sowie Carbonbeton-Fragen nach docs/pruefung/quiz-rechenfragen-2026-11-02.md.
// Handwerte unabhängig von den Kernen nachgerechnet (Kommentare), dann gegen Kern, Modul und Quiz geprüft.
import quiz from '../src/data/quiz.json';
import materials from '../src/data/materials.json';
import metalle from '../content/metalle/Metalle.json';
import festigkeit from '../content/festigkeitsberechnungen/Festigkeitsberechnungen.json';
import materialkennwerte from '../content/materialkennwerte/Materialkennwerte.json';
import lccInhalt from '../content/lcc/LCC.json';
import innovationen from '../content/bpinnovationen/BpInnovationen.json';
import { FX, savings, fxBauteilVon, GMODG_ANLAGE7 } from '../src/utils/bestandKern';
import { ALPHA_T_ALUMINIUM, ALUMINIUM_6060, ALUMINIUM_6060_T6 } from '../src/data/kennwerte';
import { MATERIALIEN } from '../src/modules/mechanischekenngroessen/daten';
import { epsWdvsGwp, EPS_WDVS_SZENARIO } from '../src/calc/lcc';
import { GWP_LEHRWERTE } from '../src/data/gwpLehrwerte';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const fehler: string[] = [];
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
const lies = (p: string) => readFileSync(p, 'utf8');

console.log('--- Test: Umsetzung 02.11.2026 (Folge b) ---');

type Frage = { id: string; question: string; options: string[]; correctIdx: number; explanation: string; verified: boolean; reviewer?: string;
  reviewedAt?: string; gapAnalysis?: { coreRule?: string }; vorpruefung?: { am: string; ergebnis: string; hinweis?: string } };
const fragen = quiz as unknown as Frage[];
const frage = (id: string) => fragen.find(q => q.id === id)!;
const GEAENDERT = ['q_hwk_3', 'qn_festigkeit_5', 'qn_lebenszyklus_kosten_3', 'qn_bp_innovationen_2', 'qn_carbonbeton_1', 'qn_carbonbeton_2'];
for (const id of GEAENDERT) {
  const q = frage(id);
  gilt(!!q && q.verified === false && !q.reviewer && !q.reviewedAt, `${id}: nicht auf verified:false ohne Prüfer`);
  gilt(q?.vorpruefung?.am === '2026-11-02' && q.vorpruefung.ergebnis === 'korrigiert' && /^Umsetzung 02\.11\.: .+ – korrigiert$/.test(q.vorpruefung.hinweis ?? ''), `${id}: Vermerk fehlt`);
}

// A1 GewAbfV: Dokumentationspflicht erst bei mehr als 10 m³ (§ 8 Abs. 3 Satz 4), zehn Fraktionen, Bundesrecht
const rueckbau = lies('content/rueckbau/Rueckbau.json') + lies('src/data/kurzfassung.ts') + lies('content/rueckbau/AktualitaetTab.json') + lies('content/rueckbau/BaustoffrecyclingTab.json');
gilt(!/ab 10 m³ Abfall/.test(rueckbau) && !/mindestens 10 Kernfraktionen/.test(rueckbau) && !/an bayerischen Baustellen/.test(rueckbau), 'A1: alte GewAbfV-Formulierungen');
gilt((rueckbau.match(/mehr als 10 m³/g) ?? []).length >= 3, 'A1: „mehr als 10 m³“');
gilt(/BGBl\. 2026 I Nr\. 207/.test(lies('src/data/lernpfade.ts')) && !/widersprüchlich/.test(lies('src/data/lernpfade.ts')), 'A1: Lernpfad-Hinweis');

// A2 TRGS 519: einheitlich „28.01.2025“ mit GMBl 2025 S. 144
const trgsStellen = ['content/rueckbauchecklisten/RueckbauChecklisten.json', 'content/schadstoffe/Schadstoffe.json', 'content/rueckbau/Rueckbau.json', 'content/moduleinfo/daten.json'];
for (const p of trgsStellen) gilt(/28\.01\.2025[^"]{0,6}GMBl 2025 S\. 144/.test(lies(p)), `A2: ${p}`);

// A3 q_hwk_3: ChemVerbotsV-Regelung gegenstandslos
gilt(/gegenstandslos/.test(frage('q_hwk_3').gapAnalysis?.coreRule ?? '') && !/national seit 2020/.test(frage('q_hwk_3').gapAnalysis?.coreRule ?? ''), 'A3: Kernregel q_hwk_3');

// A4 DPP: keine 18-Monats-Frist
gilt(!/18 Monate nach dem delegierten/.test(lies('content/moduleinfo/daten.json') + lies('src/components/ui/RechtsrahmenKompendium.tsx')), 'A4: 18-Monats-Frist');

// B1 F_x: Steildach 1,0, oberste Geschossdecke 0,8; Höchstwert für beide 0,24
gilt(FX.steildach === 1.0 && FX.oberste_geschossdecke === 0.8 && GMODG_ANLAGE7.steildach_oGD === 0.24, 'B1: F_x-Werte');
gilt(fxBauteilVon('steildach_oGD') === undefined && fxBauteilVon('aussenwand') === 'aussenwand', 'B1: steildach_oGD ohne F_x-Bauteil ohne Zuordnung');
gilt(Number.isNaN(savings({ uOld: 1.2, uNew: 0.2, A: 100, bauteil: 'steildach_oGD', Gt: 3500, etaSys: 1, price: 0.1, co2: 0.2, invest: 0 }).qNutz), 'B1: ohne F_x-Bauteil kein stiller Rückfall');
// Handwert: ΔU = 1,0 W/(m²K), A = 100 m², G_t = 3500 Kd/a, η = 1 → ΔQ = 1,0·100·F_x·3500·24/1000 = 8400·F_x kWh/a
const sv = (fxBauteil: 'steildach' | 'oberste_geschossdecke') => savings({ uOld: 1.2, uNew: 0.2, A: 100, bauteil: 'steildach_oGD', fxBauteil, Gt: 3500, etaSys: 1, price: 0.1, co2: 0.2, invest: 0 });
gilt(nahe(sv('steildach').qNutz, 8400, 1e-9) && nahe(sv('oberste_geschossdecke').qNutz, 6720, 1e-9), 'B1: Einsparung 8400 / 6720 kWh/a');
gilt(/'roof' \? \(FX\.steildach/.test(lies('src/modules/Bestand.tsx')) && /fxBauteil: 'oberste_geschossdecke'/.test(lies('src/modules/Modernisierung.tsx')), 'B1: Module trennen Steildach und oberste Geschossdecke');

// B2 Aluminium: α 23 · 10⁻⁶/K, EN AW-6060 T6 R_m 190 / R_p0,2 150, T66 215 / 160 (DIN EN 755-2)
gilt(ALPHA_T_ALUMINIUM === 23 && ALUMINIUM_6060_T6.fu === 190 && ALUMINIUM_6060_T6.f02 === 150 && ALUMINIUM_6060.T66.fu === 215, 'B2: zentrale Lehrwerte');
const alu = materials.materials.find((m: { id: string }) => m.id === 'aluminium')!.properties as { tensile: number; compressive: number; thermalExp: number };
gilt(alu.tensile === ALUMINIUM_6060_T6.fu && alu.compressive === ALUMINIUM_6060_T6.f02 && alu.thermalExp === ALPHA_T_ALUMINIUM, 'B2: materials.json');
const fAlu = (festigkeit.daten.materials as Record<string, { fc: number; ft: number }>).alu;
gilt(fAlu.ft === ALUMINIUM_6060_T6.fu && fAlu.fc === ALUMINIUM_6060_T6.f02 && /fc: ALUMINIUM_6060_T6\.f02, ft: ALUMINIUM_6060_T6\.fu/.test(lies('src/modules/Festigkeitsberechnungen.tsx')), 'B2: Festigkeitsberechnungen');
gilt(MATERIALIEN.alu_6060.alphaT === ALPHA_T_ALUMINIUM && MATERIALIEN.alu_6060.fu === ALUMINIUM_6060.T66.fu && MATERIALIEN.alu_6060.fy === ALUMINIUM_6060.T66.f02, 'B2: Mechanische Kenngrößen (T66)');
gilt(/alpha: ALPHA_T_ALUMINIUM/.test(lies('src/components/KlebstoffBerater.tsx')), 'B2: Klebstoffberater');
const metalleText = JSON.stringify(metalle);
// Handwert: 6000 mm · 23 · 10⁻⁶/K · 80 K = 11,04 mm
gilt(nahe(6000 * ALPHA_T_ALUMINIUM * 1e-6 * 80, 11.04, 1e-9) && metalleText.includes('6000 \\\\cdot 23 \\\\cdot 10^{-6} \\\\cdot 80 \\\\approx 11{,}0') && !/Aluminium: 24·10/.test(metalleText), 'B2: Metalle-Beispiel');
gilt(JSON.stringify(materialkennwerte).includes(`α_T = ${ALPHA_T_ALUMINIUM} · 10⁻⁶ 1/K`), 'B2: Materialkennwerte-Beispiel');
// Reißlänge: 190 · 10⁶/(2700 · 9,81) = 7173 m ≈ 7,2 km
const f5 = frage('qn_festigkeit_5');
gilt(nahe(ALUMINIUM_6060_T6.fu * 1e6 / (2700 * 9.81), 7173.3, 0.1) && f5.options[f5.correctIdx].includes('7,2 km') && f5.question.includes('f_t = 190'), 'B2: qn_festigkeit_5');
const ohneAlt = fragen.filter(q => /Aluminium[^.]{0,40}f_t = 200|α_T? = 24 · 10⁻⁶/.test(q.question + q.explanation)).map(q => q.id);
gilt(ohneAlt.length === 0, `B2: Quiz mit alten Aluminiumwerten: ${ohneAlt.join(', ')}`);

// B3 EPS-WDVS: 0,16 m · 150 m² · 20 kg/m³ = 480 kg · 3,25 = 1560 kg; 16 kg/m² · 150 m² = 2400 kg; Summe 3960 kg
const g = epsWdvsGwp(EPS_WDVS_SZENARIO.dickeM, EPS_WDVS_SZENARIO.flaecheM2, EPS_WDVS_SZENARIO.systemanteilKgJeM2);
gilt(GWP_LEHRWERTE.eps.gwp === 3250 && GWP_LEHRWERTE.eps.rohdichte === 20 && nahe(g.epsMasseKg, 480, 1e-9) && nahe(g.epsKg, 1560, 1e-9) && nahe(g.systemKg, 2400, 1e-9) && nahe(g.gesamtKg, 3960, 1e-9), 'B3: EPS-WDVS-GWP');
const daemmung = (lccInhalt.daten.SCENARIOS as { id: string; optionA: { embodiedCO2: number } }[]).find(s => s.id === 'daemmung')!;
gilt(daemmung.optionA.embodiedCO2 === g.gesamtKg && /embodiedCO2: EPS_WDVS\.gesamtKg/.test(lies('src/modules/LCC.tsx')), 'B3: Szenario liest den abgeleiteten Wert');
gilt(/rund 4 t CO₂-Äq\. Herstellung als Lehrwert/.test(frage('qn_lebenszyklus_kosten_3').question), 'B3: Quiz');

// B4 TRL-Check Kriterium 3: reale Bauteile im Werk; Quiz folgt dem Rechner (TRL 6 nur mit realen Bauteilen)
gilt(/reale Bauteile im Werk gefertigt/.test(innovationen.texte.dasMaterialWurdeIn) && /TRL 5/.test(innovationen.texte.dasMaterialWurdeIn), 'B4: Kriterium 3');
const bi = frage('qn_bp_innovationen_2');
gilt(/reale Bauteile im Werk gefertigt/.test(bi.question) && bi.options[bi.correctIdx].startsWith('TRL 6'), 'B4: Quiz');

// C Kopfzeile ohne Namen
gilt(!JSON.stringify(lccInhalt).includes('Huber') && !/Huber/.test(lies('src/modules/LCC.tsx')), 'C: LCC-Kopfzeile');
// Keine Kopf-/Freigabezeile „Prüfung • Name“ in Modultexten
const kopf: string[] = [];
const lauf = (d: string) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) lauf(p); else if (n.endsWith('.json') && /(prüfung|Prüfung|geprüft|Freigabe)[^"]{0,20}•[^"]{0,10}Prof\./.test(lies(p))) kopf.push(p); } };
lauf('content');
gilt(kopf.length === 0, `C: Kopfzeilen mit Namen: ${kopf.join(', ')}`);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Umsetzung 02.11.2026 (Folge b)');
