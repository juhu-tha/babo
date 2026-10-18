import sys
from patch_modules import update_file

# Module 30 & 51: Nawaro.tsx
nawaro_replacements = [
    ("Biogener Bindungssack (-1,6 t CO₂ / m³)", "Biogener Kohlenstoffspeicher (ca. −0,7 t CO₂-Äq./m³ nach DIN EN 16449)"),
    ("Biogener Bindungssack (-1.6 t CO₂ / m³)", "Biogener Kohlenstoffspeicher (ca. −0,7 t CO₂-Äq./m³ nach DIN EN 16449)"),
    ("Biogener Bindungssack (-1,6 t CO2 / m³)", "Biogener Kohlenstoffspeicher (ca. −0,7 t CO₂-Äq./m³ nach DIN EN 16449)"),
    ("Strandgut der Posidonia-Alge oder des Zostera-Seegrases aus dem Mittelmeer oder der Ostsee. Die getrockneten, elastischen Fasern werden lediglich mechanisch gereinigt.", "Strandgut des Neptungrases (Posidonia oceanica, Mittelmeer) oder des Echten Seegrases (Zostera, Ostsee). Beides sind Seegräser (Blütenpflanzen), keine Algen."),
    ("Biobasierte Baustoffe erfordern konsequenten Schutz vor Feuchteeinwirkung (Feuchtedesignklasse nach DIN 68800).", "Biobasierte Baustoffe erfordern konsequenten Schutz vor dauerhafter Feuchtebelastung (Einstufung in Gebrauchsklassen GK 0 bis GK 5 nach DIN 68800-1, Ziel: GK 0 durch baulichen Holzschutz nach DIN 68800-2)."),
    ("Biobasierte Baustoffe erfordern konsequenten Schutz vor Feuchtigkeit (Feuchtedesignklasse nach DIN 68800).", "Biobasierte Baustoffe erfordern konsequenten Schutz vor dauerhafter Feuchtebelastung (Einstufung in Gebrauchsklassen GK 0 bis GK 5 nach DIN 68800-1, Ziel: GK 0 durch baulichen Holzschutz nach DIN 68800-2)."),
    ("Die <strong>Fachagentur Nachwachsende Rohstoffe e. V. (FNR)</strong> agiert im Auftrag des Bundesministeriums für Ernährung und Landwirtschaft (BMEL)", "Die <strong>Fachagentur Nachwachsende Rohstoffe e. V. (FNR)</strong> agiert im Auftrag des Bundesministeriums für Landwirtschaft, Ernährung und Heimat (BMLEH, vormals BMEL)"),
    ("Wegweisender Massivholzbau wie CLT (Brettsperrholz) und Furnierschichtholz (LVL) für CO₂-freie Tragwerke", "Massivholzbau wie CLT (Brettsperrholz) und LVL (Furnierschichtholz) für Tragwerke mit geringem Herstellungs-Treibhauspotenzial und temporärer Kohlenstoffspeicherung"),
    ("Technischer Detailvergleich zwischen konventionellen Baustoffen und FNR-zertifizierten NaWaRo-Alternativen", "Technischer Detailvergleich zwischen konventionellen Baustoffen und NaWaRo-Alternativen (Daten u. a. nach FNR, Projektträger des BMLEH)"),
    ("FNR Klasse 1", "PRODUKTGRUPPE 1"),
    ("FNR Klasse 2", "PRODUKTGRUPPE 2"),
    ("FNR Klasse 3", "PRODUKTGRUPPE 3"),
    ("FNR Klasse 4", "PRODUKTGRUPPE 4"),
    ("erklaerung: 'Thermisches Trägheitsmaß (Inertia) nach DIN 4108-2 aus Rohdichte und spezifischer Wärmekapazität.'", "erklaerung: 'Volumenbezogene Wärmekapazität ρ·c/1000 in kJ/(m³K): Maßzahl für die Wärmespeicherfähigkeit des Dämmstoffs (beeinflusst mit λ die Temperaturamplitudendämpfung); Nachweis des sommerlichen Wärmeschutzes nach DIN 4108-2 über Sonneneintragskennwerte bzw. Simulation.'"),
    ("quelle: 'DIN 4108-2'", "quelle: 'DIN 4108-2 / Bauphysik-Grundlagen'"),
    ("if (inertia > 300) { score += 45; reason = 'Sensationelle thermische Masse bremst sommerliche Hitzespitzen im Dachgeschoss massiv aus.'; }",
     "if (p.id === 'holzfaser') { score += 45; reason = 'Holzfaser: hohe spezifische Wärmekapazität (ca. 2.100 J/(kgK)) und Rohdichte verbessern die Phasenverschiebung im Dach.'; }\n        else if (p.id === 'hanf') { score += 40; reason = 'Hanffaser: gute Wärmespeicherfähigkeit (c ≈ 1.700 J/(kgK)) und Schimmelresistenz.'; }\n        else if (p.id === 'stroh') { score += 45; reason = 'Baustroh: sehr hohe Speichermasse durch hohe Schichtdicken bei hervorragender CO2-Bilanz.'; }\n        else if (inertia > 300) { score += 45; reason = `${p.name}: Hohe volumenbezogene Wärmekapazität bremst sommerliche Hitzespitzen aus.`; }"),
    ("vollständige biologische Abbaubarkeit minimieren Bauschutt", "Wiederverwendbarkeit (Re-Use) und – bei zusatzstofffreien Produkten – biologische Abbaubarkeit können Bauschutt und Deponiekosten reduzieren"),
    ("B1 (schwerentflammbar)", "Brandverhalten: Euroklasse E (Platte); im zugelassenen WDVS mit Brandriegeln schwerentflammbar"),
    ("Pistohl (2020): Handbuch der Gebäudetechnik - Band 1: Wärmeschutz, Feuchteschutz, Schallschutz", "Pistohl, W.; Rechenauer, C.; Scheuerer, B.: Handbuch der Gebäudetechnik – Planungsgrundlagen und Beispiele, Band 1: Allgemeines, Sanitär, Elektro, Gas (Reguvis/Bundesanzeiger Verlag, vormals Werner Verlag)"),
    ("Handbuch der Gebäudetechnik - Band 1: Wärmeschutz, Feuchteschutz, Schallschutz", "Handbuch der Gebäudetechnik – Planungsgrundlagen und Beispiele, Band 1: Allgemeines, Sanitär, Elektro, Gas"),
    ("Wärmeleitpreis (λ)", "Wärmeleitfähigkeit (λ)"),
    ("thermoplastischer Stützfasern (oft biobasiertes PLA)", "thermoplastischen Stützfasern (meist Polyester-Bikomponentenfasern, seltener biobasiertes PLA)"),
    ("GEG - Gebäudeenergiegesetz (Anforderungen an den Wärmedurchgangskoeffizienten)", "GModG - Gebäudemodernisierungsgesetz (GModG), bis 28.07.2026 Gebäudeenergiegesetz (GEG) (Anforderungen an den Wärmedurchgangskoeffizienten)"),
    ("Wendehorst Baustoffkunde: Kapitel 'Ökologie der Baustoffe & Ressourcenverbrauch' (Werner-Verlag)", "Wendehorst Baustoffkunde. Grundlagen – Baustoffe – Oberflächenschutz, 27. Aufl., Vieweg+Teubner 2011")
]
update_file("src/modules/Nawaro.tsx", nawaro_replacements)

