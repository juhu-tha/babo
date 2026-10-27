/**
 * Rechenkern Werkstoffmodelle (Umsetzungsplan Phase 4, AP 4.2) – übernommen aus src/modules/Stahl.tsx
 * (mit stahl/daten.ts und stahl/StahlWerkstoffkunde.tsx), src/modules/SpannungDehnung.tsx und
 * src/modules/Kunststoffe.tsx. Verhalten 1:1, nur die Stellen mit Kommentar „geändert“ weichen ab.
 *
 * Stahl
 *  - Abminderungsfaktoren k_y,θ und k_E,θ für Kohlenstoffstahl nach DIN EN 1993-1-2, Tab. 3.1, linear interpoliert
 *  - vereinfachte Spannungs-Dehnungs-Linie für den Brandfall (Lehrmodell): linear bis f_y/E, Plateau bis 2 %,
 *    linear auf f_u bei 20 % Dehnung; bei θ mit f_y,θ = k_y·f_y, E_θ = k_E·E, f_u,θ = k_y·f_u
 *  - Wöhlerlinie nach DIN EN 1993-1-9, 7.1: Δσ_D = Δσ_C·(2/5)^(1/m), Δσ_L = Δσ_D·(5/100)^(1/5),
 *    N_R = 2·10⁶·(Δσ_C/Δσ)^m für Δσ > Δσ_D, 5·10⁶·(Δσ_D/Δσ)⁵ für Δσ_L < Δσ ≤ Δσ_D, sonst ∞
 *  - Walzeigenspannung im Flansch als Parabel σ(x) = a·x² + σ_Zug mit σ_Rand = −r·f_y, σ_Mitte = r/2·f_y
 *    (r = 0,5 Breitflansch / 0,3 I-Profil; Gleichgewicht ∫σ dx = 0)
 *  - Längseigenspannung quer zur Schweißnaht (Lehrnäherung nach Okerblom/Masubuchi):
 *    σ(x) = f_y·(1 − (x/b)²)·exp(−½(x/b)²), b = max(10 mm; 0,15·Q/t)
 *  - Spannungs-Dehnungs-Linien der Stahlsorten (Lehrkurven): ausgeprägte Streckgrenze mit Lüdersplateau bzw. stetiger
 *    Fließübergang (Proportionalitätsgrenze 0,75·R_p0,2, Edelstahl 0,65·R_p0,2), Verfestigung parabolisch bis R_m
 *    bei A_g, Einschnürung linear bis zur Bruchspannung bei A
 *  - Wirksumme PREN = Cr + 3,3·Mo (ohne Stickstoff) und Gefügeeinordnung der Legierungsmischung (Lehrschema)
 * Beton/Betonstahl (DIN EN 1992-1-1, 3.1.5, 3.1.7, 3.2.7 mit NA DE)
 *  - Parabel-Rechteck-Diagramm σ_c = f_cd·[1 − (1 − ε_c/ε_c2)^n], Parameter ε_c2, ε_cu2, n nach Tab. 3.1
 *  - nichtlineare Linie σ_c/f_cm = (k·η − η²)/(1 + (k − 2)·η) mit η = ε_c/ε_c1, k = 1,05·E_cm·ε_c1/f_cm (Gl. 3.14)
 *  - Betonstahl B500A/B500B bilinear: charakteristisch mit Verfestigung bis (ε_uk; k·f_yk),
 *    Bemessung horizontal f_yd = f_yk/γ_s bis ε_ud = 25 ‰ (NA DE)
 * Kunststoffe
 *  - E-Modul über der Temperatur als logistisches Lehrmodell je Strukturtyp (Glas-, Übergangs-, Fließbereich)
 *  - Wärmedehnung ΔL = L_0·α_T·ΔT
 Materialmodelle (aus src/modules/Materialmodelle.tsx, AP 4.2 Runde 3)
 *  - bilinear elasto-plastisch mit Verfestigung: σ = E·ε bis ε_y = f_y/E, danach σ = f_y + E_t·(ε − ε_y);
 *    Entlastung parallel zur Hookeschen Geraden, ε_p = ε_max − σ_max/E, Verhältnis k = σ_max/f_y
 *  - qualitative σ-ε-Lehrkurven (linear, nichtlinear σ = E·ε/(1 + (ε/ε₀)²), ideal-plastisch, viskoelastisch
 *    σ = σ_∞·(1 − e^(−E·ε/σ_∞))) sowie Thixotropie η = 20 + 80·e^(−t/2) und Rheopexie η = 100 − 80·e^(−t/2)
 *  - Bingham-Fluid γ̇ = (τ − τ₀)/μ_p für τ > τ₀, sonst 0; Halbwertszeit der Maxwell-Relaxation t½ = τ·ln 2
 *    (σ(t) = σ₀·e^(−t/τ) aus src/calc/kriechenSchwinden.ts)
 * Einheiten: Spannungen und Moduln in N/mm² (MPa), Dehnungen wie angegeben (Stahl in % bzw. –, Beton in ‰),
 * Temperaturen in °C, Längen in mm. Lehr- und Vorbemessungswerkzeug – geprüft in tests/werkstoffmodelle.test.ts.
 */
