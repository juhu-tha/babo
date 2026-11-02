// schadensKern.ts — Rechenkern für das BaustoffBoard-Modul „Mängel & Schäden"
// Normbezug: DIN EN 1992-1-1, 7.3.4 (Rissbreite, NA(DE) beachten); DIN 1076:2026-01 (ersetzt 1999-11) + RI-EBW-PRÜF;
// VDI 6200:2010-02 (Tab. Überprüfungsintervalle); DIN EN 12504-1/-4; DIN EN 13791:2020-02 (EN 13791:2019);
// DIN EN 1542; DIN EN ISO 12570; DIN EN 14629; RILEM TC 154-EMC (Wenner).
// Alle Funktionen: SI-nahe Baupraxiseinheiten (mm, N/mm², kN, K), in den Kommentaren angegeben.

// ---------- 1) Rissbreite nach EC2 7.3.4 (Grundgleichung 7.8 ohne β!) ----------
export interface CrackInput {
  sigmaS: number;   // Stahlspannung im Riss [N/mm²]
  fctEff: number;   // wirksame Zugfestigkeit [N/mm²] (i. d. R. fctm)
  rhoPEff: number;  // As/Ac,eff [-]
  phi: number;      // Stabdurchmesser [mm]
  c: number;        // Betondeckung [mm]
  Es?: number;      // [N/mm²]
  Ecm: number;      // [N/mm²]
  kt?: number;      // 0,6 Kurzzeit / 0,4 Langzeit
  k1?: number;      // 0,8 Rippenstahl
  k2?: number;      // 0,5 Biegung / 1,0 zentrischer Zug
}
export function crackWidthEC2(i: CrackInput) {
  const Es = i.Es ?? 200000, kt = i.kt ?? 0.4, k1 = i.k1 ?? 0.8, k2 = i.k2 ?? 0.5;
  const alphaE = Es / i.Ecm;
  const dEps = Math.max(
    (i.sigmaS - (kt * i.fctEff / i.rhoPEff) * (1 + alphaE * i.rhoPEff)) / Es,
    (0.6 * i.sigmaS) / Es,
  );                                                                    // Gl. 7.9
  const srMax = 3.4 * i.c + 0.425 * k1 * k2 * i.phi / i.rhoPEff;         // Gl. 7.11 (Empfehlungswerte k3=3,4, k4=0,425; NA(DE) abweichend!)
  return { dEps, srMax, wk: srMax * dEps };                              // Gl. 7.8
}

// ---------- 2) Spaltströmung (Rissinjektion / Wasserdurchtritt) ----------
/** Laminare Strömung im ebenen Spalt (Poiseuille): Q = w³·b·Δp / (12·η·L). w,b,L in m; Δp in Pa; η in Pa·s → Q in m³/s. */
export const slitFlow = (w: number, b: number, dp: number, eta: number, L: number) => (w ** 3 * b * dp) / (12 * eta * L);

// ---------- 3) Thermische Rissatmung / Fugenbreite ----------
/** Längenänderung ΔL = α·L·ΔT [mm], α in 1/K, L in mm. */
export const deltaL = (alpha: number, L_mm: number, dT: number) => alpha * L_mm * dT;
/** Erforderliche Fugenbreite b ≥ ΔL / ZGV (ZGV als Anteil, z. B. 0,25) – ohne Herstell-/Montagetoleranzen. */
export const jointWidth = (dL_mm: number, zgv: number) => dL_mm / zgv;

// ---------- 4) ZfP ----------
/** Dynamischer E-Modul aus Ultraschall-Longitudinalwellengeschwindigkeit (unendlich ausgedehntes Medium):
 *  E_dyn = ρ·v²·(1+ν)(1−2ν)/(1−ν). ρ [kg/m³], v [m/s] → E [N/mm²]. Hinweis: E_dyn > E_stat (Beton ca. +10…20 %). */
