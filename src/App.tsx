import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect } from 'react';
import {
  MoreHorizontal,
  Calculator,
  Globe,
  GraduationCap,
  Activity,
  Trees,
  Download,
  Layers,
  Droplets,
  Scale,
  LayoutGrid,
  Maximize2,
  Thermometer,
  Leaf,
  Mountain,
  FileText,
  Recycle,
  Wrench,
  AlertTriangle,
  Columns,
  Home,
  Monitor,
  ClipboardCheck,
  Building2,
  Landmark,
  Search,
  Compass,
  Factory,
  Menu,
  X,
  Microscope,
  FileWarning,
  Shield,
  ShieldCheck,
  Info,
  Sparkles,
  Sun,
  Moon,
  ChevronRight,
  Star
} from 'lucide-react';

import { TabProvider, useTabContext } from './contexts/TabContext';
import { useLanguage } from './contexts/LanguageContext';
import { LanguageSwitcher } from './components/navigation/LanguageSwitcher';
import { LanguageBanner } from './components/navigation/LanguageBanner';
import { TAB_DESCRIPTIONS } from './metaDescriptions';
import { AccessibilityToolbar } from './components/a11y/AccessibilityToolbar';
import { MetadataAuditModal } from './components/seo/MetadataAuditModal';
import { META_CLUSTERS, GROUP_TO_CLUSTER } from './data/metaClusters';
import { NAV_TAB_GRUPPEN, TAB_KEYWORDS, MODUL_BY_ID } from './registry/modules';
import { CalculatorDisclaimerBanner } from './components/ui/CalculatorDisclaimerBanner';
import { grenzenFuer } from './data/rechnerGrenzen';
import { LERNZIELE } from './data/lernziele';
import { ModulLernziele } from './components/ui/ModulLernziele';
import { ErkundungsAuftrag } from './components/ui/ErkundungsAuftrag';
import { ModulKurzfassung } from './components/ui/ModulKurzfassung';
import { KURZFASSUNG } from './data/kurzfassung';
import { ERKUNDUNG } from './data/erkundung';
import { ModulTest } from './components/quiz/ModulTest';
import { MODULTEST_IN_APP } from './data/quizZuordnung';
import { iconFor } from './registry/icons';
import { useAutoFormLabels } from './components/a11y/useAutoFormLabels';
import { VolltextTreffer } from './components/navigation/VolltextTreffer';
import StudentPollVoteView from './components/polls/StudentPollVoteView';
import { CURRENT_VERSION } from './data/versionData';

