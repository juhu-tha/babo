import sys
from patch_modules import update_file

# Module 60: BetonAZ.tsx
beton_a_z_replacements = [
    # [3C15]
    ("Status: Regelkonform (EBV 2023)", "Status: Normgrundlage DIN EN 206 / DIN 1045-2:2023-08"),
    # [3C18]
    ("w/z-Wert von ca. 0.40 benötigt (wasserfreies Gesteinsgel)",
     "w/z-Wert von ca. 0,40 benötigt (ca. 0,25 chemisch gebunden, ca. 0,15 als Gelwasser in den Gelporen des Zementgels)."),
    ("w/z-Wert von ca. 0,40 benötigt (wasserfreies Gesteinsgel)",
     "w/z-Wert von ca. 0,40 benötigt (ca. 0,25 chemisch gebunden, ca. 0,15 als Gelwasser in den Gelporen des Zementgels)."),
    # [3C25]
    ("Vorhaltemaß Δ cdev beträgt standardmäßig 10 mm",
     "Das Vorhaltemaß Δc_dev beträgt nach DIN EN 1992-1-1/NA 15 mm (bei XC1 10 mm) und darf bei entsprechender Qualitätskontrolle um 5 mm reduziert werden."),
    ("Vorhaltemaß Δc_dev beträgt standardmäßig 10 mm",
     "Das Vorhaltemaß Δc_dev beträgt nach DIN EN 1992-1-1/NA 15 mm (bei XC1 10 mm) und darf bei entsprechender Qualitätskontrolle um 5 mm reduziert werden."),
    # [3C28]
    ("Prinzip I: Kathodischer Korrosionsschutz", "Prinzip 10: KATHODISCHER SCHUTZ (KKS)"),
    ("Prinzip II: Mechanischer Mörtelersatz",
     "Prinzip 7 (mit Prinzip 3): ERHALT BZW. WIEDERHERSTELLUNG DER PASSIVITÄT DURCH BETONERSATZ – Entfernung des karbonatisierten Betons, ggf. Beschichtung des Stahls (Prinzip 11) und Reprofilierung mit PCC/SPCC-Mörteln."),
    # [3C29]
    ("PCC / SPCC Harzmörteln", "Schichtaufbau mit kunststoffmodifizierten Zementmörteln (PCC / SPCC)"),
    # [3C17]
    ("Quelle: DIN EN 206-1", "Quelle: DIN EN 206 / DIN 1045-2"),
    ("Zementsorten nach DIN EN 206-1", "Zulässigen w/z-Wert, Mindestzementgehalt sowie die erlaubten Zementarten nach DIN EN 206 in Verbindung mit DIN 1045-2 für das Bauteil vorgeben. Quelle: DIN EN 206 / DIN 1045-2"),
    # [3C27]
    ("Schäden ... nach Richtlinie DIN EN 1504 behoben",
     "Schäden durch Betonalterung werden nach den Instandsetzungsprinzipien der Normenreihe DIN EN 1504 behoben, in Deutschland bauaufsichtlich geregelt durch die Technische Regel Instandhaltung von Betonbauwerken (TR Instandhaltung, DIBt)."),
    ("Schäden durch Betonalterung werden nach Richtlinie DIN EN 1504 behoben",
     "Schäden durch Betonalterung werden nach den Instandsetzungsprinzipien der Normenreihe DIN EN 1504 behoben, in Deutschland bauaufsichtlich geregelt durch die Technische Regel Instandhaltung von Betonbauwerken (TR Instandhaltung, DIBt)."),
    # [3C16]
    ("Stoffraumgleichung nach DIN 1045-2",
     "Grundlage jeder Betonrezeptur ist die Stoffraumrechnung (absolute Volumenrechnung) als betontechnologisches Grundprinzip; DIN EN 206/DIN 1045-2 legen die Grenzwerte (w/z, Zementgehalt, Luftgehalt) fest."),
    # [3C19]
    ("w/z ≤ 0.40 (UHP-Beton)", "w/z ≤ 0,40 (hochfester Beton; UHPC ca. 0,20–0,25)"),
    ("w/z ≤ 0,40 (UHP-Beton)", "w/z ≤ 0,40 (hochfester Beton; UHPC ca. 0,20–0,25)"),
    # [3C20]
    ("Kapillarporenvolumen steigt drastisch an", "Kapillarporosität des Zementsteins (nach Powers, Hydratationsgrad 0,8–1,0): w/z 0,40 ca. 5–15 %; w/z 0,45–0,50 ca. 12–26 %; w/z 0,60 ca. 26–34 %."),
    # [3C21]
    ("F5 / F6 ≥ 560 mm Fließfähig / Selbstverdichtender Beton SVB",
     "F5 560–620 mm fließfähig, F6 ≥ 630 mm sehr fließfähig; selbstverdichtender Beton wird gesondert über das Setzfließmaß (SF1 550–650, SF2 660–750, SF3 760–850 mm) klassifiziert."),
    # [3C23]
    ("Mittlere elastische Zugfestigkeit f_ctm", "Mittlere zentrische Zugfestigkeit f_ctm"),
    # [3C24]
    ("Carbonatisierung (Säureangriff durch CO₂)", "Carbonatisierung (Neutralisation des Porenwassers durch CO₂, pH-Abfall)"),
    ("einMindestmaß der Betondeckung (cnom)", "ein Nennmaß der Betondeckung (c_nom = c_min + Δc_dev)"),
    # [3C30]
    ("Freistemmen ... bis auf rostfreien Untergrund (Sa 2½)",
     "Die Reprofilierung erfordert das Freilegen des korrodierten Stahls, das Entrosten durch Strahlen auf den im Instandsetzungskonzept festgelegten Oberflächenvorbereitungsgrad (DIN EN ISO 8501-1) und das Verfüllen mit einem für das Verfahren zugelassenen Instandsetzungsmörtel (z. B. PCC)."),
    # [3C31]
    ("Haftzugfestigkeit zwingend ≥ 1.5 N/mm²",
     "Die Oberflächenzugfestigkeit des Altbetons ist vor Reprofilierung oder Beschichtung zu prüfen; die Anforderungen (Mittelwert und kleinster Einzelwert, z. B. 1,5/1,0 N/mm² bei PCC) richten sich nach Verfahren und System gemäß TR Instandhaltung."),
    # [3C32]
    ("amtliche Erstprüfungszeugnis der ... Betonwerksrezeptur",
     "Sicherstellen, dass für die verwendete Betonzusammensetzung die Erstprüfung des Herstellers nach DIN EN 206/DIN 1045-2 vorliegt."),
    # [3C22]
    ("\\exp\\le ft(s", "\\exp\\{s"),
    # [3C33]
    ("DIN EN 13670:2010-06", "DIN EN 13670:2011-03")
]
update_file("src/modules/BetonAZ.tsx", beton_a_z_replacements)

