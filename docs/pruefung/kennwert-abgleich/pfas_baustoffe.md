# Kennwert-Abgleich: `pfas_baustoffe`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `pfas_baustoffe` (Rückbau & Schadstoffe, geprueft)
- **Komponente:** `src/modules/PfasBaustoffe.tsx`
- **Dateien (2):** `content/pfasbaustoffe/PfasBaustoffe.json`, `src/modules/PfasBaustoffe.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 16 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 19528 | – | – | 1 |  |
| DIN 19529 | – | – | 4 |  |
| DIN 19529 | 2015-12 | – | 1 |  |
| DIN 38407-42 | – | – | 1 |  |
| DIN 38407-42 | 2011-03 | – | 1 |  |
| DIN 38409-59 | – | – | 1 |  |
| DIN 38409-59 | 2022-10 | – | 1 |  |
| DIN 38414-14 | – | – | 1 |  |
| DIN 38414-14 | 2011-08 | – | 1 |  |
| EN ISO 18127 | – | – | 1 |  |
| EN ISO 18127 | 2026-07 | – | 1 |  |
| ISO 21675 | – | – | 1 |  |
| ISO 21675 | 2019 | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

