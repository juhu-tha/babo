# Kennwert-Abgleich: `materialoptimierung`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `materialoptimierung` (Nachhaltigkeit, offen)
- **Komponente:** `src/modules/Materialoptimierung.tsx`
- **Dateien (6):** `content/materialoptimierung/DafstbRichtlinieTab.json`, `content/materialoptimierung/Materialoptimierung.json`, `content/materialoptimierung/daten.json`, `src/modules/Materialoptimierung.tsx`, `src/modules/materialoptimierung/DafstbRichtlinieTab.tsx`, `src/modules/materialoptimierung/daten.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 2 |
| (1) Kennwerte übereinstimmend | 5 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 39 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

| Fundstelle | Wert im Text | zentral | Konstante | Ausschnitt |
|---|---|---|---|---|
| `src/data/quiz.json › qn_materialoptimierung_3` | 157 kg CO₂-Äq./m³) | 165 / 173 | `GWP_LEHRWERTE.betonCemIIIA / .betonC3037CemIII` | …ine Hohlkörperdecke enthält 19,5 m³ Beton (CEM III/A, Prüfalter 56 d: 157 kg CO₂-Äq./m³) und 2470 kg Betonstahl (Elektroofenstah… |
| `src/data/quiz.json › qn_materialoptimierung_3` | 0,42 kg CO₂-Äq./kg) | 0,64 / 0,642 | `GWP_LEHRWERTE.betonstahl` | …/m³) und 2470 kg Betonstahl (Elektroofenstahl mit Grünstrom, Lehrwert 0,42 kg CO₂-Äq./kg). Wie groß ist das GWP A1–A3 nach GWP =… |

Übereinstimmend (5): `GWP_LEHRWERTE.betonC2530CemI / .betonC3037CemI` ×1, `GWP_LEHRWERTE.betonCemIIIA / .betonC3037CemIII` ×2, `GWP_LEHRWERTE.betonstahl` ×2

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 4 |  |
| DIN 1045-2 | 2023-08 | – | 4 | Ausgaben uneinheitlich |
| DIN 1045-3 | – | – | 2 |  |
| EN 197-1 | – | – | 1 |  |
| EN 206-1 | – | – | 2 |  |
| EN 206 | – | – | 6 |  |
| EN 206 | 2021-06 | – | 3 |  |
| EN 1992-1-1 | – | – | 1 |  |
| EN 1992-1-1 | 2011-01 | – | 2 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2025-09 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 13670 | – | – | 4 |  |
| EN 15167-1 | – | – | 1 |  |
| EN 15804 | – | – | 4 |  |
| EN 15978 | – | – | 1 |  |
| VDI 4800 | – | – | 3 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08 (mit Hinweis): `content/materialoptimierung/Materialoptimierung.json › texte.maßgebendBleibenDinEn` – Maßgebend bleiben DIN EN 206:2021-06 mit DIN 1045-2:2023-08 und DIN EN 1992-1-1:2011-01 mit NA. Was…
  - 2023-08: `content/materialoptimierung/Materialoptimierung.json › werte.dinEn2062021` – DIN EN 206:2021-06 / DIN 1045-2:2023-08 (k-Wert-Ansatz)
  - 2023-08 (mit Hinweis): `content/materialoptimierung/Materialoptimierung.json › daten.Materialoptimierung.regelwerke.2.title` – DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton – Festlegung, Eigenschaften, Her…
  - 2023-08: `content/materialoptimierung/Materialoptimierung.json › daten.Materialoptimierung.formeln.1.erklaerung` – …Silikastaub (k = 1,0); für Hüttensandmehl nach DIN EN 15167-1 enthält DIN 1045-2:2023-08 einen eigenen k-Wert-Ansatz (Abschn. 5.…
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01 (mit Hinweis): `content/materialoptimierung/Materialoptimierung.json › texte.maßgebendBleibenDinEn` – Maßgebend bleiben DIN EN 206:2021-06 mit DIN 1045-2:2023-08 und DIN EN 1992-1-1:2011-01 mit NA. Was die Neuausgaben ändern – et…
  - 2011-01 (mit Hinweis): `content/materialoptimierung/Materialoptimierung.json › daten.Materialoptimierung.regelwerke.1.title` – DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA (Eurocode 2); neue…
  - 2025-09 (mit Hinweis): `content/materialoptimierung/Materialoptimierung.json › daten.Materialoptimierung.regelwerke.1.title` – …EN 1992-1-1:2011-01 + A1:2015-03 mit NA (Eurocode 2); neue Generation DIN EN 1992-1-1:2025-09

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

