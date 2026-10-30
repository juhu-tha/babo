# Kennwert-Abgleich: `bauwerksdiagnose`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bauwerksdiagnose` (Bauen im Bestand, geprueft), `pruefverfahren_katalog` (Bauen im Bestand, offen), `zfp` (Bauen im Bestand, geprueft)
- **Komponente:** `src/modules/Bauwerksuntersuchung.tsx`
- **Dateien (32):** `content/bauwerksuntersuchung/Bauwerksuntersuchung.json`, `content/bauwerksuntersuchung/InterpretationNavigator.json`, `content/bauwerksuntersuchung/ProbenahmePlaner.json`, `content/bauwerksuntersuchung/PruefverfahrenKatalog.json`, `content/bauwerksuntersuchung/PruefverfahrenSimulatoren.json`, `content/bauwerksuntersuchung/diagnoseData.json`, `content/bauwerksuntersuchung/pruefverfahrenData.json`, `content/zfp/AkustischTab.json`, `content/zfp/DgzfpTab.json`, `content/zfp/ElektrochemischTab.json`, `content/zfp/ElektromagnetischTab.json`, `content/zfp/HolzTab.json`, `content/zfp/MechanischTab.json`, `content/zfp/ThermischTab.json`, `content/zfp/ZfP.json`, `content/zfp/daten.json`, `src/modules/Bauwerksuntersuchung.tsx`, `src/modules/ZfP.tsx`, `src/modules/bauwerksuntersuchung/InterpretationNavigator.tsx`, `src/modules/bauwerksuntersuchung/ProbenahmePlaner.tsx`, `src/modules/bauwerksuntersuchung/PruefverfahrenKatalog.tsx`, `src/modules/bauwerksuntersuchung/PruefverfahrenSimulatoren.tsx`, `src/modules/bauwerksuntersuchung/diagnoseData.ts`, `src/modules/bauwerksuntersuchung/pruefverfahrenData.ts`, `src/modules/zfp/AkustischTab.tsx`, `src/modules/zfp/DgzfpTab.tsx`, `src/modules/zfp/ElektrochemischTab.tsx`, `src/modules/zfp/ElektromagnetischTab.tsx`, `src/modules/zfp/HolzTab.tsx`, `src/modules/zfp/MechanischTab.tsx`, `src/modules/zfp/ThermischTab.tsx`, `src/modules/zfp/daten.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 1 |
| (1) Kennwerte übereinstimmend | 1 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 226 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

| Fundstelle | Wert im Text | zentral | Konstante | Ausschnitt |
|---|---|---|---|---|
| `src/data/quiz.json › qt_bauwerksdiagnose_2` | 31 N/mm² | 30 | `CONCRETE['C30/37'].fck` | …Beton mit f_ck = f_ck,is/0,85 höchstens einzustufen? C30/37 (f_ck ≈ 31 N/mm²) f_ck = f_ck,is/0,85 = 26,5/0,85 = 31… |

Übereinstimmend (1): `CONCRETE['C20/25'].fck_cube` ×1

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 3 |  |
| DIN 1045-3 | – | – | 2 |  |
| DIN 1045 | – | – | 1 |  |
| DIN 1076 | – | – | 7 |  |
| DIN 1076 | 2026-01 | – | 3 |  |
| DIN 4108-3 | – | – | 5 |  |
| DIN 18560-1 | 2021-02 | – | 1 |  |
| DIN 18560 | – | – | 1 |  |
| DIN 50159-1 | – | – | 1 |  |
| DIN 51131 | – | – | 1 |  |
| DIN 52617 | – | – | 1 |  |
| DIN 68800-2 | – | – | 3 |  |
| DIN 68800-4 | – | – | 4 |  |
| DIN 68800-4 | 2020-12 | – | 2 |  |
| DIN 68800 | – | – | 3 |  |
| EN 206 | – | – | 5 |  |
| EN 206 | 2021-06 | – | 1 |  |
| EN 302 | – | – | 2 |  |
| EN 338 | 2016-07 | – | 1 |  |
| EN 446 | – | – | 1 |  |
| EN 1504-3 | – | – | 1 |  |
| EN 1504 | – | – | 1 |  |
| EN 1542 | – | – | 11 |  |
| EN 1542 | 1999-07 | – | 3 |  |
| EN 1881 | – | – | 1 |  |
| EN 1992-1-1/NA | – | Tab. 4.4DE | 2 |  |
| EN 1992-1-1 | – | – | 8 |  |
| EN 1992-1-1 | 2011-01 | – | 1 | Ausgaben uneinheitlich |
| EN 1992-1-2 | – | – | 1 |  |
| EN 1995-1-1 | – | – | 1 |  |
| EN 12390-3 | – | – | 4 |  |
| EN 12390-3 | 2019-10 | – | 1 |  |
| EN 12504-1 | – | – | 12 |  |
| EN 12504-1 | 2021-02 | – | 3 |  |
| EN 12504-2 | – | – | 6 |  |
| EN 12504-2 | 2021-10 | – | 2 |  |
| EN 12504-4 | – | – | 8 |  |
| EN 12504-4 | 2021-10 | – | 2 |  |
| EN 12504 | – | – | 1 |  |
| EN 13183-2 | – | – | 1 |  |
| EN 13187 | – | – | 1 |  |
| EN 13791 | – | Tab. 1 | 30 |  |
| EN 13791 | 2020 | – | 3 |  |
| EN 13791 | 2020-02 | – | 14 |  |
| EN 14430 | – | – | 1 |  |
| EN 14629 | – | – | 10 |  |
| EN 14629 | 2007-06 | – | 2 |  |
| EN 14630 | – | – | 8 |  |
| EN 14630 | 2007-01 | – | 4 |  |
| EN 16302 | – | – | 2 |  |
| EN 16302 | 2013-05 | – | 1 |  |
| EN ISO 5579 | – | – | 1 |  |
| EN ISO 6507 | – | – | 1 |  |
| EN ISO 8501-1 | – | – | 2 |  |
| EN ISO 9001 | – | – | 1 |  |
| EN ISO 9972 | – | – | 1 |  |
| EN ISO 12570 | – | – | 6 |  |
| EN ISO 12570 | 2000-04 | – | 1 |  |
| EN ISO 12571 | – | – | 1 |  |
| EN ISO 12696 | – | – | 4 |  |
| EN ISO 12696 | 2022-09 | – | 1 |  |
| EN ISO 15148 | – | – | 4 |  |
| ISO 8289 | – | – | 1 |  |
| VDI 6200 | – | – | 7 |  |
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

