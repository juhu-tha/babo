// Modulprüfung Tranche 12 (28.10.2026): unabhängige Nachrechnungen der Rechenkerne in den Bereichen Bauen im Bestand,
// Rückbau & Schadstoffe und Dauerhaftigkeit (Befundliste docs/pruefung/module-tranche-12.md).
// Die Sollwerte stammen aus einem eigenen Prüfskript (eigene Umsetzung der Gleichungen in Python),
// nicht aus den Kernen oder vorhandenen Tests übernommen.
import { uRetrofit, dRequired, savings, charValue, designLognormal, fkMasonry, GMODG_ANLAGE7, CO2_ERDGAS, CO2_HEIZOEL, CO2_STROM, CO2_FERNWAERME, CO2_WAERMEPUMPE } from '../src/utils/bestandKern';
import { FAKTOREN } from '../src/calc/energieausweis';
import { SCHWINDBEIWERTE } from '../src/calc/holzphysik';
import { MASSENKENNWERTE_BRI, massenkennwertSumme, rueckbauMassen, type Bauweise } from '../src/calc/rueckbauMassen';
import { rcBilanz, RC_HOECHSTANTEIL } from '../src/calc/rcGesteinskoernung';
import holzbau from '../content/holzbaubeta/HolzbauBeta.json';
import { rueckprallRichtungskorrektur, rueckprall, ultraschall, impactEcho, haftzug, karbonatisierung, bohrkern, karsten, betondeckung } from '../src/calc/bauwerksuntersuchung';
import { pn98Probenzahl, pn98Mindestvolumen } from '../src/calc/probenahme';
import { sortierbilanz } from '../src/calc/altholz';
import { pfasSummenbewertung, type PfasId } from '../src/calc/pfas';
import { zinkSchutzdauer } from '../src/calc/korrosionsschutz';
import { karbonatisierungsLebensdauer } from '../src/calc/korrosion';
import bbod from '../content/abfaelle/Altlasten.json';
import { ALTBETON_1972_2001, altbeton1972, fcdBeton, FCD_MODUL } from '../src/data/kennwerte';
import { historicalData } from '../src/data/historicalMaterialsData';
import laborTab from '../content/historischematerialkennwerte/RechnerLaborTab.json';
import fs from 'fs';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Modulprüfung Tranche 12 (Nachrechnungen) ---');

// 1. Bestand / Modernisierung (DIN EN ISO 6946; Gradtagzahlverfahren; GModG Anlage 7)
pruefe('BE1 U 1,50 + 6 cm Calciumsilikat', uRetrofit(1.5, 0.06, 0.06), 0.6);
pruefe('BE3 U 1,6 + 140 mm EPS 035', uRetrofit(1.6, 0.14, 0.035), 0.216216);
pruefe('MO1 d_erf 1,40 → 0,24 (λ 0,032)', dRequired(1.40, 0.24, 0.032), 0.110476);
pruefe('MO1 U mit 14 cm', uRetrofit(1.40, 0.14, 0.032), 0.196491);
const mo2 = savings({ uOld: 1.40, uNew: uRetrofit(1.40, 0.14, 0.032), A: 160, bauteil: 'aussenwand', Gt: 3500, etaSys: 0.9, price: 0.12, co2: 0.24, invest: 160 * (0.14 * 125 + 85), sowiesoKosten: 160 * 85 });
pruefe('MO2 Q_E', mo2.qEnd, 17972.398); pruefe('MO2 Amortisation Kopplung', mo2.amortisation, 1.29829);
const mo3 = savings({ uOld: 1.2, uNew: uRetrofit(1.2, 0.10, 0.035), A: 80, bauteil: 'kellerdecke_erdreich', Gt: 3500, etaSys: 0.9, price: 0.12, co2: 0.24, invest: 0 });
pruefe('MO3 Kellerdecke F_x 0,6', mo3.qEnd, 4162.0645);
gilt(GMODG_ANLAGE7.aussenwand === 0.24 && GMODG_ANLAGE7.flachdach === 0.20 && GMODG_ANLAGE7.kellerdecke_erdreich === 0.30 && GMODG_ANLAGE7.aussentuer === 1.8, 'GModG Anlage 7 Nr. 1, 4, 5c, 6a');

