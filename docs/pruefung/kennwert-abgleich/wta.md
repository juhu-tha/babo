# Kennwert-Abgleich: `wta`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `wta` (Schutz & Instandsetzung, offen)
- **Komponente:** `src/modules/WTA.tsx`
- **Dateien (2):** `content/wta/WTA.json`, `src/modules/WTA.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 11 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4095-1 | – | – | 1 |  |
| DIN 4095 | – | – | 1 |  |
| DIN 4108-3 | – | – | 1 |  |
| DIN 18533-1 | – | – | 1 |  |
| DIN 18533-1 | 2017-07 | – | 1 | Ausgaben uneinheitlich |
| DIN 18533-1 | 2026-06 | – | 1 | Ausgaben uneinheitlich |
| DIN 18533 | – | – | 5 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 18533-1:** 2017-07 (2×, teils mit Hinweis auf andere Ausgabe), 2026-06 (4×, teils mit Hinweis auf andere Ausgabe)
  - 2017-07: `content/wta/WTA.json › texte.standWta46` – Stand: WTA 4-6-24/D / DIN 18533-1:2017-07 + A1:2018-09 (neu: 2026-06)
  - 2026-06 (mit Hinweis): `content/wta/WTA.json › texte.hinweisZurNeuausgabeDin` – **Hinweis zur Neuausgabe:** DIN 18533-1:2026-06 ersetzt die Ausgabe 2017-07 und A1:2018…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

