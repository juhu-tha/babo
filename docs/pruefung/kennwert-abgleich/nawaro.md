# Kennwert-Abgleich: `nawaro`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `nawaro` (Baustoffe, geprueft)
- **Komponente:** `src/modules/Nawaro.tsx`
- **Dateien (2):** `content/nawaro/Nawaro.json`, `src/modules/Nawaro.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 2 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 16 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

### GWP- und Transportwerte ohne zentrale Zuordnung (Quelle im Modul prüfen)

| Fundstelle | Wert | Ausschnitt |
|---|---|---|
| `content/nawaro/Nawaro.json › texte.biogenerKohlenstoffspeicherCa0` | −0,7 t CO₂-Äq./m³ | Biogener Kohlenstoffspeicher (ca. −0,7 t CO₂-Äq./m³ nach DIN EN 16449) |
| `content/nawaro/Nawaro.json › werte.rund069T` | 0,69 t CO₂ je m³ | Rund 0,69 t CO₂ je m³ – ein temporärer Speicher, der am Leben… |

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4108-2 | 2026-05 | – | 1 | Ausgaben uneinheitlich |
| DIN 4108-10 | 2021-11 | – | 1 |  |
| DIN 68800 | – | – | 2 |  |
| EN 1992-1-1 | – | – | 1 |  |
| EN 13171 | 2015-04 | – | 1 |  |
| EN 14080 | – | – | 1 |  |
| EN 15101-1 | 2019-07 | – | 1 |  |
| EN 15804 | – | – | 1 |  |
| EN 16449 | – | – | 5 |  |
| EN 16449 | 2014-06 | – | 2 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 4108-2:** 2013-02 (25×, teils mit Hinweis auf andere Ausgabe), 2026-05 (10×, teils mit Hinweis auf andere Ausgabe)
  - 2026-05: `content/nawaro/Nawaro.json › daten.Nawaro.regelwerke.0.title` – DIN 4108-2:2026-05 (Wärmeschutz – Anforderungen, Berechnun…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