import { EC2_NA_DE } from '../data/normParams';
import { BETONSTAHL, E_BETONSTAHL, E_BAUSTAHL, dehnungsKennwerte, fcdBeton } from '../data/kennwerte';
import { type Hinweis, istEndlich, hatFehler, muss, bereich } from './plausibilitaet';
import { formatDeZahl } from '../utils/numberFormat';
import { maxwellRelaxation } from './kriechenSchwinden';

// =============================================================================================
// Stahl im Brandfall (DIN EN 1993-1-2, Tab. 3.1)
// =============================================================================================

/** Stützstellen nach DIN EN 1993-1-2, Tab. 3.1 (Kohlenstoffstahl): k_y,θ = f_y,θ/f_y, k_E,θ = E_a,θ/E_a */
export const EC3_BRAND_TAB31 = {
  theta: [20, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  ky: [1.0, 1.0, 1.0, 1.0, 1.0, 0.78, 0.47, 0.23, 0.11, 0.06, 0.04, 0.02, 0.0],
  kE: [1.0, 1.0, 0.9, 0.8, 0.7, 0.6, 0.31, 0.13, 0.09, 0.0675, 0.045, 0.0225, 0.0],
} as const;

/** k_y,θ und k_E,θ, linear interpoliert; θ ≤ 20 °C → 1, θ ≥ 1200 °C → 0 */
export function abminderungStahlBrand(theta: number): { ky: number; kE: number } {
  const { theta: t, ky, kE } = EC3_BRAND_TAB31;
  if (theta <= 20) return { ky: 1.0, kE: 1.0 };
  if (theta >= 1200) return { ky: 0.0, kE: 0.0 };
  for (let i = 0; i < t.length - 1; i++) {
    if (theta >= t[i] && theta <= t[i + 1]) {
      const s = (theta - t[i]) / (t[i + 1] - t[i]);
      return { ky: ky[i] + s * (ky[i + 1] - ky[i]), kE: kE[i] + s * (kE[i + 1] - kE[i]) };
    }
  }
  return { ky: 1.0, kE: 1.0 }; // nur bei NaN erreichbar; stahlBrand() meldet das als Fehler
}

/**
 * Vereinfachte Spannungs-Dehnungs-Linie (Lehrmodell, ε dimensionslos): elastisch bis f_y/E, Plateau bis ε = 0,02,
 * danach linear bis f_u bei ε = 0,20. Für E ≤ 0 (θ ≥ 1200 °C) ist die Spannung 0.
 */
export function stahlLinieVereinfacht(eps: number, fy: number, fu: number, E: number): number {
  if (E <= 0) return eps <= 0.02 ? fy : fy + (fu - fy) * ((eps - 0.02) / 0.18);
  const epsY = fy / E;
  if (eps <= epsY) return eps * E;
  if (eps <= 0.02) return fy;
  return fy + (fu - fy) * ((eps - 0.02) / 0.18);
}

export interface StahlBrandEingabe { fy: number; fu: number; theta: number; E?: number }
export interface StahlBrandErgebnis {
  ky: number; kE: number; fyT: number; ET: number; fuT: number;
  /** ε = 0 … 0,20 in Schritten von 0,005 */
  kurve: { eps: number; sig20: number; sigT: number }[];
  gueltig: boolean; hinweise: Hinweis[];
}

export const STAHL_E = E_BAUSTAHL;

export function stahlBrand(e: StahlBrandEingabe): StahlBrandErgebnis {
  const hinweise: Hinweis[] = [];
  const E0 = e.E ?? STAHL_E;
  muss(hinweise, istEndlich(e.fy, e.fu, e.theta, E0), 'eingabe', 'Alle Eingaben müssen endliche Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.fy > 0 && e.fu >= e.fy, 'fy', 'Es muss 0 < f_y ≤ f_u gelten.');
    muss(hinweise, E0 > 0, 'E', 'Der E-Modul muss größer als 0 sein.');
    bereich(hinweise, 'theta', e.theta, 20, 1200, 'Tab. 3.1 der DIN EN 1993-1-2 gilt für 20 … 1200 °C; außerhalb werden die Randwerte angesetzt.');
  }
  if (hatFehler(hinweise)) return { ky: 0, kE: 0, fyT: 0, ET: 0, fuT: 0, kurve: [], gueltig: false, hinweise };
  const { ky, kE } = abminderungStahlBrand(e.theta);
  const fyT = e.fy * ky, ET = E0 * kE, fuT = e.fu * ky;
  const kurve: StahlBrandErgebnis['kurve'] = [];
  // geändert: Schrittzählung über den Index statt aufsummierter 0,005 (Endpunkt 0,20 sicher enthalten)
  for (let i = 0; i <= 40; i++) {
    const eps = i * 0.005;
    kurve.push({ eps, sig20: stahlLinieVereinfacht(eps, e.fy, e.fu, E0), sigT: stahlLinieVereinfacht(eps, fyT, fuT, ET) });
  }
  return { ky, kE, fyT, ET, fuT, kurve, gueltig: true, hinweise };
}

// =============================================================================================
// Ermüdung – Wöhlerlinie (DIN EN 1993-1-9, 7.1)
// =============================================================================================

export const N_C = 2e6, N_D = 5e6, N_L = 1e8;

export interface WoehlerEingabe { deltaSigmaC: number; m: number; deltaSigma: number }
export interface WoehlerErgebnis {
  deltaSigmaD: number; deltaSigmaL: number;
  /** ertragbare Lastwechsel; ∞ unterhalb Δσ_L, 0 für Δσ ≤ 0 (wie im Modul) */
  nR: number;
  /** Stützstellen N = 10⁴, 10⁵, 2·10⁶, 5·10⁶, 10⁷, 10⁸ */
  kurve: { N: number; deltaSigma: number }[];
  bereich: 'zeitfest' | 'zwischen' | 'dauerfest' | 'ohne';
  gueltig: boolean; hinweise: Hinweis[];
}

/** Δσ_R(N) der Wöhlerlinie für N ≤ 10⁸ (darüber Δσ_L) */
export function woehlerSpannung(N: number, deltaSigmaC: number, m: number): number {
  const dD = deltaSigmaC * Math.pow(N_C / N_D, 1 / m);
  if (N <= N_D) return deltaSigmaC * Math.pow(N_C / N, 1 / m);
  if (N <= N_L) return dD * Math.pow(N_D / N, 1 / 5);
  return dD * Math.pow(N_D / N_L, 1 / 5);
}

export function woehlerEc3(e: WoehlerEingabe): WoehlerErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.deltaSigmaC, e.m, e.deltaSigma), 'eingabe', 'Alle Eingaben müssen endliche Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.deltaSigmaC > 0, 'deltaSigmaC', 'Der Kerbfall Δσ_C muss größer als 0 sein.');
    muss(hinweise, e.m > 0, 'm', 'Die Neigung m muss größer als 0 sein.');
    muss(hinweise, e.deltaSigma >= 0, 'deltaSigma', 'Die Spannungsschwingbreite Δσ ist ein Betrag (≥ 0).');
  }
  if (hatFehler(hinweise)) return { deltaSigmaD: 0, deltaSigmaL: 0, nR: 0, kurve: [], bereich: 'ohne', gueltig: false, hinweise };
  const deltaSigmaD = e.deltaSigmaC * Math.pow(N_C / N_D, 1 / e.m);
  const deltaSigmaL = deltaSigmaD * Math.pow(N_D / N_L, 1 / 5);
  let nR = 0;
  let ber: WoehlerErgebnis['bereich'] = 'ohne';
  if (e.deltaSigma > 0) {
    if (e.deltaSigma > deltaSigmaD) { nR = N_C * Math.pow(e.deltaSigmaC / e.deltaSigma, e.m); ber = 'zeitfest'; }
    else if (e.deltaSigma > deltaSigmaL) { nR = N_D * Math.pow(deltaSigmaD / e.deltaSigma, 5); ber = 'zwischen'; }
    else { nR = Infinity; ber = 'dauerfest'; }
  }
  const kurve = [1e4, 1e5, 2e6, 5e6, 1e7, 1e8].map(N => ({ N, deltaSigma: woehlerSpannung(N, e.deltaSigmaC, e.m) }));
  if (e.m !== 3) hinweise.push({ stufe: 'warnung', feld: 'm', text: `Mit m = ${formatDeZahl(e.m, 0)} verschiebt sich auch Δσ_D = Δσ_C·(2/5)^(1/m); DIN EN 1993-1-9 bildet Normalspannungen mit m = 3 und m = 5 ab.` });
  return { deltaSigmaD, deltaSigmaL, nR, kurve, bereich: ber, gueltig: true, hinweise };
}

