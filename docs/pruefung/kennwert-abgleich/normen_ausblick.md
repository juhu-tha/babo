# Kennwert-Abgleich: `normen_ausblick`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `normen_ausblick` (Grundlagen, geprueft)
- **Komponente:** `src/modules/NormenAusblick.tsx`
- **Dateien (2):** `content/normenausblick/NormenAusblick.json`, `src/modules/NormenAusblick.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 90 / 11 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 5 |  |
| DIN 1045-2 | 2023-08 | – | 6 | Ausgaben uneinheitlich |
| EN 206-1 | – | – | 5 |  |
| EN 206-1 | 2026 | – | 4 | Ausgaben uneinheitlich |
| EN 206-1 | 2026-07 | – | 5 | Ausgaben uneinheitlich |
| EN 206-2 | – | – | 1 |  |
| EN 206-2 | 2026-07 | – | 4 |  |
| EN 206-3 | – | – | 1 |  |
| EN 206-100 | – | – | 2 |  |
| EN 206 | – | – | 7 |  |
| EN 206 | 2021-06 | – | 7 |  |
| EN 1990 | – | – | 4 |  |
| EN 1990 | 2023 | – | 4 | Ausgaben uneinheitlich |
| EN 1992-1-1/NA | – | – | 1 |  |
| EN 1992-1-1 | 2011-01 | – | 1 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2023 | – | 5 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1992-1-1 | 2025-09 | – | 3 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1992-2 | – | – | 2 |  |
| EN 1992-3 | – | – | 2 |  |
| EN 1993-1-1 | 2010-12 | – | 1 | Ausgaben uneinheitlich |
| EN 1993-1-1 | 2022 | – | 1 | Ausgaben uneinheitlich; Registry 2010-12 |
| EN 1993-1-1 | 2025-04 | – | 3 | Ausgaben uneinheitlich; Registry 2010-12 |
| EN 1995-1-1 | 2010-12 | – | 2 | Ausgaben uneinheitlich |
| EN 1995-1-1 | 2025 | – | 1 | Ausgaben uneinheitlich; Registry 2010-12 |
| EN 1995-1-1 | 2026-09 | – | 4 | Ausgaben uneinheitlich; Registry 2010-12 |
| EN 12390-10 | – | – | 2 |  |
| EN 12390-11 | – | – | 1 |  |
| EN 12390-12 | – | – | 5 |  |
| EN 12390-12 | 2020-04 | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008 (2×), 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (139×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/normenausblick/NormenAusblick.json › texte.standOktober2026Für` – …chtlich eingeführten Ausgaben (MVV TB 2025/1): DIN EN 206:2021-06 mit DIN 1045-2:2023-08 und die Eurocodes der Ausgaben ab 2010-…
  - 2023-08: `content/normenausblick/NormenAusblick.json › texte.dieDeutschenGrenzwerteStehen` – Die deutschen Grenzwerte stehen bis auf Weiteres in DIN 1045-2:2023-08.
  - 2023-08: `content/normenausblick/NormenAusblick.json › texte.dieHeuteGeltendenGrenzwerte` – Die heute geltenden Grenzwerte nach DIN 1045-2:2023-08 und die Mindestbetondeckung nach DIN EN…
  - 2023-08: `content/normenausblick/NormenAusblick.json › werte.dinEn2062021` – DIN EN 206:2021-06 zusammen mit DIN 1045-2:2023-08
  - 2023-08 (mit Hinweis): `src/data/quiz.json › qn_normen_ausblick_1` – …tion ist bauaufsichtlich maßgebend? DIN EN 206:2021-06 zusammen mit DIN 1045-2:2023-08 Die Neuausgaben DIN EN 206-1/-2:2026-…
  - 2023-08 (mit Hinweis): `src/data/quiz.json › qn_normen_ausblick_1` – …:2026-07 sind erschienen, aber noch nicht bauaufsichtlich eingeführt. DIN 1045-2:2023-08 ist auf DIN EN 206:2021-06 abgestimmt;…
