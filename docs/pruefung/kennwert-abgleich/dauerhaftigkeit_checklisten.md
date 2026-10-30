# Kennwert-Abgleich: `dauerhaftigkeit_checklisten`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `dauerhaftigkeit_checklisten` (Dauerhaftigkeit, offen)
- **Komponente:** `src/modules/DauerhaftigkeitChecklisten.tsx`
- **Dateien (2):** `content/dauerhaftigkeitchecklisten/DauerhaftigkeitChecklisten.json`, `src/modules/DauerhaftigkeitChecklisten.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 27 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | Tab. F.2.1 | 6 |  |
| DIN 1045-2 | 2023-08 | Tab. F.2.1 | 3 | Ausgaben uneinheitlich |
| DIN 1045-3 | – | – | 1 |  |
| EN 206 | – | – | 2 |  |
| EN 206 | 2021-06 | – | 2 |  |
| EN 1992-1-1/NA | – | Tab. 7.1DE | 2 |  |
| EN 1992-1-1 | – | Abs. 7.3.2 | 5 |  |
| EN 1992-1-1 | 2011-01 | – | 1 | Ausgaben uneinheitlich |
| EN 1992 | – | – | 1 |  |
| EN 10080 | – | – | 1 |  |
| EN 12350-7 | – | – | 2 |  |
| EN 13670 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008 (2×), 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (139×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/dauerhaftigkeitchecklisten/DauerhaftigkeitChecklisten.json › werte.din104522023` – DIN 1045-2:2023-08, Tab. F.2.1/F.2.2
  - 2023-08: `content/dauerhaftigkeitchecklisten/DauerhaftigkeitChecklisten.json › werte.din1045220232` – DIN 1045-2:2023-08; DIN EN 206:2021-06
  - 2023-08: `content/dauerhaftigkeitchecklisten/DauerhaftigkeitChecklisten.json › daten.DauerhaftigkeitChecklisten.regelwerke.2.title` – DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton – Festlegung und Konformität)
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01: `content/dauerhaftigkeitchecklisten/DauerhaftigkeitChecklisten.json › daten.DauerhaftigkeitChecklisten.regelwerke.0.title` – DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA (Eurocode 2)

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

