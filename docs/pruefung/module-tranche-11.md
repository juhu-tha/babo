# Modulprüfung Tranche 11 – Bauphysik und Nachhaltigkeit (Befundliste zur Freigabe)

**Stand:** 28.10.2026 (Branch `pruefung/module-tranche11-10-28`, Basis origin/main b2cb8367)
**Status:** Vorschlag zur fachlichen Freigabe – noch nicht bestätigt.

> Nach der Freigabe eines Moduls wird in `src/data/pruefvermerke.ts` der Prüfvermerk „geprüft am …“ gesetzt (Passiv, ohne Namen). Mit dieser Befundliste wurden **keine** Prüfvermerke und **keine** Quizfragen geändert.

## Vorgehen

- **Auswahl (15 Module):** Gruppe Bauphysik (`bauphysik_info`, `bauphysik`, `waermeeigenschaften`, `daemmung_vergleich`, `energieausweis`) und Gruppe Nachhaltigkeit (`nachhaltigkeit_info`, `nachhaltigkeit_daten_regeln`, `materialoptimierung`, `oekobilanz_lca`, `lca_ingenieurbau`, `lca_regulatorik`, `zertifizierung_siegel`, `kreislauf_dpp`, `ressourcen_umwelt`, `lebenszyklus_kosten`). Der U-Wert-Kern (`waermeschutz.ts`) wurde in Tranche 1, der Gebäuderechner `lca_rechner` in Tranche 2 geprüft; hier nur die übrigen Reiter und Kerne.
- **Prüfumfang je Modul** (wie Tranche 1 bis 3):
  - Rechenkern bzw. Inline-Rechnung mit mindestens drei eigenen Nachrechnungen. Eigenes Python-Skript mit eigener Umsetzung der Modell- bzw. Normgleichungen, keine Übernahme von Testwerten.
  - Bei Modulen ohne Rechner eine Fakten-Stichprobe mit mindestens fünf Aussagen gegen öffentliche Quellen.
  - Fachtext und Normstand, Grenzen (`src/data/rechnerGrenzen.ts`), Beispiele, Lernziele und Kurzfassung, Quellen und Stellen „vorläufig, F-Freigabe“.
