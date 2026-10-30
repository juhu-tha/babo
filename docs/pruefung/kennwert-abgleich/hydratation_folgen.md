# Kennwert-Abgleich: `hydratation_folgen`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `hydratation_folgen` (Betontechnologie, offen)
- **Komponente:** `src/modules/HydratationFolgen.tsx`
- **Dateien (20):** `content/eigenspannungen/Eigenspannungen.json`, `content/hydratation/Hydratation.json`, `content/hydratationfolgen/HydratationFolgen.json`, `content/hydratationpruefverfahren/HydratationPruefverfahren.json`, `content/hydratationrissberechnung/HydratationRissberechnung.json`, `content/integrationverformungen/IntegrationVerformungen.json`, `content/kriechenschwinden/KriechenSchwinden.json`, `content/massigebauteile/MassigeBauteile.json`, `content/praxisbeispiele/Praxisbeispiele.json`, `content/zwang/Zwang.json`, `src/modules/Eigenspannungen.tsx`, `src/modules/Hydratation.tsx`, `src/modules/HydratationFolgen.tsx`, `src/modules/HydratationPruefverfahren.tsx`, `src/modules/HydratationRissberechnung.tsx`, `src/modules/IntegrationVerformungen.tsx`, `src/modules/KriechenSchwinden.tsx`, `src/modules/MassigeBauteile.tsx`, `src/modules/Praxisbeispiele.tsx`, `src/modules/Zwang.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 12 (10) |
| (3) Normverweise / Hinweise | 67 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/HydratationPruefverfahren.tsx:261` | `72` | – | `const posX = 40 + (hr / 72) * 420;` |
| `src/modules/HydratationPruefverfahren.tsx:261` | `420` | – | `const posX = 40 + (hr / 72) * 420;` |
| `src/modules/HydratationPruefverfahren.tsx:273` | `25` | – | `const posY = 140 - stress * 25;` |
| `src/modules/HydratationPruefverfahren.tsx:284` | `200` | – | `const posY = 220 - ((temp - 10) / 60) * 200;` |
| `src/modules/HydratationPruefverfahren.tsx:341` | `72` | – | `const cx = 40 + (reissrahmenSimData.crackedHour / 72) * 420;` |
| `src/modules/HydratationPruefverfahren.tsx:341` | `420` | – | `const cx = 40 + (reissrahmenSimData.crackedHour / 72) * 420;` |
| `src/modules/HydratationPruefverfahren.tsx:343` | `1.5` | – | `const cy = 140 - (selectedPt?.fct ?? 1.5) * 25;` |
| `src/modules/HydratationPruefverfahren.tsx:343` | `25` | – | `const cy = 140 - (selectedPt?.fct ?? 1.5) * 25;` |
| `src/modules/HydratationRissberechnung.tsx:46` | `0.70` | – | `const fctEff = 0.70 * fctm;` |
| `src/modules/HydratationRissberechnung.tsx:61` | `0.3` | ja | `kCoeff = 0.8 - ((thickness - 0.3) / (0.8 - 0.3)) * (0.8 - 0.5);` |
| `src/modules/HydratationRissberechnung.tsx:61` | `0.8` | ja | `kCoeff = 0.8 - ((thickness - 0.3) / (0.8 - 0.3)) * (0.8 - 0.5);` |
| `src/modules/HydratationRissberechnung.tsx:98` | `2.5` | – | `const hEff = Math.min(2.5 * (concreteCover + barDiameter / 2), (thickness * 1000) / 2); // mm` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | 2023-08 | – | 1 | Ausgaben uneinheitlich |
| DIN 1045-3 | – | – | 1 |  |
| EN 196-1 | – | – | 1 |  |
| EN 196-8 | – | – | 2 |  |
| EN 196-9 | – | – | 1 |  |
| EN 196-11 | – | – | 1 |  |
| EN 197-1 | – | – | 1 |  |
| EN 206 | – | – | 1 |  |
| EN 1992-1-1/NA | – | – | 5 |  |
| EN 1992-1-1 | – | Abs. 3.1.4, Abschn. 7.3.2, Anhang B, Bild 3.1, Gl. 3.1, Gl. 3.4, Gl. 3.5, Gl. 7.1, Gl. 7.20 | 44 |  |
| EN 1992-1-1 | 2011-01 | – | 4 | Ausgaben uneinheitlich |
| EN 12617-4 | – | – | 2 |  |
| EN 12617-4 | 2002-08 | – | 1 |  |
| EN 13670 | – | – | 1 |  |
| EN 14216 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/hydratationfolgen/HydratationFolgen.json › daten.HydratationFolgen.regelwerke.5.title` – DIN 1045-2:2023-08 / DIN EN 206; DIN EN 197-1 (LH-Zement),…
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01: `content/eigenspannungen/Eigenspannungen.json › daten.Eigenspannungen.regelwerke.0.title` – DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04 (Eurocode 2…
  - 2011-01: `content/kriechenschwinden/KriechenSchwinden.json › daten.renderBeton.regelwerke.0.title` – DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04 (Eurocode 2…
  - 2011-01: `content/kriechenschwinden/KriechenSchwinden.json › daten.renderStahl.regelwerke.0.title` – DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04 (Eurocode 2…
  - 2011-01: `content/kriechenschwinden/KriechenSchwinden.json › daten.renderRheologieSimulator.regelwerke.0.title` – DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04 (Eurocode 2…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

