# Kennwert-Abgleich: `lebensdauerbemessung`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `lebensdauerbemessung` (Dauerhaftigkeit, geprueft)
- **Komponente:** `src/modules/Lebensdauerbemessung.tsx`
- **Dateien (2):** `content/lebensdauerbemessung/Lebensdauerbemessung.json`, `src/modules/Lebensdauerbemessung.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 30 / 3 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 6 |  |
| EN 206 | – | – | 1 |  |
| EN 1990 | – | – | 2 |  |
| EN 1992-1-1/NA | – | Tab. 4.4DE | 4 |  |
| EN 1992-1-1 | 2023 | – | 3 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1992-1-1 | 2025-09 | – | 2 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 12390-10 | – | – | 1 |  |
| EN 12390-12 | – | – | 6 |  |
| EN 12390-12 | 2020-04 | – | 1 |  |
| EN 12390-18 | 2021-09 | – | 2 |  |
| ISO 16204 | – | – | 1 |  |
| ISO 16204 | 2012 | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2023: `content/lebensdauerbemessung/Lebensdauerbemessung.json › texte.gZiel` – …10 %\$). Nach Andrade/Izquierdo (2023) liegt den Deckungstabellen der EN 1992-1-1:2023 \$β = 1,5\$ (\$p_f \approx 7 %\$) zugrunde.…
  - 2023 (mit Hinweis): `content/lebensdauerbemessung/Lebensdauerbemessung.json › texte.kzErc` – EN 1992-1-1:2023 (DIN EN 1992-1-1:2025-09, bauaufsichtli…
  - 2025-09 (mit Hinweis): `content/lebensdauerbemessung/Lebensdauerbemessung.json › texte.kzErc` – EN 1992-1-1:2023 (DIN EN 1992-1-1:2025-09, bauaufsichtlich noch nicht eingeführt,…
  - 2025-09 (mit Hinweis): `content/lebensdauerbemessung/Lebensdauerbemessung.json › daten.KONZEPTE.4.erc` – DIN EN 1992-1-1:2025-09, noch nicht eingeführt
  - 2023: `src/modules/Lebensdauerbemessung.tsx:527` – …th}>Leistungsprinzip (fib 34)</th><th scope="col" className={th}>ERC (EN 1992-1-1:2023)</th></tr></thead>

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- EN 1992-1-1:2023 (Registry 2011-01): `content/lebensdauerbemessung/Lebensdauerbemessung.json › texte.gZiel` – …10 %\$). Nach Andrade/Izquierdo (2023) liegt den Deckungstabellen der EN 1992-1-1:2023 \$β = 1,5\$ (\$p_f \approx 7 %\$) zugrunde.…
- EN 1992-1-1:2023 (Registry 2011-01): `src/modules/Lebensdauerbemessung.tsx:527` – …th}>Leistungsprinzip (fib 34)</th><th scope="col" className={th}>ERC (EN 1992-1-1:2023)</th></tr></thead>

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

