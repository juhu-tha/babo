# Kennwert-Abgleich: `bauwerksunters_monitoring`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bauwerksunters_monitoring` (Mängel & Schäden, offen)
- **Komponente:** `src/modules/Bauwerksunters_Monitoring.tsx`
- **Dateien (10):** `content/bauwerksunters_monitoring/Bauwerksunters_Monitoring.json`, `content/bauwerksuntersuchung/PruefverfahrenKatalog.json`, `content/bauwerksuntersuchung/PruefverfahrenSimulatoren.json`, `content/bauwerksuntersuchung/diagnoseData.json`, `content/bauwerksuntersuchung/pruefverfahrenData.json`, `src/modules/Bauwerksunters_Monitoring.tsx`, `src/modules/bauwerksuntersuchung/PruefverfahrenKatalog.tsx`, `src/modules/bauwerksuntersuchung/PruefverfahrenSimulatoren.tsx`, `src/modules/bauwerksuntersuchung/diagnoseData.ts`, `src/modules/bauwerksuntersuchung/pruefverfahrenData.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 1 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 4 (4) |
| (3) Normverweise / Hinweise | 137 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (1): `CONCRETE['C20/25'].fck_cube` ×1

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Bauwerksunters_Monitoring.tsx:75` | `40` | – | `const t = (d - 40) / 55; // 0 to 1` |
| `src/modules/Bauwerksunters_Monitoring.tsx:75` | `55` | – | `const t = (d - 40) / 55; // 0 to 1` |
| `src/modules/Bauwerksunters_Monitoring.tsx:84` | `30` | – | `const t = d / 30;` |
| `src/modules/Bauwerksunters_Monitoring.tsx:85` | `0.8` | – | `modifier = 0.2 + t * 0.8;` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 3 |  |
| DIN 1076 | – | – | 8 |  |
| DIN 1076 | 2026-01 | – | 3 |  |
| DIN 4108-3 | – | – | 4 |  |
| DIN 18356 | – | – | 1 |  |
| DIN 18560-1 | – | – | 1 |  |
| DIN 18560-1 | 2021-02 | – | 1 |  |
| DIN 18560 | – | – | 1 |  |
| DIN 45669-1 | – | – | 1 |  |
| DIN 68800-2 | – | – | 2 |  |
| DIN 68800-4 | – | – | 3 |  |
| DIN 68800-4 | 2020-12 | – | 2 |  |
| DIN 68800 | – | – | 3 |  |
| EN 206 | – | – | 4 |  |
| EN 206 | 2021-06 | – | 1 |  |
| EN 302 | – | – | 2 |  |
| EN 338 | 2016-07 | – | 1 |  |
| EN 446 | – | – | 1 |  |
| EN 1542 | – | – | 5 |  |
| EN 1542 | 1999-07 | – | 1 |  |
| EN 1992-1-1/NA | – | Tab. 4.4DE | 2 |  |
| EN 1992-1-1 | – | – | 3 |  |
| EN 1992-1-1 | 2011-01 | – | 1 | Ausgaben uneinheitlich |
| EN 1992-1-2 | – | – | 1 |  |
| EN 12390-3 | – | – | 3 |  |
| EN 12390-3 | 2019-10 | – | 1 |  |
| EN 12504-1 | – | – | 7 |  |
| EN 12504-1 | 2021-02 | – | 1 |  |
| EN 12504-2 | – | – | 5 |  |
| EN 12504-2 | 2021-10 | – | 1 |  |
| EN 12504-4 | – | – | 5 |  |
| EN 12504-4 | 2021-10 | – | 1 |  |
| EN 13183-2 | – | – | 1 |  |
| EN 13791 | – | Tab. 1 | 20 |  |
| EN 13791 | 2020-02 | – | 6 |  |
| EN 14629 | – | – | 3 |  |
| EN 14629 | 2007-06 | – | 1 |  |
| EN 14630 | – | – | 3 |  |
| EN 14630 | 2007-01 | – | 1 |  |
| EN 16302 | – | – | 2 |  |
| EN 16302 | 2013-05 | – | 1 |  |
| EN ISO 8501-1 | – | – | 1 |  |
| EN ISO 12570 | – | – | 6 |  |
| EN ISO 12570 | 2000-04 | – | 1 |  |
| EN ISO 12571 | – | – | 1 |  |
| EN ISO 12696 | – | – | 3 |  |
| EN ISO 12696 | 2022-09 | – | 1 |  |
| EN ISO 15148 | – | – | 3 |  |
| VDI 2038 | – | – | 1 |  |
| VDI 6200 | – | – | 2 |  |
| VDI 6200 | 2010-02 | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01: `content/bauwerksuntersuchung/diagnoseData.json › werte.dinEn199212` – DIN EN 1992-1-1:2011-01

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

