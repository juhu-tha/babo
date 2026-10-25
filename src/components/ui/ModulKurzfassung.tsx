import React, { useState } from 'react';
import { ListChecks, ChevronDown } from 'lucide-react';

/** „Das Wichtigste in 5 Punkten“ vor langen Modulen (Umsetzungsplan Phase 3, AP 3.8) – standardmäßig aufgeklappt */
export function ModulKurzfassung({ punkte }: { punkte: readonly string[] }) {
  const [offen, setOffen] = useState(true);
  return (
    <section aria-label="Das Wichtigste in 5 Punkten" className="mb-4 rounded-xl border border-shiraz/25 bg-shiraz/5 text-sm">
      <button type="button" aria-expanded={offen} onClick={() => setOffen(!offen)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-left font-bold text-shiraz">
        <ListChecks size={16} aria-hidden="true" /> Das Wichtigste in 5 Punkten
        <ChevronDown size={16} aria-hidden="true" className={`ml-auto transition-transform ${offen ? 'rotate-180' : ''}`} />
      </button>
      {offen && (
        <ol className="px-4 pb-4 pt-1 space-y-1.5 list-decimal pl-9 text-text-main">
          {punkte.map((p, i) => <li key={i}>{p}</li>)}
        </ol>
      )}
    </section>
  );
}

export default ModulKurzfassung;
