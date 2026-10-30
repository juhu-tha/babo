# Kennwert-Abgleich: `festbeton_statistik`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `festbeton_statistik` (Labor & Auswertung, geprueft)
- **Komponente:** `src/modules/FestbetonStatistik.tsx`
- **Dateien (2):** `content/festbetonstatistik/FestbetonStatistik.json`, `src/modules/FestbetonStatistik.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 3 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 27 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (3): `CONCRETE['C25/30'].fck_cube` ×1, `CONCRETE['C30/37'].fck_cube` ×1, `CONCRETE['C35/45'].fck_cube` ×1

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | 2023-08 | – | 2 | Ausgaben uneinheitlich |
| EN 206-1 | – | – | 1 |  |
| EN 206 | – | Tab. 14 | 3 |  |
| EN 206 | 2021-06 | Tab. 14 | 9 |  |
| EN 1990 | – | Anhang D | 1 |  |
| EN 1992-1-1/NA | – | – | 5 |  |
| EN 1992-1-1/NA | 2013-04 | – | 1 |  |
| EN 1992-1-1 | – | – | 1 |  |
| EN 1992-1-1 | 2011-01 | – | 2 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2025-09 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 12390-3 | 2019-10 | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008 (2×), 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (139×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08 (mit Hinweis): `content/festbetonstatistik/FestbetonStatistik.json › texte.maßgebendBleibenDinEn` – Maßgebend bleiben DIN EN 206:2021-06 mit DIN 1045-2:2023-08 und DIN EN 1992-1-1:2011-01 mit NA. Was…
  - 2023-08: `content/festbetonstatistik/FestbetonStatistik.json › daten.FestbetonStatistik.regelwerke.1.title` – DIN 1045-2:2023-08 (Tragwerke aus Beton, Stahlbeton und Sp…
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01 (mit Hinweis): `content/festbetonstatistik/FestbetonStatistik.json › texte.maßgebendBleibenDinEn` – Maßgebend bleiben DIN EN 206:2021-06 mit DIN 1045-2:2023-08 und DIN EN 1992-1-1:2011-01 mit NA. Was die Neuausgaben ändern – et…
  - 2011-01: `content/festbetonstatistik/FestbetonStatistik.json › daten.FestbetonStatistik.regelwerke.3.title` – DIN EN 1992-1-1:2011-01 + A1:2015-03 mit DIN EN 1992-1-1/NA:201…
  - 2025-09 (mit Hinweis): `content/festbetonstatistik/FestbetonStatistik.json › daten.FestbetonStatistik.regelwerke.3.title` – …EN 1992-1-1/NA:2013-04 (bauaufsichtlich eingeführt); neue Generation DIN EN 1992-1-1:2025-09

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

