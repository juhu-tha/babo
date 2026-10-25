# ENTWURF – Manuskript-Gliederung: Lehrkonzept BaustoffBoard

> **Status: Entwurf (AP 6.10), nicht zur Veröffentlichung freigegeben.** Gliederung und Stichpunkte für einen
> Fachbeitrag zum Lehrkonzept des BaustoffBoards (z. B. für die Zeitschrift *nbau*). Alle Aussagen sind
> von Prof. Dr.-Ing. Jürgen Huber fachlich zu prüfen. Stellen mit `[Text durch Prof. Huber]` sind bewusst offen.
> Zielzeitschrift, Umfang und Formatvorgaben sind vor dem Ausformulieren mit den Autorenhinweisen abzugleichen.
> Kennzahlen: Stand 25.10.2026, erzeugt aus dem Repository (siehe Abschnitt 4).

**Arbeitstitel:** Eine offene, interaktive Lernplattform für Baustoffkunde – Konzept und erste Erfahrungen mit dem BaustoffBoard der TH Augsburg

**Autor:** Prof. Dr.-Ing. Jürgen Huber, Technische Hochschule Augsburg, Fakultät für Architektur und Bauwesen, Lehrgebiet Werkstoffe und Stoffkreisläufe im Bauwesen · weitere Autorinnen/Autoren: [Text durch Prof. Huber]

---

## 1. Einleitung und Forschungsfrage

- Ausgangslage: Baustoffkunde ist ein breites Grundlagenfach (Chemie, Mechanik, Bauphysik, Normung, Kreislaufwirtschaft), das in mehreren Studiengängen mit unterschiedlichem Vorwissen gelehrt wird.
- Problem: Lehrbücher und Normen sind statisch; Rechenwege und Parametereinflüsse bleiben für Studierende oft unsichtbar; Normstände ändern sich schneller als Skripte.
- Ansatz: eine frei zugängliche Web-Anwendung, die Fachinhalte, Rechner mit offen gelegtem Rechenweg, Selbsttests und Erkundungsaufträge in einer einheitlichen Modulstruktur bündelt.
- **Forschungsfrage (Vorschlag):** Wie lässt sich eine interaktive Lernplattform für Baustoffkunde so strukturieren, dass Lernziele, Übung und Selbstkontrolle je Modul konsistent verknüpft und mit vertretbarem Aufwand qualitätsgesichert werden können?
- Teilfragen (Vorschlag):
  1. Welche Strukturelemente (Registry, Lernziele, Selbsttests, Rechenwege, Erkundungsaufträge) sind dafür notwendig?
  2. Wie lassen sich fachliche und technische Qualität (Normstand, Formeln, Barrierefreiheit) automatisiert prüfen?
  3. Wie bewerten Studierende die Plattform? → [Text durch Prof. Huber] (Daten aus Evaluation, siehe 3.7)
- Einordnung in die Literatur zu digitalen Lernumgebungen im Bauingenieurstudium: [Text durch Prof. Huber]

## 2. Konzept

### 2.1 Zentrale Modul-Registry

- Eine einzige Quelle (`src/registry/modules.ts`) für Menü, Modulübersicht (Baum), Suche, Meta-Beschreibungen, Direktlinks und Sitemap.
- Gliederung in Menügruppen und sechs Cluster (Grundlagen bis Studium/Übung); Modultypen: Fachtext, Rechner, Datenbank, Norm, Quiz, Info.
- Konsistenz wird automatisiert geprüft (jede ID verdrahtet, jeder Baumknoten genau einmal, Sitemap aktuell).
- Didaktischer Nutzen: Studierende finden Themen über mehrere Zugänge (Menü, Baum, Volltextsuche); Lehrende können Module gezielt per Link in Lehrveranstaltungen einbinden.

### 2.2 Operationalisierte Lernziele

- Je Fachmodul 3–5 Lernziele im Format „Sie können …“ mit beobachtbarem Verb und Zuordnung zu einer Taxonomiestufe (Erinnern bis Bewerten), dazu Niveau (Bachelor/Master), Bearbeitungsdauer und Vorwissen (verlinkte Module).
- Lernziele steuern Auswahl und Formulierung von Selbsttests und Erkundungsaufträgen (Constructive Alignment).

### 2.3 Selbsttests

- Fragenpool mit Einfach- und Mehrfachauswahl, Zuordnung der Fragen zu Modulen; Rückmeldung mit Begründung.
- Qualitätskriterien für Distraktoren (u. a. keine systematisch längste richtige Antwort, keine Absolutwörter als Erkennungsmerkmal), automatisiert gemessen.
- Fachliche Freigabe einzelner Fragen durch die Lehrperson (Freigabestatus je Frage).

### 2.4 Rechenwege

- Rechner zeigen den Rechenweg mit Formel, eingesetzten Werten und Zwischenergebnissen (Herleitungsboxen, KaTeX-Formelsatz).
- Ziel: Nachvollziehbarkeit statt „Black Box“; Studierende können Handrechnungen gegen den Rechner prüfen.
- Gültigkeitsgrenzen der Rechner sind hinterlegt und werden angezeigt (Eingaben außerhalb des Anwendungsbereichs).

### 2.5 Erkundungsaufträge („Ausprobieren“)

- Je Rechner-Modul 2–3 Vorhersagefragen („Was erwarten Sie, wenn …?“) mit Hinweis und Auflösung.
- Didaktisches Muster: Vorhersage – Ausprobieren – Erklären; fördert Parameterverständnis und das Erkennen nichtlinearer Zusammenhänge.

### 2.6 Barrierefreiheit

