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
  ChevronDown,
  ChevronRight,
  Compass,
  X,
  BookOpen,
  ListTree,
  Columns,
  Filter,
  Scale,
  Droplets,
  Grid,
  Monitor,
  Box
} from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { BAUM_GRUPPEN, MODUL_BY_ID } from '@/src/registry/modules';
import { iconFor } from '@/src/registry/icons';
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

// Cluster der Modulübersicht (Darstellung). Gruppen, Reihenfolge und Knoten kommen aus der
// zentralen Modul-Registry (src/registry/modules.ts: BAUM_GRUPPEN und MODULE[].baum).
const BAUM_CLUSTER: Omit<TreeCluster, 'groups'>[] = [
  {
    id: 'allgemein',
    number: '0',
    name: 'Allgemein & System',
    subtitle: 'Campus-Portal, Navigation, Handbuch & Dokumentation',
    accentBg: 'bg-slate-100 dark:bg-slate-800',
    accentBorder: 'border-slate-300 dark:border-slate-600',
    accentText: 'text-slate-800 dark:text-slate-200',
    icon: iconFor('GraduationCap'),
  },
  {
    id: 'cluster_1',
    number: 'I',
    name: 'Grundlagen & Labor',
    subtitle: 'Stoffphysik, Bauchemie, Werkstoffmechanik, Bauphysik & Prüftechnik',
    accentBg: 'bg-rose-50 dark:bg-rose-950/30',
    accentBorder: 'border-shiraz/30 dark:border-rose-900/50',
    accentText: 'text-shiraz dark:text-rose-400',
    icon: iconFor('Calculator'),
  },
  {
    id: 'cluster_2',
    number: 'II',
    name: 'Materialien & Produkte',
    subtitle: 'Werkstoffkunde, Schichtenverbunde, Faserverbund, Schutzschichten & Bauproduktenrecht',
    accentBg: 'bg-amber-50 dark:bg-amber-950/30',
    accentBorder: 'border-amber-300 dark:border-amber-800',
    accentText: 'text-amber-900 dark:text-amber-400',
    icon: iconFor('Layers'),
  },
  {
    id: 'cluster_3',
    number: 'III',
    name: 'Entwurf & Bemessung',
    subtitle: 'Betontechnologie, Stahlbetonbau (EC 2), Ingenieurholzbau (EC 5) & Innenausbau',
    accentBg: 'bg-blue-50 dark:bg-blue-950/30',
    accentBorder: 'border-blue-300 dark:border-blue-800',
    accentText: 'text-blue-900 dark:text-blue-400',
    icon: iconFor('Droplets'),
  },
  {
    id: 'cluster_4',
    number: 'IV',
    name: 'Bestand & Nachhaltigkeit',
    subtitle: 'Bauwerksdiagnose (ZfP), Schadensatlas, Dauerhaftigkeit, Instandsetzung, Rückbau & LCA',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    accentBorder: 'border-emerald-300 dark:border-emerald-800',
    accentText: 'text-emerald-900 dark:text-emerald-400',
    icon: iconFor('Compass'),
  },
  {
    id: 'cluster_5',
    number: 'V',
    name: 'Digitales & Praxis',
    subtitle: 'BIM, Künstliche Intelligenz, AVA, Bauleitung, Bautagebuch, Software & Kuriositäten',
    accentBg: 'bg-purple-50 dark:bg-purple-950/30',
    accentBorder: 'border-purple-300 dark:border-purple-800',
    accentText: 'text-purple-900 dark:text-purple-400',
    icon: iconFor('Monitor'),
  },
  {
    id: 'cluster_6',
    number: 'VI',
    name: 'Studium & Lehre',
    subtitle: 'Vorlesungsportal THA, Baustofflabor, Übungsaufgaben, Beispielrechnungen, Weiterbildung & Thesen',
    accentBg: 'bg-teal-50 dark:bg-teal-950/30',
    accentBorder: 'border-teal-300 dark:border-teal-800',
    accentText: 'text-teal-900 dark:text-teal-400',
    icon: iconFor('GraduationCap'),
  },
];

export const BAUSTOFFBOARD_TREE: TreeCluster[] = BAUM_CLUSTER.map(c => ({
  ...c,
  groups: BAUM_GRUPPEN.filter(g => g.cluster === c.id).map(g => ({
    id: g.id,
    name: g.name,
    icon: iconFor(g.icon),
    nodes: g.knoten.map(id => {
      const m = MODUL_BY_ID.get(id);
      const b = m?.baum;
      if (!m || !b) throw new Error(`Modulübersicht: ${id} fehlt in der Registry oder hat keine baum-Angaben`);
      return { id, label: b.titel, type: b.typ, description: b.kurz, icon: iconFor(b.icon), norm: b.norm };
    }),
  })),
}));

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
            <span className="text-xl font-bold text-text-main block">{formatDeWert(metrics.totalClusters)} Cluster</span>
            <span className="text-[11px] text-text-main/70 font-medium">{formatDeWert(metrics.totalGroups)} Fachgruppen</span>
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
                  THA BaustoffBoard · {formatDeWert(metrics.totalModules)} Module
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
                  <span>{formatDeWert(cIdx + 1)}</span>
                  <span>Cluster {cluster.number}: {cluster.name}</span>
                </div>

                <div className="ml-5 space-y-3">
                  {cluster.groups.map((group, gIdx) => (
                    <div key={group.id} className="space-y-1.5">
                      <div className="text-xs font-bold text-text-main flex items-center gap-2">
                        <span className="text-text-main/50 font-mono">{formatDeWert(cIdx + 1)}.{formatDeWert(gIdx + 1)}</span>
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
                              <span className="font-mono text-text-main/40 mr-1.5">{formatDeWert(cIdx + 1)}.{formatDeWert(gIdx + 1)}.{formatDeWert(nIdx + 1)}</span>
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
