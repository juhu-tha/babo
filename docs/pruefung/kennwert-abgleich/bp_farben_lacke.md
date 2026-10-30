# Kennwert-Abgleich: `bp_farben_lacke`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bp_farben_lacke` (Bauprodukte, geprueft)
- **Komponente:** `src/modules/BpFarbenLacke.tsx`
- **Dateien (8):** `content/bpfarbenlacke/BpFarbenLacke.json`, `content/bpfarbenlacke/FilmchemieTab.json`, `content/bpfarbenlacke/RechnerTab.json`, `content/bpfarbenlacke/daten.json`, `src/modules/BpFarbenLacke.tsx`, `src/modules/bpfarbenlacke/FilmchemieTab.tsx`, `src/modules/bpfarbenlacke/RechnerTab.tsx`, `src/modules/bpfarbenlacke/daten.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 1 (1) |
| (3) Normverweise / Hinweise | 27 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/bpfarbenlacke/RechnerTab.tsx:204` | `2.5` | – | `<span><MdText text={inhalt.texte.empfohleneGebindebestellung} /><strong>{formatDeWert(Math.ceil(totalLitersRequired / 10))}<MdText text={inh` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 18363 | – | – | 2 |  |
| DIN 18533 | – | – | 1 |  |
| DIN 68861 | – | – | 1 |  |
| EN 927 | – | – | 1 |  |
| EN 1062-1 | – | – | 1 |  |
| EN 1062-7 | – | – | 4 |  |
| EN 1504-2 | – | – | 5 |  |
| EN 1504-10 | – | – | 1 |  |
| EN 14342 | – | – | 1 |  |
| EN ISO 2409 | – | – | 2 |  |
| EN ISO 2808 | – | – | 3 |  |
| EN ISO 11296-4 | – | – | 1 |  |
| EN ISO 12944-5 | – | – | 2 |  |
| EN ISO 12944 | – | – | 2 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

