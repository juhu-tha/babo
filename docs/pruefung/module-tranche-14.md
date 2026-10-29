# Modulprüfung Tranche 14 – KI im Bauwesen und Digitales (Befundliste zur Freigabe)

**Stand:** 29.10.2026 (Branch `pruefung/module-tranche14-10-29`, Basis origin/main fa954bfc)
**Status:** Vorschlag zur fachlichen Freigabe – noch nicht bestätigt.

> Nach der Freigabe eines Moduls wird in `src/data/pruefvermerke.ts` der Prüfvermerk „geprüft am …“ gesetzt (Passiv, ohne Namen). Mit dieser Befundliste wurden **keine** Prüfvermerke und **keine** Quizfragen geändert (keine Frage wird durch die Korrekturen falsch; geprüft u. a. `q_dg_db_5`, `q_dg_dpp_3`, `qn_dpp_1`).

## Vorgehen

- **Auswahl (13 Module):** Gruppe „KI im Bauwesen“ (`ki_system`, `ki_prompting`, `ki_llmpraxis`, `ki_thesen`, `ki_recht_ethik`, `ki_lokal`, `ki_ressourcen`, `ki_uebungen`) und Gruppe „Digitales“ (`online_tools`, `bim_baustoffe`, `materialdatenbanken`, `materialpaesse`, `dpp`). Die KI-Reiter teilen sich `src/modules/KiBaustoffe.tsx` (Anwendungsbeispiele und Prompt-Generator in `content/kibaustoffe/KiBaustoffe.json`) und je eine Teilkomponente in `src/modules/ki/`.
- **Prüfumfang je Modul:** Fachtext (Inhaltsdateien `content/**`, Textliterale der Komponenten), Rechts- und Normstand Oktober 2026, Anwendungsbeispiele mit Rechenweg, Lernziele/Kurzfassung, Quellen, Links (Linkprüfung `docs/linkcheck/2026-10.md`), Stellen „vorläufig, F-Freigabe“.
- **Nachrechnung:** Alle 32 Anwendungsbeispiele (je zwei pro Reiter bzw. Modul) und das Rechenblatt „Urban Mining Lab“ im Modul Materialpässe mit einem eigenen Python-Skript nachgerechnet – **alle richtig**. Das Lehrmodell des Urban Mining Lab ist dafür ohne Änderung des Rechenwegs nach `src/calc/materialpass.ts` ausgelagert; Regressionstest `tests/modulpruefungTranche14.test.ts` (vier Rechenfälle, Ergebniszahlen aller Beispiele in den Inhaltsdateien, Stahl-GWP-Lehrwert, QNG-Bilanzumfang).
- **Rechtsstand Oktober 2026:** KI-VO 2024/1689 mit Digital Omnibus (VO (EU) 2026/1744), DSGVO, UrhG §§ 44b/60d, ESPR 2024/1781, BauPVO 2024/3110, ISO 19650, ISO 16739-1:2024 (IFC 4.3). WebSearch sparsam genutzt (vier Recherchen), sonst Abgleich mit bereits im Projekt belegten Quellen.
- **Projektregeln:** In der App kommt „Claude“ nicht vor (geprüft). Die KI-Übungen nennen nur den „KI-Assistenten der Hochschule“. Modellangaben, Preise und Kontextlängen sind „Stand 10/2026“ gekennzeichnet oder allgemein formuliert. Normtextfragen sind nur gekennzeichnet.

## Übersicht

| Nr. | Modul | Rechnung | Empfehlung |
|---|---|---|---|
| 1 | `ki_system` | Beispiele (Kosinus, Neuron) | freigabefähig nach Korrektur T14-SY-1 bis -5 |
| 2 | `ki_prompting` | Beispiele (Tokenkosten, Kontextbudget) | freigabefähig nach Korrektur T14-PR-1 |
| 3 | `ki_llmpraxis` | Beispiele (Fehlerquote, Mehrheitsentscheid) | freigabefähig nach Korrektur T14-LP-1 bis -6 und Klärung von T14-LP-7 |
| 4 | `ki_thesen` | Beispiele (Precision/Recall, R²) | freigabefähig nach Korrektur T14-TH-1 bis -4 und Klärung von T14-TH-5 |
| 5 | `ki_recht_ethik` | Beispiele (KI-VO-Fristen, DSGVO-Bußgeld) | freigabefähig nach Korrektur T14-RE-1 und Klärung von T14-RE-2 |
| 6 | `ki_lokal` | Beispiele (Speicherbedarf, Quantisierung) | freigabefähig nach Korrektur T14-LK-1 bis -3 |
| 7 | `ki_ressourcen` | Beispiele (Benchmark-Unsicherheit, Strom/CO₂) | freigabefähig |
| 8 | `ki_uebungen` | Testfall U-Wert, Prüftext | freigabefähig nach Korrektur T14-UE-1 |
| 9 | `online_tools` | Beispiele (Holzbalken, Deckenlast) | freigabefähig nach Korrektur T14-OT-1 bis -4 |
| 10 | `bim_baustoffe` | Beispiele (Wand-GWP, U-Wert), IFC-Generator | freigabefähig nach Korrektur T14-BIM-1 bis -3 und Klärung von T14-BIM-4 |
| 11 | `materialdatenbanken` | Beispiele (Wand-GWP, Dämmstoff) | freigabefähig nach Korrektur T14-MDB-1 bis -4 und Klärung von T14-MDB-5 |
| 12 | `materialpaesse` | Urban Mining Lab (Zirkularität, C-Speicher, Restwert), Beispiele | freigabefähig nach Korrektur T14-MP-1 bis -4 |
| 13 | `dpp` | Beispiele (EPD-Module, PENRT) | freigabefähig nach Korrektur T14-DPP-1 bis -3 |

