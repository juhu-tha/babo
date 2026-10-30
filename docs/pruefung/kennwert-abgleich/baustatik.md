# Kennwert-Abgleich: `baustatik`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `baustatik` (Mechanik, geprueft)
- **Komponente:** `src/modules/Baustatik.tsx`
- **Dateien (2):** `content/baustatik/Baustatik.json`, `src/modules/Baustatik.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 2 (2) |
| (3) Normverweise / Hinweise | 5 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Baustatik.tsx:670` | `400` | – | `const scale = Math.min(400 / rahmenL, 250 / rahmenH);` |
| `src/modules/Baustatik.tsx:670` | `250` | – | `const scale = Math.min(400 / rahmenL, 250 / rahmenH);` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| EN 1990 | 2021-10 | – | 1 |  |
| EN 1991-1-1 | 2010-12 | – | 1 |  |
| EN 1993-1-1 | – | – | 1 |  |
| EN 1993-1-1 | 2010-12 | – | 1 | Ausgaben uneinheitlich |
| EN 1993-1-1 | 2025-04 | – | 1 | Ausgaben uneinheitlich; Registry 2010-12 |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 1993-1-1:** 2010-12 (9×, teils mit Hinweis auf andere Ausgabe), 2022 (1×, teils mit Hinweis auf andere Ausgabe), 2025-04 (12×, teils mit Hinweis auf andere Ausgabe)
  - 2010-12 (mit Hinweis): `content/baustatik/Baustatik.json › daten.Baustatik.regelwerke.2.title` – DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA (Eurocode 3, bauauf…
  - 2025-04 (mit Hinweis): `content/baustatik/Baustatik.json › daten.Baustatik.regelwerke.2.title` – …4-07 mit NA (Eurocode 3, bauaufsichtlich eingeführt); neue Generation DIN EN 1993-1-1:2025-04

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

