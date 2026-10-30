# Kennwert-Abgleich: `mechanische_kenngroessen`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `mechanische_kenngroessen` (Mechanik, offen)
- **Komponente:** `src/modules/MechanischeKenngroessen.tsx`
- **Dateien (16):** `content/mechanischekenngroessen/Beispiele.json`, `content/mechanischekenngroessen/Grundlagen.json`, `content/mechanischekenngroessen/KriechModellDiagramm.json`, `content/mechanischekenngroessen/KriechenSchwinden.json`, `content/mechanischekenngroessen/MechanischeKenngroessen.json`, `content/mechanischekenngroessen/Steifigkeiten.json`, `content/mechanischekenngroessen/Zugversuchsimulator.json`, `content/mechanischekenngroessen/daten.json`, `src/modules/MechanischeKenngroessen.tsx`, `src/modules/mechanischekenngroessen/Beispiele.tsx`, `src/modules/mechanischekenngroessen/Grundlagen.tsx`, `src/modules/mechanischekenngroessen/KriechModellDiagramm.tsx`, `src/modules/mechanischekenngroessen/KriechenSchwinden.tsx`, `src/modules/mechanischekenngroessen/Steifigkeiten.tsx`, `src/modules/mechanischekenngroessen/Zugversuchsimulator.tsx`, `src/modules/mechanischekenngroessen/daten.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 3 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 3 (3) |
| (3) Normverweise / Hinweise | 33 / 4 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (3): `BAUSTAHL_EC3.S235.fy` ×1, `CONCRETE['C30/37'].Ecm` ×1, `HOLZ_EN338.C24.E0mean` ×1

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/mechanischekenngroessen/KriechModellDiagramm.tsx:224` | `3.5` | – | `const maxEps = epsEl * 3.5;` |
| `src/modules/mechanischekenngroessen/Zugversuchsimulator.tsx:313` | `15` | – | `const visualDeltaL = Math.max(-50, Math.min(80, sim.deltaL_mm * 15));` |
| `src/modules/mechanischekenngroessen/Zugversuchsimulator.tsx:316` | `0.35` | – | `const visualDeltaH = -Math.sign(visualDeltaL) * Math.min(18, Math.abs(visualDeltaL) * 0.35);` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 1 |  |
| DIN 1054 | – | – | 1 |  |
| DIN 18008 | – | – | 3 |  |
| EN 1992-1-1 | – | Abs. 3.3.2 | 8 |  |
| EN 1992-1-1 | 2011-01 | – | 1 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2025-09 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1992 | – | – | 1 |  |
| EN 1993-1-1 | – | Tab. 3.1 | 2 |  |
| EN 1993-1-1 | 2010-12 | – | 1 | Ausgaben uneinheitlich |
| EN 1993-1-1 | 2025-04 | – | 1 | Ausgaben uneinheitlich; Registry 2010-12 |
| EN 1993 | – | – | 1 |  |
| EN 1995-1-1/NA | – | – | 1 |  |
| EN 1995-1-1 | – | – | 1 |  |
| EN 1995-1-1 | 2010-12 | – | 1 | Ausgaben uneinheitlich |
| EN 1995 | – | – | 1 |  |
| EN 1996-1-1/NA | – | – | 2 |  |
| EN 1996 | – | – | 1 |  |
| EN ISO 899 | – | – | 1 |  |
| EN ISO 6892-1 | – | – | 2 |  |
| EN ISO 6892-1 | 2020-06 | – | 1 |  |
| ISO 899 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01: `content/mechanischekenngroessen/MechanischeKenngroessen.json › daten.MechanischeKenngroessen.regelwerke.2.title` – DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04 (Eurocode 2…
  - 2025-09 (mit Hinweis): `content/mechanischekenngroessen/MechanischeKenngroessen.json › daten.MechanischeKenngroessen.regelwerke.2.title` – …e 2, 3.1.4 Kriechen und Schwinden, 3.3.2 Relaxation); neue Generation DIN EN 1992-1-1:2025-09
- **EN 1993-1-1:** 2010-12 (9×, teils mit Hinweis auf andere Ausgabe), 2022 (1×, teils mit Hinweis auf andere Ausgabe), 2025-04 (12×, teils mit Hinweis auf andere Ausgabe)
  - 2010-12 (mit Hinweis): `content/mechanischekenngroessen/MechanischeKenngroessen.json › daten.MechanischeKenngroessen.regelwerke.1.title` – DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA (Eurocode 3, 3.2.6…
  - 2025-04 (mit Hinweis): `content/mechanischekenngroessen/MechanischeKenngroessen.json › daten.MechanischeKenngroessen.regelwerke.1.title` – …014-07 mit NA (Eurocode 3, 3.2.6 Werkstoffkennwerte); neue Generation DIN EN 1993-1-1:2025-04
- **EN 1995-1-1:** 2010-12 (13×, teils mit Hinweis auf andere Ausgabe), 2025 (3×, teils mit Hinweis auf andere Ausgabe), 2026-09 (6×, teils mit Hinweis auf andere Ausgabe)
  - 2010-12 (mit Hinweis): `content/mechanischekenngroessen/MechanischeKenngroessen.json › daten.MechanischeKenngroessen.regelwerke.3.title` – DIN EN 1995-1-1:2010-12 + A2:2014-07 mit NA (Eurocode 5, 2.2.3…

### Dieselbe Tabelle unter verschiedenen Normteilen (app-weit)

- **EN 1993 Tab. 3.1:** -1-1 (5×: mechanische_kenngroessen, stahl); -1-2 (2×: stahl)

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

