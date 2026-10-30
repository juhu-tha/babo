# Kennwert-Abgleich: `zertifizierung_siegel`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `zertifizierung_siegel` (Nachhaltigkeit, offen)
- **Komponente:** `src/modules/ZertifizierungSiegel.tsx`
- **Dateien (8):** `content/produktsiegel/Produktsiegel.json`, `content/zertifizierung/Kfn.json`, `content/zertifizierung/Zertifizierung.json`, `content/zertifizierungsiegel/ZertifizierungSiegel.json`, `src/modules/Produktsiegel.tsx`, `src/modules/Zertifizierung.tsx`, `src/modules/ZertifizierungSiegel.tsx`, `src/modules/zertifizierung/KfnFoerderung.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 1 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 26 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (1): `QNG_WG.plus` ×1

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1946-6 | – | – | 1 |  |
| DIN 4108-2 | – | – | 1 |  |
| DIN 18960 | – | – | 1 |  |
| EN 15643 | – | – | 2 |  |
| EN 15804 | – | – | 4 |  |
| EN 15978 | – | – | 2 |  |
| EN ISO 14020 | 2023-07 | – | 1 |  |
| EN ISO 14025 | 2011-10 | – | 1 |  |
| ISO 14020 | – | – | 4 |  |
| ISO 14020 | 2022 | – | 1 |  |
| ISO 14021 | – | – | 1 |  |
| ISO 14024 | – | – | 1 |  |
| ISO 14024 | 2018 | – | 2 |  |
| ISO 14025 | – | – | 3 |  |
| ISO 14025 | 2006 | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

