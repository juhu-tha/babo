// Modulprüfung Tranche 4 (28.10.2026): unabhängige Nachrechnungen der Rechenkerne (Befundliste docs/pruefung/module-tranche-4.md).
// Die Sollwerte stammen aus einem eigenen Prüfskript (eigene Umsetzung der Norm- bzw. Modellgleichungen in Python),
// nicht aus den Kernen oder vorhandenen Tests übernommen.
import { umrechnen } from '../src/calc/einheiten';
import { molmasse, stoffumsatz, zeitBisBewehrung, phAusHydroxid, hydroxidAusPh, akrDehnung, stellmittelViskositaet } from '../src/calc/bauchemie';
import { festbetonStatistik, konformitaetDruck } from '../src/calc/festbetonStatistik';
import { gumMessunsicherheit, ringversuch, werkzeugToleranz, bohrkernPruefung, spaltzugfestigkeit, zugversuchStahl, holzSchaetzung } from '../src/calc/pruefverfahren';
import { rueckprall, rueckprallLehrkurve, rueckprallMesssatz } from '../src/calc/bauwerksuntersuchung';
import { kombination610 } from '../src/calc/sicherheitskonzept';
import materials from '../src/data/materials.json';
import { potentialReihe, auslagerung, frischbeton, druckpruefung, moertelprismen } from '../src/calc/laborversuche';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Modulprüfung Tranche 4 (Nachrechnungen) ---');

// 1. Einheiten (NIST SP 811: exakte Definitionen von lb, g_n, in, kcal_IT)
pruefe('EH1 psi → kPa', umrechnen(1, 'Spannung/Druck', 'psi', 'kPa'), 6.894757, 1e-6);
pruefe('EH2 °F → °C', umrechnen(100, 'Temperatur', '°F', '°C'), 37.777778, 1e-6);
pruefe('EH3 kNm → Nmm', umrechnen(45, 'Moment', 'kNm', 'Nmm'), 45e6, 1e-9);
pruefe('EH4 kWh → kcal', umrechnen(1, 'Energie', 'kWh', 'kcal'), 859.84523, 1e-6);
pruefe('EH5 lbf → N', umrechnen(1000, 'Kraft', 'lbf', 'N'), 4448.2216, 1e-6);

// 2. Bauchemie (Standard-Atomgewichte, Wurzel-t-Gesetz, Lehrmodelle)
pruefe('BC1 M Ca(OH)2', molmasse('Ca(OH)2'), 74.092, 1e-4);
pruefe('BC2 M Ca3SiO5', molmasse('Ca3SiO5'), 228.314, 1e-4);
pruefe('BC3 CO2/Ca(OH)2', stoffumsatz('Ca(OH)2', 'CO2', 1).verhaeltnis, 0.593978, 1e-4);
pruefe('BC4 t bis 40 mm, K = 4', zeitBisBewehrung(40, 4).jahre, 100, 1e-9);
pruefe('BC5 pH Rundreise', phAusHydroxid(hydroxidAusPh(12.6)), 12.6, 1e-9);
pruefe('BC6 AKR-Lehrmodell', akrDehnung(3, 85, 10), 1.222927, 1e-5);
pruefe('BC7 Stellmittel 0,8 %, 15 s⁻¹', stellmittelViskositaet(0.8, 15), 11.4, 1e-9);

// 3. Probenahme: Rückprall mit den zentralen Lehransätzen (T4-PN-1)
pruefe('PN4 Bsp. 3: R = 36 nach oben', rueckprall(36, 'up', 0).rKorr, 31.78, 1e-4);
const pn5 = rueckprall(38, 'horiz', 15);
pruefe('PN5 R = 38, d_k 15 mm: R_final', pn5.rFinal, 32.3, 1e-6); pruefe('PN5 f_c Lehrkurve', pn5.fcSchaetz, 28.01171, 1e-4);
pruefe('PN6 R = 30 nach unten', rueckprall(30, 'down', 0).rKorr, 33.01, 1e-4);
pruefe('PN7 Rohwert R = 38', rueckprallLehrkurve(38), 40.18182, 1e-4);

