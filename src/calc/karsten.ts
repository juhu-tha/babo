/**
 * Karsten-Prüfröhrchen und Wasseraufnahmekoeffizient (Runde 5, einheitlich für ZfP und Bauwerksuntersuchung).
 *
 * w-Wert aus der Wasseraufnahme: Δm/A = w·√t (Definition wie DIN EN ISO 15148) →
 *   w = Δm/(A·√t) = V[ml]·10/(A[cm²]·√t[h])  [kg/(m²·√h)]   (1 ml Wasser ≈ 1 g)
 * Prüffläche: geräteabhängig; Lehrwert 5,73 cm² (Glockenfläche nach core.ac.uk/download/55871097.pdf, Abschn. 2.2.2).
 * Nach dem Versuch die tatsächlich benetzte Fläche messen (Saltwiki „Test Tube KARSTEN“) – vorläufig, F-Freigabe.
 * Einstufung nach DIN 4108-3:2024-03 (Regenschutz): wasserabweisend w ≤ 0,5 (zusätzlich s_d ≤ 2,0 m und w·s_d ≤ 0,2),
 * wasserhemmend 0,5 < w ≤ 2,0, darüber „wassersaugend“ (kein Normbegriff).
 * Das Röhrchen liefert nur einen Schätzwert (Vor-Ort-Verfahren, kein Normprüfverfahren). Reiner Rechenkern – geprüft in tests/karsten.test.ts.
 */
import { type Hinweis, istEndlich, muss } from './plausibilitaet';

/** Prüffläche des Karsten-Röhrchens [cm²] (Lehrwert, geräteabhängig) */
export const KARSTEN_FLAECHE_CM2 = 5.73;
/** Grenzwerte des Wasseraufnahmekoeffizienten nach DIN 4108-3 [kg/(m²·√h)] */
export const W_GRENZEN_4108_3 = { abweisend: 0.5, hemmend: 2.0 } as const;

export type SaugKlasse = 'wasserabweisend' | 'wasserhemmend' | 'wassersaugend';

/** w-Wert [kg/(m²·√h)] aus aufgenommener Wassermenge V [ml], Prüfzeit t [h] und Prüffläche A [cm²] */
export function wWertAusKarsten(wasserMl: number, zeitH: number, flaecheCm2: number = KARSTEN_FLAECHE_CM2): number {
  return (wasserMl * 10) / (flaecheCm2 * Math.sqrt(zeitH));
}

/** Einstufung nach DIN 4108-3 (Grenzwerte jeweils einschließlich) */
export function saugKlasse(w: number): SaugKlasse {
  return w <= W_GRENZEN_4108_3.abweisend ? 'wasserabweisend' : w <= W_GRENZEN_4108_3.hemmend ? 'wasserhemmend' : 'wassersaugend';
}

/** Vollständige Auswertung mit Plausibilitätsprüfung */
export function karstenAuswertung(wasserMl: number, zeitMin: number, flaecheCm2: number = KARSTEN_FLAECHE_CM2) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(wasserMl, zeitMin, flaecheCm2) && zeitMin > 0 && wasserMl >= 0 && flaecheCm2 > 0, 'karsten', 'Prüfzeit > 0, Prüffläche > 0 und Wassermenge ≥ 0 erforderlich.');
  if (hinweise.length) return { w: 0, tHours: 0, klasse: 'wasserabweisend' as SaugKlasse, hinweise };
  const tHours = zeitMin / 60;
  const w = wWertAusKarsten(wasserMl, tHours, flaecheCm2);
  hinweise.push({ stufe: 'warnung', feld: 'w', text: 'Das Karsten-Röhrchen liefert nur einen Schätzwert (Prüffläche geräteabhängig); der w-Wert nach DIN 4108-3 wird nach DIN EN ISO 15148 bestimmt.' });
  return { w, tHours, klasse: saugKlasse(w), hinweise };
}
