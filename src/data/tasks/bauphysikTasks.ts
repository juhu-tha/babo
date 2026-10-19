import { Task } from '../aufgabenData';

export const bauphysikTasks: Task[] = [
  {
    id: 't_energieausweis_primaerenergie',
    difficulty: 'Schwer',
    title: 'Energieausweis: Primärenergiebedarf (Q_P) nach GEG & DIN V 18599',
    question: 'Ein Wohngebäude mit einer Gebäudenutzfläche von A_N = 250 m² hat einen berechneten Jahres-Endenergiebedarf für Raumwärme und Trinkwarmwasser von:\n- Erdgas: Q_E,Gas = 18.000 kWh/a (Primärenergiefaktor f_P,Gas = 1.1)\n- Hilfsstrom für Pumpen und Lüftung: Q_E,Strom = 800 kWh/a (f_P,Strom = 1.8)\n\na) Berechnen Sie den Jahres-Primärenergiebedarf Q_P in kWh/a.\nb) Berechnen Sie den spezifischen Primärenergiebedarf q_P in kWh/(m²·a) und bestimme die Energieeffizienzklasse nach Anlage 10 des Gebäudeenergiegesetzes (GEG).',
    moduleHint: { id: 'energieausweis', name: 'Energieausweis (GEG)' },
    solution: 'Berechnung nach DIN V 18599 und GEG:\n1. **Berechnung des Jahres-Primärenergiebedarfs ($Q_P$):**\n   $$Q_P = Q_{E,\\text{Gas}} \\cdot f_{P,\\text{Gas}} + Q_{E,\\text{Strom}} \\cdot f_{P,\\text{Strom}}$$\n   $$Q_P = 18000\\text{ kWh/a} \\times 1{,}1 + 800\\text{ kWh/a} \\times 1{,}8 = 19800 + 1440 = **21.240\\text{ kWh/a}**$$\n2. **Spezifischer Primärenergiebedarf ($q_P$ bezogen auf $A_N$):**\n   $$q_P = \\frac{Q_P}{A_N} = \\frac{21240\\text{ kWh/a}}{250\\text{ m}^2} = **84{,}96\\text{ kWh/(m}^2\\cdot\\text{a)}$$\n3. **Energieeffizienzklasse nach GEG (Anlage 10):**\n   - Klasse A+: $< 30\\text{ kWh/(m}^2\\cdot\\text{a)}$\n   - Klasse A: $30 - 50\\text{ kWh/(m}^2\\cdot\\text{a)}$\n   - Klasse B: $50 - 75\\text{ kWh/(m}^2\\cdot\\text{a)}$\n   - Klasse C: $75 - 100\\text{ kWh/(m}^2\\cdot\\text{a)}$\n   Mit $85{,}0\\text{ kWh/(m}^2\\cdot\\text{a)}$ liegt das Gebäude in der **Energieeffizienzklasse C**.'
  },
  {
    id: 't_energieausweis_prebound_rebound',
    difficulty: 'Mittel',
    title: 'Energieausweis: Bedarfsausweis vs. Verbrauchsausweis & Nutzerverhalten',
    question: 'Warum weichen die Energiekennwerte von Bedarfsausweis und Verbrauchsausweis in der Realität oft stark voneinander ab? Erklären Sie in diesem Zusammenhang den "Prebound-Effekt" bei unsanierten Altbauten und den "Rebound-Effekt" bei energetisch sanierten Gebäuden.',
    moduleHint: { id: 'energieausweis', name: 'Energieausweis (GEG)' },
    solution: '1. **Bedarfsausweis vs. Verbrauchsausweis:**\n   - Der *Bedarfsausweis* berechnet den theoretischen Energiebedarf nach DIN V 18599 unter genormten Randbedingungen (z.B. $20^\\circ\\text{C}$ Raumtemperatur in allen Räumen, standardisierter Luftwechsel, Referenzklima Potsdam). Er ist nutzerunabhängig.\n   - Der *Verbrauchsausweis* basiert auf den Abrechnungsdaten der letzten 3 Jahre und ist extrem abhängig vom individuellen Heiz- und Lüftungsverhalten der Bewohner sowie Leerständen.\n2. **Prebound-Effekt (bei Altbauten):**\n   In energetisch schlechten Bestandsgebäuden ist der gemessene reale Verbrauch oft **20 bis 40 % niedriger als der berechnete Bedarf**. Grund: Bewohner heizen aus Kostengründen nicht die gesamte Wohnung vollflächig auf $20^\\circ\\text{C}$, schalten Heizkörper in Schlafzimmern ab und lüften sparsamer.\n3. **Rebound-Effekt (nach Sanierung):**\n   Nach einer Sanierung (z.B. Effizienzhaus) ist der tatsächliche Verbrauch oft höher als prognostiziert. Bewohner heizen sorgloser, stellen höhere Wunschtemperaturen ein oder lüften dauerhaft bei gekipptem Fenster, weil die Heizkosten ohnehin gering sind (teilweises Aufzehren der Einspareffekte).'
  },
  {
    id: 't_mindestwaermeschutz_frsi',
    difficulty: 'Schwer',
    title: 'Feuchteschutz: Temperaturfaktor f_Rsi & Schimmelpilzvermeidung nach DIN 4108-2',
    question: 'In einer Außenwandecke beträgt die innere Oberflächentemperatur bei einer Norm-Außentemperatur von \\theta_e = -10°C und einer Raumlufttemperatur von \\theta_i = +20°C genau \\theta_{si} = 11,8°C.\n\na) Berechnen Sie den Temperaturfaktor f_Rsi an dieser Wärmebrücke.\nb) Ist der Mindestwärmeschutz nach DIN 4108-2 (f_Rsi,min = 0.70) erfüllt und droht bei einer Raumluftfeuchte von 50% Schimmelpilzbildung?',
    moduleHint: { id: 'feuchteschutz', name: 'Feuchteschutz & Schimmel' },
    solution: 'Berechnung nach DIN 4108-2:\n1. **Berechnung des Temperaturfaktors ($f_{Rsi}$):**\n   $$f_{Rsi} = \\frac{\\theta_{si} - \\theta_e}{\\theta_i - \\theta_e} = \\frac{11{,}8 - (-10)}{20 - (-10)} = \\frac{21{,}8}{30{,}0} \\approx **0{,}727**$$\n2. **Normativer Vergleich:**\n   Da $f_{Rsi} = 0{,}727 \\ge 0{,}70$ ist, wird die normative Mindestanforderung der DIN 4108-2 rechnerisch knapp erfüllt.\n3. **Schimmelpilzbeurteilung:**\n   Schimmelpilzwachstum setzt ein, wenn die relative Luftfeuchtigkeit unmittelbar an der Bauteiloberfläche über längere Zeit $\\ge 80\\%$ beträgt ($80\\%$-Kriterium). Bei $20^\\circ\\text{C}$ und $50\\%$ Raumluftfeuchte liegt die Schimmelgrenztemperatur bei ca. $12{,}6^\\circ\\text{C}$. Da die Oberflächentemperatur $\\theta_{si} = 11{,}8^\\circ\\text{C} < 12{,}6^\\circ\\text{C}$ liegt, steigt die relative Oberflächenfeuchte lokal auf über $80\\%$. Es besteht somit trotz Einhaltung des pauschalen Grenzwerts von $0{,}70$ akute Schimmelpilzgefahr, falls die Raumfeuchte kurzfristig ansteigt!'
  },
  {
    id: 't_waerme',
    difficulty: 'Schwer',
    title: 'Wärmeeigenschaften: U-Wert-Berechnung nach DIN EN ISO 6946',
    question: 'Berechnen Sie den U-Wert einer Wand aus 24 cm Ziegel (lambda = 0,8 W/mK) und 16 cm EPS-Dämmung (lambda = 0,035 W/mK).',
    moduleHint: { id: 'waermeeigenschaften', name: 'Wärmeeigenschaften' },
    solution: 'Berechnung nach DIN EN ISO 6946:\n1. **Wärmedurchlasswiderstände der Schichten ($R_i = d_i / \\lambda_i$):**\n- Ziegelmauerwerk: $R_{\\text{Ziegel}} = \\frac{0{,}24\\text{ m}}{0{,}8\\text{ W/(mK)}} = 0{,}30\\text{ (m}^2\\text{K)/W}$.\n- EPS-Dämmung: $R_{\\text{Dämmung}} = \\frac{0{,}16\\text{ m}}{0{,}035\\text{ W/(mK)}} \\approx 4.571\\text{ (m}^2\\text{K)/W}$.\n2. **Gesamtwärmedurchgangswiderstand ($R_{\\text{T}}$):** Mit Übergangswiderständen $R_{si} = 0{,}13$ und $R_{se} = 0{,}04$:\n$$R_T = R_{si} + R_{\\text{Ziegel}} + R_{\\text{Dämmung}} + R_{se} = 0{,}13 + 0{,}30 + 4.571 + 0{,}04 = 5.041\\text{ (m}^2\\text{K)/W}$$\n3. **U-Wert ($U = 1 / R_T$):**\n$$U = \\frac{1}{5.041} \\approx **0{,}198\\text{ W/(m}^2\\text{K)}**$$'
  },
  {
    id: 't_schall',
    difficulty: 'Mittel',
    title: 'Schallschutz: Berger-Massegesetz & flächenbezogene Masse',
    question: 'Eine einschalige Wand aus Porenbeton (Rohdichte 400 kg/m³, Dicke 24 cm) wird mit einer Wand aus Kalksandstein (Rohdichte 2000 kg/m³, Dicke 11,5 cm) verglichen. Welche Wand weist das höhere Schalldämmmaß R_w auf?',
    moduleHint: { id: 'schallschutz', name: 'Schallschutz' },
    solution: '1. **Flächenbezogene Massen ($m\' = d \\cdot \\rho$):**\n- Porenbeton: $m\'_{\\text{PB}} = 0{,}24 \\times 400 = 96\\text{ kg/m}^2$.\n- Kalksandstein: $m\'_{\\text{KS}} = 0{,}115 \\times 2000 = 230\\text{ kg/m}^2$.\n2. **Schallschutzbewertung:**\nNach dem Massegesetz steigt das Schalldämmmaß mit dem Logarithmus der flächenbezogenen Masse ($R_w \\approx 20 \\log(m\') + \\text{const}$). Die KS-Wand hat die 2.4-fache Masse und dämmt trotz halber Dicke um ca. $7-8\\text{ dB}$ besser.'
  },
  {
    id: 't_brandschutz',
    difficulty: 'Schwer',
    title: 'Brandschutz: Betonabplatzungen & PP-Fasern',
    question: 'Warum kommt es bei hochfestem Beton (UHPC) im Brandfall häufig zu explosionsartigen Abplatzungen, und wie kann man dies bauphysikalisch verhindern?',
    moduleHint: { id: 'brandschutz', name: 'Brandschutz' },
    solution: 'UHPC ist extrem dicht und porenarm. Das im Zementstein gebundene und freie Wasser verdampft im Brandfall, kann aber durch das dichte Gefüge nicht entweichen. Es baut sich ein enormer Dampfdruck (> 5 MPa) auf, der den Beton sprengt. Lösung: Zugabe von ca. 1,5–2,0 kg/m³ Polypropylen-Fasern (PP-Fasern). Diese schmelzen bereits bei ca. 160–170°C und hinterlassen ein Netzwerk feiner Entlüftungskanäle, durch die der Wasserdampf gefahrlos abblasen kann.'
  },
  {
    id: 't_daemmung_taupunkt',
    difficulty: 'Mittel',
    title: 'Dämmung: Kondensatausfall bei Innendämmung (Glaser-Verfahren)',
    question: 'Sie planen eine Innendämmung ohne Dampfbremse auf einer 24 cm Ziegelwand. Warum fällt im Winter Tauwasser an der Trennschicht aus?',
    moduleHint: { id: 'daemmung_vergleich', name: 'Innendämmung vs. Außendämmung' },
    solution: 'Die Innendämmung entkoppelt das Mauerwerk thermisch vom geheizten Raum; die Bestandswand kühlt auf Außentemperaturniveau ab. Die warme, feuchte Raumluft diffundiert durch die dampfdurchlässige Dämmung ungehindert zur kalten Wandoberfläche. Unterschreitet die Bauteiltemperatur den Taupunkt der diffundierenden Luft, fällt flüssiges Wasser (Tauwasser) an der Kontaktzone aus. Eine raumseitige feuchtevariable Dampfbremse oder ein kapillaraktives System (Calciumsilikat) ist zwingend nötig.'
  },
  {
    id: 't_schall_din4109_rechnung',
    difficulty: 'Schwer',
    title: 'Schallschutz: Bauschalldämm-Maß R\'_w einer Kalksandsteinwand nach DIN 4109:2018',
    question: 'Eine Wohnungstrennwand besteht aus d = 17,5 cm Kalksandstein-Mauerwerk (Rohdichteklasse 2.0, d.h. \\rho = 2000 kg/m³) mit beidseitig 15 mm Gipsputz (Flächenmasse des Putzes: 2 \\times 20 kg/m² = 40 kg/m²). Die flankierenden Bauteile weisen schwere Massivdecken auf, sodass der Flankenkorrekturwert K_F = 2 dB beträgt.\n\na) Berechnen Sie die gesamte flächenbezogene Masse m\' der Wand.\nb) Berechnen Sie das Direktschalldämm-Maß R_w nach der DIN 4109-Massekurve für Massivbauteile: R_w = 32.4 \\cdot \\lg(m\') - 26,0 dB.\nc) Ermitteln Sie das Bauschalldämm-Maß R\'_w und prüfen Sie, ob die Mindestanforderung für Wohnungstrennwände (R\'_w,erf = 53 dB) eingehalten wird.',
    moduleHint: { id: 'rechnung_schallschutz', name: 'Musterrechnung Schallschutz' },
    solution: 'Berechnung nach DIN 4109-1 / DIN 4109-2:\n1. **Flächenbezogene Bauteilmasse ($m\'$):**\n   - Rohwand: $m\'_0 = d \\cdot \\rho = 0{,}175\\text{ m} \\times 2000\\text{ kg/m}^3 = 350{,}0\\text{ kg/m}^2$.\n   - Beidseitiger Putz: $m\'_{\\text{Putz}} = 40{,}0\\text{ kg/m}^2$.\n   - Gesamtmasse: $m\' = 350{,}0 + 40{,}0 = **390{,}0\\text{ kg/m}^2**$.\n2. **Direktes Schalldämm-Maß ($R_w$):**\n   $$R_w = 32{,}4 \\cdot \\lg(m\') - 26{,}0 = 32{,}4 \\cdot \\lg(390.0) - 26{,}0$$\n   $$R_w = 32{,}4 \\cdot 2.591 - 26{,}0 = 83{,}95 - 26{,}0 = **57{,}95\\text{ dB} \\approx 58{,}0\\text{ dB}$$\n3. **Bauschalldämm-Maß ($R\'_w$):**\n   $$R\'_w = R_w - K_F = 58{,}0\\text{ dB} - 2{,}0\\text{ dB} = **56{,}0\\text{ dB}$$\n4. **Normativer Nachweis:**\n   $$R\'_w = 56{,}0\\text{ dB} \\ge R\'_{w,\\text{erf}} = 53{,}0\\text{ dB}$$\n   Das Bauschalldämm-Maß übertrifft die Mindestanforderung der DIN 4109-1:2018 um **$3{,}0\\text{ dB}$**. Der Schallschutz ist baurechtlich sicher erfüllt.'
  },
  {
    id: 't_glaser_dampfdiffusion_s_d',
    difficulty: 'Schwer',
    title: 'Bauphysik: Wasserdampfdiffusionsäquivalente Luftschichtdicke (s_d-Wert) nach DIN 4108-3',
    question: 'Ein Flachdachaufbau besteht von innen nach außen aus:\n1. Stahlbetondecke: d = 20 cm, \\mu = 70/100 (diffusionsäquivalent)\n2. Bitumen-Dampfsperre: d = 4 mm, \\mu = 250.000\n3. PIR-Hartschaumdämmung: d = 16 cm, \\mu = 60\n4. EPDM-Dachabdichtung: d = 1,5 mm, \\mu = 40.000\n\na) Berechnen Sie die diffusionsäquivalente Luftschichtdicke s_d für jede Schicht.\nb) Warum muss die Dampfsperre unterhalb der Dämmung einen höheren s_d-Wert aufweisen als die äußere Dachabdichtung, um Bauschäden zu vermeiden?',
    moduleHint: { id: 'feuchteschutz', name: 'Feuchteschutz & Schimmel' },
    solution: 'Berechnung nach DIN 4108-3:\n1. **Berechnung der $s_d$-Werte ($s_d = \\mu \\cdot d$):**\n   - Stahlbeton: $s_d = 85 \\times 0{,}20\\text{ m} = **17{,}0\\text{ m}**$.\n   - Dampfsperre: $s_d = 250\\,000 \\times 0{,}004\\text{ m} = **1000{,}0\\text{ m}**$ (praktisch dampfdicht).\n   - PIR-Dämmung: $s_d = 60 \\times 0{,}16\\text{ m} = **9{,}6\\text{ m}**$.\n   - EPDM-Dachbahn: $s_d = 40\\,000 \\times 0{,}0015\\text{ m} = **60{,}0\\text{ m}**$.\n2. **Bauphysikalische Begründung:**\n   Bei einem nicht belüfteten Warmdach diffundiert im Winter Wasserdampf von warm (innen) nach kalt (außen). Wäre die innere Dampfsperre undicht oder hätte einen kleineren $s_d$-Wert als die äußere Abdichtung ($s_d = 60\\text{ m}$), würde mehr Feuchte in die Dämmschicht eintreten als durch die kalte Dachbahn nach außen entweichen kann. Die Feuchtigkeit würde unter der EPDM-Bahn kondensieren, die Dämmung durchfeuchten und zur Schimmel- und Fäulnisbildung führen. Die goldene Regel des Feuchteschutzes lautet: **Innen dichter als außen ($s_{d,\\text{innen}} \\gg s_{d,\\text{außen}}$)**.'
  }
];
