/**
 * Holzphysik: Gleichgewichtsfeuchte (Sorptionsmodell Hailwood-Horrobin/Simpson), Feuchteangleich bei Lagerung und
 * anisotropes Quellen und Schwinden. Reiner Rechenkern (Umsetzungsplan Phase 4, AP 4.2) – geprüft in tests/holzphysik.test.ts.
 * Die EC-5-Größen (k_mod, k_def, Bemessungswerte, Druck unter Winkel) liegen in src/calc/holzbau.ts.
 */
import { type Hinweis, bereich, hatFehler, istEndlich, muss } from './plausibilitaet';
import { formatDeZahl } from '../utils/numberFormat';

/** Kohlenstoffanteil der darrtrockenen Holzmasse nach DIN EN 16449 (cf = 0,5) */
export const CF_HOLZ = 0.5;
/** Verhältnis der molaren Massen CO₂/C (44/12) */
export const CO2_JE_C_HOLZ = 44 / 12;

/**
 * Biogenes CO₂ im Holz nach DIN EN 16449: P_CO₂ = 44/12 · cf · ρ_ω · V_ω/(1 + ω/100) [kg CO₂].
 * ρ_ω Rohdichte bei Holzfeuchte ω [kg/m³], ω [%], V_ω [m³]. Umsetzung 30.10.2026 (DSB-RU-1): Grundlage der
 * Lehrwerte BSH und KVH in src/data/gwpLehrwerte.ts. Beispiel: ρ = 500 kg/m³, ω = 12 % → 818,5 kg CO₂ je m³.
 */
export function biogenesCo2DinEn16449(rhoOmega: number, omega = 12, volumen = 1, cf = CF_HOLZ): number {
  return (CO2_JE_C_HOLZ * cf * rhoOmega * volumen) / (1 + omega / 100);
}

/** Obergrenze der schwindwirksamen Holzfeuchte [%] (Fasersättigung, Lehrwert; artabhängig etwa 22–35 %) */
export const FASERSAETTIGUNG = 30;

/** Differentielles Quell- und Schwindmaß q [% je % Holzfeuchte] in den drei Hauptrichtungen */
export interface Schwindmasse { qt: number; qr: number; ql: number }

/**
 * Holzwerkstoffe (T6-HO-1, Umsetzung 29.10.2026): Quell- und Schwindmaße getrennt nach Plattenebene (qt quer, ql längs)
 * und Dickenrichtung (qr). In Plattenebene sperren Furniere bzw. Strands; in Dickenrichtung quellen FSH und OSB etwa
 * wie Vollholz radial oder stärker. Dickenwerte sind Lehrwerte (vorläufig, F-Freigabe), Plattenwerte Richtwerte.
 */
export const HOLZWERKSTOFF_SCHWINDMASSE: Readonly<Record<'FSH' | 'OSB', Schwindmasse>> = {
  FSH: { qt: 0.05, ql: 0.01, qr: 0.24 },
  OSB: { qt: 0.02, ql: 0.02, qr: 0.30 },
};

/**
 * Differentielle Schwind- und Quellmaße [% je % Holzfeuchte] für die Rechner „Historische Bauweisen“ und „Holzbau“,
 * Werte wie in Tranche 10 übernommen (T10-HW-1; TU München, Skript „Holz – Eigenschaften, Merkmale“).
 * Längs: Lehrwert 0,01. Quelle des Holzbau-Moduls: content/holzbaubeta/HolzbauBeta.json (shrinkageCoeffs).
 * Lärche und Buche (Durchsicht D 29.10.2026, DSD-HO-1) wie im Holzbau-Modul (T10-HW-1, gleiche Quelle); das Modul Holz
 * führte für Buche zuvor eine eigene Kopie 0,22/0,45 ohne Quelle.
 */
export const SCHWINDBEIWERTE = {
  fichte: { radial: 0.19, tangential: 0.36, longitudinal: 0.01 },
  kiefer: { radial: 0.19, tangential: 0.36, longitudinal: 0.01 },
  laerche: { radial: 0.14, tangential: 0.29, longitudinal: 0.01 },
  buche: { radial: 0.20, tangential: 0.40, longitudinal: 0.01 },
  eiche: { radial: 0.18, tangential: 0.34, longitudinal: 0.01 },
} as const;

