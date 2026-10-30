# Kennwert-Abgleich: `feuchteschutz`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `feuchteschutz` (Bauphysik, offen)
- **Komponente:** `src/modules/Feuchteschutz.tsx`
- **Dateien (2):** `content/feuchteschutz/Feuchteschutz.json`, `src/modules/Feuchteschutz.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 4 (4) |
| (3) Normverweise / Hinweise | 37 / 6 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Feuchteschutz.tsx:93` | `461.5` | – | `return (p / (461.5 * T_kelvin)) * 1000;` |
| `src/modules/Feuchteschutz.tsx:108` | `0.8` | – | `const p_schimmel_limit = p_act / 0.8;` |
| `src/modules/Feuchteschutz.tsx:268` | `610.5` | – | `const l = Math.log(p / 610.5);` |
| `src/modules/Feuchteschutz.tsx:435` | `0.8` | – | `formel: 'p_{sat} = \\frac{${tex(indoorClimate.p_act, 1)}}{0{,}8} = ${tex(indoorClimate.p_act / 0.8, 1)}\\,\\text{Pa} \\;\\Rightarrow\\; \\th` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4108-2 | – | – | 3 |  |
| DIN 4108-2 | 2013-02 | – | 2 | Ausgaben uneinheitlich; Registry 2026-05 |
| DIN 4108-2 | 2026-05 | – | 1 | Ausgaben uneinheitlich |
| DIN 4108-3 | – | – | 14 |  |
| DIN 4108-3 | 2018-10 | – | 3 | Ausgaben uneinheitlich; Registry 2024-03 |
| DIN 4108-3 | 2024-03 | – | 6 | Ausgaben uneinheitlich |
| DIN 4108-4 | 2020-11 | – | 2 |  |
| EN 15026 | – | – | 2 |  |
| EN ISO 13788 | – | – | 1 |  |
| EN ISO 13788 | 2013-05 | – | 3 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 4108-2:** 2013-02 (25×, teils mit Hinweis auf andere Ausgabe), 2026-05 (10×, teils mit Hinweis auf andere Ausgabe)
  - 2013-02: `content/feuchteschutz/Feuchteschutz.json › werte.din410832024` – …024-03 (Magnus-Formel); DIN 4108-2 (80-%-Kriterium); § 11 GModG nimmt DIN 4108-2:2013-02 und DIN 4108-3:2018-10 in Bezug
  - 2026-05: `content/feuchteschutz/Feuchteschutz.json › daten.Feuchteschutz.regelwerke.2.title` – DIN 4108-2:2026-05 (Wärmeschutz – Anforderungen, Berechnun…
  - 2013-02 (mit Hinweis): `content/feuchteschutz/Feuchteschutz.json › daten.Feuchteschutz.regelwerke.2.title` – …Berechnungsverfahren und Hinweise für Planung und Ausführung; ersetzt DIN 4108-2:2013-02 „Mindestanforderungen an den Wärmeschut…
- **DIN 4108-3:** 2018-10 (3×), 2024-03 (17×, teils mit Hinweis auf andere Ausgabe)
  - 2024-03: `content/feuchteschutz/Feuchteschutz.json › texte.klassischesGlaserKlima90` – …r Tauwasserzone. Werte aus öffentlichen Sekundärquellen, Abgleich mit DIN 4108-3:2024-03 offen (vorläufig).
  - 2024-03: `content/feuchteschutz/Feuchteschutz.json › werte.din410832024` – DIN 4108-3:2024-03 (Magnus-Formel); DIN 4108-2 (80-%-Krite…
  - 2018-10: `content/feuchteschutz/Feuchteschutz.json › werte.din410832024` – …DIN 4108-2 (80-%-Kriterium); § 11 GModG nimmt DIN 4108-2:2013-02 und DIN 4108-3:2018-10 in Bezug
  - 2024-03: `content/feuchteschutz/Feuchteschutz.json › werte.din4108320242` – DIN 4108-3:2024-03; DIN EN ISO 13788:2013-05
  - 2024-03: `content/feuchteschutz/Feuchteschutz.json › werte.bemessungswerteNachDin4108` – Bemessungswerte nach DIN 4108-4:2020-11; Nachweisfreiheit nach DIN 4108-3:2024-03
  - 2024-03: `content/feuchteschutz/Feuchteschutz.json › daten.Feuchteschutz.regelwerke.0.title` – DIN 4108-3:2024-03 (Wärmeschutz und Energie-Einsparung in…
  - 2024-03: `content/feuchteschutz/Feuchteschutz.json › daten.Feuchteschutz.formeln.1.quelle` – DIN 4108-3:2024-03; DIN EN ISO 13788:2013-05
  - 2018-10: `content/feuchteschutz/Feuchteschutz.json › daten.Feuchteschutz.formeln.2.quelle` – DIN 4108-3:2018-10; Rechenkern src/calc/glaser.ts
  - 2018-10: `content/feuchteschutz/Feuchteschutz.json › daten.Feuchteschutz.formeln.3.quelle` – DIN 4108-3:2018-10 (öffentliche Wiedergabe: ubakus.de, Bau…

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- DIN 4108-2:2013-02 (Registry 2026-05): `content/feuchteschutz/Feuchteschutz.json › werte.din410832024` – …024-03 (Magnus-Formel); DIN 4108-2 (80-%-Kriterium); § 11 GModG nimmt DIN 4108-2:2013-02 und DIN 4108-3:2018-10 in Bezug
- DIN 4108-3:2018-10 (Registry 2024-03): `content/feuchteschutz/Feuchteschutz.json › werte.din410832024` – …DIN 4108-2 (80-%-Kriterium); § 11 GModG nimmt DIN 4108-2:2013-02 und DIN 4108-3:2018-10 in Bezug
- DIN 4108-3:2018-10 (Registry 2024-03): `content/feuchteschutz/Feuchteschutz.json › daten.Feuchteschutz.formeln.2.quelle` – DIN 4108-3:2018-10; Rechenkern src/calc/glaser.ts
- DIN 4108-3:2018-10 (Registry 2024-03): `content/feuchteschutz/Feuchteschutz.json › daten.Feuchteschutz.formeln.3.quelle` – DIN 4108-3:2018-10 (öffentliche Wiedergabe: ubakus.de, Bau…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

