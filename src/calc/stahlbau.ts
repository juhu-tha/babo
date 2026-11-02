/**
 * Stahlbau nach DIN EN 1993-1-1 mit NA (DE): Werkstoffkennwerte, Querschnittsklassen (Tab. 5.2),
 * Zugstab (6.2.3), Biegung (6.2.5) und Biegeknicken (6.3.1, Gl. 6.47–6.50, Tab. 6.1/6.2).
 * Reiner Rechenkern – geprüft in tests/stahlbau.test.ts.
 */
import { formatDeZahl } from '../utils/numberFormat';
import { type Hinweis, hatFehler, istEndlich, muss, bereich, nurGueltig } from './plausibilitaet';
import { BAUSTAHL_EC3, E_BAUSTAHL } from '../data/kennwerte';
import { GWP_LEHRWERTE } from '../data/gwpLehrwerte';

/** Teilsicherheitsbeiwerte nach DIN EN 1993-1-1/NA (DE) und E-Modul nach 3.2.6 (zentral in src/data/kennwerte.ts) */
export const EC3_NA_DE = { E: E_BAUSTAHL, gammaM0: 1.0, gammaM1: 1.1, gammaM2: 1.25 } as const;

export type Stahlguete = 'S235' | 'S355' | 'S460';

/** Nennwerte f_y und f_u für t ≤ 40 mm nach DIN EN 1993-1-1, Tab. 3.1 [N/mm²] – zentral aus src/data/kennwerte.ts */
export const STAHLGUETEN: Readonly<Record<Stahlguete, { fy: number; fu: number; norm: string }>> = {
  S235: { ...BAUSTAHL_EC3.S235, norm: 'DIN EN 10025-2 (S235)' },
  S355: { ...BAUSTAHL_EC3.S355, norm: 'DIN EN 10025-2 (S355)' },
  S460: { ...BAUSTAHL_EC3.S460, norm: 'DIN EN 10025-3 (S460N/NL)' },
};

export type Knicklinie = 'a0' | 'a' | 'b' | 'c' | 'd';
export const KNICKLINIEN: readonly Knicklinie[] = ['a0', 'a', 'b', 'c', 'd'];
/** Imperfektionsbeiwerte α nach DIN EN 1993-1-1, Tab. 6.1 */
export const ALPHA: Readonly<Record<Knicklinie, number>> = { a0: 0.13, a: 0.21, b: 0.34, c: 0.49, d: 0.76 };

export interface Walzprofil {
  name: string;
  reihe: 'IPE' | 'HEA' | 'HEB';
  /** Abmessungen [mm] */
  h: number; b: number; tw: number; tf: number; r: number;
  /** Fläche [cm²], Trägheitsmomente [cm⁴], Widerstandsmomente [cm³], Trägheitsradien [cm] */
  A: number; Iy: number; Iz: number; Wely: number; Wply: number; iy: number; iz: number;
}

/**
 * Querschnittswerte warmgewalzter Profile nach Herstellertabelle (geprüft an der Profiltabelle von stad.fr, 10/2026);
 * A auf 0,1 cm² gerundet wie in den üblichen Bautabellen.
 */
