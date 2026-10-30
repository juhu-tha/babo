# Kennwert-Abgleich: `carbonbeton`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `carbonbeton` (Massivbau, geprueft)
- **Komponente:** `src/modules/Carbonbeton.tsx`
- **Dateien (2):** `content/carbonbeton/Carbonbeton.json`, `src/modules/Carbonbeton.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 2 (0) |
| (3) Normverweise / Hinweise | 13 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Carbonbeton.tsx:53` | `160` | ja | `const mmToPx = 160 / h;` |
| `src/modules/Carbonbeton.tsx:70` | `40` | ja | `const hStahl = Math.max(100, h + 2 * 40 - 2 * c);` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | 2023-08 | – | 2 | Ausgaben uneinheitlich |
| DIN 1045-3 | – | – | 1 |  |
| DIN 1045-3 | 2023-08 | – | 2 |  |
| DIN 1045-100 | – | – | 2 |  |
| EN 206 | – | – | 2 |  |
| EN 1992-1-1 | – | – | 2 |  |
| EN 1992-1-1 | 2011-01 | – | 1 | Ausgaben uneinheitlich |
| EN 13670 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/carbonbeton/Carbonbeton.json › texte.regelwerkCarbonbeton` – …N EN 13670 mit DIN 1045-3. Der Beton richtet sich nach DIN EN 206 mit DIN 1045-2:2023-08 (kein Leichtbeton), die Betonbauqualitä…
  - 2023-08: `content/carbonbeton/Carbonbeton.json › daten.Carbonbeton.regelwerke.3.title` – DIN 1045-2:2023-08 (Beton – Anwendungsregeln zu DIN EN 206…
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01: `content/carbonbeton/Carbonbeton.json › daten.Carbonbeton.regelwerke.1.title` – DIN EN 1992-1-1:2011-01 + NA:2013-04 (Eurocode 2, Grundlage der…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

