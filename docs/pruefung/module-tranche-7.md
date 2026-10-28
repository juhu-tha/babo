# Modulprüfung Tranche 7 – Bauprodukte, Bauproduktenrecht und Verkehrswegebau (Befundliste zur Freigabe)

**Stand:** 28.10.2026 (Branch `pruefung/module-tranche7-10-28`, Basis origin/main b2cb8367)
**Status:** Vorschlag zur fachlichen Freigabe – noch nicht bestätigt.

> Nach der Freigabe eines Moduls wird in `src/data/pruefvermerke.ts` der Prüfvermerk „geprüft am …“ gesetzt (Passiv, ohne Namen). Mit dieser Befundliste wurden **keine** Prüfvermerke und **keine** Quizfragen geändert.

## Vorgehen

- **Auswahl (20 Module):** die Gruppe „Bauprodukte“ ohne die Ausbau- und Werkstoffprodukte: Modulinfos, Baustoffindustrie, Innovationen, die vier Recht-Module, Beton, Betonfertigteile, Betonwaren, Mauerwerk, Dach und Fassade sowie die acht Reiter-Routen des Verkehrswegebaus (`bp_verkehr_*`).
- **Schwerpunkt Normstand:** BauPVO (EU) 2024/3110 mit den Übergangsfristen, RStO 12/24, die 2026 neu eingeführten TL/ZTV Asphalt-StB 26 und ZTV/TL Beton-StB 26, DIN 1045-4/-40:2023-08 und DIN EN 14487-1:2023-03. DWA-A 138-1:2024-10 im Tiefbau war bereits umgestellt; der Hinweis wurde nur nachgeprüft.
- **Prüfumfang je Modul** (wie Tranche 1 bis 3):
  - Wo das Modul rechnet, mindestens drei eigene Nachrechnungen mit einem eigenen Python-Skript. Es setzt die Gleichungen selbst um, übernimmt keine Testwerte und schließt Randfälle ein.
  - Wo das Modul nicht rechnet, mindestens fünf Aussagen als Stichprobe gegen öffentliche Quellen.
  - Außerdem: Fachtext und Normstand, Grenzen (`src/data/rechnerGrenzen.ts`), Beispiele, Lernziele und Kurzfassung, Quellen und Stellen „vorläufig, F-Freigabe“.
- **Ergebnis der Nachrechnung:** Alle Rechenkerne und Rechenbeispiele stimmen mit der eigenen Rechnung überein (Toleranz 0,5 %). Der Regressionstest `tests/modulpruefungTranche7.test.ts` enthält 57 Vergleiche.
  - Abweichend war nur die Übungsaufgabe zur RStO-Belastungsklasse (T7-RS-1): falsche Formel, Rechenfehler und falsche Klassengrenzen.
- **Quellen:** Es wurden nur öffentliche Quellen verwendet, Normtexte wurden nicht abgeschrieben. Wo der Regelwerkstext zur Bestätigung nötig ist, steht die Stelle unter „F-Freigabe“ bzw. als Frage.

## Übersicht

| Nr. | Prüfeinheit | Prüfvermerk-ID | Rechnung | Empfehlung |
|---|---|---|---|---|
| 1 | Modulinfos Bauprodukte | – (Info-Modul) | Formel f_cm ≥ f_ck + 1,48·σ | freigabefähig |
| 2 | Baustoffindustrie | – (Info-Modul) | Lieferradius (Beispiel) | freigabefähig nach Klärung von T7-BI-1 |
| 3 | Innovationen & F&E | `bp_innovationen` | Bewehrungsquerschnitt (Beispiel), TRL-Check | freigabefähig nach Korrektur T7-IN-1/-2/-3 und Klärung von T7-IN-4 |
| 4 | CE vs. Ü & MVV TB | `bp_recht_grundlagen` | – (Faktenprüfung) | freigabefähig nach Korrektur T7-RG-1/-2 |
| 5 | AVCP-Systeme | `bp_recht_avcp` | – | freigabefähig nach Korrektur T7-AV-1 |
| 6 | Konformität & Auditierung | `bp_recht_konformitaet` | – | freigabefähig nach Korrektur T7-AV-1 |
| 7 | Normenarbeit im Bauwesen | `bp_recht_normen` | – | freigabefähig |
| 8 | Beton (Frisch/Fest) | `bp_beton` | 5-%-Quantil (Beispiel) | freigabefähig nach Klärung von T7-BE-1 |
| 9 | Betonfertigteile | `bp_betonfertigteile` | Eigenlast Hohlplatte (Beispiel) | freigabefähig nach Korrektur T7-BF-1 |
| 10 | Betonwaren | `bp_betonwaren` | Spaltzug DIN EN 1338 (Beispiel) | freigabefähig nach Korrektur T7-BW-1 und Klärung von T7-BW-2 |
| 11 | Mauerwerk (Bauprodukte) | `bp_mauerwerk` | f_k, n_Rd (Beispiel) | freigabefähig nach Korrektur T7-MW-1 und Klärung von T7-MW-2/-3 |
| 12 | Dach & Fassade | `bp_dach_fassade` | U_w (Beispiel) | freigabefähig |
| 13 | Dimensionierung (RStO 12/24) | `bp_verkehr_rsto` | Beanspruchung B (Übungsaufgabe) | freigabefähig nach Korrektur T7-RS-1 und Klärung von T7-RS-2 |
| 14 | Asphaltsorten | `bp_verkehr_asphalt` | – | freigabefähig |
| 15 | Bitumen & Gesteine | `bp_verkehr_bitumen` | – | freigabefähig nach Klärung von T7-BT-1 |
| 16 | Labor-Prüfmethoden | `bp_verkehr_pruefung` | `asphaltHohlraum` | freigabefähig nach Korrektur T7-PR-1 |
| 17 | Betondecken (ZTV) | `bp_verkehr_betondecken` | `westergaardRand`, `betondeckenFugen` | freigabefähig nach Korrektur T7-BD-1 und Klärung von T7-BD-2/-3 |
| 18 | Tiefbau & Entwässerung | `bp_verkehr_tiefbau` | `rigole` | freigabefähig (F-Stelle f_Ort bleibt) |
| 19 | Bahnbau | `bp_verkehr_bahn` | `schienenTemperatur` | freigabefähig nach Klärung von T7-BA-1 |
| 20 | Tunnelbau | `bp_verkehr_tunnel` | `spritzbetonRing` | freigabefähig |

**Behobene Fehler (dieser PR):**
- **T7-RG-1:** Übergangsregeln der BauPVO (EU) 2024/3110 nach Art. 94 und 95 genau benannt (vorher pauschal „gestaffelte Übergangsfrist“).
- **T7-RG-2:** Umweltangaben: Die Pflicht greift je Produktfamilie gestaffelt (Art. 15 Abs. 3), der DPP folgt erst über delegierte Rechtsakte; vorher „Hersteller müssen den CO₂-Fußabdruck … deklarieren“ ohne Einschränkung.
- **T7-AV-1:** System 3+ – die notifizierte Stelle *validiert* Eingangsdaten, Annahmen, Berechnung und Software (Validierungsbericht); vorher „bewertet“ bzw. „Überprüfung der Umweltmerkmale in der DoP“. Die Systemzahl („fünf“) ist um 3+ ergänzt.
- **T7-IN-1:** „Normungsentwurf DIN 1045-100 in Vorbereitung“ (DIN 1045-100 regelt Ziegeldecken) ersetzt durch die DAfStb-Richtlinie „Betonbauteile mit nichtmetallischer Bewehrung“ (2024-01). **T7-IN-2:** Myzel „sehr gute Wärmeleitfähigkeit“ → „niedrige Wärmeleitfähigkeit“. **T7-IN-3:** TRL „von der EU-Kommission nach ISO 16290 standardisiert“ richtiggestellt.
- **T7-BF-1:** DIN 1045-4:2023-08 mit richtigem Titel, DIN 1045-40:2023-08 ergänzt; DIN EN 13369 ist die gemeinsame Grundnorm, harmonisiert sind die Produktnormen.
- **T7-BW-1:** Frost-Tausalz-Kennwert von Pflaster/Platten nicht „XF4“ (Expositionsklasse nach DIN EN 206), sondern Klasse 3 (Kennzeichnung D) nach DIN EN 1338/1339; Rohrstatik DWA-A 127-1 statt ATV-DVWK-A 127.
- **T7-MW-1:** Kerndämmung mit EPS/PUR nicht „Klasse A1 bis A2“.
- **T7-RS-1:** Formel der Beanspruchung B nach RStO 12/24 (Rechner-Reiter, Formelsammlung, Lernziel) und Übungsaufgabe `t_rsto_belastungsklasse` (Formel, Rechenweg, Klassengrenzen, Ergebnis Bk32 statt Bk10).
- **T7-PR-1:** Hohlraumrechner meldete „Konform (ZTV Asphalt-StB Zielbereich …)“, obwohl der Bereich ein Lehrwert ist.
- **T7-BD-1:** Normstand der Regelwerke im Verkehrswegebau: ZTV/TL Beton-StB 26, RDO Beton 24, TL/ZTV Asphalt-StB 26, TL Gestein-StB 04/23, ZTV/TL SoB-StB 20, DIN EN 14487-1:2023-03.
- **T7-TB-1:** Tiefbau: „Sicherheitsbeiwert f_S“ → „Zuschlagsfaktor f_Z“ (wie im Kern).

