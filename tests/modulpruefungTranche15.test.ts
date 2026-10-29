// Modulprüfung Tranche 15 (29.10.2026): unabhängige Nachrechnungen der Beispielrechnungen (rechnung_beton, rechnung_stahlbeton,
// rechnung_holzbau, rechnung_nachhaltigkeit, rechnung_bestand) und der Rechenbeispiele in Praxiswissen/Bautagebuch
// (Befundliste docs/pruefung/module-tranche-15.md). Die Sollwerte stammen aus einem eigenen Prüfskript (eigene Umsetzung der
// Gleichungen in Python), nicht aus den Kernen oder vorhandenen Tests. Die Beispielrechnungen rechnen seit dieser Prüfung über die
// Kerne in src/calc/ (vorher inline in src/modules/Beispielrechnungen.tsx); geprüft werden daher die Kernaufrufe mit den Eingaben
// des Moduls.
import { stoffraum, K_WERT_DIN1045_2, maxFaFaktor, type MischungEingabe } from '../src/calc/mischung';
import { temperaturFaktor, betaCc, ZEMENT_S, ausschalVergleich, AUSSCHAL_VORGABE_LEHRANNAHME } from '../src/calc/betonkennwerte';
import { insituDruckfestigkeit13791 } from '../src/calc/bauwerksuntersuchung';
import { ZEMENT_GWP_KG, ZEMENT_GWP_BRUTTO_KG, KLINKER_MITTE, lehrwertAusKlinker } from '../src/data/zementGwp';
import { ZEMENT_DATA } from '../src/calc/mischung';
import { ZEMENT_GWP_JE_KG } from '../src/calc/materialoptimierung';
import { LCA_BENCHMARKS } from '../src/modules/lca/transportbetonKennwerte';
import { historicalData } from '../src/data/historicalMaterialsData';
import { fckZumAlter, fcdBeton, FCD_MODUL, HOLZ_EN338, ALTBETON_ZUORDNUNG } from '../src/data/kennwerte';
import { bemesseBiegung, MU_LIM_STAHL } from '../src/calc/biegung';
import { bemesseDruckstab } from '../src/calc/holzbau';
import { bemesseVerankerung } from '../src/calc/verankerung';
import praxis from '../content/praxiswissen/Praxiswissen.json';
import beton from '../content/beispielrechnungen/RechnungBeton.json';
import bestand from '../content/beispielrechnungen/RechnungBestand.json';
import nachhaltigkeit from '../content/beispielrechnungen/RechnungNachhaltigkeit.json';
import labor from '../content/laborsicherheit/LaborSicherheit.json';
import bautagebuch from '../content/bautagebuch/Bautagebuch.json';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Modulprüfung Tranche 15 (Nachrechnungen) ---');

