/**
 * Zentrale Normen-Datenbank: DIN EN 1992-1-1:2011-01 + A1:2015-03 (Eurocode 2, 1. Generation, bauaufsichtlich eingeführt)
 * inkl. Nationaler Anhang Deutschland DIN EN 1992-1-1/NA:2013-04 + NA/A1:2015-12 (NA DE)
 * (Konsistenzprüfung 29.10.2026: Ausgabeangabe vorher „2023-08“ – eine solche DIN-Ausgabe gibt es nicht; die 2. Generation
 * ist DIN EN 1992-1-1:2025-09, siehe src/data/centralNormenRegistry.ts. ε_c1 für C12/15 … C45/55 an Tab. 3.1 angeglichen;
 * maßgebend sind die Werte CONCRETE in src/utils/ec2Spannbeton.ts, Abgleich in tests/konsistenz1029.test.ts.)
 * Single Source of Truth für Festigkeits- und Verformungseigenschaften nach Tabelle 3.1,
 * Bemessungsbeiwerte, Querkraft-, Durchstanz- und Rissbreitenparameter.
 * 
 * Quelle: DIN EN 1992-1-1:2011-01, Tab. 3.1 & DIN EN 1992-1-1/NA:2013-04
 */

export interface BetonKennwertRecord {
  klasse: string; // z.B. "C25/30"
  f_ck: number; // MPa (Zylinder)
  f_ck_cube: number; // MPa (Würfel 150mm)
  f_cm: number; // MPa (Mittelwert)
  f_ctm: number; // MPa (Mittelwert Zugfestigkeit)
  f_ctk_0_05: number; // MPa (5%-Fraktil)
  f_ctk_0_95: number; // MPa (95%-Fraktil)
  E_cm: number; // GPa (Elastizitätsmodul)
  epsilon_c1: number; // ‰ (Dehnung bei Höchstspannung)
  epsilon_cu1: number; // ‰ (Bruchdehnung)
  epsilon_c2: number; // ‰ (Parabel-Rechteck)
  epsilon_cu2: number; // ‰ (Bruchdehnung Parabel-Rechteck)
  n: number; // Exponent Parabel-Rechteck
  epsilon_c3: number; // ‰ (Bilinear)
  epsilon_cu3: number; // ‰ (Bruchdehnung bilinear)
}

/**
 * Vollständige Kennwertematrix nach DIN EN 1992-1-1:2011-01 Tabelle 3.1
 * für Normalbetone C8/10 bis C100/115.
 */
