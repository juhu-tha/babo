/**
 * Rezyklierte Gesteinskörnung im Beton: zulässige Höchstanteile und Massenbilanz für den Bauteil-Simulator
 * im Modul „Ressourceneffizienz“ (T12-RE-1, Umsetzung 29.10.2026).
 *
 * Höchstanteile [Vol.-% der groben Gesteinskörnung, Typ 1 / Typ 2] wie im Modul „Ausgangsstoffe“ (grundlagen)
 * nach DIN 1045-2:2023-08, Anhang E: X0–XC4, XF1, XF3 ≤ 45/35; XA1 ≤ 25/25; XD1/XD2/XS1/XS2/XF2/XF4 ≤ 30/20;
 * nicht zulässig in XA2, XA3, XM. Vorläufig, F-Freigabe bis zur Prüfung am Normtext (vgl. T9-GL-1).
 */

export type RcTyp = 'typ1' | 'typ2';
export type RcExpositionsgruppe = 'x0_xc_xf1_xf3' | 'xa1' | 'xd_xs_xf2_xf4' | 'xa2_xa3_xm';

export const RC_HOECHSTANTEIL: Record<RcExpositionsgruppe, { label: string; typ1: number; typ2: number }> = {
  x0_xc_xf1_xf3: { label: 'X0, XC1–XC4, XF1, XF3', typ1: 0.45, typ2: 0.35 },
  xa1: { label: 'XA1', typ1: 0.25, typ2: 0.25 },
  xd_xs_xf2_xf4: { label: 'XD1, XD2, XS1, XS2, XF2, XF4', typ1: 0.30, typ2: 0.20 },
  xa2_xa3_xm: { label: 'XA2, XA3, XM (nicht zulässig)', typ1: 0, typ2: 0 },
};

/** Gesteinskörnung je m³ Beton [t/m³] (Lehrwert des Simulators). */
export const GESTEINSKOERNUNG_T_JE_M3 = 1.8;
/** Anteil der groben Gesteinskörnung (> 2 mm) an der Gesteinskörnung (Lehrwert, Sieblinie etwa A/B 16). */
export const ANTEIL_GROB = 0.7;

export interface RcBilanz {
  hoechstanteilGrob: number; // zulässiger Anteil an der groben Gesteinskörnung [–]
  anteilGesamt: number;      // Anteil an der gesamten Gesteinskörnung [–]
  primaer: number;           // Primär-Gesteinskörnung [t]
  sekundaer: number;         // rezyklierte Gesteinskörnung [t]
}

/**
 * Massenbilanz der Gesteinskörnung für V m³ Beton bei Ausschöpfen des Höchstanteils.
 * Vereinfachung: Vol.-% = M.-% (die geringere Kornrohdichte der RC-Körnung bleibt unberücksichtigt).
 */
export function rcBilanz(volumen: number, typ: RcTyp, gruppe: RcExpositionsgruppe, mitRc = true): RcBilanz {
  const gesamt = Math.max(0, volumen) * GESTEINSKOERNUNG_T_JE_M3;
  const hoechstanteilGrob = mitRc ? RC_HOECHSTANTEIL[gruppe][typ] : 0;
  const anteilGesamt = hoechstanteilGrob * ANTEIL_GROB;
  const sekundaer = gesamt * anteilGesamt;
  return { hoechstanteilGrob, anteilGesamt, primaer: gesamt - sekundaer, sekundaer };
}
