# Kennwert-Abgleich: `lebenszyklus_kosten`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `lebenszyklus_kosten` (Nachhaltigkeit, geprueft)
- **Komponente:** `src/modules/LebenszyklusKosten.tsx`
- **Dateien (8):** `content/lcc/LCC.json`, `content/lebensdauern/Lebensdauern.json`, `content/lebenszykluskosten/LebenszyklusKosten.json`, `content/preisentwicklung/Preisentwicklung.json`, `src/modules/LCC.tsx`, `src/modules/Lebensdauern.tsx`, `src/modules/LebenszyklusKosten.tsx`, `src/modules/Preisentwicklung.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 31 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 18960 | – | – | 8 |  |
| EN 15643 | 2021-12 | – | 1 |  |
| EN 16627 | – | – | 2 |  |
| EN 16627 | 2015-09 | – | 4 |  |
| EN ISO 15686-1 | – | – | 1 |  |
| ISO 15686-1 | – | – | 3 |  |
| ISO 15686-1 | 2011 | – | 1 |  |
| ISO 15686-5 | – | – | 2 |  |
| ISO 15686-5 | 2017 | – | 5 |  |
| ISO 15686 | – | – | 1 |  |
| VDI 2067 | – | – | 3 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

