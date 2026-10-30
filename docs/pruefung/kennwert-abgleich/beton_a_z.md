# Kennwert-Abgleich: `beton_a_z`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `beton_a_z` (Betontechnologie, geprueft)
- **Komponente:** `src/modules/BetonAZ.tsx`
- **Dateien (2):** `content/betonaz/BetonAZ.json`, `src/modules/BetonAZ.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 22 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | Anhang A | 4 |  |
| DIN 1045-2 | 2023-08 | – | 5 | Ausgaben uneinheitlich |
| EN 206 | – | – | 4 |  |
| EN 206 | 2021-06 | – | 2 |  |
| EN 1504-9 | – | – | 2 |  |
| EN 1504 | – | – | 2 |  |
| EN 1992-1-1/NA | – | Tab. 4.4DE | 2 |  |
| EN 1992-1-1 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/betonaz/BetonAZ.json › texte.statusNormgrundlageDinEn` – 📅 Status: Normgrundlage DIN EN 206 / DIN 1045-2:2023-08
  - 2023-08: `content/betonaz/BetonAZ.json › daten.BetonAZ.formeln.0.erklaerung` – Stoffraumrechnungsformel für dichten Frischbeton je Kubikmeter nach DIN 1045-2:2023-08. Summe aller absoluten Volumina ergibt…
  - 2023-08: `content/betonaz/BetonAZ.json › daten.BetonAZ.formeln.0.quelle` – DIN 1045-2:2023-08
  - 2023-08: `content/betonaz/BetonAZ.json › daten.BetonAZ.formeln.1.erklaerung` – Äquivalenter Wasserzementwert nach DIN EN 206:2021-06 / DIN 1045-2:2023-08 bei Anrechnung von Flugasche (k = 0,4)…
  - 2023-08: `content/betonaz/BetonAZ.json › daten.BetonAZ.formeln.1.quelle` – DIN EN 206:2021-06 / DIN 1045-2:2023-08

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

