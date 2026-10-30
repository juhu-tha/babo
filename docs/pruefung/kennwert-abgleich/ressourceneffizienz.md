# Kennwert-Abgleich: `ressourceneffizienz`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `ressourceneffizienz` (Rückbau & Schadstoffe, offen)
- **Komponente:** `src/modules/Ressourceneffizienz.tsx`
- **Dateien (2):** `content/ressourceneffizienz/Ressourceneffizienz.json`, `src/modules/Ressourceneffizienz.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 1 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 16 (11) |
| (3) Normverweise / Hinweise | 8 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

### GWP- und Transportwerte ohne zentrale Zuordnung (Quelle im Modul prüfen)

| Fundstelle | Wert | Ausschnitt |
|---|---|---|
| `src/data/quiz.json › qn_ressourceneffizienz_2` | 0,08 kg CO₂/(t·km) | …egionale Gesteinskörnung von 65 auf 15 km. Wie viel CO₂ spart das mit 0,08 kg CO₂/(t·km) nach dem Baustoff-Simulator? rund 115… |

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Ressourceneffizienz.tsx:150` | `2.4` | – | `const concreteMassTons = finalVolume * 2.4;` |
| `src/modules/Ressourceneffizienz.tsx:160` | `310` | – | `const baselineConcreteCo2 = baselineVolume * 310;` |
| `src/modules/Ressourceneffizienz.tsx:162` | `2.4` | – | `const baselineLogisticsCo2 = (baselineVolume * 2.4) * 65 * transportCo2PerTonKm;` |
| `src/modules/Ressourceneffizienz.tsx:162` | `65` | – | `const baselineLogisticsCo2 = (baselineVolume * 2.4) * 65 * transportCo2PerTonKm;` |
| `src/modules/Ressourceneffizienz.tsx:170` | `2.4` | – | `rawMass: formatDeZahl((finalVolume * 2.4), 0),` |
| `src/modules/Ressourceneffizienz.tsx:188` | `1.45` | ja | `const totalMassTons = projectSize * 1.45;` |
| `src/modules/Ressourceneffizienz.tsx:190` | `0.035` | ja | `const standardConstructionWasteTons = totalMassTons * 0.035;` |
| `src/modules/Ressourceneffizienz.tsx:195` | `38` | ja | `const standardDisposalCost = standardConstructionWasteTons * 38;` |
| `src/modules/Ressourceneffizienz.tsx:196` | `38` | – | `const optimizedDisposalCost = optimizedWasteTons * 38;` |
| `src/modules/Ressourceneffizienz.tsx:201` | `0.65` | ja | `const massiveMineralDemandTons = totalMassTons * 0.65; // 65% of building is mineralic` |
| `src/modules/Ressourceneffizienz.tsx:203` | `7.5` | – | `const materialCostSavings = rcSubstitutionTons * 7.5; // average savings rate with logistics optimization in Bavaria` |
| `src/modules/Ressourceneffizienz.tsx:206` | `0.085` | – | `const co2ReductionTons = projectSize * 0.085 * (recyclingUsage / 100 + wasteOptimization / 200); // estimation model` |
| `src/modules/Ressourceneffizienz.tsx:206` | `200` | – | `const co2ReductionTons = projectSize * 0.085 * (recyclingUsage / 100 + wasteOptimization / 200); // estimation model` |
| `src/modules/Ressourceneffizienz.tsx:207` | `65` | – | `const co2TaxSavings = co2ReductionTons * 65; // €65 per ton CO2-eq` |
| `src/modules/Ressourceneffizienz.tsx:210` | `8.5` | ja | `const fundingBonus = recyclingUsage >= 25 ? (projectSize * 8.5) : 0;` |
| `src/modules/Ressourceneffizienz.tsx:462` | `20` | – | `const complexScore = activeStrategy.innovationPercent / 20;` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | 2023-08 | Anhang E | 3 | Ausgaben uneinheitlich |
| EN 12620 | – | – | 2 |  |
| EN 13242 | – | – | 1 |  |
| VDI 4800 | – | – | 2 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008 (2×), 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (139×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/ressourceneffizienz/Ressourceneffizienz.json › texte.tAufbereitetenBauschuttUnd` – …rte Gesteinskörnung (Typ 1, 45 Vol.-% der groben Gesteinskörnung nach DIN 1045-2:2023-08, Anhang E; vorläufig) und vermeiden in…
  - 2023-08: `src/modules/Ressourceneffizienz.tsx:133` – // RC-Anteil: Höchstanteil der groben Gesteinskörnung nach DIN 1045-2:2023-08 Anhang E (Kern src/calc/rcGesteinskoern…
  - 2023-08: `src/modules/Ressourceneffizienz.tsx:844` – …IL[rcGruppe][rcTyp] * 100, 0)} Vol.-% der groben Gesteinskörnung nach DIN 1045-2:2023-08, Anhang E (vorläufig, Normprüfung ausst…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

