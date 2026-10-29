# Modulprüfung Tranche 9 – Betontechnologie und Massivbau (Befundliste zur Freigabe)

**Stand:** 28.10.2026 (Branch `pruefung/module-tranche9-10-28`, Basis origin/main b2cb8367)
**Status:** Vorschlag zur fachlichen Freigabe – noch nicht bestätigt.

> Nach der Freigabe eines Moduls wird in `src/data/pruefvermerke.ts` der Prüfvermerk „geprüft am …“ gesetzt (Passiv, ohne Namen). Mit dieser Befundliste wurden **keine** Prüfvermerke und **keine** Quizfragen geändert.

## Vorgehen

- **Auswahl (15 Module):** `beton_info`, `beton_a_z`, `grundlagen`, `bindemittel`, `herstellung_einbau`, `nachbehandlung`, `festbeton`, `sichtbeton`, `sonderbetone` (mit 14 Unterreitern), `innovative_werkstoffe`, `biokohlebeton`, `qualitaetssicherung` (mit 4 Unterreitern), `betonpraxis`, `stahlbeton_info`, `carbonbeton`. Für Carbonbeton und die Infomodule wurde der Normenstand DIN 1045-1000/-2/-3:2023-08 (BBQ, Überwachungsklassen ÜK 1 und ÜK 2) besonders geprüft.
- **Prüfumfang je Modul** (wie Tranche 1 bis 3): Rechenkern bzw. Inline-Rechnung mit eigenen Nachrechnungen (Python-Skript, eigene Umsetzung der Gleichungen); Module ohne Rechnung mit einer Faktenstichprobe gegen öffentliche Quellen; Fachtext und Normstand (Ausgaben Oktober 2026, NA DE), Grenzen (`src/data/rechnerGrenzen.ts`), Beispiele, Lernziele und Kurzfassung, Quellen, Stellen „vorläufig, F-Freigabe“.
- **Ergebnis der Nachrechnung:** 92 Einzelwerte, alle ohne Abweichung (Toleranz 0,5 %), außer dem Dehnungsnachweis im Carbonbeton-Rechner (T9-CB-1, Frage). Die Sollwerte der Rechenkerne stehen als Regressionstest in `tests/modulpruefungTranche9.test.ts` (Nachbehandlung, Festbeton, Biokohlebeton). Die Inline-Rechnungen (Bogue, Carbonbeton, 3D-Druck-Simulator, Pumpendruck, Beispiele) wurden Formel für Formel abgeglichen.
- Nur öffentliche Quellen; Normtexte wurden nicht abgeschrieben. Wo der Normtext zur Bestätigung nötig ist, steht die Stelle unter „F-Freigabe“.
- Hinweis zur Recherche: Das gemeinsame Suchkontingent war gegen Ende der Prüfung erschöpft. Punkte, die danach nicht mehr öffentlich belegt werden konnten, stehen als Frage oder F-Stelle (T9-BP-2, T9-BM-1, T9-IW-1).

## Übersicht

| Nr. | Modul | Prüfvermerk-ID | Rechenkern | Empfehlung |
|---|---|---|---|---|
| 1 | Modulinfos Betontechnologie | `beton_info` (Infomodul) | – | freigabefähig nach Korrektur T9-BI-1/-2/-3 |
| 2 | Beton A–Z | `beton_a_z` | – (Tabellen) | freigabefähig nach Korrektur T9-AZ-1 bis -4 |
| 3 | Ausgangsstoffe | `grundlagen` | – (Beispiele) | freigabefähig nach Klärung von T9-GL-1 |
| 4 | Bindemittel | `bindemittel` | Inline (Bogue in `Zementchemie.tsx`) | freigabefähig nach Klärung von T9-BM-1 |
| 5 | Herstellung & Einbau | `herstellung_einbau` | – (Beispiel Förderdruck) | freigabefähig |
| 6 | Nachbehandlung | `nachbehandlung` | `src/calc/hydratation.ts` | freigabefähig nach Klärung von T9-NB-1 |
| 7 | Festbeton | `festbeton` | `src/calc/pruefverfahren.ts`, `festbetonStatistik.ts` | freigabefähig nach Korrektur T9-FB-1 |
| 8 | Sichtbeton | `sichtbeton` | – (Beispiele) | freigabefähig |
| 9 | Sonderbetone | `sonderbetone` | – (Beispiele) | freigabefähig nach Korrektur T9-SO-1 bis -4 |
| 10 | Entwicklungen | `innovative_werkstoffe` | Inline (3D-Druck-Simulator) | freigabefähig nach Korrektur T9-IW-2/-3 und Klärung von T9-IW-1 |
| 11 | Biokohlebeton | `biokohlebeton` | `src/calc/biokohlebeton.ts` | freigabefähig nach Klärung von T9-BK-1 |
| 12 | Qualitätssicherung | `qualitaetssicherung` | – (Inline-Konformität) | freigabefähig nach Korrektur T9-QS-1/-2 und Klärung von T9-QS-3 |
| 13 | Betonpraxis | `betonpraxis` | Inline (Krell-Regeln, Bohrkerne) | freigabefähig nach Korrektur T9-BP-1 und Klärung von T9-BP-2 |
| 14 | Modulinfos Stahlbetonbau | `stahlbeton_info` (Infomodul) | – | freigabefähig nach Korrektur T9-SI-1 |
| 15 | Carbonbeton | `carbonbeton` | Inline (`Carbonbeton.tsx`) | freigabefähig nach Korrektur T9-CB-2 und Klärung von T9-CB-1 |

**Behobene Fehler (dieser PR):**
- **T9-BI-1:** erfundene bzw. nicht auffindbare Literaturangaben im Modul Modulinfos (zwei Fachaufsätze, zwei Dissertationen) durch belegte Titel ersetzt; ISBN, Titel und Auflagen korrigiert.
- **T9-BI-2:** „BBQ-Ingenieur“ gibt es in DIN 1045-1000 nicht; ersetzt durch BBQ-Gespräche und bereichsübergreifenden Fachkoordinator.
- **T9-BI-3:** k-Werte: Silikastaub „k = 1,00 bis 2,00“ und „Gesteinsmehle k = 0,20“ mit Verweis auf die DAfStb-Treibhausgas-Richtlinie waren falsch.
- **T9-AZ-1:** Betondeckungstabelle mit Δc_dev = 10 mm und c_min,dur(XD1) = 35 mm – nach NA DE 15 mm und 40 mm (c_nom bis 10 mm zu klein, unsichere Seite).
- **T9-AZ-2 bis -4:** Kapillarporenanteile, Nummerierung der Instandsetzungsprinzipien DIN EN 1504-9, SVB-Einstufung.
- **T9-FB-1:** „Erstprüfung“ statt „Erstherstellung“ bei den Konformitätskriterien.
- **T9-SO-1:** Viskositätsanteil des Pumpendrucks mit Faktor 4 statt 8 (Hagen-Poiseuille). **T9-SO-2/-3:** DAfStb-Richtlinie Stahlfaserbeton 2021-06, Titel DIN 18551. **T9-SO-4:** Grenze VS1/VS2.
- **T9-IW-2/-3:** „Tresca“ statt von Mises, Zulassungsbegriffe, widersprüchliche Lehrwerte und doppelte Textteile.
- **T9-QS-1/-2:** Titel DIN 1045-1000, Aufgaben der Fremdüberwachung, unbelegte „80 %“-Quote.
- **T9-BP-1:** Identitätsprüfung (n = 2 bis 4, Mittelwert), SVB-Klassen, Temperaturgrenzen der Nachbehandlung.
- **T9-SI-1:** Stützen „nach Theorie II. Ordnung“ – der Rechner rechnet nach Theorie I. Ordnung.
- **T9-CB-2:** Regelwerksabsatz (DAfStb-Richtlinie 2024-01, DIN 1045-1000/-2/-3:2023-08, BBQ, ÜK 1/2) ergänzt.

