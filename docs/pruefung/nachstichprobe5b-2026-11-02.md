# Nachstichprobe 5b (02.11.2026) – 25 bisher nicht nachgeprüfte freigegebene Module (gerade Positionen)

**Stand:** 02.11.2026 (Branch `pruefung/nachstichprobe5b-11-02`, Basis origin/main bfc156b0)
**Status:** Bericht zur Kenntnis und Entscheidung – keine Prüfvermerke geändert; eine Quizfrage korrigiert (zur Freigabe zurückgestellt).
**Auftrag:** Weitere Messung der Fehlerquote an freigegebenen Modulen, die weder in einer der vier Nachstichproben noch in der Gegenprüfung waren. Prüfumfang wie Nachstichprobe 4: (a) Bezugsgrößen und Einstufungen in Beispielen, (b) Norm-, Teil-, Tabellen-, Abschnitts- und Ausgabenzuordnungen, (c) mehrfach vorkommende Kennwerte gegen die zentralen Konstanten; jede Beispielrechnung mit eigenem Skript nachgerechnet; alle Quizfragen des Moduls gegen den Modultext und sinngemäß (Bereichsgrenzen, Klassenzuordnungen, Rundung). Ein zweiter Prüfdurchgang (Nachstichprobe 5a) nimmt die ungeraden Positionen.

## Auswahl

- **Grundgesamtheit:** Fachmodule mit Status `geprueft` in `src/data/pruefvermerke.ts` (143), ohne die Module der Nachstichproben 1 bis 4 (`nachstichprobe-2026-10-29.md` Tabelle „Gezogene Module“ 15, `nachpruefung2-2026-10-29.md` Tabelle „Auswahl“ 15, `nachstichprobe3-2026-10-30.md` 20, `nachstichprobe4-2026-11-02.md` 20) und ohne die zehn Module der Gegenprüfung (`lca_rechner`, `oekobilanz_lca`, `boden_materialaufbereitung`, `bim_baustoffe`, `spannbeton_grundlagen`, `regularien`, `bauschaeden`, `sonderbetone`, `materialmodelle`, `schadstoffe`): **66 Module**.
- **Ordnung und Teilung:** alphabetisch nach Modul-ID (Zeichencode, „_“ vor Kleinbuchstaben); diese Prüfung nimmt die **geraden Positionen 2, 4, …, 50** (25 Module, Obergrenze 25; die geraden Positionen 52 bis 66 bleiben offen), Nachstichprobe 5a die ungeraden. Skript `scratchpad/ns5b/auswahl.py` (Sitzungsablage, nicht im Repository).

| Pos. | Modul | Pos. | Modul | Pos. | Modul |
|---|---|---|---|---|---|
| 2 | `altholz_urban_mining` | 20 | `bp_verkehr_asphalt` | 38 | `ki_ressourcen` |
| 4 | `ausbau` | 22 | `daemmstoffe` | 40 | `kombinationen` |
| 6 | `bestand` | 24 | `denkmalpflege` | 42 | `kreislauf_dpp` |
| 8 | `betonkennwerte` | 26 | `einheiten` | 44 | `labor_druckfestigkeit` |
| 10 | `bp_betonfertigteile` | 28 | `festigkeit` | 46 | `lca_regulatorik` |
| 12 | `bp_holzprodukte` | 30 | `herstellung_einbau` | 48 | `materialkennwerte` |
| 14 | `bp_kunststoffe` | 32 | `historische_bauweisen` | 50 | `metalle` |
| 16 | `bp_putz_estrich` | 34 | `holzwerkstoffe` | | |
| 18 | `bp_stahlbauprofile` | 36 | `keramik_ziegel` | | |

Nicht in dieser Hälfte (gerade Positionen über 25): 52 `nachhaltigkeit_daten_regeln`, 54 `normen_ausblick`, 56 `putzemoertel`, 58 `px_planung`, 60 `rechnung_nachhaltigkeit`, 62 `rueckbau`, 64 `sichtbeton`, 66 `stahlbau_ec3`.

## Vorgehen