// 2. Historische Kennwerte (DIN EN 1990 Anhang C/D, DIN EN 1996-1-1)
const hi1 = charValue([22, 25, 27, 24, 26]);
pruefe('HI1 X_k n = 5, V unbekannt (k_n 2,33)', hi1.Xk, 20.58329);
pruefe('HI1 X_k n = 5, V = 0,10 bekannt (k_n 1,80)', charValue([22, 25, 27, 24, 26], 0.10).Xk, 20.67300);
pruefe('HI2 f_d lognormal, γ_Rd 1,1', designLognormal(25, 0.15), 14.28164);
pruefe('HI3 f_k Ziegelwand 1920', fkMasonry(12.3, 2.5), 4.19448);

// 3. Bauwerksuntersuchung
pruefe('BU1 ΔR +90° (R 40)', rueckprallRichtungskorrektur(40, 90), -3.9);
pruefe('BU1 ΔR −90° (R 40)', rueckprallRichtungskorrektur(40, -90), 2.58);
pruefe('BU2 Lehrkurve R 30 abwärts, d_k 15 mm', rueckprall(30, 'down', 15).fcSchaetz, 20.49336);
const us = ultraschall(0.40, 95, 2400);
pruefe('BU3 v_p', us.vp, 4210.526); pruefe('BU3 E_dyn', us.eDynGPa, 38.29363);
pruefe('BU4 Impact-Echo 6 kHz', impactEcho(6, 4000, 30).dickeCm, 32.0);
pruefe('BU5 Haftzug 3,5 kN Ø 50', haftzug(3.5, 'beton').fct, 1.78254); gilt(haftzug(3.5, 'beton').ok && !haftzug(3.5, 'kleber').ok, 'BU5 Bruchbild');
pruefe('BU6 t_depass 15 mm / 36 a / c 25', karbonatisierung(15, 36, 25).tDepass, 100);
pruefe('BU7 Bohrkern Ø 100, 250 kN', bohrkern(100, 100, 250).festigkeit, 31.83099);
pruefe('BU8 Karsten 2,5 ml in 60 min', karsten(2.5).w, 4.36300); gilt(karsten(2.5).klasse === 'wassersaugend', 'BU8 Klasse > 2,0');
gilt(betondeckung('XC4', 39).cNom === 40 && !betondeckung('XC4', 39).ok && betondeckung('XD3', 55).ok, 'BU Deckung Tab. 4.4DE');

// 4. LAGA PN 98, Tabellen 2 und 3 (Abgleich mit der öffentlichen Wiedergabe)
const pn = (v: number) => { const p = pn98Probenzahl(v); return [p.einzelproben, p.mischproben, p.sammelproben, p.laborproben].join('/'); };
gilt(pn(120) === '20/5/0/5', `PN 120 m³: ${pn(120)}`);
gilt(pn(700) === '44/11/1/11', `PN 700 m³: ${pn(700)}`);
gilt(pn(850) === '52/13/1/11', `PN 850 m³: ${pn(850)}`);
gilt(pn(1000) === '56/14/2/12', `PN 1000 m³: ${pn(1000)}`);
gilt(pn(1200) === '64/16/2/12', `PN 1200 m³: ${pn(1200)}`);
gilt(pn98Mindestvolumen(32).einzelL === 2 && pn98Mindestvolumen(32).laborL === 4 && pn98Mindestvolumen(150).stueck, 'PN Tab. 3');

// 5. Altholz-Sortierbilanz (Standardeingabe des Rechners)
const ah = sortierbilanz({ masse: { AI: 15, AII: 45, AIII: 15, AIV: 25 }, ausbringen: { AI: 0.95, AII: 0.90, AIII: 0.85, AIV: 0.95 } });
pruefe('AH M_st', ah.mSt, 58.25); pruefe('AH q_F', ah.qFehl, 0.0875); pruefe('AH Reinheit', ah.reinheitSt, 0.939914);
pruefe('AH A IV im Stoffstrom', ah.anteilAIVSt, 0.0214592); pruefe('AH q_st', ah.qSt, 0.5475);

// 6. PFAS-Summen (Beispielprobe, BG 1 ng/l, Ansatz BG/2)
const werte: Partial<Record<PfasId, number>> = { PFBA: 12, PFPeA: 8, PFHxA: 15, PFHpA: 4, PFOA: 9, PFNA: 2, PFBS: 10, PFHxS: 6, PFOS: 11 };
const pf = pfasSummenbewertung({ werte, bg: 1, ansatz: 'halb' });
pruefe('PF Σ PFAS-20', pf.pfas20.summe, 82.5); pruefe('PF untere Schranke', pf.pfas20.unten, 77); pruefe('PF obere Schranke', pf.pfas20.oben, 88);
pruefe('PF Σ PFAS-4', pf.pfas4.summe, 28); gilt(pf.pfas20.ok && !pf.pfas4.ok, 'PF PFAS-20 eingehalten, PFAS-4 überschritten');
pruefe('PF Anteil kurzkettig', pf.anteilKurzkettig, 0.678788);

