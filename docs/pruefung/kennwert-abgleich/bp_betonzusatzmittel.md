# Kennwert-Abgleich: `bp_betonzusatzmittel`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bp_betonzusatzmittel` (Bauprodukte, geprueft)
- **Komponente:** `src/modules/BpBetonzusatzmittel.tsx`
- **Dateien (2):** `content/bpbetonzusatzmittel/BpBetonzusatzmittel.json`, `src/modules/BpBetonzusatzmittel.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 60 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 934-2 | – | – | 2 |  |
| DIN 1045-2 | – | – | 7 |  |
| DIN 1045-2 | 2023-08 | – | 2 | Ausgaben uneinheitlich |
| EN 206 | – | – | 12 |  |
| EN 447 | – | – | 1 |  |
| EN 450 | – | – | 1 |  |
| EN 480-11 | – | – | 2 |  |
| EN 480 | – | – | 1 |  |
| EN 934-2 | – | Tab. 2, Tab. 3.1, Tab. 4, Tab. 5, Tab. 6, Tab. 7, Tab. 8, Tab. 9 | 25 |  |
| EN 934-2 | 2012-08 | – | 1 |  |
| EN 934-4 | – | – | 3 |  |
| EN 934-5 | – | – | 2 |  |
| EN 13263 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008 (2×), 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (139×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/bpbetonzusatzmittel/BpBetonzusatzmittel.json › texte.istZuHochZusatzmittel` – …wiesen ist (Nachweis nach DIN EN 206/DIN 1045-2; Höchstdosierung nach DIN 1045-2:2023-08, 5.2.6 am Normtext zu prüfen – vorläufi…
  - 2023-08: `content/bpbetonzusatzmittel/BpBetonzusatzmittel.json › daten.BpBetonzusatzmittel.formeln.0.quelle` – DIN 1045-2:2023-08 / DIN EN 206

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

