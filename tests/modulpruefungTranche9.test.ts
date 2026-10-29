// Modulprüfung Tranche 9 (28.10.2026): unabhängige Nachrechnungen der Rechenkerne (Befundliste docs/pruefung/module-tranche-9.md).
// Die Sollwerte stammen aus einem eigenen Prüfskript (eigene Umsetzung der Gleichungen in Python),
// nicht aus den Kernen oder vorhandenen Tests übernommen.
import { verdunstungsrate, nachbehandlungsdauer } from '../src/calc/hydratation';
import { bemessungswerteBeton, festigkeitsentwicklung } from '../src/calc/pruefverfahren';
import { festbetonStatistik, konformitaetDruck } from '../src/calc/festbetonStatistik';
import { biokohleBilanz } from '../src/calc/biokohlebeton';
import { carbonbetonBiegung } from '../src/calc/carbonbeton';
import { rcBilanz } from '../src/calc/rcGesteinskoernung';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Modulprüfung Tranche 9 (Nachrechnungen) ---');

// 1. Nachbehandlung: Verdunstungsrate nach Uno (ACI 305R) und Mindestdauer nach DIN 1045-3 (Nachbehandlungsklasse 3)
const nb1 = verdunstungsrate({ tLuft: 25, tBeton: 25, rh: 30, wind: 25 });
pruefe('NB1 E (Beispiel des Moduls)', nb1.E, 1.23066); gilt(nb1.kritisch, 'NB1 kritisch (> 1,0 kg/(m²h))');
const nb2 = verdunstungsrate({ tLuft: 25, tBeton: 25, rh: 50, wind: 15 });
pruefe('NB2 E (Standardwerte)', nb2.E, 0.575923); gilt(!nb2.kritisch, 'NB2 nicht kritisch');
pruefe('NB3 E (Beton 30 °C, Luft 20 °C)', verdunstungsrate({ tLuft: 20, tBeton: 30, rh: 40, wind: 20 }).E, 1.48824);
const nb4 = verdunstungsrate({ tLuft: 20, tBeton: 10, rh: 90, wind: 0 });
gilt(nb4.E === 0 && nb4.Eroh < 0, 'NB4 negativer Rechenwert → E = 0');
gilt(nachbehandlungsdauer('langsam', 'andere', '10_15').tage === 7, 'NB5 10–15 °C, langsam: 7 d');
gilt(nachbehandlungsdauer('sehr_langsam', 'xm', '5_10').tage === 30, 'NB6 5–10 °C, sehr langsam, XM: 30 d');
gilt(nachbehandlungsdauer('schnell', 'x0_xc1', 'ge25').tage === 0.5, 'NB7 X0/XC1: 0,5 d');
gilt(nachbehandlungsdauer('mittel', 'andere', '<5').sondermassnahmen, 'NB8 unter 5 °C: Sondermaßnahmen');

// 2. Festbeton: Bemessungswerte, β_cc(t) nach DIN EN 1992-1-1 Gl. (3.2), Statistik und Konformität (DIN EN 206, 8.2.1)
const bw = bemessungswerteBeton(25, 1.8, 0.85, 0.85, 1.5);
pruefe('FB1 f_cd C25/30', bw.fcd, 14.1667); pruefe('FB1 f_ctd C25/30', bw.fctd, 1.02);
const fe = festigkeitsentwicklung({ fck: 30, alterTage: 7, zement: 'N', geometrie: 'zyl_150', lagerung: 'norm' });
pruefe('FB2 β_cc(7 d, N)', fe.betaCc, 0.778801); pruefe('FB2 f_cm(7)', fe.fcmT, 29.5944); pruefe('FB2 f_ck(7)', fe.fckT, 21.5944);
pruefe('FB2 Würfel 150', festigkeitsentwicklung({ fck: 30, alterTage: 7, zement: 'N', geometrie: 'cube_150', lagerung: 'norm' }).fcmTeff, 36.4998);
pruefe('FB3 f_cm(3 d, R)', festigkeitsentwicklung({ fck: 30, alterTage: 3, zement: 'R', geometrie: 'zyl_150', lagerung: 'norm' }).fcmT, 25.1932);
const st = festbetonStatistik({ fcm: 38, sigma: 3.5, format: 'zylinder', alphaCc: 0.85, gammaC: 1.5, pruefArt: 'erst' });
pruefe('FB4 f_ck', st.fckCyl, 32.2425); pruefe('FB4 f_cd', st.fcd, 18.2707);
pruefe('FB4 Mindestmittelwert', st.mindestMittelwert, 36.2425); pruefe('FB4 Mindesteinzelwert', st.mindestEinzelwert, 28.2425);
const k1 = konformitaetDruck({ werte: [34.5, 33.2, 35.8], fckCube: 30, pruefArt: 'erst' });
pruefe('FB5 Mittelwert', k1.mittelwert, 34.5); pruefe('FB5 Soll', k1.sollMittelwert, 34); gilt(k1.bestanden, 'FB5 Erstherstellung C25/30 bestanden');
const w15 = [41, 43, 39.5, 42, 44, 40, 41.5, 42.5, 43.5, 40.5, 42, 41, 44.5, 39, 42];
const k2 = konformitaetDruck({ werte: w15, fckCube: 37, pruefArt: 'stetig', sigmaVorserie: 2.2 });
pruefe('FB6 Mittelwert', k2.mittelwert, 41.7333); pruefe('FB6 s', k2.s, 1.61319); pruefe('FB6 Soll (σ = 3)', k2.sollMittelwert, 41.44);
gilt(k2.bestanden, 'FB6 stetige Herstellung C30/37 bestanden');