// 7. Zinkschutzdauer (DIN EN ISO 9223 Tab. 2, DIN EN ISO 12944-1)
const z1 = zinkSchutzdauer({ dZn: 85, kategorie: 'C3', ziel: 'VH', duplex: false, tBeschichtung: 0, synergie: 1 });
pruefe('KS1 t_min C3', z1.tMin, 40.4762); pruefe('KS1 t_max C3', z1.tMax ?? NaN, 121.4286); gilt(z1.bewertung === 'erfuellt', 'KS1 VH erfüllt');
const z2 = zinkSchutzdauer({ dZn: 85, kategorie: 'C5', ziel: 'VH', duplex: true, tBeschichtung: 10, synergie: 1.5 });
pruefe('KS2 Duplex C5', z2.tDuplexMin, 30.1786); gilt(z2.klasseUnguenstig === 'VH', 'KS2 VH');
pruefe('KS3 C4 70 µm', zinkSchutzdauer({ dZn: 70, kategorie: 'C4', ziel: 'H', duplex: false, tBeschichtung: 0, synergie: 1 }).tMin, 16.6667);

// 8. Dauerhaftigkeit (Wurzel-t-Gesetz)
pruefe('DH1 t_krit k 1,5, c 40', karbonatisierungsLebensdauer(1.5, 0, 40).tKrit, 711);
pruefe('DH2 t_krit k 4, c 25 (ungerundet)', karbonatisierungsLebensdauer(4, 0, 25).tDeckung, 39.0625);

// 9. BBodSchV-Prüfwerte im Modul Abfälle & Altlasten (BBodSchV 2021, Anlage 2 Tab. 2, 3, 4, 6)
const b = (bbod as { daten: Record<string, Record<string, { values: Record<string, number> }>> }).daten['Altlasten.bbodData'];
gilt(b.spielplatz.values['Cadmium (Cd)'] === 10 && b.spielplatz.values['Benzo(a)pyren'] === 0.5 && b.spielplatz.values['Chrom (Cr)'] === 200, 'BBodSchV Kinderspielflächen');
gilt(b.industrie.values['Quecksilber (Hg)'] === 100 && b.industrie.values['Chrom (Cr)'] === 200 && b.industrie.values['Benzo(a)pyren'] === 5, 'BBodSchV Industrie');
gilt(b.grundwasser.values['Cadmium (Cd)'] === 3 && b.grundwasser.values['Quecksilber (Hg)'] === 1 && b.grundwasser.values.PFNA === 0.06, 'BBodSchV Sickerwasser');
gilt(b.nutzpflanze.values['Quecksilber (Hg)'] === 5, 'BBodSchV Nutzpflanze Hg (Königswasser)');

// 10. Umsetzung 29.10.2026 (Entscheidungen 28.10. nachts)
// T12-BE-2: Erdgas 0,24 kg CO₂-Äq./kWh (GModG Anlage 9); BE2: ΔU 0,90, A 100 m², G 3500 Kd/a, F_x 1, η 1
gilt(CO2_ERDGAS === 0.24, 'T12-BE-2 CO₂-Faktor Erdgas 0,24');
const be2 = savings({ uOld: 1.5, uNew: 0.6, A: 100, bauteil: 'aussenwand', Gt: 3500, etaSys: 1, price: 0.11, co2: CO2_ERDGAS, invest: 0 });
pruefe('BE2 ΔQ', be2.qEnd, 7560); pruefe('BE2 CO₂', be2.co2kg, 1814.4);
// Umsetzung 29.10.2026 (Kleinpunkte): CO₂-Faktoren des Altbauatlas wie im Energieausweis-Kern (GModG Anlage 9, bis 31.12.2026)
gilt(CO2_HEIZOEL === 0.31 && CO2_STROM === 0.56 && CO2_FERNWAERME === 0.12, 'Altbauatlas Heizöl 0,31, Strom 0,56, Fernwärme 0,12 kg/kWh');
gilt(CO2_ERDGAS * 1000 === FAKTOREN.bis_2026.gas_brennwert.co2 && CO2_HEIZOEL * 1000 === FAKTOREN.bis_2026.oel_kessel.co2
  && CO2_STROM * 1000 === FAKTOREN.bis_2026.wp_luft.co2 && CO2_FERNWAERME * 1000 === FAKTOREN.bis_2026.fernwaerme.co2, 'Altbauatlas-Faktoren gleich Energieausweis');
