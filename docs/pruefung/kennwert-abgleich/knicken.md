# Kennwert-Abgleich: `knicken`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `knicken` (Mechanik, geprueft)
- **Komponente:** `src/modules/Knicken.tsx`
- **Dateien (2):** `content/knicken/Knicken.json`, `src/modules/Knicken.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 10 (9) |
| (3) Normverweise / Hinweise | 9 / 3 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Knicken.tsx:75` | `300` | ja | `const w0_mm = (l * 1000) / 300;` |
| `src/modules/Knicken.tsx:262` | `300` | – | `? 'w = ${formatDeTeX((l * 1000) / 300, 1)} \\cdot 12{,}5 = ${formatDeTeX(results.maxDeflectionMm, 1)}\\,\\text{mm}'` |
| `src/modules/Knicken.tsx:263` | `300` | – | `: 'w = \\frac{w_0}{1 - N_{Ed}/F_K} = \\frac{${formatDeTeX((l * 1000) / 300, 1)}}{1 - ${formatDeTeX(loadPercent / 100, 2)}} = ${formatDeTeX(r` |
| `src/modules/Knicken.tsx:327` | `150` | – | `const amp = Math.min(85, (results.maxDeflectionMm / 150) * 85);` |
| `src/modules/Knicken.tsx:327` | `85` | – | `const amp = Math.min(85, (results.maxDeflectionMm / 150) * 85);` |
| `src/modules/Knicken.tsx:332` | `0.8` | – | `pathD = 'M ${centerX + amp} ${topY} Q ${centerX + amp * 0.8} 180 ${centerX} ${botY}';` |
| `src/modules/Knicken.tsx:335` | `1.5` | – | `pathD = 'M ${centerX} ${topY} Q ${centerX + amp * 1.5} 180 ${centerX} ${botY}';` |
| `src/modules/Knicken.tsx:338` | `1.6` | – | `pathD = 'M ${centerX} ${topY} C ${centerX + amp * 1.6} 130 ${centerX + amp * 0.4} 240 ${centerX} ${botY}';` |
| `src/modules/Knicken.tsx:338` | `0.4` | – | `pathD = 'M ${centerX} ${topY} C ${centerX + amp * 1.6} 130 ${centerX + amp * 0.4} 240 ${centerX} ${botY}';` |
| `src/modules/Knicken.tsx:341` | `1.8` | – | `pathD = 'M ${centerX} ${topY} C ${centerX} 120 ${centerX + amp * 1.8} 140 ${centerX + amp * 1.8} 180 C ${centerX + amp * 1.8} 220 ${centerX}` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| EN 1992-1-1 | 2011-01 | – | 1 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2025-09 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1993-1-1 | – | Tab. 5.1 | 4 |  |
| EN 1993-1-1 | 2010-12 | – | 1 | Ausgaben uneinheitlich |
| EN 1993-1-1 | 2025-04 | – | 1 | Ausgaben uneinheitlich; Registry 2010-12 |
| EN 1995-1-1 | 2010-12 | – | 1 | Ausgaben uneinheitlich |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01 (mit Hinweis): `content/knicken/Knicken.json › daten.Knicken.regelwerke.1.title` – DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA (5.8 Theorie II. Or…
  - 2025-09 (mit Hinweis): `content/knicken/Knicken.json › daten.Knicken.regelwerke.1.title` – …011-01 + A1:2015-03 mit NA (5.8 Theorie II. Ordnung); neue Generation DIN EN 1992-1-1:2025-09
- **EN 1993-1-1:** 2010-12 (9×, teils mit Hinweis auf andere Ausgabe), 2022 (1×, teils mit Hinweis auf andere Ausgabe), 2025-04 (12×, teils mit Hinweis auf andere Ausgabe)
  - 2010-12: `content/knicken/Knicken.json › daten.Knicken.regelwerke.0.title` – DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA (bauaufsichtlich ei…
  - 2025-04 (mit Hinweis): `content/knicken/Knicken.json › daten.Knicken.regelwerke.0.title` – …it NA (bauaufsichtlich eingeführt; 6.3 Biegeknicken); neue Generation DIN EN 1993-1-1:2025-04
- **EN 1995-1-1:** 2010-12 (13×, teils mit Hinweis auf andere Ausgabe), 2025 (3×, teils mit Hinweis auf andere Ausgabe), 2026-09 (6×, teils mit Hinweis auf andere Ausgabe)
  - 2010-12 (mit Hinweis): `content/knicken/Knicken.json › daten.Knicken.regelwerke.2.title` – DIN EN 1995-1-1:2010-12 + A2:2014-07 mit NA (6.3 Ersatzstabverf…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

