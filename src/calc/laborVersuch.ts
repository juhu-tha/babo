// Auswertehilfen der virtuellen Versuche (Modul Labor, src/components/labor/*): reine Funktionen ohne React.
// - hoechstwert: Höchstwert einer Messkurve. Ergebnisse (f_ct,sp, F_max, f_h …) werden aus dem Höchstwert der
//   aufgezeichneten Kurve gebildet, nicht aus dem letzten Messwert – nach dem Bruch fällt die Kraft auf 0 (Befund 28.10.2026).
// - schoeneAchse: glatte Achsengrenze mit „schöner“ Schrittweite (1, 2, 2,5, 5 · 10ⁿ) statt krummer Werte wie 56,3.
// - spaltzugfestigkeit/spaltkraft: f_ct,sp = 2·F/(π·L·d) nach DIN EN 12390-6.
// - ausbreitDurchmesser: zwei Einzelmessungen d1/d2 parallel zu den Tischkanten, deren Mittel das Ausbreitmaß ergibt.
// - ausbreitAuswertung: Ausbreitmaß f = (d1 + d2)/2 nach DIN EN 12350-5 auf 10 mm gerundet; die Konsistenzklasse
//   (DIN EN 206) wird aus dem gerundeten Wert bestimmt (Entscheidung 29.10.2026).
// - ringKugelZustand: Erweichungspunkt Ring und Kugel nach DIN EN 1427 – Wasserbad ab 5 °C Starttemperatur,
//   gleichmäßig mit 5 K/min erwärmt, bis die Kugel die Bodenplatte (25 mm) erreicht (Entscheidung 29.10.2026).

import { ausbreitmass, ausbreitklasse } from './laborversuche';

export interface Messpunkt { x: number; y: number }

export interface Hoechstwert { x: number; y: number; index: number }

/** Höchster y-Wert einer Messreihe (erster bei Gleichstand); leere Reihe → index −1, x = y = 0. Nicht endliche Werte werden übergangen. */
export function hoechstwert(punkte: readonly Messpunkt[]): Hoechstwert {
  let best: Hoechstwert = { x: 0, y: 0, index: -1 };
  punkte.forEach((p, i) => {
    if (!Number.isFinite(p.y) || !Number.isFinite(p.x)) return;
    if (best.index < 0 || p.y > best.y) best = { x: p.x, y: p.y, index: i };
  });
  return best;
}

export interface Achse { max: number; schritt: number }

/**
 * Glatte Achsenobergrenze ≥ maxWert mit Schrittweite aus {1; 2; 2,5; 5}·10ⁿ, sodass etwa `zielTeile` Teilungen entstehen.
 * Nicht positive oder nicht endliche Eingaben → { max: 1, schritt: 0,2 }.
 */
export function schoeneAchse(maxWert: number, zielTeile = 6): Achse {
  if (!Number.isFinite(maxWert) || maxWert <= 0) return { max: 1, schritt: 0.2 };
  const teile = Number.isFinite(zielTeile) && zielTeile >= 1 ? zielTeile : 6;
  const roh = maxWert / teile;
  const groesse = Math.pow(10, Math.floor(Math.log10(roh)));
  const n = roh / groesse;
  const faktor = n <= 1 + 1e-9 ? 1 : n <= 2 + 1e-9 ? 2 : n <= 2.5 + 1e-9 ? 2.5 : n <= 5 + 1e-9 ? 5 : 10;
  const schritt = faktor * groesse;
  // Rundungsrauschen (z. B. 0,30000000000000004) entfernen
  const glatt = (v: number) => Number(v.toPrecision(12));
  const max = glatt(Math.ceil(maxWert / schritt - 1e-9) * schritt);
  return { max, schritt: glatt(schritt) };
}

/** Spaltzugfestigkeit f_ct,sp in N/mm² aus Höchstkraft F in kN, Länge L und Durchmesser d in mm (DIN EN 12390-6) */
export function spaltzugfestigkeit(fKN: number, dMm: number, lMm: number): number {
  if (!(dMm > 0) || !(lMm > 0) || !Number.isFinite(fKN)) return 0;
  return (2 * fKN * 1000) / (Math.PI * lMm * dMm);
}