---

## 1. Modulinfos Betontechnologie (`beton_info`)

**Prüfumfang:** `src/modules/BetonInfo.tsx`, `content/betoninfo/BetonInfo.json` (BBQ-Übersicht, k-Wert-Abschnitt, Modulübersicht, Literatur, Regelwerke). Infomodul ohne Prüfvermerk; Prüfung wie ein Fachmodul.

**Faktenstichprobe**

| Aussage | Ergebnis | Quelle |
|---|---|---|
| DIN 1045-1000 führt BBQ-N, BBQ-E, BBQ-S ein; Gespräche bei E und S verbindlich, bei S ggf. bereichsübergreifender Fachkoordinator | richtig; „BBQ-Ingenieur“ kommt nicht vor | [Baunetz Wissen, Beton nach Norm](https://www.baunetzwissen.de/beton/fachwissen/betonarten/beton-nach-norm-7680284); [SCHWENK, Beton – Herstellung nach den aktuellen Normen](https://www.schwenk.de/wp-content/uploads/2026/03/swz_1671_02_Broschuere_Beton_Herstellung_nach_den_aktuellen_Normen_v4_Endfassung.pdf) |
| DIN 1045-3:2023-08: nur ÜK 1 und ÜK 2 | richtig (Text war schon korrigiert) | SCHWENK (wie oben) |
| Titel DIN 1045-1000 | „Grundlagen und Betonbauqualitätsklassen (BBQ)“, nicht „Zusammenarbeit …“ | [DIN Media, DIN 1045-1000](https://www.dinmedia.de/de/norm/din-1045-1000/369463519) |
| DAfStb-Richtlinie Treibhausgasreduzierte Tragwerke regelt k-Werte | falsch – sie legt Treibhausgasklassen fest (Weißdruck 2024-08) | [BFT International](https://bft-international.com/en/artikel/climate-friendly-concrete-construction-using-standardized-benchmarks-the-ghg-guideline-published-by-the-dafstb-4213466.html) |
| Flugasche k = 0,4 (Unterwasser-/Bohrpfahlbeton 0,7) | richtig | SCHWENK (wie oben) |
| Zement-Taschenbuch „63. Ausgabe“ | falsch – letzte Ausgabe 51 (2008), Erscheinen eingestellt | [KIT-Katalog](https://katalog.bibliothek.kit.edu/bib/108549) |
| Grübl/Weigler/Karl, ISBN „975-…“ | ISBN 978-3-433-01340-3, Titel „Beton – Arten, Herstellung und Eigenschaften“ | [Schweitzer](https://www.schweitzer-online.de/en/buch/Gruebl/Beton/9783433013403/A17510646/) |

**Befunde**
- **behoben – T9-BI-1 (Literatur):** Die Aufsätze „Hydration kinetics … low-clinker blended cements“ (Scrivener, CCR Vol. 110, 2018) und „A comprehensive review on the water-to-binder ratio in UHPC“ (De Larrard, Materials and Structures Vol. 52, 2020) sowie die Dissertationen „Gefügeoptimierung UHPC“ (TUM, M. Schmidt) und „Hydratationskinetik klinkerreduzierter Zemente“ (KIT, T. Schuler) waren nicht auffindbar. Ersetzt durch: Juenger/Snellings/Bernal, CCR 122 (2019) 257–273 ([White Rose](https://eprints.whiterose.ac.uk/146768)); De Larrard/Sedran, CCR 24 (1994) 997–1009 ([Structurae](https://structurae.net/en/literature/journal-article/optimization-of-ultra-high-performance-concrete-by-the-use-of-a-packing-model)); DAfStb-Heft 561, Sachstandsbericht UHPC, 2008 ([DIN Media](https://6sku3uaup9f9.din.de/en/publication/heft-561-dafstb/107880416)); Trümer, Dissertation Weimar 2019 ([Bauhaus-Universität](https://www.uni-weimar.de/fileadmin/user/fak/bauing/professuren_institute/Finger_Institut/Studium/Promotionen/Zusammenfassung_der_Promotionsschrift_truemer.pdf)). Taylor: Titel „Cement Chemistry“ (2. Aufl. 1997).
- **behoben – T9-BI-2:** „Erfordert obligatorisch einen qualifizierten BBQ-Ingenieur“ → verbindliche BBQ-Gespräche, ggf. bereichsübergreifender Fachkoordinator; „Konzeptionsgespräch“ → „BBQ-Gespräche“.
- **behoben – T9-BI-3:** k-Wert-Absatz: Flugasche 0,4 (0,7), Silikastaub 1,0 (DIN EN 206 empfiehlt bis 2,0, in Deutschland 1,0); „Gesteinsmehle k = 0,20“ gestrichen; Rolle der DAfStb-Richtlinie richtiggestellt; Satz zum Mindestzementgehalt präzisiert.

**F-Freigabe-Stellen:** keine neuen.

**Empfehlung:** freigabefähig nach Korrektur T9-BI-1/-2/-3.

- [ ] Modul freigeben (Infomodul, kein Prüfvermerk)

## 2. Beton A–Z (`beton_a_z`)

**Prüfumfang:** `src/modules/BetonAZ.tsx` (Tabellen Stoffraum, Kapillarporen, F-Klassen, Festigkeitsklassen, Betondeckung), `content/betonaz/BetonAZ.json`, Lernziele.

**Nachrechnungen / Tabellenabgleich**

| Fall | Handrechnung | Modul vorher → nachher |
|---|---|---|
| AZ1 Kapillarporen nach Powers, p = (w/z − 0,36)/(w/z + 0,32), α = 1 | 0,40: 5,6 %; 0,45: 11,7 %; 0,50: 17,1 %; 0,60: 26,1 % | „< 3 % / 4–12 % / > 25 %“ → „≤ 6 % / 12–17 % / ≥ 26 %“ |
| AZ2 c_nom = c_min,dur + Δc_dev (NA DE: 15 mm, XC1 10 mm) | XC1 20; XC2/XC3 35; XC4 40; XD1 55; XD3 55 mm | 20/30/35/45/50 → 20/35/40/55/55 mm |
| AZ3 f_ctm nach Tab. 3.1 | C12/15 1,6; C20/25 2,2; C25/30 2,6; C30/37 2,9; C45/55 3,8 N/mm² | identisch |
| AZ4 Ausbreitmaßklassen F1–F5 | ≤ 340, 350–410, 420–480, 490–550, 560–620 mm | identisch |

**Befunde**
- **behoben – T9-AZ-1 (Betondeckung):** Tabelle und Text rechneten mit Δc_dev = 10 mm und c_min,dur(XD1) = 35 mm (EN-Empfehlung). Nach DIN EN 1992-1-1/NA (Tab. 4.4DE) gilt c_min,dur = 40 mm für XD1 bis XD3 und Δc_dev = 15 mm (XC1 10 mm); so rechnet auch der Kern `expositionsklassen.ts` (Tranche 3, EX1/EX2) und die Quizfrage `q_massiv_1`. Die Werte lagen bis 10 mm auf der unsicheren Seite.
- **behoben – T9-AZ-2:** „w/z 0,40 … (wasserfreies Gesteinsgel)“ → 0,25 chemisch gebunden + 0,15 Gelwasser; Dichtheitsgrenze mit den Hydratationszeiten nach Powers, Copeland und Mann; Kapillarporenanteile nach Powers (Tabelle oben).
- **behoben – T9-AZ-3:** Instandsetzungsprinzipien: KKS ist Prinzip 10 (nicht „Prinzip I“), Betonersatz Prinzip 3 bzw. 7 (nicht „Prinzip II“) nach DIN EN 1504-9; doppelter Text entfernt.
- **behoben – T9-AZ-4:** „F5/F6 – SVB“: SVB wird über das Setzfließmaß SF1–SF3 eingeteilt; Fallhöhe „über 1,50 m zwingend“ → Praxisregel 1,0 bis 1,5 m; „amtliches Erstprüfungszeugnis“ → Erstprüfung nach DIN 1045-2, Anhang A.

**F-Freigabe-Stellen:** Haftzugfestigkeit ≥ 1,5 N/mm² (Mittelwert; Einzelwertkriterium nach TR Instandhaltung nicht genannt).

**Empfehlung:** freigabefähig nach Korrektur T9-AZ-1 bis -4.

- [x] Modul freigeben (29.10.2026)

## 3. Ausgangsstoffe (`grundlagen`)

**Prüfumfang:** `src/modules/Grundlagen.tsx`, `content/grundlagen/Grundlagen.json` (Zugabewasser, Gesteinskörnung, AKR, Zementarten, Mehlkorn, Zusatzstoffe, zwei Beispiele), Lernziele.

**Nachrechnungen**

| Fall | Handrechnung | Modul |
|---|---|---|
| GL1 Mehlkorn, z = 320 kg/m³, D_max 16, XF1 | m_max = 400 + 20/50 · 50 = 420; Ist 320 + 40 + 0,03 · 700 = 381 kg/m³ | identisch |
| GL2 (w/z)_eq, z 280, f 80, w 160 | f/z = 0,29 ≤ 0,33; 160/312 = 0,513 ≤ 0,60 (XC4); ohne Anrechnung 0,571 | identisch |

**Faktenstichprobe:** DIN EN 1008 – Trinkwasser ohne Prüfung geeignet, Restwasser nach Anhang A, Grundwasser prüfen, Meerwasser nur für unbewehrten Beton, Abwasser ungeeignet ([iTeh, EN 1008](https://standards.iteh.ai/catalog/standards/cen/8ab1a0fa-b727-48f7-9b31-739eba3732ca/en-1008-2002)) – richtig. Hauptbestandteile CEM I ≥ 95 %, CEM II 6–35 %, CEM III 36–95 %, CEM VI nach DIN EN 197-5, L nur bei CEM III – richtig.

**Befunde**
- behoben: keine.
- **offen – Frage T9-GL-1 (RC-Anteile):** Der Text nennt Höchstanteile rezyklierter Gesteinskörnung je Expositionsklasse (z. B. 45/35 Vol.-%). Nach dem Gelbdruck DIN 1045-2 (2022) ist in Betonklasse BK-N nur ≤ 25 Vol.-% (WO, WF) vorgesehen, darüber BK-E mit Tab. E.2.5 ([IFEU, Das neue Regelwerk DIN 1045-2](https://kreislaufwirtschaft-bau.rlp.de/fileadmin/kreislaufwirtschaft-bau/Startseite/Service/Fachgespraeche/neues_Regelwerk/220920_IFEU_Das_neue_Regelwerk_DIN_1045-2.pdf)). Bitte die Werte am Weißdruck 2023-08 (Anhang E) bestätigen und den Bezug zu BK-N/BK-E ergänzen.

**F-Freigabe-Stellen:** Entfall der Mehlkorn-Höchstwerte und Mindest-Leimvolumen in DIN 1045-2:2023-08 (aus früherer Runde).

**Umsetzung 29.10.2026 – T9-GL-1:** Normtext: Bezug zur Betonklasse ergänzt – in BK-N nach DIN 1045-1000 rezyklierte Gesteinskörnung nur bis 25 Vol.-% (WO, WF), höhere Anteile setzen BK-E voraus (Anhang E, Tab. E.2.5); Werte „vorläufig, F-Freigabe“. Mit T12-RE-1 (Ressourcen-Simulator) abgestimmt. Quelle: [IFEU, Das neue Regelwerk DIN 1045-2](https://kreislaufwirtschaft-bau.rlp.de/fileadmin/kreislaufwirtschaft-bau/Startseite/Service/Fachgespraeche/neues_Regelwerk/220920_IFEU_Das_neue_Regelwerk_DIN_1045-2.pdf); Normtext DIN 1045-2:2023-08.

**Empfehlung:** freigabefähig nach Klärung von T9-GL-1.

- [ ] Modul freigeben

## 4. Bindemittel (`bindemittel`)

**Prüfumfang:** `src/modules/Bindemittel.tsx`, Reiter Zementchemie (`Zementchemie.tsx`, Bogue-Rechner), `content/bindemittel/Bindemittel.json` (Herstellung, Klinkerphasen, Normzemente, SR/LH/NA, Zusatzstoffe, Beispiel NA-Zement), Lernziele.

**Nachrechnungen**

| Fall | Handrechnung | Modul |
|---|---|---|
| BM1 Bogue, CaO 65, SiO₂ 21, Al₂O₃ 5,5, Fe₂O₃ 3, SO₃ 2,5 (A/F ≥ 0,64) | C₃S 56,6; C₂S 17,5; C₃A 9,5; C₄AF 9,1 M.-% | Formeln identisch (ASTM C150) |
| BM2 Bogue, A/F = 0,6 < 0,64 | C₃S 59,9; C₂S 17,9; ss (C₄AF + C₂F) 14,8 M.-% | identisch |
| BM3 Na₂O-Äquivalent 0,25 + 0,658 · 0,80 | 0,776 M.-% → kein NA bei CEM I, NA bei CEM III/A ≥ 50 % S | identisch |

**Faktenstichprobe:** NA-Grenzen DIN 1164-10 (0,60/0,70/0,95/1,10/2,00), LH ≤ 270 J/g und VLH ≤ 220 J/g, SR ab Sulfat > 600 mg/l, Zusammensetzung CEM II/C-M (Klinker 50–64 %) und CEM VI (35–49 %), Kalzinierung 800–900 °C – richtig.

**Befunde**
- behoben: keine.
- **offen – Frage T9-BM-1 (Anwendungsbereiche):** Die Zementkarten nennen verkürzte Anwendungsbereiche (z. B. CEM II/A-LL „XC1–XC4, XF1, XA1; XF4 nur mit Nachweis“, CEM II/A-V „XC1–XC4, XD1–XD3, XA1–XA2“). Nach den Anwendungstabellen der DIN 1045-2 sind die A-Zemente nach meinem Kenntnisstand weitgehend uneingeschränkt verwendbar. Die Karten sind als „Kurzfassung – manuell prüfen“ gekennzeichnet; bitte am Normtext (Anwendungstabellen DIN 1045-2:2023-08) abgleichen.
- Hinweis: Die schematische Wärmekurve endet für C₃A bei 900 J/g und für C₂S bei 200 J/g, der Text nennt rund 1 350 und 250 J/g (vollständige Hydratation). Als „schematische Lehrkurve“ gekennzeichnet, kein Befund.

**F-Freigabe-Stellen:** Anrechnung von Zusatzstoffen bei XF2/XF4 (Frage M-6 aus Tranche 1, gilt mit).

**Umsetzung 29.10.2026 – T9-BM-1:** Normtext: Hinweis der Zementkarten „manuell prüfen“ → „vorläufig, F-Freigabe am Normtext“ (Anwendungstabellen DIN 1045-2:2023-08); Karteninhalte unverändert. Quelle: DIN 1045-2:2023-08 (Normtext).

**Empfehlung:** freigabefähig nach Klärung von T9-BM-1.

- [ ] Modul freigeben

## 5. Herstellung & Einbau (`herstellung_einbau`)

**Prüfumfang:** `src/modules/HerstellungEinbau.tsx`, `content/herstellungeinbau/HerstellungEinbau.json` (Transport, Mischen, Pumpen, Verdichten, Beispiele Förderdruck und Transportzeit), Lernziele.

**Nachrechnungen**

| Fall | Handrechnung | Modul |
|---|---|---|
| HE1 Förderdruck DN 125, τ₀ 200 Pa, μ_p 20 Pa·s, L 50 m, H 20 m, Q 30 m³/h | v = 0,679 m/s; 3,2 + 13,9 + 4,7 ≈ 22 bar | identisch |
| HE2 Entladezeit 8:10 → 9:50 Uhr | 100 min > 90 min | identisch |

**Faktenstichprobe:** Entladung 90 min (mit Rührwerk) bzw. 45 min (ohne), Zugabe von Wasser bei Lieferung grundsätzlich unzulässig, Zwangsmischer ≥ 30 s, Gleitschicht beim Pumpen – richtig (Entladezeit auch bei SCHWENK und im Modul Qualitätssicherung).

**Befunde**
- behoben: keine.
- Hinweis: Der Fließgrenzenanteil 2·τ₀·L/R gilt für reine Pfropfenströmung; die Buckingham-Reiner-Näherung hat den Faktor 8/3. Als „Lehrmodell, Gleitschicht vernachlässigt“ gekennzeichnet, kein Befund.

**F-Freigabe-Stellen:** Abschnittsnummer „DIN 1045-2, 7.6“ für die Entladezeit.

**Empfehlung:** freigabefähig.

- [x] Modul freigeben (29.10.2026)

## 6. Nachbehandlung (`nachbehandlung`)

**Prüfumfang:** `verdunstungsrate` und `nachbehandlungsdauer` in `src/calc/hydratation.ts`, Tabelle `DIN1045_3_NACHBEHANDLUNG` (`src/data/normParams.ts`), `content/nachbehandlung/Nachbehandlung.json`, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| NB1 | Beispiel: 25/25 °C, r = 0,30, V = 25 km/h | E = 5·(43^2,5 − 0,3·43^2,5)·29·10⁻⁶ = 1,231 kg/(m²h) → kritisch | identisch |
| NB2 | Standard: 25/25 °C, 50 %, 15 km/h | 0,576 kg/(m²h) | identisch |
| NB3 | Beton 30 °C, Luft 20 °C, 40 %, 20 km/h | 1,488 kg/(m²h) | identisch |
| NB4 | Beton 10 °C, Luft 20 °C, 90 %, windstill | Rechenwert < 0 → E = 0 | identisch |
| NB5 | 10 ≤ T < 15 °C, langsam, XC4 | 7 d | identisch |
| NB6 | 5 ≤ T < 10 °C, sehr langsam, XM | 2 · 15 = 30 d | identisch |

Die Tabelle (1/2/2/3, 1/2/4/5, 2/4/7/10, 3/6/10/15 d), X0/XC1 0,5 d und die Zuordnung zur Nachbehandlungsklasse 3 stimmen mit der Wiedergabe der DIN 1045-3:2023-08 bei SCHWENK überein (Nachbehandlungsklassen 1 bis 4 mit 35/50/70 % f_ck).

**Befunde**
- behoben: keine.
- **offen – Frage T9-NB-1 (Temperaturen < 5 °C, XF3/XF4):** (a) Der Kern meldet unter 5 °C „Sondermaßnahmen“ ohne Dauer. Nach DIN 1045-3 ist die Dauer um die Zeit unter 5 °C zu verlängern; Winterbaumaßnahmen sind zusätzlich nötig. (b) Nach der Wiedergabe bei SCHWENK gilt die 70-%-Regel bzw. Verdopplung ohne genaueren Nachweis für XM **und XF3/XF4** (Nachbehandlungsklasse 4: XM1–XM3, XF4 bei langsamen und sehr langsamen Betonen). Der Rechner verdoppelt nur bei XM. Soll die Auswahl um XF4 (bzw. XF3) ergänzt und der Text zur Verlängerung unter 5 °C angepasst werden? (c) Betone ab C70/85: mindestens 1 Tag.

**F-Freigabe-Stellen:** Abschnittsnummer „DIN 1045-3:2023-08, Abschn. 9.6“; Zuordnung XF3/XF4 zur Nachbehandlungsklasse 4.

**Umsetzung 29.10.2026 – T9-NB-1:** Kern `nachbehandlungsdauer`: neue Auswahl **XF3, XF4** mit doppelter Dauer wie XM (vorläufig, Hinweis im Ergebnis); unter 5 °C Hinweis „Dauer um die Zeit unter 5 °C verlängern, Winterbaumaßnahmen zusätzlich“ (Kern und Modultext). „Andere“ nennt jetzt XF1, XF2. Tests `tests/hydratation.test.ts`, `tests/modulpruefungTranche9.test.ts` (NB7, NB8). Offen bleibt (c) Mindestdauer ab C70/85. Quelle: DIN 1045-3:2023-08, Tab. 3 (Normtext; Wiedergabe SCHWENK).

**Empfehlung:** freigabefähig nach Klärung von T9-NB-1.

- [ ] Modul freigeben

## 7. Festbeton (`festbeton`)

**Prüfumfang:** `bemessungswerteBeton`, `festigkeitsentwicklung` (`src/calc/pruefverfahren.ts`), `festbetonStatistik`, `konformitaetDruck` (`src/calc/festbetonStatistik.ts`), Reiter von `src/modules/Festbeton.tsx`, Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| FB1 | C25/30, α_cc = α_ct = 0,85, γ_c = 1,5 | f_cd = 14,17; f_ctd = 0,85 · 1,8/1,5 = 1,02 N/mm² | identisch |
| FB2 | f_ck 30, 7 d, Zement N | β_cc = e^(0,25·(1 − 2)) = 0,7788; f_cm(7) = 29,59; f_ck(7) = 21,59; Würfel 150: 36,50 N/mm² | identisch |
| FB3 | f_ck 30, 3 d, Zement R | f_cm(3) = 25,19 N/mm² | identisch |
| FB4 | f_cm 38, σ 3,5 | f_ck = 32,24; f_cd = 18,27; Mindestmittel 36,24; Mindesteinzel 28,24 | identisch |
| FB5 | C25/30, Würfel 34,5/33,2/35,8, Erstherstellung | Mittel 34,5 ≥ 34; min 33,2 ≥ 26 → konform | identisch |
| FB6 | C30/37, 15 Werte (s = 1,61), σ Vorserie 2,2 | σ = 3; Soll 41,44; Mittel 41,73 → konform | identisch |

**Befunde**
- **behoben – T9-FB-1:** Die Konformitätskriterien bei Herstellungsbeginn hießen „Erstprüfung (Anfangsproduktion)“. Die Erstprüfung ist die Eignungsprüfung der Rezeptur (DIN 1045-2, Anhang A); das Kriterium f_cm ≥ f_ck + 4 gilt für die **Erstherstellung**. Beschriftung, Auswahl und Formelerklärung korrigiert (Kern und Werte unverändert).
- Hinweis: Hochfeste Betone (eigene Kriterien in DIN 1045-2) bleiben im Schnellevaluator unberücksichtigt; steht in den Grenzen („keine vollständige Konformitätskontrolle“).

**F-Freigabe-Stellen** (aus früheren Runden): σ_min = 3 N/mm²; Lagerungs- und Größenfaktoren (Lehrwerte).

**Empfehlung:** freigabefähig nach Korrektur T9-FB-1.

- [x] Modul freigeben (29.10.2026)

## 8. Sichtbeton (`sichtbeton`)

**Prüfumfang:** `src/modules/Sichtbeton.tsx`, `content/sichtbeton/Sichtbeton.json` (Klassen SB 1–4, Einflussfaktoren, Mängel, zwei Beispiele), Lernziele.

**Nachrechnungen:** Porenflächenanteil 600/250 000 = 0,24 % (unter P4 ≈ 0,3 %); c_nom = max(12; 25; 10) + 15 = 40 mm (XC4) – identisch.

**Faktenstichprobe:** Porigkeitsklassen P1 ≤ 3 000, P2 ≤ 2 250, P3 ≤ 1 500, P4 ≤ 750 mm² je 500 × 500 mm (Poren 2–15 mm), Zuordnung SB 1 → P1 … SB 4 → P4, Beispiele der Klassen, Merkblatt Fassung 2015 – richtig ([Heidelberg Materials, Sichtbetonklassen](https://www.heidelbergmaterials.de/system/files/2026-02/HM_Sichtbeton_Klassen_Anforderungen_Brosch%C3%BCre_1.pdf)).

**Befunde:** keine.

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig.

- [x] Modul freigeben (29.10.2026)

## 9. Sonderbetone (`sonderbetone`, 14 Unterreiter)

**Prüfumfang:** `src/modules/Sonderbetone.tsx`, `content/sonderbetone/Sonderbetone.json` (Beispiele, Formeln, Regelwerke, Literatur) und die Texte der Unterreiter (Leicht-, Spritz-, Recycling-, UHPC, Drän-, Faser-, Schleuder-, Unterwasser-, Infraleicht-, SVB, Schwer-, Massen-, Pump-, Bohrpfahlbeton), Kurzfassung, Lernziele.

**Nachrechnungen**

| Fall | Handrechnung | Modul |
|---|---|---|
| SO1 η_E bei ρ = 1 600 kg/m³ | (1 600/2 200)² = 0,529 | identisch |
| SO2 Mehrwasser RC, 25 % · 1 800 · 5 % | 22,5 kg/m³ | identisch |
| SO3 Hohlraum Dränbeton | 1 000 − (80,6 + 95 + 584,9) = 239,5 dm³ ≈ 24 % | identisch |
| SO4 (w/z)_eq SVB, f_anr = min(180; 0,33 · 380) | 170/430 = 0,395 | identisch |
| SO5 Schwerbeton 350 + 160 + 2 800 | 3 310 kg/m³ > 2 600 | identisch |
| SO6 Pumpendruck, Viskositätsanteil | 8·μ·Q·L/(π·R⁴) = 13,9 bar (wie Herstellung & Einbau) | Formel mit Faktor 4 → **halber Wert** |

**Befunde**
- **behoben – T9-SO-1:** Formel Δp = 2τ₀L/R + **4**·μ·Q·L/(π·R⁴) → Faktor **8** (Hagen-Poiseuille; entspricht 8·μ·v·L/R² im Modul Herstellung & Einbau).
- **behoben – T9-SO-2:** DAfStb-Richtlinie Stahlfaserbeton gilt in der Ausgabe 2021-06 ([DIN Media](https://www.dinmedia.de/de/technische-regel/dafstb-stahlfaserbeton/341626064)), nicht 2012-11.
- **behoben – T9-SO-3:** DIN 18551 „Herstellung und Güteüberwachung“ ist der alte Titel; geltend DIN 18551:2014-08 „Nationale Anwendungsregeln zur Reihe DIN EN 14487 …“ ([DIN Media](https://dinmedia.de/en/standard/din-18551/207441368)), Entwurf der Neuausgabe 2026-05 ([DIN Media, Entwurf](https://www.dinmedia.de/en/draft-standard/din-18551/400531731)).
- **behoben – T9-SO-4:** Viskositätsklassen VS1 t₅₀₀ < 2 s, VS2 ≥ 2 s (vorher ≤/>). Die E-Modul-Formel für RC-Beton mit Quelle „DAfStb Heft 600“ (Heft 600 sind die Erläuterungen zu EC 2) als Lehrmodell „vorläufig, F-Freigabe“ gekennzeichnet.
- Hinweis: UHPC – der Entwurf der DAfStb-Richtlinie definiert nach [Baunetz Wissen](https://www.baunetzwissen.de/beton/fachwissen/betonarten/ultrahochleistungsbeton-150988) f_ck ≥ 130 N/mm²; das Modul nennt „Literatur ab etwa 150 N/mm²“. Kein Fehler, Ergänzung möglich.

**F-Freigabe-Stellen:** RC-Höchstanteile DIN 1045-2:2023-08, Anhang E (vgl. T9-GL-1); E-Modul-Abminderung RC-Beton; Mindesteintauchtiefe Contractor-Verfahren (ZTV-W LB 215).

**Empfehlung:** freigabefähig nach Korrektur T9-SO-1 bis -4.

- [x] Modul freigeben (29.10.2026)

## 10. Entwicklungen (`innovative_werkstoffe`)

**Prüfumfang:** `src/modules/InnovativeWerkstoffe.tsx` (Katalog, 3D-Druck mit Simulator, Wegweiser), `content/innovativewerkstoffe/InnovativeWerkstoffe.json`, Lernziele.

**Nachrechnungen**

| Fall | Handrechnung | Modul |
|---|---|---|
| IW1 τ_req = ρgH/√3, ρ 2 100, H 2 m | 23 788 Pa | identisch (Beispiel) |
| IW2 Simulator Standard: v 1,2 m/h, τ₀,₀ 350 + 1 200 Pa, A_thix 5 + 150 Pa/min | t = 100 min; τ = 17 050 Pa; SF_p = 0,72 | identisch |
| IW3 Greenhill, H_cr = (7,837·E·I/(ρgA))^(1/3), I/A = b²/12, Formfaktor 4 | E = 1 200·τ; H_cr = 2,55 m; SF_k = 1,28 | identisch (0,653 = 7,837/12) |

**Befunde**
- **behoben – T9-IW-2:** Überschrift „Grenzbedingung nach Tresca“ bei der Formel mit 1/√3 (von Mises, Roussel 2018; die Quizfrage `qn_innovative_werkstoffe_1` nennt schon von Mises). Zulassungsbegriffe: „Zulassungen im Einzelfall“ → Zustimmung im Einzelfall/vBG bzw. aBG/abZ.
- **behoben – T9-IW-3:** Beschleuniger-Text nannte +120 Pa/min, der Simulator rechnet mit +150 Pa/min (Text angepasst, Verhalten unverändert); Codekommentar E ≈ 1 000·τ → 1 200·τ; doppelte bzw. verstümmelte Texte (Formgedächtnislegierungen, 3D-Druck, Myzel), „comme“, „agressiven“, „hydrophobierende Hydrophobierung“.
- **offen – Frage T9-IW-1:** Selbstheilender Beton „dichtet Risse bis 0,8 mm Breite ab“ – öffentlich belegt sind nach meinem Kenntnisstand Laborwerte um 0,5 mm (Jonkers). Wert belegen oder auf „Laborwerte bis etwa 0,5 mm“ ändern?
- Hinweis: Mit den Standardwerten zeigt der Simulator „Versagen“ (SF_p = 0,72). Das ist didaktisch gewollt (Handlungsempfehlungen), sollte aber bekannt sein.

**F-Freigabe-Stellen:** keine.

**Umsetzung 29.10.2026 – T9-IW-1:** „bis 0,8 mm Breite autonom abdichtet“ → „verschließt feine Risse selbstständig (Laborwerte um 0,5 mm Rissbreite, Jonkers)“. Quelle: Entscheidung 28.10..

**Empfehlung:** freigabefähig nach Korrektur T9-IW-2/-3 und Klärung von T9-IW-1.

- [x] Modul freigeben (29.10.2026)

## 11. Biokohlebeton (`biokohlebeton`)

**Prüfumfang:** `src/calc/biokohlebeton.ts`, `src/modules/Biokohlebeton.tsx`, `content/biokohlebeton/Biokohlebeton.json`, Grenzen, Lernziele. Geprüft wurde nur der öffentlich zugängliche Stand.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| BK1 | 10 kg/m³, 80 % C, F_perm 0,80, e_PK 0,3, z 320, Δz 0, CEM I 0,80 | brutto 29,33; Speicher 23,47; netto 20,47 kg CO₂/m³; Minderung 8,0 %; 3,1 M.-% v. z; Vornässwasser 20 kg/m³ | identisch |
| BK2 | 15 kg/m³, 70 % C, F_perm 0,65, e_PK 0,5, z 340, Δz 30, 0,65 | Speicher 25,03; E_Z 19,5; Minderung 37,03 kg/m³ = 16,8 %; w/z 0,548 | identisch |
| BK3 | Zementäquivalent je kg Kohle (Beispiel) | (0,8·3,667·0,8 − 0,3)/0,8 = 2,56 kg | identisch |

**Faktenstichprobe:** F_perm 0,89/0,80/0,65 für > 600 °C / 450–600 °C / 350–450 °C, ausdrücklich nur für Mineralböden abgeleitet ([IPCC 2019 Refinement, Vol. 4, Kap. 2, Appendix 4, Tab. 4AP.2](https://www.Ipcc-nggip.Iges.Or.Jp/public/2019rf/pdf/4_Volume4/19R_V4_Ch02_Ap4_Biochar.pdf)) – richtig, Grenzen nennen die Einschränkung. 44/12, EBC-Kriterien (C ≥ 50 %, H/C < 0,7) – richtig.

**Befunde**
- behoben: keine.
- **offen – Frage T9-BK-1 (Projekthinweis):** Das Modul enthält einen Projekthinweis mit Nennung der Hochschule und des Transferzentrums. Soll dieser Hinweis bleiben? Sonstige projektbezogene Angaben enthält das Modul nicht.

**F-Freigabe-Stellen:** keine neuen (Permanenz im Beton bleibt Richtwert).

**Umsetzung 29.10.2026 – T9-BK-1:** Projekthinweis mit Nennung von Hochschule und Transferzentrum entfernt; der neutrale Hinweis („öffentlich zugänglicher Stand …, ersetzt keine Eignungsprüfung“) bleibt. Quelle: Entscheidung 28.10..

**Empfehlung:** freigabefähig nach Klärung von T9-BK-1.

- [x] Modul freigeben (29.10.2026)

## 12. Qualitätssicherung (`qualitaetssicherung`, 4 Unterreiter)

**Prüfumfang:** `src/modules/Qualitaetssicherung.tsx` mit Reitern QS auf der Baustelle, Betonbauklassen (BBQ), Konformitätskontrolle, CSC; zugehörige JSON-Dateien, Kurzfassung, Lernziele.

**Nachrechnungen**

| Fall | Handrechnung | Modul |
|---|---|---|
| QS1 stetig C30/37, s = 2,5 → σ = 3 | 37 + 1,48 · 3 = 41,4; Einzel ≥ 33 N/mm² | identisch |
| QS2 Szenario Erstanlauf C25/30: 34,8/35,5/36,2 | Mittel 35,5 ≥ 34; min ≥ 26 | identisch |
| QS3 Identitätsprüfung C30/37 (Zylinder), n = 3: 31,2/28,5/30,1 | Mittel 29,93 < 31 → nicht konform | identisch |

Identitätskriterien (n = 1: f_ci ≥ f_ck − 4; n = 2–4: f_cm ≥ f_ck + 1; n = 5–6: f_cm ≥ f_ck + 2) und ÜK-Zuordnung (ÜK 1 ≤ C25/30, ÜK 2 ab C30/37; ÜK 3 entfallen) stimmen mit SCHWENK überein.

**Befunde**
- **behoben – T9-QS-1:** Titel DIN 1045-1000 („Zusammenarbeit …“ → „Grundlagen und Betonbauqualitätsklassen (BBQ)“, auch im Modul Modulinfos); „bis zu 80 % aller typischen Rissbildungs- und Prozessfehler“ ohne Beleg → Erfahrungsaussage ohne Quote; „Erstprüfungs-Messung“ auf der Baustelle → Annahmeprüfung; Tippfehler „Gesteinsdruckfestigkeiten“.
- **behoben – T9-QS-2:** Fremdüberwachung „prüft im eigenen Labor Luftporen und Ausbreitmaß“ (Frischbetonprüfungen, nur vor Ort möglich) und „E-Schein des Betonierpoliers“ (der E-Schein betrifft die Leitung der ständigen Betonprüfstelle) korrigiert.
- **offen – Frage T9-QS-3:** Der Reiter Betonbauklassen spricht durchgehend vom „BBQ-Koordinator“; die öffentlichen Wiedergaben nennen einen bereichsübergreifenden „Fachkoordinator“. Begriff angleichen?

**F-Freigabe-Stellen:** Tabellennummer „DIN 1045-3, Tabelle 2“ (Nachbehandlung) im Reiter Betonbauklassen.

**Umsetzung 29.10.2026 – T9-QS-3:** „BBQ-Koordinator“ → „bereichsübergreifender Fachkoordinator“ (drei Stellen im Reiter Betonbauklassen). Quelle: DIN 1045-1000:2023-08 (öffentliche Wiedergaben).

**Empfehlung:** freigabefähig nach Korrektur T9-QS-1/-2 und Klärung von T9-QS-3.

- [x] Modul freigeben (29.10.2026)

## 13. Betonpraxis (`betonpraxis`)

**Prüfumfang:** `src/modules/Betonpraxis.tsx` (sechs Reiter: Diagnostik, Zusammenhalt/Wasser-Simulator, Einbau, Nachbehandlung, WU-Richtlinie, Bohrkerne), `content/betonpraxis/Betonpraxis.json`, Kurzfassung, Lernziele.

**Nachrechnungen**

| Fall | Handrechnung | Modul |
|---|---|---|
| BP1 Zusammenhalt k = (175 − 70)/380 | 0,276 → „klebend / geringes Bluten“ (≤ 0,27 … ≤ 0,31) | identisch |
| BP2 Bohrkerne f_ck 30, n = 3 | min ≥ 0,85·(30 − 4) = 22,1; Mittel ≥ 0,85·(30 + 1) = 26,35 N/mm² | identisch |
| BP3 Nachbehandlung 15–25 °C, mittel, XM | 2 · 2 = 4 d | identisch (Tabelle aus `normParams.ts`) |
| BP4 WU-Mindestdicken | Wände BK 1 240/240/200, BK 2 200/240/100; Bodenplatten BK 1 250/–/200, BK 2 150/–/100 mm | identisch mit WU-Richtlinie 2017 Tab. 1 (Kenntnisstand) |

**Befunde**
- **behoben – T9-BP-1:** Identitätsprüfung „3er- bis 4er-Mittel: f_ci ≥ f_ck + 1“ → „2er- bis 4er-Mittel: f_cm ≥ …“ (Mittelwertkriterium, wie Modul Qualitätssicherung); „SVB: > 700 mm“ → Setzfließmaß SF1–SF3; Temperaturstufen der Nachbehandlung als 5 ≤ ϑ < 10 °C usw. (vorher „5 bis 9 °C“, Lücke bei 9,5 °C).
- **offen – Frage T9-BP-2 (WU, Fußnote):** „Ortbeton bei BK 2 auf bis zu 200 mm reduzierbar“ – die Ortbetonwand BK 2 hat bereits 200 mm. Nach meinem Kenntnisstand betrifft die Fußnote die Abminderung der Ortbetonwand **BK 1** von 240 auf 200 mm unter besonderen Maßnahmen. Bitte am Text der WU-Richtlinie 2017 bestätigen.
- Hinweis: Die Krell-Regeln (Zusatzwasser, Luftgehalt, Trittfestigkeit) sind als Praxis- bzw. Lehrwerte gekennzeichnet.

**F-Freigabe-Stellen:** Bohrkernkriterien DIN EN 13791:2020-02 (im Modul „manuell prüfen“).

**Umsetzung 29.10.2026 – T9-BP-2:** WU-Fußnote: Abminderung der Ortbetonwand auf 200 mm betrifft **BK 1** (240 → 200 mm) bei besonderen betontechnischen und ausführungstechnischen Maßnahmen (vorher „BK 2“); „vorläufig, F-Freigabe am Richtlinientext“. Quelle: DAfStb-Richtlinie Wasserundurchlässige Bauwerke aus Beton (2017).

**Empfehlung:** freigabefähig nach Korrektur T9-BP-1 und Klärung von T9-BP-2.

- [x] Modul freigeben (29.10.2026)

## 14. Modulinfos Stahlbetonbau (`stahlbeton_info`)

**Prüfumfang:** `ModuleInfo group="stahlbeton"`, `content/moduleinfo/daten.json` (Texte, Unterreiter, Literatur, Regelwerke, Formeln).

**Faktenstichprobe:** a_s = M_Ed/(z·f_yd), w_k = s_r,max·(ε_sm − ε_cm), w_max = 0,3 mm (XC2–XC4), ähnliche Wärmedehnung von Beton und Stahl – richtig.

**Befunde**
- **behoben – T9-SI-1:** „dimensionieren druckbelastete Stützen nach Theorie II. Ordnung“ und „Tragfähigkeitsnachweis einer schlanken Pendelstütze“ – der Stützenrechner rechnet nach Theorie I. Ordnung, Theorie II. Ordnung nur als Hinweis (Tranche 1, S-Befunde). Text angepasst; Regelwerke um DIN 1045-1000 und DIN 1045-2/-3:2023-08 ergänzt.

**Empfehlung:** freigabefähig nach Korrektur T9-SI-1.

- [ ] Modul freigeben (Infomodul, kein Prüfvermerk)

## 15. Carbonbeton (`carbonbeton`)

**Prüfumfang:** Inline-Rechnung in `src/modules/Carbonbeton.tsx` (Rechteckblock, f_td = f_tk/γ_tex), Beispiel, Formeln, `content/carbonbeton/Carbonbeton.json`, Lernziele; Normenstand.

**Nachrechnungen**

| Fall | Handrechnung | Modul |
|---|---|---|
| CB1 h 40, c 10, a_tex 100 mm²/m, f_tk 2 500, γ_tex 1,3, C50/60 | f_td = 1 923; f_cd = 28,33; y = 6,79 mm; z = 26,61 mm; m_Rd = 5,12 kNm/m | identisch |
| CB2 Dehnungskontrolle zu CB1 (E_tex 200 GPa, λ = 0,8) | x = 8,48 mm; ε_tex = 9,62 ‰; ε_c = 3,79 ‰ > 3,5 ‰ | **nicht geprüft** im Rechner |
| CB3 Gleichgewicht mit ε_c = 3,5 ‰ (Betonversagen maßgebend) | x = 8,20 mm; σ_tex = 1 860 N/mm²; m_Rd = 4,97 kNm/m (−3 %) | – |

**Normenstand:** DAfStb-Richtlinie „Betonbauteile mit nichtmetallischer Bewehrung“, Ausgabe 2024-01, fünf Teile; Teil 1 folgt DIN EN 1992-1-1/NA, Teil 3 DIN EN 13670 mit DIN 1045-3; Beton nach DIN EN 206 mit DIN 1045-2, kein Leichtbeton ([DIN Media](https://www.dinmedia.de/de/technische-regel/dafstb-betonbauteile-nichtmetallische-bewehrung/377433845)). DIN 1045-1000/-2/-3:2023-08 mit BBQ und ÜK 1/ÜK 2 (SCHWENK, Baunetz Wissen).

**Befunde**
- **behoben – T9-CB-2:** Das Modul nannte weder die Betonnormen noch BBQ und Überwachungsklassen. Ergänzt: Regelwerksabsatz (Richtlinie 2024-01, DIN 1045-2/-3:2023-08, BBQ nach DIN 1045-1000, ÜK 1/ÜK 2, Verwendbarkeitsnachweise abZ/aBG) und drei Regelwerkseinträge.
- **offen – Frage T9-CB-1 (Dehnungsgrenze):** Der Rechner setzt voraus, dass das Textil f_td erreicht, prüft aber nicht, ob der Beton vorher ε_cu3 = 3,5 ‰ erreicht. Bei den Standardwerten ist das der Fall (ε_c = 3,8 ‰), m_Rd liegt 3 % auf der unsicheren Seite. Vorschlag: Dehnungskontrolle in einen Kern `src/calc/carbonbeton.ts` mit Test übernehmen und bei Betonversagen das Gleichgewicht mit σ_tex = E_tex·ε_tex rechnen. γ_tex = 1,3 bleibt Lehrannahme (maßgebend Richtlinie bzw. Zulassung).

**F-Freigabe-Stellen:** γ_tex und Dauerstandsbeiwerte nach DAfStb-Richtlinie Teil 1 (nicht öffentlich).

**Umsetzung 29.10.2026 – T9-CB-1:** Neuer Kern `src/calc/carbonbeton.ts` (`carbonbetonBiegung`) mit Dehnungskontrolle ε_c ≤ 3,5 ‰: Erreicht der Beton die Grenzdehnung vor dem Textilbruch, folgt das Gleichgewicht mit σ_tex = E_tex·ε_tex < f_td. Standardfall: m_Rd = **4,97** statt 5,12 kNm/m (Beton maßgebend, x = 8,20 mm, σ_tex = 1 860 N/mm²). Anzeige von ε_c, σ_tex und maßgebendem Versagen, Beispiel um die Dehnungskontrolle ergänzt, neue Formel. f_cd weiter über `FCD_MODUL.carbonbeton` (Test `fcdModule` auf den Kern umgestellt). Tests `tests/carbonbeton.test.ts` (Standard, Textilversagen, Stetigkeit am Übergang, Grenzen, Fuzz 1 000) und `tests/modulpruefungTranche9.test.ts` (CB-Fälle). Quelle: Tranche 9, CB1–CB3; DIN EN 1992-1-1, 3.1.7/6.1 (analog).

**Empfehlung:** freigabefähig nach Korrektur T9-CB-2 und Klärung von T9-CB-1.

- [x] Modul freigeben (29.10.2026)

---

## Offene Fragen zur Entscheidung (Zusammenfassung)

| Nr. | Modul | Frage |
|---|---|---|
| T9-GL-1 | Ausgangsstoffe | RC-Höchstanteile je Expositionsklasse am Weißdruck DIN 1045-2:2023-08 (Anhang E) bestätigen; Bezug BK-N (≤ 25 Vol.-%) / BK-E ergänzen? |
| T9-BM-1 | Bindemittel | Anwendungsbereiche der Zementkarten (CEM II/A-LL, A-V u. a.) an den Anwendungstabellen DIN 1045-2:2023-08 abgleichen. |
| T9-NB-1 | Nachbehandlung | Unter 5 °C Verlängerung statt nur „Sondermaßnahmen“; Verdopplung auch für XF3/XF4 (NK 4) ergänzen; C70/85+ mindestens 1 Tag? |
| T9-IW-1 | Entwicklungen | Selbstheilung „bis 0,8 mm“ belegen oder auf Laborwerte um 0,5 mm ändern? |
| T9-BK-1 | Biokohlebeton | Projekthinweis mit Nennung von Hochschule und Transferzentrum beibehalten? |
| T9-QS-3 | Qualitätssicherung | „BBQ-Koordinator“ an den Normbegriff „Fachkoordinator“ angleichen? |
| T9-BP-2 | Betonpraxis | WU-Fußnote: Abminderung auf 200 mm bei BK 1 (Ortbetonwand 240 mm) statt BK 2? |
| T9-CB-1 | Carbonbeton | Dehnungskontrolle ε_c ≤ 3,5 ‰ in einen getesteten Kern übernehmen (Standardfall 3 % unsicher)? |

## Nachweis der Prüfung

- Unabhängige Nachrechnung: eigenes Python-Skript mit eigener Umsetzung der Gleichungen (Uno/ACI 305R, DIN 1045-3-Tabelle, EC 2 Gl. 3.2, DIN EN 206 8.2.1 und Anhang B, 44/12 mit IPCC-F_perm, Bogue/ASTM C150, Powers, Roussel/Greenhill, Hagen-Poiseuille, Rechteckblock mit Dehnungskontrolle), 92 Vergleiche; die Kernwerte stehen in `tests/modulpruefungTranche9.test.ts`.
- Öffentliche Quellen dieser Prüfung: [SCHWENK, Beton – Herstellung nach den aktuellen Normen (2026)](https://www.schwenk.de/wp-content/uploads/2026/03/swz_1671_02_Broschuere_Beton_Herstellung_nach_den_aktuellen_Normen_v4_Endfassung.pdf); [Baunetz Wissen, Beton nach Norm](https://www.baunetzwissen.de/beton/fachwissen/betonarten/beton-nach-norm-7680284); [Bauprofessor, BBQ](https://www.bauprofessor.de/news/betonbauqualitaetsklassen-bbq-din-norm-1045/); [DIN Media, DIN 1045-1000](https://www.dinmedia.de/de/norm/din-1045-1000/369463519); [DIN, Inhaltsverzeichnis DIN 1045-2:2023-08](https://www.din.de/de/mitwirken/normenausschuesse/nabau/veroeffentlichungen/wdc-beuth:din21:369550272/toc-3445766/download); [BFT International, DAfStb-THG-Richtlinie](https://bft-international.com/en/artikel/climate-friendly-concrete-construction-using-standardized-benchmarks-the-ghg-guideline-published-by-the-dafstb-4213466.html); [IFEU, Das neue Regelwerk DIN 1045-2](https://kreislaufwirtschaft-bau.rlp.de/fileadmin/kreislaufwirtschaft-bau/Startseite/Service/Fachgespraeche/neues_Regelwerk/220920_IFEU_Das_neue_Regelwerk_DIN_1045-2.pdf); [iTeh, EN 1008](https://standards.iteh.ai/catalog/standards/cen/8ab1a0fa-b727-48f7-9b31-739eba3732ca/en-1008-2002); [Heidelberg Materials, Sichtbetonklassen](https://www.heidelbergmaterials.de/system/files/2026-02/HM_Sichtbeton_Klassen_Anforderungen_Brosch%C3%BCre_1.pdf); [DIN Media, DAfStb Stahlfaserbeton 2021-06](https://www.dinmedia.de/de/technische-regel/dafstb-stahlfaserbeton/341626064); [Baunetz Wissen, DAfStb-Richtlinien](https://www.baunetzwissen.de/beton/fachwissen/regelwerke/dafstb-richtlinien-151216); [DIN Media, DIN 18551:2014-08](https://dinmedia.de/en/standard/din-18551/207441368); [DIN Media, Entwurf DIN 18551:2026-05](https://www.dinmedia.de/en/draft-standard/din-18551/400531731); [Baunetz Wissen, UHPC](https://www.baunetzwissen.de/beton/fachwissen/betonarten/ultrahochleistungsbeton-150988); [DIN Media, DAfStb nichtmetallische Bewehrung 2024-01](https://www.dinmedia.de/de/technische-regel/dafstb-betonbauteile-nichtmetallische-bewehrung/377433845); [IPCC 2019 Refinement, Biochar](https://www.Ipcc-nggip.Iges.Or.Jp/public/2019rf/pdf/4_Volume4/19R_V4_Ch02_Ap4_Biochar.pdf); [KIT-Katalog, Zement-Taschenbuch](https://katalog.bibliothek.kit.edu/bib/108549); [Schweitzer, Grübl u. a.](https://www.schweitzer-online.de/en/buch/Gruebl/Beton/9783433013403/A17510646/); [White Rose, Juenger u. a. 2019](https://eprints.whiterose.ac.uk/146768); [Structurae, De Larrard/Sedran 1994](https://structurae.net/en/literature/journal-article/optimization-of-ultra-high-performance-concrete-by-the-use-of-a-packing-model); [Bauhaus-Universität Weimar, Trümer 2019](https://www.uni-weimar.de/fileadmin/user/fak/bauing/professuren_institute/Finger_Institut/Studium/Promotionen/Zusammenfassung_der_Promotionsschrift_truemer.pdf); [DIN Media, DAfStb-Heft 561](https://6sku3uaup9f9.din.de/en/publication/heft-561-dafstb/107880416).

## Freigabe 29.10.2026

Entscheidung vom 28.10.2026: „Module ohne offene Frage freigeben“; Punkte, die nur am Normtext zu klären sind, blockieren die Freigabe (Prüfbogen Normtext, Abschnitt „Was ohne Normtext nicht weiterkommt“). Geprüft wurde je Modul: Empfehlung erfüllt (Korrekturen behoben, Klärungen entschieden und in den Abschnitten „Umsetzung 29.10.2026“ bzw. in den genannten PRs umgesetzt oder gekennzeichnet) und kein Normtextpunkt offen. Prüfvermerk in `src/data/pruefvermerke.ts`: „geprueft“, am 2026-10-29, passiv ohne Namen. Quizfreigaben sind davon getrennt.

Freigegeben:

- `beton_a_z` – nach Korrektur T9-AZ-1 bis -4 (behoben, #246)
- `herstellung_einbau` – freigabefähig, keine Frage
- `festbeton` – nach Korrektur T9-FB-1 (behoben, #246)
- `sichtbeton` – freigabefähig, keine Frage
- `sonderbetone` – nach Korrektur T9-SO-1 bis -4 (behoben, #246)
- `innovative_werkstoffe` – T9-IW-2/-3 behoben (#246), T9-IW-1 umgesetzt (#254)
- `biokohlebeton` – T9-BK-1 umgesetzt (#254, Projekthinweis entfernt)
- `qualitaetssicherung` – T9-QS-1/-2 behoben (#246), T9-QS-3 umgesetzt (#254)
- `betonpraxis` – T9-BP-1 behoben (#246), T9-BP-2 umgesetzt (#254, BK 1)
- `carbonbeton` – T9-CB-2 behoben (#246), T9-CB-1 umgesetzt (#254, Kern carbonbetonBiegung)

Nicht freigegeben:

- `grundlagen` – Prüfbogen: T9-GL-1a/b (Normtext)
- `bindemittel` – Prüfbogen: T9-BM-1a/b (Normtext)
- `nachbehandlung` – Prüfbogen: T9-NB-1a–d (Normtext)

Ohne Eintrag in `src/data/pruefvermerke.ts` (kein Fachmodul im Sinne der Prüfvermerke, daher kein Vermerk): `beton_info`, `stahlbeton_info`.
