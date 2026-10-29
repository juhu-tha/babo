// Modulprüfung Tranche 14 (29.10.2026): KI im Bauwesen und Digitales (Befundliste docs/pruefung/module-tranche-14.md).
// Sollwerte aus einem eigenen Prüfskript (eigene Umsetzung in Python), nicht aus App-Code oder vorhandenen Tests.
// Geprüft werden (1) das Lehrmodell „Urban Mining Lab“ im Modul Materialpässe (src/calc/materialpass.ts) und
// (2) die Ergebniszahlen der Anwendungsbeispiele in den Inhaltsdateien, damit sie nicht unbemerkt falsch werden.
import { materialpassBilanz, type Fuegung, type Gebaeudetyp } from '../src/calc/materialpass';
import kib from '../content/kibaustoffe/KiBaustoffe.json';
import bim from '../content/bimbaustoffe/BimBaustoffe.json';
import mdb from '../content/materialdatenbanken/Materialdatenbanken.json';
import mp from '../content/materialpaesse/Materialpaesse.json';
import dpp from '../content/dppepd/DppEpd.json';
import ot from '../content/onlinetools/OnlineTools.json';
import { KI_UEBUNGEN as UEBUNGEN } from '../src/data/kiUebungen';
import { LEHRWERTE_A2 } from '../src/data/oekobaudatLehrwerteA2';
import { readFileSync } from 'node:fs';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
/** Formeltext eines Beispiels enthält das Ergebnis (KaTeX-Komma {,} oder Komma) */
const formeln = (schritte: { formel: string }[]) => schritte.map(s => s.formel.replace(/\{,\}/g, ',')).join(' | ');
const zeigt = (fall: string, schritte: { formel: string }[], ...teile: string[]) => {
  const f = formeln(schritte);
  for (const t of teile) gilt(f.includes(t), `${fall}: „${t}“ fehlt in ${f}`);
};

console.log('--- Test: Modulprüfung Tranche 14 (Nachrechnungen) ---');

// 1. Urban Mining Lab (Materialpässe)
const TYPEN: Record<string, Gebaeudetyp> = {
  massiv: { concreteVolume: 0.40, steelMass: 45, woodVolume: 0, copperMass: 1.5 },
  hybrid: { concreteVolume: 0.12, steelMass: 15, woodVolume: 0.25, copperMass: 1.2 },
  circular: { concreteVolume: 0.05, steelMass: 10, woodVolume: 0.30, copperMass: 1.0 },
};
const faelle: [string, string, number, number, Fuegung, { gesamt: number; ci: number; co2: number; rest: number; m2: number }][] = [
  ['MP1', 'massiv', 2500, 10, 'glued', { gesamt: 2516.25, ci: 10, co2: 0, rest: -17512, m2: -7 }],
  ['MP2', 'hybrid', 2500, 35, 'screwed', { gesamt: 1073.0, ci: 65, co2: 573, rest: 179023, m2: 72 }],
  ['MP3', 'circular', 2500, 85, 'screwed', { gesamt: 702.5, ci: 90, co2: 688, rest: 184173, m2: 74 }],
  ['MP4', 'massiv', 1000, 40, 'mortar', { gesamt: 1006.5, ci: 45, co2: 0, rest: 45738, m2: 46 }],
];
for (const [fall, typ, bgf, rez, fug, soll] of faelle) {
  const b = materialpassBilanz(TYPEN[typ], bgf, rez, fug);
  pruefe(`${fall} Masse gesamt`, b.totalWeightTons, soll.gesamt, 1e-9);
  gilt(b.circularityIndex === soll.ci, `${fall} CI ${b.circularityIndex} (soll ${soll.ci})`);
  gilt(b.carbonStoredTons === soll.co2, `${fall} CO₂-Speicher ${b.carbonStoredTons} t (soll ${soll.co2})`);
  gilt(b.totalResidualValue === soll.rest, `${fall} Restwert ${b.totalResidualValue} € (soll ${soll.rest})`);
  gilt(b.residualValuePerM2 === soll.m2, `${fall} Restwert/m² ${b.residualValuePerM2} (soll ${soll.m2})`);
}

