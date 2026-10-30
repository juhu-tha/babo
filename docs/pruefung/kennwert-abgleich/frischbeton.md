# Kennwert-Abgleich: `frischbeton`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `frischbeton` (Betontechnologie, offen)
- **Komponente:** `src/modules/Frischbeton.tsx`
- **Dateien (8):** `content/ausbreitversuch/Ausbreitversuch.json`, `content/frischbeton/Frischbeton.json`, `content/frischbetondruck/Frischbetondruck.json`, `content/frischbetontemperatur/Frischbetontemperatur.json`, `src/modules/Ausbreitversuch.tsx`, `src/modules/Frischbeton.tsx`, `src/modules/Frischbetondruck.tsx`, `src/modules/Frischbetontemperatur.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 16 (15) |
| (3) Normverweise / Hinweise | 72 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Ausbreitversuch.tsx:68` | `200` | – | `setAusbreitmass(200 + (targetMass - 200) * easedT);` |
| `src/modules/Ausbreitversuch.tsx:224` | `0.15` | – | `const rx = d * 0.15;` |
| `src/modules/Ausbreitversuch.tsx:269` | `1.5` | – | `transform: 'translateY(-${progress * 1.5}px)',` |
| `src/modules/Frischbetondruck.tsx:45` | `0.077` | ja | `const K1 = 1 + 0.077 * (tE_eff - 5);` |
| `src/modules/Frischbetondruck.tsx:54` | `21` | – | `case 'F1': sigma_hk_max = Math.max(gamma, (5 * v + 21) * K1 * (gamma/25)); break;` |
| `src/modules/Frischbetondruck.tsx:54` | `25` | – | `case 'F1': sigma_hk_max = Math.max(gamma, (5 * v + 21) * K1 * (gamma/25)); break;` |
| `src/modules/Frischbetondruck.tsx:55` | `19` | – | `case 'F2': sigma_hk_max = Math.max(gamma, (10 * v + 19) * K1 * (gamma/25)); break;` |
| `src/modules/Frischbetondruck.tsx:55` | `25` | – | `case 'F2': sigma_hk_max = Math.max(gamma, (10 * v + 19) * K1 * (gamma/25)); break;` |
| `src/modules/Frischbetondruck.tsx:56` | `14` | – | `case 'F3': sigma_hk_max = Math.max(gamma, (14 * v + 18) * K1 * (gamma/25)); break;` |
| `src/modules/Frischbetondruck.tsx:56` | `18` | – | `case 'F3': sigma_hk_max = Math.max(gamma, (14 * v + 18) * K1 * (gamma/25)); break;` |
| `src/modules/Frischbetondruck.tsx:56` | `25` | – | `case 'F3': sigma_hk_max = Math.max(gamma, (14 * v + 18) * K1 * (gamma/25)); break;` |
| `src/modules/Frischbetondruck.tsx:57` | `17` | – | `case 'F4': sigma_hk_max = Math.max(gamma, (17 * v + 17) * K1 * (gamma/25)); break;` |
| `src/modules/Frischbetondruck.tsx:57` | `25` | – | `case 'F4': sigma_hk_max = Math.max(gamma, (17 * v + 17) * K1 * (gamma/25)); break;` |
| `src/modules/Frischbetondruck.tsx:58` | `30` | – | `case 'F5': sigma_hk_max = Math.max(30 * (gamma/25), (25 + 34 * v * K1) * (gamma/25)); break;` |
| `src/modules/Frischbetondruck.tsx:58` | `25` | – | `case 'F5': sigma_hk_max = Math.max(30 * (gamma/25), (25 + 34 * v * K1) * (gamma/25)); break;` |
| `src/modules/Frischbetondruck.tsx:58` | `34` | – | `case 'F5': sigma_hk_max = Math.max(30 * (gamma/25), (25 + 34 * v * K1) * (gamma/25)); break;` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | Tab. F.2.2 | 4 |  |
| DIN 1045-2 | 2023-08 | Tab. F.2.2 | 10 | Ausgaben uneinheitlich |
| DIN 1045-3 | – | – | 2 |  |
| DIN 18216 | – | – | 1 |  |
| DIN 18218 | – | – | 9 |  |
| DIN 18218 | 2010-01 | – | 4 |  |
| EN 206 | – | Abs. 7.5, Tab. 21 | 11 |  |
| EN 206 | 2021 | Tab. 21 | 1 |  |
| EN 206 | 2021-06 | – | 2 |  |
| EN 480-11 | – | – | 1 |  |
| EN 934-2 | – | – | 1 |  |
| EN 12350-1 | – | – | 2 |  |
| EN 12350-2 | – | – | 2 |  |
| EN 12350-4 | – | – | 2 |  |
| EN 12350-5 | – | – | 5 |  |
| EN 12350-6 | – | – | 5 |  |
| EN 12350-7 | – | – | 6 |  |
| EN 12350-8 | – | – | 3 |  |
| EN 13670 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/frischbeton/Frischbeton.json › texte.vollständigePrüfungKonsistenzklassifizie` – …nzklassifizierung, Toleranzabgleich nach **DIN EN 206:2021-06** und **DIN 1045-2:2023-08**, Luftporen- und Rohdichtebestimmung n…
  - 2023-08: `content/frischbeton/Frischbeton.json › texte.konsistenzbereicheNachDinEn` – Konsistenzbereiche nach DIN EN 206 / DIN 1045-2:2023-08
  - 2023-08: `content/frischbeton/Frischbeton.json › texte.zulässigeGrenzabmaßeFürZielwerte` – Zulässige Grenzabmaße für Zielwerte (DIN EN 206 / DIN 1045-2:2023-08)
  - 2023-08 (mit Hinweis): `content/frischbeton/Frischbeton.json › texte.mindestluftgehalteNachDin1045` – Mindestluftgehalte nach DIN 1045-2:2023-08 Tab. F.2.2
  - 2023-08: `content/frischbeton/Frischbeton.json › werte.anforderungNachDin1045` – Anforderung nach DIN 1045-2:2023-08 Tab. F.2.2 erfüllt. Frost-Tausalz-Wider…
  - 2023-08 (mit Hinweis): `content/frischbeton/Frischbeton.json › daten.Frischbeton.literatur.0` – …sZentrum Beton: Betontechnische Daten (Stand 2022 / aktualisiert nach DIN 1045-2:2023-08)
  - 2023-08: `content/frischbeton/Frischbeton.json › daten.Frischbeton.regelwerke.1.title` – DIN 1045-2:2023-08 (Tragwerke aus Beton, Stahlbeton und Sp…
  - 2023-08: `src/modules/Frischbeton.tsx:30` – // State für Grenzabmaß-Prüfer (DIN EN 206 Tab. 21 / DIN 1045-2:2023-08)
  - 2023-08: `src/modules/Frischbeton.tsx:35` – // State für Luftporen- & Rohdichterechner (DIN EN 12350-7 / -6 / DIN 1045-2:2023-08)
  - 2023-08: `src/modules/Frischbeton.tsx:44` – …rechnung der zulässigen Grenzabmaße nach DIN EN 206:2021 Tabelle 21 / DIN 1045-2:2023-08

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