# Module 31: NachhaltigkeitChecklisten.tsx
nachhaltigkeit_checklisten_replacements = [
    # [2D1]
    ("formel: 'Q_P = (Q_h + Q_{tw}) \\cdot f_p \\le Q_{P,\\text{zul}}'", "formel: 'Q_P = \\sum (Q_{f,i} \\cdot f_{p,i}) \\le Q_{P,\\text{zul}}'"),
    ("/* TODO: GModG Umnummerierung */ erklaerung: 'Jahres-Primärenergiebedarf eines Gebäudes nach dem Gebäudemodernisierungsgesetz (GModG, in Kraft seit 29.07.2026, vormals GEG) § 15. Berechnung aus Heizwärme- und Warmwasserbedarf unter Berücksichtigung des Primärenergiefaktors fp.'",
     "erklaerung: 'QP = Σ (Qf,i · fp,i) ≤ QP,zul. Der Jahres-Primärenergiebedarf ergibt sich aus dem Endenergiebedarf je Energieträger (Heizung, Warmwasser, Lüftung, Kühlung inkl. Anlagenverluste und Hilfsenergie) multipliziert mit dem jeweiligen Primärenergiefaktor. QP,zul folgt aus dem Referenzgebäude nach § 15 GModG (bis 31.12.2026: 0,55 · QP,Ref).'"),
    # [2D2]
    ("mit Güteüberwachung und Materialwerten (MEB)", "gemäß der Ersatzbaustoffverordnung (EBV, seit 01.08.2023) mit Güteüberwachung und unter Einhaltung der Materialwerte nach Anlage 1 EBV (Materialklassen, z. B. RC-1 bis RC-3) eingesetzt?"),
    # [2D6]
    ("Digitaler Gebäudepass (DPP) & Materialpass vorsehen", "Gebäuderessourcenpass / Materialpass (Produktdaten aus dem Digitalen Produktpass, DPP) vorsehen"),
    ("Digitaler Gebäudepass (DPP)", "Gebäuderessourcenpass / Materialpass (Produktdaten aus dem Digitalen Produktpass, DPP)"),
    # [2D7]
    ("R-Betone (Typ 1 oder Typ 2 nach DAfStb-Richtlinie) mit mindestens 25 M.-% rezyklierter Gesteinskörnung",
     "qualitätsgesicherte R-Betone nach DIN 1045-2:2023-08 (rezyklierte Gesteinskörnung Typ 1 oder Typ 2 nach DIN 4226-101) mit mindestens 25 Vol.-% rezyklierter Gesteinskörnung"),
    # [2D3]
    ("Zementsubstitution (CEM III/B)", "Zementsubstitution (klinkerarme Zemente)"),
    ("Wird Portlandzement (CEM I) durch klinkereffiziente Hochofenzemente (CEM III/B) oder Puzzolanzemente substituiert? Einsparung von bis zu 60 % CO₂-Äquivalent im Rohbau möglich.",
     "Wird CEM I durch klinkerarme Zemente (CEM II/B, CEM II/C-M, CEM III/A, CEM III/B) substituiert? Je nach Zementart bis zu rund 80 % weniger Klinker. Prüfgrundlage: DIN EN 197-1/-5, EPD bzw. ÖKOBAUDAT."),
    ("ref: 'LAGA / Ökobaudat'", "ref: 'DIN EN 197-1/-5, EPD bzw. ÖKOBAUDAT'"),
    # [2D4]
    ("Wärmepumpe mit saisonaler Leistungszahl (COP > 4.0)", "Wärmepumpe mit hoher Jahresarbeitszahl (JAZ ≥ 4,0)"),
    # [2D5]
    ("U-Werte, die die gesetzlichen Standards des Gebäudemodernisierungsgesetzes (GModG, in Kraft seit 29.07.2026, vormals GEG) um mindestens 45 % unterbieten",
     "ein Transmissionswärmeverlust H'T von höchstens 55 % und ein Primärenergiebedarf von höchstens 40 % des Referenzgebäudes nach GModG erreicht (Effizienzhaus-40-Niveau)"),
    # [2D8]
    ("Estriche auf Trennlage ohne Verbund, mechanisch montierte Trockenbausysteme",
     "Vermeidung vollflächig verklebter Schichten im Ausbau (z. B. geklebtes Parkett). Besser: schwimmend verlegte Beläge, Estriche auf Trennlage, mechanisch montierte Trockenbausysteme statt nasser Putze."),
    # [2D9]
    ("Blauer Engel DE-UZ 102 oder EMICODE EC1 Plus", "ausschließlich emissionsarme Produkte (z. B. Blauer Engel DE-UZ 102 für Innenwandfarben) gemäß QNG-Anlage 3.1.3 vorgegeben?"),
    # [2D10]
    ("ohne halogenierte Stoffe (HFCKW/FKW)", "ohne halogenierte Treibmittel (insbesondere HFKW) hergestellt werden?"),
    # [2D11]
    ("Halbierte E1 (≤ 0.05 ppm)", "Holzwerkstoffe mit halbiertem E1-Wert (≤ 0,05 ppm, Prüfung nach DIN EN 16516; gesetzlicher Grenzwert 0,1 ppm nach ChemVerbotsV)"),
    ("ref: 'AgBB-Grenzwerte'", "ref: 'DIN EN 16516 / ChemVerbotsV'"),
    # [2D12]
    ("Wärmebereitstellungsgrad von mindestens 85 %", "Wärmebereitstellungsgrad von mindestens 75 % (Passivhaus-Kriterium, effektiv; anzustreben ≥ 85 %)"),
    # [2D13]
    ("z.b. **DGNB Gold/Platin** oder das staatliche **QNG**", "z. B. DGNB Gold/Platin oder das staatliche QNG")
]
update_file("src/modules/NachhaltigkeitChecklisten.tsx", nachhaltigkeit_checklisten_replacements)

