# Nachstichprobe 3 (30.10.2026) – 20 freigegebene Module nach der gezielten Durchsicht

**Stand:** 30.10.2026 (Branch `pruefung/nachstichprobe3-10-30`, Basis origin/main 0262308a mit den Durchsichten A–D)
**Status:** Bericht zur Kenntnis und Entscheidung – keine Prüfvermerke geändert, keine Quizfrage geändert.
**Auftrag:** Messen, ob die Fehlerquote nach der gezielten Durchsicht der 113 übrigen freigegebenen Module (`docs/pruefung/durchsicht-{A,B,C,D}-2026-10-29.md`) gegenüber 30 % (Nachstichprobe 29.10. und erweiterte Nachprüfung: 9 von 30 Modulen) gesunken ist.

## Vorgehen

- **Grundgesamtheit:** alle Fachmodule mit Status `geprueft` in `src/data/pruefvermerke.ts` (143) ohne die 30 Module der beiden Nachstichproben (`nachstichprobe-2026-10-29.md`, `nachpruefung2-2026-10-29.md`): **113 Module** – identisch mit dem Umfang der Durchsichten A–D.
- **Ziehung:** einfache Zufallsstichprobe ohne Schichtung, Python `random.Random(20261030).sample(Grundgesamtheit, 20)`, Grundgesamtheit alphabetisch sortiert. Skript `scratchpad/ns3/ziehung.py` (Sitzungsablage, nicht im Repository).
- **Prüfung je Modul vollständig:** (a) Bezugsgrößen und Einstufungen in Beispielen, (b) Norm-, Teil-, Tabellen- und Ausgabenzuordnungen (Stand 10/2026), (c) Kennwerte gegen die zentralen Konstanten (`gwpLehrwerte.ts`, `zementGwp.ts`, `kennwerte.ts`, `betonkennwerte.ts`, `holzphysik.ts`, `bestandKern.ts`), (d) jede Beispielrechnung per eigenem Skript (`scratchpad/ns3/nachrechnung.py`, 111 Nachrechnungen, davon 87 gegen einen im Modul genannten Wert), (e) Fließtext auf fachliche Fehler. Geprüft wurden die Inhalts-JSON (Texte, Beispiele, Kataloge, Fußzeilen) und der Modulcode (Rechenwege, fest verdrahtete Daten).
- **Zählregel wie in den beiden Nachstichproben:** ein Modul zählt als fehlerhaft, wenn es mindestens eine eindeutig falsche fachliche Aussage, Einstufung oder Zuordnung enthält. Strittige Punkte (Fragen) und redaktionelle Punkte zählen nicht.
- **Unabhängigkeit:** Die Befundlisten der Durchsicht wurden erst nach der eigenen Prüfung gelesen.
- **Quellen:** drei Websuchen (Brauner Kellerschwamm, biogener Kohlenstoff nach EN 15804+A2, DIN 18531-1:2025-08); sonst Nachrechnung und Kenntnisstand. Normtexte wurden nicht abgeschrieben.

## Gezogene Module

| Modul | Menügruppe | Durchsicht |
|---|---|---|
| `bauschaeden` | Mängel & Schäden | C (DSC-BS-1 behoben) |
| `bp_befestigung`, `bp_dach_fassade`, `bp_recht_normen`, `bp_verkehr_rsto`, `bp_verkehr_tunnel` | Bauprodukte | C, ohne Befund |
| `carbonbeton`, `schnellkarbonatisierung`, `weitere_organik` | Massivbau, Dauerhaftigkeit | A |
| `labor_frischbeton`, `labor_potentialmessung`, `messen_pruefen`, `statistik` | Labor & Auswertung | A, ohne Befund |
| `emodul`, `erdbau`, `holz`, `kunststoffe` | Mechanik, Baustoffe | D |
| `materialdatenbanken`, `rechnung_holzbau` | Digitales, Beispielrechnungen | B |
| `modernisierung` | Bauen im Bestand | C (Frage DSC-DM-2) |

## Ergebnis

