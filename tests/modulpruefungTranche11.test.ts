// Modulprüfung Tranche 11 (28.10.2026): unabhängige Nachrechnungen der Rechenkerne (Befundliste docs/pruefung/module-tranche-11.md).
// Die Sollwerte stammen aus einem eigenen Prüfskript (eigene Umsetzung der Modell- bzw. Normgleichungen in Python),
// nicht aus den Kernen oder vorhandenen Tests übernommen.
import { energieausweis, effizienzklasse } from '../src/calc/energieausweis';
import { dafstbVergleich } from '../src/calc/materialoptimierung';
import { lccVergleich, rentenbarwertfaktor, barwertfaktorPreissteigerung, type LccOption, type LccParameter } from '../src/calc/lcc';
import { thermischeKennwerte, erforderlicheDaemmdicke, uWert, temperaturverlauf, taupunkt } from '../src/calc/waermeschutz';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Modulprüfung Tranche 11 (Nachrechnungen) ---');

// 1. Energieausweis-Lehrmodell (Pauschalflächen, 72 kKh/a, GModG/GEG Anlage 10)
const ea1 = energieausweis({ typ: 'efh', flaeche: 150, huelle: 'geg_standard', lueftung: 'fenster', heizung: 'gas_brennwert' });
pruefe('EA1 H_T', ea1.h_t, 128.85); pruefe('EA1 H′_T', ea1.h_t_prime, 0.327863); pruefe('EA1 H_V', ea1.h_v, 63.75);
gilt(ea1.q_h === 31 && ea1.q_e === 56 && ea1.q_p === 64 && ea1.co2_emissionen === 13 && ea1.klasse === 'B', `EA1 q_h/q_E/q_P/CO₂/Klasse ${ea1.q_h}/${ea1.q_e}/${ea1.q_p}/${ea1.co2_emissionen}/${ea1.klasse}`);
const ea2 = energieausweis({ typ: 'mfh', flaeche: 800, huelle: 'unsaniert', lueftung: 'fenster', heizung: 'oel_kessel' });
pruefe('EA2 H_T', ea2.h_t, 1851.2);
gilt(ea2.q_h === 128 && ea2.q_e === 187 && ea2.q_p === 209 && ea2.klasse === 'F', `EA2 ${ea2.q_h}/${ea2.q_e}/${ea2.q_p}/${ea2.klasse}`);
const ea3 = energieausweis({ typ: 'efh', flaeche: 150, huelle: 'effizienzhaus40', lueftung: 'kwl_wrg', heizung: 'wp_sole' });
gilt(ea3.q_h === 10 && ea3.q_e === 9 && ea3.q_p === 16 && ea3.klasse === 'A+', `EA3 Mindestwert q_h = 10: ${ea3.q_h}/${ea3.q_e}/${ea3.q_p}/${ea3.klasse}`);
gilt(ea3.hinweise.some(h => h.feld === 'q_h'), 'EA3 Hinweis Mindestwert 10 kWh/(m²a)');
const ea4 = energieausweis({ typ: 'mfh', flaeche: 1200, huelle: 'bestand_teilsaniert', lueftung: 'abluft', heizung: 'fernwaerme' });
gilt(ea4.q_h === 34 && ea4.q_e === 58 && ea4.q_p === 28 && ea4.klasse === 'B', `EA4 ${ea4.q_h}/${ea4.q_e}/${ea4.q_p}/${ea4.klasse}`);
// Umsetzung 29.10.2026 (T11-EA-2/-3): Rechtsstand ab 01.01.2027 und CO₂ nach Anlage 9 (eigenes Prüfskript)
const ea2_27 = energieausweis({ typ: 'mfh', flaeche: 800, huelle: 'unsaniert', lueftung: 'fenster', heizung: 'oel_kessel', rechtsstand: 'ab_2027' });
gilt(ea2.co2_emissionen === 58 && ea2_27.q_p === 208 && ea2_27.co2_emissionen === 58, `EA2 CO₂ 58, 2027 q_P 208: ${ea2.co2_emissionen}/${ea2_27.q_p}`);
const ea3_27 = energieausweis({ typ: 'efh', flaeche: 150, huelle: 'effizienzhaus40', lueftung: 'kwl_wrg', heizung: 'wp_sole', rechtsstand: 'ab_2027' });
gilt(ea3.co2_emissionen === 5 && ea3_27.q_p === 14 && ea3_27.co2_emissionen === 1, `EA3 CO₂ 5 (560 g/kWh), 2027 q_P 14 / CO₂ 1: ${ea3.co2_emissionen}/${ea3_27.q_p}/${ea3_27.co2_emissionen}`);
const ea4_27 = energieausweis({ typ: 'mfh', flaeche: 1200, huelle: 'bestand_teilsaniert', lueftung: 'abluft', heizung: 'fernwaerme', rechtsstand: 'ab_2027' });
gilt(ea4_27.q_p === 43 && ea4_27.klasse === 'B', `EA4 2027 Fernwärme f_p 0,7: ${ea4_27.q_p}`);
gilt(effizienzklasse(30) === 'A+' && effizienzklasse(30.5) === 'A' && effizienzklasse(250) === 'G' && effizienzklasse(251) === 'H', 'EA5 Klassengrenzen Anlage 10');

