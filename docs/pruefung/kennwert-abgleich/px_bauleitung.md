# Kennwert-Abgleich: `px_bauleitung`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `px_bauleitung` (Praxiswissen, geprueft), `px_karriere` (Praxiswissen, offen), `px_planung` (Praxiswissen, geprueft), `px_produktion` (Praxiswissen, offen)
- **Komponente:** `src/modules/Praxiswissen.tsx`
- **Dateien (2):** `content/praxiswissen/Praxiswissen.json`, `src/modules/Praxiswissen.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 89 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 9 |  |
| DIN 1045-2 | 2023-08 | Anhang E | 6 | Ausgaben uneinheitlich |
| DIN 1045-3 | – | – | 8 |  |
| DIN 1045-3 | 2023 | – | 1 |  |
| DIN 1045-3 | 2023-08 | – | 2 |  |
| DIN 1988-200 | – | – | 1 |  |
| DIN 4102-4 | – | – | 1 |  |
| DIN 4108-4 | – | – | 2 |  |
| DIN 18014 | – | – | 2 |  |
| DIN 18218 | – | – | 2 |  |
| DIN 18356 | – | – | 1 |  |
| DIN 18365 | – | – | 1 |  |
| DIN 18531 | – | – | 1 |  |
| DIN 18532 | – | – | 1 |  |
| DIN 18533-1 | – | – | 1 |  |
| DIN 18533-1 | 2026-06 | Abschn. 9 | 1 | Ausgaben uneinheitlich |
| DIN 18533 | – | – | 3 |  |
| DIN 68800-2 | – | – | 1 |  |
| DIN 68800 | – | – | 1 |  |
| EN 197-1 | – | – | 2 |  |
| EN 197-5 | – | – | 1 |  |
| EN 206 | – | – | 12 |  |
| EN 206 | 2021-06 | – | 1 |  |
| EN 933-1 | – | – | 1 |  |
| EN 1097-5 | – | – | 1 |  |
| EN 1542 | – | – | 1 |  |
| EN 1992-1-1/NA | – | – | 1 |  |
| EN 1992-1-1 | – | – | 4 |  |
| EN 1992-1-2 | – | Tab. 5.2 | 2 |  |
| EN 1995-1-1/NA | – | – | 1 |  |
| EN 12350-5 | – | – | 1 |  |
| EN 12350-7 | – | – | 1 |  |
| EN 12390-1 | – | – | 1 |  |
| EN 12390-2 | – | – | 5 |  |
| EN 12591 | – | – | 1 |  |
| EN 12620 | – | – | 1 |  |
| EN 13183-2 | – | – | 1 |  |
| EN 13501-2 | – | – | 1 |  |
| EN 13670 | – | – | 3 |  |
| EN ISO 14713 | – | – | 1 |  |
| VDI 6200 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/praxiswissen/Praxiswissen.json › daten.DATA_PLANUNG.sections.1.items.1.tip` – …ngsbauteile ohne betonangreifendes Grundwasser genügt meist XC2 (nach DIN 1045-2:2023-08 min. C16/20, w/z ≤ 0,75); nur bei Frost…
  - 2023-08: `content/praxiswissen/Praxiswissen.json › daten.DATA_PRODUKTION.sections.3.items.2.description` – …r Zumischung von rezyklierten Gesteinskörnungen (Typ 1 und Typ 2 nach DIN 1045-2:2023-08, Anhang E) zur Einhaltung der Betoneige…
  - 2023-08 (mit Hinweis): `content/praxiswissen/Praxiswissen.json › daten.DATA_PRODUKTION.sections.3.items.2.standard` – DIN 1045-2:2023-08, Anhang E (ersetzt die DAfStb-Richtlini…
  - 2023-08: `content/praxiswissen/Praxiswissen.json › daten.DATA_PRODUKTION.sections.3.items.2.tip` – …> 2 mm hängen von Typ, Expositions- und Feuchtigkeitsklasse ab (nach DIN 1045-2:2023-08, Anhang E, für Typ 1 etwa 25 bis 45 Vol…
  - 2023-08: `content/praxiswissen/Praxiswissen.json › daten.Praxiswissen.schritte_3.2.erklaerung` – Für XC4 gilt nach DIN 1045-2:2023-08 ein Höchstwert von 0,60; die Reserve is…
  - 2023-08: `content/praxiswissen/Praxiswissen.json › daten.Praxiswissen.regelwerke.1.title` – DIN EN 206:2021-06 und DIN 1045-2:2023-08 (Beton – Festlegung, Eigenschaften, Her…
- **DIN 18533-1:** 2017-07 (2×, teils mit Hinweis auf andere Ausgabe), 2026-06 (4×, teils mit Hinweis auf andere Ausgabe)
  - 2026-06: `content/praxiswissen/Praxiswissen.json › daten.DATA_PLANUNG.sections.0.items.1.tip` – …m über die Geländeoberfläche geführt. Tür- und Fensteranschlüsse nach DIN 18533-1:2026-06, Abschnitt 9: grundsätzlich h ≥ 15 cm ü…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

