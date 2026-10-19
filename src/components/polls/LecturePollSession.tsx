import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Users, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft,
  Smartphone,
  BarChart3,
  Lightbulb,
  Radio,
  BookOpen,
  Lock,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { PollQuestion, getLecturePolls } from '@/src/data/lecturePollsData';

interface LecturePollSessionProps {
  lectureId: 'bauen_im_bestand' | 'nachhaltiges_bauen' | 'bauschaeden' | 'baustoffkunde' | 'instandhaltung';
  lectureTitle: string;
}

export default function LecturePollSession({ lectureId, lectureTitle }: LecturePollSessionProps) {
  const questions = useMemo(() => getLecturePolls(lectureId), [lectureId]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const currentQ: PollQuestion | undefined = questions[currentIdx];

  // In-session votes state: questionId -> array of counts per option
  const [votesState, setVotesState] = useState<Record<string, number[]>>(() => {
    const init: Record<string, number[]> = {};
    questions.forEach(q => {
      init[q.id] = [...q.initialVotes];
    });
    return init;
  });

  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showStudentModal, setShowStudentModal] = useState<boolean>(false);
  const [selectedStudentOption, setSelectedStudentOption] = useState<number | null>(null);
  const [hasVotedForQuestion, setHasVotedForQuestion] = useState<Record<string, number>>({});

  // Reset Password Modal State
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [resetPasswordInput, setResetPasswordInput] = useState<string>('');
  const [resetError, setResetError] = useState<string>('');
  const [resetScope, setResetScope] = useState<'current' | 'all'>('current');

  // Voting URL for students
  const studentVotingUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const base = window.location.origin + window.location.pathname;
    return `${base}?poll=${lectureId}&qid=${currentQ?.id || 'q1'}`;
  }, [lectureId, currentQ]);

  // Generate QR Code data URL
  useEffect(() => {
    if (studentVotingUrl) {
      QRCode.toDataURL(studentVotingUrl, {
        width: 320,
        margin: 1,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        }
      })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('QR Code error:', err));
    }
  }, [studentVotingUrl]);

  // Fetch initial live votes from server (with client fallback)
  const fetchServerVotes = useCallback(async () => {
    try {
      const res = await fetch(`/api/polls/${lectureId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.votes && Object.keys(data.votes).length > 0) {
          setVotesState(prev => ({
            ...prev,
            ...data.votes
          }));
        }
      }
    } catch {
      // Fallback silently to client state
    }
  }, [lectureId]);

  useEffect(() => {
    fetchServerVotes();
    const interval = setInterval(fetchServerVotes, 3000);
    return () => clearInterval(interval);
  }, [fetchServerVotes]);

  if (!currentQ) {
    return null;
  }

  const currentVotes = votesState[currentQ.id] || currentQ.initialVotes || [0, 0, 0, 0];
  const totalVotes = currentVotes.reduce((sum, v) => sum + v, 0);
  const isRevealed = !!revealedSolutions[currentQ.id];

  const handleCastVote = async (optionIndex: number) => {
    if (hasVotedForQuestion[currentQ.id] !== undefined) return;

    // Optimistic local update
    setVotesState(prev => {
      const existing = prev[currentQ.id] ? [...prev[currentQ.id]] : [0, 0, 0, 0];
      existing[optionIndex] = (existing[optionIndex] || 0) + 1;
      return { ...prev, [currentQ.id]: existing };
    });

    setHasVotedForQuestion(prev => ({ ...prev, [currentQ.id]: optionIndex }));

    // Send to backend
    try {
      await fetch(`/api/polls/${lectureId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: currentQ.id, optionIndex })
      });
    } catch {
      // Ignore
    }
  };

  const handleOpenResetModal = () => {
    setResetPasswordInput('');
    setResetError('');
    setShowResetModal(true);
  };

  const handleConfirmReset = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (resetPasswordInput !== 'admin') {
      setResetError('Ungültiges Passwort! Zurücksetzen ist nur für Dozierende mit dem Passwort "admin" gestattet.');
      return;
    }

    if (resetScope === 'current' && currentQ) {
      setVotesState(prev => ({
        ...prev,
        [currentQ.id]: [0, 0, 0, 0]
      }));
      setHasVotedForQuestion(prev => {
        const copy = { ...prev };
        delete copy[currentQ.id];
        return copy;
      });

      try {
        await fetch(`/api/polls/${lectureId}/reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId: currentQ.id, password: 'admin' })
        });
      } catch {
        // Ignore
      }
    } else {
      // Reset all questions in lecture
      const resetAll: Record<string, number[]> = {};
      questions.forEach(q => {
        resetAll[q.id] = [0, 0, 0, 0];
      });
      setVotesState(resetAll);
      setHasVotedForQuestion({});

      try {
        await fetch(`/api/polls/${lectureId}/reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: 'admin' })
        });
      } catch {
        // Ignore
      }
    }

    setShowResetModal(false);
    setResetPasswordInput('');
    setResetError('');
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(studentVotingUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];
  const barColors = [
    'from-rose-500 to-rose-600',
    'from-amber-500 to-amber-600',
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
      {/* Top Banner: Lecture Hall Header */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/30 text-rose-300 border border-shiraz/40 mb-2">
            <Radio size={14} className="animate-pulse text-rose-400" />
            Hörsaal-Live-Voting (Kick-Off: 1. Vorlesungsstunde)
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {lectureTitle}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Interaktives Publikumsvoting: Scannen Sie den QR-Code mit dem Smartphone zur Live-Teilnahme ohne Login.
          </p>
        </div>

        {/* Live Audience Stat */}
        <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 shrink-0">
          <div className="flex items-center gap-2 text-rose-400">
            <Users size={18} />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hörsaal-Stimmen</div>
            <strong className="text-xl font-mono font-extrabold text-white">{formatDeWert(totalVotes)}</strong>
          </div>
        </div>
      </div>

      {/* Question Selector Tabs */}
      <div className="px-5 py-3 bg-slate-100/80 border-b border-home-grau/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                setCurrentIdx(idx);
                setSelectedStudentOption(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentIdx === idx
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-home-grau/20'
              }`}
            >
              <span>Frage {idx + 1}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                currentIdx === idx ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {q.category}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
            title="Vorherige Frage"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-mono font-bold text-slate-600 px-1">
            {formatDeWert(currentIdx + 1)} / {questions.length}
          </span>
          <button
            type="button"
            disabled={currentIdx === questions.length - 1}
            onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
            title="Nächste Frage"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Beamer / Results, Right = QR Code & Lecturer Tools */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Question & Live Poll Distribution (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          <div>
            {/* Category Badge & Meta */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                <Sparkles size={12} className="text-amber-600" />
                {currentQ.category}
              </span>
              {currentQ.norm && (
                <span className="text-[11px] text-slate-400 font-mono">
                  Quelle: {currentQ.norm}
                </span>
              )}
            </div>

            {/* Question Text */}
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-5">
              {currentQ.question}
            </h4>

            {/* Options & Live Result Bars */}
            <div className="space-y-3">
              {currentQ.options.map((opt, oIdx) => {
                const votesCount = currentVotes[oIdx] || 0;
                const pct = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;
                const isCorrect = currentQ.correctIndex === oIdx;
                const isUserVote = hasVotedForQuestion[currentQ.id] === oIdx;

                return (
                  <div
                    key={oIdx}
                    className={`relative p-3.5 rounded-xl border transition-all overflow-hidden ${
                      isRevealed && isCorrect
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                        : isUserVote
                          ? 'border-shiraz bg-rose-50/30'
                          : 'border-home-grau/30 bg-slate-50/50'
                    }`}
                  >
                    {/* Background Progress Bar */}
                    <div
                      className={`absolute top-0 bottom-0 left-0 opacity-20 transition-all duration-700 bg-gradient-to-r ${barColors[oIdx % barColors.length]}`}
                      style={{ width: `${pct}%` }}
                    />

                    <div className="relative flex items-center justify-between gap-3 z-10">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Option Letter Icon */}
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isRevealed && isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-white'
                        }`}>
                          {optionLetters[oIdx]}
                        </span>
                        
                        <span className={`text-xs sm:text-sm font-semibold leading-snug ${
                          isRevealed && isCorrect ? 'text-emerald-950 font-bold' : 'text-slate-800'
                        }`}>
                          {opt}
                        </span>

                        {isUserVote && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-shiraz text-white shrink-0">
                            Ihre Stimme
                          </span>
                        )}

                        {isRevealed && isCorrect && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                            <CheckCircle2 size={12} className="text-emerald-700" />
                            Korrekt
                          </span>
                        )}
                      </div>

                      {/* Vote Count & Percent */}
                      <div className="flex items-baseline gap-2 shrink-0">
                        <span className="font-mono text-xs text-slate-500">
                          {votesCount} {votesCount === 1 ? 'Stimme' : 'Stimmen'}
                        </span>
                        <strong className={`font-mono text-base font-extrabold ${
                          isRevealed && isCorrect ? 'text-emerald-700' : 'text-slate-900'
                        }`}>
                          {formatDeWert(pct)}%
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Didactic Solution Card (Shown when revealed) */}
          {isRevealed && (
            <div className="p-4 sm:p-5 rounded-xl border border-emerald-300 bg-emerald-50/60 text-xs text-slate-800 space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <Lightbulb className="text-emerald-700" size={18} />
                Fachdidaktische Auflösung &amp; Aha-Effekt
              </div>
              <p className="leading-relaxed">
                {currentQ.didaktik}
              </p>
              {currentQ.norm && (
                <div className="pt-2 border-t border-emerald-200/60 font-mono text-[11px] text-emerald-900">
                  Normativer Hintergrund / Referenz: <strong>{currentQ.norm}</strong>
                </div>
              )}
            </div>
          )}

          {/* Lecturer Action Buttons Bar */}
          <div className="pt-4 border-t border-home-grau/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setRevealedSolutions(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
                className={`py-2 px-3.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  isRevealed
                    ? 'bg-slate-700 text-white hover:bg-slate-800'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                {isRevealed ? 'Auflösung verbergen' : 'Auflösung & Didaktik anzeigen'}
              </button>

              <button
                type="button"
                onClick={handleOpenResetModal}
                className="py-2 px-3 rounded-xl font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                title="Stimmen mit Dozenten-Passwort 'admin' auf 0 zurücksetzen"
              >
                <Lock size={13} className="text-slate-400" />
                <RotateCcw size={13} />
                Zurücksetzen (Admin)
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowStudentModal(true)}
              className="py-2 px-3.5 rounded-xl font-bold bg-shiraz text-white hover:bg-shiraz/90 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Smartphone size={14} />
              Als Student abstimmen
            </button>
          </div>
        </div>

        {/* Right Column: QR Code & Mobile Connection Card (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 flex flex-col justify-between items-center text-center">
          <div className="w-full flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 mb-3">
              <QrCode size={13} />
              Live-Teilnahme für Studierende
            </div>

            <h5 className="font-bold text-sm text-slate-900 mb-1">
              Smartphone-Kamera öffnen:
            </h5>
            <p className="text-[11px] text-slate-500 mb-4 max-w-[220px]">
              Scannen Sie den QR-Code, um direkt auf Ihrem Smartphone abzustimmen.
            </p>

            {/* QR Code Container */}
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-4">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt={`QR-Code für Vorlesungsumfrage ${currentQ.id}`}
                  className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-lg"
                />
              ) : (
                <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                  QR-Code wird geladen...
                </div>
              )}
            </div>

            {/* Link Copy Box */}
            <div className="w-full bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-left mb-3">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Direktlink:</span>
                <span className="text-[11px] font-mono text-slate-700 truncate block">
                  {studentVotingUrl}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0 cursor-pointer"
                title="Link in Zwischenablage kopieren"
              >
                {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div className="w-full pt-3 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-1.5 text-left">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
              100 % anonym • Kein Google-Konto nötig
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold px-1">
              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
              Keine Registrierung oder App-Installation
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold px-1">
              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
              Echtzeit-Synchronisierung der Ergebnisse
            </div>
          </div>
        </div>
      </div>

      {/* --- Student Vote Modal (Test-Modus auf dem Desktop / Testen ohne Handy) --- */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-shiraz text-white flex items-center justify-center font-bold text-xs">
                  THA
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Studenten-Ansicht (Live-Voting)</h4>
                  <span className="text-[10px] text-slate-500">{lectureTitle}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStudentModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 rounded-md"
              >
                ✕ Schließen
              </button>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-shiraz tracking-wider block mb-1">
                Frage {formatDeWert(currentIdx + 1)} von {questions.length} ({currentQ.category})
              </span>
              <p className="text-sm font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </p>
            </div>

            {/* Voting Options */}
            <div className="space-y-2 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedStudentOption === idx;
                const hasVotedThis = hasVotedForQuestion[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasVotedForQuestion[currentQ.id] !== undefined}
                    onClick={() => setSelectedStudentOption(idx)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-3 cursor-pointer ${
                      hasVotedThis
                        ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-900'
                        : isSelected
                          ? 'border-shiraz bg-rose-50/50 font-bold text-slate-900'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                      hasVotedThis
                        ? 'bg-emerald-600 text-white'
                        : isSelected
                          ? 'bg-shiraz text-white'
                          : 'bg-slate-200 text-slate-700'
                    }`}>
                      {optionLetters[idx]}
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                    {hasVotedThis && (
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Submit Button */}
            {hasVotedForQuestion[currentQ.id] === undefined ? (
              <button
                type="button"
                disabled={selectedStudentOption === null}
                onClick={() => {
                  if (selectedStudentOption !== null) {
                    handleCastVote(selectedStudentOption);
                  }
                }}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-shiraz text-white hover:bg-shiraz/90 disabled:opacity-40 transition-all shadow-xs cursor-pointer"
              >
                Stimme jetzt absenden
              </button>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-xs font-bold text-emerald-800 block">
                  Ihre Stimme wurde erfolgreich gewertet!
                </span>
                <span className="text-[11px] text-emerald-700">
                  Verfolgen Sie die Live-Ergebnisse auf dem Beamer im Hörsaal.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Lock size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Umfrage zurücksetzen</h4>
                  <span className="text-[11px] text-slate-500">Nur für autorisierte Dozierende &amp; Admins</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReset} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Umfang des Resets:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setResetScope('current')}
                    className={`p-2.5 rounded-xl border text-left font-semibold cursor-pointer transition-all ${
                      resetScope === 'current'
                        ? 'border-shiraz bg-rose-50/50 text-shiraz'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Aktuelle Frage (Q{formatDeWert(currentIdx + 1)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetScope('all')}
                    className={`p-2.5 rounded-xl border text-left font-semibold cursor-pointer transition-all ${
                      resetScope === 'all'
                        ? 'border-shiraz bg-rose-50/50 text-shiraz'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Alle Fragen ({questions.length})
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Admin-Passwort eingeben:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    autoFocus
                    value={resetPasswordInput}
                    onChange={(e) => {
                      setResetPasswordInput(e.target.value);
                      if (resetError) setResetError('');
                    }}
                    placeholder="Passwort eingeben..."
                    className="w-full text-xs p-2.5 pl-8 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-shiraz/40 focus:border-shiraz"
                  />
                  <KeyRound size={14} className="absolute left-2.5 top-3 text-slate-400" />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Passwort-Hinweis: Dozierenden-Freigabe (<code>admin</code>)
                </span>
              </div>

              {resetError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <RotateCcw size={13} />
                  Auf 0 zurücksetzen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
