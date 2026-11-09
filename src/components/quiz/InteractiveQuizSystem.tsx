import type { ClusterNummer } from '@/src/data/quizZuordnung';
import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, CheckCircle2, XCircle, AlertTriangle, 
  ArrowRight, ArrowLeft, RotateCcw, BookOpen, Layers, Award, 
  Sparkles, Filter, ChevronRight, BarChart3, RefreshCw, Bookmark, 
  BookmarkCheck, ExternalLink, Compass, Brain,
  ChevronDown, ChevronUp, Info, FileText,
  Download, Upload,
  Target
} from 'lucide-react';
import { useTabContext, TabType } from '@/src/contexts/TabContext';
import { anzahlFreigegeben, type QuizQuestion } from '@/src/data/quizModell';
import { META_CLUSTERS } from '@/src/data/metaClusters';
import { useAlleFragen } from '@/src/data/quizLader';
import { questionsToCsv, parseCsvToQuestions } from '@/src/utils/quizCsv';
import { mischeAntworten } from '@/src/utils/mischeAntworten';
import { FreigabeEtikett } from './FreigabeEtikett';
import { 
  saveQuizSessionResult, 
  getQuizSessionHistory, 
  getStoredKnowledgeGaps, 
  removeStoredKnowledgeGap,
  QuizGapItem,
  QuizSessionResult
} from '@/src/utils/studyStorage';
import { AuswahlGruppe, ReiterLeiste, alsOption, alsReiter, reiterPanel } from '../ui/Auswahlgruppe';
// Lernstands-Dashboard (mit Diagrammbibliothek recharts) erst beim Öffnen laden (Phase 5, AP 5.5 Nachtrag)
const QuizDashboard = React.lazy(() => import('./QuizDashboard'));

export type QuizMode = 'diagnose_15' | 'full' | 'express_10' | 'cluster' | 'module' | 'gaps_retest' | 'gruppe';
export type FeedbackMode = 'instant' | 'exam';

export interface InteractiveQuizSystemProps {
  initialScope?: QuizMode;
  initialCluster?: ClusterNummer;
  initialModuleId?: string;
  /** Menügruppen (aus der Modul-Registry), auf die der Fragenpool begrenzt wird. */
  initialGruppen?: string[];
  gruppenLabel?: string;
  autoStart?: boolean;
}

const calculateGrade = (percent: number): { grade: string; text: string; passed: boolean; color: string } => {
  if (percent >= 90) return { grade: percent >= 95 ? '1,0' : '1,3', text: 'Sehr gut', passed: true, color: 'text-shiraz bg-shiraz/5 border-shiraz/30 font-bold' };
  if (percent >= 75) return { grade: percent >= 85 ? '1,7' : percent >= 80 ? '2,0' : '2,3', text: 'Gut', passed: true, color: 'text-slate-850 bg-slate-100 border-slate-300 font-semibold' };
  if (percent >= 60) return { grade: percent >= 70 ? '2,7' : percent >= 65 ? '3,0' : '3,3', text: 'Befriedigend', passed: true, color: 'text-slate-800 bg-slate-100 border-slate-250' };
  if (percent >= 50) return { grade: percent >= 55 ? '3,7' : '4,0', text: 'Ausreichend (Bestanden)', passed: true, color: 'text-slate-700 bg-slate-50 border-slate-200' };
  return { grade: '5,0', text: 'Nicht bestanden', passed: false, color: 'text-shiraz bg-shiraz/10 border-shiraz/40 font-bold' };
};

