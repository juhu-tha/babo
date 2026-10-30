# Kennwert-Abgleich: `biokohlebeton`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `biokohlebeton` (Betontechnologie, geprueft)
- **Komponente:** `src/modules/Biokohlebeton.tsx`
- **Dateien (2):** `content/biokohlebeton/Biokohlebeton.json`, `src/modules/Biokohlebeton.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 5 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 4 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 15 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (5): `ZEMENT_GWP_KG['CEM I']` ×3, `ZEMENT_GWP_KG['CEM II/B']` ×1, `ZEMENT_GWP_KG['CEM III/A']` ×1

### GWP- und Transportwerte ohne zentrale Zuordnung (Quelle im Modul prüfen)

| Fundstelle | Wert | Ausschnitt |
|---|---|---|
| `content/biokohlebeton/Biokohlebeton.json › daten.Biokohlebeton.schritte.0.erklaerung` | 0,3 kg CO₂e/kg | Kohle mit 80 % Kohlenstoff, F_perm = 0,80, Herstellung 0,3 kg CO₂e/kg (Richtwerte); CEM I mit 0,665 kg CO₂e/k… |
| `src/data/quiz.json › qn_biokohlebeton_2` | 0,4 kg CO₂e je kg | …off. Angesetzt werden F_perm = 0,80 und eine Herstellungsemission von 0,4 kg CO₂e je kg Kohle. Wie groß ist die Netto-Senke der… |
| `src/data/quiz.json › qn_biokohlebeton_2` | 21,6 kg CO₂/m³ | …e je kg Kohle. Wie groß ist die Netto-Senke der Pflanzenkohle? etwa 21,6 kg CO₂/m³ 12 · 0,75 · 44/12 = 33,0 kg CO₂; mit… |
| `src/data/quiz.json › qn_biokohlebeton_2` | 21,6 kg CO₂/m³ | …· 0,4 = 4,8 kg Herstellungsemission ergibt sich eine Netto-Senke von 21,6 kg CO₂/m³. |

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 2 |  |
| EN 197-1 | – | – | 1 |  |
| EN 197-1 | 2011-11 | – | 1 |  |
| EN 206 | – | – | 2 |  |
| EN 12390-12 | – | – | 3 |  |
| EN 12390-12 | 2020-04 | – | 1 |  |
| EN 12878 | – | – | 1 |  |
| EN 15804 | – | – | 4 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