# Module 61: Betonpraxis.tsx
betonpraxis_replacements = [
    # [3C41]
    ("nach DIN 1045-2 / Dr. Krell Regelwerk", "nach DIN 1045-3 / DIN EN 13670, ergänzt durch Krell"),
    # [3C42]
    ("Bei 5 - 9 °C: Mindestens 4 Tage",
     "Mindestdauer der Nachbehandlung nach DIN 1045-3 (Tage für r ≥ 0,50 / r ≥ 0,30 / r ≥ 0,15 / r < 0,15): ≥ 25 °C: 1 / 2 / 2 / 3 – 15 bis < 25 °C: 1 / 2 / 4 / 5 – 10 bis < 15 °C: 2 / 4 / 7 / 10 – 5 bis < 10 °C: 3 / 6 / 10 / 15. ZTV-ING: Werte verdoppeln."),
    # [3C44]
    ("XC2: C25/30, max w/z 0.65", "XC2: Min. Güteklasse C16/20, max w/z 0,75, Nass, selten trocken. XC3: Min. Güteklasse C20/25, max w/z 0,65, Mäßige Feuchte."),
    # [3C45]
    ("nach DIN 1045-2 geforderte Nennmaß der Betonüberdeckung c_nom",
     "nach DIN EN 1992-1-1/NA (Abschnitt 4.4.1) erforderliche Nennmaß der Betondeckung c_nom [mm] aus Stabdurchmesser (c_min,b) und Expositionsklasse (c_min,dur)"),
    # [3C46]
    ("Grenzmaß c_nom = ... Vorhaltemaß Δc_dev (10 mm)",
     "Nennmaß c_nom = Mindestbetondeckung c_min + Vorhaltemaß Δc_dev (Δc_dev = 15 mm, bei XC1 10 mm; Reduktion um 5 mm nur bei qualitätssichernden Maßnahmen nach EC2/NA 4.4.1.3)."),
    # [3C49]
    ("(w/z)_eq ≤ 0,50 und min. C30/37 für XD2/3, XS2/3, XF2/3",
     "Erleichterung nach DIN 1045-2 für langsam und sehr langsam erhärtende Betone (r < 0,30): Mindestdruckfestigkeitsklasse eine Klasse niedriger, der höchstzulässige w/z-Wert bleibt unverändert – XD2/XS2, XF2/XF3 ohne LP und XA2: w/z ≤ 0,50 und C30/37 statt C35/45; XD3/XS3: w/z ≤ 0,45 und C30/37 statt C35/45. Die Festigkeit wird dabei weiterhin nach 28 Tagen nachgewiesen."),
    # [3C50]
    ("Ecke-Ausnahme ... Ortbeton bei BK 2 ... auf bis zu 200 mm reduziert",
     "Mindestdicke Ortbetonwand nach WU-Richtlinie: BK 1 240 mm, BK 2 200 mm (Elementwand je 240 mm, Fertigteil 200 bzw. 100 mm)."),
    # [3C51]
    ("Gemessen mittels Rückprallhammer",
     "Kleinster Einzelwert der Bohrkerndruckfestigkeit (Druckprüfung am Bohrkern nach DIN EN 12504-1, umgerechnet auf den Referenzkörper)."),
    # [3C34]
    ("Konsistenzklassen nach DIN EN 206-1", "Die standardisierten Konsistenzklassen nach DIN EN 206 / DIN 1045-2:"),
    # [3C35]
    ("SVB: > 700 mm (selbstverdichtend)", "SVB: Klassifizierung über das Setzfließmaß (SF1 550–650, SF2 660–750, SF3 760–850 mm)"),
    # [3C36]
    ("Wendehorst Baustoffkunde ... (37. Auflage, Springer Vieweg)",
     "Wendehorst Baustoffkunde: Kapitel Betontechnik (27. Auflage 2011, Vieweg+Teubner)"),
    # [3C38]
    ("f_ct,eff,td = 0.75…0.85 · f_ctm,28d ... Quelle: DIN EN 1992-1-1",
     "f_ct,eff = f_ctm(t) zum erwarteten Risszeitpunkt; bei Zwang aus abfließender Hydratationswärme darf nach DIN EN 1992-1-1/NA f_ct,eff = 0,5·f_ctm(28 d) angesetzt werden. Quelle: DIN EN 1992-1-1/NA, 7.3.2"),
    # [3C47]
    ("Gütebereich (c_min): XC1: 20-30 mm",
     "Mindestbetondeckung c_min,dur (DIN EN 1992-1-1/NA): XC1 10 mm, XC2/XC3 20 mm, XC4 25 mm, XD/XS 40 mm; c_min ≥ Stabdurchmesser; Δc_dev = 10 mm (XC1) bzw. 15 mm"),
    # [3C48]
    ("XC1 -> WO", "Feuchtigkeitsklasse unabhängig von der XC-Klasse festlegen: WO z. B. trockene Innenbauteile und überdachte Außenbauteile; WF z. B. ständig nasse, bewitterte oder erdberührte Bauteile und Innenbauteile mit hoher Luftfeuchte."),
    # [3C37]
    ("(52. Ausgabe, Verlag Bau+Technik)", "(51. Ausgabe 2008, Verlag Bau+Technik)"),
    # [3C39]
    ("3. Dauerhaftung & Schäden", "3. Dauerhaftigkeit & Schäden"),
    # [3C40]
    ("is baupraktisch", "ist baupraktisch"),
    ("Verbund-Industriestrich", "Verbund-Industrieestrich"),
    ("(w/z ≤ 0.45)", "(w/z ≤ 0,45)"),
    # [3C43]
    ("Kein Risiko (XO)", "Kein Risiko (X0)"),
    # [3C52]
    ("2. Medianwert BK_Mted", "2. Mittelwert f_m(n),is")
]
update_file("src/modules/Betonpraxis.tsx", betonpraxis_replacements)

