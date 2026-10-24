import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';
import type { Hinweis } from '@/src/calc/plausibilitaet';

/** Zeigt Plausibilitätshinweise eines Rechenkerns an (Umsetzungsplan Phase 4, AP 4.8). */
export function EingabeHinweise({ hinweise }: { hinweise: readonly Hinweis[] }) {
  if (!hinweise.length) return null;
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-2 my-3">
      {hinweise.map((h, i) => (
        <p
          key={i}
          className={`flex items-start gap-2 text-sm p-3 rounded-xl border ${
            h.stufe === 'fehler'
              ? 'bg-red-50 border-red-300 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100'
              : 'bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-100'
          }`}
        >
          {h.stufe === 'fehler' ? <XCircle size={18} className="shrink-0 mt-0.5" aria-hidden="true" /> : <AlertTriangle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />}
          <span><strong>{h.stufe === 'fehler' ? 'Eingabe unzulässig: ' : 'Hinweis: '}</strong>{h.text}</span>
        </p>
      ))}
    </div>
  );
}