| Modul | Fachfehler | Art | Gewicht | Status |
|---|---|---|---|---|
| `weitere_organik` | NS3-WO-1 „Trockenfäule“ dem Braunen Kellerschwamm zugeschrieben (Text zudem verstümmelt: „Braunk things“); NS3-WO-2 Bio-Lehransatz bildet die Differenz aus Holzfeuchte und kritischer **Luftfeuchte** | (e), (a) | **mittel** (WO-1), gering (WO-2) | behoben |
| `bauschaeden` | NS3-BS-1 Musterschreiben „F90 statt der geplanten F60 Brandwand“ – eine Brandwand ist nie F 60 | (a) | gering | behoben |
| `bp_befestigung` | NS3-BF-1 Stahlversagen „weil seine Zugstreckgrenze überschritten wurde (N_Rk,s = A_s · f_uk)“ – f_uk ist die Zugfestigkeit | (e) | gering | behoben |
| `materialdatenbanken` | NS3-MDB-1 biogener Kohlenstoff werde am Lebensende nur „im Falle thermischer Verwertung“ ausgebucht – nach EN 15804+A2 auch bei stofflicher Verwertung | (e) | gering | behoben |
| übrige 16 Module | – | – | – | ohne Fachfehler |

**Fehlerquote: 4 von 20 Modulen mit mindestens einem Fachfehler = 20 %** (95-%-Vertrauensbereich nach Wilson **8 % bis 42 %**).

**Vergleich mit 30 %:** Der Punktschätzer liegt um 10 Prozentpunkte unter der Quote vor der Durchsicht (9 von 30, Wilson 17 % bis 48 %). Der Unterschied ist bei diesem Stichprobenumfang **nicht signifikant** (exakter Test nach Fisher, zweiseitig p = 0,52; einseitig „gesunken“ p = 0,33; bei unveränderter wahrer Quote von 30 % träten 4 oder weniger Fehlermodule unter 20 mit 24 % Wahrscheinlichkeit auf). Die Schwelle von 10 % aus der ersten Nachstichprobe ist nicht erreicht, aber vom Vertrauensbereich auch nicht ausgeschlossen.

**Einordnung nach Fehlerart:**
- **Rechenkerne und Beispielrechnungen fehlerfrei:** alle 111 Nachrechnungen stimmen mit Modulwerten und Kernen überein (87 gegen genannte Werte, Rundungsrahmen; Regressionstest über 13 Kerne).
- **(a)–(c), also der Prüfumfang der Durchsicht:** 2 von 20 Modulen mit Fehler (`bauschaeden` BS-1, `weitere_organik` WO-2) = 10 % (Wilson 3 % bis 30 %); dazu ein modulinterner Kennwertwiderspruch als Frage (NS3-MDB-2). Normausgaben, Tafel- und Tabellenzuordnungen sowie zentrale Konstanten waren in allen 20 Modulen richtig.
- **(e) Fließtext:** 3 der 4 Fehlermodule fallen nur durch Fließtext auf (WO-1, BF-1, MDB-1). Die Durchsicht hatte Fließtext ausdrücklich nicht im Umfang („je Modul nur (a)–(c)“); die Durchsicht A führte `weitere_organik` als „ohne Befund“, C `bp_befestigung` ohne Befund.

**Gewichtiger Fehler:** keiner verändert ein Rechenergebnis oder eine Nachweisentscheidung. Am schwersten wiegt NS3-WO-1: Trockenfäule (Echter Hausschwamm) und Nassfäule (Brauner Kellerschwamm) zu verwechseln, führt in der Praxis zu falschen Sanierungsentscheidungen (DIN 68800-4 verlangt beim Echten Hausschwamm deutlich weitergehende Maßnahmen). Kein Anlass für eine Rücknahme von Prüfvermerken aus Sicht der Stichprobe; die vier Module sind nach den Korrekturen freigabefähig, offen bleiben die Fragen unten.

