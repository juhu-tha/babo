import sys
from patch_modules import update_file

# Module 50: Holzwerkstoffe.tsx & BaustoffProfil.tsx
holzwerkstoffe_replacements = [
    # [3B6]
    ("<li><strong>Verwendung:</strong> Möbelbau, Innenausbau (nicht tragend).</li>",
     "<li><strong>Verwendung:</strong> Möbelbau und Innenausbau (P2, P3); als P4–P7 nach DIN EN 312 auch tragend, z. B. Verlegeplatten und Beplankungen.</li>"),
    # [3B4]
    ("Ein kritischer Faktor bei Holzwerkstoffen sind Ausgasungen von Klebstoffen (Formaldehyd). Die Klassifizierung E1 ist heute Standard, viele Bauprodukte streben verschärfte Richtwerte an (E1 PLUS oder Blauer Engel).",
     "Ein kritischer Faktor sind Formaldehydemissionen aus Klebstoffen. Die frühere Klasse E1 (EN 717-1) reicht heute nicht mehr: In Deutschland gilt seit 2020 die ChemVerbotsV mit Prüfung nach DIN EN 16516 (umgangssprachlich E05), seit 06.08.2026 EU-weit REACH Anhang XVII Eintrag 77 mit 0,062 mg/m³. Noch strengere Anforderungen stellen Umweltzeichen wie der Blaue Engel."),
    # [3B7]
    ("Recycling von verleimten Holzwerkstoffen ist schwer. Altholz der Kategorien A1 und A2 kann zur Spanplattenherstellung genutzt werden, oft ist jedoch nur die Verbrennung zur Rückgewinnung der Wärmeenergie praktikabel.",
     "Kompliziert durch Bindemittelanteile. Nach KrWG-Abfallhierarchie und AltholzV hat die stoffliche Verwertung (z. B. Spanplattenherstellung aus Altholz A I/A II) Vorrang; belastete Holzwerkstoffe (A III/A IV) werden überwiegend energetisch in zugelassenen Anlagen verwertet."),
    # [3B5]
    ("gamma_M = 1.20 (OSB/Spanplatte) bzw. 1.20-1.30",
     "γM = 1,3 nach DIN EN 1995-1-1/NA (Empfehlungswert Tab. 2.3: 1,2 für OSB/Sperrholz, 1,3 für Span- und Faserplatten)"),
    # [3B11]
    ("{ title: 'dataholz.eu (Baustoff- und Bauteildaten)', url: 'https://www.dataholz.eu/' }",
     "{ title: 'dataholz.eu - Online-Katalog für Holz- und Holzwerkstoffe, Baustoff- und Bauteildaten', url: 'https://www.dataholz.eu/' }")
]
update_file("src/modules/Holzwerkstoffe.tsx", holzwerkstoffe_replacements)

