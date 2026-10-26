import React, { useEffect, useState } from 'react';
import { FileSearch } from 'lucide-react';
import { ladeSuchindex, suche, type IndexEintrag, type Treffer } from '@/src/utils/volltextsuche';
import { MODUL_KERN } from '@/src/registry/kern';
import type { TabId } from '@/src/contexts/TabContext';

/** Treffer der Volltextsuche unter dem Menü (Phase 2, AP 2.9) */
export function VolltextTreffer({ anfrage, oeffne }: { anfrage: string; oeffne: (id: TabId) => void }) {
  const [index, setIndex] = useState<IndexEintrag[] | null>(null);
  useEffect(() => {
    if (anfrage.trim().length >= 3 && !index) ladeSuchindex().then(setIndex);
  }, [anfrage, index]);
  if (anfrage.trim().length < 3) return null;
  const titel = (id: string) => MODUL_KERN.get(id)?.titel ?? MODUL_KERN.get(id)?.label ?? id;
  const treffer: Treffer[] = index ? suche(index, anfrage, titel) : [];
  return (
    <section aria-label="Treffer im Inhalt der Module" className="mt-2 pt-2 border-t border-home-grau/20 dark:border-slate-800">
      <h2 className="px-2 mb-1 text-xs font-bold uppercase tracking-wider text-text-main/70 dark:text-slate-400 flex items-center gap-1.5">
        <FileSearch size={13} aria-hidden="true" /> Im Inhalt gefunden
      </h2>
      {!index ? (
        <p className="px-2 text-xs text-text-main/70" role="status">Suchindex wird geladen …</p>
      ) : treffer.length === 0 ? (
        <p className="px-2 text-xs text-text-main/70" role="status">Keine Treffer im Inhalt.</p>
      ) : (
        <ul className="flex flex-col gap-1" role="list">
          {treffer.map(t => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => oeffne(t.id as TabId)}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-home-grau/10 dark:hover:bg-slate-800"
              >
                <span className="block text-sm font-semibold text-text-main dark:text-slate-100">{titel(t.id)}</span>
                {t.ueberschrift && <span className="block text-xs text-shiraz dark:text-rose-400">{t.ueberschrift}</span>}
                {t.ausschnitt && <span className="block text-xs text-text-main/70 dark:text-slate-400 line-clamp-2">{t.ausschnitt}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
