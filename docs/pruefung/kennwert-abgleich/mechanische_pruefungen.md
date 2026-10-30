# Kennwert-Abgleich: `mechanische_pruefungen`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `mechanische_pruefungen` (Labor & Auswertung, geprueft)
- **Komponente:** `src/modules/MechanischePruefungen.tsx`
- **Dateien (2):** `content/mechanischepruefungen/MechanischePruefungen.json`, `src/modules/MechanischePruefungen.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 1 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 101 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (1): `CONCRETE['C40/50'].fctm` ×1

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 488-1 | – | – | 10 |  |
| DIN 488 | – | – | 4 |  |
| EN 206 | – | – | 1 |  |
| EN 301 | – | – | 2 |  |
| EN 302-1 | – | – | 3 |  |
| EN 338 | – | – | 2 |  |
| EN 338 | 2016-07 | – | 1 |  |
| EN 384 | – | – | 3 |  |
| EN 408 | – | – | 9 |  |
| EN 408 | 2012-10 | – | 2 |  |
| EN 1992-1-1 | – | Anhang C | 6 |  |
| EN 1993-1-10 | – | – | 2 |  |
| EN 10025-2 | – | – | 1 |  |
| EN 12390-1 | – | – | 1 |  |
| EN 12390-2 | – | – | 2 |  |
| EN 12390-3 | – | Anhang A | 4 |  |
| EN 12390-3 | 2019-10 | – | 3 |  |
| EN 12390-4 | – | – | 1 |  |
| EN 12390-5 | – | – | 2 |  |
| EN 12390-5 | 2019 | – | 1 |  |
| EN 12390-6 | – | – | 3 |  |
| EN 12390-6 | 2024-05 | – | 3 |  |
| EN 12390 | – | – | 2 |  |
| EN 12504-1 | – | – | 1 |  |
| EN 12697-12 | – | – | 1 |  |
| EN 12697-22 | – | – | 2 |  |
| EN 12697-23 | – | – | 2 |  |
| EN 12697-23 | 2017 | – | 1 |  |
| EN 12697-30 | – | – | 1 |  |
| EN 12697-33 | – | – | 1 |  |
| EN 12697-34 | – | – | 3 |  |
| EN 12697 | – | – | 2 |  |
| EN 13183-1 | – | – | 1 |  |
| EN 13791 | – | – | 2 |  |
| EN 14080 | – | – | 1 |  |
| EN ISO 148-1 | – | – | 3 |  |
| EN ISO 6892-1 | – | – | 3 |  |
| EN ISO 6892-1 | 2020-06 | – | 2 |  |
| EN ISO 6892 | – | – | 1 |  |
| EN ISO 7500-1 | – | – | 1 |  |
| EN ISO 15630-1 | – | – | 5 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

