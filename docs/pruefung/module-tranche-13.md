# Modulprüfung Tranche 13 – Mängel & Schäden, Schutz & Instandsetzung (Befundliste zur Freigabe)

**Stand:** 29.10.2026 (Branch `pruefung/module-tranche13-10-29`, Basis origin/main fa954bfc)
**Status:** Vorschlag zur fachlichen Freigabe – noch nicht bestätigt.

> Nach der Freigabe eines Moduls wird in `src/data/pruefvermerke.ts` der Prüfvermerk „geprüft am …“ gesetzt (Passiv, ohne Namen). Mit dieser Befundliste wurden **keine** Prüfvermerke und **keine** Quizfragen geändert.

## Vorgehen

- **Auswahl (10 Module, alle bisher nie geprüft, Kategorie C im Inventar):** Gruppe „Mängel & Schäden“ (`bauschaeden`, `schadensbilder`, `bauwerksunters_monitoring`, `vdi6200`, `material_schaeden_gross`), Gruppe „Schutz & Instandsetzung“ (`schutz_grundlagen`, `instandsetzung_materialien`, `instandhaltung`, `wta`) und `wu-bauwerke` (Gruppe Massivbau, thematisch Abdichtung/Instandsetzung).
- **Prüfumfang je Modul:** Rechnung (bisher durchweg inline in den Komponenten) mit eigenen Nachrechnungen, sonst Fakten-Stichprobe (mindestens fünf Aussagen); Fachtext und Normstand (Oktober 2026); Grenzen (`src/data/rechnerGrenzen.ts`); Beispiele mit Rechenweg; Lernziele und Kurzfassung; Quellen; Stellen „vorläufig, F-Freigabe“.
- **Rechenkerne ausgelagert:** Die Rechnungen der Module Stahlbetoninstandhaltung (Chloriddiffusion, Rissinjektion), WTA (Bohrrechner, Kombi-Planer), WU-Bauwerke (Nachweis), Zustandsbewertung (Zustandsnote, Schulnoten-Zuordnung), Schutz-Grundlagen (Fünferregel) und Tragwerksmonitoring (CM-Richtwerte) stehen jetzt unverändert in `src/calc/schutzInstandsetzung.ts` (vorher inline; `erf` aus `stahlbetoninstandhaltung/hilfen.tsx` dorthin verschoben und re-exportiert). Rechenwerte unverändert.
- **Ergebnis der Nachrechnung:** 50 Prüfungen in `tests/modulpruefungTranche13.test.ts` (Toleranz 0,5 %; Sollwerte aus eigenem Python-Skript mit `math.erf`), alle ohne Abweichung; zusätzlich alle Beispielrechnungen der Fachtexte (zwei je Modul) von Hand nachgerechnet – richtig.
- **Fakten-Stichprobe:** je Modul mindestens fünf Aussagen; insgesamt 31 Korrekturen (davon eine Darstellungs- und Barrierefreiheitskorrektur), eine Kennzeichnung als Lehrwert und 8 offene Fragen.
- **Einschränkung:** WebSearch sparsam (9 Suchen). Rechtliche Aussagen (BGB, VOB/B, ZPO) und Großschadensfälle sind überwiegend nach Kenntnisstand geprüft; nicht belegte Punkte stehen als Frage, Hinweis oder F-Stelle. Normtexte wurden nicht abgeschrieben; Punkte, die nur am Normtext zu klären sind, wurden nicht geändert, sondern als „vorläufig, F-Freigabe“ gekennzeichnet und als Frage „(Normtext)“ geführt.

## Übersicht

| Nr. | Modul | Rechenkern | Empfehlung |
|---|---|---|---|
| 1 | `bauschaeden` | – (Beispiele) | freigabefähig nach Korrektur T13-BS-1 und Klärung von T13-BS-2 |
| 2 | `schadensbilder` | – (Beispiele) | freigabefähig nach Korrektur T13-SB-1 bis -3 und Klärung von T13-IH-12 |
| 3 | `bauwerksunters_monitoring` | `utils/schadensKern`, `calc/schutzInstandsetzung` | freigabefähig nach Korrektur T13-SHM-1 bis -5 und Klärung von T12-BU-7 (eingebetteter Prüfkatalog) |
| 4 | `vdi6200` | `calc/schutzInstandsetzung` | freigabefähig nach Korrektur T13-ZB-1 |
| 5 | `material_schaeden_gross` | – (Beispiele) | freigabefähig nach Korrektur T13-GS-1/-2 |
| 6 | `schutz_grundlagen` | `calc/schutzInstandsetzung` | freigabefähig nach Korrektur T13-SG-1 bis -3 und Klärung von T13-IH-10 |
| 7 | `instandsetzung_materialien` | – (Beispiele) | freigabefähig nach Korrektur T13-IM-1 bis -4 und Klärung von T13-WTA-5 |
| 8 | `instandhaltung` | `calc/schutzInstandsetzung` | freigabefähig nach Korrektur T13-IH-1 bis -9 und Klärung von T13-IH-10 bis -13 |
| 9 | `wta` | `calc/schutzInstandsetzung` | freigabefähig nach Korrektur T13-WTA-1 bis -3 und Klärung von T13-WTA-4 bis -6 |
| 10 | `wu-bauwerke` | `calc/schutzInstandsetzung` | freigabefähig nach Korrektur T13-WU-1 |

**Behobene Fehler (dieser PR):**
- **T13-SHM-1 (gewichtig):** Wenner-Beispiel: „ρ > 100 Ωm ⇒ eher geringes Risiko“ widerspricht RILEM TC 154-EMC (Portlandzementbeton, 20 °C: 100–500 Ωm mäßiges Risiko). Das Beispiel (126 Ωm) zeigt jetzt „mäßiges Korrosionsrisiko“ mit der vollständigen Stufung.
- **T13-SB-1 / T13-GS-1:** Kongresshalle Berlin 1980 „keine SpRK“ widerspricht dem Gutachten (Schlaich/Kordina/Engell 1980), das die damals wenig bekannte Spannungsrisskorrosion von Spannstählen ausdrücklich nennt.
- **T13-SG-1:** DIN EN 14038 vertauscht: Teil 1 ist die Realkalisierung, Teil 2 die Chloridextraktion (Regelwerksliste war richtig, Fachtext falsch).
- **T13-IH-2:** OS 10 ist eine rissüberbrückende Dichtungsschicht unter Schutz- und Deckschichten, kein System mit eigener Nutzschicht (das ist OS 11).
- **T13-IH-5:** DIN EN 1504: Teil 4 regelt Kleber für Bauzwecke (nicht „statische Lastübertragung“), Teile 7 und 8 fehlten, Teil 9 ist nicht harmonisiert (nicht „rein informativ“).
- **T13-SB-2:** Fließregel-Szenario: Die verzinkten Abdeckungen lagen „oberhalb“ der Kupferrinne – dann fließt kein Kupferwasser auf Zink. Jetzt „unterhalb (in Fließrichtung)“.
- **T13-IM-1 / T13-IM-2 / T13-SG-3:** Dauerhaftigkeitsklassen nach DIN EN 350 (Lärche DC 3–4, Eiche DC 2–4), Borsalze nicht für GK 3/4, „Pilzbefall biologisch unmöglich“.
- **T13-ZB-1:** Notenbereiche mit gemischten Dezimalzeichen („1,0 - 1.4“).
- **T13-WTA-1:** „Hauptrating von WTA Referat 6 / 4“ – das Punkteschema ist ein eigenes Lehrmodell, keine Bewertung der WTA.
- Weitere Einzelkorrekturen: T13-BS-1, T13-SB-3, T13-SHM-2 bis -5, T13-GS-2, T13-SG-2, T13-IM-3/-4, T13-IH-1, -3, -4, -6 bis -9, T13-WTA-2/-3, T13-WU-1 (siehe Module).

