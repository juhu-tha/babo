/**
 * Zentraler Schalter für die KI-Funktion (Google Gemini) – Entscheidung Prof. Huber vom 27.10.2026:
 * vorerst abgeschaltet. Solange `false`:
 *  - Oberfläche: kein Einwilligungsdialog, kein „Analyse live ausführen“, stattdessen KI_HINWEIS_AUS
 *    (src/modules/KiBaustoffe.tsx); Prompt-Generator und Kopieren bleiben nutzbar;
 *  - Server: POST /api/gemini/analyze antwortet mit 503, es werden keine Daten an Google übermittelt (server.ts);
 *  - Datenschutzerklärung: Abschnitt „KI-Assistent“ nennt, dass derzeit keine Übermittlung stattfindet.
 * Reaktivierung: Wert auf `true` setzen, Datenschutztext nach docs/entwuerfe/datenschutz-ergaenzungen.md
 * (Abschnitt 4) wiederherstellen und mit dem DSB abstimmen, tests/kiSchalter.test.ts anpassen.
 */
export const KI_FUNKTION_AKTIV: boolean = false;

/** Kurzhinweis anstelle der KI-Bedienelemente */
export const KI_HINWEIS_AUS = 'KI-Funktion derzeit nicht verfügbar. Sie können den Prompt kopieren und in einem KI-Assistenten Ihrer Wahl verwenden.';
