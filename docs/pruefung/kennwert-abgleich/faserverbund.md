# Kennwert-Abgleich: `faserverbund`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `faserverbund` (–, offen), `kombinationen` (Baustoffe, geprueft)
- **Komponente:** `src/modules/Kombinationen.tsx`
- **Dateien (2):** `content/kombinationen/Kombinationen.json`, `src/modules/Kombinationen.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 1 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 48 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (1): `BETONSTAHL.B500*.fyk` ×1

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 488 | – | – | 1 |  |
| DIN 4108-3 | – | – | 8 |  |
| DIN 4108-3 | 2024-03 | – | 3 | Ausgaben uneinheitlich |
| DIN 18008 | – | – | 2 |  |
| DIN 18516-1 | – | – | 2 |  |
| DIN 18516-1 | 2010-06 | – | 1 |  |
| DIN 55699 | – | – | 1 |  |
| EN 1504-2 | – | – | 4 |  |
| EN 1504-2 | 2005-01 | – | 1 |  |
| EN 1542 | – | – | 3 |  |
| EN 1542 | 1999-07 | – | 2 |  |
| EN 1992-1-1 | 2011-01 | – | 1 | Ausgaben uneinheitlich |
| EN 13499 | – | – | 1 |  |
| EN 14509 | – | – | 1 |  |
| EN 14509 | 2013-12 | – | 1 |  |
| EN 15026 | – | – | 1 |  |
| EN ISO 527-4 | 2023-09 | – | 1 |  |
| EN ISO 1461 | – | – | 1 |  |
| EN ISO 6946 | – | – | 2 |  |
| EN ISO 6946 | 2018-03 | – | 3 |  |
| EN ISO 12944-1 | 2019-01 | – | 1 |  |
| EN ISO 12944 | – | – | 3 |  |
| VDI 2014 | – | – | 4 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 4108-3:** 2018-10 (3×), 2024-03 (17×, teils mit Hinweis auf andere Ausgabe)
  - 2024-03: `content/kombinationen/Kombinationen.json › werte.dinEnIso6946` – DIN EN ISO 6946:2018-03, DIN 4108-3:2024-03 & VDI 2014
  - 2024-03: `content/kombinationen/Kombinationen.json › daten.Kombinationen.regelwerke.1.title` – DIN 4108-3:2024-03 (Wärmeschutz und Energie-Einsparung in…
  - 2024-03: `content/kombinationen/Kombinationen.json › daten.Kombinationen.formeln.1.quelle` – DIN 4108-3:2024-03
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01: `content/kombinationen/Kombinationen.json › daten.Kombinationen.regelwerke.2.title` – DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA (Eurocode 2: Bemess…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

