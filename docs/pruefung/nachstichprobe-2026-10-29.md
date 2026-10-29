# Nachstichprobe 29.10.2026 – 15 freigegebene Fachmodule unabhängig geprüft

**Stand:** 29.10.2026 (Branch `pruefung/nachstichprobe-10-29`, Basis origin/main 5e021ebd)
**Status:** Bericht zur Kenntnis und Entscheidung – keine Prüfvermerke geändert.

> Mit dieser Nachstichprobe wurden **keine** Prüfvermerke in `src/data/pruefvermerke.ts` geändert und keine Quizfragen angepasst (keine Frage ist durch die Korrekturen falsch geworden). Ob ein Prüfvermerk zurückgenommen wird, entscheidet die fachliche Freigabe.

## Vorgehen

- **Grundgesamtheit:** alle Fachmodule mit Status `geprueft` nach Merge von PR #266 (Stand Branch `freigabe/module-10-29b`): **143 Module**.
- **Schichtung:** zwölf Schichten nach Menügruppen: Grundlagen (Grundlagen, Labor & Auswertung, Baustofflabor; 18), Beton (Betontechnologie; 11), Massivbau (Massivbau, Mechanik; 13), Baustoffe (19), Bauprodukte (24), Holz (Holzbau; 4), Bauphysik (3), Nachhaltigkeit (8), Bestand/Rückbau (Bauen im Bestand, Rückbau & Schadstoffe, Mängel & Schäden; 18), Dauerhaftigkeit (7), KI/Digitales (KI im Bauwesen, Digitales; 10), Rechnungen/Praxis (Beispielrechnungen, Praxiswissen; 8).
- **Umfang:** 10 % von 143 → 15 Module. Je Schicht ein Modul; die drei übrigen an die Schichten mit dem größten Anteil (Bauprodukte, Baustoffe, bei Gleichstand Grundlagen/Bestand per Los: Bestand/Rückbau).
- **Ziehung:** Python `random.Random(20261029)`, Schichten alphabetisch, Module je Schicht alphabetisch sortiert, `rng.sample`. Quiz-Stichprobe je Modul 3 Fragen mit Samen 20261029 + Modulindex (Fragen nach `id` sortiert). Skripte: `scratchpad/ns/ziehung.py`, `scratchpad/ns/quizziehung.py` (Sitzungsablage, nicht im Repository).
- **Prüfung:** unabhängig von der ersten Prüfung; die Befundlisten der Tranchen wurden erst nach Abschluss der eigenen Prüfung gelesen. Je Modul ≥ 3 eigene Nachrechnungen (eigenes Python-Skript, Ergebnisse im Regressionstest `tests/nachstichprobe20261029.test.ts`) bzw. ≥ 5 Faktenaussagen; Normstand 10/2026; Begriffe; Beispiele; drei Quizfragen.
- **Quellen:** Fünf Websuchen (sparsam); sonst Nachrechnung und Kenntnisstand. Normtexte wurden nicht abgeschrieben.

## Gezogene Module

| Schicht (Umfang) | Modul | Erste Prüfung |
|---|---|---|
| Bauphysik (3) | `waermeeigenschaften` | Tranche 11 |
| Bauprodukte (24) | `bp_glaeser`, `bp_recht_konformitaet` | Tranche 3/8, 7 |
| Baustoffe (19) | `gips`, `kalk` | Tranche 5 |
| Bestand/Rückbau (18) | `material_schaeden_gross`, `bauwerksdiagnose` | Tranche 13, 12 |
| Beton (11) | `biokohlebeton` | Tranche 9 |
| Dauerhaftigkeit (7) | `dauerhaftigkeit` | Tranche 12 |
| Grundlagen (18) | `labor_sicherheit` | Tranche 15 |
| Holz (4) | `holzbau_konstruktion` | Tranche 10 |
| KI/Digitales (10) | `ki_prompting` | Tranche 14 |
| Massivbau (13) | `knicken` | Tranche 10 |
| Nachhaltigkeit (8) | `oekobilanz_lca` | Tranche 11 |
| Rechnungen/Praxis (8) | `rechnung_beton` | Tranche 15 |

## Ergebnis

