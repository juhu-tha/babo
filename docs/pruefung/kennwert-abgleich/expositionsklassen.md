# Kennwert-Abgleich: `expositionsklassen`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `expositionsklassen` (Betontechnologie, offen)
- **Komponente:** `src/modules/Expositionsklassen.tsx`
- **Dateien (6):** `content/expositionsklassen/Expositionsklassen.json`, `content/expositionsklassen/ExpositionsklassenSkizze.json`, `content/expositionsklassen/daten.json`, `src/modules/Expositionsklassen.tsx`, `src/modules/expositionsklassen/ExpositionsklassenSkizze.tsx`, `src/modules/expositionsklassen/daten.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 1 (1) |
| (3) Normverweise / Hinweise | 105 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/expositionsklassen/ExpositionsklassenSkizze.tsx:240` | `20` | – | `c_nom = 20 mm &bull; min. C16/20` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | Anhang D, Tab. F.2.1, Tab. F.2.2 | 42 |  |
| DIN 1045-2 | 2023-08 | Tab. F.2.1 | 7 | Ausgaben uneinheitlich |
| DIN 1100 | – | – | 3 |  |
| DIN 1164-10 | – | – | 2 |  |
| DIN 18531 | – | – | 2 |  |
| DIN 38404-10 | – | – | 1 |  |
| DIN 38405-5 | – | – | 1 |  |
| DIN 38406-5 | – | – | 1 |  |
| DIN CEN/TS 12390-9 | – | – | 1 |  |
| EN 196-2 | – | – | 2 |  |
| EN 197-1 | – | – | 1 |  |
| EN 206 | – | Tab. 2 | 13 |  |
| EN 206 | 2021-06 | Abschn. 5.2.5.2, Tab. 2 | 4 |  |
| EN 450-1 | – | – | 1 |  |
| EN 480-11 | – | – | 1 |  |
| EN 1992-1-1/NA | – | Tab. 4.4DE | 7 |  |
| EN 1992-1-1/NA | 2013-04 | Tab. 4.4DE | 1 |  |
| EN 1992-1-1 | – | – | 8 |  |
| EN 1992-1-1 | 2011-01 | – | 1 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2025-09 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 12350-7 | – | – | 1 |  |
| EN 13263-1 | – | – | 1 |  |
| EN 14630 | – | – | 1 |  |
| EN ISO 7980 | – | – | 1 |  |
| EN ISO 10523 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/expositionsklassen/Expositionsklassen.json › texte.din104522023` – DIN 1045-2:2023-08 (Tab. F.2.1/F.2.2)
  - 2023-08: `content/expositionsklassen/Expositionsklassen.json › werte.dinEn2062021` – DIN EN 206:2021-06 (Abschnitt 5.2.5.2) & DIN 1045-2:2023-08
  - 2023-08: `content/expositionsklassen/Expositionsklassen.json › daten.Expositionsklassen.regelwerke.1.title` – DIN 1045-2:2023-08 (Tragwerke aus Beton, Stahlbeton und Sp…
  - 2023-08: `content/expositionsklassen/daten.json › werte.beiLuftporenbetonZB` – …itiger XF-Anforderung) ist eine Festigkeitsklasse niedriger zulässig (DIN 1045-2:2023-08, Fußnote zu Tab. F.1; LP-Beton = Betonk…
  - 2023-08: `content/expositionsklassen/daten.json › werte.fürBefahreneParkdecksRissvermeidende` – …ch TR Instandhaltung) und Instandhaltungsplan nach TR Instandhaltung (DIN 1045-2:2023-08).
  - 2023-08: `content/expositionsklassen/daten.json › werte.beiSo600Mg` – …Boden: SR-Zement; bis 1500 mg/l alternativ Zement-Flugasche-Gemisch (DIN 1045-2:2023-08; Flugascheanteil an z + f ≥ 30 % bzw. ≥…
  - 2023-08: `src/modules/expositionsklassen/daten.ts:5` – // NORMATIVE DATENBANK: DIN EN 206:2021-06 & DIN 1045-2:2023-08 (Tab. F.2.1/F.2.2)
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01 (mit Hinweis): `content/expositionsklassen/Expositionsklassen.json › daten.Expositionsklassen.regelwerke.2.title` – DIN EN 1992-1-1:2011-01 + NA:2013-04 (Eurocode 2); Neuausgabe D…
  - 2025-09 (mit Hinweis): `content/expositionsklassen/Expositionsklassen.json › daten.Expositionsklassen.regelwerke.2.title` – DIN EN 1992-1-1:2011-01 + NA:2013-04 (Eurocode 2); Neuausgabe DIN EN 1992-1-1:2025-09 – Übergangsregeln beachten

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

