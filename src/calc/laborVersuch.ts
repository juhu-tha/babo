// Auswertehilfen der virtuellen Versuche (Modul Labor, src/components/labor/*): reine Funktionen ohne React.
// - hoechstwert: Höchstwert einer Messkurve. Ergebnisse (f_ct,sp, F_max, f_h …) werden aus dem Höchstwert der
//   aufgezeichneten Kurve gebildet, nicht aus dem letzten Messwert – nach dem Bruch fällt die Kraft auf 0 (Befund 28.10.2026).
// - schoeneAchse: glatte Achsengrenze mit „schöner“ Schrittweite (1, 2, 2,5, 5 · 10ⁿ) statt krummer Werte wie 56,3.
// - spaltzugfestigkeit/spaltkraft: f_ct,sp = 2·F/(π·L·d) nach DIN EN 12390-6.
// - ausbreitDurchmesser: zwei Einzelmessungen d1/d2 parallel zu den Tischkanten, deren Mittel das Ausbreitmaß ergibt.

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
