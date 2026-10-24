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
