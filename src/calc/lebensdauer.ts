/**
 * Rechenkern probabilistische Lebensdauerbemessung von Stahlbetonbauteilen (Grenzzustand Depassivierung).
 *
 * Modelle nach fib Bulletin 34 „Model Code for Service Life Design“ (2006), aufbauend auf Gehlen (DAfStb-Heft 510, 2000);
 * Parameter und Verteilungen aus öffentlich zugänglichen Wiedergaben (Quellen je Konstante, Liste im Modul):
 *
 * 1. Karbonatisierung (fib 34, Gl. B1.2-1):
 *      x_c(t) = √(2 · k_e · k_c · (k_t · R⁻¹_ACC,0 + ε_t) · C_S) · √t · W(t)                  [mm]
 *      k_e = ((1 − (RH_real/100)^f_e) / (1 − (RH_ref/100)^f_e))^g_e,  RH_ref = 65 %, f_e = 5,0, g_e = 2,5
 *      k_c = (t_c/7)^b_c,  W(t) = (t₀/t)^w,  w = (p_SR · ToW)^b_w / 2,  t₀ = 0,0767 a
 * 2. Chlorid (fib 34, Gl. B2.1-1 bis -4):
 *      C(x = a, t) = C₀ + (C_S,Δx − C₀) · [1 − erf((a − Δx) / (2 · √(D_app,C · t)))]
 *      D_app,C = k_e · D_RCM,0 · k_t · A(t),  k_e = exp(b_e · (1/T_ref − 1/T_real)),  A(t) = (t₀/t)^a
 * 3. Grenzzustand Depassivierung (SLS): g = a − x_c(t) bzw. g = C_crit − C(a, t);
 *      p_f(t) = P(g < 0) per Monte-Carlo-Simulation mit festem Startwert (reproduzierbar), β = −Φ⁻¹(p_f).
 *    Zielwert nach fib 34: β = 1,3 (p_f ≈ 10 %).
 *
 * Lehr- und Vorbemessungswerkzeug – kein Ersatz für einen Nachweis nach den bauaufsichtlich eingeführten Regeln.
 * Reiner Rechenkern ohne React – geprüft in tests/lebensdauer.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, nurGueltig } from './plausibilitaet';

// ------------------------------------------------------------------ Konstanten

/** Sekunden je Jahr (365 d, wie die Umrechnung von ε_t = 1,0·10⁻¹¹ m²/s/(kg/m³) ≈ 315,5 mm²/a/(kg/m³)) */
export const SEKUNDEN_JE_JAHR = 365 * 24 * 3600;
/** 1 · 10⁻¹¹ (m²/s)/(kg/m³) in (mm²/a)/(kg/m³) = 315,36 */
export const R_EINHEIT_MM2_A = 1e-11 * 1e6 * SEKUNDEN_JE_JAHR;
/** 1 · 10⁻¹² m²/s in mm²/a = 31,536 */
export const D_EINHEIT_MM2_A = 1e-12 * 1e6 * SEKUNDEN_JE_JAHR;
/** Referenzalter t₀ = 28 d = 0,0767 a (fib 34; Shojaeian et al. 2016, Prabowo/Hilmy 2018) */
export const T0_JAHRE = 0.0767;
/** Feuchtefunktion k_e: RH_ref = 65 %, f_e = 5,0, g_e = 2,5 (fib 34; Prabowo/Hilmy 2018, Carević/Ignjatović 2022) */
export const KE_FEUCHTE = { rhRef: 65, fe: 5.0, ge: 2.5 } as const;
/** Referenztemperatur T_ref = 293 K (fib 34, Wiedergabe rational-rc) */
export const T_REF_K = 293;
/** Prüfkonstante τ = 420 (s/(kg/m³))^0,5 des ACC-Tests (2 Vol.-% CO₂, 28 d; Carević/Ignjatović 2019) */
export const TAU_ACC = 420;
/** Zielzuverlässigkeit Depassivierung nach fib 34: β = 1,3 (Papworth et al. 2025, Carević/Ignjatović 2022) */
export const BETA_ZIEL_FIB = 1.3;
/** Dichte von CO₂ bei 20 °C und 1 013 hPa in kg/m³ (Näherung für die Umrechnung aus DIN EN 12390-12) */
export const RHO_CO2 = 1.84;

// ------------------------------------------------------------------ Zufallszahlen und Verteilungen

/** Gleichverteilte Zufallszahlen in (0, 1) mit festem Startwert (mulberry32) */
export type Zufall = () => number;

export function zufallsgenerator(startwert: number): Zufall {
  let s = (Math.floor(startwert) >>> 0) || 0x9e3779b9;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const r = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    return r > 0 ? r : 1 / 8589934592;
  };
}

/** Standardnormalverteilte Zufallszahl (Box-Muller) */
export function standardNormal(u: Zufall): number {
  return Math.sqrt(-2 * Math.log(u())) * Math.cos(2 * Math.PI * u());
}

