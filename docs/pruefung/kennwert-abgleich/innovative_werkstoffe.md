# Kennwert-Abgleich: `innovative_werkstoffe`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `innovative_werkstoffe` (Betontechnologie, geprueft)
- **Komponente:** `src/modules/InnovativeWerkstoffe.tsx`
- **Dateien (2):** `content/innovativewerkstoffe/InnovativeWerkstoffe.json`, `src/modules/InnovativeWerkstoffe.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 3 (0) |
| (3) Normverweise / Hinweise | 10 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/InnovativeWerkstoffe.tsx:291` | `130` | ja | `const stars = Math.min(5, Math.max(1, Math.round((score / 130) * 5 * 10) / 10)); // Darstellungsfaktor: Punktzahl 130 = 5 Sterne` |
| `src/modules/InnovativeWerkstoffe.tsx:557` | `1200` | ja | `const E_mod_base = 1200 * developedYieldBase; // in Pa` |
| `src/modules/InnovativeWerkstoffe.tsx:563` | `0.653` | ja | `const H_critical_buckling = Math.pow((0.653 * E_mod_base * b_m * b_m * shapeFactor) / (concreteDensity * gVal), 1/3); // Faktor 7,837/12` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| EN 197-5 | – | – | 4 |  |
| EN 197-5 | 2021-07 | – | 2 |  |
| EN 197 | – | – | 2 |  |
| EN 206 | – | – | 1 |  |
| EN 1992-1-1 | – | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

