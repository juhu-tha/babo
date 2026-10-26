/**
 * Holzbau nach DIN EN 1995-1-1 + NA (DE): k_mod, Knicknachweis (Ersatzstabverfahren 6.3.2) und Querdruck (6.1.5).
 * Vollholz (EN 338) und Brettschichtholz (EN 14080). Reiner Rechenkern – geprüft in tests/holzbau.test.ts.
 */
import { type Hinweis, bereich, hatFehler, istEndlich, muss } from './plausibilitaet';

export type Nutzungsklasse = 1 | 2 | 3;
export type KLED = 'stnd' | 'lg' | 'mtl' | 'krt' | 'sfs';

/** k_mod für Vollholz und Brettschichtholz nach Tab. 3.1 */
export const KMOD: Readonly<Record<Nutzungsklasse, Readonly<Record<KLED, number>>>> = {
  1: { stnd: 0.6, lg: 0.7, mtl: 0.8, krt: 0.9, sfs: 1.1 },
  2: { stnd: 0.6, lg: 0.7, mtl: 0.8, krt: 0.9, sfs: 1.1 },
  3: { stnd: 0.5, lg: 0.55, mtl: 0.65, krt: 0.7, sfs: 0.9 },
};
/** γ_M für Holz und Holzwerkstoffe nach NA DE (auch Brettschichtholz) */
export const GAMMA_M_HOLZ = 1.3;

import { EULER_BETA } from './stabilitaet';
export { EULER_BETA };

/** k_c nach (6.25)–(6.29); β_c = 0,2 Vollholz, 0,1 BSH */
export function knickbeiwert(lambdaRel: number, brettschichtholz: boolean): number {
  if (lambdaRel <= 0.3) return 1.0;
  const bc = brettschichtholz ? 0.1 : 0.2;
  const k = 0.5 * (1 + bc * (lambdaRel - 0.3) + lambdaRel * lambdaRel);
  return Math.min(1.0, 1 / (k + Math.sqrt(k * k - lambdaRel * lambdaRel)));
}

export interface DruckstabEingabe {
  b: number; h: number; // [mm]
  laenge: number;       // Systemlänge [m]
  eulerFall: 1 | 2 | 3 | 4;
  nEd: number;          // [kN]
  fc0k: number; E005: number; // [N/mm²]
  brettschichtholz: boolean;
  nkl: Nutzungsklasse; kled: KLED;
}

export interface DruckstabErgebnis {
  k_mod: number; gamma_M: number; f_c0d: number; E_05: number; A: number; iy: number; iz: number;
  l_ef: number; lambda_z: number; sigma_c_crit: number; lambda_rel_z: number; k_cz: number;
  F_c_R_d_kN: number; utilization: number; isUnsafe: boolean;
  hinweise: Hinweis[];
}

export function bemesseDruckstab(e: DruckstabEingabe): DruckstabErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.b, e.h, e.laenge, e.nEd, e.fc0k, e.E005), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.b > 0 && e.h > 0, 'b', 'Breite und Höhe müssen größer als 0 sein.');
    muss(hinweise, e.laenge > 0, 'laenge', 'Die Stablänge muss größer als 0 sein.');
    muss(hinweise, e.nEd >= 0, 'nEd', 'N_Ed ist der Betrag der Druckkraft und muss ≥ 0 sein.');
    muss(hinweise, e.fc0k > 0 && e.E005 > 0, 'fc0k', 'Festigkeit und E-Modul müssen größer als 0 sein.');
  }
  const leer: DruckstabErgebnis = {
    k_mod: 0, gamma_M: GAMMA_M_HOLZ, f_c0d: 0, E_05: 0, A: 0, iy: 0, iz: 0, l_ef: 0, lambda_z: 0, sigma_c_crit: 0, lambda_rel_z: 0,
    k_cz: 0, F_c_R_d_kN: 0, utilization: 0, isUnsafe: false, hinweise,
  };
  if (hatFehler(hinweise)) return leer;

  const k_mod = KMOD[e.nkl][e.kled];
  const f_c0d = (k_mod * e.fc0k) / GAMMA_M_HOLZ;
  const A = e.b * e.h;
  const iy = e.h / Math.sqrt(12), iz = e.b / Math.sqrt(12);
  const l_ef = e.laenge * 1000 * EULER_BETA[e.eulerFall];
  const lambda_z = l_ef / Math.min(iy, iz);
  const sigma_c_crit = (Math.PI ** 2 * e.E005) / lambda_z ** 2;
  const lambda_rel_z = Math.sqrt(e.fc0k / sigma_c_crit); // (6.21)/(6.22)
  const k_cz = knickbeiwert(lambda_rel_z, e.brettschichtholz);
  const F_c_R_d_kN = (k_cz * A * f_c0d) / 1000;
  const utilization = (e.nEd / F_c_R_d_kN) * 100;

  bereich(hinweise, 'laenge', lambda_z, 0, 200, 'Schlankheit λ > 200: Für Druckstäbe außergewöhnlich schlank; Ausführung und Imperfektionen gesondert prüfen.');
  if (lambda_rel_z > 0.3) hinweise.push({ stufe: 'warnung', feld: 'info', text: 'Nachgewiesen wird nur zentrischer Druck um die schwache Achse; Biegung aus Exzentrizität oder Querlast und Kippen sind nicht enthalten.' });
  return { k_mod, gamma_M: GAMMA_M_HOLZ, f_c0d, E_05: e.E005, A, iy, iz, l_ef, lambda_z, sigma_c_crit, lambda_rel_z, k_cz, F_c_R_d_kN, utilization, isUnsafe: utilization > 100, hinweise };
}

