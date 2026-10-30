# Kennwert-Abgleich: `ki_uebungen`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `ki_uebungen` (KI im Bauwesen, geprueft)
- **Komponente:** `src/modules/KiUebungen.tsx`
- **Dateien (3):** `content/kiuebungen/KiUebungen.json`, `src/data/kiUebungen.ts`, `src/modules/KiUebungen.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 4 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | 2008-08 | – | 1 | Ausgaben uneinheitlich; Registry 2023-08 |
| DIN 1045-2 | 2023-08 | – | 1 | Ausgaben uneinheitlich |
| EN ISO 6946 | – | – | 2 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2008-08: `src/data/kiUebungen.ts:359` – …tigkeit von 37 N/mm². Die Anforderungen an die Zusammensetzung regelt DIN 1045-2:2008-08. Ein höherer Wasserzementwert steigert…
  - 2023-08 (mit Hinweis): `src/data/kiUebungen.ts:372` – 'Fehler 2 (veraltete Ausgabe): maßgeblich ist DIN 1045-2:2023-08 bzw. die bauaufsichtlich eingeführte Fa…

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- DIN 1045-2:2008-08 (Registry 2023-08): `src/data/kiUebungen.ts:359` – …tigkeit von 37 N/mm². Die Anforderungen an die Zusammensetzung regelt DIN 1045-2:2008-08. Ein höherer Wasserzementwert steigert…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

