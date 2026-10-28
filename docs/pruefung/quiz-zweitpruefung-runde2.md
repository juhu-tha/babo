# Quiz: Zweitprüfung Runde 2 – Vorschlagsliste (ohne Freigabe)

Stand: 27.10.2026 · Grundlage: `src/data/quiz.json` auf main (Stand 9f67cda3) · Prüfschema wie Zweitprüfung 27.10. (Frage, Optionen, richtige Antwort, Erklärung und normRef gegen Modulinhalt, Rechenkerne, Kennwerte und öffentliche Quellen; Rechenfragen nachgerechnet; Distraktoren, Längen- und Formulierungshinweise, Zahlformat).

**Wichtig:** In dieser Runde wurde **nichts freigegeben** (`verified` bleibt `false`, kein `reviewer`/`reviewedAt`). Die Liste ist ein Vorschlag; freigegeben wird erst nach Bestätigung durch Ankreuzen.

## Umfang

- **Teil A (48 Fragen):** alle nicht freigegebenen Fragen mit Vorprüfung „korrigiert“ und Hinweis „Zweitprüfung 27.10.“, alle seit 27.10. neuen, nicht freigegebenen Fragen (qn_formaenderungen_bl_1/2/4, qn_lebensdauer_1–6) sowie qn_statistik_2 und q_dauer_2.
- **Teil B (196 weitere Fragen):** je Quiz-Modul ohne eine einzige freigegebene Frage (35 Module) 6 Fragen bzw. alle, wenn weniger; Auswahl deterministisch nach FNV-1a-Hash der ID (`fnv1a` aus `scripts/pruefliste.ts`). 14 der so gezogenen Fragen gehören bereits zu Teil A.
- **Geprüft gesamt:** 244 Fragen in 63 Modulen.

## Ergebnis

| ok | korrigiert | Klärung |
|---:|---:|---:|
| 242 | 1 | 1 |

Korrekturen sind in `src/data/quiz.json` eingetragen (`vorpruefung.hinweis` „Zweitprüfung 27.10. (Runde 2): … – korrigiert“). Spalte „Teil“: A = Pflichtumfang, B = Stichprobe aus Modulen ohne Freigabe.

## Kunststoffe im Bauwesen (`bp_kunststoffe`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_kunststoff_1` | A | Welches Merkmal kennzeichnet Duroplaste (z. B. Epoxid- oder UP-Harze) im Vergle… | ok | - [ ] freigeben |

## Typische Bauschäden & Schadensanalyse (`schadensbilder`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_dauer_2` | A | Was kennzeichnet die gefürchtete Lochfraßkorrosion (Pitting) an Bewehrungsstahl… | korrigiert: richtige Option war deutlich länger (Verhältnis 2,5); Distraktor „ausschließlich bei Minustemperaturen im Vakuum“ (Absolutwort, unplausibel) durch Depassivierung infolge Karbonatisierung ersetzt; Optionen angeglichen, Rückmeldungen angepasst | - [ ] freigeben |

## Digitaler Produktpass (DPP) (`dpp`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_dpp_1` | A | Welche zentrale Aufgabe erfüllt der Digitale Produktpass (DPP) im Lebenszyklus… | ok | - [ ] freigeben |

