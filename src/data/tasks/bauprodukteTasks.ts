import { Task } from '../aufgabenData';

export const bauprodukteTasks: Task[] = [
  {
    id: 't_cpr_grundanforderungen',
    difficulty: 'Mittel',
    title: 'Baurecht: Bauproduktenverordnung (CPR) & Grundanforderungen',
    question: 'Welche rechtliche Funktion hat die EU-Bauproduktenverordnung (EU-BauPVO (EU) 2024/3110 (anwendbar seit 08.01.2026); für bestehende hEN gilt übergangsweise noch VO (EU) 305/2011) im europäischen Binnenmarkt und welches sind die 7 Grundanforderungen an Bauwerke (BWR 1 bis 7)?',
    moduleHint: { id: 'bp_recht_grundlagen', name: 'Baurecht: Grundlagen' },
    solution: 'Die CPR harmonisiert die Bedingungen für das Inverkehrbringen von Bauprodukten im europäischen Binnenmarkt durch einheitliche Prüfmethoden und Leistungserklärungen (DoP).\nDie 7 Grundanforderungen an Bauwerke (Basic Requirements for Construction Works, BWR) lauten:\n1. **Mechanische Festigkeit und Standsicherheit**\n2. **Brandschutz**\n3. **Hygiene, Gesundheit und Umweltschutz**\n4. **Sicherheit und Barrierefreiheit bei der Nutzung**\n5. **Schallschutz**\n6. **Energieeinsparung und Wärmeschutz**\n7. **Nachhaltige Nutzung der natürlichen Ressourcen** (zirkuläre Baustoffe, Recyclingfähigkeit).'
  },
  {
    id: 't_avcp_systeme',
    difficulty: 'Schwer',
    title: 'Baurecht: AVCP-Systeme (1+, 1, 2+, 3, 4) & Notifizierte Stellen',
    question: 'Vergleichen Sie die Systeme zur Bewertung und Überprüfung der Leistungsbeständigkeit (AVCP-Systeme) 1+ und 4 hinsichtlich der Aufgaben des Herstellers und der notifizierten Produktzertifizierungsstelle.',
    moduleHint: { id: 'bp_recht_avcp', name: 'Baurecht: AVCP-Systeme' },
    solution: '1. **AVCP-System 1+ (höchste Sicherheitsstufe, z.B. für Zemente, Bauwerkslager, Brandschutzprodukte):**\n   - *Aufgaben des Herstellers:* Werkseigene Produktionskontrolle (WPK), Prüfung von im Werk entnommenen Proben nach Prüfplan.\n   - *Aufgaben der notifizierten Zertifizierungsstelle:* Feststellung des Produkttyps anhand von Typprüfungen, Erstinspektion des Werks und der WPK, laufende Überwachung und Evaluierung der WPK, sowie **Stichprobenprüfungen von im Werk oder Markt entnommenen Proben** (Audit-Testing).\n2. **AVCP-System 4 (geringste Anforderung, z.B. Standardsteine, einfache Beläge):**\n   - *Aufgaben des Herstellers:* Durchführung der Typprüfung des Produkts, Einrichtung und Durchführung der werkseigenen Produktionskontrolle (WPK).\n   - *Aufgaben notifizierter Stellen:* **Keine Einschaltung einer externen notifizierten Stelle erforderlich.** Der Hersteller erklärt die Konformität in Eigenverantwortung.'
  },
  {
    id: 't_dop_ce_kennzeichnung',
    difficulty: 'Mittel',
    title: 'Baurecht: Leistungserklärung (DoP) & CE-Kennzeichnung',
    question: 'Darf ein Bauprodukt in der EU mit dem CE-Zeichen gekennzeichnet werden, wenn keine harmonisierte Norm (hEN) existiert? Welcher alternative Weg steht dem Hersteller offen?',
    moduleHint: { id: 'bp_recht_konformitaet', name: 'Baurecht: Konformität & DoP' },
    solution: 'Existiert für ein Bauprodukt keine harmonisierte europäische Norm (hEN), kann der Hersteller **keine** direkte CE-Kennzeichnung nach hEN vornehmen.\n**Alternativer Weg:** Der Hersteller kann über eine Europäische Technische Bewertungsstelle (TAB) ein **Europäisches Bewertungsdokument (EAD - European Assessment Document)** anfordern und eine **Europäische Technische Bewertung (ETA - European Technical Assessment)** erwirken. Auf Basis dieser ETA kann die Leistungserklärung (Declaration of Performance, DoP) erstellt und das Produkt rechtmäßig mit dem CE-Zeichen versehen werden.'
  },
  {
    id: 't_rsto_belastungsklasse',
    difficulty: 'Schwer',
    title: 'Verkehrswegebau: RStO 12/24 & Bemessungsrelevante 10-t-Achsübergänge',
    question: 'Für eine zweistreifige Bundesstraße mit einem Schwerverkehrsanteil (SV > 3,5 t) von DTV^(SV) = 1800 Fzg/24h auf dem Bemessungsfahrstreifen soll die Belastungsklasse nach RStO 12/24 ermittelt werden. Der Nutzungszeitraum beträgt n = 30 Jahre, der Fahrstreifenfaktor f_1 = 1,0, der Fahrstreifenbreitenfaktor f_2 = 1,0, die mittlere Steigung < 2% (f_3 = 1,0) und der mittlere Achszahlfaktor f_A = 4.0. Berechnen Sie die äquivalenten 10-t-Achsübergänge B und bestimmen Sie die Belastungsklasse (Bk).',
    moduleHint: { id: 'bp_verkehr_rsto', name: 'Verkehrsbau: RStO 12/24' },
    solution: 'Berechnung nach RStO 12/24 (ARS 02/2024):\n1. **Formel für die dimensionierungsrelevante Achsübergangszahl ($B$):**\n   $$B = N \\cdot f_1 \\cdot f_2 \\cdot f_3$$\n   wobei $N$ die Gesamtzahl der Achsübergänge des Schwerverkehrs über den Nutzungszeitraum ist:\n   $$N = \\text{DTV}^{(SV)} \\cdot 365 \\cdot q_{Bm} \\cdot f_z \\cdot f_A$$\n   Bei einer angenommenen mittleren jährlichen Zuwachsrate von $p = 1{,}0\\%$ ergibt sich der Zuwachsfaktor $f_z = \\frac{(1+0{,}01)^{30}-1}{0{,}01 \\times 30} \\approx 1{,}16$.\n2. **Achsübergänge ($N$):**\n   $$N = 1800 \\times 365 \\times 1{,}16 \\times 4{,}0 \\approx 3{,}047 \\cdot 10^7$$\n3. **Berechnung der äquivalenten 10-t-Achsübergänge ($B$):**\n   Unter Berücksichtigung des äquivalenten Achslastfaktors ($f_L \\approx 0{,}33$ nach RStO 12/24):\n   $$B = N \\cdot f_L \\approx 30{,}5 \\cdot 10^6 \\times 0{,}33 \\approx **10{,}05 \\cdot 10^6**$$\n4. **Einstufung in die Belastungsklasse:**\n   - Bk3.2: $3{,}2 \\cdot 10^6 < B \\le 10 \\cdot 10^6$\n   - Bk10: $10 \\cdot 10^6 < B \\le 32 \\cdot 10^6$\n   Mit $B \\approx 10{,}1$ Millionen liegt die Straße in der **Belastungsklasse Bk10**.'
  },
  {
    id: 't_asphalt_schichtenaufbau',
    difficulty: 'Mittel',
    title: 'Verkehrswegebau: Asphalt-Oberbau nach RStO & ZTV Asphalt-StB',
    question: 'Skizzieren Sie den standardmäßigen dreischichtigen Asphaltaufbau einer hochbelasteten Fahrbahn (Deckschicht, Binderschicht, Tragschicht) und erläutern Sie die jeweilige bautechnische Funktion der Schichten.',
    moduleHint: { id: 'bp_verkehr_asphalt', name: 'Verkehrsbau: Asphalt' },
    solution: '1. **Asphaltdeckschicht (meist 3,5–4,0 cm SMA - Splittmastixasphalt):**\n   - *Funktion:* Verschleißfestigkeit gegen Polieren durch Reifen, Griffigkeit für Bremsverzögerung, Entwässerung (Lärmminderung), Schutz der Unterlage vor Witterung und UV-Strahlung.\n2. **Asphaltbinderschicht (meist 7–9 cm Asphaltbinder AC B):**\n   - *Funktion:* Hoher Verformungswiderstand gegen Spurrinnenbildung bei sommerlicher Hitze, Aufnahme und Weiterleitung der horizontalen Brems- und Schubkräfte aus dem Radkontakt.\n3. **Asphalttragschicht (meist 10–18 cm Asphalttragschicht AC T):**\n   - *Funktion:* Hohe Ermüdungsbeständigkeit gegen dynamische Zugspannungen an der Schichtunterseite, Verteilung der vertikalen Radlasten auf die ungebundene Frostschutzschicht.'
  },
  {
    id: 't_betonfahrbahn_verduebelung',
    difficulty: 'Mittel',
    title: 'Verkehrswegebau: Betonfahrbahndecken & Querfugenverdübelung',
    question: 'Warum müssen Querfugen in unbewehrten Betonfahrbahndecken (nach ZTV Beton-StB) mit kunststoffummantelten Stahldübeln versehen werden, während in Längsfugen gerippte Anker eingebaut werden?',
    moduleHint: { id: 'bp_verkehr_betondecken', name: 'Verkehrsbau: Betondecken' },
    solution: '1. **Querfugen (Dübeldurchmesser meist 25 mm glatt mit PE-Ummantelung):**\n   - Querfugen sind Raum- oder Scheinfugen, die sich bei Temperaturwechseln (Sommer/Winter) in Längsrichtung der Fahrbahn frei öffnen und schließen müssen, um Zwangspannungen zu vermeiden.\n   - Glatte Dübel übertragen die **vertikalen Querkräfte (Schwerlasträder)** von Platte zu Platte (kein "Plattenklappern"), ohne die thermische Längsverschiebung zu behindern (daher glatt und gefettet/beschichtet).\n2. **Längsfugen (Anker aus geripptem Betonstahl B500):**\n   - Längsfugen dürfen sich quer zur Fahrbahn nicht öffnen, um ein Auseinanderwandern der Fahrstreifen zu verhindern.\n   - Die gerippten Anker verkrallen sich formschlüssig im Beton und sichern den Querverband formstabil.'
  },
  {
    id: 't_abdichtung_din18533',
    difficulty: 'Schwer',
    title: 'Bauwerksabdichtung: DIN 18533 Wasserbeanspruchungsklassen',
    question: 'Welche Wasserbeanspruchungsklasse nach DIN 18533 liegt bei einer Kelleraußenwand vor, wenn der Bemessungsgrundwasserstand (HGW) 1,5 m über der Kellersohle liegt? Welche Abdichtungsbauarten sind hierfür zulässig?',
    moduleHint: { id: 'bp_abdichtung', name: 'Bauprodukte: Abdichtung' },
    solution: '1. **Wasserbeanspruchungsklasse nach DIN 18533-1:**\n   Liegt der höchste Grundwasserstand über der Fundamentunterkante (Sohle), liegt drückendes Wasser von außen vor.\n   Dies entspricht der **Klasse W2.1-E: Drückendes Wasser von außen (Mäßige Einwirkung bei Eintauchtiefe \\le 3 m)**.\n2. **Zulässige Abdichtungsbauarten nach DIN 18533-2 und -3:**\n   - Bahnenförmige Abdichtung: Mindestens zweilagige polymermodifizierte Bitumenbahnen (z.B. PYE-PV 200 S5) oder einlagige Kunststoff- bzw. Elastomerbahnen mit Heißluftverschweißung.\n   - Flüssig zu verarbeitende Abdichtungsstoffe: Kunststoffmodifizierte Bitumendickbeschichtungen (PMBC) mit Gewebeeinlage (Trockenschichtdicke $\\ge 4{,}0\\text{ mm}$) oder mineralische Dichtungsschlämmen (MDS/FPD).\n   - Alternativ: Ausführung des Bauteils als Weiße Wanne (WU-Beton nach DAfStb) ohne zusätzliche bahnenförmige Abdichtung.'
  },
  {
    id: 't_befestigung_anker',
    difficulty: 'Mittel',
    title: 'Befestigungstechnik: Spreizanker vs. Verbundanker im Beton',
    question: 'Vergleichen Sie mechanische Spreizanker und chemische Verbundanker (Injektionsmörtelsysteme) bezüglich der Einleitung von Spreizkräften in den Beton und ihrer Eignung bei geringen Randabständen.',
    moduleHint: { id: 'bp_befestigung', name: 'Bauprodukte: Befestigung' },
    solution: '1. **Mechanische Spreizanker:**\n   - Krafteinleitung über Reibung und partiellen Formschluss durch Aufspreizen des Spreizkonus.\n   - Erzeugt erhebliche radial gerichtete **Spreizkräfte** im Beton. Bei geringen Achs- oder Bauteilrandabständen führt dies zum Aufspalten (Randabplatzung) des Betons. Daher sind große Mindestrandabstände ($c_{\\text{min}}$) zwingend einzuhalten.\n2. **Chemische Verbundanker (Reaktionsharzmörtel):**\n   - Krafteinleitung über flächigen **Stoffschluss/Verbund** zwischen Ankerstange, Harzmörtel (Epoxid oder Vinylester) und der Bohrlochwandung.\n   - Praktisch **spreizdruckfreie Krafteinleitung**. Daher eignen sich Verbundanker ideal für sehr geringe Rand- und Achsabstände sowie für Befestigungen in gerissenem Beton oder Mauerwerk.'
  },
  {
    id: 't_betonzusatzmittel_pce',
    difficulty: 'Mittel',
    title: 'Betonzusatzmittel: Fließmittelwirkmechanismus (PCE vs. Melamin)',
    question: 'Warum ermöglichen Fließmittel auf Polycarboxylatether-Basis (PCE) eine wesentlich höhere Wasserreduktion (> 30 %) als klassische Melaminsulfonat-Verflüssiger?',
    moduleHint: { id: 'bp_betonzusatzmittel', name: 'Bauprodukte: Zusatzmittel' },
    solution: '1. **Klassische Verflüssiger (Melamin- und Naphthalinsulfonate):**\n   - Lagern sich an die positiv geladenen Zementpartikel an und wirken fast ausschließlich über **elektrostatische Abstoßung** (Zeta-Potenzial).\n   - Mit fortschreitender Hydratation werden die Moleküle rasch von Hydratphasen überwachsen, wodurch die Verflüssigungswirkung schnell nachlässt (Slump-Loss).\n2. **PCE-Fließmittel (Kamm-Copolymere):**\n   - Besitzen eine geladene Hauptkette, die an den Zementkristall adsorbiert, und lange, ungeladene hydrophile **Polyethylenglykol-Seitenketten** (Kammstruktur).\n   - Wirken vor allem über **sterische Hinderung**: Die ausladenden Seitenketten ragen weit in den Porenraum und verhindern mechanisch ein Zusammenklumpen (Agglomerieren) der Zementkörner. Dies ermöglicht enorme Wasserreduktionen bei langer Offenzeit.'
  },
  {
    id: 't_trockenbau_brandschutz',
    difficulty: 'Leicht',
    title: 'Trockenbau: Brandschutzwirkung von Gipskartonplatten (GKF)',
    question: 'Warum schützen Feuerschutz-Gipskartonplatten (Typ DF / GKF nach DIN EN 520) tragende Stahl- und Holzbauteile im Brandfall über 60 bis 90 Minuten vor kritischer Erwärmung?',
    moduleHint: { id: 'bp_trockenbau', name: 'Bauprodukte: Trockenbau' },
    solution: 'Gips ($CaSO_4 \\cdot 2\\,H_2O$) enthält ca. **21 Gew.-% chemisch gebundenes Kristallwasser** (ca. 2 Liter Wasser pro Quadratmeter einer 12,5 mm dicken Platte). Im Brandfall dehydratisiert der Gips bei ca. 100–140°C unter enormem Energieverbrauch (Verdampfungsenthalpie). Das verdampfende Kristallwasser kühlt das Bauteil aktiv und hält die Temperatur auf der feuerabgewandten Seite lange Zeit nahe 100°C. GKF-Platten enthalten zudem eingelagerte Glasfasern, die den dehydratisierten Gipskern vor dem vorzeitigen Zerbröckeln und Abfallen schützen.'
  }
];