// 4. Messen & Prüfen (GUM, DIN ISO 13528)
const gum = gumMessunsicherheit([38.5, 39.2, 37.8, 38.9, 39.6], 0.1, 0.15);
pruefe('MP1 s', gum.sampleStdDev, 0.689202, 1e-5); pruefe('MP1 u_c', gum.uc, 0.318525, 1e-5); pruefe('MP1 U', gum.expandedU, 0.637050, 1e-5);
const rv = ringversuch({ x: 46, X: 50, sigmaPt: 1.8, uLab: 1.4, uRef: 0.6, offsetB: 0 });
pruefe('MP2 z', rv.zScore, -2.222222, 1e-6); pruefe('MP2 E_n', rv.enScore, -2.626129, 1e-6);
gilt(rv.zStatus === 'warning' && rv.enStatus === 'critical', 'MP2 Bewertung: z fraglich, E_n nicht zufriedenstellend');
pruefe('MP3 Gliedermaßstab 2 m', werkzeugToleranz('meterstab', 2000), 0.7, 1e-9);

// 5. Mechanische Prüfungen
const kern = bohrkernPruefung({ dMm: 100, hMm: 100, kraftKn: 350, staebe: 0, richtung: 'vertikal' });
pruefe('ME1 Kern h/d = 1 → Würfel', kern.equivalentCube, 44.56338, 1e-5); pruefe('ME1 Zylinder über Klasse', kern.equivalentCylinder, 34.72712, 1e-4);
pruefe('ME2 Spaltzug', spaltzugfestigkeit(250, 150, 300), 3.536777, 1e-5);
const zug = zugversuchStahl({ dMm: 12, kraftReKn: 62, kraftRmKn: 69.5, l0Mm: 100, luMm: 107.5 });
pruefe('ME3 R_e', zug.yieldStrength, 548.2004, 1e-5); pruefe('ME3 R_m/R_e', zug.ratio, 1.120968, 1e-5); pruefe('ME3 A_gt', zug.elongation, 7.5, 1e-9);
gilt(zug.einstufung === 'B500B', 'ME3 Einstufung B500B');
const holz = holzSchaetzung({ rohdichte: 0.46, feuchte: 18, bMm: 100, hMm: 150, stuetzweiteMm: 2700, kraftKn: 20 });
pruefe('ME4 f_m 4-Punkt', holz.f_bending, 24.0, 1e-9); pruefe('ME5 Feuchtefaktor', holz.feuchteFaktor, 0.79, 1e-9);
gilt(holz.niveau === 'C24', 'ME4 Niveau C24');

// 6. Festbeton-Statistik (DIN EN 206, 8.2.1.3)
const fs = festbetonStatistik({ fcm: 38, sigma: 5, format: 'zylinder', alphaCc: 0.85, gammaC: 1.5, pruefArt: 'erst' });
pruefe('FS1 f_ck', fs.fckCyl, 29.775, 1e-9); pruefe('FS1 f_cd', fs.fcd, 16.8725, 1e-9); pruefe('FS1 Mindestmittel', fs.mindestMittelwert, 33.775, 1e-9);
pruefe('FS1 Würfelfaktor', festbetonStatistik({ fcm: 38, sigma: 5, format: 'wuerfel', alphaCc: 0.85, gammaC: 1.5, pruefArt: 'erst' }).faktor, 1.232074, 1e-5);
const k1 = konformitaetDruck({ werte: [41.0, 39.5, 43.2], fckCube: 37, pruefArt: 'erst' });
pruefe('FS2 Mittelwert', k1.mittelwert, 41.23333, 1e-6); gilt(k1.bestanden, 'FS2 Bsp. 1 konform');
const reihe15 = [44, 45, 43, 46, 44.5, 45.5, 43.5, 44, 45, 46, 43, 44, 45, 44.5, 45.5];
const k2 = konformitaetDruck({ werte: reihe15, fckCube: 37, pruefArt: 'stetig', sigmaVorserie: 2.5 });
pruefe('FS4 σ ≥ 3 → Soll', k2.sollMittelwert, 41.44, 1e-9); gilt(k2.anzahlOk && k2.bestanden, 'FS4 n = 15, konform');

