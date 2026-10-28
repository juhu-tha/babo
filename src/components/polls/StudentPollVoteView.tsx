import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { getLecturePolls, PollQuestion } from '@/src/data/lecturePollsData';

interface StudentPollVoteViewProps {
  initialLectureId: string;
  initialQuestionId?: string;
  onExitToPortal?: () => void;
}

const LECTURE_TITLES: Record<string, string> = {
  bauen_im_bestand: 'Vorlesung: Bauen im Bestand',
  nachhaltiges_bauen: 'Vorlesung: Nachhaltiges Bauen',
  bauschaeden: 'Vorlesung: Bauschäden',
  baustoffkunde: 'Vorlesung: Baustoffkunde',
  instandhaltung: 'Vorlesung: Instandhaltung'
};

export default function StudentPollVoteView({ 
  initialLectureId, 
  initialQuestionId, 
  onExitToPortal 
}: StudentPollVoteViewProps) {
  const lectureId = (['bauen_im_bestand', 'nachhaltiges_bauen', 'bauschaeden', 'baustoffkunde', 'instandhaltung'].includes(initialLectureId)
    ? initialLectureId
    : 'bauen_im_bestand') as 'bauen_im_bestand' | 'nachhaltiges_bauen' | 'bauschaeden' | 'baustoffkunde' | 'instandhaltung';

  const questions = useMemo(() => getLecturePolls(lectureId), [lectureId]);
  
  const initialIndex = useMemo(() => {
    if (!initialQuestionId) return 0;
    const found = questions.findIndex(q => q.id === initialQuestionId);
    return found >= 0 ? found : 0;
  }, [questions, initialQuestionId]);

  const [currentIdx, setCurrentIdx] = useState<number>(initialIndex);
  const currentQ: PollQuestion = questions[currentIdx] || questions[0];

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [liveVotes, setLiveVotes] = useState<Record<string, number[]>>({});

  // Fetch current vote counts
  const fetchVotes = async () => {
    try {
      const res = await fetch(`/api/polls/${lectureId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.votes) {
          setLiveVotes(data.votes);
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchVotes();
    // Alle 5 s aktualisieren, aber nur solange der Tab sichtbar ist (entlastet den Server bei großen Gruppen)
    const timer = setInterval(() => {
      if (typeof document === 'undefined' || !document.hidden) fetchVotes();
    }, 5000);
    return () => clearInterval(timer);
  }, [lectureId]);

  const handleVoteSubmit = async () => {
    if (selectedOption === null || hasVoted[currentQ.id] !== undefined || isSubmitting) return;

    setIsSubmitting(true);
    const voteIdx = selectedOption;

    // Optimistic local update
    setLiveVotes(prev => {
      const current = prev[currentQ.id] ? [...prev[currentQ.id]] : [0, 0, 0, 0];
      current[voteIdx] = (current[voteIdx] || 0) + 1;
      return { ...prev, [currentQ.id]: current };
    });
    setHasVoted(prev => ({ ...prev, [currentQ.id]: voteIdx }));

    try {
      await fetch(`/api/polls/${lectureId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: currentQ.id, optionIndex: voteIdx })
      });
    } catch {
      // Silent error
    } finally {
      setIsSubmitting(false);
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];
  const userVote = hasVoted[currentQ.id];
  const isQuestionAnswered = userVote !== undefined;

  const currentCounts = liveVotes[currentQ.id] || currentQ.initialVotes || [0, 0, 0, 0];
  const totalVotes = currentCounts.reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-off-white text-text-main flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Navigation & Status */}
      <div className="max-w-md w-full mx-auto space-y-4">
        {/* Header Bar */}
        <div className="bg-white border border-home-grau/30 rounded-2xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-shiraz text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
              THA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-main tracking-tight">Live-Abstimmung</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live aktiv
                </span>
              </div>
              <span className="text-[11px] text-slate-600 block truncate max-w-[200px]">
                {LECTURE_TITLES[lectureId] || 'Vorlesung TH Augsburg'}
              </span>
            </div>
          </div>
          
          {onExitToPortal && (
            <button
              onClick={onExitToPortal}
              className="text-[11px] font-semibold text-slate-600 hover:text-text-main px-2.5 py-1.5 rounded-lg border border-home-grau/30 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Zum Portal →
            </button>
          )}
        </div>

        {/* 100% Anonymous Banner */}
        <div className="bg-emerald-50 border border-emerald-500/30 rounded-xl px-3.5 py-2 flex items-center gap-2.5 text-xs text-emerald-700 shadow-xs">
          <ShieldCheck size={16} className="text-emerald-700 shrink-0" />
          <span><strong>100 % anonym:</strong> Kein Google-Konto und keine Anmeldung erforderlich.</span>
        </div>

        {/* Question Switcher (Carousel Pills) */}
        <div className="flex items-center justify-between bg-white p-1.5 rounded-xl border border-home-grau/30">
          <button
            onClick={() => {
              setSelectedOption(null);
              setCurrentIdx(prev => Math.max(0, prev - 1));
            }}
            disabled={currentIdx === 0}
            className="p-1.5 rounded-lg text-slate-600 hover:text-text-main disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-100 cursor-pointer"
            title="Vorherige Frage"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5 overflow-x-auto px-2">
            {questions.map((q, idx) => {
              const active = idx === currentIdx;
              const answered = hasVoted[q.id] !== undefined;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setSelectedOption(null);
                    setCurrentIdx(idx);
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                    active 
                      ? 'bg-shiraz text-white shadow-xs ring-2 ring-shiraz/30' 
                      : answered 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' 
                        : 'bg-slate-100 text-slate-600 hover:text-text-main'
                  }`}
                >
                  {answered ? <Check size={12} /> : idx + 1}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => {
              setSelectedOption(null);
              setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1));
            }}
            disabled={currentIdx === questions.length - 1}
            className="p-1.5 rounded-lg text-slate-600 hover:text-text-main disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-100 cursor-pointer"
            title="Nächste Frage"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Question Card */}
        <div className="bg-white border border-home-grau/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                Frage {formatDeWert(currentIdx + 1)} von {questions.length} • {currentQ.category}
              </span>
              <span className="text-[11px] text-slate-600 font-semibold">
                {formatDeWert(totalVotes)} {totalVotes === 1 ? 'Stimme' : 'Stimmen'} live
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-text-main leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Voting Options */}
          <div className="space-y-2.5 pt-1">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isUserChoice = userVote === idx;
              const votesForOpt = currentCounts[idx] || 0;
              const percent = totalVotes > 0 ? Math.round((votesForOpt / totalVotes) * 100) : 0;

              return (
                <div key={idx} className="relative">
                  <button
                    type="button"
                    disabled={isQuestionAnswered}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center gap-3 relative z-10 cursor-pointer ${
                      isUserChoice
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold ring-1 ring-emerald-500'
                        : isSelected
                          ? 'border-shiraz bg-rose-50 text-text-main font-bold ring-1 ring-rose-500'
                          : isQuestionAnswered
                            ? 'border-home-grau/30 bg-slate-50 text-slate-600'
                            : 'border-home-grau/30 bg-white hover:bg-slate-100 text-text-main'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                      isUserChoice
                        ? 'bg-emerald-600 text-white'
                        : isSelected
                          ? 'bg-shiraz text-white'
                          : 'bg-slate-100 text-slate-700'
                    }`}>
                      {optionLetters[idx]}
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                    {isUserChoice && (
                      <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                    )}
                  </button>

                  {/* If user has voted, show live bar below option */}
                  {isQuestionAnswered && (
                    <div className="mt-1 flex items-center gap-2 px-1">
                      <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${isUserChoice ? 'bg-emerald-500' : 'bg-slate-600'}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 w-9 text-right shrink-0">
                        {formatDeWert(percent)}%
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Button or Confirmation */}
          {!isQuestionAnswered ? (
            <button
              type="button"
              disabled={selectedOption === null || isSubmitting}
              onClick={handleVoteSubmit}
              className="w-full mt-2 py-3 rounded-xl font-bold text-xs sm:text-sm bg-shiraz text-white hover:bg-rose-700 disabled:opacity-40 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>Übertrage...</>
              ) : (
                <>Stimme jetzt anonym abgeben <ArrowRight size={16} /></>
              )}
            </button>
          ) : (
            <div className="p-3.5 bg-emerald-50 border border-emerald-500/40 rounded-xl space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <CheckCircle2 size={16} className="text-emerald-700" />
                <span>Ihre Stimme wurde gewertet!</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                {currentQ.didaktik}
              </p>
              {currentQ.norm && (
                <span className="text-[10px] text-slate-600 block pt-1 border-t border-emerald-200">
                  Quelle / Regelwerk: {currentQ.norm}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-md w-full mx-auto text-center pt-4 pb-2 text-[11px] text-slate-600 space-y-1">
        <p>Technische Hochschule Augsburg • Fakultät für Architektur und Bauwesen</p>
        <p>BaustoffBoard Live-Voting • 100% Anonym • DSGVO-konform</p>
      </div>
    </div>
  );
}
