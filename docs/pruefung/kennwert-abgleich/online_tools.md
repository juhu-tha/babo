# Kennwert-Abgleich: `online_tools`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `online_tools` (Digitales, geprueft)
- **Komponente:** `src/modules/OnlineTools.tsx`
- **Dateien (2):** `content/onlinetools/OnlineTools.json`, `src/modules/OnlineTools.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 2 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 54 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (2): `CONCRETE['C30/37'].Ecm` ×1, `HOLZ_EN338.C24.E0mean` ×1

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4108 Beiblatt 2 | – | – | 1 |  |
| DIN 4108-3 | – | – | 3 |  |
| DIN 4108 | – | – | 1 |  |
| DIN 4109 | – | – | 1 |  |
| DIN 4149 | – | – | 1 |  |
| DIN SPEC 91484 | – | – | 1 |  |
| EN 1990 | – | – | 5 |  |
| EN 1991-1-1 | – | – | 1 |  |
| EN 1991-1-3 | – | – | 2 |  |
| EN 1991-1-4 | – | – | 2 |  |
| EN 1991 | – | – | 2 |  |
| EN 1992-1-1 | – | – | 2 |  |
| EN 1992 | – | – | 1 |  |
| EN 1993-1-1 | – | – | 1 |  |
| EN 1995-1-1/NA | – | Tab. NA.13 | 1 |  |
| EN 1995-1-1 | – | – | 1 |  |
| EN 1995-1-1 | 2010-12 | – | 1 | Ausgaben uneinheitlich |
| EN 1995-1-2 | – | – | 1 |  |
| EN 1998-1 | – | – | 2 |  |
| EN 15026 | – | – | 3 |  |
| EN 15804 | – | – | 5 |  |
| EN 15978 | – | – | 1 |  |
| EN ISO 6946 | – | Tab. 8 | 7 |  |
| EN ISO 10211 | – | – | 1 |  |
| EN ISO 19650-1 | – | – | 1 |  |
| EN ISO 19650 | – | – | 1 |  |
| ISO 14025 | – | – | 1 |  |
| ISO 14040 | – | – | 1 |  |
| ISO 14044 | – | – | 1 |  |
| ISO 15927-4 | – | – | 1 |  |
| VDI 6210 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 1995-1-1:** 2010-12 (13×, teils mit Hinweis auf andere Ausgabe), 2025 (3×, teils mit Hinweis auf andere Ausgabe), 2026-09 (6×, teils mit Hinweis auf andere Ausgabe)
  - 2010-12: `content/onlinetools/OnlineTools.json › werte.dinEn199512` – DIN EN 1995-1-1:2010-12 mit NA; DIN EN 1990

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

