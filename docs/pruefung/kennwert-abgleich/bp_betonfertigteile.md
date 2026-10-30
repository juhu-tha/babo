# Kennwert-Abgleich: `bp_betonfertigteile`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bp_betonfertigteile` (Bauprodukte, geprueft)
- **Komponente:** `src/modules/BpBetonfertigteile.tsx`
- **Dateien (2):** `content/bpbetonfertigteile/BpBetonfertigteile.json`, `src/modules/BpBetonfertigteile.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 2 (2) |
| (3) Normverweise / Hinweise | 32 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/BpBetonfertigteile.tsx:411` | `1660` | – | `2. Vorgespannte Drahtlitzen (Spannstahl St 1660/1860) im Untergurt` |
| `src/modules/BpBetonfertigteile.tsx:411` | `1860` | – | `2. Vorgespannte Drahtlitzen (Spannstahl St 1660/1860) im Untergurt` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 488 | – | – | 1 |  |
| DIN 1045-3 | – | – | 2 |  |
| DIN 1045-4 | 2012-02 | – | 1 |  |
| DIN 1045-4 | 2023-08 | – | 2 |  |
| DIN 1045-40 | 2023-08 | – | 2 |  |
| DIN 18218 | – | – | 1 |  |
| EN 1168 | – | – | 7 |  |
| EN 1992-1-1 | – | Abs. 6.2.5 | 2 |  |
| EN 13369 | – | – | 2 |  |
| EN 13670 | – | – | 2 |  |
| EN 13747 | – | – | 5 |  |
| EN 14992 | – | – | 5 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

