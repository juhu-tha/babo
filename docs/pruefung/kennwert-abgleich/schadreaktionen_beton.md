# Kennwert-Abgleich: `schadreaktionen_beton`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `schadreaktionen_beton` (Dauerhaftigkeit, offen)
- **Komponente:** `src/modules/SchadreaktionenBeton.tsx`
- **Dateien (2):** `content/schadreaktionenbeton/SchadreaktionenBeton.json`, `src/modules/SchadreaktionenBeton.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 5 (5) |
| (3) Normverweise / Hinweise | 7 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/SchadreaktionenBeton.tsx:515` | `0.006` | – | `dataNA.push(z * 0.006);` |
| `src/modules/SchadreaktionenBeton.tsx:541` | `1.4` | – | `const l_bar = Math.max(0.1, 3 * (1.4 * Math.max(0.01, wz - 0.35) / Math.max(0.1, lp)));` |
| `src/modules/SchadreaktionenBeton.tsx:541` | `0.35` | – | `const l_bar = Math.max(0.1, 3 * (1.4 * Math.max(0.01, wz - 0.35) / Math.max(0.1, lp)));` |
| `src/modules/SchadreaktionenBeton.tsx:579` | `1.4` | – | `const currentLBar = Math.max(0.1, 3 * (1.4 * Math.max(0.01, wz - 0.35) / Math.max(0.1, currentLp)));` |
| `src/modules/SchadreaktionenBeton.tsx:579` | `0.35` | – | `const currentLBar = Math.max(0.1, 3 * (1.4 * Math.max(0.01, wz - 0.35) / Math.max(0.1, currentLp)));` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 1 |  |
| DIN 1045-2 | 2023-08 | – | 2 | Ausgaben uneinheitlich |
| DIN 1164-10 | – | – | 2 |  |
| DIN 19573 | 2026-06 | – | 1 |  |
| EN 206 | 2021-06 | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008 (2×), 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (139×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/schadreaktionenbeton/SchadreaktionenBeton.json › werte.powers1949Din1045` – Powers (1949); DIN 1045-2:2023-08
  - 2023-08: `content/schadreaktionenbeton/SchadreaktionenBeton.json › daten.SchadreaktionenBeton.regelwerke.1.title` – DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton – Festlegung, Eigenschaften, Her…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

