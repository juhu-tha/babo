# Modulprüfung Tranche 12 – Bauen im Bestand, Rückbau & Schadstoffe, Dauerhaftigkeit (Befundliste zur Freigabe)

**Stand:** 28.10.2026 (Branch `pruefung/module-tranche12-10-28`, Basis origin/main b2cb8367, main e3349921 eingemergt)
**Status:** Vorschlag zur fachlichen Freigabe – noch nicht bestätigt.

> Nach der Freigabe eines Moduls wird in `src/data/pruefvermerke.ts` der Prüfvermerk „geprüft am …“ gesetzt (Passiv, ohne Namen). Mit dieser Befundliste wurden **keine** Prüfvermerke geändert. Geändert wurde eine Quizfrage (`qn_bauwerksuntersuchung_1`), weil sie durch die Korrektur T12-BU-1 falsch geworden wäre.

## Vorgehen

- **Auswahl (26 Module):** Gruppe „Bauen im Bestand“ (`bestand_info`, `bestand`, `bauwerkserfassung`, `denkmalpflege`, `modernisierung`, `bauwerksuntersuchung`, `historisch`, `historische_bauweisen`, `historische_bauprodukte`, `bestand_checklisten`), Gruppe „Rückbau & Schadstoffe“ (`rueckbau_info`, `rueckbau`, `boden_materialaufbereitung`, `abfaelle`, `schadstoffe`, `altholz_urban_mining`, `pfas_baustoffe`, `ressourceneffizienz`, `rueckbau_checklisten`) und Gruppe „Dauerhaftigkeit“ (`dauerhaftigkeit_info`, `dauerhaftigkeit`, `schadreaktionen_beton`, `holzkorrosion`, `metallkorrosion`, `korrosionsschutz_beschichtungen`, `weitere_organik`).
- **Prüfumfang je Modul:** Rechenkern bzw. Inline-Rechnung mit eigenen Nachrechnungen (eigenes Python-Skript, eigene Umsetzung der Gleichungen), sonst Fakten-Stichprobe (mindestens fünf Aussagen); Fachtext und Normstand; Grenzen (`src/data/rechnerGrenzen.ts`); Beispiele mit Rechenweg; Quellen; Stellen „vorläufig, F-Freigabe“.
- **Ergebnis der Nachrechnung:** 54 Prüfungen in `tests/modulpruefungTranche12.test.ts` (Toleranz 0,5 %), alle ohne Abweichung; zusätzlich alle Beispielrechnungen der Fachtexte (zwei je Modul) von Hand nachgerechnet – richtig bis auf T12-BU-1 und T12-HP-1.
- **Fakten-Stichprobe:** je Modul mindestens fünf Aussagen gegen öffentliche Quellen bzw. den Verordnungstext; insgesamt 27 Korrekturen und 7 offene Fragen.
- **Einschränkung:** Das WebSearch-Kontingent dieser Sitzung war nach den Modulen Rückbau, Abfälle und Schadstoffe erschöpft. Für `altholz_urban_mining`, `pfas_baustoffe`, `ressourceneffizienz` und die Gruppe Dauerhaftigkeit stützt sich die Fakten-Stichprobe auf bereits gefundene Quellen, die Nachrechnungen und den Kenntnisstand; nicht belegte Punkte stehen als Frage bzw. F-Stelle.
- **Parallelarbeit:** PR #231 teilt `bauwerksuntersuchung` in `bauwerksdiagnose`, `pruefverfahren_katalog` und `zfp` (alte ID als Alias). Die Korrekturen hier betreffen nur `content/bauwerksuntersuchung/*.json`; die Zuordnung zu den neuen IDs steht im Abschnitt 6.
- Normtexte wurden nicht abgeschrieben.

## Übersicht

| Nr. | Modul | Rechenkern | Empfehlung |
|---|---|---|---|
| 1 | `bestand_info`, `rueckbau_info`, `dauerhaftigkeit_info` | – | freigabefähig nach Korrektur T12-MI-1 |
| 2 | `bestand` | `src/utils/bestandKern.ts` (inline) | freigabefähig nach Korrektur T12-BE-1 und Klärung von T12-BE-2 |
| 3 | `modernisierung` | `src/utils/bestandKern.ts` | freigabefähig nach Korrektur T12-MO-1 |
| 4 | `bauwerkserfassung` | `src/calc/holzbau.ts` | freigabefähig nach Korrektur T12-BW-1/-2 (F-Stelle DIN 18202 Zeile 5) |
| 5 | `denkmalpflege` | – | freigabefähig |
| 6 | `bauwerksdiagnose`, `pruefverfahren_katalog`, `zfp` (vormals `bauwerksuntersuchung`) | `src/calc/bauwerksuntersuchung.ts` | freigabefähig nach Korrektur T12-BU-1 bis -6 und Klärung von T12-BU-7 |
| 7 | `historisch` | `src/utils/bestandKern.ts` | freigabefähig (F-Stellen Datenbank) |
| 8 | `historische_bauweisen` | inline | freigabefähig nach Klärung von T12-HB-1 |
| 9 | `historische_bauprodukte` | – | freigabefähig nach Korrektur T12-HP-1 |
| 10 | `bestand_checklisten` | – | freigabefähig nach Korrektur T12-BC-1 (Hinweis T12-BC-2) |
| 11 | `rueckbau` | inline | nach Klärung von T12-RB-4 (Massenkennwerte) |
| 12 | `boden_materialaufbereitung` | `src/calc/probenahme.ts` | freigabefähig |
| 13 | `abfaelle` | `src/calc/probenahme.ts`, inline | freigabefähig nach Korrektur T12-AB-1 bis -4 und Klärung von T12-AB-5 |
| 14 | `schadstoffe` | inline (KI) | freigabefähig nach Korrektur T12-SS-1 |
| 15 | `altholz_urban_mining` | `src/calc/altholz.ts` | freigabefähig (F-Stelle Anhang II) |
| 16 | `pfas_baustoffe` | `src/calc/pfas.ts` | freigabefähig |
| 17 | `ressourceneffizienz` | inline | freigabefähig nach Klärung von T12-RE-1 |
| 18 | `rueckbau_checklisten` | – | freigabefähig nach Korrektur T12-RC-1 |
| 19 | `dauerhaftigkeit` | `src/calc/korrosion.ts` | freigabefähig nach Korrektur T12-DH-1 bis -4 |
| 20 | `schadreaktionen_beton` | inline (Lehrmodelle) | freigabefähig |
| 21 | `holzkorrosion` | – | freigabefähig nach Korrektur T12-HK-1 und Klärung von T12-HK-2 |
| 22 | `metallkorrosion` | – | freigabefähig |
| 23 | `korrosionsschutz_beschichtungen` | `src/calc/korrosionsschutz.ts` | freigabefähig |
| 24 | `weitere_organik` | inline (Lehrmodell) | freigabefähig |

**Behobene Fehler (dieser PR):**
- **T12-AB-4 (gewichtig):** BBodSchV-Prüfwerte im Pfad-Checker „Altlasten“ entsprachen nicht der BBodSchV 2021 (u. a. Benzo(a)pyren Kinderspielflächen 2 statt 0,5, Cadmium 2 statt 10, Chrom Industrie 1000 statt 200, Quecksilber Sickerwasser 0,2 statt 1 µg/l, „PFAS-Summe 4: 0,1 µg/l“ statt Einzelwerten).
- **T12-AB-1/-2/-3:** EBV regelt kein Abfallende; „Produktstatus (§ 12 KrWG)“, QUBA-Automatismus und „BM-0 besitzt Produktstatus“ korrigiert; Stand der EBV-Novelle.
- **T12-SS-1:** EBV-Materialwerte für Bodenmaterial (Eluat) und HMVA im Modul Schadstoffe.
- **T12-RB-1/-2/-3:** „alte lungenvergängliche Steinwolle“, HBCD-Grenze (500 mg/kg statt 1000 mg/kg; gefährlich erst ab 30 000 mg/kg), RC-Anteile in Vol.-%.
- **T12-BU-1:** Bohrkernbeispiel mit k_n = 1,48 (Fassung 2008, ab 15 Kernen) statt 2,00 für n = 8; dazu Quizfrage `qn_bauwerksuntersuchung_1`.
- **T12-BU-2 bis -6:** Mindestbetondeckung, Karsten-Klassen, Normausgaben DIN EN 12504-1/-2/-4, Phenolphthalein-Konzentration, Massekonstanz, DIN 1076.
- **T12-BW-1/-2:** DIN-18202-Toleranzen (Zeile statt Spalte, Stichmaße), Scandauer BLK360 G2.
- **T12-HP-1:** Tobermorit-Bildungsgleichung nicht ausgeglichen.
- **T12-MO-1, T12-BE-1, T12-BC-1, T12-RC-1, T12-MI-1, T12-DH-1 bis -4, T12-HK-1:** Einzelkorrekturen (siehe Module).