# BaustoffProfil Holzwerkstoffe & Asphalt
baustoff_profil_50_59 = [
    # [3B1] & [3B2]
    ("Deutlich elastischer und formstabiler als Vollholz durch den Ausgleich der natürlichen Anisotropie (quasi-isotropes Verhalten). Biegemodul und Dimensionsstabilität sind exzellent. Rohdichten reichen von 350 kg/m³ (OSB) bis > 800 kg/m³ (HDF).",
     "Formstabiler als Vollholz in Plattenebene durch den Ausgleich der natürlichen Anisotropie (quasi-isotropes Verhalten); Biege-E-Modul und Biegefestigkeit liegen jedoch meist deutlich unter Vollholz faserparallel. Rohdichten reichen von ca. 250 kg/m³ (poröse Holzfaserplatten) über ca. 600–650 kg/m³ (OSB, Spanplatte) bis > 800 kg/m³ (HDF)."),
    # [3B3]
    ("formaldehydfreie Verleimungen (Klasse E1 oder F0-Zulassung)",
     "feuchtebeständige Platten (z. B. P5, OSB/3) zu verwenden; für geringe Innenraumbelastung formaldehydfrei verleimte Platten (z. B. PMDI-gebunden) wählen. E1 bedeutet nur emissionsarm, nicht formaldehydfrei"),
    # [3B8]
    ("Ära des modernen, mehrgeschossigen Holz-Skelettbaus im urbanen Ballungsraum ein.",
     "Ära des modernen, mehrgeschossigen Holz-Massivbaus im urbanen Raum ein."),
    # [3B9]
    ("zur Vermeidung von Wohngitgasen", "zur Vermeidung von Wohngiften (Ausgasungen)"),
    # [3B10]
    ("Haptik & Händigkeit", "Haptik & Handhabung"),
    # [3B31]
    ("Hervorragende Wasserdichtigkeit.",
     "Gussasphalt ist nahezu hohlraumfrei und wasserdicht; Walzasphalte besitzen je nach Sorte einen Hohlraumgehalt von wenigen Prozent (Asphaltbeton) bis über 20 % (offenporiger Asphalt)."),
    # [3B33]
    ("Gussasphalt (MA - fliesfähig, selbstverdichtend und wasserdicht)",
     "Gussasphalt (MA - fließfähig, selbstverdichtend und wasserdicht)")
]
update_file("src/components/ui/BaustoffProfil.tsx", baustoff_profil_50_59)

# Module 52: Asphalt.tsx
asphalt_replacements = [
    # [3B25]
    ("stetige Sieblinie (\"haufwerksporig\")",
     "Der Standard-Asphalt. Er zeichnet sich durch eine stetige Sieblinie aus, das heißt, es sind alle Korngrößen gleichmäßig vertreten. Das führt zu einem dichten, hohlraumarmen Gefüge."),
    ("stetige Sieblinie ('haufwerksporig')",
     "Der Standard-Asphalt. Er zeichnet sich durch eine stetige Sieblinie aus, das heißt, es sind alle Korngrößen gleichmäßig vertreten. Das führt zu einem dichten, hohlraumarmen Gefüge."),
    # [3B26]
    ("theoretischen Raumdichte ρd (vollkommen hohlraumfrei) ... tatsächlichen Rohdichte ρb",
     "Berechnet sich aus der Rohdichte ρm des Asphaltmischguts (hohlraumfrei, DIN EN 12697-5) und der Raumdichte ρb des verdichteten Probekörpers (DIN EN 12697-6): Vm = (ρm − ρb) / ρm · 100 %."),
    # [3B28]
    ("Wachse oder Emulgierhilfen kristallisieren erst bei vollständiger Abkühlung",
     "Verkehrsfreigabe: Auch LTA darf erst nach ausreichender Abkühlung des Belags freigegeben werden. Wachsmodifizierte Bindemittel erstarren bereits bei ca. 90–105 °C und erhöhen danach den Verformungswiderstand; bei chemischen Additiven und Schaumbitumen ist das Verformungsverhalten dagegen mit dem von Standardasphalt vergleichbar."),
    # [3B27]
    ("RStO 12 (Richtlinien für die Standardisierung des Oberbaues von Verkehrsflächen)",
     "RStO 12/24 (Richtlinien für die Standardisierung des Oberbaues von Verkehrsflächen, Ausgabe 2012/Fassung 2024)"),
    ("RStO 12", "RStO 12/24"),
    # [3B29]
    ("1.69 mg/m³ Minimale Freisetzung", "1,69 mg/m³ – AGW (1,5 mg/m³) überschritten! Zusätzliche Absaugung oder Atemschutz erforderlich."),
    # [3B30]
    ("5% Energie eingespart! ... -13% Aerosole",
     "Referenz: Standard-Heißmix bei 180 °C (88,0 kWh/t, 22,0 kg CO₂/t); Einsparungen aller Varianten beziehen sich auf diese Basis."),
    # [3B31]
    ("Hervorragende Wasserdichtigkeit",
     "Gussasphalt ist nahezu hohlraumfrei und wasserdicht; Walzasphalte besitzen je nach Sorte einen Hohlraumgehalt von wenigen Prozent (Asphaltbeton) bis über 20 % (offenporiger Asphalt)."),
    # [3B35]
    ("im Zuge des Makadam-Verfahrens ... Bitumen ab 1900 löste ... Kohlenteere ab",
     "Der moderne Straßenasphalt entwickelte sich im 19. Jahrhundert aus Naturasphalt (Stampf- und Gussasphalt) und aus dem mit Teer gebundenen Makadam; Bitumen aus Erdöl verdrängte Straßenpech erst allmählich, in Deutschland wurde Teer bis in die 1970er/80er Jahre verbaut (heute pechhaltiger Straßenaufbruch)."),
    # [3B36]
    ("Der Gesetzgeber fordert LTA oft direkt ein.",
     "Treiber sind der Arbeitsplatzgrenzwert für Dämpfe und Aerosole aus Bitumen (1,5 mg/m³, TRGS 900) sowie Vorgaben öffentlicher Auftraggeber nach M TA."),
    # [3B37]
    ("Schulze, K. (2011): Asphalt im Straßenbau (Ernst & Sohn)",
     "Hutschenreuther, J.; Wörner, T.: Asphalt im Straßenbau (Kirschbaum Verlag, aktuelle Auflage)"),
    # [3B38]
    ("Wendehorst Baustoffkunde: Kapitel Bituminöse Bindemittel (37. Auflage)",
     "Wendehorst Baustoffkunde: Kapitel Bituminöse Bindemittel (27. Auflage 2011, Vieweg+Teubner)"),
    # [3B32]
    ("des Altholzbitumens", "des Altbitumens"),
    # [3B33]
    ("Volumentprozent", "Volumenprozent"),
    ("fliesfähig", "fließfähig"),
    ("Mischgottemperatur", "Mischguttemperatur"),
    # [3B34]
    ("Niedrigtemperaturasphalt (LTA)", "Niedrigtemperaturasphalt (NTA)"),
    ("LTA-Untergrenze", "NTA-Untergrenze"),
    ("bei LTA zwingend", "bei NTA zwingend"),
    ("(auch temperaturabgesenkter Asphalt, MTA oder LT-Asphalt)", "(auch temperaturabgesenkter Asphalt, vgl. FGSV-Merkblatt M TA)")
]
update_file("src/modules/Asphalt.tsx", asphalt_replacements)

