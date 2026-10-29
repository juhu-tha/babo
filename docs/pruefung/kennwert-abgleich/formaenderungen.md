# Kennwert-Abgleich: `formaenderungen`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `formaenderungen` (Mechanik, geprueft)
- **Komponente:** `src/modules/Formaenderungen.tsx`
- **Dateien (4):** `content/formaenderungen/Biegelinie.json`, `content/formaenderungen/Formaenderungen.json`, `src/modules/Formaenderungen.tsx`, `src/modules/formaenderungen/Biegelinie.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 1 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 10 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (1): `CONCRETE['C30/37'].Ecm` ×1

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| EN 1992-1-1 | – | Abs. 3.1.4, Bild 3.1, Gl. 3.6 | 7 |  |
| EN 1992-1-1 | 2011-01 | – | 1 | Ausgaben uneinheitlich |
| EN 12390-16 | – | – | 1 |  |
| EN 12390-16 | 2019 | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01: `content/formaenderungen/Formaenderungen.json › daten.Formaenderungen.regelwerke.0.title` – DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA (3.1.4 und Anhang B…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

