// Modulnavigation der Seitenleiste (Start/Favoriten, Meta-Cluster, Gruppen, Volltexttreffer).
// Aus App.tsx ausgelagert (Phase 5, AP 5.2); Zustand bleibt in App.tsx.
import React from 'react';
import {
  Activity, AlertTriangle, Building2, Calculator, ChevronRight, ClipboardCheck, Compass, Droplets, Factory,
  FileText, FileWarning, Globe, GraduationCap, Info, Landmark, Layers, Leaf, Microscope, Monitor, Mountain,
  Recycle, Scale, Shield, ShieldCheck, Sparkles, Star, Thermometer, Trees, Wrench,
} from 'lucide-react';
import { useTabContext } from '../../contexts/TabContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { META_CLUSTERS } from '../../data/metaClusters';
import { ladeSuchbegriffe } from '../../registry/kern';
import { tabGroups } from '../../routing/tabGroups';
import { VolltextTreffer } from './VolltextTreffer';
import { formatDeWert } from '@/src/utils/numberFormat';

import type { TabId } from '@/src/contexts/TabContext';
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
  'Lehrveranstaltungen': ClipboardCheck,
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

// Suchbegriffe stehen in der vollständigen Registry: erst bei der ersten Suche laden (Phase 5, AP 5.5 Nachtrag).
// Bis zum Eintreffen (ein Abruf) wird nur über die Beschriftungen gefiltert.
let suchbegriffe: Record<string, string[]> | undefined;
/** Suchbegriffe vorab laden (z. B. beim Fokus auf das Suchfeld) */
export const suchbegriffeLaden = (): Promise<Record<string, string[]>> => ladeSuchbegriffe().then(w => (suchbegriffe = w));
function useSuchbegriffe(benoetigt: boolean): Record<string, string[]> {
  const [werte, setWerte] = React.useState(suchbegriffe);
  React.useEffect(() => {
    if (!benoetigt || werte) return;
    let aktiv = true;
    suchbegriffeLaden().then(w => { if (aktiv) setWerte(w); }).catch(() => {});
    return () => { aktiv = false; };
  }, [benoetigt, werte]);
  return werte ?? {};
}

/** Text der Statusmeldung zur Suche; inhalt = null: Volltextsuche (noch) ohne Ergebnis. Exportiert für Tests. */
export function suchStatusText(module: number, inhalt: number | null, sprache: string = 'de'): string {
  const z = formatDeWert;
  if (sprache === 'en') return `${z(module)} ${module === 1 ? 'module' : 'modules'} found${inhalt !== null ? `, ${z(inhalt)} ${inhalt === 1 ? 'hit' : 'hits'} in content` : ''}`;
  return `${z(module)} ${module === 1 ? 'Modul' : 'Module'} gefunden${inhalt !== null ? `, ${z(inhalt)} Treffer im Inhalt` : ''}`;
}

export interface ModulNavigationProps {
  searchQuery: string;
  openClusters: Record<string, boolean>;
  setOpenClusters: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  openDropdown: string | null;
  setOpenDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  favorites: string[];
  toggleFavorite: (id: string, e?: React.MouseEvent) => void;
  toggleCluster: (clusterId: string) => void;
  setMobileMenuOpen: (offen: boolean) => void;
}

