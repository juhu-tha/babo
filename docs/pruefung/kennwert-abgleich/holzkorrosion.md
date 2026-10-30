# Kennwert-Abgleich: `holzkorrosion`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `holzkorrosion` (Dauerhaftigkeit, offen)
- **Komponente:** `src/modules/Holzkorrosion.tsx`
- **Dateien (2):** `content/holzkorrosion/Holzkorrosion.json`, `src/modules/Holzkorrosion.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 3 (3) |
| (3) Normverweise / Hinweise | 40 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Holzkorrosion.tsx:116` | `30` | – | `const percentOfSaturation = Math.min(100, (woodMoisture / 30) * 100);` |
| `src/modules/Holzkorrosion.tsx:117` | `30` | – | `const freeWaterLevel = woodMoisture > 30 ? Math.min(100, ((woodMoisture - 30) / 70) * 100) : 0;` |
| `src/modules/Holzkorrosion.tsx:117` | `70` | – | `const freeWaterLevel = woodMoisture > 30 ? Math.min(100, ((woodMoisture - 30) / 70) * 100) : 0;` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 68800-1 | – | – | 6 |  |
| DIN 68800-1 | 2019-06 | – | 2 |  |
| DIN 68800-2 | 2022-02 | – | 1 |  |
| DIN 68800-3 | 2020-03 | – | 2 |  |
| DIN 68800-4 | – | – | 4 |  |
| DIN 68800-4 | 2020-12 | – | 2 |  |
| DIN 68800 | – | – | 7 |  |
| EN 113 | – | – | 1 |  |
| EN 152 | – | – | 1 |  |
| EN 350 | 2016 | – | 2 |  |
| EN 350 | 2016-12 | – | 1 |  |
| EN 351-1 | – | – | 4 |  |
| EN 351-1 | 2023-07 | – | 2 |  |
| EN 13183-1 | – | – | 4 |  |
| EN 13183-2 | – | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