// =============================================================================================
// Eigenspannungen
// =============================================================================================

export type Walzprofiltyp = 'h' | 'i';
/** Randdruckspannung als Anteil von f_y: Breitflansch (HEB) 0,5, schmales I-Profil (IPE) 0,3 */
export const WALZ_DRUCKANTEIL: Readonly<Record<Walzprofiltyp, number>> = { h: 0.5, i: 0.3 };

export interface WalzErgebnis { maxDruck: number; maxZug: number; verlauf: { x: number; sigma: number }[] }

/** Parabolische Eigenspannung über der Flanschbreite x = −50 … +50 % (51 Punkte) */
export function walzEigenspannung(fy: number, typ: Walzprofiltyp, punkte = 50): WalzErgebnis {
  const r = WALZ_DRUCKANTEIL[typ];
  const maxDruck = -r * fy;
  const maxZug = (r / 2) * fy;
  const a = (maxDruck - maxZug) / Math.pow(50, 2);
  const verlauf: WalzErgebnis['verlauf'] = [];
  for (let i = 0; i <= punkte; i++) {
    const x = (i / punkte) * 100 - 50;
    verlauf.push({ x, sigma: a * x * x + maxZug });
  }
  return { maxDruck, maxZug, verlauf };
}

export interface SchweissEingabe { fy: number; streckenenergie: number; blechdicke: number }
export interface SchweissErgebnis {
  /** Breite der Zugzone b [mm] */
  bt: number; mindestbreiteAktiv: boolean;
  /** x = −150 … +150 mm (201 Punkte) */
  verlauf: { x: number; sigma: number }[];
  gueltig: boolean; hinweise: Hinweis[];
}

