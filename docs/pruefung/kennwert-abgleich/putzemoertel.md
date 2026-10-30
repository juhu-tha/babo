# Kennwert-Abgleich: `putzemoertel`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `putzemoertel` (Baustoffe, geprueft)
- **Komponente:** `src/modules/PutzeMoertel.tsx`
- **Dateien (2):** `content/putzemoertel/PutzeMoertel.json`, `src/modules/PutzeMoertel.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 43 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1053-1 | – | – | 1 |  |
| DIN 1053 | – | – | 1 |  |
| DIN 4108-3 | – | – | 4 |  |
| DIN 4108-3 | 2024-03 | – | 1 | Ausgaben uneinheitlich |
| DIN 18533 | – | – | 1 |  |
| DIN 18550-1 | – | – | 1 |  |
| DIN 18550-1 | 2018-01 | – | 1 |  |
| DIN 18550-2 | 2018-01 | – | 1 |  |
| DIN 18550 | – | – | 1 |  |
| DIN 20000-412 | – | – | 1 |  |
| DIN 55699 | – | – | 1 |  |
| EN 197-1 | – | – | 1 |  |
| EN 998-1 | – | – | 9 |  |
| EN 998-1 | 2017-02 | – | 1 |  |
| EN 998-2 | – | – | 9 |  |
| EN 998-2 | 2017-02 | – | 1 |  |
| EN 1996 | – | – | 1 |  |
| EN 13279-1 | – | – | 1 |  |
| EN 13914-1 | – | – | 2 |  |
| EN 13914-1 | 2016-09 | – | 1 |  |
| EN 13914-2 | – | – | 1 |  |
| EN 13914-2 | 2016-09 | – | 1 |  |
| EN 13914 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 4108-3:** 2018-10 (3×), 2024-03 (17×, teils mit Hinweis auf andere Ausgabe)
  - 2024-03: `content/putzemoertel/PutzeMoertel.json › daten.PutzeMoertel.literatur.3` – DIN 4108-3:2024-03: Wärmeschutz und Energie-Einsparung in…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