**Behobene Fehler (dieser PR):**
- **T14-BIM-1 (gewichtig):** GWP-Lehrwert Baustahl im IFC-Attributgenerator 1450 kg CO₂-Äq./m³ (= 0,18 kg/kg) → 5000 kg CO₂-Äq./m³ (≈ 0,64 kg/kg · 7850 kg/m³, ÖKOBAUDAT-Referenz wie in `src/data/rechnerGrenzen.ts`); Schieberegler 2000–10 000, Einheit „kg CO₂-Äq./m³“ statt „kg/m³“.
- **T14-MDB-1/-2 (gewichtig):** QNG-Bilanzumfang falsch (A4–A5, B4–B6, C1–C4) → A1–A3, B4, B6, C3/C4, D getrennt; die Rechenwerttabelle war als „Offizielle Standarddaten der Ökobau.dat / QNG-Rechenwerte“ bezeichnet, enthält aber gerundete Lehrwerte.
- **T14-MP-1/-2:** Modul D und biogener Kohlenstoff verwechselt („CO₂-Gegenbuchungen im Cradle-to-Grave-Lebenszyklus (Modul D)“); Musterpass als „OFFIZIELLES DGNB-BERICHTSFORMAT“ bezeichnet.
- **T14-DPP-1/-2:** „Integrierte Daten-Audits nach DIN SPEC 91484 & 91525“ (beide regeln Rückbau, keine DPP-Validierung); „Ohne DPP verliert das Produkt seine CE-Zulassung“; Planerpflicht zum Gebäuderessourcenpass.
- **T14-SY-1, T14-LP-5:** RAG, Websuche und Markdown „ohne Halluzination“ bzw. „halluzinationsfrei“ – sie verringern Halluzinationen, schließen sie aber nicht aus.
- **T14-TH-1/-2:** f_ck = f_cm − 1,64·s „nach DIN EN 206“ (Konformitätskriterium ist f_cm ≥ f_ck + 1,48·σ); Python-Beispiel mit `\v`/`\t` in normalen Zeichenketten (Beschriftung fehlerhaft) → Rohstrings.
- **T14-LP-1/-2:** „Textform ist nicht ausreichend“ (§ 4 Abs. 3 VOB/B, strittig); DWD-Daten „rechtssicher bei Schlechtwetteranzeigen“ (§ 6 Abs. 2 Nr. 2 VOB/B).
- weitere Einzelkorrekturen: T14-SY-2 bis -5, T14-PR-1, T14-LP-3/-4/-6, T14-TH-3/-4, T14-RE-1, T14-LK-1 bis -3, T14-UE-1, T14-OT-1 bis -4, T14-BIM-2/-3, T14-MDB-3/-4, T14-MP-3/-4, T14-DPP-3 (siehe Module).

---

## 1. Systemarchitektur der KI (`ki_system`)

**Prüfumfang:** `src/modules/ki/Systemarchitektur.tsx`, `content/ki/Systemarchitektur.json` (6-Schichten-Modell, sieben Technologien mit Mechanismus, Einsatzzwecken, Daten, Risiken), Einsteiger-Glossar `content/ki/KiGlossar.json`, Beispiele in `content/kibaustoffe/KiBaustoffe.json`.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| SY1 | a = (0,8; 0,6; 0), b = (0,6; 0,8; 0), c = (0; 0,6; 0,8) | cos(a,b) = 0,96; cos(a,c) = 0,36 (Einheitsvektoren) | identisch |
| SY2 | x = (1,2; 0,4), w = (0,8; −0,5), b = 0,1 | z = 0,86; σ(z) = 0,7027 | identisch (0,70) |

**Fakten-Stichprobe:** Attention-Formel (Vaswani et al. 2017), MSE, Kosinus-Ähnlichkeit, ReLU – richtig. ISO/IEC 22989:2022 und ISO/IEC 42001:2023 – richtig. Q4_K_M rund 70 % weniger Speicher als FP16 (4,85 statt 16 bit) – richtig. GAEB-Datenart X83 = Angebotsaufforderung ohne Preise – „bepreiste X83-Datei“ falsch. 80/20-Aufteilung mit k-facher Kreuzvalidierung – üblich.

**Befunde**
- **behoben – T14-SY-1:** „liefern normative Zitate aus Eurocodes ohne Halluzination“, „Quellentrunkene Wissenseinbettung … ohne Modell-Halluzination“ und im Glossar „halluzinationsfreie Befragung“, „nur anhand dieser geprüften Zitate“, „zitiert wörtlich“: RAG verringert Halluzinationen, schließt sie nicht aus (so auch der eigene Hinweis zu Beispiel 1). Formulierungen angepasst.
- **behoben – T14-SY-2:** „Fertig bepreiste GAEB DA XML (X83)“ → X84 (Angebotsabgabe); „η = 1.18 > 1.0“ → Dezimalkomma.
- **behoben – T14-SY-3:** Hardware „16–64 GB VRAM (RTX 4080/4090)“ (diese Karten haben 16 bzw. 24 GB) → allgemein „16–32 GB Grafikspeicher oder 32–128 GB gemeinsamer Speicher (Stand 10/2026)“; Kontextfenster „8000 bis 2 000 000 Tokens“ → „rund 8000 bis über 1 000 000 Tokens je nach Modell (Stand 10/2026)“.
- **behoben – T14-SY-4:** Literatur „Wendehorst Baustoffkunde: Werkstoffe, Prüfung und Dauerhaftigkeit (37. Auflage)“ gibt es nicht → Neroth/Vollenschaar (Hrsg.), 27. Aufl. 2011 (wie im übrigen Projekt).
- **behoben – T14-SY-5:** „Rechtlich belastbare“, „formal unangreifbare“, „unterschriftsreife“ Bedenkenanzeigen → Entwurf zur Prüfung durch die Bauleitung.
- Hinweis: Im Text werden Fachprogramme beim Namen genannt (Dlubal, Sofistik, Revit, Allplan, Qdrant, Chroma). Sie dienen als Beispiele; ob sie neutralisiert werden sollen, siehe Frage T14-SY-6.

**Umsetzung 29.10.2026 (T14-SY-6):** Entscheidung: in der Systemarchitektur neutral, im Werkzeugkatalog `online_tools` belassen. In `content/ki/Systemarchitektur.json` und `src/modules/ki/Systemarchitektur.tsx` ersetzt: „Statik-APIs (Dlubal, Sofistik)“ → „Programmierschnittstellen (APIs) von Statiksoftware“; „Statikprogramme (Dlubal, Sofistik), BIM-Server (Revit, Allplan)“ → „Statiksoftware, BIM-Autorenwerkzeuge bzw. BIM-Server“; „Vektordatenbanken (Qdrant, Chroma[, Pinecone])“ → „Vektordatenbanken“ (2 Stellen); „quelloffene Spitzenmodelle (Qwen, Llama, DeepSeek)“ → „Sprachmodelle mit offenen Gewichten“; „NVIDIA RTX VRAM oder Apple Unified Memory“ → „VRAM einer Grafikkarte oder gemeinsamer Arbeits- und Grafikspeicher“; „NVIDIA CUDA / Tensor Cores“ → „Grafikprozessoren mit Tensor-Kernen“; „GPU (CUDA)“ → „GPU“; „llama.cpp, Ollama oder LM Studio … (kompatibel zu OpenAI-Standards)“ → „quelloffene Inferenz-Laufzeitumgebungen … (meist kompatibel zu verbreiteten Cloud-KI-Schnittstellen)“. Verfahrensnamen (YOLO, Mask R-CNN, MCP, GGUF/Q4_K_M) bleiben als Fachbegriffe. Keine Quizfrage `ki_system` nennt die entfernten Namen. Quelle: Entscheidung vom 29.10.2026. Ergebnis: kein offener Punkt mehr.

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig nach Korrektur T14-SY-1 bis -5 (T14-SY-6 nicht blockierend).

- [ ] Modul freigeben (`ki_system`)

## 2. Prompting-Praxis (`ki_prompting`)

