/**
 * Rechenkern E-Modul (Z3), übernommen aus src/modules/EModul.tsx:
 *  - Beton nach DIN EN 1992-1-1, Tab. 3.1 und 3.1.3(2): E_cm = α_E·22·(f_cm/10)^0,3 [GPa] mit f_cm = f_ck + 8
 *  - Zweiphasenmodell Gesteinskörnung (G) in Zementsteinmatrix (M), Volumenanteile v_G + v_M = 1:
 *      Voigt (Parallelschaltung, obere Schranke)   E = v_G·E_G + v_M·E_M
 *      Reuss (Reihenschaltung, untere Schranke)    E = 1/(v_G/E_G + v_M/E_M)
 *      Hashin-Shtrikman-Schranken mit gleicher Querdehnzahl ν = 0,2 beider Phasen:
 *        K = E/(3(1 − 2ν)), G = E/(2(1 + ν));
 *        K_HS = K₁ + v₂/(1/(K₂ − K₁) + 3v₁/(3K₁ + 4G₁)),
 *        G_HS = G₁ + v₂/(1/(G₂ − G₁) + 6v₁(K₁ + 2G₁)/(5G₁(3K₁ + 4G₁))),  E = 9KG/(3K + G);
 *      die Schranke mit der steiferen Phase als Bezugsphase ist die obere (Vertauschung über min/max).
 * Einheiten: Moduln in GPa, Volumenanteile in %. Reiner Rechenkern – geprüft in tests/emodul.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss, nurGueltig } from './plausibilitaet';

/** E_cm in GPa nach DIN EN 1992-1-1 (f_ck in N/mm²) */
export function ecmEc2(fck: number, alphaE = 1.0): number {
  return alphaE * 22 * Math.pow((fck + 8) / 10, 0.3);
}

export interface Schranken { voigt: number; reuss: number; hsUnten: number; hsOben: number }

/** HS-Schranke mit Phase 1 als Bezugsphase (Matrix) und Phase 2 als Einschluss, E in GPa */
function hsSchranke(e1: number, e2: number, v1: number, v2: number, nu: number): number {
  const k1 = e1 / (3 * (1 - 2 * nu)), g1 = e1 / (2 * (1 + nu));
  const k2 = e2 / (3 * (1 - 2 * nu)), g2 = e2 / (2 * (1 + nu));
  const k = k1 + v2 / (1 / (k2 - k1) + 3 * v1 / (3 * k1 + 4 * g1));
  const g = g1 + v2 / (1 / (g2 - g1) + 6 * v1 * (k1 + 2 * g1) / (5 * g1 * (3 * k1 + 4 * g1)));
  return (9 * k * g) / (3 * k + g);
}

/** Alle vier Schranken für den Gesteinsanteil v_G (0 … 1) */
export function verbundSchranken(eGestein: number, eMatrix: number, vG: number, nu = 0.2): Schranken {
  const vM = 1 - vG;
  const voigt = vG * eGestein + vM * eMatrix;
  const reuss = 1 / (vG / eGestein + vM / eMatrix);
  const hsMatrix = hsSchranke(eMatrix, eGestein, vM, vG, nu);
  const hsGestein = hsSchranke(eGestein, eMatrix, vG, vM, nu);
  return { voigt, reuss, hsUnten: Math.min(hsMatrix, hsGestein), hsOben: Math.max(hsMatrix, hsGestein) };
}

export interface EModulEingabe {
  /** f_ck in N/mm² */
  fck: number;
  alphaE: number;
  /** E-Moduln der Gesteinskörnung und der Matrix in GPa */
  eGestein: number;
  eMatrix: number;
  /** Volumenanteil der Gesteinskörnung in % */
  volGestein: number;
}

export interface EModulErgebnis extends Schranken {
  /** E_cm nach EC2 in GPa */
  ecm: number;
  /** Diagrammreihe v_G = 0, 5, …, 100 % */
  kurve: { vG: number; voigt: number; reuss: number; hsUnten: number; hsOben: number }[];
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function emodul(e: EModulEingabe): EModulErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.fck, e.alphaE, e.eGestein, e.eMatrix, e.volGestein), 'eingabe', 'Alle Eingaben müssen endliche Zahlen sein.');
  muss(hinweise, e.eGestein > 0 && e.eMatrix > 0, 'eGestein', 'Die E-Moduln beider Phasen müssen größer als 0 sein.');
  muss(hinweise, e.volGestein >= 0 && e.volGestein <= 100, 'volGestein', 'Der Gesteinsanteil muss zwischen 0 und 100 % liegen.');
  muss(hinweise, e.fck + 8 > 0, 'fck', 'f_cm = f_ck + 8 muss größer als 0 sein.');
  const ecm = ecmEc2(e.fck, e.alphaE);
  const s = verbundSchranken(e.eGestein, e.eMatrix, e.volGestein / 100);
  const kurve: EModulErgebnis['kurve'] = [];
  for (let v = 0; v <= 100; v += 5) kurve.push({ vG: v, ...verbundSchranken(e.eGestein, e.eMatrix, v / 100) });
  if (e.volGestein < 55 || e.volGestein > 80) hinweise.push({ stufe: 'warnung', feld: 'volGestein', text: 'Übliche Betone enthalten etwa 60 … 75 Vol.-% Gesteinskörnung.' });
  return nurGueltig({ ecm, ...s, kurve, gueltig: !hatFehler(hinweise), hinweise });
}
