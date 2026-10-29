# Kennwert-Abgleich: `stahlbau_ec3`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `stahlbau_ec3` (Mechanik, geprueft)
- **Komponente:** `src/modules/StahlbauEC3.tsx`
- **Dateien (2):** `content/stahlbauec3/StahlbauEC3.json`, `src/modules/StahlbauEC3.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 1 |
| (1) Kennwerte übereinstimmend | 2 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 25 / 3 |

## 1 Kennwerte gegen zentrale Konstanten

| Fundstelle | Wert im Text | zentral | Konstante | Ausschnitt |
|---|---|---|---|---|
| `content/stahlbauec3/StahlbauEC3.json › texte.für40MmT` | 335 N/mm² | 355 | `BAUSTAHL_EC3.S355.fy` | …sind die Werte abgemindert (z. B. S235: f_y = 215 N/mm²; S355: f_y = 335 N/mm²). E = 210 000 N/mm²; γ_M0 = 1,0, γ_M1 =… |

Übereinstimmend (2): `BAUSTAHL_EC3.S235.fu` ×2

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| EN 1990 | – | – | 1 |  |
| EN 1990 | 2021-10 | – | 1 | Ausgaben uneinheitlich |
| EN 1993-1-1 | – | Gl. 6.6, Gl. 6.13, Gl. 6.47 | 15 |  |
| EN 1993-1-1 | 2010-12 | – | 2 | Ausgaben uneinheitlich |
| EN 1993-1-1 | 2025-04 | – | 2 | Ausgaben uneinheitlich; Registry 2010-12 |
| EN 1993-1-5 | – | – | 2 |  |
| EN 10025-2 | 2019-10 | – | 1 | Ausgaben uneinheitlich |
| EN 10025-3 | 2019-10 | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 10025-2:** 2004 (1×), 2019-10 (2×)
  - 2019-10: `content/stahlbauec3/StahlbauEC3.json › daten.StahlbauEC3.regelwerke.2.title` – DIN EN 10025-2:2019-10 (Warmgewalzte Erzeugnisse aus Baustähle…
- **EN 1990:** 2010-12 (2×, teils mit Hinweis auf andere Ausgabe), 2021-10 (9×, teils mit Hinweis auf andere Ausgabe), 2023 (6×, teils mit Hinweis auf andere Ausgabe)
  - 2021-10: `content/stahlbauec3/StahlbauEC3.json › daten.StahlbauEC3.regelwerke.1.title` – DIN EN 1990:2021-10 mit NA (Eurocode 0: Grundlagen der Trag…
- **EN 1993-1-1:** 2010-12 (9×, teils mit Hinweis auf andere Ausgabe), 2022 (1×, teils mit Hinweis auf andere Ausgabe), 2025-04 (12×, teils mit Hinweis auf andere Ausgabe)
  - 2025-04 (mit Hinweis): `content/stahlbauec3/StahlbauEC3.json › texte.dieZweiteEurocodeGeneration` – Die zweite Eurocode-Generation (DIN EN 1993-1-1:2025-04) ist erschienen, aber noch nicht bauauf…
  - 2010-12 (mit Hinweis): `content/stahlbauec3/StahlbauEC3.json › texte.dieZweiteEurocodeGeneration` – …hienen, aber noch nicht bauaufsichtlich eingeführt; maßgebend bleiben DIN EN 1993-1-1:2010-12 mit A1:2014-07 und NA.
  - 2010-12: `content/stahlbauec3/StahlbauEC3.json › daten.StahlbauEC3.regelwerke.0.title` – DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA (Eurocode 3, Teil 1…
  - 2025-04 (mit Hinweis): `content/stahlbauec3/StahlbauEC3.json › daten.StahlbauEC3.regelwerke.0.title` – …1; bauaufsichtlich eingeführt; 3.2, 5.5, 6.2, 6.3.1); neue Generation DIN EN 1993-1-1:2025-04

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