export const SCHWEISS_MINDESTBREITE = 10; // mm, Untergrenze des Lehrmodells

export function schweissEigenspannung(e: SchweissEingabe, punkte = 200, abstand = 150): SchweissErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.fy, e.streckenenergie, e.blechdicke), 'eingabe', 'Alle Eingaben müssen endliche Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.fy > 0, 'fy', 'f_y muss größer als 0 sein.');
    muss(hinweise, e.streckenenergie >= 0, 'streckenenergie', 'Die Streckenenergie muss ≥ 0 sein.');
    muss(hinweise, e.blechdicke > 0, 'blechdicke', 'Die Blechdicke muss größer als 0 sein.');
  }
  if (hatFehler(hinweise)) return { bt: 0, mindestbreiteAktiv: false, verlauf: [], gueltig: false, hinweise };
  const bRoh = (e.streckenenergie / e.blechdicke) * 0.15;
  const bt = Math.max(SCHWEISS_MINDESTBREITE, bRoh);
  const mindestbreiteAktiv = bRoh < SCHWEISS_MINDESTBREITE;
  const verlauf: SchweissErgebnis['verlauf'] = [];
  for (let i = 0; i <= punkte; i++) {
    const x = (i / punkte) * 2 * abstand - abstand;
    const q = x / bt;
    verlauf.push({ x, sigma: e.fy * (1 - q * q) * Math.exp(-0.5 * q * q) });
  }
  if (mindestbreiteAktiv) hinweise.push({ stufe: 'warnung', feld: 'streckenenergie', text: `0,15·Q/t = ${formatDeZahl(bRoh, 1)} mm liegt unter der Mindestbreite des Lehrmodells; angesetzt wird b = ${SCHWEISS_MINDESTBREITE} mm.` });
  return { bt, mindestbreiteAktiv, verlauf, gueltig: true, hinweise };
}

// =============================================================================================
// Spannungs-Dehnungs-Linien der Stahlsorten (Lehrkurven; Dehnungen in %)
// =============================================================================================

export interface StahlKennlinie {
  id: string;
  E: number; fy: number; fu: number;
  /** Bruchdehnung A, Beginn der Verfestigung, Gleichmaßdehnung A_g [%] */
  A: number; sh_strain: number; fu_strain: number;
  frac_stress: number;
  yieldType: 'ausgeprägt' | 'stetig';
}

/** Proportionalitätsgrenze als Anteil von R_p0,2 (Edelstahl früherer Fließbeginn) */
export const proportionalAnteil = (s: StahlKennlinie) => (s.id === 'Edelstahl' ? 0.65 : 0.75);

/** Spannung [MPa] bei Dehnung ε [%]; 0 für ε ≤ 0 und nach dem Bruch (ε > A) */
export function stahlSpannungBeiDehnung(s: StahlKennlinie, eps: number): number {
  if (eps <= 0) return 0;
  if (eps > s.A) return 0;
  if (s.yieldType === 'ausgeprägt') {
    const epsEl = (s.fy / s.E) * 100;
    if (eps <= epsEl) return s.E * (eps / 100);
    if (eps <= s.sh_strain) return s.fy;
    if (eps <= s.fu_strain) {
      const t = (eps - s.sh_strain) / (s.fu_strain - s.sh_strain);
      return s.fy + (s.fu - s.fy) * (2 * t - t * t);
    }
    const t = (eps - s.fu_strain) / (s.A - s.fu_strain);
    return s.fu - (s.fu - s.frac_stress) * t;
  }
  const sProp = proportionalAnteil(s) * s.fy;
  const epsProp = (sProp / s.E) * 100;
  const epsP02 = (s.fy / s.E) * 100 + 0.2;
  if (eps <= epsProp) return s.E * (eps / 100);
  if (eps <= epsP02) {
    const t = (eps - epsProp) / (epsP02 - epsProp);
    return sProp + (s.fy - sProp) * (1 - Math.pow(1 - t, 1.6));
  }
  if (eps <= s.fu_strain) {
    const t = (eps - epsP02) / (s.fu_strain - epsP02);
    return s.fy + (s.fu - s.fy) * (2 * t - t * t);
  }
  const t = (eps - s.fu_strain) / (s.A - s.fu_strain);
  return s.fu - (s.fu - s.frac_stress) * t;
}

export type Verformungsphase = 'ruhe' | 'bruch' | 'elastisch' | 'fliessplateau' | 'fliessuebergang' | 'verfestigung' | 'einschnuerung';

