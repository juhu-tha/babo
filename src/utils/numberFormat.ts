/**
 * Zentrale Formatierungsfunktionen nach deutschen Typografie- und Normstandards:
 * - Tausendertrennung mit Punkt (z. B. 1.000 oder 210.000)
 * - Dezimal- / Nachkommastellentrennung mit Komma (z. B. 0,40 oder 3,14)
 */

export function formatDeZahl(
  val: number | string | null | undefined,
  fractionDigits?: number
): string {
  if (val === null || val === undefined || val === '') return '–';
  const num = typeof val === 'string' ? parseFloat(val.replace(',', '.')) : val;
  if (isNaN(num)) return String(val);

  return num.toLocaleString('de-DE', {
    minimumFractionDigits: fractionDigits !== undefined ? fractionDigits : undefined,
    maximumFractionDigits: fractionDigits !== undefined ? fractionDigits : 2,
  });
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
