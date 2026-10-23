/**
 * Zentrale Normwerte-Registry
 * Rechenwerte für Deutschland: Eurocodes immer mit Nationalem Anhang (NA DE).
 */

export const EC2_NA_DE = {
  quelle: "DIN EN 1992-1-1 + NA (DE)",
  alphaCC: 0.85,
  gammaC: 1.5,
  gammaS: 1.15,
  CRdc_Querkraft: 0.15 / 1.5,
  vmin_faktor: 0.0525 / 1.5 /* d<=600 mm */,
  rhoWmin: (fctm: number, fyk: number) => (0.16 * fctm) / fyk,
  cotThetaMin: 1.0,
  cotThetaMax: 3.0,
  nu1: 0.75,
  betaInnen: 1.10,
  betaRand: 1.40,
  betaEcke: 1.50,
  alpha6_33: 1.15,
  CRdc_Durchstanz: 0.18 / 1.5,
  vRdMaxFaktor_u1: 1.4,
  AsMinStuetze: (NEd: number, fyd: number) => (0.15 * Math.abs(NEd)) / fyd,
  e0Min_mm: (h: number) => Math.max(h / 30, 20),
  wmax_StB: {
    X0: 0.4,
    XC1: 0.4,
    XC2: 0.3,
    XC3: 0.3,
    XC4: 0.3,
    XD1: 0.3,
    XD2: 0.3,
    XD3: 0.3,
    XS1: 0.3,
    XS2: 0.3,
    XS3: 0.3,
  } as Record<string, number>,
  kAsMin: (h_mm: number) =>
    h_mm <= 300 ? 0.8 : h_mm >= 800 ? 0.5 : 0.8 - (0.3 * (h_mm - 300)) / 500,
  fctEffMinLangzeit: 3.0,
};

export const DIN1045_2 = {
  quelle: "DIN 1045-2:2023-08 / DIN EN 206-1",
  kFlugasche: 0.4,
  kSilikastaub: 1.0,
  kHuettensand: null as number | null /* DIN 1045-2:2023-08, 5.2.5.2.5 enthält einen k-Wert-Ansatz für Hüttensandmehl; Zahlenwert hier nicht hinterlegt */,
};

export const DIN1045_3_NACHBEHANDLUNG = {
  quelle: "DIN 1045-3:2023-08 / DIN EN 13670 (Tabelle Mindestdauer der Nachbehandlung)",
  mindestdauerTage: {
    ge25: { schnell: 1, mittel: 2, langsam: 2, sehr_langsam: 3 },
    '15_25': { schnell: 1, mittel: 2, langsam: 4, sehr_langsam: 5 },
    '10_15': { schnell: 2, mittel: 4, langsam: 7, sehr_langsam: 10 },
    '5_10': { schnell: 3, mittel: 6, langsam: 10, sehr_langsam: 15 },
  },
  x0_xc1_tage: 0.5,
};

// Re-Export aller detaillierten Normen-Stammdaten aus dem zentralen standards/-Register
export * from './standards';

