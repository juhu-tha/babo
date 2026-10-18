import sys
from patch_modules import update_file

# Module 40: FehlerRechtEthik.tsx
fehler_recht_ethik_replacements = [
    # [2D87]
    ("statische Bemessung von Hochhäusern", "Betrieb kritischer Infrastruktur (z. B. Überwachung und Steuerung von Straßentunneln)"),
    ("KI-Systeme, die als Sicherheitsbauteile beim Betrieb kritischer Infrastruktur eingesetzt werden (Anhang III Nr. 2, z. B. Überwachung und Steuerung von Straßentunneln, Wasser- oder Energieversorgung), sind Hochrisiko-KI und unterliegen Risikomanagement, Konformitätsbewertung und CE-Kennzeichnung. Reine Planungs- und Bemessungssoftware fällt nicht darunter; die Verantwortung für die Standsicherheit bleibt beim Tragwerksplaner.",
     "KI-Systeme, die als Sicherheitsbauteile beim Betrieb kritischer Infrastruktur eingesetzt werden (Anhang III Nr. 2, z. B. Überwachung und Steuerung von Straßentunneln, Wasser- oder Energieversorgung), sind Hochrisiko-KI und unterliegen Risikomanagement, Konformitätsbewertung und CE-Kennzeichnung. Reine Planungs- und Bemessungssoftware fällt nicht darunter; die Verantwortung für die Standsicherheit bleibt beim Tragwerksplaner."),
    ("Software zur statischen Bemessung von Hochhäusern oder zur Auslegung von Brandschutzkonzepten wird nach Anhang III als 'Hochrisiko-KI' eingestuft",
     "KI-Systeme, die als Sicherheitsbauteile beim Betrieb kritischer Infrastruktur eingesetzt werden (Anhang III Nr. 2, z. B. Überwachung und Steuerung von Straßentunneln, Wasser- oder Energieversorgung), sind Hochrisiko-KI und unterliegen Risikomanagement, Konformitätsbewertung und CE-Kennzeichnung. Reine Planungs- und Bemessungssoftware fällt nicht darunter; die Verantwortung für die Standsicherheit bleibt beim Tragwerksplaner."),
    # [2D88]
    ("Nutzer müssen transparent informiert werden, wenn Inhalte (Pläne, Gutachten, Ausschreibungstexte) von einer KI generiert wurden (Art. 50 AI Act).",
     "Art. 50 verpflichtet Anbieter, KI-generierte Inhalte maschinenlesbar zu kennzeichnen, und Betreiber, Deepfakes sowie KI-Texte zur Information der Öffentlichkeit offenzulegen. Für Pläne und Gutachten gibt es keine generelle Kennzeichnungspflicht nach dem AI Act; eine Offenlegung kann aber vertraglich oder berufsrechtlich geboten sein. In Bachelor-/Masterarbeiten ergibt sich die Offenlegungspflicht aus Prüfungsordnung und Eigenständigkeitserklärung."),
    # [2D91]
    ("Versicherer werten dies als grobe Fahrlässigkeit und können die Deckung verweigern.",
     "Die Berufshaftpflichtversicherung deckt grundsätzlich auch grobe Fahrlässigkeit; bei wissentlichem Abweichen von Normen oder Pflichten kann der Versicherungsschutz jedoch entfallen."),
    # [2D95]
    ("spart dies Gigawattstunden an grauer Energie ein",
     "spart das je Bauteil Dutzende Megawattstunden an grauer Energie ein – über viele Bauwerke skaliert ein erheblicher Nutzen"),
    # [2D86]
    ("Die KI-Verordnung der Europäischen Union ist am 1. August 2024 in Kraft getreten und stellt den weltweit ersten umfassenden Rechtsrahmen für Künstliche Intelligenz dar.",
     "Die KI-Verordnung (EU) 2024/1689 ist am 01.08.2024 in Kraft getreten und gilt gestuft: Verbote und KI-Kompetenz (Art. 4) seit 02.02.2025, Pflichten für KI-Modelle mit allgemeinem Verwendungszweck seit 02.08.2025, Transparenzpflichten (Art. 50) seit 02.08.2026. Durch den Digital Omnibus (VO (EU) 2026/1744) gelten die Hochrisiko-Pflichten nach Anhang III erst ab 02.12.2027, nach Anhang I ab 02.08.2028."),
    # [2D89]
    ("Die vollübertragene automatische Freigabe von Bauanträgen oder Standsicherheitsnachweisen durch KI ohne menschliche Kontrollinstanz ('Human in the Loop') ist gesetzwidrig.",
     "Vollautomatisierte Verwaltungsakte (z. B. Baugenehmigungen) sind nur zulässig, soweit eine Rechtsvorschrift dies erlaubt und kein Ermessen besteht (§ 35a VwVfG bzw. Landesrecht)."),
    # [2D92]
    ("Nach ständiger BGH-Rechtsprechung entlastet die Verwendung von Software den planenden Ingenieur zu 0 %.",
     "Nach der Rechtsprechung entlastet es den Planer nicht, sich auf Software (FE-Programme, KI) zu verlassen: Fehler der Software werden ihm grundsätzlich wie eigene Fehler zugerechnet."),
    # [2D93]
    ("Wer Bauherren-Adressen, statische Berechnungen oder vertrauliche Baugrundgutachten unverschlüsselt in Public-Cloud-LLMs (wie ChatGPT) hochlädt, begeht einen meldepflichtigen Datenschutzverstoß (Art. 33 DSGVO). Es drohen Bußgelder bis zu 20 Mio. €.",
     "Wer personenbezogene Daten (z. B. Bauherrennamen) ohne Rechtsgrundlage und Auftragsverarbeitungsvertrag in Public-Cloud-LLMs hochlädt, verstößt gegen die DSGVO; es drohen Bußgelder bis 10 Mio. € bzw. 2 % oder bis 20 Mio. € bzw. 4 % des Weltumsatzes (Art. 83)."),
    # [2D94]
    ("Modelle basieren auf teuren Fachbüchern (z. B. Wendehorst, Schneider) und DIN-Normen, ohne dass Verlage oder Autoren vergütet werden.",
     "Das Training mit urheberrechtlich geschützten Fachwerken ist rechtlich umstritten (TDM-Schranke § 44b UrhG mit Nutzungsvorbehalt, Urheberrechtsstrategie der GPAI-Anbieter nach Art. 53 AI Act). Als Studierende und Ingenieure bleibt der Kauf und das Studium von Originalnormen Pflicht."),
    # [2D96]
    ("Die Teilsicherheitsbeiwerte γ_c = 1,50 (Beton) und γ_s = 1,15 (Stahl) nach Eurocode 2 sind ausnahmslos einzuhalten (Fundstelle: DIN EN 1992-1-1 NA Tabelle 2.1N).",
     "Nach DIN EN 1992-1-1 mit NA gilt für die ständige und vorübergehende Bemessungssituation im Regelfall γc = 1,50 und γs = 1,15 (Abweichungen z. B. bei hochfestem Beton ab C55/67). Fundstelle: DIN EN 1992-1-1/NA, 2.4.2.4, Tabelle 2.1DE."),
    # [2D97]
    ("Eine einzige komplexe Anfrage an ein Frontier-Modell (z. B. Gemini 3.8 Flash Thinking oder o4-mini) verbraucht schätzungsweise das 10- bis 30-fache an elektrischer Energie im Vergleich zu einer Standard-Google-Suche.",
     "Eine einzige komplexe Anfrage an ein aktuelles Reasoning-Modell (z. B. mit „Extended Thinking“) verbraucht schätzungsweise ein Vielfaches an elektrischer Energie im Vergleich zu einer Standard-Suche."),
    # [2D98]
    ("Sacks, R. et al.: BIM and AI in Civil Engineering. Developments in the Built Environment, 2020.",
     "Sacks, R.; Girolami, M.; Brilakis, I. (2020): Building Information Modelling, Artificial Intelligence and Construction Tech. Developments in the Built Environment 4."),
    # [2D100]
    ("Russel, S. et al.: Artificial Intelligence - A Modern Approach.", "Russell, S.; Norvig, P.: Artificial Intelligence - A Modern Approach."),
    ("standssicherheitsrelevante Gefahren", "sicherheitsrelevante Gefahren"),
    ("(als Anhang zur These binden)", "(als Anhang zur Abschlussarbeit binden)")
]
update_file("src/modules/ki/FehlerRechtEthik.tsx", fehler_recht_ethik_replacements)

