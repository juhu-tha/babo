import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Search, 
  ArrowRight, 
  GraduationCap, 
  Calculator, 
  HelpCircle, 
  FileText, 
  Database, 
  Layers, 
  CheckCircle, 
  ChevronDown, 
  ChevronRight, 
  HelpCircle as HelpIcon, 
  Globe,
  Compass,
  LayoutGrid,
  X,
  GitBranch,
  Sparkles,
  Trees,
  Building2,
  Leaf,
  AlertTriangle,
  Wrench,
  Map,
  BookOpen,
  Filter,
  Check,
  HardHat
} from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

// Define the full structure of the academy
interface MindmapNode {
  id?: string;
  link?: string;
  label: string;
  type: 'info' | 'calculator' | 'database' | 'quiz' | 'standard';
  description?: string;
  keywords?: string[];
}

interface MindmapGroup {
  name: string;
  color: string;
  icon: React.ReactNode;
  nodes: MindmapNode[];
  glowColor?: string; // custom glowing border classes for the mindmap nodes
}

export interface ThematicCluster {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  baseColor: string;
  badgeColor: string;
  accentColor: string;
  glowColor: string;
}

export const THEMATIC_CLUSTERS: ThematicCluster[] = [
  {
    id: 'studium',
    name: 'Studium & Info',
    description: 'Akademische Rahmenbedingungen, Masterstudien, Literaturen & Thesen',
    icon: GraduationCap,
    baseColor: 'border-slate-200 bg-white hover:bg-slate-50',
    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200/60',
    accentColor: 'text-shiraz',
    glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10'
  },
  {
    id: 'grundlagen',
    name: 'Grundlagen & Analytik',
    description: 'Strukturierte Physikkennwerte, Bauchemie, Laborversuche & Statistik',
    icon: Calculator,
    baseColor: 'border-slate-200 bg-white hover:bg-slate-50',
    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200/60',
    accentColor: 'text-shiraz',
    glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10'
  },
  {
    id: 'stoffe',
    name: 'Werkstoffe & Produkte',
    description: 'Klassische Baustofflehre (Holz, Stahl, Glas) & Produktrecht (CE, AVCP)',
    icon: Layers,
    baseColor: 'border-slate-200 bg-white hover:bg-slate-50',
    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200/60',
    accentColor: 'text-shiraz',
    glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10'
  },
  {
    id: 'konstruktion',
    name: 'Entwurf & Bemessung',
    description: 'Betonrezepturen, Massivbau, Holzbau, Standsicherheit & Eurocodes',
    icon: Network,
    baseColor: 'border-slate-200 bg-white hover:bg-slate-50',
    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200/60',
    accentColor: 'text-shiraz',
    glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10'
  },
  {
    id: 'bestand',
    name: 'Bestand & Nachhaltigkeit',
    description: 'Altbaugutachten, Mängel & Bauschäden, Bauwerksuntersuchung (ZfP), Rückbau, Abfälle & Ökologie',
    icon: Compass,
    baseColor: 'border-slate-200 bg-white hover:bg-slate-50',
    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200/60',
    accentColor: 'text-shiraz',
    glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10'
  },
  {
    id: 'praxis',
    name: 'Digitales & Infos',
    description: 'BIM, künstliche Intelligenz (AI), Bauleitung, Bautagebuch, Software, Quellen & Kuriositäten',
    icon: CheckCircle,
    baseColor: 'border-slate-200 bg-white hover:bg-slate-50',
    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200/60',
    accentColor: 'text-shiraz',
    glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10'
  }
];

export const GROUP_CLUSTER_MAPPING: Record<string, string> = {
  'Baustofflabor': 'studium',
  'Vorlesungen': 'studium',
  'Übersicht & Zugang': 'studium',
  'Bauen im Bestand (VL)': 'studium',
  'Nachhaltiges Bauen (VL)': 'studium',
  'Bauschäden (VL)': 'studium',
  'Baustoffkunde (VL)': 'studium',
  'Instandhaltung (VL)': 'studium',
  'Allgemein': 'studium',
  'Weiter@THA': 'studium',
  'Thesen & Projekte': 'studium',
  'Infos & Quellen': 'praxis',
  'Grundlagen': 'grundlagen',
  'Mechanik': 'grundlagen',
  'Labor & Auswertung': 'grundlagen',
  'Baustoffe': 'stoffe',
  'Bauprodukte': 'stoffe',
  'Betontechnologie': 'konstruktion',
  'Massivbau': 'konstruktion',
  'Bauphysik': 'konstruktion',
  'Bauen im Bestand': 'bestand',
  'Dauerhaftigkeit': 'bestand',
  'Mängel & Schäden': 'bestand',
  'Schutz & Instandsetzung': 'bestand',
  'Rückbau & Schadstoffe': 'bestand',
  'Nachhaltigkeit': 'bestand',
  'Digitales': 'praxis',
  'KI im Bauwesen': 'praxis',
  'Holzbau': 'konstruktion',
  'Beispielrechnungen': 'studium',
  'Praxiswissen': 'praxis',
  'Übungsaufgaben': 'studium',
  'Studium THA': 'studium',
  'Kuriositäten': 'praxis'
};

export const getClusterBorderClass = (clusterId: string | undefined): string => {
  if (clusterId) {
    return 'border-shiraz/40 ring-2 ring-shiraz/10 bg-shiraz/5';
  }
  return 'border-slate-200/80';
};

