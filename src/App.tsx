import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect } from 'react';
import { Calculator, Calendar, Globe,
  Waves, 
  ShieldAlert, 
  BarChart3,
  GraduationCap,
  Activity,
  Trees,
  ThermometerSun,
  Download,
  Timer,
  GitCommit,
  Layers,
  Database,
  Droplets,
  Box,
  Scale,
  History,
  TrendingUp,
  TrendingDown,
  Flame,
  LayoutGrid,
  Grid,
  Maximize,
  Maximize2,
  Minimize2,
  Thermometer,
  Leaf,
  Snowflake,
  Mountain,
  BookOpen,
  Award,
  FileText,
  QrCode,
  MessageSquare,
  RefreshCw,
  Recycle,
  Wrench,
  Clock,
  Volume2,
  AlertTriangle,
  Trash2,
  Eye,
  MapPin,
  Beaker,
  CircleDashed,
  CheckCircle2,
  Hammer,
  AppWindow,
  Package,
  Columns,
  Home,
  FlaskConical,
  Monitor,
  Network,
  ClipboardCheck,
  ClipboardList,
  Building2,
  Landmark,
  Search,
  Compass,
  Factory,
  Menu,
  X,
  FileCheck,
  FileSearch,
  Microscope,
  FileWarning,
  Paintbrush,
  Palette,
  Shield,
  ShieldCheck,
  Server,
  Milestone,
  Train,
  HardHat,
  Info,
  Sparkles,
  Sun,
  Moon,
  Cpu,
  Code,
  Users,
  Sliders,
  Settings,
  Terminal,
  ChevronRight,
  Star,
  ArrowRight,
  CornerDownRight,
  Video
} from 'lucide-react';

import { exportToPDF } from './lib/pdfExport';
import { TabProvider, useTabContext, TabId } from './contexts/TabContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { LanguageSwitcher } from './components/navigation/LanguageSwitcher';
import { LanguageBanner } from './components/navigation/LanguageBanner';
import { TAB_DESCRIPTIONS } from './metaDescriptions';
import { AccessibilityToolbar } from './components/a11y/AccessibilityToolbar';
import { HelpCircle } from 'lucide-react';
import { MetadataAuditModal } from './components/seo/MetadataAuditModal';
import { META_CLUSTERS, GROUP_TO_CLUSTER } from './data/metaClusters';
import StudentPollVoteView from './components/polls/StudentPollVoteView';

const tabGroups = [
  {
    name: 'Allgemein',
    tabs: [
      { id: 'start', label: 'Startseite', icon: GraduationCap },
      { id: 'admin', label: 'Admin (THA)', icon: ShieldAlert },
      { id: 'anleitung', label: 'Anleitung', icon: BookOpen },
      { id: 'modulstruktur', label: 'Modulstruktur', icon: Network },
      { id: 'feedback', label: 'Feedback', icon: MessageSquare },
      { id: 'versionen', label: 'Changelog', icon: Clock },
      { id: 'impressum', label: 'Impressum', icon: Building2 },
      { id: 'datenschutz', label: 'Datenschutz', icon: ShieldCheck },
    ]
  },
  {
    name: 'Grundlagen',
    tabs: [
      { id: 'grundlagen_info', label: 'Modulinfos', icon: Info },
      { id: 'baustoffkunde', label: 'Baustoffkunde', icon: GraduationCap },
      { id: 'einheiten', label: 'Einheiten', icon: Scale },
      { id: 'materialkennwerte', label: 'Kennwerte', icon: Scale },
      { id: 'baustoffkenngroessen', label: 'Baustoffkenngrößen', icon: Scale },
      { id: 'bauchemie', label: 'Bauchemie', icon: FlaskConical },
      { id: 'sicherheitskonzept', label: 'Eurocode', icon: ShieldAlert },
      { id: 'regularien', label: 'Regulatives', icon: Scale },
    ]
  },
  {
    name: 'Labor & Auswertung',
    tabs: [
      { id: 'labor_info', label: 'Modulinfos', icon: Info },
      { id: 'probenahme', label: 'Probenahme & Erkundung', icon: FileSearch },
      { id: 'messen_pruefen', label: 'Messen & Prüfen', icon: Scale },
      { id: 'analytik', label: 'Analytik & Diagnostik', icon: Microscope },
      { id: 'mechanische_pruefungen', label: 'Mechanische Prüfungen', icon: ClipboardCheck },
      { id: 'labor', label: 'Virtuelle Versuche', icon: Beaker },
      { id: 'statistik', label: 'Statistik', icon: BarChart3 },
      { id: 'festbeton_statistik', label: 'Festbeton (Statistik)', icon: BarChart3 },
    ]
  },
  {
    name: 'Baustoffe',
    tabs: [
      { id: 'baustoffe_info', label: 'Modulinfos', icon: Info },
      { id: 'divider_bs_min', label: 'Mineralische Baustoffe', icon: Mountain as any },
      { id: 'gesteine', label: 'Gesteine', icon: Mountain },
      { id: 'mauerwerk', label: 'Mauerwerk', icon: LayoutGrid },
      { id: 'putzemoertel', label: 'Putze & Mörtel', icon: Layers },
      { id: 'gips', label: 'Gips', icon: Box },
      { id: 'kalk', label: 'Kalk', icon: Box },
      { id: 'lehm', label: 'Lehm', icon: Box },
      { id: 'erdbau', label: 'Erdbau & Böden', icon: Mountain },
      { id: 'glas', label: 'Glas', icon: Maximize },
      
      { id: 'divider_bs_met', label: 'Metallische Baustoffe', icon: Flame as any },
      { id: 'stahl', label: 'Stahl', icon: Flame },
      { id: 'metalle', label: 'Metalle', icon: Layers },
      
      { id: 'divider_bs_org', label: 'Organische Baustoffe', icon: Trees as any },
      { id: 'holz', label: 'Holz', icon: Trees },
      { id: 'holzwerkstoffe', label: 'Holzwerkstoffe', icon: Trees },
      { id: 'nawaro', label: 'Biogene Baustoffe (NaWaRo)', icon: Trees },
      { id: 'asphalt', label: 'Asphalt & Bitumen', icon: Layers },
      { id: 'kunststoffe', label: 'Kunststoffe', icon: Box },
      
      { id: 'divider_bs_son', label: 'Sonstige & Innovationen', icon: Box as any },
      { id: 'materialitaet_architektur', label: 'Materialität & Ästhetik', icon: Palette },
      { id: 'daemmstoffe', label: 'Dämmstoffe', icon: Box },
      { id: 'ausbau', label: 'Ausbau & Abdichtung', icon: Layers },
      { id: 'faserverbund', label: 'Faserverbund (CFK/GFK)', icon: GitCommit },
      { id: 'sonstiges', label: 'Sonstige & Innovationen', icon: Box },
    ]
  },
  {
    name: 'Bauprodukte',
    tabs: [
      { id: 'bauprodukte_info', label: 'Modulinfos', icon: Info },
      { id: 'bp_baustoffindustrie', label: 'Baustoffindustrie', icon: Factory },
      { id: 'bp_innovationen', label: 'Innovationen & F&E', icon: Sparkles },
      { id: 'divider_bp_recht', label: 'Zulassungen & Recht', icon: Scale as any },
      { id: 'bp_recht_grundlagen', label: 'CE vs. Ü & MVV TB', icon: Scale },
      { id: 'bp_recht_avcp', label: 'AVCP-Systeme', icon: ShieldCheck },
      { id: 'bp_recht_konformitaet', label: 'Konformität & Auditierung', icon: Award },
      { id: 'bp_recht_normen', label: 'Normenarbeit im Bauwesen', icon: BookOpen },
      
      { id: 'divider_bp_rohbau', label: 'Rohbau & Hülle', icon: Building2 as any },
      { id: 'bp_beton', label: 'Beton (Frisch/Fest)', icon: Box },
      { id: 'bp_betonfertigteile', label: 'Betonfertigteile', icon: LayoutGrid },
      { id: 'bp_betonwaren', label: 'Betonwaren', icon: Package },
      { id: 'bp_mauerwerk', label: 'Mauerwerk', icon: Layers },
      { id: 'bp_dach_fassade', label: 'Dach & Fassade', icon: Home },
      
      { id: 'divider_bp_verkehr', label: 'Verkehr und Tiefbau', icon: Milestone as any },
      { id: 'bp_verkehr_rsto', label: 'Dimensionierung (RStO 12/24)', icon: Calculator },
      { id: 'bp_verkehr_asphalt', label: 'Asphaltsorten', icon: Layers },
      { id: 'bp_verkehr_bitumen', label: 'Bitumen & Gesteine', icon: Flame },
      { id: 'bp_verkehr_pruefung', label: 'Labor-Prüfmethoden', icon: Microscope },
      { id: 'bp_verkehr_betondecken', label: 'Betondecken (ZTV)', icon: LayoutGrid },
      { id: 'bp_verkehr_tiefbau', label: 'Tiefbau & Entwässerung', icon: Droplets },
      { id: 'bp_verkehr_bahn', label: 'Bahnbau (Kompakt)', icon: Train },
      { id: 'bp_verkehr_tunnel', label: 'Tunnelbau (Vortrieb)', icon: HardHat },
      
      { id: 'divider_bp_ausbau', label: 'Innenausbau', icon: LayoutGrid as any },
      { id: 'bp_trockenbau', label: 'Trockenbau', icon: Box },
      { id: 'bp_putz_estrich', label: 'Putz & Estrich', icon: Layers },
      
      { id: 'divider_bp_schutz', label: 'Schutz & Dämmung', icon: Shield as any },
      { id: 'bp_abdichtung', label: 'Abdichtungen', icon: Droplets },
      { id: 'bp_daemmung', label: 'Dämmstoffe', icon: Snowflake },
      
      { id: 'divider_bp_chemie', label: 'Verbindung & Chemie', icon: FlaskConical as any },
      { id: 'bp_befestigung', label: 'Befestigungstechnik', icon: Wrench },
      { id: 'bp_klebstoffe', label: 'Kleb- & Dichtstoffe', icon: FlaskConical },
      { id: 'bp_farben_lacke', label: 'Farben & Lacke', icon: Paintbrush },
      { id: 'bp_betonzusatzmittel', label: 'Betonzusatzmittel', icon: Beaker },
      
      { id: 'divider_bp_werkstoffe', label: 'Produkte nach Werkstoff', icon: Box as any },
      { id: 'bp_holzprodukte', label: 'Holzprodukte', icon: Trees },
      { id: 'bp_kunststoffe', label: 'Kunststoffe', icon: Package },
      { id: 'bp_mineralisch', label: 'Mineralische Werkstoffe', icon: Mountain },
      { id: 'bp_glaeser', label: 'Gläser & Fenster', icon: AppWindow },
      { id: 'bp_lehmbauprodukte', label: 'Lehmbauprodukte', icon: Leaf },
      { id: 'bp_metallisch', label: 'Metallische Werkstoffe', icon: Hammer },
      { id: 'bp_stahlbauprofile', label: 'Stahlbauprofile', icon: Columns },
    ]
  },
  {
    name: 'Betontechnologie',
    tabs: [
      { id: 'beton_info', label: 'Modulinfos', icon: Info },
      { id: 'beton_a_z', label: 'Beton A-Z', icon: BookOpen },
      { id: 'grundlagen', label: 'Grundlagen', icon: Layers },
      { id: 'bindemittel', label: 'Bindemittel', icon: Factory },
      { id: 'mischungsberechnung', label: 'Mischungsberechnung', icon: Calculator },
      { id: 'herstellung_einbau', label: 'Herstellung & Einbau', icon: Factory },
      { id: 'frischbeton', label: 'Frischbeton', icon: Waves },
      { id: 'hydratation_folgen', label: 'Hydratation & Folgen', icon: Network },
      { id: 'nachbehandlung', label: 'Nachbehandlung', icon: Droplets },
      { id: 'festbeton', label: 'Festbeton', icon: Box },
      { id: 'sichtbeton', label: 'Sichtbeton (SB 1–4)', icon: Eye },
      { id: 'sonderbetone', label: 'Sonderbetone', icon: Layers },
      { id: 'innovative_werkstoffe', label: 'Entwicklungen', icon: Layers },
      { id: 'qualitaetssicherung', label: 'Qualitätssicherung', icon: ClipboardCheck },
      { id: 'expositionsklassen', label: 'Expositionsklassen', icon: Grid },
      { id: 'betonpraxis', label: 'Betonpraxis', icon: ClipboardCheck },
    ]
  },
  {
    name: 'Massivbau',
    tabs: [
      { id: 'stahlbeton_info', label: 'Modulinfos', icon: Info },
      { id: 'stahlbeton_bemessung', label: 'Stahlbeton', icon: Calculator },
      { id: 'spannbeton', label: 'Spannbeton', icon: GitCommit },
      { id: 'wu-bauwerke', label: 'WU-Bauwerke (Weiße Wannen)', icon: Droplets },
      { id: 'carbonbeton', label: 'Carbonbeton', icon: Layers },
    ]
  },
  {
    name: 'Holzbau',
    tabs: [
      { id: 'holzbau_info', label: 'Modulinfos', icon: Info },
      { id: 'holzbau_werkstoffe', label: 'Werkstoffe & dataholz', icon: Trees },
      { id: 'holzbau_konstruktion', label: 'Konstruktionsweisen', icon: LayoutGrid },
      { id: 'holzbau_bemessung', label: 'Bemessung (EC5)', icon: Calculator },
      { id: 'holzbau_verbindung', label: 'Verbindungen & Anschlüsse', icon: GitCommit },
      { id: 'holzbau_bauphysik', label: 'Bauphysik & Brandschutz', icon: Flame },
    ]
  },
  {
    name: 'Innenausbau',
    tabs: [
      { id: 'innenausbau', label: 'Sammlung', icon: LayoutGrid },
    ]
  },
  {
    name: 'Mechanik',
    tabs: [
      { id: 'mechanik_info', label: 'Modulinfos', icon: Info },
      { id: 'mechanische_kenngroessen', label: 'Mechan. Kenngrößen', icon: Scale },
      { id: 'formaenderungen', label: 'Formänderungen', icon: Activity },
      { id: 'materialmodelle', label: 'Materialmodelle', icon: Activity },
      { id: 'emodul', label: 'E-Modul & Mikromechanik', icon: Activity },
      { id: 'festigkeit', label: 'Festigkeitsberechnungen', icon: TrendingUp },
      { id: 'baustatik', label: 'Baustatik', icon: Activity },
      { id: 'knicken', label: 'Knicken (Euler)', icon: TrendingUp },
      { id: 'bruchmechanik', label: 'Bruchmechanik', icon: ShieldAlert },
      { id: 'bodenmechanik', label: 'Bodenmechanik', icon: Mountain },
    ]
  },
  {
    name: 'Bauphysik',
    tabs: [
      { id: 'bauphysik_info', label: 'Modulinfos', icon: Info },
      { id: 'bauphysik', label: 'Bauphysik (Wärme & Feuchte)', icon: Thermometer },
      { id: 'waermeeigenschaften', label: 'Thermische Eigenschaften & Dämmstoffe', icon: Flame },
      { id: 'feuchteschutz', label: 'Feuchteschutz & Tauwasser', icon: Droplets },
      { id: 'daemmung_vergleich', label: 'Innendämmung vs. Außendämmung', icon: Thermometer },
      { id: 'schallschutz', label: 'Schallschutz', icon: Volume2 },
      { id: 'brandschutz', label: 'Brandschutz', icon: Flame },
      { id: 'energieausweis', label: 'Energieausweis', icon: FileCheck },
    ]
  },
  {
    name: 'Nachhaltigkeit',
    tabs: [
      { id: 'nachhaltigkeit_info', label: 'Modulinfos', icon: Info },
      { id: 'nachhaltigkeit_daten_regeln', label: 'Daten & Regeln', icon: Scale },
      { id: 'materialoptimierung', label: 'Materialoptimierung', icon: Leaf },
      { id: 'oekobilanz_lca', label: 'Ökobilanzierung (LCA)', icon: Leaf },
      { id: 'zertifizierung_siegel', label: 'Zertifizierung & Deklarationen', icon: Award },
      { id: 'kreislauf_dpp', label: 'Kreislaufwirtschaft', icon: RefreshCw },
      { id: 'ressourcen_umwelt', label: 'Ressourcen & Umwelt', icon: Factory },
      { id: 'lebenszyklus_kosten', label: 'Lebenszyklus & Kosten', icon: TrendingUp },
    ]
  },
  {
    name: 'Bauen im Bestand',
    tabs: [
      { id: 'bestand_info', label: 'Modulinfos', icon: Info },
      { id: 'bestand', label: 'Altbauatlas', icon: Building2 },
      { id: 'bauwerkserfassung', label: 'Bauwerkserfassung', icon: Compass },
      { id: 'denkmalpflege', label: 'Denkmalpflege', icon: Landmark },
      { id: 'modernisierung', label: 'Modernisierung & GEG', icon: RefreshCw },
      { id: 'bauwerksuntersuchung', label: 'Bauwerksdiagnose & ZfP', icon: Search },
      { id: 'historisch', label: 'Historische Kennwerte', icon: History },
      { id: 'historische_bauweisen', label: 'Hist. Bauweisen', icon: BookOpen },
      { id: 'historische_bauprodukte', label: 'Hist. Bauprodukte', icon: Layers },
      { id: 'bestand_checklisten', label: 'Checklisten', icon: ClipboardList },
    ]
  },
  {
    name: 'Rückbau & Schadstoffe',
    tabs: [
      { id: 'rueckbau_info', label: 'Modulinfos', icon: Info },
      { id: 'rueckbau', label: 'Rückbau & Material', icon: Recycle },
      { id: 'boden_materialaufbereitung', label: 'Boden- & Materialaufbereitung', icon: Recycle },
      { id: 'abfaelle', label: 'Abfälle & Altlasten', icon: Trash2 },
      { id: 'schadstoffe', label: 'Schad- und Gefahrstoffe', icon: AlertTriangle },
      { id: 'ressourceneffizienz', label: 'Ressourceneffizienz', icon: Leaf },
      { id: 'rueckbau_checklisten', label: 'Checklisten', icon: ClipboardList },
    ]
  },
  {
    name: 'Dauerhaftigkeit',
    tabs: [
      { id: 'dauerhaftigkeit_info', label: 'Modulinfos', icon: Info },
      { id: 'dauerhaftigkeit', label: 'Prinzipien & Übersicht', icon: ShieldAlert },
      { id: 'korrosion', label: 'Bewehrungskorrosion', icon: ShieldAlert },
      { id: 'schadreaktionen_beton', label: 'Betonkorrosion', icon: ShieldAlert },
      { id: 'holzkorrosion', label: 'Holzkorrosion', icon: ShieldAlert },
      { id: 'metallkorrosion', label: 'Metallkorrosion', icon: ShieldAlert },
      { id: 'weitere_organik', label: 'Weitere Organik', icon: Leaf },
      { id: 'dauerhaftigkeit_checklisten', label: 'Checklisten', icon: ClipboardList },
    ]
  },
  {
    name: 'Mängel & Schäden',
    tabs: [
      { id: 'schaeden_info', label: 'Modulinfos', icon: Info },
      { id: 'bauschaeden', label: 'Recht & Grundlagen', icon: FileWarning },
      { id: 'schadensbilder', label: 'Typische Bauschäden', icon: TrendingDown },
      { id: 'bauwerksunters_monitoring', label: 'Tragwerksmonitoring (SHM)', icon: Activity },
      { id: 'vdi6200', label: 'Zustandsbewertung', icon: ClipboardCheck },
      { id: 'material_schaeden_gross', label: 'Große Materialschäden & Einstürze', icon: AlertTriangle },
      { id: 'schaeden_checklisten', label: 'Schadensaufnahme-Checklisten', icon: ClipboardList },
    ]
  },
  {
    name: 'Schutz & Instandsetzung',
    tabs: [
      { id: 'instandsetzung_info', label: 'Modulinfos', icon: Info },
      { id: 'schutz_grundlagen', label: 'Schutz- & Instands.-Grundlagen', icon: Shield },
      { id: 'instandsetzung_materialien', label: 'Instandsetzung nach Material', icon: Layers },
      { id: 'instandhaltung', label: 'Stahlbetoninstandhaltung', icon: Wrench },
      { id: 'wta', label: 'WTA-Merkblätter', icon: FileText },
      { id: 'instandsetzung_checklisten', label: 'Instandsetzungs-Checklisten', icon: ClipboardList },
    ]
  },
  {
    name: 'Digitales',
    tabs: [
      { id: 'digitales_info', label: 'Modulinfos', icon: Info },
      { id: 'online_tools', label: 'Online-Tools & Rechner', icon: Globe },
      { id: 'bim_baustoffe', label: 'BIM für Baustoffe', icon: Monitor },
      { id: 'materialdatenbanken', label: 'Materialdatenbanken', icon: Search },
      { id: 'materialpaesse', label: 'Materialpässe', icon: FileText },
      { id: 'dpp', label: 'Digitaler Produktpass (DPP)', icon: QrCode },
    ]
  },
  {
    name: 'KI im Bauwesen',
    tabs: [
      { id: 'ki_ueberblick', label: 'Überblick & Grundlagen', icon: Sparkles },
      { id: 'ki_system', label: 'Systemarchitektur', icon: Cpu },
      { id: 'ki_prompting', label: 'Prompting-Praxis', icon: Sparkles },
      { id: 'ki_llmpraxis', label: 'LLM-Praxis', icon: Terminal },
      { id: 'ki_thesen', label: 'Tools für Thesen', icon: BookOpen },
      { id: 'ki_recht_ethik', label: 'Fehler, Recht & Ethik', icon: ShieldAlert },
      { id: 'ki_lokal', label: 'Lokale KI (LM Studio)', icon: Server },
      { id: 'ki_ressourcen', label: 'Unabhängige KI-Seiten', icon: Compass },
      { id: 'ki_onlinekurse', label: 'Onlinekurse', icon: Video },
    ]
  },
  {
    name: 'Praxiswissen',
    tabs: [
      { id: 'praxiswissen_info', label: 'Modulinfos', icon: Info },
      { id: 'px_planung', label: 'Planung & Ausschreibung', icon: ClipboardCheck },
      { id: 'px_bauleitung', label: 'Bauleitung & Baustelle', icon: Wrench },
      { id: 'px_bautagebuch', label: 'Bautagebuch', icon: ClipboardList },
      { id: 'px_produktion', label: 'Produktherstellung & QS', icon: Factory },
      { id: 'px_karriere', label: 'Karrierestart & Soft Skills', icon: GraduationCap },
    ]
  },
  {
    name: 'Infos & Quellen',
    tabs: [
      { id: 'software', label: 'Software & Tools', icon: Monitor },
      { id: 'glossar', label: 'Glossar', icon: BookOpen },
      { id: 'fortbildungen', label: 'Fortbildungen', icon: Award },
      { id: 'informationsquellen', label: 'Informationsquellen', icon: Box },
      { id: 'literatur', label: 'Literatur', icon: BookOpen },
    ]
  },
  {
    name: 'Kuriositäten',
    tabs: [
      { id: 'kuriositaeten', label: 'Kuriositäten & Rekorde', icon: Sparkles }
    ]
  },
  {
    name: 'Studium THA',
    tabs: [
      { id: 'studium_tha', label: 'Portal app.tha.de', icon: Globe },
    ]
  },
  {
    name: 'Weiter@THA',
    tabs: [
      { id: 'weiter_tha', label: 'Alle Studienangebote', icon: Layers },
      { id: 'weiter_bauing', label: 'Master Bauingenieurwesen', icon: GraduationCap },
      { id: 'weiter_pm', label: 'Master Projektmanagement', icon: BookOpen },
      { id: 'weiter_ausbau', label: 'Fachingenieur Ausbau', icon: Award },
      { id: 'weiter_fassade', label: 'Fachingenieur Fassade', icon: LayoutGrid },
      { id: 'weiter_holzbau', label: 'Fachingenieur Holzbau', icon: Trees },
      { id: 'weiter_ttz', label: 'TTZ Aichach (digital. Holzbau)', icon: Sparkles },
      { id: 'weiter_mapr', label: 'MAPR (Applied Research)', icon: GraduationCap },
    ]
  },
  {
    name: 'Thesen & Projekte',
    tabs: [
      { id: 'thesen_projekte', label: 'Thesen & Semesterprojekte', icon: FileText }
    ]
  },
  {
    name: 'Übungsaufgaben',
    tabs: [
      { id: 'aufgaben_trainer', label: 'Dynamischer Prüfungs-Trainer', icon: Calculator },
      { id: 'aufgaben_komplex', label: 'Bauforensik & Fallstudien', icon: Search },
      { id: 'aufgaben_quiz', label: 'Wissenscheck & Wissenslücken', icon: GraduationCap },
      { id: 'aufgaben_beton', label: 'Betontechnologie', icon: BookOpen },
      { id: 'aufgaben_stahlbeton', label: 'Massivbau', icon: BookOpen },
      { id: 'aufgaben_holzbau', label: 'Holzbau', icon: BookOpen },
      { id: 'aufgaben_weitere', label: 'Baustoffe', icon: BookOpen },
      { id: 'aufgaben_bauprodukte', label: 'Bauprodukte & Baurecht', icon: BookOpen },
      { id: 'aufgaben_mechanik', label: 'Mechanik', icon: BookOpen },
      { id: 'aufgaben_bauphysik', label: 'Bauphysik', icon: BookOpen },
      { id: 'aufgaben_nachhaltigkeit', label: 'Nachhaltigkeit', icon: BookOpen },
      { id: 'aufgaben_bestand', label: 'Bauen im Bestand', icon: BookOpen },
      { id: 'aufgaben_dauerhaftigkeit', label: 'Dauerhaftigkeit & Schäden', icon: BookOpen },
      { id: 'aufgaben_rueckbau', label: 'Rückbau & Schadstoffe', icon: BookOpen },
      { id: 'aufgaben_kennwerte', label: 'Labor & Grundlagen', icon: BookOpen },
      { id: 'aufgaben_digitales', label: 'Digitales, BIM & KI', icon: BookOpen },
    ]
  },
  {
    name: 'Beispielrechnungen',
    tabs: [
      { id: 'rechnung_u_wert', label: 'Bauphysik: U-Wert', icon: Layers },
      { id: 'rechnung_beton', label: 'Beton: Mischungsentwurf', icon: BookOpen },
      { id: 'rechnung_stahlbeton', label: 'Massivbau: Biegung', icon: Sliders },
      { id: 'rechnung_holzbau', label: 'Holzbau: Stützenknicken', icon: Scale },
      { id: 'rechnung_mauerwerk', label: 'Mauerwerk: Tragfähigkeit', icon: Settings },
      { id: 'rechnung_nachhaltigkeit', label: 'Nachhaltigkeit & Dauerhaftigkeit', icon: Leaf },
      { id: 'rechnung_bestand', label: 'Bauen im Bestand', icon: History },
      { id: 'rechnung_schallschutz', label: 'Bauakustik: Schallschutz', icon: Volume2 },
      { id: 'rechnung_brandschutz', label: 'Brandschutz: Heißbemessung', icon: Flame },
    ]
  },
  {
    name: 'Vorlesungen',
    tabs: [
      { id: 'vl_bauen_im_bestand', label: 'Bauen im Bestand (VL)', icon: Building2 },
      { id: 'vl_nachhaltiges_bauen', label: 'Nachhaltiges Bauen (VL)', icon: Leaf },
      { id: 'vl_bauschaeden', label: 'Bauschäden (VL)', icon: AlertTriangle },
      { id: 'vl_baustoffkunde', label: 'Baustoffkunde (VL)', icon: Layers },
      { id: 'vl_instandhaltung', label: 'Instandhaltung (VL)', icon: Wrench },
    ]
  },
  {
    name: 'Baustofflabor',
    tabs: [
      { id: 'labor_sicherheit', label: 'Laborsicherheit', icon: ShieldAlert },
    ]
  }
] as const;

