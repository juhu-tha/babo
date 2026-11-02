/**
 * Rechenkern Packungsdichte (Umsetzungsplan Phase 4, AP 4.2) – übernommen aus src/modules/Packungsdichte.tsx.
 *  - Feststoffanteile in Vol.-%: Zement, Zusatzstoff, Sand 0/2, Kies 2/8; Kies 8/16 = Rest auf 100 %.
 *    Übersteigt die Summe 100 %, werden die Anteile in dieser Reihenfolge gekappt (Hinweis).
 *  - Massen je m³ Beton: m_i = a_i/100·V_fest·ρ_i mit ρ_Zement = 3,10, ρ_Gestein/Zusatzstoff = 2,65 kg/dm³
 *  - Mischsieblinie aus typischen Siebdurchgängen der Komponenten (Lehrwerte) als volumengewichtetes Mittel
 *  - modifizierte Andreasen-Kurve (Dinger/Funk): P(d) = (d^q − d_min^q)/(D^q − d_min^q)·100 %
 *  - Fuller-Kurve: P(d) = (d/D)^0,5·100 % (Sonderfall q = 0,5, d_min = 0)
 *  - Abweichung als RMSE über die Siebe; geschätzte Packungsdichte 0,65 (rund) bzw. 0,58 (gebrochen)
 *    + max(0; (20 − RMSE_A&A)·0,005), höchstens 0,85 (Lehrmodell)
 *  - Zweikornmischung: ideale Theorie ohne Wechselwirkung (Furnas/Mooney), Grobkorn dominiert γ = φ2/(1 − y1),
 *    Feinkorn dominiert γ = φ1/(φ1·y2 + y1), γ = min(…); lineare Mischung y1·φ1 + y2·φ2; „reales“ Lehrmodell
 *    γ = γ_ideal − i·(γ_ideal − γ_linear)·1,5 − 0,05·y1·y2·(1 − i) mit i = min(1; d1/d2) (Veranschaulichung)
 * Reiner Rechenkern – geprüft in tests/packungsdichte.test.ts. Lehr- und Vorbemessungswerkzeug.
 */
import { type Hinweis, istEndlich, hatFehler, muss, bereich, nurGueltig } from './plausibilitaet';

/** Siebgrößen [mm] einschließlich Feinstbereich */
export const SIEBE = [0.001, 0.01, 0.063, 0.125, 0.25, 0.5, 1, 2, 4, 8, 16] as const;

/** Typische Siebdurchgänge [%] der Komponenten (vereinfacht, Lehrwerte) */
export const DURCHGANG = {
  zement: [0, 50, 95, 100, 100, 100, 100, 100, 100, 100, 100],   // CEM I 42,5
  zusatz: [5, 60, 98, 100, 100, 100, 100, 100, 100, 100, 100],   // Kalksteinmehl
  sand: [0, 0, 2, 5, 15, 40, 75, 100, 100, 100, 100],            // 0/2
  kies1: [0, 0, 0, 0, 0, 0, 0, 5, 40, 100, 100],                 // 2/8
  kies2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 100],                    // 8/16
} as const;

export const RHO_ZEMENT = 3.1, RHO_GESTEIN = 2.65; // kg/dm³

/** Modifizierte Andreasen-Kurve; 0 für d ≤ d_min, 100 für d ≥ D */
export function andreasenModifiziert(d: number, q: number, dMin: number, dMax: number): number {
  if (Number.isNaN(d) || Number.isNaN(q) || Number.isNaN(dMin) || Number.isNaN(dMax)) return NaN; // Grenzfallprüfung 02.11.2026: NaN-Eingabe nicht als Zahl ausgeben
  if (d <= dMin) return 0;
  if (d >= dMax) return 100;
  return ((Math.pow(d, q) - Math.pow(dMin, q)) / (Math.pow(dMax, q) - Math.pow(dMin, q))) * 100;
}

/** Fuller-Kurve (n = 0,5) bzw. Potenzkurve mit Exponent n */
export const fuller = (d: number, dMax: number, n = 0.5) => Math.pow(d / dMax, n) * 100;

/** Wurzel des mittleren quadratischen Abstands zweier gleich langer Reihen */
export function rmse(a: readonly number[], b: readonly number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.pow(a[i] - b[i], 2);
  return Math.sqrt(s / a.length);
}

