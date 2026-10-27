import React from 'react';
import { CircleDashed } from 'lucide-react';
import { ETIKETT_UNGEPRUEFT, istFachlichFreigegeben, type QuizQuestion } from '@/src/data/quizModell';

/**
 * Dezentes Etikett an Quizfragen ohne fachliche Freigabe (verified !== true).
 * Einheitlich in Selbsttest (ModulTest), Übungsaufgaben (InteractiveQuizSystem) und Klausursimulator.
 * Die Aussage steckt im Text (nicht nur in Farbe oder Symbol); neutrale Farben mit hohem Kontrast
 * wie die übrigen Frage-Etiketten.
 */
export function FreigabeEtikett({ frage }: { frage: Pick<QuizQuestion, 'verified'> }) {
  if (istFachlichFreigegeben(frage)) return null;
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white text-slate-700 border border-dashed border-slate-400"
      data-freigabe="offen"
    >
      <CircleDashed size={11} aria-hidden="true" /> {ETIKETT_UNGEPRUEFT}
    </span>
  );
}

export default FreigabeEtikett;
