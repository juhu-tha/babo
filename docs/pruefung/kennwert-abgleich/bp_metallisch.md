# Kennwert-Abgleich: `bp_metallisch`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bp_metallisch` (Bauprodukte, geprueft)
- **Komponente:** `src/modules/BpMetallisch.tsx`
- **Dateien (2):** `content/bpmetallisch/BpMetallisch.json`, `src/modules/BpMetallisch.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 52 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 488 | – | – | 1 |  |
| DIN 17611 | – | – | 2 |  |
| DIN 17850 | – | – | 1 |  |
| EN 124 | – | – | 2 |  |
| EN 573 | – | – | 1 |  |
| EN 988 | – | – | 2 |  |
| EN 1090-1 | – | – | 1 |  |
| EN 1090-2 | – | – | 2 |  |
| EN 1090 | – | – | 3 |  |
| EN 1172 | – | – | 1 |  |
| EN 1563 | – | – | 1 |  |
| EN 1991-1-1 | – | – | 1 |  |
| EN 1991-1-5 | – | – | 1 |  |
| EN 1991 | – | – | 1 |  |
| EN 1993-1-1/NA | – | – | 1 |  |
| EN 1993-1-4 | – | – | 2 |  |
| EN 1993 | – | – | 2 |  |
| EN 1999-1-1 | – | – | 1 |  |
| EN 1999 | – | – | 1 |  |
| EN 10025-2 | – | – | 1 |  |
| EN 10025-5 | – | – | 1 |  |
| EN 10025 | – | – | 2 |  |
| EN 10088 | – | – | 1 |  |
| EN 10169 | – | – | 1 |  |
| EN 10346 | – | – | 2 |  |
| EN 12164 | – | – | 1 |  |
| EN 12165 | – | – | 1 |  |
| EN 12449 | – | – | 1 |  |
| EN 12588 | – | – | 2 |  |
| EN ISO 1461 | – | – | 2 |  |
| EN ISO 8044 | – | – | 2 |  |
| EN ISO 9223 | – | – | 1 |  |
| EN ISO 10456 | – | – | 2 |  |
| EN ISO 12944 | – | – | 3 |  |
| EN ISO 28438 | – | – | 1 |  |
| ISO 12944 | – | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

