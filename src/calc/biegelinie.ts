/**
 * Biegelinie statisch bestimmter Balken (Z24, Modul „Formänderungen“): Einfeldträger und Kragarm unter
 * Einzellast F an der Stelle a und/oder Streckenlast q über die ganze Länge (Superposition), E·I konstant.
 * w positiv nach unten [mm], Neigung w' [mrad = ‰], x vom linken Auflager bzw. von der Einspannung [m].
 *
 * Einfeldträger (b = L − a):
 *   q:  w = q·x·(L³ − 2·L·x² + x³)/(24·EI),  w_max = 5·q·L⁴/(384·EI),  φ_A = q·L³/(24·EI)
 *   F:  x ≤ a: w = F·b·x·(L² − b² − x²)/(6·L·EI);  x ≥ a: w = F·a·(L − x)·(2·L·x − x² − a²)/(6·L·EI)
 *       Feldmitte (a = L/2): w = F·L³/(48·EI)
 * Kragarm (Einspannung bei x = 0):
 *   q:  w = q·x²·(6·L² − 4·L·x + x²)/(24·EI),  w(L) = q·L⁴/(8·EI),  φ(L) = q·L³/(6·EI)
 *   F:  x ≤ a: w = F·x²·(3·a − x)/(6·EI);  x ≥ a: w = F·a²·(3·x − a)/(6·EI);  a = L: w(L) = F·L³/(3·EI)
 * Quellen: Gross/Hauger/Schröder/Wall, Technische Mechanik 2, Kap. 4 (Biegelinie, Tabelle der Grundlastfälle);
 * Schneider Bautabellen für Ingenieure, Abschnitt Baustatik (Durchbiegungen von Einfeldträgern und Kragträgern).
 * E-Moduln aus src/data/kennwerte.ts (DIN EN 1993-1-1, DIN EN 338, DIN EN 14080, DIN EN 1992-1-1 Tab. 3.1).
 * Reiner Rechenkern – geprüft in tests/biegelinie.test.ts.
 */
import { type Hinweis, istEndlich, muss, hatFehler, bereich } from './plausibilitaet';
import { E_BAUSTAHL, HOLZ_EN338, BSH_EN14080, betonNachKlasse } from '../data/kennwerte';
import { WALZPROFILE } from './stahlbau';

export type Lagerung = 'einfeldtraeger' | 'kragarm';

export interface BiegelinieEingabe {
  lagerung: Lagerung;
  /** Stützweite bzw. Kraglänge [m] */
  L: number;
  /** Einzellast [kN] (nach unten positiv) */
  F: number;
  /** Lage der Einzellast vom linken Auflager bzw. von der Einspannung [m] */
  a: number;
  /** Streckenlast über die ganze Länge [kN/m] (nach unten positiv) */
  q: number;
  /** Elastizitätsmodul [N/mm²] */
  E: number;
  /** Flächenträgheitsmoment [cm⁴] */
  I: number;
}

export interface BiegePunkt { x: number; w: number; phi: number }

export interface BiegelinieErgebnis {
  /** Biegesteifigkeit E·I [kN·m²] */
  EI: number;
  verlauf: BiegePunkt[];
  /** betragsgrößte Durchbiegung [mm] und ihre Stelle [m] */
  wMax: number;
  xWMax: number;
  /** Durchbiegung in Feldmitte (Einfeldträger) bzw. am Kragarmende [mm] */
  wKenn: number;
  /** Neigung am linken Ende (Auflager A bzw. Einspannung) und am rechten Ende [mrad] */
  phiA: number;
  phiB: number;
  /** Verhältnis L/w_max [-] (∞ ohne Durchbiegung) */
  lDurchW: number;
  hinweise: Hinweis[];
}

/** E·I [kN·m²] aus E [N/mm²] und I [cm⁴]: 1 N/mm² = 10³ kN/m², 1 cm⁴ = 10⁻⁸ m⁴ */
export const biegesteifigkeit = (E: number, I: number) => E * I * 1e-5;

/** Flächenträgheitsmoment eines Rechteckquerschnitts b × h [mm] in cm⁴: I = b·h³/12 */
export const traegheitRechteck = (b: number, h: number) => (b * h ** 3) / 12 / 1e4;

/** Durchbiegung [m] und Neigung [rad] eines Einfeldträgers unter Streckenlast q [kN/m] */
export function einfeldQ(x: number, L: number, q: number, EI: number): { w: number; phi: number } {
  return { w: (q * x * (L ** 3 - 2 * L * x * x + x ** 3)) / (24 * EI), phi: (q * (L ** 3 - 6 * L * x * x + 4 * x ** 3)) / (24 * EI) };
}