**Einschätzung:** Die Durchsicht hat die Fehlerarten (a)–(c) wirksam reduziert; die verbleibenden Fehler liegen überwiegend im Fließtext, der in keiner der Nachprüfungen vollständig gelesen wurde. Vorschlag: eine **Fließtext-Durchsicht** (nur (e), Prüffragen: Fachbegriffe richtig zugeordnet? Ursache–Wirkung? Rechtliche und normative Begriffe?) für die Module mit langen, nicht rechnenden Textanteilen (insbesondere Dauerhaftigkeit/Organik, Rückbau & Schadstoffe, Bauprodukte-Kataloge, Nachhaltigkeit). Eine erneute Stichprobe von 20 Modulen danach würde zeigen, ob die 10-%-Schwelle erreicht ist.

## Befunde je Modul

### 1. Bauschäden (`bauschaeden`)
**Nachrechnungen:** Verjährung BGB 15.03.2026, VOB/B 15.03.2025, neue Frist nach schriftlicher Mängelrüge 10.01.2027 (§ 13 Abs. 5 Nr. 1 VOB/B, nicht vor Ablauf der Regelfrist); Fuge ΔL = 6000 · 10·10⁻⁶ · 80 = 4,8 mm, b_erf = 4,8/0,25 = 19,2 → 20 mm – richtig.
**(b):** §§ 634a, 195/199, 204 Abs. 1 Nr. 7, 650t BGB; § 13 Abs. 4/5, § 6 Abs. 1 VOB/B (2016); § 404 Abs. 3 ZPO; § 1 Abs. 2 Nr. 5 ProdHaftG; BGH VII ZR 46/17 und V ZR 33/19; DIN 52460 (Wartungsfuge), DIN 18540, DIN EN 15651-1 – richtig.
**(e):** Mangel/Schaden, Beweislast nach Abnahme, Versicherungsarten, Dreiflankenhaftung, Kohäsions-/Adhäsionsbruch, Randzonenverschmutzung, ZGV 25 % (25LM) – richtig.
- **behoben – NS3-BS-1 (a):** Musterschreiben „Nachtragsanzeige“: „Brandschutzauflage F90 statt der geplanten F60 Brandwand“. Eine Brandwand ist bauordnungsrechtlich stets feuerbeständig (und mechanisch beansprucht); „F60-Brandwand“ ist eine falsche Einstufung. Neu: „Trennwand feuerbeständig (F 90 bzw. EI 90) statt der geplanten hochfeuerhemmenden Ausführung (F 60 bzw. EI 60)“; Gewerk „Zusätzliche Brandschutzbeplankung (GKF) der GK-Wände“ statt „mineralischer Brandschutzputz“ (passend zur Kostenzeile „Brandschutzverkleidung“). `content/bauschaeden/Bauschaeden.json` (beide Vorbelegungen).

### 2. Befestigungstechnik (`bp_befestigung`)
**Nachrechnungen:** N⁰_Rk,c = 7,7 · √25 · 80^1,5 = 27,5 kN, N_Rd,c = 18,4 kN (γ_Mc = 1,5); 1,5^1,5 = 1,84 („rund 84 % mehr“) – richtig.
**(b):** DIN EN 1992-4, 7.2.1.4 (k₁ = 7,7 gerissen), EAD 330232/330499, ETAG 001 als frühere Grundlage – richtig.
- **behoben – NS3-BF-1 (e):** „Der Zugbolzen reißt …, weil seine Zugstreckgrenze überschritten wurde (N_Rk,s = A_s · f_uk)“ – Stahlversagen tritt beim Erreichen der Zugfestigkeit ein, f_uk ist die charakteristische Zugfestigkeit. Text angepasst (`content/bpbefestigung/BpBefestigung.json`).
- **behoben – NS3-BF-2 (redaktionell):** Katalog „herstellerneutral“ nannte ein Markensystem beim Hinterschnittanker; Name gestrichen.
- Hinweis: „M4 – M16 Nylon-Spreizdübel“ – Kunststoffdübel werden nach Bohrlochdurchmesser bezeichnet, nicht als Gewinde „M“.

