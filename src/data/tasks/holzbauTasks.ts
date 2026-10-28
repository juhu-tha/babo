import { Task } from '../aufgabenData';

export const holzbauTasks: Task[] = [
  {
    id: 't_holz_bemessung_biegung',
    difficulty: 'Schwer',
    title: 'Holzbau: Biegebemessung nach Eurocode 5 (DIN EN 1995-1-1)',
    question: 'Ein Einfeldträger (b = 14 cm, h = 28 cm, Spannweite L = 4,5 m) aus Nadelholz C24 (charakteristische Biegefestigkeit f_m,k = 24 N/mm²) wird im Innenbereich (Nutzungsklasse 1) unter ständiger und mittelfristiger Nutzlast (KLED = mittel, k_mod = 0,8) eingesetzt. Der Teilsicherheitsbeiwert für Vollholz beträgt \\gamma_M = 1.3.\n\na) Berechnen Sie den Bemessungswert der Biegefestigkeit f_m,d.\nb) Welches maximale Bemessungsmoment M_Ed darf der Träger unter reiner Biegung aufnehmen?',
    moduleHint: { id: 'holzbau_bemessung', name: 'Holzbau: Bemessung' },
    solution: 'Berechnung nach DIN EN 1995-1-1:\n1. **Bemessungswert der Biegefestigkeit ($f_{m,d}$):**\n   $$f_{m,d} = k_{\\text{mod}} \\cdot \\frac{f_{m,k}}{\\gamma_M} = 0{,}8 \\times \\frac{24\\text{ N/mm}^2}{1{,}3} \\approx 14{,}77\\text{ N/mm}^2$$\n2. **Widerstandsmoment des Rechteckquerschnitts ($W_y$):**\n   $$W_y = \\frac{b \\cdot h^2}{6} = \\frac{14 \\cdot 28^2}{6} = \\frac{14 \\cdot 784}{6} \\approx 1829{,}3\\text{ cm}^3 = 1{,}8293 \\cdot 10^{-3}\\text{ m}^3$$\n3. **Maximal aufnehmbares Biegemoment ($M_{Rd}$):**\n   $$M_{Rd} = W_y \\cdot f_{m,d} = 1{,}8293 \\cdot 10^{-3}\\text{ m}^3 \\times 14{,}77 \\cdot 10^3\\text{ kN/m}^2 \\approx **27{,}02\\text{ kNm}**$$\n   Das maximal zulässige Bemessungsmoment beträgt somit **$M_{Ed} \\le 27{,}0\\text{ kNm}$** (vorausgesetzt, Kippen wird durch Querstützung verhindert).'
  },
  {
    id: 't_holz_verbindung_stabduebel',
    difficulty: 'Schwer',
    title: 'Holzbau-Verbindungen: Johansen-Theorie & Stabdübel',
    question: 'Erklären Sie die Versagensmechanismen stiftförmiger Verbindungsmittel (z.B. Stabdübel) in einer zweischnittigen Holz-Holz-Verbindung nach der Johansen-Theorie. Warum ist das Versagen mit Fließgelenkbildung (Modus g/k) gegenüber dem reinen Lochleibungsversagen (Modus f) statisch zu bevorzugen?',
    moduleHint: { id: 'holzbau_verbindung', name: 'Holzbau: Verbindungen' },
    solution: 'Nach Johansen (Eurocode 5) gibt es für zweischnittige Verbindungen drei grundlegende Versagensmodi:\n1. **Modus f:** Reines Lochleibungsversagen im Holz ohne plastische Biegung des Stabdübels (starrer Dübel verkantet im Holz).\n2. **Modus g:** Lochleibungsversagen mit Ausbildung eines Fließgelenks im mittleren Holzbauteil.\n3. **Modus h/k:** Vollplastische Verformung des Dübels mit zwei Fließgelenken pro Scherfuge unter gleichzeitiger Lochleibung.\n\n**Statische Bevorzugung:**\nDie Fließgelenkbildung des Verbindungsmittels verleiht der Verbindung eine **ausgeprägte Duktilität**. Vor dem endgültigen Bruch kündigt sich die Überlastung durch große Verformungen an (Plastizierung). Zudem wird durch das Abbiegen des Stiftes der sogenannte **Seil- bzw. Einhängeeffekt (Johansen-Seilwirkung)** aktiviert, der zusätzliche Reibungskräfte zwischen den Holzlaschen mobilisiert und die Tragfähigkeit erhöht.'
  },
  {
    id: 't_holz_werkstoffe_bsh_clt',
    difficulty: 'Mittel',
    title: 'Holzwerkstoffe: Brettschichtholz (BSH) vs. Brettsperrholz (CLT)',
    question: 'Vergleichen Sie Brettschichtholz (BSH/GLT) und Brettsperrholz (CLT/BSP) hinsichtlich ihres strukturellen Aufbaus, ihrer Vorzugsbelastungsrichtung und ihrer Quell- und Schwindverhaltens bei Feuchtigkeitsänderungen.',
    moduleHint: { id: 'holzbau_werkstoffe', name: 'Holzwerkstoffe' },
    solution: '1. **Struktureller Aufbau:**\n   - **BSH (Glulam):** Besteht aus faserparallel miteinander verleimten Brettlamellen (Dicke meist 33–45 mm).\n   - **CLT (Cross Laminated Timber):** Besteht aus mindestens 3 kreuzweise (90° zueinander versetzten) verleimten Brettlagen.\n2. **Vorzugsbelastungsrichtung:**\n   - **BSH:** Einachsiges Tragverhalten. Ideal für lineare stabförmige Bauteile mit hohen Biege-, Zug- oder Druckbeanspruchungen (Träger, Stützen, Bogenbinder).\n   - **CLT:** Zweiachsiges Tragverhalten (Flächentragwerk). Ideal für Scheiben- und Plattenbeanspruchung (Deckenplatten, tragende Wände, Dachscheiben).\n3. **Quell- und Schwindverhalten:**\n   - **BSH:** Quellt und schwindet quer zur Faser ungesperrt (ca. 0,24 % je 1 % Holzfeuchteänderung radial/tangential).\n   - **CLT:** Durch die kreuzweise Verleimung sperren sich die Längs- und Querlagen gegenseitig ab. Das Quell- und Schwindmaß in der Plattenebene wird um über 80 % reduziert (Formstabilität ähnlich wie bei einer Sperrholzplatte).'
  },
  {
    id: 't_holz_konstruktion_rahmenbau',
    difficulty: 'Mittel',
    title: 'Holzbau-Konstruktion: Holzrahmenbau vs. Massivholzbau',
    question: 'Im modernen Holzwohnbau konkurrieren die Holzrahmenbauweise (Tafelbau) und die Massivholzbauweise (CLT). Welche Vor- und Nachteile bieten beide Systeme bezüglich Vorfertigungsgrad, Schallschutz und Raumgewicht?',
    moduleHint: { id: 'holzbau_konstruktion', name: 'Holzbau: Konstruktion' },
    solution: '1. **Holzrahmenbauweise:**\n   - *Vorteile:* Sehr geringes Raum- und Eigengewicht, Dämmung wird raumsparend im Hohlraum zwischen den Stielen integriert (schlanke Wandquerschnitte bei hervorragendem U-Wert), materialeffizient und kostengünstig.\n   - *Nachteile:* Geringe thermische Speichermasse, Trittschall- und Luftschallschutz erfordern aufwendige biegeweiche Mehrschichtaufbauten (Schall-Doppelwände, abgehängte Decken).\n2. **Massivholzbauweise (CLT):**\n   - *Vorteile:* Hohe Tragfähigkeit auch bei punktförmigen Lasten, große Auskragungen möglich, hohe thermische Speicherfähigkeit und hohes Eigengewicht (günstig für den sommerlichen Wärmeschutz und Luftschallschutz), sehr gute Erdbebenrobustheit.\n   - *Nachteile:* Höherer Holzverbrauch (und damit höhere Rohstoffkosten), Zusatzdämmung muss immer außen zusätzlich aufgedoppelt werden.'
  },
  {
    id: 't_holz_abbrand_brandschutz',
    difficulty: 'Schwer',
    title: 'Holzbau-Bauphysik: Brandbemessung & ideelle Abbrandtiefe',
    question: 'Eine BSH-Stütze (b = 200 mm, h = 200 mm) aus Nadelholz mit einer rechnerischen Abbrandrate von \\beta_0 = 0,65 mm/min soll eine Feuerwiderstandsdauer von 60 Minuten (R 60) unter Standard-Einheitsbrandkurve (ETK) aufweisen. Berechnen Sie den verbleibenden Restquerschnitt nach Eurocode 5 unter Ansatz einer Übergangsschicht (k_0 · d_0 = 7 mm).',
    moduleHint: { id: 'holzbau_bauphysik', name: 'Holzbau: Bauphysik' },
    solution: 'Berechnung nach DIN EN 1995-1-2 (Brandbemessung im Holzbau):\n1. **Rechnerische Abbrandtiefe ($d_{\\text{char},n}$):**\n   $$d_{\\text{char},n} = \\beta_0 \\cdot t = 0{,}65\\text{ mm/min} \\times 60\\text{ min} = 39{,}0\\text{ mm}$$\n2. **Effektive (ideelle) Abbrandtiefe ($d_{\\text{ef}}$):**\n   Zur Berücksichtigung der wärmebedingten Festigkeits- und Steifigkeitsverluste der brandnahen Holzschichten wird der Zuschlag $d_0 = 7\\text{ mm}$ addiert:\n   $$d_{\\text{ef}} = d_{\\text{char},n} + d_0 = 39{,}0\\text{ mm} + 7{,}0\\text{ mm} = 46{,}0\\text{ mm}$$\n3. **Abbrand an 4 Seiten:**\n   Da die Stütze allseitig vom Feuer beaufschlagt wird, reduziert sich jede Seitenlänge um $2 \\cdot d_{\\text{ef}}$:\n   $$b_{\\text{ef}} = b - 2 \\cdot d_{\\text{ef}} = 200\\text{ mm} - 2 \\times 46{,}0\\text{ mm} = 200 - 92 = **108\\text{ mm}**$$\n   $$h_{\\text{ef}} = h - 2 \\cdot d_{\\text{ef}} = 200\\text{ mm} - 92\\text{ mm} = **108\\text{ mm}**$$\n4. **Verbleibende Restfläche ($A_{\\text{ef}}$):**\n   $$A_{\\text{ef}} = 108\\text{ mm} \\times 108\\text{ mm} = 11\\,664\\text{ mm}^2 = 116{,}6\\text{ cm}^2$$\n   Das sind noch ca. $29{,}2\\%$ des ursprünglichen Querschnitts ($400\\text{ cm}^2$), auf den die Heißbemessung der Stütze nachgewiesen werden muss.'
  },
  {
    id: 't_holz_feuchte_fasersaettigung',
    difficulty: 'Leicht',
    title: 'Holzbau-Grundlagen: Fasersättigungsbereich & Schwinden',
    question: 'Was versteht man unter dem Fasersättigungspunkt (FSP) von Holz (ca. 28–32 % Holzfeuchte) und ab welchem Feuchtebereich treten Schwind- und Quellverformungen auf?',
    moduleHint: { id: 'holzbau_info', name: 'Holzbau Grundlagen' },
    solution: 'Der Fasersättigungspunkt bezeichnet den Zustand, bei dem die Zellwände des Holzes vollständig mit gebundenem Wasser gesättigt sind, die Zellhohlräume (Lumina) jedoch noch kein freies Wasser enthalten (ca. 28–32 % Holzfeuchte).\n- **Oberhalb des FSP:** Bei Feuchteänderungen wird lediglich freies Wasser in den Zellhohlräumen eingelagert oder abgegeben. Es finden **keine Dimensionsänderungen (kein Schwinden/Quellen)** statt, lediglich die Rohdichte ändert sich.\n- **Unterhalb des FSP:** Das Trocknen entzieht den Zellwänden das gebundene Wasser. Die Mikrofibrillen rücken zusammen, und das Holz **beginnt spürbar zu schwinden** (in Faserrichtung sehr gering ca. 0,01 % je %, radial ca. 0,15–0,19 % je %, tangential ca. 0,25–0,36 % je % Holzfeuchteänderung).'
  },
  {
    id: 't_holz_abbrand_traeger_biegung',
    difficulty: 'Schwer',
    title: 'Holzbau-Brandschutz: Heißbemessung eines BSH-Deckenbalkens (R60)',
    question: 'Ein Deckenbalken aus Brettschichtholz GL28h (b = 160 mm, h = 320 mm, f_m,k = 28 N/mm²) wird dreiseitig beflammt (Unterseite und beide Seiten, oben durch eine Brettstapeldecke geschützt). Das ständige Bemessungsmoment bei Normaltemperatur beträgt M_Ed = 45 kNm.\n\na) Berechnen Sie die effektive Abbrandtiefe d_ef für eine Feuerwiderstandsdauer von 60 Minuten (R60) mit \\beta_n = 0,70 mm/min und d_0 = 7,0 mm.\nb) Ermitteln Sie das Rest-Widerstandsmoment W_ef.\nc) Führen Sie den Biegetragfähigkeitsnachweis im Brandfall nach Eurocode 5-1-2 mit dem Brand-Abminderungsfaktor \\eta_{fi} = 0,60, \\gamma_{M,fi} = 1,0 und k_{fi} = 1.15.',
    moduleHint: { id: 'rechnung_brandschutz', name: 'Musterrechnung Brandschutz' },
    solution: 'Berechnung nach DIN EN 1995-1-2:\n1. **Effektive Abbrandtiefe ($d_{\\text{ef}}$):**\n   $$d_{\\text{char},n} = \\beta_n \\cdot t = 0{,}70\\text{ mm/min} \\times 60\\text{ min} = 42{,}0\\text{ mm}$$\n   $$d_{\\text{ef}} = d_{\\text{char},n} + d_0 = 42{,}0 + 7{,}0 = **49{,}0\\text{ mm}**$$\n2. **Effektiver Restquerschnitt ($b_{\\text{ef}} \\times h_{\\text{ef}}$ bei 3-seitigem Brand):**\n   - Breite (beidseitig beflammt): $b_{\\text{ef}} = b - 2 \\cdot d_{\\text{ef}} = 160 - 2 \\times 49{,}0 = 160 - 98 = **62{,}0\\text{ mm}**$.\n   - Höhe (nur Unterseite beflammt): $h_{\\text{ef}} = h - d_{\\text{ef}} = 320 - 49{,}0 = **271{,}0\\text{ mm}**$.\n   - Rest-Widerstandsmoment:\n     $$W_{\\text{ef}} = \\frac{b_{\\text{ef}} \\cdot h_{\\text{ef}}^2}{6} = \\frac{62{,}0 \\times 271{,}0^2}{6} = \\frac{62{,}0 \\times 73441}{6} \\approx 759\\,223\\text{ mm}^3 = **759{,}2\\text{ cm}^3**$$\n3. **Tragfähigkeitsnachweis im Brandfall:**\n   - Einwirkendes Brandmoment: $M_{\\text{fi},Ed} = \\eta_{\\text{fi}} \\cdot M_{Ed} = 0{,}60 \\times 45{,}0\\text{ kNm} = **27{,}0\\text{ kNm}**$.\n   - Bemessungsfestigkeit im Brandfall: $f_{m,\\text{fi},d} = k_{\\text{mod},\\text{fi}} \\cdot k_{\\text{fi}} \\cdot \\frac{f_{m,k}}{\\gamma_{M,\\text{fi}}} = 1{,}0 \\times 1{,}15 \\times \\frac{28{,}0}{1{,}0} = **32{,}2\\text{ N/mm}^2**$.\n   - Aufnehmbares Brandmoment: $M_{\\text{fi},Rd} = W_{\\text{ef}} \\cdot f_{m,\\text{fi},d} = 759{,}2 \\cdot 10^3\\text{ mm}^3 \\times 32{,}2\\text{ N/mm}^2 = 24{,}45\\text{ kNm}$.\n   - **Ausnutzungsgrad:**\n     $$\\eta = \\frac{M_{\\text{fi},Ed}}{M_{\\text{fi},Rd}} = \\frac{27{,}0}{24{,}45} = **1{,}10 > 1{,}0**$$\n   Der Balken ist unter R60 mit $\\eta = 110\\%$ rechnerisch leicht überlastet. Um R60 zu gewährleisten, muss die Balkenbreite von 160 mm auf mindestens 180 mm erhöht werden!'
  }
];