/** Gammaverteilte Zufallszahl mit Formparameter k > 0, Skala 1 (Marsaglia/Tsang 2000) */
export function gammaZufall(u: Zufall, k: number): number {
  if (k < 1) return gammaZufall(u, k + 1) * Math.pow(u(), 1 / k);
  const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x: number, v: number;
    do { x = standardNormal(u); v = 1 + c * x; } while (v <= 0);
    v = v * v * v;
    const w = u();
    if (w < 1 - 0.0331 * x ** 4 || Math.log(w) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

/** Verteilung einer Basisvariablen (m = Mittelwert, s = Standardabweichung; Beta mit Grenzen a, b) */
export type Verteilung =
  | { typ: 'konstant'; m: number }
  | { typ: 'normal'; m: number; s: number }
  | { typ: 'lognormal'; m: number; s: number }
  | { typ: 'beta'; m: number; s: number; a: number; b: number };

/** Formparameter α, β der Betaverteilung auf [a, b] aus Mittelwert und Standardabweichung; null, wenn unmöglich */
export function betaFormparameter(m: number, s: number, a: number, b: number): { alpha: number; beta: number } | null {
  if (!istEndlich(m, s, a, b) || b <= a || s <= 0) return null;
  const mu = (m - a) / (b - a), sig = s / (b - a);
  if (mu <= 0 || mu >= 1 || sig * sig >= mu * (1 - mu)) return null;
  const k = mu * (1 - mu) / (sig * sig) - 1;
  return { alpha: mu * k, beta: (1 - mu) * k };
}

/** Parameter der Lognormalverteilung (λ, ζ) aus Mittelwert und Standardabweichung */
export function lognormalParameter(m: number, s: number): { lambda: number; zeta: number } {
  const zeta = Math.sqrt(Math.log(1 + (s / m) ** 2));
  return { lambda: Math.log(m) - zeta * zeta / 2, zeta };
}

/** Prüft eine Verteilung; Fehlertexte mit Feldname */
export function pruefeVerteilung(h: Hinweis[], v: Verteilung, feld: string, name: string, positiv = false): void {
  const werte = v.typ === 'konstant' ? [v.m] : v.typ === 'beta' ? [v.m, v.s, v.a, v.b] : [v.m, v.s];
  if (!istEndlich(...werte)) { h.push({ stufe: 'fehler', feld, text: `${name}: Eingabe fehlt oder ist keine Zahl.` }); return; }
  if (v.typ !== 'konstant' && v.s < 0) h.push({ stufe: 'fehler', feld, text: `${name}: Die Standardabweichung muss ≥ 0 sein.` });
  if (positiv && v.m <= 0) h.push({ stufe: 'fehler', feld, text: `${name}: Der Mittelwert muss größer als 0 sein.` });
  if (v.typ === 'lognormal' && v.m <= 0) h.push({ stufe: 'fehler', feld, text: `${name}: Die Lognormalverteilung braucht einen Mittelwert > 0.` });
  if (v.typ === 'beta' && v.s > 0 && !betaFormparameter(v.m, v.s, v.a, v.b)) {
    h.push({ stufe: 'fehler', feld, text: `${name}: Mittelwert und Streuung passen nicht zu einer Betaverteilung auf [${v.a}; ${v.b}].` });
  }
}

/** Zieht eine Realisierung (Standardabweichung 0 → Mittelwert) */
export function ziehe(v: Verteilung, u: Zufall): number {
  if (v.typ === 'konstant' || v.s === 0) return v.m;
  if (v.typ === 'normal') return v.m + v.s * standardNormal(u);
  if (v.typ === 'lognormal') {
    const p = lognormalParameter(v.m, v.s);
    return Math.exp(p.lambda + p.zeta * standardNormal(u));
  }
  const p = betaFormparameter(v.m, v.s, v.a, v.b);
  if (!p) return NaN;
  const x = gammaZufall(u, p.alpha), y = gammaZufall(u, p.beta);
  return v.a + (v.b - v.a) * x / (x + y);
}

// ------------------------------------------------------------------ Fehlerfunktion und Normalverteilung

/** komplementäre Fehlerfunktion (Tschebyschow-Näherung, relativer Fehler < 1,2 · 10⁻⁷; Press et al., Numerical Recipes) */
export function erfc(x: number): number {
  const z = Math.abs(x);
  const t = 1 / (1 + 0.5 * z);
  const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806
    + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
  return x >= 0 ? r : 2 - r;
}

export const erf = (x: number) => 1 - erfc(x);

/** Verteilungsfunktion Φ(z) der Standardnormalverteilung */
export const phi = (z: number) => 0.5 * erfc(-z / Math.SQRT2);

/** Quantil Φ⁻¹(p) der Standardnormalverteilung (Acklam, relativer Fehler < 1,2 · 10⁻⁹) */
export function phiInvers(p: number): number {
  if (!(p > 0 && p < 1)) return p === 0 ? -Infinity : p === 1 ? Infinity : NaN;
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.3577518672690, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  if (p < pl) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > 1 - pl) return -phiInvers(1 - p);
  const q = p - 0.5, r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

/** Zuverlässigkeitsindex β = −Φ⁻¹(p_f) */
export const betaAusPf = (pf: number) => -phiInvers(pf);
/** Versagenswahrscheinlichkeit p_f = Φ(−β) */
export const pfAusBeta = (beta: number) => phi(-beta);
/** inverse Fehlerfunktion über Φ⁻¹ */
export const erfInvers = (y: number) => phiInvers((y + 1) / 2) / Math.SQRT2;

// ------------------------------------------------------------------ Karbonatisierung (fib 34, B1.2)

/** Feuchtefunktion k_e (RH in %) */
export function keFeuchte(rh: number, k = KE_FEUCHTE): number {
  const r = Math.min(Math.max(rh, 0), 100) / 100;
  return ((1 - r ** k.fe) / (1 - (k.rhRef / 100) ** k.fe)) ** k.ge;
}

/** Ausführungsfunktion k_c = (t_c/7)^b_c (t_c Nachbehandlungsdauer in d) */
export const kcNachbehandlung = (tc: number, bc: number) => Math.pow(tc / 7, bc);

/** Exponent der Wetterfunktion w = (p_SR · ToW)^b_w / 2 (geschützt bzw. innen: p_SR · ToW = 0 → w = 0) */
export const wetterExponent = (pSR: number, tow: number, bw: number) => (Number.isNaN(pSR * tow * bw) ? NaN : pSR * tow > 0 ? Math.pow(pSR * tow, bw) / 2 : 0); // NaN nicht als 0 (Grenzfallprüfung 02.11.2026)

/** Wetterfunktion W(t) = (t₀/t)^w; für t ≤ t₀ gilt W = 1 */
export const wetterfunktion = (t: number, w: number, t0 = T0_JAHRE) => (Number.isNaN(t) || Number.isNaN(w) ? NaN : t > t0 ? Math.pow(t0 / t, w) : 1); // NaN nicht als 1 (Grenzfallprüfung 02.11.2026)

/** Karbonatisierungsgeschwindigkeit ohne Wetterfunktion √(2·k_e·k_c·(k_t·R⁻¹ + ε_t)·C_S) in mm/√a; R⁻¹, ε_t in (mm²/a)/(kg/m³) */
export function karbonatisierungsrate(ke: number, kc: number, kt: number, rInvMm2A: number, epsTMm2A: number, cS: number): number {
  if (Number.isNaN(ke) || Number.isNaN(kc) || Number.isNaN(kt) || Number.isNaN(rInvMm2A) || Number.isNaN(epsTMm2A) || Number.isNaN(cS)) return NaN; // Grenzfallprüfung 02.11.2026: NaN-Eingabe nicht als Zahl ausgeben
  const innen = 2 * ke * kc * (kt * rInvMm2A + epsTMm2A) * cS;
  return innen > 0 ? Math.sqrt(innen) : 0;
}

/** Karbonatisierungstiefe x_c(t) in mm */
export const karbonatisierungstiefe = (rate: number, t: number, w: number) => rate * Math.sqrt(Math.max(t, 0)) * wetterfunktion(t, w);

/** R⁻¹_ACC,0 in 10⁻¹¹ (m²/s)/(kg/m³) aus der Karbonatisierungstiefe im ACC-Test (2 Vol.-% CO₂, 28 d): R⁻¹ = (x_c/τ)² */
export const rInvAusAcc = (xcMm: number, tau = TAU_ACC) => ((xcMm / 1000) / tau) ** 2 / 1e-11;

/**
 * Näherung: R⁻¹ in 10⁻¹¹ (m²/s)/(kg/m³) aus K_AC nach DIN EN 12390-12 (mm/√d bei c_acc Vol.-% CO₂) über x = √(2·C·t·R⁻¹).
 * Prüfbedingungen (3 % CO₂, 57 % r. F.) weichen vom ACC-Test ab, für den k_t kalibriert ist – vorläufig, F-Freigabe.
 */
export function rInvAusKac(kacMmWurzelTag: number, cAccVolProzent = 3): number {
  const k = kacMmWurzelTag / 1000 / Math.sqrt(86400);
  const c = cAccVolProzent / 100 * RHO_CO2;
  return k * k / (2 * c) / 1e-11;
}

// ------------------------------------------------------------------ Chlorid (fib 34, B2.1)

/** Temperaturfunktion k_e = exp(b_e · (1/T_ref − 1/T_real)), T in K */
export const keTemperatur = (tRealK: number, be: number, tRefK = T_REF_K) => Math.exp(be * (1 / tRefK - 1 / tRealK));

/** Alterungsfunktion A(t) = (t₀/t)^a (für t ≤ t₀ gilt A = 1) */
export const alterungsfaktor = (t: number, a: number, t0 = T0_JAHRE) => (Number.isNaN(t) || Number.isNaN(a) ? NaN : t > t0 ? Math.pow(t0 / t, a) : 1); // NaN nicht als 1 (Grenzfallprüfung 02.11.2026)

/**
 * Chloridgehalt C(x, t) in der Einheit von C_S (M.-% bez. auf Bindemittel); x, Δx in mm, D_app in mm²/a.
 * Für x ≤ Δx gilt C = C_S,Δx (Gültigkeitsbereich der Lösung x > Δx).
 */
export function chloridgehalt(x: number, t: number, c0: number, cS: number, dx: number, dAppMm2A: number): number {
  if (t <= 0) return c0;
  const arg = Math.max(x - dx, 0) / (2 * Math.sqrt(dAppMm2A * t));
  return c0 + (cS - c0) * erfc(arg);
}

/** Tiefe, in der C(x, t) = C_crit (deterministisch): x = Δx + 2√(D·t) · erfc⁻¹((C_crit − C₀)/(C_S − C₀)) */
export function kritischeTiefe(t: number, c0: number, cS: number, dx: number, dAppMm2A: number, cCrit: number): number {
  const v = (cCrit - c0) / (cS - c0);
  if (!(v > 0)) return Infinity;
  if (v >= 1) return 0;
  return dx + 2 * Math.sqrt(dAppMm2A * t) * erfInvers(1 - v);
}

// ------------------------------------------------------------------ Modelle

export interface DeckungsAnsatz {
  /** Verteilungstyp der Betondeckung */
  typ: 'normal' | 'lognormal' | 'konstant';
  /** Mittelwert in mm (z. B. c_nom) */
  m: number;
  /** Standardabweichung in mm */
  s: number;
}

export interface KarbonatisierungsModell {
  deckung: DeckungsAnsatz;
  /** relative Luftfeuchte RH_real in % */
  rh: Verteilung;
  /** Nachbehandlungsdauer t_c in d */
  tc: number;
  bc: Verteilung;
  kt: Verteilung;
  /** inverser Karbonatisierungswiderstand R⁻¹_ACC,0 in 10⁻¹¹ (m²/s)/(kg/m³) */
  rInv: Verteilung;
  /** Fehlerterm ε_t in 10⁻¹¹ (m²/s)/(kg/m³) */
  epsT: Verteilung;
  /** CO₂-Konzentration C_S in kg/m³ */
  cS: Verteilung;
  /** Schlagregenwahrscheinlichkeit p_SR (0 … 1) */
  pSR: number;
  /** Anteil der Regentage ToW (Niederschlag ≥ 2,5 mm/d, 0 … 1) */
  tow: number;
  bw: Verteilung;
}

export interface ChloridModell {
  deckung: DeckungsAnsatz;
  /** kritischer Chloridgehalt in M.-% bez. auf Bindemittel */
  cCrit: Verteilung;
  /** Anfangschloridgehalt C₀ in M.-% */
  c0: number;
  /** Oberflächenchloridgehalt C_S,Δx in M.-% */
  cS: Verteilung;
  /** Konvektionszone Δx in mm */
  dx: Verteilung;
  /** Chloridmigrationskoeffizient D_RCM,0 in 10⁻¹² m²/s */
  dRcm: Verteilung;
  /** Alterungsexponent a */
  a: Verteilung;
  /** Regressionsparameter b_e in K */
  be: Verteilung;
  /** Bauteiltemperatur T_real in °C */
  tReal: Verteilung;
  /** Übertragungsparameter k_t (fib 34: 1) */
  kt: number;
}

export type Mechanismus = 'karbonatisierung' | 'chlorid';

export interface LebensdauerEingabe {
  mechanismus: Mechanismus;
  karbonatisierung: KarbonatisierungsModell;
  chlorid: ChloridModell;
  /** Bemessungsnutzungsdauer t_SL in Jahren */
  nutzungsdauer: number;
  /** Zielzuverlässigkeitsindex β₀ */
  betaZiel: number;
  /** Anzahl der Simulationsläufe */
  laeufe: number;
  /** Startwert des Zufallsgenerators */
  startwert: number;
  /** obere Grenze der Zeitachse in Jahren (Standard: max(100, 2 · t_SL)) */
  tMax?: number;
}

export interface Kurvenpunkt { t: number; pf: number; beta: number }

export interface Mittelwertrechnung {
  /** Karbonatisierung: Rate in mm/√a ohne W; Chlorid: D_app(t_SL) in mm²/a */
  kennwert: number;
  /** Karbonatisierung: x_c(t_SL) in mm; Chlorid: C(c_m, t_SL) in M.-% */
  einwirkung: number;
  /** Teilfaktoren: Karbonatisierung k_e, k_c, W(t_SL), R⁻¹ und ε_t in mm²/a/(kg/m³); Chlorid k_e, A(t_SL), D_RCM,0 in mm²/a */
  faktoren: Record<string, number>;
  /** Karbonatisierung: Zeit bis x_c = c_m; Chlorid: Tiefe mit C = C_crit nach t_SL (mm) */
  vergleich: number;
}

export interface LebensdauerErgebnis {
  gueltig: boolean;
  hinweise: Hinweis[];
  /** p_f zur Nutzungsdauer */
  pf: number;
  /** β zur Nutzungsdauer (bei p_f = 0 Untergrenze aus der Laufzahl) */
  beta: number;
  /** p_f = 0 in allen Läufen: β ist nur als Untergrenze angegeben */
  betaUntergrenze: boolean;
  /** Standardfehler von p_f */
  standardfehler: number;
  /** p_f,Ziel = Φ(−β₀) */
  pfZiel: number;
  nachweis: boolean;
  kurve: Kurvenpunkt[];
  /** erforderlicher Mittelwert der Betondeckung für β₀ zur Nutzungsdauer (gleiche Streuung), mm; null = nicht erreichbar */
  erfDeckung: number | null;
  /** rechnerische Lebensdauer: erstes Jahr mit β < β₀; null = bis tMax nicht unterschritten */
  lebensdauer: number | null;
  mittelwerte: Mittelwertrechnung;
}

// ------------------------------------------------------------------ Hilfsfunktionen

/** Betondeckung aus Standardnormalwert z (≥ 0) */
export function deckungAusZ(d: DeckungsAnsatz, m: number, z: number): number {
  if (d.typ === 'konstant' || d.s === 0) return m;
  if (d.typ === 'normal') return Math.max(m + d.s * z, 0);
  const p = lognormalParameter(m, d.s);
  return Math.exp(p.lambda + p.zeta * z);
}

/** Versagenswahrscheinlichkeit aus einer Zählung, β mit Untergrenze für 0 Versagensfälle */
function pfUndBeta(versagen: number, n: number): { pf: number; beta: number; untergrenze: boolean } {
  if (versagen === 0) return { pf: 0, beta: betaAusPf(0.5 / n), untergrenze: true };
  const pf = versagen / n;
  return { pf, beta: versagen === n ? -Infinity : betaAusPf(pf), untergrenze: false };
}

const mittel = (v: Verteilung) => v.m;

function zeitachse(tMax: number, tSL: number): number[] {
  const n = Math.min(Math.ceil(tMax), 400);
  const t = Array.from({ length: n }, (_, i) => (i + 1) * tMax / n);
  if (!t.some(x => Math.abs(x - tSL) < 1e-9)) t.push(tSL);
  return t.sort((a, b) => a - b);
}

// ------------------------------------------------------------------ Simulation

interface Stichprobe {
  /** Grenzzustandsfunktion < 0 ↔ Versagen: liefert true, wenn die Deckung c zum Zeitpunkt t depassiviert ist */
  versagt: (i: number, c: number, t: number) => boolean;
  /** Standardnormalwert der Deckung je Lauf */
  z: Float64Array;
}

function stichprobeKarbonatisierung(k: KarbonatisierungsModell, n: number, u: Zufall): Stichprobe {
  const rate = new Float64Array(n), w = new Float64Array(n), z = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const ke = keFeuchte(ziehe(k.rh, u));
    const kc = kcNachbehandlung(k.tc, ziehe(k.bc, u));
    const kt = ziehe(k.kt, u);
    const rInv = Math.max(ziehe(k.rInv, u), 0) * R_EINHEIT_MM2_A;
    const eps = ziehe(k.epsT, u) * R_EINHEIT_MM2_A;
    const cS = Math.max(ziehe(k.cS, u), 0);
    rate[i] = karbonatisierungsrate(ke, kc, kt, rInv, eps, cS);
    w[i] = wetterExponent(k.pSR, k.tow, ziehe(k.bw, u));
    z[i] = standardNormal(u);
  }
  return { z, versagt: (i, c, t) => karbonatisierungstiefe(rate[i], t, w[i]) >= c };
}

function stichprobeChlorid(k: ChloridModell, n: number, u: Zufall): Stichprobe {
  const cCrit = new Float64Array(n), cS = new Float64Array(n), dx = new Float64Array(n);
  const d = new Float64Array(n), a = new Float64Array(n), z = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    cCrit[i] = ziehe(k.cCrit, u);
    cS[i] = Math.max(ziehe(k.cS, u), 0);
    dx[i] = Math.max(ziehe(k.dx, u), 0);
    const ke = keTemperatur(ziehe(k.tReal, u) + 273.15, ziehe(k.be, u));
    d[i] = ke * Math.max(ziehe(k.dRcm, u), 0) * D_EINHEIT_MM2_A * k.kt;
    a[i] = ziehe(k.a, u);
    z[i] = standardNormal(u);
  }
  return {
    z,
    versagt: (i, c, t) => chloridgehalt(c, t, k.c0, cS[i], dx[i], d[i] * alterungsfaktor(t, a[i])) >= cCrit[i],
  };
}

