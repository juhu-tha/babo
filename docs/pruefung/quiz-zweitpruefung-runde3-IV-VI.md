# Quiz: Zweitprüfung Runde 3 (Cluster IV–VI) – Vorschlagsliste (ohne Freigabe)

Stand: 28.10.2026 · Grundlage: `src/data/quiz.json` auf main (Stand fc525dc5) · Prüfschema wie Zweitprüfung 27.10. (Frage, Optionen, richtige Antwort, Erklärung, Rückmeldungen zu den Distraktoren und normRef gegen Modulinhalt, Rechenkerne, Kennwerte und öffentliche Quellen; Rechenfragen nachgerechnet; Distraktoren, Längen- und Formulierungshinweise, Zahlformat).

**Wichtig:** In dieser Runde wurde **nichts freigegeben** (`verified` bleibt `false`, kein `reviewer`/`reviewedAt`). Die Liste ist ein Vorschlag; freigegeben wird erst nach Bestätigung durch Ankreuzen. Die Tausendertrennung wurde nicht angefasst (separate Umstellung).

## Umfang

- Alle Fragen der Cluster IV, V und VI (Zuordnung `quizCluster` in `src/data/quizZuordnung.ts`), die nicht freigegeben sind (`verified !== true`) und nicht bereits in `docs/pruefung/quiz-zweitpruefung-runde2.md` stehen.
- **Geprüft gesamt:** 252 Fragen in 64 Modulen (Cluster IV: 172, Cluster V: 65, Cluster VI: 15).
- Rechenfragen wurden vollständig nachgerechnet, einschließlich der in den Rückmeldungen genannten Fehlerwege der Distraktoren; Simulator-Werte (CRREM, Transportbeton-Übung, Altholz-Sortierbilanz) mit den Modulfunktionen bzw. Rechenkernen abgeglichen.
- Öffentliche Quellen für Rechts- und Systemstände: dgnb.de (DGNB System Neubau 2023.2), IFA/DGUV „air_pcb_2025.pdf“ (AIR-Richtwerte PCB), Infoblatt Kreis Gütersloh (TrinkwV, Blei).

## Ergebnis

| ok | korrigiert | Klärung |
|---:|---:|---:|
| 245 | 7 | 0 |

Korrekturen sind in `src/data/quiz.json` eingetragen (`vorpruefung.hinweis` „Zweitprüfung 28.10. (Runde 3): … – korrigiert“). Die richtigen Antworten aller korrigierten Fragen bleiben inhaltlich unverändert; berichtigt wurden Rundungen und Rückmeldungen zu Distraktoren.

## Daten & Regeln (`nachhaltigkeit_daten_regeln`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ndr_3` | IV | Welche Bedingungen muss eine Bauaktivität nach Art. 3 der Taxonomie-Verordnung (… | ok | - [ ] freigeben |
| `q_ndr_8` | IV | Welche Lebenszyklusmodule gehen nach den QNG-Bilanzierungsregeln in das GWP eine… | ok | - [ ] freigeben |

## Materialoptimierung (`materialoptimierung`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_mo_1` | IV | Welche Maßnahme senkt das GWP (A1–A3) von Transportbeton meist am stärksten? | ok | - [ ] freigeben |
| `q_mo_2` | IV | Wie groß ist (w/z)_eq bei w = 165, z = 280 und f = 60 kg/m³ Flugasche (k = 0,4)? | ok | - [ ] freigeben |
| `qn_materialoptimierung_1` | IV | Modulare Holzständer-Trennwände, die sich bei Mieterwechsel werkzeuglos versetze… | ok | - [ ] freigeben |
| `qn_materialoptimierung_4` | IV | Ein Planer möchte zertifizierte Pflanzenkohle in tragendem Beton einsetzen. Welc… | ok | - [ ] freigeben |

