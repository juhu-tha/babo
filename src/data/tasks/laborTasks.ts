import { Task } from '../aufgabenData';

export const laborTasks: Task[] = [
  {
    id: 't_druckfestigkeit_pruefung',
    difficulty: 'Mittel',
    title: 'Baustoffprüfung: Druckfestigkeitsprüfung am Betonwürfel nach DIN EN 12390-3',
    question: 'Ein Betonwürfel mit der Kantenlänge a = 150 mm bricht bei einer Höchstkraft von F = 845 kN. Berechnen Sie die Würfeldruckfestigkeit f_c,cube in N/mm² und prüfe, ob die Belastungsgeschwindigkeit nach Norm eingehalten wurde, wenn der Versuch 85 Sekunden dauerte.',
    moduleHint: { id: 'labor', name: 'Virtuelle Versuche (Druck)' },
    solution: '1. **Querschnittsfläche der Druckfläche ($A_c$):**\n   $$A_c = 150\\text{ mm} \\times 150\\text{ mm} = 22500\\text{ mm}^2$$\n2. **Berechnung der Würfeldruckfestigkeit ($f_{c,\\text{cube}}$):**\n   $$f_{c,\\text{cube}} = \\frac{F}{A_c} = \\frac{845000\\text{ N}}{22500\\text{ mm}^2} \\approx **37.56\\text{ N/mm}^2$$\n3. **Prüfung der Belastungsgeschwindigkeit:**\n   Nach DIN EN 12390-3 muss die Spannungsanstiegsgeschwindigkeit zwischen $0.2$ und $1.0\\text{ MPa/s}$ (Standard $0.6\\text{ MPa/s}$) liegen.\n   Tatsächliche Spannungsrate:\n   $$\\dot{\\sigma} = \\frac{37.56\\text{ MPa}}{85\\text{ s}} \\approx 0.442\\text{ MPa/s}$$\n   Da $0.2 \\le 0.442 \\le 1.0\\text{ MPa/s}$, war die Belastungsgeschwindigkeit vollkommen **normkonform**.'
  },
  {
    id: 't_spaltzug_pruefung',
    difficulty: 'Mittel',
    title: 'Baustoffprüfung: Spaltzugfestigkeit am Zylinder nach DIN EN 12390-6',
    question: 'An einem Probezylinder (Durchmesser d = 150 mm, Länge L = 300 mm) wird die Spaltzugfestigkeit ermittelt. Die Bruchlast beträgt F = 215 kN. Berechnen Sie die Spaltzugfestigkeit f_ct,sp und schätzen Sie daraus die zentrische Axialzugfestigkeit f_ct ab.',
    moduleHint: { id: 'mechanische_pruefungen', name: 'Mechanische Prüfungen' },
    solution: '1. **Berechnung der Spaltzugfestigkeit ($f_{ct,sp}$):**\n   $$f_{ct,sp} = \\frac{2 \\cdot F}{\\pi \\cdot L \\cdot d} = \\frac{2 \\times 215000\\text{ N}}{\\pi \\times 300\\text{ mm} \\times 150\\text{ mm}} = \\frac{430000}{141372} \\approx **3.04\\text{ N/mm}^2$$\n2. **Abschätzung der reinen Axialzugfestigkeit ($f_{ct}$):**\n   Nach Eurocode 2 (DIN EN 1992-1-1) gilt der empirische Umrechnungsfaktor $f_{ct} \\approx 0.90 \\cdot f_{ct,sp}$:\n   $$f_{ct} \\approx 0.90 \\times 3.04\\text{ N/mm}^2 \\approx **2.74\\text{ N/mm}^2$$'
  },
  {
    id: 't_bohrkern_umrechnung',
    difficulty: 'Schwer',
    title: 'Bauwerksuntersuchung: Bohrkernentnahme & Schlankheitskorrektur nach DIN EN 12504-1',
    question: 'Aus einem Bauwerk wird ein zylindrischer Bohrkern mit Durchmesser d = 100 mm und Länge L = 100 mm (Schlankheit L/d = 1.0) entnommen. Die gemessene Bruchspannung beträgt f_is = 42.0 N/mm². Wie hoch ist die auf die Normalschlankheit (L/d = 2.0 bzw. Standard-Zylinder) umgerechnete Festigkeit?',
    moduleHint: { id: 'probenahme', name: 'Probenahme & Bohrkerne' },
    solution: 'Bei kurzen Zylindern ($L/d = 1.0$) verhindert die Querdehnungsbehinderung durch die steifen Stahl-Druckplatten der Prüfmaschine ein vorzeitiges Versagen (Mehraxialer Spannungszustand an den Enden), sodass die gemessene Festigkeit künstlich überhöht ist.\n1. **Schlankheitskorrekturfaktor ($k$ nach DIN EN 13791 / DIN EN 12504-1):**\n   Für $L/d = 1.0$ (Würfel-äquivalent) im Vergleich zu $L/d = 2.0$ (Zylinder-äquivalent) beträgt der Reduktionsbeiwert typischerweise **$k \\approx 0.82$** (bzw. $1 / 1.22$).\n2. **Umgerechnete Zylinderdruckfestigkeit ($f_{c,\\text{cyl}}$):**\n   $$f_{c,\\text{cyl}} = 0.82 \\times 42.0\\text{ N/mm}^2 \\approx **34.4\\text{ N/mm}^2$$\n   Wird dieser Schlankheitseffekt übersehen, wird die Tragfähigkeit des Bauwerks drastisch überschätzt!'
  },
  {
    id: 't_karbonatisierungstiefe_phenolphthalein',
    difficulty: 'Leicht',
    title: 'Analytik: Prüfung der Karbonatisierungstiefe mit Phenolphthalein',
    question: 'Wie funktioniert der Phenolphthalein-Farbindikatortest an einer frischen Betonbruchfläche und bei welchem pH-Umschlagspunkt schlägt die Farbe von farblos nach violett-rosa um?',
    moduleHint: { id: 'analytik', name: 'Analyseverfahren' },
    solution: 'Phenolphthaleinlösung (1 % in 70 % Ethanol) wird auf eine frisch aufgebrochene, staubfreie Betonoberfläche aufgesprüht.\n- **Unkarbonatisierter Beton:** Der pH-Wert liegt durch das gelöste Calciumhydroxid ($Ca(OH)_2$) bei $\\text{pH} > 12.5$. Der Indikator färbt sich intensiv **magenta-violett** (passiver Bewehrungsschutz intakt).\n- **Karbonatisierter Beton:** Durch Reaktion mit atmosphärischem $CO_2$ wurde das alkalische Hydroxid in neutrales Calciumcarbonat ($CaCO_3$) umgewandelt. Der pH-Wert sinkt unter ca. **8.5 bis 9.0** (Umschlagspunkt des Phenolphthaleins). Die Zone bleibt **vollkommen farblos**.\nDer Abstand von der Bauteilaußenkante bis zur violetten Farbgrenze ist die messbare Karbonatisierungstiefe $d_k$ in mm.'
  },
  {
    id: 't_statistik_gauss',
    difficulty: 'Mittel',
    title: 'Statistik: 5%-Quantilwert & Charakteristische Druckfestigkeit',
    question: 'Aus einer Stichprobe von 15 Betonprüfwürfeln ergibt sich ein Mittelwert von f_cm = 38.2 N/mm² bei einer Standardabweichung von s = 3.6 N/mm². Berechnen Sie den 5%-Quantilwert nach DIN EN 1990 bei Annahme einer Normalverteilung (k_n = 1.645).',
    moduleHint: { id: 'statistik', name: 'Statistische Auswertung' },
    solution: 'Berechnung des charakteristischen 5%-Fraktilwerts ($f_{ck}$):\n$$f_{ck} = f_{cm} - k_n \\cdot s$$\nMit $f_{cm} = 38.2\\text{ N/mm}^2$, $s = 3.6\\text{ N/mm}^2$ und $k_n = 1.645$ (einseitiges 5%-Fraktil bei bekanntem bzw. großem Stichprobenumfang):\n$$f_{ck} = 38.2 - 1.645 \\times 3.6 = 38.2 - 5.922 \\approx **32.28\\text{ N/mm}^2$$\nDas bedeutet: Statistisch gesehen unterschreiten nur $5\\%$ aller Bauteile den Wert von $32.3\\text{ N/mm}^2$.'
  }
];