export const eDynUltrasound = (rho: number, v: number, nu = 0.2) => (rho * v * v * (1 + nu) * (1 - 2 * nu)) / (1 - nu) / 1e6;
/** Wenner-Vierpunkt: ρ = 2π·a·U/I (halbunendlicher homogener Körper). a [m], U [V], I [A] → Ω·m. */
export const wennerResistivity = (a: number, U: number, I: number) => (2 * Math.PI * a * U) / I;
/** Karbonatisierung, √t-Gesetz: k = d/√t; Prognose d(t) = k·√t. d in mm, t in Jahren. */
export const carbonationK = (d_mm: number, t_a: number) => d_mm / Math.sqrt(t_a);
export const carbonationDepth = (k: number, t_a: number) => k * Math.sqrt(t_a);
/** Zeit bis Karbonatisierungsfront die Betondeckung c erreicht: t = (c/k)². */
export const timeToDepassivation = (c_mm: number, k: number) => (c_mm / k) ** 2;
/** Korrosionsrate aus Korrosionsstromdichte (Fe, Faraday): 1 µA/cm² ≈ 11,6 µm/a. */
export const corrosionRate_um_a = (icorr_uA_cm2: number) => icorr_uA_cm2 * 11.6;

// ---------- 5) Bohrkern / In-situ-Festigkeit (DIN EN 12504-1, DIN EN 13791:2020-02) ----------
/** Druckfestigkeit eines Kerns f = 4F/(π·D²). F in kN, D in mm → N/mm². Kein Schlankheitsfaktor eingerechnet. */
export const coreStrength = (F_kN: number, D_mm: number) => (4 * F_kN * 1000) / (Math.PI * D_mm * D_mm);
/** EN 13791:2019, 8.1 (n ≥ 8): f_ck,is = min(f_m − k_n·s ; f_lowest + M). k_n und M nach Norm-Tabellen. */
const KN_13791: [number, number][] = [[8, 2.0], [10, 1.92], [12, 1.87], [16, 1.81], [20, 1.76], [30, 1.73], [Infinity, 1.64]];
/**
 * k_n zwischen den Stützstellen linear in 1/n (Runde 5, wie src/calc/statistik.ts): Die Tabellenwerte folgen
 * k_n = t_(n−1; 0,95)·√(1 + 1/n) (DIN EN 1990, D7.2, V_X unbekannt); die Student-Quantile verlaufen nahezu linear in 1/n,
 * daher bildet die Interpolation in 1/n die Formel genauer ab als eine Interpolation in n und läuft für n → ∞ gegen 1,64.
 */
export function kn13791(n: number) {
  if (!(n >= 8)) return NaN; // für n < 8 sieht die Norm ein gesondertes, konservativeres Verfahren vor
  const inv = (x: number) => (Number.isFinite(x) ? 1 / x : 0);
  for (let i = 0; i < KN_13791.length - 1; i++) {
    const [a, ka] = KN_13791[i], [b, kb] = KN_13791[i + 1];
    if (n === a) return ka;
    if (n > a && n <= b) return ka + ((kb - ka) * (inv(a) - inv(n))) / (inv(a) - inv(b));
  }
  return 1.64;
}
export const margin13791 = (fLowest: number) => (fLowest >= 20 ? 4 : fLowest >= 16 ? 3 : fLowest >= 12 ? 2 : 1);
export function fckIs13791(values: number[]) {
  const n = values.length, m = values.reduce((a, b) => a + b, 0) / n;
  const s = Math.sqrt(values.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1));
  const low = Math.min(...values), k = kn13791(n);
  const fck = Math.min(m - k * s, low + margin13791(low));
  return { n, mean: m, s, kn: k, lowest: low, fckIs: fck, valid: Number.isFinite(k) };
}
/** Zuordnung In-situ → Druckfestigkeitsklasse: f_ck,is ≥ 0,85·f_ck(Klasse) (EN 13791, Tab. 1). Das ist NICHT α_cc aus EC2. */
export const fckEquivalent = (fckIs: number) => fckIs / 0.85;