# Module 32: BestandChecklisten.tsx
bestand_checklisten_replacements = [
    # [2D14]
    ("WTA-Merkblatt 4-5: Bauwerksdiagnostik an Betonbauwerken", "WTA-Merkblatt 4-5-99/D: Beurteilung von Mauerwerk – Mauerwerksdiagnostik"),
    # [2D15]
    ("ref: 'DIN EN 12504-2 / DIN 1074'", "ref: 'DIN EN 12504-2 (Rückprallhammer, Beton), DIN EN 12504-4 (Ultraschall), Bewertung nach DIN EN 13791. Bohrwiderstandsmessung an Holz ist nicht genormt.'"),
    # [2D22]
    ("RiMa-Instandsetzung (DAfStb)", "DIN EN 14630 / TR Instandhaltung (DIBt) bzw. DAfStb-Richtlinie Instandhaltung"),
    # [2D16]
    ("ref: 'DIN EN 1991 / DIN EN 1990'", "ref: 'DIN EN 1990/NA (Sicherheitskonzept) – Bestandserkundung nach ISO 13822 bzw. DIN CEN/TS 17440 (Bewertung bestehender Tragwerke)'"),
    # [2D17]
    ("BMV Nachrechnungsrichtlinie / DIN EN 1991", "Straßenbrücken: Nachrechnungsrichtlinie (BMV, vormals BMVI/BMDV, Ausgabe 05/2011 mit Ergänzungen); Hochbau: DIN EN 1990 ff. mit NA, ergänzend ISO 13822"),
    ("BMDV Nachrechnungsrichtlinie / DIN 1055", "Straßenbrücken: Nachrechnungsrichtlinie (BMV, vormals BMVI/BMDV, Ausgabe 05/2011 mit Ergänzungen); Hochbau: DIN EN 1990 ff. mit NA, ergänzend ISO 13822"),
    # [2D18]
    ("Denkmalsanierung nach VDI 6200, WTA und DIN 1076", "Denkmalsanierung nach VDI 6200 (Standsicherheit), WTA-Merkblättern, Denkmalschutzgesetz und – bei Brücken und Ingenieurbauwerken – DIN 1076."),
    # [2D19]
    ("Anfrage bei der Unteren Denkmalschutzbehörde bezüglich Einzeldenkmalstatus, Ensembleschutz oder Erhaltungssatzung.",
     "Anfrage bei der Unteren Denkmalschutzbehörde (Einzeldenkmal, Ensemble) sowie bei der Gemeinde (Erhaltungssatzung nach § 172 BauGB)."),
    # [2D20]
    ("Gesetzlich verpflichtend bei Baugrubenaushub. Historische Luftbildauswertung zur Identifikation von Blindgängern aus dem 2. Weltkrieg.",
     "Dringend empfohlen (Verkehrssicherungspflicht). Grundlage: Baufachliche Richtlinien Kampfmittelräumung (BFR KMR) und landesspezifische Regelungen; Schadstofferkundung nach VDI 6202."),
    ("ref: 'TR Kampfmittelräumung / LBO'", "ref: 'BFR KMR / VDI 6202'"),
    # [2D21]
    ("Festlegung des erforderlichen Detaillierungsgrads der Bauaufnahme (Stufe I bis V nach Denkmalschutz-Richtlinien)",
     "Festlegung der Genauigkeitsstufe der Bauaufnahme (Stufe I bis IV nach Eckstein) je nach Planungstiefe"),
    # [2D24]
    ("Widerstandbohrung (Resistograph)", "Widerstandsbohrung (Resistograph)"),
    ("Zerstörungsfreie Festigkeitsabschätzungen mittels Rückprallhammer (Schmidthammer), Widerstandsbohrung (Resistograph)",
     "Zerstörungsfreie bzw. zerstörungsarme Festigkeitsabschätzungen mittels Rückprallhammer (Schmidthammer), Widerstandsbohrung (Resistograph)")
]
update_file("src/modules/BestandChecklisten.tsx", bestand_checklisten_replacements)

