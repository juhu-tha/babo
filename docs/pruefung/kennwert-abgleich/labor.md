# Kennwert-Abgleich: `labor`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `labor` (Labor & Auswertung, offen)
- **Komponente:** `src/modules/Labor.tsx`
- **Dateien (4):** `content/bitumenversuche/BitumenVersuche.json`, `content/labor/Labor.json`, `src/modules/BitumenVersuche.tsx`, `src/modules/Labor.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 2 (2) |
| (3) Normverweise / Hinweise | 56 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/BitumenVersuche.tsx:46` | `0.4` | – | `const spitzeY = oberflaecheY + tiefeEinheiten * 0.4;` |
| `src/modules/BitumenVersuche.tsx:53` | `54` | – | `const durchhang = anteil * 54;` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| EN 408 | 2012-10 | – | 1 |  |
| EN 1426 | – | – | 10 |  |
| EN 1426 | 2015 | – | 1 |  |
| EN 1427 | – | – | 6 |  |
| EN 1542 | – | – | 4 |  |
| EN 1542 | 1999-07 | – | 2 |  |
| EN 1992-1-1 | – | Tab. 3.1 | 1 |  |
| EN 1995-1-1 | – | – | 1 |  |
| EN 12350-2 | – | – | 1 |  |
| EN 12350-2 | 2019 | – | 1 |  |
| EN 12350-5 | – | – | 2 |  |
| EN 12350-5 | 2019 | – | 1 |  |
| EN 12390-3 | – | – | 1 |  |
| EN 12390-3 | 2019-10 | – | 1 |  |
| EN 12390-5 | – | – | 3 |  |
| EN 12390-5 | 2019 | – | 1 |  |
| EN 12390-6 | – | – | 2 |  |
| EN 12390-6 | 2024-05 | – | 1 |  |
| EN 12390-13 | – | – | 1 |  |
| EN 12390-13 | 2021-09 | – | 3 |  |
| EN 12504-2 | 2021-10 | – | 1 |  |
| EN 12591 | – | Anhang A | 5 |  |
| EN 13791 | 2020-02 | – | 1 |  |
| EN 14023 | – | – | 3 |  |
| EN ISO 6892-1 | – | – | 1 |  |
| EN ISO 6892-1 | 2020-06 | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