function zaehle(s: Stichprobe, d: DeckungsAnsatz, m: number, t: number, n: number): number {
  let v = 0;
  for (let i = 0; i < n; i++) if (s.versagt(i, deckungAusZ(d, m, s.z[i]), t)) v++;
  return v;
}

/** Mittelwert der Deckung, bei dem p_f(t_SL) gerade ≤ p_f,Ziel wird (Bisektion mit denselben Stichproben) */
function erforderlicheDeckung(s: Stichprobe, d: DeckungsAnsatz, t: number, n: number, pfZiel: number): number | null {
  const ok = (m: number) => zaehle(s, d, m, t, n) / n <= pfZiel;
  let lo = d.typ === 'lognormal' ? 0.5 : 0, hi = 400;
  if (!ok(hi)) return null;
  if (ok(lo)) return lo;
  for (let j = 0; j < 40 && hi - lo > 0.05; j++) {
    const mid = (lo + hi) / 2;
    if (ok(mid)) hi = mid; else lo = mid;
  }
  return hi;
}

function pruefeDeckung(h: Hinweis[], d: DeckungsAnsatz) {
  if (!istEndlich(d.m, d.s) || d.m <= 0) h.push({ stufe: 'fehler', feld: 'deckung', text: 'Betondeckung: Mittelwert > 0 mm angeben.' });
  else if (d.s < 0) h.push({ stufe: 'fehler', feld: 'deckung', text: 'Betondeckung: Die Standardabweichung muss ≥ 0 sein.' });
  else {
    if (d.typ === 'normal' && d.s > 0 && d.m < 3 * d.s) h.push({ stufe: 'warnung', feld: 'deckung', text: 'Betondeckung: Mittelwert < 3 · Standardabweichung – negative Werte der Normalverteilung werden zu 0 mm gesetzt.' });
    if (d.m > 120) h.push({ stufe: 'warnung', feld: 'deckung', text: 'Betondeckung über 120 mm: außerhalb des üblichen Anwendungsbereichs.' });
  }
}