# Module 41: Gesteine.tsx & BaustoffProfil.tsx
gesteine_replacements = [
    # [3A1]
    ("Therme Vals von Peter Zumthor aus Andeerer Gneis", "(z. B. Therme Vals von Peter Zumthor aus lokalem Valser Quarzit; David Chipperfield James-Simon-Galerie Berlin)"),
    ("Therme Vals aus Andeerer Gneis", "Therme Vals aus lokalem Valser Quarzit"),
    # [3A2]
    ("Pflastersteine (DIN EN 1341)", "Pflastersteine (DIN EN 1342), Bodenplatten für Außenbereiche (DIN EN 1341)"),
    # [3A5]
    ("Typ-I und Typ-II nach DAfStb-Richtlinie", "rezyklierte Gesteinskörnung (Typ 1 und Typ 2 nach DIN 4226-101) im Hochbaubeton nach DIN 1045-2:2023-08"),
    # [3A4]
    ("niemals mit normalem Portlandzement verlegen ... Ausschließlich speziellen, thixotropen Trassmörtel verwenden",
     "Natursteine im Außenbereich nicht mit beliebigem Zementmörtel verlegen: Lösliche Alkalien und Calciumhydroxid können zu Verfärbungen und Kalkausblühungen führen. Natursteingeeignete, alkaliarme Verlegemörtel (z. B. Trasszementmörtel) verwenden."),
    ("Natursteine niemals mit normalem Portlandzement verlegen, um Ausblühungen und Verfärbungen zu verhindern. Ausschließlich speziellen, thixotropen Trassmörtel verwenden.",
     "Natursteine im Außenbereich nicht mit beliebigem Zementmörtel verlegen: Lösliche Alkalien und Calciumhydroxid können zu Verfärbungen und Kalkausblühungen führen. Natursteingeeignete, alkaliarme Verlegemörtel (z. B. Trasszementmörtel) verwenden."),
    # [3A6]
    ("Rohdichte (Scheinbare Dichte): Masse der getrockneten Gesteinskörner bezogen auf das Volumen inklusive der geschlossenen und offenen Poren.",
     "Rohdichte (ofentrocken): Dichte des Gesteinskorns einschließlich offener und geschlossener Poren. Scheinbare Rohdichte: nur einschließlich der geschlossenen (wasserundurchlässigen) Poren."),
    # [3A7]
    ("A-Linie: gröberes Gemisch mit geringem Zementleimanspruch (oft in der Praxis anzustreben).",
     "A-Linie: grobkörniges Gemisch mit wenig Feinkorn (geringer Wasseranspruch, aber Entmischungsneigung). Günstig ist in der Regel der Bereich zwischen A und B."),
    ("B-Linie: feineres Gemisch mit besserer Verarbeitbarkeit (Standard).",
     "B-Linie: mittleres Gemisch. Günstig ist in der Regel der Bereich zwischen A und B."),
    # [3A8]
    ("Ausfallkörnung (Gap-Grading): Gezieltes Auslassen mittlerer Korngruppen zur gezielten Verbesserung der Verarbeitbarkeit oder für Spezialbetone (z.B. Splittbeton, Waschbeton).",
     "Ausfallkörnung: Fehlen einzelner mittlerer Kornklassen (Gap-Grading), z. B. für Waschbeton oder geringeren Zementleimbedarf; erhöhte Entmischungsneigung beachten."),
    # [3A9]
    ("Aus Tonstein: Schiefer, Gneis", "Aus Tonstein: Tonschiefer (bei stärkerer Metamorphose Glimmerschiefer, Paragneis). Aus Granit: Orthogneis"),
    # [3A10]
    ("quelle: 'DIN 1045-2 / Fuller (1907)'", "quelle: 'Fuller und Thompson (1907); Regelsieblinien nach DIN 1045-2'"),
    # [3A11]
    ("Reul, H. (2018): Handbuch Baugesteine und Baugebiete (2. Auflage, Springer)",
     "Deutscher Naturwerkstein-Verband (DNV): Bautechnische Information Naturwerkstein (BTI) / DIN EN 12440"),
    # [3A12]
    ("Deine Eigenschaften wie Kornzusammensetzung", "Ihre Eigenschaften wie Kornzusammensetzung"),
    # [3A13]
    ("Polieren, Schleißen, Flammen", "Polieren, Schleifen, Flammen"),
    ("Wasserbasteine", "Wasserbausteine"),
    ("Standardfittings wie Mauersteine", "Standardprodukte wie Mauersteine")
]
update_file("src/modules/Gesteine.tsx", gesteine_replacements)

