/**
 * Rechenkern Statistik für Werkstoffprüfungen (Z3), übernommen aus src/modules/Statistik.tsx:
 *  - Normalverteilung: Dichte φ(x), Verteilungsfunktion Φ(x) über erf nach Abramowitz/Stegun 7.1.26 (|Fehler| ≤ 1,5·10⁻⁷)
 *  - Stichprobenkennwerte: Mittelwert x̄, Median, Standardabweichung s = √(Σ(xᵢ − x̄)²/(n − 1)), Variationskoeffizient V = s/x̄·100 %
 *  - Ausreißerkriterien: x̄ ± 2s (Faustregel), Boxplot [Q₁ − 1,5·IQR; Q₃ + 1,5·IQR] (Quartile als sortierter Wert
 *    am Index ⌊0,25·n⌋ bzw. ⌊0,75·n⌋, ohne Interpolation), Grubbs x̄ ± G_krit·s (G_krit für einen Ausreißer,
 *    beidseitig geprüft, α = 5 % nach ISO 5725-2, Tab. 5 – entspricht einseitig α = 2,5 % nach ASTM E178;
 *    linear interpoliert; vereinfacht auf alle Werte angewendet)
 *  - 5-%-Quantil X_k = x̄ − k_n·s mit k_n nach DIN EN 1990, Anhang D, Tab. D1 (V_X unbekannt), Zwischenwerte linear in 1/n;
 *    Bemessungswert X_d = X_k/γ_M (Beton 1,5, Betonstahl 1,15, Holz 1,3)
 *  - t-Test (Z24, unten): t-Verteilung numerisch, Ein- und Zweistichproben-t-Test (Student, Welch), p-Wert, t_krit, Konfidenzintervall
 * Einheiten: wie die Messwerte (z. B. N/mm²); V in %. Reiner Rechenkern – geprüft in tests/statistik.test.ts.
 */
import { type Hinweis, hatFehler, istEndlich, muss } from './plausibilitaet';
import { formatDeZahl } from '../utils/numberFormat';

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

/**
 * Kritische Werte des Grubbs-Tests für einen Ausreißer (größter ODER kleinster Wert), α = 5 % nach ISO 5725-2, Tab. 5
 * („Straggler“-Grenze; die 1-%-Werte, z. B. n = 8: 2,274, kennzeichnen nach ISO 5725-2 Ausreißer). Da das Modul beide Seiten (x̄ ± G_krit·s) prüft,
 * ist die zweiseitige Tabelle maßgebend; sie entspricht einseitig α/2 = 2,5 % (ASTM E178). Korrektur 27.10.2026:
 * vorher einseitige 5-%-Werte (n = 8: 2,032), beidseitig angewendet also effektiv α = 10 %.
 * Werte n = 3…15 öffentlich z. B. Harvey, Analytical Chemistry 2.1, App. 7 (LibreTexts); n = 20…50 aus der exakten Formel
 * G_krit = (n − 1)/√n · √(t²/(n − 2 + t²)), t = t(1 − α/(2n); n − 2) (Grubbs/Beck 1972), geprüft in tests/statistik.test.ts.
 */
export const GRUBBS_TAB: readonly (readonly [number, number])[] = [[3, 1.155], [4, 1.481], [5, 1.715], [6, 1.887], [7, 2.020], [8, 2.126], [9, 2.215], [10, 2.290], [12, 2.412], [15, 2.549], [20, 2.709], [25, 2.822], [30, 2.908], [40, 3.036], [50, 3.128]];

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

/**
 * k_n für n Werte (n < 3 → NaN), Zwischenwerte linear in 1/n. Begründung (Runde 5): Tab. D1 folgt
 * k_n = t_(n−1; 0,95)·√(1 + 1/n) (DIN EN 1990, D7.2, V_X unbekannt); das Student-Quantil ist nahezu linear in 1/n,
 * z. B. n = 7: t₆ = 1,943 → k_n = 2,077 (Interpolation in 1/n: 2,077; in n: 2,090). Geprüft in tests/statistik.test.ts.
 */
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