export type Querdruckfall = 'schwelle' | 'pfosten_riegel' | 'traeger_ende' | 'clt_plate';

export interface QuerdruckEingabe {
  F: number;  // F_c,90,d [kN]
  b: number;  // Auflagerbreite [mm]
  l: number;  // Auflagerlänge [mm]
  fall: Querdruckfall;
  ueberstand: boolean;
  fc90k: number;
  art: 'nadelvollholz' | 'bsh' | 'laubholz';
  nkl: Nutzungsklasse; kled: KLED;
}

export function bemesseQuerdruck(e: QuerdruckEingabe) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.F, e.b, e.l, e.fc90k) && e.b > 0 && e.l > 0 && e.fc90k > 0, 'b', 'Auflagerbreite, Auflagerlänge und f_c,90,k müssen größer als 0 sein.');
  muss(hinweise, e.F >= 0, 'F', 'Die Auflagerkraft muss ≥ 0 sein.');
  if (hatFehler(hinweise)) {
    return { f_c90k: e.fc90k, f_c90d: 0, k_c90: 1, l_ef: 0, A_ef: 0, sigma_c90d: 0, stressLimit: 0, F_c90Rd_kN: 0, utilization: 0, gamma_M: GAMMA_M_HOLZ, isUnsafe: false, hinweise };
  }
  const k_mod = KMOD[e.nkl][e.kled];
  const f_c90d = (k_mod * e.fc90k) / GAMMA_M_HOLZ;
  // 6.1.5: k_c,90 = 1,25 (Nadelvollholz) / 1,5 (BSH) bei durchgehender Lagerung; 1,5 / 1,75 bei Einzelauflager mit l1 ≥ 2h und l ≤ 400 mm
  const k_c90 = e.fall === 'schwelle' ? (e.art === 'bsh' ? 1.5 : e.art === 'nadelvollholz' ? 1.25 : 1.0)
    : e.fall === 'pfosten_riegel' ? (e.art === 'bsh' ? 1.75 : e.art === 'nadelvollholz' ? 1.5 : 1.0) : 1.0;
  // wirksame Kontaktlänge: je Seite + 30 mm, höchstens um a, l oder l1/2 (hier: 30 mm je überstehender Seite)
  const l_ef = e.l + (e.ueberstand ? (e.fall === 'traeger_ende' ? 30 : 60) : 0);
  const A_ef = e.b * l_ef;
  const sigma_c90d = (e.F * 1000) / A_ef;
  const stressLimit = k_c90 * f_c90d;
  if (e.fall === 'pfosten_riegel' && e.l > 400) hinweise.push({ stufe: 'warnung', feld: 'l', text: 'k_c,90 = 1,5/1,75 gilt nur für Auflagerlängen l ≤ 400 mm.' });
  return {
    f_c90k: e.fc90k, f_c90d, k_c90, l_ef, A_ef, sigma_c90d, stressLimit, F_c90Rd_kN: (stressLimit * A_ef) / 1000,
    utilization: (sigma_c90d / stressLimit) * 100, gamma_M: GAMMA_M_HOLZ, isUnsafe: sigma_c90d > stressLimit, hinweise,
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Ergänzungen AP 4.2 (Runde 3): Bemessungswerte, Druck unter Winkel, k_def, Einfeldbalken und verformter Druckstab
// ---------------------------------------------------------------------------------------------------------------

/** Klartext der Lasteinwirkungsdauer (Auswahlfelder der Module) → KLED-Schlüssel */
export const KLED_NAME: Readonly<Record<string, KLED>> = { 'ständig': 'stnd', lang: 'lg', mittel: 'mtl', kurz: 'krt', 'sehr kurz': 'sfs' };

/** Bemessungswert einer Festigkeit nach (2.14): X_d = k_mod · X_k / γ_M */
export function bemessungswert(Xk: number, kmod: number, gammaM: number = GAMMA_M_HOLZ): number {
  return (kmod * Xk) / gammaM;
}

/** Druckfestigkeit unter dem Winkel α zur Faser nach (6.16): f_c,α,d = f_c,0,d / (f_c,0,d/(k_c,90 · f_c,90,d) · sin²α + cos²α) */
export function druckUnterWinkel(fc0d: number, fc90d: number, kc90: number, alphaGrad: number): number {
  const a = (alphaGrad * Math.PI) / 180;
  return fc0d / ((fc0d / (kc90 * fc90d)) * Math.sin(a) ** 2 + Math.cos(a) ** 2);
}

export interface FestigkeitswerteEingabe {
  fm: number; ft0: number; ft90: number; fc0: number; fc90: number; fv: number; // charakteristisch [N/mm²]
  gammaM: number; nkl: Nutzungsklasse; kled: KLED;
  kc90: number; winkel: number; // α [°]
}

/** Bemessungswerte aller Festigkeiten und Verlauf f_c,α,d über α = 0 … 90° (Schritt 5°) */
export function festigkeitswerte(e: FestigkeitswerteEingabe) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.fm, e.ft0, e.ft90, e.fc0, e.fc90, e.fv, e.gammaM, e.kc90, e.winkel), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, [e.fm, e.ft0, e.ft90, e.fc0, e.fc90, e.fv].every(x => x > 0), 'f', 'Die charakteristischen Festigkeiten müssen größer als 0 sein.');
    muss(hinweise, e.gammaM > 0, 'gammaM', 'γ_M muss größer als 0 sein.');
    muss(hinweise, e.kc90 >= 1 && e.kc90 <= 1.75, 'kc90', 'k_c,90 liegt nach 6.1.5 zwischen 1,0 und 1,75.');
    muss(hinweise, e.winkel >= 0 && e.winkel <= 90, 'winkel', 'Der Faserwinkel muss zwischen 0° und 90° liegen.');
  }
  const kmod = KMOD[e.nkl][e.kled];
  if (hatFehler(hinweise)) {
    return { kmod, fmd: 0, ft0d: 0, ft90d: 0, fc0d: 0, fc90d: 0, fvd: 0, fcad: 0, kurve: [] as { winkel: number; fcad: number }[], hinweise };
  }
  const d = (x: number) => bemessungswert(x, kmod, e.gammaM);
  const fc0d = d(e.fc0), fc90d = d(e.fc90);
  const kurve: { winkel: number; fcad: number }[] = [];
  for (let w = 0; w <= 90; w += 5) kurve.push({ winkel: w, fcad: druckUnterWinkel(fc0d, fc90d, e.kc90, w) });
  return {
    kmod, fmd: d(e.fm), ft0d: d(e.ft0), ft90d: d(e.ft90), fc0d, fc90d, fvd: d(e.fv),
    fcad: druckUnterWinkel(fc0d, fc90d, e.kc90, e.winkel), kurve, hinweise,
  };
}