# BaustoffProfil stone / Megalith
baustoff_profil_replacements = [
    ("Megalithanlagen wie Stonehenge", "Spätestens seit der Jungsteinzeit ein zentrales Baumaterial der Menschheit (Megalithanlagen wie Stonehenge, ca. 3000–1500 v. Chr.)."),
    ("Reversibler, klimaneutraler Kalkkreislauf", "Kalkkreislauf (beim Brennen freigesetztes CO₂ wird bei der Erhärtung teilweise wieder gebunden)"),
    ("Bei höheren Brenntemperaturen (> 180-300 °C) entsteht unlösliches Anhydrit-Material",
     "Bei höheren Brenntemperaturen entsteht zunächst löslicher Anhydrit III (ca. 180–300 °C), ab ca. 300–500 °C schwerlöslicher Anhydrit II"),
    ("Zunehmend Phosphorgips aus industriellen Reststoffprozessen",
     "Mit dem Kohleausstieg geht REA-Gips zurück; ersetzt wird er v. a. durch Naturgips und zunehmend durch Recyclinggips."),
    ("Empire State Building (1931) nutzte als erstes Großprojekt Aluminium",
     "Frühe Bauanwendungen von Aluminium finden sich z. B. an Otto Wagners Postsparkasse Wien (1906); das Empire State Building (1931) machte Aluminium als Fassadenwerkstoff populär")
]
update_file("src/components/ui/BaustoffProfil.tsx", baustoff_profil_replacements)