// 1. rechnung_beton – Mischungsentwurf (Stoffraum, Modulwerte ρ_z 3,10, ρ_g 2,65, 1,5 % Luft)
const mischung = (z: number, w: number): MischungEingabe => ({
  zement: z, rhoZement: 3.10, wasser: w, fa: 0, sf: 0, hues: 0, biochar: 0, zusatzmittel: 0, luft: 1.5, stahlfaser: 0, ppFaser: 0,
  rhoGestein: 2.65, fraktionen: [{ anteil: 100, feuchte: 0, wa: 0 }], biocharFeuchte: 0, biocharWa: 0,
  k: { fa: K_WERT_DIN1045_2.kF, sf: K_WERT_DIN1045_2.kS, hues: 0, biochar: 0 }, maxFaFaktor: maxFaFaktor('CEM I'),
});
const xc4 = stoffraum(mischung(175 / 0.60, 175));
pruefe('BE1 XC4/F3/32 V_g', xc4.volGestein, 715.914); pruefe('BE1 m_g', xc4.masseGestein, 1897.172); pruefe('BE1 ρ_fb', xc4.rohdichte * 1000, 2363.839);
const xd3 = stoffraum(mischung(175 / 0.45, 175));
pruefe('BE2 XD3/F3/32 z', 175 / 0.45, 388.889); pruefe('BE2 m_g', xd3.masseGestein, 1814.063); pruefe('BE2 ρ_fb', xd3.rohdichte * 1000, 2377.952);
const f2 = stoffraum(mischung(Math.max(165 / 0.60, 280), 165));
pruefe('BE3 XC4/F2 (z_min 280) w/z', f2.wz, 0.5893); pruefe('BE3 m_g', f2.masseGestein, 1933.645);
// k-Wert-Ansatz (DIN 1045-2): w/z_eq = w/(z + k·f_anr)
gilt(K_WERT_DIN1045_2.kF === 0.4 && K_WERT_DIN1045_2.kS === 1.0 && K_WERT_DIN1045_2.maxSfFaktor === 0.11 && maxFaFaktor('CEM I') === 0.33, 'BE4 k-Werte und Grenzen DIN 1045-2');
const kw = (z: number, f: number, w: number, fa: boolean) => {
  const k = fa ? K_WERT_DIN1045_2.kF : K_WERT_DIN1045_2.kS;
  const anr = Math.min(f, (fa ? maxFaFaktor('CEM I') : K_WERT_DIN1045_2.maxSfFaktor) * z);
  return w / (z + k * anr);
};
pruefe('BE4 FA 300/60/150', kw(300, 60, 150, true), 0.46296); pruefe('BE4 SF 300/60/150 (s ≤ 33)', kw(300, 60, 150, false), 0.45045);
pruefe('BE4 FA 300/120/150 (f ≤ 99)', kw(300, 120, 150, true), 0.44170);
// Frischbetontemperatur (Energiebilanz, Bezug 0 °C; c_z = c_g = 0,84, c_w = 4,18 kJ/(kg·K), Schmelzwärme 334 kJ/kg)
const tb = (Tz: number, Tw: number, Tg: number, eis = 0) => (320 * 0.84 * Tz + 1850 * 0.84 * Tg + (165 - eis) * 4.18 * Tw - eis * 334) / (320 * 0.84 + 1850 * 0.84 + 165 * 4.18);
pruefe('BE5 T_b Ausgang', tb(20, 12, 4), 7.9078); pruefe('BE5 T_W 50 °C', tb(20, 50, 4), 18.3391); pruefe('BE5 T_G 14 °C', tb(20, 12, 14), 14.0929);
pruefe('BE5 20 kg Eis', tb(20, 12, 4, 20), 4.8498);
// Festigkeitsentwicklung (T15-BE-1): t_T nach Gl. (B.10), β_cc nach Gl. (3.2), f_ck(t) = f_cm(t) − 8 für t < 28 d
const fest = (fck: number, kl: 'S' | 'N' | 'R', t: number, T: number) => {
  const tT = Math.max(0.1, t * temperaturFaktor(T));
  const b = betaCc(ZEMENT_S[kl], tT);
  return { tT, b, fcm: b * (fck + 8), fckt: fckZumAlter(fck, b * (fck + 8), tT) };
};
const f1 = fest(25, 'N', 7, 12);
pruefe('BE6 C25/30 N 7 d 12 °C t_T', f1.tT, 4.7627); pruefe('BE6 β_cc', f1.b, 0.7004); pruefe('BE6 f_cm(t)', f1.fcm, 23.1118);
pruefe('BE6 f_ck(t) = f_cm(t) − 8 (vorher β_cc·f_ck = 17,52)', f1.fckt, 15.1118);
const f3 = fest(30, 'R', 3, 20);
pruefe('BE7 C30/37 R 3 d 20 °C f_ck(t)', f3.fckt, 17.1788); pruefe('BE7 f_cm(t)', f3.fcm, 25.1788);
pruefe('BE8 C40/50 S 14 d 5 °C f_ck(t)', fest(40, 'S', 14, 5).fckt, 24.2583);
gilt(fest(25, 'N', 56, 20).fckt === 25, 'BE9 f_ck(t) = f_ck für t_T ≥ 28 d');
gilt(ZEMENT_S.S === 0.38 && ZEMENT_S.N === 0.25 && ZEMENT_S.R === 0.20, 'BE10 s-Werte EC2 3.1.2(6)');

