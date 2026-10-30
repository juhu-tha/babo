# Kennwert-Abgleich: `betonkennwerte`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `betonkennwerte` (Betontechnologie, geprueft)
- **Komponente:** `src/modules/Betonkennwerte.tsx`
- **Dateien (17):** `content/betonkennwerte/Ausblick2025Tab.json`, `content/betonkennwerte/Betonkennwerte.json`, `content/betonkennwerte/Ec2ParameterSkizze.json`, `content/betonkennwerte/PraxisTab.json`, `content/betonkennwerte/RechnerTab.json`, `content/betonkennwerte/TabelleTab.json`, `content/betonkennwerte/TestTab.json`, `content/betonkennwerte/ZeitTheorieTab.json`, `src/modules/Betonkennwerte.tsx`, `src/modules/betonkennwerte/Ausblick2025Tab.tsx`, `src/modules/betonkennwerte/Ec2ParameterSkizze.tsx`, `src/modules/betonkennwerte/PraxisTab.tsx`, `src/modules/betonkennwerte/RechnerTab.tsx`, `src/modules/betonkennwerte/TabelleTab.tsx`, `src/modules/betonkennwerte/TestTab.tsx`, `src/modules/betonkennwerte/ZeitTheorieTab.tsx`, `src/modules/betonkennwerte/daten.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 1 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 32 / 3 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (1): `CONCRETE['C30/37'].fcm` ×1

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-1 | – | – | 2 |  |
| DIN 1045-2 | 2023-08 | – | 1 | Ausgaben uneinheitlich |
| EN 206 | 2021-06 | – | 1 |  |
| EN 1992-1-1/NA | – | – | 2 |  |
| EN 1992-1-1/NA | 2013-04 | – | 2 |  |
| EN 1992-1-1 | – | Abs. 3.1.2, Abs. 3.1.4, Abs. 7.3.2, Abs. 7.4.3, Gl. 3.7, Tab. 3.1 | 14 |  |
| EN 1992-1-1 | 2011-01 | Abschn. 3.1.4 | 4 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2023 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1992-1-1 | 2025-09 | – | 2 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 13791 | – | – | 1 |  |
| EN 13791 | 2020-02 | – | 2 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008 (2×), 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (139×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/betonkennwerte/Betonkennwerte.json › daten.Betonkennwerte.regelwerke.3.title` – DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton - Festlegung, Eigenschaften, Her…
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2025-09 (mit Hinweis): `content/betonkennwerte/Ausblick2025Tab.json › texte.abschnitt8WesentlicheNeuerungen` – Abschnitt 8: Wesentliche Neuerungen in Eurocode 2 der 2. Generation (DIN EN 1992-1-1:2025-09)
  - 2011-01: `content/betonkennwerte/Betonkennwerte.json › daten.Betonkennwerte.regelwerke.0.title` – DIN EN 1992-1-1:2011-01 / A1:2015-03 (Eurocode 2: Bemessung und…
  - 2025-09: `content/betonkennwerte/Betonkennwerte.json › daten.Betonkennwerte.regelwerke.2.title` – DIN EN 1992-1-1:2025-09 (Eurocode 2 - Bemessung und Konstruktio…
  - 2023 (mit Hinweis): `content/betonkennwerte/Betonkennwerte.json › daten.Betonkennwerte.regelwerke.2.title` – …Spannbetontragwerken - Teil 1-1: Allgemeine Regeln; Deutsche Fassung EN 1992-1-1:2023; 2. Generation, bauaufsichtlich noch ni…
  - 2011-01: `content/betonkennwerte/RechnerTab.json › werte.dinEn19921` – DIN EN 1992-1-1:2011-01 (Abschnitt 3.1.4 & Anhang B)
  - 2011-01: `src/modules/Betonkennwerte.tsx:64` – // (DIN EN 1992-1-1:2011-01 in Verbindung mit DIN EN 1992-1-1/NA:20…
  - 2011-01: `src/modules/betonkennwerte/daten.ts:5` – // (DIN EN 1992-1-1:2011-01 & NA:2013-04)

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- EN 1992-1-1:2025-09 (Registry 2011-01): `content/betonkennwerte/Betonkennwerte.json › daten.Betonkennwerte.regelwerke.2.title` – DIN EN 1992-1-1:2025-09 (Eurocode 2 - Bemessung und Konstruktio…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