export type KdefProdukt = 'vollholz' | 'bsh' | 'fsh' | 'osb';
/**
 * Verformungsbeiwert k_def nach DIN EN 1995-1-1, Tab. 3.2 (Vollholz EN 14081-1, BSH EN 14080, FSH EN 14374,
 * OSB/3 und OSB/4 nach EN 300). null: in dieser Nutzungsklasse nicht verwendbar.
 */
export const KDEF: Readonly<Record<KdefProdukt, Readonly<Record<Nutzungsklasse, number | null>>>> = {
  vollholz: { 1: 0.6, 2: 0.8, 3: 2.0 },
  bsh: { 1: 0.6, 2: 0.8, 3: 2.0 },
  fsh: { 1: 0.6, 2: 0.8, 3: 2.0 },
  osb: { 1: 1.5, 2: 2.25, 3: null },
};

/** k_def aus dem Anzeigenamen eines Holzprodukts (enthält „BSH“, „OSB“ oder „FSH“, sonst Vollholz) */
export function kdefFuer(name: string, nkl: Nutzungsklasse): number | null {
  const p: KdefProdukt = name.includes('BSH') ? 'bsh' : name.includes('OSB') ? 'osb' : name.includes('FSH') ? 'fsh' : 'vollholz';
  return KDEF[p][nkl];
}

