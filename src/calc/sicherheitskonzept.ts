/**
 * Rechenkern Eurocode-Sicherheitskonzept: Grundkombination nach DIN EN 1990, Gl. 6.10
 * (Umsetzung 29.10.2026, T4-SK-2: Schalter „Leiteinwirkung tauschen“ mit Maximum beider Kombinationen).
 *
 *   E_d = γ_G·G_k + γ_Q·Q_k,1 + γ_Q·ψ₀,₂·Q_k,2      (Q_k,1 Leiteinwirkung)
 *   E_d = γ_G·G_k + γ_Q·Q_k,2 + γ_Q·ψ₀,₁·Q_k,1      (Q_k,2 Leiteinwirkung)
 *
 * Nach DIN EN 1990, 6.4.3.2 ist jede veränderliche Einwirkung einmal als Leiteinwirkung zu untersuchen;
 * maßgebend ist der größere Bemessungswert. Ein gemeinsames γ_G, ein gemeinsames γ_Q.
 * Reiner Rechenkern – geprüft in tests/sicherheitskonzept.test.ts.
 */
import { type Hinweis, istEndlich, muss, hatFehler } from './plausibilitaet';

export interface Kombination610Eingabe {
  gk: number; qk1: number; qk2: number;
  /** ψ₀ der Einwirkung Q_k,1 (wirkt, wenn Q_k,2 Leiteinwirkung ist) */
  psi01: number;
  /** ψ₀ der Einwirkung Q_k,2 (wirkt, wenn Q_k,1 Leiteinwirkung ist) */
  psi02: number;
  gammaG: number; gammaQ: number;
  /** true: Q_k,2 ist Leiteinwirkung */
  getauscht?: boolean;
}

export interface Kombination610 {
  /** Anteile der gewählten Kombination in kN */
  staendig: number; leit: number; begleit: number;
  /** E_d der gewählten Kombination */
  ed: number;
  /** E_d mit Q_k,1 bzw. Q_k,2 als Leiteinwirkung */
  edLeit1: number; edLeit2: number;
  /** Maximum beider Kombinationen und die maßgebende Leiteinwirkung (1 oder 2) */
  edMax: number; massgebend: 1 | 2;
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function kombination610(e: Kombination610Eingabe): Kombination610 {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.gk, e.qk1, e.qk2, e.psi01, e.psi02, e.gammaG, e.gammaQ), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  muss(hinweise, e.gk >= 0 && e.qk1 >= 0 && e.qk2 >= 0, 'einwirkung', 'Einwirkungen dürfen nicht negativ sein (Beträge eingeben).');
  muss(hinweise, e.psi01 >= 0 && e.psi01 <= 1 && e.psi02 >= 0 && e.psi02 <= 1, 'psi0', 'ψ₀ muss zwischen 0 und 1 liegen.');
  muss(hinweise, e.gammaG > 0 && e.gammaQ > 0, 'gamma', 'Teilsicherheitsbeiwerte müssen größer als 0 sein.');
  if (hatFehler(hinweise)) {
    return { staendig: NaN, leit: NaN, begleit: NaN, ed: NaN, edLeit1: NaN, edLeit2: NaN, edMax: NaN, massgebend: 1, gueltig: false, hinweise };
  }
  const staendig = e.gammaG * e.gk;
  const edLeit1 = staendig + e.gammaQ * e.qk1 + e.gammaQ * e.psi02 * e.qk2;
  const edLeit2 = staendig + e.gammaQ * e.qk2 + e.gammaQ * e.psi01 * e.qk1;
  const leit = e.getauscht ? e.gammaQ * e.qk2 : e.gammaQ * e.qk1;
  const begleit = e.getauscht ? e.gammaQ * e.psi01 * e.qk1 : e.gammaQ * e.psi02 * e.qk2;
  const massgebend: 1 | 2 = edLeit2 > edLeit1 + 1e-12 ? 2 : 1;
  const edMax = Math.max(edLeit1, edLeit2);
  const ed = e.getauscht ? edLeit2 : edLeit1;
  if (Math.abs(ed - edMax) > 1e-12) {
    hinweise.push({ feld: 'leit', stufe: 'warnung', text: `Maßgebend ist die andere Kombination (Q_k,${massgebend} als Leiteinwirkung).` });
  }
  return { staendig, leit, begleit, ed, edLeit1, edLeit2, edMax, massgebend, gueltig: true, hinweise };
}