---

## 1. Recht & Grundlagen (`bauschaeden`)

**Prüfumfang:** `src/modules/Bauschaeden.tsx`, `content/bauschaeden/Bauschaeden.json` (Mangel/Schaden, Gewährleistung, Verjährung, Beweislast, BGH-Rechtsprechung, Gebäudetyp E, VOB-Anzeigen-Generator, Technikstufen, Sachverständige, Rollen und Versicherungen, Kleb- und Dichtstoffe), Lernziele, Kurzfassung.

**Nachrechnungen:** Beispiel 1: Abnahme 15.03.2021 → BGB 15.03.2026 (§ 634a Abs. 1 Nr. 2), VOB/B 15.03.2025 (§ 13 Abs. 4 Nr. 1), schriftliche Mängelrüge 10.01.2025 → 10.01.2027 (§ 13 Abs. 5 Nr. 1) – richtig. Beispiel 2: ΔL = 6000 · 10 · 10⁻⁶ · 80 = 4,8 mm; b = 4,8/0,25 = 19,2 → 20 mm – richtig.

**Fakten-Stichprobe (Kenntnisstand, Gesetzestext):** § 634a Abs. 3 Satz 2 BGB (Arglist: nicht vor Ablauf der Fünfjahresfrist), § 204 Abs. 1 Nr. 7 BGB (Hemmung durch selbständiges Beweisverfahren), § 650t BGB (vorrangige Inanspruchnahme des Unternehmers), § 404 Abs. 3 ZPO (Vorrang öffentlich bestellter Sachverständiger), § 6 Abs. 1 VOB/B (schriftliche Behinderungsanzeige, Offenkundigkeit), BGH VII ZR 46/17 (22.02.2018) und V ZR 33/19 (Kaufrecht), DIN 52460 (Wartungsfuge) – richtig.

**Befunde**
- **behoben – T13-BS-1:** Satz zum „Stand der Wissenschaft“ war abgebrochen („Produkthaftung: Stand von Wissenschaft und Technikheitsrelevant.“, Klammer nicht geschlossen). Neu: „… Stand von Wissenschaft und Technik, § 1 Abs. 2 Nr. 5 ProdHaftG).“
- **offen – Frage T13-BS-2 (Musterdaten):** Der Anzeigen-Generator füllt als Beispiel „Ingenieurbüro Dr.-Ing. M. Huber“, „Bauwerksgesellschaft Nord GmbH & Co. KG“ und „TH Augsburg – Modernisierung Trakt D / Raum D1.05“ vor. Personenname und reale Hochschule in Musterschreiben?
- Hinweis: Gebäudetyp E – Stand „Juli 2026 angekündigter Entwurf in Ressortabstimmung“ ließ sich öffentlich nicht nachprüfen; vor der Lehre aktuellen Stand prüfen.
- Hinweis: DIN 18195:2025-12 in der Regelwerksliste nicht gegengeprüft (DIN 18533-1:2026-06 bestätigt, siehe Nr. 9).

**Empfehlung:** freigabefähig nach Korrektur T13-BS-1 und Klärung von T13-BS-2.

- [ ] Modul freigeben

## 2. Typische Bauschäden (`schadensbilder`)

**Prüfumfang:** `src/modules/TypischeBauschaeden.tsx`, `content/typischebauschaeden/TypischeBauschaeden.json` (Feuchte/Schimmel, Risse, Korrosion, AKR, Unverträglichkeiten, Tief- und Ingenieurbau, Szenario-Analysator), Lernziele, Kurzfassung.

**Nachrechnungen:** Beispiel 1: w_k = 200 · 0,0006 = 0,12 mm ≤ 0,3 mm (XC4) – richtig. Beispiel 2: K_I = 1,12 · 150 · √(π · 0,010) = 29,8 MPa√m; a_c = (50/168)²/π = 28,2 mm – richtig. Monosulfat → Ettringit (Gleichung ausgeglichen), i_corr 10 µA/cm² ≈ 116 µm/a.

**Fakten-Stichprobe:** f_Rsi ≥ 0,70 bzw. θ_si ≥ 12,6 °C (DIN 4108-2), Tauwasser ≤ 1,0 kg/m² (DIN 4108-3), XF3 w/z ≤ 0,55 mit LP bzw. 0,50 ohne LP (DIN 1045-2), Chloridgehaltsklassen Cl 0,40/0,20, Spannstähle nach Handlungsanweisung SpRK (Neptun N 40, Sigma oval, Hennigsdorfer St 140/160), Fließregel Kupfer → Zink – richtig (Kenntnisstand). Kongresshalle: siehe T13-SB-1.

