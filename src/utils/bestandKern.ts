// bestandKern.ts — Rechenkern für das BaustoffBoard-Modul „Bauen im Bestand"
// Normbezug: GModG (in Kraft seit 29.07.2026) § 36 + Anlage 7; DIN EN ISO 6946; DIN V 4108-6 (Fx);
// DIN EN 1990 Anhang D (versuchsgestützte Kennwerte); EN 1990-2:2026 (Bewertung bestehender Tragwerke);
// DIN EN 13791:2020-02 (Umrechnung In-situ ↔ charakteristisch, Faktor 0,85); DIN EN 1996-1-1 + NA.
// CO₂-Faktoren: aus dem Energieausweis-Kern (src/calc/energieausweis.ts, FAKTOREN Rechtsstand „bis 31.12.2026“,
// GModG Anlage 9) übernommen statt dupliziert (Entscheidung 29.10.2026).

import { FAKTOREN } from '../calc/energieausweis';

// ---------- 1) GModG Anlage 7 (Wohngebäude), Stand 29.07.2026 ----------
export const GMODG_ANLAGE7 = {
  aussenwand: 0.24,            // Nr. 1a/1b (Ersatz bzw. außenseitige Dämmung/Bekleidung/Außenputzerneuerung)
  fenster: 1.3,                // Nr. 2a (Uw)
  dachflaechenfenster: 1.4,    // Nr. 2b (Uw)
  verglasung: 1.1,             // Nr. 2c (Ug)
  aussentuer: 1.8,             // Nr. 4
  steildach_oGD: 0.24,         // Nr. 5a/5b (Dachflächen, Gauben, oberste Geschossdecken, Wände zu unbeheiztem Dachraum)
  flachdach: 0.20,             // Nr. 5c
  kellerdecke_erdreich: 0.30,  // Nr. 6a/6b
  fussbodenaufbau_warmseite: 0.50, // Nr. 6c
  decke_aussenluft: 0.24,      // Nr. 6d/6e
} as const;
export type Bauteil = keyof typeof GMODG_ANLAGE7;

const CO2_BIS_2026 = FAKTOREN.bis_2026;
/** Emissionsfaktor Erdgas [kg CO₂-Äq./kWh] nach GModG Anlage 9 (240 g/kWh, wie zuvor GEG Anlage 9). */
export const CO2_ERDGAS = CO2_BIS_2026.gas_brennwert.co2 / 1000;
/** Emissionsfaktor Heizöl [kg CO₂-Äq./kWh] nach GModG Anlage 9 (310 g/kWh). */
export const CO2_HEIZOEL = CO2_BIS_2026.oel_kessel.co2 / 1000;
/** Emissionsfaktor Netzstrom [kg CO₂-Äq./kWh] nach GModG Anlage 9 (560 g/kWh). */
export const CO2_STROM = CO2_BIS_2026.wp_luft.co2 / 1000;
/** Emissionsfaktor Fernwärme [kg CO₂-Äq./kWh] – Lehrwert 120 g/kWh wie im Energieausweis (Anlage 9 unterscheidet nach Erzeugung). */
export const CO2_FERNWAERME = CO2_BIS_2026.fernwaerme.co2 / 1000;
/** Jahresarbeitszahl der Wärmepumpe im Sanierungsrechner (Lehrwert) */
export const JAZ_WAERMEPUMPE = 3.5;
/** Emissionsfaktor Wärmepumpe je kWh Wärme = Netzstrom/JAZ [kg CO₂-Äq./kWh] */
export const CO2_WAERMEPUMPE = CO2_STROM / JAZ_WAERMEPUMPE;

/** Temperatur-Korrekturfaktor Fx (DIN V 4108-6, Tab. 3, Auswahl). */
export const FX: Partial<Record<Bauteil, number>> = {
  aussenwand: 1.0, steildach_oGD: 0.8, flachdach: 1.0, kellerdecke_erdreich: 0.6, decke_aussenluft: 1.0,
};

/** U-Wert nach zusätzlicher Dämmschicht (vereinfachend ohne Befestigungs-/Luftschichtkorrekturen, DIN EN ISO 6946). */
export const uRetrofit = (uOld: number, d_m: number, lambda: number) => 1 / (1 / uOld + d_m / lambda);
/** Dämmdicke, die für U_ziel erforderlich ist. */
export const dRequired = (uOld: number, uTarget: number, lambda: number) => Math.max(0, lambda * (1 / uTarget - 1 / uOld));

export interface SavingsInput { uOld: number; uNew: number; A: number; bauteil: Bauteil; Gt: number; etaSys: number; price: number; co2: number; invest: number; sowiesoKosten?: number; }
/** Endenergie-Einsparung [kWh/a] = ΔU·A·Fx·Gt·24/1000 / η_Anlage; statische Amortisation mit energiebedingten Mehrkosten. */
export function savings(i: SavingsInput) {
  const fx = FX[i.bauteil] ?? 1.0;
  const qNutz = (i.uOld - i.uNew) * i.A * fx * i.Gt * 24 / 1000;
  const qEnd = qNutz / i.etaSys;
  const euro = qEnd * i.price;
  const mehrkosten = Math.max(0, i.invest - (i.sowiesoKosten ?? 0));
  return { fx, qNutz, qEnd, euro, co2kg: qEnd * i.co2, amortisation: euro > 0 ? mehrkosten / euro : Infinity, mehrkosten };
}
export const checkGModG = (bauteil: Bauteil, u: number) => ({ grenzwert: GMODG_ANLAGE7[bauteil], ok: u <= GMODG_ANLAGE7[bauteil] + 1e-9 });

