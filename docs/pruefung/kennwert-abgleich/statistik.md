# Kennwert-Abgleich: `statistik`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `statistik` (Labor & Auswertung, geprueft)
- **Komponente:** `src/modules/Statistik.tsx`
- **Dateien (6):** `content/statistik/Statistik.json`, `content/statistik/TTestTab.json`, `content/statistischeversuchsplanung/StatistischeVersuchsplanung.json`, `src/modules/Statistik.tsx`, `src/modules/StatistischeVersuchsplanung.tsx`, `src/modules/statistik/TTestTab.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 3 (0) |
| (3) Normverweise / Hinweise | 40 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Statistik.tsx:85` | `75` | ja | `return peakDensity > 0 ? (75 / peakDensity) * (1 - Math.min(0.25, intStats.stdDev / 120)) : 1000; // Darstellungsfaktor: Kurvenhöhe 75 px` |
| `src/modules/Statistik.tsx:85` | `120` | ja | `return peakDensity > 0 ? (75 / peakDensity) * (1 - Math.min(0.25, intStats.stdDev / 120)) : 1000; // Darstellungsfaktor: Kurvenhöhe 75 px` |
| `src/modules/Statistik.tsx:667` | `80` | ja | `: 115 - normalCDF(v, intStats.mean, intStats.stdDev) * 80; // Darstellungsfaktor: 80 px Höhe der Verteilungsfunktion` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 1 |  |
| DIN 53804-1 | – | – | 1 |  |
| EN 206 | – | – | 1 |  |
| EN 1990-1 | 2023 | – | 1 |  |
| EN 1990-1 | 2026-12 | – | 1 |  |
| EN 1990 | – | Anhang D, Tab. D1 | 12 |  |
| EN 1990 | 2021-10 | Anhang D | 4 |  |
| EN 1995-1-1 | – | – | 1 |  |
| ISO 2394 | 2015 | – | 1 |  |
| ISO 2854 | – | – | 1 |  |
| ISO 2859-1 | – | – | 1 |  |
| ISO 3534-1 | – | – | 2 |  |
| ISO 3534-3 | – | – | 2 |  |
| ISO 5725-2 | – | Tab. 5 | 8 |  |
| ISO 5725 | – | – | 2 |  |
| ISO 12491 | 1997-05 | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

