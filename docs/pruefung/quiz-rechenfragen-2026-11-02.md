# Nachrechnung der Quiz-Rechenfragen (02.11.2026)

Auftrag: Alle Quizfragen in `src/data/quiz.json` mit Rechenanteil (Zahl in der richtigen Antwort oder Erklärung, die aus den Angaben der Frage folgt) identifizieren und nachrechnen – über die Rechenkerne in `src/calc`, sonst per Handformel mit Quellenangabe. Geprüft wurden: richtige Antwort im Rundungsrahmen, jeder Distraktor tatsächlich falsch, Einheit und Bezugsgröße, Bereichsgrenzen und Klasseneinstufungen (≤ / <).

Nicht bearbeitet (andere PRs): `q_vdi_1`, `q_bpx_5`, `qn_rechnung_stahlbeton_4`, `qn_grundlagen_2`, `qn_holzbau_verbindung_4`.

## Vorgehen

1. **Auswahl** (Skript): 1304 Fragen; Kandidaten sind Fragen mit Zahlenangabe in der Frage und Zahl in der richtigen Option oder Rechenzeichen in der Erklärung (513), dazu eine zweite Liste mit Zahlen nur in Option oder Erklärung (175). Alle Kandidaten wurden gelesen; reine Fakten- und Normwertfragen (z. B. Fristen, Klassengrenzen ohne Rechnung, Jahreszahlen) sind keine Rechenfragen.
2. **Kernprüfung**: Fragen, deren Zahlen aus einem Kern folgen, stehen jetzt in `tests/quizRechenfragen.test.ts` (Werte immer aus dem Kern, nie abgeschrieben): 114 Prüfungen, davon 84 neu.
3. **Handformel**: übrige Rechenfragen mit einem eigenen Skript (Python, Formel und Quelle je Frage, Rundung kaufmännisch). Das Skript prüft, dass jede erwartete Zahl in der richtigen Option steht und kein Distraktor alle Lösungszahlen enthält; Treffer der zweiten Prüfung wurden von Hand bewertet (Tabelle unten).
4. **Modelle in Moduldateien** ohne eigenen Kern (CRREM-Pfad, Frischbetontemperatur mit Eis) wurden gegen den Code des Moduls nachgerechnet.

## Ergebnis

| Umfang | Anzahl |
|---|---|
| Rechenfragen nachgerechnet (Kern oder Handformel, ohne Doppelzählung) | 444 |
| davon über Rechenkerne im Test | 114 (84 neu) |
| davon per Handformel | 333 (3 davon zusätzlich im Test) |
| gegen Modulcode nachgerechnet (ohne Kern) | 3 (`qn_lca_regulatorik_2`, `qn_lca_regulatorik_3`, `qn_rechnung_beton_5`) |
| eindeutig falsche Fragen | **0** – keine Korrektur in `quiz.json` |
| Fragen mit Vorschlag | 2 (`qn_carbonbeton_1`, `qn_carbonbeton_2`) |

Alle richtigen Antworten stimmen im Rundungsrahmen; Einheiten und Bezugsgrößen (je m², m³, t, kg, Meter Wand) passen. Keine Frage hat einen zufällig ebenfalls richtigen Distraktor. Die Grenzfälle der Klasseneinstufungen sind normgerecht:

| Frage | Grenzfall | Bewertung |
|---|---|---|
| `q_px_pr_2` | f_cm = 41 = f_ck + 4 | erfüllt (≥), Kern bestätigt |
| `qn_labor_frischbeton_1` | Ausbreitmaß 490 mm | F4 (490–550 mm), Untergrenze eingeschlossen |
| `q_wub_4` | h_w/h_b = 15 | Stufe ≤ 15 → w_k = 0,15 mm |
| `qn_bodenmechanik_1`, `qz24_atterberg_3` | I_C = 0,62 / 0,60 | steif (0,50 ≤ I_C < 0,75), Kern `zustandsformISO14688` |
| `q_boden_1` | I_C = 0,80 | halbfest (0,75 ≤ I_C ≤ 1,00) |
| `qn_keramik_ziegel_2` | E_b = 2,5 % | BIb (0,5 % < E_b ≤ 3 %) |
| `qn_px_bautagebuch_1` | r = 0,24 | langsam (0,15 ≤ r < 0,30) |
| `q_sch_3` | KI = 35 | Kategorie 2 (30 < KI < 40) |
| `qn_innenausbau_1` | 1,9 / 0,4 CM-% | ≤ 2,0 belegreif / > 0,3 nicht belegreif |
| `qn_bp_verkehr_rsto_2`, `q_vwb_1` | B = 20 / 5 Mio. | Bk32 (> 10–32), Bk10 (> 3,2–10) |
| `qn_sommerlicher_waermeschutz_2` | S_vorh = 0,0375 | gerundet 0,038 (kaufmännisch) |
| `qn_betonpraxis_1` | 0,85 · 31 = 26,35 | gerundet 26,4; 26,2 < 26,35 verfehlt |

## Fragen mit Vorschlag

