# Kennwert-Abgleich: `bp_verkehr_asphalt`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bp_verkehr_asphalt` (Bauprodukte, geprueft), `bp_verkehr_bahn` (Bauprodukte, offen), `bp_verkehr_betondecken` (Bauprodukte, offen), `bp_verkehr_bitumen` (Bauprodukte, offen), `bp_verkehr_pruefung` (Bauprodukte, geprueft), `bp_verkehr_rsto` (Bauprodukte, geprueft), `bp_verkehr_tiefbau` (Bauprodukte, offen), `bp_verkehr_tunnel` (Bauprodukte, geprueft), `bp_verkehrswegebau` (–, offen)
- **Komponente:** `src/modules/BpVerkehrswegebau.tsx`
- **Dateien (20):** `content/bpverkehrswegebau/BahnbauTab.json`, `content/bpverkehrswegebau/BetondeckenTab.json`, `content/bpverkehrswegebau/BindemittelTab.json`, `content/bpverkehrswegebau/BpVerkehrswegebau.json`, `content/bpverkehrswegebau/PrueftechnikTab.json`, `content/bpverkehrswegebau/RstoRechnerTab.json`, `content/bpverkehrswegebau/TiefbauTab.json`, `content/bpverkehrswegebau/TunnelbauTab.json`, `content/bpverkehrswegebau/VergleichTab.json`, `content/bpverkehrswegebau/daten.json`, `src/modules/BpVerkehrswegebau.tsx`, `src/modules/bpverkehrswegebau/BahnbauTab.tsx`, `src/modules/bpverkehrswegebau/BetondeckenTab.tsx`, `src/modules/bpverkehrswegebau/BindemittelTab.tsx`, `src/modules/bpverkehrswegebau/PrueftechnikTab.tsx`, `src/modules/bpverkehrswegebau/RstoRechnerTab.tsx`, `src/modules/bpverkehrswegebau/TiefbauTab.tsx`, `src/modules/bpverkehrswegebau/TunnelbauTab.tsx`, `src/modules/bpverkehrswegebau/VergleichTab.tsx`, `src/modules/bpverkehrswegebau/daten.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 3 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 1 (0) |
| (3) Normverweise / Hinweise | 50 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (3): `CONCRETE['C20/25'].fck` ×1, `CONCRETE['C25/30'].fck` ×1, `CONCRETE['C30/37'].fck` ×1

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/bpverkehrswegebau/BetondeckenTab.tsx:218` | `4.5` | ja | `strengthLoss = (betonFreshAir - reqMin) * 4.5; // assume 4.5% loss per 1% extra air` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 1 |  |
| DIN 4052 | – | – | 1 |  |
| DIN 4095 | – | – | 1 |  |
| DIN 4262-1 | – | – | 1 |  |
| DIN 18134 | – | – | 3 |  |
| DIN 18551 | – | – | 1 |  |
| DWA-A 138-1 | – | – | 6 |  |
| DWA-A 138-1 | 2024-10 | – | 6 |  |
| DWA-M 153 | – | – | 1 |  |
| EN 476 | – | – | 1 |  |
| EN 752 | – | – | 2 |  |
| EN 1097-8 | – | – | 2 |  |
| EN 1401-1 | – | – | 1 |  |
| EN 1426 | – | – | 2 |  |
| EN 1427 | – | – | 1 |  |
| EN 1433 | – | – | 1 |  |
| EN 1852 | – | – | 1 |  |
| EN 1992-1-1/NA | – | Tab. 2.1DE | 1 |  |
| EN 12591 | – | – | 1 |  |
| EN 12697-22 | – | – | 2 |  |
| EN 12697-34 | – | – | 1 |  |
| EN 13043 | – | – | 1 |  |
| EN 13108-1 | – | – | 1 |  |
| EN 13108-5 | – | – | 1 |  |
| EN 13108-6 | – | – | 1 |  |
| EN 13108-7 | – | – | 1 |  |
| EN 13249 | – | – | 1 |  |
| EN 13450 | – | – | 3 |  |
| EN 13564 | – | – | 2 |  |
| EN 14487-1 | 2023-03 | – | 1 |  |
| EN 61386-24 | – | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

