# Nachstichprobe 5a (02.11.2026) – 25 bisher nicht nachgeprüfte freigegebene Module (ungerade Positionen)

**Stand:** 02.11.2026 (Branch `pruefung/nachstichprobe5a-11-02`, Basis origin/main bfc156b0)
**Status:** Bericht zur Kenntnis und Entscheidung – keine Prüfvermerke geändert, keine Quizfrage geändert.
**Auftrag:** Fortsetzung der Fehlerquotenmessung an den freigegebenen Modulen, die weder in einer der vier Nachstichproben (`nachstichprobe-2026-10-29.md`, `nachpruefung2-2026-10-29.md`, `nachstichprobe3-2026-10-30.md`, `nachstichprobe4-2026-11-02.md`) noch in der Gegenprüfung (`gegenpruefung-2026-10-30.md`) waren. Teil a: ungerade Positionen der alphabetisch sortierten Restliste; die geraden Positionen prüft ein zweiter Durchgang (Nachstichprobe 5b). Prüfumfang wie Nachstichprobe 4.

## Vorgehen

- **Grundgesamtheit:** Fachmodule mit Status `geprueft` in `src/data/pruefvermerke.ts` (143) ohne die 70 Module der Nachstichproben 1–4 (Tabellen „Gezogene Module“ bzw. „Auswahl“, alle 70 sind freigegeben) und ohne die zehn Module der Gegenprüfung (`lca_rechner`, `oekobilanz_lca`, `boden_materialaufbereitung`, `bim_baustoffe`, `spannbeton_grundlagen`, `regularien`, `bauschaeden`, `sonderbetone`, `materialmodelle`, `schadstoffe`): **66 Module** (= 86 der Nachstichprobe 4 abzüglich ihrer 20).
- **Auswahl:** Restliste alphabetisch nach Modul-ID (Python `sorted`, Unterstrich vor Buchstaben), davon die Positionen 1, 3, 5, …, 49 – **25 Module** (Obergrenze 25 erreicht; die ungeraden Positionen 51–65 bleiben offen). Keine Schichtung, keine Zufallsziehung; die Auswahl ist damit vollständig reproduzierbar, aber nicht nach Fachgebiet gewichtet. Skript `scratchpad/ns5a/auswahl.py` (Sitzungsablage, nicht im Repository).
- **Prüfung je Modul:** (a) Bezugsgrößen und Einstufungen in Beispielen, (b) Norm-, Teil-, Tabellen-, Abschnitts- und Ausgabenzuordnungen (Normen-Registry `src/data/centralNormenRegistry.ts`, Stand 10/2026), (c) Kennwerte gegen die zentralen Konstanten (`gwpLehrwerte.ts`, `zementGwp.ts`, `kennwerte.ts`, `holzphysik.ts`, `CONCRETE`, EC2-Tabelle 3.1); dazu der Fließtext und **alle Quizfragen des Moduls** gegen den Modultext und sinngemäß (Bereichsgrenzen, Klassenzuordnungen, Rundung). Ergänzungsbogen `docs/pruefung/kennwert-abgleich/<modul>.md` frisch erzeugt (`node scripts/qa/kennwert-abgleich.mjs --ausgabe …`) als Prüfauftrag; für `holzbau_bemessung`, `ki_lokal` und `ki_system` liegt keiner vor (eigene Durchsicht der Teilkomponenten `HolzbauBemessung`, `LokaleKI`, `Systemarchitektur`). Zusätzlich `node scripts/qa/quiz-text-abgleich.mjs --json` (#296) als Prüfliste: seine Treffer für die 25 Module (vor allem W- und A-Hinweise) sind durchgesehen; keiner war ein Fehler.
- **Nachrechnung:** jede Beispielrechnung und jede rechnende Quizfrage mit eigenem Skript (`scratchpad/ns5a/nachrechnung.py`): **198 Nachrechnungen, davon 197 gegen einen im Modul genannten Wert** – 195 im Rundungsrahmen, 2 Abweichungen (NS5A-DV-1, Frage NS5A-LK-1). Regressionstest `tests/nachstichprobe5a.test.ts` über 15 Rechenkerne.
- **Zählregel wie in Nachstichprobe 1–4:** ein Modul zählt als fehlerhaft, wenn der Modulinhalt mindestens eine eindeutig falsche fachliche Aussage, Einstufung oder Zuordnung enthält. Fragen und redaktionelle Punkte zählen nicht; Quiz-Erklärungen, die dem Modultext widersprechen, werden getrennt ausgewiesen.
- **Quellen:** drei Websuchen (GModG Anlage 7 Nummerierung, BauPVO-Übergangsfristen EAD/ETA, § 4 Abs. 5 BBodSchV), abgerufen nur Seiten aus den Suchergebnissen ([buzer.de, Anlage 7 GModG](https://www.buzer.de/Anlage_7_GModG.htm), [DIBt, Übergangsregeln ETA-Weg](https://www.dibt.de/en/service/faqs/transitional-rules-for-the-eta-route), [gesetze-im-internet.de, § 4 BBodSchV](https://www.gesetze-im-internet.de/bbodschv_2023/__4.html)); sonst Nachrechnung und Kenntnisstand. Normtexte wurden nicht abgeschrieben.

## Ausgewählte Module (Begründung: ungerade Position der alphabetischen Restliste)

| Pos. | Modul | Pos. | Modul | Pos. | Modul |
|---|---|---|---|---|---|
| 1 | `abfaelle` | 19 | `bp_trockenbau` | 37 | `ki_lokal` |
| 3 | `analytik` | 21 | `bruchmechanik` | 39 | `ki_system` |
| 5 | `baustatik` | 23 | `daemmung_vergleich` | 41 | `korrosion` |
| 7 | `beton_a_z` | 25 | `dpp` | 43 | `labor_auslagerung` |
| 9 | `bp_beton` | 27 | `festbeton` | 45 | `labor_moertelprismen` |
| 11 | `bp_daemmung` | 29 | `glas` | 47 | `lebenszyklus_kosten` |
| 13 | `bp_innovationen` | 31 | `historische_bauprodukte` | 49 | `materialpaesse` |
| 15 | `bp_mineralisch` | 33 | `holzbau_bemessung` | | |
| 17 | `bp_recht_avcp` | 35 | `innovative_werkstoffe` | | |

Die geraden Positionen 2–48 (`altholz_urban_mining`, `ausbau`, `bestand`, `betonkennwerte`, `bp_betonfertigteile`, `bp_holzprodukte`, `bp_kunststoffe`, `bp_putz_estrich`, `bp_stahlbauprofile`, `bp_verkehr_asphalt`, `daemmstoffe`, `denkmalpflege`, `einheiten`, `festigkeit`, `herstellung_einbau`, `historische_bauweisen`, `holzwerkstoffe`, `keramik_ziegel`, `ki_ressourcen`, `kombinationen`, `kreislauf_dpp`, `labor_druckfestigkeit`, `lca_regulatorik`, `materialkennwerte`) gehören zu Teil b.

## Ergebnis

| Modul | Befund | Art | Gewicht | Status |
|---|---|---|---|---|
| `daemmung_vergleich` | NS5A-DV-1 Temperaturfaktor mit R_si = 0,25 gegen ein R_T gerechnet, das R_si = 0,13 enthält: „1 − 0,25/0,71 = 0,65“ statt 1 − 0,25/0,83 = 0,698 | (a) Rechnung | gering (Nachweisentscheidung „< 0,70“ unverändert, aber nur knapp) | behoben |
| `abfaelle` | NS5A-AB-1 Bodenkundliche Baubegleitung „bei Bodenbewegungen ≥ 3000 m³“ und als „Pflicht“ – § 4 Abs. 5 BBodSchV nennt eine Fläche von mehr als 3000 m², und die Behörde *kann* sie verlangen | (a) Bezugsgröße | gering | behoben |
| `dpp` | NS5A-DPP-1 BauPVO-Übergang „alte EAD bis 08.01.2031, ETA bis 08.01.2036“ – richtig 09.01.2031 und 09.01.2036 (so auch `bp_recht_grundlagen` und das DIBt) | (b) Fristzuordnung | gering | behoben |
| `bp_recht_avcp` | NS5A-RA-1 Audit-Testing „zieht zufällige Kontrollproben aus Verkaufsregalen“ – nach VO (EU) 305/2011 Anhang V Nr. 1.1 entnimmt die Produktzertifizierungsstelle die Proben im Werk oder Lager des Herstellers vor dem Inverkehrbringen (die Tabelle desselben Reiters sagt es richtig) | (e) Fließtext | gering | behoben |
| `bp_trockenbau`, `innovative_werkstoffe` | NS5A-TB-1, NS5A-IW-1 Dezimalpunkt statt Komma („0.90“, „1.3“, „0.15 bis 0.18“) | redaktionell | – | behoben |
| `bp_innovationen`, `lebenszyklus_kosten` | Fragen NS5A-BI-1 (TRL-Zuordnung im Reifegrad-Check), NS5A-LK-1 (GWP des EPS-WDVS im LCC-Szenario) | Frage | – | offen |
| übrige 21 Module | – | – | – | ohne Befund |

**Quiz:** Alle 139 Quizfragen der 25 Module (23 Module mit Fragen; `beton_a_z` und `bp_recht_avcp` haben keine eigenen) gegen Modultext und sinngemäß geprüft – **keine Quiz-Erklärung widerspricht dem Modultext**, keine Frage ist durch die Korrekturen falsch geworden. Die rechnenden Fragen stimmen alle (eigene Nachrechnung). Hinweis: `qn_bp_innovationen_2` folgt der Rechnerlogik, die Frage NS5A-BI-1 betrifft.

**Fehlerquote (Modulinhalt, Zählregel wie Nachstichprobe 1–4): 4 von 25 Modulen = 16 %** (95-%-Vertrauensbereich nach Wilson **6 % bis 35 %**). Quiz-Erklärungen: 0 von 23 Modulen mit Widerspruch.

| Stichprobe | Module mit Fachfehler | Quote | Wilson 95 % |
|---|---|---|---|
| Nachstichprobe 1 (29.10.) | 4 von 15 | 27 % | 11 – 52 % |
| Erweiterte Nachprüfung 2 (29.10.) | 5 von 15 | 33 % | 15 – 58 % |
| Nachstichprobe 3 (30.10., nach Durchsicht A–D) | 4 von 20 | 20 % | 8 – 42 % |
| Nachstichprobe 4 (02.11., geschichtet) | 1 von 20 | 5 % | 1 – 24 % |
| **Nachstichprobe 5a (02.11., ungerade Positionen)** | **4 von 25** | **16 %** | **6 – 35 %** |
| Nachstichprobe 4 und 5a zusammen | 5 von 45 | 11 % | 5 – 23 % |

- Gegenüber Nachstichprobe 1–4 zusammen (14 von 70 = 20 %) ist kein Unterschied nachweisbar (exakter Test nach Fisher, zweiseitig p = 0,77; einseitig „gesunken“ p = 0,46), ebenso wenig gegenüber Nachstichprobe 1–3 (13 von 50, zweiseitig p = 0,39) oder Nachstichprobe 4 allein (zweiseitig p = 0,36). Der niedrige Wert der Nachstichprobe 4 (5 %) bestätigt sich nicht; beide Stichproben aus demselben Restbestand ergeben zusammen 11 %.
- Bei einer wahren Quote von 10 % träten 4 oder mehr Fehlermodule unter 25 mit 24 % Wahrscheinlichkeit auf, bei 5 % mit 3 %; bei 20 % träten 4 oder weniger mit 42 % auf, bei 30 % mit 9 %. Die 10-%-Schwelle ist mit dem Punktschätzer nicht erreicht, aber nicht ausgeschlossen.
- **Art der Fehler:** wie in den Nachstichproben 1–4 nie im Rechenkern, sondern in Fließtext und Beispielen: eine falsch eingesetzte Bezugsgröße in einer Hand-Rechnung (DV-1), eine falsche Einheit einer Rechtsschwelle (AB-1), ein um einen Tag verschobenes Fristdatum (DPP-1) und eine überzeichnete Prozessbeschreibung, die der eigenen Tabelle widerspricht (RA-1). Drei der vier betreffen **Rechts- und Normzuordnungen außerhalb der zentralen Konstanten** – hier greifen weder `kennwert-abgleich.mjs` noch `quiz-text-abgleich.mjs`.
- **Rechenkerne und Rechnerstandards fehlerfrei:** alle 15 im Test abgedeckten Kerne liefern die eigenen Sollwerte.
- **Gewichtige Fehler (Rechenergebnis oder Nachweisentscheidung falsch): keine.** Kein Anlass für die Rücknahme eines Prüfvermerks.
- **Vorschlag:** Datums- und Schwellenangaben aus Rechtsquellen (BauPVO, BBodSchV, EBV, GModG, TrinkwV, GefStoffV) app-weit einmal gegen eine zentrale Fristen-/Schwellenliste abgleichen, analog zu den zentralen Kennwerten (z. B. `src/data/rechtsfristen.ts` mit Quelle je Eintrag und einem Prüfskript wie `kennwert-abgleich.mjs`).

## Befunde je Modul

### 1. Abfälle (`abfaelle`, Teile Abfälle, Altlasten, AVV, Checklisten, Deponie, EBV, LAGA PN 98)
**Nachrechnungen:** Beispiel 1 Deponieklasse: Sulfat 1450 > 100, Chlorid 120 > 80, Blei 0,08 > 0,05 mg/l → nicht DK 0; Sulfat ≤ 2000, Chlorid ≤ 1500, Blei ≤ 0,2 mg/l, TOC 0,6 ≤ 1, Glühverlust 2,4 ≤ 3 M.-% → DK I; Beispiel 2: V = 1200 · 0,25 = 300 m³ ≥ 250 m³ → anzeigepflichtig nach § 22 EBV, Voranzeige vier Wochen vorher, Abschlussanzeige binnen zwei Wochen; Quiz `q_ab_1` (DK I) – richtig.
**(a)/(b):** DepV Anhang 3 Tabelle 2 (DK 0/I/II-Werte, TOC 1/1/3 %), Anhang 1 Tab. 1 (geologische Barriere k_f ≤ 1 · 10⁻⁷ m/s DK 0, ≤ 1 · 10⁻⁹ m/s DK I–III, ≥ 1 m, DK III ≥ 5 m), mineralische Dichtung ≥ 50 cm, k_f ≤ 5 · 10⁻¹⁰ m/s; LAGA PN 98 Tab. 2 (8/16/40 Einzelproben bis 30/100/600 m³); EBV § 19 Abs. 6–8, § 22 (250 m³, RC-3, BM-F3, BG-F3); GewAbfV § 8 (zehn Fraktionen; 90-%-Quote nur für Siedlungsabfälle); NachwV § 2 Abs. 2 (2 t/a), § 25 (3 Jahre); Eluat 1 : 10 über 24 h; BBodSchV-PFAS-Prüfwerte (PFOA/PFOS/PFHxS 0,1 µg/l) – richtig.
- **behoben – NS5A-AB-1 (a):** Reiter Altlasten, „2. Bodenkundliche Baubegleitung (BBB) Pflicht“ mit „Gesetzlich empfohlen und oft baurechtlich erzwungen bei Bauvorhaben mit Bodenbewegungen ≥ 3000 m³“. § 4 Abs. 5 BBodSchV: Bei Vorhaben, die auf einer Fläche von mehr als 3000 m² Material auf- oder einbringen, Ober- oder Unterboden abtragen oder den Boden verdichten, *kann* die Behörde im Einzelfall eine BBB nach DIN 19639 verlangen ([gesetze-im-internet.de](https://www.gesetze-im-internet.de/bbodschv_2023/__4.html)). Neu: Fläche > 3000 m², „kann … verlangen (§ 4 Abs. 5 BBodSchV)“, Überschrift ohne „Pflicht“ (`content/abfaelle/Altlasten.json`). Die übrigen 3000-m³-Angaben der App (LfU-Untersuchungseinheit in `boden_materialaufbereitung`, `rechnerGrenzen.ts`) sind Volumina und richtig.

### 2. Analytik (`analytik`)
**Nachrechnungen:** Beispiel 1 w_CH = 2,5 · 74,1/18,0 = 10,3 M.-%; Beispiel 2 Washburn r = 0,743 N/m / 10⁷ Pa = 74 nm (Faustformel 7430 nm·bar); Beispiel 3 Bragg d = 0,15406/(2 · sin 13,3°) = 0,335 nm (Quarz (101)); Quiz `q_an_2` 12,3 M.-% (Distraktor 6,8 mit 100,1/44,0) – richtig.
**(b):** DIN EN 14629:2007-06, DIN ISO 15901-1:2019-03, DIN EN 13925-1:2003-07, Chloridklassen Cl 0,40/Cl 0,20 bezogen auf Zement (Neubeton), TGA-Stufen (Portlandit 400–500 °C, Calcit 600–800 °C), MIP bis etwa 4000 bar, NIR 780–2500 nm – richtig. Ohne Befund.

### 3. Baustatik (`baustatik`)
**Nachrechnungen:** Beispiel 1 A = 63,3, B = 46,7 kN, V-Sprung 43,3/−6,7 kN, M_max = 106,7 kNm; Beispiel 2 M_B = −62,5 kNm, A = C = 37,5, B = 125 kN = 1,25 · q · l; Dreigelenkrahmen H = 20 kN, |M_Ecke| = 80 kNm; Quiz 45 kNm, Kragarm 66 kNm/34 kN, Einzellast 40 kN/80 kNm, Zweifeldträger 250 → 62,5 kNm (Feld 35,2 kNm) – richtig (Kerne `traeger`, `dreigelenkrahmen`).
**(b):** DIN EN 1990:2021-10, DIN EN 1991-1-1:2010-12, DIN EN 1993-1-1:2010-12 + A1 (eingeführt) mit Hinweis auf die neue Generation – richtig. Ohne Befund.

### 4. Beton A–Z (`beton_a_z`)
**Nachrechnungen:** Kapillarporosität nach Powers p = (w/z − 0,36)/(w/z + 0,32): 5,6 / 11,7 / 17,1 / 26,1 % für w/z 0,40 / 0,45 / 0,50 / 0,60 – passt zu „≤ 6 %“, „12–17 %“, „≥ 26 %“; f_ctm 1,6/2,2/2,6/2,9/3,8 N/mm²; c_nom = c_min,dur + Δc_dev (XC1 10 + 10 = 20, XC2/XC3 20 + 15 = 35, XC4 25 + 15 = 40, XD1/XD3 40 + 15 = 55 mm) – richtig.
**(a)/(b):** Konsistenzklassen F1–F6, Powers/Copeland/Mann (Kapillarporen unterbrochen nach 14 d bei 0,50, 6 Monaten bei 0,60, nicht mehr über 0,70), Instandsetzungsprinzipien 3/7/10/11 nach DIN EN 1504-9, Haftzug ≥ 1,5 N/mm², Erstprüfung DIN 1045-2 Anhang A – richtig. Kein Quiz. Ohne Befund.

### 5. Beton als Bauprodukt (`bp_beton`)
**Nachrechnungen:** f_ck = 38,5 − 1,645 · 5,0 = 30,3 N/mm² ≥ 30 (Zylinder; Würfel gegen 37 – richtige Bezugsgröße); Quiz w/z = 175/350 = 0,50 ≤ 0,55 (XD1) – richtig.
**(b):** Beton nach Eigenschaften/Zusammensetzung, Ü-Zeichen auf dem Lieferschein, Kriterium f_cm ≥ f_ck + 4 bei n = 3 – richtig. Ohne Befund.

### 6. Dämmstoffe als Bauprodukt (`bp_daemmung`)
**Nachrechnungen:** WDVS-Wand Σ d/λ = 0,029 + 0,177 + 4,571 + 0,014 = 4,79, R_T = 4,96 m²K/W, U = 0,20 W/(m²K) ≤ 0,24; Quiz Dämmdicke (1/0,24 − 0,39) · 0,035 = 13,2 cm – richtig.
**(b)/(c):** Höchstwerte Anlage 7 GModG (Außenwand 0,24, Steildach Nr. 5a/5b 0,24, Flachdach 0,20, Kellerdecke 0,30; Nummerierung bestätigt durch [buzer.de](https://www.buzer.de/Anlage_7_GModG.htm)), Produktnormen DIN EN 13162–13171, 14063-1, 14306, 15101-1, ETA-17/0247 Baustroh, Kurzzeichen nach DIN 4108-10, VIP 0,004–0,008 (perforiert 0,020), Aerogel 0,013–0,018 W/(m·K) – richtig. Ohne Befund.

### 7. Bauprodukt-Innovationen (`bp_innovationen`)
**Nachrechnungen:** A_s = 100 000/435 = 230 mm², A_f = 100 000/1200 = 83 mm², Verhältnis 2,8; Quiz 150 kN: 345 bzw. 125 mm²; Karbonatisierungsenthalpie aus Bildungsenthalpien −113 kJ/mol (Modul „ca. −114“) – richtig.
**(b):** ISO 16290:2013, § 634a BGB (5 Jahre), VOB/A § 7, MBO §§ 16a–25, abZ/aBG/vBG/ZiE, AVCP 1+ bis 4 und 3+, VO (EU) 2024/3110 – richtig.
- **offen – Frage NS5A-BI-1 (a):** Der Reifegrad-Check ordnet das Kriterium „im industriellen Mischer in realistischer Losgröße (ab 1 m³) hergestellt“ TRL 6 zu; die TRL-Tabelle desselben Moduls beschreibt genau diesen Schritt („Hochskalierung … auf den 1-m³-Mischer“) als TRL 5 und erst die „Herstellung realer Bauteile im Werk“ als TRL 6. Quiz `qn_bp_innovationen_2` folgt dem Rechner (TRL 6). Die Zuordnung ist eine Lehrkonvention (ISO 16290 definiert nur die Reifegrade), aber innerhalb des Moduls uneinheitlich. **Vorschlag:** Kriterium 3 auf „Scale-up im Werk und reale Bauteile gefertigt (TRL 6+)“ erweitern; dann bleiben Rechner und Quiz unverändert.

### 8. Mineralische Bauprodukte (`bp_mineralisch`)
**Nachrechnungen:** Steingut 20 · 0,008 · 1900 · 1,15 = 350 kg, Feinsteinzeug 20 · 0,008 · 2400 · 1,005 = 386 kg, Wasser 46 bzw. 2 kg; Quiz Steinzeug 25 · 0,010 · 2300 · 1,025 = 589 kg – richtig (Kern `belagMasse`).
**(b):** DIN 18008, DIN EN 12150 (ESG 120 N/mm²), DIN EN ISO 12543, DIN EN 14411 (Feinsteinzeug ≤ 0,5 %), C2 S1 nach DIN EN 12004, PVB ≥ 0,76 mm bei Absturzsicherung – richtig. Ohne Befund. Hinweis: Das Beispiel rechnet Feinsteinzeug mit ρ = 2400 kg/m³ und 0,5 %, der Rechner mit 2450 kg/m³ und 0,2 % (beides Lehrwerte, kein Widerspruch in der Sache).

### 9. Bauprodukte: AVCP-Systeme (`bp_recht_avcp`, Reiter „avcp“ von `BpRechtliches`)
**(a)/(b):** Systemzuordnungen und Beispiele (Zement 1+, Rauchwarnmelder/Feuerschutzabschlüsse/BSH 1, Mauersteine Kat. I/Gesteinskörnungen nach DIN EN 12620/sortiertes Bauholz 2+, Wärmedämmstoffe/Gipsplatten 3, System 3+ für Umweltmerkmale nach VO (EU) 2024/3110 Anhang IX, Beton/Betonstahl/Spannstahl national ohne CE) – richtig. Kein Quiz mit dieser Modul-ID.
- **behoben – NS5A-RA-1 (e):** „… und zieht zufällige Kontrollproben aus Verkaufsregalen (Audit-Testing)“. Audit-Testing (nur System 1+) sind Stichproben, die die Produktzertifizierungsstelle im Herstellerwerk oder im Lager des Herstellers vor dem Inverkehrbringen entnimmt (VO (EU) 305/2011 Anhang V Nr. 1.1); Proben aus dem Handel sind Marktüberwachung. Die Tabelle desselben Reiters („Stichprobenprüfung von vor dem Inverkehrbringen entnommenen Proben“) war richtig. Neu entsprechend (`content/bprechtliches/BpRechtliches.json`).

### 10. Trockenbau (`bp_trockenbau`)
**Nachrechnungen:** f₀ = 50 · √(0,2/0,075) = 82 Hz einfach, 50 · √(0,1/0,075) = 58 Hz doppelt beplankt (Faktor √2); Vorfaktor 60 (Luft) aus √(ρc²)/(2π); Kristallwasser 2 · 18/172 = 21 M.-%; Quiz Platten 30 · 2 · 2 · 1,05 = 126 m², Spachtel 54 kg – richtig (Kern `trockenbauBedarf`).
**(b):** DIN 18181 (Schraubenabstand 750/250 mm, Fugenversatz ≥ 400 mm), DIN 18182, DIN EN 520 (H2 ≤ 10 %), DIN EN 14195, DIN EN 15283-2, DIN 18948, Q2 als Standard nach IGG-Merkblatt 2, Systemdicken W111 75 mm/W112 100 mm/W115 155 mm – richtig.
- **behoben – NS5A-TB-1 (redaktionell):** „α_w bis 0.90“ → „0,90“.

### 11. Bruchmechanik (`bruchmechanik`)
**Nachrechnungen:** σ_c = 0,75/(1,12 · √(π · 5 · 10⁻⁴)) = 16,9 MPa; K_I = 1,12 · 200 · √(π · 0,010) = 39,7 MPa√m, η = 2,5; Quiz Glas K_I = 0,63, η = 1,19; Stahl K_I = 36,5, η = 2,7 – richtig.
**(b):** LEBM nach Irwin, Hillerborg/G_F (fib Model Code 2010), RILEM TC 50-FMC, ISO 12135:2021, Gütegruppen nach DIN EN 1993-1-10, f_g,k Float 45 MPa – richtig. Ohne Befund.

### 12. Innen- vs. Außendämmung (`daemmung_vergleich`)
**Nachrechnungen:** Beispiel 1 R_T = 0,71, θ_si = 15,4 °C, gedämmt R_T = 2,21, θ_si = 18,5 °C, Grenzschicht innen 1,5 °C bzw. außen 12,4 °C; Beispiel 2 p = 1169 Pa, p_sat,min = 1461 Pa, θ_si,min = 12,6 °C, f_Rsi = 0,70; Quiz −1,1 °C – richtig.
- **behoben – NS5A-DV-1 (a):** Erläuterung zu Beispiel 2: „Für den Nachweis nach DIN 4108-2 ist f_Rsi mit R_si = 0,25 zu rechnen: … f_Rsi = 1 − 0,25/0,71 = 0,65 < 0,70 … Mit 6 cm Dämmung 1 − 0,25/2,21 = 0,89.“ Die 0,71 bzw. 2,21 m²K/W sind R_T mit R_si = 0,13 aus Beispiel 1; mit R_si = 0,25 ist R_T = 0,25 + 0,54 + 0,04 = 0,83 bzw. 2,33 m²K/W. Richtig: f_Rsi = 1 − 0,25/0,83 = 0,698 < 0,70 (knapp verfehlt) und gedämmt 1 − 0,25/2,33 = 0,89. Die Aussage (ungedämmt nicht erfüllt, gedämmt erfüllt) bleibt, nur der Abstand zur Grenze war deutlich überzeichnet (`content/daemmungvergleich/DaemmungVergleich.json`).
**(b):** DIN EN ISO 6946:2018-03, DIN 4108-2:2013-02 (Hinweis auf 2026-05 vorhanden), DIN 4108-3:2024-03, DIN EN ISO 13788, DIN EN 15026, WTA 6-4/6-5 – richtig.

### 13. Digitaler Produktpass und EPD (`dpp`)
**Nachrechnungen:** Beispiel 1 GWP_A–C = 250 + 5 + 2 = 257 kg CO₂e, D separat; Beispiel 2 PENRT = 1800 + 200 = 2000 MJ; BSH-Muster 0,8 · (−680) = −544 kg (biogen −790 nach DIN EN 16449 bei 480 kg/m³); Quiz 335 kg CO₂e, PENRT 2750 MJ – richtig.
**(b):** ESPR (EU) 2024/1781 (13.06./18.07.2024), Arbeitsplan 16.04.2025, Batteriepass ab 18.02.2027, BauPVO in Kraft 07.01.2025/anwendbar 08.01.2026, DIN EN 15804:2022-03, AAS nach DIN EN IEC 63278-1, IPCC AR5 (CH₄ 28, N₂O 265) – richtig.
- **behoben – NS5A-DPP-1 (b):** „alte EAD bis 08.01.2031, darauf gestützte ETA bis 08.01.2036“ → 09.01.2031 und 09.01.2036 (DIBt: EADs nach VO 305/2011 bis 9. Januar 2031 als Grundlage neuer ETA, diese ETA bis 9. Januar 2036 als Grundlage der CE-Kennzeichnung, [DIBt](https://www.dibt.de/en/service/faqs/transitional-rules-for-the-eta-route); `bp_recht_grundlagen` nennt bereits 09.01.). Die Angabe „VO 305/2011 spätestens bis 08.01.2040“ für hEN steht gleichlautend in `bp_recht_grundlagen` und wurde nicht geändert.

### 14. Festbeton (`festbeton`)
**Nachrechnungen:** Klassentabelle C12/15–C90/105 gegen EC2 Tab. 3.1 (f_ctm, f_ctk,0,05, f_ctk,0,95, E_cm, ε-Werte) und C100/115 aus den Tabellenformeln – alle Werte richtig (C8/10 als Lehrwert gekennzeichnet); β_cc(7) = e^(−0,25) = 0,78, f_cm(7) = 29,6 N/mm²; Konformität stetig 30 + 1,48 · 3,0 = 34,4 ≤ 36,0 und 27,5 ≥ 26 (Würfel gegen f_ck,cube – richtige Bezugsgröße); Quiz 32,2 N/mm², β(7) 0,82/0,78/0,68, Erstherstellung 33,7 < 34 – richtig (Kern `festigkeitsentwicklung`).
**(b):** DIN EN 206:2021-06, DIN 1045-2:2023-08, DIN EN 1992-1-1:2011-01 mit NA, DIN EN 12390-2 NA.2 (0,92/0,95), LC-Klassen und D-Klassen, η₁/η_E nach EC2 11.3 – richtig. Ohne Befund.

### 15. Glas (`glas`)
**Nachrechnungen:** σ_T = 70 000 · 9 · 10⁻⁶ · 40 = 25 N/mm² (60 K: 38 N/mm²); Quiz 18,9 N/mm², h_ef ohne Schubverbund ∛(2 · 8³) = 10,1 mm – richtig (Kern `effektiveDickeW`).
**(b):** DIN 18008-1/-2:2020-05 (γ_M 1,8 Float, 1,5 vorgespannt; k_mod 0,25/0,40/0,70; k_c 1,8), Schubverbund in DE grundsätzlich nicht ansetzbar, DIN EN 16612:2019-12, Thermobruch Float 40 K/TVG 100 K/ESG 200 K (wie NS-DH-1) – richtig. Ohne Befund.

### 16. Historische Bauprodukte (`historische_bauprodukte`)
**Nachrechnungen:** Beispiel 1 PCB 1400 > 800 ng/m³ (AIR-Richtwert II), nach PCB-Richtlinie 1994 zwischen 300 und 3000; Beispiel 2 Blei 25 > 10 µg/l – richtig.
**(b)/(e):** TrinkwV 2023 § 17 (Bleileitungen bis 12.01.2026), Grenzwert Blei ab 12.01.2028 5 µg/l, Reichsformat 25 × 12 × 6,5 cm, Gusseisen C > 2 %, Schweißeisen C < 0,1 %, Thomasstahl, Hennigsdorfer Spannstahl St 140/160 mit Handlungsanweisung SpRK (BMVBS 2011), KMF vor 1996 (KI < 40, TRGS 521), Tobermorit-Formel, Al-Alkali-Reaktion und PVC-Dehydrochlorierung stöchiometrisch richtig – richtig. Die beiden Quizfragen `q_hp_1`, `q_hp_2` stehen bereits auf `verified: false` (frühere Umsetzung). Ohne Befund.

### 17. Holzbau: Bemessung (`holzbau_bemessung`, Teil `HolzbauBemessung`)
**Nachrechnungen:** Beispiel C24 120/160 mm, l = 3,0 m: i_z = 34,6 mm, λ_z = 86,6, λ_rel = 1,47, k = 1,70, k_c = 0,39, N_Rd = 97,6 kN ≥ 50 kN (51 %), ohne Knicken 248 kN; Quiz f_c,0,d GL24h 16,6 N/mm², Kragstütze l_ef = 5,6 m, λ_rel = 1,27 bei 2,6 m, N_Rd = 124 kN, Querdruck F_c,90,Rd = 34,6 kN – richtig (Kerne `bemesseDruckstab`, `bemesseQuerdruck`).
**(b):** DIN EN 1995-1-1 mit NA 6.3.2 (β_c 0,2/0,1), 6.1.5 (k_c,90 1,25/1,5 bzw. 1,5/1,75 mit l ≤ 400 mm, l_ef = l + 30 mm je Seite), Euler-Fälle β = 2,0/1,0/0,7/0,5 – richtig. Ohne Befund.

### 18. Innovative Werkstoffe (`innovative_werkstoffe`)
**Nachrechnungen:** 3D-Druck ρgH = 2100 · 9,81 · 2,0 = 41 202 Pa, τ_req = 23 788 Pa ≈ 23,8 kPa; Quiz 18,7 kPa (1,5 m), Steigrate 0,58 m/h – richtig.
**(b):** Roussel 2018 (von Mises), Knicklänge nach Greenhill/Suiker (7,837), DIN EN 197-5:2021-07 (CEM II/C-M, CEM VI), DAfStb-Richtlinie nichtmetallische Bewehrung, Carbon E 230 000–260 000 N/mm², UHPC 150–250 N/mm² – richtig.
- **behoben – NS5A-IW-1 (redaktionell):** „Sicherheit: 1.3“ → „1,3“, „(0.15 bis 0.18)“ → „(0,15 bis 0,18)“.

### 19. KI: Lokale Modelle (`ki_lokal`, Teil `LokaleKI`)
**Nachrechnungen:** 14B in Q4_K_M 14 · 10⁹ · 4,85/8 = 8,5 GB (+ 1,5 GB Cache = 10 GB < 12 GB); 70B FP16 140 GB, Q4 42 GB (−70 %); Quiz 32B 19,4 + 2 = 21,4 GB → 24-GB-Karte – richtig.
**(e):** Parameterzahlen (Qwen3 14B 14,8 Mrd., Qwen2.5-Coder 32B 32,5 Mrd.), LM-Studio-Endpunkt localhost:1234/v1 – richtig. Ohne Befund.

### 20. KI: Systemarchitektur (`ki_system`, Teil `Systemarchitektur`)
**Nachrechnungen:** Kosinus 0,96 bzw. 0,36 (Einheitsvektoren); Neuron z = 0,86, Sigmoid 0,70; Quiz Kosinus A 0,707/B 0,816/C 0,500, ReLU 0 – richtig. Ohne Befund.

### 21. Korrosion (`korrosion`)
**Nachrechnungen:** D_app = 0,3 · 10⁻¹² m²/s = 9,47 mm²/a, z = 1,03, erf = 0,856, C(45 mm) = 0,43 < 0,5, C(35 mm) = 0,77; Faraday 11,6 µm/a, Ø 12 nach 10 a 11,77 mm, ΔA/A = 3,8 %; Quiz K_nat 0,28 mm/√d, C(40 mm) 0,78, ΔA/A Ø 16 8,5 % – richtig (Kerne `chloridGehalt`, `abtragsrateFaraday`, `querschnittsverlust`, `schnellUmrechnung`).
**(b)/(c):** DIN EN 12390-12:2020-04 (3,0 ± 0,5 Vol.-%, 57 % r. F.), DIN EN 12390-10:2019-02, Alterungsexponenten fib Bulletin 34 (0,30/0,60/0,45), Bewertungswert 0,5 M.-% v. z. nach Breit et al. 2011 – richtig. Ohne Befund.

### 22. Labor: Auslagerungsversuch (`labor_auslagerung`)
**Nachrechnungen:** Lehrbeispiel P1: A = 39,96 cm², Δm = 0,240 g, v = 99,7 µm/a; K-Form mit 8,76 · 10⁷ gleichwertig; Quiz 100 µm/a, Oberfläche Ø 10 × 100 mm 33,0 cm² – richtig (Kern `auslagerung`).
**(b):** DIN EN ISO 8407:2025-08 (Beizen), ASTM G1/G31 – richtig. Ohne Befund.

### 23. Labor: Mörtelprismen (`labor_moertelprismen`)
**Nachrechnungen:** Lehrbeispiel R_f(A) = 1,5 · 2900 · 100/40³ = 6,80 MPa, R_c = 50,1 MPa → Klasse 42,5; Quiz R_f 7,5 MPa, R_c 45,0 MPa, 47,8 MPa → 42,5 – richtig (Kern `moertelprismen`).
**(b):** DIN EN 196-1:2016-11 (450/1350/225 g, Mischprogramm, 60 Schläge je Lage, (50 ± 10) N/s und (2400 ± 200) N/s, ±10-%-Regel), Klassengrenzen DIN EN 197-1 (32,5–52,5 / 42,5–62,5 / ≥ 52,5) – richtig. Ohne Befund.

### 24. Lebenszykluskosten (`lebenszyklus_kosten`, mit Lebensdauern und Preisentwicklung)
**Nachrechnungen:** Rentenbarwertfaktor (1 − 1,02⁻³⁰)/0,02 = 22,40, Barwert 44 800 €; 1,03³⁰ = 2,427, Barwert 8240 €; Quiz Flachdach 9420 €, Teppich ⌈50/12⌉ − 1 = 4 Austausche, Preisgleitung 80 000 · 175/140 = 100 000 € – richtig (Kern `rentenbarwertfaktor`).
**(b):** DIN 18960 (KG 100–400), ISO 15686-1/-5, DIN EN 16627:2015-09, BNB 2.1.1 (Preissteigerung ab dem 2. Jahr, kein Restwert), Del. VO (EU) 244/2012, VOB/B § 2 Abs. 3, § 9d VOB/A, Formblatt 225, GENESIS 61261, BBSR-Lebensdauern WDVS 40 a, Fenster 40/50 a – richtig.
- **offen – Frage NS5A-LK-1 (c):** Das LCC-Szenario „Außenwand-Dämmsystem (150 m²)“ setzt für das EPS-WDVS 12 500 kg CO₂-Äq. Herstellung an (83 kg/m²), für das Holzfaser-WDVS 1500 kg. Mit dem zentralen Lehrwert `GWP_LEHRWERTE.eps` (3,25 kg CO₂-Äq./kg, 20 kg/m³) ergeben z. B. 16 cm EPS auf 150 m² rund 1,6 t; mit Kleber, Putz und Dübeln liegt ein EPS-WDVS in der Größenordnung von 20 bis 35 kg CO₂-Äq./m², also etwa 3 bis 5 t. 12,5 t überzeichnet den Unterschied der Varianten im CO₂-Schattenpreis deutlich; die Quizfrage `qn_lebenszyklus_kosten_3` zitiert den Wert, ihre Aussage (Holzfaser wird begünstigt) bleibt aber auch mit kleineren Werten richtig. **Vorschlag:** EPS-Wert aus `GWP_LEHRWERTE.eps` mit angegebener Dicke ableiten (z. B. 16 cm) und Systemanteil als Lehrwert kennzeichnen, etwa 4000 kg; danach Quiztext nachziehen.

### 25. Materialpässe (`materialpaesse`)
**Nachrechnungen:** R_rec = 292/327 = 89,3 %; MCI = 1 − 0,50 · 0,9 = 0,55; Quiz R_rec 88,4 %, MCI 0,595, CI verklebt (35 + 10)/2 = 22,5 % – richtig.
**(b):** DGNB TEC 1.6, ISO 20887:2020, EU-Taxonomie (EU) 2021/2139 Tätigkeit 7.1/7.2, AVV 17 01 07/17 09 04, keine gesetzliche Pflicht zum Gebäuderessourcenpass (Stand 10/2026) – richtig. Ohne Befund.

## Behobene Punkte (dieser PR)

| Kennung | Modul | Datei | Änderung |
|---|---|---|---|
| NS5A-DV-1 | `daemmung_vergleich` | `content/daemmungvergleich/DaemmungVergleich.json` | f_Rsi mit R_T aus R_si = 0,25: 1 − 0,25/0,83 = 0,698 (knapp < 0,70), gedämmt 1 − 0,25/2,33 = 0,89 |
| NS5A-AB-1 | `abfaelle` | `content/abfaelle/Altlasten.json` | BBB-Schwelle Fläche > 3000 m² (§ 4 Abs. 5 BBodSchV, „kann verlangen“); Überschrift ohne „Pflicht“ |
| NS5A-DPP-1 | `dpp` | `content/dppepd/DppEpd.json` | Übergang EAD 09.01.2031, ETA 09.01.2036 |
| NS5A-RA-1 | `bp_recht_avcp` | `content/bprechtliches/BpRechtliches.json` | Audit-Testing: Proben im Werk/Lager vor dem Inverkehrbringen (VO 305/2011 Anhang V Nr. 1.1); Handel = Marktüberwachung |
| NS5A-TB-1 | `bp_trockenbau` | `content/bptrockenbau/BpTrockenbau.json` | Dezimalkomma (redaktionell) |
| NS5A-IW-1 | `innovative_werkstoffe` | `content/innovativewerkstoffe/InnovativeWerkstoffe.json` | Dezimalkomma (redaktionell) |

Regressionstest: `tests/nachstichprobe5a.test.ts` (Nachrechnungen über die Kerne `traeger`, `dreigelenkrahmen`, `bemesseDruckstab`, `bemesseQuerdruck`, `abtragsrateFaraday`, `querschnittsverlust`, `chloridGehalt`, `schnellUmrechnung`, `auslagerung`, `moertelprismen`, `effektiveDickeW`, `rentenbarwertfaktor`, `trockenbauBedarf`, `belagMasse`, `festigkeitsentwicklung` und Absicherung der Korrekturen). Keine Quizfrage durch die Korrekturen falsch geworden, kein Prüfvermerk geändert, kein Normtext gekennzeichnet (kein Normtextpunkt offen).

## Offene Fragen mit Vorschlag

| Kennung | Modul | Frage | Vorschlag |
|---|---|---|---|
| NS5A-LK-1 | `lebenszyklus_kosten` | EPS-WDVS 12 500 kg CO₂-Äq. für 150 m² gegen zentralen Lehrwert (rund 1,6 t EPS bei 16 cm, System etwa 3–5 t) | aus `GWP_LEHRWERTE.eps` mit Dicke ableiten, Systemanteil als Lehrwert (z. B. 4000 kg); Quiz `qn_lebenszyklus_kosten_3` nachziehen |
| NS5A-BI-1 | `bp_innovationen` | Reifegrad-Check: 1-m³-Mischer → TRL 6, TRL-Tabelle: 1-m³-Mischer = TRL 5 | Kriterium 3 um „reale Bauteile im Werk gefertigt“ ergänzen (Rechner und Quiz bleiben) |
| – | app-weit | Rechtsfristen und -schwellen ohne zentrale Liste (3 der 4 Befunde) | zentrale Fristen-/Schwellenliste mit Quelle und Abgleichskript |
