# Kennwert-Abgleich: `abfaelle`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `abfaelle` (Rückbau & Schadstoffe, geprueft)
- **Komponente:** `src/modules/Abfaelle.tsx`
- **Dateien (15):** `content/abfaelle/Abfaelle.json`, `content/abfaelle/Altlasten.json`, `content/abfaelle/AvvSchluessel.json`, `content/abfaelle/Checklisten.json`, `content/abfaelle/Deponie.json`, `content/abfaelle/EbvMantelverordnung.json`, `content/abfaelle/LagaPn98.json`, `src/modules/Abfaelle.tsx`, `src/modules/abfaelle/Altlasten.tsx`, `src/modules/abfaelle/AvvSchluessel.tsx`, `src/modules/abfaelle/Checklisten.tsx`, `src/modules/abfaelle/Deponie.tsx`, `src/modules/abfaelle/EbvMantelverordnung.tsx`, `src/modules/abfaelle/LagaPn98.tsx`, `src/modules/abfaelle/daten.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 28 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 1 |  |
| DIN 19528 | – | – | 1 |  |
| DIN 19639 | – | – | 1 |  |
| DIN 19698-1 | – | – | 2 |  |
| DIN 19698-1 | 2014-05 | – | 2 |  |
| DIN 19698-6 | – | – | 1 |  |
| DIN 19698 | – | – | 5 |  |
| DIN SPEC 91484 | 2023-09 | – | 1 |  |
| EN 206 | – | – | 1 |  |
| EN 12457-4 | – | – | 1 |  |
| EN 13285 | – | – | 1 |  |
| VDI 3866 | – | – | 3 |  |
| VDI 6202 | – | – | 8 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

