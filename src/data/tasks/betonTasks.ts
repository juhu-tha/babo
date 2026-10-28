import { Task } from '../aufgabenData';

export const betonTasks: Task[] = [
  {
    id: 't1',
    difficulty: 'Schwer',
    title: 'Mischungsberechnung: Rezepturermittlung',
    question: 'Sie planen eine Betonrezeptur für 1 m³. Gegeben: 320 kg Zement (Dichte 3,1 kg/dm³), w/z-Wert 0.50, 1,5% Luftporen. Wie viel Gesteinskörnung (Dichte 2,65 kg/dm³) wird benötigt?',
    moduleHint: { id: 'mischungsberechnung', name: 'Mischungsberechnung' },
    solution: 'Nutzen Sie das Modul Mischungsberechnung zur volumetrischen Bilanzierung:\n1. **Wassergehalt ($W$):** $W = 320 \\times 0{,}50 = 160\\text{ Liter}$ (entspricht $160\\text{ dm}^3$).\n2. **Zementvolumen ($V_c$):** $V_c = \\frac{320}{3{,}1} = 103{,}2\\text{ dm}^3$.\n3. **Luftporenvolumen ($V_l$):** $1{,}5\\% \\times 1000\\text{ dm}^3 = 15{,}0\\text{ dm}^3$.\n4. **Volumen der Gesteinskörnung ($V_{\\text{gk}}$):** $V_{\\text{gk}} = 1000 - W - V_c - V_l = 1000 - 160 - 103{,}2 - 15{,}0 = 721{,}8\\text{ dm}^3$.\n5. **Masse der Gesteinskörnung ($M_{\\text{gk}}$):** $M_{\\text{gk}} = V_{\\text{gk}} \\times \\rho_{\\text{gk}} = 721{,}8\\text{ dm}^3 \\times 2{,}65\\text{ kg/dm}^3 = 1912{,}8\\text{ kg}$.'
  },
  {
    id: 't2',
    difficulty: 'Schwer',
    title: 'Frischbetondruck: Schalungsbemessung',
    question: 'Eine 4,50 m hohe Wandschalung wird mit Beton der Konsistenz F3 bei 10°C betoniert. Die Steiggeschwindigkeit beträgt 3,0 m/h. Wie hoch ist der maximale Frischbetondruck nach DIN 18218?',
    moduleHint: { id: 'frischbeton', name: 'Frischbetondruck' },
    solution: 'Die Berechnung erfolgt nach dem mathematischen Modell der DIN 18218:2010-01:\n1. **Effektive Erstarrungszeit ($t_{E,\\text{eff}}$):** Bei $10^\\circ\\text{C}$ wird die Referenzzeit ($t_{E,\\text{ref}} = 5{,}0\\text{ h}$ bei $15^\\circ\\text{C}$) temperaturkorrigiert: $t_{E,\\text{eff}} = t_{E,\\text{ref}} \\times 2^{(15 - T_{\\text{Beton}})/10} = 5{,}0 \\times 2^{0{,}5} \\approx 7{,}07\\text{ h}$.\n2. **Erstarren-Beiwert ($K_1$):** $K_1 = 1 + 0{,}077 \\times (t_{E,\\text{eff}} - 5{,}0) \\approx 1.159$.\n3. **Schalungsdruck-Zustandsbeiwert (F3):** $\\sigma_{\\text{hk,max}} = (14 \\cdot v + 18) \\times K_1 \\times (\\gamma_c / 25)$. Mit $\\gamma_c = 25\\text{ kN/m}^3$ (Standardbeton) und $v = 3{,}0\\text{ m/h}$: $\\sigma_{\\text{hk,max}} = (14 \\times 3{,}0 + 18) \\times 1.159 \\times 1{,}0 = 60 \\times 1.159 \\approx 69{,}5\\text{ kN/m}^2$.\n4. **Hydrostatische Begrenzung:** $\\sigma_{\\text{hydro}} = \\gamma_c \\times H = 25 \\times 4{,}50 = 112{,}5\\text{ kN/m}^2$.\nDa $\\sigma_{\\text{hk,max}} = 69{,}5\\text{ kN/m}^2 \\le 112{,}5\\text{ kN/m}^2$, liegt der maßgebende maximale Frischbetondruck bei **$69{,}5\\text{ kN/m}^2$**.'
  },
  {
    id: 't3',
    difficulty: 'Mittel',
    title: 'Hydratation: Massige Bauteile',
    question: 'Ein 1,5 m dickes Fundament wird im Sommer (25°C) betoniert. Vergleichen Sie die maximale Kerntemperatur bei Verwendung von CEM I 42.5 R (schnell) und CEM III/B 32.5 N (langsam).',
    moduleHint: { id: 'hydratation_folgen', name: 'Hydratation & Reife' },
    solution: 'Die Hydratationswärme ($Q$) ist werkstoffchemisch stark ausgeprägt: CEM I 42.5 R besitzt eine hohe Reaktionsrate ($Q_{7d} \\approx 350\\text{ J/g}$), während ein klinkerreduzierter Hochofenzement CEM III/B 32.5 N durch den hohen Hüttensandanteil langsam reagiert ($Q_{7d} \\approx 220\\text{ J/g}$).\nIn einem massigen Bauteil ($1{,}5\\text{ m}$ Dicke) führt CEM I zu einer adiabatischen Erwärmung des Kerns auf ca. $65^\\circ\\text{C}$ bis $70^\\circ\\text{C}$. Durch das steile Gefälle zur Außenluft entstehen Oberflächenzugspannungen (Zwang) und Risse. Mit CEM III/B verläuft die Hydratation träger, Wärme kann entweichen und der Temperaturpeak bleibt unkritisch bei ca. $40^\\circ\\text{C}$ bis $45^\\circ\\text{C}$.'
  },
  {
    id: 't4',
    difficulty: 'Mittel',
    title: 'Nachbehandlung: Verdunstungsschutz',
    question: 'Sommertag: 32°C Lufttemperatur, 35% relative Feuchte, Windgeschwindigkeit 25 km/h. Die Betontemperatur beträgt 28°C. Wie hoch ist die Verdunstungsrate? Sind Maßnahmen erforderlich?',
    moduleHint: { id: 'nachbehandlung', name: 'Nachbehandlung' },
    solution: 'Die Verdunstungsrate $E$ lässt sich mathematisch über das empirische Menzel-Modell der Betontechnologie berechnen:\n$E = 5 \\times \\left[ (T_{\\text{Beton}} + 18)^{2{,}5} - r \\cdot (T_{\\text{Luft}} + 18)^{2{,}5} \\right] \\times (v_{\\text{Wind}} + 4) \\times 10^{-6} \\quad [\\text{kg/(m}^2\\text{h)}]$\nMit $T_{\\text{Beton}} = 28^\\circ\\text{C}$, $T_{\\text{Luft}} = 32^\\circ\\text{C}$, $r = 0{,}35$ (35% relative Feuchte) und $v_{\\text{Wind}} = 25\\text{ km/h}$:\n- $term_1 = 46^{2{,}5} \\approx 14351{,}4$\n- $term_2 = 0{,}35 \\times 50^{2{,}5} \\approx 6187{,}2$\n- $E = 5 \\times (14351.4 - 6187{,}2) \\times 29 \\times 10^{-6} \\approx 1{,}18\\text{ kg/(m}^2\\text{h)}$.\nDa $E > 1{,}0\\text{ kg/(m}^2\\text{h)}$, besteht akute Gefahr von Frühschwindrissen. Sofortige Nachbehandlung (Folie, Curing, feuchte Vliese) ist gemäß DIN EN 13670 zwingend erforderlich.'
  },
  {
    id: 't_festbeton_allg',
    difficulty: 'Leicht',
    title: 'Festbeton: Festigkeitsentwicklung',
    question: 'Wie hoch ist typischerweise die zu erwartende Festigkeit (relativ zur 28-Tage-Festigkeit) eines Betons mit normaler Festigkeitsentwicklung (CEM II) nach nur 2 Tagen?',
    moduleHint: { id: 'festbeton', name: 'Festbeton' },
    solution: 'Modul Festbeton: Nach 2 Tagen hat ein Beton mit normaler Festigkeitsentwicklung (ohne sonstige Maßnahmen oder extrem hohe Temperaturen) typischerweise erst etwa 30% bis 40% seiner 28-Tage-Normfestigkeit erreicht.'
  },
  {
    id: 't_festbeton',
    difficulty: 'Leicht',
    title: 'Festbeton: Statistik & Konformität',
    question: 'Bei einer Druckfestigkeitsprüfung (n=3) ergeben sich die Werte 32, 34 und 36 MPa. Wie hoch ist die mittlere Druckfestigkeit f_cm?',
    moduleHint: { id: 'festbeton_statistik', name: 'Festbeton (Statistik)' },
    solution: 'Modul Festbeton (Statistik): f_cm = (32 + 34 + 36) / 3 = 34,0 MPa.'
  },
  {
    id: 't_frischbetontemperatur',
    difficulty: 'Mittel',
    title: 'Frischbetontemperatur: Eiszugabe zur Kühlung',
    question: 'An einem heißen Sommertag soll die Frischbetontemperatur durch die Zugabe von Scherbeneis gesenkt werden. Wie viel kg Eis pro m³ werden benötigt, um die Temperatur um ca. 5°C zu senken?',
    moduleHint: { id: 'frischbeton', name: 'Frischbetontemperatur' },
    solution: 'Nutzen Sie das Modul Frischbetontemperatur. Durch die hohe Schmelzenthalpie von Eis (334 kJ/kg) ist es sehr effektiv. Typischerweise senken 10-15 kg Eis pro m³ Beton die Frischbetontemperatur um etwa 5°C, abhängig von den restlichen Mischungsparametern.'
  },
  {
    id: 't_packungsdichte',
    difficulty: 'Schwer',
    title: 'Packungsdichte: Fuller vs. Funk-Dinger',
    question: 'Warum erzeugt eine Sieblinie exakt auf der Fuller-Parabel in der Praxis oft keinen gut verarbeitbaren Beton?',
    moduleHint: { id: 'mischungsberechnung', name: 'Packungsdichte' },
    solution: 'Modul Packungsdichte: Die Fuller-Parabel zielt auf maximale Dichte (minimale Hohlräume) ab. In der Praxis führt dies jedoch oft zu kornrauem, schwer verarbeitbarem Beton, da der "Schmierfilm" (Leim) fehlt. Modelle wie Funk-Dinger oder modifizierte Fuller-Kurven berücksichtigten diesen Effekt besser, indem sie gezielt mehr Feinanteil vorsehen.'
  },
  {
    id: 't_pumpbeton',
    difficulty: 'Mittel',
    title: 'Pumpbeton: Thixotropie & Druckverlust',
    question: 'Sie pumpen einen SCC-Beton über 50m. Warum steigt der notwendige Pumpdruck nach einer kurzen Förderpause beim Wiederanfahren deutlich an?',
    moduleHint: { id: 'herstellung_einbau', name: 'Pumpen von Beton' },
    solution: 'Modul Pumpen von Beton: SCC neigt zur Thixotropie. In Ruhe baut sich im Beton eine innere Struktur auf (die Viskosität bzw. Fließgrenze steigt), was Entmischung verhindert. Beim Wiederanfahren muss diese Struktur erst wieder "aufgebrochen" werden, was sich als erhöhter Anfahrwiderstand (Druckspitze am Pumpenmanometer) bemerkbar macht.'
  },
  {
    id: 't_zementchemie',
    difficulty: 'Leicht',
    title: 'Zementchemie: Klinkerphasen & Frühfestigkeit',
    question: 'Ein Schnellzement (CEM I 52,5 R) zeichnet sich durch eine sehr hohe und schnelle Festigkeitsentwicklung aus. Welche Klinkerphase ist hierfür hauptverantwortlich?',
    moduleHint: { id: 'bindemittel', name: 'Bindemittel & Zementchemie' },
    solution: 'Modul Zementchemie: Die Klinkerphase Alit (Tricalciumsilicat, C3S) hydratisiert sehr schnell und ist maßgeblich für die Frühfestigkeit (die ersten 1 bis 7 Tage) verantwortlich. Ein Schnellzement hat daher einen besonders hohen Alit-Anteil und ist zudem feiner aufgemahlen.'
  },
  {
    id: 't_betonbauklassen',
    difficulty: 'Mittel',
    title: 'WU-Beton: Beanspruchungs-, Nutzungs- und Feuchtigkeitsklasse',
    question: 'Eine weiße Wanne (WU-Keller) für ein hochwertiges Bürogebäude steht im drückenden Grundwasser. Welche Beanspruchungs- und Nutzungsklasse sind nach der WU-Richtlinie des DAfStb anzusetzen, welche Feuchtigkeitsklasse (Alkali-Kieselsäure-Reaktion) ist davon getrennt zu wählen, und welche Überwachungsklasse nach DIN 1045-3:2023-08 ergibt sich bei einem C30/37?',
    moduleHint: { id: 'qualitaetssicherung', name: 'BBQ - Betonbauklassen' },
    solution: 'Modul BBQ - Betonbauklassen: Die WU-Richtlinie des DAfStb (Ausgabe 2017) arbeitet mit zwei eigenen Klassen: Drückendes Grundwasser ergibt Beanspruchungsklasse 1; die hochwertige Büronutzung ohne zulässige Feuchtstellen auf der Innenseite ergibt Nutzungsklasse A. Davon zu unterscheiden ist die Feuchtigkeitsklasse nach DIN 1045-2 und Alkali-Richtlinie, die nur den Schutz vor schädigender Alkali-Kieselsäure-Reaktion regelt: Ein ständig im Grundwasser stehendes Bauteil ist dauernd feucht und liegt in der Regel in WF; WA gilt erst bei zusätzlicher Alkalizufuhr von außen (z. B. Tausalz, Meerwasser). Die Überwachungsklasse folgt nach DIN 1045-3:2023-08 nicht aus der WU-Eigenschaft (WU-Beton allein liegt in ÜK 1), sondern aus Festigkeitsklasse und Exposition: Wird für die weiße Wanne z. B. ein C30/37 festgelegt, ist es ein Beton der ÜK 2 mit ständiger Betonprüfstelle und Fremdüberwachung.'
  },
  {
    id: 't_konformitaet',
    difficulty: 'Schwer',
    title: 'Qualitätssicherung: Konformitätskriterien nach DIN EN 206',
    question: 'Bei einer Eingangskontrolle von 3 Betonwürfeln auf der Baustelle (fck = 30 MPa) messen Sie die Druckfestigkeiten 28, 33 und 35 MPa. Gilt das Konformitätskriterium als bestanden?',
    moduleHint: { id: 'qualitaetssicherung', name: 'Produktions- & Konformitätskontrolle' },
    solution: 'Modul Konformitätskontrolle (Initialkontrolle n=3): Kriterium 1: f_cm ≥ f_ck + 4 = 34 MPa. Mittelwert = (28+33+35)/3 = 32 MPa -> Kriterium 1 nicht bestanden! Kriterium 2: f_c,min ≥ f_ck - 4 = 26 MPa. Niedrigster Wert ist 28 MPa -> Kriterium 2 bestanden. Da Kriterium 1 gerissen wurde, ist der Beton formal nicht konform, auch wenn kein Wert kritisch niedrig ist.'
  },
  {
    id: 't_innovative',
    difficulty: 'Leicht',
    title: 'Innovative Werkstoffe: 3D-Betondruck',
    question: 'Welche Herausforderung besteht bezüglich der Konsistenz beim 3D-Betondruck im Vergleich zu konventionellem Pumpbeton?',
    moduleHint: { id: 'innovative_werkstoffe', name: 'Innovative Werkstoffe & Fertigung' },
    solution: 'Modul Innovative Werkstoffe: Der Beton muss beim Pumpen sehr weich und fließfähig sein (Förderbarkeit), aber unmittelbar nach dem Austritt aus der Düse eine extrem hohe Formstabilität (Standfestigkeit/Fließgrenze) aufweisen, um die nachfolgenden Schichten tragen zu können.'
  },
  {
    id: 't_sichtbeton',
    difficulty: 'Leicht',
    title: 'Sichtbeton: Schalhaut & Porenvermeidung',
    question: 'Warum treten bei der Verwendung von absolut saugunfähigen, glatten Schalhäuten (z.B. kunststoffbeschichtet) häufig mehr Lunker (Poren) an der Sichtbetonoberfläche auf als bei saugenden Holzschalungen?',
    moduleHint: { id: 'sichtbeton', name: 'Sichtbeton' },
    solution: 'Modul Sichtbeton: Bei einer nichtsaugenden Schalung können Wasser und entweichende Luftblasen an der Schalhaut nicht in die Schalung "abfließen" oder aufgesaugt werden. Sie bleiben an der Grenzfläche zwischen Beton und Schalung gefangen und zeichnen sich nach dem Ausschalen als Lunker (Auswaschungen, Poren) ab.'
  },
  {
    id: 't_sichtbeton_klassen',
    difficulty: 'Mittel',
    title: 'Sichtbeton: Anforderungen nach DBV-Merkblatt (SB1 bis SB4)',
    question: 'Ein repräsentatives Foyer eines Museums soll in Sichtbetonklasse SB4 ausgeführt werden. Welche bautechnischen Vorgaben und Erprobungen sind dafür vertraglich zwingend vorzusehen?',
    moduleHint: { id: 'sichtbeton', name: 'Sichtbeton' },
    solution: 'Für SB4 (repräsentative Bauteile mit besonders hohen gestalterischen Anforderungen) verlangt das DBV/VDZ-Merkblatt: 1. Erstellung einer repräsentativen Probeschüttung bzw. Erprobungsfläche am Bauwerk im Maßstab 1:1. 2. Festlegung von Schalungstyp, Schalhautstößen, Ankerlochbild und Fasenleisten. 3. Einheitliche Zement- und Gesteinskörnungschargen zur Vermeidung von Farbunterschieden. 4. Exakt dosierter und gleichmäßiger Trennmittelauftrag (Trennfilmdicke im Mikrometerbereich, kein Pfützenwurf).'
  },
  {
    id: 't_expositionsklassen',
    difficulty: 'Leicht',
    title: 'Expositionsklassen: Tausalz & Sprühnebel',
    question: 'Welche Expositionsklasse ist maßgeblich, wenn ein Betonbauteil häufiger Tausalzbeanspruchung durch Sprühnebel (z.B. an einer Autobahnbrücke) ausgesetzt ist?',
    moduleHint: { id: 'betonpraxis', name: 'Betonpraxis' },
    solution: 'Bei Belastung durch Chloride aus Taumitteln (hier Sprühnebelzone von Verkehrswegen) ist die Expositionsklasse XD3 (und i.d.R. Frost-Tausalz-Angriff XF4) maßgeblich.'
  },
  {
    id: 't_hydratationswaerme',
    difficulty: 'Mittel',
    title: 'Zementchemie: Massige Bauteile & LH-Zemente',
    question: 'Welchen Zement würden Sie für ein sehr massiges Bauteil (z.B. ein Kraftwerksfundament) wählen, um Risse durch abfließende Hydratationswärme zu vermeiden?',
    moduleHint: { id: 'bindemittel', name: 'Bindemittel' },
    solution: 'Einen Zement mit niedriger Hydratationswärmeentwicklung (LH = Low Heat), z.B. einen Hochofenzement CEM III/B oder CEM III/C, da der hohe Hüttensandanteil die Reaktionswärme stark verzögert und dämpft.'
  },
  {
    id: 't_hydratation_adiabatisch',
    difficulty: 'Schwer',
    title: 'Hydratation: Adiabatischer Temperaturanstieg',
    question: 'Ein massiges Bauteil (Fundamentplatte d = 2,0 m) wird mit C25/30 hergestellt. Zementgehalt c = 340 kg/m³, CEM I 42,5 R mit Q_7d = 360 J/g. Berechnen Sie den theoretischen adiabatischen Temperaturanstieg \\Delta T_{\\text{adiab}} bei c_p = 1,0 kJ/(kg·K) und \\rho = 2400 kg/m³.',
    moduleHint: { id: 'frischbeton', name: 'Frischbetontemperatur' },
    solution: 'Thermodynamischer Ansatz: $$\\Delta T_{\\text{adiab}} = \\frac{c \\cdot Q_{7\\text{d}}}{c_p \\cdot \\rho} = \\frac{340 \\times 360}{1{,}0 \\times 2400} = \\frac{122400}{2400} = 51\\text{ K}$$. Bei 20°C Frischbetontemperatur beträgt die maximale Kerntemperatur $T_{\\text{max}} = 20 + 51 = 71^\\circ\\text{C}$. Dies führt zu Rissgefahren beim Abkühlen und Spätettringit-Bildungsrisiken bei über 65–70°C.'
  },
  {
    id: 't_plastisches_schwinden',
    difficulty: 'Mittel',
    title: 'Frühschwinden: Kapillardrucktheorie',
    question: 'Erklären Sie den physikalischen Mechanismus des plastischen Schrumpfens (Kapillardrucktheorie) im jungen Frischbeton. Ab welcher Verdunstungsrate drohen Risse?',
    moduleHint: { id: 'nachbehandlung', name: 'Nachbehandlung' },
    solution: 'Übersteigt die Verdunstungsrate das nachgelieferte Blutungswasser (Bleeding), weicht der Wassermeniskus in die kapillaren Porenräume zwischen den Zementpartikeln zurück. Nach der Young-Laplace-Gleichung entsteht ein negativer Kapillardruck (Zugspannung im Porenwasser), der das noch unvollständig erhärtete Gefüge zusammenzieht. Ab einer Verdunstungsrate von ca. $E \\ge 1{,}0\\text{ kg/(m}^2\\cdot\\text{h)}$ entstehen dadurch breite, unregelmäßige Frühschwindrisse.'
  },
  {
    id: 't_trennrisse_zwang',
    difficulty: 'Schwer',
    title: 'Äußerer Zwang: Trennrisse infolge Abkühlung',
    question: 'Eine 30 cm dicke Betonwand kühlt um \\Delta T = 22 K bei äußerem Zwang K = 0.85 ab. Gegeben: \\alpha_T = 10 · 10^-6 K^-1, E_{\\text{cm,eff}} = 15 000 N/mm². Berechnen Sie die induzierte Zugspannung und vergleichen Sie mit f_{\\text{ct,eff}} = 1,6 N/mm².',
    moduleHint: { id: 'hydratation_folgen', name: 'Zwang & Risse' },
    solution: '1. Behinderte Wärmedehnung: $\\varepsilon_{\\text{zwang}} = K \\cdot \\alpha_T \\cdot \\Delta T = 0{,}85 \\cdot (10 \\cdot 10^{-6}) \\cdot 22 = 1{,}87 \\cdot 10^{-4}$.\n2. Zugspannung: $\\sigma_{\\text{ct}} = E_{\\text{cm,eff}} \\cdot \\varepsilon_{\\text{zwang}} = 15000 \\cdot 1{,}87 \\cdot 10^{-4} = 2.805\\text{ N/mm}^2$.\nDa $\\sigma_{\\text{ct}} = 2{,}81\\text{ N/mm}^2 > f_{\\text{ct,eff}} = 1{,}6\\text{ N/mm}^2$, reißt die Wand vollständig auf (durchgehender Trennriss). Mindestbewehrung nach DIN EN 1992-1-1 ist zur Rissbreitenbegrenzung zwingend erforderlich.'
  },
  {
    id: 't_uhpc_duktilitaet',
    difficulty: 'Schwer',
    title: 'Innovative Werkstoffe: UHPC Gefüge & Mikrostahlfasern',
    question: 'Warum benötigt Ultra-Hochleistungsbeton (UHPC) mit Druckfestigkeiten f_ck > 150 MPa zwingend eine Faserbewehrung (z.B. Mikrostahlfasern)?',
    moduleHint: { id: 'innovative_werkstoffe', name: 'Innovative Werkstoffe' },
    solution: 'Mit steigender Druckfestigkeit sinkt die elastische Grenzdehnung und der Werkstoff wird extrem spröde. Bei unbewehrtem UHPC würde es bei Rissbildung zu einem explosionsartigen, schlagartigen Sprödbruch ohne Vorankündigung kommen. Hochfeste Mikrostahlfasern (typisch 1,5–2,5 Vol.-%) überbrücken Mikrorisse, erzeugen eine signifikante Nachrisszugfestigkeit und verleihen dem Werkstoff eine quasi-duktile Verformbarkeit.'
  },
  {
    id: 't_betonpraxis_nachdosierung',
    difficulty: 'Mittel',
    title: 'Betonpraxis: Wasserzugabeverbot & Fließmittelnachdosierung',
    question: 'Auf der Baustelle stellt der Polier fest, dass der angelieferte Transportbeton zu steif ist. Darf Wasser zugegeben werden? Wie lautet die korrekte betontechnologische Vorgehensweise?',
    moduleHint: { id: 'betonpraxis', name: 'Betonpraxis' },
    solution: 'Wasserzugabe auf der Baustelle ist nach DIN EN 206 strengstens verboten, da eine unkontrollierte Erhöhung des w/z-Wertes zu drastischen Festigkeitsverlusten, erhöhtem Schwinden und Einbußen bei der Dauerhaftigkeit (Expositionsklassen) führt. Die einzig zulässige Maßnahme: Gezielte Nachdosierung des vom Transportbetonwerk freigegebenen Fließmittels durch Sachkundige mit anschließender Mindestmischzeit von 1 Minute pro m³ Trommelinhalt (mindestens 5 Minuten).'
  },
  {
    id: 't_mehlkorngehalt',
    difficulty: 'Mittel',
    title: 'Beton-Grundlagen: Mehlkorngehalt & Zusammenhalt',
    question: 'Was versteht man unter dem Mehlkorngehalt (Korngröße < 0,125 mm) und welche Konsequenzen hat ein zu geringer bzw. zu hoher Mehlkorngehalt?',
    moduleHint: { id: 'grundlagen', name: 'Grundlagen Beton' },
    solution: 'Der Mehlkorngehalt umfasst den Zement, Betonzusatzstoffe (z.B. Flugasche, Kalksteinmehl) und den Gesteinskörnungsanteil < 0,125 mm. Zu geringer Gehalt: Der Beton neigt zum Entmischen, Wasserabsondern (Bleeding) und lässt sich schlecht pumpen. Zu hoher Gehalt: Erhöhter Wasseranspruch zur Benetzung der riesigen spezifischen Oberfläche, dadurch entweder Festigkeitsabfall oder höherer Fließmittelbedarf, sowie erhöhtes Schwindmaß.'
  },
  {
    id: 'ts_svb',
    difficulty: 'Mittel',
    title: 'SVB: Rheologie & Blockierneigung',
    question: 'Warum reicht bei Selbstverdichtendem Beton (SVB) die Prüfung des Setzfließmaßes allein nicht aus, um seine Eignung für eng bewehrte Bauteile zu bestätigen?',
    moduleHint: { id: 'sonderbetone', name: 'SVB' },
    solution: 'Ein großes Setzfließmaß zeigt nur, dass der Beton sehr gut fließt und eine niedrige Fließgrenze hat. Es sagt aber nichts über die Blockierneigung an Bewehrungsstäben aus. Deshalb muss mit dem J-Ring-Test oder dem L-Kasten geprüft werden, ob die Gesteinskörnung beim Durchfließen der Stäbe hängen bleibt (Blockieren).'
  },
  {
    id: 'ts_massen',
    difficulty: 'Mittel',
    title: 'Massenbeton: Kühlmaßnahmen & Temperaturgradient',
    question: 'Bei der Betonage einer 1,5m dicken Talsperrenmauer wird eine zu schnelle Abkühlung der Oberfläche befürchtet. Welche Schäden drohen, und wie kann entgegengewirkt werden?',
    moduleHint: { id: 'sonderbetone', name: 'Massenbeton' },
    solution: 'Wenn die Oberfläche schnell abkühlt, zieht sie sich zusammen, während der Kern durch Hydratationswärme ausgedehnt bleibt. Dies führt zu massiven Oberflächenzerrüttungen und Spannungsrissen. Abhilfe: Thermische Nachbehandlung (z.B. Isolierabdeckungen), Verwendung von Zementen mit niedriger Hydratationswärme (LH) oder Vorabkühlung des Betons (Eiszugabe).'
  },
  {
    id: 'ts_schwer',
    difficulty: 'Mittel',
    title: 'Schwerbeton: Strahlenschutz & Baryt',
    question: 'Beim Strahlenschutzbau (z.B. Kliniken) wird Schwerbeton verwendet. Reicht eine hohe Rohdichte zur Abbremsung von Neutronenstrahlung?',
    moduleHint: { id: 'sonderbetone', name: 'Schwerbeton' },
    solution: 'Nein, eine hohe Dichte (durch Baryt oder Magnetit) schwächt Gammastrahlung ab, jedoch keine Neutronenstrahlung. Um Neutronen abzubremsen, benötigt man leichte Elemente wie Wasserstoff. Daher wird oft Kristallwasser in speziellen Gesteinskörnungen (z.B. Serpentin) gebunden oder der Zementleimanteil erhöht.'
  },
  {
    id: 'ts_pump',
    difficulty: 'Mittel',
    title: 'Pumpbeton: Schmierzustand & Rohrreibung',
    question: 'Warum trocknet ein falsch eingestellter Beton oft spontan im Pumpenschlauch aus und führt zu sogenannten "Stopfern"?',
    moduleHint: { id: 'sonderbetone', name: 'Pumpbeton' },
    solution: 'Beim Pumpen bildet sich an der Rohrwand eine Schmierschicht aus Zementleim und feinen Partikeln. Wenn der Beton beim Pumpdruck "ausblutet" (also Wasser abgepresst wird, weil das Wasserrückhaltevermögen zu gering ist), verliert er den Schmierfilm. Die grobe Körnung reibt dann am Rohr -> Stopfer.'
  },
  {
    id: 'ts_infra',
    difficulty: 'Mittel',
    title: 'Infraleichtbeton: Dämmung & Festigkeit',
    question: 'Wie erreicht Infraleichtbeton die Möglichkeit, monolithische Außenwände (ohne Zusatzdämmung) zu errichten, die aktuelle Energiestandards erfüllen?',
    moduleHint: { id: 'sonderbetone', name: 'Infraleichtbeton' },
    solution: 'Durch extrem poröse Gesteinskörnungen (z.B. Blähton/Blähglas) wird die Rohdichte auf unter 800 kg/m³ gesenkt, was zu hervorragenden Wärmedämmeigenschaften (Lambda < 0,20 W/mK) führt. Allerdings sinkt parallel die Druckfestigkeit deutlich ab, sodass tragwerksplanerisch diese Parameter gegeneinander optimiert werden müssen.'
  }
];
