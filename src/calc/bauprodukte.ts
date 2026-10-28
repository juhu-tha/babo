/**
 * Kleine Rechenkerne der Bauprodukte-Module (Modulprüfung Tranche 8, 28.10.2026).
 * Verhalten 1:1 aus den Komponenten übernommen; die Komponenten zeigen nur noch an.
 * Geprüft in tests/modulpruefungTranche8.test.ts (Sollwerte aus eigenem Prüfskript).
 * Alle Ansätze sind Lehr- und Vorbemessungswerte (Quellen und Grenzen in den Modulen und in
 * docs/pruefung/module-tranche-8.md).
 */

const r1 = (x: number) => parseFloat(x.toFixed(1));
const r2 = (x: number) => Math.round(x * 100) / 100;

// ── Trockenbau: Materialbedarf einer Metallständerwand (Richtwerte, inkl. ca. 5 % Verschnitt) ──
export interface TrockenbauEingabe { flaeche: number; lagen: 1 | 2; achsabstand: 62.5 | 31.25; daemmung: boolean }
export function trockenbauBedarf(e: TrockenbauEingabe) {
  const A = e.flaeche;
  return {
    platten: r1(A * e.lagen * 2 * 1.05),             // beidseitig, je Lage
    cw: r1(A * (e.achsabstand === 62.5 ? 2.0 : 3.8) * 1.05),
    uw: r1(A * 0.7 * 1.05),
    schrauben: Math.ceil(A * (e.lagen === 1 ? 30 : 55) * 1.05),
    spachtel: r1(A * e.lagen * 2 * 0.45),           // 0,45 kg je m², Lage und Seite (Lehrwert)
    dichtband: r1(A * 0.8),
    daemmung: e.daemmung ? r1(A * 1.02) : 0,
  };
}

// ── Abdichtung: Lehrprüfung innenliegendes Fugenband (Breiten-Zuordnung als Lehrannahme) ──
export type Fugenart = 'arbeitsfuge' | 'dehnungsfuge';
export type Fugenbandtyp = 'A200' | 'A240' | 'A320' | 'D240' | 'D320' | 'FM400';
export function fugenbandPruefung(art: Fugenart, wasserdruckM: number, dickeCm: number, groesstkornMm: number) {
  let breite: number; let typ: Fugenbandtyp;
  if (art === 'arbeitsfuge') {
    if (wasserdruckM <= 5) { breite = 200; typ = 'A200'; }
    else if (wasserdruckM <= 12) { breite = 240; typ = 'A240'; }
    else { breite = 320; typ = 'A320'; }
  } else if (wasserdruckM <= 3) { breite = 240; typ = 'D240'; }
  else if (wasserdruckM <= 8) { breite = 320; typ = 'D320'; }
  else { breite = 400; typ = 'FM400'; }
  const minRandCm = (groesstkornMm * 3) / 10;              // Lehrannahme 3 · Größtkorn
  const randCm = (dickeCm - breite / 20) / 2;
  return { breite, typ, dickeOk: dickeCm * 10 >= breite, minRandCm, randCm, randOk: randCm >= minRandCm, druckBar: wasserdruckM * 0.1 };
}

// ── Dämmung: U-Wert vor/nach Dämmung, Einsparung und Mindestdicke (Dämmstoff-Berater) ──
export interface DaemmEingabe { rBestand: number; dickeCm: number; lambda: number; rsi: number; rse: number; uZiel: number; ohneBestand: boolean }
/** Heizgradstunden-Ansatz: 84 kKh/a ≈ Gradtagzahl 3 500 Kd (Lehrwert); CO₂-Faktor 0,22 kg/kWh (Lehrwert, F-Freigabe) */
export const HEIZGRADSTUNDEN_KKH = 84;
export const CO2_FAKTOR_HEIZUNG = 0.22;
export function daemmBerater(e: DaemmEingabe) {
  const rDaemm = (e.dickeCm / 100) / e.lambda;
  const uNeu = 1 / (e.rBestand + rDaemm + e.rsi + e.rse);
  const rAlt = e.rBestand + e.rsi + e.rse;
  const uAlt = rAlt > 0 ? 1 / rAlt : 10;
  const dU = uAlt - uNeu;
  const einsparung = e.ohneBestand || dU <= 0 ? 0 : r2(dU * HEIZGRADSTUNDEN_KKH);
  const co2 = r2(einsparung * CO2_FAKTOR_HEIZUNG);
  const rErf = 1 / e.uZiel - e.rBestand - e.rsi - e.rse;
  const empfDickeCm = rErf <= 0 ? 2 : Math.max(2, Math.ceil(rErf * e.lambda * 100));
  return { rDaemm, uNeu, uAlt, erfuellt: uNeu <= e.uZiel, einsparung, co2, empfDickeCm };
}

// ── Farben und Lacke: Nassschichtdicke und Materialbedarf ──
export interface BeschichtungEingabe { dft: number; vs: number; verduennung: number; verlust: number; flaeche: number; anstriche: number }
export function beschichtungsmenge(e: BeschichtungEingabe) {
  const wft = e.vs <= 0 ? 0 : (e.dft * 100) / e.vs;          // µm ≙ ml/m² unverdünnt
  const wftVerduennt = wft * (1 + e.verduennung / 100);
  const ergiebigkeit = e.dft <= 0 ? 0 : (10 * e.vs) / e.dft;  // m²/l
  const verbrauchEff = e.verlust >= 100 ? 0 : wft / (1 - e.verlust / 100);
  return { wft, wftVerduennt, ergiebigkeit, verbrauch: wft, verbrauchEff, liter: (verbrauchEff * e.flaeche * e.anstriche) / 1000 };
}

