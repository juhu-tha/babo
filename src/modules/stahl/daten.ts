import { formatDeWert, formatDeZahl } from '@/src/utils/numberFormat';

export const steelGrades = {
  'S235': { fy: 235, fu: 360 },
  'S355': { fy: 355, fu: 470 },
  'S460': { fy: 460, fu: 540 },
  'S690': { fy: 690, fu: 770 },
  'B500B': { fy: 500, fu: 540 },
  'B500A': { fy: 500, fu: 525 },
  'Y1860': { fy: 1660, fu: 1860 },
  'SAS670': { fy: 670, fu: 800 },
};

export const corrosionClasses = {
  'C1': 'Sehr gering (Beheizte Gebäude mit sauberer Atmosphäre)',
  'C2': 'Gering (Unbeheizte Gebäude, ländliche Bereiche)',
  'C3': 'Mäßig (Produktionsräume mit hoher Feuchte, Stadt- und Industrieatmosphäre)',
  'C4': 'Stark (Chemieanlagen, Küstenbereiche mit mäßiger Salzbelastung)',
  'C5': 'Sehr stark (Industriebereiche mit hoher Feuchte, Küstenbereiche mit hoher Salzbelastung)',
  'CX': 'Extrem (Offshore, extreme Industrieatmosphäre) – nach DIN EN ISO 12944-2',
};

export const steelProperties = {
  rho: 7850, // kg/m³
  lambda: 50, // W/(mK) – vereinfachter Konstantwert; EC3-1-2: 54 W/(mK) bei 20 °C, temperaturabhängig
  alpha: 1.2e-5, // 1/K
  cp: 440, // J/(kgK)
  E: 210000, // MPa
  G: 81000, // MPa
  nu: 0.3 // Poissonzahl
};

// EC3 Part 1-2 Reduction factors for Carbon Steel
export const getReductionFactors = (temp: number) => {
  const temps = [20, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];
  const ky = [1.0, 1.0, 1.0, 1.0, 1.0, 0.78, 0.47, 0.23, 0.11, 0.06, 0.04, 0.02, 0.0];
  const kE = [1.0, 1.0, 0.9, 0.8, 0.7, 0.6, 0.31, 0.13, 0.09, 0.0675, 0.045, 0.0225, 0.0];

  if (temp <= 20) return { ky: 1.0, kE: 1.0 };
  if (temp >= 1200) return { ky: 0.0, kE: 0.0 };

  for (let i = 0; i < temps.length - 1; i++) {
    if (temp >= temps[i] && temp <= temps[i + 1]) {
      const t = (temp - temps[i]) / (temps[i + 1] - temps[i]);
      return {
        ky: ky[i] + t * (ky[i + 1] - ky[i]),
        kE: kE[i] + t * (kE[i + 1] - kE[i])
      };
    }
  }
  return { ky: 1.0, kE: 1.0 };
};

export interface ExtendedSteelGrade {
  id: string;
  name: string;
  sub: string;
  werkstoffnummer: string;
  category: 'baustahl' | 'bewehrung' | 'spannstahl' | 'edelstahl';
  categoryLabel: string;
  norm: string;
  fy: number; // MPa
  fu: number; // MPa
  description: string;
  applications: string[];
  advantages: string[];
  exampleObject: {
    name: string;
    description: string;
    location: string;
  };
  carbonContent: string;
  density: string;
  ductility: string;
  weldability: string;
}

export interface StructuralProfile {
  id: string;
  name: string;
  type: string;
  Wpl_y: number; // cm³
  Area: number; // cm²
  weight: number; // kg/m
  height: number; // mm
  width: number; // mm
}