// 2. rechnung_stahlbeton – µ-Verfahren mit dem Kern (Spannungsblock λ = 0,8, η = 1, ξ_lim = 0,45)
const bieg = (med: number, fck: number, b: number, h: number) => bemesseBiegung({ b, h, d1: 4.5, d2: 4.5, med, fck, bewehrung: 'Stahl', fyk: 500, ftk: 0, gammaFRP: 1 });
const sb1 = bieg(160, 25, 30, 50);
pruefe('SB1 f_cd C25/30', sb1.fcd, 14.1667); pruefe('SB1 µ_Ed', sb1.mu_Ed, 0.18185); pruefe('SB1 ω', sb1.omega, 0.20232);
pruefe('SB1 A_s,erf', sb1.as1_req, 8.9981); pruefe('SB1 ζ = 1 − ω/2', 1 - sb1.omega / 2, 0.89884); pruefe('SB1 A_s,min (NA DE, f_ctm 2,6 nach Tab. 3.1)', sb1.as_min, 1.5873);
pruefe('SB2 M_Ed 240', bieg(240, 25, 30, 50).as1_req, 14.4933); pruefe('SB3 C30/37', bieg(160, 30, 30, 50).as1_req, 8.816);
pruefe('SB4 h = 60 cm', bieg(160, 25, 30, 60).as1_req, 7.0945); pruefe('SB5 b = 40 cm', bieg(160, 25, 40, 50).as1_req, 8.7306);
pruefe('SB6 µ_lim', MU_LIM_STAHL, 0.29520); gilt(bieg(300, 25, 30, 50).mu_Ed > MU_LIM_STAHL, 'SB6 M_Ed 300 kNm: µ_Ed > µ_lim');
// Stabwahl (T15-SB-2): n = ⌈A_s/A_s,1⌉ für Ø 16/20/25 bei A_s = 9,00 cm²
const stab = (as: number, d: number) => Math.max(2, Math.ceil(as / (Math.PI * d * d / 400) - 1e-9));
gilt(stab(sb1.as1_req, 16) === 5 && stab(sb1.as1_req, 20) === 3 && stab(sb1.as1_req, 25) === 2, 'SB7 Stabwahl 5 Ø 16 / 3 Ø 20 / 2 Ø 25');

// 3. rechnung_holzbau – Knicknachweis mit dem Kern (C24/C30, NKL 1, KLED kurz, Euler-Fall 2)
const holz = (L: number, a: number, N: number, kl: 'C24' | 'C30' = 'C24') => bemesseDruckstab({ b: a * 10, h: a * 10, laenge: L, eulerFall: 2, nEd: N, fc0k: HOLZ_EN338[kl].fc0k, E005: HOLZ_EN338[kl].E005, brettschichtholz: false, nkl: 1, kled: 'krt' });
const h1 = holz(3.0, 14, 65);
pruefe('HO1 λ', h1.lambda_z, 74.2307); pruefe('HO1 λ_rel', h1.lambda_rel_z, 1.2587); pruefe('HO1 k_c', h1.k_cz, 0.5068); pruefe('HO1 f_c,0,d', h1.f_c0d, 14.5385);
pruefe('HO1 η', h1.utilization / 100, 0.4501);
pruefe('HO2 L = 6 m η', holz(6.0, 14, 65).utilization / 100, 1.5641); pruefe('HO2 k_c', holz(6.0, 14, 65).k_cz, 0.1458);
pruefe('HO3 12 × 12 cm η', holz(3.0, 12, 65).utilization / 100, 0.7892); pruefe('HO4 C30 η', holz(3.0, 14, 65, 'C30').utilization / 100, 0.4114);

// 4. rechnung_nachhaltigkeit – CO₂-Aufnahme (M(CO₂)/M(CaO) = 44,01/56,08) und GWP-Vergleich
const uptake = (k: number, t: number) => (k * Math.sqrt(t)) / 1000 * 300 * 0.65 * 0.60 * (44.01 / 56.08);
pruefe('NH1 k 4, 50 a', uptake(4, 50), 2.59701); pruefe('NH2 k 4, 100 a', uptake(4, 100), 3.67273);
const gwp = (cA: number, gA: number, cB: number, gB: number) => { const A = 450 * cA / 1000 * gA / 1000, B = 450 * cB / 1000 * gB / 1000; return { d: A - B, p: (A - B) / A * 100 }; };
// Umsetzung 29.10.2026 (T15-NH-3): Vorgaben CEM I 665 kg/t (VDZ-Branchen-EPD 2022, netto), CEM III/B 260 kg/t (Lehrwert); vorher 850/290
pruefe('NH3 ΔGWP Vorgabe', gwp(340, 665, 350, 260).d, 60.795); pruefe('NH3 Einsparung %', gwp(340, 665, 350, 260).p, 59.7523);
pruefe('NH4 c_B 450', gwp(340, 665, 450, 260).p, 48.2530);
gilt(!nachhaltigkeit.texte.typisch103.includes('Innenbereich/trocken'), 'T15-NH-1 Richtwerte k nicht mehr vertauscht (innen schneller als außen beregnet)');