# Module 53: Kunststoffe.tsx
kunststoffe_replacements = [
    # [3B39]
    ("Fluorpolymere (PTFE, ETFE) sind selbstreinigend durch Lotuseffekt",
     "hochwertige Fluorpolymere (PTFE, ETFE) sind durch ihre glatte, antiadhäsive Oberfläche mit niedriger Oberflächenenergie schmutzabweisend und werden vom Regen gereinigt."),
    # [3B40]
    ("bis zu 10-mal größer als Beton/Stahl",
     "ca. 6- bis 20-mal größer als bei Beton/Stahl, z. B. PVC-U ca. 70–80, PE-HD ca. 150–200 gegenüber ca. 10–12·10⁻⁶/K"),
    # [3B41]
    ("Geringe Wärmeleitfähigkeit (ideal für Dämmzwecke)",
     "Geringe Wärmeleitfähigkeit kompakter Kunststoffe (ca. 0,2–0,5 W/(mK)); als Schaumstoff (EPS, XPS, PUR/PIR) ideal für Dämmzwecke."),
    # [3B42]
    ("Spannungsrelaxationsverhalten: Der Kriechmodul Ec ...",
     "Viskoelastisches Verhalten: Bei konstanter Dehnung ε0 relaxiert die Spannung, σ(t) = Er(t,T)·ε0 (Relaxationsmodul); bei konstanter Spannung kriecht der Werkstoff, ε(t) = σ0/Ec(t,T) (Kriechmodul). Beide Moduln sinken mit Lastdauer und Temperatur."),
    # [3B43]
    ("lassen sich ohne Schweißgeräte per einfachem Steckmuffen-Verfahren verlegen",
     "Abwasserrohre aus PVC-U oder PP lassen sich ohne Schweißgeräte per Steckmuffe verlegen; PE-HD-Druckrohre werden durch Heizelementstumpf- oder Elektroschweißmuffen verbunden."),
    # [3B44]
    ("fast alle bodenständigen Chemikalien unbegrenzt beständig",
     "Gegen Wasser, Pilze und viele bodenübliche Chemikalien sehr beständig (Lebensdauer im Erdreich ca. 50–100 Jahre); Beständigkeit gegen Lösemittel und Spannungsrissbildung ist jedoch stoffspezifisch zu prüfen."),
    # [3B45]
    ("Glasübergang Tg (Gleichgewichtszustand zwischen eingefrorenem und beweglichem Zustand)",
     "Am Glasübergang Tg (Übergangsbereich vom eingefrorenen, glasartigen in den beweglichen, gummielastischen Zustand der Kettensegmente) fällt der Modul drastisch ab."),
    # [3B48]
    ("Wendehorst Baustoffkunde ... (37. Auflage)",
     "Wendehorst Baustoffkunde: Kapitel Kunststoffe (27. Auflage 2011, Vieweg+Teubner)"),
    # [3B46]
    ("UV-Verspödung", "UV-Versprödung"),
    # [3B47]
    ("Ehrenstein, G. W. (2011): Polymerwerkstoffe - Struktur und mechanisches Verhalten (Hanser Verlag)",
     "Ehrenstein, G. W. (2011): Polymer-Werkstoffe: Struktur - Eigenschaften - Anwendung, 3. Aufl. (Hanser Verlag)")
]
update_file("src/modules/Kunststoffe.tsx", kunststoffe_replacements)