export function ModulNavigation({
  searchQuery, openClusters, setOpenClusters, openDropdown, setOpenDropdown,
  favorites, toggleFavorite, toggleCluster, setMobileMenuOpen,
}: ModulNavigationProps) {
  const { activeTab, setActiveTab } = useTabContext();
  const { language, t, getTabLabel, getGroupName, getClusterName } = useLanguage();
  const TAB_KEYWORDS = useSuchbegriffe(searchQuery !== '');
  // Trefferzahl der Suche als Statusmeldung (WCAG 4.1.3): Module der Navigation und Treffer im Inhalt, verzögert
  // angesagt, damit nicht jeder Tastendruck eine Meldung auslöst
  const [inhaltTreffer, setInhaltTreffer] = React.useState<number | null>(null);
  const modulTreffer = React.useMemo(() => {
    if (!searchQuery) return 0;
    const q = searchQuery.toLowerCase();
    const ids = new Set<string>();
    for (const g of tabGroups) for (const tab of g.tabs) {
      if (tab.id.startsWith('divider')) continue;
      const passt = (tab.label && tab.label.toLowerCase().includes(q)) || getTabLabel(tab.id, tab.label).toLowerCase().includes(q)
        || (TAB_KEYWORDS[tab.id] || []).some(k => k.includes(q));
      if (passt) ids.add(tab.id);
    }
    return ids.size;
  }, [searchQuery, TAB_KEYWORDS, getTabLabel]);
  const [suchStatus, setSuchStatus] = React.useState('');
  React.useEffect(() => {
    if (!searchQuery.trim()) { setSuchStatus(''); return; }
    const zeit = window.setTimeout(() => setSuchStatus(suchStatusText(modulTreffer, searchQuery.trim().length >= 3 ? inhaltTreffer : null, language)), 700);
    return () => window.clearTimeout(zeit);
  }, [searchQuery, modulTreffer, inhaltTreffer, language]);
  return (
    <>
    <p role="status" className="sr-only">{suchStatus}</p>
    {/* Schnellzugriff: Dashboard / Start & Allgemein */}
    {(() => {
      const allgemeinGroup = tabGroups[0]; // Allgemein
      const isAllgemeinChildActive = ['admin', 'anleitung', 'modulstruktur', 'feedback', 'versionen', 'impressum', 'datenschutz'].includes(activeTab);
      const isAnyClusterOpen = Object.values(openClusters).some(Boolean);
      const isAllgemeinOpen = searchQuery !== '' 
        ? true 
        : (!isAnyClusterOpen && (openDropdown === 'Allgemein' || (openDropdown !== 'CLOSED_ALLGEMEIN' && isAllgemeinChildActive)));

      const matchingAllgemeinTabs = allgemeinGroup.tabs.filter((t) => {
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
              aria-current={activeTab === 'start' ? 'page' : undefined}
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
                .filter((t) => searchQuery ? true : t.id !== 'start')
                .map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const isFav = favorites.includes(tab.id);
                  const displayLabel = getTabLabel(tab.id, tab.label);

                  return (
                    <div key={tab.id} className="group/item flex items-center gap-1">
                      <button 
                        onClick={() => { setActiveTab(tab.id as TabId); setMobileMenuOpen(false); }}
                        aria-current={isActive ? 'page' : undefined}
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
                  const foundTab = tabGroups.flatMap(g => g.tabs).find(t => t.id === favId);
                  if (!foundTab) return null;
                  const isFavActive = activeTab === favId;
                  const displayFavLabel = getTabLabel(foundTab.id, foundTab.label);
                  return (
                    <button
                      key={favId}
                      onClick={() => { setActiveTab(favId as TabId); setMobileMenuOpen(false); }}
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
               group.tabs.some((t) => {
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
      const hasActiveChild = clusterGroups.some(g => g.tabs.some(t => t.id === activeTab));

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
                  {matchingGroups.flatMap((g) => g.tabs).filter((tab) => {
                    if (!searchQuery) return true;
                    const query = searchQuery.toLowerCase();
                    const translatedLabel = getTabLabel(tab.id, tab.label);
                    const labelIncludes = (tab.label && tab.label.toLowerCase().includes(query)) || translatedLabel.toLowerCase().includes(query);
                    const keywords = TAB_KEYWORDS[tab.id] || [];
                    const keywordsInclude = keywords.some(k => k.includes(query));
                    return labelIncludes || keywordsInclude;
                  }).map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const isFav = favorites.includes(tab.id);
                    const tabDisplayName = getTabLabel(tab.id, tab.label);

                    return (
                      <div key={tab.id} className="group/item flex items-center gap-1">
                        <button 
                          onClick={() => { setActiveTab(tab.id as TabId); setMobileMenuOpen(false); }}
                          aria-current={isActive ? 'page' : undefined}
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
                const isGroupActive = group.tabs.some(t => t.id === activeTab || (t.id === 'stahlbeton_bemessung' && ['spannung', 'biegebemessung', 'querkraftbemessung', 'stuetzenbemessung', 'durchstanzen', 'verankerungslaenge', 'rissbreite'].includes(activeTab)));
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
                        {group.tabs.filter((tab) => {
                          if (!searchQuery) return true;
                          const query = searchQuery.toLowerCase();
                          const translatedLabel = getTabLabel(tab.id, tab.label);
                          const labelIncludes = (tab.label && tab.label.toLowerCase().includes(query)) || translatedLabel.toLowerCase().includes(query);
                          const keywords = TAB_KEYWORDS[tab.id] || [];
                          const keywordsInclude = keywords.some(k => k.includes(query));
                          return labelIncludes || keywordsInclude;
                        }).map((tab) => {
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
                                onClick={() => { setActiveTab(tab.id as TabId); setMobileMenuOpen(false); }}
                                aria-current={isActive ? 'page' : undefined}
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
    <VolltextTreffer anfrage={searchQuery} oeffne={(id) => { setActiveTab(id); setMobileMenuOpen(false); }} onAnzahl={setInhaltTreffer} />
    </>
  );
}