// ── Betonzusatzmittel: Wasseranrechnung (> 3 l/m³ flüssige Zusatzmittel, DIN EN 206) ──
export interface ZusatzmittelEingabe { zement: number; dosierung: number; dichte: number; wasseranteil: number; wasser: number }
export function zusatzmittelWz(e: ZusatzmittelEingabe) {
  const masse = e.zement * (e.dosierung / 100);
  const volumen = masse / e.dichte;
  const wasserZm = masse * (e.wasseranteil / 100);
  const anrechnung = volumen > 3.0;
  const wasserEff = anrechnung ? e.wasser + wasserZm : e.wasser;
  return { masse, volumen, wasserZm, anrechnung, wasserEff, wzRoh: e.wasser / e.zement, wzEff: wasserEff / e.zement,
    zuNiedrig: e.dosierung < 0.2, zuHoch: e.dosierung > 5.0 };
}

// ── Mineralische Beläge: Trocken- und Nassmasse ──
export function belagMasse(flaeche: number, dickeMm: number, rohdichte: number, wasseraufnahmeProzent: number) {
  const volumen = flaeche * (dickeMm / 1000);
  const trocken = volumen * rohdichte;
  const wasser = trocken * (wasseraufnahmeProzent / 100);
  return { volumen, trocken, wasser, nass: trocken + wasser };
}

// ── Kunststoffe: Burgers-Modell (Dehnungen in %) und thermische Längenänderung ──
export interface BurgersParameter { E1: number; E2: number; eta1: number; eta2: number }
export function burgersDehnung(p: BurgersParameter, sigma: number, tStunden: number) {
  const elastisch = (sigma / p.E1) * 100;
  const viskos = (sigma / p.eta1) * tStunden * 100;
  const verzoegert = (sigma / p.E2) * (1 - Math.exp(-(p.E2 / p.eta2) * tStunden)) * 100;
  return { elastisch, viskos, verzoegert, gesamt: elastisch + verzoegert + viskos };
}
/** ΔL [mm] aus α [10⁻⁶/K], L [m] und ΔT [K] */
export const laengenaenderungMm = (alpha: number, laengeM: number, dT: number) => alpha * laengeM * dT * 0.001;

// ── Lehmbau: vereinfachte Lehrrechnung einer Lehmsteinwand (Ansätze vorläufig, F-Freigabe) ──
/** Rechenwerte f_k [N/mm²] je Steindruckfestigkeitsklasse (Lehrwerte des Moduls, nicht aus DIN 18940 belegt) */
export const LEHM_FK: Record<number, number> = { 2: 0.9, 2.5: 1.1, 3: 1.3, 4: 1.6, 5: 1.9, 6: 2.2 };
export const LEHM_GAMMA_M = 2.0;
export const LEHM_LAMBDA_MAX = 21;
export function lehmWand(hoeheM: number, dickeCm: number, klasse: number, deckeneinspannung: boolean) {
  const beta = deckeneinspannung ? 0.75 : 1.0;
  const hef = hoeheM * beta;
  const lambda = (hef * 100) / dickeCm;
  const fk = LEHM_FK[klasse] ?? 1.3;
  const fd = fk / LEHM_GAMMA_M;
  const phi = Math.max(0, 0.85 * (1 - Math.pow(lambda / 24, 2)));
  const nRd = phi * (dickeCm / 100) * (fd * 1000);
  return { beta, hef, lambda, schlankOk: lambda <= LEHM_LAMBDA_MAX, fk, fd, phi, nRd };
}

// ── Metalle: Blechmasse und Potentialdifferenz ──
export function blechMasse(laengeM: number, breiteM: number, dickeMm: number, rohdichte: number) {
  const volumen = laengeM * breiteM * (dickeMm / 1000);
  const masse = volumen * rohdichte;
  const flaechenmasse = (dickeMm / 1000) * rohdichte;   // kg/m²
  return { volumen, masse, flaechenmasse, gkFlaeche: (flaechenmasse * 9.81) / 1000 };   // g_k in kN/m²
}
export const potentialDifferenz = (u1: number, u2: number) => Math.abs(u1 - u2);

// ── Stahlbauprofile: elastische Randspannung σ = N/A + M/W_y ──
/** A [cm²], W_y [cm³], N [kN], M [kNm] → Spannungen [N/mm²], Ausnutzung [%] */
export function randspannung(nKn: number, mKnm: number, aCm2: number, wyCm3: number, fy: number, gammaM0: number) {
  const sigmaN = aCm2 > 0 ? (nKn * 1000) / (aCm2 * 100) : 0;
  const sigmaM = wyCm3 > 0 ? (mKnm * 1e6) / (wyCm3 * 1000) : 0;
  const sigma = sigmaN + sigmaM;
  const fyd = fy / gammaM0;
  return { sigmaN, sigmaM, sigma, fyd, eta: fyd > 0 ? (sigma / fyd) * 100 : 0 };
}
