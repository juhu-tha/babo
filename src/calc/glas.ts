/**
 * Bauglas (Umsetzungsplan Phase 4, AP 4.2). Reiner Rechenkern – geprüft in tests/glas.test.ts.
 * Verhalten 1:1 aus src/modules/Glas.tsx übernommen.
 *
 * 1. Bruchwahrscheinlichkeit nach Weibull (Zwei-Parameter-Ansatz mit Flächeneinfluss):
 *      P_f = 1 − exp(−(σ/σ₀)^m · A/A₀),  A₀ = 1 m²
 *    σ₀ im Modul als Lehrmodell 1,5 · f_g,k (keine Normgröße).
 * 2. Schubverbund von VSG nach dem Verfahren der effektiven Dicke (Wölfel/Bennison, wiedergegeben in EN 16612,
 *    Anhang; öffentlich z. B. Saint-Gobain Glass „The effective thickness of laminated glass“: β = 9,6):
 *      Γ = 1 / (1 + 9,6 · E · I_s · h_v / (G · h_s² · a²)),   h_s = (h₁ + h₂)/2 + h_v
 *      I_s = h₁ · h₁,m² + h₂ · h₂,m²,  h₁,m = h_s · h₂/(h₁ + h₂),  h₂,m = h_s · h₁/(h₁ + h₂)
 *      h_ef,w = ∛(h₁³ + h₂³ + 12 · Γ · I_s)
 *    Kontrollwert: balconette.co.uk, „Structural assessment of laminated toughened glass“ (Annex 01.03.2023),
 *    Fall A 5 + 1,52 + 5 mm mit ω = 0,3 → h_ef,w = 8,57 mm.
 *    Schubmodul der PVB-Folie: stark vereinfachte Lehrwerte, lineare Interpolation 0 … 60 °C
 *    (produktabhängig; maßgebend sind Zulassung/Datenblatt bzw. die Steifigkeitsfamilien nach EN 16613).
 * 3. Thermische Zwängungsspannung bei voll behinderter Dehnung: σ_T ≈ E · α_T · ΔT.
 * Lehr- und Vorbemessungswerkzeug; ersetzt keinen Standsicherheitsnachweis nach DIN 18008.
 */
import { type Hinweis, bereich, hatFehler, istEndlich, muss } from './plausibilitaet';

/** E-Modul Kalk-Natron-Silikatglas [MPa] */
export const E_GLAS = 70000;
/** Temperaturdehnzahl Kalk-Natron-Silikatglas [1/K] */
export const ALPHA_T_GLAS = 9e-6;
/** Bezugsfläche der Weibull-Verteilung [m²] */
export const A0_WEIBULL = 1.0;
/** Lehrmodell σ₀ = 1,5 · f_g,k (keine Normgröße) */
export const SIGMA0_FAKTOR = 1.5;
/** Weibull-Koeffizient β nach Wölfel für Einfeldträger unter Gleichlast */
export const BETA_WOELFEL = 9.6;

// ---------------------------------------------------------------------------------------------------
// 1. Weibull
// ---------------------------------------------------------------------------------------------------

export const sigma0Lehrmodell = (fgk: number) => fgk * SIGMA0_FAKTOR;

/** Bruchwahrscheinlichkeit P_f [-] */
export const bruchwahrscheinlichkeit = (sigma: number, sigma0: number, m: number, A: number, A0: number = A0_WEIBULL) =>
  1 - Math.exp(-Math.pow(sigma / sigma0, m) * (A / A0));

export interface WeibullEingabe {
  /** vorhandene Spannung [MPa] */
  sigma: number;
  /** charakteristische Weibull-Festigkeit σ₀ [MPa] */
  sigma0: number;
  /** Weibull-Modul m [-] */
  m: number;
  /** Scheibenfläche [m²] */
  A: number;
}

export interface WeibullErgebnis {
  /** P_f bei der vorhandenen Spannung [-] */
  pf: number;
  /** Kurve P_f(σ) für σ = 0 … 120 MPa (Schritt 2) */
  kurve: { x: number; y: number }[];
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function weibull(e: WeibullEingabe): WeibullErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.sigma, e.sigma0, e.m, e.A), 'weibull', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.sigma >= 0, 'sigma', 'Die Spannung darf nicht negativ sein.');
    muss(hinweise, e.sigma0 > 0, 'sigma0', 'Die Weibull-Festigkeit σ₀ muss größer als 0 sein.');
    muss(hinweise, e.m > 0, 'm', 'Der Weibull-Modul muss größer als 0 sein.');
    muss(hinweise, e.A > 0, 'A', 'Die Scheibenfläche muss größer als 0 sein.');
  }
  if (hatFehler(hinweise)) return { pf: NaN, kurve: [], gueltig: false, hinweise };
  bereich(hinweise, 'm', e.m, 3, 25, 'Weibull-Modul außerhalb 3 … 25 – für Floatglas werden meist Werte um 5 … 8 angegeben.');
  const kurve: { x: number; y: number }[] = [];
  for (let s = 0; s <= 120; s += 2) kurve.push({ x: s, y: bruchwahrscheinlichkeit(s, e.sigma0, e.m, e.A) * 100 });
  return { pf: bruchwahrscheinlichkeit(e.sigma, e.sigma0, e.m, e.A), kurve, gueltig: true, hinweise };
}

