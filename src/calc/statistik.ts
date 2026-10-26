/**
 * Rechenkern Statistik für Werkstoffprüfungen (Z3), übernommen aus src/modules/Statistik.tsx:
 *  - Normalverteilung: Dichte φ(x), Verteilungsfunktion Φ(x) über erf nach Abramowitz/Stegun 7.1.26 (|Fehler| ≤ 1,5·10⁻⁷)
 *  - Stichprobenkennwerte: Mittelwert x̄, Median, Standardabweichung s = √(Σ(xᵢ − x̄)²/(n − 1)), Variationskoeffizient V = s/x̄·100 %
 *  - Ausreißerkriterien: x̄ ± 2s (Faustregel), Boxplot [Q₁ − 1,5·IQR; Q₃ + 1,5·IQR] (Quartile als sortierter Wert
 *    am Index ⌊0,25·n⌋ bzw. ⌊0,75·n⌋, ohne Interpolation), Grubbs x̄ ± G_krit·s (G_krit einseitig α = 5 % nach
 *    ASTM E178, linear interpoliert; vereinfacht auf alle Werte angewendet)
 *  - 5-%-Quantil X_k = x̄ − k_n·s mit k_n nach DIN EN 1990, Anhang D, Tab. D1 (V_X unbekannt), Zwischenwerte linear in 1/n;
 *    Bemessungswert X_d = X_k/γ_M (Beton 1,5, Betonstahl 1,15, Holz 1,3)
 * Einheiten: wie die Messwerte (z. B. N/mm²); V in %. Reiner Rechenkern – geprüft in tests/statistik.test.ts.
 */
import { type Hinweis, hatFehler } from './plausibilitaet';

export type StatistikMaterial = 'beton' | 'stahl' | 'holz';
export type AusreisserMethode = '2sigma' | 'grubbs' | 'boxplot';

/** Fehlerfunktion nach Abramowitz/Stegun 7.1.26 */
export function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return sign * y;
}

/** Verteilungsfunktion der Normalverteilung (σ ≤ 0: Sprungfunktion wie im Modul) */
export function normalCDF(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) return x < mean ? 0 : 1;
  return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
}

/** Dichte der Normalverteilung (σ ≤ 0: 1 an der Stelle x = μ, sonst 0 – Darstellungskonvention des Moduls) */
export function normalPDF(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) return x === mean ? 1 : 0;
  const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
  return Math.exp(exponent) / (stdDev * Math.sqrt(2 * Math.PI));
}

export interface Stichprobe {
  n: number;
  sortiert: number[];
  mittelwert: number;
  median: number;
  /** Stichproben-Standardabweichung (Nenner n − 1); 0 für n = 1 */
  stdAbw: number;
  /** Variationskoeffizient in % (0, wenn x̄ ≤ 0) */
  vk: number;
}

/** Kennwerte einer Stichprobe; leere Liste → n = 0 und NaN-Kennwerte. */
export function stichprobe(werte: readonly number[]): Stichprobe {
  const n = werte.length;
  const sortiert = [...werte].sort((a, b) => a - b);
  if (n === 0) return { n, sortiert, mittelwert: NaN, median: NaN, stdAbw: NaN, vk: NaN };
  const median = n % 2 === 0 ? (sortiert[n / 2 - 1] + sortiert[n / 2]) / 2 : sortiert[Math.floor(n / 2)];
  const mittelwert = werte.reduce((a, b) => a + b, 0) / n;
  const varianz = n > 1 ? werte.reduce((a, b) => a + Math.pow(b - mittelwert, 2), 0) / (n - 1) : 0;
  const stdAbw = Math.sqrt(varianz);
  const vk = mittelwert > 0 ? (stdAbw / mittelwert) * 100 : 0;
  return { n, sortiert, mittelwert, median, stdAbw, vk };
}

/** Kritische Werte des Grubbs-Tests, einseitig α = 5 % (ASTM E178, ISO 5725-2) */
export const GRUBBS_TAB: readonly (readonly [number, number])[] = [[3, 1.153], [4, 1.463], [5, 1.672], [6, 1.822], [7, 1.938], [8, 2.032], [9, 2.110], [10, 2.176], [12, 2.285], [15, 2.409], [20, 2.557], [25, 2.663], [30, 2.745], [40, 2.866], [50, 2.956]];

/** G_krit für n Werte; n < 3 → Wert für 3, n > 50 → Wert für 50, dazwischen linear in n. */
export function grubbsKritisch(n: number): number {
  let gCrit = GRUBBS_TAB[GRUBBS_TAB.length - 1][1];
  if (n <= GRUBBS_TAB[0][0]) gCrit = GRUBBS_TAB[0][1];
  for (let i = 0; i < GRUBBS_TAB.length - 1; i++) {
    const [n0, g0] = GRUBBS_TAB[i];
    const [n1, g1] = GRUBBS_TAB[i + 1];
    if (n >= n0 && n <= n1) { gCrit = g0 + (g1 - g0) * (n - n0) / (n1 - n0); break; }
  }
  return gCrit;
}

/** Fraktilfaktor k_n für das 5-%-Quantil, V_X unbekannt, DIN EN 1990 Tab. D1 */
export const KN_TAB: readonly (readonly [number, number])[] = [[3, 3.37], [4, 2.63], [5, 2.33], [6, 2.18], [8, 2.00], [10, 1.92], [20, 1.76], [30, 1.73], [Infinity, 1.64]];

