import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InlineMath, BlockMath } from 'react-katex';
import { 
  Layers, Droplets, Hammer, BookOpen, Calculator, Sparkles, 
  ChevronRight, Info, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight
} from 'lucide-react';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';

interface MortarProduct {
  id: string;
  name: string;
  normClass: string;
  strengthNmm2: string;
  densityKgM3: number;
  lambdaWmk: number;
  muValue: string;
  composition: string;
  advantages: string[];
  description: string;
  systemIntegration: string;
}

interface PlasterProduct {
  id: string;
  name: string;
  normClass: string;
  strengthCategory: string;
  composition: string;
  densityKgM3: number;
  lambdaWmk: number;
  muValue: string;
  thicknessMm: string;
  advantages: string[];
  description: string;
  systemIntegration: string;
}

interface BuildingSystem {
  id: string;
  type: 'mörtel' | 'putz';
  name: string;
  shirazCode: string;
  layers: string[];
  normref: string;
  advantages: string[];
  description: string;
  application: string;
}

const MORTAR_PRODUCTS: MortarProduct[] = [
  {
    id: 'normal_m5',
    name: 'Normalmauermörtel (NM) - Klasse M 5',
    normClass: 'DIN EN 998-2 / Typ NM',
    strengthNmm2: '≥ 5.0 N/mm² (Klasse M 5 / alt MG IIa)',
    densityKgM3: 1850,
    lambdaWmk: 0.83,
    muValue: '15/35',
    composition: 'Luftkalk- oder Hydratkalk-Suspension, Portlandzement als Festigkeitsträger, mineralischer Feinsand (Körnung 0–4 mm).',
    advantages: [
      'Ausgezeichnete Haftung an herkömmlichen Wandziegeln',
      'Hervorragendes elastisches Nachgiebigkeitsverhalten bei Setzungen',
      'Problemloser Ausgleich von Maßtoleranzen über dicke Fugen',
      'Optimierte Verarbeitbarkeit und lange Standzeit'
    ],
    description: 'Der bewährte Klassiker für das manuelle Aufmauern von tragenden und nichttragenden Wänden im Außen- und Innenbereich. Ermöglicht breite Lagerfugen zur Aufnahme statischer Lasten und dämpft Spannungen rissfrei ab.',
    systemIntegration: 'Verwendung im traditionellen Normalfugen-Mauerwerk mit standardmäßigen Stoß- und Lagerfugen.'
  },
  {
    id: 'leicht_m25',
    name: 'Leichtmauermörtel (LM) - Klasse M 2,5',
    normClass: 'DIN EN 998-2 / Typ LM 21',
    strengthNmm2: '≥ 2.5 N/mm² (Klasse M 2,5 / alt MG II)',
    densityKgM3: 700,
    lambdaWmk: 0.18,
    muValue: '5/15',
    composition: 'Bindemittelkombination aus Trasszement und Luftkalk, versetzt mit hochporösen wärmedämmenden Gesteinskörnungen (Bims, geblähtes Perlit).',
    advantages: [
      'Minimierung von Linien-Wärmebrücken im Lagerfugenbereich',
      'Hervorragend abgestimmte Saugfähigkeit für hochdämmende Ziegel',
      'Frostbeständigkeit trotz extrem geringer Schüttrohdichte',
      'Idealer Verformungsmodul für Leichtmauerwerk-Konstruktionen'
    ],
    description: 'Ein spezieller, wärmegedämmter Mauermörtel für den lückenlosen Bau hocheffizienter Außenwände. Durch die extrem feinen, luftgefüllten Poren der Zuschläge schützt er die Wand vor linienförmigem Wärmeabfluss.',
    systemIntegration: 'Verarbeitung bei hochdämmendem monolithischem Außenmauerwerk (z. B. Leichtziegeln oder Leichtbetonsteinen).'
  },
  {
    id: 'duennbett_m10',
    name: 'Dünnbettmörtel (DM) - Klasse M 10',
    normClass: 'DIN EN 998-2 / Typ DM',
    strengthNmm2: '≥ 10.0 N/mm² (Klasse M 10 / alt MG III)',
    densityKgM3: 1520,
    lambdaWmk: 0.61,
    muValue: '15/35',
    composition: 'Schnell erhärtender Portlandzement, feinster Quarzsand (Körnung 0–1 mm), organische Stellmittel (Methylcellulose) zur massiven Wasserrunzelung.',
    advantages: [
      'Enorm hohe Haftzugfestigkeit bei Fugenstärken von nur 1 bis 3 mm',
      'Fast vollständiger Ausschluss von Wärmebrücken im Fugenbett',
      'Minimale Feuchtigkeitseinbringung in die tragende Konstruktion',
      'Sehr schneller Baufortschritt durch präzises Planstein-Kleben'
    ],
    description: 'Hochleistungs-Klebermörtel für planebene Bauteile mit extrem geringen Maßtoleranzen. Gewährleistet ein fast fugenloses, monolithisches Mauersystem mit überlegener statischer Tragwirkung.',
    systemIntegration: 'Verwendung im modernen Plansteinmauerwerk bei plangeschliffenen Kalksandsteinen, Porenbetonsteinen oder Flachziegeln.'
  },
  {
    id: 'trass_m15',
    name: 'Trass-Natursteinfugenmörtel - Klasse M 15',
    normClass: 'DIN EN 998-2 / Trass-Ausmauerung',
    strengthNmm2: '≥ 15.0 N/mm² (Klasse M 15 / alt MG III)',
    densityKgM3: 1950,
    lambdaWmk: 1.10,
    muValue: '20/40',
    composition: 'Trassierter Zement (Trassmehl aus vulkanischem Tuffstein), Kieselsande in abgestufter Sieblinie, Dicht- und Stellmittel.',
    advantages: [
      'Chemische Bindung von freiem Kalk zur Verhinderung von Ausblühungen',
      'Extrem dichte Gefügematrix mit hohem Frost-Tauwiderstand',
      'Optimaler Schutz gegen eindringenden Schlagregen bei Sichtmauerwerk',
      'Hohe Flankenhaftung auch auf dichten, nicht-saugenden Gesteinsflächen'
    ],
    description: 'Spezialmörtel für Natursteinwände und historische Ausmauerungen. Der Trassanteil reagiert mit überschüssigem Calciumhydroxid und kapselt es im Kristallgefüge ein. Dies unterbindet weiße Kalkfahnen auf sanierten Sichtflächen komplett.',
    systemIntegration: 'Ausmauerung, Verlegung und nachträgliche Verfugung von Bruchstein- und Natursteinmauerwerken.'
  },
  {
    id: 'schamotte_of',
    name: 'Feuerfester Schamottemörtel (Tonmörtel)',
    normClass: 'Keramisch abbindend / Ofenbaurichtlinie',
    strengthNmm2: '≥ 10.0 N/mm² (nach Sinterprozess ab 600 °C)',
    densityKgM3: 1680,
    lambdaWmk: 0.90,
    muValue: '50/100',
    composition: 'Plastischer Ton, hochfein gemahlenes Schamottemehl (rezykliertes gebranntes Tonmaterial), Schmelzzementzusatz bei hydraulischen Ausführungen.',
    advantages: [
      'Hitzebeständig bis über 1200 °C ohne Gefügezerfall',
      'Gleicher thermischer Ausdehnungskoeffizient wie Schamottesteine',
      'Extrem rissfest bei extremen Temperaturwechseln (Aufheizen/Abkühlen)',
      'Keramisch sinternd für dauerhaften Feststoffverbund'
    ],
    description: 'Hochtemperaturbeständiger Fugenwerkstoff für den handwerklichen Kamin- und Kachelofenbau. Der Mörtel härtet erst voll aus, wenn die Brennkammer angeheizt wird und die Tonminerale im Sinterprozess verschmelzen.',
    systemIntegration: 'Verklebung von Schamottesteinen in Kuppelöfen, Brennkammern, Holzöfen und Kaminzügen.'
  }
];