/** Durchbiegung [m] und Neigung [rad] eines Einfeldträgers unter Einzellast F [kN] bei a [m] */
export function einfeldF(x: number, L: number, F: number, a: number, EI: number): { w: number; phi: number } {
  const b = L - a;
  if (x <= a) return { w: (F * b * x * (L * L - b * b - x * x)) / (6 * L * EI), phi: (F * b * (L * L - b * b - 3 * x * x)) / (6 * L * EI) };
  return {
    w: (F * a * (L - x) * (2 * L * x - x * x - a * a)) / (6 * L * EI),
    phi: (F * a * (a * a - 2 * L * x + x * x + 2 * (L - x) ** 2)) / (6 * L * EI),
  };
}

/** Durchbiegung [m] und Neigung [rad] eines Kragarms unter Streckenlast q [kN/m] */
export function kragQ(x: number, L: number, q: number, EI: number): { w: number; phi: number } {
  return { w: (q * x * x * (6 * L * L - 4 * L * x + x * x)) / (24 * EI), phi: (q * (3 * L * L * x - 3 * L * x * x + x ** 3)) / (6 * EI) };
}

/** Durchbiegung [m] und Neigung [rad] eines Kragarms unter Einzellast F [kN] bei a [m] */
export function kragF(x: number, F: number, a: number, EI: number): { w: number; phi: number } {
  if (x <= a) return { w: (F * x * x * (3 * a - x)) / (6 * EI), phi: (F * (2 * a * x - x * x)) / (2 * EI) };
  return { w: (F * a * a * (3 * x - a)) / (6 * EI), phi: (F * a * a) / (2 * EI) };
}

/** w [m] und w' [rad] an der Stelle x (Superposition F + q) */
export function biegungAn(e: BiegelinieEingabe, x: number, EI: number): { w: number; phi: number } {
  let lf: { w: number; phi: number }, lq: { w: number; phi: number };
  if (e.lagerung === 'einfeldtraeger') { lf = einfeldF(x, e.L, e.F, e.a, EI); lq = einfeldQ(x, e.L, e.q, EI); }
  else if (e.lagerung === 'kragarm') { lf = kragF(x, e.F, e.a, EI); lq = kragQ(x, e.L, e.q, EI); }
  // Unbekannte Lagerung: kein stiller Ersatz (früher Kragarm) – NaN; biegelinie() meldet den Fehler über muss()
  else return { w: NaN, phi: NaN };
  return { w: lf.w + lq.w, phi: lf.phi + lq.phi };
}

/** Zulässige Lagerungen des Rechenkerns */
export const LAGERUNGEN: readonly Lagerung[] = ['einfeldtraeger', 'kragarm'];
export const istLagerung = (l: unknown): l is Lagerung => (LAGERUNGEN as readonly unknown[]).includes(l);

const LEER = (hinweise: Hinweis[]): BiegelinieErgebnis => ({ EI: NaN, verlauf: [], wMax: NaN, xWMax: NaN, wKenn: NaN, phiA: NaN, phiB: NaN, lDurchW: NaN, hinweise });

