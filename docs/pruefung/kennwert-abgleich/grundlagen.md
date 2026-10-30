# Kennwert-Abgleich: `grundlagen`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `grundlagen` (Betontechnologie, offen)
- **Komponente:** `src/modules/Grundlagen.tsx`
- **Dateien (2):** `content/grundlagen/Grundlagen.json`, `src/modules/Grundlagen.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 36 / 3 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | Tab. F.4.1 | 7 |  |
| DIN 1045-2 | 2008-08 | Tab. F.4.1 | 2 | Ausgaben uneinheitlich; Registry 2023-08 |
| DIN 1045-2 | 2023-08 | – | 5 | Ausgaben uneinheitlich |
| DIN 1045-100 | – | – | 1 |  |
| DIN 1164-10 | – | – | 1 |  |
| EN 197-1 | – | – | 3 |  |
| EN 197-5 | – | – | 3 |  |
| EN 206 | – | – | 2 |  |
| EN 206 | 2021-06 | – | 1 |  |
| EN 934 | – | – | 1 |  |
| EN 1008 | – | – | 5 |  |
| EN 1008 | 2002-10 | – | 1 |  |
| EN 12620 | – | – | 1 |  |
| EN 12620 | 2008-07 | – | 1 |  |
| EN 13055 | – | – | 1 |  |
| EN 14216 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/grundlagen/Grundlagen.json › texte.dürfenNachDin1045` – Dürfen nach DIN 1045-2:2023-08 (Typ 1/Typ 2) begrenzt beigemischt werd…
  - 2023-08: `content/grundlagen/Grundlagen.json › texte.dürfenNachDin1045` – …Anteile setzen BK-E voraus (Anhang E, Tab. E.2.5; Werte am Weißdruck DIN 1045-2:2023-08 vorläufig, Normprüfung ausstehend). Pro…
  - 2008-08: `content/grundlagen/Grundlagen.json › texte.zwischenwerteWerdenLinearInterpoliert` – Zwischenwerte werden linear interpoliert. Die Werte entsprechen DIN 1045-2:2008-08 (Tab. F.4.1/F.4.2). In DIN 1045-2:2023-…
  - 2023-08: `content/grundlagen/Grundlagen.json › texte.zwischenwerteWerdenLinearInterpoliert` – …iert. Die Werte entsprechen DIN 1045-2:2008-08 (Tab. F.4.1/F.4.2). In DIN 1045-2:2023-08 sind Höchstwerte des Mehlkorngehalts en…
  - 2008-08: `content/grundlagen/Grundlagen.json › werte.din104522008` – DIN 1045-2:2008-08, Tab. F.4.1 (in DIN 1045-2:2023-08 entf…
  - 2023-08: `content/grundlagen/Grundlagen.json › werte.din104522008` – DIN 1045-2:2008-08, Tab. F.4.1 (in DIN 1045-2:2023-08 entfallen; dort Mindest-Leimvolumen)
  - 2023-08: `content/grundlagen/Grundlagen.json › daten.Grundlagen.regelwerke.1.title` – DIN 1045-2:2023-08 (Tragwerke aus Beton, Stahlbeton und Sp…

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- DIN 1045-2:2008-08 (Registry 2023-08): `content/grundlagen/Grundlagen.json › texte.zwischenwerteWerdenLinearInterpoliert` – Zwischenwerte werden linear interpoliert. Die Werte entsprechen DIN 1045-2:2008-08 (Tab. F.4.1/F.4.2). In DIN 1045-2:2023-…
- DIN 1045-2:2008-08 (Registry 2023-08): `content/grundlagen/Grundlagen.json › werte.din104522008` – DIN 1045-2:2008-08, Tab. F.4.1 (in DIN 1045-2:2023-08 entf…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