- **Prüfumfang je Modul:** Komponente laut `src/routing/ModulInhalt.tsx` mit Importkette (Inhalts-JSON, Rechenkern, Moduldaten); bei geteilten Komponenten nur der Teil der Modul-ID: `bp_verkehr_asphalt` = Reiter „Asphaltsorten & Tragschichten“ (`VergleichTab`), `ki_ressourcen` = Reiter „Unabhängige KI-Seiten“ mit Beispielen 13/14, `lca_regulatorik` = Bereiche „CRREM & Regulatorik“ und „Praxis & Innovationen“ (CRREM-Simulator, CBAM-Rechner, Gebäudetyp E). Ergänzungsbogen `docs/pruefung/kennwert-abgleich/<modul>.md` als Prüfauftrag (für `ki_ressourcen`, `kombinationen`, `lca_regulatorik` liegt keiner vor; dort nur eigene Durchsicht).
- **Nachrechnung:** jede Beispielrechnung, jede rechnende Quizfrage einschließlich der rechnerischen Distraktor-Rückmeldungen und die Standardeingaben der Rechner mit eigenem Skript (`scratchpad/ns5b/nachrechnung.py`): **295 Nachrechnungen gegen einen im Modul, im Quiz oder in der Quelle genannten Wert – alle im Rundungsrahmen.** Dabei fiel eine Distraktor-Rückmeldung auf, deren Rechenweg nicht zum Distraktor passt (NS5B-LD-1). Regressionstest `tests/nachstichprobe5b.test.ts` über zwölf Rechenkerne (Altholz, Bestand, Bauprodukte, Festigkeitsvergleich, Spannungszustand, Keramik, Laborversuche, CBAM, Kombinationen, Holzphysik) und die Korrekturen.
- **Quiz:** alle 157 Fragen der 25 Module gegen den Modultext und sinngemäß gelesen (Bereichsgrenzen, Klassenzuordnungen, Rundung, Herleitung jeder rechnerischen Rückmeldung).
- **Zählregel wie Nachstichprobe 1–4:** ein Modul zählt als fehlerhaft, wenn der Modulinhalt mindestens eine eindeutig falsche fachliche Aussage, Einstufung oder Zuordnung enthält. Fragen, Hinweise und redaktionelle Punkte zählen nicht. Fehler in Quiz-Erklärungen und -Rückmeldungen werden getrennt ausgewiesen (wie Nachstichprobe 4).
- **Quellen:** drei Websuchen (Art. 6 BayDSchG, Gleichrang in der AltholzV, Mengen mineralischer Bauabfälle) mit den Seiten [Bayern.Recht, Art. 6 BayDSchG](https://www.gesetze-bayern.de/Content/Document/BayDSchG-6) (Fassung ab 01.05.2026), [Deutsche Handwerks Zeitung, Novelle der Altholzverordnung](https://www.deutsche-handwerks-zeitung.de/altholz-nur-ein-viertel-wird-recycelt/150/32542/395124) und [Umweltbundesamt, Bauabfälle](https://www.umweltbundesamt.de/daten/ressourcen-abfall/verwertung-entsorgung-ausgewaehlter-abfallarten/bauabfaelle); sonst Nachrechnung, zentrale Konstanten und Kenntnisstand. Normtexte wurden nicht abgeschrieben.

## Ergebnis

| Modul | Befund | Art | Gewicht | Status |
|---|---|---|---|---|
| `bp_stahlbauprofile` | NS5B-SP-1 Auswahl γ_M0: „1,10 (Nationaler Anhang)“ – der deutsche NA legt γ_M0 = 1,00 fest (so auch die Formelkarte des Moduls und `q_bps_2`); 1,10 ist γ_M1 | (b)/(c) | gering (Standard 1,00 richtig) | behoben |
| `holzwerkstoffe` | NS5B-HW-1 „Nach KrWG-Abfallhierarchie und AltholzV hat die stoffliche Verwertung … Vorrang“ – die geltende AltholzV stellt stoffliche und energetische Verwertung gleichrangig nebeneinander (so auch `altholz_urban_mining`) | (b) | gering | behoben |
| `lca_regulatorik` | NS5B-LR-1 Einleitung „das neue Gebäudetyp-E-Gesetz (§ 650o BGB)“ – nach dem eigenen Abschnitt Gebäudetyp E (Stand 10/2026) Entwurf, kein Gesetz; § 650o BGB-E | (b) | gering | behoben |
| `denkmalpflege` | NS5B-DP-1 Kennzeichen „Art. 6 BayDSchG (Umgebung) – Absatz prüfen“ (Bearbeitungsvermerk im angezeigten Text) | redaktionell (b) | – | behoben |
| `labor_druckfestigkeit` | NS5B-LD-1 Quiz `qn_labor_druckfestigkeit_1`: Rückmeldung zum Distraktor 6,0 MPa nennt einen Rechenweg, der 4,0 MPa ergibt | Quiz | gering | korrigiert (`verified: false`) |
| `bestand` | NS5B-BE-1 Temperatur-Korrekturfaktor F_x = 0,8 für „Steildach / oberste Geschossdecke“ | Frage | – | offen |
| übrige 20 Module | – | – | – | ohne Befund |

**Fehlerquote (Modulinhalt, Zählregel wie Nachstichprobe 1–4): 3 von 25 Modulen = 12 %** (95-%-Vertrauensbereich nach Wilson **4 % bis 30 %**).
**Einschließlich der falschen Quiz-Rückmeldung: 4 von 25 = 16 %** (Wilson 6 % bis 35 %).

| Stichprobe | Module mit Fachfehler | Quote | Wilson 95 % |
|---|---|---|---|
| Nachstichprobe 1 (29.10.) | 4 von 15 | 27 % | 11 – 52 % |
| Erweiterte Nachprüfung 2 (29.10.) | 5 von 15 | 33 % | 15 – 58 % |
| Nachstichprobe 3 (30.10., nach Durchsicht A–D) | 4 von 20 | 20 % | 8 – 42 % |
| Nachstichprobe 4 (02.11.) | 1 von 20 | 5 % | 1 – 24 % |
| Nachstichprobe 4 einschließlich Quiz-Erklärungen | 3 von 20 | 15 % | 5 – 36 % |
| **Nachstichprobe 5b (02.11., gerade Positionen)** | **3 von 25** | **12 %** | **4 – 30 %** |
| Nachstichprobe 5b einschließlich Quiz | 4 von 25 | 16 % | 6 – 35 % |

- **Statistik (exakter Test nach Fisher):** gegenüber Nachstichprobe 1–3 zusammen (13 von 50 = 26 %) zweiseitig p = 0,23 (einseitig „gesunken“ p = 0,14); gegenüber Nachstichprobe 4 (1 von 20) zweiseitig p = 0,62; gegenüber Nachstichprobe 1–4 zusammen (14 von 70 = 20 %) p = 0,55. Einschließlich Quiz gegen Nachstichprobe 4 einschließlich Quiz (3 von 20): p = 1,0. Kein Unterschied ist bei diesen Umfängen nachweisbar.
- Bei einer wahren Quote von 20 % träten 3 oder weniger Fehlermodule unter 25 mit 23 % Wahrscheinlichkeit auf, bei 10 % mit 76 %. Die 10-%-Schwelle der ersten Nachstichprobe ist vom Punktschätzer knapp verfehlt und vom Vertrauensbereich nicht ausgeschlossen. Nachstichprobe 4 und 5b zusammen: **4 von 45 Modulen = 9 %** (Wilson 4 % bis 21 %).
- **Art der Fehler:** Wie in Nachstichprobe 4 keine Fehler in Rechenkernen, Beispielrechnungen oder Tabellenwerten; alle drei Fachfehler sind Zuordnungen (Normwert der falschen Größe, Rechtsstand) in Begleittexten. Zwei davon widersprechen einer richtigen Aussage an anderer Stelle des Repositoriums (NS5B-HW-1 ↔ `altholz_urban_mining`, NS5B-LR-1 ↔ Abschnitt Gebäudetyp E und `RechtsrahmenKompendium`), einer der Formelkarte desselben Moduls (NS5B-SP-1). Vorschlag wie Nachstichprobe 4: bei inhaltlichen Korrekturen gleichlautende Aussagen in anderen Modulen mitsuchen (hier etwa „AltholzV“, „Gebäudetyp-E-Gesetz“, „γ_M0“).
- **Gewichtige Fehler (Rechenergebnis oder Nachweisentscheidung falsch): keine.** Kein Anlass für die Rücknahme eines Prüfvermerks.

## Befunde je Modul

### 1. Altholz & Urban Mining (`altholz_urban_mining`)
**Nachrechnungen:** Rechner-Standard (15/45/15/25 t, Ausbringen 95/90/85/95 %): M_st = 58,25 t, A IV 1,25 t, q_F = 8,75 % (Quiz „8,8 %“), w_A IV = 2,15 %; Beispiel 1 Stufe 2: 56,03 t, 0,22 %, Verlust 1,1 t; Beispiel 2: 2160 t, 1166 t; 1 t darrtrockenes Holz ≈ 1,8 t CO₂; Quiz 5/6 mit allen Rückmeldungen – richtig.
**(b):** AltholzV § 2 Nr. 4 (Kategorien), Anhang II (As 2, Pb 30, Cd 2, Cr 30, Cu 20, Hg 0,4, Cl 600, F 100, PCP 3, PCB 5 mg/kg TM; gleitender Mittelwert aus vier Untersuchungen, Einzelwert ≤ +25 %), Anhang III, KrWG § 6, AVV 17 02 04*, 17. BImSchV, ISO 20473 (NIR ab 780 nm bis 3 µm) – richtig. Ohne Befund.

### 2. Ausbau (`ausbau`)
**Nachrechnungen:** Heizestrich 8 m: ΔL_T = 2,9 mm, ΔL_cs = 4,0 mm, Spanne 3,2 bis 4,8 mm; Quiz 1,8/2,4 mm und Distraktor 3,6 mm (50 K) – richtig.
**(b):** DIN EN 14411 (E ≤ 0,5 / 0,5–3 / > 10 %, Gruppen BIa/BIb/BIIa/BIII), DIN EN 12004-1 (C1 ≥ 0,5, C2 ≥ 1,0 N/mm²), DIN 18534 (W0-I/W1-I), DIN 18157-1 bis -3, Feldgrößen Heizestrich nach BEB/Hersteller – richtig. Ohne Befund.

### 3. Bauen im Bestand (`bestand`)
**Nachrechnungen:** Beispiel 1: R_D = 0,92, U_neu = 0,63 W/(m²K), θ_si 15,1 → 18,0 °C; Beispiel 2: 7308 kWh/a, 1754 kg CO₂-Äq./a (Erdgas 0,24 kg/kWh = `CO2_ERDGAS`, Anlage 9); Quiz `q_bst_3` 0,24 mit den Rückmeldungen 0,19/0,29/0,35, `q_bst_5` f_Rsi = 0,66, Taupunkt 9,3 °C, 80-%-Kriterium 12,6 °C – richtig.
**(b)/(c):** Anlage 7 GModG (Außenwand und Steildach 0,24, Flachdach 0,20, Kellerdecke 0,30, Fenster 1,30 W/(m²K)), Bagatellgrenze 10 %, DIN 4108-3:2024-03, WTA 6-4/6-5, Asbestzement bis 1993, alte KMF bis 06/2000 – richtig.
- **offen – Frage NS5B-BE-1 (c):** Der Sanierungsrechner rechnet die Heizwärmeeinsparung für das Bauteil „Steildach / oberste Geschossdecke“ mit F_x = 0,8 (`FX.steildach_oGD` in `src/utils/bestandKern.ts`, Quelle DIN V 4108-6). Nach DIN V 4108-6 gilt 0,8 für die oberste Geschossdecke zum nicht ausgebauten Dachraum; ein Steildach als Systemgrenze wird nach Kenntnisstand mit F_x = 1,0 angesetzt. **Vorschlag:** das Bauteil im Rechner trennen (Steildach 1,0, oberste Geschossdecke 0,8) oder im Text „F_x = 0,8 (oberste Geschossdecke; für ein Steildach 1,0)“ ergänzen (Normtext; die Höchstwerte 0,24 sind für beide gleich).

### 4. Betonkennwerte (`betonkennwerte`)
**Nachrechnungen:** C30/37: f_cd = 17,0, f_ctm = 2,9, E_cm = 32,8 → 33 GPa; f_ctm und E_cm aller 14 Klassen C12/15 bis C90/105 aus den Gleichungen von Tab. 3.1 gegen die Tabellenwerte (`daten.ts`, auch ε_c1, ε_cu1, ε_c2, ε_cu2, n, ε_c3, ε_cu3 der Klassen ab C55/67 gegen Tab. 3.1); Quiz: E_cm Kalkstein 31 700 mit allen Distraktoren, f_cm(3) = 25,2 (Klasse R; 17,4 S; 22,7 N), h₀ = 300 mm/k_h = 0,75, φ_k = 2,32 (4,56; 3,10) – richtig.
**(b)/(c):** DIN EN 1992-1-1 3.1.2 bis 3.1.7, Gl. (3.7), 7.4.3 Gl. (7.20), Anhang B (B.3a/B.3b), α_E (Quarzit 1,0, Kalkstein 0,9, Sandstein 0,7, Basalt/dichter Kalkstein 1,2 nach DAfStb-Heft), Zementklassen s, EC2 2. Generation (E_cm = k_E · f_cm^1/3 mit k_E = 9500, η_fc = (40/f_ck)^1/3), DIN EN 13791:2020-02 (≈ 0,85) – richtig; HFB-Klassen bereits „vorläufig“. Ohne Befund.

### 5. Betonfertigteile (`bp_betonfertigteile`)
**Nachrechnungen:** Hohlplatte 26,5 cm: 6,6 → 4,0 kN/m² (Δ 2,6); Quiz 32 cm, η = 0,45: 4,4/3,6 kN/m², Distraktor 4,8 (η = 0,40) – richtig.
**(b):** DIN EN 13369 / DIN 1045-4:2023-08, DIN 1045-40:2023-08, DIN EN 1168, 13747, 14992, DIN 18218, DIN EN 1992-1-1 6.2.5, DIN 488 (Gitterträger) – richtig. Ohne Befund.

### 6. Bauprodukte Holz (`bp_holzprodukte`)
**Nachrechnungen:** Deckenbalken C24 10/20, e = 62,5 cm, 4,5 m: g_k = 0,71, q_k = 0,94, q_d = 2,36 kN/m, M = 5,98 kNm, σ = 8,97, f_m,d = 14,8 N/mm², η = 0,61; w_inst = 5,2 + 6,8 = 12,0 mm (80 % von l/300), w_fin = 16,3 mm; Quiz w = 9,1 mm (flach 36,4 mm), (200/240)² = 0,69, (200/240)³ = 0,58 – richtig.
**(b)/(c):** Kennwerte C24/GL24h/GL28h/GL30h zentral aus `kennwerte.ts`, k_mod, k_def = 0,6, ψ₂ = 0,3, γ_M = 1,3 (NA; EN-Empfehlung 1,25 für BSH), k_cr nach NA – richtig. Ohne Befund.

### 7. Bauprodukte Kunststoffe (`bp_kunststoffe`)
**Nachrechnungen:** Burgers-Beispiel 0,50 + 0,10 + 0,25 = 0,85 %, E_c = 590 N/mm² (59 %, +70 % in rund 42 Tagen); Quiz 0,65 % (E_c 615), PVC-U-Rinne 38,4 mm (Beton 4,8, PE 96) – richtig.
**(c):** α PE 150–200, PVC-U 70–80 · 10⁻⁶/K, λ PIR 0,022, Resol 0,021, XPS ≥ 300 kPa, ETFE-Kissen um 300 Pa – richtig. Ohne Befund.

### 8. Bauprodukte Putz & Estrich (`bp_putz_estrich`)
**Nachrechnungen:** 1,5 · 18,0/145,1 = 0,186 kg/kg, Überschuss ≈ 0,5; Quiz-Rückmeldungen 0,12 und 0,25 kg/kg; s_d Kalkputz 0,15 m – richtig.
**(b):** DIN EN 998-1 (CS I 0,4–2,5, CS II 1,5–5,0 N/mm²), DIN EN 13279-1, DIN EN 13813 (C5–C80, F1–F50, AS-IC), WTA 2-9 (Luftporen > 25 %), DIN 4108-3 (s_d ≤ 0,5 m diffusionsoffen) – richtig. Ohne Befund.

### 9. Stahlbauprofile (`bp_stahlbauprofile`)
**Nachrechnungen:** IPE 300, S235: M = 45 kNm, σ = 80,8 N/mm² (34 %), w = 6,7 mm ≤ 20 mm; Standard S355: η = 30,6 %; Quiz 42,2 kg/m, λ_z = 79 (λ_y 47), W_y/W_z = 6,9 – richtig.
- **behoben – NS5B-SP-1 (b)/(c):** Die Auswahl des Teilsicherheitsbeiwerts bot „1,00 (Empfohlen EC3)“ und „1,10 (Nationaler Anhang)“. DIN EN 1993-1-1/NA legt γ_M0 = 1,00 fest (Formelkarte des Moduls: „γ_M0 = 1,0 nach NA“; Quiz `q_bps_2`); 1,10 ist der Wert γ_M1 für Stabilitätsnachweise. Neu: „1,00 (EC3, auch NA Deutschland)“ und „1,10 (Vergleich: γ_M1 nach NA)“ (`src/modules/BpStahlbauprofile.tsx`). Der Standard war 1,00, die Ergebnisse bei Standardeingabe also richtig.

### 10. Verkehrswegebau: Asphaltsorten & Tragschichten (`bp_verkehr_asphalt`)
**Prüfumfang:** Reiter „Asphaltsorten & Tragschichten“ und die zugehörigen Daten. AC (stetige Sieblinie), SMA (Ausfallkörnung, Zellulosefasern), MA (walzfrei, Bitumen 7,5–8,5 M.-%), PA (Hohlraum ≥ 22 Vol.-%, bis 5 dB(A)), HGT gekerbt, STS/FSS (SZ/LA, 0/32 bzw. 0/45) – stimmig; die sechs Quizfragen (DIN EN 13108-1/-5/-6/-7, ZTV Beton-StB) stimmen mit dem Text. Hohlraum- und Bitumenspannen sind Lehrwerte (maßgebend TL Asphalt-StB je Sorte). Ohne Befund.

### 11. Dämmstoffe (`daemmstoffe`)
**Nachrechnungen:** KS-Wand R = 0,43, R_D = 4,57 m²K/W, EPS 035: 160 mm, MW 032: 146 mm, Holzfaser 040: 183 mm; VIP-Faktor 3 bis 5; Quiz 14 cm (16; 28) – richtig.
**(b)/(c):** λ-Spannen, EPS Euroklasse E (früher B1), Holzfaser c ≈ 2100 J/(kgK), Schaumglas A1/μ ≈ ∞, DIN 4108-10, DIN EN 13162 – richtig. Ohne Befund.

### 12. Denkmalpflege (`denkmalpflege`)
**Nachrechnungen:** Correns Halit c/c_s = 2: 62 MPa; Quiz 1,5: 36,6 MPa (lg 15,9; ohne ln 135; ln 2 62,5); Fachwerk-Innendämmung U = 0,58; Quiz 0,52 (0,36; 0,80; 0,70); § 7i EStG 8 × 9 % + 4 × 7 % = 100 %, § 10f 10 × 9 % = 90 % – richtig.
**(b):** Art. 1, 2, 6, 7, 8 Abs. 2 (eine Woche), 9 (Schatzregal seit 01.07.2023), 20 BayDSchG, § 105 GModG, WTA 2-9, 6-4, 6-5, 8-1 – richtig.
- **behoben – NS5B-DP-1 (redaktionell, b):** Das Kennzeichen der Karte „Umgebungsschutz“ lautete „Art. 6 BayDSchG (Umgebung) – Absatz prüfen“ (Bearbeitungsvermerk im angezeigten Text). Die Erlaubnispflicht für Anlagen in der Nähe von Baudenkmälern steht in Art. 6 Abs. 1 Satz 2 BayDSchG ([Bayern.Recht, Art. 6 BayDSchG](https://www.gesetze-bayern.de/Content/Document/BayDSchG-6)). Neu: „Art. 6 Abs. 1 Satz 2 BayDSchG“ (`content/denkmalpflege/Denkmalpflege.json`).

### 13. Einheiten (`einheiten`)
**Nachrechnungen:** 5,56 N/mm² (0,556 kN/cm²), M = 45 kNm, W = 12,5 · 10⁶ mm³, σ = 3,6 N/mm², 5 kN/m² = 0,005 N/mm², 1 kN ≈ 102 kp; alle Quiz-Distraktoren (55,6; 556; 5 N/mm²; 45 GJ, 3,47) – richtig.
**(b):** DIN 1301-1:2010-10, DIN 1301-2:1978-02, DIN EN ISO 80000-1, SI-Revision 2019 – richtig. Ohne Befund.

### 14. Festigkeitsberechnungen (`festigkeit`, mit Spannungszustand)
**Nachrechnungen:** Grenzhöhe C20/25: 849 m (Bemessung 356 m), Reißlänge S235 4675 m; alle elf Quizfragen mit Distraktoren (Mauerwerk 680 m, C24 3519 m, Würfelstapel 8494 Stück/849 m, Δa = 0,067 mm, Aluminium 7,6 km, Mohr σ₁/σ₂ = 140/−60, φ₁ = 22,5°, von Mises 200/346 N/mm²) – richtig.
**(c):** Beton f_ctm/E_cm nach Tab. 3.1, C24 f_t,0,k = 14,5/f_c,0,k = 21 (`kennwerte.ts`), S235 f_u = 360, S690: 770 N/mm² – richtig. Ohne Befund.

### 15. Herstellung & Einbau (`herstellung_einbau`)
**Nachrechnungen:** Pumpdruck 3,2 + 13,9 + 4,7 ≈ 22 bar (v = 0,68 m/s); Quiz 23,8 bar (Distraktoren 20 und 6 bar); Lieferzeit 100 min > 90 min, Quiz 55 min > 45 min – richtig.
**(b):** DIN 1045-2, 7.6 (90/45 min), (w/z)_eq mit k = 0,4 (f/z ≤ 0,33) und Silikastaub k = 1,0 (s ≤ 0,11 z) nach DIN 1045-2:2023-08 – richtig. Ohne Befund.

### 16. Historische Bauweisen (`historische_bauweisen`)
**Nachrechnungen:** Holzbalkendecke 1900: q = 2,8 kN/m, M = 7,09 kNm, W = 1,29 · 10⁶ mm³, σ = 5,5 N/mm²; Schwinden 220 · 0,0036 · 18 = 14,3 mm; Quiz Bogenschub 34 kN (44; 48), Kappe 9,75 kN/m (8,1; 19,5; 0,1), Eiche radial 5,76 mm (7,2; 10,9) – richtig.
**(c):** Schwindbeiwerte aus `SCHWINDBEIWERTE` (Fichte tangential 0,36, Eiche 0,18/0,34), Reichsformat 250 × 120 × 65 mm, NF/DF, Zugband-Lehrwert bereits gekennzeichnet – richtig. Ohne Befund.

### 17. Holzwerkstoffe (`holzwerkstoffe`)
**Nachrechnungen:** OSB/3 NKL 1 w_fin = 10,0 mm, Vollholz 6,4 mm, NKL 2 13,0 mm; Quiz 10,4 mm (7,2; 5,76; 8,0) – richtig.
**(b)/(c):** k_def nach DIN EN 1995-1-1 Tab. 3.2, γ_M nach Tab. 2.3 und NA, DIN EN 300 (OSB/1 bis /4), DIN EN 312 (P2–P7), REACH Anhang XVII Eintrag 77 (0,062 mg/m³ seit 06.08.2026) – richtig.
- **behoben – NS5B-HW-1 (b):** „Nach KrWG-Abfallhierarchie und AltholzV hat die stoffliche Verwertung (…) Vorrang“. Die Abfallhierarchie des KrWG stellt das Recycling vor die energetische Verwertung; die geltende AltholzV stellt beide Verwertungswege dagegen gleichrangig nebeneinander, ein Vorrang des Recyclings ist erst für die Novelle vorgesehen ([Deutsche Handwerks Zeitung, Novelle der Altholzverordnung](https://www.deutsche-handwerks-zeitung.de/altholz-nur-ein-viertel-wird-recycelt/150/32542/395124); ebenso `altholz_urban_mining`). Neu: „Nach der Abfallhierarchie des KrWG (§ 6) steht das Recycling (…) vor der energetischen Verwertung; die geltende AltholzV stellt stoffliche und energetische Verwertung dagegen noch gleichrangig nebeneinander (Novelle mit Vorrang des Recyclings angekündigt).“ (`content/holzwerkstoffe/Holzwerkstoffe.json`). Die Quizfragen des Moduls berühren den Punkt nicht.

### 18. Keramik & Ziegel (`keramik_ziegel`)
**Nachrechnungen:** Fliese E_b = 0,28 % (BIa), V = 536,5 cm³, ρ = 2,33 g/cm³, P_offen = 0,65 %, Gegenprobe 0,60 % (BIb); Formmaß NF 244,90/260,53 mm, s_ges = 7,88 %, 237,55 mm (−2,45 mm); Quiz BIb (2,5 %), P_offen = 20 % (10; 16,7; 9,1), 0,44 kg CO₂ je kg CaCO₃; Klasse 12/60 mit Mittelwert 15/75 N/mm² – richtig.
**(b):** DIN EN 771-1:2015-11 (F0–F2, S0–S2, LD/HD), DIN 20000-401:2017-01, DIN 105-4:2019-01, DIN EN 14411:2016-12, DIN EN ISO 10545-3/-12, DIN EN 1304, DIN 4226-101 (Typ 1 Rb ≤ 10 %, Typ 2 ≤ 30 %), EBV seit 01.08.2023 – richtig. Ohne Befund.

### 19. KI: unabhängige KI-Seiten (`ki_ressourcen`)
**Nachrechnungen:** u = 1,96 · √(0,78 · 0,22/200) = 0,057 > 0,04; 0,175 kWh, 0,063 kg CO₂, 0,061 €; Quiz ±4,9 Prozentpunkte (2,5; 9,8), 0,49 kg als Distraktor – richtig. Der Strommix-Faktor 0,36 kg/kWh ist als UBA-Lehrwert gekennzeichnet (der GModG-Wert 0,56 in `bestand` dient einem anderen Zweck). Ohne Befund.

### 20. Kombinationen & Verbund (`kombinationen`)
**Nachrechnungen:** Voigt 139 GPa, Reuss 7,8 GPa, vertauscht 94 GPa; GFK dehnt sich rund viermal so stark wie Stahl; Standardwand U = 0,178 W/(m²K) – richtig.
**(b)/(c):** DIN EN 1504-2 (Produktarten, Hydrophobierung), OS 8/OS 11 mit Haftzug 1,5/1,0 N/mm² (bereits „vorläufig“), DIN EN 1542 (Ø 50 mm), DIN EN ISO 12944, E⁰ Zn −0,76 V/Fe −0,44 V, DIN 18516-1 (≥ 20 mm), DIN 55699/EAD 040083-00-0404/DIN EN 13499, PVB 0,76/1,52 mm, α_T Beton 10/Stahl 12 · 10⁻⁶/K – richtig. Ohne Befund.

### 21. Kreislaufwirtschaft & DPP (`kreislauf_dpp`)
**Nachrechnungen:** MCI 0,82 (LFI 0,40, F = 0,45; bei X = 1 0,64), Rückbauquote 89 % ≥ 70 %; Quiz 0,82 (0,64; 0,55; 0,80), 0,70 (0,30; 0,55; 0,67) – richtig.
**(b)/(c):** KrWG § 14, RL 2008/98/EG Art. 11 Abs. 2, DIN SPEC 91484/91525, Ellen MacArthur Foundation (2015), EBV; Mengen „ca. 130/60/20/15 Mio. t“ gegen UBA 2022 (Boden und Steine 122,1, Bauschutt 55,2, Straßenaufbruch 17,1, Baustellenabfälle 12,9 Mio. t; zusammen 207,9 Mio. t, rund 61 % des Abfallaufkommens; [Umweltbundesamt, Bauabfälle](https://www.umweltbundesamt.de/daten/ressourcen-abfall/verwertung-entsorgung-ausgewaehlter-abfallarten/bauabfaelle)) – als gerundete Größenordnung richtig. Ohne Befund.

### 22. Handout Druckfestigkeit an Würfeln (`labor_druckfestigkeit`)
**Nachrechnungen:** Protokoll C30/37: 42,4/43,6/41,5 MPa, f_cm = 42,5 ≥ 41, f_min = 41,5 ≥ 33 → C30/37 (C35/45 verlangt 49), Rohdichte 2404 kg/m³, 13,5 kN/s; Quiz 40,0 MPa, 41,4 MPa (48,9; 36,0), C20/25 bei f_cm = 33,2 – richtig.
**(a)/(b):** Bezug der Kriterien auf f_ck,cube (Würfel), Erstherstellung f_cm ≥ f_ck + 4 und f_ci ≥ f_ck − 4 (n = 3), Faktor 0,92 bzw. 0,95 (DIN EN 12390-2, NA), (0,6 ± 0,2) MPa/s (DIN EN 12390-3), Mörtelprismen 2400 N/s (DIN EN 196-1) – richtig.
- **korrigiert – NS5B-LD-1 (Quiz `qn_labor_druckfestigkeit_1`):** Die Rückmeldung zum Distraktor „6,0 MPa“ lautete „Die Fläche wurde in cm² statt mm² eingesetzt und die Kraft nicht in N umgerechnet“. Dieser Rechenweg ergibt 900/225 = 4,0 (das ist der Distraktor „4,0 MPa“); 6,0 entsteht aus 900/150, also mit der Kantenlänge statt der Fläche. Neu: „6,0 entsteht, wenn die Kraft (900 kN) nur durch die Kantenlänge 150 mm statt durch die Fläche 22 500 mm² geteilt wird.“ Frage auf `verified: false`, Prüfer und Datum entfernt, `vorpruefung` 02.11.2026 „korrigiert“; Prüflisten neu erzeugt. Antwort und Optionen unverändert.

### 23. LCA: Regulatorik & Praxis (`lca_regulatorik`)
**Nachrechnungen:** CRREM-Simulator (Stützwerte 52/38/18/10 bzw. 35/26/15/8, linear): Quiz `qn_lca_regulatorik_2` Büro 45 · 0,25 = 11,25 → 2035 (ohne Maßnahme 2023, Hülle 2028; Ziel 2032 14,8, 2034 11,6), `_3` Wohnen 30 kg: 2023/2026/2028/2036; CBAM-Endzustand 1000 · 0,8 · (80 − 20) = 48 000 €; biogener Speicher 1800 m³ (500 kg/m³, u = 12 %) 1473 t → „1500 t“; 300 statt 700 kg/m² = 57 % – richtig.
**(b):** CBAM-Faktor 97,5 % (2026) bis 0 (2034) nach Art. 10a Abs. 1a RL 2003/87/EG, VO (EU) 2023/956 Art. 9, 21, 31, VO (EU) 2025/2083 (50 t), ETS II ab 2028, EPBD (EU) 2024/1275 (GWP ab 2028 > 1000 m², ab 2030 alle), DIN 18940:2023-06 (Gebäudeklasse 4, 13 m; SFK-Angabe bereits „vorläufig“) – richtig.
- **behoben – NS5B-LR-1 (b):** Die Einleitung des Bereichs „Praxis & Innovationen“ nannte „das neue Gebäudetyp-E-Gesetz (§ 650o BGB)“. Der eigene Abschnitt Gebäudetyp E (Stand 10/2026) und `RechtsrahmenKompendium` sagen richtig: Gesetzentwurf, der Regierungsentwurf von 2024 ist mit der 20. Wahlperiode erledigt, Eckpunkte für einen neuen Entwurf liegen vor; § 650o ist eine Entwurfsvorschrift (BGB-E). Neu: „das geplante Gebäudetyp-E-Gesetz (Entwurf, u. a. § 650o BGB-E)“ (`content/nachhaltigkeit/PraxisInnovationen.json`).

### 24. Materialkennwerte (`materialkennwerte`)
**Nachrechnungen:** Aluminium-Attika 13,8 mm, Stahlbeton 6,0 mm, Differenz 7,8 mm; E/ρ Stahl 26,8, C24 26,2, Beton 13,8; LC20/22 E_lcm ≈ 16 000 N/mm² und f_ctk;0,05 ≈ 1,3 N/mm² (η_E, η_1 aus ρ = 1600 kg/m³); Quiz f_ctm 2,9 (2,0 = f_ctk;0,05; 3,8 = f_ctk;0,95), λ-Verhältnis 15 – richtig.
**(c):** Datentabelle `src/data/materials.json` gegen Tab. 3.1 (C30/37, C80/95), DIN EN 338/14080 (C24, D30, GL24h), DIN 4108-4 Tab. 1 (KS 1,8: 0,99; Ziegel 1,6: 0,68, 1,8: 0,81) – richtig. Ohne Befund.

### 25. Metalle (`metalle`)
**Nachrechnungen:** Fassadenbekleidung 6 m, 80 K: Aluminium 11,5 mm, Stahl 5,8 mm, Titan 4,1 mm; Quiz Titanzink 15,4 mm (Stahl 8,4) – richtig.
**(b)/(c):** CRC II/III/V nach DIN EN 1993-1-4 (1.4301, 1.4404, 1.4529/1.4565), S355J2W nach DIN EN 10025-5, Titanzink nach DIN EN 988 (α ≈ 22 · 10⁻⁶/K), Eloxal 15–25 µm, E⁰ Cu +0,34 V, DIN EN 124/545, DZR-Messing nach DIN EN 12164 – richtig. Ohne Befund.

## Hinweise (keine Änderung)

- **Aluminium mehrfach mit leicht abweichenden Lehrwerten:** α_T 23 · 10⁻⁶/K in `materialkennwerte` (wie DIN EN 1999-1-1), 24 · 10⁻⁶/K in `metalle`; Zugfestigkeit EN AW-6060 190 N/mm² in `materialkennwerte`, 200 N/mm² in `festigkeit`. Beides im Rahmen der Legierungs- und Zustandsstreuung; bei der nächsten Pflege auf einen zentralen Lehrwert (z. B. in `kennwerte.ts` neben λ = 160 W/(mK)) beziehen.
- **`bp_verkehr_asphalt`:** Hohlraum- und Bitumenspannen der Asphaltsorten sind Lehrwerte; für Deckschichten gelten die Anforderungen je Mischgutsorte nach TL Asphalt-StB (vgl. Quiz-Text-Abgleich 02.11. zu `bp_verkehr_pruefung`).
- **`ki_ressourcen`, Beispiel 1:** Verglichen wird der Abstand 0,04 mit dem Intervall eines Modells; der Standardfehler der Differenz ist größer (1,96 · 0,042 = 0,083). Die Aussage „nicht belastbar“ gilt dann erst recht.

## Geänderte Dateien

`src/modules/BpStahlbauprofile.tsx` (NS5B-SP-1), `content/holzwerkstoffe/Holzwerkstoffe.json` (NS5B-HW-1), `content/nachhaltigkeit/PraxisInnovationen.json` (NS5B-LR-1), `content/denkmalpflege/Denkmalpflege.json` (NS5B-DP-1), `src/data/quiz.json` (NS5B-LD-1, eine Frage), `docs/pruefung/quiz-cluster-*.md` (neu erzeugt), `tests/nachstichprobe5b.test.ts` (neu), dieser Bericht.
