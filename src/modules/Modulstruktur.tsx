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
  Globe, 
  Compass, 
  LayoutGrid, 
  X, 
  Sparkles, 
  Trees, 
  Building2, 
  Leaf, 
  AlertTriangle, 
  Wrench, 
  BookOpen, 
  Sliders, 
  ListTree, 
  Columns, 
  Filter, 
  ShieldAlert, 
  FlaskConical, 
  Scale, 
  Factory, 
  Waves, 
  Droplets, 
  Eye, 
  ClipboardCheck, 
  Grid, 
  GitCommit, 
  Activity, 
  TrendingUp, 
  Thermometer, 
  Volume2, 
  Flame, 
  FileCheck, 
  RefreshCw, 
  Recycle, 
  Trash2, 
  TrendingDown, 
  ClipboardList, 
  Monitor, 
  QrCode, 
  Cpu, 
  Terminal, 
  Server, 
  Video, 
  Award, 
  Package, 
  Hammer, 
  AppWindow, 
  Home, 
  Milestone, 
  Train, 
  HardHat, 
  Paintbrush, 
  Beaker, 
  Microscope, 
  FileSearch, 
  Landmark, 
  History,
  Mountain,
  Box,
  Snowflake,
  ShieldCheck,
  FileWarning
} from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { formatDeWert } from '@/src/utils/numberFormat';

export type NodeType = 'calculator' | 'database' | 'quiz' | 'standard' | 'info' | 'norm';

export interface TreeNode {
  id: string;
  label: string;
  type: NodeType;
  description: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  norm?: string;
  keywords?: string[];
}

export interface TreeGroup {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  nodes: TreeNode[];
}

export interface TreeCluster {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  groups: TreeGroup[];
}

