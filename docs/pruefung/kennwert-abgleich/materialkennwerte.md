# Kennwert-Abgleich: `materialkennwerte`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `materialkennwerte` (Grundlagen, geprueft)
- **Komponente:** `src/modules/Materialkennwerte.tsx`
- **Dateien (3):** `content/materialkennwerte/Materialkennwerte.json`, `src/data/materials.json`, `src/modules/Materialkennwerte.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 1 (1) |
| (3) Normverweise / Hinweise | 26 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Materialkennwerte.tsx:100` | `105` | – | `data: properties.map(p => ((m[p.id as keyof typeof m] as number) / maxValues[p.id]) * 105), // slightly padded` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4108-4 | – | Tab. 1 | 1 |  |
| EN 338 | – | – | 4 |  |
| EN 1990 | – | – | 2 |  |
| EN 1991-1-5 | – | – | 2 |  |
| EN 1991 | – | – | 1 |  |
| EN 1992-1-1 | – | Tab. 3.1 | 5 |  |
| EN 1992 | – | – | 1 |  |
| EN 1993-1-1 | – | – | 1 |  |
| EN 1993-1-4 | – | – | 1 |  |
| EN 1993 | – | – | 1 |  |
| EN 1995 | – | – | 1 |  |
| EN 1999-1-1 | – | – | 1 |  |
| EN 14080 | – | – | 3 |  |
| EN ISO 10456 | – | – | 2 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

