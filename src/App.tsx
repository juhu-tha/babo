import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  MoreHorizontal,
  GraduationCap,
  Download,
  LayoutGrid,
  Maximize2,
  Columns,
  Home,
  Search,
  Compass,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  Star
} from 'lucide-react';

import { TabProvider, useTabContext } from './contexts/TabContext';
import { useLanguage } from './contexts/LanguageContext';
import { LanguageSwitcher } from './components/navigation/LanguageSwitcher';
import { LanguageBanner } from './components/navigation/LanguageBanner';
import { ladeBeschreibungen } from './metaDescriptions';
import { AccessibilityToolbar } from './components/a11y/AccessibilityToolbar';
import { leseSeitenbreite, setzeBreitenKlasse, waehleSeitenbreite, alsSeitenbreite, type Bildschirmbreite } from './utils/seitenbreite';
import { META_CLUSTERS, GROUP_TO_CLUSTER } from './data/metaClusters';
import { MODUL_KERN } from './registry/kern';
import { MODULTEST_IN_APP } from './data/quizZuordnung';
import { useAutoFormLabels } from './components/a11y/useAutoFormLabels';
// Nur die Versionsnummer aus package.json (tree-shakebar); tests/versionData.test.ts sichert den Gleichstand
// mit VERSION_HISTORY[0] – so bleibt die Änderungshistorie aus dem Einstiegs-Chunk (Phase 5, AP 5.4)
import { version as PAKET_VERSION } from '../package.json';
import { tabGroups } from './routing/tabGroups';
import { ModulNavigation, suchbegriffeLaden } from './components/navigation/ModulNavigation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LIZENZ_AKTIV } from './data/lizenz';
import { lazySofort, vorladenFuer } from './routing/sofortLaden';
import { modulPfad } from './routing/pfad';
import { SERVER_FUNKTIONEN } from './data/betriebsart';

import type { TabId } from '@/src/contexts/TabContext';
// Nur bei Bedarf geladen (Bundle-Budget, Phase 5 AP 5.4): Modulkopf mit Lernziel-/Erkundungsdaten,
// Modul-Selbsttest (zieht quiz.json), Abstimmungsansicht (?poll=…) und SEO-Audit-Modal
const AKTUELLE_VERSION = `v${PAKET_VERSION}`;
// lazySofort: vorgerenderte Modulseiten (Z52) laden Inhalt und Kopf vor dem ersten Rendern, damit React die
// statische Seite ohne Zwischenbild (Spinner) ersetzt – s. vorbereiten() und main.tsx
const ModulInhalt = lazySofort(() => import('./routing/ModulInhalt'));
const ModulKopf = lazySofort(() => import('./routing/ModulKopf'));
const ModulTest = React.lazy(() => import('./components/quiz/ModulTest').then(m => ({ default: m.ModulTest })));
const StudentPollVoteView = React.lazy(() => import('./components/polls/StudentPollVoteView'));
const Kurzfragebogen = React.lazy(() => import('./components/feedback/Kurzfragebogen'));
const LicenseNotice = React.lazy(() => import('./components/ui/LicenseNotice'));
const MetadataAuditModal = React.lazy(() => import('./components/seo/MetadataAuditModal').then(m => ({ default: m.MetadataAuditModal })));


/** Alles laden, was die Modulseite beim ersten Rendern braucht: Inhaltsverteiler, Modulkomponente, Modulkopf, Kopfdaten */
export async function vorbereiten(tab: TabId): Promise<void> {
  const [inhalt] = await Promise.all([
    ModulInhalt.vorladen(),
    ModulKopf.vorladen(),
    import('./routing/modulKopfDaten').then(m => m.ladeKopfDaten(tab)),
  ]);
  await vorladenFuer(inhalt.default({ activeTab: tab }));
}

interface AppProps {
  /** Startmodul statt Adresse (nur Vorrendern im Build) */
  startTab?: TabId;
  /** Seite wurde vorgerendert ausgeliefert: erstes Bild ohne Einblend-Animation (gleich der statischen Seite) */
  vorgerendert?: boolean;
  /** Vorrendern im Build (scripts/vorrendern.ts): Modulkopf und Inhalt in getrennten Suspense-Grenzen */
  vorrendern?: boolean;
}

/** Breitenschalter: Sichtbarkeit je Fassung über die Klasse an <html>, Stil wie bisher je Zustand */
const BREITEN_SCHALTER: ReadonlyArray<{ breite: Bildschirmbreite; sichtbar: string; stil: string }> = [
  { breite: 'standard', sichtbar: 'hidden breite-standard:sm:flex',
    stil: 'bg-off-white dark:bg-slate-800 hover:bg-home-grau/20 dark:hover:bg-slate-700 border-home-grau/20 dark:border-slate-700' },
  { breite: 'wide', sichtbar: 'hidden sm:flex breite-standard:hidden! breite-full:hidden!',
    stil: 'bg-shiraz/10 border-shiraz/40 text-shiraz dark:text-rose-300 font-semibold' },
  { breite: 'full', sichtbar: 'hidden breite-full:sm:flex',
    stil: 'bg-shiraz text-white border-shiraz shadow-xs font-semibold' },
];

