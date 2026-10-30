# Kennwert-Abgleich: `ki_baustoffe`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `ki_baustoffe` (–, offen), `ki_llmpraxis` (KI im Bauwesen, offen), `ki_lokal` (KI im Bauwesen, geprueft), `ki_onlinekurse` (KI im Bauwesen, offen), `ki_prompting` (KI im Bauwesen, geprueft), `ki_recht_ethik` (KI im Bauwesen, offen), `ki_ressourcen` (KI im Bauwesen, geprueft), `ki_system` (KI im Bauwesen, geprueft), `ki_thesen` (KI im Bauwesen, offen), `ki_ueberblick` (KI im Bauwesen, offen)
- **Komponente:** `src/modules/KiBaustoffe.tsx`
- **Dateien (46):** `content/ki/FehlerRechtEthik.json`, `content/ki/KiDeklarationGuide.json`, `content/ki/KiGlossar.json`, `content/ki/KiOnlinekurse.json`, `content/ki/KiUeberblick.json`, `content/ki/LlmPraxis.json`, `content/ki/LlmPraxisTeile/BrowserTab.json`, `content/ki/LlmPraxisTeile/MarkdownTab.json`, `content/ki/LlmPraxisTeile/SkillsKonnektorenTab.json`, `content/ki/LlmPraxisTeile/VerzeichnisseTab.json`, `content/ki/LokaleKI.json`, `content/ki/ModelBenchmarkMatrix.json`, `content/ki/RagDemonstrator.json`, `content/ki/Systemarchitektur.json`, `content/ki/ToolsFuerThesen.json`, `content/ki/ueberblick/AusblickTab.json`, `content/ki/ueberblick/HistorieTab.json`, `content/ki/ueberblick/KernbegriffeTab.json`, `content/ki/ueberblick/PipelineTab.json`, `content/ki/ueberblick/StandTab.json`, `content/ki/ueberblick/VergleichTab.json`, `content/ki/ueberblick/daten.json`, `content/kibaustoffe/KiBaustoffe.json`, `src/modules/KiBaustoffe.tsx`, `src/modules/ki/FehlerRechtEthik.tsx`, `src/modules/ki/KiDeklarationGuide.tsx`, `src/modules/ki/KiGlossar.tsx`, `src/modules/ki/KiOnlinekurse.tsx`, `src/modules/ki/KiUeberblick.tsx`, `src/modules/ki/LlmPraxis.tsx`, `src/modules/ki/LlmPraxisTeile/BrowserTab.tsx`, `src/modules/ki/LlmPraxisTeile/MarkdownTab.tsx`, `src/modules/ki/LlmPraxisTeile/SkillsKonnektorenTab.tsx`, `src/modules/ki/LlmPraxisTeile/VerzeichnisseTab.tsx`, `src/modules/ki/LokaleKI.tsx`, `src/modules/ki/ModelBenchmarkMatrix.tsx`, `src/modules/ki/RagDemonstrator.tsx`, `src/modules/ki/Systemarchitektur.tsx`, `src/modules/ki/ToolsFuerThesen.tsx`, `src/modules/ki/ueberblick/AusblickTab.tsx`, `src/modules/ki/ueberblick/HistorieTab.tsx`, `src/modules/ki/ueberblick/KernbegriffeTab.tsx`, `src/modules/ki/ueberblick/PipelineTab.tsx`, `src/modules/ki/ueberblick/StandTab.tsx`, `src/modules/ki/ueberblick/VergleichTab.tsx`, `src/modules/ki/ueberblick/daten.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 3 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 1 (0) |
| (3) Normverweise / Hinweise | 182 / 3 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

### GWP- und Transportwerte ohne zentrale Zuordnung (Quelle im Modul prüfen)

| Fundstelle | Wert | Ausschnitt |
|---|---|---|
| `content/kibaustoffe/KiBaustoffe.json › daten.KiBaustoffeInhalt.schritte_14.1.erklaerung` | 0,36 kg CO₂/kWh | Emissionsfaktor des Strommixes als Lehrwert 0,36 kg CO₂/kWh (aktuellen UBA-Wert prüfen): |
| `src/data/quiz.json › q_ki_rs_2` | 0,36 kg CO₂/kWh | …e wird verbraucht? 0,175 kWh E = 0,35 kW · 0,5 h = 0,175 kWh; mit 0,36 kg CO₂/kWh rund 0,063 kg CO₂. |
| `src/data/quiz.json › q_ki_rs_3` | 0,36 kg CO₂/kWh | …ng braucht 0,175 kWh. Welche Emissionen ergeben sich mit dem Lehrwert 0,36 kg CO₂/kWh? etwa 0,063 kg CO₂ CO₂ = E · f = 0,… |

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/ki/LlmPraxis.tsx:100` | `0.30` | ja | `const costCached = (totalTokens / 1_000_000) * 0.30; // Prompt Caching: zwischengespeicherte Eingabe ca. 10 % des Listenpreises` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 276 | – | – | 1 |  |
| DIN 1045-2 | – | Abschn. 5.1.3, Anhang F | 20 |  |
| DIN 1045-2 | 2023 | Abs. 5.1.3 | 1 | Ausgaben uneinheitlich |
| DIN 1045-2 | 2023-08 | – | 1 | Ausgaben uneinheitlich |
| DIN 1045 | – | – | 7 |  |
| DIN 1054 | – | – | 1 |  |
| DIN 1076 | – | – | 10 |  |
| DIN 1076 | 2026-01 | – | 1 |  |
| DIN 1338 | – | – | 1 |  |
| DIN 4020 | – | – | 4 |  |
| DIN 4108-2 | – | – | 3 |  |
| DIN 4108 | – | – | 1 |  |
| DIN 18195-4 | – | – | 1 |  |
| DIN 18195 | – | – | 3 |  |
| DIN 18196 | – | – | 1 |  |
| DIN 18202 | – | – | 5 |  |
| DIN 18331 | – | – | 2 |  |
| DIN 18533-1 | 2017-07 | – | 1 | Ausgaben uneinheitlich |
| DIN 18533-1 | 2026-06 | – | 1 | Ausgaben uneinheitlich |
| DIN 18533 | – | – | 9 |  |
| DIN SPEC 92001 | – | – | 3 |  |
| EN 206-1 | – | – | 1 |  |
| EN 206 | – | Anhang F, Tab. F.2.1 | 28 |  |
| EN 450-1 | – | – | 1 |  |
| EN 1504-5 | – | – | 2 |  |
| EN 1504 | – | – | 1 |  |
| EN 1990-199 | – | – | 1 |  |
| EN 1990 | – | – | 5 |  |
| EN 1991-1-1 | – | – | 1 |  |
| EN 1991-1-3 | – | – | 1 |  |
| EN 1991 | – | – | 1 |  |
| EN 1992-1-1/NA | – | Abs. 4.4.1.2 | 4 |  |
| EN 1992-1-1/NA | 2013-04 | Tab. 4.4DE | 2 |  |
| EN 1992-1-1 | – | Abschn. 4.4.1.2 | 14 |  |
| EN 1992-1-1 | 2011 | – | 1 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2011-01 | – | 2 | Ausgaben uneinheitlich |
| EN 1992 | – | – | 3 |  |
| EN 1993-1-1 | – | – | 2 |  |
| EN 1997-1 | – | – | 1 |  |
| EN 1997-2 | – | – | 1 |  |
| EN 12004 | – | – | 2 |  |
| EN 12390-3 | – | – | 2 |  |
| EN 12390-9 | – | – | 1 |  |
| EN 12390-13 | – | – | 2 |  |
| EN 12390-16 | – | – | 1 |  |
| EN 12390 | – | – | 1 |  |
| EN 12620 | – | – | 1 |  |
| EN 13187 | – | – | 1 |  |
| EN 14080 | – | – | 1 |  |
| EN 15804 | – | – | 2 |  |
| EN 15978 | – | – | 1 |  |
| EN ISO 19650 | – | – | 4 |  |
| ISO 690 | – | – | 1 |  |
| ISO 8601 | – | – | 2 |  |
| ISO 16739 | – | – | 1 |  |
| ISO 19650 | – | – | 2 |  |
| VDI 2221 | – | – | 1 |  |
| VDI 2552 | – | – | 2 |  |
| VDI 4551 | – | – | 1 |  |
| VDI 6200 | – | – | 4 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008 (2×), 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (139×, teils mit Hinweis auf andere Ausgabe)
  - 2023: `content/ki/ueberblick/daten.json › daten.ragDemonstrations.rc_beton.rag.source` – DIN 1045-2:2023, Abs. 5.1.3 & DAfStb-RC-Richtlinie
  - 2023-08: `content/kibaustoffe/KiBaustoffe.json › werte.dinEn206Din` – DIN EN 206 / DIN 1045-2:2023-08 (Erstprüfung)
