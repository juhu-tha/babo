import React, { useState } from 'react';
import { HelpCircle, BookOpen, CheckCircle2 } from 'lucide-react';
import { GLOSSARY_TERMS, GlossaryTerm } from '@/src/data/glossaryTerms';
import { InlineMath } from 'react-katex';
import { useTabContext } from '@/src/contexts/TabContext';

interface ConceptTooltipProps {
  termKey: string;
  children?: React.ReactNode;
  fallbackText?: string;
  showIcon?: boolean;
}

export function ConceptTooltip({
  termKey,
  children,
  fallbackText,
  showIcon = true
}: ConceptTooltipProps) {
  const { glossaryTooltipMode } = useTabContext();
  const [isOpen, setIsOpen] = useState(false);

  const termData: GlossaryTerm | undefined = GLOSSARY_TERMS[termKey.toLowerCase()];

  // Wenn der Modus deaktiviert ist oder der Begriff nicht im Glossar steht, rendern wir normalen Text
  if (!glossaryTooltipMode || !termData) {
    return <span>{children || fallbackText || termKey}</span>;
  }

  return (
    <span className="relative inline-flex items-baseline group/concept">
      <span
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="cursor-help font-medium text-text-main border-b border-dotted border-shiraz/80 hover:text-shiraz hover:border-shiraz transition-colors inline-flex items-center gap-0.5"
        title="Fachbegriff-Erklärung anzeigen"
      >
        {children || fallbackText || termData.term}
        {showIcon && (
          <HelpCircle
            size={11}
            className="text-shiraz/70 group-hover/concept:text-shiraz inline -translate-y-0.5"
          />
        )}
      </span>

      {/* Interaktive Tooltip-Karte */}
      {isOpen && (
        <span
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-72 sm:w-80 p-3.5 bg-white text-text-main rounded-2xl shadow-xl border border-home-grau/30 text-xs block text-left animate-in fade-in duration-150"
        >
          {/* Header */}
          <span className="flex items-center justify-between pb-2 mb-2 border-b border-home-grau/20">
            <span className="font-bold text-shiraz flex items-center gap-1.5">
              <BookOpen size={13} />
              {termData.term}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-shiraz/10 text-shiraz font-semibold">
              {termData.category}
            </span>
          </span>

          {/* Definition */}
          <span className="font-semibold block text-slate-800 leading-snug mb-1.5">
            {termData.kurzdefinition}
          </span>

          {/* Detailtext */}
          <span className="text-text-main/80 text-[11px] leading-relaxed block mb-2">
            {termData.details}
          </span>

          {/* Formel (falls vorhanden) */}
          {termData.formel && (
            <span className="block p-2 bg-off-white rounded-lg border border-home-grau/20 my-2 text-center overflow-x-auto font-mono text-[11px]">
              <InlineMath math={termData.formel} />
            </span>
          )}

          {/* Normativer Nachweis */}
          {termData.norm && (
            <span className="pt-2 border-t border-home-grau/15 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={11} className="text-emerald-600" />
                Normative Fundstelle:
              </span>
              <span className="font-mono font-medium text-slate-700">{termData.norm}</span>
            </span>
          )}

          {/* Pfeil nach unten */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white"></span>
        </span>
      )}
    </span>
  );
}
