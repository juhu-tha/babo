# Kleinpunkte 02.11.2026

**Auftrag:** Offene Kleinpunkte aus `nachstichprobe3-2026-10-30.md`, `quiz-abgleich-2026-10-30.md`, `gegenpruefung-2026-10-30.md` und `gesamtlauf-2026-10-30.md` umsetzen. Prüfvermerke (`src/data/pruefvermerke.ts`) sind nicht geändert. Regressionstest `tests/kleinpunkte1102.test.ts` (Handrechnungen im Test, nicht aus den Kernen übernommen).

## Übersicht

| Nr. | Kennung | gewählte Fassung | Quelle | Status |
|---|---|---|---|---|
| 1 | NS3-MDB-2 Kalksandstein | ein Lehrwert `GWP_LEHRWERTE.kalksandstein` = 0,13 kg CO₂-Äq./kg (130 kg/t, KS-Planstein RDK 1,8, vorläufig) | Größenordnung Verbands-EPD Kalksandstein: „rund 126 kg CO₂ pro Tonne“ ([BV KSI, Folder Nachhaltigkeit](https://kalksandstein.de/media/user_upload/bvksi_folder_nachhaltigkeit.pdf)); ÖKOBAUDAT-Abgleich offen | umgesetzt |
| 2 | Biogener Kohlenstoff | Ausbuchung, sobald das Material das Produktsystem verlässt – Verbrennung ebenso wie stoffliche Verwertung (C1 bis C3 je nach Ende der Abfalleigenschaft, Beseitigung C4) | DIN EN 15804+A2; [ÖKOBAUDAT, Grundsätze Anhang B, 2021-12-02, Tab. 5](https://www.oekobaudat.de/fileadmin/downloads/Einreichung/2021-12-02_Grundsaetze_OEBD_AnhangB_Entsorgungsverfahren.pdf) (wie NS3-MDB-1) | umgesetzt |
| 3 | WeitereOrganik Variable | `十YearsDegradation` → `abbauJe10Jahre` | – | umgesetzt |
| 4 | `q_hp_1` PCB | Erklärung um AIR-Richtwerte ergänzt: RW I 80 ng/m³, RW II (Gefahrenwert) 800 ng/m³ für PCB gesamt (Σ PCB6 · 5); aktuelle Fassung ist die von 2025 | [AIR, Richtwerte für PCB, Bundesgesundheitsblatt 2025, 68:201–218 (online 14.01.2025)](https://dguv.de/medien/ifa/de/pra/ira/air_pcb_2025.pdf) | umgesetzt |
| 5 | NS3-WO-4 PAV | „Langzeitalterung im Gebrauch – etwa 5 bis 10 Jahre Feldalterung – … (Literaturangabe nach AASHTO R 28 bzw. ASTM D6521)“, dazu Eintrag in der Literaturliste | [Controls Group, PAV](https://old.controls-group.com/eng/ageing/pressure-ageing-vessel-pav.php) und [Matest, PAV](https://www.matest.com/fr/bitume/superpave/pav): „simulate … aging … after 5 to 10 years“ (AASHTO R28, ASTM D6521, EN 14769) | umgesetzt |
| 6 | NS3-ST-1 Statistik | Beispiel 1 als „allgemeine Prüfserie aus zehn Probekörpern“; Hinweis: für Bestandsbeton aus Bohrkernen gilt DIN EN 13791 – siehe Modul Bauwerksdiagnose | Nachstichprobe 3, NS-BD-1 | umgesetzt |
| 7 | Gesamtlauf O-1 ‰ | nichts geändert – die Warnung lässt sich weder mit `\text{‰}` noch mit `strict` abstellen | KaTeX 0.16.47, eigener Versuch | geprüft, belassen |
| 8 | Gegenprüfung Hinweise | Excel: (w/z)_eq statt w/z, Dezimalkomma; k-Wert nur Flugasche. BIM: GWP-Regler-Raster 1 (Voreinstellungen auf dem Raster), Stahl bis 23 000 kg/m³ | Gegenprüfung 30.10., Abschnitte 1 und 3 | umgesetzt |

## 1. NS3-MDB-2 Kalksandstein

Vorher drei Werte im Modul `materialdatenbanken`: Beispiel 1 0,13 kg/kg, QNG-Tabelle 110 kg/t, Quiz `q_dg_db_6` 0,12 kg/kg. Gewählt ist 0,13 kg/kg: Der öffentlich genannte Verbandswert „rund 126 kg CO₂ je t“ rundet auf zwei Stellen zu 0,13, und das Rechenbeispiel des Moduls nutzte bereits 0,13 (Folgewerte 40,95 und 50,1 bleiben).

- `src/data/gwpLehrwerte.ts`: neuer Eintrag `kalksandstein` (Einheit t, 130 kg CO₂-Äq./t, Rohdichte 1800, `vorlaeufig: true`) mit Quellkommentar.
- `src/modules/Materialdatenbanken.tsx`: QNG-Tabelle liest `GWP.kalksandstein.gwp` (110 → 130 kg/t).
- Beispiel 1 (`content/materialdatenbanken/Materialdatenbanken.json`): bleibt 0,13; JSON kann nicht importieren, der Test vergleicht den Text mit dem Lehrwert.
- Quiz `q_dg_db_6`: 0,12 → 0,13; 315 · 0,13 = 40,95 ≈ **41,0** kg CO₂-Äq./m²; Distraktoren 10 cm → 23,4, 1,75 m → 409,5 ≈ 410, 1,75 cm → 4,1. `verified: false`, Vermerk „Umsetzung 02.11.: … – korrigiert“.
- `scripts/qa/kennwert-abgleich.mjs`: Referenz „Kalksandstein“ ergänzt (Test: 0,13 stimmt, 0,12 und 110 kg/t werden gemeldet).

## 2. Biogener Kohlenstoff

- Quiz `q_lca_1`: „Am Lebensende (C3/C4) … bei thermischer Verwertung wieder freigesetzt“ → Ausbuchung bei Verlassen des Produktsystems, auch bei stofflicher Verwertung (C1 bis C3, Beseitigung C4). Rückmeldung zu Distraktor 2 angeglichen. Die Antwort war richtig, die Frage stand schon auf `verified: false`; Vermerk neu.
- `content/materialpaesse/Materialpaesse.json` (`primärrohstoffDominanzSieNutzen`): „bei Verbrennung in C3 wieder ausgebucht“ → gleiche Fassung.
- Volltextsuche im Quiz: keine weitere Frage mit der engen Fassung.

## 3. Variable in `WeitereOrganik.tsx`

`十YearsDegradation` (vier Stellen) heißt jetzt `abbauJe10Jahre`. Rechnung und Anzeige sind unverändert. Der Test prüft, dass die Datei keine CJK-Zeichen mehr enthält.

## 4. `q_hp_1` PCB

Die Frage bleibt bei der Einordnung „nach PCB-Richtlinie“ (300/3000 ng/m³), die Antwort ist unverändert. Ergänzt ist der heutige Bewertungsmaßstab nach AIR 2025 (RW I 80, RW II 800 ng/m³, PCB gesamt = Σ PCB6 · 5): 1400 ng/m³ liegen darüber, es besteht unverzüglicher Handlungsbedarf. Die geprüfte aktuelle Fassung ist die AIR-Bekanntmachung von 2025 (online 14.01.2025). Die freigegebene Frage steht wieder auf `verified: false` (Inhalt geändert).

## 5. NS3-WO-4 PAV

`content/weitereorganik/WeitereOrganik.json` (`pressureAgingVesselSimuliert`): „subsequente, 10- bis 15-jährige Feld-Alterung“ → „im Anschluss an das RTFOT die Langzeitalterung im Gebrauch – etwa 5 bis 10 Jahre Feldalterung – unter hohem Sauerstoffdruck (2,1 MPa) bei 100 °C (Literaturangabe nach AASHTO R 28 bzw. ASTM D6521)“. In der Literaturliste des Moduls steht AASHTO R 28 / ASTM D6521. Gestützt auf zwei Prüfgeräte-Herstellerseiten, die beide 5 bis 10 Jahre mit AASHTO R28, ASTM D6521 und EN 14769 nennen. Der Normtext selbst wurde nicht eingesehen.

## 6. NS3-ST-1 Statistik

- `content/statistik/Statistik.json`: Titel „Beispiel 1: Charakteristischer Wert aus 10 Prüfwerten“; Gegeben: „Allgemeine Prüfserie aus zehn Probekörpern …“; Ergebnishinweis ergänzt: „Für die Druckfestigkeit von Bestandsbeton aus Bohrkernen gilt … DIN EN 13791 … – siehe Modul Bauwerksdiagnose.“
- Nachrechnung (unverändert): k_n(10) = 1,92 (V_X unbekannt), X_k = 38,2 − 1,92 · 3,1 = 32,25 → 32,2 N/mm², X_d = 32,2/1,5 = 21,5 N/mm²; n = 3: k_n = 3,37, X_k = 27,75 → 27,8 N/mm².
- Folgeänderung: Quiz `qn_statistik_1` fragte ebenfalls „Fünf Bohrkerne einer Bestandsdecke“ mit γ_M = 1,5 und verwies auf den alten Abschnittstitel. Jetzt „allgemeine Prüfserie aus fünf Probekörpern“, Abschnittstitel nachgezogen, Werte unverändert ((42,0 − 2,33 · 2,5)/1,5 = 24,1 N/mm²); `verified: false`.

## 7. Gesamtlauf O-1 (‰ in KaTeX)

Versuch mit KaTeX 0.16.47 (`renderToString`, `console.warn` mitgeschnitten):

| Eingabe | Option | Warnungen |
|---|---|---|
| `\char8240` | – | 1 („No character metrics … mode 'math'“) |
| `\text{‰}` | – | 2 (zusätzlich strict-Warnung „Unrecognized Unicode character“) |
| `\text{‰}` | `strict: 'ignore'` bzw. `false` | 1 („… mode 'text'“) |
| `\char8240` | `strict: false` | 1 |

Ursache: Der Hinweis „No character metrics“ steht in KaTeX `makeSymbol` und wird ohne Bedingung ausgegeben. `strict` steuert ihn nicht. Den Textmodus fängt KaTeX nur für unterstützte Schriftsysteme ab (CJK, Brahmi usw.), U+2030 gehört nicht dazu. `\text{‰}` macht es schlimmer. Abstellen ginge nur über Eingriffe in die Schriftmetriken (`__setFontMetrics`, interne Schnittstelle) oder über einen Filter für `console.warn`. Beides gehört nicht zum Auftrag. **Nichts geändert**, die Projektkonvention `\char8240` bleibt.

## 8. Hinweise der Gegenprüfung

**Excel-Mappe, Blatt „Aufgabe_Studierende“** (`content/lca/TransportbetonExcelExport.json`):
- Bemerkung Wasser: „(w/z) = 155 / 290 = 0.53“ → „(w/z)_eq = 155 / (290 + 0,4 · 40) = 0,51“ (0,5065 ≤ 0,55; der Grenzwert gilt für den äquivalenten Wert).
- Bemerkung Zusatzstoff: „k-Wert = 0.4 anrechenbar“ → „k-Wert 0,4 nur für Flugasche anrechenbar (Gesteinsmehl ohne Anrechnung)“.
- Nicht geändert: Zementbezeichnungen „42.5 R“ in Zellen (Bezeichnung, kein Messwert).

**BIM-Regler** (`src/modules/BimBaustoffe.tsx`, neu `src/modules/bimbaustoffe/gwpRegler.ts`):
- Raster des GWP-Reglers für Beton, Holz und Mineralwolle 1 statt 5. Die Beton-Voreinstellung (heute 258 = 320 · 0,665 + 45, im Bericht noch 243) liegt damit auf dem Raster. Regler und IFC-Ausgabe zeigen denselben Wert.
- Stahl-Regler bis 23 000 statt 10 000 kg CO₂-Äq./m³ (Spanne bis rund 2,9 kg/kg · 7850 = 22 765). Raster 5, die Voreinstellung 8635 liegt darauf.
- Test: alle vier Voreinstellungen liegen im Bereich und auf dem Raster.
- Gesehen, nicht geändert (keine eindeutige Korrektur): Die Holz-Voreinstellung nutzt die Rohdichte 450 kg/m³, der BSH-Lehrwert −680 kg/m³ bezieht sich auf 480 kg/m³. Das betrifft nur die Rohdichte-Anzeige, nicht das GWP.

## Geänderte Dateien

| Datei | Punkt |
|---|---|
| `src/data/gwpLehrwerte.ts` | 1 |
| `src/modules/Materialdatenbanken.tsx` | 1 |
| `scripts/qa/kennwert-abgleich.mjs` | 1 |
| `src/data/quiz.json` (`q_dg_db_6`, `q_lca_1`, `q_hp_1`, `qn_statistik_1`) | 1, 2, 4, 6 |
| `content/materialpaesse/Materialpaesse.json` | 2 |
| `src/modules/WeitereOrganik.tsx` | 3 |
| `content/weitereorganik/WeitereOrganik.json` | 5 |
| `content/statistik/Statistik.json` | 6 |
| `content/lca/TransportbetonExcelExport.json` | 8 |
| `src/modules/BimBaustoffe.tsx`, `src/modules/bimbaustoffe/gwpRegler.ts` | 8 |
| `docs/pruefung/quiz-cluster-*.md` (neu erzeugt mit `scripts/pruefliste.ts`) | Quiz |
| `tests/kleinpunkte1102.test.ts` | alle |

## Zur Freigabe

Vier Quizfragen stehen wieder auf `verified: false` und erscheinen in den Prüflisten: `q_dg_db_6`, `q_lca_1`, `q_hp_1`, `qn_statistik_1`.