| Frage | Befund | Vorschlag |
|---|---|---|
| `qn_carbonbeton_1` | Die Frage gibt ausdrücklich das vereinfachte Verfahren vor (y = F_t/(b·f_cd), Textil erreicht f_td); damit sind 3,0 kNm/m richtig. Der Kern rechnet seit T9-CB-1 mit Dehnungskontrolle: Mit E_tex = 200 GPa (Voreinstellung des Moduls) erreicht der Beton ε_cu3 vor dem Textilbruch, `carbonbetonBiegung` liefert m_Rd ≈ 2,2 kNm/m – das vereinfachte Verfahren liegt hier rund 36 % auf der unsicheren Seite. | E_tex = 200 GPa in die Frage aufnehmen und auf das Verfahren des Moduls umstellen (m_Rd ≈ 2,2 kNm/m, Betonversagen) oder in der Erklärung ausdrücklich auf die fehlende Dehnungskontrolle hinweisen. |
| `qn_carbonbeton_2` | Die Frage nennt „von rund 5,1 auf rund 8,9 kNm/m“ – Werte des vereinfachten Verfahrens. Der Rechner des Moduls zeigt für denselben Fall 5,0 und 6,3 kNm/m (bei a_tex = 200 mm²/m versagt der Beton zuerst); die Antwort (Druckzone wächst, Hebelarm sinkt) bleibt richtig. | Zahlen auf 5,0 → 6,3 kNm/m umstellen und in der Erklärung ergänzen, dass bei 200 mm²/m zusätzlich der Beton vor dem Textil versagt. |

Der Test prüft beide Fragen vorerst gegen den Vergleichswert des Kerns ohne Dehnungskontrolle (`mRdOhneDehnungskontrolle`), mit Kommentar.

## Distraktoren mit denselben Zahlen wie die Lösung (Handprüfung)

Das Skript meldet Distraktoren, die alle Lösungszahlen enthalten. Alle sind durch Bewertung, Vorzeichen oder vertauschte Zuordnung eindeutig falsch:

| Frage | Distraktor | warum falsch |
|---|---|---|
| `qn_bp_holzprodukte_4` | σ 58 %, w 69 % | Zuordnung vertauscht |
| `qn_bruchmechanik_3` | 36,5 MPa√m, „in beiden Fällen stabil“ | K_I > K_Ic = 30 MPa√m bei Kälte |
| `qn_festigkeit_mohr_2` | φ₁ = −22,5° | Vorzeichen |
| `qn_labor_frischbeton_1` | 490 mm, F3 | Klasse |
| `qn_bp_verkehr_bahn_4` | 75,6 N/mm² Druck | Abkühlung → Zug |
| `qn_energieausweis_1` | q_E 24, q_P 94 | vertauscht |
| `q_bbt_3` | 0,50 – nicht erfüllt | 0,50 ≤ 0,55 |
| `q_frb_1` | „4,1 % unter dem Mittelwert 4,5 %“ | Einzelwertkriterium ≥ 4,0 % |
| `qn_sichtbeton_2` | 0,72 % – P3 | 1800 > 1500 mm² |
| `qn_bp_betonfertigteile_1` | g 3,6; Einsparung 4,4 | vertauscht |
| `qn_rechnung_bestand_6` | 49 / 60 kN | vertauscht |
| `qn_bim_baustoffe_4` | „unterschätzt“ | Brutto > Netto → überschätzt |
| `qn_statistik_2` | „ohne weitere Prüfung streichen“ | ISO 5725-2 verlangt eine technische Ursache |
| `q_ki_ub_2` | „0,30 mm/px genügen“ | gröber als die Rissbreite |
| `qn_pfas_baustoffe_5` | 18 ng/l „überschritten“ | 18 < 20 ng/l |
| `qn_pfas_baustoffe_6` | „eindeutig überschritten“ | Spanne 92–112 ng/l umfasst 100 ng/l |

## Nicht nachgerechnet

- Monte-Carlo-Ergebnisse (`qn_lebensdauer_5`, `qn_lebensdauer_6`): Zufallsergebnisse der Simulation, Aussage qualitativ geprüft.
- Simulatorwerte, die die Frage nur nennt (`qn_lca_ingenieurbau_4`, `_5`, `qn_lca_rechner_2`, `_3`): Arithmetik der Erklärung geprüft (Differenzen, Anteile, Verhältnisse stimmen), Eingangswerte nicht gegen den Simulator.
- Regel- und Punktemodelle der Module (`qn_bp_klebstoffe_4`, `qn_px_bautagebuch_3`, `qn_vdi6200_1`, `qn_bp_innovationen_2`): Rechnung nach der im Text genannten Regel stimmt.

## Kernprüfungen im Test (neu am 02.11.2026)