/** Teilsicherheitsbeiwerte der Einwirkungen nach DIN EN 1990 mit NA (DE), ständig bzw. veränderlich, ungünstig */
export const GAMMA_G = 1.35;
export const GAMMA_Q = 1.5;
/** Gewichtskraft in kN je kg Masse */
const G_KN_PRO_KG = 0.00981;

/** Rissfaktor k_cr nach 6.1.7 mit NA (DE): 2,0/f_v,k (Vollholz), 2,5/f_v,k (BSH), höchstens 1 */
export function rissfaktor(fvk: number, brettschichtholz: boolean): number {
  return Math.min(1, (brettschichtholz ? 2.5 : 2.0) / fvk);
}

export interface EinfeldbalkenEingabe {
  l: number;       // Stützweite [m]
  abstand: number; // Balkenabstand [m]
  qk: number;      // Flächenlast Ausbau + Nutzlast [kN/m²]
  b: number; h: number; // [mm]
  fmk: number; fvk: number; E0mean: number; // [N/mm²]
  rhoMean: number; // [kg/m³]
  brettschichtholz: boolean;
  kmod: number; gammaM: number;
}

/**
 * Einfeldbalken unter Gleichlast: Biegung (6.11), Schub mit k_cr (6.13) und elastische Anfangsdurchbiegung
 * w_inst ≤ l/300 mit der charakteristischen Kombination g_k + q_k und E_0,mean.
 */
export function bemesseEinfeldbalken(e: EinfeldbalkenEingabe) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.l, e.abstand, e.qk, e.b, e.h, e.fmk, e.fvk, e.E0mean, e.rhoMean, e.kmod, e.gammaM), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.l > 0 && e.abstand > 0, 'l', 'Stützweite und Balkenabstand müssen größer als 0 sein.');
    muss(hinweise, e.qk >= 0, 'qk', 'Die Flächenlast muss ≥ 0 sein.');
    muss(hinweise, e.b > 0 && e.h > 0, 'b', 'Breite und Höhe müssen größer als 0 sein.');
    muss(hinweise, e.fmk > 0 && e.fvk > 0 && e.E0mean > 0 && e.rhoMean > 0, 'fmk', 'Festigkeiten, E-Modul und Rohdichte müssen größer als 0 sein.');
    muss(hinweise, e.kmod > 0 && e.gammaM > 0, 'kmod', 'k_mod und γ_M müssen größer als 0 sein.');
  }
  const leer = {
    masse: 0, g_k: 0, q_k: 0, q_d: 0, q_inst: 0, M_Ed: 0, V_Ed: 0, W: 0, I: 0, sigma_md: 0, f_md: 0, k_cr: 0, tau_d: 0, f_vd: 0,
    w_inst: 0, w_grenz: 0, eta_m: 0, eta_v: 0, eta_w: 0, eta_max: 0, ok: false, hinweise,
  };
  if (hatFehler(hinweise)) return leer;

  const masse = ((e.b * e.h) / 1e6) * e.rhoMean;  // [kg/m]
  const g_k = masse * G_KN_PRO_KG;                 // [kN/m]
  const q_k = e.qk * e.abstand;                    // [kN/m]
  const q_d = GAMMA_G * g_k + GAMMA_Q * q_k;
  const q_inst = g_k + q_k;
  const M_Ed = (q_d * e.l ** 2) / 8;               // [kNm]
  const V_Ed = (q_d * e.l) / 2;                    // [kN]
  const W = (e.b * e.h ** 2) / 6, I = (e.b * e.h ** 3) / 12;
  const sigma_md = (M_Ed * 1e6) / W;
  const f_md = bemessungswert(e.fmk, e.kmod, e.gammaM);
  const k_cr = rissfaktor(e.fvk, e.brettschichtholz);
  const tau_d = (1.5 * V_Ed * 1000) / (k_cr * e.b * e.h);
  const f_vd = bemessungswert(e.fvk, e.kmod, e.gammaM);
  const lmm = e.l * 1000;
  const w_inst = (5 * q_inst * lmm ** 4) / (384 * e.E0mean * I); // q in kN/m = N/mm
  const w_grenz = lmm / 300;
  const eta_m = (sigma_md / f_md) * 100, eta_v = (tau_d / f_vd) * 100, eta_w = (w_inst / w_grenz) * 100;
  const eta_max = Math.max(eta_m, eta_v, eta_w);
  bereich(hinweise, 'h', e.h / e.b, 0, 10, 'Verhältnis h/b > 10: Kippen (6.3.3) und seitliche Halterung gesondert prüfen.');
  return { masse, g_k, q_k, q_d, q_inst, M_Ed, V_Ed, W, I, sigma_md, f_md, k_cr, tau_d, f_vd, w_inst, w_grenz, eta_m, eta_v, eta_w, eta_max, ok: eta_max <= 100, hinweise };
}

