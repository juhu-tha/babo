// Zentrale Formulierung des fachlichen Prüfvermerks (Gutachten 29.10.2026, 4.5: Kopf und Fußzeile widersprachen sich).
// Kopf (PruefVermerk) und Fußzeile (ModuleFooter) lesen den Vermerk aus pruefvermerkFuer(id) und formulieren ihn
// ausschließlich über diese Funktionen; tests/pruefaussagen.test.ts sichert den Gleichlauf.
import { datumDe, type Pruefvermerk } from '@/src/data/pruefvermerke';

/** Ein Satz zum Prüfverfahren, als Hinweis am Vermerk (Kopf und Fußzeile) */
export const PRUEFVERFAHREN_HINWEIS =
  'Die Inhalte wurden in einem dokumentierten Verfahren fachlich geprüft (Nachrechnung, Normstand, Quellen); offene Normstellen sind als „vorläufig“ gekennzeichnet.';

/** Neutrale Angabe für noch nicht abgeschlossene Prüfungen (ohne „ausstehend“, ohne Personenbezug) */
export const PRUEFUNG_IN_BEARBEITUNG = 'Fachliche Prüfung in Bearbeitung';

/** true, wenn der Vermerk eine abgeschlossene Prüfung mit Datum ausweist */
export const istGeprueft = (v: Pruefvermerk | undefined): boolean => v?.status === 'geprueft' && !!v.am;

/** Text des Prüfvermerks: „Fachlich geprüft am TT.MM.JJJJ“ (passiv; „von …“ nur, wenn eingetragen),
 *  „Fachliche Nachprüfung erforderlich (letzte Prüfung TT.MM.JJJJ)“ oder „Fachliche Prüfung in Bearbeitung“ */
export function pruefvermerkText(v: Pruefvermerk): string {
  if (istGeprueft(v)) return `Fachlich geprüft am ${datumDe(v.am)}${v.von ? ` von ${v.von}` : ''}`;
  if (v.status === 're-review') {
    // passiv ohne Namen, wenn keine Person eingetragen ist (Entscheidung 04.11.2026, wie bei „geprüft“); ohne „zuletzt geprüft“,
    // das tests/pruefaussagen.test.ts als widersprüchlich ausschließt
    return `Fachliche Nachprüfung erforderlich${v.am ? ` (letzte Prüfung ${datumDe(v.am)}${v.von ? `, ${v.von}` : ''})` : ''}`;
  }
  return PRUEFUNG_IN_BEARBEITUNG;
}

const MONATE = 'Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember';

/** Inhaltsstand aus der früheren Freitextangabe (z. B. „Oktober 2026 (AP 5 Mechanik: …)“) → „Oktober 2026“.
 *  Nur Monat und Jahr bzw. ein ISO-Datum werden übernommen; Freigabeaussagen im Freitext werden nicht angezeigt. */
export function inhaltsstandAus(text: string | undefined): string | undefined {
  const t = (text ?? '').trim();
  const monat = new RegExp(`^(${MONATE}) (\\d{4})`).exec(t);
  if (monat) return `${monat[1]} ${monat[2]}`;
  const iso = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(t);
  if (iso) return iso[3] ? datumDe(`${iso[1]}-${iso[2]}-${iso[3]}`) : `${iso[2]}/${iso[1]}`;
  return undefined;
}
