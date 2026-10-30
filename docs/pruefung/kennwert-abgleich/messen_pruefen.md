# Kennwert-Abgleich: `messen_pruefen`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `messen_pruefen` (Labor & Auswertung, geprueft)
- **Komponente:** `src/modules/MessenPruefen.tsx`
- **Dateien (8):** `content/messenpruefen/BegriffeTab.json`, `content/messenpruefen/MessenPruefen.json`, `content/messenpruefen/MessunsicherheitTab.json`, `content/messenpruefen/TreffbildTab.json`, `src/modules/MessenPruefen.tsx`, `src/modules/messenpruefen/BegriffeTab.tsx`, `src/modules/messenpruefen/MessunsicherheitTab.tsx`, `src/modules/messenpruefen/TreffbildTab.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 4 (0) |
| (3) Normverweise / Hinweise | 41 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/MessenPruefen.tsx:525` | `50.0` | ja | `const curX = Math.max(35, Math.min(425, 230 + (rvStats.currentLab.a - 50.0) * 28)); // Darstellungsfaktor: Plotmitte 50,0 MPa, 28 px je MPa` |
| `src/modules/MessenPruefen.tsx:525` | `28` | ja | `const curX = Math.max(35, Math.min(425, 230 + (rvStats.currentLab.a - 50.0) * 28)); // Darstellungsfaktor: Plotmitte 50,0 MPa, 28 px je MPa` |
| `src/modules/MessenPruefen.tsx:526` | `48.0` | ja | `const curY = Math.max(25, Math.min(195, 110 - (rvStats.currentLab.b - 48.0) * 28)); // Darstellungsfaktor: Plotmitte 48,0 MPa, 28 px je MPa` |
| `src/modules/MessenPruefen.tsx:526` | `28` | ja | `const curY = Math.max(25, Math.min(195, 110 - (rvStats.currentLab.b - 48.0) * 28)); // Darstellungsfaktor: Plotmitte 48,0 MPa, 28 px je MPa` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 862 | 2015-03 | – | 1 |  |
| DIN 18202 | – | – | 1 |  |
| EN 206 | – | – | 1 |  |
| EN 12390-1 | – | – | 2 |  |
| EN 12390-3 | – | – | 2 |  |
| EN 12390-4 | – | – | 1 |  |
| EN 12504-1 | – | – | 1 |  |
| EN ISO 7500-1 | – | – | 3 |  |
| EN ISO 7500-1 | 2018-06 | – | 1 |  |
| EN ISO 9001 | – | – | 1 |  |
| EN ISO 13385-1 | – | – | 2 |  |
| EN ISO 13385-1 | 2020-03 | – | 1 |  |
| EN ISO 13528 | – | – | 1 |  |
| ISO 5725-1 | – | – | 3 |  |
| ISO 5725-1 | 1997-11 | – | 1 |  |
| ISO 5725-1 | 2023-07 | – | 1 |  |
| ISO 5725 | – | – | 1 |  |
| ISO 13528 | – | – | 7 |  |
| ISO 13528 | 2025-07 | – | 5 |  |
| ISO 16331-1 | – | – | 2 |  |
| ISO 17123-2 | – | – | 2 |  |
| ISO 17123-2 | 2023-12 | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

