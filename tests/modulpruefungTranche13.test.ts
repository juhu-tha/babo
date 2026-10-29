// Modulprüfung Tranche 13 (29.10.2026): unabhängige Nachrechnungen der Rechenkerne in den Bereichen Mängel & Schäden
// sowie Schutz & Instandsetzung (Befundliste docs/pruefung/module-tranche-13.md).
// Die Sollwerte stammen aus einem eigenen Prüfskript (eigene Umsetzung der Gleichungen in Python, math.erf),
// nicht aus den Kernen oder vorhandenen Tests übernommen.
import {
  erf, chloridGehalt, chloridAuswertung, rissinjektionPlan, wtaBohrplan, wtaKombiBewertung, wuNachweis,
  zustandsnote, schulnoteAusZustandsnote, deSitterKosten, belegreifeGrenzeCM,
} from '../src/calc/schutzInstandsetzung';
import { carbonationK } from '../src/utils/schadensKern';
import monitoring from '../content/bauwerksunters_monitoring/Bauwerksunters_Monitoring.json';
import sgInhalt from '../content/schutzgrundlagen/SchutzGrundlagen.json';
import osDaten from '../content/stahlbetoninstandhaltung/daten.json';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Modulprüfung Tranche 13 (Nachrechnungen) ---');

// 1. Stahlbetoninstandhaltung – Chloriddiffusion (2. Ficksches Gesetz) und Lehrwerte der Rissinjektion
pruefe('erf(0,5)', erf(0.5), 0.5204999, 1e-6);
pruefe('CL1 C(35 mm) C_s 2,5 / D 2 / 25 a', chloridGehalt(2.5, 2.0, 25, 35), 1.33315);
pruefe('CL2 C(50 mm)', chloridGehalt(2.5, 2.0, 25, 50), 0.933588);
pruefe('CL3 C(40 mm) C_s 1,5 / D 1 / 50 a', chloridGehalt(1.5, 1.0, 50, 40), 0.714655);
pruefe('CL4 C(60 mm) C_s 4 / D 3 / 40 a', chloridGehalt(4.0, 3.0, 40, 60), 1.9622);
const cl1 = chloridAuswertung(2.5, 2.0, 25, 35);
gilt(cl1.rebarStatus === 'critical' && cl1.depassivatedDepth === 65 && cl1.erfAbtrag === 80, `CL1 Auswertung: ${cl1.rebarStatus}/${cl1.depassivatedDepth}/${cl1.erfAbtrag}`);
gilt(chloridAuswertung(1.5, 1.0, 50, 40).depassivatedDepth === 52.5, 'CL3 depassivierte Tiefe 52,5 mm');
gilt(chloridAuswertung(1.0, 1.0, 25, 50).rebarStatus === 'ok', 'CL Status ok bei geringer Belastung');
for (const [h, p, a] of [[150, 12, 75], [300, 24, 150], [400, 32, 200], [800, 35, 400]] as const) {
  const plan = rissinjektionPlan(h);
  gilt(plan.maxPressureBar === p && plan.packerSpacingMm === a, `RI h = ${h} mm: ${plan.maxPressureBar} bar / ${plan.packerSpacingMm} mm`);
}

// 2. WTA – Bohrrechner (Lehrmodell) und Kombi-Planer
const w36 = wtaBohrplan(36, 'brick');
gilt(w36.drillDepth === 31 && w36.holesPerMeter === 9, 'WTA d 36 cm: t 31 cm, n 9');
pruefe('WTA d 36 cm V_Bohrloch', w36.singleHoleVolume, 35.0602); pruefe('WTA d 36 cm V je m', w36.creamConsumption, 0.362873);
const w51 = wtaBohrplan(51, 'mixed');
gilt(w51.drillDepth === 46 && w51.holesPerMeter === 10, 'WTA d 51 cm Mischmauerwerk'); pruefe('WTA d 51 cm V je m', w51.creamConsumption, 0.598285);
const w24 = wtaBohrplan(24, 'hollow');
gilt(w24.holesPerMeter === 13, 'WTA d 24 cm Lochstein n 13'); pruefe('WTA d 24 cm V je m', w24.creamConsumption, 0.321253);
const k1 = wtaKombiBewertung('calciumsilicat', 'ok', 'medium', 'group2');
gilt(k1.score === 100 && k1.stufe === 'gruen' && k1.alarme.length === 0, `Kombi Calciumsilicat: ${k1.score}`);
const k2 = wtaKombiBewertung('pur_foelie', 'none', 'high', 'group3');
gilt(k2.score === 0 && k2.stufe === 'rot' && k2.alarme.length === 4, `Kombi PUR/ohne Sperre: ${k2.score}`);
const k3 = wtaKombiBewertung('holzfaser', 'critical', 'medium', 'group1');
gilt(k3.score === 55 && k3.stufe === 'orange', `Kombi Holzfaser/Restfeuchte: ${k3.score}`);

