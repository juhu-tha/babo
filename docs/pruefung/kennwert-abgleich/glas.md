# Kennwert-Abgleich: `glas`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `glas` (Baustoffe, geprueft)
- **Komponente:** `src/modules/Glas.tsx`
- **Dateien (2):** `content/glas/Glas.json`, `src/modules/Glas.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 18 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 18008-1 | 2020-05 | – | 3 |  |
| DIN 18008-2 | – | – | 1 |  |
| DIN 18008-2 | 2020-05 | – | 1 |  |
| DIN 18008-3 | 2024-12 | – | 1 |  |
| DIN 18008-4 | 2024-12 | – | 1 |  |
| DIN 18008 | – | – | 3 |  |
| EN 572-1 | 2016-06 | – | 1 |  |
| EN 12150-1 | 2020-07 | – | 1 |  |
| EN 16612 | – | – | 1 |  |
| EN 16612 | 2019-12 | – | 4 |  |
| EN ISO 12543-1 | 2022-04 | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