export const extendedSteelGrades: ExtendedSteelGrade[] = [
  {
    id: 'S235',
    name: 'S235JR',
    sub: 'Kostengünstiger Allrounder (Klassischer Baustahl)',
    werkstoffnummer: '1.0038',
    category: 'baustahl',
    categoryLabel: 'Konventioneller Baustahl',
    norm: 'DIN EN 10025-2',
    fy: 235,
    fu: 360,
    description: 'Der meistgenutzte Allround-Stahl für untergeordnete Tragwerke. Extrem gut formbar, hervorragend schweißbar und sehr preiswert. Besitzt im Vergleich zu höherfesten Güten eine sehr breite plastische Reserve.',
    applications: [
      'Gewerbliche Standardhallen und landwirtschaftliche Schuppen',
      'Treppenkonstruktionen, Geländer, Abdeckbleche, Handläufe',
      'Untergeordnete Tragwerksteile, Versteifungslaschen und Ankerplatten',
      'Dachpfetten, leichte Fassadenriegel und Koppelpfetten'
    ],
    advantages: [
      'Überall sofort ab Lager verfügbar',
      'Sehr kostengünstiges Vormaterial',
      'Fehlertolerante und unkomplizierte Schweißbarkeit (kein Vorwärmen)',
      'Hervorragende Kaltumformbarkeit und Zerspanbarkeit'
    ],
    exampleObject: {
      name: 'Typische Anwendung: Hallen- und Hochbau',
      description: 'Zweigelenkrahmen und Pfetten gering belasteter Hallen; die Bemessung wird oft von Steifigkeit und Stabilität bestimmt, nicht von der Festigkeit.',
      location: 'Lehrbeispiel'
    },
    carbonContent: '≤ 0,17 %',
    density: '7.850 kg/m³',
    ductility: 'Sehr hoch (Bruchdehnung A ≥ 26 %)',
    weldability: 'Hervorragend, ohne Sondermaßnahmen'
  },
  {
    id: 'S355',
    name: 'S355J2+N',
    sub: 'Die universelle Standardgüte im modernen Ingenieurbau',
    werkstoffnummer: '1.0577',
    category: 'baustahl',
    categoryLabel: 'Konventioneller Baustahl',
    norm: 'DIN EN 10025-2',
    fy: 355,
    fu: 470,
    description: 'Das unangefochtene Standardarbeitstier im modernen europäischen Stahl- und Verbundbau. Kombiniert eine um über 50 % höhere Streckgrenze gegenüber S235 mit ausgezeichneter Schweißbarkeit und Zähigkeit bei niedrigen Temperaturen (J2 = mind. 27 J Schlagenergie bei -20 °C).',
    applications: [
      'Hochbelastete Rahmentragwerke im Geschoss- und Industriebau',
      'Straßen- und Eisenbahnbrückenbau (standardisierte Verbundträger)',
      'Weitgespannte Hallenoberlichter und Fachwerkbinder',
      'Fundament- und Gründungsstrukturen von Windenergieanlagen'
    ],
    advantages: [
      'Höchste Wirtschaftlichkeit im normalen Tragwerksentwurf',
      'Reduziert Querschnittshöhen und Profilgewichte um bis zu 30% gegenüber S235',
      'Sehr gute Eignung zur vollautomatisierten NC-Schweißfertigung',
      'Ausgewogenes Verhältnis aus hoher Festigkeit und Duktilität'
    ],
    exampleObject: {
      name: 'Typische Anwendung: Brücken- und Industriebau',
      description: 'Geschweißte Hohlkasten- und I-Träger mit Ermüdungsbeanspruchung; Standardgüte im Brücken- und Kranbahnbau.',
      location: 'Lehrbeispiel'
    },
    carbonContent: '≤ 0,20 %',
    density: '7.850 kg/m³',
    ductility: 'Ausgezeichnet (Bruchdehnung A ≥ 22 %)',
    weldability: 'Gut (bei dicken Blechen wird mäßiges Vorwärmen empfohlen)'
  },
  {
    id: 'S460',
    name: 'S460N / M',
    sub: 'Hochfester Feinkornbaustahl für schlanke Konstruktionen',
    werkstoffnummer: '1.8901 / 1.8827',
    category: 'baustahl',
    categoryLabel: 'Hochfester Feinkornbaustahl',
    norm: 'DIN EN 10025-3/4',
    fy: 460,
    fu: 540,
    description: 'Ein thermo-mechanisch gewalzter (M) oder normalisierter (N) Feinkornbaustahl. Durch das mikrolegierte Gefüge (Zusatz von Niob/Vanadium) wird eine gesteigerte Streckgrenze bei gleichzeitig feinstem, zähem Korngefüge erreicht. Hervorragend gegen Sprödbruch gefeit.',
    applications: [
      'Hochhaus-Verbundstützen zur Minimierung des architektonischen Fußabdrucks',
      'Großbrückenbauten mit extremen Stützweiten',
      'Offshore-Gründungskonstruktionen (Monopiles und Jackets)',
      'Schlanke Zugglieder und hoch beanspruchte Knotenbleche'
    ],
    advantages: [
      'Enormer Gewichtsvorteil bei reinen Zug- oder Druckglieder',
      'Sehr hohe Tieftemperaturzähigkeit (bis zu -50 °C im Lieferzustand \'+ML\')',
      'Erlaubt verringerte Schweißnahtdicken (reduziert Montagezeiten und Nahtvolumen)',
      'Spezielle metallische Reinheit minimiert d. Gefahr von Terrassenbrüchen'
    ],
    exampleObject: {
      name: 'Typische Anwendung: hoch belastete Stützen',
      description: 'Stützen in Hochhäusern und Fachwerkstäbe: Die höhere Streckgrenze verringert Querschnitt und Eigengewicht.',
      location: 'Lehrbeispiel'
    },
    carbonContent: '≤ 0,16 %',
    density: '7.850 kg/m³',
    ductility: 'Gut (Bruchdehnung A ≥ 17 %)',
    weldability: 'Gut; verlangt qualifizierte Schweißverfahren und kontrollierte Abkühlung (t_8/5-Zeit)'
  },
  {
    id: 'S690',
    name: 'S690QL',
    sub: 'Höchstfester, wasservergüteter Feinkornbaustahl',
    werkstoffnummer: '1.8928',
    category: 'baustahl',
    categoryLabel: 'Hochfester Vergütungsstahl',
    norm: 'DIN EN 10025-6',
    fy: 690,
    fu: 770,
    description: 'Hochfester Stahl, der nach dem Walzen intensiv wasserabgeschreckt und anschließend angelassen wird (Vergüten). Ermöglicht Konstruktionen mit extremsten Traglasten bei minimalen Abmessungen. Erfordert höchste Schweißkompetenz im verarbeitenden Betrieb.',
    applications: [
      'Höchstbelastete Hauptträger von Mobilkranen und Schwertransportern',
      'Hochbeanspruchte Brückengelenke und hochfeste Fachwerkbögen',
      'Tunnelvortriebsmaschinen und hochbelaster Bergbau-Ausrüstung',
      'Extreme Hochhauskonstruktionen im seismisch aktiven asiatischen Raum'
    ],
    advantages: [
      'Maximale Gewichtseinsparung bei schweren Maschinen- oder Tragstrukturen',
      'Hervorragend geeignet für dynamisch höchstbelastete, schwingende Sonderteile',
      'Reduziert Fundamentlasten und Transportgewichte bei Fertigteilen im Brückenbau',
      'Enormes Energieeinsparpotenzial durch Materialmassen-Reduktion beim Transport'
    ],
    exampleObject: {
      name: 'Typische Anwendung: Gewichtsoptimierte Tragglieder',
      description: 'Hochbelastete Gurte, Mobilkrane und Sonderbauteile; Schweißen erfordert kontrollierte Wärmeführung.',
      location: 'Lehrbeispiel'
    },
    carbonContent: '≤ 0,20 % (Zusatz von Cr, Mo, B)',
    density: '7.850 kg/m³',
    ductility: 'Mäßig bis Gut (Bruchdehnung A ≥ 14 %)',
    weldability: 'Anspruchsvoll; strikte Einhaltung von Vorwärmtemperaturen zur Vermeidung von Kaltrissen zwingend erforderlich'
  },
  {
    id: 'Corten',
    name: 'S355J2W (Cortenst.)',
    sub: 'Wetterfester Baustahl mit selbstschützender Edelrostschicht',
    werkstoffnummer: '1.8965',
    category: 'baustahl',
    categoryLabel: 'Wetterfester Baustahl',
    norm: 'DIN EN 10025-5',
    fy: 355,
    fu: 470,
    description: 'Wetterfester Baustahl, der Kupfer, Chrom und Nickel als dünne Legierungskomponenten enthält. Durch die Witterung bildet sich an der Oberfläche eine festhaftende, dichte Sperrschicht aus Phosphaten und Sulfaten. Diese verlässig aufgeschüttete Schicht verlangsamt den weiteren Korrosionsfortschritt um den Faktor 10.',
    applications: [
      'Wartungsfreie Fassadenbekleidungen im repräsentativen Hochbau',
      'Stahlbrückenbauwerke im Schienennetz (vollständiger Verzicht auf Schutzanstrich)',
      'Lärmschutzwände, dekorative Tore und Landschaftsarchitektur',
      'Großskulpturen und Denkmäler im öffentlichen Raum'
    ],
    advantages: [
      'Kompletter Wegfall von Lackierungs- und regelmäßigen Wartungskosten',
      'Sehr hohe Umweltfreundlichkeit durch Verzicht auf VOC-haltige Farbsysteme',
      'Charakteristische, lebendige rotbraun-orangefarbene Patina',
      'Statisch äquivalent zu standardmäßigem S355J2 Baustahl einzurechnen'
    ],
    exampleObject: {
      name: 'Typische Anwendung: Fassaden und Brücken ohne Beschichtung',
      description: 'Wetterfester Stahl bildet eine schützende Patina; Abtragsrate und Zuschläge für die Wanddicke beachten, nicht für Chlorid- oder Dauerfeuchtebelastung.',
      location: 'Lehrbeispiel'
    },
    carbonContent: '≤ 0,16 %',
    density: '7.850 kg/m³',
    ductility: 'Ausgezeichnet (Bruchdehnung A ≥ 22 %)',
    weldability: 'Gut; Schweißzusatzstoffe müssen ebenfalls witterungsbeständig sein (z.B. kupferlegiert)'
  },
  {
    id: 'Edelstahl',
    name: '1.4404 (A4 / 316L)',
    sub: 'Nichtrostender, säure- und lochfraßbeständiger Edelstahl',
    werkstoffnummer: '1.4404',
    category: 'edelstahl',
    categoryLabel: 'Nichtrostender Edelstahl',
    norm: 'DIN EN 10088-4',
    fy: 240,
    fu: 530,
    description: 'Nichtrostender austenitischer Chrom-Nickel-Molybdän-Stahl. Durch ca. 2 - 2,5 % Molybdängehalt besitzt dieses Metall eine extrem hohe Beständigkeit gegen Lochfraß (Pitting) bei Beaufschlagung durch chloridhaltige Lösungen wie Tausalze, See- oder Badewasser. Extrem korrosionsgeschützt.',
    applications: [
      'Fassadenbefestigungen, Klinkertraganker und Sanierungsanker',
      'Tragende Deckenhänger und Schraubbolzen im Chloriddampfbereich von Hallenbädern',
      'Abwasserbehandlungsanlagen, Küstennahe Infrastrukturbauten',
      'Chemischer Laborbau, Lebensmittelindustrie und Pharmazie'
    ],
    advantages: [
      'Absoluter und dauerhafter Korrosionsschutz ohne jegliche metallische Schutzbeschichtung',
      'Sehr gute Tieftemperatureigenschaften (auch bei -200 °C zäh, kein Sprödbruch)',
      'Magnetisch extrem schwach (völlig unmagnetischer Austenit)',
      'Keine Zersetzung oder Verfärbung angrenzender Mauerwerksteile durch Rostwasser'
    ],
    exampleObject: {
      name: 'Schadensfall: Hallenbad Uster (1985)',
      description: 'Versagen von Deckenabhängungen aus nichtrostendem Stahl durch chloridinduzierte Spannungsrisskorrosion in Hallenbadatmosphäre. Seitdem gelten für Schwimmhallen besondere Werkstoffanforderungen.',
      location: 'Uster, Schweiz'
    },
    carbonContent: '≤ 0,03 % (Extrem aschearm)',
    density: '7.980 kg/m³',
    ductility: 'Herausragend (Bruchdehnung A ≥ 40 %)',
    weldability: 'Sehr gut schweißbar; benötigt jedoch präzises Formieren (Schutzgasflutung)'
  },
  {
    id: 'B500B',
    name: 'B500B (Betonstabstahl)',
    sub: 'Hochduktiler Bewehrungsstahl für den Stahlbetonbau (DIN 488 / EC2)',
    werkstoffnummer: '1.0439',
    category: 'bewehrung',
    categoryLabel: 'Bewehrungsstahl (Hochduktil B)',
    norm: 'DIN 488 / EC2',
    fy: 500,
    fu: 540, // f_tk = k · f_yk mit k ≥ 1,08
    description: 'Warmgewalzter und aus der Walzhitze angelassener Betonstabstahl mit gerippter Oberfläche (Thermex-Verfahren). Ausgelegt für formschlüssige Riss- und Zugkraftaufnahme im Stahlbetonverbund. Erfüllt die strenge europäische Duktilitätsklasse B mit einem Zug-Streckgrenzenverhältnis ft/fy ≥ 1.08.',
    applications: [
      'Biege- und Schubbewehrung in Fundamenten, Bodenplatten und Kellerwänden',
      'Hochbelastete Hochhausstützen und Rahmenknoten',
      'Brückenüberbauten, Kappen und Widerlager',
      'Tunnelinnenschalen und Schutzbauwerke'
    ],
    advantages: [
      'Garantierte Hochduktilität: Dehnung bei Höchstlast ε_uk ≥ 5,0 % sichert rechnerische Fließgelenke',
      'Hervorragender Verbundbeiwert durch 2- oder 4-reihige Rippenstruktur',
      'Ausgezeichnete Kaltbiegbarkeit um genormte Biegerollendurchmesser',
      'Problemlose Eignung für Schweißstöße (Abbrennstumpf-, Gaspress- und Schutzgasschweißen nach DIN EN ISO 17660)'
    ],
    exampleObject: {
      name: 'Typische Anwendung: Stabstahl im Stahlbetonbau',
      description: 'Längs- und Bügelbewehrung von Balken, Stützen und Gründungen; hohe Duktilität für Umlagerung.',
      location: 'Lehrbeispiel'
    },
    carbonContent: '≤ 0,22 % (CEV ≤ 0,50 %)',
    density: '7.850 kg/m³',
    ductility: 'Hochduktil (Klasse B: Agt ≥ 5,0 %, A ≥ 12 %)',
    weldability: 'Sehr gut schweißbar nach DIN EN ISO 17660'
  },
  {
    id: 'B500A',
    name: 'B500A (Betonstahlmatten)',
    sub: 'Normalduktiler Bewehrungsstahl für ebene Flächenbauteile (DIN 488)',
    werkstoffnummer: '1.0438',
    category: 'bewehrung',
    categoryLabel: 'Bewehrungsstahl (Normalduktil A)',
    norm: 'DIN 488-4',
    fy: 500,
    fu: 525,
    description: 'Kaltgezogener oder kaltgerippter Betonstahl zur automatisierten Fertigung punktgeschweißter Bewehrungsmatten (Lagermatten z.B. Q- und R-Matten) sowie Gitterträgern. Besitzt eine normalduktile Verformungsklasse A mit ft/fy ≥ 1.05.',
    applications: [
      'Geschossdeckenplatten und Elementdecken (Filigrandecken)',
      'Nicht drückendes Wasser abdichtende Kellerwände und Sohlplatten',
      'Bewehrung von Industrieestrichen und Fahrbahnplatten',
      'Fertigteilwerke für Wand- und Deckenelemente'
    ],
    advantages: [
      'Enorme Verlegegeschwindigkeit auf der Baustelle durch großformatige Matten (bis 6.0 x 2,3 m)',
      'Hohe Maßgenauigkeit der Maschenweiten und Stababstände',
      'Geringerer Verlegeaufwand und minimierte Personalkosten gegenüber Einzelstabbewehrung',
      'Wirtschaftliche Mindestbewehrung zur Rissbreitenbegrenzung'
    ],
    exampleObject: {
      name: 'Typische Anwendung: Betonstahlmatten',
      description: 'Flächenbewehrung von Decken und Bodenplatten; kaltverformt mit normaler Duktilität.',
      location: 'Lehrbeispiel'
    },
    carbonContent: '≤ 0,22 % (Kaltverfestigt)',
    density: '7.850 kg/m³',
    ductility: 'Normalduktil (Klasse A: Agt ≥ 2,5 %)',
    weldability: 'Werkseitig punktgeschweißt; Baustellenschweißen nach DIN EN ISO 17660 zulässig'
  },
  {
    id: 'B500C',
    name: 'B500C (Erdbebenstahl)',
    sub: 'Seismisch hochduktiler Bewehrungsstabstahl (DIN EN 1992-1-1 Anh. C)',
    werkstoffnummer: '1.0440',
    category: 'bewehrung',
    categoryLabel: 'Bewehrungsstahl (Hochduktil C)',
    norm: 'DIN EN 1992-1-1 Anh. C',
    fy: 500,
    fu: 575, // k ≥ 1,15 (EN 1992-1-1, Anhang C)
    description: 'Spezieller mikrolegierter oder thermomechanisch behandelter Bewehrungsstahl mit höchster plastischer Dehnfähigkeit für Erdbebengebiete und dynamische Beanspruchungen. Erfüllt die strengste europäische Duktilitätsklasse C mit einem Zug-Streckgrenzenverhältnis 1.15 ≤ ft/fy ≤ 1.35 und einer Dehnung bei Höchstlast ε_uk ≥ 7,5 %.',
    applications: [
      'Erdbebensichere Rahmenknoten, Stützen- und Riegelanschlüsse in seismischen Zonen',
      'Schutzbauwerke, Bunker und kerntechnische Anlagen mit Explosionslastannahmen',
      'Hochbelastete Brückenpfeiler mit zyklischer plastischer Energiedissipation',
      'Tunnelbauten im Gebirgsdruck- und Bergsenkungsbereich'
    ],
    advantages: [
      'Höchste garantierte plastische Rotationskapazität zur Ausbildung dissipativer Fließgelenke',
      'Verhindert sprödes Abreißen der Bewehrung bei zyklischer Überlastung im Katastrophenfall',
      'Oberes Streckgrenzenverhältnis begrenzt (ft/fy ≤ 1.35), um unkontrollierte Betonabplatzungen vor dem Stahlfließen zu vermeiden',
      'Hervorragende Kaltbiegeeigenschaften bei engen Biegeradien'
    ],
    exampleObject: {
      name: 'Typische Anwendung: Erdbebengebiete',
      description: 'Bauteile mit planmäßiger plastischer Verformung (Duktilitätsklasse C nach EN 1992-1-1, Anhang C); in Deutschland unüblich.',
      location: 'Lehrbeispiel'
    },
    carbonContent: '≤ 0,22 % (CEV ≤ 0,50 %)',
    density: '7.850 kg/m³',
    ductility: 'Extrem hoch (Klasse C: Agt ≥ 7,5 %, ft/fy ≥ 1.15)',
    weldability: 'Sehr gut schweißbar nach DIN EN ISO 17660'
  },
  {
    id: 'Y1860',
    name: 'Y1860 S7 (Spannlitze)',
    sub: 'Ultrahochfester Spannstahl für den Spannbetonbau (abZ des DIBt; prEN 10138-3 nur Entwurf)',
    werkstoffnummer: '1.8105',
    category: 'spannstahl',
    categoryLabel: 'Spannstahl (Litze)',
    norm: 'abZ (DIBt); prEN 10138-3 (Entwurf)',
    fy: 1660, // Rp0.2 (fp0.1k = 1600 MPa)
    fu: 1860, // fpk
    description: 'Patentierter, mehrfach kaltgezogener Eutektoid-Kohlenstoffstahl (ca. 0,82 % C), verseilt zu einer 7-drähtigen Litze mit thermomechanischer Reck- und Stabilisierungsglühung. Bietet die höchste Festigkeit aller Bauwerkstoffe bei extrem niedriger Spannungsrelaxation.',
    applications: [
      'Interne und externe Längsvorspannung von Großbrücken (Freivorbau, Taktschiebeverfahren)',
      'Vorgespannte Fertigteil-Dachbinder und TT-Deckenplatten mit großen Spannweiten (> 30 m)',
      'Spannbeton-Windkrafttürme (Hybridtürme) zur Vermeidung klaffender Fugen',
      'Vorgespannte Fels- und Dauererdanker für Baugruben und Talsperren'
    ],
    advantages: [
      'Nahezu 5-fache statische Zugtragfähigkeit gegenüber Normalbaustahl S355',
      'Verhindert Betonrissbildung und eliminiert Durchbiegungen durch gezielten inneren Druckspannungszustand',
      'Extrem niedrige Relaxation: Spannkraftverlust unter Dauerlast < 2,5 % nach 1000 h bei 20 °C',
      'Kompakter Hüllrohr-Querschnitt bei Bündelspanngliedern (z.B. 19- oder 31-Litzen-Anker)'
    ],
    exampleObject: {
      name: 'Typische Anwendung: Litzenspannglieder',
      description: 'Interne und externe Spannglieder im Brücken- und Hochbau.',
      location: 'Lehrbeispiel'
    },
    carbonContent: '0,80 - 0,85 % (Feinstlamellarer Perlit)',
    density: '7.850 kg/m³',
    ductility: 'Begrenzt elastoplastisch (Agt ≥ 3,5 %)',
    weldability: 'Streng verboten! Jeder Lichtbogenkontakt oder Schweißwärmeeintrag zerstört das Kaltziehgefüge (Versprödung/Bruchgefahr)'
  },
  {
    id: 'SAS670',
    name: 'SAS 670 / Y1050 (Spannstab)',
    sub: 'Warmgewalzter Gewindespannstahl für Geotechnik & Quervorspannung',
    werkstoffnummer: '1.8010',
    category: 'spannstahl',
    categoryLabel: 'Spannstahl (Gewindestab)',
    norm: 'abZ (DIBt); prEN 10138-4 (Entwurf)',
    fy: 670,
    fu: 800,
    description: 'Warmgewalzter, mikrolegierter Rundstahl mit beidseitig aufgewalzten Gewinderippen. Das durchgehende Grobgewinde erlaubt das bauseitige Ablängen an beliebiger Stelle und die kraftschlüssige Verbindung mittels Schraubmuffen und Verankerungsmuttern.',
    applications: [
      'Quervorspannung von Brückenfahrbahnplatten und Koppelanker',
      'Temporäre und permanente Baugrubenaussteifungen, Rückverankerungen und Mikropfähle',
      'Zuganker im Wasserbau, Spundwandverankerungen und Schwergewichtsmauern',
      'Turm-Segmentverspannung von Beton-Windkraftanlagen'
    ],
    advantages: [
      'Durchgehendes, schmutzunempfindliches Grobgewinde: Koppelung an jedem Punkt ohne Schweißen',
      'Hohe Robustheit gegen Baustellenbeschädigungen und rauen Baustellenbetrieb',
      'Einfaches Nachspannen oder Entspannen bei temporären Bauzuständen möglich',
      'Hervorragende dynamische Dauerschwingfestigkeit mit passenden Kugelbundmuttern'
    ],
    exampleObject: {
      name: 'Typische Anwendung: Verpressanker und Zugglieder',
      description: 'Rückverankerung von Baugrubenwänden, Felsanker und Zugstäbe.',
      location: 'Lehrbeispiel'
    },
    carbonContent: '0,40 - 0,55 %',
    density: '7.850 kg/m³',
    ductility: 'Gut (Agt ≥ 5,0 %, A ≥ 10 %)',
    weldability: 'Bedingt schweißbar (Sonderverfahren erforderlich); Koppelung erfolgt rein mechanisch über Gewindemuffen'
  }
];