export const WALZPROFILE: readonly Walzprofil[] = [
  { name: 'IPE 200', reihe: 'IPE', h: 200, b: 100, tw: 5.6, tf: 8.5, r: 12, A: 28.5, Iy: 1943, Iz: 142, Wely: 194.3, Wply: 220.6, iy: 8.26, iz: 2.24 },
  { name: 'IPE 240', reihe: 'IPE', h: 240, b: 120, tw: 6.2, tf: 9.8, r: 15, A: 39.1, Iy: 3892, Iz: 284, Wely: 324.3, Wply: 366.7, iy: 9.97, iz: 2.69 },
  { name: 'IPE 300', reihe: 'IPE', h: 300, b: 150, tw: 7.1, tf: 10.7, r: 15, A: 53.8, Iy: 8356, Iz: 604, Wely: 557.1, Wply: 628.4, iy: 12.46, iz: 3.35 },
  { name: 'IPE 400', reihe: 'IPE', h: 400, b: 180, tw: 8.6, tf: 13.5, r: 21, A: 84.5, Iy: 23128, Iz: 1318, Wely: 1156.4, Wply: 1307.2, iy: 16.55, iz: 3.95 },
  { name: 'HEA 160', reihe: 'HEA', h: 152, b: 160, tw: 6.0, tf: 9.0, r: 15, A: 38.8, Iy: 1673, Iz: 616, Wely: 220.1, Wply: 245.2, iy: 6.57, iz: 3.98 },
  { name: 'HEA 200', reihe: 'HEA', h: 190, b: 200, tw: 6.5, tf: 10.0, r: 18, A: 53.8, Iy: 3692, Iz: 1336, Wely: 388.6, Wply: 429.5, iy: 8.28, iz: 4.98 },
  { name: 'HEA 300', reihe: 'HEA', h: 290, b: 300, tw: 8.5, tf: 14.0, r: 27, A: 112.5, Iy: 18264, Iz: 6310, Wely: 1259.6, Wply: 1383.3, iy: 12.74, iz: 7.49 },
  { name: 'HEB 160', reihe: 'HEB', h: 160, b: 160, tw: 8.0, tf: 13.0, r: 15, A: 54.3, Iy: 2492, Iz: 889, Wely: 311.5, Wply: 354.0, iy: 6.78, iz: 4.05 },
  { name: 'HEB 200', reihe: 'HEB', h: 200, b: 200, tw: 9.0, tf: 15.0, r: 18, A: 78.1, Iy: 5696, Iz: 2003, Wely: 569.6, Wply: 642.6, iy: 8.54, iz: 5.07 },
  { name: 'HEB 300', reihe: 'HEB', h: 300, b: 300, tw: 11.0, tf: 19.0, r: 27, A: 149.1, Iy: 25166, Iz: 8563, Wely: 1677.7, Wply: 1868.7, iy: 12.99, iz: 7.58 },
];

export const profil = (name: string): Walzprofil | undefined => WALZPROFILE.find(p => p.name === name);

/** ε = √(235/f_y) nach Tab. 5.2 */
export const epsilon = (fy: number) => Math.sqrt(235 / fy);

/** Bezugsschlankheit λ₁ = π·√(E/f_y) = 93,9·ε (6.3.1.3) */
export const lambda1 = (fy: number, E: number = EC3_NA_DE.E) => Math.PI * Math.sqrt(E / fy);

/** Abminderungsbeiwert χ nach Gl. (6.49) mit Φ = 0,5·[1 + α·(λ̄ − 0,2) + λ̄²]; χ ≤ 1 */
export function chi(lambdaQuer: number, alpha: number): { chi: number; phi: number } {
  const phi = 0.5 * (1 + alpha * (lambdaQuer - 0.2) + lambdaQuer * lambdaQuer);
  const wurzel = Math.sqrt(Math.max(0, phi * phi - lambdaQuer * lambdaQuer));
  const c = 1 / (phi + wurzel);
  return { chi: Number.isFinite(c) ? Math.min(1, c) : 0, phi };
}

/** Knicklinie für gewalzte I-Querschnitte nach Tab. 6.2 */
export function knicklinieNachTab62(p: Walzprofil, guete: Stahlguete, achse: 'y' | 'z'): Knicklinie {
  const s460 = guete === 'S460';
  if (p.h / p.b > 1.2) {
    if (p.tf <= 40) return s460 ? 'a0' : achse === 'y' ? 'a' : 'b';
    return s460 ? 'a' : achse === 'y' ? 'b' : 'c';
  }
  if (p.tf <= 100) return s460 ? 'a' : achse === 'y' ? 'b' : 'c';
  return s460 ? 'c' : 'd';
}

export type Klasse = 1 | 2 | 3 | 4;
export interface Teilklasse { c: number; t: number; ct: number; grenzen: [number, number, number]; klasse: Klasse }
export interface Klassifizierung { eps: number; flansch: Teilklasse; steg: Teilklasse; klasse: Klasse }

