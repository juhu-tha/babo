/**
 * Holzbau nach DIN EN 1995-1-1 + NA (DE): k_mod, Knicknachweis (Ersatzstabverfahren 6.3.2) und Querdruck (6.1.5).
 * Vollholz (EN 338) und Brettschichtholz (EN 14080). Reiner Rechenkern – geprüft in tests/holzbau.test.ts.
 */
import { type Hinweis, bereich, hatFehler, istEndlich, muss, nurGueltig } from './plausibilitaet';
import { formatDeZahl } from '../utils/numberFormat';

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

/** Imperfektionsbeiwert β_c nach (6.29): 0,2 Vollholz, 0,1 Brettschichtholz und Furnierschichtholz */
export const BETA_C = { vollholz: 0.2, bsh: 0.1 } as const;

/** k_c nach (6.25)–(6.29); β_c nach BETA_C */
export function knickbeiwert(lambdaRel: number, brettschichtholz: boolean): number {
  if (lambdaRel <= 0.3) return 1.0;
  const bc = brettschichtholz ? BETA_C.bsh : BETA_C.vollholz;
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
  // Grenzfallprüfung 02.11.2026: unbekannte Nutzungsklasse vorher Ausnahme; ungültige Eingabe ohne Zahlenergebnis (vorher 0)
  muss(hinweise, KMOD[e.nkl]?.[e.kled] !== undefined, 'nkl', 'Nutzungsklasse 1 bis 3 und eine Klasse der Lasteinwirkungsdauer wählen.');
  if (hatFehler(hinweise)) return nurGueltig(leer);

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

  // H-2 (28.10.2026): EN 1995-1-1 und NA DE nennen keine Grenzschlankheit für Druckstäbe; λ > 200 ist nur ein Lehrhinweis (keine Normgröße).
  bereich(hinweise, 'laenge', lambda_z, 0, 200, 'Schlankheit λ > 200: Für Druckstäbe außergewöhnlich schlank; Ausführung und Imperfektionen gesondert prüfen.');
  if (lambda_rel_z > 0.3) hinweise.push({ stufe: 'warnung', feld: 'info', text: 'Nachgewiesen wird nur zentrischer Druck um die schwache Achse; Biegung aus Exzentrizität oder Querlast und Kippen sind nicht enthalten.' });
  return nurGueltig({ k_mod, gamma_M: GAMMA_M_HOLZ, f_c0d, E_05: e.E005, A, iy, iz, l_ef, lambda_z, sigma_c_crit, lambda_rel_z, k_cz, F_c_R_d_kN, utilization, isUnsafe: utilization > 100, hinweise });
}

/**
 * Querdruckfälle nach DIN EN 1995-1-1 (A1), 6.1.5: schwelle = durchgehende Lagerung; pfosten_riegel = Einzelauflager
 * (Zwischenauflager, Kontaktlänge beidseitig verlängerbar); traeger_ende = Endauflager am Trägerende (Einzelauflager,
 * Kontaktlänge nur einseitig verlängerbar); allgemein = k_c,90 = 1,0 (Bedingung l₁ ≥ 2h nicht erfüllt oder nicht bekannt);
 * clt_plate = Brettsperrholz (Wert nach ETA; Lehrannahme 1,0).
 * H-3 (Entscheidung 28.10.2026): Am Trägerende gilt für Einzelauflager mit l₁ ≥ 2h ebenfalls k_c,90 = 1,5 (Nadelvollholz)
 * bzw. 1,75 (BSH, l ≤ 400 mm). EN 1995-1-1, 6.1.5(4) unterscheidet nur durchgehende Lagerung und Einzelauflager (Bild 6.2),
 * nicht die Lage am Trägerende (öffentlich: Wortlaut 6.1.5 auf dnaop.com, EN 1995-1-1:2004+A1). Vorher 1,0 am Trägerende.
 * #239-H-3 (Umsetzung 29.10.2026): BSH-Einzelauflager mit l > 400 mm → k_c,90 = 1,0 (Erhöhung 1,75 nur für l ≤ 400 mm, 6.1.5(4)).
 */
