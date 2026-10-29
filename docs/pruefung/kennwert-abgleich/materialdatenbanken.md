# Kennwert-Abgleich: `materialdatenbanken`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `materialdatenbanken` (Digitales, geprueft)
- **Komponente:** `src/modules/Materialdatenbanken.tsx`
- **Dateien (3):** `content/materialdatenbanken/Materialdatenbanken.json`, `src/data/oekobaudatLehrwerteA2.ts`, `src/modules/Materialdatenbanken.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 8 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 17 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

### GWP- und Transportwerte ohne zentrale Zuordnung (Quelle im Modul prüfen)

| Fundstelle | Wert | Ausschnitt |
|---|---|---|
| `content/materialdatenbanken/Materialdatenbanken.json › texte.sieMultiplizierenIhreAbgerufene` | 245 kg CO₂/m³ | …ankwert, um die CO₂-Emissionen der Stützen zu ermitteln: <br>`10 m³ × 245 kg CO₂/m³ = 2450 kg CO₂`. |
| `content/materialdatenbanken/Materialdatenbanken.json › daten.Materialdatenbanken.schritte.0.erklaerung` | 0,13 kg CO₂e/kg | d = 0,175 m, ρ = 1800 kg/m³, gwp = 0,13 kg CO₂e/kg (Lehrwert): |
| `content/materialdatenbanken/Materialdatenbanken.json › daten.Materialdatenbanken.schritte.1.erklaerung` | 3,3 kg CO₂e/kg | d = 0,14 m, ρ = 20 kg/m³, gwp = 3,3 kg CO₂e/kg (Lehrwert): |
| `content/materialdatenbanken/Materialdatenbanken.json › daten.Materialdatenbanken.schritte_2.0.erklaerung` | 1,20 kg CO₂e je kg | Mineralwolle: 1,20 kg CO₂e je kg (A1–A3), Rohdichte 30 kg/m³: |
| `content/materialdatenbanken/Materialdatenbanken.json › daten.Materialdatenbanken.schritte_2.0.formel` | 1,20 kg CO₂e/kg | gwp_m = 1,20 kg CO₂e/kg |
| `src/data/quiz.json › q_dg_db_1` | 1,20 kg CO₂e/kg | Eine EPD nennt 1,20 kg CO₂e/kg für Mineralwolle (30 kg/m³). Wie groß i… |
| `src/data/quiz.json › q_dg_db_1` | 1,20 kg CO₂e/kg | …GWP von 16 cm Dämmung je m²? 5,76 kg CO₂e/m² 0,16 m · 30 kg/m³ · 1,20 kg CO₂e/kg = 5,76 kg CO₂e/m². |
| `src/data/quiz.json › q_dg_db_6` | 0,12 kg CO₂-Äq./kg | …nd ist 17,5 cm dick (ρ = 1800 kg/m³). Der Datensatz nennt GWP A1–A3 = 0,12 kg CO₂-Äq./kg (Lehrwert). Wie groß ist das GWP A1–A3… |

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| EN 15804 | – | – | 13 |  |
| EN 15804 | 2012 | – | 1 | Ausgaben uneinheitlich; Registry 2022-03 |
| EN 15804 | 2022-03 | – | 1 | Ausgaben uneinheitlich |
| EN ISO 6946 | – | – | 2 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 15804:** 2012 (6×, teils mit Hinweis auf andere Ausgabe), 2022-03 (14×, teils mit Hinweis auf andere Ausgabe)
  - 2022-03: `content/materialdatenbanken/Materialdatenbanken.json › daten.Materialdatenbanken.regelwerke.0.title` – DIN EN 15804:2022-03 (EN 15804:2012+A2:2019+AC:2021; Umweltp…
  - 2012: `content/materialdatenbanken/Materialdatenbanken.json › daten.Materialdatenbanken.regelwerke.0.title` – DIN EN 15804:2022-03 (EN 15804:2012+A2:2019+AC:2021; Umweltproduktdeklarati…

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- EN 15804:2012 (Registry 2022-03): `content/materialdatenbanken/Materialdatenbanken.json › daten.Materialdatenbanken.regelwerke.0.title` – DIN EN 15804:2022-03 (EN 15804:2012+A2:2019+AC:2021; Umweltproduktdeklarati…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

