# Kennwert-Abgleich: `beton_info`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `beton_info` (Betontechnologie, offen)
- **Komponente:** `src/modules/BetonInfo.tsx`
- **Dateien (3):** `content/betoninfo/BetonInfo.json`, `src/data/moduleHistoryData.ts`, `src/modules/BetonInfo.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 132 / 6 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-1 | – | – | 1 |  |
| DIN 1045-1 | 2001 | – | 1 |  |
| DIN 1045-2 | – | Tab. F.2.1 | 11 |  |
| DIN 1045-2 | 2023 | – | 1 | Ausgaben uneinheitlich |
| DIN 1045-2 | 2023-08 | – | 4 | Ausgaben uneinheitlich |
| DIN 1045-3 | – | – | 2 |  |
| DIN 1045-3 | 2023-08 | – | 1 |  |
| DIN 1045-100 | – | – | 5 |  |
| DIN 1045 | – | – | 6 |  |
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
| EN 197-1 | – | – | 2 |  |
| EN 197-5 | – | – | 2 |  |
| EN 206-1 | – | – | 3 |  |
| EN 206-1 | 2001 | – | 2 | Ausgaben uneinheitlich; Registry 2026-07 |
| EN 206-9 | – | – | 1 |  |
| EN 206 | – | Anhang F | 15 |  |
| EN 206 | 2021-06 | – | 1 |  |
| EN 450-1 | – | – | 1 |  |
| EN 1008 | – | – | 1 |  |
| EN 1504-1 | – | – | 1 |  |
| EN 1504 | – | – | 2 |  |
| EN 1990-2 | – | – | 1 |  |
| EN 1990-2 | 2026 | – | 1 |  |
| EN 1990 | – | – | 2 |  |
| EN 1992-1-1 | – | – | 5 |  |
| EN 1992-1-1 | 2011 | – | 2 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2023 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1992-1-1 | 2025-09 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1995-1-1 | – | – | 2 |  |
| EN 1995-1-2 | – | – | 1 |  |
| EN 10025 | – | – | 1 |  |
| EN 12350-2 | – | – | 1 |  |
| EN 12350-5 | – | – | 1 |  |
| EN 12390-3 | – | – | 1 |  |
| EN 12390-6 | – | – | 1 |  |
| EN 12504-1 | – | – | 1 |  |
| EN 12504-2 | – | – | 1 |  |
| EN 12620 | – | – | 3 |  |
| EN 13263-1 | – | – | 1 |  |
| EN 13670 | 2011-03 | – | 1 |  |
| EN 15026 | – | – | 1 |  |
| EN 15804 | – | – | 4 |  |
| EN 15978 | – | – | 1 |  |
| EN 15978 | 2026 | – | 1 |  |
| EN 16351 | – | – | 1 |  |
| EN ISO 12696 | – | – | 2 |  |
| EN ISO 19650-1 | – | – | 1 |  |
| EN ISO 19650 | – | – | 1 |  |
| EN ISO 80000-1 | – | – | 1 |  |
| ISO 2394 | – | – | 1 |  |
| ISO 12491 | – | – | 3 |  |
| ISO 16204 | – | – | 2 |  |
| ISO 16739-1 | 2024 | – | 2 |  |
| ISO 16739 | – | – | 1 |  |
| ISO 23386 | – | – | 1 |  |
| VDI 6210 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008 (2×), 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (139×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08 (mit Hinweis): `content/betoninfo/BetonInfo.json › texte.expositionsklassenGrenzwerteFürWasser` – …cherung des Betonentwurfs zur Lebensdauerprognose nach DIN EN 206 und DIN 1045-2:2023-08.
  - 2023-08: `content/betoninfo/BetonInfo.json › texte.kWertAnsätzeZusatzstoffregelungen` – k-Wert-Ansätze & Zusatzstoffregelungen (Typ II) nach DIN 1045-2:2023-08
  - 2023-08: `content/betoninfo/BetonInfo.json › texte.zurDekarbonisierungErlaubtDin` – DIN 1045-2:2023-08 erlaubt die Anrechnung von Typ-II-Zusat…
  - 2023-08: `content/betoninfo/BetonInfo.json › daten.BetonInfo.regelwerke.1.title` – DIN 1045-2:2023-08 (Tragwerke aus Beton, Stahlbeton und Sp…
  - 2023: `src/data/moduleHistoryData.ts:258` – keyReference: 'DIN EN 197-5 / DIN 1045-2:2023'
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2025-09: `content/betoninfo/BetonInfo.json › werte.vollständigeBerechnungAllerBetonkennwert` – …ge Berechnung aller Betonkennwerte nach Eurocode 2 (DIN EN 1992-1-1 / DIN EN 1992-1-1:2025-09): Druck- und Zugfestigkeiten, E-Modul,…
  - 2011: `src/data/moduleHistoryData.ts:299` – keyReference: 'DIN EN 1992-1-1:2011 (Eurocode 2)'
  - 2011: `src/data/moduleHistoryData.ts:691` – keyReference: 'DIN EN 206-1:2001 / DIN 1045-1:2001 / DIN EN 1992-1-1:2011'
  - 2023 (mit Hinweis): `src/data/moduleHistoryData.ts:697` – …e 2023-08 Betonbauqualitätsklassen ein; die neue Eurocode-Generation (EN 1992-1-1:2023) nimmt Expositionswiderstandsklassen (E…
- **EN 206-1:** 2001 (6×), 2026 (4×, teils mit Hinweis auf andere Ausgabe), 2026-07 (5×, teils mit Hinweis auf andere Ausgabe)
  - 2001: `src/data/moduleHistoryData.ts:250` – keyReference: 'DIN EN 206-1:2001 / DIN 1045-2'
  - 2001: `src/data/moduleHistoryData.ts:691` – keyReference: 'DIN EN 206-1:2001 / DIN 1045-1:2001 / DIN EN 1992-1-1:201…

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- EN 1992-1-1:2025-09 (Registry 2011-01): `content/betoninfo/BetonInfo.json › werte.vollständigeBerechnungAllerBetonkennwert` – …ge Berechnung aller Betonkennwerte nach Eurocode 2 (DIN EN 1992-1-1 / DIN EN 1992-1-1:2025-09): Druck- und Zugfestigkeiten, E-Modul,…
- EN 206-1:2001 (Registry 2026-07): `src/data/moduleHistoryData.ts:250` – keyReference: 'DIN EN 206-1:2001 / DIN 1045-2'
- EN 206-1:2001 (Registry 2026-07): `src/data/moduleHistoryData.ts:691` – keyReference: 'DIN EN 206-1:2001 / DIN 1045-1:2001 / DIN EN 1992-1-1:201…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

