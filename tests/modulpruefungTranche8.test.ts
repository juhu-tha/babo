// Modulprüfung Tranche 8 (28.10.2026): unabhängige Nachrechnungen der Bauprodukte-Module (Befundliste docs/pruefung/module-tranche-8.md).
// Die Sollwerte stammen aus einem eigenen Prüfskript (eigene Umsetzung in Python), nicht aus den Komponenten übernommen.
import {
  trockenbauBedarf, fugenbandPruefung, daemmBerater, beschichtungsmenge, zusatzmittelWz, belagMasse,
  burgersDehnung, laengenaenderungMm, lehmWand, blechMasse, potentialDifferenz, randspannung,
} from '../src/calc/bauprodukte';
import { uwFenster, PSI_ABSTANDHALTER } from '../src/calc/fenster';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Modulprüfung Tranche 8 (Bauprodukte) ---');

// 1. Trockenbau – Bedarfsrechner (Richtwerte des Moduls)
const tb = trockenbauBedarf({ flaeche: 20, lagen: 2, achsabstand: 62.5, daemmung: true });
pruefe('TB4 Platten', tb.platten, 84); pruefe('TB4 CW', tb.cw, 42); pruefe('TB4 UW', tb.uw, 14.7);
gilt(tb.schrauben === 1155, 'TB4 Schrauben 1155'); pruefe('TB4 Spachtel', tb.spachtel, 36); pruefe('TB4 Band', tb.dichtband, 16); pruefe('TB4 Dämmung', tb.daemmung, 20.4);
const tb5 = trockenbauBedarf({ flaeche: 7, lagen: 1, achsabstand: 31.25, daemmung: false });
gilt(tb5.schrauben === 221, 'TB5 Schrauben 221'); pruefe('TB5 CW', tb5.cw, 27.9); gilt(tb5.daemmung === 0, 'TB5 ohne Dämmung');

// 2. Abdichtung – Fugenband-Lehrprüfung (Lehrannahmen), Nassschichtdicke 4/0,7
const ab3 = fugenbandPruefung('arbeitsfuge', 3, 30, 32);
gilt(ab3.breite === 200 && ab3.dickeOk && ab3.randOk, 'AB3 A 200, d ≥ a, Rand ok'); pruefe('AB3 Rand', ab3.randCm, 10); pruefe('AB3 min', ab3.minRandCm, 9.6);
const ab4 = fugenbandPruefung('dehnungsfuge', 10, 30, 32);
gilt(ab4.typ === 'FM400' && !ab4.dickeOk && !ab4.randOk, 'AB4 FM 400 zu dick für 30 cm'); pruefe('AB4 Rand', ab4.randCm, 5);
const ab5 = fugenbandPruefung('dehnungsfuge', 2, 24, 16);
gilt(ab5.typ === 'D240' && ab5.dickeOk && ab5.randOk, 'AB5 D 240 bei 24 cm'); pruefe('AB6 bar', fugenbandPruefung('arbeitsfuge', 3, 30, 16).druckBar, 0.3);

// 3. Dämmung – U-Werte (DIN EN ISO 6946), Einsparung, Mindestdicke
const da2 = daemmBerater({ rBestand: 0.47, dickeCm: 14, lambda: 0.032, rsi: 0.13, rse: 0.04, uZiel: 0.24, ohneBestand: false });
pruefe('DA2 U_alt', da2.uAlt, 1 / 0.64); pruefe('DA2 U_neu', da2.uNeu, 1 / (0.47 + 4.375 + 0.17));
gilt(da2.erfuellt, 'DA2 erfüllt'); pruefe('DA2 Einsparung', da2.einsparung, 114.7, 2e-3); pruefe('DA2 CO2', da2.co2, 25.23, 2e-3);
const da3 = daemmBerater({ rBestand: 0.47, dickeCm: 10, lambda: 0.040, rsi: 0.13, rse: 0.04, uZiel: 0.24, ohneBestand: false });
gilt(da3.empfDickeCm === 15 && !da3.erfuellt, 'DA3 Holzfaser: 15 cm erforderlich, 10 cm nicht erfüllt');
const da4 = daemmBerater({ rBestand: 0.09, dickeCm: 11, lambda: 0.035, rsi: 0.17, rse: 0.17, uZiel: 0.30, ohneBestand: false });
gilt(da4.empfDickeCm === 11 && da4.erfuellt, 'DA4 Kellerdecke 11 cm XPS'); pruefe('DA4 U', da4.uNeu, 0.2802, 2e-3);
gilt(daemmBerater({ rBestand: 0, dickeCm: 20, lambda: 0.035, rsi: 0.13, rse: 0.04, uZiel: 0.24, ohneBestand: true }).einsparung === 0, 'DA5 ohne Bestand keine Einsparung');