/** Spaltkraft F in kN zu einer Spaltzugspannung σ in N/mm² (Umkehrung von spaltzugfestigkeit) */
export function spaltkraft(sigma: number, dMm: number, lMm: number): number {
  if (!Number.isFinite(sigma)) return 0;
  return (sigma * Math.PI * dMm * lMm) / 2000;
}

/**
 * Darstellung des Ausbreitmaßes f als zwei Einzelmessungen d1 (parallel zur einen Tischkante) und d2 (rechtwinklig dazu)
 * mit f = (d1 + d2)/2. Der Kuchen ist in der Simulation leicht oval (± 2 %); f selbst bleibt unverändert.
 */
export function ausbreitDurchmesser(f: number): { d1: number; d2: number } {
  if (!Number.isFinite(f) || f <= 0) return { d1: 0, d2: 0 };
  const delta = Math.round(f * 0.02);
  return { d1: f + delta, d2: f - delta };
}

export interface AusbreitAuswertung {
  d1: number;
  d2: number;
  /** ungerundetes Mittel (d1 + d2)/2 in mm */
  fRoh: number;
  /** Ausbreitmaß f in mm, auf 10 mm gerundet (DIN EN 12350-5) */
  f: number;
  /** Ausbreitmaßklasse F1 … F6 nach DIN EN 206 aus dem gerundeten Wert */
  klasse: string;
}

/**
 * Auswertung des simulierten Ausbreitversuchs: Einzelmessungen d1/d2 aus dem Simulationswert, Mittel auf 10 mm gerundet
 * (DIN EN 12350-5), Klasse aus dem gerundeten Ausbreitmaß. Nicht positive Eingaben → alles 0, Klasse „–“.
 */
export function ausbreitAuswertung(fSim: number): AusbreitAuswertung {
  if (!Number.isFinite(fSim) || fSim <= 0) return { d1: 0, d2: 0, fRoh: 0, f: 0, klasse: '–' };
  const { d1, d2 } = ausbreitDurchmesser(fSim);
  const f = ausbreitmass(d1, d2);
  return { d1, d2, fRoh: (d1 + d2) / 2, f, klasse: ausbreitklasse(f) };
}

/** Starttemperatur des Wasserbads beim Ring-und-Kugel-Versuch in °C (DIN EN 1427) */
export const RUK_STARTTEMPERATUR = 5;
/** Aufheizrate des Bads in K/min (DIN EN 1427) */
export const RUK_AUFHEIZRATE = 5;

export interface RingKugelZustand {
  /** Badtemperatur in °C */
  temperatur: number;
  /** Versuchszeit seit Beginn des Aufheizens in min */
  minuten: number;
  /** Gesamtdauer bis zum Erweichungspunkt in min */
  dauer: number;
}

/**
 * Zustand des simulierten Ring-und-Kugel-Versuchs bei Fortschritt `anteil` (0 … 1) bis zum Erweichungspunkt `ep` in °C:
 * T = 5 °C + 5 K/min · t, Dauer (ep − 5 °C)/(5 K/min). Fortschritt außerhalb 0 … 1 wird begrenzt; EP ≤ 5 °C → Dauer 0.
 */
export function ringKugelZustand(anteil: number, ep: number): RingKugelZustand {
  if (!Number.isFinite(ep)) return { temperatur: RUK_STARTTEMPERATUR, minuten: 0, dauer: 0 };
  const a = Number.isFinite(anteil) ? Math.min(1, Math.max(0, anteil)) : 0;
  const dauer = Math.max(0, ep - RUK_STARTTEMPERATUR) / RUK_AUFHEIZRATE;
  const minuten = a * dauer;
  return { temperatur: RUK_STARTTEMPERATUR + RUK_AUFHEIZRATE * minuten, minuten, dauer };
}