# Module 62: InnovativeWerkstoffe.tsx
innovative_replacements = [
    # [3C53]
    ("schallloser Auftrag von hochfließfähigem Feinkornbeton",
     "Schichtweiser, schalungsfreier Auftrag eines pumpbaren, thixotropen Feinkornbetons mit hoher Fließgrenze direkt aus dem Druckkopf."),
    # [3C57]
    ("(Tresca)", "(von-Mises-Kriterium)"),
    ("Standsicherheitskriterium gegen plastisches Fließversagen (Tresca)",
     "Standsicherheitskriterium gegen plastisches Fließversagen (von-Mises-Kriterium) beim 3D-Betondruck in Abhängigkeit von Rohdichte, Erdbeschleunigung und Bauwerkshöhe."),
    # [3C59]
    ("Trockener Innenraum - Keine Frost- oder Rostgefahr (XC1/XC2)",
     "Trockener Innenraum – keine Frost- oder Korrosionsgefahr durch Feuchte (XC1)"),
    # [3C55]
    ("die sonst nur Gusseisen erreicht", "Ultrahochfester Beton mit extrem dichtem, porenarmem Gefüge und Druckfestigkeiten von ca. 150–250 MPa."),
    # [3C56]
    ("CO₂: -50%", "CO₂: Einsparung materialbezogen durch Schlankheit"),
    # [3C61]
    ("periodische Betonsanierungen ... vollständig entfallen",
     "… da korrosionsbedingte Instandsetzungen der Bewehrung entfallen; Instandhaltung von Betonoberfläche, Fugen und Abdichtung bleibt erforderlich."),
    # [3C62]
    ("vor allem Nickel-Titan", "Metalle (z. B. Nickel-Titan, im Betonbau eisenbasierte Fe-Mn-Si-Legierungen), die nach Erwärmung in ihre vordefinierte Form zurückkehren; bei behinderter Rückverformung entsteht eine Vorspannkraft."),
    # [3C63]
    ("autogen", "autonom"),
    # [3C64]
    ("hervorragende Luftschalldämmung", "Vorteil: kompostierbar, gute Schallabsorption (Akustikpaneele), CO₂-bindend. Wärmeleitfähigkeit ca. 0,040 W/(m·K)."),
    # [3C54]
    ("porentreien Gefüge", "porenfreien Gefüge"),
    ("wärmeschutztechischer", "wärmeschutztechnischer"),
    # [3C58]
    ("Suche ein passendes Material", "Suchst du ein passendes Material"),
    ("und lassen Sie sich die", "und lass dir die"),
    ("Erforschen Sie", "Erforsche"),
    # [3C60]
    ("(bis zu 3", "(Fasern bis ca. 3.000–5.000 N/mm²)")
]
update_file("src/modules/InnovativeWerkstoffe.tsx", innovative_replacements)

# Module 63: Formaenderungen.tsx
formaenderungen_replacements = [
    # [3C65]
    ("DIN 1048-5 (Bestimmung der Schwind- und Quellmaße)", "DIN EN 12390-16 (Prüfung von Festbeton - Teil 16: Bestimmung des Schwindens von Beton)"),
    ("DIN 1048-5", "DIN EN 12390-16"),
    # [3C66]
    ("Wendehorst Baustoffkunde ... (37. Auflage, Springer Vieweg)",
     "Wendehorst Baustoffkunde: Kapitel Formänderungen (27. Auflage 2011, Vieweg+Teubner)"),
    # [3C67]
    ("formel: '\\varepsilon_{cc}(t, t_0) = \\frac{\\sigma_c(t_0)}{E_c(t_0)} \\cdot \\varphi(t, t_0)'",
     "formel: '\\varepsilon_{cc}(\\infty, t_0) = \\varphi(\\infty, t_0) \\cdot \\frac{\\sigma_c}{E_c}'"),
    ("quelle: 'DIN EN 1992-1-1 Gl. 3.6'", "quelle: 'DIN EN 1992-1-1, Gl. 3.6 (mit Ec = 1,05·Ecm)'")
]
update_file("src/modules/Formaenderungen.tsx", formaenderungen_replacements)