// 4. Farben und Lacke – Nassschichtdicke und Menge
const fl1 = beschichtungsmenge({ dft: 40, vs: 45, verduennung: 5, verlust: 20, flaeche: 120, anstriche: 2 });
pruefe('FL1 WFT', fl1.wft, 88.8889); pruefe('FL1 WFT verdünnt', fl1.wftVerduennt, 93.3333); pruefe('FL1 Ergiebigkeit', fl1.ergiebigkeit, 11.25);
pruefe('FL1 Verbrauch eff', fl1.verbrauchEff, 111.111); pruefe('FL1 Liter', fl1.liter, 26.6667);
const fl2 = beschichtungsmenge({ dft: 80, vs: 40, verduennung: 0, verlust: 20, flaeche: 1, anstriche: 1 });
pruefe('FL2 OS 4 WFT', fl2.wft, 200); pruefe('FL2 l/m² mit Verlust (Beispiel)', fl2.liter, 0.25);
pruefe('FL3 EP 250 µm, 50 m²', beschichtungsmenge({ dft: 250, vs: 100, verduennung: 0, verlust: 10, flaeche: 50, anstriche: 1 }).liter, 13.8889);

// 5. Betonzusatzmittel – Wasseranrechnung (DIN EN 206: > 3 l/m³)
const bz1 = zusatzmittelWz({ zement: 320, dosierung: 1.2, dichte: 1.12, wasseranteil: 65, wasser: 145 });
pruefe('BZ1 Volumen', bz1.volumen, 3.42857); gilt(bz1.anrechnung, 'BZ1 Anrechnung'); pruefe('BZ1 w/z eff', bz1.wzEff, 0.46093); pruefe('BZ1 w/z roh', bz1.wzRoh, 0.45312);
const bz2 = zusatzmittelWz({ zement: 340, dosierung: 1.5, dichte: 1.05, wasseranteil: 70, wasser: 160 });
pruefe('BZ2 Beispiel w/z', bz2.wzEff, 0.48109); pruefe('BZ2 Wasser ZM', bz2.wasserZm, 3.57);
const bz3 = zusatzmittelWz({ zement: 280, dosierung: 1.1, dichte: 1.05, wasseranteil: 60, wasser: 150 });
gilt(!bz3.anrechnung && nahe(bz3.wzEff, 0.53571), 'BZ3 2,93 l ≤ 3 l: keine Anrechnung');
gilt(zusatzmittelWz({ zement: 300, dosierung: 5.5, dichte: 1.1, wasseranteil: 60, wasser: 150 }).zuHoch, 'BZ4 > 5,0 M.-% gemeldet');

// 6. Mineralische Beläge – Nasslast (Beispiel des Moduls)
const mi1 = belagMasse(20, 8, 1900, 15); pruefe('MI Steingut trocken', mi1.trocken, 304); pruefe('MI Steingut nass', mi1.nass, 349.6);
const mi2 = belagMasse(20, 8, 2400, 0.5); pruefe('MI FSZ nass', mi2.nass, 385.92); pruefe('MI Granit 30 mm nass', belagMasse(20, 30, 2750, 0.3).nass, 1654.95);

// 7. Kunststoffe – Burgers-Modell und ΔL
const ks1 = burgersDehnung({ E1: 1000, E2: 2000, eta1: 5e6, eta2: 1e5 }, 5, 1000);
pruefe('KS1 ε gesamt', ks1.gesamt, 0.85); pruefe('KS1 viskos', ks1.viskos, 0.10); pruefe('KS1 verzögert', ks1.verzoegert, 0.25);
const ks2 = burgersDehnung({ E1: 1000, E2: 700, eta1: 35000, eta2: 1200 }, 5, 100);
pruefe('KS2 PE-HD ε', ks2.gesamt, 2.64286); pruefe('KS3 ΔL PE-HD', laengenaenderungMm(200, 6, 50), 60); pruefe('KS3 ΔL Stahl', laengenaenderungMm(12, 6, 50), 3.6);

// 8. Lehm – vereinfachte Lehrrechnung
const le1 = lehmWand(2.75, 30, 2, true); pruefe('LE1 λ', le1.lambda, 6.875); pruefe('LE1 Φ', le1.phi, 0.78025); pruefe('LE1 N_Rd', le1.nRd, 105.334);
const le2 = lehmWand(2.75, 24, 4, false); gilt(le2.beta === 1.0, 'LE2 β = 1,0 (gelenkig)'); pruefe('LE2 N_Rd', le2.nRd, 126.0);
const le3 = lehmWand(3.0, 11.5, 2, false); gilt(!le3.schlankOk && le3.nRd === 0, 'LE3 λ = 26,1 > 21, Φ = 0');