/* ────────────────────────────────────────────────────────────────────────────────────────────────
 * t-Test (Z24): Einstichproben- und Zweistichproben-t-Test (Student mit gepoolter Varianz bzw. Welch)
 *  - t-Verteilung numerisch über die regularisierte unvollständige Betafunktion I_x(a, b)
 *    (Kettenbruch nach Lentz, ln Γ nach Lanczos, g = 7, 9 Koeffizienten); F(t; ν) = 1 − ½·I_{ν/(ν+t²)}(ν/2; ½) für t ≥ 0
 *  - Quantil t_(p; ν) durch Intervallhalbierung auf F (relativer Fehler < 10⁻¹⁰), geprüft gegen Tabellenwerte
 *  - Einstichprobe: t = (x̄ − μ₀)/(s/√n), ν = n − 1, KI x̄ ± t_(1−α/2; ν)·s/√n
 *  - Student (gleiche Varianzen): s_p² = ((n₁−1)s₁² + (n₂−1)s₂²)/(n₁+n₂−2), t = (x̄₁ − x̄₂)/(s_p·√(1/n₁ + 1/n₂)), ν = n₁+n₂−2
 *  - Welch: t = (x̄₁ − x̄₂)/√(s₁²/n₁ + s₂²/n₂), ν nach Welch-Satterthwaite (nicht ganzzahlig)
 * Quellen: NIST/SEMATECH e-Handbook of Statistical Methods, 1.3.5.3 „Two-Sample t-Test for Equal Means“ und
 * 1.3.6.7.2 „Critical Values of the Student's t Distribution“; Abramowitz/Stegun 26.7 (t-Verteilung).
 * ──────────────────────────────────────────────────────────────────────────────────────────────── */

const LANCZOS = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
  12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];

/** ln Γ(x) für x > 0 (Lanczos-Näherung, relative Genauigkeit ≈ 10⁻¹⁵) */
export function lnGamma(x: number): number {
  if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lnGamma(1 - x);
  const z = x - 1;
  let a = LANCZOS[0];
  const t = z + 7.5;
  for (let i = 1; i < 9; i++) a += LANCZOS[i] / (z + i);
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
}

/** Kettenbruch der unvollständigen Betafunktion (modifizierter Lentz-Algorithmus) */
function betaKettenbruch(x: number, a: number, b: number): number {
  const KLEIN = 1e-300;
  let c = 1, d = 1 - ((a + b) * x) / (a + 1);
  if (Math.abs(d) < KLEIN) d = KLEIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 500; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < KLEIN) d = KLEIN;
    c = 1 + aa / c; if (Math.abs(c) < KLEIN) c = KLEIN;
    d = 1 / d; h *= d * c;
    aa = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1));
    d = 1 + aa * d; if (Math.abs(d) < KLEIN) d = KLEIN;
    c = 1 + aa / c; if (Math.abs(c) < KLEIN) c = KLEIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-15) break;
  }
  return h;
}

