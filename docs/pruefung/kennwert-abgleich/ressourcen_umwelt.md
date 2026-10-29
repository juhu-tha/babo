# Kennwert-Abgleich: `ressourcen_umwelt`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `ressourcen_umwelt` (Nachhaltigkeit, geprueft)
- **Komponente:** `src/modules/RessourcenUmwelt.tsx`
- **Dateien (6):** `content/nawaro/Nawaro.json`, `content/ressourcenemissionen/RessourcenEmissionen.json`, `content/ressourcenumwelt/RessourcenUmwelt.json`, `src/modules/Nawaro.tsx`, `src/modules/RessourcenEmissionen.tsx`, `src/modules/RessourcenUmwelt.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 2 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 30 / 2 |

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
| EN 15804 | – | – | 6 |  |
| EN 15804 | 2022-03 | – | 4 | Ausgaben uneinheitlich |
| EN 16449 | – | – | 4 |  |
| EN 16449 | 2014-06 | – | 5 |  |
| EN ISO 14040 | – | – | 1 |  |
| EN ISO 14040 | 2021-02 | – | 1 |  |
| EN ISO 14044 | 2021-02 | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 4108-2:** 2013-02 (25×, teils mit Hinweis auf andere Ausgabe), 2026-05 (10×, teils mit Hinweis auf andere Ausgabe)
  - 2026-05: `content/nawaro/Nawaro.json › daten.Nawaro.regelwerke.0.title` – DIN 4108-2:2026-05 (Wärmeschutz – Anforderungen, Berechnun…
- **EN 15804:** 2012 (6×, teils mit Hinweis auf andere Ausgabe), 2022-03 (14×, teils mit Hinweis auf andere Ausgabe)
  - 2022-03: `content/ressourcenemissionen/RessourcenEmissionen.json › daten.RessourcenEmissionen.regelwerke.1.title` – DIN EN 15804:2022-03 (Umweltproduktdeklarationen – Grundrege…
  - 2022-03: `content/ressourcenumwelt/RessourcenUmwelt.json › werte.dinEn158042022` – DIN EN 15804:2022-03 (Indikatoren der Ressourcennutzung)
  - 2022-03: `content/ressourcenumwelt/RessourcenUmwelt.json › daten.RessourcenUmwelt.regelwerke.0.title` – DIN EN 15804:2022-03 (Umweltproduktdeklarationen – Grundrege…
  - 2022-03: `content/ressourcenumwelt/RessourcenUmwelt.json › daten.RessourcenUmwelt.formeln.0.quelle` – DIN EN 15804:2022-03

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