/** Mittelwertrechnung (alle Basisvariablen auf ihrem Mittelwert) für den Rechenweg */
export function mittelwertrechnung(e: LebensdauerEingabe): Mittelwertrechnung {
  const t = e.nutzungsdauer;
  if (e.mechanismus === 'karbonatisierung') {
    const k = e.karbonatisierung;
    const ke = keFeuchte(mittel(k.rh)), kc = kcNachbehandlung(k.tc, mittel(k.bc));
    const r = mittel(k.rInv) * R_EINHEIT_MM2_A, eps = mittel(k.epsT) * R_EINHEIT_MM2_A;
    const w = wetterExponent(k.pSR, k.tow, mittel(k.bw));
    const rate = karbonatisierungsrate(ke, kc, mittel(k.kt), r, eps, mittel(k.cS));
    const W = wetterfunktion(t, w);
    // Zeit bis x_c = c: c = rate · t^(1/2 − w) · t₀^w → t = (c / (rate · t₀^w))^(1/(1/2 − w))
    const tc = rate > 0 && w < 0.5 ? Math.pow(k.deckung.m / (rate * Math.pow(T0_JAHRE, w)), 1 / (0.5 - w)) : Infinity;
    return { kennwert: rate, einwirkung: karbonatisierungstiefe(rate, t, w), faktoren: { ke, kc, w, W, r, eps }, vergleich: tc };
  }
  const k = e.chlorid;
  const ke = keTemperatur(mittel(k.tReal) + 273.15, mittel(k.be));
  const A = alterungsfaktor(t, mittel(k.a));
  const d0 = mittel(k.dRcm) * D_EINHEIT_MM2_A;
  const dApp = ke * d0 * k.kt * A;
  const c = chloridgehalt(k.deckung.m, t, k.c0, mittel(k.cS), mittel(k.dx), dApp);
  return { kennwert: dApp, einwirkung: c, faktoren: { ke, A, d0 }, vergleich: kritischeTiefe(t, k.c0, mittel(k.cS), mittel(k.dx), dApp, mittel(k.cCrit)) };
}