// 2. Anwendungsbeispiele KI (content/kibaustoffe/KiBaustoffe.json)
const d = kib.daten as Record<string, { formel: string }[]>;
pruefe('SY1 cos(a,b)', 0.8 * 0.6 + 0.6 * 0.8, 0.96); pruefe('SY1 cos(a,c)', 0.6 * 0.6, 0.36);
zeigt('SY1', d['KiBaustoffeInhalt.schritte'], '= 0,96', '= 0,36');
pruefe('SY2 Sigmoid', 1 / (1 + Math.exp(-0.86)), 0.70266);
zeigt('SY2', d['KiBaustoffeInhalt.schritte_2'], '= 0,86', '= 0,70');
pruefe('PR1 Kosten', 30000 / 1e6 * 3 + 2000 / 1e6 * 15, 0.12);
zeigt('PR1', d['KiBaustoffeInhalt.schritte_3'], '0,12');
pruefe('PR2 Seiten', 118000 / 750, 157.333);
zeigt('PR2', d['KiBaustoffeInhalt.schritte_4'], '157');
pruefe('LP2 Mehrheit 2 von 3', 0.8 ** 3 + 3 * 0.8 ** 2 * 0.2, 0.896);
zeigt('LP', [...d['KiBaustoffeInhalt.schritte_5'], ...d['KiBaustoffeInhalt.schritte_6']], '= 24', '0,896');
pruefe('TH1 Recall', 22 / 30, 0.73333);
zeigt('TH', [...d['KiBaustoffeInhalt.schritte_7'], ...d['KiBaustoffeInhalt.schritte_8']], '0,55', '0,73', '0,92');
const tage = Math.round((Date.UTC(2027, 11, 2) - Date.UTC(2026, 9, 20)) / 86400000);
gilt(tage === 408, `RE1 Restzeit ${tage} Tage (soll 408)`);
zeigt('RE', [...d['KiBaustoffeInhalt.schritte_9'], ...d['KiBaustoffeInhalt.schritte_10']], '408', '13,4', '32');
pruefe('LK1 14B Q4_K_M', 14e9 * 4.85 / 8 / 1e9, 8.4875); pruefe('LK2 70B Q4_K_M', 70e9 * 4.85 / 8 / 1e9, 42.4375);
zeigt('LK', [...d['KiBaustoffeInhalt.schritte_11'], ...d['KiBaustoffeInhalt.schritte_12']], '8,5', '140', '42', '0,30');
pruefe('RS1 Unsicherheit 95 %', 1.96 * Math.sqrt(0.78 * 0.22 / 200), 0.05741);
pruefe('RS2 CO₂', 0.175 * 0.36, 0.063);
zeigt('RS', [...d['KiBaustoffeInhalt.schritte_13'], ...d['KiBaustoffeInhalt.schritte_14']], '0,057', '0,063', '0,061');

// 3. Übungen (src/data/kiUebungen.ts): U-Wert-Testfall und Rechenfehler im Prüftext
const rt = 0.13 + 0.015 / 0.51 + 0.175 / 0.99 + 0.16 / 0.035 + 0.04;
pruefe('UE1 R_T', rt, 4.94761); pruefe('UE1 U', 1 / rt, 0.202118);
const uebText = JSON.stringify(UEBUNGEN);
gilt(uebText.includes('R_T ≈ 4,95') && uebText.includes('U ≈ 0,20'), 'UE1 Erwartungshorizont R_T ≈ 4,95 / U ≈ 0,20');
gilt(uebText.includes('320 · 0,55 = 176'), 'UE2 Korrektur Wassergehalt 176 kg/m³');

