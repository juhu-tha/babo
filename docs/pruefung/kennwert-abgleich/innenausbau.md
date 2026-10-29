# Kennwert-Abgleich: `innenausbau`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `innenausbau` (Innenausbau, offen)
- **Komponente:** `src/modules/Innenausbau.tsx`
- **Dateien (2):** `content/innenausbau/Innenausbau.json`, `src/modules/Innenausbau.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 60 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4102-4 | – | – | 1 |  |
| DIN 4103-1 | 2015-06 | – | 1 |  |
| DIN 4108-3 | – | – | 1 |  |
| DIN 4108 | – | – | 1 |  |
| DIN 4109-2 | – | – | 1 |  |
| DIN 4109-2 | 2018-01 | – | 1 |  |
| DIN 4109 | – | – | 1 |  |
| DIN 18157 | – | – | 1 |  |
| DIN 18180 | – | – | 1 |  |
| DIN 18181 | – | – | 3 |  |
| DIN 18181 | 2019-04 | – | 1 |  |
| DIN 18365 | – | Abschn. 4 | 2 |  |
| DIN 18534-1 | – | – | 3 |  |
| DIN 18534-1 | 2025-10 | Tab. 1 | 2 |  |
| DIN 18534-2 | – | – | 1 |  |
| DIN 18534 | – | – | 8 |  |
| DIN 18560-1 | – | – | 3 |  |
| DIN 18560-1 | 2021-02 | – | 1 |  |
| DIN 18560-2 | – | – | 1 |  |
| DIN 18560 | – | – | 4 |  |
| EN 520 | – | – | 5 |  |
| EN 520 | 2009-12 | – | 1 |  |
| EN 1264-4 | – | – | 1 |  |
| EN 1542 | – | – | 2 |  |
| EN 12004 | – | – | 2 |  |
| EN 12354-1 | – | – | 2 |  |
| EN 13162 | – | – | 1 |  |
| EN 13279-1 | – | – | 1 |  |
| EN 13501 | – | – | 2 |  |
| EN 13813 | – | – | 2 |  |
| EN ISO 6946 | – | – | 2 |  |
| VDI 4100 | – | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

