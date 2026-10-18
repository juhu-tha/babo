/**
 * ec2Spannbeton.ts
 * Normkonforme Berechnungsverfahren für Spannbeton nach DIN EN 1992-1-1 (Eurocode 2)
 * Enthält Materialmodelle, zeitabhängige Verformungen (Kriechen, Schwinden, Relaxation),
 * Reibung, Keilschlupf und Spannkraftverluste nach Gl. (5.46).
 */

export type CementClass = 'S' | 'N' | 'R';
export type RelaxationClass = 1 | 2 | 3;

export interface ConcreteClassData {
  id: string;
  name: string;
  fck: number;        // MPa (N/mm²)
  fck_cube: number;   // MPa
  fcm: number;        // MPa (fck + 8)
  fctm: number;       // MPa
  fctk_005: number;   // MPa
  fctk_095: number;   // MPa
  Ecm: number;        // MPa
  eps_c1: number;     // ‰ (Arbeitslinie Gl. 3.14)
  eps_cu1: number;    // ‰
  eps_c2: number;     // ‰ (Parabel-Rechteck-Diagramm Gl. 3.17)
  eps_cu2: number;    // ‰
  n: number;          // Exponent für Parabel-Rechteck
  eps_c3: number;     // ‰ (Bilineares Diagramm)
  eps_cu3: number;    // ‰
  isHochfest: boolean; // ab C55/67 nach EC2 / DIN 1045-2
}

/**
 * Tabelle 3.1 nach DIN EN 1992-1-1: Festigkeits- und Verformungskenngrößen von Beton
 * Korrigierte Werte für ε_c1, ε_cu1, ε_c2, ε_cu2 ab C55/67
 */
export const CONCRETE: Record<string, ConcreteClassData> = {
  'C12/15': {
    id: 'C12/15', name: 'C12/15', fck: 12, fck_cube: 15, fcm: 20, fctm: 1.6,
    fctk_005: 1.1, fctk_095: 2.0, Ecm: 27000,
    eps_c1: 1.8, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5, n: 2.0, eps_c3: 1.75, eps_cu3: 3.5,
    isHochfest: false
  },
  'C16/20': {
    id: 'C16/20', name: 'C16/20', fck: 16, fck_cube: 20, fcm: 24, fctm: 1.9,
    fctk_005: 1.3, fctk_095: 2.5, Ecm: 29000,
    eps_c1: 1.9, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5, n: 2.0, eps_c3: 1.75, eps_cu3: 3.5,
    isHochfest: false
  },
  'C20/25': {
    id: 'C20/25', name: 'C20/25', fck: 20, fck_cube: 25, fcm: 28, fctm: 2.2,
    fctk_005: 1.5, fctk_095: 2.9, Ecm: 30000,
    eps_c1: 2.0, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5, n: 2.0, eps_c3: 1.75, eps_cu3: 3.5,
    isHochfest: false
  },
  'C25/30': {
    id: 'C25/30', name: 'C25/30', fck: 25, fck_cube: 30, fcm: 33, fctm: 2.6,
    fctk_005: 1.8, fctk_095: 3.3, Ecm: 31000,
    eps_c1: 2.1, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5, n: 2.0, eps_c3: 1.75, eps_cu3: 3.5,
    isHochfest: false
  },
  'C30/37': {
    id: 'C30/37', name: 'C30/37', fck: 30, fck_cube: 37, fcm: 38, fctm: 2.9,
    fctk_005: 2.0, fctk_095: 3.8, Ecm: 33000,
    eps_c1: 2.2, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5, n: 2.0, eps_c3: 1.75, eps_cu3: 3.5,
    isHochfest: false
  },
  'C35/45': {
    id: 'C35/45', name: 'C35/45', fck: 35, fck_cube: 45, fcm: 43, fctm: 3.2,
    fctk_005: 2.2, fctk_095: 4.2, Ecm: 34000,
    eps_c1: 2.25, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5, n: 2.0, eps_c3: 1.75, eps_cu3: 3.5,
    isHochfest: false
  },
  'C40/50': {
    id: 'C40/50', name: 'C40/50', fck: 40, fck_cube: 50, fcm: 48, fctm: 3.5,
    fctk_005: 2.5, fctk_095: 4.6, Ecm: 35000,
    eps_c1: 2.3, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5, n: 2.0, eps_c3: 1.75, eps_cu3: 3.5,
    isHochfest: false
  },
  'C45/55': {
    id: 'C45/55', name: 'C45/55', fck: 45, fck_cube: 55, fcm: 53, fctm: 3.8,
    fctk_005: 2.7, fctk_095: 4.9, Ecm: 36000,
    eps_c1: 2.4, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5, n: 2.0, eps_c3: 1.75, eps_cu3: 3.5,
    isHochfest: false
  },
  'C50/60': {
    id: 'C50/60', name: 'C50/60', fck: 50, fck_cube: 60, fcm: 58, fctm: 4.1,
    fctk_005: 2.9, fctk_095: 5.3, Ecm: 37000,
    eps_c1: 2.45, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5, n: 2.0, eps_c3: 1.75, eps_cu3: 3.5,
    isHochfest: false
  },
  'C55/67': {
    id: 'C55/67', name: 'C55/67 (hochfest)', fck: 55, fck_cube: 67, fcm: 63, fctm: 4.2,
    fctk_005: 3.0, fctk_095: 5.5, Ecm: 38000,
    eps_c1: 2.5, eps_cu1: 3.2, eps_c2: 2.2, eps_cu2: 3.1, n: 1.75, eps_c3: 1.8, eps_cu3: 3.1,
    isHochfest: true
  },
  'C60/75': {
    id: 'C60/75', name: 'C60/75 (hochfest)', fck: 60, fck_cube: 75, fcm: 68, fctm: 4.4,
    fctk_005: 3.1, fctk_095: 5.7, Ecm: 39000,
    eps_c1: 2.6, eps_cu1: 3.0, eps_c2: 2.3, eps_cu2: 2.9, n: 1.6, eps_c3: 1.9, eps_cu3: 2.9,
    isHochfest: true
  },
  'C70/85': {
    id: 'C70/85', name: 'C70/85 (hochfest)', fck: 70, fck_cube: 85, fcm: 78, fctm: 4.6,
    fctk_005: 3.2, fctk_095: 6.0, Ecm: 41000,
    eps_c1: 2.7, eps_cu1: 2.8, eps_c2: 2.4, eps_cu2: 2.7, n: 1.45, eps_c3: 2.0, eps_cu3: 2.7,
    isHochfest: true
  },
  'C80/95': {
    id: 'C80/95', name: 'C80/95 (hochfest)', fck: 80, fck_cube: 95, fcm: 88, fctm: 4.8,
    fctk_005: 3.4, fctk_095: 6.3, Ecm: 42000,
    eps_c1: 2.8, eps_cu1: 2.8, eps_c2: 2.5, eps_cu2: 2.6, n: 1.4, eps_c3: 2.2, eps_cu3: 2.6,
    isHochfest: true
  },
  'C90/105': {
    id: 'C90/105', name: 'C90/105 (hochfest)', fck: 90, fck_cube: 105, fcm: 98, fctm: 5.0,
    fctk_005: 3.5, fctk_095: 6.6, Ecm: 44000,
    eps_c1: 2.8, eps_cu1: 2.8, eps_c2: 2.6, eps_cu2: 2.6, n: 1.4, eps_c3: 2.3, eps_cu3: 2.6,
    isHochfest: true
  }
};

