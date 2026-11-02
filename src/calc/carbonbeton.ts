/**
 * Rechenkern Carbonbeton: Biegetragfähigkeit einer Platte mit Textilbewehrung (Umsetzung 29.10.2026, T9-CB-1).
 * Vorher (inline in src/modules/Carbonbeton.tsx) wurde stets angenommen, dass das Textil f_td erreicht; ob der Beton vorher
 * die Grenzdehnung erreicht, war nicht geprüft (Standardfall ε_c = 3,79 ‰, m_Rd 3 % zu hoch).
 *
 * Rechteckiger Spannungsblock (λ = 0,8, η = 1,0, f_cd = α_cc·f_ck/γ_c zentral), Textil linear-elastisch bis f_td = f_tk/γ_tex,
 * Ebenbleiben des Querschnitts, Breite 1 m:
 *  1. Textilversagen angenommen: y = a_tex·f_td/(1000·f_cd), x = y/0,8, ε_tex = f_td/E_tex, ε_c = ε_tex·x/(d − x).
 *  2. Ist ε_c > ε_cu3 = 3,5 ‰, versagt der Beton zuerst: Gleichgewicht a_tex·E_tex·ε_cu3·(d − x)/x = 1000·0,8·x·f_cd
 *     → 800·f_cd·x² + a·E·ε·x − a·E·ε·d = 0; σ_tex = E_tex·ε_cu3·(d − x)/x < f_td.
 *  m_Rd = a_tex·σ_tex·(d − y/2).
 * γ_tex = 1,3 ist eine Lehrannahme (maßgebend DAfStb-Richtlinie „Betonbauteile mit nichtmetallischer Bewehrung“ 2024-01
 * bzw. Zulassung); ε_cu3, λ und η sind für f_ck > 50 N/mm² vereinfacht nicht abgemindert (Hinweis).
 * Reiner Rechenkern – geprüft in tests/carbonbeton.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss, nurGueltig } from './plausibilitaet';
import { fcdBeton, FCD_MODUL } from '../data/kennwerte';

export const GAMMA_TEX_LEHRWERT = 1.3;
export const EPS_CU3 = 3.5e-3;
export const LAMBDA_BLOCK = 0.8;

export interface CarbonbetonEingabe {
  /** Bauteildicke h und Achsabstand c des Textils von der Zugseite in mm */
  h: number; c: number;
  /** Textilquerschnitt in mm²/m */
  aTex: number;
  /** charakteristische Zugfestigkeit des Textils in N/mm² */
  fTk: number;
  /** E-Modul des Textils in GPa */
  eTexGPa: number;
  /** charakteristische Betondruckfestigkeit in N/mm² */
  fCk: number;
  gammaTex?: number;
}

export interface CarbonbetonErgebnis {
  d: number; fTd: number; fCd: number;
  x: number; y: number; z: number;
  /** aufnehmbares Moment in kNm/m */
  mRd: number;
  /** Randdehnung Beton und Textildehnung im Grenzzustand (absolut, nicht ‰) */
  epsC: number; epsTex: number;
  /** Textilspannung im Grenzzustand in N/mm² */
  sigmaTex: number;
  versagen: 'textil' | 'beton';
  /** m_Rd unter der alten Annahme „Textil erreicht f_td“ (zum Vergleich) */
  mRdOhneDehnungskontrolle: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

const leer = (hinweise: Hinweis[]): CarbonbetonErgebnis => nurGueltig(({ d: NaN, fTd: NaN, fCd: NaN, x: NaN, y: NaN, z: NaN, mRd: NaN, epsC: NaN, epsTex: NaN, sigmaTex: NaN, versagen: 'textil', mRdOhneDehnungskontrolle: NaN, gueltig: false, hinweise }));

export function carbonbetonBiegung(e: CarbonbetonEingabe): CarbonbetonErgebnis {
  const h: Hinweis[] = [];
  const gammaTex = e.gammaTex ?? GAMMA_TEX_LEHRWERT;
  muss(h, istEndlich(e.h, e.c, e.aTex, e.fTk, e.eTexGPa, e.fCk, gammaTex), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  muss(h, e.h > 0 && e.c > 0 && e.c < e.h, 'geometrie', 'Es muss 0 < c < h gelten.');
  muss(h, e.aTex > 0 && e.fTk > 0 && e.eTexGPa > 0 && e.fCk > 0 && gammaTex > 0, 'werkstoff', 'Textilquerschnitt, Festigkeiten, E-Modul und γ_tex müssen größer als 0 sein.');
  if (hatFehler(h)) return leer(h);

  const d = e.h - e.c;
  const fTd = e.fTk / gammaTex;
  const fCd = fcdBeton(e.fCk, FCD_MODUL.carbonbeton);
  const E = e.eTexGPa * 1000;
  // 1. Textilversagen
  const yT = (e.aTex * fTd) / (1000 * fCd);
  const xT = yT / LAMBDA_BLOCK;
  const mRdOhne = (e.aTex * fTd * (d - 0.5 * yT)) / 1e6;
  const epsTexT = fTd / E;
  const epsCT = xT < d ? (epsTexT * xT) / (d - xT) : Infinity;

  let x: number, sigmaTex: number, epsC: number, epsTex: number, versagen: 'textil' | 'beton';
  if (epsCT <= EPS_CU3 + 1e-12) {
    x = xT; sigmaTex = fTd; epsC = epsCT; epsTex = epsTexT; versagen = 'textil';
  } else {
    const k = e.aTex * E * EPS_CU3;
    const a = 1000 * LAMBDA_BLOCK * fCd;
    x = (-k + Math.sqrt(k * k + 4 * a * k * d)) / (2 * a);
    epsC = EPS_CU3; epsTex = (EPS_CU3 * (d - x)) / x; sigmaTex = E * epsTex; versagen = 'beton';
    h.push({ stufe: 'warnung', feld: 'versagen', text: `Der Beton erreicht ε_cu3 = 3,5 ‰ vor dem Textilbruch (ε_c wäre ${(epsCT * 1000).toFixed(2).replace('.', ',')} ‰): Gleichgewicht mit σ_tex = E_tex·ε_tex < f_td.` });
  }
  const y = LAMBDA_BLOCK * x;
  const z = d - 0.5 * y;
  const mRd = (e.aTex * sigmaTex * z) / 1e6;
  if (e.fCk > 50) h.push({ stufe: 'warnung', feld: 'fCk', text: 'f_ck > 50 N/mm²: ε_cu3, λ und η nach DIN EN 1992-1-1, Tab. 3.1/3.1.7 wären kleiner; der Kern rechnet vereinfacht mit 3,5 ‰, 0,8 und 1,0.' });
  return nurGueltig({ d, fTd, fCd, x, y, z, mRd, epsC, epsTex, sigmaTex, versagen, mRdOhneDehnungskontrolle: mRdOhne, gueltig: true, hinweise: h });
}
