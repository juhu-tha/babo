/**
 * Zulieferungen und Entscheidungen Prof. Huber (Teil B des Audit-Stands, 27.10.2026).
 * Neue Punkte anhängen, Status hier pflegen (per Pull Request). Anzeige: Admin → Audit → „Zulieferungen“.
 * Status: 'wartet' = wartet auf Prof. Huber (Filter „wartet auf mich“).
 */
import type { Zulieferung } from './typen';

export const ZULIEFERUNGEN_STAND = '2026-10-27';

export const ZULIEFERUNGEN: readonly Zulieferung[] = [
  { nr: 'Z1–Z4, Z20, Z25', gegenstand: 'Normtext- und Literaturauszüge (EC2/NA κ_sw, α6, Dekompression; Schneider/Wendehorst/DAfStb; Holzbau; RStO-Tafeln; Normwerte AP 3.4)', stand: 'Erst öffentliche Quellen (erledigt #187–#189), Rest als Fehlliste', status: 'wartet', statusText: 'wartet auf Upload', prs: [187, 188, 189], dateien: ['docs/entwuerfe/literatur-fehlliste.md', 'docs/normwerte-belege.md'] },
  { nr: 'Z5–Z8', gegenstand: 'Literaturbeispiele Mauerwerk, Glaser, eLCA, BSP', stand: 'Öffentlich belegt', status: 'erledigt', prs: [170, 171, 172, 173, 187] },
  { nr: 'Z9', gegenstand: 'Mischung Beispiel 5', stand: 'Nachgerechnet, korrekt; Quellenangabe korrigiert', status: 'erledigt', prs: [187] },
  { nr: 'Z10/Z17', gegenstand: 'Gegenrechnung 10 Rechner, Nutzertest mit 5 Studierenden', stand: 'Abschlussarbeit bzw. Hiwi; Ausschreibung liegt vor', status: 'wartet', statusText: 'wartet: Stunden, Vergütung, ECTS, Beginn', dateien: ['docs/entwuerfe/ausschreibung-pruefung.md'] },
  { nr: 'Z11/Z39', gegenstand: 'Betreiber/Verantwortlicher, Freigabe durch DSB', stand: 'Später klären', status: 'offen' },
  { nr: 'Z12', gegenstand: 'Gemini', stand: 'Zunächst: behalten mit Tageslimit (300/Tag). Entscheidung 27.10.: KI-Funktion vorerst aus', status: 'erledigt', statusText: 'entschieden, umgesetzt (#193)', prs: [193] },
  { nr: 'Z13/Z45', gegenstand: 'Lizenz/Rechteinhaberschaft', stand: 'Anfrage an die THA vorbereitet', status: 'wartet', statusText: 'wartet auf Weiterleitung', dateien: ['docs/entwuerfe/anfrage-tha-lizenz.md'] },
  { nr: 'Z14', gegenstand: 'AI-Studio-Pull-Test', stand: 'Erledigt', status: 'erledigt' },
  { nr: 'Z15', gegenstand: 'Branch-Schutz main', stand: 'Zurückgestellt (GitHub Actions gesperrt)', status: 'zurueckgestellt' },
  { nr: 'Z16/Z44', gegenstand: 'Terminpläne 7 Lernpfade, TTZ-Kursliste', stand: 'Entwürfe erstellt (App: „Woche ab …, Entwurf“)', status: 'wartet', statusText: 'wartet auf Abgleich', dateien: ['docs/entwuerfe/terminplaene-ws2627.md'] },
  { nr: 'Z18', gegenstand: 'Neue Themen vor/nach Konsolidierung', stand: 'Nach Konsolidierung', status: 'erledigt' },
  { nr: 'Z19/Z23/Z26/Z38', gegenstand: 'Freigabe Quizfragen, Prüfhinweise, Lernziele, Prüfvermerke', stand: 'Prüflisten je Cluster (80 auffällige Fragen + Stichproben)', status: 'wartet', statusText: 'wartet auf Durchsicht', dateien: ['docs/pruefung/', 'docs/quiz-pruefhinweise.md'] },
  { nr: 'Z21', gegenstand: 'Alte Merges', stand: 'Erledigt', status: 'erledigt' },
  { nr: 'Z22', gegenstand: 'Fachentscheidungen Rechner-Durchsicht', stand: 'Normgemäß umgesetzt (Prüfpunkte im PR)', status: 'erledigt', prs: [189] },
  { nr: 'Z24', gegenstand: 'Fehlende Themen', stand: 'Mohr, Biegelinie, Fe-C, t-Test, Trittschall, Atterberg', status: 'erledigt', prs: [190, 191] },
  { nr: 'Z30–Z33', gegenstand: 'Normfragen neue Module (Keramik, Korrosionsschutz, EC3, DIN 4108-2)', stand: 'Normgemäß umgesetzt, Rest in der Fehlliste', status: 'erledigt', statusText: 'erledigt (Rest Fehlliste)', prs: [189] },
  { nr: 'Z37/Z42', gegenstand: 'Laborpilot Versuchs-Handouts', stand: 'Pilot WS 26/27; Feedbackbögen liegen vor', status: 'in_arbeit', statusText: 'im Semester', dateien: ['docs/entwuerfe/laborpilot-feedback.md'] },
  { nr: 'Z43', gegenstand: 'Speicherort Fragebogen', stand: 'Datei im Cloud-Run-Volume', status: 'erledigt', statusText: 'entschieden, umgesetzt', prs: [183] },
  { nr: 'Z48/Z53', gegenstand: 'Normtextfragen; 3 000-Wörter-Schwelle', stand: 'Z53: teilen + Kurzfassung', status: 'in_arbeit' },
  { nr: 'Z49', gegenstand: 'Repository öffentlich', stand: 'Ja, nach Z51 und THA-Klärung', status: 'wartet' },
  { nr: 'Z50/Z56', gegenstand: 'Hosting', stand: 'Weg B: Cloud Run, Frankfurt; Anleitung liegt vor. 27.10.: Prof. Huber prüft Firebase Hosting vor Cloud Run statt Load Balancer', status: 'wartet', statusText: 'offen – Prüfung Hosting-Variante durch Prof. Huber', prs: [183], dateien: ['docs/betrieb-cloud-run.md'] },
  { nr: 'Z51', gegenstand: 'Neues Administrator-Kennwort', stand: 'Später; als Secret im Secret Manager', status: 'offen' },
  { nr: 'Z52', gegenstand: 'Vorrendern/Pfad-Routing', stand: 'Umgesetzt, LCP 2,1–2,3 s', status: 'erledigt', prs: [185] },
  { nr: 'Z54', gegenstand: 'GitHub Actions', stand: 'Weiter lokale Prüfung', status: 'entschieden' },
  { nr: 'Z55', gegenstand: 'Formelbefunde', stand: 'Normgemäß umgesetzt (Prüfpunkte F1–F12)', status: 'erledigt', prs: [188] },
  { nr: 'Z57', gegenstand: 'Barrierefreiheitserklärung', stand: '„teilweise vereinbar – weitgehend erfüllt“ (rechtlich zulässige Stufen)', status: 'erledigt', prs: [186] },
  { nr: 'neu', gegenstand: 'Restwert LCC an/aus', stand: 'Schalter „Restwert linear“, Standard aus (BNB-konform, #196)', status: 'erledigt', prs: [184, 196] },
  { nr: 'neu', gegenstand: 'γ_c außergewöhnlich 1,3/1,2; f_cd-Abminderung ab C55/67; Rückprall-Richtungskorrektur', stand: 'γ_c = 1,3 nach NA DE; f_cd-Abminderung ab C55/67 vorbereitet, aber aus bis zum Normtext (Entscheidung 27.10., Doppelabminderung mit η vermeiden); Richtungskorrektur nach Herstellertabelle (#196)', status: 'erledigt', prs: [188, 196] },
  { nr: 'neu', gegenstand: 'Trittschall Wohnungstrenndecke 50 oder 53 dB', stand: 'Entscheidung 27.10.: 50 dB', status: 'erledigt', prs: [190] },
  { nr: 'neu', gegenstand: 'Fe-C Standard 0,8 %/723 °C oder 0,76 %/727 °C; Mohr τ-Achse', stand: 'Entscheidung 27.10.: 0,8 %/723 °C; Mohr τ nach unten positiv', status: 'erledigt', prs: [191] },
  { nr: 'neu', gegenstand: 'Merge-Nachricht GitHub auf „Pull request title and description“', stand: '–', status: 'wartet', statusText: 'offen – Einstellung durch Prof. Huber' },
  { nr: 'neu', gegenstand: 'Texte „Forschung und Transfer“ (4 Platzhalter), Projekte, Publikationen, ORCID', stand: 'Texte von Prof. Huber eingesetzt (Gutachten Maßnahme 1); offen: URL der Personenseite', status: 'erledigt', statusText: 'erledigt (Rest: URL Personenseite)', prs: [192] },
  { nr: 'neu', gegenstand: 'Hinweis „Fachliche Prüfung ausstehend“', stand: 'Entscheidung 27.10.: ausblenden', status: 'erledigt', prs: [193] },
  { nr: 'neu', gegenstand: 'Quiz: Distraktoren angleichen, normRef ergänzen', stand: 'Umgesetzt: richtige Antwort am längsten 27,3 % statt 37 %', status: 'erledigt', prs: [194] },
  { nr: 'neu', gegenstand: 'CSP scharf schalten', stand: 'Entscheidung 27.10.: zwei Wochen nach dem Cloud-Run-Umzug', status: 'wartet', statusText: 'wartet auf Z50 (Hosting)' },
  { nr: 'neu', gegenstand: 'Ungenutzte Schriftdateien löschen', stand: 'Entscheidung 27.10.: zusammen mit Weg B', status: 'wartet', statusText: 'wartet auf Z50 (Hosting)' },
  { nr: 'neu', gegenstand: 'Lernpfade nach Lehrveranstaltung (AP 6.1)', stand: 'inaktiv geschaltet (Schalter INAKTIVE_GRUPPEN, #197)', status: 'erledigt', prs: [197] },
];