- **EN 1990:** 2010-12 (2×, teils mit Hinweis auf andere Ausgabe), 2021-10 (9×, teils mit Hinweis auf andere Ausgabe), 2023 (6×, teils mit Hinweis auf andere Ausgabe)
  - 2023: `content/normenausblick/NormenAusblick.json › texte.ec0En19902023` – EC0 – EN 1990:2023
  - 2023 (mit Hinweis): `content/normenausblick/NormenAusblick.json › werte.en19902023Erschienen` – EN 1990:2023 erschienen; die Deutsche Fassung führt…
  - 2023 (mit Hinweis): `content/normenausblick/NormenAusblick.json › daten.NormenAusblick.regelwerke.6.title` – DIN EN 1990 mit NA (1. Generation, eingeführt); EN 1990:2023 (2. Generation, DIN-Fassung angekündigt…
  - 2023 (mit Hinweis): `content/normenausblick/NormenAusblick.json › daten.NormenAusblick.weblinks.6.title` – DIN Media: DIN EN 1990 (Deutsche Fassung EN 1990:2023, vorbestellbar)
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2023 (mit Hinweis): `content/normenausblick/NormenAusblick.json › texte.dieErsteEurocodeGeneration` – …en sind aufeinander bezogen: EN 206-1:2026 wurde an die überarbeitete EN 1992-1-1:2023 angeglichen.
  - 2023: `content/normenausblick/NormenAusblick.json › texte.anhangMBestimmungenAm` – …ungsort) in die Einleitung, Anhang L in den Haupttext; Angleichung an EN 1992-1-1:2023.
  - 2023 (mit Hinweis): `content/normenausblick/NormenAusblick.json › texte.en199211` – EN 1992-1-1:2023 führt **Expositionswiderstandsklassen (…
  - 2025-09: `content/normenausblick/NormenAusblick.json › texte.ec2DinEn1992` – EC2 – DIN EN 1992-1-1:2025-09
  - 2011-01: `content/normenausblick/NormenAusblick.json › werte.dinEn19921` – DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04
  - 2025-09 (mit Hinweis): `content/normenausblick/NormenAusblick.json › werte.dinEn199212` – DIN EN 1992-1-1:2025-09 (Deutsche Fassung EN 1992-1-1:2023; ers…
  - 2023 (mit Hinweis): `content/normenausblick/NormenAusblick.json › werte.dinEn199212` – DIN EN 1992-1-1:2025-09 (Deutsche Fassung EN 1992-1-1:2023; ersetzt auch DIN EN 1992-2 und DIN EN…
  - 2025-09 (mit Hinweis): `content/normenausblick/NormenAusblick.json › werte.dinMediaDinEn3` – DIN Media: DIN EN 1992-1-1:2025-09 (Änderungsvermerk)
  - 2023: `src/data/quiz.json › qn_normen_ausblick_3` – Welche Rolle übernehmen die Expositionswiderstandsklassen (ERC) in EN 1992-1-1:2023? Sie ersetzen die Anforderungsklassen…
- **EN 1993-1-1:** 2010-12 (9×, teils mit Hinweis auf andere Ausgabe), 2022 (1×, teils mit Hinweis auf andere Ausgabe), 2025-04 (12×, teils mit Hinweis auf andere Ausgabe)
  - 2025-04: `content/normenausblick/NormenAusblick.json › texte.ec3DinEn1993` – EC3 – DIN EN 1993-1-1:2025-04
  - 2010-12: `content/normenausblick/NormenAusblick.json › werte.dinEn19931` – DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA
  - 2025-04 (mit Hinweis): `content/normenausblick/NormenAusblick.json › werte.dinEn199312` – DIN EN 1993-1-1:2025-04 (Deutsche Fassung EN 1993-1-1:2022); ne…
  - 2022 (mit Hinweis): `content/normenausblick/NormenAusblick.json › werte.dinEn199312` – DIN EN 1993-1-1:2025-04 (Deutsche Fassung EN 1993-1-1:2022); neuer NA: noch offen
  - 2025-04 (mit Hinweis): `content/normenausblick/NormenAusblick.json › werte.dinMediaDinEn5` – DIN Media: DIN EN 1993-1-1:2025-04 (Änderungsvermerk)
- **EN 1995-1-1:** 2010-12 (13×, teils mit Hinweis auf andere Ausgabe), 2025 (3×, teils mit Hinweis auf andere Ausgabe), 2026-09 (6×, teils mit Hinweis auf andere Ausgabe)
  - 2026-09: `content/normenausblick/NormenAusblick.json › texte.ec5DinEn1995` – EC5 – DIN EN 1995-1-1:2026-09
  - 2010-12: `content/normenausblick/NormenAusblick.json › werte.dinEn19951` – DIN EN 1995-1-1:2010-12 + A2:2014-07 mit NA:2013-08
  - 2026-09 (mit Hinweis): `content/normenausblick/NormenAusblick.json › werte.dinEn199512` – DIN EN 1995-1-1:2026-09 (Deutsche Fassung EN 1995-1-1:2025); NA…
  - 2025 (mit Hinweis): `content/normenausblick/NormenAusblick.json › werte.dinEn199512` – DIN EN 1995-1-1:2026-09 (Deutsche Fassung EN 1995-1-1:2025); NA ausstehend
  - 2026-09 (mit Hinweis): `content/normenausblick/NormenAusblick.json › werte.dinMediaDinEn4` – DIN Media: DIN EN 1995-1-1:2026-09 (Änderungsvermerk)
  - 2026-09 (mit Hinweis): `src/data/quiz.json › qn_normen_ausblick_7` – DIN EN 1995-1-1:2026-09 ist erschienen. Was folgt daraus für ei…
  - 2010-12: `src/data/quiz.json › qn_normen_ausblick_7` – …e alte, bauaufsichtlich eingeführt ist aber nach MVV TB 2025/1 weiter DIN EN 1995-1-1:2010-12 + A2:2014-07 mit NA:2013-08. Ein NA zur…
- **EN 206-1:** 2001 (6×), 2026 (4×, teils mit Hinweis auf andere Ausgabe), 2026-07 (5×, teils mit Hinweis auf andere Ausgabe)
  - 2026 (mit Hinweis): `content/normenausblick/NormenAusblick.json › texte.dieErsteEurocodeGeneration` – …TC 104 die Betonnorm EN 206. Beide Vorhaben sind aufeinander bezogen: EN 206-1:2026 wurde an die überarbeitete EN 1992-1-1:…
  - 2026-07: `content/normenausblick/NormenAusblick.json › texte.imJuli2026Sind` – Im Juli 2026 sind **DIN EN 206-1:2026-07** (Teil 1: Eigenschaften, Anforderungen…
  - 2026: `content/normenausblick/NormenAusblick.json › texte.imJuli2026Sind` – …e ersetzen DIN EN 206:2021-06 *teilweise*. Auf europäischer Ebene ist EN 206-1:2026 seit April 2026 veröffentlicht.
  - 2026 (mit Hinweis): `content/normenausblick/NormenAusblick.json › texte.inDeutschlandWirdDin` – …endet; dort stehen etwa die Grenzwerte je Expositionsklasse. Eine auf DIN EN 206-1:2026 abgestimmte Neufassung von DIN 1045-2 u…
  - 2026: `content/normenausblick/NormenAusblick.json › texte.eineEigeneNormEn` – …dokumente zu EN 206. Dazu passt die „Öffnung für nationale Regeln“ in EN 206-1:2026.
  - 2026-07: `content/normenausblick/NormenAusblick.json › werte.dinEn20612` – DIN EN 206-1:2026-07 und DIN EN 206-2:2026-07 (ersetzen DIN…
  - 2026-07: `content/normenausblick/NormenAusblick.json › werte.änderungenInDinEn` – Änderungen in DIN EN 206-1:2026-07
  - 2026-07 (mit Hinweis): `content/normenausblick/NormenAusblick.json › werte.dinMediaDinEn` – DIN Media: DIN EN 206-1:2026-07 (Änderungsvermerk)
  - 2026-07: `content/normenausblick/NormenAusblick.json › daten.NormenAusblick.regelwerke.1.title` – DIN EN 206-1:2026-07 (Beton – Teil 1: Eigenschaften, Anforde…

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- EN 1992-1-1:2023 (Registry 2011-01): `content/normenausblick/NormenAusblick.json › texte.anhangMBestimmungenAm` – …ungsort) in die Einleitung, Anhang L in den Haupttext; Angleichung an EN 1992-1-1:2023.
- EN 1992-1-1:2025-09 (Registry 2011-01): `content/normenausblick/NormenAusblick.json › texte.ec2DinEn1992` – EC2 – DIN EN 1992-1-1:2025-09
- EN 1995-1-1:2026-09 (Registry 2010-12): `content/normenausblick/NormenAusblick.json › texte.ec5DinEn1995` – EC5 – DIN EN 1995-1-1:2026-09
- EN 1993-1-1:2025-04 (Registry 2010-12): `content/normenausblick/NormenAusblick.json › texte.ec3DinEn1993` – EC3 – DIN EN 1993-1-1:2025-04
- EN 1992-1-1:2023 (Registry 2011-01): `src/data/quiz.json › qn_normen_ausblick_3` – Welche Rolle übernehmen die Expositionswiderstandsklassen (ERC) in EN 1992-1-1:2023? Sie ersetzen die Anforderungsklassen…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

