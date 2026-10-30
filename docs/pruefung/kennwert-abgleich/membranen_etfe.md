# Kennwert-Abgleich: `membranen_etfe`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `membranen_etfe` (Baustoffe, geprueft)
- **Komponente:** `src/modules/MembranenETFE.tsx`
- **Dateien (2):** `content/membranenetfe/MembranenETFE.json`, `src/modules/MembranenETFE.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 1 (1) |
| (3) Normverweise / Hinweise | 23 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/MembranenETFE.tsx:154` | `0.05` | – | `: { titel: inhalt.werte.zulässigeMembrankraftLehrwert2, erklaerung: 'Kurzzeitzugfestigkeit ${formatDeZahl(festigkeit, 0)} N/5 cm auf 1 m umg` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4102 | – | – | 3 |  |
| DIN 4134-1 | – | – | 1 |  |
| DIN 4134-1 | 2026-03 | – | 3 |  |
| DIN 4134-101 | – | – | 1 |  |
| DIN 4134-101 | 2026-03 | – | 1 |  |
| DIN 4134 | 1983-02 | – | 2 |  |
| DIN CEN/TS 19102 | 2024-08 | – | 3 |  |
| EN 1990 | – | – | 1 |  |
| EN 13501-1 | – | – | 2 |  |
| EN 13501-1 | 2019-05 | – | 2 |  |
| EN 13782 | 2015-06 | – | 2 |  |
| EN 19102 | – | – | 2 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