# Module 42: Mauerwerk.tsx
mauerwerk_replacements = [
    # [3A14]
    ("f_k = K \\cdot f_b^{0.7} \\cdot f_m^{0.2}", "f_k = K \\cdot f_b^{0.7} \\cdot f_m^{0.3}"),
    ("const fk = K * Math.pow(fb, 0.7) * Math.pow(fm, 0.2);", "const fk = K * Math.pow(fb, 0.7) * Math.pow(fm, 0.3);"),
    # [3A15]
    ("{ label: 'Mauerziegel (Ton-Vollstein)', value: '0.45' }", "{ label: 'Mauerziegel (Ton-Vollstein, Gruppe 1, K = 0.55)', value: '0.55' }"),
    # [3A16]
    ("fd 2.77 MPa", "fd = ζ · fk / γM = 0,85 · 4,15 / 1,5 = 2,35 MPa"),
    # [3A20]
    ("Gebrannte Tonziegel und insbesondere Klinker weisen extrem geringe Wasseraufnahmen auf (< 6 Gew.-%) und sind absolut frost- und tausalzbeständig.",
     "Klinker weisen eine geringe Wasseraufnahme (höchstens 6 Masse-%) auf und sind frostwiderstandsfähig; Vormauerziegel sind frostwiderstandsfähig, Hintermauerziegel nicht."),
    # [3A17]
    ("Knickbeiwert Φ 0.58", "Abminderungsbeiwert am Wandkopf/-fuß Φi = 1 − 2e/t = 0,58 (Knicknachweis in Wandmitte mit Φm gesondert führen)"),
    # [3A18]
    ("f_{vk0} = \\text{Anfangsscherfestigkeit}", "f_{vk0} = \\text{Haftscherfestigkeit (Anfangsscherfestigkeit ohne Auflast)}"),
    # [3A21]
    ("ab λ ≈ 0.05", "ab λ ≈ 0,07 W/(mK)"),
    # [3A22]
    ("Wasserlöslich, nur im Innenbereich", "nicht wasserbeständig (erweicht bei Durchfeuchtung); Einsatz außen nur mit geeigneter Anwendungsklasse und Witterungsschutz (DIN 18945)"),
    # [3A24]
    ("Wendehorst Baustoffkunde: Kapitel Mauerwerksbau, k-Wert und Steinfestigkeiten", "Wendehorst Baustoffkunde (27. Aufl. 2011): Kapitel Mauerwerk, U-Wert und Steinfestigkeiten"),
    # [3A25]
    ("Herstellerlisten nach BauPVO", "Hintermauer- und Vormauerziegel, Planblöcke, Mauermörtelarten, Leistungserklärung und CE-Kennzeichnung nach BauPVO (EU) 2024/3110"),
    # [3A23]
    ("hoher CO₂-Einbehalt", "hohe CO₂-Emissionen"),
    ("hoher CO2-Einbehalt", "hohe CO₂-Emissionen"),
    # [3A26]
    ("du wirst mit Dünnbettmörtel", "Sie werden mit Dünnbettmörtel"),
    ("du bist frostbeständig", "Sie sind frostbeständig"),
    # [3A27]
    ("Ziegel Lexikon (BV. Ziegelindustrie)", "Ziegel-Lexikon (Bundesverband der Deutschen Ziegelindustrie e. V.)")
]
update_file("src/modules/Mauerwerk.tsx", mauerwerk_replacements)

