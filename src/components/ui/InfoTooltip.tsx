import React, { useId, useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  text: string;
}

/**
 * Kurzerläuterung neben einer Beschriftung. Per Maus (Überfahren) und per Tastatur (Fokus auf das Symbol)
 * einblendbar, mit Escape ausblendbar und als Beschreibung (aria-describedby) für Screenreader verknüpft
 * (WCAG 1.4.13, 2.1.1, 4.1.2; Prüfung 03.11.2026).
 */
export function InfoTooltip({ text }: InfoTooltipProps) {
  const id = useId();
  const [weg, setWeg] = useState(false);
  return (
    <span className="group relative inline-flex items-center" onMouseLeave={() => setWeg(false)}>
      <button
        type="button"
        aria-label="Erläuterung"
        aria-describedby={id}
        onKeyDown={e => { if (e.key === 'Escape' && !weg) { e.stopPropagation(); setWeg(true); } }}
        onBlur={() => setWeg(false)}
        className="inline-flex items-center justify-center rounded cursor-help"
      >
        <Info size={14} aria-hidden="true" className="text-text-main/40 hover:text-shiraz transition-colors" />
      </button>
      <span
        role="tooltip"
        id={id}
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden ${weg ? '' : 'group-hover:block group-focus-within:block'} w-56 p-2 bg-text-main text-white text-xs rounded shadow-lg z-50 text-center font-normal normal-case tracking-normal`}
      >
        {text}
        <span aria-hidden="true" className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-text-main"></span>
      </span>
    </span>
  );
}