const einstufen = (c: number, t: number, g: [number, number, number]): Teilklasse => {
  const ct = c / t;
  const klasse: Klasse = ct <= g[0] ? 1 : ct <= g[1] ? 2 : ct <= g[2] ? 3 : 4;
  return { c, t, ct, grenzen: g, klasse };
};

/**
 * Querschnittsklasse nach Tab. 5.2 für gewalzte I-Profile:
 * Flansch als einseitig gestütztes Teil (c = (b − t_w − 2r)/2; Grenzen 9ε/10ε/14ε),
 * Steg als beidseitig gestütztes Teil (c = h − 2t_f − 2r) unter Druck (33ε/38ε/42ε) bzw. Biegung (72ε/83ε/124ε).
 */
export function klassifiziere(p: Walzprofil, fy: number, beanspruchung: 'druck' | 'biegung_y'): Klassifizierung {
  const eps = epsilon(fy);
  const flansch = einstufen((p.b - p.tw - 2 * p.r) / 2, p.tf, [9 * eps, 10 * eps, 14 * eps]);
  const steg = beanspruchung === 'druck'
    ? einstufen(p.h - 2 * p.tf - 2 * p.r, p.tw, [33 * eps, 38 * eps, 42 * eps])
    : einstufen(p.h - 2 * p.tf - 2 * p.r, p.tw, [72 * eps, 83 * eps, 124 * eps]);
  return { eps, flansch, steg, klasse: Math.max(flansch.klasse, steg.klasse) as Klasse };
}

// ---------------------------------------------------------------------------------------------
// Zugstab (6.2.3)
// ---------------------------------------------------------------------------------------------
export interface ZugEingabe { A: number; Anet: number; guete: Stahlguete; nEd: number } // [cm²], [kN]
export interface ZugErgebnis { NplRd: number; NuRd: number; NtRd: number; ausnutzung: number; nettoMassgebend: boolean; hinweise: Hinweis[] }

export function bemesseZugstab(e: ZugEingabe): ZugErgebnis {
  const h: Hinweis[] = [];
  const g = STAHLGUETEN[e.guete];
  muss(h, !!g, 'guete', 'Unbekannte Stahlgüte.');
  muss(h, istEndlich(e.A, e.Anet, e.nEd), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(h)) {
    muss(h, e.A > 0, 'A', 'Die Bruttoquerschnittsfläche A muss größer als 0 sein.');
    muss(h, e.Anet > 0 && e.Anet <= e.A, 'Anet', 'Die Nettoquerschnittsfläche A_net muss zwischen 0 und A liegen.');
    muss(h, e.nEd >= 0, 'nEd', 'N_Ed ist der Betrag der Zugkraft und muss ≥ 0 sein.');
  }
  if (hatFehler(h)) return nurGueltig({ NplRd: 0, NuRd: 0, NtRd: 0, ausnutzung: 0, nettoMassgebend: false, hinweise: h });
  const NplRd = (e.A * 100 * g.fy) / EC3_NA_DE.gammaM0 / 1000;          // Gl. (6.6)
  const NuRd = (0.9 * e.Anet * 100 * g.fu) / EC3_NA_DE.gammaM2 / 1000;  // Gl. (6.7)
  const NtRd = Math.min(NplRd, NuRd);
  return nurGueltig({ NplRd, NuRd, NtRd, ausnutzung: e.nEd / NtRd, nettoMassgebend: NuRd < NplRd, hinweise: h });
}

// ---------------------------------------------------------------------------------------------
// Biegung um die starke Achse (6.2.5)
// ---------------------------------------------------------------------------------------------
export interface BiegeErgebnis { klasse: Klassifizierung; MplRd: number; MelRd: number; McRd: number; hinweise: Hinweis[] }

