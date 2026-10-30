# Kennwert-Abgleich: `stahl`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `stahl` (Baustoffe, geprueft)
- **Komponente:** `src/modules/Stahl.tsx`
- **Dateien (12):** `content/stahl/EisenKohlenstoff.json`, `content/stahl/SpannungsDehnung.json`, `content/stahl/Stahl.json`, `content/stahl/StahlWerkstoffkunde.json`, `content/stahl/Stahlsorten.json`, `content/stahl/daten.json`, `src/modules/Stahl.tsx`, `src/modules/stahl/EisenKohlenstoff.tsx`, `src/modules/stahl/SpannungsDehnung.tsx`, `src/modules/stahl/StahlWerkstoffkunde.tsx`, `src/modules/stahl/Stahlsorten.tsx`, `src/modules/stahl/daten.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 1 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 70 / 3 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (1): `GWP_LEHRWERTE.profilstahl` ×1

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 488-1 | 2009-08 | – | 1 |  |
| DIN 488-4 | – | – | 2 |  |
| DIN 488 | – | – | 9 |  |
| EN 1011-1 | – | – | 2 |  |
| EN 1090-2 | 2018-09 | – | 1 |  |
| EN 1992-1-1 | – | Anhang C | 6 |  |
| EN 1993-1-1/NA | 2026-04 | – | 1 |  |
| EN 1993-1-1 | – | Tab. 3.1 | 6 |  |
| EN 1993-1-1 | 2010-12 | – | 1 | Ausgaben uneinheitlich |
| EN 1993-1-1 | 2025-04 | – | 1 | Ausgaben uneinheitlich; Registry 2010-12 |
| EN 1993-1-2 | – | Tab. 3.1 | 3 |  |
| EN 1993-1-2 | 2010-12 | – | 1 |  |
| EN 1993-1-9 | – | – | 2 |  |
| EN 1993-1-9 | 2010-12 | – | 1 |  |
| EN 10020 | – | – | 1 |  |
| EN 10025-2 | – | – | 11 |  |
| EN 10025-2 | 2019-10 | – | 1 | Ausgaben uneinheitlich |
| EN 10025-3 | – | – | 2 |  |
| EN 10025-5 | – | – | 1 |  |
| EN 10025-6 | – | – | 3 |  |
| EN 10027-1 | – | – | 2 |  |
| EN 10027 | – | – | 1 |  |
| EN 10088-4 | – | – | 2 |  |
| EN ISO 6892-1 | – | – | 2 |  |
| EN ISO 12944-2 | – | – | 2 |  |
| EN ISO 12944 | – | – | 1 |  |
| EN ISO 17660 | – | – | 4 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 10025-2:** 2004 (1×), 2019-10 (2×)
  - 2019-10: `content/stahl/Stahl.json › daten.Stahl.regelwerke.3.title` – DIN EN 10025-2:2019-10 (Warmgewalzte Erzeugnisse aus unlegiert…
- **EN 1993-1-1:** 2010-12 (9×, teils mit Hinweis auf andere Ausgabe), 2022 (1×, teils mit Hinweis auf andere Ausgabe), 2025-04 (12×, teils mit Hinweis auf andere Ausgabe)
  - 2010-12: `content/stahl/Stahl.json › daten.Stahl.regelwerke.0.title` – DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA (Eurocode 3, Teil 1…
  - 2025-04 (mit Hinweis): `content/stahl/Stahl.json › daten.Stahl.regelwerke.0.title` – …NA (Eurocode 3, Teil 1-1; bauaufsichtlich eingeführt); 2. Generation DIN EN 1993-1-1:2025-04 mit DIN EN 1993-1-1/NA:2026-04 noch nic…

### Dieselbe Tabelle unter verschiedenen Normteilen (app-weit)

- **EN 1993 Tab. 3.1:** -1-1 (5×: mechanische_kenngroessen, stahl); -1-2 (2×: stahl)

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