// 9. Metalle – Titanzink-Beispiel, Stahlblech, Potentiale
const me1 = blechMasse(10, 0.5, 0.7, 7200); pruefe('ME1 Masse', me1.masse, 25.2); pruefe('ME1 g_k', me1.gkFlaeche, 0.0494424);
pruefe('ME2 Stahlblech', blechMasse(3, 1.25, 2, 7850).masse, 58.875); pruefe('ME3 ΔU Zink/Kupfer', potentialDifferenz(0.34, -0.76), 1.10);
pruefe('ME1 ΔL Titanzink', laengenaenderungMm(22, 10, 100), 22);

// 10. Stahlbauprofile – Randspannung (IPE 300 nach Tabelle)
const st = randspannung(150, 45, 53.8, 557, 355, 1.0);
pruefe('ST2 σ_N', st.sigmaN, 27.881); pruefe('ST2 σ_M', st.sigmaM, 80.7899); pruefe('ST2 η', st.eta, 30.6115);
pruefe('ST1 σ Beispiel', randspannung(0, 45, 53.8, 557, 235, 1.0).sigma, 80.7899);

// 11. Gläser – U_w (DIN EN ISO 10077-1), Standardeingabe des Moduls und Alu-Abstandhalter
const fw = { breite: 1.23, hoehe: 1.48, rahmenMm: 110, g: 0.53, strahlung: 450 };
const gl1 = uwFenster({ ...fw, ug: 0.6, uf: 1.1, psi: PSI_ABSTANDHALTER.warm_edge_kunststoff });
pruefe('GL1 U_w', gl1.uw, 0.84523); pruefe('GL1 solar', gl1.solar, 303.515);
pruefe('GL2 U_w Alu, U_g 1,1, U_f 1,3', uwFenster({ ...fw, g: 0.6, ug: 1.1, uf: 1.3, psi: PSI_ABSTANDHALTER.alu }).uw, 1.3597);

// Fuzz: 1 000 zufällige gültige Eingaben ohne NaN/∞
let ok = true;
for (let i = 0; i < 1000; i++) {
  const z = (a: number, b: number) => a + Math.random() * (b - a);
  const werte = [
    ...Object.values(trockenbauBedarf({ flaeche: z(1, 500), lagen: Math.random() < 0.5 ? 1 : 2, achsabstand: Math.random() < 0.5 ? 62.5 : 31.25, daemmung: Math.random() < 0.5 })),
    ...Object.values(fugenbandPruefung(Math.random() < 0.5 ? 'arbeitsfuge' : 'dehnungsfuge', z(0, 20), z(15, 80), Math.random() < 0.5 ? 16 : 32)).filter(v => typeof v === 'number') as number[],
    ...Object.values(daemmBerater({ rBestand: z(0, 1), dickeCm: z(1, 40), lambda: z(0.007, 0.08), rsi: z(0.1, 0.17), rse: z(0, 0.17), uZiel: z(0.15, 0.5), ohneBestand: false })).filter(v => typeof v === 'number') as number[],
    ...Object.values(beschichtungsmenge({ dft: z(10, 300), vs: z(15, 100), verduennung: z(0, 20), verlust: z(0, 60), flaeche: z(1, 1000), anstriche: 1 + Math.floor(z(0, 4)) })),
    ...Object.values(zusatzmittelWz({ zement: z(200, 500), dosierung: z(0.1, 6), dichte: z(1, 1.3), wasseranteil: z(30, 80), wasser: z(120, 220) })).filter(v => typeof v === 'number') as number[],
    ...Object.values(belagMasse(z(1, 200), z(5, 50), z(1500, 2900), z(0, 20))),
    ...Object.values(burgersDehnung({ E1: z(5, 4000), E2: z(4, 4000), eta1: z(200, 4e5), eta2: z(10, 2e4) }, z(0.1, 20), z(0, 10000))),
    ...Object.values(lehmWand(z(2, 4), z(11.5, 49), [2, 2.5, 3, 4, 5, 6][Math.floor(z(0, 6))], Math.random() < 0.5)).filter(v => typeof v === 'number') as number[],
    ...Object.values(blechMasse(z(0.5, 12), z(0.3, 2), z(0.5, 20), z(2700, 11340))),
    ...Object.values(randspannung(z(0, 3000), z(0, 1500), z(7, 400), z(20, 8000), 355, z(1, 1.1))),
  ];
  if (werte.some(v => !Number.isFinite(v))) { ok = false; break; }
}
gilt(ok, 'Fuzz: alle Ergebnisse endlich');

if (fehler.length) { fehler.forEach(f => console.log('FAIL', f)); process.exit(1); }
console.log('ok – Tranche 8: alle Nachrechnungen stimmen');
