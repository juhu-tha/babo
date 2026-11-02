// Konvention der Rechenkerne seit der Grenzfallprüfung 02.11.2026 (docs/pruefung/rechenkerne-grenzfaelle-2026-11-02.md):
// ungültige Eingabe (Fehlerhinweis bzw. gueltig = false) → kein Zahlenergebnis (NaN, Anzeige „–“);
// gültige Eingabe → endliche Zahlen. Vorher (AP 4.5) lieferten viele Kerne bei Fehlern 0 statt NaN.
interface MitHinweisen { gueltig?: boolean; hinweise?: readonly { stufe: string }[] }

export const istUngueltig = (r: MitHinweisen) => r.gueltig === false || !!r.hinweise?.some(h => h.stufe === 'fehler');
/** alle Werte NaN (kein Zahlenergebnis) */
export const keinErgebnis = (werte: readonly number[]) => werte.every(Number.isNaN);
/** ungültig → alle Werte NaN; gültig → alle Werte endlich */
export const zahlenPassen = (r: MitHinweisen, werte: readonly number[]) => (istUngueltig(r) ? keinErgebnis(werte) : werte.every(Number.isFinite));
