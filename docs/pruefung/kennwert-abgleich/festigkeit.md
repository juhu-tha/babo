# Kennwert-Abgleich: `festigkeit`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `festigkeit` (Mechanik, geprueft)
- **Komponente:** `src/modules/Festigkeitsberechnungen.tsx`
- **Dateien (4):** `content/festigkeitsberechnungen/Festigkeitsberechnungen.json`, `content/festigkeitsberechnungen/Spannungszustand.json`, `src/modules/Festigkeitsberechnungen.tsx`, `src/modules/festigkeitsberechnungen/Spannungszustand.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 2 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 9 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (2): `BAUSTAHL_EC3.S235.fu` ×1, `HOLZ_EN338.C24.rhoMean` ×1

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| EN 338 | 2016-07 | – | 2 |  |
| EN 1990 | – | – | 2 |  |
| EN 1992-1-1 | – | Tab. 3.1 | 1 |  |
| EN 1992 | – | – | 1 |  |
| EN 1999 | – | – | 1 |  |
| EN 10025-2 | – | – | 1 |  |
| EN ISO 6892-1 | – | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

