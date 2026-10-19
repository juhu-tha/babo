import { Task } from '../aufgabenData';

export const mechanikTasks: Task[] = [
  {
    id: 't17',
    difficulty: 'Schwer',
    title: 'Baustatik: Schnittgrößen am Einfeldträger',
    question: 'Ein Einfeldträger (Spannweite L = 6,0 m) wird mit einer Gleichlast von q = 15 kN/m belastet. Berechnen Sie das maximale Biegemoment und die maximale Querkraft.',
    moduleHint: { id: 'baustatik', name: 'Baustatik (Einfeldträger)' },
    solution: 'Berechnung nach den statischen Gleichgewichtsbedingungen:\n1. **Maximales Biegemoment ($M_{\\text{max}}$):** Tritt in Trägermitte ($x = L/2$) auf:\n$$M_{\\text{max}} = \\frac{q \\cdot L^2}{8} = \\frac{15\\text{ kN/m} \\times (6.0\\text{ m})^2}{8} = \\frac{15 \\times 36}{8} = **67{,}5\\text{ kNm}**$$\n2. **Maximale Querkraft ($V_{\\text{max}}$):** Tritt direkt an den Auflagern ($x = 0$ und $x = L$) auf:\n$$V_{\\text{max}} = \\frac{q \\cdot L}{2} = \\frac{15\\text{ kN/m} \\times 6{,}0\\text{ m}}{2} = **45{,}0\\text{ kN}**$$'
  },
  {
    id: 't11',
    difficulty: 'Mittel',
    title: 'Knicken: Euler-Fälle & Schlankheitsgrad',
    question: 'Eine Stahlstütze (L=4,0m) ist unten eingespannt und oben frei (Euler-Fall 1: Kragarm). Wie ändert sich die theoretische Knicklast, wenn beide Enden gelenkig gelagert werden (Euler-Fall 2)?',
    moduleHint: { id: 'knicken', name: 'Knicken (Euler)' },
    solution: 'Berechnung nach der Euler-Theorie für elastisches Knicken ($F_k = \\frac{\\pi^2 \\cdot E \\cdot I}{L_k^2}$):\n1. **Knicklänge Euler-Fall 1:** $L_{k,1} = 2{,}0 \\cdot L = 8{,}0\\text{ m}$.\n2. **Knicklänge Euler-Fall 2:** $L_{k,2} = 1{,}0 \\cdot L = 4{,}0\\text{ m}$.\n3. **Verhältnis der Knicklasten:**\n$$\\frac{F_{k,2}}{F_{k,1}} = \\left( \\frac{L_{k,1}}{L_{k,2}} \\right)^2 = \\left( \\frac{8{,}0\\text{ m}}{4{,}0\\text{ m}} \\right)^2 = 2^2 = 4$$\nDie kritische Knicklast **vervierfacht sich (+300 %)**.'
  },
  {
    id: 't_festigkeit',
    difficulty: 'Schwer',
    title: 'Festigkeitsberechnungen: Zweiachsiger Spannungszustand & Mohr-Kreis',
    question: 'Ein Bauteil steht unter einem zweiachsigen Spannungszustand: sigma_x = 50 MPa, sigma_y = -20 MPa, tau_xy = 30 MPa. Berechnen Sie die Hauptspannungen.',
    moduleHint: { id: 'festigkeit', name: 'Festigkeitsberechnungen' },
    solution: 'Bestimmung über den Mohr\'schen Spannungskreis:\n1. **Mittelspannung ($\\sigma_m$):** $\\sigma_m = \\frac{\\sigma_x + \\sigma_y}{2} = \\frac{50 + (-20)}{2} = 15{,}0\\text{ MPa}$.\n2. **Radius des Spannungskreises ($R = \\tau_{\\text{max}}$):**\n$$R = \\sqrt{\\left(\\frac{\\sigma_x - \\sigma_y}{2}\\right)^2 + \\tau_{xy}^2} = \\sqrt{35^2 + 30^2} = \\sqrt{1225 + 900} \\approx **46{,}1\\text{ MPa}**$$\n3. **Hauptspannungen ($\\sigma_1, \\sigma_2$):**\n- $\\sigma_1 = \\sigma_m + R = 15{,}0 + 46{,}1 = **61{,}1\\text{ MPa}**$\n- $\\sigma_2 = \\sigma_m - R = 15{,}0 - 46{,}1 = **-31{,}1\\text{ MPa}**$'
  },
  {
    id: 't_statik_moment',
    difficulty: 'Mittel',
    title: 'Baustatik: Biegemoment Einfeldträger unter Einzellast',
    question: 'Ein Einfeldträger der Länge L=5m wird mit einer Einzellast F=10kN exakt in der Mitte belastet. Wie groß ist das maximale Biegemoment?',
    moduleHint: { id: 'baustatik', name: 'Baustatik (Einfeldträger)' },
    solution: 'Aufgrund der Symmetrie betragen beide Auflagerkräfte $A = B = F/2 = 5\\text{ kN}$.\nDas maximale Biegemoment tritt unter der Einzellast auf:\n$$M_{\\text{max}} = \\frac{F \\cdot L}{4} = \\frac{10\\text{ kN} \\times 5{,}0\\text{ m}}{4} = **12{,}5\\text{ kNm}**$$'
  },
  {
    id: 't_bruch',
    difficulty: 'Schwer',
    title: 'Bruchmechanik: Rissausbreitung & K_Ic',
    question: 'Ein Stahlbauteil hat einen initialen Anriss der Länge a = 2 mm. Der kritische Spannungsintensitätsfaktor (Bruchzähigkeit K_Ic) beträgt 50 MPa*m^0.5. Bei welcher Spannung kommt es zum Sprödbruch?',
    moduleHint: { id: 'bruchmechanik', name: 'Bruchmechanik' },
    solution: 'Standardgleichung nach Irwin: $K_I = \\sigma \\cdot Y \\cdot \\sqrt{\\pi \\cdot a}$.\nSprödbruch tritt auf, wenn $K_I \\ge K_{Ic}$:\n$$\\sigma_c = \\frac{K_{Ic}}{Y \\cdot \\sqrt{\\pi \\cdot a}} = \\frac{50}{1{,}0 \\cdot \\sqrt{\\pi \\times 0{,}002\\text{ m}}} = \\frac{50}{\\sqrt{0{,}006283}} \\approx **630{,}8\\text{ MPa}**$$'
  },
  {
    id: 't18',
    difficulty: 'Schwer',
    title: 'Bodenmechanik: Setzungsberechnung',
    question: 'Ein Fundament bringt eine Zusatzspannung von 100 kN/m² auf eine 4 m dicke Tonschicht (Steifemodul E_s = 5 MN/m²). Wie groß ist die zu erwartende Endsetzung?',
    moduleHint: { id: 'bodenmechanik', name: 'Bodenmechanik' },
    solution: 'Zusammendrückungsgesetz der Bodenmechanik:\n$$s = \\frac{\\Delta\\sigma}{E_s} \\cdot h = \\frac{100\\text{ kN/m}^2}{5000\\text{ kN/m}^2} \\times 4{,}0\\text{ m} = 0{,}02 \\times 4{,}0 = 0{,}08\\text{ m} = **8{,}0\\text{ cm}**$$\nAufgrund der geringen Durchlässigkeit von Ton vollzieht sich diese Setzung über Jahre durch Porenwasserüberdruckabbau (Konsolidierung).'
  },
  {
    id: 't_terzaghi_effektiv',
    difficulty: 'Schwer',
    title: 'Bodenmechanik: Effektive Spannungen nach Terzaghi & Porenwasserdruck',
    question: 'In 6 m Tiefe unter Gelände liegt ein wassergesättigter Boden mit einer Gesamtwichte von \\gamma = 20 kN/m³. Der Grundwasserspiegel steht 2 m unter GOK. Berechnen Sie die Totalspannung \\sigma, den hydrostatischen Porenwasserdruck u und die wirksame Korn-zu-Korn-Spannung \\sigma\' nach Terzaghi.',
    moduleHint: { id: 'bodenmechanik', name: 'Bodenmechanik' },
    solution: 'Berechnung nach dem Terzaghi-Prinzip ($\\sigma\' = \\sigma - u$):\n1. **Totalspannung ($\\sigma$):**\n   $$\\sigma = \\gamma \\cdot z = 20\\text{ kN/m}^3 \\times 6{,}0\\text{ m} = 120{,}0\\text{ kN/m}^2$$\n2. **Porenwasserdruck ($u$):**\n   Wassersäule $h_w = 6{,}0\\text{ m} - 2{,}0\\text{ m} = 4{,}0\\text{ m}$:\n   $$u = \\gamma_w \\cdot h_w = 10\\text{ kN/m}^3 \\times 4{,}0\\text{ m} = 40{,}0\\text{ kN/m}^2$$\n3. **Effektive Spannung ($\\sigma\'$):**\n   $$\\sigma\' = \\sigma - u = 120{,}0 - 40{,}0 = **80{,}0\\text{ kN/m}^2$$\n   Nur diese effektive Spannung $\\sigma\'$ aktiviert die Scherfestigkeit des Bodengefüges nach Mohr-Coulomb ($\\tau_f = c\' + \\sigma\' \\tan\\varphi\'$).'
  },
  {
    id: 't_von_mises',
    difficulty: 'Mittel',
    title: 'Festigkeitslehre: Gestaltänderungsenergiehypothese (von Mises)',
    question: 'Ein dünnwandiger Stahlhohlkasten erfährt im Grenzzustand eine Normalspannung von \\sigma_x = 180 N/mm² und eine Schubspannung von \\tau_{xy} = 65 N/mm². Berechnen Sie die von Mises-Vergleichsspannung \\sigma_v und prüfe, ob die Streckgrenze von S235 (f_y = 235 N/mm²) überschritten wird.',
    moduleHint: { id: 'festigkeit', name: 'Festigkeitsberechnungen' },
    solution: '1. **Formel nach von Mises für den ebenen Spannungszustand:**\n   $$\\sigma_v = \\sqrt{\\sigma_x^2 + 3 \\cdot \\tau_{xy}^2}$$\n2. **Berechnung:**\n   $$\\sigma_v = \\sqrt{180^2 + 3 \\times 65^2} = \\sqrt{32400 + 3 \\times 4225} = \\sqrt{32400 + 12675} = \\sqrt{45075} \\approx **212{,}3\\text{ N/mm}^2$$\n3. **Nachweis:**\n   Da $\\sigma_v = 212{,}3\\text{ N/mm}^2 \\le f_y = 235\\text{ N/mm}^2$ (Ausnutzungsgrad $\\eta = 212{,}3 / 235 \\approx 90{,}3\\%$), fließt der Stahl noch nicht. Die Tragsicherheit ist erfüllt.'
  },
  {
    id: 't_labor_emodul',
    difficulty: 'Leicht',
    title: 'Labor: E-Modul-Bestimmung & Hysteresezyklen',
    question: 'Warum besteht die normgerechte E-Modul-Bestimmung im Baustofflabor aus mehreren Be- und Entlastungszyklen?',
    moduleHint: { id: 'labor', name: 'Virtuelle Versuche' },
    solution: 'Bei reiner Erstbelastung werden unvermeidliche Setzungs- und Ausgleichsbewegungen der Prüfaufhängung sowie lokale Mikrodehnungen mitgemessen. Durch 3 Ent- und Belastungszyklen innerhalb des elastischen Bereichs wird das rein elastische Werkstoffverhalten isoliert, sodass der Sekanten- bzw. Tangentenmodul fehlerfrei bestimmt werden kann.'
  },
  {
    id: 't_materialmodelle',
    difficulty: 'Mittel',
    title: 'Materialmodelle: Viskoelastizität (Kelvin-Voigt)',
    question: 'Wie unterscheidet sich die Dehnungsantwort eines Kelvin-Voigt-Körpers von einem ideal-elastischen Hooke-Körper bei schlagartiger Dauerlast?',
    moduleHint: { id: 'materialmodelle', name: 'Materialmodelle' },
    solution: 'Ein Hooke-Körper dehnt sich augenblicklich (spontan) proportional zur Spannung. Der Kelvin-Voigt-Körper (Feder parallel zum Dämpfer) verhindert eine Spontandehnung; die Dehnung startet bei null und nähert sich mit der Retardationszeit $\\tau = \\eta / E$ asymptotisch dem elastischen Endwert an (zeitverzögertes Kriechen).'
  },
  {
    id: 't_mechanik_volumendehnung',
    difficulty: 'Mittel',
    title: 'Mechanik-Grundlagen: Volumendehnung & Poissonzahl',
    question: 'Warum gilt ein Werkstoff mit einer Poissonzahl von \\nu = 0.5 als vollkommen inkompressibel (volumenbeständig)?',
    moduleHint: { id: 'mechanik_info', name: 'Mechanik Überblick' },
    solution: 'Die relative Volumenänderung (Volumendehnung $\\varepsilon_V$) unter hydrostatischem Druck beträgt:\n$$\\varepsilon_V = \\varepsilon_x + \\varepsilon_y + \\varepsilon_z = \\frac{1 - 2\\nu}{E} (\\sigma_x + \\sigma_y + \\sigma_z)$$\nSetzt man $\\nu = 0{,}5$ ein, so wird der Term $(1 - 2\\nu) = (1 - 2 \\times 0{,}5) = 0$. Das bedeutet, dass sich das Volumen des Werkstoffs unter beliebiger mehraxialer Spannung nicht ändert (reine Gestaltänderung, kein Volumenschrumpf, typisch für Gummi, Elastomere und plastisch fließende Metalle).'
  }
];