export function biegewiderstandY(p: Walzprofil, guete: Stahlguete): BiegeErgebnis {
  const fy = STAHLGUETEN[guete].fy;
  const klasse = klassifiziere(p, fy, 'biegung_y');
  const MplRd = (p.Wply * 1000 * fy) / EC3_NA_DE.gammaM0 / 1e6; // [kNm], Gl. (6.13)
  const MelRd = (p.Wely * 1000 * fy) / EC3_NA_DE.gammaM0 / 1e6; // Gl. (6.14)
  const hinweise: Hinweis[] = [];
  if (klasse.klasse === 4) hinweise.push({ stufe: 'warnung', feld: 'klasse', text: 'Querschnittsklasse 4 unter Biegung: M_c,Rd mit W_eff nach DIN EN 1993-1-5 – hier nicht berechnet.' });
  const McRd = klasse.klasse <= 2 ? MplRd : MelRd;
  return nurGueltig({ klasse, MplRd, MelRd, McRd, hinweise });
}

// ---------------------------------------------------------------------------------------------
// Biegeknicken (6.3.1)
// ---------------------------------------------------------------------------------------------
export interface KnickAchse {
  Lcr: number;     // [m]
  lambda: number;  // Schlankheit L_cr/i
  Ncr: number;     // ideale Verzweigungslast [kN]
  lambdaQuer: number;
  knicklinie: Knicklinie;
  alpha: number;
  phi: number;
  chi: number;
  NbRd: number;    // [kN]
}

/** Biegeknicken einer Achse: A [cm²], i [cm], f_y [N/mm²], L_cr [m]; λ̄ = √(A·f_y/N_cr) = (L_cr/i)/λ₁ */
export function biegeknicken(A: number, i: number, fy: number, Lcr: number, knicklinie: Knicklinie, gammaM1: number = EC3_NA_DE.gammaM1, E: number = EC3_NA_DE.E): KnickAchse {
  const A_mm2 = A * 100, i_mm = i * 10, L_mm = Lcr * 1000;
  const lambda = L_mm / i_mm;
  const Ncr = (Math.PI * Math.PI * E * A_mm2 * i_mm * i_mm) / (L_mm * L_mm) / 1000; // π²EI/L², I = A·i²
  const lambdaQuer = Math.sqrt((A_mm2 * fy) / (Ncr * 1000));
  const alpha = ALPHA[knicklinie];
  const r = chi(lambdaQuer, alpha);
  const NbRd = (r.chi * A_mm2 * fy) / gammaM1 / 1000; // Gl. (6.47)
  return { Lcr, lambda, Ncr, lambdaQuer, knicklinie, alpha, phi: r.phi, chi: r.chi, NbRd };
}

export interface DruckstabEingabe {
  profil: string;
  guete: Stahlguete;
  LcrY: number; LcrZ: number; // [m]
  /** Knicklinie je Achse; undefined = Zuordnung nach Tab. 6.2 */
  knicklinieY?: Knicklinie; knicklinieZ?: Knicklinie;
  nEd: number; // [kN]
}

export interface DruckstabErgebnis {
  p?: Walzprofil;
  fy: number; eps: number; lambda1: number;
  klasse: Klassifizierung | null;
  NcRd: number; // Querschnittswiderstand A·f_y/γ_M0 [kN]
  y: KnickAchse; z: KnickAchse;
  vorschlagY: Knicklinie; vorschlagZ: Knicklinie;
  NbRd: number;
  /** maßgebender Widerstand: N_c,Rd, wenn der Knicknachweis nach 6.3.1.2(4) entfallen darf, sonst min(N_b,Rd; N_c,Rd) */
  NRd: number; massgebend: 'y' | 'z';
  ausnutzung: number;
  vernachlaessigbar: boolean;
  hinweise: Hinweis[];
}

const LEER_ACHSE: KnickAchse = { Lcr: 0, lambda: 0, Ncr: 0, lambdaQuer: 0, knicklinie: 'b', alpha: 0.34, phi: 0, chi: 0, NbRd: 0 };