### 3. Dach, Fassade & Fenster (`bp_dach_fassade`)
**Nachrechnung:** U_w = (0,78 + 0,624 + 0,184)/1,82 = 0,87 W/(m²K); Rahmen und Glasrand 51 % der Verluste („rund die Hälfte“) – richtig.
**(b)/(e):** DIN EN 1304, 490, 988, 12467 (A2-s1,d0), 438, DIN EN ISO 10077-1, DIN 18516-1 (Lüftungsspalt ≥ 20 mm), VIP λ ≈ 0,007 – richtig. Ohne Befund.

### 4. Normenarbeit (`bp_recht_normen`)
**(b)/(e):** DIN 820 (Überprüfung spätestens nach fünf Jahren), DIN EN 45020, Wiener Vereinbarung, CEN mit 34 Mitgliedern, DIN 1917/Berlin, Gelbdruck/Weißdruck, Vermutungswirkung und Einführung über MVV TB (§ 85a MBO), BauPVO (EU) 2024/3110 anwendbar seit 08.01.2026 mit System 3+, Art. 19/26 VO (EU) 305/2011 – richtig. Ohne Befund.
Hinweis: „CEN erstellt hEN, z. B. DIN EN 197-1“ – CEN erstellt EN 197-1, DIN übernimmt sie als DIN EN 197-1.

### 5. Dimensionierung RStO (`bp_verkehr_rsto`)
**Nachrechnungen:** Dicken der gebundenen Schichten nach RStO 12/24, Tafel 1, Zeile 1: Bk100 4/8/22 = 34 cm, Bk32 30, Bk10 26, Bk3,2 22, Bk1,8 20, Bk1,0 4 + 14 = 18, Bk0,3 4 + 10 = 14 cm; Tafel 2, Zeile 1: Betondecke 27/26 cm auf 15 cm HGT – richtig (bereits „vorläufig, Normprüfung ausstehend“).
**(b)/(e):** Belastungsklassen-Grenzen (0,3/1,0/1,8/3,2/10/32 Mio.), Ev2 ≥ 45 MPa Planum, ≥ 120/100 MPa auf der FSS, Dimensionierungsformel B = N · DTA · q_Bm · f₁ · f₂ · f₃ · f_z · 365, Dübel Ø 25 mm – richtig. Ohne Befund.

### 6. Tunnelbau (`bp_verkehr_tunnel`)
**Nachrechnung:** Standardeingabe σ = 0,15 · 4,5/0,15 = 4,5 MPa, f_cd = 0,85 · 25/1,5 = 14,17 MPa, η = 31,8 % – wie Kern.
**(b)/(e):** J1/J2/J3 (DIN EN 14487-1), γ_c = 1,5/1,3 (Tab. 2.1DE), ZTV-ING Teil 5, Ril 853 – richtig. Ohne Befund.
Hinweis: NÖT-Text „wird die Tunneldecke … sekundenschnell abgedichtet und verbaut“ – Spritzbeton sichert, er dichtet nicht ab; Vorschlag „zeitnah gesichert“.

### 7. Carbonbeton (`carbonbeton`)
**Nachrechnungen:** f_td = 1923, f_cd = 28,3; Annahme Textilbruch x = 8,5 mm, ε_c = 3,79 ‰ > 3,5 ‰; Gleichgewicht bei Betonversagen x = 8,20 mm, σ_tex = 1860 N/mm², z = 26,7 mm, m_Rd = 4,97 kNm/m; ohne Dehnungskontrolle 5,12 – richtig, wie Kern.
**(b):** DAfStb-Richtlinie nichtmetallische Bewehrung (2024-01), DIN 1045-1000/-2/-3:2023-08 (ÜK 1/2), DIN EN 1992-1-1 + NA; B500B f_tk 540, ε_uk 50 ‰ aus `kennwerte.ts` – richtig. Ohne Befund.

### 8. E-Modul (`emodul`)
**Nachrechnungen:** E_cm C30/37 = 32,8 GPa, Kalkstein 29,5, Sandstein 23,0; Voigt 48,0, Reuss 37,5, HS 41,5/44,3 GPa – richtig, α_E aus `betonkennwerte.ts`.
**(b)/(e):** Tab. 3.1 und 3.1.3(2), DIN EN 12390-13:2021-09, HS-Formel (weichere Phase als Matrix) – richtig. Ohne Befund.

