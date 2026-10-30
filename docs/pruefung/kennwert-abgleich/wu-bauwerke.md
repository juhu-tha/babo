# Kennwert-Abgleich: `wu-bauwerke`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `wu-bauwerke` (Massivbau, geprueft)
- **Komponente:** `src/modules/WUBauwerke.tsx`
- **Dateien (2):** `content/wubauwerke/WUBauwerke.json`, `src/modules/WUBauwerke.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 21 / 3 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 2 |  |
| DIN 1045-2 | 2023-08 | – | 1 | Ausgaben uneinheitlich |
| DIN 7865 | – | – | 1 |  |
| DIN 18197 | – | – | 2 |  |
| DIN 18197 | 2018-01 | – | 1 |  |
| DIN 18533-1 | 2026-06 | – | 1 | Ausgaben uneinheitlich |
| DIN 18533 | – | – | 1 |  |
| EN 206 | – | – | 2 |  |
| EN 206 | 2021-06 | – | 1 |  |
| EN 1504-5 | – | – | 2 |  |
| EN 1504-5 | 2013-05 | – | 1 |  |
| EN 1992-1-1 | – | – | 4 |  |
| EN 1992-1-1 | 2011-01 | – | 1 | Ausgaben uneinheitlich |
| EN 12390-8 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/wubauwerke/WUBauwerke.json › daten.WUBauwerke.regelwerke.2.title` – DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton - Festlegung, Eigenschaften, Her…
- **DIN 18533-1:** 2017-07 (2×, teils mit Hinweis auf andere Ausgabe), 2026-06 (4×, teils mit Hinweis auf andere Ausgabe)
  - 2026-06: `content/wubauwerke/WUBauwerke.json › daten.WUBauwerke.regelwerke.4.title` – DIN 18533-1:2026-06 (Abdichtung von erdberührten Bauteilen)
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01: `content/wubauwerke/WUBauwerke.json › daten.WUBauwerke.regelwerke.1.title` – DIN EN 1992-1-1:2011-01 + NA:2013-04 (Eurocode 2, Abschnitt 7.3…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

