# Kennwert-Abgleich: `bp_lehmbauprodukte`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bp_lehmbauprodukte` (Bauprodukte, offen)
- **Komponente:** `src/modules/BpLehmbauprodukte.tsx`
- **Dateien (2):** `content/bplehmbauprodukte/BpLehmbauprodukte.json`, `src/modules/BpLehmbauprodukte.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 41 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 18940 | – | – | 17 |  |
| DIN 18940 | 2023-06 | – | 3 |  |
| DIN 18945-189 | – | – | 1 |  |
| DIN 18945 | – | – | 6 |  |
| DIN 18945 | 2024-03 | – | 1 |  |
| DIN 18946 | – | – | 3 |  |
| DIN 18946 | 2024-03 | – | 2 |  |
| DIN 18947 | – | – | 4 |  |
| DIN 18947 | 2024-03 | – | 1 |  |
| DIN 18948 | – | – | 2 |  |
| DIN 18948 | 2024-03 | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