# Module 43: PutzeMoertel.tsx
putze_replacements = [
    # [3A28]
    ("Karbonatisierung (Oxidationserhärtung der Luftkalke)", "Karbonatisierung (Lufterhärtung der Luftkalke durch CO2-Aufnahme)"),
    ("atmosphärischer Oxidation/Kalksteinbildung", "atmosphärischer Karbonatisierung (Kalksteinbildung aus CO2 der Luft)"),
    # [3A29]
    ("Durch Hydratisierung von gelöschtem Kalk entsteht", "Durch Karbonatisierung von gelöschtem Kalk (Ca(OH)2 + CO2 → CaCO3 + H2O) entsteht"),
    # [3A44]
    ("Math.ceil(masse / 25)", "Math.ceil(Math.round(masse * 100) / 100 / 25)"),
    # [3A32]
    ("DIN EN 1996 (Eurocode 6) / DIN 1053-1", "DIN EN 1996 (Eurocode 6) mit NA / DIN EN 998-2 i. V. m. DIN 20000-412 (Dünnbettmörtel)"),
    ("DIN EN 1996 mit NA (vormals DIN 1053-1)", "DIN EN 1996 (Eurocode 6) mit NA / DIN EN 998-2 i. V. m. DIN 20000-412 (Dünnbettmörtel)"),
    # [3A33]
    ("IWM (Industrieverband Werkmörtel e.V.): Technische Richtlinien",
     "VDPM (Verband für Dämmsysteme, Putz und Mörtel e. V., 2017 aus IWM und FV WDVS hervorgegangen): Technische Richtlinien und Merkblätter für Werkmörtel."),
    # [3A34]
    ("Putzmörtelklasse GP, LW, CR", "Putzmörtelarten GP, LW, CR u. a. mit Druckfestigkeitsklassen CS I bis CS IV (ca. 0,4 bis mindestens 6 N/mm²) nach DIN EN 998-1"),
    # [3A35]
    ("Typ GP - CS II", "Typ LW - CS I bis CS II"),
    # [3A36]
    ("Mörtelgruppe III (Zement weich)", "Mörtelgruppe III (Zementmörtel)"),
    ("IIIa (Zement pur)", "IIIa (Zementmörtel, höhere Festigkeit)"),
    # [3A37]
    ("Vulkansande erlaubten den Römern die Entwicklung hochfester Luft- und Wasserkalke",
     "Vulkanische Puzzolane (Puteolanerde) ermöglichten den Römern hydraulisch erhärtende, wasserbeständige Kalkmörtel."),
    # [3A38]
    ("reine Kalk- ... mörtel ... geringeren Carbon Footprint",
     "Zementreiche Mörtel besitzen hohes Treibhauspotenzial; Gipsmörtel (niedrige Brenntemperatur, keine Entsäuerung) liegen deutlich darunter. Kalk setzt beim Brennen prozessbedingt viel CO2 frei, das durch Karbonatisierung teilweise wieder gebunden wird."),
    # [3A39]
    ("Fällt das Produkt kleiner als 0,2 aus ... Die Wand bleibt dauerhaft riss- und trockenfest",
     "Ist das Produkt w · sd höchstens 0,2 kg/(m·h^0,5) (Künzel-Kriterium, DIN 4108-3), kann die Wand über das Jahr mehr Feuchte abgeben als aufnehmen; der Schlagregenschutz ist gewährleistet."),
    # [3A40]
    ("≥ 100 MPa", "kann je nach Übersättigung mehrere bis einige zehn MPa erreichen und übersteigt damit die Zugfestigkeit von Putz und Stein deutlich"),
    # [3A41]
    ("Plangeschliffene Oberseiten ... hauchdünn miteinander verschweißt", "Plangeschliffene Steine werden mit Dünnbettmörtel (ca. 1 bis 3 mm) vermauert"),
    # [3A30]
    ("DIN EN 918-1", "DIN EN 998-1"),
    # [3A31]
    ("DIN 18550-1 (Projektierung, Vorbereitung und Ausführung von Innen- und Außenputzen)",
     "DIN 18550-1:2018-01 (Planung, Zubereitung und Ausführung von Außen- und Innenputzen - Teil 1: Ergänzende Festlegungen zu DIN EN 13914-1 für Außenputze)"),
    # [3A42]
    ("Deine bauphysikalische Wirkungsweise", "Ihre bauphysikalische Wirkungsweise"),
    # [3A43]
    ("Kalk-Zementpuz", "Kalk-Zementputz"),
    ("Ostentativ gilt hierbei das Gesetz", "Grundsätzlich gilt hierbei die Regel")
]
update_file("src/modules/PutzeMoertel.tsx", putze_replacements)

# Module 44: Gips.tsx
gips_replacements = [
    # [3A45]
    ("Bei höheren Brenntemperaturen (> 180-300 °C) entsteht unlösliches Anhydrit-Material",
     "Bei höheren Brenntemperaturen entsteht zunächst löslicher Anhydrit III (ca. 180–300 °C), ab ca. 300–500 °C schwerlöslicher Anhydrit II (z. B. für Anhydritbinder und Putzgips-Mischungen)."),
    # [3A47]
    ("Wendehorst Baustoffkunde: Grundlagen, Baustoffe und Werkstoffprüfung (37. Auflage, Springer Vieweg)",
     "Wendehorst Baustoffkunde: Grundlagen – Baustoffe – Oberflächenschutz (27. Aufl., Vieweg+Teubner 2011)"),
    # [3A46]
    ("GKBI, grün durch silikonisierten Gipskern", "imprägnierte Gipsplatten (GKBI, Typ H nach DIN EN 520, Kern hydrophobiert, Karton grün eingefärbt)"),
    # [3A49]
    ("ausschließlich für trockene Innenräume (Beanspruchungsklasse z.B. W0-I nach DIN 18534)",
     "Gipsbaustoffe eignen sich für Innenräume mit geringer Wassereinwirkung (W0-I) und mit Verbundabdichtung für mäßige Einwirkung (W1-I, z. B. häusliche Bäder) nach DIN 18534, nicht für W2-I/W3-I."),
    # [3A50]
    ("Zunehmend Phosphorgips aus industriellen Reststoffprozessen",
     "Mit dem Kohleausstieg geht REA-Gips zurück; ersetzt wird er v. a. durch Naturgips und zunehmend durch Recyclinggips."),
    # [3A51]
    ("Ausschließlicher Trocken-Innenausbau",
     "Innenausbau: Trockenbau (Gipsplatten auf Metallständerwerk), Innenputze, Spachtelmassen, Brandschutzbekleidungen, Calciumsulfat-Fließestriche."),
    # [3A52]
    ("Vogel, W. (2018): Handbuch Trockenbau und Gips-Technologie", "Bundesverband der Gipsindustrie e. V.: GIPS-Datenbuch"),
    # [3A48]
    ("DIN EN 13279 (Gipsbinder und Gipsputze für den Innenbereich)", "DIN EN 13279-1 (Gipsbinder und Gips-Trockenmörtel)"),
    ("DIN EN 13279 (Gipsbinder und Gipsputze)", "DIN EN 13279-1 (Gipsbinder und Gips-Trockenmörtel)"),
    # [3A53]
    ("als Zementkalk-Sintern", "als das Sintern von Zementklinker"),
    ("Einweg-Kohleausstieg verringert", "Der Kohleausstieg verringert")
]
update_file("src/modules/Gips.tsx", gips_replacements)

