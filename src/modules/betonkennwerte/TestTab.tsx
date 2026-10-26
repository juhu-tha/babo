// Ausgelagert aus src/modules/Betonkennwerte.tsx (AP 5.2)
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { formatDeWert } from '@/src/utils/numberFormat';
import inhalt from '@/content/betonkennwerte/TestTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface TestTabProps {
  QUIZ_ITEMS: { q: string; options: string[]; correct: number; feedback: string; }[];
  quizAnswers: Record<number, number>;
  setQuizAnswers: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

export default function TestTab({ QUIZ_ITEMS, quizAnswers, setQuizAnswers }: TestTabProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center justify-between pb-4 border-b border-home-grau/20 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <CheckCircle2 size={18} className="text-shiraz" /><MdText text={inhalt.texte.stufe4DidaktischerWissenstest} /></h3>
            <p className="text-xs text-slate-500"><MdText text={inhalt.texte.überprüfenSieIhrVerständnis} /></p>
          </div>
          <button
            onClick={() => setQuizAnswers({})}
            className="px-3 py-1.5 rounded-lg border border-home-grau/30 hover:bg-slate-50 text-xs text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw size={12} /> Zurücksetzen
          </button>
        </div>

        <div className="space-y-6">
          {QUIZ_ITEMS.map((item, qIdx) => {
            const selected = quizAnswers[qIdx];
            const isAnswered = selected !== undefined;
            const isCorrect = selected === item.correct;

            return (
              <div key={qIdx} className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-3">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                  Frage {formatDeWert(qIdx + 1)}: {item.q}
                </h4>

                <div className="grid grid-cols-1 gap-2">
                  {item.options.map((opt, optIdx) => {
                    let btnStyle = 'bg-white border-home-grau/30 text-slate-800 hover:bg-slate-50';
                    if (isAnswered) {
                      if (optIdx === item.correct) {
                        btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                      } else if (selected === optIdx) {
                        btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                      } else {
                        btnStyle = 'bg-white/60 border-slate-200 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                        className={`p-3 rounded-lg border text-xs text-left transition-all flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                      >
                        <span className="font-mono font-bold text-slate-500 shrink-0">
                          {String.fromCharCode(65 + optIdx)})
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isAnswered && optIdx === item.correct && (
                          <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                        )}
                        {isAnswered && selected === optIdx && optIdx !== item.correct && (
                          <XCircle size={16} className="text-rose-700 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className={`p-3 rounded-lg text-xs leading-relaxed border ${
                    isCorrect 
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
                      : 'bg-rose-50/80 border-rose-200 text-rose-900'
                  }`}>
                    <strong>{isCorrect ? '✓ Richtig!' : inhalt.werte.leiderNichtRichtig}</strong> {item.feedback}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
