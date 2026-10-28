/**
 * Anteil rezyklierter Gesteinskörnung im Ressourcen-Simulator (Umsetzung 29.10.2026, T12-RE-1 mit T9-GL-1).
 * Vorher pauschal 50 % der Gesteinskörnung. Jetzt nach DIN 1045-2:2023-08, Anhang E: höchstens 45 Vol.-% der groben
 * Gesteinskörnung (> 2 mm) als Typ 1 für X0, XC1–XC4, XF1, XF3 (Typ 2: 35 Vol.-%), in anderen Expositionsklassen weniger
 * (vorläufig, F-Freigabe Beton am Weißdruck DIN 1045-2 Anhang E; Betonklasse BK-N/BK-E nach DIN 1045-1000).
 * Lehrwerte: Gesteinskörnung 1,8 t je m³ Beton, Anteil der groben Gesteinskörnung 70 % (Sieblinie zwischen A16 und B16);
 * der Volumenanteil wird näherungsweise als Massenanteil verwendet. Reiner Rechenkern – geprüft in tests/rcBeton.test.ts.
 */
export const GESTEINSKOERNUNG_T_JE_M3 = 1.8;
export const GROBANTEIL_LEHRWERT = 0.7;
/** Höchstanteile rezyklierter Gesteinskörnung an der groben Gesteinskörnung in Vol.-%/100 (DIN 1045-2:2023-08, Anhang E) */
export const RC_HOECHSTANTEIL_GROB = { typ1: 0.45, typ2: 0.35 } as const;
export type RcTyp = keyof typeof RC_HOECHSTANTEIL_GROB;

export interface RcAufteilung {
  /** primäre (natürliche) Gesteinskörnung in t */
  primaer: number;
  /** rezyklierte Gesteinskörnung in t */
  rezykliert: number;
  /** Anteil der rezyklierten an der gesamten Gesteinskörnung (0 … 1) */
  anteilGesamt: number;
}

/** Aufteilung der Gesteinskörnung für ein Betonvolumen in m³; mitRc = false: nur Primärkörnung */
export function rcAufteilung(volumenM3: number, mitRc: boolean, typ: RcTyp = 'typ1'): RcAufteilung {
  const gesamt = Math.max(0, Number.isFinite(volumenM3) ? volumenM3 : 0) * GESTEINSKOERNUNG_T_JE_M3;
  const anteilGesamt = mitRc ? GROBANTEIL_LEHRWERT * RC_HOECHSTANTEIL_GROB[typ] : 0;
  const rezykliert = gesamt * anteilGesamt;
  return { primaer: gesamt - rezykliert, rezykliert, anteilGesamt };
}
