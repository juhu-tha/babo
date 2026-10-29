# Kennwert-Abgleich: `holz`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `holz` (Baustoffe, geprueft)
- **Komponente:** `src/modules/Holz.tsx`
- **Dateien (3):** `content/holz/Holz.json`, `src/modules/Holz.tsx`, `src/modules/holz/HolzSchwinden3D.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 24 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 68800-1 | – | – | 1 |  |
| DIN 68800 | – | – | 1 |  |
| EN 338 | – | – | 1 |  |
| EN 338 | 2016 | – | 1 |  |
| EN 338 | 2016-07 | – | 1 |  |
| EN 1995-1-1/NA | – | – | 2 |  |
| EN 1995-1-1/NA | 2013-08 | – | 1 |  |
| EN 1995-1-1 | – | Abs. 6.2.2, Gl. 6.16, Tab. 3.2 | 6 |  |
| EN 1995-1-1 | 2010-12 | – | 1 | Ausgaben uneinheitlich |
| EN 1995-1-1 | 2025 | – | 1 | Ausgaben uneinheitlich; Registry 2010-12 |
| EN 1995-1-1 | 2026-09 | – | 1 | Ausgaben uneinheitlich; Registry 2010-12 |
| EN 1995-1-2 | – | Tab. 3.1 | 2 |  |
| EN 1995-1-2 | 2010-12 | – | 1 |  |
| EN 14080 | – | – | 1 |  |
| EN 14080 | 2013 | – | 1 |  |
| EN 14080 | 2013-09 | – | 1 |  |
| EN 14081-1 | 2019-10 | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 1995-1-1:** 2010-12 (13×, teils mit Hinweis auf andere Ausgabe), 2025 (3×, teils mit Hinweis auf andere Ausgabe), 2026-09 (6×, teils mit Hinweis auf andere Ausgabe)
  - 2010-12: `content/holz/Holz.json › daten.Holz.regelwerke.0.title` – DIN EN 1995-1-1:2010-12 + A2:2014-07 mit DIN EN 1995-1-1/NA:201…
  - 2026-09 (mit Hinweis): `content/holz/Holz.json › daten.Holz.regelwerke.0.title` – …-08 (Eurocode 5, Teil 1-1; bauaufsichtlich eingeführt); 2. Generation DIN EN 1995-1-1:2026-09 (Deutsche Fassung EN 1995-1-1:2025, NA…
  - 2025 (mit Hinweis): `content/holz/Holz.json › daten.Holz.regelwerke.0.title` – …eingeführt); 2. Generation DIN EN 1995-1-1:2026-09 (Deutsche Fassung EN 1995-1-1:2025, NA noch ausstehend, nicht eingeführt)

### Dieselbe Tabelle unter verschiedenen Normteilen (app-weit)

- **EN 1995 Tab. 3.1:** -1-2 (5×: brandschutz, holz, holzbau_bauphysik, rechnung_bestand); -1-1 (2×: holzbau_bauphysik, rechnung_bestand)

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