const PLASTER_PRODUCTS: PlasterProduct[] = [
  {
    id: 'gips_gp',
    name: 'Gipsputzmörtel (Innenputz)',
    normClass: 'DIN EN 13279-1 / B1–B7',
    strengthCategory: 'Druckfestigkeit ≥ 2.0 N/mm²',
    composition: 'Besteht im Wesentlichen aus Calciumsulfat-Halbhydrat (CaSO₄·½H₂O), Gelöschtem Kalk (Kalkhydrat, Ca(OH)₂) als Verarbeitungsverbesserer, fein gemahlenem Gesteinsmehl (Kalksteinmehl CaCO₃) als Füllstoff sowie organischen Verzögerern (z.B. Weinsäurederivaten) zur Steuerung des Abbindewesens.',
    densityKgM3: 1000,
    lambdaWmk: 0.30,
    muValue: '10',
    thicknessMm: '10 - 15 mm (einlagig)',
    advantages: [
      'Erreicht extrem glatte Oberflächen für Malerarbeiten (Qualitätsstufen Q1–Q4)',
      'Hervorragendes Wohnklima durch feuchteregulierende Porenstruktur',
      'Sehr schnelles, kraftsparendes Abziehen und Glätten auf der Baustelle',
      'Inhärente Brandschutzwirkung durch gebundenes Kristallwasser'
    ],
    description: 'Der Standard-Innenputz für Decken und Wandscheiben im reinen Trockenbereich. Die kapillare Gips-Zellmatrix atmet aktiv mit, indem sie Luftfeuchtigkeit puffert und bei absinkender Feuchte wieder abgibt.',
    systemIntegration: 'Einschichtiger Wand- und Deckenbelag in Schlafzimmern, Büros und trockenen Aufenthaltsräumen.'
  },
  {
    id: 'luftkalk_cs1',
    name: 'Reiner Luftkalkputz (Dekorputz)',
    normClass: 'DIN EN 998-1 / Typ GP - CS I',
    strengthCategory: 'CS I (0.4 – 2.5 N/mm²)',
    composition: 'Besteht ausschließlich aus gelöschtem Luftkalk (Calciumhydroxid, Ca(OH)₂) als Bindemittel, wohldefiniertem, mehrfach gewaschenem Quarzsand (SiO₂, Körnung 0–2 mm) und rein mineralischen Zuschlägen. Absolut frei von Portlandzement, Kunstharzen oder synthetischen Zusätzen.',
    densityKgM3: 1300,
    lambdaWmk: 0.45,
    muValue: '6 - 10',
    thicknessMm: '15 - 20 mm (meist zweilagig)',
    advantages: [
      'Natürlicher, desinfizierender Schutz gegen Schimmelsporen (hoher pH-Wert > 11,5)',
      'Hervorragend diffusionsoffen und kapillaraktiv zur Mauerwerkslüftung',
      'Äußerst elastisches Gefüge zur rissfreien Verformungsübernahme',
      'Frei von chemischen Konservierungsstoffen und Bioziden'
    ],
    description: 'Der baubiologische Edelputz für Allergikerbereiche und historische Altbauten. Härtet sehr langsam unter dem Einfluss von Atmosphären-CO₂ (Karbonatisierung). Bindet schädliche Gase und reguliert Feuchtigkeit hervorragend.',
    systemIntegration: 'Mehrlagiger Wand- und Deckenputz im anspruchsvollen, gesunden Lehm- und Holzinnenausbau sowie in der Denkmalpflege.'
  },
  {
    id: 'kalkzement_cs2',
    name: 'Kalk-Zement-Leichtputz Typ II',
    normClass: 'DIN EN 998-1 / Typ LW - CS I bis CS II',
    strengthCategory: 'CS II (1.5 – 5.0 N/mm²)',
    composition: 'Kombiniertes Bindemittelsystem aus Portlandzement (CEM I nach DIN EN 197-1) zur hydraulischen Festigkeit und Calciumhydroxid (Kalkhydrat) zur Schmeidigkeit. Als Gesteinskörnung dienen Quarzsande sowie hohlraumreiche mineralische Leichtzuschläge wie geblähter Perlit oder Schaumglasgranulat.',
    densityKgM3: 1150,
    lambdaWmk: 0.23,
    muValue: '12',
    thicknessMm: '15 - 20 mm (zweilagig)',
    advantages: [
      'Hervorragende Balance aus hoher Festigkeit und elastischer Verformbarkeit',
      'Wetterbeständig, wasserleitend und frostunempfindlich',
      'Idealer, tragfähiger Untergrund für keramische Fliesenbeläge in Bädern',
      'Enthält Leichtzuschläge zur Vermeidung von Eigenspannungsrissen'
    ],
    description: 'Der universelle Außen- und Innenputz für nassbelastete Wände. Vereint die unkomplizierte Handhabung von Hydratkalk mit der Festigkeit und Wasserresistenz des Portlandzements.',
    systemIntegration: 'Standard-Trägerputz für Außenfassaden, feuchte Kellerinnenwände, häusliche WCs und Großküchen.'
  },
  {
    id: 'zement_cs4',
    name: 'Zement-Sockelputz (Nassbereich)',
    normClass: 'DIN EN 998-1 / Typ GP - CS IV',
    strengthCategory: 'CS IV (≥ 6.0 N/mm²)',
    composition: 'Hydraulisch hochfestes Bindemittelsystem mit dominierendem Gehalt an Portlandzement (CEM I), stufenweise abgestimmten Quarzsanden (Körnung 0–4 mm) zur Maximierung der Schüttdichte, sowie hydrophobierenden siliciumorganischen Wirkstoffen undErstarrungsbeschleunigern zur schlagartigen Wasserresistenz.',
    densityKgM3: 1750,
    lambdaWmk: 0.80,
    muValue: '25/50',
    thicknessMm: '15 - 20 mm (zweilagig)',
    advantages: [
      'Extrem widerstandsfähig gegen starke Stöße und mechanische Abnutzung',
      'Absolut wasserundurchlässig und hochgradig frostbeständig',
      'Dauerhaft standsicher im feuchtigkeitsbelasteten Erdberührungsbereich',
      'Höchste Haftzugfestigkeit auf rauem Beton- und Klinkermauerwerk'
    ],
    description: 'Hochfester Schutzputz für hochbelastete Erdschnittstellen. Härtet hydraulisch ab und bildet eine wasserdichte mineralische Barriere gegen Spritzwasser und Erdfeuchte.',
    systemIntegration: 'Verwendung im Spritzwassersockel von Fassaden, tiefen Kellerräumen und industriellen Nassbereichen.'
  },
  {
    id: 'sanier_r',
    name: 'Sanierputz Typ R (WTA-Zertifiziert)',
    normClass: 'DIN EN 998-1 / Typ R nach WTA-Merkblatt 2-9',
    strengthCategory: 'CS II (1.5 – 5.0 N/mm²)',
    composition: 'Sulfatbeständiges, trassiertes Bindemittelsystem auf Basis von Kalkhydrat und trassiertem Portlandzement (HS-Zement). Zur chemisch-stofflichen Funktion dienen klastischer Feinsand (Körnung 0–1.2 mm), künstliche Luftporenbildner (Alkylsulfate/Tenside) zur Etablierung makroporiger Evaporationsräume sowie organische Silan- bzw. Siloxanwirkstoffe (0.2–0.5 Gew.-%) zur vollständigen Kapillarhydrophobierung der inneren Porenkanäle.',
    densityKgM3: 1200,
    lambdaWmk: 0.30,
    muValue: '12',
    thicknessMm: '≥ 20 mm (meist zweilagig)',
    advantages: [
      'Dauerhaft trockene Wandoberfläche durch Verlagerung der Verdunstungsgrenze nach innen',
      'Künstliches Porensystem (> 25% Mikro-Luftporen) puffert Salzdrücke schadensfrei',
      'Extrem hohe Wasserdampf-Diffusionsoffenheit beschleunigt Wandtrocknung',
      'Verhindert zuverlässig feuchte Salzflecken und abblätternde Tapeten'
    ],
    description: 'Ein hochtechnologischer, WTA-überwachter Sanierungswerkstoff für feuchte Keller mit hoher Salzbelastung. Das künstlich gesteuerte Porensystem unterbricht den kapillaren Aufstieg von Salzlösungen, lässt das Wasser dampfförmig entweichen und lagert Salzkristalle rissfrei ein.',
    systemIntegration: 'Sanierungssystem für historischen Altbau, nasse Kellerwände und schwere Hochwasserschäden.'
  },
  {
    id: 'aerogel_t',
    name: 'Wärmedämmender Aerogel-Hochleistungsputz',
    normClass: 'DIN EN 998-1 / Typ T (Dämmputzmörtel)',
    strengthCategory: 'CS I (0.4 – 2.5 N/mm²)',
    composition: 'Synthetisch amorphes, ultrafeines Silicagel-Aerogel-Granulat (mittlere Partikelgröße 1.2–3.5 mm, Porenvolumen > 90%, Dichte 120–150 kg/m³), gebunden in Trasskalk (Ca(OH)₂ mit vulkanischem Trassmehl) und geringen Anteilen Portlandzement. Verstärkt durch mineralische Feinstfasern zur Stabilisierung gegen Schwindrisse.',
    densityKgM3: 220,
    lambdaWmk: 0.028,
    muValue: '4 - 6',
    thicknessMm: '40 - 80 mm (mehrlagig gespritzt)',
    advantages: [
      'Ultra-Wärmeleitfähigkeit (λ = 0,028 W/mK) schmiegt sich an historische Konturen an',
      'Kombiniert extreme Dämmwirkung mit mineralischer Brandklasse A1 (nicht brennbar)',
      'Hohlraumfreier Auftrag ohne Hinterlüftungsgefahr an feuchten Bestandsaußenwänden',
      'Vollkommen diffusionsoffenes, mineralisches, schimmelresistentes System'
    ],
    description: 'Ein absoluter Spitzenputz auf Silicagel-Aerogel-Basis. Ermöglicht hocheffiziente Energie-Innendämmungen und Außendämmungen an historisch sensiblen Denkmalfassaden, wo Plattendämmung (WDVS) geometrisch oder denkmalschutzrechtlich verboten ist.',
    systemIntegration: 'Energetische Sanierung unter Denkmalschutz, Ausbesserung von asymmetrischem, krummem Verblendmauerwerk.'
  }
];