// Complete, unshortened tree structure of all modules in BaustoffBoard
export const BAUSTOFFBOARD_TREE: TreeCluster[] = [
  {
    id: 'allgemein',
    number: '0',
    name: 'Allgemein & System',
    subtitle: 'Campus-Portal, Navigation, Handbuch & Dokumentation',
    accentBg: 'bg-slate-100 dark:bg-slate-800',
    accentBorder: 'border-slate-300 dark:border-slate-600',
    accentText: 'text-slate-800 dark:text-slate-200',
    icon: GraduationCap,
    groups: [
      {
        id: 'allgemein_main',
        name: 'Allgemein',
        icon: GraduationCap,
        nodes: [
          { id: 'start', label: 'Startseite', type: 'standard', description: 'Begrüßungs- und Einstiegsportal mit Modulschnellzugriff.', icon: GraduationCap },
          { id: 'admin', label: 'Admin (THA)', type: 'info', description: 'Auditprompt, Design-Guidelines, Code-Metriken & Tech-Stack.', icon: ShieldAlert },
          { id: 'anleitung', label: 'Anleitung & Handbuch', type: 'info', description: 'Didaktischer Leitfaden, 6 Prüfdimensionen & Bedienung.', icon: BookOpen },
          { id: 'modulstruktur', label: 'Modulübersicht (Baumstruktur)', type: 'info', description: 'Gleichzeitige Anzeige aller Module im hierarchischen Campus-Baum.', icon: Network },
          { id: 'feedback', label: 'Feedback & Evaluation', type: 'standard', description: 'Qualitätssicherung und Fehlerberichte der Lehrplattform.', icon: Award },
          { id: 'versionen', label: 'Changelog / Historie', type: 'info', description: 'Release-Notes, Versionsverlauf und Feature-Erweiterungen.', icon: History },
          { id: 'impressum', label: 'Impressum & Haftungsausschluss', type: 'info', description: 'Rechtliche Angaben, Urheberrechte und Ausschluss jeglicher Haftung.', icon: Building2 },
          { id: 'datenschutz', label: 'Datenschutzerklärung', type: 'info', description: 'DSGVO-Datensparsamkeit, Server-Logs und Betroffenenrechte.', icon: FileCheck }
        ]
      }
    ]
  },
  {
    id: 'cluster_1',
    number: 'I',
    name: 'Grundlagen & Labor',
    subtitle: 'Stoffphysik, Bauchemie, Werkstoffmechanik, Bauphysik & Prüftechnik',
    accentBg: 'bg-rose-50 dark:bg-rose-950/30',
    accentBorder: 'border-shiraz/30 dark:border-rose-900/50',
    accentText: 'text-shiraz dark:text-rose-400',
    icon: Calculator,
    groups: [
      {
        id: 'grp_grundlagen',
        name: 'Grundlagen',
        icon: Layers,
        nodes: [
          { id: 'grundlagen_info', label: 'Modulinfos Grundlagen', type: 'info', description: 'Einführung in atomaren Aufbau, Bindungsarten und Phasendiagramme.', icon: BookOpen },
          { id: 'baustoffkunde', label: 'Baustoffkunde & Historie', type: 'standard', description: 'Historische Entwicklung vom römischen Opus Caementitium bis heute.', icon: GraduationCap },
          { id: 'einheiten', label: 'Einheitenumrechner', type: 'calculator', description: 'Interaktiver Umrechner für Kraft, Spannung, Dichte, Druck und Energie.', icon: Scale },
          { id: 'materialkennwerte', label: 'Kennwerte-Datenbank', type: 'database', description: 'Dichten, Festigkeiten, E-Moduln und Wärmeleitfähigkeiten tabelliert.', icon: Database },
          { id: 'baustoffkenngroessen', label: 'Baustoffkenngrößen', type: 'calculator', description: 'Rechner für Porosität, Reindichte, Rohdichte und Wasseraufnahme.', icon: Scale },
          { id: 'bauchemie', label: 'Bauchemie & Mineralogie', type: 'standard', description: 'Silicatstrukturen, Säureangriffe, Hydratationsreaktionen und pH-Werte.', icon: FlaskConical },
          { id: 'sicherheitskonzept', label: 'Eurocode-Sicherheitskonzept', type: 'norm', description: 'Teilsicherheitsbeiwerte, Lastkombinationen und Grenzzustände (DIN EN 1990).', icon: ShieldAlert, norm: 'DIN EN 1990' },
          { id: 'regularien', label: 'Regulatives & Normung', type: 'norm', description: 'DIN-, EN- und ISO-Architektur, Bauregellisten und DIBt-Zulassungen.', icon: Scale }
        ]
      },
      {
        id: 'grp_labor',
        name: 'Labor & Auswertung',
        icon: Microscope,
        nodes: [
          { id: 'labor_info', label: 'Modulinfos Labor', type: 'info', description: 'Methodik experimenteller Werkstoffprüfung und ZfP-Verfahren.', icon: BookOpen },
          { id: 'probenahme', label: 'Probenahme & Erkundung', type: 'standard', description: 'Bohrkernentnahme, Bauteilbeprobung und Haufwerksbeprobung (LAGA PN 98).', icon: FileSearch, norm: 'DIN EN 12504-1' },
          { id: 'messen_pruefen', label: 'Messen & Prüfen', type: 'standard', description: 'Messtechnik, Sensorik, DMS-Messstreifen, Kalibrierung und GUM-Unsicherheit.', icon: Scale },
          { id: 'analytik', label: 'Analytik & Diagnostik', type: 'database', description: 'Röntgenfluoreszenz (RFA), Diffraktometrie (XRD), TGA und Mikroskopie.', icon: Microscope },
          { id: 'mechanische_pruefungen', label: 'Mechanische Prüfungen', type: 'standard', description: 'Zug-, Druck-, Spaltzug- und Biegezugprüfungen an Werkstoffproben.', icon: ClipboardCheck },
          { id: 'labor', label: 'Virtuelle Laborversuche', type: 'calculator', description: 'Interaktiver Prüfstand für Festigkeiten, Verformungen und Schmidt-Hammer.', icon: Beaker },
          { id: 'statistik', label: 'Statistik & Versuchsplanung', type: 'calculator', description: 'Normalverteilung, Standardabweichung, t-Test und Konfidenzintervalle.', icon: Activity },
          { id: 'festbeton_statistik', label: 'Festbeton (Statistik)', type: 'calculator', description: 'Konformitätskontrolle nach DIN EN 206 Kriterien 1 und 2.', icon: Activity, norm: 'DIN EN 206' }
        ]
      },
      {
        id: 'grp_mechanik',
        name: 'Mechanik',
        icon: Activity,
        nodes: [
          { id: 'mechanik_info', label: 'Modulinfos Mechanik', type: 'info', description: 'Angewandte Werkstoffmechanik, Elastizität und Festigkeitslehre.', icon: BookOpen },
          { id: 'mechanische_kenngroessen', label: 'Mechan. Kenngrößen & E-Modul', type: 'calculator', description: 'Spannung, Dehnung, Hooke, Dehnsteifigkeit EA, Biegesteifigkeit EI, Kriechen.', icon: Scale },
          { id: 'formaenderungen', label: 'Formänderungen & Biegelinie', type: 'calculator', description: 'Biegelinien-Integration und Durchbiegungsrechner für Einfeldträger.', icon: Activity },
          { id: 'materialmodelle', label: 'Materialmodelle & Rheologie', type: 'standard', description: 'Elastoplastisch, viskoelastisch, Maxwell- und Kelvin-Voigt-Körper.', icon: Activity },
          { id: 'emodul', label: 'E-Modul & Mikromechanik', type: 'calculator', description: 'Steifigkeitsabschätzung zweiphasiger zementgebundener Verbundstoffe.', icon: Activity },
          { id: 'festigkeit', label: 'Festigkeitsberechnungen', type: 'calculator', description: 'Normal- und Schubspannungen, Hauptspannungen und Mohrscher Kreis.', icon: TrendingUp },
          { id: 'baustatik', label: 'Baustatik & Schnittgrößen', type: 'calculator', description: 'Auflagerkräfte, Querkraftverlauf V(x) und Biegemomente M(x).', icon: Activity },
          { id: 'knicken', label: 'Knicken (Euler-Fälle)', type: 'calculator', description: 'Kritische Knicklast und Schlankheitsgrad für Euler-Fälle 1 bis 4.', icon: TrendingUp },
          { id: 'bruchmechanik', label: 'Bruchmechanik & Rissfortschritt', type: 'standard', description: 'Spannungsintensitätsfaktor K_I, Bruchzähigkeit K_Ic und Griffith-Kriterium.', icon: ShieldAlert },
          { id: 'bodenmechanik', label: 'Bodenmechanik', type: 'calculator', description: 'Coulomb-Scherfestigkeit, Terzaghi-Konsolidierung und Setzungsberechnung.', icon: Mountain }
        ]
      },
      {
        id: 'grp_bauphysik',
        name: 'Bauphysik',
        icon: Thermometer,
        nodes: [
          { id: 'bauphysik_info', label: 'Modulinfos Bauphysik', type: 'info', description: 'Ganzheitliche Bauphysik: Wärme, Feuchte, Schall und Brandschutz.', icon: BookOpen },
          { id: 'bauphysik', label: 'Bauphysik-Rechner (U-Wert & Glaser)', type: 'calculator', description: 'Mehrschichtiger U-Wert, f_Rsi Schimmelkriterium und Tauwassernachweis.', icon: Thermometer, norm: 'DIN EN ISO 6946' },
          { id: 'waermeeigenschaften', label: 'Thermische Eigenschaften', type: 'database', description: 'Wärmeleitfähigkeit Lambda, Wärmespeicherfähigkeit und Dämmstoffvergleiche.', icon: Flame },
          { id: 'feuchteschutz', label: 'Feuchteschutz & Glaser-Verfahren', type: 'calculator', description: 'Grafisches Glaser-Diagramm nach DIN 4108-3 mit Tauwassermengen.', icon: Droplets, norm: 'DIN 4108-3' },
          { id: 'daemmung_vergleich', label: 'Innendämmung vs. Außendämmung', type: 'standard', description: 'Bauphysikalische Analyse, Wärmebrücken und Schimmelrisiken im Altbau.', icon: Thermometer },
          { id: 'schallschutz', label: 'Schallschutz (DIN 4109)', type: 'calculator', description: 'Luft- und Trittschalldämmung, flächenbezogene Masse und Schalldämmmaß R_w.', icon: Volume2, norm: 'DIN 4109' },
          { id: 'brandschutz', label: 'Brandschutz & Baustoffklassen', type: 'norm', description: 'Euroklassen A1 bis F nach DIN EN 13501-1 und Feuerwiderstandsdauer REI.', icon: Flame, norm: 'DIN EN 13501-1' },
          { id: 'energieausweis', label: 'Energieausweis (GModG / GEG)', type: 'calculator', description: 'Bedarfs- und Verbrauchsausweise nach dem Gebäudemodernisierungsgesetz.', icon: FileCheck, norm: 'GModG / DIN V 18599' }
        ]
      }
    ]
  },
  {
    id: 'cluster_2',
    number: 'II',
    name: 'Materialien & Produkte',
    subtitle: 'Werkstoffkunde, Schichtenverbunde, Faserverbund, Schutzschichten & Bauproduktenrecht',
    accentBg: 'bg-amber-50 dark:bg-amber-950/30',
    accentBorder: 'border-amber-300 dark:border-amber-800',
    accentText: 'text-amber-900 dark:text-amber-400',
    icon: Layers,
    groups: [
      {
        id: 'grp_baustoffe',
        name: 'Baustoffe',
        icon: Box,
        nodes: [
          { id: 'baustoffe_info', label: 'Modulinfos Baustoffkunde', type: 'info', description: 'Enzyklopädische Materialübersicht von mineralisch bis organisch.', icon: BookOpen },
          { id: 'gesteine', label: 'Gesteine & Natursteine', type: 'standard', description: 'Magmatite, Sedimentite, Metamorphite, Frost- und Druckfestigkeit.', icon: Mountain },
          { id: 'mauerwerk', label: 'Mauerwerk & Steine', type: 'standard', description: 'Mauerziegel, Kalksandstein, Porenbeton und Mörtelsysteme.', icon: LayoutGrid, norm: 'DIN EN 1996' },
          { id: 'putzemoertel', label: 'Putze & Mörtel', type: 'standard', description: 'Innenputze, Außenputze, Mauermörtel und Estrichzusammensetzungen.', icon: Layers, norm: 'DIN EN 998' },
          { id: 'gips', label: 'Gips & Calciumsulfat', type: 'standard', description: 'Baugipse, Hydratationsstufen, Halbhydrat und Anhydritestriche.', icon: Box, norm: 'DIN EN 13279' },
          { id: 'kalk', label: 'Kalk (Baukalk)', type: 'standard', description: 'Technischer Kalkkreislauf, Brennen, Löschen, Carbonatisierung.', icon: Box, norm: 'DIN EN 459-1' },
          { id: 'lehm', label: 'Lehm & Stampflehm', type: 'standard', description: 'Ökologischer Lehmbau, Tonmineralien, Sorption und Lehmputze.', icon: Box, norm: 'DIN 18945' },
          { id: 'erdbau', label: 'Erdbau & Böden', type: 'calculator', description: 'Bodenmechanik, Sieblinien, Atterberg-Grenzen und Proctorversuch.', icon: Mountain, norm: 'DIN 18196' },
          { id: 'glas', label: 'Bauglas & Glaskorrosion', type: 'standard', description: 'Floatglas, ESG, TVG, VSG und optische Spannungsanalysen.', icon: AppWindow, norm: 'DIN 18008' },
          { id: 'stahl', label: 'Baustahl & Fe-C-Diagramm', type: 'standard', description: 'Eisen-Kohlenstoff-Diagramm, Gefüge, Streckgrenze und Schweißbarkeit.', icon: Flame, norm: 'DIN EN 10025' },
          { id: 'metalle', label: 'NE-Metalle & Legierungen', type: 'standard', description: 'Aluminium, Kupfer, Zink, Blei und galvanische Spannungsreihe.', icon: Hammer },
          { id: 'holz', label: 'Konstruktionsholz', type: 'standard', description: 'Anatomie, Holzfeuchte, Fasersättigung, Anisotropie und Holzschutz.', icon: Trees, norm: 'DIN EN 338' },
          { id: 'holzwerkstoffe', label: 'Holzwerkstoffe & Platten', type: 'standard', description: 'BSH, KVH, Brettsperrholz (CLT), OSB und Furniersperrholz.', icon: Trees, norm: 'DIN EN 14080' },
          { id: 'nawaro', label: 'Biogene Baustoffe (NaWaRo)', type: 'standard', description: 'Strohballenbau, Hanf, Flachs, Schafwolle und zelluläre Dämmung.', icon: Leaf },
          { id: 'asphalt', label: 'Asphalt & Bitumen', type: 'standard', description: 'Viskoelastisches Verhalten, Nadelpenetration und RuK-Erweichungspunkt.', icon: Layers, norm: 'DIN EN 1427' },
          { id: 'kunststoffe', label: 'Kunststoffe & Polymere', type: 'standard', description: 'Thermoplaste, Duroplaste, Elastomere, Glasübergangstemperatur.', icon: Package, norm: 'DIN EN ISO 1043' },
          { id: 'daemmstoffe', label: 'Dämmstoffe im Hochbau', type: 'database', description: 'EPS, XPS, Steinwolle, Glaswolle, Schaumglas und Vakuumdämmung.', icon: Snowflake, norm: 'DIN 4108-10' },
          { id: 'ausbau', label: 'Ausbau & Abdichtung', type: 'standard', description: 'Bauwerksabdichtung nach DIN 18533, Bitumenbahnen und Fugenprofile.', icon: Layers, norm: 'DIN 18533' },
          { id: 'kombinationen', label: 'Werkstoff-Kombinationen & Faserverbund', type: 'calculator', description: 'Schichtenaufbauten (Tragen, Dämmen, Schützen), CFK/GFK-Mikromechanik, Stahlbeton & Schutzschichten.', icon: Layers, norm: 'DIN EN 1504-2 / VDI 2014' },
          { id: 'sonstiges', label: 'Sonstige & Innovationen', type: 'standard', description: 'Zukunftsbaustoffe, Geopolymere, Aerogele und Nanobeschichtungen.', icon: Sparkles }
        ]
      },
      {
        id: 'grp_bauprodukte',
        name: 'Bauprodukte',
        icon: FileText,
        nodes: [
          { id: 'bauprodukte_info', label: 'Modulinfos Bauprodukte', type: 'info', description: 'Regulatorische Anforderungen und Bauproduktenrecht in Europa.', icon: BookOpen },
          { id: 'bp_baustoffindustrie', label: 'Baustoffindustrie & Transformation', type: 'info', description: 'Dekarbonisierung, Zementklinker-Minderung und Energiebilanzen.', icon: Factory },
          { id: 'bp_innovationen', label: 'Innovationen & F&E', type: 'standard', description: 'Technology Readiness Level (TRL 1-9), DIBt abZ/aBG und ETA.', icon: Sparkles },
          { id: 'bp_recht_grundlagen', label: 'CE vs. Ü & MVV TB', type: 'norm', description: 'Bauproduktenverordnung (BauPVO), harmonisierte Normen (hEN) und Musterbauordnung.', icon: Scale, norm: 'BauPVO (EU) 2024/3110' },
          { id: 'bp_recht_avcp', label: 'AVCP-Systeme', type: 'norm', description: 'Leistungsbeständigkeit von System 1+ bis 4 nach BauPVO.', icon: ShieldCheck, norm: 'BauPVO Anhang IX' },
          { id: 'bp_recht_konformitaet', label: 'Konformität & Auditierung', type: 'standard', description: 'Werkseigene Produktionskontrolle (WPK) und Fremdüberwachung.', icon: Award, norm: 'DIN EN ISO/IEC 17065' },
          { id: 'bp_recht_normen', label: 'Normenarbeit im Bauwesen', type: 'norm', description: 'DIN, CEN und ISO-Gremien, Normentwürfe und Anwendungsregeln.', icon: BookOpen },
          { id: 'bp_beton', label: 'Beton (Frisch- & Festbeton)', type: 'norm', description: 'Herstellung und Konformität nach DIN EN 206 und DIN 1045-2.', icon: Box, norm: 'DIN EN 206' },
          { id: 'bp_betonfertigteile', label: 'Betonfertigteile', type: 'standard', description: 'Tragwerke, Hohlkammerdecken, Stützen und Binder nach DIN EN 13369.', icon: LayoutGrid, norm: 'DIN EN 13369' },
          { id: 'bp_betonwaren', label: 'Betonwaren & Pflaster', type: 'standard', description: 'Pflastersteine, Bordsteine und Gehwegplatten aus Rüttelbeton.', icon: Package, norm: 'DIN EN 1338' },
          { id: 'bp_mauerwerk', label: 'Mauerwerksprodukte', type: 'standard', description: 'Güteüberwachung von Plansteinen und Dünnbettmörtel.', icon: Layers, norm: 'DIN EN 771' },
          { id: 'bp_dach_fassade', label: 'Dach & Fassade', type: 'standard', description: 'Dachdichtungsbahnen, vorgehängte hinterlüftete Fassaden (VHF).', icon: Home, norm: 'DIN 18516' },
          { id: 'bp_verkehr_rsto', label: 'Dimensionierung (RStO 12/24)', type: 'calculator', description: 'Dimensionierungsrechner des Straßenoberbaus nach Bauklassen Bk.', icon: Calculator, norm: 'RStO 12/24' },
          { id: 'bp_verkehr_asphalt', label: 'Asphaltsorten & Mischgut', type: 'standard', description: 'Asphaltbeton AC, Splittmastixasphalt SMA und Gussasphalt MA.', icon: Layers, norm: 'DIN EN 13108' },
          { id: 'bp_verkehr_bitumen', label: 'Bitumen & Gesteine', type: 'standard', description: 'Straßenbaubitumen, PmB, PSV-Polierwert von Gesteinskörnungen.', icon: Flame, norm: 'DIN EN 12591' },
          { id: 'bp_verkehr_pruefung', label: 'Verkehrswege-Prüfungen', type: 'calculator', description: 'Marshall-Probekörper, Spurbildungsversuch und Hohlraumgehalt.', icon: Microscope },
          { id: 'bp_verkehr_betondecken', label: 'Betondecken (ZTV Beton-StB)', type: 'standard', description: 'Fahrbahndecken aus Beton, Waschbeton, Scheinfugen und Dübel.', icon: LayoutGrid, norm: 'ZTV Beton-StB' },
          { id: 'bp_verkehr_tiefbau', label: 'Tiefbau & Entwässerung', type: 'calculator', description: 'Rohrwerkstoffe PVC/PP, Rigolenversickerung nach DWA-A 138.', icon: Droplets, norm: 'DWA-A 138' },
          { id: 'bp_verkehr_bahn', label: 'Bahnbau & Oberbau', type: 'standard', description: 'Gleisschotter (DIN EN 13450), Betonschwellen und Feste Fahrbahn.', icon: Train, norm: 'DIN EN 13450' },
          { id: 'bp_verkehr_tunnel', label: 'Tunnelbau & Spritzbeton', type: 'standard', description: 'NATM, Spritzbeton nach DIN EN 14487 und TBM-Schildvortrieb.', icon: HardHat, norm: 'DIN EN 14487' },
          { id: 'bp_trockenbau', label: 'Trockenbausysteme', type: 'standard', description: 'Gipskartonplatten, Metallständerwerke, Brandschutzwände.', icon: Box, norm: 'DIN 18181' },
          { id: 'bp_putz_estrich', label: 'Putz & Estrichsysteme', type: 'standard', description: 'Zementestriche, Calciumsulfatestriche und Sanierputzsysteme.', icon: Layers, norm: 'DIN 18560' },
          { id: 'bp_abdichtung', label: 'Abdichtungsprodukte', type: 'standard', description: 'Bitumendickbeschichtungen PMBC und KMB nach DIN 18533.', icon: Droplets, norm: 'DIN 18533' },
          { id: 'bp_daemmung', label: 'Dämmstoffprodukte', type: 'standard', description: 'Perimeterdämmung XPS, EPS-Platten und Mineralwolle-Zulassungen.', icon: Snowflake },
          { id: 'bp_befestigung', label: 'Befestigungstechnik', type: 'standard', description: 'Schwerlastanker, Bolzenanker, Injektionsmörtel und ETA-Zulassung.', icon: Wrench, norm: 'EOTA EAD' },
          { id: 'bp_klebstoffe', label: 'Kleb- & Dichtstoffe', type: 'standard', description: 'Silikone, Polyurethane, MS-Polymere und Fugen nach DIN 18540.', icon: FlaskConical, norm: 'DIN 18540' },
          { id: 'bp_farben_lacke', label: 'Farben & Lacke', type: 'standard', description: 'Dispersionsfarben, Silikatfarben und Korrosionsschutzlacke.', icon: Paintbrush },
          { id: 'bp_betonzusatzmittel', label: 'Betonzusatzmittel', type: 'standard', description: 'Fließmittel (PCE), Luftporenbildner, Verzögerer nach DIN EN 934-2.', icon: Beaker, norm: 'DIN EN 934-2' },
          { id: 'bp_holzprodukte', label: 'Holzbauprodukte', type: 'standard', description: 'Brettsperrholz CLT, Furnierschichtholz LVL und Stegträger.', icon: Trees, norm: 'DIN EN 16351' },
          { id: 'bp_kunststoffe', label: 'Kunststoffprofile & Rohre', type: 'standard', description: 'Fensterprofile, Kanalrohre und Geotextilien.', icon: Package },
          { id: 'bp_mineralisch', label: 'Mineralische Bauprodukte', type: 'standard', description: 'Faserzementtafeln, Porenbetonblöcke und Leichtbetonsteine.', icon: Mountain },
          { id: 'bp_glaeser', label: 'Gläser & Fenster (DIN 18008)', type: 'calculator', description: 'Uw-Rechner, Isoliergläser, ESG, VSG, Low-E-Beschichtungen.', icon: AppWindow, norm: 'DIN 18008 / DIN EN 1279' },
          { id: 'bp_lehmbauprodukte', label: 'Lehmbauprodukte', type: 'standard', description: 'Lehmbauplatten, Lehmoberputze und Lehmmörtel-Zertifizierung.', icon: Leaf, norm: 'DIN 18948' },
          { id: 'bp_metallisch', label: 'Metallische Werkstoffe & Bleche', type: 'standard', description: 'Titanzinkbleche, Aluminium-Kassetten, Edelstahlbefestiger.', icon: Hammer },
          { id: 'bp_stahlbauprofile', label: 'Stahlbauprofile', type: 'database', description: 'Profiltabellen für HEA, HEB, HEM, IPE, UNP und Hohlprofile.', icon: Columns, norm: 'DIN EN 10365' }
        ]
      }
    ]
  },
  {
    id: 'cluster_3',
    number: 'III',
    name: 'Entwurf & Bemessung',
    subtitle: 'Betontechnologie, Stahlbetonbau (EC 2), Ingenieurholzbau (EC 5) & Innenausbau',
    accentBg: 'bg-blue-50 dark:bg-blue-950/30',
    accentBorder: 'border-blue-300 dark:border-blue-800',
    accentText: 'text-blue-900 dark:text-blue-400',
    icon: Droplets,
    groups: [
      {
        id: 'grp_beton',
        name: 'Betontechnologie',
        icon: Layers,
        nodes: [
          { id: 'beton_info', label: 'Modulinfos Betontechnologie', type: 'info', description: 'Zementchemie, Rheologie des Frischbetons und Festbetoneigenschaften.', icon: BookOpen },
          { id: 'beton_a_z', label: 'Beton-Lexikon A-Z', type: 'database', description: 'Fachwörterbuch mit über 300 Begriffen der Betonpraxis.', icon: BookOpen },
          { id: 'grundlagen', label: 'Ausgangsstoffe des Betons', type: 'standard', description: 'Zement, Wasser, Zuschlag, Sieblinienoptimierung nach Fuller.', icon: Layers },
          { id: 'bindemittel', label: 'Bindemittel & Hydratation', type: 'standard', description: 'Klinkerphasen C3S, C2S, C3A, C4AF, Hydratationswärme und CSH-Phasen.', icon: Factory },
          { id: 'mischungsberechnung', label: 'Stoffraum-Mischungsberechnung', type: 'calculator', description: 'Interaktive Erstprüfung, w/z-Wert, Mehlkorngehalt und Sieblinie.', icon: Calculator, norm: 'DIN 1045-2' },
          { id: 'herstellung_einbau', label: 'Herstellung, Transport & Einbau', type: 'standard', description: 'Mischtechnik, Fahrmischer, Pumpen, Rütteln und Verdichtung.', icon: Factory },
          { id: 'frischbeton', label: 'Frischbetonprüfungen', type: 'calculator', description: 'Ausbreitmaß, Setzmaß, Verdichtungsmaß, Luftporenprüfung.', icon: Waves, norm: 'DIN EN 12350' },
          { id: 'hydratation_folgen', label: 'Hydratationswärme & Rissrisiko', type: 'calculator', description: 'Temperaturanstieg im massigen Bauteil, adiabate Erwärmung.', icon: Network },
          { id: 'nachbehandlung', label: 'Nachbehandlung & Curing', type: 'standard', description: 'Verdunstungsschutz, Mindestnachbehandlungsdauer nach DIN 1045-3.', icon: Droplets, norm: 'DIN 1045-3' },
          { id: 'festbeton', label: 'Festbetoneigenschaften', type: 'standard', description: 'Druckfestigkeitsklassen C, Spaltzugfestigkeit und Porosität.', icon: Box, norm: 'DIN EN 206' },
          { id: 'betonkennwerte', label: 'Betonkennwerte nach EC2', type: 'calculator', description: 'Druck-, Zugfestigkeit, E-Modul, Schwinden und Kriechen nach EC2.', icon: Sliders, norm: 'DIN EN 1992-1-1' },
          { id: 'sichtbeton', label: 'Sichtbeton (SB 1 bis SB 4)', type: 'standard', description: 'DBV/VDZ-Merkblatt, Schalungshaut, Trennmittel und Porigkeit.', icon: Eye },
          { id: 'sonderbetone', label: 'Sonderbetone (UHPC, SVB, Leichtbeton)', type: 'standard', description: 'Ultrahochfester Beton, selbstverdichtender Beton und Faserbeton.', icon: Layers },
          { id: 'innovative_werkstoffe', label: 'Zukunftswerkstoffe & 3D-Druck', type: 'standard', description: 'Betondruck im Extrusionsverfahren, Geopolymere und CO2-Senken.', icon: Layers },
          { id: 'qualitaetssicherung', label: 'Qualitätssicherung & WPK', type: 'norm', description: 'Konformitätskriterien, Güteüberwachung und Baustellenprüfung.', icon: ClipboardCheck, norm: 'DIN EN 206' },
          { id: 'expositionsklassen', label: 'Expositionsklassen (DIN EN 206 / DIN 1045-2)', type: 'calculator', description: 'Grenzwerte für XC, XD, XS, XF, XA, XM: max. (w/z)_eq, Min.-Festigkeit.', icon: Grid, norm: 'DIN 1045-2 Tab. F.2.1' },
          { id: 'betonpraxis', label: 'Betonpraxis & Schadensvermeidung', type: 'standard', description: 'Kiesnester, Entmischung, mangelhafte Betondeckung und Sanierung.', icon: ClipboardCheck }
        ]
      },
      {
        id: 'grp_massivbau',
        name: 'Massivbau',
        icon: Calculator,
        nodes: [
          { id: 'stahlbeton_info', label: 'Modulinfos Stahlbetonbau', type: 'info', description: 'Tragwirkung des Verbunds aus Beton und Bewehrungsstahl.', icon: BookOpen },
          { id: 'stahlbeton_bemessung', label: 'Stahlbetonbemessung (EC 2)', type: 'calculator', description: 'Integrierte Nachweise für Biegung, Querkraft, Stützen, Durchstanzen, Verankerung & Rissbreite.', icon: Calculator, norm: 'DIN EN 1992-1-1' },
          { id: 'spannbeton', label: 'Spannbetonbau', type: 'standard', description: 'Vorspannung mit sofortigem und nachträglichem Verbund, Spannverluste.', icon: GitCommit, norm: 'DIN EN 1992-1-1 Kap. 5.10' },
          { id: 'wu-bauwerke', label: 'WU-Bauwerke (Weiße Wannen)', type: 'standard', description: 'DAfStb WU-Richtlinie, Beanspruchungsklassen, Fugenbänder und Risse.', icon: Droplets, norm: 'DAfStb WU-Richtlinie' },
          { id: 'carbonbeton', label: 'Carbonbeton & Textilbeton', type: 'standard', description: 'Korrosionsfreie Carbongelege, schlanke Betonschalen und Zulassungen.', icon: Layers }
        ]
      },
      {
        id: 'grp_holzbau',
        name: 'Holzbau',
        icon: Trees,
        nodes: [
          { id: 'holzbau_info', label: 'Modulinfos Ingenieurholzbau', type: 'info', description: 'Tragwerksplanung nach Eurocode 5 (DIN EN 1995-1-1).', icon: BookOpen },
          { id: 'holzbau_werkstoffe', label: 'Holzwerkstoffe & dataholz', type: 'database', description: 'Festigkeitsklassen C24, GL24h, CLT und dataholz-Kataloge.', icon: Trees, norm: 'DIN EN 338' },
          { id: 'holzbau_konstruktion', label: 'Konstruktionsweisen', type: 'standard', description: 'Holzrahmenbau, Holztafelbau, Massivholzbau und Hybridbau.', icon: LayoutGrid },
          { id: 'holzbau_bemessung', label: 'Bemessung nach EC 5', type: 'calculator', description: 'Biegebemessung, Knicken mit k_mod, Schub und Gebrauchstauglichkeit.', icon: Calculator, norm: 'DIN EN 1995-1-1' },
          { id: 'holzbau_verbindung', label: 'Verbindungen & Anschlüsse', type: 'calculator', description: 'Johansen-Theorie für Stabdübel, Bolzen, Schrauben und Seilwirkung.', icon: GitCommit, norm: 'DIN EN 1995-1-1 Kap. 8' },
          { id: 'holzbau_bauphysik', label: 'Bauphysik & Brandschutz', type: 'calculator', description: 'Restquerschnittsmethode d_ef und Heißbemessung nach Eurocode 5.', icon: Flame, norm: 'DIN EN 1995-1-2' }
        ]
      },
      {
        id: 'grp_innenausbau',
        name: 'Innenausbau',
        icon: LayoutGrid,
        nodes: [
          { id: 'innenausbau', label: 'Innenausbau-Zentrum', type: 'standard', description: 'Gipskartonsysteme, Akustikdecken, Estrichaufbauten und Brandschutzabschottungen.', icon: LayoutGrid }
        ]
      }
    ]
  },
  {
    id: 'cluster_4',
    number: 'IV',
    name: 'Bestand & Nachhaltigkeit',
    subtitle: 'Bauwerksdiagnose (ZfP), Schadensatlas, Dauerhaftigkeit, Instandsetzung, Rückbau & LCA',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    accentBorder: 'border-emerald-300 dark:border-emerald-800',
    accentText: 'text-emerald-900 dark:text-emerald-400',
    icon: Compass,
    groups: [
      {
        id: 'grp_bestand',
        name: 'Bauen im Bestand',
        icon: Building2,
        nodes: [
          { id: 'bestand_info', label: 'Modulinfos Bauen im Bestand', type: 'info', description: 'Erkundung, Sanierung und statische Bewertung bestehender Bausubstanz.', icon: BookOpen },
          { id: 'bestand', label: 'Altbauatlas & Epochen', type: 'database', description: 'Bauweisen von Gründerzeit bis Nachkriegsmoderne mit U-Werten.', icon: Building2 },
          { id: 'bauwerkserfassung', label: 'Bauwerkserfassung (3D-Scan)', type: 'standard', description: 'Terrestrisches Laserscanning (TLS), Photogrammetrie und Punktwolken.', icon: Compass },
          { id: 'denkmalpflege', label: 'Denkmalpflege & Historische Baustoffe', type: 'standard', description: 'Historische Luftkalkmörtel, Bauforschung und Salzschäden.', icon: Landmark },
          { id: 'modernisierung', label: 'Modernisierung & GModG-Rechner', type: 'calculator', description: 'Energetische Sanierungsrechnung nach dem Gebäudemodernisierungsgesetz.', icon: RefreshCw, norm: 'GModG' },
          { id: 'bauwerksuntersuchung', label: 'Bauwerksdiagnose & ZfP-Katalog', type: 'calculator', description: '14 ZfP-Verfahren: Ultraschall, Bewehrungsradar, Rückprallhammer, Endoskopie.', icon: Search, norm: 'DIN EN 13791' },
          { id: 'historisch', label: 'Historische Materialkennwerte', type: 'database', description: 'Puddelstahl, Flussstahl, historische Ziegel- und Betonfestigkeiten.', icon: History },
          { id: 'historische_bauweisen', label: 'Historische Bauweisen', type: 'standard', description: 'Kappendecken, Holzbalkendecken, Fachwerk und Gewölbe.', icon: BookOpen },
          { id: 'historische_bauprodukte', label: 'Historische Bauprodukte', type: 'standard', description: 'Ziegelformate (Reichsformat), Rabitzputze und alte Dichtungen.', icon: Layers },
          { id: 'bestand_checklisten', label: 'Bestands-Checklisten', type: 'info', description: 'Strukturierte Begehungsbögen und ZfP-Erkundungsprotokolle.', icon: ClipboardList }
        ]
      },
      {
        id: 'grp_schaeden',
        name: 'Mängel & Schäden',
        icon: AlertTriangle,
        nodes: [
          { id: 'schaeden_info', label: 'Modulinfos Mängel & Schäden', type: 'info', description: 'Bauschadensforensik, Rechtsgrundlagen und Beweissicherung.', icon: BookOpen },
          { id: 'bauschaeden', label: 'Recht & Grundlagen (VOB/BGB)', type: 'norm', description: 'Mängelbegriff, Hinweispflichten, Gewährleistung und Beweisverfahren.', icon: FileWarning, norm: 'VOB/B & BGB' },
          { id: 'schadensbilder', label: 'Typische Bauschäden (Schadensatlas)', type: 'database', description: 'Nasse Keller, Schimmel, WDVS-Risse, Betonabplatzungen und Fugenversagen.', icon: TrendingDown },
          { id: 'bauwerksunters_monitoring', label: 'Tragwerksmonitoring (SHM)', type: 'standard', description: 'Sensorisches Monitoring, LVDT-Rissaufnehmer, Dehnungsüberwachung.', icon: Activity },
          { id: 'vdi6200', label: 'Zustandsbewertung (VDI 6200)', type: 'calculator', description: 'Standsicherheitsprüfung, Prüfintervalle und Zustandsklassen 1 bis 4.', icon: ClipboardCheck, norm: 'VDI 6200' },
          { id: 'material_schaeden_gross', label: 'Große Materialschäden & Einstürze', type: 'database', description: 'Forensische Analyse historischer Katastrophen: Carolabrücke, Bad Reichenhall, Morandi.', icon: AlertTriangle },
          { id: 'schaeden_checklisten', label: 'Schadensaufnahme-Checklisten', type: 'info', description: 'Risskartierung, Begehungsprotokolle und forensische Messungen.', icon: ClipboardList }
        ]
      },
      {
        id: 'grp_dauerhaftigkeit',
        name: 'Dauerhaftigkeit',
        icon: ShieldAlert,
        nodes: [
          { id: 'dauerhaftigkeit_info', label: 'Modulinfos Dauerhaftigkeit', type: 'info', description: 'Degradationsmodelle, Lebensdauer-Vorhersage und Umwelteinflüsse.', icon: BookOpen },
          { id: 'dauerhaftigkeit', label: 'Prinzipien & Lebensdauermodell', type: 'standard', description: 'Expositionsklassen-Zuweisung, Tuutti-Modell und Schutzmechanismen.', icon: ShieldAlert },
          { id: 'korrosion', label: 'Bewehrungskorrosion', type: 'standard', description: 'Elektrochemie von Anode/Kathode, Carbonatisierung und Chloridangriff.', icon: ShieldAlert },
          { id: 'schadreaktionen_beton', label: 'Betonkorrosion & Treiben', type: 'standard', description: 'Alkali-Kieselsäure-Reaktion (AKR), Ettringittreiben und Säureangriff.', icon: ShieldAlert },
          { id: 'holzkorrosion', label: 'Holzkorrosion & Schädlinge', type: 'standard', description: 'Echter Hausschwamm, Nassfäule, Hausbock und chemischer Holzschutz.', icon: ShieldAlert, norm: 'DIN 68800' },
          { id: 'metallkorrosion', label: 'Metallkorrosion', type: 'standard', description: 'Sauerstoff-, Wasserstoff-, Spalt- und Bimetall-/Kontaktkorrosion.', icon: ShieldAlert },
          { id: 'weitere_organik', label: 'Weitere Organik & Alterung', type: 'standard', description: 'UV-Versprödung von Polymeren und Bitumendegradation.', icon: Leaf },
          { id: 'dauerhaftigkeit_checklisten', label: 'Dauerhaftigkeits-Checklisten', type: 'info', description: 'Prüflisten für Betonüberdeckung, Expositionsklassen und Rissbegrenzung.', icon: ClipboardList }
        ]
      },
      {
        id: 'grp_instandsetzung',
        name: 'Schutz & Instandsetzung',
        icon: Wrench,
        nodes: [
          { id: 'instandsetzung_info', label: 'Modulinfos Instandsetzung', type: 'info', description: 'Regelwerke DIN EN 1504, DAfStb TR Instandhaltung und WTA.', icon: BookOpen },
          { id: 'schutz_grundlagen', label: 'Schutz- & Instandsetzungs-Grundlagen', type: 'norm', description: 'DIN EN 1504-9 Prinzipien 1-11, Tuutti-Kurve und De-Sitter-Regel.', icon: ShieldAlert, norm: 'DIN EN 1504-9' },
          { id: 'instandsetzung_materialien', label: 'Instandsetzung nach Material', type: 'standard', description: 'Werkstoffspezifischer Schutz für Holz, Metalle, Kunststoffe, Asphalt und Mauerwerk.', icon: Layers },
          { id: 'instandhaltung', label: 'Stahlbetoninstandhaltung', type: 'standard', description: 'Oberflächenschutzsysteme OS 1 bis OS 11, Reprofilierung, KKS.', icon: Wrench, norm: 'TR Instandhaltung' },
          { id: 'wta', label: 'WTA-Merkblätter', type: 'norm', description: 'Mauerwerksinstandsetzung, Sanierputze, Horizontalsperren nach WTA.', icon: FileText, norm: 'WTA' },
          { id: 'instandsetzung_checklisten', label: 'Instandsetzungs-Checklisten', type: 'info', description: 'Prüfformulare für Sachkundige Planer (SKP), HDW und Abnahme.', icon: ClipboardList }
        ]
      },
      {
        id: 'grp_rueckbau',
        name: 'Rückbau & Schadstoffe',
        icon: Recycle,
        nodes: [
          { id: 'rueckbau_info', label: 'Modulinfos Rückbau', type: 'info', description: 'Kreislaufwirtschaftsgesetz, selektiver Abbruch und Schadstoffanalyse.', icon: BookOpen },
          { id: 'rueckbau', label: 'Rückbau & Materialstrom', type: 'standard', description: 'Selektiver Rückbau, Abbruchkonzepte und RC-Baustoffgewinnung.', icon: Recycle, norm: 'KrWG' },
          { id: 'boden_materialaufbereitung', label: 'Boden- & Materialaufbereitung', type: 'calculator', description: 'Ersatzbaustoffverordnung (EBV), Bodenwaschanlagen, Brecherstufen.', icon: Recycle, norm: 'EBV 2023' },
          { id: 'abfaelle', label: 'Abfälle & AVV-Katalog', type: 'database', description: 'Abfallverzeichnisverordnung, Zuordnung gefährlicher/nicht gefährlicher Abfälle.', icon: Trash2, norm: 'AVV' },
          { id: 'schadstoffe', label: 'Schad- und Gefahrstoffe', type: 'database', description: 'Asbest, KMF, Teer/PAK, PCB, PFAS, Grenzwerte und TRGS 519/521.', icon: AlertTriangle, norm: 'TRGS 519' },
          { id: 'ressourceneffizienz', label: 'Ressourceneffizienz (REZ)', type: 'calculator', description: 'Ressourceneffizienz-Zentrum Bayern: Baustoff-Simulator und ROI.', icon: Leaf },
          { id: 'rueckbau_checklisten', label: 'Rückbau-Checklisten', type: 'info', description: 'Schadstoffkataster, Abbruchgenehmigung und Entsorgungsnachweis.', icon: ClipboardList }
        ]
      },
      {
        id: 'grp_nachhaltigkeit',
        name: 'Nachhaltigkeit',
        icon: Leaf,
        nodes: [
          { id: 'nachhaltigkeit_info', label: 'Modulinfos Nachhaltigkeit', type: 'info', description: 'Zirkuläres Bauen, Ökobilanzierung, Dekarbonisierung und EU-Taxonomie.', icon: BookOpen },
          { id: 'nachhaltigkeit_daten_regeln', label: 'Daten & Regeln (EPBD & Taxonomie)', type: 'norm', description: 'UN-SDGs, EU-Taxonomie, EPBD 2024/1275, Stoffströme, EPD nach EN 15804+A2.', icon: Scale, norm: 'EPBD 2024/1275' },
          { id: 'materialoptimierung', label: 'Materialoptimierung & Klinker', type: 'calculator', description: 'CO2-reduzierte Zemente, Klinkerersatz, RC-Gesteinskörnung, THG-Tragwerke.', icon: Leaf, norm: 'DAfStb THG-Richtlinie' },
          { id: 'oekobilanz_lca', label: 'Ökobilanzierung (LCA-Simulator)', type: 'calculator', description: 'Interaktiver Lebenszyklus-Simulator: GWP, ODP, POCP über 50 Jahre Nutzungsdauer.', icon: Leaf, norm: 'DIN EN 15804+A2' },
          { id: 'zertifizierung_siegel', label: 'Zertifizierung & Deklarationen', type: 'info', description: 'DGNB, LEED, BREEAM, EPD-Umweltproduktdeklarationen und CSC-Zertifikat.', icon: Award },
          { id: 'kreislauf_dpp', label: 'Kreislaufwirtschaft & DPP', type: 'standard', description: 'Urban Mining, Design for Disassembly, Rezyklierbarkeit und Madaster.', icon: RefreshCw },
          { id: 'ressourcen_umwelt', label: 'Ressourcen & Umweltbelastung', type: 'standard', description: 'Graue Energie, Primärenergiebedarf und Rohstoffabbau-Footprint.', icon: Factory },
          { id: 'lebenszyklus_kosten', label: 'Lebenszykluskosten (LCC)', type: 'calculator', description: 'Kapitalbarwert-Rechner für Investitions-, Betriebs- und Rückbaukosten über 50 Jahre.', icon: TrendingUp },
          { id: 'nachhaltigkeit_checklisten', label: 'Nachhaltigkeits-Checklisten', type: 'info', description: 'DGNB-Planungschecklisten, Zirkularitäts-Audits und EPD-Verifizierungen.', icon: ClipboardList }
        ]
      }
    ]
  },
  {
    id: 'cluster_5',
    number: 'V',
    name: 'Digitales & Praxis',
    subtitle: 'BIM, Künstliche Intelligenz, AVA, Bauleitung, Bautagebuch, Software & Kuriositäten',
    accentBg: 'bg-purple-50 dark:bg-purple-950/30',
    accentBorder: 'border-purple-300 dark:border-purple-800',
    accentText: 'text-purple-900 dark:text-purple-400',
    icon: Monitor,
    groups: [
      {
        id: 'grp_digitales',
        name: 'Digitales',
        icon: Monitor,
        nodes: [
          { id: 'digitales_info', label: 'Modulinfos Digitales', type: 'info', description: 'BIM-Methoden, digitale Bauwerksmodelle und offene Datenformate.', icon: BookOpen },
          { id: 'online_tools', label: 'Online-Tools & Rechner', type: 'calculator', description: 'Kuratierte Webrechner für Statik, Bauphysik, LCA, U-Werte und BIM.', icon: Globe },
          { id: 'bim_baustoffe', label: 'BIM für Baustoffe (IFC)', type: 'standard', description: 'Building Information Modeling, Attribuierung, Material-Property-Sets.', icon: Monitor },
          { id: 'materialdatenbanken', label: 'Materialdatenbanken', type: 'database', description: 'Digitale Archive: ÖKOBAUDAT, baubook, WECOBIS und Materialarchiv.', icon: Search },
          { id: 'materialpaesse', label: 'Materialpässe & Gebäudepass', type: 'standard', description: 'Gebäude-Ressourcenpass und Baustoffinventar nach Madaster.', icon: FileText },
          { id: 'dpp', label: 'Digitaler Produktpass (DPP)', type: 'calculator', description: 'QR-Code-Strukturierung nach BauPVO 2024/3110 zur Bauteilidentifikation.', icon: QrCode, norm: 'BauPVO 2024/3110' }
        ]
      },
      {
        id: 'grp_ki',
        name: 'KI im Bauwesen',
        icon: Sparkles,
        nodes: [
          { id: 'ki_ueberblick', label: 'Überblick & Grundlagen', type: 'info', description: 'Historie, Machine Learning, Deep Learning, RAG und LLMs im Bauingenieurwesen.', icon: Sparkles },
          { id: 'ki_system', label: 'Systemarchitektur der KI', type: 'standard', description: 'Technische Erklärung von KNN, Embeddings, Vektordatenbanken und Agenten.', icon: Cpu },
          { id: 'ki_prompting', label: 'Prompting-Praxis', type: 'calculator', description: 'Ingenieur-Prompt-Generator mit Rollendefinition und Null-Halluzinations-Vorgaben.', icon: Sparkles },
          { id: 'ki_llmpraxis', label: 'LLM-Praxis (Claude & ChatGPT)', type: 'standard', description: 'Skills, MCP-Konnektoren, Markdown-Strukturierung und Web-Grounding.', icon: Terminal },
          { id: 'ki_thesen', label: 'Tools für Thesen & Literatur', type: 'standard', description: 'Elicit, Connected Papers, NotebookLM und wissenschaftliche Synthese.', icon: BookOpen },
          { id: 'ki_recht_ethik', label: 'Fehler, Recht & Ethik', type: 'norm', description: 'Haftungsrisiken nach BGB/HOAI, EU AI Act, Urheberrecht und Prüfpflichten.', icon: ShieldAlert, norm: 'EU AI Act / BGB' },
          { id: 'ki_lokal', label: 'Lokale KI (LM Studio)', type: 'standard', description: 'Offline-Betrieb von Open-Source LLMs (Qwen, Llama, DeepSeek) für 100% DSGVO.', icon: Server },
          { id: 'ki_ressourcen', label: 'Unabhängige KI-Seiten', type: 'database', description: 'Kuratierte Sammlung wissenschaftlicher KI-Ressourcen und Modelle.', icon: Compass },
          { id: 'ki_onlinekurse', label: 'Onlinekurse & Video-Lernpfade', type: 'info', description: 'Didaktische YouTube-Tutorials zu Python, ML, RAG und MCP für Bauingenieure.', icon: Video }
        ]
      },
      {
        id: 'grp_praxiswissen',
        name: 'Praxiswissen',
        icon: Wrench,
        nodes: [
          { id: 'praxiswissen_info', label: 'Modulinfos Praxiswissen', type: 'info', description: 'Ingenieurpraxis, Vergabe, Baustellenführung und Berufsstart.', icon: BookOpen },
          { id: 'px_planung', label: 'Planung & Ausschreibung (AVA)', type: 'norm', description: 'HOAI-Leistungsphasen 1 bis 9, VOB/A und Leistungsverzeichnisse.', icon: ClipboardCheck, norm: 'HOAI / VOB/A' },
          { id: 'px_bauleitung', label: 'Bauleitung & Baustelle', type: 'standard', description: 'Bauleiteralltag, Abnahme nach VOB/B, Mängelrügen und Bedenkenanmeldung.', icon: Wrench, norm: 'VOB/B' },
          { id: 'px_bautagebuch', label: 'Interaktives Bautagebuch', type: 'calculator', description: 'Digitales Baustellentagebuch mit Wetterdaten, Personal und Störungen.', icon: ClipboardList },
          { id: 'px_produktion', label: 'Produktherstellung & QS', type: 'standard', description: 'Werksfertigung, werkseigene Produktionskontrolle (WPK) und Audits.', icon: Factory },
          { id: 'px_karriere', label: 'Karrierestart & Soft Skills', type: 'standard', description: 'Berufseinstieg, Gehaltsverhandlung, Ingenieurkammer und Netzwerk.', icon: GraduationCap }
        ]
      },
      {
        id: 'grp_infos_quellen',
        name: 'Infos & Quellen',
        icon: Database,
        nodes: [
          { id: 'software', label: 'Software & Tools', type: 'database', description: 'Übersicht bautechnischer FEM-, CAD-, WUFI- und U-Wert-Software.', icon: Monitor },
          { id: 'glossar', label: 'Fachbegriff-Glossar (>500 Begriffe)', type: 'database', description: 'Durchsuchbares Nachschlagewerk mit genormten bautechnischen Begriffen.', icon: BookOpen },
          { id: 'fortbildungen', label: 'Fortbildungen & Kammern', type: 'info', description: 'Akademische Weiterbildungen der Bayerischen Ingenieurekammer-Bau.', icon: Award },
          { id: 'informationsquellen', label: 'Informationsquellen & Fachportale', type: 'database', description: 'Portale von Bundesinstituten, Fachverbänden und Bibliotheken.', icon: Box },
          { id: 'literatur', label: 'Literaturempfehlungen', type: 'info', description: 'Wendehorst, Schneider Bautabellen, Fachbücher Baustoffkunde & Statik.', icon: BookOpen }
        ]
      },
      {
        id: 'grp_kuriositaeten',
        name: 'Kuriositäten',
        icon: Sparkles,
        nodes: [
          { id: 'kuriositaeten', label: 'Kuriositäten & Baufails', type: 'info', description: 'Verblüffende Werkstoffrekorde, historische Kuriositäten und spektakuläre Baufails.', icon: Sparkles }
        ]
      }
    ]
  },
  {
    id: 'cluster_6',
    number: 'VI',
    name: 'Studium & Lehre',
    subtitle: 'Vorlesungsportal THA, Baustofflabor, Übungsaufgaben, Beispielrechnungen, Weiterbildung & Thesen',
    accentBg: 'bg-teal-50 dark:bg-teal-950/30',
    accentBorder: 'border-teal-300 dark:border-teal-800',
    accentText: 'text-teal-900 dark:text-teal-400',
    icon: GraduationCap,
    groups: [
      {
        id: 'grp_studium_tha',
        name: 'Studium THA',
        icon: Globe,
        nodes: [
          { id: 'studium_tha', label: 'Portal app.tha.de & Campus-Tools', type: 'info', description: 'Zentrales Studierendenportal der Technischen Hochschule Augsburg.', icon: Globe }
        ]
      },
      {
        id: 'grp_labor_sicherheit',
        name: 'Baustofflabor',
        icon: ShieldAlert,
        nodes: [
          { id: 'labor_sicherheit', label: 'Laborsicherheit Gebäude G2', type: 'norm', description: 'Laborordnung, PSA-Vorschriften, Notfallkette und Sicherheitsunterweisung.', icon: ShieldAlert, norm: 'Laborordnung THA' }
        ]
      },
      {
        id: 'grp_vorlesungen',
        name: 'Vorlesungen',
        icon: GraduationCap,
        nodes: [
          { id: 'vl_bauen_im_bestand', label: 'Bauen im Bestand (VL)', type: 'info', description: 'Vorlesungsunterlagen, Semesterwochenplan, ZfP und Koldewey-Stufen.', icon: Building2 },
          { id: 'vl_nachhaltiges_bauen', label: 'Nachhaltiges Bauen (VL)', type: 'info', description: 'Ökobilanzierung, EU-Taxonomie, EPBD und Zirkularität.', icon: Leaf },
          { id: 'vl_bauschaeden', label: 'Bauschäden (VL)', type: 'info', description: 'Schadensforensik, VDI 6200 Zustandsbewertung und Baugutachten.', icon: AlertTriangle },
          { id: 'vl_baustoffkunde', label: 'Baustoffkunde (VL)', type: 'info', description: 'Grundlagen mineralischer, metallischer und organischer Werkstoffe.', icon: Layers },
          { id: 'vl_instandhaltung', label: 'Instandhaltung (VL)', type: 'info', description: 'DIN EN 1504 Instandsetzungsprinzipien und Betonsanierung.', icon: Wrench }
        ]
      },
      {
        id: 'grp_weiterbildung',
        name: 'Weiter@THA',
        icon: Award,
        nodes: [
          { id: 'weiter_tha', label: 'Alle Weiterbildungsangebote', type: 'info', description: 'Masterprogramme und berufsbegleitende Zertifikate an der THA.', icon: Layers },
          { id: 'weiter_bauing', label: 'Master Bauingenieurwesen', type: 'info', description: '3 Semester Vollzeit / Teilzeit mit Master of Engineering (M.Eng.).', icon: GraduationCap },
          { id: 'weiter_pm', label: 'Master Projektmanagement', type: 'info', description: 'Berufsbegleitender Masterstudiengang für Bau- und Projektleiter.', icon: BookOpen },
          { id: 'weiter_ausbau', label: 'Fachingenieur Ausbau', type: 'info', description: 'Zertifikatsstudium für Innen- und Ausbaukonstruktionen.', icon: Award },
          { id: 'weiter_fassade', label: 'Fachingenieur Fassade', type: 'info', description: 'Zertifikatslehrgang Gebäudehülle, Glas und Vorhangfassaden.', icon: LayoutGrid },
          { id: 'weiter_holzbau', label: 'Fachingenieur Holzbau', type: 'info', description: 'Zertifikatsstudium moderner Ingenieurholzbau und Brandschutz.', icon: Trees },
          { id: 'weiter_ttz', label: 'TTZ Aichach (digital. Holzbau)', type: 'info', description: 'Technologietransferzentrum für digitalisierten Holzbau und Robotik.', icon: Sparkles },
          { id: 'weiter_mapr', label: 'MAPR (Applied Research Master)', type: 'info', description: 'Master of Applied Research in Engineering (M.Sc.).', icon: GraduationCap }
        ]
      },
      {
        id: 'grp_thesen',
        name: 'Thesen & Projekte',
        icon: FileText,
        nodes: [
          { id: 'thesen_projekte', label: 'Thesen & Semesterprojekte', type: 'info', description: 'Bachelor-, Masterthesen und Forschungsthemen an der Fakultät AB.', icon: FileText }
        ]
      },
      {
        id: 'grp_aufgaben',
        name: 'Übungsaufgaben',
        icon: ClipboardCheck,
        nodes: [
          { id: 'aufgaben_trainer', label: 'Dynamischer Prüfungs-Trainer', type: 'calculator', description: 'Randomisierter Rechentrainer für Knicklast, Kriechen, Bogue und U-Wert.', icon: Calculator },
          { id: 'aufgaben_komplex', label: 'Bauforensik & Fallstudien', type: 'quiz', description: 'Komplexe fächerübergreifende Schadensfälle mit Budget und Sanierungsplan.', icon: Search },
          { id: 'aufgaben_quiz', label: 'Wissenscheck & Wissenslücken', type: 'quiz', description: 'Interaktiver Wissenscheck zur gezielten Klausurvorbereitung.', icon: GraduationCap },
          { id: 'aufgaben_beton', label: 'Klausurtraining Betontechnologie', type: 'quiz', description: 'Übungsfragen zu Frischbeton, Mischungsentwurf und Sieblinien.', icon: BookOpen },
          { id: 'aufgaben_stahlbeton', label: 'Klausurtraining Massivbau', type: 'quiz', description: 'Biegebemessung, Querkraft und Mindestbewehrung gegen Risse.', icon: BookOpen },
          { id: 'aufgaben_holzbau', label: 'Klausurtraining Holzbau', type: 'quiz', description: 'Bemessung nach EC 5, Verbindungsmittel und Stabilität.', icon: BookOpen },
          { id: 'aufgaben_weitere', label: 'Klausurtraining Baustoffe', type: 'quiz', description: 'Fragen zu Metallen, Natursteinen, Kalk, Gips und Glas.', icon: BookOpen },
          { id: 'aufgaben_bauprodukte', label: 'Klausurtraining Bauprodukte', type: 'quiz', description: 'Bauproduktenverordnung, AVCP-Systeme und CE-Kennzeichnung.', icon: BookOpen },
          { id: 'aufgaben_mechanik', label: 'Klausurtraining Mechanik', type: 'quiz', description: 'Spannungsberechnungen, E-Modul und Biegelinien.', icon: BookOpen },
          { id: 'aufgaben_bauphysik', label: 'Klausurtraining Bauphysik', type: 'quiz', description: 'U-Wert, Glaser-Verfahren, Schalldämmmaß und GEG.', icon: BookOpen },
          { id: 'aufgaben_nachhaltigkeit', label: 'Klausurtraining Nachhaltigkeit', type: 'quiz', description: 'LCA, GWP-Berechnung, EU-Taxonomie und DPP.', icon: BookOpen },
          { id: 'aufgaben_bestand', label: 'Klausurtraining Bauen im Bestand', type: 'quiz', description: 'Epochenbaustoffe, Altbaudiagnose und denkmalgerechte Sanierung.', icon: BookOpen },
          { id: 'aufgaben_dauerhaftigkeit', label: 'Klausurtraining Dauerhaftigkeit', type: 'quiz', description: 'AKR, Bewehrungskorrosion und Instandsetzungsprinzipien.', icon: BookOpen },
          { id: 'aufgaben_rueckbau', label: 'Klausurtraining Rückbau', type: 'quiz', description: 'Selektiver Abbruch, Asbest-Erkennung und EBV.', icon: BookOpen },
          { id: 'aufgaben_kennwerte', label: 'Klausurtraining Labor & Grundlagen', type: 'quiz', description: 'Prüfverfahren, statistische Auswertung und Kenngrößen.', icon: BookOpen },
          { id: 'aufgaben_digitales', label: 'Klausurtraining Digitales & KI', type: 'quiz', description: 'BIM, IFC-Attribute und KI-Prompting im Bauwesen.', icon: BookOpen }
        ]
      },
      {
        id: 'grp_rechnungen',
        name: 'Beispielrechnungen',
        icon: Calculator,
        nodes: [
          { id: 'rechnung_u_wert', label: 'Bauphysik: U-Wert-Berechnung', type: 'calculator', description: 'Vollständige Schritt-für-Schritt-U-Wert-Ermittlung nach DIN EN ISO 6946.', icon: Layers, norm: 'DIN EN ISO 6946' },
          { id: 'rechnung_beton', label: 'Beton: Mischungsentwurf', type: 'calculator', description: 'Stoffraumberechnung und Rezepturoptimierung nach DIN 1045-2.', icon: BookOpen, norm: 'DIN 1045-2' },
          { id: 'rechnung_stahlbeton', label: 'Massivbau: Biegebemessung', type: 'calculator', description: 'Rechteckbalken-Biegebemessung im GZT nach Eurocode 2.', icon: Sliders, norm: 'DIN EN 1992-1-1' },
          { id: 'rechnung_holzbau', label: 'Holzbau: Stützenknicken', type: 'calculator', description: 'Nachweis gegen Biegeknicken einer Holzstütze nach Eurocode 5.', icon: Scale, norm: 'DIN EN 1995-1-1' },
          { id: 'rechnung_mauerwerk', label: 'Mauerwerk: Tragfähigkeit', type: 'calculator', description: 'Vereinfachtes Nachweisverfahren nach Eurocode 6.', icon: Wrench, norm: 'DIN EN 1996' },
          { id: 'rechnung_nachhaltigkeit', label: 'Nachhaltigkeit: GWP-Bilanz', type: 'calculator', description: 'Lebenszyklus-Treibhauspotenzial mit Karbonatisierungs-Uptake.', icon: Leaf, norm: 'DIN EN 15804' },
          { id: 'rechnung_bestand', label: 'Bauen im Bestand: Sanierung', type: 'calculator', description: 'Tragfähigkeitsnachweis und U-Wert-Sanierung im Altbestand.', icon: History },
          { id: 'rechnung_schallschutz', label: 'Bauakustik: Bauschalldämmmaß', type: 'calculator', description: 'Schalldämmung mit Flankenübertragung nach DIN 4109.', icon: Volume2, norm: 'DIN 4109' },
          { id: 'rechnung_brandschutz', label: 'Brandschutz: Heißbemessung', type: 'calculator', description: 'Effektive Restquerschnittsmethode nach EC 5 und EC 2.', icon: Flame, norm: 'DIN EN 1995-1-2' }
        ]
      }
    ]
  }
];

