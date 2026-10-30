# Kennwert-Abgleich: `bp_daemmung`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bp_daemmung` (Bauprodukte, geprueft)
- **Komponente:** `src/modules/BpDaemmung.tsx`
- **Dateien (2):** `content/bpdaemmung/BpDaemmung.json`, `src/modules/BpDaemmung.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 29 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4108-2 | – | – | 1 |  |
| DIN 4108-3 | – | – | 1 |  |
| DIN 4108-7 | – | – | 1 |  |
| DIN 4108-10 | – | – | 4 |  |
| EN 13055 | – | – | 1 |  |
| EN 13162 | – | – | 3 |  |
| EN 13163 | – | – | 1 |  |
| EN 13164 | – | – | 2 |  |
| EN 13165 | – | – | 1 |  |
| EN 13166 | – | – | 1 |  |
| EN 13167 | – | – | 1 |  |
| EN 13169 | – | – | 1 |  |
| EN 13170 | – | – | 1 |  |
| EN 13171 | – | – | 2 |  |
| EN 14063-1 | – | – | 1 |  |
| EN 14306 | – | – | 1 |  |
| EN 14313 | – | – | 1 |  |
| EN 14316-1 | – | – | 1 |  |
| EN 15101-1 | – | – | 1 |  |
| EN ISO 6946 | – | Gl. 1, Gl. 3 | 3 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

