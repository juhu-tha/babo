# Kennwert-Abgleich: `dpp`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `dpp` (Digitales, geprueft)
- **Komponente:** `src/modules/DppEpd.tsx`
- **Dateien (2):** `content/dppepd/DppEpd.json`, `src/modules/DppEpd.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 19 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN SPEC 91484 | – | – | 1 |  |
| DIN SPEC 91525 | – | – | 1 |  |
| EN 13225 | – | – | 1 |  |
| EN 14080 | – | – | 1 |  |
| EN 15804 | – | Tab. 4 | 9 |  |
| EN 15804 | 2022-03 | – | 3 | Ausgaben uneinheitlich |
| EN IEC 63278-1 | – | – | 1 |  |
| EN ISO 14025 | – | – | 1 |  |
| EN ISO 14040 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 15804:** 2012 (6×, teils mit Hinweis auf andere Ausgabe), 2022-03 (14×, teils mit Hinweis auf andere Ausgabe)
  - 2022-03: `content/dppepd/DppEpd.json › werte.dinEn158042022` – DIN EN 15804:2022-03
  - 2022-03: `content/dppepd/DppEpd.json › werte.dinEn1580420222` – DIN EN 15804:2022-03
  - 2022-03: `content/dppepd/DppEpd.json › daten.DppEpd.regelwerke.0.title` – DIN EN 15804:2022-03 (Umweltproduktdeklarationen – Grundrege…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

