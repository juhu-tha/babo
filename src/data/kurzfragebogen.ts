/**
 * Anonymer Kurzfragebogen (Umsetzungsplan Phase 6, AP 6.9) – gemeinsame Definitionen für Browser und Server.
 *
 * Fünf Aussagen mit fünfstufiger Zustimmungsskala und ein optionaler Freitext (höchstens 500 Zeichen).
 * Der Server (server/kurzfragebogen.ts) speichert nur Zählwerte je Semester und Aussage sowie Freitexte
 * ohne Metadaten. Semester nach bayerischen Hochschulen für angewandte Wissenschaften:
 * Sommersemester 15. März – 30. September, Wintersemester 1. Oktober – 14. März.
 */

export const KF_ITEMS = [
  { id: 'verstaendlich', text: 'Die Inhalte sind verständlich aufbereitet.' },
  { id: 'lernhilfe', text: 'Das BaustoffBoard hilft mir beim Lernen für meine Lehrveranstaltungen.' },
  { id: 'vertrauen', text: 'Ich vertraue der fachlichen Richtigkeit der Inhalte.' },
  { id: 'navigation', text: 'Ich finde gesuchte Inhalte schnell.' },
  { id: 'interaktiv', text: 'Rechner und interaktive Elemente unterstützen mein Verständnis.' },
] as const;

export type KfItemId = (typeof KF_ITEMS)[number]['id'];
export type KfWert = 1 | 2 | 3 | 4 | 5;

/** Beschriftung der Skala, Index 0 = Wert 1 */
export const KF_SKALA = ['trifft gar nicht zu', 'trifft eher nicht zu', 'teils, teils', 'trifft eher zu', 'trifft voll zu'] as const;

export const KF_FREITEXT_MAX = 500;

export interface KfAntwort {
  werte: Partial<Record<KfItemId, KfWert>>;
  /** bereinigter Freitext; fehlt, wenn leer */
  freitext?: string;
}

/** Semester-Schlüssel zu einem Datum: „SS2026“ oder „WS2026“ (WS 2026/27 reicht bis 14.03.2027). */
export function semesterSchluessel(d: Date = new Date()): string {
  const j = d.getFullYear();
  const m = d.getMonth() + 1;
  const t = d.getDate();
  const nachMitteMaerz = m > 3 || (m === 3 && t >= 15);
  if (m >= 10) return `WS${j}`;
  if (nachMitteMaerz) return `SS${j}`;
  return `WS${j - 1}`;
}

/** „SS2026“ → „Sommersemester 2026“, „WS2026“ → „Wintersemester 2026/27“ */
export function semesterText(schluessel: string): string {
  const m = /^(SS|WS)(\d{4})$/.exec(schluessel);
  if (!m) return schluessel;
  const j = Number(m[2]);
  return m[1] === 'SS' ? `Sommersemester ${j}` : `Wintersemester ${j}/${String((j + 1) % 100).padStart(2, '0')}`;
}

const ITEM_IDS: ReadonlySet<string> = new Set(KF_ITEMS.map(i => i.id));

/** Steuerzeichen (außer Zeilenumbruch) entfernen, Leerraum zusammenfassen, Ränder kürzen */
export function bereinigeFreitext(s: string): string {
  return s
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202E\u2060-\u206F\uFEFF]/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export type KfPruefung = { ok: true; antwort: KfAntwort } | { ok: false; fehler: string };

/** Prüft eine eingehende Antwort streng: nur bekannte Aussagen, ganze Zahlen 1–5, Freitext ≤ 500 Zeichen. */
export function pruefeAntwort(eingabe: unknown): KfPruefung {
  if (typeof eingabe !== 'object' || eingabe === null || Array.isArray(eingabe)) return { ok: false, fehler: 'Ungültige Anfrage.' };
  const obj = eingabe as Record<string, unknown>;
  for (const k of Object.keys(obj)) if (k !== 'werte' && k !== 'freitext') return { ok: false, fehler: 'Unbekanntes Feld.' };
  const rohWerte = obj.werte ?? {};
  if (typeof rohWerte !== 'object' || rohWerte === null || Array.isArray(rohWerte)) return { ok: false, fehler: 'Ungültige Bewertungen.' };
  const werte: Partial<Record<KfItemId, KfWert>> = {};
  for (const [k, v] of Object.entries(rohWerte as Record<string, unknown>)) {
    if (!ITEM_IDS.has(k)) return { ok: false, fehler: 'Unbekannte Aussage.' };
    if (typeof v !== 'number' || !Number.isInteger(v) || v < 1 || v > 5) return { ok: false, fehler: 'Bewertungen müssen ganze Zahlen von 1 bis 5 sein.' };
    werte[k as KfItemId] = v as KfWert;
  }
  let freitext: string | undefined;
  if (obj.freitext !== undefined) {
    if (typeof obj.freitext !== 'string') return { ok: false, fehler: 'Ungültiger Freitext.' };
    if (obj.freitext.length > KF_FREITEXT_MAX * 2) return { ok: false, fehler: `Freitext zu lang (höchstens ${KF_FREITEXT_MAX} Zeichen).` };
    const t = bereinigeFreitext(obj.freitext);
    if ([...t].length > KF_FREITEXT_MAX) return { ok: false, fehler: `Freitext zu lang (höchstens ${KF_FREITEXT_MAX} Zeichen).` };
    if (t) freitext = t;
  }
  if (Object.keys(werte).length === 0 && !freitext) return { ok: false, fehler: 'Bitte mindestens eine Aussage bewerten oder einen Kommentar schreiben.' };
  return { ok: true, antwort: freitext ? { werte, freitext } : { werte } };
}
