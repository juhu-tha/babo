/**
 * Zentrale Formatierungsfunktionen (deutsche Schreibweise):
 * - Tausendertrennung mit dem schmalen geschützten Leerzeichen U+202F (z. B. 10 000 oder 210 000) nach
 *   DIN 5008 und DIN 1333 – in Fließtext, Rechnerausgaben, Diagrammen, Tabellen, PDF-Export und auch bei
 *   Geldbeträgen (€), damit app-weit eine Regel gilt (Entscheidung 28.10.2026; docs/architektur.md, „Zahlformat“).
 * - Gegliedert wird erst ab 5 Stellen vor dem Komma (10 000); vierstellige Zahlen bleiben ungegliedert
 *   (2160, Jahreszahlen 2024) – DIN 5008 lässt das ausdrücklich zu.
 * - In KaTeX-Formeln wird mit „\,“ (schmaler Abstand) gegliedert, weil U+202F im Mathe-Modus keine Schriftmetrik hat.
 * - Dezimal- / Nachkommastellentrennung mit Komma (z. B. 0,40 oder 3,14)
 * - CSV-/Excel-Export bleibt unberührt: dort werden Zahlen als Zahlen (ohne Gliederung) geschrieben.
 */

/** Tausendertrennzeichen der Projektkonvention: schmales geschütztes Leerzeichen (U+202F) */
export const TAUSENDER_TRENNER = ' ';
/** Tausendertrennung in KaTeX-Formeln (schmaler Abstand) */
export const TAUSENDER_TRENNER_TEX = '\\,';
/** Ab dieser Zahl (Betrag des ganzzahligen Teils) wird gegliedert: 5 Stellen, 4-stellige bleiben ungegliedert */
export const GLIEDERUNG_AB = 10000;

/**
 * Gliedert den ganzzahligen Teil einer ungegliedert formatierten Zahl ("-12345,6" → "-12 345,6"),
 * erst ab 5 Ziffern (vierstellige Zahlen bleiben ungegliedert).
 */
export function gruppiere(s: string, trenner: string = TAUSENDER_TRENNER): string {
  return s.replace(/^([^\d]*)(\d{5,})/, (_m, vor: string, ganz: string) => vor + ganz.replace(/\B(?=(\d{3})+(?!\d))/g, trenner));
}

/**
 * Stellt eine fremd erzeugte de-DE-Ausgabe von Intl (Tausenderpunkt, z. B. Chart.js-Achsen „12.500“) auf die
 * Projektregel um („12 500“; „2.500“ → „2500“). Nur für Intl-Ausgaben mit Locale de-DE (dort ist der Punkt
 * ausschließlich Tausendertrenner), nicht für beliebige Texte.
 */
export function umgruppiereDe(s: string): string {
  return gruppiere(s.replace(/(\d)\.(?=\d{3}(?!\d))/g, '$1'));
}

/**
 * Ersatz für `x.toLocaleString('de-DE', optionen)`: gleiche Rundungsoptionen, aber Tausendertrennung
 * nach Projektregel (U+202F ab 5 Stellen). Mit `useGrouping: false` bleibt die Zahl ungegliedert.
 * NaN/Infinity → "–".
 */
export function formatDeIntl(val: number | null | undefined, optionen: Intl.NumberFormatOptions = {}): string {
  if (val === null || val === undefined || !Number.isFinite(val)) return '–';
  const ohne = formatierer(optionen).format(val);
  return optionen.useGrouping === false ? ohne : gruppiere(ohne);
}

// Formatierer je Optionensatz wiederverwenden: `toLocaleString` legt bei jedem Aufruf intern ein neues
// Intl.NumberFormat an (teuer; beim ersten Rendern der Rechnerseiten mehrere hundert Aufrufe, TBT 04.11.2026).
// Ergebnis identisch: `x.toLocaleString(l, o)` ist als `new Intl.NumberFormat(l, o).format(x)` definiert.
const FORMATIERER = new Map<string, Intl.NumberFormat>();
function formatierer(optionen: Intl.NumberFormatOptions): Intl.NumberFormat {
  const schluessel = JSON.stringify(optionen);
  let f = FORMATIERER.get(schluessel);
  if (!f) {
    f = new Intl.NumberFormat('de-DE', { ...optionen, useGrouping: false });
    if (FORMATIERER.size < 200) FORMATIERER.set(schluessel, f);
  }
  return f;
}

export function formatDeZahl(
  val: number | string | null | undefined,
  fractionDigits?: number
): string {
  if (val === null || val === undefined || val === '') return '–';
  const num = typeof val === 'string' ? parseFloat(val.replace(',', '.')) : val;
  if (isNaN(num)) return typeof val === 'string' ? String(val) : '–';
  if (!Number.isFinite(num)) return '–';

  return formatDeIntl(num, {
    minimumFractionDigits: fractionDigits !== undefined ? fractionDigits : undefined,
    maximumFractionDigits: fractionDigits !== undefined ? fractionDigits : 2,
  });
}

export function formatDeGanzzahl(val: number | string | null | undefined): string {
  return formatDeZahl(val, 0);
}

/** Liest eine deutsch geschriebene Zahl ("12 345,6", "12.345,6", "12345,6") */
export function parseDeZahl(str: string): number {
  if (!str) return NaN;
  // Entferne Tausendertrenner (Punkt, U+202F, geschütztes und normales Leerzeichen) und ersetze Dezimalkomma durch Punkt
  const sanitized = str.replace(/[.   ]/g, '').replace(',', '.');
  return parseFloat(sanitized);
}

/** Wandelt eine formatierte deutsche Zahl in KaTeX-Schreibweise: Komma → {,}, U+202F → \, */
const alsTeX = (s: string) => s.replace(/,/g, '{,}').split(TAUSENDER_TRENNER).join(TAUSENDER_TRENNER_TEX);

/**
 * Deutsche Zahl für KaTeX-Formeln: Dezimalkomma als {,} (ohne Zusatzabstand),
 * Tausendertrennung als „\,“ (ab 5 Stellen); NaN/Infinity → "\text{–}".
 */
export function formatDeTeX(val: number | null | undefined, fractionDigits?: number): string {
  if (val === null || val === undefined || !Number.isFinite(val)) return '\\text{–}';
  return alsTeX(formatDeZahl(val, fractionDigits));
}

/**
 * Rohwert in deutscher Schreibweise ohne Rundung (bis 6 Nachkommastellen),
 * Tausendertrennung ab 5 Stellen (vierstellige Zahlen wie Jahreszahlen bleiben ungetrennt);
 * NaN/Infinity → "–".
 */
export function formatDeWert(val: number | null | undefined): string {
  return formatDeIntl(val, { maximumFractionDigits: 6 });
}

/** Wie formatDeWert, aber für KaTeX ({,} als Dezimalkomma, „\,“ als Tausendertrennung). */
export function formatDeTeXWert(val: number | null | undefined): string {
  if (val === null || val === undefined || !Number.isFinite(val)) return '\\text{–}';
  return alsTeX(formatDeWert(val));
}
