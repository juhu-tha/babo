# Kennwert-Abgleich: `schadstoffe`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `schadstoffe` (Rückbau & Schadstoffe, geprueft)
- **Komponente:** `src/modules/Schadstoffe.tsx`
- **Dateien (2):** `content/schadstoffe/Schadstoffe.json`, `src/modules/Schadstoffe.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 12 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 16 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

### GWP- und Transportwerte ohne zentrale Zuordnung (Quelle im Modul prüfen)

| Fundstelle | Wert | Ausschnitt |
|---|---|---|
| `content/schadstoffe/Schadstoffe.json › daten.TREATMENT_OPTIONS.erdaushub_sand.heavy_metals.co2` | 10-15 kg CO₂/t) | Niedrig ( 10-15 kg CO₂/t) |
| `content/schadstoffe/Schadstoffe.json › daten.TREATMENT_OPTIONS.erdaushub_sand.mkw_pak.co2` | 5-8 kg CO₂/t) | Sehr niedrig ( 5-8 kg CO₂/t) |
| `content/schadstoffe/Schadstoffe.json › daten.TREATMENT_OPTIONS.erdaushub_sand.gips_sulfat.co2` | 20-30 kg CO₂/t) | Mittel ( 20-30 kg CO₂/t) |
| `content/schadstoffe/Schadstoffe.json › daten.TREATMENT_OPTIONS.boden_ton.heavy_metals.co2` | 35-50 kg CO₂/t) | Mittel ( 35-50 kg CO₂/t) |
| `content/schadstoffe/Schadstoffe.json › daten.TREATMENT_OPTIONS.boden_ton.mkw_pak.co2` | 60-90 kg CO₂/t) | Sehr hoch ( 60-90 kg CO₂/t) |
| `content/schadstoffe/Schadstoffe.json › daten.TREATMENT_OPTIONS.boden_ton.gips_sulfat.co2` | 25-40 kg CO₂/t) | Mittel ( 25-40 kg CO₂/t) |
| `content/schadstoffe/Schadstoffe.json › daten.TREATMENT_OPTIONS.bauschutt_gemisch.heavy_metals.co2` | 15-25 kg CO₂/t) | Mittel ( 15-25 kg CO₂/t) |
| `content/schadstoffe/Schadstoffe.json › daten.TREATMENT_OPTIONS.bauschutt_gemisch.mkw_pak.co2` | 40-65 kg CO₂/t) | Hoch ( 40-65 kg CO₂/t) |
| `content/schadstoffe/Schadstoffe.json › daten.TREATMENT_OPTIONS.bauschutt_gemisch.gips_sulfat.co2` | 3-5 kg CO₂/t) | Sehr niedrig ( 3-5 kg CO₂/t) |
| `content/schadstoffe/Schadstoffe.json › daten.TREATMENT_OPTIONS.altablagerung.heavy_metals.co2` | 30-45 kg CO₂/t) | Hoch ( 30-45 kg CO₂/t) |
| `content/schadstoffe/Schadstoffe.json › daten.TREATMENT_OPTIONS.altablagerung.mkw_pak.co2` | 50-80 kg CO₂/t) | Sehr hoch ( 50-80 kg CO₂/t) |
| `content/schadstoffe/Schadstoffe.json › daten.TREATMENT_OPTIONS.altablagerung.gips_sulfat.co2` | 20-30 kg CO₂/t) | Mittel ( 20-30 kg CO₂/t) |

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4226-101 | – | – | 3 |  |
| DIN 19528 | – | – | 2 |  |
| DIN 19529 | – | – | 1 |  |
| VDI 3492 | – | – | 2 |  |
| VDI 6202 | – | – | 8 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