# Module 33: RueckbauChecklisten.tsx
rueckbau_checklisten_replacements = [
    # [2D25]
    ("behördliche Anmeldung mindestens 14 Tage vor Baubeginn", "Gefährdungsbeurteilung und Anzeige an die zuständige Behörde spätestens 7 Tage vor Beginn der Tätigkeiten"),
    # [2D26]
    ("≤ MEB (Materialwerte ErsatzbaustoffV)", "≤ Materialwert nach Anlage 1 EBV"),
    ("Einstufung RC-1, RC-2, RC-3 in Einbauklassen", "Eluat- und Feststoffkonzentrationen zur Einstufung mineralischer Ersatzbaustoffe in Materialklassen (z. B. RC-1, RC-2, RC-3), aus denen sich die zulässigen Einbauweisen nach Anlage 2 EBV ergeben"),
    # [2D31]
    ("4. BImSchV Nr. 8.15", "BImSchG / 4. BImSchV Anhang 1 Nr. 8.11.2.4 (Behandlung nicht gefährlicher Abfälle) bzw. Nr. 2.2 (Brechen von Gestein)"),
    # [2D27]
    ("formel: 'c_{\\text{Misch}} = \\frac{\\sum m_i \\cdot c_i}{\\sum m_i} \\le \\text{MEB (Materialwerte ErsatzbaustoffV)}'",
     "formel: 'c_{\\text{Misch}} = \\frac{\\sum m_i \\cdot c_i}{\\sum m_i} \\le \\text{Materialwert}'"),
    ("erklaerung: 'Mischungsrechnung zur Überprüfung der Schadstoffgehalte bei Baustoffaufbereitung vor Ort. Gemäß Ersatzbaustoffverordnung zur Einstufung in Verwertungsklassen.'",
     "erklaerung: 'Hinweis: Grenzwerte dürfen nicht durch Vermischen eingehalten werden (Vermischungsverbot, KrWG und ErsatzbaustoffV); maßgeblich ist die Einstufung jeder Abfallcharge für sich.'"),
    # [2D28]
    ("ref: 'VDI 6202 Blatt 1 / GewAbfV § 8'", "ref: '§ 5a GefStoffV, TRGS 519/524, VDI 6202 Blatt 1'"),
    ("Systematische Schadstofferfassung vor Beginn der Abbrucharbeiten (Asbest, KMF, PCB, PAK, Schwermetalle). Erstellung eines Schadstoffkatasters.",
     "Grundlagen: § 5a GefStoffV (Informations- und Mitwirkungspflicht des Veranlassers zu Baujahr und Schadstoffverdacht), TRGS 519/524; Methodik nach VDI 6202 Blatt 1."),
    # [2D29]
    ("Getrennte Erfassung und Entsorgung mineralischer und nichtmineralischer Fraktionen auf der Baustelle (mineralische Bauabfälle, Holz, Glas, Kunststoffe, Metalle und Gips).",
     "Getrennte Erfassung von Glas, Kunststoff, Metallen, Holz, Dämmmaterial, Bitumengemischen, Baustoffen auf Gipsbasis, Beton, Ziegeln sowie Fliesen und Keramik (§ 8 GewAbfV); Abweichungen dokumentieren."),
    # [2D30]
    ("Einholen der behördlichen Abbruchgenehmigung", "Verfahrensrechtliche Voraussetzungen des Abbruchs klären"),
    ("Prüfung der Genehmigungspflicht nach Landesbauordnung (LBO). Erstellung der bautechnischen Nachweise und der Abbruchanzeige bei der Bauaufsichtsbehörde.",
     "Verfahrensrechtliche Voraussetzungen des Abbruchs nach Landesbauordnung klären (z. B. BayBO Art. 57 Abs. 5: verfahrensfrei oder Anzeige mindestens einen Monat vorher, ggf. mit Standsicherheitsbestätigung; Denkmalschutz gesondert prüfen)."),
    # [2D32]
    ("formel: 'Q_{\\text{Verwertung}} = \\frac{m_{\\text{Recycling}} + m_{\\text{Wiederverwendung}}}{m_{\\text{gesamt}}} \\ge 70\\%'",
     "formel: 'Q_{\\text{Verwertung}} = \\frac{m_{\\text{Wiederverwendung}} + m_{\\text{Recycling}} + m_{\\text{sonst. stoffl.}}}{m_{\\text{gesamt}}}'"),
    ("erklaerung: 'Stoffliche Verwertungsquote für mineralische Bau- und Abbruchabfälle nach § 14 KrWG zur Ressourcenschonung.'",
     "erklaerung: 'Verwertungsquote = (Vorbereitung zur Wiederverwendung + Recycling + sonstige stoffliche Verwertung) / Abfallmasse gesamt. Orientierung: nationales Ziel nach § 14 Abs. 3 KrWG mindestens 70 Gew.-% für nicht gefährliche Bau- und Abbruchabfälle (ohne Boden und Steine), keine projektbezogene Pflichtquote.'"),
    # [2D33]
    ("Bestellung eines Sicherheits- und Gesundheitsschutzkoordinators bei komplexen oder schadstoffbelasteten Projekten mit mehreren Gewerken.",
     "SiGeKo nach § 3 BaustellV bestellen, sobald Beschäftigte mehrerer Arbeitgeber tätig werden; SiGe-Plan bei vorankündigungspflichtigen Baustellen oder besonders gefährlichen Arbeiten (Anhang II, z. B. krebserzeugende Gefahrstoffe). Weisungsbefugnisse des SiGeKo nur, wenn der Bauherr sie vertraglich überträgt."),
    # [2D34]
    ("EBV § 19, § 20 & Anhang 2", "ErsatzbaustoffV §§ 19, 20 und Anlage 2"),
    # [2D36]
    ("Probenahmebeprobung", "Probenahme")
]
update_file("src/modules/RueckbauChecklisten.tsx", rueckbau_checklisten_replacements)

