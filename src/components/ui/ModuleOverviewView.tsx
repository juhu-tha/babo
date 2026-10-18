import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Activity, 
  Compass, 
  Lightbulb, 
  FileText, 
  ShieldCheck, 
  GitMerge, 
  Network,
  Scale,
  FlaskConical,
  Microscope,
  Mountain,
  Package,
  Droplets,
  Trees,
  Calculator,
  Thermometer,
  Leaf,
  Monitor,
  Building2,
  Trash2,
  AlertTriangle,
  Wrench,
  HardHat,
  Cpu,
  Flame,
  Volume2,
  TrendingDown,
  Box,
  Award
} from 'lucide-react';
import { InlineMath } from 'react-katex';
import { MODULE_OVERVIEWS, ModuleOverviewData, OverviewStep } from '@/src/data/moduleOverviewsData';

interface ModuleOverviewViewProps {
  groupKey: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FlaskConical,
  Layers,
  Scale,
  ShieldCheck,
  Microscope,
  Wrench,
  Activity,
  Calculator,
  Mountain,
  Trees,
  Package,
  FileText,
  CheckCircle2,
  Droplets,
  Flame,
  Award,
  TrendingDown,
  Compass,
  Thermometer,
  Volume2,
  Leaf,
  Trash2,
  Sparkles,
  Monitor,
  Cpu,
  HardHat,
  Building2,
  AlertTriangle,
  Box,
  Network
};

