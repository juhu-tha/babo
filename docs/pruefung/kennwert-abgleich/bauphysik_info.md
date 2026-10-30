# Kennwert-Abgleich: `bauphysik_info`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bauphysik_info` (Bauphysik, offen), `bauprodukte_info` (Bauprodukte, offen), `baustoffe_info` (Baustoffe, offen), `bestand_info` (Bauen im Bestand, offen), `dauerhaftigkeit_info` (Dauerhaftigkeit, offen), `digitales_info` (Digitales, offen), `grundlagen_info` (Grundlagen, offen), `instandsetzung_info` (Schutz & Instandsetzung, offen), `labor_info` (Labor & Auswertung, offen), `mechanik_info` (Mechanik, offen), `nachhaltigkeit_info` (Nachhaltigkeit, offen), `praxiswissen_info` (Praxiswissen, offen), `rueckbau_info` (Rückbau & Schadstoffe, offen), `schaeden_info` (Mängel & Schäden, offen), `stahlbeton_info` (Massivbau, offen)
- **Komponente:** `src/modules/ModuleInfo.tsx`
- **Dateien (7):** `content/moduleinfo/ModuleInfo.json`, `content/moduleinfo/daten.json`, `content/moduleinfo/ressourcen.json`, `src/data/moduleHistoryData.ts`, `src/modules/ModuleInfo.tsx`, `src/modules/moduleinfo/daten.tsx`, `src/modules/moduleinfo/ressourcen.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 1 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 381 / 9 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (1): `QNG_WG.premium` ×1

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 820 | – | – | 1 |  |
| DIN 1045-1 | – | – | 2 |  |
| DIN 1045-1 | 2001 | – | 1 |  |
| DIN 1045-2 | – | – | 12 |  |
| DIN 1045-2 | 2023 | – | 1 | Ausgaben uneinheitlich |
| DIN 1045-2 | 2023-08 | – | 3 | Ausgaben uneinheitlich |
| DIN 1045-3 | – | – | 1 |  |
| DIN 1045-3 | 2023-08 | – | 1 |  |
| DIN 1045-100 | – | – | 1 |  |
| DIN 1045 | – | – | 6 |  |
| DIN 1050 | – | – | 1 |  |
| DIN 1054 | – | – | 2 |  |
| DIN 1076 | – | – | 6 |  |
| DIN 1076 | 2026-01 | – | 1 |  |
| DIN 1301-1 | – | – | 1 |  |
| DIN 1301-1 | 2010-10 | – | 1 |  |
| DIN 1342 | – | – | 1 |  |
| DIN 1946-6 | – | – | 2 |  |
| DIN 4019 | – | – | 1 |  |
| DIN 4074 | – | – | 1 |  |
| DIN 4085 | – | – | 1 |  |
| DIN 4102 | – | – | 1 |  |
| DIN 4108-2 | – | – | 1 |  |
| DIN 4108-3 | – | – | 5 |  |
| DIN 4108-3 | 2024-03 | – | 1 | Ausgaben uneinheitlich |
| DIN 4108-4 | – | – | 1 |  |
| DIN 4108-10 | – | – | 2 |  |
| DIN 4108 | – | – | 3 |  |
| DIN 4108 | 1952 | – | 1 |  |
| DIN 4109-1 | – | – | 2 |  |
| DIN 4109-32 | 2016-07 | – | 1 |  |
| DIN 4123 | – | – | 1 |  |
| DIN 4227 | – | – | 1 |  |
| DIN 18007 | – | – | 2 |  |
| DIN 18007 | 2022-09 | – | 1 |  |
| DIN 18008 | – | – | 4 |  |
| DIN 18041 | – | – | 1 |  |
| DIN 18041 | 2016-03 | – | 1 |  |
| DIN 18127 | – | – | 1 |  |
| DIN 18180 | – | – | 1 |  |
| DIN 18181 | – | – | 1 |  |
| DIN 18196 | – | – | 3 |  |
| DIN 18516 | – | – | 1 |  |
| DIN 18531 | – | – | 1 |  |
| DIN 18533 | – | – | 3 |  |
| DIN 18535 | – | – | 1 |  |
| DIN 18560 | – | – | 1 |  |
| DIN 18945-189 | – | – | 1 |  |
| DIN 18945 | – | – | 3 |  |
| DIN 18948 | – | – | 1 |  |
| DIN 18960 | – | – | 1 |  |
| DIN 19698-1 | – | – | 2 |  |
| DIN 68800-1 | – | – | 1 |  |
| DIN 68800 | – | – | 8 |  |
| DIN SPEC 91484 | – | – | 2 |  |
| DIN SPEC 91484 | 2023-09 | – | 1 |  |
| DIN SPEC 91525 | – | – | 1 |  |
| DIN SPEC 91525 | 2026-02 | – | 1 |  |
| EN 197-1 | – | – | 1 |  |
| EN 197-5 | – | – | 3 |  |
| EN 206-1 | – | – | 3 |  |
| EN 206-1 | 2001 | – | 2 | Ausgaben uneinheitlich; Registry 2026-07 |
| EN 206-9 | – | – | 1 |  |
| EN 206 | – | Abschn. 8.2.1, Tab. 14 | 19 |  |
| EN 206 | 2021-06 | – | 2 |  |
| EN 338 | – | – | 1 |  |
| EN 350 | 2016-12 | – | 1 |  |
| EN 351-1 | 2023-07 | – | 1 |  |
| EN 459 | – | – | 1 |  |
| EN 485 | – | – | 1 |  |
| EN 490 | – | – | 1 |  |
| EN 771-6 | – | – | 1 |  |
| EN 771 | – | – | 1 |  |
| EN 934-2 | – | – | 1 |  |
| EN 934 | – | – | 1 |  |
| EN 998-1 | – | – | 1 |  |
| EN 1168 | – | – | 1 |  |
| EN 1172 | – | – | 1 |  |
| EN 1279 | – | – | 1 |  |
| EN 1338 | – | – | 1 |  |
| EN 1504-1 | – | – | 1 |  |
| EN 1504-2 | – | – | 1 |  |
| EN 1504-5 | – | – | 1 |  |
| EN 1504-9 | – | – | 3 |  |
| EN 1504-10 | – | – | 1 |  |
| EN 1504 | – | – | 6 |  |
| EN 1542 | – | – | 4 |  |
| EN 1610 | – | – | 1 |  |
| EN 1990-2 | – | – | 1 |  |
| EN 1990-2 | 2026 | – | 2 |  |
| EN 1990 | – | Anhang D, Anhang D.7.2 | 14 |  |
| EN 1991-1-1 | – | – | 1 |  |
| EN 1992-1-1 | – | Gl. 7.8 | 20 |  |
| EN 1992-1-1 | 2011 | – | 2 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2023 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1993-1-1 | – | – | 3 |  |
| EN 1993-1-1 | 2010-12 | – | 1 | Ausgaben uneinheitlich |
| EN 1993-1-1 | 2025-04 | – | 1 | Ausgaben uneinheitlich; Registry 2010-12 |
| EN 1995-1-1 | – | Gl. 2.14 | 6 |  |
| EN 1995-1-1 | 2010-12 | – | 1 | Ausgaben uneinheitlich |
| EN 1995-1-2 | – | – | 3 |  |
| EN 1995-1-2 | 2010-12 | – | 1 |  |
| EN 1995 | – | – | 1 |  |
| EN 1996 | – | – | 2 |  |
| EN 1997-1 | – | – | 1 |  |
| EN 1997-1 | 2014-03 | – | 1 |  |
| EN 10025 | – | – | 3 |  |
| EN 12150 | – | – | 1 |  |
| EN 12350 | – | – | 2 |  |
| EN 12390-1 | – | – | 1 |  |
| EN 12390-3 | – | – | 3 |  |
| EN 12390-13 | – | – | 1 |  |
| EN 12390-16 | – | – | 1 |  |
| EN 12390 | – | – | 2 |  |
| EN 12504-1 | – | – | 3 |  |
| EN 12504-2 | – | – | 2 |  |
| EN 12504 | – | – | 1 |  |
| EN 12620 | – | – | 3 |  |
| EN 13055 | – | – | 1 |  |
| EN 13108 | – | – | 1 |  |
| EN 13225 | – | – | 1 |  |
| EN 13279 | – | – | 1 |  |
| EN 13501-1 | – | – | 1 |  |
| EN 13670 | – | – | 1 |  |
| EN 13747 | – | – | 1 |  |
| EN 13791 | – | – | 4 |  |
| EN 13791 | 2020-02 | – | 2 |  |
| EN 13813 | – | – | 1 |  |
| EN 13925-1 | – | – | 1 |  |
| EN 14080 | – | – | 2 |  |
| EN 14179 | – | – | 2 |  |
| EN 14351-1 | – | – | 1 |  |
| EN 14487 | – | – | 1 |  |
| EN 14629 | – | – | 1 |  |
| EN 15026 | – | – | 1 |  |
| EN 15651 | – | – | 1 |  |
| EN 15804 | – | – | 10 |  |
| EN 15804 | 2022-03 | – | 1 | Ausgaben uneinheitlich |
| EN 15978 | – | – | 2 |  |
| EN 15978 | 2026 | – | 1 |  |
| EN 15978 | 2026-09 | – | 2 |  |
| EN 16351 | – | – | 1 |  |
| EN 16449 | – | – | 1 |  |
| EN 16627 | – | – | 1 |  |
| EN 17140 | – | – | 1 |  |
| EN 17472 | – | – | 1 |  |
| EN ISO 1043 | – | – | 1 |  |
| EN ISO 6892-1 | – | – | 1 |  |
| EN ISO 6946 | – | – | 2 |  |
| EN ISO 7500-1 | – | – | 1 |  |
| EN ISO 9223 | 2012-05 | – | 1 |  |
| EN ISO 10077 | – | – | 1 |  |
| EN ISO 10456 | – | – | 3 |  |
| EN ISO 12570 | – | – | 1 |  |
| EN ISO 12696 | – | – | 2 |  |
| EN ISO 12944-2 | – | – | 2 |  |
| EN ISO 12944 | – | – | 5 |  |
| EN ISO 13788 | – | – | 1 |  |
| EN ISO 14040 | – | – | 1 |  |
| EN ISO 14713 | – | – | 1 |  |
| EN ISO 19650-1 | – | – | 2 |  |
| EN ISO 19650 | – | – | 2 |  |
| EN ISO 80000-1 | – | – | 2 |  |
| ISO 2394 | – | – | 1 |  |
| ISO 5725-1 | – | – | 1 |  |
| ISO 12135 | – | – | 1 |  |
| ISO 12491 | – | – | 5 |  |
| ISO 12491 | 1997-05 | – | 1 |  |
| ISO 12737 | – | – | 1 |  |
| ISO 12944 | – | – | 3 |  |
| ISO 13528 | – | – | 1 |  |
| ISO 14024 | – | – | 1 |  |
| ISO 14025 | – | – | 1 |  |
| ISO 15686-5 | – | – | 1 |  |
| ISO 15686-5 | 2017 | – | 1 |  |
| ISO 15901-1 | – | – | 1 |  |
| ISO 16204 | – | – | 2 |  |
| ISO 16739-1 | 2024 | – | 3 |  |
| ISO 16739 | – | – | 1 |  |
| ISO 20887 | – | – | 1 |  |
| ISO 23386 | – | – | 1 |  |
| VDI 2014 | – | – | 1 |  |
| VDI 2552 | – | – | 1 |  |
| VDI 4800 | – | – | 1 |  |
| VDI 6200 | – | – | 12 |  |
| VDI 6200 | 2010-02 | – | 1 |  |
| VDI 6202 | – | – | 1 |  |
| VDI 6210 | – | – | 3 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008 (2×), 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (139×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/moduleinfo/daten.json › werte.dinEn2062021` – DIN EN 206:2021-06 / DIN 1045-2:2023-08 / DIN EN 1992-1-1 + NA
  - 2023-08: `content/moduleinfo/daten.json › daten.MODULES_DATA.stahlbeton.regelwerke.3.title` – DIN 1045-2:2023-08 (Beton) und DIN 1045-3:2023-08 (Bauausf…
  - 2023-08: `content/moduleinfo/daten.json › daten.MODULES_DATA.dauerhaftigkeit.regelwerke.2.title` – DIN 1045-2:2023-08: Tragwerke aus Beton, Stahlbeton und Sp…
  - 2023: `src/data/moduleHistoryData.ts:258` – keyReference: 'DIN EN 197-5 / DIN 1045-2:2023'
- **DIN 4108-3:** 2018-10 (3×), 2024-03 (17×, teils mit Hinweis auf andere Ausgabe)
  - 2024-03: `content/moduleinfo/daten.json › werte.din410832024` – DIN 4108-3:2024-03; DIN EN ISO 13788
- **EN 15804:** 2012 (6×, teils mit Hinweis auf andere Ausgabe), 2022-03 (14×, teils mit Hinweis auf andere Ausgabe)
  - 2022-03: `content/moduleinfo/daten.json › daten.MODULES_DATA.nachhaltigkeit.regelwerke.0.title` – DIN EN 15804:2022-03 (Umweltproduktdeklarationen; EN 15804+A…
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011: `src/data/moduleHistoryData.ts:299` – keyReference: 'DIN EN 1992-1-1:2011 (Eurocode 2)'
  - 2011: `src/data/moduleHistoryData.ts:691` – keyReference: 'DIN EN 206-1:2001 / DIN 1045-1:2001 / DIN EN 1992-1-1:2011'
  - 2023 (mit Hinweis): `src/data/moduleHistoryData.ts:697` – …e 2023-08 Betonbauqualitätsklassen ein; die neue Eurocode-Generation (EN 1992-1-1:2023) nimmt Expositionswiderstandsklassen (E…
- **EN 1993-1-1:** 2010-12 (9×, teils mit Hinweis auf andere Ausgabe), 2022 (1×, teils mit Hinweis auf andere Ausgabe), 2025-04 (12×, teils mit Hinweis auf andere Ausgabe)
  - 2010-12: `content/moduleinfo/daten.json › daten.MODULES_DATA.mechanik.regelwerke.0.title` – DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA (Eurocode 3 – Bemes…
  - 2025-04 (mit Hinweis): `content/moduleinfo/daten.json › daten.MODULES_DATA.mechanik.regelwerke.0.title` – …code 3 – Bemessung und Konstruktion von Stahlbauten); neue Generation DIN EN 1993-1-1:2025-04
- **EN 1995-1-1:** 2010-12 (13×, teils mit Hinweis auf andere Ausgabe), 2025 (3×, teils mit Hinweis auf andere Ausgabe), 2026-09 (6×, teils mit Hinweis auf andere Ausgabe)
  - 2010-12: `content/moduleinfo/daten.json › daten.MODULES_DATA.holzbau.regelwerke.0.title` – DIN EN 1995-1-1:2010-12 + A2:2014-07 mit NA:2013-08 (Eurocode 5…
- **EN 206-1:** 2001 (6×), 2026 (4×, teils mit Hinweis auf andere Ausgabe), 2026-07 (5×, teils mit Hinweis auf andere Ausgabe)
  - 2001: `src/data/moduleHistoryData.ts:250` – keyReference: 'DIN EN 206-1:2001 / DIN 1045-2'
  - 2001: `src/data/moduleHistoryData.ts:691` – keyReference: 'DIN EN 206-1:2001 / DIN 1045-1:2001 / DIN EN 1992-1-1:201…

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- EN 206-1:2001 (Registry 2026-07): `src/data/moduleHistoryData.ts:250` – keyReference: 'DIN EN 206-1:2001 / DIN 1045-2'
- EN 206-1:2001 (Registry 2026-07): `src/data/moduleHistoryData.ts:691` – keyReference: 'DIN EN 206-1:2001 / DIN 1045-1:2001 / DIN EN 1992-1-1:201…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