// 3. Biokohlebeton: CO₂-Bilanz je m³ (44/12, F_perm nach IPCC 2019 Refinement, Tab. 4AP.2)
const b1 = biokohleBilanz({ mPK: 10, cGehalt: 80, fPerm: 0.80, ePK: 0.3, zRef: 320, deltaZ: 0, gwpZ: 0.80, w: 160, wAufnahme: 200 });
pruefe('BK1 CO₂ brutto', b1.co2Brutto, 29.3333); pruefe('BK1 Speicher', b1.co2Speicher, 23.4667); pruefe('BK1 Netto', b1.nettoPK, 20.4667);
pruefe('BK1 GWP neu', b1.gwpNeu, 235.533); pruefe('BK1 Minderung %', b1.minderungProzent, 7.99479);
pruefe('BK1 Dosierung M.-% z', b1.dosierungZ, 3.125); pruefe('BK1 Vornässwasser', b1.wVornass, 20); pruefe('BK1 w/z', b1.wzNeu, 0.5);
const b2 = biokohleBilanz({ mPK: 15, cGehalt: 70, fPerm: 0.65, ePK: 0.5, zRef: 340, deltaZ: 30, gwpZ: 0.65, w: 170, wAufnahme: 150 });
pruefe('BK2 Speicher', b2.co2Speicher, 25.025); pruefe('BK2 Zementeinsparung', b2.eZement, 19.5); pruefe('BK2 Minderung', b2.minderung, 37.025);
pruefe('BK2 Minderung %', b2.minderungProzent, 16.7534); pruefe('BK2 w/z', b2.wzNeu, 0.548387);
const b3 = biokohleBilanz({ mPK: 1, cGehalt: 80, fPerm: 0.80, ePK: 0.3, zRef: 300, deltaZ: 0, gwpZ: 0.80, w: 150, wAufnahme: 0 });
pruefe('BK3 Zementäquivalent je kg Kohle', b3.nettoPK / 0.80, 2.55833);

// Umsetzung 29.10.2026 (Entscheidungen 28.10. nachts)
// T9-NB-1: XF3/XF4 doppelte Dauer wie XM (vorläufig): 5 ≤ T < 10 °C, sehr langsam → 2 · 15 = 30 d; < 5 °C mit Verlängerungshinweis
const nbXf = nachbehandlungsdauer('sehr_langsam', 'xf34', '5_10');
gilt(nbXf.tage === 30 && nbXf.hinweise.some(h => h.text.includes('vorläufig')), 'NB7 XF3/XF4 → 30 d, vorläufig');
gilt(nachbehandlungsdauer('mittel', 'andere', '<5').hinweise.some(h => h.text.includes('verlängern')), 'NB8 < 5 °C Verlängerung');
// T9-CB-1: Dehnungskontrolle – CB2/CB3: ε_c wäre 3,79 ‰ → Beton maßgebend, x = 8,20 mm, σ_tex = 1 860, m_Rd = 4,97 kNm/m
const cb = carbonbetonBiegung({ h: 40, c: 10, aTex: 100, fTk: 2500, eTexGPa: 200, fCk: 50 });
pruefe('CB3 x', cb.x, 8.204); pruefe('CB3 σ_tex', cb.sigmaTex, 1859.8); pruefe('CB3 m_Rd', cb.mRd, 4.969); pruefe('CB1 m_Rd ohne Kontrolle', cb.mRdOhneDehnungskontrolle, 5.117);
gilt(cb.versagen === 'beton', 'CB2 Beton maßgebend');
// T12-RE-1 (Betonteil, mit T9-GL-1): RC 45 Vol.-% der groben Gesteinskörnung (70 %) → 31,5 % der Gesteinskörnung
pruefe('RE1 RC-Anteil', rcBilanz(1, 'typ1', 'x0_xc_xf1_xf3').anteilGesamt, 0.315, 1e-9);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Modulprüfung Tranche 9');
