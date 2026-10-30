# Kennwert-Abgleich: `modernisierung`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `modernisierung` (Bauen im Bestand, geprueft)
- **Komponente:** `src/modules/Modernisierung.tsx`
- **Dateien (2):** `content/modernisierung/Modernisierung.json`, `src/modules/Modernisierung.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 1 (1) |
| (3) Normverweise / Hinweise | 20 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Modernisierung.tsx:131` | `85` | – | `const baseLaborCost = 85 * componentArea; // Montage, Gerüst, Armierung, Putz` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4108-2 | – | – | 1 |  |
| DIN 4108-2 | 2013-02 | – | 1 | Ausgaben uneinheitlich; Registry 2026-05 |
| DIN 4108-3 | – | – | 1 |  |
| DIN 18533 | – | – | 1 |  |
| DIN TS 18599 | – | – | 1 |  |
| EN ISO 6946 | – | – | 6 |  |
| EN ISO 6946 | 2018-03 | – | 2 |  |
| EN ISO 10077-1 | – | – | 1 |  |
| VDI 2067 | – | – | 2 |  |
| VDI 4710 | – | – | 4 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 4108-2:** 2013-02 (25×, teils mit Hinweis auf andere Ausgabe), 2026-05 (10×, teils mit Hinweis auf andere Ausgabe)
  - 2013-02: `content/modernisierung/Modernisierung.json › texte.begehbareSowieNichtBegehbare` – …unbeheizten Dachraum abgrenzen und nicht den Mindestwärmeschutz nach DIN 4108-2:2013-02 erfüllen, müssen so gedämmt sein, dass…

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- DIN 4108-2:2013-02 (Registry 2026-05): `content/modernisierung/Modernisierung.json › texte.begehbareSowieNichtBegehbare` – …unbeheizten Dachraum abgrenzen und nicht den Mindestwärmeschutz nach DIN 4108-2:2013-02 erfüllen, müssen so gedämmt sein, dass…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