const TAB_KEYWORDS: Record<string, string[]> = {
  // Allgemein
  start: ['startseite', 'home', 'willkommen', 'übersicht', 'begrüßung', 'huber', 'augsburg', 'portal'],
  anleitung: ['bedienung', 'hilfe', 'anleitung', 'dokumentation', 'rechner', 'handbuch', 'nutzung'],
  modulstruktur: ['mindmap', 'struktur', 'übersicht', 'begriffe', 'fachreiter', 'rechner', 'module', 'verzeichnis', 'themen'],
  feedback: ['bewertung', 'evaluierung', 'meinung', 'fehler', 'fehlerbericht', 'kontakt', 'nachricht'],
  versionen: ['changelog', 'historie', 'updates', 'revisionen', 'neuigkeiten', 'versionen', 'v1.6.0', 'upgrades'],
  impressum: ['kontakt', 'rechtliches', 'ansprechpartner', 'hochschule', 'augsburg', 'haftung', 'impressum'],
  datenschutz: ['datenschutz', 'dsgvo', 'privacy', 'cookies', 'server', 'hosting', 'gaesa', 'daten'],

  // Grundlagen
  grundlagen_info: ['grundlagen', 'einführung', 'info', 'baustoffe', 'werkstoffe', 'werkstoffkunde', 'material'],
  baustoffkunde: ['baustoffkunde', 'historie', 'geschichte', 'systematik', 'entwicklung', 'antike', 'römischer beton', 'ziegel', 'materialkunde', 'wissenschaft', 'klassifizierung'],
  einheiten: ['einheiten', 'scale', 'maßeinheiten', 'umrechnung', 'si-einheiten', 'präfixe', 'dimension', 'rechner', 'umrechner'],
  materialkennwerte: ['materialkennwerte', 'rohdichte', 'druckfestigkeit', 'wärmeleitfähigkeit', 'e-modul', 'kennwerte', 'tabelle', 'werte'],
  baustoffkenngroessen: ['kenngrößen', 'porosität', 'rohdichte', 'reindichte', 'festigkeit', 'wasseraufnahme', 'dichte', 'poren', 'kriechen', 'schwinden'],
  bauchemie: ['chemie', 'minerale', 'reaktion', 'silicate', 'kristall', 'säure', 'alkali', 'ph-wert', 'reaktionen'],
  sicherheitskonzept: ['eurocode', 'sicherheit', 'teilsicherheitsbeiwerte', 'lastannahmen', 'tragsicherheit', 'nachweis', 'normalspannungen', 'bemessung'],
  regularien: ['normen', 'din', 'en', 'iso', 'regelwerke', 'gesetze', 'vob', 'bauordnung', 'richtlinien', 'abz', 'dibt'],

  // Labor
  labor_sicherheit: ['sicherheit', 'labor', 'baustofflabor', 'psa', 'schutzbrille', 'sicherheitsschuhe', 'notfall', 'ersthelfer', 'hubervorlesung', 'gefahrstoffe', 'lechner', 'sedlmeier', 'g2', 'brandschutz', 'not-aus', 'betriebsanweisung'],
  labor_info: ['prüftechnik', 'prüfstand', 'labor', 'untersuchung', 'verfahren', 'prüflabor'],
  probenahme: ['bohrkern', 'probekörper', 'erkundung', 'aufmaß', 'entnahme', 'prüfung', 'probenahme', 'kernbohrung'],
  messen_pruefen: ['messtechnik', 'prüfung', 'sensoren', 'dms', 'dehnungsmessstreifen', 'laser', 'sensorik', 'messgeräte'],
  analytik: ['mikroskop', 'röntgen', 'chemische analysen', 'tga', 'dsc', 'phasenanalyse', 'röntgendiffraktometrie', 'xrd'],
  mechanische_pruefungen: ['zugversuch', 'druckversuch', 'biegezug', 'mechanik', 'prüfmaschine', 'druckprüfmaschine', 'versuchsaufbau'],
  labor: ['virtuelle versuche', 'simulation', 'ausbreitversuch', 'e-modul', 'versuch', 'prüfstand', 'interaktiv', 'betonversuch', 'rütteltisch'],
  statistik: ['datenanalyse', 'normalverteilung', 'gauß', 'standardabweichung', 'mittelwert', 'varianz', 'regression', 'student-t'],
  festbeton_statistik: ['konformität', 'statistische bewertung', 'festbeton', 'druckfestigkeitsklassen', 'en 206', 'charakteristische festigkeit'],

  // Baustoffe (Mineralische)
  gesteine: ['naturstein', 'granit', 'kalkstein', 'sandstein', 'basalt', 'petrographie', 'eruptiv', 'sediment', 'metamorph'],
  mauerwerk: ['ziegel', 'kalksandstein', 'porenbeton', 'mauerstein', 'tragfähigkeit', 'mörtel', 'bimsstein', 'klinker'],
  putzemoertel: ['putz', 'mörtel', 'mauermörtel', 'putzmörtel', 'bindemittel', 'innenputz', 'außenputz', 'werkfrisch', 'estrich'],
  gips: ['calciumsulfat', 'gipskarton', 'estrich', 'anhydrit', 'stukkateur', 'gipsputz', 'alabaster', 'halbhydrat'],
  kalk: ['luftkalk', 'gelöschter kalk', 'putze', 'hydraulischer kalk', 'kalkhydrat', 'branntkalk', 'calciumcarbonat'],
  lehm: ['stampflehm', 'lehmstein', 'lehmputz', 'ökologisch', 'zirkulär', 'lehmbau', 'tonminerale', 'strohlehm'],
  erdbau: ['boden', 'bodenmechanik', 'sieblinie', 'korngrößen', 'verdichtung', 'proctor', 'atterberg', 'konsistenz'],
  glas: ['flachglas', 'esg', 'vsg', 'floatglas', 'glaskorrosion', 'spannungsgalerie', 'kieselsäure', 'bruchbild'],

  // Metalle
  stahl: ['baustahl', 'bewehrung', 'reißlänge', 'streckgrenze', 'zugfestigkeit', 'fe-c-diagramm', 'elastomechanisch', 'kohlenstoff', 'plastizität'],
  metalle: ['aluminium', 'kupfer', 'zink', 'korrosion', 'legierung', 'nichteisen', 'blei', 'titan', 'messing'],

  // Organische
  holz: ['nadelholz', 'laubholz', 'holzfeuchte', 'anisotropie', 'fasersättigung', 'pilzbefall', 'lignin', 'zellulose', 'quellung'],
  holzwerkstoffe: ['bsh', 'kvh', 'sperrholz', 'spanplatte', 'mdf', 'osb', 'verleimung', 'furnier', 'leimholz'],
  asphalt: ['bitumen', 'nadelpenetration', 'ring und kugel', 'ruk', 'straßenbau', 'psv', 'luftporenvolumen', 'erweichungspunkt', 'mischgut'],
  kunststoffe: ['polymere', 'pvc', 'pe', 'pp', 'epoxidharz', 'duromere', 'elastomere', 'thermoplaste', 'makromoleküle', 'pu', 'silikon'],

  // Sonstige
  materialitaet_architektur: ['materialität', 'architektur', 'haptik', 'oberfläche', 'licht', 'reflexion', 'patina', 'ästhetik', 'sichtbeton', 'entwurf', 'textur', 'schalung', 'fuge'],
  daemmstoffe: ['styropor', 'mineralwolle', 'pur', 'pir', 'zellulose', 'hanf', 'stroh', 'vakuum', 'wärmedämmung', 'wlg'],
  ausbau: ['abdichtung', 'bitumenbahn', 'epoxidharz', 'estrich', 'abdichtungsnormen', 'din 18533', 'feuchtigkeit', 'folie'],
  faserverbund: ['carbon', 'gfk', 'cfk', 'glasfaser', 'kohlefaser', 'matrix', 'epoxid', 'laminat', 'webart'],

  // Bauprodukte Recht
  bp_recht_grundlagen: ['ce-kennzeichnung', 'ü-zeichenträger', 'mvv tb', 'landesbauordnung', 'mbo', 'abz', 'allgemeine bauaufsichtliche zulassung', 'leistungserklärung'],
  bp_recht_avcp: ['leistungsbeständigkeit', 'system 1', 'system 3', 'system 4', 'überwachung', 'notified body', 'konformitätsbewertung'],
  bp_recht_konformitaet: ['werkseigene produktionskontrolle', 'wpk', 'zertifikat', 'übereinstimmungserklärung', 'fremdüberwachung', 'audit'],
  bp_recht_normen: ['normung', 'din-ausschuss', 'cen', 'en-normen', 'harmonisierte normen', 'beuth', 'normenentwurf'],

  // Bauprodukte Rohbau
  bp_beton: ['frischbeton', 'festbeton', 'transportbeton', 'konsistenzklassen', 'druckfestigkeitsklassen', 'expositionsklassen', 'en 206'],
  bp_betonfertigteile: ['fertigteilwerk', 'spannung', 'hohldielen', 'elementdecken', 'stützen', 'binder', 'fassadenplatten'],
  bp_betonwaren: ['pflastersteine', 'bordsteine', 'gehwegplatten', 'schachtringe', 'palisaden', 'pflaster'],
  bp_mauerwerk: ['mauerziegel', 'planstein', 'blockstein', 'ks-stein', 'porenbetonstein', 'leichtbetonstein', 'mörtel', 'dünnbettmörtel'],
  bp_verkehr_rsto: ['straßenbau', 'asphaltbeton', 'rsto', 'rsto 12', 'oberbau', 'tragdeckschicht', 'schotter', 'frostschutzschicht', 'tragschicht', 'belastungsklasse', 'bk', 'oberbaurechner'],
  bp_verkehr_asphalt: ['asphaltsorten', 'asphaltbeton', 'splittmastix', 'gussasphalt', 'flüsterasphalt', 'deckschicht', 'binderschicht'],
  bp_verkehr_bitumen: ['bitumen', 'bindemittel', 'psv', 'psv-gesteine', 'polierresistenz', 'steinbruch', 'mineralstoff', 'kornform'],
  bp_verkehr_pruefung: ['hohlraumgehalt', 'marshall-stabilität', 'marshall', 'probekörper', 'spurbildungsversuch', 'wheel-tracking', 'prüftechnik', 'labor'],
  bp_verkehr_betondecken: ['betondecken', 'straßendecken', 'ztv beton', 'ztv beton-stb', 'rlao', 'fugen', 'dübel', 'anker', 'westergaard', 'alkali-kieselsäure-reaktion', 'akr', 'betonkrebs', 'luftporen', 'lp-beton', 'waschbeton'],
  bp_verkehr_tiefbau: ['tiefbau', 'entwässerung', 'drainage', 'regenwasser', 'abwasser', 'kanal', 'schacht', 'kanalisation', 'rigolen', 'rinnen', 'geotextil', 'kabelschutz', 'hangbefestigung', 'funktionspflaster', 'retention', 'abwasserrohre'],
  bp_verkehr_bahn: ['bahnbau', 'gleisschotter', 'feste fahrbahn', 'slab track', 'schienenprofil', 'uic 60', 'lue-schiene', 'gleiskörper'],
  bp_verkehr_tunnel: ['tunnelbau', 'vortrieb', 'natm', 'spritzbeton', 'ortsbrust', 'ankerung', 'gebirgsdruck', 'tbm', 'tunnelrechner'],
  bp_dach_fassade: ['dachziegel', 'trapezblech', 'vorhangfassade', 'wdvs', 'dachbahn', 'dachpfanne', 'sandwichpaneel'],

  // Bauprodukte Innenausbau
  innenausbau: ['innenausbau', 'trockenbau', 'gipskarton', 'estrich', 'putz', 'gipsfaser', 'ständerwerk', 'unterdecke', 'trittschall', 'belegreife', 'din 18181', 'din 18560'],
  bp_trockenbau: ['gipsplatte', 'ständerwerk', 'schallschutzwand', 'trockenbauwand', 'gipskarton', 'profil', 'trockenbauplatte', 'gipsbau'],
  bp_putz_estrich: ['fließestrich', 'zementestrich', 'kalk-gips-putz', 'sanierputz', 'grundputz', 'oberputz', 'calciumsulfatestrich'],

  // Bauprodukte Schutz & Dämmung
  bp_abdichtung: ['bauwerksabdichtung', 'bahn', 'flüssigkunststoff', 'pmbc', 'kellerabdichtung', 'abdichtungsbahn', 'kmb', 'weisse wanne', 'fugenbänder', 'fugenband', 'injektionsschlauch', 'injektionsschläuche', 'fugen'],
  bp_daemmung: ['eps', 'xps', 'steinwolle', 'glaswolle', 'vakuumdämmung', 'polyurethan', 'holzfaser', 'mineralwolle'],

  // Bauprodukte Verbindung
  bp_befestigung: ['dübel', 'ankerbolzen', 'schrauben', 'nagel', 'schwerlastanker', 'injektionsmörtel', 'hinterschnitt'],
  bp_klebstoffe: ['silikon', 'acrylat', 'pu-schaum', 'sekundenkleber', 'fliesenkleber', 'polyurethan', 'dichtstoff'],
  bp_farben_lacke: ['dispersionsfarbe', 'grundierung', 'korrosionsschutzlack', 'lasur', 'pigment', 'acryllack', 'silikatfarbe', 'anstrich'],
  bp_betonzusatzmittel: ['fließmittel', 'verzögerer', 'beschleuniger', 'luftporenbildner', 'lpb', 'verzögerung', 'dichtungsmittel', 'fm'],

  // Bauprodukte Werkstoff
  bp_holzprodukte: ['konstruktionsvollholz', 'kvh', 'brettschichtholz', 'bsh', 'stegträger', 'schichtholz', 'brettsperrholz', 'clt'],
  bp_kunststoffe: ['pvc-rohre', 'bodenbelag', 'profil', 'dichtungsbahn', 'wellplatte', 'eps-platten', 'kanalrohr'],
  bp_mineralisch: ['porenbeton', 'kalksandstein', 'ziegel', 'naturstein', 'faserzement', 'betonwaren'],
  bp_glaeser: ['gläser', 'fenster', 'fensterarten', 'floatglas', 'esg', 'vsg', 'tvg', 'isolierglas', 'scheibenaufbau', 'beschichtung', 'bedampfung', 'low-e', 'gasfüllung', 'argon', 'krypton', 'warme kante', 'uw-wert', 'ug-wert', 'sonnenschutzglas', 'vakuumglas', 'kunststofffenster', 'holzfenster', 'holz-alu', 'din 18008', 'din en 1279', 'absturzsichernd'],
  bp_lehmbauprodukte: ['lehmstein', 'lehmputzmörtel', 'stampflehmmischung', 'lehmbauplatte', 'leichtlehm', 'lehmbau', 'feinputz'],
  bp_baustoffindustrie: ['zementindustrie', 'marmor', 'kalkstein', 'ziegelwerke', 'schwenk', 'märke', 'bbs', 'bundesverband', 'baustoffindustrie', 'transformation', 'dekarbonisierung'],
  bp_innovationen: ['innovationen', 'trl', 'technology readiness level', 'forschung', 'entwicklung', 'fue', 'f&e', 'carbonbeton', 'geopolymer', 'myzel', 'biobeton', 'ccu', 'dibt', 'abz', 'abg', 'eta', 'zie', 'zukunft bau', 'zim'],
  bp_metallisch: ['aluminiumprofile', 'kupferblech', 'titanzink', 'messing', 'edelstahl', 'blech', 'eloxiert'],
  bp_stahlbauprofile: ['hea', 'heb', 'ipe', 'u-profil', 'hohlprofil', 'winkelstahl', 'doppel-t-träger', 'breitflanschträger'],

  // Betontechnologie
  beton_info: ['betoninfo', 'zement', 'frischbeton', 'festbeton', 'technologie', 'wasserzementwert'],
  beton_a_z: ['lexikon', 'alphabet', 'suchbegriffe', 'glossar', 'betonbegriffe', 'wörterbuch', 'begriffserklärung'],
  grundlagen: ['zement', 'wasser', 'gestein', 'zusatzstoffe', 'zusatzmittel', 'kornzusammensetzung', 'sieblinie'],
  bindemittel: ['zementart', 'klinker', 'hüttenmehl', 'puzzolan', 'gips', 'hydration', 'portlandzement', 'cem i', 'cem ii', 'cem iii'],
  mischungsberechnung: ['stoffraumrechnung', 'rezeptur', 'wasseranspruch', 'kornverteilung', 'sieblinie', 'stoffraum', 'kalkulation'],
  herstellung_einbau: ['mischer', 'transport', 'förderung', 'rütteln', 'verdichten', 'fallhöhe', 'kübel', 'fahrmischer'],
  frischbeton: ['ausbreitmaß', 'setzmaß', 'scheinbare viskosität', 'bluten', 'konsistenz', 'verdichtungsmaß', 'luftporen', 'trichterversuch'],
  hydratation_folgen: ['hydratationswärme', 'erwärmung', 'tga', 'phasenneubildung', 'aluminat', 'schwinden', 'erstarren', 'rissrisiko'],
  nachbehandlung: ['verdunstungsschutz', 'folie', 'wassernebel', 'sprühen', 'reifezeit', 'curing', 'nachbehandlungsmittel'],
  festbeton: ['druckspannung', 'e-modul', 'spaltzugfestigkeit', 'rohdichte', 'porenstruktur', 'biegezugfestigkeit', 'zerstörungsfreie prüfung'],
  sonderbetone: ['uhpc', 'leichtbeton', 'svb', 'scc', 'faserbeton', 'inkjetbeton', 'schwerbeton', 'hochfest', 'ultrahochfest', 'spritzbeton'],
  innovative_werkstoffe: ['geopolymere', 'carbonbeton', 'selbstheilender beton', 'bakterien', 'nachhaltig', 'innovativ', '3d-druck', 'inkjet'],
  qualitaetssicherung: ['werkseigene produktionskontrolle', 'überwachung', 'lieferscheine', 'baustellenprüfung', 'konformitätskontrolle', 'prüfkörper'],
  expositionsklassen: ['expositionsklassen', 'din 1045-2', 'en 206', 'xc', 'xd', 'xs', 'xf', 'xa', 'xm', 'w-klassen', 'betondeckung', 'mindestdruckfestigkeit', 'w/z-wert', 'folgen'],
  betonpraxis: ['schalung', 'bewehrungseinbau', 'betonierfehler', 'kiesnester', 'abplatzungen', 'praktisch', 'baustelle', 'fallbeispiel'],

  // Stahlbetonbau
  stahlbeton_info: ['stahlbetonbau', 'bewehrung', 'tragwirkung', 'verbundwerkstoff', 'betonstahl'],
  stahlbeton_bemessung: ['stahlbeton', 'bauteilbemessung', 'bemessung', 'biegebemessung', 'querkraftbemessung', 'stützenbemessung', 'durchstanzen', 'verankerungslänge', 'rissbreite', 'eurocode 2', 'ec2'],
  rissbreite: ['rissbreitenbegrenzung', 'risse', 'spannung', 'rissbreitenrechner', 'dehnung', 'mindestbewehrung', 'risserechner'],
  spannung: ['spannungs-dehnungs-linie', 'arbeitslinie', 'elastisch', 'plastisch', 'parabel-rechteck-diagramm', 'fließgrenze', 'hooke'],
  biegebemessung: ['biegebemessungsrechner', 'gzt', 'tragfähigkeit', 'm_ed', 'balken', 'plattenbalken', 'randspannung'],
  querkraftbemessung: ['schub', 'schräge risse', 'bügel', 'querkraftwiderstand', 'v_ed', 'schubspannung'],
  stuetzenbemessung: ['stützen', 'druckglied', 'knicken', 'bewehrungsgrad', 'n_ed', 'stützenrechner'],
  durchstanzen: ['flachdecke', 'punktförmige stütze', 'durchstanzkegel', 'durchstanzbewehrung', 'stützenkopf', 'decke'],
  verankerungslaenge: ['verbundspannung', 'übergreifungslänge', 'endhaken', 'verbundbereich', 'bewehrungsstoß', 'stahl'],
  spannbeton: ['vorspannung', 'spannglieder', 'verbund', 'spannkraft', 'kriechen und schwinden', 'spannkanal'],
  'wu-bauwerke': ['wasserundurchlässig', 'fugenband', 'rissbreitenbeschränkung', 'druckwasserdicht', 'keller', 'wasserwände', 'weisse wanne', 'wu-bauwerk'],
  carbonbeton: ['textilbeton', 'kohlefaser', 'gittergelege', 'korrosionsfrei', 'dünnwandig', 'carbonbewehrung', 'verstärkung'],

  // Holzbau
  holzbau_info: ['holzbau', 'informationsdienst', 'dataholz', 'institut holzbau', 'baustoff', 'nachhaltiges bauen'],
  holzbau_werkstoffe: ['nadelholz', 'laubholz', 'bsh', 'kvh', 'clt', 'brettsperrholz', 'dataholz', 'holzwerkstoffe', 'festigkeitsklasse', 'c24', 'gl24c'],
  holzbau_konstruktion: ['holzrahmenbau', 'massivholzbau', 'holztafelbau', 'framework', 'sargdeckel', 'deckenkonstruktion', 'ständerwerk'],
  holzbau_bemessung: ['eurocode 5', 'din en 1995', 'kmod', 'nutzungsklasse', 'kled', 'buckling', 'biegebeanspruchung', 'knickbeiwert', 'holzbau bemessung'],
  holzbau_verbindung: ['holzschrauben', 'stabdübel', 'nägel', 'bolzen', 'stahlblech', 'verbindungsmittel', 'scherbeanspruchung'],
  holzbau_bauphysik: ['holz brandschutz', 'schallschutz holzbau', 'abbrandrate', 'kohlung', 'akustik', 'schwingung', 'entkopplung'],

  // Mechanik
  mechanik_info: ['konstruktionsmechanik', 'elastostatik', 'tragverhalten', 'mechanische beanspruchung'],
  mechanische_kenngroessen: ['mechanische kenngrößen', 'mechanische kennwerte', 'spannung', 'dehnung', 'e-modul', 'hooke', 'dehnsteifigkeit', 'biegesteifigkeit', 'ea', 'ei', 'kriechen', 'schwinden', 'relaxation', 'poissonzahl', 'querdehnung', 'mechanik', 'normalkraftsteifigkeit'],
  formaenderungen: ['elastizität', 'verformung', 'biegelinie', 'durchbiegungsrechner', 'durchbiegung', 'winkel', 'momentenfläche', 'integration'],
  materialmodelle: ['elastoplastisch', 'viskoelastisch', 'ideal-plastisch', 'rheologie', 'feder', 'dämpfer', 'maxwell', 'kelvin'],
  emodul: ['elastizitätsmodul', 'steigung', 'steifigkeit', 'hooke', 'elastisch', 'dehnung', 'druckversuch', 'zugversuch'],
  festigkeit: ['spannungsnachweis', 'normalspannung', 'schubspannung', 'hauptspannungen', 'mohrscher kreis', 'festigkeitshypothese'],
  baustatik: ['statik', 'auflagerkräfte', 'schnittgrößen', 'momentenverlauf', 'querkraftverlauf', 'normalkraft', 'fachwerk', 'träger'],
  knicken: ['stabilität', 'knicklast', 'euler-fälle', 'schlankheitsgrad', 'knickrechner', 'stab', 'knicken'],
  bruchmechanik: ['rissspitze', 'spannungsintensität', 'bruchzähigkeit', 'kio', 'sprödbruch', 'rissausbreitung', 'griffith'],
  bodenmechanik: ['erdruck', 'scherfestigkeit', 'kohäsion', 'setzungsrechner', 'durchlässigkeit', 'porendruck', 'terzaghi'],

  // Bauphysik
  bauphysik_info: ['bauphysik', 'wärme', 'feuchte', 'schall', 'brand'],
  bauphysik: ['u-wert', 'wärmeverlust', 'feuchteschutz', 'u-wert-rechner', 'wärmeschutz', 'tauwasser'],
  waermeeigenschaften: ['wärmeleitfähigkeit', 'wärmekapazität', 'dämmstoffdicke', 'speicherung', 'auskühlung'],
  feuchteschutz: ['glaser-verfahren', 'taupunkt', 'kondenswasser', 'relative feuchte', 'dampfdiffusion', 'absperrung'],
  daemmung_vergleich: ['innendämmung', 'außendämmung', 'wärmebrücke', 'schimmelpilz', 'tauwassergefahr', 'vorteile', 'nachteile'],
  schallschutz: ['luftschall', 'trittschall', 'schalldämmmaß', 'massegesetz', 'schallbrücke', 'absorber', 'dezibel'],
  brandschutz: ['feuerwiderstandklasse', 'f30', 'f90', 'brandverhalten', 'baustoffklasse', 'a1', 'b1', 'rauchausbreitung', 'fluchtwege'],
  energieausweis: ['energiebedarf', 'verbrauchsausweis', 'bedarfsausweis', 'primärkapazität', 'geg', 'gefertigtes gebäude', 'effizienzklasse', 'din v 18599', 'endenergie', 'primärenergie', 'nutzwärme', 'heizwärmebedarf', 'referenzgebäude'],

  // Nachhaltigkeit
  nachhaltigkeit_info: ['nachhaltigkeit', 'ressourceneffizienz', 'co2-abdruck', 'umweltschutz'],
  nachhaltigkeit_daten_regeln: ['daten und regeln', 'sdg', 'taxonomie', 'epbd', 'klimakonferenzen', 'thg', 'abfallaufkommen', 'stoffströme', 'epd', 'dpp', 'materialpass', 'digitaler produktpass', 'gebäudetyp e', 'ebv', 'geg', 'qng'],
  materialoptimierung: ['klinkerreduktion', 'rc-zuschlag', 'binderoptimierung', 'co2-minimierung', 'ressourceneffizienter beton', 'dafstb', 'daftst', 'treibhausgasoptimierte tragwerke', 'thg-optimierung', 'richtlinie'],
  oekobilanz_lca: ['gwp', 'odp', 'ap', 'pocp', 'pe-gesamt', 'lebenszyklussimulator', 'ökobilanz', 'bauteile', 'co2-bilanz', 'rechtsrahmen', 'baupvo', 'green deal', 'eu klimagesetz', 'fit for 55', 'epbd', 'cbam', 'espr', 'crrem', 'nachhaltigkeit', 'regulatorik'],
  zertifizierung_siegel: ['epd', 'dgnb', 'leed', 'breeam', 'csc', 'umweltproduktdeklaration', 'zertifizierungssysteme'],
  kreislauf_dpp: ['urban mining', 'recycling', 'rückbaubarkeit', 'zirkularität', 'stoffkreislauf', 'madaster', 'demontage'],
  ressourcen_umwelt: ['primärrohstoffe', 'rohstoffabbau', 'bodenaushub', 'wasserverbrauch', 'graue energie', 'landverbrauch'],
  lebenszyklus_kosten: ['lcc', 'lebenszykluskosten', 'instandhaltungskosten', 'investitionskosten', 'kapitalbarwert', 'barwertrechner'],

  // Digitales
  digitales_info: ['digitalisierung', 'it-im-bauwesen', 'software', 'datenmodelle'],
  online_tools: ['online-tools', 'webrechner', 'onlinerechner', 'skyciv', 'mastan2', 'dlubal', 'eurocodeapplied', 'ubakus', 'therm', 'oekobaudat', 'ec3', 'openlca', 'openbim', 'thatopen', 'geoportal', 'statikrechner'],
  bim_baustoffe: ['revit', 'archicad', 'ifc', 'bauteilbibliothek', 'attribuierung', 'informationsgehalt', 'lod'],
  materialdatenbanken: ['ökobaudat', 'baubook', 'materialarchiv', 'datenbank', 'werteabfrage', 'schnittstelle'],
  materialpaesse: ['ressourcenpass', 'gebäude-materialpass', 'materialinventar', 'kreislaufpass', 'gebäudepass'],
  dpp: ['qr-code', 'rfid', 'produktpass', 'rückverfolgbarkeit', 'chargennummer', 'herstellernachweis'],
  ki_baustoffe: ['künstliche intelligenz', 'prompting', 'agenten', 'machine learning', 'llm', 'chatgpt', 'claude', 'perplexity', 'gemini', 'ki', 'ai'],
  ki_ueberblick: ['überblick', 'grundlagen', 'historie', 'stand', 'ausblick', 'ml', 'rag', 'llm', 'deep learning', 'vision', 'agenten', 'einführung'],
  ki_system: ['künstliche intelligenz', 'machine learning', 'llm', 'chatgpt', 'claude', 'perplexity', 'gemini', 'ki', 'ai', 'systemarchitektur', 'knn', 'rag', 'lokal'],
  ki_prompting: ['prompting-praxis', 'prompting', 'optimierer', 'ingenieur-prompts', 'llm'],
  ki_llmpraxis: ['llm-praxis', 'claude', 'chatgpt', 'skills', 'konnektoren', 'mcp', 'markdown', 'verzeichnisse', 'browser', 'web-grounding', 'claudemd', 'system prompt', 'artifacts', 'custom gpt', 'mcp-server', 'bauingenieur-prompt'],
  ki_thesen: ['tools für thesen', 'bachelorarbeit', 'masterarbeit', 'elicit', 'connected papers', 'deep research', 'notebooklm', 'overleaf', 'scite', 'consensus', 'cursor', 'literaturrecherche', 'ki-deklaration'],
  ki_recht_ethik: ['fehler', 'anwendungsgrenzen', 'recht', 'ethik', 'haftung', 'bgb', 'hoai', 'eu ai act', 'halluzination', 'urheberrecht', 'dsgvo', 'prüfpflicht', 'risikokalkulator'],
  ki_lokal: ['lokale ki', 'lm studio', 'ollama', 'offline', 'gguf', 'quantisierung', 'vram', 'rtx', 'qwen', 'llama', 'deepseek', 'datensouveränität', 'gpu offload'],
  ki_ressourcen: ['ki-ressourcen', 'hugging face', 'ai valley', 'datenbanken', 'links'],
  ki_onlinekurse: ['onlinekurse', 'youtube', 'video-lernpfad', 'python lernen', 'felix schweilm', 'morpheus', 'statquest', 'florian dahlitz', 'ki-campus', 'mooc', 'hochschulkurs', 'rag tutorial', 'mcp tutorial'],

  // Bauen im Bestand
  bestand_info: ['bestand', 'altbau', 'sanierung', 'diagnostik', 'schadensaufnahme'],
  bestand: ['epochen', 'baujahre', 'gründerzeit', 'nachkriegsbau', 'fachwerk', 'konstruktionsarten', 'u-werte'],
  bauwerkserfassung: ['laserscan', 'pointcloud', '3d-aufmaß', 'leica blk360', 'cyclone', 'fotogrammetrie', 'handaufmaß'],
  denkmalpflege: ['unterdenkmalschutz', 'denkmalschutz', 'historische baustoffe', 'opferputz', 'kalkmörtel', 'bauforschungsbericht'],
  modernisierung: ['geg 2024', 'sanierungsrechner', 'dachdämmung', 'kellerdeckendämmung', 'fenstertausch', 'sanierungspflicht'],
  bauwerksuntersuchung: ['zerstörungsfreie prüfung', 'ultraschall', 'radar', 'sklerometer', 'rückprallhammer', 'endoskopie', 'potentialfeldmessung'],
  historisch: ['historische festigkeiten', 'mauerwerkfestigkeit', 'altbetone', 'eisenbahnschienen', 'gusseisen', 'puddelstahl'],
  historische_bauweisen: ['fachwerk', 'historische bauweisen', 'lehmbau', 'historische decken', 'gewölbe', 'mauerwerk', 'historischer dachstuhl'],
  historische_bauprodukte: ['ziegelformate', 'reichsformat', 'klosterformat', 'historischer putz', 'historischer mörtel', 'rabitz', 'teerpappe', 'asbest', 'historisches glas', 'schadstoffe', 'holzschutzmittel'],

  // Rückbau & Schadstoffe
  rueckbau_info: ['rückbau', 'schadstoffe', 'abbruch', 'gefährlicher abfall'],
  rueckbau: ['rückbaukonzept', 'selektiver rückbau', 'abbruchtechnik', 'urban mining', 'stoffstromanalyse'],
  boden_materialaufbereitung: ['bodenaufbereitung', 'materialaufbereitung', 'mischungsverfahren', 'ersatzbaustoffe', 'ebv', 'bbodschv', 'gewabfv', 'waschanlage', 'thermisches verfahren', 'biologische mietenbehandlung', 'aufbereitung', 'simulator'],
  abfaelle: ['abfallschlüssel', 'avv', 'inertabfall', 'bauschutt', 'gefährlicher abfall', 'deponie', 'recycling', 'gemischte bauabfälle'],
  schadstoffe: ['asbestos', 'asbest', 'kmf', 'pak', 'pcb', 'pfas', 'chlorparaffine', 'quecksilber', 'blei', 'grenzwerte', 'gestis'],
  ressourceneffizienz: ['ressourceneffizienz', 'rez', 'informieren', 'handeln', 'nutzen', 'stärken', 'effizienzrechner', 'baustoffeffizienz', 'ökobilanz', 'kreislaufwirtschaft', 'bayern', 'ressourcen', 'klinkerreduktion', 'nachhaltigkeit'],
  rueckbau_checklisten: ['checklisten', 'praxis-checklisten', 'abfallcheckliste', 'rückbau-checkliste', 'asbest-checkliste', 'gefahrstoff-checkliste', 'arbeitsschutz-checkliste', 'deponie-checkliste'],

  // Dauerhaftigkeit
  dauerhaftigkeit_info: ['dauerhaftigkeit', 'korrosion', 'schadreaktionen', 'lebensdauer'],
  dauerhaftigkeit: ['lebensdauer', 'exposition', 'dauerhaftigkeitsprinzipien', 'schutzmaßnahmen', 'wartung'],
  korrosion: ['karbonatisierung', 'chlorid', 'lochfraß', 'rost', 'anode-kathode', 'elektrischer widerstand', 'ph-wert'],
  schadreaktionen_beton: ['akr', 'alkali-kieselsäure-reaktion', 'sulfattreiben', 'ettringit', 'säureangriff', 'frost-tausalz', 'abplatzung'],
  holzkorrosion: ['holzzerstörende pilze', 'hausschwamm', 'bläuepilz', 'insekten', 'hausbock', 'feuchtelastsprung', 'fäulnis'],
  metallkorrosion: ['sauerstoffkorrosion', 'wasserstoffkorrosion', 'kontaktkorrosion', 'bimetall', 'passivierung', 'verzinkung', 'opferanode'],
  weitere_organik: ['bitumenalterung', 'versprödung', 'kunststoff-uv-licht', 'mikrobieller befall', 'alterung', 'biotechnisch'],

  // Mängel & Schäden
  schaeden_info: ['bauschaden', 'schadensgutachten', 'sachverständiger', 'schadensursache', 'forensik'],
  bauschaeden: ['mangel', 'schaden', 'haftung', 'gewährleistung', 'vob/b', 'bgb', 'mangelbeseitigung', 'beweisverfahren', 'klebstoffschäden', 'dichtstoffschäden'],
  schadensbilder: ['kellerrisse', 'feuchte keller', 'wdvs-risse', 'betonabplatzungen', 'schimmel', 'dachundichtigkeit', 'fugenschaden', 'flankenaustritt'],
  bauwerksunters_monitoring: ['bohrwiderstand', 'monitoring', 'sensorik', 'lvdt', 'därrverfahren', 'zerstörende prüfung', 'bohrkern', 'endoskopie', 'cm-messung', 'risse', 'verformung', 'feuchtigkeit'],
  vdi6200: ['vdi 6200', 'zustandsnote', 'überprüfung', 'prüfintervall', 'verkehrssicherheit', 'standsicherheit'],
  material_schaeden_gross: ['materialschäden', 'einsturz', 'brückeneinsturz', 'akr', 'bahnschwellen', 'garmisch', 'burgrain', 'betonkrebs', 'hyatt regency', 'kansas city', 'stava', 'dammbruch', 'schiersteiner brücke', 'eishalle', 'bad reichenhall', 'genua', 'ponte morandi', 'carolabrücke', 'dresden', 'silver bridge', 'kongresshalle', 'reichsbrücke', 'versagen', 'harnstoffleim', 'spannungsrisskorrosion', 'schadensfälle', 'großschäden'],
  schaeden_checklisten: ['schadensaufnahme', 'begehung', 'rissprotokoll', 'schadenskataster', 'checkliste'],

  // Schutz & Instandsetzung
  instandsetzung_info: ['instandsetzung', 'schutz', 'bautenschutz', 'sanierung', 'werterhalt'],
  schutz_grundlagen: ['din en 1504-9', 'instandsetzungsprinzipien', 'tuutti', 'de-sitter', 'gesetz der fünf', 'passiver schutz', 'aktiver schutz', 'kks'],
  instandsetzung_materialien: ['holzschutz', 'din 68800', 'stahlkorrosionsschutz', 'iso 12944', 'duplex', 'kunststoffe', 'dvs', 'asphaltinstandsetzung', 'ztv bea-stb', 'mauerwerk', 'wta'],
  instandhaltung: ['instandsetzungsrichtlinie', 'dafstb', 'tr instandhaltung', 'reparaturmörtel', 'kathodischer korrosionsschutz', 'kks', 'oberflächenschutzsystem', 'os8', 'os11'],
  wta: ['wta', 'sanierputz', 'innendämmung', 'mauerwerksinstandsetzung', 'steinkonservierung', 'wta-zertifiziert', 'horizontalsperre'],
  instandsetzung_checklisten: ['instandsetzungscheckliste', 'skp', 'hdw', 'oberflächenvorbereitung', 'abnahme', 'sivv'],

  // Praxiswissen
  praxiswissen_info: ['bauwesen', 'ingenieuralltag', 'baupraxis', 'berufsstart'],
  px_planung: ['hoai', 'leistungsphasen', 'ausschreibung', 'vob/a', 'leistungsverzeichnis', 'lv', 'preisspiegel', 'ava'],
  px_bauleitung: ['bauleiter', 'bautagebuch', 'vob/b', 'mängelrüge', 'abnahme', 'aufmaß', 'bauzeitenplan'],
  px_produktion: ['werkseigene produktionskontrolle', 'wpk', 'zertifikat', 'qualitätssicherung', 'audit', 'iso 9001'],
  px_karriere: ['bewerbung', 'gehaltsverhandlung', 'soft skills', 'netzwerken', 'berufsalltag', 'fortbildung', 'kammer'],

  // Infos
  software: ['statiksoftware', 'u-wert-rechner', 'bim-software', 'cad', 'wufi', 'tools', 'hilfsmittel'],
  glossar: ['begriffe', 'lexikon', 'definitionen', 'einheiten', 'baustoffbegriffe', 'sucher', 'glossar', 'vokabeln'],
  fortbildungen: ['ingenieurkammer', 'weiterbildung', 'seminare', 'zertifikate', 'th augsburg', 'studium'],
  informationsquellen: ['baustoff-datenbanken', 'fachportale', 'normenportale', 'beuth', 'oekobaudat', 'bauforschungsportal'],
  literatur: ['lehrbücher', 'monografien', 'fachzeitschriften', 'wendehorst', 'baustoffkunde', 'springer', 'beuth'],
  lokales: ['th augsburg', 'labor augsburg', 'prof. huber', 'exkursion', 'ansprechpartner', 'augsburger', 'bayern'],
  weiter_tha: ['weiterbildung', 'master', 'studium', 'projektmanagement', 'ausbau', 'fachingenieur', 'bauingenieurwesen', 'ibi', 'hochschule augsburg', 'studieren', 'fortbildung', 'm.eng', 'zertifikat'],
  studium_tha: ['studium', 'tha', 'portal', 'app.tha.de', 'moodle', 'opac', 'infoguide', 'bibliothek', 'stundenplan', 'webuntis', 'mensa', 'career', 'jobs'],
  thesen_projekte: ['thesen', 'semesterprojekte', 'abchlussarbeiten', 'bachelorarbeit', 'masterarbeit', 'katalog', 'huber', 'projektstudium', 'tba', 'projekt'],
  kuriositaeten: ['pantheon', 'eiffelturm', 'burj khalifa', 'olympiastadion', 'rekorde', 'kurioses', 'uhpc', 'geschichte', 'pumpe', 'rost', 'acrylglas', 'seilnetz', 'schadstoffe', 'rekorde'],

  // Beispielrechnungen
  rechnung_u_wert: ['u-wert', 'wärmedurchgangskoeffizient', 'bauphysik', 'geg', 'wärmeschutz', 'dämmung', 'beispielrechnung'],
  rechnung_beton: ['mischungsentwurf', 'betonrezeptur', 'wasserzementwert', 'stoffraumberechnung', 'zuschlag', 'beispielrechnung'],
  rechnung_stahlbeton: ['biegebemessung', 'rechteckquerschnitt', 'bewehrung', 'massivbau', 'gzt', 'eurocode 2', 'beispielrechnung'],
  rechnung_holzbau: ['stützenknicken', 'knicknachweis', 'holzbau', 'stabilität', 'biegeknicken', 'eurocode 5', 'beispielrechnung'],
  rechnung_mauerwerk: ['mauerwerk', 'wandtragfähigkeit', 'vertikallast', 'vereinfachtes verfahren', 'eurocode 6', 'beispielrechnung'],
  rechnung_nachhaltigkeit: ['nachhaltigkeit', 'dauerhaftigkeit', 'ökobilanz', 'gwp', 'co2-uptake', 'karbonatisierung', 'cem iii', 'beispielrechnung'],
  rechnung_bestand: ['bauen im bestand', 'historische kennwerte', 'beton b225', 'bst 220', 'altbau', 'ziegelmauerwerk', 'reichsformat', 'beispielrechnung'],

  // Vorlesungen
  vl_ueberblick: ['vorlesungen', 'vorlesung', 'lehrveranstaltungen', 'tha', 'semester', 'passwort', 'zugang'],
  vl_bauen_im_bestand: ['vorlesung bauen im bestand', 'bestand', 'altbau', 'denkmalpflege', 'koldewey', 'pren 1990-2'],
  vl_nachhaltiges_bauen: ['vorlesung nachhaltiges bauen', 'lca', 'ökobilanz', 'thg', 'stoffströme', 'epd', 'dpp', 'taxonomie'],
  vl_bauschaeden: ['vorlesung bauschäden', 'schadensanalyse', 'risse', 'feuchteschäden', 'gutachten', 'vdi 6200'],
  vl_baustoffkunde: ['vorlesung baustoffkunde', 'baustoffe', 'zement', 'beton', 'stahl', 'holz', 'mauerwerk', 'bauchemie'],
  vl_instandhaltung: ['vorlesung instandhaltung', 'betoninstandhaltung', 'din en 1504', 'rl sib', 'wta', 'monitoring']
};

