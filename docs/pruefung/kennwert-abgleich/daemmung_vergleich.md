# Kennwert-Abgleich: `daemmung_vergleich`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `daemmung_vergleich` (Bauphysik, geprueft)
- **Komponente:** `src/modules/DaemmungVergleich.tsx`
- **Dateien (2):** `content/daemmungvergleich/DaemmungVergleich.json`, `src/modules/DaemmungVergleich.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 14 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4108-2 | – | – | 2 |  |
| DIN 4108-2 | 2013-02 | – | 2 | Ausgaben uneinheitlich; Registry 2026-05 |
| DIN 4108-3 | – | – | 2 |  |
| DIN 4108-3 | 2024-03 | – | 1 | Ausgaben uneinheitlich |
| EN 15026 | – | – | 3 |  |
| EN ISO 6946 | – | – | 1 |  |
| EN ISO 6946 | 2018-03 | – | 1 |  |
| EN ISO 10211 | – | – | 1 |  |
| EN ISO 13788 | 2013-05 | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 4108-2:** 2013-02 (25×, teils mit Hinweis auf andere Ausgabe), 2026-05 (10×, teils mit Hinweis auf andere Ausgabe)
  - 2013-02 (mit Hinweis): `content/daemmungvergleich/DaemmungVergleich.json › werte.din410822013` – DIN 4108-2:2013-02 (Neuausgabe 2026-05 manuell abgleichen)…
  - 2013-02 (mit Hinweis): `content/daemmungvergleich/DaemmungVergleich.json › daten.DaemmungVergleich.formeln.1.quelle` – DIN 4108-2:2013-02 (Neuausgabe 2026-05 – Änderungen manuel…
- **DIN 4108-3:** 2018-10 (3×), 2024-03 (17×, teils mit Hinweis auf andere Ausgabe)
  - 2024-03: `content/daemmungvergleich/DaemmungVergleich.json › daten.DaemmungVergleich.regelwerke.0.title` – DIN 4108-3:2024-03 (Klimabedingter Feuchteschutz – Anforde…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