export default function ModuleOverviewView({ groupKey }: ModuleOverviewViewProps) {
  const normalizedKey = groupKey.toLowerCase().replace('_info', '');
  const data: ModuleOverviewData | undefined = MODULE_OVERVIEWS[normalizedKey];
  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(0);

  if (!data) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-home-grau/30 dark:border-slate-800 text-center space-y-3">
        <Compass className="w-10 h-10 text-shiraz mx-auto opacity-80" />
        <h3 className="text-base font-bold text-text-main dark:text-slate-100">Überblick in Vorbereitung</h3>
        <p className="text-xs text-text-main/70 dark:text-slate-400 max-w-md mx-auto">
          Der systematische Überblick für das Modul <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-shiraz">{normalizedKey}</code> wird aktuell redaktionell finalisiert.
        </p>
      </div>
    );
  }

  const activeStep: OverviewStep = data.steps[selectedStepIdx] || data.steps[0];
  const ActiveIcon = ICON_MAP[activeStep.iconName] || Layers;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. HERO / LEITFRAGE BOX */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-shiraz/10 text-shiraz border border-shiraz/20">
            <Compass size={14} className="text-shiraz" />
            Themen-Überblick &amp; Leitprinzipien
          </div>
          <span className="text-[11px] text-text-main/60 font-medium">
            Systemische Gesamtschau • Fachgebiet {data.title}
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-shiraz block font-bold">
            Zentrale Leitfrage:
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-text-main leading-snug">
            „{data.leitfrage}“
          </h3>
          <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed pt-1">
            {data.systemicExplanation}
          </p>
        </div>
      </div>

      {/* 2. TEXTFORM: DIE FUNDAMENTALEN GRUNDPRINZIPIEN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-5 rounded-full bg-shiraz" />
            <h3 className="text-base font-bold text-text-main dark:text-slate-100">
              1. Fundamentale Grundprinzipien des Themas
            </h3>
          </div>
          <span className="text-[11px] text-text-main/60 dark:text-slate-400">
            Theoretisches Fundament
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.corePrinciples.map((principle, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-home-grau/30 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-3 hover:border-shiraz/40 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-shiraz/10 text-shiraz dark:text-rose-400 text-xs font-extrabold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-text-main dark:text-slate-100 leading-tight">
                    {principle.title}
                  </h4>
                </div>
                <p className="text-xs text-text-main/80 dark:text-slate-300 leading-relaxed">
                  {principle.description}
                </p>
              </div>

              <div className="pt-2 border-t border-home-grau/20 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider mb-0.5">
                  Kern-Erkenntnis:
                </span>
                <p className="text-[11px] font-semibold text-shiraz dark:text-rose-400 leading-snug">
                  {principle.takeaway}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. GRAFISCH: DIE INTERAKTIVE PROZESS- UND SYSTEMPIPELINE */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-home-grau/30 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-home-grau/20 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-5 rounded-full bg-shiraz" />
              <h3 className="text-base font-bold text-text-main dark:text-slate-100">
                2. Grafische Prozess- und Kausalkette
              </h3>
            </div>
            <p className="text-xs text-text-main/70 dark:text-slate-400 mt-1">
              {data.graphicalPipelineDesc}
            </p>
          </div>
          <span className="text-[11px] font-mono text-shiraz dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900 shrink-0">
            {data.steps.length} Stufen-System
          </span>
        </div>

        {/* Horizontal Process Flow Pipeline (Graphisch visualisiert) */}
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {data.steps.map((st, sIdx) => {
              const StepIcon = ICON_MAP[st.iconName] || Layers;
              const isSelected = selectedStepIdx === sIdx;

              return (
                <button
                  key={st.step}
                  onClick={() => setSelectedStepIdx(sIdx)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-shiraz bg-rose-50/50 dark:bg-rose-950/30 shadow-xs ring-2 ring-shiraz/30'
                      : 'border-home-grau/30 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:bg-slate-100/70 dark:hover:bg-slate-800 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-shiraz text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      Stufe {st.step}
                    </span>
                    <StepIcon size={16} className={isSelected ? 'text-shiraz dark:text-rose-400' : 'text-slate-400'} />
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-text-main dark:text-slate-100 truncate">
                      {st.title}
                    </h5>
                    <span className="text-[10px] text-text-main/60 dark:text-slate-400 truncate block">
                      {st.subtitle}
                    </span>
                  </div>

                  {/* Little connector arrow for desktop */}
                  {sIdx < data.steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-400 pointer-events-none">
                      →
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Step Detail Inspector Card */}
        <div className="bg-slate-50/80 dark:bg-slate-850 border border-home-grau/30 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-shiraz text-white shadow-xs">
                <ActiveIcon size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-shiraz dark:text-rose-400 uppercase tracking-wider block">
                  Detailfokus Stufe {activeStep.step}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-text-main dark:text-slate-100">
                  {activeStep.title} — {activeStep.subtitle}
                </h4>
              </div>
            </div>

            {activeStep.normOrFormula && (
              <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-home-grau/30 dark:border-slate-700 text-xs font-mono font-bold text-text-main dark:text-slate-200 shrink-0">
                <span>Norm / Formel:</span>
                {activeStep.normOrFormula.includes('\\') ? (
                  <InlineMath math={activeStep.normOrFormula} />
                ) : (
                  <span>{activeStep.normOrFormula}</span>
                )}
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-text-main/80 dark:text-slate-300 leading-relaxed">
            {activeStep.desc}
          </p>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Zentrale Kennwerte &amp; Mechanismen:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeStep.keyFacts.map((fact, fIdx) => (
                <span 
                  key={fIdx}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 border border-home-grau/20 dark:border-slate-700 text-text-main/90 dark:text-slate-200 shadow-2xs flex items-center gap-1.5"
                >
                  <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                  {fact}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4. WECHSELWIRKUNGEN / INTERCONNECTIONS MATRIX */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold text-text-main dark:text-slate-200 flex items-center gap-2">
            <Network size={14} className="text-shiraz" />
            Systemische Zusammenhänge &amp; Kausalitätsketten:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {data.interconnections.map((conn, cIdx) => (
              <div 
                key={cIdx}
                className="p-3.5 rounded-xl border border-home-grau/25 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-shiraz dark:text-rose-400">
                  <span className="flex items-center gap-1">
                    {conn.from} <ArrowRight size={12} /> {conn.to}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {conn.relation}
                  </span>
                </div>
                <p className="text-[11px] text-text-main/80 dark:text-slate-300 leading-relaxed">
                  {conn.causeEffect}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. TEXTLICHE SYNTHESE & DER ROTE FADEN */}
      <div className="bg-gradient-to-r from-amber-50/60 to-orange-50/40 dark:from-amber-950/20 dark:to-orange-950/10 p-5 sm:p-6 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300">
          <Lightbulb size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
          <h4 className="text-sm font-bold">
            {data.practicalInsight.title}
          </h4>
        </div>
        <p className="text-xs sm:text-sm text-amber-950/80 dark:text-amber-200/90 leading-relaxed">
          {data.practicalInsight.desc}
        </p>
        <p className="text-xs text-text-main/70 dark:text-slate-400 pt-2 border-t border-amber-200/40 dark:border-amber-900/30">
          {data.zusammenhaengeText}
        </p>
      </div>

    </div>
  );
}