# Module 64: HolzbauBeta.tsx
holzbau_beta_replacements = [
    # [3C70]
    ("verhält sich statisch homogen", "Wirkt als flächiges, orthotropes Platten- oder Scheibenelement (Rollschubnachgiebigkeit der Querlagen beachten)."),
    # [3C71]
    ("verhindert proaktiv die ... Trittschall-Übertragung (< 100 Hz)",
     "Die nasse gebundene Splittschüttung (60 mm) erhöht die flächenbezogene Masse der Decke und mindert so die im Holzbau kritische tieffrequente Trittschallübertragung (unter ca. 100 Hz) deutlich."),
    ("verhindert proaktiv die tieffrequente Trittschall-Übertragung (< 100 Hz)",
     "Die nasse gebundene Splittschüttung (60 mm) erhöht die flächenbezogene Masse der Decke und mindert so die im Holzbau kritische tieffrequente Trittschallübertragung (unter ca. 100 Hz) deutlich."),
    # [3C72]
    ("Wendehorst Baustoffkunde ... (37. Auflage)", "Wendehorst Baustoffkunde, 27. Aufl., Vieweg+Teubner 2011"),
    # [3C68]
    ("Stabstabförmiges Tragwerk", "Stabförmiges Tragwerk"),
    ("e = 62.5 cm", "e = 62,5 cm"),
    # [3C69]
    ("Draht- & Skelettbau (Zimmerer)", "Holzskelettbau (Pfosten-Riegel)")
]
update_file("src/modules/HolzbauBeta.tsx", holzbau_beta_replacements)

# Module 65: Dauerhaftigkeit.tsx
dauerhaftigkeit_replacements = [
    # [3C75]
    ("Vorhaltemaß Δcdev (in der Regel 10 mm bzw. 15 mm...)",
     "Vorhaltemaß Δc_dev nach EC2/NA: 15 mm (bei XC1 10 mm); bei qualitätssichernden Maßnahmen (z. B. im Fertigteilwerk) um 5 mm reduzierbar. Beispiel XC4: c_min,dur = 25 mm, c_nom = 25 + 15 = 40 mm."),
    ("+10mm Vorhaltemaß", "+15 mm Vorhaltemaß (c_nom = 40 mm)"),
    # [3C76]
    ("Passive Schutzschichten: ... Feuerverzinken. Diese wirken rein als Barriere",
     "Passive Schutzschichten (Lacke, Anstriche, EP-Beschichtungen, OS-Systeme) wirken als Barriere; Zinküberzüge (Feuerverzinken) wirken zusätzlich aktiv als Opferanode und schützen kleine Fehlstellen kathodisch."),
    # [3C78]
    ("Keine materialspezifischen Mindestfestigkeiten",
     "Anforderungen: Mindestdruckfestigkeitsklasse C8/10 nach DIN 1045-2; keine Begrenzung von w/z-Wert und Zementgehalt. X0 gilt nur für Beton ohne Bewehrung oder eingebettetes Metall."),
    # [3C79]
    ("max. w/z = 0.50, min. f_ck = C30/37", "max. w/z = 0,60, min. C25/30, min. z = 280 kg/m³, c_min,dur = 25 mm (+15 mm Vorhaltemaß, c_nom = 40 mm)"),
    # [3C81]
    ("XF2 ... mit Taumittel (Kläranlagenbereiche)",
     "XF2: Mäßige Wassersättigung mit Taumittel (z. B. Bauteile im Sprühnebel- oder Spritzwasserbereich taumittelbehandelter Verkehrsflächen, soweit nicht XF4)"),
    # [3C82]
    ("LP-Beton ... oder sehr niedrige w/z-Werte",
     "Umsetzung XF4: Luftporenbeton mit Mindest-LP-Gehalt (je nach Größtkorn ca. 4,0–5,5 Vol.-%), max. w/z = 0,50, mind. C30/37 und frostwiderstandsfähige Gesteinskörnung."),
    # [3C83]
    ("XA2: ... Sulfat 200-600 mg/l", "XA1: schwach angreifend (pH 6,5–5,5; CO2 15–40 mg/l; Sulfat 200–600 mg/l). XA2: mäßig angreifend (pH 5,5–4,5; Sulfat > 600–3000 mg/l). XA3: stark angreifend (pH 4,5–4,0; Sulfat > 3000–6000 mg/l)."),
    # [3C84]
    ("0,2 mm bei XC/XD-Beaufschlagung",
     "auf w_k ≤ 0,3 mm (Stahlbeton XC2–XC4, XD, XS; bei X0/XC1 0,4 mm; Spannbeton mit Verbund 0,2 mm nach DIN EN 1992-1-1/NA Tab. 7.1DE) begrenzt"),
    # [3C73]
    ("DIN EN 206-1 / DIN 1045-2", "DIN EN 206 / DIN 1045-2 (Beton - Festlegung, Eigenschaften, Herstellung und Konformität)"),
    # [3C92]
    ("EN 350-2 Klassen", "Dauerhaftigkeitsklassen nach DIN EN 350"),
    ("(DIN EN 350-2)", "(DIN EN 350 i. V. m. DIN 68800-1)"),
    # [3C74]
    ("Wendehorst Baustoffkunde ... (37. Auflage, Springer Vieweg)", "Wendehorst Baustoffkunde, 27. Aufl., Vieweg+Teubner 2011"),
    # [3C77]
    ("Bauteil-Ausführungsklassen", "Betonbauqualitätsklassen (BBQ N, E, S)"),
    ("Freigabe ... CEM II/C und CEM III", "regelt die Anwendung CO₂-reduzierter Zemente wie CEM II/C-M und CEM VI (DIN EN 197-5)."),
    # [3C80]
    ("erhöhtes Vorhaltemaß der Bewehrungsdeckung (c_min = 40mm)",
     "Umsetzung XS3: max. w/z = 0,45, Mindestbetondeckung c_min,dur = 40 mm zzgl. Vorhaltemaß Δc_dev = 15 mm (c_nom = 55 mm)."),
    # [3C86]
    ("Calciumaluminathydraten (C₃A)",
     "aluminathaltigen Phasen des Zementsteins (Monosulfat, Calciumaluminathydrate sowie unhydratisiertes C₃A) zu Ettringit"),
    # [3C87]
    ("Nach dem quadratischen Zeitgesetz dringt die CO₂-Karbonatisierungsfront",
     "Nach dem Wurzel-Zeit-Gesetz dringt die Karbonatisierungsfront ein: s(t) = k·√t."),
    # [3C88]
    ("XC2 (Nass, ständig nass)", "XC2 (nass, selten trocken): c_nom = 35 mm"),
    # [3C90]
    ("18.0 μm (12.9 a Schutzzeit bei Z80)",
     "Zinkabtrag in 15 Jahren ca. 18 µm (ca. 1,2 µm/a, Kategorie C3); Schutzdauer = Zinkschichtdicke / Abtragsrate (z. B. 85 µm Stückverzinkung nach DIN EN ISO 1461 ergibt ca. 70 a)."),
    # [3C91]
    ("Chemischer Holzschutz gesetzlich VERBOTEN",
     "Vorbeugender chemischer Holzschutz ist nach DIN 68800 nicht erforderlich und soll unterbleiben; baulicher Holzschutz genügt."),
    # [3C93]
    ("Durch Kochen des Holzes ... bei 160-220 °C",
     "Thermoholz (TMT): Durch Erhitzen auf 160–220 °C unter Sauerstoffausschluss (Wasserdampf- oder Stickstoffatmosphäre) werden Hemicellulosen abgebaut"),
    # [3C94]
    ("Hydratationssprengdruck (bis zu 100 MPa)",
     "übersteigt der Kristallisationsdruck (theoretisch bis in den Bereich mehrerer 10 MPa) die Zugfestigkeit"),
    # [3C96]
    ("mechanischer feuchtesperrender Horizontalsperren (z.B. ... Injektionsverfahren)",
     "Nachträgliche Horizontalsperren im Sockelbereich: mechanisch (z. B. Mauersägeverfahren mit Bahnen, Chromstahlbleche) oder chemisch (Injektion, WTA 4-4) gegen aufsteigende Feuchte."),
    # [3C98]
    ("Kryogener thermischer Bruch", "Thermischer Bruch (Thermobruch)"),
    ("kryogene Spannungsbrüche", "thermische Spannungsbrüche"),
    # [3C99]
    ("K-Schleifen erhöht Belastbarkeit um bis zu 400 %",
     "Saubere Kantenbearbeitung reduziert Kantenfehler und erhöht die Temperaturwechselbeständigkeit. Richtwerte: Floatglas ca. 40 K, TVG ca. 100 K, ESG ca. 150–200 K."),
    # [3C85]
    ("expandsiert", "expandiert"),
    ("Holzerstörende", "Holzzerstörende"),
    ("Polystyrol-Dartschaum", "Polystyrol-Hartschaum"),
    ("UV-Verspödung", "UV-Versprödung"),
    ("Schafstoffbelastung", "Schadstoffbelastung"),
    ("wandern die Salzen", "wandern die Salze"),
    # [3C89]
    ("LaTeX G^*", "G*"),
    ("LaTeX \\delta", "δ"),
    # [3C97]
    ("Ein-O-Si-Netzwerk", "Si-O-Si-Netzwerk")
]
update_file("src/modules/Dauerhaftigkeit.tsx", dauerhaftigkeit_replacements)

