# Quiz: Distraktoren angeglichen und normRef ergänzt (27.10.2026)

Entscheidung Prof. Huber vom 27.10.: „Distraktoren angleichen + normRef“. Datei `src/data/quiz.json`. Frage-Text und richtige Antwort sind in keiner Frage verändert; Fragen mit `verified: true` (26) und die vier parallel bearbeiteten Fragen `qn_rechnung_mauerwerk_1/4/5/6` sind nicht angefasst. Jede geänderte Frage trägt `vorpruefung: { am: "2026-10-27", ergebnis: "korrigiert", hinweis: … }` mit „Distraktoren angeglichen“, „normRef ergänzt“ oder beidem.

## Kennzahlen vorher / nachher

| Kennzahl | vorher | nachher |
|---|---|---|
| Fragen gesamt | 1282 | 1282 |
| Richtige Antwort ≥ alle anderen (Gleichstand zählt mit) | 478 (37,3 %) | 350 (27,3 %) |
| davon alle Optionen exakt gleich lang (kein Hinweis möglich) | 242 | 242 |
| Richtige Antwort strikt die längste | 91 (7,1 %) | 24 (1,9 %) |
| Trefferquote der Strategie „längste Option wählen“ (Gleichstand anteilig) | 16,8 % | 9,3 % |
| Fragen mit längster/kürzester Option > 1,2 | 431 | 397 |
| Fragen mit richtig/Mittel der Distraktoren > 1,2 (bestehende Ratsche) | 26 | 26 (alle freigegeben, unverändert) |
| Absolutwörter in Distraktoren | 10 | 10 (keine neuen) |
| Fragen ohne normRef | 429 | 276 |

Geändert: **268 Fragen** – 129 mit angeglichenen Distraktoren (231 Optionen), 153 mit ergänztem normRef, 14 mit beidem.

## Vorgehen und Hinweise zur Prüfung

- **Längenhinweis.** Bearbeitet wurden nur Fragen, in denen die richtige Antwort die längste war oder sich die Höchstlänge mit einem Distraktor teilte und die Optionen nicht ohnehin gleich lang sind. Je Frage wurde mindestens ein Distraktor um eine Bedingung, Einheit oder Präzisierung ergänzt, sodass er etwas länger ist als die richtige Antwort; kurze Distraktoren wurden mitgezogen, damit längste/kürzeste ≤ 1,2 bleibt. Der fachliche Kern der Fehlvorstellung und die vorhandene Rückmeldung (`distraktorFeedback`) passen weiterhin; keine neuen Absolutwörter.
- **Verworfen** (Zusatz hätte die richtige Antwort verraten oder wäre unplausibel): `q_ges_3`, `qn_instandhaltung_2`, `q_bpg_1`, `qn_stahl_fec_1`; reine Zahlen-/Kurzoptionen (z. B. „13,8 mm“, „SF2“, „W2.1-E“) wurden nicht künstlich verlängert.
- **Lesart der 37 %.** Der Ausgangswert zählt Gleichstände mit; 242 der 478 Fragen hatten exakt gleich lange Optionen (Permutationen, Zahlenwerte). Strikt die längste war die richtige Antwort schon vorher nur in 7,1 %, jetzt in 1,9 %.
- **Prüfpunkt Gegen-Hinweis.** Die Trefferquote „längste Option wählen“ liegt jetzt bei 9,3 % und damit unter dem Zufallsniveau (≈ 25 %). Die Unterschiede betragen meist nur wenige Zeichen (Spannweite ≤ 1,2), ein bewusstes „längste ausschließen“ ist daher kaum ausnutzbar. Vorschlag für eine spätere Runde: zweiseitige Ratsche (z. B. 15–35 %) statt nur Obergrenze.
- **normRef.** Ergänzt nur, wo eine Norm, ein Gesetz oder ein anerkanntes Regelwerk den Inhalt der Frage trägt (Format wie vorhandene Einträge, ohne Ausgabedatum; Ausgaben gemäß `src/data/centralNormenRegistry.ts`). Reine Grundlagen-, Rechen-, KI- und Fallbeispielfragen bleiben ohne normRef (Feld unverändert leer bzw. weggelassen) und sind unten gezählt.
- **Bitte besonders prüfen:** `GModG Anlage 7` (Höchstwert 0,24 W/(m²K)) und `GModG Anlagen 4 und 10` (Nummerierung wie GEG angenommen), `GModG 2026` bei `qn_energieausweis_3` (Paragraf bewusst offen gelassen), `ACI 305R` (Verdunstungsrate), `fib Bulletin 34`, `RuVA-StB 01`, `DWA-M 168`, `ZTV Beton-StB` für HGT-Kerben, `DIN 68100` (Schwindmaße).
- Vorherige Vorprüfungsvermerke werden durch den neuen Vermerk ersetzt; abweichende frühere Vermerke stehen unten im Anhang.

## Geänderte Distraktoren

Gekürzt auf die geänderte Stelle (± 3 Wörter). „Opt.“ = Optionsnummer (1-basiert), R = Nummer der richtigen Antwort.