export const structuralProfiles: StructuralProfile[] = [
  { id: 'IPE200', name: 'IPE 200', type: 'Schmaler I-Träger', Wpl_y: 220.6, Area: 28.48, weight: 22.4, height: 200, width: 100 },
  { id: 'IPE300', name: 'IPE 300', type: 'Schmaler I-Träger', Wpl_y: 628.4, Area: 53.81, weight: 42.2, height: 300, width: 150 },
  { id: 'HEB200', name: 'HEB 200', type: 'Breitflanschträger (Schwer)', Wpl_y: 642.5, Area: 78.08, weight: 61.3, height: 200, width: 200 },
  { id: 'HEB300', name: 'HEB 300', type: 'Breitflanschträger (Schwer)', Wpl_y: 1869.0, Area: 149.12, weight: 117.0, height: 300, width: 300 }
];

export interface SteelCurveDefinition {
  id: string;
  name: string;
  sub: string;
  werkstoffnummer: string;
  norm: string;
  color: string;
  category: 'baustahl' | 'hochfest' | 'sonder';
  categoryLabel: string;
  E: number; // MPa
  fy: number; // MPa (Streckgrenze fy bzw. Rp0.2)
  fu: number; // MPa (Zugfestigkeit)
  A: number; // % (Bruchdehnung)
  sh_strain: number; // % (Dehnung am Beginn der Kaltverfestigung)
  fu_strain: number; // % (Gleichmaßdehnung bei Höchstlast)
  frac_stress: number; // MPa (Bruchspannung nach Einschnürung)
  yieldType: 'ausgeprägt' | 'stetig';
  description: string;
  mechanism: string;
}