# Module 34: DauerhaftigkeitChecklisten.tsx
dauerhaftigkeit_checklisten_replacements = [
    # [2D37]
    ("max. 0,50 bei XD3 / XF4", "z. B. max. 0,45 bei XD3 / XS3, max. 0,50 bei XF4 mit Luftporen"),
    # [2D38]
    ("Abgleich des Mindestwasserzementwerts", "Abgleich des höchstzulässigen Wasserzementwerts (max. w/z)"),
    # [2D39]
    ("Bei XF3/XF4 ist ein künstlicher Mikroluftporengehalt (LP-Zusatzmittel) zur Frostbeständigkeit nachzuweisen.",
     "Bei XF4 (sowie bei den LP-Varianten von XF2/XF3) ist künstlich eingeführter Mikroluftporengehalt vorgeschrieben und im Frischbeton zu prüfen (DIN EN 12350-7). XF3 kann alternativ ohne LP mit w/z höchstens 0,50 und mindestens C35/45 ausgeführt werden."),
    # [2D40]
    ("formel: 'h_w \\le 0.50 \\cdot h_t'", "formel: 'x \\ge 30\\,\\text{mm} \\text{ und } x \\ge 1{,}5 \\cdot d_g'"),
    ("erklaerung: 'Mindest-Druckzonenhöhe bei Wasserundurchlässigem Beton (WU-Richtlinie des DAfStb) zur Vermeidung von Trennrissen.'",
     "erklaerung: 'x ≥ 30 mm und x ≥ 1,5 · dg (Größtkorn): Mindestdruckzonenhöhe im Gebrauchszustand nach DAfStb-WU-Richtlinie, um bei Biegebeanspruchung durchgehende Trennrisse auszuschließen.'"),
    # [2D41]
    ("DIN EN 206-1", "DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton – Festlegung, Eigenschaften, Herstellung und Konformität)"),
    # [2D42]
    ("Δc dur,\\gamma", "Δc dur,γ"),
    # [2D43]
    ("Beleuchtung mit Wasser", "Befeuchtung mit Wasser")
]
update_file("src/modules/DauerhaftigkeitChecklisten.tsx", dauerhaftigkeit_checklisten_replacements)

# Module 35: SchaedenChecklisten.tsx
schaeden_checklisten_replacements = [
    # [2D45]
    ("ref: 'WTA-Merkblatt 4-6 / DIN V 18028'", "ref: 'DAfStb-Richtlinie Instandhaltung von Betonbauteilen, Teil 1 / WTA'"),
    ("Rissbreitenmessung mit Risslineal und Rissmikroskop. Klassifizierung nach Risstiefe, Rissverlauf und Rissursache.",
     "Risskartierung und Rissmonitoring (z. B. nach DAfStb-Richtlinie Instandhaltung von Betonbauteilen, Teil 1 – Bestandsaufnahme)"),
    # [2D46]
    ("ref: 'RI-WI-ALT / TR Instandhaltung'", "ref: 'TR Instandhaltung (DIBt) / DIN 1076 mit RI-EBW-PRÜF (Ingenieurbauwerke)'"),
    # [2D47]
    ("Frössel, F. (2018): Bauschadens-Sammlung (Fraunhofer IRB Verlag)", "Zimmermann, G. (Hrsg.): Bauschadens-Sammlung (mehrbändig, Fraunhofer IRB Verlag)")
]
update_file("src/modules/SchaedenChecklisten.tsx", schaeden_checklisten_replacements)

