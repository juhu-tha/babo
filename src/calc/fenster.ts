/**
 * Wärmedurchgangskoeffizient von Fenstern nach DIN EN ISO 10077-1:
 * U_w = (A_g·U_g + A_f·U_f + l_g·Ψ_g) / (A_g + A_f). Reiner Rechenkern – geprüft in tests/fenster.test.ts.
 */
import { type Hinweis, istEndlich, muss, hatFehler, bereich } from './plausibilitaet';

/** Lineare Wärmedurchgangskoeffizienten Ψ_g des Glasrandverbunds [W/(mK)] (Lehrwerte nach DIN EN ISO 10077-1, Anhang) */
export const PSI_ABSTANDHALTER = { alu: 0.08, edelstahl: 0.06, warm_edge_kunststoff: 0.038 } as const;
/** Höchstwert U_w bei Austausch von Außenfenstern nach GEG, Anlage 7 [W/(m²K)] */
export const GEG_UW_MAX = 1.3;

export interface FensterEingabe { breite: number; hoehe: number; rahmenMm: number; ug: number; uf: number; psi: number; g: number; strahlung: number }

export function uwFenster(e: FensterEingabe) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.breite, e.hoehe, e.rahmenMm, e.ug, e.uf, e.psi, e.g, e.strahlung), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.breite > 0 && e.hoehe > 0, 'breite', 'Breite und Höhe müssen größer als 0 sein.');
    muss(hinweise, e.rahmenMm >= 0 && 2 * e.rahmenMm / 1000 < Math.min(e.breite, e.hoehe), 'rahmenMm', 'Der Rahmen ist breiter als das halbe Fenster – es bleibt keine Glasfläche.');
    muss(hinweise, e.ug > 0 && e.uf > 0 && e.psi >= 0, 'ug', 'U_g und U_f müssen größer als 0 sein, Ψ ≥ 0.');
    muss(hinweise, e.g >= 0 && e.g <= 1, 'g', 'Der g-Wert liegt zwischen 0 und 1.');
  }
  if (hatFehler(hinweise)) return { A: NaN, Ag: NaN, Af: NaN, lg: NaN, uw: NaN, phiGlas: NaN, phiRahmen: NaN, phiRand: NaN, solar: NaN, gegKonform: false, passivhaus: false, hinweise };
  const A = e.breite * e.hoehe;
  const b = e.rahmenMm / 1000;
  const gb = e.breite - 2 * b, gh = e.hoehe - 2 * b;
  const Ag = gb * gh, Af = A - Ag, lg = 2 * (gb + gh);
  const phiGlas = Ag * e.ug, phiRahmen = Af * e.uf, phiRand = lg * e.psi;
  const uw = (phiGlas + phiRahmen + phiRand) / A;
  bereich(hinweise, 'ug', e.ug, 0.4, 6, 'U_g außerhalb des üblichen Bereichs (0,4–6 W/(m²K)).');
  if (Af / A > 0.5) hinweise.push({ stufe: 'warnung', feld: 'rahmenMm', text: 'Der Rahmenanteil liegt über 50 % – für Fenster unüblich.' });
  return { A, Ag, Af, lg, uw, phiGlas, phiRahmen, phiRand, solar: Ag * e.g * e.strahlung, gegKonform: uw <= GEG_UW_MAX, passivhaus: uw <= 0.8, hinweise };
}