export type Querdruckfall = 'schwelle' | 'pfosten_riegel' | 'traeger_ende' | 'allgemein' | 'clt_plate';

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
  // Grenzfallprüfung 02.11.2026: unbekannte Nutzungsklasse vorher Ausnahme
  muss(hinweise, KMOD[e.nkl]?.[e.kled] !== undefined, 'nkl', 'Nutzungsklasse 1 bis 3 und eine Klasse der Lasteinwirkungsdauer wählen.');
  if (hatFehler(hinweise)) {
    return nurGueltig({ f_c90k: e.fc90k, f_c90d: 0, k_c90: 1, l_ef: 0, A_ef: 0, sigma_c90d: 0, stressLimit: 0, F_c90Rd_kN: 0, utilization: 0, gamma_M: GAMMA_M_HOLZ, isUnsafe: false, hinweise });
  }
  const k_mod = KMOD[e.nkl][e.kled];
  const f_c90d = (k_mod * e.fc90k) / GAMMA_M_HOLZ;
  // 6.1.5: k_c,90 = 1,25 (Nadelvollholz) / 1,5 (BSH) bei durchgehender Lagerung; 1,5 / 1,75 bei Einzelauflager mit l1 ≥ 2h und l ≤ 400 mm
  const einzelauflager = e.fall === 'pfosten_riegel' || e.fall === 'traeger_ende';
  const k_c90 = e.fall === 'schwelle' ? (e.art === 'bsh' ? 1.5 : e.art === 'nadelvollholz' ? 1.25 : 1.0)
    : einzelauflager ? (e.art === 'bsh' ? (e.l <= 400 ? 1.75 : 1.0) : e.art === 'nadelvollholz' ? 1.5 : 1.0) : 1.0;
  // wirksame Kontaktlänge: je Seite + 30 mm, höchstens um a, l oder l1/2 (hier: 30 mm je überstehender Seite)
  const l_ef = e.l + (e.ueberstand ? (e.fall === 'traeger_ende' ? 30 : 60) : 0);
  const A_ef = e.b * l_ef;
  const sigma_c90d = (e.F * 1000) / A_ef;
  const stressLimit = k_c90 * f_c90d;
  if (einzelauflager && e.art === 'bsh' && e.l > 400) hinweise.push({ stufe: 'warnung', feld: 'l', text: 'Auflagerlänge l > 400 mm: k_c,90 = 1,75 (BSH) gilt nur für l ≤ 400 mm, angesetzt ist k_c,90 = 1,0.' });
  if (einzelauflager && k_c90 > 1) hinweise.push({ stufe: 'warnung', feld: 'fall', text: 'Erhöhter Beiwert k_c,90 nur, wenn der Abstand l₁ zur nächsten Druckfläche mindestens 2h beträgt (DIN EN 1995-1-1, 6.1.5); sonst Fall „Allgemein“ (k_c,90 = 1,0) wählen.' });
  return nurGueltig({
    f_c90k: e.fc90k, f_c90d, k_c90, l_ef, A_ef, sigma_c90d, stressLimit, F_c90Rd_kN: (stressLimit * A_ef) / 1000,
    utilization: (sigma_c90d / stressLimit) * 100, gamma_M: GAMMA_M_HOLZ, isUnsafe: sigma_c90d > stressLimit, hinweise,
  });
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
  // Grenzfallprüfung 02.11.2026: unbekannte Nutzungsklasse vorher Ausnahme
  muss(hinweise, KMOD[e.nkl]?.[e.kled] !== undefined, 'nkl', 'Nutzungsklasse 1 bis 3 und eine Klasse der Lasteinwirkungsdauer wählen.');
  const kmod = KMOD[e.nkl]?.[e.kled] ?? NaN;
  if (hatFehler(hinweise)) {
    return nurGueltig({ kmod, fmd: 0, ft0d: 0, ft90d: 0, fc0d: 0, fc90d: 0, fvd: 0, fcad: 0, kurve: [] as { winkel: number; fcad: number }[], hinweise });
  }
  const d = (x: number) => bemessungswert(x, kmod, e.gammaM);
  const fc0d = d(e.fc0), fc90d = d(e.fc90);
  const kurve: { winkel: number; fcad: number }[] = [];
  for (let w = 0; w <= 90; w += 5) kurve.push({ winkel: w, fcad: druckUnterWinkel(fc0d, fc90d, e.kc90, w) });
  return nurGueltig({
    kmod, fmd: d(e.fm), ft0d: d(e.ft0), ft90d: d(e.ft90), fc0d, fc90d, fvd: d(e.fv),
    fcad: druckUnterWinkel(fc0d, fc90d, e.kc90, e.winkel), kurve, hinweise,
  });
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

/** Kombinationsbeiwert ψ₂ der Nutzlast Kategorie A (Wohn- und Aufenthaltsräume) nach DIN EN 1990/NA, Tab. NA.A.1.1 */
export const PSI2_WOHNEN = 0.3;
/**
 * Grenzwerte der Durchbiegung für Einfeldträger nach DIN EN 1995-1-1/NA, NDP zu 7.2(2): w_inst ≤ l/300, w_fin ≤ l/200,
 * w_net,fin ≤ l/300 (ohne Überhöhung, w_c = 0). Vorläufig, F-Freigabe (Normtext NA und Kombination für w_net,fin).
 */
export const W_GRENZEN = { inst: 300, fin: 200, netFin: 300 } as const;

