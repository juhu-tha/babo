import React, { useId, useState } from 'react';
import { ChevronDown, Clock, Target } from 'lucide-react';
import type { ModulLernziele as Daten } from '@/src/data/lernziele';
import { MODUL_KERN } from '@/src/registry/kern';
import { anzahlFragenRoute } from '@/src/data/quizLader';
import { formatDeWert } from '@/src/utils/numberFormat';

const NIVEAU = { B: 'Bachelor', M: 'Master', 'B/M': 'Bachelor und Master' } as const;

/** Kopfzeile „Lernziele“ eines Fachmoduls (Umsetzungsplan Phase 3, AP 3.6) */
export function ModulLernziele({ moduleId, daten, oeffneModul }: { moduleId: string; daten: Daten; oeffneModul: (id: string) => void }) {
  const [offen, setOffen] = useState(false);
  const id = useId();
  const fragen = anzahlFragenRoute(moduleId);
  return (
    <section aria-label="Lernziele" className="mb-4 rounded-xl border border-home-grau/30 bg-white text-sm">
      <button type="button" aria-expanded={offen} aria-controls={id} onClick={() => setOffen(!offen)}
        className="w-full flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 text-left">
        <span className="flex items-center gap-2 font-bold text-shiraz"><Target size={16} aria-hidden="true" /> Lernziele</span>
        <span className="text-xs text-text-main/70">{NIVEAU[daten.niveau]}</span>
        <span className="text-xs text-text-main/70 flex items-center gap-1"><Clock size={13} aria-hidden="true" /> ca. {formatDeWert(daten.minuten)} min</span>
        {fragen > 0 && <span className="text-xs text-text-main/70">Selbsttest: {formatDeWert(fragen)} {fragen === 1 ? "Frage" : "Fragen"}</span>}
        <ChevronDown size={16} aria-hidden="true" className={`ml-auto transition-transform ${offen ? 'rotate-180' : ''}`} />
      </button>
      {offen && (
        <div id={id} className="px-4 pb-4 pt-1 border-t border-home-grau/20 space-y-3">
          <div>
            <p className="font-semibold text-text-main">Nach der Bearbeitung können Sie …</p>
            <ol className="mt-1 space-y-1 list-decimal pl-5">
              {daten.ziele.map((z, i) => (
                <li key={i}><span className="text-[11px] font-bold uppercase tracking-wide text-shiraz mr-1.5">{z.stufe}</span>{z.text}</li>
              ))}
            </ol>
          </div>
          {daten.vorwissen.length > 0 && (
            <p className="text-xs">
              <span className="font-semibold">Vorwissen: </span>
              {daten.vorwissen.map((v, i) => (
                <React.Fragment key={v}>
                  {i > 0 && ', '}
                  <button type="button" onClick={() => oeffneModul(v)} className="underline underline-offset-2 text-shiraz">
                    {MODUL_KERN.get(v)?.titel ?? MODUL_KERN.get(v)?.label ?? v}
                  </button>
                </React.Fragment>
              ))}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export default ModulLernziele;