export const steelCurveDefinitions: SteelCurveDefinition[] = [
  {
    id: 'S235',
    name: 'S235JR',
    sub: 'Klassischer unlegierter Baustahl',
    werkstoffnummer: '1.0038',
    norm: 'DIN EN 10025-2',
    color: '#2563eb', // Blau
    category: 'baustahl',
    categoryLabel: 'Konventioneller Baustahl',
    E: 210000,
    fy: 235,
    fu: 360,
    A: 26.0,
    sh_strain: 2.2,
    fu_strain: 15.0,
    frac_stress: 260,
    yieldType: 'ausgeprägt',
    description: 'Sehr breites Lüders-Fließplateau (bis 2,2 %), extrem gutmütig, hohe plastische Verformungsreserven.',
    mechanism: 'Cottrell-Atmosphären blockieren Versetzungen bis ReH; danach freies Fließen bei ReL.'
  },
  {
    id: 'S355',
    name: 'S355J2+N',
    sub: 'Europäischer Standard-Ingenieurbaustahl',
    werkstoffnummer: '1.0577',
    norm: 'DIN EN 10025-2',
    color: '#A3113E', // Shiraz
    category: 'baustahl',
    categoryLabel: 'Konventioneller Baustahl',
    E: 210000,
    fy: 355,
    fu: 510,
    A: 22.0,
    sh_strain: 1.8,
    fu_strain: 13.0,
    frac_stress: 370,
    yieldType: 'ausgeprägt',
    description: 'Das unangefochtene Arbeitstier: 51 % höhere Streckgrenze als S235 bei hoher Duktilität und Kerbschlagarbeit.',
    mechanism: 'Normalisierendes Glühen erzeugt feines Ferrit-Perlit-Gefüge mit ausgeprägter Streckgrenze.'
  },
  {
    id: 'S460',
    name: 'S460N/M',
    sub: 'Feinkornbaustahl für schlanke Tragwerke',
    werkstoffnummer: '1.8901',
    norm: 'DIN EN 10025-3/4',
    color: '#d97706', // Bernstein
    category: 'baustahl',
    categoryLabel: 'Konventioneller Baustahl',
    E: 210000,
    fy: 460,
    fu: 600,
    A: 17.0,
    sh_strain: 1.1,
    fu_strain: 10.0,
    frac_stress: 460,
    yieldType: 'ausgeprägt',
    description: 'Kürzeres Fließplateau, mikrolegiert mit Niob und Vanadium zur maximalen Kornfeinung.',
    mechanism: 'Feinkornhärtung (Hall-Petch-Beziehung) steigert Streckgrenze ohne Sprödbruchgefahr.'
  },
  {
    id: 'S690',
    name: 'S690QL',
    sub: 'Wasservergüteter hochfester Baustahl',
    werkstoffnummer: '1.8928',
    norm: 'DIN EN 10025-6',
    color: '#7c3aed', // Violett
    category: 'hochfest',
    categoryLabel: 'Hochfester Feinkornbaustahl',
    E: 210000,
    fy: 690,
    fu: 820,
    A: 14.0,
    sh_strain: 0.53,
    fu_strain: 7.5,
    frac_stress: 660,
    yieldType: 'stetig',
    description: 'Kein ausgeprägtes Fließplateau mehr. Fließbeginn wird über die 0,2 %-Dehngrenze Rp0.2 definiert.',
    mechanism: 'Wasserabschrecken und Anlassen erzeugen angelassenen Martensit mit sehr hoher Versetzungsdichte.'
  },
  {
    id: 'S960',
    name: 'S960QL',
    sub: 'Ultrahochfester Vergütungsstahl',
    werkstoffnummer: '1.8933',
    norm: 'DIN EN 10025-6',
    color: '#b91c1c', // Dunkelrot
    category: 'hochfest',
    categoryLabel: 'Hochfester Feinkornbaustahl',
    E: 210000,
    fy: 960,
    fu: 1050,
    A: 10.0,
    sh_strain: 0.66,
    fu_strain: 5.0,
    frac_stress: 880,
    yieldType: 'stetig',
    description: 'Extrem steiler elastischer Anstieg, minimale Gleichmaßdehnung, kaum Verformungsvorwarnung.',
    mechanism: 'Ultrafeines Martensit-Bainit-Gefüge. Empfindlich gegen Wasserstoffeintrag und unkontrollierte Abkühlung.'
  },
  {
    id: 'B500B',
    name: 'Betonstahl B500B',
    sub: 'Hochduktiler Bewehrungsstabstahl',
    werkstoffnummer: '1.0439',
    norm: 'DIN 488 / EC2',
    color: '#059669', // Smaragdgrün
    category: 'sonder',
    categoryLabel: 'Bewehrungs- & Spannstahl',
    E: 205000,
    fy: 500,
    fu: 560,
    A: 12.0,
    sh_strain: 0.6,
    fu_strain: 5.0,
    frac_stress: 480,
    yieldType: 'ausgeprägt',
    description: 'Norm-Bewehrungsstahl (Duktilitätsklasse B) mit ft/fy ≥ 1.08 und Dehnung bei Höchstlast eps_uk ≥ 5,0 %.',
    mechanism: 'Thermex-Verfahren: Randschichtvergütung aus der Walzhitze mit duktilem Ferrit-Perlit-Kern.'
  },
  {
    id: 'Y1860',
    name: 'Spannstahl Y1860',
    sub: 'Kaltgezogene 7-drähtige Spannlitze',
    werkstoffnummer: '1.8105',
    norm: 'abZ (DIBt); prEN 10138-3 (Entwurf)',
    color: '#0284c7', // Helles Blau
    category: 'sonder',
    categoryLabel: 'Bewehrungs- & Spannstahl',
    E: 195000,
    fy: 1660, // Rp0.2 (fp0.1k = 1600 MPa)
    fu: 1860, // fpk
    A: 4.0, // Agt >= 3.5 %
    sh_strain: 1.05,
    fu_strain: 3.5,
    frac_stress: 1650,
    yieldType: 'stetig',
    description: 'Höchste statische Zugfestigkeit im Ingenieurbau. Kein Fließplateau, rein auf Dauerspannung optimiert.',
    mechanism: 'Patentierter, mehrfach kaltgezogener Eutektoid-Perlitstahl (ca. 0,8 % C) mit faseriger Gefügetextur.'
  },
  {
    id: 'B500A',
    name: 'Betonstahl B500A (Matten)',
    sub: 'Normalduktiler Mattenstahl (DIN 488)',
    werkstoffnummer: '1.0438',
    norm: 'DIN 488-4',
    color: '#10b981', // Helles Grün
    category: 'sonder',
    categoryLabel: 'Bewehrungs- & Spannstahl',
    E: 205000,
    fy: 500,
    fu: 525,
    A: 6.0,
    sh_strain: 0.35,
    fu_strain: 2.5,
    frac_stress: 470,
    yieldType: 'stetig',
    description: 'Kaltgezogener Betonstahl für Lagermatten. Geringeres Verfestigungsverhältnis ft/fy ≥ 1.05 und reduzierte Gleichmaßdehnung Agt ≥ 2,5 %.',
    mechanism: 'Kaltverformung durch Ziehen und Recken erzeugt hohe Versetzungsdichte ohne Fließplateau.'
  },
  {
    id: 'SAS670',
    name: 'Spannstab SAS 670',
    sub: 'Warmgewalzter Gewindespannstahl (Y1050)',
    werkstoffnummer: '1.8010',
    norm: 'abZ (DIBt); prEN 10138-4 (Entwurf)',
    color: '#0ea5e9', // Sky Blue
    category: 'sonder',
    categoryLabel: 'Bewehrungs- & Spannstahl',
    E: 205000,
    fy: 670,
    fu: 800,
    A: 10.0,
    sh_strain: 0.8,
    fu_strain: 5.0,
    frac_stress: 720,
    yieldType: 'stetig',
    description: 'Mikrolegierter warmgewalzter Gewindestab für Geotechnik und Quervorspannung mit kontinuierlicher Koppelbarkeit.',
    mechanism: 'Feinkörniges Ferrit-Perlit-Gefüge mit warm aufgewalzten Gewinderippen für mechanische Schraubverankerungen.'
  },
  {
    id: 'Edelstahl',
    name: 'Edelstahl 1.4404',
    sub: 'Austenitischer Chrom-Nickel-Molybdän-Stahl (V4A)',
    werkstoffnummer: '1.4404 / 316L',
    norm: 'DIN EN 10088-4',
    color: '#ec4899', // Pink
    category: 'sonder',
    categoryLabel: 'Nichtrostender Edelstahl',
    E: 200000,
    fy: 240, // Rp0.2
    fu: 580,
    A: 45.0,
    sh_strain: 0.32,
    fu_strain: 30.0,
    frac_stress: 420,
    yieldType: 'stetig',
    description: 'Typisches Ramberg-Osgood-Verhalten: Enorme Kaltverfestigung und unübertroffene Bruchdehnung (45 %).',
    mechanism: 'Kubisch-flächenzentriertes (kfz) Austenitgitter mit 12 dichten Gleitsystemen erlaubt maximale plastische Gleitung.'
  }
];

