# Kennwert-Abgleich: `lca_ingenieurbau`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `lca_ingenieurbau` (Nachhaltigkeit, geprueft), `lca_rechner` (Nachhaltigkeit, geprueft), `lca_regulatorik` (Nachhaltigkeit, geprueft), `oekobilanz_lca` (Nachhaltigkeit, geprueft)
- **Komponente:** `src/modules/OekobilanzLCA.tsx`
- **Dateien (57):** `content/interactivelcacalc/CalculationDashboard.json`, `content/interactivelcacalc/InteractiveLCACalc.json`, `content/interactivelcacalc/ModulDLabor.json`, `content/interactivelcacalc/daten.json`, `content/lca/Bezugseinheit.json`, `content/lca/IngenieurbauLCA.json`, `content/lca/LCA.json`, `content/lca/TransportbetonExcelExport.json`, `content/lca/TransportbetonLcaUebung.json`, `content/nachhaltigkeit/AnhangChecklisten.json`, `content/nachhaltigkeit/AnhangDatenbanken.json`, `content/nachhaltigkeit/AnhangGlossarSoftware.json`, `content/nachhaltigkeit/AnhangPraxisbeispiele.json`, `content/nachhaltigkeit/AnhangUebungen.json`, `content/nachhaltigkeit/CbamRechner.json`, `content/nachhaltigkeit/CrremRegulatorik.json`, `content/nachhaltigkeit/CrremSimulator.json`, `content/nachhaltigkeit/Leitfaden.json`, `content/nachhaltigkeit/LeitfadenDgnbQng.json`, `content/nachhaltigkeit/LeitfadenEpdKonzepte.json`, `content/nachhaltigkeit/LeitfadenLcaBerechnung.json`, `content/nachhaltigkeit/Nachhaltigkeit.json`, `content/nachhaltigkeit/PraxisGebaeudetypE.json`, `content/nachhaltigkeit/PraxisInnovationen.json`, `content/nachhaltigkeit/QngNachweis.json`, `content/nachhaltigkeit/Wandkonfigurator.json`, `content/nachhaltigkeit/daten.json`, `content/oekobilanzlca/OekobilanzLCA.json`, `src/modules/InteractiveLCACalc.tsx`, `src/modules/LCA.tsx`, `src/modules/Nachhaltigkeit.tsx`, `src/modules/OekobilanzLCA.tsx`, `src/modules/interactivelcacalc/CalculationDashboard.tsx`, `src/modules/interactivelcacalc/ModulDLabor.tsx`, `src/modules/interactivelcacalc/daten.ts`, `src/modules/lca/BezugseinheitKasten.tsx`, `src/modules/lca/IngenieurbauLCA.tsx`, `src/modules/lca/TransportbetonExcelExport.ts`, `src/modules/lca/TransportbetonLcaUebung.tsx`, `src/modules/lca/transportbetonKennwerte.ts`, `src/modules/nachhaltigkeit/AnhangChecklisten.tsx`, `src/modules/nachhaltigkeit/AnhangDatenbanken.tsx`, `src/modules/nachhaltigkeit/AnhangGlossarSoftware.tsx`, `src/modules/nachhaltigkeit/AnhangPraxisbeispiele.tsx`, `src/modules/nachhaltigkeit/AnhangUebungen.tsx`, `src/modules/nachhaltigkeit/CbamRechner.tsx`, `src/modules/nachhaltigkeit/CrremRegulatorik.tsx`, `src/modules/nachhaltigkeit/CrremSimulator.tsx`, `src/modules/nachhaltigkeit/Leitfaden.tsx`, `src/modules/nachhaltigkeit/LeitfadenDgnbQng.tsx`, `src/modules/nachhaltigkeit/LeitfadenEpdKonzepte.tsx`, `src/modules/nachhaltigkeit/LeitfadenLcaBerechnung.tsx`, `src/modules/nachhaltigkeit/PraxisGebaeudetypE.tsx`, `src/modules/nachhaltigkeit/PraxisInnovationen.tsx`, `src/modules/nachhaltigkeit/QngNachweis.tsx`, `src/modules/nachhaltigkeit/Wandkonfigurator.tsx`, `src/modules/nachhaltigkeit/daten.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 6 |
| (1) Kennwerte übereinstimmend | 18 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 30 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 20 (20) |
| (3) Normverweise / Hinweise | 221 / 6 |

## 1 Kennwerte gegen zentrale Konstanten

| Fundstelle | Wert im Text | zentral | Konstante | Ausschnitt |
|---|---|---|---|---|
| `content/lca/LCA.json › texte.kmIstEinUmstieg` | 0,101 kg/tkm) | 0,014 | `A4_FAKTOR_EINZEL['zug']` | …um die Transportfracht um rund 85 % zu senken (UBA 2024: 0,014 statt 0,101 kg/tkm), oder beziehen Sie die Baustoffe aus We… |
| `content/nachhaltigkeit/AnhangUebungen.json › texte.gegebenIstEineTragende` | 0,10 kg CO₂-eq/kg (Text nennt fiktiv/Annahme) | 0,64 / 0,642 | `GWP_LEHRWERTE.betonstahl` | …Herstellungsfaktoren (Phasen A1–A3, fiktiv) lauten:<br>• GWP-Beton: **0,10 kg CO₂-eq/kg** • GWP-Bewehrungsstahl: **0,75 kg CO₂-… |
| `content/nachhaltigkeit/AnhangUebungen.json › texte.gegebenIstEineTragende` | 0,75 kg CO₂-eq/kg (Text nennt fiktiv/Annahme) | 0,64 / 0,642 | `GWP_LEHRWERTE.betonstahl` | …auten:<br>• GWP-Beton: **0,10 kg CO₂-eq/kg** • GWP-Bewehrungsstahl: **0,75 kg CO₂-eq/kg**.<br>Berechnen Sie das Gesamt-Herstell… |
| `src/modules/nachhaltigkeit/daten.ts:17` | −650 kg CO₂-Äq./m³) | 680 / 790 / 110 | `GWP_LEHRWERTE.bsh` | …gemeinsamen Lehrwerttabelle (Konsistenz 29.10.2026, F-4: 245, 195 und −650 kg CO₂-Äq./m³) |
| `src/data/quiz.json › qn_lca_rechner_1` | 0,15 kg CO₂/(t·km) | 0,101 | `A4_FAKTOR_EINZEL['lkw-heavy']` | …15 kg CO₂-Äq./m³, Rohdichte 2400 kg/m³. Transport A4: 100 km per LKW (0,15 kg CO₂/(t·km)). Bezug: 100 m² NRF und 50 Jahre. Welch… |
| `src/data/quiz.json › qn_lca_rechner_x_1` | 0,068 kg CO₂-Äq./(t·km) | 0,101 | `A4_FAKTOR_EINZEL['lkw-heavy']` | …kg Zement über 80 km und 1870 kg Gesteinskörnung über 25 km per Lkw (0,068 kg CO₂-Äq./(t·km)) zum Betonwerk gefahren. Wie groß ist d… |

Übereinstimmend (18): `A4_FAKTOR_EINZEL['lkw-heavy']` ×1, `A4_FAKTOR_EINZEL['lkw-light']` ×1, `A4_FAKTOR_EINZEL['zug']` ×1, `CONCRETE['C25/30'].fck_cube` ×1, `GWP_LEHRWERTE.betonC2530CemI / .betonC3037CemI` ×1, `GWP_LEHRWERTE.betonCemIIIA / .betonC3037CemIII` ×1, `GWP_LEHRWERTE.betonstahl` ×1, `GWP_LEHRWERTE.profilstahl` ×1, `QNG_WG.plus` ×2, `QNG_WG.premium` ×5, `ZEMENT_GWP_KG['CEM I']` ×1, `ZEMENT_GWP_KG['CEM III/A']` ×2

### GWP- und Transportwerte ohne zentrale Zuordnung (Quelle im Modul prüfen)

| Fundstelle | Wert | Ausschnitt |
|---|---|---|
| `content/interactivelcacalc/InteractiveLCACalc.json › werte.t015KgCo` | 0,118 kg CO₂-Äq./t·km | 0,118 kg CO₂-Äq./t·km (UBA 2024, Lkw-Mittel) |
| `content/interactivelcacalc/InteractiveLCACalc.json › werte.t003KgCo` | 0,014 kg CO₂-Äq./t·km | 0,014 kg CO₂-Äq./t·km (UBA 2024, Güterbahn) |
| `content/lca/Bezugseinheit.json › texte.umrechnungBeispiel` | 2,5 kg CO₂-Äq./kg | …CO₂-Äq./m². EPS 14 cm, deklarierte Einheit 1 kg, ρ = 20 kg/m³, 3,25 + 2,5 kg CO₂-Äq./kg (EPS-Lehrwert A1–A3 wie in allen Module… |
| `content/lca/LCA.json › texte.einWiederkehrenderStreitpunktIn` | -700  bis  -800  kg CO₂-eq pro m³ | …s **hochgradig negatives GWP-biogenic in Phase A1-A3** verbucht (ca. \$-700 bis -800 kg CO₂-eq pro m³\$). Das Gebäude startet rechentechnisch… |
| `content/lca/LCA.json › texte.eITextHerstellung` | 195  kg CO₂-eq / m³ | …tellung}\$: Spezifischer EPD-Faktor für A1-A3 aus der ÖKOBAUDAT (z.B. \$195 kg CO₂-eq / m³\$). |
| `content/lca/LCA.json › werte.ökostromLaden0004` | 0,004 kg/tkm | Ökostrom-Laden (0,004 kg/tkm, Lehrwert) |
| `content/lca/LCA.json › werte.h2Brennstoffzelle0003` | 0,003 kg/tkm | H2-Brennstoffzelle (0,003 kg/tkm, Lehrwert) |
| `content/nachhaltigkeit/AnhangPraxisbeispiele.json › texte.endenergieStromHeizungWarmwasser` | 0,43 kg CO₂-Äq./kWh | …18 kWh/(m²NRF·a). Emissionsfaktor Strommix (50 a gewichtet sinkend): 0,43 kg CO₂-Äq./kWh (Bezeichnung und Wert vorläufig, Normpr… |
| `content/nachhaltigkeit/AnhangUebungen.json › texte.gwpBeton550Kg` | 0,10 kg CO₂-eq/kg | GWP_Beton = 550 kg * 0,10 kg CO₂-eq/kg = 55,00 kg CO₂-eq/m² |
| `content/nachhaltigkeit/AnhangUebungen.json › texte.gwpStahl22Kg` | 0,75 kg CO₂-eq/kg | GWP_Stahl = 22 kg * 0,75 kg CO₂-eq/kg = 16,50 kg CO₂-eq/m² |
| `content/nachhaltigkeit/Wandkonfigurator.json › texte.t010KgCo` | 0,10 kg CO₂e/kg | 0,10 kg CO₂e/kg |
| `content/oekobilanzlca/OekobilanzLCA.json › daten.OekobilanzLCA.schritte.0.erklaerung` | 45 kg CO₂-Äq./m³ | …g); Gesteinskörnung, Wasser, Zusatzmittel und Werkstransport pauschal 45 kg CO₂-Äq./m³ (Restanteil aller Lehrbetone). Projektw… |
| `content/oekobilanzlca/OekobilanzLCA.json › daten.OekobilanzLCA.schritte.1.formel` | 258 kg CO₂-Äq./m³ | GWP = 320 · 0,665 + 45 = 257,8 \approx 258 kg CO₂-Äq./m³ |
| `content/oekobilanzlca/OekobilanzLCA.json › daten.OekobilanzLCA.schritte.2.formel` | 173 kg CO₂-Äq./m³ | GWP = 320 · 0,40 + 45 = 173 kg CO₂-Äq./m³ |
| `src/modules/interactivelcacalc/daten.ts:151` | 1,5 t CO₂-Äq./t | gwpD: -150, // Lehrwert: Nettoschrott (0,95 − 0,85) · ca. 1,5 t CO₂-Äq./t (vorläufig, Normprüfung ausstehend) |
| `src/modules/lca/transportbetonKennwerte.ts:11` | 0,068 kg CO₂-Äq./(t·km) | * Unterschied im Text ausweisen): 0,068 kg CO₂-Äq./(t·km) gilt für einen voll ausgelasteten 40-t-… |
| `src/modules/nachhaltigkeit/Wandkonfigurator.tsx:81` | 0,022 kg CO₂e/kg) | …18940) benötigt überhaupt keine klinkerspezifische Brennenergie (nur 0,022 kg CO₂e/kg). |
| `src/modules/nachhaltigkeit/daten.ts:20` | 1,20 kg CO₂-Äq./kg | // EPS 3,25 und Mineralwolle 1,20 kg CO₂-Äq./kg; vorher Glaswolle 0,96) |
| `src/data/quiz.json › qn_lca_rechner_1` | 15 kg CO₂-Äq./m³ | …Normalbeton C25/30 (CEM I) bilanziert: A1–A3 = 245 kg CO₂-Äq./m³, C = 15 kg CO₂-Äq./m³, Rohdichte 2400 kg/m³. Transport A4: 10… |
| `src/data/quiz.json › qn_lca_rechner_3` | 240 kg CO₂-Äq./m³ | In der Transportbeton-Übung sinkt das GWP A1–A5 von rund 240 kg CO₂-Äq./m³ (CEM I, 320 kg) auf rund 100 kg CO₂-Äq.… |
| `src/data/quiz.json › qn_lca_rechner_3` | 100 kg CO₂-Äq./m³ | …nkt das GWP A1–A5 von rund 240 kg CO₂-Äq./m³ (CEM I, 320 kg) auf rund 100 kg CO₂-Äq./m³ beim Preset mit CEM III/B (280 kg) und… |
| `src/data/quiz.json › qn_lca_rechner_3` | 0,665 kg CO₂-Äq./kg) | …hen zurückzuführen? Auf den Emissionsfaktor des Zements (0,26 statt 0,665 kg CO₂-Äq./kg). A1 Zement: 320 · 0,665 = 212,8 kg ge… |
| `src/data/quiz.json › qn_lca_rechner_3` | 72,8 kg CO₂-Äq./m³ | …₂-Äq./kg). A1 Zement: 320 · 0,665 = 212,8 kg gegenüber 280 · 0,26 = 72,8 kg CO₂-Äq./m³. Der Ersatz von 550 kg Primärkies durch… |
| `src/data/quiz.json › qn_lca_rechner_3` | 0,9 kg CO₂-Äq./m³ | …Primärkies durch RC-Kies spart dagegen nur 550 · (0,0035 − 0,0018) ≈ 0,9 kg CO₂-Äq./m³; A2-Transporte liegen bei rund 4–5 kg.… |
| `src/data/quiz.json › qn_lca_regulatorik_5` | 0,8 t CO₂ je t | Ein Importeur führt 1000 t Zement mit 0,8 t CO₂ je t Zement ein. Der EU-ETS-Preis beträgt 80… |
| `src/data/quiz.json › qn_lca_regulatorik_5` | 0,8 t CO₂/t | …CBAM-Kosten = Importmenge · GWP_spec · (P_ETS − P_Origin) = 1000 t · 0,8 t CO₂/t · (80 − 20) €/t CO₂ = 48 000 €. Der im… |
| `src/data/quiz.json › qn_lca_rechner_x_1` | 4,9 kg CO₂-Äq./m³ | …onwerk gefahren. Wie groß ist das GWP im Modul A2 je m³ Beton? rund 4,9 kg CO₂-Äq./m³ A2 = 0,320 t · 80 km · 0,068 + 1,870… |
| `src/data/quiz.json › qn_lca_rechner_x_1` | 4,9 kg CO₂-Äq./m³ | …2 = 0,320 t · 80 km · 0,068 + 1,870 t · 25 km · 0,068 = 1,74 + 3,18 ≈ 4,9 kg CO₂-Äq./m³. Die Massen sind in Tonnen einzusetzen,… |
| `src/data/quiz.json › qn_lca_rechner_fe2` | 5,0 kg CO₂-Äq./kg) | Eine Dämmschicht (deklarierte Einheit 1 kg; A1–A3 + C3/C4 = 5,0 kg CO₂-Äq./kg) hat ρ = 20 kg/m³, d = 0,15 m und eine N… |
| `src/data/quiz.json › qn_oekobilanz_lca_g1` | 45 kg CO₂-Äq./m³ | …, netto) und CEM III/A = 0,40 kg CO₂-Äq./kg (Lehrwert) sowie pauschal 45 kg CO₂-Äq./m³ für die übrigen Bestandteile: Um wie vi… |

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/InteractiveLCACalc.tsx:141` | `0.4` | – | `circularQuota: Math.min(25, mat.defaultCircularQuota * 0.4),` |
| `src/modules/InteractiveLCACalc.tsx:155` | `1.15` | – | `circularQuota: Math.min(100, Math.round(mat.defaultCircularQuota * 1.15)),` |
| `src/modules/InteractiveLCACalc.tsx:163` | `1.3` | – | `circularQuota: Math.min(100, Math.max(90, mat.defaultCircularQuota * 1.3)),` |
| `src/modules/LCA.tsx:968` | `0.3` | – | `{calcResults.gwpA4 > (calcResults.gwpA1A3 * 0.3) ? (` |
| `src/modules/Nachhaltigkeit.tsx:274` | `0.28` | – | `const pvYieldCo2Credit = Math.min(4.5, (pvSizeKwp * 0.28)); // CO2 displacement credits` |
| `src/modules/Nachhaltigkeit.tsx:333` | `2020` | – | `const t = (year - 2020) / 5;` |
| `src/modules/Nachhaltigkeit.tsx:334` | `52.0` | – | `return isOffice ? 52.0 - t * (52.0 - 38.0) : 35.0 - t * (35.0 - 26.0);` |
| `src/modules/Nachhaltigkeit.tsx:334` | `35.0` | – | `return isOffice ? 52.0 - t * (52.0 - 38.0) : 35.0 - t * (35.0 - 26.0);` |
| `src/modules/Nachhaltigkeit.tsx:337` | `2025` | – | `const t = (year - 2025) / 5;` |
| `src/modules/Nachhaltigkeit.tsx:338` | `38.0` | – | `return isOffice ? 38.0 - t * (38.0 - 18.0) : 26.0 - t * (26.0 - 15.0);` |
| `src/modules/Nachhaltigkeit.tsx:338` | `26.0` | – | `return isOffice ? 38.0 - t * (38.0 - 18.0) : 26.0 - t * (26.0 - 15.0);` |
| `src/modules/Nachhaltigkeit.tsx:341` | `2030` | – | `const t = (year - 2030) / 5;` |
| `src/modules/Nachhaltigkeit.tsx:342` | `18.0` | – | `return isOffice ? 18.0 - t * (18.0 - 10.0) : 15.0 - t * (15.0 - 8.0);` |
| `src/modules/Nachhaltigkeit.tsx:342` | `15.0` | – | `return isOffice ? 18.0 - t * (18.0 - 10.0) : 15.0 - t * (15.0 - 8.0);` |
| `src/modules/Nachhaltigkeit.tsx:345` | `2035` | – | `const t = (year - 2035) / 5;` |
| `src/modules/Nachhaltigkeit.tsx:349` | `2040` | – | `const t = (year - 2040) / 5;` |
| `src/modules/Nachhaltigkeit.tsx:353` | `2045` | – | `const t = (year - 2045) / 5;` |
| `src/modules/Nachhaltigkeit.tsx:354` | `1.5` | – | `return isOffice ? 1.5 - t * 1.5 : 1.2 - t * 1.2;` |
| `src/modules/Nachhaltigkeit.tsx:354` | `1.2` | – | `return isOffice ? 1.5 - t * 1.5 : 1.2 - t * 1.2;` |
| `src/modules/interactivelcacalc/CalculationDashboard.tsx:116` | `50` | – | `const pct = Math.min(50, (Math.abs(phase.value) / maxAbs) * 50);` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 276 | – | – | 3 |  |
| DIN 277-1 | 2021-08 | – | 1 |  |
| DIN 277 | – | – | 3 |  |
| DIN 277 | 2021-08 | – | 3 |  |
| DIN 1045-2 | – | – | 8 |  |
| DIN 1045-2 | 2023-08 | – | 2 | Ausgaben uneinheitlich |
| DIN 4109 | – | – | 1 |  |
| DIN 4226-101 | – | – | 2 |  |
| DIN 18015 | – | – | 1 |  |
| DIN 18940 | – | – | 12 |  |
| DIN 18940 | 2023-06 | – | 3 |  |
| DIN 18945 | – | – | 2 |  |
| DIN 18945 | 2024-03 | – | 1 |  |
| DIN 18946 | 2024-03 | – | 1 |  |
| DIN 18947 | 2024-03 | – | 1 |  |
| DIN 18948 | 2024-03 | – | 1 |  |
| DIN SPEC 91484 | – | – | 3 |  |
| DIN SPEC 91525 | – | – | 1 |  |
| DIN TS 18599 | 2025-10 | – | 1 |  |
| EN 197-1 | – | – | 1 |  |
| EN 197-5 | – | – | 1 |  |
| EN 206 | – | – | 2 |  |
| EN 1990 | – | – | 7 |  |
| EN 1996-1-1 | – | – | 1 |  |
| EN 1996 | – | – | 1 |  |
| EN 15643 | – | – | 2 |  |
| EN 15804 | – | – | 59 |  |
| EN 15804 | 2012 | – | 3 | Ausgaben uneinheitlich; Registry 2022-03 |
| EN 15804 | 2022-03 | Abschn. 3.9 | 3 | Ausgaben uneinheitlich |
| EN 15978 | – | – | 29 |  |
| EN 15978 | 2011 | Abschn. 3.14 | 1 | Registry 2026-09 |
| EN 15978 | 2012-10 | – | 1 | Registry 2026-09 |
| EN 15978 | 2026 | – | 1 |  |
| EN 15978 | 2026-09 | – | 2 |  |
| EN 16449 | – | – | 4 |  |
| EN 17472 | – | – | 26 |  |
| EN 17472 | 2022 | – | 1 | Ausgaben uneinheitlich; Registry 2024-06 |
| EN 17472 | 2024-06 | – | 5 | Ausgaben uneinheitlich |
| EN ISO 6946 | – | – | 2 |  |
| EN ISO 12944 | – | – | 1 |  |
| EN ISO 14040 | – | – | 3 |  |
| EN ISO 14040 | 2021-02 | – | 1 |  |
| EN ISO 14044 | – | – | 1 |  |
| ISO 14025 | – | – | 2 |  |
| ISO 14040 | – | – | 2 |  |
| ISO 14044 | – | – | 1 |  |
| ISO 15686-5 | – | – | 1 |  |
| VDI 6210 | – | – | 7 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/lca/TransportbetonExcelExport.json › daten.generateTransportbetonExcel.ws3_data.11.0` – …von Flugasche (k-Wert) 270 kg/m³ (vorläufig, Normprüfung ausstehend; DIN 1045-2:2023-08, Ökobilanz-Übung)
  - 2023-08: `src/modules/lca/TransportbetonLcaUebung.tsx:20` – * XC4/XD1/XF1, maßgebend XD1 nach DIN 1045-2:2023-08 mit (w/z)_eq ≤ 0,55 (vorher fest 0,50 o…
- **EN 15804:** 2012 (6×, teils mit Hinweis auf andere Ausgabe), 2022-03 (14×, teils mit Hinweis auf andere Ausgabe)
  - 2012: `content/interactivelcacalc/ModulDLabor.json › texte.quellenVerwertung` – Quellen: DIN EN 15804:2012+A2:2019, Anhang D (Formeln wiedergegebe…
  - 2012 (mit Hinweis): `content/lca/Bezugseinheit.json › texte.quellen` – …): DIN EN ISO 14040/14044:2006 (funktionelle Einheit, Referenzfluss); DIN EN 15804:2012+A2:2019, deutsche Fassung DIN EN 15804:…
  - 2022-03 (mit Hinweis): `content/lca/Bezugseinheit.json › texte.quellen` – …Einheit, Referenzfluss); DIN EN 15804:2012+A2:2019, deutsche Fassung DIN EN 15804:2022-03, Abschn. 3.9, 3.13 und 6.3.1–6.3.3; DIN…
  - 2022-03: `content/lca/TransportbetonExcelExport.json › daten.generateTransportbetonExcel.ws1_data.11.0` – - DIN EN 15804:2022-03 (Nachhaltigkeit von Bauwerken – EPD – G…
  - 2022-03: `content/oekobilanzlca/OekobilanzLCA.json › daten.OekobilanzLCA.regelwerke.1.title` – DIN EN 15804:2022-03 (EN 15804:2012+A2:2019+AC:2021; Umweltp…
  - 2012: `content/oekobilanzlca/OekobilanzLCA.json › daten.OekobilanzLCA.regelwerke.1.title` – DIN EN 15804:2022-03 (EN 15804:2012+A2:2019+AC:2021; Umweltproduktdeklarati…
- **EN 17472:** 2022 (1×), 2024-06 (6×)
  - 2024-06: `content/lca/IngenieurbauLCA.json › texte.dinEn174722024` – DIN EN 17472:2024-06
  - 2024-06: `content/lca/IngenieurbauLCA.json › texte.währendDieKlassischeDin` – …50 Jahre Betrachtungszeitraum regelt, schließt die europäische Norm **DIN EN 17472:2024-06** die Lücke für die gesamte Verkehrsinf…
  - 2024-06: `content/lca/LCA.json › texte.dinEn174722024` – DIN EN 17472:2024-06 (Ingenieurbauwerke & Infrastruktur)
  - 2024-06: `content/oekobilanzlca/OekobilanzLCA.json › daten.OekobilanzLCA.regelwerke.3.title` – DIN EN 17472:2024-06 (Bewertung der Nachhaltigkeit von Ingen…
  - 2022: `content/oekobilanzlca/OekobilanzLCA.json › daten.OekobilanzLCA.weblinks.3.title` – EN 17472:2022 – Vorschau mit Begriffen (Betrachtungsz…
  - 2024-06: `content/oekobilanzlca/OekobilanzLCA.json › daten.OekobilanzLCA.formeln.3.quelle` – DIN EN 17472:2024-06

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- EN 15804:2012 (Registry 2022-03): `content/interactivelcacalc/ModulDLabor.json › texte.quellenVerwertung` – Quellen: DIN EN 15804:2012+A2:2019, Anhang D (Formeln wiedergegebe…
- EN 15804:2012 (Registry 2022-03): `content/oekobilanzlca/OekobilanzLCA.json › daten.OekobilanzLCA.regelwerke.1.title` – DIN EN 15804:2022-03 (EN 15804:2012+A2:2019+AC:2021; Umweltproduktdeklarati…
- EN 17472:2022 (Registry 2024-06): `content/oekobilanzlca/OekobilanzLCA.json › daten.OekobilanzLCA.weblinks.3.title` – EN 17472:2022 – Vorschau mit Begriffen (Betrachtungsz…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