export const InteractiveQuizSystem: React.FC<InteractiveQuizSystemProps> = ({
  initialScope,
  initialCluster,
  initialModuleId,
  initialGruppen,
  gruppenLabel,
  autoStart
}) => {
  const { setActiveTab } = useTabContext();

  // Primary sub-tab: 'quiz' or 'dashboard'
  const [activeMainTab, setActiveMainTab] = useState<'quiz' | 'dashboard'>('quiz');

  // Phase
  const [phase, setPhase] = useState<'config' | 'quiz' | 'result'>('config');

  // Configuration (pre-initialized from props if provided - P26)
  const [quizScope, setQuizScope] = useState<QuizMode>(initialScope || 'diagnose_15');
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>('instant');
  const [selectedCluster, setSelectedCluster] = useState<ClusterNummer>(initialCluster || 'III');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(initialModuleId || 'beton');

  // Custom imported questions pool & status message
  const [customQuestions, setCustomQuestions] = useState<QuizQuestion[]>([]);
  const [importNotification, setImportNotification] = useState<string | null>(null);

  // Sync props when they change
  useEffect(() => {
    if (initialScope) setQuizScope(initialScope);
    if (initialCluster) setSelectedCluster(initialCluster);
    if (initialModuleId) setSelectedModuleId(initialModuleId);
  }, [initialScope, initialCluster, initialModuleId]);

  // Active Quiz State
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [instantRevealed, setInstantRevealed] = useState<Record<string, boolean>>({});

  // History & stored knowledge gaps
  const [storedGaps, setStoredGaps] = useState<QuizGapItem[]>([]);
  const [sessionHistory, setSessionHistory] = useState<QuizSessionResult[]>([]);
  const [showFullReview, setShowFullReview] = useState<boolean>(false);
  const [activeGapFilter, setActiveGapFilter] = useState<'all' | ClusterNummer>('all');

  // Load stored gaps and history on mount or phase change
  useEffect(() => {
    setStoredGaps(getStoredKnowledgeGaps());
    setSessionHistory(getQuizSessionHistory());
  }, [phase, activeMainTab]);

  // Combined questions pool (P26)
  // Fragenpool in Teilpaketen nachgeladen (quizLader); bis dahin leer
  const pool = useAlleFragen();
  const allQuestions = useMemo(() => [...(pool ?? []), ...customQuestions], [pool, customQuestions]);

  // Bereiche (Meta-Cluster der Menüführung), für die Fragen vorliegen; vor dem Laden alle Bereiche
  const bereiche = useMemo(() => {
    const vorhanden = new Set<string>(allQuestions.map(q => q.clusterId));
    const liste = META_CLUSTERS.filter(c => allQuestions.length === 0 || vorhanden.has(c.number));
    return liste.map(c => ({ id: c.number, name: `Cluster ${c.number}: ${c.name}`, desc: c.shortDesc }));
  }, [allQuestions]);

  // Unique modules list from available questions
  const availableModules = useMemo(() => {
    const map = new Map<string, { id: string; title: string; clusterId: string }>();
    allQuestions.forEach(q => {
      if (!map.has(q.moduleId)) {
        map.set(q.moduleId, { id: q.moduleId, title: q.moduleTitle, clusterId: q.clusterId });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title));
  }, [allQuestions]);

  // CSV Export & Import Handlers (P26)
  const handleExportCsv = () => {
    const csv = questionsToCsv(allQuestions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'baustoffboard_quiz_fragen.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        try {
          const imported = parseCsvToQuestions(text);
          if (imported.length > 0) {
            setCustomQuestions(prev => [...prev, ...imported]);
            setImportNotification(`${imported.length} neue Fragen erfolgreich aus CSV importiert.`);
            setTimeout(() => setImportNotification(null), 5000);
          } else {
            setImportNotification('Keine gültigen Fragen in der CSV-Datei gefunden.');
            setTimeout(() => setImportNotification(null), 5000);
          }
        } catch (err) {
          setImportNotification('Fehler beim Parsen der CSV-Datei.');
          setTimeout(() => setImportNotification(null), 5000);
        }
      }
    };
    reader.readAsText(file);
  };

  // Start Quiz
  const gruppenFragenZahl = useMemo(
    () => allQuestions.filter(q => q.gruppe && (initialGruppen ?? []).includes(q.gruppe)).length,
    [allQuestions, initialGruppen]
  );

  const startQuiz = (overrideMode?: QuizMode, overrideQuestions?: QuizQuestion[]) => {
    const mode = overrideMode || quizScope;
    let pool: QuizQuestion[] = [];

    if (overrideQuestions && overrideQuestions.length > 0) {
      pool = overrideQuestions;
    } else if (mode === 'diagnose_15') {
      // Balanced sample across clusters
      const clusters: (ClusterNummer)[] = ['I', 'II', 'III', 'IV', 'V'];
      const sampled: QuizQuestion[] = [];
      clusters.forEach(c => {
        const inCluster = allQuestions.filter(q => q.clusterId === c);
        const shuffled = [...inCluster].sort(() => Math.random() - 0.5);
        sampled.push(...shuffled.slice(0, 3));
      });
      // Fill to 15 if needed
      const remaining = allQuestions.filter(q => !sampled.find(s => s.id === q.id)).sort(() => Math.random() - 0.5);
      pool = [...sampled, ...remaining.slice(0, Math.max(0, 15 - sampled.length))];
    } else if (mode === 'express_10') {
      pool = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
    } else if (mode === 'cluster') {
      pool = allQuestions.filter(q => q.clusterId === selectedCluster);
    } else if (mode === 'gruppe') {
      const gruppen = new Set(initialGruppen ?? []);
      pool = [...allQuestions.filter(q => q.gruppe && gruppen.has(q.gruppe))].sort(() => Math.random() - 0.5);
    } else if (mode === 'module') {
      pool = allQuestions.filter(q => q.moduleId === selectedModuleId);
    } else if (mode === 'gaps_retest') {
      const gapQuestionIds = new Set(storedGaps.map(g => g.questionId));
      pool = allQuestions.filter(q => gapQuestionIds.has(q.id));
      if (pool.length === 0) {
        pool = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
      }
    } else {
      // 'full'
      pool = [...allQuestions].sort(() => Math.random() - 0.5);
    }

    if (pool.length === 0) {
      pool = [...allQuestions].slice(0, 10);
    }

    setActiveQuestions(pool.map(q => mischeAntworten(q)));
    setCurrentIndex(0);
    setAnswers({});
    setBookmarked({});
    setInstantRevealed({});
    setPhase('quiz');
  };

  const handleSelectOption = (optIdx: number) => {
    const currentQ = activeQuestions[currentIndex];
    if (!currentQ) return;

    setAnswers(prev => ({ ...prev, [currentQ.id]: optIdx }));
    if (feedbackMode === 'instant') {
      setInstantRevealed(prev => ({ ...prev, [currentQ.id]: true }));
    }
  };

  const toggleBookmark = (id: string) => {
    setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Complete Quiz & generate Knowledge Gap Analysis
  const handleFinishQuiz = () => {
    // Generate gaps
    const detectedGaps: QuizGapItem[] = [];

    activeQuestions.forEach(q => {
      const userChoice = answers[q.id];
      if (userChoice !== q.correctIdx) {
        detectedGaps.push({
          questionId: q.id,
          topic: q.topic,
          moduleId: q.moduleId,
          moduleTitle: q.moduleTitle,
          targetModuleTab: q.gapAnalysis?.targetModuleTab || q.route || q.moduleId,
          clusterId: q.clusterId,
          clusterName: q.clusterName,
          misconception: q.gapAnalysis?.misconception || 'Fehlendes Detailwissen bei baustofflichen Kenngrößen.',
          coreRule: q.gapAnalysis?.coreRule || q.explanation,
          actionableAdvice: q.gapAnalysis?.actionableAdvice || `Wiederholen Sie die Lehrinhalte im Modul ${q.moduleTitle}.`,
          date: new Date().toLocaleDateString('de-DE')
        });
      } else {
        // If answered correctly in re-test, remove from stored gaps
        removeStoredKnowledgeGap(q.id);
      }
    });

    // Score calculations
    const score = activeQuestions.filter(q => answers[q.id] === q.correctIdx).length;
    const total = activeQuestions.length;
    const percent = Math.round((score / total) * 100);
    const gradeObj = calculateGrade(percent);

    // Cluster score breakdown
    const clusterScores: Record<string, { correct: number; total: number; percent: number }> = {};
    activeQuestions.forEach(q => {
      if (!clusterScores[q.clusterId]) {
        clusterScores[q.clusterId] = { correct: 0, total: 0, percent: 0 };
      }
      clusterScores[q.clusterId].total += 1;
      if (answers[q.id] === q.correctIdx) {
        clusterScores[q.clusterId].correct += 1;
      }
    });

    Object.keys(clusterScores).forEach(cId => {
      const item = clusterScores[cId];
      item.percent = Math.round((item.correct / item.total) * 100);
    });

    // Save session
    saveQuizSessionResult({
      id: `quiz_${Date.now()}`,
      date: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      score,
      totalQuestions: total,
      percent,
      grade: gradeObj.grade,
      passed: gradeObj.passed,
      clusterScores,
      gaps: detectedGaps
    });

    setStoredGaps(getStoredKnowledgeGaps());
    setPhase('result');
  };

  // Launch targeted re-test with detected gaps
  const handleRetestGaps = () => {
    const wrongQuestions = activeQuestions.filter(q => answers[q.id] !== q.correctIdx);
    if (wrongQuestions.length > 0) {
      startQuiz('gaps_retest', wrongQuestions);
    } else if (storedGaps.length > 0) {
      startQuiz('gaps_retest');
    }
  };

  // Navigate to module
  const handleGoToModule = (tab: string) => {
    setActiveTab(tab as TabType);
  };

  // Result metrics
  const score = activeQuestions.filter(q => answers[q.id] === q.correctIdx).length;
  const total = activeQuestions.length;
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const gradeObj = calculateGrade(percent);
  const detectedGaps = activeQuestions.filter(q => answers[q.id] !== q.correctIdx);

  // Filtered gaps for results view
  const filteredGaps = useMemo(() => {
    if (activeGapFilter === 'all') return detectedGaps;
    return detectedGaps.filter(q => q.clusterId === activeGapFilter);
  }, [detectedGaps, activeGapFilter]);

  // Cluster breakdown in results
  const clusterBreakdown = useMemo(() => {
    const map: Record<string, { clusterId: string; clusterName: string; correct: number; total: number }> = {};
    activeQuestions.forEach(q => {
      if (!map[q.clusterId]) {
        map[q.clusterId] = {
          clusterId: q.clusterId,
          clusterName: q.clusterName,
          correct: 0,
          total: 0
        };
      }
      map[q.clusterId].total += 1;
      if (answers[q.id] === q.correctIdx) {
        map[q.clusterId].correct += 1;
      }
    });
    return Object.values(map);
  }, [activeQuestions, answers]);

  // Current question during quiz
  const currentQ = activeQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Sub-Navigation between Quiz & Dashboard */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-home-grau/30 shadow-xs">
        <ReiterLeiste label="Quiz oder Auswertung" className="flex items-center gap-2">
          <button {...alsReiter(activeMainTab === 'quiz', 'quiz-haupt', 'quiz')}
            type="button"
            onClick={() => setActiveMainTab('quiz')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'quiz'
                ? 'bg-shiraz text-white shadow-xs'
                : 'text-text-main/70 hover:text-text-main hover:bg-slate-50'
            }`}
          >
            <GraduationCap size={16} />
            <span>Quiz &amp; Wissenscheck</span>
          </button>

          <button {...alsReiter(activeMainTab === 'dashboard', 'quiz-haupt', 'dashboard')}
            type="button"
            onClick={() => setActiveMainTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'dashboard'
                ? 'bg-shiraz text-white shadow-xs'
                : 'text-text-main/70 hover:text-text-main hover:bg-slate-50'
            }`}
          >
            <BarChart3 size={16} />
            <span>Fortschritts- &amp; Lücken-Dashboard</span>
            {storedGaps.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-shiraz text-white">
                {storedGaps.length}
              </span>
            )}
          </button>
        </ReiterLeiste>

        {activeMainTab === 'dashboard' && (
          <button
            type="button"
            onClick={() => {
              setActiveMainTab('quiz');
              setPhase('config');
            }}
            className="px-3.5 py-2 text-xs font-bold text-shiraz hover:bg-shiraz/10 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Neues Quiz starten</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* DASHBOARD TAB VIEW */}
      {activeMainTab === 'dashboard' && (
        <div {...reiterPanel('quiz-haupt', activeMainTab)}><React.Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
        <QuizDashboard
          history={sessionHistory}
          activeGaps={storedGaps}
          onStartQuizWithGaps={() => {
            setActiveMainTab('quiz');
            startQuiz('gaps_retest');
          }}
          onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
        />
        </React.Suspense></div>
      )}

      {/* QUIZ TAB VIEW */}
      {activeMainTab === 'quiz' && (
        <div {...reiterPanel('quiz-haupt', activeMainTab)} className="flex flex-col gap-6">
          {/* ------------------------------------------------------------- */}
          {/* PHASE 1: CONFIGURATION & OVERVIEW */}
          {/* ------------------------------------------------------------- */}
          {phase === 'config' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-home-grau/30 shadow-sm flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/30 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3.5 bg-shiraz/10 rounded-2xl text-shiraz shrink-0">
                <GraduationCap size={30} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2">
                  Interaktives Quiz-System &amp; Wissenslücken-Diagnostik
                </h2>
                <p className="text-xs sm:text-sm text-text-main/70 pt-1">
                  Testen Sie Ihr Wissen über alle {bereiche.length} Bereiche. Nach Abschluss zeigt das System,
                  in welchen Themen Lücken bestehen, und verlinkt Sie direkt zu den passenden Vorlesungsmodulen.
                </p>
              </div>
            </div>

            {storedGaps.length > 0 && (
              <div className="bg-shiraz/5 border border-shiraz/20 p-3 rounded-2xl flex items-center gap-3 shrink-0">
                <div className="p-2 bg-shiraz/10 text-shiraz rounded-xl">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-shiraz block">Gespeicherte Lücken</span>
                  <span className="text-xs font-bold text-text-main">{storedGaps.length} offene Wissenslücke(n)</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Selection Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
              <Filter size={16} className="text-shiraz" /> 1. Quiz-Umfang &amp; Fokus wählen
            </h3>

            <AuswahlGruppe label="Quiz-Umfang und Fokus" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {initialGruppen && initialGruppen.length > 0 && (
                <button {...alsOption(quizScope === 'gruppe')}
                  type="button"
                  onClick={() => setQuizScope('gruppe')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    quizScope === 'gruppe'
                      ? 'border-shiraz bg-shiraz/5 ring-2 ring-shiraz/20 shadow-xs'
                      : 'border-home-grau/30 bg-off-white hover:border-home-grau/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
                      <Target size={20} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-home-grau/30 text-shiraz font-mono">
                      {formatDeWert(gruppenFragenZahl)} Fragen
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-main">Themen-Quiz: {gruppenLabel ?? initialGruppen.join(', ')}</h4>
                    <p className="text-xs text-text-main/70 mt-1 leading-relaxed">
                      Alle Fragen aus den Menügruppen {initialGruppen.join(', ')}.
                    </p>
                  </div>
                </button>
              )}

              {/* Option 1: 360 Diagnostic */}
              <button {...alsOption(quizScope === 'diagnose_15')}
                type="button"
                onClick={() => setQuizScope('diagnose_15')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  quizScope === 'diagnose_15'
                    ? 'border-shiraz bg-shiraz/5 ring-2 ring-shiraz/20 shadow-xs'
                    : 'border-home-grau/30 bg-off-white hover:border-home-grau/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
                    <Sparkles size={20} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-home-grau/30 text-shiraz font-mono">
                    15 Fragen
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main">360° Diagnose-Check</h4>
                  <p className="text-xs text-text-main/70 mt-1 leading-relaxed">
                    Ausgewogene Fragenmischung über alle 5 Cluster. Ideal für eine umfassende Wissenslücken-Analyse.
                  </p>
                </div>
              </button>

              {/* Option 2: Express Check */}
              <button {...alsOption(quizScope === 'express_10')}
                type="button"
                onClick={() => setQuizScope('express_10')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  quizScope === 'express_10'
                    ? 'border-shiraz bg-shiraz/5 ring-2 ring-shiraz/20 shadow-xs'
                    : 'border-home-grau/30 bg-off-white hover:border-home-grau/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-slate-100 text-slate-800 rounded-xl">
                    <Compass size={20} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-home-grau/30 text-slate-800 font-mono">
                    10 Fragen
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main">Express-Standortbestimmung</h4>
                  <p className="text-xs text-text-main/70 mt-1 leading-relaxed">
                    Kompakter Schnelldurchlauf für zwischendurch. Prüft Kernaspekte in unter 10 Minuten.
                  </p>
                </div>
              </button>

              {/* Option 3: Cluster Focus */}
              <button {...alsOption(quizScope === 'cluster')}
                type="button"
                onClick={() => setQuizScope('cluster')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  quizScope === 'cluster'
                    ? 'border-shiraz bg-shiraz/5 ring-2 ring-shiraz/20 shadow-xs'
                    : 'border-home-grau/30 bg-off-white hover:border-home-grau/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-slate-100 text-slate-800 rounded-xl">
                    <Layers size={20} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-home-grau/30 text-slate-800 font-mono">
                    Cluster-Fokus
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main">Themen-Cluster trainieren</h4>
                  <p className="text-xs text-text-main/70 mt-1 leading-relaxed">
                    Gezielte Vertiefung in einem einzelnen Cluster (z. B. Entwurf &amp; Bemessung).
                  </p>
                </div>
              </button>

              {/* Option 4: Module Focus */}
              <button {...alsOption(quizScope === 'module')}
                type="button"
                onClick={() => setQuizScope('module')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  quizScope === 'module'
                    ? 'border-shiraz bg-shiraz/5 ring-2 ring-shiraz/20 shadow-xs'
                    : 'border-home-grau/30 bg-off-white hover:border-home-grau/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-slate-100 text-slate-800 rounded-xl">
                    <BookOpen size={20} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-home-grau/30 text-slate-800 font-mono">
                    Modulspezifisch
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main">Einzelfach-Vertiefung</h4>
                  <p className="text-xs text-text-main/70 mt-1 leading-relaxed">
                    Gezieltes Quiz zu einem konkreten Modul (z. B. Gläser &amp; Fenster, Zement, Beton).
                  </p>
                </div>
              </button>

              {/* Option 5: Gaps Retest (if gaps exist) */}
              <button {...alsOption(quizScope === 'gaps_retest')}
                type="button"
                disabled={storedGaps.length === 0}
                onClick={() => setQuizScope('gaps_retest')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                  storedGaps.length === 0
                    ? 'opacity-50 cursor-not-allowed border-home-grau/20 bg-slate-50'
                    : quizScope === 'gaps_retest'
                    ? 'border-shiraz bg-shiraz/5 ring-2 ring-shiraz/20 shadow-xs cursor-pointer'
                    : 'border-shiraz/30 bg-shiraz/5 hover:border-shiraz cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
                    <RefreshCw size={20} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-shiraz/30 text-shiraz font-mono">
                    {storedGaps.length} Lücken
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main">Wissenslücken-Repetitorium</h4>
                  <p className="text-xs text-text-main/70 mt-1 leading-relaxed">
                    Trainiert ausschließlich die Fragen, die in vorherigen Durchläufen falsch beantwortet wurden.
                  </p>
                </div>
              </button>

              {/* Option 6: Full Library */}
              <button {...alsOption(quizScope === 'full')}
                type="button"
                onClick={() => setQuizScope('full')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  quizScope === 'full'
                    ? 'border-shiraz bg-shiraz/5 ring-2 ring-shiraz/20 shadow-xs'
                    : 'border-home-grau/30 bg-off-white hover:border-home-grau/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-slate-100 text-slate-800 rounded-xl">
                    <Award size={20} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-home-grau/30 text-slate-800 font-mono">
                    Alle Fragen
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main">Vollständiger Fragenkatalog</h4>
                  <p className="text-xs text-text-main/70 mt-1 leading-relaxed">
                    Alle {allQuestions.length} Fachfragen des Pools, davon {formatDeWert(anzahlFreigegeben(allQuestions))} fachlich freigegeben; ungeprüfte Fragen sind gekennzeichnet.
                  </p>
                </div>
              </button>
            </AuswahlGruppe>
          </div>

          {/* Sub-selectors for Cluster or Module */}
          {quizScope === 'cluster' && (
            <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-3">
              <label className="text-xs font-bold text-text-main uppercase tracking-wider block">
                Themen-Cluster auswählen:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {bereiche.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCluster(c.id as typeof selectedCluster)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedCluster === c.id
                        ? 'bg-shiraz text-white border-shiraz shadow-xs'
                        : 'bg-white text-text-main border-home-grau/30 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs font-bold block">{c.name}</span>
                    <span className={`text-[11px] block mt-0.5 ${selectedCluster === c.id ? 'text-white/80' : 'text-text-main/60'}`}>
                      {c.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizScope === 'module' && (
            <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-3">
              <label className="text-xs font-bold text-text-main uppercase tracking-wider block">
                Spezifisches Fachmodul auswählen:
              </label>
              <select aria-label="Spezifisches Fachmodul auswählen"
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                className="w-full p-3 bg-white border border-home-grau/30 rounded-xl text-sm font-semibold text-text-main focus:outline-none focus:border-shiraz"
              >
                {availableModules.map(m => (
                  <option key={m.id} value={m.id}>
                    Cluster {m.clusterId} — {m.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Feedback mode selector */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
              <Brain size={16} className="text-shiraz" /> 2. Didaktischen Feedback-Modus wählen
            </h3>
            <AuswahlGruppe label="Feedback-Modus" className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              <button {...alsOption(feedbackMode === 'instant')}
                type="button"
                onClick={() => setFeedbackMode('instant')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  feedbackMode === 'instant'
                    ? 'border-shiraz bg-shiraz/5 ring-2 ring-shiraz/20'
                    : 'border-home-grau/30 bg-off-white hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${feedbackMode === 'instant' ? 'bg-shiraz text-white' : 'bg-home-grau/20 text-text-main'}`}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <strong className="text-xs font-bold text-text-main block">Sofortiges Feedback (Lernmodus)</strong>
                  <p className="text-[11px] text-text-main/70 mt-0.5">
                    Nach jeder Antwort wird sofort die Begründung, Normreferenz und Lückenwarnung eingeblendet.
                  </p>
                </div>
              </button>

              <button {...alsOption(feedbackMode === 'exam')}
                type="button"
                onClick={() => setFeedbackMode('exam')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  feedbackMode === 'exam'
                    ? 'border-shiraz bg-shiraz/5 ring-2 ring-shiraz/20'
                    : 'border-home-grau/30 bg-off-white hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${feedbackMode === 'exam' ? 'bg-shiraz text-white' : 'bg-home-grau/20 text-text-main'}`}>
                  <Award size={18} />
                </div>
                <div>
                  <strong className="text-xs font-bold text-text-main block">Prüfungsmodus (Kompakt)</strong>
                  <p className="text-[11px] text-text-main/70 mt-0.5">
                    Alle Fragen ununterbrochen durchgehen. Die detaillierte Wissenslücken-Analyse erfolgt am Ende.
                  </p>
                </div>
              </button>
            </AuswahlGruppe>
          </div>

          {/* CSV Import/Export Box & Status Notification (P26) */}
          <div className="flex flex-col gap-3 p-4 bg-off-white rounded-2xl border border-home-grau/25">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-text-main/80">
                <FileText size={16} className="text-shiraz shrink-0" />
                <span>
                  <strong>Fragenkatalog-Management:</strong> Standardisierte CSV-Schnittstelle für Dozenten-Erweiterungen &amp; Prüfungsfragen
                </span>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-text-main font-bold border border-home-grau/30 rounded-lg shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer text-xs"
                  title="Alle Fragen als CSV exportieren"
                >
                  <Download size={14} /> CSV Export
                </button>
                <label className="px-3 py-1.5 bg-white hover:bg-slate-50 text-shiraz font-bold border border-shiraz/30 rounded-lg shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer text-xs">
                  <Upload size={14} /> CSV Import
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportCsv}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            {importNotification && (
              <div className="p-2.5 bg-shiraz/10 border border-shiraz/20 rounded-xl text-xs text-shiraz font-medium flex items-center gap-2">
                <Info size={14} className="shrink-0" />
                <span>{importNotification}</span>
              </div>
            )}
          </div>

          {/* Start CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-home-grau/30">
            <div className="text-xs text-text-main/70">
              💡 <em>Tipp: Alle Fragen basieren exakt auf den Inhalten der Fachmodule und gängigen DIN EN Prüfnormen.</em>
            </div>
            <button
              type="button"
              onClick={() => startQuiz()}
              disabled={!pool}
              className="w-full sm:w-auto px-8 py-4 disabled:opacity-60 disabled:cursor-wait bg-shiraz hover:bg-shiraz/90 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
            >
              <span>Wissenscheck starten</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PHASE 2: RUNNING QUIZ */}
      {/* ------------------------------------------------------------- */}
      {phase === 'quiz' && currentQ && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-home-grau/30 shadow-sm flex flex-col gap-6">
          {/* Progress Header */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-bold text-text-main">
              <span className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-shiraz text-white rounded-lg text-xs font-mono">
                  Frage {formatDeWert(currentIndex + 1)} / {activeQuestions.length}
                </span>
                <span className="text-text-main/60 hidden sm:inline">
                  ({answeredCount} beantwortet)
                </span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleBookmark(currentQ.id)}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    bookmarked[currentQ.id]
                      ? 'bg-shiraz/10 text-shiraz border-shiraz/30'
                      : 'bg-off-white text-text-main/60 border-home-grau/30 hover:text-text-main'
                  }`}
                  title="Frage zur Wiedervorlage vormerken"
                >
                  {bookmarked[currentQ.id] ? <BookmarkCheck size={16} className="text-shiraz" /> : <Bookmark size={16} />}
                  <span className="hidden sm:inline">Merken</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhase('config')}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-text-main/60 hover:text-text-main bg-off-white border border-home-grau/30 transition-all cursor-pointer"
                >
                  Abbrechen
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-shiraz rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="p-6 bg-off-white rounded-2xl border border-home-grau/30 flex flex-col gap-4">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-white text-shiraz border border-home-grau/30 uppercase tracking-wider">
                Cluster {currentQ.clusterId} — {currentQ.clusterName}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-white text-slate-700 border border-home-grau/30">
                Modul: {currentQ.moduleTitle}
              </span>
              {currentQ.normRef && (
                <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded-md bg-white text-slate-600 border border-home-grau/30">
                  {currentQ.normRef}
                </span>
              )}
              {currentQ.difficulty && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  currentQ.difficulty === 'Basis' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                  currentQ.difficulty === 'Vertiefung' ? 'bg-slate-100 text-slate-800 border-slate-200' :
                  'bg-shiraz/10 text-shiraz border-shiraz/20'
                }`}>
                  {currentQ.difficulty}
                </span>
              )}
              {currentQ.reviewer && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white text-slate-600 border border-home-grau/30" title={`Akademischer Reviewer: ${currentQ.reviewer}${currentQ.reviewedAt ? ` (${currentQ.reviewedAt})` : ''}`}>
                  Reviewer: {currentQ.reviewer}
                </span>
              )}
              <FreigabeEtikett frage={currentQ} />
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-bold text-text-main leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options List */}
          <div className="flex flex-col gap-2.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = answers[currentQ.id] === optIdx;
              const isRevealed = feedbackMode === 'instant' && instantRevealed[currentQ.id];
              const isCorrectOption = optIdx === currentQ.correctIdx;

              let style = 'bg-white border-home-grau/30 text-text-main hover:bg-slate-50';

              if (isRevealed) {
                if (isCorrectOption) {
                  style = 'bg-slate-100 dark:bg-slate-800 border-slate-400 text-text-main font-semibold ring-1 ring-slate-400';
                } else if (isSelected && !isCorrectOption) {
                  style = 'bg-shiraz/5 border-shiraz/40 text-shiraz font-medium ring-1 ring-shiraz/40';
                } else {
                  style = 'bg-white border-home-grau/20 text-text-main/50 opacity-60';
                }
              } else if (isSelected) {
                style = 'bg-shiraz/5 border-shiraz text-shiraz font-medium ring-1 ring-shiraz shadow-2xs';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => { if (!isRevealed) handleSelectOption(optIdx); }}
                  aria-pressed={isSelected}
                  aria-disabled={isRevealed || undefined}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3.5 ${isRevealed ? 'cursor-default' : 'cursor-pointer'} ${style}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                    isRevealed && isCorrectOption
                      ? 'bg-slate-200 text-text-main border-text-main'
                      : isRevealed && isSelected && !isCorrectOption
                      ? 'bg-shiraz text-white border-shiraz'
                      : isSelected
                      ? 'bg-shiraz text-white border-shiraz'
                      : 'bg-off-white text-text-main/70 border-home-grau/30'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                  {isRevealed && isCorrectOption && (
                    <span className="text-xs font-bold text-slate-800 shrink-0 flex items-center gap-1">
                      <CheckCircle2 size={16} /> Richtig
                    </span>
                  )}
                  {isRevealed && isSelected && !isCorrectOption && (
                    <span className="text-xs font-bold text-shiraz shrink-0 flex items-center gap-1">
                      <XCircle size={16} /> Falsch
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Kurze Ansage für Screenreader: Frage n von N, nach dem Antworten richtig/falsch (WCAG 4.1.3) */}
          <p role="status" className="sr-only">
            {feedbackMode === 'instant' && instantRevealed[currentQ.id]
              ? (answers[currentQ.id] === currentQ.correctIdx
                ? 'Antwort richtig.'
                : `Antwort falsch. Richtig ist ${String.fromCharCode(65 + currentQ.correctIdx)}: ${currentQ.options[currentQ.correctIdx]}`.slice(0, 300))
              : `Frage ${formatDeWert(currentIndex + 1)} von ${formatDeWert(activeQuestions.length)}`}
          </p>

          {/* Instant Feedback Box (If enabled and answered) */}
          {feedbackMode === 'instant' && instantRevealed[currentQ.id] && (
            <div className={`p-5 rounded-2xl border flex flex-col gap-3.5 animate-in fade-in duration-200 ${
              answers[currentQ.id] === currentQ.correctIdx
                ? 'bg-slate-50 border-slate-200'
                : 'bg-shiraz/5 border-shiraz/20'
            }`}>
              <div className="flex items-center gap-2">
                {answers[currentQ.id] === currentQ.correctIdx ? (
                  <>
                    <CheckCircle2 size={18} className="text-slate-800" />
                    <strong className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Exzellent! Antwort ist korrekt.
                    </strong>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={18} className="text-shiraz" />
                    <strong className="text-xs font-bold text-shiraz uppercase tracking-wider">
                      Wissenslücke erkannt ({currentQ.topic})
                    </strong>
                  </>
                )}
              </div>

              {answers[currentQ.id] !== currentQ.correctIdx && answers[currentQ.id] !== undefined && currentQ.distraktorFeedback?.[answers[currentQ.id]] && (
                <div className="text-xs leading-relaxed text-shiraz">
                  <strong>Zu Ihrer Antwort:</strong> {currentQ.distraktorFeedback[answers[currentQ.id]]}
                </div>
              )}
              <div className="text-xs text-text-main/80 leading-relaxed font-normal">
                {currentQ.explanation}
              </div>

              {answers[currentQ.id] !== currentQ.correctIdx && currentQ.gapAnalysis && (
                <div className="p-3.5 bg-white rounded-xl border border-shiraz/20 flex flex-col gap-2 mt-1">
                  <div className="text-[11px] text-shiraz leading-snug">
                    <strong className="text-shiraz">Didaktischer Hinweis:</strong> {currentQ.gapAnalysis.misconception}
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-shiraz/10">
                    <span className="text-[10px] text-text-main/60">
                      Grundregel: {currentQ.gapAnalysis.coreRule}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleGoToModule(currentQ.gapAnalysis.targetModuleTab)}
                      className="text-xs font-bold text-shiraz hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Zum Modul "{currentQ.gapAnalysis.targetModuleLabel}"</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-home-grau/20">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-home-grau/30 text-xs font-bold text-text-main/70 hover:text-text-main bg-off-white hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Vorherige Frage</span>
            </button>

            {/* Quick jump badges */}
            <div className="flex flex-wrap justify-center gap-1.5 max-w-md">
              {activeQuestions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = answers[q.id] !== undefined;
                const isMarked = bookmarked[q.id];

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-current={isCurrent ? 'step' : undefined}
                    aria-label={`Frage ${formatDeWert(idx + 1)}${isAnswered ? ', beantwortet' : ''}${isMarked ? ', markiert' : ''}`}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center cursor-pointer border ${
                      isCurrent
                        ? 'bg-shiraz text-white border-shiraz ring-2 ring-shiraz/20 scale-105'
                        : isMarked
                        ? 'bg-shiraz/10 text-shiraz border-shiraz/30'
                        : isAnswered
                        ? 'bg-slate-100 text-slate-800 border-slate-300 font-bold'
                        : 'bg-off-white text-text-main/50 border-home-grau/30 hover:border-home-grau/60'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {currentIndex < activeQuestions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-shiraz text-white text-xs font-bold hover:bg-shiraz/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Nächste Frage</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishQuiz}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-shiraz text-white text-xs font-bold hover:bg-shiraz/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md uppercase tracking-wider active:scale-95"
              >
                <Award size={16} />
                <span>Quiz abschließen &amp; Wissenslücken analysieren</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PHASE 3: RESULTS & KNOWLEDGE GAP ANALYSIS DASHBOARD */}
      {/* ------------------------------------------------------------- */}
      {phase === 'result' && (
        <div className="flex flex-col gap-8">
          {/* Main Score Hero Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-home-grau/30 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-home-grau/30">
              <div className="flex items-center gap-5">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex flex-col items-center justify-center border font-mono font-bold shrink-0 shadow-inner ${gradeObj.color}`}>
                  <span className="text-2xl sm:text-3xl">{gradeObj.grade}</span>
                  <span className="text-[10px] uppercase font-sans font-bold">Note</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-shiraz">Auswertung Wissenscheck</span>
                    <span className="text-xs text-text-main/40">•</span>
                    <span className="text-xs font-medium text-text-main/60">
                      {new Date().toLocaleDateString('de-DE')}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-text-main">
                    {gradeObj.text}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-main/70">
                    Sie haben <strong className="text-text-main">{formatDeWert(score)} von {formatDeWert(total)} Fragen ({formatDeWert(percent)}%)</strong> richtig beantwortet.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveMainTab('dashboard')}
                  className="px-5 py-3 bg-shiraz hover:bg-shiraz/90 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <BarChart3 size={15} />
                  <span>Im Dashboard analysieren</span>
                </button>
                {detectedGaps.length > 0 && (
                  <button
                    type="button"
                    onClick={handleRetestGaps}
                    className="px-5 py-3 bg-shiraz hover:bg-shiraz/90 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <RefreshCw size={15} />
                    <span>Nur Wissenslücken wiederholen ({detectedGaps.length})</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPhase('config')}
                  className="px-4 py-3 bg-off-white hover:bg-slate-100 text-text-main text-xs font-bold rounded-xl border border-home-grau/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={15} />
                  <span>Neues Quiz konfigurieren</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-off-white p-4 rounded-2xl border border-home-grau/20 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-main/50 block">Richtig</span>
                <span className="text-xl font-bold text-slate-900 font-mono">{formatDeWert(score)} / {formatDeWert(total)}</span>
              </div>
              <div className="bg-off-white p-4 rounded-2xl border border-home-grau/20 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-main/50 block">Quote</span>
                <span className="text-xl font-bold text-text-main font-mono">{formatDeWert(percent)}%</span>
              </div>
              <div className="bg-off-white p-4 rounded-2xl border border-home-grau/20 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-main/50 block">Wissenslücken</span>
                <span className={`text-xl font-bold font-mono ${detectedGaps.length > 0 ? 'text-shiraz' : 'text-slate-900'}`}>
                  {detectedGaps.length}
                </span>
              </div>
              <div className="bg-off-white p-4 rounded-2xl border border-home-grau/20 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-main/50 block">Status</span>
                <span className={`text-sm font-bold flex items-center justify-center gap-1 mt-1 ${gradeObj.passed ? 'text-slate-900' : 'text-shiraz'}`}>
                  {gradeObj.passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {gradeObj.passed ? 'Bestanden' : 'Nicht bestanden'}
                </span>
              </div>
            </div>

            {/* Cluster Competence Breakdown */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
                <BarChart3 size={15} className="text-shiraz" /> Kompetenzprofil nach Themen-Clustern
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {clusterBreakdown.map(c => {
                  const cPercent = c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0;
                  const isSolid = cPercent >= 80;
                  const isModerate = cPercent >= 50 && cPercent < 80;

                  return (
                    <div key={c.clusterId} className="bg-off-white p-3.5 rounded-2xl border border-home-grau/30 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs font-bold text-text-main">
                        <span className="truncate pr-2">Cluster {c.clusterId}: {c.clusterName}</span>
                        <span className="font-mono shrink-0">{formatDeWert(c.correct)}/{formatDeWert(c.total)} ({formatDeWert(cPercent)}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            isSolid ? 'bg-slate-800' : isModerate ? 'bg-slate-400' : 'bg-shiraz'
                          }`}
                          style={{ width: `${cPercent}%` }}
                        />
                      </div>
                      <div className="text-[10px] font-bold">
                        {isSolid ? (
                          <span className="text-slate-800 flex items-center gap-1">
                            <CheckCircle2 size={12} /> Solides Fachwissen
                          </span>
                        ) : isModerate ? (
                          <span className="text-slate-600 flex items-center gap-1">
                            <Info size={12} /> Vertiefung empfohlen
                          </span>
                        ) : (
                          <span className="text-shiraz flex items-center gap-1">
                            <AlertTriangle size={12} /> Kritische Wissenslücke
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* THE HEART OF THE FEATURE: KNOWLEDGE GAPS ANALYSIS */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-home-grau/30 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-home-grau/20 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-text-main flex items-center gap-2">
                  <AlertTriangle className={detectedGaps.length > 0 ? 'text-shiraz' : 'text-slate-700'} />
                  Wissenslücken-Diagnostik &amp; Handlungsempfehlungen
                </h3>
                <p className="text-xs text-text-main/70 pt-0.5">
                  Präzise Ursachenanalyse für jedes falsch beantwortete Thema mit Direktlinks zur Behebung.
                </p>
              </div>

              {detectedGaps.length > 0 && (
                <AuswahlGruppe label="Wissenslücken nach Cluster filtern" className="flex items-center gap-1 bg-off-white p-1 rounded-xl border border-home-grau/20 self-start sm:self-auto">
                  {(['all', 'I', 'II', 'III', 'IV', 'V'] as const).map(f => (
                    <button
                      key={f}
                      type="button"
                      {...alsOption(activeGapFilter === f)}
                      onClick={() => setActiveGapFilter(f)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeGapFilter === f
                          ? 'bg-shiraz text-white shadow-2xs'
                          : 'text-text-main/60 hover:text-text-main'
                      }`}
                    >
                      {f === 'all' ? 'Alle' : `Cluster ${f}`}
                    </button>
                  ))}
                </AuswahlGruppe>
              )}
            </div>

            {detectedGaps.length === 0 ? (
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-shiraz/10 text-shiraz flex items-center justify-center text-3xl shadow-inner">
                  🏆
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Keine Wissenslücken festgestellt!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
                  Hervorragende Leistung! Sie haben alle gestellten Fragen dieses Durchlaufs fehlerfrei beantwortet 
                  und verfügen über ein exzellentes Verständnis der physikalischen, chemischen und normativen Grundlagen.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {filteredGaps.map((q, idx) => {
                  const userChoice = answers[q.id];
                  const userOptionText = userChoice !== undefined ? q.options[userChoice] : 'Keine Antwort';
                  const correctOptionText = q.options[q.correctIdx];

                  return (
                    <div 
                      key={q.id}
                      className="p-5 sm:p-6 rounded-2xl border border-shiraz/30 bg-shiraz/5 flex flex-col gap-4 transition-all hover:border-shiraz/50"
                    >
                      {/* Gap Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-shiraz/20 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-shiraz text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-shiraz block">
                              Cluster {q.clusterId} — {q.clusterName}
                            </span>
                            <h4 className="text-sm font-bold text-text-main">
                              Wissenslücke: {q.topic} ({q.moduleTitle})
                            </h4>
                          </div>
                        </div>

                        {q.normRef && (
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white border border-shiraz/20 text-shiraz self-start sm:self-auto">
                            Norm: {q.normRef}
                          </span>
                        )}
                      </div>

                      {/* Question Context */}
                      <div className="text-xs text-text-main/80 font-medium leading-snug">
                        <strong>Frage:</strong> {q.question}
                      </div>

                      {/* Choice Comparison Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-white rounded-xl border border-shiraz/20 flex flex-col gap-1">
                          <span className="text-[10px] font-bold uppercase text-shiraz flex items-center gap-1">
                            <XCircle size={14} /> Ihre Fehlannahme:
                          </span>
                          <span className="text-xs text-shiraz line-through opacity-80 leading-relaxed">
                            {userOptionText}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex flex-col gap-1">
                          <span className="text-[10px] font-bold uppercase text-slate-800 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Fachlich korrekte Lösung:
                          </span>
                          <span className="text-xs text-slate-900 font-medium leading-relaxed">
                            {correctOptionText}
                          </span>
                        </div>
                      </div>

                      {/* Diagnostic Analysis & Core Rule */}
                      {q.gapAnalysis && (
                        <div className="p-4 bg-white rounded-xl border border-home-grau/20 space-y-2.5">
                          <div className="text-xs text-text-main/80 leading-relaxed">
                            <strong className="text-shiraz">Erkanntes Fehlverständnis:</strong>{' '}
                            {q.gapAnalysis.misconception}
                          </div>
                          <div className="text-xs text-text-main/80 leading-relaxed">
                            <strong className="text-slate-900">Wissenschaftliche Grundregel:</strong>{' '}
                            {q.gapAnalysis.coreRule}
                          </div>
                        </div>
                      )}

                      {/* Actionable Direct Link Button */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                        <span className="text-xs text-text-main/60">
                          {q.gapAnalysis?.actionableAdvice || 'Wiederholen Sie das entsprechende Modul zur Schließung dieser Lücke.'}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleGoToModule(q.gapAnalysis?.targetModuleTab || q.route || q.moduleId)}
                          className="w-full sm:w-auto px-4 py-2.5 bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                        >
                          <BookOpen size={14} />
                          <span>Wissenslücke schließen: Zum Modul "{q.moduleTitle}"</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Full review toggle */}
          <div className="bg-white p-6 rounded-3xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setShowFullReview(!showFullReview)}
              className="flex items-center justify-between w-full text-left text-sm font-bold text-text-main cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FileText size={18} className="text-shiraz" />
                Vollständige Fragenübersicht aller {activeQuestions.length} Fragen einsehen
              </span>
              {showFullReview ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {showFullReview && (
              <div className="flex flex-col gap-4 pt-3 border-t border-home-grau/20">
                {activeQuestions.map((q, idx) => {
                  const isCorrect = answers[q.id] === q.correctIdx;
                  return (
                    <div 
                      key={q.id}
                      className={`p-4 rounded-xl border text-xs flex flex-col gap-2 ${
                        isCorrect ? 'bg-slate-50 border-slate-200' : 'bg-shiraz/5 border-shiraz/20'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>Aufgabe {idx + 1}: {q.topic} ({q.moduleTitle})</span>
                        <span className={isCorrect ? 'text-slate-800' : 'text-shiraz'}>
                          {isCorrect ? '✓ Richtig' : '✗ Falsch'}
                        </span>
                      </div>
                      <p className="text-text-main font-medium">{q.question}</p>
                      <p className="text-text-main/70 text-[11px] leading-relaxed pt-1 border-t border-home-grau/20">
                        {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export default InteractiveQuizSystem;
