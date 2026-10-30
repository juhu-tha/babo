# Kennwert-Abgleich: `bim_baustoffe`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bim_baustoffe` (Digitales, geprueft)
- **Komponente:** `src/modules/BimBaustoffe.tsx`
- **Dateien (2):** `content/bimbaustoffe/BimBaustoffe.json`, `src/modules/BimBaustoffe.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 1 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 6 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 13 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (1): `GWP_LEHRWERTE.profilstahl` ×1

### GWP- und Transportwerte ohne zentrale Zuordnung (Quelle im Modul prüfen)

| Fundstelle | Wert | Ausschnitt |
|---|---|---|
| `content/bimbaustoffe/BimBaustoffe.json › texte.dieseKennwerteSteuernBerechnungs` | 1,20 kg CO₂-Äq./kg | …₂). Die Voreinstellungen sind gerundete Lehrwerte, z. B. Mineralwolle 1,20 kg CO₂-Äq./kg · 60 kg/m³ ≈ 72 kg CO₂-Äq./m³ (wie im M… |
| `content/bimbaustoffe/BimBaustoffe.json › texte.dieseKennwerteSteuernBerechnungs` | 72 kg CO₂-Äq./m³ | …rundete Lehrwerte, z. B. Mineralwolle 1,20 kg CO₂-Äq./kg · 60 kg/m³ ≈ 72 kg CO₂-Äq./m³ (wie im Modul Materialdatenbanken). |
| `content/bimbaustoffe/BimBaustoffe.json › daten.BimBaustoffe.schritte.1.formel` | 280 kg CO₂e/m³ | gwp_V = 280 kg CO₂e/m³ |
| `src/data/quiz.json › qn_bim_baustoffe_3` | 280 kg CO₂e/m³ | …,75 m × 0,20 m. Die verknüpfte EPD nennt für die Module A1–A3 gwp_V = 280 kg CO₂e/m³. Welches Treibhauspotenzial der Herstel… |
| `src/data/quiz.json › qn_bim_baustoffe_3` | 280 kg CO₂e/m³ | …ch? 1232 kg CO₂e V = 8,0 · 2,75 · 0,20 = 4,40 m³; GWP = 4,40 m³ · 280 kg CO₂e/m³ = 1232 kg CO₂e. |
| `src/data/quiz.json › qn_bim_baustoffe_4` | 280 kg CO₂e/m³) | …äche. Das LCA-Tool liest versehentlich das Bruttovolumen aus (gwp_V = 280 kg CO₂e/m³). Wie groß ist der Fehler? GWP um 134… |

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| EN 15804 | – | – | 2 |  |
| EN 15804 | 2012 | – | 1 | Ausgaben uneinheitlich; Registry 2022-03 |
| EN 15804 | 2022-03 | – | 1 | Ausgaben uneinheitlich |
| EN ISO 6946 | – | – | 1 |  |
| EN ISO 6946 | 2018-03 | – | 1 |  |
| EN ISO 19650-1 | – | – | 1 |  |
| ISO 10303-21 | – | – | 1 |  |
| ISO 16739-1 | 2024 | – | 4 |  |
| ISO 19650 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 15804:** 2012 (6×, teils mit Hinweis auf andere Ausgabe), 2022-03 (14×, teils mit Hinweis auf andere Ausgabe)
  - 2022-03: `content/bimbaustoffe/BimBaustoffe.json › daten.BimBaustoffe.regelwerke.2.title` – DIN EN 15804:2022-03 (EN 15804:2012+A2:2019+AC:2021; Umweltp…
  - 2012: `content/bimbaustoffe/BimBaustoffe.json › daten.BimBaustoffe.regelwerke.2.title` – DIN EN 15804:2022-03 (EN 15804:2012+A2:2019+AC:2021; Umweltproduktdeklarati…

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- EN 15804:2012 (Registry 2022-03): `content/bimbaustoffe/BimBaustoffe.json › daten.BimBaustoffe.regelwerke.2.title` – DIN EN 15804:2022-03 (EN 15804:2012+A2:2019+AC:2021; Umweltproduktdeklarati…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