/**
 * Zementbeiwert s nach EC2 3.1.2(6)
 */
export function getCementS(cement: CementClass): number {
  switch (cement) {
    case 'R': return 0.20;
    case 'N': return 0.25;
    case 'S': return 0.38;
  }
}

/**
 * Reifefaktor beta_cc(t) nach EC2 Gl. (3.2)
 */
export function betaCc(t: number, cement: CementClass = 'N'): number {
  if (t <= 0) return 0.001;
  const s = getCementS(cement);
  return Math.exp(s * (1 - Math.sqrt(28 / t)));
}

/**
 * fcm(t) nach EC2 Gl. (3.1)
 */
export function fcmT(fck: number, t: number, cement: CementClass = 'N'): number {
  const fcm = fck + 8;
  return betaCc(t, cement) * fcm;
}

/**
 * fck(t) nach EC2 3.1.2(5):
 * Für t < 28 d gilt fck(t) = fcm(t) - 8 MPa.
 * Für t >= 28 d gilt fck(t) = fck (sofern nicht gesondert nachgewiesen).
 */
export function fckT(fck: number, t: number, cement: CementClass = 'N'): number {
  if (t >= 28) return fck;
  const fcmt = fcmT(fck, t, cement);
  return Math.max(0, fcmt - 8);
}

/**
 * Ecm(t) nach EC2 Gl. (3.5)
 */
export function EcmT(fck: number, t: number, cement: CementClass = 'N'): number {
  const conc = Object.values(CONCRETE).find(c => c.fck === fck) || CONCRETE['C45/55'];
  const fcm = fck + 8;
  const fcmt = fcmT(fck, t, cement);
  if (fcmt <= 0) return 0;
  return Math.pow(fcmt / fcm, 0.3) * conc.Ecm;
}

