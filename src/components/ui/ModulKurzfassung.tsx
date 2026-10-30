import React, { useId, useState } from 'react';
import { ListChecks, ChevronDown } from 'lucide-react';

/** „Das Wichtigste in 5 Punkten“ vor langen Modulen (Umsetzungsplan Phase 3, AP 3.8) – standardmäßig eingeklappt (Entscheidung 28.10.2026); die Punkte stehen trotzdem im HTML (hidden), damit
 *  Vorrendern und Suche sie enthalten */
export function ModulKurzfassung({ punkte }: { punkte: readonly string[] }) {
  const [offen, setOffen] = useState(false);
  const listeId = useId();
  return (
    <section aria-label="Das Wichtigste" className="mb-4 rounded-xl border border-shiraz/25 bg-shiraz/5 text-sm">
      <button type="button" aria-expanded={offen} aria-controls={listeId} onClick={() => setOffen(!offen)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-left font-bold text-shiraz">
        <ListChecks size={16} aria-hidden="true" /> Das Wichtigste
        <ChevronDown size={16} aria-hidden="true" className={`ml-auto transition-transform ${offen ? 'rotate-180' : ''}`} />
      </button>
      <ol id={listeId} hidden={!offen} className="px-4 pb-4 pt-1 space-y-1.5 list-decimal pl-9 text-text-main">
        {punkte.map((p, i) => <li key={i}>{p}</li>)}
      </ol>
    </section>
  );
}

/** nur die nummerierte Liste (für die Kopfleiste) */
export function KurzfassungPunkte({ punkte }: { punkte: readonly string[] }) {
  return (
    <ol className="space-y-1.5 list-decimal pl-5 text-text-main">
      {punkte.map((p, i) => <li key={i}>{p}</li>)}
    </ol>
  );
}

export default ModulKurzfassung;
