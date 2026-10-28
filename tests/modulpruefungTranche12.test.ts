// Modulprüfung Tranche 12 (28.10.2026): unabhängige Nachrechnungen der Rechenkerne in den Bereichen Bauen im Bestand,
// Rückbau & Schadstoffe und Dauerhaftigkeit (Befundliste docs/pruefung/module-tranche-12.md).
// Die Sollwerte stammen aus einem eigenen Prüfskript (eigene Umsetzung der Gleichungen in Python),
// nicht aus den Kernen oder vorhandenen Tests übernommen.
import { uRetrofit, dRequired, savings, charValue, designLognormal, fkMasonry, GMODG_ANLAGE7 } from '../src/utils/bestandKern';
import { rueckprallRichtungskorrektur, rueckprall, ultraschall, impactEcho, haftzug, karbonatisierung, bohrkern, karsten, betondeckung } from '../src/calc/bauwerksuntersuchung';
import { pn98Probenzahl, pn98Mindestvolumen } from '../src/calc/probenahme';
import { sortierbilanz } from '../src/calc/altholz';
import { pfasSummenbewertung, type PfasId } from '../src/calc/pfas';
import { zinkSchutzdauer } from '../src/calc/korrosionsschutz';
import { karbonatisierungsLebensdauer } from '../src/calc/korrosion';
import bbod from '../content/abfaelle/Altlasten.json';

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

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Modulprüfung Tranche 12');
