import { Task } from '../aufgabenData';

export const massivbauTasks: Task[] = [
  {
    id: 't7',
    difficulty: 'Schwer',
    title: 'Biegebemessung: Erforderliche Bewehrung nach EC2',
    question: 'Ein Einfeldträger (b=30cm, h=60cm, d1=5cm) aus C35/45 wird mit M_Ed = 450 kNm belastet. Berechnen Sie die erforderliche Zugbewehrung As. Ist eine Druckbewehrung nötig?',
    moduleHint: { id: 'biegebemessung', name: 'Biegebemessung (StB)' },
    solution: 'Berechnung nach Eurocode 2 (DIN EN 1992-1-1):\n1. **Nutzhöhe ($d$):** $d = h - d_1 = 60 - 5 = 55\\text{ cm} = 0{,}55\\text{ m}$.\n2. **Bemessungswert Betonfestigkeit ($f_{cd}$):** $f_{cd} = \\alpha_{cc} \\cdot f_{ck} / \\gamma_c = 0{,}85 \\times 35 / 1{,}5 = 19{,}83\\text{ N/mm}^2$ (bzw. $19830\\text{ kN/m}^2$).\n3. **Dimensionloses Biegemoment ($\\mu_{Ed}$):** $\\mu_{Ed} = \\frac{M_{Ed}}{b \\cdot d^2 \\cdot f_{cd}} = \\frac{450}{0{,}30 \\times 0{,}55^2 \\times 19830} \\approx 0{,}250$.\n4. **Bewehrungserfordernis:** Da $\\mu_{Ed} \\approx 0{,}250 < \\mu_{\\text{lim}} = 0{,}296$ (Duktilitätsgrenze), ist **keine Druckbewehrung** erforderlich. Einseitig bewehrter Querschnitt ist ausreichend.\n5. **Mechanischer Bewehrungsgrad ($\\omega$):** $\\omega = 1 - \\sqrt{1 - 2\\mu_{Ed}} = 1 - \\sqrt{1 - 2 \\times 0{,}250} \\approx 0{,}293$.\n6. **Erforderlicher Stahlquerschnitt ($A_s$):** Mit $f_{yd} = 500 / 1{,}15 = 434{,}8\\text{ N/mm}^2$: $A_s = \\omega \\cdot b \\cdot d \\cdot \\frac{f_{cd}}{f_{yd}} = 0{,}293 \\times 30\\text{ cm} \\times 55\\text{ cm} \\times \\frac{19{,}83}{434{,}8} \\approx **22{,}0\\text{ cm}^2**$.'
  },
  {
    id: 't8',
    difficulty: 'Schwer',
    title: 'Querkraftbemessung: Fachwerkmodell & Bügelabstand',
    question: 'Für den gleichen Träger (b=30cm, h=60cm) wirkt eine Querkraft V_Ed = 550 kN. Gewählt wird ein Druckstrebenwinkel von 30°. Wie groß ist die erforderliche Bügelbewehrung asw?',
    moduleHint: { id: 'querkraftbemessung', name: 'Querkraftbemessung (StB)' },
    solution: 'Berechnung nach DIN EN 1992-1-1 mit NA (DE), 6.2.3:\n1. **Hebelarm innerer Kräfte ($z$):** Nach NA DE, NCI zu 6.2.3(1) gilt $z = \\min(0{,}9 \\cdot d;\\ \\max(d - c_{v,l} - 30\\text{ mm};\\ d - 2 \\cdot c_{v,l}))$. Mit $d = 55\\text{ cm}$ und $c_{v,l} = 3{,}5\\text{ cm}$ (Standardwert des Rechners): $0{,}9 \\cdot 55 = 49{,}5\\text{ cm}$; $\\max(55 - 3{,}5 - 3;\\ 55 - 7) = 48{,}5\\text{ cm}$ → **$z = 48{,}5\\text{ cm}$** (maßgebend $d - c_{v,l} - 30\\text{ mm}$).\n2. **Bügelquerschnittsfläche pro Meter ($a_{sw}$):** $a_{sw} = \\frac{V_{Ed}}{z \\cdot f_{yd} \\cdot \\cot(\\theta)}$. Mit $\\theta = 30^\\circ$ ($\\cot(30^\\circ) \\approx 1{,}732$), $f_{yd} = 43{,}48\\text{ kN/cm}^2$ und $V_{Ed} = 550\\text{ kN}$:\n$a_{sw} = \\frac{550}{48{,}5\\text{ cm} \\times 43{,}48\\text{ kN/cm}^2 \\times 1{,}732} \\approx 0{,}1506\\text{ cm}^2/\\text{cm} = **15{,}1\\text{ cm}^2/\\text{m}**$.\n3. **Zulässigkeit von $\\theta$ (Gl. 6.7aDE):** $V_{Rd,cc} = 0{,}5 \\cdot 0{,}48 \\cdot 35^{1/3} \\cdot 0{,}30 \\cdot 0{,}485 = 114{,}2\\text{ kN}$ → $\\cot\\theta \\le 1{,}2/(1 - 114{,}2/550) = 1{,}51$, also $\\theta \\ge 33{,}4^\\circ$. Der gewählte Winkel von 30° ist hier nicht zulässig; mit $\\cot\\theta = 1{,}51$ folgt $a_{sw} \\approx **17{,}2\\text{ cm}^2/\\text{m}**$ (so rechnet auch der Rechner).\nDas entspricht z.B. zweischnittigen Bügeln $\\varnothing 10$ im Abstand von $9\\text{ cm}$ ($a_{sw} = 2 \\times 0{,}785 \\times 100/9 = 17{,}4\\text{ cm}^2/\\text{m}$).'
  },
  {
    id: 't_nichtmetallisch',
    difficulty: 'Schwer',
    title: 'Biegebemessung: Nichtmetallische Bewehrung (Carbon/CFK)',
    question: 'Wie ändert sich die erforderliche Bewehrungsfläche, wenn statt B500 Stahl eine Carbonbewehrung (Zugfestigkeit 3000 MPa, Teilsicherheitsbeiwert 1,3) verwendet wird?',
    moduleHint: { id: 'carbonbeton', name: 'Carbonbeton' },
    solution: 'Die Bemessungsfestigkeit $f_{td}$ der hochfesten Carbonstäbe beträgt $f_{td} = 3000 / 1{,}3 \\approx 2307\\text{ MPa}$ gegenüber $f_{yd} = 435\\text{ MPa}$ für Betonstahl.\nDurch den etwa $5{,}3$-fachen Bemessungswert der Zugfestigkeit verringert sich die erforderliche rechnerische Querschnittsfläche unter reinem Zugtragfähigkeitsaspekt rein theoretisch drastisch von $22{,}0\\text{ cm}^2$ auf ca. $4{,}1\\text{ cm}^2$ ($A_s \\approx 22{,}0 \\times 435 / 2307$). Allerdings verhalten sich Carbonstäbe ideal-elastisch bis zum Bruch ohne Fließen (sprödes Versagen), weshalb nach Normen (z.B. DAfStb-Richtlinie Carbonbeton) zusätzliche Nachweise im Grenzzustand der Gebrauchstauglichkeit (GZG) und Mindestbewehrungen maßgebend sind.'
  },
  {
    id: 't9',
    difficulty: 'Schwer',
    title: 'Rissbreitenbegrenzung: Zwang & Grenzdurchmesser',
    question: 'Eine 30 cm dicke WU-Bodenplatte (C30/37) erfährt frühen Zwang durch abfließende Hydratationswärme. Die geforderte Rissbreite ist w_k = 0,2 mm. Welcher maximale Stabdurchmesser darf bei einer Stahlspannung von 240 MPa verwendet werden?',
    moduleHint: { id: 'rissbreite', name: 'Rissbreite' },
    solution: 'Berechnung nach DIN EN 1992-1-1 (EC2) zur Rissbreitenbegrenzung ohne direkte Berechnung:\nBei einer zulässigen Rissbreite $w_k = 0{,}2\\text{ mm}$ und einer berechneten Stahlspannung im Riss von $\\sigma_s = 240\\text{ MPa}$ beträgt der gemäß Tabelle 7.2N zulässige maximale Stabdurchmesser $d_s^*$:\n$d_s^* = d_s \\cdot \\frac{2{,}9}{f_{\\text{ct,eff}}} \\approx 12\\text{ bis } 14\\text{ mm}$ (bei standardmäßigem $f_{\\text{ct,eff}} \\approx 2{,}9\\text{ N/mm}^2$ der Betonfestigkeitsklasse C30/37 im jungen Alter). Ist der Durchmesser größer, können die Zugkräfte nicht fein genug verteilt werden und Risse klappen weiter auf.'
  },
  {
    id: 't10',
    difficulty: 'Mittel',
    title: 'Kriechen & Schwinden: Zeitabhängiger Spannkraftverlust',
    question: 'Ein Spannbetonbinder wird im Alter von 7 Tagen vorgespannt. Wie hoch ist die Kriechzahl nach 50 Jahren bei 50% relativer Luftfeuchte im Vergleich zu 80%?',
    moduleHint: { id: 'kriechen', name: 'Kriechen, Schwinden & Relaxation' },
    solution: 'Berechnung nach Eurocode 2:\nDie Kriechzahl $\\varphi(t,t_0)$ setzt sich aus einem Grundkriechbeiwert (inneres Kriechen der CSH-Gele) und einem Trocknungskriechbeiwert (Umgebungsfeuchteabhängigkeit) zusammen. Eine Abnahme der relativen Luftfeuchtigkeit von $80\\%$ (sehr feuchte Hallenluft oder Außenklima, $\\varphi \\approx 1{,}83$) auf $50\\%$ (trockenes Innenraumklima, $\\varphi \\approx 2{,}75$) steigert die Kriechverformung um circa $50\\%$. Das führt zu gesteigertem Schwinden und einem signifikant höheren zeitabhängigen Spannkraftverlust im Spannstahl.'
  },
  {
    id: 't12',
    difficulty: 'Mittel',
    title: 'WU-Bauwerke: Mindestdicke & hydraulisches Druckgefälle',
    question: 'Ein Kellergeschoss steht 3,5 m im Grundwasser. Die Wanddicke beträgt 24 cm. Ist das Druckgefälle zulässig und die Mindestdicke nach WU-Richtlinie eingehalten?',
    moduleHint: { id: 'wu-bauwerke', name: 'WU-Bauwerke' },
    solution: 'Die Berechnung erfolgt gemäß DAfStb WU-Richtlinie:\n1. **Druckgefälle ($I$):** $I = \\frac{h_w}{h} = \\frac{3{,}5}{0{,}24} = 14{,}58$.\n2. **Kritischer Grenzwert des Druckgefälles:** Da $I > 10$ ist, fordert die WU-Richtlinie eine verschärfte Begrenzung der Rissbreite auf $w_k \\le 0{,}15\\text{ mm}$ (statt standardmäßig $0{,}20\\text{ mm}$) zur Gewährleistung der hydraulischen Dichtigkeit durch Selbstheilung.\n3. **Mindestdicke:** Für eine Ortbetonwand der Beanspruchungsklasse 1 beträgt die normative Mindestdicke gemäß WU-Richtlinie für Normalbeton $h_{\\text{min}} = 24\\text{ cm}$. Die Wand erfüllt die normative Mindestgeometrie, muss jedoch rissbreitenbegrenzend auf $w_k \\le 0{,}15\\text{ mm}$ bewehrt werden.'
  },
  {
    id: 't_zwang',
    difficulty: 'Schwer',
    title: 'Zwang: Zentrischer Zwang & Dehnungsbehinderung',
    question: 'Eine 20 m lange Stahlbetonwand kühlt nach der Hydratation um 15 Kelvin ab. Sie ist am Fundament starr eingespannt (zentrischer Zwang). Wie groß ist die rechnerische Dehnungsbehinderung?',
    moduleHint: { id: 'zwang', name: 'Zwang' },
    solution: 'Berechnung nach bauphysikalisch-statischen Grundlagen:\n1. **Thermisches Dehnungsverhalten ($\\alpha_T$):** Der thermische Ausdehnungskoeffizient von Beton liegt standardmäßig bei $\\alpha_T \\approx 10^{-5}\\text{ K}^{-1}$.\n2. **Freie Wärmedehnung ($\\varepsilon_{\\text{th}}$):** $\\varepsilon_{\\text{th}} = \\alpha_T \\cdot \\Delta T = 10^{-5}\\text{ K}^{-1} \\times 15\\text{ K} = 1{,}5 \\cdot 10^{-4} = 0{,}15\\text{ mm/m}$.\n3. **Dehnungsbehinderung:** Da die Einspannung starr ist (Verhinderungsfaktor $r = 1{,}0$), wird diese Dehnung zu $100\\%$ blockiert. Dies erzeugt rechnerische Zwangs-Zugspannungen $\\sigma_a = \\varepsilon_{\\text{th}} \\cdot E_c$. Bei $E_c = 33000\\text{ N/mm}^2$: $\\sigma_a = 0{,}15 \\cdot 10^{-3} \\times 33000 = 4{,}95\\text{ N/mm}^2$. Da dies über der Betonzugfestigkeit ($f_{\\text{ctm}} \\approx 2{,}5-3{,}0\\text{ N/mm}^2$) liegt, reißt der Beton, was eine Mindestbewehrung erfordert.'
  },
  {
    id: 't_durchstanzen',
    difficulty: 'Schwer',
    title: 'Durchstanzen: Kritischer Rundschnitt u1 nach Eurocode 2',
    question: 'Eine innenliegende Flachdecke (d = 20 cm) lagert auf einer runden Stütze (Durchmesser c = 30 cm). In welchem Abstand von der Stützenkante befindet sich der kritische Rundschnitt für den Durchstanznachweis?',
    moduleHint: { id: 'durchstanzen', name: 'Durchstanzen' },
    solution: 'Nach Eurocode 2 (DIN EN 1992-1-1) liegt der kritische Rundschnitt $u_1$ im Abstand von $2{,}0 \\cdot d$ von der Stützenkante. Das entspricht hier $2{,}0 \\times 20\\text{ cm} = 40\\text{ cm}$. Der Radius des Rundschnitts ist somit $r = c/2 + 2d = 15 + 40 = 55\\text{ cm}$, und der Umfang beträgt $u_1 = 2 \\pi r = 2 \\times \\pi \\times 55 \\approx 345{,}6\\text{ cm}$.'
  },
  {
    id: 't_verankerung',
    difficulty: 'Mittel',
    title: 'Verankerungslänge: Alpha-Beiwerte nach DIN EN 1992-1-1',
    question: 'Warum darf das statisch erforderliche Grundmaß der Verankerungslänge durch sogenannte Alpha-Werte (α1, α2, α3...) abgemindert werden?',
    moduleHint: { id: 'verankerungslaenge', name: 'Verankerungslänge' },
    solution: 'Die Alpha-Werte berücksichtigen günstige geometrische und mechanische Einflussfaktoren: $\\alpha_1$ berücksichtigt die Stabendform (z.B. Winkelhaken oder Schlaufen, die Formschluss liefern), $\\alpha_2$ den Einfluss einer dicken Mindestbetondeckung gegen Längsspaltung, $\\alpha_3$ die Umschnürung durch Querbewehrung, und $\\alpha_5$ den Einfluss von Querdruck senkrecht zur Verankerungsebene. Das Produkt $(\\alpha_1 \\cdot \\alpha_2 \\cdot \\alpha_3 \\cdot \\alpha_4 \\cdot \\alpha_5)$ darf minimal $0{,}7$ betragen.'
  },
  {
    id: 't_stuetzen',
    difficulty: 'Mittel',
    title: 'Stützenbemessung: Knicklänge & Theorie II. Ordnung',
    question: 'Eine Stahlbetonstütze (L=3,0 m) befindet sich im Erdgeschoss eines ausgesteiften Gebäudes (oben und unten unverschieblich eingespannt). Wie groß ist die Knicklänge l0 für die Berechnung nach Theorie II. Ordnung näherungsweise?',
    moduleHint: { id: 'stuetzenbemessung', name: 'Stützenbemessung' },
    solution: 'In einem ausgesteiften (knotenunverschieblichen) Tragwerk mit monolithischen Deckenanschlüssen oben und unten liegt näherungsweise der Euler-Fall 4 mit elastischer Teileinspannung vor. Die wirksame Knicklänge $l_0$ beträgt typischerweise $l_0 = 0{,}7 \\cdot L = 0{,}7 \\times 3{,}0\\text{ m} = 2{,}1\\text{ m}$. Bei dieser Knicklänge werden anschließend geometrische Imperfektionen ($e_0$) und Verformungen nach Theorie II. Ordnung berechnet.'
  },
  {
    id: 't_spannbeton',
    difficulty: 'Mittel',
    title: 'Spannbeton: Umlenkkräfte parabolisch geführter Spannglieder',
    question: 'Spannglieder in Spannbetonbrücken werden oft nicht gerade, sondern parabolisch gekrümmt geführt. Welchen statischen Vorteil hat diese Linienführung?',
    moduleHint: { id: 'spannbeton_grundlagen', name: 'Spannbeton: Grundlagen' },
    solution: 'Ein gekrümmtes Spannglied erzeugt aus der aufgebrachten Zugkraft $P$ eine stetige Umlenkkraft $u = \\frac{8 f P}{L^2}$ radial in Richtung Krümmungsmittelpunkt. Bei einem nach unten durchhängenden Spannglied wirken diese Umlenkkräfte als kontinuierliche Flächenlast nach oben. Sie wirken somit den Schwerkraftlasten (Eigengewicht $g$) entgegen (Lastkompensation) und reduzieren Feldmomente und Durchbiegungen drastisch.'
  },
  {
    id: 't_spannung_zustand1_2',
    difficulty: 'Schwer',
    title: 'Spannungszustände: Zustand I vs. Zustand II',
    question: 'Ein Rechteckbalken (b=25cm, h=50cm, d=45cm, As=10cm²) aus C25/30 (fctm=2,6 N/mm², Ecm=31000 N/mm²) wird auf Biegung beansprucht. Berechnen Sie das Rissmoment M_cr, bei dem der Übergang von Zustand I (elastisch ungerissen) zu Zustand II (gerissen) stattfindet.',
    moduleHint: { id: 'spannung', name: 'Spannung & Dehnungszustände' },
    solution: '1. **Widerstandsmoment des ungerissenen Bruttoquerschnitts (Zustand I):**\n   $$W_c = \\frac{b \\cdot h^2}{6} = \\frac{25 \\cdot 50^2}{6} = \\frac{62500}{6} \\approx 10417\\text{ cm}^3 = 10{,}417 \\cdot 10^{-3}\\text{ m}^3$$\n2. **Rissmoment ($M_{\\text{cr}}$):** Rissbildung tritt ein, sobald die Randzugspannung die Biegezugfestigkeit des Betons ($f_{\\text{ctm,fl}} \\approx f_{\\text{ctm}}$) erreicht:\n   $$M_{\\text{cr}} = W_c \\cdot f_{\\text{ctm}} = 10{,}417 \\cdot 10^{-3}\\text{ m}^3 \\times 2{,}6 \\cdot 10^3\\text{ kN/m}^2 \\approx **27{,}08\\text{ kNm}**$$\n   Unterhalb von 27,1 kNm bleibt der Querschnitt voll wirksam im Zustand I. Oberhalb von 27,1 kNm reißt die Betonzugzone auf, die Nulllinie wandert nach oben und die Zugkraft wird im Zustand II vom Bewehrungsstahl aufgenommen.'
  },
  {
    id: 't_stahlbeton_verbund',
    difficulty: 'Leicht',
    title: 'Stahlbeton-Grundlagen: Verbundmechanismen',
    question: 'Welche drei physikalischen Mechanismen übertragen die Kräfte zwischen Betonstahl und umgebendem Beton?',
    moduleHint: { id: 'stahlbeton_info', name: 'Massivbau Überblick' },
    solution: 'Die drei Verbundmechanismen sind:\n1. **Adhäsion (Haftverbund):** Chemisch-physikalische Anhaftung des Zementsteins an der Stahloberfläche (wirksam nur bei minimalen Verschiebungen).\n2. **Friktion (Reibungsverbund):** Reibung zwischen Stahl und Beton unter Querdruck bei beginnendem Schlupf.\n3. **Scherverbund (Formschluss):** Übertragung von Längskräften über die Rippen des gerippten Betonstahls (B500B) durch Mikrodruckstreben im Beton, was den weitaus größten Traganteil bildet.'
  },
  {
    id: 't_stahlbeton_querkraft_vrdc',
    difficulty: 'Schwer',
    title: 'Massivbau: Querkrafttragfähigkeit ohne Schubbewehrung (V_Rd,c) nach DIN EN 1992-1-1',
    question: 'Eine einfeldrige Stahlbetondecke (Dicke h = 22 cm, statische Nutzhöhe d = 19 cm, Streifenbreite b_w = 1,0 m) aus Beton C30/37 (f_ck = 30 N/mm²) ist mit einer Längsbewehrung von A_s1 = 7,85 cm²/m bewehrt. Normalspannungen aus Längskräften liegen nicht vor (\\sigma_cp = 0).\n\na) Berechnen Sie den Längsbewehrungsgrad \\rho_l und den Maßstabsbeiwert k.\nb) Berechnen Sie die Querkrafttragfähigkeit V_Rd,c pro Meter Deckenbreite nach DIN EN 1992-1-1 (mit C_Rd,c = 0,15/\\gamma_C für den nationalen Anhang NA Deutschland, \\gamma_C = 1,5).\nc) Welcher Mindestwert v_min gilt?',
    moduleHint: { id: 'querkraftbemessung', name: 'Massivbau: Querkraftbemessung' },
    solution: 'Berechnung nach DIN EN 1992-1-1 (EC2) Abs. 6.2.2 mit NA Deutschland:\n1. **Maßstabsbeiwert ($k$):**\n   $$k = 1 + \\sqrt{\\frac{200}{d\\text{ [mm]}}} = 1 + \\sqrt{\\frac{200}{190}} = 1 + 1{,}026 = 2{,}026 \\le 2{,}0 \\rightarrow **k = 2{,}0**$$\n2. **Längsbewehrungsgrad ($\\rho_l$):**\n   $$\\rho_l = \\frac{A_{s1}}{b_w \\cdot d} = \\frac{7{,}85\\text{ cm}^2}{100\\text{ cm} \\times 19\\text{ cm}} = \\frac{785\\text{ mm}^2}{1000 \\times 190\\text{ mm}^2} \\approx 0{,}00413 = **0{,}413\\% \\le 0{,}02**$$\n3. **Berechnung von $V_{Rd,c}$ nach NA Deutschland:**\n   Mit $C_{Rd,c} = 0{,}15 / 1{,}5 = 0{,}10$:\n   $$v_{Rd,c} = C_{Rd,c} \\cdot k \\cdot (100 \\cdot \\rho_l \\cdot f_{ck})^{1/3} = 0{,}10 \\times 2{,}0 \\times (100 \\times 0{,}00413 \\times 30)^{1/3}$$\n   $$v_{Rd,c} = 0{,}20 \\times (12{,}39)^{1/3} = 0{,}20 \\times 2{,}314 = 0{,}463\\text{ N/mm}^2$$\n4. **Mindestwert ($v_{\\text{min}}$):**\n   $$v_{\\text{min}} = 0{,}0525 / \\gamma_c \\cdot k^{3/2} \\cdot f_{ck}^{1/2} = \\frac{0{,}0525}{1{,}5} \\cdot 2{,}0^{1{,}5} \\cdot \\sqrt{30} = 0{,}035 \\times 2{,}828 \\times 5{,}477 = 0{,}542\\text{ N/mm}^2$$\n   Da $v_{\\text{min}} = 0{,}542 > v_{Rd,c} = 0{,}463$, ist der Mindestwert maßgebend!\n5. **Querkrafttragfähigkeit der Decke:**\n   $$V_{Rd,c} = v_{\\text{min}} \\cdot b_w \\cdot d = 0{,}542\\text{ N/mm}^2 \\times 1000\\text{ mm} \\times 190\\text{ mm} = 102\\,980\\text{ N} = **103{,}0\\text{ kN/m}**$$\n   Bis zu einer Querkrafteinwirkung von $V_{Ed} \\le 103{,}0\\text{ kN/m}$ ist keine Querkraftbewehrung (Bügel) erforderlich.'
  }
];
