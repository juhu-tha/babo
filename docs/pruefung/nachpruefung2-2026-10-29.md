# Erweiterte Nachprüfung 29.10.2026 – 15 weitere freigegebene Fachmodule

**Stand:** 29.10.2026 (Branch `pruefung/nachpruefung2-10-29`, Basis `audit/konsistenz-umsetzung-10-29` mit #271 und #275)
**Status:** Bericht zur Kenntnis und Entscheidung – keine Prüfvermerke geändert, keine Quizfrage geändert.
**Auftrag:** Entscheidung vom 29.10.2026 auf die Nachstichprobe (`docs/pruefung/nachstichprobe-2026-10-29.md`, Fehlerquote 27 %): erweiterte Nachprüfung von 15 weiteren Modulen mit Status `geprueft`, gezielt auf die Fehlerarten der ersten Stichprobe:

- **(a)** Bezugsgrößen und Einstufungen in Beispielen (Würfel/Zylinder, Kern h/d, deklarierte/funktionelle Einheit, netto/brutto, je m² / m³ / t),
- **(b)** Normteil- und Tabellenzuordnungen (Teil, Tabelle, Ausgabe),
- **(c)** Kennwerte, die in mehreren Modulen vorkommen, gegen die zentralen Konstanten (`src/data/zementGwp.ts`, `src/data/gwpLehrwerte.ts`, `SCHWINDBEIWERTE`, `CONCRETE`, Energieausweis-Faktoren, `src/data/kennwerte.ts`, ergänzend `src/calc/lca.ts`, `src/calc/biokohlebeton.ts`).

## Auswahl

- **Grundgesamtheit:** alle Fachmodule mit Status `geprueft` in `src/data/pruefvermerke.ts` (143) ohne die 15 Module der ersten Nachstichprobe: **128 Module**.
- **Schichtung:** dieselben zwölf Schichten wie in der Nachstichprobe (Menügruppen). Je Schicht ein Modul; die drei übrigen an die Schichten mit den meisten verbleibenden Modulen: Bauprodukte (22), Baustoffe (17), Grundlagen (17).
- **Auswahlregel innerhalb der Schicht:** das Modul mit der höchsten Kennzahl „Beispiele + Tabellen“, bei Gleichstand alphabetisch. Kennzahl = Zahl der Stellen in Modulcode und Inhalts-JSON mit „Beispiel“, „Gegeben“, „Rechengang“, „Rechenweg“, „Lösung“ + Tabellenmarker (`<table`, `|---`, „Tabelle“, „Tab. “, `rows`) + Bezugsgrößen-Marker (je m², je m³, /t, kg CO₂, CO₂-Äq, deklarierte, funktionelle, N/mm², h/d, Würfel, Zylinder, netto, brutto). Dateien je Modul über `ModulInhalt.tsx` und die Importkette ermittelt; bei Modulen mit gemeinsamer Komponente (z. B. Spannbeton, LCA, Holzbau) nur die reiterspezifischen Dateien, bei Reitern ohne eigene Dateien die Kennzahl der Komponente geteilt durch die Zahl der Reiter.
- **Quiz:** je Modul 3 Fragen, Python `random.Random(20261030 + Modulindex)`, Fragen nach `id` sortiert.
- **Skripte** (Sitzungsablage, nicht im Repository): `scratchpad/np2/umfang.ts`, `verfeinern.py`, `auswahl.py`, `quizziehung.py`, `nachrechnung.py` (103 Nachrechnungen).

| Schicht (Rest) | Modul | Kennzahl | Erste Prüfung |
|---|---|---|---|
| Bauphysik (2) | `sommerlicher_waermeschutz` | 59 | Tranche 3 |
| Bauprodukte (22) | `bp_betonzusatzmittel`, `bp_farben_lacke` | 37, 33 | Tranche 8 |
| Baustoffe (17) | `membranen_etfe`, `stahl` | 35, 35 | Tranche 6, 5 |
| Bestand/Rückbau (16) | `historisch` | 73 | Tranche 12 |
| Beton (10) | `mischungsberechnung` | 84 | Tranche 1 |
| Dauerhaftigkeit (6) | `lebensdauerbemessung` | 47 | Tranche 2 |
| Grundlagen (17) | `baustoffkenngroessen`, `festbeton_statistik` | 115, 63 | Tranche 4 |
| Holz (3) | `holzbau_bauphysik` | 18 | Tranche 10 |
| KI/Digitales (9) | `online_tools` | 21 | Tranche 14 |
| Massivbau (12) | `spannbeton_kennwerte` | 97 | Zweitprüfung (Tranche 2) |
| Nachhaltigkeit (7) | `lca_rechner` | 67 | Tranche 11 |
| Rechnungen/Praxis (7) | `px_bautagebuch` | 18 | Tranche 15 |

## Ergebnis

| Modul | Fachfehler | Art | Gewicht | Status |
|---|---|---|---|---|
| `bp_farben_lacke` | NP2-FL-1 Untergrundvorbereitung OS „nach DIN 1045-3“, Haftzug 1,5/1,0 N/mm² für alle Systeme | (b) | gering | behoben |
| `stahl` | NP2-ST-1 Gewindestab SAS 670/800 als „Y1050“ bzw. Spannstahl bezeichnet | (c) | gering | behoben |
| `historisch` | NP2-HI-1 Formbeiwert d im Labor-Rechner als lineare h/w-Näherung, Ausgabe „DIN EN 772-1“; Beispiel 3 (d = 0,82) und Rechner (d = 0,75 für dieselbe Probe 65/120 mm) widersprechen sich | (b) | gering (Rechner konservativ) | gekennzeichnet, Frage |
| `mischungsberechnung` | NP2-MB-1 CO₂-Senke Pflanzenkohle −2,5 kg/kg (ohne Quelle) statt Netto-Senke des Moduls Biokohlebeton 2,05 kg/kg | (c) | gering | behoben |
| `spannbeton_kennwerte` | NP2-SB-1 β(t₀ = 3 d) „~0,85“ und „verdoppelt φ“ statt 0,74 / +50 % (Gl. B.5); NP2-SB-2 ε_ca C60/75 „−0,10 ‰“ statt −0,125 ‰ (Gl. 3.12); NP2-SB-3 ε_cd,0 = 0,48 ‰ C35/45 statt C30/37 zugeordnet | (c) | gering | behoben |
| übrige 10 Module | – | – | – | ohne Fachfehler |

**Fehlerquote: 5 von 15 Modulen mit mindestens einem Fachfehler = 33 %** (95-%-Vertrauensbereich nach Wilson etwa 15 % bis 58 %). Zusammen mit der ersten Nachstichprobe: 9 von 30 = 30 % (etwa 17 % bis 48 %). Bestätigt sich Frage NP2-OT-1, steigt die Quote auf 6 von 15 = 40 %.

**Gewicht:** Kein Fehler verändert eine Einstufung oder ein Nachweisergebnis in einem Beispiel; die Rechenkerne rechnen richtig (alle 103 Nachrechnungen stimmen mit den Modulwerten im Rundungsrahmen überein, alle 45 gezogenen Quizfragen sind richtig). Die Fehler stecken wie in der ersten Stichprobe in Fließtext, Katalog- und Kartenwerten: zwei Normzuordnungen (b) und drei modulübergreifende bzw. modulinterne Kennwertwidersprüche (c). Fehlerart (a) trat in dieser Stichprobe nicht auf.

**Empfehlung:** Die Quote liegt **über 10 %** – laufende Pflege genügt nicht. Vorschlag für eine **vollständige gezielte Durchsicht** (siehe unten).

## Befunde je Modul

### 1. Sommerlicher Wärmeschutz (`sommerlicher_waermeschutz`)

**Nachrechnungen:** Beispiel 1 S_vorh = 11 · 0,59 · 0,30/25 = 0,078, S_zul = 0,103 + (0,060 − 0,231 · 0,44) = 0,061 (nicht erfüllt); Verbesserung Raffstore/schwer 0,065 ≤ 0,071; Hinweis „hohe Nachtlüftung 0,152 hätte genügt“ 0,110 ≥ 0,078; Beispiel 2 S_vorh 0,059, f_WG 0,193 > 0,07, S_zul 0,084, ohne Nachtlüftung 0,052 – richtig, mit dem Kern `sonneneintrag` identisch (Test).
**Prüfpunkte (a)–(c):** Spaltenzuordnung F_C (zweifach g > 0,40 → dritte Spalte, dreifach → zweite) im Beispiel richtig angewandt; S1-Werte Tab. 8 (B, mittel/schwer/leicht, erhöht/hoch) und Tab. 6 (7 %/10 %/15 %), 35-%-Regel (F_C ≤ 0,30 bzw. 0,35) und Abschnittsnummern der Ausgabe 2013-02 (8.2.2, 8.3.2, 8.3.3, 8.4, Tab. 9) richtig; Neuausgabe 2026-05 als nicht eingearbeitet gekennzeichnet.
**Quiz:** `qn_sommerlicher_waermeschutz_4`, `_5`, `_3` richtig.
**Empfehlung:** ohne Befund.

### 2. Betonzusatzmittel (`bp_betonzusatzmittel`)

**Nachrechnungen:** Wasseranrechnung m_FM = 5,1 kg, V = 4,86 l > 3 l, w_FM = 3,57 kg, (w/z)_eff = 0,481 (ohne 0,471) – richtig.
**Prüfpunkte:** Tabellen der DIN EN 934-2 je Wirkungsgruppe (BV Tab. 2, FM Tab. 3.1/3.2, ST 4, LP 5, Erstarrungsbeschleuniger 6, Erhärtungsbeschleuniger 7, VZ 8, DM 9), Einpresshilfen DIN EN 934-4, Spritzbeton DIN EN 934-5; 3-l-Regel, 2 g/kg und 50 g/kg nach DIN EN 206 – richtig.
**Quiz:** `q_bzm_3`, `q_bzm_2`, `qn_bp_betonzusatzmittel_1` richtig.
**Hinweis:** „je Vol.-% Luftporen ca. 5 % Festigkeitsverlust“ (hier und Quiz „4–5 %“) und „ca. 4 MPa“ in `mischungsberechnung` – bei üblichen Festigkeiten verträglich, aber in unterschiedlicher Bezugsgröße; bei der Durchsicht einheitlich fassen.
**Empfehlung:** ohne Befund.

### 3. Farben & Lacke (`bp_farben_lacke`)

**Nachrechnungen:** d_wet = 80/0,40 = 200 µm, 0,20 l/m², mit 20 % Verlust 0,25 l/m² – richtig.
**Prüfpunkte:** Decopaint-Grenzwerte Anhang II A Phase II (30/30, 100/100, 40/430, 130/300, 140/500) richtig; OS-Zuordnung (OS 2 = OS B, OS 5a/5b = OS DII/DI) und s_d,CO₂ ≥ 50 m stimmig mit `bauwerksdiagnose`.
**Quiz:** `qn_bp_farben_lacke_3`, `q_bfl_2`, `q_bfl_1` richtig.
**Befunde**
- **behoben – NP2-FL-1 (b):** Der Materialrechner überschrieb die Ausführungskriterien mit „Betonvorbereitung (DIN 1045-3)“. DIN 1045-3 regelt die Bauausführung; Untergrundvorbereitung und Oberflächenzugfestigkeit für Oberflächenschutzsysteme regeln TR Instandhaltung (vormals Rili-SIB) und DIN EN 1504-10. Zudem galt der Wert 1,5/1,0 N/mm² für alle Systeme, ist aber der Wert befahrbarer Systeme. Neu: Überschrift „Untergrundvorbereitung (TR Instandhaltung, DIN EN 1504-10)“, Haftzug 1,5/1,0 N/mm² für OS 8/OS 11, für nicht befahrbare Systeme geringere Werte (vorläufig, Normprüfung ausstehend) – `content/bpfarbenlacke/BpFarbenLacke.json`.
- **behoben – NP2-FL-2 (Kennwertwiderspruch im Modul, redaktionell):** Die Systemkarten OS 8, OS 11a und OS 11b nannten andere Verbräuche als der Materialrechner (z. B. OS 8 Basisschicht 1,6 statt 1,65 kg/m², ohne Kratzspachtel; Quarzsand 4,0/4,5 statt 4,5/5,0 kg/m²). Karten an die Rechnerwerte angeglichen (`content/bpfarbenlacke/daten.json`).
- Hinweis: GISCODE-Zuordnungen (BSW10/20/40/60, BSL20/25, RE30) am aktuellen GISBAU-Verzeichnis abgleichen.

### 4. Membranen & ETFE (`membranen_etfe`)

**Nachrechnungen:** Traglufthalle n = 5,4 kN/m, n_zul = 80/5 = 16 kN/m, η = 0,34, Sturm 0,62; Kissen r = 4,55 m, σ = 5,46 N/mm², Schnee η = 0,95 – richtig.
**Prüfpunkte:** Bezugsgröße N/5 cm → kN/m (4000 N/5 cm = 80 kN/m) richtig erklärt und gerechnet; Kesselformel Zylinder/Kugel; Regelwerke (DIN CEN/TS 19102:2024-08, DIN 4134-1:2026-03, DIN EN 13782:2015-06, DIN EN 13501-1:2019-05) stimmig mit der ersten Prüfung.
**Quiz:** `qn_membranen_etfe_6`, `_5`, `_3` richtig.
**Hinweis:** Kennwerttabelle „4400/4.000 N/5 cm“, „5000/4.500“ – Punkt als Tausendertrennung bei vierstelligen Zahlen uneinheitlich.
**Empfehlung:** ohne Befund.

### 5. Stahl (`stahl`)

**Nachrechnungen:** IPE 300 S355 M_pl,Rd = 223 kNm, η = 0,54; IPE 300 S235 147,7 kNm vs. IPE 200 S690 152,2 kNm (Aussage „IPE 300 wie IPE 200 in S690“ trägt); Quiz CEV = 0,40 %, HEB 200 151 kNm – richtig.
**Prüfpunkte:** Bruchdehnungen und CEV-Grenzen DIN EN 10025-2 (S235JR 0,35, S355J2 0,45), Duktilitätsklassen A/B/C (k ≥ 1,05/1,08, 1,15–1,35; ε_uk 2,5/5,0/7,5 %), Spannstahlgrenzen, k_y,θ nach DIN EN 1993-1-2 Tab. 3.1 – richtig.
**Quiz:** `q_sta_2`, `qn_stahl_fec_4`, `qn_stahl_1` richtig.
**Befunde**
- **behoben – NP2-ST-1 (c):** Werkstoffregister und Spannungs-Dehnungs-Linien führten den Gewindestab mit f_y = 670 und f_u = 800 N/mm² als „SAS 670 / Y1050 (Spannstab)“ bzw. „Gewindespannstahl (Y1050)“ und im Vergleich „Spannstahl (Y1860 S7 / SAS 670)“. Y1050 bezeichnet einen Spannstahl mit f_pk = 1050 N/mm² (Güte 950/1050); die hinterlegten Werte gehören zur Güte 670/800. Bezeichnungen auf „SAS 670/800 (Gewindestab)“ bzw. „Gewindestab (f_y = 670, f_u = 800 N/mm²)“ korrigiert (`content/stahl/daten.json`, `SpannungsDehnung.json`). Herstellernamen in `spannbeton_kennwerte` neutral gefasst.
- **offen – Frage NP2-ST-2 (c):** Der CO₂-Vergleich im Dimensionierungsbeispiel rechnet mit 1,8 kg CO₂/kg Baustahl, der LCA-Rechner mit dem Lehrwert 1,1 kg CO₂-Äq./kg für Profilstahl (`interactivelcacalc/daten.ts`); eine zentrale Konstante gibt es nicht. **Vorschlag:** Profilstahl als Eintrag in `src/data/gwpLehrwerte.ts` aufnehmen (1,1, vorläufig, ÖKOBAUDAT-Abgleich offen) und im Modul Stahl daraus rechnen; den Einsparfaktor 0,45 aus den Profilgewichten bilden (IPE 300 → IPE 200: 47 %).

### 6. Historische Kennwerte (`historisch`)

**Nachrechnungen:** f_d = 25 · e^(−0,456 − 0,011) = 15,7 N/mm²; Zugprobe R_eH 223, R_m 360 N/mm², Verhältnis 1,61; Bn 250 → f_ck 19,3, f_cd 0,85 · 19,3/1,35 = 12,15 N/mm²; Ziegelwand f_k = 4,19, f_d = 2,37 N/mm² – richtig.
**Prüfpunkte:** Bezug Bn 250 auf 200-mm-Würfel (5-%-Quantil, f_ck ≈ 0,77 · β_WN, Tab. 2.2 Schnell/Fischer/Loch) richtig; Kern-Umrechnung h/d (Bezug wie NS-BD-3, dort bereits Frage).
**Quiz:** `q_hk_3`, `q_hk_2`, `q_hk_1` richtig.
**Befunde**
- **gekennzeichnet, offen – Frage NP2-HI-1 (b):** Der Labor-Rechner bildet den Formbeiwert d als lineare Funktion von h/w (0,65 bei h/w = 0,3 bis 1,25 bei 1,5) und weist ihn als Ergebnis nach DIN EN 772-1 aus. DIN EN 772-1, Tab. A.1, gibt d getrennt nach Höhe und Breite der Probe an; für das Reichsformat 65/120 mm ergibt die Interpolation etwa 0,81 (so auch der Hinweis der ersten Prüfung zu Beispiel 3 mit 0,82), der Rechner liefert für dieselbe Probe 0,75, für die Vorgabe NF 71/115 mm 0,78 statt etwa 0,85. Der Rechner liegt auf der sicheren Seite. Bis zur Klärung ist die Anzeige als Näherung „vorläufig, Normprüfung ausstehend“ gekennzeichnet (`content/historischematerialkennwerte/RechnerLaborTab.json`). **Vorschlag:** am Normtext Tab. A.1 übernehmen und d im Kern bilinear über Höhe und Breite interpolieren (Test mit 65/120 → 0,81).

### 7. Mischungsberechnung (`mischungsberechnung`)

**Nachrechnungen:** Quiz (w/z)_eq = 165/(270 + 0,4 · 89,1) = 0,54; Gesteinskörnung 1903 kg/m³; XA2 w/z 0,50 – richtig.
**Prüfpunkte:** Grenzwerte je Expositionsklasse (w/z, Mindestfestigkeit, Mindestzement, c_min,dur) gegen DIN 1045-2/DIN EN 1992-1-1/NA richtig; Zement-GWP aus `ZEMENT_GWP_KG` (zentral); Mehlkorn-Grenzwerte als Ausgabe 2008 gekennzeichnet.
**Quiz:** `q_mib_2`, `qn_mischungsberechnung_2`, `q_mib_1` richtig.
**Befunde**
- **behoben – NP2-MB-1 (c):** Die CO₂-Bilanz rechnete Pflanzenkohle mit −2,5 kg CO₂ je kg (Kommentar „ca.“, ohne Quelle), das Modul Biokohlebeton mit der Netto-Senke 0,80 · 44/12 · 0,80 − 0,3 = 2,05 kg CO₂e/kg (Kohlenstoff, Permanenz nach IPCC, Herstellung). Die Lehrwerte stehen jetzt als `PK_LEHRWERT` und `PK_NETTO_SENKE_KG` in `src/calc/biokohlebeton.ts`; Mischungsberechnung und Biokohlebeton (Vorgaben) lesen daraus, der Info-Text nennt die Herleitung. Test: `tests/nachpruefung2_20261029.test.ts`.

### 8. Lebensdauerbemessung (`lebensdauerbemessung`)

**Nachrechnungen:** R⁻¹_ACC,0 = 14,17 · 10⁻¹¹ = 4469 (mm²/a)/(kg/m³); k = 3,11 mm/√a; x_c(50) = 22,0 mm; t = 127 a; s = 5,46; Beispiel 2 k_e 0,566, A(50) 0,0542, D_app 1,84 mm²/a, C(55; 50) = 0,102 M.-%; Standardfehler 0,2 Prozentpunkte; ToW-Spanne 0,07–0,38 – richtig.
**Prüfpunkte:** Einheitenumrechnung m²/s → mm²/a, Δc_dev = 1,645 · s, c_min,dur-Auszug Tab. 4.4DE, D_RCM,0-Tabelle (w/z-Spalten) und Zuordnung CEM III/B w/z 0,45 = 1,9 richtig; vorläufige Werte durchgehend gekennzeichnet.
**Quiz:** `qn_lebensdauer_4`, `_1`, `_3` richtig.
**Empfehlung:** ohne Befund.

### 9. Baustoffkenngrößen (`baustoffkenngroessen`)

**Nachrechnungen:** U = 0,27 W/(m²K); Q = 10 500 kJ = 2,92 kWh; Δl = 7,2 mm; a = 8,33 · 10⁻⁷ m²/s; b Fichte 322,5; P = 32 %; s_d = 26 m; w = 0,70; ε_ges = 1,50 ‰ – richtig.
**Prüfpunkte:** μ Beton 80/130 (DIN EN ISO 10456), Einstufungen DIN 4108-3 (s_d, w, w · s_d), Darrtemperaturen DIN EN ISO 12570, E-Moduln der Presets gegen `CONCRETE` (C30/37 33 000) und EN 338 (C24 11 000) richtig.
**Quiz:** `q_kg_4`, `q_kg_3`, `qn_baustoffkenngroessen_1` richtig.
**Empfehlung:** ohne Befund.

### 10. Festbeton-Statistik (`festbeton_statistik`)

**Nachrechnungen:** Erstherstellung f_cm = 41,2 ≥ 41,0, f_ci 39,5 ≥ 33; stetige Herstellung 42,9 ≤ 44,5; f_cd = 17,0 N/mm²; Quiz 43,7 > 42,0 – richtig.
**Prüfpunkte:** Bezug Würfel (Konformität) vs. Zylinder (Bemessung) im Beispiel ausdrücklich richtig getrennt; DIN EN 206, 8.2.1 und Tab. 14 richtig zugeordnet.
**Quiz:** `qn_festbeton_statistik_3`, `q_fbs_2`, `qn_festbeton_statistik_1` richtig.
**Empfehlung:** ohne Befund.

### 11. Holzbau – Bauphysik (`holzbau_bauphysik`)

**Nachrechnungen:** Quiz f₁ = π/(2 · 25) · √(3,75 · 10⁶/222) = 8,17 Hz – richtig.
**Prüfpunkte:** Abbrandraten DIN EN 1995-1-2 Tab. 3.1 (0,65/0,80/0,70; Laubholz 0,50/0,55), d₀ = 7 mm, k₀; DIN EN 1995-1-1, 7.3.3 (f₁ > 8 Hz, Gl. 7.5); Orientierungswerte Hamm/Richter – richtig.
**Quiz:** `qn_holzbau_bauphysik_5`, `_1`, `_4` richtig.
**Hinweis:** Rechner Eigenmasse aus Wichte 5,5 kN/m³ (Lastannahme) und E_0,mean 11 550 N/mm², Quiz mit 450 kg/m³ und 11 000 N/mm² – für die Eigenfrequenz ist die mittlere Masse maßgebend; bei der Durchsicht einheitlich fassen.
**Empfehlung:** ohne Befund.

### 12. Online-Tools (`online_tools`)

**Nachrechnungen:** M_Ed = 15,6 kNm; I = 1,382 · 10⁸ mm⁴; w = 16,1 mm; q_Ed = 11,0 kN/m²; Quiz 10,70 kN/m²; U-Wert-Skript mit R = 0,18 für 40 mm ruhende Luftschicht (DIN EN ISO 6946, Tab. 8) – richtig.
**Quiz:** `qn_online_tools_3`, `q_dg_ot_2`, `qn_online_tools_2` richtig.
**Befunde**
- **offen – Frage NP2-OT-1 (b):** Beispiel 1 vergleicht die elastische Durchbiegung eines C24-Balkens mit „L/250“ und nennt „DIN EN 1995-1-1:2010-12 mit NA“. L/250 ist ein Grenzwert des Eurocode 2 (quasi-ständig) bzw. die untere Empfehlung der Tab. 7.2 der DIN EN 1995-1-1 für w_net,fin; nach meinem Kenntnisstand nennt der NA DE (Tab. NA.13) für Einfeldträger w_inst ≤ l/300, w_net,fin ≤ l/300 und w_fin ≤ l/200 (öffentlich bestätigt nur w_fin l/200 für Decken, [Holzbau Deutschland, Information Qualitätsklassen/Verformungen 02/2018](https://www.holzbau-deutschland.de/fileadmin/user_upload/eingebundene_Downloads/2018-02-Information_Qualit%C3%A4tsklassen_Verformungen.pdf)). Mit l/300 = 16,7 mm bliebe das Beispiel knapp erfüllt, mit Kriechen (k_def) nicht. **Vorschlag:** am NA prüfen; dann Vergleich mit l/300 und dem Hinweis „w_net,fin einschließlich Kriechen“, Erklärung der Frage `qn_online_tools_2` entsprechend anpassen.

### 13. Spannbeton – Kennwerte (`spannbeton_kennwerte`)

**Nachrechnungen:** σ_p,max = 1440, σ_pm0 = 1360 N/mm² (Y1860); Relaxationsfaktor 500 000 h/1000 h 4,05/3,21/2,54 (μ = 0,70/0,75/0,80); Quiz Δσ_pr = 51 N/mm²; M_g = 900 kNm, 4,76 N/mm²; Schwindverlust 4,9 %; Arrhenius 60 °C 5,1-fach; β(f_cm), β(t₀), ε_cd,0 (C30/37: N 0,48, R 0,67, S 0,39 ‰), ε_ca – Haupttexte richtig.
**Quiz:** `qt_spannbeton_kennwerte_1`, `qn_spannbeton_2`, `qn_spannbeton_6` richtig.
**Befunde** (alle im Beiwerte-Katalog `content/spannbeton/BeiwerteKatalog.json`, Widerspruch zu den Kapiteltexten desselben Moduls)
- **behoben – NP2-SB-1 (c):** β(t₀) „t₀ = 3 d: ~0,85“, „liegt um 0,65 bis 0,85“ und „frühes Belasten verdoppelt φ“ – nach Gl. (B.5) 0,74 (3 d), 0,63 (7 d), 0,49 (28 d), also rund +50 % (so auch der Kriechtext). Festigkeitsbeiwert β(f_cm) auf 2,9/2,6/2,2 (C25/30, C35/45, C50/60) und C45/55 „ca. 2,3“ gerundet.
- **behoben – NP2-SB-2 (c):** autogenes Schwinden „C60/75: −0,10 ‰“, Spanne bis −0,10 ‰ – nach Gl. (3.12) −0,125 ‰ (so im Schwindtext); Spanne −0,03 bis −0,20 ‰ (C90/105).
- **behoben – NP2-SB-3 (c):** „CEM I 42,5 N bei C35/45: ε_cd,0 ≈ 0,48 ‰; 52,5 R ca. 0,58 ‰“ – 0,48 ‰ gilt für C30/37 bei RH 50 % (so im Schwindtext), C35/45 ergibt 0,45 (N) bzw. 0,63 ‰ (R).
- Hinweis (behoben, redaktionell): Herstellernamen bei Gewindestäben neutral gefasst.

### 14. LCA-Rechner (`lca_rechner`)

**Nachrechnungen:** Quiz QNG-Kennwert 24,2 kg CO₂-Äq./(m²·a), Holzhybrid 21,5; A2 Transportbeton 4,9 kg CO₂-Äq./m³; B4-Zählung n = ⌈50/ND⌉ − 1 – richtig.
**Prüfpunkte:** Bezugsgrößen sauber getrennt (deklarierte Einheit der EPD je m³/t → funktionales Äquivalent je m² NRF(R) und Jahr nach DIN EN 15978), Modul D und A4 getrennt ausgewiesen; Betonstahl 0,64 und Beton aus `GWP_LEHRWERTE`, A4 aus `A4_FAKTOR_GEBAEUDE` (zentral).
**Quiz:** `qn_lca_rechner_4`, `_5`, `qn_lca_rechner_x_1` richtig.
**Befunde**
- **offen – Frage NP2-LC-1 (c, zentrale Konstanten):** `GWP_LEHRWERTE.betonCemIIIA` = 135 kg/m³ ergibt gegenüber CEM-I-Beton (245) eine Minderung von 45 % („rund 45 %“ im Rechner); aus `ZEMENT_GWP_KG` (CEM III/A 0,40 statt 0,665) folgen bei 300 kg Zement nur rund 32 %, das Lehrbeispiel in `oekobilanz_lca` nennt 35 % (NS-LC-1). **Vorschlag:** den CEM-III/A-Lehrbeton wie `betonC3037CemI` aus Zementgehalt · `ZEMENT_GWP_KG` + Rest bilden (≈ 165 kg/m³) und den Text „rund 45 %“ aus dem Wert rechnen.
- **offen – Frage NP2-LC-2 (c):** Die Transportbeton-Übung (Quiz `qn_lca_rechner_x_1`, `src/modules/lca/transportbetonKennwerte.ts`) rechnet „Lkw 40 t Euro 6“ mit 0,068 kg CO₂-Äq./(t·km); `A4_FAKTOR_EINZEL['lkw-heavy']` (UBA 2024, Last- und Sattelzüge, „Diesel-Lkw 40 t“) mit 0,101. **Vorschlag:** Übung auf den zentralen Wert umstellen oder den Unterschied (Fahrzeugklasse, Auslastung, Quelle) im Modul ausweisen; Quizzahlen dann nachziehen.

### 15. Bautagebuch (`px_bautagebuch`)

**Nachrechnungen:** f_T = 30/(5 + 10) = 2,0 → 6 d (Reife nach Saul, gleiche Summe (T + 10)·t); r = 18/40 = 0,45 → mittel – richtig.
**Prüfpunkte:** Klassengrenzen der Festigkeitsentwicklung r = f_cm,2/f_cm,28 (≥ 0,50/0,30/0,15) richtig; § 4 Abs. 3, § 6 Abs. 1/2, § 13 Abs. 3 VOB/B; CM-Grenzwert Calciumsulfatestrich 0,5 %; DIN 18365/18356 – richtig.
**Quiz:** `qn_px_bautagebuch_4`, `q_px_bt_2`, `q_px_bt_1` richtig.
**Hinweis:** Die Lernprojekte nennen reale Orte und Stellen (Campus der Hochschule, Staatliches Bauamt, „Parkhaus GmbH Augsburg“, Straßenname) – falls der Grundsatz „keine Firmen-/Projektangaben“ auch hier gilt, neutral fassen.
**Empfehlung:** ohne Befund.

## Behobene Fehler (dieser PR)

| Kennung | Modul | Datei | Änderung |
|---|---|---|---|
| NP2-FL-1 | `bp_farben_lacke` | `content/bpfarbenlacke/BpFarbenLacke.json` | Untergrundvorbereitung nach TR Instandhaltung/DIN EN 1504-10; Haftzug 1,5/1,0 N/mm² nur für befahrbare Systeme (Rest vorläufig) |
| NP2-FL-2 | `bp_farben_lacke` | `content/bpfarbenlacke/daten.json` | Verbrauch der Systemkarten OS 8/11a/11b wie Materialrechner |
| NP2-ST-1 | `stahl` | `content/stahl/daten.json`, `SpannungsDehnung.json` | Gewindestab 670/800 nicht als Y1050/Spannstahl |
| NP2-HI-1 | `historisch` | `content/historischematerialkennwerte/RechnerLaborTab.json` | Formbeiwert d als Näherung gekennzeichnet (vorläufig, Normprüfung ausstehend) |
| NP2-MB-1 | `mischungsberechnung`, `biokohlebeton` | `src/calc/biokohlebeton.ts`, `src/modules/Mischungsberechnung.tsx`, `src/modules/Biokohlebeton.tsx`, `content/mischungsberechnung/MischungEingaben.json` | gemeinsame Pflanzenkohle-Lehrwerte, Netto-Senke 2,05 statt 2,5 kg CO₂e/kg |
| NP2-SB-1 bis -3 | `spannbeton_kennwerte` | `content/spannbeton/BeiwerteKatalog.json`, `kennwerte/KennwerteRelaxation.json` | β(t₀), β(f_cm), ε_ca, ε_cd,0 wie EC2 und Kapiteltexte; Herstellernamen neutral |

Regressionstest: `tests/nachpruefung2_20261029.test.ts` (Nachrechnungen über die Kerne `sonneneintrag`, `creep`, `shrinkage`, `fkMasonry`, `erfc`, `biokohleBilanz` und Absicherung der Korrekturen).

## Offene Fragen mit Vorschlag

| Kennung | Modul | Frage | Vorschlag |
|---|---|---|---|
| NP2-HI-1 | `historisch` | Formbeiwert d nach DIN EN 772-1, Tab. A.1, statt h/w-Näherung | Tab. A.1 am Normtext übernehmen, bilinear über Höhe und Breite interpolieren |
| NP2-OT-1 | `online_tools` | Durchbiegungsgrenze Holz L/250 statt l/300 (NA DE) | am NA prüfen; Vergleich l/300 (w_net,fin mit Kriechen), Quiz-Erklärung nachziehen |
| NP2-ST-2 | `stahl`, `lca_rechner` | Profilstahl-GWP 1,8 vs. 1,1 kg CO₂/kg | Profilstahl zentral in `gwpLehrwerte.ts`, Stahl-Modul daraus rechnen |
| NP2-LC-1 | `lca_rechner` (zentral) | CEM-III/A-Lehrbeton 135 kg/m³ (−45 %) passt nicht zu `ZEMENT_GWP_KG` (≈ −32 %) | Lehrbeton aus Zementgehalt · `ZEMENT_GWP_KG` + Rest bilden |
| NP2-LC-2 | `lca_ingenieurbau`/`lca_rechner` | Lkw 40 t 0,068 vs. zentral 0,101 kg CO₂-Äq./(t·km) | Übung auf `A4_FAKTOR_EINZEL` umstellen oder Unterschied ausweisen |

## Empfehlung: vollständige gezielte Durchsicht

Die Quote von 33 % (beide Stichproben zusammen 30 %) liegt deutlich über der Schwelle von 10 %. Die Fehler sind durchweg gering und liegen außerhalb der Rechenkerne; sie entstehen dort, wo derselbe Kennwert ein zweites Mal von Hand im Text, in einer Katalogkarte oder in einem anderen Modul steht, und bei Normverweisen in Überschriften und Kartenköpfen. Vorschlag:

1. **Umfang:** die übrigen 113 freigegebenen Module (143 − 30), in vier Tranchen nach Menügruppen; je Modul nur (a)–(c), keine Wiederholung der Rechenkern- und Quizprüfung.
2. **Maschinelle Vorarbeit (ein Skript, vor den Tranchen):** (i) alle Zahlen mit Einheit kg CO₂, kg CO₂-Äq., g/tkm, N/mm², ‰ und kWh in `content/**/*.json` und `src/modules/**` sammeln und gegen die zentralen Konstanten abgleichen (Treffer mit abweichendem Wert als Prüfliste); (ii) im Code fest verdrahtete Faktoren (`* 1.8`, `* -2.5` usw.) neben Rechenkernen auflisten; (iii) alle Verweise „DIN …, Tab./Abschnitt …“ mit Teil und Ausgabe extrahieren und gegen `src/data/centralNormenRegistry.ts` prüfen.
3. **Prüfbogen je Modul (Ergänzung zum Tranchenformat):** jede Zahl in Beispielen, Katalogen und Systemkarten einmal gegen ihre Quelle im Modul (Kapiteltext oder Kern) bzw. die zentrale Konstante; jeder Normverweis in Überschriften mit Teil, Tabelle und Ausgabe.
4. **Folge für die Freigaben:** Prüfvermerke bleiben bestehen; Module mit Befund erhalten in der Befundliste den Eintrag „Nachprüfung 29.10.2026: behoben“ bzw. die offene Frage. Über eine Rücknahme entscheidet die fachliche Freigabe.

## Umsetzung 29.10.2026

Entscheidungen vom 29.10.2026 zu den offenen Fragen und Hinweisen (Branch `audit/pruefskript-10-29`). Prüfvermerke unverändert. Regressionstest `tests/umsetzungNachpruefung2_20261029.test.ts`.

| Kennung | Ergebnis | Quelle | Dateien |
|---|---|---|---|
| NP2-ST-2 | Profilstahl zentral als `GWP_LEHRWERTE.profilstahl` = 1,1 kg CO₂-Äq./kg (Lehrwert, vorläufig). Begründung: Marktmix ohne Herkunftsnachweis zwischen Elektrostahlroute (EPD bauforumstahl, Profile und Stabstahl, 0,56 kg/kg) und Hochofenroute (ÖKOBAUDAT 2024-I, verzinkte Profile, 2,92 kg/kg). Stahl-Modul und LCA-Rechner lesen daraus; der Einsparanteil des Dimensionierungsbeispiels wird aus den Profilgewichten gebildet (IPE 300 → IPE 200: 1 − 22,4/42,2 = 47 %, vorher pauschal 45 %), der Vorteil je m über `co2VorteilProfil` in `src/calc/stahlbau.ts` (IPE 300: 21,8 statt 34,2 kg CO₂-Äq./m). | [bauforumstahl, Leitfaden CO₂-optimierter Hallen- und Geschossbau, BFS-RL 01-101 (02/2026), Tab. 2 und 3](https://bauforumstahl.de/wp-content/uploads/2026/02/BFS-RL-01-101-Leitfaden-CO2-optimierter-Hallen-und-Geschossbau-Teil-1-02-2026.pdf) | `src/data/gwpLehrwerte.ts`, `src/calc/stahlbau.ts`, `src/modules/stahl/Stahlsorten.tsx`, `content/stahl/Stahlsorten.json`, `src/modules/interactivelcacalc/daten.ts` |
| NP2-LC-1 | Zementgebundene Lehrbetone aus Zementgehalt · `ZEMENT_GWP_KG` + Rest (`lehrbetonGwp`): C25/30 mit 300 kg Zement und Rest 45 kg/m³ (CEM I 245 wie bisher; CEM II/A 225, Größenordnung ÖKOBAUDAT 2024-I „Transportbeton C25/30“ 221,7), CEM II/C-M und CEM III/A je 165 (vorher 155 und 135), C30/37 mit CEM III/A 158 (vorher 145; jetzt gleich der Materialoptimierung). Minderungstext im LCA-Rechner aus den Werten gerechnet: rund 33 % (vorher „rund 45 %“). Beispiele und Quiz nachgerechnet: keine Frage verwendet die geänderten Werte (Quiz zur Ökobilanz und Materialoptimierung rechnen mit dem C30/37-Lehrbeton 243/158). | `src/data/zementGwp.ts` (VDZ-Branchen-EPD), Nachprüfung NP2-LC-1 | `src/data/gwpLehrwerte.ts`, `src/modules/interactivelcacalc/daten.ts`, `content/interactivelcacalc/daten.json`, `tests/nachpruefung2_20261029.test.ts` |
| NP2-OT-1 (Normtext) | Vergleichswert L/250 im Beispiel 1 als „vorläufig, Normprüfung ausstehend“ gekennzeichnet (Grenzwerte DIN EN 1995-1-1/NA, Tab. NA.13, am Normtext prüfen); Zahlen unverändert. | – | `content/onlinetools/OnlineTools.json` |
| Hinweis Luftporen (`bp_betonzusatzmittel`, `mischungsberechnung`) | Einheitlich „% je Vol.-% LP“: Faustregel rund 5 % je Vol.-% Luft über dem Grundluftgehalt (`LP_FESTIGKEITSVERLUST_JE_PROZENT`, `lpFestigkeitsverlust` in `src/calc/mischung.ts`); die Karte der Mischungsberechnung zeigt den Verlust in % statt „4 MPa je %“. Betonzusatzmittel („ca. 5 %“), Verkehrswegebau und Quiz („4–5 %“) stimmen damit überein. | Lehrwert (Faustregel) | `src/calc/mischung.ts`, `src/modules/Mischungsberechnung.tsx`, `src/modules/mischungsberechnung/MischungEingaben.tsx`, `content/mischungsberechnung/MischungEingaben.json` |
| Hinweis Holzbau-Schwingung (`holzbau_bauphysik`) | Kennwertsatz wählbar (`BSP_KENNWERTSAETZE`): „proHolz Austria“ (Standard wie bisher, E₀,mean = 11 550 N/mm², Wichte 5,5 kN/m³) oder „Lehrbeispiel wie Quiz“ (E = 11 000 N/mm², ρ_mean = 450 kg/m³, vorläufig). Die Ergebniszeile nennt den angesetzten Satz; der Hinweistext erklärt, dass für f₁ die mittlere Masse maßgebend ist und das Quiz vereinfacht mit dem Vollquerschnitt rechnet. Quiz unverändert (nicht falsch). | proHolz Austria, Bemessung Brettsperrholz Band II (2018), wie im Kern | `src/calc/bspSchwingung.ts`, `src/modules/HolzbauBeta.tsx`, `src/modules/holzbaubeta/HolzbauBauphysik.tsx`, `content/holzbaubeta/HolzbauBauphysik.json` |
| Hinweis Bautagebuch (`px_bautagebuch`) | Lernprojekte ohne reale Orte und Stellen: Ort „[Objekt]“, Bauherr „[Bauherr] (…)“ (Campus, Staatliches Bauamt, Straßenname und Parkhaus-Gesellschaft entfernt). | – | `content/bautagebuch/Bautagebuch.json` |
| Hinweis GISCODE (`bp_farben_lacke`) | Abgleich mit dem Einstufungskatalog GISCODE Beschichtungsstoffe der BG BAU/GISBAU (Stand 07/2024): Bezeichnungen BSW10 (wasserbasiert, konservierungsmittelarm), BSW20 (wasserbasiert), BSW40 (wasserbasiert, alkalisch), BSW60 (wasserbasiert, alkalisch, ätzend), BSL20 (lösemittelbasiert, aromatenfrei, gekennzeichnet) übernommen; BSL25 ist im Katalog nicht enthalten und durch BSL20 ersetzt; RE30 (eigener Katalog für Epoxidharze, nicht abgerufen) als „vorläufig, Normprüfung ausstehend“ gekennzeichnet; Katalog als Regelwerk verlinkt. | [BG BAU/GISBAU, Einstufungskatalog GISCODE Beschichtungsstoffe, 07/2024](https://www.bgbau.de/fileadmin/Gisbau/Einstufungskatalog_GISCODE_Beschichtungsstoffe_202407.pdf) | `content/bpfarbenlacke/BpFarbenLacke.json`, `content/bpfarbenlacke/daten.json`, `src/modules/BpFarbenLacke.tsx` |
| Hinweis Zahlformat (`membranen_etfe`) | „4400/4.000“ und „5000/4.500 N/5 cm“ → „4400/4000“ und „5000/4500 N/5 cm“ (vierstellig ohne Trennzeichen). | – | `content/membranenetfe/MembranenETFE.json` |
| Hinweis doppelte Fußzeile (`oekobilanz_lca`) | Fußzeile des Teils Grundlagen in `src/modules/LCA.tsx` entfernt; neue Inhalte (Literatur Borrmann und BMWSB-Rechenregeln, Weblink openLCA, Formeln GWP A1–A4 und QNG-Kennwert, Wikipedia „EPD“) in die modulweite Fußzeile übernommen, Dubletten weggelassen. | – | `src/modules/LCA.tsx`, `src/modules/OekobilanzLCA.tsx`, `content/lca/LCA.json`, `content/oekobilanzlca/OekobilanzLCA.json` |

### Prüfskript Kennwert-Abgleich

Maschinelle Vorarbeit für die vollständige gezielte Durchsicht (Punkt 2 der Empfehlung): `node scripts/qa/kennwert-abgleich.mjs` schreibt je Modul einen Ergänzungsbogen nach `docs/pruefung/kennwert-abgleich/` (Übersicht `README.md`). Test `tests/kennwertAbgleich.test.ts` (nur Lauffähigkeit und Erkennung, kein Gate).

### Vorschlag: Aufteilung der übrigen 113 Module in vier Tranchen

Grundgesamtheit: Module mit Status `geprueft` (143) ohne die 30 Module beider Stichproben. Aufteilung nach Menügruppen; Tranche A und B enthalten die Module mit den meisten Funden des Prüfskripts.

| Tranche | Menügruppen | Module |
|---|---|---|
| A (26) | Betontechnologie, Massivbau, Dauerhaftigkeit, Labor & Auswertung | `beton_a_z`, `betonkennwerte`, `betonpraxis`, `festbeton`, `herstellung_einbau`, `innovative_werkstoffe`, `qualitaetssicherung`, `sichtbeton`, `sonderbetone`, `carbonbeton`, `spannbeton_grundlagen`, `wu-bauwerke`, `korrosion`, `korrosionsschutz_beschichtungen`, `metallkorrosion`, `schnellkarbonatisierung`, `weitere_organik`, `analytik`, `mechanische_pruefungen`, `messen_pruefen`, `labor_potentialmessung`, `labor_auslagerung`, `labor_frischbeton`, `labor_druckfestigkeit`, `labor_moertelprismen`, `statistik` |
| B (27) | Nachhaltigkeit, Rückbau & Schadstoffe, Digitales, KI im Bauwesen, Beispielrechnungen, Praxiswissen, Bauphysik | `kreislauf_dpp`, `lca_ingenieurbau`, `lca_regulatorik`, `lebenszyklus_kosten`, `nachhaltigkeit_daten_regeln`, `ressourcen_umwelt`, `abfaelle`, `altholz_urban_mining`, `boden_materialaufbereitung`, `pfas_baustoffe`, `rueckbau`, `schadstoffe`, `bim_baustoffe`, `dpp`, `materialdatenbanken`, `materialpaesse`, `ki_lokal`, `ki_ressourcen`, `ki_system`, `ki_uebungen`, `rechnung_holzbau`, `rechnung_nachhaltigkeit`, `rechnung_stahlbeton`, `rechnung_u_wert`, `px_bauleitung`, `px_planung`, `daemmung_vergleich` |
| C (35) | Bauprodukte, Grundlagen, Bauen im Bestand, Mängel & Schäden | `bp_befestigung`, `bp_beton`, `bp_betonfertigteile`, `bp_dach_fassade`, `bp_daemmung`, `bp_holzprodukte`, `bp_innovationen`, `bp_kunststoffe`, `bp_metallisch`, `bp_mineralisch`, `bp_putz_estrich`, `bp_recht_avcp`, `bp_recht_grundlagen`, `bp_recht_normen`, `bp_stahlbauprofile`, `bp_trockenbau`, `bp_verkehr_asphalt`, `bp_verkehr_pruefung`, `bp_verkehr_rsto`, `bp_verkehr_tunnel`, `baustoffkunde`, `einheiten`, `materialkennwerte`, `normen_ausblick`, `regularien`, `sicherheitskonzept`, `bauwerkserfassung`, `zfp`, `bestand`, `denkmalpflege`, `historische_bauprodukte`, `historische_bauweisen`, `modernisierung`, `bauschaeden`, `vdi6200` |
| D (25) | Baustoffe, Holzbau, Mechanik | `ausbau`, `daemmstoffe`, `erdbau`, `gesteine`, `glas`, `holz`, `holzwerkstoffe`, `keramik_ziegel`, `kombinationen`, `kunststoffe`, `materialitaet_architektur`, `metalle`, `nawaro`, `putzemoertel`, `sonstiges`, `holzbau_bemessung`, `holzbau_werkstoffe`, `baustatik`, `bodenmechanik`, `bruchmechanik`, `emodul`, `festigkeit`, `formaenderungen`, `materialmodelle`, `stahlbau_ec3` |

Tranche C ist zahlenmäßig größer, die Bauprodukte-Module haben aber kaum Funde (zusammen 6 Punkte im Gewicht des Skripts); Tranche B enthält mit `lca_ingenieurbau`/`lca_regulatorik` (gemeinsame Komponente) den größten Einzelposten.
