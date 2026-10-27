import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Trophy, Clock, AlertTriangle, CheckCircle2, XCircle, ArrowRight, ArrowLeft, 
  RotateCcw, Bookmark, BarChart3, BookOpen, FileText, Check, ListChecks
} from 'lucide-react';
import { QUIZ_CATEGORIES, QuizQuestion, QuizCategory, anzahlFreigegeben } from '@/src/data/quizModell';
import { FreigabeEtikett } from '@/src/components/quiz/FreigabeEtikett';
import { useAlleFragen } from '@/src/data/quizLader';
import { mischeAntworten } from '@/src/utils/mischeAntworten';
import { KlausurResult, saveKlausurResult, getKlausurHistory } from '@/src/utils/studyStorage';

type ExamConfig = {
  questionCount: 10 | 20 | 30;
  durationMinutes: 15 | 30 | 45;
  selectedCategory: 'all' | QuizCategory;
};

const calculateGrade = (percent: number): { grade: string; text: string; passed: boolean; color: string } => {
  if (percent >= 95) return { grade: '1,0', text: 'Sehr gut (Hervorragend)', passed: true, color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
  if (percent >= 90) return { grade: '1,3', text: 'Sehr gut', passed: true, color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
  if (percent >= 85) return { grade: '1,7', text: 'Gut', passed: true, color: 'text-teal-700 bg-teal-50 border-teal-300' };
  if (percent >= 80) return { grade: '2,0', text: 'Gut', passed: true, color: 'text-teal-700 bg-teal-50 border-teal-300' };
  if (percent >= 75) return { grade: '2,3', text: 'Gut', passed: true, color: 'text-blue-700 bg-blue-50 border-blue-300' };
  if (percent >= 70) return { grade: '2,7', text: 'Befriedigend', passed: true, color: 'text-blue-700 bg-blue-50 border-blue-300' };
  if (percent >= 65) return { grade: '3,0', text: 'Befriedigend', passed: true, color: 'text-indigo-700 bg-indigo-50 border-indigo-300' };
  if (percent >= 60) return { grade: '3,3', text: 'Befriedigend', passed: true, color: 'text-indigo-700 bg-indigo-50 border-indigo-300' };
  if (percent >= 55) return { grade: '3,7', text: 'Ausreichend', passed: true, color: 'text-amber-800 bg-amber-50 border-amber-300' };
  if (percent >= 50) return { grade: '4,0', text: 'Ausreichend (Bestanden)', passed: true, color: 'text-amber-800 bg-amber-50 border-amber-300' };
  return { grade: '5,0', text: 'Nicht bestanden', passed: false, color: 'text-rose-700 bg-rose-50 border-rose-300' };
};

export interface KlausurSimulatorProps {
  /** nur Fragen dieser Routen (Modul-IDs), z. B. die Module eines Lernpfads (AP 6.1); fehlt = Gesamtpool */
  routen?: readonly string[];
  /** Überschrift statt „Simulierte Klausur: Baustoffe & Werkstoffmechanik“ */
  titel?: string;
}

export const KlausurSimulator: React.FC<KlausurSimulatorProps> = ({ routen, titel }) => {
  const [phase, setPhase] = useState<'config' | 'exam' | 'result'>('config');
  // Fragenpool in Teilpaketen nachgeladen (quizLader); null, solange er lädt
  const gesamtPool = useAlleFragen();
  const routenSchluessel = routen?.join('|');
  const alleFragen = useMemo(
    () => (gesamtPool && routen ? gesamtPool.filter(q => !!q.route && routen.includes(q.route)) : gesamtPool),
    [gesamtPool, routenSchluessel],
  );
  
  // Configuration
  const [config, setConfig] = useState<ExamConfig>({
    questionCount: 20,
    durationMinutes: 30,
    selectedCategory: 'all'
  });

  // Exam runtime state
  const [examQuestions, setExamQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30 * 60);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [history, setHistory] = useState<KlausurResult[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setHistory(getKlausurHistory());
  }, [phase]);

  // Handle countdown
  useEffect(() => {
    if (phase === 'exam' && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current ?? undefined);
            setIsTimeUp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Auto-submit when time is up
  useEffect(() => {
    if (isTimeUp && phase === 'exam') {
      handleSubmitExam();
    }
  }, [isTimeUp, phase]);

  const startExam = () => {
    // Filter questions
    let pool = alleFragen ?? [];
    if (config.selectedCategory !== 'all') {
      pool = pool.filter(q => q.category === config.selectedCategory);
    }
    
    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(config.questionCount, shuffled.length));

    setExamQuestions(selected.map(q => mischeAntworten(q)));
    setCurrentIndex(0);
    setAnswers({});
    setBookmarked({});
    setSecondsRemaining(config.durationMinutes * 60);
    setIsTimeUp(false);
    setShowConfirmModal(false);
    setPhase('exam');
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const toggleBookmark = (qId: string) => {
    setBookmarked(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitExam = () => {
    setShowConfirmModal(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate score
    let correctCount = 0;
    const catScores: Record<string, { correct: number; total: number; percent: number }> = {};

    examQuestions.forEach(q => {
      const isCorrect = answers[q.id] === q.correctIdx;
      if (isCorrect) correctCount++;

      if (!catScores[q.category]) {
        catScores[q.category] = { correct: 0, total: 0, percent: 0 };
      }
      catScores[q.category].total += 1;
      if (isCorrect) catScores[q.category].correct += 1;
    });

    Object.keys(catScores).forEach(cat => {
      const item = catScores[cat];
      item.percent = Math.round((item.correct / item.total) * 100);
    });

    const percent = Math.round((correctCount / examQuestions.length) * 100);
    const gradeInfo = calculateGrade(percent);

    const result: KlausurResult = {
      id: 'klausur_' + Date.now(),
      date: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      score: correctCount,
      totalQuestions: examQuestions.length,
      percent,
      grade: gradeInfo.grade,
      passed: gradeInfo.passed,
      durationMinutes: config.durationMinutes,
      timeSpentSeconds: (config.durationMinutes * 60) - secondsRemaining,
      categoryScores: catScores
    };

    saveKlausurResult(result);
    setPhase('result');
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = examQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = examQuestions.length - answeredCount;

  // -------------------------------------------------------------
  // VIEW: 1. CONFIGURATION
  // -------------------------------------------------------------
  if (phase === 'config') {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-home-grau/30 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-home-grau/20 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-shiraz/10 text-shiraz flex items-center justify-center flex-shrink-0 shadow-xs">
                <Trophy size={26} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-shiraz block">
                  Prüfungssimulation TH Augsburg
                </span>
                <h3 className="text-xl font-bold text-text-main">
                  {titel ?? 'Simulierte Klausur: Baustoffe & Werkstoffmechanik'}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 font-medium text-slate-700 border border-slate-200">
                Hochschul-Notenschlüssel (1,0 - 5,0)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: Fragenumfang */}
            <div className="bg-off-white/70 p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-text-main/70 flex items-center gap-1.5">
                <ListChecks size={15} className="text-shiraz" /> 1. Klausur-Umfang
              </label>
              <div className="flex flex-col gap-2">
                {[
                  { count: 10, label: 'Express-Testat', desc: '10 Fragen (Kurzwiederholung)' },
                  { count: 20, label: 'Standard-Bachelorprüfung', desc: '20 Fragen (Empfohlen)' },
                  { count: 30, label: 'Große Gesamtklausur', desc: '30 Fragen (Vollständige Prüfung)' }
                ].map(item => (
                  <button
                    key={item.count}
                    onClick={() => setConfig(prev => ({ 
                      ...prev, 
                      questionCount: item.count as 10 | 20 | 30,
                      durationMinutes: item.count === 10 ? 15 : item.count === 20 ? 30 : 45
                    }))}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      config.questionCount === item.count
                        ? 'bg-shiraz text-white border-shiraz shadow-xs font-semibold'
                        : 'bg-white text-text-main border-home-grau/30 hover:border-shiraz/50'
                    }`}
                  >
                    <div className="text-sm font-bold">{item.label}</div>
                    <div className={`text-xs ${config.questionCount === item.count ? 'text-white' : 'text-text-main/60'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Box 2: Zeitlimit */}
            <div className="bg-off-white/70 p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-text-main/70 flex items-center gap-1.5">
                <Clock size={15} className="text-shiraz" /> 2. Zeitfenster (Timer)
              </label>
              <div className="flex flex-col gap-2">
                {[
                  { mins: 15, label: '15 Minuten', desc: '90 Sek. pro Frage (Express)' },
                  { mins: 30, label: '30 Minuten', desc: 'Reguläre Bearbeitungszeit' },
                  { mins: 45, label: '45 Minuten', desc: 'Ausführliche Rechenzeit' }
                ].map(item => (
                  <button
                    key={item.mins}
                    onClick={() => setConfig(prev => ({ ...prev, durationMinutes: item.mins as 15 | 30 | 45 }))}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      config.durationMinutes === item.mins
                        ? 'bg-shiraz text-white border-shiraz shadow-xs font-semibold'
                        : 'bg-white text-text-main border-home-grau/30 hover:border-shiraz/50'
                    }`}
                  >
                    <div className="text-sm font-bold">{item.label}</div>
                    <div className={`text-xs ${config.durationMinutes === item.mins ? 'text-white' : 'text-text-main/60'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Box 3: Fachbereichsfokus */}
            <div className="bg-off-white/70 p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-text-main/70 flex items-center gap-1.5">
                <BookOpen size={15} className="text-shiraz" /> 3. Themenschwerpunkt
              </label>
              <select aria-label="3. Themenschwerpunkt"
                value={config.selectedCategory}
                onChange={(e) => setConfig(prev => ({ ...prev, selectedCategory: e.target.value as QuizCategory | "all" }))}
                className="p-3 bg-white border border-home-grau/30 rounded-xl text-sm font-medium focus:outline-none focus:border-shiraz focus:ring-1 focus:ring-shiraz"
              >
                <option value="all">🌐 Alle Themenbereiche (Gemischt)</option>
                {QUIZ_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <div className="p-3 bg-white rounded-xl border border-home-grau/20 text-xs text-text-main/70 leading-relaxed mt-2">
                <strong className="text-text-main block mb-1">Prüfungsbedingungen:</strong>
                • Keine Lösungsanzeige während der Klausur<br/>
                • Markieren von Fragen zur Wiedervorlage möglich<br/>
                • Automatischer Abbruch bei Zeitablauf<br/>
                • Orientierungsnote nach Abgabe (keine Prüfungsleistung)
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-home-grau/20">
            <div className="text-xs text-text-main/60">
              Verfügbarer Aufgabenpool: <strong>{alleFragen ? alleFragen.length : '…'} Fragen</strong>{alleFragen && <> (davon {formatDeWert(anzahlFreigegeben(alleFragen))} fachlich freigegeben; ungeprüfte Fragen sind gekennzeichnet)</>}
            </div>
            <button
              onClick={startExam}
              disabled={!alleFragen || alleFragen.length === 0}
              className="w-full sm:w-auto px-8 py-3.5 disabled:opacity-60 disabled:cursor-wait bg-shiraz text-white font-bold text-sm rounded-xl shadow-md hover:bg-shiraz/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Klausur jetzt starten</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Bisherige Klausur-Historie */}
        {history.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-home-grau/30 shadow-xs flex flex-col gap-4">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
              <BarChart3 size={18} className="text-shiraz" /> Bisherige Prüfungsergebnisse (Lokal gespeichert)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-home-grau/20 text-text-main/60">
                    <th className="py-2.5 px-3">Datum</th>
                    <th className="py-2.5 px-3">Umfang</th>
                    <th className="py-2.5 px-3">Punkte</th>
                    <th className="py-2.5 px-3">Quote</th>
                    <th className="py-2.5 px-3">Note</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/10">
                  {history.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-mono text-text-main/70">{item.date}</td>
                      <td className="py-2.5 px-3">{formatDeWert(item.totalQuestions)} Fragen ({formatDeWert(item.durationMinutes)} Min.)</td>
                      <td className="py-2.5 px-3 font-medium">{formatDeWert(item.score)} / {formatDeWert(item.totalQuestions)}</td>
                      <td className="py-2.5 px-3 font-mono">{formatDeWert(item.percent)}%</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded font-bold bg-slate-100 border border-slate-200">
                          {item.grade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {item.passed ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 size={13} /> Bestanden
                          </span>
                        ) : (
                          <span className="text-rose-600 font-bold flex items-center gap-1">
                            <XCircle size={13} /> Nicht bestanden
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: 2. RUNNING EXAM
  // -------------------------------------------------------------
  if (phase === 'exam' && currentQuestion) {
    const isCriticalTime = secondsRemaining <= 180; // < 3 mins

    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-200">
        {/* Sticky Exam Status Bar */}
        <div className="bg-white p-4 rounded-2xl border border-home-grau/30 shadow-sm flex flex-wrap items-center justify-between gap-4 sticky top-16 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-shiraz">
              Klausur: Frage {formatDeWert(currentIndex + 1)} von {examQuestions.length}
            </span>
            <span className="text-xs text-text-main/60">
              ({answeredCount} beantwortet, {unansweredCount} offen)
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown timer */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono font-bold text-sm border ${
              isCriticalTime 
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse' 
                : 'bg-slate-50 text-text-main border-home-grau/30'
            }`}>
              <Clock size={16} className={isCriticalTime ? 'text-rose-600' : 'text-shiraz'} />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => toggleBookmark(currentQuestion.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                bookmarked[currentQuestion.id]
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-text-main/60 border-home-grau/30 hover:border-amber-400'
              }`}
              title="Frage vormerken, um später darauf zurückzukommen"
            >
              <Bookmark size={14} className={bookmarked[currentQuestion.id] ? 'fill-amber-500 text-amber-600' : ''} />
              <span className="hidden sm:inline">
                {bookmarked[currentQuestion.id] ? 'Markiert' : 'Vormerken'}
              </span>
            </button>

            {/* Finish exam button */}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-4 py-1.5 bg-shiraz text-white text-xs font-bold rounded-xl hover:bg-shiraz/90 shadow-xs transition-all cursor-pointer"
            >
              Klausur abgeben
            </button>
          </div>
        </div>

        {/* Question Matrix Navigation Bar */}
        <div className="bg-white p-3 rounded-2xl border border-home-grau/30 shadow-2xs flex flex-wrap gap-1.5 items-center justify-center sm:justify-start">
          {examQuestions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;
            const isFlagged = bookmarked[q.id];

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center relative transition-all ${
                  isCurrent 
                    ? 'ring-2 ring-shiraz ring-offset-1 font-extrabold shadow-xs' 
                    : ''
                } ${
                  isAnswered 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Question Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-home-grau/30 shadow-sm flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-home-grau/20 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-shiraz/10 text-shiraz px-2.5 py-1 rounded-lg">
                {currentQuestion.categoryLabel}
              </span>
              {currentQuestion.normRef && (
                <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {currentQuestion.normRef}
                </span>
              )}
              <FreigabeEtikett frage={currentQuestion} />
            </div>
            {currentQuestion.difficulty && (
              <span className="text-[10px] text-text-main/50 uppercase font-bold">
                Level: {currentQuestion.difficulty}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-text-main leading-snug">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = answers[currentQuestion.id] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                    isSelected
                      ? 'bg-shiraz/5 border-shiraz shadow-xs text-text-main ring-1 ring-shiraz'
                      : 'bg-white border-home-grau/30 hover:bg-off-white/80 text-text-main'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 ${
                    isSelected
                      ? 'bg-shiraz text-white border-shiraz'
                      : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className="text-sm leading-relaxed flex-1">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-home-grau/20">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-home-grau/30 text-xs font-bold text-text-main hover:bg-off-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ArrowLeft size={16} /> Vorherige Frage
            </button>

            {currentIndex < examQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(examQuestions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-shiraz text-white text-xs font-bold hover:bg-shiraz/90 flex items-center gap-1.5 shadow-xs"
              >
                Nächste Frage <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm"
              >
                Klausur abschließen <Check size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Modal: Confirmation before final submit */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-home-grau/30 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 text-shiraz">
                <AlertTriangle size={28} />
                <h4 className="text-lg font-bold text-text-main">Klausur wirklich einreichen?</h4>
              </div>

              <div className="bg-off-white p-4 rounded-2xl border border-home-grau/20 text-xs space-y-1.5">
                <div>• Beantwortete Fragen: <strong>{answeredCount} von {examQuestions.length}</strong></div>
                {unansweredCount > 0 ? (
                  <div className="text-amber-800 font-bold">
                    ⚠️ Achtung: {unansweredCount} Frage(n) sind noch unbeantwortet!
                  </div>
                ) : (
                  <div className="text-emerald-700 font-bold">
                    ✓ Alle {examQuestions.length} Fragen wurden bearbeitet!
                  </div>
                )}
                <div>• Verbleibende Zeit: <strong>{formatTimer(secondsRemaining)}</strong></div>
              </div>

              <p className="text-xs text-text-main/70 leading-relaxed">
                Nach dem Einreichen werden Ihre Antworten ausgewertet und Ihre Klausurnote nach dem Hochschul-Notenschlüssel berechnet.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-home-grau/30 text-xs font-bold text-text-main hover:bg-off-white"
                >
                  Weiter bearbeiten
                </button>
                <button
                  onClick={handleSubmitExam}
                  className="px-5 py-2.5 rounded-xl bg-shiraz text-white text-xs font-bold hover:bg-shiraz/90 shadow-md"
                >
                  Endgültig abgeben
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: 3. RESULTS & DIAGNOSIS
  // -------------------------------------------------------------
  if (phase === 'result') {
    const latestResult = history[0];
    if (!latestResult) return null;

    const gradeInfo = calculateGrade(latestResult.percent);

    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300">
        {/* Main Certificate / Grade Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-home-grau/30 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-home-grau/20 pb-6 text-center md:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-shiraz block">
                Offizielles Prüfungsergebnis
              </span>
              <h3 className="text-2xl font-bold text-text-main">
                Leistungsbewertung Baustoffe &amp; Werkstoffe
              </h3>
              <p className="text-xs text-text-main/60 mt-1">
                Klausurabschluss am {latestResult.date} • Bearbeitungszeit: {formatDeWert(Math.round(latestResult.timeSpentSeconds / 60))} von {formatDeWert(latestResult.durationMinutes)} Minuten
              </p>
            </div>

            {/* Grade Badge */}
            <div className={`px-6 py-4 rounded-3xl border flex flex-col items-center justify-center shadow-xs ${gradeInfo.color}`}>
              <span className="text-3xl font-black">{gradeInfo.grade}</span>
              <span className="text-xs font-bold mt-0.5">{gradeInfo.text}</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-off-white/70 p-4 rounded-2xl border border-home-grau/20 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-main/50 block">Punkte</span>
              <span className="text-xl font-bold text-text-main font-mono">{formatDeWert(latestResult.score)} / {formatDeWert(latestResult.totalQuestions)}</span>
            </div>
            <div className="bg-off-white/70 p-4 rounded-2xl border border-home-grau/20 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-main/50 block">Erfolgsquote</span>
              <span className="text-xl font-bold text-text-main font-mono">{formatDeWert(latestResult.percent)}%</span>
            </div>
            <div className="bg-off-white/70 p-4 rounded-2xl border border-home-grau/20 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-main/50 block">Status</span>
              <span className={`text-base font-bold flex items-center justify-center gap-1 mt-1 ${latestResult.passed ? 'text-emerald-700' : 'text-rose-600'}`}>
                {latestResult.passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                {latestResult.passed ? 'Bestanden' : 'Nicht bestanden'}
              </span>
            </div>
            <div className="bg-off-white/70 p-4 rounded-2xl border border-home-grau/20 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-main/50 block">Bestehensgrenze</span>
              <span className="text-xl font-bold text-text-main font-mono">50 %</span>
            </div>
          </div>

          {/* Subject breakdown */}
          <div className="flex flex-col gap-3 pt-2">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
              <BarChart3 size={16} className="text-shiraz" />
              Aufschlüsselung nach Fachdisziplinen
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.keys(latestResult.categoryScores).map(catKey => {
                const item = latestResult.categoryScores[catKey];
                const catObj = QUIZ_CATEGORIES.find(c => c.id === catKey);
                const label = catObj?.label || catKey;

                return (
                  <div key={catKey} className="bg-off-white p-3.5 rounded-xl border border-home-grau/20 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs font-bold text-text-main">
                      <span>{label}</span>
                      <span className="font-mono">{formatDeWert(item.correct)} / {formatDeWert(item.total)} ({formatDeWert(item.percent)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          item.percent >= 75 ? 'bg-emerald-500' : item.percent >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-home-grau/20">
            <button
              onClick={() => setPhase('config')}
              className="px-6 py-3 bg-shiraz text-white text-xs font-bold rounded-xl hover:bg-shiraz/90 shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={16} /> Neue Klausur starten
            </button>
          </div>
        </div>

        {/* Detailed Review of All Exam Questions */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-home-grau/30 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-home-grau/20 pb-4">
            <FileText size={20} className="text-shiraz" />
            <h4 className="text-lg font-bold text-text-main">
              Detaillierte Fehler- &amp; Lösungsanalyse (Klausureinsicht)
            </h4>
          </div>

          <div className="flex flex-col gap-6">
            {examQuestions.map((q, idx) => {
              const selectedOpt = answers[q.id];
              const isCorrect = selectedOpt === q.correctIdx;

              return (
                <div 
                  key={q.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col gap-3 ${
                    isCorrect 
                      ? 'bg-emerald-50/30 border-emerald-200' 
                      : 'bg-rose-50/30 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-main/70">
                        Aufgabe {idx + 1}:
                      </span>
                      <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-home-grau/30">
                        {q.categoryLabel}
                      </span>
                      {q.normRef && (
                        <span className="text-[10px] font-mono text-slate-600 bg-white px-1.5 py-0.5 rounded border border-home-grau/30">
                          {q.normRef}
                        </span>
                      )}
                    </div>
                    <div>
                      {isCorrect ? (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 size={16} /> Richtig (+1 Punkt)
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                          <XCircle size={16} /> Falsch (0 Punkte)
                        </span>
                      )}
                    </div>
                  </div>

                  <h5 className="text-sm font-bold text-text-main leading-snug">
                    {q.question}
                  </h5>

                  <div className="space-y-1.5 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      const isOptionCorrect = optIdx === q.correctIdx;

                      let rowClass = 'bg-white/80 border-home-grau/20 text-text-main/80';
                      if (isOptionCorrect) {
                        rowClass = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-medium';
                      } else if (isOptionSelected && !isOptionCorrect) {
                        rowClass = 'bg-rose-100 text-rose-900 border-rose-300 font-medium line-through';
                      }

                      return (
                        <div 
                          key={optIdx} 
                          className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${rowClass}`}
                        >
                          <span className="font-bold shrink-0">{String.fromCharCode(65 + optIdx)})</span>
                          <span className="flex-1">{opt}</span>
                          {isOptionCorrect && <span className="font-bold text-emerald-700 shrink-0">✓ Richtig</span>}
                          {isOptionSelected && !isOptionCorrect && <span className="font-bold text-rose-600 shrink-0">✗ Ihre Wahl</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="mt-1 p-3.5 bg-white rounded-xl border border-home-grau/30 text-xs text-text-main/80 leading-relaxed shadow-2xs">
                    <strong className="text-shiraz block mb-1">Didaktische Begründung:</strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default KlausurSimulator;
