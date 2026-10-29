# Kennwert-Abgleich: `korrosionsschutz_beschichtungen`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `korrosionsschutz_beschichtungen` (Dauerhaftigkeit, geprueft)
- **Komponente:** `src/modules/KorrosionsschutzBeschichtungen.tsx`
- **Dateien (2):** `content/korrosionsschutzbeschichtungen/KorrosionsschutzBeschichtungen.json`, `src/modules/KorrosionsschutzBeschichtungen.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 68 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| EN 10025 | – | – | 1 |  |
| EN ISO 1461 | – | – | 6 |  |
| EN ISO 1461 | 2022-12 | – | 3 |  |
| EN ISO 2409 | – | – | 3 |  |
| EN ISO 2409 | 2020-12 | – | 1 |  |
| EN ISO 2808 | – | – | 1 |  |
| EN ISO 4624 | – | – | 3 |  |
| EN ISO 4624 | 2023-09 | – | 2 |  |
| EN ISO 8501-1 | – | – | 4 |  |
| EN ISO 8501-1 | 2007-12 | – | 1 |  |
| EN ISO 8501 | – | – | 1 |  |
| EN ISO 8502 | – | – | 1 |  |
| EN ISO 8503 | – | – | 1 |  |
| EN ISO 9223 | – | – | 3 |  |
| EN ISO 9223 | 2012-05 | – | 5 |  |
| EN ISO 9224 | – | – | 1 |  |
| EN ISO 12944-1 | – | – | 3 |  |
| EN ISO 12944-1 | 2019-01 | – | 4 |  |
| EN ISO 12944-2 | – | – | 4 |  |
| EN ISO 12944-2 | 2018-04 | – | 1 |  |
| EN ISO 12944-3 | – | – | 1 |  |
| EN ISO 12944-4 | – | – | 1 |  |
| EN ISO 12944-5 | – | – | 5 |  |
| EN ISO 12944-5 | 2020-03 | – | 1 |  |
| EN ISO 12944-6 | – | – | 2 |  |
| EN ISO 12944-7 | – | – | 1 |  |
| EN ISO 12944 | – | – | 4 |  |
| EN ISO 14713-1 | – | – | 2 |  |
| ISO 14713-1 | 2017 | – | 1 |  |
| ISO 19840 | – | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