### 9. Erdbau (`erdbau`)
**Nachrechnungen:** ρ_d = 1,898 t/m³, D_Pr = 97,3 %, Feuchtdichtefehler 105 %; Frostschutz F3/BK3/Zone II/ungünstig 60 + 5 + 5 = 70 cm (RStO 12, Tab. 6/7) – richtig.
**(b)/(e):** DIN 18196:2023-02 (Grenzen 5/15/40 %), F1–F3 nach ZTV E-StB 17, Tab. 1 (TA in F2), Ev2/Ev1 ≤ 2,3/2,5 (bereits vorläufig), DIN 18127:2012-09, DIN 18134:2012-04 – richtig. Ohne Befund.

### 10. Holz (`holz`)
**Nachrechnungen:** f_m,d = 14,77, W = 666 667 mm³, M_Rd = 9,85 kNm, η = 0,71 – richtig.
**(b)/(c):** k_mod (Tab. 3.1), k_def 0,60, γ_M = 1,3 (NA DE, auch BSH), Hankinson Gl. 6.16/Abschn. 6.2.2, k_c,90 1,25/1,5/1,75 (6.1.5), Abbrand β_n bzw. β₀ (DIN EN 1995-1-2, Tab. 3.1), Schwindmaße aus `SCHWINDBEIWERTE`, DIN 68800-1 bis -4 – richtig. Ohne Befund.

### 11. Kunststoffe (`kunststoffe`)
**Nachrechnungen:** PVC-U ΔL = 32 mm, Stahl 4,8 mm, Faktor ≈ 7 – richtig.
**(b)/(e):** DIN EN ISO 527-1, 6721-1, 11357-1, 178; Glasübergang, Elastomere, Duroplaste, ETFE – richtig. Ohne Befund.

### 12. Frischbetonprüfungen (`labor_frischbeton`)
**Nachrechnungen:** Lehrbeispiel f = 460/450 mm (F3), D = 2350 kg/m³, A_c = 1,9/2,1 %, Gegenprobe 2,1 % – wie Kern.
**(b)/(e):** DIN EN 12350-1/-5/-6/-7, Klassen F1–F6 (DIN EN 206, Tab. 6), Ablauf Ausbreitversuch (2 Lagen à 10 Stöße, 30 s, 15 Hübe, 40 mm) – richtig. Ohne Befund.

### 13. Potentialmessung (`labor_potentialmessung`)
**Nachrechnungen:** Nullmessung −80 mV Ag/AgCl → −199 mV CSE; Sprung bei 4,0 g NaCl (−215 mV), Cl⁻/OH⁻ = 1,72 bei pH 12,6 – wie Kern.
**(b)/(e):** Bezugselektroden 197/210/241/316 mV, ASTM C876-22b, Hausmann 0,6, DGZfP B 3 – richtig. Ohne Befund.

