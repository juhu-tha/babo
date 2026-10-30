# Kennwert-Abgleich: `mauerwerk`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `mauerwerk` (Baustoffe, offen)
- **Komponente:** `src/modules/Mauerwerk.tsx`
- **Dateien (3):** `content/mauerwerk/Mauerwerk.json`, `src/modules/Mauerwerk.tsx`, `src/modules/mauerwerk/MauerwerkVerband3D.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 4 (2) |
| (3) Normverweise / Hinweise | 33 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Mauerwerk.tsx:188` | `0.4` | ja | `const fvk_calc = fvk0 + 0.4 * sigmaD;` |
| `src/modules/Mauerwerk.tsx:189` | `0.065` | ja | `const fvk_max = 0.065 * fb; // Lehrmodell: Obergrenze 0,065·f_b = Empfehlungswert EN 1996-1-1; nach DIN EN 1996-1-1/NA stattdessen Steinzugv` |
| `src/modules/Mauerwerk.tsx:191` | `1.5` | – | `const fvd = fvk / 1.5; // γ_M = 1,5` |
| `src/modules/Mauerwerk.tsx:204` | `0.4` | – | `const current_fvk_calc = fvk0 + 0.4 * s;` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 18940 | – | – | 2 |  |
| DIN 18945 | – | – | 2 |  |
| DIN 20000-401 | 2017-01 | – | 1 |  |
| DIN 20000-412 | 2019-06 | – | 1 |  |
| EN 771-1 | – | – | 1 |  |
| EN 771-1 | 2015-11 | – | 1 |  |
| EN 771-2 | 2015-11 | – | 1 |  |
| EN 771-3 | 2015-11 | – | 1 |  |
| EN 771-4 | 2015-11 | – | 1 |  |
| EN 998-2 | – | – | 1 |  |
| EN 998-2 | 2017-02 | – | 1 |  |
| EN 1996-1-1/NA | – | – | 5 |  |
| EN 1996-1-1/NA | 2019-12 | – | 1 |  |
| EN 1996-1-1 | – | Gl. 3.1, Tab. 3.3 | 9 |  |
| EN 1996-1-1 | 2013-02 | – | 1 |  |
| EN 1996-3/NA | – | – | 2 |  |
| EN 1996-3/NA | 2019-12 | – | 1 |  |
| EN 1996-3 | 2010-12 | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