// 2. Thermische Kennwerte und Dämmdicke (Modulbeispiele Waermeeigenschaften)
const beton = thermischeKennwerte(2.0, 2400, 1000);
pruefe('WE1 b Beton', beton.b, 2190.89); pruefe('WE1 Kontakttemperatur Beton', beton.thetaKontakt, 24.3453);
pruefe('WE1 Kontakttemperatur Fichte', thermischeKennwerte(0.13, 500, 1600).thetaKontakt, 30.0528);
const dd = erforderlicheDaemmdicke(0.24, 0.24, 1.0, [0.035, 0.040, 0.025]);
pruefe('WE2 EPS 035', dd.dickenCm[0], 13.1483); pruefe('WE2 Holzfaser 040', dd.dickenCm[1], 15.0267); pruefe('WE2 PIR 025', dd.dickenCm[2], 9.39167);

// 3. Innen- vs. Außendämmung (Temperaturverlauf, Temperaturfaktor)
const bestand = [{ d: 0.365, lambda: 0.68 }];
const rt0 = uWert(bestand, 0.13, 0.04).R_T;
pruefe('DV1 R_T Bestand', rt0, 0.706765); pruefe('DV1 θ_si Bestand', temperaturverlauf(bestand, 0.13, 0.04, 20, -5)[0], 15.4016);
pruefe('DV1 Grenzschicht Innendämmung', temperaturverlauf([{ d: 0.06, lambda: 0.040 }, ...bestand], 0.13, 0.04, 20, -5)[1], 1.53405);
pruefe('DV1 Grenzschicht Außendämmung', temperaturverlauf([...bestand, { d: 0.06, lambda: 0.040 }], 0.13, 0.04, 20, -5)[1], 12.4464);
pruefe('DV2 f_Rsi Bestand mit R_si = 0,25 (DIN 4108-2)', 1 - 0.25 / rt0, 0.646275);
pruefe('DV3 Taupunkt 20 °C / 50 %', taupunkt(20, 50), 9.26, 2e-3);

// 4. Bauphysik – U-Wert Beispiel 1 und Standardwand des Rechners
pruefe('BP1 U KS + MW', uWert([{ d: 0.015, lambda: 0.70 }, { d: 0.175, lambda: 0.99 }, { d: 0.14, lambda: 0.035 }], 0.13, 0.04).U, 0.228927);
pruefe('BP3 U Standardwand', uWert([{ d: 0.015, lambda: 0.35 }, { d: 0.24, lambda: 0.42 }, { d: 0.16, lambda: 0.035 }, { d: 0.02, lambda: 1.0 }], 0.13, 0.04).U, 0.186022);