/**
 * fctm(t) nach EC2 Gl. (3.4)
 */
export function fctmT(fck: number, t: number, cement: CementClass = 'N'): number {
  const conc = Object.values(CONCRETE).find(c => c.fck === fck) || CONCRETE['C45/55'];
  const bcc = betaCc(t, cement);
  const alpha = t < 28 ? 1.0 : 2 / 3;
  return Math.pow(bcc, alpha) * conc.fctm;
}

/**
 * Äquivalentes Betonalter unter Temperatureinfluss nach EC2 Anhang B.1 Gl. (B.10)
 * t_T = sum( exp(-(4000/(273 + T) - 13.65)) * delta_t )
 */
export function tempAdjustedAge(tDays: number, tempC: number): number {
  if (tempC === 20) return tDays;
  const alpha = Math.exp(-(4000 / (273 + tempC) - 13.65));
  return tDays * alpha;
}

/**
 * Biegezugfestigkeit nach EC2 3.1.8 Gl. (3.23)
 * f_ctm,fl = max((1.6 - h/1000) * fctm, fctm) mit h in mm
 */
export function fctmFl(fctm: number, hMm: number): number {
  const factor = Math.max(1.0, 1.6 - hMm / 1000);
  return factor * fctm;
}

/**
 * Kriechbeiwert phi(inf, t0) nach EC2 Anhang B.1
 * @param fck charakteristische Zylinderdruckfestigkeit in MPa
 * @param t0 Belastungsalter in Tagen (bereits temperaturkorrigiert)
 * @param cement Zementklasse 'S', 'N', 'R'
 * @param h0 wirksame Bauteildicke in mm (2*Ac/u)
 * @param RH relative Luftfeuchte in % (z.B. 70 für 70%)
 */
export function creep(
  fck: number,
  t0: number,
  cement: CementClass = 'N',
  h0: number = 300,
  RH: number = 70
): number {
  const fcm = fck + 8;
  
  // Zementabhängiges wirksames Alter t0,eff nach Gl. (B.9)
  const alphaMap = { S: -1, N: 0, R: 1 };
  const alphaExp = alphaMap[cement];
  const t0_eff = Math.max(0.5, t0 * Math.pow(9 / (2 + Math.pow(t0, 1.2)) + 1, alphaExp));

  // Koeffizienten für fcm > 35 MPa
  const alpha1 = Math.pow(35 / fcm, 0.7);
  const alpha2 = Math.pow(35 / fcm, 0.2);
  const alpha3 = Math.pow(35 / fcm, 0.5);

  // phi_RH nach Gl. (B.3a/b)
  let phi_RH: number;
  if (fcm <= 35) {
    phi_RH = 1 + (1 - RH / 100) / (0.1 * Math.pow(Math.max(10, h0), 1 / 3));
  } else {
    phi_RH = (1 + ((1 - RH / 100) / (0.1 * Math.pow(Math.max(10, h0), 1 / 3))) * alpha1) * alpha2;
  }

  // beta(fcm) nach Gl. (B.4)
  const beta_fcm = 16.8 / Math.sqrt(fcm);

  // beta(t0) nach Gl. (B.5)
  const beta_t0 = 1 / (0.1 + Math.pow(t0_eff, 0.20));

  // phi_0 = phi_RH * beta(fcm) * beta(t0)
  const phi_0 = phi_RH * beta_fcm * beta_t0;

  // Für Endkriechbeiwert phi(inf, t0) ist beta_c(inf, t0) = 1.0
  return phi_0;
}

/**
 * Endschwindmaß eps_cs(inf) nach EC2 Anhang B.2
 * Gesamtschwinden = Trocknungsschwinden eps_cd + Autogenes Schwinden eps_ca
 * Rückgabewert in Promille (‰)
 */
