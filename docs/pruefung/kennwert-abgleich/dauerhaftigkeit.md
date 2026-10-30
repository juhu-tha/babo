# Kennwert-Abgleich: `dauerhaftigkeit`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `dauerhaftigkeit` (Dauerhaftigkeit, geprueft)
- **Komponente:** `src/modules/Dauerhaftigkeit.tsx`
- **Dateien (10):** `content/dauerhaftigkeit/BetonDauerhaftigkeitsSimulator.json`, `content/dauerhaftigkeit/Dauerhaftigkeit.json`, `content/dauerhaftigkeit/MetalDurabilitySimulator.json`, `content/dauerhaftigkeit/ThematischeLinks.json`, `content/dauerhaftigkeit/TimberDurabilitySimulator.json`, `src/modules/Dauerhaftigkeit.tsx`, `src/modules/dauerhaftigkeit/BetonDauerhaftigkeitsSimulator.tsx`, `src/modules/dauerhaftigkeit/MetalDurabilitySimulator.tsx`, `src/modules/dauerhaftigkeit/ThematischeLinks.tsx`, `src/modules/dauerhaftigkeit/TimberDurabilitySimulator.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 59 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 5 |  |
| DIN 1045-2 | 2023-08 | – | 4 | Ausgaben uneinheitlich |
| DIN 1045-3 | – | – | 1 |  |
| DIN 1045-40 | – | – | 1 |  |
| DIN 1045-100 | – | – | 1 |  |
| DIN 1045 | – | – | 2 |  |
| DIN 68800-1 | – | – | 4 |  |
| DIN 68800-1 | 2019-06 | – | 1 |  |
| DIN 68800 | – | – | 8 |  |
| EN 206-1 | – | – | 1 |  |
| EN 206 | – | – | 3 |  |
| EN 206 | 2021-06 | – | 2 |  |
| EN 350-2 | – | – | 1 |  |
| EN 350 | – | – | 3 |  |
| EN 350 | 2016-12 | – | 1 |  |
| EN 1992-1-1/NA | – | – | 1 |  |
| EN 1992-1-1 | – | – | 2 |  |
| EN 1992-1-1 | 2011-01 | – | 3 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2023 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1992-1-1 | 2025-09 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 12697-12 | – | – | 1 |  |
| EN 14179 | – | – | 1 |  |
| EN ISO 12944-2 | – | – | 4 |  |
| EN ISO 12944 | – | – | 3 |  |
| EN ISO 14713 | – | – | 2 |  |
| ISO 12944 | – | – | 2 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08 (mit Hinweis): `content/dauerhaftigkeit/Dauerhaftigkeit.json › texte.maßgebendBleibenDinEn` – Maßgebend bleiben DIN EN 206:2021-06 mit DIN 1045-2:2023-08 und DIN EN 1992-1-1:2011-01 mit NA. Was…
  - 2023-08: `content/dauerhaftigkeit/Dauerhaftigkeit.json › werte.dinEn19921` – DIN EN 1992-1-1:2011-01 + NA, 4.4.1; DIN 1045-2:2023-08
  - 2023-08: `content/dauerhaftigkeit/Dauerhaftigkeit.json › werte.oktober2026Ap10` – Oktober 2026 (Expositionsklassen nach DIN 1045-2:2023-08, Betondeckung, XA-Grenzen, Korrosivität…
  - 2023-08: `content/dauerhaftigkeit/Dauerhaftigkeit.json › daten.Dauerhaftigkeit.regelwerke.0.title` – DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton – Festlegung, Eigenschaften, Her…
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01 (mit Hinweis): `content/dauerhaftigkeit/Dauerhaftigkeit.json › texte.maßgebendBleibenDinEn` – Maßgebend bleiben DIN EN 206:2021-06 mit DIN 1045-2:2023-08 und DIN EN 1992-1-1:2011-01 mit NA. Was die Neuausgaben ändern – et…
  - 2011-01: `content/dauerhaftigkeit/Dauerhaftigkeit.json › werte.dinEn19921` – DIN EN 1992-1-1:2011-01 + NA, 4.4.1; DIN 1045-2:2023-08
  - 2011-01 (mit Hinweis): `content/dauerhaftigkeit/Dauerhaftigkeit.json › daten.Dauerhaftigkeit.regelwerke.1.title` – DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA (Eurocode 2); neue…
  - 2025-09 (mit Hinweis): `content/dauerhaftigkeit/Dauerhaftigkeit.json › daten.Dauerhaftigkeit.regelwerke.1.title` – …EN 1992-1-1:2011-01 + A1:2015-03 mit NA (Eurocode 2); neue Generation DIN EN 1992-1-1:2025-09 (Deutsche Fassung EN 1992-1-1:2023; bau…
  - 2023 (mit Hinweis): `content/dauerhaftigkeit/Dauerhaftigkeit.json › daten.Dauerhaftigkeit.regelwerke.1.title` – …urocode 2); neue Generation DIN EN 1992-1-1:2025-09 (Deutsche Fassung EN 1992-1-1:2023; bauaufsichtlich noch nicht eingeführt,…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

