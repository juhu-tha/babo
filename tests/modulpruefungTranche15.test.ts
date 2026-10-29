// Modulprüfung Tranche 15 (29.10.2026): unabhängige Nachrechnungen der Beispielrechnungen (rechnung_beton, rechnung_stahlbeton,
// rechnung_holzbau, rechnung_nachhaltigkeit, rechnung_bestand) und der Rechenbeispiele in Praxiswissen/Bautagebuch
// (Befundliste docs/pruefung/module-tranche-15.md). Die Sollwerte stammen aus einem eigenen Prüfskript (eigene Umsetzung der
// Gleichungen in Python), nicht aus den Kernen oder vorhandenen Tests. Die Beispielrechnungen rechnen seit dieser Prüfung über die
// Kerne in src/calc/ (vorher inline in src/modules/Beispielrechnungen.tsx); geprüft werden daher die Kernaufrufe mit den Eingaben
// des Moduls.
import { stoffraum, K_WERT_DIN1045_2, maxFaFaktor, type MischungEingabe } from '../src/calc/mischung';
import { temperaturFaktor, betaCc, ZEMENT_S } from '../src/calc/betonkennwerte';
import { fckZumAlter, fcdBeton, FCD_MODUL, HOLZ_EN338 } from '../src/data/kennwerte';
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
pruefe('NH3 ΔGWP Vorgabe', gwp(340, 850, 350, 290).d, 84.375); pruefe('NH3 Einsparung %', gwp(340, 850, 350, 290).p, 64.8789);
pruefe('NH4 c_B 450', gwp(340, 850, 450, 290).p, 54.8443);
gilt(!nachhaltigkeit.texte.typisch103.includes('Innenbereich/trocken'), 'T15-NH-1 Richtwerte k nicht mehr vertauscht (innen schneller als außen beregnet)');

// 5. rechnung_bestand – Lehransatz 0,8·β_W/0,95 − 3 und Fließkraft
const fcdBestand = (bw: number) => fcdBeton(0.8 * bw / 0.95 - 3, FCD_MODUL.beispielBestand);
pruefe('BS1 B 225 f_cd', fcdBestand(22.5), 9.0368); pruefe('BS2 B 300 f_cd', fcdBestand(30), 12.6158);
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

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Modulprüfung Tranche 15');