# Module 66: Metallkorrosion.tsx
metallkorrosion_replacements = [
    # [3C103]
    ("Unterhalb von pH 5 wird jede schützende Metall-Passivschicht zersetzt",
     "Unlegierter Stahl ist in sauren Medien (pH unter ca. 4–5) nicht passivierbar, es tritt Wasserstoffkorrosion ein. In stark alkalischem Milieu (pH über ca. 12, z. B. Porenwasser von Normalbeton) passiviert Stahl."),
    # [3C104]
    ("Über pH 12 (z. B. in Porenbeton durch Calciumhydroxid) passiviert Stahl",
     "Über pH 12 (z. B. im Porenwasser von Normalbeton durch Calciumhydroxid, pH ca. 12,5–13,5) passiviert Stahl spontan. Porenbeton (pH ca. 10) schützt Bewehrung dagegen nicht, sie muss beschichtet werden."),
    # [3C107]
    ("betrifft vor allem passive Metalle (Gusseisen, Edelstahl, Aluminium)",
     "Sie betrifft vor allem passive Metalle (nichtrostender Stahl, Aluminium) in Gegenwart von Chlorid-Ionen. Die Ionen durchbrechen die Passivschicht (bei Edelstahl Chromoxid, bei Aluminium Aluminiumoxid) an mikroskopischen Schwachstellen."),
    # [3C108]
    ("PREN = %Cr + 3,3·(%Mo + 1,5·%W) + 16·%N", "PREN = %Cr + 3,3·(%Mo + 0,5·%W) + 16·%N"),
    ("PREN = \\%Cr + 3.3 \\cdot (\\%Mo + 1.5 \\cdot \\%W) + 16 \\cdot \\%N", "PREN = \\%Cr + 3.3 \\cdot (\\%Mo + 0.5 \\cdot \\%W) + 16 \\cdot \\%N"),
    # [3C100]
    ("Zwei leitend verbundene Bereiche unterschiedlichen Standardpotenzials (E0)",
     "Zwei leitend verbundene Bereiche mit unterschiedlichem Korrosionspotenzial im Elektrolyten (z. B. verschiedene Metalle, unterschiedliche Belüftung oder Gefügebereiche)."),
    # [3C102]
    ("Sprengdrücken von über 150 MPa",
     "Korrosionsprodukte beanspruchen je nach Oxid/Hydratationsgrad das ca. 2- bis 6-fache Volumen des Stahls; der entstehende Sprengdruck übersteigt die Betonzugfestigkeit (ca. 2–4 MPa) deutlich und führt zu Rissen und Abplatzungen."),
    # [3C106]
    ("Wendehorst Baustoffkunde ... (37. Auflage)", "Wendehorst Baustoffkunde, 27. Aufl., Vieweg+Teubner 2011"),
    # [3C109]
    ("PREN > 35 ... voll meerwasser- und chloridbeständig (z. B. Superduplex)",
     "Ein PREN ≥ 40 kennzeichnet in der Regel meerwasserbeständige Werkstoffe (z. B. Superduplex 1.4410, 6Mo-Stähle)."),
    # [3C101]
    ("Cr₂₃C₆", "Cr23C6"),
    ("Cr₂O₃", "Cr2O3"),
    # [3C105]
    ("(Korrosionsklassen C1 bis CX nach atmosphärischer Belastung)",
     "(Korrosion von Metallen und Legierungen – Korrosivität von Atmosphären – Einteilung, Bestimmung und Abschätzung; Korrosivitätskategorien C1 bis CX)"),
    # [3C110]
    ("spezifischen Korrationsmedium", "spezifischen Korrosionsmedium")
]
update_file("src/modules/Metallkorrosion.tsx", metallkorrosion_replacements)