// 4. Digitales
const o = ot.daten as Record<string, { formel: string }[]>;
pruefe('OT1 Durchbiegung', 5 * 3.0 * 5000 ** 4 / (384 * 11000 * (120 * 240 ** 3 / 12)), 16.0551);
zeigt('OT', [...o['OnlineTools.schritte'], ...o['OnlineTools.schritte_2']], '15,6', '16,1', '11,0');
const b = bim.daten as Record<string, { formel: string }[]>;
pruefe('BIM1 GWP Wand', 12 * 3 * 0.24 * 280, 2419.2);
pruefe('BIM2 U', 1 / (0.13 + 0.015 / 0.7 + 0.2 / 2.3 + 0.16 / 0.035 + 0.04), 0.206193);
zeigt('BIM', [...b['BimBaustoffe.schritte'], ...b['BimBaustoffe.schritte_2']], '2419', '4,85', '0,21');
// T14-BIM-1: GWP-Lehrwert Baustahl ≈ 0,64 kg CO₂-Äq./kg · 7850 kg/m³ (ÖKOBAUDAT-Referenz wie src/data/rechnerGrenzen.ts)
const stahl = (bim.daten.ARCHETYPES as { id: string; defaultGwp: number; defaultDensity: number }[]).find(a => a.id === 'stahl');
gilt(!!stahl && nahe(stahl.defaultGwp / stahl.defaultDensity, 0.64, 0.03), `BIM3 Stahl-GWP ${stahl?.defaultGwp} kg/m³ ≠ 0,64 kg/kg`);
// T14-BIM-4 (Umsetzung 29.10.2026): Mineralwolle einheitlich mit Materialdatenbanken 1,20 kg CO₂-Äq./kg → 60 kg/m³ · 1,20 = 72 kg/m³
const mw = (bim.daten.ARCHETYPES as { id: string; defaultGwp: number; defaultDensity: number }[]).find(a => a.id === 'mineralwolle');
pruefe('BIM4 Mineralwolle GWP/m³', mw?.defaultGwp ?? NaN, 60 * 1.2);
gilt(!!mw && mw.defaultDensity === 60, `BIM4 Mineralwolle Rohdichte ${mw?.defaultDensity} (soll 60)`);
gilt(JSON.stringify(mdb).includes('Mineralwolle: 1,20 kg CO₂e je kg'), 'BIM4 Bezugswert 1,20 kg/kg im Modul Materialdatenbanken');
const m = mdb.daten as Record<string, { formel: string }[]>;
pruefe('MDB1 GWP Außenwand', 0.175 * 1800 * 0.13 + 0.14 * 20 * 3.3, 50.19);
zeigt('MDB', [...m['Materialdatenbanken.schritte'], ...m['Materialdatenbanken.schritte_2']], '50,2', '5,76');
const p = mp.daten as Record<string, { formel: string }[]>;
pruefe('MP-B1 Recyclingquote', (300 * 0.9 + 20 * 0.95 + 5 * 0.6) / 327, 0.89297);
pruefe('MP-B2 MCI', 1 - (0.7 + 0.3) / 2 * 0.9, 0.55);
zeigt('MP', [...p['Materialpaesse.schritte'], ...p['Materialpaesse.schritte_2']], '292', '327', '89,3', '0,55');
const e = dpp.daten as Record<string, { formel: string }[]>;
zeigt('DPP', [...e['DppEpd.schritte'], ...e['DppEpd.schritte_2']], '257', '2000');
// T14-MDB-1: QNG-Bilanzumfang ohne A4/A5 und C1/C2
const qng = mdb.texte.dasQualitätssiegelNachhaltigesGebäude;
gilt(qng.includes('B4') && qng.includes('B6') && qng.includes('C3/C4') && !qng.includes('A4-A5') && !qng.includes('C1-C4'), 'MDB QNG-Lebenszyklusmodule');