export function shrinkage(
  fck: number,
  cement: CementClass = 'N',
  h0: number = 300,
  RH: number = 70
): { eps_cs: number; eps_cd: number; eps_ca: number } {
  const fcm = fck + 8;

  // 1. Autogenes Schwinden nach Gl. (3.11) & (3.12)
  // eps_ca(inf) = 2.5 * (fck - 10) * 10^-6
  const eps_ca_inf = 2.5 * Math.max(0, fck - 10) * 1e-3; // in Promille

  // 2. Trocknungsschwinden nach Gl. (B.11) & Tab. 3.2
  // k_h Beiwert aus wirksamer Dicke h0
  let k_h = 1.0;
  if (h0 <= 100) k_h = 1.0;
  else if (h0 <= 200) k_h = 0.85;
  else if (h0 <= 300) k_h = 0.75;
  else if (h0 <= 500) k_h = 0.70;
  else k_h = 0.65;

  // beta_RH nach Gl. (B.12)
  const beta_RH = 1.55 * (1 - Math.pow(RH / 100, 3));

  // eps_cd0 nach Gl. (B.11)
  const alpha_ds1Map = { S: 3, N: 4, R: 6 };
  const alpha_ds2 = 0.11;
  const alpha_ds1 = alpha_ds1Map[cement];

  const eps_cd0 = 0.85 * ((220 + 110 * alpha_ds1) * Math.exp(-alpha_ds2 * (fcm / 10))) * 1e-3 * beta_RH;
  const eps_cd_inf = k_h * eps_cd0; // in Promille

  const eps_cs = eps_ca_inf + eps_cd_inf;
  return { eps_cs, eps_cd: eps_cd_inf, eps_ca: eps_ca_inf };
}

/**
 * Reibungs- und Keilschlupfberechnung im Spannglied nach EC2 5.10.5
 * @param p0 Spannkraft an der Presse in kN
 * @param Ap Spannstahlquerschnitt in mm²
 * @param Ep E-Modul des Spannstahls in MPa
 * @param mu Reibungsbeiwert (z.B. 0.19..0.24)
 * @param theta Gesamte planmäßige Umlenkwinkel in rad
 * @param k ungewollter Knickwinkel / Längenauslenkung in 1/m (z.B. 0.005)
 * @param L Gesamtlänge des Spannglieds in m
 * @param w Keilschlupf am Anker in mm (z.B. 4..6 mm)
 * @param x betrachtete Stelle ab Spannanker in m (z.B. L/2 für Feldmitte)
 */
export function frictionSlip(
  p0: number,
  Ap: number,
  Ep: number,
  mu: number,
  theta: number,
  k: number,
  L: number,
  w: number,
  x: number = L / 2
): {
  sigma_0: number;          // MPa
  sigma_x_frict: number;    // MPa (nur Reibung)
  l_set: number;            // m (Einflusslänge des Keilschlupfs)
  delta_sigma_slip: number; // MPa (Spannungsabfall am Ort x)
  sigma_x_final: number;    // MPa (nach Reibung und Schlupf)
  lossPctFriction: number;  // %
  lossPctSlip: number;      // %
  lossPctTotal: number;     // %
} {
  const sigma_0 = (p0 * 1000) / Math.max(1, Ap);
  
  // Reibungsgradient p = (d sigma / dx) in MPa/m am Anker
  // sigma(x) = sigma_0 * exp(-mu * (theta * x / L + k * x))
  const exponent_L = mu * (theta + k * L);
  const p_gradient = L > 0 ? (sigma_0 * (1 - Math.exp(-exponent_L))) / L : 0.01;

  // Einflusslänge l_set nach EC2 5.10.5.3:
  // l_set = sqrt(w * Ep / p_gradient) in m
  const l_set = p_gradient > 0 ? Math.min(L, Math.sqrt((w * Ep) / (p_gradient * 1000))) : 0;

  // Reibungsspannung am Ort x
  const exponent_x = mu * (theta * (x / Math.max(0.1, L)) + k * x);
  const sigma_x_frict = sigma_0 * Math.exp(-exponent_x);

  // Schlupf-Spannungsverlust am Ort x
  let delta_sigma_slip = 0;
  if (x <= l_set && l_set > 0) {
    // Dreiecksförmiger Spannungsverlust, am Anker 2 * p * l_set
    delta_sigma_slip = 2 * p_gradient * (l_set - x);
  }

  const sigma_x_final = Math.max(0, sigma_x_frict - delta_sigma_slip);
  const lossPctFriction = ((sigma_0 - sigma_x_frict) / sigma_0) * 100;
  const lossPctSlip = (delta_sigma_slip / sigma_0) * 100;
  const lossPctTotal = ((sigma_0 - sigma_x_final) / sigma_0) * 100;

  return {
    sigma_0,
    sigma_x_frict,
    l_set,
    delta_sigma_slip,
    sigma_x_final,
    lossPctFriction,
    lossPctSlip,
    lossPctTotal
  };
}

/**
 * Elastischer Schlupf / Verformungsverlust beim sukzessiven Spannen nach EC2 5.10.5.1
 * Delta_sigma_p,el = ((n - 1) / (2 * n)) * (Ep / Ecm_t0) * sigma_c,p0
 */
