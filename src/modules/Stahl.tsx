import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
  Filler
} from 'chart.js';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Flame, Minimize2, Maximize2, Activity, Sparkles, Info, Layers, BookOpen, Shield, TrendingDown, Scale, Check } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
  Filler
);

const steelGrades = {
  'S235': { fy: 235, fu: 360 },
  'S355': { fy: 355, fu: 470 },
  'S460': { fy: 460, fu: 540 },
  'S690': { fy: 690, fu: 770 },
  'B500B': { fy: 500, fu: 540 },
  'B500A': { fy: 500, fu: 525 },
  'Y1860': { fy: 1660, fu: 1860 },
  'SAS670': { fy: 670, fu: 800 },
};

const corrosionClasses = {
  'C1': 'Sehr gering (Beheizte Gebäude mit sauberer Atmosphäre)',
  'C2': 'Gering (Unbeheizte Gebäude, ländliche Bereiche)',
  'C3': 'Mäßig (Produktionsräume mit hoher Feuchte, Stadt- und Industrieatmosphäre)',
  'C4': 'Stark (Chemieanlagen, Küstenbereiche mit mäßiger Salzbelastung)',
  'C5': 'Sehr stark (Industriebereiche mit hoher Feuchte, Küstenbereiche mit hoher Salzbelastung)',
  'CX': 'Extrem (Offshore, extreme Industrieatmosphäre) – nach DIN EN ISO 12944-2',
};

const steelProperties = {
  rho: 7850, // kg/m³
  lambda: 50, // W/(mK) – vereinfachter Konstantwert; EC3-1-2: 54 W/(mK) bei 20 °C, temperaturabhängig
  alpha: 1.2e-5, // 1/K
  cp: 440, // J/(kgK)
  E: 210000, // MPa
  G: 81000, // MPa
  nu: 0.3 // Poissonzahl
};

