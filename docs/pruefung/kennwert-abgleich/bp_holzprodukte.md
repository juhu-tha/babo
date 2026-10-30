# Kennwert-Abgleich: `bp_holzprodukte`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bp_holzprodukte` (Bauprodukte, geprueft)
- **Komponente:** `src/modules/BpHolzprodukte.tsx`
- **Dateien (2):** `content/bpholzprodukte/BpHolzprodukte.json`, `src/modules/BpHolzprodukte.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 28 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 68800 | – | – | 3 |  |
| EN 300 | – | – | 1 |  |
| EN 301 | – | – | 1 |  |
| EN 338 | 2016 | – | 1 |  |
| EN 1995-1-1/NA | – | – | 1 |  |
| EN 1995-1-1 | – | Abs. 6.1.6, Abs. 6.1.7, Abs. 7.2, Tab. 7.2 | 9 |  |
| EN 1995-1-1 | 2010-12 | – | 1 | Ausgaben uneinheitlich |
| EN 1995-1-1 | 2025 | – | 1 | Ausgaben uneinheitlich; Registry 2010-12 |
| EN 1995-1-1 | 2026-09 | – | 1 | Ausgaben uneinheitlich; Registry 2010-12 |
| EN 13171 | – | – | 1 |  |
| EN 13986 | – | – | 1 |  |
| EN 14080 | – | – | 1 |  |
| EN 14080 | 2013 | – | 1 |  |
| EN 14080 | 2013-09 | – | 1 |  |
| EN 15425 | – | – | 1 |  |
| EN 15497 | 2014-07 | – | 1 |  |
| EN 16351 | – | – | 1 |  |
| EN 16351 | 2025-07 | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 1995-1-1:** 2010-12 (13×, teils mit Hinweis auf andere Ausgabe), 2025 (3×, teils mit Hinweis auf andere Ausgabe), 2026-09 (6×, teils mit Hinweis auf andere Ausgabe)
  - 2010-12: `content/bpholzprodukte/BpHolzprodukte.json › daten.BpHolzprodukte.regelwerke.0.title` – DIN EN 1995-1-1:2010-12 + A2:2014-07 mit NA:2013-08 (Eurocode 5…
  - 2026-09 (mit Hinweis): `content/bpholzprodukte/BpHolzprodukte.json › daten.BpHolzprodukte.regelwerke.0.title` – …it NA:2013-08 (Eurocode 5; bauaufsichtlich eingeführt); 2. Generation DIN EN 1995-1-1:2026-09 (Deutsche Fassung EN 1995-1-1:2025, NA…
  - 2025 (mit Hinweis): `content/bpholzprodukte/BpHolzprodukte.json › daten.BpHolzprodukte.regelwerke.0.title` – …eingeführt); 2. Generation DIN EN 1995-1-1:2026-09 (Deutsche Fassung EN 1995-1-1:2025, NA noch ausstehend, nicht eingeführt)

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

