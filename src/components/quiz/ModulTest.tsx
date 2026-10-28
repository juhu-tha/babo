import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useMemo, useState } from 'react';
import { GraduationCap, CheckCircle2, XCircle, AlertTriangle, ExternalLink, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useTabContext, TabType } from '@/src/contexts/TabContext';
import { anzahlFragenModul, useModulFragen } from '@/src/data/quizLader';
import { mischeAntworten } from '@/src/utils/mischeAntworten';
import { anzahlFreigegeben } from '@/src/data/quizModell';
import { FreigabeEtikett } from './FreigabeEtikett';

/**
 * Stufe 4 des Lehrpfads (Grundlagen → Labor → Bemessung → Test):
 * Modulbezogener Selbsttest mit begründetem Feedback.
 * Fragen stammen aus dem zentralen Fragenpool (src/data/quiz.json, je Modul nachgeladen über quizLader) und erscheinen
 * damit zugleich im Prüfungsmodus der Übungsaufgaben. Markup und Klassen entsprechen
 * der Fragendarstellung in InteractiveQuizSystem (Sofort-Feedback).
 *
 * Systemweit standardmäßig zum Start eingeklappt, per Klick auf die Kopfzeile ausklappbar.
 */
export interface ModulTestProps {
  moduleId: string;
  title?: string;
  defaultOpen?: boolean;
}