**Befunde**
- **behoben – T13-SB-1:** SpRK-Kasten: „Der Teileinsturz der Kongresshalle Berlin 1980 war dagegen Korrosion bei mangelhafter Verpressung, keine SpRK“. Die Kurzfassung des Gutachtens (Schlaich/Kordina/Engell, Beton- und Stahlbetonbau 75 (1980) H. 12, S. 281–294) nennt Planungs- und Ausführungsmängel und die 1957 noch wenig bekannte Spannungsrisskorrosion von Spannstählen ([Structurae](https://structurae.net/en/literature/journal-article/teileinsturz-der-kongresshalle-berlin-schadensursachen)). Text entsprechend.
- **behoben – T13-SB-2:** Szenario „Lochfraß durch Kontaktkorrosion“: verzinkte Abdeckungen „unmittelbar oberhalb“ der Kupferrinne → „unterhalb (in Fließrichtung des Regenwassers)“; sonst liegt keine Fließregelverletzung vor (Kurzfassung: „Kupfer oberhalb von Zink“).
- **behoben – T13-SB-3:** „Kontakkorrosion“, „DIN 18339)::“, „>= 0,1 - 0,3 mm“.
- **gekennzeichnet – T13-IH-12 (Normtext):** Zementsuspension „Füllen breiter Risse (> 0,8 mm)“ steht hier, im Modul Stahlbetoninstandhaltung wird ZS schon ab w ≥ 0,2 mm empfohlen; Grenze „vorläufig, F-Freigabe“.

**Empfehlung:** freigabefähig nach Korrektur T13-SB-1 bis -3 und Klärung von T13-IH-12.

- [ ] Modul freigeben

## 3. Tragwerksmonitoring (`bauwerksunters_monitoring`)

**Prüfumfang:** `src/modules/Bauwerksunters_Monitoring.tsx` (SHM-Reiter mit Temperaturgang, Bohrwiderstands-Simulator, Feuchte-/CM-Rechner, Rückprall/Karbonatisierung, eingebetteter Prüfverfahren-Katalog), `content/bauwerksunters_monitoring/*.json`, Lernziele, Kurzfassung. Der Reiter „ZfP-Prüfkatalog“ bindet `PruefverfahrenKatalog` ein (in Tranche 12 als `pruefverfahren_katalog` geprüft; 14 Verfahren).

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern / Modul |
|---|---|---|---|
| SHM1 | 0,300 m / 71,4 µs, ρ 2400, ν 0,2 | v_L = 4202 m/s; Faktor 0,90; E_dyn = 38,1 GPa | identisch (Beispiel 1) |
| SHM2 | Wenner a 50 mm, 0,40 V / 1,0 mA | ρ = 2π · 0,05 · 400 = 125,7 Ωm | identisch (Beispiel 2) |
| SHM3 | x_c 15 mm, 40 a | k_c = 15/√40 = 2,37 mm/√a | identisch |
| SHM4 | CM-Richtwerte | CT 2,0 / beheizt 1,8; CA 0,5 / beheizt 0,3 CM-% | identisch (`belegreifeGrenzeCM`) |

**Normstand:** VDI 6200:2010-02 und Blatt 1.1:2026-06, DIN 1076:2026-01, VDI/VDE 2635 Blatt 1 (DMS), RILEM TC 154-EMC – richtig.

**Befunde**
- **behoben – T13-SHM-1:** Wenner-Einordnung (siehe oben) nach [RILEM TC 154-EMC, Polder 2000, Tab. 2](https://www.rilem.net/images/publis/123403.pdf): < 100 Ωm hoch, 100–500 mäßig, 500–1000 gering, > 1000 Ωm vernachlässigbar (Portlandzement, 20 °C).
- **behoben – T13-SHM-2:** TDR-Sonden messen nicht „elektrolytische Bauwerksfeuchten“, sondern über die Dielektrizitätszahl den volumetrischen Wassergehalt.
- **behoben – T13-SHM-3:** Calciumsulfatestrich nicht belegreif: „mineralische Nadelbildung (Ettringit-ähnlich)“ → Erweichung der Oberfläche, Haftungsverlust, Blasen; Ettringit nur im Kontakt mit zementären Spachtelmassen.
- **behoben – T13-SHM-4:** Verweis „Bauen im Bestand > Bauwerksuntersuchung“ → „Bauwerksdiagnose – Prüfverfahren-Katalog“ (nach #231); „Gefügebearbeitungsverlust“ → „Gefügeverlust“; Splintholzkäfer (Lyctus) befallen nur stärkereiches Laubholz – Hinweis ergänzt, weil der Simulator auch Fichte/Kiefer anbietet.
- **behoben – T13-SHM-5 (Darstellung, Barrierefreiheit):** Holzquerschnitt im Simulator war ein dunkler Balken (`bg-[#1e293b]`, Hohlraum `bg-black/90`) mit kontrastschwacher Schrift (axe: color-contrast 2,1 hell, 3,1 dunkel); Bedienfelder mit festem `bg-[#f8fafc]` blieben im Dunkelmodus hell (Kontrast 1,2). Jetzt Holztöne hell/dunkel, Felder mit `bg-off-white`; die vier Ausnahmen in `scripts/qa/check-design.mjs` entfallen.
- **Hinweis T12-BU-7:** Der eingebettete Prüfkatalog enthält die Rückprall-Verwerfungsregel (Normtext DIN EN 12504-2, offen seit Tranche 12) – die Freigabe dieses Moduls hängt daran wie bei `pruefverfahren_katalog`.
- Hinweis: HF-Grenzen 40/80 Digits sind gerätespezifisch (im Text als Näherung bezeichnet). Kein Eintrag in `rechnerGrenzen.ts`.

**Empfehlung:** freigabefähig nach Korrektur T13-SHM-1 bis -5 und Klärung von T12-BU-7 (eingebetteter Prüfkatalog).

- [ ] Modul freigeben

## 4. Zustandsbewertung (`vdi6200`)

**Prüfumfang:** `src/modules/Zustandsbewertung.tsx` (DIN 1076, VDI 6200, Notenrechner), `content/zustandsbewertung/Zustandsbewertung.json`, Grenzen, Lernziele.

**Nachrechnungen:** Zustandsnote Z = max(S, V, D) + 0,1 · n (1,0 bis 4,0): S2/V1/D3 + 1 → 3,1; S3/V2/D3 + 3 → 3,3; S4 + 2 → 4,0 (Deckel); S2/V2/D2 + 4 → 2,4 – Kern identisch. Schulnoten-Zuordnung an den Grenzen 1,4/1,5 … 3,4/3,5 – richtig. Beispiel 2: β = 200/√3400 = 3,43, P_f = Φ(−3,43) = 3,0 · 10⁻⁴ < Zielwert 3,8 (RC 2, 50 a) – richtig. Beispiel 1 (H 2026, E 2029, B in den übrigen Jahren) – richtig.

**Fakten-Stichprobe:** VDI-6200-Intervalle (EFH Begehung 3–5 a, Inspektion/eingehende Überprüfung nach Erfordernis; Büro/Schulen 2–3/4–5/12–15 a; Stadien 1–2/2–3/6–9 a) – richtig ([Schumacher Gerber, VDI 6200](https://www.sg-ing.de/assets/schumacher-gerber_vdi_6200.pdf)). VDI 6200 Blatt 1.1:2026-06 „Berichtsdokumentation der Überprüfung“ (ersetzt den Entwurf 2024-08) – richtig ([DIN Media](https://dinmedia.de/en/draft-technical-rule/vdi-6200-blatt-1-1/378351864)). EN 1990-2:2026 (Bewertung bestehender Tragwerke) – erschienen ([genorma](https://genorma.com/en/standards/en-1990-2-2026)). RI-EBW-PRÜF-Notenbereiche 1,0–1,4 … 3,5–4,0, Einzelbewertungen 0–4 – richtig (Kenntnisstand).

**Befunde**
- **behoben – T13-ZB-1:** Notenbereiche „1,0 - 1.4“, „1,5 - 1.9“ … „3,5 - 4.0“ mit Dezimalpunkt → „1,0–1,4“ usw.
- Hinweis: Der S-V-D-Rechner bietet die Stufen 1 bis 4 an, RI-EBW-PRÜF bewertet 0 bis 4; als didaktische Vereinfachung mit Grenzen-Eintrag gekennzeichnet.

**Empfehlung:** freigabefähig nach Korrektur T13-ZB-1.

- [ ] Modul freigeben

## 5. Große Materialschäden & Einstürze (`material_schaeden_gross`)

**Prüfumfang:** `src/modules/MaterialSchaedenGross.tsx`, `content/materialschaedengross/*.json` (zehn Fallakten), Lernziele, Kurzfassung.

**Nachrechnungen:** Beispiel 1: a_c = (30/336)²/π = 2,5 mm – richtig. Beispiel 2: Hyatt Regency F = P + P = 2P (180 statt 90 kN) – richtig. Na₂O-Äquivalent = Na₂O + 0,658 · K₂O – richtig.

**Fakten-Stichprobe (Kenntnisstand):** Bad Reichenhall 02.01.2006, 15 Tote, Bau 1971–1973, BGH 1 StR 272/09; Ponte Morandi 14.08.2018, 43 Tote, Pfeiler 9, Ertüchtigung Pfeiler 11 Anfang der 1990er; Carolabrücke 11.09.2024, Zug C, H-SpRK mit Anrissen aus der Bauzeit (Gutachten 2025); Silver Bridge 15.12.1967, 46 Tote, Augenstab 330, NBIS; Hyatt Regency 17.07.1981, 114 Tote, NBS BSS 143; Reichsbrücke 01.08.1976, ein Toter; Stava 19.07.1985, 268 Tote; Schiersteiner Brücke 10.02.2015 (GEWI-Pfähle) – richtig.

**Befunde**
- **behoben – T13-GS-1:** Kongresshalle: „Es handelte sich nicht um einen Fall von Spannungsrisskorrosion an DDR-Stahl St 140/160“ (formal richtig, aber irreführend) → Gutachten verweist auf die damals wenig bekannte Spannungsrisskorrosion von Spannstählen; kein Bezug zu DDR-Stahl (Quelle wie T13-SB-1).
- **behoben – T13-GS-2:** „unbedenkliche Gesteinskörnungen (E1)“ → „(E I)“ (Schreibweise der Alkali-Richtlinie, vgl. T12-AS-2).
- Hinweis: Stava „Dammhöhe kombiniert ca. 34 m“ und Burgrain „Mai 2023: rund 480 000 Schwellen“, „16 Schwer- und 62 Leichtverletzte“ nicht öffentlich gegengeprüft; Literatur nennt den BEU-Bericht „Untersuchungsbericht“, der Fließtext Zwischenberichte – bei Gelegenheit vereinheitlichen.

**Empfehlung:** freigabefähig nach Korrektur T13-GS-1/-2.

- [ ] Modul freigeben

## 6. Schutz- & Instandsetzungs-Grundlagen (`schutz_grundlagen`)

**Prüfumfang:** `src/modules/SchutzGrundlagen.tsx` (Prinzipien, Schutzmechanismen, Tuutti/de Sitter, Verfahrenswahl), `content/schutzgrundlagen/SchutzGrundlagen.json`, Lernziele.

**Nachrechnungen:** de Sitter K₃ = 2000 · 5³ = 250 000 €, Regler × 5/25/125 – Kern identisch. Klopfer: s_d,CO₂ = 400 000 · 0,00025 = 100 m ≥ 50 m – richtig. Tuutti t₀ = (c/k)² (wie T12, `karbonatisierung`).

**Fakten-Stichprobe:** elf Prinzipien nach DIN EN 1504-9 (1–6 Beton, 7–11 Bewehrung), E° Zn −0,76 V / Fe −0,44 V, Rili-SIB-Prinzipien W/C/R/K, DIN EN ISO 1461:2022-12, Wasserstoffversprödung hochfester Spannstähle – richtig.

**Befunde**
- **behoben – T13-SG-1:** „ECE nach DIN EN 14038-1:2021-03“ und „ER nach DIN EN 14038-2:2020-09“ → ECE Teil 2, ER Teil 1 (wie die Regelwerksliste des Moduls).
- **behoben – T13-SG-2:** Rissbildung: „Rissüberbrückende Oberflächenschutzsysteme Klasse OS 4 oder OS 5a/b“ – OS 4 ist nicht rissüberbrückend (so auch das Modul Stahlbetoninstandhaltung). Neu: OS 5a/5b bzw. OS 10/OS 11.
- **behoben – T13-SG-3:** Holzschutz: „Pilzbefall biologisch unmöglich“ unter u = 20 % → „praktisch ausgeschlossen“ (wie T12-HK-1); Borate für GK 3/4 → Kupferverbindungen, Borate auswaschbar und nur bis GK 2.
- **gekennzeichnet – T13-IH-10 (Normtext):** KKS-Kriterium „Depolarisation ≥ 100 mV innerhalb von 24 h bis 72 h“ (siehe Nr. 8).

**Empfehlung:** freigabefähig nach Korrektur T13-SG-1 bis -3 und Klärung von T13-IH-10.

- [ ] Modul freigeben

## 7. Instandsetzung nach Material (`instandsetzung_materialien`)

**Prüfumfang:** `src/modules/InstandsetzungMaterialien.tsx` (Holz, Metalle, Kunststoffe, Asphalt, Mauerwerk), `content/instandsetzungmaterialien/InstandsetzungMaterialien.json`, Lernziele.

**Nachrechnungen:** Beispiel 1: t_Zn = 85/4,2 = 20 a; t_Duplex = 1,5 · (20 + 10) = 45 a – richtig. Beispiel 2: W₀ = 1 290 667 mm³, W_Rest = 601 667 mm³, Verhältnis 0,47 – richtig.

**Fakten-Stichprobe:** Abtragsraten Zink/Stahl C1–CX (DIN EN ISO 9223, Tab. 2), Schutzdauer L/M/H/VH, Taupunktabstand 3 K, Trennlagen PVC-P (Glasvlies 120 g/m², Polyestervlies 300 g/m²), Hausschwamm 1,0 m, Heißluft 55 °C/60 min, Sockel 30 cm – richtig.

**Befunde**
- **behoben – T13-IM-1:** „Klasse 1: Robinie, Teak; Klasse 2: Eiche, Lärche“ → nach DIN EN 350:2016 z. B. Teak DC 1, Robinie DC 1–2, Eiche DC 2–4, Lärche DC 3–4 (Kenntnisstand; Eiche wie T12 `holzkorrosion`).
- **behoben – T13-IM-2:** Kesseldruckimprägnierung mit „Kupfer- oder Borsalzen … Standard bei Erdkontakt (GK 4)“ – Borsalze sind auswaschbar und nur bis GK 2 geeignet.
- **behoben – T13-IM-3:** Leutner-Prüfung: „dynamische Scherkraft“ → Scherkraft im statischen Abscherversuch (≥ 15 kN unverändert).
- **behoben – T13-IM-4:** Lernziel „Restquerschnitt eines geschädigten Stahlbauteils“ – das Modul rechnet einen angefaulten Holzbalken; Lernziel angepasst (Prüfliste Cluster IV nachgezogen).
- **gekennzeichnet – T13-WTA-5 (Normtext):** Putzabtrag „mindestens 80 cm über die Schadensgrenze“ hier, „mindestens 1 Meter“ im Modul WTA.

**Empfehlung:** freigabefähig nach Korrektur T13-IM-1 bis -4 und Klärung von T13-WTA-5.

- [ ] Modul freigeben

## 8. Stahlbetoninstandhaltung (`instandhaltung`)

**Prüfumfang:** `src/modules/Stahlbetoninstandhaltung.tsx` und Reiter in `src/modules/stahlbetoninstandhaltung/` (Regelwerke, TR-Prinzipien, DIN EN 1504, OS-Systeme, Produkte, Rissinjektion, Chloridrechner/KKS, Qualifikation), `content/stahlbetoninstandhaltung/*.json`, Lernziele, Kurzfassung.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| CL1 | C_s 2,5 M.-%/z, D 2 · 10⁻¹² m²/s, 25 a, c 35 mm | C = 1,333 M.-%/z → kritisch; Front ≥ 65 mm, Abtrag 80 mm | identisch |
| CL2–CL4 | 50 mm; 1,5/1/50 a/40 mm; 4/3/40 a/60 mm | 0,934; 0,715; 1,962 M.-%/z | identisch |
| RI | h 150/300/400/800 mm | Packer 75/150/200/400 mm; p 12/24/32/35 bar | identisch |
| KKS | 600 m² · 0,7 · 10 mA/m² | I = 4,2 A | Beispiel 1 richtig |
| Füllgut | 4,0 m · 0,30 mm · 0,25 m · 1,5 | 0,45 l | Beispiel 2 richtig |

**Normstand:** TR Instandhaltung (DIBt, Teile 1 und 2, eingeführt ab 2021 über die MVV TB; ersetzt weite Teile der Rili-SIB 2001 – [BauNetz Wissen](https://www.baunetzwissen.de/beton/tipps/planungshilfen/technische-regel-zur-instandhaltung-von-betonbauteilen-8258883)), DIN EN 1504-1 bis -10, DIN EN ISO 12696:2022-09. Nach [Forum Verlag](https://forum-verlag.com/fachwissen/bau-und-gebaeudemanagement/tr-instandhaltung/) gelten für Ausführung, ausführende Betriebe und Überwachung weiterhin die Regelungen der DAfStb-Richtlinie (siehe T13-IH-11).

**Befunde**
- **behoben – T13-IH-1:** „Quadratisches Wurzel-Zeit-Gesetz“ → „Wurzel-t-Gesetz“ (wie T12-MI-1).
- **behoben – T13-IH-2:** OS 10 (siehe oben).
- **behoben – T13-IH-3:** System-Finder: „R4 (Chemisch beständig, pH-Wert < 4)“ und „R4 (Extrem verschleißfest)“ – R1 bis R4 sind Festigkeitsklassen nach DIN EN 1504-3; chemischer bzw. Verschleißwiderstand gesondert nachzuweisen.
- **behoben – T13-IH-4:** Szenario „Inverkehrbringen“: „TR Instandhaltung (Teil 3)“ → Teil 2 (die TR hat zwei Teile).
- **behoben – T13-IH-5:** Gliederung DIN EN 1504 (siehe oben).
- **behoben – T13-IH-6:** KKS-Vorteil „Ca. 70 % weniger Baustellenlärm & CO₂“ ohne Quelle → qualitativ („deutlich weniger Abtrag, Lärm und Erschütterung, objektabhängig“).
- **behoben – T13-IH-7:** Injektion bei drückendem Wasser „D 1.1 / W-Stopp nach DIN EN 1504-5“ ist keine Klasse der Norm → „Klasse D (dehnfähig); Vorinjektion mit PUR-Schaum als Wasserstopp“.
- **behoben – T13-IH-8:** Schreibweisen „w >= 0,2 mm“, „w/z-Wert ~0.4“, „under“, „dymamisch“, „material“.
- **gekennzeichnet – T13-IH-9 (Lehrwert):** Verpressdruck 0,08 bar je mm Bauteildicke (12–35 bar) war im Quelltext als „ZTV-ING-Faustregel“ bezeichnet; eine solche Regel ist nicht belegt. Kommentar berichtigt („vorläufig, F-Freigabe“), Anzeige „Lehrwert; Schutz vor Hydrofraktur“. Rechenwert unverändert.
- **offen – Frage T13-IH-10 (Normtext):** KKS-Schutzkriterium „Depolarisation ≥ 100 mV innerhalb von 24 h bis 72 h“ (auch Kurzfassung, Schutz-Grundlagen). Nach Kenntnisstand nennt DIN EN ISO 12696 ≥ 100 mV innerhalb von höchstens 24 h bzw. ≥ 150 mV über einen längeren Zeitraum. Gekennzeichnet „vorläufig, F-Freigabe“.
- **offen – Frage T13-IH-11 (Normtext):** Regelwerke-Reiter: Rili-SIB „nicht mehr bauaufsichtlich“, nur noch privatrechtlich. Nach Forum Verlag verweist die TR für Ausführung, Betriebe und Überwachung weiterhin auf die DAfStb-Richtlinie (dazu gehört die SIVV-Anforderung im Reiter Qualifikation). Gekennzeichnet „vorläufig, F-Freigabe“.
- **offen – Frage T13-IH-12 (Normtext):** Rissbreitengrenze für Zementsuspension: ab 0,2 mm (Rechner) bzw. über 0,8 mm (Modul Typische Bauschäden).
- **offen – Frage T13-IH-13 (Rechner):** Das Chloridprofil wird nur bis 65 mm gerastert; bei tiefer reichender Front (Vorgabewerte!) zeigt der Rechner „Depassivierungstiefe 65 mm“ und Abtrag 80 mm.
- Hinweis: Kein Eintrag in `rechnerGrenzen.ts` (Chloridrechner, Rissinjektion).

**Empfehlung:** freigabefähig nach Korrektur T13-IH-1 bis -9 und Klärung von T13-IH-10 bis -13.

- [ ] Modul freigeben

## 9. WTA-Merkblätter (`wta`)

**Prüfumfang:** `src/modules/WTA.tsx` (Horizontalsperre mit Bohrrechner, Sanierputz, Innendämmung, QS/Verpressprotokoll, Kombi-Planer, WTA 4-6/DIN 18533), `content/wta/WTA.json`, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| WTA1 | Ziegel, d 36 cm | t 31 cm, a 12 cm, n 9, V_Bohr 35,1 cm³, V 0,363 l/m | identisch |
| WTA2 | Mischmauerwerk, d 51 cm | t 46 cm, n 10, V 0,598 l/m | identisch |
| WTA3 | Lochstein, d 24 cm | n 13, V 0,321 l/m | identisch |
| WTA4 | Kombi Calciumsilicat/Sperre ok/Salz mittel/Regen 2 | 100 Punkte, grün | identisch |
| WTA5 | PUR/keine Sperre/Salz hoch/Regen 3 | 0 Punkte, rot, 4 Alarme | identisch |
| WTA6 | Holzfaser/Restfeuchte/Salz mittel/Regen 1 | 55 Punkte, orange | identisch |

Beispiele: DFG = 9,0/18,0 = 50 %; V_m = 8 · 1,0 · 1,1 = 8,8 l/m – richtig.

**Normstand:** WTA 2-9-20/D, 4-6-24/D, 6-5-14/D, 3-17-10/D; DIN 18533-1:2026-06 ersetzt 2017-07 und A1:2018-09, „Wasserbeanspruchungsklassen“, Riss- und Rissüberbrückungsklassen zusammengeführt, Einwirkungen aus DIN 4095-1 – richtig ([Bauprofessor, DIN 18533-1](https://www.bauprofessor.de/din18533-1-abdichtung-von-erdberuehrten-bauteilen-die-wichtigsten-aenderungen/)). Sanierputz: Porosität > 40 Vol.-%, μ ≤ 12, Spritzbewurf ≤ 50 % Deckung – richtig (Kenntnisstand).

**Befunde**
- **behoben – T13-WTA-1:** Kombi-Planer „Hauptrating von WTA Referat 6 / 4“ → „Eigenes Lehrmodell (keine Bewertung der WTA)“; Punkteschema unverändert in `wtaKombiBewertung`.
- **behoben – T13-WTA-2:** „Außendämmung … ist behördlich strikt verboten“ → „denkmalrechtlich in der Regel nicht genehmigungsfähig“.
- **behoben – T13-WTA-3:** „1.15er Sicherheitsbeiwert“, „over time“, „Amtliche Verpressprotokollierung“, unbelegtes „bis zu 80 %“ weniger Wirkstoffaufnahme.
- **offen – Frage T13-WTA-4 (Normtext):** Salzstufen „< 0,1 / 0,1–0,5 / > 0,5 M.-%“ für alle Salze gemeinsam; nach Kenntnisstand stuft die WTA je Salzart (Chlorid, Nitrat, Sulfat) mit unterschiedlichen Grenzen ein. Gekennzeichnet „vorläufig, F-Freigabe“.
- **offen – Frage T13-WTA-5 (Normtext):** Putzabtrag über der Schadensgrenze: 1 m (WTA-Modul) bzw. 80 cm (Instandsetzung nach Material). Gekennzeichnet in beiden Modulen.
- **offen – Frage T13-WTA-6 (Rechner):** (a) DFG-Zuordnung „drucklos bis 60 %, Druck 60–95 %, darüber vortrocknen“: Injektionscremes werden heute auch drucklos bis 95 % DFG angeboten (Herstellermerkblatt 04/2026: [Injektionscreme, Technisches Merkblatt](https://epasit.de/wp-content/uploads/2026/05/TM-epasit-IC-Injektionscreme_04_26.pdf)); maßgebend ist das WTA-Zertifikat des Stoffs. (b) Bedarf aus dem Bohrlochvolumen (36 cm: 0,36 l/m) liegt unter Herstellerangaben (dort ≈ 15 ml je m und cm Wanddicke, also ≈ 0,54 l/m); auch Bohrtiefe (Wand − 5 cm bzw. − 3 cm) und Faktor (1,15 im Rechner, 1,1 im Beispiel) weichen ab. Gekennzeichnet „vorläufig, F-Freigabe“.

**Empfehlung:** freigabefähig nach Korrektur T13-WTA-1 bis -3 und Klärung von T13-WTA-4 bis -6.

- [ ] Modul freigeben

## 10. WU-Bauwerke (`wu-bauwerke`)

**Prüfumfang:** `src/modules/WUBauwerke.tsx` (Rechner, Entwurfsgrundsätze, Fugen, Betontechnologie, Wannentypen), `content/wubauwerke/WUBauwerke.json`, Lernziele.

**Nachrechnungen:** I = 3,0/0,30 = 10 → w_k 0,20 mm (Beispiel, richtig); 4,0/0,30 = 13,3 → 0,15; 6,0/0,30 = 20 → 0,10; 9,0/0,30 = 30 → keine Selbstheilung (Grundsatz a oder c); Mindestdicken BK 1 Wand 240 / Bodenplatte 250 mm, BK 2 Wand 200 (Elementwand 240) / Bodenplatte 150 mm – Kern identisch.

**Normstand:** DAfStb-WU-Richtlinie 2017-12 ist aktuell ([DIN Media](https://www.dinmedia.de/de/technische-regel/dafstb-wasserundurchlaessige-bauwerke/283927896)); Nutzungsklassen A/B wie im Modul ([Forum Verlag, WU-Richtlinie](https://www.forum-verlag.com/fachwissen/bau-und-gebaeudemanagement/wu-richtlinie/)); DIN 18533-1:2026-06, DIN 18197:2018-01, DIN EN 1504-5:2013-05 – richtig. Mindestdicken (Tab. 1), w/z ≤ 0,55 (BK 1) bzw. 0,60 (BK 2) und Selbstheilungs-Rissbreiten nach Kenntnisstand, öffentlich nicht gegengeprüft (F-Stelle, nicht blockierend).

**Befunde**
- **behoben – T13-WU-1:** „Risse dichten sich … bei Wasserdruck I ≤ 10 eigenständig ab“ widersprach der Stufung im selben Modul (I ≤ 25). Neu mit den drei Stufen.
- Hinweis: Keine Kurzfassung (`src/data/kurzfassung.ts`) und kein Grenzen-Eintrag; die Nutzungsklasse geht nicht in die Rechnung ein.

**Empfehlung:** freigabefähig nach Korrektur T13-WU-1.

- [ ] Modul freigeben

---

## Offene Fragen zur Entscheidung (Zusammenfassung)

| Nr. | Modul | Frage | Vorschlag |
|---|---|---|---|
| T13-BS-2 | Recht & Grundlagen | Musterdaten im Anzeigen-Generator mit Personenname („Dr.-Ing. M. Huber“), Firma und realer Hochschule („TH Augsburg – Trakt D“)? | neutrale Platzhalter („Ingenieurbüro Muster“, „Bauunternehmen Beispiel GmbH“, „Schulgebäude Musterstadt, Trakt D“) |
| T13-IH-10 (Normtext) | Stahlbetoninstandhaltung, Schutz-Grundlagen | KKS: „Depolarisation ≥ 100 mV in 24 h bis 72 h“? | am Normtext DIN EN ISO 12696 prüfen; nach Kenntnisstand „≥ 100 mV in höchstens 24 h oder ≥ 150 mV über längere Zeit“ |
| T13-IH-11 (Normtext) | Stahlbetoninstandhaltung | Gilt die Rili-SIB (Teil 3) über die TR Instandhaltung für Ausführung, Betriebe und Überwachung weiter (dann auch SIVV)? | Text im Regelwerke-Reiter um den Verweis ergänzen, „nicht mehr bauaufsichtlich“ nur für die ersetzten Teile |
| T13-IH-12 (Normtext) | Stahlbetoninstandhaltung, Typische Bauschäden | Rissbreitengrenze für Zementsuspension 0,2 mm oder 0,8 mm? | Grenzen der Füllstoffe nach TR Instandhaltung Teil 1 in beiden Modulen einheitlich |
| T13-IH-13 | Stahlbetoninstandhaltung | Chloridraster endet bei 65 mm, Abtrag wird gedeckelt | Raster bis 100 mm oder Anzeige „≥ 65 mm“; Grenzen-Eintrag ergänzen |
| T13-WTA-4 (Normtext) | WTA | Salzstufen gemeinsam für alle Salze (0,1/0,5 M.-%)? | Stufen je Salzart nach WTA-Merkblatt übernehmen |
| T13-WTA-5 (Normtext) | WTA, Instandsetzung nach Material | Putzabtrag 80 cm oder 1 m über der Schadensgrenze? | 80 cm nach WTA 2-9 (Kenntnisstand), in beiden Modulen gleich |
| T13-WTA-6 | WTA | Bohrrechner: DFG-Zuordnung und Verbrauch aus dem Bohrlochvolumen | Zuordnung „laut Zertifikat (bis 60/80/95 % DFG)“; Verbrauch als Untergrenze kennzeichnen oder Ansatz je m und cm Wanddicke mit Lehrwert |

Außerdem weiter offen (Tranche 12): **T12-BU-7** (Normtext DIN EN 12504-2) – betrifft den in `bauwerksunters_monitoring` eingebetteten Prüfkatalog.

## Freigabevorschlag

Entscheidung vom 28.10.2026: Module ohne offene Frage werden freigegeben; Normtextpunkte blockieren. Nach dieser Befundliste ohne offene Frage (Korrekturen in diesem PR):

- `vdi6200` – nach Korrektur T13-ZB-1
- `material_schaeden_gross` – nach Korrektur T13-GS-1/-2
- `wu-bauwerke` – nach Korrektur T13-WU-1 (F-Stelle Tab. 1/w/z nicht blockierend)

Mit Entscheidung (ohne Normtext): `bauschaeden` (T13-BS-2).

Blockiert durch Normtext: `schadensbilder` (T13-IH-12), `bauwerksunters_monitoring` (T12-BU-7), `schutz_grundlagen` (T13-IH-10), `instandsetzung_materialien` (T13-WTA-5), `instandhaltung` (T13-IH-10 bis -12; dazu Entscheidung T13-IH-13), `wta` (T13-WTA-4/-5; dazu Entscheidung T13-WTA-6). Für den Prüfbogen Normtext neu: T13-IH-10, -11, -12, T13-WTA-4, -5.

## Hinweis Quiz

- Keine Frage geändert. Geprüft, unverändert: `q_ms_tb_4` (Kupfer über Zink – passt zur korrigierten Fließregel), `q_is_wta_4` und `qn_instandsetzung_materialien_4` (Porengrundputz, 80-cm-Angabe im Erklärungstext entspricht dem Modul; berührt T13-WTA-5), `qn_instandhaltung_3` (OS 8; die Kernregel „OS 10/11 rissüberbrückend befahrbar“ bleibt mit der Korrektur T13-IH-2 zutreffend), `qn_instandhaltung_4` (Gliederung der Prinzipien), `q_ms_tb_2`.
- Prüfliste `docs/pruefung/quiz-cluster-IV.md` wegen des geänderten Lernziels (T13-IM-4) mit `npx tsx scripts/pruefliste.ts` nachgezogen.

## Nachweis der Prüfung

- Unabhängige Nachrechnung: eigenes Python-Skript (2. Ficksches Gesetz mit `math.erf`, Wenner, E_dyn aus v_L, Wurzel-t-Gesetz, WU-Druckgefälle und Stufen, Bohrlochvolumen, Zustandsnote, Zuverlässigkeitsindex, Fünferregel, Klopfer, Duplex, Widerstandsmoment, LEBM, Fugenbreite); 50 Prüfungen als `tests/modulpruefungTranche13.test.ts`, dazu Regressionsprüfungen der Inhaltskorrekturen T13-SHM-1, T13-SG-1/-2 und T13-IH-2.
- QA: tsc, npm test (153 Testdateien), check:formeln, check:zahlen (inkl. Tausender), check-design, check-verwaist --strict, check-any, Build, check-bundle; a11y-reiter auf allen zehn Routen (desk, mob, desk-dunkel): 153 Reiter-Prüfungen, 0 Verstöße (vorher 5 Kontrastverstöße in `bauwerksunters_monitoring` und `instandhaltung`, behoben mit T13-SHM-5 und einer Badge im Regelwerke-Reiter).
- Öffentliche Quellen dieser Prüfung: [Schumacher Gerber, VDI 6200](https://www.sg-ing.de/assets/schumacher-gerber_vdi_6200.pdf); [DIN Media, VDI 6200 Blatt 1.1](https://dinmedia.de/en/draft-technical-rule/vdi-6200-blatt-1-1/378351864); [genorma, EN 1990-2:2026](https://genorma.com/en/standards/en-1990-2-2026); [Bauprofessor, DIN 18533-1:2026-06](https://www.bauprofessor.de/din18533-1-abdichtung-von-erdberuehrten-bauteilen-die-wichtigsten-aenderungen/); [DIN Media, WU-Richtlinie 2017-12](https://www.dinmedia.de/de/technische-regel/dafstb-wasserundurchlaessige-bauwerke/283927896); [Forum Verlag, WU-Richtlinie](https://www.forum-verlag.com/fachwissen/bau-und-gebaeudemanagement/wu-richtlinie/); [Forum Verlag, TR Instandhaltung](https://forum-verlag.com/fachwissen/bau-und-gebaeudemanagement/tr-instandhaltung/); [BauNetz Wissen, TR Instandhaltung](https://www.baunetzwissen.de/beton/tipps/planungshilfen/technische-regel-zur-instandhaltung-von-betonbauteilen-8258883); [Structurae, Teileinsturz der Kongresshalle Berlin](https://structurae.net/en/literature/journal-article/teileinsturz-der-kongresshalle-berlin-schadensursachen); [RILEM TC 154-EMC](https://www.rilem.net/images/publis/123403.pdf); [Technisches Merkblatt Injektionscreme 04/2026](https://epasit.de/wp-content/uploads/2026/05/TM-epasit-IC-Injektionscreme_04_26.pdf).

## Umsetzung 29.10.2026

Entscheidungen vom 29.10.2026 zu den Fragen ohne Normtext; Regressionstest `tests/modulpruefungTranche13.test.ts` (Handwerte aus einem eigenen Python-Skript mit `math.erf` und Bisektion für erfinv). Die Normtextpunkte T13-IH-10, -11, -12 und T13-WTA-4, -5 bleiben offen.

- **T13-BS-2 (Recht & Grundlagen, Musterdaten):** Anzeigen-Generator mit neutralen Platzhaltern: Absender „Ingenieurbüro [Name]“, Empfänger „[Firma]“, Bauvorhaben „[Objekt]“ (vorher Personenname, Firma und „TH Augsburg – Trakt D / Raum D1.05“); Schlüssel in `content/bauschaeden/Bauschaeden.json` neutral benannt. App-weite Suche nach Personennamen in Musterdaten, ebenso ersetzt: Bautagebuch (Nachunternehmer „Müller GmbH“/„Elektro Schmidt“, Projektleiter „Schmidt“, Tragwerksplaner „Dr. Vrabec & Partner“, „Dipl.-Ing. Keller“, „Müller & Co.“ → „[Name]“/„[Firma]“), Probenahmeprotokoll Bodenmaterial („Thomas Wagner“, „Fr. Dr. Meier“ → „[Name]“; dabei „Untergeordnete“ → „Untere Bodenschutzbehörde“), KI-Markdown-Beispiel („Baugrundinstitut Dr. Muelller“ → „[Name]“). Unverändert: „Max Mustermann“ (üblicher Platzhalter im KI-Deklarationsmuster), Impressum, Urheber- und Autorenangaben sowie Quellen- und Personenverweise mit Sachbezug (z. B. R. Schmidt, Torstahl 1936). Hinweis: Szenarien des Bautagebuchs und der Probenahme nennen weiterhin Gebäude der THA (Campus, Mensa) als Lehrkulisse ohne Personenbezug.
- **T13-IH-13 (Stahlbetoninstandhaltung, Chloridrechner):** Raster des Chloridprofils bis 100 mm (`CHLORID_RASTER_MAX_MM` in `src/calc/schutzInstandsetzung.ts`), Diagramm auf 0–100 mm skaliert. Die Abtragstiefe wird nicht mehr abgeschnitten; reicht die Front über 100 mm (`ueberRaster`), zeigt der Rechner Tiefe und Abtrag als Mindestwerte („≥“) mit Hinweis (Prinzip K oder Bauteilersatz prüfen). Handwerte: Vorgabe C_s 2,5 M.-%/z, D 2 · 10⁻¹² m²/s, 25 a: Front exakt 71,99 mm → Rasterwert 70 mm, Abtrag 85 mm (vorher gedeckelt 65/80 mm); C_s 3/D 2/30 a: 85,11 mm → 85/100 mm; C_s 4/D 3/40 a: 133,5 mm → „≥ 100 mm“, Abtrag „≥ 115 mm“; C_s 1,5/D 1/50 a: 54,35 mm → 52,5 mm (unverändert). Grenzen-Eintrag `instandhaltung` ergänzt.
- **T13-WTA-6 (WTA, Bohrrechner):** (a) Verfahren „laut WTA-Zertifikat bzw. Herstellerangabe des Injektionsstoffs“ statt starrer Zuordnung drucklos/Druck nach DFG: angezeigt wird die erforderliche Prüfstufe des Zertifikats (60/80/95 % DFG, `wtaZertifikatsstufe`), über 95 % DFG Vortrocknung; Lehransatz „vorläufig, F-Freigabe“. Quelle: Technisches Merkblatt Injektionscreme 04/2026 (drucklos bis 95 % DFG, siehe Befund). (b) Bedarf aus dem Bohrlochvolumen als Untergrenze gekennzeichnet („≥ … Liter/m“); daneben Vergleichswert nach Herstellerangabe ≈ 15 ml je m und cm Wanddicke (`herstellerRichtwert`; 24/36/51 cm → 0,36/0,54/0,765 l/m gegenüber 0,32/0,36/0,60 l/m aus dem Bohrlochvolumen). Bohrtiefe und Faktor 1,15 unverändert (Lehrmodell).
- **Grenzen (Hinweise der Abschnitte 3, 6, 8, 9, 10):** Einträge in `src/data/rechnerGrenzen.ts` für `bauwerksunters_monitoring`, `instandhaltung`, `wta`, `wu-bauwerke` und `schutz_grundlagen` ergänzt (je 2 bis 4 Punkte, ≤ 220 Zeichen); die Module zeigen damit den Reiter „Annahmen des Rechners“. Weil Module mit Grenzen als Rechner gelten (`tests/erkundung.test.ts`, `tests/quiz.test.ts`), sind je 2 bis 3 Erkundungsaufträge in `src/data/erkundung.ts` ergänzt (Werte per Handrechnung, z. B. Chloridfront nach 50 a ≈ 102 mm → „≥ 100 mm“; Ziegel 51 cm: Bohrlochansatz 0,54 l/m gegenüber 0,77 l/m nach Herstellerangabe; WU h_w 6,0 m → I = 20, w_k 0,10 mm; Fünferregel 125 000 → 250 000 €). Rechenfragen im Quiz waren bereits vorhanden.
- **Kurzfassung `wu-bauwerke`:** „Das Wichtigste in 5 Punkten“ in `src/data/kurzfassung.ts` (WU-Richtlinie 2017-12, Beanspruchungs- und Nutzungsklassen, Entwurfsgrundsätze a/b/c, Druckgefälle und Selbstheilungs-Rissbreiten, Fugenkonzept nach DIN 18197).
- Quiz: keine Frage durch die Änderungen falsch (geprüft u. a. `q_is_wta_6` Bohrtiefe/Bohrlöcher, `q_wub_4`); `quiz.json` unverändert.

Damit ohne offene Frage (außer Normtextpunkten): `bauschaeden` (T13-BS-2 umgesetzt), `wu-bauwerke` (Grenzen und Kurzfassung ergänzt). `instandhaltung` und `wta` haben nur noch Normtextpunkte offen (T13-IH-10 bis -12 bzw. T13-WTA-4/-5); `bauwerksunters_monitoring` (T12-BU-7) und `schutz_grundlagen` (T13-IH-10) ebenfalls nur Normtext.