# Module 54: Daemmstoffe.tsx
daemmstoffe_replacements = [
    # [3B50]
    ("HBCD ... gelten als gefährlicher Abfall",
     "Synthetische EPS-Materialien wurden früher mit dem mittlerweile verbotenen Flammschutzmittel HBCD ausgerüstet; solche Dämmstoffe sind POP-haltige Abfälle, die getrennt gehalten, nachweispflichtig entsorgt und thermisch zerstört werden müssen."),
    ("Früher genutztes HBCD gilt heute als gefährlicher POP-Abfall",
     "Synthetische EPS-Materialien wurden früher mit dem mittlerweile verbotenen Flammschutzmittel HBCD ausgerüstet; solche Dämmstoffe sind POP-haltige Abfälle, die getrennt gehalten, nachweispflichtig entsorgt und thermisch zerstört werden müssen."),
    # [3B53]
    ("GEG (Gebäudeenergiegesetz - Anforderungen an den Wärmeschutz von Bauteilen)",
     "GModG (Gebäudemodernisierungsgesetz (GModG), bis 28.07.2026 Gebäudeenergiegesetz (GEG) - Anforderungen an den Wärmeschutz von Bauteilen)"),
    # [3B49]
    ("B2 bei EPS/Öko", "Rohstoffe bestimmen das Brandverhalten (Mineralwolle A1/A2 nicht brennbar; EPS mit Flammschutz B1 bzw. Euroklasse E; nachwachsende Dämmstoffe meist B2 bzw. E)."),
    # [3B51]
    ("sonst Totalverlust der Leistung", "Nachteil: Darf nicht beschädigt werden, sonst steigt λ durch Belüftung auf ca. 0,020 W/(mK), also etwa um den Faktor 3–5. Teuer."),
    # [3B52]
    ("Kann sehr hohe Mengen an Feuchtigkeit aufnehmen ohne Dämmverlust",
     "Kann viel Feuchtigkeit sorbieren (bis ca. 1/3 des Eigengewichts), ohne sich nass anzufühlen; die Wärmeleitfähigkeit steigt dabei moderat an."),
    # [3B54]
    ("Pistolesi, M. (2015): Ökologische Dämmstoffe im Vergleich (Verlag Bau+Technik)",
     "FNR (Hrsg.): Marktübersicht Dämmstoffe aus nachwachsenden Rohstoffen (Fachagentur Nachwachsende Rohstoffe, aktuelle Ausgabe)"),
    # [3B55]
    ("Wendehorst Baustoffkunde ... (37. Auflage)",
     "Wendehorst Baustoffkunde: Kapitel Wärmeschutz und Dämmstoffe (27. Auflage 2011, Vieweg+Teubner)")
]
update_file("src/modules/Daemmstoffe.tsx", daemmstoffe_replacements)