### 14. Materialdatenbanken (`materialdatenbanken`)
**Nachrechnungen:** Außenwand 40,95 + 9,24 = 50,2 kg CO₂e/m²; Mineralwolle 5,76 kg CO₂e/m²; Beton 10 m³ · 245 = 2450 kg – richtig.
**(c):** Konsole Beton, BSH, Betonstahl aus `GWP_LEHRWERTE`; Muster-Zement 680 kg/t begründet über dem Branchenwert 665 (T14-MDB-5).
- **behoben – NS3-MDB-1 (e):** „müssen diese Speicher im Rückbau (Modul C3/C4) im Falle thermischer Verwertung bilanziell wieder freigelassen werden“. Nach DIN EN 15804+A2 wird der biogene Kohlenstoff ausgebucht, sobald das Material das Produktsystem verlässt – auch bei stofflicher Verwertung (Abgang in C1 bis C3 je nach Ende der Abfalleigenschaft; [ÖKOBAUDAT, Grundsätze Anhang B Entsorgungsverfahren, 2021-12-02, Tab. 5](https://www.oekobaudat.de/fileadmin/downloads/Einreichung/2021-12-02_Grundsaetze_OEBD_AnhangB_Entsorgungsverfahren.pdf)). Text neu gefasst (`content/materialdatenbanken/Materialdatenbanken.json`).
- **offen – Frage NS3-MDB-2 (c):** Kalksandstein im selben Modul mit zwei Lehrwerten: Beispiel 1 0,13 kg CO₂e/kg, QNG-Tabelle 110 kg/t (0,11), Quiz `q_dg_db_6` 0,12 (DSB-MDB-2). **Vorschlag:** zentraler Lehrwert `GWP_LEHRWERTE.kalksandstein` (ÖKOBAUDAT-Abgleich, vorläufig) und Beispiel, Tabelle und Quiz daraus – Änderung an `src/data/gwpLehrwerte.ts` ist diesem Auftrag nicht erlaubt (**Bedarf gemeldet**).
- Hinweis: EPS je m³ uneinheitlich: QNG-Tabelle 95, Beispiel 3,3 · 20 = 66, Modul Modernisierung 75 kg CO₂e/m³ (ohne Rohdichteangabe in der Tabelle).

### 15. Messen & Prüfen (`messen_pruefen`)
**Nachrechnungen:** x̄ = 38,80, s = 0,69, u_A = 0,31, u_B = 0,029/0,075, u_c = 0,32, U = 0,64 MPa; z = −2,22, E_n = −2,63; r = 2,8 · s_r (1,96 · √2) – wie Kern.
**(b)/(e):** ISO 5725-1:2023, DIN ISO 13528:2025-07, DIN EN ISO/IEC 17025 Abschn. 7.7.2, DIN EN ISO 7500-1 (Klasse 1 nach DIN EN 12390-4), MID-Klasse II ±(0,3 + 0,2·L) mm, DIN EN ISO 13385-1, Ebenheit 0,0006·d, 0,6 ± 0,2 MPa/s – richtig. Ohne Befund.

### 16. Modernisierung (`modernisierung`)
**Nachrechnungen:** ΔR = 3,45, d_erf = 0,110 m, U(14 cm) = 0,197; ΔQ_E = 17 970 kWh/a, 2156 €/a, Amortisation 7,6 a bzw. 1,3 a (Kopplung) – wie `savings`/`dRequired`; Dämmstärken der Tabelle (WLG 035) liegen über den rechnerischen Mindestdicken 9,6 bis 15,0 cm (konservativ, „ca.“).
**(b)/(c):** §§ 35–37, 69 GModG, Anlage 7 aus `GMODG_ANLAGE7`, Anlage 8 Rohrdämmung, Befreiung 01.02.2002/zwei Jahre, § 6 Abs. 1 Nr. 1a EStG (15 %, drei Jahre), § 82b EStDV, BEG 30/20/30/5 % (max. 21 000 €), iSFP-Bonus – stimmig mit dem Stand der Durchsicht C. Ohne Befund (Frage DSC-DM-2 bleibt).

### 17. Holzbau: Stützenknicken (`rechnung_holzbau`)
**Nachrechnung (Standardeingabe 3,0 m, 14 × 14 cm, 65 kN, C24):** f_c0d = 14,54, λ = 74,2, λ_rel = 1,259, k_c = 0,507, η = 45,0 % – wie Kern; k_mod 0,9 für KLED kurz (Schnee ≤ 1000 m) mit Hinweis auf 0,6/0,7, β_c = 0,2, C24 nach DIN EN 338:2016 – richtig. Ohne Befund.

### 18. Schnellkarbonatisierung (`schnellkarbonatisierung`)
**Nachrechnungen:** Σ√t·d = 94,76, K_AC = 0,903 mm/√d, Faktor 2,206, K_nat = 1,99 mm/√a, x(50 a) = 14,1 mm, t(25 mm) = 158 a, t(15 mm) = 57 a – wie Kern.
**(b)/(e):** DIN EN 12390-12:2020-04 (3 ± 0,5 % CO₂, 57 ± 3 % r. F., 28 d Wasser + 14 d Laborklima, 7/28/70 d), DIN EN 12390-10:2019-02, DIN EN 14630:2007-01, EN 1992-1-1:2023 (XRC) – richtig. Ohne Befund.

### 19. Statistik (`statistik`)
**Nachrechnungen:** X_k = 38,2 − 1,92 · 3,1 = 32,2 (n = 3: 27,8), X_d = 21,5; Grubbs G = 2,74 > 2,29 (5 %) und 2,48 (1 %) – kritische Werte aus der t-Verteilung nachgerechnet (2,290/2,482), wie `GRUBBS_TAB`; k_n-Tabelle D1 (V_X unbekannt) richtig.
- **offen – Frage NS3-ST-1 (a):** Beispiel 1 bestimmt den charakteristischen Wert „aus zehn Bohrkernen einer Bestandsdecke“ nach DIN EN 1990, Anhang D, und teilt durch γ_M = 1,5. Für die In-situ-Druckfestigkeit von Bestandsbeton gilt DIN EN 13791 (anderer Bezugskörper und Faktor 0,85, vgl. NS-BD-1). **Vorschlag:** Beispiel als allgemeine Prüfserie fassen („zehn Probekörper“) oder den Satz „Für Bestandsbeton gilt DIN EN 13791 – siehe Modul Bauwerksdiagnose“ ergänzen.

### 20. Organische Baustoffe (`weitere_organik`)
**Nachrechnungen:** Arrhenius e^1,083 = 2,95; Faktorenmethode 25 · 1,0⁵ · 0,8 · 1,2 = 24 a (Faktoren A–G nach ISO 15686-1 richtig benannt) – richtig.
**(b)/(e):** DIN EN 12607-1 (RTFOT), DIN EN 14769 (PAV, 2,1 MPa), 50/70 EP RuK 46–54 °C, Gaestel-Index, UV-B 290–320 nm, DIN 18531-1:2025-08 ([Bauprofessor, Neue Normen-Reihe DIN 18531, 01.08.2025](https://www.bauprofessor.de/news/neue-normen-reihe-din-18531/)) – richtig.
- **behoben – NS3-WO-1 (e, mittel):** „3. Trockenfäule – Erreger wie der Braunk things (Kellerschwamm) bauen Zellulose … ab“. Trockenfäule ist das Schadbild des Echten Hausschwamms; der Braune Kellerschwamm ist ein Nassfäulepilz mit deutlich höherem Feuchtebedarf ([t-online, Brauner Kellerschwamm](https://www.t-online.de/heim-garten/haushaltstipps/id_70396466/brauner-kellerschwamm-pilzbefall-erkennen.html)). Neu: Echter Hausschwamm als typischer Erreger (Braunfäule, Würfelbruch, durchwächst Mauerwerk); Kellerschwamm ebenfalls Braunfäule, aber Nassfäulepilz. Das Quiz (`holzkorrosion`, Fäuletypen) nennt beide richtig als Braunfäulepilze.
- **behoben – NS3-WO-2 (a):** Bio-Lehransatz „v_Bio = M_crit · [φ_Wood − φ_crit(T)] · f_pH“ mit „φ_Wood ≥ 20 % Holzfeuchte“ und φ_crit = LIM (relative Luftfeuchte) – Holzfeuchte (M.-%) minus Luftfeuchte (%) ist keine sinnvolle Differenz. Neu: Differenz der relativen Luftfeuchte an der Oberfläche zur LIM-Grenze, Substratfeuchte als Voraussetzung („Richtwert u ≥ 20 % Materialfeuchte“).
- **behoben – NS3-WO-3 (redaktionell):** „Soda- oder Ammoniumsalz-Imprägnierung (Borratsalze)“ → „Imprägnierung mit Soda, Borsalzen oder Ammoniumsalzen“.
- **offen – Frage NS3-WO-4:** PAV „simuliert die … 10- bis 15-jährige Feld-Alterung“. Üblich ist die Angabe 5 bis 10 Jahre (Langzeitalterung nach RTFOT). **Vorschlag:** „etwa 5 bis 10 Jahre Gebrauchsalterung (Literaturangabe)“.
- Hinweis (Code): Variable `十YearsDegradation` in `src/modules/WeitereOrganik.tsx` mit chinesischem Schriftzeichen – bei Gelegenheit umbenennen.

## Behobene Fehler (dieser PR)

| Kennung | Modul | Datei | Änderung |
|---|---|---|---|
| NS3-WO-1 | `weitere_organik` | `content/weitereorganik/WeitereOrganik.json` | Trockenfäule: Echter Hausschwamm; Kellerschwamm als Nassfäulepilz; verstümmelten Text ersetzt |
| NS3-WO-2 | `weitere_organik` | dto. | Bio-Lehransatz: Luftfeuchte gegen LIM statt Holzfeuchte gegen Luftfeuchte |
| NS3-WO-3 | `weitere_organik` | dto. | Imprägnierungen sauber benannt (redaktionell) |
| NS3-BS-1 | `bauschaeden` | `content/bauschaeden/Bauschaeden.json` | Musterschreiben: Trennwand F 90/EI 90 statt F 60/EI 60, keine „F60-Brandwand“; Gewerk Brandschutzbeplankung |
| NS3-BF-1 | `bp_befestigung` | `content/bpbefestigung/BpBefestigung.json` | Stahlversagen über die Zugfestigkeit f_uk |
| NS3-BF-2 | `bp_befestigung` | dto. | Markenname im herstellerneutralen Katalog gestrichen (redaktionell) |
| NS3-MDB-1 | `materialdatenbanken` | `content/materialdatenbanken/Materialdatenbanken.json` | biogener Kohlenstoff nach EN 15804+A2 auch bei stofflicher Verwertung ausgebucht |

Regressionstest: `tests/nachstichprobe3.test.ts` (Nachrechnungen über die Kerne `carbonbetonBiegung`, `ecmEc2`, `verbundSchranken`, `frostschutz`, `bodengruppe`, `bemessungswert`, `bemesseDruckstab`, `frischbeton`, `potentialReihe`, `gumMessunsicherheit`, `ringversuch`, `fraktilfaktorKn`, `grubbsKritisch`, `schnellkarbonatisierung`, `spritzbetonRing`, `savings`, `dRequired`, `uRetrofit` und Absicherung der Korrekturen). Keine Normtextstelle neu gekennzeichnet (kein Bedarf), keine F-Freigabe-Fundstelle neu, keine Quizfrage durch die Korrekturen falsch geworden.

## Offene Fragen mit Vorschlag

| Kennung | Modul | Frage | Vorschlag |
|---|---|---|---|
| NS3-MDB-2 | `materialdatenbanken` | Kalksandstein 0,13 (Beispiel) / 0,11 (QNG-Tabelle) / 0,12 kg CO₂e/kg (Quiz) | zentraler Lehrwert in `gwpLehrwerte.ts` (gesperrt für diesen Auftrag – Bedarf), alle drei Stellen daraus |
| NS3-ST-1 | `statistik` | Beispiel 1: Bohrkerne aus Bestand nach EN 1990 Anhang D und γ_M = 1,5 | als allgemeine Prüfserie fassen oder Verweis auf DIN EN 13791 |
| NS3-WO-4 | `weitere_organik` | PAV „10 bis 15 Jahre“ Feldalterung | „etwa 5 bis 10 Jahre“ (Literaturangabe) |

## Hinweise außerhalb der Stichprobe

- Quiz `q_lca_1` (`oekobilanz_lca`): Die Erklärung sagt, biogener Kohlenstoff werde „bei thermischer Verwertung“ in C3/C4 freigesetzt – die Antwort bleibt richtig, die Erklärung ist unvollständig (siehe NS3-MDB-1). Ähnlich `content/materialpaesse/Materialpaesse.json` („bei Verbrennung in C3 wieder ausgebucht“). Vorschlag: bei der nächsten Quiz- bzw. Modulpflege „sobald das Material das Produktsystem verlässt (Verbrennung oder stoffliche Verwertung)“.
- Gesperrte Dateien: kein Änderungsbedarf an `content/expositionsklassen/`, `src/data/pruefvermerke.ts`, `docs/pruefung/durchsicht-*.md`; Bedarf an `src/data/gwpLehrwerte.ts` nur für NS3-MDB-2.
