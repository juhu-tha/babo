# Kennwert-Abgleich: `betonpraxis`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `betonpraxis` (Betontechnologie, geprueft)
- **Komponente:** `src/modules/Betonpraxis.tsx`
- **Dateien (2):** `content/betonpraxis/Betonpraxis.json`, `src/modules/Betonpraxis.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 2 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 8 (0) |
| (3) Normverweise / Hinweise | 35 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (2): `CONCRETE['C30/37'].fcm` ×2

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Betonpraxis.tsx:171` | `70` | ja | `const kValue = calcMK > 0 ? (calcW - 70) / calcMK : 0;` |
| `src/modules/Betonpraxis.tsx:200` | `2.25` | ja | `const predictedFlowIncrease = (waterAddition / 2.25) * 10; // Lehrwert (Faustregel): +10 mm Ausbreitmaß je 2 bis 2,5 l/m³` |
| `src/modules/Betonpraxis.tsx:201` | `3.5` | ja | `const predictedStrengthLoss = (waterAddition / 10) * 3.5; // -3 to -4 N/mm² for 10 l/m³` |
| `src/modules/Betonpraxis.tsx:217` | `20` | ja | `walkTimeFactor = 1.0 - ((tempWalk - 20) / 10) * 0.4;` |
| `src/modules/Betonpraxis.tsx:217` | `0.4` | ja | `walkTimeFactor = 1.0 - ((tempWalk - 20) / 10) * 0.4;` |
| `src/modules/Betonpraxis.tsx:226` | `0.8` | ja | `walkTimeFactor = 4.0 + ((5 - tempWalk) * 0.8); // Lehrannahme: +0,8 je K unter 5 °C (Näherung)` |
| `src/modules/Betonpraxis.tsx:232` | `0.85` | ja | `const reqBkMin = 0.85 * (fck - 4); // Faktor 0,85 nach DIN EN 13791:2020-02 (In-situ/Normprobe)` |
| `src/modules/Betonpraxis.tsx:235` | `0.85` | ja | `const reqBkMedian = coresTested <= 4 ? 0.85 * (fck + 1) : 0.85 * (fck + 2); // Faktor 0,85 nach DIN EN 13791:2020-02` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 3 |  |
| DIN 1045-2 | 2023-08 | – | 1 | Ausgaben uneinheitlich |
| DIN 1045-3 | – | Tab. M | 6 |  |
| DIN 1045-3 | 2023-08 | – | 1 |  |
| DIN 1045-100 | – | – | 1 |  |
| DIN 1045 | – | – | 5 |  |
| DIN 18560-7 | – | – | 1 |  |
| EN 206 | – | – | 2 |  |
| EN 206 | 2021-06 | – | 1 |  |
| EN 1992-1-1/NA | 2013-04 | – | 1 |  |
| EN 12350-8 | – | – | 1 |  |
| EN 12504-1 | – | – | 2 |  |
| EN 13670 | – | – | 1 |  |
| EN 13670 | 2011-03 | – | 1 |  |
| EN 13791 | – | – | 2 |  |
| EN 13791 | 2020-02 | – | 6 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/betonpraxis/Betonpraxis.json › daten.Betonpraxis.regelwerke.0.title` – DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton: Festlegung, Eigenschaften, Hers…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

