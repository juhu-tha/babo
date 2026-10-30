# Kennwert-Abgleich: `instandsetzung_asphalt`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `instandsetzung_asphalt` (–, offen), `instandsetzung_holz` (–, offen), `instandsetzung_kunststoffe` (–, offen), `instandsetzung_materialien` (Schutz & Instandsetzung, offen), `instandsetzung_mauerwerk` (–, offen), `instandsetzung_metalle` (–, offen)
- **Komponente:** `src/modules/InstandsetzungMaterialien.tsx`
- **Dateien (2):** `content/instandsetzungmaterialien/InstandsetzungMaterialien.json`, `src/modules/InstandsetzungMaterialien.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 48 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 18533 | – | – | 1 |  |
| DIN 18540 | – | – | 5 |  |
| DIN 68800-1 | – | – | 1 |  |
| DIN 68800-2 | – | – | 3 |  |
| DIN 68800-3 | – | – | 1 |  |
| DIN 68800-4 | – | – | 2 |  |
| DIN 68800-4 | 2020-12 | – | 1 |  |
| DIN 68800 | – | – | 5 |  |
| EN 350 | – | – | 1 |  |
| EN 350 | 2016 | – | 1 |  |
| EN 1995-1-1 | – | – | 1 |  |
| EN 13183-1 | – | – | 1 |  |
| EN 14399 | – | – | 1 |  |
| EN 15651 | – | – | 1 |  |
| EN ISO 1461 | – | – | 1 |  |
| EN ISO 4628-3 | – | – | 1 |  |
| EN ISO 8503 | – | – | 1 |  |
| EN ISO 9223 | 2012-05 | – | 1 |  |
| EN ISO 12944-1 | – | – | 1 |  |
| EN ISO 12944-5 | – | – | 3 |  |
| EN ISO 12944-7 | – | – | 2 |  |
| EN ISO 12944 | – | – | 5 |  |
| EN ISO 14713-1 | – | – | 3 |  |
| ISO 4628 | – | – | 1 |  |
| ISO 8501-1 | – | – | 2 |  |
| ISO 12944-2 | – | – | 1 |  |
| ISO 12944 | – | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

