# Kennwert-Abgleich: `gesteine`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `gesteine` (Baustoffe, geprueft)
- **Komponente:** `src/modules/Gesteine.tsx`
- **Dateien (2):** `content/gesteine/Gesteine.json`, `src/modules/Gesteine.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 28 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 2 |  |
| DIN 1045-2 | 2023-08 | – | 2 | Ausgaben uneinheitlich |
| DIN 4226-101 | 2025-11 | – | 1 |  |
| EN 771-6 | 2015-11 | – | 1 |  |
| EN 933-1 | – | – | 1 |  |
| EN 933-1 | 2012-03 | – | 1 |  |
| EN 933-3 | – | – | 1 |  |
| EN 933-4 | – | – | 1 |  |
| EN 1097-1 | – | – | 1 |  |
| EN 1097-2 | – | – | 1 |  |
| EN 1097-2 | 2020-09 | – | 2 |  |
| EN 1097-6 | – | – | 2 |  |
| EN 1097-8 | – | – | 1 |  |
| EN 1367-1 | – | – | 1 |  |
| EN 1936 | 2007-02 | – | 1 |  |
| EN 12440 | – | – | 1 |  |
| EN 12620 | – | – | 4 |  |
| EN 12620 | 2008-07 | – | 1 |  |
| EN 13043 | 2002-12 | – | 1 |  |
| EN 13139 | 2002-08 | – | 1 |  |
| EN 13755 | 2008-08 | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008 (2×), 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (139×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/gesteine/Gesteine.json › texte.regelsieblinienDin10452` – …lenwerte vorläufig, Normprüfung ausstehend (Abgleich mit dem Normtext DIN 1045-2:2023-08).<br>- **A-Linie:** gröberes Gemisch, w…
  - 2023-08: `content/gesteine/Gesteine.json › daten.Gesteine.formeln.3.quelle` – Fuller und Thompson (1907); Regelsieblinien nach DIN 1045-2:2023-08

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

