# Kennwert-Abgleich: `instandsetzung_checklisten`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `instandsetzung_checklisten` (Schutz & Instandsetzung, offen)
- **Komponente:** `src/modules/InstandsetzungChecklisten.tsx`
- **Dateien (2):** `content/instandsetzungchecklisten/InstandsetzungChecklisten.json`, `src/modules/InstandsetzungChecklisten.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 49 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 18560-4 | – | – | 1 |  |
| DIN 31051 | – | – | 2 |  |
| DIN 51130 | – | – | 2 |  |
| EN 1504-2 | – | – | 2 |  |
| EN 1504-3 | – | – | 3 |  |
| EN 1504-5 | – | – | 5 |  |
| EN 1504-7 | – | – | 1 |  |
| EN 1504-9 | – | – | 3 |  |
| EN 1504-10 | – | – | 8 |  |
| EN 1542 | – | – | 6 |  |
| EN 1992-1-1 | – | – | 1 |  |
| EN 13670 | – | – | 1 |  |
| EN 14629 | – | – | 1 |  |
| EN 14630 | – | – | 1 |  |
| EN ISO 2808 | – | – | 1 |  |
| EN ISO 8501-1 | – | – | 2 |  |
| EN ISO 12696 | – | – | 4 |  |
| EN ISO 12944-7 | – | – | 3 |  |
| ISO 12944-4 | – | – | 1 |  |
| ISO 12944 | – | – | 1 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