export interface EinfeldbalkenEingabe {
  l: number;       // Stützweite [m]
  abstand: number; // Balkenabstand [m]
  gk: number;      // ständige Ausbaulast (Fußbodenaufbau, Unterdecke) [kN/m²]; das Eigengewicht des Balkens wird ergänzt
  qk: number;      // Nutzlast [kN/m²]
  b: number; h: number; // [mm]
  fmk: number; fvk: number; E0mean: number; // [N/mm²]
  rhoMean: number; // [kg/m³]
  brettschichtholz: boolean;
  nkl: Nutzungsklasse;
  /** KLED der kürzesten Einwirkung der Kombination (Nutzlast Kategorie A: mittel) */
  kled: KLED;
  gammaM: number;
  /** ψ₂ der Nutzlast (Standard Kategorie A: 0,3) */
  psi2?: number;
}

/**
 * Einfeldbalken unter Gleichlast nach DIN EN 1995-1-1 mit NA (DE): Biegung (6.11), Schub mit k_cr (6.13),
 * k_mod nach Tab. 3.1 aus Nutzungsklasse und KLED; Tragfähigkeit für 1,35·g + 1,5·q (k_mod der Nutzlast) und für die
 * ständige Kombination 1,35·g (k_mod ständig), maßgebend die größere Ausnutzung (2.4.1, 3.1.3(2)); Durchbiegungen nach 2.2.3 mit k_def nach Tab. 3.2:
 * w_inst = w_inst,G + w_inst,Q; w_fin = w_inst,G·(1 + k_def) + w_inst,Q·(1 + ψ₂·k_def); w_net,fin = (w_inst,G + ψ₂·w_inst,Q)·(1 + k_def).
 */
