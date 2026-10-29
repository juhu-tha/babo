# Kennwert-Abgleich: `bodenmechanik`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bodenmechanik` (Mechanik, geprueft)
- **Komponente:** `src/modules/Bodenmechanik.tsx`
- **Dateien (4):** `content/bodenmechanik/AtterbergTab.json`, `content/bodenmechanik/Bodenmechanik.json`, `src/modules/Bodenmechanik.tsx`, `src/modules/bodenmechanik/AtterbergTab.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 2 (2) |
| (3) Normverweise / Hinweise | 45 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Bodenmechanik.tsx:75` | `1.2` | – | `const maxSigma = Math.max(300, sigma1 * 1.2, sigma1_f * 1.2);` |
| `src/modules/Bodenmechanik.tsx:397` | `0.73` | – | `formel: 'I_{P,A} = 0{,}73 \\cdot (${formatDeTeX(wL, 1)} - 20) = ${formatDeTeX(0.73 * (wL - 20), 1)}\\,\\% \\quad I_P = ${formatDeTeX(results` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1054 | – | – | 1 |  |
| DIN 1054 | 2021-04 | – | 2 |  |
| DIN 4019 | 2015-05 | – | 3 |  |
| DIN 4085 | – | – | 2 |  |
| DIN 4085 | 2017-08 | – | 2 |  |
| DIN 18122-1 | – | – | 3 |  |
| DIN 18196 | – | – | 8 |  |
| DIN 18196 | 2023-02 | – | 3 |  |
| EN 1997-1/NA | 2010-12 | – | 1 |  |
| EN 1997-1 | – | – | 1 |  |
| EN 1997-1 | 2009-09 | – | 1 | Registry 2014-03 |
| EN 1997-1 | 2014-03 | – | 1 |  |
| EN 1997-1 | 2024 | – | 1 | Registry 2014-03 |
| EN ISO 14688-2 | – | – | 8 |  |
| EN ISO 17892-12 | – | – | 5 |  |
| EN ISO 17892-12 | 2022-08 | – | 3 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

