# Kennwert-Abgleich: `brandschutz`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `brandschutz` (Bauphysik, offen)
- **Komponente:** `src/modules/Brandschutz.tsx`
- **Dateien (2):** `content/brandschutz/Brandschutz.json`, `src/modules/Brandschutz.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 2 (2) |
| (3) Normverweise / Hinweise | 28 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Brandschutz.tsx:33` | `345` | – | `const tempIso = 20 + 345 * Math.log10(8 * dauer + 1);` |
| `src/modules/Brandschutz.tsx:46` | `345` | – | `isoData.push({ x: t, y: 20 + 345 * Math.log10(8 * t + 1) });` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4102-1 | – | – | 3 |  |
| DIN 4102-2 | – | – | 1 |  |
| DIN 4102-4 | 2016-05 | – | 1 |  |
| DIN 4102 | – | – | 1 |  |
| EN 1363-1 | – | – | 3 |  |
| EN 1991-1-2 | – | – | 2 |  |
| EN 1995-1-2 | – | Tab. 3.1 | 4 |  |
| EN 1995-1-2 | 2010-12 | Gl. 4.1 | 3 |  |
| EN 1995-1-2 | 2026-10 | – | 1 |  |
| EN 13501-1 | – | – | 4 |  |
| EN 13501-1 | 2019-05 | – | 1 |  |
| EN 13501-2 | – | – | 3 |  |
| EN 13501-2 | 2023-12 | – | 1 |  |

### Dieselbe Tabelle unter verschiedenen Normteilen (app-weit)

- **EN 1995 Tab. 3.1:** -1-2 (5×: brandschutz, holz, holzbau_bauphysik, rechnung_bestand); -1-1 (2×: holzbau_bauphysik, rechnung_bestand)

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