export function elasticLoss(
  Ep: number,
  Ecm_t0: number,
  sigma_c_p0: number,
  nTendons: number = 4
): number {
  if (nTendons <= 1 || Ecm_t0 <= 0) return 0;
  const j = (nTendons - 1) / (2 * nTendons);
  return j * (Ep / Ecm_t0) * Math.abs(sigma_c_p0);
}

/**
 * Relaxation des Spannstahls nach EC2 3.3.2 Gl. (3.28) bis (3.30)
 * Berechnet für t = 500 000 Stunden (≈ 57 Jahre, Endrelaxation)
 * @param sigma_pi Initiale Spannstahlspannung (nach Sofortverlusten) in MPa
 * @param fpk charakteristische Zugfestigkeit in MPa
 * @param relClass Relaxationsklasse 1 (Draht/Litze normal), 2 (Litze sehr niedrig), 3 (Stabstahl)
 * @param tHours Zeitdauer in Stunden (Standard: 500 000 h)
 * @returns Spannungsverlust Delta_sigma_pr in MPa
 */
export function relaxation(
  sigma_pi: number,
  fpk: number,
  relClass: RelaxationClass = 2,
  tHours: number = 500000
): { delta_sigma_pr: number; pctLoss: number } {
  const mu = sigma_pi / fpk;
  if (mu <= 0.50) return { delta_sigma_pr: 0, pctLoss: 0 };

  let rho1000 = 0.025; // 2.5% für Klasse 2
  let k_exp = 0.75;

  if (relClass === 1) {
    rho1000 = 0.08;
    k_exp = 0.75;
  } else if (relClass === 2) {
    rho1000 = 0.025;
    k_exp = 0.75;
  } else {
    rho1000 = 0.04;
    k_exp = 0.75;
  }

  // Delta_sigma_pr / sigma_pi = 0.66 * rho1000 * e^(9.1 * mu) * (t / 1000)^k * 10^-5
  // Nach EC2 Gl. (3.29) für Klasse 2:
  // Delta_sigma_pr / sigma_pi = 0.66 * 2.5 * e^(9.1 * mu) * (t / 1000)^(0.75 * (1 - mu)) * 10^-5
  const exponentT = k_exp * (1 - mu);
  const ratio = 0.66 * (rho1000 * 100) * Math.exp(9.1 * mu) * Math.pow(tHours / 1000, exponentT) * 1e-5;
  const delta_sigma_pr = Math.min(sigma_pi * 0.25, sigma_pi * ratio);
  const pctLoss = (delta_sigma_pr / sigma_pi) * 100;

  return { delta_sigma_pr, pctLoss };
}

/**
 * Zeitabhängige Verluste aus Kriechen, Schwinden und Relaxation nach EC2 Gl. (5.46)
 * 
 * Delta_sigma_p,c+s+r = ( eps_cs * Ep + 0.8 * Delta_sigma_pr + (Ep / Ecm) * phi * |sigma_c,QP| ) /
 *                       ( 1 + (Ep / Ecm) * (Ap / Ac) * (1 + (Ac / Ic) * zp^2) * (1 + 0.8 * phi) )
 * 
 * Alle Spannungen in MPa, Flächen in mm², Längen in mm, eps_cs in ‰ oder dimensionslos.
 */
export function timeDependentLoss(
  Ep: number,
  Ecm: number,
  Ap: number,
  Ac: number,
  Ic: number,
  zp: number,
  phi: number,
  eps_cs_permille: number,
  delta_sigma_pr: number,
  sigma_c_QP: number
): {
  delta_sigma_p_csr: number;
  numerator: number;
  denominator: number;
  lossShrinkage: number;
  lossCreep: number;
  lossRelaxation: number;
} {
  const alpha_e = Ep / Math.max(1, Ecm);
  const eps_cs = eps_cs_permille * 1e-3; // in dimensionslose Dehnung umrechnen

  const z2_term = 1 + (Ac / Math.max(1, Ic)) * Math.pow(zp, 2);
  const rho_p = Ap / Math.max(1, Ac);

  // Zähleranteile:
  const num_shrinkage = eps_cs * Ep;
  const num_relaxation = 0.8 * delta_sigma_pr;
  const num_creep = alpha_e * phi * Math.abs(sigma_c_QP);
  const numerator = num_shrinkage + num_relaxation + num_creep;

  // Nenner:
  const denominator = 1 + alpha_e * rho_p * z2_term * (1 + 0.8 * phi);
  const delta_sigma_p_csr = denominator > 0 ? numerator / denominator : 0;

  return {
    delta_sigma_p_csr,
    numerator,
    denominator,
    lossShrinkage: num_shrinkage / denominator,
    lossCreep: num_creep / denominator,
    lossRelaxation: num_relaxation / denominator
  };
}
