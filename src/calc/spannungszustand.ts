/**
 * Ebener Spannungszustand und Mohr'scher Spannungskreis (Z24, Modul „Festigkeitsberechnungen“).
 *
 * Gegeben σ_x, σ_y, τ_xy [N/mm²] (Zug positiv; τ_xy positiv am positiven Schnittufer in positiver Richtung).
 * Drehung des Schnitts um den Winkel θ (gegen den Uhrzeigersinn von der x-Achse):
 *   σ_ξ  = (σ_x + σ_y)/2 + (σ_x − σ_y)/2 · cos 2θ + τ_xy · sin 2θ
 *   σ_η  = (σ_x + σ_y)/2 − (σ_x − σ_y)/2 · cos 2θ − τ_xy · sin 2θ
 *   τ_ξη = −(σ_x − σ_y)/2 · sin 2θ + τ_xy · cos 2θ
 * Mittelpunkt und Radius des Mohr'schen Kreises: σ_M = (σ_x + σ_y)/2, R = √(((σ_x − σ_y)/2)² + τ_xy²)
 * Hauptspannungen σ_1,2 = σ_M ± R; Hauptrichtung φ_1 = ½ · atan2(2 τ_xy, σ_x − σ_y) (Winkel x-Achse → σ_1);
 * größte Schubspannung in der Ebene τ_max = R unter φ_1 ± 45°.
 * Vergleichsspannungen (ebener Spannungszustand, σ_3 = 0): von Mises σ_v = √(σ_1² − σ_1 σ_2 + σ_2²),
 * Tresca σ_v = max(|σ_1 − σ_2|, |σ_1|, |σ_2|).
 * Quellen: Gross/Hauger/Schröder/Wall, Technische Mechanik 2 (Elastostatik), Kap. 2; Wandinger, J.:
 * Technische Mechanik 2, Übungen 2.3/2.5, Hochschule München (öffentlich, wandinger.userweb.mwn.de).
 * Reiner Rechenkern – geprüft in tests/spannungszustand.test.ts.
 */
import { type Hinweis, istEndlich, muss, hatFehler, bereich } from './plausibilitaet';

export interface EbenerSpannungszustand {
  /** Normalspannung in x-Richtung [N/mm²] */
  sx: number;
  /** Normalspannung in y-Richtung [N/mm²] */
  sy: number;
  /** Schubspannung τ_xy [N/mm²] */
  txy: number;
}

export interface GedrehterSchnitt {
  /** Normalspannung in ξ-Richtung [N/mm²] */
  sXi: number;
  /** Normalspannung in η-Richtung [N/mm²] */
  sEta: number;
  /** Schubspannung τ_ξη [N/mm²] */
  tXiEta: number;
}

export interface Spannungsergebnis {
  /** Kreismittelpunkt σ_M [N/mm²] */
  sigmaM: number;
  /** Kreisradius R = τ_max in der Ebene [N/mm²] */
  R: number;
  sigma1: number;
  sigma2: number;
  /** Winkel von der x-Achse zur Richtung von σ_1 [°], −90° < φ_1 ≤ 90° */
  phi1Grad: number;
  /** Winkel zur Richtung von σ_2 [°] (φ_1 − 90°, in −90° … 90°) */
  phi2Grad: number;
  /** Winkel zur Schnittrichtung mit τ_max [°] (φ_1 − 45°, in −90° … 90°) */
  phiTauGrad: number;
  /** größte Schubspannung in der Ebene [N/mm²] */
  tauMax: number;
  /** größte Schubspannung räumlich mit σ_3 = 0 [N/mm²] */
  tauMaxRaeumlich: number;
  /** Vergleichsspannung nach von Mises [N/mm²] */
  sigmaVMises: number;
  /** Vergleichsspannung nach Tresca [N/mm²] */
  sigmaVTresca: number;
  /** Ausnutzung σ_v,Mises / f_y (nur mit f_y, sonst NaN) */
  eta: number;
  hinweise: Hinweis[];
}

const GRAD = 180 / Math.PI;

/** Winkel in das Intervall (−90°, 90°] bringen (Richtungen sind um 180° periodisch) */
export function richtungGrad(w: number): number {
  let r = w % 180;
  if (r <= -90) r += 180;
  if (r > 90) r -= 180;
  return r;
}

/** Spannungen im um θ [°] gedrehten Schnitt (Transformationsgleichungen) */
export function transformiere(z: EbenerSpannungszustand, thetaGrad: number): GedrehterSchnitt {
  const t2 = (2 * thetaGrad) / GRAD;
  const m = (z.sx + z.sy) / 2, d = (z.sx - z.sy) / 2;
  const c = Math.cos(t2), s = Math.sin(t2);
  return { sXi: m + d * c + z.txy * s, sEta: m - d * c - z.txy * s, tXiEta: -d * s + z.txy * c };
}

