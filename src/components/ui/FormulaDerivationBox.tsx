import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { useTabContext } from '@/src/contexts/TabContext';

export interface DerivationStep {
  titel: string;
  erklaerung: string;
  formel?: string;
  einheit?: string;
}

interface FormulaDerivationBoxProps {
  title: string;
  zielGleichung: string;
  schritte: DerivationStep[];
  ergebnisHinweis?: string;
  normQuelle?: string;
  defaultExpanded?: boolean;
}

export function FormulaDerivationBox({
  title,
  zielGleichung,
  schritte,
  ergebnisHinweis,
  normQuelle,
  defaultExpanded = false
}: FormulaDerivationBoxProps) {
  const { formulaDerivationMode } = useTabContext();
  const [localExpanded, setLocalExpanded] = useState<boolean>(defaultExpanded);

  // Ist global aktiviert oder lokal aufgeklappt
  const isExpanded = formulaDerivationMode || localExpanded;

  return (
    <div className="bg-white rounded-2xl border border-home-grau/30 shadow-xs overflow-hidden transition-all my-3">
      {/* Header mit Aufklapp-Trigger */}
      <button
        type="button"
        onClick={() => setLocalExpanded(!localExpanded)}
        className="w-full p-4 text-left flex items-center justify-between gap-3 bg-off-white hover:bg-slate-100/70 transition-colors cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-shiraz/10 text-shiraz shrink-0">
            <Calculator size={16} />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-text-main truncate">
                {title}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-shiraz text-white">
                Herleitung
              </span>
            </div>
            <div className="text-[11px] text-text-main/70 font-mono mt-0.5 overflow-x-auto">
              <InlineMath math={zielGleichung} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-semibold text-shiraz hidden sm:inline">
            {isExpanded ? 'Herleitung verbergen' : 'Rechenweg aufklappen'}
          </span>
          <div className="p-1.5 rounded-lg border border-home-grau/25 text-slate-500 bg-white">
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      </button>

      {/* Aufklappbarer Schritt-für-Schritt-Rechenweg */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4 border-t border-home-grau/20 animate-in fade-in duration-200">
          <div className="text-xs text-text-main/80 leading-relaxed bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
            <strong>Didaktischer Nachweis:</strong> Nachfolgend wird der vollständige analytische Rechenweg schrittweise dargelegt, um das Zustandekommen des Rechenergebnisses transparent nachvollziehen zu können.
          </div>

          <div className="space-y-3">
            {schritte.map((schritt, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-home-grau/20 bg-gradient-to-r from-white to-off-white/50 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-shiraz/10 text-shiraz text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-text-main">
                      {schritt.titel}
                    </span>
                  </div>
                  {schritt.einheit && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                      Einheit: {schritt.einheit}
                    </span>
                  )}
                </div>

                <p className="text-xs text-text-main/80 leading-relaxed pl-7">
                  {schritt.erklaerung}
                </p>

                {schritt.formel && (
                  <div className="ml-7 p-2 bg-white rounded-lg border border-home-grau/15 font-mono text-xs overflow-x-auto text-center shadow-2xs">
                    <BlockMath math={schritt.formel} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Fußzeile mit Normenbezug & Fazit */}
          {(ergebnisHinweis || normQuelle) && (
            <div className="pt-3 border-t border-home-grau/20 flex flex-wrap items-center justify-between gap-2 text-xs text-text-main/70">
              {normQuelle && (
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  Regelwerk: <strong className="text-slate-800">{normQuelle}</strong>
                </span>
              )}
              {ergebnisHinweis && (
                <span className="italic text-[11px] text-text-main/80">
                  {ergebnisHinweis}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
