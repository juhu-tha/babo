# Kennwert-Abgleich: `materialmodelle`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `materialmodelle` (Mechanik, geprueft)
- **Komponente:** `src/modules/Materialmodelle.tsx`
- **Dateien (2):** `content/materialmodelle/Materialmodelle.json`, `src/modules/Materialmodelle.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 18 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1342-1 | – | – | 1 |  |
| DIN 1342 | – | – | 1 |  |
| DIN 18008 | – | – | 1 |  |
| EN 206 | – | – | 1 |  |
| EN 1337-3 | – | – | 1 |  |
| EN 1990 | 2021-10 | – | 1 |  |
| EN 1992-1-1 | – | Anhang C, Bild 3.8 | 5 |  |
| EN 1992-1-1 | 2011-01 | – | 1 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2025-09 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1993-1-1 | – | – | 1 |  |
| EN 1993-1-1 | 2010-12 | – | 1 | Ausgaben uneinheitlich |
| EN 1993-1-1 | 2025-04 | – | 1 | Ausgaben uneinheitlich; Registry 2010-12 |
| EN 1995-1-1 | – | Tab. 3.2 | 1 |  |
| EN 13108 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01: `content/materialmodelle/Materialmodelle.json › daten.Materialmodelle.regelwerke.1.title` – DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04 (Eurocode 2…
  - 2025-09 (mit Hinweis): `content/materialmodelle/Materialmodelle.json › daten.Materialmodelle.regelwerke.1.title` – …04 (Eurocode 2, 3.1.5 / 3.1.7 / 3.2.7 Arbeitslinien); neue Generation DIN EN 1992-1-1:2025-09
- **EN 1993-1-1:** 2010-12 (9×, teils mit Hinweis auf andere Ausgabe), 2022 (1×, teils mit Hinweis auf andere Ausgabe), 2025-04 (12×, teils mit Hinweis auf andere Ausgabe)
  - 2010-12: `content/materialmodelle/Materialmodelle.json › daten.Materialmodelle.regelwerke.2.title` – DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA (Eurocode 3, 5.4.3…
  - 2025-04 (mit Hinweis): `content/materialmodelle/Materialmodelle.json › daten.Materialmodelle.regelwerke.2.title` – …A (Eurocode 3, 5.4.3 plastische Tragwerksberechnung); neue Generation DIN EN 1993-1-1:2025-04

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