// ---------------------------------------------------------------------------------------------------
// 2. VSG – Schubverbund und effektive Dicke
// ---------------------------------------------------------------------------------------------------

export type Lastdauer = 'short' | 'medium' | 'long';

/** Lehrwerte Schubmodul PVB [MPa] bei 0/20/40/60 °C (stark vereinfacht, produktabhängig) */
export const PVB_G_LEHR: Readonly<Record<Lastdauer, Readonly<Record<0 | 20 | 40 | 60, number>>>> = {
  short: { 0: 400, 20: 10, 40: 0.5, 60: 0.1 },
  medium: { 0: 100, 20: 1.0, 40: 0.1, 60: 0.01 },
  long: { 0: 10, 20: 0.1, 40: 0.01, 60: 0.001 },
};

/** Schubmodul G der PVB-Folie [MPa]: lineare Interpolation, außerhalb 0 … 60 °C konstant fortgesetzt */
export function schubmodulPvb(T: number, dauer: Lastdauer): number {
  const v = PVB_G_LEHR[dauer];
  if (T <= 0) return v[0];
  if (T >= 60) return v[60];
  const k = (T < 20 ? 0 : T < 40 ? 20 : 40) as 0 | 20 | 40;
  const k2 = (k + 20) as 20 | 40 | 60;
  return v[k] + ((T - k) / 20) * (v[k2] - v[k]);
}

/** Abstand h_s der Scheibenmitten und Steiner-Anteil I_s [mm, mm³ je mm Breite] */
export function steinerAnteil(h1: number, h2: number, hv: number) {
  const hs = (h1 + h2) / 2 + hv;
  const h1m = (hs * h2) / (h1 + h2);
  const h2m = (hs * h1) / (h1 + h2);
  return { hs, Is: h1 * h1m ** 2 + h2 * h2m ** 2 };
}

/** Schubübertragungsbeiwert Γ (Wölfel/Bennison): G in MPa, Längen in mm, E in MPa */
export function schubverbundGamma(h1: number, h2: number, hv: number, G: number, a: number, E: number = E_GLAS): number {
  const { hs, Is } = steinerAnteil(h1, h2, hv);
  return 1 / (1 + (BETA_WOELFEL * E * Is * hv) / (G * hs ** 2 * a ** 2));
}

/** effektive Dicke für die Durchbiegung h_ef,w = ∛(h₁³ + h₂³ + 12·Γ·I_s) [mm] */
export function effektiveDickeW(h1: number, h2: number, hv: number, gamma: number): number {
  const { Is } = steinerAnteil(h1, h2, hv);
  return Math.cbrt(h1 ** 3 + h2 ** 3 + 12 * gamma * Is);
}

export interface VsgEingabe {
  /** Temperatur [°C] */
  T: number;
  dauer: Lastdauer;
  /** Glasdicken und Foliendicke [mm] (Modul: 8 + 1,52 + 8) */
  h1: number;
  h2: number;
  hv: number;
  /** Stützweite [mm] (Modul: 1000) */
  a: number;
}

export interface VsgErgebnis {
  G: number;
  Gamma: number;
  hef_w: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

/** Standardaufbau im Modul: VSG 2 × 8 mm mit 1,52 mm PVB, Stützweite 1 m */
export const VSG_MODUL = { h1: 8, h2: 8, hv: 1.52, a: 1000 } as const;

export function vsgEffektiveDicke(e: VsgEingabe): VsgErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.T, e.h1, e.h2, e.hv, e.a), 'vsg', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.h1 > 0 && e.h2 > 0, 'h', 'Die Glasdicken müssen größer als 0 sein.');
    muss(hinweise, e.hv > 0, 'hv', 'Die Foliendicke muss größer als 0 sein.');
    muss(hinweise, e.a > 0, 'a', 'Die Stützweite muss größer als 0 sein.');
  }
  if (hatFehler(hinweise)) return { G: NaN, Gamma: NaN, hef_w: NaN, gueltig: false, hinweise };
  if (e.T < 0 || e.T > 60) hinweise.push({ stufe: 'warnung', feld: 'T', text: 'Temperatur außerhalb 0 … 60 °C: Der Schubmodul wird mit dem Randwert fortgesetzt.' });
  const G = schubmodulPvb(e.T, e.dauer);
  const Gamma = schubverbundGamma(e.h1, e.h2, e.hv, G, e.a);
  return { G, Gamma, hef_w: effektiveDickeW(e.h1, e.h2, e.hv, Gamma), gueltig: true, hinweise };
}

// ---------------------------------------------------------------------------------------------------
// 3. Thermischer Glasbruch
// ---------------------------------------------------------------------------------------------------

/** Zwängungsspannung bei voll behinderter Dehnung σ_T = E · α_T · ΔT [MPa] */
export const thermischeSpannung = (deltaT: number, E: number = E_GLAS, alpha: number = ALPHA_T_GLAS) => E * alpha * deltaT;