function AppContent({ vorgerendert = false, vorrendern = false }: Omit<AppProps, 'startTab'>) {
  const { activeTab, setActiveTab, theme, toggleTheme } = useTabContext();
  const ersterTab = useRef(activeTab);
  const ohneEinblenden = vorgerendert && activeTab === ersterTab.current;
  const { language, t, getTabLabel, getGroupName, getClusterName } = useLanguage();
  const [activePollParam, setActivePollParam] = useState<{ poll: string; qid?: string } | null>(() => {
    // Abstimmungsansicht braucht /api/polls – im statischen Betrieb normale Seite (src/data/betriebsart.ts)
    if (SERVER_FUNKTIONEN && typeof window !== 'undefined') {
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
  // Seitenbreite: Zustand nur für Bedienung (title/aria-label, nächster Schritt); das Bild schaltet über die Klasse
  // an <html> (src/utils/seitenbreite.ts), damit die vorgerenderte Seite in jeder Breite dem ersten Bild entspricht
  const [screenWidth, setScreenWidth] = useState<Bildschirmbreite>(leseSeitenbreite);
  useLayoutEffect(() => { setzeBreitenKlasse(screenWidth); }, [screenWidth]);

  useEffect(() => {
    const handleWidthChange = (e: Event) => {
      const b = alsSeitenbreite(e);
      if (b) setScreenWidth(b);
    };
    window.addEventListener('baustoffboard_width_change', handleWidthChange);
    return () => window.removeEventListener('baustoffboard_width_change', handleWidthChange);
  }, []);

  const [showMetadataModal, setShowMetadataModal] = useState(false);
  // Meta-Beschreibungen liegen in der vollständigen Registry: erst nach dem Laden der Seite nachladen (AP 5.5)
  const [TAB_DESCRIPTIONS, setTabDescriptions] = useState<Record<string, string>>({});
  useEffect(() => {
    let aktiv = true;
    const lade = () => { ladeBeschreibungen().then(b => { if (aktiv) setTabDescriptions(b); }).catch(() => {}); };
    if (document.readyState === 'complete') { const t = window.setTimeout(lade, 0); return () => { aktiv = false; window.clearTimeout(t); }; }
    window.addEventListener('load', lade, { once: true });
    return () => { aktiv = false; window.removeEventListener('load', lade); };
  }, []);

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
    const parentGroup = tabGroups.find(g => g.tabs.some(t => t.id === activeTab));
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

  const handleExport = async () => {
    setIsExporting(true);
    const { exportToPDF } = await import('./lib/pdfExport');
    await exportToPDF('module-content', `THA_Baustoffkunde_${activeTab}`);
    setIsExporting(false);
  };
  // Besuchszähler (nur mit Server; im statischen Betrieb kein Aufruf, src/data/betriebsart.ts)
  React.useEffect(() => {
    if (!SERVER_FUNKTIONEN) return;
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
      const found = group.tabs.find((t) => t.id === activeTab);
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
    if (ogUrl && typeof window !== 'undefined') ogUrl.setAttribute('content', `${window.location.origin}${modulPfad(activeTab)}`);
  }, [activeTab, TAB_DESCRIPTIONS]);

  if (activePollParam) {
    return (
      <React.Suspense fallback={null}>
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
      </React.Suspense>
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
            <button type="button" aria-label="Menü schließen" className="md:hidden text-home-grau dark:text-slate-400 p-1 hover:bg-home-grau/10 dark:hover:bg-slate-800 rounded" onClick={() => setMobileMenuOpen(false)}>
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
            onFocus={() => { void suchbegriffeLaden().catch(() => {}); }}
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
        <ModulNavigation
          searchQuery={searchQuery} openClusters={openClusters} setOpenClusters={setOpenClusters}
          openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} favorites={favorites}
          toggleFavorite={toggleFavorite} toggleCluster={toggleCluster} setMobileMenuOpen={setMobileMenuOpen}
        />
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
                  const m = activeTab !== 'start' ? MODUL_KERN.get(activeTab) : undefined;
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
                const currentGroup = tabGroups.find(g => g.tabs.some(t => t.id === activeTab));
                const currentCluster = currentGroup ? GROUP_TO_CLUSTER[currentGroup.name] : null;
                const currentTabObj = currentGroup ? currentGroup.tabs.find(t => t.id === activeTab) : null;
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

                    {/* Quick favorite star in breadcrumbs – Zielgröße ≥ 24 × 24 px (WCAG 2.2, 2.5.8; Gutachten 27.10.2026) */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(activeTab, e)}
                      className={`min-w-6 min-h-6 inline-flex items-center justify-center shrink-0 p-1 rounded-md transition-colors hover:bg-home-grau/10 dark:hover:bg-slate-800 ${favorites.includes(activeTab) ? "text-amber-500" : "text-slate-400 opacity-60 hover:opacity-100"}`}
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
                    {/* Symbol und Text über die Klasse dark an <html> statt über theme: gleiche Ausgabe hell und dunkel,
                        damit die vorgerenderte Seite auch im Dunkelmodus dem ersten Bild von React entspricht */}
                    <Moon size={16} aria-hidden="true" className="dark:hidden" />
                    <Sun size={16} aria-hidden="true" className="hidden dark:block" />
                    <span className="dark:hidden">{t('themeDark')}</span>
                    <span className="hidden dark:inline">{t('themeLight')}</span>
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
              {/* Breitenschalter in drei Fassungen, je eine sichtbar über die Klasse an <html> (breite-standard:/breite-full:,
                  sonst Breit) statt nach screenWidth: gleiche Ausgabe in allen Breiten (vorgerenderte Seite). Die Klassen je
                  Fassung sind die bisherigen, damit die Sonderregeln in src/index.css (Dunkelmodus, Kontrast) wie zuvor
                  greifen; ausgeblendete Fassungen (display: none) sind weder fokussierbar noch für Screenreader sichtbar. */}
              {BREITEN_SCHALTER.map(v => (
                <button
                  key={v.breite}
                  onClick={() => {
                    const next: Bildschirmbreite = screenWidth === 'standard' ? 'wide' : screenWidth === 'wide' ? 'full' : 'standard';
                    setScreenWidth(next);
                    waehleSeitenbreite(next);
                  }}
                  className={`${v.sichtbar} items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-text-main dark:text-white transition-colors border cursor-pointer ${v.stil}`}
                  title={
                    screenWidth === 'standard'
                      ? (language === 'en' ? "Width: Standard 1152px (Click for Wide 1536px)" : "Bildschirmbreite: Standard 1152px (Klicken für Breit 1536px)")
                      : screenWidth === 'wide'
                      ? (language === 'en' ? "Width: Wide 1536px (Click for Full Width 100%)" : "Bildschirmbreite: Breit 1536px (Klicken für 100% Vollbild)")
                      : (language === 'en' ? "Width: Full 100% (Click for Standard 1152px)" : "Bildschirmbreite: 100% Vollbild (Klicken für Standard 1152px)")
                  }
                  aria-label={`${screenWidth === 'standard' ? (language === 'en' ? 'Standard' : 'Standard (1152px)') : screenWidth === 'wide' ? (language === 'en' ? 'Wide' : 'Breit (1536px)') : (language === 'en' ? '100% Full' : '100% Vollbild')} – ${language === 'en' ? 'page width' : 'Seitenbreite'}`}
                >
                  {v.breite === 'full' ? (
                    <Maximize2 size={14} className="text-white" />
                  ) : v.breite === 'wide' ? (
                    <LayoutGrid size={14} className="text-shiraz dark:text-rose-400" />
                  ) : (
                    <Columns size={14} />
                  )}
                  <span className="text-xs font-medium leading-none select-none hidden lg:inline">
                    {v.breite === 'standard'
                      ? (language === 'en' ? 'Standard' : 'Standard (1152px)')
                      : v.breite === 'wide'
                      ? (language === 'en' ? 'Wide' : 'Breit (1536px)')
                      : (language === 'en' ? '100% Full' : '100% Vollbild')}
                  </span>
                </button>
              ))}
              <button 
                onClick={toggleTheme} 
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-off-white dark:bg-slate-800 hover:bg-home-grau/20 dark:hover:bg-slate-700 text-text-main dark:text-white transition-colors border border-home-grau/20 dark:border-slate-700 cursor-pointer"
                title={theme === 'light' ? (language === 'en' ? "Enable Dark Mode" : "Dunkelmodus aktivieren") : (language === 'en' ? "Enable Light Mode" : "Hellmodus aktivieren")}
                id="theme-toggle-btn"
              >
                {/* wie im Mobilmenü: Umschaltung per Klasse dark (vorgerenderte Seite im Dunkelmodus) */}
                <Moon size={14} aria-hidden="true" className="dark:hidden" />
                <Sun size={14} aria-hidden="true" className="hidden dark:block" />
                <span className="text-xs font-medium leading-none select-none dark:hidden">{t('themeDark')}</span>
                <span className="text-xs font-medium leading-none select-none hidden dark:inline">{t('themeLight')}</span>
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
          const m = MODUL_KERN.get(activeTab);
          const label = m ? getTabLabel(m.id, m.titel ?? m.label) : 'BaustoffBoard';
          return activeTab === 'start' ? 'BaustoffBoard – Lern- und Wissensplattform der TH Augsburg' : `${label} – BaustoffBoard`;
        })()}</h1>
        {/* Breite per Klasse an <html> (src/utils/seitenbreite.ts), nicht nach screenWidth – s. Breitenschalter */}
        <div className="mx-auto flex flex-col min-h-full transition-all duration-200 w-full max-w-[1536px] breite-standard:max-w-6xl breite-full:max-w-none">
          <LanguageBanner />
          <div id="module-content" className={`${ohneEinblenden ? '' : 'animate-in fade-in slide-in-from-bottom-4 duration-500 '}pb-8 relative flex-1`}>
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
              })()} · {AKTUELLE_VERSION}
            </div>

            <div className="hidden pdf-header mb-8 pb-4 border-b-2 border-shiraz">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-2xl font-bold text-text-main">{t('testProtocol')}</p>
                  <p className="text-sm text-text-main/80 mt-1">Modul: {(() => {
                    const tabObj = tabGroups.flatMap(g => g.tabs).find(t => t.id === activeTab);
                    return tabObj ? getTabLabel(tabObj.id, tabObj.label) : activeTab;
                  })()}</p>
                  <p className="text-sm text-text-main/80">{t('date')}: {new Date().toLocaleDateString(language === 'en' ? "en-US" : "de-DE")}</p>
                </div>
              </div>
            </div>
{/* Platzhalter mindestens bildschirmhoch: sonst steht die Fußzeile beim Nachladen im Bild und springt weg (CLS, AP 5.5) */}
{vorrendern ? (
          // Build-Vorrendern: Fehler im Modul (Browser-APIs beim Rendern) sollen den Modulkopf nicht mitnehmen
          <>
            {activeTab !== 'start' && <React.Suspense fallback={null}><ModulKopf activeTab={activeTab} setActiveTab={setActiveTab} /></React.Suspense>}
            <React.Suspense fallback={null}><ModulInhalt activeTab={activeTab} /></React.Suspense>
          </>
        ) : (
<React.Suspense fallback={<div className="flex justify-center items-start pt-32 min-h-[100svh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-shiraz"></div></div>}>
          {/* Startseite hat keinen Modulkopf – Daten dort nicht laden */}
          {activeTab !== 'start' && <ModulKopf activeTab={activeTab} setActiveTab={setActiveTab} />}
          <ModulInhalt activeTab={activeTab} />
          {/* Selbsttest für Module ohne eigenen Test in der Komponente (Phase 3, AP 3.4); eigene Grenze, damit er
              das erste Bild einer vorgerenderten Seite nicht aufhält */}
          {MODULTEST_IN_APP.has(activeTab) && <React.Suspense fallback={null}><div className="mt-8"><ModulTest moduleId={activeTab} /></div></React.Suspense>}
          </React.Suspense>
        )}
          </div>

          {/* Global Footer */}
          <footer className="mt-12 pt-6 pb-8 border-t border-home-grau/20 text-xs text-text-main/70 text-center px-2">
            <span>BaustoffBoard · Prof. Dr.-Ing. Jürgen Huber · TH Augsburg · {AKTUELLE_VERSION}</span>
            {/* Lizenzhinweis (AP 6.8): erst nach THA-Freigabe, Schalter in src/data/lizenz.ts */}
            {LIZENZ_AKTIV && <React.Suspense fallback={null}><LicenseNotice /></React.Suspense>}
          </footer>
        </div>
      </main>
    </div>

    {/* Anonymer Kurzfragebogen, höchstens einmal je Semester (Phase 6, AP 6.9) */}
    {SERVER_FUNKTIONEN && <React.Suspense fallback={null}><Kurzfragebogen /></React.Suspense>}

    {/* SEO-Metadaten Audit-Modal */}
    {showMetadataModal && <React.Suspense fallback={null}><MetadataAuditModal
      isOpen={showMetadataModal}
      onClose={() => setShowMetadataModal(false)}
      tabGroups={tabGroups}
      tabDescriptions={TAB_DESCRIPTIONS}
      groupToCluster={GROUP_TO_CLUSTER}
      onSelectTab={(tabId) => {
        setActiveTab(tabId as TabId);
        setShowMetadataModal(false);
      }}
    /></React.Suspense>}
  </div>
);
}


export default function App({ startTab, vorgerendert, vorrendern }: AppProps = {}) {
  return (
    <ErrorBoundary>
      <TabProvider startTab={startTab}>
        <AppContent vorgerendert={vorgerendert} vorrendern={vorrendern} />
      </TabProvider>
    </ErrorBoundary>
  );
}