// 7. Handouts
const pot = potentialReihe({ eBezugSHE: 197, volumen: 1, pH: 12.6, sprung: 100, messungen: [
  { mNaCl: 0, eMess: -80 }, { mNaCl: 0.5, eMess: -85 }, { mNaCl: 1, eMess: -90 }, { mNaCl: 2, eMess: -100 },
  { mNaCl: 3, eMess: -115 }, { mNaCl: 4, eMess: -330 }, { mNaCl: 6, eMess: -410 }] });
pruefe('HP1 Nullmessung CSE', pot.punkte[0].eCSE, -199, 1e-9); pruefe('HP2 4 g CSE', pot.punkte[5].eCSE, -449, 1e-9);
pruefe('HP3 Cl/OH bei 4 g', pot.punkte[5].clOh, 1.719293, 1e-5); gilt(pot.sprungIndex === 5, 'HP Sprung bei 4 g NaCl');
const nacl = auslagerung({ tage: 28, rho: 7.85, blind: 0.010, proben: [
  { d: 12, l: 100, m0: 88.512, m1: 88.262 }, { d: 12, l: 100.1, m0: 88.430, m1: 88.198 }, { d: 12, l: 99.9, m0: 88.655, m1: 88.390 }] });
pruefe('HA1 Fläche P1', nacl.werte[0].flaeche, 39.96106, 1e-6); pruefe('HA2 Rate NaCl', nacl.mittelVKorr, 99.32194, 1e-5);
pruefe('HA6 P1 g/(m²·d)', nacl.werte[0].rate, 2.144945, 1e-5);
const caoh = auslagerung({ tage: 28, rho: 7.85, blind: 0.010, proben: [
  { d: 12, l: 100, m0: 88.600, m1: 88.588 }, { d: 12, l: 100, m0: 88.541, m1: 88.530 }, { d: 12, l: 100, m0: 88.577, m1: 88.565 }] });
pruefe('HA3 Rate Ca(OH)2', caoh.mittelVKorr, 0.692591, 1e-4);
const fb = frischbeton([
  { d1: 450, d2: 470, mLeer: 3.215, mVoll: 22.045, vol: 8, a1: 2.1, g: 0.2 },
  { d1: 440, d2: 455, mLeer: 3.215, mVoll: 22.020, vol: 8, a1: 2.3, g: 0.2 }], 2400);
pruefe('HF1 Ausbreitmaß P1', fb.werte[0].f, 460, 1e-9); pruefe('HF2 Ausbreitmaß P2', fb.werte[1].f, 450, 1e-9);
pruefe('HF3 Rohdichte', fb.werte[0].rohdichte, 2350, 1e-9); pruefe('HF5 Luft', fb.werte[0].luft, 1.9, 1e-9); pruefe('HF6 Luft aus Rohdichte', fb.werte[0].luftAusDichte, 2.083333, 1e-5);
gilt(fb.werte[0].klasse === 'F3', 'HF1 Klasse F3');
const wuerfel = [{ a: 150.2, b: 149.8, h: 150.1, m: 8.120, F: 955 }, { a: 149.9, b: 150.1, h: 150.0, m: 8.085, F: 980 }, { a: 150.0, b: 150.3, h: 149.8, m: 8.150, F: 935 }];
const dw = druckpruefung({ wuerfel, trocken: false, zielklasse: 'C30/37' });
pruefe('HD2 f_cm', dw.fcm, 42.5, 1e-9); gilt(dw.erreicht === 'C30/37', 'HD2 erreicht C30/37');
const dt = druckpruefung({ wuerfel, trocken: true, zielklasse: 'C30/37' });
pruefe('HD3 f_cm trocken', dt.fcm, 39.1, 1e-9); gilt(dt.erreicht === 'C25/30', 'HD3 trocken nur C25/30');
const mp = moertelprismen([{ Ff: 2.9, Fc1: 79.2, Fc2: 81.0 }, { Ff: 3.1, Fc1: 80.1, Fc2: 78.5 }, { Ff: 3.0, Fc1: 82.3, Fc2: 79.6 }], 28);
pruefe('HM1 R_f', mp.rfMittel, 7.03125, 1e-9); pruefe('HM2 R_c', mp.druck.mittel, 50.07292, 1e-6); gilt(mp.klasse === '42,5', 'HM2 Klasse 42,5');
const mp2 = moertelprismen([{ Ff: 2.9, Fc1: 79.2, Fc2: 81.0 }, { Ff: 3.1, Fc1: 80.1, Fc2: 65.0 }, { Ff: 3.0, Fc1: 82.3, Fc2: 79.6 }], 28);
pruefe('HM3 Mittel der übrigen 5', mp2.druck.mittel, 50.275, 1e-9); gilt(mp2.druck.verworfen === 3 && mp2.druck.gueltig, 'HM3 Wert 4 verworfen, Serie gültig');

