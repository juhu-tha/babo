# Kennwert-Abgleich: `nachhaltigkeit_daten_regeln`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `nachhaltigkeit_daten_regeln` (Nachhaltigkeit, geprueft)
- **Komponente:** `src/modules/NachhaltigkeitDatenRegeln.tsx`
- **Dateien (6):** `content/nachhaltigkeitdatenregeln/DefinitionenTab.json`, `content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json`, `content/nachhaltigkeitdatenregeln/daten.json`, `src/modules/NachhaltigkeitDatenRegeln.tsx`, `src/modules/nachhaltigkeitdatenregeln/DefinitionenTab.tsx`, `src/modules/nachhaltigkeitdatenregeln/daten.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 1 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 2 (2) |
| (3) Normverweise / Hinweise | 54 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (1): `QNG_WG.plus` ×1

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/NachhaltigkeitDatenRegeln.tsx:45` | `0.65` | – | `const calculatedRcBeton = formatDeZahl(interactiveMasse * 0.65, 0);` |
| `src/modules/NachhaltigkeitDatenRegeln.tsx:48` | `0.045` | – | `const savedCo2Tons = formatDeZahl(interactiveMasse * 0.045, 1);` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1988 | – | – | 1 |  |
| DIN 4102 | – | – | 1 |  |
| DIN 4108-2 | – | – | 2 |  |
| DIN 4108-3 | – | – | 1 |  |
| DIN 4109 | – | – | 2 |  |
| DIN 18040-1 | – | – | 1 |  |
| DIN 18040 | – | – | 3 |  |
| DIN 18041 | – | – | 3 |  |
| DIN 18960 | – | – | 2 |  |
| EN 12620 | – | – | 1 |  |
| EN 13501 | – | – | 1 |  |
| EN 15643 | – | – | 5 |  |
| EN 15643 | 2021-12 | – | 2 |  |
| EN 15804 | – | – | 6 |  |
| EN 15804 | 2012 | – | 1 | Ausgaben uneinheitlich; Registry 2022-03 |
| EN 15804 | 2022-03 | – | 1 | Ausgaben uneinheitlich |
| EN 15978 | – | – | 5 |  |
| EN 15978 | 2012-10 | – | 1 | Registry 2026-09 |
| EN 15978 | 2026-09 | – | 2 |  |
| EN 16309 | – | – | 1 |  |
| EN 16516 | – | – | 1 |  |
| EN 16627 | – | – | 2 |  |
| EN 17037 | – | – | 1 |  |
| EN ISO 15392 | – | – | 1 |  |
| EN ISO 15392 | 2020-05 | – | 1 |  |
| ISO 14025 | – | – | 1 |  |
| ISO 15392 | 2019 | – | 2 |  |
| ISO 15686-5 | – | – | 2 |  |
| VDI 6023 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 15804:** 2012 (6×, teils mit Hinweis auf andere Ausgabe), 2022-03 (14×, teils mit Hinweis auf andere Ausgabe)
  - 2022-03: `content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json › daten.NachhaltigkeitDatenRegeln.regelwerke.4.title` – DIN EN 15804:2022-03 (EN 15804:2012+A2:2019+AC:2021; Umweltp…
  - 2012: `content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json › daten.NachhaltigkeitDatenRegeln.regelwerke.4.title` – DIN EN 15804:2022-03 (EN 15804:2012+A2:2019+AC:2021; Umweltproduktdeklarati…

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- EN 15804:2012 (Registry 2022-03): `content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json › daten.NachhaltigkeitDatenRegeln.regelwerke.4.title` – DIN EN 15804:2022-03 (EN 15804:2012+A2:2019+AC:2021; Umweltproduktdeklarati…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

