# Kennwert-Abgleich: `festbeton`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `festbeton` (Betontechnologie, geprueft)
- **Komponente:** `src/modules/Festbeton.tsx`
- **Dateien (1):** `src/modules/Festbeton.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 2 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 5 (4) |
| (3) Normverweise / Hinweise | 36 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (2): `CONCRETE['C25/30'].fck_cube` ×1, `CONCRETE['C30/37'].fcm` ×1

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Festbeton.tsx:163` | `1.05` | ja | `data: [{ x: statDisplayFck, y: 0 }, { x: statDisplayFck, y: Math.max(...yValues) * 1.05 }], // Darstellungsfaktor (Linienhöhe)` |
| `src/modules/Festbeton.tsx:255` | `206` | – | `Festigkeitsklassen für Normal- und Schwerbeton (DIN EN 206 / EC2 Tab. 3.1)` |
| `src/modules/Festbeton.tsx:311` | `28` | – | `Für Leichtbeton gelten die Bezeichnungen <strong>LC8/9</strong> bis <strong>LC80/88</strong> (z. B. LC25/28, LC30/33).` |
| `src/modules/Festbeton.tsx:311` | `33` | – | `Für Leichtbeton gelten die Bezeichnungen <strong>LC8/9</strong> bis <strong>LC80/88</strong> (z. B. LC25/28, LC30/33).` |
| `src/modules/Festbeton.tsx:401` | `0.05` | – | `f_ctd = (α_ct · f_ctk,0.05) / γ_c = ({formatDeZahl(alphaCt, 2)} · {formatDeZahl(selectedKlasse.fctk_005, 2)}) / {formatDeZahl(gammaC, 2)}` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 1 |  |
| DIN 1045-2 | 2023-08 | – | 4 | Ausgaben uneinheitlich |
| EN 206 | – | Abs. 8, Tab. 13 | 12 |  |
| EN 206 | 2021 | Tab. 14 | 1 |  |
| EN 206 | 2021-06 | – | 2 |  |
| EN 1990 | – | – | 1 |  |
| EN 1992-1-1/NA | 2013-04 | – | 1 |  |
| EN 1992-1-1 | – | Abs. 3.1.2, Abs. 3.1.6, Abschn. 11.3, Gl. 3.1, Gl. 3.2, Tab. 3.1 | 8 |  |
| EN 1992-1-1 | 2011-01 | – | 2 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2023 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1992-1-1 | 2025-09 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 12390-2 | – | Anhang NA.2 | 1 |  |
| EN 12390-3 | 2019-10 | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `src/modules/Festbeton.tsx:224` – …stigkeitsklassen nach <strong>DIN EN 206:2021-06</strong> und <strong>DIN 1045-2:2023-08</strong>,
  - 2023-08: `src/modules/Festbeton.tsx:698` – …sName="text-shiraz" /> Konformitätskriterien nach DIN EN 206 Abs. 8 / DIN 1045-2:2023-08
  - 2023-08 (mit Hinweis): `src/modules/Festbeton.tsx:904` – …sZentrum Beton: Betontechnische Daten (Stand 2022 / aktualisiert nach DIN 1045-2:2023-08)',
  - 2023-08: `src/modules/Festbeton.tsx:911` – { title: 'DIN 1045-2:2023-08 (Tragwerke aus Beton - Teil 2: Anwendun…
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01: `src/modules/Festbeton.tsx:912` – { title: 'DIN EN 1992-1-1:2011-01 mit DIN EN 1992-1-1/NA:2013-04 (Eurocod…
  - 2025-09 (mit Hinweis): `src/modules/Festbeton.tsx:913` – { title: 'DIN EN 1992-1-1:2025-09 (Eurocode 2, 2. Generation; Deutsche Fa…
  - 2023 (mit Hinweis): `src/modules/Festbeton.tsx:913` – …'DIN EN 1992-1-1:2025-09 (Eurocode 2, 2. Generation; Deutsche Fassung EN 1992-1-1:2023 – bauaufsichtlich noch nicht eingeführt…
  - 2011-01 (mit Hinweis): `src/modules/Festbeton.tsx:913` – …VV TB 2025/1 und notifizierter Entwurf MVV TB 2026/1 führen weiterhin DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04 + NA/A1:201…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

