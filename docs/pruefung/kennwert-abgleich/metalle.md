# Kennwert-Abgleich: `metalle`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `metalle` (Baustoffe, geprueft)
- **Komponente:** `src/modules/Metalle.tsx`
- **Dateien (2):** `content/metalle/Metalle.json`, `src/modules/Metalle.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 21 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| EN 124 | – | – | 1 |  |
| EN 545 | – | – | 1 |  |
| EN 988 | – | – | 2 |  |
| EN 988 | 1996-08 | – | 1 |  |
| EN 1993-1-1 | – | – | 1 |  |
| EN 1993-1-4/NA | 2020-11 | – | 1 |  |
| EN 1993-1-4 | 2015-10 | – | 1 |  |
| EN 1993-1-4 | 2026-04 | – | 1 |  |
| EN 1999-1-1/NA | 2021-03 | – | 1 |  |
| EN 1999-1-1 | 2014-03 | – | 1 |  |
| EN 1999-1-1 | 2024-11 | – | 1 |  |
| EN 1999 | – | – | 1 |  |
| EN 10025-5 | – | – | 1 |  |
| EN 10025-5 | 2019-10 | – | 1 |  |
| EN 12164 | – | – | 1 |  |
| EN ISO 8044 | – | – | 1 |  |
| EN ISO 8044 | 2020-08 | – | 1 |  |
| EN ISO 12944-1 | 2019-01 | – | 1 |  |
| EN ISO 12944 | – | – | 2 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

