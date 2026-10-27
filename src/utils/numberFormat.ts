/**
 * Zentrale Formatierungsfunktionen (deutsche Schreibweise):
 * - Tausendertrennung einheitlich mit Punkt (z. B. 1.000 oder 210.000) – in Fließtext, Rechnerausgaben,
 *   Diagrammen und KaTeX-Formeln (Projektkonvention, Gutachten 27.10.2026; Begründung in docs/architektur.md,
 *   Abschnitt „Zahlformat“). Hinweis: DIN 5008 und DIN 1333 empfehlen für Zahlen (außer Geldbeträgen) ein
 *   Leerzeichen; eine Umstellung wäre hier zentral über TAUSENDER_TRENNER möglich (Prüfpunkt Prof. Huber).
 * - Dezimal- / Nachkommastellentrennung mit Komma (z. B. 0,40 oder 3,14)
 */

/** Tausendertrennzeichen der Projektkonvention (Ausgabe von toLocaleString('de-DE')) */
export const TAUSENDER_TRENNER = '.';
/** ersetzt den Tausenderpunkt aus toLocaleString('de-DE') durch TAUSENDER_TRENNER (derzeit unverändert) */
const gruppiert = (s: string) => (TAUSENDER_TRENNER === '.' ? s : s.replace(/\./g, TAUSENDER_TRENNER));

export function formatDeZahl(
  val: number | string | null | undefined,
  fractionDigits?: number
): string {
  if (val === null || val === undefined || val === '') return '–';
  const num = typeof val === 'string' ? parseFloat(val.replace(',', '.')) : val;
  if (isNaN(num)) return typeof val === 'string' ? String(val) : '–';
  if (!Number.isFinite(num)) return '–';

  return gruppiert(num.toLocaleString('de-DE', {
    minimumFractionDigits: fractionDigits !== undefined ? fractionDigits : undefined,
    maximumFractionDigits: fractionDigits !== undefined ? fractionDigits : 2,
  }));
}

export function formatDeGanzzahl(val: number | string | null | undefined): string {
  return formatDeZahl(val, 0);
}

export function parseDeZahl(str: string): number {
  if (!str) return NaN;
  // Entferne Tausenderpunkte und ersetze Dezimalkomma durch Punkt
  const sanitized = str.replace(/\./g, '').replace(',', '.');
  return parseFloat(sanitized);
}

/**
 * Deutsche Zahl für KaTeX-Formeln: Dezimalkomma als {,} (ohne Zusatzabstand),
 * Tausendertrennung mit Punkt wie im Fließtext (einheitlich, Gutachten 27.10.2026); NaN/Infinity → "–".
 */
export function formatDeTeX(val: number | null | undefined, fractionDigits?: number): string {
  if (val === null || val === undefined || !Number.isFinite(val)) return '\\text{–}';
  return formatDeZahl(val, fractionDigits).replace(/,/g, '{,}');
}

/**
 * Rohwert in deutscher Schreibweise ohne Rundung (bis 6 Nachkommastellen),
 * Tausendertrennung erst ab 5 Stellen (vierstellige Zahlen wie Jahreszahlen bleiben ungetrennt);
 * NaN/Infinity → "–".
 */
export function formatDeWert(val: number | null | undefined): string {
  if (val === null || val === undefined || !Number.isFinite(val)) return '–';
  return gruppiert(val.toLocaleString('de-DE', { maximumFractionDigits: 6, useGrouping: Math.abs(val) >= 10000 }));
}

/** Wie formatDeWert, aber für KaTeX ({,} als Dezimalkomma, Punkt als Tausendertrennung wie im Fließtext). */
export function formatDeTeXWert(val: number | null | undefined): string {
  if (val === null || val === undefined || !Number.isFinite(val)) return '\\text{–}';
  return formatDeWert(val).replace(/,/g, '{,}');
}