/** Regularisierte unvollständige Betafunktion I_x(a, b), 0 ≤ x ≤ 1, a, b > 0 */
export function betaRegularisiert(x: number, a: number, b: number): number {
  if (!(a > 0 && b > 0) || !(x >= 0 && x <= 1)) return NaN;
  if (x === 0 || x === 1) return x;
  const vorfaktor = Math.exp(lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (vorfaktor * betaKettenbruch(x, a, b)) / a : 1 - (vorfaktor * betaKettenbruch(1 - x, b, a)) / b;
}

/** Verteilungsfunktion der Student-t-Verteilung F(t; ν), ν > 0 (auch nicht ganzzahlig, z. B. Welch) */
export function tCDF(t: number, nu: number): number {
  if (!(nu > 0) || Number.isNaN(t)) return NaN;
  if (t === Infinity) return 1;
  if (t === -Infinity) return 0;
  const halb = 0.5 * betaRegularisiert(nu / (nu + t * t), nu / 2, 0.5);
  return t >= 0 ? 1 - halb : halb;
}

/** Dichte der Student-t-Verteilung f(t; ν) */
export function tPDF(t: number, nu: number): number {
  if (!(nu > 0) || !Number.isFinite(t)) return NaN;
  return Math.exp(lnGamma((nu + 1) / 2) - lnGamma(nu / 2) - 0.5 * Math.log(nu * Math.PI) - ((nu + 1) / 2) * Math.log(1 + (t * t) / nu));
}

/** Quantil t_(p; ν) für 0 < p < 1 (Intervallhalbierung) */
export function tQuantil(p: number, nu: number): number {
  if (!(p > 0 && p < 1) || !(nu > 0)) return NaN;
  if (p === 0.5) return 0;
  if (p < 0.5) return -tQuantil(1 - p, nu);
  let lo = 0, hi = 1;
  while (tCDF(hi, nu) < p && hi < 1e12) hi *= 2;
  for (let i = 0; i < 200 && hi - lo > 1e-12 * Math.max(1, hi); i++) {
    const mid = (lo + hi) / 2;
    if (tCDF(mid, nu) < p) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

export type TTestAlternative = 'zweiseitig' | 'groesser' | 'kleiner';
export type TTestVariante = 'student' | 'welch';

/** Kennwerte einer Stichprobe für den t-Test */
export interface TKennwerte { n: number; mittelwert: number; stdAbw: number }

export interface TTestErgebnis {
  /** Prüfgröße t */
  t: number;
  /** Freiheitsgrade ν (Welch: nicht ganzzahlig) */
  nu: number;
  /** p-Wert für die gewählte Alternative */
  p: number;
  /** kritischer Wert: zweiseitig t_(1−α/2; ν), einseitig t_(1−α; ν) */
  tKrit: number;
  /** Differenz der Mittelwerte (Einstichprobe: x̄ − μ₀) */
  differenz: number;
  /** Standardfehler der Differenz bzw. des Mittelwerts */
  standardfehler: number;
  /** Konfidenzintervall zum Niveau 1 − α für μ (Einstichprobe) bzw. μ₁ − μ₂; einseitig mit −∞ bzw. +∞ */
  kiUnten: number;
  kiOben: number;
  /** true: H₀ wird auf dem Niveau α verworfen (p < α, gleichbedeutend mit t jenseits von t_krit in Richtung der Alternative) */
  verworfen: boolean;
  /** Varianzverhältnis s₁²/s₂² (nur Zweistichproben) */
  varianzVerhaeltnis?: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

const leerT = (hinweise: Hinweis[]): TTestErgebnis => ({ t: NaN, nu: NaN, p: NaN, tKrit: NaN, differenz: NaN, standardfehler: NaN, kiUnten: NaN, kiOben: NaN, verworfen: false, gueltig: false, hinweise });

function pruefeAlpha(hinweise: Hinweis[], alpha: number) {
  muss(hinweise, Number.isFinite(alpha) && alpha > 0 && alpha < 0.5, 'alpha', 'Das Signifikanzniveau α muss zwischen 0 und 0,5 liegen.');
  if (Number.isFinite(alpha) && alpha > 0.1 && alpha < 0.5) hinweise.push({ stufe: 'warnung', feld: 'alpha', text: 'α > 10 % ist für Prüfaussagen unüblich (üblich sind 5 % oder 1 %).' });
}

function pruefeKennwerte(hinweise: Hinweis[], k: TKennwerte, feld: string, name: string) {
  muss(hinweise, Number.isInteger(k.n) && k.n >= 2, feld, `${name}: Für den t-Test sind mindestens 2 Werte erforderlich.`);
  muss(hinweise, istEndlich(k.mittelwert, k.stdAbw) && k.stdAbw >= 0, feld, `${name}: Mittelwert und Standardabweichung müssen endliche Zahlen sein, s ≥ 0.`);
}

/** p-Wert, kritischer Wert und Entscheidung aus t und ν */
function auswerten(t: number, nu: number, alpha: number, alt: TTestAlternative) {
  const roh = alt === 'zweiseitig' ? 2 * tCDF(-Math.abs(t), nu) : alt === 'groesser' ? tCDF(-t, nu) : tCDF(t, nu);
  const p = Math.min(1, Math.max(0, roh));
  const tKrit = tQuantil(alt === 'zweiseitig' ? 1 - alpha / 2 : 1 - alpha, nu);
  return { p, tKrit, verworfen: p < alpha };
}

function intervall(mitte: number, se: number, tKrit: number, alt: TTestAlternative) {
  if (alt === 'zweiseitig') return { kiUnten: mitte - tKrit * se, kiOben: mitte + tKrit * se };
  return alt === 'groesser' ? { kiUnten: mitte - tKrit * se, kiOben: Infinity } : { kiUnten: -Infinity, kiOben: mitte + tKrit * se };
}

/** Einstichproben-t-Test aus Kennwerten: H₀ μ = μ₀ (z. B. Prüfung einer Serie gegen einen Sollwert) */
export function einstichprobenTTestKennwerte(k: TKennwerte, mu0: number, alpha: number, alt: TTestAlternative = 'zweiseitig'): TTestErgebnis {
  const hinweise: Hinweis[] = [];
  pruefeKennwerte(hinweise, k, 'werte', 'Stichprobe');
  muss(hinweise, Number.isFinite(mu0), 'mu0', 'Der Sollwert μ₀ muss eine Zahl sein.');
  pruefeAlpha(hinweise, alpha);
  if (!hatFehler(hinweise)) muss(hinweise, k.stdAbw > 0, 'werte', 'Alle Werte sind gleich (s = 0): Die Prüfgröße t ist nicht definiert.');
  if (hatFehler(hinweise)) return leerT(hinweise);
  const nu = k.n - 1;
  const se = k.stdAbw / Math.sqrt(k.n);
  const differenz = k.mittelwert - mu0;
  const t = differenz / se;
  const a = auswerten(t, nu, alpha, alt);
  if (k.n < 5) hinweise.push({ stufe: 'warnung', feld: 'werte', text: 'Weniger als 5 Werte: Die Normalverteilungsannahme lässt sich kaum prüfen, der Test hat geringe Trennschärfe.' });
  return { t, nu, ...a, differenz, standardfehler: se, ...intervall(k.mittelwert, se, a.tKrit, alt), gueltig: true, hinweise };
}

/** Zweistichproben-t-Test aus Kennwerten: H₀ μ₁ = μ₂ (z. B. Vergleich zweier Betonserien) */
export function zweistichprobenTTestKennwerte(k1: TKennwerte, k2: TKennwerte, alpha: number, variante: TTestVariante = 'welch', alt: TTestAlternative = 'zweiseitig'): TTestErgebnis {
  const hinweise: Hinweis[] = [];
  pruefeKennwerte(hinweise, k1, 'serie1', 'Serie 1');
  pruefeKennwerte(hinweise, k2, 'serie2', 'Serie 2');
  pruefeAlpha(hinweise, alpha);
  if (!hatFehler(hinweise)) muss(hinweise, k1.stdAbw > 0 || k2.stdAbw > 0, 'werte', 'Beide Serien ohne Streuung (s = 0): Die Prüfgröße t ist nicht definiert.');
  if (hatFehler(hinweise)) return leerT(hinweise);
  const v1 = k1.stdAbw ** 2 / k1.n, v2 = k2.stdAbw ** 2 / k2.n;
  let se: number, nu: number;
  if (variante === 'student') {
    nu = k1.n + k2.n - 2;
    const sp2 = ((k1.n - 1) * k1.stdAbw ** 2 + (k2.n - 1) * k2.stdAbw ** 2) / nu;
    se = Math.sqrt(sp2 * (1 / k1.n + 1 / k2.n));
  } else {
    se = Math.sqrt(v1 + v2);
    // Welch-Satterthwaite; eine Serie mit s = 0 trägt zum Nenner nichts bei
    nu = (v1 + v2) ** 2 / (v1 ** 2 / (k1.n - 1) + v2 ** 2 / (k2.n - 1));
  }
  const differenz = k1.mittelwert - k2.mittelwert;
  const t = differenz / se;
  const a = auswerten(t, nu, alpha, alt);
  const varianzVerhaeltnis = k2.stdAbw > 0 ? k1.stdAbw ** 2 / k2.stdAbw ** 2 : Infinity;
  const vq = Math.max(varianzVerhaeltnis, 1 / varianzVerhaeltnis);
  if (variante === 'student' && vq > 4) hinweise.push({ stufe: 'warnung', feld: 'variante', text: `Die Varianzen unterscheiden sich um mehr als den Faktor 4 (${Number.isFinite(vq) ? formatDeZahl(vq, 1) : '∞'}): Der Student-Test setzt gleiche Varianzen voraus – Welch-Test verwenden.` });
  else if (variante === 'student' && vq > 2 && k1.n !== k2.n) hinweise.push({ stufe: 'warnung', feld: 'variante', text: 'Ungleiche Stichprobenumfänge und deutlich verschiedene Varianzen: Der Welch-Test ist robuster.' });
  if (k1.n < 5 || k2.n < 5) hinweise.push({ stufe: 'warnung', feld: 'werte', text: 'Eine Serie hat weniger als 5 Werte: geringe Trennschärfe, Normalverteilungsannahme kaum prüfbar.' });
  return { t, nu, ...a, differenz, standardfehler: se, ...intervall(differenz, se, a.tKrit, alt), varianzVerhaeltnis, gueltig: true, hinweise };
}

/** Kennwerte aus Rohwerten (Fehlerhinweis bei nicht endlichen Werten) */
function kennwerteAus(werte: readonly number[], hinweise: Hinweis[], feld: string, name: string): TKennwerte {
  muss(hinweise, werte.every(Number.isFinite), feld, `${name}: Alle Messwerte müssen endliche Zahlen sein.`);
  const s = stichprobe(werte);
  return { n: s.n, mittelwert: s.mittelwert, stdAbw: s.stdAbw };
}

/** Einstichproben-t-Test aus Messwerten */
export function einstichprobenTTest(werte: readonly number[], mu0: number, alpha: number, alt: TTestAlternative = 'zweiseitig'): TTestErgebnis & { kennwerte: TKennwerte } {
  const vorab: Hinweis[] = [];
  const kennwerte = kennwerteAus(werte, vorab, 'werte', 'Stichprobe');
  if (hatFehler(vorab)) return { ...leerT(vorab), kennwerte };
  return { ...einstichprobenTTestKennwerte(kennwerte, mu0, alpha, alt), kennwerte };
}

/** Zweistichproben-t-Test aus Messwerten */
export function zweistichprobenTTest(serie1: readonly number[], serie2: readonly number[], alpha: number, variante: TTestVariante = 'welch', alt: TTestAlternative = 'zweiseitig'): TTestErgebnis & { kennwerte1: TKennwerte; kennwerte2: TKennwerte } {
  const vorab: Hinweis[] = [];
  const kennwerte1 = kennwerteAus(serie1, vorab, 'serie1', 'Serie 1');
  const kennwerte2 = kennwerteAus(serie2, vorab, 'serie2', 'Serie 2');
  if (hatFehler(vorab)) return { ...leerT(vorab), kennwerte1, kennwerte2 };
  return { ...zweistichprobenTTestKennwerte(kennwerte1, kennwerte2, alpha, variante, alt), kennwerte1, kennwerte2 };
}