export function stahlVerformungsphase(s: StahlKennlinie, eps: number): Verformungsphase {
  if (eps <= 0) return 'ruhe';
  if (eps > s.A) return 'bruch';
  if (s.yieldType === 'ausgeprägt') {
    if (eps <= (s.fy / s.E) * 100) return 'elastisch';
    if (eps <= s.sh_strain) return 'fliessplateau';
  } else {
    if (eps <= ((proportionalAnteil(s) * s.fy) / s.E) * 100) return 'elastisch';
    if (eps <= (s.fy / s.E) * 100 + 0.2) return 'fliessuebergang';
  }
  return eps <= s.fu_strain ? 'verfestigung' : 'einschnuerung';
}

/** Punktreihe für das Diagramm, streng aufsteigend in x; ausgeprägte Streckgrenze mit Spitze R_eH = 1,035·f_y */
export function stahlKennlinienPunkte(s: StahlKennlinie): { x: number; y: number }[] {
  const xSet = new Set<number>();
  const add = (x: number) => { if (x >= 0 && x <= s.A) xSet.add(Number(x.toFixed(3))); };
  add(0);
  const epsEl = (s.fy / s.E) * 100;
  const epsP02 = epsEl + 0.2;
  const epsProp = ((proportionalAnteil(s) * s.fy) / s.E) * 100;
  const elastischEnde = s.yieldType === 'ausgeprägt' ? s.sh_strain : epsP02;
  const fein = Math.min(s.A, elastischEnde + 0.3);
  for (let e = 0.02; e <= fein; e += 0.02) add(e);
  if (s.yieldType === 'ausgeprägt') { add(epsEl); add(epsEl + 0.015); add(epsEl + 0.04); add(s.sh_strain); }
  else { add(epsProp); add(epsP02); }
  const mitte = s.fu_strain > 15 ? 0.4 : 0.2;
  for (let e = fein; e <= s.fu_strain; e += mitte) add(e);
  add(s.fu_strain);
  const nach = (s.A - s.fu_strain) > 10 ? 0.5 : 0.25;
  for (let e = s.fu_strain + nach; e <= s.A; e += nach) add(e);
  add(s.A);
  return Array.from(xSet).sort((a, b) => a - b).map(x => {
    if (s.yieldType === 'ausgeprägt' && Math.abs(x - (epsEl + 0.015)) < 0.006) return { x, y: Number((s.fy * 1.035).toFixed(1)) };
    return { x, y: Number(stahlSpannungBeiDehnung(s, x).toFixed(1)) };
  });
}

// =============================================================================================
// Legierungen (nichtrostende Stähle, Lehrschema)
// =============================================================================================

export type Gefuegeklasse = 'unlegiert' | 'austenitisch' | 'austenitisch_mo' | 'duplex' | 'martensitisch' | 'ferritisch';

/** Wirksumme gegen Lochfraß PREN = Cr + 3,3·Mo (Massen-%, ohne den Stickstoffterm 16·N) */
export const pren = (cr: number, mo: number) => cr + 3.3 * mo;

/** Grobe Gefügeeinordnung nach Cr-, Ni-, Mo- und C-Gehalt in Massen-% (Reihenfolge der Abfragen wie im Modul) */
export function gefuegeklasse(cr: number, ni: number, mo: number, c: number): Gefuegeklasse {
  if (cr < 10.5) return 'unlegiert';
  if (ni >= 8) return mo >= 2 ? 'austenitisch_mo' : 'austenitisch';
  if (ni > 1 && cr >= 18) return 'duplex';
  if (c > 0.12 && ni < 2) return 'martensitisch';
  return 'ferritisch';
}

// =============================================================================================
// Beton und Betonstahl (DIN EN 1992-1-1 mit NA DE)
// =============================================================================================

export interface BetonSdParameter {
  fcd: number; fcm: number; Ecm: number;
  /** ‰ */
  ec2: number; ecu2: number; n: number; ec1: number; ecu1: number;
  /** Plastizitätszahl k nach Gl. (3.14) */
  k: number;
}

/** Parameter der Spannungs-Dehnungs-Linien nach Tab. 3.1 (f_ck in N/mm²) */
export function betonSdParameter(fck: number): BetonSdParameter {
  const fcd = fcdBeton(fck); // zentral, ab C55/67 · (1,1 − f_ck/500) (vorläufig, F-Freigabe)
  const fcm = fck + 8;
  const Ecm = 22000 * Math.pow(fcm / 10, 0.3);
  // Runde 5 (Z55): Klassenwerte aus Tab. 3.1, Zwischenwerte nach den Gleichungen der Tab. 3.1, über C90/105 gehalten
  // (vorher stiegen ε_cu2, ε_cu1 und n über f_ck = 90 wieder an, weil ((90 − f_ck)/100)^4 dort erneut wächst).
  const { ec1, ecu1, ec2, ecu2, n } = dehnungsKennwerte(fck);
  const k = (1.05 * Ecm * (ec1 / 1000)) / fcm;
  return { fcd, fcm, Ecm, ec2, ecu2, n, ec1, ecu1, k };
}