pruefe('Wärmepumpe 0,56/3,5', CO2_WAERMEPUMPE, 0.16);
const be2Oel = savings({ uOld: 1.5, uNew: 0.6, A: 100, bauteil: 'aussenwand', Gt: 3500, etaSys: 1, price: 0.12, co2: CO2_HEIZOEL, invest: 0 });
pruefe('BE2 Heizöl CO₂', be2Oel.co2kg, 2343.6);
// T12-HB-1: Schwindbeiwerte wie Tranche 10 (T10-HW-1), Beispiel 2: 220 · 0,36 · 18 / 100 = 14,256 mm
gilt(SCHWINDBEIWERTE.fichte.tangential === 0.36 && SCHWINDBEIWERTE.fichte.radial === 0.19, 'T12-HB-1 Fichte 0,19/0,36');
const hbJson = (holzbau as { daten: Record<string, Record<string, { radial: number; tangential: number }>> }).daten['HolzbauBeta.shrinkageCoeffs'];
for (const art of ['fichte', 'kiefer', 'eiche'] as const) {
  gilt(hbJson[art].radial === SCHWINDBEIWERTE[art].radial && hbJson[art].tangential === SCHWINDBEIWERTE[art].tangential, `T12-HB-1 ${art} gleich Holzbau-Modul`);
}
pruefe('HB2 Δb Fichte tangential', 220 * SCHWINDBEIWERTE.fichte.tangential * 18 / 100, 14.256);
// T12-RB-4: Massenkennwerte 0,3–0,6 t/m³ BRI, Massivbau 0,5
const summen: Record<Bauweise, number> = { concrete: 0.5, masonry: 0.5, timber: 0.3, composite: 0.45 };
for (const b of Object.keys(MASSENKENNWERTE_BRI) as Bauweise[]) {
  pruefe(`RB4 Summe ${b}`, massenkennwertSumme(b), summen[b], 1e-9);
  gilt(massenkennwertSumme(b) >= 0.3 - 1e-9 && massenkennwertSumme(b) <= 0.6 + 1e-9, `RB4 ${b} im Bereich 0,3–0,6 t/m³`);
}
const efh = rueckbauMassen(800, 'masonry');
gilt(efh.gesamt === 400, `RB4 EFH 800 m³ Mauerwerk: ${efh.gesamt} t (soll 400 t)`); gilt(efh.mineralischProzent === 84, `RB4 mineralisch ${efh.mineralischProzent} %`);
gilt(rueckbauMassen(900, 'timber').gesamt === 270, `RB4 Holzhaus 900 m³: ${rueckbauMassen(900, 'timber').gesamt} t`);
// T12-RE-1: RC-Höchstanteile DIN 1045-2:2023-08 Anhang E (Vol.-% der groben GK), 120 m³ Platte, 1,8 t GK/m³, Grobanteil 0,7
gilt(RC_HOECHSTANTEIL.x0_xc_xf1_xf3.typ1 === 0.45 && RC_HOECHSTANTEIL.x0_xc_xf1_xf3.typ2 === 0.35 && RC_HOECHSTANTEIL.xa1.typ2 === 0.25 && RC_HOECHSTANTEIL.xd_xs_xf2_xf4.typ1 === 0.30 && RC_HOECHSTANTEIL.xd_xs_xf2_xf4.typ2 === 0.20, 'T12-RE-1 Höchstanteile wie Modul Ausgangsstoffe');
const re1 = rcBilanz(120, 'typ1', 'x0_xc_xf1_xf3');
pruefe('RE1 sekundär Typ 1 X0–XC4', re1.sekundaer, 68.04); pruefe('RE1 primär', re1.primaer, 147.96);
pruefe('RE1 sekundär Typ 2 XD/XS/XF2/XF4', rcBilanz(120, 'typ2', 'xd_xs_xf2_xf4').sekundaer, 30.24);
gilt(rcBilanz(120, 'typ1', 'xa2_xa3_xm').sekundaer === 0 && rcBilanz(120, 'typ1', 'x0_xc_xf1_xf3', false).sekundaer === 0, 'RE1 XA2/XA3/XM und ohne RC: 0 t');