/**
 * Gleichgewichtsfeuchte u_gl [%] aus relativer Luftfeuchte φ [%] und Temperatur θ [°C] nach dem Sorptionsmodell von
 * Hailwood und Horrobin (1946) in der Anpassung von Simpson (1973) an die Tabellen des Forest Products Laboratory
 * (Wood Handbook, FPL-GTR-113, Kap. 3, Gl. 3-3; metrische Koeffizienten):
 *   u = 1800/W · [K·h/(1 − K·h) + (K₁·K·h + 2·K₁·K₂·K²·h²)/(1 + K₁·K·h + K₁·K₂·K²·h²)], h = φ/100
 *   W = 349 + 1,29·θ + 0,0135·θ², K = 0,805 + 0,000736·θ − 0,00000273·θ²,
 *   K₁ = 6,27 − 0,00938·θ − 0,000303·θ², K₂ = 1,91 + 0,0407·θ − 0,000293·θ²
 * Mittelwert für Fichte/Sitka-Fichte (Desorption und Adsorption gemittelt); 20 °C / 65 % → 12,0 %.
 * Gültig etwa 0 … 100 °C; begrenzt auf 0 … FASERSAETTIGUNG.
 */
export function gleichgewichtsfeuchte(phi: number, theta: number): { u: number; begrenzt: boolean; hinweise: Hinweis[] } {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(phi, theta), 'eingabe', 'Luftfeuchte und Temperatur müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, phi >= 0 && phi <= 100, 'phi', 'Die relative Luftfeuchte muss zwischen 0 und 100 % liegen.');
    muss(hinweise, theta >= -20 && theta <= 120, 'theta', 'Das Sorptionsmodell ist für Temperaturen von −20 bis 120 °C angepasst.');
  }
  if (hatFehler(hinweise)) return { u: 0, begrenzt: false, hinweise };
  const roh = sorptionHailwoodHorrobin(phi / 100, theta);
  const u = Math.max(0, Math.min(FASERSAETTIGUNG, roh));
  const begrenzt = u !== roh;
  bereich(hinweise, 'theta', theta, 0, 100, 'Die Koeffizienten nach Simpson sind an Tabellenwerte von etwa 0 bis 100 °C angepasst.');
  if (begrenzt) hinweise.push({ stufe: 'warnung', feld: 'phi', text: `Das Sorptionsmodell liefert hier ${formatDeZahl(roh, 1)} %; begrenzt auf ${FASERSAETTIGUNG} % (Fasersättigung) bzw. 0 %.` });
  return { u, begrenzt, hinweise };
}

/** Hailwood-Horrobin-Gleichung (Simpson 1973, metrisch): Holzfeuchte [%] bei relativer Feuchte h [–] und Temperatur θ [°C] */
export function sorptionHailwoodHorrobin(h: number, theta: number): number {
  const W = 349 + 1.29 * theta + 0.0135 * theta ** 2;
  const K = 0.805 + 0.000736 * theta - 0.00000273 * theta ** 2;
  const K1 = 6.27 - 0.00938 * theta - 0.000303 * theta ** 2;
  const K2 = 1.91 + 0.0407 * theta - 0.000293 * theta ** 2;
  const kh = K * h;
  return (1800 / W) * (kh / (1 - kh) + (K1 * kh + 2 * K1 * K2 * kh * kh) / (1 + K1 * kh + K1 * K2 * kh * kh));
}

/**
 * Zeitkonstante τ [d] des Feuchteangleichs: τ = 15 d · (d/20 mm)² (Diffusion ∝ Dicke², Kalibrierung als Lehrannahme).
 */
export function zeitkonstanteFeuchte(dickeMm: number): number {
  return (dickeMm / 20) ** 2 * 15;
}

