# Kennwert-Abgleich: `keramik_ziegel`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `keramik_ziegel` (Baustoffe, geprueft)
- **Komponente:** `src/modules/KeramikZiegel.tsx`
- **Dateien (2):** `content/keramikziegel/KeramikZiegel.json`, `src/modules/KeramikZiegel.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 1 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 77 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

### GWP- und Transportwerte ohne zentrale Zuordnung (Quelle im Modul prüfen)

| Fundstelle | Wert | Ausschnitt |
|---|---|---|
| `src/modules/KeramikZiegel.tsx:447` | 0,44 kg CO₂ je kg | …<BlockMath math="CaCO_3 \rightarrow CaO + CO₂: \quad \frac{44}{100} = 0,44 kg CO₂ je kg CaCO_3" /></div> |

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 105-4 | – | – | 2 |  |
| DIN 105-4 | 2019-01 | – | 3 |  |
| DIN 105-41 | – | – | 1 |  |
| DIN 105-41 | 2019-01 | – | 1 |  |
| DIN 105-100 | – | – | 1 |  |
| DIN 105-100 | 2012-01 | – | 2 |  |
| DIN 1045-2 | – | – | 1 |  |
| DIN 4108-4 | – | – | 1 |  |
| DIN 4226-101 | – | – | 1 |  |
| DIN 20000-401 | – | – | 6 |  |
| DIN 20000-401 | 2017-01 | – | 2 |  |
| DIN 20000-401 | 2026-11 | – | 1 |  |
| EN 538 | – | – | 1 |  |
| EN 539-1 | – | – | 1 |  |
| EN 539-2 | – | – | 1 |  |
| EN 771-1 | – | – | 9 |  |
| EN 771-1 | 2015-11 | – | 3 |  |
| EN 772-1 | – | – | 1 |  |
| EN 772-5 | – | – | 1 |  |
| EN 772-7 | – | – | 2 |  |
| EN 772-13 | – | – | 1 |  |
| EN 772-21 | – | – | 2 |  |
| EN 772-22 | – | – | 1 |  |
| EN 1304 | – | – | 2 |  |
| EN 1304 | 2013-08 | – | 2 |  |
| EN 1996-1-1 | – | – | 2 |  |
| EN 1996-1-1 | 2013-02 | – | 1 |  |
| EN 14411 | – | – | 10 |  |
| EN 14411 | 2016-12 | – | 4 |  |
| EN 15804 | – | – | 1 |  |
| EN ISO 10545-3 | – | – | 2 |  |
| EN ISO 10545-3 | 2018-06 | – | 6 |  |
| EN ISO 10545-12 | – | – | 2 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