const BUILDING_SYSTEMS: BuildingSystem[] = [
  {
    id: 'planstein_sys',
    type: 'mörtel',
    name: 'Plansteinmauerwerk-System mit Dünnbettkleber',
    shirazCode: 'Monolithisches Dünnbettmauerwerk',
    layers: [
      '1. Erste Schicht: Normalmauermörtel M 10 zur präzisen horizontierten Höhenausrichtung',
      '2. Wandstein: Plangeschliffener Ziegel, Kalksandstein oder Porenbetonblock',
      '3. Fugenbett: Dünnbettmörtel (Dicke 1.0–2.0 mm) mit Zahnkelle aufgetragen',
      '4. Stoßfugen: Knirsche, vermörtelungsfreie Nut-Feder-Verzahnung'
    ],
    normref: 'DIN EN 1996 (Eurocode 6) mit NA / DIN EN 998-2 i. V. m. DIN 20000-412 (Dünnbettmörtel)',
    advantages: [
      'Beseitigt mechanisch-hygrische Kältebrücken im Wandquerschnitt fast vollständig',
      'Erhöht die statische Belastbarkeit durch verringerten Fugenanteil',
      'Reduziert die Baufeuchtigkeit im Rohbau drastisch im Vergleich zu dicken Fugen',
      'Schnellste Montagezeiten bei optimaler Präzision'
    ],
    description: 'Das führende Montagesystem des modernen Tragwerksbaus. Plangeschliffene Oberseiten der Steine werden hauchdünn miteinander verschweißt. Dies spart Material und erhöht die thermische Leistungsfähigkeit.',
    application: 'Standard für moderne monolithische Einfamilienhäuser, hocheffiziente Bürowände und Wohnungstrennwände.'
  },
  {
    id: 'fassade_2lag_sys',
    type: 'putz',
    name: 'Zweilagiges klassisches Außenputz-System (Regenschutz)',
    shirazCode: 'Mineralischer Außenputzaufbau (Weich auf Hart)',
    layers: [
      '1. Untergrund: Massives Rohmauerwerk (Ziegel, Kalksandstein oder Porenbeton)',
      '2. Haftbrücke: Spritzbewurf (bei dichten Betonuntergründen)',
      '3. Unterputz: Kalk-Zement-Leichtputz (CS II, Dicke 15 mm) als Dicken-Ausgleich',
      '4. Zwischenbeschichtung: Putzgrundierung zur Saugfähigkeits-Rohdung',
      '5. Oberputz: Mineralischer Edelkratzputz oder Scheibenputz (CS I/II, Dicke 3 mm) als Wetterschale'
    ],
    normref: 'DIN 18550-1 / DIN EN 13914-1',
    advantages: [
      'Erfüllt den elastischen Verformungsgrundsatz "Weich auf Hart"',
      'Hocheffektiver Schutz vor Schlagregen und thermischen Spannungsrissen',
      'Prächtige mineralische Atmunghäufigkeit (geringes diffusionsäquivalentes s_d)',
      'Sehr langlebige Außenansicht ohne künstliche Biozid-Inhaltsstoffe'
    ],
    description: 'Der traditionell-technische Aufbau zum langlebigen Außenwandschutz. Die Verformungssteifigkeit (E-Modul) nimmt von innen nach außen ab, wodurch thermisch-hygrische Spannungen der äußeren Oberfläche rissfrei verteilt und absorbiert werden.',
    application: 'Fassadenverputz gängiger Wohn- und Geschäftshäuser auf mineralischem Massivmauerwerk.'
  },
  {
    id: 'wdvs_sys',
    type: 'putz',
    name: 'Wärmedämmverbundsystem-Putzsystem (WDVS)',
    shirazCode: 'Hochelastischer Gewebe-Armierungsaufbau',
    layers: [
      '1. Dämmschicht: EPS-Dämmplatten, Steinwolle- oder Holzfaserplatten, verklebt und gedübelt',
      '2. Putzgrundlage: Klebe- und Armierungsmörtel, dünnschichtig aufgetragen',
      '3. Armierung: Eingebettetes, alkaliresistentes Textilglasgewebe (Gewebearmierung)',
      '4. Oberputz: Silikonharzputz oder silikatischer Edelputz zur extremen Schlagregenbarriere'
    ],
    normref: 'Zulassungsgebundene WDVS-Systemrichtlinien / DIN 55699',
    advantages: [
      'Hochelastischer Aufbau verhindert thermischen Rissentstehungszug vollständig',
      'Maximale Beständigkeit gegen Algen- und Pilzbefall durch extreme Hydrophobierung',
      'Minimale Dickenentwicklung bei maximalem Heizenergie-Schnitt',
      'Überbrückt extreme Dimensionsänderungen der hochelastischen Dämmungsplatten'
    ],
    description: 'Spezialbeschichtung für weiche Dämmungen. Das elastische, mit Gitternetz verstärkte Gewebebett nimmt Zug- und Biegekräfte der äußeren Fassadenschale, welche durch Sonneneinstrahlung rasch heiß wird, schadensfrei auf.',
    application: 'Modernisierung von Altbauten, Außendämmung moderner Skelettbauten.'
  },
  {
    id: 'sanier_wta_sys',
    type: 'putz',
    name: 'Sanierungssystem nach WTA-Richtlinie',
    shirazCode: 'Systematisches Sanierputzverfahren',
    layers: [
      '1. Vorbereitung: Schadhaften salzzerstörten Altputz mind. 1 m über Schadensgrenze mechanisch abschlagen',
      '2. Tiefenreinigung: Fugen 20 mm tief auskratzen, Mauerwerk trocken bürsten',
      '3. Haftbrücke: Spritzbewurf netzartig zur Haftungsaufnahme (ca. 50% Abdeckung)',
      '4. Porenspeicher: Sanierputz WTA (CS II) mind. 20 mm dick zweilagig auftragen'
    ],
    normref: 'WTA-Merkblatt 2-9 / DIN V 18550-2',
    advantages: [
      'Geregelte Kristallisationskammer verhindert Oberflächenabbrüche vollständig',
      'Trocknet dauerhaft feuchte Kellerräume auf bauphysikalischer Dampfbasis',
      'Sperrt gelöste Salze (Sulfate, Nitrate, Chloride) mechanisch-chemisch ein',
      'Überbrückt Restfeuchte im Fundament rissfrei und optisch makellos'
    ],
    description: 'Das anerkannte Spezialverfahren für feuchtes Kellermauerwerk. Durch das riesige Porensystem wird der Verdunstungspunkt des Wassers ins Putzinnere verlagert. Salze blühen in den künstlichen Poren aus, ohne das Putzgefüge abzusprengen.',
    application: 'Denkmalgeschützte Sockelzonen, historische Gewölbe- und Kellerinstandsetzungen, feuchtes Ziegelmauerwerk.'
  }
];

