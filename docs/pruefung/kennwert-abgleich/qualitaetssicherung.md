# Kennwert-Abgleich: `qualitaetssicherung`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `qualitaetssicherung` (Betontechnologie, geprueft)
- **Komponente:** `src/modules/Qualitaetssicherung.tsx`
- **Dateien (10):** `content/betonbauklassen/Betonbauklassen.json`, `content/csczertifizierung/CscZertifizierung.json`, `content/konformitaetskontrolle/Konformitaetskontrolle.json`, `content/qualitaetssicherung/Qualitaetssicherung.json`, `content/qualitaetssicherunggrundlagen/QualitaetssicherungGrundlagen.json`, `src/modules/Betonbauklassen.tsx`, `src/modules/CscZertifizierung.tsx`, `src/modules/Konformitaetskontrolle.tsx`, `src/modules/Qualitaetssicherung.tsx`, `src/modules/QualitaetssicherungGrundlagen.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 4 (0) |
| (3) Normverweise / Hinweise | 75 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/CscZertifizierung.tsx:19` | `0.35` | ja | `(umweltScore * 0.35) + // Gewichtung Lehrannahme` |
| `src/modules/CscZertifizierung.tsx:20` | `0.15` | ja | `(sozialesScore * 0.15) + // Gewichtung Lehrannahme` |
| `src/modules/CscZertifizierung.tsx:22` | `0.30` | ja | `(supplyChainScore * 0.30) // Gewichtung Lehrannahme` |
| `src/modules/Konformitaetskontrolle.tsx:217` | `1.48` | ja | `requiredMean = fck + 1.48 * stdDevUsed; // Kriterium 1 stetige Herstellung, DIN EN 206, 8.2.1.3 (Faktor 1,48)` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 7 |  |
| DIN 1045-2 | 2023 | – | 1 | Ausgaben uneinheitlich |
| DIN 1045-2 | 2023-08 | – | 2 | Ausgaben uneinheitlich |
| DIN 1045-3 | – | Tab. 2 | 6 |  |
| DIN 1045-3 | 2012 | – | 2 | Registry 2023-08 |
| DIN 1045-3 | 2023 | – | 1 |  |
| DIN 1045-3 | 2023-08 | Tab. 3 | 10 |  |
| DIN 1045-100 | – | – | 14 |  |
| DIN 1045 | – | – | 5 |  |
| DIN 1045 | 2023-08 | – | 1 | Ausgaben uneinheitlich |
| EN 206 | – | Abschn. 8.2.1, Anhang B | 18 |  |
| EN 206 | 2021-06 | – | 1 |  |
| EN 1992-1-1 | – | – | 1 |  |
| EN 12390-3 | 2019-10 | – | 1 |  |
| EN 12390-13 | – | – | 1 |  |
| EN 13369 | – | – | 1 |  |
| EN 13670 | – | – | 2 |  |
| ISO 45001 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045:** 1937 (2×), 1959 (1×, teils mit Hinweis auf andere Ausgabe), 1972 (4×), 1978 (2×), 1988 (1×), 2023 (1×, teils mit Hinweis auf andere Ausgabe), 2023-08 (1×)
  - 2023-08: `content/betonbauklassen/Betonbauklassen.json › texte.wichtigesNormenUpdateDin` – Wichtiges Normen-Update (DIN 1045:2023-08)
- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023 (mit Hinweis): `content/betonbauklassen/Betonbauklassen.json › texte.dasBbqPlanungskonzeptVerknüpft` – …ton (Tragwerk & Dauerhaftigkeit nach Eurocode 2 / DIN EN 1992-1-1 und DIN 1045-2:2023) bereits in der Entwurfsphase direkt mi…
  - 2023-08: `content/betonbauklassen/Betonbauklassen.json › texte.zBC5567` – …on allein ist kein BBQ-S-Merkmal: Für C70/85 bis C100/115 gelten nach DIN 1045-2:2023-08 die Zusatzregeln der Betonklasse BK-E (…
  - 2023-08: `content/qualitaetssicherung/Qualitaetssicherung.json › daten.Qualitaetssicherung.regelwerke.0.title` – DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton – Festlegung, Eigenschaften, Her…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