// Nachtrag 29.10.2026: Bn-/B-/Bk-Klassen 1972–2001 nach Schnell/Fischer/Loch, Kurzbericht BBR 2008, Tab. 2.2 (Werte von Hand aus der Quelle)
const TAB22: [string, number, string | null][] = [
  ['Bn 50', 3.9, null], ['Bn 100', 7.7, '≈ C8/10'], ['Bn 150', 11.6, '≈ C12/15'], ['Bn 250', 19.3, 'C16/20'], ['Bn 350', 27.1, 'C25/30'], ['Bn 450', 34.8, '≈ C35/45'], ['Bn 550', 42.5, 'C40/50'],
  ['B 5', 3.9, null], ['B 10', 7.7, '≈ C8/10'], ['B 15', 11.6, '≈ C12/15'], ['B 25', 19.3, 'C16/20'], ['B 35', 27.1, 'C25/30'], ['B 45', 34.8, '≈ C35/45'], ['B 55', 42.5, 'C40/50'],
  ['Bk 5', 3.7, null], ['Bk 7,5', 5.5, null], ['Bk 10', 7.4, '≈ C8/10'], ['Bk 15', 11.0, '≈ C12/15'], ['Bk 20', 14.7, '≈ C12/15'], ['Bk 25', 18.4, 'C16/20'], ['Bk 35', 25.8, 'C25/30'], ['Bk 45', 33.1, 'C30/37'], ['Bk 55', 40.5, 'C40/50'],
];
for (const [bez, fck, klasse] of TAB22) {
  const z = altbeton1972(bez);
  gilt(!!z && z.fck === fck && z.klasse === klasse, `Bn-Nachtrag ${bez}: ${z?.fck}/${z?.klasse}, soll ${fck}/${klasse}`);
}
gilt(ALTBETON_1972_2001.length === 16, 'Bn-Nachtrag 16 Zeilen (7 Bn/B, 9 Bk)');
// Gesamtfaktor Probeform/Lagerung: Bn/B ≈ 0,77, Bk ≈ 0,74
for (const z of ALTBETON_1972_2001) {
  const f = z.fck / z.nennfestigkeit;
  gilt(z.label.startsWith('Bk') ? f > 0.73 && f < 0.745 : f > 0.765 && f < 0.785, `Bn-Nachtrag Faktor ${z.label}: ${f}`);
}
// Datenbank-Reiter aus der Tabelle; alte Zuordnungen entfernt
const hist250 = historicalData.beton.data.find(z => z.old.startsWith('Bn 250'));
gilt(!!hist250 && hist250.new === 'C16/20' && hist250.f_new === '19,3', `Bn-Nachtrag Datenbank Bn 250: ${hist250?.new} ${hist250?.f_new}`);
gilt(!historicalData.beton.data.some(z => /^(Bn|B) ?\d/.test(z.old) && /20\/25|C 30\/37|C 45\/55/.test(z.new)), 'Bn-Nachtrag alte Zuordnungen (Bn 250 → C20/25 …) entfernt');
gilt(!historicalData.beton.data.some(z => /BK (12\.5|17\.5|22\.5|27\.5|37\.5)/.test(z.old)), 'Bn-Nachtrag nicht belegte DDR-Klassen entfernt');
gilt(historicalData.beton.data.every(z => typeof z.f_new !== 'number' || Number.isInteger(z.f_new)), 'Bn-Nachtrag Dezimalwerte mit Komma');
// Beispiel 1 (Bn 250, 1974): f_cd = 0,85 · 19,3 / 1,5 = 10,94; Bestand γ_c 1,35: 12,15 N/mm²
pruefe('Bn-Nachtrag Beispiel 1 f_cd', fcdBeton(19.3, FCD_MODUL.historischStandard), 10.936667, 1e-5);
pruefe('Bn-Nachtrag Beispiel 1 f_cd Bestand', fcdBeton(19.3, FCD_MODUL.historischBewertung), 12.151852, 1e-5);
gilt(laborTab.texte.tippWerdenImBestand.includes('12{,}15') && !laborTab.texte.tippWerdenImBestand.includes('12{,}59'), 'Bn-Nachtrag Tipp 12,15');
gilt(laborTab.texte.damitEntsprichtDerBestandsbeton.includes('C16/20') && laborTab.texte.damitEntsprichtDerBestandsbeton.includes('19{,}3'), 'Bn-Nachtrag Beispieltext C16/20, 19,3');
const laborSrc = fs.readFileSync('src/modules/historischematerialkennwerte/RechnerLaborTab.tsx', 'utf8');
gilt(laborSrc.includes("altbeton1972('Bn 250')") && !laborSrc.includes('11{,}33'), 'Bn-Nachtrag Beispiel aus gemeinsamer Tabelle');
gilt(fs.readFileSync('src/data/tasks/bestandTasks.ts', 'utf8').includes('f_ck = 19,3 N/mm² und die Klasse C16/20'), 'Bn-Nachtrag Aufgabe t22');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Modulprüfung Tranche 12');