| ID | R | Opt. | vorher | nachher |
|---|---|---|---|---|
| `q_bpr_1` | 2 | 1 | … nach harmonisierter Norm geprüft wurde | … nach harmonisierter Norm national geprüft wurde |
| `q_bk_3` | 2 | 3 | … Poren entstehen erst durch Luftporenbildner oder … | … Poren entstehen erst später durch Luftporenbildner oder … |
| `q_bch_3` | 2 | 3 | … der Gesteinskörnung und tiefe Temperaturen | … der Gesteinskörnung und dauerhaft tiefe Temperaturen |
| `q_bch_3` | 2 | 4 | … Grenzwert, Sauerstoffzutritt und Bewehrung | … Grenzwert, Sauerstoffzutritt und ungeschützte Bewehrung |
| `q_bch_4` | 2 | 1 | … und gefährdet bei Hitze das verzinkte Fallrohr. | … und gefährdet bei großer Hitze das darunterliegende Fallrohr. |
| `q_bch_4` | 2 | 3 | … und greift im Regenwasser das Kupfer … | … und greift im ablaufenden Regenwasser das Kupfer … |
| `q_bch_4` | 2 | 4 | … deutlich stärker als Zink, die Fügungen reißen. | … deutlich stärker als Zink aus, sodass die Fügungen reißen. |
| `q_recht_4` | 3 | 2 | … Empfehlungen ohne Beweiswirkung sind. | … Empfehlungen ohne Beweiswirkung im Bauprozess sind. |
| `q_recht_5` | 2 | 1 | … Bund im Baugesetzbuch | … Bund im Baugesetzbuch und in der BauNVO |
| `q_an_1` | 2 | 3 | … Röntgenstrahl, bevor ein Beugungsbild entsteht | … Röntgenstrahl, bevor ein klares Beugungsbild entsteht |
| `q_lab_1` | 1 | 2 | … einer mangelhaften Vorbereitung des Betonuntergrunds | … einer mangelhaften Vorbereitung und Reinigung des Betonuntergrunds |
| `q_lab_3` | 1 | 2 | … erst danach seinen Endwert erreicht | … erst danach seinen endgültigen Wert erreicht |
| `q_lab_4` | 3 | 1 | … hat und den Querschnitt dadurch versteift | … hat und den gesamten Querschnitt dadurch versteift |
| `q_lab_4` | 3 | 4 | … früher übernimmt als Betonstahl | … früher übernimmt als normaler Betonstahl |
| `q_stat_1` | 1 | 2 | … hohe Mittelwerte und Festigkeiten liefern | … hohe Mittelwerte und damit zu hohe Festigkeiten liefern |
| `q_stat_1` | 1 | 3 | … 0,1-%-Quantil statt des 5-%-Quantils gesucht wird | … 0,1-%-Quantil statt des üblichen 5-%-Quantils gesucht wird |
| `q_stat_1` | 1 | 4 | … n statt der Normal- eine Gleichverteilung anzunehmen … | … n statt der Normalverteilung eine Gleichverteilung anzunehmen … |
| `q_fest_1` | 2 | 4 | … mit der Höhe abnimmt und den … | … mit der Höhe merklich abnimmt und den … |
| `q_bruch_2` | 2 | 3 | … und Risse ohne Vorankündigung schlagartig fortschreiten | … und Risse ohne jede Vorankündigung schlagartig fortschreiten |
| `q_knick_2` | 4 | 3 | … ohne ausgeprägte Streckgrenze gilt | … ohne ausgeprägte Streckgrenze gültig ist |
| `q_boden_2` | 2 | 1 | Sie halbiert sich | Sie halbiert sich etwa |
| `q_boden_2` | 2 | 3 | Sie verdoppelt sich | Sie verdoppelt sich etwa |
| `q_boden_2` | 2 | 4 | Sie bleibt gleich | Sie bleibt etwa gleich |
| `qn_bauphysik_5` | 1 | 2 | … – nicht erfüllt | … – nicht erfüllt (< 0,70) |
| `qn_bauphysik_5` | 1 | 4 | … – nicht erfüllt | … – nicht erfüllt (< 0,70) |
| `q_we_2` | 4 | 1 | … trotz 20 °C eine niedrigere Oberflächentemperatur | … trotz 20 °C Lufttemperatur eine niedrigere Oberflächentemperatur |
| `q_we_2` | 4 | 2 | … daher weniger Wärme | … daher weniger Wärme im Bauteil |
| `q_we_2` | 4 | 3 | … besser in den Fuß zurück | … besser in den nackten Fuß zurück |
| `q_dv_2` | 3 | 1 | … nach DIN 4108-2 | … nach DIN 4108-2 für die Außenwand |
| `q_dv_2` | 3 | 2 | … allein, da es kapillare Rücktrocknung erfasst | … allein, da es auch die kapillare Rücktrocknung erfasst |
| `q_bs_1` | 1 | 3 | … A1), der einem Brand 90 min standhält | … A1), der einem Normbrand 90 min lang standhält |
| `q_bs_1` | 1 | 4 | Höchstens 90 K Temperaturanstieg auf der … | Höchstens 90 K mittlerer Temperaturanstieg auf der … |
| `q_ndr_2` | 4 | 2 | … eingeführt und seit 2026 unmittelbar anwendbar | … eingeführt und seit Anfang 2026 unmittelbar anwendbar |
| `q_zs_6` | 3 | 2 | … Energieeffizienz-Experte das Gold-Zertifikat bestätigt | … Energieeffizienz-Experte das Gold-Zertifikat schriftlich bestätigt |
| `q_ru_2` | 2 | 1 | … PERM (stofflich), beide erneuerbar | … PERM (stofflich), beide aus erneuerbaren Quellen |
| `q_ru_2` | 2 | 3 | … plus PERE, also energetisch genutzte Primärenergie gesamt | … plus PERE, also die gesamte energetisch genutzte Primärenergie |
| `q_bst_1` | 4 | 2 | … die relative Luftfeuchte ansteigt | … die relative Luftfeuchte im Raum ansteigt |
| `q_bwe_1` | 3 | 1 | … die Kostenschätzung der Dachdeckung | … die Kostenschätzung der neuen Dachdeckung |
| `q_bwe_1` | 3 | 2 | … Dachstuhls in die Denkmalliste | … Dachstuhls in die amtliche Denkmalliste |
| `q_dp_1` | 3 | 1 | … Stein, um ihn zu schützen | … Stein, um ihn dauerhaft zu schützen |
| `q_dp_1` | 3 | 4 | … damit keine Feuchte eindringt | … damit keine Feuchte in die Fuge eindringt |
| `q_dp_2` | 4 | 2 | … Kirchen und andere Sakralbauten | … Kirchen und andere genutzte Sakralbauten |
| `q_dp_2` | 4 | 3 | … generelles Verbot jeder Dämmung an denkmalgeschützten … | … generelles Verbot jeder nachträglichen Dämmung an denkmalgeschützten … |
| `q_hb_2` | 2 | 3 | … sodass getrocknete Balken zu verstärken sind | … sodass getrocknete Balken nachträglich zu verstärken sind |
| `q_hp_1` | 2 | 1 | … langfristig tolerierbar, keine Maßnahmen | … langfristig tolerierbar, keine weiteren Maßnahmen |
| `q_hp_1` | 2 | 3 | … Maßnahmen zur Minderung einleiten | … Maßnahmen zur Minderung der Belastung einleiten |
| `q_cl_2` | 2 | 1 | … bezogen auf die Betonmasse, unabhängig von … | … bezogen auf die gesamte Betonmasse, unabhängig von … |
| `q_rb_1` | 1 | 2 | … mineralische Abfälle, Holz und ein gemischter Restabfall | … mineralische Abfälle, Holz sowie gemischter Bau- und Abbruchabfall |
| `q_rb_1` | 1 | 3 | … erst bei Bauvorhaben über 100 m³ … | … erst bei Bauvorhaben mit über 100 m³ … |
| `q_rb_1` | 1 | 4 | … bis 17 09 der AVV | … bis 17 09 im Abfallverzeichnis (AVV) |
| `q_rb_2` | 3 | 2 | … der Raumluft nach Abschluss von Sanierungen | … der Raumluft nach dem Abschluss von Sanierungsarbeiten |
| `q_re_2` | 1 | 2 | … jedes einzelne Bauvorhaben | … jedes einzelne Bauvorhaben in Deutschland |
| `q_re_2` | 1 | 3 | … dem Jahr 2025 | … dem Jahr 2025 bundesweit |
| `q_re_2` | 1 | 4 | … bei öffentlichen Hochbauten | … bei öffentlichen Hochbauten von Bund und Ländern |
| `q_ms_tb_1` | 1 | 2 | … zuerst ist eine Beschichtung nötig | … zuerst ist eine deckende Beschichtung nötig |
| `q_ms_tb_1` | 1 | 4 | … Risse sind danach nicht mehr wasserdicht | … Risse sind danach in der Regel nicht mehr wasserdicht |
| `q_ms_mo_1` | 3 | 1 | … durch ein dichteres Gefüge | … durch ein dichteres Betongefüge |
| `q_ms_mo_1` | 3 | 2 | Höherer Bewehrungsgrad im Messbereich | Höherer Bewehrungsgrad im durchschallten Messbereich |
| `q_ms_mo_1` | 3 | 4 | … E-Modul des Betons | … E-Modul des Betons im Messfeld |
| `q_ms_zb_2` | 4 | 1 | Bundesgesetz, das Prüfintervalle für alle Gebäude verbindlich vorschreibt | Bundesgesetz, das feste Prüfintervalle für alle Gebäude bundesweit verbindlich vorschreibt |
| `q_ms_zb_2` | 4 | 2 | … die MVV TB bauaufsichtlich verbindlich | … die MVV TB in den Ländern bauaufsichtlich verbindlich |
| `q_ms_mg_1` | 2 | 1 | … Lochkorrosion der schlaffen Bewehrung | … Lochkorrosion der schlaffen Betonstahlbewehrung |
| `q_ms_mg_1` | 2 | 4 | Frostschäden im Beton der … | Frost-Tausalz-Schäden im Beton der … |
| `q_ms_sc_2` | 2 | 3 | … Ort nicht messbar, nur der Durchfeuchtungsgrad | … Ort nicht messbar, sondern nur der Durchfeuchtungsgrad |
| `q_is_wta_1` | 1 | 2 | … Mauerwerk einschließen, damit Salze nicht an … | … Mauerwerk einschließen, damit gelöste Salze nicht an … |
| `q_is_wta_1` | 1 | 3 | … Steine im Verbund sichern | … Steine im Verbund dauerhaft sichern |
| `q_is_wta_1` | 1 | 4 | … sodass aufsteigende Feuchte gestoppt wird | … sodass aufsteigende Feuchte im Mauerwerk gestoppt wird |
| `q_is_cl_2` | 3 | 2 | … der Mörtel auf trockener Haftbrücke zu schnell erhärtet und reißt | … der Mörtel auf einer trockenen Haftbrücke zu schnell erhärtet und dabei reißt |
| `q_is_cl_2` | 3 | 4 | … feuchten Zustand gegen Chloride abdichtet | … feuchten Zustand gegen eindringende Chloride abdichtet |
| `q_dg_bim_2` | 2 | 1 | … Präfix Pset_, damit Software sie als Standard-Set … | … Präfix Pset_, damit die BIM-Software sie als Standard-Set … |
| `q_dg_bim_2` | 2 | 4 | … des jeweiligen Bauteils | … des jeweiligen Bauteils im Modell |
| `q_dg_db_2` | 1 | 2 | … Dämmstoffe nur je kg Masse ausweist | … Dämmstoffe nur je Kilogramm Masse ausweist |
| `q_dg_db_2` | 1 | 3 | Weil Dämmstoffe nach Masse statt nach Volumen verglichen werden … | Weil Dämmstoffe nach ihrer Masse statt nach ihrem Volumen verglichen werden … |
| `q_dg_db_2` | 1 | 4 | … die Herstellungsphase A1–A3 enthalten | … die Herstellungsphase A1–A3 ohne Nutzung enthalten |
| `q_dg_mp_1` | 3 | 1 | … für Neubauten als Teil des Energieausweises … | … für Neubauten als festen Teil des Energieausweises … |
| `q_dg_mp_1` | 3 | 2 | … verlangt ihn beim Rückbau mineralischer Bauteile | … verlangt ihn beim selektiven Rückbau mineralischer Bauteile |
| `q_dg_mp_2` | 3 | 1 | … Baustoffe wie Dämmstoffe übergewichten | … Baustoffe wie Dämmstoffe deutlich übergewichten |
| `q_dg_mp_2` | 3 | 2 | Weil Recyclingquoten nach KrWG nur für Siedlungsabfälle, nicht für Bauabfälle gelten | Weil Recyclingquoten nach dem KrWG nur für Siedlungsabfälle, nicht aber für Bauabfälle gelten |
| `q_ki_sy_1` | 3 | 1 | … Dokumenten nachtrainiert und dauerhaft angepasst | … Dokumenten nachtrainiert und dadurch dauerhaft angepasst |
| `q_ki_th_1` | 4 | 3 | … gefundenen Artikel sind falsch und müssen … | … gefundenen Artikel sind fachlich falsch und müssen … |
| `q_ki_lk_2` | 2 | 1 | Ja, da bei lokalem Betrieb keine Verarbeitung im Sinne der DSGVO vorliegt | Ja, da bei rein lokalem Betrieb keine Verarbeitung im Sinne der DSGVO mehr vorliegt |
| `q_ki_lk_2` | 2 | 3 | … Modell unter einer Open-Source-Lizenz veröffentlicht wurde | … Modell unter einer anerkannten Open-Source-Lizenz veröffentlicht wurde |
| `q_ki_lk_2` | 2 | 4 | … Rechner ohne Internetanschluss isoliert im Büro betrieben wird | … Rechner ohne Internetanschluss räumlich isoliert im eigenen Büro betrieben wird |
| `q_ki_bs_1` | 4 | 1 | … belastbar, da der w/z-Wert-Zusammenhang nach Abrams stetig … | … belastbar, da der w/z-Wert-Festigkeits-Zusammenhang nach Abrams stetig … |
| `q_ki_bs_1` | 4 | 2 | … w/z-Werte geringere Festigkeitsstreuungen ergeben | … w/z-Werte geringere Festigkeitsstreuungen im Labor ergeben |
| `q_ki_bs_1` | 4 | 3 | Belastbar, sofern Zement und Gesteinskörnung den … | Belastbar, sofern Zement, Zusatzstoffe und Gesteinskörnung den … |
| `q_ki_bs_5` | 3 | 2 | … − 1 statt n | … − 1 statt durch n |
| `q_ki_bs_5` | 3 | 4 | … hat eine andere Einheit | … hat eine andere Maßeinheit |
| `q_px_pl_2` | 1 | 2 | … aus eigener Erfahrung empfiehlt | … aus eigener Erfahrung fachlich empfiehlt |
| `q_px_pl_2` | 1 | 3 | … genannte Produkt anbieten | … genannte Produkt anbieten und liefern |
| `q_px_bl_2` | 2 | 1 | … der Anmeldung nicht schriftlich zustimmt | … der Anmeldung nicht ausdrücklich schriftlich zustimmt |
| `q_ku_2` | 3 | 2 | … hoher Anteil an gebranntem Portlandzementklinker aus Vulkangestein | … hoher Anteil an hochgebranntem Portlandzementklinker aus vulkanischem Ausgangsgestein |
| `q_ku_2` | 3 | 4 | … Eindringen von Meerwasser verhinderte | … Eindringen von Meerwasser wirksam verhinderte |
| `q_hee_2` | 2 | 3 | … es im Bautagebuch steht | … es im Bautagebuch vermerkt ist |
| `q_sbt_2` | 2 | 1 | … oberflächennahen Bewehrungslage im Sichtbereich | … oberflächennahen Bewehrungslage im gesamten Sichtbereich |
| `q_sbt_2` | 2 | 3 | … C35/45 statt der geplanten C25/30 | … C35/45 statt der eigentlich geplanten C25/30 |
| `q_sbt_2` | 2 | 4 | … wie CEM III/A | … wie CEM III/A oder CEM II/B-S |
| `q_sob_2` | 2 | 4 | … sehr dichte Matrix Risse selbst überbrückt | … sehr dichte Matrix entstehende Risse selbst überbrückt |
| `q_stb_4` | 2 | 3 | … des Feuerwiderstands durch genügend Stahlquerschnitt | … des Feuerwiderstands durch einen genügend großen Stahlquerschnitt |
| `q_stb_4` | 2 | 4 | … Betondeckung im Zugbereich verringert werden darf | … Betondeckung im Zugbereich planmäßig etwas verringert werden darf |
| `q_cbm_2` | 1 | 3 | … in trockenen Innenräumen (XC1) verbaut | … in trockenen Innenräumen (Klasse XC1) verbaut |
| `q_cbm_4` | 2 | 3 | … 1045-2 für alle Betonbauteile | … 1045-2 für alle bewehrten Betonbauteile |
| `q_pum_2` | 2 | 4 | ≥ 6 N/mm² | ≥ 6,0 N/mm² |
| `q_gip_1` | 2 | 1 | Anhydrit II (unlöslicher Anhydrit) | Anhydrit II (schwer löslicher Anhydrit) |
| `q_gip_1` | 2 | 3 | Calciumoxid und Schwefeltrioxid | Calciumoxid und Schwefeltrioxid (SO₃) |
| `q_kal_3` | 2 | 1 | Endotherme Reaktion zu Ca(OH)₂ (ΔH ≈ … | Endotherme Reaktion zu Kalkhydrat Ca(OH)₂ (ΔH ≈ … |
| `q_kal_3` | 2 | 3 | … von CO₂ zu CaCO₃ | … von CO₂ zu Kalkstein CaCO₃ |
| `q_gla_2` | 2 | 1 | … allen VSG-Aufbauten mit PVB-Folie | … allen VSG-Aufbauten mit Standard-PVB-Folie |
| `q_gla_2` | 2 | 4 | Ja, bei kurzzeitigen Lasten wie Wind | Ja, bei kurzzeitigen Einwirkungen wie Windlasten |
| `q_hwk_2` | 2 | 3 | … mit Bindemittel, plattenförmig | … mit Bindemittel, plattenförmig hergestellt |
| `q_hwk_2` | 2 | 4 | Faserparallel verklebte Furniere, stabförmig | Faserparallel verklebte Furnierlagen, stabförmig eingesetzt |
| `q_dms_2` | 2 | 3 | Zellulose (Einblasdämmung) | Zellulosefasern (Einblasdämmung) |
| `q_dms_3` | 2 | 1 | Geringste Wärmeleitfähigkeit aller Dämmstoffe → kleiner … | Geringste Wärmeleitfähigkeit aller gängigen Dämmstoffe → kleiner … |
| `q_dms_3` | 2 | 3 | … Wärmetransport durch Diffusion | … Wärmetransport durch Diffusion im Bauteil |
| `q_hol_1` | 1 | 3 | … 0 % und maximaler Holzfeuchte | … 0 % und der maximalen Holzfeuchte |
| `q_hol_1` | 1 | 4 | Nur unterhalb der Gleichgewichtsfeuchte von ca. … | Nur unterhalb der mittleren Gleichgewichtsfeuchte von ca. … |
| `q_hol_2` | 1 | 3 | tangential ≈ radial, längs am größten | tangential ≈ radial, in Längsrichtung am größten |
| `q_kun_1` | 1 | 2 | Das Material schmilzt und wird sofort … | Das Material schmilzt vollständig und wird sofort … |
| `q_kun_1` | 1 | 3 | … durch thermische Nachvernetzung an | … durch thermische Nachvernetzung deutlich an |
| `q_kun_1` | 1 | 4 | Das Material wird spröde und glasartig … | Das Material wird oberhalb von T_g spröde und glasartig … |
| `q_mat_2` | 1 | 2 | Grüne Patina aus basischem … | Grünliche Patina aus basischem … |
| `q_bpi_1` | 1 | 3 | … und Transportbeton sind beide nur wenige Stunden … | … und Transportbeton sind gleichermaßen nur wenige Stunden … |
| `q_bpi_1` | 1 | 4 | … sind nur innerhalb einer Region normkonform | … sind nur innerhalb ihrer Herkunftsregion normkonform |
| `q_bin_2` | 1 | 2 | … ohne Bezug zur Anwendung | … ohne Bezug zur späteren Anwendung |
| `q_bin_2` | 1 | 3 | … den freien Warenverkehr im EU-Binnenmarkt | … den freien Warenverkehr der Bauprodukte im EU-Binnenmarkt |
| `q_bin_2` | 1 | 4 | … die CE-Kennzeichnung nach harmonisierter Norm | … die CE-Kennzeichnung nach einer harmonisierten Norm |
| `q_bre_1` | 1 | 2 | … Qualitäts- und Gütekriterien | … Qualitäts- und Gütekriterien des Herstellers |
| `q_bre_1` | 1 | 3 | … erfüllt die deutschen Bauwerksanforderungen | … erfüllt die deutschen bauaufsichtlichen Bauwerksanforderungen |
| `q_bre_1` | 1 | 4 | … vom DIBt bauaufsichtlich zugelassen | … vom DIBt bauaufsichtlich geprüft und zugelassen |
| `q_bre_3` | 1 | 2 | … Bauprodukte in Deutschland abgeschafft | … Bauprodukte in Deutschland wieder abgeschafft |
| `q_bft_1` | 1 | 2 | … unabhängig von der Festigkeit | … unabhängig von der erreichten Festigkeit |
| `q_bft_1` | 1 | 3 | … da die Fertigplatte trägt | … da die Fertigplatte allein trägt |
| `q_bbw_1` | 1 | 2 | Mittlere Würfeldruckfestigkeit ≥ 30 N/mm² … | Mittlere Druckfestigkeit am Würfel ≥ 30 N/mm² … |
| `q_bbw_1` | 1 | 3 | … ≥ 3,6 N/mm² ohne Anforderung an … | … ≥ 3,6 N/mm² je Stein ohne Anforderung an … |
| `q_bbw_1` | 1 | 4 | Mittel ≥ 2,9, Einzel ≥ 2,5 N/mm², … | Mittelwert ≥ 2,9, Einzelwert ≥ 2,5 N/mm², … |
| `q_bbw_2` | 1 | 3 | Ein erhöhter Luftporengehalt im … | Ein deutlich erhöhter Luftporengehalt im … |
| `q_bbw_2` | 1 | 4 | … der Bewehrung im Rohrscheitel | … der Bewehrung im gefährdeten Rohrscheitel |
| `q_btb_3` | 1 | 3 | Gips schmilzt bei Erwärmung und dichtet … | Gips schmilzt bei starker Erwärmung und dichtet … |
| `q_btb_3` | 1 | 4 | … und bildet eine Dämmschicht | … und bildet eine schützende Dämmschicht |
| `q_bpe_2` | 1 | 2 | … dampf- und wasserdicht ab | … dampf- und wasserdicht nach außen ab |
| `q_bpe_2` | 1 | 3 | … und neutralisiert sie | … und neutralisiert sie im Putz |
| `q_bbf_2` | 1 | 2 | … den Spreizdruck eines eingezogenen Konus | … den Spreizdruck eines beim Setzen eingezogenen Konus |
| `q_bbf_2` | 1 | 3 | … Formschluss in einem gebohrten Hinterschnitt | … Formschluss in einem nachträglich gebohrten Hinterschnitt |
| `q_bbf_2` | 1 | 4 | Über Reibung einer gespreizten Kunststoffhülse | Über Reibung einer beim Anziehen gespreizten Kunststoffhülse |
| `q_bfl_2` | 1 | 2 | Wasser verdunstet und Kunstharz verfilmt | Wasser verdunstet und das Kunstharz verfilmt |
| `q_bfl_2` | 1 | 3 | Polyaddition mit einem zugegebenen Härter | Polyaddition mit einem vor Ort zugegebenen Härter |
| `q_bfl_2` | 1 | 4 | Karbonatisierung von gelöstem Kalkhydrat | Karbonatisierung von im Wasser gelöstem Kalkhydrat |
| `q_bzm_2` | 1 | 2 | … elektrostatische Abstoßung der Partikel | … elektrostatische Abstoßung der Zementpartikel |
| `q_bzm_2` | 1 | 3 | Durch Beschleunigung der Zementhydratation | Durch gezielte Beschleunigung der frühen Zementhydratation |
| `q_bzm_2` | 1 | 4 | … feiner, stabiler Luftporen | … feiner, stabiler Luftporen in den Zementleim |
| `q_bpk_1` | 2 | 1 | … Elastizitätsmodul bei tiefer Temperatur (−20 °C) | … Elastizitätsmodul bei tiefer Prüftemperatur (−20 °C) |
| `q_bpk_1` | 2 | 4 | … Abnahme der Bruchdehnung bei Dauerbelastung | … Abnahme der Bruchdehnung unter langer Dauerbelastung |
| `q_bpk_2` | 2 | 1 | … offenzellig und dadurch kapillar wasseraktiv | … offenzellig und dadurch stark kapillar wasseraktiv |
| `q_bpk_2` | 2 | 3 | … nichtbrennbar und erreicht Euroklasse A1 | … nichtbrennbar und erreicht die Euroklasse A1 |
| `q_bpk_2` | 2 | 4 | EPS wird aus Polyvinylchlorid (PVC) hergestellt | EPS wird aus geschäumtem Polyvinylchlorid (PVC) hergestellt |
| `q_bpt_2` | 1 | 2 | … die Kupferfläche dabei grün | … die Kupferfläche dabei dauerhaft grün |
| `q_bpt_2` | 1 | 3 | Kupfer wird durch Zinkionen versprödet | Kupfer wird durch gelöste Zinkionen versprödet |
| `q_bps_6` | 1 | 2 | … die Flansche sonst rosten | … die Flansche sonst schneller rosten |
| `q_bps_6` | 1 | 3 | Weil W_z größer als W_y … | Weil W_z deutlich größer als W_y … |
| `qn_lca_ingenieurbau_4` | 3 | 2 | … vor allem durch Instandhaltung und Stau. | … vor allem durch geringere Instandhaltung und weniger Stau. |
| `qn_baustoffkenngroessen_2` | 3 | 1 | … lastunabhängig ist und nicht addiert wird | … lastunabhängig ist und daher nicht addiert wird |
| `qn_baustoffkenngroessen_2` | 3 | 4 | … aus Kriechstauchung und Schwindstauchung | … aus Kriechstauchung und zusätzlicher Schwindstauchung |
| `qn_bauchemie_2` | 1 | 3 | … Epoxidharz, die einen geschlossenen Polymerfilm bildet | … Epoxidharz, die einen geschlossenen, glänzenden Polymerfilm bildet |
| `qn_mechanische_pruefungen_1` | 4 | 1 | … 6,0 % die Grenze von 5,0 … | … 6,0 % die geforderte Grenze von 5,0 … |
| `qn_festbeton_statistik_3` | 2 | 1 | Konform, weil 42,0 N/mm² über … | Konform, weil der Mittelwert von 42,0 N/mm² über … |
| `qn_festbeton_statistik_3` | 2 | 4 | … kein Einzelwert unter f_ck − 4 … | … kein Einzelwert unter dem Grenzwert f_ck − 4 … |
| `qn_erdbau_3` | 3 | 1 | GW/GI/GE – Kies, frostsicher (F1) | GW/GI/GE – Kies, nicht frostempfindlich (F1) |
| `qn_stahl_2` | 4 | 2 | … Elastizitätsmodul durch die Profilform geringer ist | … Elastizitätsmodul durch die gedrungene Profilform geringer ist |
| `qn_stahl_2` | 4 | 3 | Weil ihre Flansche beim Walzen … | Weil ihre dicken Flansche beim Walzen … |
| `qn_holzwerkstoffe_2` | 2 | 1 | … aus Spänen, FU aus kreuzweise verleimten … | … aus Spänen, FU dagegen aus kreuzweise verleimten … |
| `qn_holzwerkstoffe_3` | 4 | 2 | Thermische Verwertung → Spanplatten → … | Thermische Verwertung → Holzfaserplatten → Spanplatten → … |
| `qn_bp_betonfertigteile_2` | 3 | 2 | … 5–6 cm dicke Schalen, deren Zwischenraum ausbetoniert … | … 5–6 cm dicke Fertigteilschalen, deren Zwischenraum ausbetoniert … |
| `qn_bp_betonfertigteile_3` | 1 | 2 | … nicht mit den Schalen verklebt | … nicht mit den Innenseiten der Schalen verklebt |
| `qn_bp_betonfertigteile_3` | 1 | 3 | … Gitterträger nicht vom Beton aufschwimmen | … Gitterträger nicht vom frischen Beton aufschwimmen |
| `qn_bp_dach_fassade_1` | 2 | 3 | Sie bestehen aus Naturschiefer und halten … | Sie bestehen aus gespaltenem Naturschiefer und halten … |
| `qn_bp_dach_fassade_1` | 2 | 4 | … aus Titanzink für flache Dächer | … aus Titanzink für flach geneigte Dächer |
| `qn_bp_verkehr_bitumen_1` | 4 | 1 | … aus wie ein Reaktionsharz | … aus wie ein duroplastisches Reaktionsharz |
| `qn_bp_verkehr_betondecken_1` | 4 | 1 | … und chemischem Angriff | … und chemischem Angriff im Boden |
| `qn_bp_verkehr_betondecken_1` | 4 | 3 | … hoher Hydratationswärme in massigen Bauteilen | … hoher Hydratationswärme in massigen, dicken Betonbauteilen |
| `qn_bp_verkehr_tiefbau_2` | 2 | 3 | … von Dachabflüssen zu Trinkwasser | … von Dachabflüssen zu nutzbarem Trinkwasser |
| `qn_bp_verkehr_tiefbau_2` | 2 | 4 | … Absenkung des Grundwasserspiegels | … Absenkung des Grundwasserspiegels im Baufeld |
| `qn_bp_klebstoffe_2` | 1 | 3 | … durch Lösemittel, Kohäsion nur durch Wasser | … durch Lösemittel, Kohäsion dagegen nur durch Wasser |
| `qn_bp_klebstoffe_2` | 1 | 4 | … gilt nur für poröse Untergründe | … gilt nur für saugfähige, poröse Untergründe |
| `qn_bp_farben_lacke_2` | 3 | 2 | … Lack bleibt dauerhaft flüssig | … Lack bleibt dauerhaft weich und flüssig |
| `qn_bp_farben_lacke_2` | 3 | 4 | … dem Bindemittel zu Calciumsilikat | … dem Bindemittel zu festem Calciumsilikat |
| `qn_nachbehandlung_3` | 2 | 1 | … thermisch zerfällt und reißt | … thermisch zerfällt und dabei reißt |
| `qn_innovative_werkstoffe_4` | 1 | 2 | Geopolymerbeton: zementfrei, aber nicht genormt und … | Geopolymerbeton: zementfrei, aber bislang nicht genormt und … |
| `qn_betonpraxis_1` | 2 | 1 | … 26,2 ≥ 25,5 N/mm², kleinster Wert ≥ 22,1 N/mm² | … 26,2 ≥ 25,5 N/mm² und kleinster Wert 25,5 ≥ 22,1 N/mm² |
| `qn_wu-bauwerke_1` | 3 | 2 | Braune Wanne (Bentonit) | Braune Wanne (mit Bentonit) |
| `qn_wu-bauwerke_1` | 3 | 4 | Weiße Wanne (WU-Beton) | Weiße Wanne (aus WU-Beton) |
| `qn_innenausbau_1` | 2 | 1 | … beide Messwerte unter 2,0 CM-% liegen | … beide Messwerte unter dem Grenzwert von 2,0 CM-% liegen |
| `qn_innenausbau_1` | 2 | 4 | … beide Messwerte über 0,3 CM-% liegen | … beide Messwerte über dem Grenzwert von 0,3 CM-% liegen |
| `qn_lca_ingenieurbau_x_2` | 1 | 2 | … Baustahls nach dem Rückbau | … Baustahls nach dem späteren Rückbau |
| `qn_modernisierung_3` | 3 | 2 | … 10 % der Dachfläche erneuert | … 10 % der gesamten Dachfläche erneuert |
| `qn_holzkorrosion_4` | 4 | 1 | … zeitweise erhöhte Luftfeuchte | … zeitweise erhöhte Luftfeuchte möglich |
| `qn_holzkorrosion_4` | 4 | 3 | … oder Süßwasserkontakt im Einbau | … oder Süßwasserkontakt im eingebauten Zustand |
| `qn_bauwerksunters_monitoring_2` | 2 | 1 | … den äußeren Millimetern | … den äußeren Millimetern des Balkens |
| `qn_bauwerksunters_monitoring_2` | 2 | 4 | Gesundes Holz mit typischer Jahrringschwankung der Dichte | Gesundes Holz mit der typischen Jahrringschwankung der Rohdichte |
| `qn_bauwerksunters_monitoring_4` | 4 | 3 | … drückt die Rissufer auseinander | … drückt die Rissufer weiter auseinander |
| `qn_instandhaltung_4` | 1 | 3 | … betreffen Holz, 5–8 Stahl und 9–11 Beton | … betreffen Holz, 5–8 Baustahl und 9–11 Stahlbeton |
| `qn_instandhaltung_4` | 1 | 4 | … Produktnormen für Mörtel | … Produktnormen für Mörtel und Beton |
| `qn_rechnung_beton_5` | 1 | 3 | … die den Zementleim kühlt und verdünnt | … die den Zementleim abkühlt und verdünnt |
| `qn_rechnung_beton_5` | 1 | 4 | … verzögerten Hydratation, weil Eis den Zement vorübergehend bindet | … verzögerten Hydratation, weil das Eis den Zement vorübergehend chemisch bindet |
| `qn_rechnung_stahlbeton_4` | 2 | 4 | … behebt das Problem zuverlässig | … behebt das Problem hier zuverlässig |
| `qn_bim_baustoffe_2` | 3 | 1 | … Bauphysik: E-Modul; LCA: Reinigungszyklen | … Bauphysik: E-Modul; LCA: Reinigungszyklen; FM: GWP |
| `qn_bim_baustoffe_2` | 3 | 2 | Tragwerk: GWP; Bauphysik: Querkontraktionszahl; FM: Wasserdampfdiffusionswiderstand μ | Tragwerk: GWP; Bauphysik: Querkontraktionszahl ν; FM: Wasserdampfdiffusionswiderstand μ |
| `qn_ki_prompting_1` | 1 | 2 | … Temperatur, Tokenlimit und Antwortsprache | … Temperatur, Tokenlimit und gewünschte Antwortsprache |
| `qn_ki_prompting_1` | 1 | 3 | … Paragraf, Prüfdatum und Prüfergebnis | … Paragraf, Prüfdatum und zugehöriges Prüfergebnis |
| `qn_ki_prompting_3` | 3 | 2 | … zwingend, da Dokumente über 100 Seiten nicht in den Kontext geladen werden | … zwingend, da Dokumente mit über 100 Seiten nicht in den Kontext geladen werden können |
| `qn_ki_lokal_4` | 1 | 2 | … "api.openai.com/v1" mit kostenpflichtigem API-Key | … "api.openai.com/v1" mit kostenpflichtigem OpenAI-API-Key |
| `qn_ki_lokal_4` | 1 | 3 | … = "http://localhost:8080/chat" mit Hugging-Face-Token | … = "http://localhost:8080/chat" mit persönlichem Hugging-Face-Token |
| `qn_ki_lokal_4` | 1 | 4 | base_url = "file://modelle/qwen.gguf" ohne Server-Start | base_url = "file://modelle/qwen.gguf" ganz ohne Start eines Servers |
| `qn_px_bauleitung_1` | 3 | 2 | … Verbesserung der Konsistenz Wasser zugeben | … Verbesserung der Konsistenz etwas Wasser zugeben |
| `qn_px_bauleitung_1` | 3 | 4 | … noch in der Klasse liegt | … noch in der bestellten Klasse liegt |
| `qn_px_bauleitung_3` | 4 | 2 | … mangelhafte Vorgabe: jeweils mündlicher Hinweis beim Jour fixe | … mangelhafte Vorgabe: jeweils nur ein mündlicher Hinweis beim wöchentlichen Jour fixe |
| `qn_px_bauleitung_3` | 4 | 3 | Fehlende Vorleistung: Mängelrüge (§ 13 … | Fehlende Vorleistung: schriftliche Mängelrüge (§ 13 … |
| `qn_px_bautagebuch_2` | 2 | 1 | … Abrechnung der Lohnstunden eingehen | … Abrechnung der Lohnstunden und Zuschläge eingehen |
| `qn_px_bautagebuch_2` | 2 | 3 | … Dokumentation für jede Baustelle vorschreibt | … Dokumentation für jede einzelne Baustelle vorschreibt |
| `qn_stahlbau_ec3_8` | 1 | 4 | Bei Stahlgüten ab S355 | Bei höherfesten Stahlgüten ab S355 |
| `qn_korrosionsschutz_beschichtungen_3` | 2 | 3 | … gebürstet bis zum Metallglanz | … gebürstet bis zum deutlichen Metallglanz |
| `qn_korrosionsschutz_beschichtungen_3` | 2 | 4 | … optisch reinen Stahl | … optisch reinen Stahl ohne Schatten |
| `qn_sommerlicher_waermeschutz_8` | 1 | 2 | … S_zul über den Kennwert S5 | … S_zul über den Zuschlagswert S5 |
| `qz24_ttest_5` | 3 | 2 | … ν konstant bei 1,96 | … ν konstant bei genau 1,96 |
| `qn_festigkeit_mohr_3` | 2 | 1 | … θ um den Kreismittelpunkt. | … θ um den Mittelpunkt des Kreises. |
| `qn_festigkeit_mohr_3` | 2 | 3 | … θ/2 um den Ursprung. | … θ/2 um den Koordinatenursprung. |
| `qn_festigkeit_mohr_3` | 2 | 4 | … 2θ um den Ursprung. | … 2θ um den Koordinatenursprung. |
| `qn_formaenderungen_bl_4` | 2 | 3 | Sie ist etwa gleich groß. | Sie ist praktisch gleich groß. |
| `qn_formaenderungen_bl_5` | 3 | 4 | Sie wird 2-mal so groß. | Sie wird doppelt so groß. |
| `qn_stahl_fec_5` | 3 | 1 | … E-Modul deutlich unter 210 000 N/mm². | … E-Modul deutlich unter den Wert von 210 000 N/mm². |
| `qn_stahl_fec_5` | 3 | 2 | … verringert die Korrosionsbeständigkeit sehr stark. | … verringert die Korrosionsbeständigkeit des Stahls sehr stark. |
| `qn_stahl_fec_5` | 3 | 4 | … C lässt sich Stahl nicht mehr warmwalzen. | … C lässt sich der Stahl nicht mehr wirtschaftlich warmwalzen. |

## Ergänzte normRef

| ID | Modul | normRef |
|---|---|---|
| `q_kenn_3` | materialkennwerte | DIN EN 338 |
| `q_recht_4` | regularien | MBO § 85a; MVV TB |
| `q_an_5` | analytik | DIN EN 196-2 |
| `qn_altholz_urban_mining_1` | altholz_urban_mining | AltholzV § 2 |
| `qn_altholz_urban_mining_2` | altholz_urban_mining | AltholzV § 3, Anhang I |
| `qn_pfas_baustoffe_3` | pfas_baustoffe | TrinkwV 2023, Anlage 2 |
| `qn_pfas_baustoffe_4` | pfas_baustoffe | VO (EG) Nr. 1907/2006 (REACH) |
| `qn_pfas_baustoffe_5` | pfas_baustoffe | TrinkwV 2023, Anlage 2 |
| `qn_pfas_baustoffe_6` | pfas_baustoffe | TrinkwV 2023, Anlage 2 |
| `q_hol_2` | holz | DIN 68100 |
| `q_asp_2` | asphalt | DIN EN 13108-6 |
| `q_mat_5` | materialitaet_architektur | DIN EN 10025-5 |
| `q_komb_vhf_1` | kombinationen | DIN 18516-1 |
| `q_fvb_2` | kombinationen | DAfStb-Richtlinie nichtmetallische Bewehrung 2024 |
| `q_bbw_2` | bp_betonwaren | DWA-M 168 |
| `q_bmw_2` | bp_mauerwerk | DIN 4109-32 |
| `q_bpd_3` | bp_daemmung | DIN EN 13163 |
| `q_bbf_2` | bp_befestigung | DIN EN 1992-4 |
| `q_bks_2` | bp_klebstoffe | DIN 18540 |
| `q_bzm_2` | bp_betonzusatzmittel | DIN EN 934-2 |
| `q_bpk_1` | bp_kunststoffe | DIN EN ISO 899-1 |
| `q_bpk_2` | bp_kunststoffe | DIN EN 13163 |
| `q_bpg_2` | bp_glaeser | DIN EN 12150-1 |
| `q_bpl_2` | bp_lehmbauprodukte | DIN 18945 |
| `q_bpt_1` | bp_metallisch | DIN EN 988 |
| `q_bps_1` | bp_stahlbauprofile | DIN EN 1993-1-1, 6.3 |
| `q_bps_6` | bp_stahlbauprofile | DIN EN 10365 |
| `q_iax_4` | innenausbau | IGG-Merkblatt 2 |
| `q_esx_3` | eigenspannungen | DIN EN 1991-1-5 |
| `qn_lca_regulatorik_1` | lca_regulatorik | VO (EU) 2024/3110 |
| `qn_lca_regulatorik_4` | lca_regulatorik | KrWG § 6 |
| `qn_einheiten_1` | einheiten | DIN 1301-1 |
| `qn_einheiten_2` | einheiten | DIN 1301-1 |
| `qn_baustoffkenngroessen_2` | baustoffkenngroessen | DIN EN 1992-1-1, 3.1.4 |
| `qn_bauchemie_2` | bauchemie | DIN EN 1504-2 |
| `qn_probenahme_1` | probenahme | DIN EN 14629 |
| `qn_statistik_2` | statistik | ISO 5725-2 |
| `qn_festbeton_statistik_1` | festbeton_statistik | DIN EN 12390-3 |
| `qn_mechanische_kenngroessen_1` | mechanische_kenngroessen | DIN EN 338 |
| `qn_mechanische_kenngroessen_3` | mechanische_kenngroessen | DIN EN 1992-1-1, 3.1.4 |
| `qn_materialmodelle_1` | materialmodelle | DIN EN 1992-1-1, 3.2.7 |
| `qn_knicken_1` | knicken | DIN EN 1993-1-1, 6.3.1 |
| `qn_knicken_2` | knicken | DIN EN 1993-1-1, 5.3.2 |
| `qn_bruchmechanik_4` | bruchmechanik | fib Model Code 2010, 5.1.5.2 |
| `qn_bodenmechanik_1` | bodenmechanik | DIN EN ISO 17892-12 |
| `qn_bodenmechanik_3` | bodenmechanik | DIN 4085 |
| `qn_bodenmechanik_4` | bodenmechanik | DIN 4019 |
| `qn_bauphysik_1` | bauphysik | DIN EN ISO 6946; GModG Anlage 7 |
| `qn_bauphysik_2` | bauphysik | DIN EN ISO 6946 |
| `qn_bauphysik_4` | feuchteschutz | DIN 4108-3 |
| `qn_feuchteschutz_1` | feuchteschutz | DIN EN ISO 13788 |
| `qn_feuchteschutz_3` | feuchteschutz | DIN 4108-3 |
| `qn_daemmung_vergleich_1` | daemmung_vergleich | DIN EN ISO 6946 |
| `qn_daemmung_vergleich_3` | daemmung_vergleich | DIN 4108-3 / DIN EN 15026 |
| `qn_energieausweis_1` | energieausweis | GModG Anlagen 4 und 10 |
| `qn_energieausweis_2` | energieausweis | DIN V 18599-2 |
| `qn_energieausweis_3` | energieausweis | GModG 2026 |
| `qn_gesteine_1` | gesteine | DIN 1045-2 |
| `qn_mauerwerk_1` | mauerwerk | DIN EN 1996-1-1/NA |
| `qn_mauerwerk_2` | mauerwerk | DIN EN 1996-1-1, 6.1.2.2 |
| `qn_lehm_3` | lehm | DIN 4126 |
| `qn_metalle_1` | metalle | DIN EN 988 |
| `qn_metalle_2` | metalle | DIN EN 10088-1 |
| `qn_holz_1` | holz | DIN 68100 |
| `qn_holzwerkstoffe_2` | holzwerkstoffe | DIN EN 14374 / DIN EN 636 |
| `qn_kunststoffe_3` | kunststoffe | DIN EN ISO 10318-1 |
| `qn_ausbau_3` | ausbau | DIN EN 12004-1 |
| `qn_bp_innovationen_2` | bp_innovationen | ISO 16290 |
| `qn_bp_innovationen_3` | bp_innovationen | VO (EU) 2024/3110 |
| `qn_bp_recht_konformitaet_3` | bp_recht_konformitaet | VO (EU) 2024/3110 |
| `qn_bp_recht_konformitaet_6` | bp_recht_konformitaet | VO (EU) Nr. 305/2011, Anhang V |
| `qn_bp_betonfertigteile_3` | bp_betonfertigteile | DIN 18218 |
| `qn_bp_betonfertigteile_4` | bp_betonfertigteile | DIN EN 1168 |
| `qn_bp_betonwaren_4` | bp_betonwaren | DWA-M 168 |
| `qn_bp_mauerwerk_4` | bp_mauerwerk | DIN EN 771-1 / DIN EN 998-2 |
| `qn_bp_verkehr_asphalt_4` | bp_verkehr_asphalt | DIN EN 13108-6 |
| `qn_bp_verkehr_asphalt_6` | bp_verkehr_asphalt | ZTV Beton-StB |
| `qn_bp_verkehr_bitumen_1` | bp_verkehr_bitumen | DIN EN 12591 |
| `qn_bp_verkehr_bitumen_5` | bp_verkehr_bitumen | DIN EN 14023 |
| `qn_bp_verkehr_pruefung_3` | bp_verkehr_pruefung | DIN EN 12697-5 |
| `qn_bp_verkehr_pruefung_4` | bp_verkehr_pruefung | DIN EN 12697-8 |
| `qn_bp_verkehr_pruefung_6` | bp_verkehr_pruefung | DIN EN 12697-30 |
| `qn_bp_verkehr_betondecken_5` | bp_verkehr_betondecken | ZTV Beton-StB |
| `qn_bp_verkehr_tiefbau_5` | bp_verkehr_tiefbau | DWA-A 138 |
| `qn_bp_verkehr_tiefbau_6` | bp_verkehr_tiefbau | DWA-A 138 |
| `qn_bp_verkehr_bahn_3` | bp_verkehr_bahn | DIN EN 13674-1 |
| `qn_bp_verkehr_tunnel_4` | bp_verkehr_tunnel | DIN EN 1992-1-1/NA, 3.1.6 |
| `qn_bp_kunststoffe_3` | bp_kunststoffe | DIN EN 1401-1 / DIN EN 1451-1 |
| `qn_bp_mineralisch_3` | bp_mineralisch | DIN EN ISO 10545-3 |
| `qn_grundlagen_3` | grundlagen | DIN EN 206 / DIN 1045-2 |
| `qn_bindemittel_2` | bindemittel | DIN EN 197-1 |
| `qn_mischungsberechnung_1` | mischungsberechnung | DIN EN 206 |
| `qn_mischungsberechnung_4` | mischungsberechnung | DIN 1045-2 |
| `qn_nachbehandlung_1` | nachbehandlung | ACI 305R |
| `qn_nachbehandlung_4` | nachbehandlung | DIN 1045-3 |
| `qn_festbeton_3` | festbeton | DIN EN 12390-3 |
| `qn_sichtbeton_3` | sichtbeton | DBV/VDZ-Merkblatt Sichtbeton (2015) |
| `qn_sichtbeton_4` | sichtbeton | DBV/VDZ-Merkblatt Sichtbeton (2015) |
| `qn_carbonbeton_1` | carbonbeton | DAfStb-Richtlinie nichtmetallische Bewehrung 2024 |
| `qn_carbonbeton_2` | carbonbeton | DAfStb-Richtlinie nichtmetallische Bewehrung 2024 |
| `qn_holzbau_verbindung_4` | holzbau_verbindung | DIN EN 1995-1-1, 8.7.2 |
| `qn_holzbau_bauphysik_5` | holzbau_bauphysik | DIN EN 1995-1-1, 7.3 |
| `qn_spannbeton_1` | spannbeton | DIN EN 1992-1-1, 5.10.6 |
| `qn_materialoptimierung_2` | materialoptimierung | DIN 1045-2 |
| `qn_materialoptimierung_3` | materialoptimierung | DIN EN 15804+A2 |
| `qn_kreislauf_dpp_3` | kreislauf_dpp | DIN EN 12620 / DIN 4226-101 |
| `qn_lebenszyklus_kosten_2` | lebenszyklus_kosten | ISO 15686-5 |
| `qn_lebenszyklus_kosten_3` | lebenszyklus_kosten | ISO 15686-5 |
| `qn_lebenszyklus_kosten_4` | lebenszyklus_kosten | VOB/A § 9d |
| `qn_bauwerkserfassung_1` | bauwerkserfassung | Eckstein, Genauigkeitsstufen |
| `qn_denkmalpflege_2` | denkmalpflege | DIN EN ISO 6946 |
| `qn_bauwerksuntersuchung_2` | bauwerksuntersuchung | DIN EN 13791 |
| `qn_bauwerksuntersuchung_3` | bauwerksuntersuchung | DIN EN 14629 |
| `qn_historische_bauprodukte_3` | historische_bauprodukte | TRGS 551 |
| `qn_rueckbau_4` | rueckbau | RuVA-StB 01 |
| `qn_boden_materialaufbereitung_2` | boden_materialaufbereitung | DIN EN 15934 |
| `qn_boden_materialaufbereitung_3` | boden_materialaufbereitung | LAGA PN 98 |
| `qn_korrosion_1` | korrosion | DIN EN 12390-12 |
| `qn_korrosion_2` | korrosion | fib Bulletin 34 |
| `qn_schadreaktionen_beton_2` | schadreaktionen_beton | DAfStb-Alkali-Richtlinie (2013-10) |
| `qn_schadreaktionen_beton_3` | schadreaktionen_beton | DIN EN 480-11 |
| `qn_schadreaktionen_beton_4` | schadreaktionen_beton | DAfStb-Alkali-Richtlinie (2013-10) |
| `qn_holzkorrosion_1` | holzkorrosion | DIN 68800-4 |
| `qn_holzkorrosion_2` | holzkorrosion | DIN 68800-4 |
| `qn_holzkorrosion_3` | holzkorrosion | DIN 68800-3 |
| `qn_metallkorrosion_4` | metallkorrosion | DIN EN 1993-1-4, Anhang A |
| `qn_vdi6200_3` | vdi6200 | RI-EBW-PRÜF |
| `qn_instandsetzung_materialien_1` | instandsetzung_materialien | DIN EN ISO 14713-1 |
| `qn_instandhaltung_3` | instandhaltung | TR Instandhaltung / DIN V 18026 |
| `qn_rechnung_u_wert_3` | rechnung_u_wert | DIN EN ISO 6946; GModG Anlage 7 |
| `qn_rechnung_u_wert_4` | rechnung_u_wert | DIN EN ISO 6946; GModG Anlage 7 |
| `qn_rechnung_u_wert_5` | rechnung_u_wert | DIN EN ISO 6946 |
| `qn_rechnung_u_wert_6` | rechnung_u_wert | DIN EN ISO 6946 |
| `qn_rechnung_beton_6` | rechnung_beton | DIN EN 1992-1-1, Gl. (3.2) |
| `qn_rechnung_nachhaltigkeit_5` | rechnung_nachhaltigkeit | DIN 1045-3 |
| `qn_rechnung_bestand_1` | rechnung_bestand | DIN EN 1992-1-1/NA, 3.1.6 |
| `qn_rechnung_bestand_5` | rechnung_bestand | DIN EN 13791 |
| `qn_bim_baustoffe_1` | bim_baustoffe | ISO 16739-1:2024 |
| `qn_dpp_3` | dpp | VO (EU) 2024/1781 (ESPR) |
| `qn_px_bautagebuch_2` | px_bautagebuch | DIN 1045-3 |
| `qn_px_karriere_4` | px_karriere | Baukammerngesetze der Länder (z. B. BayBauKaG) |
| `qn_keramik_ziegel_4` | keramik_ziegel | DIN EN 771-1 |
| `qn_keramik_ziegel_6` | keramik_ziegel | DIN EN 14411 / DIN EN ISO 10545-12 |
| `qn_korrosionsschutz_beschichtungen_4` | korrosionsschutz_beschichtungen | DIN EN ISO 14713-1 |
| `qn_membranen_etfe_1` | membranen_etfe | CEN/TS 19102:2023 |
| `qn_membranen_etfe_2` | membranen_etfe | CEN/TS 19102:2023 |
| `qn_membranen_etfe_7` | membranen_etfe | CEN/TS 19102:2023 |
| `qn_membranen_etfe_8` | membranen_etfe | CEN/TS 19102:2023 |
| `qn_schnellkarbonatisierung_4` | schnellkarbonatisierung | DIN EN 12390-12 |
| `qn_labor_potentialmessung_1` | labor_potentialmessung | ASTM C876 |
| `qn_labor_potentialmessung_2` | labor_potentialmessung | ASTM C876 |
| `qn_labor_frischbeton_4` | labor_frischbeton | DIN EN 12350-6 / DIN EN 12350-7 |
| `qn_festigkeit_mohr_5` | festigkeit | DIN EN 1993-1-1, 6.2.1 |

## Ohne normRef verbleibend (276 Fragen)

Davon 2 freigegeben (nicht änderbar) und 4 parallel bearbeitet (`qn_rechnung_mauerwerk_*`); die übrigen sind Grundlagen-, Rechen-, Geschichts-, KI- oder Fallbeispielfragen ohne tragenden Normbezug. Nach Modul:

- **altholz_urban_mining** (5): `qn_altholz_urban_mining_3`, `qn_altholz_urban_mining_4`, `qn_altholz_urban_mining_5`, `qn_altholz_urban_mining_6`, `qn_altholz_urban_mining_7`
- **ausbau** (2): `qn_ausbau_1`, `qn_ausbau_2`
- **bauchemie** (2): `q_bch_4`, `qn_bauchemie_1`
- **baustatik** (4): `qn_baustatik_1`, `qn_baustatik_2`, `qn_baustatik_3`, `qn_baustatik_4`
- **baustoffkenngroessen** (2): `q_kg_5`, `qn_baustoffkenngroessen_1`
- **baustoffkunde** (6): `q_bk_1`, `q_bk_2`, `q_bk_3`, `qn_baustoffkunde_1`, `qn_baustoffkunde_2`, `qn_baustoffkunde_3`
- **bauwerkserfassung** (2): `qn_bauwerkserfassung_2`, `qn_bauwerkserfassung_3`
- **bauwerksunters_monitoring** (3): `qn_bauwerksunters_monitoring_1`, `qn_bauwerksunters_monitoring_2`, `qn_bauwerksunters_monitoring_4`
- **bim_baustoffe** (2): `qn_bim_baustoffe_2`, `qn_bim_baustoffe_4`
- **bindemittel** (1): `qn_grundlagen_1`
- **biokohlebeton** (4): `qn_biokohlebeton_1`, `qn_biokohlebeton_2`, `qn_biokohlebeton_3`, `qn_biokohlebeton_6`
- **boden_materialaufbereitung** (1): `qn_boden_materialaufbereitung_4`
- **bodenmechanik** (1): `qn_bodenmechanik_2`
- **bp_baustoffindustrie** (4): `q_bpi_1`, `q_bpi_2`, `q_bpi_3`, `q_bpi_5`
- **bp_betonzusatzmittel** (1): `q_bzm_3`
- **bp_farben_lacke** (2): `qn_bp_farben_lacke_2`, `qn_bp_farben_lacke_3`
- **bp_innovationen** (1): `qn_bp_innovationen_1`
- **bp_klebstoffe** (1): `qn_bp_klebstoffe_2`
- **bp_kunststoffe** (2): `qn_bp_kunststoffe_1`, `qn_bp_kunststoffe_2`
- **bp_metallisch** (1): `q_bpt_2`
- **bp_mineralisch** (1): `qn_bp_mineralisch_4`
- **bp_putz_estrich** (1): `q_bpe_1`
- **bp_recht_konformitaet** (1): `qn_bp_recht_konformitaet_4`
- **bp_trockenbau** (2): `q_btb_2`, `qn_bp_trockenbau_2`
- **bp_verkehr_bahn** (4): `qn_bp_verkehr_bahn_1`, `qn_bp_verkehr_bahn_4`, `qn_bp_verkehr_bahn_5`, `qn_bp_verkehr_bahn_6`
- **bp_verkehr_betondecken** (1): `qn_bp_verkehr_betondecken_3`
- **bp_verkehr_tunnel** (4): `qn_bp_verkehr_tunnel_1`, `qn_bp_verkehr_tunnel_3`, `qn_bp_verkehr_tunnel_5`, `qn_bp_verkehr_tunnel_6`
- **bp_verkehrswegebau** (1): `q_vwb_3`
- **bruchmechanik** (3): `qn_bruchmechanik_1`, `qn_bruchmechanik_2`, `qn_bruchmechanik_3`
- **daemmung_vergleich** (2): `qn_daemmung_vergleich_2`, `qn_daemmung_vergleich_4`
- **dauerhaftigkeit** (1): `qn_dauerhaftigkeit_2`
- **denkmalpflege** (1): `qn_denkmalpflege_1`
- **eigenspannungen** (5): `q_esx_1`, `q_esx_2`, `q_esx_4`, `q_esx_5`, `q_esx_6`
- **emodul** (3): `q_emod_2`, `qn_emodul_2`, `qn_emodul_3`
- **energieausweis** (1): `qn_energieausweis_4`
- **festigkeit** (10): `q_fest_1`, `qn_festigkeit_1`, `qn_festigkeit_2`, `qn_festigkeit_3`, `qn_festigkeit_4`, `qn_festigkeit_5`, `qn_festigkeit_mohr_1`, `qn_festigkeit_mohr_2`, `qn_festigkeit_mohr_3`, `qn_festigkeit_mohr_4`
- **formaenderungen** (9): `q_form_1`, `qn_formaenderungen_1`, `qn_formaenderungen_2`, `qn_formaenderungen_3`, `qn_formaenderungen_bl_1`, `qn_formaenderungen_bl_2`, `qn_formaenderungen_bl_3`, `qn_formaenderungen_bl_4`, `qn_formaenderungen_bl_5`
- **frischbeton** (2): `qn_frischbeton_1`, `qn_frischbeton_3`
- **gesteine** (1): `qn_gesteine_2`
- **gips** (2): `qn_gips_1`, `qn_gips_2`
- **glas** (2): `qn_glas_1`, `qn_glas_3`
- **herstellung_einbau** (3): `qn_herstellung_einbau_1`, `qn_herstellung_einbau_2`, `qn_herstellung_einbau_4`
- **historische_bauprodukte** (2): `qn_historische_bauprodukte_1`, `qn_historische_bauprodukte_2`
- **historische_bauweisen** (4): `qn_historische_bauweisen_1`, `qn_historische_bauweisen_2`, `qn_historische_bauweisen_3`, `qn_historische_bauweisen_4`
- **holz** (1): `q_hol_1`
- **holzbau_bauphysik** (1): `qn_holzbau_bauphysik_6`
- **holzbau_konstruktion** (5): `qn_holzbau_konstruktion_1`, `qn_holzbau_konstruktion_2`, `qn_holzbau_konstruktion_3`, `qn_holzbau_konstruktion_4`, `qn_holzbau_konstruktion_5`
- **holzwerkstoffe** (1): `qn_holzwerkstoffe_3`
- **hydratation_folgen** (3): `q_hyf_3`, `q_hyf_4`, `q_hyf_5`
- **innenausbau** (3): `q_iax_2`, `qn_innenausbau_1`, `qn_innenausbau_2`
- **innovative_werkstoffe** (3): `qn_innovative_werkstoffe_1`, `qn_innovative_werkstoffe_2`, `qn_innovative_werkstoffe_3`
- **instandsetzung_checklisten** (1): `q_is_cl_5`
- **instandsetzung_materialien** (1): `qn_instandsetzung_materialien_2`
- **kalk** (1): `qn_kalk_1`
- **keramik_ziegel** (2): `qn_keramik_ziegel_1`, `qn_keramik_ziegel_7`
- **ki_baustoffe** (3): `q_ki_bs_4`, `q_ki_bs_5`, `q_ki_bs_6`
- **ki_llmpraxis** (4): `qn_ki_llmpraxis_1`, `qn_ki_llmpraxis_2`, `qn_ki_llmpraxis_3`, `qn_ki_llmpraxis_4`
- **ki_lokal** (4): `qn_ki_lokal_1`, `qn_ki_lokal_2`, `qn_ki_lokal_3`, `qn_ki_lokal_4`
- **ki_onlinekurse** (3): `q_ki_ok_3`, `q_ki_ok_5`, `q_ki_ok_6`
- **ki_prompting** (4): `qn_ki_prompting_1`, `qn_ki_prompting_2`, `qn_ki_prompting_3`, `qn_ki_prompting_4`
- **ki_ressourcen** (4): `q_ki_rs_3`, `q_ki_rs_4`, `q_ki_rs_5`, `q_ki_rs_6`
- **ki_system** (4): `qn_ki_system_1`, `qn_ki_system_2`, `qn_ki_system_3`, `qn_ki_system_4`
- **ki_thesen** (4): `qn_ki_thesen_1`, `qn_ki_thesen_2`, `qn_ki_thesen_3`, `qn_ki_thesen_4`
- **knicken** (2): `qn_knicken_3`, `qn_knicken_4`
- **kombinationen** (1): `q_komb_sandwich_1`
- **korrosion** (2): `qn_korrosion_3`, `qn_korrosion_4`
- **korrosionsschutz_beschichtungen** (1): `qn_korrosionsschutz_beschichtungen_5`
- **kreislauf_dpp** (2): `q_circular_1 (verified)`, `qn_kreislauf_dpp_1`
- **kunststoffe** (5): `q_kun_1`, `q_kun_2`, `q_kun_3`, `qn_kunststoffe_1`, `qn_kunststoffe_2`
- **kuriositaeten** (3): `q_ku_3`, `q_ku_4`, `q_ku_6`
- **labor_auslagerung** (4): `qn_labor_auslagerung_3`, `qn_labor_auslagerung_4`, `qn_labor_auslagerung_5`, `qn_labor_auslagerung_6`
- **labor_potentialmessung** (3): `qn_labor_potentialmessung_3`, `qn_labor_potentialmessung_4`, `qn_labor_potentialmessung_6`
- **lca_rechner** (1): `qn_lca_rechner_5`
- **lca_regulatorik** (2): `qn_lca_regulatorik_2`, `qn_lca_regulatorik_3`
- **lehm** (2): `qn_lehm_1`, `qn_lehm_2`
- **material_schaeden_gross** (3): `q_ms_mg_4`, `q_ms_mg_5`, `q_ms_mg_6`
- **materialitaet_architektur** (5): `q_mat_1`, `q_mat_2`, `q_mat_3`, `q_mat_4`, `q_mat_6`
- **materialmodelle** (3): `qn_materialmodelle_2`, `qn_materialmodelle_3`, `qn_materialmodelle_4`
- **materialoptimierung** (2): `qn_materialoptimierung_1`, `qn_materialoptimierung_4`
- **materialpaesse** (4): `qn_materialpaesse_1`, `qn_materialpaesse_2`, `qn_materialpaesse_3`, `qn_materialpaesse_4`
- **mechanische_kenngroessen** (1): `qn_mechanische_kenngroessen_2`
- **membranen_etfe** (3): `qn_membranen_etfe_3`, `qn_membranen_etfe_4`, `qn_membranen_etfe_6`
- **metallkorrosion** (2): `qn_metallkorrosion_1`, `qn_metallkorrosion_3`
- **mischungsberechnung** (1): `qn_mischungsberechnung_3`
- **modernisierung** (2): `qn_modernisierung_2`, `qn_modernisierung_4`
- **nachbehandlung** (1): `qn_nachbehandlung_3`
- **nawaro** (3): `q_naw_1`, `qn_nawaro_2`, `qn_nawaro_3`
- **pfas_baustoffe** (3): `qn_pfas_baustoffe_1`, `qn_pfas_baustoffe_2`, `qn_pfas_baustoffe_7`
- **putzemoertel** (1): `qn_putzemoertel_1`
- **px_bauleitung** (1): `qn_px_bauleitung_4`
- **px_karriere** (3): `qn_px_karriere_1`, `qn_px_karriere_2`, `qn_px_karriere_3`
- **qualitaetssicherung** (1): `q_qsi_6`
- **rechnung_bestand** (3): `qn_rechnung_bestand_3`, `qn_rechnung_bestand_4`, `qn_rechnung_bestand_6`
- **rechnung_beton** (2): `qn_rechnung_beton_4`, `qn_rechnung_beton_5`
- **rechnung_nachhaltigkeit** (5): `qn_rechnung_nachhaltigkeit_1`, `qn_rechnung_nachhaltigkeit_2`, `qn_rechnung_nachhaltigkeit_3`, `qn_rechnung_nachhaltigkeit_4`, `qn_rechnung_nachhaltigkeit_6`
- **rechnung_stahlbeton** (1): `qn_rechnung_stahlbeton_5`
- **ressourcen_umwelt** (3): `qn_ressourcen_umwelt_2`, `qn_ressourcen_umwelt_3`, `qn_ressourcen_umwelt_4`
- **ressourceneffizienz** (4): `qn_ressourceneffizienz_1`, `qn_ressourceneffizienz_2`, `qn_ressourceneffizienz_3`, `qn_ressourceneffizienz_4`
- **rueckbau** (3): `qn_rueckbau_1`, `qn_rueckbau_2`, `qn_rueckbau_3`
- **schadensbilder** (1): `q_dauer_2 (verified)`
- **schadreaktionen_beton** (1): `qn_schadreaktionen_beton_1`
- **schnellkarbonatisierung** (1): `qn_schnellkarbonatisierung_2`
- **schutz_grundlagen** (2): `q_is_sg_3`, `q_is_sg_4`
- **sonstiges** (4): `q_son_2`, `qn_sonstiges_1`, `qn_sonstiges_2`, `qn_sonstiges_4`
- **spannbeton** (5): `qn_spannbeton_3`, `qn_spannbeton_4`, `qn_spannbeton_7`, `qn_spannbeton_8`, `qn_spannbeton_10`
- **stahl** (3): `qn_stahl_fec_1`, `qn_stahl_fec_2`, `qn_stahl_fec_3`
- **statistik** (1): `qn_statistik_3`
- **weitere_organik** (3): `qn_weitere_organik_2`, `qn_weitere_organik_3`, `qn_weitere_organik_4`
- **wta** (1): `q_is_wta_3`
- **wu-bauwerke** (1): `qn_wu-bauwerke_1`

## Anhang: ersetzte frühere Vorprüfungsvermerke

| ID | früher am | Ergebnis | Hinweis (gekürzt) |
|---|---|---|---|
| `qn_bauphysik_5` | 2026-10-25 | korrigiert | Rückmeldung zu Option 4 berichtigt |
| `q_ndr_2` | 2026-10-26 | korrigiert | Richtige Antwort und Erklärung auf den Stand 26.10.2026 gebracht: neuer Entwurf von BMJV/BMWSB vorgelegt, Länder- und Verbändeanhörung, noch |
| `q_sob_2` | 2026-10-25 | korrigiert | Erklärung: veraltete Zeitangabe „Stand Herbst 2024“ entfernt, Zulassung/ZiE ergänzt |
| `q_bre_1` | 2026-10-25 | korrigiert | Lösung sprachlich präzisiert |
| `q_bbw_1` | 2026-10-25 | korrigiert | Lösung: „Mittel“ → „Charakteristisch“; Rückmeldung 3 und Erklärung angepasst |
| `qn_lca_ingenieurbau_4` | 2026-10-25 | korrigiert | Erklärung: Kennwert 863 t/(1 500 m² · 100 a) = 5,75 statt 5,76; Nettovorteil 38 t (inkl. Modul C) ergänzt. |
| `qn_probenahme_1` | 2026-10-25 | korrigiert | Distraktor 4 und Rückmeldung: Rechenweg passte nicht (1,0 g ≠ 0,785 cm³) |
| `qn_feuchteschutz_3` | 2026-10-25 | korrigiert | Erklärung: verschachtelte Rechnung entwirrt |
| `qn_gesteine_1` | 2026-10-25 | korrigiert | Distraktor 1: 6,06 → 5,06 (Summe der Durchgänge = 506) |
| `qn_mischungsberechnung_1` | 2026-10-25 | korrigiert | Rückmeldung zu Option 3: 177,5 = 170 + Kernfeuchte |
| `qn_lebenszyklus_kosten_4` | 2026-10-25 | korrigiert | Distraktor 115 000 € → 108 000 €, damit Wert und Rückmeldung (35 % Aufschlag) übereinstimmen. |
| `qn_sommerlicher_waermeschutz_8` | 2026-10-25 | ok | Ausgabe 2013-02 bewusst zitiert (§ 14 GModG nimmt sie in Bezug); die Registry führt die Neuausgabe DIN 4108-2:2026-05 – der Abgleich der Tab |

