# Kennwert-Abgleich: `bp_trockenbau`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bp_trockenbau` (Bauprodukte, geprueft)
- **Komponente:** `src/modules/BpTrockenbau.tsx`
- **Dateien (2):** `content/bptrockenbau/BpTrockenbau.json`, `src/modules/BpTrockenbau.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 35 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4102-4 | – | – | 2 |  |
| DIN 4102 | – | – | 1 |  |
| DIN 4109-2 | – | – | 1 |  |
| DIN 4109 | – | – | 1 |  |
| DIN 18180 | – | – | 1 |  |
| DIN 18181 | – | – | 2 |  |
| DIN 18182 | – | – | 1 |  |
| DIN 18948 | – | – | 3 |  |
| EN 520 | – | – | 12 |  |
| EN 12467 | – | – | 2 |  |
| EN 13501 | – | – | 1 |  |
| EN 14190 | – | – | 2 |  |
| EN 14195 | – | – | 3 |  |
| EN 14306 | – | – | 1 |  |
| EN 15283-2 | – | – | 2 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

