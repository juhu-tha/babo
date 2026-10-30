# Kennwert-Abgleich: `metallkorrosion`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `metallkorrosion` (Dauerhaftigkeit, geprueft)
- **Komponente:** `src/modules/Metallkorrosion.tsx`
- **Dateien (2):** `content/metallkorrosion/Metallkorrosion.json`, `src/modules/Metallkorrosion.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 1 (0) |
| (3) Normverweise / Hinweise | 27 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Metallkorrosion.tsx:122` | `0.4` | ja | `setAnodeErosion(prev => Math.min(45, prev + speed * 0.4)); // Darstellungsfaktor der Animation` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| EN 485 | – | – | 1 |  |
| EN 573 | – | – | 2 |  |
| EN 1172 | – | – | 2 |  |
| EN 1993-1-4 | – | – | 2 |  |
| EN 10025-5 | – | – | 1 |  |
| EN ISO 1461 | – | – | 1 |  |
| EN ISO 8044 | – | – | 4 |  |
| EN ISO 9223 | – | – | 1 |  |
| EN ISO 9223 | 2012-05 | – | 2 |  |
| EN ISO 12944-2 | – | – | 1 |  |
| EN ISO 12944-3 | – | – | 1 |  |
| EN ISO 12944 | – | – | 4 |  |
| EN ISO 14713-1 | – | – | 1 |  |
| ISO 12944-2 | – | – | 1 |  |
| ISO 12944-3 | – | – | 2 |  |
| ISO 12944 | – | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