# Module 55: Ausbau.tsx
ausbau_replacements = [
    # [3B56]
    ("Bitumen ist ein Erdöldestillat.", "Bitumen wird als Rückstand der Vakuumdestillation von Erdöl gewonnen. Es ist wasserabweisend und thermoplastisch."),
    # [3B58]
    ("DIN 18157 (Ausführung keramischer Bekleidungen im Dünnbettverfahren)",
     "DIN 18157-1 bis -3 (Ausführung von Bekleidungen und Belägen im Dünnbettverfahren; Teil 1: hydraulisch erhärtende Dünnbettmörtel, Teil 2: Dispersionsklebstoffe, Teil 3: Reaktionsharzklebstoffe)"),
    # [3B59]
    ("max. 40 m² bzw. 8 m Kantenlänge bei Heizestrichen nach DIN 18560",
     "… zur Bestimmung der notwendigen Fugenabstände (Richtwerte für Heizestriche: Felder max. ca. 40 m², Seitenlänge max. 8 m, Seitenverhältnis ≤ 1:2 nach DIN EN 1264-4 bzw. Schnittstellenkoordination; Fugenplan durch den Planer). Quelle: DIN EN 1264-4 / BEB"),
    # [3B60]
    ("PVC, FPO, EPDM ... Heißluftschweißen oder Quellschweißen",
     "Verbindung: PVC-P durch Heißluft- oder Quellschweißen, FPO durch Heißluftschweißen, EPDM durch Nahtklebung, Fügeband oder Vulkanisation."),
    # [3B61]
    ("Linoleum (Naturprodukt aus Leinöl, Korkmehl, Jute)",
     "Linoleum (Naturprodukt aus oxidiertem Leinöl, Harzen, Holz- und/oder Korkmehl und Kalksteinmehl auf Jutegewebe)"),
    # [3B63]
    ("Sopran, H. (2021): Handbuch Estrichbau (Rudolf Müller Verlag)",
     "Timm, H. / BEB (Hrsg.): Estriche – Arbeitshilfen für die Planung, Ausführung und Beurteilung bzw. BEB-Hinweisblätter (aktuelle Ausgaben)"),
    # [3B64]
    ("Frössel, F. (2019): Handbuch Ausbau und Innensanierung (Fraunhofer IRB)",
     "Frössel, F.: Lexikon der Bausanierung (Fraunhofer IRB Verlag)"),
    # [3B65]
    ("Wendehorst Baustoffkunde ... (37. Auflage)",
     "Wendehorst Baustoffkunde: Kapitel Ausbaustoffe und Estriche (27. Auflage 2011, Vieweg+Teubner)"),
    # [3B57]
    ("du benötigst keine Kartonummantelung", "Sie benötigen keine Kartonummantelung"),
    # [3B62]
    ("Wikipedia: Bauschäumen", "Wikipedia: Montageschaum")
]
update_file("src/modules/Ausbau.tsx", ausbau_replacements)