| Kern | Fragen |
|---|---|
| `waermeschutz` (U-Wert, Temperaturverlauf, Taupunkt, a, b) | `qn_rechnung_u_wert_2` … `_6`, `qn_bauphysik_1`, `_2`, `qn_daemmung_vergleich_1`, `qn_feuchteschutz_1`, `q_fs_1`, `q_we_4`, `qn_nawaro_2`, `qn_baustoffkenngroessen_1` |
| `betonkennwerte`, `emodul` | `qn_festbeton_1`, `qn_betonkennwerte_1`, `_2`, `q_feb_2`, `qn_emodul_1`, `_2`, `_4` |
| `festbetonStatistik` (Konformität) | `q_fbs_1`, `qn_festbeton_statistik_2`, `_3`, `qn_festbeton_2`, `q_px_pr_2`, `qn_px_produktion_2`, `qn_labor_druckfestigkeit_4`, `q_qsi_1` |
| `holzbau` (f_d, k_c, f_c,α,d, Abbrand) | `qn_rechnung_holzbau_1` … `_6`, `qn_holzbau_bemessung_2`, `_4`, `_5`, `q_hol_3`, `qn_holz_2`, `qn_holzbau_bauphysik_2`, `_3`, `qn_rechnung_brandschutz_1`, `_2`, `_4`, `q_bs_2`, `q_hbx_2` |
| `stahlbau` (Biegeknicken, Zugstab, M_pl) | `qn_stahlbau_ec3_3`, `_4`, `_7`, `qn_stahl_1` |
| `boden`, `erdbau` | `q_boden_1`, `qn_bodenmechanik_1` … `_3`, `qz24_atterberg_2` … `_4`, `qn_bp_verkehr_rsto_3`, `qn_erdbau_2`, `_3` |
| `korrosion`, `schnellkarbonatisierung` | `q_ko_2`, `qn_korrosion_1` … `_3`, `qn_bauchemie_1`, `qn_rechnung_nachhaltigkeit_1`, `_2`, `q_bch_1`, `qn_dauerhaftigkeit_2`, `qn_schnellkarbonatisierung_3`, `_5` |
| `lcc`, `zwang`, `spannungszustand`, `eisenKohlenstoff` | `q_lk_1`, `qn_zwang_1`, `_5`, `qn_festigkeit_mohr_1`, `_4`, `_5`, `qn_stahl_fec_1`, `_3`, `_4` |
| `werkstoffmodelle`, `carbonbeton`, `biegelinie` | `qn_materialmodelle_1`, `_2`, `q_matm_2`, `q_sta_2`, `qn_carbonbeton_1`, `_2`, `qn_formaenderungen_bl_1`, `_2` |

Bereits vorher im Test (gegengeprüft, unverändert grün): Mauerwerk, Schallschutz, `qn_mischungsberechnung_4`, `qn_lca_rechner_fe2`, `q_hyf_2`, `q_hyf_4`, Teilmodul-Aufstockung (`qt_*`).

## Gegen Modulcode nachgerechnet

- `qn_lca_regulatorik_2`/`_3` (CRREM-Lehrpfad in `src/modules/Nachhaltigkeit.tsx`, lineare Interpolation der Stützwerte): Büro 45 · 0,25 = 11,25 > 10,0 erstmals 2035; Wohnen 30 → 2023, Opex 25,5 → 2026, Hülle 19,5 → 2028, Deep Capex 7,5 → 2036 (Pfad 2036: 7,2).
- `qn_rechnung_beton_5` (Bilanz in `src/modules/Beispielrechnungen.tsx`): ΔT durch die Schmelzwärme 30 · 334/2512 ≈ 4,0 K, durch kaltes Wasser (20 → 0 °C) 30 · 4,18 · 20/2512 ≈ 1,0 K; 27,1 → 26,1 → 22,1 °C ist in sich stimmig, der größte Teil stammt aus der Schmelzwärme.

## Handformeln (Skript, alle Fragen „stimmt“)

