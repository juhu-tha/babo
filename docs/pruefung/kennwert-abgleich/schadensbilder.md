# Kennwert-Abgleich: `schadensbilder`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `schadensbilder` (Mängel & Schäden, offen)
- **Komponente:** `src/modules/TypischeBauschaeden.tsx`
- **Dateien (2):** `content/typischebauschaeden/TypischeBauschaeden.json`, `src/modules/TypischeBauschaeden.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 42 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | Tab. F.2.1 | 3 |  |
| DIN 1054 | – | – | 1 |  |
| DIN 1076 | – | – | 3 |  |
| DIN 1076 | 2026-01 | – | 2 |  |
| DIN 4108-2 | – | – | 1 |  |
| DIN 4108-3 | – | – | 2 |  |
| DIN 18339 | – | – | 2 |  |
| DIN 18531 | – | – | 1 |  |
| DIN 18533 | – | – | 5 |  |
| DIN 18550-1 | – | – | 1 |  |
| EN 206 | – | – | 3 |  |
| EN 1504-5 | – | – | 2 |  |
| EN 1537 | – | – | 1 |  |
| EN 1992-1-1 | – | – | 4 |  |
| EN 1992-2 | – | – | 1 |  |
| EN 1995-1-1 | – | Tab. 4.1 | 2 |  |
| EN 1997-1/NA | – | – | 1 |  |
| EN 1997-1 | – | – | 1 |  |
| EN 12390-9 | – | – | 1 |  |
| EN 13914-1 | – | – | 1 |  |
| EN ISO 8044 | – | – | 1 |  |
| EN ISO 12570 | – | – | 1 |  |
| ISO 12135 | – | – | 2 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