**Prüfumfang:** Prompt-Generator in `src/modules/KiBaustoffe.tsx` (vier Auswahlgruppen, erzeugter Prompt, Live-Analyse nur bei eingeschaltetem KI-Schalter), „Goldene Regeln“, Beispiele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| PR1 | 40 Seiten · 500 Wörter · 1,5 Token/Wort; 3 €/15 € je Mio. Token; 2000 Token Ausgabe | n_in = 30 000; K = 0,09 + 0,03 = 0,12 € | identisch |
| PR2 | Kontext 128 000 − 2000 − 8000; 750 Token/Seite | 118 000 Token → 157 Seiten | identisch |

**Fakten-Stichprobe:** DIN EN 12004 Klasse C2 TE S1, GL24h nach DIN EN 14080, Funk-&-Dinger-Modell, DIN EN 15804 – richtig. Tarifwerte sind als Lehrwerte „Stand 10/2026“ gekennzeichnet. Der Live-Lauf nennt den Dienst (Google Gemini) offen und verweist auf die Datenschutzerklärung (Transparenz nach Art. 50 KI-VO).

**Befunde**
- **behoben – T14-PR-1:** Tippfehler „edtierbar“.

**Empfehlung:** freigabefähig nach Korrektur T14-PR-1.

- [ ] Modul freigeben (`ki_prompting`)

## 3. LLM-Praxis (`ki_llmpraxis`)

**Prüfumfang:** `src/modules/ki/LlmPraxis.tsx` mit Teilen `LlmPraxisTeile/*` (Assistententypen, Skills & MCP, Markdown, Projektverzeichnisse, Browser/Web-Grounding, Vorlagen-Generator), Inhalte `content/ki/LlmPraxis*.json`, Beispiele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| LP1 | 6 von 50 Zitaten falsch; Bericht mit 200 Zitaten | p̂ = 0,12; E = 24 | identisch |
| LP2 | p = 0,8, drei unabhängige Abfragen | P = 0,512 + 0,384 = 0,896 | identisch |

**Fakten-Stichprobe:** VOB/B § 4 Abs. 7 mit Auftragsentziehung nach § 8 Abs. 3 – richtig. DIN 4108-2 f_Rsi ≥ 0,70 – richtig. Konformität DIN EN 206 bei stetiger Herstellung (15 Ergebnisse) f_cm ≥ f_ck + 1,48·σ und f_ci ≥ f_ck − 4 – richtig. MCP 2024 als offener Standard veröffentlicht – richtig. „Lost in the Middle“ (Liu et al.) – richtig. DIN 18533:2026-06 mit „Wasserbeanspruchungsklassen“ (Fachklärung 26.10., `docs/fachklaerung-2026-10-26.md`).

**Befunde**
- **behoben – T14-LP-1:** Skill-Vorlage Bedenkenanmeldung: „Textform ist nicht ausreichend“ – § 4 Abs. 3 VOB/B verlangt „schriftlich“; ob eine E-Mail genügt, ist umstritten (vereinbarte Schriftform, § 127 Abs. 2 BGB). Neu: schriftlich, Zugang nachweisbar sichern.
- **behoben – T14-LP-2:** DWD-Konnektor „rechtssicher bei Schlechtwetteranzeigen nach VOB/B § 6“ → Beleg für Behinderungsanzeigen nach § 6 Abs. 1; Witterung gilt nach § 6 Abs. 2 Nr. 2 nur als Behinderung, wenn bei Angebotsabgabe normalerweise nicht mit ihr zu rechnen war.
- **behoben – T14-LP-3:** „Wassereinwirkungsklasse“ in zwei Vorlagen → „Wasserbeanspruchungsklasse“ (DIN 18533:2026-06).
- **behoben – T14-LP-4:** „VOB/B § 15 (Bautagebuch & Stundenlohn)“ → Stundenlohnarbeiten.
- **behoben – T14-LP-5:** „verhindert Normen-Halluzinationen“, „Normenrecherche ohne Halluzinationen“, „kein Halluzinationsrisiko“, „fehlerfrei interpretiert“, „Rechtssichere VOB-Mängelrüge“ → abgeschwächt.
- **behoben – T14-LP-6:** Kontextauslastung ≤ 70 % als Quelle „Liu et al.“ → Faustwert, Effekt bei Liu et al.
- **offen – Frage T14-LP-7 (DIN 18202, Normtext):** Vorlage Bedenkenanmeldung: „Unebenheiten bis 22 mm auf 4 m (zulässig nach DIN 18202 Zeile 3: max. 10 mm)“. Für die Oberseite einer Bodenplatte, die einen Estrich aufnehmen soll, gilt nach meinem Kenntnisstand Tab. 3 Zeile 2 (12 mm bei 4 m); Zeile 3 betrifft flächenfertige Böden. Bitte am Normtext bestätigen.

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig nach Korrektur T14-LP-1 bis -6 und Klärung von T14-LP-7.

- [ ] Modul freigeben (`ki_llmpraxis`)

## 4. Tools für Thesen & Literatur (`ki_thesen`)

**Prüfumfang:** `src/modules/ki/ToolsFuerThesen.tsx`, `content/ki/ToolsFuerThesen.json` (Werkzeugkatalog, Literatur-Workflow, Prompt-Labor mit vier Szenarien, Deklarationsmatrix, Ehrenerklärung), `KiDeklarationGuide`, Beispiele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| TH1 | 40 Treffer, 22 relevant, 30 relevant bekannt | P = 0,55; R = 0,733 | identisch |
| TH2 | SS_res = 12, SS_tot = 150 | R² = 0,92 | identisch |

**Fakten-Stichprobe:** CDF-Test nach DIN EN 12390-9, Abwitterungsgrenze 1500 g/m² – richtig. Abstandsfaktor < 0,20 mm – richtig. Zotero, Better BibTeX, Writefull in Overleaf, Connected Papers, scite (Supporting/Contrasting/Mentioning) – richtig. Elicit „über 200 Millionen“ Publikationen – nicht belegt, Anbieterangabe wechselt.