// 5. rechnung_bestand – Umsetzung 29.10.2026 (T15-BS-3 bis -6): Zuordnungstabelle (Schnell/Fischer/Loch 2008, Tab. 2.1) statt
//    Lehransatz 0,8·β_W/0,95 − 3 (vorher B 225: f_cd 9,04; B 300: 12,62 N/mm²); Fließkraft unverändert
const fcdTab = (fck: number | null) => fcdBeton(fck ?? NaN, FCD_MODUL.beispielBestand);
pruefe('BS1 B 225 untere Grenze f_cd = 0,85·10,1/1,5', fcdTab(ALTBETON_ZUORDNUNG.B225.fckUnten), 5.72333); pruefe('BS1 B 225 obere Grenze', fcdTab(ALTBETON_ZUORDNUNG.B225.fckOben), 6.97);
pruefe('BS2 B 300 untere Grenze f_cd = 0,85·15,5/1,5', fcdTab(ALTBETON_ZUORDNUNG.B300.fckUnten), 8.78333);
pruefe('BS3 C20/25 f_cd', fcdBeton(20, FCD_MODUL.beispielBestand), 11.3333);
const fyd = (fy: number) => (Math.PI * 144 / 4) * fy / 1.15 / 1000;
pruefe('BS4 Ø 12 BSt 220', fyd(220), 21.636); pruefe('BS4 Ø 12 BSt 500', fyd(500), 49.1728);
gilt(bestand.texte.achtungUnberuhigtVergossenerGlatter.includes('GU') && !JSON.stringify(bestand).includes('unberuhigt vergossen') && !bestand.werte.historischeFestigkeitsklasseDin1045.includes('DIN 1045:1972'), 'T15-BS-1/-2 Bezeichnungen (GU, vor 1972)');

// 6. Praxiswissen und Bautagebuch – Rechenbeispiele
const ver = bemesseVerankerung({ fck: 25, fyk: 500, phi: 12, verbund: 'gut', beanspruchung: 'zug', art: 'uebergreifung', form: 'gerade', alpha2: 1, alpha3: 1, alpha5: 1, stossanteil: 'ueber33', asErf: 1, asVorh: 1 });
pruefe('PB1 f_bd C25/30', ver.fbd, 2.7); pruefe('PB1 l_b,rqd Ø 12', ver.lbRqd, 483.333, 2e-3); pruefe('PB1 α_6 (NA DE, Ø < 16, > 33 %)', ver.a6, 1.4);
pruefe('PB1 l_0 = 1,4 · 483', 1.4 * 483, 676.2); gilt(praxis.daten['Praxiswissen.schritte_4'][2].formel.includes('677'), 'T15-PB-1 Beispiel l_0 mit α_6 = 1,4');
pruefe('PB2 w/z nach 10 l Wasser', 175 / 300, 0.58333); pruefe('PP1 d_erf Dämmung', 0.16 / 0.035 * 0.04, 0.182857);
pruefe('PR1 w/z ohne Feuchtekorrektur', 205 / 300, 0.68333); pruefe('PR2 f_cm drei Würfel', (41 + 39 + 43) / 3, 41.0);
pruefe('PK1 Angebot', 100000 * 1.09 * 1.05, 114450); pruefe('PK2 Lohnkosten', 250 * 0.8 * 30, 6000);
pruefe('BT1 Saul f_T(5 °C)', 30 / (5 + 10), 2.0); pruefe('BT2 r = 18/40', 18 / 40, 0.45);
gilt(!JSON.stringify(bautagebuch).includes('verschlüsselt und') && !JSON.stringify(bautagebuch).includes('gerichtsicher'), 'T15-BT-1 keine Zusicherung „verschlüsselt“/„gerichtssicher“');
gilt(labor.texte.jedeNochSoKleine.includes('Bayerische Landesunfallkasse') && !JSON.stringify(labor).includes('109-009') && !labor.texte.krebserzeugendKat1a.includes('1A'), 'T15-LS Unfallkasse, DGUV-Vorschriften, TRGS 906');
gilt(beton.werte.mischtemperaturUnterNull.length > 0 && !beton.texte.ausschaleignungCenRichtwert.includes('CEN'), 'T15-BE-2/-5 Texte');

