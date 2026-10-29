# Kennwert-Abgleich: `lehrveranstaltungen`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `lehrveranstaltungen` (Lehrveranstaltungen, offen), `lv_aryc` (Lehrveranstaltungen, offen), `lv_bauen_im_bestand` (Lehrveranstaltungen, offen), `lv_baustoffkunde` (Lehrveranstaltungen, offen), `lv_ki_master` (Lehrveranstaltungen, offen), `lv_vnhb` (Lehrveranstaltungen, offen), `lv_wpf_nachhaltiges_bauen` (Lehrveranstaltungen, offen), `lv_zert_ausbau_bestand` (Lehrveranstaltungen, offen)
- **Komponente:** `src/modules/Lehrveranstaltungen.tsx`
- **Dateien (5):** `content/lehrveranstaltungen/Lehrveranstaltungen.json`, `src/data/kiUebungen.ts`, `src/data/lernpfade.ts`, `src/data/lernziele.ts`, `src/modules/Lehrveranstaltungen.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 109 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 3 |  |
| DIN 1045-2 | 2008-08 | – | 1 | Ausgaben uneinheitlich; Registry 2023-08 |
| DIN 1045-2 | 2023-08 | – | 1 | Ausgaben uneinheitlich |
| DIN 1045-3 | – | – | 3 |  |
| DIN 1045-100 | – | – | 1 |  |
| DIN 1045 | – | – | 1 |  |
| DIN 1076 | – | – | 1 |  |
| DIN 4102-1 | – | – | 1 |  |
| DIN 4108-2 | – | – | 3 |  |
| DIN 4108-3 | – | – | 1 |  |
| DIN 4109-1 | – | – | 1 |  |
| DIN 4109-2 | – | – | 1 |  |
| DIN 4109-32 | – | – | 2 |  |
| DIN 18008 | – | – | 1 |  |
| DIN 18196 | – | – | 3 |  |
| DIN 18218 | – | – | 1 |  |
| DIN 18533 | – | – | 2 |  |
| DIN 18534 | – | – | 1 |  |
| DIN 18560 | – | – | 1 |  |
| DIN 18940 | – | – | 1 |  |
| DIN 18945 | – | – | 1 |  |
| DIN 18948 | – | – | 1 |  |
| DIN 18960 | – | – | 1 |  |
| DIN 68800-1 | – | – | 2 |  |
| DIN 68800-4 | – | – | 1 |  |
| DIN 68800 | – | – | 2 |  |
| DWA-A 138-1 | – | – | 1 |  |
| EN 196-1 | – | – | 1 |  |
| EN 197-1 | – | – | 2 |  |
| EN 197-5 | – | – | 1 |  |
| EN 206-1 | – | – | 1 |  |
| EN 206-2 | 2026-07 | – | 1 |  |
| EN 206 | – | – | 3 |  |
| EN 206 | 2021-06 | – | 1 |  |
| EN 338 | – | – | 1 |  |
| EN 934-2 | – | – | 1 |  |
| EN 1008 | – | – | 1 |  |
| EN 1504-9 | – | – | 1 |  |
| EN 1504 | – | – | 2 |  |
| EN 1990-2 | 2026 | – | 1 |  |
| EN 1990 | – | Anhang D | 1 |  |
| EN 1992-1-1 | – | – | 5 |  |
| EN 1992-1-2 | – | – | 1 |  |
| EN 1992-4 | – | – | 1 |  |
| EN 1993-1-1 | – | – | 1 |  |
| EN 1995-1-1 | – | – | 2 |  |
| EN 1995-1-2 | – | – | 3 |  |
| EN 1996-3 | – | – | 1 |  |
| EN 10027-1 | – | – | 1 |  |
| EN 12350 | – | – | 1 |  |
| EN 12390-3 | – | – | 1 |  |
| EN 12390-12 | – | – | 1 |  |
| EN 13450 | – | – | 1 |  |
| EN 13501-1 | – | – | 1 |  |
| EN 13501-2 | – | – | 1 |  |
| EN 13791 | – | – | 5 |  |
| EN 13813 | – | – | 1 |  |
| EN 14080 | – | – | 1 |  |
| EN 14411 | – | – | 1 |  |
| EN 15804 | – | – | 3 |  |
| EN 15978 | – | – | 3 |  |
| EN 16449 | – | – | 1 |  |
| EN 17472 | – | – | 1 |  |
| EN ISO 1043-1 | – | – | 1 |  |
| EN ISO 6892-1 | – | – | 1 |  |
| EN ISO 6946 | – | – | 4 |  |
| EN ISO 9223 | – | – | 1 |  |
| EN ISO 10077-1 | – | – | 2 |  |
| EN ISO 12944-2 | – | – | 2 |  |
| EN ISO 12944 | – | – | 1 |  |
| VDI 6200 | – | – | 2 |  |
| VDI 6202 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008 (2×), 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (139×, teils mit Hinweis auf andere Ausgabe)
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