# Module 56: Faserverbund.tsx
faserverbund_replacements = [
    # [3B66]
    ("CFK-Lamellen (Carbonfaser-Kunststoff-Streifen zur Rissüberbrückung)",
     "CFK-Lamellen (aufgeklebte Carbonfaser-Kunststoff-Streifen zur Biegeverstärkung von Beton- und Holzbauteilen)"),
    # [3B67]
    ("1442 MPa", "1429 MPa"),
    # [3B68]
    ("quelle: 'DIN EN ISO 527-4'", "quelle: 'Schürmann: Konstruieren mit Faser-Kunststoff-Verbunden / VDI 2014 Blatt 3'"),
    # [3B70]
    ("Wendehorst Baustoffkunde ... (37. Auflage)",
     "Wendehorst Baustoffkunde: Kapitel Faserverbundwerkstoffe (27. Auflage 2011, Vieweg+Teubner)"),
    # [3B69]
    ("E\\parallel", "E∥")
]
update_file("src/modules/Faserverbund.tsx", faserverbund_replacements)

# Module 57: Sonstiges.tsx
sonstiges_replacements = [
    # [3B71]
    ("Leichtzuschläge sind mineralische Stoffe mit einer sehr geringen Rohdichte (< 1,0 g/cm³) und hoher Porosität.",
     "Leichtzuschläge sind natürliche oder künstliche Gesteinskörnungen mit einer Kornrohdichte ≤ 2,0 g/cm³ bzw. Schüttdichte ≤ 1,2 g/cm³ (DIN EN 13055) und hoher Porosität."),
    # [3B72]
    ("NO + ·OH + O₂⁻ → NO₃⁻ + H₂O", "NO + 2 ·OH → NO₂ + H₂O ; NO₂ + ·OH → HNO₃ (als Nitrat NO₃⁻ abwaschbar)"),
    ("NO + \\cdot OH + O_2^- \\rightarrow NO_3^- + H_2O", "NO + 2\\cdot OH \\rightarrow NO_2 + H_2O \\,;\\, NO_2 + \\cdot OH \\rightarrow HNO_3"),
    # [3B82]
    ("CO₂ + Ca(OH)₂ (Mauerwasser)", "CO₂ + Ca(OH)₂ (Portlandit/Porenlösung)"),
    ("CO2 + Ca(OH)2 (Mauerwasser)", "CO₂ + Ca(OH)₂ (Portlandit/Porenlösung)"),
    # [3B73]
    ("DIN EN 13055: Leichte Gesteinskörnungen für Beton, Mörtel und Einpressmörtel", "DIN EN 13055: Leichte Gesteinskörnungen (Ausgabe 2016)"),
    # [3B74]
    ("Evakuierungsbedingungen zur Minimierung konvektiver thermischer Transportprozesse",
     "Wärmeleitfähigkeit von Vakuumisolationspaneelen im evakuierten Zustand; der Unterdruck unterdrückt die Wärmeleitung des Gases in den Nanoporen des Kieselsäurekerns"),
    # [3B75]
    ("das einströmende Gas die hervorragende Dämmwirkung schlagartig vernichtet",
     "da das einströmende Gas die Wärmeleitfähigkeit auf ca. 0,020 W/(mK) erhöht, also die Dämmwirkung auf etwa ein Viertel bis ein Drittel reduziert."),
    # [3B76]
    ("Brandschutz: Völlig unbrennbar (Baustoffklasse A1)",
     "Brandschutz: Reines Silica-Aerogel ist nicht brennbar; Produkte (Vliesmatten, Putze) je nach organischem Anteil meist Euroklasse A2 bis C – Klassifizierung des konkreten Produkts beachten."),
    # [3B77]
    ("Haarrisse bis zu einer Breite von ca. 0,3 bis 0,8 mm", "Rissbreitengrenze: Im Labor wurden Risse bis ca. 0,4–0,5 mm Breite geschlossen."),
    # [3B78]
    ("Baubotanik & Lichtausnutzung: Transluzente Glassandwiches",
     "Tageslichtnutzung: Transluzente, aerogelgefüllte Glas- oder Polycarbonat-Sandwichelemente für helle, hochdämmende Belichtung."),
    # [3B84]
    ("Wendehorst Baustoffkunde ... (37. Auflage, Springer Vieweg)",
     "Wendehorst Baustoffkunde: Kapitel Innovative Baustoffe (27. Auflage 2011, Vieweg+Teubner)"),
    # [3B79]
    ("0.007 W/(m\\cdotK)", "0,007 W/(m·K)"),
    ("λ &approx; 0,007", "λ ≈ 0,007"),
    # [3B80]
    ("Auslosung:", "Auslösung:"),
    # [3B81]
    ("wodurch die Gastransferleitung unterbunden wird", "wodurch die Gaswärmeleitung weitgehend unterbunden wird"),
    # [3B83]
    ("Jonkers, H. M. (2011): Bio-based concrete self-healing agents (Delft University of Technology)",
     "Jonkers, H. M. (2011): Bacteria-based self-healing concrete. HERON 56 (1/2)")
]
update_file("src/modules/Sonstiges.tsx", sonstiges_replacements)