## LCA-Rechner & QNG-Nachweis (`lca_rechner`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_oe_1` | IV | Welche GWP-Anforderungswerte gelten für Wohngebäude nach QNG (WG23)? | ok | - [ ] freigeben |
| `qn_lca_rechner_1` | IV | Im CO₂-Rechner werden 20 m³ Normalbeton C25/30 (CEM I) bilanziert: A1–A3 = 245 k… | ok | - [ ] freigeben |
| `qn_lca_rechner_2` | IV | Der Wandkonfigurator liefert für „Stahlbeton + EPS (WDVS)“ U = 0,232 W/(m²K) und… | ok | - [ ] freigeben |
| `qn_lca_rechner_3` | IV | In der Transportbeton-Übung sinkt das GWP A1–A5 von rund 299 kg CO₂-Äq./m³ (CEM… | ok | - [ ] freigeben |
| `qn_lca_rechner_x_1` | IV | In der Transportbeton-Übung werden 320 kg Zement über 80 km und 1 870 kg Gestein… | ok | - [ ] freigeben |

## Ökobilanzierung (LCA) (`oekobilanz_lca`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_oe_2` | IV | Wie werden Recycling-Gutschriften (Modul D) in einer Gebäude-Ökobilanz behandelt… | ok | - [ ] freigeben |
| `qn_oekobilanz_lca_g2` | IV | Welchem Lebenszyklusmodul nach DIN EN 15978 ist der Austausch eines Bauteils wäh… | ok | - [ ] freigeben |
| `qn_oekobilanz_lca_g3` | IV | In welcher Einheit wird das Treibhauspotenzial (GWP) in einer EPD nach DIN EN 15… | ok | - [ ] freigeben |

## Zertifizierung & Deklarationen (`zertifizierung_siegel`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_zs_1` | IV | Ein Projekt erreicht einen Gesamterfüllungsgrad von 77 %. Welche DGNB-Auszeichnu… | ok | - [ ] freigeben |
| `q_zs_2` | IV | Was ist eine Umweltproduktdeklaration (EPD) nach DIN EN 15804? | ok | - [ ] freigeben |
| `q_zs_3` | IV | Wie sind die Themenfelder im DGNB System Gebäude Neubau (Version 2023 und 2023.2… | ok (Gewichtung 25/25/25/10/10/5 % für Version 2023.2 auf dgnb.de bestätigt) | - [ ] freigeben |
| `q_zs_4` | IV | Was bestätigt ein DGNB-Vorzertifikat für einen Neubau? | ok | - [ ] freigeben |
| `q_zs_5` | IV | Welche Mindestanforderung gilt im DGNB System Neubau 2023.2 für alle Gebäude, un… | ok (Mindestanforderungen ENV1.1, SOC1.2, SITE1.1 auf dgnb.de bestätigt) | - [ ] freigeben |
| `q_zs_7` | IV | Wer bestätigt in der Bundesförderung, dass ein Gebäude die Anforderungen von QNG… | ok | - [ ] freigeben |
| `q_zs_8` | IV | Wie wird der GWP-Anforderungswert für ein Nichtwohngebäude nach QNG (NWG23) fest… | ok | - [ ] freigeben |

## Kreislaufwirtschaft (`kreislauf_dpp`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_kw_1` | IV | LFI = 0,40, Nutzungsfaktor X = 2,0. Wie groß ist der MCI = 1 − LFI · 0,9/X? | ok | - [ ] freigeben |
| `q_kw_2` | IV | Welche Mindestquote für die stoffliche Verwertung nicht gefährlicher Bau- und Ab… | ok | - [ ] freigeben |
| `qn_kreislauf_dpp_1` | IV | Ein Produkt enthält 30 % Rezyklat und 10 % wiederverwendete Teile; am Lebensende… | ok | - [ ] freigeben |
| `qn_kreislauf_dpp_2` | IV | Im Re-Use-Inventar nach DIN SPEC 91484 werden vier Bauteile erfasst. Welches ist… | ok | - [ ] freigeben |

## Ressourcen & Umwelt (`ressourcen_umwelt`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ru_1` | IV | Wie viel CO₂ ist in 1 m³ Nadelholz (ρ = 500 kg/m³ bei u = 12 %) gespeichert? | ok | - [ ] freigeben |
| `qn_ressourcen_umwelt_1` | IV | Eine Brettsperrholz-Decke enthält 12 m³ Holz mit ρ = 470 kg/m³ bei u = 12 %. Wie… | ok | - [ ] freigeben |
| `qn_ressourcen_umwelt_2` | IV | Warum reichen alternative Brennstoffe im Drehrohrofen allein nicht aus, um die Z… | ok | - [ ] freigeben |
| `qn_ressourcen_umwelt_3` | IV | Holzfaserdämmung und EPS haben ähnliche Wärmeleitfähigkeiten. Warum verzögert di… | ok | - [ ] freigeben |
| `qn_ressourcen_umwelt_4` | IV | Für die Innendämmung einer feuchtekritischen Fachwerkwand soll ein nachwachsende… | ok | - [ ] freigeben |

## Lebenszyklus & Kosten (`lebenszyklus_kosten`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_lk_1` | IV | Barwert von 2 000 €/a über 30 Jahre bei r = 2 %? | ok | - [ ] freigeben |
| `q_lk_2` | IV | Wie wirkt ein höherer Kalkulationszins auf den Variantenvergleich „teure, langle… | ok | - [ ] freigeben |
| `qn_lebenszyklus_kosten_1` | IV | Eine Flachdachabdichtung muss nach 20 Jahren für 14 000 € erneuert werden. Welch… | ok | - [ ] freigeben |

## Altbauatlas (`bestand`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bst_3` | IV | Eine Bestandswand hat U = 1,40 W/(m²K). Sie erhält 12 cm Dämmung mit λ = 0,035 W… | korrigiert: Rückmeldungen zu 0,29 und 0,35 W/(m²K) berichtigt (0,29 ist der Wert ohne R_alt; 0,35 entspräche rund 7,5 cm Dämmung) | - [ ] freigeben |
| `q_bst_4` | IV | Wie funktioniert eine kapillaraktive Innendämmung (z. B. Calciumsilikat) bauphys… | ok | - [ ] freigeben |
| `q_bst_5` | IV | In einer Außenwandecke wird bei θ_i = 20 °C und θ_e = −5 °C eine Oberflächentemp… | ok | - [ ] freigeben |
| `q_bst_6` | IV | Warum sinken die typischen U-Werte von Außenwänden in Westdeutschland ab Ende de… | ok | - [ ] freigeben |

## Bauwerkserfassung (`bauwerkserfassung`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bwe_2` | IV | Wie geht die Druckspannung in den Querschnittsnachweis für Druck und Biegung nac… | ok | - [ ] freigeben |
| `qn_bauwerkserfassung_2` | IV | Ein Treppenhaus mit glatten, einfarbig weiß gestrichenen Wänden soll erfasst wer… | ok | - [ ] freigeben |
| `qn_bauwerkserfassung_3` | IV | Was setzt die Cloud-to-Cloud-Registrierung (C2C) mehrerer Scanstandpunkte in Lei… | ok | - [ ] freigeben |
| `qn_bauwerkserfassung_4` | IV | Sparren C24, b/h = 120/160 mm, L = 4,5 m, q_d = 2,5 kN/m, N_d = 25 kN; im Aufmaß… | ok | - [ ] freigeben |

## Modernisierung & GModG (`modernisierung`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_mod_1` | IV | Eine Wand mit U = 1,40 W/(m²K) soll mit EPS (λ = 0,032 W/(mK)) auf U ≤ 0,24 W/(m… | ok | - [ ] freigeben |
| `qn_modernisierung_1` | IV | Ein Flachdach mit U_alt = 0,90 W/(m²K) wird mit PUR (λ = 0,024 W/(mK)) saniert;… | ok | - [ ] freigeben |
| `qn_modernisierung_2` | IV | Eine Fassadendämmung senkt den U-Wert um ΔU = 1,0 W/(m²K) auf A = 120 m² (F_x =… | ok | - [ ] freigeben |
| `qn_modernisierung_4` | IV | Ein Eigentümer will zuerst eine Wärmepumpe einbauen und die Fassade erst in eini… | ok | - [ ] freigeben |

## Bauwerksdiagnose & ZfP (`bauwerksuntersuchung`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bwu_1` | IV | Ein 36 Jahre altes Bauteil hat eine Karbonatisierungstiefe von 15 mm. Bei welche… | ok | - [ ] freigeben |
| `q_bwu_2` | IV | Warum darf der Rückprallwert allein nicht zur Festigkeitseinstufung eines Bestan… | ok | - [ ] freigeben |
| `qn_bauwerksuntersuchung_1` | IV | Acht Bohrkerne ergeben f_m,is = 34,5 N/mm², s = 3,0 N/mm² und f_is,lowest = 30,0… | ok | - [ ] freigeben |

## Hist. Bauweisen (`historische_bauweisen`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_hb_1` | IV | Welche Kraft muss bei einer preußischen Kappendecke an den Randfeldern zusätzlic… | ok | - [ ] freigeben |
| `qn_historische_bauweisen_1` | IV | Ein Segmentbogen (L = 4,0 m, Stich f = 1,0 m) trägt w = 12 kN/m und im Scheitel… | ok | - [ ] freigeben |
| `qn_historische_bauweisen_2` | IV | Eine preußische Kappe hat einen Trägerabstand a = 1,20 m, eine Stichhöhe f = 12… | ok | - [ ] freigeben |
| `qn_historische_bauweisen_3` | IV | Ein Eichenständer mit radialer Abmessung 200 mm trocknet im Gebäude von u = 26 %… | ok | - [ ] freigeben |
| `qn_historische_bauweisen_4` | IV | Bei einem historischen Dach sind die Balkenköpfe der Deckenbalken an der Traufe… | ok | - [ ] freigeben |

## Hist. Bauprodukte (`historische_bauprodukte`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_hp_2` | IV | Was gilt nach der Trinkwasserverordnung 2023 für Trinkwasserleitungen aus Blei? | ok (Blei 5 µg/l ab 12.01.2028 bestätigt, Infoblatt Kreis Gütersloh) | - [ ] freigeben |
| `qn_historische_bauprodukte_1` | IV | Welcher Bauepoche ordnet das Modul den Isteg-Stahl (zwei kalt verdrillte Rundstä… | ok | - [ ] freigeben |
| `qn_historische_bauprodukte_2` | IV | Bei der Umnutzung einer Fabrikhalle des 19. Jahrhunderts sollen gusseiserne Stüt… | ok | - [ ] freigeben |
| `qn_historische_bauprodukte_4` | IV | Bei einer Dachsanierung wird Glaswolle gefunden, die nachweislich 1985 hergestel… | ok | - [ ] freigeben |

## Checklisten (`bestand_checklisten`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_cl_1` | IV | Wozu dient die Richtlinie VDI 6200? | ok | - [ ] freigeben |
| `q_cl_3` | IV | Eine Bohrmehlprobe wiegt feucht 52,0 g und nach dem Darren bei 105 °C 48,0 g. Wi… | ok | - [ ] freigeben |
| `q_cl_4` | IV | Warum dürfen Rückprallwerte des Schmidt-Hammers bei älterem Beton nicht ohne Kal… | ok | - [ ] freigeben |
| `q_cl_5` | IV | Was zeigt eine Potentialfeldmessung an einer Stahlbetonplatte an? | ok | - [ ] freigeben |
| `q_cl_6` | IV | Eine frische Bruchfläche wird mit Phenolphthalein besprüht. Ein 18 mm tiefer Ran… | ok | - [ ] freigeben |

## Boden- & Materialaufbereitung (`boden_materialaufbereitung`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bm_1` | IV | Wie viele Mischproben verlangt die LAGA PN 98 mindestens für ein Haufwerk von 10… | ok | - [ ] freigeben |
| `q_bm_2` | IV | Welches Mindestvolumen muss eine Einzelprobe bei einem Größtkorn von 32 mm nach… | ok (Modultabelle d_max ≤ 32 mm: 2 l; Laborprobe = 2 · Einzelprobe) | - [ ] freigeben |
| `qn_boden_materialaufbereitung_1` | IV | Wie viele Mischproben verlangt die LAGA PN 98 (Tabelle 2) nach dem Probenahme-Re… | ok | - [ ] freigeben |
| `qn_boden_materialaufbereitung_4` | IV | Ein toniger, schluffiger Boden ist mit Schwermetallen belastet. Welches Aufberei… | ok | - [ ] freigeben |

## Abfälle & Altlasten (`abfaelle`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ab_4` | IV | Was bedeutet der Stern im AVV-Abfallschlüssel 17 06 05* (asbesthaltige Baustoffe… | ok | - [ ] freigeben |

## Schad- und Gefahrstoffe (`schadstoffe`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_sch_1` | IV | Was muss der Veranlasser (Bauherr) nach § 5a GefStoffV vor Arbeiten an einem Geb… | ok | - [ ] freigeben |
| `q_sch_2` | IV | Welche Faserkonzentrationen begrenzen den Bereich mittleren Risikos bei Asbest? | ok | - [ ] freigeben |
| `q_sch_3` | IV | Die Laboranalyse einer ausgebauten Mineralwolle ergibt einen Kanzerogenitätsinde… | ok | - [ ] freigeben |
| `q_sch_4` | IV | In einem Klassenzimmer werden 1 200 ng/m³ PCB (PCBges) in der Raumluft gemessen.… | ok (AIR 2025: RW I 80, RW II 800 ng/m³ PCBges bestätigt, Quelle IFA/DGUV „air_pcb_2025.pdf“; Hinweis: Module Hist. Bauprodukte und Rückbau nennen nur die PCB-Richtlinie 1994 mit 300/3 000 ng/m³) | - [ ] freigeben |
| `q_sch_5` | IV | Welche Substanz dient bei teerhaltigen Parkettklebern und Asphalten als Leitsubs… | ok | - [ ] freigeben |

## Altholz-NIR-Sortierung und Urban Mining (`altholz_urban_mining`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_altholz_urban_mining_3` | IV | Worauf beruht die Unterscheidung von Holz, Holzwerkstoffen und Beschichtungen mi… | ok | - [ ] freigeben |
| `qn_altholz_urban_mining_4` | IV | Warum reicht eine NIR-Sortierung allein nicht aus, um mit Kupfer-Chrom-Salzen im… | ok | - [ ] freigeben |
| `qn_altholz_urban_mining_5` | IV | Eine Anlage erhält 100 t Altholz: 60 t A I/A II und 40 t A III/A IV. 54 t A I/A… | ok | - [ ] freigeben |
| `qn_altholz_urban_mining_6` | IV | In einer Sortierbilanz werden von 25 t A IV 1,25 t in die stoffliche Linie fehlg… | ok (Sortierbilanz mit Rechnerwerten nachgerechnet: 1,25/58,25 t; Fehlsortierquote 8,75 %) | - [ ] freigeben |
| `qn_altholz_urban_mining_7` | IV | Was beschreibt ein Materialkataster im Sinne des Urban Mining? | ok | - [ ] freigeben |

## PFAS in Baustoffen (`pfas_baustoffe`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_pfas_baustoffe_1` | IV | Warum werden PFAS als „Ewigkeitschemikalien“ bezeichnet? | ok | - [ ] freigeben |
| `qn_pfas_baustoffe_2` | IV | Welche Anwendung im Bauwesen hat besonders häufig zu PFAS-Altlasten in Boden, Gr… | ok | - [ ] freigeben |
| `qn_pfas_baustoffe_7` | IV | Wozu dient der TOP-Assay in der PFAS-Analytik? | ok | - [ ] freigeben |

## Ressourceneffizienz (`ressourceneffizienz`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_re_1` | IV | Wie verändert sich der MCI eines Produkts mit LFI = 0,5, wenn sich seine Nutzung… | ok | - [ ] freigeben |
| `qn_ressourceneffizienz_1` | IV | Alte Gerüstbohlen werden zu Möbeln verarbeitet, also in einem neuen Produkt mit… | ok | - [ ] freigeben |
| `qn_ressourceneffizienz_2` | IV | Für eine Decke mit 120 m³ Beton (2,4 t/m³) sinkt die Transportentfernung durch r… | ok | - [ ] freigeben |
| `qn_ressourceneffizienz_3` | IV | Im ROI-Rechner hat ein Projekt 800 m² Nutzfläche (1,45 t/m² verbaute Masse), dav… | ok | - [ ] freigeben |
| `qn_ressourceneffizienz_4` | IV | Ein Bauherr will den CO₂-Fußabdruck eines Betonbaus vor allem durch 35 % RC-Gest… | ok | - [ ] freigeben |

## Checklisten (`rueckbau_checklisten`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_rc_2` | IV | Eine mobile Brechanlage bricht auf einer Abbruchbaustelle den dort angefallenen… | ok | - [ ] freigeben |
| `q_rc_3` | IV | In welcher Reihenfolge läuft ein selektiver Rückbau nach der Rückbau-Checkliste… | ok | - [ ] freigeben |
| `q_rc_4` | IV | Bei einem kleinen Umbau fallen insgesamt 8 m³ Bau- und Abbruchabfälle an. Was gi… | ok | - [ ] freigeben |
| `q_rc_5` | IV | Was zählt zur Zielquote von mindestens 70 Gew.-% für nicht gefährliche Bau- und… | ok | - [ ] freigeben |
| `q_rc_6` | IV | Ein Bauherr will die Schadstofferkundung erst nach Vergabe der Abbrucharbeiten b… | ok | - [ ] freigeben |

## Prinzipien & Übersicht (`dauerhaftigkeit`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_dh_2` | IV | Welches Nennmaß der Betondeckung ergibt sich für XD3 bei Stabdurchmesser 16 mm? | ok | - [ ] freigeben |
| `q_dh_3` | IV | Ein Grundwasser enthält 1 500 mg/l Sulfat. Welche Expositionsklasse liegt vor un… | ok | - [ ] freigeben |
| `qn_dauerhaftigkeit_1` | IV | Eine bewitterte Außenwand (XC4) ist mit Stäben Ø 20 mm bewehrt. Welches Nennmaß… | ok | - [ ] freigeben |
| `qn_dauerhaftigkeit_2` | IV | Nach wie vielen Jahren erreicht die Karbonatisierungsfront bei k = 5,0 mm/√a ein… | ok | - [ ] freigeben |
| `qn_dauerhaftigkeit_3` | IV | An einer Fassade sollen Bleche und Schrauben kombiniert werden. Welche Paarung b… | ok | - [ ] freigeben |

## Bewehrungskorrosion (`korrosion`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ko_1` | IV | Wie verändert sich die Zeit bis zur Depassivierung, wenn die Betondeckung halbie… | ok | - [ ] freigeben |
| `q_ko_2` | IV | Welcher gleichmäßige Stahlabtrag entspricht etwa einer Korrosionsstromdichte von… | ok | - [ ] freigeben |
| `qn_korrosion_3` | IV | Ein Stab Ø 16 mm korrodiert 15 Jahre gleichmäßig mit i_corr = 2 µA/cm² (1 µA/cm²… | ok | - [ ] freigeben |
| `qn_korrosion_4` | IV | Warum ist die Korrosionsgeschwindigkeit depassivierter Bewehrung bei wassergesät… | ok | - [ ] freigeben |

## Betonkorrosion (`schadreaktionen_beton`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_sb_1` | IV | Welche drei Bedingungen müssen für eine schädigende AKR zusammenkommen? | ok | - [ ] freigeben |
| `qn_schadreaktionen_beton_1` | IV | Ein Beton enthält 380 kg/m³ Zement mit einem Na₂O-Äquivalent von 0,95 M.-%. Wie… | ok | - [ ] freigeben |

## Holzkorrosion (`holzkorrosion`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ho_1` | IV | Welche Gebrauchsklasse gilt für einen Holzpfahl mit ständigem Erdkontakt? | ok | - [ ] freigeben |
| `q_ho_2` | IV | Eine Holzprobe wiegt feucht 512 g und gedarrt 418 g. Wie hoch ist die Holzfeucht… | ok | - [ ] freigeben |

## Metallkorrosion (`metallkorrosion`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_me_1` | IV | Welcher PREN ergibt sich für 1.4404 mit 17 % Cr, 2,0 % Mo und 0,05 % N? | ok | - [ ] freigeben |
| `q_me_2` | IV | Wie lange schützt eine Zinkschicht von 85 µm etwa in Korrosivitätskategorie C3 (… | ok | - [ ] freigeben |
| `qn_metallkorrosion_2` | IV | Ein Stahlträger hat 120 µm Feuerverzinkung und steht in Korrosivitätskategorie C… | ok | - [ ] freigeben |

## Checklisten (`dauerhaftigkeit_checklisten`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_dc_3` | IV | Betondeckungsmessung an einer XD1-Wand: Mittelwert 47 mm, Standardabweichung 4,5… | korrigiert: Distraktor 33,0 → 33,5 mm (47 − 3 · 4,5), Rückmeldung angepasst | - [ ] freigeben |
| `q_dc_4` | IV | Ein Außenbauteil ist XC4 zugeordnet (c_min,dur = 25 mm, Stabdurchmesser 12 mm).… | ok | - [ ] freigeben |
| `q_dc_5` | IV | Für XF4 ist ein Mindestluftgehalt im Frischbeton nachzuweisen. Mit welchem Verfa… | ok | - [ ] freigeben |
| `q_dc_6` | IV | Wovon hängt beim Entwurfsgrundsatz „Selbstheilung“ der WU-Richtlinie die zulässi… | ok | - [ ] freigeben |

## Typische Bauschäden (`schadensbilder`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ms_tb_2` | IV | Wie verändert sich die kritische Risslänge a_c, wenn sich die Bruchzähigkeit K_I… | ok | - [ ] freigeben |
| `q_ms_tb_3` | IV | Warum platzt die Betondeckung über korrodierender Bewehrung ab? | ok | - [ ] freigeben |
| `q_ms_tb_4` | IV | Auf einem Flachdach läuft Regenwasser von einer Kupferabdeckung über eine verzin… | ok | - [ ] freigeben |
| `q_ms_tb_5` | IV | Welche drei Voraussetzungen müssen für eine schädigende Alkali-Kieselsäure-Reakt… | ok | - [ ] freigeben |

## Große Materialschäden & Einstürze (`material_schaeden_gross`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ms_mg_2` | IV | Welche Kombination führte zum Einsturz der Eislaufhalle Bad Reichenhall 2006? | ok | - [ ] freigeben |
| `q_ms_mg_3` | IV | Welche Schadensmechanismen nennt die Untersuchung des Zugunglücks von Burgrain (… | ok | - [ ] freigeben |
| `q_ms_mg_4` | IV | Warum führte bei der Silver Bridge (1967) der Bruch eines einzelnen Augenstabs z… | ok | - [ ] freigeben |
| `q_ms_mg_5` | IV | Hyatt Regency: Statt einer durchlaufenden Hängestange wurden zwei versetzte Stan… | ok | - [ ] freigeben |
| `q_ms_mg_6` | IV | K_Ic = 30 MPa·√m, σ = 300 MPa, Randriss Y = 1,12. Wie groß ist die kritische Ris… | ok | - [ ] freigeben |

## Schadensaufnahme-Checklisten (`schaeden_checklisten`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ms_sc_1` | IV | Eine Rissmarke zeigt eine Zunahme von 0,20 auf 0,26 mm in sechs Monaten. Was fol… | ok | - [ ] freigeben |
| `q_ms_sc_3` | IV | Bohrmehlprobe: feucht 85,0 g, darrtrocken 80,2 g, maximale Wasseraufnahme 15,0 M… | korrigiert: Distraktor 37 % → 38 % (Bezug auf Feuchtmasse: 5,65/15,0), Rückmeldung angepasst | - [ ] freigeben |
| `q_ms_sc_4` | IV | Warum zeichnet man bei der Rissüberwachung mit Wegaufnehmern gleichzeitig die Ba… | ok | - [ ] freigeben |
| `q_ms_sc_5` | IV | Bohrmehl aus Bewehrungstiefe ergibt 0,7 M.-% Chlorid bezogen auf Zement (Stahlbe… | ok | - [ ] freigeben |
| `q_ms_sc_6` | IV | Vor dem Öffnen von Bauteilen eines Bürogebäudes von 1988: Womit ist bei der Scha… | ok | - [ ] freigeben |

## Stahlbetoninstandhaltung (`instandhaltung`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_is_sb_1` | IV | Wer plant nach TR Instandhaltung Instandsetzungsmaßnahmen an Betonbauwerken? | ok | - [ ] freigeben |
| `q_is_sb_2` | IV | Welches Oberflächenschutzsystem eignet sich für eine befahrene Parkdeckfläche mi… | ok | - [ ] freigeben |
| `qn_instandhaltung_1` | IV | Für eine Tiefgaragendecke von 800 m² mit 0,8 m² Bewehrungsoberfläche je m² Baute… | ok | - [ ] freigeben |
| `qn_instandhaltung_2` | IV | Ein 0,3 mm breiter Riss in einer Wand ändert seine Breite temperaturbedingt; er… | ok | - [ ] freigeben |

## Instandsetzung nach Material (`instandsetzung_materialien`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_is_im_1` | IV | Warum hält ein Duplex-System (Verzinkung + Beschichtung) länger als die Summe de… | ok | - [ ] freigeben |
| `q_is_im_2` | IV | Ein Balken 160/220 mm verliert seitlich je 30 mm und unten 30 mm durch Fäule. We… | ok | - [ ] freigeben |
| `qn_instandsetzung_materialien_2` | IV | Ein runder Zugstab aus Stahl (Ø 24 mm) hat ringsum gleichmäßig 1,5 mm Material v… | ok | - [ ] freigeben |
| `qn_instandsetzung_materialien_3` | IV | Auf der Baustelle soll ein Stahlträger beschichtet werden: Stahloberfläche 8 °C,… | ok | - [ ] freigeben |
| `qn_instandsetzung_materialien_4` | IV | Ein feuchtes, salzbelastetes Altziegelmauerwerk soll neu verputzt werden. Welche… | ok | - [ ] freigeben |

## WTA-Merkblätter (`wta`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_is_wta_2` | IV | Welches Nachweisverfahren beschreibt WTA-Merkblatt 6-5 für Innendämmungen? | ok | - [ ] freigeben |
| `q_is_wta_3` | IV | Welchen rechtlichen Status haben WTA-Merkblätter? | ok | - [ ] freigeben |
| `q_is_wta_4` | IV | Ein Sockelmauerwerk ist hoch mit Chloriden, Nitraten und Sulfaten belastet. Welc… | ok | - [ ] freigeben |
| `q_is_wta_5` | IV | Welcher Anstrich eignet sich als Endbeschichtung auf einem WTA-Sanierputz? | ok | - [ ] freigeben |
| `q_is_wta_6` | IV | Horizontalsperre durch Bohrlochinjektion: Wand 38 cm, Bohrlochabstand 12,5 cm in… | ok | - [ ] freigeben |

## Instandsetzungs-Checklisten (`instandsetzung_checklisten`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_is_cl_1` | IV | Welcher Mindestabstand zwischen Oberflächen- und Taupunkttemperatur gilt übliche… | ok | - [ ] freigeben |
| `q_is_cl_3` | IV | Welcher Oberflächenvorbereitungsgrad wird für freigelegten Bewehrungsstahl vor d… | ok | - [ ] freigeben |
| `q_is_cl_4` | IV | Ein Trennriss in einer Wand bewegt sich temperaturbedingt und soll nur abgedicht… | ok | - [ ] freigeben |
| `q_is_cl_5` | IV | Rissinjektion mit Bohrpackern in einer 40 cm dicken Wand: Welcher Packerabstand… | ok | - [ ] freigeben |
| `q_is_cl_6` | IV | Wer muss nach TR Instandhaltung die Instandsetzung eines standsicherheitsrelevan… | ok | - [ ] freigeben |

## LCA im Ingenieurbau (DIN EN 17472) (`lca_ingenieurbau`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_lca_ingenieurbau_1` | IV | Welches Merkmal unterscheidet die Ökobilanz von Ingenieurbauwerken nach DIN EN 1… | ok | - [ ] freigeben |
| `qn_lca_ingenieurbau_2` | IV | Der Brücken-Simulator rechnet mit Austauschintervallen von 15 a (Fahrbahnbelag),… | ok | - [ ] freigeben |
| `qn_lca_ingenieurbau_3` | IV | Spannbeton-Hohlkasten im Simulator: 100 Jahre, 6 Belagswechsel mit je 18 Tagen T… | ok | - [ ] freigeben |
| `qn_lca_ingenieurbau_5` | IV | Mit Schnellbau (−65 % Sperrzeit) sinkt die Summe A–C der Spannbetonbrücke im Sim… | ok | - [ ] freigeben |
| `qn_lca_ingenieurbau_6` | IV | Auf welche Bezugsgröße wird der spezifische Kennwert GWP_Ing einer Brücke im Mod… | ok | - [ ] freigeben |

## Rechtsrahmen, CRREM & Praxis (`lca_regulatorik`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_lca_regulatorik_2` | IV | CRREM-Simulator, Büroimmobilie: Ausgangsintensität 45 kg CO₂-Äq./(m²·a), Maßnahm… | ok (Zielpfad im Simulator nachgerechnet) | - [ ] freigeben |
| `qn_lca_regulatorik_3` | IV | Wohngebäude mit 30 kg CO₂-Äq./(m²·a): Der Simulator liefert als Stranding-Jahr o… | ok (Zielpfad im Simulator nachgerechnet) | - [ ] freigeben |
| `qn_lca_regulatorik_5` | IV | Ein Importeur führt 1000 t Zement mit 0,8 t CO₂ je t Zement ein. Der EU-ETS-Prei… | ok | - [ ] freigeben |
| `qn_lca_regulatorik_6` | IV | Ab wann ist das Lebenszyklus-GWP nach der EPBD (EU) 2024/1275 laut Modul für Neu… | ok | - [ ] freigeben |

## Denkmalpflege (`denkmalpflege`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_denkmalpflege_1` | IV | Halit (V_m = 27,0 cm³/mol) kristallisiert bei T = 293 K und einer Übersättigung… | ok | - [ ] freigeben |
| `qn_denkmalpflege_3` | IV | Beim Aushub für ein Einfamilienhaus in Bayern kommen Mauerreste und Tonscherben… | ok | - [ ] freigeben |
| `qn_denkmalpflege_4` | IV | Bei einem Scheunenumbau entdeckt ein Architekt bauhistorisch bedeutende Fachwerk… | ok | - [ ] freigeben |

## Rückbau & Material (`rueckbau`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_rueckbau_1` | IV | Das Rückbaukonzept eines Bürogebäudes nennt 800 m³ Beton (2,4 t/m³), 250 m³ Maue… | ok | - [ ] freigeben |
| `qn_rueckbau_2` | IV | Warum muss nach dem LfU-Leitfaden die Schadstoffentfrachtung abgeschlossen und f… | ok | - [ ] freigeben |
| `qn_rueckbau_3` | IV | Ein Verwaltungsbau von 1982 soll rückgebaut werden. Welche Schadstoffkombination… | ok | - [ ] freigeben |

## Tragwerksmonitoring (SHM) (`bauwerksunters_monitoring`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bauwerksunters_monitoring_1` | IV | Ein beheizter Zementestrich ergibt bei der CM-Messung 2,0 CM-%. Ist er nach dem… | ok | - [ ] freigeben |
| `qn_bauwerksunters_monitoring_3` | IV | An einem 40 Jahre alten Bauteil werden ein Rückprallwert R = 42 und eine Karbona… | ok | - [ ] freigeben |

## Zustandsbewertung (`vdi6200`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_vdi6200_2` | IV | In welchem Intervall ist nach der Tabelle im Modul die eingehende Überprüfung du… | ok | - [ ] freigeben |

## Korrosionsschutz durch Beschichtungen (`korrosionsschutz_beschichtungen`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_korrosionsschutz_beschichtungen_1` | IV | Welche Schutzdauerklasse nach DIN EN ISO 12944-1 steht für eine erwartete Schutz… | ok | - [ ] freigeben |
| `qn_korrosionsschutz_beschichtungen_5` | IV | Welche Verbindung ist an der Atmosphäre hinsichtlich Kontaktkorrosion am ungünst… | ok | - [ ] freigeben |
| `qn_korrosionsschutz_beschichtungen_6` | IV | Ein Beschichtungssystem auf Stahl ist 100 µm dick. Welchen Schnittabstand verlan… | ok | - [ ] freigeben |
| `qn_korrosionsschutz_beschichtungen_7` | IV | Beim Haftabzug nach DIN EN ISO 4624 reißt ein Prüfstempel mit 20 mm Durchmesser… | ok | - [ ] freigeben |
| `qn_korrosionsschutz_beschichtungen_8` | IV | Welcher Korrosivitätskategorie nach DIN EN ISO 12944-2 ordnet die Norm die Innen… | ok | - [ ] freigeben |

## Schnellkarbonatisierung (DIN EN 12390-12) (`schnellkarbonatisierung`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_schnellkarbonatisierung_1` | IV | Bei welcher CO₂-Konzentration werden die Probekörper nach DIN EN 12390-12 gelage… | ok | - [ ] freigeben |
| `qn_schnellkarbonatisierung_2` | IV | Nach dem Wurzel-t-Gesetz beträgt die Karbonatisierungstiefe nach 25 Jahren 10 mm… | ok | - [ ] freigeben |
| `qn_schnellkarbonatisierung_3` | IV | Nach 7, 28 und 70 Tagen bei 3 % CO₂ werden 2,0 / 4,0 / 6,3 mm gemessen. Wie groß… | ok | - [ ] freigeben |
| `qn_schnellkarbonatisierung_5` | IV | Für einen Beton gilt näherungsweise K_nat = 3,0 mm/√a. Nach wie vielen Jahren er… | ok | - [ ] freigeben |
| `qn_schnellkarbonatisierung_6` | IV | Was zeigt der farblose Saum nach dem Besprühen einer frischen Bruchfläche mit Ph… | ok | - [ ] freigeben |
| `qn_schnellkarbonatisierung_7` | IV | Ein Gutachter will aus K_AC eines Prüfbetons die Karbonatisierungstiefe eines 40… | ok | - [ ] freigeben |

## BIM für Baustoffe (`bim_baustoffe`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_dg_bim_1` | V | Welche Norm beschreibt das offene Datenformat IFC in der Version 4.3? | ok | - [ ] freigeben |
| `qn_bim_baustoffe_3` | V | Eine IfcWall aus Stahlbeton misst 8,0 m × 2,75 m × 0,20 m. Die verknüpfte EPD ne… | ok | - [ ] freigeben |
| `qn_bim_baustoffe_4` | V | Eine Wand 12,0 m × 3,0 m × 0,24 m enthält ein Fenster mit 2,0 m² Fläche. Das LCA… | ok | - [ ] freigeben |

## Materialdatenbanken (`materialdatenbanken`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_dg_db_1` | V | Eine EPD nennt 1,20 kg CO₂e/kg für Mineralwolle (30 kg/m³). Wie groß ist das GWP… | ok | - [ ] freigeben |
| `q_dg_db_3` | V | Worin unterscheiden sich generische Datensätze der ÖKOBAUDAT von herstellerspezi… | ok | - [ ] freigeben |
| `q_dg_db_4` | V | Eine Bauleiterin braucht für ein Epoxidharz-Beschichtungssystem Angaben zu GHS-E… | ok | - [ ] freigeben |
| `q_dg_db_5` | V | Welche Rolle hat die ÖKOBAUDAT in der deutschen Gebäudeökobilanzierung? | ok | - [ ] freigeben |
| `q_dg_db_6` | V | Eine Kalksandsteinwand ist 17,5 cm dick (ρ = 1 800 kg/m³). Der Datensatz nennt G… | ok | - [ ] freigeben |

## Digitaler Produktpass (DPP) (`dpp`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_dg_dpp_2` | V | Seit wann ist die neue Bauprodukteverordnung (EU) 2024/3110 anwendbar? | ok | - [ ] freigeben |
| `q_dg_dpp_3` | V | Wie wird Modul D in einer EPD nach EN 15804+A2 behandelt? | ok | - [ ] freigeben |
| `qn_dpp_1` | V | Eine EPD für 1 m³ Betonfertigteil deklariert: A1–A3 = 320, C3 = 12, C4 = 3 und D… | ok | - [ ] freigeben |
| `qn_dpp_2` | V | Eine Kunststoff-Abdichtungsbahn weist je m² PENRE = 2 400 MJ (energetisch) und P… | ok | - [ ] freigeben |

## KI: Überblick & Grundlagen (`ki_ueberblick`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ki_ub_4` | V | Was leistet Retrieval-Augmented Generation (RAG) bei einem Sprachmodell für Norm… | ok | - [ ] freigeben |
| `q_ki_ub_5` | V | Risserkennung: TP = 45, FP = 5, FN = 15. Wie groß ist der F1-Wert? | korrigiert: Rückmeldung zu 0,90 berichtigt (ohne TN keine Accuracy bestimmbar; 0,90 ist die Precision) | - [ ] freigeben |
| `q_ki_ub_6` | V | Wie verhalten sich Künstliche Intelligenz (KI), maschinelles Lernen (ML) und Dee… | ok | - [ ] freigeben |

## KI: Systemarchitektur (`ki_system`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ki_sy_2` | V | Ein Neuron hat z = 0,86. Welcher Ausgabewert ergibt sich mit der Sigmoid-Funktio… | ok | - [ ] freigeben |
| `qn_ki_system_1` | V | Ein Frage-Embedding q = (1; 1; 0) wird mit drei Textabschnitten verglichen: A =… | korrigiert: Rückmeldung zum Distraktor „C mit cos θ ≈ 1,00“ berichtigt | - [ ] freigeben |
| `qn_ki_system_2` | V | Ein Neuron erhält die Eingänge x = (0,5; 2,0), die Gewichte w = (1,2; −0,8) und… | ok | - [ ] freigeben |
| `qn_ki_system_3` | V | In welcher Reihenfolge laufen die Schritte einer RAG-Pipeline nach dem Modul ab? | ok | - [ ] freigeben |
| `qn_ki_system_4` | V | Ein ML-Modell, trainiert mit Daten von Portlandzementbetonen, soll die 28-Tage-F… | ok | - [ ] freigeben |

## KI: Prompting-Praxis (`ki_prompting`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ki_pr_1` | V | Warum steigen die Kosten in einem langen Chatverlauf mit jeder Rückfrage? | ok | - [ ] freigeben |
| `q_ki_pr_2` | V | Ein Kontext von 128 000 Token, 2 000 Token Systemprompt und 8 000 Token Antwortr… | ok | - [ ] freigeben |
| `qn_ki_prompting_2` | V | Eine Normenanalyse umfasst 60 Seiten à 500 Wörter (1,5 Token je Wort). Die Antwo… | ok | - [ ] freigeben |
| `qn_ki_prompting_4` | V | Ein Büro möchte, dass ein Sprachmodell Gutachten exakt im hauseigenen Aufbau „Da… | ok | - [ ] freigeben |

## KI: Tools für Thesen (`ki_thesen`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ki_th_2` | V | Woraus ergibt sich die Pflicht, KI-Einsatz in einer Bachelorarbeit offenzulegen? | ok | - [ ] freigeben |
| `qn_ki_thesen_1` | V | Ein KI-Tool liefert 50 Artikel, davon sind 30 relevant. Insgesamt sind 40 releva… | ok | - [ ] freigeben |
| `qn_ki_thesen_2` | V | Ein KI-generiertes Skript gibt für eine Regression der Druckfestigkeit über den… | ok | - [ ] freigeben |
| `qn_ki_thesen_3` | V | Welche Zuordnung von Werkzeugen zu Arbeitsphasen einer Abschlussarbeit entsprich… | ok | - [ ] freigeben |
| `qn_ki_thesen_4` | V | Eine Studentin möchte unveröffentlichte Laborergebnisse eines Industriepartners… | ok | - [ ] freigeben |

## KI: Fehler, Recht & Ethik (`ki_recht_ethik`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ki_re_2` | V | Ein Büro lädt Pläne mit Bauherrennamen in einen US-Cloud-Chat ohne Vertrag hoch.… | ok | - [ ] freigeben |
| `q_ki_re_3` | V | Ein Büro lässt eine KI ohne weitere eigene Gestaltung ein Fassadenrendering erze… | ok | - [ ] freigeben |
| `q_ki_re_4` | V | Ein Tragwerksplaner übernimmt eine von einem Sprachmodell erzeugte Bemessung ung… | ok | - [ ] freigeben |
| `q_ki_re_5` | V | Ein Mitarbeiter hat versehentlich Bauherrendaten in ein öffentlich zugängliches… | ok | - [ ] freigeben |
| `q_ki_re_6` | V | Unter welcher Bedingung ist das Auslesen frei zugänglicher Fachartikel für das T… | ok | - [ ] freigeben |

## KI: Lokale KI (LM Studio) (`ki_lokal`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ki_lk_1` | V | Wie viel Speicher belegen die Gewichte eines 14B-Modells in Q4_K_M (rund 4,85 bi… | ok | - [ ] freigeben |
| `qn_ki_lokal_1` | V | Ein 32B-Modell (32 · 10⁹ Parameter) wird in Q4_K_M mit rund 4,85 bit je Gewicht… | ok | - [ ] freigeben |
| `qn_ki_lokal_2` | V | Ein Gutachterbüro möchte das Meta-Modell Llama 70B Instruct in Q4_K_M (Gewichte… | ok | - [ ] freigeben |
| `qn_ki_lokal_3` | V | Ein Schadensgutachten soll in fünf Jahren mit identischem KI-Ergebnis nachvollzo… | ok | - [ ] freigeben |

## KI in der Baustoffkunde (`ki_baustoffe`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ki_bs_2` | V | Abweichungen von 3, −2, 4 und −1 N/mm². Wie groß ist der RMSE? | ok | - [ ] freigeben |
| `q_ki_bs_3` | V | Lehrmodell f_c = 105 − 110 · (w/z) in N/mm², trainiert für w/z 0,40 bis 0,65. We… | ok | - [ ] freigeben |
| `q_ki_bs_4` | V | Prognosefehler an vier Würfeln: 1, −1, 2 und −4 N/mm². Wie groß ist der mittlere… | ok | - [ ] freigeben |
| `q_ki_bs_6` | V | Ein Team meldet RMSE = 0,8 N/mm²; die Validierungswürfel waren auch im Training… | ok | - [ ] freigeben |

## Planung & Ausschreibung (`px_planung`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_px_pl_1` | V | Welches Nennmaß c_nom ergibt sich für XC4 (c_min,dur = 25 mm), Ø 12 mm und Δc_de… | ok | - [ ] freigeben |
| `q_px_pl_3` | V | In welcher Leistungsphase der HOAI (Gebäude) werden die Leistungsverzeichnisse a… | ok | - [ ] freigeben |
| `q_px_pl_4` | V | Welche Leistungsphase hat beim Leistungsbild Gebäude und Innenräume nach § 34 HO… | ok | - [ ] freigeben |
| `q_px_pl_5` | V | Wie sind Bedarfspositionen (Eventualpositionen) in einer Leistungsbeschreibung n… | ok | - [ ] freigeben |
| `q_px_pl_6` | V | Ein öffentlicher Auftraggeber will im LV festschreiben: „Mehrkosten aus unvorher… | ok | - [ ] freigeben |

## Bauleitung & Baustelle (`px_bauleitung`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_px_bl_1` | V | Ein Beton mit z = 300 kg/m³ und w/z = 0,55 erhält 10 l Wasser je m³ zusätzlich.… | ok | - [ ] freigeben |
| `qn_px_bauleitung_2` | V | Bei der Bewehrungsabnahme soll der Grundwert der Verankerungslänge für Ø 14 mm i… | ok | - [ ] freigeben |
| `qn_px_bauleitung_4` | V | Auf einem beheizten Zementestrich soll Parkett verlegt werden. Welche Prüfung mi… | ok | - [ ] freigeben |

## Karrierestart & Soft Skills (`px_karriere`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_px_ka_2` | V | Herstellkosten 100 000 €, AGK 9 %, Wagnis und Gewinn 5 %. Wie hoch ist der Angeb… | ok | - [ ] freigeben |
| `qn_px_karriere_1` | V | Für 180 m² Mauerwerk werden ein Aufwandswert von 0,9 h/m² und ein Mittellohn von… | ok | - [ ] freigeben |
| `qn_px_karriere_3` | V | Der Polier sagt am Telefon die Freigabe einer geänderten Bewehrung durch den Tra… | ok | - [ ] freigeben |

## Bautagebuch (`px_bautagebuch`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_px_bt_1` | V | Was gilt, wenn der Auftragnehmer eine Behinderung nicht schriftlich anzeigt? | ok | - [ ] freigeben |
| `q_px_bt_2` | V | Eine Ausschalfrist von 3 Tagen bei 20 °C soll auf 5 °C mittlere Betontemperatur… | ok | - [ ] freigeben |
| `qn_px_bautagebuch_1` | V | Der Lieferschein nennt eine mittlere Druckfestigkeit von 10 N/mm² nach 2 Tagen u… | ok | - [ ] freigeben |
| `qn_px_bautagebuch_3` | V | Ein Eintrag beschreibt eine Deckenbetonage bei 2 °C Tiefsttemperatur, nennt aber… | ok | - [ ] freigeben |
| `qn_px_bautagebuch_4` | V | Bei der Mensa-Sanierung ordnet der Projektleiter mündlich an, aus Kostengründen… | ok | - [ ] freigeben |

## Kuriositäten & Rekorde (`kuriositaeten`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ku_1` | V | Wie groß ist der adiabatische Temperaturanstieg bei 260 kg/m³ Zement mit 350 kJ/… | ok | - [ ] freigeben |
| `q_ku_3` | V | Beton (ρ = 2 400 kg/m³) wird 606 m senkrecht gepumpt. Wie groß ist allein der hy… | ok | - [ ] freigeben |
| `q_ku_4` | V | Wie verringerten die römischen Baumeister die Eigenlast der unbewehrten Pantheon… | ok | - [ ] freigeben |
| `q_ku_5` | V | N_Ed = 5 000 kN. Normalbeton f_cd = 17 N/mm², UHPC f_cd = 85 N/mm² (Lehrwerte, n… | ok | - [ ] freigeben |
| `q_ku_6` | V | Was trägt nach Gustave Eiffel und der Betreibergesellschaft am meisten zur Erhal… | ok | - [ ] freigeben |

## Materialpässe (`materialpaesse`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_materialpaesse_2` | V | Ein Bauteil hat 50 % Rezyklatanteil und wird am Lebensende zu 60 % verwertet; di… | ok | - [ ] freigeben |
| `qn_materialpaesse_3` | V | Im Urban Mining Lab wird der Circularity Indicator als Mittel aus Rezyklat-Input… | ok | - [ ] freigeben |

## Bauphysik: U-Wert (`rechnung_u_wert`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_rechnung_u_wert_1` | VI | Welche Wärmeübergangswiderstände setzt das Modul nach DIN EN ISO 6946 für den ho… | ok | - [ ] freigeben |
| `qn_rechnung_u_wert_2` | VI | Eine Außenwand besteht aus 1,5 cm Kalkgipsputz (λ = 0,70 W/(mK)), 20 cm Normalbe… | ok | - [ ] freigeben |

## Beton: Mischungsentwurf (`rechnung_beton`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_rechnung_beton_1` | VI | Für XC4, Konsistenz F3 und Größtkorn 32 mm setzt das Modul einen Wasseranspruch… | ok | - [ ] freigeben |
| `qn_rechnung_beton_2` | VI | Für XD3 ergibt sich mit w = 165 l/m³ ein Zementgehalt von c = 366,7 kg/m³ (ρ_z =… | ok | - [ ] freigeben |
| `qn_rechnung_beton_3` | VI | Ein Beton enthält c = 280 kg/m³ CEM I, f = 80 kg/m³ Flugasche (k = 0,4; anrechen… | ok | - [ ] freigeben |
| `qn_rechnung_beton_4` | VI | Mischung je m³: 320 kg Zement mit 20 °C, 165 kg Wasser mit 12 °C und 1 850 kg Ge… | ok | - [ ] freigeben |

## Massivbau: Biegung (`rechnung_stahlbeton`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_rechnung_stahlbeton_1` | VI | Welcher Bemessungswert der Betondruckfestigkeit f_cd ergibt sich für C30/37 mit… | ok | - [ ] freigeben |
| `qn_rechnung_stahlbeton_2` | VI | Ein Rechteckbalken b/h = 30/50 cm aus C30/37 (f_cd = 17,0 N/mm², d_1 = 4,5 cm) w… | ok | - [ ] freigeben |
| `qn_rechnung_stahlbeton_5` | VI | Die erforderliche Biegezugbewehrung beträgt A_s,erf = 5,40 cm². Gewählt werden 3… | ok | - [ ] freigeben |
| `qn_rechnung_stahlbeton_6` | VI | Was beschreibt die Nutzhöhe d im Biegebemessungsverfahren des Moduls? | ok | - [ ] freigeben |

## Mauerwerk: Tragfähigkeit (`rechnung_mauerwerk`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_rechnung_mauerwerk_3` | VI | Wie groß ist der Abminderungsfaktor Φ = 0,85 − 0,0011 · (h_ef/t)² für die Wand m… | korrigiert: Rundung klargestellt (mit 15,71 ergäbe sich 0,579; Frage nennt jetzt 2,75 m/0,175 m, Erklärung 15,714) | - [ ] freigeben |

## Nachhaltigkeit & Dauerhaftigkeit (`rechnung_nachhaltigkeit`)

| ID | Cluster | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_rechnung_nachhaltigkeit_2` | VI | Nach welcher Zeit erreicht die Karbonatisierungsfront bei k = 4,0 mm/√a eine Bet… | ok | - [ ] freigeben |
| `qn_rechnung_nachhaltigkeit_3` | VI | Die Karbonatisierungstiefe beträgt 28,3 mm. Mit c = 300 kg/m³ Zement, 65 % CaO-A… | ok | - [ ] freigeben |
| `qn_rechnung_nachhaltigkeit_4` | VI | Für 200 m³ Beton werden verglichen: Rezeptur A mit 320 kg/m³ CEM I (850 kg CO₂-e… | korrigiert: Prozentwerte mit einer Nachkommastelle wie im Modul (62,5 % statt „rund 62 %“; Distraktoren 166,7/64,7/37,5 %) | - [ ] freigeben |
| `qn_rechnung_nachhaltigkeit_6` | VI | Die Re-Karbonatisierung bindet CO₂ und verbessert rechnerisch die Klimabilanz. W… | ok | - [ ] freigeben |

---

Freigabe aller mit ok bewerteten Fragen: [ ]