export function ModulTest({ moduleId, title, defaultOpen = false }: ModulTestProps) {
  const { setActiveTab } = useTabContext();
  // Anzahl sofort aus dem Index (Kopfzeile ohne Layoutsprung), Fragen selbst als kleiner Chunk nachgeladen
  const anzahl = anzahlFragenModul(moduleId);
  const geladen = useModulFragen(moduleId);
  const questions = useMemo(() => (geladen ?? []).map(q => mischeAntworten(q)), [geladen]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (anzahl === 0) return null;

  const answered = questions.filter(q => answers[q.id] !== undefined);
  const correct = answered.filter(q => answers[q.id] === q.correctIdx).length;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-home-grau/30 shadow-sm flex flex-col gap-4 transition-all">
      {/* Header Button: Klickbar zum Ein- und Ausklappen */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between text-left cursor-pointer group gap-3"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-9 h-9 rounded-xl bg-shiraz/10 text-shiraz flex items-center justify-center shrink-0 border border-shiraz/15 shadow-xxs">
            <GraduationCap size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-text-main group-hover:text-shiraz transition-colors flex items-center gap-2">
              {title ?? 'Selbsttest: Haben Sie es verstanden?'}
            </h3>
            <p className="text-xs text-text-main/60">
              Stufe 4 des Lehrpfads: Überprüfen Sie Ihr Fach- und Bemessungswissen mit Sofort-Feedback
            </p>
          </div>
          <div className="flex items-center gap-1.5 ml-0 sm:ml-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-off-white text-text-main/70 border border-home-grau/30">
              {formatDeWert(anzahl)} {anzahl === 1 ? 'Frage' : 'Fragen'}
            </span>
            {answered.length > 0 && (
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-shiraz text-white">
                {formatDeWert(correct)} / {formatDeWert(anzahl)} richtig
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-shiraz">
          <span className="hidden sm:inline">
            {isOpen ? 'Einklappen' : 'Selbsttest aufklappen'}
          </span>
          <div className="w-8 h-8 rounded-xl bg-off-white border border-home-grau/30 flex items-center justify-center text-text-main/70 group-hover:text-shiraz group-hover:border-shiraz/30 transition-all shadow-xxs">
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </button>

      {/* Ausklappbarer Inhalt */}
      {isOpen && !geladen && (
        <p className="pt-4 border-t border-home-grau/20 text-xs text-text-main/70" role="status">Fragen werden geladen …</p>
      )}
      {isOpen && geladen && (
        <div className="pt-4 border-t border-home-grau/20 flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-off-white/60 p-4 rounded-2xl border border-home-grau/20">
            <div className="text-xs font-medium text-text-main/80">
              Fortschritt: <strong className="text-text-main font-mono">{formatDeWert(answered.length)}</strong> von <span className="font-mono">{questions.length}</span> beantwortet 
              {answered.length > 0 && (
                <span className="ml-2 font-bold text-shiraz font-mono">({formatDeWert(correct)} korrekt)</span>
              )}
            </div>
            {answered.length > 0 && (
              <button
                type="button"
                onClick={() => setAnswers({})}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-text-main/70 hover:text-shiraz bg-white border border-home-grau/30 transition-all cursor-pointer flex items-center gap-1.5 shadow-xxs w-fit"
              >
                <RotateCcw size={13} /> Antworten zurücksetzen
              </button>
            )}
          </div>

          {anzahlFreigegeben(questions) < questions.length && (
            <p className="text-xs text-text-main/80 leading-relaxed">
              {anzahlFreigegeben(questions) === 0
                ? 'Die Fragen dieses Selbsttests sind technisch vorgeprüft, aber noch nicht fachlich freigegeben.'
                : `${formatDeWert(anzahlFreigegeben(questions))} von ${formatDeWert(questions.length)} Fragen sind fachlich freigegeben; die übrigen sind gekennzeichnet („noch nicht fachlich freigegeben“).`}
            </p>
          )}

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-shiraz rounded-full transition-all duration-300"
              style={{ width: `${(answered.length / questions.length) * 100}%` }}
            />
          </div>

      {questions.map((q, qIdx) => {
        const selected = answers[q.id];
        const isRevealed = selected !== undefined;
        const isCorrect = selected === q.correctIdx;
        return (
          <div key={q.id} className="flex flex-col gap-4">
            <div className="p-6 bg-off-white rounded-2xl border border-home-grau/30 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-white text-shiraz border border-home-grau/30 uppercase tracking-wider">
                  Frage {formatDeWert(qIdx + 1)} / {questions.length}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-white text-slate-700 border border-home-grau/30">
                  {q.topic}
                </span>
                {q.normRef && (
                  <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded-md bg-white text-slate-600 border border-home-grau/30">
                    {q.normRef}
                  </span>
                )}
                {q.difficulty && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    q.difficulty === 'Basis' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                    q.difficulty === 'Vertiefung' ? 'bg-slate-100 text-slate-800 border-slate-200' :
                    'bg-shiraz/10 text-shiraz border-shiraz/20'
                  }`}>
                    {q.difficulty}
                  </span>
                )}
                <FreigabeEtikett frage={q} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-text-main leading-snug">
                {q.question}
              </h3>
            </div>

            <div className="flex flex-col gap-2.5">
              {q.options.map((opt, optIdx) => {
                const isSelected = selected === optIdx;
                const isCorrectOption = optIdx === q.correctIdx;
                let style = 'bg-white border-home-grau/30 text-text-main hover:bg-slate-50';
                if (isRevealed) {
                  if (isCorrectOption) {
                    style = 'bg-slate-100 dark:bg-slate-800 border-slate-400 text-text-main font-semibold ring-1 ring-slate-400';
                  } else if (isSelected) {
                    style = 'bg-shiraz/5 border-shiraz/40 text-shiraz font-medium ring-1 ring-shiraz/40';
                  } else {
                    style = 'bg-white border-home-grau/20 text-text-main/50 opacity-60';
                  }
                }
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                    disabled={isRevealed}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3.5 cursor-pointer ${style}`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                      isRevealed && isCorrectOption
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : isRevealed && isSelected
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

            {isRevealed && (
              <div className={`p-5 rounded-2xl border flex flex-col gap-3.5 animate-in fade-in duration-200 ${
                isCorrect ? 'bg-slate-50 border-slate-200' : 'bg-shiraz/5 border-shiraz/20'
              }`}>
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 size={18} className="text-slate-800" />
                      <strong className="text-xs font-bold text-slate-900 uppercase tracking-wider">Richtig – Begründung:</strong>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={18} className="text-shiraz" />
                      <strong className="text-xs font-bold text-shiraz uppercase tracking-wider">Wissenslücke erkannt ({q.topic})</strong>
                    </>
                  )}
                </div>
                {!isCorrect && selected !== undefined && q.distraktorFeedback?.[selected] && (
                  <div className="text-xs leading-relaxed text-shiraz"><strong>Zu Ihrer Antwort:</strong> {q.distraktorFeedback[selected]}</div>
                )}
                <div className="text-xs text-text-main/80 leading-relaxed font-normal">{q.explanation}</div>
                {!isCorrect && q.gapAnalysis && (
                  <div className="p-3.5 bg-white rounded-xl border border-shiraz/20 flex flex-col gap-2 mt-1">
                    <div className="text-[11px] text-shiraz leading-snug">
                      <strong className="text-shiraz">Didaktischer Hinweis:</strong> {q.gapAnalysis.misconception}
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-1 border-t border-shiraz/10">
                      <span className="text-[10px] text-text-main/60">Grundregel: {q.gapAnalysis.coreRule}</span>
                      {q.gapAnalysis.targetModuleTab && q.gapAnalysis.targetModuleTab !== moduleId && (
                        <button
                          type="button"
                          onClick={() => setActiveTab(q.gapAnalysis.targetModuleTab as TabType)}
                          className="text-xs font-bold text-shiraz hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span>Zum Modul "{q.gapAnalysis.targetModuleLabel}"</span>
                          <ExternalLink size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

          <div className="flex justify-end pt-2 border-t border-home-grau/15">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-text-main/60 hover:text-shiraz font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ChevronUp size={14} /> Selbsttest wieder einklappen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModulTest;