export function bemesseEinfeldbalken(e: EinfeldbalkenEingabe) {
  const hinweise: Hinweis[] = [];
  const psi2 = e.psi2 ?? PSI2_WOHNEN;
  muss(hinweise, istEndlich(e.l, e.abstand, e.gk, e.qk, e.b, e.h, e.fmk, e.fvk, e.E0mean, e.rhoMean, e.gammaM, psi2), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  muss(hinweise, KMOD[e.nkl]?.[e.kled] !== undefined, 'nkl', 'Nutzungsklasse 1 bis 3 und eine Klasse der Lasteinwirkungsdauer wählen.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.l > 0 && e.abstand > 0, 'l', 'Stützweite und Balkenabstand müssen größer als 0 sein.');
    muss(hinweise, e.gk >= 0 && e.qk >= 0, 'qk', 'Ausbau- und Nutzlast müssen ≥ 0 sein.');
    muss(hinweise, e.b > 0 && e.h > 0, 'b', 'Breite und Höhe müssen größer als 0 sein.');
    muss(hinweise, e.fmk > 0 && e.fvk > 0 && e.E0mean > 0 && e.rhoMean > 0, 'fmk', 'Festigkeiten, E-Modul und Rohdichte müssen größer als 0 sein.');
    muss(hinweise, e.gammaM > 0, 'gammaM', 'γ_M muss größer als 0 sein.');
    muss(hinweise, psi2 >= 0 && psi2 <= 1, 'psi2', 'ψ₂ liegt zwischen 0 und 1.');
  }
  const kdef = KDEF[e.brettschichtholz ? 'bsh' : 'vollholz'][e.nkl] ?? 0;
  const leer = {
    masse: 0, g_k: 0, q_k: 0, q_d: 0, q_inst: 0, M_Ed: 0, V_Ed: 0, W: 0, I: 0, kmod: 0, kdef, psi2, sigma_md: 0, f_md: 0, k_cr: 0, tau_d: 0, f_vd: 0,
    kombination: 'G+Q' as 'G+Q' | 'G', kmodGQ: 0, kmodG: 0, q_d_GQ: 0, q_d_G: 0, eta_m_GQ: 0, eta_m_G: 0,
    w_inst_G: 0, w_inst_Q: 0, w_inst: 0, w_fin: 0, w_net_fin: 0, w_grenz: 0, w_grenz_fin: 0, w_grenz_net: 0,
    eta_m: 0, eta_v: 0, eta_w_inst: 0, eta_w_fin: 0, eta_w_net: 0, eta_w: 0, eta_max: 0, ok: false, hinweise,
  };
  if (hatFehler(hinweise)) return nurGueltig(leer);

  const masse = ((e.b * e.h) / 1e6) * e.rhoMean;      // [kg/m]
  const g_k = masse * G_KN_PRO_KG + e.gk * e.abstand; // ständig: Eigengewicht + Ausbau [kN/m]
  const q_k = e.qk * e.abstand;                       // veränderlich [kN/m]
  // Modulprüfung Tranche 2 (28.10.2026): Nach DIN EN 1995-1-1, 2.4.1 und 3.1.3(2) gehört k_mod zur kürzesten Einwirkung
  // der jeweiligen Kombination. Neben 1,35·g + 1,5·q (k_mod der Nutzlast) ist daher die ständige Kombination 1,35·g
  // mit k_mod(ständig) nachzuweisen; sie wird z. B. bei NKL 1, KLED mittel maßgebend, wenn g_k > 3,33·q_k ist.
  // Vorher fehlte sie. Maßgebend ist die Kombination mit der größeren Ausnutzung σ_m,d/f_m,d (gleich für Schub).
  const kmodGQ = KMOD[e.nkl][e.kled];
  const kmodG = KMOD[e.nkl].stnd;
  const q_d_GQ = GAMMA_G * g_k + GAMMA_Q * q_k;
  const q_d_G = GAMMA_G * g_k;
  const kombination: 'G+Q' | 'G' = q_d_G / kmodG > q_d_GQ / kmodGQ * (1 + 1e-12) ? 'G' : 'G+Q';
  const kmod = kombination === 'G' ? kmodG : kmodGQ;
  const q_d = kombination === 'G' ? q_d_G : q_d_GQ;
  const q_inst = g_k + q_k;
  const M_Ed = (q_d * e.l ** 2) / 8;                  // [kNm]
  const V_Ed = (q_d * e.l) / 2;                       // [kN]
  const W = (e.b * e.h ** 2) / 6, I = (e.b * e.h ** 3) / 12;
  const sigma_md = (M_Ed * 1e6) / W;
  const f_md = bemessungswert(e.fmk, kmod, e.gammaM);
  const k_cr = rissfaktor(e.fvk, e.brettschichtholz);
  const tau_d = (1.5 * V_Ed * 1000) / (k_cr * e.b * e.h);
  const f_vd = bemessungswert(e.fvk, kmod, e.gammaM);
  /** Biegeausnutzung beider Kombinationen [%] */
  const eta_m_GQ = ((q_d_GQ * e.l ** 2 / 8) * 1e6 / W) / bemessungswert(e.fmk, kmodGQ, e.gammaM) * 100;
  const eta_m_G = ((q_d_G * e.l ** 2 / 8) * 1e6 / W) / bemessungswert(e.fmk, kmodG, e.gammaM) * 100;
  const lmm = e.l * 1000;
  const w = (q: number) => (5 * q * lmm ** 4) / (384 * e.E0mean * I); // q in kN/m = N/mm
  const w_inst_G = w(g_k), w_inst_Q = w(q_k);
  const w_inst = w_inst_G + w_inst_Q;
  const w_fin = w_inst_G * (1 + kdef) + w_inst_Q * (1 + psi2 * kdef);
  const w_net_fin = (w_inst_G + psi2 * w_inst_Q) * (1 + kdef);
  const w_grenz = lmm / W_GRENZEN.inst, w_grenz_fin = lmm / W_GRENZEN.fin, w_grenz_net = lmm / W_GRENZEN.netFin;
  const eta_m = (sigma_md / f_md) * 100, eta_v = (tau_d / f_vd) * 100;
  const eta_w_inst = (w_inst / w_grenz) * 100, eta_w_fin = (w_fin / w_grenz_fin) * 100, eta_w_net = (w_net_fin / w_grenz_net) * 100;
  const eta_w = Math.max(eta_w_inst, eta_w_fin, eta_w_net);
  const eta_max = Math.max(eta_m, eta_v, eta_w);
  bereich(hinweise, 'h', e.h / e.b, 0, 10, 'Verhältnis h/b > 10: Kippen (6.3.3) und seitliche Halterung gesondert prüfen.');
  if (e.nkl === 3) hinweise.push({ stufe: 'warnung', feld: 'nkl', text: 'Nutzungsklasse 3: k_def = 2,0 – die Kriechverformung wird maßgebend; der Schwingungsnachweis (7.3) ist nicht enthalten.' });
  if (kombination === 'G') hinweise.push({ stufe: 'warnung', feld: 'kled', text: 'Maßgebend ist die ständige Kombination 1,35·g_k mit k_mod(ständig) – die Nutzlast ist im Verhältnis zur ständigen Last klein.' });
  return nurGueltig({
    masse, g_k, q_k, q_d, q_inst, M_Ed, V_Ed, W, I, kmod, kdef, psi2, sigma_md, f_md, k_cr, tau_d, f_vd,
    kombination, kmodGQ, kmodG, q_d_GQ, q_d_G, eta_m_GQ, eta_m_G,
    w_inst_G, w_inst_Q, w_inst, w_fin, w_net_fin, w_grenz, w_grenz_fin, w_grenz_net,
    eta_m, eta_v, eta_w_inst, eta_w_fin, eta_w_net, eta_w, eta_max, ok: eta_max <= 100, hinweise,
  });
}

export interface VerformterStabEingabe {
  b: number; h: number; l: number; // [mm]
  nd: number;  // Bemessungsnormalkraft (Druck) [kN]
  qd: number;  // Bemessungsquerlast [kN/m]
  e0: number;  // gemessene Vorverformung (Stich) [mm]
  fmk: number; fc0k: number; E0mean: number; E005: number; // [N/mm²]
  brettschichtholz?: boolean;
  kmod: number; gammaM: number;
}

/** Ersatzimperfektion (Vorkrümmung) e = 0,0025·l für Theorie II. Ordnung nach DIN EN 1995-1-1, 5.4.4, Bild 5.1 – vorläufig, F-Freigabe */
export const IMPERFEKTION_EC5 = 0.0025;

/**
 * Verformter Druck-Biege-Stab (z. B. Sparren im Bestand), Knicken in der Biegeebene, seitlich gehalten:
 *  1. Theorie II. Ordnung nach 5.4.4 mit Bemessungssteifigkeit E_d = E_0,mean/γ_M (2.4.1(2)) und Vorkrümmung
 *     e = max(e₀,gemessen; 0,0025·l); Moment mit 1/(1 − N_d/N_cr,d), Querschnittsnachweis (6.19):
 *     (σ_c,0,d/f_c,0,d)² + σ_m,d/f_m,d ≤ 1. „Idealisiert“ = nur normative Vorkrümmung (e₀ nicht aufgemessen).
 *  2. Ersatzstabverfahren nach 6.3.2, Gl. (6.23), mit k_c,y aus λ_rel,y (E_0,05) und Moment I. Ordnung aus q_d und N_d·e₀:
 *     σ_c,0,d/(k_c,y·f_c,0,d) + σ_m,d/f_m,d ≤ 1.
 */
export function verformterDruckstab(e: VerformterStabEingabe) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.b, e.h, e.l, e.nd, e.qd, e.e0, e.fmk, e.fc0k, e.E0mean, e.E005, e.kmod, e.gammaM), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.b > 0 && e.h > 0 && e.l > 0, 'b', 'Breite, Höhe und Länge müssen größer als 0 sein.');
    muss(hinweise, e.nd >= 0 && e.qd >= 0 && e.e0 >= 0, 'nd', 'Normalkraft, Querlast und Vorverformung müssen ≥ 0 sein.');
    muss(hinweise, e.fmk > 0 && e.fc0k > 0 && e.E0mean > 0 && e.E005 > 0 && e.kmod > 0 && e.gammaM > 0, 'fmk', 'Festigkeiten, E-Moduln, k_mod und γ_M müssen größer als 0 sein.');
  }
  const f_md = hatFehler(hinweise) ? 0 : bemessungswert(e.fmk, e.kmod, e.gammaM);
  const f_c0d = hatFehler(hinweise) ? 0 : bemessungswert(e.fc0k, e.kmod, e.gammaM);
  const leer = {
    A: 0, W: 0, I: 0, f_md, f_c0d, E_d: 0, e_imp: 0, e_ansatz: 0, sigma_c_d: 0, sigma_m_d_primary: 0, sigma_m_d_eccentric: 0, sigma_m_d_total: 0,
    N_crit_kN: 0, magFactor: 0, limitRatio: 0, limitRatioIdeal: 0, unsafeRatioDelta: 0,
    lambda_y: 0, lambda_rel_y: 0, k_cy: 0, etaErsatzstab: 0, gueltig: false, hinweise,
  };
  if (hatFehler(hinweise)) return nurGueltig(leer);

  const N = e.nd * 1000;  // [N]
  const q = e.qd;         // kN/m = N/mm
  const A = e.b * e.h, W = (e.b * e.h ** 2) / 6, I = (e.b * e.h ** 3) / 12;
  const E_d = e.E0mean / e.gammaM;
  const e_imp = IMPERFEKTION_EC5 * e.l;
  const e_ansatz = Math.max(e.e0, e_imp);
  const M_q = (q * e.l ** 2) / 8;  // [Nmm]
  const N_crit = (Math.PI ** 2 * E_d * I) / e.l ** 2;
  const lambda_y = e.l / (e.h / Math.sqrt(12));
  const lambda_rel_y = (lambda_y / Math.PI) * Math.sqrt(e.fc0k / e.E005); // (6.21)
  const k_cy = knickbeiwert(lambda_rel_y, !!e.brettschichtholz);
  if (N >= N_crit) {
    hinweise.push({ stufe: 'fehler', feld: 'nd', text: 'Die Normalkraft erreicht die Knicklast N_cr,d = π²·E_d·I/l² – nach Theorie II. Ordnung ist kein Gleichgewicht möglich (Stab instabil).' });
    return nurGueltig({ ...leer, A, W, I, E_d, e_imp, e_ansatz, N_crit_kN: N_crit / 1000, lambda_y, lambda_rel_y, k_cy }); // Grenzfallprüfung 02.11.2026: Fehler → ohne Zwischenwerte
  }
  const magFactor = 1 / (1 - N / N_crit); // = α_cr/(α_cr − 1); N = 0 → 1
  const sigma_c_d = N / A;
  const sigma_m_d_total = ((M_q + N * e_ansatz) * magFactor) / W;
  const druck = (sigma_c_d / f_c0d) ** 2;
  const limitRatio = druck + sigma_m_d_total / f_md;
  const limitRatioIdeal = druck + ((M_q + N * e_imp) * magFactor) / W / f_md;
  const etaErsatzstab = sigma_c_d / (k_cy * f_c0d) + (M_q + N * e.e0) / W / f_md;
  if (N / N_crit > 0.5) hinweise.push({ stufe: 'warnung', feld: 'nd', text: 'N_d liegt über der Hälfte der Knicklast N_cr,d; der Vergrößerungsfaktor reagiert dann sehr empfindlich auf E-Modul und Knicklänge.' });
  if (N > 0 && e.e0 < e_imp) hinweise.push({ stufe: 'warnung', feld: 'e0', text: `Die gemessene Vorverformung ist kleiner als die Ersatzimperfektion 0,0025·l = ${formatDeZahl(e_imp, 1)} mm; nach Theorie II. Ordnung wird die Ersatzimperfektion angesetzt.` });
  hinweise.push({ stufe: 'warnung', feld: 'info', text: 'Knicken in der Biegeebene (y-Achse); seitliche Halterung durch Schalung bzw. Lattung vorausgesetzt. Kippen (6.3.3) und Knicken um die z-Achse sind nicht enthalten.' });
  return nurGueltig({
    A, W, I, f_md, f_c0d, E_d, e_imp, e_ansatz, sigma_c_d, sigma_m_d_primary: M_q / W, sigma_m_d_eccentric: (N * e.e0) / W, sigma_m_d_total,
    N_crit_kN: N_crit / 1000, magFactor, limitRatio: limitRatio * 100, limitRatioIdeal: limitRatioIdeal * 100,
    unsafeRatioDelta: (limitRatio - limitRatioIdeal) * 100, lambda_y, lambda_rel_y, k_cy, etaErsatzstab: etaErsatzstab * 100, gueltig: true, hinweise,
  });
}