# Module 67: TypischeBauschaeden.tsx
schaeden_replacements = [
    # [3C114]
    ("Klassifizierung nach Rissbreite (DIN 18055 / WTA)",
     "Einteilung nach Rissbreite (praxisübliche Orientierungswerte, vgl. DBV-Merkblatt Begrenzung der Rissbildung / TR Instandhaltung des DIBt)"),
    # [3C115]
    ("formel: 'Q = \\frac{\\pi \\cdot w \\cdot \\Delta p}{12 \\cdot \\eta \\cdot L}'",
     "formel: 'Q = \\frac{b \\cdot w^3 \\cdot \\Delta p}{12 \\cdot \\eta \\cdot L}'"),
    ("erklaerung: 'Viskositätsabhängige Injektionsfließrate in Betonrisse nach Hagen-Poiseuille.'",
     "erklaerung: 'Durchflussbeziehung im Rissspalt (Spaltströmung, Kubikgesetz): Der Volumenstrom Q des Injektionsstoffs hängt überproportional (mit der dritten Potenz) von der Rissbreite w ab, außerdem von der Risslänge b, der dynamischen Viskosität η und dem Druckgradienten Δp/L: Q = b·w³·Δp/(12·η·L).'"),
    # [3C118]
    ("aus Magnetit (γ-Fe2O3)", "aus Eisenoxiden (innen Magnetit Fe3O4, außen Maghemit γ-Fe2O3 bzw. Fe(III)-Oxidhydroxid)"),
    # [3C119]
    ("Kritischer Chloridgehalt nach DIN EN 1992-1-1: 0,40 bis 0,50 %",
     "Korrosionsauslösender (kritischer) Chloridgehalt: Erfahrungswert ca. 0,5 M.-% bezogen auf die Zementmasse (DAfStb-Richtlinie Schutz und Instandsetzung bzw. TR Instandhaltung), stark abhängig von Feuchte, Zementart und Carbonatisierung. Herstellgrenzwerte nach DIN EN 206/DIN 1045-2: Stahlbeton 0,40 %, Spannbeton 0,20 % Cl bezogen auf Zement."),
    # [3C124]
    ("Einfache Prüfung (alle 12 Jahre, dazwischen)",
     "Überwachung der Ingenieurbauwerke im Zuge von Straßen und Wegen nach DIN 1076: Hauptprüfung alle 6 Jahre, Einfache Prüfung jeweils 3 Jahre nach der Hauptprüfung, dazu jährliche Besichtigung und halbjährliche laufende Beobachtung."),
    # [3C130]
    ("maximal 0.45 nach DIN EN 206 für ... Frost/Taumitteleinwirkung XF3",
     "Der Beton besaß einen w/z-Wert von 0,65 (statt maximal 0,60 nach DIN 1045-2 für bewitterte Außenbauteile der Expositionsklassen XC4/XF1)."),
    # [3C113]
    ("quelle: 'DIN EN ISO 12737'", "quelle: 'Irwin (1957); Bruchmechanik-Grundlagen / ISO 12135'"),
    # [3C125]
    ("Praxis-Regel (DIN 18550 / DIN V 18559)", "Praxis-Regel (DIN EN 13914-1 / DIN 18550-1):"),
    # [3C126]
    ("Die Fließregel am Bau (DIN 18460)", "Die Fließregel am Bau (Fachregeln des Klempnerhandwerks, ZVSHK; DIN 18339):"),
    # [3C111]
    ("Wendehorst Baustoffkunde ... (37. Auflage, Springer Vieweg)", "Wendehorst Baustoffkunde, 27. Aufl., Vieweg+Teubner 2011"),
    # [3C117]
    ("Bauphysikalische Ertüchtigung: Rissverpressung & Carbonlamellen", "Instandsetzung und Verstärkung: Rissverpressung & Carbonlamellen (CFK)"),
    # [3C121]
    ("Nachweis nach DIN EN 1997-1 mit DIN 1054 (HYD): S_dst,k · γH ≤ G′_stb,k · γG,stb mit γH = 1,45 (günstiger) bzw. 1,90 (ungünstiger Untergrund) und γG,stb = 0,95.",
     "Nachweis nach DIN EN 1997-1 mit DIN 1054 (HYD): S_dst,k · γH ≤ G′_stb,k · γG,stb mit γH = 1,45 (günstiger) bzw. 1,90 (ungünstiger Untergrund) und γG,stb = 0,95."),
    # [3C122]
    ("mit Schlamm vermischt und oxidiert", "wird die oberste Betonschicht mit Bohrschlamm und Stützflüssigkeit verunreinigt und ist minderfest (Kopfbeton)"),
    # [3C123]
    ("Kupferelektrode ... zerstörungsfrei und punktgenau",
     "Potenzialfeldmessung: Messung des Potenzials der angeschlossenen Bewehrung gegen eine Cu/CuSO₄-Bezugselektrode im Raster; grenzt großflächig und weitgehend zerstörungsfrei Bereiche wahrscheinlicher Bewehrungskorrosion ein (Verifikation durch Öffnungen)."),
    # [3C127]
    ("Gerbstoffholz: nur Edelstahl (DIN EN 1995-1-1) ... bauaufsichtlich zulässig!",
     "Praxis-Regel: Für gerbstoffreiche Hölzer (Eiche, Edelkastanie, Lärche) im Außenbereich werden Verbindungsmittel aus nichtrostendem Stahl (A2/A4) dringend empfohlen; Mindestanforderungen an den Korrosionsschutz regelt DIN EN 1995-1-1 Tab. 4.1 nach Nutzungsklasse."),
    # [3C128]
    ("Architekt/Tragwerksplaner haftet zu 100%",
     "Planungsfehler: primär haftet der Planer für fehlerhafte Grundlagenermittlung; bei erkennbaren Planungsfehlern ggf. Mithaftung des Unternehmers (Prüf- und Hinweispflicht), Quote im Einzelfall."),
    # [3C131]
    ("bei Estrichfeldern > 30 m²",
     "Es wurde versäumt, die nach Estrichart, Beheizung und Feldgeometrie erforderlichen Bewegungsfugen anzuordnen … Sanierung: Scheinfugen nachschneiden, Wildrisse mit Epoxidharz und Wellenverbindern (Estrichklammern) verharzen."),
    # [3C116]
    ("zementörem", "zementärem"),
    ("Zugelast-E-Modul", "Zug-E-Modul"),
    # [3C120]
    ("Frost-Tausalz-Best ndigkeit", "Frost-Tausalz-Beständigkeit"),
    # [3C129]
    ("and Bauleitungsfehler", "und Bauleitungsfehler"),
    ("Rinnaustausch", "Der Rinnenaustausch")
]
update_file("src/modules/TypischeBauschaeden.tsx", schaeden_replacements)