export interface VerformterStabEingabe {
  b: number; h: number; l: number; // [mm]
  nd: number;  // Bemessungsnormalkraft (Druck) [kN]
  qd: number;  // Bemessungsquerlast [kN/m]
  e0: number;  // gemessene Vorverformung (Stich) [mm]
  fmk: number; fc0k: number; E0mean: number; // [N/mm²]
  kmod: number; gammaM: number;
}

/**
 * Verformter Druck-Biege-Stab (z. B. Sparren im Bestand): Moment aus Querlast und gemessener Ausmitte e₀,
 * vergrößert mit α_cr/(α_cr − 1) (Theorie II. Ordnung, Näherung mit N_cr = π²·E_0,mean·I/l²), lineare Interaktion
 * σ_c,d/f_c,0,d + σ_m,d/f_m,d. Vergleich mit dem idealisiert geraden Stab (e₀ = 0).
 */
export function verformterDruckstab(e: VerformterStabEingabe) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.b, e.h, e.l, e.nd, e.qd, e.e0, e.fmk, e.fc0k, e.E0mean, e.kmod, e.gammaM), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.b > 0 && e.h > 0 && e.l > 0, 'b', 'Breite, Höhe und Länge müssen größer als 0 sein.');
    muss(hinweise, e.nd >= 0 && e.qd >= 0 && e.e0 >= 0, 'nd', 'Normalkraft, Querlast und Vorverformung müssen ≥ 0 sein.');
    muss(hinweise, e.fmk > 0 && e.fc0k > 0 && e.E0mean > 0 && e.kmod > 0 && e.gammaM > 0, 'fmk', 'Festigkeiten, E-Modul, k_mod und γ_M müssen größer als 0 sein.');
  }
  const f_md = hatFehler(hinweise) ? 0 : bemessungswert(e.fmk, e.kmod, e.gammaM);
  const f_c0d = hatFehler(hinweise) ? 0 : bemessungswert(e.fc0k, e.kmod, e.gammaM);
  const leer = {
    A: 0, W: 0, I: 0, f_md, f_c0d, sigma_c_d: 0, sigma_m_d_primary: 0, sigma_m_d_eccentric: 0, sigma_m_d_total: 0,
    N_crit_kN: 0, magFactor: 0, limitRatio: 0, limitRatioIdeal: 0, unsafeRatioDelta: 0, gueltig: false, hinweise,
  };
  if (hatFehler(hinweise)) return leer;

  const N = e.nd * 1000;  // [N]
  const q = e.qd;         // kN/m = N/mm
  const A = e.b * e.h, W = (e.b * e.h ** 2) / 6, I = (e.b * e.h ** 3) / 12;
  const M_q = (q * e.l ** 2) / 8;  // [Nmm]
  const M_e = N * e.e0;            // [Nmm]
  const N_crit = (Math.PI ** 2 * e.E0mean * I) / e.l ** 2;
  if (N >= N_crit) {
    hinweise.push({ stufe: 'fehler', feld: 'nd', text: 'Die Normalkraft erreicht die Euler-Knicklast N_cr – nach Theorie II. Ordnung ist kein Gleichgewicht möglich (Stab instabil).' });
    return { ...leer, A, W, I, N_crit_kN: N_crit / 1000 };
  }
  const magFactor = 1 / (1 - N / N_crit); // = α_cr/(α_cr − 1); N = 0 → 1
  const sigma_c_d = N / A;
  const sigma_m_d_total = ((M_q + M_e) * magFactor) / W;
  const limitRatio = sigma_c_d / f_c0d + sigma_m_d_total / f_md;
  const limitRatioIdeal = sigma_c_d / f_c0d + (M_q * magFactor) / W / f_md;
  if (N / N_crit > 0.5) hinweise.push({ stufe: 'warnung', feld: 'nd', text: 'N_d liegt über der Hälfte der Euler-Knicklast; der Vergrößerungsfaktor reagiert dann sehr empfindlich auf E-Modul und Knicklänge.' });
  return {
    A, W, I, f_md, f_c0d, sigma_c_d, sigma_m_d_primary: M_q / W, sigma_m_d_eccentric: M_e / W, sigma_m_d_total,
    N_crit_kN: N_crit / 1000, magFactor, limitRatio: limitRatio * 100, limitRatioIdeal: limitRatioIdeal * 100,
    unsafeRatioDelta: (limitRatio - limitRatioIdeal) * 100, gueltig: true, hinweise,
  };
}
