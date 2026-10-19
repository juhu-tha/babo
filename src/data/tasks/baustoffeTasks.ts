import { Task } from '../aufgabenData';

export const baustoffeTasks: Task[] = [
  {
    id: 't_stahlbau',
    difficulty: 'Schwer',
    title: 'Stahl: Profilbemessung auf Biegung nach DIN EN 1993-1-1',
    question: 'Ein Stahlträger (S235) muss ein Biegemoment von M_Ed = 150 kNm aufnehmen. Welches IPE-Profil ist mindestens erforderlich (Querschnittsklasse 1/2, Teilsicherheitsbeiwert \\gamma_M0 = 1.0)?',
    moduleHint: { id: 'stahl', name: 'Stahl' },
    solution: 'Bemessungsverfahren für statischen Biegetraglastnachweis:\n1. **Bemessungsfestigkeit ($f_{yd}$):** Für Baustahl S235 gilt $f_{yd} = f_y / \\gamma_{M0} = 235\\text{ N/mm}^2 / 1{,}0 = 23{,}5\\text{ kN/cm}^2$.\n2. **Erforderliches elastisches Widerstandsmoment ($W_{el,y}$):**\n$$W_{\\text{erf}} = \\frac{M_{Ed}}{f_{yd}} = \\frac{150\\text{ kNm}}{23{,}5\\text{ kN/cm}^2} = \\frac{15000\\text{ kNcm}}{23{,}5\\text{ kN/cm}^2} \\approx **638{,}3\\text{ cm}^3**$$\n3. **Profilauswahl (IPE-Reihe):**\n- IPE 300: $W_y = 557\\text{ cm}^3$ (nicht ausreichend).\n- IPE 330: $W_y = 713\\text{ cm}^3$ (ausreichend, da $713\\text{ cm}^3 \\ge 638{,}3\\text{ cm}^3$).\nMindestens zu wählen ist somit ein **IPE 330**.'
  },
  {
    id: 't13',
    difficulty: 'Mittel',
    title: 'Holz: Feuchtedehnung & Quellmaße',
    question: 'Ein Brettschichtholzträger (L=12m) wird im Winter bei 10% Holzfeuchte eingebaut. Im Herbst steigt die Feuchte auf 16%. Um wie viele Millimeter verlängert sich der Träger parallel zur Faser?',
    moduleHint: { id: 'holz', name: 'Holz' },
    solution: 'Berechnung dehnungsbedingter Schwind- und Quellmaße von Nadelholz:\n1. **Änderung Holzfeuchte ($\\Delta w$):** $\\Delta w = 16\\% - 10\\% = 6\\%$.\n2. **Differentielles Quellmaß parallel zur Faser ($\\alpha_{||}$):** Für Fichte/Tanne gilt $\\alpha_{||} \\approx 0{,}01\\% = 0{,}0001$ pro $1\\%$ Holzfeuchteänderung.\n3. **Dehnungsberechnung ($\\Delta L$):**\n$$\\Delta L = L \\cdot \\alpha_{||} \\cdot \\Delta w = 12000\\text{ mm} \\times 0{,}0001 \\times 6 = **7{,}2\\text{ mm}**$$\nHinweis: Quer zur Faserrichtung (radial/tangential) wäre die Quellung um den Faktor 20–30 ausgeprägter.'
  },
  {
    id: 't14',
    difficulty: 'Mittel',
    title: 'Mauerwerk: Druckfestigkeit nach Eurocode 6',
    question: 'Eine Wand wird aus Kalksandstein (SFK 20) und Normalmörtel (MG IIa / M5) gemauert. Wie hoch ist der charakteristische Wert der Druckfestigkeit f_k des Mauerwerks?',
    moduleHint: { id: 'mauerwerk', name: 'Mauerwerk' },
    solution: 'Bemessung nach Eurocode 6 / DIN EN 1996-1-1:\n$$f_k = K \\cdot f_b^{0{,}7} \\cdot f_m^{0{,}3} \\quad [\\text{MPa}]$$\nMit Vollstein-Gruppenbeiwert $K = 0{,}55$, Stein-Druckfestigkeit $f_b = 20\\text{ MPa}$ und Mörtel-Druckfestigkeit $f_m = 5\\text{ MPa}$:\n$$f_k = 0{,}55 \\times 20^{0{,}7} \\times 5^{0{,}3} \\approx 0{,}55 \\times 8{,}14 \\times 1{,}62 \\approx **7{,}25\\text{ MPa}**$$'
  },
  {
    id: 't15',
    difficulty: 'Mittel',
    title: 'Glas: Bruchverhalten & Sicherheitsanforderungen',
    question: 'Warum wird für Überkopfverglasungen Verbundsicherheitsglas (VSG) aus Teilvorgespanntem Glas (TVG) und nicht aus Einscheibensicherheitsglas (ESG) verwendet?',
    moduleHint: { id: 'glas', name: 'Glas' },
    solution: 'ESG besitzt eine sehr hohe Eigenspannung und zerfällt bei Bruch schlagartig in kleine, lose Krümel. Bei einer Überkopfverglasung würde die gesamte Scheibe sofort in sich zusammenfallen (keine Resttragfähigkeit). TVG bricht dagegen in großflächige Schollen, die sich in der PVB-Folie des VSG verkrallen und eine stabile Resttragfähigkeit bieten, sodass Personen unter der Verglasung geschützt sind.'
  },
  {
    id: 't_gips_chemie',
    difficulty: 'Mittel',
    title: 'Gips: Phasenumwandlung & Abbindereaktion',
    question: 'Welche chemische Reaktion läuft beim Anrühren von Baugips (Calciumsulfat-Halbhydrat) mit Wasser ab und warum dehnt sich Gips beim Erstarren leicht aus (ca. 0,5–1,0 %)?',
    moduleHint: { id: 'gips', name: 'Gips & Calciumsulfat' },
    solution: '1. **Chemische Reaktionsgleichung:**\n   $$\\text{CaSO}_4 \\cdot 0{,}5\\,\\text{H}_2\\text{O} + 1{,}5\\,\\text{H}_2\\text{O} \\longrightarrow \\text{CaSO}_4 \\cdot 2\\,\\text{H}_2\\text{O} + \\text{Wärme}$$\n   Das Halbhydrat löst sich im Anmachwasser, und das schwerer lösliche Calciumsulfat-Dihydrat kristallisiert in Form von nadelförmigen Gipskristallen aus.\n2. **Volumendehnung (Kristallwachstum):**\n   Obwohl das theoretische Molvolumen von Halbhydrat + Wasser größer ist als das von Dihydrat (theoretische chemische Kontraktion), verfilzen die wachsenden Kristallnadeln mechanisch miteinander und drücken sich gegenseitig auseinander. Dies führt zu einer makroskopischen Volumenzunahme von **0,5 bis 1,0 %**. Diese Eigenschaft ist ideal für formgetreue Stuckabgüsse und dichten Fugenschluss, verbietet aber den Einsatz in feuchten Außenbereichen, da Gips wasserlöslich ist.'
  },
  {
    id: 't_kalk_kreislauf',
    difficulty: 'Mittel',
    title: 'Kalk: Der technische Kalkkreislauf & NHL',
    question: 'Erläutern Sie die drei chemischen Stufen des Kalkkreislaufs (Brennen, Löschen, Erhärten) und erklären Sie den Unterschied zwischen Luftkalk (CL 90) und natürlich hydraulischem Kalk (NHL).',
    moduleHint: { id: 'kalk', name: 'Kalk' },
    solution: '1. **Brennen (Kalzinieren bei ca. 900–1100°C):**\n   $$\\text{CaCO}_3 \\longrightarrow \\text{CaO} + \\text{CO}_2 \\uparrow$$\n   Calciumcarbonat (Kalkstein) wird unter CO2-Abspaltung zu Branntkalk (Calciumoxid) gebrannt (endotherm).\n2. **Löschen (stark exotherm):**\n   $$\\text{CaO} + \\text{H}_2\\text{O} \\longrightarrow \\text{Ca(OH)}_2 + \\text{Wärme}$$\n   Branntkalk reagiert mit Wasser zu Löschkalk (Calciumhydroxid / Kalkhydrat).\n3. **Erhärten (Karbonatisierung an der Luft):**\n   $$\\text{Ca(OH)}_2 + \\text{CO}_2 \\longrightarrow \\text{CaCO}_3 + \\text{H}_2\\text{O}$$\n   Unter Aufnahme von Luft-CO2 bildet sich wieder unlöslicher Kalkstein (Calciumcarbonat).\n\n**Unterschied zu NHL (Hydraulischer Kalk):**\nLuftkalk (CL) härtet ausschließlich mit CO2 an der Luft aus (keine Wasserbeständigkeit vor Karbonatisierung). Natürlich hydraulischer Kalk (NHL) wird aus mergeligem Kalkstein gebrannt, enthält Silikate/Aluminate und erhärtet teils über CSH-Phasen mit Wasser (hydraulisch), wodurch er auch unter Wasser oder in feuchtem Mauerwerk erhärtet und höhere Festigkeiten erreicht.'
  },
  {
    id: 't_lehm_sorptionsfaehigkeit',
    difficulty: 'Leicht',
    title: 'Lehm: Feuchtepufferung & Sorptionsfähigkeit',
    question: 'Warum besitzt Lehmputz im Innenraum eine überragende Fähigkeit zur Regulierung der Luftfeuchtigkeit im Vergleich zu Gips- oder Zementputzen?',
    moduleHint: { id: 'lehm', name: 'Lehm' },
    solution: 'Lehm enthält quellfähige Tonminerale (z.B. Illit, Montmorillonit, Kaolinit) mit riesigen inneren und äußeren spezifischen Oberflächen (bis zu mehreren hundert m² pro Gramm). Wasserdampfmoleküle lagern sich bei hoher Raumluftfeuchte durch physikalische Adsorption in den Zwischenschichten der Tonminerale an und werden bei sinkender Raumluftfeuchte reversibel und schnell wieder abgegeben. Dies hält die Raumluftfeuchtigkeit konstant im behaglichen Bereich von 45–55 %.'
  },
  {
    id: 't_erdbau_proctor',
    difficulty: 'Schwer',
    title: 'Erdbau: Proctorversuch & Verdichtungsgrad',
    question: 'Bei einem Proctorversuch an einem sandig-kiesigen Boden wird eine maximale Trockendichte von \\rho_{\\text{Pr}} = 2,08 g/cm³ bei einem optimalen Wassergehalt von w_{\\text{opt}} = 7,5 % ermittelt. Auf der Baustelle wird nach der Verdichtung eine Trockendichte von \\rho_d = 2,04 g/cm³ gemessen. Berechnen Sie den Verdichtungsgrad D_{\\text{Pr}} und prüfe, ob die Anforderung D_{\\text{Pr}} \\ge 97 % für den Straßenunterbau erfüllt ist.',
    moduleHint: { id: 'erdbau', name: 'Erdbau & Geotechnik' },
    solution: '1. **Berechnung des Verdichtungsgrades ($D_{\\text{Pr}}$):**\n   $$D_{\\text{Pr}} = \\frac{\\rho_d}{\\rho_{\\text{Pr}}} \\times 100\\% = \\frac{2{,}04\\text{ g/cm}^3}{2{,}08\\text{ g/cm}^3} \\times 100\\% \\approx **98{,}08\\%**$$\n2. **Prüfung der Anforderung:**\n   Da $D_{\\text{Pr}} = 98{,}1\\% \\ge 97{,}0\\%$, ist das bautechnische Kriterium für den Unterbau vollständig erfüllt. Weicht der Einbauwassergehalt auf der Baustelle jedoch zu weit vom Optimum ($w_{\\text{opt}} = 7{,}5\\%$) ab, ist die erforderliche Verdichtungsarbeit unverhältnismäßig hoch.'
  },
  {
    id: 't_metalle_spannungsreihe',
    difficulty: 'Mittel',
    title: 'Metalle: Elektrochemische Spannungsreihe & Fließregel',
    question: 'Bei einer Dacheindeckung soll ein Titanzinkblech mit einer Kupferrinne kombiniert werden. Welcher Werkstoff muss in Fließrichtung des Regenwassers zuerst angeordnet werden und was passiert bei Missachtung der Fließregel?',
    moduleHint: { id: 'metalle', name: 'Metalle' },
    solution: 'Nach der elektrochemischen Spannungsreihe ist Zink ($E_0 = -0{,}76\\text{ V}$) wesentlich unedler als Kupfer ($E_0 = +0{,}34\\text{ V}$).\n**Fließregel:** Wasser darf immer nur von unedleren Metallen zu edleren Metallen fließen, **niemals umgekehrt**! Zinkblech muss daher oben liegen und das Kupferrohr unten.\n**Bei Missachtung:** Fließt Regenwasser über Kupfer, löst es winzige Mengen Kupferionen ($Cu^{2+}$). Treffen diese auf das unedlere Zink, werden sie elementar als Kupfer abgeschieden, während Zink in Lösung geht (Lochfraßkorrosion / elektrochemische Zerstörung des Zinkblechs innerhalb weniger Monate).'
  },
  {
    id: 't_materialitaet_patina',
    difficulty: 'Leicht',
    title: 'Materialität & Architektur: Patina & Schutzschichtbildung',
    question: 'Warum benötigt wetterfester Baustahl (Cortenstahl) im Gegensatz zu herkömmlichem Baustahl keinen korrosionsschützenden Anstrich und welche Umweltbedingungen sind für die Schutzschichtbildung zwingend nötig?',
    moduleHint: { id: 'materialitaet_architektur', name: 'Materialität & Architektur' },
    solution: 'Cortenstahl enthält geringe Legierungsanteile von Kupfer, Chrom, Nickel und Phosphor. Unter atmosphärischer Bewitterung bildet sich zunächst eine oberflächliche Rostschicht. Durch den Wechsel von Benetzung und vollständiger Abtrocknung wandelt sich diese in eine festhaftende, nahezu sauerstoff- und wasserundurchlässige Sperrschicht aus basischen Eisensulfaten und -phosphaten (Patina) um, die das darunterliegende Metall vor weiterem Abtrag schützt. Wichtig: Bei Dauerfeuchte (z.B. im Erdreich oder stehendem Wasser) kann sich die Schutzschicht nicht bilden und der Stahl rostet ungeschützt durch.'
  },
  {
    id: 't_asphalt_viskositaet',
    difficulty: 'Leicht',
    title: 'Asphalt: Thermoplastisches Verhalten & RuK-Versuch',
    question: 'Warum verformt sich Asphalt im Sommer (Spurrillenbildung) stärker als im Winter und welcher Kennwert wird im RuK-Versuch bestimmt?',
    moduleHint: { id: 'asphalt', name: 'Asphalt & Bitumen' },
    solution: 'Bitumen ist ein thermoplastisches Bindemittel. Bei hohen sommerlichen Temperaturen sinkt seine Viskosität drastisch ab, wodurch der Asphalt unter rollender Radlast zu viskoser Verformung neigt (Spurrinnen). Im RuK-Versuch (Ring und Kugel nach DIN EN 1427) wird der Erweichungspunkt gemessen: Die Temperatur, bei der eine Stahlkugel durch die erweichende Bitumenprobe sinkt (z.B. 50–60°C bei Straßenbaubitumen).'
  },
  {
    id: 't_faserverbund_cfk',
    difficulty: 'Mittel',
    title: 'Faserverbundwerkstoffe: CFK- vs. GFK-Lamellen zur Tragwerksverstärkung',
    question: 'Ein Stahlbetonträger soll nachträglich durch aufgeklebte Faserverbundlamellen verstärkt werden. Warum wird hierfür CFK (Kohlenstofffaser) gegenüber GFK (Glasfaser) bevorzugt?',
    moduleHint: { id: 'faserverbund', name: 'Faserverbund' },
    solution: 'CFK besitzt einen sehr hohen Elastizitätsmodul ($E \\approx 165\\text{ bis } 210\\text{ GPa}$), der im Bereich von Stahl liegt. Daher aktivieren CFK-Lamellen bereits bei minimalen Betondehnungen erhebliche Zugkräfte und entlasten die innenliegende Stahlbewehrung effektiv. GFK besitzt einen viel zu geringen E-Modul ($E \\approx 30\\text{ bis } 40\\text{ GPa}$), sodass der Beton bereits unzulässig breite Risse aufweisen müsste, bevor nennenswerte Zugkräfte in die Glasfaser fließen.'
  },
  {
    id: 't_kunststoffe_polymere',
    difficulty: 'Mittel',
    title: 'Kunststoffe: Thermoplaste, Duroplaste und Elastomere',
    question: 'Erläutern Sie anhand des molekularen Kettenaufbaus die Unterschiede zwischen Thermoplasten, Duroplasten und Elastomeren bezüglich Schmelzbarkeit und Schweißbarkeit.',
    moduleHint: { id: 'kunststoffe', name: 'Kunststoffe' },
    solution: '1. **Thermoplaste (z.B. PE, PVC, PP):** Lineare oder verzweigte Polymerketten ohne kovalente Quervernetzung (zusammengehalten nur durch Van-der-Waals-Kräfte). Bei Erwärmung gleiten die Ketten aneinander ab -> schmelzbar, plastisch verformbar und schweißbar.\n2. **Duroplaste (z.B. Epoxidharze, Polyurethane):** Engmaschig dreidimensional kovalent vernetzte Makromoleküle. Sie sind starr, formstabil, unschmelzbar und unlöslich (zersetzen sich bei Überhitzung thermisch, nicht schweißbar).\n3. **Elastomere (z.B. EPDM, Silikon):** Weitmaschig vernetzte Polymerknäuel. Bei Zugbeanspruchung entknäueln sich die Ketten reversibel (gummielastisch). Sie sind formstabil, unschmelzbar und nicht schweißbar.'
  },
  {
    id: 't_daemmstoffe_vergleich',
    difficulty: 'Mittel',
    title: 'Dämmstoffe: EPS vs. Mineralwolle vs. Holzfaser',
    question: 'Vergleichen Sie EPS, Steinwolle und Holzfaserdämmung hinsichtlich Wärmeleitfähigkeit (\\lambda), Brandschutz und biogenem Kohlenstoffspeicher.',
    moduleHint: { id: 'daemmstoffe', name: 'Dämmstoffe' },
    solution: '1. **EPS (Polystyrol):** $\\lambda \\approx 0{,}031–0{,}038\\text{ W/(m}\\cdot\\text{K)}$, brennbar (B1/B2, tropft brennend ab), hoher fossiler CO2-Fußabdruck (erdölbasiert).\n2. **Steinwolle:** $\\lambda \\approx 0{,}035–0{,}040\\text{ W/(m}\\cdot\\text{K)}$, unbrennbar (Klasse A1, Schmelzpunkt > 1000°C, ideal für Hochhäuser), energieintensive Schmelzherstellung.\n3. **Holzfaser:** $\\lambda \\approx 0{,}038–0{,}045\\text{ W/(m}\\cdot\\text{K)}$, normalentflammbar (B2), herausragende Ökobilanz durch Speicherung von biogenem Kohlenstoff ($CO_2$-Senke) und hohe Wärmekapazität ($c \\approx 2100\\text{ J/(kg}\\cdot\\text{K)}$) für den sommerlichen Hitzeschutz.'
  },
  {
    id: 't_ausbau_estrich_ct_ca',
    difficulty: 'Mittel',
    title: 'Ausbau: Zementestrich (CT) vs. Calciumsulfatestrich (CA)',
    question: 'Vergleichen Sie Zementestrich (CT) und Calciumsulfatestrich (CA) hinsichtlich Belegreife für Parkett bei Fußbodenheizung (CM-Messung) und Feuchteempfindlichkeit.',
    moduleHint: { id: 'ausbau', name: 'Ausbau' },
    solution: '1. **Belegreife (Restfeuchte nach CM-Methode bei beheiztem Estrich):**\n   - **Calciumsulfatestrich (CA/CAF):** Streng $\\le 0{,}3\\%$ (unbeheizt $\\le 0{,}5\\%$). CA trocknet formstabil ohne nennenswertes Schwinden, ermöglicht große fugenlose Flächen.\n   - **Zementestrich (CT):** $\\le 1{,}8\\%$ (unbeheizt $\\le 2{,}0\\%$). CT schwindet beim Trocknen deutlich und neigt zum Aufschüsseln (Scheinfugen nötig).\n2. **Feuchteempfindlichkeit:** CT ist wasserfest und für Nassräume oder Außenbereiche geeignet. CA verliert bei dauerhafter Durchnässung seine Festigkeit (Gips löst sich an) und ist nur für trockene Innenräume zulässig.'
  }
];
