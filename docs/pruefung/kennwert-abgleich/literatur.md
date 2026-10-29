# Kennwert-Abgleich: `literatur`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `literatur` (Infos & Quellen, offen)
- **Komponente:** `src/modules/Literatur.tsx`
- **Dateien (2):** `content/literatur/Literatur.json`, `src/modules/Literatur.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 24 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1505-2 | – | – | 1 |  |
| DIN 4108 | – | – | 1 |  |
| DIN 4109 | – | – | 1 |  |
| DIN 18008 | – | – | 2 |  |
| DIN 68800 | – | – | 2 |  |
| EN 206 | – | – | 1 |  |
| EN 1990 | – | Anhang D | 5 |  |
| EN 1992-1-1 | – | – | 1 |  |
| EN 1993-1-4 | – | – | 1 |  |
| EN 1993 | – | – | 1 |  |
| EN 1995 | – | – | 1 |  |
| EN 1996 | – | – | 1 |  |
| EN 10025 | – | – | 1 |  |
| EN 12600 | – | – | 1 |  |
| EN ISO 690 | – | – | 1 |  |
| EN ISO 12944 | – | – | 1 |  |
| ISO 690 | – | – | 1 |  |
| ISO 690 | 2013-10 | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