# Module 36, 37, 39: Praxiswissen.tsx
praxiswissen_replacements = [
    # [2D50]
    ("Für R90-Bauteile (Stahlbetonstützen) ist das Mindestachsmaß 'a' nach Tabelle 5.2a der DIN EN 1992-1-2 einzuhalten (z.B. min. 35 mm bei b = 300 mm).",
     "Für R90-Stützen hängt das Mindestachsmaß a nach Tab. 5.2a DIN EN 1992-1-2 vom Ausnutzungsgrad μfi ab. Für b = 300 mm gilt z. B. a = 25 mm bei μfi = 0,2 und a = 45 mm bei μfi = 0,5."),
    # [2D51]
    ("Gibt es für ein Tragwerksprodukt weder abZ noch ETA, muss der Antrag auf vorhabenbezogene Bauartgenehmigung (vBG) mindestens 6 Monate vor Einbau bei der Obersten Bauaufsichtsbehörde eingereicht werden.",
     "Gibt es für ein Bauprodukt weder abZ noch ETA, ist eine Zustimmung im Einzelfall (ZiE), für eine nicht geregelte Bauart eine vorhabenbezogene Bauartgenehmigung (vBG) bei der obersten Bauaufsichtsbehörde des Landes zu beantragen; wegen Gutachten und Prüfungen mehrere Monate Vorlauf einplanen."),
    # [2D53]
    ("Für massige Bauteile (z.B. Sohlplatten >80 cm) zwingend CEM III/A-Zemente (Hochofenzement mit min. 35-65 % Hüttensandgehalt) oder CO2-reduzierte CEM II-C Zemente vorschreiben",
     "Für massige Bauteile (z. B. Sohlplatten > 80 cm) zwingend CEM III/A-Zemente (Hochofenzement mit 36–65 % Hüttensand) oder CO₂-reduzierte Zemente (CEM II/B-M, CEM II/C-M nach DIN EN 197-5) vorschreiben"),
    # [2D49]
    ("Abklärung mit dem Bodengutachter: Liegt drückendes Wasser (W2.1-E) vor, das eine WU-Betonkonstruktion (Weiße Wanne) erfordert, oder mäßige Feuchte (W1.1-E)?",
     "Ist mit drückendem Wasser (W2.1-E: mäßige Einwirkung bis 3 m Eintauchtiefe, W2.2-E: hohe Einwirkung) oder nur mit Bodenfeuchte und nicht drückendem Wasser (W1.1-E/W1.2-E) zu rechnen?"),
    # [2D52]
    ("Bei Produktvorgaben im LV (z.B. Fabrikatsnennung) muss zwingend 'oder gleichwertig' ergänzt werden (§ 7 Abs. 2 VOB/A), um Vergaberechtsverstöße und Rügen zu vermeiden.",
     "Produktvorgaben sind im öffentlichen Bau nur ausnahmsweise zulässig (durch den Auftragsgegenstand gerechtfertigt oder nicht hinreichend genau beschreibbar) und dann zwingend mit dem Zusatz „oder gleichwertig“ zu versehen (§ 7 Abs. 2 VOB/A); Gleichwertigkeitskriterien im LV benennen."),
    # [2D54]
    ("Ausschreibung von einkomponentigen Polyurenthan-Reaktivabdichtungen (FPD)", "Ausschreibung von flexiblen polymeren Dickbeschichtungen (FPD, mit abP)"),
    # [2D55]
    ("formel: 't_{\\text{offen}} = t_{\\text{Erstarrungsbeginn}} - t_{\\text{Mischen}} \\ge 90\\,\\text{min}'",
     "formel: 't_{\\text{Entladen}} - t_{\\text{Wasserzugabe}} \\le 90\\,\\text{min}'"),
    ("erklaerung: 'Maximale Transport- und Einbauzeit von Normalbeton ohne Verzögerer nach DIN EN 206 zur Vermeidung von Kaltestrichen und Entmischung.'",
     "erklaerung: 'Transportbeton ist im Fahrmischer spätestens 90 min, in Fahrzeugen ohne Rührwerk spätestens 45 min nach der ersten Wasserzugabe zu entladen (DIN 1045-2/-3); längere Zeiten nur mit Verzögerer und Vereinbarung. Der Erstarrungsbeginn muss nach Einbau und Verdichtung liegen.'"),
    # [2D56]
    ("Schachtmindestmaße um min. 5 cm Toleranz vergrößern, um Dämmstärken nach DIN 1988-200 kollisionsfrei montieren zu können.",
     "Schachtmaße unter Berücksichtigung der Dämmdicken der Rohrleitungen (z. B. nach DIN 1988-200 bzw. GModG) und der Montageabstände ausreichend bemessen."),
    # [2D57]
    ("Nachträgliche Kernbohrungen durch tragende Bauteile kosten im Schnitt das Fünffache der ursprünglichen Planungskosten!",
     "Nachträgliche geometrische Änderungen an Rohbauteilen kosten ein Vielfaches der ursprünglichen Planungskosten!"),
    # [2D58]
    ("Praxis-Tipp: Schreiben Sie für massige Innenbauteile", "Praxis-Tipp: Schreiben Sie für massige Innenbauteile"),
    # [2D59]
    ("Jeder Liter unberechtigt zugegebenes Wasser erhöht den w/z-Wert der Mischung um ca. 0,02, was zu einem dramatischen Festigkeitsabfall führt. Wasserzugaben auf der Baustelle sind strengstens untersagt und müssen auf dem Lieferschein vermerkt werden.",
     "Praxis-Tipp: Bereits 10 Liter unberechtigt zugegebenes Wasser je m³ erhöhen den w/z-Wert (bei üblichen 280–350 kg/m³ Zement) um ca. 0,03 bis 0,04 und mindern die 28-Tage-Druckfestigkeit um rund 3 bis 5 N/mm². Konsistenzänderungen auf der Baustelle dürfen nur durch nachträgliche Fließmittelzugabe nach Vorgabe des Betonherstellers erfolgen."),
    # [2D60]
    ("Die Mindestbetondeckung c_nom (meist c_min + 10 mm Toleranz)",
     "Die Betondeckung c_nom (= c_min + Δc_dev, in Deutschland i. d. R. 15 mm, bei XC1 10 mm, nach DIN EN 1992-1-1/NA)"),
    # [2D61]
    ("HOAI LEISTUNGSBILD LPH 8 / DIN 18550", "HOAI LEISTUNGSBILD LPH 8 (Objektüberwachung, Grundleistung „Führen eines Bautagebuchs“)"),
    # [2D62]
    ("Potentialausgleich und Fundamenterder nach DIN 18015: Der Durchgangswiderstand muss vor dem Betonieren gemessen werden (R < 0,2 Ohm).",
     "Praxis-Tipp: Fundamenterder bzw. Ringerder nach DIN 18014: Die Durchgängigkeit muss vor dem Betonieren von einer Elektro- oder Blitzschutzfachkraft gemessen und mit Prüfprotokoll (Durchgangswiderstand < 0,2 Ohm) dokumentiert werden."),
    # [2D65]
    ("Entladung des Fahrmischers innerhalb der zulässigen Verarbeitungszeit (max. 90-120 Min ab Abfahrt Werk)",
     "Verarbeitungszeit prüfen: Entladung spätestens 90 min nach erster Wasserzugabe (Lieferschein), längere Zeiten nur mit Verzögerer und Vereinbarung."),
    # [2D63]
    ("Holzfeuchtemessung vor dem Beplanken (DIN 1052 / DIN EN 1995-1-1)", "Holzfeuchtemessung vor dem Beplanken (DIN EN 1995-1-1/NA / DIN EN 13183-2)"),
    # [2D64]
    ("Wirksamkeit von Chromatreduzierern in Zementsäcken prüfen (EG-Richtlinie 2003/53/EG). Abgelaufene Säcke dürfen wegen Chromatallergie-Gefahr nicht verarbeitet werden.",
     "Die Wirksamkeit der Chromatreduzierer ist zeitlich begrenzt (Lagerfrist laut Herstellerangabe, meist ca. 6 Monate); Grenzwert für lösliches Chrom(VI) von 2 mg/kg nach REACH-Verordnung (EG) 1907/2006, Anhang XVII Nr. 47."),
    # [2D66]
    ("Wird dieser Bedenkenhinweis unterlassen, haftet der Auftragnehmer vollständig für Folgeschäden!",
     "Wird die Anmeldung (schriftlich, § 4 Abs. 3 VOB/B) unterlassen, haftet der Auftragnehmer für daraus entstehende Mängel; ein Mitverschulden des Auftraggebers (z. B. Planungsfehler) kann die Haftung mindern."),
    # [2D67]
    ("Nachbehandlungsklasse NB2 (Dauer min. 2 bis 4 Tage je nach Festigkeitsentwicklung)",
     "Nachbehandlung nach Nachbehandlungsklasse 2 veranlassen (Mindestdauer je nach Festigkeitsentwicklung r und Oberflächentemperatur ca. 1 bis 15 Tage, DIN 1045-3)"),
    # [2D68]
    ("sind Sie Sachwalter des Bauherrn. du musst die Ausführung", "sind Sie Sachwalter des Bauherrn. Sie müssen die Ausführung"),
    ("Wenn du als Ausführender merken, dass", "Wenn Sie als Ausführender merken, dass"),
    ("Setze sich im Zweifel nie", "Setzen Sie sich im Zweifel nie"),
    # [2D69]
    ("hier sind zwingend Thermomatten vorschreiben", "hier sind zwingend Thermomatten vorzuschreiben"),
    ("Einwage beträgt", "Die Einwaage beträgt"),
    # [2D78]
    ("Praxis-Tipp: Die zulässigen Dosiertoleranzen nach DIN EN 206 betragen ±3 % für Gesteinskörnungen und Zusatzstoffe sowie ±2 % für Zement, Wasser und Zusatzmittel.",
     "Praxis-Tipp: Die zulässigen Dosiertoleranzen beim Herstellen von Beton liegen laut DIN EN 206 (Tab. 21) bei ±3 % für Zement, Wasser, Gesteinskörnung und Zusatzstoffe (> 5 % des Zementgehalts) sowie bei ±5 % für Zusatzmittel und Zusatzstoffe (≤ 5 %)."),
    # [2D80]
    ("Bei Typ 1 (rc-Betonsplitt) sind im Anwendungsbereich der trockenen Innenbauteile (XC1, XC2) bis zu 35 Vol.-% Substitution ohne gesonderten Nachweis zulässig.",
     "Praxis-Tipp: Bei Typ 1 (Betonsplitt) dürfen nach DIN 1045-2 bei trockenen Innenbauteilen (WO, XC1) bis zu 45 Vol.-% und bei feuchten Bauteilen (WF, z. B. XC2–XC4, XF1, XF3) bis zu 35 Vol.-% der groben Gesteinskörnung (> 2 mm) ersetzt werden, ohne dass die Bemessung angepasst werden muss."),
    # [2D84]
    ("Lagerung im Wasserbad bei 20°C ≥ 95% relative Luftfeuchte", "Lagerung im Wasserbad bei (20 ± 2) °C oder in der Feuchtkammer bei ≥ 95 % r. F. (DIN EN 12390-2)"),
    # [2D81]
    ("Verordnung (EU) Nr. 305/2011 (BauPVO)", "EU-BauPVO (EU) 2024/3110 (übergangsweise VO (EU) Nr. 305/2011 für Produkte unter alten harmonisierten Normen)"),
    # [2D79]
    ("Bei tragenden Bauteilen (z.B. Deckenplatten im System 2+) führt eine notifizierte Stelle (Überwachungsstelle) die Erstinspektion und die laufende Überwachung durch und stellt das Konformitätszertifikat aus.",
     "Bei System 2+ (z. B. Deckenplatten) führt eine notifizierte Zertifizierungsstelle für die WPK die Erstinspektion und die laufende Überwachung der WPK durch und stellt eine Bescheinigung der Konformität der WPK aus; die Leistungserklärung erstellt der Hersteller."),
    # [2D82]
    ("Die Mischguttemperatur für Asphaltbeton mit Straßenbaubitumen 50/70 bzw. 70/100 muss beim Verlassen des Mischers exakt bei +140 °C bis +180 °C liegen.",
     "Die Mischguttemperatur hängt von der Bitumensorte ab (z. B. 70/100: ca. 140 bis 180 °C, 50/70: ca. 150 bis 190 °C, TL Asphalt-StB)."),
    # [2D83]
    ("Aufgrund von 4 % Eigenfeuchtigkeit im Sandbunker befinden sich in 1.000 kg Sand exakt 40 kg freie Feuchte, die vollumfänglich vom Anmachwasserrezepturwert subtrahiert werden müssen!",
     "Bei 4 % Oberflächenfeuchte (Gesamtfeuchte abzüglich Kernfeuchte, bezogen auf die Trockenmasse) sind bei 1000 kg Sand (trocken) 40 kg Wasser vom Anmachwasser abzuziehen und der Sandeinwaage zuzuschlagen."),
    # [2D85]
    ("Danach erfolgt die dichte feuchte Ausschälung und", "Danach werden die Probekörper ausgeschalt, es folgt"),
    ("Sichern Sie die tägliche Kalibrierung der Mikrowellensonden in den Sandbunkern und führe regelmäßige Darrmethoden-Vergleichstests",
     "Sichern Sie die tägliche Kalibrierung der Mikrowellensonden in den Sandbunkern und führen Sie regelmäßige Darrmethoden-Vergleichstests")
]
update_file("src/modules/Praxiswissen.tsx", praxiswissen_replacements)

