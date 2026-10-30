# Kennwert-Abgleich: gemeinsame und nicht zugeordnete Dateien

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Dateien (74):** `content/anleitung/Anleitung.json`, `content/aufgaben/Aufgaben.json`, `content/barrierefreiheit/Barrierefreiheit.json`, `content/bauchemie/Bauchemie.json`, `content/feedback/Feedback.json`, `content/lebensdauerbemessung/LebensdauerUebernehmen.json`, `content/modulstruktur/Modulstruktur.json`, `content/nachhaltigkeitchecklisten/NachhaltigkeitChecklisten.json`, `content/stahlbetoninstandhaltung/ChloridrechnerTab.json`, `content/stahlbetoninstandhaltung/En1504Tab.json`, `content/stahlbetoninstandhaltung/FortbildungTab.json`, `content/stahlbetoninstandhaltung/OsTab.json`, `content/stahlbetoninstandhaltung/ProdukteTab.json`, `content/stahlbetoninstandhaltung/RegelwerkeTab.json`, `content/stahlbetoninstandhaltung/RissinjektionTab.json`, `content/stahlbetoninstandhaltung/Stahlbetoninstandhaltung.json`, `content/stahlbetoninstandhaltung/TrTab.json`, `content/stahlbetoninstandhaltung/daten.json`, `content/versionen/Versionen.json`, `src/data/aufgabenData.ts`, `src/data/aufgabenQuizGruppen.ts`, `src/data/erkundung.ts`, `src/data/glossaryTerms.ts`, `src/data/kurzfassung.ts`, `src/data/kurzfragebogen.ts`, `src/data/lecturePollsData.ts`, `src/data/mischungBeispiele.ts`, `src/data/moduleOverviewsData.ts`, `src/data/normParams.ts`, `src/data/quizData.ts`, `src/data/rechnerGrenzen.ts`, `src/data/standards/din1045_2.ts`, `src/data/standards/din1045_3.ts`, `src/data/standards/din_en_197.ts`, `src/data/standards/eurocode2.ts`, `src/data/standards/index.ts`, `src/data/tasks/bauphysikTasks.ts`, `src/data/tasks/bauprodukteTasks.ts`, `src/data/tasks/baustoffeTasks.ts`, `src/data/tasks/bestandTasks.ts`, `src/data/tasks/betonTasks.ts`, `src/data/tasks/dauerhaftigkeitTasks.ts`, `src/data/tasks/digitalesTasks.ts`, `src/data/tasks/holzbauTasks.ts`, `src/data/tasks/komplexTasks.ts`, `src/data/tasks/laborTasks.ts`, `src/data/tasks/massivbauTasks.ts`, `src/data/tasks/mechanikTasks.ts`, `src/data/tasks/nachhaltigkeitTasks.ts`, `src/data/tasks/rueckbauTasks.ts`, `src/data/ttzKurse.ts`, `src/modules/Admin.tsx`, `src/modules/Anleitung.tsx`, `src/modules/Aufgaben.tsx`, `src/modules/Barrierefreiheit.tsx`, `src/modules/Bauchemie.tsx`, `src/modules/Datenschutz.tsx`, `src/modules/Feedback.tsx`, `src/modules/Impressum.tsx`, `src/modules/Modulstruktur.tsx`, `src/modules/NachhaltigkeitChecklisten.tsx`, `src/modules/Stahlbetoninstandhaltung.tsx`, `src/modules/Startseite.tsx`, `src/modules/Versionen.tsx`, `src/modules/stahlbetoninstandhaltung/ChloridrechnerTab.tsx`, `src/modules/stahlbetoninstandhaltung/En1504Tab.tsx`, `src/modules/stahlbetoninstandhaltung/FortbildungTab.tsx`, `src/modules/stahlbetoninstandhaltung/OsTab.tsx`, `src/modules/stahlbetoninstandhaltung/ProdukteTab.tsx`, `src/modules/stahlbetoninstandhaltung/RegelwerkeTab.tsx`, `src/modules/stahlbetoninstandhaltung/RissinjektionTab.tsx`, `src/modules/stahlbetoninstandhaltung/TrTab.tsx`, `src/modules/stahlbetoninstandhaltung/daten.tsx`, `src/modules/stahlbetoninstandhaltung/hilfen.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 2 |
| (1) Kennwerte übereinstimmend | 20 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 10 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 16 (16) |
| (3) Normverweise / Hinweise | 645 / 12 |

## 1 Kennwerte gegen zentrale Konstanten

| Fundstelle | Wert im Text | zentral | Konstante | Ausschnitt |
|---|---|---|---|---|
| `src/data/erkundung.ts:11` | 0,3 kg CO₂e/kg (Text nennt fiktiv/Annahme) | 2,05 | `PK_NETTO_SENKE_KG` | …g?", "hinweis": "Standardeingaben: 10 kg/m³ Pflanzenkohle mit 80 % C, 0,3 kg CO₂e/kg, 320 kg/m³ CEM I, Reduktion 10 kg/m³.",… |
| `src/data/tasks/bestandTasks.ts:18` | 420 N/mm² | 500 | `BETONSTAHL.B500*.fyk` | …500 (f_yk = 500 N/mm²) gleichzusetzen: In der Nachrechnung ist f_yk = 420 N/mm² anzusetzen, Duktilität und Schweißeignu… |

Übereinstimmend (20): `A4_FAKTOR_EINZEL['lkw-heavy']` ×2, `A4_FAKTOR_EINZEL['zug']` ×2, `BAUSTAHL_EC3.S235.fy` ×1, `BETONSTAHL.B500*.fyk` ×1, `BSH_EN14080.GL28h.fmk` ×1, `CONCRETE['C25/30'].Ecm` ×1, `CONCRETE['C25/30'].fctm` ×1, `CONCRETE['C30/37'].fck` ×1, `CONCRETE['C30/37'].fctm` ×1, `E_BETONSTAHL` ×1, `FAKTOREN.*.fernwaerme.fp / FP_STROM` ×1, `FAKTOREN.*.strom.co2` ×2, `HOLZ_EN338.C24.fmk` ×1, `QNG_WG.premium` ×1, `ZEMENT_GWP_KG['CEM I']` ×3

### GWP- und Transportwerte ohne zentrale Zuordnung (Quelle im Modul prüfen)

| Fundstelle | Wert | Ausschnitt |
|---|---|---|
| `src/data/erkundung.ts:11` | 33,0 kg CO₂e/m³ | …chnete CO₂ steigt von 23,5 auf 29,3 kg/m³, die Minderung von 27,1 auf 33,0 kg CO₂e/m³ (von 12,7 auf 15,5 %). Der Rechner warn… |
| `src/data/erkundung.ts:11` | 40,9 kg CO₂e/m³ | …10 auf 20 kg/m³ verdoppeln?", "aufloesung": "Die Minderung steigt auf 40,9 kg CO₂e/m³ (19,2 %), allein aus der Netto-Senke de… |
| `src/data/erkundung.ts:11` | 4,0 kg CO₂e/m³ | …,5 kg/m³. Die Einsparung durch 10 kg weniger Zement sinkt von 6,7 auf 4,0 kg CO₂e/m³, die Minderung insgesamt auf 24,5 kg CO… |
| `src/data/erkundung.ts:11` | 24,5 kg CO₂e/m³ | …Zement sinkt von 6,7 auf 4,0 kg CO₂e/m³, die Minderung insgesamt auf 24,5 kg CO₂e/m³. Bezogen auf den kleineren Zementanteil… |
| `src/data/erkundung.ts:11` | 128 kg CO₂e/m³ | …esamt auf 24,5 kg CO₂e/m³. Bezogen auf den kleineren Zementanteil von 128 kg CO₂e/m³ sind das 19,1 %, und die Kohle entspric… |
| `src/data/erkundung.ts:248` | 0,014 kg/(t·km) | …fällt von etwa 1275 auf 151 kg CO₂-Äq. (90 t Gesamtmasse, 0,118 statt 0,014 kg/(t·km) nach UBA 2024), der Kennwert sinkt aber… |
| `src/data/erkundung.ts:318` | 245 kg CO₂-Äq./m³ | …≈ 13 dm³ (≈ 34 kg) ab, und die CO₂-Abschätzung steigt von ≈ 219 auf ≈ 245 kg CO₂-Äq./m³ (+12 %). Der Zement verursacht mit 0,66… |
| `src/data/erkundung.ts:371` | 665 kg CO₂-eq/t | …, bleibt aber groß. Der spezifische GWP-Wert von 260 (Lehrwert) statt 665 kg CO₂-eq/t (VDZ-Branchen-EPD, netto) wiegt den höh… |
| `src/data/moduleOverviewsData.ts:556` | 0,8–0,9 t CO₂ je m³ | …mpfdiffusion) und Nachhaltigkeit (biogener Kohlenstoff, Größenordnung 0,8–0,9 t CO₂ je m³ Nadelholz).', |
| `src/data/rechnerGrenzen.ts:431` | 120 g/kWh | …nlage 9, Fassung 2027); Fernwärme bis 2026 mit Lehrwerten f_p 0,4 und 120 g/kWh; das neue Referenzgebäude ist nicht abg… |

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/data/normParams.ts:11` | `0.15` | – | `CRdc_Querkraft: 0.15 / 1.5,` |
| `src/data/normParams.ts:11` | `1.5` | – | `CRdc_Querkraft: 0.15 / 1.5,` |
| `src/data/normParams.ts:12` | `0.0525` | – | `vmin_faktor: 0.0525 / 1.5 /* d<=600 mm */,` |
| `src/data/normParams.ts:12` | `1.5` | – | `vmin_faktor: 0.0525 / 1.5 /* d<=600 mm */,` |
| `src/data/normParams.ts:13` | `0.16` | – | `rhoWmin: (fctm: number, fyk: number) => (0.16 * fctm) / fyk,` |
| `src/data/normParams.ts:20` | `0.18` | – | `CRdc_Durchstanz: 0.18 / 1.5,` |
| `src/data/normParams.ts:20` | `1.5` | – | `CRdc_Durchstanz: 0.18 / 1.5,` |
| `src/data/normParams.ts:22` | `0.15` | – | `AsMinStuetze: (NEd: number, fyd: number) => (0.15 * Math.abs(NEd)) / fyd,` |
| `src/data/normParams.ts:23` | `30` | – | `e0Min_mm: (h: number) => Math.max(h / 30, 20),` |
| `src/data/normParams.ts:38` | `0.3` | – | `h_mm <= 300 ? 0.8 : h_mm >= 800 ? 0.5 : 0.8 - (0.3 * (h_mm - 300)) / 500,` |
| `src/data/normParams.ts:38` | `500` | – | `h_mm <= 300 ? 0.8 : h_mm >= 800 ? 0.5 : 0.8 - (0.3 * (h_mm - 300)) / 500,` |
| `src/data/standards/eurocode2.ts:320` | `1.15` | – | `f_yd: (f_yk: number) => f_yk / 1.15,` |
| `src/data/standards/eurocode2.ts:321` | `0.85` | – | `f_cd: (f_ck: number) => (0.85 * f_ck) / 1.50` |
| `src/data/standards/eurocode2.ts:321` | `1.50` | – | `f_cd: (f_ck: number) => (0.85 * f_ck) / 1.50` |
| `src/modules/Admin.tsx:287` | `2023` | – | `Fehlerfreie Gleichungen, aktuelle Normengeneration (2023/2024), DIN Media Links mit Monats-/Jahresausgaben.` |
| `src/modules/Admin.tsx:287` | `2024` | – | `Fehlerfreie Gleichungen, aktuelle Normengeneration (2023/2024), DIN Media Links mit Monats-/Jahresausgaben.` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 277 | – | – | 1 |  |
| DIN 488-1 | – | – | 2 |  |
| DIN 488 | – | – | 1 |  |
| DIN 488 | 1972 | – | 1 |  |
| DIN 1045-2 | – | Anhang E, Anhang L, Tab. F.2.1 | 38 |  |
| DIN 1045-2 | 2023 | – | 1 | Ausgaben uneinheitlich |
| DIN 1045-2 | 2023-08 | Abs. 5.2.5, Anhang E, Tab. F.2.2 | 16 | Ausgaben uneinheitlich |
| DIN 1045-3 | – | – | 9 |  |
| DIN 1045-3 | 2012 | – | 1 | Registry 2023-08 |
| DIN 1045-3 | 2023-08 | Tab. NA.1 | 8 |  |
| DIN 1045-100 | – | – | 2 |  |
| DIN 1045 | – | – | 9 |  |
| DIN 1045 | 1959 | – | 1 | Ausgaben uneinheitlich |
| DIN 1045 | 1978 | – | 1 | Ausgaben uneinheitlich |
| DIN 1076 | – | – | 2 |  |
| DIN 1076 | 2026-01 | – | 1 |  |
| DIN 1100 | – | – | 1 |  |
| DIN 1333 | – | – | 1 |  |
| DIN 4095 | – | – | 1 |  |
| DIN 4102 | – | – | 1 |  |
| DIN 4108-2 | – | – | 8 |  |
| DIN 4108-2 | 2013-02 | Abschn. 8 | 3 | Ausgaben uneinheitlich; Registry 2026-05 |
| DIN 4108-2 | 2026-05 | – | 1 | Ausgaben uneinheitlich |
| DIN 4108-3 | – | – | 15 |  |
| DIN 4108-3 | 2024-03 | – | 3 | Ausgaben uneinheitlich |
| DIN 4108 | – | – | 1 |  |
| DIN 4109-1 | – | – | 3 |  |
| DIN 4109-1 | 2018 | – | 2 |  |
| DIN 4109-2 | – | – | 6 |  |
| DIN 4109-32 | – | – | 8 |  |
| DIN 4109-32 | 2016-07 | – | 1 |  |
| DIN 4109-33 | – | – | 1 |  |
| DIN 4109-34 | – | – | 2 |  |
| DIN 4109 | – | – | 1 |  |
| DIN 4109 | 1989 | – | 2 | Ausgaben uneinheitlich |
| DIN 4109 | 2018 | – | 1 | Ausgaben uneinheitlich |
| DIN 4134-1 | – | – | 1 |  |
| DIN 4226-101 | – | – | 1 |  |
| DIN 5008 | – | – | 1 |  |
| DIN 18007 | – | – | 1 |  |
| DIN 18007 | 2022-09 | – | 1 |  |
| DIN 18008 | – | – | 3 |  |
| DIN 18041 | – | – | 3 |  |
| DIN 18134 | – | – | 1 |  |
| DIN 18196 | – | – | 4 |  |
| DIN 18197 | – | – | 1 |  |
| DIN 18218 | – | – | 3 |  |
| DIN 18218 | 2010-01 | – | 1 |  |
| DIN 18533-1 | – | – | 1 |  |
| DIN 18533-2 | – | – | 1 |  |
| DIN 18533 | – | – | 3 |  |
| DIN 18540 | – | – | 3 |  |
| DIN 18940 | – | – | 2 |  |
| DIN 18940 | 2023-06 | – | 1 |  |
| DIN 18947 | – | – | 1 |  |
| DIN 18960 | – | – | 2 |  |
| DIN 20000-401 | – | – | 1 |  |
| DIN 68800-1 | – | – | 1 |  |
| DIN 68800-2 | – | – | 1 |  |
| DIN 68800-4 | – | – | 2 |  |
| DIN 68800 | – | – | 1 |  |
| DIN CEN/TS 19102 | – | – | 1 |  |
| DIN SPEC 91525 | – | – | 1 |  |
| DIN TS 18599-10 | – | – | 1 |  |
| DWA-A 138-1 | – | – | 2 |  |
| DWA-A 138-1 | 2024-10 | – | 2 |  |
| EN 196-1 | – | – | 2 |  |
| EN 197-1 | – | – | 9 |  |
| EN 197-1 | 2011-11 | Tab. 2 | 5 |  |
| EN 197-5 | – | – | 1 |  |
| EN 197-5 | 2021-07 | – | 5 |  |
| EN 197 | – | – | 3 |  |
| EN 204 | – | – | 3 |  |
| EN 206-1 | – | – | 5 |  |
| EN 206 | – | Tab. 14 | 24 |  |
| EN 206 | 2021-06 | – | 3 |  |
| EN 301 | – | – | 2 |  |
| EN 338 | – | – | 6 |  |
| EN 384 | – | – | 1 |  |
| EN 450-1 | – | – | 1 |  |
| EN 459-1 | – | – | 2 |  |
| EN 459 | – | – | 1 |  |
| EN 520 | – | – | 1 |  |
| EN 771-1 | – | – | 1 |  |
| EN 772-7 | – | – | 1 |  |
| EN 772-21 | – | – | 1 |  |
| EN 828 | – | – | 1 |  |
| EN 923 | – | – | 2 |  |
| EN 934-2 | – | – | 2 |  |
| EN 1279 | – | – | 1 |  |
| EN 1427 | – | – | 1 |  |
| EN 1504-2 | – | – | 4 |  |
| EN 1504-3 | – | – | 6 |  |
| EN 1504-5 | – | – | 19 |  |
| EN 1504-9 | – | Tab. 1 | 5 |  |
| EN 1504-10 | – | – | 1 |  |
| EN 1504 | – | – | 26 |  |
| EN 1542 | – | – | 2 |  |
| EN 1990-2 | 2026 | – | 5 |  |
| EN 1990 | – | Anhang D, Gl. 6.10 | 10 |  |
| EN 1991-1-1 | – | – | 2 |  |
| EN 1991-1-6 | – | – | 1 |  |
| EN 1992-1-1/NA | – | Tab. 4.4DE | 5 |  |
| EN 1992-1-1/NA | 2013-04 | – | 3 |  |
| EN 1992-1-1 | – | Anhang C, Gl. 3.2 | 33 |  |
| EN 1992-1-1 | 2011-01 | Tab. 3.1 | 7 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2023 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1992-1-1 | 2025-09 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1992-1-2 | – | Abschn. 6 | 2 |  |
| EN 1993-1-1 | – | – | 5 |  |
| EN 1993-1-2 | – | – | 1 |  |
| EN 1993-1-4 | – | – | 1 |  |
| EN 1993-1-5 | – | – | 2 |  |
| EN 1993-1-9 | – | – | 1 |  |
| EN 1995-1-1 | – | Anhang B, Tab. 7.2 | 12 |  |
| EN 1995-1-2 | – | – | 3 |  |
| EN 1995-1-2 | 2010-12 | – | 1 |  |
| EN 1996-1-1 | – | Gl. 3.1 | 3 |  |
| EN 1996-3/NA | – | – | 2 |  |
| EN 1996-3/NA | 2019-12 | – | 1 |  |
| EN 10025-2 | – | – | 1 |  |
| EN 10025-2 | 2004 | – | 1 | Ausgaben uneinheitlich |
| EN 10025-3 | – | – | 1 |  |
| EN 10025 | – | – | 1 |  |
| EN 10027-1 | – | – | 1 |  |
| EN 12004-1 | – | – | 1 |  |
| EN 12004 | – | – | 2 |  |
| EN 12350-5 | – | – | 2 |  |
| EN 12350-6 | – | – | 1 |  |
| EN 12350-7 | – | – | 2 |  |
| EN 12350-8 | – | – | 1 |  |
| EN 12350 | – | – | 1 |  |
| EN 12390-1 | – | – | 1 |  |
| EN 12390-2 | – | – | 1 |  |
| EN 12390-3 | – | – | 3 |  |
| EN 12390-5 | – | – | 1 |  |
| EN 12390-6 | – | – | 2 |  |
| EN 12390-12 | – | – | 3 |  |
| EN 12390-13 | – | – | 1 |  |
| EN 12504-1 | – | – | 3 |  |
| EN 12504-2 | – | – | 1 |  |
| EN 12504-2 | 2021-10 | – | 1 |  |
| EN 12504 | – | – | 2 |  |
| EN 12620 | – | – | 5 |  |
| EN 12697-5 | – | – | 1 |  |
| EN 12697-8 | – | – | 1 |  |
| EN 12697-34 | – | – | 1 |  |
| EN 13141 | – | – | 1 |  |
| EN 13263-1 | – | – | 1 |  |
| EN 13501-1 | – | – | 1 |  |
| EN 13501 | – | – | 1 |  |
| EN 13670 | – | Tab. M | 6 |  |
| EN 13670 | 2011-03 | Tab. 4 | 3 |  |
| EN 13791 | – | – | 22 |  |
| EN 13791 | 2020 | – | 1 |  |
| EN 13791 | 2020-02 | – | 1 |  |
| EN 14080 | – | – | 3 |  |
| EN 14411 | – | – | 3 |  |
| EN 14630 | – | – | 1 |  |
| EN 15167-1 | – | – | 1 |  |
| EN 15643 | – | – | 2 |  |
| EN 15651-1 | – | – | 2 |  |
| EN 15651-4 | – | – | 1 |  |
| EN 15651 | – | – | 2 |  |
| EN 15804 | – | – | 15 |  |
| EN 15978 | – | – | 7 |  |
| EN 16449 | – | – | 1 |  |
| EN 16516 | – | – | 1 |  |
| EN 16613 | – | – | 1 |  |
| EN 16627 | – | – | 1 |  |
| EN 16757 | – | – | 2 |  |
| EN 17472 | – | – | 1 |  |
| EN 17472 | 2024-06 | – | 1 | Ausgaben uneinheitlich |
| EN ISO 1461 | – | – | 2 |  |
| EN ISO 6946 | – | – | 8 |  |
| EN ISO 8407 | – | – | 1 |  |
| EN ISO 8501-1 | – | – | 1 |  |
| EN ISO 9001 | – | – | 1 |  |
| EN ISO 9001 | 2015-11 | – | 2 |  |
| EN ISO 9004 | 2018 | – | 1 |  |
| EN ISO 9223 | – | – | 1 |  |
| EN ISO 9224 | – | – | 1 |  |
| EN ISO 10077-1 | – | – | 2 |  |
| EN ISO 12570 | – | – | 1 |  |
| EN ISO 12696 | – | – | 6 |  |
| EN ISO 12696 | 2022-09 | – | 3 |  |
| EN ISO 12944-2 | – | – | 1 |  |
| EN ISO 12944-5 | – | – | 1 |  |
| EN ISO 12944 | – | – | 2 |  |
| EN ISO 13786 | – | – | 1 |  |
| EN ISO 14025 | – | – | 1 |  |
| EN ISO 14040 | – | – | 1 |  |
| EN ISO 14688-2 | – | – | 3 |  |
| EN ISO 14688 | – | – | 1 |  |
| EN ISO 15148 | – | – | 1 |  |
| EN ISO 16739 | – | – | 3 |  |
| EN ISO 19011 | 2018-10 | – | 1 |  |
| EN ISO 19650 | – | – | 1 |  |
| EN ISO 20887 | – | – | 1 |  |
| ISO 5725-2 | – | – | 2 |  |
| ISO 12696 | – | – | 1 |  |
| ISO 15686-1 | – | – | 1 |  |
| ISO 15686-5 | – | – | 2 |  |
| VDI 2067 | – | – | 1 |  |
| VDI 3492 | – | – | 1 |  |
| VDI 6200 | – | – | 5 |  |
| VDI 6202 | – | – | 6 |  |
| VDI 6205 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045:** 1937 (2×), 1959 (1×, teils mit Hinweis auf andere Ausgabe), 1972 (4×), 1978 (2×), 1988 (1×), 2023 (1×, teils mit Hinweis auf andere Ausgabe), 2023-08 (1×)
  - 1978: `src/data/tasks/bestandTasks.ts:18` – solution: '"B 25" nach DIN 1045:1978 (1972: „Bn 250“) bezeichnet eine Nennfe…
  - 1959 (mit Hinweis): `src/data/tasks/bestandTasks.ts:23` – …uen im Bestand: Umrechnung historischer Beton B 225 (Bezeichnung nach DIN 1045:1959)',
- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08 (mit Hinweis): `content/anleitung/Anleitung.json › texte.neuesteNormengenerationExpositionsklasse` – **Neueste Normengeneration:** Expositionsklassen nach DIN 1045-2:2023-08, Zementarten inkl. CEM II/C-M & CEM VI…
  - 2023 (mit Hinweis): `content/anleitung/Anleitung.json › texte.strikteNormengenerationDin1045` – Strikte Normengeneration (DIN 1045-2:2023, EC2, DIN EN 197). Vollständige Dimensi…
  - 2023-08: `content/anleitung/Anleitung.json › daten.Anleitung.regelwerke.0.title` – DIN 1045-2:2023-08 (Tragwerke aus Beton, Stahlbeton und Sp…
  - 2023-08 (mit Hinweis): `src/data/erkundung.ts:390` – …etzt (45 Vol.-% der groben Gesteinskörnung, Höchstwert für Typ 1 nach DIN 1045-2:2023-08, Anhang E). RC-Beton schont also vor al…
  - 2023-08: `src/data/normParams.ts:43` – quelle: "DIN 1045-2:2023-08 / DIN EN 206-1",
  - 2023-08: `src/data/normParams.ts:46` – kHuettensand: null as number \| null /* DIN 1045-2:2023-08, 5.2.5.2.5 enthält einen k-Wert-Ansatz…
  - 2023-08: `src/data/standards/din1045_2.ts:2` – * Zentrale Normen-Datenbank: DIN 1045-2:2023-08 & DIN EN 206:2021-06
  - 2023-08: `src/data/standards/din1045_2.ts:6` – * Quelle: DIN 1045-2:2023-08, Tabellen F.2.1, F.2.2 sowie DIN EN 206…
  - 2023-08: `src/data/standards/din1045_2.ts:30` – minZementgehalt: 0, // keine Anforderung (DIN 1045-2:2023-08)
  - 2023-08: `src/data/standards/din1045_2.ts:51` – anmerkung: 'Nach DIN 1045-2:2023-08: Anforderungen wie XC1 (max w/z = 0,75,…
  - 2023-08: `src/data/standards/din1045_2.ts:172` – anmerkung: 'Nach DIN 1045-2:2023-08 Tab. F.2.2 zwingend Luftporenbeton: min…
  - 2023-08: `src/data/standards/din1045_2.ts:239` – * k-Wert-Regeln für reaktive Betonzusatzstoffe nach DIN 1045-2:2023-08 Abs. 5.2.5
  - 2023-08: `src/data/standards/din1045_2.ts:242` – norm: 'DIN 1045-2:2023-08',
  - 2023-08: `src/data/standards/din1045_2.ts:249` – k: 1.00, // DIN 1045-2:2023-08, 5.2.5.2.3 (s ≤ 0,11·z); bei XF2/XF4 An…
  - 2023-08: `src/data/standards/din1045_2.ts:261` – * nach DIN 1045-2:2023-08 Tab. F.2.2
  - 2023-08: `src/data/standards/index.ts:3` – * - DIN 1045-2:2023-08 & DIN EN 206:2021-06 (Expositionsklasse…
  - 2023-08 (mit Hinweis): `src/modules/Anleitung.tsx:42` – …(unter strikter Einhaltung der aktuellen Normengeneration wie DIN 1045-2:2023-08, DIN EN 197-1/5, Eurocode 2) und bietet…
- **DIN 4108-2:** 2013-02 (25×, teils mit Hinweis auf andere Ausgabe), 2026-05 (10×, teils mit Hinweis auf andere Ausgabe)
  - 2013-02: `src/data/kurzfassung.ts:694` – …ulichen sommerlichen Wärmeschutz zu begrenzen; nachgewiesen wird nach DIN 4108-2:2013-02, Abschnitt 8, für den kritischen Raum."…
  - 2026-05 (mit Hinweis): `src/data/kurzfassung.ts:698` – …öchstens 1200 Kh/a Übertemperaturgradstunden zulässig; die Neuausgabe DIN 4108-2:2026-05 gliedert den Abschnitt neu, das GModG v…
  - 2013-02: `src/data/rechnerGrenzen.ts:43` – …nneneintragskennwert eines Raums nach dem vereinfachten Verfahren der DIN 4108-2:2013-02 mit Prüfung der Verzichtsregeln.", "gre…
  - 2013-02 (mit Hinweis): `src/data/rechnerGrenzen.ts:43` – …Verzichtsregeln.", "grenzen": ["Tabellenwerte S1 bis S6 und F_C nach DIN 4108-2:2013-02 (Wiedergabe in KS-Planungshandbuch und…
- **DIN 4108-3:** 2018-10 (3×), 2024-03 (17×, teils mit Hinweis auf andere Ausgabe)
  - 2024-03: `src/data/rechnerGrenzen.ts:94` – …chungsbericht T 3288 (Fraunhofer IRB 2012); Abgleich mit dem Normtext DIN 4108-3:2024-03 offen (vorläufig).',
  - 2024-03: `src/data/rechnerGrenzen.ts:95` – 'Nicht abgebildet (DIN 4108-3:2024-03): Begrenzung des Verfahrens auf Höhenla…
  - 2024-03: `src/data/tasks/bestandTasks.ts:66` – …Schimmelpilzwachstum. Erforderlich ist ein hygrothermischer Nachweis (DIN 4108-3:2024-03 bzw. WTA-Merkblatt 6-5); bei Fachwerk s…
- **DIN 4109:** 1989 (3×), 1989-11 (1×, teils mit Hinweis auf andere Ausgabe), 2018 (2×)
  - 1989: `src/data/erkundung.ts:406` – …B: Gegen 50 dB ist der Nachweis um 1,2 dB nicht erfüllt, gegen 53 dB (DIN 4109:1989) mit 1,8 dB Reserve erfüllt. Beide Anfo…
  - 1989: `src/data/rechnerGrenzen.ts:108` – …'Trittschall: zul. L′_n,w = 50 dB (DIN 4109-1:2018), 53 dB wählbar (DIN 4109:1989); ΔL_w-Näherung, K = 0,6 + 5,5·lg(m′_s/…
  - 2018: `src/data/tasks/bauphysikTasks.ts:63` – …: 'Schallschutz: Bauschalldämm-Maß R\'_w einer Kalksandsteinwand nach DIN 4109:2018',
- **EN 10025-2:** 2004 (1×), 2019-10 (2×)
  - 2004: `src/data/rechnerGrenzen.ts:144` – …elgesetz bei Raumtemperatur ohne Tertiärzementit; CEV-Grenzwerte nach EN 10025-2:2004 für Nenndicken ≤ 30 mm, die Schweißeign…
- **EN 17472:** 2022 (1×), 2024-06 (6×)
  - 2024-06: `src/data/kurzfassung.ts:547` – "DIN EN 17472:2024-06 regelt die Ökobilanz von Ingenieurbauwe…
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01: `content/anleitung/Anleitung.json › daten.Anleitung.regelwerke.2.title` – DIN EN 1992-1-1:2011-01 / NA:2013-04 (Eurocode 2: Bemessung und…
  - 2023: `src/data/kurzfassung.ts:288` – …e Versagenswahrscheinlichkeit von etwa 10 %; den Deckungstabellen der EN 1992-1-1:2023 liegt β = 1,5 zugrunde.",
  - 2011-01 (mit Hinweis): `src/data/standards/eurocode2.ts:2` – * Zentrale Normen-Datenbank: DIN EN 1992-1-1:2011-01 + A1:2015-03 (Eurocode 2, 1. Generation…
  - 2025-09: `src/data/standards/eurocode2.ts:5` – * ist DIN EN 1992-1-1:2025-09, siehe src/data/centralNormenRegistry.t…
  - 2011-01: `src/data/standards/eurocode2.ts:10` – * Quelle: DIN EN 1992-1-1:2011-01, Tab. 3.1 & DIN EN 1992-1-1/NA:2013-04
  - 2011-01: `src/data/standards/eurocode2.ts:32` – * Vollständige Kennwertematrix nach DIN EN 1992-1-1:2011-01 Tabelle 3.1
  - 2011-01: `src/data/standards/eurocode2.ts:311` – * Teilsicherheitsbeiwerte und Bemessungsbeiwerte nach DIN EN 1992-1-1:2011-01 & NA DE
  - 2011-01: `src/data/standards/eurocode2.ts:314` – norm: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 & DIN EN 1992-1-1/NA:2013-…
  - 2011-01: `src/data/standards/index.ts:5` – * - DIN EN 1992-1-1:2011-01 & NA DE:2013-04 (Eurocode 2 Tab. 3.1 Ke…

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- EN 1992-1-1:2023 (Registry 2011-01): `src/data/kurzfassung.ts:288` – …e Versagenswahrscheinlichkeit von etwa 10 %; den Deckungstabellen der EN 1992-1-1:2023 liegt β = 1,5 zugrunde.",
- DIN 4108-2:2013-02 (Registry 2026-05): `src/data/kurzfassung.ts:694` – …ulichen sommerlichen Wärmeschutz zu begrenzen; nachgewiesen wird nach DIN 4108-2:2013-02, Abschnitt 8, für den kritischen Raum."…
- DIN 4108-2:2013-02 (Registry 2026-05): `src/data/rechnerGrenzen.ts:43` – …nneneintragskennwert eines Raums nach dem vereinfachten Verfahren der DIN 4108-2:2013-02 mit Prüfung der Verzichtsregeln.", "gre…
- EN 1992-1-1:2025-09 (Registry 2011-01): `src/data/standards/eurocode2.ts:5` – * ist DIN EN 1992-1-1:2025-09, siehe src/data/centralNormenRegistry.t…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

