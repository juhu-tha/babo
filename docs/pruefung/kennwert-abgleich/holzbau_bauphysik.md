# Kennwert-Abgleich: `holzbau_bauphysik`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `holzbau_bauphysik` (Holzbau, geprueft), `holzbau_bemessung` (Holzbau, geprueft), `holzbau_info` (Holzbau, offen), `holzbau_konstruktion` (Holzbau, geprueft), `holzbau_verbindung` (Holzbau, offen), `holzbau_werkstoffe` (Holzbau, geprueft)
- **Komponente:** `src/modules/HolzbauBeta.tsx`
- **Dateien (17):** `content/holzbaubeta/HolzbauBauphysik.json`, `content/holzbaubeta/HolzbauBemessung.json`, `content/holzbaubeta/HolzbauBeta.json`, `content/holzbaubeta/HolzbauInfo.json`, `content/holzbaubeta/HolzbauKonstruktion.json`, `content/holzbaubeta/HolzbauVerbindung.json`, `content/holzbaubeta/HolzbauWerkstoffe.json`, `content/holzbaubeta/daten.json`, `src/data/moduleHistoryData.ts`, `src/modules/HolzbauBeta.tsx`, `src/modules/holzbaubeta/HolzbauBauphysik.tsx`, `src/modules/holzbaubeta/HolzbauBemessung.tsx`, `src/modules/holzbaubeta/HolzbauInfo.tsx`, `src/modules/holzbaubeta/HolzbauKonstruktion.tsx`, `src/modules/holzbaubeta/HolzbauVerbindung.tsx`, `src/modules/holzbaubeta/HolzbauWerkstoffe.tsx`, `src/modules/holzbaubeta/daten.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 8 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 120 / 7 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (8): `BSH_EN14080.GL24h.rhok` ×2, `BSH_EN14080.GL30h.rhok` ×1, `HOLZ_EN338.C24.rhok` ×2, `HOLZ_EN338.C30.rhok` ×1, `HOLZ_EN338.D30.rhok` ×1, `HOLZ_EN338.D40.rhok` ×1

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-1 | – | – | 1 |  |
| DIN 1045-1 | 2001 | – | 1 |  |
| DIN 1045-2 | – | – | 2 |  |
| DIN 1045-2 | 2023 | – | 1 | Ausgaben uneinheitlich |
| DIN 1045 | – | – | 5 |  |
| DIN 1052 | – | – | 1 |  |
| DIN 1076 | – | – | 2 |  |
| DIN 1946-6 | – | – | 2 |  |
| DIN 4108-3 | – | – | 1 |  |
| DIN 4108 | – | – | 2 |  |
| DIN 4108 | 1952 | – | 1 |  |
| DIN 4227 | – | – | 1 |  |
| DIN 18007 | – | – | 2 |  |
| DIN 18008 | – | – | 1 |  |
| DIN 18945-189 | – | – | 1 |  |
| DIN 18945 | – | – | 1 |  |
| DIN SPEC 91484 | – | – | 2 |  |
| DIN SPEC 91525 | – | – | 1 |  |
| EN 197-5 | – | – | 2 |  |
| EN 206-1 | – | – | 3 |  |
| EN 206-1 | 2001 | – | 2 | Ausgaben uneinheitlich; Registry 2026-07 |
| EN 206-9 | – | – | 1 |  |
| EN 206 | – | – | 1 |  |
| EN 338 | – | – | 2 |  |
| EN 338 | 2016 | – | 4 |  |
| EN 338 | 2016-07 | – | 1 |  |
| EN 1504-1 | – | – | 1 |  |
| EN 1504 | – | – | 2 |  |
| EN 1990-2 | – | – | 1 |  |
| EN 1990-2 | 2026 | – | 1 |  |
| EN 1990 | – | – | 1 |  |
| EN 1992-1-1 | – | – | 2 |  |
| EN 1992-1-1 | 2011 | – | 2 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2023 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1995-1-1/NA | 2013-08 | – | 1 |  |
| EN 1995-1-1 | – | Abs. 6.1.5, Abs. 7.3, Gl. 7.5, Gl. 8.39, Tab. 3.1 | 24 |  |
| EN 1995-1-1 | 2010-12 | – | 1 | Ausgaben uneinheitlich |
| EN 1995-1-2 | – | – | 3 |  |
| EN 1995-1-2 | 2010-12 | Tab. 3.1 | 3 |  |
| EN 1995-1-2 | 2026-10 | – | 1 |  |
| EN 10025 | – | – | 1 |  |
| EN 12504-2 | – | – | 1 |  |
| EN 12620 | – | – | 2 |  |
| EN 14080 | – | – | 2 |  |
| EN 14080 | 2013 | – | 1 |  |
| EN 14080 | 2013-09 | – | 1 |  |
| EN 15026 | – | – | 1 |  |
| EN 15804 | – | – | 4 |  |
| EN 15978 | – | – | 1 |  |
| EN 15978 | 2026 | – | 1 |  |
| EN 16351 | – | – | 1 |  |
| EN 16351 | 2025-07 | – | 1 |  |
| EN ISO 12696 | – | – | 2 |  |
| EN ISO 19650-1 | – | – | 1 |  |
| EN ISO 19650 | – | – | 1 |  |
| EN ISO 80000-1 | – | – | 1 |  |
| ISO 2394 | – | – | 1 |  |
| ISO 12491 | – | – | 2 |  |
| ISO 16204 | – | – | 2 |  |
| ISO 16739-1 | 2024 | – | 2 |  |
| ISO 16739 | – | – | 1 |  |
| ISO 23386 | – | – | 1 |  |
| VDI 6210 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023: `src/data/moduleHistoryData.ts:258` – keyReference: 'DIN EN 197-5 / DIN 1045-2:2023'
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011: `src/data/moduleHistoryData.ts:299` – keyReference: 'DIN EN 1992-1-1:2011 (Eurocode 2)'
  - 2011: `src/data/moduleHistoryData.ts:691` – keyReference: 'DIN EN 206-1:2001 / DIN 1045-1:2001 / DIN EN 1992-1-1:2011'
  - 2023 (mit Hinweis): `src/data/moduleHistoryData.ts:697` – …e 2023-08 Betonbauqualitätsklassen ein; die neue Eurocode-Generation (EN 1992-1-1:2023) nimmt Expositionswiderstandsklassen (E…
- **EN 1995-1-1:** 2010-12 (13×, teils mit Hinweis auf andere Ausgabe), 2025 (3×, teils mit Hinweis auf andere Ausgabe), 2026-09 (6×, teils mit Hinweis auf andere Ausgabe)
  - 2010-12: `content/holzbaubeta/HolzbauBeta.json › daten.HolzbauBeta.regelwerke.0.title` – DIN EN 1995-1-1:2010-12 + A2:2014-07 mit DIN EN 1995-1-1/NA:201…
- **EN 206-1:** 2001 (6×), 2026 (4×, teils mit Hinweis auf andere Ausgabe), 2026-07 (5×, teils mit Hinweis auf andere Ausgabe)
  - 2001: `src/data/moduleHistoryData.ts:250` – keyReference: 'DIN EN 206-1:2001 / DIN 1045-2'
  - 2001: `src/data/moduleHistoryData.ts:691` – keyReference: 'DIN EN 206-1:2001 / DIN 1045-1:2001 / DIN EN 1992-1-1:201…

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- EN 206-1:2001 (Registry 2026-07): `src/data/moduleHistoryData.ts:250` – keyReference: 'DIN EN 206-1:2001 / DIN 1045-2'
- EN 206-1:2001 (Registry 2026-07): `src/data/moduleHistoryData.ts:691` – keyReference: 'DIN EN 206-1:2001 / DIN 1045-1:2001 / DIN EN 1992-1-1:201…

### Dieselbe Tabelle unter verschiedenen Normteilen (app-weit)

- **EN 1995 Tab. 3.1:** -1-2 (5×: brandschutz, holz, holzbau_bauphysik, rechnung_bestand); -1-1 (2×: holzbau_bauphysik, rechnung_bestand)

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