export default function Modulstruktur() {
  const { setActiveTab } = useTabContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [activeGroupFilter, setActiveGroupFilter] = useState<string | null>(null);
  const [activeClusterFilter, setActiveClusterFilter] = useState<string | null>(null);
  
  // Choose between 'star' (sternförmiger Campus-Wissensgraph), 'map' (thematische Campus-Sektionen), 'matrix' (kompakte Karten), 'tree' (hierarchischer Strukturbaum)
  const [viewMode, setViewMode] = useState<'star' | 'map' | 'matrix' | 'tree'>('star');
  const [activeStarCluster, setActiveStarCluster] = useState<string>('grundlagen');
  const [activeStarGroup, setActiveStarGroup] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'calculator' | 'database' | 'quiz' | 'standard'>('all');

  // States specifically for tree view hierarchical structure
  const [expandedSektionen, setExpandedSektionen] = useState<Record<string, boolean>>({
    'studium': true,
    'grundlagen': true,
    'stoffe': true,
    'konstruktion': true,
    'bestand': true,
    'praxis': true,
  });
  const [expandedTreeGroups, setExpandedTreeGroups] = useState<Record<string, boolean>>({});

  const isSektionExpanded = (sektionId: string) => {
    if (searchQuery.trim() !== '') return true; // force-expand during active search
    return !!expandedSektionen[sektionId];
  };

  const isGroupExpanded = (groupName: string) => {
    if (searchQuery.trim() !== '') return true; // force-expand during active search
    return !!expandedTreeGroups[groupName];
  };

  const toggleSektion = (sektionId: string) => {
    setExpandedSektionen(prev => ({ ...prev, [sektionId]: !prev[sektionId] }));
  };

  const toggleTreeGroup = (groupName: string) => {
    setExpandedTreeGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const expandAllTree = () => {
    const sektionUpdates: Record<string, boolean> = {};
    THEMATIC_CLUSTERS.forEach(c => {
      sektionUpdates[c.id] = true;
    });
    setExpandedSektionen(sektionUpdates);

    const groupUpdates: Record<string, boolean> = {};
    mindmapGroups.forEach(g => {
      groupUpdates[g.name] = true;
    });
    setExpandedTreeGroups(groupUpdates);
  };

  const collapseAllTree = () => {
    const sektionUpdates: Record<string, boolean> = {};
    THEMATIC_CLUSTERS.forEach(c => {
      sektionUpdates[c.id] = false;
    });
    setExpandedSektionen(sektionUpdates);

    const groupUpdates: Record<string, boolean> = {};
    mindmapGroups.forEach(g => {
      groupUpdates[g.name] = false;
    });
    setExpandedTreeGroups(groupUpdates);
  };

  // Group structures with a modern, reduced color scheme (clean slate/gray colors)
  const mindmapGroups: MindmapGroup[] = useMemo(() => [
    {
      name: 'Allgemein',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <GraduationCap size={16} className="text-slate-600" />,
      nodes: [
        { id: 'start', label: 'Startseite', type: 'standard', description: 'Das Begrüßungs- und Einstiegsportal.' },
        { id: 'admin', label: 'Admin & Audit (THA)', type: 'info', description: 'Auditprompt, Gestaltungs-Guidelines, Codeumfang & Tech-Stack.' },
        { id: 'anleitung', label: 'Anleitung', type: 'info', description: 'Bedienungshinweise und Rechner-Handbuch.' },
        { id: 'modulstruktur', label: 'Modulstruktur', type: 'info', description: 'Interaktives Modulstruktur-Verzeichnis.' },
        { id: 'feedback', label: 'Feedback & Evaluation', type: 'standard', description: 'Qualitätssicherung des Lehrangebots.' },
        { id: 'versionen', label: 'Changelog / Versionen', type: 'info', description: 'Entwicklungsverlauf und Neuerungen.' },
        { id: 'impressum', label: 'Impressum & Datenschutz', type: 'standard', description: 'Rechtliche Informationen.' },
        { id: 'kuriositaeten', label: 'Kuriositäten & Baufails', type: 'info', description: 'Kuriose historische Baustoffe und spektakuläre Bauschäden.' },
        { id: 'sonstiges', label: 'Sonstiges & Werkzeuge', type: 'info', description: 'Zusatztools und Querschnittsressourcen.' }
      ]
    },
    {
      name: 'Grundlagen',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Layers size={16} className="text-slate-600" />,
      nodes: [
        { id: 'grundlagen_info', label: 'Modulinfos Grundlagen', type: 'info' },
        { id: 'baustoffkunde', label: 'Baustoffkunde', type: 'standard', description: 'Strukturierte Beschreibung des Fachbereiches, Systematik der Baustoffe sowie eine kurze historische Entwicklung.' },
        { id: 'einheiten', label: 'Einheitenumrechner', type: 'calculator', description: 'SI-Präfixe und bauphysikalische Einheiten.' },
        { id: 'materialkennwerte', label: 'Kennwerte-Datenbank', type: 'database', description: 'Umfangreiche physikalische Stoffdatentabelle.' },
        { id: 'baustoffkenngroessen', label: 'Baustoffkenngrößen', type: 'standard', description: 'Porosität, Reindichte, Wasseraufnahme, Schwinden sowie einfache Beispielrechnungen.' },
        { id: 'bauchemie', label: 'Bauchemie', type: 'standard', description: 'Formeln, Mineralien, Säure-Base-Reaktionen.' },
        { id: 'sicherheitskonzept', label: 'Eurocode-Sicherheit', type: 'calculator', description: 'Einwirkungs- & Teilsicherheitsbeiwerte.' },
        { id: 'regularien', label: 'Regulatives & Normung', type: 'info', description: 'DIN, EN, ISO, DIBt und Landesbauordnungen.' }
      ]
    },
    {
      name: 'Labor & Auswertung',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Database size={16} className="text-slate-600" />,
      nodes: [
        { id: 'labor_info', label: 'Modulinfos Labor/Statistik', type: 'info' },
        { id: 'probenahme', label: 'Probenahme & Erkundung', type: 'standard', description: 'Bohrkerne, Aufmaß und Schadensaufnahme vor Ort.' },
        { id: 'messen_pruefen', label: 'Messen & Prüfen', type: 'info', description: 'Sensoren, Dehnungsmessstreifen (DMS), Laserscanning.' },
        { id: 'analytik', label: 'Analytik & Diagnostik', type: 'standard', description: 'Mikroskopie, Phasenanalyse (XRD), Thermogravimetrie.' },
        { id: 'zfp', label: 'Zerstörungsfreie Prüfung (ZfP)', type: 'standard', description: 'Ultraschall, Radar, Rückprallhammer und Wirbelstromverfahren.' },
        { id: 'mechanische_pruefungen', label: 'Mechanische Prüfungen', type: 'standard', description: 'Zugversuche, Druckversuche, Prüfmaschinen.' },
        { id: 'labor', label: 'Virtuelle Versuche (Labor)', type: 'calculator', description: 'Universalprüfmaschine, Haftzug-, Biegezug- & Spaltzugversuch, Schmidt-Hammer & Rheologie.' },
        { id: 'statistik', label: 'Datenanalyse & Statistik', type: 'calculator', description: 'Normalverteilung, Gauß-Kurve, Konfidenzintervalle, t-Test.' },
        { id: 'festbeton_statistik', label: 'Festbeton (Statistik)', type: 'calculator', description: 'Konformitätskontrolle nach DIN EN 206.' },
        { label: 'RILEM Association', type: 'info', link: 'https://www.rilem.net', description: 'Internationale Vereinigung für Materialforschung und Prüflabore.' }
      ]
    },
    {
      name: 'Baustoffe',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Layers size={16} className="text-slate-600" />,
      nodes: [
        { id: 'baustoffe_info', label: 'Modulinfos Werkstoffkunde', type: 'info' },
        { id: 'gesteine', label: 'Natursteine & Gesteine', type: 'standard' },
        { id: 'mauerwerk', label: 'Mauerwerk & Ziegel', type: 'standard' },
        { id: 'putzemoertel', label: 'Putze & Mörtel', type: 'standard' },
        { id: 'gips', label: 'Gips & Calciumsulfat', type: 'standard' },
        { id: 'kalk', label: 'Baukalk (Luftkalk, Hydrate)', type: 'standard' },
        { id: 'lehm', label: 'Lehm & Stampflehm', type: 'standard' },
        { id: 'erdbau', label: 'Erdbau & Bodenmechanik', type: 'calculator', description: 'Sieblinien-Berechner & Atterberg-Grenzen.' },
        { id: 'glas', label: 'Glas & Glaskorrosion', type: 'standard' },
        { id: 'stahl', label: 'Stahl & FE-C-Diagramme', type: 'standard' },
        { id: 'metalle', label: 'Nichteisenmetalle (Al, Cu, Zn)', type: 'standard' },
        { id: 'holz', label: 'Nadel- & Laubholz', type: 'standard' },
        { id: 'holzwerkstoffe', label: 'Holzwerkstoffe & Platten', type: 'standard' },
        { id: 'nawaro', label: 'Nachwachsende Rohstoffe (NaWaRo)', type: 'standard', description: 'Stroh, Hanf, Flachs, Schafwolle und biobasierte Verbundwerkstoffe.' },
        { id: 'asphalt', label: 'Asphalt & Bitumenprüfung', type: 'standard' },
        { id: 'kunststoffe', label: 'Kunststoffe & Polymere', type: 'standard' },
        { id: 'daemmstoffe', label: 'Dämmstoffe im Hochbau', type: 'standard' },
        { id: 'ausbau', label: 'Ausbau- & Abdichtungsmaterial', type: 'standard' },
        { id: 'faserverbund', label: 'Faserverbundwerkstoffe', type: 'standard' }
      ]
    },
    {
      name: 'Bauprodukte',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <FileText size={16} className="text-slate-600" />,
      nodes: [
        { id: 'bauprodukte_info', label: 'Modulinfos Bauprodukte', type: 'info' },
        { id: 'bp_baustoffindustrie', label: 'Baustoffindustrie', type: 'info', description: 'Sektoren, Branchenkennzahlen und Transformations-Roadmap.' },
        { id: 'bp_innovationen', label: 'Innovationen & F&E', type: 'standard', description: 'Technologischer Reifegrad (TRL 1-9), F&E-Fördermittel, Zukunftswerkstoffe und Zulassungspfade (abZ/aBG).' },
        { id: 'bp_rechtliches', label: 'Rechtliche Grundlagen BauPVO', type: 'info', description: 'Europäische Bauprodukteverordnung und Bauordnungsrecht.' },
        { id: 'bp_recht_grundlagen', label: 'CE-Kennzeichnung & MVV TB', type: 'info' },
        { id: 'bp_recht_avcp', label: 'AVCP-Systeme', type: 'standard' },
        { id: 'bp_recht_konformitaet', label: 'WPK & Konformität', type: 'info' },
        { id: 'bp_recht_normen', label: 'Normungsarbeit', type: 'info' },
        { id: 'bp_beton', label: 'Betonwaren-Normen', type: 'info' },
        { id: 'bp_betonfertigteile', label: 'Tragwerke / Fertigteile', type: 'standard' },
        { id: 'bp_betonwaren', label: 'Pflaster & Platten', type: 'standard' },
        { id: 'bp_mauerwerk', label: 'Mauersteine & Zargen', type: 'standard' },
        { id: 'bp_verkehrswegebau', label: 'Verkehrswegebau Übersicht', type: 'standard', description: 'Gesamtkonzept Schichtenaufbau und Tragschichten.' },
        { id: 'bp_verkehr_rsto', label: 'Straßenbau (RStO 12/24 & Asphalt)', type: 'calculator', description: 'Dimensionierung nach Belastungsklassen und Luftporenberechnung.' },
        { id: 'bp_verkehr_asphalt', label: 'Asphalttragschichten', type: 'standard', description: 'Asphaltmischgutarten, AC D, AC B und SMA Deckschichten.' },
        { id: 'bp_verkehr_bitumen', label: 'Bitumen & Bindemittel', type: 'standard', description: 'Nadelpenetration, Erweichungspunkt RuK und PmB.' },
        { id: 'bp_verkehr_pruefung', label: 'Verkehrswege-Prüfungen', type: 'calculator', description: 'Marshall-Körper, Spurbildungsversuch und Hohlraumgehalt.' },
        { id: 'bp_verkehr_betondecken', label: 'Betondecken im Straßenbau', type: 'standard', description: 'Waschbeton, Fugen und Dübelung nach ZTV Beton-StB.' },
        { id: 'bp_verkehr_tiefbau', label: 'Tiefbau & Entwässerung', type: 'calculator', description: 'Kanalisation, Abwassertransport und Rigolenversickerung (DWA-A 138).' },
        { id: 'bp_verkehr_bahn', label: 'Bahnbau & Oberbau', type: 'standard', description: 'Gleisschotter (DIN EN 13450) und feste Fahrbahnsysteme.' },
        { id: 'bp_verkehr_tunnel', label: 'Tunnelbau & Spritzbeton', type: 'standard', description: 'NATM-Sicherung und Tunnelrechner für den Gebirgsdruck.' },
        { id: 'bp_dach_fassade', label: 'Dachbahnen & Vorhangfassaden', type: 'standard' },
        { id: 'bp_trockenbau', label: 'Gipskartonständerwerk', type: 'standard' },
        { id: 'bp_putz_estrich', label: 'Fließestrich / Sanierputz', type: 'standard' },
        { id: 'bp_abdichtung', label: 'Bauwerksabdichtungsstoffe', type: 'standard' },
        { id: 'bp_daemmung', label: 'EPS, XPS, Mineralwolle', type: 'standard' },
        { id: 'bp_befestigung', label: 'Schwerlastdübel & Anker', type: 'standard' },
        { id: 'bp_klebstoffe', label: 'Dichtstoffe & Silikone', type: 'standard' },
        { id: 'bp_farben_lacke', label: 'Farben, Lacke & Lasuren', type: 'standard' },
        { id: 'bp_betonzusatzmittel', label: 'Zusatzmittel (FM, LP, VZ)', type: 'standard' },
        { id: 'bp_holzprodukte', label: 'Balkenschichtholz, Brettsperrholz', type: 'standard' },
        { id: 'bp_kunststoffe', label: 'Rohrsysteme, Folien', type: 'standard' },
        { id: 'bp_mineralisch', label: 'Zementäre Platten', type: 'standard' },
        { id: 'bp_glaeser', label: 'Gläser & Fenster (DIN EN 1279, DIN 18008)', type: 'calculator', description: 'Float, ESG, VSG, TVG, Low-E-Bedampfungen, Gasfüllungen, Fensterarten & Uw-Rechner.' },
        { id: 'bp_lehmbauprodukte', label: 'Lehmbauplatten & Lehmmörtel', type: 'standard' },
        { id: 'bp_metallisch', label: 'Alu- & Kupferprofile', type: 'standard' },
        { id: 'bp_stahlbauprofile', label: 'Doppel-T-Träger / HEA / HEB', type: 'standard' },
        { label: 'Deutsches Institut für Bautechnik (DIBt)', type: 'info', link: 'https://www.dibt.de', description: 'Zentrale deutsche Behörde für bauaufsichtliche Zulassungen.' }
      ]
    },
    {
      name: 'Betontechnologie',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Layers size={16} className="text-slate-600" />,
      nodes: [
        { id: 'beton_info', label: 'Modulinfos Beton', type: 'info' },
        { id: 'beton_a_z', label: 'Beton-Wiki (A-Z)', type: 'database', description: 'Fachlexikon für Betonbegriffe.' },
        { id: 'grundlagen', label: 'Ausgangsstoffe', type: 'standard', description: 'Zement, Wasser, Gesteinskörnung.' },
        { id: 'bindemittel', label: 'Hydratationschemie', type: 'standard', description: 'Hydratationsstufen der Klinkerphasen.' },
        { id: 'mischungsberechnung', label: 'Stoffraumrechnung', type: 'calculator', description: 'Rezepturgenerator, w/z-Wert und Sieblinie.' },
        { id: 'herstellung_einbau', label: 'Transport & Einbau', type: 'standard' },
        { id: 'frischbeton', label: 'Frischbetonprüfungen', type: 'calculator', description: 'Ausbreitmaß & Konsistenzklassen.' },
        { id: 'hydratation_folgen', label: 'Zementsteinbildung', type: 'standard' },
        { id: 'kriechen', label: 'Kriechen & Schwinden', type: 'calculator', description: 'Zeitabhängige viskoelastische Verformung nach EC2.' },
        { id: 'nachbehandlung', label: 'Curing / Nachbehandlung', type: 'standard' },
        { id: 'festbeton', label: 'Festbetoneigenschaften', type: 'standard' },
        { id: 'sonderbetone', label: 'UHPC, SVB & Leichtbeton', type: 'standard' },
        { id: 'innovative_werkstoffe', label: '3D-Druck & Carbonbeton', type: 'standard' },
        { id: 'qualitaetssicherung', label: 'QS im Betonwerk', type: 'standard' },
        { id: 'eigenspannungen', label: 'Thermische Eigenspannungen', type: 'calculator', description: 'Simuliert Temperaturgradienten im frühen Alter.' },
        { id: 'zwang', label: 'Zwangspannungen & Rissbildung', type: 'calculator', description: 'Behinderte Längenänderung durch Abkühlung & Schwinden.' },
        { id: 'expositionsklassen', label: 'Expositionsklassen & Folgen', type: 'calculator', description: 'Krell-Tabelle, DIN 1045-2 / EN 206, max. w/z, Min.-Festigkeit & Betondeckung.' },
        { id: 'betonpraxis', label: 'Baufehler & Schadensvermeidung', type: 'standard' }
      ]
    },
    {
      name: 'Massivbau',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Calculator size={16} className="text-slate-600" />,
      nodes: [
        { id: 'stahlbeton_info', label: 'Modulinfos Stahlbeton', type: 'info' },
        { id: 'stahlbeton_bemessung', label: 'Stahlbeton (EC2)', type: 'calculator', description: 'Integrierte Nachweise für Biegung, Querkraft, Stützen, Durchstanzen, Verankerung & Rissbreite.' },
        { id: 'spannung', label: 'Werkstoffgesetze (parabel-rechteck)', type: 'standard' },
        { id: 'spannbeton', label: 'Spannbetonprinzipien', type: 'standard' },
        { id: 'wu-bauwerke', label: 'Weiße Wannen (WU)', type: 'standard', description: 'Wassereindringtiefe & Fugenplanung.' },
        { id: 'carbonbeton', label: 'Textilbeton & Carbon', type: 'standard' }
      ]
    },
    {
      name: 'Mechanik',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Calculator size={16} className="text-slate-600" />,
      nodes: [
        { id: 'mechanik_info', label: 'Modulinfos Mechanik', type: 'info' },
        { id: 'formaenderungen', label: 'Durchbiegungs-Rechner', type: 'calculator', description: 'Integration der Biegelinie.' },
        { id: 'materialmodelle', label: 'Dämpfung & Viskoelastizität', type: 'standard', description: 'Kelvin-Voigt & Maxwell-Modelle sowie Thixotropie & Rheopexie.' },
        { id: 'emodul', label: 'Mikromechanik', type: 'calculator', description: 'Abschätzung des E-Moduls in Verbundfestigkeiten.' },
        { id: 'festigkeit', label: 'MoHrscher Spannungskreis', type: 'calculator', description: 'Hauptspannungsermittlung.' },
        { id: 'baustatik', label: 'Auflagerkräfte & Schnittgrößen', type: 'calculator', description: 'Momenten- & Querkraftverläufe.' },
        { id: 'knicken', label: 'Euler-Knicklastrechner', type: 'calculator', description: 'Euler-Fälle 1 bis 4.' },
        { id: 'bruchmechanik', label: 'Bruchzähigkeit (K_Ic)', type: 'standard' },
        { id: 'bodenmechanik', label: 'Bodenfestigkeit & Scherung', type: 'calculator', description: 'Setzungsrechner nach Terzaghi.' }
      ]
    },
    {
      name: 'Bauphysik',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Layers size={16} className="text-slate-600" />,
      nodes: [
        { id: 'bauphysik_info', label: 'Modulinfos Bauphysik', type: 'info' },
        { id: 'bauphysik', label: 'Bauphysik-Zentrum (U-Wert, Glaser & Akustik)', type: 'calculator', description: 'U-Wert (GModG, vormals GEG), f_RSi Schimmel-Beurteilung (DIN 4108-2), instationäre Wärmewelle, Raumakustik-Sollkorridor (DIN 18041) und Sabines Hallzeit.' },
        { id: 'waermeeigenschaften', label: 'Thermische Dämmung', type: 'standard' },
        { id: 'feuchteschutz', label: 'Glaser-Tauwasserkunde', type: 'calculator', description: 'Sättigungs- & Partialdrücke.' },
        { id: 'daemmung_vergleich', label: 'Innen- vs. Außendämmung', type: 'standard' },
        { id: 'schallschutz', label: 'Schalldämmmaß (Dezibel)', type: 'calculator', description: 'Berechnung nach dem Massegesetz.' },
        { id: 'brandschutz', label: 'Brandklassen (F30-F90)', type: 'standard' },
        { id: 'energieausweis', label: 'Bedarf & Verbrauch', type: 'calculator', description: 'Heizwärmebedarf / GEG-Kompaktrechner.' }
      ]
    },
    {
      name: 'Nachhaltigkeit',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Layers size={16} className="text-slate-600" />,
      nodes: [
        { id: 'nachhaltigkeit_info', label: 'Modulinfos Ökologie', type: 'info' },
        { id: 'nachhaltigkeit_daten_regeln', label: 'Daten & Regeln', type: 'standard', description: 'SDGs, EU-Taxonomie, EPBD, Stoffströme, EPD/DPP & Gesetze.' },
        { id: 'materialoptimierung', label: 'Binderoptimierung', type: 'standard', description: 'Klinkerarme Betone.' },
        { id: 'oekobilanz_lca', label: 'LCA Lebenszyklussimulator', type: 'calculator', description: 'GWP- und Treibhauspotenzialberechnung.' },
        { id: 'zertifizierung_siegel', label: 'DGNB / EPD / LEED', type: 'info', description: 'Umweltproduktdeklarationen.' },
        { id: 'kreislauf_dpp', label: 'Recyclingkreisläufe', type: 'standard', description: 'Rückbaubarkeit und Urban Mining.' },
        { id: 'ressourcen_umwelt', label: 'Primärrohstoffverbrauch', type: 'standard' },
        { id: 'ressourceneffizienz', label: 'Ressourceneffizienz', type: 'standard', description: 'Kaskadennutzung, zirkuläre Materialströme und Ressourcenschonung.' },
        { id: 'lebenszyklus_kosten', label: 'Investitions-Barwertrechner', type: 'calculator', description: 'Statische Lebenszykluskosten-Analyse (LCC).' }
      ]
    },
    {
      name: 'Digitales',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Database size={16} className="text-slate-600" />,
      nodes: [
        { id: 'digitales_info', label: 'Modulinfos Digitalisierung', type: 'info' },
        { id: 'online_tools', label: 'Empfohlene Online-Tools & Rechner', type: 'calculator', description: 'Kuratierte Webrechner für Statik, Bauphysik, LCA, BIM und Geotechnik.' },
        { id: 'bim_baustoffe', label: 'IFC-Dateistruktur', type: 'standard', description: 'Datenattribuierung und BIM-Integration.' },
        { id: 'materialdatenbanken', label: 'WEB-Schnittstellen (WECOBIS, ÖKOBAUDAT)', type: 'database' },
        { id: 'materialpaesse', label: 'Gebäude-Materialpass', type: 'database', description: 'Ressourceninventar für Gebäude.' },
        { id: 'dpp', label: 'Digitaler Produktpass (QR)', type: 'calculator', description: 'QR-Code-Strukturierung für Baustellen.' }
      ]
    },
    {
      name: 'Bauen im Bestand',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Layers size={16} className="text-slate-600" />,
      nodes: [
        { id: 'bestand_info', label: 'Modulinfos Umbau', type: 'info' },
        { id: 'bestand', label: 'Konstruktionsepochen', type: 'database', description: 'Altbaukonstruktionen Gründerzeit bis 1980.' },
        { id: 'bauwerkserfassung', label: '3D-Laserscanning', type: 'standard' },
        { id: 'denkmalpflege', label: 'Denkmalschutz-Baustoffe', type: 'standard', description: 'Opferputze, Reinkalk-Mauermörtel.' },
        { id: 'modernisierung', label: 'GEG-Sanierungsrechner', type: 'calculator', description: 'Investitionsrentabilität von Sanierungsmaßnahmen.' },
        { id: 'bauwerksuntersuchung', label: 'Bauwerksdiagnose & ZfP-Katalog', type: 'standard', description: '4-Phasen-Diagnosekonzept, Vor-Ort-ZfP, 14 Prüfverfahren im Detail mit interaktiven Simulatoren.' },
        { id: 'historisch', label: 'Historische Kennwerte', type: 'database', description: 'Historische Normfestigkeiten.' },
        { id: 'historische_bauweisen', label: 'Hist. Bauweisen', type: 'standard', description: 'Fachliche Systematik historischer Tragwerke und Bauteile.' },
        { id: 'historische_bauprodukte', label: 'Hist. Bauprodukte', type: 'standard', description: 'Historische Baustoffe, Ziegelformate und Instandsetzung.' },
        { id: 'bestand_checklisten', label: 'Bestands-Checklisten', type: 'info', description: 'Praxis-Leitfäden zur Begehung, Erfassung und Bewertung alter Bausubstanz.' }
      ]
    },
    {
      name: 'Rückbau & Schadstoffe',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <FileText size={16} className="text-slate-600" />,
      nodes: [
        { id: 'rueckbau_info', label: 'Modulinfos Rückbau', type: 'info' },
        { id: 'rueckbau', label: 'Selektives Rückbaukonzept', type: 'standard' },
        { id: 'abfaelle', label: 'AVV-Abfallschlüsseldatenbank', type: 'database', description: 'Systematische Zuordnung gefährlicher Abfälle.' },
        { id: 'schadstoffe', label: 'Gefahrstoffe (Asbest, KMF, PCB)', type: 'standard', description: 'Analytik, Grenzwerte und Arbeitsschutz.' },
        { id: 'boden_materialaufbereitung', label: 'Boden- & Baustoffaufbereitung', type: 'standard', description: 'Bodenwaschanlagen, Brecher- und Siebtechnik sowie Ersatzbaustoffverordnung (EBV).' },
        { id: 'rueckbau_checklisten', label: 'Rückbau-Checklisten', type: 'info', description: 'Praxis-Leitfäden für Schadstoffkataster und Abbruchanträge.' }
      ]
    },
    {
      name: 'Dauerhaftigkeit',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Layers size={16} className="text-slate-600" />,
      nodes: [
        { id: 'dauerhaftigkeit_info', label: 'Modulinfos Dauerhaftigkeit', type: 'info' },
        { id: 'dauerhaftigkeit', label: 'Lebensdauer-Modellierung', type: 'standard' },
        { id: 'korrosion', label: 'Bewehrungskorrosion', type: 'standard', description: 'Carbonatisierung & Chloridangriff.' },
        { id: 'schadreaktionen_beton', label: 'Betonkorrosion', type: 'standard', description: 'Alkali-Kieselsäure-Reaktion & Sulfatquellen.' },
        { id: 'holzkorrosion', label: 'Pilzbefall & Holzschutz', type: 'standard' },
        { id: 'metallkorrosion', label: 'Bimetall- & Kontaktkorrosion', type: 'standard' },
        { id: 'weitere_organik', label: 'Bitumenalterung & UV-Licht', type: 'standard' },
        { id: 'dauerhaftigkeit_checklisten', label: 'Dauerhaftigkeits-Checklisten', type: 'info', description: 'Prüflisten für Expositionsklassen, Rissbreiten und Schutzkonzepte.' }
      ]
    },
    {
      name: 'Mängel & Schäden',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Layers size={16} className="text-slate-600" />,
      nodes: [
        { id: 'schaeden_info', label: 'Modulinfos Mängel & Schäden', type: 'info' },
        { id: 'bauschaeden', label: 'Mängelhaftung & VOB/B', type: 'info' },
        { id: 'schadensbilder', label: 'Schadensatlas: Typische Bauschäden & Werkstoffversagen', type: 'database', description: 'Schadensforensik & Ursachenanalyse: Feuchtemechanismen (Jurin, DIN 18533, DIN 4108-2/3 f_Rsi), Rissbildung & Bruchmechanik (LEBM Griffith/Irwin), Bewehrungs- & Spannungsrisskorrosion (SpRK), AKR-Betonkrebs, Sulfattreiben (Ettringit/Thaumasit) und ZTV-ING.' },
        { id: 'bauwerksunters_monitoring', label: 'Tragwerks-Monitoring & Sensorik (SHM)', type: 'standard', description: 'Kontinuierliches SHM, LVDT-Rissaufnehmer, DMS, Piezosensoren, Holz-Resistographie und konsolidierter ZfP-Katalog.' },
        { id: 'vdi6200', label: 'Verkehrssicherheitsprüfung', type: 'calculator', description: 'Auswertung der Standsicherheit.' },
        { id: 'material_schaeden_gross', label: 'Große Materialschäden & Einstürze', type: 'database', description: 'Forensische Analyse historischer Katastrophen (AKR Betonschwellen Garmisch, Bad Reichenhall, Ponte Morandi, Carolabrücke, Hyatt Regency, etc.) mit Projektdaten, Historie, Ursachen & Folgen.' },
        { id: 'schaeden_checklisten', label: 'Mängel- & Schadens-Checklisten', type: 'info', description: 'Strukturierte Erfassungsbögen für Mängel- und Schadensgutachten vor Ort.' }
      ]
    },
    {
      name: 'Schutz & Instandsetzung',
      color: 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Layers size={16} className="text-slate-600" />,
      nodes: [
        { id: 'instandsetzung_info', label: 'Modulinfos Schutz & Instandsetzung', type: 'info' },
        { id: 'schutz_grundlagen', label: 'Schutz- & Instandsetzungsgrundlagen', type: 'standard', description: 'DIN EN 1504-9 Prinzipien, passive & aktive Schutzmechanismen, Tuutti-Modell und De-Sitter-Regel.' },
        { id: 'instandsetzung_materialien', label: 'Instandsetzung nach Materialien', type: 'standard', description: 'Werkstoffspezifischer Schutz & Sanierung für Holz, Metalle, Kunststoffe, Asphalt & Mauerwerk.' },
        { id: 'instandsetzung_holz', label: 'Instandsetzung Holz (DIN 68800)', type: 'standard', description: 'Bekämpfender und vorbeugender Holzschutz, Schwammsanierung, biologischer Befall & statische Verstärkung.' },
        { id: 'instandsetzung_metalle', label: 'Instandsetzung Metalle & Stahl (ISO 12944)', type: 'standard', description: 'Stahlkorrosionsschutz, Oberflächenvorbereitung Sa 2½, Reparatursysteme & Duplex-Beschichtungen.' },
        { id: 'instandsetzung_kunststoffe', label: 'Instandsetzung Kunststoffe & Fugen (DIN 18540)', type: 'standard', description: 'Sanierung elastischer Dehn- und Arbeitsfugen sowie thermoplastischer Abdichtungsbahnen.' },
        { id: 'instandsetzung_asphalt', label: 'Instandsetzung Asphalt & Straßen (ZTV BEA-StB)', type: 'standard', description: 'Erhaltung und Sanierung von Verkehrsflächen, Fräsen, Dünnschichten & Rissesanierung.' },
        { id: 'instandsetzung_mauerwerk', label: 'Instandsetzung Mauerwerk & Abdichtung (WTA)', type: 'standard', description: 'Nachträgliche Querschnittsabdichtung, Injektionsverfahren & salzresistente Sanierputze.' },
        { id: 'instandhaltung', label: 'Stahlbetoninstandhaltung', type: 'standard', description: 'Oberflächenschutzsysteme OS 1 bis OS 11, Rissinjektion und Reprofilierung.' },
        { id: 'wta', label: 'WTA-Merkblätter & Sanierputze', type: 'info', description: 'Instandsetzungsrichtlinien für Mauerwerk, Feuchteschutz und Steinkonservierung.' },
        { id: 'instandsetzung_checklisten', label: 'Instandsetzungs-Checklisten', type: 'info', description: 'Strukturierte Prüfformulare für Sachkundige Planer, Untergrundvorbereitung und Abnahme.' }
      ]
    },
    {
      name: 'Praxiswissen',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Layers size={16} className="text-slate-600" />,
      nodes: [
        { id: 'praxiswissen_info', label: 'Modulinfos Praxis', type: 'info' },
        { id: 'px_planung', label: 'HOAI & Ausschreibung (AVA)', type: 'info' },
        { id: 'px_bauleitung', label: 'Bautagebuch & Bauzeit', type: 'standard' },
        { id: 'px_bautagebuch', label: 'Interaktives Bautagebuch', type: 'calculator', description: 'Digitale Baustellendokumentation mit Witterung und Bautenstandsberichten.' },
        { id: 'px_produktion', label: 'WPK-Qualitätskontrolle', type: 'standard' },
        { id: 'px_karriere', label: 'Berufsstart & Soft Skills', type: 'standard' }
      ]
    },
    {
      name: 'Infos & Quellen',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Database size={16} className="text-slate-600" />,
      nodes: [
        { id: 'software', label: 'Engineering Software & Tools', type: 'database' },
        { id: 'glossar', label: 'Fachbegriff-Glossar (>500 Begriffe)', type: 'database', description: 'Suchbares Nachschlagewerk mit genormten Einheiten.' },
        { id: 'fortbildungen', label: 'Zertifikate & Ingenieurkammer', type: 'info' },
        { id: 'informationsquellen', label: 'Literaturrecherchen-Datenbank', type: 'database' },
        { id: 'literatur', label: 'Standardlehrwerke im Bauwesen', type: 'info' },
        { id: 'lokales', label: 'THA-Labore Augsburg', type: 'info' },
        { label: 'WECOBIS Baustoffberatung', type: 'database', link: 'https://www.wecobis.de', description: 'Ökologisches Baustoff-Informationssystem des Bundesministeriums.' },
        { label: 'ÖKOBAUDAT Plattform', type: 'database', link: 'https://www.oekobaudat.de', description: 'Einheitliche Datenbasis für die Ökobilanzierung von Bauwerken.' }
      ]
    },
    {
      name: 'Übungsaufgaben',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <CheckCircle size={16} className="text-slate-600" />,
      nodes: [
        { id: 'aufgaben_beton', label: 'Klausurtraining Betontechnologie', type: 'quiz' },
        { id: 'aufgaben_stahlbeton', label: 'Klausurtraining Massivbau', type: 'quiz' },
        { id: 'aufgaben_weitere', label: 'Klausurtraining Werkstoffkunde', type: 'quiz' },
        { id: 'aufgaben_mechanik', label: 'Klausurtraining Mechanik', type: 'quiz' },
        { id: 'aufgaben_bauphysik', label: 'Klausurtraining Bauphysik', type: 'quiz' },
        { id: 'aufgaben_bestand', label: 'Klausurtraining Bauen im Bestand', type: 'quiz' },
        { id: 'aufgaben_nachhaltigkeit', label: 'Klausurtraining Nachhaltigkeit', type: 'quiz' },
        { id: 'aufgaben_kennwerte', label: 'Klausurtraining Tabellen & Normen', type: 'quiz' },
        { id: 'aufgaben_komplex', label: 'Komplexe Fallstudien-Selbsttests', type: 'quiz' }
      ]
    },
    {
      name: 'Übersicht & Zugang',
      color: 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <GraduationCap size={16} className="text-shiraz" />,
      nodes: [
        { id: 'vl_ueberblick', label: 'Übersicht & Zugang', type: 'info', description: 'Geschützter Bereich für Studierende der TH Augsburg.' }
      ]
    },
    {
      name: 'Bauen im Bestand (VL)',
      color: 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Building2 size={16} className="text-shiraz" />,
      nodes: [
        { id: 'vl_bauen_im_bestand', label: 'Bauen im Bestand (1/2 SWS)', type: 'standard', description: 'Vorlesung: 1/2 SWS, Bestandserfassung, ZfP und EN 1990-2:2026.' }
      ]
    },
    {
      name: 'Nachhaltiges Bauen (VL)',
      color: 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Leaf size={16} className="text-shiraz" />,
      nodes: [
        { id: 'vl_nachhaltiges_bauen', label: 'Nachhaltiges Bauen (2 SWS)', type: 'standard', description: 'Vorlesung: 2 SWS, Ökobilanzierung, EU-Taxonomie & EPBD.' }
      ]
    },
    {
      name: 'Bauschäden (VL)',
      color: 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <AlertTriangle size={16} className="text-shiraz" />,
      nodes: [
        { id: 'vl_bauschaeden', label: 'Bauschäden (1/2 SWS)', type: 'standard', description: 'Vorlesung: 1/2 SWS, Schadensanalyse, Risse und VDI 6200.' }
      ]
    },
    {
      name: 'Baustoffkunde (VL)',
      color: 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Layers size={16} className="text-shiraz" />,
      nodes: [
        { id: 'vl_baustoffkunde', label: 'Baustoffkunde (2-4 SWS)', type: 'standard', description: 'Vorlesung: 2-4 SWS, mineralische & metallische Werkstoffe.' }
      ]
    },
    {
      name: 'Instandhaltung (VL)',
      color: 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Wrench size={16} className="text-shiraz" />,
      nodes: [
        { id: 'vl_instandhaltung', label: 'Instandhaltung (4 SWS)', type: 'standard', description: 'Vorlesung: 4 SWS, Schutz & Instandsetzung nach DIN EN 1504.' }
      ]
    },
    {
      name: 'Weiter@THA',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <GraduationCap size={16} className="text-slate-600" />,
      nodes: [
        { id: 'studium_tha', label: 'Portal app.tha.de & Campus-Tools', type: 'info', description: 'Zentrales Studierendenportal app.tha.de, Moodle, WebUntis, OPAC Bibliothek, Career Service und Mensa-Speisepläne.' },
        { id: 'weiter_tha', label: 'Alle Studienangebote', type: 'info', description: 'Gesamtübersicht aller Master- und Weiterbildungsangebote.' },
        { id: 'weiter_bauing', label: 'Master Bauingenieurwesen', type: 'standard', description: '3 Semester (Vollzeit / Teilzeit) • Master of Engineering (M.Eng.).' },
        { id: 'weiter_pm', label: 'Master Projektmanagement', type: 'standard', description: '5 Semester • Master of Engineering (M.Eng.) für Projektentwickler.' },
        { id: 'weiter_ausbau', label: 'Fachingenieur Ausbau', type: 'info', description: 'Zertifikatslehrgang des ibi für Schnittstellen im Innenausbau.' },
        { id: 'weiter_fassade', label: 'Fachingenieur Fassade', type: 'info', description: 'Zertifikatslehrgang des ibi für anspruchsvolle Gebäudehüllen.' },
        { id: 'weiter_holzbau', label: 'Fachingenieur Holzbau', type: 'info', description: 'Zertifikatslehrgang des ibi für Tragwerke und Brandschutz.' },
        { id: 'weiter_ttz', label: 'TTZ Aichach (digital. Holzbau)', type: 'info', description: 'Technologietransferzentrum für digitalisierten Holzbau.' },
        { id: 'weiter_mapr', label: 'MAPR (Applied Research Master)', type: 'standard', description: 'Applied Research Master (M.Sc.) an der TH Augsburg.' }
      ]
    },
    {
      name: 'Thesen & Projekte',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <FileText size={16} className="text-slate-600" />,
      nodes: [
        { id: 'thesen_projekte', label: 'Thesen & Semesterprojekte', type: 'info', description: 'Aktuelle Themenstellungen und Promotionsprojekte Augsburg.' }
      ]
    },
    {
      name: 'Holzbau',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Trees size={16} className="text-slate-600" />,
      nodes: [
        { id: 'holzbau_info', label: 'Modulinfos Holzbau', type: 'info', description: 'Ingenieurholzbau nach Eurocode 5 (DIN EN 1995-1-1).' },
        { id: 'holzbau_werkstoffe', label: 'Holzwerkstoffe & Festigkeitsklassen', type: 'standard', description: 'Vollholz C24, Brettschichtholz GL24h, BSP/CLT und Furnierschichtholz.' },
        { id: 'holzbau_konstruktion', label: 'Konstruktionssysteme & Holzrahmenbau', type: 'standard', description: 'Holzrahmenbau, Holzmassivbau, Skelettbau und Deckenkonstruktionen.' },
        { id: 'holzbau_bemessung', label: 'Bemessung nach EC 5 (GZT / GZG)', type: 'calculator', description: 'Biegebemessung, Schub, Knicken, Kippen und Durchbiegungsnachweise.' },
        { id: 'holzbau_verbindung', label: 'Verbindungsmittel & Anschlüsse', type: 'standard', description: 'Stabdübel, Bolzen, Nägel, Rillennägel und moderne Holzschrauben.' },
        { id: 'holzbau_bauphysik', label: 'Brandschutz & Bauphysik im Holzbau', type: 'standard', description: 'Abbrandraten (charring rate), Kapselkriterien und Schallschutzanforderungen.' }
      ]
    },
    {
      name: 'Innenausbau',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <LayoutGrid size={16} className="text-slate-600" />,
      nodes: [
        { id: 'innenausbau', label: 'Sammlung (Trockenbau & Ausbau)', type: 'standard', description: 'Zentrale Übersicht aller Trockenbau-Werkzeuge, Gipsplatten, Estrich- & Putzsysteme, Akustik, Brandschutz und Prüfstände.' }
      ]
    },
    {
      name: 'KI im Bauwesen',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Sparkles size={16} className="text-slate-600" />,
      nodes: [
        { id: 'ki_ueberblick', label: 'Überblick & Grundlagen', type: 'info', description: 'Historie, Status Quo, Zukunftsperspektiven und Kernbegriffe (ML, RAG, LLM, Vision) verständlich erklärt.' },
        { id: 'ki_system', label: 'Systemarchitektur', type: 'standard', description: 'Schrittweise technische Erklärung aller Schlüsseltechnologien (ML, DL, LLM, RAG, Vision, Agenten) und deren Einsatzzwecke.' },
        { id: 'ki_prompting', label: 'Prompt Engineering & Reasoning', type: 'calculator', description: 'Strukturierte Prompt-Muster, Few-Shot-Prompting und Chain-of-Thought für Bauingenieure.' },
        { id: 'ki_llmpraxis', label: 'LLM-Praxis (Claude & ChatGPT)', type: 'calculator', description: 'Professioneller Einsatz: Skills, MCP-Konnektoren, Markdown-Standardisierung, CLAUDE.md-Verzeichnisse und Web-Grounding.' },
        { id: 'ki_thesen', label: 'Forschung & Thesen', type: 'info', description: 'Zukunftsperspektiven und aktuelle Forschungsthesen im Bauwesen.' },
        { id: 'ki_recht_ethik', label: 'Recht, Ethik & EU AI Act', type: 'info', description: 'EU Artificial Intelligence Act, Haftungsfragen und ethische Leitplanken.' },
        { id: 'ki_lokal', label: 'Lokale KI & LM Studio', type: 'standard', description: 'Datenschutzkonforme Ausführung lokaler LLMs ohne Cloud-Abhängigkeit.' },
        { id: 'ki_ressourcen', label: 'KI-Ressourcen & Tools', type: 'database', description: 'Kuratierte Übersicht von Modellen, Repositories und Werkzeugen für das Bauwesen.' },
        { id: 'ki_onlinekurse', label: 'Onlinekurse & Video-Lernpfade', type: 'standard', description: 'Kuratierte deutschsprachige YouTube-Tutorials und Hochschul-MOOCs für Python, ML, RAG und MCP.' }
      ]
    },
    {
      name: 'Beispielrechnungen',
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200',
      glowColor: 'border-slate-300 text-slate-400 ring-slate-400/10',
      icon: <Calculator size={16} className="text-slate-600" />,
      nodes: [
        { id: 'rechnung_u_wert', label: 'Musterrechnung U-Wert', type: 'calculator', description: 'Schritt-für-Schritt-Berechnung des Wärmedurchgangskoeffizienten mehrschichtiger Bauteile.' },
        { id: 'rechnung_beton', label: 'Musterrechnung Betonrezeptur', type: 'calculator', description: 'Stoffraumrechnung, Wasserzementwert und Gesteinskörnungssieblinie.' },
        { id: 'rechnung_stahlbeton', label: 'Musterrechnung Biegebemessung', type: 'calculator', description: 'Rechteckquerschnitt mit Biegebewehrung im Grenzzustand der Tragfähigkeit (EC2).' },
        { id: 'rechnung_holzbau', label: 'Musterrechnung Holzträger', type: 'calculator', description: 'Biegespannungs- und Durchbiegungsnachweis eines Einfeldträgers nach EC5.' },
        { id: 'rechnung_mauerwerk', label: 'Musterrechnung Mauerwerk', type: 'calculator', description: 'Druckspannungs- und Knicknachweis von Mauerwerkswänden nach EC6.' },
        { id: 'rechnung_nachhaltigkeit', label: 'Musterrechnung CO₂-Bilanz / GWP', type: 'calculator', description: 'Treibhauspotenzialberechnung von Bauteilaufbauten über den Lebenszyklus (LCA).' },
        { id: 'rechnung_bestand', label: 'Musterrechnung Bestandssanierung', type: 'calculator', description: 'Energetische Amortisation und Sanierungsmehrkostenanalyse.' },
        { id: 'rechnung_schallschutz', label: 'Musterrechnung Schallschutz', type: 'calculator', description: 'Luftschalldämmung massiver Bauteile und Flankenkorrektur nach DIN 4109.' },
        { id: 'rechnung_brandschutz', label: 'Musterrechnung Brandschutz', type: 'calculator', description: 'Heißbemessung und effektiver Restquerschnitt im Holzbau nach Eurocode 5.' }
      ]
    }
  ], []);

  // Compute stats
  const stats = useMemo(() => {
    let subpages = 0;
    let calculators = 0;
    let databases = 0;
    let quizzes = 0;

    mindmapGroups.forEach(g => {
      g.nodes.forEach(n => {
        subpages++;
        if (n.type === 'calculator') calculators++;
        if (n.type === 'database') databases++;
        if (n.type === 'quiz') quizzes++;
      });
    });

    return {
      categories: mindmapGroups.length,
      subpages,
      calculators,
      databases,
      quizzes
    };
  }, [mindmapGroups]);

  // General Search Filter & Cluster/Category Filter
  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    // Process base matching groups by applying active filters
    let baseGroups = mindmapGroups;
    if (activeClusterFilter) {
      baseGroups = mindmapGroups.filter(g => GROUP_CLUSTER_MAPPING[g.name] === activeClusterFilter);
    } else if (activeGroupFilter) {
      baseGroups = mindmapGroups.filter(g => g.name === activeGroupFilter);
    }

    const matchesType = (node: MindmapNode) => {
      if (typeFilter === 'all') return true;
      if (typeFilter === 'standard') return node.type === 'standard' || node.type === 'info';
      return node.type === typeFilter;
    };

    return baseGroups.map(g => {
      const typeFilteredNodes = g.nodes.filter(matchesType);
      if (typeFilteredNodes.length === 0) return null;

      if (!query) {
        return { ...g, nodes: typeFilteredNodes };
      }

      const matchGroupName = g.name.toLowerCase().includes(query);
      const matchingNodes = typeFilteredNodes.filter(n => 
        n.label.toLowerCase().includes(query) || 
        (n.description && n.description.toLowerCase().includes(query)) ||
        (n.id && n.id.toLowerCase().includes(query))
      );

      if (matchGroupName || matchingNodes.length > 0) {
        return {
          ...g,
          nodes: matchGroupName ? typeFilteredNodes : matchingNodes
        };
      }
      return null;
    }).filter(Boolean) as MindmapGroup[];
  }, [mindmapGroups, searchQuery, activeGroupFilter, activeClusterFilter, typeFilter]);

  const toggleGroup = (name: string) => {
    setExpandedGroups(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const getNodeColor = (type: MindmapNode['type'], isLinkOnly?: boolean) => {
    if (isLinkOnly) {
      return 'border-slate-200 bg-white hover:bg-slate-50 hover:border-shiraz/40 text-slate-700';
    }
    return 'border-slate-200 bg-white hover:bg-slate-50/80 hover:border-slate-400 text-slate-800';
  };

  const getNodeBadge = (type: MindmapNode['type'], isLinkOnly?: boolean) => {
    if (isLinkOnly) {
      return <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1"><Globe size={10} /> Link</span>;
    }
    switch (type) {
      case 'calculator':
        return <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Rechner / Versuch</span>;
      case 'database':
        return <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Datenbank</span>;
      case 'quiz':
        return <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Prüfungsquiz</span>;
      case 'info':
        return <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Modulinfo</span>;
      default:
        return null;
    }
  };

  const handleNodeClick = (node: MindmapNode) => {
    if (node.id) {
      setActiveTab(node.id as any);
      setTimeout(() => {
        document.getElementById('scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else if (node.link) {
      const a = document.createElement('a');
      a.href = node.link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="space-y-6 select-none font-sans">
      {/* 1. Kompakter Header & Ansichtswähler */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-shiraz text-white rounded-xl flex items-center justify-center shadow-xs shrink-0">
              <Network size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                Campus-Modulstruktur &amp; Wissensgraph
              </h2>
              <p className="text-xs text-text-main/60">
                Akademische Wissenslandkarte, interaktives Organigramm und Direktnavigation (TH Augsburg)
              </p>
            </div>
          </div>

          {/* VIEW MODE TOGGLE (SCHLANK & GRAFISCH) */}
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200/80 shadow-2xs self-start md:self-auto gap-1">
            <button
              onClick={() => setViewMode('star')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'star' 
                  ? 'bg-shiraz text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Sparkles size={13} /> Sternförmig
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'map' 
                  ? 'bg-shiraz text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Map size={13} /> Campus-Map
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'matrix' 
                  ? 'bg-shiraz text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <LayoutGrid size={13} /> Matrix
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'tree' 
                  ? 'bg-shiraz text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <GitBranch size={13} /> Strukturbaum
            </button>
          </div>
        </div>

        {/* Schlankes Kennzahlen- & Typfilter-Band */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Kennzahlen Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-bold text-[11px] flex items-center gap-1.5">
              <GraduationCap size={13} className="text-shiraz" /> {formatDeWert(stats.categories)} Lehrgebiete
            </span>
            <span className="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-bold text-[11px] flex items-center gap-1.5">
              <Layers size={13} className="text-shiraz" /> {stats.subpages} Module
            </span>
            <span className="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-semibold text-[11px] flex items-center gap-1.5">
              <Calculator size={13} className="text-amber-600" /> {formatDeWert(stats.calculators)} Rechner
            </span>
            <span className="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-semibold text-[11px] flex items-center gap-1.5">
              <Database size={13} className="text-blue-600" /> {formatDeWert(stats.databases)} Datenbanken
            </span>
            <span className="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-semibold text-[11px] flex items-center gap-1.5">
              <HelpCircle size={13} className="text-emerald-600" /> {formatDeWert(stats.quizzes)} Quizzes
            </span>
          </div>

          {/* Typ-Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100/60 p-0.5 rounded-lg border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 px-1.5 uppercase font-mono">Typ:</span>
            {[
              { id: 'all', label: 'Alle' },
              { id: 'calculator', label: 'Rechner', icon: <Calculator size={11} className="text-amber-600" /> },
              { id: 'database', label: 'Daten', icon: <Database size={11} className="text-blue-600" /> },
              { id: 'quiz', label: 'Quiz', icon: <HelpCircle size={11} className="text-emerald-600" /> },
              { id: 'standard', label: 'Theorie', icon: <BookOpen size={11} className="text-slate-600" /> },
            ].map(tf => (
              <button
                key={tf.id}
                onClick={() => setTypeFilter(tf.id as any)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  typeFilter === tf.id
                    ? 'bg-white text-shiraz shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf.icon} {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live-Suchleiste */}
        <div className="mt-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder="Modul, Norm oder Thema suchen (z. B. Frischbeton, Eurocode, E-Modul, LCA)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-shiraz/20 focus:border-shiraz transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 2. THEMATIC CLUSTERS BAR (7 SEKTIONEN) */}
      <div className="bg-white p-4 rounded-2xl border border-home-grau/30 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
            <Compass size={12} className="text-shiraz" /> Sektionen &amp; Lehrstuhl-Bereiche:
          </span>
          {activeClusterFilter && (
            <button
              onClick={() => setActiveClusterFilter(null)}
              className="text-[10px] text-shiraz hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <X size={10} /> Filter zurücksetzen
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {THEMATIC_CLUSTERS.map(cluster => {
            const ClusterIcon = cluster.icon;
            const isSelected = activeClusterFilter === cluster.id;
            const count = mindmapGroups.filter(g => GROUP_CLUSTER_MAPPING[g.name] === cluster.id).length;

            return (
              <button
                key={cluster.id}
                onClick={() => setActiveClusterFilter(isSelected ? null : cluster.id)}
                className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-shiraz text-white border-shiraz shadow-xs ring-2 ring-shiraz/20'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className={`p-1 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-600 border border-slate-200/60'}`}>
                    <ClusterIcon size={13} />
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-600'}`}>
                    {count}
                  </span>
                </div>
                <div>
                  <span className={`text-xs font-bold block truncate leading-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                    {cluster.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. HAUPTANSICHTEN */}

      {/* ANSICHT 0: GRAFISCHE STERNFÖRMIGE RADIAL-MINDMAP */}
      {viewMode === 'star' && (() => {
        // Find current selected cluster
        const currentCluster = THEMATIC_CLUSTERS.find(c => c.id === activeStarCluster) || THEMATIC_CLUSTERS[1];
        const clusterGroups = filteredGroups.filter(g => GROUP_CLUSTER_MAPPING[g.name] === currentCluster.id);
        const selectedGroup = clusterGroups.find(g => g.name === activeStarGroup) || clusterGroups[0] || null;

        // Radius and geometric coordinates for 7 star clusters
        const cx = 350;
        const cy = 260;
        const rCluster = 190;
        const nClusters = THEMATIC_CLUSTERS.length;

        return (
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs space-y-6 animate-in fade-in duration-200">
            {/* Kopfbereich Stern-Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-shiraz/10 text-shiraz rounded-xl border border-shiraz/20">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Sternförmiger Campus-Wissensgraph
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Klicken Sie auf einen radialen Sektions-Knoten oder den zentralen Hub, um die Fachgebiete und Module zu explorieren:
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg self-start sm:self-auto">
                7 Sektionen • 28 Fachgruppen • 165+ Module
              </span>
            </div>

            {/* Sternförmige SVG-Canvas / Radial-Hub */}
            <div className="relative w-full overflow-x-auto py-4 flex justify-center bg-radial from-rose-50/30 via-slate-50/40 to-white rounded-2xl border border-slate-200/70">
              <div className="relative w-[700px] h-[520px] shrink-0 select-none">
                
                {/* SVG-Verbindungslinien von Zentrum zu Sektionen */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 700 520">
                  <defs>
                    <linearGradient id="gradHubToNode" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#800020" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#800020" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* Äußere Umlaufbahn (Orbit Ring) */}
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={rCluster} 
                    fill="none" 
                    stroke="#e2e8f0" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 4" 
                  />
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={rCluster * 0.55} 
                    fill="none" 
                    stroke="#f1f5f9" 
                    strokeWidth="1" 
                    strokeDasharray="3 3" 
                  />

                  {/* Stern-Strahlen vom Zentrum zu den 7 Sektionen */}
                  {THEMATIC_CLUSTERS.map((cluster, idx) => {
                    // Start angle rotated by -90 deg so first node is at top
                    const angle = (idx * (2 * Math.PI / nClusters)) - (Math.PI / 2);
                    const xNode = cx + rCluster * Math.cos(angle);
                    const yNode = cy + rCluster * Math.sin(angle);
                    const isSelected = cluster.id === currentCluster.id;

                    return (
                      <g key={cluster.id}>
                        <line
                          x1={cx}
                          y1={cy}
                          x2={xNode}
                          y2={yNode}
                          stroke={isSelected ? '#800020' : '#cbd5e1'}
                          strokeWidth={isSelected ? 2.5 : 1.5}
                          strokeDasharray={isSelected ? 'none' : '3 3'}
                          opacity={isSelected ? 0.9 : 0.6}
                        />
                        {/* Kleiner Puls-Knoten auf der Linie */}
                        <circle
                          cx={cx + (rCluster * 0.52) * Math.cos(angle)}
                          cy={cy + (rCluster * 0.52) * Math.sin(angle)}
                          r={isSelected ? 3.5 : 2}
                          fill={isSelected ? '#800020' : '#94a3b8'}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* ZENTRALER HUB: TH Augsburg Baustoff-Wissen */}
                <div 
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center text-center cursor-pointer group"
                  style={{ left: `${cx}px`, top: `${cy}px` }}
                  onClick={() => {
                    // Cycle or reset cluster
                    setActiveStarGroup(null);
                  }}
                  title="Campus-Zentrum: Technische Hochschule Augsburg"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-shiraz to-[#5c0017] text-white p-1 shadow-lg ring-4 ring-shiraz/20 flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                    <GraduationCap size={22} className="mb-0.5" />
                    <span className="text-[9px] font-black uppercase tracking-wider leading-none text-rose-200">THA Campus</span>
                    <span className="text-[11px] font-bold leading-tight mt-0.5">Baustoff-<br/>kunde</span>
                  </div>
                </div>

                {/* 7 RADIALE STERN-KNOTEN (SEKTIONEN) */}
                {THEMATIC_CLUSTERS.map((cluster, idx) => {
                  const angle = (idx * (2 * Math.PI / nClusters)) - (Math.PI / 2);
                  const xNode = cx + rCluster * Math.cos(angle);
                  const yNode = cy + rCluster * Math.sin(angle);
                  const isSelected = cluster.id === currentCluster.id;
                  const ClusterIcon = cluster.icon;
                  const clusterGroupsCount = mindmapGroups.filter(g => GROUP_CLUSTER_MAPPING[g.name] === cluster.id).length;

                  return (
                    <div
                      key={cluster.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-200"
                      style={{ left: `${xNode}px`, top: `${yNode}px` }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActiveStarCluster(cluster.id);
                          setActiveStarGroup(null);
                        }}
                        className={`px-3 py-2 rounded-2xl border text-center transition-all duration-200 shadow-xs flex flex-col items-center gap-1 cursor-pointer w-[125px] ${
                          isSelected
                            ? 'bg-shiraz text-white border-shiraz shadow-md scale-105 ring-4 ring-shiraz/20'
                            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300 hover:scale-102'
                        }`}
                        title={cluster.description}
                      >
                        <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-shiraz border border-slate-200/60'}`}>
                          <ClusterIcon size={16} />
                        </div>
                        <span className="text-[11px] font-bold leading-tight line-clamp-1 block">
                          {cluster.name}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-semibold ${
                          isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {clusterGroupsCount} Fachgebiete
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AKTIVER SEKTIONS-FOKUS & MODUL-DETAILANSICHT */}
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/70 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-shiraz text-white shadow-2xs">
                    {React.createElement(currentCluster.icon, { size: 18 })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-shiraz font-mono">Aktive Sektion</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-semibold">
                        {clusterGroups.length} Gruppen
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {currentCluster.name} – {currentCluster.description}
                    </h4>
                  </div>
                </div>

                {/* Sektions-Gruppenauswahl als Tabs */}
                <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
                  {clusterGroups.map(grp => {
                    const isGrpActive = (selectedGroup?.name === grp.name);
                    return (
                      <button
                        key={grp.name}
                        onClick={() => setActiveStarGroup(grp.name)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                          isGrpActive
                            ? 'bg-shiraz text-white border-shiraz shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[11px]">{grp.icon}</span>
                        {grp.name}
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${isGrpActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {grp.nodes.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Module der aktiven Gruppe oder aller Gruppen dieser Sektion */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(selectedGroup ? [selectedGroup] : clusterGroups).map(group => (
                  <div 
                    key={group.name} 
                    className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                          <span className="p-1 rounded bg-slate-100 text-slate-600 text-[10px]">{group.icon}</span>
                          {group.name}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 font-bold">
                          {group.nodes.length} Module
                        </span>
                      </div>

                      {/* Klickbare Modul-Karten */}
                      <div className="grid grid-cols-1 gap-1.5">
                        {group.nodes.map(node => {
                          const isLink = !node.id && !!node.link;
                          const isCalc = node.type === 'calculator';
                          const isDb = node.type === 'database';
                          const isQuiz = node.type === 'quiz';

                          return (
                            <button
                              key={node.id || node.label}
                              onClick={() => handleNodeClick(node)}
                              title={node.description || node.label}
                              className={`p-2 rounded-lg text-left transition-all border flex items-start justify-between gap-2 group cursor-pointer ${
                                isCalc
                                  ? 'bg-amber-50/50 border-amber-200/70 hover:bg-amber-100 hover:border-amber-400'
                                  : isDb
                                  ? 'bg-blue-50/50 border-blue-200/70 hover:bg-blue-100 hover:border-blue-400'
                                  : isQuiz
                                  ? 'bg-emerald-50/50 border-emerald-200/70 hover:bg-emerald-100 hover:border-emerald-400'
                                  : 'bg-slate-50/70 border-slate-200/70 hover:bg-shiraz hover:text-white hover:border-shiraz'
                              }`}
                            >
                              <div className="flex items-start gap-1.5 overflow-hidden">
                                <div className="mt-0.5 shrink-0">
                                  {isCalc && <Calculator size={12} className="text-amber-700" />}
                                  {isDb && <Database size={12} className="text-blue-700" />}
                                  {isQuiz && <HelpCircle size={12} className="text-emerald-700" />}
                                  {isLink && <Globe size={12} className="text-slate-500" />}
                                  {!isCalc && !isDb && !isQuiz && !isLink && (
                                    <BookOpen size={12} className="opacity-70 group-hover:text-white" />
                                  )}
                                </div>
                                <div className="truncate">
                                  <span className="text-xs font-bold block truncate group-hover:text-inherit">
                                    {node.label}
                                  </span>
                                  {node.description && (
                                    <span className="text-[10px] opacity-75 line-clamp-1 block group-hover:text-inherit">
                                      {node.description}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ArrowRight size={11} className="opacity-40 group-hover:opacity-100 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ANSICHT 1: GRAFISCHE CAMPUS-MAP */}
      {viewMode === 'map' && (
        <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs space-y-6 animate-in fade-in duration-200">
          
          {/* Zentraler Campus-Hub */}
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-shiraz text-white rounded-2xl shadow-xs border border-shiraz">
              <GraduationCap size={20} />
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-wider block opacity-85 leading-none">TH Augsburg</span>
                <span className="text-xs font-bold block leading-tight">Baustoffkunde &amp; Bauchemie Campus</span>
              </div>
            </div>
            {/* Visual connector line */}
            <div className="w-0.5 h-6 bg-slate-200"></div>
          </div>

          {/* Grafisches Sektions-Cluster Grid */}
          <div className="space-y-6">
            {THEMATIC_CLUSTERS
              .filter(c => !activeClusterFilter || c.id === activeClusterFilter)
              .map(cluster => {
                const clusterGroups = filteredGroups.filter(g => GROUP_CLUSTER_MAPPING[g.name] === cluster.id);
                if (clusterGroups.length === 0) return null;
                const ClusterIcon = cluster.icon;

                return (
                  <div key={cluster.id} className="relative rounded-2xl border border-slate-200/80 bg-slate-50/30 p-4">
                    {/* Sektion Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-shiraz shadow-2xs">
                          <ClusterIcon size={16} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 leading-tight flex items-center gap-2">
                            {cluster.name}
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-500 font-semibold">
                              {clusterGroups.length} Gruppen
                            </span>
                          </h3>
                          <span className="text-[11px] text-slate-500 block">
                            {cluster.description}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Grafische Fachgruppen & Modul-Chips */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {clusterGroups.map(group => (
                        <div 
                          key={group.name} 
                          className="bg-white p-3 rounded-xl border border-slate-200/70 hover:border-slate-350 shadow-2xs transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                                <span className="p-1 rounded bg-slate-100 text-slate-600 text-[10px]">{group.icon}</span>
                                {group.name}
                              </span>
                              <span className="text-[9px] font-mono text-slate-400 font-bold">
                                {group.nodes.length}
                              </span>
                            </div>

                            {/* Schlanke klickbare Modul-Chips */}
                            <div className="flex flex-wrap gap-1.5">
                              {group.nodes.map(node => {
                                const isLink = !node.id && !!node.link;
                                const isCalc = node.type === 'calculator';
                                const isDb = node.type === 'database';
                                const isQuiz = node.type === 'quiz';

                                return (
                                  <button
                                    key={node.id || node.label}
                                    onClick={() => handleNodeClick(node)}
                                    title={node.description || node.label}
                                    className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                                      isCalc
                                        ? 'bg-amber-50/60 border-amber-200/80 text-amber-900 hover:bg-amber-100/70 hover:border-amber-400'
                                        : isDb
                                        ? 'bg-blue-50/60 border-blue-200/80 text-blue-900 hover:bg-blue-100/70 hover:border-blue-400'
                                        : isQuiz
                                        ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900 hover:bg-emerald-100/70 hover:border-emerald-400'
                                        : 'bg-slate-50 border-slate-200/70 text-slate-700 hover:bg-shiraz hover:text-white hover:border-shiraz'
                                    }`}
                                  >
                                    {isCalc && <Calculator size={11} className="text-amber-700 shrink-0" />}
                                    {isDb && <Database size={11} className="text-blue-700 shrink-0" />}
                                    {isQuiz && <HelpCircle size={11} className="text-emerald-700 shrink-0" />}
                                    {isLink && <Globe size={11} className="text-slate-500 shrink-0" />}
                                    {!isCalc && !isDb && !isQuiz && !isLink && <BookOpen size={11} className="shrink-0 opacity-70" />}
                                    <span className="truncate max-w-[170px]">{node.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>

        </div>
      )}

      {/* ANSICHT 2: KOMPAKTE MATRIX */}
      {viewMode === 'matrix' && (
        <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map(group => {
              const clusterId = GROUP_CLUSTER_MAPPING[group.name];
              const cluster = THEMATIC_CLUSTERS.find(c => c.id === clusterId);

              return (
                <div key={group.name} className="p-3.5 bg-slate-50/40 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/70">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-white border border-slate-200 text-shiraz">
                          {group.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 leading-tight">{group.name}</h4>
                          <span className="text-[9px] text-slate-500">{cluster?.name || 'Allgemein'}</span>
                        </div>
                      </div>
                      <span className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono font-bold text-slate-600">
                        {group.nodes.length}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {group.nodes.map(node => (
                        <div
                          key={node.id || node.label}
                          onClick={() => handleNodeClick(node)}
                          className="px-2 py-1 bg-white hover:bg-slate-100/80 border border-slate-150 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer group"
                        >
                          <span className="text-[11px] text-slate-800 font-medium truncate group-hover:text-shiraz">
                            {node.label}
                          </span>
                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            {node.type === 'calculator' && <span className="text-[9px] font-mono text-amber-700 bg-amber-50 px-1 rounded">Rechner</span>}
                            {node.type === 'database' && <span className="text-[9px] font-mono text-blue-700 bg-blue-50 px-1 rounded">Daten</span>}
                            {node.type === 'quiz' && <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1 rounded">Quiz</span>}
                            <ArrowRight size={10} className="text-slate-300 group-hover:text-shiraz" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ANSICHT 3: STRUKTURBAUM */}
      {viewMode === 'tree' && (
        <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex justify-end gap-2 pb-2 border-b border-slate-100">
            <button
              onClick={expandAllTree}
              className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold cursor-pointer"
            >
              Alles ausklappen
            </button>
            <button
              onClick={collapseAllTree}
              className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold cursor-pointer"
            >
              Alles einklappen
            </button>
          </div>

          <div className="space-y-3">
            {THEMATIC_CLUSTERS
              .filter(c => !activeClusterFilter || c.id === activeClusterFilter)
              .map(cluster => {
                const clusterGroups = filteredGroups.filter(g => GROUP_CLUSTER_MAPPING[g.name] === cluster.id);
                if (clusterGroups.length === 0) return null;
                const isSExpanded = isSektionExpanded(cluster.id);
                const ClusterIcon = cluster.icon;

                return (
                  <div key={cluster.id} className="border border-slate-200/80 rounded-xl overflow-hidden bg-white">
                    <div
                      onClick={() => toggleSektion(cluster.id)}
                      className="p-3 bg-slate-50/70 hover:bg-slate-100/60 flex items-center justify-between cursor-pointer border-b border-slate-200/60"
                    >
                      <div className="flex items-center gap-2.5">
                        <ClusterIcon size={16} className="text-shiraz" />
                        <span className="font-bold text-xs text-slate-900">{cluster.name}</span>
                        <span className="text-[10px] text-slate-500">({clusterGroups.length} Gruppen)</span>
                      </div>
                      <div className="text-slate-400">
                        {isSExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </div>
                    </div>

                    {isSExpanded && (
                      <div className="p-3 space-y-2 bg-slate-50/20">
                        {clusterGroups.map(group => {
                          const isGExpanded = isGroupExpanded(group.name);
                          return (
                            <div key={group.name} className="border border-slate-200/60 rounded-lg bg-white overflow-hidden">
                              <div
                                onClick={() => toggleTreeGroup(group.name)}
                                className="p-2.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer text-xs font-bold text-slate-800"
                              >
                                <span className="flex items-center gap-2">
                                  {group.icon}
                                  {group.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono text-slate-400 font-semibold">{group.nodes.length} Module</span>
                                  {isGExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                </div>
                              </div>

                              {isGExpanded && (
                                <div className="p-2.5 pt-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 border-t border-slate-100 mt-1">
                                  {group.nodes.map(node => (
                                    <button
                                      key={node.id || node.label}
                                      onClick={() => handleNodeClick(node)}
                                      className="p-2 bg-slate-50/60 hover:bg-shiraz hover:text-white border border-slate-200/60 rounded-md text-left text-[11px] font-medium transition-colors flex items-center justify-between cursor-pointer group"
                                    >
                                      <span className="truncate">{node.label}</span>
                                      <ArrowRight size={10} className="text-slate-300 group-hover:text-white shrink-0 ml-1" />
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 4. Schlanker Hinweis auf Didaktischen Leitfaden im Modul Anleitung */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-shiraz/10 text-shiraz rounded-lg shrink-0">
            <GraduationCap size={20} />
          </div>
          <div>
            <span className="font-bold text-slate-800 block text-xs">
              Didaktischer Leitfaden &amp; Die 6 Prüfdimensionen der Qualitätssicherung
            </span>
            <span className="text-slate-500 text-[11px] block mt-0.5">
              Das vollständige 6-dimensionale Prüfraster, curriculare Lehrpfade und didaktische Leitlinien finden Sie im Modul <strong>Anleitung</strong>.
            </span>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('anleitung')}
          className="px-3 py-1.5 bg-white hover:bg-shiraz hover:text-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
        >
          Zur Anleitung <ArrowRight size={13} />
        </button>
      </div>

      <ModuleFooter
        wikipedia={[
          { title: 'Curriculum (Pädagogik)', url: 'https://de.wikipedia.org/wiki/Curriculum_(P%C3%A4dagogik)' },
          { title: 'Bauingenieurwesen', url: 'https://de.wikipedia.org/wiki/Bauingenieurwesen' },
          { title: 'Blended Learning', url: 'https://de.wikipedia.org/wiki/Blended_Learning' }
        ]}
        literatur={[
          'Modulhandbuch Bachelor Bauingenieurwesen (Fakultät für Architektur und Bauwesen, TH Augsburg)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Albert, A. (Hrsg.): Schneider – Bautabellen für Ingenieure. 26. Aufl., Köln: Reguvis 2024'
        ]}
        regelwerke={[
          { title: 'Allgemeine Prüfungsordnung (APO THA)', url: 'https://www.tha.de/' },
          { title: 'ASIIN-Fachkriterien für die Akkreditierung von Bauingenieurstudiengängen (Fachausschuss 02)', url: 'https://www.asiin.de/' },
          { title: 'Bayerisches Hochschulinnovationsgesetz (BayHIG)', url: 'https://www.gesetze-bayern.de/' }
        ]}
        formeln={[
          {
            formel: '\\sum \\text{ECTS}_{\\text{Bachelor}} = 210\\,\\text{CP} \\quad \\Longleftrightarrow \\quad \\text{Workload} = 210 \\cdot 30\\,\\text{h} = 6300\\,\\text{h}',
            erklaerung: 'ECTS-Workload-Bilanzierung nach European Credit Transfer and Accumulation System (ECTS): 1 Credit Point entspricht 25 bis 30 Arbeitsstunden für Präsenzstudium, Selbststudium und Prüfungsvorbereitung.',
            quelle: 'Bayerisches Hochschulinnovationsgesetz / ECTS User’s Guide'
          },
          {
            formel: '\\text{Semester-Workload} = 30\\,\\text{ECTS} \\cdot 30\\,\\frac{\\text{h}}{\\text{ECTS}} = 900\\,\\text{h} \\approx 40\\,\\frac{\\text{h}}{\\text{Woche}}',
            erklaerung: 'Konzeptioneller Vollzeit-Arbeitsaufwand je Studiensemester bei 30 ECTS und einer rechnerischen Vorlesungs- und Prüfungszeit von ca. 22-23 Wochen.',
            quelle: 'ASIIN-Akkreditierungsrichtlinie'
          }
        ]}
      />
    </div>
  );
}