// Berechnet die physikalisch konsistente Spannung sigma [MPa] bei beliebiger Dehnung eps [%]
export const calculateSteelStressAtStrain = (steel: SteelCurveDefinition, eps: number): number => {
  if (eps <= 0) return 0;
  if (eps > steel.A) return 0; // Nach Bruch keine Spannung

  if (steel.yieldType === 'ausgeprägt') {
    const eps_el = (steel.fy / steel.E) * 100; // in %
    if (eps <= eps_el) {
      return steel.E * (eps / 100);
    }
    // Fließplateau (Lüders-Bereich)
    if (eps <= steel.sh_strain) {
      return steel.fy;
    }
    // Kaltverfestigungsbereich bis fu bei Gleichmaßdehnung fu_strain
    if (eps <= steel.fu_strain) {
      const t = (eps - steel.sh_strain) / (steel.fu_strain - steel.sh_strain);
      // t in [0, 1]: parabolischer Übergang mit horizontaler Tangente bei fu
      return steel.fy + (steel.fu - steel.fy) * (2 * t - t * t);
    }
    // Einschnürbereich bis zum Bruch
    const t = (eps - steel.fu_strain) / (steel.A - steel.fu_strain);
    return steel.fu - (steel.fu - steel.frac_stress) * t;
  } else {
    // Stetiger Fließübergang (Ramberg-Osgood / Vergütet / Kaltgezogen / Edelstahl)
    const s_prop = (steel.id === 'Edelstahl' ? 0.65 : 0.75) * steel.fy;
    const eps_prop = (s_prop / steel.E) * 100;
    const eps_p02 = (steel.fy / steel.E) * 100 + 0.2;

    if (eps <= eps_prop) {
      return steel.E * (eps / 100);
    }

    if (eps <= eps_p02) {
      const t = (eps - eps_prop) / (eps_p02 - eps_prop);
      // Glatter degressiver Übergang von s_prop exakt zu fy (Rp0,2)
      return s_prop + (steel.fy - s_prop) * (1 - Math.pow(1 - t, 1.6));
    }

    if (eps <= steel.fu_strain) {
      const t = (eps - eps_p02) / (steel.fu_strain - eps_p02);
      // Verfestigung von fy zu fu mit horizontaler Tangente bei fu
      return steel.fy + (steel.fu - steel.fy) * (2 * t - t * t);
    }

    // Einschnürbereich bis zum Bruch bei A
    const t = (eps - steel.fu_strain) / (steel.A - steel.fu_strain);
    return steel.fu - (steel.fu - steel.frac_stress) * t;
  }
};

