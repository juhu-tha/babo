# Quiz: Zweitprüfung Runde 4 (restliche offene Fragen) – Vorschlagsliste (ohne Freigabe)

- [ ] Sammelfreigabe Runde 4 (alle Zeilen ‚ok‘)

Stand: 29.10.2026 · Grundlage: `src/data/quiz.json` auf main (Stand 47385009) · Prüfschema wie Runde 2 und 3: Frage, Optionen, richtige Antwort, Erklärung, Rückmeldungen zu den Distraktoren und normRef gegen Modulinhalt, Rechenkerne und öffentliche Quellen geprüft. Rechenfragen mit eigenem Skript nachgerechnet, auch die Fehlerwege der Distraktoren. Geprüft wurden außerdem Normstand (Oktober 2026, NA DE) und Zahlformat (Tausendertrennung U+202F ab 5 Stellen).

In dieser Runde wurde **nichts freigegeben**: `verified` bleibt `false`, `reviewer`/`reviewedAt` sind nicht gesetzt. Die Sammelzeile oben gilt nur für die 62 Zeilen mit „ok“. Fragen mit „korrigiert“ haben unten eine eigene Checkbox. Für „Klärung“ und „hängt an Prüfbogen“ ist noch eine Entscheidung bzw. der Normtext nötig.

## Umfang

- Alle Fragen mit `verified !== true` in `src/data/quiz.json`: **74 von 1304**, wie im Audit.
- Öffentliche Quellen (nur Treffer aus der Websuche): dgnb.de (DGNB System Neubau 2023.2: Gewichtung, 28 Kriterien, Mindestanforderungen, Marktversion ab 01.10.2026), DIN Media (DIN 105-100:2012-01 zurückgezogen, ersetzt durch DIN 105-4:2019-01 und DIN 105-41:2019-01; DIN 4108-2:2026-05 ersetzt 2013-02, ohne öffentliche Änderungsliste), iTeh/CEN (EN 15978:2026, veröffentlicht 24.03.2026, mit optionalem Modul B8 „Nutzeraktivitäten“).
- Prüfbogen Normtext (Stand 28.10.2026): Unter den offenen Fragen hängt nur `q_prob_4` (T4-PN-2) an einer Normtextstelle. Die übrigen dort genannten Quizfragen `q_iax_3`, `qn_bp_verkehr_bitumen_6` und `qn_bp_verkehr_betondecken_5` sind bereits freigegeben und gehören nicht zum Umfang dieser Runde.

## Ergebnis

| ok | korrigiert | hängt an Prüfbogen | Klärung | gesamt |
|---:|---:|---:|---:|---:|
| 62 | 11 | 1 | 0 | 74 |

Korrekturen stehen in `src/data/quiz.json` (`vorpruefung.ergebnis` „korrigiert“, `vorpruefung.hinweis` „Zweitprüfung 29.10.: … – korrigiert“, `verified` bleibt `false`). Bei den ersten sieben Korrekturen ändern sich die richtige Antwort und die Optionen nicht. Nach der Entscheidung vom 29.10. zu den vier Klärungen wurde bei `qn_lca_ingenieurbau_1` und `qn_membranen_etfe_3` der Text der richtigen Option neu gefasst (Position unverändert), bei `_3` und `_5` nur Fragetext bzw. Erklärung.

## Prüftabelle

