# Kennwert-Abgleich: `bauschaeden`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bauschaeden` (Mängel & Schäden, geprueft)
- **Komponente:** `src/modules/Bauschaeden.tsx`
- **Dateien (2):** `content/bauschaeden/Bauschaeden.json`, `src/modules/Bauschaeden.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 23 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 5008 | – | – | 2 |  |
| DIN 18130-1 | – | – | 1 |  |
| DIN 18195 | 2025-12 | – | 1 |  |
| DIN 18533-1 | – | – | 1 |  |
| DIN 18540 | – | – | 6 |  |
| DIN 52460 | – | – | 3 |  |
| EN 1992-1-1/NA | – | – | 1 |  |
| EN 1992-1-1 | – | Gl. 7.8 | 1 |  |
| EN 15651-1 | – | – | 3 |  |
| EN 15651 | – | – | 2 |  |
| EN ISO 11600 | – | – | 1 |  |
| EN ISO 17892-11 | – | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