/** Biegelinie mit n Abschnitten (n + 1 Punkte); w_max über die Stützstellen und Nullstelle von w' */
export function biegelinie(e: BiegelinieEingabe, n = 200): BiegelinieErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istLagerung(e.lagerung), 'lagerung', `Unbekannte Lagerung „${String(e.lagerung)}“ – zulässig sind Einfeldträger und Kragarm.`);
  muss(hinweise, istEndlich(e.L, e.F, e.a, e.q, e.E, e.I), 'eingabe', 'Länge, Lasten, E-Modul und Trägheitsmoment müssen Zahlen sein.');
  if (hatFehler(hinweise)) return LEER(hinweise);
  muss(hinweise, e.L > 0, 'L', 'Die Länge muss größer als 0 sein.');
  muss(hinweise, e.E > 0, 'E', 'Der E-Modul muss größer als 0 sein.');
  muss(hinweise, e.I > 0, 'I', 'Das Trägheitsmoment muss größer als 0 sein.');
  muss(hinweise, e.a >= 0 && e.a <= e.L, 'a', 'Die Einzellast muss zwischen den Trägerenden stehen (0 ≤ a ≤ L).');
  if (hatFehler(hinweise)) return LEER(hinweise);

  const EI = biegesteifigkeit(e.E, e.I);
  const schritte = Math.max(20, Math.round(n));
  const verlauf: BiegePunkt[] = [];
  let iMax = 0;
  for (let i = 0; i <= schritte; i++) {
    const x = (e.L * i) / schritte;
    const p = biegungAn(e, x, EI);
    verlauf.push({ x, w: p.w * 1000, phi: p.phi * 1000 });
    if (Math.abs(verlauf[i].w) > Math.abs(verlauf[iMax].w)) iMax = i;
  }
  // Extremum genauer: Nullstelle von w' im Nachbarintervall (Bisektion), sonst Stützstelle (Rand)
  let xWMax = verlauf[iMax].x, wMax = verlauf[iMax].w;
  for (const [l, r] of [[iMax - 1, iMax], [iMax, iMax + 1]]) {
    if (l < 0 || r > schritte) continue;
    let x0 = verlauf[l].x, x1 = verlauf[r].x;
    let f0 = biegungAn(e, x0, EI).phi;
    const f1 = biegungAn(e, x1, EI).phi;
    if (f0 === 0 || f1 === 0 || f0 * f1 > 0) continue;
    for (let k = 0; k < 60; k++) {
      const xm = (x0 + x1) / 2, fm = biegungAn(e, xm, EI).phi;
      if (f0 * fm <= 0) x1 = xm; else { x0 = xm; f0 = fm; }
    }
    const xs = (x0 + x1) / 2, ws = biegungAn(e, xs, EI).w * 1000;
    if (Math.abs(ws) >= Math.abs(wMax)) { wMax = ws; xWMax = xs; }
  }
  const xKenn = e.lagerung === 'einfeldtraeger' ? e.L / 2 : e.L;
  const wKenn = biegungAn(e, xKenn, EI).w * 1000;
  const phiA = biegungAn(e, 0, EI).phi * 1000;
  const phiB = biegungAn(e, e.L, EI).phi * 1000;
  const lDurchW = Math.abs(wMax) > 0 ? (e.L * 1000) / Math.abs(wMax) : Infinity;

  if (e.F === 0 && e.q === 0) hinweise.push({ stufe: 'warnung', feld: 'F', text: 'Keine Last angesetzt – der Träger bleibt gerade.' });
  bereich(hinweise, 'L', e.L, 0.5, 30, 'Länge außerhalb des üblichen Bereichs von Biegeträgern im Hochbau (etwa 0,5–30 m).');
  bereich(hinweise, 'E', e.E, 1000, 250000, 'E-Modul außerhalb des Bereichs üblicher Baustoffe (etwa 1 000–250 000 N/mm²).');
  // Grenze der linearen Theorie: kleine Neigungen (|w'| ≤ 0,1 rad)
  if (Math.max(...verlauf.map(p => Math.abs(p.phi))) > 100) hinweise.push({ stufe: 'warnung', feld: 'I', text: 'Neigung über 0,1 rad: Die lineare Biegetheorie (kleine Verformungen) ist hier nicht mehr zutreffend.' });
  const grenze = e.lagerung === 'einfeldtraeger' ? 300 : 150;
  if (Number.isFinite(lDurchW) && lDurchW < grenze) {
    hinweise.push({ stufe: 'warnung', feld: 'I', text: `Durchbiegung größer als ${e.lagerung === 'einfeldtraeger' ? 'L/300' : 'L/150 (Kragarm)'} – häufig verwendeter Orientierungswert; maßgebend sind die Grenzwerte der Eurocodes und ihrer NA.` });
  }
  return { EI, verlauf, wMax, xWMax, wKenn, phiA, phiB, lDurchW, hinweise };
}

// ---------------------------------------------------------------------------------------------
// Werkstoff- und Querschnittswahl (E-Moduln aus src/data/kennwerte.ts, keine Kopien)
// ---------------------------------------------------------------------------------------------

export type BiegeWerkstoffId = 'stahl' | 'holzC24' | 'bshGL24h' | 'betonC30';

/** Mittlere E-Moduln für den Vergleich [N/mm²]; Beton im ungerissenen Zustand I ohne Kriechen */
export const BIEGE_WERKSTOFFE: Readonly<Record<BiegeWerkstoffId, { name: string; E: number; quelle: string }>> = {
  stahl: { name: 'Baustahl', E: E_BAUSTAHL, quelle: 'DIN EN 1993-1-1, 3.2.6' },
  holzC24: { name: 'Nadelholz C24', E: HOLZ_EN338.C24.E0mean, quelle: 'DIN EN 338, E_0,mean' },
  bshGL24h: { name: 'Brettschichtholz GL24h', E: BSH_EN14080.GL24h.E0mean, quelle: 'DIN EN 14080, E_0,mean' },
  betonC30: { name: 'Beton C30/37 (Zustand I)', E: betonNachKlasse('C30/37')?.Ecm ?? NaN, quelle: 'DIN EN 1992-1-1, Tab. 3.1, E_cm' },
};

/** Walzprofile mit I_y [cm⁴] aus src/calc/stahlbau.ts */
export const BIEGE_PROFILE = WALZPROFILE.map(p => ({ name: p.name, Iy: p.Iy }));

/** Vergleich der Werkstoffe bei gleichem Querschnitt und gleicher Belastung: w_max [mm] und L/w */
export function werkstoffVergleich(e: Omit<BiegelinieEingabe, 'E'>): { id: BiegeWerkstoffId; name: string; E: number; wMax: number; lDurchW: number }[] {
  return (Object.keys(BIEGE_WERKSTOFFE) as BiegeWerkstoffId[]).map(id => {
    const w = BIEGE_WERKSTOFFE[id];
    const r = biegelinie({ ...e, E: w.E }, 100);
    return { id, name: w.name, E: w.E, wMax: r.wMax, lDurchW: r.lDurchW };
  });
}