- Ziel WCAG 2.1 AA (Rechtsrahmen BayBGG/BayDiV); Erklärung zur Barrierefreiheit in der App.
- Automatisierte Prüfung mit axe-core über alle Modulrouten (Desktop 1440 px, Mobil 390 px, Stichprobe Dunkelmodus) als Ratchet in der CI; Ausgangswert der Baseline: 0 kritische/schwerwiegende Verstöße.
- Mobile Nutzbarkeit (Layoutprüfung bei 390 px), Tastaturbedienung, Textalternativen für Diagramme.

### 2.7 Evaluation

- Anonymer Kurzfragebogen in der App: fünf Aussagen mit fünfstufiger Zustimmungsskala und optionalem Freitext; gespeichert werden nur Zählwerte je Semester und Aussage (Datensparsamkeit).
- Ergänzend: Feedback-Funktion und Fehlermeldungen zu Normständen.
- Ergebnisse: [Text durch Prof. Huber] (erst nach Auswertung eines Semesters berichten)

### 2.8 Redaktionsmodell und Qualitätssicherung

- Prüfvermerk je Fachmodul (offen / geprüft / Nachprüfung), Patenschaften je Cluster.
- Automatisierte Prüfungen: Formelsatz, Normverweise, Quellen, Zahlformat (deutsche Schreibweise), verwaiste Dateien, Bundle-Größe, Typsicherheit.

## 3. Methode

- Art des Beitrags: Konzept- und Erfahrungsbericht (Design-based Research, erster Zyklus) – Einordnung: [Text durch Prof. Huber]
- Entwicklung: iterativ in Arbeitspaketen nach einem Umsetzungsplan (Phasen 0–6), jeweils mit Audit und messbaren Kennzahlen (Baseline in `docs/metriken.json`).
- Datengrundlage dieses Entwurfs: Strukturkennzahlen aus dem Repository (Abschnitt 4). Nutzungs- und Befragungsdaten: [Text durch Prof. Huber]
- Einsatzkontext: Lehrveranstaltungen der Fakultät für Architektur und Bauwesen der THA; konkrete Veranstaltungen, Semester und Teilnehmendenzahlen: [Text durch Prof. Huber]
- Grenzen: Kennzahlen beschreiben Umfang und Struktur, nicht Lernwirksamkeit; fachliche Prüfung der Module steht überwiegend noch aus.

## 4. Erste Kennzahlen (Stand 25.10.2026)

Erzeugt mit `node scripts/qa/metriken.mjs`, `node scripts/qa/check-katex.mjs` und einer Auswertung der Registry-
und Didaktik-Daten (`src/registry/modules.ts`, `src/data/lernziele.ts`, `src/data/erkundung.ts`,
`src/data/pruefvermerke.ts`). Vor einer Veröffentlichung neu erzeugen.

| Kennzahl | Wert |
|---|---|
| Einträge in der Modul-Registry (inkl. Info-Seiten) | 291 |
| Menügruppen / Gruppen der Modulübersicht | 29 / 29 |
| Fachmodule (mit Prüfvermerk) | 183 |
| Module nach Typ (Modulübersicht): Fachtext / Rechner / Datenbank / Norm / Quiz / Info | 91 / 65 / 18 / 15 / 15 / 53 |
| Module mit operationalisierten Lernzielen | 153 (alle Fachmodule mit Fachtext oder Rechner) |
| Lernziele insgesamt | 680 |
| Module mit Erkundungsaufträgen / Aufträge insgesamt | 73 / 217 |
| Quizfragen / Module mit Quizfragen | 1042 / 196 |
| Median Quizfragen je Modul | 6 |
| Anteil Fragen, bei denen die richtige Antwort die längste ist | 8 % |
| Quizfragen mit fachlicher Freigabe | 26 |
| Moduldateien mit Herleitungs-/Rechenwegbox | 162 |
| Moduldateien mit Selbsttest-Komponente | 158 |
| Geprüfte Formeln (KaTeX), davon fehlerhaft | 4092, 0 |
| Automatisierte Testdateien | 53 |
| axe-Baseline (kritisch/schwerwiegend) | 0 |
| Fachmodule mit abgeschlossener fachlicher Prüfung | 0 (alle „Prüfung ausstehend“) |

Hinweis: „Fachmodule“ = Module mit Fachinhalt außerhalb der Info-/Studienbereiche (Definition `istFachmodul`).

## 5. Diskussion (Stichpunkte)

- Nutzen der zentralen Registry für Konsistenz und Erweiterbarkeit; Aufwand der Pflege.
- Automatisierte Qualitätsprüfungen ersetzen keine fachliche Prüfung → Redaktionsmodell.
- Spannungsfeld Breite vs. Tiefe der Inhalte; Umgang mit Normänderungen.
- Übertragbarkeit auf andere Grundlagenfächer und Hochschulen: [Text durch Prof. Huber]

## 6. Ausblick

- Auswertung der Kurzbefragung über mindestens ein Semester; ggf. Vergleich mit Prüfungsergebnissen (Datenschutz beachten).
- Abschluss der fachlichen Modulprüfungen (Prüfvermerke) und Freigabe weiterer Quizfragen.
- Ausbau der Erkundungsaufträge auf alle Rechner; weitere Textalternativen für Diagramme.
- Einbindung in Lehrveranstaltungen und Weiterbildung: [Text durch Prof. Huber]

## 7. Offene Punkte vor dem Ausformulieren

- Zielzeitschrift und Rubrik festlegen, Autorenhinweise prüfen: [Text durch Prof. Huber]
- Literaturbasis (Hochschuldidaktik, digitale Lernumgebungen im Bauwesen): [Text durch Prof. Huber]
- Abbildungen: Modulübersicht (Baum), Beispielrechner mit Rechenweg, Erkundungsauftrag, Lernziele-Kopf.
- Kennzahlen unmittelbar vor Einreichung neu erzeugen.