export type Kornform = 'rund' | 'gebrochen';

/** Lehrmodell: Grundpackung nach Kornform plus Bonus für geringe Abweichung von der A&A-Kurve */
export function packungsdichteSchaetzung(rmseAA: number, kornform: Kornform): number {
  const basis = kornform === 'rund' ? 0.65 : 0.58;
  return Math.min(0.85, basis + Math.max(0, (20 - rmseAA) * 0.005));
}

export interface SieblinienEingabe {
  /** Vol.-% der Feststoffe */
  zement: number; zusatz: number; sand: number; kies1: number;
  q: number; kornform: Kornform;
  /** Feststoffvolumen [l/m³] */
  vFest: number;
  dMax?: number; dMin?: number;
}

export interface SieblinienErgebnis {
  aZement: number; aZusatz: number; aSand: number; aKies1: number; aKies2: number;
  gekappt: boolean;
  mZement: number; mZusatz: number; mSand: number; mKies1: number; mKies2: number; mTotal: number;
  sieblinie: { d: number; gemisch: number; andreasen: number; fuller: number }[];
  rmseAA: number; rmseFuller: number; packungsdichte: number;
  gueltig: boolean; hinweise: Hinweis[];
}

export function sieblinienOptimierung(e: SieblinienEingabe): SieblinienErgebnis {
  const dMax = e.dMax ?? 16, dMin = e.dMin ?? 0.001;
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.zement, e.zusatz, e.sand, e.kies1, e.q, e.vFest, dMax, dMin), 'eingabe', 'Alle Eingaben müssen endliche Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.zement >= 0 && e.zusatz >= 0 && e.sand >= 0 && e.kies1 >= 0, 'anteile', 'Die Volumenanteile müssen ≥ 0 sein.');
    muss(hinweise, e.q > 0, 'q', 'Der Verteilungsmodul q muss größer als 0 sein.');
    muss(hinweise, e.vFest > 0 && e.vFest <= 1000, 'vFest', 'Das Feststoffvolumen muss zwischen 0 und 1000 l/m³ liegen.');
    muss(hinweise, dMin >= 0 && dMax > dMin, 'dMax', 'Es muss 0 ≤ d_min < D_max gelten.');
  }
  const leer: SieblinienErgebnis = { aZement: 0, aZusatz: 0, aSand: 0, aKies1: 0, aKies2: 0, gekappt: false, mZement: 0, mZusatz: 0, mSand: 0, mKies1: 0, mKies2: 0, mTotal: 0, sieblinie: [], rmseAA: 0, rmseFuller: 0, packungsdichte: 0, gueltig: false, hinweise };
  if (hatFehler(hinweise)) return nurGueltig(leer);

  let aZement = e.zement, aZusatz = e.zusatz, aSand = e.sand, aKies1 = e.kies1;
  if (aZement > 100) aZement = 100;
  if (aZement + aZusatz > 100) aZusatz = 100 - aZement;
  if (aZement + aZusatz + aSand > 100) aSand = 100 - aZement - aZusatz;
  if (aZement + aZusatz + aSand + aKies1 > 100) aKies1 = 100 - aZement - aZusatz - aSand;
  const aKies2 = 100 - aZement - aZusatz - aSand - aKies1;
  const gekappt = aZement !== e.zement || aZusatz !== e.zusatz || aSand !== e.sand || aKies1 !== e.kies1;
  if (gekappt) hinweise.push({ stufe: 'warnung', feld: 'anteile', text: 'Die Summe der Anteile übersteigt 100 %: Die zuletzt genannten Komponenten wurden gekürzt, Kies 8/16 entfällt.' });

  const m = (a: number, rho: number) => (a / 100) * e.vFest * rho;
  const mZement = m(aZement, RHO_ZEMENT), mZusatz = m(aZusatz, RHO_GESTEIN), mSand = m(aSand, RHO_GESTEIN);
  const mKies1 = m(aKies1, RHO_GESTEIN), mKies2 = m(aKies2, RHO_GESTEIN);

  const gemisch = SIEBE.map((_, i) => (aZement * DURCHGANG.zement[i] + aZusatz * DURCHGANG.zusatz[i] + aSand * DURCHGANG.sand[i] + aKies1 * DURCHGANG.kies1[i] + aKies2 * DURCHGANG.kies2[i]) / 100);
  const aa = SIEBE.map(d => andreasenModifiziert(d, e.q, dMin, dMax));
  const fu = SIEBE.map(d => fuller(d, dMax));
  const rmseAA = rmse(gemisch, aa), rmseFuller = rmse(gemisch, fu);

  bereich(hinweise, 'q', e.q, 0.2, 0.5, 'Übliche Verteilungsmoduln liegen bei q = 0,20 … 0,50 (UHPC etwa 0,23 … 0,28).');
  bereich(hinweise, 'vFest', e.vFest, 600, 850, 'Übliche Betone enthalten etwa 600 … 850 l Feststoff je m³.');
  return nurGueltig({
    aZement, aZusatz, aSand, aKies1, aKies2, gekappt,
    mZement, mZusatz, mSand, mKies1, mKies2, mTotal: mZement + mZusatz + mSand + mKies1 + mKies2,
    sieblinie: SIEBE.map((d, i) => ({ d, gemisch: gemisch[i], andreasen: aa[i], fuller: fu[i] })),
    rmseAA, rmseFuller, packungsdichte: packungsdichteSchaetzung(rmseAA, e.kornform),
    gueltig: true, hinweise,
  });
}

