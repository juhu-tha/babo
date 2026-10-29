# Kennwert-Abgleich: `probenahme`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `probenahme` (Labor & Auswertung, offen)
- **Komponente:** `src/modules/Probenahme.tsx`
- **Dateien (2):** `content/probenahme/Probenahme.json`, `src/modules/Probenahme.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 51 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 19528 | 2009-01 | – | 1 |  |
| DIN 19529 | – | – | 1 |  |
| DIN 19529 | 2015-12 | – | 1 |  |
| DIN 19698-1 | – | – | 2 |  |
| DIN 19698-1 | 2014-05 | – | 1 |  |
| DIN 19698-2 | 2016-12 | – | 1 |  |
| DIN 19747 | – | – | 1 |  |
| DIN 19747 | 2009-07 | – | 1 |  |
| EN 932-1 | 1996-11 | – | 1 |  |
| EN 932-2 | – | – | 3 |  |
| EN 932-2 | 1999-03 | – | 1 |  |
| EN 12504-1 | – | – | 3 |  |
| EN 12504-1 | 2021-02 | – | 2 |  |
| EN 12504-2 | – | – | 4 |  |
| EN 12504-2 | 2021-10 | – | 3 |  |
| EN 13791 | – | – | 16 |  |
| EN 13791 | 2020-02 | – | 3 |  |
| EN 14629 | – | – | 3 |  |
| EN 14629 | 2007-06 | – | 2 |  |
| VDI 6200 | – | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