# Module 68: Bauwerksunters_Monitoring.tsx
monitoring_replacements = [
    # [3D1]
    ("Mindestbetondeckung c_min nach DIN EN 1991-1: XC1 ≥ 15 mm; XC4 … + Vorhaltemaß (typisch 10 mm)",
     "Mindestbetondeckung c_min,dur nach DIN EN 1992-1-1/NA: XC1 (trocken) ≥ 10 mm (+ Δc_dev 10 mm); XC4 (Außenbereich) ≥ 25 mm (+ Δc_dev 15 mm); c_min mindestens gleich dem Stabdurchmesser."),
    # [3D3]
    ("DGZfP-Merkblatt B3", "DIN EN 1992-1-1 (Eurocode 2), DIN 488 (Betonstahl), DBV-Merkblatt Betondeckung und Bewehrung, DGZfP-Merkblatt B 2 (zerstörungsfreie Betondeckungsmessung und Bewehrungsortung)"),
    # [3D8]
    ("Splintholzkäferbeobachtung (Anobien)", "Nagekäferbefall (Anobien, Anobium punctatum) bzw. Splintholzkäferbefall (Lyctus spp.)"),
    # [3D9]
    ("WTA-Merkblatt 8-10, KTA 3201.4", "WTA-Merkblatt 4-11 (Messung der Feuchte von mineralischen Baustoffen)"),
    # [3D10]
    ("messen ... elektrolytische Bauwerksfeuchten",
     "TDR-Feuchtesonden: Messen über die Laufzeit elektromagnetischer Impulse (Dielektrizitätszahl) zeitlich aufgelöst den volumetrischen Wassergehalt direkt im Bauteilinneren."),
    # [3D11]
    ("VDI/VDE 2635 Blatt 1, DIN EN ISO 12690", "VDI/VDE 2635 Blatt 1 (Dehnungsmessstreifen mit metallischem Messgitter)"),
    # [3D13]
    ("Durch ... Monitoring können ... Hauptprüfungen nach DIN 1076 ... gestreckt werden",
     "Ingenieur-Vorteil: Monitoring ergänzt die Prüfungen nach DIN 1076 (Hauptprüfung alle 6 Jahre), liefert kontinuierliche Zustandsdaten zwischen den Prüfterminen und unterstützt Erhaltungsentscheidungen."),
    # [3D16]
    ("GENAUIGKEITSKALIBRIERUNG NACH EN 13791 ... Wahre in-situ Beton-Festigkeit: 44.6 N/mm²",
     "Rückprall-Schätzung (orientierend): Rückprallwerte liefern nach DIN EN 13791 nur nach Kalibrierung an Bohrkernen einen Schätzwert der In-situ-Festigkeit; Karbonatisierung erhöht den Rückprall und wird hier nur näherungsweise abgemindert."),
    # [3D12]
    ("DAfStB-Instandhaltungsrichtlinie", "VDI/VDE 2624 Blatt 1, TR Instandhaltung (DIBt) / DAfStb-Richtlinie Schutz und Instandsetzung von Betonbauteilen"),
    # [3D2]
    ("Bestimmt die nominale Betondeckung c ... nach EN 1991/1992",
     "Covermeter: Bestimmt die vorhandene Betondeckung und ortet die Stablage zum Abgleich mit den Anforderungen nach DIN EN 1992-1-1; Messgenauigkeit typ. ±1–2 mm und mehr, abhängig von Stabdurchmesser, -abstand und Lagen."),
    # [3D4]
    ("kapillaren Wasseraufnahmekoeffizienten w",
     "Karsten-Röhrchen: Messung der Wasseraufnahme (ml über die Zeit) unter geringem Wasserdruck an Fassaden, zerstörungsfrei aufgekittet; w-Wert nur näherungsweise, normgerecht im Labor nach DIN EN ISO 15148."),
    # [3D5]
    ("Dicken von Fahrbahnen (Frequenzen: 1,5–4,0 GHz)",
     "Ortung von Bewehrung und Hüllrohren (typ. 1,5–2,7 GHz) sowie Schichtdicken von Fahrbahnen (typ. 0,4–1 GHz, höhere Eindringtiefe)."),
    # [3D6]
    ("Bohrmehlgewinnung in Millimeterschritten",
     "Bohrmehlentnahme in Tiefenstufen (z. B. 0–10, 10–20, 20–30 mm) bzw. Profilschleifen an Bohrkernen in 1–2-mm-Schritten; Chloridbestimmung nach Säureaufschluss (z. B. Titration)."),
    # [3D15]
    ("einzige gerichtlich anerkannte Belegreife-Prüfmittel nach DIN 18560 ist CM",
     "DIN 18560 (Estriche im Bauwesen); Belegreife: CM-Methode als in VOB/C (z. B. DIN 18365, DIN 18356) und Schnittstellenkoordination verankertes Standardverfahren, HF-Verfahren nur zur Eingrenzung."),
    # [3D17]
    ("RILEM TC 154-EMC (Wenner 4-Point Testing on Concrete Integrity)",
     "RILEM TC 154-EMC: Test methods for on-site measurement of resistivity of concrete (Polder, Materials and Structures 33, 2000)"),
    # [3D18]
    ("Bundis, H.", "DGZfP-Merkblätter der Reihe B (ZfP im Bauwesen); DIN 1076 und RI-EBW-PRÜF"),
    # [3D7]
    ("Detektionstiefe is physikalisch", "Detektionstiefe ist physikalisch"),
    # [3D14]
    ("Only if crack opening permanently grows over multiple cycles, a structural shifting (settlement) is active!",
     "Nur wenn die Rissöffnung über mehrere Zyklen bleibend zunimmt, liegt eine aktive Tragwerksbewegung (Setzung) vor!")
]
update_file("src/modules/Bauwerksunters_Monitoring.tsx", monitoring_replacements)