/** Mittelpunkt σ_M und Radius R des Mohr'schen Kreises */
export function mohrKreis(z: EbenerSpannungszustand): { sigmaM: number; R: number } {
  return { sigmaM: (z.sx + z.sy) / 2, R: Math.hypot((z.sx - z.sy) / 2, z.txy) };
}

/** Vergleichsspannung nach von Mises aus σ_x, σ_y, τ_xy: √(σ_x² + σ_y² − σ_x σ_y + 3 τ_xy²) */
export function vonMises(z: EbenerSpannungszustand): number {
  return Math.sqrt(Math.max(0, z.sx * z.sx + z.sy * z.sy - z.sx * z.sy + 3 * z.txy * z.txy));
}

const LEER = (hinweise: Hinweis[]): Spannungsergebnis => ({
  sigmaM: NaN, R: NaN, sigma1: NaN, sigma2: NaN, phi1Grad: NaN, phi2Grad: NaN, phiTauGrad: NaN,
  tauMax: NaN, tauMaxRaeumlich: NaN, sigmaVMises: NaN, sigmaVTresca: NaN, eta: NaN, hinweise,
});

/** Hauptspannungen, Hauptrichtung, τ_max und Vergleichsspannungen; optional Ausnutzung gegen f_y [N/mm²] */
export function hauptspannungen(z: EbenerSpannungszustand, fy?: number): Spannungsergebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(z.sx, z.sy, z.txy), 'eingabe', 'σ_x, σ_y und τ_xy müssen Zahlen sein.');
  if (fy !== undefined) muss(hinweise, istEndlich(fy) && fy > 0, 'fy', 'Die Streckgrenze f_y muss eine Zahl größer als 0 sein.');
  if (hatFehler(hinweise)) return LEER(hinweise);

  const { sigmaM, R } = mohrKreis(z);
  const sigma1 = sigmaM + R, sigma2 = sigmaM - R;
  const isotrop = R <= 1e-12 * Math.max(1, Math.abs(sigmaM));
  const phi1Grad = isotrop ? 0 : richtungGrad(0.5 * Math.atan2(2 * z.txy, z.sx - z.sy) * GRAD);
  const phi2Grad = richtungGrad(phi1Grad - 90);
  const phiTauGrad = richtungGrad(phi1Grad - 45);
  const tauMaxRaeumlich = Math.max(R, Math.abs(sigma1) / 2, Math.abs(sigma2) / 2);
  const sigmaVMises = Math.sqrt(Math.max(0, sigma1 * sigma1 - sigma1 * sigma2 + sigma2 * sigma2));
  const sigmaVTresca = Math.max(Math.abs(sigma1 - sigma2), Math.abs(sigma1), Math.abs(sigma2));
  const eta = fy !== undefined ? sigmaVMises / fy : NaN;

  for (const [feld, w] of [['sx', z.sx], ['sy', z.sy], ['txy', z.txy]] as const) {
    bereich(hinweise, feld, w, -1000, 1000, 'Spannungen über 1000 N/mm² liegen oberhalb der Festigkeit üblicher Baustähle – Eingabe prüfen.');
  }
  if (isotrop) hinweise.push({ stufe: 'warnung', feld: 'txy', text: 'Hydrostatischer (isotroper) Spannungszustand: Der Mohr\'sche Kreis ist ein Punkt, jede Richtung ist Hauptrichtung (φ₁ = 0° gesetzt).' });
  if (sigma1 > 0 && sigma2 > 0 && tauMaxRaeumlich > R) hinweise.push({ stufe: 'warnung', feld: 'txy', text: 'Beide Hauptspannungen sind Zug: Die größte Schubspannung tritt räumlich mit σ₃ = 0 auf (τ = σ₁/2), nicht in der Ebene.' });
  if (sigma1 < 0 && sigma2 < 0 && tauMaxRaeumlich > R) hinweise.push({ stufe: 'warnung', feld: 'txy', text: 'Beide Hauptspannungen sind Druck: Die größte Schubspannung tritt räumlich mit σ₃ = 0 auf (τ = |σ₂|/2), nicht in der Ebene.' });
  if (fy !== undefined && eta > 1) hinweise.push({ stufe: 'warnung', feld: 'fy', text: 'Die Vergleichsspannung nach von Mises überschreitet die Streckgrenze – der Werkstoff fließt (ohne Teilsicherheitsbeiwerte).' });

  return { sigmaM, R, sigma1, sigma2, phi1Grad, phi2Grad, phiTauGrad, tauMax: R, tauMaxRaeumlich, sigmaVMises, sigmaVTresca, eta, hinweise };
}

/** Punkte des Mohr'schen Kreises (σ, τ) für die Zeichnung, n Stützstellen */
export function kreisPunkte(z: EbenerSpannungszustand, n = 72): { sigma: number; tau: number }[] {
  const { sigmaM, R } = mohrKreis(z);
  return Array.from({ length: n + 1 }, (_, i) => {
    const w = (2 * Math.PI * i) / n;
    return { sigma: sigmaM + R * Math.cos(w), tau: R * Math.sin(w) };
  });
}