/** Probabilistische Lebensdauerbemessung (Grenzzustand Depassivierung) */
export function lebensdauerbemessung(e: LebensdauerEingabe): LebensdauerErgebnis {
  const h: Hinweis[] = [];
  const pfZiel = pfAusBeta(e.betaZiel);
  const leer: LebensdauerErgebnis = {
    gueltig: false, hinweise: h, pf: NaN, beta: NaN, betaUntergrenze: false, standardfehler: NaN, pfZiel, nachweis: false,
    kurve: [], erfDeckung: null, lebensdauer: null,
    mittelwerte: { kennwert: NaN, einwirkung: NaN, faktoren: {}, vergleich: NaN },
  };
  if (!istEndlich(e.nutzungsdauer) || e.nutzungsdauer <= 0) h.push({ stufe: 'fehler', feld: 'nutzungsdauer', text: 'Nutzungsdauer > 0 Jahre angeben.' });
  else if (e.nutzungsdauer > 200) h.push({ stufe: 'warnung', feld: 'nutzungsdauer', text: 'Nutzungsdauer über 200 Jahre: Die Modelle sind dafür nicht kalibriert.' });
  if (!istEndlich(e.betaZiel) || e.betaZiel < 0 || e.betaZiel > 4) h.push({ stufe: 'fehler', feld: 'betaZiel', text: 'Zielzuverlässigkeit β₀ zwischen 0 und 4 angeben.' });
  if (!Number.isInteger(e.laeufe) || e.laeufe < 1000 || e.laeufe > 200000) h.push({ stufe: 'fehler', feld: 'laeufe', text: 'Anzahl der Läufe: ganze Zahl von 1000 bis 200 000.' });
  if (!istEndlich(e.startwert)) h.push({ stufe: 'fehler', feld: 'startwert', text: 'Startwert des Zufallsgenerators fehlt.' });

  if (e.mechanismus === 'karbonatisierung') {
    const k = e.karbonatisierung;
    pruefeDeckung(h, k.deckung);
    pruefeVerteilung(h, k.rh, 'rh', 'Relative Luftfeuchte');
    if (Number.isFinite(k.rh.m) && (k.rh.m < 40 || k.rh.m > 100)) h.push({ stufe: 'fehler', feld: 'rh', text: 'Relative Luftfeuchte: Mittelwert zwischen 40 und 100 % angeben.' });
    if (!istEndlich(k.tc) || k.tc <= 0) h.push({ stufe: 'fehler', feld: 'tc', text: 'Nachbehandlungsdauer t_c > 0 d angeben.' });
    else if (k.tc > 28) h.push({ stufe: 'warnung', feld: 'tc', text: 'Nachbehandlung über 28 d: außerhalb des Kalibrierbereichs von k_c.' });
    pruefeVerteilung(h, k.bc, 'bc', 'Exponent b_c');
    pruefeVerteilung(h, k.kt, 'kt', 'Regressionsparameter k_t', true);
    pruefeVerteilung(h, k.rInv, 'rInv', 'R⁻¹_ACC,0', true);
    pruefeVerteilung(h, k.epsT, 'epsT', 'Fehlerterm ε_t');
    pruefeVerteilung(h, k.cS, 'cS', 'CO₂-Konzentration C_S', true);
    pruefeVerteilung(h, k.bw, 'bw', 'Exponent b_w');
    if (!istEndlich(k.pSR, k.tow) || k.pSR < 0 || k.pSR > 1 || k.tow < 0 || k.tow > 1) h.push({ stufe: 'fehler', feld: 'tow', text: 'p_SR und ToW liegen zwischen 0 und 1.' });
    if (Number.isFinite(k.rInv.m) && k.rInv.m > 100) h.push({ stufe: 'warnung', feld: 'rInv', text: 'R⁻¹_ACC,0 über 100 · 10⁻¹¹ (m²/s)/(kg/m³): sehr geringer Karbonatisierungswiderstand.' });
  } else {
    const k = e.chlorid;
    pruefeDeckung(h, k.deckung);
    pruefeVerteilung(h, k.cCrit, 'cCrit', 'Kritischer Chloridgehalt', true);
    pruefeVerteilung(h, k.cS, 'cS', 'Oberflächenchloridgehalt', true);
    pruefeVerteilung(h, k.dx, 'dx', 'Konvektionszone Δx');
    pruefeVerteilung(h, k.dRcm, 'dRcm', 'D_RCM,0', true);
    pruefeVerteilung(h, k.a, 'a', 'Alterungsexponent a');
    pruefeVerteilung(h, k.be, 'be', 'Regressionsparameter b_e');
    pruefeVerteilung(h, k.tReal, 'tReal', 'Bauteiltemperatur');
    if (!istEndlich(k.c0, k.kt) || k.c0 < 0 || k.kt <= 0) h.push({ stufe: 'fehler', feld: 'c0', text: 'C₀ ≥ 0 und k_t > 0 angeben.' });
    if (istEndlich(k.c0, k.cS.m, k.cCrit.m) && k.c0 >= k.cCrit.m) h.push({ stufe: 'fehler', feld: 'c0', text: 'Der Anfangschloridgehalt C₀ muss unter dem kritischen Chloridgehalt liegen.' });
    if (istEndlich(k.cS.m, k.cCrit.m) && k.cS.m <= k.cCrit.m) h.push({ stufe: 'warnung', feld: 'cS', text: 'C_S liegt im Mittel nicht über C_crit: Depassivierung nur durch die Streuung möglich.' });
    if (Number.isFinite(k.a.m) && (k.a.m < 0 || k.a.m >= 1)) h.push({ stufe: 'fehler', feld: 'a', text: 'Alterungsexponent a zwischen 0 und 1 angeben.' });
    if (Number.isFinite(k.tReal.m) && (k.tReal.m < -20 || k.tReal.m > 40)) h.push({ stufe: 'warnung', feld: 'tReal', text: 'Mittlere Bauteiltemperatur außerhalb −20 … 40 °C.' });
    if (Number.isFinite(k.dRcm.m) && k.dRcm.m > 40) h.push({ stufe: 'warnung', feld: 'dRcm', text: 'D_RCM,0 über 40 · 10⁻¹² m²/s: außerhalb der tabellierten Betone.' });
  }
  if (hatFehler(h)) return nurGueltig(leer);

  const n = e.laeufe;
  const u = zufallsgenerator(e.startwert);
  const deckung = e.mechanismus === 'karbonatisierung' ? e.karbonatisierung.deckung : e.chlorid.deckung;
  const s = e.mechanismus === 'karbonatisierung' ? stichprobeKarbonatisierung(e.karbonatisierung, n, u) : stichprobeChlorid(e.chlorid, n, u);
  const tSL = e.nutzungsdauer;
  const tMax = e.tMax && e.tMax > tSL ? e.tMax : Math.max(100, 2 * tSL);

  const kurve: Kurvenpunkt[] = zeitachse(tMax, tSL).map(t => {
    const r = pfUndBeta(zaehle(s, deckung, deckung.m, t, n), n);
    return { t, pf: r.pf, beta: r.beta };
  });
  const amEnde = pfUndBeta(zaehle(s, deckung, deckung.m, tSL, n), n);
  const lebensdauer = kurve.find(p => p.beta < e.betaZiel)?.t ?? null;
  const erfDeckung = erforderlicheDeckung(s, deckung, tSL, n, pfZiel);
  if (amEnde.untergrenze) h.push({ stufe: 'warnung', feld: 'laeufe', text: `In keinem der ${n} Läufe versagt: β ist nur als Untergrenze angegeben.` });
  if (n < 10000) h.push({ stufe: 'warnung', feld: 'laeufe', text: 'Weniger als 10 000 Läufe: Der Standardfehler von p_f ist groß.' });
  if (erfDeckung === null) h.push({ stufe: 'warnung', feld: 'deckung', text: 'Auch mit 400 mm Deckung wird β₀ nicht erreicht.' });

  return nurGueltig({
    gueltig: true, hinweise: h,
    pf: amEnde.pf, beta: amEnde.beta, betaUntergrenze: amEnde.untergrenze,
    standardfehler: Math.sqrt(Math.max(amEnde.pf * (1 - amEnde.pf), 0) / n),
    pfZiel, nachweis: amEnde.pf <= pfZiel,
    kurve, erfDeckung, lebensdauer,
    mittelwerte: mittelwertrechnung(e),
  });
}

