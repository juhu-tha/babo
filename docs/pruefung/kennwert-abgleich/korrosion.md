# Kennwert-Abgleich: `korrosion`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `korrosion` (Dauerhaftigkeit, geprueft)
- **Komponente:** `src/modules/Korrosion.tsx`
- **Dateien (2):** `content/korrosion/Korrosion.json`, `src/modules/Korrosion.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 1 (0) |
| (3) Normverweise / Hinweise | 14 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Korrosion.tsx:276` | `3.5` | ja | `const rebarCenterY = 40 + coverMm * 3.5 + 45; // Darstellungsfaktor 3,5 px je mm` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 1 |  |
| DIN 1045-3 | – | – | 1 |  |
| DIN 1045-4 | – | – | 1 |  |
| DIN 1045 | 2023 | – | 1 | Ausgaben uneinheitlich |
| EN 206-1 | – | – | 1 |  |
| EN 1992-1-1 | – | – | 1 |  |
| EN 1992-1-1 | 2011-01 | – | 1 | Ausgaben uneinheitlich |
| EN 12390-10 | 2019-02 | – | 1 |  |
| EN 12390-12 | – | – | 3 |  |
| EN 12390-12 | 2020-04 | – | 1 |  |
| EN 12620 | – | – | 1 |  |
| EN ISO 8044 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045:** 1937 (2×), 1959 (1×, teils mit Hinweis auf andere Ausgabe), 1972 (4×), 1978 (2×), 1988 (1×), 2023 (1×, teils mit Hinweis auf andere Ausgabe), 2023-08 (1×)
  - 2023 (mit Hinweis): `content/korrosion/Korrosion.json › daten.Korrosion.literatur.1` – …EN 12620, 2. überarb. Aufl. Berlin: Beuth 2011 (keine Neuausgabe zur DIN 1045:2023, Stand 10/2026)
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01: `content/korrosion/Korrosion.json › daten.Korrosion.regelwerke.2.title` – DIN EN 1992-1-1:2011-01 + NA (Eurocode 2: Betondeckung cnom und…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