// EC3 Part 1-2 Reduction factors for Carbon Steel
const getReductionFactors = (temp: number) => {
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

export default function Stahl() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'spannungsdehnung' | 'stahlsorten' | 'allgemein' | 'walzen' | 'schweissen' | 'legierungen'>('spannungsdehnung');

  // Spannungs-Dehnungs-Linien State
  const [selectedCurves, setSelectedCurves] = useState<string[]>(['S235', 'S355', 'S460', 'S690', 'B500B', 'Edelstahl']);
  const [strainZoom, setStrainZoom] = useState<'auto' | 'detail' | 'work' | 'full'>('auto');
  const [testStrain, setTestStrain] = useState<number>(1.5);
  const [simGradeId, setSimGradeId] = useState<string>('S235');

  const [grade, setGrade] = useState<keyof typeof steelGrades>('S355');
  const [corrosion, setCorrosion] = useState<keyof typeof corrosionClasses>('C3');
  const [temp, setTemp] = useState(20);
  const [detailCategory, setDetailCategory] = useState(80);
  const [deltaSigma, setDeltaSigma] = useState(150);
  const [m1, setM1] = useState(3);

  // Alloys State
  const [alloyCr, setAlloyCr] = useState<number>(18.0); // %
  const [alloyNi, setAlloyNi] = useState<number>(8.0); // %
  const [alloyMo, setAlloyMo] = useState<number>(0.0); // %
  const [alloyC, setAlloyC] = useState<number>(0.06); // %

  // Walzen State
  const [profileType, setProfileType] = useState<'h' | 'i'>('h'); // H-Profil (HEB) oder I-Profil (IPE)
  
  // Schweißen State
  const [heatInput, setHeatInput] = useState(1500); // J/mm
  const [plateThickness, setPlateThickness] = useState(15); // mm

  // Stahlsorten Visualizer & Rechner State
  const [steelCatalogFilter, setSteelCatalogFilter] = useState<'all' | 'baustahl' | 'bewehrung' | 'spannstahl' | 'edelstahl'>('all');
  const [reinforcementDeepDiveTab, setReinforcementDeepDiveTab] = useState<'bewehrung' | 'spannstahl'>('bewehrung');
  const [selectedStahlsorteId, setSelectedStahlsorteId] = useState<string>('S355');
  const [designMoment, setDesignMoment] = useState<number>(120); // kNm
  const [selectedProfileId, setSelectedProfileId] = useState<string>('IPE200');

  const filteredSteelGrades = useMemo(() => {
    if (steelCatalogFilter === 'all') return extendedSteelGrades;
    return extendedSteelGrades.filter(g => g.category === steelCatalogFilter);
  }, [steelCatalogFilter]);

  const activeProfile = useMemo(() => {
    return structuralProfiles.find(p => p.id === selectedProfileId) || structuralProfiles[0];
  }, [selectedProfileId]);

  const activeGradedData = useMemo(() => {
    return extendedSteelGrades.find(g => g.id === selectedStahlsorteId) || extendedSteelGrades[1];
  }, [selectedStahlsorteId]);

  const { fy, fu } = steelGrades[grade];
  const E0 = 210000; // MPa

  const { ky, kE } = getReductionFactors(temp);
  const fy_T = fy * ky;
  const E_T = E0 * kE;

  const walzResults = useMemo(() => {
    const labels = [];
    const stressData = [];
    
    // Vereinfachtes Eigenspannungsmodell für Flansche von Walzprofilen
    // Druckspannungen an den Rändern (kühlen schneller ab), Zugspannungen in der Mitte (kühlen langsamer ab)
    const points = 50;
    const width = 100; // % der Flanschbreite
    
    // Max Druckspannung an den Rändern (typischerweise 0.3 bis 0.5 f_y)
    const maxCompressiveRatio = profileType === 'h' ? 0.5 : 0.3; 
    const maxCompressive = -maxCompressiveRatio * fy;
    
    // Max Zugspannung in der Mitte (Gleichgewicht)
    const maxTensile = (maxCompressiveRatio / 2) * fy;

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width - width / 2; // -50% to 50%
      labels.push(`${x.toFixed(0)}%`);
      
      // Parabelform für die Eigenspannungsverteilung
      // sigma(x) = a * x^2 + c
      // Rand: x = 50 -> sigma = maxCompressive
      // Mitte: x = 0 -> sigma = maxTensile
      const a = (maxCompressive - maxTensile) / Math.pow(50, 2);
      const sigma = a * Math.pow(x, 2) + maxTensile;
      
      stressData.push(sigma);
    }

    return {
      maxCompressive,
      maxTensile,
      chartData: {
        labels,
        datasets: [
          {
            label: 'Eigenspannung σ_res (MPa)',
            data: stressData,
            borderColor: '#475569',
            backgroundColor: (context: any) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
              gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)'); // Zug (Rot)
              gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)'); // Druck (Blau)
              return gradient;
            },
            fill: true,
            tension: 0.4,
            pointRadius: 0
          },
          {
            label: 'Fließgrenze f_y (Zug)',
            data: labels.map(() => fy),
            borderColor: '#A3113E',
            borderDash: [5, 5],
            borderWidth: 1,
            pointRadius: 0,
            fill: false
          },
          {
            label: 'Fließgrenze -f_y (Druck)',
            data: labels.map(() => -fy),
            borderColor: '#A3113E',
            borderDash: [5, 5],
            borderWidth: 1,
            pointRadius: 0,
            fill: false
          }
        ]
      }
    };
  }, [fy, profileType]);

  const weldResults = useMemo(() => {
    const labels = [];
    const stressData = [];
    
    const points = 200;
    const distance = 150; // mm von der Schweißnahtmitte
    
    // Lehrmodell (Näherung nach Okerblom/Masubuchi), keine Bemessungsgrundlage
    // Max Zugspannung in der Schweißnaht entspricht meist der Fließgrenze
    const sigma_max = fy; 
    
    // Breite der Zugzone hängt von der Streckenenergie (Heat Input) und Blechdicke ab
    // Q = Heat Input (J/mm), t = thickness (mm)
    // Breite b_t proportional zu Q / t
    const b_t = Math.max(10, (heatInput / plateThickness) * 0.15); 

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * 2 * distance - distance; 
      labels.push(x.toFixed(0));
      
      // Näherungsfunktion für Längseigenspannungen
      // sigma(x) = sigma_max * (1 - (x/b_t)^2) * exp(-0.5 * (x/b_t)^2)
      const ratio = x / b_t;
      const sigma = sigma_max * (1 - Math.pow(ratio, 2)) * Math.exp(-0.5 * Math.pow(ratio, 2));
      
      stressData.push(sigma);
    }

    return {
      b_t,
      chartData: {
        labels,
        datasets: [
          {
            label: 'Längs-Eigenspannung σ_res (MPa)',
            data: stressData,
            borderColor: '#64748b',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0
          },
          {
            label: 'Fließgrenze f_y',
            data: labels.map(() => fy),
            borderColor: '#A3113E',
            borderDash: [5, 5],
            borderWidth: 1,
            pointRadius: 0,
            fill: false
          }
        ]
      }
    };
  }, [fy, heatInput, plateThickness]);

  const stressStrainData = useMemo(() => {
    const eps = [];
    const sig20 = [];
    const sigT = [];

    for (let e = 0; e <= 0.2; e += 0.005) {
      eps.push(e);
      
      // 20°C Curve (Simplified bi-linear with hardening)
      const eps_y20 = fy / E0;
      if (e <= eps_y20) sig20.push(e * E0);
      else if (e <= 0.02) sig20.push(fy);
      else sig20.push(fy + (fu - fy) * ((e - 0.02) / 0.18));

      // T°C Curve
      const eps_yT = fy_T / E_T;
      if (e <= eps_yT) sigT.push(e * E_T);
      else if (e <= 0.02) sigT.push(fy_T);
      else sigT.push(fy_T + (fu * ky - fy_T) * ((e - 0.02) / 0.18));
    }

    return {
      labels: eps.map(e => (e * 100).toFixed(1)),
      datasets: [
        {
          label: `Spannung bei 20°C`,
          data: sig20,
          borderColor: '#cbd5e1',
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0,
        },
        {
          label: `Spannung bei ${formatDeWert(temp)}°C`,
          data: sigT,
          borderColor: '#A3113E',
          backgroundColor: 'rgba(255, 3, 80, 0.1)',
          fill: true,
          borderWidth: 3,
          pointRadius: 0,
        }
      ]
    };
  }, [fy, fu, E0, fy_T, E_T, ky, temp]);

  const { nR, woehlerData } = useMemo(() => {
    const N_values = [1e4, 1e5, 2e6, 5e6, 1e7, 1e8];
    const delta_sigma = [];

    const nC = 2000000;
    const deltaSigmaC = detailCategory;
    
    const deltaSigmaD = deltaSigmaC * Math.pow(nC / 5e6, 1/m1);
    const deltaSigmaL = deltaSigmaD * Math.pow(5e6 / 1e8, 1/5);

    let nR = 0;
    if (deltaSigma > 0) {
      if (deltaSigma > deltaSigmaD) {
        nR = nC * Math.pow(deltaSigmaC / deltaSigma, m1);
      } else if (deltaSigma > deltaSigmaL) {
        nR = 5e6 * Math.pow(deltaSigmaD / deltaSigma, 5);
      } else {
        nR = Infinity;
      }
    }

    for (const N of N_values) {
      if (N <= 5e6) {
        delta_sigma.push(deltaSigmaC * Math.pow(nC / N, 1/m1));
      } else if (N <= 1e8) {
        delta_sigma.push(deltaSigmaD * Math.pow(5e6 / N, 1/5));
      } else {
        delta_sigma.push(deltaSigmaL);
      }
    }

    const chartData = {
      labels: N_values,
      datasets: [
        {
          label: `Wöhlerlinie (Kerbfall Δσ_C = ${formatDeWert(detailCategory)})`,
          data: delta_sigma,
          borderColor: '#A3113E',
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: '#A3113E',
          fill: false,
        },
        {
          label: 'Aktuelle Belastung',
          data: N_values.map(n => (Math.abs(Math.log10(n) - Math.log10(nR)) < 0.2) ? deltaSigma : null),
          borderColor: '#A3113E',
          backgroundColor: '#A3113E',
          pointRadius: 8,
          pointStyle: 'crossRot',
          borderWidth: 3,
          showLine: false,
        }
      ]
    };
    return { nR, woehlerData: chartData };
  }, [detailCategory, deltaSigma, m1]);

  // Aktive simulierte Stahlsorte für Dehnungsschieber
  const activeSimSteel = useMemo(() => {
    return steelCurveDefinitions.find(s => s.id === simGradeId) || steelCurveDefinitions[0];
  }, [simGradeId]);

  const activeCurveDefs = useMemo(() => {
    return steelCurveDefinitions.filter(s => selectedCurves.includes(s.id));
  }, [selectedCurves]);

  const maxActiveStress = useMemo(() => {
    if (activeCurveDefs.length === 0) return 600;
    return Math.max(...activeCurveDefs.map(s => s.fu));
  }, [activeCurveDefs]);

  const maxActiveStrain = useMemo(() => {
    if (activeCurveDefs.length === 0) return 25;
    return Math.max(...activeCurveDefs.map(s => s.A));
  }, [activeCurveDefs]);

  const simStress = useMemo(() => {
    return calculateSteelStressAtStrain(activeSimSteel, testStrain);
  }, [activeSimSteel, testStrain]);

  const simPhase = useMemo(() => {
    return getSteelDeformationPhase(activeSimSteel, testStrain);
  }, [activeSimSteel, testStrain]);

  // Chart-Datensätze für Spannungs-Dehnungs-Linien (Lineare Skala)
  const stressStrainMultiData = useMemo(() => {
    const activeDefs = activeCurveDefs;
    
    const datasets: any[] = activeDefs.map(def => {
      const pts = generateSteelCurveDataPoints(def);
      return {
        label: `${def.name} (fy = ${formatDeWert(def.fy)} MPa)`,
        data: pts,
        borderColor: def.color,
        backgroundColor: `${def.color}15`,
        borderWidth: def.id === simGradeId ? 3.5 : 2.2,
        tension: 0.15,
        pointRadius: 0,
        pointHoverRadius: 5,
      };
    });

    // Prüfdehnungs-Linie (vertikale Markierung)
    if (testStrain > 0) {
      const markerTop = Math.max(400, Math.ceil((maxActiveStress * 1.15) / 50) * 50);
      datasets.push({
        label: `Prüfdehnung ε = ${formatDeZahl(testStrain, 1)} %`,
        data: [
          { x: testStrain, y: 0 },
          { x: testStrain, y: markerTop }
        ],
        borderColor: '#64748b',
        borderDash: [4, 4],
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
      });

      // Schnittpunkt-Marker für die gewählte Bezugs-Stahlsorte
      if (simStress > 0) {
        datasets.push({
          label: `${activeSimSteel.name} @ ε = ${formatDeZahl(testStrain, 1)}% (${formatDeZahl(simStress, 0)} MPa)`,
          data: [{ x: testStrain, y: simStress }],
          borderColor: activeSimSteel.color,
          backgroundColor: '#ffffff',
          pointRadius: 7,
          pointBorderWidth: 3,
          showLine: false,
        });
      }
    }

    return { datasets };
  }, [activeCurveDefs, maxActiveStress, simGradeId, testStrain, activeSimSteel, simStress]);

  const stressStrainChartOptions = useMemo(() => {
    let maxX = 50;
    let stepX = 5;

    if (strainZoom === 'detail') {
      maxX = 3.0;
      stepX = 0.5;
    } else if (strainZoom === 'work') {
      maxX = 15.0;
      stepX = 2.0;
    } else if (strainZoom === 'full') {
      maxX = 50.0;
      stepX = 5.0;
    } else {
      // 'auto': Automatische Skalierung basierend auf den aktuell gewählten Kurven
      if (maxActiveStrain <= 4.5) {
        maxX = 5.0;
        stepX = 0.5;
      } else if (maxActiveStrain <= 7.0) {
        maxX = 8.0;
        stepX = 1.0;
      } else if (maxActiveStrain <= 15.0) {
        maxX = Math.ceil(maxActiveStrain * 1.12);
        stepX = 2.0;
      } else if (maxActiveStrain <= 30.0) {
        maxX = Math.ceil(maxActiveStrain * 1.10 / 5) * 5;
        stepX = 5.0;
      } else {
        maxX = 50.0;
        stepX = 5.0;
      }
    }

    // Y-Achse dynamisch skalieren: automatische Obergrenze mit 12% Headroom
    const suggestedMaxY = Math.max(350, Math.ceil((maxActiveStress * 1.12) / 50) * 50);
    const stepY = suggestedMaxY >= 1800 ? 250 : suggestedMaxY >= 900 ? 100 : 50;

    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 350
      },
      scales: {
        x: {
          type: 'linear' as const,
          min: 0,
          max: maxX,
          title: {
            display: true,
            text: 'Dehnung ε (%)',
            font: { family: 'Work Sans', weight: 'bold' as const, size: 12 },
            color: '#1e293b'
          },
          ticks: {
            stepSize: stepX,
            callback: (v: any) => `${v} %`,
            font: { size: 11, weight: 'bold' as const },
            color: '#475569'
          },
          grid: { color: 'rgba(0,0,0,0.06)' }
        },
        y: {
          min: 0,
          max: suggestedMaxY,
          title: {
            display: true,
            text: 'Spannung σ (MPa bzw. N/mm²)',
            font: { family: 'Work Sans', weight: 'bold' as const, size: 12 },
            color: '#A3113E'
          },
          ticks: {
            stepSize: stepY,
            callback: (v: any) => `${v} MPa`,
            font: { size: 11 },
            color: '#64748b'
          },
          grid: { color: 'rgba(0,0,0,0.06)' }
        }
      },
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            boxWidth: 12,
            usePointStyle: true,
            font: { family: 'Work Sans', size: 11, weight: 'bold' as const }
          }
        },
        tooltip: {
          callbacks: {
            title: (items: any) => {
              if (!items.length) return '';
              const xVal = items[0].parsed.x;
              return `Dehnung ε = ${formatDeZahl(xVal, 2)} % (${formatDeZahl((xVal * 10), 1)} ‰)`;
            },
            label: (context: any) => {
              const yVal = context.parsed.y;
              return `${context.dataset.label}: ${formatDeZahl(yVal, 1)} MPa`;
            }
          }
        }
      }
    };
  }, [strainZoom, maxActiveStrain, maxActiveStress]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Activity className="text-shiraz" /> Stahl im Bauwesen
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Stahl ist einer der leistungsfähigsten und flexibelsten Baustoffe im modernen Ingenieurbau. Seine hervorragende Tragfähigkeit bei Zug- wie Druckbeanspruchung und sein ausgeprägtes plastisches Verformungsverhalten sind die Säulen weitgespannter Tragwerke.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button aria-pressed={activeTab === 'steckbrief'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'steckbrief' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steckbrief')}
          >
            <BookOpen size={16} /> Baustoff-Steckbrief
          </button>
          <button aria-pressed={activeTab === 'spannungsdehnung'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'spannungsdehnung' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('spannungsdehnung')}
          >
            <Activity size={16} /> Spannungs-Dehnungs-Linien
          </button>
          <button aria-pressed={activeTab === 'stahlsorten'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'stahlsorten' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('stahlsorten')}
          >
            <Layers size={16} /> Stahlwerkstoffe &amp; Güten
          </button>
          <button aria-pressed={activeTab === 'allgemein'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <Shield size={16} /> Allgemein &amp; Ermüdung
          </button>
          <button aria-pressed={activeTab === 'walzen'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'walzen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('walzen')}
          >
            <Minimize2 size={16} /> Walzprofile (Eigenspannungen)
          </button>
          <button aria-pressed={activeTab === 'schweissen'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'schweissen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('schweissen')}
          >
            <Flame size={16} /> Schweißverbindungen
          </button>
          <button aria-pressed={activeTab === 'legierungen'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'legierungen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('legierungen')}
          >
            <Sparkles size={16} /> Legierungen &amp; Edelstahl
          </button>
        </div>

        {(activeTab === 'allgemein' || activeTab === 'walzen' || activeTab === 'schweissen' || activeTab === 'legierungen') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          <div className="lg:col-span-4 bg-off-white p-5 rounded-2xl border border-home-grau/25 flex flex-col gap-6">
            <h3 className="text-base font-bold text-text-main">
              Stahlwerkstoffe {activeTab === 'walzen' && '- Walzprofile'} {activeTab === 'schweissen' && '- Schweißen'} {activeTab === 'legierungen' && '- Legierungen & Edelstahl'}
            </h3>
            
            <div className="text-sm text-text-main/80 bg-white p-4 rounded-xl border border-home-grau/20">
            {activeTab === 'allgemein' ? (
              <p>
                Stahl verliert bei hohen Temperaturen (Brandfall) drastisch an Festigkeit und Steifigkeit. Zudem ist Stahl bei zyklischer Beanspruchung ermüdungsgefährdet (Wöhlerlinie).
              </p>
            ) : activeTab === 'walzen' ? (
              <p>
                Eigenspannungen in warmgewalzten Stahlprofilen entstehen durch ungleichmäßiges Abkühlen. Die dünneren Flanschenden kühlen schneller ab und schwinden, während der Kern noch warm ist. Kühlt der Kern später ab, wird er durch die bereits erstarrten Ränder am Schwinden gehindert. Dies führt zu <strong>Druckeigenspannungen an den Rändern</strong> und <strong>Zugeigenspannungen im Kern</strong>. Diese Spannungen reduzieren den Knickwiderstand (Euler-Knicken) von Stützen maßgeblich!
              </p>
            ) : activeTab === 'schweissen' ? (
              <p>
                Beim Schweißen wird lokal sehr viel Wärme eingebracht. Das Schweißgut und die Wärmeeinflusszone (WEZ) dehnen sich aus und werden beim anschließenden Abkühlen durch das umliegende, kalte Material am Schwinden gehindert. Dies führt zu extrem hohen <strong>Zugeigenspannungen (oft in Höhe der Fließgrenze)</strong> im Bereich der Naht und ausgleichenden Druckspannungen in den Randbereichen.
              </p>
            ) : (
              <p>
                Edelstahl und Rostfreie Stähle verdanken ihre hervorragenden Korrosionseigenschaften bestimmten Legierungszusätzen wie Chrom (Cr) und Molybdän (Mo). Ein Chromgehalt von mind. 10,5 % ist Voraussetzung für die Bildung der passivierenden Schutzschicht.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Stahlsorte</label><InfoTooltip text="Güteklasse des verwendeten Stahls." /></div>
            <select aria-label="Stahlsorte" 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
              value={grade}
              onChange={(e) => setGrade(e.target.value as keyof typeof steelGrades)}
            >
              {Object.keys(steelGrades).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            
            {activeTab === 'allgemein' && (
              <div className="mt-2 p-3 bg-white rounded-lg border border-home-grau/30 text-sm">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-main/60">Dichte <FormulaText text="\rho" />:</span>
                    <span className="font-bold">{formatDeWert(steelProperties.rho)} kg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-main/60">Wärmeleitf. <FormulaText text="\lambda" />:</span>
                    <span className="font-bold">{formatDeWert(steelProperties.lambda)} W/(mK)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-main/60">Wärmedehnung <FormulaText text="\alpha" />:</span>
                    <span className="font-bold">1,2·10⁻⁵ 1/K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-main/60">E-Modul <FormulaText text="E" />:</span>
                    <span className="font-bold">{formatDeWert(steelProperties.E)} MPa</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {activeTab === 'allgemein' && (
            <>
              <div className="border-t border-home-grau/30 pt-4">
                <h3 className="text-sm font-bold text-text-main mb-4">Korrosionsschutz (DIN EN ISO 12944)</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Korrosivitätskategorie</label><InfoTooltip text="Einteilung der Umgebungsbedingungen hinsichtlich der Korrosionsbelastung." /></div>
                  <select aria-label="Korrosivitätskategorie" 
                    className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
                    value={corrosion}
                    onChange={(e) => setCorrosion(e.target.value as keyof typeof corrosionClasses)}
                  >
                    {Object.keys(corrosionClasses).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <p className="text-xs text-text-main/70 mt-1">{corrosionClasses[corrosion]}</p>
                </div>
              </div>

              <div className="border-t border-home-grau/30 pt-4">
                <h3 className="text-sm font-bold text-text-main mb-4">Brandfall (Temperatureinfluss)</h3>
                <Slider
                  label="Temperatur" info="Aktuelle Temperatur des Bauteils oder der Umgebung."
                  min={20} max={1000} step={10}
                  value={temp} unit="°C"
                  onChange={(e) => setTemp(Number(e.target.value))}
                />
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
                    <div className="text-home-grau mb-1"><FormulaText text="Abminderung k_{y,θ}" /></div>
                    <div className="font-bold text-shiraz">{formatDeZahl(ky, 2)}</div>
                  </div>
                  <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
                    <div className="text-home-grau mb-1"><FormulaText text="Abminderung k_{E,θ}" /></div>
                    <div className="font-bold text-shiraz">{formatDeZahl(kE, 2)}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-home-grau/30 pt-4">
                <h3 className="text-sm font-bold text-text-main mb-4">Ermüdung (Kerbfall)</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-2"><label className="text-sm font-medium text-text-main"><FormulaText text="Kerbfall \Delta\sigma_C (bei N=2\cdot 10^6)" /></label><InfoTooltip text="Kerbfall für die Ermüdungsberechnung." /></div>
                    <select 
                      className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
                      value={detailCategory}
                      onChange={(e) => setDetailCategory(Number(e.target.value))}
                    >
                      {[36, 45, 56, 71, 80, 90, 100, 112, 125, 140, 160].map(k => <option key={k} value={k}>{formatDeWert(k)} MPa</option>)}
                    </select>
                  </div>
                  
                  <Slider  label={<FormulaText text="Spannungsschwingbreite \Delta\sigma" />}
                    min={10} max={300} step={5}
                    value={deltaSigma} unit="MPa"
                    onChange={(e) => setDeltaSigma(Number(e.target.value))}
                  />

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Neigung m (N ≤ 5·10^6)</label><InfoTooltip text="Neigung der Wöhlerlinie für die Ermüdungsfestigkeit." /></div>
                    <select aria-label="Neigung m (N ≤ 5·10^6)" 
                      className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
                      value={m1}
                      onChange={(e) => setM1(Number(e.target.value))}
                    >
                      <option value={3}>3 (Stahlbau Normalfall)</option>
                      <option value={4}>4 (Sonderfälle)</option>
                      <option value={5}>5 (Hohlprofilknoten)</option>
                    </select>
                  </div>

                  <div className={`p-4 rounded-xl shadow-md text-white ${nR === Infinity || nR > 1e8 ? 'bg-slate-800' : 'bg-shiraz'} transition-colors mt-2`}>
                    <div className="text-sm opacity-90 mb-1">Ertragbare Lastwechsel <FormulaText text="N_R" /></div>
                    <div className="text-2xl font-bold">
                      {nR === Infinity ? 'Dauerfest (∞)' : nR > 1e8 ? '> 100 Mio. (Dauerfest)' : nR.toExponential(2)}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'walzen' && (
            <div className="border-t border-home-grau/30 pt-4">
              <h3 className="text-sm font-bold text-text-main mb-4">Profilgeometrie</h3>
              <div className="flex items-center gap-2"><label className="text-xs font-bold text-home-grau uppercase tracking-wider mb-1 block">Profiltyp</label><InfoTooltip text="Art des Stahlprofils (z.B. I-Profil, Hohlprofil)." /></div>
              <select aria-label="Profiltyp" 
                value={profileType}
                onChange={(e) => setProfileType(e.target.value as 'h' | 'i')}
                className="w-full p-2 text-sm border border-home-grau/30 rounded-lg focus:outline-none focus:border-shiraz bg-white"
              >
                <option value="h">Breitflanschprofil (z.B. HEB) - Hohe Eigenspannungen</option>
                <option value="i">Schmales I-Profil (z.B. IPE) - Geringere Eigenspannungen</option>
              </select>
              <p className="text-xs text-home-grau mt-3">
                Breitflanschprofile kühlen ungleichmäßiger ab (dickere Steg-Flansch-Übergänge), was zu höheren Eigenspannungen führt. Dies wird im Eurocode 3 durch ungünstigere Knicklinien (z.B. Linie c) berücksichtigt.
              </p>
            </div>
          )}

          {activeTab === 'schweissen' && (
            <div className="border-t border-home-grau/30 pt-4">
              <h3 className="text-sm font-bold text-text-main mb-4">Schweißparameter</h3>
              <Slider label="Streckenenergie (Heat Input)" info="Eingebrachte Wärmeenergie pro Längeneinheit beim Schweißen." min={500} max={3000} step={100} value={heatInput} unit="J/mm" onChange={(e) => setHeatInput(Number(e.target.value))} />
              <div className="mt-4">
                <Slider label="Blechdicke t"  min={5} max={50} step={1} value={plateThickness} unit="mm" onChange={(e) => setPlateThickness(Number(e.target.value))} />
              </div>
              <p className="text-xs text-home-grau mt-3">
                Eine hohe Streckenenergie bei dünnen Blechen führt zu einer breiteren Wärmeeinflusszone und damit zu einer breiteren Zone mit hohen Zugeigenspannungen.
              </p>
            </div>
          )}

          {activeTab === 'legierungen' && (
            <div className="border-t border-home-grau/30 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-text-main">Legierungs-Designer</h3>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-text-main flex items-center gap-1">Chrom (Cr) <InfoTooltip text="Erhöht Korrosionsschutz. Bildet ab 10,5% eine Passivschicht." /></span>
                  <span className="font-mono text-shiraz font-bold">{formatDeZahl(alloyCr, 1)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="0.5"
                  value={alloyCr}
                  onChange={(e) => setAlloyCr(Number(e.target.value))}
                  className="w-full accent-shiraz h-1 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-text-main flex items-center gap-1">Nickel (Ni) <InfoTooltip text="Stabilisiert Gefüge (Austenitbildner). Erhöht Zähigkeit und Verformbarkeit." /></span>
                  <span className="font-mono text-shiraz font-bold">{formatDeZahl(alloyNi, 1)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.5"
                  value={alloyNi}
                  onChange={(e) => setAlloyNi(Number(e.target.value))}
                  className="w-full accent-shiraz h-1 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-text-main flex items-center gap-1">Molybdän (Mo) <InfoTooltip text="Verhindert Lochfraßkorrosion (Pitting) in chloridreichen Umgebungen." /></span>
                  <span className="font-mono text-shiraz font-bold">{formatDeZahl(alloyMo, 1)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={alloyMo}
                  onChange={(e) => setAlloyMo(Number(e.target.value))}
                  className="w-full accent-shiraz h-1 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-text-main flex items-center gap-1">Kohlenstoff (C) <InfoTooltip text="Bestimmt Härte und Fließgrenze. Hoher Gehalt mindert Schweißbarkeit." /></span>
                  <span className="font-mono text-shiraz font-bold">{formatDeZahl(alloyC, 2)}%</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="1.5"
                  step="0.01"
                  value={alloyC}
                  onChange={(e) => setAlloyC(Number(e.target.value))}
                  className="w-full accent-shiraz h-1 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-home-grau/10 space-y-2">
                <span className="text-[10px] font-bold text-text-main/70 uppercase tracking-wider block font-semibold">Presets:</span>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => { setAlloyCr(0.1); setAlloyNi(0); setAlloyMo(0); setAlloyC(0.15); }}
                    className="p-1.5 rounded bg-white hover:bg-home-grau/5 border border-home-grau/30 font-semibold"
                  >
                    Baustahl (S235)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAlloyCr(18.0); setAlloyNi(8.0); setAlloyMo(0); setAlloyC(0.04); }}
                    className="p-1.5 rounded bg-white hover:bg-home-grau/5 border border-home-grau/30 font-semibold text-indigo-700"
                  >
                    V2A (1.4301)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAlloyCr(17.0); setAlloyNi(12.0); setAlloyMo(2.1); setAlloyC(0.04); }}
                    className="p-1.5 rounded bg-white hover:bg-home-grau/5 border border-home-grau/30 font-semibold text-indigo-700 col-span-2"
                  >
                    V4A (1.4404)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          {activeTab === 'allgemein' && (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[350px]">
                <h3 className="text-lg font-bold text-text-main mb-4">Spannungs-Dehnungs-Linie (Brandfall, vereinfacht)</h3>
                <div className="flex-1 relative w-full h-full">
                  <Line 
                    data={stressStrainData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { title: { display: true, text: 'Dehnung ε (%)' } },
                        y: { title: { display: true, text: 'Spannung σ (MPa)' }, min: 0, max: 600 }
                      }
                    }} 
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[350px]">
                <h3 className="text-lg font-bold text-text-main mb-4">Wöhlerlinie (Ermüdung)</h3>
                <div className="flex-1 relative w-full h-full">
                  <Line 
                    data={woehlerData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { 
                          type: 'logarithmic',
                          title: { display: true, text: 'Lastwechsel N (log)' },
                          min: 1e4,
                          max: 1e8
                        },
                        y: { 
                          type: 'logarithmic',
                          title: { display: true, text: 'Spannungsschwingbreite Δσ (MPa) (log)' },
                          min: 10,
                          max: 500
                        }
                      }
                    }} 
                  />
                </div>
              </div>

              {/* Schematische Darstellung */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Ermüdung (Kerbwirkung)</h3>
                <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                  <svg width="100%" height="160" viewBox="0 0 350 160">
                    {/* Bauteil mit Kerbe */}
                    <path d="M 50 40 L 150 40 Q 175 40 175 60 Q 175 40 200 40 L 300 40 L 300 120 L 200 120 Q 175 120 175 100 Q 175 120 150 120 L 50 120 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                    
                    {/* Zugkräfte */}
                    <path d="M 50 80 L 20 80" stroke="#A3113E" strokeWidth="3" markerEnd="url(#arrow-red-stahl)" />
                    <path d="M 300 80 L 330 80" stroke="#A3113E" strokeWidth="3" markerEnd="url(#arrow-red-stahl)" />
                    <text x="35" y="75" fontSize="12" fill="#A3113E" textAnchor="middle" fontWeight="bold">F</text>
                    <text x="315" y="75" fontSize="12" fill="#A3113E" textAnchor="middle" fontWeight="bold">F</text>

                    {/* Spannungslinien (Kraftfluss) */}
                    <path d="M 50 50 L 140 50 Q 175 70 210 50 L 300 50" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 2" />
                    <path d="M 50 65 L 145 65 Q 175 75 205 65 L 300 65" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 2" />
                    <path d="M 50 80 L 300 80" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 2" />
                    <path d="M 50 95 L 145 95 Q 175 85 205 95 L 300 95" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 2" />
                    <path d="M 50 110 L 140 110 Q 175 90 210 110 L 300 110" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 2" />

                    {/* Spannungsspitzen Markierung */}
                    <circle cx="175" cy="60" r="15" fill="none" stroke="#A3113E" strokeWidth="2" strokeDasharray="2 2" />
                    <circle cx="175" cy="100" r="15" fill="none" stroke="#A3113E" strokeWidth="2" strokeDasharray="2 2" />
                    <text x="175" y="55" fontSize="10" fill="#A3113E" textAnchor="middle" fontWeight="bold">σ_max</text>
                    <text x="175" y="115" fontSize="10" fill="#A3113E" textAnchor="middle" fontWeight="bold">σ_max</text>

                    <defs>
                      <marker id="arrow-red-stahl" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                      </marker>
                    </defs>
                  </svg>
                  <div className="text-xs text-text-main/70 text-center mt-2">
                    Kerben (z.B. Schweißnähte, Bohrungen, Querschnittssprünge) stören den Kraftfluss. Die Spannungslinien drängen sich zusammen, es entstehen lokale Spannungsspitzen (σ_max). Bei zyklischer Belastung können hier Ermüdungsrisse entstehen.
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'walzen' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                  <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Max. Druckeigenspannung (Flanschrand)</div>
                  <div className="text-2xl font-bold text-blue-600">{formatDeZahl(walzResults.maxCompressive, 0)} MPa</div>
                  <div className="text-xs text-text-main/60 mt-1">Führt zu vorzeitigem Fließen bei Druckbeanspruchung (Knicken!)</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                  <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Max. Zugeigenspannung (Flanschmitte)</div>
                  <div className="text-2xl font-bold text-red-600">+{formatDeZahl(walzResults.maxTensile, 0)} MPa</div>
                  <div className="text-xs text-text-main/60 mt-1">Ausgleichsspannung im Querschnitt</div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm h-[350px]">
                <h3 className="text-sm font-bold text-text-main mb-4">Eigenspannungsverteilung über die Flanschbreite</h3>
                <div className="relative w-full h-[260px]">
                  <Line 
                    data={walzResults.chartData} 
                    options={{
                      responsive: true, maintainAspectRatio: false,
                      scales: {
                        x: { title: { display: true, text: 'Position auf dem Flansch (%)' } },
                        y: { 
                          title: { display: true, text: 'Eigenspannung (MPa)' },
                          suggestedMin: -fy * 1.2,
                          suggestedMax: fy * 1.2
                        }
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.dataset.label}: ${formatDeZahl(context.parsed.y, 1)} MPa`;
                            }
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'schweissen' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                  <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Max. Zugeigenspannung (Schweißnaht)</div>
                  <div className="text-2xl font-bold text-red-600">+{formatDeWert(fy)} MPa</div>
                  <div className="text-xs text-text-main/60 mt-1">Erreicht typischerweise die Fließgrenze</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                  <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Breite der Zugzone (b_t)</div>
                  <div className="text-2xl font-bold text-orange-600">{formatDeZahl(weldResults.b_t, 1)} mm</div>
                  <div className="text-xs text-text-main/60 mt-1">Abhängig von Streckenenergie und Blechdicke</div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm h-[350px]">
                <h3 className="text-sm font-bold text-text-main mb-4">Längseigenspannungen quer zur Schweißnaht</h3>
                <div className="relative w-full h-[260px]">
                  <Line 
                    data={weldResults.chartData} 
                    options={{
                      responsive: true, maintainAspectRatio: false,
                      scales: {
                        x: { title: { display: true, text: 'Abstand von der Schweißnahtmitte (mm)' } },
                        y: { 
                          title: { display: true, text: 'Eigenspannung (MPa)' },
                          suggestedMin: -fy * 1.2,
                          suggestedMax: fy * 1.2
                        }
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.dataset.label}: ${formatDeZahl(context.parsed.y, 1)} MPa`;
                            }
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'legierungen' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 border-b border-home-grau/10 pb-3">
                <Sparkles className="text-shiraz" size={24} />
                <h3 className="text-lg font-bold text-text-main">Eigenschaften der Legierungsmischung</h3>
              </div>

              {(() => {
                const pren = alloyCr + 3.3 * alloyMo;
                
                let category = 'Ferritisch / Unlegiert';
                let designationMatch = 'Unlegierter Baustahl (z.B. S235, S355)';
                let corrosionRating = 'Sehr Gering';
                let corrosionColor = 'text-red-600 bg-red-50';
                let microstructureDesc = 'Ferritisch-perlitische Zusammensetzung. Keine schützende Passivschicht, da der Chromgehalt unter 10,5 % liegt. Rostet unter atmosphärischen Bedingungen.';

                if (alloyCr >= 10.5) {
                  if (alloyNi >= 8) {
                    category = 'Austenitisch (Rostfrei & Säurebeständig)';
                    microstructureDesc = 'Das Nickel stabilisiert das kubisch-flächenzentrierte (kfz) Austenitgitter. Extrem zäh bei tiefen Temperaturen, hervorragend schweißbar, antimagnetisch und hoch korrosionsbeständig.';
                    if (alloyMo >= 2) {
                      designationMatch = 'Nichtrostender Edelstahl V4A (z.B. 1.4401 / 1.4404)';
                      corrosionRating = 'Hervorragend (Säure- und Chloridbeständig - Pool-/Meertauglich)';
                      corrosionColor = 'text-emerald-700 bg-emerald-50';
                    } else {
                      designationMatch = 'Nichtrostender Edelstahl V2A (z.B. 1.4301 / X5CrNi18-10)';
                      corrosionRating = 'Hoch (Lebensmittelindustrie, Haushaltswaren)';
                      corrosionColor = 'text-sky-700 bg-sky-50';
                    }
                  } else if (alloyNi > 1 && alloyCr >= 18) {
                    category = 'Duplex (Austenit-Ferrit-Mischgefüge)';
                    designationMatch = 'Duplex-Edelstahl (z.B. 1.4462)';
                    corrosionRating = 'Hervorragend bis Extrem (Hohe Streckgrenze & Lochfraßbeständig)';
                    corrosionColor = 'text-teal-700 bg-teal-50';
                    microstructureDesc = 'Besteht aus etwa gleichen Anteilen an Ferrit und Austenit. Verbindet die hohe Festigkeit der ferritischen Stähle mit der Korrosionsbeständigkeit und Zähigkeit der austenitischen Stähle.';
                  } else if (alloyC > 0.12 && alloyNi < 2) {
                    category = 'Martensitischer Chromstahl (Härtbar)';
                    designationMatch = 'Martensitischer Stahl (z.B. 1.4021 - Werkzeug- & Messerstahl)';
                    corrosionRating = 'Mäßig (Härtbar durch Abschrecken)';
                    corrosionColor = 'text-amber-700 bg-amber-50';
                    microstructureDesc = 'Reagiert stark auf Wärmebehandlung. Durch Abschrecken entsteht das harte Martensitgefüge. Gut geeignet für Verschleißteile, Messer, Federn, jedoch geringere Zähigkeit.';
                  } else {
                    category = 'Ferritischer Chromstahl (Rostfrei, magnetisch)';
                    designationMatch = 'Ferritischer Edelstahl (z.B. 1.4016)';
                    corrosionRating = 'Mäßig bis Gut';
                    corrosionColor = 'text-stone-700 bg-stone-50';
                    microstructureDesc = 'Rostfrei, aber ohne nennenswerten Nickelanteil magnetisch. Beständig im mäßig feuchten Innenbereich, mäßige Schweißeignung.';
                  }
                }

                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                        <span className="text-[10px] text-text-main/50 font-bold uppercase tracking-wider block font-semibold">Gefügestruktur</span>
                        <div className="text-base font-black text-text-main">{category}</div>
                        <div className="text-xs text-text-main/70 leading-normal">{microstructureDesc}</div>
                      </div>

                      <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-text-main/50 font-bold uppercase tracking-wider block font-semibold">PREN = Cr + 3,3·Mo (+16·N) – Lochfraßbeständigkeit</span>
                          <div className="text-2xl font-mono font-black text-shiraz mt-1">{formatDeZahl(pren, 2)}</div>
                        </div>
                        <div className={`p-2 rounded text-xs text-center font-bold ${corrosionColor}`}>
                          Korrosionswiderstand: {corrosionRating}
                        </div>
                      </div>
                    </div>

                    <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 space-y-4">
                      <h4 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                        <Info size={16} className="text-shiraz" />
                        Didaktischer Leitfaden: Edelstahl vs. Nichtrostender Stahl
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                        <div className="space-y-2">
                          <span className="font-bold text-text-main block">1. Ist Edelstahl immer korrosionsbeständig?</span>
                          <p className="text-text-main/75">
                            <strong>Nein, das ist ein weit verbreiteter Irrglaube!</strong> „Edelstahl“ bezeichnet laut DIN EN 10020 lediglich legierte oder unlegierte Stähle mit besonderem Reinheitsgrad (Phosphor- und Schwefelgehalt &le; 0,025 %). Ein hochreiner Baustahl ist somit auch ein Edelstahl, rostet jedoch völlig normal.
                          </p>
                          <p className="text-text-main/75 font-semibold">
                            Rostfreie Stähle (nichtrostende Stähle) benötigen zwingend mindestens 10,5 % Chrom.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <span className="font-bold text-text-main block">2. Wie schützt die Passivschicht?</span>
                          <p className="text-text-main/75">
                            Der gelöste Chromanteil reagiert mit Luftsauerstoff oder Feuchtigkeit zu einer unsichtbaren, dichten Chromoxid-Schicht (<FormulaText text="Cr_2O_3" />). Bei oberflächlicher Verletzung ordnet sich diese Passivschicht unter Sauerstoffzufuhr spontan neu an (Selbstheilung).
                          </p>
                          <p className="text-text-main/75">
                            Molybdän-Zusätze (Mo) erhöhen den Schutz drastisch, insbesondere gegen abrasive Salze (Winterdienst) und chloridhaltiges Wasser (Bauteile im Schwimmbadbereich).
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-off-white border border-home-grau/30 rounded-xl space-y-3">
                      <span className="text-xs font-bold text-text-main block uppercase tracking-wide">
                        Bezeichnungssystem für hochlegierte Stähle (DIN EN 10027)
                      </span>
                      <div className="text-xs text-text-main/80 space-y-2">
                        <p>
                          Hochlegierte Stähle (mindestens ein Legierungselement &ge; 5 %) sind durch das Kennzeichen „X“ am Anfang ausgewiesen:
                        </p>
                        <div className="bg-white p-3 rounded border border-home-grau/15 font-mono text-center text-sm font-bold flex flex-wrap justify-center gap-2">
                          <span className="text-shiraz">X5</span>
                          <span className="text-emerald-700">CrNiMo</span>
                          <span className="text-blue-600">17-12-2</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs text-text-main/70 pl-2">
                          <li><strong>X:</strong> Kennzeichen für hochlegierte Stähle</li>
                          <li><strong>5:</strong> Kohlenstoffgehalt in Hundertstel-Prozent (hier 0,05 % C)</li>
                          <li><strong>CrNiMo:</strong> Chemische Symbole der Hauptlegierungselemente in absteigender Konzentration</li>
                          <li><strong>17-12-2:</strong> Direkte Gewichtsanteile der Legierungselemente in % (17 % Cr, 12 % Ni, 2 % Mo)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
      )}

      {/* 2. REITER: SPANNUNGS-DEHNUNGS-LINIEN UNTERSCHIEDLICHER STAHLSORTEN */}
      {activeTab === 'spannungsdehnung' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          {/* Header & Didaktische Einführung */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-shiraz/10 text-shiraz rounded-xl">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main">
                    Spannungs-Dehnungs-Linien (<InlineMath math="\sigma" />-<InlineMath math="\varepsilon" />) unterschiedlicher Stahlsorten
                  </h3>
                  <p className="text-xs text-text-main/70">
                    Vergleich des Verformungs- und Versagensverhaltens nach DIN EN ISO 6892-1 (Zugversuch)
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-shiraz/10 text-shiraz px-3 py-1 rounded-full border border-shiraz/20">
                DIN EN 1993-1-1 / DIN EN ISO 6892-1
              </span>
            </div>

            <p className="text-sm text-text-main/80 leading-relaxed">
              Die <strong>Spannungs-Dehnungs-Linie</strong> ist der maßgebende Fingerabdruck jedes metallischen Werkstoffs. Sie beschreibt die mechanische Reaktion eines Prüfstabs unter einachsiger Zugbeanspruchung und gliedert sich in vier charakteristische Werkstoffphasen:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl space-y-1">
                <span className="font-bold text-blue-900 block flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> 1. Elastischer Bereich (Hooke)
                </span>
                <p className="text-blue-950/80 leading-relaxed">
                  Lineare Steigung durch atomare Gitterdehnung: <InlineMath math="\sigma = E \cdot \varepsilon" />. Vollständig reversibel. Steigung entspricht dem <InlineMath math="E" />-Modul (<InlineMath math="\approx 210.000\text{ MPa}" />).
                </p>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-1">
                <span className="font-bold text-amber-900 block flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span> 2. Fließbeginn (<InlineMath math="f_y" /> bzw. <InlineMath math="R_{p0{,}2}" />)
                </span>
                <p className="text-amber-950/80 leading-relaxed">
                  Übergang zu irreversiblen Versetzungsbewegungen. Baustähle zeigen ein horizontales Lüders-Plateau; hochfeste Stähle fließen stetig (Ersatzstreckgrenze <InlineMath math="R_{p0{,}2}" />).
                </p>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl space-y-1">
                <span className="font-bold text-emerald-900 block flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> 3. Kaltverfestigung (<InlineMath math="f_u" />)
                </span>
                <p className="text-emerald-950/80 leading-relaxed">
                  Versetzungen stauen sich an Korngrenzen auf und behindern sich gegenseitig. Die Spannung steigt bis zum Höchstwert <InlineMath math="f_u" /> bei der Gleichmaßdehnung <InlineMath math="A_{gt}" />.
                </p>
              </div>

              <div className="p-3 bg-rose-50/70 border border-rose-200/60 rounded-xl space-y-1">
                <span className="font-bold text-rose-900 block flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span> 4. Einschnürung &amp; Bruch (<InlineMath math="A" />)
                </span>
                <p className="text-rose-950/80 leading-relaxed">
                  Instabile plastische Einschnürung an der schwächsten Stelle. Der tragende Querschnitt verengt sich bis zum Scherbruch bei der Bruchdehnung <InlineMath math="A" />.
                </p>
              </div>
            </div>
          </div>

          {/* Interaktives Multi-Kurven Diagramm */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-home-grau/15">
              <div>
                <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                  <Layers className="text-shiraz h-5 w-5" />
                  Vergleichende <InlineMath math="\sigma" />-<InlineMath math="\varepsilon" />-Kennlinien im Großformat
                </h4>
                <div className="text-xs text-text-main/70 flex items-center gap-2 flex-wrap mt-0.5">
                  <span>{selectedCurves.length} Werkstoffe aktiv eingeblendet (Klick auf Güten zur Selektion)</span>
                  {strainZoom === 'auto' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                      <Check size={12} className="text-emerald-600" />
                      Auto-Fit: ε ≤ {formatDeWert(stressStrainChartOptions.scales.x.max)} % | σ ≤ {formatDeWert(stressStrainChartOptions.scales.y.max)} MPa
                    </span>
                  )}
                </div>
              </div>

              {/* Zoom- / Skalierungs-Stufen */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <span className="text-[11px] font-bold text-slate-500 uppercase px-2 flex items-center gap-1">
                  <Maximize2 size={13} /> Skalierung:
                </span>
                <button aria-pressed={strainZoom === 'auto'}
                  onClick={() => setStrainZoom('auto')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    strainZoom === 'auto' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Passt X- und Y-Achse automatisch an Maximalwerte der aktiven Stähle an"
                >
                  Auto-Skalierung
                </button>
                <button aria-pressed={strainZoom === 'detail'}
                  onClick={() => setStrainZoom('detail')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    strainZoom === 'detail' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Fließbeginn (0–3 %)
                </button>
                <button aria-pressed={strainZoom === 'work'}
                  onClick={() => setStrainZoom('work')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    strainZoom === 'work' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Arbeitsbereich (0–15 %)
                </button>
                <button aria-pressed={strainZoom === 'full'}
                  onClick={() => setStrainZoom('full')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    strainZoom === 'full' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Gesamt (0–50 %)
                </button>
              </div>
            </div>

            {/* Schnell-Filter & Güten-Schalter */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Schnellauswahl:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCurves(steelCurveDefinitions.map(s => s.id))}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium cursor-pointer"
                  >
                    Alle einblenden
                  </button>
                  <button
                    onClick={() => setSelectedCurves(['S235', 'S355', 'S460', 'S690', 'S960'])}
                    className="px-2.5 py-1 rounded-lg border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-800 font-medium cursor-pointer"
                  >
                    Nur Baustähle (S235–S960)
                  </button>
                  <button
                    onClick={() => setSelectedCurves(['B500A', 'B500B', 'SAS670', 'Y1860'])}
                    className="px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-800 font-medium cursor-pointer"
                  >
                    Bewehrungs- &amp; Spannstähle
                  </button>
                  <button
                    onClick={() => setSelectedCurves(['B500B', 'Y1860'])}
                    className="px-2.5 py-1 rounded-lg border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-purple-800 font-medium cursor-pointer"
                  >
                    Fokus: Betonstahl vs. Spannstahl
                  </button>
                </div>
              </div>

              {/* Einzel-Güten Schalter */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {steelCurveDefinitions.map((def) => {
                  const isChecked = selectedCurves.includes(def.id);
                  return (
                    <button
                      key={def.id}
                      onClick={() => {
                        if (isChecked) {
                          if (selectedCurves.length > 1) {
                            setSelectedCurves(selectedCurves.filter(id => id !== def.id));
                          }
                        } else {
                          setSelectedCurves([...selectedCurves, def.id]);
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isChecked 
                          ? 'bg-white shadow-sm' 
                          : 'bg-slate-50/60 border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                      style={{ 
                        borderColor: isChecked ? def.color : undefined,
                        boxShadow: isChecked ? `0 0 0 2px ${def.color}25` : undefined 
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: def.color }} />
                        <div className="overflow-hidden">
                          <div className="font-bold text-xs text-text-main truncate">{def.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">fy={formatDeWert(def.fy)} | fu={formatDeWert(def.fu)}</div>
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold ${isChecked ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {isChecked ? '✓' : '+'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chart Canvas */}
            <div className="relative w-full h-[440px] bg-slate-50/30 rounded-xl p-2 border border-home-grau/15">
              <Line data={stressStrainMultiData} options={stressStrainChartOptions} />
            </div>

            {/* Virtueller Zugversuch / Prüfdehnungs-Schieber */}
            <div className="bg-off-white/80 p-5 rounded-2xl border border-home-grau/25 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-home-grau/15 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-shiraz h-5 w-5" />
                  <span className="text-sm font-bold text-text-main">
                    Virtueller Zugversuch: Belastungssimulator bei Dehnung <InlineMath math="\varepsilon" />
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 min-w-0 max-w-full">
                  <span className="text-xs font-semibold text-slate-500">Prüfwerkstoff:</span>
                  <select aria-label="Prüfwerkstoff"
                    value={simGradeId}
                    onChange={(e) => setSimGradeId(e.target.value)}
                    className="w-full sm:w-auto max-w-full min-w-0 p-1.5 text-xs font-bold border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:border-shiraz"
                  >
                    {steelCurveDefinitions.map(def => (
                      <option key={def.id} value={def.id}>{def.name} ({def.sub})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text-main">Aktuelle Dehnungsbeaufschlagung <InlineMath math="\varepsilon" />:</span>
                    <span className="font-mono text-base font-black text-shiraz bg-white px-2.5 py-0.5 rounded border border-home-grau/20 shadow-xs">
                      {formatDeZahl(testStrain, 2)} % ({formatDeZahl((testStrain * 10), 1)} ‰)
                    </span>
                  </div>
                  <Slider
                    label="Prüfdehnung ε"
                    min={0}
                    max={activeSimSteel.A}
                    step={0.1}
                    value={testStrain}
                    unit="%"
                    onChange={(e) => setTestStrain(Number(e.target.value))}
                  />
                  <p className="text-[11px] text-slate-500 leading-normal">
                    * Bewegen Sie den Schieber, um die Verformungsschritte und den mikromechanischen Zustand in Echtzeit zu analysieren.
                  </p>
                </div>

                <div className="lg:col-span-5 grid grid-cols-2 gap-2.5">
                  <div className="bg-white p-3 rounded-xl border border-home-grau/20 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spannung <InlineMath math="\sigma" /></span>
                    <span className="text-lg font-black text-shiraz font-mono mt-0.5">
                      {simStress > 0 ? `${formatDeZahl(simStress, 1)} MPa` : '0 MPa'}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5">N/mm² Zugspannung</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-home-grau/20 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ausnutzung</span>
                    <span className="text-lg font-black text-slate-800 font-mono mt-0.5">
                      {activeSimSteel.fu > 0 ? `${Math.min(100, ((simStress / activeSimSteel.fu) * 100)).toFixed(0)} %` : '0 %'}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5">bezogen auf <InlineMath math="f_u" /></span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-home-grau/20 col-span-2 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Werkstoffphase</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${simPhase.color}`}>
                        {simPhase.phase}
                      </span>
                    </div>
                    <p className="text-xs text-text-main/80 font-normal leading-normal">
                      {simPhase.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Didaktische Fachkarten im 2x2-Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Karte 1 */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-home-grau/15 pb-2.5">
                <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                  <Activity size={18} />
                </div>
                <h4 className="font-bold text-sm text-text-main">
                  1. Ausgeprägte Streckgrenze vs. Dehngrenze <InlineMath math="R_{p0{,}2}" />
                </h4>
              </div>
              <div className="text-xs text-text-main/80 space-y-2 leading-relaxed">
                <p>
                  <strong>Warum haben S235 und S355 ein horizontales Fließplateau?</strong><br />
                  In weichen unlegierten Baustählen sind freie Kohlenstoff- und Stickstoffatome im Ferritgitter eingelagert. Sie wandern zu Versetzungskernen und blockieren diese (sog. <em>Cottrell-Atmosphären</em>). Zum Start der Verformung wird eine hohe Aktivierungsenergie benötigt (<InlineMath math="R_{eH}" />, obere Streckgrenze). Sobald sich die Versetzungen losgerissen haben, gleiten sie sprunghaft unter geringerer Kraft weiter (<InlineMath math="R_{eL}" />, untere Streckgrenze), bis sich makroskopische <strong>Lüders-Bänder</strong> über das Bauteil ausgebreitet haben.
                </p>
                <p>
                  <strong>Warum fließen hochfeste Stähle &amp; Spannstähle stetig?</strong><br />
                  Durch intensive Kaltverformung (Ziehen von Spannlitzen Y1860) oder thermomechanisches Vergüten (S690/S960) ist das Gitter bereits mit Abermillionen von Versetzungen durchsetzt. Es gibt kein Cottrell-Losreißen mehr. Da der Fließbeginn kontinuierlich erfolgt, wird normativ die <strong>0,2 %-Dehngrenze <InlineMath math="R_{p0{,}2}" /></strong> (Spannung bei 0,2 % bleibender plastischer Restdehnung) als Streckgrenze definiert.
                </p>
              </div>
            </div>

            {/* Karte 2 */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-home-grau/15 pb-2.5">
                <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                  <Scale size={18} />
                </div>
                <h4 className="font-bold text-sm text-text-main">
                  2. Festigkeit vs. Duktilität (Das Werkstoff-Dilemma)
                </h4>
              </div>
              <div className="text-xs text-text-main/80 space-y-2 leading-relaxed">
                <p>
                  <strong>Der fundamentale Zielkonflikt der Metallurgie:</strong><br />
                  Grundsätzlich gilt: <em>Je höher die Zugfestigkeit eines Stahls, desto geringer ist seine plastische Bruchdehnung (<InlineMath math="A" />) und Gleichmaßdehnung (<InlineMath math="A_{gt}" />)</em>.
                </p>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span>S235JR (Weicher Baustahl):</span>
                    <span className="font-bold text-blue-700">fy = 235 MPa | A ≥ 26 %</span>
                  </div>
                  <div className="flex justify-between">
                    <span>S690QL (Vergütungsstahl):</span>
                    <span className="font-bold text-purple-700">fy = 690 MPa | A ≥ 14 %</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Y1860 S7 (Spannlitze):</span>
                    <span className="font-bold text-shiraz">fpk = 1860 MPa | Agt ≥ 3,5 %</span>
                  </div>
                </div>
                <p>
                  <strong>Bedeutung für die Tragsicherheit:</strong> Hohe Duktilität erlaubt im Stahl- und Verbundbau die Anwendung der <strong>Fließgelenktheorie (Plastizitätstheorie)</strong>. Bei unvorhergesehener Überlastung verformt sich das Bauteil sichtbar, baut Spannungsspitzen durch plastisches Fließen ab und warnt rechtzeitig vor Einsturz. Hochfeste Stähle hingegen reagieren empfindlich auf Kerben und versagen mit minimaler Vorwarnung.
                </p>
              </div>
            </div>

            {/* Karte 3 */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-home-grau/15 pb-2.5">
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Shield size={18} />
                </div>
                <h4 className="font-bold text-sm text-text-main">
                  3. Physikalisches Grundgesetz: Die Konstanz des E-Moduls
                </h4>
              </div>
              <div className="text-xs text-text-main/80 space-y-2 leading-relaxed">
                <p>
                  <strong>Warum steigt die Steifigkeit nicht mit der Festigkeit?</strong><br />
                  Ein häufiges Missverständnis unter Studierenden: Ein Träger aus S690 biegt sich unter identischer elastischer Gebrauchslast <strong>exakt genauso stark durch</strong> wie ein geometrisch identischer Träger aus S235!
                </p>
                <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200/60 text-emerald-950 font-semibold text-center">
                  <InlineMath math="E \approx 210.000\text{ N/mm² (MPa) für ALLE Baustähle!}" />
                </div>
                <p>
                  <strong>Atomare Ursache:</strong> Der Elastizitätsmodul spiegelt die Steifigkeit der atomaren metallischen Bindung zwischen den Eisenatomen im Kristallgitter wider. Durch Legierungsanteile (&lt; 2 %) oder Wärmebehandlungen ändert sich der Atomabstand und die Bindungsenergie nicht messbar.
                </p>
                <p>
                  <strong>Praxisfolge:</strong> Bei schlanken Tragwerken aus höherfesten Stählen (S460, S690) entscheidet fast immer der <strong>Gebrauchstauglichkeitsnachweis (Durchbiegung)</strong> oder die <strong>Stabilität (Biegedrillknicken / Beulen)</strong> nach Euler (<InlineMath math="N_{cr} = \pi^2 E I / s_k^2" />), nicht die Materialfestigkeit!
                </p>
              </div>
            </div>

            {/* Karte 4 */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-home-grau/15 pb-2.5">
                <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                  <Sparkles size={18} />
                </div>
                <h4 className="font-bold text-sm text-text-main">
                  4. Bewehrungsstahl vs. Spannstahl im Betonbau
                </h4>
              </div>
              <div className="text-xs text-text-main/80 space-y-2 leading-relaxed">
                <p>
                  <strong>Zwei völlig unterschiedliche Philosophien im Betonbau:</strong>
                </p>
                <div className="space-y-1.5">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <strong className="text-emerald-800 block mb-0.5">Bewehrungsstahl (B500B / B500A / B500C):</strong>
                    Arbeitet im gerissenen Beton (Zustand II). Beton nimmt den Druck auf, Stahl die Zugkräfte. Verlangt hohe Rippung zur Rissbreitenbegrenzung und garantierte Duktilität (<InlineMath math="A_{gt} \ge 5\%" />), um bei Rissbildung Verformungsenergie aufzunehmen.
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <strong className="text-sky-800 block mb-0.5">Spannstahl (Y1860 S7 / SAS 670):</strong>
                    Wird vorweg aktiv auf ca. 70–80 % seiner Zugfestigkeit (<InlineMath math="\approx 1400\text{ MPa}" />) gedehnt, um den Beton künstlich zu überdrücken. Verhindert Risse komplett (Zustand I). Verlangt minimale Relaxation (<InlineMath math="\le 2{,}5\%" />) und darf wegen Sprödbruchgefahr <strong>unter keinen Umständen geschweißt</strong> werden!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. REITER: STAHLWERKSTOFFE, GÜTEN, BEWEHRUNGS- & SPANNSTÄHLE */}
      {activeTab === 'stahlsorten' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          {/* 1. Bezeichnungssystem nach DIN EN 10027-1 */}
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-shiraz/10 rounded-lg text-shiraz">
                <BookOpen size={18} />
              </div>
              <h3 className="text-lg font-bold text-text-main">Systematik der Stahlbezeichnung (DIN EN 10027-1)</h3>
            </div>
            <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
              Baustähle werden im Bauwesen standardisiert benannt. Die Kurzbezeichnung schlüsselt mechanische Mindestwerte, technologische Zähigkeiten, Herstellungsverfahren und Lieferzustände präzise auf:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm mb-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                <span className="font-black text-shiraz text-2xl mb-1">S</span>
                <span className="font-bold text-xs text-slate-500 uppercase tracking-widest mb-1">Stahltyp</span>
                <p className="text-xs text-text-main/85"><strong>Structural Steel:</strong> Kennzeichnet den herkömmlichen Verwendungszweck als tragender Baustahl.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                <span className="font-black text-shiraz text-2xl mb-1">355</span>
                <span className="font-bold text-xs text-slate-500 uppercase tracking-widest mb-1">Streckgrenze</span>
                <p className="text-xs text-text-main/85">Nennwert der Mindeststreckgrenze <InlineMath math="f_y" /> in N/mm² (MPa) für Bauteildicken <InlineMath math="t \le 16\text{ mm}" />.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                <span className="font-black text-shiraz text-2xl mb-1">J2</span>
                <span className="font-bold text-xs text-slate-500 uppercase tracking-widest mb-1">Zähigkeitsstufe</span>
                <p className="text-xs text-text-main/85">Kerbschlagarbeit mind. <strong>27 Joule</strong> bei <strong>-20 °C</strong>. Sichert das Tragwerk optimal gegen Sprödbruch.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                <span className="font-black text-shiraz text-2xl mb-1">+N</span>
                <span className="font-bold text-xs text-slate-500 uppercase tracking-widest mb-1">Lieferzustand</span>
                <p className="text-xs text-text-main/85"><strong>Normalisierend gewalzt</strong> bzw. normalgeglüht (+N). Weitere Zustände: thermo-mechanisch (+M).</p>
              </div>
            </div>
            
            <div className="p-3.5 bg-shiraz/5 text-shiraz rounded-xl border border-shiraz/10 text-center font-mono text-xs md:text-sm font-bold flex items-center justify-center gap-2">
              <Sparkles size={16} /> Entschlüsseltes Praxisbeispiel: <span className="underline decoration-wavy text-text-main">S355J2+N</span> (Baustahl mit fy = 355 MPa, kerbschlagzäh bei -20°C, normalbehandelt)
            </div>
          </div>

          {/* 2. FACHWISSEN: BEWEHRUNGSSTÄHLE & SPANNSTÄHLE IM BETONBAU */}
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-home-grau/15 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-shiraz/10 text-shiraz rounded-xl">
                  <Layers size={20} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-text-main">
                    Fachwissen: Bewehrungsstähle &amp; Spannstähle im Beton- &amp; Spannbetonbau
                  </h4>
                  <p className="text-xs text-text-main/70">
                    Normative Grundlagen nach DIN 488, Spannstahl-Zulassungen (abZ; prEN 10138 nur Entwurf) und Eurocode 2 (DIN EN 1992-1-1)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button aria-pressed={reinforcementDeepDiveTab === 'bewehrung'}
                  onClick={() => setReinforcementDeepDiveTab('bewehrung')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reinforcementDeepDiveTab === 'bewehrung' 
                      ? 'bg-shiraz text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bewehrungsstähle (DIN 488 / EC2)
                </button>
                <button aria-pressed={reinforcementDeepDiveTab === 'spannstahl'}
                  onClick={() => setReinforcementDeepDiveTab('spannstahl')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reinforcementDeepDiveTab === 'spannstahl' 
                      ? 'bg-shiraz text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Spannstähle (abZ / prEN 10138)
                </button>
              </div>
            </div>

            {reinforcementDeepDiveTab === 'bewehrung' ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Duktilitätsklasse A */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Klasse A</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">Normalduktil</span>
                      </div>
                      <div className="text-sm font-bold text-text-main">B500A (z.B. Matten Q/R)</div>
                      <p className="text-xs text-text-main/75 leading-relaxed">
                        Kaltgezogen oder kaltgerippt. Für ebene, flächige Bauteile mit verteilten Lasten ohne seismische Anforderungen.
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-slate-600">
                        <span>ft/fy:</span>
                        <span className="font-bold text-slate-800">&ge; 1,05</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>&epsilon;_uk (Agt):</span>
                        <span className="font-bold text-slate-800">&ge; 2,5 %</span>
                      </div>
                    </div>
                  </div>

                  {/* Duktilitätsklasse B */}
                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-emerald-800 uppercase tracking-wider">Klasse B</span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">Hochduktil (Standard)</span>
                      </div>
                      <div className="text-sm font-bold text-text-main">B500B (Betonstabstahl)</div>
                      <p className="text-xs text-text-main/75 leading-relaxed">
                        Warmgewalzt mit Thermex-Vergütung. Standard im Hoch- und Ingenieurbau zur Bildung plastischer Fließgelenke.
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-emerald-200/80 space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-emerald-900">
                        <span>ft/fy:</span>
                        <span className="font-bold">&ge; 1,08</span>
                      </div>
                      <div className="flex justify-between text-emerald-900">
                        <span>&epsilon;_uk (Agt):</span>
                        <span className="font-bold">&ge; 5,0 %</span>
                      </div>
                    </div>
                  </div>

                  {/* Duktilitätsklasse C */}
                  <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-purple-800 uppercase tracking-wider">Klasse C</span>
                        <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded font-mono font-semibold">Erdbebenfest</span>
                      </div>
                      <div className="text-sm font-bold text-text-main">B500C (Erdbebenstahl)</div>
                      <p className="text-xs text-text-main/75 leading-relaxed">
                        Höchste dissipative Rotationskapazität für seismische Zonen, Brückenpfeiler und Explosionsschutzbauwerke.
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-purple-200/80 space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-purple-900">
                        <span>ft/fy:</span>
                        <span className="font-bold">1,15 &dots; 1,35</span>
                      </div>
                      <div className="flex justify-between text-purple-900">
                        <span>&epsilon;_uk (Agt):</span>
                        <span className="font-bold">&ge; 7,5 %</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                    <strong className="text-text-main block text-xs uppercase tracking-wide">
                      Verbundwirkung: Rippenprofilierung &amp; Kraftübertragung
                    </strong>
                    <p className="text-text-main/80 leading-relaxed">
                      Glatter Rundstahl besitzt fast nur Haft- und Reibungsverbund. Betonstähle nach DIN 488 besitzen daher <strong>Schrägrippen</strong> (2- oder 4-reihig), sodass der Zementstein formschlüssig in die Rippenzwischenräume greift.
                    </p>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 font-mono text-[11px] text-center">
                      <InlineMath math="f_{bd} = 2{,}25 \cdot \eta_1 \cdot \eta_2 \cdot f_{ctd}" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      <InlineMath math="\eta_1 = 1{,}0" /> für gute Verbundbedingungen (untere Bauteilhälfte); <InlineMath math="\eta_1 = 0{,}7" /> für mäßigen Verbund (oberste 25 cm wegen Wasseraufstieg/Bleeding).
                    </p>
                  </div>

                  <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                    <strong className="text-text-main block text-xs uppercase tracking-wide">
                      Das Thermex-Verfahren (Tempcore)
                    </strong>
                    <p className="text-text-main/80 leading-relaxed">
                      Wie erreicht man hohe Festigkeit bei geringem Kohlenstoffgehalt (<InlineMath math="\le 0{,}22\%" /> für perfekte Schweißbarkeit)?
                    </p>
                    <p className="text-text-main/80 leading-relaxed">
                      Aus der Walzhitze (<InlineMath math="\approx 950^\circ\text{C}" />) durchläuft der Stab eine intensive Wasser-Kühlstrecke. Die äußere Randschicht kühlt schlagartig ab und wandelt sich in harten Martensit um. Der heiße Kern kühlt danach langsam an Luft ab und <strong>lässt die Randschicht von innen heraus thermisch an</strong>.
                    </p>
                    <div className="flex gap-2 text-[11px] font-medium text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                      <span>✓</span>
                      <span>Ergebnis: Zäher, elastischer Ferrit-Perlit-Kern mit hochfestem Anlassmartensit-Randring.</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Erzeugnisform Litzen */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Spannlitzen</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-semibold">prEN 10138-3 / abZ</span>
                      </div>
                      <div className="text-sm font-bold text-text-main">Y1860 S7 (7-drähtig)</div>
                      <p className="text-xs text-text-main/75 leading-relaxed">
                        6 schraubenförmig um 1 Kerndraht verseilte Runddrähte. Höchste Flexibilität für gekrümmte Spanngliedführungen in Brückenüberbauten.
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-slate-600">
                        <span>fpk (Zugfestigkeit):</span>
                        <span className="font-bold text-shiraz">1860 N/mm²</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>fp0,1k (0,1%-Grenze):</span>
                        <span className="font-bold text-slate-800">1600 N/mm²</span>
                      </div>
                    </div>
                  </div>

                  {/* Erzeugnisform Stäbe */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Spannstäbe</span>
                        <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-mono font-semibold">prEN 10138-4 / abZ</span>
                      </div>
                      <div className="text-sm font-bold text-text-main">SAS 670 / SAS 950</div>
                      <p className="text-xs text-text-main/75 leading-relaxed">
                        Warmgewalzter Rundstahl mit aufgewalzten Gewinderippen. Beliebiges bauseitiges Ablängen und Koppelung mittels Gewindemuffen.
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-slate-600">
                        <span>Durchmesser:</span>
                        <span className="font-bold text-slate-800">18 &dots; 47 mm</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Einsatz:</span>
                        <span className="font-bold text-slate-800">Geotechnik / Quervorsp.</span>
                      </div>
                    </div>
                  </div>

                  {/* Erzeugnisform Drähte */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Spanndrähte</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">prEN 10138-2 / abZ</span>
                      </div>
                      <div className="text-sm font-bold text-text-main">Y1770 C (Einzeldraht)</div>
                      <p className="text-xs text-text-main/75 leading-relaxed">
                        Kaltgezogene Einzeldrähte, glatt oder profiliert. Standard für Spannbeton-Eisenbahnschwellen und Hohlkörper-Deckenplatten.
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-slate-600">
                        <span>fpk (Zugfestigkeit):</span>
                        <span className="font-bold text-slate-800">1570 &dots; 1770 N/mm²</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Verfahren:</span>
                        <span className="font-bold text-slate-800">Sofortiger Verbund</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                    <strong className="text-text-main block text-xs uppercase tracking-wide">
                      Spannungsrelaxation unter Dauerlast (EC2 Gl. 3.28–3.30)
                    </strong>
                    <p className="text-text-main/80 leading-relaxed">
                      Unter hoher konstanter Vorspannung (<InlineMath math="\sigma_{p0} \approx 0{,}7 \dots 0{,}8 f_{pk}" />) wandern Versetzungen kontinuierlich weiter. Dadurch sinkt die elastische Zugspannung zeitabhängig ab – ohne dass sich die Bauteillänge ändert!
                    </p>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-center font-mono text-[11px]">
                      <InlineMath math="\frac{\Delta\sigma_{pr}}{\sigma_{pi}} \approx 0{,}66 \cdot \rho_{1000} \cdot e^{9{,}1 \mu} \cdot \left(\frac{t}{1000}\right)^{0{,}75(1-\mu)}" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Moderne Spannlitzen erfüllen <strong>Klasse 2 (sehr niedrige Relaxation)</strong> mit einem 1000-Stunden-Verlust von <InlineMath math="\rho_{1000} \le 2{,}5\%" /> bei 20 °C.
                    </p>
                  </div>

                  <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200/80 space-y-2">
                    <strong className="text-rose-900 block text-xs uppercase tracking-wide flex items-center gap-1.5">
                      <Flame className="text-rose-600 h-4 w-4" />
                      Sicherheitskritisches Schweißverbot für Spannstähle!
                    </strong>
                    <p className="text-rose-950/85 leading-relaxed">
                      <strong>WARUM DARF AN SPANNSTAHL UNTER KEINEN UMSTÄNDEN GESCHWEISST WERDEN?</strong>
                    </p>
                    <p className="text-rose-950/85 leading-relaxed">
                      Spannstahl besitzt ca. <strong>0,80 bis 0,85 % Kohlenstoff</strong> und eine durch mehrfaches Kaltziehen erzeugte feinfaserige Kristalltextur.
                    </p>
                    <p className="text-rose-950/85 leading-relaxed">
                      Bereits ein minimaler Funkenüberschlag (Lichtbogenzündung) erhitzt den Stahl über die Austenitisierungstemperatur. Das umliegende kalte Material kühlt die Stelle blitzartig ab (Selbstabschreckung). Es entsteht <strong>glasharter, extrem spröder Martensit mit Mikrorissen</strong>. Unter der gigantischen Vorspannung reißt das Spannglied schlagartig und ohne Vorwarnung ab!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Detaillierter Stahlsorten-Katalog mit Reitern & Kategorien-Filter */}
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-home-grau/15 pb-3">
              <h4 className="font-bold text-text-main text-base flex items-center gap-2">
                <Layers size={18} className="text-shiraz" /> Register der Stahlwerkstoffe ({filteredSteelGrades.length} Güten)
              </h4>

              {/* Kategorie Filter-Pills */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                <button aria-pressed={steelCatalogFilter === 'all'}
                  onClick={() => setSteelCatalogFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    steelCatalogFilter === 'all'
                      ? 'bg-shiraz text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Alle ({extendedSteelGrades.length})
                </button>
                <button aria-pressed={steelCatalogFilter === 'baustahl'}
                  onClick={() => setSteelCatalogFilter('baustahl')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    steelCatalogFilter === 'baustahl'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  Baustähle ({extendedSteelGrades.filter(g => g.category === 'baustahl').length})
                </button>
                <button aria-pressed={steelCatalogFilter === 'bewehrung'}
                  onClick={() => setSteelCatalogFilter('bewehrung')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    steelCatalogFilter === 'bewehrung'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  Bewehrungsstähle ({extendedSteelGrades.filter(g => g.category === 'bewehrung').length})
                </button>
                <button aria-pressed={steelCatalogFilter === 'spannstahl'}
                  onClick={() => setSteelCatalogFilter('spannstahl')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    steelCatalogFilter === 'spannstahl'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
                  }`}
                >
                  Spannstähle ({extendedSteelGrades.filter(g => g.category === 'spannstahl').length})
                </button>
                <button aria-pressed={steelCatalogFilter === 'edelstahl'}
                  onClick={() => setSteelCatalogFilter('edelstahl')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    steelCatalogFilter === 'edelstahl'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                  Edelstähle ({extendedSteelGrades.filter(g => g.category === 'edelstahl').length})
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Linke Spalte: Stahlsorten-Selector */}
              <div className="lg:w-1/3 flex flex-col gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[580px] overflow-y-auto pr-1">
                  {filteredSteelGrades.map((gradeItem) => (
                    <button aria-pressed={selectedStahlsorteId === gradeItem.id}
                      key={gradeItem.id}
                      onClick={() => setSelectedStahlsorteId(gradeItem.id)}
                      className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-start cursor-pointer hover:shadow-sm ${
                        selectedStahlsorteId === gradeItem.id
                          ? 'bg-shiraz border-shiraz text-white shadow-md shadow-shiraz/10'
                          : 'bg-slate-50/50 border-slate-100 text-text-main hover:bg-slate-100/50'
                      }`}
                      id={`steel-selector-btn-${gradeItem.id}`}
                    >
                      <span className="font-bold text-sm md:text-base flex items-center gap-1.5 w-full justify-between">
                        <span>{gradeItem.name}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          selectedStahlsorteId === gradeItem.id
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {gradeItem.categoryLabel}
                        </span>
                      </span>
                      <span className={`text-xs mt-1 font-normal line-clamp-1 ${
                        selectedStahlsorteId === gradeItem.id ? 'text-white/80' : 'text-slate-500'
                      }`}>
                        {gradeItem.sub.split('(')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rechte Spalte: Steckbrief der ausgewählten Güte */}
              <div className="lg:w-2/3 bg-slate-50/40 p-5 rounded-2xl border border-slate-100 flex flex-col gap-4">
                <div className="border-b border-home-grau/20 pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h4 className="text-xl font-bold text-text-main">{activeGradedData.name}</h4>
                    <div className="flex gap-2">
                      <span className="bg-shiraz/10 text-shiraz font-mono text-xs px-2.5 py-1 rounded-full font-bold">
                        W.-Nr. {activeGradedData.werkstoffnummer}
                      </span>
                      <span className="bg-slate-200/70 text-slate-700 font-mono text-xs px-2.5 py-1 rounded-full">
                        {activeGradedData.density}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-shiraz font-semibold tracking-wide flex items-center gap-1">
                    <Sparkles size={12} /> {activeGradedData.sub}
                  </p>
                </div>

                <p className="text-sm text-text-main/90 leading-relaxed font-normal">
                  {activeGradedData.description}
                </p>

                {/* Gefügedaten & Werkstoffkenngrößen als Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Streckgrenze fy</span>
                    <span className="text-base font-bold text-shiraz font-mono mt-0.5">{formatDeWert(activeGradedData.fy)} MPa</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Mindestfließgrenze</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zugfestigkeit fu</span>
                    <span className="text-base font-bold text-text-main font-mono mt-0.5">{formatDeWert(activeGradedData.fu)} MPa</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Bruchspannung</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">C-Gehalt</span>
                    <span className="text-base font-bold text-text-main font-mono mt-0.5">{activeGradedData.carbonContent}</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Max. Massenanteil</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Schweißbarkeit</span>
                    <span className="text-xs font-bold text-teal-600 mt-1 line-clamp-1">{activeGradedData.weldability.split(';')[0]}</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Technologische Eignung</span>
                  </div>
                </div>

                {/* Anwendungen & Vorteile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
                    <h5 className="font-bold text-text-main text-xs uppercase tracking-wider text-slate-500 pb-1.5 border-b border-dashed border-slate-100 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span> Typische Anwendungen
                    </h5>
                    <ul className="text-xs text-text-main/80 space-y-2 list-none font-normal">
                      {activeGradedData.applications.map((app, uidx) => (
                        <li key={uidx} className="flex gap-1.5 items-start">
                          <span className="text-shiraz shrink-0 font-bold">✓</span>
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
                    <h5 className="font-bold text-text-main text-xs uppercase tracking-wider text-slate-500 pb-1.5 border-b border-dashed border-slate-100 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span> Werkstofftechnische Vorteile
                    </h5>
                    <ul className="text-xs text-text-main/80 space-y-2 list-none font-normal">
                      {activeGradedData.advantages.map((adv, adidx) => (
                        <li key={adidx} className="flex gap-1.5 items-start">
                          <span className="text-teal-600 shrink-0 font-bold">✓</span>
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Reales Referenzobjekt (Beispiel) */}
                <div className="bg-shiraz/[0.02] p-4 rounded-xl border border-shiraz/10 shadow-sm mt-1 space-y-2.5">
                  <div className="flex items-center justify-between gap-2 border-b border-shiraz/5 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 bg-shiraz/10 text-shiraz rounded">
                        <Activity size={12} />
                      </div>
                      <span className="text-xs font-bold text-shiraz uppercase tracking-wider">Praxis- &amp; Referenzbeispiel für {activeGradedData.name}</span>
                    </div>
                    <span className="text-[10px] bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">{activeGradedData.exampleObject.location}</span>
                  </div>
                  <div>
                    <h6 className="font-bold text-sm text-text-main mb-1">{activeGradedData.exampleObject.name}</h6>
                    <p className="text-xs text-text-main/85 leading-relaxed font-normal">
                      {activeGradedData.exampleObject.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Interaktives Dimensionierungsbeispiel & Materialeffizienz */}
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-slate-150">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-shiraz/10 rounded-lg text-shiraz">
                  <Scale size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main">Interaktives Dimensionierungsbeispiel &amp; CO₂-Bilanz</h3>
                  <p className="text-xs text-text-main/70">Wahl der Stahlsorte zur Gewichtsreduktion und Erhöhung der materialeffizienten Tragfähigkeit</p>
                </div>
              </div>
            </div>

            {/* Eingabeparameter Steuerungen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-text-main flex items-center gap-1.5">
                    1. Gewähltes Trägerprofil (Walzstahl)
                  </label>
                  <span className="text-xs bg-shiraz/10 text-shiraz font-semibold px-2 py-0.5 rounded">
                    {activeProfile.type}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {structuralProfiles.map((prof) => (
                    <button aria-pressed={selectedProfileId === prof.id}
                      key={prof.id}
                      onClick={() => setSelectedProfileId(prof.id)}
                      className={`p-2.5 rounded-lg text-left text-xs border transition-colors cursor-pointer ${
                        selectedProfileId === prof.id
                          ? 'bg-shiraz text-white border-shiraz font-bold'
                          : 'bg-white text-text-main border-slate-200 hover:bg-slate-100'
                      }`}
                      id={`profile-selector-${prof.id}`}
                    >
                      <div className="font-bold">{prof.name}</div>
                      <div className={`text-[10px] mt-0.5 font-normal ${selectedProfileId === prof.id ? 'text-white/80' : 'text-slate-400'}`}>
                        Wpl: {formatDeWert(prof.Wpl_y)} cm³, Gew: {formatDeWert(prof.weight)} kg/m
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-text-main flex items-center gap-1.5">
                    2. Bemessungsbiegemoment <InlineMath math="M_{Ed}" />
                  </label>
                  <span className="text-sm font-black text-shiraz bg-white px-2.5 py-1 rounded border shadow-sm font-mono">
                    {formatDeWert(designMoment)} kNm
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-400">10 kNm</span>
                  <div className="flex-1">
                    <Slider
                      label="Momentenbeanspruchung"
                      min={10}
                      max={600}
                      step={5}
                      value={designMoment}
                      onChange={(e) => setDesignMoment(Number(e.target.value))}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">600 kNm</span>
                </div>
                <p className="text-[10px] text-slate-500 font-normal">
                  * Entspricht der maximalen Biegungsbeanspruchung im Feld eines Einfeldträgers durch äußere Lasten. Es gilt d. Tragsicherheitsnachweis: <InlineMath math="M_{Ed} \le M_{pl,Rd}" />.
                </p>
              </div>
            </div>

            {/* Live Vergleichsergebnisse */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={14} className="text-shiraz" /> Live-Festigkeitsvergleich des Profils {activeProfile.name} in Abhängigkeit der Stahlgüten:
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-150">
                <table className="w-full text-xs md:text-sm text-left font-sans">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-bold">Stahlgüte</th>
                      <th className="px-4 py-3 text-center">Faktor fy</th>
                      <th className="px-4 py-3">Plastischer Momentenwiderstand Mpl,Rd</th>
                      <th className="px-4 py-3">Zentrische Normalkraftkapazität Npl,Rd</th>
                      <th className="px-4 py-3 text-center">Tragfähigkeits-Status</th>
                      <th className="px-4 py-3 text-right">Massen-Effizienz (Rel.)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {['S235', 'S355', 'S460', 'S690'].map((gradeId) => {
                      const associatedGrade = extendedSteelGrades.find(g => g.id === gradeId)!;
                      const fyValue = associatedGrade.fy;
                      const m_pl_rd = (activeProfile.Wpl_y * fyValue) / 1000;
                      const n_pl_rd = (activeProfile.Area * fyValue) / 10;
                      const isSufficient = m_pl_rd >= designMoment;
                      const relativeGain = ((fyValue - 235) / 235) * 100;

                      return (
                        <tr key={gradeId} className={`hover:bg-slate-50/50 transition-colors ${selectedStahlsorteId === gradeId ? 'bg-shiraz/[0.03] font-semibold' : ''}`}>
                          <td className="px-4 py-3 font-bold">
                            <span className="flex items-center gap-1.5">
                              {gradeId}
                              {selectedStahlsorteId === gradeId && (
                                <span className="w-1.5 h-1.5 rounded-full bg-shiraz animate-pulse"></span>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-slate-600">{formatDeWert(fyValue)} N/mm²</td>
                          <td className="px-4 py-3 font-mono font-bold text-shiraz">
                            {formatDeZahl(m_pl_rd, 1)} kNm
                          </td>
                          <td className="px-4 py-3 text-slate-700 font-mono">
                            {formatDeZahl(n_pl_rd, 0)} kN
                          </td>
                          <td className="px-4 py-3 text-center font-bold">
                            {isSufficient ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-1 rounded-full border border-emerald-200">
                                <Check size={10} className="stroke-[3px]" /> Erreicht (OK)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-[10px] px-2.5 py-1 rounded-full border border-red-200">
                                ✕ Nicht ausr.
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-teal-600">
                            {gradeId === 'S235' ? 'Basisreferenz' : `+${formatDeZahl(relativeGain, 1)}%`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. CO2- & Material-Ökobilanz visualisieren */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Scale size={11} className="text-shiraz" /> Tragwerkseigengewicht
                </span>
                <span className="text-xl font-mono font-black text-text-main">{formatDeZahl(activeProfile.weight, 1)} kg/m </span>
                <span className="text-[11px] text-slate-500 font-normal">Trägerlänge unbeeinflusst vom Stahlwerkstoff.</span>
              </div>

              <div className="flex flex-col gap-1 border-y md:border-y-0 md:border-x border-slate-200 md:px-4 py-2 md:py-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <TrendingDown size={11} className="text-teal-600" /> Profilhöhen-Reduzierung (S235 vs. S690)
                </span>
                <span className="text-xl font-bold text-teal-600 font-mono">
                  -33,3 %
                </span>
                <span className="text-[11px] text-slate-500 leading-normal font-normal">
                  IPE 300 (42,2 kg) kann beansprucht wie IPE 200 (22,4 kg) in S690 ausgeführt werden!
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Flame size={11} className="text-shiraz" /> CO₂-Emissionsvorteil bei Optimierung
                </span>
                <span className="text-xl font-mono font-black text-emerald-600">
                  ~ {formatDeZahl(((activeProfile.weight * 1.8) * 0.45), 1)} kg CO₂ / m
                </span>
                <span className="text-[11px] text-slate-500 leading-normal font-normal">
                  Vermeidete CO₂-Emissionen durch d. verringerten Vormaterialbedarf (Emissionsbasis: 1,8 kg CO₂/kg Baustahl).
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'steckbrief' && (
        <div className="animate-in fade-in duration-300">
          <BaustoffProfil materialKey="stahl" />
        </div>
      )}
      </div>
    
      <FormulaDerivationBox
        title="Anwendungsbeispiel: Plastischer Biegewiderstand eines IPE 300 aus S355"
        zielGleichung="M_{pl,Rd} = \frac{W_{pl,y} \cdot f_y}{\gamma_{M0}}"
        normQuelle="DIN EN 1993-1-1 mit NA, 6.2.5 (Querschnittsklasse 1, γ_M0 = 1,0)"
        schritte={[
          { titel: '1. Gegeben', formel: 'W_{pl,y} = 628{,}4\\,\\text{cm}^3,\\; f_y = 355\\,\\text{N/mm}^2,\\; M_{Ed} = 120\\,\\text{kNm}', erklaerung: 'Querschnittswerte nach Profiltabelle.' },
          { titel: '2. Widerstand', formel: 'M_{pl,Rd} = 628{,}4 \\cdot 35{,}5 / 1{,}0 = 22\\,308\\,\\text{kNcm} = 223\\,\\text{kNm}', erklaerung: 'f_y = 35,5 kN/cm².' },
          { titel: '3. Ausnutzung', formel: '\\eta = 120 / 223 = 0{,}54 \\le 1', erklaerung: 'Ohne Stabilitätsnachweis (Biegedrillknicken separat).' },
        ]}
        ergebnisHinweis="Ausnutzung 54 % – Biegedrillknicken und Gebrauchstauglichkeit sind gesondert nachzuweisen."
      />

      <ModulTest moduleId="stahl" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Stahlbau', url: 'https://de.wikipedia.org/wiki/Stahlbau' },
          { title: 'Ermüdung (Werkstoff)', url: 'https://de.wikipedia.org/wiki/Materialerm%C3%BCdung' },
          { title: 'Schweißen', url: 'https://de.wikipedia.org/wiki/Schwei%C3%9Fen' },
          { title: 'Stahlsorte', url: 'https://de.wikipedia.org/wiki/Stahlsorte' }
        ]}
        literatur={[
          'Petersen, Chr. (2013): Stahlbau - Grundlagen der Berechnung und baulichen Ausbildung (Springer Vieweg)',
          'Kindmann, R.; Krahwinkel, M.: Stahl- und Verbundkonstruktionen – Hallen-, Geschoss- und Brückenbau. 3., vollst. überarb. u. aktual. Aufl., Wiesbaden: Springer Vieweg 2016',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA (Eurocode 3, Teil 1-1; bauaufsichtlich eingeführt); 2. Generation DIN EN 1993-1-1:2025-04 mit DIN EN 1993-1-1/NA:2026-04 noch nicht eingeführt' },
          { title: 'DIN EN 1993-1-2:2010-12 mit NA (Eurocode 3, Teil 1-2: Brandfall)' },
          { title: 'DIN EN 1993-1-9:2010-12 mit NA (Eurocode 3, Teil 1-9: Ermüdung)' },
          { title: 'DIN EN 10025-2:2019-10 (Warmgewalzte Erzeugnisse aus unlegierten Baustählen)' },
          { title: 'DIN EN 1090-2:2018-09 (Ausführung von Stahltragwerken und Aluminiumtragwerken - Technische Regeln für Stahltragwerke)' },
          { title: 'DIN 488-1:2009-08 (Betonstahl – Sorten, Eigenschaften, Kennzeichen)' },
          { title: 'DIN EN ISO 12944-2 (Korrosionsschutz – Einteilung der Umgebungsbedingungen)' }
        ]}
        weblinks={[
          { title: 'Dlubal Querschnittswerte – Online-Profilrechner für Walzprofile', url: 'https://www.dlubal.com/de/querschnittswerte/' },
          { title: 'SkyCiv Free Beam Calculator – Momenten- & Querkraftverläufe', url: 'https://skyciv.com/free-beam-calculator/' }
        ]}
        formeln={[
          {
            formel: 'E_{a,\\theta} = k_{E,\\theta} \\cdot E_a \\quad \\text{und} \\quad f_{y,\\theta} = k_{y,\\theta} \\cdot f_y',
            erklaerung: 'Thermische Abminderung von E-Modul und Streckgrenze im Brandfall nach Eurocode 3 Teil 1-2 (E_a = 210\\,000\\text{ N/mm²}).',
            quelle: 'DIN EN 1993-1-2 Tab. 3.1'
          },
          {
            formel: '\\Delta\\sigma_R^m \\cdot N = \\Delta\\sigma_c^m \\cdot 2\\cdot 10^6',
            erklaerung: 'Wöhlerlinie für Ermüdungsfestigkeit nach EC3-1-9: \\Delta\\sigma_c = Kerbdetailkategorie (bei 2 Millionen Schwingspielen), m = Steigungsexponent (m = 3 für N \\le 5\\cdot 10^6).',
            quelle: 'DIN EN 1993-1-9'
          },
          {
            formel: '\\sigma_{\\text{res},c} \\approx -0{,}3 \\dots -0{,}5 \\cdot f_y',
            erklaerung: 'Charakteristische Druckeigenspannungen an den Flanschaußenkanten von warmgewalzten I-Profilen durch differenzielle Abkühlung nach dem Walzgang.',
            quelle: 'Petersen: Stahlbau'
          },
          {
            formel: 'E_s = \\eta \\cdot \\frac{U \\cdot I}{v} \\quad [\\text{kJ/mm}]',
            erklaerung: 'Streckenenergie beim Lichtbogenschweißen: \\eta = thermischer Wirkungsgrad, U = Schweißspannung [V], I = Schweißstrom [A], v = Schweißgeschwindigkeit [mm/s]. Bestimmt die Ausdehnung der Wärmeeinflusszone (WEZ).',
            quelle: 'DIN EN 1011-1'
          }
        ]}
      />
    </div>
  );
}