// Menü wird aus der zentralen Modul-Registry erzeugt (src/registry/modules.ts)
const tabGroups = NAV_TAB_GRUPPEN.map(g => ({
  name: g.name,
  tabs: g.tabs.map(t => ({ id: t.id, label: t.label, icon: iconFor(t.icon) })),
}));

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
      // Als Start immer(!) nur Feedback-Modul in den Favoriten
      localStorage.setItem('baustoffboard_favorites', JSON.stringify(['feedback']));
    } catch {}
    return ['feedback'];
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
  const [mobilWerkzeugeOffen, setMobilWerkzeugeOffen] = useState(false);
  useAutoFormLabels('module-content', activeTab);
  useEffect(() => { setMobilWerkzeugeOffen(false); }, [activeTab]);
  useEffect(() => {
    if (!mobilWerkzeugeOffen) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobilWerkzeugeOffen(false); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [mobilWerkzeugeOffen]);
  // Schmale Ansicht: geschlossene Seitenleiste per inert aus Tastatur- und Screenreader-Reihenfolge nehmen (Phase 2, AP 2.3)
  const [istSchmal, setIstSchmal] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const aendern = () => setIstSchmal(mq.matches);
    mq.addEventListener('change', aendern);
    return () => mq.removeEventListener('change', aendern);
  }, []);
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
      setOpenDropdown('CLOSED_ALLGEMEIN');
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

  // Exklusives Aufklappen: Wenn ein Hauptmenüpunkt (I-VII) aufgeklappt wird, klappen alle anderen sowie das Start-Menü automatisch zu
  const toggleCluster = (clusterId: string) => {
    const willBeOpen = !openClusters[clusterId];
    setOpenClusters(prev => {
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

    // Start-Menü sowie Untermenüs anderer Hauptmenüpunkte schließen
    if (willBeOpen) {
      setOpenDropdown('CLOSED_ALLGEMEIN');
    } else {
      setOpenDropdown(prev => {
        if (!prev) return null;
        const targetCluster = META_CLUSTERS.find(c => c.id === clusterId);
        if (targetCluster && targetCluster.groupNames.includes(prev)) {
          return prev;
        }
        return null;
      });
    }
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
    const { exportToPDF } = await import('./lib/pdfExport');
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
    {/* Sprunglink zum Inhalt (kein #-Link, weil der Hash das Modul auswählt) */}
    <button
      type="button"
      onClick={() => document.getElementById('scroll-container')?.focus()}
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-shiraz focus:text-white focus:font-bold focus:shadow-lg"
    >
      {language === 'en' ? 'Skip to content' : 'Zum Inhalt springen'}
    </button>
    {mobileMenuOpen && (
      <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
    )}
    <aside
      aria-label={language === 'en' ? 'Module navigation' : 'Modulnavigation'}
      inert={(istSchmal && !mobileMenuOpen) || (!istSchmal && sidebarCollapsed) ? true : undefined}
      className={"fixed md:sticky top-0 left-0 z-50 h-screen bg-white dark:bg-slate-900 border-r border-home-grau/30 dark:border-slate-800 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden " + 
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
              <p className="text-sm font-bold text-text-main dark:text-slate-100 leading-tight">BaustoffBoard</p>
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
            aria-label={language === 'en' ? 'Search modules and content' : 'Module und Inhalte durchsuchen'}
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
          const isAnyClusterOpen = Object.values(openClusters).some(Boolean);
          const isAllgemeinOpen = searchQuery !== '' 
            ? true 
            : (!isAnyClusterOpen && (openDropdown === 'Allgemein' || (openDropdown !== 'CLOSED_ALLGEMEIN' && isAllgemeinChildActive)));

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
                    setOpenDropdown('CLOSED_ALLGEMEIN');
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
                  onClick={() => {
                    if (isAllgemeinOpen) {
                      setOpenDropdown('CLOSED_ALLGEMEIN');
                    } else {
                      // Beim Aufklappen von Start alle Cluster (I-VI/VII) einklappen
                      const nextState: Record<string, boolean> = {};
                      META_CLUSTERS.forEach(c => {
                        nextState[c.id] = false;
                      });
                      setOpenClusters(nextState);
                      setOpenDropdown('Allgemein');
                    }
                  }}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isAllgemeinOpen
                      ? "bg-slate-100 dark:bg-slate-800 border-shiraz dark:border-rose-500 text-shiraz dark:text-rose-400"
                      : "bg-white/40 dark:bg-slate-800 border-home-grau/20 dark:border-slate-700 text-slate-500 hover:text-shiraz"
                  }`}
                  title={isAllgemeinOpen ? (language === 'en' ? "Collapse menu" : "Start-Menü einklappen") : (language === 'en' ? "Expand menu" : "Start-Menü ausklappen")}
                  aria-label={language === 'en' ? 'General pages' : 'Allgemeine Seiten'}
                  aria-expanded={isAllgemeinOpen}
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
                aria-expanded={isClusterOpen}
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
                          aria-expanded={isGroupOpen}
                          className={"text-xs tracking-wide px-2 py-1.5 flex justify-between items-center rounded-lg transition-colors text-left w-full " + 
                            (isGroupActive ? "font-bold text-shiraz dark:text-rose-400 bg-shiraz/5 dark:bg-rose-950/20" : "font-medium text-text-main/80 dark:text-slate-300 hover:bg-home-grau/10 dark:hover:bg-slate-800/60")}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            {React.createElement(GROUP_ICONS[group.name] || Layers, { size: 12, className: "shrink-0 opacity-70" })}
                            <span className="truncate text-left">{groupDisplayName}</span>
                          </div>
                          <span aria-hidden="true" className="text-[10px] text-home-grau dark:text-slate-400 shrink-0 ml-1">
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
        <VolltextTreffer anfrage={searchQuery} oeffne={(id) => { setActiveTab(id); setMobileMenuOpen(false); }} />
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
               <button
                 className="text-text-main dark:text-slate-100 p-2 -ml-2 rounded-lg hover:bg-home-grau/10 dark:hover:bg-slate-800 min-w-11 min-h-11 flex items-center justify-center"
                 onClick={() => setMobileMenuOpen(true)}
                 aria-label={language === 'en' ? 'Open menu' : 'Menü öffnen'}
                 aria-expanded={mobileMenuOpen}
               >
                 <Menu size={24} aria-hidden="true" />
               </button>
               {/* Mobil: aktuelles Modul statt nur Markenname (Phase 2, AP 2.5) */}
               <button 
                 onClick={() => { setActiveTab('start'); }} 
                 className="font-bold text-text-main dark:text-slate-100 flex items-center gap-1 text-sm hover:opacity-85 transition-opacity text-left active:scale-[0.98] duration-150 min-w-0"
                 title="Zur Startseite"
               >
                <GraduationCap size={16} className="text-shiraz shrink-0" aria-hidden="true"/>
                <span className="truncate max-w-[52vw]">{(() => {
                  const m = activeTab !== 'start' ? MODUL_BY_ID.get(activeTab) : undefined;
                  return m ? getTabLabel(m.id, m.label) : 'BaustoffBoard';
                })()}</span>
              </button>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-text-main/70 dark:text-slate-300 min-w-0">
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-text-main dark:text-slate-100 p-2 -ml-2 rounded-lg hover:bg-home-grau/10 dark:hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0"
                title={sidebarCollapsed ? "Sidebar einblenden" : "Sidebar ausblenden"}
                aria-label={sidebarCollapsed ? (language === 'en' ? 'Show navigation' : 'Navigation einblenden') : (language === 'en' ? 'Hide navigation' : 'Navigation ausblenden')}
                aria-expanded={!sidebarCollapsed}
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
            {/* Mobil: Werkzeuge im „⋯“-Menü (Phase 2, AP 2.5) */}
            <div className="sm:hidden ml-auto relative">
              <button
                type="button"
                onClick={() => setMobilWerkzeugeOffen(o => !o)}
                aria-expanded={mobilWerkzeugeOffen}
                aria-controls="mobil-werkzeuge"
                aria-label={language === 'en' ? 'Tools: language, accessibility, theme, PDF' : 'Werkzeuge: Sprache, Barrierefreiheit, Darstellung, PDF'}
                className="min-w-11 min-h-11 flex items-center justify-center rounded-lg border border-home-grau/20 dark:border-slate-700 bg-off-white dark:bg-slate-800 text-text-main dark:text-white"
              >
                <MoreHorizontal size={20} aria-hidden="true" />
              </button>
              {mobilWerkzeugeOffen && (
                <div id="mobil-werkzeuge" className="absolute right-0 top-12 z-50 w-64 p-3 rounded-xl border border-home-grau/30 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg flex flex-col gap-2">
                  <LanguageSwitcher />
                  <AccessibilityToolbar />
                  <button
                    onClick={() => { toggleTheme(); setMobilWerkzeugeOffen(false); }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-off-white dark:bg-slate-800 text-text-main dark:text-white border border-home-grau/20 dark:border-slate-700 text-sm"
                  >
                    {theme === 'light' ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
                    <span>{theme === 'light' ? t('themeDark') : t('themeLight')}</span>
                  </button>
                  <button
                    onClick={() => { setMobilWerkzeugeOffen(false); handleExport(); }}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-off-white dark:bg-slate-800 text-text-main dark:text-white border border-home-grau/20 dark:border-slate-700 text-sm disabled:opacity-50"
                  >
                    <Download size={16} aria-hidden="true" />
                    <span>{isExporting ? t('exporting') : t('exportPdf')}</span>
                  </button>
                </div>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-2 ml-auto">
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
                aria-label={`${screenWidth === 'standard' ? (language === 'en' ? 'Standard' : 'Standard (1152px)') : screenWidth === 'wide' ? (language === 'en' ? 'Wide' : 'Breit (1536px)') : (language === 'en' ? '100% Full' : '100% Vollbild')} – ${language === 'en' ? 'page width' : 'Seitenbreite'}`}
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
              <button onClick={handleExport} disabled={isExporting} aria-label={t('exportPdf')} className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-1.5 text-sm font-medium text-text-main dark:text-white bg-off-white dark:bg-slate-800 hover:bg-home-grau/20 dark:hover:bg-slate-750 border border-home-grau/20 dark:border-slate-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer">
                <Download size={16} />
                <span className="hidden sm:inline">{isExporting ? t('exporting') : t('exportPdf')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 custom-scrollbar focus:outline-none" id="scroll-container" tabIndex={-1}>
        {/* Genau eine Hauptüberschrift je Seite: der Modulname (Phase 2, AP 2.2) */}
        <h1 className="sr-only">{(() => {
          const m = MODUL_BY_ID.get(activeTab);
          const label = m ? getTabLabel(m.id, m.baum?.titel ?? m.label) : 'BaustoffBoard';
          return activeTab === 'start' ? 'BaustoffBoard – Lern- und Wissensplattform der TH Augsburg' : `${label} – BaustoffBoard`;
        })()}</h1>
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
            {/* Running Header auf jeder Druckseite */}
            <div className="hidden print:block fixed top-0 left-0 right-0 text-center text-[10px] text-gray-500 py-1 bg-white border-b border-gray-300 font-sans z-50">
              Ausschließlich für akademische Lehrzwecke!
            </div>
            {/* Running Footer auf jeder Druckseite */}
            <div className="hidden print:block fixed bottom-0 left-0 right-0 text-center text-[10px] text-gray-500 py-1 bg-white border-t border-gray-300 font-sans z-50">
              BaustoffBoard · Prof. Dr.-Ing. Jürgen Huber · TH Augsburg · {(() => {
                const now = new Date();
                const d = String(now.getDate()).padStart(2, '0');
                const m = String(now.getMonth() + 1).padStart(2, '0');
                return `${d}.${m}.${now.getFullYear()}`;
              })()} · {CURRENT_VERSION.version}
            </div>

            <div className="hidden pdf-header mb-8 pb-4 border-b-2 border-shiraz">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-2xl font-bold text-text-main">{t('testProtocol')}</p>
                  <p className="text-sm text-text-main/80 mt-1">Modul: {(() => {
                    const tabObj = tabGroups.flatMap(g => g.tabs as unknown as any[]).find(t => t.id === activeTab);
                    return tabObj ? getTabLabel(tabObj.id, tabObj.label) : activeTab;
                  })()}</p>
                  <p className="text-sm text-text-main/80">{t('date')}: {new Date().toLocaleDateString(language === 'en' ? "en-US" : "de-DE")}</p>
                </div>
              </div>
            </div>
<React.Suspense fallback={<div className="flex justify-center items-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-shiraz"></div></div>}>
          {/* Lernziele je Fachmodul (Phase 3, AP 3.6) */}
          {LERNZIELE[activeTab] && <ModulLernziele moduleId={activeTab} daten={LERNZIELE[activeTab]} oeffneModul={(id) => setActiveTab(id as Parameters<typeof setActiveTab>[0])} />}
          {/* „Das Wichtigste in 5 Punkten“ vor langen Modulen (Phase 3, AP 3.8) */}
          {KURZFASSUNG[activeTab] && <ModulKurzfassung key={activeTab} punkte={KURZFASSUNG[activeTab]} />}
          {/* Erkundungsauftrag „Ausprobieren“ für Rechner (Phase 3, AP 3.7) */}
          {ERKUNDUNG[activeTab] && <ErkundungsAuftrag key={activeTab} daten={ERKUNDUNG[activeTab]} />}
          {/* Haftungshinweis für alle Rechner-Module (Phase 1, AP 1.10) */}
          {(MODUL_BY_ID.get(activeTab)?.baum?.typ === 'calculator' || grenzenFuer(activeTab)) && (
            <CalculatorDisclaimerBanner
              className="mb-4"
              grenzen={grenzenFuer(activeTab)}
              customText="Lehr- und Vorbemessungswerkzeug: Die Ergebnisse sind vereinfachte Berechnungen zu Lernzwecken und ersetzen keinen bauaufsichtlichen Nachweis (MVV TB / LBO) und keine Prüfung durch fachkundige Personen. Maßgebende Normausgaben stehen in den Quellen am Modulende."
            />
          )}
          {activeTab === 'start' && <Startseite />}
          {activeTab === 'nachhaltigkeit_daten_regeln' && <NachhaltigkeitDatenRegeln />}
          {activeTab === 'materialoptimierung' && <Materialoptimierung />}
          {activeTab === 'nachhaltigkeit_checklisten' && <NachhaltigkeitChecklisten />}
          {activeTab === 'oekobilanz_lca' && <OekobilanzLCA teil="grundlagen" />}
          {activeTab === 'lca_rechner' && <OekobilanzLCA teil="rechner" />}
          {activeTab === 'lca_ingenieurbau' && <OekobilanzLCA teil="ingenieurbau" />}
          {activeTab === 'lca_regulatorik' && <OekobilanzLCA teil="regulatorik" />}
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
          {activeTab === 'barrierefreiheit' && <Barrierefreiheit />}
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
          {(activeTab === 'modulstruktur' || (activeTab as string) === 'moduluebersicht') && <Modulstruktur />}
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
          {activeTab === 'betonkennwerte' && <Betonkennwerte />}
          {activeTab === 'sichtbeton' && <Sichtbeton />}
          {activeTab === 'festbeton_statistik' && <FestbetonStatistik />}
          {activeTab === 'sicherheitskonzept' && <Sicherheitskonzept />}
          {activeTab === 'sonderbetone' && <Sonderbetone />}
          {activeTab === 'innovative_werkstoffe' && <InnovativeWerkstoffe />}
          {activeTab === 'qualitaetssicherung' && <Qualitaetssicherung />}
          {activeTab === 'betonpraxis' && <Betonpraxis />}
          {activeTab === 'expositionsklassen' && <Expositionsklassen />}
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
          {(activeTab === 'kombinationen' || activeTab === 'faserverbund' || activeTab === 'materialitaet_architektur') && (
            <Kombinationen initialTab={activeTab === 'faserverbund' ? 'faserverbund' : undefined} />
          )}
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
          {/* Selbsttest für Module ohne eigenen Test in der Komponente (Phase 3, AP 3.4) */}
          {MODULTEST_IN_APP.has(activeTab) && <div className="mt-8"><ModulTest moduleId={activeTab} /></div>}
          </React.Suspense>
          </div>

          {/* Global Footer */}
          <footer className="mt-12 pt-6 pb-8 border-t border-home-grau/20 text-xs text-text-main/70 text-center px-2">
            <span>BaustoffBoard · Prof. Dr.-Ing. Jürgen Huber · TH Augsburg · {CURRENT_VERSION.version}</span>
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
const Expositionsklassen = React.lazy(() => import('./modules/Expositionsklassen'));
const Korrosion = React.lazy(() => import('./modules/Korrosion'));
const SpannungDehnung = React.lazy(() => import('./modules/SpannungDehnung'));
const Holz = React.lazy(() => import('./modules/Holz'));
const Hydratation = React.lazy(() => import('./modules/Hydratation'));
const IntegrationVerformungen = React.lazy(() => import('./modules/IntegrationVerformungen'));
const KriechenSchwinden = React.lazy(() => import('./modules/KriechenSchwinden'));
const Rissbreite = React.lazy(() => import('./modules/Rissbreite'));
const Nachbehandlung = React.lazy(() => import('./modules/Nachbehandlung'));
const Festbeton = React.lazy(() => import('./modules/Festbeton'));
const Betonkennwerte = React.lazy(() => import('./modules/Betonkennwerte'));
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
const Kombinationen = React.lazy(() => import('./modules/Kombinationen'));
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
const Barrierefreiheit = React.lazy(() => import('./modules/Barrierefreiheit'));
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

