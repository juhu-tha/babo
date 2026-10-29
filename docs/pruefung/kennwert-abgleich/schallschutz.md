# Kennwert-Abgleich: `schallschutz`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `schallschutz` (Bauphysik, offen)
- **Komponente:** `src/modules/Schallschutz.tsx`
- **Dateien (4):** `content/schallschutz/Schallschutz.json`, `content/schallschutz/TrittschallTab.json`, `src/modules/Schallschutz.tsx`, `src/modules/schallschutz/TrittschallTab.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 54 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4109-1 | – | – | 4 |  |
| DIN 4109-1 | 2018 | – | 2 |  |
| DIN 4109-1 | 2018-01 | – | 3 |  |
| DIN 4109-2 | – | – | 7 |  |
| DIN 4109-2 | 2018 | – | 1 |  |
| DIN 4109-2 | 2018-01 | – | 3 |  |
| DIN 4109-5 | – | – | 1 |  |
| DIN 4109-32 | – | – | 13 |  |
| DIN 4109-32 | 2016-07 | Gl. 2 | 7 |  |
| DIN 4109-34 | – | – | 2 |  |
| DIN 4109-34 | 2016-07 | – | 3 |  |
| DIN 4109 | 1989 | – | 1 | Ausgaben uneinheitlich |
| DIN 4109 | 1989-11 | – | 1 | Ausgaben uneinheitlich |
| EN 12354-1 | – | – | 3 |  |
| EN ISO 12354-1 | – | – | 1 |  |
| EN ISO 12354-2 | – | – | 1 |  |
| VDI 4100 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 4109:** 1989 (3×), 1989-11 (1×, teils mit Hinweis auf andere Ausgabe), 2018 (2×)
  - 1989-11 (mit Hinweis): `content/schallschutz/TrittschallTab.json › texte.anforderung` – …\$L'_{n,w} = 50\$ dB, für Treppenläufe und -podeste 53 dB. Die frühere DIN 4109:1989-11 forderte für Wohnungstrenndecken 53 dB…
  - 1989: `content/schallschutz/TrittschallTab.json › daten.lernziele.3.description` – Anforderungen nach DIN 4109-1:2018 und DIN 4109:1989 unterscheiden und Schallbrücken als Aus…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