# Module 58: MaterialitaetArchitektur.tsx
mat_arch_replacements = [
    # [3B85]
    ("Kirche des Lichts (Osaka) & Kolumba Museum (Köln)", "Kirche des Lichts (Osaka) & Bruder-Klaus-Feldkapelle (Wachendorf)"),
    # [3B86]
    ("DBV/VDZ-Merkblatt Sichtbeton (Fassung 2023)", "DBV/VDZ-Merkblatt Sichtbeton (Fassung Juni 2015)"),
    # [3B87]
    ("DIN 18550 (Putz und Putzsysteme)", "DIN EN 13914-1/-2 mit DIN 18550-1/-2 (Planung, Zubereitung und Ausführung von Außen- und Innenputzen)"),
    # [3B88]
    ("James-Simon-Galerie (Berlin)", "Therme Vals (Graubünden) & Neue Nationalgalerie (Berlin, Granitterrasse)"),
    # [3B91]
    ("formel: '\\rho_d + \\rho_s = 1 - \\alpha'", "formel: '\\rho_d + \\rho_s + \\alpha + \\tau = 1'"),
    ("erklaerung: 'Für opake Werkstoffoberflächen gilt vereinfacht'", "erklaerung: 'Für opake Oberflächen (τ = 0) gilt ρd + ρs = 1 − α.'"),
    # [3B89]
    ("label: 'Baukalk, Sumpfkalk & Tadelakt', id: 'BA'", "label: 'Baukalk, Sumpfkalk & Tadelakt', id: 'KA'"),
    # [3B90]
    ("gehobelte sägerohe Bretter", "gehobelte oder sägeraue Bretter")
]
update_file("src/modules/MaterialitaetArchitektur.tsx", mat_arch_replacements)