# Module 45: Kalk.tsx
kalk_replacements = [
    # [3A54]
    ("Karbonatisierung ... durch Aufnahme von Luftsauerstoff und CO2",
     "Karbonatisierung (Abbindeprozess) des Löschkalks durch Aufnahme von CO2 aus der Luft (Ca(OH)2 + CO2 → CaCO3 + H2O). Porenwasser ist als Reaktionsmedium erforderlich, weshalb staubtrockener Kalkmörtel nicht erhärten kann."),
    ("durch Aufnahme von Luftsauerstoff und CO2",
     "durch Aufnahme von CO2 aus der Luft (Ca(OH)2 + CO2 → CaCO3 + H2O). Porenwasser ist als Reaktionsmedium erforderlich, weshalb staubtrockener Kalkmörtel nicht erhärten kann."),
    # [3A55]
    ("CO2 wird ... wieder fast vollständig ... gebunden (Reversibler, klimaneutraler Kalkkreislauf)",
     "Das prozessbedingt ausgetriebene CO2 wird im Lebenszyklus durch Karbonatisierung teilweise, in dünnen Putzen weitgehend wieder gebunden; das brennstoffbedingte CO2 nicht – Kalk ist daher nicht klimaneutral."),
    ("Reversibler, klimaneutraler Kalkkreislauf",
     "Das prozessbedingt ausgetriebene CO2 wird im Lebenszyklus durch Karbonatisierung teilweise wieder gebunden; das brennstoffbedingte CO2 nicht – Kalk ist daher nicht klimaneutral."),
    # [3A56]
    ("Wendehorst Baustoffkunde: Grundlagen, Baustoffe und Werkstoffprüfung (37. Auflage, Springer Vieweg)",
     "Wendehorst Baustoffkunde: Grundlagen – Baustoffe – Oberflächenschutz (27. Aufl., Vieweg+Teubner 2011)"),
    # [3A57]
    ("Luftkalke ... im erhärteten Zustand nicht wasserbeständig ... primär für Innenputze",
     "Luftkalke erhärten nur durch CO2-Aufnahme aus der Luft, also nicht unter Wasser; sie sind für dauerfeuchte Bereiche ungeeignet, werden aber für Innen- und Außenputze sowie in der Denkmalpflege eingesetzt."),
    # [3A58]
    ("Baukalk (Calciumcarbonat / Calciumhydroxid)", "Baukalk (Calciumoxid bzw. Calciumhydroxid, DIN EN 459-1)"),
    # [3A59]
    ("chemischen Umwandlungen (z.B. Frost, Säuren)", "Er ist jedoch empfindlich gegen Säuren (chemisch) sowie gegen Frost bei Durchfeuchtung (physikalisch)."),
    # [3A60]
    ("hochwirksam desinfizierend ... natürlichste Methode zur Schimmelprävention",
     "Frischer Kalkputz wirkt durch seine hohe Alkalität schimmelhemmend; nach der Karbonatisierung sinkt der pH-Wert, entscheidend bleibt der Feuchteschutz."),
    # [3A61]
    ("Kalkmörtelmauerwerk ... im Zuge des Betonrecyclings als Kreislaufmaterial einsetzen",
     "Carbonatisiertes Kalkmörtelmauerwerk kann gebrochen und als RC-Baustoff (z. B. Tragschichten, eingeschränkt als rezyklierte Gesteinskörnung Typ 2 im Beton) verwertet werden."),
    # [3A62]
    ("Karkuzi, M. (2021): Bindemittel der Bauwirtschaft", "Stark, J.; Wicht, B.: Zement und Kalk – Der Baustoff als Werkstoff (Birkhäuser 2000)"),
    # [3A63]
    ("Baukalk ist einer der ältesten mineralischen Bindemittel", "Baukalk ist eines der ältesten mineralischen Bindemittel"),
    ("du bist im erhärteten Zustand nicht wasserbeständig", "Sie sind im erhärteten Zustand nicht wasserbeständig")
]
update_file("src/modules/Kalk.tsx", kalk_replacements)