---

## 1. Modulinfos (`bestand_info`, `rueckbau_info`, `dauerhaftigkeit_info`)

**Prüfumfang:** `content/moduleinfo/daten.json`, Abschnitte `bestand`, `rueckbau`, `dauerhaftigkeit` (Karten, Regelwerke, Formeln).

**Fakten-Stichprobe:** GModG §§ 35–37, Anlage 7, § 105 ([buzer, GModG §§ 34–39](https://www.buzer.de/gesetz/14072/b36731.htm), [buzer, Inhaltsübersicht GModG](https://www.buzer.de/GModG.htm)) – richtig. TRGS 519 „Fassung 2014, zuletzt geändert 28.01.2025“ – richtig ([umwelt-online, Bekanntmachung 28.01.2025, GMBl 2025 S. 144](https://umwelt-online.de/recht/t_regeln/trgs/trgs500/z25_0144.htm)). EBV in Kraft seit 01.08.2023 – richtig. DIN 68800-1:2019-06, -2:2022-02, -3:2020-03, -4:2020-12 und DIN 1045-2:2023-08 – richtig. pH des Porenwassers 12,5–13,5 – richtig.

**Befunde**
- **behoben – T12-MI-1:** „Quadratisches Zeitgesetz der Carbonatisierungstiefe“ für s(t) = k·√t → „Wurzel-t-Gesetz“.

**Empfehlung:** freigabefähig nach Korrektur T12-MI-1.

- [ ] Modul freigeben (`bestand_info`)
- [ ] Modul freigeben (`rueckbau_info`)
- [ ] Modul freigeben (`dauerhaftigkeit_info`)

## 2. Altbauatlas (`bestand`)

**Prüfumfang:** `src/modules/Bestand.tsx` (Sanierungsrechner mit `uRetrofit`, `dRequired`, F_x), `src/utils/bestandKern.ts`, `content/bestand/Bestand.json` (Epochen, U-Werte, zwei Beispiele, Formeln).

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern / Modul |
|---|---|---|---|
| BE1 | U_alt 1,50 + 6 cm Calciumsilikat (λ 0,060) | U = 0,600 W/(m²K); θ_si 15,1 → 18,1 °C | identisch |
| BE2 | ΔU 0,90, A 100 m², G 3500 Kd/a | ΔQ = 7560 kWh/a; 1814 kg CO₂ (Erdgas 0,24 kg/kWh) | identisch |
| BE3 | Vor-1919-Wand U 1,6 + 140 mm λ 0,035, 100 m², F_x 1 | U = 0,2162; ΔQ = 11 624 kWh/a | identisch (Rechner) |

**Normstand:** GModG Anlage 7 – die Nummerierung des Kerns (Nr. 1a/1b, 2a–2c, 4, 5a–5c, 6a–6e) und die Werte stimmen mit der Lesefassung überein ([buzer, Anlage 7 GModG](https://www.buzer.de/Anlage_7_GModG.htm)). **Damit ist Frage B-2 aus Tranche 1 beantwortet: Die Höchstwerte sind gegenüber dem GEG unverändert.** DIN 4108-3:2024-03, DIN EN ISO 6946:2018-03, WTA 6-4-16/D und 6-5-14/D – richtig.

**Befunde**
- **behoben – T12-BE-1:** Beispiel 2 und Formel nannten „Heizgradtage“ bzw. „HGT“, gerechnet wird mit der Gradtagzahl G_t20/15 (VDI 4710) wie im Rechner. Begriff angeglichen.
- **offen – Frage T12-BE-2 (CO₂-Faktor Erdgas):** Rechner 0,22 kg/kWh, Beispiel 2 und GModG Anlage 9 0,240 kg/kWh. Angleichen auf 0,24 (auch im Modul Modernisierung fest 0,22)?
- Hinweis: Für das Modul gibt es keinen Grenzen-Eintrag (Typ „database“, der Sanierungsrechner rechnet aber); die Amortisation „keine“ wird intern als 999 a geführt.
- Hinweis: Die U-Werte je Baualtersklasse sind als „Standardwerte nach Altbau-Atlas“ bezeichnet, die Literatur nennt die Bekanntmachung BMWi/BMI 2020. Abgleich der Einzelwerte mit der Bekanntmachung (F-Stelle).

**F-Freigabe-Stellen:** U-Werte der Baualtersklassen gegen die Bekanntmachung der Regeln zur Datenaufnahme (2020).

**Empfehlung:** freigabefähig nach Korrektur T12-BE-1 und Klärung von T12-BE-2.

- [ ] Modul freigeben

## 3. Modernisierung & GModG (`modernisierung`)

**Prüfumfang:** `src/modules/Modernisierung.tsx` (`savings` mit Kopplungsprinzip), `content/modernisierung/Modernisierung.json`, Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| MO1 | U 1,40 → 0,24, EPS 032 | ΔR = 3,452; d_erf = 0,110 m; mit 14 cm U = 0,1965 | identisch |
| MO2 | A 160 m², G 3500, η 0,90, 0,12 €/kWh, 16 400 € bzw. 2800 € Mehrkosten | Q_E = 17 972 kWh/a; t = 7,6 a bzw. 1,3 a | identisch |
| MO3 | Kellerdecke U 1,2 + 100 mm λ 0,035, 80 m², F_x 0,6 | Q_E = 4162 kWh/a | identisch |

**Fakten-Stichprobe:** Bio-Treppe 2029/2030/2035/2040: 10/15/30/60 % (§ 43) – richtig ([BauNetz Wissen, GModG](https://www.baunetzwissen.de/heizung/fachwissen/verordnungen-gesetze/gebaeudemodernisierungsgesetz-gmodg-10443988)). § 42a Grüngasquote, §§ 71–73 aufgehoben – richtig ([buzer, GModG](https://www.buzer.de/GModG.htm)). § 69 Abs. 2–4 (Nachrüstung Rohrleitungen, Stichtag 01.02.2002, zwei Jahre) – richtig ([buzer, § 69 GModG](https://www.buzer.de/69_GModG.htm)). § 36 Bagatellgrenze 10 % – richtig. Anlage 8 (20/30 mm, 100 % des Innendurchmessers) – richtig.

**Befunde**
- **behoben – T12-MO-1:** Nachrüstpflicht oberste Geschossdecke: Die Bedingung „nicht Mindestwärmeschutz nach DIN 4108-2 erfüllt“ (§ 35 Abs. 1) fehlte; der Text verlangte die Dämmung ausnahmslos ([buzer, § 35 GModG](https://www.buzer.de/gesetz/14072/b36731.htm)).
- Hinweis: Die BEG-Fördersätze (30/20/30/5 %, max. 21 000 €) und der iSFP-Bonus sind Stand 2024/2025; vor der Lehre aktuellen Förderstand prüfen.

**F-Freigabe-Stellen:** keine neuen.

**Empfehlung:** freigabefähig nach Korrektur T12-MO-1 (Frage T12-BE-2 gilt mit).

- [ ] Modul freigeben

## 4. Bauwerkserfassung (`bauwerkserfassung`)

**Prüfumfang:** Sparrenrechner (`verformterDruckstab` aus `src/calc/holzbau.ts`, Tranche 2 geprüft), Genauigkeitsstufen, Messverfahren, `content/bauwerkserfassung/Bauwerkserfassung.json`, Grenzen.

**Nachrechnungen:** Beispiel 1 (100/140 mm, 4 m, q_d 2,0 kN/m): σ_m,d = 12,24, f_m,d = 16,62 N/mm², η = 0,74 – richtig. Beispiel 2 (N_d 20 kN, e₀ 45 mm): λ = 99,0, λ_rel = 1,678, k_c = 0,311, Gl. (6.23) 0,32 + 0,90 = 1,22; Gl. (6.19) 0,91 – richtig.

**Befunde**
- **behoben – T12-BW-1:** „Grenze Spalte 5 (± 16 mm auf 4 m)“ und „Spalte 6 (± 6 mm auf 4 m)“: DIN 18202 gibt Ebenheitstoleranzen als Stichmaße in Zeilen der Tab. 3 an. Flächenfertige Wände (Zeile 6) bei 4 m: 10 mm ([Forum Verlag, DIN 18202](https://forum-verlag.com/fachwissen/bau-und-gebaeudemanagement/din-18202/)); nichtflächenfertige Wände (Zeile 5): 15 mm (Kenntnisstand, vorläufig, F-Freigabe).
- **behoben – T12-BW-2:** „Pro Standpunkt 1–2 Minuten“: Der BLK360 G2 scannt die Vollkuppel mit Panoramabild in unter 20 s, HDR-Bild unter 20 s ([Datenblatt BLK360 G2, arctron](https://www.arctron.de/wp-content/uploads/2023/05/Leica-BLK360-G2_Datenblatt.pdf)); 680 000 Punkte/s und 4 mm bei 10 m bestätigt.

**F-Freigabe-Stellen:** DIN 18202:2019-07, Tab. 3, Zeile 5 bei 4 m; Genauigkeitsstufen nach Eckstein (bereits im Modul vermerkt).

**Empfehlung:** freigabefähig nach Korrektur T12-BW-1/-2.

- [ ] Modul freigeben

## 5. Denkmalpflege (`denkmalpflege`)

**Prüfumfang:** `content/denkmalpflege/Denkmalpflege.json` (BayDSchG, Charta von Venedig, § 105 GModG, Sonder-AfA, Innendämmung, zwei Beispiele).

**Nachrechnungen:** Correns (Halit, V_m 27,0 cm³/mol, 293 K, c/c_s = 2): p = 2436/27·10⁻⁶ · ln 2 = 62,5 MPa – richtig. Fachwerk-Innendämmung: U = 1/(0,833 + 0,889) = 0,58 W/(m²K) – richtig.

**Fakten-Stichprobe:** Ordnungswidrigkeiten Art. 20 BayDSchG – richtig ([Bayern.Recht, Art. 20 BayDSchG](https://www.gesetze-bayern.de/Content/Document/BayDSchG-20)). § 7i EStG 8 × 9 % + 4 × 7 %, § 10f EStG 10 × 9 % – richtig ([rulecalc, § 7i EStG](https://rulecalc.com/de/immobilien/estg-7i-absetzungen-baudenkmal)). § 105 GModG – richtig. Deklaratorisches Prinzip (Art. 2), Wartezeit eine Woche (Art. 8 Abs. 2), Schatzregal seit 01.07.2023 (Art. 9) – nach Kenntnisstand richtig.

**Befunde:** keine.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 6. Bauwerksdiagnose & ZfP (`bauwerksuntersuchung`; nach #231: `bauwerksdiagnose`, `pruefverfahren_katalog`, `zfp`)

**Prüfumfang:** `src/calc/bauwerksuntersuchung.ts` (Rückprall, Ultraschall, Impact-Echo, Haftzug, Karsten, Karbonatisierung, Bohrkern, Deckung, Probenahme, Befundsynthese), `content/bauwerksuntersuchung/*.json` (Hauptseite, Prüfkatalog `pruefverfahrenData`, Diagnosedaten `diagnoseData`, Probenahmeplaner, Interpretationsnavigator, Simulatoren).

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| BU1 | Richtungskorrektur R = 40 | +90°: −3,90; −90°: +2,58 | identisch |
| BU2 | R = 30 abwärts, d_k = 15 mm | R_korr 33,01; k 0,85; f_c = 0,0125·28,06^2,22 = 20,49 N/mm² | identisch |
| BU3 | 0,40 m / 95 µs, ρ 2400 | v_p = 4211 m/s; E_dyn = 38,29 GPa | identisch |
| BU4 | Impact-Echo 6 kHz, v_p 4000 | d = 32,0 cm | identisch |
| BU5 | Haftzug 3,5 kN, Ø 50 | 1,78 N/mm² | identisch |
| BU6 | d_k 15 mm, 36 a, c 25 mm | K = 2,5; t_depass = 100 a | identisch |
| BU7 | Bohrkern Ø 100, 250 kN | 31,83 N/mm² | identisch |
| BU8 | Karsten 2,5 ml/60 min, A 5,73 cm² | w = 4,36 kg/(m²√h) → wassersaugend | identisch |
| BU9 | Beispiel 2: n = 8, f_m 31,0, s 2,5, f_lowest 28,0 | f_ck,is = min(31,0 − 2,00·2,5; 32,0) = 26,0; f_ck = 30,6 → C30/37 | **vorher 1,48·s** |

Tab. 4.4DE (c_min,dur, Δc_dev), E_dyn-Formel, β = 0,96 und ASTM-C876-Grenzen im Kern sind richtig.

**Befunde**
- **behoben – T12-BU-1:** Beispiel 2 und die Formelzeile rechneten mit k_n = 1,48 („Ansatz des Moduls“); das ist der Faktor der Fassung 2008 für mindestens 15 Kerne. Für n = 8 gilt nach DIN EN 13791:2020-02 k_n = 2,00, so stand es bereits im Prüfkatalog und im Probenahmeplaner. Ergebnis 26,0 statt 27,3 N/mm², Einstufung unverändert C30/37. Quizfrage `qn_bauwerksuntersuchung_1` angepasst (28,5 statt 30,1 N/mm²; der alte Wert ist jetzt Distraktor).
- **behoben – T12-BU-2:** Prüfkatalog „Bewehrungsortung“: „XC1 ≥ 15 mm; XC3/XC4 ≥ 25–30 mm zzgl. Δc_dev = 10 mm“ widersprach Tab. 4.4DE und dem Kern (XC1 10, XC2/XC3 20, XC4 25, XD/XS 40 mm; Δc_dev 10 bzw. 15 mm).
- **behoben – T12-BU-3:** Prüfkatalog „Karsten-Röhrchen“: Klassen „w < 0,1 wasserabweisend, 0,1–0,5 wasserhemmend“ widersprachen DIN 4108-3 und dem Kern (≤ 0,5 wasserabweisend, ≤ 2,0 wasserhemmend); Prüffläche 4,5 cm² → Lehrwert 5,73 cm² wie im Kern.
- **behoben – T12-BU-4:** Ausgaben DIN EN 12504-1:2021-02 (nicht 2019-09), DIN EN 12504-2:2021-10 und -4:2021-10 (nicht 2021-08) ([DIN Media, 12504-1](https://www.dinmedia.de/de/norm/din-en-12504-1/332723593); [DIN Media, 12504-2](https://www.dinmedia.de/en/standard/din-en-12504-2/335978574); [DIN, 12504-4](https://6sku3uaup9f9.din.de/en/standard/din-en-12504-4/335410052)).
- **behoben – T12-BU-5:** Probenahmeplaner: Indikator „0,1 % Phenolphthalein“ → 1%ige Lösung (wie in den Diagnosedaten; [Understanding Cement](https://www.understanding-cement.com/carbonation.html)); Massekonstanz „zwei Wägungen im Abstand von 4 h“ → drei Wägungen im Abstand von mindestens 24 h, Änderung < 0,1 % (gleiche Definition in ISO 12570/12571; [ISO 12571, Leseprobe](https://cdn.standards.iteh.ai/samples/2408/034d346436884759aaeee0d823b48dff/ISO-12571-2000.pdf)).
- **behoben – T12-BU-6:** Titel DIN 1076 mit Ausgabe 2026-01 ([DIN, DIN 1076:2026-01](https://6sku3uaup9f9.din.de/en/standard/din-1076/394559449)).
- **offen – Frage T12-BU-7 (Rückprall-Ausreißer):** Der Prüfkatalog empfiehlt, Werte mit mehr als 6 Einheiten Abweichung vom Median zu streichen. Nach meinem Kenntnisstand verwirft DIN EN 12504-2 dann den ganzen Messsatz, wenn mehr als 20 % der Werte um mehr als 6 Einheiten vom Median abweichen. Bitte am Normtext bestätigen.
- Hinweis: Die Gefügestufen des Ultraschallkerns (< 3000 kritisch, < 3800 mäßig) weichen von den Textstufen (3000/3500/4500 m/s) ab.
- Hinweis: Ablesezeit Phenolphthalein „30–60 s“ (Diagnose, Planer) gegenüber „60–120 s abwarten“ (Prüfkatalog) – angleichen.

**Zuordnung nach #231 (gemergt, in diesen Branch eingemergt):** T12-BU-1 und -6 → `bauwerksdiagnose` (Phasen, Beispiele), T12-BU-5 → `bauwerksdiagnose` (Probenahmeplaner); T12-BU-2, -3, -4 und -7 → `pruefverfahren_katalog` (Prüfkatalog und Diagnosedaten der Verfahren). `zfp` (DGZfP & Ausbildung) ist von den Befunden nicht betroffen. Die Quizfrage `qn_bauwerksuntersuchung_1` gehört jetzt zu `bauwerksdiagnose`.

**F-Freigabe-Stellen:** k_n-Tabelle und M nach DIN EN 13791:2020-02; Verwerfungsregel DIN EN 12504-2.

**Empfehlung:** freigabefähig nach Korrektur T12-BU-1 bis -6 und Klärung von T12-BU-7.

- [ ] Modul freigeben (`bauwerksdiagnose`)
- [ ] Modul freigeben (`pruefverfahren_katalog`)
- [ ] Modul freigeben (`zfp`)

## 7. Historische Kennwerte (`historisch`)

**Prüfumfang:** Reiter Datenbank (`src/data/historicalMaterialsData.ts`), Labor-Rechner (`charValue`, `fkMasonry`), Nachweis im Bestand (`designLognormal`), Fachtexte.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| HI1 | 22/25/27/24/26 N/mm², lognormal | V unbekannt (k_n 2,33): X_k = 20,58; V = 0,10 bekannt (k_n 1,80): 20,67 | identisch |
| HI2 | f_m 25, V 0,15, β 3,8, α_R 0,8, γ_Rd 1,1 | f_d = 14,28 N/mm² | identisch |
| HI3 | Ziegelwand 1920, f_b 12,3, f_m 2,5 | f_k = 4,19; f_d = 2,37 N/mm² | identisch |

Tab. D.1/D.2 der DIN EN 1990 im Kern vollständig richtig. Beispiele 1 (15,7 N/mm²) und 2 (R_eH 223, R_m 360 N/mm²), Bn 250 → C20/25 (f_cd 11,33 bzw. 12,59 N/mm²), St 37-2 → S235 richtig.

**Befunde**
- behoben: keine.
- Hinweis: Formbeiwert δ = 0,82 für h/w = 65/120 mm; lineare Interpolation in DIN EN 772-1, Tab. A.1 ergibt etwa 0,81.
- Hinweis: „St 52-3 Feinkornbaustahl“ und „St 70-2 Vergütungsstahl“ sind unscharf (unlegierte Baustähle).

**F-Freigabe-Stellen:** Farbkennzeichnung und zulässige Spannungen nach DIN 105:1957; Umrechnungsfaktoren k_moist, k_rebar, k_dia (im Modul bereits als Literaturwerte gekennzeichnet).

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

**Umsetzung 29.10.2026 (Entscheidung 28.10., γ_c = 1,35 Bestandsbewertung):** Quelle des Bestandswerts im Labor-Rechner ist jetzt das DBV-Merkblatt „Modifizierte Teilsicherheitsbeiwerte für Stahlbetonbauteile“ (Deutscher Beton- und Bautechnik-Verein, Fassung März 2013, Merkblattreihe „Bauen im Bestand“; Titel und Ausgabe am öffentlichen Inhaltsverzeichnis bei DIN Media geprüft). Im Tipp (RechnerLaborTab.json), in `src/data/kennwerte.ts` und in den Regelwerken genannt: nur Widerstandsseite modifiziert, qualifizierte Bestandsaufnahme, Betondruckfestigkeit und Geometrie am Bauwerk ermittelt, γ_C,mod abhängig vom gemessenen Variationskoeffizienten. Zuordnung γ_c = 1,35 ↔ Grenze des Variationskoeffizienten: öffentlich nicht belegt, „vorläufig, F-Freigabe“. DIN EN 1992-1-1, Anhang A.2.2(2) (γ_C,red3 = 1,35, Geometrie gemessen, V_c ≤ 10 %) nur noch als Vergleich mit dem Hinweis, dass Anhang A in Deutschland nicht eingeführt ist. Rechenwert unverändert (f_cd = 0,85·f/1,35; tests/fcdModule.test.ts).

## 8. Historische Bauweisen (`historische_bauweisen`)

**Prüfumfang:** Gewölbeschub-, Kappendecken- und Schwindrechner (inline), Fachtext, Beispiele.

**Nachrechnungen:** Beispiel 1: q = 2,8 kN/m, M = 7,09 kNm, W = 1,29·10⁶ mm³, σ = 5,5 N/mm² – richtig. Beispiel 2: Δb = 220 · 0,0027 · 18 = 10,7 mm – richtig. Gewölbeschub H = wL²/(8f) + PL/(4f) und Kappenschub H = qa²/(8f) – richtig.

**Befunde**
- **offen – Frage T12-HB-1 (Schwindbeiwerte):** Der Rechner nutzt für Fichte radial 0,15 und tangential 0,27 %/%. Das ist die untere Grenze der Literaturspanne (radial 0,15–0,19, tangential 0,27–0,36 %/% nach Sell 1989, zitiert in [core.ac.uk 159145941](https://core.ac.uk/download/159145941.pdf)); für Fichte tangential wird auch 0,36 genannt ([Hausjournal](https://hausjournal.net/ausdehnung-holz-feuchtigkeit)). Auf Werte nach DIN 68100 umstellen (F-Freigabe)?

**Empfehlung:** freigabefähig nach Klärung von T12-HB-1.

- [ ] Modul freigeben

## 9. Historische Bauprodukte (`historische_bauprodukte`)

**Prüfumfang:** Produktkatalog (Fachtext je Produkt), Formeln, zwei Beispiele (PCB-Raumluft, Blei im Trinkwasser).

**Fakten-Stichprobe:** TrinkwV § 17: Bleileitungen bis 12.01.2026 zu entfernen; Blei 10 → 5 µg/l ab 12.01.2028 – richtig. GefStoffV § 5a Abs. 2 (Baubeginn bei Baujahr 1993–1996) – richtig ([lxgesetze, § 5a GefStoffV](https://lxgesetze.de/gefstoffv/5a)). KMF: KI-Grenzen, IARC Gruppe 3 seit 2001 – richtig. AIR-Richtwerte PCB 80/800 ng/m³ (bereits umgestellt). Eiffelturm aus Puddeleisen – richtig zugeordnet.

**Befunde**
- **behoben – T12-HP-1:** Tobermoritbildung „5 Ca(OH)₂ + 6 SiO₂ + 5 H₂O → Ca₅Si₆O₁₆(OH)₂·4H₂O“ war nicht ausgeglichen (links 20 H und 27 O, rechts 10 H und 22 O). Richtig ohne zusätzliches Wasser: 5 Ca(OH)₂ + 6 SiO₂ → Ca₅Si₆O₁₆(OH)₂·4H₂O. Die übrigen Gleichungen (Aluminium im alkalischen Milieu, Bleicarbonat, PVC, PMMA, Wasserstoffaufnahme, Ettringit) sind ausgeglichen.

**Empfehlung:** freigabefähig nach Korrektur T12-HP-1.

- [ ] Modul freigeben

## 10. Bestands-Checklisten (`bestand_checklisten`)

**Nachrechnungen:** Chlorid 0,08 · 2350/300 = 0,63 M.-% v. z; Darrfeuchte (520 − 495)/495 = 5,1 M.-% – richtig.

**Befunde**
- **behoben – T12-BC-1:** „Bei Gebäuden mit Baubeginn vor dem 31.10.1993 muss der Veranlasser … ermitteln“: § 5a Abs. 1 GefStoffV gilt unabhängig vom Baujahr (Übergabe vorliegender Informationen, keine Erkundungspflicht); das Baujahr bzw. bei 1993–1996 der Baubeginn ist anzugeben (Abs. 2).
- Hinweis T12-BC-2: Ausgabe WTA-Merkblatt 4-5 („4-5-99/D“ hier, „4-5-20“ im Modul Bauwerksdiagnose) vereinheitlichen.

**Empfehlung:** freigabefähig nach Korrektur T12-BC-1.

- [ ] Modul freigeben

## 11. Rückbau & Material (`rueckbau`)

**Prüfumfang:** `content/rueckbau/*.json`, Rückbaurechner (Massen aus BRI, inline in `Rueckbau.tsx`), Reiter Aktualität und Baustoffrecycling.

**Nachrechnungen:** Beispiel 1: 2880 + 480 + 30 + 40 = 3430 t, mineralisch 98 % – richtig. Beispiel 2: 3360 · 23 − 40 000 = 37 280 € – richtig.

**Fakten-Stichprobe:** GewAbfV § 8 (zehn Fraktionen, Dokumentation ab 10 m³), EBV § 22 (≥ 250 m³, vier Wochen), TRGS 519, BayBO Art. 57 Abs. 5 – richtig.

**Befunde**
- **behoben – T12-RB-1:** „alte lungenvergängliche Steinwolle“ – alte KMF sind gerade biobeständig (nicht biolöslich) und deshalb krebserzeugend.
- **behoben – T12-RB-2:** HBCD: „gefährlich bei > 1000 mg/kg“. Der Grenzwert nach Anhang IV der EU-POP-Verordnung beträgt jetzt 500 mg/kg; als gefährlicher Abfall nach AVV gilt der Dämmstoff erst ab 30 000 mg/kg ([LAGA, Vollzugshinweise HBCD](https://www.laga-online.de/documents/11-hbcd_2_1717078546.pdf)). Auch in `rueckbau/daten.json`.
- **behoben – T12-RB-3:** R-Beton „35/45 Gew.-%“ → Vol.-% (Typ 1 bis 45 Vol.-%, Typ 2 bis 35 Vol.-%; [BauNetz Wissen, Recyclingbeton](https://www.baunetzwissen.de/beton/fachwissen/betonarten/recyclingbeton-930267)).
- **offen – Frage T12-RB-4 (Massenkennwerte Rückbaurechner):** Die spezifischen Massen je m³ Brutto-Rauminhalt summieren sich auf 1,8 t/m³ (Stahlbeton) bis 2,0 t/m³ (Mauerwerk); ein Einfamilienhaus mit 800 m³ ergibt so rund 1600 t. Das ist physikalisch kaum möglich (Mauerwerk 1,2 t/m³ BRI hieße rund zwei Drittel des Raums massives Mauerwerk). Nach meinem Kenntnisstand liegen Abbruchmassen von Wohngebäuden bei etwa 0,3 bis 0,6 t je m³ BRI; eine öffentliche Quelle für Kennwerte je Bauweise habe ich nicht gefunden. Bitte Kennwerte festlegen.

**Empfehlung:** nach Klärung von T12-RB-4 freigabefähig (Korrekturen T12-RB-1 bis -3 erfolgt).

- [ ] Modul freigeben

## 12. Boden- & Materialaufbereitung (`boden_materialaufbereitung`)

**Prüfumfang:** `src/calc/probenahme.ts` (LAGA PN 98 Tab. 2/3, Untersuchungseinheiten), Probenahmeprotokoll, Behandlungsverfahren, Grenzen.

**Nachrechnungen:** PN 98 Tab. 2 gegen die öffentliche Wiedergabe ([umwelt-online, PN 98 Teil 2](https://umwelt-online.de/recht/abfall/laga/pn98b.htm)): 120 m³ 20/5/0/5; 700 m³ 44/11/1/11; 850 m³ 52/13/1/11; 1000 m³ 56/14/2/12; 1200 m³ 64/16/2/12 (EP/MP/SP/LP) – Kern identisch. Tab. 3 (Größtkorn 32 mm: 2 l / 4 l; > 120 mm Stück) – identisch. Beispiel 1 (192 t, 5/20/5, 40 l, 8 l) und Beispiel 2 (w = 15,0 %, 20,7 mg/kg TM) – richtig.

**Fakten-Stichprobe:** EBV Anlage 1 Tab. 1: Sulfat RC-1/2/3 600/1000/3500 mg/l, Chrom 150 µg/l, Kupfer 110 µg/l, PAK16 10 mg/kg (RC-1) – richtig ([Gesetze im Internet, Anlage 1 EBV](https://www.gesetze-im-internet.de/ersatzbaustoffv/anlage_1.html)). BBodSchV seit 01.08.2023 – richtig.

**Befunde:** keine.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 13. Abfälle & Altlasten (`abfaelle`)

**Prüfumfang:** `content/abfaelle/*.json` (Abfälle, AVV, EBV/Mantelverordnung, Deponie, LAGA PN 98, Altlasten, Checklisten), EBV-Einbaulogik und Deponieklassierer (inline in `Abfaelle.tsx`), PN-98-Rechner.

**Nachrechnungen:** Beispiel 1 (Sulfat 1450, Chlorid 120, Blei 0,08 mg/l, TOC 0,6, GV 2,4) → DK I – richtig (DepV Anhang 3 Tab. 2: DK 0 100/80/0,05; DK I 2000/1500/0,2/1/3). Beispiel 2 (300 m³ RC-3 ≥ 250 m³, anzeigepflichtig) – richtig. Deponieklassierer TOC 1/1/3/6, GV 3/3/5/10, Sulfat 100/2000/2000/5000 – richtig.

**Befunde**
- **behoben – T12-AB-1:** „Produktstatus (§ 12 KrWG): Erstmalige gesetzlich verankerte Entlassung … aus dem Abfallregime“. Die EBV regelt das Abfallende nicht; es gilt § 5 Abs. 1 KrWG im Einzelfall ([LfU Bayern, FAQ EBV, 0.2](https://www.lfu.bayern.de/abfall/ersatzbaustoffverordnung/faq_ersatzbaustoffverordnung/doc/faq_ebv_druckversion_nicht_bf.pdf); [EUWID 07/2023](https://www.euwid-recycling.de/news/politik/bundesrat-beschliesst-ebv-novelle-ohne-weitere-aenderungen-100723/)); § 12 KrWG betrifft Bioabfälle.
- **behoben – T12-AB-2:** „Mit dem QUBA-Gütezeichen erreicht RC-1 direkt das Ende der Abfalleigenschaft“ → ein Qualitätssicherungssystem kann darauf hindeuten, ein Automatismus besteht nicht. In der EBV-Einbaulogik „BM-0 besitzt Produktstatus“ entsprechend korrigiert.
- **behoben – T12-AB-3:** EBV-Novelle: Referentenentwurf vom 15.07.2026, nicht „08/2026“ ([Lobbyregister, RV0028510](https://www.lobbyregister.bundestag.de/media/a4/72/848515/Lobbyregister-Regelungsvorhaben-Detailansicht-RV0028510-2026-09-28_09-10-45.pdf)).
- **behoben – T12-AB-4:** Prüfwerte im Pfad-Checker „Altlasten“ gegen BBodSchV 2021, Anlage 2 ([Gesetze im Internet, Anlage 2 BBodSchV](https://www.gesetze-im-internet.de/bbodschv_2023/anlage_2.html)):

| Pfad / Stoff | vorher | nachher |
|---|---|---|
| Kinderspielflächen Cd / Cr / BaP | 2 / 100 / 2 | 10 (2,0 in Haus- und Kleingärten) / 200 / 0,5 |
| Wohngebiete Cd / Cr / BaP | 10 / 200 / 4 | 20 / 400 / 1 |
| Park- und Freizeitanlagen Cr / Hg / BaP | 500 / 70 / 10 | 400 / 50 / 1 |
| Industrie Cr / Hg / BaP | 1000 / 80 / 12 | 200 / 100 / 5 |
| Chrom VI (neu) | – | 130 / 250 / 250 / 130 |
| Sickerwasser Cd / Hg [µg/l] | 0,5 / 0,2 | 3 / 1 |
| Sickerwasser PFAS | „Summe 4: 0,1“ | Einzelwerte PFOA, PFOS, PFHxS 0,1; PFNA 0,06 (Tab. 3) |
| Nutzpflanze Hg | 1 | 5 (Königswasser); Cd 0,1 als Maßnahmenwert (0,04 Brotweizen/Gemüse) |

  Der Text „PFAS-Meilenstein: Eluatprüfwert 0,1 µg/l für die Summe aus vier Verbindungen“ wurde auf die sieben Einzelprüfwerte umgestellt; „bis zu 10-fach höhere Grenzwerte“ → Prüfwerte.
- **offen – Frage T12-AB-5:** Fundstellen für „Kataster 120 Jahre“, „Aufbewahrung 30–40 Jahre“ und „Anzeigepflicht HMVA-1 ab 50 m³“ (EBV §§ 22, 23, 25) bitte bestätigen; öffentlich habe ich sie nicht gefunden.

**F-Freigabe-Stellen:** EBV § 19 Abs. 8 (Sickerstrecke + 0,5 m Sicherheitsabstand), § 22 Mengenschwellen.

**Empfehlung:** freigabefähig nach Korrektur T12-AB-1 bis -4 und Klärung von T12-AB-5.

- [ ] Modul freigeben

## 14. Schad- und Gefahrstoffe (`schadstoffe`)

**Prüfumfang:** `content/schadstoffe/Schadstoffe.json` (Stoffsteckbriefe, GefStoffV-Novelle, Risikokonzept, EBV), KI-Rechner (inline), Baujahr-Regler, zwei Beispiele.

**Nachrechnungen:** Beispiel 1: KI = 31,8 − 2·2,0 = 27,8 ≤ 30 → Kategorie 1B – richtig. Beispiel 2: Schichtmittelwert 14,5/8 = 1,81 mg/m³, Bewertungsindex 1,45 bei 1,25 mg/m³ (A-Staub) – richtig. KI-Formel im Rechner wie GefStoffV Anhang II Nr. 5.

**Fakten-Stichprobe:** § 5a GefStoffV (Abs. 2: Baubeginn 1993–1996), Inkrafttreten 05.12.2024 – richtig ([lxgesetze, § 5a](https://lxgesetze.de/gefstoffv/5a)). Asbestverbot 31.10.1993, EU 2005; KMF-Stichtag 01.06.2000, RAL-GZ 388; Akzeptanz-/Toleranzkonzentration 10 000/100 000 F/m³; HBCD-Ablauftermin 21.08.2015 – nach Kenntnisstand richtig. EBV RC-1-Werte (Sulfat 600, Kupfer 110 µg/l, Leitfähigkeit 2500 µS/cm) – richtig.

**Befunde**
- **behoben – T12-SS-1:** EBV-Werte: Bodenmaterial „Arsen ≤ 10, Blei ≤ 7, Cadmium ≤ 0,2 µg/l, Chlorid ≤ 50 mg/l“ → Tab. 3: BM-0* Arsen 8, Blei 23, Cadmium 2 µg/l (Chlorid nicht festgelegt), BM-0 vor allem Feststoffwerte und Sulfat 250 mg/l. HMVA „Sulfat 2000, Chlorid 1500 mg/l, Blei 40 µg/l“ → HMVA-1: 820 mg/l, 160 mg/l, 2000 µS/cm; HMVA-2: 3000 mg/l, 5000 mg/l, 12 500 µS/cm ([Gesetze im Internet, Anlage 1 EBV](https://www.gesetze-im-internet.de/ersatzbaustoffv/anlage_1.html)).

**Empfehlung:** freigabefähig nach Korrektur T12-SS-1.

- [ ] Modul freigeben

## 15. Altholz-NIR & Urban Mining (`altholz_urban_mining`)

**Prüfumfang:** `src/calc/altholz.ts`, Anhang-II-Tabelle (inline), Fachtext, zwei Beispiele, Grenzen.

**Nachrechnungen:** Standardeingabe (15/45/15/25 t; 95/90/85/95 %): M_st = 58,25 t, q_F = 8,75 %, Reinheit 93,99 %, A IV im Stoffstrom 2,15 %, q_st = 54,75 % – Kern identisch. Beispiel 1 (zweite Stufe): 56,03 t, A IV 0,22 %, Verlust 1,1 t – richtig. Beispiel 2: 2160 t Holz, 1166 t stofflich – richtig.

**Fakten-Stichprobe (Kenntnisstand):** AltholzV 2002, zuletzt geändert 2020; Anhang II (As 2, Pb 30, Cd 2, Cr 30, Cu 20, Hg 0,4, Cl 600, F 100, PCP 3, PCB 5 mg/kg; gleitender Mittelwert der letzten vier Untersuchungen, Einzelwert bis 25 % darüber); UBA-Lager 51,7 Mrd. t (2010); 1 t Holz ≈ 1,8 t CO₂; NIR nach ISO 20473 ab 780 nm.

**Befunde:** keine.

**F-Freigabe-Stellen:** Anhang-II-Werte am Verordnungstext bestätigen (öffentliche Bestätigung in dieser Sitzung nicht mehr möglich).

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 16. PFAS in Baustoffen (`pfas_baustoffe`)

**Prüfumfang:** `src/calc/pfas.ts`, Summenrechner, Fachtext, zwei Beispiele, Grenzen.

**Nachrechnungen:** Beispielprobe (BG 1 ng/l, BG/2): Σ PFAS-20 = 82,5 ng/l (Spanne 77–88), Σ PFAS-4 = 28 ng/l (> 20), Anteil C4–C7 = 67,9 % – Kern identisch. Beispiel 1: x = 8/22 = 0,36; Beispiel 2: 1,0 µg/kg, 0,4 g, rechnerisch 2·10⁷ l bis 20 ng/l – richtig. Die 20 Stoffe und beide Grenzwerte (100 ng/l ab 12.01.2026, 20 ng/l ab 12.01.2028) – richtig.

**Fakten-Stichprobe (Kenntnisstand):** EFSA-TWI 4,4 ng/kg KG/Woche (2020); POP-Listung PFOS 2009, PFOA 2019, PFHxS 2022; REACH-Beschränkungen (EU) 2021/1297, 2024/2462; „PFAS gesamt“ 0,5 µg/l der Richtlinie (EU) 2020/2184 nicht übernommen.

**Befunde:** keine. Hinweis: Die BBodSchV-Prüfwerte für PFAS (Tab. 3) könnten in den Grenzen als weiterer Bewertungsmaßstab genannt werden.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 17. Ressourceneffizienz (`ressourceneffizienz`)

**Prüfumfang:** Bauteil-Simulator und Kosten-Nutzen-Rechner (inline, Lehrwerte), R-Strategien, zwei Beispiele, Grenzen.

**Nachrechnungen:** MCI = 1 − 0,50·0,9 = 0,55; bei X = 2: 0,78 – richtig. Beispiel 2: 2500·1,85·0,35 = 1619 t, 65 Lkw-Fahrten, 35 % – richtig. Simulator: Formeln Zeile für Zeile abgeglichen; Standardplatte 120 m³ (CEM I 310 kg/m³, 110 kg/m³ Stahl · 1,3 kg/kg, 65 km · 0,08 kg/tkm) ergibt 37,2 + 17,2 + 1,5 = 55,9 t CO₂-Äq.

**Befunde**
- **offen – Frage T12-RE-1:** Der Simulator setzt für „RC-Beton“ 50 % der Gesteinskörnung als rezykliert an. Nach DAfStb-Richtlinie sind höchstens 45 Vol.-% (Typ 1) bzw. 35 Vol.-% (Typ 2) zulässig, je nach Expositionsklasse weniger. Auf 45 % (bzw. wählbar) begrenzen?

**Empfehlung:** freigabefähig nach Klärung von T12-RE-1.

- [ ] Modul freigeben

## 18. Rückbau-Checklisten (`rueckbau_checklisten`)

**Nachrechnungen:** Beispiel 1 (850 m³): 13 Mischproben, 52 Einzelproben, 11 Laborproben – richtig (PN 98 Tab. 2, Zeile bis 900 m³). Beispiel 2: 450 m² · 18 kg/m² = 8100 kg, 6 Platten-Bags – richtig.

**Fakten-Stichprobe:** 4. BImSchV § 1 (mehr als zwölf Monate am selben Ort), GefStoffV § 11a, TRGS 519 (2025), KrWG § 14 Abs. 2 (70 %) – richtig.

**Befunde**
- **behoben – T12-RC-1:** Die Formel der Verwertungsquote enthielt nur Recycling und Wiederverwendung, die Erklärung nennt zu Recht auch die sonstige stoffliche Verwertung (einschließlich Verfüllung) nach § 14 Abs. 2 KrWG. Formel ergänzt (wie im Modul Abfälle).

**Empfehlung:** freigabefähig nach Korrektur T12-RC-1.

- [ ] Modul freigeben

## 19. Dauerhaftigkeit – Prinzipien & Übersicht (`dauerhaftigkeit`)

**Prüfumfang:** `content/dauerhaftigkeit/*.json`, Beton-Simulator (`karbonatisierungsLebensdauer`), Metall-Simulator (Abtragsraten), Holz-Simulator (Gebrauchsklassen).

**Nachrechnungen:** Beispiel 1: c_min = max(16; 40; 10) = 40, c_nom = 55 mm – richtig. Beispiel 2: (40/4)² = 100 a, (25/4)² = 39 a (−61 %) – richtig. Preset XC4 (k 1,5, c 40): t_krit = 711 a – Kern identisch. Abtragsraten des Metall-Simulators liegen in allen Kategorien innerhalb DIN EN ISO 9223, Tab. 2.

**Befunde**
- **behoben – T12-DH-1:** „kritische Konzentration ca. 0,40 Gew.-% bezogen auf den Zement“ → Anhaltswert ≈ 0,5 M.-% (objektspezifisch); 0,40 M.-% ist die Herstellungsgrenze Cl 0,40 – so auch in Bauwerksdiagnose und Quiz.
- **behoben – T12-DH-2:** Schutzdauerklasse „L: 2–7 Jahre“ → „bis 7 Jahre“ (DIN EN ISO 12944-1, wie Kern `korrosionsschutz.ts`).
- **behoben – T12-DH-3:** „Luftreinheits-Klasse (ISO 12944)“ → Korrosivitätskategorie (DIN EN ISO 12944-2).
- **behoben – T12-DH-4:** Beton-Simulator: „quadratisches Zeitgesetz“ → Wurzel-t-Gesetz; „Dichte Zemente (C35/45)“ → Betone; „Erhöhter Vorhaltemaß … Schalungspräzision ermöglicht dickere Deckungen“ war sachlich falsch (Δc_dev deckt die Toleranz ab, die Schutzdauer wächst mit c_nom und gesicherter Lage) – neu formuliert.

**Empfehlung:** freigabefähig nach Korrektur T12-DH-1 bis -4.

- [ ] Modul freigeben

## 20. Betonkorrosion (`schadreaktionen_beton`)

**Nachrechnungen:** Beispiel 1: Na₂O-Äq. = 0,25 + 0,658·0,95 = 0,88 M.-%; 3,2 kg/m³ bzw. ≤ 2,2 kg/m³ mit NA-Zement – richtig. Beispiel 2: S_krit = 1/1,09 = 91,7 % – richtig. Sulfattreiben (Monosulfat → Ettringit) und AKR-Gleichung ausgeglichen.

**Fakten-Stichprobe (Kenntnisstand):** NA-Zement ≤ 0,60 M.-% (DIN 1164-10), XF4 w/z ≤ 0,50 und LP ≥ 4,0 %, Alkali-Richtlinie 2013-10, Feuchtigkeitsklassen WO/WF/WA/WS – richtig.

**Befunde:** keine. Hinweis: AKR-Gel-, Riss- und Abstandsfaktor-Simulation sind Lehrmodelle (im Text als solche erkennbar).

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 21. Holzkorrosion (`holzkorrosion`)

**Nachrechnungen:** Beispiel 1: u = (512 − 418)/418 = 22,5 % – richtig. Beispiel 2: 8,4 kg Wirkstofflösung, 10,5 kg/m³ – richtig.

**Fakten-Stichprobe (Kenntnisstand):** Heißluftverfahren ≥ 55 °C über 60 min, Rückschnitt Hausschwamm ≥ 1 m, Spritzwasser 30 cm, Borate nur bis GK 2, Eiche DC 2–4 nach DIN EN 350:2016 – richtig.

**Befunde**
- **behoben – T12-HK-1:** „Bis ca. 30 % (Fasersättigung) … Pilzwachstum ist physikalisch unmöglich oder extrem gehemmt“ widersprach der im Modul genannten Pilzgrenze u = 20 %. Neu: unter etwa 20 % praktisch ausgeschlossen, zwischen 20 % und Fasersättigung möglich.
- **offen – Frage T12-HK-2 (Penetrationsklassen):** Das Modul nennt NP4 „mind. 9 mm“ und NP5 „mind. 20 mm“. Nach meinem Kenntnisstand verlangt DIN EN 351-1 für NP4 mindestens 25 mm seitliche Eindringung und für NP5 die vollständige Durchdringung des Splintholzes. Bitte am Normtext DIN EN 351-1:2023-07 bestätigen (F-Freigabe).

**Empfehlung:** freigabefähig nach Korrektur T12-HK-1 und Klärung von T12-HK-2.

- [ ] Modul freigeben

## 22. Metallkorrosion (`metallkorrosion`)

**Nachrechnungen:** Beispiel 1: 85/2,1 = 40 a (C3), C5 10–20 a – richtig. Beispiel 2: PREN 17,0 + 3,3·2,0 + 16·0,05 = 24,4 bzw. 22,0 + 9,9 + 2,7 = 34,6 – richtig. Rostbildungskette, Malachit- und Aluminiumoxidgleichung ausgeglichen; Pilling-Bedworth-Werte (Al 1,28, Cu₂O 1,68, Fe₂O₃ ≈ 2,1) plausibel.

**Befunde:** keine.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 23. Korrosionsschutz durch Beschichtungen (`korrosionsschutz_beschichtungen`)

**Nachrechnungen:** 85 µm in C3: 40,5 bis 121,4 a → VH; C5 Duplex (f 1,5, t_B 10 a): 30,2 a → VH (f 1,2: 24,1 a → H); 70 µm in C4: 16,7 a – Kern identisch. Abtragsraten (DIN EN ISO 9223 Tab. 2), Schutzdauerklassen und Mindestschichtdicken DIN EN ISO 1461 Tab. 3 – richtig.

**Fakten-Stichprobe (Kenntnisstand):** Gitterschnitt DIN EN ISO 2409 (1/2/3 mm bis 60/120/250 µm), Geltungsbereich ≥ 3 mm Stahldicke, Taupunktabstand 3 K, Sa 2½, Im1–Im4 – richtig.

**Befunde:** keine.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 24. Weitere Organik (`weitere_organik`)

**Nachrechnungen:** Beispiel 1 (Arrhenius, 80 kJ/mol, 20 → 30 °C): Exponent 1,083, Faktor 2,95 – richtig. Beispiel 2 (Faktorenmethode ISO 15686-1): 25·0,96 = 24 a – richtig.

**Fakten-Stichprobe (Kenntnisstand):** RTFOT DIN EN 12607-1, PAV DIN EN 14769 (2,1 MPa, 100 °C), Erweichungspunkt 50/70: 46–54 °C – richtig.

**Befunde:** keine. Hinweis: In `src/modules/WeitereOrganik.tsx` heißt eine Variable `十YearsDegradation` (chinesisches Schriftzeichen im Bezeichner) – technisch gültig, sollte bei Gelegenheit umbenannt werden.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

---

## Offene Fragen zur Entscheidung (Zusammenfassung)

| Nr. | Modul | Frage |
|---|---|---|
| T12-BE-2 | Altbauatlas, Modernisierung | CO₂-Faktor Erdgas im Rechner 0,22 → 0,24 kg/kWh (GModG Anlage 9, Beispiel)? |
| T12-BU-7 | Bauwerksdiagnose (Prüfkatalog) | Rückprall: einzelne Ausreißer streichen oder Messsatz verwerfen (> 20 % mehr als 6 Einheiten vom Median)? |
| T12-HB-1 | Hist. Bauweisen | Schwindbeiwerte Fichte (0,15/0,27) auf DIN-68100-Werte (z. B. tangential 0,36) anheben? |
| T12-RB-4 | Rückbau | Massenkennwerte des Rückbaurechners (1,8–2,0 t je m³ BRI) festlegen; Vorschlag Größenordnung 0,3–0,6 t/m³ |
| T12-AB-5 | Abfälle | Fundstellen „Kataster 120 Jahre“, „Aufbewahrung 30–40 Jahre“, „HMVA-1 ab 50 m³“ |
| T12-RE-1 | Ressourceneffizienz | RC-Anteil im Simulator von 50 % auf höchstens 45 % begrenzen? |
| T12-HK-2 | Holzkorrosion | Penetrationsklassen NP4/NP5 nach DIN EN 351-1 (25 mm bzw. vollständige Splintdurchdringung?) |

## Hinweis Quiz

- Geändert: `qn_bauwerksuntersuchung_1` (k_n = 2,00 statt 1,48; richtige Antwort 28,5 N/mm²; Hinweis in `vorpruefung`). `verified` war bereits `false`.
- Geprüft, unverändert: Fragen zu HBCD, Chlorid-Anhaltswert, Phenolphthalein, Vorhaltemaß und Fasersättigung sind von den Korrekturen nicht betroffen.

## Nachweis der Prüfung

- Unabhängige Nachrechnung: eigenes Python-Skript (eigene Umsetzung der Gleichungen von DIN EN ISO 6946, Gradtagzahlverfahren, DIN EN 1990 Anhang C/D, DIN EN 1996-1-1, EC5, LAGA PN 98, Massenbilanz, TrinkwV-Summen, Zinkabtrag, Wurzel-t-Gesetz); 54 Prüfungen als `tests/modulpruefungTranche12.test.ts`, dazu Prüfung der BBodSchV-Werte im Inhalt.
- Öffentliche Quellen dieser Prüfung: [buzer, Anlage 7 GModG](https://www.buzer.de/Anlage_7_GModG.htm); [buzer, GModG §§ 34–39](https://www.buzer.de/gesetz/14072/b36731.htm); [buzer, § 69 GModG](https://www.buzer.de/69_GModG.htm); [buzer, Inhaltsübersicht GModG](https://www.buzer.de/GModG.htm); [BauNetz Wissen, GModG](https://www.baunetzwissen.de/heizung/fachwissen/verordnungen-gesetze/gebaeudemodernisierungsgesetz-gmodg-10443988); [Forum Verlag, DIN 18202](https://forum-verlag.com/fachwissen/bau-und-gebaeudemanagement/din-18202/); [Datenblatt Leica BLK360 G2](https://www.arctron.de/wp-content/uploads/2023/05/Leica-BLK360-G2_Datenblatt.pdf); [Bayern.Recht, Art. 20 BayDSchG](https://www.gesetze-bayern.de/Content/Document/BayDSchG-20); [rulecalc, § 7i EStG](https://rulecalc.com/de/immobilien/estg-7i-absetzungen-baudenkmal); [DIN, DIN 1076:2026-01](https://6sku3uaup9f9.din.de/en/standard/din-1076/394559449); [DIN Media, DIN EN 12504-1](https://www.dinmedia.de/de/norm/din-en-12504-1/332723593); [DIN Media, DIN EN 12504-2](https://www.dinmedia.de/en/standard/din-en-12504-2/335978574); [DIN, DIN EN 12504-4](https://6sku3uaup9f9.din.de/en/standard/din-en-12504-4/335410052); [Understanding Cement, Carbonation](https://www.understanding-cement.com/carbonation.html); [ISO 12571, Leseprobe](https://cdn.standards.iteh.ai/samples/2408/034d346436884759aaeee0d823b48dff/ISO-12571-2000.pdf); [core.ac.uk 159145941](https://core.ac.uk/download/159145941.pdf); [Hausjournal, Holz und Feuchtigkeit](https://hausjournal.net/ausdehnung-holz-feuchtigkeit); [lxgesetze, § 5a GefStoffV](https://lxgesetze.de/gefstoffv/5a); [umwelt-online, TRGS 519 Änderung 28.01.2025](https://umwelt-online.de/recht/t_regeln/trgs/trgs500/z25_0144.htm); [Forum Verlag, TRGS 519](https://forum-verlag.com/fachwissen/arbeitsschutz/trgs-519/); [LAGA, HBCD](https://www.laga-online.de/documents/11-hbcd_2_1717078546.pdf); [BauNetz Wissen, Recyclingbeton](https://www.baunetzwissen.de/beton/fachwissen/betonarten/recyclingbeton-930267); [umwelt-online, LAGA PN 98 Teil 2](https://umwelt-online.de/recht/abfall/laga/pn98b.htm); [Gesetze im Internet, Anlage 1 EBV](https://www.gesetze-im-internet.de/ersatzbaustoffv/anlage_1.html); [Gesetze im Internet, Anlage 2 BBodSchV](https://www.gesetze-im-internet.de/bbodschv_2023/anlage_2.html); [LfU Bayern, FAQ EBV](https://www.lfu.bayern.de/abfall/ersatzbaustoffverordnung/faq_ersatzbaustoffverordnung/doc/faq_ebv_druckversion_nicht_bf.pdf); [EUWID, EBV-Novelle 2023](https://www.euwid-recycling.de/news/politik/bundesrat-beschliesst-ebv-novelle-ohne-weitere-aenderungen-100723/); [Bauindustrie, PM 15.12.2025](https://www.bauindustrie.de/fileadmin/bauindustrie.de/Media/Pressemitteilungen/PM_2025/2025-12-15_PM_Novelle_EBV_final.pdf); [Lobbyregister, RV0028510](https://www.lobbyregister.bundestag.de/media/a4/72/848515/Lobbyregister-Regelungsvorhaben-Detailansicht-RV0028510-2026-09-28_09-10-45.pdf).