// Liefert den qualitativen Zustand der Verformung
export const getSteelDeformationPhase = (steel: SteelCurveDefinition, eps: number) => {
  if (eps <= 0) return { phase: 'Ruhezustand', text: 'Unbelastet (σ = 0 MPa)', color: 'text-slate-500 bg-slate-100' };
  if (eps > steel.A) return { phase: 'Bruch (Versagen)', text: 'Bauteil getrennt / duktiler Scherbruch', color: 'text-red-700 bg-red-100' };

  if (steel.yieldType === 'ausgeprägt') {
    const eps_el = (steel.fy / steel.E) * 100;
    if (eps <= eps_el) {
      return { 
        phase: '1. Elastischer Bereich', 
        text: `Reversibel nach Hooke (E = ${formatDeWert(steel.E)} MPa)`, 
        color: 'text-blue-700 bg-blue-100' 
      };
    }
    if (eps <= steel.sh_strain) {
      return { 
        phase: '2. Fließplateau (Lüdersbänder)', 
        text: `Spannung verharrt konstant bei fy = ${formatDeWert(steel.fy)} MPa`, 
        color: 'text-amber-700 bg-amber-100' 
      };
    }
  } else {
    const s_prop = (steel.id === 'Edelstahl' ? 0.65 : 0.75) * steel.fy;
    const eps_prop = (s_prop / steel.E) * 100;
    const eps_p02 = (steel.fy / steel.E) * 100 + 0.2;

    if (eps <= eps_prop) {
      return { 
        phase: '1. Elastischer Bereich', 
        text: `Reversibel nach Hooke bis Proportionalitätsgrenze (~${formatDeZahl(s_prop, 0)} MPa)`, 
        color: 'text-blue-700 bg-blue-100' 
      };
    }
    if (eps <= eps_p02) {
      return { 
        phase: '2. Fließübergang (Dehngrenze)', 
        text: `Elastisch-plastischer Übergang bis Rp0,2 = ${formatDeWert(steel.fy)} MPa`, 
        color: 'text-purple-700 bg-purple-100' 
      };
    }
  }

  if (eps <= steel.fu_strain) {
    return { 
      phase: '3. Kaltverfestigung (Plastisch)', 
      text: `Plastische Reserve durch Versetzungsaufstau bis fu = ${formatDeWert(steel.fu)} MPa`, 
      color: 'text-emerald-700 bg-emerald-100' 
    };
  }

  return { 
    phase: '4. Einschnürung (Lokale Verengung)', 
    text: `Lokale Querschnittsreduktion bis zur Bruchdehnung A = ${formatDeWert(steel.A)} %`, 
    color: 'text-rose-700 bg-rose-100' 
  };
};

