# Kennwert-Abgleich: `kreislauf_dpp`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `kreislauf_dpp` (Nachhaltigkeit, geprueft)
- **Komponente:** `src/modules/Kreislaufwirtschaft.tsx`
- **Dateien (2):** `content/kreislaufwirtschaft/Kreislaufwirtschaft.json`, `src/modules/Kreislaufwirtschaft.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 2 (0) |
| (3) Normverweise / Hinweise | 10 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Kreislaufwirtschaft.tsx:57` | `0.9` | ja | `const f_u = utility > 0 ? (0.9 / utility) : 0.9; // F(X) = 0,9/X nach Ellen MacArthur Foundation/Granta (2015), wie formeln.1` |
| `src/modules/Kreislaufwirtschaft.tsx:250` | `1.5` | ja | `estimatedRevenueEur += comp.quantity * 1.5; // Lehrwert: Erlös Recycling je Stück [€]` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN SPEC 91484 | – | – | 6 |  |
| DIN SPEC 91525 | – | – | 4 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