/** Parabel-Rechteck-Diagramm (Bemessung), ε in ‰; null jenseits ε_cu2 */
export function betonParabelRechteck(eps: number, p: BetonSdParameter): number | null {
  if (eps <= p.ec2) return p.fcd * (1 - Math.pow(1 - eps / p.ec2, p.n));
  if (eps <= p.ecu2) return p.fcd;
  return null;
}

/** Nichtlineare Linie für die Verformungsberechnung (Gl. 3.14), ε in ‰; null jenseits ε_cu1 */
export function betonNichtlinear(eps: number, p: BetonSdParameter): number | null {
  if (eps > p.ecu1) return null;
  const eta = eps / p.ec1;
  return p.fcm * ((p.k * eta - eta * eta) / (1 + (p.k - 2) * eta));
}

export interface BetonSdErgebnis {
  param: BetonSdParameter;
  /** ε = 0 … 5 ‰ in Schritten von 0,1 ‰ */
  punkte: { eps: number; bemessung: number | null; real: number | null }[];
  gueltig: boolean; hinweise: Hinweis[];
}

export function betonSdLinien(fck: number): BetonSdErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(fck), 'fck', 'f_ck muss eine endliche Zahl sein.');
  if (!hatFehler(hinweise)) muss(hinweise, fck > 0, 'fck', 'f_ck muss größer als 0 sein.');
  const param = betonSdParameter(hatFehler(hinweise) ? 30 : fck);
  if (hatFehler(hinweise)) return { param, punkte: [], gueltig: false, hinweise };
  // geändert: Schrittzählung über den Index statt aufsummierter 0,1 ‰
  const punkte: BetonSdErgebnis['punkte'] = [];
  for (let i = 0; i <= 50; i++) {
    const eps = i / 10;
    punkte.push({ eps, bemessung: betonParabelRechteck(eps, param), real: betonNichtlinear(eps, param) });
  }
  bereich(hinweise, 'fck', fck, 12, 90, fck > 90
    ? 'f_ck > 90 N/mm²: Tab. 3.1 der DIN EN 1992-1-1 reicht bis C90/105; ε_c2, ε_cu2 und n werden mit den Werten von C90/105 gehalten.'
    : 'Tab. 3.1 der DIN EN 1992-1-1 gilt für C12/15 bis C90/105; unterhalb sind die Parameter extrapoliert.');
  if (fck > 50 && fck <= 90) hinweise.push({ stufe: 'warnung', feld: 'fck', text: 'Hochfester Beton (f_ck > 50 N/mm²): ε_c2, ε_cu2 und n nach den Formeln der Tab. 3.1; die Linie wird spröder.' });
  return { param, punkte, gueltig: true, hinweise };
}

export type Betonstahlsorte = 'B500A' | 'B500B';

export interface BetonstahlParameter {
  E: number; fy: number; fu: number;
  /** (f_t/f_y)_k */
  k: number;
  /** ‰ */
  eu: number; ey: number; fyd: number; eyd: number; eud: number;
}

/** B500 nach DIN 488-1 / DIN EN 1992-1-1, 3.2.7 und Anhang C (NA DE): E_s = 200 000, ε_ud = 25 ‰ – Werte aus src/data/kennwerte.ts */
export function betonstahlParameter(sorte: Betonstahlsorte): BetonstahlParameter {
  const b = BETONSTAHL[sorte] ?? BETONSTAHL.B500B;
  const E = E_BETONSTAHL;
  const fy = b.fyk;
  const k = b.k;
  const fu = b.ftk;
  const eu = b.euk;
  const ey = (fy / E) * 1000;
  const fyd = fy / EC2_NA_DE.gammaS;
  const eyd = (fyd / E) * 1000;
  return { E, fy, fu, eu, ey, k, fyd, eyd, eud: 25 };
}

/** Charakteristische Linie (mit Verfestigung) und Bemessungslinie (horizontal), ε in ‰; null jenseits des Endpunkts */
export function betonstahlSpannung(eps: number, p: BetonstahlParameter): { char: number | null; bemessung: number | null } {
  const char = eps <= p.ey ? p.E * (eps / 1000) : eps <= p.eu ? p.fy + (p.fu - p.fy) * (eps - p.ey) / (p.eu - p.ey) : null;
  const bemessung = eps <= p.eyd ? p.E * (eps / 1000) : eps <= p.eud ? p.fyd : null;
  return { char, bemessung };
}

/** Punktreihe ε = 0 … 55 ‰ in Schritten von 0,5 ‰ */
export function betonstahlLinien(sorte: Betonstahlsorte): { param: BetonstahlParameter; punkte: { eps: number; char: number | null; bemessung: number | null }[] } {
  const param = betonstahlParameter(sorte);
  const punkte = [];
  for (let i = 0; i <= 110; i++) {
    const eps = i * 0.5;
    punkte.push({ eps, ...betonstahlSpannung(eps, param) });
  }
  return { param, punkte };
}

// =============================================================================================
// Kunststoffe – E-Modul über der Temperatur (Lehrmodell)
// =============================================================================================

export type Kunststofftyp = 'amorphous' | 'semicrystalline' | 'elastomer' | 'duroplast';