// ---------- 6) Haftzug, Darrfeuchte, Chlorid ----------
/** Abreißfestigkeit f = 4F/(π·d²). F in kN, d in mm → N/mm². */
export const pullOff = (F_kN: number, d_mm: number) => (4 * F_kN * 1000) / (Math.PI * d_mm * d_mm);
/** Massebezogener Feuchtegehalt u = (m_f − m_t)/m_t · 100 [M.-%]. */
export const darrMoisture = (mWet: number, mDry: number) => ((mWet - mDry) / mDry) * 100;
/** Chlorid bezogen auf Zement aus potentiometrischer Titration:
 *  Cl [M.-% v. Beton] = V·c·M_Cl / m · 100; bez. Zement = Cl_Beton / z (z = Zementmasseanteil des Betons, z. B. 320/2350 ≈ 0,136). V in l, c in mol/l, m in g. */
export function chlorideByCement(V_l: number, c_molL: number, m_g: number, z: number) {
  const clConcrete = ((V_l * c_molL * 35.45) / m_g) * 100;
  return { clConcrete, clCement: clConcrete / z };
}

// ---------- 7) Holz: Restquerschnitt ----------
/** Biegetragfähigkeit ∝ W = b·h²/6 (2. Potenz der Höhe), Steifigkeit ∝ I = b·h³/12 (3. Potenz). */
export const bendingRatio = (b: number, h: number, bEff: number, hEff: number) => (bEff * hEff ** 2) / (b * h ** 2);
export const stiffnessRatio = (b: number, h: number, bEff: number, hEff: number) => (bEff * hEff ** 3) / (b * h ** 3);

// ---------- 8) Bauwerksprüfung: DIN 1076 / RI-EBW-PRÜF / VDI 6200 ----------
export type Din1076Art = 'H' | 'E' | 'B';
/** Regelprüfplan DIN 1076 ab Jahr der Hauptprüfung: H alle 6 Jahre, E 3 Jahre nach H, Besichtigung jährlich in den übrigen Jahren;
 *  zusätzlich laufende Beobachtung (i. d. R. zweimal jährlich) und anlassbezogene Sonderprüfungen. */
export function din1076Plan(startH: number, years = 12): { year: number; art: Din1076Art }[] {
  const out: { year: number; art: Din1076Art }[] = [];
  // Grenzfallprüfung 02.11.2026: ungültiger Zeitraum → leerer Plan (vorher Endlosschleife)
  if (!Number.isInteger(startH) || !Number.isInteger(years) || years < 0 || years > 10_000) return out;
  for (let y = startH; y < startH + years; y++) {
    const d = (y - startH) % 6;
    out.push({ year: y, art: d === 0 ? 'H' : d === 3 ? 'E' : 'B' });
  }
  return out;
}
/** Notenbereiche RI-EBW-PRÜF (Bauwerks-/Teilbauwerksnote). */
export function riebwClass(z: number) {
  if (!(z >= 1 && z <= 4)) return 'ungültig'; // Grenzfallprüfung 02.11.2026: NaN vorher „ungenügend“
  if (z < 1.5) return 'sehr guter Bauwerkszustand';
  if (z < 2.0) return 'guter Bauwerkszustand';
  if (z < 2.5) return 'befriedigender Bauwerkszustand';
  if (z < 3.0) return 'ausreichender Bauwerkszustand';
  if (z < 3.5) return 'nicht ausreichender Bauwerkszustand';
  return 'ungenügender Bauwerkszustand';
}
/** VDI 6200:2010-02, Tab. 3 – Anhaltswerte der Überprüfungsintervalle [Jahre] je Schadensfolgeklasse (null = nach Erfordernis). */
export const VDI6200_INTERVALLE = {
  CC1: { begehung: [3, 5], inspektion: null, eingehend: null },   // z. B. EFH/MFH, landwirtschaftl. Gebäude
  CC2: { begehung: [2, 3], inspektion: [4, 5], eingehend: [12, 15] }, // z. B. Büro, Schulen, Krankenhäuser, Sporthallen, Bauwerke > 60 m, Balkone, vorgehängte Fassaden
  CC3: { begehung: [1, 2], inspektion: [2, 3], eingehend: [6, 9] },   // z. B. Versammlungsstätten > 5000 Pers., Stadien, Kongresshallen
} as const;
/** VDI 6200, Abschn. 4.2: Robustheitsklassen RC 1 (statisch bestimmt, spröde) … RC 4 (Robustheit für Alternativszenarien nachgewiesen). */
export const VDI6200_RC = ['RC1', 'RC2', 'RC3', 'RC4'] as const;
