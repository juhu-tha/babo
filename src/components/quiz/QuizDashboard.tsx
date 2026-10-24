import type { ClusterNummer } from '@/src/data/quizZuordnung';
import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Layers,
  ChevronRight
} from 'lucide-react';
import { QuizSessionResult, QuizGapItem } from '@/src/utils/studyStorage';
import { QUIZ_QUESTIONS } from '@/src/data/quizData';
import { useTabContext, TabType } from '@/src/contexts/TabContext';

interface QuizDashboardProps {
  history: QuizSessionResult[];
  activeGaps: QuizGapItem[];
  onStartQuizWithGaps?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

// Fixed metadata for standard modules to evaluate coverage & competence
export interface ModuleCompetenceStat {
  moduleId: string;
  moduleTitle: string;
  clusterId: ClusterNummer;
  clusterName: string;
  targetTab: string;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  gapCount: number;
  scorePercent: number; // 0-100%
  status: 'critical' | 'moderate' | 'solid' | 'untested';
}

const CLUSTERS: { id: ClusterNummer; name: string; color: string }[] = [
  { id: 'I', name: 'Cluster I: Grundlagen & Labor', color: '#64748b' },
  { id: 'II', name: 'Cluster II: Materialien & Produkte', color: '#475569' },
  { id: 'III', name: 'Cluster III: Entwurf & Bemessung', color: '#A3113E' },
  { id: 'IV', name: 'Cluster IV: Bestand & Nachhaltigkeit', color: '#334155' },
  { id: 'V', name: 'Cluster V: Digitales & Praxis', color: '#0f172a' }
];

export const QuizDashboard: React.FC<QuizDashboardProps> = ({
  history,
  activeGaps,
  onStartQuizWithGaps,
  onNavigateToTab
}) => {
  const { setActiveTab } = useTabContext();
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<'all' | ClusterNummer>('all');
  const [metricView, setMetricView] = useState<'both' | 'line' | 'heatmap'>('both');

  const handleTabClick = (tab: string) => {
    if (onNavigateToTab) {
      onNavigateToTab(tab);
    } else {
      setActiveTab(tab as TabType);
    }
  };

  // 1. Prepare Line Chart Data (Progress over time)
  const lineChartData = useMemo(() => {
    if (history.length === 0) {
      // Default placeholder data if no attempts have been made yet
      return [
        { session: 'Start (Baseline)', date: 'Vorab', score: 0, quote: 0, noteVal: 5.0, luecken: 0 }
      ];
    }

    // Chronological order (oldest to newest)
    const reversed = [...history].reverse();
    return reversed.map((h, idx) => {
      // Parse grade value into numeric for inverted secondary axis or display
      const numericGrade = parseFloat(h.grade.replace(',', '.')) || 4.0;
      return {
        session: `#${idx + 1}`,
        date: h.date,
        quote: h.percent,
        score: h.score,
        total: h.totalQuestions,
        note: h.grade,
        noteVal: numericGrade,
        passed: h.passed,
        luecken: h.gaps ? h.gaps.length : 0
      };
    });
  }, [history]);

  // 2. Prepare Module-Level Heatmap / Matrix Data
  const moduleCompetenceMap = useMemo(() => {
    const map = new Map<string, ModuleCompetenceStat>();

    // Seed from all available questions in QUIZ_QUESTIONS
    QUIZ_QUESTIONS.forEach(q => {
      if (!map.has(q.moduleId)) {
        map.set(q.moduleId, {
          moduleId: q.moduleId,
          moduleTitle: q.moduleTitle,
          clusterId: q.clusterId,
          clusterName: q.clusterName,
          targetTab: q.gapAnalysis?.targetModuleTab || q.route || q.moduleId,
          totalQuestions: 0,
          answeredCount: 0,
          correctCount: 0,
          gapCount: 0,
          scorePercent: 0,
          status: 'untested'
        });
      }
      const entry = map.get(q.moduleId)!;
      entry.totalQuestions += 1;
    });

    // Populate gaps
    activeGaps.forEach(gap => {
      if (map.has(gap.moduleId)) {
        map.get(gap.moduleId)!.gapCount += 1;
      }
    });

    // Parse history to compute performance per module
    if (history.length > 0) {
      // Map of latest answers or aggregated success
      const moduleCorrectCounts: Record<string, number> = {};
      const moduleTotalAskedCounts: Record<string, number> = {};

      history.forEach(session => {
        // We look at gaps vs total in cluster scores
        // If session has gap list, count gaps
        session.gaps?.forEach(g => {
          moduleTotalAskedCounts[g.moduleId] = (moduleTotalAskedCounts[g.moduleId] || 0) + 1;
        });
      });

      map.forEach((stat, mId) => {
        // Determine status based on active gaps and attempts
        if (stat.gapCount > 0) {
          // If 2 or more gaps, critical; otherwise moderate
          stat.status = stat.gapCount >= 2 ? 'critical' : 'moderate';
          stat.scorePercent = Math.max(10, Math.round(100 - (stat.gapCount / stat.totalQuestions) * 100));
        } else if (history.length > 0) {
          // If tested in history with 0 gaps remaining -> solid
          stat.status = 'solid';
          stat.scorePercent = 100;
        } else {
          stat.status = 'untested';
          stat.scorePercent = 0;
        }
      });
    }

    return Array.from(map.values()).sort((a, b) => {
      // Sort cluster first, then title
      if (a.clusterId !== b.clusterId) return a.clusterId.localeCompare(b.clusterId);
      return a.moduleTitle.localeCompare(b.moduleTitle);
    });
  }, [activeGaps, history]);

  // Filtered modules by cluster
  const filteredModules = useMemo(() => {
    if (selectedClusterFilter === 'all') return moduleCompetenceMap;
    return moduleCompetenceMap.filter(m => m.clusterId === selectedClusterFilter);
  }, [moduleCompetenceMap, selectedClusterFilter]);

  // Competence summary numbers
  const summaryMetrics = useMemo(() => {
    const totalModules = moduleCompetenceMap.length;
    const criticalModules = moduleCompetenceMap.filter(m => m.status === 'critical').length;
    const moderateModules = moduleCompetenceMap.filter(m => m.status === 'moderate').length;
    const solidModules = moduleCompetenceMap.filter(m => m.status === 'solid').length;
    const untestedModules = moduleCompetenceMap.filter(m => m.status === 'untested').length;

    const totalSessions = history.length;
    const avgScore = totalSessions > 0
      ? Math.round(history.reduce((acc, curr) => acc + curr.percent, 0) / totalSessions)
      : 0;

    const latestSession = history.length > 0 ? history[0] : null;

    return {
      totalModules,
      criticalModules,
      moderateModules,
      solidModules,
      untestedModules,
      totalSessions,
      avgScore,
      latestSession
    };
  }, [moduleCompetenceMap, history]);

  // Cluster breakdown bar chart data
  const clusterChartData = useMemo(() => {
    return CLUSTERS.map(c => {
      const inCluster = moduleCompetenceMap.filter(m => m.clusterId === c.id);
      const withGaps = inCluster.reduce((sum, curr) => sum + curr.gapCount, 0);
      const solid = inCluster.filter(m => m.status === 'solid').length;
      const totalInCluster = inCluster.length;
      const coverageRate = Math.round((solid / Math.max(1, totalInCluster)) * 100);

      return {
        cluster: `Cluster ${c.id}`,
        name: c.name.replace(/Cluster [I|V]+:\s*/, ''),
        gaps: withGaps,
        solideModule: solid,
        offeneModule: totalInCluster - solid,
        quote: coverageRate
      };
    });
  }, [moduleCompetenceMap]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top Hero KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-text-main/60 uppercase tracking-wider">
            <span>Absolvierte Quizze</span>
            <Calendar size={15} className="text-shiraz" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-text-main">
              {formatDeWert(summaryMetrics.totalSessions)}
            </span>
            <span className="text-[11px] text-text-main/60">Sessions</span>
          </div>
          <span className="text-[10px] text-text-main/60 mt-1">
            {summaryMetrics.latestSession ? `Letztes: ${summaryMetrics.latestSession.date}` : 'Noch keine Versuche'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-text-main/60 uppercase tracking-wider">
            <span>Durchschnittsquote</span>
            <TrendingUp size={15} className="text-shiraz" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-text-main">
              {formatDeWert(summaryMetrics.avgScore)}%
            </span>
            <span className="text-[11px] text-text-main/60">über alle Tests</span>
          </div>
          <span className="text-[10px] text-text-main/60 mt-1">
            Ziel: &gt; 80% für Klausursicherheit
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-text-main/60 uppercase tracking-wider">
            <span>Offene Wissenslücken</span>
            <AlertTriangle size={15} className="text-shiraz" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${activeGaps.length > 0 ? 'text-shiraz' : 'text-slate-800'}`}>
              {activeGaps.length}
            </span>
            <span className="text-[11px] text-text-main/60">in {formatDeWert(summaryMetrics.criticalModules + summaryMetrics.moderateModules)} Modulen</span>
          </div>
          <span className="text-[10px] text-shiraz mt-1 font-semibold">
            {activeGaps.length === 0 ? 'Keine aktiven Lücken!' : 'Repetitorium empfohlen'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-text-main/60 uppercase tracking-wider">
            <span>Gemeisterte Module</span>
            <CheckCircle2 size={15} className="text-slate-700" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-slate-800">
              {formatDeWert(summaryMetrics.solidModules)}
            </span>
            <span className="text-[11px] text-text-main/60">von {formatDeWert(summaryMetrics.totalModules)} Modulen</span>
          </div>
          <div className="w-full bg-slate-150 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-shiraz h-full rounded-full transition-all"
              style={{ width: `${Math.round((summaryMetrics.solidModules / Math.max(1, summaryMetrics.totalModules)) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main View Filter & Retest CTA */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-home-grau/30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text-main uppercase tracking-wider">Ansicht:</span>
          <div className="flex bg-off-white p-1 rounded-xl border border-home-grau/25 text-xs font-bold">
            <button aria-pressed={metricView === 'both'}
              onClick={() => setMetricView('both')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                metricView === 'both' ? 'bg-shiraz text-white shadow-xs' : 'text-text-main/70 hover:text-text-main'
              }`}
            >
              Kombiniert
            </button>
            <button aria-pressed={metricView === 'line'}
              onClick={() => setMetricView('line')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                metricView === 'line' ? 'bg-shiraz text-white shadow-xs' : 'text-text-main/70 hover:text-text-main'
              }`}
            >
              Liniendiagramm (Verlauf)
            </button>
            <button aria-pressed={metricView === 'heatmap'}
              onClick={() => setMetricView('heatmap')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                metricView === 'heatmap' ? 'bg-shiraz text-white shadow-xs' : 'text-text-main/70 hover:text-text-main'
              }`}
            >
              Modul-Heatmap
            </button>
          </div>
        </div>

        {activeGaps.length > 0 && onStartQuizWithGaps && (
          <button
            type="button"
            onClick={onStartQuizWithGaps}
            className="w-full sm:w-auto px-4 py-2.5 bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <RefreshCw size={14} className="animate-spin-slow" />
            <span>Nur erkannte Wissenslücken wiederholen ({activeGaps.length})</span>
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. LINIENDIAGRAMM (Fortschritt & Wissenslücken über Zeit) */}
      {/* ------------------------------------------------------------- */}
      {(metricView === 'both' || metricView === 'line') && (
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-home-grau/30 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-text-main flex items-center gap-2">
                <TrendingUp size={20} className="text-shiraz" />
                Lernkurve &amp; Fehlerquoten-Entwicklung (Recharts)
              </h3>
              <p className="text-xs text-text-main/70">
                Visualisiert die Erfolgsquote (%) sowie die verbleibende Anzahl offener Wissenslücken über alle Quiz-Durchläufe hinweg.
              </p>
            </div>
            {history.length > 0 && (
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg self-start sm:self-auto border border-slate-200">
                {history.length} Messpunkte erfasst
              </span>
            )}
          </div>

          {history.length === 0 ? (
            <div className="p-10 border border-dashed border-home-grau/30 rounded-2xl bg-off-white/60 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center">
                <BarChart3 size={24} />
              </div>
              <h4 className="text-sm font-bold text-text-main">Noch keine Quiz-Durchläufe vorhanden</h4>
              <p className="text-xs text-text-main/70 max-w-md">
                Starten Sie oben ein Quiz (z. B. den 360° Diagnose-Check). Nach Abschluss wird hier Ihre persönliche 
                Lernkurve mit Erfolgsquote und Wissenslücken-Reduktion grafisch gezeichnet.
              </p>
            </div>
          ) : (
            <div className="w-full h-72 sm:h-80 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineChartData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="session" 
                    tick={{ fontSize: 11, fill: '#475569' }}
                    stroke="#cbd5e1"
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fontSize: 11, fill: '#475569' }}
                    unit="%" 
                    stroke="#cbd5e1"
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3.5 rounded-xl shadow-lg border border-home-grau/30 text-xs flex flex-col gap-1.5 min-w-[200px]">
                            <div className="font-bold text-text-main flex items-center justify-between border-b border-home-grau/20 pb-1.5">
                              <span>Durchlauf {data.session}</span>
                              <span className="text-[10px] text-text-main/60">{data.date}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-text-main/70">Erfolgsquote:</span>
                              <span className="font-bold text-shiraz font-mono">{data.quote}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-text-main/70">Ergebnis:</span>
                              <span className="font-mono">{data.score} / {data.total} richtig</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-text-main/70">Note:</span>
                              <span className={`font-bold font-mono ${data.passed ? 'text-emerald-700' : 'text-rose-600'}`}>
                                {data.note}
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-home-grau/10">
                              <span className="text-rose-700 font-semibold">Erkannte Lücken:</span>
                              <span className="font-bold text-rose-700 font-mono">{data.luecken}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    wrapperStyle={{ fontSize: 12, paddingBottom: 10 }}
                  />
                  <Line
                    type="monotone"
                    name="Erfolgsquote (%)"
                    dataKey="quote"
                    stroke="#881235"
                    strokeWidth={3}
                    dot={{ fill: '#881235', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    name="Offene Wissenslücken"
                    dataKey="luecken"
                    stroke="#A3113E"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ fill: '#A3113E', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Quick cluster competence bar overview */}
          <div className="mt-4 pt-6 border-t border-home-grau/20">
            <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers size={15} className="text-shiraz" />
              Verteilung offener Wissenslücken auf die 5 Cluster
            </h4>
            <div className="w-full h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clusterChartData} margin={{ top: 5, right: 10, left: -15, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="cluster" tick={{ fontSize: 11, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-xl shadow-md border border-home-grau/20 text-xs space-y-1">
                            <strong className="block text-text-main">{d.cluster}: {d.name}</strong>
                            <div className="text-rose-700">Wissenslücken: {d.gaps}</div>
                            <div className="text-emerald-700">Gemeisterte Module: {d.solideModule}</div>
                            <div className="text-text-main/60">Abdeckungsgrad: {d.quote}%</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="gaps" name="Wissenslücken" fill="#A3113E" radius={[4, 4, 0, 0]}>
                    {clusterChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#881235' : '#A3113E'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. MODUL-HEATMAP & WISSENSMATRIX */}
      {/* ------------------------------------------------------------- */}
      {(metricView === 'both' || metricView === 'heatmap') && (
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-home-grau/30 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/20 pb-4">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-text-main flex items-center gap-2">
                <BarChart3 size={20} className="text-shiraz" />
                Modul-Kompetenz-Heatmap &amp; Lücken-Matrix
              </h3>
              <p className="text-xs text-text-main/70">
                Farbcodierte Matrix aller {moduleCompetenceMap.length} Lehrplan-Module. Klicken Sie auf ein Modul, 
                um die Wissenslücke direkt im jeweiligen Modul zu schließen.
              </p>
            </div>

            {/* Cluster Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-off-white p-1 rounded-xl border border-home-grau/20 self-start md:self-auto">
              <button aria-pressed={selectedClusterFilter === 'all'}
                type="button"
                onClick={() => setSelectedClusterFilter('all')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedClusterFilter === 'all'
                    ? 'bg-shiraz text-white shadow-2xs'
                    : 'text-text-main/70 hover:text-text-main'
                }`}
              >
                Alle ({moduleCompetenceMap.length})
              </button>
              {(['I', 'II', 'III', 'IV', 'V'] as const).map(cId => {
                const count = moduleCompetenceMap.filter(m => m.clusterId === cId).length;
                return (
                  <button
                    key={cId}
                    type="button"
                    onClick={() => setSelectedClusterFilter(cId)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      selectedClusterFilter === cId
                        ? 'bg-shiraz text-white shadow-2xs'
                        : 'text-text-main/70 hover:text-text-main'
                    }`}
                  >
                    Cluster {cId} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-text-main/80 bg-off-white/80 p-3 rounded-xl border border-home-grau/20">
            <span className="font-bold text-[11px] uppercase tracking-wider text-text-main/60">Legende:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-rose-500 shadow-2xs inline-block" />
              <span>Kritische Lücke (≥ 2 Fehler)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-amber-400 shadow-2xs inline-block" />
              <span>Vertiefung nötig (1 Fehler)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 shadow-2xs inline-block" />
              <span>Solides Fachwissen (Fehlerfrei)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-slate-200 border border-slate-300 inline-block" />
              <span>Noch nicht geprüft</span>
            </div>
          </div>

          {/* Heatmap Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredModules.map(mod => {
              const isCritical = mod.status === 'critical';
              const isModerate = mod.status === 'moderate';
              const isSolid = mod.status === 'solid';

              // Visual styles based on status
              const cardClass = isCritical
                ? 'bg-rose-50/70 border-rose-300 hover:border-rose-400 hover:bg-rose-50 shadow-2xs'
                : isModerate
                ? 'bg-amber-50/70 border-amber-300 hover:border-amber-400 hover:bg-amber-50 shadow-2xs'
                : isSolid
                ? 'bg-emerald-50/60 border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50 shadow-2xs'
                : 'bg-white border-home-grau/25 hover:border-home-grau/50 text-text-main/80';

              const badgeColor = isCritical
                ? 'bg-rose-600 text-white'
                : isModerate
                ? 'bg-amber-500 text-white'
                : isSolid
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-150 text-slate-700';

              return (
                <div
                  key={mod.moduleId}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 group ${cardClass}`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="font-mono text-text-main/60 uppercase">
                        Cluster {mod.clusterId}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${badgeColor}`}>
                        {isCritical
                          ? `${mod.gapCount} Lücken`
                          : isModerate
                          ? '1 Lücke'
                          : isSolid
                          ? '100% Sicher'
                          : 'Ungeprüft'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-text-main group-hover:text-shiraz transition-colors line-clamp-1">
                      {mod.moduleTitle}
                    </h4>

                    <p className="text-[11px] text-text-main/70 leading-snug line-clamp-2">
                      {mod.clusterName} • {formatDeWert(mod.totalQuestions)} Prüffragen im Katalog
                    </p>
                  </div>

                  {/* Competence Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-text-main/60">
                      <span>Kompetenzgrad</span>
                      <span className="font-mono">
                        {isSolid ? '100%' : isCritical ? `${mod.scorePercent}%` : isModerate ? `${mod.scorePercent}%` : '—'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isCritical ? 'bg-rose-500' : isModerate ? 'bg-amber-500' : isSolid ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                        style={{ width: `${isSolid ? 100 : mod.scorePercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Direct Jump Action Button */}
                  <button
                    type="button"
                    onClick={() => handleTabClick(mod.targetTab)}
                    className="w-full mt-1 py-1.5 px-3 rounded-xl bg-white/80 hover:bg-white text-xs font-bold text-text-main border border-home-grau/25 group-hover:border-shiraz/40 group-hover:text-shiraz transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>Modul aufrufen</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDashboard;
