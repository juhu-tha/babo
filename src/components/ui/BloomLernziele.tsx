import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, ChevronDown, ChevronUp, Award, BookOpen, Layers, Calculator, ShieldCheck } from 'lucide-react';
import { getBloomCompleted, setBloomCompleted } from '@/src/utils/studyStorage';

export interface BloomGoalItem {
  level: 'wissen' | 'verstehen' | 'anwenden' | 'bewerten';
  levelLabel: string;
  verb: string;
  description: string;
}

export interface BloomLernzieleProps {
  moduleId: string;
  moduleTitle: string;
  studyLevel?: 'Bachelor Basis (1.-2. Semester)' | 'Vertiefung (3.-4. Semester)' | 'Master & Praxis (5.+ Semester)';
  /** nicht mehr angezeigt (Entscheidung 30.10.2026) */
  timeMinutes?: number;
  ects?: number;
  goals?: BloomGoalItem[];
}

const DEFAULT_GOALS: Record<string, BloomGoalItem[]> = {
  default: [
    {
      level: 'wissen',
      levelLabel: '1. Wissen & Definieren',
      verb: 'Definieren & Nennen',
      description: 'Grundlegende Werkstoffkennwerte, Normen und Materialbezeichnungen normgerecht benennen und zuordnen.'
    },
    {
      level: 'verstehen',
      levelLabel: '2. Verstehen & Einordnen',
      verb: 'Erklären & Illustrieren',
      description: 'Physikalische und chemische Wirkmechanismen sowie Mikrostruktur-Zusammenhänge physikalisch begründen.'
    },
    {
      level: 'anwenden',
      levelLabel: '3. Anwenden & Berechnen',
      verb: 'Berechnen & Nachweisen',
      description: 'Kenngrößen ermitteln, Mischungs- oder Bemessungsformeln korrekt auf konkrete Fallbeispiele anwenden.'
    },
    {
      level: 'bewerten',
      levelLabel: '4. Analysieren & Bewerten',
      verb: 'Beurteilen & Optimieren',
      description: 'Schadensrisiken, Dauerhaftigkeit, Zirkularität und ökologische Kennwerte kritisch gegeneinander abwägen.'
    }
  ]
};

const LEVEL_ICONS = {
  wissen: BookOpen,
  verstehen: Layers,
  anwenden: Calculator,
  bewerten: ShieldCheck
};

const LEVEL_COLORS = {
  wissen: 'text-slate-800 bg-slate-100 border-slate-200',
  verstehen: 'text-slate-800 bg-slate-100 border-slate-200',
  anwenden: 'text-slate-800 bg-slate-100 border-slate-200',
  bewerten: 'text-shiraz bg-shiraz/5 border-shiraz/20'
};

export const BloomLernziele: React.FC<BloomLernzieleProps> = ({
  moduleId,
  moduleTitle,
  studyLevel = 'Bachelor Basis (1.-2. Semester)',
  ects,
  goals
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setIsCompleted(getBloomCompleted(moduleId));
  }, [moduleId]);

  const handleToggleComplete = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    setBloomCompleted(moduleId, nextState);
  };

  const activeGoals = goals && goals.length > 0 ? goals : DEFAULT_GOALS.default;

  return (
    <div className="bg-white rounded-2xl border border-home-grau/30 shadow-xs overflow-hidden transition-all duration-200 mb-6">
      {/* Header bar */}
      <div 
        className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-off-white/80 transition-colors select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-shiraz/10 text-shiraz flex items-center justify-center flex-shrink-0">
            <Target size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-shiraz">
                Kompetenzziele nach Bloom
              </span>
              <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                {studyLevel}
              </span>
            </div>
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
              Lernziele: {moduleTitle}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-text-main/70">
            {ects && (
              <span className="flex items-center gap-1">
                <Award size={13} className="text-home-grau" /> {formatDeWert(ects)} ECTS
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleComplete();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isCompleted 
                ? 'bg-shiraz text-white border-shiraz shadow-xs' 
                : 'bg-white text-text-main/70 border-home-grau/30 hover:border-shiraz hover:text-shiraz'
            }`}
            title="Klicken, um den Lernfortschritt für dieses Modul lokal zu speichern"
          >
            <CheckCircle2 size={14} className={isCompleted ? 'text-white' : 'text-slate-400'} />
            <span>{isCompleted ? 'Gelernt ✓' : 'Als gelernt markieren'}</span>
          </button>

          <span className="text-home-grau p-1">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        </div>
      </div>

      {/* Expandable Goals Body */}
      {isOpen && (
        <div className="p-5 border-t border-home-grau/20 bg-slate-50/40 animate-in fade-in duration-200">
          <p className="text-xs text-text-main/70 mb-4 leading-relaxed">
            Dieses Modul orientiert sich an der didaktischen Lernzieltaxonomie nach <em>Bloom & Anderson/Krathwohl</em>.
            Nach Bearbeitung der Inhalte können Studierende folgende Kompetenzen eigenständig anwenden:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeGoals.map((g, idx) => {
              const Icon = LEVEL_ICONS[g.level] || BookOpen;
              const colorClasses = LEVEL_COLORS[g.level] || 'text-slate-700 bg-slate-50 border-slate-200';
              return (
                <div 
                  key={idx} 
                  className="bg-white p-3.5 rounded-xl border border-home-grau/30 shadow-2xs flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colorClasses}`}>
                      {g.levelLabel}
                    </span>
                    <Icon size={14} className="text-home-grau" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-text-main block mb-1">
                      {g.verb}:
                    </span>
                    <p className="text-xs text-text-main/80 leading-relaxed">
                      {g.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-home-grau/20 flex flex-wrap items-center justify-between text-[11px] text-text-main/60">
            <span>Didaktischer Standard: Fakultät für Architektur und Bauwesen (THA)</span>
            <span>Prüfungsrelevant für Bachelor-/Master-Modulprüfungen</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloomLernziele;