export default function Modulstruktur() {
  const { setActiveTab } = useTabContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<NodeType | 'all'>('all');
  const [viewStyle, setViewStyle] = useState<'tree_full' | 'tree_columns' | 'outline'>('tree_full');

  // Track collapsed state for clusters or groups (default: all expanded for simultaneous view!)
  const [collapsedClusters, setCollapsedClusters] = useState<Record<string, boolean>>({});
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleCluster = (clusterId: string) => {
    setCollapsedClusters(prev => ({ ...prev, [clusterId]: !prev[clusterId] }));
  };

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const expandAll = () => {
    setCollapsedClusters({});
    setCollapsedGroups({});
  };

  const collapseAll = () => {
    const cMap: Record<string, boolean> = {};
    const gMap: Record<string, boolean> = {};
    BAUSTOFFBOARD_TREE.forEach(c => {
      cMap[c.id] = true;
      c.groups.forEach(g => {
        gMap[g.id] = true;
      });
    });
    setCollapsedClusters(cMap);
    setCollapsedGroups(gMap);
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    let totalModules = 0;
    let totalCalculators = 0;
    let totalDatabases = 0;
    let totalQuizzes = 0;
    let totalNorms = 0;
    let totalGroups = 0;

    BAUSTOFFBOARD_TREE.forEach(c => {
      totalGroups += c.groups.length;
      c.groups.forEach(g => {
        totalModules += g.nodes.length;
        g.nodes.forEach(n => {
          if (n.type === 'calculator') totalCalculators++;
          if (n.type === 'database') totalDatabases++;
          if (n.type === 'quiz') totalQuizzes++;
          if (n.type === 'norm' || n.norm) totalNorms++;
        });
      });
    });

    return {
      totalModules,
      totalCalculators,
      totalDatabases,
      totalQuizzes,
      totalNorms,
      totalGroups,
      totalClusters: BAUSTOFFBOARD_TREE.length
    };
  }, []);

  // Filtered tree
  const filteredTree = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return BAUSTOFFBOARD_TREE.map(cluster => {
      const filteredGroups = cluster.groups.map(group => {
        const filteredNodes = group.nodes.filter(node => {
          // Type filter
          if (selectedType !== 'all' && node.type !== selectedType) {
            if (!(selectedType === 'norm' && !!node.norm)) {
              return false;
            }
          }

          // Search query filter
          if (!q) return true;
          const matchLabel = node.label.toLowerCase().includes(q);
          const matchDesc = node.description.toLowerCase().includes(q);
          const matchNorm = node.norm?.toLowerCase().includes(q);
          const matchKeywords = node.keywords?.some(k => k.toLowerCase().includes(q));
          const matchGroup = group.name.toLowerCase().includes(q);
          const matchCluster = cluster.name.toLowerCase().includes(q);

          return matchLabel || matchDesc || matchNorm || matchKeywords || matchGroup || matchCluster;
        });

        return { ...group, nodes: filteredNodes };
      }).filter(g => g.nodes.length > 0);

      return { ...cluster, groups: filteredGroups };
    }).filter(c => c.groups.length > 0);
  }, [searchQuery, selectedType]);

  const handleNodeClick = (nodeId: string) => {
    setActiveTab(nodeId as any);
  };

  const renderBadge = (type: NodeType, norm?: string) => {
    switch (type) {
      case 'calculator':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
            <Calculator size={10} /> Rechner
          </span>
        );
      case 'database':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60">
            <Database size={10} /> Daten
          </span>
        );
      case 'quiz':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
            <HelpCircle size={10} /> Quiz
          </span>
        );
      case 'norm':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60">
            <Scale size={10} /> {norm || 'Norm'}
          </span>
        );
      case 'info':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <BookOpen size={10} /> Info
          </span>
        );
      default:
        return norm ? (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Scale size={10} /> {norm}
          </span>
        ) : null;
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* 1. Header & Einleitung nach RULE[GEMINI_md] */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-home-grau/20">
          <div>
            <h1 className="text-2xl font-bold text-text-main flex items-center gap-2.5">
              <Network className="text-shiraz" size={26} /> Modulübersicht
            </h1>
            <p className="text-xs text-text-main/70 mt-1">
              Vollständiger akademischer Wissensbaum des BaustoffBoards TH Augsburg · Gleichzeitige Anzeige aller Fachmodule, Rechner und Normen
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-off-white hover:bg-home-grau/20 text-text-main border border-home-grau/30 transition-all cursor-pointer"
            >
              Alle aufklappen
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-off-white hover:bg-home-grau/20 text-text-main border border-home-grau/30 transition-all cursor-pointer"
            >
              Alle einklappen
            </button>
          </div>
        </div>

        {/* Kennzahlen-Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-4">
          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-center">
            <span className="text-xl font-bold text-shiraz block">{formatDeWert(metrics.totalModules)}</span>
            <span className="text-[11px] text-text-main/70 font-medium">Module gesamt</span>
          </div>
          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-center">
            <span className="text-xl font-bold text-amber-700 block">{formatDeWert(metrics.totalCalculators)}</span>
            <span className="text-[11px] text-text-main/70 font-medium">Interaktive Rechner</span>
          </div>
          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-center">
            <span className="text-xl font-bold text-blue-700 block">{formatDeWert(metrics.totalDatabases)}</span>
            <span className="text-[11px] text-text-main/70 font-medium">Fachdatenbanken</span>
          </div>
          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-center">
            <span className="text-xl font-bold text-emerald-700 block">{formatDeWert(metrics.totalQuizzes)}</span>
            <span className="text-[11px] text-text-main/70 font-medium">Klausur-Quizzes</span>
          </div>
          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-center">
            <span className="text-xl font-bold text-purple-700 block">{formatDeWert(metrics.totalNorms)}</span>
            <span className="text-[11px] text-text-main/70 font-medium">Normbezüge (DIN/EN)</span>
          </div>
          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-center">
            <span className="text-xl font-bold text-text-main block">{metrics.totalClusters} Cluster</span>
            <span className="text-[11px] text-text-main/70 font-medium">{metrics.totalGroups} Fachgruppen</span>
          </div>
        </div>

        {/* Interaktive Steuerungsleiste: Suche, Modultyp-Filter & Ansichtsmodus */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mt-4 pt-4 border-t border-home-grau/20">
          {/* Suchleiste */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-home-grau/70" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Module, Rechner, Normen oder Stichwörter im Wissensbaum suchen..."
              className="w-full pl-9 pr-8 py-2 bg-off-white rounded-xl border border-home-grau/30 text-xs font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-shiraz"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-home-grau hover:text-shiraz"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter nach Typ */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-shiraz text-white border-shiraz shadow-xs'
                  : 'bg-white text-text-main/80 border-home-grau/30 hover:bg-off-white'
              }`}
            >
              Alle
            </button>
            <button
              onClick={() => setSelectedType('calculator')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
                selectedType === 'calculator'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-amber-800 border-home-grau/30 hover:bg-amber-50'
              }`}
            >
              <Calculator size={12} /> Rechner
            </button>
            <button
              onClick={() => setSelectedType('database')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
                selectedType === 'database'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-blue-800 border-home-grau/30 hover:bg-blue-50'
              }`}
            >
              <Database size={12} /> Daten
            </button>
            <button
              onClick={() => setSelectedType('quiz')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
                selectedType === 'quiz'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-emerald-800 border-home-grau/30 hover:bg-emerald-50'
              }`}
            >
              <HelpCircle size={12} /> Quizzes
            </button>
            <button
              onClick={() => setSelectedType('norm')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
                selectedType === 'norm'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-white text-purple-800 border-home-grau/30 hover:bg-purple-50'
              }`}
            >
              <Scale size={12} /> Normen
            </button>
          </div>

          {/* Ansichtswähler */}
          <div className="flex items-center gap-1 bg-off-white p-1 rounded-xl border border-home-grau/20">
            <button
              onClick={() => setViewStyle('tree_full')}
              title="Vollständiger Baum mit Verbindungslinien (Standard)"
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewStyle === 'tree_full'
                  ? 'bg-white text-shiraz shadow-xs border border-home-grau/30'
                  : 'text-text-main/70 hover:text-text-main'
              }`}
            >
              <ListTree size={14} /> Baum
            </button>
            <button
              onClick={() => setViewStyle('tree_columns')}
              title="Spalten-Baum (Multi-Column Grid)"
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewStyle === 'tree_columns'
                  ? 'bg-white text-shiraz shadow-xs border border-home-grau/30'
                  : 'text-text-main/70 hover:text-text-main'
              }`}
            >
              <Columns size={14} /> Spalten
            </button>
            <button
              onClick={() => setViewStyle('outline')}
              title="Gliederungsindex"
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewStyle === 'outline'
                  ? 'bg-white text-shiraz shadow-xs border border-home-grau/30'
                  : 'text-text-main/70 hover:text-text-main'
              }`}
            >
              <FileText size={14} /> Index
            </button>
          </div>
        </div>
      </div>

      {/* 2. HAUPTBEREICH: DIE BAUMSTRUKTUR (SIMULTANE ANZEIGE ALLER MODULE) */}
      {viewStyle === 'tree_full' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 animate-in fade-in duration-200 space-y-8">
          {/* Baum-Wurzelknoten (Root) */}
          <div className="flex items-center gap-3 pb-4 border-b border-home-grau/20">
            <div className="w-10 h-10 rounded-xl bg-shiraz text-white flex items-center justify-center shadow-sm shrink-0">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-shiraz">Root Directory</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-off-white border border-home-grau/30 text-text-main/70 font-semibold">
                  THA BaustoffBoard · {metrics.totalModules} Module
                </span>
              </div>
              <h2 className="text-lg font-bold text-text-main leading-tight">
                Gesamter akademischer Lehr- &amp; Werkstoffbaum
              </h2>
            </div>
          </div>

          {/* Iteration über alle Cluster mit durchgehenden visuellen Baumzweigen */}
          <div className="space-y-6">
            {filteredTree.map((cluster, cIndex) => {
              const isLastCluster = cIndex === filteredTree.length - 1;
              const isCollapsed = !!collapsedClusters[cluster.id];
              const ClusterIcon = cluster.icon;
              const clusterModuleCount = cluster.groups.reduce((acc, g) => acc + g.nodes.length, 0);

              return (
                <div key={cluster.id} className="relative">
                  {/* Vertikaler Hauptstamm (Baumlinie von Root nach unten) */}
                  {!isLastCluster && (
                    <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-home-grau/25 pointer-events-none" />
                  )}

                  {/* Level 1: Cluster-Knoten */}
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleCluster(cluster.id)}
                      className="w-10 h-10 rounded-xl bg-white border-2 border-shiraz/40 hover:border-shiraz text-shiraz flex items-center justify-center shrink-0 shadow-xs z-10 transition-colors cursor-pointer group"
                    >
                      <ClusterIcon size={20} className="group-hover:scale-110 transition-transform" />
                    </button>

                    <div className="flex-1">
                      <div
                        onClick={() => toggleCluster(cluster.id)}
                        className="p-3 bg-off-white hover:bg-slate-100 rounded-xl border border-home-grau/30 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-black px-2 py-0.5 rounded bg-shiraz text-white shadow-2xs">
                            Cluster {cluster.number}
                          </span>
                          <h3 className="text-sm font-bold text-text-main">{cluster.name}</h3>
                          <span className="hidden sm:inline text-xs text-text-main/60 truncate">
                            · {cluster.subtitle}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-home-grau/30 text-text-main/70 font-bold">
                            {cluster.groups.length} Gruppen · {clusterModuleCount} Module
                          </span>
                          {isCollapsed ? <ChevronRight size={16} className="text-text-main/60" /> : <ChevronDown size={16} className="text-text-main/60" />}
                        </div>
                      </div>

                      {/* Level 2 & 3: Fachgruppen und Modul-Blätter */}
                      {!isCollapsed && (
                        <div className="mt-3 ml-5 pl-5 border-l-2 border-home-grau/25 space-y-4">
                          {cluster.groups.map((group, gIndex) => {
                            const isGroupCollapsed = !!collapsedGroups[group.id];
                            const GroupIcon = group.icon;

                            return (
                              <div key={group.id} className="relative">
                                {/* Horizontaler Ast zur Gruppe */}
                                <div className="absolute -left-5 top-5 w-5 h-0.5 bg-home-grau/25 pointer-events-none" />

                                {/* Gruppen-Header */}
                                <div
                                  onClick={() => toggleGroup(group.id)}
                                  className="p-2.5 bg-white hover:bg-off-white rounded-lg border border-home-grau/30 flex items-center justify-between cursor-pointer transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="p-1 rounded bg-off-white text-shiraz">
                                      <GroupIcon size={14} />
                                    </div>
                                    <h4 className="text-xs font-bold text-text-main">{group.name}</h4>
                                    <span className="text-[10px] text-text-main/60 font-semibold">
                                      ({group.nodes.length} Module)
                                    </span>
                                  </div>
                                  <div className="text-text-main/50">
                                    {isGroupCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                                  </div>
                                </div>

                                {/* Level 3: Modul-Blätter (Gleichzeitige Anzeige aller Module) */}
                                {!isGroupCollapsed && (
                                  <div className="mt-2 ml-4 pl-4 border-l-2 border-home-grau/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {group.nodes.map(node => {
                                      const NodeIcon = node.icon || Box;
                                      return (
                                        <button
                                          key={node.id}
                                          onClick={() => handleNodeClick(node.id)}
                                          title={node.description}
                                          className="p-2.5 bg-off-white/80 hover:bg-white hover:border-shiraz/50 border border-home-grau/20 rounded-xl text-left transition-all duration-150 flex flex-col justify-between gap-1.5 shadow-2xs group cursor-pointer hover:shadow-sm"
                                        >
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                              <div className="p-1 rounded bg-white text-text-main/70 group-hover:text-shiraz transition-colors shrink-0">
                                                <NodeIcon size={14} />
                                              </div>
                                              <span className="text-xs font-bold text-text-main group-hover:text-shiraz transition-colors leading-tight line-clamp-1">
                                                {node.label}
                                              </span>
                                            </div>
                                            <ArrowRight size={13} className="text-home-grau/40 group-hover:text-shiraz group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                                          </div>

                                          <p className="text-[11px] text-text-main/70 line-clamp-2 leading-relaxed">
                                            {node.description}
                                          </p>

                                          <div className="flex items-center justify-between pt-1 border-t border-home-grau/15 mt-0.5">
                                            {renderBadge(node.type, node.norm)}
                                            <span className="text-[10px] font-mono text-text-main/40 uppercase">
                                              #{node.id}
                                            </span>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ANSICHT 2: MULTI-COLUMN SPALTEN-BAUM (ALLE CLUSTER SIMULTAN NEBENEINANDER) */}
      {viewStyle === 'tree_columns' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTree.map(cluster => {
              const ClusterIcon = cluster.icon;
              return (
                <div key={cluster.id} className="bg-off-white/60 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                  <div>
                    {/* Cluster Spaltenkopf */}
                    <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-home-grau/20">
                      <div className="w-8 h-8 rounded-lg bg-shiraz text-white flex items-center justify-center shrink-0">
                        <ClusterIcon size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-shiraz">Cluster {cluster.number}</span>
                        <h3 className="text-xs font-bold text-text-main leading-tight">{cluster.name}</h3>
                      </div>
                    </div>

                    {/* Gruppen und Module */}
                    <div className="space-y-4">
                      {cluster.groups.map(group => {
                        const GroupIcon = group.icon;
                        return (
                          <div key={group.id} className="bg-white p-3 rounded-lg border border-home-grau/20 shadow-2xs">
                            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-home-grau/15 text-xs font-bold text-text-main">
                              <span className="flex items-center gap-1.5">
                                <GroupIcon size={13} className="text-shiraz" /> {group.name}
                              </span>
                              <span className="text-[10px] font-mono text-text-main/50">{group.nodes.length}</span>
                            </div>

                            <div className="space-y-1">
                              {group.nodes.map(node => (
                                <button
                                  key={node.id}
                                  onClick={() => handleNodeClick(node.id)}
                                  className="w-full px-2 py-1.5 rounded-md text-left text-xs text-text-main hover:bg-shiraz hover:text-white transition-colors flex items-center justify-between group cursor-pointer"
                                >
                                  <span className="truncate flex-1 font-medium text-[11px]">{node.label}</span>
                                  {node.type === 'calculator' && <Calculator size={11} className="text-amber-600 group-hover:text-white shrink-0 ml-1" />}
                                  {node.type === 'database' && <Database size={11} className="text-blue-600 group-hover:text-white shrink-0 ml-1" />}
                                  {node.type === 'quiz' && <HelpCircle size={11} className="text-emerald-600 group-hover:text-white shrink-0 ml-1" />}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ANSICHT 3: NUMERISCHER GLIEDERUNGSINDEX */}
      {viewStyle === 'outline' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 animate-in fade-in duration-200">
          <div className="space-y-6">
            {filteredTree.map((cluster, cIdx) => (
              <div key={cluster.id} className="border-b border-home-grau/20 pb-5 last:border-b-0">
                <div className="flex items-center gap-2 text-sm font-bold text-shiraz mb-2">
                  <span>{cIdx + 1}.0</span>
                  <span>Cluster {cluster.number}: {cluster.name}</span>
                </div>

                <div className="ml-5 space-y-3">
                  {cluster.groups.map((group, gIdx) => (
                    <div key={group.id} className="space-y-1.5">
                      <div className="text-xs font-bold text-text-main flex items-center gap-2">
                        <span className="text-text-main/50 font-mono">{cIdx + 1}.{gIdx + 1}</span>
                        <span>{group.name}</span>
                        <span className="text-[10px] text-text-main/50">({group.nodes.length} Module)</span>
                      </div>

                      <div className="ml-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                        {group.nodes.map((node, nIdx) => (
                          <button
                            key={node.id}
                            onClick={() => handleNodeClick(node.id)}
                            className="p-1.5 rounded hover:bg-off-white text-left text-[11px] text-text-main/80 hover:text-shiraz transition-colors flex items-center justify-between cursor-pointer"
                          >
                            <span className="truncate">
                              <span className="font-mono text-text-main/40 mr-1.5">{cIdx + 1}.{gIdx + 1}.{nIdx + 1}</span>
                              {node.label}
                            </span>
                            {renderBadge(node.type, node.norm)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Didaktischer Hinweis-Banner */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-shiraz/10 text-shiraz flex items-center justify-center shrink-0">
            <GraduationCap size={22} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-main">
              Didaktischer Leitfaden &amp; 6 Prüfdimensionen der Qualitätssicherung
            </h4>
            <p className="text-[11px] text-text-main/70 mt-0.5">
              Erfahren Sie mehr über die curriculare Gliederung, den 4-Stufen-Lehrpfad und die akkreditierungskonforme Ausrichtung im Modul <strong>Anleitung</strong>.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('anleitung')}
          className="px-4 py-2 bg-shiraz hover:bg-shiraz/90 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
        >
          Zur Anleitung <ArrowRight size={13} />
        </button>
      </div>

      {/* 4. Standardisierter Footer nach RULE[GEMINI_md] */}
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
            erklaerung: 'ECTS-Workload-Bilanzierung nach dem European Credit Transfer and Accumulation System (ECTS): 1 Credit Point entspricht 25 bis 30 Arbeitsstunden für Präsenzstudium, Selbststudium und Prüfungsvorbereitung.',
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