| ID | Modul | Ergebnis | Begründung |
|---|---|---|---|
| `qt_zfp_1` | Zerstörungsfreie Prüfung (ZfP) (`zfp`) | korrigiert | v = 300/√9 = 100 mm/ns, d = 100 · 2,0/2 = 100 mm (Skript, `georadar`). Rückmeldung zu 300 mm nannte „nicht halbiert“; 300 mm entsteht aber mit Halbierung und ohne √ε_r (ohne Halbierung 600 mm) → berichtigt. |
| `qt_zfp_2` | Zerstörungsfreie Prüfung (ZfP) (`zfp`) | ok | ρ = 2π · 0,05 · 1000 = 314 Ω·m; Stufen 100/500/1000 Ω·m wie `WENNER_GRENZEN_OHM_M` (RILEM TC 154-EMC). Distraktoren (ohne 2π, kΩ·cm, falsche Stufe) eindeutig falsch. |
| `qt_zfp_3` | Zerstörungsfreie Prüfung (ZfP) (`zfp`) | ok | −280 mV im Bereich −350 … −200 mV (ASTM C876, `potentialRisikoZfp`); Hinweis auf objektbezogene Auswertung nach DGZfP B 03 wie im Modul. |
| `qt_zfp_4` | Zerstörungsfreie Prüfung (ZfP) (`zfp`) | ok | Feuchtegrenzen > 85 % ungültig, > 70 % Faktor 2–5 wie `torrentFeuchte` und ZfP.json; Richtung des Feuchteeinflusses in allen Distraktoren eindeutig. |
| `qt_zfp_5` | Zerstörungsfreie Prüfung (ZfP) (`zfp`) | ok | Zuordnung B 01/B 02/B 03/B 09 und Ausgabe B 03 2025-05 wie DgzfpTab.json (Recherche 27.10.2026). |
| `q_daemm_1` | Dämmstoffe & Bauphysik (`bp_daemmung`) | korrigiert | Antwort XPS und EPS-Hinweis (W1-E, Bauartgenehmigung) wie Modul. Zahlenwert „Diffusionsaufnahme < 1,5 Vol.-%“ steht nicht im Modul und ist als Pauschalwert nicht belegt (produkt- und dickenabhängige Herstellerangabe) → in der Erklärung ohne Zahl. |
| `q_rsto_1` | Verkehrswegebau & RStO 12/24 (`bp_verkehr_rsto`) | ok | B als gewichtete äquivalente 10-t-Achsübergänge (RStO 12/24, Bk100 … Bk0,3); Lernhilfe (10/1)⁴ = 10 000 stimmt. |
| `q_dauer_2` | Typische Bauschäden & Schadensanalyse (`schadensbilder`) | ok | Lochfraß: örtliche Depassivierung durch Chlorid; Distraktoren (Flächenabtrag, pH < 9, H-Versprödung) eindeutig andere Mechanismen; Chlorid-Hinweis 0,5 M.-% / Cl 0,40 korrekt abgegrenzt. |
| `q_prob_4` | Probenahme & Erkundung (`probenahme`) | hängt an Prüfbogen T4-PN-2 | Verwerfungskriterium („> 20 % der Werte > 6 Einheiten vom Median“) ist die vorläufige Fassung vom 28.10.; Kennwert Median unstrittig. Freigabe nach Eintrag T4-PN-2 (DIN EN 12504-2:2021-10). |
| `q_boden_1` | Bodenmechanik (`bodenmechanik`) | ok | I_C = 20/25 = 0,80 → halbfest (DIN EN ISO 14688-2: 0,75–1,00); Distraktoren mit Rechenweg in den Rückmeldungen. |
| `q_we_4` | Thermische Eigenschaften & Dämmstoffe (`waermeeigenschaften`) | korrigiert | a = 2,0/(2400 · 1000) = 8,3 · 10⁻⁷ m²/s; Distraktoren ρ·c, λ/ρ, Metallwert. Zahlformat: „2 400“ (vierstellig, normales Leerzeichen) → 2400. |
| `q_ea_1` | Energieausweis (`energieausweis`) | ok | Effizienzklasse nach Endenergiekennwert, Anlage 10 (Lesefassung GModG 29.07.2026 im Modul); Grenzen A+ ≤ 30, A ≤ 50, B ≤ 75, C ≤ 100 kWh/(m²·a). |
| `q_ea_2` | Energieausweis (`energieausweis`) | ok | Verkündung 28.07.2026 (BGBl. 2026 I Nr. 226), Umbenennung GEG → GModG, Nummerierung §§ 15, 16, 79–88, Stichtag 31.12.2026 wie Modul und Vorprüfung; Distraktoren eindeutig falsch. |
| `q_zs_3` | Zertifizierung & Deklarationen (`zertifizierung_siegel`) | ok | Gewichtung ENV/ECO/SOC je 25 %, TEC/PRO je 10 %, SITE 5 %; 2023.2 Marktversion ab 01.10.2026 und 28 Kriterien auf dgnb.de bestätigt (Klärung Runde 3 erledigt). |
| `q_zs_5` | Zertifizierung & Deklarationen (`zertifizierung_siegel`) | ok | Mindestanforderungen ENV1.1, SOC1.2 (ohne Industrie/Gewerbe), SITE1.1 für alle Gebäude auf dgnb.de (Version 2023.2) bestätigt (Klärung Runde 3 erledigt). |
| `q_bst_3` | Altbauatlas (`bestand`) | ok | U = 1/(0,714 + 3,429) = 0,24 W/(m²K); Rückmeldungen nachgerechnet (16 cm → 0,19; ohne R_alt 0,29; 7,5 cm → 0,35). |
| `q_bst_5` | Altbauatlas (`bestand`) | korrigiert | f_Rsi = 16,5/25 = 0,66 < 0,70, Distraktoren nachgerechnet. Fragetext nennt jetzt die Ausgabe 2013-02 (Neuausgabe DIN 4108-2:2026-05 erschienen, Wert öffentlich nicht prüfbar); Erklärung: aus 0,70 folgen bei −5/20 °C 12,5 °C, 12,6 °C ist der Wert des 80-%-Kriteriums. |
| `qt_pruefverfahren_katalog_1` | Bauwerksdiagnose & ZfP (`pruefverfahren_katalog`) | ok | v_p = 4210 m/s, E_dyn = 38 GPa (Faktor 0,9); Distraktoren 43 GPa (ohne Querdehnung), 2105 m/s, 421 m/s nachgerechnet; Gefügestufen 3000/3800 m/s wie `ultraschall`. |
| `qt_pruefverfahren_katalog_2` | Bauwerksdiagnose & ZfP (`pruefverfahren_katalog`) | ok | d = 0,96 · 4000/19 200 = 0,20 m; 0,40 m (ohne Faktor 2), 0,208 m (ohne β) nachgerechnet. |
| `qt_pruefverfahren_katalog_3` | Bauwerksdiagnose & ZfP (`pruefverfahren_katalog`) | ok | f_ct = 3500/1963 = 1,78 N/mm²; Kleberbruch (Bruchbild Y nach DIN EN 1542) nur unterer Grenzwert wie `haftzug`; 0,45 N/mm² = Durchmesser als Radius. |
| `qt_pruefverfahren_katalog_4` | Bauwerksdiagnose & ZfP (`pruefverfahren_katalog`) | ok | Anhaltswert 0,5 M.-% (Stahlbeton), Spannstahl ab 0,2 M.-% wie `chlorid`; Erklärung kennzeichnet den Anhaltswert als objektspezifisch. |
| `qt_pruefverfahren_katalog_5` | Bauwerksdiagnose & ZfP (`pruefverfahren_katalog`) | ok | 275 000/7854 = 35,0 N/mm²; L/D = 1 ≙ Würfel 150 mm (DIN EN 13791:2020); 27,5 und 28,7 N/mm² nachgerechnet. Nicht betroffen von T12-F-2/-3 (k_n, M). |
| `q_hp_2` | Hist. Bauprodukte (`historische_bauprodukte`) | ok | TrinkwV 2023: Bleileitungen bis 12.01.2026 entfernen/stilllegen, Grenzwert Blei 10 → 5 µg/l ab 12.01.2028 (Vermerk Erstprüfung, Infoblatt Kreis Gütersloh) – Klärung Runde 3 erledigt. |
| `q_bm_2` | Boden- & Materialaufbereitung (`boden_materialaufbereitung`) | ok | LAGA PN 98 Tab. 3 im Modul: > 20 bis 50 mm → Einzelprobe 2 l, Laborprobe 4 l; Distraktoren den übrigen Stufen zugeordnet. |
| `q_sch_4` | Schad- und Gefahrstoffe (`schadstoffe`) | ok | AIR 2025 PCBges: RW I 80, RW II 800 ng/m³ (IFA/DGUV „air_pcb_2025“), 1200 > RW II; alte Werte 300/3000 ng/m³ als Distraktor gekennzeichnet; Module seit 28.10. auf AIR 2025. |
| `qn_altholz_urban_mining_6` | Altholz-NIR-Sortierung und Urban Mining (`altholz_urban_mining`) | ok | 1,25/58,25 = 2,1 %; Rechner `sortierbilanz` mit Standardwerten (15/45/15/25 t, 95/90/85/95 %): stoffliche Linie 58,25 t, Fehlsortierquote 8,75 %; 1,3 % und 5,0 % nachgerechnet. |
| `q_dc_3` | Checklisten (`dauerhaftigkeit_checklisten`) | ok | c_5% = 47 − 1,645 · 4,5 = 39,6 mm < c_min,dur 40 mm (XD1); 42,5/33,5 mm nachgerechnet. |
| `q_ms_sc_3` | Schadensaufnahme-Checklisten (`schaeden_checklisten`) | ok | u_m = 4,8/80,2 = 6,0 M.-%, DFG = 40 %; 38 % (Bezug Feuchtmasse) und 60 % nachgerechnet. |
| `q_ki_ub_5` | KI: Überblick & Grundlagen (`ki_ueberblick`) | ok | P = 0,90, R = 0,75, F1 = 0,818 → 0,82; Jaccard 45/65 = 0,69. |
| `q_px_pl_5` | Planung & Ausschreibung (`px_planung`) | ok | § 7 Abs. 1 Nr. 4 VOB/A (Abschnitt 1, 2019): Bedarfspositionen grundsätzlich nicht aufnehmen; Hinweis auf § 7 EU VOB/A 2026 wie Modul. |
| `q_px_pl_6` | Planung & Ausschreibung (`px_planung`) | ok | § 7 Abs. 1 Nr. 3 VOB/A: kein ungewöhnliches Wagnis; gilt ober- und unterhalb der Schwellenwerte. |
| `q_hyf_2` | Hydratation & Folgen (`hydratation_folgen`) | ok | 280 · 250/2400 = 29,2 K; Distraktoren 15 K (halbe Wärme), 58 K (500 kJ/kg), 70 K (÷ 1000) nachgerechnet; c·ρ wie Rechenkern. |
| `q_hyf_4` | Hydratation & Folgen (`hydratation_folgen`) | ok | 15 + 320 · 350/2400 = 61,7 ≈ 62 °C; 47 °C (ohne Frischbetontemperatur), 75 °C (60 K) nachgerechnet. |
| `q_inw_1` | Entwicklungen (`innovative_werkstoffe`) | ok | 2200 · 9,81 · 1,5/√3 = 18 691 Pa ≈ 19 kPa; 11/32/56 kPa nachgerechnet (Roussel 2018). |
| `q_bre_4` | Bauproduktenrecht (`bp_recht`) | ok | VO (EU) 2024/3110, Anhang IX: System 4 ohne notifizierte Stelle; Rollen in 1, 2+, 3 korrekt. |
| `q_vwb_6` | Verkehrswegebau (`bp_verkehrswegebau`) | ok | Q = 0,9 · 150 · 0,1 = 13,5 l/s; 135/1,35/15,0 l/s nachgerechnet; normRef DWA-A 138-1:2024-10. |
| `qn_lca_ingenieurbau_1` | LCA im Ingenieurbau (DIN EN 17472) (`lca_ingenieurbau`) | korrigiert (Klärung entschieden 29.10.: Vorschlag übernommen) | Die richtige Option begründet den Unterschied mit dem Nutzermodul B8. EN 15978:2026 (CEN, veröffentlicht 24.03.2026, ersetzt EN 15978:2011) kennt B8 „Nutzeraktivitäten“ ebenfalls (optional). B8 ist damit kein Alleinstellungsmerkmal mehr. Vorschlag: richtige Option auf „eigene funktionelle Einheiten wie 1 m² Brückendeckfläche; Betrachtungszeitraum bei Brücken meist 80 bis 100 Jahre“ umstellen, Distraktor 3 anpassen, Ausgabe DIN EN 15978:2012-10 nennen; Differenzierungsmatrix im Modul prüfen. |
| `qn_lca_ingenieurbau_3` | LCA im Ingenieurbau (DIN EN 17472) (`lca_ingenieurbau`) | korrigiert (Klärung entschieden 29.10.: Vorschlag übernommen) | Rechnung stimmt mit `IngenieurbauLCA.tsx`: 108 d · 1800 · 0,95 = 184,7 t, Distraktoren 461,7/64,6/30,8 t. Offen bleibt wie in Runde 3: Sperrungsbedingte Stauemissionen als B8 sind eine Modellannahme des Moduls („vorläufig, F-Freigabe“). Vorschlag: Fragetext „die im Simulator als B8 geführten Stauemissionen“; dann freigabefähig. |
| `qn_lca_ingenieurbau_5` | LCA im Ingenieurbau (DIN EN 17472) (`lca_ingenieurbau`) | korrigiert (Klärung entschieden 29.10.: Vorschlag übernommen) | Summen nachgerechnet (Spannbeton 863/743 t, Stahlverbund 825/687 t, B8-Anteil 185/863 = 21 %). Offen bleibt die B8-Modellannahme wie bei `_3`. Vorschlag: Erklärung „B8 ist im Simulator ein maßgeblicher Bilanzanteil“; dann freigabefähig. |
| `qn_lca_regulatorik_2` | Rechtsrahmen, CRREM & Praxis (`lca_regulatorik`) | ok | Zielpfad aus `Nachhaltigkeit.tsx` nachgerechnet: 45 · 0,25 = 11,25 > 10,0 (2035), Pfad 2033/2034 13,2/11,6; Distraktoren 2023 (43,6) und 2028 (Hülle, 26,0) stimmen mit dem Simulator. Klärung Runde 3 erledigt. |
| `qn_lca_regulatorik_3` | Rechtsrahmen, CRREM & Praxis (`lca_regulatorik`) | ok | Simulator nachgerechnet: Wohnen 30 → 2023, Opex 2026, Hülle 2028, Deep Capex 2036; Aussage „3–5 Jahre“ und „13 Jahre“ stimmen. Klärung Runde 3 erledigt. |
| `qn_lca_regulatorik_5` | Rechtsrahmen, CRREM & Praxis (`lca_regulatorik`) | ok | 1000 · 0,8 · (80 − 20) = 48 000 €; 64 000/80 000/16 000 € nachgerechnet; Art. 9, 21, 31 VO (EU) 2023/956, CBAM-Faktor 2026 97,5 %. |
| `qn_bodenmechanik_1` | Bodenmechanik (`bodenmechanik`) | ok | I_C = 16/26 = 0,62 → steif; 0,38 = Liquiditätszahl (10/26) nachgerechnet. |
| `qn_festigkeit_2` | Festigkeitsberechnungen (`festigkeit`) | ok | 14,5 · 10⁶/(420 · 9,81) = 3519 m; 35 km (ohne g), 5,1 km (f_c,0,k = 21) nachgerechnet; Kennwerte C24 wie kennwerte.ts. |
| `qn_mauerwerk_1` | Mauerwerk (`mauerwerk`) | ok | f_vk = 0,22 + 0,4 · 1,0 = 0,62 N/mm² < 0,065 · 20 = 1,30; f_vk0 = 0,22 (NM III) gehört nicht zu den vorläufigen Werten von #239-MW-1 (NM I, NM II, NM IIIa). |
| `qn_asphalt_1` | Asphalt & Bitumen (`asphalt`) | ok | ρ_m = 100/40,70 = 2,457, ρ_b = 2,359 g/cm³; 2,592 und 2,264 (Hohlraum zweifach als Faktor) nachgerechnet. |
| `qn_bp_verkehr_tiefbau_2` | Tiefbau & Entwässerung (`bp_verkehr_tiefbau`) | ok | Aufgaben Ableitung, Rückhaltung, Versickerung, Reinigung wie Modul; Distraktoren eindeutig falsch. |
| `qn_bp_verkehr_tiefbau_3` | Tiefbau & Entwässerung (`bp_verkehr_tiefbau`) | korrigiert | V = 450 · 200/10 000 · 900 = 8100 l = 8,1 m³; 9,0/0,135/81 m³ nachgerechnet. Zahlformat: „10 000“ in Erklärung und Lernhilfe mit normalem Leerzeichen → U+202F. |
| `qn_bp_verkehr_tiefbau_4` | Tiefbau & Entwässerung (`bp_verkehr_tiefbau`) | ok | 5,4/0,30/0,72 = 25,0 m; 7,5/7,9/2,25 m nachgerechnet; s_R wie Modultext. Nicht betroffen von #247-1 bis -4. |
| `qn_bp_verkehr_tiefbau_5` | Tiefbau & Entwässerung (`bp_verkehr_tiefbau`) | ok | s_R bis 0,95 (Sickerbox) gegenüber ≈ 0,30 (Kies) wie Modultext; Distraktoren eindeutig falsch. |
| `qn_bp_verkehr_tiefbau_6` | Tiefbau & Entwässerung (`bp_verkehr_tiefbau`) | korrigiert | ψ-Werte 0,90/0,75/0,50/0,30 wie Auswahl im Rigolenrechner. Rückmeldung nannte den Zuschlag „f_S“; Modul und DWA-A 138-1 verwenden den Zuschlagsfaktor f_Z → berichtigt (Wert von f_Z, #247-4, nicht berührt). |
| `qn_frischbeton_4` | Frischbeton (`frischbeton`) | korrigiert | Mindestwert 4,5 %, obere Grenze 8,5 %, Einzelwert bis 9,5 % (DIN EN 206, 5.4.3) – Antwort richtig. Lernhilfe sprach noch von „Richtwert + 4 %“ → an die Erklärung angeglichen. |
| `qn_holzbau_verbindung_6` | Verbindungen & Anschlüsse (`holzbau_verbindung`) | ok | F₁ = 7,78 kN, Johansen 1,70 kN, Seileffekt auf 100 % begrenzt → 3,4 kN; 3,8 kN (voller Seileffekt) nachgerechnet; M_y,Rk = 0,3 · 400 · d_ef^2,6 = 11 180 Nmm. F_ax,Rk ist vorgegeben und wegen der Begrenzung nicht maßgebend, daher unabhängig von T10-HV-2. |
| `qt_spannbeton_kennwerte_1` | Spannbeton (`spannbeton_kennwerte`) | ok | Gl. (3.29): 3,90 % · 1302 = 50,8 ≈ 51 N/mm²; 13 (1000 h), 163 (ρ₁₀₀₀ = 8 %), 247 N/mm² (Gl. 3.28) nachgerechnet. |
| `qt_spannbeton_kennwerte_2` | Spannbeton (`spannbeton_kennwerte`) | ok | DIN EN 447: Wasserabsondern ≤ 0,3 % (3 h), Volumenänderung −1 … +5 % (24 h), Fließzeit ≤ 25 s wie KennwerteEinpressmoertel.json. |
| `qn_lca_rechner_fe2` | LCA-Rechner & QNG-Nachweis (`lca_rechner`) | ok | 3,0 kg/m² · 5,0 · (1 + 1) = 30,0 kg CO₂-Äq./m²; 15,0/18,75/45 nachgerechnet, Regel n = ⌈T/ND⌉ − 1 wie Modultabelle. |
| `qn_kreislauf_dpp_2` | Kreislaufwirtschaft (`kreislauf_dpp`) | ok | Fügungsklassen als Simulator-Klassen gekennzeichnet („in Anlehnung an“ DIN SPEC 91484); Distraktoren (verklebt, Asbest, PCP-Verdacht) eindeutig schlechter. |
| `qt_bauwerksdiagnose_1` | Bauwerksdiagnose & ZfP (`bauwerksdiagnose`) | ok | Trockenes, tiefengestaffeltes Bohrmehl nach DIN EN 14629, Laboraufschluss Salpetersäure wie ProbenahmePlaner.json. |
| `qt_bauwerksdiagnose_2` | Bauwerksdiagnose & ZfP (`bauwerksdiagnose`) | ok | 26,5/0,85 = 31,2 → C30/37; 22,5 (multipliziert) und 36,7 (zweimal geteilt) nachgerechnet. Nicht betroffen von T12-F-2/-3. |
| `qn_instandhaltung_1` | Stahlbetoninstandhaltung (`instandhaltung`) | ok | 640 m² · 15 mA/m² = 9,6 A; 12,0/0,96/96 A nachgerechnet. |
| `qn_rechnung_mauerwerk_3` | Mauerwerk: Tragfähigkeit (`rechnung_mauerwerk`) | ok | Φ = 0,85 − 0,0011 · 15,714² = 0,578; 0,833/0,272/0,850 nachgerechnet. Φ₂ (Schlankheit), nicht Φ₁ aus #239-W-1. |
| `qn_rechnung_nachhaltigkeit_4` | Nachhaltigkeit & Dauerhaftigkeit (`rechnung_nachhaltigkeit`) | ok | 54,4 − 20,4 = 34,0 t = 62,5 %; 166,7 %, 35,2 t/64,7 %, 20,4 t nachgerechnet. |
| `qn_ki_system_1` | Systemarchitektur (`ki_system`) | ok | cos θ: A 0,707, B 0,816, C 0,500; Skalarprodukt C = 3 als Distraktor richtig erklärt. |
| `qn_oekobilanz_lca_fe1` | Ökobilanzierung (LCA): Grundlagen (`oekobilanz_lca`) | ok | Vergleich nur je funktioneller Einheit (1 m² Bauteil, gleicher U-Wert, Betrachtungszeitraum); Distraktoren eindeutig falsch. |
| `qn_keramik_ziegel_5` | Keramik und Ziegel (`keramik_ziegel`) | ok | DIN 20000-401 als Anwendungsnorm zu DIN EN 771-1. DIN 105-100:2012-01 laut DIN Media zurückgezogen, ersetzt durch DIN 105-4:2019-01 und DIN 105-41:2019-01 – Rückmeldung bestätigt, Klärung Runde 3 erledigt. |
| `qn_membranen_etfe_3` | Membranen und ETFE-Folien (`membranen_etfe`) | korrigiert (Klärung entschieden 29.10.: Vorschlag übernommen) | Klares ETFE ist hoch UV-durchlässig. Floatglas lässt UV-A aber ebenfalls teilweise durch; es sperrt vor allem UV-B. „Deutlich unterscheidet … UV-A weitgehend“ ist daher unscharf (Vermerk der Erstprüfung). Vorschlag: richtige Option „Sie lässt auch UV-B-Strahlung weitgehend durch“ bzw. „UV-Strahlung (UV-A und UV-B)“, Rückmeldung zu Distraktor 3 entsprechend. |
| `qn_sommerlicher_waermeschutz_1` | Sommerlicher Wärmeschutz (DIN 4108-2) (`sommerlicher_waermeschutz`) | ok | Frage nennt ausdrücklich DIN 4108-2:2013-02; § 14 GModG verweist auf genau diese Ausgabe (Modultext). S_vorh = Σ(A_w · g_tot)/A_G gegen S_zul (8.3) stimmt mit 2013-02. Neuausgabe 2026-05 berührt die Richtigkeit nicht (Klärung Runde 3 damit erledigt). |
| `qn_sommerlicher_waermeschutz_2` | Sommerlicher Wärmeschutz (DIN 4108-2) (`sommerlicher_waermeschutz`) | ok | 5 · 0,60 · 0,25/20 = 0,0375 → 0,038; 0,150/0,009/0,750 nachgerechnet. Ausgabe 2013-02 ausdrücklich genannt, nach § 14 GModG maßgebend. |
| `qn_sommerlicher_waermeschutz_3` | Sommerlicher Wärmeschutz (DIN 4108-2) (`sommerlicher_waermeschutz`) | ok | Erhöhte Nachtlüftung n ≥ 2 h⁻¹ geht in S1 (Tab. 8, 2013-02) ein; Ausgabe ausdrücklich genannt, nach § 14 GModG maßgebend. |
| `qn_sommerlicher_waermeschutz_4` | Sommerlicher Wärmeschutz (DIN 4108-2) (`sommerlicher_waermeschutz`) | ok | Bauart leicht < 50, mittel 50–130, schwer > 130 Wh/(m²K) nach 2013-02; Ausgabe ausdrücklich genannt. |
| `qn_sommerlicher_waermeschutz_5` | Sommerlicher Wärmeschutz (DIN 4108-2) (`sommerlicher_waermeschutz`) | ok | Bezugswerte A 25 °C, B 26 °C, C 27 °C nach 2013-02; Ausgabe ausdrücklich genannt. |
| `qn_sommerlicher_waermeschutz_6` | Sommerlicher Wärmeschutz (DIN 4108-2) (`sommerlicher_waermeschutz`) | ok | Verzicht nach 8.2.2 (2013-02): f_WG ≤ 35 %, OSW-Fenster außen F_C ≤ 0,30 (g > 0,40); 7-%-Grenze der Tab. 6 für geneigte Fenster richtig zugeordnet. |
| `qn_sommerlicher_waermeschutz_7` | Sommerlicher Wärmeschutz (DIN 4108-2) (`sommerlicher_waermeschutz`) | ok | Außenliegender Sonnenschutz F_C ≈ 0,25–0,35, innen ≈ 0,65–0,90 (Tab. 7, 2013-02); Distraktoren eindeutig falsch. |
| `qz24_atterberg_3` | Bodenmechanik (`bodenmechanik`) | ok | I_C = 12/20 = 0,60 → steif; 0,40 (Liquiditätszahl), 1,36 (w/w_P), 0,80 (w = 26 %) nachgerechnet. |

## Einzelfreigabe der korrigierten Fragen

- [ ] `qt_zfp_1` freigeben (korrigiert)
- [ ] `q_daemm_1` freigeben (korrigiert)
- [ ] `q_we_4` freigeben (korrigiert)
- [ ] `q_bst_5` freigeben (korrigiert)
- [ ] `qn_bp_verkehr_tiefbau_3` freigeben (korrigiert)
- [ ] `qn_bp_verkehr_tiefbau_6` freigeben (korrigiert)
- [ ] `qn_frischbeton_4` freigeben (korrigiert)
- [ ] `qn_lca_ingenieurbau_1` freigeben (korrigiert 29.10.)
- [ ] `qn_lca_ingenieurbau_3` freigeben (korrigiert 29.10.)
- [ ] `qn_lca_ingenieurbau_5` freigeben (korrigiert 29.10.)
- [ ] `qn_membranen_etfe_3` freigeben (korrigiert 29.10.)

## Offen

- **Klärung:** keine mehr – die vier Klärungen (`qn_lca_ingenieurbau_1`, `_3`, `_5`, `qn_membranen_etfe_3`) wurden am 29.10. wie vorgeschlagen entschieden und korrigiert.
- **Hängt an Prüfbogen:** `q_prob_4` → T4-PN-2 (DIN EN 12504-2:2021-10, Verwerfen der Messreihe).
