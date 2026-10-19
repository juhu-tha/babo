import { Task } from '../aufgabenData';

export const laborTasks: Task[] = [
  {
    id: 't_druckfestigkeit_pruefung',
    difficulty: 'Mittel',
    title: 'Baustoffprüfung: Druckfestigkeitsprüfung am Betonwürfel nach DIN EN 12390-3',
    question: 'Ein Betonwürfel mit der Kantenlänge a = 150 mm bricht bei einer Höchstkraft von F = 845 kN. Berechnen Sie die Würfeldruckfestigkeit f_c,cube in N/mm² und prüfen Sie, ob die Belastungsgeschwindigkeit nach Norm eingehalten wurde, wenn die Laststeigerung bis zum Bruch 85 Sekunden dauerte.',
    moduleHint: { id: 'labor', name: 'Virtuelle Versuche (Druck)' },
    solution: '1. **Querschnittsfläche der Druckfläche ($A_c$):**\n   $$A_c = 150\\text{ mm} \\times 150\\text{ mm} = 22500\\text{ mm}^2$$\n2. **Berechnung der Würfeldruckfestigkeit ($f_{c,\\text{cube}}$):**\n   $$f_{c,\\text{cube}} = \\frac{F}{A_c} = \\frac{845000\\text{ N}}{22500\\text{ mm}^2} \\approx **37{,}56\\text{ N/mm}^2$$\n3. **Prüfung der Belastungsgeschwindigkeit:**\n   Nach DIN EN 12390-3 muss die Belastungsgeschwindigkeit $0{,}6 \\pm 0{,}2\\text{ MPa/s}$ betragen, also zwischen $0{,}4$ und $0{,}8\\text{ MPa/s}$ liegen.\n   Tatsächliche Spannungsrate:\n   $$\\dot{\\sigma} = \\frac{37{,}56\\text{ MPa}}{85\\text{ s}} \\approx 0{,}442\\text{ MPa/s}$$\n   Da $0{,}4 \\le 0{,}442 \\le 0{,}8\\text{ MPa/s}$, war die Belastungsgeschwindigkeit **normkonform** (wenn auch am unteren Rand).'
  },
  {
    id: 't_spaltzug_pruefung',
    difficulty: 'Mittel',
    title: 'Baustoffprüfung: Spaltzugfestigkeit am Zylinder nach DIN EN 12390-6',
    question: 'An einem Probezylinder (Durchmesser d = 150 mm, Länge L = 300 mm) wird die Spaltzugfestigkeit ermittelt. Die Bruchlast beträgt F = 215 kN. Berechnen Sie die Spaltzugfestigkeit f_ct,sp und schätzen Sie daraus die zentrische Zugfestigkeit f_ct ab.',
    moduleHint: { id: 'mechanische_pruefungen', name: 'Mechanische Prüfungen' },
    solution: '1. **Berechnung der Spaltzugfestigkeit ($f_{ct,sp}$):**\n   $$f_{ct,sp} = \\frac{2 \\cdot F}{\\pi \\cdot L \\cdot d} = \\frac{2 \\times 215000\\text{ N}}{\\pi \\times 300\\text{ mm} \\times 150\\text{ mm}} = \\frac{430000}{141372} \\approx **3{,}04\\text{ N/mm}^2$$\n2. **Abschätzung der zentrischen Zugfestigkeit ($f_{ct}$):**\n   Nach DIN EN 1992-1-1, 3.1.2(8) gilt der Umrechnungsfaktor $f_{ct} \\approx 0{,}90 \\cdot f_{ct,sp}$:\n   $$f_{ct} \\approx 0{,}90 \\times 3{,}04\\text{ N/mm}^2 \\approx **2{,}74\\text{ N/mm}^2$$'
  },
  {
    id: 't_bohrkern_umrechnung',
    difficulty: 'Schwer',
    title: 'Bauwerksuntersuchung: Bohrkern mit h/d = 1 auf Zylinderfestigkeit umrechnen',
    question: 'Aus einem Bauwerk wird ein zylindrischer Bohrkern mit Durchmesser d = 100 mm und Länge L = 100 mm (Schlankheit h/d = 1) entnommen. Die gemessene Bruchspannung beträgt f_core = 42,0 N/mm². Wie hoch ist die gleichwertige Zylinderdruckfestigkeit?',
    moduleHint: { id: 'probenahme', name: 'Probenahme & Bohrkerne' },
    solution: 'Bei kurzen Zylindern ($L/d = 1{,}0$) verhindert die Querdehnungsbehinderung durch die steifen Stahl-Druckplatten der Prüfmaschine ein vorzeitiges Versagen (Mehraxialer Spannungszustand an den Enden), sodass die gemessene Festigkeit künstlich überhöht ist.\n1. **Zuordnung nach DIN EN 13791:**\n   Ein Kern mit $h/d = 1$ entspricht der In-situ-**Würfel**festigkeit, ein Kern mit $h/d = 2$ der In-situ-**Zylinder**festigkeit. Für die Umrechnung Würfel → Zylinder wird das Verhältnis der Festigkeitsklassen nach DIN EN 206 genutzt, z. B. C30/37: $30/37 \\approx 0{,}81$; hier **$k \\approx 0{,}82$**.\n2. **Umgerechnete Zylinderdruckfestigkeit ($f_{c,\\text{cyl}}$):**\n   $$f_{c,\\text{cyl}} = 0{,}82 \\times 42{,}0\\text{ N/mm}^2 \\approx **34{,}4\\text{ N/mm}^2$$\n   Zum Vergleich: Der Literaturansatz nach ASTM C42 ($k = 0{,}87$) ergäbe $36{,}5\\text{ N/mm}^2$. Wird der Schlankheitseffekt übersehen, wird die Festigkeit im Bauwerk deutlich überschätzt.'
  },
  {
    id: 't_karbonatisierungstiefe_phenolphthalein',
    difficulty: 'Leicht',
    title: 'Analytik: Prüfung der Karbonatisierungstiefe mit Phenolphthalein',
    question: 'Wie funktioniert der Phenolphthalein-Farbindikatortest an einer frischen Betonbruchfläche und bei welchem pH-Umschlagspunkt schlägt die Farbe von farblos nach violett-rosa um?',
    moduleHint: { id: 'analytik', name: 'Analyseverfahren' },
    solution: 'Phenolphthaleinlösung (1 % in 70 % Ethanol) wird auf eine frisch aufgebrochene, staubfreie Betonoberfläche aufgesprüht.\n- **Unkarbonatisierter Beton:** Der pH-Wert liegt durch das gelöste Calciumhydroxid ($Ca(OH)_2$) bei $\\text{pH} > 12{,}5$. Der Indikator färbt sich intensiv **magenta-violett** (passiver Bewehrungsschutz intakt).\n- **Karbonatisierter Beton:** Durch Reaktion mit atmosphärischem $CO_2$ wurde das alkalische Hydroxid in neutrales Calciumcarbonat ($CaCO_3$) umgewandelt. Der pH-Wert sinkt unter ca. **9** (Umschlagsbereich des Phenolphthaleins etwa pH 8,2 bis 10). Die Zone bleibt **vollkommen farblos**.\nDer Abstand von der Bauteiloberfläche bis zur Farbgrenze ist die Karbonatisierungstiefe $d_k$ in mm (Prüfung nach DIN EN 14630).'
  },
  {
    id: 't_statistik_gauss',
    difficulty: 'Mittel',
    title: 'Statistik: 5%-Quantilwert & Charakteristische Druckfestigkeit',
    question: 'Aus einer Stichprobe von 15 Betonprüfwürfeln ergibt sich ein Mittelwert von f_cm = 38,2 N/mm² bei einer Standardabweichung von s = 3,6 N/mm². Berechnen Sie den charakteristischen Wert (5-%-Quantil) nach DIN EN 1990, Anhang D bei Annahme einer Normalverteilung; die Standardabweichung ist aus der Stichprobe geschätzt.',
    moduleHint: { id: 'statistik', name: 'Statistische Auswertung' },
    solution: 'Berechnung des charakteristischen Werts ($f_{ck}$):\n$$f_{ck} = f_{cm} - k_n \\cdot s$$\nDa $s$ aus nur 15 Werten geschätzt ist, gilt nach DIN EN 1990, Anhang D, Tab. D1 ($V_X$ unbekannt) $k_n \\approx 1{,}81$ (interpoliert zwischen $n = 10$: 1,92 und $n = 20$: 1,76):\n$$f_{ck} = 38{,}2 - 1{,}81 \\times 3{,}6 \\approx **31{,}7\\text{ N/mm}^2$$\nNur bei bekannter Standardabweichung der Grundgesamtheit dürfte mit $1{,}645$ gerechnet werden: $38{,}2 - 1{,}645 \\times 3{,}6 = 32{,}3\\text{ N/mm}^2$. Der Zuschlag berücksichtigt die Unsicherheit der Schätzung aus wenigen Proben.'
  }
];
