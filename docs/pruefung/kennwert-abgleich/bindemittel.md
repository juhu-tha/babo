# Kennwert-Abgleich: `bindemittel`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bindemittel` (Betontechnologie, offen)
- **Komponente:** `src/modules/Bindemittel.tsx`
- **Dateien (4):** `content/bindemittel/Bindemittel.json`, `content/zementchemie/Zementchemie.json`, `src/modules/Bindemittel.tsx`, `src/modules/Zementchemie.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 20 (20) |
| (3) Normverweise / Hinweise | 83 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Zementchemie.tsx:33` | `0.36` | – | `return Math.max(0, (wzRatio - 0.36 * a) / (wzRatio + 0.32)) * 100;` |
| `src/modules/Zementchemie.tsx:508` | `4.071` | – | `c3s = 4.071 * cao - 7.600 * sio2 - 6.718 * al2o3 - 1.430 * fe2o3 - 2.852 * so3;` |
| `src/modules/Zementchemie.tsx:508` | `7.600` | – | `c3s = 4.071 * cao - 7.600 * sio2 - 6.718 * al2o3 - 1.430 * fe2o3 - 2.852 * so3;` |
| `src/modules/Zementchemie.tsx:508` | `6.718` | – | `c3s = 4.071 * cao - 7.600 * sio2 - 6.718 * al2o3 - 1.430 * fe2o3 - 2.852 * so3;` |
| `src/modules/Zementchemie.tsx:508` | `1.430` | – | `c3s = 4.071 * cao - 7.600 * sio2 - 6.718 * al2o3 - 1.430 * fe2o3 - 2.852 * so3;` |
| `src/modules/Zementchemie.tsx:508` | `2.852` | – | `c3s = 4.071 * cao - 7.600 * sio2 - 6.718 * al2o3 - 1.430 * fe2o3 - 2.852 * so3;` |
| `src/modules/Zementchemie.tsx:509` | `2.867` | – | `c2s = 2.867 * sio2 - 0.7544 * c3s;` |
| `src/modules/Zementchemie.tsx:509` | `0.7544` | – | `c2s = 2.867 * sio2 - 0.7544 * c3s;` |
| `src/modules/Zementchemie.tsx:510` | `2.650` | – | `c3a = 2.650 * al2o3 - 1.692 * fe2o3;` |
| `src/modules/Zementchemie.tsx:510` | `1.692` | – | `c3a = 2.650 * al2o3 - 1.692 * fe2o3;` |
| `src/modules/Zementchemie.tsx:511` | `3.043` | – | `c4af = 3.043 * fe2o3;` |
| `src/modules/Zementchemie.tsx:513` | `4.071` | – | `c3s = 4.071 * cao - 7.600 * sio2 - 4.479 * al2o3 - 2.859 * fe2o3 - 2.852 * so3;` |
| `src/modules/Zementchemie.tsx:513` | `7.600` | – | `c3s = 4.071 * cao - 7.600 * sio2 - 4.479 * al2o3 - 2.859 * fe2o3 - 2.852 * so3;` |
| `src/modules/Zementchemie.tsx:513` | `4.479` | – | `c3s = 4.071 * cao - 7.600 * sio2 - 4.479 * al2o3 - 2.859 * fe2o3 - 2.852 * so3;` |
| `src/modules/Zementchemie.tsx:513` | `2.859` | – | `c3s = 4.071 * cao - 7.600 * sio2 - 4.479 * al2o3 - 2.859 * fe2o3 - 2.852 * so3;` |
| `src/modules/Zementchemie.tsx:513` | `2.852` | – | `c3s = 4.071 * cao - 7.600 * sio2 - 4.479 * al2o3 - 2.859 * fe2o3 - 2.852 * so3;` |
| `src/modules/Zementchemie.tsx:514` | `2.867` | – | `c2s = 2.867 * sio2 - 0.7544 * c3s;` |
| `src/modules/Zementchemie.tsx:514` | `0.7544` | – | `c2s = 2.867 * sio2 - 0.7544 * c3s;` |
| `src/modules/Zementchemie.tsx:516` | `2.100` | – | `c4af = 2.100 * al2o3 + 1.702 * fe2o3;` |
| `src/modules/Zementchemie.tsx:516` | `1.702` | – | `c4af = 2.100 * al2o3 + 1.702 * fe2o3;` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 15 |  |
| DIN 1045-2 | 2023-08 | – | 14 | Ausgaben uneinheitlich |
| DIN 1164-10 | – | – | 5 |  |
| DIN 1164-10 | 2023-02 | – | 2 |  |
| EN 196-1 | – | – | 1 |  |
| EN 197-1 | – | Tab. 7 | 10 |  |
| EN 197-1 | 2011 | – | 1 |  |
| EN 197-1 | 2011-11 | – | 13 |  |
| EN 197-5 | – | – | 7 |  |
| EN 197-5 | 2021 | – | 1 |  |
| EN 197-5 | 2021-07 | – | 3 |  |
| EN 197 | – | – | 1 |  |
| EN 206 | – | Tab. 15 | 3 |  |
| EN 450-1 | 2012-10 | – | 1 |  |
| EN 450 | – | – | 1 |  |
| EN 459 | – | – | 1 |  |
| EN 12620 | – | – | 1 |  |
| EN 13263-1 | 2009-07 | – | 1 |  |
| EN 13263 | – | – | 1 |  |
| EN 15167 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008 (2×), 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (139×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/bindemittel/Bindemittel.json › texte.normzementeNachDinEn` – Normzemente nach DIN EN 197-1 / DIN EN 197-5 & DIN 1045-2:2023-08
  - 2023-08: `content/bindemittel/Bindemittel.json › texte.din104522023` – DIN 1045-2:2023-08
  - 2023-08: `content/bindemittel/Bindemittel.json › texte.gültigerAktuellerNormenstandDin` – Gültiger aktueller Normenstand (DIN 1045-2:2023-08 & DIN EN 197-5:2021):
  - 2023-08 (mit Hinweis): `content/bindemittel/Bindemittel.json › texte.anwendungKurzfassungMaßgebendSind` – Anwendung (Kurzfassung; maßgebend sind die Anwendungstabellen der DIN 1045-2:2023-08 – vorläufig, Normprüfung ausstehend):
  - 2023-08: `content/bindemittel/Bindemittel.json › texte.flugascheDarfMitDem` – …ementgehalt und w/z-Wert angerechnet werden. In Deutschland gilt nach DIN 1045-2:2023-08 k = 1,0 für Silikastaub (s ≤ 0,11·z); i…
  - 2023-08: `content/bindemittel/Bindemittel.json › werte.dinEn1971` – DIN EN 197-1:2011-11 / DIN 1045-2:2023-08
  - 2023-08: `content/bindemittel/Bindemittel.json › werte.zulässigNachDin1045` – Zulässig nach DIN 1045-2:2023-08 für definierte Expositionsklassen (XC1–…
  - 2023-08: `content/bindemittel/Bindemittel.json › werte.dinEn1975` – DIN EN 197-5:2021-07 & DIN 1045-2:2023-08
  - 2023-08: `content/bindemittel/Bindemittel.json › werte.dinEn19752` – DIN EN 197-5:2021-07 & DIN 1045-2:2023-08
  - 2023-08: `content/bindemittel/Bindemittel.json › daten.Bindemittel.regelwerke.2.title` – DIN 1045-2:2023-08 (Tragwerke aus Beton, Stahlbeton und Sp…
  - 2023-08: `content/bindemittel/Bindemittel.json › daten.Bindemittel.formeln.0.erklaerung` – …ohlenflugasche (k_F = 0,40 bei CEM I) und Silikastaub (k_S = 1,0 nach DIN 1045-2:2023-08, s ≤ 0,11·z) auf den Zementgehalt c.
  - 2023-08: `src/modules/Bindemittel.tsx:36` – // DATENBANK DER NORMZEMENTE (DIN EN 197-1 / DIN EN 197-5 / DIN 1045-2:2023-08)
  - 2023-08 (mit Hinweis): `src/modules/Bindemittel.tsx:38` – // und Neuausgabe der aktuellen Normengeneration (DIN 1045-2:2023-08 / DIN EN 197-5)
  - 2023-08: `src/modules/Bindemittel.tsx:144` – // NEUE KLINKEREFFIZIENTE ZEMENTE (DIN EN 197-5 / DIN 1045-2:2023-08)

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

