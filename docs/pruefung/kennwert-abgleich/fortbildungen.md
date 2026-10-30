# Kennwert-Abgleich: `fortbildungen`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `fortbildungen` (Infos & Quellen, offen)
- **Komponente:** `src/modules/Fortbildungen.tsx`
- **Dateien (2):** `content/fortbildungen/Fortbildungen.json`, `src/modules/Fortbildungen.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 43 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-3 | 2012 | – | 2 | Registry 2023-08 |
| DIN 1045-3 | 2023-08 | – | 1 |  |
| DIN 1076 | – | – | 1 |  |
| DIN 1946-6 | – | – | 1 |  |
| DIN 18349 | – | – | 1 |  |
| DIN 18531 | – | – | 1 |  |
| DIN 18533 | – | – | 4 |  |
| DIN 18535 | – | – | 1 |  |
| DIN 18551 | – | – | 1 |  |
| DIN 68800-4 | – | – | 4 |  |
| DIN 68800 | – | – | 1 |  |
| EN 1090 | – | – | 5 |  |
| EN 1504-5 | – | – | 1 |  |
| EN 1996 | – | – | 1 |  |
| EN 14487 | – | – | 1 |  |
| EN ISO 9712 | – | – | 4 |  |
| EN ISO 12696 | – | – | 3 |  |
| EN ISO 14731 | – | – | 1 |  |
| EN ISO 15257 | – | – | 2 |  |
| ISO 9712 | – | – | 1 |  |
| ISO 14731 | – | – | 1 |  |
| ISO 15257 | – | – | 2 |  |
| ISO 17024 | – | – | 3 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

