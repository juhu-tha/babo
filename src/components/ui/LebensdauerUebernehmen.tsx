import React from 'react';
import { ArrowRight, Timer } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { uebergabeAdresse, type LebensdauerUebergabe } from '@/src/calc/lebensdauerUebergabe';
import inhalt from '@/content/lebensdauerbemessung/LebensdauerUebernehmen.json';
import { MdText } from '@/src/components/inhalt/MdText';

/** Kurztexte je Ausgangsrechner */
const BESCHREIBUNG = {
  schnell: inhalt.texte.schnell,
  korrosionChlorid: inhalt.texte.korrosionChlorid,
  korrosionKarb: inhalt.texte.korrosionKarb,
  korrosionSchnell: inhalt.texte.korrosionSchnell,
  dauerhaftigkeit: inhalt.texte.dauerhaftigkeit,
  bauwerk: inhalt.texte.bauwerk,
  exposition: inhalt.texte.exposition,
} as const;
export type UebernahmeArt = keyof typeof BESCHREIBUNG;

/**
 * Schaltfläche „In Lebensdauerbemessung übernehmen“ (Runde 7): übergibt die passenden Eingaben eines Einzelrechners
 * per URL-Parameter an /modul/lebensdauerbemessung. Echter Link (neuer Tab, Adresse kopieren); ein normaler Klick
 * wechselt ohne Neuladen. Die Lebensdauerbemessung prüft die Werte (src/calc/lebensdauerUebergabe.ts).
 */
export interface LebensdauerUebernehmenProps {
  daten: LebensdauerUebergabe;
  /** false: Ergebnis ungültig – Schaltfläche gesperrt */
  aktiv?: boolean;
  /** Kurztext, was übernommen wird (content/lebensdauerbemessung/LebensdauerUebernehmen.json) */
  art?: UebernahmeArt;
  className?: string;
}

export function LebensdauerUebernehmen({ daten, aktiv = true, art, className = '' }: LebensdauerUebernehmenProps) {
  const { setActiveTab } = useTabContext();
  const adresse = uebergabeAdresse(daten);
  const klasse = 'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors';
  const wechseln = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    try { window.history.pushState(null, '', adresse); } catch { /* Adresse bleibt; Wechsel trotzdem */ }
    setActiveTab('lebensdauerbemessung');
    const container = document.getElementById('scroll-container');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className={`flex flex-col gap-1.5 ${className}`} data-lebensdauer-uebergabe={daten.quelle}>
      {aktiv ? (
        <a href={adresse} onClick={wechseln} className={`${klasse} self-start bg-shiraz text-white hover:bg-shiraz/90`}>
          <Timer size={14} aria-hidden={true} /> {inhalt.werte.schaltflaeche} <ArrowRight size={14} aria-hidden={true} />
        </a>
      ) : (
        <span aria-disabled="true" className={`${klasse} self-start bg-off-white text-text-main/70 border border-home-grau/50 cursor-not-allowed`}>
          <Timer size={14} aria-hidden={true} /> {inhalt.werte.gesperrt}
        </span>
      )}
      {art && <p className="text-[11px] text-text-main/75 leading-relaxed"><MdText text={BESCHREIBUNG[art]} /></p>}
    </div>
  );
}

export default LebensdauerUebernehmen;
