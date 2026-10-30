# Kennwert-Abgleich: `schnellkarbonatisierung`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `schnellkarbonatisierung` (Dauerhaftigkeit, geprueft)
- **Komponente:** `src/modules/Schnellkarbonatisierung.tsx`
- **Dateien (2):** `content/schnellkarbonatisierung/Schnellkarbonatisierung.json`, `src/modules/Schnellkarbonatisierung.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 1 (1) |
| (3) Normverweise / Hinweise | 18 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Schnellkarbonatisierung.tsx:65` | `1.08` | – | `const sMax = Math.max(1, ...punkte.map(p => Math.sqrt(Math.max(p.tTage, 0)))) * 1.08;` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 1 |  |
| EN 1992-1-1/NA | – | Tab. 4.4DE | 1 |  |
| EN 1992-1-1 | 2023 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1992-1-1 | 2025-09 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 12390-10 | – | – | 1 |  |
| EN 12390-10 | 2019-02 | – | 1 |  |
| EN 12390-12 | – | – | 6 |  |
| EN 12390-12 | 2020-04 | – | 4 |  |
| EN 14630 | – | – | 1 |  |
| EN 14630 | 2007-01 | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2025-09 (mit Hinweis): `content/schnellkarbonatisierung/Schnellkarbonatisierung.json › texte.doppelteDeckungBedeutetDie` – …2 sichergestellt, nicht über eine solche Prognose. Die 2. Generation (DIN EN 1992-1-1:2025-09) führt Expositionswiderstandsklassen ei…
  - 2023: `content/schnellkarbonatisierung/Schnellkarbonatisierung.json › texte.en199211` – EN 1992-1-1:2023 ordnet Betone Expositionswiderstandskla…

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- EN 1992-1-1:2023 (Registry 2011-01): `content/schnellkarbonatisierung/Schnellkarbonatisierung.json › texte.en199211` – EN 1992-1-1:2023 ordnet Betone Expositionswiderstandskla…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