const GROUP_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'Allgemein': Compass,
  'Grundlagen': Scale,
  'Labor & Auswertung': Microscope,
  'Baustoffe': Mountain,
  'Bauprodukte': Factory,
  'Betontechnologie': Droplets,
  'Massivbau': Layers,
  'Holzbau': Trees,
  'Mechanik': Activity,
  'Bauphysik': Thermometer,
  'Nachhaltigkeit': Leaf,
  'Digitales': Monitor,
  'Bauen im Bestand': Landmark,
  'Rückbau & Schadstoffe': Recycle,
  'Dauerhaftigkeit': ShieldCheck,
  'Mängel & Schäden': FileWarning,
  'Schutz & Instandsetzung': Shield,
  'Praxiswissen': Wrench,
  'Infos & Quellen': Info,
  'Beispielrechnungen': Calculator,
  'Übungsaufgaben': ClipboardCheck,
  'Vorlesungen': GraduationCap,
  'Übersicht & Zugang': GraduationCap,
  'Bauen im Bestand (VL)': Building2,
  'Nachhaltiges Bauen (VL)': Leaf,
  'Bauschäden (VL)': AlertTriangle,
  'Baustoffkunde (VL)': Layers,
  'Instandhaltung (VL)': Wrench,
  'Studium THA': Globe,
  'Weiter@THA': GraduationCap,
  'Thesen & Projekte': FileText,
  'Kuriositäten': Sparkles
};