// ---------------------------------------------------------------------------------------------------------------
// Holzschrauben nach DIN EN 1995-1-1, 8.7 (Runde 5): Herausziehen (8.38)–(8.41) und Abscheren (Johansen, 8.2.2/8.5.1)
// ---------------------------------------------------------------------------------------------------------------

export interface HolzschraubeEingabe {
  rhok: number;   // charakteristische Rohdichte [kg/m³]
  d: number;      // Nenndurchmesser (Gewindeaußendurchmesser) [mm]
  lef: number;    // Einschraubtiefe des Gewindes [mm]
  alpha: number;  // Winkel Schraubenachse – Faser [°]
  n: number;      // Anzahl Schrauben
  nkl: Nutzungsklasse; kled: KLED;
  fuk?: number;   // Zugfestigkeit des Schraubendrahts [N/mm²], Lehrwert 400
  gammaM?: number;
  dKern?: number; // Kerndurchmesser d₁ [mm]; ohne Angabe Lehrwert 0,65·d (Herstellerangabe maßgebend)
}

/** Lehrwert Kerndurchmesser/Nenndurchmesser d₁/d (Gültigkeitsbereich der Gl. (8.38): 0,6 … 0,75) */
export const KERN_VERHAELTNIS_SCHRAUBE = 0.65;