// 3. WU-Bauwerke (DAfStb-WU-Richtlinie 2017-12)
for (const [hw, h, I, w] of [[3.0, 300, 10, 0.20], [4.0, 300, 13.3333, 0.15], [6.0, 300, 20, 0.10], [2.0, 250, 8, 0.20]] as const) {
  const n = wuNachweis(hw, h, 0.15, '1', 'Wand', 'ortbeton');
  pruefe(`WU h_w ${hw} m / h ${h} mm: I`, n.druckgefaelle, I); pruefe(`WU h_w ${hw} m: w_k`, n.zulRissbreite, w);
}
gilt(!wuNachweis(9.0, 300, 0.10, '1', 'Wand', 'ortbeton').selbstheilungMoeglich, 'WU I = 30 > 25: keine Selbstheilung');
gilt(wuNachweis(3, 240, 0.2, '1', 'Wand', 'ortbeton').dickeOk && !wuNachweis(3, 240, 0.2, '1', 'Bodenplatte', 'ortbeton').dickeOk, 'WU Tab. 1 BK 1: Wand 240, Bodenplatte 250 mm');
gilt(wuNachweis(1, 200, 0.3, '2', 'Wand', 'ortbeton').dickeOk && !wuNachweis(1, 200, 0.3, '2', 'Wand', 'elementwand').dickeOk && wuNachweis(1, 150, 0.3, '2', 'Bodenplatte', 'ortbeton').dickeOk, 'WU Tab. 1 BK 2');
gilt(wuNachweis(1, 200, 0.3, '2', 'Wand', 'ortbeton').zulRissbreite === 0.30, 'WU BK 2: 0,30 mm');

// 4. Zustandsbewertung (didaktisch) und Zuverlässigkeitsbeispiel
for (const [s, v, d, n, z] of [[2, 1, 3, 1, 3.1], [1, 1, 1, 0, 1.0], [3, 2, 3, 3, 3.3], [4, 1, 1, 2, 4.0], [2, 2, 2, 4, 2.4]] as const) {
  pruefe(`ZN S${s}/V${v}/D${d} + ${n}`, zustandsnote(s, v, d, n), z, 1e-9);
}
gilt([1.4, 1.5, 1.9, 2.0, 2.4, 2.5, 2.9, 3.0, 3.4, 3.5, 4.0].map(schulnoteAusZustandsnote).join('') === '12233445566', 'Schulnoten-Zuordnung der RI-EBW-Notenbereiche');
pruefe('β = 200/√3400', 200 / Math.sqrt(50 ** 2 + 30 ** 2), 3.42997);

// 5. Schutz-Grundlagen (Fünferregel) und Monitoring
pruefe('de Sitter K_3 (K_0 2000)', deSitterKosten(2000, 3), 250000);
gilt(deSitterKosten(1000, 1) === 5000 && deSitterKosten(1000, 2) === 25000, 'de Sitter Faktoren 5 und 25');
gilt(belegreifeGrenzeCM('cement', false) === 2.0 && belegreifeGrenzeCM('cement', true) === 1.8 && belegreifeGrenzeCM('anhydrite', false) === 0.5 && belegreifeGrenzeCM('anhydrite', true) === 0.3 && Number.isNaN(belegreifeGrenzeCM('brick', false)), 'CM-Richtwerte');
pruefe('k_c 15 mm / 40 a', carbonationK(15, 40), 2.37171);
pruefe('Wenner ρ = 2π · 0,05 · 400', 2 * Math.PI * 0.05 * 0.40 / 0.001, 125.664);

// 6. Inhaltliche Korrekturen der Befundliste (Regression)
const wenner = JSON.stringify(monitoring.daten);
gilt(wenner.includes('mäßiges Korrosionsrisiko') && !wenner.includes('eher geringes Risiko'), 'T13-SHM-1 Wenner-Einordnung nach RILEM TC 154-EMC');
gilt(sgInhalt.texte.t3ElektrochemischeChloridextraktionEce.includes('14038-2') && sgInhalt.texte.t4ElektrochemischeRealkalisierungEr.includes('14038-1'), 'T13-SG-1 DIN EN 14038 Teil 1 = Realkalisierung, Teil 2 = Chloridextraktion');
gilt(!sgInhalt.texte.prinzip1PiRissüberbrückende.includes('OS 4 oder'), 'T13-SG-2 OS 4 nicht rissüberbrückend');
const os10 = (osDaten.daten.osSysteme as { id: string; name: string }[]).find(o => o.id === 'OS 10');
gilt(!!os10 && os10.name.includes('Dichtungsschicht'), 'T13-IH-2 OS 10 als Dichtungsschicht unter Schutz- und Deckschichten');

if (fehler.length) { fehler.forEach(f => console.log('FAIL ' + f)); process.exit(1); }
console.log('Alle Nachrechnungen Tranche 13 bestanden.');
