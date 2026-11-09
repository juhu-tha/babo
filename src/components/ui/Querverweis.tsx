import React from 'react';
import { ArrowRight, Link2 } from 'lucide-react';
import { useTabContext, TabId } from '@/src/contexts/TabContext';

/**
 * Querverweis auf die eine kanonische Quelle eines Themas (AP 3.9 „Eine Quelle je Thema“).
 * Ersetzt doppelte Rechner/Tabellen durch eine kurze Einordnung und einen Sprung ins Fachmodul.
 */
export interface QuerverweisProps {
  /** Zielmodul (Registry-ID) */
  ziel: TabId;
  titel: string;
  /** Kurze Einordnung, 1–3 Sätze */
  children: React.ReactNode;
  /** Beschriftung des Link-Buttons */
  linkText: string;
  className?: string;
  /** Überschriftenebene des Titels (Standard 4); 3 unter einer h2, damit die Folge keine Ebene überspringt
   *  (a11y 09.11.2026). Das Aussehen bleibt das einer h4 (Klasse wie-h4). */
  ebene?: 3 | 4;
}

export function springeZu(setActiveTab: (t: TabId) => void, ziel: TabId) {
  setActiveTab(ziel);
  const container = document.getElementById('scroll-container');
  if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function Querverweis({ ziel, titel, children, linkText, className = '', ebene = 4 }: QuerverweisProps) {
  const { setActiveTab } = useTabContext();
  const Titel = ebene === 3 ? 'h3' : 'h4';
  return (
    <div className={`p-4 rounded-xl border border-shiraz/25 bg-shiraz/5 text-sm text-text-main/85 leading-relaxed ${className}`} data-querverweis={ziel}>
      <Titel className={`font-bold text-text-main flex items-center gap-2 mb-1.5${ebene === 3 ? ' wie-h4' : ''}`}>
        <Link2 size={16} className="text-shiraz shrink-0" /> {titel}
      </Titel>
      <div className="text-xs leading-relaxed space-y-1.5">{children}</div>
      <button
        type="button"
        onClick={() => springeZu(setActiveTab, ziel)}
        className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-shiraz text-white text-xs font-bold hover:bg-shiraz/90 transition-colors cursor-pointer"
      >
        {linkText} <ArrowRight size={14} />
      </button>
    </div>
  );
}

export default Querverweis;
