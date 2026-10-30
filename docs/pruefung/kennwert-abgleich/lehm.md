# Kennwert-Abgleich: `lehm`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `lehm` (Baustoffe, offen)
- **Komponente:** `src/modules/Lehm.tsx`
- **Dateien (2):** `content/lehm/Lehm.json`, `src/modules/Lehm.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 22 / 4 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 18940 | – | – | 8 |  |
| DIN 18940 | 2023-06 | – | 3 |  |
| DIN 18945-189 | – | – | 2 |  |
| DIN 18945 | – | – | 1 |  |
| DIN 18945 | 2024-03 | – | 3 | Ausgaben uneinheitlich |
| DIN 18946 | 2024-03 | – | 1 | Ausgaben uneinheitlich |
| DIN 18947 | – | – | 1 |  |
| DIN 18947 | 2024-03 | – | 1 | Ausgaben uneinheitlich |
| DIN 18948 | 2024-03 | – | 1 | Ausgaben uneinheitlich |
| EN 1996 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 18945:** 2018-12 (1×), 2024-03 (4×)
  - 2024-03: `content/lehm/Lehm.json › texte.anwendungsDruckfestigkeitsklassenLehmste` – …m² mittlerer Steindruckfestigkeit; vorläufig, Normprüfung ausstehend, DIN 18945:2024-03 mit A1:2026-06) eingeteilt. Die charakt…
  - 2024-03: `content/lehm/Lehm.json › daten.Lehm.regelwerke.1.title` – DIN 18945:2024-03 mit A1:2026-06 (Lehmsteine - Anforderun…
  - 2024-03: `content/lehm/Lehm.json › daten.Lehm.formeln.0.quelle` – DIN 18945:2024-03
- **DIN 18946:** 2018-12 (1×), 2024-03 (3×)
  - 2024-03: `content/lehm/Lehm.json › daten.Lehm.regelwerke.2.title` – DIN 18946:2024-03 (Lehmmauermörtel - Anforderungen, Prüfu…
- **DIN 18947:** 2018-12 (1×), 2024-03 (2×)
  - 2024-03: `content/lehm/Lehm.json › daten.Lehm.regelwerke.3.title` – DIN 18947:2024-03 (Lehmputzmörtel - Anforderungen, Prüfun…
- **DIN 18948:** 2018-12 (1×), 2024-03 (2×)
  - 2024-03: `content/lehm/Lehm.json › daten.Lehm.regelwerke.4.title` – DIN 18948:2024-03 (Lehmplatten - Anforderungen, Prüfung u…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