// ---------- 2) Versuchsgestützte Kennwerte (DIN EN 1990, Anhang D, Tab. D.1/D.2) ----------
const N_TAB = [1, 2, 3, 4, 5, 6, 8, 10, 20, 30, Infinity];
const KN_VKNOWN   = [2.31, 2.01, 1.89, 1.83, 1.80, 1.77, 1.74, 1.72, 1.68, 1.67, 1.64];
const KN_VUNKNOWN = [NaN, NaN, 3.37, 2.63, 2.33, 2.18, 2.00, 1.92, 1.76, 1.73, 1.64];
const KDN_VKNOWN   = [4.36, 3.77, 3.56, 3.44, 3.37, 3.33, 3.27, 3.23, 3.16, 3.13, 3.04];
const KDN_VUNKNOWN = [NaN, NaN, NaN, 11.40, 7.85, 6.36, 5.07, 4.51, 3.64, 3.44, 3.04];
function interp(n: number, tab: number[]) {
  for (let i = 0; i < N_TAB.length - 1; i++) {
    const a = N_TAB[i], b = N_TAB[i + 1];
    if (n === a) return tab[i];
    if (n > a && n < b) return Number.isFinite(b) ? tab[i] + ((tab[i + 1] - tab[i]) * (n - a)) / (b - a) : tab[i];
  }
  return tab[tab.length - 1];
}
export const kn = (n: number, vKnown: boolean) => interp(n, vKnown ? KN_VKNOWN : KN_VUNKNOWN);
export const kdn = (n: number, vKnown: boolean) => interp(n, vKnown ? KDN_VKNOWN : KDN_VUNKNOWN);

/** Charakteristischer Wert (5 %-Fraktile) aus n Einzelwerten, log-normalverteilt (D.7.2). vPrior: bekannter Variationskoeffizient (optional). */
export function charValue(values: number[], vPrior?: number) {
  const n = values.length;
  const ln = values.map(Math.log);
  const m = ln.reduce((a, b) => a + b, 0) / n;
  const s = n > 1 ? Math.sqrt(ln.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1)) : NaN;
  const vKnown = vPrior !== undefined;
  const sy = vKnown ? Math.sqrt(Math.log(1 + vPrior! ** 2)) : s;
  const k = kn(n, vKnown);
  return { n, Xk: Math.exp(m - k * sy), kn: k, sy, valid: Number.isFinite(k) && Number.isFinite(sy), mean: values.reduce((a, b) => a + b, 0) / n };
}

/** Bemessungswert direkt aus Versuchen (D.8.2.2), η_d = Umrechnungsfaktor, γ_Rd = Modellunsicherheit. */
export function designFromTests(values: number[], vPrior?: number, etaD = 1.0, gammaRd = 1.0) {
  const n = values.length, ln = values.map(Math.log), m = ln.reduce((a, b) => a + b, 0) / n;
  const vKnown = vPrior !== undefined;
  const s = vKnown ? Math.sqrt(Math.log(1 + vPrior! ** 2)) : Math.sqrt(ln.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1));
  const k = kdn(n, vKnown);
  return { Xd: (etaD * Math.exp(m - k * s)) / gammaRd, kdn: k, valid: Number.isFinite(k) };
}

/** Lognormaler Bemessungswert bei bekanntem V (Grundgleichung EN 1990 Anh. C / EN 1990-2), inkl. Modellunsicherheit γ_Rd. */
export const designLognormal = (fm: number, V: number, beta = 3.8, alphaR = 0.8, gammaRd = 1.1) =>
  (fm * Math.exp(-alphaR * beta * Math.sqrt(Math.log(1 + V * V)) - 0.5 * Math.log(1 + V * V))) / gammaRd;

// ---------- 3) Beton im Bestand ----------
/** DIN EN 13791: charakteristische In-situ-Festigkeit → charakteristische Festigkeit der Druckfestigkeitsklasse (f_ck ≈ f_ck,is / 0,85). */
export const fckFromInSitu = (fckIs: number) => fckIs / 0.85;
export const C_CLASSES = [[8, 10], [12, 15], [16, 20], [20, 25], [25, 30], [30, 37], [35, 45], [40, 50], [45, 55], [50, 60]] as const;
/** Höchste Klasse, deren f_ck ≤ gegebenem Wert (konservative Einstufung). */
export function classFor(fck: number) {
  let c: readonly [number, number] | null = null;
  for (const k of C_CLASSES) if (k[0] <= fck + 1e-9) c = k;
  return c ? `C${c[0]}/${c[1]}` : '< C8/10';
}

// ---------- 4) Mauerwerk (DIN EN 1996-1-1, Gl. 3.1; NA beachten) ----------
export const fkMasonry = (fb: number, fm: number, K = 0.55, alpha = 0.7, beta = 0.3) => K * fb ** alpha * fm ** beta;
export const fdMasonry = (fk: number, gammaM = 1.5, zeta = 0.85) => (zeta * fk) / gammaM;

// ---------- 5) Holz: Restquerschnitt ----------
/** Verhältnis der Biege-Tragfähigkeit (W ∝ b·h²) bei Restquerschnitt b_eff, h_eff. */
export const bendingRatio = (b: number, h: number, bEff: number, hEff: number) => (bEff * hEff ** 2) / (b * h ** 2);