// 7. Umsetzung 29.10.2026 (Entscheidungen zu Tranche 15) – Sollwerte von Hand
// T15-BE-2: Ausschalen über f_ck(t) gegen Vorgabe der Tragwerksplanung (% von f_ck), Voreinstellung 50 % als Lehrannahme
const au1 = ausschalVergleich(25, 15.1118, AUSSCHAL_VORGABE_LEHRANNAHME);
pruefe('BE-2 Vorgabe 50 % von 25', au1.erforderlich, 12.5); pruefe('BE-2 Anteil f_ck(t)/f_ck', au1.anteil, 0.604472); gilt(au1.erfuellt, 'BE-2 15,11 ≥ 12,5 erfüllt');
gilt(!ausschalVergleich(30, 17.1788, 60).erfuellt && ausschalVergleich(30, 17.1788, 55).erfuellt, 'BE-2 C30/37: 60 % (18,0) nicht, 55 % (16,5) erfüllt');
gilt(beton.texte.ausschalVorgabeHinweis.includes('Lehrannahme') && !JSON.stringify(beton.texte).includes('β_cc = f_cm(t)/f_cm)'), 'BE-2 Texte');
// T15-BE-6: Wasseranspruch als Lehrwerte gekennzeichnet
gilt(beton.texte.derWasserbedarfRichtetSich.includes('Lehrwerte') && !beton.texte.derWasserbedarfRichtetSich.includes('DBV'), 'BE-6 Lehrwerte statt „Erfahrungswerte nach DBV“');
// T15-NH-3: gemeinsame Konstante, VDZ-Branchen-EPD CEM I 665 (brutto 875), CEM II/C-M 400 (brutto 510); Lehrwerte aus Klinkeranteil
gilt(ZEMENT_GWP_KG['CEM I'] === 0.665 && ZEMENT_GWP_KG['CEM II/C-M'] === 0.40 && ZEMENT_GWP_BRUTTO_KG['CEM I'] === 0.875 && ZEMENT_GWP_BRUTTO_KG['CEM II/C-M'] === 0.51, 'NH-3 belegte Werte');
for (const [art, k] of Object.entries(KLINKER_MITTE)) pruefe(`NH-3 Lehrwert ${art}`, ZEMENT_GWP_KG[art as keyof typeof KLINKER_MITTE], lehrwertAusKlinker(k), 1e-9);
pruefe('NH-3 Lehrwert CEM III/B von Hand: 0,400 + 0,265·(0,27 − 0,50)/0,45', 0.400 + 0.265 * (0.27 - 0.50) / 0.45, 0.264556, 1e-5);
gilt(ZEMENT_DATA['CEM I'].co2 === 0.665 && ZEMENT_GWP_JE_KG.cem1 === 0.665 && LCA_BENCHMARKS.gwp_cem_I === 0.665 && LCA_BENCHMARKS.gwp_cem_III_B === 0.26, 'NH-3 Module mit gemeinsamer Konstante');
gilt(nachhaltigkeit.texte.gwpVorgabenQuelle.includes('665') && nachhaltigkeit.texte.gwpVorgabenQuelle.includes('875'), 'NH-3 Quelle netto/brutto im Modul');
// T15-BS-3/-4: gemeinsame Zuordnungstabelle, B 450/B 600 als Spannbeton, Historische Kennwerte aus derselben Tabelle
gilt(ALTBETON_ZUORDNUNG.B225.fckUnten === 10.1 && ALTBETON_ZUORDNUNG.B225.klasseOben === 'C12/15' && ALTBETON_ZUORDNUNG.B300.fckOben === 18.0 && ALTBETON_ZUORDNUNG.B450.spannbeton && ALTBETON_ZUORDNUNG.B600.spannbeton, 'BS-3/-4 Tabelle');
const histB225 = historicalData.beton.data.find(z => z.old.startsWith('B 225'));
gilt(!!histB225 && histB225.new.includes('C8/10') && histB225.new.includes('C12/15') && String(histB225.f_new).includes('10,1'), 'BS-3 Historische Kennwerte aus gemeinsamer Tabelle');
gilt(!historicalData.beton.data.some(z => /^B (120|160|225|300) /.test(z.old) && /C ?(20\/25|25\/30)/.test(z.new)), 'BS-3 alte Zuordnung B 225 → C20/25, B 300 → C25/30 entfernt');
// T15-BS-5: DIN EN 13791 (n ≥ 8): f_ck,is = min(f_m − k_n·s; f_lowest + M); Klasse über 0,85·f_ck,cube
const is1 = insituDruckfestigkeit13791({ n: 8, mittel: 28.5, s: 2.0, kleinster: 25.5, bezug: 'wuerfel' });
pruefe('BS-5 f_ck,is = 28,5 − 2,00·2,0', is1.fckIs, 24.5); gilt(is1.klasse === 'C20/25' && is1.fck === 20 && is1.M === 4, `BS-5 Klasse ${is1.klasse}`);
const is2 = insituDruckfestigkeit13791({ n: 8, mittel: 30.0, s: 2.0, kleinster: 25.5, bezug: 'wuerfel' });
pruefe('BS-5 Mittel 30 → 26,0', is2.fckIs, 26.0); gilt(is2.klasse === 'C25/30', 'BS-5 26,0 ≥ 0,85·30 → C25/30');
gilt(insituDruckfestigkeit13791({ n: 8, mittel: 30.0, s: 3.0, kleinster: 25.5, bezug: 'wuerfel' }).klasse === 'C20/25', 'BS-5 s = 3,0 → 24,0 → C20/25');
const is3 = insituDruckfestigkeit13791({ n: 8, mittel: 30.0, s: 0.5, kleinster: 21.0, bezug: 'wuerfel' });
pruefe('BS-5 kleinster Wert maßgebend: 21 + 4', is3.fckIs, 25.0); gilt(is3.klasse === 'C20/25', 'BS-5 25,0 < 25,5');
pruefe('BS-5 n = 20: 28,5 − 1,76·2,0', insituDruckfestigkeit13791({ n: 20, mittel: 28.5, s: 2.0, kleinster: 25.5, bezug: 'wuerfel' }).fckIs, 24.98);
gilt(insituDruckfestigkeit13791({ n: 8, mittel: 28.5, s: 2.0, kleinster: 25.5, bezug: 'zylinder' }).klasse === 'C25/30', 'BS-5 Zylinderbezug: 24,5 ≥ 0,85·25');
gilt(!insituDruckfestigkeit13791({ n: 7, mittel: 28.5, s: 2.0, kleinster: 25.5, bezug: 'wuerfel' }).gueltig, 'BS-5 n < 8 nicht abgebildet');
// T15-BS-6: Verbund-Lehransätze 30 %/70 % gestrichen
gilt(!/30 %|70 %/.test(bestand.texte.keineSchweißeignungSchweißenIst + bestand.texte.schweißeignungKritischMeistUnberuhigt), 'BS-6 keine 30-/70-%-Ansätze');
gilt(!JSON.stringify(bestand).includes('3,0 N/mm²'), 'BS-3 kein pauschaler Abschlag 3,0 N/mm² mehr');
// T15-LS-4: Funktionsbezeichnungen statt Namen/Durchwahlen, Vermerk passiv ohne Namen
gilt(!/Huber|Lechner|Sedlmeier|Hager|Bolten|5586|-3[0-9]{3}\b/.test(JSON.stringify(labor)), 'LS-4 keine Namen und Durchwahlen');
gilt(labor.werte.oktober2026LaborordnungNotfallplan.includes('durch die Laborleitung geprüft') && labor.texte.ueberHochschulzentrale.includes('Hochschulzentrale') && labor.texte.sicherheitsbeauftragte.includes('Sicherheitsbeauftragte'), 'LS-4 Funktionsbezeichnungen');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Modulprüfung Tranche 15');