/** Holzfeuchte nach t Tagen Lagerung: u(t) = u_gl + (u_0 − u_gl) · e^(−t/τ) */
export function feuchteNachLagerung(uStart: number, uGl: number, tage: number, dickeMm: number): { u: number; tau: number; hinweise: Hinweis[] } {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(uStart, uGl, tage, dickeMm), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, uStart >= 0 && uGl >= 0, 'uStart', 'Die Holzfeuchte muss ≥ 0 % sein.');
    muss(hinweise, tage >= 0, 'tage', 'Die Lagerdauer muss ≥ 0 Tage sein.');
    muss(hinweise, dickeMm > 0, 'dicke', 'Die Bauteildicke muss größer als 0 sein.');
  }
  if (hatFehler(hinweise)) return { u: 0, tau: 0, hinweise };
  const tau = zeitkonstanteFeuchte(dickeMm);
  return { u: uGl + (uStart - uGl) * Math.exp(-tage / tau), tau, hinweise };
}

/** Maßänderung [%] bei einer Feuchteänderung Δu [%]: ε = Δu · q */
export function schwindmass(deltaU: number, q: number): number {
  return deltaU * q;
}

export interface SchwindenEingabe extends Schwindmasse {
  uStart: number; uEnde: number; // Holzfeuchte [%]
  breite: number; dicke: number; laenge: number; // [mm]; beim Rundholz ist dicke = Durchmesser = breite
}

export interface SchwindenErgebnis {
  /** schwindwirksame Feuchteänderung (beide Werte auf Fasersättigung begrenzt), positiv = Schwinden */
  deltaU: number;
  /** Dehnungen als Anteil (Schwinden positiv) tangential, radial, längs */
  epsT: number; epsR: number; epsL: number;
  /** Volumenschwindmaß als Anteil: 1 − (1 − ε_T)(1 − ε_R)(1 − ε_L) */
  epsV: number;
  neueBreite: number; neueDicke: number; neueLaenge: number;
  /** Beträge der Maßänderung in µm/m */
  mikroT: number; mikroR: number; mikroL: number;
  hinweise: Hinweis[];
}

/** Anisotropes Schwinden: Breite tangential, Dicke radial, Länge longitudinal; nur unterhalb der Fasersättigung wirksam */
export function schwinden(e: SchwindenEingabe): SchwindenErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.uStart, e.uEnde, e.qt, e.qr, e.ql, e.breite, e.dicke, e.laenge), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.uStart >= 0 && e.uEnde >= 0, 'uStart', 'Die Holzfeuchte muss ≥ 0 % sein.');
    muss(hinweise, e.qt >= 0 && e.qr >= 0 && e.ql >= 0, 'q', 'Die Quell- und Schwindmaße müssen ≥ 0 sein.');
    muss(hinweise, e.breite > 0 && e.dicke > 0 && e.laenge > 0, 'breite', 'Breite, Dicke und Länge müssen größer als 0 sein.');
  }
  if (hatFehler(hinweise)) {
    return { deltaU: 0, epsT: 0, epsR: 0, epsL: 0, epsV: 0, neueBreite: 0, neueDicke: 0, neueLaenge: 0, mikroT: 0, mikroR: 0, mikroL: 0, hinweise };
  }
  const deltaU = Math.min(e.uStart, FASERSAETTIGUNG) - Math.min(e.uEnde, FASERSAETTIGUNG);
  const epsT = schwindmass(deltaU, e.qt) / 100;
  const epsR = schwindmass(deltaU, e.qr) / 100;
  const epsL = schwindmass(deltaU, e.ql) / 100;
  if (e.uStart > FASERSAETTIGUNG) hinweise.push({ stufe: 'warnung', feld: 'uStart', text: `Oberhalb der Fasersättigung (${FASERSAETTIGUNG} %) verdunstet zunächst freies Wasser ohne Maßänderung; gerechnet wird ab ${FASERSAETTIGUNG} %.` });
  return {
    deltaU, epsT, epsR, epsL, epsV: 1 - (1 - epsT) * (1 - epsR) * (1 - epsL),
    neueBreite: e.breite * (1 - epsT), neueDicke: e.dicke * (1 - epsR), neueLaenge: e.laenge * (1 - epsL),
    mikroT: Math.abs(epsT) * 1e6, mikroR: Math.abs(epsR) * 1e6, mikroL: Math.abs(epsL) * 1e6,
    hinweise,
  };
}