export const EUROCODE2_TABELLE_3_1: Record<string, BetonKennwertRecord> = {
  'C8/10': {
    klasse: 'C8/10',
    f_ck: 8,
    f_ck_cube: 10,
    f_cm: 16,
    f_ctm: 1.2,
    f_ctk_0_05: 0.8,
    f_ctk_0_95: 1.6,
    E_cm: 25.0,
    epsilon_c1: 1.5,
    epsilon_cu1: 3.5,
    epsilon_c2: 2.0,
    epsilon_cu2: 3.5,
    n: 2.0,
    epsilon_c3: 1.75,
    epsilon_cu3: 3.5
  },
  'C12/15': {
    klasse: 'C12/15',
    f_ck: 12,
    f_ck_cube: 15,
    f_cm: 20,
    f_ctm: 1.6,
    f_ctk_0_05: 1.1,
    f_ctk_0_95: 2.0,
    E_cm: 27.0,
    epsilon_c1: 1.8,
    epsilon_cu1: 3.5,
    epsilon_c2: 2.0,
    epsilon_cu2: 3.5,
    n: 2.0,
    epsilon_c3: 1.75,
    epsilon_cu3: 3.5
  },
  'C16/20': {
    klasse: 'C16/20',
    f_ck: 16,
    f_ck_cube: 20,
    f_cm: 24,
    f_ctm: 1.9,
    f_ctk_0_05: 1.3,
    f_ctk_0_95: 2.5,
    E_cm: 29.0,
    epsilon_c1: 1.9,
    epsilon_cu1: 3.5,
    epsilon_c2: 2.0,
    epsilon_cu2: 3.5,
    n: 2.0,
    epsilon_c3: 1.75,
    epsilon_cu3: 3.5
  },
  'C20/25': {
    klasse: 'C20/25',
    f_ck: 20,
    f_ck_cube: 25,
    f_cm: 28,
    f_ctm: 2.2,
    f_ctk_0_05: 1.5,
    f_ctk_0_95: 2.9,
    E_cm: 30.0,
    epsilon_c1: 2.0,
    epsilon_cu1: 3.5,
    epsilon_c2: 2.0,
    epsilon_cu2: 3.5,
    n: 2.0,
    epsilon_c3: 1.75,
    epsilon_cu3: 3.5
  },
  'C25/30': {
    klasse: 'C25/30',
    f_ck: 25,
    f_ck_cube: 30,
    f_cm: 33,
    f_ctm: 2.6,
    f_ctk_0_05: 1.8,
    f_ctk_0_95: 3.3,
    E_cm: 31.0,
    epsilon_c1: 2.1,
    epsilon_cu1: 3.5,
    epsilon_c2: 2.0,
    epsilon_cu2: 3.5,
    n: 2.0,
    epsilon_c3: 1.75,
    epsilon_cu3: 3.5
  },
  'C30/37': {
    klasse: 'C30/37',
    f_ck: 30,
    f_ck_cube: 37,
    f_cm: 38,
    f_ctm: 2.9,
    f_ctk_0_05: 2.0,
    f_ctk_0_95: 3.8,
    E_cm: 33.0,
    epsilon_c1: 2.2,
    epsilon_cu1: 3.5,
    epsilon_c2: 2.0,
    epsilon_cu2: 3.5,
    n: 2.0,
    epsilon_c3: 1.75,
    epsilon_cu3: 3.5
  },
  'C35/45': {
    klasse: 'C35/45',
    f_ck: 35,
    f_ck_cube: 45,
    f_cm: 43,
    f_ctm: 3.2,
    f_ctk_0_05: 2.2,
    f_ctk_0_95: 4.2,
    E_cm: 34.0,
    epsilon_c1: 2.25,
    epsilon_cu1: 3.5,
    epsilon_c2: 2.0,
    epsilon_cu2: 3.5,
    n: 2.0,
    epsilon_c3: 1.75,
    epsilon_cu3: 3.5
  },
  'C40/50': {
    klasse: 'C40/50',
    f_ck: 40,
    f_ck_cube: 50,
    f_cm: 48,
    f_ctm: 3.5,
    f_ctk_0_05: 2.5,
    f_ctk_0_95: 4.6,
    E_cm: 35.0,
    epsilon_c1: 2.3,
    epsilon_cu1: 3.5,
    epsilon_c2: 2.0,
    epsilon_cu2: 3.5,
    n: 2.0,
    epsilon_c3: 1.75,
    epsilon_cu3: 3.5
  },
  'C45/55': {
    klasse: 'C45/55',
    f_ck: 45,
    f_ck_cube: 55,
    f_cm: 53,
    f_ctm: 3.8,
    f_ctk_0_05: 2.7,
    f_ctk_0_95: 4.9,
    E_cm: 36.0,
    epsilon_c1: 2.4,
    epsilon_cu1: 3.5,
    epsilon_c2: 2.0,
    epsilon_cu2: 3.5,
    n: 2.0,
    epsilon_c3: 1.75,
    epsilon_cu3: 3.5
  },
  'C50/60': {
    klasse: 'C50/60',
    f_ck: 50,
    f_ck_cube: 60,
    f_cm: 58,
    f_ctm: 4.1,
    f_ctk_0_05: 2.9,
    f_ctk_0_95: 5.3,
    E_cm: 37.0,
    epsilon_c1: 2.45,
    epsilon_cu1: 3.5,
    epsilon_c2: 2.0,
    epsilon_cu2: 3.5,
    n: 2.0,
    epsilon_c3: 1.75,
    epsilon_cu3: 3.5
  },
  'C55/67': {
    klasse: 'C55/67',
    f_ck: 55,
    f_ck_cube: 67,
    f_cm: 63,
    f_ctm: 4.2,
    f_ctk_0_05: 3.0,
    f_ctk_0_95: 5.5,
    E_cm: 38.0,
    epsilon_c1: 2.5,
    epsilon_cu1: 3.2,
    epsilon_c2: 2.2,
    epsilon_cu2: 3.1,
    n: 1.75,
    epsilon_c3: 1.8,
    epsilon_cu3: 3.1
  },
  'C60/75': {
    klasse: 'C60/75',
    f_ck: 60,
    f_ck_cube: 75,
    f_cm: 68,
    f_ctm: 4.4,
    f_ctk_0_05: 3.1,
    f_ctk_0_95: 5.7,
    E_cm: 39.0,
    epsilon_c1: 2.6,
    epsilon_cu1: 3.0,
    epsilon_c2: 2.3,
    epsilon_cu2: 2.9,
    n: 1.6,
    epsilon_c3: 1.9,
    epsilon_cu3: 2.9
  },
  'C70/85': {
    klasse: 'C70/85',
    f_ck: 70,
    f_ck_cube: 85,
    f_cm: 78,
    f_ctm: 4.6,
    f_ctk_0_05: 3.2,
    f_ctk_0_95: 6.0,
    E_cm: 41.0,
    epsilon_c1: 2.7,
    epsilon_cu1: 2.8,
    epsilon_c2: 2.4,
    epsilon_cu2: 2.7,
    n: 1.45,
    epsilon_c3: 2.0,
    epsilon_cu3: 2.7
  },
  'C80/95': {
    klasse: 'C80/95',
    f_ck: 80,
    f_ck_cube: 95,
    f_cm: 88,
    f_ctm: 4.8,
    f_ctk_0_05: 3.4,
    f_ctk_0_95: 6.3,
    E_cm: 42.0,
    epsilon_c1: 2.8,
    epsilon_cu1: 2.8,
    epsilon_c2: 2.5,
    epsilon_cu2: 2.6,
    n: 1.4,
    epsilon_c3: 2.2,
    epsilon_cu3: 2.6
  },
  'C90/105': {
    klasse: 'C90/105',
    f_ck: 90,
    f_ck_cube: 105,
    f_cm: 98,
    f_ctm: 5.0,
    f_ctk_0_05: 3.5,
    f_ctk_0_95: 6.6,
    E_cm: 44.0,
    epsilon_c1: 2.8,
    epsilon_cu1: 2.8,
    epsilon_c2: 2.6,
    epsilon_cu2: 2.6,
    n: 1.4,
    epsilon_c3: 2.3,
    epsilon_cu3: 2.6
  },
  'C100/115': {
    klasse: 'C100/115',
    f_ck: 100,
    f_ck_cube: 115,
    f_cm: 108,
    f_ctm: 5.2,
    f_ctk_0_05: 3.6,
    f_ctk_0_95: 6.9,
    E_cm: 45.0,
    epsilon_c1: 2.8,
    epsilon_cu1: 2.8,
    epsilon_c2: 2.6,
    epsilon_cu2: 2.6,
    n: 1.4,
    epsilon_c3: 2.4,
    epsilon_cu3: 2.6
  }
};

/**
 * Teilsicherheitsbeiwerte und Bemessungsbeiwerte nach DIN EN 1992-1-1:2011-01 & NA DE
 */
export const EUROCODE2_BEMESSUNGSPARAMETER = {
  norm: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 & DIN EN 1992-1-1/NA:2013-04 + NA/A1:2015-12',
  gammaC: 1.50, // Teilsicherheitsbeiwert Beton (GZT)
  gammaS: 1.15, // Teilsicherheitsbeiwert Betonstahl (GZT)
  alphaCC: 0.85, // Dauerstandsfaktor für Druckbeanspruchung (in Deutschland NA DE: alpha_cc = 0,85)
  alphaCT: 0.85, // Dauerstandsfaktor für zentrischen Zug
  Es: 200000, // Elastizitätsmodul Betonstahl in MPa (200 GPa)
  f_yd: (f_yk: number) => f_yk / 1.15,
  f_cd: (f_ck: number) => (0.85 * f_ck) / 1.50
};
