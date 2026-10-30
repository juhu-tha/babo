# Kennwert-Abgleich: `bp_mauerwerk`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bp_mauerwerk` (Bauprodukte, offen)
- **Komponente:** `src/modules/BpMauerwerk.tsx`
- **Dateien (2):** `content/bpmauerwerk/BpMauerwerk.json`, `src/modules/BpMauerwerk.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 38 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 105-100 | – | – | 1 |  |
| DIN 105 | – | – | 1 |  |
| DIN 4108-4 | – | – | 1 |  |
| DIN 18533 | – | – | 1 |  |
| DIN 18940 | – | – | 1 |  |
| DIN 18945 | – | – | 1 |  |
| DIN 20000-401 | – | – | 1 |  |
| DIN 20000-402 | – | – | 1 |  |
| DIN 20000-403 | – | – | 1 |  |
| DIN 20000-404 | – | – | 1 |  |
| DIN 20000-412 | – | – | 1 |  |
| EN 771-1 | – | – | 3 |  |
| EN 771-2 | – | – | 2 |  |
| EN 771-3 | – | – | 2 |  |
| EN 771-4 | – | – | 2 |  |
| EN 771-6 | – | – | 2 |  |
| EN 771 | – | – | 1 |  |
| EN 998-2 | – | – | 3 |  |
| EN 1996-1-1/NA | – | – | 3 |  |
| EN 1996-1-1 | – | Gl. 3.1 | 5 |  |
| EN 1996 | – | – | 2 |  |
| EN 13171 | – | – | 1 |  |
| EN 13499 | – | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

