/**
 * Baustatik: Einfeldträger, Kragarm und Zweifeldträger (EI konstant) unter Gleichlast q, Einzellast F und Einzelmoment M0;
 * Dreigelenkrahmen mit Gelenk in Riegelmitte. Reiner Rechenkern – geprüft in tests/statik.test.ts.
 * Vorzeichen: M positiv bei Zug unten, M0 im Uhrzeigersinn positiv (Sprung +M0 im Momentenverlauf).
 */
import { type Hinweis, istEndlich, muss, hatFehler } from './plausibilitaet';

export type Traegersystem = 'einfeld' | 'kragarm' | 'zweifeld';
export interface TraegerEingabe { system: Traegersystem; l: number; l1: number; q: number; f: number; a: number; m0: number; am: number }

export function traeger(e: TraegerEingabe) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.l, e.l1, e.q, e.f, e.a, e.m0, e.am), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.l > 0, 'l', 'Die Länge muss größer als 0 sein.');
    muss(hinweise, e.a >= 0 && e.a <= e.l && e.am >= 0 && e.am <= e.l, 'a', 'Die Laststellungen müssen auf dem Träger liegen (0 ≤ a ≤ l).');
    if (e.system === 'zweifeld') muss(hinweise, e.l1 > 0 && e.l1 < e.l, 'l1', 'Das Mittelauflager muss zwischen den Endauflagern liegen (0 < l₁ < l).');
  }
  if (hatFehler(hinweise)) return { A: NaN, B: NaN, C: NaN, MA: NaN, MB: NaN, M: (_: number) => NaN, V: (_: number) => NaN, hinweise };

  const { l, q, f, a, m0, am } = e;
  let A = 0, B = 0, C = 0, MA = 0, MB = 0;
  const L1 = e.l1, L2 = l - e.l1;
  if (e.system === 'einfeld') {
    A = (q * l) / 2 + (f * (l - a)) / l - m0 / l;
    B = (q * l) / 2 + (f * a) / l + m0 / l;
  } else if (e.system === 'kragarm') {
    A = q * l + f;
    MA = -(q * l * l) / 2 - f * a - m0;
  } else {
    // Dreimomentengleichung (Clapeyron) für das Stützmoment M_B
    MB = (-q * (L1 ** 3 + L2 ** 3)) / (8 * l);
    if (a <= L1) MB -= (f * a * (L1 * L1 - a * a)) / (2 * L1 * l);
    else { const b = l - a; MB -= (f * b * (L2 * L2 - b * b)) / (2 * L2 * l); }
    if (am <= L1) MB += (m0 / (2 * l)) * ((3 * am * am) / L1 - L1);
    else { const b = l - am; MB += (m0 / (2 * l)) * (L2 - (3 * b * b) / L2); }
    const A0 = (q * L1) / 2 + (a <= L1 ? (f * (L1 - a)) / L1 : 0) - (am <= L1 ? m0 / L1 : 0);
    const B0L = (q * L1) / 2 + (a <= L1 ? (f * a) / L1 : 0) + (am <= L1 ? m0 / L1 : 0);
    const a2 = a - L1;
    const B0R = (q * L2) / 2 + (a > L1 ? (f * (L2 - a2)) / L2 : 0) - (am > L1 ? m0 / L2 : 0);
    const C0 = (q * L2) / 2 + (a > L1 ? (f * a2) / L2 : 0) + (am > L1 ? m0 / L2 : 0);
    A = A0 + MB / L1;
    C = C0 + MB / L2;
    B = B0L - MB / L1 + B0R - MB / L2;
  }
  const V = (x: number) => A - q * x + (e.system === 'zweifeld' && x > L1 ? B : 0) - (x > a ? f : 0);
  const M = (x: number) => A * x - (q * x * x) / 2 + (e.system === 'kragarm' ? MA : 0) + (e.system === 'zweifeld' && x > L1 ? B * (x - L1) : 0)
    - (x > a ? f * (x - a) : 0) + (x > am ? m0 : 0);
  return { A, B, C, MA, MB, M, V, hinweise };
}

/** Dreigelenkrahmen (Stiele h, Riegel l, Gelenk in Riegelmitte): Gleichlast q auf dem Riegel, Horizontallast W an der linken Ecke */
export function dreigelenkrahmen(h: number, l: number, q: number, w: number) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(h, l, q, w) && h > 0 && l > 0, 'eingabe', 'Höhe und Breite des Rahmens müssen größer als 0 sein.');
  if (hatFehler(hinweise)) return { Av: NaN, Ah: NaN, Bv: NaN, Bh: NaN, M_Ecke_Links: NaN, M_Ecke_Rechts: NaN, M_Feld_Max: NaN, x_max: NaN, hinweise };
  const Bv = (q * l) / 2 + (w * h) / l;
  const Av = q * l - Bv;
  const Bh = ((q * l * l) / 8 + (w * h) / 2) / h;
  const Ah = w - Bh;
  const M_Ecke_Links = Ah * h, M_Ecke_Rechts = Bh * h;
  const x_max = q > 0 ? Math.min(Math.max(Av / q, 0), l) : 0;
  const M_Feld_Max = M_Ecke_Links + Av * x_max - (q * x_max * x_max) / 2;
  return { Av, Ah, Bv, Bh, M_Ecke_Links, M_Ecke_Rechts, M_Feld_Max, x_max, hinweise };
}