**Befunde**
- **behoben – T14-TH-1:** „f_ck = f_cm − 1,64·s nach DIN EN 206“: 1,645 ist das 5-%-Quantil der Normalverteilung; das Konformitätskriterium der DIN EN 206 (stetige Herstellung) ist f_cm ≥ f_ck + 1,48·σ (wie im Modul LLM-Praxis).
- **behoben – T14-TH-2:** Python-Musterlösung „Prüfmaschinen-CSV“: `f"…$\varepsilon…"`, `"…\times…"` – `\v` und `\t` sind in normalen Python-Zeichenketten Steuerzeichen, die Achsenbeschriftung wird falsch. Auf Rohstrings (`r"…"`, `rf"…"`) umgestellt.
- **behoben – T14-TH-3:** „normgerechte LaTeX-Tabellen nach DIN 1338“ (DIN 1338 regelt Formelschreibweise und Formelsatz) → Tabellen und Formelsatz (Formelschreibweise nach DIN 1338); „Schwindmaß nach DIN 1048“ → Schwinden nach DIN EN 12390-16.
- **behoben – T14-TH-4:** Zulässigkeit „an den meisten Hochschulen (z. B. TH Augsburg, TU München, RWTH Aachen)“ → allgemein, maßgeblich Prüfungsordnung; „Täuschungsversuch (0 Punkte)“ → Bewertung „nicht ausreichend“ nach Prüfungsordnung; Elicit-Indexgröße und Research-Rabbit-Umfang mit „Stand 10/2026“.
- **offen – Frage T14-TH-5 (DIN EN 12390-13, Normtext):** Prompt und Musterlösung bestimmen den Sekantenmodul zwischen 0,05·f_cm und 0,33·f_cm aus der Bruchkurve. Die Norm misst nach meinem Kenntnisstand an eigenen Probekörpern mit Be- und Entlastungszyklen zwischen einer Unterspannung von etwa 0,10–0,15·f_c und f_c/3. Vorläufig als „vereinfacht in Anlehnung an DIN EN 12390-13“ gekennzeichnet. Grenzen am Normtext bestätigen?
- Hinweis: Das Deklarationsformular (`KiDeklarationGuide`) ist mit einem Prüfernamen vorbelegt (Platzhalterwert); ggf. durch „[Name]“ ersetzen.

**Umsetzung 29.10.2026 (Deklarationsformular):** Vorbelegung „Erstprüfer/in“ in `content/ki/KiDeklarationGuide.json` → „[Name]“ (Schlüssel `erstpruefungPlatzhalter`). App-weite Suche nach vorbelegten Personennamen in Formularen/Vorlagen (Vorbelegungen von Eingabefeldern und Mustervorlagen; Literaturangaben, Quellen, Impressum, Kontakt- und Verantwortlichenangaben ausgenommen): ebenso ersetzt in `content/bauschaeden/Bauschaeden.json` (Absender der Bedenkenanzeige „Ingenieurbüro [Name]“, 2 Stellen), `content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json` (Zeuge im Probenahmeprotokoll „[Name] (Untergeordnete Bodenschutzbehörde / Umweltamt)“), `content/bautagebuch/Bautagebuch.json` (Tragwerksplanung der drei Musterprojekte „… [Name]“, Eingabehilfe „z. B. [Name] ordnete …“). „Max Mustermann“ bleibt als üblicher Platzhalter. Test: `tests/modulpruefungTranche14.test.ts`. Ergebnis: kein offener Punkt mehr.

**Empfehlung:** freigabefähig nach Korrektur T14-TH-1 bis -4 und Klärung von T14-TH-5.

- [ ] Modul freigeben (`ki_thesen`)

## 5. Fehler, Recht & Ethik (`ki_recht_ethik`)

**Prüfumfang:** `src/modules/ki/FehlerRechtEthik.tsx`, `content/ki/FehlerRechtEthik.json` (Halluzinations-Praxisfälle, BGB/HOAI, KI-VO, DSGVO, GeschGehG, UrhG, Ethik, Risiko-Check), Beispiele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| RE1 | 20.10.2026 → 02.12.2027 | 408 Tage ≈ 13,4 Monate | identisch |
| RE2 | Umsatz 800 Mio. € bzw. 5 Mio. € | max(20; 32) = 32 Mio. €; max(20; 0,2) = 20 Mio. € | identisch |
| RE3 | σ = 25 N/mm², A = 0,15 m² (Praxisfall Einheiten) | N = 25 000 kN/m² · 0,15 m² = 3750 kN | identisch |