// Umsetzung 29.10.2026 (Entscheidungen 28.10. nachts)
// T4-PN-2: Messsatz verwerfen, wenn > 20 % der Einzelwerte > 6 Einheiten vom Median abweichen (vorläufig)
//   9 Werte 36 36 37 38 38 39 40 44 46: Median 38; |44−38| = 6 zählt nicht, 46 → 1 von 9 = 11 % → gültig
const ms1 = rueckprallMesssatz([36, 38, 46, 37, 39, 40, 38, 44, 36]);
pruefe('PN8 Median', ms1.median, 38, 1e-12); gilt(ms1.abweichend.length === 1 && !ms1.verworfen, 'PN8 ein Ausreißer, Messsatz gültig');
//   zwei Werte > 6 Einheiten (27, 47) von 9: 22 % > 20 % → verworfen; mit 10 Werten 2/10 = 20 % → nicht verworfen
const ms2 = rueckprallMesssatz([27, 38, 47, 37, 39, 40, 38, 41, 36]);
gilt(ms2.verworfen && ms2.abweichend.length === 2, 'PN9 2 von 9 → verworfen');
const ms3 = rueckprallMesssatz([27, 38, 47, 37, 39, 40, 38, 41, 36, 38]);
gilt(!ms3.verworfen && Math.abs(ms3.anteil - 0.2) < 1e-12, 'PN10 2 von 10 = 20 % → nicht verworfen');
//   Altregel 25 %: 27 weicht um 29 % ab, 47 um 24 % – die neue Regel zählt beide
gilt(!rueckprallMesssatz([]).gueltig && rueckprallMesssatz([30, 31]).hinweise.some(h => h.text.includes('mindestens 9')), 'PN11 Grenzen Messsatz');
// T4-SK-2: Startwerte und getauschte Leiteinwirkung (23,7 bzw. 23,25 kN)
const sk = kombination610({ gk: 10, qk1: 5, qk2: 3, psi01: 0.7, psi02: 0.6, gammaG: 1.35, gammaQ: 1.5, getauscht: true });
pruefe('SK4 getauscht', sk.ed, 23.25, 1e-12); pruefe('SK4 Maximum', sk.edMax, 23.7, 1e-12);
// T4-MK-1 / T4-KG-1: λ KS 1,8 = 0,99, Mauerziegel 1,6 = 0,68 (DIN 4108-4), c_p Stahl 450 J/(kgK) (DIN EN ISO 10456)
const mat = (id: string) => materials.materials.find(m => m.id === id)!.properties;
pruefe('MK1 λ KS 12', mat('mauerwerk').thermalCond, 0.99, 1e-12); pruefe('MK2 λ MZ 12', mat('ziegel').thermalCond, 0.68, 1e-12);
pruefe('KG6 c_p Baustahl', mat('stahl').heatCap, 450, 1e-12); pruefe('KG7 c_p Spannstahl', mat('spannstahl').heatCap, 450, 1e-12);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: alle Nachrechnungen der Tranche 4 stimmen');