// T14-MDB-5 (Umsetzung 29.10.2026): Konsole mit EN 15804+A2-Indikatoren. Sollwerte aus eigenem Skript:
// Quellwert der öffentlichen EPD (A1–A3) · GWP-Verhältnis, gerundet auf zwei geltende Ziffern.
const P_JE_PO4 = 30.974 / 94.971;
const quellA2: [string, number, number, number, number, number][] = [
  // id, Faktor GWP Datensatz/Quelle, AP, EP-Süßwasser, EP-Meer, EP-terrestrisch (Quell-EPD)
  ['o-1', 245 / 191, 0.216, 0.0189, 0.0698, 0.890],
  ['o-2', 1, 0.468, 0.0917, 0.194, 2.16],
  ['o-3', 1120 / 598.8, 1.711, 25.03e-3 * P_JE_PO4, 0.4093, 4.687],
  ['o-4', 45.5 / 115, 0.815, 5.71e-4, 0.0869, 2.35],
  ['o-5', 680 / 665, 0.94, 7.01e-4, 0.24, 3.07],
  ['o-6', 110 / 176, 0.198, 4.82e-5, 0.0664, 0.729],
  ['o-7', 1.85 / 2.72236, 0.0045448, 1.29796e-5, 0.00143098, 0.0152224],
];
for (const [id, f, ap, fw, mr, la] of quellA2) {
  const w = LEHRWERTE_A2[id];
  gilt(!!w, `MDB5 ${id} fehlt`);
  if (!w) continue;
  // Rundung auf zwei geltende Ziffern → Abweichung ≤ 5 %
  pruefe(`MDB5 ${id} AP`, w.ap, ap * f, 0.05);
  pruefe(`MDB5 ${id} EP-Süßwasser`, w.epSuesswasser, fw * f, 0.05);
  pruefe(`MDB5 ${id} EP-Meer`, w.epMeer, mr * f, 0.05);
  pruefe(`MDB5 ${id} EP-terrestrisch`, w.epLand, la * f, 0.05);
  pruefe(`MDB5 ${id} Faktor`, w.faktor, f, 0.01);
}
const mdbTsx = readFileSync('src/modules/Materialdatenbanken.tsx', 'utf-8');
gilt(mdbTsx.includes('mol H⁺-Äq.') && mdbTsx.includes('kg P-Äq.') && mdbTsx.includes('kg N-Äq.') && mdbTsx.includes('mol N-Äq.'), 'MDB5 Einheiten EN 15804+A2 in der Konsole');
gilt(!mdbTsx.includes('SO₂-eq') && !mdbTsx.includes('PO₄-eq'), 'MDB5 keine A1-Einheiten mehr in der Konsole');
gilt(mdb.texte.lehrwerteA2Hinweis.includes('Lehrwerte, vorläufig'), 'MDB5 Kennzeichnung „Lehrwerte, vorläufig“');

// Umsetzung 29.10.2026: Formulare/Vorlagen ohne vorbelegte Personennamen („[Name]“)
const namen: [string, string][] = [
  ['content/ki/KiDeklarationGuide.json', 'erstpruefungPlatzhalter'],
  ['content/bauschaeden/Bauschaeden.json', 'ingenieurbüroDrIngM'],
  ['content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json', 'frDrMeierUntergeordnete'],
];
for (const [datei, schluessel] of namen) {
  const j = JSON.parse(readFileSync(datei, 'utf-8')) as { werte: Record<string, string> };
  gilt(j.werte[schluessel]?.includes('[Name]'), `Formular ${datei}: ${schluessel} ohne Platzhalter „[Name]“`);
}
const kiDekl = readFileSync('content/ki/KiDeklarationGuide.json', 'utf-8');
gilt(!/Prof\. Dr\.-Ing\. [A-ZÄÖÜ]/.test(kiDekl), 'KI-Deklarationsformular mit vorbelegtem Prüfernamen');
const btb = JSON.parse(readFileSync('content/bautagebuch/Bautagebuch.json', 'utf-8')) as { daten: { PROJECTS: { structuralEngineer: string }[] } };
gilt(btb.daten.PROJECTS.every(p => p.structuralEngineer.includes('[Name]')), 'Bautagebuch: Tragwerksplanung ohne Platzhalter „[Name]“');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Modulprüfung Tranche 14');
