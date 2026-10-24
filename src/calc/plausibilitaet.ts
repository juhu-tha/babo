/**
 * Gemeinsame Plausibilitätsschicht für Rechner (Umsetzungsplan Phase 4, AP 4.8).
 * Rechenkerne liefern neben dem Ergebnis eine Liste von Hinweisen. „fehler“ bedeutet:
 * Es wird kein Ergebnis angezeigt, weil die Eingaben physikalisch unmöglich sind.
 * „warnung“ bedeutet: Ergebnis rechnerisch gültig, aber außerhalb des üblichen Anwendungsbereichs.
 */
export type HinweisStufe = 'fehler' | 'warnung';

export interface Hinweis {
  stufe: HinweisStufe;
  feld?: string;
  text: string;
}

export const istEndlich = (...werte: number[]) => werte.every(Number.isFinite);

export function hatFehler(h: readonly Hinweis[]): boolean {
  return h.some(x => x.stufe === 'fehler');
}

/** Prüft, ob ein Wert im üblichen Bereich liegt; außerhalb → Warnung. */
export function bereich(hinweise: Hinweis[], feld: string, wert: number, min: number, max: number, text: string) {
  if (wert < min || wert > max) hinweise.push({ stufe: 'warnung', feld, text });
}

/** Prüft eine harte Bedingung; verletzt → Fehler. */
export function muss(hinweise: Hinweis[], bedingung: boolean, feld: string, text: string) {
  if (!bedingung) hinweise.push({ stufe: 'fehler', feld, text });
}
