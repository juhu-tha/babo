# Kennwert-Abgleich: `rechnung_bestand`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `rechnung_bestand` (Beispielrechnungen, offen), `rechnung_beton` (Beispielrechnungen, geprueft), `rechnung_brandschutz` (Beispielrechnungen, offen), `rechnung_holzbau` (Beispielrechnungen, geprueft), `rechnung_mauerwerk` (Beispielrechnungen, offen), `rechnung_nachhaltigkeit` (Beispielrechnungen, geprueft), `rechnung_schallschutz` (Beispielrechnungen, offen), `rechnung_stahlbeton` (Beispielrechnungen, geprueft), `rechnung_u_wert` (Beispielrechnungen, geprueft)
- **Komponente:** `src/modules/Beispielrechnungen.tsx`
- **Dateien (23):** `content/beispielrechnungen/Beispielrechnungen.json`, `content/beispielrechnungen/RechnungBestand.json`, `content/beispielrechnungen/RechnungBeton.json`, `content/beispielrechnungen/RechnungBrandschutz.json`, `content/beispielrechnungen/RechnungHolzbau.json`, `content/beispielrechnungen/RechnungMauerwerk.json`, `content/beispielrechnungen/RechnungNachhaltigkeit.json`, `content/beispielrechnungen/RechnungSchallschutz.json`, `content/beispielrechnungen/RechnungStahlbeton.json`, `content/beispielrechnungen/RechnungUWert.json`, `content/beispielrechnungen/daten.json`, `src/data/brandschutzBeton.ts`, `src/modules/Beispielrechnungen.tsx`, `src/modules/beispielrechnungen/RechnungBestand.tsx`, `src/modules/beispielrechnungen/RechnungBeton.tsx`, `src/modules/beispielrechnungen/RechnungBrandschutz.tsx`, `src/modules/beispielrechnungen/RechnungHolzbau.tsx`, `src/modules/beispielrechnungen/RechnungMauerwerk.tsx`, `src/modules/beispielrechnungen/RechnungNachhaltigkeit.tsx`, `src/modules/beispielrechnungen/RechnungSchallschutz.tsx`, `src/modules/beispielrechnungen/RechnungStahlbeton.tsx`, `src/modules/beispielrechnungen/RechnungUWert.tsx`, `src/modules/beispielrechnungen/daten.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 15 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 5 (1) |
| (3) Normverweise / Hinweise | 111 / 4 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (15): `BSH_EN14080.GL28h.fmk` ×1, `CONCRETE['C20/25'].fck` ×2, `CONCRETE['C25/30'].fck` ×2, `CONCRETE['C30/37'].fck` ×2, `CONCRETE['C35/45'].fck` ×1, `CONCRETE['C40/50'].fck` ×1, `CONCRETE['C50/60'].fck` ×1, `HOLZ_EN338.C24.fmk` ×1, `HOLZ_EN338.D30.fmk` ×1, `ZEMENT_GWP_KG['CEM I']` ×2, `ZEMENT_GWP_KG['CEM III/B']` ×1

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Beispielrechnungen.tsx:234` | `0.2` | ja | `const k_factor_wood = 0.5 * (1 + 0.2 * (lambda_rel - 0.3) + Math.pow(lambda_rel, 2));` |
| `src/modules/Beispielrechnungen.tsx:263` | `44.01` | ja | `const co2UptakePerM2 = reactedCaoMassPerM2 * (44.01 / 56.08); // kg CO2/m², Molmassen M(CO₂)/M(CaO) wie im Rechenweg (T15-NH-2)` |
| `src/modules/Beispielrechnungen.tsx:263` | `56.08` | ja | `const co2UptakePerM2 = reactedCaoMassPerM2 * (44.01 / 56.08); // kg CO2/m², Molmassen M(CO₂)/M(CaO) wie im Rechenweg (T15-NH-2)` |
| `src/modules/Beispielrechnungen.tsx:303` | `1.15` | – | `const f_yd_stahl = f_yk_stahl / 1.15;` |
| `src/modules/Beispielrechnungen.tsx:349` | `0.60` | ja | `const M_fi_Ed = 0.60 * momentKaltEd; // Reduktionsbeiwert eta_fi approx 0.60 nach EC5` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | Tab. F.2.1 | 10 |  |
| DIN 1045-3 | – | – | 2 |  |
| DIN 1045 | – | – | 4 |  |
| DIN 4102-2 | – | – | 1 |  |
| DIN 4108-2 | – | – | 1 |  |
| DIN 4108-2 | 2013-02 | Tab. 3 | 1 | Ausgaben uneinheitlich; Registry 2026-05 |
| DIN 4109 Beiblatt 1 | – | – | 1 |  |
| DIN 4109 Beiblatt 1 | 1989 | – | 1 |  |
| DIN 4109-1 | – | Tab. 2 | 3 |  |
| DIN 4109-1 | 2018 | – | 1 |  |
| DIN 4109-1 | 2018-01 | – | 1 |  |
| DIN 4109-32 | – | – | 7 |  |
| DIN 4109-32 | 2016-07 | Gl. 2 | 4 |  |
| DIN 4109 | – | – | 3 |  |
| DIN 4109 | 2018 | – | 1 | Ausgaben uneinheitlich |
| DIN 4227 | – | – | 3 |  |
| EN 206-1 | – | – | 1 |  |
| EN 206 | – | – | 5 |  |
| EN 338 | 2016 | – | 1 |  |
| EN 1363-1 | – | – | 1 |  |
| EN 1992-1-1/NA | – | – | 2 |  |
| EN 1992-1-1 | – | Anhang B | 13 |  |
| EN 1992-1-2 | – | Tab. 5.5 | 6 |  |
| EN 1992-1-2 | 2004 | – | 1 |  |
| EN 1992 | – | – | 1 |  |
| EN 1995-1-1 | – | Tab. 3.1 | 4 |  |
| EN 1995-1-2 | – | Tab. 2.1, Tab. 3.1 | 5 |  |
| EN 1996-1-1 | – | – | 2 |  |
| EN 1996-3/NA | – | – | 4 |  |
| EN 1996-3/NA | 2019-12 | Tab. NA.2 | 3 |  |
| EN 1996-3 | – | – | 1 |  |
| EN 13670 | – | – | 1 |  |
| EN 13791 | – | – | 6 |  |
| EN 15804 | – | – | 1 |  |
| EN 16757 | – | – | 1 |  |
| EN ISO 6946 | – | – | 7 |  |
| EN ISO 10456 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 4108-2:** 2013-02 (25×, teils mit Hinweis auf andere Ausgabe), 2026-05 (10×, teils mit Hinweis auf andere Ausgabe)
  - 2013-02: `content/beispielrechnungen/RechnungUWert.json › werte.dieDämmwirkungIstUnzureichend` – …ch Anlage 7 GModG einzuhalten. Der Mindestwärmeschutz für Außenwände (DIN 4108-2:2013-02, Tab. 3: R ≥ 1,2 m²K/W) ist dagegen sch…
- **DIN 4109:** 1989 (3×), 1989-11 (1×, teils mit Hinweis auf andere Ausgabe), 2018 (2×)
  - 2018: `content/beispielrechnungen/RechnungSchallschutz.json › texte.bauakustikLuftschalldämmungMassiverBaute` – Bauakustik: Luftschalldämmung massiver Bauteile nach DIN 4109:2018

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- DIN 4108-2:2013-02 (Registry 2026-05): `content/beispielrechnungen/RechnungUWert.json › werte.dieDämmwirkungIstUnzureichend` – …ch Anlage 7 GModG einzuhalten. Der Mindestwärmeschutz für Außenwände (DIN 4108-2:2013-02, Tab. 3: R ≥ 1,2 m²K/W) ist dagegen sch…

### Dieselbe Tabelle unter verschiedenen Normteilen (app-weit)

- **EN 1995 Tab. 3.1:** -1-2 (5×: brandschutz, holz, holzbau_bauphysik, rechnung_bestand); -1-1 (2×: holzbau_bauphysik, rechnung_bestand)

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

