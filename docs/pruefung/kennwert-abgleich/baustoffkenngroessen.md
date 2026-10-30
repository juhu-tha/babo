# Kennwert-Abgleich: `baustoffkenngroessen`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `baustoffkenngroessen` (Grundlagen, geprueft)
- **Komponente:** `src/modules/Baustoffkenngroessen.tsx`
- **Dateien (16):** `content/baustoffkenngroessen/Baustoffkenngroessen.json`, `content/baustoffkenngroessen/EigenschaftenTab.json`, `content/baustoffkenngroessen/HygrischTab.json`, `content/baustoffkenngroessen/PhysikalischTab.json`, `content/baustoffkenngroessen/RechenbeispieleTab.json`, `content/baustoffkenngroessen/ThermischTab.json`, `content/baustoffkenngroessen/ZeitlichTab.json`, `content/elastomechanik/Elastomechanik.json`, `src/modules/Baustoffkenngroessen.tsx`, `src/modules/Elastomechanik.tsx`, `src/modules/baustoffkenngroessen/EigenschaftenTab.tsx`, `src/modules/baustoffkenngroessen/HygrischTab.tsx`, `src/modules/baustoffkenngroessen/PhysikalischTab.tsx`, `src/modules/baustoffkenngroessen/RechenbeispieleTab.tsx`, `src/modules/baustoffkenngroessen/ThermischTab.tsx`, `src/modules/baustoffkenngroessen/ZeitlichTab.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 5 (4) |
| (3) Normverweise / Hinweise | 73 / 0 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Baustoffkenngroessen.tsx:205` | `1.5` | – | `labels: [0, dehnungPromille / 2, dehnungPromille, dehnungPromille * 1.5],` |
| `src/modules/Baustoffkenngroessen.tsx:209` | `1.5` | – | `data: [0, (eModul * (dehnung / 2)), spannungHooke, (eModul * (dehnung * 1.5))],` |
| `src/modules/Elastomechanik.tsx:182` | `1.0197` | – | `(= { formatDeWert((forceKn * 1000)) }<MdText text={inhalt.texte.nEntsprechendDemGewicht} />{formatDeWert(Math.round(forceKn * 1.0197))} Baua` |
| `src/modules/baustoffkenngroessen/ThermischTab.tsx:88` | `0.13` | – | `const uCalc = 1 / (0.13 + rCalc + 0.04); // R_si = 0.13, R_se = 0.04 fur Aussenwand` |
| `src/modules/baustoffkenngroessen/ThermischTab.tsx:157` | `3.6` | ja | `const energyWh = energyKJ / 3.6; // 1 Wh = 3.6 kJ` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 1 |  |
| DIN 4074-1 | – | – | 1 |  |
| DIN 4108-2 | – | – | 1 |  |
| DIN 4108-3 | – | – | 11 |  |
| DIN 4108-4 | – | – | 3 |  |
| DIN 18008-1 | – | – | 1 |  |
| DIN 20000-401 | – | – | 1 |  |
| DIN 51045 | – | – | 1 |  |
| DIN 51057 | – | – | 1 |  |
| DIN 68800 | – | – | 1 |  |
| EN 206 | – | – | 2 |  |
| EN 408 | – | – | 2 |  |
| EN 771-1 | – | – | 1 |  |
| EN 772-13 | – | – | 1 |  |
| EN 1052-1 | – | – | 1 |  |
| EN 1052-3 | – | – | 1 |  |
| EN 1097-3 | – | – | 2 |  |
| EN 1288-2 | – | – | 1 |  |
| EN 1936 | – | – | 2 |  |
| EN 1992-1-1 | – | Anhang B | 7 |  |
| EN 1993-1-1 | – | – | 1 |  |
| EN 1995-1-1 | – | – | 1 |  |
| EN 1996-1-1 | – | – | 1 |  |
| EN 10025 | – | – | 1 |  |
| EN 12390-2 | – | – | 1 |  |
| EN 12390-3 | – | – | 1 |  |
| EN 12390-13 | – | – | 2 |  |
| EN 12667 | – | – | 1 |  |
| EN 12697-22 | – | – | 1 |  |
| EN 13108 | – | – | 1 |  |
| EN 14081 | – | – | 1 |  |
| EN ISO 3219 | – | – | 1 |  |
| EN ISO 6892-1 | – | – | 2 |  |
| EN ISO 6946 | – | – | 2 |  |
| EN ISO 10456 | – | – | 5 |  |
| EN ISO 11357-4 | – | – | 1 |  |
| EN ISO 12570 | – | – | 2 |  |
| EN ISO 12572 | – | – | 3 |  |
| EN ISO 13788 | – | – | 1 |  |
| EN ISO 15148 | – | – | 2 |  |

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