# Module 69: MaterialSchaedenGross.tsx
gross_schaeden_replacements = [
    # [3D22]
    ("Einführung der VDI-Richtlinie 6200 ... Kommunen wurden verpflichtet",
     "Folge: ARGEBAU-Hinweise (2006) zur regelmäßigen Überprüfung der Standsicherheit durch Eigentümer; 2010 erschien VDI 6200 als freiwillige Richtlinie (Schadensfolge- und Robustheitsklassen, Prüfintervalle, Bauwerksbuch)."),
    ("Einführung der VDI-Richtlinie 6200: Kommunen und Gebäudebetreiber wurden gesetzlich verpflichtet",
     "Folge: ARGEBAU-Hinweise (2006) zur regelmäßigen Überprüfung der Standsicherheit durch Eigentümer; 2010 erschien VDI 6200 als freiwillige Richtlinie (Schadensfolge- und Robustheitsklassen, Prüfintervalle, Bauwerksbuch)."),
    # [3D25]
    ("Na2O-Äq ≤ 0,60 % (NA-Zement) ... Quelle: DAfStb Alkali-Richtlinie & DIN EN 197-1",
     "Na2O-Äquivalent ≤ 0,60 M.-% (NA-Zement nach DIN 1164-10; für hüttensandreiche Zemente gelten höhere Grenzwerte). Anwendung nach DAfStb-Alkali-Richtlinie."),
    # [3D19]
    ("Wendehorst Baustoffkunde ... (37. Auflage, Springer Vieweg)", "Wendehorst Baustoffkunde, 27. Aufl., Vieweg+Teubner 2011"),
    # [3D21]
    ("15 Todesopfer, 34 Schwerverletzte", "15 Todesopfer, 34 Verletzte"),
    # [3D23]
    ("Verbot nicht feuchtebeständiger Leime (UF) für tragende Zwecke",
     "Klebstoffe für tragende Holzbauteile müssen nach Nutzungsklasse gewählt werden: UF (Typ II) nur NKL 1; für NKL 2/3 und feuchte Hallenklimate Typ-I-Klebstoffe (MUF, PRF, 1K-PUR)."),
    ("UF-Harze sind streng verboten",
     "Klebstoffe für tragende Holzbauteile müssen nach Nutzungsklasse gewählt werden: UF (Typ II) nur NKL 1; für NKL 2/3 und feuchte Hallenklimate Typ-I-Klebstoffe (MUF, PRF, 1K-PUR)."),
    # [3D24]
    ("Winter (TUM) im Auftrag der StA Traunstein", "Gutachten im Strafverfahren (LG Traunstein, StA Traunstein)"),
    # [3D20]
    ("Haverie", "Havarie")
]
update_file("src/modules/MaterialSchaedenGross.tsx", gross_schaeden_replacements)

print("Batch 60-69 finished.")
