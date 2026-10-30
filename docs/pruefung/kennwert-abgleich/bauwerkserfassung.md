# Kennwert-Abgleich: `bauwerkserfassung`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bauwerkserfassung` (Bauen im Bestand, geprueft)
- **Komponente:** `src/modules/Bauwerkserfassung.tsx`
- **Dateien (2):** `content/bauwerkserfassung/Bauwerkserfassung.json`, `src/modules/Bauwerkserfassung.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 15 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 18202 | – | Tab. 3 | 4 |  |
| DIN 18710-1 | 2025-08 | – | 1 |  |
| DIN 18710 | – | – | 1 |  |
| EN 338 | 2016 | – | 1 |  |
| EN 1995-1-1 | – | – | 5 |  |
| EN 1995-1-1 | 2010-12 | – | 3 | Ausgaben uneinheitlich |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 1995-1-1:** 2010-12 (13×, teils mit Hinweis auf andere Ausgabe), 2025 (3×, teils mit Hinweis auf andere Ausgabe), 2026-09 (6×, teils mit Hinweis auf andere Ausgabe)
  - 2010-12: `content/bauwerkserfassung/Bauwerkserfassung.json › werte.dinEn19951` – DIN EN 1995-1-1:2010-12 mit NA, 6.1.6
  - 2010-12: `content/bauwerkserfassung/Bauwerkserfassung.json › werte.dinEn199512` – DIN EN 1995-1-1:2010-12, 6.3.2, Gl. (6.21) und (6.23)
  - 2010-12: `content/bauwerkserfassung/Bauwerkserfassung.json › daten.Bauwerkserfassung.regelwerke.1.title` – DIN EN 1995-1-1:2010-12 + A2:2014-07 mit NA (Eurocode 5)

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