# Module 38: Bautagebuch.tsx
bautagebuch_replacements = [
    # [2D70]
    ("+ Haftzugprüfung der rissüberbrückenden OS-8 Fahrbahnbeschichtung (Soll: ≥ 1,5 N/mm²)",
     "+ Haftzugprüfung der rissüberbrückenden OS-11-Fahrbahnbeschichtung (Soll: ≥ 1,5 N/mm²)"),
    ("OS-8 Fahrbahnbeschichtung", "OS-11-Fahrbahnbeschichtung"),
    # [2D71]
    ("Besondere Anforderungen: Expositionsklassen XD3/XS3 sowie Tausalzbeständigkeit durch Hydrophobierung.",
     "Montage von großformatigen Fertigteilen hoher Festigkeitsklassen (C50/60). Kritische Schnittstellen sind das schwindkompensierte Ausgießen der lastübertragenden Fugen mit quellfähigem Vergussmörtel, die Expositionsklassen XD3/XF4 (Tausalz, Frost) sowie der Chloridschutz der Deckflächen durch rissüberbrückende Oberflächenschutzsysteme."),
    # [2D72]
    ("Herausforderung: Stornierung der bitumenfreien Bauwerks-Reaktivabdichtung (MDS)",
     "Herausforderung: Stornierung der rissüberbrückenden mineralischen Dichtungsschlämme (MDS)"),
    ("+ Auftragen der bitumenfreien Bauwerks-Reaktivabdichtung (MDS) an Sockelanschlüssen",
     "+ Auftragen der rissüberbrückenden mineralischen Dichtungsschlämme (MDS) an Sockelanschlüssen"),
    # [2D73]
    ("1. Beweislastumkehr im Gewährleistungsprozess: Kann die Bauleitung keine lückenlose Dokumentation vorweisen, haftet er vollumfänglich für aufgetretene Baumängel.",
     "1. Verschlechterte Beweislage im Gewährleistungsprozess: Kann der Bauüberwacher keine Temperaturaufzeichnungen vorlegen, fällt ihm der Nachweis ordnungsgemäßer Überwachung (z. B. bei Frostschäden) deutlich schwerer."),
    # [2D74]
    ("2. Verlust von Vergütungs- und Schadensersatzansprüchen: Ohne tagesaktuelle, detaillierte Behinderungsanzeige verliert der Auftragnehmer nach § 6 VOB/B jeden Anspruch auf Bauzeitverlängerung.",
     "2. Gefährdung von Behinderungsansprüchen (§ 6 VOB/B): Ohne unverzügliche schriftliche Behinderungsanzeige werden hindernde Umstände nur berücksichtigt, wenn sie dem Auftraggeber offenkundig bekannt waren."),
    # [2D75]
    ("quelle: 'DIN 1045-3 Tabelle 2'", "quelle: 'Reifegradansatz nach Saul / DIN 1045-3'"),
    ("erklaerung: 'Ausschalfrist in Tagen abhängig von der mittleren Bauteiltemperatur T [°C] nach DIN 1045-3 für Normalbeton.'",
     "erklaerung: 'Abschätzung der Ausschalfrist über einen Reifegradansatz (nach Saul, Bezug 20 °C): t_Ausschal ≥ t_min · 30/(T + 10). Näherung aus der Fachliteratur, keine Normformel; maßgebend ist der Nachweis ausreichender Betonfestigkeit (DIN 1045-3).'"),
    # [2D76]
    ("Rissbindung", "Rissbildung"),
    ("w/z-Worterhöhung", "w/z-Werterhöhung"),
    ("Festigkeitklasse", "Festigkeitsklasse"),
    # [2D77]
    ("und lassen Sie deine Eingabe", "und lassen Sie Ihre Eingabe"),
    ("untersagen Sie jegliche", "untersagen Sie jegliche"),
    ("veranlassen Sie das Auflegen", "veranlassen Sie das Auflegen"),
    ("messen Sie die", "messen Sie die")
]
update_file("src/modules/Bautagebuch.tsx", bautagebuch_replacements)

print("Batch 30-39 script finished.")