- **Schwerpunkt Rechtsstand GModG:** Das GModG ist am 28.07.2026 verkündet worden (BGBl. 2026 I Nr. 226). Es tritt in Stufen in Kraft: Stufe 1 am 29.07.2026, Stufe 2 am 01.01.2027. Stufe 2 bringt u. a. ein neues Referenzgebäude, neue Primärenergiefaktoren, neue Regeln für Energieausweise, DIN/TS 18599:2025-10 und die Ökobilanz. Öffentliche Quellen dazu:
  - [Haus & Grund, Merkblatt W15 Energieausweis](https://www.hausundgrund.de/sites/default/files/secure_downloads/W15%20-%20GModG%20%E2%80%93%20Geb%C3%A4udemodernisierungsgesetz%20-%20Energieausweis.pdf)
  - [BDB Kurzbriefing](https://www.baumeister-online.de/app/uploads/2026/07/BDB_Kurzbriefing_GModG_Website_final.pdf) und [BDB Mitgliederinformation](https://www.baumeister-online.de/app/uploads/2026/07/BDB_GModG_Mitgliederinformation_2026_final.pdf)
  - [Ökozentrum NRW, Update zum GModG](https://oekozentrum.nrw/aktuelles/detail/news/update-zum-gmodg/)
  - [nexvyra, Paragrafen-Konkordanz](https://nexvyra.de/fakten/gmodg-paragraphen-konkordanz.md)
  - [Verbraucherzentrale, GModG](https://www.verbraucherzentrale.de/wissen/energie/energetische-sanierung/gmodg-was-steht-im-gebaeudemodernisierungsgesetz-13886)

  Die Module rechnen mit dem **Stand bis 31.12.2026**. Wo sich ab 01.01.2027 etwas ändert, steht jetzt ein Hinweis im Text.
- **Ergebnis der Nachrechnung:** 114 Einzelwerte aus dem Prüfskript, alle ohne Abweichung (Toleranz 0,5 %). Die Sollwerte der Kerne stehen als Regressionstest in `tests/modulpruefungTranche11.test.ts`. Die Rechnungen in den Komponenten wurden Zeile für Zeile gegen die eigene Rechnung abgeglichen:
  - Nachhallzeit und Phasenverschiebung (`Bauphysik.tsx`)
  - Brückenrechner (`IngenieurbauLCA.tsx`)
  - CRREM-Pfad (`Nachhaltigkeit.tsx`)
  - MCI (`Kreislaufwirtschaft.tsx`)
- Es wurden nur öffentliche Quellen verwendet. Normtexte wurden nicht abgeschrieben. Wo der Normtext zur Bestätigung nötig ist, steht die Stelle unter „F-Freigabe“.

## Übersicht

| Nr. | Modul | Prüfvermerk-ID | Rechenkern | Empfehlung |
|---|---|---|---|---|
| 1 | Modulinfos Bauphysik | – (kein Eintrag) | – | freigabefähig nach Korrektur T11-BI-1 |
| 2 | Bauphysik (Wärme & Akustik) | `bauphysik` | `waermeschutz.ts` (Tranche 1), inline: Phasenverschiebung, Sabine | freigabefähig nach Klärung von T11-BP-1 und T11-BP-2 |
| 3 | Thermische Eigenschaften & Dämmstoffe | `waermeeigenschaften` | `waermeschutz.ts` (`thermischeKennwerte`, `erforderlicheDaemmdicke`) | freigabefähig |
| 4 | Innendämmung vs. Außendämmung | `daemmung_vergleich` | `waermeschutz.ts` (Temperaturverlauf) | freigabefähig nach Korrektur T11-DV-1 |
| 5 | Energieausweis | `energieausweis` | `energieausweis.ts` | freigabefähig für den Rechtsstand bis 31.12.2026 nach Korrektur T11-EA-1; vor dem 01.01.2027 Klärung von T11-EA-2 und T11-EA-3 |
| 6 | Modulinfos Nachhaltigkeit | – (kein Eintrag) | – | freigabefähig |
| 7 | Daten & Regeln | `nachhaltigkeit_daten_regeln` | inline (Taxonomie, CRREM-Beispiel) | freigabefähig nach Korrektur T11-NDR-1 bis -4 (F-Stelle Gebäudetyp E) |
| 8 | Materialoptimierung | `materialoptimierung` | `materialoptimierung.ts` | freigabefähig nach Korrektur T11-MO-1 und Klärung von T11-MO-2 und T11-MO-3 |
| 9 | LCA: Grundlagen | `oekobilanz_lca` | `lca.ts` (`einzelbaustoffA1A4`, Tranche 2) | freigabefähig nach Korrektur T11-LCA-1 und Klärung von T11-LCA-2 |
| 10 | LCA: Ingenieurbau | `lca_ingenieurbau` | inline (`IngenieurbauLCA.tsx`) | freigabefähig (F-Stelle Modul B8 bleibt) |
| 11 | LCA: Rechtsrahmen & CRREM | `lca_regulatorik` | inline (`Nachhaltigkeit.tsx`, CRREM) | freigabefähig nach Korrektur T11-LR-1 und Klärung von T11-LR-2 bis -4 |
| 12 | Zertifizierung & Deklarationen | – (kein Eintrag) | – | freigabefähig nach Korrektur T11-ZS-1 und Klärung von T11-ZS-2 |
| 13 | Kreislaufwirtschaft | `kreislauf_dpp` | inline (MCI, UMI) | freigabefähig nach Korrektur T11-KW-1 und Klärung von T11-KW-2 |
| 14 | Ressourcen & Umwelt | `ressourcen_umwelt` | – (Beispielrechnungen) | freigabefähig |
| 15 | Lebenszyklus & Kosten | `lebenszyklus_kosten` | `lcc.ts` | freigabefähig nach Korrektur T11-LZK-1 und Klärung von T11-LZK-2 |

**Behobene Fehler (dieser PR):**

| Kennung | Datei | Vorher | Nachher | Quelle |
|---|---|---|---|---|
| T11-DV-1 | `content/daemmungvergleich/DaemmungVergleich.json` | Bestandswand „erreicht ungestört f = 0,82“ (mit R_si = 0,13) | Mit R_si = 0,25 nach DIN 4108-2: f_Rsi = 0,65 < 0,70 – die ungedämmte Wand verfehlt das Kriterium schon in der Fläche; mit 6 cm Dämmung 0,89 | DIN 4108-2, 6.2 (R_si = 0,25 für den Schimmelnachweis; wie im Modul Bauphysik und in `qn_bauphysik_5`) |
| T11-EA-1 | `content/energieausweis/Energieausweis.json` | „Beschluss von Bundestag und Bundesrat am 10.07.2026“; „genau 10 Jahre gültig“; Verbrauchsausweis immer 3 Jahre; § 15 mit 0,55 ohne Befristung; DIN 4108-2-Titel veraltet | Bundestagsbeschluss Juli 2026 (BR-Drs. 409/26, kein Vermittlungsausschuss), Verkündung 28.07.2026 (BGBl. 2026 I Nr. 226), Stufen 29.07.2026 und 01.01.2027; „längstens 10 Jahre“; ab 2027 zwei Verbrauchsjahre bei Wohngebäuden; Faktor 0,55 entfällt ab 2027; neue f_P ab 2027 als Hinweis; § 14 ab 2027 auf DIN 4108-2:2026-05; DIN/TS 18599:2025-10 ab 2027 | Haus & Grund W15; BDB Kurzbriefing und Mitgliederinformation; Ökozentrum NRW |
| T11-NDR-1 | `content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json` | GModG „regelt … die 65 %-EE-Vorgabe“ | 65-%-Vorgabe mit dem GModG entfallen, Bio-Treppe 10/15/30/60 % (2029/2030/2035/2040); Neubauanforderung bis 31.12.2026 EH 55, ab 2027 neues Referenzgebäude | Ökozentrum NRW; BDB |
| T11-NDR-2 | dto. | QNG für „degressive AfA (5 %)“ | Sonderabschreibung nach § 7b EStG (5 % jährlich in den ersten vier Jahren; Voraussetzung EH 40 mit QNG) | [Lohnsteuer kompakt, § 7b EStG](https://www.lohnsteuer-kompakt.de/steuerwissen/mietwohnungsneubau-verbesserung-der-7b-sonderabschreibung) |
| T11-NDR-3 | dto. | Anzeigepflicht „nach § 25 EBV“ | § 22 EBV (Vor- und Abschlussanzeige ab 250 m³); § 25 regelt Lieferschein und Deckblatt | [§ 22 EBV, gesetze-im-internet.de](https://www.gesetze-im-internet.de/ersatzbaustoffv/__22.html) |
| T11-NDR-4 | dto. | „Verbot von Gas-/Ölheizungen“ 2040; „GWP-Grenzen im Bauantrag“; „alle 21 Rechtsakte“ (Kompendium enthält 23) | Ausstiegsziel 2040 über nationale Fahrpläne, kein EU-Verbot; „Lebenszyklus-GWP im Energieausweis“; 23 Rechtsakte | EPBD (EU) 2024/1275 Art. 7 (Offenlegung GWP), Art. 17 (Förderstopp), nationaler Renovierungsplan (Ausstiegsziel) |
| T11-MO-1 | `content/materialoptimierung/*.json` | Pflanzenkohle: „vorzeitige bauaufsichtliche Zulassung“, „Aktivkohle … (Einheit über PAKs)“, „28-tägige Hydratation (Erstarren)“; DAfStb-Rechner: „THG-Effizienzklassen nach DAfStb“ mit Zuordnung „QNG-Premium tauglich“, „DGNB/QNG Platin-Level“, „erfüllt höchste Fördervorgaben nach QNG-Premium“ | abZ/aBG; Pflanzenkohle hält die PAK-Grenzwerte ein; Erhärten des Zementsteins; Klassen als **Lehreinteilung** gekennzeichnet; Hinweis auf die Treibhausgas-Minderungsklassen der Richtlinie (Bezug 2020, vorläufig, F-Freigabe); keine Siegelzuordnung mehr (QNG und DGNB bewerten das ganze Gebäude) | [DIN Media, Themenseite DAfStb-Richtlinie](https://www.dinmedia.de/de/themenseiten/betonbau/emissionen-deckeln-im-betonbau); [BFT International](https://bft-international.com/en/artikel/climate-friendly-concrete-construction-using-standardized-benchmarks-the-ghg-guideline-published-by-the-dafstb-4213466.html) |
| T11-LCA-1 | `content/lca/LCA.json`, `content/lca/IngenieurbauLCA.json` | Leitfaden: „Module A1–A3, C3, C4 und D flächendeckend summiert“ (Widerspruch zur QNG-Regel im selben Modul); „GWP₁₀₅“; „gem. GEG“; „13 Kernindikatoren (… PENRT …)“ | A1–A3, B4, C3, C4 summiert, D getrennt; GWP₁₀₀; GModG (DIN/TS 18599 ab 2027); PENRT als Indikator der Ressourcennutzung, nicht der Wirkungsabschätzung | DIN EN 15804+A2 (Indikatorgruppen); QNG Anlage 3 |
| T11-LR-1 | `src/components/ui/RechtsrahmenKompendium.tsx` | GModG § 36 „Dach U ≤ 0,14“; EU-ETS I „i. d. F. der Richtlinie (EU) 2023/958“; „Komplettes Verbot fossiler Heizkessel bis 2040“; Klimagesetz „Gebäude −60 %“ als Pflicht; KSG „Gegensteuerung bei Verfehlung der Sektorziele“; KrWG „70 % aller Bau- und Abbruchabfälle recycelt“; Zeitleiste 2025 „Kommender Stichtag“, 2026 „Novelle des GEG“, 2027 „Start des EU-ETS II“ | Steildach 0,24 / Flachdach 0,20 (wie Anlage 7, s. Verbraucherzentrale); 2023/959 (2023/958 betrifft den Luftverkehr); Ausstiegsziel ohne Verbot; −60 % als Zielmarke der Renovierungswelle; KSG 2024: sektorübergreifende Nachsteuerung; § 14 Abs. 3 KrWG: nicht gefährliche Abfälle ohne Boden, inkl. sonstiger stofflicher Verwertung; Zeitleiste auf Stand 10/2026 (GModG, ETS II 2028) | Verbraucherzentrale (Anlage-7-Werte); Ökozentrum NRW; ETS-II-Eintrag im selben Kompendium (Verschiebung 2028) |
| T11-ZS-1 | `content/zertifizierung/Zertifizierung.json`, `content/produktsiegel/Produktsiegel.json` | DGNB-Gewichte 22,5/22,5/22,5/15/12,5/5 ohne Versionsangabe; Formelname „GEG_DGNB“; „ISO 14420 SERIES“ | Version 2018 gekennzeichnet, Version 2023.2 (seit 01.10.2026) ergänzt: 25/25/25/10/10/5; „GE_DGNB“; ISO 14020 | [DGNB, Version 2023.2](https://www.dgnb.de/en/certification/buildings/new-construction/dgnb-system-new-construction-buildings-version-20232) |
| T11-KW-1 | `content/kreislaufwirtschaft/Kreislaufwirtschaft.json` | „DIN SPEC 91525 (Materialpass)“, „DIN 91525“, „Ressourchengewinnung“, „F(U)“ | DIN SPEC 91525 = Rückbaukonzept bei Bestandsgebäuden; DIN SPEC; Tippfehler; F(X) | [DIN Media, DIN SPEC 91525](https://www.dinmedia.de/en/business-plan/din-spec-91525/383319474) |
| T11-LZK-1 | `content/lcc/LCC.json` | „Für das QNG … fordert das BMWSB beide Bilanzen“ (LCA und LCC), Zins „1,5 % oder 2,0 %“; EPS-WDVS „Entsorgung als gefährlicher Abfall“ | QNG verlangt die Ökobilanz; LCC fordern BNB, DGNB und KFN 296; BNB 2.1.1 mit 1,5 %; EPS: thermische Verwertung, HBCD-haltige Altbestände als POP-Abfall nachweispflichtig | `content/zertifizierung/Kfn.json` (KFN 296: Lebenszykluskosten); BNB-Steckbrief 2.1.1 (Kernkommentar `lcc.ts`) |
| T11-BI-1 | `content/moduleinfo/daten.json` | „Taupunkt-Lokalisator … zur Verhinderung schädlichen Schimmelpilzwachstums“ | Tauwasser im Bauteil; Schimmel an Oberflächen über f_Rsi | DIN 4108-2 / DIN 4108-3 |
| – | `content/nawaro/Nawaro.json`, `content/energieausweis/Energieausweis.json` | DIN 4108-2 „Mindestanforderungen an den Wärmeschutz; Neuausgabe 2026-05“ | Titel der Ausgabe 2026-05 („Wärmeschutz – Anforderungen, Berechnungsverfahren …“) | Tranche 3, T3-SW-1 |
| – | `src/data/rechnerGrenzen.ts` | Bauphysik „GEG-Höchstwerte“; Energieausweis ohne Rechtsstand; Materialoptimierung „modellinterne Schwellen“ | GModG; Grenzen Phasenverschiebung und Sabine ergänzt; Energieausweis: Faktoren Stand bis 31.12.2026, CO₂-Lehrwerte; Lehreinteilung statt DAfStb-Klassen | – |
| – | `scripts/auditDaten.ts` | F-Fundstelle in `DafstbRichtlinieTab.json` ohne Fachgebiet | Dateimuster `dafstb` dem Fachgebiet Nachhaltigkeit zugeordnet | Brief 28.10. |

---

## 1. Modulinfos Bauphysik (`bauphysik_info`)

**Prüfumfang:** `ModuleInfo` Gruppe Bauphysik (`content/moduleinfo/daten.json`, Abschnitt `MODULES_DATA.bauphysik`): Grundlagen- und Didaktikkarten, Literatur, Regelwerke, Formeln.

**Fakten-Stichprobe (5)**

| Aussage | Ergebnis | Quelle |
|---|---|---|
| Regelwerke DIN 4108-2:2026-05, -3:2024-03, -4:2020-11 | richtig | Tranche 1 und 3 (DIN Media) |
| DIN 4109-1/-2:2018-01 | richtig | Tranche 1 |
| DIN 18041:2016-03 | richtig | Normenverzeichnis des Moduls |
| Fourier (q = −λ·ΔT/Δx) und Fick (g = −D_p·∂p/∂x) als analoge Transportgesetze | richtig | Lehrbuch Willems |
| „Taupunkt-Lokalisator … zur Verhinderung schädlichen Schimmelpilzwachstums“ | ungenau: Dampfdruckverlauf dient dem Tauwassernachweis | behoben (T11-BI-1) |

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig nach Korrektur T11-BI-1.

- [ ] Modul freigeben

## 2. Bauphysik (`bauphysik`)

**Prüfumfang:**
- `src/modules/Bauphysik.tsx` mit den Reitern U-Wert/f_Rsi, Sommer (Trägheit) und Raumakustik.
- `content/bauphysik/Bauphysik.json` (Materialbibliothek, Absorptionsgrade, zwei Beispiele), Grenzen, Lernziele.
- Den U-Wert-Kern hat Tranche 1 geprüft. Hier geprüft: f_Rsi, Phasenverschiebung und Nachhallzeit, alle drei inline gerechnet.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| BP1 | Beispiel 1: Putz 1,5 cm (0,70), KS 17,5 cm (0,99), MW 14 cm (0,035) | R_T = 4,368; U = 0,2289; f_Rsi = 1 − 0,25·U = 0,943 | identisch (4,37 / 0,229 / 0,94) |
| BP2 | Beispiel 2: Klassenraum 9 × 7 × 3 m, A3 | V = 189 m³, S = 222 m²; T_soll = 0,32·lg V − 0,17 = 0,558 s; ohne Absorber T = 2,775 s; Decke α 0,90: T = 0,477 s; Band 0,447 … 0,670 s | identisch |
| BP3 | Standardwand (Gipsputz, HLZ 24, EPS 16, Zementputz) | X = Σ d·√(πρc/(λ·86 400 s)) = 3,190; η = X·24/(2π) = 12,19 h; TAV = e^−X = 0,041; C = 247,6 kJ/(m²K); U = 0,186 | identisch (Formel im Code Zeile für Zeile) |
| BP4 | T_soll A2 (Hörsaal), V = 500 m³ | 0,37·lg 500 − 0,14 = 0,859 s | identisch |

**Fachtext und Normstand:**
- U-Wert-Grenzen nach Anlage 7 (Wand 0,24; Steildach 0,24; Flachdach 0,20; Kellerdecke 0,30) sind richtig (Verbraucherzentrale).
- Die R_si-Werte nach DIN EN ISO 6946, Tab. 7 sind richtig.
- DIN 18041:2016-03: Die T_soll-Formeln für A2/A3 und das Toleranzband (250 bis 2000 Hz 0,8 bis 1,2; 125 Hz 0,65 bis 1,45; 4000 Hz 0,65 bis 1,2) stimmen mit den Lehrbuchwiedergaben überein.

**Befunde**
- behoben: Grenzentext (GModG; Phasenverschiebung als Größenordnung ohne Übergangswiderstände und Reflexionen; Sabine).
- **offen – Frage T11-BP-1 (Büro):** Für das Mehrpersonenbüro (Gruppe B) setzt der Rechner einen Sollkorridor 0,60 bis 0,85 s an. DIN 18041 nennt für Gruppe B keine T_soll-Werte, sondern Empfehlungen für A/V. Soll der Korridor als „Orientierungswert, nicht DIN 18041“ bleiben (Empfehlung), oder soll die Gruppe B auf das A/V-Kriterium umgestellt werden?
- **offen – Frage T11-BP-2 (c-Werte):** spezifische Wärmekapazität Holzfaserdämmplatte 2100 J/(kgK) und Fichte 1600 J/(kgK) sind Lehrwerte. Abgleich mit DIN EN ISO 10456:2010-05 Tab. 3 bzw. DIN 4108-4:2020-11 (F-Freigabe).
- Hinweis: Die Bewertung der Phasenverschiebung (≥ 10 h „hervorragend“, 6 bis 10 h „ausreichend“) ist eine Faustregel, keine Normgröße. Das Modul kennzeichnet sie nicht ausdrücklich so.

**F-Freigabe-Stellen**
- c-Werte Holzfaser und Holz nach DIN EN ISO 10456 bzw. DIN 4108-4 (T11-BP-2).

**Umsetzung 29.10.2026**
- **T11-BP-1:** Der Korridor 0,60 bis 0,85 s für Gruppe B bleibt als **Orientierungswert**. Raumtyp, Ergebniszeile („Orientierungswert“ statt „DIN-Empfehlung“), Bewertungstext und Diagramm weisen jetzt aus, dass DIN 18041 für Gruppe B keine Soll-Nachhallzeit nennt, sondern A/V-Empfehlungen (`content/bauphysik/Bauphysik.json`, `src/modules/Bauphysik.tsx`). Quelle: DIN 18041:2016-03 (Gliederung Gruppe A/B, wie in der Prüfung oben).
- **T11-BP-2 (Normtext):** Werte unverändert; die c-Werte Holzfaser 2100 und Fichte 1600 J/(kgK) sind im Reiter Sommer als Lehrwerte gekennzeichnet („Abgleich mit DIN EN ISO 10456 Tab. 3 bzw. DIN 4108-4 ausstehend, vorläufig, F-Freigabe“). Fachgebiet der neuen F-Freigabe-Stelle: „Bauphysik – Feuchteschutz“ (Alternative `DIN EN ISO 10456` an den Suchtext angehängt).

**Empfehlung:** freigabefähig nach Klärung von T11-BP-1 und T11-BP-2.

- [ ] Modul freigeben

## 3. Thermische Eigenschaften & Dämmstoffe (`waermeeigenschaften`)

**Prüfumfang:** `src/modules/Waermeeigenschaften.tsx`, Kern `thermischeKennwerte` und `erforderlicheDaemmdicke` in `src/calc/waermeschutz.ts`, `content/waermeeigenschaften/Waermeeigenschaften.json` (Dämmstoffliste, zwei Beispiele, Formeln), Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| WE1 | Beton λ = 2,0, ρ = 2400, c = 1000 | b = 2190,9 J/(m²K√s); θ_K = (1100·33 + b·20)/(1100 + b) = 24,35 °C | identisch |
| WE1 | Fichte λ = 0,13, ρ = 500, c = 1600 | b = 322,5; θ_K = 30,05 °C | identisch |
| WE2 | Bestand 24 cm, λ = 1,0; U_Ziel = 0,24 | R_D,erf = 4,167 − 0,17 − 0,24 = 3,757 m²K/W; EPS 035: 13,15 cm; Holzfaser 040: 15,03 cm; PIR 025: 9,39 cm | identisch |

**Befunde**
- behoben: keine.
- Hinweis: λ-Werte der Dämmstoffliste sind übliche Nennwerte (z. B. Mineralwolle 0,032 bis 0,040). Der Text nennt die Bemessungswerte nach DIN 4108-4 als maßgebend.

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 4. Innendämmung vs. Außendämmung (`daemmung_vergleich`)

**Prüfumfang:** `src/modules/DaemmungVergleich.tsx`, `content/daemmungvergleich/DaemmungVergleich.json` (zwei Beispiele, Formeln, WTA-Merkblätter), Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| DV1 | Vollziegel 36,5 cm (λ 0,68), 20/−5 °C | R_T = 0,7068; θ_si = 15,40 °C; mit 6 cm Dämmung θ_si = 18,53 °C | identisch |
| DV1 | Grenzschicht Innen- / Außendämmung | 1,53 °C / 12,45 °C | identisch (1,5 / 12,4) |
| DV2 | f_Rsi Bestand | mit R_si = 0,13: 0,816; **mit R_si = 0,25 (DIN 4108-2): 0,646** | Modul nannte 0,82 → behoben (T11-DV-1) |
| DV3 | 20 °C / 50 % r. F., Schimmelkriterium 80 % | p_i = 1168 Pa; θ_si,min = 12,62 °C; f_Rsi = 0,705 | identisch (1169 Pa durch Rundung von p_sat) |

**Befunde**
- **behoben – T11-DV-1:** siehe Tabelle oben.
- Hinweis: WTA-Merkblätter 6-4-16/D und 6-5-14/D sind richtig zitiert. DIN EN 15026 als Grundlage der hygrothermischen Simulation ist richtig.

**F-Freigabe-Stellen:** DIN 4108-2:2013-02 bzw. 2026-05 (Abschnitt Mindestwärmeschutz, R_si = 0,25) – Abgleich Neuausgabe wie Tranche 3.

**Empfehlung:** freigabefähig nach Korrektur T11-DV-1.

- [ ] Modul freigeben

## 5. Energieausweis (`energieausweis`) – GModG-Rechtsstand

**Prüfumfang:** `src/calc/energieausweis.ts`, `src/modules/Energieausweis.tsx` (Reiter Übersicht, Annahmen, Rechner, Praxis/Recht), `content/energieausweis/Energieausweis.json`, Grenzen, Lernziele.

**Rechtsstand (Auftrag):**

| Punkt | Modul vorher | Öffentlicher Stand | Ergebnis |
|---|---|---|---|
| Verfahren | „Beschluss von Bundestag und Bundesrat am 10.07.2026“ | Gesetzesbeschluss des Bundestages Juli 2026, BR-Drs. 409/26 (BDB: 10.07.; Ökozentrum: 09.07., kein Vermittlungsausschuss) | ohne Tagesdatum, mit Drucksache – behoben |
| Verkündung / Inkrafttreten | 28.07.2026 / „gestaffelt ab 29.07.2026“ | BGBl. 2026 I Nr. 226 vom 28.07.2026; Stufe 1 am 29.07.2026, Stufe 2 am 01.01.2027 | ergänzt |
| 65-%-Regel, Bio-Treppe | entfällt; 10/15/30/60 % | bestätigt (§§ 42–46, Ökozentrum, BDB) | richtig |
| Neubau § 15 | 55 % des Referenzgebäudes „seit 2023“ | gilt bis 31.12.2026; ab 01.01.2027 entfällt der Faktor, neues Referenzgebäude (BDB) | ergänzt |
| Primärenergiefaktoren | Gas 1,1, Holz 0,2, Strom 1,8, Fernwärme 0,4 (Lehrwert) | bis 31.12.2026 wie GEG; ab 01.01.2027 f_P,tot u. a. fossil 1,1, biogen 0,7, Strom 1,5, Fernwärme-Standard 0,7 (Ökozentrum) | Hinweis ergänzt; Rechner unverändert (T11-EA-2) |
| Effizienzklassen Wohngebäude | A+ bis H nach Endenergie, Anlage 10 | A+ bis H unverändert (Ökozentrum) | richtig |
| Verbrauchsausweis | drei Jahre | ab 01.01.2027 zwei Jahre bei Wohngebäuden, jüngste Periode ≤ 18 Monate; Nichtwohngebäude nur noch bilanziert (H&G, BDB) | ergänzt |
| Gültigkeit | „genau 10 Jahre“ | längstens 10 Jahre; neuer Ausweis nach wesentlicher Änderung (H&G) | behoben |
| Nichtwohngebäude | Klassen A bis G ab 2027 (Anlage 10a) | bestätigt (nexvyra, Ökozentrum) | richtig |
| Normen | § 11/§ 14 auf DIN 4108-2:2013-02; DIN V 18599:2018-09 | § 14 ab 01.01.2027 auf DIN 4108-2:2026-05; DIN/TS 18599:2025-10 ab 01.01.2027 (BDB) | ergänzt |

**Nachrechnungen** (Lehrmodell laut Kernkommentar, eigene Umsetzung)

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| EA1 | EFH, A_N = 150 m², GEG-Standard, Fensterlüftung, Gas | H_T = 128,85 W/K; H′_T = 0,328; H_V = 63,75 W/K; q_h = 31; q_E = 56; q_P = 64; CO₂ 13 kg/(m²a); Klasse B | identisch |
| EA2 | MFH, 800 m², unsaniert, Öl | H_T = 1851,2 W/K; q_h = 128; q_E = 187; q_P = 209; Klasse F | identisch |
| EA3 | EFH 150 m², EH 40, KWL mit WRG, Sole-WP | q_h = max(10; …) = 10 (Hinweis); q_E = 9; q_P = 16; A+ | identisch |
| EA4 | MFH 1200 m², teilsaniert, Abluft, Fernwärme | q_h = 34; q_E = 58; q_P = 28; B | identisch |
| EA-B1 | Beispiel Gas gegen WP, q = 80 | q_E = 86,8 / 26,7; q_P = 98,0 / 48,1; C / A+ | identisch |
| EA-B2 | V_e = 540 m³ | A_N = 0,32·V_e = 172,8 m² | identisch |

**Befunde**
- **behoben – T11-EA-1:** siehe Tabelle oben.
- **offen – Frage T11-EA-2 (Faktoren 2027):** Soll der Rechner zum 01.01.2027 auf die neuen Primärenergiefaktoren umgestellt werden (Strom 1,5, biogen 0,7, Fernwärme 0,7)? Empfehlung: Schalter „Rechtsstand bis 31.12.2026 / ab 01.01.2027“. Die Werte sind vorher am Gesetzestext (Anlage 4 GModG, Fassung 2027) zu bestätigen (F-Freigabe). Ebenso das Referenzgebäude ohne den Faktor 0,55.
- **offen – Frage T11-EA-3 (CO₂-Faktoren):** Das Lehrmodell rechnet CO₂ mit Strom 380 g/kWh (UBA-Strommix), Pellets 30 und Fernwärme 120. Anlage 9 GEG nennt Strom 560 und Holz 20 g/kWh; ab 2027 gilt für Strom 100 g/kWh (Ökozentrum). Angleichen an Anlage 9, oder als Lehrwert stehen lassen? Die Kennzeichnung steht jetzt in den Grenzen.
- **offen – Frage T11-EA-4 (interne Gewinne):** Der Text nennt für q_i = 5 W/m² „rund 25 bis 30 kWh/(m²a)“, der Kern setzt pauschal 35 an. Das Heizperiodenverfahren der EnEV setzte Q_i = 22·A_N kWh/a. Wert vereinheitlichen?
- Hinweis Quiz (nicht geändert): Die Erklärung zu `q_ea_2` sagt „§§ 15, 16 und 79 bis 88 bleiben inhaltlich bestehen“. Ab 01.01.2027 ändern sich die Inhalte (Referenzgebäude, Energiebilanzausweis, digitale Ausweise). Die Nummern bleiben, „inhaltlich“ sollte entfallen. Die `coreRule` zu `q_ea_1` („Primärenergie ≤ 0,55 · Referenzgebäude“) gilt nur bis 31.12.2026.

**F-Freigabe-Stellen**
- Anlage 4 GModG (Fassung 01.01.2027): f_P,tot je Energieträger (T11-EA-2).
- Anlage 9 GModG: CO₂-Emissionsfaktoren (T11-EA-3).

**Umsetzung 29.10.2026**
- **T11-EA-2:** Stichtagsschalter „bis 31.12.2026 / ab 01.01.2027“ im Rechner (`src/calc/energieausweis.ts`, `rechtsstand`, Standard nach heutigem Datum). Ab 01.01.2027 f_p nach neuer Anlage 4 GModG: Erdgas/Heizöl 1,1, Holz/feste Biomasse 0,7, Netzstrom 1,5 (auch Hilfsstrom), Fernwärme 0,7 ([Haufe, Synopse Anlage 4 GEG/GModG](https://www.haufe.de/id/beitrag/synopse-geg-gmodg-anlage-4-zu-22-absatz-1-primaerenergiefaktoren-HI17241000.html)). Bis 31.12.2026 unverändert Gas/Öl 1,1, Holz 0,2, Strom 1,8 ([buzer.de, Anlage 4 GModG](https://www.buzer.de/Anlage_4_GModG.htm)); Fernwärme 0,4 bleibt Lehrwert. Das neue Referenzgebäude (ohne Faktor 0,55) ist im Lehrmodell nicht abgebildet; Hinweis im Rechner und in den Grenzen.
- **T11-EA-3:** CO₂-Faktoren nach Anlage 9: Erdgas 240, Heizöl 310, Holz 20 (vorher 30), Netzstrom 560 g/kWh (vorher Lehrwert 380) ([buzer.de, Anlage 9 GModG](https://www.buzer.de/Anlage_9_GModG.htm)). Ab 2027 Netzstrom 100 g/kWh nach Ökozentrum NRW (Fassung 2027 der Anlage 9 öffentlich nicht abrufbar: vorläufig, F-Freigabe). Fernwärme 120 g/kWh bleibt Lehrwert (Anlage 9 unterscheidet nach Erzeugung: 40 bis 400 g/kWh).
- **T11-EA-4 (Normtext):** Wert 35 kWh/(m²a) unverändert; im Kern, in den Grenzen und im Text „Interne Wärmegewinne“ als Lehrwert gekennzeichnet (maßgebend: Nutzungsprofil nach DIN/TS 18599-10; vorläufig, F-Freigabe).
- Nachrechnung (eigenes Skript): EA1 Gas 2027 q_P 63; EA2 Öl CO₂ 58, 2027 q_P 208; EA3 Sole-WP CO₂ 5 (2026) bzw. 1 (2027), q_P 16 bzw. 14; EA4 Fernwärme 2027 q_P 43; Startwerte WP: CO₂ 10 (vorher 7), 2027 q_P 27, CO₂ 2. Tests: `tests/energieausweis.test.ts`, `tests/modulpruefungTranche11.test.ts`.

**Empfehlung:** freigabefähig für den Rechtsstand bis 31.12.2026 nach Korrektur T11-EA-1. Vor dem 01.01.2027 sind T11-EA-2 und T11-EA-3 zu klären.

- [ ] Modul freigeben

## 6. Modulinfos Nachhaltigkeit (`nachhaltigkeit_info`)

**Prüfumfang:** `ModuleInfo` Gruppe Nachhaltigkeit (`MODULES_DATA.nachhaltigkeit`).

**Fakten-Stichprobe (5)**

| Aussage | Ergebnis | Quelle |
|---|---|---|
| DIN EN 15978:2026-09 | richtig (Neuausgabe, EN 15978:2026) | [DIN, Normseite](https://www.din.de/en/wdc-beuth:din21:399836772) |
| DIN EN 15804:2022-03 (EN 15804+A2) | richtig | Tranche 2 |
| QNG WG23: PLUS ≤ 24, PREMIUM ≤ 20 kg CO₂-Äq./(m² NRF·a) | richtig | QNG-Handbuch Anlage 3 (Modul `lca_rechner`, Tranche 2) |
| Module A1–A3, B1–B7, C1–C4, D | richtig | DIN EN 15978 |
| NPV = C₀ + Σ C_t/(1 + d)^t nach ISO 15686-5 | richtig | ISO 15686-5 |

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 7. Daten & Regeln (`nachhaltigkeit_daten_regeln`)

**Prüfumfang:** `src/modules/NachhaltigkeitDatenRegeln.tsx`, `DefinitionenTab.tsx`, `content/nachhaltigkeitdatenregeln/*.json` (Kennzahlen, Stoffströme, Klimakonferenzen, SDGs, Taxonomie, EPBD, EPD/DPP, deutsches Baurecht, zwei Beispiele), Lernziele, Kurzfassung.

**Nachrechnungen und Stichprobe**

| Aussage / Fall | Ergebnis | Quelle |
|---|---|---|
| Taxonomie: Q_P ≤ 0,90 · 40 = 36 kWh/(m²a); 34 ≤ 36 | richtig | Del. VO (EU) 2021/2139, Anh. I 7.1 |
| CRREM-Lehrpfad 52 → 18 kg CO₂e/(m²a): 2026 → 31,6; Schnittpunkt bei 20 kg → 2029,4 | richtig | eigene Rechnung |
| Bauabfälle 220 bis 230 Mio. t, Boden ~58 %, Bauschutt ~80 % Recycling | plausibel (Größenordnung des Monitoringberichts Kreislaufwirtschaft Bau, nicht erneut abgerufen) | – |
| Flächenverbrauch ~52 ha/d, Ziel < 30 ha/d bis 2030 | plausibel (Deutsche Nachhaltigkeitsstrategie, nicht erneut abgerufen) | – |
| GModG regelt „65 %-EE-Vorgabe“ | **falsch** – behoben (T11-NDR-1) | Ökozentrum NRW |
| QNG für „degressive AfA (5 %)“ | **falsch** – behoben (T11-NDR-2) | § 7b EStG |
| Anzeigepflicht „§ 25 EBV“ | **falsch** – behoben (T11-NDR-3) | § 22 EBV |
| EPBD: ZEB 2028/2030, GWP im Energieausweis, Förderstopp fossile Kessel 2025 | richtig | EPBD (EU) 2024/1275 |
| EPBD „Verbot von Gas-/Ölheizungen“, „GWP-Grenzen im Bauantrag“ | überzeichnet – behoben (T11-NDR-4) | EPBD Art. 7 |

**Befunde**
- **behoben – T11-NDR-1 bis -4:** siehe Tabelle oben. Das NZEB-Beispiel trägt jetzt die Befristung bis 31.12.2026. Die Renovierungswelle ist dem Jahr 2020 zugeordnet.
- **offen – F-Stelle Gebäudetyp E:** Der Stand „neuer Entwurf in Ressortabstimmung, nicht veröffentlicht (10/2026)“ ließ sich mit öffentlichen Quellen weder bestätigen noch widerlegen. Bitte bestätigen.
- Hinweis: Das CRREM-Beispiel rechnet linear 52 → 18 (2020 bis 2030). Der Simulator im Modul `lca_regulatorik` nutzt Stützwerte 52 → 38 (2025) → 18. Beides ist als Lehrwert gekennzeichnet.

**Umsetzung 29.10.2026**
- **GT-E:** Gebäudetyp E überall als „Gesetzentwurf, Stand 10/2026“ bezeichnet (Rechtsrahmen-Kompendium: Kurzname, Norm, Zusammenfassung, Meilensteine; Daten & Regeln Reiter 5; Leitfaden-Daten; Praxis-Reiter; Moduleinleitung Nachhaltigkeit). Der Regierungsentwurf 2024 (BT-Drs. 20/13959, § 650o BGB-E) ist als erledigt ausgewiesen. Quelle: Modultext Praxis/Gebäudetyp E (Stand Prüfung 28.10.).

**Empfehlung:** freigabefähig nach Korrektur T11-NDR-1 bis -4 (F-Stelle Gebäudetyp E).

- [ ] Modul freigeben

## 8. Materialoptimierung (`materialoptimierung`)

**Prüfumfang:** `src/calc/materialoptimierung.ts`, `src/modules/Materialoptimierung.tsx`, `DafstbRichtlinieTab.tsx`, `content/materialoptimierung/*.json` (Säulen, Betonprinzipien, Pflanzenkohle, zwei Beispiele), Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| MO1 | Decke 100 m², Hohlkörper, CEM III/A, 56 d, EAF | gwp_c = round(135·0,91) = 123; Ref 8060 + 2803 = 10 863; Opt 2399 + 1037 = 3436 kg; Δ = 68,37 % → A+ | identisch |
| MO2 | Stützen, C50/60 schlank, CEM II/B-S, 28 d, BOF | Ref 1268; Opt 437; Δ = 65,54 % | identisch |
| MO3 | Bodenplatte 28 cm, CEM II/A-LL, BOF | Opt 11 199; Δ = 33,04 % → B | identisch |
| MO4 | Wand 18 cm, CEM I, 56 d | gwp_c = 282; Opt 3893; Hinweis „Abschlag bei CEM I kaum begründbar“ | identisch |
| MO-B1 | Beispiel 1 Decke | 63,0 → 38,7 kg CO₂-Äq./m²; −38,6 % | identisch (39 %) |
| MO-B2 | Beispiel 2 k-Wert | (w/z)_eq = 165/(280 + 0,4·60) = 0,543 ≤ 0,60 | identisch |
| MO-B3 | Pflanzenkohle 10 kg je m³, 2,5 bis 3,0 t CO₂/t | 25 bis 30 kg CO₂ ≙ 10,4 bis 12,5 % von 240 kg | identisch („über 10 %“) |

**Befunde**
- **behoben – T11-MO-1:** siehe Tabelle oben. Die Effizienzklassen A+ bis C sind eine Lehreinteilung des Rechners. Die DAfStb-Richtlinie (Weißdruck August 2024, Teil 1 und 2) führt **Treibhausgas-Minderungsklassen** bezogen auf ein Referenzniveau 2020 ein. Deren Bezeichnungen und Grenzen sind öffentlich nicht wiedergegeben.
- **offen – Frage T11-MO-2 (Klassen der Richtlinie):** Sollen die Minderungsklassen der Richtlinie (Teil 1) mit ihren Grenzen übernommen werden (F-Freigabe, Richtlinientext), oder bleibt die Lehreinteilung (jetzt gekennzeichnet)?
- **offen – Frage T11-MO-3 (Lehrwerte uneinheitlich):** Die GWP-Lehrwerte sind im Modul nicht einheitlich:
  - Rechner: CEM-I-Beton 310 und CEM III/A 135 kg CO₂-Äq./m³, Betonstahl „BOF“ 0,98 kg/kg.
  - Beispiel 1: 245 bzw. 174 kg/m³, Elektrostahl 0,7 kg/kg.
  - EPD-Musterdatenbank (Modul `oekobilanz_lca`): C25/30 CEM I 245 kg/m³.

  Betonstahl wird in Deutschland überwiegend im Elektrolichtbogenofen erzeugt. Als Referenz ist die Hochofenroute daher fraglich. Werte vereinheitlichen und mit ÖKOBAUDAT-Datensätzen belegen?
- Hinweis: „Hohlkörperdecken verdrängen bis zu 35 % Beton“ und „Vorspannung verringert Deckendicken um 20 bis 25 %“ sind Größenordnungen aus der Praxisliteratur und nicht einzeln belegt.

**F-Freigabe-Stellen**
- Treibhausgas-Minderungsklassen der DAfStb-Richtlinie (neu als „vorläufig, F-Freigabe“ gekennzeichnet).
- GWP-Lehrwerte Beton je Zementart, Betonstahl, 56-d-Abschlag (bereits im Kern als offen markiert).

**Umsetzung 29.10.2026**
- **T11-MO-2 (Normtext):** nicht geändert; die Lehreinteilung ist bereits als „vorläufig, F-Freigabe“ gekennzeichnet (`DafstbRichtlinieTab.json`).
- **T11-MO-3:** Lehrwerte vereinheitlicht. Beton = 320 kg Zement · GWP_Zement + 30 kg/m³ (Lehrbeton C30/37 wie Beispiel OE-B1 im Modul LCA-Grundlagen und die Quizerklärung „286 auf 174“): CEM I 0,80 → 286; CEM II/A-LL 0,60 → 222 (entspricht ÖKOBAUDAT 2024-I „Transportbeton C25/30“ 221,7 kg/m³, [climatiq, ÖKOBAUDAT-Datensatz](https://www.climatiq.io/data/emission-factor/0dc72c3f-b968-441b-8e9b-2e22573a51c0)); CEM II/B-S 0,55 → 206 und CEM II/C-M 0,43 → 168 (vorläufig, F-Freigabe); CEM III/A 0,45 → 174. Vorher 310/250/190/135/105. Betonstahl getrennt nach Route: Referenz ÖKOBAUDAT „Bewehrungsstahl (de)“ 0,64 kg/kg (0,642; [Bauer, Artikel mit ÖKOBAUDAT-Angabe](https://geotechnical-solutions.bauer.de/de/media/7315/download)), Hochofenroute 0,98 (Lehrwert, vorläufig, F-Freigabe), Elektrostahl mit Grünstrom 0,42 (Lehrwert). Beispiel 1 auf dieselben Werte umgestellt: 70,0 → 37,6 kg CO₂-Äq./m² (−46 %). Erkundungsaufträge neu gerechnet (56 %/34 %, 23 %/14 %, 73 %/54 %).
- Nachrechnung (eigenes Skript): MO1 Ref 9266, Opt 4118, 55,56 % (A+); MO2 1065/458, 57,0 %; MO3 Opt 10 258, 28,9 % (B); MO4 Opt 3655, 24,7 % (C); MO5 Decke massiv CEM II/A-LL, Stahl DE: 6941 (B).

**Empfehlung:** freigabefähig nach Korrektur T11-MO-1 und Klärung von T11-MO-2 und T11-MO-3.

- [ ] Modul freigeben

## 9. LCA: Grundlagen (`oekobilanz_lca`)

**Prüfumfang:**
- `src/modules/OekobilanzLCA.tsx` (Teil Grundlagen) und `src/modules/LCA.tsx` (Phasen, Indikatoren, EPD-Musterdatenbank, Studierenden-Leitfaden, Übungsrechner A1–A4).
- `content/lca/LCA.json`, `content/oekobilanzlca/OekobilanzLCA.json` (Beispiele Zementanteil und QNG).
- Den Kern `einzelbaustoffA1A4` hat Tranche 2 geprüft.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| OE-B1 | 320 kg Zement, CEM I 0,80 / CEM III/A 0,45, Rest 30 | 286 / 174 kg CO₂-Äq./m³; −39,2 %; Zementanteil 89,5 % bzw. 82,8 % („80 bis 90 %“) | identisch |
| OE-B2 | MFH 1200 m² NRF, 1 050 t + 8 t/a · 50 a | 24,17 > 24 (PLUS knapp verfehlt); Holzhybrid −15 %: 21,54 (PLUS, nicht PREMIUM) | identisch |
| OE-B3 | Methan GWP100 nach IPCC AR5 | 28 | richtig |

**Fakten-Stichprobe:**
- QNG WG23: PENRT ≤ 96 bzw. 64 kWh/(m² NRF·a). Richtig, wie Tranche 2.
- Betrachtungszeitraum QNG 50 a. Richtig.
- CPR (EU) 2024/3110 mit AVCP-System 3+. Richtig.
- DIN EN 15978:2026-09. Richtig, siehe oben.

**Befunde**
- **behoben – T11-LCA-1:** siehe Tabelle oben (Widerspruch Modul D, GWP₁₀₅, GEG).
- **offen – Frage T11-LCA-2 (Nutzungsdauern im Leitfaden):** Der Leitfaden nennt als BBSR-Werte:
  - Außenfenster Holz/Alu 25 a
  - Flachdachabdichtung 20 a

  Das Modul `lebenszyklus_kosten` (Reiter Lebensdauern) arbeitet mit eigenen Spannen, z. B. Flachdach 15 bis 30 a. Bitte beide gegen die BBSR-Tabelle „Nutzungsdauern von Bauteilen für Lebenszyklusanalysen nach BNB“ (2017) abgleichen (F-Freigabe).
- Hinweis: „Kombinierte DoPC: Pflicht zur Ausweisung von Umweltindikatoren (insb. GWP)“ – die Pflicht entsteht erst schrittweise über delegierte Rechtsakte je Produktfamilie. Der Text könnte „schrittweise“ ergänzen.

**F-Freigabe-Stellen:** BBSR-Nutzungsdauern (T11-LCA-2).

**Umsetzung 29.10.2026**
- **T11-LCA-2:** Leitfaden: Außenfenster Holz-Aluminium 50 a (vorher 25 a), Holz und Kunststoff 40 a, im Betrachtungszeitraum kein Austausch; Flachdachabdichtung 20 a als Lehrwert gekennzeichnet. Beide „vorläufig, F-Freigabe“, weil die BBSR-Tabelle (Stand 2017) selbst nicht abgerufen wurde; Fensterwerte nach [42watt, Rahmenmaterialien mit BBSR-Werten](https://42watt.de/magazin/fensterrahmen-material-vergleich). Reiter Lebensdauern (`lebenszyklus_kosten`): Mittelwerte Fenster Holz/Kunststoff 30 → 40 a, Aluminium 40 → 50 a; Hinweis, dass die übrigen Spannen noch nicht einzeln abgeglichen sind.

**Empfehlung:** freigabefähig nach Korrektur T11-LCA-1 und Klärung von T11-LCA-2.

- [ ] Modul freigeben

## 10. LCA: Ingenieurbau (`lca_ingenieurbau`)

**Prüfumfang:** `src/modules/lca/IngenieurbauLCA.tsx` (inline: Brückenrechner Spannbeton-Hohlkasten gegen Stahlverbund, 100 a), `content/lca/IngenieurbauLCA.json`, Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| IB1 | Praxisfaktum: 5000 Lkw/d, 40 % betroffen, 0,95 kg je Lkw, 30 Tage | 57 t CO₂-Äq. | identisch |
| IB2 | Zyklen bei 100 a (Belag 15, Lager 30, Korrosionsschutz 25) | 6 / 3 / 4 (abgerundet) | identisch (Grenzen: „Anzahl abgerundet“) |
| IB3 | Quiz `qn_lca_ingenieurbau_3`: 6 Belagswechsel · 18 d, 4500 Lkw, 40 %, 0,95 kg | 6·18·4500·0,4·0,95 = 184,7 t | identisch mit Rechnerformel |

**Stichprobe:**
- EN 17472:2022 regelt die Bewertung der ökologischen, ökonomischen und sozialen Qualität von Ingenieurbauwerken ([SIS, SS-EN 17472:2022](https://www.sis.se/en/produkter/construction-materials-and-building/buildings/general/ss-en-174722022/)). Die drei Dimensionen sind damit richtig.
- Den Betrachtungszeitraum legt der Auftraggeber fest (Begriff 3.69). Richtig, wie im Modul.

**Befunde**
- behoben: „13 Kernindikatoren … PENRT“ (T11-LCA-1).
- Hinweis: Der Leitfaden im Modul `oekobilanz_lca` nennt für den Belag 15 bis 20 a, das Modul 12 bis 15 a, der Rechner 15 a. Die Angaben sind vereinbar, die Spannen könnten aber angeglichen werden.

**F-Freigabe-Stellen:** Zuordnung der Stauemissionen zu Modul B8 (bereits vermerkt, vorläufig).

**Empfehlung:** freigabefähig (F-Stelle Modul B8 bleibt).

- [ ] Modul freigeben

## 11. LCA: Rechtsrahmen & CRREM (`lca_regulatorik`)

**Prüfumfang:**
- `src/modules/Nachhaltigkeit.tsx` (Bereiche CRREM/Regulatorik und Praxis).
- `src/components/ui/RechtsrahmenKompendium.tsx` (23 Rechtsakte, Zeitleiste), `CrremSimulator.tsx`, `PraxisInnovationen.tsx`, `PraxisGebaeudetypE.tsx` und die zugehörigen JSON-Dateien.
- Der CBAM-Eintrag (Art. 31) war bereits ergänzt und wurde nur gegengelesen.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| LR1 | CRREM-Simulator Büro, Zielwert 2026 | Segment 2025 bis 2030: 38 − (2026 − 2025)/5 · (38 − 18) = 34,0 kg CO₂e/(m²a) | identisch |
| LR2 | Sanierung „Deep Capex“ −75 % bei 60 kg | 15 kg CO₂e/(m²a) | identisch |
| LR3 | ETS I: CEM I 0,8 t CO₂/t bei 100 €/t | 80 €/t | identisch |

**Fakten-Stichprobe (Auszug)**

| Aussage | Ergebnis |
|---|---|
| EPBD: ZEB 2028/2030, GWP ab 2028 (> 1000 m²) / 2030, MEPS 16/26 %, Wohnbestand −16 % 2030 / −20 bis 22 % 2035 | richtig |
| WPG: Wärmepläne bis 30.06.2026 (> 100 000 Einw.) bzw. 30.06.2028; Netze 30 % EE 2030, 80 % 2040 | richtig |
| BEHG 45 / 55 €/t, 2026 Korridor 55 bis 65 €/t; CO2KostAufG Stufe 10 ab 52 kg/(m²a) → 95 % | richtig |
| ETS I: Abschmelzen der freien Zuteilung 2026 bis 2034 (−2,5 % 2026, −48,5 % 2030) | richtig |
| ETS I „Richtlinie (EU) 2023/958“ | **falsch** (Luftverkehr), richtig 2023/959 – behoben |
| GModG § 36 „Dach U ≤ 0,14“ | **falsch** – behoben (Anlage 7: Steildach 0,24, Flachdach 0,20) |
| EPBD „Verbot fossiler Heizkessel bis 2040“; Zeitleiste „Start ETS II 2027“; „Novelle des GEG“ | überholt bzw. überzeichnet – behoben |
| GewAbfV § 8: zehn Fraktionen | richtig |
| ESPR (EU) 2024/1781, Inkrafttreten 18.07.2024 | richtig |

**Befunde**
- **behoben – T11-LR-1:** siehe Tabelle oben.
- **offen – Frage T11-LR-2 (Bio-Treppe 2045):** Das Kompendium nennt „100 % in 2045“ als Stufe der Bio-Treppe, ebenso die Verbraucherzentrale. Der BDB beschreibt die Treppe bis 60 % ab 2040 (fossiler Restanteil 40 %). Das Ökozentrum nennt für 2045 die geplante Grüngasquote; der Auftrag an die Bundesregierung (§ 42a) hat die Frist 01.12.2026, ein Gesetz liegt noch nicht vor. Soll „100 % 2045“ als „Ziel (Grüngasquote, noch nicht beschlossen)“ umformuliert werden? Empfehlung: ja.
- **offen – Frage T11-LR-3 (CSRD/CSDDD):** Die Schwellen und Fristen wurden mit dem Omnibus-Paket 2025/2026 geändert. Betroffen sind CSRD (u. a. „> 250 MA“, „rund 50 000 Unternehmen“) und CSDDD (2027/2029). Das ließ sich in dieser Prüfung nicht abschließend belegen. Aktualisieren lassen?
- **offen – Frage T11-LR-4 (Begriffe):**
  - „EMoCo“ als Sammelbegriff ist öffentlich nicht belegt.
  - BauPVO: „Rezyklatmindestanteile z. B. für mineralische Dämmstoffe, Betonbauteile“ sind Beispiele ohne Rechtsakt.
  - ETS-II-Verschiebung „durch Verordnung (EU) 2026/667“ – die Rechtsform (Änderung der Richtlinie 2003/87/EG) ist zu prüfen.

  Umformulieren?

**F-Freigabe-Stellen:** keine neuen.

**Umsetzung 29.10.2026** (PR #247 war gemergt; main vorher eingemergt)
- **T11-LR-2:** Bio-Treppe 10/15/30/60 % (2029 bis 2040) als beschlossen; „100 % 2045“ nur noch als Ziel der geplanten, noch nicht beschlossenen Grüngasquote (Zusammenfassung, Pflichten, Meilenstein 2045). Quelle: BDB und Ökozentrum NRW wie oben.
- **T11-LR-3:** CSRD/CSDDD nach Omnibus-Richtlinie (EU) 2026/470 (Amtsblatt 26.02.2026): CSRD > 1000 Beschäftigte und > 450 Mio. € Umsatz, spätestens ab Geschäftsjahr 2027, Umsetzungsfrist 19.03.2027; CSDDD > 5000 Beschäftigte und > 1,5 Mrd. €, Anwendung einheitlich ab 26.07.2029 ([Rödl & Partner](https://www.roedl.com/insights/csrd-omnibus-aenderungsrichtlinie-eu-amtsblatt/)). Beschlossenes und Geplantes (vereinfachte ESRS, deutsches Umsetzungsgesetz) getrennt; „rund 50 000 Unternehmen“ und „> 250 MA“ entfernt.
- **T11-LR-4:** „EMoCo“ ersetzt durch „Embodied Carbon (graue Emissionen)“ als Sammelbegriff ohne eigenen Rechtsakt; EPBD Art. 7 (Lebenszyklus-GWP, nationale Fahrpläne mit Grenzwerten ab 2030) statt „EU-Höchstwerte 2030“. BauPVO: Rezyklat-Beispiele ersetzt durch die Ermächtigung zu Mindestanforderungen über delegierte Rechtsakte. ETS II: Verschiebung durch Art. 2 der Verordnung (EU) 2026/667 vom 11.03.2026 (Änderung des Klimagesetzes (EU) 2021/1119), das ETS II selbst in der Richtlinie 2003/87/EG i. d. F. 2023/959 ([nexvyra, ETS2](https://nexvyra.de/fakten/eu-emissionshandel-ets2-2023-959.html); Sekundärquelle, im Modul als „am Amtsblatt zu bestätigen“ vermerkt).

**Empfehlung:** freigabefähig nach Korrektur T11-LR-1 und Klärung von T11-LR-2 bis -4.

- [ ] Modul freigeben

## 12. Zertifizierung & Deklarationen (`zertifizierung_siegel`)

**Prüfumfang:**
- `src/modules/ZertifizierungSiegel.tsx`, `Zertifizierung.tsx` (Systeme DGNB, BNB, QNG, BiRN, LEED, BREEAM, Beispiele) und `zertifizierung/KfnFoerderung.tsx` (KFN, neu).
- `Produktsiegel.tsx` und die zugehörigen JSON-Dateien.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| ZS1 | DGNB 2018: ENV 78, ECO 82, SOC 75, TEC 70, PRO 85, SITE 60 | 52,875 + 10,5 + 10,625 + 3,0 = 77,0 % → Gold, für Platin fehlen 3 Punkte | identisch |
| ZS2 | QNG: GWP 22,8, PENRT 101 | 22,8 ≤ 24, aber 101 > 96 → PLUS verfehlt; ΔPENRT = 5 | identisch |

**Stichprobe:**
- DGNB Version 2023.2: 25/25/25/10/10/5 %. Sie ersetzt ab 01.10.2026 die Version 2023 als Marktversion ([DGNB](https://www.dgnb.de/en/certification/buildings/new-construction/dgnb-system-new-construction-buildings-version-20232)). Richtig in `ZertifizierungSiegel.json`; in `Zertifizierung.json` ohne Version – behoben (T11-ZS-1).
- KFN (Reiter am 28.10. neu eingefügt): Förderstufen und Höchstbeträge mit Quellen im Modul (KfW-Programmseiten). In dieser Prüfung nur gegengelesen, nicht erneut abgerufen.
- Blauer Engel seit 1978; C2C-Stufen Basic bis Platinum. Richtig.

**Befunde**
- **behoben – T11-ZS-1:** siehe Tabelle oben.
- **offen – Frage T11-ZS-2 (QNG-Details):** In `Zertifizierung.json` sind zwei Angaben gegen das QNG-Handbuch (Anhang 4 bzw. Anforderung Holz) zu prüfen (F-Freigabe):
  - „Mindestens 80 % (Plus) oder 90 % (Premium) des Holzes FSC/PEFC-zertifiziert“
  - „Schadstoff-Steckbrief 313“

**F-Freigabe-Stellen:** QNG-Anforderung nachhaltige Holzbeschaffung, Schadstoffanforderungen (T11-ZS-2).

**Umsetzung 29.10.2026**
- **T11-ZS-2:** „Schadstoff-Steckbrief 313“ → QNG-Anhangdokument 3.1.3 „Schadstoffvermeidung in Baumaterialien“ (Anforderungen je Produktposition, u. a. AgBB, Formaldehyd, REACH; [QNG-ready-Zertifikat mit Anhangsangabe](https://www.pfleiderer.com/file_pim/Dokumente/qng-ready-premiumboard-mfp-living-p5-im0032536.pdf)). Holzquote 80/90 % öffentlich nicht belegt: als „vorläufig, F-Freigabe“ gekennzeichnet, Grundsatz (FSC/PEFC mit Chain-of-Custody) bleibt.

**Empfehlung:** freigabefähig nach Korrektur T11-ZS-1 und Klärung von T11-ZS-2. Kein Eintrag in `pruefvermerke.ts`.

- [ ] Modul freigeben

## 13. Kreislaufwirtschaft (`kreislauf_dpp`)

**Prüfumfang:** `src/modules/Kreislaufwirtschaft.tsx` (R-Strategien, Stoffströme, Schadstoffe, Erkundung nach DIN SPEC 91484, Re-Use-Inventar, UMI/MCI), `content/kreislaufwirtschaft/Kreislaufwirtschaft.json`, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| KW1 | LFI = (0,60 + 0,20)/2 = 0,40; X = 2 | F(X) = 0,45; MCI = 0,82; bei X = 1: 0,64 | identisch |
| KW2 | 1200 t: 950 Recycling, 120 Verfüllung, 50 energetisch, 80 Deponie | Q = 1070/1200 = 89,2 % ≥ 70 % | identisch |
| KW3 | Quiz `qn_kreislauf_dpp_1` (30 % Rezyklat, 10 % Re-Use, 40/20 % am Ende, 75 a / 50 a) | V = 0,60; W = 0,40; LFI = 0,50; X = 1,5; MCI = 1 − 0,5·0,6 = 0,70 | identisch mit Modulformel |

**Befunde**
- **behoben – T11-KW-1:** siehe Tabelle oben.
- **offen – Frage T11-KW-2 (Demo-Schnittstelle):** Die Re-Use-Inventar-Demo zeigt „Endpoint: api.concular.de/v1/sync“. Die Adresse gehört einem realen Unternehmen und suggeriert eine Schnittstelle, die es so nicht gibt. Empfehlung: neutrale Beispieladresse.
- Hinweis: Die Aussage „Bausektor über 50 % des weltweiten Ressourcenverbrauchs und Abfallaufkommens“ entspricht gängigen Sekundärangaben (z. B. UNEP). Das Abfallaufkommen ist in Deutschland mit rund 55 % belegt.

**F-Freigabe-Stellen:** keine.

**Umsetzung 29.10.2026**
- **T11-KW-2:** Re-Use-Demo neutralisiert: „Endpoint (Beispiel): api.example.org/v1/sync“, Überschriften und Texte ohne Firmennamen („Schnittstellen-Demo Bauteilbörse“, „Lehrdemo: Es wird keine Verbindung aufgebaut“); die Superlative „Deutschlands führender Marktplatz“ entfällt (`content/kreislaufwirtschaft/Kreislaufwirtschaft.json`).

**Empfehlung:** freigabefähig nach Korrektur T11-KW-1 und Klärung von T11-KW-2.

- [ ] Modul freigeben

## 14. Ressourcen & Umwelt (`ressourcen_umwelt`)

**Prüfumfang:** `src/modules/RessourcenUmwelt.tsx`, `RessourcenEmissionen.tsx`, `Nawaro.tsx` und die zugehörigen JSON-Dateien (Indikatoren, Zement-Dekarbonisierung, FNR-Produktliste, Vergleich Beton/BSH), Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| RU1 | KVH ρ = 500 kg/m³, u = 12 % | m_atro = 446,4 kg; m_C = 223,2 kg; CO₂ = 818,5 kg | identisch (818) |
| NW1 | BSH ρ₁₂ = 420 kg/m³ | 375 kg; 187,5 kg C; 687,5 kg CO₂ | identisch (688; „rund 0,69 t“) |
| RU2 | PENRT 1050 + 50 MJ | 1100 MJ = 305,6 kWh ≈ 2 m² · 150 kWh/(m²a) | identisch |

**Stichprobe:**
- C25/30 hat E_cm = 31 000 N/mm² und f_ctm = 2,6 N/mm²; GL24h hat E_0,mean = 11 500 N/mm². Richtig.
- Zement verursacht rund 8 % der weltweiten CO₂-Emissionen. Richtig (Größenordnung).
- DIN EN 16449: Die Formel ist richtig wiedergegeben.

**Befunde**
- behoben: Titel DIN 4108-2 in den Regelwerken.

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 15. Lebenszyklus & Kosten (`lebenszyklus_kosten`)

**Prüfumfang:** `src/calc/lcc.ts`, `src/modules/LebenszyklusKosten.tsx`, `LCC.tsx`, `Lebensdauern.tsx`, `Preisentwicklung.tsx` und die zugehörigen JSON-Dateien, Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| LCC1 | Szenario EPS-WDVS (Option A), r = 1,5 %, e = 5 %, i = 2 %, N = 50, ohne CO₂ | Barwert 228 237 € (Steigerung ab dem 2. Jahr, kein Ersatz und keine Instandhaltung im Jahr 50) | identisch |
| LCC2 | dto. mit CO₂-Preis 200 €/t, +2 %/a | 253 631 € | identisch |
| LCC3 | dto. mit linearem Restwert (Ersatz im Jahr 30, Rest 10/30) | 223 739 € | identisch |
| LCC4 | Barwertfaktor r = 1,5 %, p = 2 %, N = 50 | 55,703 | identisch |
| LCC5 | Beispiel 1: RBF(2 %; 30) · 2000 € | 22,397 → 44 793 € | identisch (44 800) |
| LCC6 | Beispiel 2: 20 000 €/1,03³⁰ | 8239,7 € | identisch |

**Befunde**
- **behoben – T11-LZK-1:** siehe Tabelle oben.
- **offen – Frage T11-LZK-2 (Kennwerte und Quellen):**
  - „UBA-Kostenansatz ca. 180 bis 200 €/t“ entspricht der Methodenkonvention 3.1 (Stand 2020). Die aktuelle Fassung nennt höhere Werte; das ist in dieser Prüfung nicht verifiziert. Aktualisieren?
  - Literatur „DGNB ENV2.1 / ECO1.1 Lebenszykluskosten“: Das Kriterium für Lebenszykluskosten ist ECO1.1.
  - Preisentwicklung: Destatis „Fachserie 17 Reihe 4“ ist eingestellt (heute GENESIS-Tabellen).
  - „VOB/B § 2 Abs. 3“ regelt Mengenabweichungen, keine Preisgleitklauseln.
- Hinweis: Die Lebensdauer-Spannen im Reiter Lebensdauern (z. B. Flachdach 15 bis 30 a) sind nicht einzeln gegen die BBSR-Tabelle belegt (siehe T11-LCA-2).

**F-Freigabe-Stellen:** BBSR-Nutzungsdauern (gemeinsam mit T11-LCA-2).

**Umsetzung 29.10.2026**
- **T11-LZK-2:** UBA-Klimakosten nach Methodenkonvention 4.0 (2026): 350 €/t CO₂-Äq. für 2026 bei 1 % reiner Zeitpräferenz, 1000 €/t bei 0 % (Euro 2025) ([UBA, Tabelle Klimakosten 06.07.2026](https://www.umweltbundesamt.de/system/files/medien/384/bilder/dateien/6_Tab_UBA-Empfehlung-Klimakosten_2026-07-06.pdf)); Eingabewert des Rechners unverändert. DGNB-Literatur auf ECO1.1 „Gebäudebezogene Kosten im Lebenszyklus“. Destatis: GENESIS-Tabellen 61261 statt eingestellter Fachserie 17 Reihe 4. Preisgleitformel: Quelle § 9d VOB/A und Stoffpreisgleitklausel VHB Bund Formblatt 225; VOB/B § 2 Abs. 3 nur noch als Regel zu Mengenabweichungen.
- Lebensdauern: siehe T11-LCA-2.

**Empfehlung:** freigabefähig nach Korrektur T11-LZK-1 und Klärung von T11-LZK-2.

- [ ] Modul freigeben

---

## Offene Fragen (Übersicht)

| Kennung | Modul | Frage | Empfehlung |
|---|---|---|---|
| T11-BP-1 | bauphysik | Sollkorridor Büro (Gruppe B) 0,60 bis 0,85 s ist kein DIN-18041-Wert | als Orientierungswert kennzeichnen |
| T11-BP-2 | bauphysik | c-Werte Holzfaser 2100, Fichte 1600 J/(kgK) | Abgleich DIN EN ISO 10456 / DIN 4108-4 (F) |
| T11-EA-2 | energieausweis | Rechner ab 01.01.2027 auf neue f_P und neues Referenzgebäude umstellen | Schalter Rechtsstand; Werte am Gesetzestext bestätigen (F) |
| T11-EA-3 | energieausweis | CO₂-Faktoren Lehrwerte (Strom 380) vs. Anlage 9 (560; ab 2027 100) | an Anlage 9 angleichen |
| T11-EA-4 | energieausweis | interne Gewinne 25 bis 30 (Text) vs. 35 (Kern) vs. 22 (EnEV) kWh/(m²a) | vereinheitlichen |
| T11-NDR (F) | nachhaltigkeit_daten_regeln | Stand Gebäudetyp E 10/2026 | bestätigen |
| T11-MO-2 | materialoptimierung | Minderungsklassen der DAfStb-Richtlinie übernehmen? | Richtlinientext Teil 1 (F) |
| T11-MO-3 | materialoptimierung | GWP-Lehrwerte uneinheitlich; Betonstahl-Referenz BOF | vereinheitlichen, ÖKOBAUDAT belegen |
| T11-LCA-2 | oekobilanz_lca, lebenszyklus_kosten | BBSR-Nutzungsdauern (Fenster, Flachdach) | Abgleich BBSR-Tabelle 2017 (F) |
| T11-LR-2 | lca_regulatorik | Bio-Treppe „100 % 2045“ | als Ziel (Grüngasquote, offen) formulieren |
| T11-LR-3 | lca_regulatorik | CSRD/CSDDD nach Omnibus-Paket | aktualisieren |
| T11-LR-4 | lca_regulatorik | „EMoCo“, BauPVO-Beispiele, Rechtsform ETS-II-Verschiebung | umformulieren |
| T11-ZS-2 | zertifizierung_siegel | QNG Holzquote 80/90 %, „Steckbrief 313“ | am QNG-Handbuch prüfen (F) |
| T11-KW-2 | kreislauf_dpp | Demo-Adresse eines realen Unternehmens | neutrale Beispieladresse |
| T11-LZK-2 | lebenszyklus_kosten | UBA-Klimakosten, DGNB-Kriterium, Destatis-Fachserie, VOB/B § 2 Abs. 3 | aktualisieren |

## Hinweise für den Quiz-Abgleich (nicht geändert)

- `q_ea_2`, Erklärung: „§§ 15, 16 und 79 bis 88 bleiben inhaltlich bestehen“ → „bleiben in der Nummerierung bestehen; ab 01.01.2027 ändern sich Referenzgebäude und Energieausweis“.
- `q_ea_1`, `gapAnalysis.coreRule`: „Primärenergie ≤ 0,55 · Referenzgebäude“ gilt bis 31.12.2026.
- Keine Quizfrage wird durch die Änderungen dieses PR falsch. Geprüft wurden alle Fragen der 15 Module mit Bezug zu GModG, AfA, Effizienzklassen, DAfStb, Modul D, DGNB-Gewichten, ETS II und MCI.

## QA

Die Ergebnisse stehen im PR-Text.