## Daten & Regeln (`nachhaltigkeit_daten_regeln`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ndr_2` | A | Wie ist der Rechtsstand des „Gebäudetyp E“ im Oktober 2026? | ok (Rechtsstand nach Referentenentwurf 26.10.2026, Quelle docs/fachklaerung-2026-10-26.md; bei Kabinettsbeschluss neu fassen) | - [ ] freigeben |
| `q_ndr_4` | B | Für einen Neubau liegt die NZEB-Anforderung bei 50 kWh/(m²a) Primärenergie, gep… | ok | - [ ] freigeben |
| `q_ndr_5` | B | Welche Lebenszyklusmodule muss eine EPD nach DIN EN 15804+A2 im Regelfall minde… | ok | - [ ] freigeben |
| `q_ndr_6` | B | Ein Wohngebäude in EH 40 mit Wärmepumpe erreicht GWP = 22,8 kg CO₂-Äq./(m² NRF·… | ok | - [ ] freigeben |
| `q_ndr_7` | B | Ab wann müssen neue Gebäude nach der EPBD (EU) 2024/1275 als Nullemissionsgebäu… | ok | - [ ] freigeben |
| `q_ndr_1` | B | Ab wann muss nach der EPBD-Neufassung das Lebenszyklus-GWP für alle neuen Gebäu… | ok | - [ ] freigeben |

## Produktherstellung & QS (`px_produktion`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_px_pr_2` | A | Erstherstellung C30/37, drei Würfel: 41, 39, 43 N/mm². Sind die Konformitätskri… | ok | - [ ] freigeben |
| `q_px_pr_1` | B | 1 000 kg Sand (trocken) haben 4 % Oberflächenfeuchte. Wie viel Wasser ist von 1… | ok | - [ ] freigeben |
| `qn_px_produktion_1` | B | Eine Rezeptur sieht 320 kg/m³ Zement, 170 kg/m³ Wasser und 800 kg/m³ Sand (troc… | ok | - [ ] freigeben |
| `qn_px_produktion_2` | B | Bei der Erstherstellung eines C25/30 ergeben drei Würfel nach 28 Tagen 30, 32 u… | ok | - [ ] freigeben |
| `qn_px_produktion_3` | B | Bei wärmebehandelten Fertigteilen treten nach einigen Jahren im Außenbereich Tr… | ok | - [ ] freigeben |
| `qn_px_produktion_4` | B | Wie hängen werkseigene Produktionskontrolle (WPK), Leistungserklärung (DoP) und… | ok | - [ ] freigeben |

## Karrierestart & Soft Skills (`px_karriere`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_px_ka_1` | A | Wofür wird der E-Schein (erweiterte betontechnologische Kenntnisse) nach DIN 10… | ok | - [ ] freigeben |
| `qn_px_karriere_2` | A | Für welches Tätigkeitsfeld ist nach dem Modul der SIVV-Schein die maßgebende Zu… | ok | - [ ] freigeben |

## Herstellung & Einbau (`herstellung_einbau`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_hee_1` | A | Steifer Beton wird mit einem Fahrzeug ohne Rührwerk angeliefert. Bis wann soll… | ok | - [ ] freigeben |

## Qualitätssicherung (`qualitaetssicherung`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_qsi_4` | A | Welche Betonbauqualitätsklassen kennt DIN 1045-1000? | ok | - [ ] freigeben |

## Betonpraxis (`betonpraxis`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bpx_4` | A | Der Beton ist auf der Baustelle zu steif. Was ist zulässig? | ok | - [ ] freigeben |

## Gesteine (`gesteine`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ges_4` | A | Bis zu welcher oberen Siebgröße D spricht man nach DIN EN 12620 von feiner Gest… | ok | - [ ] freigeben |

## Mauerwerk (`mauerwerk`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_mwk_1` | A | Wovon hängt die charakteristische Mauerwerksdruckfestigkeit f_k bei Normalmörte… | ok | - [ ] freigeben |

## Metalle (`metalle`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_met_3` | A | Welches Metall hat die größte Wärmedehnung? | ok | - [ ] freigeben |

## Holzwerkstoffe (`holzwerkstoffe`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_hwk_1` | A | Welche der genannten OSB-Klassen ist nach DIN EN 300 für tragende Zwecke im Feu… | ok | - [ ] freigeben |

## Kunststoffe (`kunststoffe`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_kun_3` | A | Welche Kunststoffgruppe ist schmelzbar und schweißbar? | ok | - [ ] freigeben |

## Innovationen & F&E (`bp_innovationen`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bin_1` | A | Welcher TRL-Stufe entspricht der Einbau eines neuen Baustoffs in ein Pilotgebäu… | ok | - [ ] freigeben |
| `q_bin_2` | A | Wofür wird eine allgemeine Bauartgenehmigung (aBG) erteilt? | ok | - [ ] freigeben |

## Bauproduktenrecht (`bp_recht`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bre_1` | A | Was bestätigt das CE-Kennzeichen auf einem Bauprodukt? | ok | - [ ] freigeben |

## Mauerwerk (Bauprodukte) (`bp_mauerwerk`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bmw_1` | A | Welche Exponenten empfiehlt DIN EN 1996-1-1 (ohne NA DE) in f_k = K · f_b^α · f… | ok | - [ ] freigeben |

## Innenausbau (`innenausbau`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_iax_1` | A | Mit welchem Verfahren wird die Belegreife von Estrichen in Deutschland üblicher… | ok | - [ ] freigeben |
| `q_iax_3` | A | Welcher Wassereinwirkungsklasse ist die Bodenfläche einer bodengleichen Dusche… | ok | - [ ] freigeben |

## LCA im Ingenieurbau (DIN EN 17472) (`lca_ingenieurbau`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_lca_ingenieurbau_4` | A | Bei 1500 m² Deckfläche und 100 Jahren liefert der Simulator für die Module A–C:… | ok (alle Zahlen mit dem Simulator nachgerechnet: 863,4 t / 824,6 t; 5,76 / 5,50 kg/(m²·a)) | - [ ] freigeben |

## Statistik (`statistik`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_statistik_2` | A | Eine Prüfserie mit n = 8 Würfeln hat x̄ = 31,4 N/mm² und s = 1,9 N/mm². Der kle… | ok | - [ ] freigeben |

## Festbeton (Statistik) (`festbeton_statistik`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_festbeton_statistik_3` | A | C30/37 aus stetiger Herstellung: 15 Würfelergebnisse mit Mittelwert 42,0 N/mm²,… | ok | - [ ] freigeben |

## Mechan. Kenngrößen (`mechanische_kenngroessen`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_mechanische_kenngroessen_3` | A | Eine Betonstütze (E_cm = 30 000 MPa) steht unter der Dauerdruckspannung σ = 9 N… | ok | - [ ] freigeben |

## Bauphysik (Wärme & Akustik) (`bauphysik`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bauphysik_1` | A | Eine Außenwand besteht aus 20 cm Stahlbeton (λ = 2,0 W/(m·K)) und 12 cm EPS (λ… | ok | - [ ] freigeben |

## Energieausweis (`energieausweis`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_energieausweis_1` | A | Ein Wohngebäude hat einen Wärmebedarf (Heizung, Warmwasser, Verluste) von 80 kW… | ok | - [ ] freigeben |

## Ausbau & Abdichtung (`ausbau`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_ausbau_3` | A | Für eine frostbeanspruchte Außentreppe wird ein keramischer Belag mit Kleber ge… | ok | - [ ] freigeben |
| `qn_ausbau_2` | B | Warum ist eine Silikatfarbe für eine Holzverschalung ungeeignet? | ok | - [ ] freigeben |
| `qn_ausbau_1` | B | Ein Zement-Heizestrichfeld (L₀ = 6 m, α_T = 12 · 10⁻⁶ 1/K) wird um 25 K aufgehe… | ok | - [ ] freigeben |
| `q_aus_1` | B | Welcher Estrich ist für dauerhaft feuchte Bereiche (z. B. Nassräume ohne Abdich… | ok | - [ ] freigeben |
| `q_aus_3` | B | Welche Haftzugfestigkeit muss ein zementärer Fliesenkleber der Klasse C2 mindes… | ok | - [ ] freigeben |
| `q_aus_2` | B | Welche Wasseraufnahme kennzeichnet Feinsteinzeug? | ok | - [ ] freigeben |

## Asphaltsorten (`bp_verkehr_asphalt`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_bp_verkehr_asphalt_4` | A | Welche Asphaltsorte hat nach dem Modul den höchsten Bindemittelgehalt? | ok | - [ ] freigeben |

## Mischungsberechnung (`mischungsberechnung`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_mischungsberechnung_4` | A | Ein Gemisch mit D_max = 16 mm hat die Durchgänge 45 % bei 4 mm und 65 % bei 8 m… | ok | - [ ] freigeben |

## Hist. Bauprodukte (`historische_bauprodukte`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_historische_bauprodukte_3` | A | In einem Gebäude von 1965 liegt unter dem Parkett ein schwarzer, pechartiger Kl… | ok | - [ ] freigeben |

## Mauerwerk: Tragfähigkeit (`rechnung_mauerwerk`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_rechnung_mauerwerk_2` | A | Eine zweiseitig gehaltene Wand mit h_ef = 2,75 m hat eine Dicke von 17,5 cm. We… | ok | - [ ] freigeben |
| `qn_rechnung_mauerwerk_5` | A | Eine 11,5 cm dicke KS-Innenwand (f_k = 5,6 N/mm², Decke voll aufliegend) mit li… | ok (Φ₂ = 0,244, N_Rd = 88,9 kN/m, η = 1,35 nachgerechnet) | - [ ] freigeben |

## Bauakustik: Schallschutz (`rechnung_schallschutz`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_rechnung_schallschutz_2` | A | Welches Direktschalldämm-Maß R_w liefert die Massekurve des Moduls (DIN 4109-32… | ok | - [ ] freigeben |
| `qn_rechnung_schallschutz_3` | A | Eine Wohnungstrennwand aus Hochlochziegeln (24 cm, ρ = 1 200 kg/m³) erhält beid… | ok | - [ ] freigeben |
| `qn_rechnung_schallschutz_4` | A | Eine Wohnungstrennwand aus Porenbeton (24 cm, ρ = 500 kg/m³, Putz 40 kg/m², lei… | ok | - [ ] freigeben |
| `qn_rechnung_schallschutz_5` | A | Um wie viel steigt R_w nach der Massekurve des Moduls (DIN 4109-32: R_w = 30,9… | ok | - [ ] freigeben |
| `qn_rechnung_schallschutz_6` | B | Warum ist das Bauschalldämm-Maß R′_w im Gebäude kleiner als das Direktschalldäm… | ok | - [ ] freigeben |
| `qn_rechnung_schallschutz_1` | B | Eine Kalksandsteinwand ist 17,5 cm dick (ρ = 2 000 kg/m³) und beidseitig verput… | ok | - [ ] freigeben |

## Bauleitung & Baustelle (`px_bauleitung`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_px_bauleitung_3` | A | Welche Zuordnung von Anlass und Instrument nach VOB/B ist richtig? | ok | - [ ] freigeben |

## Handout 4-Wochen-Auslagerungsversuch (`labor_auslagerung`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_labor_auslagerung_1` | A | Eine Stahlprobe (A = 40 cm², ρ = 7,85 g/cm³) verliert in 28 Tagen 0,24 g (blind… | ok | - [ ] freigeben |
| `qn_labor_auslagerung_6` | B | Warum überschätzt die Hochrechnung eines kurzen Auslagerungsversuchs auf ein Ja… | ok | - [ ] freigeben |
| `qn_labor_auslagerung_5` | B | Wie groß ist die Oberfläche eines Stahlstabs mit d = 10 mm und l = 100 mm einsc… | ok | - [ ] freigeben |
| `qn_labor_auslagerung_4` | B | Drei Proben in NaCl-Lösung ergeben rund 100 µm/a, drei Proben in chloridfreier… | ok | - [ ] freigeben |
| `qn_labor_auslagerung_3` | B | Die Proben in chloridhaltiger Lösung zeigen Lochfraß. Wie ist die gravimetrisch… | ok | - [ ] freigeben |
| `qn_labor_auslagerung_2` | B | Wozu wird beim Beizen eine nicht ausgelagerte Blindprobe mitbehandelt? | ok | - [ ] freigeben |

## Formänderungen (`formaenderungen`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_formaenderungen_bl_1` | A | Ein Einfeldträger mit L = 4,0 m und E·I = 10 000 kNm² trägt eine Gleichlast q =… | ok | - [ ] freigeben |
| `qn_formaenderungen_bl_2` | A | Ein Kragarm (L = 2,0 m, E·I = 4 000 kNm²) trägt am freien Ende F = 12 kN. Wie g… | ok | - [ ] freigeben |
| `qn_formaenderungen_bl_4` | A | Zwei Balken mit gleichem Querschnitt und gleicher Last: einer aus Baustahl (E =… | ok | - [ ] freigeben |

## Lebensdauerbemessung (fib Bulletin 34) (`lebensdauerbemessung`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_lebensdauer_1` | A | Welchen Zielwert des Zuverlässigkeitsindex empfiehlt fib Bulletin 34 für den Gr… | ok | - [ ] freigeben |
| `qn_lebensdauer_2` | A | Warum gilt die Depassivierung der Bewehrung als Grenzzustand der Gebrauchstaugl… | ok | - [ ] freigeben |
| `qn_lebensdauer_3` | A | Im ACC-Test (2 Vol.-% CO₂, 28 d) wird x_c = 5,0 mm gemessen. Welcher inverse Ka… | ok | - [ ] freigeben |
| `qn_lebensdauer_4` | A | Für einen CEM III/B gelten nach 50 Jahren k_e = 0,566, D_RCM,0 = 59,9 mm²/a, k_… | ok (= Modul Beispiel 2, nachgerechnet) | - [ ] freigeben |
| `qn_lebensdauer_5` | A | Im Parkdeck-Beispiel liegt der Chloridgehalt an der Bewehrung im Mittel bei 0,1… | ok | - [ ] freigeben |
| `qn_lebensdauer_6` | A | Für ein Parkdeck XD3 mit CEM I (w/z = 0,45) ergibt die Simulation eine erforder… | ok (129 mm bzw. 55,8 mm = Modul/tests/lebensdauer.test.ts) | - [ ] freigeben |

## Baustatik (`baustatik`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bstat_1` | B | Ein Einfeldträger (l = 6 m) trägt q = 10 kN/m. Wie groß ist das maximale Feldmo… | ok | - [ ] freigeben |
| `q_bstat_2` | B | Ein symmetrischer Zweifeldträger (zwei Felder je l, EI konstant) trägt die Glei… | ok | - [ ] freigeben |
| `qn_baustatik_1` | B | Welche Lagerung ergibt einen statisch bestimmt gelagerten Einfeldträger in der… | ok | - [ ] freigeben |
| `qn_baustatik_2` | B | Ein Kragarm (l = 3 m, links eingespannt) trägt die Gleichlast q = 8 kN/m und am… | ok | - [ ] freigeben |
| `qn_baustatik_3` | B | Ein Einfeldträger (l = 6 m) trägt nur eine Einzellast F = 60 kN im Abstand a =… | ok | - [ ] freigeben |
| `qn_baustatik_4` | B | Ein Träger über 10 m mit q = 20 kN/m wird in Feldmitte durch ein zusätzliches A… | ok | - [ ] freigeben |

## Historische Kennwerte (`historisch`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_hk_5` | B | Warum sind bei glattem Betonstahl der Gruppe I (BSt 22/34) Endhaken an den Stab… | ok | - [ ] freigeben |
| `q_hk_4` | B | Was kennzeichnet Schmiedeeisen bzw. Puddelstahl aus dem 19. Jahrhundert? | ok | - [ ] freigeben |
| `q_hk_6` | B | Welche Abmessungen hat ein Mauerziegel im Reichsformat (RF), das ab 1872 verein… | ok | - [ ] freigeben |
| `q_hk_1` | B | Welche Streckgrenze ist für "Betonstahl III" (BSt 420/500) in der Nachrechnung… | ok | - [ ] freigeben |
| `q_hk_3` | B | Eine gusseiserne Stütze von 1890 soll nachgerechnet werden. Welche Werkstoffeig… | ok | - [ ] freigeben |
| `q_hk_2` | B | Wie wirkt sich ein kleiner gemessener Variationskoeffizient der Betonfestigkeit… | ok | - [ ] freigeben |

## Abfälle & Altlasten (`abfaelle`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ab_3` | B | Welche Stufe folgt in der fünfstufigen Abfallhierarchie nach § 6 KrWG direkt au… | ok | - [ ] freigeben |
| `q_ab_2` | B | Wann ist der Einbau von RC-3 nach § 22 EBV anzuzeigen? | ok | - [ ] freigeben |
| `q_ab_1` | B | Ein Bauschutt hält alle DK-0-Werte ein, nur Sulfat im Eluat liegt bei 1 450 mg/… | ok | - [ ] freigeben |
| `q_ab_7` | B | Ein Abbruchunternehmen will asbesthaltige Platten mit unbelastetem Bauschutt mi… | ok | - [ ] freigeben |
| `q_ab_6` | B | Worin unterscheiden sich Altstandorte und Altablagerungen nach § 2 Abs. 5 BBodS… | ok | - [ ] freigeben |
| `q_ab_5` | B | Beim Rückbau fallen ausgebaute Bahnschwellen und kesseldruckimprägnierte Zaunpf… | ok | - [ ] freigeben |

## Weitere Organik (`weitere_organik`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_wo_1` | B | Um welchen Faktor beschleunigt sich eine Alterungsreaktion mit E_A = 80 kJ/mol,… | ok | - [ ] freigeben |
| `q_wo_2` | B | Wofür steht die Faktorenmethode nach ISO 15686-1? | ok | - [ ] freigeben |
| `qn_weitere_organik_4` | B | Eine dunkle, unbekieste Bitumendachbahn erreicht im Sommer über 70 °C. Welche M… | ok | - [ ] freigeben |
| `qn_weitere_organik_3` | B | Eine Weich-PVC-Dachbahn, direkt auf EPS-Dämmung verlegt, ist nach einigen Jahre… | ok | - [ ] freigeben |
| `qn_weitere_organik_2` | B | Was geschieht bei der Oxidationsalterung von Bitumen nach dem kolloidalen Model… | ok | - [ ] freigeben |
| `qn_weitere_organik_1` | B | Eine Kunststoff-Dichtungsbahn hat RSL = 30 a. Die Faktoren betragen B = 0,9, C… | ok | - [ ] freigeben |

## Recht & Grundlagen (`bauschaeden`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ms_bs_6` | B | Feuchteschäden zeigen sich kurz vor Ablauf der Verjährung; der Unternehmer best… | ok | - [ ] freigeben |
| `q_ms_bs_4` | B | Wie muss ein Auftragnehmer nach § 4 Abs. 3 VOB/B Bedenken gegen die vorgesehene… | ok | - [ ] freigeben |
| `q_ms_bs_5` | B | Welche Reihenfolge beschreibt die drei Technikstufen im Baurecht von „bewährt u… | ok | - [ ] freigeben |
| `q_ms_bs_2` | B | Was ändert sich mit der Abnahme hinsichtlich der Beweislast für Mängel? | ok | - [ ] freigeben |
| `q_ms_bs_3` | B | Ein Unternehmer hat eine Heizungsanlage exakt nach Leistungsverzeichnis und ane… | ok | - [ ] freigeben |
| `q_ms_bs_1` | B | Wie lange verjähren Mängelansprüche bei einem Bauwerk ohne abweichende Vereinba… | ok | - [ ] freigeben |

## Schutz- & Instands.-Grundlagen (`schutz_grundlagen`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_is_sg_1` | B | Welches Prinzip nach DIN EN 1504-9 beschreibt den kathodischen Korrosionsschutz? | ok | - [ ] freigeben |
| `q_is_sg_3` | B | Ein Schutzdetail kostet in der Planung 2 000 €. Was kostet es nach der De-Sitte… | ok | - [ ] freigeben |
| `q_is_sg_2` | B | Welche CO₂-diffusionsäquivalente Luftschichtdicke gilt als Anforderung an eine… | ok | - [ ] freigeben |
| `q_is_sg_5` | B | Wie wirkt eine hydrophobierende Imprägnierung mit Silan oder Siloxan auf Beton? | ok | - [ ] freigeben |
| `q_is_sg_4` | B | Was kennzeichnet die Einleitungsphase im Lebensdauermodell nach Tuutti? | ok | - [ ] freigeben |
| `q_is_sg_6` | B | Warum ist der kathodische Korrosionsschutz bei Spannbeton mit hochfesten Spanns… | ok | - [ ] freigeben |

## Online-Tools & Rechner (`online_tools`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_online_tools_4` | B | Für einen Einfeldträger (L = 5,0 m, q_Ed = 5,0 kN/m) ergibt die Handrechnung M_… | ok | - [ ] freigeben |
| `qn_online_tools_1` | B | Für einen Fensteranschluss soll der längenbezogene Wärmedurchgangskoeffizient ψ… | ok | - [ ] freigeben |
| `qn_online_tools_3` | B | Eine Stahlbetondecke ist 18 cm dick (25 kN/m³) und hat 1,2 kN/m² Ausbaulast; di… | ok | - [ ] freigeben |
| `qn_online_tools_2` | B | Ein Holzbalken C24 (b/h = 120/240 mm, E_0,mean = 11 000 N/mm²) überspannt L = 5… | ok | - [ ] freigeben |
| `q_dg_ot_2` | B | Was passiert, wenn man in ein Tool, das die Kombination selbst bildet, bereits… | ok | - [ ] freigeben |
| `q_dg_ot_1` | B | Welches Biegemoment hat ein Einfeldträger mit L = 5,0 m und q_Ed = 5,0 kN/m? | ok | - [ ] freigeben |

## LLM-Praxis (`ki_llmpraxis`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_ki_llmpraxis_4` | B | Ein Bauleiter muss klären, ob für ein Abdichtungsprodukt aktuell eine gültige a… | ok | - [ ] freigeben |
| `qn_ki_llmpraxis_1` | B | Welche Beschreibung passt nach dem Modul zu einem MCP-Konnektor? | ok | - [ ] freigeben |
| `qn_ki_llmpraxis_3` | B | Drei unabhängige Abfragen liefern jeweils mit p = 0,9 das richtige Ergebnis. Mi… | ok | - [ ] freigeben |
| `qn_ki_llmpraxis_2` | B | Der Token-Kostenrechner schätzt für 35 Seiten als PDF-Scan 100 800 Token und al… | ok | - [ ] freigeben |
| `q_ki_lp_2` | B | Warum erhöht ein Mehrheitsentscheid aus drei Abfragen desselben Modells die Zuv… | ok | - [ ] freigeben |
| `q_ki_lp_1` | B | In einer Stichprobe sind 6 von 50 KI-gelieferten Normzitaten falsch. Was folgt… | ok | - [ ] freigeben |

## KI: Unabhängige KI-Seiten (`ki_ressourcen`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ki_rs_6` | B | Ein Modell löst 50 % von 400 Testaufgaben. Wie groß ist etwa die halbe Breite d… | ok | - [ ] freigeben |
| `q_ki_rs_4` | B | Die Rechnung „Leistung · Zeit · Emissionsfaktor“ für eine KI-Auswertung ist unv… | ok | - [ ] freigeben |
| `q_ki_rs_5` | B | Wie sollten Ranglisten unabhängiger KI-Vergleichsseiten bei der Werkzeugwahl fü… | ok | - [ ] freigeben |
| `q_ki_rs_2` | B | Eine Grafikkarte mit 350 W rechnet 30 min. Wie viel Energie wird verbraucht? | ok | - [ ] freigeben |
| `q_ki_rs_3` | B | Eine lokale Auswertung braucht 0,175 kWh. Welche Emissionen ergeben sich mit de… | ok | - [ ] freigeben |
| `q_ki_rs_1` | B | Modell A erreicht 78 %, Modell B 74 % bei 200 Aufgaben. Ist A sicher besser? | ok | - [ ] freigeben |

## KI: Onlinekurse (`ki_onlinekurse`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ki_ok_5` | B | L(w) = (w − 3)², Startwert w = 5, Lernrate η = 0,25. Welchen Wert hat w nach ei… | ok | - [ ] freigeben |
| `q_ki_ok_4` | B | Ein Kurs mit 20 h Video und Übungsfaktor 1,5 soll anerkannt werden. Wie viele E… | ok | - [ ] freigeben |
| `q_ki_ok_6` | B | Während des Trainings sinkt der Trainingsfehler weiter, der Validierungsfehler… | ok | - [ ] freigeben |
| `q_ki_ok_1` | B | L(w) = (w − 1)², w = 2,0, Lernrate 0,1. Welchen Wert hat w nach einem Gradiente… | ok | - [ ] freigeben |
| `q_ki_ok_3` | B | Ein Onlinekurs hat 24 h Video; für Übungen und Nacharbeit gilt Faktor 1,5. Bei… | ok | - [ ] freigeben |
| `q_ki_ok_2` | B | Was passiert typischerweise bei einer zu großen Lernrate? | ok | - [ ] freigeben |

## Frischbeton (`frischbeton`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bgl_1` | B | Ein Frischbeton hat ein Ausbreitmaß von 450 mm. Welche Konsistenzklasse und -be… | ok | - [ ] freigeben |
| `q_frb_2` | B | Wandschalung, Beton F3, Steiggeschwindigkeit 1 m/h, K₁ = 1,0. Wie groß ist σ_hk… | ok | - [ ] freigeben |
| `q_frb_1` | B | XF4-Beton, Größtkorn 16 mm: Ablesung 4,4 %, Gesteinskorrektur 0,3 %. Ist der Ei… | ok | - [ ] freigeben |
| `qn_frischbeton_4` | B | XF4-Beton, D_max = 16 mm (Mindestluftgehalt 4,5 Vol.-%). Gemessen werden 9,0 Vo… | korrigiert (Tranche 3, 28.10.): obere Grenze nach DIN EN 206, 5.4.3 (Mindestwert + 4 %), Einzelwert bis +1,0 % zulässig | – |
| `qn_frischbeton_3` | B | Welche Größe des Bingham-Modells τ = τ₀ + μ_p·γ̇ bestimmt vor allem das Ausbrei… | ok | - [ ] freigeben |
| `qn_frischbeton_2` | B | Wand 2,5 m hoch, Konsistenz F4, Steiggeschwindigkeit v = 1,5 m/h, K₁ = 1,0, γ_c… | ok | - [ ] freigeben |

## Expositionsklassen (`expositionsklassen`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_exk_6` | B | Welche Feuchtigkeitsklasse gilt für ein befahrenes Parkdeck mit Taumitteln? | ok | - [ ] freigeben |
| `q_exk_4` | B | Wie wird Flugasche im äquivalenten w/z-Wert angerechnet? | ok | - [ ] freigeben |
| `q_exk_5` | B | Welches Nennmaß c_nom ergibt sich für XD3 (Stab ⌀ 16 mm, Δc_dev = 15 mm)? | ok | - [ ] freigeben |
| `q_exk_2` | B | Was fordert DIN 1045-2 für XF4 hinsichtlich Luftporen? | ok | - [ ] freigeben |
| `q_exk_3` | B | Grundwasser enthält 1 200 mg/l Sulfat. Welche Klasse und welche Zementanforderu… | ok | - [ ] freigeben |
| `q_exk_1` | B | Eine Außenwand ist Schlagregen und Frost ausgesetzt, aber keinem Taumittel. Wel… | ok | - [ ] freigeben |

## Biogene Baustoffe (NaWaRo) (`nawaro`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_naw_2` | B | Wie viel CO₂ ist nach DIN EN 16449 etwa in 1 m³ Brettschichtholz (ρ₁₂ = 420 kg/… | ok | - [ ] freigeben |
| `q_naw_3` | B | Welche Euroklasse haben Holzfaserdämmplatten ohne Flammschutzmittel typischerwe… | ok | - [ ] freigeben |
| `q_naw_1` | B | Welche Kenngröße beschreibt die volumenbezogene Wärmespeicherfähigkeit eines Dä… | ok | - [ ] freigeben |
| `qn_nawaro_2` | B | Holzfaserdämmplatte: λ = 0,040 W/(mK), ρ = 160 kg/m³, c = 2100 J/(kgK); EPS: λ… | ok | - [ ] freigeben |
| `qn_nawaro_3` | B | Für eine feuchtekritische Innendämmung eines Fachwerkhauses soll ein biogener D… | ok | - [ ] freigeben |
| `qn_nawaro_1` | B | Wie viel CO₂ ist nach DIN EN 16449 etwa in 2 m³ Fichten-Bauholz mit ρ₁₂ = 450 k… | ok | - [ ] freigeben |

## Sonstige & Innovationen (`sonstiges`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_sonstiges_3` | B | Warum werden poröse leichte Gesteinskörnungen wie Blähton vor der Betonherstell… | ok | - [ ] freigeben |
| `qn_sonstiges_2` | B | Warum ist die Wärmeleitfähigkeit von Silica-Aerogel geringer als die von ruhend… | ok | - [ ] freigeben |
| `qn_sonstiges_1` | B | Wie viel Wärme speichern 12 kg Paraffin-PCM (c ≈ 2,0 kJ/(kg·K), Schmelzenthalpi… | ok | - [ ] freigeben |
| `qn_sonstiges_4` | B | Welche Bewertung des bakteriell selbstheilenden Betons entspricht dem Stand, de… | ok | - [ ] freigeben |
| `q_son_1` | B | Was passiert, wenn ein Vakuumisolationspaneel auf der Baustelle angebohrt wird? | ok | - [ ] freigeben |
| `q_son_2` | B | Warum speichern PCM im Bereich 21–26 °C viel mehr Wärme je kg als Beton? | ok | - [ ] freigeben |

## Beton (Bauprodukt) (`bp_beton`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bbt_1` | B | Eine Serie hat f_cm = 38,5 N/mm² und s = 5,0 N/mm². Wie groß ist das 5-%-Quanti… | ok | - [ ] freigeben |
| `q_bbt_2` | B | Wer ist bei „Beton nach Eigenschaften“ für die Rezeptur verantwortlich? | ok | - [ ] freigeben |
| `q_bbt_3` | B | Rezeptur: 175 kg/m³ Wasser, 350 kg/m³ Zement, keine Zusatzstoffe. Erfüllt der w… | ok | - [ ] freigeben |
| `q_bbt_4` | B | Wer trägt bei „Beton nach Zusammensetzung“ die Verantwortung dafür, dass die vo… | ok | - [ ] freigeben |
| `q_bbt_5` | B | Wie ist Transportbeton nach DIN EN 206 / DIN 1045-2 in Deutschland gekennzeichn… | ok | - [ ] freigeben |
| `q_bbt_6` | B | Welche Angabe macht der Besteller bei „Beton nach Eigenschaften“ in der Regel n… | ok | - [ ] freigeben |

## Verkehrswegebau (`bp_verkehrswegebau`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_vwb_1` | B | Welche Belastungsklasse gilt nach RStO 12/24 für eine dimensionierungsrelevante… | ok | - [ ] freigeben |
| `q_vwb_3` | B | Welche Zwangsspannung entsteht in einer Schiene (E = 210 000 N/mm², α = 1,2·10⁻… | ok | - [ ] freigeben |
| `q_vwb_2` | B | Was bedeutet die Bezeichnung 50/70 bei Straßenbaubitumen? | ok | - [ ] freigeben |
| `q_vwb_5` | B | Ein Marshall-Probekörper hat die Raumdichte 2,41 g/cm³, die Rohdichte des Aspha… | ok | - [ ] freigeben |
| `q_vwb_4` | B | Welcher Feuchtigkeitsklasse nach Alkali-Richtlinie werden Betonfahrbahndecken z… | ok | - [ ] freigeben |
| `q_vwb_6` | B | Asphaltfläche 1 000 m² (Abflussbeiwert 0,9), Bemessungsregen 150 l/(s·ha). Wie… | ok | - [ ] freigeben |

## Holzprodukte (`bp_holzprodukte`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_bph_2` | B | Wie berechnet sich die Bemessungsfestigkeit f_d aus der charakteristischen Fest… | ok | - [ ] freigeben |
| `q_bph_1` | B | Welcher Teilsicherheitsbeiwert γ_M gilt nach EC5/NA für Brettschichtholz (Grund… | ok | - [ ] freigeben |
| `qn_bp_holzprodukte_4` | B | Wie wirkt sich eine Erhöhung der Balkenhöhe von 200 mm auf 240 mm (gleiche Brei… | ok | - [ ] freigeben |
| `qn_bp_holzprodukte_1` | B | Was kennzeichnet Brettsperrholz (BSP/CLT) im Unterschied zu Brettschichtholz (B… | ok | - [ ] freigeben |
| `qn_bp_holzprodukte_2` | B | Warum kann KVH nach dem Modul in Gebrauchsklasse 0 nach DIN 68800 ohne chemisch… | ok | - [ ] freigeben |
| `qn_bp_holzprodukte_3` | B | Ein Holzbalken C24 (b/h = 100/200 mm, E = 11 000 N/mm²) spannt L = 4,0 m bei q_… | ok | - [ ] freigeben |

## Werkstoffe & dataholz (`holzbau_werkstoffe`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_hw_1` | B | Wofür steht die Festigkeitsklasse C24 nach DIN EN 338? | ok | - [ ] freigeben |
| `q_hw_3` | B | Welche Beanspruchung ist bei Brettsperrholz-Deckenplatten in den Querlagen häuf… | ok | - [ ] freigeben |
| `q_hw_2` | B | Was bedeutet der Buchstabe „h“ in der Bezeichnung GL24h? | ok | - [ ] freigeben |
| `q_hw_5` | B | In welche Nutzungsklasse nach Eurocode 5 gehört das Tragwerk eines überdachten,… | ok | - [ ] freigeben |
| `q_hw_4` | B | Ein Fichtenbalken ist in der tangential orientierten Breite 200 mm breit und tr… | ok | - [ ] freigeben |
| `q_hw_6` | B | Was bietet der Bauteilkatalog dataholz.eu der Planung? | ok | - [ ] freigeben |

## Kriechen & Schwinden (`kriechen_schwinden`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `q_ksx_6` | B | Eine 30 cm dicke Wand trocknet beidseitig aus. Wie groß ist die wirksame Bautei… | ok | - [ ] freigeben |
| `q_ksx_4` | B | Wie groß ist das autogene Endschwindmaß ε_ca,∞ = 2,5 · (f_ck − 10) · 10⁻⁶ für C… | ok | - [ ] freigeben |
| `q_ksx_5` | B | Dauerlast σ_c = 10 N/mm², E_cm = 33 000 N/mm², φ = 2,0. Wie groß ist die Gesamt… | ok | - [ ] freigeben |
| `q_ksx_2` | B | Welche beiden Anteile des Schwindens erfasst DIN EN 1992-1-1 rechnerisch? | ok | - [ ] freigeben |
| `q_ksx_3` | B | Wie groß ist der wirksame E-Modul bei E_cm = 33 000 N/mm² und φ = 2,0? | ok | - [ ] freigeben |
| `q_ksx_1` | B | Wie wirkt sich ein späteres Belastungsalter t₀ auf die Endkriechzahl aus? | ok | - [ ] freigeben |

## Betonkennwerte (EC2) (`betonkennwerte`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_betonkennwerte_1` | B | C40/50 mit Kalkstein-Gesteinskörnung (α_E = 0,9). Wie groß ist E_cm nach E_cm =… | ok | - [ ] freigeben |
| `qn_betonkennwerte_3` | B | Wofür wird nach EC2 die Parabel-Rechteck-Linie (ε_c2 = 2,0 ‰, ε_cu2 = 3,5 ‰) ve… | ok | - [ ] freigeben |
| `qn_betonkennwerte_2` | B | C30/37 (f_cm = 38 N/mm²), Zement der Klasse R (s = 0,20). Wie groß ist f_cm(t)… | ok | - [ ] freigeben |
| `qn_betonkennwerte_5` | B | Lineare Endkriechzahl φ(∞,t₀) = 2,0. Die Dauerdruckspannung beträgt σ_c = 0,55·… | ok | - [ ] freigeben |
| `qn_betonkennwerte_4` | B | Eine 30 cm dicke Wand trocknet beidseitig aus. Wie groß sind die wirksame Baute… | ok | - [ ] freigeben |
| `qn_betonkennwerte_6` | B | Welcher Betonkennwert bestimmt maßgeblich den Durchbiegungsnachweis (GZG) einer… | ok | - [ ] freigeben |

## Konstruktionsweisen (`holzbau_konstruktion`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_holzbau_konstruktion_1` | B | Worauf beruht die Tragwirkung einer Wand in Holzrahmenbauweise? | ok | - [ ] freigeben |
| `qn_holzbau_konstruktion_3` | B | Für eine Messehalle mit großen Spannweiten und großflächig verglaster Fassade w… | ok | - [ ] freigeben |
| `qn_holzbau_konstruktion_2` | B | Was ist bei Brettsperrholz (BSP/CLT) als Deckenplatte besonders zu beachten? | ok | - [ ] freigeben |
| `qn_holzbau_konstruktion_5` | B | Ein Bestandsgebäude soll aufgestockt werden; die vorhandene Tragstruktur kann n… | ok | - [ ] freigeben |
| `qn_holzbau_konstruktion_4` | B | Geschossdecke von oben: Heizestrich 65 mm / Trittschalldämmung 30 mm / gebunden… | ok | - [ ] freigeben |
| `qn_holzbau_konstruktion_6` | B | Für welche Gebäudeklassen regelt die Muster-Holzbaurichtlinie (MHolzBauRL 2024)… | ok | - [ ] freigeben |

## Holzbau: Stützenknicken (`rechnung_holzbau`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_rechnung_holzbau_2` | B | Eine pendelnd gelagerte Stütze (Euler-Fall 2) aus Vollholz 14 × 14 cm hat eine… | ok | - [ ] freigeben |
| `qn_rechnung_holzbau_3` | B | Für die Stütze C24 (f_c,0,k = 21 N/mm², E_0,05 = 7 400 N/mm²) gilt λ = 74,2. We… | ok | - [ ] freigeben |
| `qn_rechnung_holzbau_1` | B | Wie groß ist der Bemessungswert der Druckfestigkeit f_c,0,d einer Vollholzstütz… | ok | - [ ] freigeben |
| `qn_rechnung_holzbau_6` | B | Eine Stütze C24, 12 × 12 cm, L = 3,5 m, N_d = 90 kN ist mit η = 1,44 überlastet… | ok (η = 1,43 / 1,32 / 0,80 / 0,54 nachgerechnet) | - [ ] freigeben |
| `qn_rechnung_holzbau_4` | B | Für eine Vollholzstütze ist λ_rel = 1,259 (β_c = 0,2). Welchen Knickbeiwert k_c… | ok | - [ ] freigeben |
| `qn_rechnung_holzbau_5` | B | Die Stütze 14 × 14 cm (L = 3,0 m, C24) erhält N_d = 65 kN. Mit k_c = 0,507 und… | ok | - [ ] freigeben |

## Brandschutz: Heißbemessung (`rechnung_brandschutz`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_rechnung_brandschutz_3` | B | Für den Restquerschnitt 82 × 311 mm gilt W_ef ≈ 1 322 cm³. Mit k_fi = 1,15, f_m… | ok | - [ ] freigeben |
| `qn_rechnung_brandschutz_2` | B | Ein BSH-Deckenbalken 18 × 36 cm wird 3-seitig beflammt (Oberseite geschützt); d… | ok | - [ ] freigeben |
| `qn_rechnung_brandschutz_1` | B | Wie groß ist die effektive Abbrandtiefe d_ef eines Brettschichtholzträgers (β_n… | ok | - [ ] freigeben |
| `qn_rechnung_brandschutz_6` | B | Warum neigt hochfester Beton im Brandfall zu Abplatzungen, und welche Gegenmaßn… | ok | - [ ] freigeben |
| `qn_rechnung_brandschutz_5` | B | Welche Mindestplattendicke h_min nennt die Tabelle des Moduls nach DIN EN 1992-… | ok | - [ ] freigeben |
| `qn_rechnung_brandschutz_4` | B | Wie groß ist nach den Abbrandraten des Moduls die effektive Abbrandtiefe nach 9… | ok | - [ ] freigeben |

## KI: Hands-on-Übungen (Master) (`ki_uebungen`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_ki_ueb_5` | B | Das vom KI-Assistenten entworfene Excel-Blatt liefert für den Testfall (1,5 cm… | ok | - [ ] freigeben |
| `qn_ki_ueb_4` | B | Beim Grenztest der RAG-Übung beantwortet das Modell eine Frage, die der bereitg… | ok | - [ ] freigeben |
| `qn_ki_ueb_6` | B | Sie behaupten gegenüber dem KI-Assistenten bewusst falsch, ein höherer w/z-Wert… | ok | - [ ] freigeben |
| `qn_ki_ueb_1` | B | Sie stellen dem KI-Assistenten der Hochschule dieselbe Fachfrage in drei neuen… | ok | - [ ] freigeben |
| `qn_ki_ueb_3` | B | Im Agentenlauf „Recyclingbeton“ schlägt das Modell als nächste Aktion vor, beim… | ok | - [ ] freigeben |
| `qn_ki_ueb_2` | B | Welche Vorgabe im strukturierten Prompt der Übung „Bedenkenanzeige“ verhindert… | ok | - [ ] freigeben |

## Biokohlebeton (Pflanzenkohle im Beton) (`biokohlebeton`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_biokohlebeton_3` | B | Die Netto-Senke von 1 kg Pflanzenkohle beträgt 2,0 kg CO₂. Wie viel Zement mit… | ok | - [ ] freigeben |
| `qn_biokohlebeton_2` | B | Ein Beton enthält 12 kg/m³ Pflanzenkohle mit 75 M.-% Kohlenstoff. Angesetzt wer… | ok | - [ ] freigeben |
| `qn_biokohlebeton_1` | B | Warum wird der Kohlenstoffgehalt der Pflanzenkohle bei der CO₂-Bilanz mit dem F… | ok | - [ ] freigeben |
| `qn_biokohlebeton_7` | B | Eine Planerin möchte 30 kg/m³ Zement durch Pflanzenkohle ersetzen und dabei den… | ok | - [ ] freigeben |
| `qn_biokohlebeton_6` | B | Welche Folge der dunklen Färbung durch Pflanzenkohle ist bei besonnten Sichtbet… | ok | - [ ] freigeben |
| `qn_biokohlebeton_5` | B | Ein Teil des Zements wird durch Pflanzenkohle ersetzt. Welche Wirkung auf die K… | ok | - [ ] freigeben |

## Handout Druckfestigkeit an Würfeln (`labor_druckfestigkeit`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_labor_druckfestigkeit_5` | B | Warum wird der Würfel so eingelegt, dass die Schalflächen an den Druckplatten l… | ok | - [ ] freigeben |
| `qn_labor_druckfestigkeit_4` | B | Drei Würfel ergeben 33,5 / 35,0 / 31,0 MPa (Mittel 33,2 MPa). Welche Klasse err… | ok | - [ ] freigeben |
| `qn_labor_druckfestigkeit_6` | B | Warum ersetzt die Bewertung von drei Laborwürfeln im Handout keine Konformitäts… | ok | - [ ] freigeben |
| `qn_labor_druckfestigkeit_1` | B | Ein Würfel mit 150 mm × 150 mm Druckfläche bricht bei F = 900 kN. Wie groß ist… | ok | - [ ] freigeben |
| `qn_labor_druckfestigkeit_3` | B | Mit welcher Spannungsrate wird ein Betonwürfel nach DIN EN 12390-3 belastet? | ok | - [ ] freigeben |
| `qn_labor_druckfestigkeit_2` | B | Trocken gelagerte Würfel eines Normalbetons ergeben f_cm,dry = 45,0 MPa. Welche… | ok | - [ ] freigeben |

## Ausblick: neue Normengeneration (Beton und Eurocodes) (`normen_ausblick`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_normen_ausblick_2` | B | Welcher Inhalt wurde bei der Neuausgabe aus EN 206 in den eigenen Teil EN 206-2… | ok (EN 206-2:2026 „Konformitätsbewertung und Zertifizierung“ bestätigt) | - [ ] freigeben |
| `qn_normen_ausblick_3` | B | Welche Rolle übernehmen die Expositionswiderstandsklassen (ERC) in EN 1992-1-1:… | ok | - [ ] freigeben |
| `qn_normen_ausblick_1` | B | Ein Tragwerksplaner legt im Oktober 2026 einen Beton für ein Parkhaus in Bayern… | ok | - [ ] freigeben |
| `qn_normen_ausblick_6` | B | Welche Termine hat CEN für die Eurocodes der 2. Generation festgelegt (national… | ok | - [ ] freigeben |
| `qn_normen_ausblick_7` | B | DIN EN 1995-1-1:2026-09 ist erschienen. Was folgt daraus für eine Holzbaustatik… | ok (DIN EN 1995-1-1:2026-09 erschienen, bauaufsichtlich nicht eingeführt) | - [ ] freigeben |
| `qn_normen_ausblick_4` | B | Ein Beton ist der Klasse XRC 2 zugeordnet (Rate in mm/√a). Welche Karbonatisier… | ok | - [ ] freigeben |

## Zwangspannungen (`zwang`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_zwang_1` | B | Ein Betonbauteil (α_T = 10⁻⁵ 1/K, E = 30 000 N/mm²) kühlt um ΔT = 20 K ab und i… | ok | - [ ] freigeben |
| `qn_zwang_3` | B | Wann ist bei Zwangbeanspruchung aus Abkühlen oder Schwinden mit einem Trennriss… | ok | - [ ] freigeben |
| `qn_zwang_2` | B | Ein Bauteil kann sich beim Abkühlen völlig frei verkürzen (R = 0 %). Welche Zwa… | ok | - [ ] freigeben |
| `qn_zwang_5` | B | Ein voll festgehaltenes Bauteil (R = 100 %, E_c,eff = 15 000 N/mm²) erfährt ein… | ok | - [ ] freigeben |
| `qn_zwang_4` | B | Warum wird für Zwang aus langsamer Abkühlung oder Schwinden der effektive E-Mod… | ok | - [ ] freigeben |
| `qn_zwang_6` | B | Welche Aufgabe hat die Mindestbewehrung A_s,min = k_c·k·f_ct,eff·A_ct/σ_s bei Z… | ok | - [ ] freigeben |

## Laborsicherheit (`labor_sicherheit`)

| ID | Teil | Kurztext | Ergebnis | Freigabe |
|---|---|---|---|---|
| `qn_labor_sicherheit_6` | B | Was muss vor dem Start des Druckaufbaus an der Großprüfpresse geschehen? | ok | - [ ] freigeben |
| `qn_labor_sicherheit_5` | B | Eine Probe aus einem Altbau steht im Verdacht, Asbest zu enthalten. Darf sie im… | ok | - [ ] freigeben |
| `qn_labor_sicherheit_4` | B | Was gilt für Arbeiten an Prüfpressen, Sägen oder mit dem Brückenkran im Labor? | ok | - [ ] freigeben |
| `qn_labor_sicherheit_3` | B | Beim Mischen spritzt Zementleim ins Auge. Was ist die erste Maßnahme? | ok | - [ ] freigeben |
| `qn_labor_sicherheit_2` | B | Wie wird quarzhaltiger Staub im Baustofflabor vom Boden entfernt? | ok | - [ ] freigeben |
| `qn_labor_sicherheit_1` | B | Was gilt an Steintrennsäge, Kernbohrgerät und Zwangsmischer für Handschuhe, Rin… | ok | - [ ] freigeben |

---

Freigabe aller mit ok bewerteten Fragen: [ ]