- **DIN 18533-1:** 2017-07 (2×, teils mit Hinweis auf andere Ausgabe), 2026-06 (4×, teils mit Hinweis auf andere Ausgabe)
  - 2026-06: `content/ki/FehlerRechtEthik.json › werte.din1853312026` – DIN 18533-1:2026-06 (Abdichtung von erdberührten Bauteilen)
  - 2017-07 (mit Hinweis): `content/ki/RagDemonstrator.json › daten.SAMPLE_CHUNKS.3.norm` – DIN 18533-1:2017-07 (Vorgängerausgabe; ersetzt durch 2026-0…
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01: `content/ki/FehlerRechtEthik.json › werte.dinEn19921` – DIN EN 1992-1-1:2011-01, 2.4.2.4 mit DIN EN 1992-1-1/NA:2013-04
  - 2011-01: `content/ki/ueberblick/daten.json › daten.termsData.rag.examples.0.process` – …e 4.4DE (Absatz 4.4.1.2) und Absatz 4.4.1.3 des Nationalen Anhangs zu DIN EN 1992-1-1:2011-01 ab.
  - 2011: `content/ki/ueberblick/daten.json › daten.ragDemonstrations.xc4.rag.text` – Nach DIN EN 1992-1-1:2011 (Eurocode 2), i. V. m. deutschem Nation…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

