# Quiz: Zweitprüfung Runde 3 (Cluster I–III) – Vorschlagsliste (ohne Freigabe)

Stand: 28.10.2026 · Grundlage: `src/data/quiz.json` auf main (Stand fc525dc5) · Prüfschema wie Zweitprüfung 27.10. (Frage, Optionen, richtige Antwort, Erklärung, Rückmeldungen zu den Distraktoren und normRef gegen Modulinhalt, Rechenkerne, Kennwerte und öffentliche Quellen; Rechenfragen nachgerechnet; Distraktoren, Längen- und Formulierungshinweise, Zahlformat). Tausendertrennung wurde nicht angefasst (separate Umstellung).

**Nachtrag 28.10.2026:** Sammelfreigabe erteilt, siehe Schlusszeile. – **Ursprünglich:** In dieser Runde wurde **nichts freigegeben** (`verified` bleibt `false`, kein `reviewer`/`reviewedAt`). Die Liste ist ein Vorschlag; freigegeben wird erst nach Bestätigung durch Ankreuzen.

## Umfang

- Alle Fragen der Cluster I, II und III (Zuordnung `quizCluster` in `src/data/quizZuordnung.ts`), die nicht freigegeben sind (`verified !== true`) und nicht bereits in `docs/pruefung/quiz-zweitpruefung-runde2.md` stehen.
- **Geprüft gesamt:** 417 Fragen in 107 Modulen (Cluster I: 138, Cluster II: 187, Cluster III: 92).
- Automatische Vorprüfung aller 417 Fragen: kein Längenverhältnis > 1,2, keine Absolutwörter aus der Ratsche (`tests/quiz.test.ts`) in Distraktoren; Dezimalpunkt-Verdachtsfälle sind Formelbezeichner (z. B. f_p0,1k), kein Zahlformatfehler.

## Ergebnis

| ok | korrigiert | Klärung |
|---:|---:|---:|
| 401 | 7 | 9 |

Korrekturen sind in `src/data/quiz.json` eingetragen (`vorpruefung.hinweis` „Zweitprüfung 28.10. (Runde 3): … – korrigiert“). Spalte „Cl.“: Cluster.