// 5. Materialoptimierung (DAfStb-Lehrrechner; Lehrwerte vereinheitlicht am 29.10.2026, T11-MO-3: Beton 320·g_Z + 30, Stahl-Referenz 0,64)
//    Umsetzung 29.10.2026 (T15-NH-3): Zement-GWP CEM I 0,665 (VDZ-Branchen-EPD), CEM II/B-S 0,53, CEM III/A 0,40 → Beton 243/200/158 kg/m³
//    Handrechnung MO1: Ref 26·243 + round(2860·0,64) = 6318 + 1830 = 8148; opt round(158·0,91) = 144 → 19,5·144 + round(2470·0,42) = 2808 + 1037 = 3845
const mo1 = dafstbVergleich({ bauteil: 'decke', bauweise: 'hohlkoerper', zement: 'cem3_a', pruefalter: 56, stahlRoute: 'gruen_eaf' });
gilt(mo1.refTotalGwp === 8148 && mo1.optTotalGwp === 3845 && mo1.optConcreteGwpPerM3 === 144 && mo1.efficiencyClass === 'Klasse A+', `MO1 ${mo1.refTotalGwp}/${mo1.optTotalGwp}/${mo1.efficiencyClass}`);
pruefe('MO1 Δ %', mo1.diffPct, 52.8105);
const mo2 = dafstbVergleich({ bauteil: 'stuetze', bauweise: 'hochfest_c50_schlank', zement: 'cem2_bs', pruefalter: 28, stahlRoute: 'standard_bof' });
gilt(mo2.refTotalGwp === 943 && mo2.optTotalGwp === 450, `MO2 ${mo2.refTotalGwp}/${mo2.optTotalGwp}`); pruefe('MO2 Δ %', mo2.diffPct, 52.2800);
const mo3 = dafstbVergleich({ bauteil: 'bodenplatte', bauweise: 'optimiert_28', zement: 'cem2_all', pruefalter: 28, stahlRoute: 'standard_bof' });
gilt(mo3.optTotalGwp === 10258 && mo3.refTotalGwp === 12625 && mo3.efficiencyClass === 'Klasse C', `MO3 ${mo3.optTotalGwp}/${mo3.efficiencyClass}`); pruefe('MO3 Δ %', mo3.diffPct, 18.7485);
const mo4 = dafstbVergleich({ bauteil: 'wand', bauweise: 'optimiert_18', zement: 'cem1', pruefalter: 56, stahlRoute: 'standard_bof' });
gilt(mo4.optConcreteGwpPerM3 === 221 && mo4.optTotalGwp === 3234 && mo4.efficiencyClass === 'Klasse C' && mo4.hinweise.some(h => h.feld === 'pruefalter'), 'MO4 CEM I mit 56 d: Abschlag und Hinweis');
const mo5 = dafstbVergleich({ bauteil: 'decke', bauweise: 'massiv', zement: 'cem2_all', pruefalter: 28, stahlRoute: 'eaf_de' });
gilt(mo5.optTotalGwp === 6941 && mo5.efficiencyClass === 'Klasse C', `MO5 CEM II/A-LL (≈ ÖKOBAUDAT C25/30) ${mo5.optTotalGwp}`);

// 6. Lebenszykluskosten (Barwertmethode, BNB 2.1.1: Steigerung ab dem 2. Jahr)
pruefe('LCC5 RBF(2 %; 30 a)', rentenbarwertfaktor(0.02, 30), 22.3965);
pruefe('LCC4 Barwertfaktor (r 1,5 %; p 2 %; 50 a)', barwertfaktorPreissteigerung(0.015, 0.02, 50), 55.7034);
const optA: LccOption = { capex: 18000, opex0: 1400, maintenanceInterval: 15, maintenanceCost: 2500, lifespan: 30, replacementCost: 16000, eolCost: 4500, embodiedCO2: 12500, operatingCO2: 1800 };
const par: LccParameter = { r: 0.015, e: 0.05, i: 0.02, N: 50, co2Bepreisung: false, co2Preis: 200, co2Steigerung: 0.02, foerderungB: 0 };
pruefe('LCC1 Option A ohne CO₂', lccVergleich(optA, optA, par).resultA.totalLCCDiscounted, 228237);
pruefe('LCC2 Option A mit CO₂-Preis', lccVergleich(optA, optA, { ...par, co2Bepreisung: true }).resultA.totalLCCDiscounted, 253631);
pruefe('LCC3 Option A mit linearem Restwert', lccVergleich(optA, optA, { ...par, restwertLinear: true }).resultA.totalLCCDiscounted, 223739);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Modulprüfung Tranche 11');