// Generiert die Punktreihe für Chart.js streng monoton steigend ohne Schleifen und Rücksprünge
export const generateSteelCurveDataPoints = (steel: SteelCurveDefinition) => {
  const points: { x: number; y: number }[] = [];
  const xSet = new Set<number>();

  const addPoint = (x: number) => {
    if (x >= 0 && x <= steel.A) {
      xSet.add(Number(x.toFixed(3)));
    }
  };

  addPoint(0);

  const eps_el = (steel.fy / steel.E) * 100;
  const eps_p02 = eps_el + 0.2;
  const s_prop = (steel.id === 'Edelstahl' ? 0.65 : 0.75) * steel.fy;
  const eps_prop = (s_prop / steel.E) * 100;

  // 1. Sehr dichte Abtastung im elastischen Bereich & Fließbeginn
  const elasticEnd = steel.yieldType === 'ausgeprägt' ? steel.sh_strain : eps_p02;
  const fineLimit = Math.min(steel.A, elasticEnd + 0.3);

  for (let e = 0.02; e <= fineLimit; e += 0.02) {
    addPoint(e);
  }

  // Wichtige Stützstellen einfügen
  if (steel.yieldType === 'ausgeprägt') {
    addPoint(eps_el);
    addPoint(eps_el + 0.015); // ReH Peak
    addPoint(eps_el + 0.04);  // Rückkehr zu ReL
    addPoint(steel.sh_strain);
  } else {
    addPoint(eps_prop);
    addPoint(eps_p02);
  }

  // 2. Kaltverfestigung
  const midStep = steel.fu_strain > 15 ? 0.4 : 0.2;
  for (let e = fineLimit; e <= steel.fu_strain; e += midStep) {
    addPoint(e);
  }
  addPoint(steel.fu_strain);

  // 3. Einschnürbereich
  const postStep = (steel.A - steel.fu_strain) > 10 ? 0.5 : 0.25;
  for (let e = steel.fu_strain + postStep; e <= steel.A; e += postStep) {
    addPoint(e);
  }
  addPoint(steel.A);

  // Exakt aufsteigend nach x sortieren
  const sortedX = Array.from(xSet).sort((a, b) => a - b);

  for (const x of sortedX) {
    if (steel.yieldType === 'ausgeprägt') {
      const eps_el_val = (steel.fy / steel.E) * 100;
      if (Math.abs(x - (eps_el_val + 0.015)) < 0.006) {
        points.push({ x, y: Number((steel.fy * 1.035).toFixed(1)) });
        continue;
      }
    }
    const y = calculateSteelStressAtStrain(steel, x);
    points.push({ x, y: Number(y.toFixed(1)) });
  }

  return points;
};