## Einheiten (`einheiten`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_einh_1` | I | Eine Stütze mit 30 cm × 30 cm Querschnitt trägt 500 kN. Wie groß ist die Drucksp… | ok | - [ ] freigeben |
| `q_einh_2` | I | Wie viele Newtonmillimeter entsprechen einem Biegemoment von 45 kNm? | ok | - [ ] freigeben |
| `q_einh_3` | I | Eine Nutzlast von 5 kN/m² entspricht welchem Druck? | ok | - [ ] freigeben |
| `q_einh_4` | I | Warum steht in der Einheit der Wärmedehnzahl α_T (1/K) und des U-Werts (W/(m²·K)… | ok | - [ ] freigeben |

## Kennwerte (`materialkennwerte`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_kenn_1` | I | Welche Werte gehören bei einem Beton C30/37 zusammen? | ok | - [ ] freigeben |
| `q_kenn_2` | I | Eine 10 m lange Aluminium-Attikaabdeckung (α_T = 23 · 10⁻⁶ 1/K) erwärmt sich um … | ok | - [ ] freigeben |
| `q_kenn_4` | I | Was beschreibt der Elastizitätsmodul E im Unterschied zur Festigkeit eines Baust… | ok | - [ ] freigeben |
| `q_kenn_5` | I | Wie groß ist die mittlere zentrische Zugfestigkeit f_ctm eines Betons C30/37 nac… | ok | - [ ] freigeben |
| `q_kenn_6` | I | Normalbeton hat λ ≈ 2,0 W/(m·K), Nadelholz λ ≈ 0,13 W/(m·K). Wie viel dicker mus… | ok | - [ ] freigeben |

## Eurocode (`sicherheitskonzept`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ec0_1` | I | Eine Stütze erhält G_k = 800 kN und Q_k = 300 kN (Nutzlast, Leiteinwirkung). Wie… | ok | - [ ] freigeben |
| `q_ec0_3` | I | Welcher Kombinationsbeiwert ψ₀ gilt in Deutschland für Schnee an Orten bis NN + … | ok | - [ ] freigeben |
| `q_ec0_4` | I | Wie groß ist der Bemessungswert der Betondruckfestigkeit f_cd für C30/37 (α_cc =… | ok | - [ ] freigeben |
| `q_ec0_5` | I | Eine Wohnungsdecke trägt g_k = 6,0 kN/m² und q_k = 2,0 kN/m² (Kategorie A, ψ₂ = … | ok | - [ ] freigeben |
| `q_ec0_6` | I | Welcher Nachweis gehört zum Grenzzustand der Gebrauchstauglichkeit (GZG)? | ok | - [ ] freigeben |

## Baustoffkunde (`baustoffkunde`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bk_1` | I | Was trifft auf Joseph Aspdins Patent von 1824 zu? | ok | - [ ] freigeben |
| `q_bk_2` | I | Welche Kombination von Eigenschaften macht Stahl und Beton zu einem funktioniere… | ok | - [ ] freigeben |
| `qn_baustoffkunde_1` | I | Welche Reihenfolge der Entwicklungsschritte ist chronologisch richtig? | ok | - [ ] freigeben |
| `qn_baustoffkunde_2` | I | Auf welcher Betrachtungsebene des Skalen-Prinzips liegen die Haftverbundzone (IT… | ok | - [ ] freigeben |
| `qn_baustoffkunde_3` | I | Für ein mehrgeschossiges Wohngebäude soll ein leichtes Tragwerk mit möglichst ge… | ok | - [ ] freigeben |

## Bauchemie (`bauchemie`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bch_1` | I | Ein Beton hat den Karbonatisierungskoeffizienten K = 4 mm/√a, die Betondeckung b… | ok | - [ ] freigeben |
| `q_bch_2` | I | Wie verflüssigen Polycarboxylatether-Fließmittel (PCE) den Zementleim? | ok | - [ ] freigeben |
| `qn_bauchemie_1` | I | Ein Außenbauteil aus Beton mit w/z = 0,60 hat den Karbonatisierungskoeffizienten… | ok | - [ ] freigeben |

## Regulatives (`regularien`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_recht_2` | I | Wie lange verjähren Mängelansprüche bei Bauwerken, wenn nichts anderes vereinbar… | ok | - [ ] freigeben |
| `q_recht_6` | I | Was gilt für Architekten- und Ingenieurhonorare seit der HOAI 2021? | ok | - [ ] freigeben |

## Baustoffkenngrößen (`baustoffkenngroessen`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_kg_3` | I | Eine Betonwand (μ = 130) ist 20 cm dick. Wie ist sie nach DIN 4108-3 einzustufen… | ok | - [ ] freigeben |
| `q_kg_4` | I | Welche Anforderungen stellt DIN 4108-3 an einen wasserabweisenden Außenputz? | ok | - [ ] freigeben |
| `q_kg_5` | I | Ein Ziegelscherben hat die Rohdichte ρ = 1800 kg/m³ und die Reindichte ρ_R = 265… | ok | - [ ] freigeben |
| `qn_baustoffkenngroessen_1` | I | Normalbeton hat λ = 2,0 W/(m·K), ρ = 2400 kg/m³ und c = 1000 J/(kg·K). Welcher W… | ok | - [ ] freigeben |

## Probenahme & Erkundung (`probenahme`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_prob_1` | I | Nach welchem Regelwerk ist die Probenahme mineralischer Ersatzbaustoffe für die … | ok | - [ ] freigeben |
| `q_prob_2` | I | Welcher Festigkeit entspricht nach DIN EN 13791 das Prüfergebnis eines Bohrkerns… | ok | - [ ] freigeben |
| `q_prob_3` | I | Sie prüfen mit dem Rückprallhammer senkrecht nach unten auf eine Bodenplatte. Wi… | ok | - [ ] freigeben |
| `q_prob_5` | I | Bei Verdacht auf LHKW oder BTEX in einem Haufwerk – wie sind die Einzelproben zu… | ok | - [ ] freigeben |

## Messen & Prüfen (`messen_pruefen`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_mp_1` | I | Ein Kalibrierlabor belastet die Betonpresse mit Referenz-Kraftaufnehmern und dok… | ok | - [ ] freigeben |
| `q_mp_2` | I | Alle Messwerte liegen eng beieinander, aber gemeinsam deutlich neben dem Referen… | ok | - [ ] freigeben |
| `q_mp_3` | I | Eine Digitalanzeige hat die Auflösung d = 0,1 MPa. Welche Standardunsicherheit e… | ok | - [ ] freigeben |
| `q_mp_5` | I | Die Vergleichsstandardabweichung eines Prüfverfahrens beträgt σ_R = 1,5 MPa. Ab … | ok | - [ ] freigeben |
| `qn_messen_pruefen_1` | I | Im Ringversuch erzielt Ihr Labor 51,2 MPa, der zugewiesene Wert beträgt X = 50,0… | ok | - [ ] freigeben |

## Analytik & Diagnostik (`analytik`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_an_3` | I | Welche Aussage zu den Chloridklassen Cl 0,40 und Cl 0,20 nach DIN EN 206 trifft … | ok | - [ ] freigeben |
| `q_an_4` | I | Nach der Washburn-Gleichung wird der Druck in der MIP verzehnfacht. Was gilt für… | ok | - [ ] freigeben |
| `q_an_6` | I | Mit welchem Verfahren lassen sich Chlorid-Tiefenprofile auf der Spaltfläche eine… | ok | - [ ] freigeben |

## Mechanische Prüfungen (`mechanische_pruefungen`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_mech_1` | I | Mit welcher Belastungsgeschwindigkeit werden Betonprobekörper nach DIN EN 12390-… | ok | - [ ] freigeben |
| `q_mech_2` | I | Ein Zylinder (d = 150 mm, L = 300 mm) bricht im Spaltzugversuch bei 200 kN. Wie … | ok | - [ ] freigeben |
| `q_mech_3` | I | Welche Kenngrößen unterscheiden B500A von B500B nach DIN 488-1? | ok | - [ ] freigeben |
| `q_mech_4` | I | Was bedeutet die Gütegruppe „J2“ bei S355J2? | ok | - [ ] freigeben |
| `q_mech_5` | I | Ein Kantholz b = 50 mm, h = 100 mm wird nach DIN EN 408 über L = 18·h = 1800 mm … | ok | - [ ] freigeben |

## Virtuelle Versuche (`labor`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_lab_2` | I | Ein Ausbreitversuch ergibt 520 mm. Welcher Ausbreitmaßklasse entspricht das? | ok | - [ ] freigeben |
| `q_lab_5` | I | Was bedeutet die Sortenbezeichnung 50/70 bei Straßenbaubitumen? | ok | - [ ] freigeben |
| `qn_labor_1` | I | Bei einer Haftzugprüfung mit einem Prüfstempel Ø 50 mm reißt der Stempel bei F_h… | ok | - [ ] freigeben |

## Statistik (`statistik`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_stat_2` | I | Eine Messreihe enthält einen extrem hohen Einzelwert. Welcher Kennwert ändert si… | ok | - [ ] freigeben |
| `q_stat_3` | I | Ein Grubbs-Test markiert einen Festigkeitswert als statistisch auffällig. Wann d… | ok | - [ ] freigeben |
| `qn_statistik_1` | I | Fünf Bohrkerne einer Bestandsdecke ergeben den Mittelwert 42,0 N/mm² und s = 2,5… | ok | - [ ] freigeben |
| `qn_statistik_3` | I | In einem 2²-Versuchsplan (A: w/z 0,40/0,50; B: Zement 300/350 kg/m³) ergeben sic… | ok | - [ ] freigeben |

## Festbeton (Statistik) (`festbeton_statistik`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_fbs_1` | I | Für C25/30 (Würfel: f_ck,cube = 30 N/mm²) liegen bei Erstherstellung drei Ergebn… | ok | - [ ] freigeben |
| `q_fbs_2` | I | Welcher Bemessungswert der Druckfestigkeit ergibt sich für C30/37 nach DIN EN 19… | ok | - [ ] freigeben |
| `qn_festbeton_statistik_2` | I | Für einen neuen C35/45 (f_ck,cube = 45 N/mm²) liegen bei Erstherstellung drei Wü… | ok | - [ ] freigeben |
| `qn_festbeton_statistik_4` | I | Eine Zylinderserie hat f_cm = 45 N/mm² und σ = 4,0 N/mm². Welcher Bemessungswert… | ok | - [ ] freigeben |

## Formänderungen (`formaenderungen`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_form_1` | I | Wie ist Schwinden von Beton in die Systematik der Formänderungen einzuordnen? | ok | - [ ] freigeben |
| `q_form_2` | I | Eine 20 m lange Stahlbetonwand erwärmt sich um 30 K (α_T = 10·10⁻⁶ 1/K). Wie gro… | ok | - [ ] freigeben |
| `q_form_3` | I | Eine Stütze wird mit σ_c = 12 N/mm² belastet (E_c = 34 650 N/mm²). Wie groß ist … | ok | - [ ] freigeben |
| `qn_formaenderungen_1` | I | Ein Betonbauteil zeigt Netzrisse infolge sekundärer Ettringitbildung (Sulfattrei… | ok | - [ ] freigeben |
| `qn_formaenderungen_2` | I | Eine Stütze, die jahrelang unter Dauerlast gekrochen ist, wird vollständig entla… | ok | - [ ] freigeben |
| `qn_formaenderungen_3` | I | Eine Bodenplatte aus Beton (E = 33 000 N/mm², α_T = 10 · 10⁻⁶ 1/K) ist vollständ… | ok | - [ ] freigeben |

## E-Modul & Mikromechanik (`emodul`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_emod_1` | I | Wie ändert sich der rechnerische E-Modul eines Betons, wenn statt quarzitischer … | ok | - [ ] freigeben |
| `q_emod_2` | I | Welche Annahme liegt dem Reuss-Modell (untere Schranke) eines Zweiphasenwerkstof… | ok | - [ ] freigeben |
| `qn_emodul_1` | I | Welcher mittlere E-Modul E_cm ergibt sich nach DIN EN 1992-1-1 für einen C40/50 … | ok | - [ ] freigeben |
| `qn_emodul_2` | I | Ein Beton besteht zu 65 Vol.-% aus Gestein (E_G = 50 GPa) und zu 35 Vol.-% aus Z… | ok | - [ ] freigeben |
| `qn_emodul_3` | I | Warum liegt der gemessene E-Modul eines Normalbetons häufig nahe der unteren Has… | ok | - [ ] freigeben |

## Bruchmechanik (`bruchmechanik`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bruch_1` | I | Wie verändert sich die kritische Bruchspannung eines spröden Bauteils, wenn sich… | ok | - [ ] freigeben |
| `qn_bruchmechanik_1` | I | Ein Zugstab hat einen Riss senkrecht zur Zugrichtung; die Rissufer werden durch … | ok | - [ ] freigeben |
| `qn_bruchmechanik_2` | I | Eine Glasscheibe (K_Ic ≈ 0,75 MPa√m) hat einen Kantenriss a = 1,0 mm (Y = 1,12) … | ok | - [ ] freigeben |

## Knicken (Euler) (`knicken`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_knick_1` | I | Eine beidseitig gelenkig gelagerte Stütze hat die Euler-Knicklast F_K. Wie groß … | ok | - [ ] freigeben |
| `qn_knicken_3` | I | Eine schlanke Stütze aus S235 wird durch eine Stütze aus S355 mit gleichem Profi… | ok | - [ ] freigeben |
| `qn_knicken_4` | I | Eine Kragstütze (Euler-Fall 1) wird am Kopf zusätzlich horizontal unverschieblic… | ok | - [ ] freigeben |

## Bodenmechanik (`bodenmechanik`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_boden_1` | I | Ein Ton hat w = 25 %, w_L = 45 % und w_P = 20 %. Welche Zustandsform liegt vor? | ok | - [ ] freigeben |
| `qn_bodenmechanik_2` | I | In einem kohäsionslosen Sand (c = 0, φ = 30°) wirken die Hauptspannungen σ₁ = 16… | ok | - [ ] freigeben |

## Materialmodelle (`materialmodelle`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_matm_1` | I | Was beschreibt die Relaxation eines Spannstahls? | ok | - [ ] freigeben |
| `q_matm_2` | I | Frischbeton (τ₀ = 500 Pa, μ_p = 50 Pa·s) wird mit 800 Pa geschert. Welche Scherr… | ok | - [ ] freigeben |
| `qn_materialmodelle_2` | I | Ein Maxwell-Körper wird schlagartig auf eine konstante Dehnung gebracht, die Anf… | ok | - [ ] freigeben |
| `qn_materialmodelle_3` | I | Ein Kelvin-Voigt-Körper (E = 1000 MPa, Retardationszeit τ = 10 d) wird mit der k… | ok | - [ ] freigeben |
| `qn_materialmodelle_4` | I | Das Langzeitverhalten von Beton unter Dauerlast soll mit elastischer Sofortverfo… | ok | - [ ] freigeben |

## Mechan. Kenngrößen (`mechanische_kenngroessen`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_mk_1` | I | Ein Rundstab S235 (d = 30 mm, L = 4 m, E = 210 000 MPa) wird mit 120 kN gezogen.… | ok | - [ ] freigeben |
| `q_mk_2` | I | Eine Betonstütze staucht sich unter Dauerlast sofort um 0,80 mm. Wie groß ist di… | ok | - [ ] freigeben |
| `qn_mechanische_kenngroessen_2` | I | Die Höhe eines Rechteckquerschnitts wird bei gleicher Breite verdoppelt. Wie änd… | ok | - [ ] freigeben |
| `qn_mechanische_kenngroessen_4` | I | Ein Vollholzbalken hat die Anfangsdurchbiegung u_inst = 10 mm. Wie groß ist die … | ok | - [ ] freigeben |

## Bauphysik (Wärme & Akustik) (`bauphysik`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bauphysik_6` | I | Welche Eigenschaft vergrößert bei gleichem U-Wert die Phasenverschiebung einer A… | ok | - [ ] freigeben |
| `q_bp_2` | I | Ein Klassenraum (V = 189 m³) hat eine äquivalente Absorptionsfläche von A = 64,7… | ok | - [ ] freigeben |

## Thermische Eigenschaften & Dämmstoffe (`waermeeigenschaften`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_we_3` | I | Bestandswand 24 cm mit λ = 1,0 W/(m·K), R_si + R_se = 0,17 m²K/W, Ziel U ≤ 0,24 … | ok | - [ ] freigeben |
| `q_we_4` | I | Beton: λ = 2,0 W/(m·K), ρ = 2 400 kg/m³, c = 1 000 J/(kg·K). Wie groß ist die Te… | korrigiert: Distraktor „1,2 · 10⁻³ m²/s“ passte nicht zur Rückmeldung (λ/ρ ohne c = 8,3 · 10⁻⁴); Option auf 8,3 · 10⁻⁴ m²/s gesetzt | - [ ] freigeben |
| `q_we_5` | I | Holzfaser und EPS haben etwa gleiche Wärmeleitfähigkeit. Warum gilt Holzfaser im… | ok | - [ ] freigeben |
| `q_we_6` | I | Unter einer Bodenplatte im Grundwasserbereich soll lastabtragend gedämmt werden.… | ok | - [ ] freigeben |

## Feuchteschutz & Tauwasser (`feuchteschutz`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_fs_1` | I | Raumklima 20 °C / 50 % r. F.: Ab welcher Oberflächentemperatur droht nach dem 80… | ok | - [ ] freigeben |
| `q_fs_2` | I | Welche wasserdampfdiffusionsäquivalente Luftschichtdicke hat eine 16 cm dicke EP… | ok | - [ ] freigeben |
| `qn_bauphysik_3` | I | Raumluft 20 °C / 50 % r. F. (p ≈ 1169 Pa) diffundiert in ein Bauteil. An einer i… | ok | - [ ] freigeben |
| `qn_feuchteschutz_4` | I | Für eine Holzrahmenwand mit Mineralwolle werden zwei Varianten diskutiert: (1) i… | ok | - [ ] freigeben |

## Innendämmung vs. Außendämmung (`daemmung_vergleich`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_dv_1` | I | Bei gleicher Dämmdicke: Wo liegt die Grenzschicht Dämmung/Mauerwerk bei Innendäm… | ok | - [ ] freigeben |
| `qn_daemmung_vergleich_2` | I | Ein Gründerzeithaus mit Holzbalkendecken erhält eine Innendämmung. Warum sind di… | ok | - [ ] freigeben |
| `qn_daemmung_vergleich_4` | I | Ein selten genutzter Raum (z. B. Gästezimmer) wird nur gelegentlich beheizt. Wie… | ok | - [ ] freigeben |

## Schallschutz (`schallschutz`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ss_1` | I | Eine Wand hat m′ = 380 kg/m². Welches Schalldämm-Maß ergibt die Massekurve R_w =… | ok | - [ ] freigeben |
| `q_ss_2` | I | Welche Mindestanforderung stellt DIN 4109-1 an Wohnungstrennwände? | ok | - [ ] freigeben |
| `qn_schallschutz_1` | I | Eine Stahlbetonwand (18 cm, ρ = 2400 kg/m³) ist beidseitig mit 1 cm Gipsputz (ρ … | ok | - [ ] freigeben |
| `qn_schallschutz_2` | I | Für eine leichte Ständerwand mit Gipskartonbeplankung ergibt sich m′ ≈ 25 kg/m².… | ok | - [ ] freigeben |
| `qn_schallschutz_3` | I | Um wie viel verbessert sich das Schalldämm-Maß einer einschaligen Massivwand nac… | ok | - [ ] freigeben |
| `qn_schallschutz_4` | I | Verglichen werden zwei unverputzte Wände: Kalksandstein 11,5 cm (ρ = 2000 kg/m³)… | ok | - [ ] freigeben |

## Brandschutz (`brandschutz`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bs_2` | I | Ein BSH-Balken (β_n = 0,7 mm/min) wird 60 min dreiseitig beflammt. Wie groß ist … | ok | - [ ] freigeben |
| `q_bs_3` | I | Was bedeuten die Zusatzangaben in der Klassifizierung B-s1,d0 nach DIN EN 13501-… | ok | - [ ] freigeben |
| `q_bs_4` | I | Welche bauaufsichtliche Anforderung erfüllt ein Baustoff der Klasse A2-s1,d0? | ok | - [ ] freigeben |
| `q_bs_5` | I | Welche Feuerwiderstandsdauer entspricht der bauaufsichtlichen Anforderung „hochf… | ok | - [ ] freigeben |
| `q_bs_6` | I | Eine nichttragende, raumabschließende Trennwand muss feuerhemmend sein. Welche K… | ok | - [ ] freigeben |

## Energieausweis (`energieausweis`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_energieausweis_4` | I | Ein unsanierter Altbau hat laut Bedarfsausweis 260 kWh/(m²a), die Heizkostenabre… | ok | - [ ] freigeben |

## Festigkeitsberechnungen (`festigkeit`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_festigkeit_1` | I | Wie hoch könnte ein prismatischer Turm aus Mauerwerk (f_c = 12 N/mm², ρ = 1800 k… | ok | - [ ] freigeben |
| `qn_festigkeit_2` | I | Welche Reißlänge hat ein frei hängender Stab aus Nadelholz C24 (f_t = 14 N/mm², … | korrigiert (Abgleich 28.10.): C24-Kennwerte an DIN EN 338:2016-07 bzw. src/data/kennwerte.ts angeglichen (f_t,0,k 14,5 statt 14 N/mm², ρ_mean 420 statt 450 kg/m³), neu gerechnet: 3,5 km; Distraktoren 35 km/5,1 km/350 m | - [ ] freigeben |
| `qn_festigkeit_3` | I | Betonwürfel C20/25 (f_c = 20 N/mm², ρ = 2400 kg/m³) mit a = 10 cm werden gestape… | ok | - [ ] freigeben |
| `qn_festigkeit_4` | I | Im Würfelstapel aus C20/25 (a = 100 mm, E = 30 000 N/mm²) erreicht die Spannung … | ok | - [ ] freigeben |
| `qn_festigkeit_5` | I | Aluminium (f_t = 200 N/mm², ρ = 2700 kg/m³) hat eine geringere Zugfestigkeit als… | ok | - [ ] freigeben |

## Stahlbau EC 3 (`stahlbau_ec3`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_stahlbau_ec3_1` | I | Welcher Teilsicherheitsbeiwert γ_M1 gilt nach dem deutschen Nationalen Anhang zu… | ok | - [ ] freigeben |
| `qn_stahlbau_ec3_2` | I | Was kennzeichnet einen Querschnitt der Klasse 3 nach DIN EN 1993-1-1? | ok | - [ ] freigeben |
| `qn_stahlbau_ec3_3` | I | Ein Flachstahl 100 × 10 mm aus S235 (f_u = 360 N/mm²) hat ein Schraubenloch d₀ =… | ok | - [ ] freigeben |
| `qn_stahlbau_ec3_4` | I | Eine Stütze HEB 200 aus S235 (i_z = 5,07 cm, i_y = 8,54 cm) hat L_cr = 4,0 m um … | ok | - [ ] freigeben |
| `qn_stahlbau_ec3_5` | I | Welche Knicklinie gilt nach DIN EN 1993-1-1 (Zuordnungstabelle der Knicklinien) … | ok | - [ ] freigeben |
| `qn_stahlbau_ec3_6` | I | Der Steg eines IPE 300 hat c/t = 35,0. Unter reinem Druck ist er in S235 Klasse … | ok | - [ ] freigeben |
| `qn_stahlbau_ec3_7` | I | Bei einer HEB 200 aus S235 wird L_cr von 3 m auf 6 m verdoppelt (Ausweichen um z… | ok | - [ ] freigeben |

## Sommerlicher Wärmeschutz (`sommerlicher_waermeschutz`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_sommerlicher_waermeschutz_1` | I | Welche Größe vergleicht das vereinfachte Nachweisverfahren nach DIN 4108-2:2013-… | Klärung: Werte nach DIN 4108-2:2013-02; Neuausgabe DIN 4108-2:2026-05 erschienen (Gliederung: Abschnitt 8 sommerlicher Wärmeschutz mit Sonneneintragskennwerten), Zahlenwerte öffentlich nicht prüfbar – Einzelfreigabe nach Abgleich mit dem Normtext | - [ ] freigeben |
| `qn_sommerlicher_waermeschutz_2` | I | Ein Raum hat A_G = 20 m² und ein Südfenster mit 5 m², g = 0,60 und außenliegende… | Klärung: Werte nach DIN 4108-2:2013-02; Neuausgabe DIN 4108-2:2026-05 erschienen (Gliederung: Abschnitt 8 sommerlicher Wärmeschutz mit Sonneneintragskennwerten), Zahlenwerte öffentlich nicht prüfbar – Einzelfreigabe nach Abgleich mit dem Normtext | - [ ] freigeben |
| `qn_sommerlicher_waermeschutz_3` | I | Warum erhöht eine erhöhte Nachtlüftung den zulässigen Sonneneintragskennwert S_z… | Klärung: Werte nach DIN 4108-2:2013-02; Neuausgabe DIN 4108-2:2026-05 erschienen (Gliederung: Abschnitt 8 sommerlicher Wärmeschutz mit Sonneneintragskennwerten), Zahlenwerte öffentlich nicht prüfbar – Einzelfreigabe nach Abgleich mit dem Normtext | - [ ] freigeben |
| `qn_sommerlicher_waermeschutz_4` | I | Für einen Raum ergibt sich eine wirksame Wärmespeicherfähigkeit C_wirk/A_G = 140… | Klärung: Werte nach DIN 4108-2:2013-02; Neuausgabe DIN 4108-2:2026-05 erschienen (Gliederung: Abschnitt 8 sommerlicher Wärmeschutz mit Sonneneintragskennwerten), Zahlenwerte öffentlich nicht prüfbar – Einzelfreigabe nach Abgleich mit dem Normtext | - [ ] freigeben |
| `qn_sommerlicher_waermeschutz_5` | I | Welcher Bezugswert der Innentemperatur ist nach DIN 4108-2:2013-02 der Sommerkli… | Klärung: Werte nach DIN 4108-2:2013-02; Neuausgabe DIN 4108-2:2026-05 erschienen (Gliederung: Abschnitt 8 sommerlicher Wärmeschutz mit Sonneneintragskennwerten), Zahlenwerte öffentlich nicht prüfbar – Einzelfreigabe nach Abgleich mit dem Normtext | - [ ] freigeben |
| `qn_sommerlicher_waermeschutz_6` | I | Ein Wohnraum hat einen Fensterflächenanteil f_WG von 30 %; seine Süd- und Westfe… | Klärung: Werte nach DIN 4108-2:2013-02; Neuausgabe DIN 4108-2:2026-05 erschienen (Gliederung: Abschnitt 8 sommerlicher Wärmeschutz mit Sonneneintragskennwerten), Zahlenwerte öffentlich nicht prüfbar – Einzelfreigabe nach Abgleich mit dem Normtext | - [ ] freigeben |
| `qn_sommerlicher_waermeschutz_7` | I | Warum ist ein außenliegender Sonnenschutz wirksamer als ein innenliegender? | Klärung: Werte nach DIN 4108-2:2013-02; Neuausgabe DIN 4108-2:2026-05 erschienen (Gliederung: Abschnitt 8 sommerlicher Wärmeschutz mit Sonneneintragskennwerten), Zahlenwerte öffentlich nicht prüfbar – Einzelfreigabe nach Abgleich mit dem Normtext | - [ ] freigeben |

## Potentialmessung (`labor_potentialmessung`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_labor_potentialmessung_4` | I | Woran erkennen Sie im Versuch die Depassivierung des Stahls am deutlichsten? | ok | - [ ] freigeben |
| `qn_labor_potentialmessung_5` | I | Warum sind die Potentialbereiche der ASTM C876 (−200 mV / −350 mV gegen CSE) im … | ok | - [ ] freigeben |
| `qn_labor_potentialmessung_6` | I | Wozu dient die gesättigte Ca(OH)₂-Lösung im Versuch? | ok | - [ ] freigeben |

## Frischbetonprüfungen (`labor_frischbeton`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_labor_frischbeton_5` | I | Wie oft wird die Tischplatte beim Ausbreitversuch nach DIN EN 12350-5 angehoben … | ok | - [ ] freigeben |

## Mörtelprismen (`labor_moertelprismen`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_labor_moertelprismen_2` | I | Eine Prismenhälfte bricht unter der Druckplatte 40 mm × 40 mm bei 72 kN. Wie gro… | ok | - [ ] freigeben |
| `qn_labor_moertelprismen_3` | I | Von sechs Druckwerten weicht einer um 14 % vom Mittel ab. Wie wird nach DIN EN 1… | ok | - [ ] freigeben |
| `qn_labor_moertelprismen_4` | I | Wie ist der Normmörtel nach DIN EN 196-1 zusammengesetzt? | ok | - [ ] freigeben |
| `qn_labor_moertelprismen_5` | I | Nach 28 Tagen ergibt die Prüfung R_c = 47,8 MPa. Welche Festigkeitsklasse nach D… | ok | - [ ] freigeben |
| `qn_labor_moertelprismen_6` | I | Warum werden die Prismen erst unmittelbar vor der Prüfung aus dem Wasserbad geno… | ok | - [ ] freigeben |

## Neue Normengeneration (`normen_ausblick`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_normen_ausblick_5` | I | Unter welcher Bedingung darf nach der Fachliteratur die Schnellkarbonatisierung … | ok | - [ ] freigeben |

## CE vs. Ü & MVV TB (`bp_recht_grundlagen`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bpr_2` | II | Ein neuartiger Pflanzenkohle-Beton soll in einem einzelnen Bauvorhaben eingesetz… | ok | - [ ] freigeben |
| `q_bpr_3` | II | Was gilt seit dem 8. Januar 2026 im europäischen Bauproduktenrecht? | ok | - [ ] freigeben |
| `q_bpr_4` | II | Welches dieser Bauprodukte trägt in Deutschland kein CE-Zeichen, sondern wird na… | ok | - [ ] freigeben |
| `q_bpr_5` | II | Ein CE-gekennzeichneter Dämmstoff soll eingebaut werden. Wer weist seit der Umst… | ok | - [ ] freigeben |
| `q_bre_2` | II | In welchem AVCP-System ist die notifizierte Stelle am stärksten beteiligt (inkl.… | ok | - [ ] freigeben |
| `q_bre_4` | II | In welchem AVCP-System ist keine notifizierte Stelle beteiligt? | korrigiert (Abgleich 28.10.): Rechtsgrundlage auf BauPVO (EU) 2024/3110, Anhang IX umgestellt (gilt seit 08.01.2026); Antwort unverändert | - [ ] freigeben |
| `q_bre_5` | II | Welche Stelle akkreditiert in Deutschland Prüflabore und Zertifizierungsstellen? | ok | - [ ] freigeben |
| `q_bre_6` | II | Wer prüft eine Umweltproduktdeklaration (EPD) nach DIN EN 15804 vor der Veröffen… | ok | - [ ] freigeben |

## Gesteine (`gesteine`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ges_1` | II | Zu welcher Gruppe gehört Marmor? | ok | - [ ] freigeben |
| `q_ges_2` | II | Was bedeutet ein niedriger Los-Angeles-Koeffizient? | ok | - [ ] freigeben |
| `q_ges_3` | II | Welcher Sieblinienbereich gilt für Beton als günstig? | ok | - [ ] freigeben |
| `qn_gesteine_2` | II | Für eine frei bewitterte, mit Tausalz beaufschlagte Außentreppe soll ein Naturst… | ok | - [ ] freigeben |

## Mauerwerk (`mauerwerk`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_mwk_2` | II | Wie wird f_d nach deutschem NA aus f_k ermittelt? | ok | - [ ] freigeben |
| `q_mwk_3` | II | Welches Mindest-Überbindemaß gilt nach NA DE für Steine der Höhe h_u = 249 mm? | ok | - [ ] freigeben |
| `q_mwk_4` | II | Welche Maße hat ein Normalformat (NF)? | ok | - [ ] freigeben |

## Putze & Mörtel (`putzemoertel`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_pum_1` | II | Welcher Mörtelklasse nach DIN EN 998-2 entspricht die frühere Mörtelgruppe MG II… | ok | - [ ] freigeben |
| `q_pum_3` | II | Welche Regel gilt für die Festigkeit mehrlagiger Putze? | ok | - [ ] freigeben |
| `q_pum_4` | II | Welche Bedingung muss ein wasserabweisender Putz u. a. erfüllen? | ok | - [ ] freigeben |
| `qn_putzemoertel_1` | II | Eine Fassade von 80 m² soll 20 mm dick mit Kalk-Zement-Leichtputz (Verbrauch 1,2… | ok | - [ ] freigeben |
| `qn_putzemoertel_2` | II | Eine feuchte, stark salzbelastete Kellerwand im Altbau soll verputzt werden, ohn… | ok | - [ ] freigeben |

## Gips (`gips`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_gip_2` | II | Warum verbessert Gips den Brandschutz? | ok | - [ ] freigeben |
| `q_gip_3` | II | Warum darf Gips nicht in dauerfeuchtem Kontakt mit Zementstein stehen? | ok | - [ ] freigeben |
| `qn_gips_1` | II | Es werden 20 kg Stuckgips (Halbhydrat) mit W/G = 0,80 angemacht. Wie viel Übersc… | ok | - [ ] freigeben |
| `qn_gips_2` | II | Zwei Gipsprobekörper werden aus demselben Stuckgips hergestellt, einer mit W/G =… | ok | - [ ] freigeben |
| `qn_gips_3` | II | Für welchen Einsatz sind Gipsbaustoffe nach den Angaben des Moduls geeignet? | ok | - [ ] freigeben |

## Kalk (`kalk`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_kal_1` | II | Wie erhärtet Luftkalk? | ok | - [ ] freigeben |
| `q_kal_2` | II | Welches Kurzzeichen steht für natürlichen hydraulischen Kalk? | ok | - [ ] freigeben |
| `qn_kalk_1` | II | Wie viel CO₂ wird beim vollständigen Brennen von 1000 kg reinem Kalkstein (CaCO₃… | ok | - [ ] freigeben |
| `qn_kalk_2` | II | Worin unterscheidet sich die Erhärtung von hydraulischem Kalk (HL/NHL) von der e… | ok | - [ ] freigeben |

## Lehm (`lehm`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_leh_1` | II | Was bindet Lehm? | ok | - [ ] freigeben |
| `q_leh_2` | II | Welche Norm regelt die Bemessung von tragendem Lehmsteinmauerwerk? | ok | - [ ] freigeben |
| `q_leh_3` | II | Welche Eigenschaft macht Lehmputz für das Raumklima besonders interessant? | ok | - [ ] freigeben |
| `qn_lehm_1` | II | Ein Lehmputz (A = 60 m², d = 15 mm, ρ_d = 1600 kg/m³) wird mit u₀ = 20 M.-% aufg… | ok | - [ ] freigeben |
| `qn_lehm_2` | II | Im Rechenmodell des Moduls wird bei sonst gleicher Mischung der Tonanteil erhöht… | ok | - [ ] freigeben |

## Erdbau & Böden (`erdbau`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_erd_1` | II | Wofür steht die Bodengruppe GW nach DIN 18196? | ok | - [ ] freigeben |
| `q_erd_2` | II | Was beschreibt der Verdichtungsgrad D_Pr? | ok | - [ ] freigeben |
| `qn_erdbau_2` | II | Eine Wohnstraße (Bk1,0) liegt auf F3-Boden in Frosteinwirkungszone III bei ungün… | ok | - [ ] freigeben |

## Glas (`glas`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_gla_1` | II | Welche charakteristische Biegezugfestigkeit hat ESG? | ok | - [ ] freigeben |
| `q_gla_3` | II | Was verursacht Klimalasten bei Mehrscheiben-Isolierglas? | ok | - [ ] freigeben |
| `qn_glas_1` | II | In einer teilbeschatteten Floatglasscheibe (E = 70 000 N/mm², α_T = 9 · 10⁻⁶ 1/K… | ok | - [ ] freigeben |
| `qn_glas_2` | II | VSG aus 2 × 8 mm mit PVB wird bei 40 °C durch Eigengewicht (Langzeitlast) beansp… | ok | - [ ] freigeben |
| `qn_glas_3` | II | Eine Glasscheibe wird bei gleicher Spannung σ durch eine doppelt so große Scheib… | ok | - [ ] freigeben |

## Stahl (`stahl`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_sta_1` | II | Wofür steht die Zahl in S355? | ok | - [ ] freigeben |
| `q_sta_2` | II | Wie groß ist der Abminderungsfaktor k_y,θ für die Streckgrenze bei 600 °C? | ok | - [ ] freigeben |
| `q_sta_3` | II | Was unterscheidet B500B von B500A? | ok | - [ ] freigeben |
| `q_sta_4` | II | Was beschreibt der PREN-Wert? | ok | - [ ] freigeben |
| `qn_stahl_1` | II | Ein HEB 200 aus S235 (W_pl,y = 642,5 cm³, γ_M0 = 1,0) wird mit M_Ed = 130 kNm be… | ok | - [ ] freigeben |

## Metalle (`metalle`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_met_1` | II | Welches Metall korrodiert bei Kontakt von Aluminium und Edelstahl im Elektrolyte… | ok | - [ ] freigeben |
| `q_met_2` | II | Warum darf Kupfer nicht oberhalb von Zink verbaut werden (in Fließrichtung des W… | ok | - [ ] freigeben |
| `qn_metalle_3` | II | Für eine küstennahe Fassadenbefestigung (mäßig chloridbelastete Außenatmosphäre)… | ok | - [ ] freigeben |

## Dämmstoffe (`daemmstoffe`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_dms_1` | II | Welcher Dämmstoff hat die geringste Wärmeleitfähigkeit? | ok | - [ ] freigeben |
| `q_dms_4` | II | Eine Dämmschicht aus Mineralwolle (λ = 0,035 W/(m·K)) soll einen Wärmedurchlassw… | ok | - [ ] freigeben |
| `q_dms_5` | II | Welche Eigenschaftskombination kennzeichnet Schaumglas als Dämmstoff? | ok | - [ ] freigeben |
| `q_dms_6` | II | Was ist beim Einbau von Vakuumisolationspaneelen (VIP) auf der Baustelle besonde… | ok | - [ ] freigeben |

## Holz (`holz`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_hol_3` | II | Wie groß ist f_m,d für C24 in NKL 1 bei mittlerer Lasteinwirkungsdauer (k_mod = … | ok | - [ ] freigeben |
| `q_hol_4` | II | Welcher Verformungsbeiwert k_def gilt für Vollholz in Nutzungsklasse 3? | ok | - [ ] freigeben |
| `qn_holz_2` | II | C24 (f_c,0,k = 21 N/mm², f_c,90,k = 2,5 N/mm²), NKL 1, KLED mittel (k_mod = 0,8;… | ok | - [ ] freigeben |

## Asphalt & Bitumen (`asphalt`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_asp_1` | II | Rohdichte ρ_m = 2,457 g/cm³, Raumdichte ρ_b = 2,383 g/cm³. Wie groß ist der Hohl… | ok | - [ ] freigeben |
| `q_asp_3` | II | Welcher Arbeitsplatzgrenzwert gilt nach TRGS 900 für Dämpfe und Aerosole aus Bit… | ok | - [ ] freigeben |
| `qn_asphalt_1` | II | Ein Asphaltmischgut enthält B = 6,0 M.-% Bitumen (ρ_B = 1,02 g/cm³) und Gestein … | korrigiert (Abgleich 28.10.): normRef um DIN EN 12697-6 (Raumdichte) ergänzt | - [ ] freigeben |
| `qn_asphalt_2` | II | Im Lehrmodell steigt die Marshall-Stabilität bis zu einem Bitumengehalt von etwa… | ok | - [ ] freigeben |
| `qn_asphalt_3` | II | Welches technische Risiko ist bei Niedrigtemperaturasphalt (NTA) aus der geringe… | ok | - [ ] freigeben |

## Kunststoffe (`kunststoffe`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_kun_2` | II | Eine 10 m lange PVC-U-Leitung (α ≈ 80 · 10⁻⁶ 1/K) erwärmt sich um 40 K. Wie groß… | ok | - [ ] freigeben |
| `qn_kunststoffe_1` | II | Ein Dehnungsausgleicher kann 15 mm aufnehmen. Wie lang darf ein PVC-U-Leitungsab… | ok | - [ ] freigeben |
| `qn_kunststoffe_2` | II | Warum bleibt ein teilkristalliner Thermoplast (z. B. PE) oberhalb seiner Glasübe… | ok | - [ ] freigeben |

## Materialität (Architektur) (`materialitaet_architektur`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_mat_1` | II | Welche Stoffgröße bestimmt, ob sich eine Oberfläche bei Berührung warm oder kalt… | ok | - [ ] freigeben |
| `q_mat_3` | II | Bei welcher Lichtsituation treten Oberflächenreliefs wie Schalungsabdrücke oder … | ok | - [ ] freigeben |
| `q_mat_4` | II | Warum vergraut unbehandeltes Holz an einer bewitterten Fassade? | ok | - [ ] freigeben |
| `q_mat_6` | II | Für einen Handlauf im Innenraum wird ein Werkstoff gesucht, der sich bei Berühru… | ok | - [ ] freigeben |

## Werkstoff-Kombinationen (`kombinationen`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_komb_sandwich_1` | II | Warum besitzt eine Sandwichplatte bei geringem Gewicht eine hohe Biegesteifigkei… | ok | - [ ] freigeben |
| `q_fvb_1` | II | CFK mit E_f = 230 GPa, E_m = 3,2 GPa, v_f = 0,6. Wie groß ist E in Faserrichtung… | ok | - [ ] freigeben |
| `q_kmb_1` | II | Warum ist der E-Modul eines unidirektionalen FKV quer zur Faser viel kleiner als… | ok | - [ ] freigeben |
| `q_kmb_2` | II | Welche Maßnahme macht Porenwände wasserabweisend, ohne die Poren zu verschließen… | ok | - [ ] freigeben |

## Baustoffindustrie (`bp_baustoffindustrie`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bpi_2` | II | Preis 30 €/t, Produktion 12 €/t, Laden 3 €/t, Fahrt 0,30 €/(t·km). Wie groß ist … | ok | - [ ] freigeben |
| `q_bpi_3` | II | Preis frei Baustelle 24 €/t, Gewinnung 10 €/t, Laden 2 €/t, Fahrt 0,20 €/(t·km).… | ok | - [ ] freigeben |
| `q_bpi_4` | II | Welcher Betrieb der Baustoffindustrie unterliegt dem EU-Emissionshandel (EU-ETS)… | ok | - [ ] freigeben |
| `q_bpi_5` | II | Warum gibt es deutlich weniger, dafür größere Zementwerke als Kieswerke? | ok | - [ ] freigeben |
| `q_bpi_6` | II | Wo lassen sich Ausgaben und Positionspapiere von Branchenverbänden wie dem bbs ö… | ok | - [ ] freigeben |

## Innovationen & F&E (`bp_innovationen`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bin_3` | II | Nach wie vielen Jahren verjähren Mängelansprüche bei Bauwerken nach BGB regulär? | ok | - [ ] freigeben |
| `qn_bp_innovationen_1` | II | Eine Zugkraft F_Ed = 150 kN soll aufgenommen werden: Betonstahl B500B mit f_yd =… | ok | - [ ] freigeben |

## Dach & Fassade (`bp_dach_fassade`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bdf_1` | II | A_g = 1,30 m², U_g = 0,6; A_f = 0,52 m², U_f = 1,2; l_g = 4,6 m, Ψ_g = 0,04. Wie… | ok | - [ ] freigeben |
| `q_bdf_2` | II | Welche Mindestbreite muss der Hinterlüftungsspalt einer vorgehängten hinterlüfte… | ok | - [ ] freigeben |
| `qn_bp_dach_fassade_2` | II | Welche Aufgabe hat der Lüftungsspalt einer vorgehängten hinterlüfteten Fassade (… | ok | - [ ] freigeben |
| `qn_bp_dach_fassade_3` | II | Ein Fenster hat A_g = 1,20 m² (U_g = 0,5), A_f = 0,60 m² (U_f = 1,0), l_g = 4,4 … | ok | - [ ] freigeben |
| `qn_bp_dach_fassade_4` | II | Im Fensterrechner (A_w = 1,82 m², l_g = 4,62 m) wird der Aluminium-Abstandhalter… | ok | - [ ] freigeben |

## Trockenbau (`bp_trockenbau`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_btb_1` | II | Welche Oberflächengüte gilt bei Gipsplatten, wenn nichts vereinbart ist? | ok | - [ ] freigeben |
| `q_btb_2` | II | Wie ändert sich die Resonanzfrequenz f₀ einer Ständerwand, wenn die Masse beider… | ok | - [ ] freigeben |
| `qn_bp_trockenbau_1` | II | Woran erkennt man nach dem Modul eine imprägnierte Feuchtraumplatte (GKBI)? | ok | - [ ] freigeben |
| `qn_bp_trockenbau_2` | II | Eine Metallständerwand mit 30 m² Fläche wird beidseitig doppelt beplankt. Welche… | ok | - [ ] freigeben |
| `qn_bp_trockenbau_3` | II | Warum erreicht eine Doppelständerwand (CW 50+50, ca. 62 dB) einen deutlich besse… | ok | - [ ] freigeben |

## Putz & Estrich (`bp_putz_estrich`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bpe_1` | II | Wie viel Wasser bindet 1 kg Halbhydrat chemisch beim Abbinden zu Dihydrat? | ok | - [ ] freigeben |
| `qn_bp_putz_estrich_2` | II | Welche Grenze des Sanierputzes nennt das Modul? | ok | - [ ] freigeben |
| `qn_bp_putz_estrich_3` | II | Warum ist Calciumsulfat-Fließestrich für Balkone und Nassbereiche ungeeignet, Ze… | ok | - [ ] freigeben |
| `qn_bp_putz_estrich_4` | II | Ein Hotelbad soll kurzfristig saniert und sofort belegt werden; Baufeuchte ist u… | ok | - [ ] freigeben |

## Abdichtungen (`bp_abdichtung`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bab_3` | II | Welches Füllmaterial eignet sich zum kraftschlüssigen Schließen trockener, nicht… | ok | - [ ] freigeben |
| `qn_bp_abdichtung_2` | II | Für eine Dehnungsfuge in einer Weißen Wanne ist eine Fugenabdichtung zu wählen. … | ok | - [ ] freigeben |
| `qn_bp_abdichtung_3` | II | Ein wasserführender Riss in einer Kellerwand bewegt sich jahreszeitlich. Welcher… | ok | - [ ] freigeben |

## Dämmstoffe (`bp_daemmung`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bpd_2` | II | Welches Kurzzeichen nach DIN 4108-10 kennzeichnet eine Außendämmung der Wand unt… | ok | - [ ] freigeben |
| `qn_bp_daemmung_1` | II | Eine verputzte Kalksandsteinwand hat ohne Dämmung R_si + Σ d/λ + R_se = 0,39 m²K… | ok | - [ ] freigeben |
| `qn_bp_daemmung_2` | II | Ein denkmalgeschützter Altbau soll innen gedämmt werden, und zwar ohne Dampfbrem… | ok | - [ ] freigeben |

## Befestigungstechnik (`bp_befestigung`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bbf_1` | II | Um welchen Faktor steigt der Betonausbruchwiderstand N⁰Rk,c, wenn die Verankerun… | ok | - [ ] freigeben |
| `qn_bp_befestigung_1` | II | Nach welchem Wirkprinzip trägt ein Hinterschnittanker die Last in den Beton ab? | ok | - [ ] freigeben |
| `qn_bp_befestigung_2` | II | Welche Versagensart einer Verankerung tritt nach dem Modul besonders bei geringe… | ok | - [ ] freigeben |
| `qn_bp_befestigung_3` | II | Einzeldübel im gerissenen Beton C30/37 (f_ck = 30 N/mm²), h_ef = 100 mm. Wie gro… | ok | - [ ] freigeben |
| `qn_bp_befestigung_4` | II | Ein Geländer soll randnah in gerissenem Beton befestigt werden; große Spreizkräf… | ok | - [ ] freigeben |

## Farben & Lacke (`bp_farben_lacke`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bfl_1` | II | Eine Farbe hat 40 % Volumenfestkörper. Welche Nassschichtdicke ergibt 80 µm Troc… | ok | - [ ] freigeben |
| `q_bfl_3` | II | Welches Oberflächenschutzsystem eignet sich für ein frei bewittertes Parkdeck mi… | ok | - [ ] freigeben |
| `qn_bp_farben_lacke_1` | II | 150 m² erhalten 2 Anstriche mit je 60 µm Trockenschicht; Volumenfestkörper 50 %,… | ok | - [ ] freigeben |
| `qn_bp_farben_lacke_3` | II | Warum ist eine reine Silikatfarbe auf Gipsputz ungeeignet, während eine Dispersi… | ok | - [ ] freigeben |

## Betonzusatzmittel (`bp_betonzusatzmittel`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bzm_1` | II | Ab welcher Gesamtmenge flüssiger Zusatzmittel ist deren Wasseranteil auf den w/z… | ok | - [ ] freigeben |
| `qn_bp_betonzusatzmittel_1` | II | Welches Kurzzeichen steht nach DIN EN 934-2 für ein Zusatzmittel, das das Erstar… | ok | - [ ] freigeben |
| `qn_bp_betonzusatzmittel_3` | II | Ein Zusatzmittel enthält 0,15 M.-% Chlorid. Darf es nach dem Modul für Spannbeto… | ok | - [ ] freigeben |

## Mineralische Werkstoffe (`bp_mineralisch`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bpm_1` | II | Was kennzeichnet Verbundsicherheitsglas (VSG)? | ok | - [ ] freigeben |
| `q_bpm_2` | II | Warum ist Feinsteinzeug frostbeständig, Steingut dagegen nicht? | ok | - [ ] freigeben |
| `qn_bp_mineralisch_2` | II | Wie sind Feinsteinzeug, Steinzeug und Steingut nach ihrer Wasseraufnahme laut Mo… | ok | - [ ] freigeben |
| `qn_bp_mineralisch_4` | II | Für einen Eingangsbereich im Freien mit Tausalzeinwirkung wird zwischen Granit u… | ok | - [ ] freigeben |

## Gläser & Fenster (`bp_glaeser`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bpg_1` | II | Welche Glasart hat bei gleicher Dicke die höchste Bemessungsfestigkeit? | ok | - [ ] freigeben |
| `qn_bp_glaeser_1` | II | Fenster: A_g = 1,27 m², U_g = 1,1; A_f = 0,55 m², U_f = 1,2; l_g = 4,54 m mit Al… | ok | - [ ] freigeben |
| `qn_bp_glaeser_2` | II | Für eine Überkopfverglasung ist die untere Scheibe zu wählen. Welche Wahl entspr… | ok | - [ ] freigeben |

## Stahlbauprofile (`bp_stahlbauprofile`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bps_2` | II | IPE 300 (W_el,y = 557 cm³), M_Ed = 45 kNm. Wie groß ist die Randspannung? | ok | - [ ] freigeben |
| `q_bps_3` | II | Ein IPE 300 hat A = 53,8 cm². Wie groß ist das Eigengewicht je Meter (ρ = 7 850 … | ok | - [ ] freigeben |
| `q_bps_4` | II | Was unterscheidet HEA, HEB und HEM gleicher Nenngröße? | ok | - [ ] freigeben |
| `q_bps_5` | II | Stütze HEB 200 (i_z = 5,07 cm), Knicklänge 4,0 m um die schwache Achse. Wie groß… | ok | - [ ] freigeben |

## Holzwerkstoffe (`holzwerkstoffe`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_holzwerkstoffe_1` | II | Eine OSB/3-Platte in Nutzungsklasse 2 hat unter ständiger Last die Anfangsdurchb… | ok | - [ ] freigeben |

## Konformität & Auditierung (`bp_recht_konformitaet`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bp_recht_konformitaet_1` | II | Was wird durch eine Akkreditierung bestätigt? | ok | - [ ] freigeben |
| `qn_bp_recht_konformitaet_2` | II | Welche Institution ist in Deutschland als nationale Akkreditierungsstelle zustän… | ok | - [ ] freigeben |
| `qn_bp_recht_konformitaet_4` | II | In welcher Reihenfolge laufen die Schritte eines Bauprodukt-Verfahrens nach dem … | ok | - [ ] freigeben |
| `qn_bp_recht_konformitaet_5` | II | Ein unabhängiger Prüfer des Programmbetreibers kontrolliert die Ökobilanz einer … | ok | - [ ] freigeben |

## Betonfertigteile (`bp_betonfertigteile`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bp_betonfertigteile_1` | II | Eine Spannbeton-Hohlplatte mit h = 32 cm hat einen Hohlraumanteil η = 0,45 (γ_c … | ok | - [ ] freigeben |

## Betonwaren (`bp_betonwaren`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bp_betonwaren_1` | II | Ein Pflasterstein (Spaltlänge l = 220 mm, Dicke t = 80 mm, k = 1,0) bricht bei P… | ok | - [ ] freigeben |
| `qn_bp_betonwaren_2` | II | Welche Aufgabe übernimmt der Vorsatzbeton eines zweischichtigen Betonpflasterste… | ok | - [ ] freigeben |
| `qn_bp_betonwaren_3` | II | Wie wird die Muffenverbindung von Betonrohren nach dem Modul abgedichtet? | ok | - [ ] freigeben |

## Mauerwerk (`bp_mauerwerk`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bp_mauerwerk_1` | II | Eine Wand aus Steinen der Gruppe 1 (K = 0,55) mit f_b = 12 N/mm², Normalmauermör… | ok | - [ ] freigeben |
| `qn_bp_mauerwerk_2` | II | Was kennzeichnet Dünnbettmörtel (DM) nach dem Modul? | ok | - [ ] freigeben |
| `qn_bp_mauerwerk_3` | II | Wie ist zweischaliges Verblendmauerwerk mit Kerndämmung aufgebaut, und was ist s… | ok | - [ ] freigeben |

## Dimensionierung (RStO 12/24) (`bp_verkehr_rsto`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bp_verkehr_rsto_1` | II | Der statische Plattendruckversuch auf dem Planum ergibt E_V2 = 38 MPa. Wie ist n… | ok | - [ ] freigeben |
| `qn_bp_verkehr_rsto_3` | II | Untergrund F3, Bk1,0 (Ausgangswert 60 cm), Frosteinwirkungszone II (+5 cm), sons… | ok | - [ ] freigeben |
| `qn_bp_verkehr_rsto_4` | II | Welcher Verformungsmodul E_V2 wird auf der Frostschutzschicht für Bk10 gefordert… | ok | - [ ] freigeben |

## Asphaltsorten (`bp_verkehr_asphalt`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bp_verkehr_asphalt_1` | II | Wie unterscheidet sich das Korngerüst von Splittmastixasphalt (SMA) von dem eine… | ok | - [ ] freigeben |
| `qn_bp_verkehr_asphalt_2` | II | Welche Funktion haben die Zellulosefasern im Splittmastixasphalt? | ok | - [ ] freigeben |
| `qn_bp_verkehr_asphalt_3` | II | Warum wird Gussasphalt (MA) ohne Walzverdichtung eingebaut? | ok | - [ ] freigeben |
| `qn_bp_verkehr_asphalt_5` | II | Für eine Ortsumfahrung an einem Wohngebiet sollen Reifen-Fahrbahn-Geräusche gemi… | ok | - [ ] freigeben |

## Bitumen & Gesteine (`bp_verkehr_bitumen`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bp_verkehr_bitumen_2` | II | Unter welchen Bedingungen wird die Nadelpenetration von Bitumen nach DIN EN 1426… | ok | - [ ] freigeben |
| `qn_bp_verkehr_bitumen_3` | II | Bei der Nadelpenetration dringt die Nadel 6,2 mm in ein Straßenbaubitumen ein. W… | ok | - [ ] freigeben |
| `qn_bp_verkehr_bitumen_4` | II | Was gibt der Erweichungspunkt Ring und Kugel (RuK) eines Bitumens an? | ok | - [ ] freigeben |
| `qn_bp_verkehr_bitumen_6` | II | Für die Deckschicht einer Autobahn stehen ein weicher Kalkstein und ein Basalt z… | ok | - [ ] freigeben |

## Labor-Prüfmethoden (`bp_verkehr_pruefung`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bp_verkehr_pruefung_1` | II | Was wird beim Marshall-Versuch als Marshall-Stabilität bezeichnet? | ok | - [ ] freigeben |
| `qn_bp_verkehr_pruefung_2` | II | Welche Eigenschaft eines Asphalts wird mit dem Spurbildungsversuch (Wheel-Tracki… | ok | - [ ] freigeben |
| `qn_bp_verkehr_pruefung_5` | II | Für eine Deckschicht aus Asphaltbeton wird ein Hohlraumgehalt von 1,2 Vol.-% erm… | ok | - [ ] freigeben |

## Betondecken (ZTV) (`bp_verkehr_betondecken`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bp_verkehr_betondecken_2` | II | Welche Aufgabe haben die Dübel in den Querscheinfugen einer Betondecke? | ok | - [ ] freigeben |
| `qn_bp_verkehr_betondecken_3` | II | Westergaard-Rechner: Radlast P = 60 kN, h = 260 mm, l = 897 mm, r = 155 mm. Wie … | ok | - [ ] freigeben |
| `qn_bp_verkehr_betondecken_4` | II | Für einen Deckenbeton mit Größtkorn 22 mm wird ein Luftporengehalt von 4,2 % gem… | ok | - [ ] freigeben |
| `qn_bp_verkehr_betondecken_6` | II | Eine Betondecke soll mit quarzhaltigem, alkaliempfindlichem Kies und einem NA-Ze… | ok | - [ ] freigeben |

## Tiefbau & Entwässerung (`bp_verkehr_tiefbau`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bp_verkehr_tiefbau_1` | II | Welches Tiefbauprodukt schützt tiefliegende Ablaufstellen vor drückendem Abwasse… | ok | - [ ] freigeben |
| `qn_bp_verkehr_tiefbau_3` | II | Eine Asphaltfläche von 500 m² (ψ = 0,90) wird mit r_D = 200 l/(s·ha) über t_d = … | korrigiert (Abgleich 28.10.): normRef DWA-A 138 (2005, zurückgezogen) → DWA-A 138-1:2024-10; Rechenweg der Frage unverändert | - [ ] freigeben |
| `qn_bp_verkehr_tiefbau_4` | II | Eine Kiesrigole (s_R = 0,30, Querschnitt 0,60 m × 1,20 m) soll ein Nutzvolumen v… | korrigiert (Abgleich 28.10.): normRef DWA-A 138 (2005, zurückgezogen) → DWA-A 138-1:2024-10; Rechenweg der Frage unverändert | - [ ] freigeben |

## Bahnbau (Kompakt) (`bp_verkehr_bahn`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bp_verkehr_bahn_1` | II | Welcher Vor- und Nachteil der Festen Fahrbahn gegenüber dem Schotteroberbau wird… | ok | - [ ] freigeben |
| `qn_bp_verkehr_bahn_2` | II | Warum muss Gleisschotter nach dem Modul aus zähelastischem Hartgestein wie Basal… | ok | - [ ] freigeben |
| `qn_bp_verkehr_bahn_4` | II | Die Neutraltemperatur eines lückenlosen Gleises beträgt 20 °C, die Schiene hat i… | ok | - [ ] freigeben |
| `qn_bp_verkehr_bahn_5` | II | Bei ΔT = 25 K über der Neutraltemperatur entsteht in einer Schiene UIC 60 (A = 7… | ok | - [ ] freigeben |
| `qn_bp_verkehr_bahn_6` | II | Lehrmodell: Schiene 60 °C, Neutraltemperatur 20 °C, σ = 100,8 N/mm². Wie bewerte… | ok | - [ ] freigeben |

## Tunnelbau (Vortrieb) (`bp_verkehr_tunnel`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bp_verkehr_tunnel_1` | II | Was ist das Grundprinzip der Neuen Österreichischen Tunnelbauweise (NÖT)? | ok | - [ ] freigeben |
| `qn_bp_verkehr_tunnel_2` | II | Welche Frühfestigkeitsklasse des Spritzbetons ist nach dem Modul für dickere Lag… | ok | - [ ] freigeben |
| `qn_bp_verkehr_tunnel_3` | II | Eine Spritzbetonschale mit R = 5,0 m und d = 20 cm wird mit p_g = 0,20 MPa belas… | ok | - [ ] freigeben |
| `qn_bp_verkehr_tunnel_5` | II | Wie ändert sich nach der Kesselformel die Ringdruckspannung, wenn bei gleichem G… | ok | - [ ] freigeben |
| `qn_bp_verkehr_tunnel_6` | II | Ein 12 km langer Tunnel liegt in gleichartigem Gestein, ein kurzer Tunnel quert … | ok | - [ ] freigeben |

## Kleb- & Dichtstoffe (`bp_klebstoffe`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bp_klebstoffe_1` | II | Welcher Dichtstoff ist nach dem Modul direkt überstreichbar, aber nur gering deh… | ok | - [ ] freigeben |
| `qn_bp_klebstoffe_3` | II | Aluminiumelemente (α = 23 · 10⁻⁶ 1/K, L = 4,0 m) erfahren ΔT = 80 K; Dichtstoff … | ok | - [ ] freigeben |
| `qn_bp_klebstoffe_4` | II | Für eine Fuge mit b = 20 mm: Welche Fugentiefe und welche PE-Rundschnur empfiehl… | ok | - [ ] freigeben |

## Kunststoffe (`bp_kunststoffe`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bp_kunststoffe_1` | II | Eine Regenrinne aus PVC-U (α = 80 · 10⁻⁶ 1/K) ist 8,0 m lang und erfährt ΔT = 60… | ok | - [ ] freigeben |
| `qn_bp_kunststoffe_2` | II | Burgers-Modell: σ₀ = 4 N/mm², E₁ = 2000, E₂ = 1000 N/mm², η₁ = 4 · 10⁶, η₂ = 5 ·… | ok | - [ ] freigeben |

## Lehmbauprodukte (`bp_lehmbauprodukte`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bp_lehmbauprodukte_1` | II | Welche Produktnorm gilt für Lehmputzmörtel? | ok | - [ ] freigeben |
| `qn_bp_lehmbauprodukte_2` | II | Was beschreiben die Anwendungsklassen (AK Ia bis AK III) von Lehmsteinen nach DI… | ok | - [ ] freigeben |
| `qn_bp_lehmbauprodukte_3` | II | Lehmsteinwand: h = 2,75 m, oben und unten gehalten (β = 0,75), t = 30 cm, f_k = … | ok | - [ ] freigeben |
| `qn_bp_lehmbauprodukte_4` | II | Eine Lehmsteinwand soll außen einen Dispersionsanstrich erhalten und direkt auf … | ok | - [ ] freigeben |

## Metallische Werkstoffe (`bp_metallisch`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bp_metallisch_1` | II | Ein Aluminiumblech (ρ = 2700 kg/m³) ist 3 mm dick, 1,5 m breit und 3,0 m lang. W… | ok | - [ ] freigeben |
| `qn_bp_metallisch_2` | II | Ein Kupferblech soll befestigt werden. Welche Verbindungsmittel sind nach dem Mo… | ok | - [ ] freigeben |
| `qn_bp_metallisch_3` | II | Unter welchen Bedingungen versagt nach dem Modul der Schutzmechanismus von wette… | ok | - [ ] freigeben |

## Keramik und Ziegel (`keramik_ziegel`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_keramik_ziegel_1` | II | Welcher Vorgang macht beim Brand von Ziegelton die Umwandlung zur Keramik irreve… | ok | - [ ] freigeben |
| `qn_keramik_ziegel_2` | II | Eine trockengepresste Fliese wiegt trocken 400 g und nach dem Kochverfahren 410 … | ok | - [ ] freigeben |
| `qn_keramik_ziegel_3` | II | Ein Scherben hat die Trockenmasse 200 g, die Nassmasse 220 g und unter Wasser di… | ok | - [ ] freigeben |
| `qn_keramik_ziegel_5` | II | Welche Norm legt in Deutschland die Regeln für die Verwendung von Mauerziegeln n… | Klärung (Einzelfreigabe; Vermerk der Erstprüfung: Nachfolge von DIN 105-100 in der Rückmeldung zu Distraktor 3 nicht öffentlich nachgeprüft) | - [ ] freigeben |
| `qn_keramik_ziegel_7` | II | Wie viel CO₂ setzt die Zersetzung von 1 kg Calcit (CaCO₃) im Ziegelton beim Bran… | ok | - [ ] freigeben |

## Membranen & ETFE (`membranen_etfe`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_membranen_etfe_3` | II | Wodurch unterscheidet sich eine klare ETFE-Folie lichttechnisch deutlich von Flo… | Klärung (Einzelfreigabe; Vermerk der Erstprüfung: Floatglas lässt UV-A teilweise durch; „weitgehend“ gegenüber Floatglas vertretbar, ggf. später schärfen) | - [ ] freigeben |
| `qn_membranen_etfe_4` | II | Welcher U-Wert ist für ein dreilagiges ETFE-Kissen (zwei Luftkammern) nach Herst… | ok | - [ ] freigeben |
| `qn_membranen_etfe_5` | II | Welches Dokument beschreibt europäisch die Bemessung vorgespannter Membrantragwe… | ok | - [ ] freigeben |
| `qn_membranen_etfe_6` | II | Warum werden PTFE/Glas-Membranen bei Transport und Montage besonders sorgfältig … | ok | - [ ] freigeben |

## Ausgangsstoffe (`grundlagen`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_grundlagen_5` | III | Welches Wasser darf nach DIN EN 1008 ohne vorherige Prüfung als Zugabewasser für… | ok | - [ ] freigeben |
| `qn_grundlagen_4` | III | Was bedeutet die Bezeichnung CEM III/A 42,5 N? | ok | - [ ] freigeben |

## Bindemittel (`bindemittel`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bdm_1` | III | Ein CEM III/A mit 55 % Hüttensand hat ein Na₂O-Äquivalent von 0,95 M.-%. Darf er… | ok | - [ ] freigeben |
| `q_bdm_2` | III | Klinker mit Al₂O₃ = 6,0 % und Fe₂O₃ = 3,0 %. Wie hoch ist der C₃A-Gehalt nach Bo… | ok | - [ ] freigeben |
| `qn_grundlagen_1` | III | In welchem Prozessschritt der Klinkerherstellung wird der größte Teil des rohsto… | ok | - [ ] freigeben |
| `qn_bindemittel_1` | III | Ein CEM I hat Na₂O = 0,25 M.-% und K₂O = 0,55 M.-%. Wie groß ist Na₂O_eq = Na₂O … | ok | - [ ] freigeben |
| `qn_bindemittel_3` | III | Für eine 2,5 m dicke Fundamentplatte soll die Hydratationswärme begrenzt werden.… | ok | - [ ] freigeben |

## Mischungsberechnung (`mischungsberechnung`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_mib_1` | III | 1 m³ Beton: z = 300 kg (ρ = 3,1 kg/dm³), w = 165 kg, Luft 2 Vol.-%. Wie viel tro… | ok | - [ ] freigeben |
| `q_mib_2` | III | Ein Bauteil ist XC4, XD1 und XA2 zugeordnet. Welcher höchstzulässige w/z-Wert is… | ok | - [ ] freigeben |
| `qn_mischungsberechnung_2` | III | CEM I, z = 270 kg/m³, Flugasche f = 110 kg/m³ (k = 0,4; anrechenbar höchstens f … | ok | - [ ] freigeben |
| `qn_mischungsberechnung_3` | III | Nach dem im Modul verwendeten Ansatz f = A/5^(w/z) mit A = 120 N/mm² (CEM 42,5) … | ok | - [ ] freigeben |

## Hydratation & Folgen (`hydratation_folgen`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_hyf_1` | III | Beton liegt 72 h bei 5 °C. Welchem Alter bei 20 °C entspricht das nach Saul (T₀ … | ok | - [ ] freigeben |
| `q_hyf_3` | III | Beton liegt 24 h bei konstant 30 °C. Welchem Alter bei 20 °C entspricht das nach… | ok | - [ ] freigeben |
| `q_hyf_4` | III | z = 320 kg/m³, Q = 350 kJ/kg, c·ρ = 2 500 kJ/(m³·K), Frischbetontemperatur 15 °C… | ok | - [ ] freigeben |
| `q_hyf_5` | III | Warum setzt der Reifegradansatz nach Saul eine Bezugstemperatur von T₀ = −10 °C … | ok | - [ ] freigeben |
| `q_hyf_6` | III | Welche Maßnahme senkt die Kerntemperatur eines massigen Fundaments bei gleicher … | ok | - [ ] freigeben |
| `q_esx_1` | III | Was kennzeichnet Eigenspannungen? | ok | - [ ] freigeben |
| `q_esx_2` | III | Wo treten in der Aufheizphase eines massigen Bauteils Zugeigenspannungen auf? | ok | - [ ] freigeben |
| `q_esx_4` | III | Parabelförmiges Temperaturprofil: Rand 20 °C, Mitte 40 °C, Rand 20 °C; E_c,eff =… | ok | - [ ] freigeben |
| `q_esx_5` | III | Ein Bauteil trocknet von außen aus; der Rand schwindet stärker als der feuchte K… | ok | - [ ] freigeben |
| `q_esx_6` | III | Wie ändern sich die Eigenspannungen eines massigen Bauteils, wenn es nach dem Te… | ok | - [ ] freigeben |

## Nachbehandlung (`nachbehandlung`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_nbh_2` | III | Welche Änderung erhöht die Verdunstungsrate einer frischen Betonfläche am stärks… | ok | - [ ] freigeben |
| `qn_nachbehandlung_2` | III | Industrieboden XM2, Festigkeitsentwicklung mittel (r = 0,40), Oberflächentempera… | ok | - [ ] freigeben |

## Festbeton (`festbeton`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_feb_1` | III | Eine Produktion liefert f_cm = 38 N/mm² (Zylinder) bei σ = 3,5 N/mm². Welche cha… | ok | - [ ] freigeben |
| `q_feb_2` | III | Welcher Zement liefert nach EC2 bei gleicher 28-Tage-Festigkeit die höchste 7-Ta… | ok | - [ ] freigeben |
| `qn_festbeton_1` | III | C30/37 (f_cm = 38 N/mm²), Zement der Klasse N (s = 0,25). Welche mittlere Zylind… | ok | - [ ] freigeben |
| `qn_festbeton_2` | III | Erstherstellung C25/30 (f_ck,cube = 30 N/mm²), drei Würfelergebnisse: 34,0; 32,5… | ok | - [ ] freigeben |
| `qn_festbeton_4` | III | Was gibt die Bezeichnung LC25/28 an? | ok | - [ ] freigeben |

## Sichtbeton (SB 1–4) (`sichtbeton`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_sbt_1` | III | Welche Wirkung hat eine saugende Schalung (z. B. sägeraues Holz) im Vergleich zu… | ok | - [ ] freigeben |
| `qn_sichtbeton_1` | III | Welche Sichtbetonklasse steht nach DBV/VDZ-Merkblatt für normale Anforderungen, … | ok | - [ ] freigeben |
| `qn_sichtbeton_2` | III | Auf einer Prüffläche 500 × 500 mm wird eine Porenfläche von 1 800 mm² ermittelt.… | ok | - [ ] freigeben |

## Sonderbetone (`sonderbetone`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_sob_1` | III | Wie groß ist der Abminderungsbeiwert η_E = (ρ/2 200)² für einen Leichtbeton mit … | ok | - [ ] freigeben |
| `q_sob_3` | III | Ein SVB erreicht im Setzfließversuch 720 mm. Welche Klasse liegt vor? | ok | - [ ] freigeben |
| `q_sob_4` | III | Worauf kommt es beim Contractor-Verfahren für Unterwasserbeton an? | ok | - [ ] freigeben |
| `q_sob_5` | III | Ab welcher Trockenrohdichte spricht man nach DIN EN 206 von Schwerbeton? | ok | - [ ] freigeben |
| `q_sob_6` | III | Ab welcher kleinsten Bauteilabmessung gilt ein Betonbauteil nach DAfStb-Richtlin… | ok | - [ ] freigeben |

## Entwicklungen (`innovative_werkstoffe`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_inw_1` | III | Eine gedruckte Wand (ρ = 2 200 kg/m³) soll 1,5 m hoch werden. Welche Fließgrenze… | korrigiert (Abgleich 28.10.): gapAnalysis an die Rechenaufgabe angepasst (Formfaktor 1/√3 statt Druckgeschwindigkeit) | - [ ] freigeben |
| `q_inw_2` | III | Wo sind die klinkerarmen Zemente CEM II/C-M und CEM VI genormt? | ok | - [ ] freigeben |
| `qn_innovative_werkstoffe_2` | III | Eine dünne, gerade gedruckte Wand weicht während des Drucks seitlich aus, obwohl… | ok | - [ ] freigeben |
| `qn_innovative_werkstoffe_3` | III | Für eine tragende 3D-gedruckte Wandscheibe soll die Bewehrung möglichst einfach … | ok | - [ ] freigeben |

## Qualitätssicherung (`qualitaetssicherung`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_qsi_2` | III | Erstherstellung C25/30 (Zylinder): Welches Kriterienpaar gilt für 3 Ergebnisse? | ok | - [ ] freigeben |
| `q_qsi_3` | III | Identitätsprüfung mit 3 Probekörpern, C30/37 (Würfel). Welche Mittelwertanforder… | ok | - [ ] freigeben |
| `q_qsi_6` | III | Was bewertet eine Zertifizierung des Concrete Sustainability Council (CSC)? | ok | - [ ] freigeben |

## Betonpraxis (`betonpraxis`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bpx_1` | III | Außenbauteil XC4, Stab Ø 20 mm. Welches Nennmaß c_nom ergibt sich? | ok | - [ ] freigeben |
| `q_bpx_3` | III | Welche Mindestdicke gilt für eine Ortbetonwand der Beanspruchungsklasse 1? | ok | - [ ] freigeben |
| `q_bpx_5` | III | w = 175 kg/m³, Mehlkorn MK = 380 kg/m³. Wie groß ist K = (w − 70)/MK? | ok | - [ ] freigeben |

## Stahlbeton (`stahlbeton_bemessung`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_stb_2` | III | Welche Grenzdehnungen gelten im Parabel-Rechteck-Diagramm für Beton bis C50/60? | ok | - [ ] freigeben |
| `q_stb_3` | III | Bei welchem bezogenen Moment μ_Eds wird für B500 und Beton bis C50/60 üblicherwe… | ok | - [ ] freigeben |
| `q_stb_5` | III | Wie wirkt sich eine größere Nutzhöhe d auf den Maßstabsfaktor k in V_Rd,c aus? | ok | - [ ] freigeben |
| `q_stb_7` | III | Eine Stütze hat die bezogene Normalkraft \|n\| = 0,5. Welche Grenzschlankheit gilt… | ok | - [ ] freigeben |
| `q_stb_8` | III | In welchem Abstand vom Stützenrand liegt der kritische Rundschnitt u₁ (EC2 1. Ge… | ok | - [ ] freigeben |
| `q_stb_9` | III | Wie groß ist l_b,rqd für Ø 16, f_bd = 3,0 N/mm² und σ_sd = 435 N/mm²? | ok | - [ ] freigeben |

## WU-Bauwerke (Weiße Wannen) (`wu-bauwerke`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_wub_1` | III | Welche Beanspruchungsklasse gilt für drückendes Wasser? | ok | - [ ] freigeben |
| `q_wub_2` | III | Was kennzeichnet Entwurfsgrundsatz b? | ok | - [ ] freigeben |
| `q_wub_3` | III | Welche Mindestdicke gilt für eine Ortbeton-Bodenplatte in BK 1? | ok | - [ ] freigeben |
| `q_wub_4` | III | Wasserstand h_w = 4,5 m, Wanddicke 300 mm. Welche Rissbreite ist für die Selbsth… | ok | - [ ] freigeben |
| `q_wub_5` | III | Wo entstehen bei Weißen Wannen die meisten Undichtigkeiten? | ok | - [ ] freigeben |

## Carbonbeton (`carbonbeton`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_cbm_1` | III | Wie verhält sich Carbonbewehrung unter Zug bis zum Versagen? | ok | - [ ] freigeben |
| `q_cbm_3` | III | f_tk = 3 000 N/mm², γ_tex = 1,3. Wie groß ist f_td? | ok | - [ ] freigeben |

## Modulinfos (`holzbau_info`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_hbx_1` | III | Welcher E-Modul geht in die bezogene Schlankheit λ_rel beim Knicknachweis ein? | ok | - [ ] freigeben |
| `q_hbx_2` | III | Wie groß ist die ideelle Abbrandtiefe d_ef eines Nadel-Vollholzbalkens nach 30 m… | ok | - [ ] freigeben |
| `q_hbx_3` | III | Um wie viel darf die Aufstandslänge beim Querdrucknachweis je Seite rechnerisch … | ok | - [ ] freigeben |

## Sammlung (`innenausbau`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_iax_2` | III | Wie wirkt sich eine Doppelbeplankung auf die Resonanzfrequenz f₀ einer Ständerwa… | ok | - [ ] freigeben |
| `qn_innenausbau_2` | III | Zweischalige Ständerwand: m′₁ = m′₂ = 10 kg/m², Hohlraum d = 50 mm mit Faserdämm… | ok | - [ ] freigeben |

## Herstellung & Einbau (`herstellung_einbau`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_herstellung_einbau_1` | III | Worauf beruht die Pumpbarkeit von Beton in der Förderleitung im Wesentlichen? | ok | - [ ] freigeben |
| `qn_herstellung_einbau_2` | III | Bingham-Ansatz p = 2·τ₀·L/R + 8·μ_p·v·L/R² + ρ·g·H mit τ₀ = 150 Pa, μ_p = 25 Pa·… | ok | - [ ] freigeben |
| `qn_herstellung_einbau_3` | III | Steifer Beton wird mit einem Fahrzeug ohne Rührwerk geliefert. Erste Wasserzugab… | ok | - [ ] freigeben |
| `qn_herstellung_einbau_4` | III | Nach dem Verdichten einer Wand zeigt sich oben eine wasserreiche, weiche Schicht… | ok | - [ ] freigeben |

## Frischbeton (`frischbeton`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_frischbeton_1` | III | Mischungsregel: Zement 320 kg/m³ bei 50 °C, Wasser 170 kg/m³ bei 12 °C, trockene… | ok | - [ ] freigeben |

## Bemessung (EC5) (`holzbau_bemessung`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_holzbau_bemessung_4` | III | Stütze C24 (f_c,0,k = 21 N/mm², E_0,05 = 7 400 N/mm²), b/h = 120/160 mm, l_ef = … | ok | - [ ] freigeben |
| `qn_holzbau_bemessung_5` | III | Dieselbe Stütze (C24, 120/160 mm, λ_rel,z = 1,27, β_c = 0,2) hat k_c,z ≈ 0,50. B… | ok | - [ ] freigeben |
| `qn_holzbau_bemessung_6` | III | Schwelle C24 auf durchgehender Lagerung: b = 100 mm, Auflagerlänge l = 120 mm mi… | ok | - [ ] freigeben |

## Verbindungen & Anschlüsse (`holzbau_verbindung`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_holzbau_verbindung_1` | III | Welcher Johansen-Versagensmodus einer einschnittigen Holz-Holz-Verbindung ist am… | ok | - [ ] freigeben |
| `qn_holzbau_verbindung_2` | III | Bolzen d = 12 mm in Nadelholz C24 (ρ_k = 350 kg/m³). Wie groß ist die charakteri… | ok | - [ ] freigeben |
| `qn_holzbau_verbindung_3` | III | Wie groß ist das charakteristische Fließmoment M_y,Rk = 0,3·f_u,k·d^2,6 eines Bo… | ok | - [ ] freigeben |
| `qn_holzbau_verbindung_5` | III | Stabdübel d = 16 mm, Kraft parallel zur Faser (α = 0°). Welcher Mindestabstand a… | ok | - [ ] freigeben |
| `qn_holzbau_verbindung_6` | III | Schraube d = 8 mm in C24 (f_h,k = 26,4 N/mm², M_y,Rk = 26 740 Nmm), l_ef = 80 mm… | ok | - [ ] freigeben |

## Bauphysik & Brandschutz (`holzbau_bauphysik`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_holzbau_bauphysik_1` | III | Warum wird bei der Methode mit reduziertem Querschnitt zur Abbrandtiefe d_char,n… | ok | - [ ] freigeben |
| `qn_holzbau_bauphysik_2` | III | Nadelholz-BSH (β_n = 0,70 mm/min), ungeschützt, Branddauer t = 60 min, d₀ = 7 mm… | ok | - [ ] freigeben |
| `qn_holzbau_bauphysik_3` | III | BSH-Träger b/h = 160/400 mm, dreiseitig beflammt (Oberseite geschützt), d_ef = 4… | ok | - [ ] freigeben |
| `qn_holzbau_bauphysik_4` | III | BSP-Decke, Einfeld L = 5,0 m, t = 160 mm, E = 11 000 N/mm², Eigenmasse 450 kg/m³… | ok | - [ ] freigeben |
| `qn_holzbau_bauphysik_6` | III | In einem Holzbau wird Körperschall über die Wandanschlüsse in angrenzende Räume … | ok | - [ ] freigeben |

## Spannbeton (`spannbeton`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_spannbeton_2` | III | Spannstahl Y1770 mit f_pk = 1 770 N/mm² und f_p0,1k = 1 520 N/mm². Welche Spannu… | ok | - [ ] freigeben |
| `qn_spannbeton_3` | III | Rechteckquerschnitt b/h = 400/800 mm, P = 2 000 kN, Exzentrizität e_p = 250 mm n… | ok | - [ ] freigeben |
| `qn_spannbeton_4` | III | Load Balancing: Eine parabelförmige Spanngliedführung kompensiert das Eigengewic… | ok | - [ ] freigeben |
| `qn_spannbeton_5` | III | Reibungsverlust ΔP/P₀ = 1 − e^(−μ·(θ + k·x)) mit μ = 0,20, planmäßigem Umlenkwin… | ok | - [ ] freigeben |
| `qn_spannbeton_6` | III | Nachträglicher Verbund: n = 4 Spannglieder werden nacheinander gespannt; σ_c in … | ok | - [ ] freigeben |
| `qn_spannbeton_7` | III | Für eine punktgestützte Parkhaus-Flachdecke sollen Spannglieder wie Bewehrung ve… | ok | - [ ] freigeben |
| `qn_spannbeton_8` | III | Bei einer Bestandsbrücke mit SpRK-gefährdetem, vergütetem Spannstahl sollen bere… | ok | - [ ] freigeben |
| `qn_spannbeton_9` | III | Was fordert der Dekompressionsnachweis nach NA(DE) unter der maßgebenden Einwirk… | ok | - [ ] freigeben |
| `qn_spannbeton_10` | III | Mit welchen Querschnittswerten werden bei nachträglichem Verbund die Spannungen … | ok | - [ ] freigeben |

## Biokohlebeton (`biokohlebeton`)

| ID | Cl. | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_biokohlebeton_4` | III | Warum wird Pflanzenkohle vor dem Mischen häufig vorgenässt oder das von ihr aufg… | ok | - [ ] freigeben |

## Abgleich 28.10.

Anlass: unabhängige Stichprobe (25 Fragen, 2 Befunde zu Normstand/Kennwert). Ergebnis nach dem Abgleich: 401 ok, 7 korrigiert, 9 Klärung. Fragen mit „korrigiert“ oder „Klärung“ und alle früheren „ok (…)“-Fragen mit Vorbehalt sind aus der Sammelfreigabe herausgenommen und haben eine eigene Checkbox. Es wurde nichts freigegeben.

- Befunde der Stichprobe: `qn_festigkeit_2` (C24 nach DIN EN 338:2016-07 neu gerechnet: 3,5 km) und `qn_bp_verkehr_tiefbau_4` (DWA-A 138-1) korrigiert; Hinweise `qn_asphalt_1` (normRef + DIN EN 12697-6), `q_inw_1` (gapAnalysis) bereinigt.
- Antwortschlüssel: nur `qn_festigkeit_2` wurde neu gerechnet (richtige Option jetzt 3,5 km statt 3,2 km); alle übrigen Korrekturen betreffen normRef, Quelle, Rückmeldungen oder gapAnalysis.

- **Suchlauf 1 – Normstände** (Suchskript außerhalb des Repos, über alle 669 Fragen beider Listen; normRef, quelle, Fragetext, Optionen, Erklärung, Rückmeldungen, gapAnalysis):
  - DWA-A 138 ohne „-1“: 2 Treffer (`qn_bp_verkehr_tiefbau_3`, `_4`) → auf DWA-A 138-1:2024-10 umgestellt (Ersatz der Ausgabe 2005 laut BauNetz Wissen und FORUM VERLAG); zusätzlich außerhalb der Listen `qn_bp_verkehr_tiefbau_2/_5/_6` (Freigabe zurückgenommen) und `q_vwb_6`. Modul Tiefbau, Rechenkern-Hinweis, Grenzen, Lernziel und Registry ebenfalls umgestellt; geänderte Rechenregeln (Standortfaktor f_Ort, Rigolenhöhe) nur als vorläufiger Hinweis, Rechenweg unverändert.
  - DIN 4108-2: 11 Treffer. Die Neuausgabe DIN 4108-2:2026-05 ist erschienen (DIN-Katalog, Inhaltsverzeichnis öffentlich: Abschnitte 5 Mindestwärmeschutz, 6 Wärmebrücken, 8 sommerlicher Wärmeschutz); eine Änderungsliste und die Zahlenwerte sind öffentlich nicht einsehbar. `qn_sommerlicher_waermeschutz_1`–`_7` und `q_bst_5` (ausdrücklich Ausgabe 2013-02 mit Zahlenwerten) → Klärung; `qn_bauphysik_6`, `q_fs_1`, `q_we_5` (allgemeine Bauphysik ohne normabhängigen Zahlenwert) bleiben ok, Ausgabe in `q_we_5`/quelle beim Normtext-Abgleich nachziehen.
  - DIN 1045-2:2008, DIN EN 206-1:2001, DIN 4109:1989/Beiblatt 1, DIN 1045 (1988/2001), DIN 18195: 0 Treffer.
  - EnEV/GEG: 4 Treffer, alle mit GModG-Bezug bzw. historischer Abfolge (`q_bst_6`) – ok.
  - VOB/A 2019: 2 Treffer (`q_px_pl_5`, `q_px_pl_6`) → Quelle auf Abschnitt 1 (2019) präzisiert und VOB/A 2026 (Abschnitte 2/3, BAnz AT 24.08.2026 B6, seit 08.09.2026 anzuwenden; § 7 EU Abs. 1 Nr. 3/4 gleichlautend) ergänzt. VOB/B-Fundstellen (4) unverändert ok.
  - PCB-Richtlinie 1994 / 300/3000 ng/m³: 1 Treffer (`q_sch_4`, bereits AIR 2025); Module Historische Bauprodukte, Rückbau und Schadstoffe sowie Kurzfassung auf AIR-Richtwerte 2025 (RW I 80 / RW II 800 ng/m³, IFA/DGUV „air_pcb_2025“) umgestellt, PCB-Richtlinie als früherer Bewertungsstand (über MVV TB weiterhin eingeführt).
  - BauPVO 305/2011: 3 Treffer; `q_bpr_3` und `q_dg_dpp_2` nennen die alte Verordnung nur als Abgrenzung (ok), `q_bre_4` → VO (EU) 2024/3110, Anhang IX (System 4 ohne notifizierte Stelle, gesetze.legal). `q_bre_2` („BauPVO Anhang“) ok, System 1+ bleibt die stärkste Beteiligung.
  - TRGS 519: 4 Treffer, aktueller Stand – ok.
- **Suchlauf 2 – Kennwerte** (Suchskript außerhalb des Repos): Zahlen mit Symbol (f_ck, f_cm, f_ctm, E_cm, f_y, f_u, f_yk, E_s, f_m,k, f_t,0,k, f_c,0,k, E_0,mean, E_0,05, ρ_k, ρ_mean, ρ) in Fragetext, Optionen und Erklärung gegen `src/data/kennwerte.ts` für die in der Frage genannte Klasse (Beton C12/15–C90/105, S235/S355/S460, B500A/B, C16–D40, GL24h–GL28c). Einzige echte Abweichung: `qn_festigkeit_2` (C24 mit 14 N/mm²/450 kg/m³) → korrigiert. Übrige Treffer sind beabsichtigte Distraktoren (`q_kenn_1`, `q_kenn_5`, `qn_emodul_1`, `q_sta_3`) oder Konformitätskriterien (`qn_festbeton_statistik_2`, `q_qsi_2`, `q_qsi_3`).
- **Modul-eigene Kennwertdatensätze** (Suche über content/*.json): Nur „holz_fichte_par“ im Festigkeitsvergleich wich ab (angeglichen, Erkundungsauftrag neu gerechnet: Holz 3519 m statt 3171 m, Turmhöhe 5097 m). Beton C20/25, C50/60, C30/37, S235/S355, KVH C24 und BSH GL24h in Festigkeitsberechnungen, Elastomechanik, BIM-Baustoffe und Holzprodukte stimmen; neue Ratsche in `tests/kennwerte.test.ts` (Abschnitt 7). Expositionsklassen der Mischungsberechnung (Mindestfestigkeit, w/z, Zementgehalt, c_min) entsprechen DIN 1045-2; S690 (f_u 770) liegt außerhalb von kennwerte.ts und stimmt mit EN 10025-6.

---

Freigabe aller mit ok bewerteten Fragen (401; ohne „korrigiert“ und „Klärung“, diese einzeln über ihre Checkbox): [x] (28.10.2026)

401 Fragen mit Ergebnis „ok“ am 28.10.2026 freigegeben (`verified: true`, `reviewer` „freigegeben 28.10.2026 (Zweitprüfung)“, `reviewedAt` 2026-10-28). Vor der Freigabe wurde jede Frage mit dem Stand der Liste nach dem Abgleich (quiz.json in 55da85e9) verglichen: keine inhaltliche Änderung, nur Tausendertrennung. Offen (Einzelcheckbox): `q_we_4`, `qn_festigkeit_2`, `qn_sommerlicher_waermeschutz_1`, `qn_sommerlicher_waermeschutz_2`, `qn_sommerlicher_waermeschutz_3`, `qn_sommerlicher_waermeschutz_4`, `qn_sommerlicher_waermeschutz_5`, `qn_sommerlicher_waermeschutz_6`, `qn_sommerlicher_waermeschutz_7`, `q_bre_4`, `qn_asphalt_1`, `qn_bp_verkehr_tiefbau_3`, `qn_bp_verkehr_tiefbau_4`, `qn_keramik_ziegel_5`, `qn_membranen_etfe_3`, `q_inw_1`