**Rechtsstand (Fakten-Stichprobe):** KI-VO in Kraft 01.08.2024, Verbote und KI-Kompetenz ab 02.02.2025, GPAI ab 02.08.2025, Art. 50 ab 02.08.2026 – richtig. Digital Omnibus: VO (EU) 2026/1744, angenommen 08.07.2026, ABl. 24.07.2026, in Kraft drei Tage danach (27.07.2026); Hochrisiko Anhang III ab 02.12.2027, Anhang I ab 02.08.2028; Übergang Art. 50 Abs. 2 für vor dem 02.08.2026 in Verkehr gebrachte Systeme bis 02.12.2026; neue Verbote (nicht einvernehmliche intime Deepfakes, Missbrauchsdarstellungen) – richtig ([Cuatrecasas, Digital Omnibus on AI has been published](https://www.cuatrecasas.com/en/spain/intellectual-property/art/digital-omnibus-ai-has-been-published)). OLG Hamburg, Urt. v. 10.12.2025 – 5 U 104/24 (Kneschke ./. LAION) – richtig ([Technology’s Legal Edge](https://www.technologyslegaledge.com/2025/12/robert-kneschke-v-laion-judgment-of-10-december-2025-ref-5-u-104-24/)). DSGVO Art. 4, 6, 28, 33 (72 h), 44 ff., 83 Abs. 2 und 5; § 2 Nr. 1 b GeschGehG; § 2 Abs. 2 UrhG; § 35a VwVfG; DIN 18533:2026-06 / DIN 18195 als Begriffsnorm – richtig. γ_c = 1,50, γ_s = 1,15, α_cc = 0,85 (NA DE) – richtig.

**Befunde**
- **behoben – T14-RE-1:** Praxisfall Teilsicherheitsbeiwerte: „gilt … ausnahmslos γ_c = 1,50“ widerspricht dem Projekt selbst (Bestandsbewertung mit γ_c,mod nach DBV-Merkblatt, Modul `historisch`). Neu: Neubau 1,50/1,15, Abminderungen nur in eigens geregelten Fällen. Fundstelle „NA Tabelle 2.1N“ → „2.4.2.4 mit DIN EN 1992-1-1/NA:2013-04“.
- **offen – Frage T14-RE-2 (Normtext):** Soll der Praxisfall zusätzlich die Abminderung für Fertigteile mit werksmäßiger Herstellung und ständiger Überwachung nennen (nach meinem Kenntnisstand im NA DE zu 2.4.2.4 vorgesehen, γ_c = 1,35)? Dann wäre der „falsche“ KI-Wert 1,35 in bestimmten Fällen richtig, und das Beispiel sollte auf einen eindeutig falschen Wert (z. B. γ_s = 1,10) fokussieren.
- Hinweis: „Frontier-Reasoning-Anfrage verbraucht das 10- bis 30-fache einer Suche“ ist als Schätzung formuliert; belastbare Quelle fehlt.

**Empfehlung:** freigabefähig nach Korrektur T14-RE-1 und Klärung von T14-RE-2.

- [ ] Modul freigeben (`ki_recht_ethik`)

## 6. Lokale KI (`ki_lokal`)

**Prüfumfang:** `src/modules/ki/LokaleKI.tsx`, `content/ki/LokaleKI.json` (LM-Studio-Anleitung, Modellempfehlungen, API-Server, Hardware, Eignungsrechner), Benchmark-Matrix `content/ki/ModelBenchmarkMatrix.json`, Beispiele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| LK1 | 14 · 10⁹ Parameter, 4,85 bit | 8,49 GB + 1,5 GB Cache ≈ 10 GB < 12 GB | identisch |
| LK2 | 70 · 10⁹ Parameter, FP16 vs. Q4_K_M | 140 GB vs. 42,4 GB; 4,85/16 = 0,30 | identisch |

**Fakten-Stichprobe:** Qwen3-14B 14,8 Mrd. Parameter – richtig. Qwen2.5-Coder-32B 32,5 Mrd. (nicht 32,8) ([Hugging Face, Modellkarte Qwen2.5-Coder-32B-Instruct](https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct/discussions/10/files)). LM-Studio-Server auf Port 1234 mit OpenAI-kompatibler API – richtig. Kosten Cloud „Stand 10/2026“ gekennzeichnet.

**Befunde**
- **behoben – T14-LK-1:** Qwen2.5-Coder 32B: 32,5 statt 32,8 Mrd. Parameter.
- **behoben – T14-LK-2:** Benchmark-Matrix „10–12 GB VRAM (RTX 3060/4060/5060)“ – RTX 4060 und 5060 haben 8 GB → „10–16 GB (z. B. RTX 3060 12 GB, RTX 4060 Ti/5060 Ti 16 GB)“.
- **behoben – T14-LK-3:** „100 % Geheimhaltung & DSGVO“ → „Hohe Vertraulichkeit & Datenschutz“ (der Kopf sagt selbst: DSGVO-Pflichten bleiben); Reproduzierbarkeit nur bei gleicher Software, Temperatur 0 bzw. festem Seed; Grafikkartenpreise als Richtpreis „Stand 10/2026 prüfen“.
- Hinweis: Die Bezeichnungen der LM-Studio-Bedienelemente (Lupe, Server-Symbol) ändern sich mit neuen Versionen.

**Empfehlung:** freigabefähig nach Korrektur T14-LK-1 bis -3.

- [ ] Modul freigeben (`ki_lokal`)

## 7. Unabhängige KI-Seiten (`ki_ressourcen`)

**Prüfumfang:** Reiter „Ressourcen“ in `src/modules/KiBaustoffe.tsx` (sechs Plattformen mit Bau-Anwendungsfall), Beispiele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| RS1 | p = 0,78, n = 200 | u = 1,96 · 0,0293 = 0,057 > 0,04 | identisch |
| RS2 | 350 W, 30 min, 0,36 kg/kWh, 0,35 €/kWh | 0,175 kWh; 0,063 kg CO₂; 0,061 € | identisch |

**Fakten-Stichprobe:** GitHub, Hugging Face (Modelle, Datensätze, Spaces), The Decoder, Futurepedia, There’s An AI For That, AI Valley – kein Befund in der Linkprüfung 10/2026. Strommix-Faktor als Lehrwert mit Hinweis „aktuellen UBA-Wert prüfen“.

**Befunde:** keine. Hinweis: Superlative der Kurzbeschreibungen („das führende Verzeichnis“) sind Werbesprache der Anbieter.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben (`ki_ressourcen`)

## 8. Hands-on-Übungen KI (`ki_uebungen`)

**Prüfumfang:** `src/modules/KiUebungen.tsx`, `src/data/kiUebungen.ts` (Regeln, sechs Übungen mit Vorlagen, Erwartungshorizont, Checkliste), `content/kiuebungen/KiUebungen.json`.

**Nachrechnungen:** Testfall U-Wert (Putz 1,5 cm/0,51; KS 17,5 cm/0,99; WD 16 cm/0,035; R_si 0,13, R_se 0,04): R_T = 4,948 m²K/W, U = 0,202 W/(m²K) – Erwartung „≈ 4,95 / ≈ 0,20“ richtig. Prüftext Übung 6: C30/37 = 30/37 N/mm², DIN 1045-2:2023-08, XC4 w/z ≤ 0,60, 320 · 0,55 = 176 kg/m³ – Erwartungshorizont richtig.

**Fakten-Stichprobe:** neutrale Bezeichnung „KI-Assistent der Hochschule“ durchgängig (Entscheidung 27.10.); Normen urheberrechtlich geschützt, frei zugängliche Rechtstexte als RAG-Basis – richtig.

**Befunde**
- **behoben – T14-UE-1:** „frei zugängliche Rechtstexte (z. B. … GEG …)“ und „ein Paragraf des GEG“ → GModG (vormals GEG), wie im übrigen Projekt.

**Empfehlung:** freigabefähig nach Korrektur T14-UE-1.

- [ ] Modul freigeben (`ki_uebungen`)

## 9. Online-Tools & Rechner (`online_tools`)

**Prüfumfang:** `src/modules/OnlineTools.tsx`, `content/onlinetools/OnlineTools.json` (21 Werkzeuge, API-Lab mit vier Code-Beispielen, Workflow), Beispiele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| OT1 | C24 120/240, L 5,0 m, q_Ed 5,0, q 3,0 kN/m, E 11 000 | M = 15,6 kNm; I = 1,382 · 10⁸ mm⁴; w = 16,1 mm ≤ 20 mm | identisch |
| OT2 | Decke 20 cm + 1,5 kN/m², A2 1,5 kN/m² | g_k = 6,5; q_Ed = 11,0 kN/m² | identisch |

**Fakten-Stichprobe:** ÖKOBAUDAT (BMWSB/BBSR, DIN EN 15804+A2), WECOBIS, THERM (LBNL, DIN EN ISO 10211), WUFI (DIN EN 15026, WTA 6-2), DIN SPEC 91484 / VDI 6210, ISO 15927-4 – richtig.

**Befunde**
- **behoben – T14-OT-1:** Climate.OneBuilding „essentiell für instationäre GEG-Nachweise“ → für Simulationen nützlich; für Nachweise in Deutschland sind die Testreferenzjahre des DWD maßgeblich.
- **behoben – T14-OT-2:** Vorbemessungs-Skript: Kommentar „C25/30 = 33.000 MPa“ → C30/37: E_cm = 33 000 MPa (C25/30: 31 000 MPa).
- **behoben – T14-OT-3:** U-Wert-Skript: ruhende Luftschicht 40 mm mit λ = 0,16 → äquivalent R = 0,18 m²K/W (DIN EN ISO 6946, Tab. 8; λ_äq = 0,222).
- **behoben – T14-OT-4:** „Bundesministerium für Digitales und Verkehr (BMV)“ → Bundesministerium für Verkehr (BMV); „CAD-CAD-Software“; „100 % Geprüfte Fachquellen“ → Fachquellen mit Normbezug; Wikipedia „Ökobilanz“ → „Lebenszyklusanalyse“ (dauerhafte Weiterleitung, Linkprüfung 10/2026, auch in `materialpaesse` und `dpp`).
- Hinweis: `https://www.geoportal.de/` meldet in der Linkprüfung HTTP 400 (vermutlich Abwehr automatischer Abrufe) – manuell prüfen. Kommerzielle Anbieter (Dlubal, SkyCiv, Madaster, Concular) sind als Werkzeuge genannt, siehe Frage T14-SY-6.

**Umsetzung 29.10.2026 (T14-SY-6):** Im Werkzeugkatalog bleiben die Anbieter- und Produktnamen (Entscheidung vom 29.10.2026); keine Änderung.

**Empfehlung:** freigabefähig nach Korrektur T14-OT-1 bis -4.

- [ ] Modul freigeben (`online_tools`)

## 10. BIM für Baustoffe (`bim_baustoffe`)

**Prüfumfang:** `src/modules/BimBaustoffe.tsx` (IFC-Attributgenerator), `content/bimbaustoffe/BimBaustoffe.json`, Beispiele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| BIM1 | IfcWall 12,0 × 3,0 × 0,24 m, 280 kg CO₂e/m³ | V = 8,64 m³; GWP = 2419 kg CO₂e | identisch |
| BIM2 | Putz 15 mm/0,70, StB 200 mm/2,3, MW 160 mm/0,035 | R_T = 4,85; U = 0,206 W/(m²K) | identisch (0,21) |
| BIM3 | Baustahl 0,64 kg CO₂e/kg · 7850 kg/m³ | ≈ 5020 kg CO₂e/m³ | **vorher 1450** |

**Fakten-Stichprobe:** ISO 16739-1:2024 (IFC 4.3), ISO 10303-21, DIN EN ISO 19650-1/-2:2019-08, DIN EN 15804:2022-03; Pset_MaterialCommon (MassDensity), Pset_MaterialMechanical (YoungModulus), Pset_MaterialThermal (ThermalConductivity); CPset als projektspezifisches Set gekennzeichnet – richtig.

**Befunde**
- **behoben – T14-BIM-1:** siehe Übersicht (Stahl-GWP 1450 → 5000 kg CO₂-Äq./m³, Regler, Einheit).
- **behoben – T14-BIM-2:** Formel „IfcWallStandardCase“ (in IFC 4.3 veraltet) → IfcWall; „GEG-U-Wert“ → U-Wert.
- **behoben – T14-BIM-3:** IFC-Ausschnitt ohne Einheitenzuweisung: YoungModulus 33 000 wäre in IFC-SI-Einheiten 33 000 Pa. Kommentar im erzeugten Text ergänzt (SI-Einheiten; MPa nur mit passender IFCUNITASSIGNMENT).
- **offen – Frage T14-BIM-4:** GWP-Lehrwert Mineralwolle 42 kg CO₂-Äq./m³ bei 60 kg/m³ (= 0,7 kg/kg); im Modul Materialdatenbanken (Beispiel 2) stehen 1,20 kg/kg. Angleichen (dann ≈ 72 kg/m³)?

**Umsetzung 29.10.2026 (T14-BIM-4):** Voreinstellung Mineralwolle in `content/bimbaustoffe/BimBaustoffe.json` 42 → 72 kg CO₂-Äq./m³. Nachrechnung: 1,20 kg CO₂-Äq./kg · 60 kg/m³ (Rohdichte der Voreinstellung im BIM-Modul) = 72,0 kg CO₂-Äq./m³ – gleicher Bezugswert wie Modul Materialdatenbanken, Beispiel 2 (1,20 kg/kg bei 30 kg/m³ → 36 kg/m³; Konsole Steinwolle 45,5 kg/m³ ≈ 38 kg/m³ · 1,20). GWP-Regler für Mineralwolle in 1er-Schritten (vorher 5er-Schritte, 72 wäre nicht einstellbar). Hinweis unter den Reglern ergänzt („gerundete Lehrwerte, z. B. Mineralwolle 1,20 kg/kg · 60 kg/m³ ≈ 72 kg/m³“). Test: `tests/modulpruefungTranche14.test.ts` (BIM4: 60 · 1,20 = 72, Rohdichte 60, Bezugswert im Modul Materialdatenbanken vorhanden). Ergebnis: kein offener Punkt mehr.

**Empfehlung:** freigabefähig nach Korrektur T14-BIM-1 bis -3 und Klärung von T14-BIM-4.

- [ ] Modul freigeben (`bim_baustoffe`)

## 11. Materialdatenbanken (`materialdatenbanken`)

**Prüfumfang:** `src/modules/Materialdatenbanken.tsx` (Datenbankkarten, simulierte ÖKOBAUDAT-Konsole, Rechenwerttabelle), `content/materialdatenbanken/Materialdatenbanken.json`, Beispiele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| MDB1 | KS 0,175 m · 1800 · 0,13 + EPS 0,14 m · 20 · 3,3 | 40,95 + 9,24 = 50,2 kg CO₂e/m² | identisch |
| MDB2 | MW 0,16 m · 30 kg/m³ · 1,20 | 5,76 kg CO₂e/m² | identisch |
| MDB3 | Praxisbeispiel 10 m³ · 245 | 2450 kg CO₂ | identisch |

**Fakten-Stichprobe:** ÖKOBAUDAT als Datenbasis für BNB und QNG – richtig. WECOBIS: von der Bayerischen Architektenkammer erstellt, mit Unterstützung des Bundesbauministeriums ([BauNetz Wissen, Baustoffinformationssystem](https://www.baunetzwissen.de/nachhaltig-bauen/tipps/planungshilfen/baustoffinformationssystem-678600)). GESTIS (IFA/DGUV), IBU, ecoinvent – richtig. QNG-Bilanzumfang nach den QNG-Bilanzierungsregeln (Anhang 3.1.1): A1–A3, B4, B6, C3/C4, D getrennt (wie im LCA-Rechner, `content/interactivelcacalc/InteractiveLCACalc.json`).

**Befunde**
- **behoben – T14-MDB-1/-2:** siehe Übersicht.
- **behoben – T14-MDB-3:** WECOBIS-Herkunft „BMWSB / BÄK“ → BMWSB / ByAK.
- **behoben – T14-MDB-4:** Datensatz „Flachprodukt Stahl (B500B)“ (B500B ist Betonstahl) → Betonstahl B500B (Stabstahl); „herstellerspezifische EPD dieses Zementwerks … 180 kg/m³“ → EPD des Transportbetonwerks (mit dem verwendeten Zement); Einheiten AP/EP der Konsole als Indikatoren der Fassung EN 15804+A1 gekennzeichnet.
- **offen – Frage T14-MDB-5:** Die Konsole zeigt Versauerung in kg SO₂-Äq. und Eutrophierung in kg PO₄-Äq. (Fassung A1); nach EN 15804+A2 gelten mol H⁺-Äq. bzw. kg P-Äq. (Süßwasser). Auf A2-Indikatoren mit neuen Lehrwerten umstellen?

**Umsetzung 29.10.2026 (T14-MDB-5):** Konsole auf die Indikatoren der DIN EN 15804+A2 umgestellt: AP (kumulierte Überschreitung) in mol H⁺-Äq., EP-Süßwasser in kg P-Äq., EP-Meer in kg N-Äq., EP-terrestrisch in mol N-Äq. (vier Kacheln statt zwei; Werte unter 0,001 als Zehnerpotenz). Lehrwerte neu in `src/data/oekobaudatLehrwerteA2.ts`, gekennzeichnet als **„Lehrwerte, vorläufig“** (Hinweistext unter den Kacheln: Größenordnungen aus öffentlichen EPD nach EN 15804+A2, über das GWP-Verhältnis skaliert, gerundet, keine Planungswerte). Methode: Quellwert A1–A3 · (GWP Konsolendatensatz / GWP Quell-EPD), zwei geltende Ziffern; Holz unskaliert (GWP vom biogenen Kohlenstoff bestimmt); Betonstahl EP-Süßwasser von kg PO₄-Äq. in kg P-Äq. umgerechnet (· 30,97/94,97).

| Datensatz | Quell-EPD (A1–A3) | Faktor | AP mol H⁺ | EP-Süßw. kg P | EP-Meer kg N | EP-terr. mol N |
|---|---|---|---|---|---|---|
| Normalbeton C25/30, m³ | [Transportbeton C30/37, EN 15804+A2](https://www.schwenk.de/wp-content/uploads/2017/03/3038_3130_NEPD-10791-10791-2_N44463200511_C30-37-F4-mittel-Dmax16-XC4-XF1-XA1-GWP-Beton-WU-Rili.pdf) (GWP 191; AP 0,216; 0,0189; 0,0698; 0,890) | 245/191 | 0,28 | 0,024 | 0,09 | 1,1 |
| Brettschichtholz, m³ | [Konstruktionsvollholz, EN 15804+A2](https://www.rettenmeier.com/fileadmin/PDF/produktinformationen/EPD-konstruktionsvollholz-KVH-2026-de.pdf) (Summe A1–A3 aus Modulwerten: 0,468; 0,0917; 0,194; 2,16) | 1 | 0,47 | 0,092 | 0,19 | 2,2 |
| Betonstahl B500B, t | [Betonstahl in Ringen, EN 15804+A2](https://www.feralpigroup.com/sites/default/files/ESF%20certificati/2023/EPD-ESF%20Elbe-Stahlwerke%20Feralpi-310-DE.pdf) (je kg; Summe GWP 0,599; AP 1,71·10⁻³; EP-fw 2,50·10⁻⁵ kg PO₄; 4,09·10⁻⁴; 4,69·10⁻³) | 1120/599 | 3,2 | 0,015 | 0,77 | 8,8 |
| Steinwolle, m³ | [Steinwolle mittlere Rohdichte, 99 kg/m³](https://www.heinze.de/epd/pdf/rockwool-steinwolle-daemmstoffe-im-mittleren-rohdichtebereich/732dcc2d-1131-4a75-a669-e871675b5ba4/) (GWP 115; 0,815; 5,71·10⁻⁴; 0,0869; 2,35) | 45,5/115 | 0,32 | 2,3·10⁻⁴ | 0,034 | 0,93 |
| CEM I, t | [Verbands-EPD CEM I (VDZ)](https://www.beton.org/fileadmin/beton-org/media/Dokumente/PDF/Wissen/Beton-Bautechnik/Nachhaltigkeit/2022-06-08-EPD-CEM_I-D.pdf) (GWP 665; 0,94; 7,01·10⁻⁴; 0,24; 3,07) | 680/665 | 0,96 | 7,2·10⁻⁴ | 0,25 | 3,1 |
| Porenbeton, m³ | [Porenbeton 486 kg/m³, EN 15804+A2](https://www.heinze.de/epd/pdf/ytong-porenbeton-35050-ro/f6ec0adc-f1d2-453b-b834-f34bac094842) (GWP 176; 0,198; 4,82·10⁻⁵; 0,0664; 0,729) | 110/176 | 0,12 | 3,0·10⁻⁵ | 0,042 | 0,46 |
| GKB 12,5 mm, m² | [Hartgipsplatte 12,5 mm, EN 15804+A2](https://www.heinze.de/epd/hartgipsplatte-tool/29248c83-68d5-4ff6-ae8d-cf91e54dd000/) (GWP 2,72; 4,54·10⁻³; 1,30·10⁻⁵; 1,43·10⁻³; 0,0152) | 1,85/2,72 | 0,0031 | 8,8·10⁻⁶ | 9,7·10⁻⁴ | 0,010 |

Hinweis: EP-Süßwasser streut zwischen den Quell-EPD über mehrere Größenordnungen (Beton 0,019 und Holz 0,09 kg P-Äq./m³ gegenüber Porenbeton 4,8·10⁻⁵) – deshalb „vorläufig“; vor einer Verwendung über die Lehre hinaus gegen die aktuellen ÖKOBAUDAT-Datensätze tauschen. Nachrechnung per eigenem Skript (Python), Test: `tests/modulpruefungTranche14.test.ts` (MDB5: alle 28 Werte ± 5 % gegen Quellwert · Faktor, Einheiten in der Konsole, keine A1-Einheiten mehr, Kennzeichnung). Keine F-Freigabe-Marke (Kennzeichnung „Lehrwerte, vorläufig“ wie entschieden). Ergebnis: kein offener Punkt mehr.

**F-Freigabe-Stellen (neu):** Rechenwerttabelle „gerundete Lehrwerte in Anlehnung an die ÖKOBAUDAT“ (Fachgebiet Nachhaltigkeit).

**Empfehlung:** freigabefähig nach Korrektur T14-MDB-1 bis -4 und Klärung von T14-MDB-5.

- [ ] Modul freigeben (`materialdatenbanken`)

## 12. Materialpässe & Gebäudepass (`materialpaesse`)

**Prüfumfang:** `src/modules/Materialpaesse.tsx` (Urban Mining Lab, Ressourcenpass-Muster), Lehrmodell jetzt in `src/calc/materialpass.ts`, `content/materialpaesse/Materialpaesse.json`, Beispiele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| MP1 | Massivbau, 2500 m² BGF, Rezyklat 10 %, geklebt | 2516,25 t; CI 10 %; C-Speicher 0 t; Restwert −17 512 € (−7 €/m²) | identisch |
| MP2 | Holz-Hybrid, 2500 m², 35 %, geschraubt | 1073 t; CI 65 %; 573 t CO₂; 179 023 € (72 €/m²) | identisch |
| MP3 | Kreislauf, 2500 m², 85 %, geschraubt | 702,5 t; CI 90 %; 688 t CO₂; 184 173 € (74 €/m²) | identisch |
| MP4 | Massivbau, 1000 m², 40 %, vermörtelt | 1006,5 t; CI 45 %; 45 738 € (46 €/m²) | identisch |
| MP-B1 | Beispiel 1: 300/20/5/2 t, r = 0,90/0,95/0,60/0 | 292/327 = 89,3 % | identisch |
| MP-B2 | Beispiel 2: V = 0,70, W = 0,30, X = 1 | LFI = 0,50; F(X) = 0,9; MCI = 0,55 | identisch |

C-Speicher nach DIN EN 16449 (50 % C, 44/12) mit 0,5 t/m³ als darrtrockene Masse – vereinfacht, im Code begründet.

**Fakten-Stichprobe:** MCI = 1 − LFI · F(X), F(X) = 0,9/X (Ellen MacArthur Foundation 2015/2019) – richtig. DGNB-Gebäuderessourcenpass (2023), ISO 20887:2020, EU-Taxonomie 2021/2139 Tätigkeit 7.1/7.2, Urban Mining Index (Rosen) – richtig. Keine gesetzliche Pflicht zum Gebäuderessourcenpass (Stand 10/2026).

**Befunde**
- **behoben – T14-MP-1/-2:** siehe Übersicht.
- **behoben – T14-MP-3:** „Bauschuttklasse 17 01 07“ → Abfallschlüssel 17 01 07 bzw. 17 09 04 (AVV); „Zirculate“ → Rezyklate; „Jedes Kilo Material erhält einen RFID-/QR-Zulassungscode, um Diebstahl … auszuschließen“ → Kennungen zur Zuordnung zum Materialpass; „Erfüllt Kriterien für QNG/KFN“ → kann Nachweise unterstützen.
- **behoben – T14-MP-4:** Rechnung aus der Komponente nach `src/calc/materialpass.ts` ausgelagert (Rechenweg unverändert, Test); Kommentar „geschraubt = 90 %“ widersprach dem Wert 95 %.

**Empfehlung:** freigabefähig nach Korrektur T14-MP-1 bis -4.

- [ ] Modul freigeben (`materialpaesse`)

## 13. Digitaler Produktpass (`dpp`)

**Prüfumfang:** `src/modules/DppEpd.tsx` (Ansicht DPP: Grundlagen, Umsetzung, Inhalte, Zeitschiene, Pflichten, Scan-Simulator; EPD-Teil), `content/dppepd/DppEpd.json`, Beispiele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| DPP1 | A1–A3 250, C3 5, C4 2, D −30 | 257 kg CO₂e, D getrennt | identisch |
| DPP2 | PENRE 1800, PENRM 200 MJ | PENRT 2000 MJ | identisch |

**Rechtsstand (Fakten-Stichprobe):** ESPR (EU) 2024/1781 erlassen 13.06.2024, in Kraft 18.07.2024; ESPR-Arbeitsplan 16.04.2025 (u. a. Eisen/Stahl, Aluminium, Textilien, Möbel, Reifen, Matratzen); Batteriepass ab 18.02.2027; BauPVO (EU) 2024/3110 in Kraft 07.01.2025, anwendbar ab 08.01.2026, DPP je Produktfamilie über delegierte Rechtsakte; Übergang VO 305/2011 bis 08.01.2040 – nach Kenntnisstand richtig (EUR-Lex ist für automatische Abrufe gesperrt; konsolidierte Fassung laut Normen-Check 10/2026 manuell prüfen). AAS/Verwaltungsschale nach IEC 63278-1, GS1 Digital Link – richtig. GWP-Faktoren IPCC AR5 (CH₄ 28, N₂O 265) – richtig.

**Befunde**
- **behoben – T14-DPP-1/-2:** siehe Übersicht (DIN SPEC 91484/91525, CE-Zulassung, unzerstörbare Datenträger, Planerpflicht).
- **behoben – T14-DPP-3:** EPD-Datensätze trugen echt wirkende IBU-Deklarationsnummern → „MUSTER-EPD-000x (fiktiv)“; „DIN EN IEC 63278“ → „-1“.
- Hinweis: Die Musterhersteller („Precast Solutions GmbH“, „WoodBuild AG“) sind fiktiv.

**Empfehlung:** freigabefähig nach Korrektur T14-DPP-1 bis -3.

- [ ] Modul freigeben (`dpp`)

---

## Offene Fragen

| Kennung | Modul | Frage | Vorschlag |
|---|---|---|---|
| T14-LP-7 | `ki_llmpraxis` | DIN 18202 Tab. 3: Zeile 3 (10 mm) oder Zeile 2 (12 mm bei 4 m) für die Oberseite einer Bodenplatte unter Estrich? (Normtext) | Zeile 2, 12 mm; Vorlagetext anpassen |
| T14-TH-5 | `ki_thesen` | Sekantenmodul DIN EN 12390-13: Spannungsgrenzen 0,05/0,33·f_cm aus der Bruchkurve oder Zyklen zwischen 0,10–0,15·f_c und f_c/3? (Normtext) | Normgrenzen nennen, Bruchkurven-Auswertung als „vereinfacht“ belassen |
| T14-RE-2 | `ki_recht_ethik` | NA DE: γ_c = 1,35 für Fertigteile mit Werksüberwachung erwähnen? (Normtext) | Ja, und Praxisfall auf γ_s = 1,10 (eindeutig falsch) zuspitzen |
| T14-SY-6 | `ki_system`, `online_tools` | Firmen- und Produktnamen (Dlubal, Sofistik, Revit, Allplan, SkyCiv, Madaster, Concular) neutralisieren? | In Systemarchitektur neutral („Statik-API“, „BIM-Autorensoftware“); im Werkzeugkatalog `online_tools` belassen |
| T14-BIM-4 | `bim_baustoffe` | Mineralwolle-GWP 0,7 kg/kg (BIM) gegenüber 1,20 kg/kg (Materialdatenbanken) | Einheitlich 1,20 kg/kg → 72 kg CO₂-Äq./m³ bei 60 kg/m³ |
| T14-MDB-5 | `materialdatenbanken` | Konsole AP/EP auf EN 15804+A2-Indikatoren umstellen? | Ja: AP in mol H⁺-Äq., EP-Süßwasser in kg P-Äq., Lehrwerte aus aktuellen ÖKOBAUDAT-Datensätzen |

T14-SY-6, T14-BIM-4 und T14-MDB-5 wurden am 29.10.2026 entschieden und umgesetzt (Abschnitte „Umsetzung 29.10.2026“ in den Modulen 1, 4, 9, 10 und 11); offen bleiben nur die Normtextpunkte T14-LP-7, T14-TH-5 und T14-RE-2.

## QA

tsc, `npm test` (153 Testdateien, inkl. `tests/modulpruefungTranche14.test.ts` und `tests/auditDaten.test.ts`), check:formeln (4486 Formeln, 0 Fehler), check:zahlen inkl. Tausender-Ratsche, check-design, check-verwaist --strict, check-any, Build, check-bundle (Budget eingehalten), a11y-reiter auf den 13 Routen (desk, mob, desk-dunkel; 165 Reiterprüfungen, 0 Verstöße).
