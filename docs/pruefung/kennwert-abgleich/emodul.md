# Kennwert-Abgleich: `emodul`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `emodul` (Mechanik, geprueft)
- **Komponente:** `src/modules/EModul.tsx`
- **Dateien (2):** `content/emodul/EModul.json`, `src/modules/EModul.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 1 |
| (1) Kennwerte übereinstimmend | 1 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 12 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

| Fundstelle | Wert im Text | zentral | Konstante | Ausschnitt |
|---|---|---|---|---|
| `src/data/quiz.json › qn_emodul_4` | 39,4 GPa | 33000 | `CONCRETE['C30/37'].Ecm` | …t oder der Wechsel auf Basalt bei C30/37? Basalt bei C30/37: E_cm ≈ 39,4 GPa, also rund +20 % und damit mehr als C50… |

Übereinstimmend (1): `CONCRETE['C30/37'].Ecm` ×1

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| EN 1992-1-1 | – | Tab. 3.1 | 9 |  |
| EN 1992-1-1 | 2011-01 | – | 2 | Ausgaben uneinheitlich |
| EN 12390-13 | 2021-09 | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01: `content/emodul/EModul.json › werte.dinEn19921` – DIN EN 1992-1-1:2011-01, 3.1.3
  - 2011-01: `content/emodul/EModul.json › daten.EModul.regelwerke.0.title` – DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA (Eurocode 2, Abschn…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

