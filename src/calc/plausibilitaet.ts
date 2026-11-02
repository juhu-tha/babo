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

/**
 * „Keine Klasse“: Klassifizierer (Zahl → Klasse, Stufe, Note) liefern diesen Wert für nicht endliche Eingaben
 * statt einer echten Klasse (Entscheidung F-1 vom 02.11.2026, docs/pruefung/kein-ergebnis-anzeige-2026-11-02.md).
 * Vorher fiel NaN bei Vergleichsketten immer in den letzten Zweig (z. B. Potential → „gering“, q_E → „H“).
 */
export const KEINE_KLASSE = '–' as const;
export type KeineKlasse = typeof KEINE_KLASSE;

/** Technische Obergrenze für Stützstellen, Zeitschritte und Jahresreihen (Schutz vor Endlosschleifen, kein Fachwert). */
export const MAX_STUETZSTELLEN = 10_000;
/** Ganze Zahl zwischen min und max (Standard: 0 … MAX_STUETZSTELLEN) – für Anzahl-Parameter von Verläufen. */
export const istAnzahl = (n: number, min = 0, max = MAX_STUETZSTELLEN) => Number.isInteger(n) && n >= min && n <= max;

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

/**
 * Warnung für teilweise ausgefüllte Tabellenzeilen, die ein Rechenkern überspringt (ganz leere Zeilen gelten als
 * nicht benutzt und bleiben ohne Hinweis). Grenzfallprüfung 02.11.2026: vorher wurden sie stillschweigend ignoriert.
 */
export function unvollstaendigeZeilen(hinweise: Hinweis[], zeilen: readonly (readonly number[])[], feld: string) {
  const n = zeilen.filter(z => z.some(Number.isFinite) && !z.every(Number.isFinite)).length;
  if (n > 0) hinweise.push({ stufe: 'warnung', feld, text: n === 1 ? 'Eine unvollständig ausgefüllte Zeile wird nicht berücksichtigt.' : `${n} unvollständig ausgefüllte Zeilen werden nicht berücksichtigt.` });
}

/**
 * „Kein Ergebnis“: ersetzt alle Zahlen eines Ergebnisses (auch in Unterobjekten und Listen) durch NaN.
 * Texte, Wahrheitswerte und das Feld „hinweise“ bleiben erhalten, die Struktur (Listenlängen) ebenso,
 * damit Anzeigen nicht auf fehlende Einträge zugreifen. Die Zahlformatierung zeigt NaN als „–“.
 * Grenzfallprüfung der Rechenkerne 02.11.2026 (docs/pruefung/rechenkerne-grenzfaelle-2026-11-02.md).
 */
export function ohneZahlen<T>(wert: T): T {
  if (typeof wert === 'number') return NaN as T;
  if (Array.isArray(wert)) return wert.map(ohneZahlen) as T;
  if (wert && typeof wert === 'object' && Object.getPrototypeOf(wert) === Object.prototype) {
    const aus: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(wert)) aus[k] = k === 'hinweise' ? v : ohneZahlen(v);
    return aus as T;
  }
  return wert;
}

/** Ergebnis mit Gültigkeit: bei einem Fehlerhinweis ohne Zahlen (siehe ohneZahlen), sonst unverändert. */
export function mitPruefung<T extends object>(werte: T, hinweise: Hinweis[]): T & { gueltig: boolean; hinweise: Hinweis[] } {
  const gueltig = !hatFehler(hinweise);
  return { ...(gueltig ? werte : ohneZahlen(werte)), gueltig, hinweise };
}

/**
 * Wie ohneZahlen, wenn das Ergebnis ungültig ist (gueltig === false oder ein Fehlerhinweis in „hinweise“); sonst unverändert.
 * `klassen`: Textfelder mit einer aus den Eingaben abgeleiteten Klasse, Stufe oder Bewertung – bei ungültigem Ergebnis
 * „–“ statt einer echten Klasse (Entscheidung F-1 vom 02.11.2026; der Feldtyp im Ergebnis-Interface muss „–“ zulassen).
 */
export function nurGueltig<T extends object>(e: T, klassen: readonly NoInfer<keyof T>[] = []): T {
  const r = e as { gueltig?: unknown; hinweise?: unknown };
  const ungueltig = r.gueltig === false || (Array.isArray(r.hinweise) && hatFehler(r.hinweise as Hinweis[]));
  if (!ungueltig) return e;
  const aus = ohneZahlen(e) as Record<PropertyKey, unknown>;
  for (const k of klassen) aus[k as PropertyKey] = KEINE_KLASSE;
  return aus as T;
}