| Frage | Nachgerechnet | Formel / Quelle | Ergebnis |
|---|---|---|---|
| `q_an_2` | 12,3 | Stöchiometrie | stimmt |
| `q_asp_1` | 3,0 | Hohlraum | stimmt |
| `q_bab_2` | 5,7 | d_wet | stimmt |
| `q_bbf_1` | 1,84 | N ∝ h_ef^1,5 | stimmt |
| `q_bbt_1` | 30,3 | 5-%-Quantil | stimmt |
| `q_bbt_3` | 0,50 | w/z | stimmt |
| `q_bdf_1` | 0,87 | DIN EN ISO 10 077-1 | stimmt |
| `q_bdm_2` | 10,8 | Bogue | stimmt |
| `q_bfl_1` | 200 | d_wet | stimmt |
| `q_bgl_2` | 0,51 | (w/z)_eq | stimmt |
| `q_bks_1` | 19 | b = Δl/ZGV | stimmt |
| `q_bm_1` | 4 | LAGA PN 98 Tab. 2 | stimmt |
| `q_bp_1` | 0,229 | U = 1/R_T | stimmt |
| `q_bp_2` | 0,48 | Sabine | stimmt |
| `q_bpd_1` | 0,20 | U = 1/R_T | stimmt |
| `q_bpe_1` | 0,19 | Stöchiometrie | stimmt |
| `q_bpi_2` | 50 | Lieferradius | stimmt |
| `q_bpi_3` | 60 | Lieferradius | stimmt |
| `q_bps_2` | 81 | σ = M/W | stimmt |
| `q_bps_3` | 42,2 | m = A·ρ | stimmt |
| `q_bps_5` | 79 | λ = L/i | stimmt |
| `q_bpt_1` | 22 | ΔL | stimmt |
| `q_bpx_1` | 40 | EC2/NA | stimmt |
| `q_bst_3` | 0,24 | R-Bilanz | stimmt |
| `q_bst_5` | 0,66 | f_Rsi = (θ_si − θ_e)/(θ_i − θ_e) | stimmt |
| `q_bstat_1` | 45 | M = ql²/8 | stimmt |
| `q_bwu_1` | 100 | √t-Gesetz | stimmt |
| `q_cbm_3` | 2308 | f_td | stimmt |
| `q_cl_3` | 8,3 | u = (m_f − m_tr)/m_tr | stimmt |
| `q_dc_3` | 39,6 | 5-%-Quantil | stimmt |
| `q_dc_4` | 40 | EC2/NA | stimmt |
| `q_dg_db_1` | 5,76 | Referenzfluss | stimmt |
| `q_dg_db_6` | 41,0 | Referenzfluss | stimmt |
| `q_dg_ot_1` | 15,6 | M = ql²/8 | stimmt |
| `q_dh_2` | 55 | EC2/NA c_min,dur XD3 = 40, Δc = 15 | stimmt |
| `q_dms_4` | 14 | d = Rλ | stimmt |
| `q_ec0_1` | 1530 | DIN EN 1990 Gl. 6.10 | stimmt |
| `q_ec0_4` | 17,0 | EC2/NA f_cd | stimmt |
| `q_ec0_5` | 6,6 | DIN EN 1990 quasi-ständig | stimmt |
| `q_einh_1` | 5,56 | σ = F/A | stimmt |
| `q_einh_3` | 0,005 | 1 kN/m² = 10⁻³ N/mm² | stimmt |
| `q_esx_4` | 2,0 | nichtlinearer Anteil 2/3·ΔT | stimmt |
| `q_exk_5` | 55 | EC2/NA | stimmt |
| `q_fbs_2` | 17,0 | EC2/NA f_cd | stimmt |
| `q_feb_1` | 32,2 | 5-%-Quantil | stimmt |
| `q_form_2` | 6 | ΔL = αΔTl | stimmt |
| `q_form_3` | 0,87 | ε_cc = φ·σ/E | stimmt |
| `q_frb_1` | 4,1 | DIN 1045-2 Tab. F.2.2 (16 mm: 4,5 %, Einzelwert −0,5) | stimmt |
| `q_frb_2` | 32 | DIN 18 218 F3 | stimmt |
| `q_fs_2` | 8,0 | s_d = μd | stimmt |
| `q_ho_2` | 22,5 | Holzfeuchte | stimmt |
| `q_hw_4` | 5,8 | Δb = q·Δu·b | stimmt |
| `q_hyf_1` | 36 | Saul | stimmt |
| `q_hyf_3` | 32 | Saul | stimmt |
| `q_inw_1` | 19 | Fließgrenze | stimmt |
| `q_is_im_2` | 47 | W_Rest/W_0 | stimmt |
| `q_is_sg_3` | 250 000 | De-Sitter | stimmt |
| `q_kenn_2` | 13,8 | ΔL = α·L·ΔT | stimmt |
| `q_kenn_3` | 26,8; 26,2 | E/ρ | stimmt |
| `q_kenn_5` | 2,9 | EC2 Tab. 3.1 f_ctm | stimmt |
| `q_kenn_6` | 15 | R = d/λ | stimmt |
| `q_kg_3` | 26 | s_d = μd; DIN 4108-3 0,5 < s_d < 1500 m | stimmt |
| `q_kg_5` | 32 | P = 1 − ρ/ρ_R | stimmt |
| `q_ki_bs_2` | 2,74 | RMSE | stimmt |
| `q_ki_bs_3` | 55,5 | Lehrmodell | stimmt |
| `q_ki_bs_4` | 2,0 | MAE | stimmt |
| `q_ki_lk_1` | 8,5 | Speicher | stimmt |
| `q_ki_ok_1` | 1,8 | Gradientenschritt | stimmt |
| `q_ki_ok_3` | 6 | Aufwand | stimmt |
| `q_ki_ok_4` | 1,0 | ECTS | stimmt |
| `q_ki_ok_5` | 4,0 | Gradientenschritt | stimmt |
| `q_ki_pr_2` | 157 | Kontext | stimmt |
| `q_ki_rs_1` | 5,7 | Normalapprox. | stimmt |
| `q_ki_rs_2` | 0,175 | E = P·t | stimmt |
| `q_ki_rs_3` | 0,063 | CO₂ | stimmt |
| `q_ki_rs_6` | 4,9 | Normalapprox. | stimmt |
| `q_ki_sy_2` | 0,70 | Sigmoid | stimmt |
| `q_ki_ub_2` | 0,30 | Auflösung | stimmt |
| `q_ki_ub_5` | 0,82 | F1 | stimmt |
| `q_ksx_3` | 11 000 | E_c,eff | stimmt |
| `q_ksx_4` | 75 | EC2 Gl. 3.12 | stimmt |
| `q_ksx_5` | 0,91 | ε(1 + φ) | stimmt |
| `q_ku_1` | 38 | ΔT_ad | stimmt |
| `q_ku_3` | 143 | p = ρgH | stimmt |
| `q_ku_5` | 80 | A = N/f_cd | stimmt |
| `q_kun_2` | 32 | ΔL | stimmt |
| `q_kw_1` | 0,82 | MCI | stimmt |
| `q_lk_1` | 44 800 | Kern (Test) | stimmt |
| `q_me_1` | 24,4 | PREN | stimmt |
| `q_me_2` | 40 | Schutzdauer | stimmt |
| `q_mech_2` | 2,83 | DIN EN 12 390-6 | stimmt |
| `q_mech_5` | 23,4 | DIN EN 408 | stimmt |
| `q_mib_1` | 1903 | Stoffraumrechnung | stimmt |
| `q_mk_1` | 3,23 | ΔL = FL/EA | stimmt |
| `q_mk_2` | 2,40 | ε(1 + φ) | stimmt |
| `q_mo_2` | 0,54 | (w/z)_eq | stimmt |
| `q_mod_1` | 11 | R-Bilanz | stimmt |
| `q_mp_3` | 0,029 | GUM | stimmt |
| `q_mp_5` | 4,2 | ISO 5725 | stimmt |
| `q_ms_mg_6` | 2,5 | a_c | stimmt |
| `q_ms_sc_3` | 40 | DFG | stimmt |
| `q_mwk_3` | 100 | DIN EN 1996-1-1/NA | stimmt |
| `q_naw_2` | 0,69 | DIN EN 16 449 | stimmt |
| `q_ndr_4` | 45 | EU-Taxonomie Anh. I 7.1 | stimmt |
| `q_px_bl_1` | 0,58 | w/z | stimmt |
| `q_px_ka_2` | 114 450 | Kalkulation | stimmt |
| `q_px_pl_1` | 40 | EC2/NA | stimmt |
| `q_px_pr_1` | 40 | Oberflächenfeuchte | stimmt |
| `q_qsi_3` | 38 | DIN EN 206 Anh. B (n = 2–4) | stimmt |
| `q_re_1` | 0,78 | MCI | stimmt |
| `q_ru_1` | 820 | DIN EN 16 449 | stimmt |
| `q_sb_2` | 0,88 | Na₂O-Äq. | stimmt |
| `q_sob_1` | 0,67 | EC2 11.3.2 | stimmt |
| `q_ss_1` | 57,5 | DIN 4109-32 | stimmt |
| `q_stb_1` | 17,0 | EC2/NA f_cd | stimmt |
| `q_stb_9` | 580 | EC2 8.4.3 | stimmt |
| `q_vwb_3` | 88 | σ = EαΔT | stimmt |
| `q_vwb_5` | 3,6 | Hohlraum | stimmt |
| `q_vwb_6` | 13,5 | Q = ψ·r·A | stimmt |
| `q_we_3` | 13,1 | R-Bilanz | stimmt |
| `q_wo_1` | 3 | Arrhenius | stimmt |
| `q_wub_4` | 0,15 | DAfStb WU-RL: h_w/h_b ≤ 15 → 0,15 mm | stimmt |
| `qn_altholz_urban_mining_5` | 54 | Modell Rechner | stimmt |
| `qn_altholz_urban_mining_6` | 2,1 | Anteil | stimmt |
| `qn_asphalt_1` | 2,359 | Raumdichte | stimmt |
| `qn_ausbau_1` | 1,8; 2,4 | ΔL | stimmt |
| `qn_bauphysik_5` | 0,90 | f_Rsi = 1 − R_si·U | stimmt |
| `qn_baustatik_2` | 66; 34 | Kragarm | stimmt |
| `qn_baustatik_3` | 40; 80 | Einfeldträger Einzellast | stimmt |
| `qn_baustatik_4` | 250; 62,5 | Zweifeldträger Stützmoment ql²/8 | stimmt |
| `qn_baustoffkenngroessen_2` | 1,30 | Summe | stimmt |
| `qn_bauwerkserfassung_4` | 0,87 | EC5 Gl. 6.19 | stimmt |
| `qn_bauwerksuntersuchung_1` | 28,5 | DIN EN 13 791:2020 | stimmt |
| `qn_betonkennwerte_5` | 2,32 | EC2 Gl. 3.7 | stimmt |
| `qn_betonpraxis_1` | 26,2; 26,4 | Modul (DIN EN 13 791) | stimmt |
| `qn_bim_baustoffe_3` | 1232 | GWP = V·gwp | stimmt |
| `qn_bim_baustoffe_4` | 134; 5,9 | Brutto/Netto | stimmt |
| `qn_bindemittel_1` | 0,61 | Na₂O-Äq. | stimmt |
| `qn_biokohlebeton_2` | 21,6 | Netto-Senke | stimmt |
| `qn_biokohlebeton_3` | 3,0 | Äquivalenz | stimmt |
| `qn_boden_materialaufbereitung_1` | 13 | LAGA PN 98 Tab. 2 | stimmt |
| `qn_boden_materialaufbereitung_2` | 14,4 | Bezug TM | stimmt |
| `qn_bp_befestigung_3` | 42,2 | DIN EN 1992-4 Gl. 7.2 | stimmt |
| `qn_bp_betonfertigteile_1` | 4,4; 3,6 | g = (1 − η)·h·γ | stimmt |
| `qn_bp_betonwaren_1` | 3,26 | DIN EN 1338 | stimmt |
| `qn_bp_betonzusatzmittel_2` | 0,512 | DIN EN 206 Wasser im Zusatzmittel > 3 l | stimmt |
| `qn_bp_dach_fassade_3` | 0,75 | DIN EN ISO 10 077-1 | stimmt |
| `qn_bp_dach_fassade_4` | 0,11 | ΔU_w = l·ΔΨ/A | stimmt |
| `qn_bp_daemmung_1` | 13,2 | R-Bilanz | stimmt |
| `qn_bp_farben_lacke_1` | 45 | Mengenschätzer | stimmt |
| `qn_bp_glaeser_1` | 1,33 | DIN EN ISO 10 077-1 | stimmt |
| `qn_bp_holzprodukte_3` | 9,1; 13,3 | w = 5ql⁴/(384EI) | stimmt |
| `qn_bp_holzprodukte_4` | 69; 58 | W ∝ h², I ∝ h³ | stimmt |
| `qn_bp_innovationen_1` | 345; 125 | A = F/f | stimmt |
| `qn_bp_klebstoffe_3` | 35 | b = ΔL/ZGV + Toleranz | stimmt |
| `qn_bp_kunststoffe_1` | 38,4 | ΔL | stimmt |
| `qn_bp_kunststoffe_2` | 0,65 | Burgers | stimmt |
| `qn_bp_lehmbauprodukte_3` | 152 | DIN 18 940 (Modul) | stimmt |
| `qn_bp_mauerwerk_1` | 520 | DIN EN 1996-1-1 Gl. 3.1 | stimmt |
| `qn_bp_metallisch_1` | 36,5 | m = Vρ | stimmt |
| `qn_bp_mineralisch_3` | 589 | m_nass | stimmt |
| `qn_bp_trockenbau_2` | 126 | Bedarf | stimmt |
| `qn_bp_verkehr_bahn_4` | 75,6 | σ = EαΔT | stimmt |
| `qn_bp_verkehr_bahn_5` | 484 | N = σA | stimmt |
| `qn_bp_verkehr_betondecken_3` | 1,73 | Westergaard | stimmt |
| `qn_bp_verkehr_betondecken_5` | 4,5 | Modul | stimmt |
| `qn_bp_verkehr_pruefung_3` | 2,418 | Rohdichte | stimmt |
| `qn_bp_verkehr_pruefung_4` | 3,8 | Hohlraum | stimmt |
| `qn_bp_verkehr_tiefbau_3` | 8,1 | V = Q·t | stimmt |
| `qn_bp_verkehr_tiefbau_4` | 25,0 | Rigole | stimmt |
| `qn_bp_verkehr_tunnel_3` | 5,0 | Kesselformel | stimmt |
| `qn_bp_verkehr_tunnel_4` | 23 | Ausnutzung | stimmt |
| `qn_bruchmechanik_2` | 0,63; 1,19 | K_I = Yσ√(πa) | stimmt |
| `qn_bruchmechanik_3` | 36,5 | K_I = Yσ√(πa) | stimmt |
| `qn_dauerhaftigkeit_1` | 40 | EC2/NA | stimmt |
| `qn_denkmalpflege_1` | 36,6 | Correns | stimmt |
| `qn_denkmalpflege_2` | 0,52 | R-Bilanz | stimmt |
| `qn_dpp_1` | 335 | EN 15 804+A2 | stimmt |
| `qn_dpp_2` | 2750 | PENRT | stimmt |
| `qn_einheiten_2` | 45 | 1 kWh = 3,6 MJ | stimmt |
| `qn_energieausweis_1` | 94; 24 | GEG/GModG Anl. 10: C 75–100 | stimmt |
| `qn_energieausweis_2` | 0,33 | H_T′ = H_T/A | stimmt |
| `qn_erdbau_1` | 96,4 | D_Pr | stimmt |
| `qn_festbeton_statistik_4` | 21,8 | f_ck → f_cd | stimmt |
| `qn_festigkeit_1` | 680 | H = f/(ρg) | stimmt |
| `qn_festigkeit_2` | 3,5 | Reißlänge | stimmt |
| `qn_festigkeit_3` | 8494; 849 | N = f/(ρga) | stimmt |
| `qn_festigkeit_4` | 0,067 | Δa = σa/E | stimmt |
| `qn_festigkeit_5` | 4,7; 7,6 | Reißlänge | stimmt |
| `qn_festigkeit_mohr_2` | 22,5 | tan 2φ = 2τ/(σx − σy) | stimmt |
| `qn_feuchteschutz_2` | 86 | φ = p/p_sat | stimmt |
| `qn_feuchteschutz_3` | 4,25 | s_d = Σ μd | stimmt |
| `qn_formaenderungen_3` | 6,6 | σ = EαΔT | stimmt |
| `qn_formaenderungen_bl_4` | 19 | w ∝ 1/E | stimmt |
| `qn_formaenderungen_bl_5` | 16 | w ∝ L⁴ | stimmt |
| `qn_frischbeton_1` | 19,7 | Mischungsregel | stimmt |
| `qn_frischbeton_2` | 1,70 | DIN 18 218 F4 | stimmt |
| `qn_gesteine_1` | 3,94 | Körnungsziffer | stimmt |
| `qn_gips_1` | 12,28 | Bilanz | stimmt |
| `qn_glas_1` | 18,9 | σ = EαΔT | stimmt |
| `qn_glas_2` | 10,1 | h_ef ohne Schubverbund | stimmt |
| `qn_herstellung_einbau_2` | 24 | Bingham-Rohrströmung | stimmt |
| `qn_historische_bauweisen_1` | 34 | H = wL²/(8f) + PL/(4f) | stimmt |
| `qn_historische_bauweisen_2` | 9,8 | H = qa²/(8f) | stimmt |
| `qn_historische_bauweisen_3` | 5,8 | Δd | stimmt |
| `qn_holz_1` | 5,8 | Δb = q·Δu·b | stimmt |
| `qn_holzbau_bauphysik_4` | 8,2 | f₁ Einfeld | stimmt |
| `qn_holzbau_bemessung_6` | 34,6 | EC5 6.1.5 | stimmt |
| `qn_holzbau_verbindung_2` | 25,3 | EC5 Gl. 8.32 | stimmt |
| `qn_holzbau_verbindung_3` | 76,7 | EC5 Gl. 8.30 | stimmt |
| `qn_holzbau_verbindung_5` | 80 | EC5 Tab. 8.5 | stimmt |
| `qn_holzbau_verbindung_6` | 3,4 | EC5 8.2.2 / 8.7.1 | stimmt |
| `qn_holzkorrosion_3` | 9,2 | Einbringmenge | stimmt |
| `qn_holzwerkstoffe_1` | 10,4 | w_fin | stimmt |
| `qn_innenausbau_2` | 106 | Masse-Feder-Masse | stimmt |
| `qn_innovative_werkstoffe_1` | 0,58 | Fließgrenze | stimmt |
| `qn_instandhaltung_1` | 9,6 | I = A·i | stimmt |
| `qn_instandsetzung_materialien_1` | 54 | Duplex | stimmt |
| `qn_instandsetzung_materialien_2` | 77 | A_Rest/A_0 | stimmt |
| `qn_kalk_1` | 440 | Stöchiometrie | stimmt |
| `qn_keramik_ziegel_3` | 20 | offene Porosität | stimmt |
| `qn_keramik_ziegel_7` | 0,44 | Stöchiometrie | stimmt |
| `qn_ki_llmpraxis_3` | 0,972 | Binomial | stimmt |
| `qn_ki_lokal_1` | 21,4 | Speicher | stimmt |
| `qn_ki_prompting_2` | 0,18 | Tokenkosten | stimmt |
| `qn_ki_thesen_2` | 0,85 | R² | stimmt |
| `qn_knicken_1` | 1057 | Euler | stimmt |
| `qn_knicken_2` | 50 | Vergrößerungsfaktor 1/(1 − N/N_K) | stimmt |
| `qn_knicken_4` | 8 | F_K ∝ 1/β² | stimmt |
| `qn_korrosionsschutz_beschichtungen_2` | 20 | Schutzdauer | stimmt |
| `qn_korrosionsschutz_beschichtungen_7` | 6,0 | f = F/A | stimmt |
| `qn_kreislauf_dpp_1` | 0,70 | MCI | stimmt |
| `qn_kunststoffe_1` | 4,7 | L = ΔL/(αΔT) | stimmt |
| `qn_labor_1` | 1,43 | f = F/A | stimmt |
| `qn_labor_auslagerung_1` | 100 | Abtrag | stimmt |
| `qn_labor_auslagerung_5` | 33,0 | Oberfläche | stimmt |
| `qn_labor_druckfestigkeit_1` | 40,0 | f = F/A | stimmt |
| `qn_labor_druckfestigkeit_2` | 41,4 | DIN EN 12 390-3 Anh. | stimmt |
| `qn_labor_frischbeton_1` | 490 | DIN EN 12 350-5, F4 490–550 | stimmt |
| `qn_labor_frischbeton_2` | 2350 | DIN EN 12 350-6 | stimmt |
| `qn_labor_moertelprismen_1` | 7,5 | DIN EN 196-1 | stimmt |
| `qn_labor_moertelprismen_2` | 45,0 | DIN EN 196-1 | stimmt |
| `qn_labor_potentialmessung_1` | −369 | Bezugselektroden | stimmt |
| `qn_labor_potentialmessung_3` | 1,0 | Cl⁻/OH⁻ | stimmt |
| `qn_lca_ingenieurbau_2` | 5; 2; 3 | Modul (volle Intervalle) | stimmt |
| `qn_lca_ingenieurbau_3` | 184,7 | B8 | stimmt |
| `qn_lca_rechner_1` | 1,18 | Modul A–C je m²·a | stimmt |
| `qn_lca_rechner_4` | 21,5 | QNG | stimmt |
| `qn_lca_rechner_x_1` | 4,9 | A2 in t·km | stimmt |
| `qn_lca_regulatorik_2` | 11,25 | CRREM-Simulator | stimmt |
| `qn_lca_regulatorik_5` | 48 000 | CBAM Art. 9 | stimmt |
| `qn_lebensdauer_3` | 14,2 | fib MC 2010 | stimmt |
| `qn_lebensdauer_4` | 1,84 | fib Bulletin 34 | stimmt |
| `qn_lebenszyklus_kosten_1` | 9420 | Barwert | stimmt |
| `qn_lebenszyklus_kosten_2` | 4 | Austauschzyklen | stimmt |
| `qn_lebenszyklus_kosten_4` | 100 000 | Indexierung | stimmt |
| `qn_lehm_1` | 259 | Wasserbilanz | stimmt |
| `qn_materialmodelle_3` | 3,16 | Kelvin-Voigt | stimmt |
| `qn_materialoptimierung_3` | 4100 | GWP | stimmt |
| `qn_materialpaesse_1` | 88,4 | Recyclingquote | stimmt |
| `qn_materialpaesse_2` | 0,595 | MCI (EMF) | stimmt |
| `qn_materialpaesse_3` | 65; 23 | Modell Urban Mining Lab | stimmt |
| `qn_mauerwerk_1` | 0,62 | Modul | stimmt |
| `qn_mauerwerk_2` | 480 | Φ = 1 − 2e/t | stimmt |
| `qn_mechanische_kenngroessen_1` | 733 | EI | stimmt |
| `qn_mechanische_kenngroessen_3` | 8571; 1,05 | E_c,eff | stimmt |
| `qn_mechanische_kenngroessen_4` | 16; 30 | u_fin = u_inst(1 + k_def) | stimmt |
| `qn_mechanische_pruefungen_1` | 1,07 | k = R_m/R_e; B500A ≥ 1,05, B500B ≥ 1,08 | stimmt |
| `qn_membranen_etfe_1` | 1,2 | n = p·r | stimmt |
| `qn_messen_pruefen_1` | 0,67; 1,07 | DIN EN ISO 13 528 | stimmt |
| `qn_metalle_1` | 15,4 | ΔL | stimmt |
| `qn_metallkorrosion_2` | 29 | Schutzdauer | stimmt |
| `qn_mischungsberechnung_1` | 140 | Oberflächenwasser | stimmt |
| `qn_mischungsberechnung_2` | 0,54 | (w/z)_eq, f ≤ 0,33z | stimmt |
| `qn_mischungsberechnung_3` | 0,57 | Walz-Ansatz | stimmt |
| `qn_modernisierung_1` | 9,3 | R-Bilanz | stimmt |
| `qn_modernisierung_2` | 8,9 | statische Amortisation | stimmt |
| `qn_nachbehandlung_1` | 0,92 | Uno-Gleichung | stimmt |
| `qn_nawaro_1` | 1,47 | DIN EN 16 449 | stimmt |
| `qn_normen_ausblick_4` | 14 | x = XRC·√t | stimmt |
| `qn_oekobilanz_lca_g1` | 33 | GWP | stimmt |
| `qn_online_tools_2` | 16,1 | w = 5ql⁴/(384EI) | stimmt |
| `qn_online_tools_3` | 10,70 | Gl. 6.10 | stimmt |
| `qn_pfas_baustoffe_5` | 18 | Summe | stimmt |
| `qn_pfas_baustoffe_6` | 92; 112 | Schranken | stimmt |
| `qn_probenahme_1` | 1,7 | m = Vρ | stimmt |
| `qn_putzemoertel_1` | 80 | Bedarf | stimmt |
| `qn_px_bauleitung_2` | 564 | EC2 8.4.3 | stimmt |
| `qn_px_karriere_1` | 5184 | Lohnkosten | stimmt |
| `qn_px_produktion_1` | 0,66 | w/z | stimmt |
| `qn_rechnung_bestand_1` | 5,72 | Zuordnung Modul | stimmt |
| `qn_rechnung_bestand_2` | 365,2 | f_yd | stimmt |
| `qn_rechnung_bestand_3` | 38,5 | F = A·f_yd | stimmt |
| `qn_rechnung_bestand_6` | 60; 49 | F = A·f_yd | stimmt |
| `qn_rechnung_beton_1` | 291,7 | z = w/(w/z) | stimmt |
| `qn_rechnung_beton_2` | 1860 | Stoffraumrechnung | stimmt |
| `qn_rechnung_beton_3` | 0,513 | (w/z)_eq; DIN 1045-2 f ≤ 0,33z | stimmt |
| `qn_rechnung_beton_4` | 7,9 | Mischungsregel | stimmt |
| `qn_rechnung_beton_6` | 4,8; 15,1 | EC2 B.10, Gl. 3.2 | stimmt |
| `qn_rechnung_brandschutz_3` | 0,63 | EC5-1-2 | stimmt |
| `qn_rechnung_nachhaltigkeit_3` | 2,60 | Stöchiometrie | stimmt |
| `qn_rechnung_nachhaltigkeit_4` | 24,9; 58,5 | GWP | stimmt |
| `qn_rechnung_stahlbeton_1` | 17,0 | EC2/NA f_cd | stimmt |
| `qn_rechnung_stahlbeton_2` | 0,189 | μ_Ed | stimmt |
| `qn_rechnung_stahlbeton_3` | 6,54 | A_s = M/(f_yd z) | stimmt |
| `qn_rechnung_stahlbeton_5` | 90 | Auslastung | stimmt |
| `qn_ressourcen_umwelt_1` | 9,2 | DIN EN 16 449 | stimmt |
| `qn_ressourceneffizienz_2` | 1150 | Transport | stimmt |
| `qn_ressourceneffizienz_3` | 620 | Entsorgung | stimmt |
| `qn_rueckbau_1` | 97,7 | Massenanteil | stimmt |
| `qn_schadreaktionen_beton_1` | 3,6 | Alkalieintrag | stimmt |
| `qn_schallschutz_1` | 59,8 | DIN 4109-32 | stimmt |
| `qn_schallschutz_3` | 9 | DIN 4109-32 | stimmt |
| `qn_schallschutz_4` | 50,8 | DIN 4109-32 | stimmt |
| `qn_schnellkarbonatisierung_2` | 20 | √t-Gesetz | stimmt |
| `qn_schnellkarbonatisierung_4` | 2,2 | Konzentrationsumrechnung | stimmt |
| `qn_sichtbeton_2` | 0,72 | DBV-Merkblatt Sichtbeton | stimmt |
| `qn_sommerlicher_waermeschutz_2` | 0,038 | DIN 4108-2 S_vorh | stimmt |
| `qn_sonstiges_1` | 1920 | Q = m(cΔT + Δh) | stimmt |
| `qn_spannbeton_1` | 17 | Δσ = E·Δε | stimmt |
| `qn_spannbeton_2` | 1292 | EC2 5.10.3 | stimmt |
| `qn_spannbeton_3` | −8,6 | Spannungen | stimmt |
| `qn_spannbeton_5` | 4,4 | EC2 Gl. 5.45 | stimmt |
| `qn_spannbeton_6` | 29,3 | EC2 Gl. 5.44 | stimmt |
| `qn_stahlbau_ec3_3` | 212,5 | EC3 Gl. 6.7 | stimmt |
| `qn_stahlbau_ec3_7` | 53 | kern (Test) | stimmt |
| `qn_statistik_1` | 24,1 | DIN EN 1990 Anh. D | stimmt |
| `qn_statistik_2` | 2,32 | Grubbs (ISO 5725-2) | stimmt |
| `qn_statistik_3` | −7,5; 4,5; 0,5 | 2²-Versuchsplan | stimmt |
| `qn_weitere_organik_1` | 25 | Faktorenmethode ISO 15 686 | stimmt |
| `qz24_tritt_2` | 72,9 | DIN 4109-32 Gl. 23 | stimmt |
| `qz24_tritt_4` | 48,1 | DIN 4109-2 | stimmt |
| `qz24_ttest_1` | 0,89 | t-Test | stimmt |