# Module 46: Lehm.tsx
lehm_replacements = [
    # [3A64]
    ("Tragende Stampflehmwände (bis Gebäudeklasse 4 laut neuer DIN 18940)",
     "Tragendes Lehmsteinmauerwerk nach DIN 18940; tragende Stampflehmwände bislang über Lehmbau Regeln bzw. Zustimmung im Einzelfall/vorhabenbezogene Bauartgenehmigung."),
    # [3A65]
    ("mehrgeschossigen Stampflehmbauten von Schibam im Jemen",
     "(z. B. die mehrgeschossigen Lehmziegel-Turmhäuser von Schibam im Jemen oder Teile der Chinesischen Mauer)"),
    # [3A67]
    ("Der einzige Baustoff mit unendlichem, verlustfreiem Recyclingpotenzial",
     "Unstabilisierter, schadstofffreier Lehm lässt sich nahezu vollständig wiederverwenden: einweichen, aufbereiten und erneut als Putz oder Stampflehm einbauen."),
    # [3A68]
    ("reguliert die relative Luftfeuchtigkeit instantan auf ca. 50%", "Sehr gute Sorptionsfähigkeit (puffert Schwankungen der relativen Luftfeuchte)."),
    # [3A69]
    ("Wasserlöslich und quellfähig", "Nicht wasserbeständig: weicht bei Wasserzufuhr auf und quillt."),
    # [3A70]
    ("Graue Energie geht gegen Null. 100% emissionsfreier Baustoff",
     "Sehr geringe graue Energie (kein Brennprozess); Emissionen v. a. aus Aufbereitung, Transport und ggf. technischer Trocknung. Sehr gute CO2-Bilanz."),
    # [3A71]
    ("Lehmputzmörtel (DIN 18947) zur Dünnschichtverputzung", "Lehmputzmörtel (DIN 18947) für Unter- und Oberputze"),
    # [3A72]
    ("Dachverband Lehm e.V. (2020): Lehmbau-Regeln (3. Auflage, Springer)", "Dachverband Lehm e. V. (Hrsg.): Lehmbau Regeln (3. Aufl., Vieweg+Teubner 2009)"),
    # [3A66]
    ("DIN 18940 (Mauerwerk aus Lehmsteinen - Berechnung und Ausführung)", "DIN 18940:2023-06 (Tragendes Lehmsteinmauerwerk - Konstruktion, Bemessung und Ausführung)")
]
update_file("src/modules/Lehm.tsx", lehm_replacements)

# Module 47: Erdbau.tsx
erdbau_replacements = [
    # [3A73]
    ("Schadstoffklasse wie Z0-Z5", "Einstufung für Verwertung nach EBV (BM-0 bis BM-F3) bzw. BBodSchV / DepV"),
    # [3A74]
    ("RStO 12 (Richtlinien für die Standardisierung des Oberbaues von Verkehrsflächen)",
     "RStO 12/24: Richtlinien für die Standardisierung des Oberbaues von Verkehrsflächen, Ausgabe 2012, Fassung 2024 (eingeführt mit ARS Nr. 02/2024)"),
    ("RStO 12", "RStO 12/24"),
    # [3A75]
    ("abhängig von Frostzone, Belastung (Bauklasse)", "abhängig von Frostzone, Belastung (Belastungsklasse Bk nach RStO 12/24) und anstehendem Boden (Frostempfindlichkeitsklasse F1 bis F3)"),
    # [3A79]
    ("Gefrierendes Wasser dehnt sich aus, bildet Eislinsen",
     "Feinkörnige Böden sind frostempfindlich: Kapillar nachgesaugtes Wasser gefriert zu wachsenden Eislinsen und verursacht Hebungen; beim Auftauen verliert der Boden Tragfähigkeit."),
    # [3A80]
    ("Bauen auf ungenügend verdichtetem Boden ... bei anorganischen, bindigen Gesteinen ... Porenwasser-Überdruck",
     "Kritischer Gründungsfehler: unzureichend verdichtete Auffüllungen sowie weiche bindige Böden. Bei bindigen Böden baut sich der Porenwasserüberdruck nur langsam ab (Konsolidation), was zu lang andauernden Setzungen und Rissen führt."),
    # [3A76]
    ("BK100", "Bk100"),
    ("BK32", "Bk32"),
    ("BK10", "Bk10"),
    ("BK3 (z.B. Sammelstraße)", "Bk3,2 (z. B. Sammelstraße)"),
    ("BK1 (z.B. Wohnstraße)", "Bk1,0 (z. B. Wohnstraße)"),
    ("BK0,3", "Bk0,3"),
    # [3A77]
    ("Proctordichte (D_pr)", "Proctordichte (ρPr)"),
    ("Verdichtungsgrad (D_Pr)", "Verdichtungsgrad (DPr)")
]
update_file("src/modules/Erdbau.tsx", erdbau_replacements)