/**
 * Selbstbohrende Holzschrauben ohne ETA-Werte:
 *  - Herausziehen (8.38): F_ax,α,Rk = n_ef · f_ax,k · d · l_ef · k_d / (1,2·cos²α + sin²α), f_ax,k = 0,52·d^−0,5·l_ef^−0,1·ρ_k^0,8 (8.39),
 *    k_d = min(d/8; 1) (8.40), n_ef = n^0,9 (8.41); gültig für 6 mm ≤ d ≤ 12 mm und Kerndurchmesser 0,6 ≤ d₁/d ≤ 0,75.
 *    Ausziehparameter nach NA DE (NCI, Schrauben ohne ETA) und Fassung der Gl. (8.38) nach A2:2014 am Normtext prüfen
 *    (T10-HV-2) – vorläufig, F-Freigabe DIN EN 1995-1-1/NA.
 *  - Abscheren je Scherfuge mit dem wirksamen Durchmesser d_ef = 1,1·d₁ (8.7.1(3), Gewinde im Scherbereich; T10-HV-3,
 *    Umsetzung 29.10.2026): d_ef ≤ 6 mm Regeln für Nägel, f_h,k = 0,082·ρ_k·d_ef^−0,3 (8.15, nicht vorgebohrt); d_ef > 6 mm
 *    Regeln für Bolzen, f_h,k = 0,082·(1 − 0,01·d_ef)·ρ_k (8.32) (8.7.1(4)); M_y,Rk = 0,3·f_u,k·d_ef^2,6 (8.14/8.30);
 *    F_v,Rk = min(f_h,k·l_ef·d_ef; 1,15·√(2·M_y,Rk·f_h,k·d_ef) + F_ax,Rk/4), Seileffekt ≤ 100 % (8.2.2(2)).
 */
