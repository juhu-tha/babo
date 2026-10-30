# Kennwert-Abgleich: `bestand_checklisten`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bestand_checklisten` (Bauen im Bestand, offen)
- **Komponente:** `src/modules/BestandChecklisten.tsx`
- **Dateien (2):** `content/bestandchecklisten/BestandChecklisten.json`, `src/modules/BestandChecklisten.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 30 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1076 | – | – | 1 |  |
| DIN 1076 | 2026-01 | – | 1 |  |
| DIN 4020 | – | – | 1 |  |
| DIN 18560 | – | – | 1 |  |
| DIN 18710-1 | – | – | 1 |  |
| EN 1990-2 | 2026 | – | 2 |  |
| EN 1990/NA | – | – | 1 |  |
| EN 1990 | – | – | 2 |  |
| EN 1996 | – | – | 1 |  |
| EN 12504-2 | – | – | 1 |  |
| EN 12504-4 | – | – | 1 |  |
| EN 13791 | – | – | 3 |  |
| EN 13791 | 2020-02 | – | 1 |  |
| EN 14629 | – | – | 2 |  |
| EN 14630 | – | – | 1 |  |
| ISO 13822 | – | – | 4 |  |
| VDI 6200 | – | – | 4 |  |
| VDI 6200 | 2010-02 | – | 1 |  |
| VDI 6202 | – | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