| Modul | Fachfehler | Gewicht | Status |
|---|---|---|---|
| `bauwerksdiagnose` | NS-BD-1 Einstufung im Beispiel 2 | **mittel** (Ergebnis eine Klasse zu hoch) | behoben |
| `bp_glaeser` | NS-GL-1 Normteil Überkopfverglasung | gering | behoben |
| `dauerhaftigkeit` | NS-DH-1 Temperaturwechsel TVG | gering | behoben |
| `oekobilanz_lca` | NS-LC-1 RC-Beton als CEM-III/A-Beispiel | gering | behoben |
| übrige 11 Module | – | – | ohne Fachfehler |

**Fehlerquote der Stichprobe: 4 von 15 Modulen mit mindestens einem Fachfehler = 27 %** (95-%-Vertrauensbereich nach Wilson etwa 11 % bis 52 %). Kein Fehler in einem Rechenkern: alle 78 Nachrechnungen stimmen mit den Kernen und den Modulwerten überein (Unterschiede nur im Rundungsrahmen gerundeter Angaben wie „rund 75 %“); alle 45 gezogenen Quizfragen sind richtig. Die Fehler stecken in Fließtext und Beispielen (Normteil-Zuordnung, Bezugsgröße, Querbezug zwischen Modulen).

**Gewichtiger Fehler (Hinweis für die Freigabe):** `bauwerksdiagnose` – das Beispiel zur charakteristischen In-situ-Druckfestigkeit stufte Kerne mit h/d = 1 über den Zylinderwert in C30/37 ein; richtig wäre mit diesem Bezug C25/30. Korrigiert (Beispiel jetzt mit Kernen h/d = 2). Der Fehler war in der ersten Prüfung (T12-BU-1, Fall BU9) nachgerechnet, der Bezug aber nicht geprüft worden. Über eine Rücknahme des Prüfvermerks entscheidet die fachliche Freigabe; aus Sicht der Nachstichprobe ist das Modul nach der Korrektur freigabefähig, offen bleibt die Frage NS-BD-2.

**Einschätzung:** Eine vollständige Wiederholung der Freigaben ist nicht nötig (Rechenkerne und Quiz fehlerfrei). Eine **gezielte erweiterte Nachprüfung wird empfohlen**: Die Quote von 27 % (mit geringem Gewicht bis auf einen Fall) zeigt, dass die erste Prüfung Beispiele und Normverweise vor allem rechnerisch geprüft hat. Vorschlag: zweite Stichprobe von weiteren 15 Modulen mit Schwerpunkt auf (1) Bezugsgrößen und Einstufungen in Beispielen (Würfel/Zylinder, deklarierte/funktionelle Einheit, Normteil), (2) Kennwerten, die in mehreren Modulen vorkommen (Glas, Zement-GWP, Expositionsklassen), (3) Normteil-Zuordnungen in Tabellen. Fällt die Quote dort unter 10 %, genügt die laufende Pflege.

## Befunde je Modul

### 1. Thermische Eigenschaften (`waermeeigenschaften`)

**Nachrechnungen:** b Beton √(2,0·2400·1000) = 2191 und Fichte 322 J/(m²K√s); Kontakttemperatur 24,3 °C bzw. 30,1 °C (Haut 33 °C, b = 1100); Dämmdicken für U = 0,24: EPS 035 13,1 cm, Holzfaser 040 15,0 cm, PIR 025 9,4 cm; Quiz a = 8,3·10⁻⁷ m²/s – alle richtig.
**Fakten:** DIN EN ISO 10456:2010-05, DIN 4108-4:2020-11, DIN EN ISO 6946:2018-03, R_si 0,13/R_se 0,04, Kennwerte VIP 0,007, Aerogel 0,015, Schaumglas 0,04, Willems Lehrbuch 8. Aufl. 2017 – richtig.
**Quiz:** `q_we_5`, `q_we_4`, `q_we_2` richtig.
**Hinweis:** Rechner-Vorgabe Steinwolle c = 840 J/(kg·K); DIN EN ISO 10456 nennt für Mineralwolle 1030 J/(kg·K). Lehrwert, kein Fehler im Sinne der Stichprobe.
**Empfehlung:** ohne Befund.

### 2. Gläser & Fenster (`bp_glaeser`)