function AppContent() {
  const { activeTab, setActiveTab, theme, toggleTheme } = useTabContext();
  const { language, t, getTabLabel, getGroupName, getClusterName } = useLanguage();
  const [activePollParam, setActivePollParam] = useState<{ poll: string; qid?: string } | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const poll = params.get('poll');
      if (poll) {
        return { poll, qid: params.get('qid') || undefined };
      }
    }
    return null;
  });

  const { glossaryTooltipMode, toggleGlossaryTooltipMode, formulaDerivationMode, toggleFormulaDerivationMode } = useTabContext();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openClusters, setOpenClusters] = useState<Record<string, boolean>>({
    grundlagen: false,
    baustoffe: false,
    beton: false,
    bestand: false,
    praxis: false,
    studium: false,
    vorlesungen: false
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const initialized = localStorage.getItem('baustoffboard_favs_initialized');
      if (!initialized) {
        localStorage.setItem('baustoffboard_favs_initialized', 'true');
        localStorage.setItem('baustoffboard_favorites', JSON.stringify(['mischungsberechnung']));
        return ['mischungsberechnung'];
      }
      const saved = localStorage.getItem('baustoffboard_favorites');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return ['mischungsberechnung'];
  });
  const [recentTabs, setRecentTabs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('baustoffboard_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [screenWidth, setScreenWidth] = useState<'standard' | 'wide' | 'full'>(() => {
    try {
      const saved = localStorage.getItem('baustoffboard_screen_width');
      if (saved === 'standard' || saved === 'wide' || saved === 'full') return saved;
      const legacyFluid = localStorage.getItem('baustoffboard_fluid_width');
      if (legacyFluid !== null) return legacyFluid === 'true' ? 'full' : 'standard';
      return 'wide';
    } catch {
      return 'wide';
    }
  });
  const fluidWidth = screenWidth === 'full';

  useEffect(() => {
    const handleWidthChange = (e: Event) => {
      const custom = e as CustomEvent<'standard' | 'wide' | 'full'>;
      if (custom.detail && (custom.detail === 'standard' || custom.detail === 'wide' || custom.detail === 'full')) {
        setScreenWidth(custom.detail);
      }
    };
    window.addEventListener('baustoffboard_width_change', handleWidthChange);
    return () => window.removeEventListener('baustoffboard_width_change', handleWidthChange);
  }, []);

  const [seoLogs, setSeoLogs] = React.useState<string[]>([]);
  const [showMetadataModal, setShowMetadataModal] = useState(false);

  const printMetadataConsoleTable = () => {
    const rows: any[] = [];
    tabGroups.forEach((group: any) => {
      const cluster = GROUP_TO_CLUSTER[group.name];
      const clusterName = cluster ? `${cluster.number}: ${cluster.name}` : (group.name === 'Allgemein' ? 'Allgemein' : group.name);
      group.tabs.forEach((tab: any) => {
        if (tab.id.startsWith('divider_')) return;
        const title = `BaustoffBoard THA - ${tab.label}`;
        const desc = TAB_DESCRIPTIONS[tab.id];
        const len = desc ? desc.length : 0;
        let status = '✔ Optimal (100–165)';
        if (!desc) status = '✘ Fehlt';
        else if (len < 100) status = `⚠️ Kurz (${formatDeWert(len)} Z.)`;
        else if (len > 165) status = `ℹ Lang (${formatDeWert(len)} Z.)`;
        rows.push({
          'Tab-ID': tab.id,
          'Modul': tab.label,
          'Gruppe': group.name,
          'Cluster': clusterName,
          'Seitentitel (Title)': title,
          'Status': status,
          'Zeichen': len,
          'Meta-Description': desc || '(Standard-Fallback aktiv)'
        });
      });
    });

    console.group(`🔍 SEO-Metadaten-Audit: Alle ${rows.length} Fachmodule`);
    console.log(`%cMetadaten-Status für alle Module des BaustoffBoards:`, "color: #A3113E; font-weight: bold; font-size: 13px;");
    console.table(rows);
    console.groupEnd();

    setSeoLogs(prev => [...prev.slice(-6), `${new Date().toLocaleTimeString('de-DE')}: [SEO-Tabelle] ${rows.length} Module in Konsole & Tabelle ausgegeben.`]);
  };

  // Update recent tabs and auto-expand cluster when activeTab changes
  useEffect(() => {
    if (!activeTab || activeTab === 'start') {
      const nextState: Record<string, boolean> = {};
      META_CLUSTERS.forEach(c => {
        nextState[c.id] = false;
      });
      setOpenClusters(nextState);
      setOpenDropdown(null);
      return;
    }
    setRecentTabs(prev => {
      const updated = [activeTab, ...prev.filter(id => id !== activeTab)].slice(0, 5);
      try { localStorage.setItem('baustoffboard_recent', JSON.stringify(updated)); } catch {}
      return updated;
    });

    // Auto open parent group and cluster for active tab (exklusiv: andere schließen)
    const parentGroup = tabGroups.find(g => (g.tabs as readonly any[]).some(t => t.id === activeTab));
    if (parentGroup) {
      setOpenDropdown(parentGroup.name);
      const cluster = GROUP_TO_CLUSTER[parentGroup.name];
      if (cluster) {
        const nextState: Record<string, boolean> = {};
        META_CLUSTERS.forEach(c => {
          nextState[c.id] = false;
        });
        nextState[cluster.id] = true;
        setOpenClusters(nextState);
      }
    }
  }, [activeTab]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try { localStorage.setItem('baustoffboard_favorites', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  // Exklusives Aufklappen: Wenn ein Hauptmenüpunkt (I-VII) aufgeklappt wird, klappen alle anderen automatisch zu
  const toggleCluster = (clusterId: string) => {
    setOpenClusters(prev => {
      const willBeOpen = !prev[clusterId];
      if (willBeOpen) {
        const nextState: Record<string, boolean> = {};
        META_CLUSTERS.forEach(c => {
          nextState[c.id] = false;
        });
        nextState[clusterId] = true;
        return nextState;
      } else {
        return { ...prev, [clusterId]: false };
      }
    });

    // Untermenüs anderer Hauptmenüpunkte ebenfalls schließen
    setOpenDropdown(prev => {
      if (!prev) return null;
      const targetCluster = META_CLUSTERS.find(c => c.id === clusterId);
      if (targetCluster && targetCluster.groupNames.includes(prev)) {
        return prev;
      }
      return null;
    });
  };

  const checkSEOStatus = (tabToCheck?: string) => {
    const targetTab = tabToCheck || activeTab;
    const metaDesc = document.querySelector('meta[name="description"]');
    const docTitle = document.title;
    const currentDesc = metaDesc ? metaDesc.getAttribute('content') : null;
    const expectedDesc = TAB_DESCRIPTIONS[targetTab];
    
    const isDescMatch = expectedDesc ? (currentDesc === expectedDesc) : true;
    
    // JSON-LD Validation integration
    let jsonLdStatusText = "";
    if (typeof (window as any).validateJSONLD === 'function') {
      const report = (window as any).validateJSONLD();
      if (report && report.results) {
        const errorCount = report.errors?.length || 0;
        const warnCount = report.warnings?.length || 0;
        jsonLdStatusText = ` | JSON-LD: ${report.results.length} Parts (${errorCount} Errs, ${warnCount} Warns)`;
      }
    }
    
    // Web console diagnostic group
    console.group(`🔍 SEO-Status Diagnostik: Modul [${targetTab}]`);
    console.log(`%cSuchmaschinen-Optimierung (SEO) Check für ${targetTab}`, "color: #A3113E; font-weight: bold; font-size: 13px;");
    console.log(`Aktiver Tab/Modul: %c${targetTab}`, "color: #475569; font-weight: bold;");
    console.log(`Dokumententitel im Head: %c"${docTitle}"`, "color: #475569; font-weight: bold;");
    
    let isSuccess = false;
    if (metaDesc) {
      if (expectedDesc) {
        if (isDescMatch) {
          console.log(`%c➔ SUCCESS: Meta-Description erfolgreich injiziert!`, "color: #475569; font-weight: bold;");
          isSuccess = true;
        } else {
          console.warn(`%c➔ ABWEICHUNG: Meta-Description weicht ab (DOM: "${currentDesc}", Erwartet: "${expectedDesc}")`, "color: #64748b; font-weight: bold;");
        }
      } else {
        console.log(`%c➔ INFO: Nutze Standard-Beschreibung (Keine spezifische Beschreibung für '${targetTab}' definiert)`, "color: #475569; font-style: italic;");
        isSuccess = true;
      }
      console.log(`Aktuelle Beschreibung: "${currentDesc}"`);
    } else {
      console.error(`%c➔ FEHLER: Kein Meta-Description-Tag im Document-Head gefunden!`, "color: #A3113E; font-weight: bold;");
    }
    console.groupEnd();

    // Add log entry to the UI diagnostics state
    const statusText = isSuccess ? "✔ ERFOLGREICH" : "✘ ABWEICHUNG/FEHLT";
    const logMsg = `[SEO] Modul: '${targetTab}' | Status: ${statusText}${jsonLdStatusText}`;
    setSeoLogs(prev => [...prev.slice(-7), `${new Date().toLocaleTimeString('de-DE')}: ${logMsg}`]);
  };

  const handleExport = async () => {
    setIsExporting(true);
    await exportToPDF('module-content', `THA_Baustoffkunde_${activeTab}`);
    setIsExporting(false);
  };
  // Track analytics visit
  React.useEffect(() => {
    fetch('/api/analytics/visit', { method: 'POST' }).catch(() => {});
  }, []);

  // Update dynamic meta description on active tab changes
  React.useEffect(() => {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    const descriptionText = TAB_DESCRIPTIONS[activeTab] || "Interaktive Lern- und Wissensplattform für Baustoffkunde, Werkstoffmechanik, Bauen im Bestand, Kreislaufwirtschaft, Nachhaltiges Bauen & Co. Entwickelt an der TH Augsburg.";
    metaDescription.setAttribute('content', descriptionText);

    // Dynamic document title update for better user context and crawler indexing
    let tabLabel = "";
    for (const group of tabGroups) {
      const found = group.tabs.find((t: any) => t.id === activeTab);
      if (found) {
        tabLabel = found.label;
        break;
      }
    }
    if (tabLabel) {
      document.title = `BaustoffBoard THA - ${tabLabel}`;
    } else {
      document.title = "BaustoffBoard - TH Augsburg";
    }

    // Dynamic OpenGraph updates for social share cards & rich indexing
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', tabLabel ? `BaustoffBoard THA - ${tabLabel}` : "BaustoffBoard - TH Augsburg");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', descriptionText);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl && typeof window !== 'undefined') ogUrl.setAttribute('content', `${window.location.origin}/#${activeTab}`);
  }, [activeTab]);

  if (activePollParam) {
    return (
      <StudentPollVoteView 
        initialLectureId={activePollParam.poll}
        initialQuestionId={activePollParam.qid}
        onExitToPortal={() => {
          try {
            window.history.replaceState({}, '', window.location.pathname);
          } catch {}
          setActivePollParam(null);
        }}
      />
    );
  }

  return (
  <div className="min-h-screen bg-off-white dark:bg-slate-950 text-text-main dark:text-slate-100 flex font-sans">
    {mobileMenuOpen && (
      <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
    )}
    <aside className={"fixed md:sticky top-0 left-0 z-50 h-screen bg-white dark:bg-slate-900 border-r border-home-grau/30 dark:border-slate-800 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden " + 
      (sidebarCollapsed ? "md:w-0 md:opacity-0 md:pointer-events-none md:border-r-0" : "md:w-72 md:opacity-100") + " " +
      (mobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0 w-72")}>
      <div className="p-4 border-b border-home-grau/20 dark:border-slate-800 flex flex-col gap-4 bg-white dark:bg-slate-900 z-10 sticky top-0">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => { 
              setActiveTab('start'); 
              setMobileMenuOpen(false); 
            }} 
            className="flex items-center gap-3 text-left hover:opacity-85 transition-opacity active:scale-[0.98] duration-150"
            title="Zur Startseite"
          >
            <div className="w-8 h-8 bg-shiraz rounded-lg flex items-center justify-center text-white flex-shrink-0">
              <GraduationCap size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-text-main dark:text-slate-100 leading-tight">BaustoffBoard</h1>
              <span className="text-[10px] text-text-main/60 dark:text-slate-400 block">Prof. Huber - TH Augsburg</span>
            </div>
          </button>
          <div className="flex items-center gap-1">
            <button className="md:hidden text-home-grau dark:text-slate-400 p-1 hover:bg-home-grau/10 dark:hover:bg-slate-800 rounded" onClick={() => setMobileMenuOpen(false)}> 
              <X size={20} />
            </button>
            <button className="hidden md:block text-home-grau dark:text-slate-400 p-1 hover:bg-home-grau/10 dark:hover:bg-slate-800 rounded transition-colors" onClick={() => setSidebarCollapsed(true)} title="Sidebar ausblenden"> 
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-home-grau dark:text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder={language === 'en' ? "Search module, code or keyword..." : "Suchen..."} 
            className="w-full pl-9 pr-8 py-2 border border-home-grau/30 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-shiraz focus:border-transparent bg-white dark:bg-slate-800 dark:text-white" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-home-grau dark:text-slate-400 hover:text-shiraz transition-colors"
              title="Suche löschen"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5 custom-scrollbar pb-12">
        {/* Schnellzugriff: Dashboard / Start & Allgemein */}
        {(() => {
          const allgemeinGroup = tabGroups[0]; // Allgemein
          const isAllgemeinChildActive = ['admin', 'anleitung', 'modulstruktur', 'feedback', 'versionen', 'impressum', 'datenschutz'].includes(activeTab);
          const isAllgemeinOpen = openDropdown === 'Allgemein' || (openDropdown !== 'CLOSED_ALLGEMEIN' && isAllgemeinChildActive) || (searchQuery !== '');

          const matchingAllgemeinTabs = allgemeinGroup.tabs.filter((t: any) => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            const translatedLabel = getTabLabel(t.id, t.label);
            const labelIncludes = (t.label && t.label.toLowerCase().includes(query)) || translatedLabel.toLowerCase().includes(query);
            const keywords = TAB_KEYWORDS[t.id] || [];
            const keywordsInclude = keywords.some(k => k.includes(query));
            return labelIncludes || keywordsInclude;
          });

          // In search mode, only render if matching items exist
          if (searchQuery && matchingAllgemeinTabs.length === 0) return null;

          return (
            <div className="mb-2 pb-2 border-b border-home-grau/20 dark:border-slate-800 flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setActiveTab('start');
                    setMobileMenuOpen(false);
                    const nextState: Record<string, boolean> = {};
                    META_CLUSTERS.forEach(c => {
                      nextState[c.id] = false;
                    });
                    setOpenClusters(nextState);
                    setOpenDropdown(null);
                  }}
                  className={"flex-1 flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer " + 
                    (activeTab === 'start' 
                      ? "bg-slate-100 dark:bg-slate-800 border border-shiraz dark:border-rose-500 text-shiraz dark:text-rose-400 font-bold shadow-xs" 
                      : "text-text-main dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent")}
                >
                  <Compass size={16} className="text-shiraz" />
                  <span className="flex-1 text-left font-bold">{language === 'en' ? 'Home' : 'Start'}</span>
                </button>
                <button
                  onClick={() => setOpenDropdown(isAllgemeinOpen ? 'CLOSED_ALLGEMEIN' : 'Allgemein')}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isAllgemeinOpen
                      ? "bg-slate-100 dark:bg-slate-800 border-shiraz dark:border-rose-500 text-shiraz dark:text-rose-400"
                      : "bg-white/40 dark:bg-slate-800 border-home-grau/20 dark:border-slate-700 text-slate-500 hover:text-shiraz"
                  }`}
                  title={isAllgemeinOpen ? (language === 'en' ? "Collapse menu" : "Start-Menü einklappen") : (language === 'en' ? "Expand menu" : "Start-Menü ausklappen")}
                >
                  <ChevronRight size={14} className={`transition-transform duration-200 ${isAllgemeinOpen ? "rotate-90" : ""}`} />
                </button>
              </div>

              {/* Allgemein Untermodule */}
              {isAllgemeinOpen && (
                <div className="flex flex-col gap-0.5 border-l-2 border-shiraz/40 dark:border-rose-500/40 ml-4 pl-2 my-1">
                  {matchingAllgemeinTabs
                    .filter((t: any) => searchQuery ? true : t.id !== 'start')
                    .map((tab: any) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      const isFav = favorites.includes(tab.id);
                      const displayLabel = getTabLabel(tab.id, tab.label);

                      return (
                        <div key={tab.id} className="group/item flex items-center gap-1">
                          <button 
                            onClick={() => { setActiveTab(tab.id as any); setMobileMenuOpen(false); }} 
                            className={"flex-1 flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-lg transition-colors " + 
                              (isActive ? "bg-shiraz text-white shadow-xs font-semibold" : "text-text-main/80 dark:text-slate-300 hover:bg-home-grau/10 dark:hover:bg-slate-800 hover:text-text-main dark:hover:text-white")}
                          >
                            <Icon size={13} className={isActive ? "text-white" : "text-text-main/50 dark:text-slate-400 shrink-0"} />
                            <span className="truncate flex-1 text-left">{displayLabel}</span>
                          </button>
                          <button
                            onClick={(e) => toggleFavorite(tab.id, e)}
                            className={`p-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-home-grau/20 dark:hover:bg-slate-700 ${isFav ? "!opacity-100 text-amber-500" : "text-slate-400"}`}
                            title={isFav ? (language === 'en' ? "Remove from favorites" : "Aus Favoriten entfernen") : (language === 'en' ? "Add to favorites" : "Zu Favoriten hinzufügen")}
                          >
                            <Star size={11} className={isFav ? "fill-amber-500" : ""} />
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Favoriten Leiste wenn vorhanden */}
              {!searchQuery && favorites.length > 0 && (
                <div className="mt-1 px-1">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-home-grau dark:text-slate-400 mb-1">
                    <span className="flex items-center gap-1"><Star size={10} className="text-amber-500 fill-amber-500" /> {t('favorites')}</span>
                    <span className="text-[9px] opacity-75">{favorites.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {favorites.slice(0, 4).map(favId => {
                      const foundTab = tabGroups.flatMap(g => g.tabs as readonly any[]).find(t => t.id === favId);
                      if (!foundTab) return null;
                      const isFavActive = activeTab === favId;
                      const displayFavLabel = getTabLabel(foundTab.id, foundTab.label);
                      return (
                        <button
                          key={favId}
                          onClick={() => { setActiveTab(favId as any); setMobileMenuOpen(false); }}
                          className={"text-xs px-2 py-1 rounded-lg border font-medium transition-colors truncate max-w-[130px] " +
                            (isFavActive ? "bg-shiraz text-white border-shiraz" : "bg-white dark:bg-slate-800 text-text-main/80 dark:text-slate-300 border-home-grau/30 dark:border-slate-700 hover:border-shiraz")}
                          title={displayFavLabel}
                        >
                          {displayFavLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })()}



        {/* 7 Meta-Cluster Navigation */}
        {META_CLUSTERS.map((cluster) => {
          // Find matching groups in this cluster
          const clusterGroups = tabGroups.filter(g => cluster.groupNames.includes(g.name));
          const translatedClusterName = getClusterName(cluster.id, cluster.name);
          
          // Filter groups and tabs if search is active
          const matchingGroups = clusterGroups.filter(group => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            const groupNameTranslated = getGroupName(group.name);
            const clusterNameMatches = cluster.name.toLowerCase().includes(query) || translatedClusterName.toLowerCase().includes(query);
            return clusterNameMatches ||
                   group.name.toLowerCase().includes(query) || 
                   groupNameTranslated.toLowerCase().includes(query) ||
                   group.tabs.some((t: any) => {
                     const translatedLabel = getTabLabel(t.id, t.label);
                     const labelIncludes = (t.label && t.label.toLowerCase().includes(query)) || translatedLabel.toLowerCase().includes(query);
                     const keywords = TAB_KEYWORDS[t.id] || [];
                     const keywordsInclude = keywords.some(k => k.includes(query));
                     return labelIncludes || keywordsInclude;
                   });
          });

          if (matchingGroups.length === 0) return null;

          const ClusterIcon = cluster.icon;
          const isClusterOpen = openClusters[cluster.id] || searchQuery !== "";
          const hasActiveChild = clusterGroups.some(g => (g.tabs as readonly any[]).some(t => t.id === activeTab));

          return (
            <div 
              key={cluster.id} 
              className={"rounded-xl transition-all border mb-1 " + 
                (hasActiveChild 
                  ? "bg-white/80 dark:bg-slate-900/90 border-home-grau/40 dark:border-slate-700 shadow-xs" 
                  : "bg-white/40 dark:bg-slate-900/40 border-home-grau/20 dark:border-slate-800/80")}
            >
              {/* Cluster Header */}
              <button
                onClick={() => toggleCluster(cluster.id)}
                className="w-full px-2.5 py-2 flex items-center justify-between gap-2 text-left rounded-xl transition-colors hover:bg-home-grau/5 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`p-1.5 rounded-lg border shrink-0 ${cluster.badgeBg}`}>
                    <ClusterIcon size={14} className={cluster.accentColor} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${cluster.badgeBg} ${cluster.badgeText}`}>
                        {cluster.number}
                      </span>
                      <span className={"text-xs font-bold truncate " + (hasActiveChild ? "text-text-main dark:text-white" : "text-text-main/90 dark:text-slate-200")}>
                        {translatedClusterName}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 text-home-grau dark:text-slate-400">
                  <ChevronRight size={14} className={`transition-transform duration-200 ${isClusterOpen ? "rotate-90" : ""}`} />
                </div>
              </button>

              {/* Sub-Groups inside Cluster */}
              {isClusterOpen && (
                <div className="px-2 pb-2 pt-0.5 flex flex-col gap-1 border-t border-home-grau/15 dark:border-slate-800">
                  {cluster.id === 'vorlesungen' ? (
                    <div className="flex flex-col gap-0.5 my-0.5">
                      {(matchingGroups as any[]).flatMap((g: any) => g.tabs).filter((tab: any) => {
                        if (!searchQuery) return true;
                        const query = searchQuery.toLowerCase();
                        const translatedLabel = getTabLabel(tab.id, tab.label);
                        const labelIncludes = (tab.label && tab.label.toLowerCase().includes(query)) || translatedLabel.toLowerCase().includes(query);
                        const keywords = TAB_KEYWORDS[tab.id] || [];
                        const keywordsInclude = keywords.some(k => k.includes(query));
                        return labelIncludes || keywordsInclude;
                      }).map((tab: any) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        const isFav = favorites.includes(tab.id);
                        const tabDisplayName = getTabLabel(tab.id, tab.label);

                        return (
                          <div key={tab.id} className="group/item flex items-center gap-1">
                            <button 
                              onClick={() => { setActiveTab(tab.id as any); setMobileMenuOpen(false); }} 
                              className={"flex-1 flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-lg transition-colors " + 
                                (isActive ? "bg-shiraz text-white shadow-xs font-semibold" : "text-text-main/80 dark:text-slate-300 hover:bg-home-grau/10 dark:hover:bg-slate-800 hover:text-text-main dark:hover:text-white")}
                            >
                              <Icon size={13} className={isActive ? "text-white" : "text-text-main/50 dark:text-slate-400 shrink-0"} />
                              <span className="truncate flex-1 text-left">{tabDisplayName}</span>
                            </button>
                            <button
                              onClick={(e) => toggleFavorite(tab.id, e)}
                              className={`p-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-home-grau/20 dark:hover:bg-slate-700 ${isFav ? "!opacity-100 text-amber-500" : "text-slate-400"}`}
                              title={isFav ? (language === 'en' ? "Remove from favorites" : "Aus Favoriten entfernen") : (language === 'en' ? "Add to favorites" : "Zu Favoriten hinzufügen")}
                            >
                              <Star size={11} className={isFav ? "fill-amber-500" : ""} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    matchingGroups.map((group) => {
                    const isGroupOpen = openDropdown === group.name || searchQuery !== "";
                    const isGroupActive = (group.tabs as readonly any[]).some(t => t.id === activeTab || (t.id === 'stahlbeton_bemessung' && ['spannung', 'biegebemessung', 'querkraftbemessung', 'stuetzenbemessung', 'durchstanzen', 'verankerungslaenge', 'rissbreite'].includes(activeTab)));
                    const groupDisplayName = getGroupName(group.name);

                    return (
                      <div key={group.name} className="flex flex-col rounded-lg">
                        <button 
                          onClick={() => setOpenDropdown(isGroupOpen ? null : group.name)} 
                          className={"text-xs tracking-wide px-2 py-1.5 flex justify-between items-center rounded-lg transition-colors text-left w-full " + 
                            (isGroupActive ? "font-bold text-shiraz dark:text-rose-400 bg-shiraz/5 dark:bg-rose-950/20" : "font-medium text-text-main/80 dark:text-slate-300 hover:bg-home-grau/10 dark:hover:bg-slate-800/60")}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            {React.createElement(GROUP_ICONS[group.name] || Layers, { size: 12, className: "shrink-0 opacity-70" })}
                            <span className="truncate text-left">{groupDisplayName}</span>
                          </div>
                          <span className="text-[10px] text-home-grau dark:text-slate-400 shrink-0 ml-1">
                            {isGroupOpen ? "▲" : "▼"}
                          </span>
                        </button>
                        
                        {isGroupOpen && (
                          <div className="flex flex-col gap-0.5 border-l-2 border-home-grau/30 dark:border-slate-700 ml-2.5 pl-2 my-0.5">
                            {group.tabs.filter((tab: any) => {
                              if (!searchQuery) return true;
                              const query = searchQuery.toLowerCase();
                              const translatedLabel = getTabLabel(tab.id, tab.label);
                              const labelIncludes = (tab.label && tab.label.toLowerCase().includes(query)) || translatedLabel.toLowerCase().includes(query);
                              const keywords = TAB_KEYWORDS[tab.id] || [];
                              const keywordsInclude = keywords.some(k => k.includes(query));
                              return labelIncludes || keywordsInclude;
                            }).map((tab: any) => {
                              if (tab.id.startsWith("divider")) {
                                const dividerText = getTabLabel(tab.id, tab.label.replace(/-/g, "").trim());
                                return (
                                  <div key={tab.id} className="my-1 pt-1 pointer-events-none">
                                    <span className="text-[9px] font-bold text-home-grau dark:text-slate-400 uppercase tracking-wider">{dividerText}</span>
                                  </div>
                                );
                              }
                              const Icon = tab.icon;
                              const isActive = activeTab === tab.id || (tab.id === 'stahlbeton_bemessung' && ['spannung', 'biegebemessung', 'querkraftbemessung', 'stuetzenbemessung', 'durchstanzen', 'verankerungslaenge', 'rissbreite'].includes(activeTab));
                              const isFav = favorites.includes(tab.id);
                              const tabDisplayName = getTabLabel(tab.id, tab.label);

                              return (
                                <div key={tab.id} className="group/item flex items-center gap-1">
                                  <button 
                                    onClick={() => { setActiveTab(tab.id as any); setMobileMenuOpen(false); }} 
                                    className={"flex-1 flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-lg transition-colors " + 
                                      (isActive ? "bg-shiraz text-white shadow-xs font-semibold" : "text-text-main/80 dark:text-slate-300 hover:bg-home-grau/10 dark:hover:bg-slate-800 hover:text-text-main dark:hover:text-white")}
                                  >
                                    <Icon size={13} className={isActive ? "text-white" : "text-text-main/50 dark:text-slate-400 shrink-0"} />
                                    <span className="truncate flex-1 text-left">{tabDisplayName}</span>
                                  </button>
                                  <button
                                    onClick={(e) => toggleFavorite(tab.id, e)}
                                    className={`p-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-home-grau/20 dark:hover:bg-slate-700 ${isFav ? "!opacity-100 text-amber-500" : "text-slate-400"}`}
                                    title={isFav ? (language === 'en' ? "Remove from favorites" : "Aus Favoriten entfernen") : (language === 'en' ? "Add to favorites" : "Zu Favoriten hinzufügen")}
                                  >
                                    <Star size={11} className={isFav ? "fill-amber-500" : ""} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="p-4 border-t border-home-grau/20 dark:border-slate-800 text-xs text-home-grau dark:text-slate-400 text-center relative">
          <div className="flex items-center justify-center gap-1.5">
            <span><strong>Disclaimer:</strong> {language === 'en' ? "Academic purposes only!" : "Nur akad. Lehrzwecke!"}</span>
          </div>
       </div>
     </aside>
     <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative bg-off-white dark:bg-slate-950 text-text-main dark:text-slate-100">
       <header className="bg-white dark:bg-slate-900 border-b border-home-grau/30 dark:border-slate-800 sticky top-0 z-10 flex-shrink-0 text-text-main dark:text-slate-100">
         <div className="px-4 sm:px-6">
           <div className="flex items-center justify-between h-14">
             <div className="flex items-center gap-3 md:hidden">
               <button className="text-text-main dark:text-slate-100 p-2 -ml-2 rounded-lg hover:bg-home-grau/10 dark:hover:bg-slate-800" onClick={() => setMobileMenuOpen(true)}> 
                 <Menu size={24} />
               </button>
               <button 
                 onClick={() => { setActiveTab('start'); }} 
                 className="font-bold text-text-main dark:text-slate-100 flex items-center gap-1 text-sm hover:opacity-85 transition-opacity text-left active:scale-[0.98] duration-150"
                 title="Zur Startseite"
               >
                <GraduationCap size={16} className="text-shiraz"/> BaustoffBoard
              </button>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-text-main/70 dark:text-slate-300 min-w-0">
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-text-main dark:text-slate-100 p-2 -ml-2 rounded-lg hover:bg-home-grau/10 dark:hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0"
                title={sidebarCollapsed ? "Sidebar einblenden" : "Sidebar ausblenden"}
              >
                <Menu size={20} />
              </button>
              
              {/* Breadcrumb Navigation */}
              {activeTab === 'start' ? (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-main dark:text-white flex items-center gap-1.5">
                    <Compass size={16} className="text-shiraz" /> {t('dashboard')}
                  </span>
                </div>
              ) : (() => {
                const currentGroup = tabGroups.find(g => (g.tabs as readonly any[]).some(t => t.id === activeTab));
                const currentCluster = currentGroup ? GROUP_TO_CLUSTER[currentGroup.name] : null;
                const currentTabObj = currentGroup ? (currentGroup.tabs as readonly any[]).find(t => t.id === activeTab) : null;
                const ClusterIcon = currentCluster?.icon || Compass;
                const clusterDisplayName = currentCluster ? getClusterName(currentCluster.id, currentCluster.name) : '';
                const groupDisplayName = currentGroup ? getGroupName(currentGroup.name) : '';
                const tabDisplayName = currentTabObj ? getTabLabel(currentTabObj.id, currentTabObj.label) : activeTab;

                return (
                  <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm text-text-main/70 dark:text-slate-400 min-w-0">
                    <button 
                      onClick={() => setActiveTab('start')}
                      className="hover:text-shiraz transition-colors font-medium hover:underline shrink-0"
                      title={language === 'en' ? "Back to Dashboard" : "Zurück zum Dashboard"}
                    >
                      {language === 'en' ? 'Home' : 'Start'}
                    </button>
                    <ChevronRight size={13} className="text-home-grau/60 dark:text-slate-600 shrink-0" />
                    
                    {currentCluster && (
                      <>
                        <button
                          onClick={() => {
                            const nextState: Record<string, boolean> = {};
                            META_CLUSTERS.forEach(c => {
                              nextState[c.id] = false;
                            });
                            nextState[currentCluster.id] = true;
                            setOpenClusters(nextState);
                            if (currentGroup) setOpenDropdown(currentGroup.name);
                          }}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded font-semibold text-xs transition-colors hover:opacity-85 shrink-0 ${currentCluster.badgeBg} ${currentCluster.badgeText}`}
                          title={`Cluster: ${clusterDisplayName}`}
                        >
                          <ClusterIcon size={12} className={currentCluster.accentColor} />
                          <span className="hidden lg:inline">{currentCluster.number}: </span>
                          <span className="truncate max-w-[120px]">{clusterDisplayName}</span>
                        </button>
                        <ChevronRight size={13} className="text-home-grau/60 dark:text-slate-600 shrink-0" />
                      </>
                    )}

                    {currentGroup && (
                      <>
                        <button
                          onClick={() => setOpenDropdown(currentGroup.name)}
                          className="hover:text-text-main dark:hover:text-white transition-colors truncate max-w-[140px] font-medium hidden sm:inline"
                        >
                          {groupDisplayName}
                        </button>
                        <ChevronRight size={13} className="text-home-grau/60 dark:text-slate-600 shrink-0 hidden sm:inline" />
                      </>
                    )}

                    <span className="font-bold text-text-main dark:text-white truncate max-w-[180px] sm:max-w-[240px]">
                      {tabDisplayName}
                    </span>

                    {/* Quick favorite star in breadcrumbs */}
                    <button
                      onClick={(e) => toggleFavorite(activeTab, e)}
                      className={`p-1 rounded-md transition-colors hover:bg-home-grau/10 dark:hover:bg-slate-800 ${favorites.includes(activeTab) ? "text-amber-500" : "text-slate-400 opacity-60 hover:opacity-100"}`}
                      title={favorites.includes(activeTab) ? (language === 'en' ? "Remove from favorites" : "Aus Favoriten entfernen") : (language === 'en' ? "Mark as favorite" : "Als Favorit markieren")}
                    >
                      <Star size={13} className={favorites.includes(activeTab) ? "fill-amber-500" : ""} />
                    </button>
                  </nav>
                );
              })()}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <LanguageSwitcher />
              <AccessibilityToolbar />
              <button 
                onClick={() => {
                  const next: 'standard' | 'wide' | 'full' = screenWidth === 'standard' ? 'wide' : screenWidth === 'wide' ? 'full' : 'standard';
                  setScreenWidth(next);
                  try {
                    localStorage.setItem('baustoffboard_screen_width', next);
                    localStorage.setItem('baustoffboard_fluid_width', next === 'full' ? 'true' : 'false');
                    window.dispatchEvent(new CustomEvent('baustoffboard_width_change', { detail: next }));
                  } catch {}
                }}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-text-main dark:text-white transition-colors border cursor-pointer ${
                  screenWidth === 'full' 
                    ? 'bg-shiraz text-white border-shiraz shadow-xs font-semibold' 
                    : screenWidth === 'wide'
                    ? 'bg-shiraz/10 border-shiraz/40 text-shiraz dark:text-rose-300 font-semibold'
                    : 'bg-off-white dark:bg-slate-800 hover:bg-home-grau/20 dark:hover:bg-slate-700 border-home-grau/20 dark:border-slate-700'
                }`}
                title={
                  screenWidth === 'standard'
                    ? (language === 'en' ? "Width: Standard 1152px (Click for Wide 1536px)" : "Bildschirmbreite: Standard 1152px (Klicken für Breit 1536px)")
                    : screenWidth === 'wide'
                    ? (language === 'en' ? "Width: Wide 1536px (Click for Full Width 100%)" : "Bildschirmbreite: Breit 1536px (Klicken für 100% Vollbild)")
                    : (language === 'en' ? "Width: Full 100% (Click for Standard 1152px)" : "Bildschirmbreite: 100% Vollbild (Klicken für Standard 1152px)")
                }
                aria-label="Bildschirmbreite anpassen"
              >
                {screenWidth === 'full' ? (
                  <Maximize2 size={14} className="text-white" />
                ) : screenWidth === 'wide' ? (
                  <LayoutGrid size={14} className="text-shiraz dark:text-rose-400" />
                ) : (
                  <Columns size={14} />
                )}
                <span className="text-xs font-medium leading-none select-none hidden lg:inline">
                  {screenWidth === 'standard' 
                    ? (language === 'en' ? 'Standard' : 'Standard (1152px)') 
                    : screenWidth === 'wide'
                    ? (language === 'en' ? 'Wide' : 'Breit (1536px)')
                    : (language === 'en' ? '100% Full' : '100% Vollbild')}
                </span>
              </button>
              <button 
                onClick={toggleTheme} 
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-off-white dark:bg-slate-800 hover:bg-home-grau/20 dark:hover:bg-slate-700 text-text-main dark:text-white transition-colors border border-home-grau/20 dark:border-slate-700 cursor-pointer"
                title={theme === 'light' ? (language === 'en' ? "Enable Dark Mode" : "Dunkelmodus aktivieren") : (language === 'en' ? "Enable Light Mode" : "Hellmodus aktivieren")}
                id="theme-toggle-btn"
              >
                {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
                <span className="text-xs font-medium leading-none select-none">{theme === 'light' ? t('themeDark') : t('themeLight')}</span>
              </button>
              <button onClick={handleExport} disabled={isExporting} className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-1.5 text-sm font-medium text-text-main dark:text-white bg-off-white dark:bg-slate-800 hover:bg-home-grau/20 dark:hover:bg-slate-750 border border-home-grau/20 dark:border-slate-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer">
                <Download size={16} />
                <span className="hidden sm:inline">{isExporting ? t('exporting') : t('exportPdf')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 custom-scrollbar" id="scroll-container">
        <div 
          data-fluid={screenWidth === 'full' ? "true" : "false"}
          data-width={screenWidth}
          className={`mx-auto flex flex-col min-h-full transition-all duration-200 ${
            screenWidth === 'full'
              ? 'w-full max-w-none'
              : screenWidth === 'wide'
              ? 'w-full max-w-[1536px]'
              : 'w-full max-w-6xl'
          }`}
        >
          <LanguageBanner />
          <div id="module-content" className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8 relative flex-1">
            <div className="hidden pdf-header mb-8 pb-4 border-b-2 border-shiraz">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-text-main">{t('testProtocol')}</h1>
                  <p className="text-sm text-text-main/80 mt-1">Modul: {(() => {
                    const tabObj = tabGroups.flatMap(g => g.tabs as unknown as any[]).find(t => t.id === activeTab);
                    return tabObj ? getTabLabel(tabObj.id, tabObj.label) : activeTab;
                  })()}</p>
                  <p className="text-sm text-text-main/80">{t('date')}: {new Date().toLocaleDateString(language === 'en' ? "en-US" : "de-DE")}</p>
                </div>
              </div>
            </div>
<React.Suspense fallback={<div className="flex justify-center items-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-shiraz"></div></div>}>
          {activeTab === 'start' && <Startseite />}
          {activeTab === 'nachhaltigkeit_daten_regeln' && <NachhaltigkeitDatenRegeln />}
          {activeTab === 'materialoptimierung' && <Materialoptimierung />}
          {activeTab === 'nachhaltigkeit_checklisten' && <NachhaltigkeitChecklisten />}
          {activeTab === 'oekobilanz_lca' && <OekobilanzLCA />}
          {activeTab === 'zertifizierung_siegel' && <ZertifizierungSiegel />}
          {activeTab === 'lebenszyklus_kosten' && <LebenszyklusKosten />}
          {activeTab === 'ressourcen_umwelt' && <RessourcenUmwelt />}
          {activeTab === 'kreislauf_dpp' && <Kreislaufwirtschaft />}
          {activeTab === 'bim_baustoffe' && <BimBaustoffe />}
          {activeTab === 'materialdatenbanken' && <Materialdatenbanken />}
          {activeTab === 'materialpaesse' && <Materialpaesse />}
          {activeTab === 'dpp' && <DppEpd view="dpp" />}
          {activeTab === 'ki_baustoffe' && <KiBaustoffe />}
          {activeTab === 'ki_ueberblick' && <KiBaustoffe forceTab="ueberblick" />}
          {activeTab === 'ki_system' && <KiBaustoffe forceTab="system" />}
          {activeTab === 'ki_prompting' && <KiBaustoffe forceTab="prompting" />}
          {activeTab === 'ki_llmpraxis' && <KiBaustoffe forceTab="llmpraxis" />}
          {activeTab === 'ki_thesen' && <KiBaustoffe forceTab="thesen" />}
          {activeTab === 'ki_recht_ethik' && <KiBaustoffe forceTab="recht_ethik" />}
          {activeTab === 'ki_lokal' && <KiBaustoffe forceTab="lokal" />}
          {activeTab === 'ki_ressourcen' && <KiBaustoffe forceTab="ressourcen" />}
          {activeTab === 'ki_onlinekurse' && <KiBaustoffe forceTab="onlinekurse" />}
          {activeTab === 'rechnung_u_wert' && <Beispielrechnungen forceTab="u_wert" />}
          {activeTab === 'rechnung_beton' && <Beispielrechnungen forceTab="beton" />}
          {activeTab === 'rechnung_stahlbeton' && <Beispielrechnungen forceTab="stahlbeton" />}
          {activeTab === 'rechnung_holzbau' && <Beispielrechnungen forceTab="holzbau" />}
          {activeTab === 'rechnung_mauerwerk' && <Beispielrechnungen forceTab="mauerwerk" />}
          {activeTab === 'rechnung_nachhaltigkeit' && <Beispielrechnungen forceTab="nachhaltigkeit" />}
          {activeTab === 'rechnung_bestand' && <Beispielrechnungen forceTab="bestand" />}
          {activeTab === 'rechnung_schallschutz' && <Beispielrechnungen forceTab="schallschutz" />}
          {activeTab === 'rechnung_brandschutz' && <Beispielrechnungen forceTab="brandschutz" />}
          {activeTab === 'impressum' && <Impressum />}
          {activeTab === 'datenschutz' && <Datenschutz />}
          {activeTab === 'versionen' && <Versionen />}
          {activeTab === 'einheiten' && <Einheiten />}
          {activeTab === 'baustoffkunde' && <Baustoffkunde />}
          {activeTab === 'baustoffkenngroessen' && <Baustoffkenngroessen />}
          {activeTab === 'formaenderungen' && <Formaenderungen />}
          {activeTab === 'analytik' && <Analytik />}
          {activeTab === 'labor' && <Labor />}
          {activeTab === 'mechanische_pruefungen' && <MechanischePruefungen />}
          {activeTab === 'messen_pruefen' && <MessenPruefen />}
          {activeTab === 'probenahme' && <Probenahme />}
          {activeTab === 'statistik' && <Statistik />}
          {activeTab === 'admin' && <Admin />}
          {activeTab === 'anleitung' && <Anleitung />}
          {activeTab === 'modulstruktur' && <Modulstruktur />}
          {activeTab === 'software' && <Software />}
          {activeTab === 'online_tools' && <OnlineTools />}
          {activeTab.startsWith('aufgaben') && <Aufgaben />}
          {activeTab === 'feedback' && <Feedback />}
          {activeTab === 'beton_info' && <BetonInfo />}
          {activeTab === 'grundlagen_info' && <ModuleInfo group="grundlagen" />}
          {activeTab === 'labor_info' && <ModuleInfo group="labor" />}
          {activeTab === 'baustoffe_info' && <ModuleInfo group="baustoffe" />}
          {activeTab === 'bauprodukte_info' && <ModuleInfo group="bauprodukte" />}
          {activeTab === 'stahlbeton_info' && <ModuleInfo group="stahlbeton" />}
          {activeTab === 'mechanik_info' && <ModuleInfo group="mechanik" />}
          {activeTab === 'bauphysik_info' && <ModuleInfo group="bauphysik" />}
          {activeTab === 'nachhaltigkeit_info' && <ModuleInfo group="nachhaltigkeit" />}
          {activeTab === 'digitales_info' && <ModuleInfo group="digitales" />}
          {activeTab === 'bestand_info' && <ModuleInfo group="bestand" />}
          {activeTab === 'rueckbau_info' && <ModuleInfo group="rueckbau" />}
          {activeTab === 'dauerhaftigkeit_info' && <ModuleInfo group="dauerhaftigkeit" />}
          {activeTab === 'schaeden_info' && <ModuleInfo group="schaeden" />}
          {activeTab === 'instandsetzung_info' && <ModuleInfo group="instandsetzung" />}
          {activeTab === 'praxiswissen_info' && <ModuleInfo group="praxiswissen" />}
          {activeTab === 'beton_a_z' && <BetonAZ />}
          {activeTab === 'grundlagen' && <Grundlagen />}
          {activeTab === 'bindemittel' && <Bindemittel />}
          {activeTab === 'mischungsberechnung' && <Mischungsberechnung />}
          {activeTab === 'frischbeton' && <Frischbeton />}
          {activeTab === 'herstellung_einbau' && <HerstellungEinbau />}
          {activeTab === 'hydratation_folgen' && <HydratationFolgen />}
          {activeTab === 'nachbehandlung' && <Nachbehandlung />}
          {activeTab === 'festbeton' && <Festbeton />}
          {activeTab === 'sichtbeton' && <Sichtbeton />}
          {activeTab === 'festbeton_statistik' && <FestbetonStatistik />}
          {activeTab === 'sicherheitskonzept' && <Sicherheitskonzept />}
          {activeTab === 'sonderbetone' && <Sonderbetone />}
          {activeTab === 'innovative_werkstoffe' && <InnovativeWerkstoffe />}
          {activeTab === 'qualitaetssicherung' && <Qualitaetssicherung />}
          {activeTab === 'betonpraxis' && <Betonpraxis />}
          {activeTab === 'expositionsklassen' && <Betonpraxis initialSubTab="krell_tabelle" />}
          {activeTab === 'korrosion' && <Korrosion />}
          {activeTab === 'schadreaktionen_beton' && <SchadreaktionenBeton />}
          {activeTab === 'zwang' && <ZwangCalculator />}
          {activeTab === 'eigenspannungen' && <Eigenspannungen />}
          {activeTab === 'kriechen' && <KriechenSchwinden />}
          {activeTab === 'wu-bauwerke' && <WUBauwerke />}
          
          {activeTab === 'materialkennwerte' && <Materialkennwerte />}
          {activeTab === 'holz' && <Holz />}
          {activeTab === 'holzwerkstoffe' && <Holzwerkstoffe />}
          {activeTab === 'festigkeit' && <Festigkeitsberechnungen />}
          {(activeTab === 'stahlbeton_bemessung' || activeTab === 'spannung' || activeTab === 'biegebemessung' || activeTab === 'querkraftbemessung' || activeTab === 'stuetzenbemessung' || activeTab === 'durchstanzen' || activeTab === 'verankerungslaenge' || activeTab === 'rissbreite') && (
            <Stahlbetonbemessung
              initialTab={
                activeTab === 'spannung'
                  ? 'spannung'
                  : activeTab === 'querkraftbemessung'
                  ? 'querkraftbemessung'
                  : activeTab === 'stuetzenbemessung'
                  ? 'stuetzenbemessung'
                  : activeTab === 'durchstanzen'
                  ? 'durchstanzen'
                  : activeTab === 'verankerungslaenge'
                  ? 'verankerungslaenge'
                  : activeTab === 'rissbreite'
                  ? 'rissbreite'
                  : activeTab === 'biegebemessung'
                  ? 'biegebemessung'
                  : 'spannung'
              }
            />
          )}
          {activeTab === 'erdbau' && <Erdbau />}
          {activeTab === 'stahl' && <Stahl />}
          {activeTab === 'bp_stahlbauprofile' && <BpStahlbauprofile />}
          {activeTab === 'mauerwerk' && <Mauerwerk />}
          {activeTab === 'glas' && <Glas />}
          {activeTab === 'asphalt' && <Asphalt />}
          {activeTab === 'putzemoertel' && <PutzeMoertel />}
          {activeTab === 'gesteine' && <Gesteine />}
          {activeTab === 'bauchemie' && <Bauchemie />}
          {activeTab === 'faserverbund' && <Faserverbund />}
          {activeTab === 'kunststoffe' && <Kunststoffe />}
          {activeTab === 'nawaro' && <Nawaro />}
          {activeTab === 'lehm' && <Lehm />}
          {activeTab === 'bp_lehmbauprodukte' && <BpLehmbauprodukte />}
          {activeTab === 'bp_baustoffindustrie' && <BpBaustoffindustrie />}
          {activeTab === 'bp_innovationen' && <BpInnovationen />}
          {activeTab === 'metalle' && <Metalle />}
          {activeTab === 'innenausbau' && <Innenausbau />}
          {activeTab === 'ausbau' && <Ausbau />}
          {activeTab === 'gips' && <Gips />}
          {activeTab === 'kalk' && <Kalk />}
          {activeTab === 'daemmstoffe' && <Daemmstoffe />}
          {activeTab === 'materialitaet_architektur' && <MaterialitaetArchitektur />}
          {activeTab === 'bp_rechtliches' && <BpRechtliches />}
          {activeTab === 'bp_recht_grundlagen' && <BpRechtliches isEmbedded={false} activeSubTab="grundlagen" />}
          {activeTab === 'bp_recht_avcp' && <BpRechtliches isEmbedded={false} activeSubTab="avcp" />}
          {activeTab === 'bp_recht_konformitaet' && <BpRechtliches isEmbedded={false} activeSubTab="begriffe" />}
          {activeTab === 'bp_recht_normen' && <BpRechtliches isEmbedded={false} activeSubTab="normenarbeit" />}
          {activeTab === 'bp_trockenbau' && <BpTrockenbau />}
          {activeTab === 'bp_beton' && <BpBeton />}
          {activeTab === 'bp_betonfertigteile' && <BpBetonfertigteile />}
          {activeTab === 'bp_betonwaren' && <BpBetonwaren />}
          {activeTab === 'bp_mauerwerk' && <BpMauerwerk />}
          {activeTab === 'bp_verkehrswegebau' && <BpVerkehrswegebau />}
          {activeTab === 'bp_verkehr_rsto' && <BpVerkehrswegebau initialTab="rsto_rechner" />}
          {activeTab === 'bp_verkehr_asphalt' && <BpVerkehrswegebau initialTab="vergleich" />}
          {activeTab === 'bp_verkehr_bitumen' && <BpVerkehrswegebau initialTab="bindemittel" />}
          {activeTab === 'bp_verkehr_pruefung' && <BpVerkehrswegebau initialTab="prueftechnik" />}
          {activeTab === 'bp_verkehr_betondecken' && <BpVerkehrswegebau initialTab="betondecken" />}
          {activeTab === 'bp_verkehr_tiefbau' && <BpVerkehrswegebau initialTab="tiefbau" />}
          {activeTab === 'bp_verkehr_bahn' && <BpVerkehrswegebau initialTab="bahnbau" />}
          {activeTab === 'bp_verkehr_tunnel' && <BpVerkehrswegebau initialTab="tunnelbau" />}
          {activeTab === 'bp_abdichtung' && <BpAbdichtung />}
          {activeTab === 'bp_daemmung' && <BpDaemmung />}
          {activeTab === 'bp_putz_estrich' && <BpPutzEstrich />}
          {activeTab === 'bp_holzprodukte' && <BpHolzprodukte />}
          {activeTab === 'bp_dach_fassade' && <BpDachFassade />}
          {activeTab === 'bp_befestigung' && <BpBefestigung />}
          {activeTab === 'bp_kunststoffe' && <BpKunststoffe />}
          {activeTab === 'bp_klebstoffe' && <BpKlebstoffe />}
          {activeTab === 'bp_farben_lacke' && <BpFarbenLacke />}
          {activeTab === 'bp_mineralisch' && <BpMineralisch />}
          {activeTab === 'bp_glaeser' && <BpGlaeser />}
          {activeTab === 'bp_metallisch' && <BpMetallisch />}
          {activeTab === 'bp_betonzusatzmittel' && <BpBetonzusatzmittel />}
          {activeTab === 'sonstiges' && <Sonstiges />}
          {activeTab === 'mechanische_kenngroessen' && <MechanischeKenngroessen />}
          {activeTab === 'materialmodelle' && <Materialmodelle />}
          {activeTab === 'bruchmechanik' && <Bruchmechanik />}
          {activeTab === 'knicken' && <Knicken />}
          {activeTab === 'baustatik' && <Baustatik />}
          {activeTab === 'bodenmechanik' && <Bodenmechanik />}
          {activeTab === 'bauphysik' && <Bauphysik />}
          {activeTab === 'feuchteschutz' && <Feuchteschutz />}
          {activeTab === 'schallschutz' && <Schallschutz />}
          {activeTab === 'brandschutz' && <Brandschutz />}
          {activeTab === 'energieausweis' && <Energieausweis />}
          {activeTab === 'emodul' && <EModul />}
          {activeTab === 'carbonbeton' && <Carbonbeton />}
          
          {/* Holzbau */}
          {activeTab === 'holzbau_info' && <HolzbauBeta activeSubTab="info" />}
          {activeTab === 'holzbau_werkstoffe' && <HolzbauBeta activeSubTab="werkstoffe" />}
          {activeTab === 'holzbau_konstruktion' && <HolzbauBeta activeSubTab="konstruktion" />}
          {activeTab === 'holzbau_bemessung' && <HolzbauBeta activeSubTab="bemessung" />}
          {activeTab === 'holzbau_verbindung' && <HolzbauBeta activeSubTab="verbindung" />}
          {activeTab === 'holzbau_bauphysik' && <HolzbauBeta activeSubTab="bauphysik" />}

          {activeTab === 'waermeeigenschaften' && <Waermeeigenschaften />}
          {activeTab === 'daemmung_vergleich' && <DaemmungVergleich />}
          {activeTab === 'spannbeton' && <Spannbeton />}
          {/* Info */}
          {activeTab === 'glossar' && <Glossar />}
          {activeTab === 'regularien' && <Regularien />}
          {activeTab === 'fortbildungen' && <Fortbildungen />}
          {activeTab === 'informationsquellen' && <Informationsquellen />}
          {activeTab === 'literatur' && <Literatur />}
          
          {/* Bauen im Bestand */}
          {activeTab === 'bestand' && <Bestand />}

          {activeTab === 'bauwerkserfassung' && <Bauwerkserfassung />}
          {activeTab === 'zfp' && <Bauwerksuntersuchung />}
          {activeTab === 'bauwerksuntersuchung' && <Bauwerksuntersuchung />}
          {activeTab === 'historisch' && <HistorischeMaterialkennwerte />}
          {activeTab === 'historische_bauweisen' && <HistorischeBauweisen />}
          {activeTab === 'historische_bauprodukte' && <HistorischeBauprodukte />}
          {activeTab === 'schadstoffe' && <Schadstoffe />}
          {activeTab === 'ressourceneffizienz' && <Ressourceneffizienz />}
          {activeTab === 'vdi6200' && <Zustandsbewertung />}
          {activeTab === 'abfaelle' && <Abfaelle />}
          {activeTab === 'rueckbau' && <Rueckbau />}
          {activeTab === 'boden_materialaufbereitung' && <BodenMaterialAufbereitung />}
          {activeTab === 'rueckbau_checklisten' && <RueckbauChecklisten />}
          {activeTab === 'bestand_checklisten' && <BestandChecklisten />}
          {activeTab === 'wta' && <WTA />}
          {activeTab === 'denkmalpflege' && <Denkmalpflege />}
          {activeTab === 'modernisierung' && <Modernisierung />}
          
          {/* Nachhaltigkeit & Digitales */}
          
          
          
          
          
          
          
          
          
          
          
          
          
          {/* Lebenszyklus */}
          {activeTab === 'dauerhaftigkeit' && <Dauerhaftigkeit />}
          {activeTab === 'dauerhaftigkeit_checklisten' && <DauerhaftigkeitChecklisten />}
          {activeTab === 'holzkorrosion' && <Holzkorrosion />}
          {activeTab === 'metallkorrosion' && <Metallkorrosion />}
          {activeTab === 'weitere_organik' && <WeitereOrganik />}
          {/* Schäden */}
          {activeTab === 'bauschaeden' && <Bauschaeden />}
          {activeTab === 'schadensbilder' && <TypischeBauschaeden />}
          {activeTab === 'material_schaeden_gross' && <MaterialSchaedenGross />}
          {activeTab === 'bauwerksunters_monitoring' && <Bauwerksunters_Monitoring />}
          {activeTab === 'schaeden_checklisten' && <SchaedenChecklisten />}
          
          {/* Schutz & Instandsetzung */}
          {activeTab === 'schutz_grundlagen' && <SchutzGrundlagen />}
          {activeTab === 'instandhaltung' && <Stahlbetoninstandhaltung />}
          {(activeTab === 'instandsetzung_materialien' || activeTab === 'instandsetzung_holz' || activeTab === 'instandsetzung_metalle' || activeTab === 'instandsetzung_kunststoffe' || activeTab === 'instandsetzung_asphalt' || activeTab === 'instandsetzung_mauerwerk') && (
            <InstandsetzungMaterialien
              initialMaterial={
                activeTab === 'instandsetzung_holz' ? 'holz' :
                activeTab === 'instandsetzung_metalle' ? 'metalle' :
                activeTab === 'instandsetzung_kunststoffe' ? 'kunststoffe' :
                activeTab === 'instandsetzung_asphalt' ? 'asphalt' :
                activeTab === 'instandsetzung_mauerwerk' ? 'mauerwerk' : undefined
              }
            />
          )}
          {activeTab === 'instandsetzung_checklisten' && <InstandsetzungChecklisten />}
          
          {/* Praxiswissen */}
          {activeTab === 'px_planung' && <Praxiswissen />}
          {activeTab === 'px_bauleitung' && <Praxiswissen />}
          {activeTab === 'px_bautagebuch' && <Bautagebuch />}
          {activeTab === 'px_produktion' && <Praxiswissen />}
          {activeTab === 'px_karriere' && <Praxiswissen />}
          {(activeTab === 'weiter_tha' || activeTab === 'weiter_bauing' || activeTab === 'weiter_pm' || activeTab === 'weiter_ausbau' || activeTab === 'weiter_fassade' || activeTab === 'weiter_holzbau' || activeTab === 'weiter_ttz' || activeTab === 'weiter_mapr') && <WeiterTHA />}
          {(activeTab === 'vl_ueberblick' || activeTab === 'vl_bauen_im_bestand' || activeTab === 'vl_nachhaltiges_bauen' || activeTab === 'vl_bauschaeden' || activeTab === 'vl_baustoffkunde' || activeTab === 'vl_instandhaltung') && (
            <Vorlesungen
              forceTab={
                activeTab === 'vl_nachhaltiges_bauen'
                  ? 'nachhaltiges_bauen'
                  : activeTab === 'vl_bauschaeden'
                  ? 'bauschaeden'
                  : activeTab === 'vl_baustoffkunde'
                  ? 'baustoffkunde'
                  : activeTab === 'vl_instandhaltung'
                  ? 'instandhaltung'
                  : 'bauen_im_bestand'
              }
            />
          )}
          {activeTab === 'studium_tha' && <StudiumTHA />}
          {activeTab === 'thesen_projekte' && <ThesenProjekte />}
          {activeTab === 'kuriositaeten' && <Kuriositaeten />}
          {activeTab === 'labor_sicherheit' && <LaborSicherheit />}
          </React.Suspense>
          </div>

          {/* Global Footer */}
          <footer className="mt-12 pt-6 pb-8 border-t border-home-grau/20 text-xs text-text-main/70 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-2">
              <span>BaustoffBoard · Prof. Dr.-Ing. Jürgen Huber · Fakultät für Architektur und Bauwesen</span>
            </div>
            <div className="flex items-center gap-3 font-medium">
              <button
                onClick={() => setActiveTab('datenschutz')}
                className="hover:text-shiraz transition-colors cursor-pointer text-text-main/80"
              >
                Datenschutz
              </button>
              <span>·</span>
              <button
                onClick={() => setActiveTab('impressum')}
                className="hover:text-shiraz transition-colors cursor-pointer text-text-main/80"
              >
                Impressum
              </button>
              <span>·</span>
              <button
                onClick={() => setActiveTab('feedback')}
                className="hover:text-shiraz transition-colors cursor-pointer text-text-main/80"
              >
                Feedback
              </button>
              <span>·</span>
              <button
                onClick={() => setActiveTab('admin')}
                className="hover:text-shiraz transition-colors cursor-pointer text-text-main/80 flex items-center gap-1"
                title="Administrator-Bereich & Audit-Dashboard (THA)"
              >
                <ShieldCheck size={12} className="text-shiraz" /> Admin
              </button>
            </div>
          </footer>
        </div>
      </main>
    </div>

    {/* SEO-Metadaten Audit-Modal */}
    <MetadataAuditModal
      isOpen={showMetadataModal}
      onClose={() => setShowMetadataModal(false)}
      tabGroups={tabGroups}
      tabDescriptions={TAB_DESCRIPTIONS}
      groupToCluster={GROUP_TO_CLUSTER}
      onSelectTab={(tabId) => {
        setActiveTab(tabId as any);
        setShowMetadataModal(false);
      }}
    />
  </div>
);
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fdf2f4', color: '#881235', fontFamily: 'sans-serif' }}>
          <h2>Etwas ist schiefgelaufen. (React Error)</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{this.state.error?.toString()}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '10px', marginTop: '10px' }}>{this.state.error?.stack}</pre>
          <button onClick={() => { this.setState({hasError: false}); window.localStorage.clear(); window.location.reload(); }} style={{ marginTop: '20px', padding: '10px', background: '#881235', color: 'white', border: 'none', borderRadius: '4px' }}>
            App neu laden (Local Storage leeren)
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy loaded modules
const Vorlesungen = React.lazy(() => import('./modules/Vorlesungen'));
const NachhaltigkeitDatenRegeln = React.lazy(() => import('./modules/NachhaltigkeitDatenRegeln'));
const OekobilanzLCA = React.lazy(() => import('./modules/OekobilanzLCA'));
const ZertifizierungSiegel = React.lazy(() => import('./modules/ZertifizierungSiegel'));
const LebenszyklusKosten = React.lazy(() => import('./modules/LebenszyklusKosten'));
const RessourcenUmwelt = React.lazy(() => import('./modules/RessourcenUmwelt'));
const Kreislaufwirtschaft = React.lazy(() => import('./modules/Kreislaufwirtschaft'));
const BimBaustoffe = React.lazy(() => import('./modules/BimBaustoffe'));
const Materialdatenbanken = React.lazy(() => import('./modules/Materialdatenbanken'));
const Materialpaesse = React.lazy(() => import('./modules/Materialpaesse'));
const DppEpd = React.lazy(() => import('./modules/DppEpd'));
const KiBaustoffe = React.lazy(() => import('./modules/KiBaustoffe'));
const Beispielrechnungen = React.lazy(() => import('./modules/Beispielrechnungen'));
const Startseite = React.lazy(() => import('./modules/Startseite'));
const Admin = React.lazy(() => import('./modules/Admin'));
const Anleitung = React.lazy(() => import('./modules/Anleitung'));
const Modulstruktur = React.lazy(() => import('./modules/Modulstruktur'));
const Feedback = React.lazy(() => import('./modules/Feedback'));
const Frischbeton = React.lazy(() => import('./modules/Frischbeton'));
const FestbetonStatistik = React.lazy(() => import('./modules/FestbetonStatistik'));
const Sicherheitskonzept = React.lazy(() => import('./modules/Sicherheitskonzept'));
const Qualitaetssicherung = React.lazy(() => import('./modules/Qualitaetssicherung'));
const Betonpraxis = React.lazy(() => import('./modules/Betonpraxis'));
const Korrosion = React.lazy(() => import('./modules/Korrosion'));
const SpannungDehnung = React.lazy(() => import('./modules/SpannungDehnung'));
const Holz = React.lazy(() => import('./modules/Holz'));
const Hydratation = React.lazy(() => import('./modules/Hydratation'));
const IntegrationVerformungen = React.lazy(() => import('./modules/IntegrationVerformungen'));
const KriechenSchwinden = React.lazy(() => import('./modules/KriechenSchwinden'));
const Rissbreite = React.lazy(() => import('./modules/Rissbreite'));
const Nachbehandlung = React.lazy(() => import('./modules/Nachbehandlung'));
const Festbeton = React.lazy(() => import('./modules/Festbeton'));
const Materialkennwerte = React.lazy(() => import('./modules/Materialkennwerte'));
const Regularien = React.lazy(() => import('./modules/Regularien'));
const Festigkeitsberechnungen = React.lazy(() => import('./modules/Festigkeitsberechnungen'));
const Mauerwerk = React.lazy(() => import('./modules/Mauerwerk'));
const Erdbau = React.lazy(() => import('./modules/Erdbau'));
const Glas = React.lazy(() => import('./modules/Glas'));
const Bauphysik = React.lazy(() => import('./modules/Bauphysik'));
const Schallschutz = React.lazy(() => import('./modules/Schallschutz'));
const Grundlagen = React.lazy(() => import('./modules/Grundlagen'));
const BetonInfo = React.lazy(() => import('./modules/BetonInfo'));
const ModuleInfo = React.lazy(() => import('./modules/ModuleInfo'));
const BetonAZ = React.lazy(() => import('./modules/BetonAZ'));
const Bindemittel = React.lazy(() => import('./modules/Bindemittel'));
const Mischungsberechnung = React.lazy(() => import('./modules/Mischungsberechnung'));
const ZfP = React.lazy(() => import('./modules/ZfP'));
const HistorischeMaterialkennwerte = React.lazy(() => import('./modules/HistorischeMaterialkennwerte'));
const HistorischeBauweisen = React.lazy(() => import('./modules/HistorischeBauweisen'));
const HistorischeBauprodukte = React.lazy(() => import('./modules/HistorischeBauprodukte'));
const Stahlbetoninstandhaltung = React.lazy(() => import('./modules/Stahlbetoninstandhaltung').then(module => ({ default: module.Stahlbetoninstandhaltung })));
const Asphalt = React.lazy(() => import('./modules/Asphalt'));
const Faserverbund = React.lazy(() => import('./modules/Faserverbund'));
const Lehm = React.lazy(() => import('./modules/Lehm'));
const BpLehmbauprodukte = React.lazy(() => import('./modules/BpLehmbauprodukte'));
const BpBaustoffindustrie = React.lazy(() => import('./modules/BpBaustoffindustrie'));
const BpInnovationen = React.lazy(() => import('./modules/BpInnovationen'));
const Kunststoffe = React.lazy(() => import('./modules/Kunststoffe'));
const Brandschutz = React.lazy(() => import('./modules/Brandschutz'));
const Energieausweis = React.lazy(() => import('./modules/Energieausweis'));
const Bruchmechanik = React.lazy(() => import('./modules/Bruchmechanik'));
const SchadreaktionenBeton = React.lazy(() => import('./modules/SchadreaktionenBeton'));
const ZwangCalculator = React.lazy(() => import('./modules/Zwang').then(module => ({ default: module.ZwangCalculator })));
const Eigenspannungen = React.lazy(() => import('./modules/Eigenspannungen'));
const Recyclingbeton = React.lazy(() => import('./modules/Recyclingbeton'));
const Bodenmechanik = React.lazy(() => import('./modules/Bodenmechanik'));
const WUBauwerke = React.lazy(() => import('./modules/WUBauwerke'));
const Baustatik = React.lazy(() => import('./modules/Baustatik'));
const Knicken = React.lazy(() => import('./modules/Knicken'));
const MechanischeKenngroessen = React.lazy(() => import('./modules/MechanischeKenngroessen'));
const HydratationFolgen = React.lazy(() => import('./modules/HydratationFolgen'));
const Sonderbetone = React.lazy(() => import('./modules/Sonderbetone'));
const Stahlbetonbemessung = React.lazy(() => import('./modules/Stahlbetonbemessung'));
const Impressum = React.lazy(() => import('./modules/Impressum'));
const Versionen = React.lazy(() => import('./modules/Versionen'));
const Bauchemie = React.lazy(() => import('./modules/Bauchemie').then(module => ({ default: module.Bauchemie })));
const Aufgaben = React.lazy(() => import('./modules/Aufgaben'));
const Praxisbeispiele = React.lazy(() => import('./modules/Praxisbeispiele'));
const EModul = React.lazy(() => import('./modules/EModul'));
const Carbonbeton = React.lazy(() => import('./modules/Carbonbeton'));
const Waermeeigenschaften = React.lazy(() => import('./modules/Waermeeigenschaften'));
const Spannbeton = React.lazy(() => import('./modules/Spannbeton'));
const Stahl = React.lazy(() => import('./modules/Stahl'));
const BpStahlbauprofile = React.lazy(() => import('./modules/BpStahlbauprofile'));
const Glossar = React.lazy(() => import('./modules/Glossar'));
const Dauerhaftigkeit = React.lazy(() => import('./modules/Dauerhaftigkeit'));
const Holzkorrosion = React.lazy(() => import('./modules/Holzkorrosion'));
const Metallkorrosion = React.lazy(() => import('./modules/Metallkorrosion'));
const WeitereOrganik = React.lazy(() => import('./modules/WeitereOrganik'));
const Schadstoffe = React.lazy(() => import('./modules/Schadstoffe'));
const Ressourceneffizienz = React.lazy(() => import('./modules/Ressourceneffizienz'));
const BodenMaterialAufbereitung = React.lazy(() => import('./modules/BodenMaterialAufbereitung'));
const Abfaelle = React.lazy(() => import('./modules/Abfaelle'));
const Materialoptimierung = React.lazy(() => import('./modules/Materialoptimierung'));
const NachhaltigkeitChecklisten = React.lazy(() => import('./modules/NachhaltigkeitChecklisten'));
const Rueckbau = React.lazy(() => import('./modules/Rueckbau'));
const RueckbauChecklisten = React.lazy(() => import('./modules/RueckbauChecklisten'));
const BestandChecklisten = React.lazy(() => import('./modules/BestandChecklisten'));
const DauerhaftigkeitChecklisten = React.lazy(() => import('./modules/DauerhaftigkeitChecklisten'));
const SchaedenChecklisten = React.lazy(() => import('./modules/SchaedenChecklisten'));
const SchutzGrundlagen = React.lazy(() => import('./modules/SchutzGrundlagen'));
const InstandsetzungMaterialien = React.lazy(() => import('./modules/InstandsetzungMaterialien'));
const InstandsetzungChecklisten = React.lazy(() => import('./modules/InstandsetzungChecklisten'));
const Zustandsbewertung = React.lazy(() => import('./modules/Zustandsbewertung'));
const WTA = React.lazy(() => import('./modules/WTA'));
const Denkmalpflege = React.lazy(() => import('./modules/Denkmalpflege'));
const Modernisierung = React.lazy(() => import('./modules/Modernisierung'));
const Bestand = React.lazy(() => import('./modules/Bestand'));
const Bauwerkserfassung = React.lazy(() => import('./modules/Bauwerkserfassung'));
const Informationsquellen = React.lazy(() => import('./modules/Informationsquellen'));
const Fortbildungen = React.lazy(() => import('./modules/Fortbildungen'));
const Feuchteschutz = React.lazy(() => import('./modules/Feuchteschutz'));
const Bauwerksuntersuchung = React.lazy(() => import('./modules/Bauwerksuntersuchung'));
const Bauwerksunters_Monitoring = React.lazy(() => import('./modules/Bauwerksunters_Monitoring'));
const Metalle = React.lazy(() => import('./modules/Metalle'));
const Ausbau = React.lazy(() => import('./modules/Ausbau'));
const Innenausbau = React.lazy(() => import('./modules/Innenausbau'));
const BpTrockenbau = React.lazy(() => import('./modules/BpTrockenbau'));
const BpMauerwerk = React.lazy(() => import('./modules/BpMauerwerk'));
const BpVerkehrswegebau = React.lazy(() => import('./modules/BpVerkehrswegebau'));
const BpBeton = React.lazy(() => import('./modules/BpBeton'));
const BpBetonfertigteile = React.lazy(() => import('./modules/BpBetonfertigteile'));
const BpBetonwaren = React.lazy(() => import('./modules/BpBetonwaren'));
const BpAbdichtung = React.lazy(() => import('./modules/BpAbdichtung'));
const BpDaemmung = React.lazy(() => import('./modules/BpDaemmung'));
const BpPutzEstrich = React.lazy(() => import('./modules/BpPutzEstrich'));
const BpHolzprodukte = React.lazy(() => import('./modules/BpHolzprodukte'));
const BpDachFassade = React.lazy(() => import('./modules/BpDachFassade'));
const BpBefestigung = React.lazy(() => import('./modules/BpBefestigung'));
const BpKunststoffe = React.lazy(() => import('./modules/BpKunststoffe'));
const BpKlebstoffe = React.lazy(() => import('./modules/BpKlebstoffe'));
const BpFarbenLacke = React.lazy(() => import('./modules/BpFarbenLacke'));
const BpMineralisch = React.lazy(() => import('./modules/BpMineralisch'));
const BpGlaeser = React.lazy(() => import('./modules/BpGlaeser'));
const BpMetallisch = React.lazy(() => import('./modules/BpMetallisch'));
const BpBetonzusatzmittel = React.lazy(() => import('./modules/BpBetonzusatzmittel'));
const BpRechtliches = React.lazy(() => import('./modules/BpRechtliches'));
const HerstellungEinbau = React.lazy(() => import('./modules/HerstellungEinbau'));
const Sichtbeton = React.lazy(() => import('./modules/Sichtbeton'));
const Labor = React.lazy(() => import('./modules/Labor'));
const MechanischePruefungen = React.lazy(() => import('./modules/MechanischePruefungen'));
const MessenPruefen = React.lazy(() => import('./modules/MessenPruefen'));
const Analytik = React.lazy(() => import('./modules/Analytik'));
const Probenahme = React.lazy(() => import('./modules/Probenahme'));
const Bauschaeden = React.lazy(() => import('./modules/Bauschaeden'));
const TypischeBauschaeden = React.lazy(() => import('./modules/TypischeBauschaeden'));
const MaterialSchaedenGross = React.lazy(() => import('./modules/MaterialSchaedenGross'));
const Statistik = React.lazy(() => import('./modules/Statistik'));
const Literatur = React.lazy(() => import('./modules/Literatur'));
const Baustoffkunde = React.lazy(() => import('./modules/Baustoffkunde'));
const Baustoffkenngroessen = React.lazy(() => import('./modules/Baustoffkenngroessen'));
const Leichtbeton = React.lazy(() => import('./modules/Leichtbeton'));
const Spritzbeton = React.lazy(() => import('./modules/Spritzbeton'));
const Einheiten = React.lazy(() => import('./modules/Einheiten'));
const Holzwerkstoffe = React.lazy(() => import('./modules/Holzwerkstoffe'));
const Materialmodelle = React.lazy(() => import('./modules/Materialmodelle'));
const PutzeMoertel = React.lazy(() => import('./modules/PutzeMoertel'));
const Gesteine = React.lazy(() => import('./modules/Gesteine'));
const Sonstiges = React.lazy(() => import('./modules/Sonstiges'));
const Gips = React.lazy(() => import('./modules/Gips'));
const Kalk = React.lazy(() => import('./modules/Kalk'));
const Daemmstoffe = React.lazy(() => import('./modules/Daemmstoffe'));
const MaterialitaetArchitektur = React.lazy(() => import('./modules/MaterialitaetArchitektur'));
const Software = React.lazy(() => import('./modules/Software'));
const OnlineTools = React.lazy(() => import('./modules/OnlineTools'));
const Formaenderungen = React.lazy(() => import('./modules/Formaenderungen'));
const DaemmungVergleich = React.lazy(() => import('./modules/DaemmungVergleich'));
const InnovativeWerkstoffe = React.lazy(() => import('./modules/InnovativeWerkstoffe'));
const Praxiswissen = React.lazy(() => import('./modules/Praxiswissen'));
const Bautagebuch = React.lazy(() => import('./modules/Bautagebuch'));
const WeiterTHA = React.lazy(() => import('./modules/WeiterTHA'));
const StudiumTHA = React.lazy(() => import('./modules/StudiumTHA'));
const Nawaro = React.lazy(() => import('./modules/Nawaro'));
const HolzbauBeta = React.lazy(() => import('./modules/HolzbauBeta'));
const ThesenProjekte = React.lazy(() => import('./modules/ThesenProjekte'));
const Kuriositaeten = React.lazy(() => import('./modules/Kuriositaeten'));
const Datenschutz = React.lazy(() => import('./modules/Datenschutz'));
const LaborSicherheit = React.lazy(() => import('./modules/LaborSicherheit'));

export default function App() {
  return (
    <ErrorBoundary>
      <TabProvider>
        <AppContent />
      </TabProvider>
    </ErrorBoundary>
  );
}

