/**
 * Holzphysik: Gleichgewichtsfeuchte (Lehrmodell der Sorptionsisotherme), Feuchteangleich bei Lagerung und
 * anisotropes Quellen und Schwinden. Reiner Rechenkern (Umsetzungsplan Phase 4, AP 4.2) – geprüft in tests/holzphysik.test.ts.
 * Die EC-5-Größen (k_mod, k_def, Bemessungswerte, Druck unter Winkel) liegen in src/calc/holzbau.ts.
 */
import { type Hinweis, bereich, hatFehler, istEndlich, muss } from './plausibilitaet';
import { formatDeZahl } from '../utils/numberFormat';

/** Obergrenze der schwindwirksamen Holzfeuchte [%] (Fasersättigung, Lehrwert; artabhängig etwa 22–35 %) */
export const FASERSAETTIGUNG = 30;

/** Differentielles Quell- und Schwindmaß q [% je % Holzfeuchte] in den drei Hauptrichtungen */
export interface Schwindmasse { qt: number; qr: number; ql: number }

/**
 * Gleichgewichtsfeuchte u_gl [%] aus relativer Luftfeuchte φ [%] und Temperatur θ [°C].
 * Lehrmodell: kubisches Polynom der Sorptionsisotherme bei 20 °C, Temperaturkorrektur −1 % relativ je K über 20 °C,
 * begrenzt auf 0 … FASERSAETTIGUNG.
 */
export function gleichgewichtsfeuchte(phi: number, theta: number): { u: number; begrenzt: boolean; hinweise: Hinweis[] } {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(phi, theta), 'eingabe', 'Luftfeuchte und Temperatur müssen Zahlen sein.');
  if (!hatFehler(hinweise)) muss(hinweise, phi >= 0 && phi <= 100, 'phi', 'Die relative Luftfeuchte muss zwischen 0 und 100 % liegen.');
  if (hatFehler(hinweise)) return { u: 0, begrenzt: false, hinweise };
  const h = phi / 100;
  const roh = (18 * h * h * h - 10 * h * h + 20 * h) * (1 - (theta - 20) * 0.01);
  const u = Math.max(0, Math.min(FASERSAETTIGUNG, roh));
  const begrenzt = u !== roh;
  bereich(hinweise, 'theta', theta, -10, 40, 'Die Temperaturkorrektur des Lehrmodells ist nur für etwa −10 bis 40 °C abgestimmt.');
  if (begrenzt) hinweise.push({ stufe: 'warnung', feld: 'phi', text: `Das Lehrmodell liefert hier ${formatDeZahl(roh, 1)} %; begrenzt auf ${FASERSAETTIGUNG} % (Fasersättigung) bzw. 0 %.` });
  return { u, begrenzt, hinweise };
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
