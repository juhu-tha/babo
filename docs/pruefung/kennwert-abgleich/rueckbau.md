# Kennwert-Abgleich: `rueckbau`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `rueckbau` (Rückbau & Schadstoffe, geprueft)
- **Komponente:** `src/modules/Rueckbau.tsx`
- **Dateien (10):** `content/rueckbau/AktualitaetTab.json`, `content/rueckbau/BaustoffrecyclingTab.json`, `content/rueckbau/RechnerTab.json`, `content/rueckbau/Rueckbau.json`, `content/rueckbau/daten.json`, `src/modules/Rueckbau.tsx`, `src/modules/rueckbau/AktualitaetTab.tsx`, `src/modules/rueckbau/BaustoffrecyclingTab.tsx`, `src/modules/rueckbau/RechnerTab.tsx`, `src/modules/rueckbau/daten.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 37 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | 2023-08 | Anhang E | 1 | Ausgaben uneinheitlich |
| DIN 18007 | – | – | 4 |  |
| DIN 18007 | 2022-09 | – | 2 |  |
| DIN SPEC 91484 | – | – | 7 |  |
| DIN SPEC 91484 | 2023-09 | – | 3 |  |
| DIN SPEC 91525 | – | – | 4 |  |
| DIN SPEC 91525 | 2026-02 | – | 2 |  |
| EN 206 | – | – | 1 |  |
| VDI 6202 | – | – | 6 |  |
| VDI 6210 | – | – | 7 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08 (mit Hinweis): `content/rueckbau/daten.json › daten.baustoffRecyclingData.0.useCases.0` – …Vol.-% bei Typ 1 bzw. 35 Vol.-% bei Typ 2 je nach Expositionsklasse, DIN 1045-2:2023-08, Anhang E; ersetzt die DAfStb-Richtlini…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

