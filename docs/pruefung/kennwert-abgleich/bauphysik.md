# Kennwert-Abgleich: `bauphysik`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bauphysik` (Bauphysik, offen)
- **Komponente:** `src/modules/Bauphysik.tsx`
- **Dateien (2):** `content/bauphysik/Bauphysik.json`, `src/modules/Bauphysik.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 6 (6) |
| (3) Normverweise / Hinweise | 43 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Bauphysik.tsx:220` | `0.163` | – | `const T = equivalentAbsorptionArea > 0.05 ? (0.163 * volume) / equivalentAbsorptionArea : 9.99;` |
| `src/modules/Bauphysik.tsx:224` | `0.32` | – | `let T_target = Math.max(0.3, 0.32 * lgV - 0.17); // A3 Unterricht/Kommunikation` |
| `src/modules/Bauphysik.tsx:226` | `0.8` | – | `let minTarget = 0.8 * T_target;` |
| `src/modules/Bauphysik.tsx:236` | `0.37` | – | `T_target = Math.max(0.3, 0.37 * lgV - 0.14); // A2 Sprache/Vortrag` |
| `src/modules/Bauphysik.tsx:238` | `0.8` | – | `minTarget = 0.8 * T_target;` |
| `src/modules/Bauphysik.tsx:305` | `0.163` | – | `return A > 0.05 ? (0.163 * volume) / A : 9.99;` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4108-2 | – | – | 9 |  |
| DIN 4108-2 | 2013-02 | – | 1 | Ausgaben uneinheitlich; Registry 2026-05 |
| DIN 4108-2 | 2026-05 | – | 2 | Ausgaben uneinheitlich |
| DIN 4108-3 | – | – | 3 |  |
| DIN 4108-3 | 2024-03 | – | 1 | Ausgaben uneinheitlich |
| DIN 4108-4 | – | – | 1 |  |
| DIN 18041 | – | – | 14 |  |
| DIN 18041 | 2016-03 | – | 4 |  |
| EN ISO 6946 | – | Anhang F, Tab. 7 | 4 |  |
| EN ISO 6946 | 2018-03 | – | 3 |  |
| EN ISO 10456 | – | Tab. 3 | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 4108-2:** 2013-02 (25×, teils mit Hinweis auf andere Ausgabe), 2026-05 (10×, teils mit Hinweis auf andere Ausgabe)
  - 2026-05: `content/bauphysik/Bauphysik.json › werte.dinEnIso6946` – DIN EN ISO 6946:2018-03; DIN 4108-2:2026-05 (§ 11 GModG nimmt weiterhin die Ausgabe…
  - 2026-05: `content/bauphysik/Bauphysik.json › daten.Bauphysik.regelwerke.0.title` – DIN 4108-2:2026-05 (Wärmeschutz – Anforderungen, Berechnun…
  - 2013-02 (mit Hinweis): `content/bauphysik/Bauphysik.json › daten.Bauphysik.regelwerke.0.title` – …Berechnungsverfahren und Hinweise für Planung und Ausführung; ersetzt DIN 4108-2:2013-02 „Mindestanforderungen an den Wärmeschut…
- **DIN 4108-3:** 2018-10 (3×), 2024-03 (17×, teils mit Hinweis auf andere Ausgabe)
  - 2024-03 (mit Hinweis): `content/bauphysik/Bauphysik.json › daten.Bauphysik.regelwerke.1.title` – DIN 4108-3:2024-03 (Klimabedingter Feuchteschutz – Periode…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

