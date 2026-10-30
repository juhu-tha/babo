# Kennwert-Abgleich: `schutz_grundlagen`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `schutz_grundlagen` (Schutz & Instandsetzung, offen)
- **Komponente:** `src/modules/SchutzGrundlagen.tsx`
- **Dateien (2):** `content/schutzgrundlagen/SchutzGrundlagen.json`, `src/modules/SchutzGrundlagen.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 39 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1076 | – | – | 1 |  |
| DIN 4095 | – | – | 1 |  |
| DIN 4102 | – | – | 1 |  |
| DIN 18540 | – | – | 1 |  |
| DIN 18560 | – | – | 1 |  |
| DIN 31051 | – | – | 1 |  |
| DIN 31051 | 2019-06 | – | 2 |  |
| DIN 68800 | 2019-06 | – | 1 |  |
| EN 1504-2 | – | – | 2 |  |
| EN 1504-5 | – | – | 2 |  |
| EN 1504-9 | – | Tab. 1 | 8 |  |
| EN 1504-9 | 2008-11 | – | 1 |  |
| EN 1504 | – | – | 3 |  |
| EN 13501 | – | – | 1 |  |
| EN 14038-1 | – | – | 1 |  |
| EN 14038-1 | 2016-10 | – | 1 |  |
| EN 14038-2 | – | – | 1 |  |
| EN 14038-2 | 2020-12 | – | 1 |  |
| EN 14038 | – | – | 1 |  |
| EN ISO 1461 | 2022-12 | – | 1 |  |
| EN ISO 12696 | – | – | 3 |  |
| EN ISO 12696 | 2022-09 | – | 2 |  |
| EN ISO 12944 | 2018-06 | – | 1 |  |
| VDI 6200 | – | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