interface KunststoffModell {
  /** Glasübergangstemperatur und Steilheit des Übergangs */
  Tg: number; kTg: number;
  /** Modul im Glaszustand und im Plateau oberhalb T_g [MPa] */
  Eglas: number; Eplateau: number;
  /** optional: Fließ-/Schmelzbereich (T_f amorph, T_m teilkristallin) mit Steilheit */
  Tab?: number; kTab?: number;
}

/** Modellparameter wie im Modul (keine Werkstoffdaten eines bestimmten Produkts) */
export const KUNSTSTOFF_MODELLE: Readonly<Record<Kunststofftyp, KunststoffModell>> = {
  amorphous: { Tg: 100, kTg: 0.15, Eglas: 3000, Eplateau: 10, Tab: 150, kTab: 0.2 },
  semicrystalline: { Tg: 20, kTg: 0.1, Eglas: 3000, Eplateau: 300, Tab: 160, kTab: 0.5 },
  elastomer: { Tg: -40, kTg: 0.2, Eglas: 3000, Eplateau: 3 },
  duroplast: { Tg: 150, kTg: 0.1, Eglas: 4000, Eplateau: 800 },
};

/** Untergrenze für die logarithmische Darstellung [MPa] */
export const E_KUNSTSTOFF_MIN = 0.1;

/** E(T) = [E_P + (E_G − E_P)/(1 + e^(k_g·(T − T_g)))] / (1 + e^(k_f·(T − T_f))), mindestens 0,1 MPa */
export function emodulKunststoff(typ: Kunststofftyp, T: number): number {
  const m = KUNSTSTOFF_MODELLE[typ];
  let E = m.Eplateau + (m.Eglas - m.Eplateau) / (1 + Math.exp(m.kTg * (T - m.Tg)));
  if (m.Tab !== undefined && m.kTab !== undefined) E = E / (1 + Math.exp(m.kTab * (T - m.Tab)));
  return Math.max(E_KUNSTSTOFF_MIN, E);
}

export interface KunststoffErgebnis {
  E: number; modell: KunststoffModell;
  /** T = −100 … 300 °C in Schritten von 2 K */
  kurve: { T: number; E: number }[];
  /** erster Kurvenpunkt mit T_i ≥ T (−1, falls T > 300 °C) */
  index: number;
  gueltig: boolean; hinweise: Hinweis[];
}

export function kunststoffTemperatur(typ: Kunststofftyp, T: number): KunststoffErgebnis {
  const hinweise: Hinweis[] = [];
  const modell = KUNSTSTOFF_MODELLE[typ];
  muss(hinweise, !!modell, 'typ', 'Unbekannter Kunststofftyp.');
  muss(hinweise, istEndlich(T), 'T', 'Die Temperatur muss eine endliche Zahl sein.');
  if (hatFehler(hinweise)) return { E: 0, modell, kurve: [], index: -1, gueltig: false, hinweise };
  const kurve: KunststoffErgebnis['kurve'] = [];
  for (let t = -100; t <= 300; t += 2) kurve.push({ T: t, E: emodulKunststoff(typ, t) });
  const E = emodulKunststoff(typ, T);
  bereich(hinweise, 'T', T, -100, 300, 'Das Lehrmodell ist für −100 … 300 °C dargestellt.');
  if (modell.Tab !== undefined && T >= modell.Tab - 10) hinweise.push({ stufe: 'warnung', feld: 'T', text: `Nahe oder oberhalb ${formatDeZahl(modell.Tab, 0)} °C fließt bzw. schmilzt der Thermoplast – keine Tragfunktion.` });
  return { E, modell, kurve, index: kurve.findIndex(p => p.T >= T), gueltig: true, hinweise };
}

/** Wärmedehnung ΔL = L_0·α_T·ΔT (Einheit von ΔL wie L_0) */
export const waermedehnung = (L0: number, alphaT: number, deltaT: number) => L0 * alphaT * deltaT;

// =============================================================================================
// Materialmodelle: bilinear elasto-plastisch, qualitative Lehrkurven, Rheologie
// =============================================================================================

/** Spannung in N/mm² des bilinearen Modells (Belastungsast) bei der Dehnung ε (dimensionslos) */
export function bilinearSpannung(eps: number, fy: number, E: number, Et: number): number {
  const epsY = fy / E;
  return eps <= epsY ? eps * E : fy + (eps - epsY) * Et;
}

export interface BilinearEingabe {
  /** Fließgrenze, E-Modul und Verfestigungsmodul in N/mm² */
  fy: number;
  E: number;
  Et: number;
  /** größte aufgebrachte Dehnung in ‰ */
  epsMaxPromille: number;
}
export interface BilinearErgebnis {
  /** Fließdehnung, elastische Rückfederung und bleibende Dehnung in ‰ */
  epsYPromille: number;
  epsElastischPromille: number;
  epsPlastischPromille: number;
  /** Höchstspannung in N/mm² und Verhältnis k = σ_max/f_y */
  sigmaMax: number;
  k: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}