// ---------------------------------------------------------------------------------------------
// Zweikornmischung
// ---------------------------------------------------------------------------------------------

/** Ideale Packung ohne Wechselwirkung (Größenverhältnis → 0) für den Feinkornanteil y1 (0 … 1) */
export function furnasIdeal(y1: number, phi1: number, phi2: number): number {
  const y2 = 1 - y1;
  return Math.min(phi2 / (1 - y1), phi1 / (phi1 * y2 + y1));
}

/** Größtwert der idealen Packung: γ_max = φ2 + (1 − φ2)·φ1 bei y1 = (1 − φ2)·φ1/γ_max */
export function furnasMaximum(phi1: number, phi2: number): { y1: number; gamma: number } {
  const gamma = phi2 + (1 - phi2) * phi1;
  return { y1: ((1 - phi2) * phi1) / gamma, gamma };
}

export interface ZweikornEingabe { d1: number; d2: number; phi1: number; phi2: number }
export interface ZweikornErgebnis {
  verhaeltnis: number; interaktion: number;
  /** Feinkornanteil x = 0 … 100 Vol.-% in Schritten von 2; Packungsdichten in % */
  punkte: { x: number; ideal: number; real: number; linear: number }[];
  maximum: { y1: number; gamma: number };
  gueltig: boolean; hinweise: Hinweis[];
}

export function zweikornMischung(e: ZweikornEingabe): ZweikornErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.d1, e.d2, e.phi1, e.phi2), 'eingabe', 'Alle Eingaben müssen endliche Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.d1 > 0 && e.d2 > 0, 'd', 'Die Korndurchmesser müssen größer als 0 sein.');
    muss(hinweise, e.phi1 > 0 && e.phi1 < 1 && e.phi2 > 0 && e.phi2 < 1, 'phi', 'Die Eigenpackungsdichten müssen zwischen 0 und 1 liegen.');
  }
  if (hatFehler(hinweise)) return nurGueltig({ verhaeltnis: 0, interaktion: 0, punkte: [], maximum: { y1: 0, gamma: 0 }, gueltig: false, hinweise });
  const verhaeltnis = e.d1 / e.d2;
  const interaktion = Math.min(1, Math.max(0, verhaeltnis));
  const punkte: ZweikornErgebnis['punkte'] = [];
  for (let x = 0; x <= 100; x += 2) {
    const y1 = x / 100, y2 = 1 - y1;
    const ideal = furnasIdeal(y1, e.phi1, e.phi2);
    const linear = y1 * e.phi1 + y2 * e.phi2;
    const real = ideal - interaktion * (ideal - linear) * 1.5 - 0.05 * y1 * y2 * (1 - interaktion);
    punkte.push({ x, ideal: ideal * 100, real: real * 100, linear: linear * 100 });
  }
  if (verhaeltnis >= 1) hinweise.push({ stufe: 'warnung', feld: 'd1', text: 'Das Feinkorn ist nicht kleiner als das Grobkorn: Die Fraktionen sind zu tauschen.' });
  return nurGueltig({ verhaeltnis, interaktion, punkte, maximum: furnasMaximum(e.phi1, e.phi2), gueltig: true, hinweise });
}
