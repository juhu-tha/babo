# Kennwert-Abgleich: `vl_bauen_im_bestand`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `vl_bauen_im_bestand` (Vorlesungen, offen), `vl_bauschaeden` (Vorlesungen, offen), `vl_baustoffkunde` (Vorlesungen, offen), `vl_instandhaltung` (Vorlesungen, offen), `vl_nachhaltiges_bauen` (Vorlesungen, offen), `vl_ueberblick` (–, offen)
- **Komponente:** `src/modules/Vorlesungen.tsx`
- **Dateien (2):** `content/vorlesungen/Vorlesungen.json`, `src/modules/Vorlesungen.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 2 (2) |
| (3) Normverweise / Hinweise | 17 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Vorlesungen.tsx:346` | `2026` | – | `WS 2026/27` |
| `src/modules/Vorlesungen.tsx:346` | `27` | – | `WS 2026/27` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 105 | – | – | 1 |  |
| DIN 1045-2 | – | – | 1 |  |
| DIN 18940 | – | – | 1 |  |
| DIN 31051 | – | – | 1 |  |
| EN 197-1 | – | – | 1 |  |
| EN 1504-9 | – | – | 1 |  |
| EN 1504 | – | – | 2 |  |
| EN 1990-2 | 2026 | – | 3 |  |
| EN 1990 | – | – | 1 |  |
| EN 12620 | – | – | 1 |  |
| EN 15804 | – | – | 1 |  |
| EN 15978 | – | – | 1 |  |
| EN ISO 12696 | – | – | 1 |  |
| VDI 6200 | – | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