export function bilinearVerfestigung(e: BilinearEingabe): BilinearErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.fy, e.E, e.Et, e.epsMaxPromille) && e.fy > 0 && e.E > 0, 'eingabe', 'f_y und E müssen größer als 0 sein.');
  muss(h, e.Et >= 0 && e.epsMaxPromille >= 0, 'Et', 'Verfestigungsmodul und Dehnung müssen ≥ 0 sein.');
  if (e.Et >= e.E) h.push({ stufe: 'warnung', feld: 'Et', text: 'E_t ≥ E: Der Verfestigungsast ist nicht flacher als der elastische Ast.' });
  const epsMax = e.epsMaxPromille / 1000;
  const sigmaMax = bilinearSpannung(epsMax, e.fy, e.E, e.Et);
  const epsElastisch = sigmaMax / e.E;
  const epsPlastisch = Math.max(0, epsMax - epsElastisch);
  return {
    epsYPromille: (e.fy / e.E) * 1000,
    epsElastischPromille: epsElastisch * 1000,
    epsPlastischPromille: epsPlastisch * 1000,
    sigmaMax, k: sigmaMax / e.fy, gueltig: !hatFehler(h), hinweise: h,
  };
}

export interface BilinearPunkt {
  epsPromille: number;
  belastung: number;
  idealPlastisch: number;
  /** Entlastungsast von (ε_p; 0) bis (ε_max; σ_max), sonst null */
  entlastung: number | null;
}
/** Kurvenpunkte im Abstand 0,5 ‰ bis max(ε_max + 5 ‰; 25 ‰) */
export function bilinearKurve(e: BilinearEingabe): BilinearPunkt[] {
  const epsMax = e.epsMaxPromille / 1000;
  const sigmaMax = bilinearSpannung(epsMax, e.fy, e.E, e.Et);
  const epsRest = Math.max(0, epsMax - sigmaMax / e.E);
  const bis = Math.max(e.epsMaxPromille + 5, 25);
  const n = Number.isFinite(bis) ? Math.floor(bis / 0.5) + 1 : 0;
  return Array.from({ length: n }, (_, i) => {
    const ep = i * 0.5;
    const eps = ep / 1000;
    return {
      epsPromille: ep,
      belastung: bilinearSpannung(eps, e.fy, e.E, e.Et),
      idealPlastisch: Math.min(eps * e.E, e.fy),
      entlastung: eps >= epsRest && eps <= epsMax ? (eps - epsRest) * e.E : null,
    };
  });
}

export type Lehrmodell = 'linear' | 'non-linear' | 'ideal-plastic' | 'visco-elastic';
/** Parameter der qualitativen Lehrkurven: Baustahl E = 210 000 N/mm², f_y = 355 N/mm², ε₀ = 2 ‰, σ_∞ = 400 N/mm² */
export const LEHRKURVE = { E: 210000, fy: 355, eps0: 0.002, sigmaInf: 400 } as const;
/** Spannung der qualitativen Lehrkurve in N/mm² bei der Dehnung ε (dimensionslos) */
export function lehrkurveSpannung(modell: Lehrmodell, eps: number): number {
  const { E, fy, eps0, sigmaInf } = LEHRKURVE;
  if (modell === 'linear') return eps * E;
  if (modell === 'non-linear') return (E * eps) / (1 + Math.pow(eps / eps0, 2));
  if (modell === 'ideal-plastic') return Math.min(eps * E, fy);
  return sigmaInf * (1 - Math.exp(-(E * eps) / sigmaInf));
}
/** Lehrkurve von 0 bis 5 ‰ in Schritten von 0,1 ‰ (51 Punkte) */
export const lehrkurve = (modell: Lehrmodell) =>
  Array.from({ length: 51 }, (_, i) => ({ epsPromille: i * 0.1, sigma: lehrkurveSpannung(modell, i * 0.0001) }));

/** Viskosität in Pa·s der thixotropen bzw. rheopexen Lehrkurve nach t Sekunden konstanter Scherung */
export const thixotropie = (t: number) => 20 + 80 * Math.exp(-0.5 * t);
export const rheopexie = (t: number) => 100 - 80 * Math.exp(-0.5 * t);
/** Zeitverlauf 0 … 10 s in Schritten von 0,2 s (51 Punkte) */
export const thixotropieKurve = () =>
  Array.from({ length: 51 }, (_, i) => { const t = i * 0.2; return { t, thixo: thixotropie(t), rheo: rheopexie(t) }; });

/** Bingham-Fluid: Scherrate in s⁻¹ aus Schubspannung τ und Fließgrenze τ₀ in Pa, plastische Viskosität μ_p in Pa·s */
export function binghamScherrate(tau: number, tau0: number, muP: number): number {
  return tau > tau0 ? (tau - tau0) / muP : 0;
}
/** Spannung nach t bei Maxwell-Relaxation (σ₀, τ = η/E) */
export const maxwellSpannung = (sigma0: number, t: number, tau: number) => maxwellRelaxation(sigma0, t, tau);
/** Halbwertszeit der Maxwell-Relaxation t½ = τ·ln 2 */
export const maxwellHalbwertszeit = (tau: number) => tau * Math.LN2;