export function holzschraube(e: HolzschraubeEingabe) {
  const hinweise: Hinweis[] = [];
  const fuk = e.fuk ?? 400, gammaM = e.gammaM ?? GAMMA_M_HOLZ;
  const dKern = e.dKern ?? KERN_VERHAELTNIS_SCHRAUBE * e.d;
  muss(hinweise, istEndlich(e.rhok, e.d, e.lef, e.alpha, e.n, fuk, gammaM, dKern), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  muss(hinweise, KMOD[e.nkl]?.[e.kled] !== undefined, 'nkl', 'Nutzungsklasse 1 bis 3 und eine Klasse der Lasteinwirkungsdauer wählen.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.rhok > 0 && e.d > 0 && e.lef > 0 && fuk > 0 && gammaM > 0, 'd', 'Rohdichte, Durchmesser, Einschraubtiefe und Festigkeit müssen größer als 0 sein.');
    muss(hinweise, e.n >= 1 && Number.isInteger(e.n), 'n', 'Die Schraubenanzahl muss eine ganze Zahl ≥ 1 sein.');
    muss(hinweise, e.alpha >= 0 && e.alpha <= 90, 'alpha', 'Der Winkel zwischen Schraubenachse und Faser liegt zwischen 0° und 90°.');
    muss(hinweise, dKern > 0 && dKern < e.d, 'dKern', 'Der Kerndurchmesser muss größer als 0 und kleiner als der Nenndurchmesser sein.');
  }
  const leer = {
    k_mod: 0, rho_k: e.rhok, f_ax_k: 0, k_d: 0, n_ef: 0, factor_alpha: 0, f_ax_alpha_k: 0, F_ax_Rk_single_N: 0, F_ax_Rk_total_kN: 0, F_ax_Rd_total_kN: 0,
    d_kern: dKern, d_ef: 0, lochleibungNach: 'nagel' as 'nagel' | 'bolzen', f_h_k: 0, M_y_Rk: 0, F_v_Rk_1: 0, johansen: 0, rope_effect: 0, F_v_Rk_single_N: 0, F_v_Rk_total_kN: 0, F_v_Rd_total_kN: 0, hinweise,
  };
  if (hatFehler(hinweise)) return nurGueltig(leer);

  const k_mod = KMOD[e.nkl][e.kled];
  const rad = (e.alpha * Math.PI) / 180;
  const factor_alpha = 1 / (1.2 * Math.cos(rad) ** 2 + Math.sin(rad) ** 2);
  const f_ax_k = 0.52 * e.d ** -0.5 * e.lef ** -0.1 * e.rhok ** 0.8; // (8.39)
  const k_d = Math.min(e.d / 8, 1);                                    // (8.40)
  const n_ef = e.n ** 0.9;                                             // (8.41)
  const f_ax_alpha_k = f_ax_k * factor_alpha;
  const F_ax_Rk_single_N = f_ax_alpha_k * e.d * e.lef * k_d;
  const F_ax_Rk_total_kN = (n_ef * F_ax_Rk_single_N) / 1000;
  const F_ax_Rd_total_kN = bemessungswert(F_ax_Rk_total_kN, k_mod, gammaM);

  const d_ef = 1.1 * dKern;                                            // 8.7.1(3)
  const lochleibungNach: 'nagel' | 'bolzen' = d_ef <= 6 ? 'nagel' : 'bolzen'; // 8.7.1(4)
  const f_h_k = lochleibungNach === 'nagel' ? 0.082 * e.rhok * d_ef ** -0.3 : 0.082 * (1 - 0.01 * d_ef) * e.rhok;
  const M_y_Rk = 0.3 * fuk * d_ef ** 2.6;
  const F_v_Rk_1 = f_h_k * e.lef * d_ef;
  const johansen = 1.15 * Math.sqrt(2 * M_y_Rk * f_h_k * d_ef);
  const rope_effect = Math.min(0.25 * F_ax_Rk_single_N, johansen);
  const F_v_Rk_single_N = Math.min(F_v_Rk_1, johansen + rope_effect);
  const F_v_Rk_total_kN = (e.n * F_v_Rk_single_N) / 1000;
  const F_v_Rd_total_kN = bemessungswert(F_v_Rk_total_kN, k_mod, gammaM);

  if (e.d < 6 || e.d > 12) hinweise.push({ stufe: 'warnung', feld: 'd', text: 'Gl. (8.38)/(8.39) gilt für 6 mm ≤ d ≤ 12 mm; sonst Werte der ETA verwenden.' });
  if (e.lef < 6 * e.d) hinweise.push({ stufe: 'warnung', feld: 'lef', text: 'Die Einschraubtiefe des Gewindes sollte mindestens 6·d betragen (8.7.2).' });
  if (e.alpha < 30) hinweise.push({ stufe: 'warnung', feld: 'alpha', text: 'Winkel zwischen Schraubenachse und Faser unter 30°: nach 8.7.2 nicht abgedeckt.' });
  const kv = dKern / e.d;
  if (kv < 0.6 - 1e-9 || kv > 0.75 + 1e-9) hinweise.push({ stufe: 'warnung', feld: 'dKern', text: 'Kerndurchmesser außerhalb 0,6·d … 0,75·d: Gl. (8.38) gilt nicht, Werte der ETA verwenden.' });
  hinweise.push({ stufe: 'warnung', feld: 'info', text: 'Normformeln ohne ETA; Hersteller deklarieren meist höhere Auszieh- und Fließmomentwerte. Mindestabstände, n_ef beim Abscheren und Blockscherversagen sind nicht nachgewiesen.' });
  return nurGueltig({
    k_mod, rho_k: e.rhok, f_ax_k, k_d, n_ef, factor_alpha, f_ax_alpha_k, F_ax_Rk_single_N, F_ax_Rk_total_kN, F_ax_Rd_total_kN,
    d_kern: dKern, d_ef, lochleibungNach, f_h_k, M_y_Rk, F_v_Rk_1, johansen, rope_effect, F_v_Rk_single_N, F_v_Rk_total_kN, F_v_Rd_total_kN, hinweise,
  });
}

/** Werkstoffgruppen des Abbrandrechners (Modul holzbau_bauphysik) */
export type AbbrandArt = 'nadel' | 'bsh' | 'laub' | 'clt';
/**
 * Abbrandraten [mm/min]: β_n inkl. Eckausrundung für Nadel-Vollholz (0,80), Nadelholz-BSH (0,70) und Laubholz ρ_k ≥ 450 kg/m³ (0,55)
 * nach DIN EN 1995-1-2:2010-12, Tab. 3.1; Brettsperrholz als Lehrannahme mit β₀ = 0,65 (eindimensional, ohne Lagenabfall).
 */
export const ABBRANDRATE: Readonly<Record<AbbrandArt, number>> = { nadel: 0.8, bsh: 0.7, laub: 0.55, clt: 0.65 };
/** Schicht ohne Festigkeit d₀ [mm] (DIN EN 1995-1-2, 4.2.2) */
export const D0_ABBRAND = 7;

/**
 * Methode mit reduziertem Querschnitt (DIN EN 1995-1-2, 4.2.2): d_ef = β·t + k₀·d₀ mit k₀ = min(1; t/20) (ungeschützte Flächen),
 * Restquerschnitt bei 3-seitiger (Breite beidseitig, Höhe einseitig) bzw. 4-seitiger Brandbeanspruchung.
 * Verhalten 1:1 aus src/modules/HolzbauBeta.tsx übernommen (Modulprüfung Tranche 10); Maße in mm, Zeit in min.
 */
export function abbrandQuerschnitt(art: AbbrandArt, t: number, b: number, h: number, seiten: 3 | 4) {
  const beta_0 = ABBRANDRATE[art] ?? ABBRANDRATE.nadel;
  const d_char0 = beta_0 * t;
  const k_0 = Math.min(1, t / 20);
  const d_ef = d_char0 + k_0 * D0_ABBRAND;
  const b_fi = Math.max(0, b - 2 * d_ef);
  const h_fi = Math.max(0, h - (seiten === 4 ? 2 : 1) * d_ef);
  const A_0 = b * h;
  const W_y0 = (b * h * h) / 6;
  const A_fi = b_fi * h_fi;
  const W_yfi = b_fi > 0 && h_fi > 0 ? (b_fi * h_fi * h_fi) / 6 : 0;
  const areaLossPercent = A_0 > 0 ? ((A_0 - A_fi) / A_0) * 100 : 100;
  /** Verlust an Widerstandsmoment W (nicht EI) */
  const stiffnessLossPercent = W_y0 > 0 ? ((W_y0 - W_yfi) / W_y0) * 100 : 100;
  return { beta_0, d_char0, k_0, d_ef, b_fi, h_fi, A_0, W_y0, A_fi, W_yfi, areaLossPercent, stiffnessLossPercent, isCollapsed: b_fi <= 0 || h_fi <= 0 };
}
