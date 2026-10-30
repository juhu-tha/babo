# Kennwert-Abgleich: `bp_glaeser`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bp_glaeser` (Bauprodukte, geprueft)
- **Komponente:** `src/modules/BpGlaeser.tsx`
- **Dateien (6):** `content/bpglaeser/BpGlaeser.json`, `content/bpglaeser/KalkulatorTab.json`, `content/bpglaeser/daten.json`, `src/modules/BpGlaeser.tsx`, `src/modules/bpglaeser/KalkulatorTab.tsx`, `src/modules/bpglaeser/daten.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 1 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 86 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

### GWP- und Transportwerte ohne zentrale Zuordnung (Quelle im Modul prüfen)

| Fundstelle | Wert | Ausschnitt |
|---|---|---|
| `content/bpglaeser/BpGlaeser.json › texte.hohePrimärenergieBeiNeualuminium` | 2,3 kg CO₂/kg | …t-Consumer-Schrott) senkt den Carbon Footprint um über 80 % auf unter 2,3 kg CO₂/kg Alu. |

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4108-2 | – | – | 2 |  |
| DIN 17615 | – | – | 1 |  |
| DIN 18008-1 | – | – | 7 |  |
| DIN 18008-2 | – | – | 3 |  |
| DIN 18008-3 | – | – | 2 |  |
| DIN 18008-4 | – | – | 3 |  |
| DIN 18008-5 | – | – | 1 |  |
| DIN 18008 | – | – | 5 |  |
| DIN 68121 | – | – | 2 |  |
| EN 356 | – | – | 3 |  |
| EN 410 | – | – | 3 |  |
| EN 572-1 | – | – | 1 |  |
| EN 572-2 | – | – | 2 |  |
| EN 673 | – | – | 1 |  |
| EN 1026 | – | – | 1 |  |
| EN 1027 | – | – | 1 |  |
| EN 1279-1 | – | – | 3 |  |
| EN 1279-3 | – | – | 1 |  |
| EN 1279 | – | – | 7 |  |
| EN 1627 | – | – | 1 |  |
| EN 1863-1 | – | – | 2 |  |
| EN 12150-1 | – | – | 2 |  |
| EN 12150 | – | – | 1 |  |
| EN 12207 | – | – | 1 |  |
| EN 12208 | – | – | 2 |  |
| EN 12210 | – | – | 1 |  |
| EN 12600 | – | – | 1 |  |
| EN 12608 | – | – | 1 |  |
| EN 14179-1 | – | – | 1 |  |
| EN 14179 | – | – | 2 |  |
| EN 14351-1 | – | – | 6 |  |
| EN 14449 | – | – | 2 |  |
| EN ISO 10077-1 | – | – | 7 |  |
| EN ISO 10077-1 | 2020-10 | – | 1 |  |
| EN ISO 10077 | – | – | 1 |  |
| EN ISO 12543-1 | – | – | 1 |  |
| EN ISO 12543 | – | – | 2 |  |
| ISO 19916-1 | – | – | 2 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

