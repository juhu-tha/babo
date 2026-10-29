# Kennwert-Abgleich: `material_schaeden_gross`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `material_schaeden_gross` (Mängel & Schäden, geprueft)
- **Komponente:** `src/modules/MaterialSchaedenGross.tsx`
- **Dateien (4):** `content/materialschaedengross/MaterialSchaedenGross.json`, `content/materialschaedengross/daten.json`, `src/modules/MaterialSchaedenGross.tsx`, `src/modules/materialschaedengross/daten.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 30 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1052 | – | – | 1 |  |
| DIN 1052 | 2004 | – | 1 | Registry 2008-12 |
| DIN 1076 | – | – | 5 |  |
| DIN 1076 | 2026-01 | – | 1 |  |
| DIN 1164-10 | – | – | 2 |  |
| DIN 4123 | – | – | 2 |  |
| DIN 4227 | – | – | 1 |  |
| EN 197 | – | – | 1 |  |
| EN 301 | – | – | 1 |  |
| EN 1992-2 | – | – | 2 |  |
| EN 1995-1-1 | – | – | 2 |  |
| EN 1997-1 | – | – | 1 |  |
| EN 12620 | – | – | 2 |  |
| EN 15425 | – | – | 1 |  |
| VDI 6200 | – | – | 6 |  |
| VDI 6200 | 2010-02 | – | 1 |  |

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- DIN 1052:2004 (Registry 2008-12): `content/materialschaedengross/daten.json › werte.klebstoffeFürTragendeHolzbauteile` – …chte Hallenklimate Typ-I-Klebstoffe (MUF, PRF, 1K-PUR). Regelungen in DIN 1052:2004/2008 und im Eurocode 5 (bauaufsichtlich…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