# Module 48: Glas.tsx
glas_replacements = [
    # [3A81]
    ("formel: 'h_{ef,w} = \\sqrt[3]{\\sum h_i^3 + \\omega \\cdot (h_{ef,w}^3 - \\sum h_i^3)}'",
     "formel: 'h_{ef,w} = \\sqrt[3]{\\sum h_i^3 + \\omega \\cdot (h_{ges}^3 - \\sum h_i^3)}'"),
    ("quelle: 'DIN 18008-1'", "quelle: 'DIN EN 16612'"),
    ("erklaerung: 'Effektive Dicke von VSG mit Schubverbund nach DIN 18008 / DIN EN 16612 zur Ermittlung verformungsäquivalenter Spannungen.'",
     "erklaerung: 'Effektive Dicke von VSG mit Schubverbund nach DIN EN 16612/16613 (in Deutschland nicht bauaufsichtlich eingeführt; nach DIN 18008-1 darf ein günstig wirkender Schubverbund grundsätzlich nicht angesetzt werden). Quelle: DIN EN 16612'"),
    # [3A82]
    ("f_{g,d} = \\frac{k_{mod} \\cdot k_{sp} \\cdot f_{g,k}}{\\gamma_M}", "f_d = \\frac{k_{mod} \\cdot k_c \\cdot f_k}{\\gamma_M}"),
    # [3A83]
    ("kühlt dort absolut plan und spannungsfrei ab", "wird dort planisiert und auf ca. 600 °C abgekühlt und anschließend im Kühlofen spannungsarm abgekühlt und geschnitten"),
    # [3A84]
    ("VSG mit integriertem Sonnenschutz und Edelgaskammern", "Hochfunktionale Isolierverglasungen mit VSG-Scheiben, Sonnenschutzbeschichtung und Edelgasfüllung"),
    # [3A85]
    ("Weller, B. (2020): Glasbau - Praxis, Berechnung, Konstruktion (Springer)", "Weller, B.; Nicklisch, F.; Thieme, S.; Weimar, T.: Glasbau-Praxis. Konstruktion und Bemessung (Bauwerk/Beuth)"),
    # [3A86]
    ("70-75 % as Netzwerkbildner", "70-75 % als Netzwerkbildner"),
    ("(z.B. im Werkzeug) gefertigt", "(z. B. im Werk) gefertigt")
]
update_file("src/modules/Glas.tsx", glas_replacements)

# Module 49: Metalle.tsx
metalle_replacements = [
    # [3A87]
    ("A4 (1.4404 mit Molybdän, CRC III) für Küstenklima und Straßentunnel",
     "A2 (1.4301, CRC II) für normale Innen- und Landatmosphäre; A4 (1.4404 mit Molybdän, CRC III) für mäßig chloridbelastete Außenatmosphäre, z. B. küstennah; CRC V (z. B. 1.4529, 1.4565) für Straßentunnel mit Tausalzeintrag und für nicht regelmäßig gereinigte, sicherheitsrelevante Bauteile in Hallenschwimmbädern."),
    # [3A88]
    ("Wendehorst Baustoffkunde: Kapitel Metalle im Bauwesen (37. Auflage)",
     "Wendehorst Baustoffkunde: Grundlagen – Baustoffe – Oberflächenschutz (27. Aufl., Vieweg+Teubner 2011), Kapitel Metalle"),
    # [3A89]
    ("Zink: 30·10⁻⁶ 1/K", "Zink (rein): ca. 30·10⁻⁶ 1/K, Titanzink (DIN EN 988, in Walzrichtung): ca. 22·10⁻⁶ 1/K"),
    # [3A90]
    ("Selbstpassivierende Oxidschicht garantiert dauerhafte Korrosionsfreiheit",
     "Selbstpassivierende Oxidschicht sorgt in neutraler Atmosphäre für gute Korrosionsbeständigkeit (Vorsicht bei Kontakt mit edleren Metallen, Chloriden und alkalischem Mörtel/Beton)."),
    # [3A91]
    ("Empire State Building (1931) nutzte als erstes Großprojekt Aluminium",
     "Frühe Bauanwendungen von Aluminium finden sich z. B. an Otto Wagners Postsparkasse Wien (1906); das Empire State Building (1931) machte Aluminium als Fassadenwerkstoff (Brüstungsplatten) populär, gefolgt vom Boom stranggepresster Fassadenprofile ab 1950."),
    # [3A92]
    ("Niemals unterhalb von Kupfer oder Blei anordnen", "Niemals in Fließrichtung unterhalb von Kupfer anordnen (Fließregel)."),
    # [3A93]
    ("gegen aggressive Säuren vollkommen resistent", "Rutil-Oxidschicht (TiO₂), die das Metall gegen Meerwasser, Industrieatmosphäre und die meisten oxidierenden Medien sehr beständig macht; Flusssäure und heiße reduzierende Säuren greifen Titan jedoch an."),
    # [3A94]
    ("erstklassige Schwingungsdämpfung", "Weist im Gegensatz zum spröden Lamellengrauguss hohe Duktilität (Bruchdehnung bis 18 %) auf; die Schwingungsdämpfung ist geringer als bei Lamellengrauguss, aber höher als bei Stahl."),
    # [3A95]
    ("Lieferantenlisten der BauPVO", "Plattenrechner, Kontaktkorrosions-Prüfung & Herstellerübersicht (Produkte mit Leistungserklärung und CE-Kennzeichnung nach BauPVO (EU) 2024/3110).")
]
update_file("src/modules/Metalle.tsx", metalle_replacements)

print("Batch 40-49 finished.")