/** k_n für n Werte (n < 3 → NaN), Zwischenwerte linear in 1/n. */
export function fraktilfaktorKn(n: number): number {
  if (!(n >= 3)) return NaN;
  const inv = (x: number) => (Number.isFinite(x) ? 1 / x : 0);
  for (let i = 0; i < KN_TAB.length - 1; i++) {
    const [n0, k0] = KN_TAB[i];
    const [n1, k1] = KN_TAB[i + 1];
    if (n >= n0 && n <= n1) return n1 === n0 ? k0 : k0 + (k1 - k0) * (inv(n0) - inv(n)) / (inv(n0) - inv(n1));
  }
  return NaN;
}

/** Teilsicherheitsbeiwerte γ_M des Moduls */
export const GAMMA_M: Readonly<Record<StatistikMaterial, number>> = { beton: 1.5, stahl: 1.15, holz: 1.3 };

export interface AusreisserGrenzen { unten: number; oben: number; gKrit?: number }

/** Grenzen des gewählten Ausreißerkriteriums aus der vollständigen Stichprobe */
export function ausreisserGrenzen(p: Stichprobe, methode: AusreisserMethode): AusreisserGrenzen {
  const { n, sortiert, mittelwert, stdAbw } = p;
  if (methode === '2sigma') return { unten: mittelwert - 2 * stdAbw, oben: mittelwert + 2 * stdAbw };
  if (methode === 'boxplot') {
    const q1 = sortiert[Math.floor(n * 0.25)];
    const q3 = sortiert[Math.floor(n * 0.75)];
    const iqr = q3 - q1;
    return { unten: q1 - 1.5 * iqr, oben: q3 + 1.5 * iqr };
  }
  const gKrit = grubbsKritisch(n);
  return { unten: mittelwert - gKrit * stdAbw, oben: mittelwert + gKrit * stdAbw, gKrit };
}

export interface StatistikEingabe {
  werte: readonly number[];
  methode: AusreisserMethode;
  material: StatistikMaterial;
  /** false: noch keine Ausreißerprüfung (Modul: Prüfserie läuft noch) */
  ausreisserPruefen: boolean;
}

export interface StatistikErgebnis {
  roh: Stichprobe;
  /** Ausreißergrenzen (0/0 ohne Prüfung, wie im Modul) */
  untereGrenze: number;
  obereGrenze: number;
  gKrit?: number;
  bereinigt: number[];
  ausreisser: number[];
  sauber: Stichprobe;
  /** Fraktilfaktor k_n (NaN bei weniger als 3 bereinigten Werten) */
  kn: number;
  /** charakteristischer Wert X_k (5-%-Quantil) und Bemessungswert X_d, Einheit der Messwerte */
  xk: number;
  xd: number;
  gammaM: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function statistikAuswertung(e: StatistikEingabe): StatistikErgebnis {
  const hinweise: Hinweis[] = [];
  if (e.werte.length === 0) hinweise.push({ stufe: 'fehler', feld: 'werte', text: 'Keine Messwerte vorhanden.' });
  if (!e.werte.every(Number.isFinite)) hinweise.push({ stufe: 'fehler', feld: 'werte', text: 'Alle Messwerte müssen endliche Zahlen sein.' });
  const roh = stichprobe(e.werte);
  let untereGrenze = 0, obereGrenze = 0, gKrit: number | undefined;
  let istAusreisser = (_v: number) => false;
  if (e.ausreisserPruefen && roh.n > 0) {
    const g = ausreisserGrenzen(roh, e.methode);
    untereGrenze = g.unten; obereGrenze = g.oben; gKrit = g.gKrit;
    istAusreisser = v => v < g.unten || v > g.oben;
  }
  const bereinigt = e.werte.filter(v => !istAusreisser(v));
  const ausreisser = e.werte.filter(v => istAusreisser(v));
  const sauberRoh = stichprobe(bereinigt);
  // Modul: Mittelwert 0 bei leerer bereinigter Liste
  const sauber: Stichprobe = sauberRoh.n === 0 ? { ...sauberRoh, mittelwert: 0, stdAbw: 0, vk: 0 } : sauberRoh;
  const kn = fraktilfaktorKn(sauber.n);
  const xk = sauber.mittelwert - kn * sauber.stdAbw;
  const gammaM = GAMMA_M[e.material];
  const xd = xk / gammaM;

  if (roh.n > 0 && roh.n < 3) hinweise.push({ stufe: 'warnung', feld: 'werte', text: 'Weniger als 3 Werte: Ausreißertests und k_n nach DIN EN 1990 Tab. D1 sind nicht anwendbar.' });
  if (sauber.n > 0 && sauber.n < 3) hinweise.push({ stufe: 'warnung', feld: 'kn', text: 'Weniger als 3 bereinigte Werte: kein 5-%-Quantil.' });
  if (e.ausreisserPruefen && e.methode === 'grubbs' && roh.n > 50) hinweise.push({ stufe: 'warnung', feld: 'methode', text: 'n > 50: G_krit wird mit dem Tabellenwert für n = 50 angesetzt.' });
  if (e.ausreisserPruefen && e.methode === 'grubbs') hinweise.push({ stufe: 'warnung', feld: 'methode', text: 'Vereinfachter Grubbs-Test: Alle Werte werden gegen G_krit geprüft; der strenge Test prüft iterativ nur den Extremwert.' });
  if (e.ausreisserPruefen && ausreisser.length > 0 && ausreisser.length >= e.werte.length / 2) hinweise.push({ stufe: 'warnung', feld: 'werte', text: 'Mindestens die Hälfte der Werte gilt als Ausreißer – Stichprobe prüfen.' });

  return { roh, untereGrenze, obereGrenze, gKrit, bereinigt, ausreisser, sauber, kn, xk, xd, gammaM, gueltig: !hatFehler(hinweise), hinweise };
}