---

## 1. Modulinfos Bauprodukte (`bauprodukte_info`)

**Prüfumfang:** Gruppe `bauprodukte` in `src/modules/moduleinfo/daten.tsx` und `content/moduleinfo/daten.json` (Basics-, Didaktik-Karten, Literatur, Regelwerke, Formel).

**Fakten-Stichprobe**

| Aussage | Ergebnis | Quelle |
|---|---|---|
| BauPVO anwendbar seit 08.01.2026, übergangsweise VO 305/2011 | richtig | Art. 96, Art. 94 ([gesetze.legal, Art. 96](https://gesetze.legal/eu/vo_eu_2024_3110/96), [Art. 94](https://gesetze.legal/eu/vo_eu_2024_3110/94)) |
| System 3+ = Validierung der Umweltleistungsbewertung durch notifizierte Stellen | richtig | Anhang IX ([gesetze.legal, Anhang IX](https://gesetze.legal/eu/vo_eu_2024_3110/anhang_ix)) |
| Kombinierte Leistungs- und Konformitätserklärung (DoPC) | richtig | [IHK Bodensee-Oberschwaben](https://www.ihk.de/bodensee-oberschwaben/branchen/industrie-und-bauwirtschaft/inverkehrbringen-und-verwenden-von-bauprodukten-1940112) |
| Umweltangaben zunächst GWP, je Produktfamilie ab Geltung der neuen hTS | richtig | Art. 15 Abs. 3 ([gesetze.legal, Art. 15](https://gesetze.legal/eu/vo_eu_2024_3110/15)) |
| DPP verpflichtend 18 Monate nach dem delegierten Rechtsakt | Sekundärquelle bestätigt (Art. 75 enthält nur die Ermächtigung) | [Deutsche Handwerks Zeitung, Zeitplan DPP](https://www.deutsche-handwerks-zeitung.de/?p=358024) |
| f_cm ≥ f_ck + 1,48·σ (stetige Herstellung) | richtig (Nachrechnung: f_ck = 30, σ = 3 → 34,44 N/mm²) | DIN EN 206, 8.2.1 (wie Tranche 1) |

**Befunde:** keine.

**Empfehlung:** freigabefähig. (Kein Prüfvermerk vorhanden, Info-Modul.)

## 2. Baustoffindustrie (`bp_baustoffindustrie`)

**Prüfumfang:** `src/modules/BpBaustoffindustrie.tsx`, `content/bpbaustoffindustrie/BpBaustoffindustrie.json` (Marktsegmente, Branchentabelle, Datenbanken, Lieferradius-Beispiel).

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| BI1 | Kies: P = 30, K_prod = 12, K_fix = 3 EUR/t, k_var = 0,30 EUR/(t·km) | R_max = 15/0,30 = 50 km | identisch |
| BI2 | Zement (Lehrwerte): 110 − 70 − 5 EUR/t, 0,20 EUR/(t·km) | R_max = 175 km | Formel identisch; passt zu „überregional ~150 km“ |
| BI3 | Summe der Produktionswerte der Tabelle | 3,5 + 4,2 + 12,8 + 2,1 + 1,6 + 4,5 = 28,7 Mrd. € | Tabelle als „Lehrwert“ gekennzeichnet; Text nennt rund 38 Mrd. € Branchenumsatz |

**Befunde**
- behoben: keine.
- **offen – Frage T7-BI-1:** Die Kennzahlen „rund 140 000–150 000 Beschäftigte, rund 38 Mrd. € Umsatz (bbs, Stand 10/2026)“ waren öffentlich nicht nachprüfbar. Belegt ist nur eine bbs-Umsatzstatistik nach Wirtschaftszweigen für Januar bis Juni 2022 (8,1 Mrd. €, Betriebe ab 50 Beschäftigten; [bbs-Umsatzstatistik über kalksandstein.de](https://kalksandstein.de/media/user_upload/bundesverband_baustoffe_-_steine_und_erden_-_umsatz_nach_wirtschaftszweigen.pdf)). Die Tabelle (Summe 28,7 Mrd. €) und der Text (38 Mrd. €) passen nicht zusammen. Frage: Zahlen am aktuellen bbs-Jahresbericht bestätigen oder die Tabelle als Größenordnung ohne Summe kennzeichnen?

**Empfehlung:** freigabefähig nach Klärung von T7-BI-1. (Kein Prüfvermerk vorhanden, Info-Modul.)

## 3. Innovationen & F&E (`bp_innovationen`)

**Prüfumfang:** `src/modules/BpInnovationen.tsx` (TRL-Skala, Förderlandschaft, sechs Werkstoffporträts, Zulassungswege, Reifegrad-Check), `content/bpinnovationen/BpInnovationen.json`, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| IN1 | F = 100 kN, B500B, f_yd = 500/1,15 | A_s = 230 mm² (3 Ø 10 = 236 mm²) | identisch |
| IN2 | Carbon f_fd = 1200 N/mm² (Lehrannahme) | A_f = 83,3 mm²; Verhältnis 2,76 ≈ 2,8 | identisch |
| IN3 | Ca(OH)₂ + CO₂ → CaCO₃ + H₂O(l), Standardbildungsenthalpien | ΔH = −114 kJ/mol | identisch („ca. −114 kJ/mol“) |
| IN4 | Reifegrad-Check: Konzept + Labor angekreuzt | TRL 4 | identisch; Hinweis: höchste angekreuzte Stufe zählt, auch wenn Vorstufen fehlen |

**Fakten-Stichprobe:** Mängelansprüche bei Bauwerken verjähren nach 5 Jahren (§ 634a BGB) – richtig. Produktneutrale Ausschreibung nach § 7 VOB/A – richtig. Die abZ gilt in der Regel 5 Jahre – richtig. Die DAfStb-Richtlinie „Betonbauteile mit nichtmetallischer Bewehrung“ ist 2024-01 erschienen, mit 5 Teilen für Stäbe und Gitter, Bemessung angelehnt an DIN EN 1992-1-1 ([DIN Media, DAfStb-Richtlinie](https://www.dinmedia.de/de/technische-regel/dafstb-betonbauteile-nichtmetallische-bewehrung/377433845)).

**Befunde**
- **behoben – T7-IN-1:** Carbonbeton: „Normungsentwurf DIN 1045-100 in Vorbereitung“ war falsch (DIN 1045-100 regelt Ziegeldecken). Jetzt: DAfStb-Richtlinie 2024-01 mit ihren Teilen; abZ/aBG für Einzelsysteme bleiben genannt. Die Richtlinie stand schon in der Literaturliste (DAfStb-Heft 660).
- **behoben – T7-IN-2:** Myzel: „Sehr gute Wärmeleitfähigkeit (λ ≈ 0,038 … 0,042)“ sagt das Gegenteil des Gemeinten. Jetzt: niedrige Wärmeleitfähigkeit, Lehrwert, maßgebend ist die Herstellerangabe.
- **behoben – T7-IN-3:** Die TRL-Skala wird nicht „von der Europäischen Kommission nach ISO 16290 standardisiert“. Die Kommission hat sie für ihre Forschungsrahmenprogramme übernommen, ISO 16290:2013 normt sie. Außerdem: „AVCP-Systeme (1+ … 4)“ um 3+ ergänzt.
- **offen – Frage T7-IN-4:** Myzel „natürlicher Brandschutz durch Chitin (Klasse B2/B1)“ mischt DIN-4102-Klassen in eine Euroklassen-Umgebung und ist ohne Prüfnachweis nicht belegbar. Ebenso „DIBt-Fast-Track für Nachhaltigkeit“ (kein öffentliches Verfahren dieses Namens gefunden). Streichen oder belegen?
- Hinweis: Der Reifegrad-Check wertet die höchste angekreuzte Stufe, auch ohne die Vorstufen (Lehrwerkzeug). Eine Prüfung der Reihenfolge wäre möglich, ist aber kein Fehler.

**Empfehlung:** freigabefähig nach Korrektur T7-IN-1/-2/-3 und Klärung von T7-IN-4.

- [ ] Modul freigeben

## 4. CE vs. Ü & MVV TB (`bp_recht_grundlagen`)

**Prüfumfang:** `src/modules/BpRechtliches.tsx` (Unterreiter „grundlagen“), `content/bprechtliches/BpRechtliches.json` (Rechtsstand, BauPVO, DoP/CE, hEN/ETA, abZ/abP/ZiE, EuGH C-100/13, MVV TB, DPP), Lernziele.

**Fakten-Stichprobe**

| Aussage | Ergebnis | Quelle |
|---|---|---|
| BauPVO in Kraft 07.01.2025, anwendbar 08.01.2026 | richtig | Art. 96 ([gesetze.legal](https://gesetze.legal/eu/vo_eu_2024_3110/96)) |
| VO 305/2011 „gilt im Rahmen einer gestaffelten Übergangsfrist weiter“ | **ungenau → T7-RG-1** | Art. 94, 95 ([Art. 94](https://gesetze.legal/eu/vo_eu_2024_3110/94), [Art. 95](https://gesetze.legal/eu/vo_eu_2024_3110/95)) |
| EuGH, 16.10.2014, C-100/13: kein Ü-Zeichen für CE-Produkte | richtig | [Handwerksblatt](https://www.handwerksblatt.de/betriebsfuehrung/deutsche-anforderungen-an-bauprodukte-sind-eu-rechtswidrig) |
| ETA als freiwilliger Weg zur CE-Kennzeichnung ohne hEN | richtig | Art. 19/26 VO 305/2011 bzw. 2024/3110 |
| Beton, Betonstahl, Spannstahl in DE ohne CE | richtig (keine hEN; national Ü bzw. abZ) | MVV TB (wie Quiz `q_bpr_4`) |
| Umweltangaben „rechtlich bindende Pflicht“ für alle Hersteller | **überzogen → T7-RG-2** | Art. 15 Abs. 3 ([gesetze.legal](https://gesetze.legal/eu/vo_eu_2024_3110/15)); [One Click LCA](https://oneclicklca.com/de/resources/articles/cpr-epds-deep-dive-for-construction-professionals) |

**Befunde**
- **behoben – T7-RG-1 (Übergangsfristen):** Der Rechtsstand nennt jetzt genau:
  - Die VO 305/2011 ist seit 08.01.2026 aufgehoben. Die Artikel und Anhänge (u. a. III und V), die für Produkte unter alten hEN nötig sind, gelten bis spätestens 08.01.2040 (Art. 94).
  - Die alten hEN bleiben gültig, bis die Kommission sie zurückzieht (Art. 95 Abs. 3).
  - Die neuen Pflichten gelten je Produktfamilie ein Jahr nach dem Durchführungsrechtsakt (Art. 95 Abs. 9).
  - EAD gelten bis 09.01.2031, darauf gestützte ETA längstens bis 09.01.2036 (Art. 95 Abs. 4).
  - Notifizierte Stellen sind bis 08.01.2030 neu zu bewerten (Art. 95 Abs. 2).
- **behoben – T7-RG-2 (Umweltangaben, DPP):** Statt „Hersteller müssen den CO₂-Fußabdruck … deklarieren“:
  - Die Umweltangaben gehören zur Leistungs- und Konformitätserklärung, die Pflicht greift je Produktfamilie mit der harmonisierten technischen Spezifikation.
  - Mindestumfang: ab 2026 GWP (Anhang II a–d), ab 2030 die Buchstaben e–m, ab 2032 die Buchstaben n–s.
  - Der DPP kommt erst über delegierte Rechtsakte (Art. 75 ff.). Der Verweis auf die ESPR ist entfallen; die ESPR gilt für Bauprodukte nur nachrangig.
- Hinweis (Text „hEN: muss der Hersteller nach dieser Norm produzieren“): genauer wäre „muss die Leistung nach dieser Norm erklären“. Das ist eine vertretbare Vereinfachung.

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig nach Korrektur T7-RG-1/-2.

- [ ] Modul freigeben

## 5. AVCP-Systeme (`bp_recht_avcp`)

**Prüfumfang:** Unterreiter „avcp“ (Tabelle 1+ bis 4 und 3+, Rollen Hersteller/notifizierte Stelle, Hinweis Beton/Betonstahl), Formel, Lernziele.

**Fakten-Stichprobe** (Anhang IX VO 2024/3110, [gesetze.legal](https://gesetze.legal/eu/vo_eu_2024_3110/anhang_ix))
- 1+: notifizierte Stelle mit Produkttyp, Erstinspektion, laufender Überwachung und Stichprobenprüfung vor dem Inverkehrbringen. Richtig.
- 1: wie 1+, ohne Audit-Testing. Richtig.
- 2+: Die Stelle bescheinigt nur die WPK. Richtig („Stelle zertifiziert ausschließlich die WPK“).
- 3: Ein notifiziertes Prüflabor bestimmt den Produkttyp, keine Werksüberwachung. Richtig.
- 4: keine notifizierte Stelle. Richtig.
- 3+: Validierung (Validierungsbericht), Werksinspektion für unternehmensspezifische Daten, keine physische Prüfung. **Vorher „Bewertung … durch notifizierte Stelle“ → T7-AV-1.**
- Produktbeispiele: Zement 1+, Rauchwarnmelder/Feuerschutzabschlüsse 1, Mauersteine Kat. I und Gesteinskörnungen 2+, Badkeramik 4. Plausibel.

**Befunde**
- **behoben – T7-AV-1:** Zeile System 3+, Einleitung („fünf AVCP-Klassen“), Untertitel („Die fünf … Systeme“) und Verifizierungsabsatz (Modul 6) angepasst.

**Empfehlung:** freigabefähig nach Korrektur T7-AV-1.

- [ ] Modul freigeben

## 6. Konformität & Auditierung (`bp_recht_konformitaet`)

**Prüfumfang:** Unterreiter „begriffe“ (Akkreditierung, Notifizierung, Zertifizierung, Verifizierung, Auditierung, Ablauf in vier Schritten), Lernziele.

**Fakten-Stichprobe:** Akkreditierung nach VO (EG) 765/2008, in Deutschland ausschließlich durch die DAkkS – richtig. Für Bauprodukte notifiziert das DIBt; Beispiel: Kiwa Greven, Kennnummer 0799, „notifying authority: DIBt“ ([Kiwa, Notifizierungsbescheid](https://www.kiwa.com/493e2b/globalassets/germany/standorte/greven/notifizierung_cpr-0799_2025-02-27_gesamt.pdf)). Die NANDO-Nummer ist vierstellig – richtig. EPD-Verifizierung nach ISO 14025/DIN EN 15804 durch einen unabhängigen Verifizierer – richtig. Notifizierte Stellen sind bis 08.01.2030 nach neuem Recht neu zu benennen (Art. 95 Abs. 2) – im Modul nicht erwähnt, steht jetzt im Rechtsstand (Modul 4).

**Befunde**
- **behoben – T7-AV-1** (Verifizierungsabsatz): „System 3+ … durch eine notifizierte Stelle bewertet“ → „validiert (Validierungsbericht nach Anhang IX)“.

**Empfehlung:** freigabefähig nach Korrektur T7-AV-1.

- [ ] Modul freigeben

## 7. Normenarbeit im Bauwesen (`bp_recht_normen`)

**Prüfumfang:** Unterreiter „normenarbeit“ (DIN/CEN/ISO, Wiener Vereinbarung, Weg zur Norm, Rechtsstatus, Überprüfung), Lernziele.

**Fakten-Stichprobe**

| Aussage | Ergebnis | Quelle |
|---|---|---|
| DIN gegründet 1917, Sitz Berlin | richtig (22.12.1917 als NADI) | [DIN, Geschichte](https://www.din.de/en/din-and-our-partners/din-e-v/history) |
| CEN: 34 Mitgliedsländer | richtig | [IBA, Normungsorganisationen](https://iba.online/en/knowledge/space-planning/regulations/standardisation-bodies/) |
| ISO mit Sitz in Genf | richtig | ebd. |
| Vertrieb über DIN Media, keine amtliche Veröffentlichung | richtig | (DIN Media, vormals Beuth) |
| Einführung über MVV TB (§ 85a MBO) macht verbindlich, verleiht nicht den Status a. a. R. d. T. | richtig, sauber formuliert | MBO § 85a |
| Überprüfung spätestens alle 5 Jahre | richtig | DIN 820 |

**Befunde:** keine. Hinweis: Die Einspruchsfrist „2 bis 3 Monate“ ist als Bandbreite für DIN-Entwurf und prEN vertretbar.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 8. Beton (Frisch/Fest) (`bp_beton`)

**Prüfumfang:** `src/modules/BpBeton.tsx`, `content/bpbeton/BpBeton.json` (Transport- und Baustellenbeton, Beton nach Eigenschaften und nach Zusammensetzung, Ü-Zeichen, CSC, Beispiel C30/37), Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| BE1 | f_cm = 38,5, s = 5,0 N/mm² | f_ck = 38,5 − 1,645·5,0 = 30,28 ≥ 30 → C30/37 | identisch (30,3) |
| BE2 | f_cm = 35,0, s = 3,0 | f_ck = 30,07 (Randfall knapp über 30) | Formel identisch |
| BE3 | stetige Herstellung, σ = 4,0 | f_cm,erf ≥ 30 + 1,48·4 = 35,9 N/mm² | Formelsammlung identisch |

**Befunde**
- behoben: keine.
- **offen – Frage T7-BE-1:** „CSC-Zertifikat … relevant für QNG/DGNB“. Für DGNB ist das belegt (Kriterium verantwortungsbewusste Ressourcengewinnung). Für QNG war keine öffentliche Anforderung an CSC auffindbar. Auf „DGNB/BNB“ einschränken?
- Hinweis: Der Normbezug „DIN EN 206 / DIN 1045-2“ ohne Ausgabe ist korrekt; DIN 1045-2:2023-08 ist laut Modul Dauerhaftigkeit über die MVV TB 2024/1 eingeführt.

**Empfehlung:** freigabefähig nach Klärung von T7-BE-1.

- [ ] Modul freigeben

## 9. Betonfertigteile (`bp_betonfertigteile`)

**Prüfumfang:** `src/modules/BpBetonfertigteile.tsx`, `content/bpbetonfertigteile/BpBetonfertigteile.json` (Elementdecke, Doppelwand, Hohlplatte, Konstruktionsklassen, Vor- und Nachteile, Beispiel, Formeln, Regelwerke), Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| BF1 | h = 26,5 cm, γ = 25 kN/m³, η = 0,40 | g = 6,63; g_Hohl = 3,98; Δg = 2,65 kN/m² | identisch (6,6/4,0/2,6) |
| BF2 | h = 32 cm, η = 0,45 (Rand des Lehrbereichs) | g_Hohl = 4,40 kN/m² | Formel G_Hohl = (1 − η)·G_Voll identisch |
| BF3 | v_Rdi nach DIN EN 1992-1-1, 6.2.5 | Formel c·f_ctd + μ·σ_n + ρ·f_yd·(μ sin α + cos α) ≤ 0,5·ν·f_cd | identisch |

**Befunde**
- **behoben – T7-BF-1:** Die Regelwerke nannten „DIN 1045-4:2023-08 (Zusatzregeln für Herstellung und Konformität von Fertigteilen)“. Das ist der Titel der Ausgabe 2012-02. DIN 1045-4:2023-08 heißt „Betonfertigteile – Allgemeine Regeln“, setzt DIN EN 13369:2018-09 um und ersetzt DIN 1045-4:2012-02 und DIN V 20000-120 ([DIN Media, DIN 1045-4:2023-08](https://www.dinmedia.de/de/norm/din-1045-4/369667746)). Fertigteile ohne spezifische Norm regelt DIN 1045-40:2023-08 ([DIN Media, DIN 1045-40](https://www.dinmedia.de/de/norm/din-1045-40/369667771)). Der Absatz „Bauaufsichtliche Zulassung“ nannte DIN EN 13369 eine „harmonisierte europäische Grundnorm“. Er trennt jetzt die gemeinsamen Regeln (DIN EN 13369 / DIN 1045-4) von den harmonisierten Produktnormen (DIN EN 1168, 13747, 14992) mit DoP und CE.
- Hinweis: „Sichtbetonklassen SB3/SB4 ohne bauseitige Nachbesserung“ ist werblich. Nach dem DBV/VDZ-Merkblatt Sichtbeton ist die Klasse vertraglich zu vereinbaren. Kein Fehler im engeren Sinn.

**Empfehlung:** freigabefähig nach Korrektur T7-BF-1.

- [ ] Modul freigeben

## 10. Betonwaren (`bp_betonwaren`)

**Prüfumfang:** `src/modules/BpBetonwaren.tsx`, `content/bpbetonwaren/BpBetonwaren.json` (Vorsatz- und Kernbeton, Sofortentschalung, Rohre und Muffen, BSK, Schadensbilder, Beispiel Spaltzug), Lernziele.

**Nachrechnungen** (DIN EN 1338, Anhang F: T = 0,637·k·P/S, S = l·t, k = 1,3 − 30·(0,18 − t/1000)²)

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| BW1 | P = 72 kN, l = 200 mm, t = 80 mm | k = 1,000; T = 2,87 N/mm² < 2,9 (Einzelwert); F/l = 360 ≥ 250 N/mm | identisch |
| BW2 | P = 95 kN, l = 200, t = 100 mm | k = 1,108; T = 3,35 N/mm² | – (eigener Fall, Dickenfaktor > 1) |
| BW3 | P = 50 kN, l = 160, t = 60 mm | k = 0,868; T = 2,88 N/mm² | – (eigener Fall, Dickenfaktor < 1) |

**Befunde**
- **behoben – T7-BW-1:**
  - Unter „Frost-Tausalz-Axiom“ stand „XF4 (≤ 1,0 kg/m² Abwitterung)“. XF4 ist eine Expositionsklasse nach DIN EN 206; Pflaster und Platten werden nach DIN EN 1338/1339 in Klasse 3 (Kennzeichnung D) eingestuft. Jetzt: „Klasse 3 (Kennz. D): Abwitterung ≤ 1,0 kg/m² im Mittel“.
  - Rohrstatik: „ATV-DVWK-A 127“ → „DWA-A 127-1, früher ATV-DVWK-A 127“, wie bereits in der Literaturliste.
- **offen – Frage T7-BW-2:** „Prüfdruck ≥ 0,5 bar (Kanal)“ bei Betonrohren nach DIN EN 1916. Für die Produktprüfung der Wasserdichtheit ist nach meinem Kenntnisstand ein Innendruck von 1 bar (100 kPa) vorgesehen; 0,5 bar entspricht eher der Leitungsprüfung nach DIN EN 1610. Bitte am Normtext bestätigen. F-Freigabe: zusätzlich der Einzelwert der Abwitterung (≤ 1,5 kg/m²), der im Modul nicht genannt ist.

**Empfehlung:** freigabefähig nach Korrektur T7-BW-1 und Klärung von T7-BW-2.

- [ ] Modul freigeben

## 11. Mauerwerk – Bauprodukte (`bp_mauerwerk`)

**Prüfumfang:** `src/modules/BpMauerwerk.tsx`, `content/bpmauerwerk/BpMauerwerk.json` (zehn Stein- und Dämmstoffdatenblätter, Mörtelarten, Wandsysteme, Marktübersicht, Beispiel KS-Innenwand), Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern / Modul |
|---|---|---|---|
| MW1 | KS Gruppe 1, NM, K = 0,55, f_b = 20, f_m = 10, t = 175 mm, Φ = 0,8 | f_k = 8,93; f_d = 0,85·f_k/1,5 = 5,06 N/mm²; n_Rd = 709 kN/m | identisch (`fkEmpfehlungEN`, `fdAusFk`; Text 714 ≈ 710 aus gerundetem f_d) |
| MW2 | KS, Dünnbettmörtel, K = 0,80, f_b = 20 | f_k = 0,80·20^0,85 = 10,21 | identisch |
| MW3 | VIP λ = 0,007 vs. EPS 0,035 | Dickenverhältnis 5 | identisch („etwa fünfmal dünner“) |

**Befunde**
- **behoben – T7-MW-1:** Die Kerndämmung (Steinwolle, EPS oder PUR) war mit „Klasse A1 bis A2“ beschriftet. EPS ist nicht A1/A2. Jetzt: „A1 (Mineralwolle) bis E (EPS); PUR je nach Produkt“.
- **offen – Frage T7-MW-2 (WDVS):** Die WDVS-Karte nennt „A1 bis B1“ und mischt damit Euroklassen und DIN 4102. Vorschlag: „A2-s1,d0 (Mineralwolle-WDVS) bis B-s1,d0 (EPS-WDVS)“. Die Systemeinstufung steht in der jeweiligen abZ/aBG bzw. ETA. Außerdem: Sind DIN EN 13499/13500 noch die geltende Grundlage (DIN EN 17237)?
- **offen – Frage T7-MW-3 (Kennwerte):** Lehmstein „λ 0,47–0,81 W/(mK) bei 1200–1800 kg/m³“. Nach DIN 4108-4 (Lehmbaustoffe) gehört 0,81 nach meinem Kenntnisstand zu 1700 kg/m³, 1800 kg/m³ hat 0,91. Klinker „Wasseraufnahme ≤ 6 M.-%“ (DIN 105-100 bzw. DIN 20000-401). Bitte beide Werte am Normtext bestätigen (F-Freigabe).

**Empfehlung:** freigabefähig nach Korrektur T7-MW-1 und Klärung von T7-MW-2/-3.

- [ ] Modul freigeben

## 12. Dach & Fassade (`bp_dach_fassade`)

**Prüfumfang:** `src/modules/BpDachFassade.tsx`, `content/bpdachfassade/BpDachFassade.json` (Dachdeckungen, VHF, Fenster, Befestigung, Beispiel U_w), Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| DF1 | A_g = 1,30, U_g = 0,6; A_f = 0,52, U_f = 1,2; l_g = 4,6 m, Ψ_g = 0,04 | U_w = 1,588/1,82 = 0,873 W/(m²K) | identisch (0,87) |
| DF2 | wie DF1, Ψ_g = 0,08 (Aluminium-Abstandhalter) | U_w = 0,974 | – (eigener Fall; zeigt Anteil Glasrand) |
| DF3 | VIP λ = 0,007 vs. EPS 0,035 | 5-mal bessere Dämmwirkung | identisch |

**Fakten-Stichprobe:** Lüftungsspalt VHF ≥ 2 cm (DIN 18516-1) – richtig. Faserzement nach DIN EN 12467 in A2-s1,d0 – richtig. Normen DIN EN 1304 (Tondachziegel), DIN EN 490 (Betondachsteine), DIN EN 988 (Zink) – richtig. Passivhaus-Kriterium U_w ≤ 0,80 W/(m²K) – richtig.

**Befunde:** keine.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 13. Dimensionierung RStO 12/24 (`bp_verkehr_rsto`)

**Prüfumfang:** `src/modules/bpverkehrswegebau/RstoRechnerTab.tsx`, Profildaten `content/bpverkehrswegebau/daten.json` (sechs Asphalt-, zwei Betonaufbauten), Formelsammlung `BpVerkehrswegebau.json`, Übungsaufgabe `t_rsto_belastungsklasse` (`src/data/tasks/bauprodukteTasks.ts`), Grenzen, Lernziele, Kurzfassung.

**Normstand:** RStO 12/24 = Ausgabe 2012, Fassung 2024, eingeführt mit ARS 02/2024 vom 30.01.2024 ([Bayerisches Bauministerium, Bekanntmachung RStO 12/24](https://bauministerium.bayern.de/assets/stmi/vum/strasse/planung/49_bekanntmachung_rsto12-24_2024-04-25.pdf); [Landesbetrieb Straßenwesen Brandenburg, Regelwerksänderungen 07/2026](https://www.ls.brandenburg.de/sixcms/media.php/9/Ver%C3%A4nderungen%20aktuell%2007_2026_Stand%202026-07-21.pdf)). Der Titel im Modul ist richtig. Die B-Zahl-Berechnung (bisher Anhang 1) steht jetzt im Haupttext, Abschnitt 2.7.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| RS1 | Beispiel Regierung von Mittelfranken (St 2245): N = 30 a, DTV^(SV) = 1300, f_A = 4,0, q_Bm = 0,25, f_1 = 0,45, f_2 = 1,10, f_3 = 1,05, p = 2 % | f_z = 1,352; B = 10,005·10⁶ (Unterlage: 10 002 963) → Bk32 | Formel B = N·DTA^(SV)·q_Bm·f_1·f_2·f_3·f_z·365 bestätigt ([Unterlage 14.1](https://www.regierung.mittelfranken.bayern.de/mam/service/planfeststellung/pls_st2245/ul_14_1_bemessung_oberbau.pdf)) |
| RS2 | Übungsaufgabe: DTV^(SV) = 1800, f_A = 4,0, N = 30 a, f_1 = f_2 = f_3 = 1,0, q_Bm = 0,33, p = 1 % | DTA = 7200; f_z = 1,1595; B = 30,2·10⁶ → **Bk32** | **vorher 10,05·10⁶ → „Bk10“** (T7-RS-1) |
| RS3 | Mindestdicke frostsicherer Oberbau F3, Bk100–Bk10 | 65 cm (Ausgangswert) | Unterlage Mittelfranken bestätigt; Modul rechnet keine Frostzonen (Grenzen) |

**Befunde**
- **behoben – T7-RS-1:**
  - Der Rechner-Reiter zeigte „B = N · f_A · f_G · f_B · t_N“ mit „f_G: Spurbreitenfaktor, f_B: Achslastfaktor“. Die Formelsammlung zeigte „B = Σ DTV·q_i·f_1·f_2·f_3·f_z·365“ ohne Nutzungszeitraum und Achszahlfaktor. Beides entspricht nicht der RStO.
  - Jetzt überall: B = N·DTA^(SV)·q_Bm·f_1·f_2·f_3·f_z·365 mit Erläuterung aller Faktoren; Lernziel angepasst.
  - Die Übungsaufgabe war mehrfach fehlerhaft:
    - Der Nutzungszeitraum fehlte im Rechenweg.
    - 1800·365·1,16·4 = 3,05·10⁶, nicht 3,05·10⁷.
    - „f_L ≈ 0,33“ (gemeint: q_Bm) war in der Aufgabenstellung nicht angegeben.
    - Die Klassengrenzen waren vertauscht („Bk3.2: 3,2 < B ≤ 10“, „Bk10: 10 < B ≤ 32“).
    - Das Ergebnis „Bk10“ war falsch.
  - Die Aufgabe nennt jetzt q_Bm = 0,33 und p = 1 % als Annahmen; Lösung 30,2 Mio. → Bk32.
- **offen – Frage T7-RS-2 (Schichtdicken):** Die Profildaten weichen von RStO 12, Tafel 1, Zeile 1 (Asphalttragschicht auf Frostschutzschicht) ab. Öffentlich belegt ist für Bk32 eine Asphaltdecke von 12 cm (4 cm Deck- + 8 cm Binderschicht; Unterlage Mittelfranken, Tafel 1 Zeile 3). Das Modul hat 4 + 6 cm. Nach meinem Kenntnisstand gilt für Zeile 1 (Deck/Binder/Tragschicht in cm):

  | Bk | Modul | Vorschlag Tafel 1, Zeile 1 (F-Freigabe) |
  |---|---|---|
  | Bk100 | 4/6/24 | 4/8/22 |
  | Bk32 | 4/6/16 | 4/8/18 |
  | Bk10 | 4/5/13 | 4/8/14 |
  | Bk3,2 | 4/–/14 | 4/6/12 |
  | Bk1,8 | fehlt | 4/6/10 |
  | Bk1,0 | 4/–/10 | 4/–/14 |
  | Bk0,3 | 4/–/8 | 4/–/10 |

  Betonbauweise (Tafel 2, Zeile 1, Betondecke auf HGT): Bk100 hat im Modul 30 cm, nach meinem Kenntnisstand gelten 27 cm (Bk32: 26 cm). Die Gesamtdicken 85/75/65/60/55/50 cm sind keine Tafelwerte; sie ergeben sich erst aus der Mindestdicke des frostsicheren Oberbaus mit Mehr- und Minderdicken. Frage: Tafelwerte am Regelwerkstext übernehmen (dann auch Bk1,8 ergänzen) oder die Profile ausdrücklich als „vereinfachte Lehraufbauten, nicht Tafel 1/2“ kennzeichnen? Die Grenzen sagen bereits „vereinfachte Lehrwerte“.
- Hinweis Quiz (nicht geändert): Die Erklärung von `q_rsto_1` nennt „rund 160 000-mal stärker (4. Potenzgesetz: (10/1)^4 = 10 000 bis 160 000)“. Nach dem 4.-Potenz-Gesetz ergibt sich für eine 10-t- gegenüber einer 1-t-Achse der Faktor 10 000; 160 000 ist (20/1)^4. Für den laufenden Quiz-Abgleich.

**F-Freigabe-Stellen:** Schichtdicken RStO 12/24, Tafel 1 und 2 (T7-RS-2); Lastkollektivquotienten q_Bm je Straßenklasse (in der Aufgabe als Annahme).

**Empfehlung:** freigabefähig nach Korrektur T7-RS-1 und Klärung von T7-RS-2.

- [ ] Modul freigeben

## 14. Asphaltsorten (`bp_verkehr_asphalt`)

**Prüfumfang:** `VergleichTab.tsx` / `VergleichTab.json` (AC, SMA, MA, PA; STS/FSS, HGT), Lernziele, Kurzfassung.

**Fakten-Stichprobe:** SMA mit Splittgerüst und Zellulosefasern als Stabilisator – richtig. Gussasphalt hohlraumfrei, ohne Walzen, mit Splitt abgestreut – richtig. PA mit zusammenhängendem Hohlraum ≥ 22 Vol.-%, Lärmminderung „bis zu 5 dB(A)“ – plausibel als Größenordnung. HGT wird unter Asphalt gekerbt gegen Reflexionsrisse – richtig. Bindemittelgehalte als „ca.“-Lehrwerte gekennzeichnet. Seit 2026 gelten TL Asphalt-StB 26 (ARS 07/2026) und ZTV Asphalt-StB 26 Teil 1 (ARS 08/2026) ([LS Brandenburg](https://www.ls.brandenburg.de/sixcms/media.php/9/Ver%C3%A4nderungen%20aktuell%2007_2026_Stand%202026-07-21.pdf)); die Regelwerksliste nennt jetzt die Ausgaben (T7-BD-1).

**Befunde:** keine (Normstand der Regelwerksliste unter T7-BD-1 behoben).

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 15. Bitumen & Gesteine (`bp_verkehr_bitumen`)

**Prüfumfang:** `BindemittelTab.tsx` / `BindemittelTab.json` (Nadelpenetration, Ring und Kugel, PSV), Lernziele, Kurzfassung.

**Fakten-Stichprobe:** Penetration bei 25 °C, 100 g, 5 s, Angabe in 0,1 mm – richtig (DIN EN 1426). Erweichungspunkte 50/70: 46–54 °C, 70/100: 43–51 °C; der Modulbereich „ca. 43 bis 54 °C“ passt ([LOTOS, 50/70](https://www.lotos.pl/en/859/p,710,c,1799/products/road_bitumen/road_bitumen_50/70); [LOTOS, 70/100](https://www.lotos.pl/en/859/p,869,c,1799/products/road_bitumen/road_bitumen_70/100), nach EN 12591). PmB mit höherem Erweichungspunkt und besserer Kälteflexibilität – richtig. Polierwert nach DIN EN 1097-8 mit Pendelgerät – richtig.

**Befunde**
- behoben: keine.
- **offen – Frage T7-BT-1:** „Autobahndeckschichten zwingend: PSV-Wert ≥ 51 oder ≥ 54“ (auch in der Kurzfassung). Die Kategorien und ihre Zuordnung zu Belastungsklassen stehen in TL Gestein-StB 04/23 (Anhang) bzw. ZTV Asphalt-StB 26. Öffentlich nicht nachprüfbar. Bitte bestätigen (F-Freigabe), sonst auf „hoher PSV-Wert nach TL Gestein-StB“ zurücknehmen. Dasselbe gilt für die Profilangaben „PSV ≥ 51 / ≥ 48 / ≥ 45“ im RStO-Reiter.

**Empfehlung:** freigabefähig nach Klärung von T7-BT-1.

- [ ] Modul freigeben

## 16. Labor-Prüfmethoden (`bp_verkehr_pruefung`)

**Prüfumfang:** `PrueftechnikTab.tsx` / `PrueftechnikTab.json`, Kern `asphaltHohlraum` (`src/calc/verkehrswegebau.ts`, Rohdichte aus `asphalt.ts`), Grenzen, Lernziele.

**Nachrechnungen** (ρ_m = 100/(M_G/ρ_G + M_B/ρ_B), V = (1 − ρ_A/ρ_m)·100)

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| PR1 | Standard: 94,5/5,5 M.-%, 2,68/1,02, ρ_A = 2,41 g/cm³ | ρ_m = 2,4598; V = 2,03 Vol.-% (im Lehrbereich) | identisch |
| PR2 | Quizfall `qn_bp_verkehr_pruefung_4`: 95/5, 2,70/1,02, ρ_A = 2,40 | ρ_m = 2,4946; V = 3,79 Vol.-% | identisch |
| PR3 | 93/7, 2,65/1,03, ρ_A = 2,39 (Randfall ρ_A > ρ_m) | V = −0,12 % → unplausibel | Fehlermeldung des Kerns |

**Fakten-Stichprobe:** Marshall-Verdichtung 2 × 50 Schläge, Prüfung bei 60 °C (DIN EN 12697-30/-34) – richtig. Spurbildungsversuch nach DIN EN 12697-22 – richtig. Hinweis: In Deutschland wird nach TP Asphalt-StB im Wasserbad bei 50 °C die Spurrinnentiefe in mm angegeben; der Text („Profiltiefe in %“) beschreibt das große Gerät.

**Befunde**
- **behoben – T7-PR-1:** Die Ergebnisanzeige meldete „✓ Konform (ZTV Asphalt-StB Zielbereich 1,5 - 4,5% für Deckschichten …)“ bzw. „Nicht konform für Deckschichten“. Der Bereich ist ein pauschaler Lehrwert (so auch Text, Grenzen und Kern); die Anforderungen hängen von der Mischgutsorte ab. Jetzt: „Im Lehrbereich 1,5 bis 4,5 Vol.-% (maßgebend … TL/ZTV Asphalt-StB 26)“ bzw. „Außerhalb des Lehrbereichs“. Die Quizfrage `qn_bp_verkehr_pruefung_5` („Zielbereich des Moduls“) bleibt richtig.

**Empfehlung:** freigabefähig nach Korrektur T7-PR-1.

- [ ] Modul freigeben

## 17. Betondecken (`bp_verkehr_betondecken`)

**Prüfumfang:**
- `BetondeckenTab.tsx` / `BetondeckenTab.json`: Westergaard, LP-Prüfer, Fugen und AKR.
- Kerne `westergaardRand` und `betondeckenFugen`; LP- und AKR-Logik inline.
- Grenzen und Lernziele.

**Nachrechnungen** (eigene Umsetzung: l = [E·h³/(12(1 − ν²)k)]^¼, a = √(P/(π·p)), b nach Westergaard, σ_e = 0,572·P/h²·[4 lg(l/b) + 0,359])

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| WG1 | Standard: h = 26 cm, Achse 120 kN, k = 80 MN/m³ | l = 893,3; a = 154,5; b = 149,8 mm; σ_e = 1,757; σ_i = 1,170; σ_c = 1,519 N/mm² | identisch |
| WG2 | h = 18 cm, 100 kN, k = 30 | σ_e = 3,203 > 2,25 → nicht ausreichend | identisch |
| WG3 | h = 30 cm, 180 kN, k = 120 | l = 898,7; σ_e = 1,796 | identisch |
| FU1 | L = 5,0 m, h = 18 cm | L_max = min(25·0,18; 5,0) = 4,5 m → Rissgefahr | identisch (Quiz `qn_bp_verkehr_betondecken_5`) |
| LP | GK 22: 4,5–7,0 %, GK 32: 4,0–6,5 % | 4,2 % bei GK 22 → zu niedrig | identisch (Lehrwerte) |

**Normstand:** Seit 2026 gelten ZTV Beton-StB 26 (ARS 09/2026) und TL Beton-StB 26 (ARS 10/2026); die RDO Beton 24 gilt seit ARS 17/2024 ([LS Brandenburg, Regelwerksänderungen 07/2026](https://www.ls.brandenburg.de/sixcms/media.php/9/Ver%C3%A4nderungen%20aktuell%2007_2026_Stand%202026-07-21.pdf)).

**Befunde**
- **behoben – T7-BD-1:** Die Regelwerksliste des Verkehrswegebaus nannte keine Ausgaben. Sie nennt jetzt ZTV/TL Beton-StB 26, RDO Beton 24, TL/ZTV Asphalt-StB 26, RStO 12/24 (ARS 02/2024), ZTV/TL SoB-StB 20 und TL Gestein-StB 04/23 (neu). Spritzbeton: DIN EN 14487-1:2023-03.
- **offen – Frage T7-BD-2 (Fugenabstand):** Der Kern begrenzt mit L ≤ min(25·h; 5,0 m) („Lehrannahme“); die Anzeige nennt „ZTV Standard ≤ 5,0 m“ und „kritischer Baufehler > 5,0 m“. Nach meinem Kenntnisstand begrenzt die ZTV Beton-StB den Querfugenabstand auf das 25-Fache der Deckendicke, höchstens 7,5 m; 5 m ist ein üblicher Regelabstand. Frage: an ZTV Beton-StB 26 prüfen und ggf. Höchstwert 7,5 m übernehmen? Dann ändert sich die Quizfrage `qn_bp_verkehr_betondecken_5` nicht (h = 18 cm → 4,5 m), wohl aber die Beschriftung „kritischer Baufehler > 5,0 m“.
- **offen – Frage T7-BD-3 (Festigkeit):** „Standardmäßig C30/37 (Biegezugprüfung m_fct,sp ≥ 4,5 MPa)“. f_ct,sp bezeichnet die Spaltzugfestigkeit, nicht die Biegezugfestigkeit; der Zahlenwert war öffentlich nicht belegbar. Bitte an TL Beton-StB 26 prüfen (F-Freigabe). Dasselbe gilt für die LP-Lehrwerte, die in der Anzeige bereits als Lehrwerte gekennzeichnet sind.
- Hinweis: Dübel Ø 25 mm, l = 500 mm und Anker Ø 20 mm, l = 800 mm entsprechen den üblichen Angaben; NA-Zement mit Na₂O-Äquivalent ≤ 0,60 % ist richtig.

**F-Freigabe-Stellen:** Fugenabstand, Spaltzug/Biegezug, LP-Grenzen nach ZTV/TL Beton-StB 26; zulässige Spannung 2,25 N/mm² bleibt eine Lehrannahme (Grenzen).

**Empfehlung:** freigabefähig nach Korrektur T7-BD-1 und Klärung von T7-BD-2/-3.

- [ ] Modul freigeben

## 18. Tiefbau & Entwässerung (`bp_verkehr_tiefbau`)

**Prüfumfang:** `TiefbauTab.tsx` / `TiefbauTab.json` (zehn Produktbereiche, Rigolenrechner), Kern `rigole`, Grenzen, Lernziele.

**Nachrechnungen** (Lehransatz des Moduls: Q_zu = A·ψ·r/10 000, A_Sohle = max(1,5; 0,35·V_zu), Q_s = (k_f/2)·A_Sohle, V_R = f_Z·(V_zu − V_s)/s_R)

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| RI1 | Standard: 355 m², ψ = 0,9, r = 240 l/(s·ha), 15 min, s_R = 0,95 | Q_zu = 7,668 l/s; V_zu = 6,90 m³; V_R = 7,98 m³; L = 11,08 m; 32 Boxen | identisch |
| RI2 | 500 m², ψ = 0,7, r = 150, 30 min, Kies s_R = 0,3 | V_R = 34,54 m³; V_nutz = 10,36 m³; L = 47,97 m | identisch |
| RI3 | 10 m², ψ = 0,3, r = 50, 5 min (Randfall) | Mindestwerte A_Sohle = 1,5 m², V_R = 0,1 m³ | identisch |

**Normstand DWA-A 138-1:** Die Umstellung auf DWA-A 138-1:2024-10 ist im Text, im Kernkommentar und in den Grenzen vollständig. Als „vorläufig, F-Freigabe“ gekennzeichnet sind f_Ort und die Anrechnung der gesamten Rigolenhöhe. Kein neuer Befund.

**Befunde**
- **behoben – T7-TB-1:** Die Ergebnisanzeige nannte „Sicherheitsbeiwert f_S = 1,1“, Kern und Formel verwenden den Zuschlagsfaktor f_Z. Beschriftung angeglichen.
- Hinweis: Die Normbezüge der Produktbereiche (DIN EN 1401-1, DIN 4095, DIN 4262-1, DIN EN 1852/476, DIN EN 13564, DIN EN 13249, DIN EN 61386-24, DIN EN 1433, DIN 4052) sind plausibel zugeordnet.

**Empfehlung:** freigabefähig (F-Stelle f_Ort aus Runde 7 bleibt).

- [ ] Modul freigeben

## 19. Bahnbau (`bp_verkehr_bahn`)

**Prüfumfang:** `BahnbauTab.tsx` / `BahnbauTab.json`, Kern `schienenTemperatur`, Anwendungsbeispiel, Lernziele.

**Nachrechnungen** (σ_T = 210 000·1,2·10⁻⁵·ΔT, F = σ_T·7686 mm²)

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| GL1 | 55 °C / 20 °C, Schotter gut | σ = 88,2 N/mm²; F = 677,9 kN (Beispiel: ≈ 680 kN); 88,2 < 0,7·135 → unkritisch | identisch |
| GL2 | −20 °C / 20 °C | σ = −100,8 N/mm² (Zug, > −120) | identisch |
| GL3 | 45 °C / 20 °C, Schotter mager | σ = 63 ≥ 0,7·90 → erhöht; F = 484,2 kN | identisch |

**Fakten-Stichprobe:** 60E1 (= UIC 60) 60,21 kg/m; R260 mit R_m ≥ 880 MPa ([British Steel, Rail profiles and grades](https://www.britishsteel.co.uk/wp-content/uploads/2026/07/Rail-profiles-and-grades-20.07.26-1.pdf)). Das Modul nennt UIC 60 mit 60,34 kg/m und 76,86 cm² (alte UIC-Angabe) und 60E1 mit „ca. 60,2 kg/m“. Beides ist richtig zugeordnet.

**Befunde**
- behoben: keine.
- **offen – Frage T7-BA-1:** Gleisschotter „Flachheitskennzahl ≤ 20 % und Widerstand gegen Schlagzertrümmerung SZ ≤ 20 %“. Die Kategorien nach DIN EN 13450 und die Anforderungen der DB (TL 918 061) waren öffentlich nicht nachprüfbar. Bitte bestätigen (F-Freigabe). Die Knickgrenzen 90/135 N/mm² sind als Lehrwerte im Kern gekennzeichnet.

**Empfehlung:** freigabefähig nach Klärung von T7-BA-1.

- [ ] Modul freigeben

## 20. Tunnelbau (`bp_verkehr_tunnel`)

**Prüfumfang:** `TunnelbauTab.tsx` / `TunnelbauTab.json` (NÖT, Frühfestigkeitsklassen, Vortriebsverfahren, Kesselformel), Kern `spritzbetonRing`, Lernziele.

**Nachrechnungen** (σ = p·R/d; f_cd = 0,85·f_ck/1,5)

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| TU1 | Standard: R = 4,5 m, p = 0,15 MPa, d = 15 cm, C25/30 | σ = 4,50; f_cd = 14,17; η = 31,8 % | identisch |
| TU2 | R = 6,0, p = 0,30, d = 20, C30/37 | σ = 9,0; f_cd = 17,0; η = 52,9 % | identisch |
| TU3 | R = 3,0, p = 0,05, d = 5, C20/25 | σ = 3,0; η = 26,5 % | identisch |

**Fakten-Stichprobe:** Frühfestigkeitsklassen J1, J2, J3 mit den Einsatzbedingungen der DIN EN 14487-1 – richtig. Die geltende Ausgabe ist DIN EN 14487-1:2023-03 (ersetzt 2006-03; [DIN Media](https://www.dinmedia.de/en/standard/din-en-14487-1/355702858)) und steht jetzt in der Regelwerksliste. γ_c = 1,5 für die vorübergehende Situation (NA DE) – richtig. „0,10 MPa ≈ 10 t/m²“ – richtig.

**Befunde:** keine (Ausgabe DIN EN 14487-1 unter T7-BD-1 ergänzt).

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

---

## Offene Fragen zur Entscheidung (Zusammenfassung)

| Nr. | Modul | Frage |
|---|---|---|
| T7-BI-1 | Baustoffindustrie | Branchenkennzahlen (Beschäftigte, 38 Mrd. €) belegen; Tabelle (Summe 28,7 Mrd. €) und Text angleichen? |
| T7-IN-4 | Innovationen | Myzel „Brandschutz durch Chitin (B2/B1)“ und „DIBt-Fast-Track für Nachhaltigkeit“ streichen oder belegen? |
| T7-BE-1 | Beton | CSC „relevant für QNG/DGNB“ auf DGNB/BNB einschränken? |
| T7-BW-2 | Betonwaren | Prüfdruck Betonrohre DIN EN 1916: 0,5 bar oder 1 bar? Einzelwert Abwitterung ergänzen? |
| T7-MW-2 | Mauerwerk | WDVS-Brandverhalten „A1 bis B1“ auf Euroklassen umstellen; Norm DIN EN 13499/13500 oder DIN EN 17237? |
| T7-MW-3 | Mauerwerk | Lehmstein λ bei 1800 kg/m³ (0,81 oder 0,91) und Klinker-Wasseraufnahme ≤ 6 M.-% bestätigen. |
| T7-RS-2 | RStO | Schichtdicken auf RStO 12/24, Tafel 1/2 umstellen (Bk1,8 ergänzen) oder als Lehraufbauten kennzeichnen? |
| T7-BT-1 | Bitumen & Gesteine | PSV-Anforderungen (≥ 51/54, ≥ 48, ≥ 45) an TL Gestein-StB 04/23 bestätigen. |
| T7-BD-2 | Betondecken | Fugenabstand: Höchstwert 5,0 m (Lehrannahme) oder 7,5 m nach ZTV Beton-StB? |
| T7-BD-3 | Betondecken | „Biegezugprüfung m_fct,sp ≥ 4,5 MPa“: Kenngröße und Wert nach TL Beton-StB 26? |
| T7-BA-1 | Bahnbau | Gleisschotter: Flachheitskennzahl ≤ 20 % und SZ ≤ 20 % nach DIN EN 13450/DB TL 918 061 bestätigen. |

## Nachweis der Prüfung

- **Unabhängige Nachrechnung:** eigenes Skript (Python) mit eigener Umsetzung der Gleichungen (rund 100 Werte). Es vergleicht gegen die Kerne `asphaltHohlraum`, `westergaardRand`, `betondeckenFugen`, `rigole`, `schienenTemperatur`, `spritzbetonRing`, `fkEmpfehlungEN`/`fdAusFk` sowie gegen die Rechenbeispiele der Inhaltsdateien. Die Sollwerte stehen in `tests/modulpruefungTranche7.test.ts` (57 Vergleiche einschließlich der Prüfung der Textkorrekturen).
- **Öffentliche Quellen dieser Prüfung:**
  - BauPVO und Bauproduktenrecht:
    - VO (EU) 2024/3110: [Art. 15](https://gesetze.legal/eu/vo_eu_2024_3110/15), [Art. 75](https://gesetze.legal/eu/vo_eu_2024_3110/75), [Art. 94](https://gesetze.legal/eu/vo_eu_2024_3110/94), [Art. 95](https://gesetze.legal/eu/vo_eu_2024_3110/95), [Art. 96](https://gesetze.legal/eu/vo_eu_2024_3110/96), [Anhang IX](https://gesetze.legal/eu/vo_eu_2024_3110/anhang_ix) (gesetze.legal)
    - [IHK Bodensee-Oberschwaben, BauPVO 2024/3110](https://www.ihk.de/bodensee-oberschwaben/branchen/industrie-und-bauwirtschaft/inverkehrbringen-und-verwenden-von-bauprodukten-1940112)
    - [One Click LCA, EPD-Pflichten nach CPR](https://oneclicklca.com/de/resources/articles/cpr-epds-deep-dive-for-construction-professionals)
    - [Deutsche Handwerks Zeitung, Zeitplan DPP](https://www.deutsche-handwerks-zeitung.de/?p=358024)
    - [Handwerksblatt, EuGH C-100/13](https://www.handwerksblatt.de/betriebsfuehrung/deutsche-anforderungen-an-bauprodukte-sind-eu-rechtswidrig)
    - [Kiwa, Notifizierungsbescheid DIBt](https://www.kiwa.com/493e2b/globalassets/germany/standorte/greven/notifizierung_cpr-0799_2025-02-27_gesamt.pdf)
  - Normung: [DIN, Geschichte](https://www.din.de/en/din-and-our-partners/din-e-v/history); [IBA, Normungsorganisationen](https://iba.online/en/knowledge/space-planning/regulations/standardisation-bodies/)
  - Beton, Fertigteile, Spritzbeton (DIN Media): [DAfStb-Richtlinie nichtmetallische Bewehrung](https://www.dinmedia.de/de/technische-regel/dafstb-betonbauteile-nichtmetallische-bewehrung/377433845); [DIN 1045-4:2023-08](https://www.dinmedia.de/de/norm/din-1045-4/369667746); [DIN 1045-40:2023-08](https://www.dinmedia.de/de/norm/din-1045-40/369667771); [DIN EN 14487-1:2023-03](https://www.dinmedia.de/en/standard/din-en-14487-1/355702858)
  - Baustoffindustrie: [bbs-Umsatzstatistik 2022](https://kalksandstein.de/media/user_upload/bundesverband_baustoffe_-_steine_und_erden_-_umsatz_nach_wirtschaftszweigen.pdf)
  - Straßenbau:
    - [Bayerisches Bauministerium, RStO 12/24](https://bauministerium.bayern.de/assets/stmi/vum/strasse/planung/49_bekanntmachung_rsto12-24_2024-04-25.pdf)
    - [Regierung von Mittelfranken, Bemessung Oberbau St 2245](https://www.regierung.mittelfranken.bayern.de/mam/service/planfeststellung/pls_st2245/ul_14_1_bemessung_oberbau.pdf)
    - [LS Brandenburg, Regelwerksänderungen 07/2026](https://www.ls.brandenburg.de/sixcms/media.php/9/Ver%C3%A4nderungen%20aktuell%2007_2026_Stand%202026-07-21.pdf)
    - Bitumen-Kennwerte: [LOTOS 50/70](https://www.lotos.pl/en/859/p,710,c,1799/products/road_bitumen/road_bitumen_50/70), [LOTOS 70/100](https://www.lotos.pl/en/859/p,869,c,1799/products/road_bitumen/road_bitumen_70/100)
  - Bahnbau: [British Steel, Rail profiles and grades](https://www.britishsteel.co.uk/wp-content/uploads/2026/07/Rail-profiles-and-grades-20.07.26-1.pdf)