export function pruefeDruckstab(e: DruckstabEingabe): Hinweis[] {
  const h: Hinweis[] = [];
  muss(h, !!profil(e.profil), 'profil', `Unbekanntes Profil „${e.profil}“.`);
  muss(h, !!STAHLGUETEN[e.guete], 'guete', 'Unbekannte Stahlgüte.');
  muss(h, istEndlich(e.LcrY, e.LcrZ, e.nEd), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  for (const [k, v] of [['knicklinieY', e.knicklinieY], ['knicklinieZ', e.knicklinieZ]] as const) {
    if (v !== undefined) muss(h, KNICKLINIEN.includes(v), k, 'Unbekannte Knicklinie.');
  }
  if (hatFehler(h)) return h;
  muss(h, e.LcrY > 0 && e.LcrZ > 0, 'Lcr', 'Die Knicklängen L_cr,y und L_cr,z müssen größer als 0 sein.');
  muss(h, e.nEd >= 0, 'nEd', 'N_Ed ist der Betrag der Druckkraft und muss ≥ 0 sein.');
  if (hatFehler(h)) return h;
  bereich(h, 'Lcr', Math.max(e.LcrY, e.LcrZ), 0, 20, 'Knicklängen über 20 m sind bei Walzprofilen dieser Größe unüblich – Eingabe prüfen.');
  return h;
}

export function bemesseDruckstab(e: DruckstabEingabe): DruckstabErgebnis {
  const hinweise = pruefeDruckstab(e);
  const p = profil(e.profil);
  const g = STAHLGUETEN[e.guete];
  if (hatFehler(hinweise) || !p || !g) {
    return nurGueltig({ p, fy: g?.fy ?? 0, eps: 0, lambda1: 0, klasse: null, NcRd: 0, y: LEER_ACHSE, z: LEER_ACHSE, vorschlagY: 'b', vorschlagZ: 'c', NbRd: 0, NRd: 0, massgebend: 'z', ausnutzung: 0, vernachlaessigbar: false, hinweise });
  }
  const fy = g.fy;
  const klasse = klassifiziere(p, fy, 'druck');
  const vorschlagY = knicklinieNachTab62(p, e.guete, 'y');
  const vorschlagZ = knicklinieNachTab62(p, e.guete, 'z');
  const kY = e.knicklinieY ?? vorschlagY, kZ = e.knicklinieZ ?? vorschlagZ;
  const y = biegeknicken(p.A, p.iy, fy, e.LcrY, kY);
  const z = biegeknicken(p.A, p.iz, fy, e.LcrZ, kZ);
  const NcRd = (p.A * 100 * fy) / EC3_NA_DE.gammaM0 / 1000; // Gl. (6.10), Klasse 1–3
  const massgebend: 'y' | 'z' = z.NbRd <= y.NbRd ? 'z' : 'y';
  const NbRd = Math.min(y.NbRd, z.NbRd);
  const lqMax = Math.max(y.lambdaQuer, z.lambdaQuer);
  const ncrMin = Math.min(y.Ncr, z.Ncr);
  const vernachlaessigbar = lqMax <= 0.2 || (ncrMin > 0 && e.nEd / ncrMin <= 0.04);
  // Runde 5: Darf der Knicknachweis nach 6.3.1.2(4) entfallen, ist der Querschnittsnachweis N_c,Rd = A·f_y/γ_M0 maßgebend
  // (bisher wurde N_b,Rd mit χ = 1 und γ_M1 = 1,1 weiter verwendet, also 10 % zu ungünstig).
  const NRd = vernachlaessigbar ? NcRd : Math.min(NbRd, NcRd);
  const ausnutzung = NRd > 0 ? e.nEd / NRd : 0;

  if (klasse.klasse === 4) {
    // Runde 5: das maßgebende Teil benennen (bisher immer der Steg, auch bei Klasse 4 aus dem Flansch)
    const teile = [
      ...(klasse.steg.klasse === 4 ? [`Steg c/t = ${formatDeZahl(klasse.steg.ct, 1)} > 42ε = ${formatDeZahl(klasse.steg.grenzen[2], 1)}`] : []),
      ...(klasse.flansch.klasse === 4 ? [`Flansch c/t = ${formatDeZahl(klasse.flansch.ct, 1)} > 14ε = ${formatDeZahl(klasse.flansch.grenzen[2], 1)}`] : []),
    ];
    hinweise.push({ stufe: 'warnung', feld: 'klasse', text: `Querschnittsklasse 4 unter Druck (${teile.join('; ')}): Nachweis mit A_eff nach DIN EN 1993-1-5. Das Ergebnis mit der Bruttofläche A liegt auf der unsicheren Seite.` });
  }
  if (kY !== vorschlagY || kZ !== vorschlagZ) {
    hinweise.push({ stufe: 'warnung', feld: 'knicklinie', text: `Gewählte Knicklinien (y: ${kY}, z: ${kZ}) weichen von Tab. 6.2 ab (y: ${vorschlagY}, z: ${vorschlagZ}).` });
  }
  if (vernachlaessigbar) {
    hinweise.push({ stufe: 'warnung', feld: 'vernachlaessigbar', text: 'λ̄ ≤ 0,2 oder N_Ed/N_cr ≤ 0,04: Der Biegeknicknachweis darf nach 6.3.1.2(4) entfallen; maßgebend ist dann der Querschnittsnachweis N_c,Rd = A·f_y/γ_M0.' });
  }
  if (lqMax > 2) {
    hinweise.push({ stufe: 'warnung', feld: 'schlank', text: `Sehr schlanker Stab (λ̄ = ${formatDeZahl(lqMax, 2)}): Die Tragfähigkeit liegt weit unter A·f_y; ein steiferes Profil oder kürzere Knicklängen sind meist wirtschaftlicher.` });
  }
  return nurGueltig({ p, fy, eps: klasse.eps, lambda1: lambda1(fy), klasse, NcRd, y, z, vorschlagY, vorschlagZ, NbRd, NRd, massgebend, ausnutzung, vernachlaessigbar, hinweise });
}

// ---------------------------------------------------------------------------------------------
// Plastische Querschnittswerte für den Gütevergleich (Modul Stahl, Reiter Stahlsorten)
// ---------------------------------------------------------------------------------------------
export interface PlastischeKapazitaet { MplRd: number; NplRd: number; steigerungGegenS235: number }

/**
 * M_pl,Rd = W_pl·f_y/γ_M0 [kNm] (Gl. 6.13) und N_pl,Rd = A·f_y/γ_M0 [kN] (Gl. 6.6) mit W_pl [cm³], A [cm²],
 * f_y [N/mm²]; Querschnittsklasse 1/2 vorausgesetzt. Steigerung der Streckgrenze gegenüber S235 in %.
 */
export function plastischeKapazitaet(WplCm3: number, Acm2: number, fy: number, gammaM0: number = EC3_NA_DE.gammaM0): PlastischeKapazitaet {
  return {
    MplRd: (WplCm3 * fy) / gammaM0 / 1000,
    NplRd: (Acm2 * fy) / gammaM0 / 10,
    steigerungGegenS235: ((fy - 235) / 235) * 100,
  };
}

/** GWP A1–A3 Profilstahl [kg CO₂-Äq./kg] – zentraler Lehrwert (src/data/gwpLehrwerte.ts, NP2-ST-2) */
export const GWP_PROFILSTAHL_KG = GWP_LEHRWERTE.profilstahl.gwp / 1000;

/**
 * Massenanteil, der beim Ersatz eines Profils durch ein leichteres entfällt: 1 − g_neu/g_alt
 * (IPE 300 → IPE 200: 1 − 22,4/42,2 = 0,469).
 */
export function einsparanteilProfil(gewichtAltKgM: number, gewichtNeuKgM: number): number {
  return gewichtAltKgM > 0 ? Math.max(0, 1 - gewichtNeuKgM / gewichtAltKgM) : 0;
}

/** Vermiedene Herstellungsemissionen A1–A3 je m Träger [kg CO₂-Äq./m] = Gewicht · Einsparanteil · GWP je kg */
export function co2VorteilProfil(gewichtKgM: number, einsparanteil: number, gwpKgJeKg: number = GWP_PROFILSTAHL_KG): number {
  return gewichtKgM * einsparanteil * gwpKgJeKg;
}