**Nachrechnungen:** f_g,d Float k_c 1,8: 31,5 N/mm², k_c 1,0: 17,5, TVG 46,7, ESG 80 (DIN 18008-1/-2); Quiz U_w = 1,33 W/(m²K) > 1,30; U_w 1,23 × 1,48 m (b_f 110 mm, U_g 0,6, U_f 1,0, Ψ 0,038) = 0,815; Gasverlust 1 %/a nach 30 a: 74 % („rund 75 %“) – richtig.
**Fakten:** DIN EN 1279-3 L_i ≤ 1 %/a; ESG 620–680 °C, ΔT 200 K / TVG 100 K / Float 40 K; DIN 18008-5 mindestens 3 Scheiben VSG; DIN EN ISO 10077-1:2020-10; RC 1 N bis RC 6; Klasse 4 Luftdurchlässigkeit bis 600 Pa – richtig.
**Quiz:** `qn_bp_glaeser_1`, `q_bpg_2`, `q_glas_1` richtig.
**Befunde**
- **behoben – NS-GL-1:** VSG-Datenblatt „Überkopf- und Dachverglasungen nach DIN 18008-3“ – linienförmig gelagerte Horizontalverglasungen regelt DIN 18008-2 (untere Scheibe VSG aus Float oder TVG), -3 nur punktförmig gelagerte ([Baunetz Wissen, Horizontalverglasungen](https://www.baunetzwissen.de/glas/fachwissen/horizontale-glaselemente/horizontalverglasungen-159150)). Text in `content/bpglaeser/daten.json` angepasst.
- Hinweis: Rahmen-Datenblatt nennt ein Aluminium-Markenprodukt mit Rezyklatanteil – nach dem Grundsatz „Produktnamen neutral“ (T14) neutral fassen.

### 3. Konformität & Auditierung (`bp_recht_konformitaet`)

**Fakten:** Akkreditierung nach VO (EG) 765/2008 durch die DAkkS; Notifizierung durch das DIBt an die EU-Kommission mit vierstelliger NANDO-Kennnummer; DAkkS-Akkreditierung als Konformitätsvermutung, nicht zwingend; Zement CEM I System 1+; Systemzertifizierung der WPK bei 2+; Ü-Zeichen für Transportbeton nach DIN 1045-2 – richtig.
**Quiz:** `qn_bp_recht_konformitaet_3`, `_2`, `_4` richtig.
**Empfehlung:** ohne Befund.

### 4. Gips (`gips`)

**Nachrechnungen:** chemisch gebundenes Wasser 1,5·18,0/145,1 = 18,6 % (1,86 kg); Porosität (10/2,63 + 7,0 − 11,86/2,32)/10,8 = 52,7 % („≈ 53 %“); Kristallwasser Dihydrat 20,9 % („ca. 20 M.-%“); Ettringitgleichung ausgeglichen (6 + 26 = 32 H₂O) – richtig.
**Fakten:** DIN 18534 W0-I/W1-I mit Verbundabdichtung, W2-I/W3-I ungeeignet; GKBI ≙ H2, GKF ≙ DF; Löslichkeit ≈ 2 g/l; DIN EN 13279-1:2008-11, -2:2014-03, DIN EN 520:2009-12, DIN 18180:2014-09, DIN 18181:2019-04 – richtig.
**Quiz:** `qn_gips_3`, `q_gip_2`, `q_gip_1` richtig.
**Empfehlung:** ohne Befund.

### 5. Kalk (`kalk`)

**Nachrechnungen:** ΔH Karbonatisierung aus Bildungsenthalpien −113,1 kJ/mol; Kreislauf +178,2 − 65,2 − 113,1 ≈ 0; CO₂ aus 1000 kg CaCO₃ 440 kg – richtig.
**Fakten:** Dissoziation bei ≈ 898 °C (p_CO₂ = 1 bar); Kurzzeichen CL, DL, NHL, HL, FL nach DIN EN 459-1:2015-07; DIN EN 459-2:2021-09, DIN EN 998-1:2017-02, DIN EN 13914-1:2016-09; pH gesättigte Ca(OH)₂-Lösung ≈ 12,4 – richtig.
**Quiz:** `qn_kalk_2`, `qn_kalk_1`, `q_kal_3` richtig.
**Empfehlung:** ohne Befund.

### 6. Große Materialschäden (`material_schaeden_gross`)

**Nachrechnungen:** kritische Risstiefe a_c = (30/(1,12·300))²/π = 2,54 mm; Hyatt Regency 2P = 180 kN; Stava 80 % Neigung = 38,7° – richtig.
**Fakten:** Bad Reichenhall 02.01.2006, 15 Tote, BGH 1 StR 272/09; Morandi 14.08.2018, 43 Tote, 1182 m; Carolabrücke 11.09.2024, Hennigsdorfer Spannstahl, Handlungsanweisung BMVBS 2011; Silver Bridge 15.12.1967, 46 Tote, NTSB-HAR-71-1; Kongresshalle 21.05.1980; Reichsbrücke 01.08.1976; Stava 19.07.1985, 268 Tote; Na₂O-Äquivalent 0,658·K₂O; UF-Klebstoff Typ II nur Nutzungsklasse 1 (bestätigt: [DIN Media, DIN EN 301](https://www.dinmedia.de/de/norm/din-en-301/179715088)) – richtig.
**Quiz:** `q_ms_mg_1`, `q_ms_mg_5`, `q_ms_mg_3` richtig.
**Empfehlung:** ohne Befund.

### 7. Bauwerksdiagnose (`bauwerksdiagnose`)

**Nachrechnungen:** k_n = t(n−1; 0,95)·√(1 + 1/n): 2,01 / 1,92 / 1,87 / 1,81 / 1,77 / 1,73 für n = 8/10/12/16/20/30 (Kern 2,00 … 1,73, Interpolation in 1/n plausibel); Beispiel 2 f_ck,is = min(26,0; 32,0) = 26,0; Quiz 28,5 N/mm²; √t-Gesetz 100 a; v_L-Formel – richtig.
**Fakten:** DIN EN 14630 1-%-Lösung (1 g in 70 ml Ethanol); DIN EN 1542 Ø 50 mm, 0,05 MPa/s; ASTM C876 < −350 mV; OS 4 s_d,CO₂ ≥ 50 m; Gips bei 40 °C darren (DIN EN ISO 12570); DIN 68800-4 Rückschnitt Hausschwamm ≈ 1 m – richtig.
**Quiz:** `qn_bauwerksuntersuchung_2`, `_1`, `q_bwu_1` richtig.
**Befunde**
- **behoben – NS-BD-1 (gewichtig):** Beispiel 2 nannte „8 Bohrkerne (h/d = 1)“ und stufte f_ck,is/0,85 = 30,6 N/mm² über den Zylinderwert in **C30/37** ein. Kerne h/d = 1 haben einen anderen Bezug (nach der früheren Fassung Würfel; DIN EN 13791:2020-02 legt 2:1-Kerne zugrunde, [EN 13791:2019, Leseprobe](https://iteh.es/catalog/standards/cen/3209bcc7-df9a-4eb2-904d-e690e79b7452/en-13791-2019)) – mit beiden Ansätzen ergibt sich nur **C25/30** (Würfelbezug 30,6 ≥ 30; bzw. Umrechnung 1:1 → 2:1). Der Rechenkern `insituDruckfestigkeit13791` liefert mit `bezug: 'wuerfel'` ebenfalls C25/30. Korrektur: Beispiel jetzt mit Kernen Ø 100 mm, h/d = 2 (Zylinderbezug) → C30/37 bleibt richtig; Hinweis auf C25/30 bei h/d = 1 ergänzt. Test `tests/nachstichprobe20261029.test.ts` (BD2, NS-BD-1).
- **offen – Frage NS-BD-2 (Mindeststandardabweichung):** Text (Beispiel, Formelzeile, Probenahmeplaner) nennt „s mindestens entsprechend V = 8 %“, der Kern setzt keine Mindeststandardabweichung an („am Normtext prüfen; vorläufig, F-Freigabe“). **Vorschlag:** am Normtext DIN EN 13791:2020-02, Abschnitt 8, klären; bestätigt sich der Wert, im Kern s_eff = max(s; 0,08·f_m,is) ergänzen, sonst die Textangabe streichen.
- **offen – Frage NS-BD-3 (Bezug der Kerne im Kern):** Der Kern ordnet Kerne h/d = 1 dem 150-mm-Würfel zu (Ansatz der Fassung 2008). DIN EN 13791:2020-02 beruht auf 2:1-Kernen und rechnet 1:1-Kerne um. **Vorschlag:** am Normtext prüfen und dann den Schalter „Bezugskörper“ (auch in `rechnung_bestand`, T15-BS-5) auf „Kern h/d = 2“ / „Kern h/d = 1 (umgerechnet)“ umstellen.
- **offen – Frage NS-BD-4 (Phenolphthalein):** Der Probenahmeplaner sagt, die Bruchfläche „karbonatisiere nach 5–10 min an Raumluft zurück“. Eine Karbonatisierung in Minuten ist nicht plausibel; eher verblasst die Färbung bzw. die Fläche trocknet. **Vorschlag:** „Ablesen nach etwa 30–60 s; die Färbung kann mit der Zeit verblassen – sofort ablesen und fotografieren“ (zugleich Hinweis T12 zur abweichenden Ablesezeit im Prüfkatalog).
- Hinweis: Formelzeile f_cd,is = 0,85·f_ck,is/1,50 bezeichnet 0,85 als „Dauerstand- und In-situ-Faktor η“ – das ist α_cc (Dauerstand) und nicht der Faktor 0,85 aus DIN EN 13791; Wortlaut schärfen.

### 8. Biokohlebeton (`biokohlebeton`)

**Nachrechnungen:** Netto-Senke 0,80·3,667·0,80 − 0,3 = 2,05 kg CO₂/kg; 3,08 kg Zement je kg Kohle; 10 kg/m³ ≙ 30,8 kg CEM I; Quiz 21,6 kg CO₂/m³ – richtig.
**Fakten:** IPCC 2019 Refinement F_perm 0,65/0,80/0,89; EBC C ≥ 50 M.-%, H/C < 0,7; DIN EN 12390-12:2020-04; DIN EN 15804 biogener Kohlenstoff −1/+1; kein Pigment nach DIN EN 12878 – richtig.
**Quiz:** `qn_biokohlebeton_2`, `_4`, `_5` richtig.
**Empfehlung:** ohne Befund.

### 9. Dauerhaftigkeit – Prinzipien (`dauerhaftigkeit`)

**Nachrechnungen:** c_nom XD3/XC3 Ø 16: max(16; 40; 10) + 15 = 55 mm; t_krit (40/4)² = 100 a, (25/4)² = 39 a (−61 %, „rund 60 %“); Quiz c_nom = 40 mm; Zink 80 µm in C3 ≈ 67 a; Korrosionsraten im Simulator in den Bandbreiten von DIN EN ISO 12944-2 – richtig.
**Fakten:** Δc_dev 15 mm (XC1 10 mm, −5 mm bei Überwachung); Cl-Grenze 0,40 M.-%; Schutzdauer L/M/H/VH 7/15/25 a; Gebrauchsklassen DIN 68800-1; WTA 2-9 Porosität > 40 %; Eis +9 % – richtig.
**Quiz:** `qn_dauerhaftigkeit_1`, `q_dauer_1`, `q_dh_3` richtig.
**Befunde**
- **behoben – NS-DH-1:** „Thermische Vorspannung (ESG/TVG) … widerstandsfähig gegen Temperaturgradienten bis 200 K“ – das gilt nur für ESG; TVG etwa 100 K (so auch in `bp_glaeser`). Text in `content/dauerhaftigkeit/Dauerhaftigkeit.json` angepasst.
- **offen – Frage NS-DH-2:** „K-Schleifen … erhöht die mechanische und thermische Belastbarkeit um bis zu 400 %“ ist nicht belegt. **Vorschlag:** „verringert Kantenfehler und erhöht die Thermobruchsicherheit (Werte herstellerspezifisch)“.
- Hinweis: „Thermowood: durch Kochen des Holzes“ → „durch Erhitzen unter Wasserdampf bzw. Schutzgas“.

### 10. Laborsicherheit (`labor_sicherheit`)

**Nachrechnungen:** [OH⁻] bei pH 12,5 = 0,032 mol/l; Würfel 15 cm ≈ 8,1 kg; L_EX,8h 85 dB(A) als oberer Auslösewert – richtig.
**Fakten:** TRGS 559 Staubklasse M/H, Trockenkehrverbot; TRGS 906 (Quarz-A-Staub); DIN EN ISO 20345 Zehenkappe 200 J; DGUV Vorschrift 52/68, DGUV Grundsatz 308-001; Augenspülung 10–15 min – richtig.
**Quiz:** `qn_labor_sicherheit_3`, `_2`, `_5` richtig.
**Empfehlung:** ohne Befund.

### 11. Holzbau – Konstruktionsweisen (`holzbau_konstruktion`)

**Fakten:** Holzrahmenbau mit Raster 62,5 cm; Rollschub in den Querlagen von BSP; Massivholzbau in Gebäudeklasse 4/5; Skelettbau mit BSH für weitgespannte Hallen; tieffrequenter Trittschall < 100 Hz und Masse durch Schüttung; CLT 140 mm fünflagig – richtig.
**Quiz:** `qn_holzbau_konstruktion_5`, `_2`, `_3` richtig.
**Empfehlung:** ohne Befund.

### 12. Prompting-Praxis (`ki_prompting`)

**Nachrechnungen:** 40 · 500 · 1,5 = 30 000 Token, K = 0,12 €; freies Budget 118 000 Token = 157 Seiten; Quiz 240 Seiten und 0,18 € – richtig.
**Fakten:** zustandsloses Modell (Verlauf je Anfrage neu abgerechnet); schlechtere Trefferquote in der Mitte langer Kontexte; C2 TE S1 nach DIN EN 12004 – richtig.
**Quiz:** `qn_ki_prompting_3`, `q_ki_pr_1`, `qn_ki_prompting_2` richtig.
**Empfehlung:** ohne Befund.

### 13. Knicken (`knicken`)

**Nachrechnungen:** F_K Fall 2 = 1438 kN, Fall 1 = 360 kN; Ausbiegung 33,3 mm bei 65 % F_K; Quiz 50 mm; Fall 3: Abstand Wendepunkt–Gelenk 0,699·l, F_K-Verhältnis zu Fall 2 = 2,05 („rund doppelt“) – richtig.
**Fakten:** β = 2,0/1,0/0,7/0,5; Euler 1744; DIN EN 1993-1-1 6.3, DIN EN 1992-1-1 5.8; Vergrößerungsfaktor 1/(1 − N/F_K) – richtig.
**Quiz:** `qn_knicken_3`, `q_knick_2`, `qn_knicken_2` richtig.
**Empfehlung:** ohne Befund.

### 14. LCA – Grundlagen (`oekobilanz_lca`)

**Nachrechnungen:** C30/37 mit 320 kg Zement: CEM I 242,8, CEM III/A 158 kg CO₂-Äq./m³, Minderung 34,9 %, Zementanteil 87,6 %; Bahn statt Lkw −86 % („rund 85 %“); A1–A4 10 m³ Beton mit 50 km Lkw: 2450 + 121,2 kg – richtig.
**Fakten:** QNG WG23 Plus 24/96, Premium 20/64; NRF(R) nach DIN 277:2021-08; IPCC AR5 CH₄ 28; Modul D getrennt; DIN EN ISO 14040/14044:2021-02; EN 15978:2026 erschienen ([SIST EN 15978:2026, Leseprobe](https://cdn.standards.iteh.ai/samples/sist/sist-en-15978-2026/8a62551210004264864c901d16ba06e2/sist-en-15978-2026.pdf)) – richtig.
**Quiz:** `qn_oekobilanz_lca_g1`, `_g2`, `q_lca_1` richtig.
**Befunde**
- **behoben – NS-LC-1:** Tutor-Hinweis im A1–A4-Rechner: „Umstieg … auf CEM III/A Klimabeispiele (z. B. RC-Betonsysteme) … sofort und anstrengungslos um ca. 20 %“. RC-Beton (rezyklierte Gesteinskörnung) ist kein CEM-III/A-Beispiel; das Lehrbeispiel des Moduls ergibt 35 %. Neu: klinkerärmere Zemente (z. B. CEM III/A) im Lehrbeispiel rund 35 %, Datensatz „RC-Beton“ rund 20 %, Hinweis auf Expositionsklasse, Frühfestigkeit und Nachbehandlung (`content/lca/LCA.json`).
- **offen – Frage NS-LC-2:** „DIN EN 15978 … Bilanzierung von Gebäuden über 50 Jahre Betrachtungszeitraum“. Die 50 Jahre setzen BNB/QNG; nach meinem Kenntnisstand legt EN 15978 den Betrachtungszeitraum nicht fest (Bezug auf die geforderte Nutzungsdauer). In der öffentlichen Leseprobe nicht belegbar. **Vorschlag:** „… über den Betrachtungszeitraum (in Deutschland nach BNB/QNG 50 Jahre)“.

### 15. Beton: Mischungsentwurf (`rechnung_beton`)

**Nachrechnungen:** Stoffraum XC4/F3/32: z = 291,7 kg, Gesteinskörnung 1897 kg, Frischbetonrohdichte 2364 kg/m³; Quiz XD3 1860 kg/m³ und (w/z)_eq 0,513; Mischtemperatur 7,9 °C; Schuppeneis-Quiz 26,1 → 22,1 °C (T_W 20 °C); t_T bei 12 °C/7 d = 4,76 d, f_ck(t) = 15,1 N/mm² (C25/30, Zement N) – richtig.
**Fakten:** XC4 w/z 0,60, z_min 280; XD3 0,45/320; k_f 0,4 mit f ≤ 0,33·z, k_s 1,0 mit s ≤ 0,11·z; s = 0,38/0,25/0,20; Normalbeton 2000–2600 kg/m³; Frischbeton +5 bis +30 °C, unter −3 °C Luft +10 °C – richtig.
**Quiz:** `qn_rechnung_beton_5`, `_3`, `_2` richtig.
**Empfehlung:** ohne Befund.

## Behobene Fehler (dieser PR)

| Kennung | Modul | Datei | Änderung |
|---|---|---|---|
| NS-BD-1 | `bauwerksdiagnose` | `content/bauwerksuntersuchung/Bauwerksuntersuchung.json` | Beispiel 2 mit Kernen h/d = 2 (Zylinderbezug); Hinweis C25/30 bei h/d = 1 |
| NS-GL-1 | `bp_glaeser` | `content/bpglaeser/daten.json` | Überkopfverglasung linienförmig nach DIN 18008-2, punktförmig nach -3 |
| NS-DH-1 | `dauerhaftigkeit` | `content/dauerhaftigkeit/Dauerhaftigkeit.json` | Temperaturwechsel TVG 100 K, ESG 200 K, Float 40 K |
| NS-LC-1 | `oekobilanz_lca` | `content/lca/LCA.json` | RC-Beton nicht als CEM-III/A-Beispiel; Minderung wie Lehrbeispiel |

Regressionstest: `tests/nachstichprobe20261029.test.ts` (Nachrechnungen der Rechenkerne und Absicherung der vier Korrekturen).

## Offene Fragen mit Vorschlag

| Kennung | Modul | Frage | Vorschlag |
|---|---|---|---|
| NS-BD-2 | `bauwerksdiagnose` | Mindeststandardabweichung V = 8 % im Text, nicht im Kern | Normtext klären; dann Kern s_eff = max(s; 0,08·f_m) oder Textangabe streichen |
| NS-BD-3 | `bauwerksdiagnose`, `rechnung_bestand` | Bezug Kern h/d = 1 im Kern als Würfel (Fassung 2008) | Normtext 2020-02 prüfen; Schalter auf Kern 2:1 / 1:1 umgerechnet |
| NS-BD-4 | `bauwerksdiagnose` | Phenolphthalein „karbonatisiert nach 5–10 min zurück“ | „sofort nach 30–60 s ablesen, Färbung verblasst“ |
| NS-DH-2 | `dauerhaftigkeit` | K-Schleifen „+400 %“ unbelegt | qualitativ formulieren |
| NS-LC-2 | `oekobilanz_lca` | EN 15978 „50 Jahre“ | 50 Jahre BNB/QNG zuordnen |
