# Kennwert-Abgleich: `historisch`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `historisch` (Bauen im Bestand, geprueft)
- **Komponente:** `src/modules/HistorischeMaterialkennwerte.tsx`
- **Dateien (9):** `content/historischematerialkennwerte/DatenbankTab.json`, `content/historischematerialkennwerte/HistorischeMaterialkennwerte.json`, `content/historischematerialkennwerte/NachweisBestandTab.json`, `content/historischematerialkennwerte/RechnerLaborTab.json`, `src/data/historicalMaterialsData.ts`, `src/modules/HistorischeMaterialkennwerte.tsx`, `src/modules/historischematerialkennwerte/DatenbankTab.tsx`, `src/modules/historischematerialkennwerte/NachweisBestandTab.tsx`, `src/modules/historischematerialkennwerte/RechnerLaborTab.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 1 |
| (1) Kennwerte übereinstimmend | 1 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 5 (1) |
| (3) Normverweise / Hinweise | 119 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

| Fundstelle | Wert im Text | zentral | Konstante | Ausschnitt |
|---|---|---|---|---|
| `src/data/historicalMaterialsData.ts:121` | 520–620 MPa | 490 | `BAUSTAHL_EC3.S355.fu` | …ion: 'Feinkornbaustahl mit hoher Streckgrenze (355 MPa, Zugfestigkeit 520–620 MPa). Weit verbreitet im Skelett- und Indus… |

Übereinstimmend (1): `CONCRETE['C20/25'].fck` ×1

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/HistorischeMaterialkennwerte.tsx:117` | `1.645` | ja | `const f_k = Math.max(0.1, f_m * (1 - 1.645 * V));` |
| `src/modules/HistorischeMaterialkennwerte.tsx:173` | `0.18` | ja | `kRatioToCylinder = 0.82 + 0.18 * (ratioHd - 1.0);` |
| `src/modules/HistorischeMaterialkennwerte.tsx:205` | `0.80` | – | `const fIsCube = fIsCyl / 0.80;` |
| `src/modules/HistorischeMaterialkennwerte.tsx:258` | `0.3` | ja | `dFactor = 0.65 + 0.50 * ((ratioHw - 0.3) / 1.2);` |
| `src/modules/HistorischeMaterialkennwerte.tsx:258` | `1.2` | ja | `dFactor = 0.65 + 0.50 * ((ratioHw - 0.3) / 1.2);` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 105 | – | – | 7 |  |
| DIN 105 | 1936 | – | 1 |  |
| DIN 488 | – | – | 2 |  |
| DIN 1045 | – | – | 7 |  |
| DIN 1045 | 1937 | – | 2 | Ausgaben uneinheitlich |
| DIN 1045 | 1972 | – | 4 | Ausgaben uneinheitlich |
| DIN 1045 | 1978 | – | 1 | Ausgaben uneinheitlich |
| DIN 1045 | 1988 | – | 1 | Ausgaben uneinheitlich |
| DIN 1050 | – | – | 2 |  |
| DIN 1050 | 1934 | – | 2 |  |
| DIN 1052 | – | – | 1 |  |
| DIN 1053-1 | – | – | 1 |  |
| DIN 1611 | – | – | 1 |  |
| DIN 4074 | – | – | 5 |  |
| DIN 4172 | – | – | 1 |  |
| DIN 4227 | – | – | 2 |  |
| DIN 17100 | – | – | 9 |  |
| EN 338 | – | – | 2 |  |
| EN 772-1 | – | Tab. A.1 | 6 |  |
| EN 1990-2 | 2026 | – | 16 |  |
| EN 1990 | – | Anhang C, Anhang D | 7 |  |
| EN 1992-1-1 | – | Anhang A.2.2 | 4 |  |
| EN 1992-1-1 | 2011-01 | – | 1 | Ausgaben uneinheitlich |
| EN 1993-1-1 | – | – | 1 |  |
| EN 1995-1-1 | – | – | 1 |  |
| EN 1996-1-1/NA | – | – | 4 |  |
| EN 1996-1-1 | – | – | 4 |  |
| EN 10025-2 | – | – | 2 |  |
| EN 12504-1 | 2021-02 | – | 1 |  |
| EN 13791 | – | – | 13 |  |
| EN 13791 | 2020-02 | – | 2 |  |
| EN ISO 6892-1 | – | – | 5 |  |
| ISO 6892-1 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045:** 1937 (2×), 1959 (1×, teils mit Hinweis auf andere Ausgabe), 1972 (4×), 1978 (2×), 1988 (1×), 2023 (1×, teils mit Hinweis auf andere Ausgabe), 2023-08 (1×)
  - 1988: `content/historischematerialkennwerte/DatenbankTab.json › texte.bisCa2004Galt` – Bis ca. 2004 galt das **globale Sicherheitskonzept** (z.B. DIN 1045:1988). Die Beanspruchungen wurden unskaliert…
  - 1972: `content/historischematerialkennwerte/RechnerLaborTab.json › texte.dieAktuellenEurocode2` – …festigkeit \$f_{ck}\$ (Durchmesser 150 mm/Länge 300 mm). Da \$β_{WN}\$ ab DIN 1045:1972 bereits ein 5-%-Quantil ist, sind nur P…
  - 1972: `src/data/historicalMaterialsData.ts:45` – * Zeilen Bn/B (DIN 1045:1972/1988) und Bk (DDR 1981–1990) aus dem zw…
  - 1972: `src/data/historicalMaterialsData.ts:56` – 'Bn 550 / B 55': 'Höchste Klasse der DIN 1045:1972/1988, vor allem für hoch beanspruchte F…
  - 1972: `src/data/historicalMaterialsData.ts:78` – …nbeton) sind dort nicht enthalten. Für die Klassen 1972–2001 (Bn nach DIN 1045:1972, B nach DIN 1045:1978/1988) und die DDR…
  - 1978: `src/data/historicalMaterialsData.ts:78` – …t enthalten. Für die Klassen 1972–2001 (Bn nach DIN 1045:1972, B nach DIN 1045:1978/1988) und die DDR-Klassen Bk (1981–1990…
  - 1937: `src/data/historicalMaterialsData.ts:96` – { old: 'BSt 22/34 (Gruppe I, DIN 1045:1937)', new: '-', f_old: 220, f_new: 220, ex…
  - 1937: `src/data/historicalMaterialsData.ts:97` – { old: 'BSt 34/50 (Gruppe IIa, DIN 1045:1937)', new: '-', f_old: 340, f_new: 340, ex…
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01 (mit Hinweis): `content/historischematerialkennwerte/HistorischeMaterialkennwerte.json › daten.HistorischeMaterialkennwerte.regelwerke.3.title` – DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA (Eurocode 2); neue…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

