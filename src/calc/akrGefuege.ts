/**
 * Lehrmodell der AKR-Gefügesimulation (Modul „Betonkorrosion“, Reiter „AKR-Gefügesimulation“).
 *
 * Lehrmodell, vorläufig, F-Freigabe (nicht aus der Alkali-Richtlinie abgeleitet): Alle Faktoren und Schwellen
 * sind schematisch gewählt. Die DAfStb-Alkali-Richtlinie legt keine Gel-Drücke, Rissweiten oder Dehnungen fest,
 * sondern Maßnahmen je Alkaliempfindlichkeitsklasse, Zementgehalt und Feuchtigkeitsklasse (Reiter „Alkalitreiben“).
 *
 *   AKR ausgelöst, wenn Gesteinskörnung E II/E III, Feuchtigkeitsklasse ≠ WO und Na₂O-Äq. > 0,60 M.-%
 *     (0,60 M.-% = NA-Grenze für CEM I nach DIN 1164-10; für andere Zementarten gelten höhere Grenzen)
 *   p_max  = min(13,5; (Na₂O-Äq. − 0,50) · f_E · f_W · 7,5)        in MPa
 *   p(t)   = p_max · min(1; t/15)^1,4                               t in Jahren
 *   Riss, wenn p ≥ f_ctm = 3,0 MPa:
 *     w    = min(2,8; (p − f_ctm) · 0,28 · t/10)                    in mm
 *     ε    = min(3,5; 0,4 + 1,1 · w)                                in mm/m
 *   f_E: E I 0, E II 0,65, E III 1,35;  f_W: WO 0, WF 1,0, WA 1,5, WS 1,85
 * Reiner Rechenkern – geprüft in tests/akrGefuege.test.ts.
 */

export type AkrKlasseE = 'E1' | 'E2' | 'E3';
export type AkrFeuchte = 'WO' | 'WF' | 'WA' | 'WS';
export type AkrStufe = 'keine' | 'latenz' | 'mikroriss' | 'netzriss' | 'stark';

/** NA-Grenze CEM I (DIN 1164-10), im Lehrmodell als Auslöseschwelle verwendet */
export const AKR_NA_GRENZE_CEM_I = 0.60;
/** Lehrmodell: mittlere Zugfestigkeit als Rissschwelle (≈ C30/37) */
export const AKR_FCTM = 3.0;
/** Lehrmodell, vorläufig (siehe Kopf): Feuchtefaktoren */
export const AKR_FAKTOR_FEUCHTE: Record<AkrFeuchte, number> = { WO: 0, WF: 1.0, WA: 1.5, WS: 1.85 };
/** Lehrmodell, vorläufig (siehe Kopf): Reaktivitätsfaktoren der Gesteinskörnung */
export const AKR_FAKTOR_E: Record<AkrKlasseE, number> = { E1: 0, E2: 0.65, E3: 1.35 };

export interface AkrGefuegeErgebnis {
  ausgeloest: boolean;
  pGel: number;
  gerissen: boolean;
  w: number;
  dehnung: number;
  stufe: AkrStufe;
}

export function akrGefuege(na2oAeq: number, feuchte: AkrFeuchte, jahre: number, klasse: AkrKlasseE): AkrGefuegeErgebnis {
  const ausgeloest = klasse !== 'E1' && feuchte !== 'WO' && na2oAeq > AKR_NA_GRENZE_CEM_I;
  const ueberschuss = Math.max(0, na2oAeq - 0.50);
  const fortschritt = Math.min(1, Math.max(0, jahre) / 15);
  const pMax = ausgeloest ? Math.min(13.5, ueberschuss * AKR_FAKTOR_E[klasse] * AKR_FAKTOR_FEUCHTE[feuchte] * 7.5) : 0;
  const pGel = pMax * Math.pow(fortschritt, 1.4);
  const gerissen = pGel >= AKR_FCTM;
  const w = gerissen ? Math.min(2.8, (pGel - AKR_FCTM) * 0.28 * (jahre / 10)) : 0;
  const dehnung = gerissen ? Math.min(3.5, 0.4 + w * 1.1) : 0;
  let stufe: AkrStufe = 'keine';
  if (ausgeloest) stufe = !gerissen ? 'latenz' : w < 0.3 ? 'mikroriss' : w < 1.0 ? 'netzriss' : 'stark';
  return { ausgeloest, pGel, gerissen, w, dehnung, stufe };
}
