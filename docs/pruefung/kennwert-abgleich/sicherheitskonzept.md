# Kennwert-Abgleich: `sicherheitskonzept`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `sicherheitskonzept` (Grundlagen, geprueft)
- **Komponente:** `src/modules/Sicherheitskonzept.tsx`
- **Dateien (2):** `content/sicherheitskonzept/Sicherheitskonzept.json`, `src/modules/Sicherheitskonzept.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 40 / 4 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| EN 1990-1 | – | – | 1 |  |
| EN 1990-1 | 2023 | – | 1 |  |
| EN 1990-1 | 2026-12 | – | 1 |  |
| EN 1990/NA | – | Gl. 6.10, Tab. NA | 7 |  |
| EN 1990/NA | 2010-12 | – | 2 | Ausgaben uneinheitlich |
| EN 1990/NA | 2012-08 | – | 1 | Ausgaben uneinheitlich |
| EN 1990 | – | Gl. 6.8, Gl. 6.10 | 3 |  |
| EN 1990 | 2010-12 | – | 2 | Ausgaben uneinheitlich |
| EN 1990 | 2021-10 | – | 2 | Ausgaben uneinheitlich |
| EN 1990 | 2023 | – | 1 | Ausgaben uneinheitlich |
| EN 1991-1-4 | – | – | 1 |  |
| EN 1991 | – | – | 2 |  |
| EN 1992-1-1/NA | – | Tab. 2.1DE | 3 |  |
| EN 1992-1-1 | 2023 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1992-1-1 | 2025-09 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1992 | – | – | 1 |  |
| EN 1993-1-1/NA | – | – | 1 |  |
| EN 1993-1-1 | 2025-04 | – | 1 | Ausgaben uneinheitlich; Registry 2010-12 |
| EN 1993 | – | – | 1 |  |
| EN 1994 | – | – | 1 |  |
| EN 1995-1-1/NA | – | – | 1 |  |
| EN 1995 | – | – | 1 |  |
| EN 1996 | – | – | 1 |  |
| EN 1997 | – | – | 1 |  |
| EN 1998 | – | – | 1 |  |
| EN 1999 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 1990:** 2010-12 (2×, teils mit Hinweis auf andere Ausgabe), 2021-10 (9×, teils mit Hinweis auf andere Ausgabe), 2023 (6×, teils mit Hinweis auf andere Ausgabe)
  - 2021-10 (mit Hinweis): `content/sicherheitskonzept/Sicherheitskonzept.json › texte.geltendeFassungInDeutschland` – **Geltende Fassung in Deutschland:** DIN EN 1990:2021-10 (berichtigte Neuausgabe von DIN EN 1990…
  - 2010-12 (mit Hinweis): `content/sicherheitskonzept/Sicherheitskonzept.json › texte.geltendeFassungInDeutschland` – …ung in Deutschland:** DIN EN 1990:2021-10 (berichtigte Neuausgabe von DIN EN 1990:2010-12) mit Nationalem Anhang DIN EN 1990/NA:2…
  - 2023 (mit Hinweis): `content/sicherheitskonzept/Sicherheitskonzept.json › texte.zweiteEurocodeGenerationCen` – …te Eurocode-Generation:** CEN hat die überarbeiteten Eurocodes (u. a. EN 1990:2023, mit A1:2026 als EN 1990-1 „Neubauten“…
  - 2021-10 (mit Hinweis): `content/sicherheitskonzept/Sicherheitskonzept.json › daten.Sicherheitskonzept.regelwerke.0.title` – DIN EN 1990:2021-10 mit NA (Eurocode 0: Grundlagen der Trag…
  - 2010-12 (mit Hinweis): `content/sicherheitskonzept/Sicherheitskonzept.json › daten.Sicherheitskonzept.regelwerke.0.title` – …:2021-10 mit NA (Eurocode 0: Grundlagen der Tragwerksplanung; ersetzt DIN EN 1990:2010-12); Nachfolger DIN EN 1990-1:2026-12 (EN…
- **EN 1990/NA:** 2010-12 (2×, teils mit Hinweis auf andere Ausgabe), 2012-08 (1×)
  - 2010-12 (mit Hinweis): `content/sicherheitskonzept/Sicherheitskonzept.json › texte.geltendeFassungInDeutschland` – …berichtigte Neuausgabe von DIN EN 1990:2010-12) mit Nationalem Anhang DIN EN 1990/NA:2010-12 und Änderung /NA/A1:2012-08. Jeder Euro…
  - 2010-12: `content/sicherheitskonzept/Sicherheitskonzept.json › daten.Sicherheitskonzept.regelwerke.1.title` – DIN EN 1990/NA:2010-12 und DIN EN 1990/NA/A1:2012-08 (National…
  - 2012-08: `content/sicherheitskonzept/Sicherheitskonzept.json › daten.Sicherheitskonzept.regelwerke.1.title` – DIN EN 1990/NA:2010-12 und DIN EN 1990/NA/A1:2012-08 (Nationaler Anhang)
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2023 (mit Hinweis): `content/sicherheitskonzept/Sicherheitskonzept.json › texte.zweiteEurocodeGenerationCen` – …. a. EN 1990:2023, mit A1:2026 als EN 1990-1 „Neubauten“ geführt, und EN 1992-1-1:2023) veröffentlicht; die ersten deutschen F…
  - 2025-09 (mit Hinweis): `content/sicherheitskonzept/Sicherheitskonzept.json › texte.zweiteEurocodeGenerationCen` – …n deutschen Fassungen sind erschienen (z. B. DIN EN 1993-1-1:2025-04, DIN EN 1992-1-1:2025-09). Bauaufsichtlich anwendbar werden sie…
- **EN 1993-1-1:** 2010-12 (9×, teils mit Hinweis auf andere Ausgabe), 2022 (1×, teils mit Hinweis auf andere Ausgabe), 2025-04 (12×, teils mit Hinweis auf andere Ausgabe)
  - 2025-04 (mit Hinweis): `content/sicherheitskonzept/Sicherheitskonzept.json › texte.zweiteEurocodeGenerationCen` – …veröffentlicht; die ersten deutschen Fassungen sind erschienen (z. B. DIN EN 1993-1-1:2025-04, DIN EN 1992-1-1:2025-09). Bauaufsichtl…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

