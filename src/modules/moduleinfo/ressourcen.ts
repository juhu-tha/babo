// Ausgelagert aus src/modules/ModuleInfo.tsx (AP 5.2)

export interface FurtherResource {
  websites: { name: string; url?: string; desc: string }[];
  books: { title: string; desc: string }[];
  publications: { journal: string; title: string; desc: string }[];
  dissertations: { title: string; desc: string }[];
}

export const COMPREHENSIVE_RESOURCES: Record<string, FurtherResource> = {
  grundlagen: {
    websites: [
      { name: "Baulinks Portal - Baustoff-Wissen", url: "https://www.baulinks.de", desc: "Etabliertes deutsches Fachportal für Baustoffe, Materialentwicklungen und Baupraxis-News." },
      { name: "Materialarchiv Wissenschaft", url: "https://www.materialarchiv.ch", desc: "Umfangreiche wissenschaftliche Datenbank für Materialklassen und deren physikalische Auswertung." },
      { name: "VDZ – Forschungs- und Kompetenzzentrum für Zement, Beton und Umweltschutz", url: "https://www.vdz-online.de/", desc: "Zementchemie, Betontechnik und Merkblätter des Vereins Deutscher Zementwerke." },
      { name: "DIBt – Deutsches Institut für Bautechnik", url: "https://www.dibt.de/", desc: "Bauaufsichtliche Zulassungen, Bauartgenehmigungen und Muster-Verwaltungsvorschrift Technische Baubestimmungen (MVV TB)." }
    ],
    books: [
      { title: "Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011", desc: "Klassisches Lehrbuch der Baustoffkunde für Hoch- und Tiefbau." },
      { title: "Möhring, R. (Hrsg.): Baustoffkenntnis (begr. von W. Scholz). 19. Aufl., Köln: Bundesanzeiger Verlag 2016", desc: "Praxisorientiertes Standardwerk zu Eigenschaften und Anwendung der Baustoffe." },
      { title: "Benedix, R.: Bauchemie für das Bachelor-Studium. 3. Aufl., Wiesbaden: Springer Vieweg 2017", desc: "Chemische Grundlagen der Baustoffe für das Bachelorstudium." },
      { title: "Willems, W. M. (Hrsg.): Lehrbuch der Bauphysik. 9. Aufl., Wiesbaden: Springer Vieweg 2022", desc: "Wärme, Feuchte, Schall, Brand – Grundlagen der bauphysikalischen Kenngrößen." }
    ],
    publications: [
      { journal: "Journal of the American Concrete Institute 43 (1946/47)", title: "Powers, T. C.; Brownyard, T. L.: Studies of the Physical Properties of Hardened Portland Cement Paste", desc: "Grundlagenarbeit zum Porenmodell des Zementsteins (Gel- und Kapillarporen)." }
    ],
    dissertations: []
  },
  labor: {
    websites: [
      { name: "DGZfP", url: "https://www.dgzfp.de", desc: "Deutsche Gesellschaft für Zerstörungsfreie Prüfung e.V. mit Fachausschüssen (u. a. ZfP im Bauwesen) und Merkblättern." },
      { name: "MPA Universität Stuttgart", url: "https://www.mpa.uni-stuttgart.de", desc: "Materialprüfungsanstalt der Universität Stuttgart (Prüf-, Überwachungs- und Zertifizierungsstelle)." },
      { name: "BAM Bundesanstalt für Materialforschung", url: "https://www.bam.de", desc: "Bundesoberbehörde für Materialforschung und -prüfung, u. a. Bauwerksdiagnostik und Referenzmaterialien." }
    ],
    books: [
      { title: "Maierhofer, C.; Reinhardt, H.-W.; Dobmann, G. (Hrsg.): Non-Destructive Evaluation of Reinforced Concrete Structures. Bd. 1–2. Cambridge: Woodhead Publishing 2010", desc: "Schädigungsprozesse und zerstörungsfreie Prüfverfahren für Stahlbetonbauwerke." },
      { title: "Scrivener, K.; Snellings, R.; Lothenbach, B. (Hrsg.): A Practical Guide to Microstructural Analysis of Cementitious Materials. Boca Raton: CRC Press 2016", desc: "Praxisleitfaden zu XRD, TGA, REM/EDX und weiteren Gefügeanalysen an Zementstein." },
      { title: "Hedderich, J.; Sachs, L.: Angewandte Statistik – Methodensammlung mit R. 16. Aufl., Berlin: Springer Spektrum 2018", desc: "Statistische Verfahren für die Auswertung von Prüfserien." }
    ],
    publications: [
      { journal: "Transportation Research Record 2290 (2012)", title: "Kim, T.; Olek, J.: Effects of Sample Preparation and Interpretation of Thermogravimetric Curves on Calcium Hydroxide in Hydrated Pastes and Mortars", desc: "Einfluss von Probenvorbereitung und Auswertemethode auf den per TGA bestimmten Portlanditgehalt." }
    ],
    dissertations: []
  },
  baustoffe: {
    websites: [
      { name: "Dachverband Lehm e.V.", url: "https://www.dachverband-lehm.de", desc: "Technische Merkblätter und Lehmbau Regeln." },
      { name: "Bundesverband der Gipsindustrie e.V.", url: "https://www.gips.de", desc: "Fachinformationen zu Calciumsulfat-Bindemitteln, Estrichen und Gipsplatten." },
      { name: "Bundesverband der Deutschen Kalkindustrie e.V.", url: "https://www.kalk.de", desc: "Informationen zu Luftkalken, hydraulischen Kalken und Anwendungen." }
    ],
    books: [
      { title: "Handbuch Lehmbau", desc: "Minke, G., 10. Aufl., Rastede: ökobuch 2022. Stampflehm, Lehmsteine und Lehmputze." },
      { title: "Wendehorst Baustoffkunde", desc: "Neroth, G.; Vollenschaar, D. (Hrsg.), 27. Aufl., Vieweg+Teubner 2011. Grundlagenwerk über alle Baustoffgruppen." },
      { title: "Baustoffkenntnis", desc: "Scholz, W. (begr.); Möhring, R. (Hrsg.), 19. Aufl., Bundesanzeiger Verlag 2016." }
    ],
    publications: [],
    dissertations: []
  },
  bauprodukte: {
    websites: [
      { name: "DIBt - Zulassungsdatenbank", url: "https://www.dibt.de", desc: "Deutsches Institut für Bautechnik: abZ/aBG, ETA, MVV TB." },
      { name: "EUR-Lex: Verordnung (EU) 2024/3110", url: "https://eur-lex.europa.eu/eli/reg/2024/3110/oj", desc: "Amtlicher Text der neuen Bauproduktenverordnung." }
    ],
    books: [
      { title: "Bauproduktenrecht in der Praxis", desc: "Gerhold, P., 2. Aufl., Rudolf Müller 2021. Von der Leistungserklärung bis zur Baudokumentation." },
      { title: "Neues Bauproduktenrecht in der Praxis", desc: "Gerhold, P., Rudolf Müller 2019. Bauordnung und MVV TB." }
    ],
    publications: [],
    dissertations: []
  },
  stahlbeton: {
    websites: [
      { name: "DAfStb Schriften", url: "https://www.dafstb.de", desc: "Deutscher Ausschuss für Stahlbeton - Herausgeber von Konstruktions-Heften." },
      { name: "InformationsZentrum Beton", url: "https://www.beton.org", desc: "Herstellerunabhängiges Fachorgan mit ausführlichen Leitfäden zum Sichtbeton und Risseschnitt." },
      { name: "fib international", url: "https://www.fib-international.org", desc: "Internationaler Verband für Beton- und Spannbetontragwerke zur Vorbereitung internationaler Normgenerationen." }
    ],
    books: [
      { title: "Bemessung im konstruktiven Betonbau", desc: "Zilch, K.; Zehetmaier, G. 2. Aufl., Springer 2010. Bemessung nach DIN 1045-1 und EC2 mit Herleitungen." },
      { title: "Stahlbetonbau-Praxis nach Eurocode 2", desc: "Goris, A. (Hrsg.), Band 1 und 2, Beuth 2023. Grundlagen, Bemessung und Beispiele." },
      { title: "Handbuch Brücken", desc: "Mehlhorn, G.; Curbach, M. (Hrsg.), Springer Vieweg 2014. Entwurf, Bemessung und Erhaltung von Brücken." },
      { title: "Erläuterungen und Beispiele zur DAfStb-Richtlinie Betonbauteile mit nichtmetallischer Bewehrung", desc: "DAfStb (Hrsg.), DIN Media 2024. Grundlage für Carbonbeton." }
    ],
    publications: [],
    dissertations: []
  },
  mechanik: {
    websites: [
      { name: "DGM (Materialwissenschaft)", url: "https://www.dgm.de", desc: "Deutsche Gesellschaft für Materialkunde e. V." }
    ],
    books: [
      { title: "Technische Mechanik 1–4", desc: "Gross, D. et al., Springer Vieweg: Bd. 1 Statik (16. Aufl. 2026), Bd. 2 Elastostatik (15. Aufl. 2024), Bd. 3 Kinetik (16. Aufl. 2024), Bd. 4 (11. Aufl. 2023)." },
      { title: "Tragwerke 1 und 2", desc: "Krätzig, W. B. et al., Bd. 1: 5. Aufl., Springer 2010; Bd. 2: 5. Aufl., Springer Vieweg 2019. Statisch bestimmte und unbestimmte Stabtragwerke." }
    ],
    publications: [],
    dissertations: []
  },
  bauphysik: {
    websites: [
      { name: "FIW München", url: "https://www.fiw-muenchen.de", desc: "Forschungsinstitut für Wärmeschutz e. V." },
      { name: "Fraunhofer-Institut für Bauphysik (IBP)", url: "https://www.ibp.fraunhofer.de", desc: "Forschung zu Wärme, Feuchte, Akustik; Entwickler von WUFI." }
    ],
    books: [
      { title: "Lehrbuch der Bauphysik", desc: "Willems, W. M. (Hrsg.), 9. Aufl., Springer Vieweg 2022. Wärme, Feuchte, Klima, Schall, Licht, Brand." },
      { title: "Lohmeyer Praktische Bauphysik", desc: "Schmidt, P.; Windhausen, S., 10. Aufl., Springer Vieweg 2024. Einführung mit Berechnungsbeispielen." },
      { title: "Formeln und Tabellen Bauphysik", desc: "Willems, W. M.; Schild, K.; Stricker, D., 8. Aufl., Springer Vieweg 2024." }
    ],
    publications: [],
    dissertations: []
  },
  nachhaltigkeit: {
    websites: [
      { name: "DGNB e.V.", url: "https://www.dgnb.de", desc: "Deutsche Gesellschaft für Nachhaltiges Bauen mit umfangreichen Zertifizierungskriterien (DGNB-System)." },
      { name: "ÖKOBAUDAT", url: "https://www.oekobaudat.de", desc: "Ökobilanzdatenbank des Bundes (BMWSB) mit Datensätzen nach DIN EN 15804." },
      { name: "Bau-EPD e.V.", url: "https://www.bau-epd.at", desc: "Zertifizierungsplattform für normkonforme Umweltproduktdeklarationen Typ III gemäß ISO 14025." }
    ],
    books: [
      { title: "Green Building – Leitfaden für nachhaltiges Bauen", desc: "Bauer, M.; Mösle, P.; Schwarz, M., 2. Aufl., Springer Vieweg 2013." },
      { title: "Lebenszyklusanalyse in der Gebäudeplanung", desc: "König, H.; Kohler, N.; Kreißig, J.; Lützkendorf, T., Detail 2009." }
    ],
    publications: [],
    dissertations: []
  },
  digitales: {
    websites: [
      { name: "buildingSMART Deutschland", url: "https://www.buildingsmart.de", desc: "Die offizielle Vertretung für herstellerneutrales openBIM, IFC-Schemata und BIM-Leitfäden." },
      { name: "BIM Deutschland – Zentrum für die Digitalisierung des Bauwesens", url: "https://www.bimdeutschland.de", desc: "Nationales BIM-Kompetenzzentrum des Bundes; Betreiber des BIM-Portals (bim-portal.de) mit Merkmalskatalogen und AIA-Mustern." },
      { name: "planen-bauen 4.0", url: "https://www.planen-bauen40.de", desc: "Kooperationen zur Etablierung des Digitalen Zwillings und BIM-basiertem Bauantrag." }
    ],
    books: [
      { title: "Borrmann, A.; König, M.; Koch, C.; Beetz, J. (Hrsg.): Building Information Modeling. 2. Aufl., Springer Vieweg 2021", desc: "Technologische Grundlagen (IFC, Datenmodelle, Prozesse) und industrielle Praxis." },
      { title: "Hausknecht, K.; Liebich, T.: BIM-Kompendium. Stuttgart: Fraunhofer IRB (aktuelle Auflage)", desc: "Einführung in Methode, Rollen und openBIM-Formate." }
    ],
    publications: [
      { journal: "BMVI (2015)", title: "Stufenplan Digitales Planen und Bauen", desc: "Fahrplan zur Einführung von BIM im Infrastrukturbau des Bundes." },
      { journal: "BMI (2021)", title: "Masterplan BIM für Bundesbauten", desc: "Einführungsstrategie für BIM im Bundeshochbau." }
    ],
    dissertations: [
      
    ]
  },
  bestand: {
    websites: [
      { name: "WTA e.V.", url: "https://www.wta-gmbh.de", desc: "Wissenschaftlich-Technische Arbeitsgemeinschaft für Bauwerkserhaltung und Denkmalpflege mit Richtlinienkatalogen." },
      { name: "Deutsches Nationalkomitee für Denkmalschutz (DNK)", url: "https://www.dnk.de", desc: "Nationale Leitgrundlagen, Rechtsfragen und Handbücher zur historischen Bausubstanz." },
      { name: "Fraunhofer IRB Raum und Bau", url: "https://www.irb.fraunhofer.de", desc: "Kataloge, Merkblätter und Sanierungsbeispiele historischer Baustoffschäden." }
    ],
    books: [
      { title: "Typische Baukonstruktionen von 1860 bis 1960 (Bd. 1–3)", desc: "Ahnert, R.; Krause, K. H. – Standardwerk zur Identifikation historischer Konstruktionen (Decken, Wände, Dächer)." },
      { title: "Historische Bautabellen", desc: "Bargmann, H. – Werner Verlag. Normen und Konstruktionshinweise 1870 bis 1960 für die Nachrechnung." },
      { title: "DBV-Merkblätter „Bauen im Bestand“", desc: "Deutscher Beton- und Bautechnik-Verein: Leitfaden, Beton und Betonstahl, Modifizierte Teilsicherheitsbeiwerte für Stahlbetonbauteile." }
    ],
    publications: [],
    dissertations: []
  },
  rueckbau: {
    websites: [
      { name: "Deutscher Abbruchverband e.V.", url: "https://www.deutscher-abbruchverband.de", desc: "Fachverband für Rückbautechnik, Schadstoffsanierung und technische Abbruchrichtlinien." },
      { name: "Kreislaufwirtschaft Bau", url: "https://kreislaufwirtschaft-bau.de", desc: "Initiative der Bauwirtschaft; Monitoringberichte zu Aufkommen und Verbleib mineralischer Bauabfälle." },
      { name: "Ressourceneffizienz-Zentrum Bayern (REZ)", url: "https://www.umweltpakt.bayern.de/rez/", desc: "Bayerische Plattform des LfU zu Ressourceneffizienz, auch im Bauwesen." }
    ],
    books: [
      { title: "Müller, A.: Baustoffrecycling – Entstehung, Aufbereitung, Verwertung. Wiesbaden: Springer Vieweg 2018", desc: "Aufbereitungstechnik, Eigenschaften und Verwertung mineralischer Recyclingbaustoffe." },
      { title: "Hillebrandt, A.; Riegler-Floors, P.; Rosen, A.; Seggewies, J.-K.: Atlas Recycling – Gebäude als Materialressource. München: Detail 2018", desc: "Konstruktionen und Materialien für rückbau- und recyclinggerechtes Bauen." }
    ],
    publications: [
      { journal: "Kreislaufwirtschaft Bau (Hrsg.), zweijährlich", title: "Mineralische Bauabfälle – Monitoring: Bericht zum Aufkommen und zum Verbleib mineralischer Bauabfälle", desc: "Amtlich gestützte Statistik zu Aufkommen, Recycling und Verfüllung; aktuelle Ausgabe beim Herausgeber." }
    ],
    dissertations: [
      
    ]
  },
  dauerhaftigkeit: {
    websites: [
      { name: "Deutscher Ausschuss für Stahlbeton (DAfStb)", url: "https://www.dafstb.de", desc: "Richtlinien (u. a. Alkali-Richtlinie, WU-Richtlinie) und Schriftenreihe zu Betonbau und Dauerhaftigkeit." },
      { name: "VDZ – Verein Deutscher Zementwerke", url: "https://www.vdz-online.de", desc: "Forschungsinstitut der Zementindustrie u. a. zu Karbonatisierung, Frost-Tausalz-Widerstand und AKR." },
      { name: "BASt Ingenieurbau-Datenbank", url: "https://www.bast.de", desc: "Bundesanstalt für Straßenwesen. Regeluntersuchungen zur AKR-Schadensentwicklung an Brückenkappen." }
    ],
    books: [
      { title: "Stark, J.; Wicht, B.: Dauerhaftigkeit von Beton. 2. Aufl., Berlin: Springer Vieweg 2013", desc: "Schadensmechanismen von Beton, u. a. AKR, Sulfat- und Frostangriff." },
      { title: "Bertolini, L.; Elsener, B.; Pedeferri, P.; Redaelli, E.; Polder, R.: Corrosion of Steel in Concrete. 2. Aufl., Weinheim: Wiley-VCH 2013", desc: "Karbonatisierung, Chloridkorrosion, Diagnose und Instandsetzung." }
    ],
    publications: [
      { journal: "CBI Research 5:82, Stockholm 1982", title: "Tuutti, K.: Corrosion of Steel in Concrete", desc: "Ursprung des Zweiphasenmodells (Einleitungs- und Schädigungsphase)." },
      { journal: "Proceedings Highway Research Board 29 (1949)", title: "Powers, T. C.: The Air Requirement of Frost-Resistant Concrete", desc: "Grundlage des Luftporen-Abstandsfaktors." }
    ],
    dissertations: [
      { title: "Gehlen, C.: Probabilistische Lebensdauerbemessung von Stahlbetonbauwerken", desc: "Dissertation, RWTH Aachen 2000; DAfStb-Heft 510. Grundlage der probabilistischen Dauerhaftigkeitsbemessung." }
    ]
  },
  schaeden: {
    websites: [
      { name: "IFS Schadenforschung", url: "https://www.ifs-ev.de", desc: "Institut für Schadenverhütung und Schadenforschung e.V. mit Bauschadensarchiv." },
      { name: "AIBau – Aachener Institut für Bauschadensforschung", url: "https://www.aibau.de", desc: "Bauschadensforschung; Aachener Bausachverständigentage (Tagungsbände)." },
      { name: "BVS – Bundesverband öffentlich bestellter und vereidigter sowie qualifizierter Sachverständiger", url: "https://www.bvs-ev.de", desc: "Dachverband der Sachverständigen, Fachbereich Bau." }
    ],
    books: [
      { title: "Bauschadens-Sammlung", desc: "Zimmermann, G. (Hrsg.), Fraunhofer IRB Verlag. Mehrbändige Sammlung dokumentierter Schadensfälle mit Ursachen und Sanierung." },
      { title: "Hinzunehmende Unregelmäßigkeiten bei Gebäuden", desc: "Oswald, R.; Abel, R., Springer Vieweg. Abgrenzung Mangel – hinzunehmende Unregelmäßigkeit." }
    ],
    publications: [
      { journal: "Aachener Bausachverständigentage (Springer Vieweg)", title: "Tagungsbände (jährlich)", desc: "Fachbeiträge zu aktuellen Schadensbildern, Abgrenzung Mangel/Schaden und Sachverständigenpraxis." },
      { journal: "Bautechnik / Beton- und Stahlbetonbau (Ernst & Sohn)", title: "Fachaufsätze zu Schadensfällen und Nachrechnung", desc: "Primärquellen zu Einstürzen und Schadensanalysen (z. B. Carolabrücke, Spannungsrisskorrosion)." }
    ],
    dissertations: [
    ]
  },
  instandsetzung: {
    websites: [
      { name: "buev - Bundesgütegemeinschaft Instandsetzung von Betonbauwerken e.V.", url: "https://www.buev.de", desc: "Fachportal für Güteüberwachung, SIVV-Qualifikationen und Instandsetzungsrichtlinien." },
      { name: "WTA e.V. Bautenschutz & Bauwerkserhaltung", url: "https://www.wta-gmbh.de", desc: "Referenz-Merkblätter zu Sanierputzsystemen, nachträglichen Horizontalsperren und Mauerwerksinjektion." },
      { name: "Deutscher Beton- und Bautechnik-Verein (DBV)", url: "https://www.betonverein.de", desc: "Merkblätter zu Parkhäusern, Rissüberbrückung (OS-Systeme), Reprofilierung und Instandhaltungskonzepten." }
    ],
    books: [
      { title: "Raupach, M.; Orlowsky, J.: Erhaltung von Betonbauwerken. Wiesbaden: Vieweg+Teubner 2008", desc: "Baustoffliche Grundlagen, Diagnose und Instandsetzung von Betonbauwerken." },
      { title: "Gieler, R. P.; Dimmig-Osburg, A.: Kunststoffe für den Bautenschutz und die Betoninstandsetzung. Basel: Birkhäuser 2006", desc: "Beschichtungen, Injektionsstoffe und PCC-Systeme." }
    ],
    publications: [
      { journal: "Beton- und Stahlbetonbau (Ernst & Sohn)", title: "Fachaufsätze zur TR Instandhaltung und zum sachkundigen Planer", desc: "Primärquellen zur Einführung der TR Instandhaltung und zu Instandsetzungsverfahren." }
    ],
    dissertations: [
    ]
  },
  praxiswissen: {
    websites: [
      { name: "HOAI 2021 (Verordnungstext)", url: "https://www.gesetze-im-internet.de/hoai_2021/", desc: "Amtlicher Text der Honorarordnung mit Leistungsbildern (Anlagen 10 ff.)." },
      { name: "BGB – Bauvertragsrecht", url: "https://www.gesetze-im-internet.de/bgb/__650a.html", desc: "Amtlicher Text der §§ 650a ff. BGB (Bauvertrag, Architekten- und Ingenieurvertrag)." },
      { name: "Bauforum24 Marktportal", url: "https://www.bauforum24.biz", desc: "Etabliertes Diskussionsforum zu Baubetrieb, Großmaschinen, Leistungsbeschreibungen und Baupraxis." }
    ],
    books: [
      { title: "Ingenstau/Korbion: VOB Teile A und B – Kommentar (aktuelle Auflage)", desc: "Standardkommentar zu Vergabe- und Vertragsrecht der VOB." },
      { title: "Kapellmann/Schiffers/Markus: Vergütung, Nachträge und Behinderungsfolgen beim Bauvertrag (aktuelle Auflage)", desc: "Standardwerk zu Nachträgen und Behinderungsfolgen." }
    ],
    publications: [
      { journal: "DBV-Merkblätter", title: "Abstandhalter; Unterstützungen; Sichtbeton (mit VDZ)", desc: "Praxisregeln für Bewehrungsabnahme und Sichtbetonausschreibung." },
      { journal: "DAfStb", title: "Richtlinie Wasserundurchlässige Bauwerke aus Beton (WU-Richtlinie), 2017-12", desc: "Grundlage für Planung und Ausführung Weißer Wannen." }
    ],
    dissertations: [
      
    ]
  },
  beton: {
    websites: [
      { name: "beton.org", url: "https://www.beton.org", desc: "InformationsZentrum Beton mit Fachinformationen und Merkblättern." },
      { name: "VDZ Zementportal", url: "https://www.vdz-online.de", desc: "Forschungsinstitut der Zementindustrie mit aktuellen Studien zur Dekarbonisierung." }
    ],
    books: [
      { title: "Beton – Arten, Herstellung und Eigenschaften", desc: "Grübl, P.; Weigler, H.; Karl, S., 2. Aufl., Ernst & Sohn 2001." },
      { title: "Zement-Taschenbuch", desc: "Verein Deutscher Zementwerke (Hrsg.), 51. Ausgabe, Verlag Bau+Technik 2008 (letzte Ausgabe; Normenstand 2008)." }
    ],
    publications: [],
    dissertations: []
  },
  holzbau: {
    websites: [
      { name: "Informationsdienst Holz", url: "https://informationsdienst-holz.de", desc: "Umfangreiche Fachpublikationen, Holzbau Handbücher und Konstruktionsdetails." },
      { name: "dataholz.eu", url: "https://www.dataholz.eu", desc: "Bauteilkatalog der Holzforschung Austria mit bauphysikalischen und brandschutztechnischen Kennwerten." }
    ],
    books: [
      { title: "Ingenieurholzbau – Grundlagen der Bemessung", desc: "Blaß, H. J.; Sandhaas, C., KIT Scientific Publishing 2016 (frei verfügbar)." },
      { title: "Atlas Mehrgeschossiger Holzbau", desc: "Kaufmann, H.; Krötsch, S.; Winter, S., Detail 2017." }
    ],
    publications: [],
    dissertations: []
  }
};
