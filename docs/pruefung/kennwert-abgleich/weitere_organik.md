# Kennwert-Abgleich: `weitere_organik`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `weitere_organik` (Dauerhaftigkeit, geprueft)
- **Komponente:** `src/modules/WeitereOrganik.tsx`
- **Dateien (2):** `content/weitereorganik/WeitereOrganik.json`, `src/modules/WeitereOrganik.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 3 (0) |
| (3) Normverweise / Hinweise | 9 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/WeitereOrganik.tsx:60` | `6.5` | ja | `const factorRatio = Math.max(0.15, 1 - (degradationScore / 6.5)); // Lehrmodell (qualitativ): Faktor 6,5 = Punktzahl ohne Restnutzung` |
| `src/modules/WeitereOrganik.tsx:64` | `4.5` | ja | `const 十YearsDegradation = Math.min(100, Math.round((degradationScore / 4.5) * 45));` |
| `src/modules/WeitereOrganik.tsx:64` | `45` | ja | `const 十YearsDegradation = Math.min(100, Math.round((degradationScore / 4.5) * 45));` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 18531-1 | – | – | 1 |  |
| DIN 68800-1 | – | – | 1 |  |
| EN 12607-1 | – | – | 1 |  |
| EN 14769 | – | – | 1 |  |
| EN ISO 12944 | – | – | 1 |  |
| ISO 15686-1 | – | – | 3 |  |
| ISO 15686-2 | – | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