# Module 59: Bauchemie.tsx
bauchemie_replacements = [
    # [3C2]
    ("Sinterverfahren ist eine thermische Oberflächenveredelung ... unter hohem Druck",
     "Sintern ist ein thermischer Verdichtungsprozess, bei dem feinkörnige mineralische Stoffe unterhalb der Schmelztemperatur der Hauptkomponenten durch Diffusion und örtliche Schmelzphasenbildung zu einem festen Gefüge zusammenwachsen; beim Zementklinker- und Ziegelbrand geschieht dies drucklos."),
    ("Das Sinterverfahren ist eine thermische Oberflächenveredelung keramischer Baustoffe bei extrem hohen Temperaturen unter hohem Druck",
     "Sintern ist ein thermischer Verdichtungsprozess, bei dem feinkörnige mineralische Stoffe unterhalb der Schmelztemperatur der Hauptkomponenten durch Diffusion und örtliche Schmelzphasenbildung zu einem festen Gefüge zusammenwachsen; beim Zementklinker- und Ziegelbrand geschieht dies drucklos."),
    # [3C10]
    ("zu Ettringit oder Thaumasit",
     "zu Ettringit (Volumenzunahme, Rissbildung); bei tiefen Temperaturen und Carbonatangebot kann zusätzlich Thaumasit aus den C-S-H-Phasen entstehen, was zur Entfestigung des Zementsteins führt."),
    # [3C3]
    ("Es enstehen", "Es entstehen"),
    ("Es entstehen die hochreaktiven Klinkerminerale: Alit",
     "Es entstehen die Klinkerminerale Belit (C₂S, durch Festkörperreaktion, langsam hydratisierend) und oberhalb ca. 1.250 °C über die Schmelzphase Alit (C₃S, schnell hydratisierend, Hauptträger der Frühfestigkeit)."),
    # [3C4]
    ("schmelzen leicht flüchtige Verunreinigungen (Feldspat, Quarzmehle) an",
     "bilden Flussmittel (Feldspäte, Alkalien, Eisenoxide) glasige Schmelzbrücken zwischen den Quarzkörnern. Das Gefüge schwindet (Brennschwindung); Mauerziegel bleiben porös, bei Klinker (Brand bis ca. 1.200 °C) entsteht ein dicht gesintertes, frostbeständiges Gefüge."),
    # [3C5]
    ("nadelartige, kristalline ... machen über 70% des erhärteten Zementsteins aus",
     "bilden sich überwiegend nanokristalline, gelartige Calcium-Silicat-Hydrat-Phasen (C-S-H). Sie machen ca. 50–60 Vol.-% des Zementsteinfeststoffs aus und sind für Festigkeit und Dichtigkeit verantwortlich."),
    ("nadelartige Calciumsilikathydrat-Kristalle (C-S-H-Phasen), die über 70% des Festigkeitsgefüges ausmachen",
     "nanokristalline Calcium-Silicat-Hydrat-Phasen (C-S-H), die ca. 50–60 Vol.-% des Zementsteinfeststoffs ausmachen und für Festigkeit und Dichtigkeit verantwortlich sind"),
    # [3C6]
    ("Wendehorst Baustoffkunde: Kapitel Bauchemische Grundlagen (37. Auflage)",
     "Wendehorst Baustoffkunde: Kapitel Bauchemische Grundlagen (27. Auflage 2011, Vieweg+Teubner)"),
    # [3C9]
    ("Betonverflüssiger (BV): Ligninsulfonate, Melaminharze",
     "Betonverflüssiger (BV): Chemie: v. a. Ligninsulfonate. Fließmittel (FM): klassisch Melamin- und Naphthalinsulfonate (elektrostatisch), modern Polycarboxylatether (PCE, sterisch)."),
    # [3C11]
    ("Newtonianer (wie feuchte Sandbettungen)", "Newtonsche Fluide (z. B. Wasser, dünnflüssige Öle) haben eine scherratenunabhängige Viskosität und wären als standfeste Pasten untauglich."),
    # [3C12]
    ("Aktiver Korrosionsschutz (Feuerverzinken)",
     "Metallischer Überzug (Feuerverzinken, DIN EN ISO 1461): Zink schützt als Barriere und zusätzlich kathodisch, da es unedler als Eisen ist; an kleinen Fehlstellen korrodiert zuerst das Zink und schützt den Stahl."),
    # [3C13]
    ("kein Schwinden", "schwindungsarm"),
    ("schwindungsfreie Erhärtung", "schwindungsarme Erhärtung"),
    # [3C14]
    ("Structural Glazing", "elastische Montagekleber, Fassadenfugen, Parkettklebstoffe (Structural Glazing nur mit zugelassenen Silikonsystemen)"),
    # [3C1]
    ("Bendix - Bauchemie", "Benedix - Bauchemie"),
    # [3C7]
    ("≥ 12.6", "≥ 12,6"),
    ("(Abstandsfaktor < 0.2 mm)", "(Abstandsfaktor < 0,2 mm)")
]
update_file("src/modules/Bauchemie.tsx", bauchemie_replacements)

print("Batch 50-59 finished.")