// ------------------------------------------------------------------ Kennwerte (öffentliche Wiedergaben von fib 34)

/** Basisvariablen der Karbonatisierung nach fib 34 (Quellen: Prabowo/Hilmy 2018, Tab. 1; Carević/Ignjatović 2022, Tab. 1; rational-rc) */
export const FIB_KARBONATISIERUNG = {
  bc: { typ: 'normal', m: -0.567, s: 0.024 } as Verteilung,
  kt: { typ: 'normal', m: 1.25, s: 0.35 } as Verteilung,
  /** ε_t = 1,0 · 10⁻¹¹ ± 0,15 · 10⁻¹¹ (m²/s)/(kg/m³) ≙ 315,5 ± 48 (mm²/a)/(kg/m³) */
  epsT: { typ: 'normal', m: 1.0, s: 0.15 } as Verteilung,
  cSatm: { typ: 'normal', m: 0.00082, s: 0.0001 } as Verteilung,
  bw: { typ: 'normal', m: 0.446, s: 0.163 } as Verteilung,
} as const;

/** Standardabweichung von R⁻¹_ACC,0 nach fib 34: s = 0,69 · m^0,78 (beide in 10⁻¹¹ (m²/s)/(kg/m³); Wiedergabe rational-rc) */
export const rInvStreuung = (m: number) => 0.69 * Math.pow(Math.max(m, 0), 0.78);

/** Basisvariablen des Chloridmodells nach fib 34 (Quellen: Shojaeian et al. 2016/2017; Papworth et al. 2025; rational-rc) */
export const FIB_CHLORID = {
  cCrit: { typ: 'beta', m: 0.6, s: 0.15, a: 0.2, b: 2.0 } as Verteilung,
  dxSpritz: { typ: 'beta', m: 8.9, s: 5.6, a: 0, b: 50 } as Verteilung,
  be: { typ: 'normal', m: 4800, s: 700 } as Verteilung,
  /** Alterungsexponent a je Bindemittel (Beta auf [0; 1], 0,40 ≤ w/z ≤ 0,60) */
  alterung: {
    cemI: { typ: 'beta', m: 0.30, s: 0.12, a: 0, b: 1 } as Verteilung,
    flugasche: { typ: 'beta', m: 0.60, s: 0.15, a: 0, b: 1 } as Verteilung,
    huettensand: { typ: 'beta', m: 0.45, s: 0.20, a: 0, b: 1 } as Verteilung,
  },
  /** Variationskoeffizient von D_RCM,0 (Normalverteilung) */
  vDrcm: 0.2,
} as const;