export default function PutzeMoertel() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'moertel' | 'putze' | 'rechner' | 'reaktionen'>('steckbrief');
  const [selectedMortarId, setSelectedMortarId] = useState<string>('normal_m5');
  const [selectedPlasterId, setSelectedPlasterId] = useState<string>('gips_gp');
  const [selectedSystemId, setSelectedSystemId] = useState<string>('planstein_sys');

  // Calculator State - Plaster
  const [plasterArea, setPlasterArea] = useState<number>(50);
  const [plasterThickness, setPlasterThickness] = useState<number>(15);
  const [plasterType, setPlasterType] = useState<string>('gips');

  // Calculator State - Masonry Normalfuge
  const [masonryArea, setMasonryArea] = useState<number>(30);
  const [wallThickness, setWallThickness] = useState<string>('24.0');
  const [brickFormat, setBrickFormat] = useState<string>('nf');

  // Calculator State - Planstein Dünnbett
  const [plansteinArea, setPlansteinArea] = useState<number>(30);
  const [plansteinThickness, setPlansteinThickness] = useState<string>('30.0');

  // Find active selections
  const activeMortar = MORTAR_PRODUCTS.find(m => m.id === selectedMortarId) || MORTAR_PRODUCTS[0];
  const activePlaster = PLASTER_PRODUCTS.find(p => p.id === selectedPlasterId) || PLASTER_PRODUCTS[0];
  const activeSystem = BUILDING_SYSTEMS.find(s => s.id === selectedSystemId) || BUILDING_SYSTEMS[0];

  // Plaster calculation math
  const calculatePlaster = () => {
    const plasterFactors: Record<string, number> = {
      gips: 1.1,
      luftkalk: 1.3,
      kalkzement: 1.25,
      zement: 1.6,
      sanier: 1.2,
      aerogel: 0.28
    };
    const factor = plasterFactors[plasterType] || 1.2;
    const weight = plasterArea * plasterThickness * factor;
    const bags = Math.ceil(weight / 25);
    const water = weight * 0.26; // liters representation

    return {
      weight: parseFloat(weight.toFixed(1)),
      bags,
      water: parseFloat(water.toFixed(1))
    };
  };

  // Normalfuge calculation math
  const calculateNormalfuge = () => {
    const baseLiters: Record<string, number> = {
      df: 38,
      nf: 30,
      twoDF: 24,
      hlz: 18
    };
    const thicknessFactors: Record<string, number> = {
      '11.5': 1.0,
      '24.0': 2.1,
      '30.0': 2.6,
      '36.5': 3.2
    };
    const base = baseLiters[brickFormat] || 30;
    const tFactor = thicknessFactors[wallThickness] || 1.0;
    
    const totalLiters = masonryArea * base * tFactor;
    const dryWeight = totalLiters * 1.55; // 1.55 kg dry mix per liter of wet mortar
    const bags = Math.ceil(dryWeight / 25);
    const water = dryWeight * 0.21;
    
    return {
      liters: parseFloat(totalLiters.toFixed(1)),
      weight: parseFloat(dryWeight.toFixed(1)),
      bags,
      water: parseFloat(water.toFixed(1))
    };
  };

  // Planstein Dünnbett math
  const calculatePlanstein = () => {
    const thicknessVal = parseFloat(plansteinThickness);
    const adhesivePerM2 = (thicknessVal / 10.0) * 1.2;
    const totalWeight = plansteinArea * adhesivePerM2;
    const bags = Math.ceil(totalWeight / 25);
    const water = totalWeight * 0.26;
    
    return {
      weight: parseFloat(totalWeight.toFixed(1)),
      bags,
      water: parseFloat(water.toFixed(1))
    };
  };

  const plasterResult = calculatePlaster();
  const normalfugeResult = calculateNormalfuge();
  const plansteinResult = calculatePlanstein();

  return (
    <div className="flex flex-col gap-8">
      {/* Introduction Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Putze, Mörtel und Mauerwerkssysteme
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Mörtel- und Putzsysteme bilden das mineralische Schutzgerüst und das statische Verbundmedium im Hochbau. Ihre bauphysikalische Wirkungsweise ist streng reglementiert durch die Normenreihen <strong>DIN EN 998-1/2</strong>, <strong>DIN 18550</strong> und die anerkannten Regeln der Technik (aRdT). Erfahre hier alles über Normklassen, Zusammensetzung und baupraktische Systeme ohne herstellerspezifische Werbung.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button
            onClick={() => setActiveTab('steckbrief')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'steckbrief' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <BookOpen size={16} /> Baustoff-Steckbrief
          </button>
          <button
            onClick={() => setActiveTab('moertel')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'moertel' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Hammer size={16} /> 1. Mauermörtel
          </button>
          <button
            onClick={() => setActiveTab('putze')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'putze' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Droplets size={16} /> 2. Putzmörtel
          </button>
          <button
            onClick={() => setActiveTab('rechner')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'rechner' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Calculator size={16} /> 3. Material-Rechner
          </button>
          <button
            onClick={() => setActiveTab('reaktionen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'reaktionen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Sparkles size={16} /> 4. Erhärtung &amp; Bauphysik
          </button>
        </div>

        {/* Tab 0: Steckbrief */}
        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="putzemoertel" />
          </div>
        )}

        {/* Tab 1: Mörtel */}
        {activeTab === 'moertel' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Introduction info */}
            <div className="text-sm text-text-main/85 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p>
                <strong>Mauermörtel</strong> nach DIN EN 998-2 sind Gemische aus mineralischen Bindemitteln, feinen Gesteinskörnungen (Größtkorn ≤ 4 mm), Wasser und systemischen Zusatzmitteln. Sie bestimmen die Druck- und Scherfestigkeit des Mauerwerks und binden die Steine zu einer statischen Scheibe zusammen.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Product list sidebar (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 select-none">
                  Verfügbare Mauermörtel-Produkte (DIN EN 998-2)
                </h4>
                {MORTAR_PRODUCTS.map((prod) => (
                  <button
                    key={prod.id}
                    id={`btn-mortar-${prod.id}`}
                    onClick={() => setSelectedMortarId(prod.id)}
                    className={`p-3 text-left rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      selectedMortarId === prod.id
                        ? 'bg-shiraz/5 border-shiraz text-shiraz ring-1 ring-shiraz'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold leading-tight">{prod.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">{prod.normClass}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>

              {/* Detail view card (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm">
                <div>
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-shiraz tracking-wide font-mono block uppercase mb-1">
                        Bauproduktbeschreibung
                      </span>
                      <h3 className="text-base font-black text-slate-900 leading-tight">
                        {activeMortar.name}
                      </h3>
                    </div>
                    <span className="text-[10px] bg-white border border-slate-200 text-slate-800 px-2 py-1 rounded font-mono font-bold shrink-0">
                      {activeMortar.normClass}
                    </span>
                  </div>

                  {/* Physical Parameters Bento Grid */}
                  <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/30 border-b border-slate-100">
                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Nenn-Druckfestigkeit</span>
                      <span className="text-[11px] font-bold text-slate-800 leading-snug block mt-1">{activeMortar.strengthNmm2}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Prüf-Rohdichte</span>
                      <span className="text-xs font-mono font-black text-slate-800 block mt-1">{activeMortar.densityKgM3} kg/m³</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Wärmeleitf. λ_10</span>
                      <span className="text-xs font-mono font-black text-slate-800 block mt-1">{activeMortar.lambdaWmk.toFixed(2)} W/mK</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Dampf-Diff. µ</span>
                      <span className="text-xs font-mono font-black text-slate-800 block mt-1">µ = {activeMortar.muValue}</span>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="p-5 space-y-4 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                        <Info size={11} className="text-slate-400" /> Charakteristische Wirkungsweise
                      </h4>
                      <p className="text-slate-600 leading-relaxed">{activeMortar.description}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                        <ShieldCheck size={11} className="text-emerald-500" /> Ausgewählte Kriterien &amp; Vorteile
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600">
                        {activeMortar.advantages.map((adv, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span className="text-[11px] leading-tight font-medium">{adv}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#FCFAF7] p-3.5 rounded-xl border border-home-grau/30">
                      <h4 className="font-bold text-shiraz mb-1.5 flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                        <Layers size={11} /> Stoffliche Zusammensetzung &amp; Bindemittel
                      </h4>
                      <p className="text-slate-750 leading-relaxed text-[11.5px]">
                        {activeMortar.composition}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                  <span className="text-[9px] font-bold text-shiraz bg-shiraz/10 px-2 py-1 rounded uppercase tracking-wider font-mono">System-Verbindung:</span>
                  <p className="text-[11px] font-medium text-slate-600 flex-1 leading-normal">{activeMortar.systemIntegration}</p>
                </div>
              </div>
            </div>

            {/* Norm classification info table */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 mt-2">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <Info size={14} className="text-shiraz" /> Druckfestigkeitsklassen von Mauermörteln nach DIN EN 998-2
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px]">
                      <th className="p-2.5">Klassenbezeichnung (DIN EN)</th>
                      <th className="p-2.5">Mindestdruckfestigkeit (N/mm²)</th>
                      <th className="p-2.5">Entsprechung alte Norm (DIN 1053)</th>
                      <th className="p-2.5">Primäre Steinanwendung</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-slate-950">M 1</td>
                      <td className="p-2.5 font-mono">≥ 1.0</td>
                      <td className="p-2.5">Mörtelgruppe I (Luftkalk)</td>
                      <td className="p-2.5">Historisches Gurtmauerwerk, Natursteinmauerwerk</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-slate-950">M 2,5</td>
                      <td className="p-2.5 font-mono">≥ 2.5</td>
                      <td className="p-2.5">Mörtelgruppe II (Kalkzement)</td>
                      <td className="p-2.5">Aussteifungsmauerwerke, hochwärmedämmende Leichtziegel</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-slate-950">M 5</td>
                      <td className="p-2.5 font-mono">≥ 5.0</td>
                      <td className="p-2.5">Mörtelgruppe IIa (Kalkzement stark)</td>
                      <td className="p-2.5">Standard-Wohnungsbau tragendes Mauerwerk (Universal)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-slate-950">M 10</td>
                      <td className="p-2.5 font-mono">≥ 10.0</td>
                      <td className="p-2.5">Mörtelgruppe III (Zementmörtel)</td>
                      <td className="p-2.5">Stark beanspruchtes Mauerwerk, Kelleraußenwände, Gewölbe</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-slate-950">M 20</td>
                      <td className="p-2.5 font-mono">≥ 20.0</td>
                      <td className="p-2.5">Mörtelgruppe IIIa (Zementmörtel, höhere Festigkeit)</td>
                      <td className="p-2.5">Hochleistungsklinkermauern, Ingenieurbauwerke, Fundamente</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Putze */}
        {activeTab === 'putze' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Introduction info */}
            <div className="text-sm text-text-main/85 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p>
                <strong>Putzmörtel</strong> nach DIN EN 998-1 sind Beläge, die im frischen Zustand ein- oder mehrlagig auf tragendes Mauerwerk oder Beton aufgetragen werden. Sie schirmen die Fassade vor Feuchtigkeit ab, gleichen Toleranzen aus und bewirken über gezielte Diffusion eine optimale Wasserdampfpufferung der Raumzonen. Grundsätzlich gilt hierbei die Regel: <strong>Weich auf Hart</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Product list sidebar (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 select-none">
                  Spezial- und Standardputze (DIN EN 998-1)
                </h4>
                {PLASTER_PRODUCTS.map((prod) => (
                  <button
                    key={prod.id}
                    id={`btn-plaster-${prod.id}`}
                    onClick={() => setSelectedPlasterId(prod.id)}
                    className={`p-3 text-left rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      selectedPlasterId === prod.id
                        ? 'bg-shiraz/5 border-shiraz text-shiraz ring-1 ring-shiraz'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold leading-tight">{prod.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">{prod.normClass}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>

              {/* Detail view card (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm">
                <div>
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-shiraz tracking-wide font-mono block uppercase mb-1">
                        Bauproduktbeschreibung
                      </span>
                      <h3 className="text-base font-black text-slate-900 leading-tight">
                        {activePlaster.name}
                      </h3>
                    </div>
                    <span className="text-[10px] bg-white border border-slate-200 text-slate-800 px-2 py-1 rounded font-mono font-bold shrink-0">
                      {activePlaster.normClass.split(' / ')[0]}
                    </span>
                  </div>

                  {/* Physical Parameters Bento Grid */}
                  <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/30 border-b border-slate-100">
                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Festigkeitskategorie</span>
                      <span className="text-[11px] font-bold text-slate-800 leading-snug block mt-1">{activePlaster.strengthCategory}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Trockenrohdichte</span>
                      <span className="text-xs font-mono font-black text-slate-800 block mt-1">{activePlaster.densityKgM3} kg/m³</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Leitfähigkeit λ</span>
                      <span className="text-xs font-mono font-black text-slate-800 block mt-1">{activePlaster.lambdaWmk.toFixed(3)} W/mK</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Diffusion µ</span>
                      <span className="text-xs font-mono font-black text-slate-800 block mt-1">µ ≤ {activePlaster.muValue}</span>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="p-5 space-y-4 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                        <Info size={11} className="text-slate-400" /> Bauphysikalische Wirkungsweise
                      </h4>
                      <p className="text-slate-600 leading-relaxed">{activePlaster.description}</p>
                    </div>

                    <div className="bg-[#FCFAF7] p-3.5 rounded-xl border border-home-grau/30">
                      <h4 className="font-bold text-shiraz mb-1.5 flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                        <Layers size={11} /> Stoffliche Zusammensetzung &amp; Bindemittel
                      </h4>
                      <p className="text-slate-750 leading-relaxed text-[11.5px]">
                        {activePlaster.composition}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                        <ShieldCheck size={11} className="text-emerald-500" /> Wichtige Verarbeitungskriterien
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600">
                        {activePlaster.advantages.map((adv, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span className="text-[11px] leading-tight font-medium">{adv}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-150 flex justify-between items-center text-slate-500 text-[10px]">
                      <span>Regel-Schichtdicke: <strong>{activePlaster.thicknessMm}</strong></span>
                      <span className="font-mono">Norm: {activePlaster.normClass}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                  <span className="text-[9px] font-bold text-shiraz bg-shiraz/10 px-2 py-1 rounded uppercase tracking-wider font-mono">Systemeinbindung:</span>
                  <p className="text-[11px] font-medium text-slate-600 flex-1 leading-normal">{activePlaster.systemIntegration}</p>
                </div>
              </div>
            </div>

            {/* Putzsysteme interactive section */}
            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 mt-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <Layers size={14} className="text-shiraz" /> Systemaufbauten der Putz- &amp; Mörteltechnik
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                {BUILDING_SYSTEMS.map((sys) => (
                  <button
                    key={sys.id}
                    id={`btn-sys-${sys.id}`}
                    onClick={() => setSelectedSystemId(sys.id)}
                    className={`p-3 text-left rounded-xl border text-xs font-bold leading-snug cursor-pointer transition-all ${
                      selectedSystemId === sys.id
                        ? 'bg-shiraz text-white border-shiraz'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {sys.name.split(' (')[0]}
                  </button>
                ))}
              </div>

              {/* Active System Panel */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-[9px] font-extrabold text-slate-400 block uppercase font-mono">{activeSystem.shirazCode}</span>
                  <h4 className="font-black text-slate-950 text-sm mt-0.5 mb-2">{activeSystem.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{activeSystem.description}</p>
                  
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Regelwerk &amp; Standardbezug:</span>
                    <p className="text-xs font-mono font-bold text-slate-800">{activeSystem.normref}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 block uppercase mb-1.5">Aufbauschichten von innen nach außen:</span>
                    <ul className="space-y-1 text-xs">
                      {activeSystem.layers.map((layer, index) => (
                        <li key={index} className="p-2 bg-slate-50/50 rounded-lg border border-slate-100 flex items-start gap-2 text-slate-700">
                          <span className="w-5 h-5 rounded bg-shiraz/10 text-shiraz font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-[11px] font-medium leading-relaxed">{layer}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-150">
                    <span className="text-[9px] font-bold text-emerald-800 block uppercase mb-1">Leistungskriterien:</span>
                    <ul className="list-inside list-disc text-[10px] space-y-0.5 text-slate-700 font-medium">
                      {activeSystem.advantages.slice(0, 3).map((vorteil, idx) => (
                        <li key={idx}>{vorteil}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Rechner */}
        {activeTab === 'rechner' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/85 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p>
                Nutzen Sie den herstellerneutralen Material-Orientierungsrechner zur baupraktischen Bedarfsabschätzung auf der Baustelle. Die Kalkulationswerte enthalten branchenübliche Sicherheitsreserven und orientieren sich an den Vorgaben des Verbandes der Gipsindustrie und der Werkmörtelverbände.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Plaster Calculator Panel (Card 1) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5 text-sm uppercase tracking-tight">
                    <Droplets size={16} className="text-shiraz" /> 1. Putzmörtel-Abschätzung
                  </h3>

                  <div className="space-y-4 text-xs font-medium">
                    <div>
                      <label className="text-slate-500 block mb-1">Putzfläche (m²):</label>
                      <input 
                        type="number" 
                        value={plasterArea === 0 ? '' : plasterArea}
                        onChange={(e) => setPlasterArea(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-shiraz text-slate-800 font-bold"
                      />
                      <input 
                        type="range" 
                        min="1" 
                        max="250" 
                        value={plasterArea}
                        onChange={(e) => setPlasterArea(Number(e.target.value))}
                        className="w-full mt-1.5 accent-shiraz"
                      />
                    </div>

                    <div>
                      <label className="text-slate-500 block mb-1">Schichtstärke d (mm):</label>
                      <input 
                        type="number" 
                        value={plasterThickness === 0 ? '' : plasterThickness}
                        onChange={(e) => setPlasterThickness(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-shiraz text-slate-800 font-bold"
                      />
                      <input 
                        type="range" 
                        min="2" 
                        max="80" 
                        value={plasterThickness}
                        onChange={(e) => setPlasterThickness(Number(e.target.value))}
                        className="w-full mt-1.5 accent-shiraz"
                      />
                    </div>

                    <div>
                      <label className="text-slate-500 block mb-1">Putzmörtel-Art:</label>
                      <select 
                        value={plasterType}
                        onChange={(e) => setPlasterType(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 font-bold focus:outline-none"
                      >
                        <option value="gips">Gipsputz (~1.1 kg / mm / m²)</option>
                        <option value="luftkalk">Luftkalkputz (~1.3 kg / mm / m²)</option>
                        <option value="kalkzement">Kalk-Zement-Leichtputz (~1.25 kg / mm / m²)</option>
                        <option value="zement">Zement-Sockelputz (~1.6 kg / mm / m²)</option>
                        <option value="sanier">Sanierputz WTA (~1.2 kg / mm / m²)</option>
                        <option value="aerogel">Aerogel-Dämmputz (~0.28 kg / mm / m²)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 mt-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Trockenmischung:</span>
                    <span className="text-sm font-mono font-black text-slate-900">{plasterResult.weight} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Anteil Säcke (25 kg):</span>
                    <span className="text-sm font-mono font-black text-shiraz">{plasterResult.bags} Stk.</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Wasserbedarf ca.:</span>
                    <span className="text-xs font-mono font-bold text-slate-700">{plasterResult.water} Liter</span>
                  </div>
                </div>
              </div>

              {/* Masonry Normalfuge Panel (Card 2) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5 text-sm uppercase tracking-tight">
                    <Hammer size={16} className="text-shiraz" /> 2. Normalfugen-Mörtel
                  </h3>

                  <div className="space-y-4 text-xs font-medium">
                    <div>
                      <label className="text-slate-500 block mb-1">Wandfläche (m²):</label>
                      <input 
                        type="number" 
                        value={masonryArea === 0 ? '' : masonryArea}
                        onChange={(e) => setMasonryArea(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-shiraz text-slate-800 font-bold"
                      />
                      <input 
                        type="range" 
                        min="1" 
                        max="250" 
                        value={masonryArea}
                        onChange={(e) => setMasonryArea(Number(e.target.value))}
                        className="w-full mt-1.5 accent-shiraz"
                      />
                    </div>

                    <div>
                      <label className="text-slate-500 block mb-1">Mauerwerksstärke (cm):</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {['11.5', '24.0', '30.0', '36.5'].map((dim) => (
                          <button
                            key={dim}
                            id={`btn-thick-${dim}`}
                            onClick={() => setWallThickness(dim)}
                            className={`p-2 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                              wallThickness === dim
                                ? 'bg-shiraz text-white border-shiraz'
                                : 'bg-slate-50 text-slate-750 border-slate-200'
                            }`}
                          >
                            {dim} cm
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-500 block mb-1">Ziegel / Steinformat (NF):</label>
                      <select 
                        value={brickFormat}
                        onChange={(e) => setBrickFormat(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 font-bold focus:outline-none"
                      >
                        <option value="df">Dünnformat (DF) - 240x115x52 mm</option>
                        <option value="nf">Normalformat (NF) - 240x115x71 mm</option>
                        <option value="twoDF">Zweifaches Dünnformat (2DF) - 240x115x113 mm</option>
                        <option value="hlz">Hochlochziegel (HLz/Blockformat)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 mt-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Nass-Mörtelvolumen:</span>
                    <span className="text-sm font-mono font-black text-slate-900">{normalfugeResult.liters} Liter</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Trockengewicht ca.:</span>
                    <span className="text-sm font-mono font-black text-slate-900">{normalfugeResult.weight} kg</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-1.5 text-shiraz">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Säcke (25 kg):</span>
                    <span className="text-sm font-mono font-black">{normalfugeResult.bags} Stk.</span>
                  </div>
                </div>
              </div>

              {/* Planstein ThinBed Calculator Panel (Card 3) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5 text-sm uppercase tracking-tight">
                    <Layers size={16} className="text-shiraz" /> 3. Dünnbettkleber (Kleben)
                  </h3>

                  <div className="space-y-4 text-xs font-medium">
                    <div>
                      <label className="text-slate-500 block mb-1">Wandfläche (m²):</label>
                      <input 
                        type="number" 
                        value={plansteinArea === 0 ? '' : plansteinArea}
                        onChange={(e) => setPlansteinArea(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-shiraz text-slate-800 font-bold"
                      />
                      <input 
                        type="range" 
                        min="1" 
                        max="250" 
                        value={plansteinArea}
                        onChange={(e) => setPlansteinArea(Number(e.target.value))}
                        className="w-full mt-1.5 accent-shiraz"
                      />
                    </div>

                    <div>
                      <label className="text-slate-500 block mb-1">Mauerwerksstärke (cm):</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {['11.5', '17.5', '24.0', '30.0'].map((dim) => (
                          <button
                            key={dim}
                            id={`btn-plan-${dim}`}
                            onClick={() => setPlansteinThickness(dim)}
                            className={`p-2 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                              plansteinThickness === dim
                                ? 'bg-shiraz text-white border-shiraz'
                                : 'bg-slate-50 text-slate-750 border-slate-200'
                            }`}
                          >
                            {dim} cm
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-150 leading-relaxed text-slate-500 text-[11px]">
                      <p>Der Dünnbettkleber wird bei Plansteinmauerwerk mit dem Schlitten oder einer Spezialzahnbettwalze rissarm aufgetragen (Dicke 1–2 mm).</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 mt-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Gesamt-Trockenbedarf:</span>
                    <span className="text-sm font-mono font-black text-slate-900">{plansteinResult.weight} kg</span>
                  </div>
                  <div className="flex justify-between items-center text-shiraz">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Anteile Säcke (25 kg):</span>
                    <span className="text-sm font-mono font-black">{plansteinResult.bags} Stk.</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Wasserbedarf ca.:</span>
                    <span className="text-xs font-mono font-bold text-slate-700">{plansteinResult.water} Liter</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Reaktionen */}
        {activeTab === 'reaktionen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Intro */}
            <div className="text-sm text-text-main/85 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-2">
              <p>
                Die Erhärtung von Putzen und Mauermörteln ist ein komplexer mineralchemischer Prozess. Wir unterscheiden fundamentale Mechanismen zwischen rein hydrosilikatischen Abbindevorgängen bei Zementen und rein atmosphärischer Karbonatisierung (Kalksteinbildung aus CO2 der Luft) bei Kalkmörteln.
              </p>
            </div>

            {/* Grid of physical and chemical aspects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: Hydratation */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <span className="text-xs font-black text-shiraz uppercase tracking-widest block flex items-center gap-1">
                  <Sparkles size={14} /> 1. Hydratation (Hydraulische Erhärtung / Zement)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Zementgebundene Mörtelsysteme benötigen zur Aushärtung keinen gasförmigen Sauerstoff, sondern binden rein chemisch zugefügtes Anmachwasser ein. Klinkerphasen (Tricalciumsilikat <InlineMath math="\text{C}_3\text{S}" /> und Dicalciumsilikat <InlineMath math="\text{C}_2\text{S}" />) reagieren zu Calcium-Silikat-Hydrat (CSH) und Portlandit <InlineMath math="\text{Ca(OH)}_2" />.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Das CSH bildet mikroskopisch dichte, nadelartig verfilzte Kristallstrukturen aus. Diese Verzahnung begründet die extreme mechanische Druckfestigkeit, Stoß- und Wasserbeständigkeit von Kalk-Zement- und Zementputzen.
                </p>
                <div className="bg-[#FCFAF7] border border-home-grau/25 p-3 rounded-lg text-xs leading-relaxed text-slate-800">
                  <strong className="block mb-1 text-[11px] text-text-main font-bold">Hauptgleichung (stark vereinfacht):</strong>
                  <BlockMath math="2\,\text{Ca}_3\text{SiO}_5 + 6\,\text{H}_2\text{O} \longrightarrow 3\,\text{CaO}\cdot 2\,\text{SiO}_2\cdot 3\,\text{H}_2\text{O} + 3\,\text{Ca(OH)}_2" />
                </div>
              </div>

              {/* Box 2: Karbonatisierung */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <span className="text-xs font-black text-shiraz uppercase tracking-widest block flex items-center gap-1">
                  <Sparkles size={14} /> 2. Karbonatisierung (Atmosphärische Härtung)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reine Luftkalkputze härten vollkommen wasserunlöslich ab, indem sie Kohlendioxid (<InlineMath math="\text{CO}_2" />) aktiv aus der umgebenden Porenluft aufsaugen. Dieser langsame Vorgang läuft nur ab, wenn die Wand feucht ist und Raumluft ungehindert zirkulieren kann ("Carbonatisierungskatalyse").
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Durch Karbonatisierung von gelöschtem Kalk (Ca(OH)2 + CO2 → CaCO3 + H2O) entsteht stufenweise hochfester, kristalliner Kalkstein (Calcit, <InlineMath math="\text{CaCO}_3" />). Wird die frische Putzhaut mittels Zugluft im Sommer zu schnell ausgetrocknet, stirbt die Reaktion ab ("Aufbrennen") und der Putz kreidet oder bröckelt ab.
                </p>
                <div className="bg-[#FCFAF7] border border-home-grau/25 p-3 rounded-lg text-xs leading-relaxed text-slate-800">
                  <strong className="block mb-1 text-[11px] text-text-main font-bold">Hauptgleichung (Karbonatisierung):</strong>
                  <BlockMath math="\text{Ca(OH)}_2 + \text{CO}_2 \longrightarrow \text{CaCO}_3 + \text{H}_2\text{O}" />
                </div>
              </div>

              {/* Box 3: Künzel-Wetterschutzkriterien */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-widest block flex items-center gap-1 font-mono">
                  Die Formel nach Künzel (Schlagregenschutz)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Um zu ermitteln, ob ein Außenputz die Tragwand im Winter trocken hält, gilt die anerkannte Schlagregen-Formel nach Helmut Künzel (Fraunhofer-Institut für Bauphysik). Sie setzt den kapillaren Saugkoeffizienten <InlineMath math="w" /> und die Wasserdampf-Diffusionswiderstandszahl <InlineMath math="s_d" /> in ein ausgewogenes Verhältnis.
                </p>
                <div className="bg-[#FCFAF7] border border-home-grau/25 p-3 rounded-lg text-xs leading-relaxed text-slate-800 text-center">
                  <strong className="block mb-1 text-[11px] text-text-main font-bold">Künzel-Kriterienpaar (Optimalbereich):</strong>
                  <BlockMath math="w \cdot s_d \le 0{,}2\,\frac{\text{kg}}{\text{m}^2 \cdot \text{h}^{0{,}5} \cdot \text{m}}" />
                  <div className="mt-1 text-[11px] text-slate-600">
                    <InlineMath math="w \le 0{,}5\,\text{kg}/(\text{m}^2\cdot\text{h}^{0{,}5})" /> (wasserabweisend) | <InlineMath math="s_d \le 2{,}0\,\text{m}" /> (diffusionsoffen)
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fällt das Produkt kleiner als 0,2 aus, verdunstet im Frühjahr stets mehr Feuchte aus dem Mauerwerk nach außen, als die herbstlichen Schlagregen hineinpressen können. Die Wand bleibt dauerhaft riss- und trockenfest.
                </p>
              </div>

              {/* Box 4: Elastizität - "Weich auf Hart" */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-widest block flex items-center gap-1 font-mono">
                  Der "Weich auf Hart"-Grundsatz
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dieses eherne Grundgesetz der Putzfachpraxis regelt den mehrlagigen Schichtenaufbau mechanischer E-Moduln von innen nach außen. Bei thermischer Wechselbeanspruchung (z.B. knallende Sommersonne auf dunklerem Putz) dehnt sich die feine Außenschicht spürbar aus.
                </p>
                <div className="bg-[#FCFAF7] border border-home-grau/25 p-3 rounded-lg text-xs leading-relaxed text-slate-800 text-center">
                  <strong className="block mb-1 text-[11px] text-text-main font-bold">Verformungsverhältnis (Abstufung des E-Moduls):</strong>
                  <BlockMath math="E_{\text{Untergrund}} \ge E_{\text{Unterputz}} \ge E_{\text{Oberputz}}" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ist die äußere Schicht starrer (höherer E-Modul) als das innere Trägerwerk, können Eigenspannungen nicht über die elastische Matrix gepuffert werden. Die Spannungsspitzen zerstören das Gefüge und bewirken großflächige, tiefe Schalenbrüche und Ablösungen.
                </p>
              </div>

              {/* Box 5: Wissenschaftliche Salz- & Hydrophobierungsmechanik bei Sanierputzen */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 md:col-span-2">
                <span className="text-xs font-black text-shiraz uppercase tracking-widest block flex items-center gap-1.5">
                  <Sparkles size={14} /> 5. Bauschädliche Kristallisationschemie &amp; Silan-Hydrophobierung (WTA 2-9)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
                  <div className="space-y-2">
                    <h5 className="font-extrabold text-slate-800 uppercase text-[10px] tracking-tight mb-1">
                      Kryptofloreszenz &amp; Thermodynamische Sprengwirkung
                    </h5>
                    <p>
                      Wenn gelöste Salzionen (Sulfate <InlineMath math="\text{SO}_4^{2-}" />, Chloride <InlineMath math="\text{Cl}^-" />, Nitrate <InlineMath math="\text{NO}_3^-" />) im kapillaren Feuchtigkeitsstrom aufsteigen und verdunsten, kristallisieren sie aus. Findet dies in herkömmlichen, engen Mikroporen statt, dehnt sich das Kristallvolumen aus. Der resultierende Kristallisationsdruck übersteigt den Hydratationszusammenhalt bei weitem:
                    </p>
                    <div className="bg-[#FCFAF7] p-3 rounded-lg border border-home-grau/25 my-1 text-center font-mono">
                      <BlockMath math="\sigma_k = \frac{R \cdot T}{V_m} \cdot \ln\left(\frac{C}{C_0}\right) \ge 100\,\text{MPa}" />
                    </div>
                    <p>
                      Sanierputze lösen dieses Problem durch ein künstlich hergestelltes, massives Porenvolumen (≥ 40 Vol.-%) mit einem extrem hohen Anteil an schadfreien Makroporen (<InlineMath math="r \ge 0.1\,\mu\text{m}" />). Hier können die Salze frei wachsen und akkumulieren, ohne zerstörerische Drücke auf das Putzgefüge auszuüben.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-extrabold text-slate-800 uppercase text-[10px] tracking-tight mb-1">
                      Kondensationsreaktion der Alkylalkoxysilane
                    </h5>
                    <p>
                      Um ein kapillares Vordringen des flüssigen Salzwasser-Elektrolyts an die Luftgrenze zu blockieren, werden dem Sanierputz Silane oder Siloxane beigemischt. Diese hydrolysieren im frischen Mörtel mit dem Anmachwasser zu reaktiven Silanolen <InlineMath math="\text{R-Si(OH)}_3" /> und reagieren kovalent mit den silikatischen Bestandteilen (Quarzsand SiO₂ oder Calcium-Silikat-Hydraten CSH) der Porenwandung:
                    </p>
                    <div className="bg-[#FCFAF7] p-3 rounded-lg border border-home-grau/25 my-1 text-center font-mono">
                      <BlockMath math="\equiv\text{Si-OH} + \text{R-Si(OH)}_3 \rightarrow \, \equiv\text{Si-O-Si(OH)}_2\text{-R} + \text{H}_2\text{O}" />
                    </div>
                    <p>
                      Der organische Rest <InlineMath math="\text{R}" /> (lipophile Alkylgruppe) weist danach bürstenartig in den Porenraum und bewirkt eine Umkehr des kapillaren Benetzungswinkels auf <InlineMath math="\theta \ge 90^{\circ}" />. Flüssiges Wasser wird wirksam abgestoßen (stark hydrophob), während Wasserdampf ungehindert diffundieren kann.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Module Footer component with Literature and Wikipedia references */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Mörtel', url: 'https://de.wikipedia.org/wiki/M%C3%B6rtel' },
          { title: 'Putz (Baustoff)', url: 'https://de.wikipedia.org/wiki/Putz_(Baustoff)' },
          { title: 'Kalkstein', url: 'https://de.wikipedia.org/wiki/Kalkstein' },
          { title: 'Karbonatisierung (Beton)', url: 'https://de.wikipedia.org/wiki/Karbonatisierung_(Beton)' }
        ]} 
        literatur={[ 
          'Bundesverband der Gipsindustrie e.V.: Handbuch Trockenbau, Kapitel Gipsputze.',
          'VDPM (Verband für Dämmsysteme, Putz und Mörtel e. V., 2017 aus IWM und FV WDVS hervorgegangen): Technische Richtlinien und Merkblätter für Werkmörtel.',
          'Wendehorst Baustoffkunde, 27. Auflage, Vieweg+Teubner 2011',
          'Künzel, H.: Bauphysikalische Forschungsergebnisse zum Wetterschutz von Außenwänden.'
        ]} 
        regelwerke={[ 
          { title: 'DIN EN 998-1:2017-02 (Festlegungen für Mörtel im Mauerwerksbau - Teil 1: Putzmörtel)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 998-2:2017-02 (Festlegungen für Mörtel im Mauerwerksbau - Teil 2: Mauermörtel)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN 18550-1:2024-01 (Planung, Zubereitung und Ausführung von Außen- und Innenputzen - Teil 1: Ergänzende Festlegungen zu DIN EN 13914-1 für Außenputze)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN 18550-2:2018-01 (Planung, Zubereitung und Ausführung von Außen- und Innenputzen - Teil 2: Ergänzende Festlegungen zu DIN EN 13914-2 für Innenputze)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 13914-1:2016-09 (Planung, Zubereitung und Ausführung von Außenputzen)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 13914-2:2016-09 (Planung, Zubereitung und Ausführung von Innenputzen)', url: 'https://www.dinmedia.de/' },
          { title: 'WTA-Merkblatt 2-9-20/D (Sanierputzsysteme - Prüf- und Verarbeitungskriterien)', url: 'https://www.wta-gmbh.de/' }
        ]} 
        formeln={[
          { formel: 'Ca(OH)_2 + CO_2 \\rightarrow CaCO_3 + H_2O', erklaerung: 'Karbonatisierung (Lufterhärtung der Luftkalke durch CO2-Aufnahme aus der Luft)' },
          { formel: 'w \\cdot s_d \\le 0{,}2 \\quad \\frac{\\text{kg}}{\\text{m}^2 \\cdot \\text{h}^{0{,}5}} \\cdot \\text{m}', erklaerung: 'Schlagregenschutz-Formel nach Künzel (Kombination aus kapillarem Saugkoeffizient w und Diffusionswiderstand sd)' },
          { formel: 'E_{\\text{Untergrund}} \\ge E_{\\text{Unterputz}} \\ge E_{\\text{Oberputz}}', erklaerung: 'Elastizitätsmodul-Gefälle "Weich auf Hart" zur Vermeidung thermischer Schubspannungsrisse' }
        ]} 
      />
    </div>
  );
}
