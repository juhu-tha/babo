import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Lightbulb, BookOpen, Search, Tags, GraduationCap, Trophy, ClipboardCheck, ArrowRight, Calculator } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { useTabContext } from '@/src/contexts/TabContext';
import { BloomLernziele } from '@/src/components/ui/BloomLernziele';
import { KlausurSimulator } from '@/src/components/klausur/KlausurSimulator';
import { InteractiveQuizSystem } from '@/src/components/quiz/InteractiveQuizSystem';
import { DynamischerAufgabenGenerator } from '@/src/components/trainer/DynamischerAufgabenGenerator';
import { SchadensforensikSimulator } from '@/src/components/forensik/SchadensforensikSimulator';
import { taskCategories } from '../data/aufgabenData';

const TAB_TO_QUIZ_CONFIG: Record<string, { cluster: 'I' | 'II' | 'III' | 'IV' | 'V'; moduleId?: string; label: string }> = {
  aufgaben_beton: { cluster: 'III', moduleId: 'beton', label: 'Betontechnologie' },
  aufgaben_stahlbeton: { cluster: 'III', moduleId: 'stahlbeton', label: 'Massivbau' },
  aufgaben_holzbau: { cluster: 'I', moduleId: 'holz', label: 'Holzbau' },
  aufgaben_weitere: { cluster: 'I', moduleId: 'baustoffe', label: 'Baustoffe' },
  aufgaben_bauprodukte: { cluster: 'II', moduleId: 'bauprodukte', label: 'Bauprodukte & Baurecht' },
  aufgaben_mechanik: { cluster: 'IV', moduleId: 'mechanik', label: 'Mechanik' },
  aufgaben_bauphysik: { cluster: 'V', moduleId: 'bauphysik', label: 'Bauphysik' },
  aufgaben_nachhaltigkeit: { cluster: 'V', moduleId: 'nachhaltigkeit', label: 'Nachhaltigkeit' },
  aufgaben_bestand: { cluster: 'II', moduleId: 'bestand', label: 'Bauen im Bestand' },
  aufgaben_dauerhaftigkeit: { cluster: 'II', moduleId: 'dauerhaftigkeit', label: 'Dauerhaftigkeit & Schäden' },
  aufgaben_rueckbau: { cluster: 'V', moduleId: 'rueckbau', label: 'Rückbau & Schadstoffe' },
  aufgaben_kennwerte: { cluster: 'I', moduleId: 'labor', label: 'Labor & Grundlagen' },
  aufgaben_digitales: { cluster: 'IV', moduleId: 'digitales', label: 'Digitales, BIM & KI' },
  aufgaben_komplex: { cluster: 'III', moduleId: 'komplex', label: 'Komplexe Fallstudien' },
  aufgaben_quiz: { cluster: 'III', label: 'Wissenscheck & Wissenslücken' }
};

export default function Aufgaben() {
  const { activeTab, setActiveTab } = useTabContext();
  const quizConfig = TAB_TO_QUIZ_CONFIG[activeTab] || { cluster: 'III', label: 'Betontechnologie' };

  const [mode, setMode] = useState<'exercises' | 'trainer' | 'forensik' | 'quizzes' | 'klausur'>(() => {
    if (activeTab === 'aufgaben_klausur') return 'klausur';
    if (activeTab === 'aufgaben_quiz') return 'quizzes';
    if (activeTab === 'aufgaben_trainer') return 'trainer';
    if (activeTab === 'aufgaben_komplex') return 'forensik';
    return 'exercises';
  });
  const [openTasks, setOpenTasks] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Alle' | 'Leicht' | 'Mittel' | 'Schwer'>('Alle');

  // Auto-switch to klausur or quiz or forensik or trainer if navigated via tab
  useEffect(() => {
    if (activeTab === 'aufgaben_klausur') {
      setMode('klausur');
    } else if (activeTab === 'aufgaben_quiz') {
      setMode('quizzes');
    } else if (activeTab === 'aufgaben_trainer') {
      setMode('trainer');
    } else if (activeTab === 'aufgaben_komplex') {
      setMode('forensik');
    }
  }, [activeTab]);

  const toggleTask = (id: string) => {
    setOpenTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allIds = filteredCategories.flatMap(c => c.tasks.map(t => t.id));
    const newOpenState: Record<string, boolean> = {};
    allIds.forEach(id => { newOpenState[id] = true; });
    setOpenTasks(newOpenState);
  };

  const collapseAll = () => {
    setOpenTasks({});
  };

  const filteredCategories = useMemo(() => {
    let baseCategories = taskCategories;
    
    if (!searchTerm.trim() && activeTab.startsWith('aufgaben_') && activeTab !== 'aufgaben_info') {
      const activeCategory = taskCategories.find(c => c.id === activeTab);
      if (activeCategory) {
        baseCategories = [activeCategory];
      }
    }

    const lowerSearch = searchTerm.trim().toLowerCase();
    
    return baseCategories.map(category => {
      const matchingTasks = category.tasks.filter(task => {
        // Search term check
        const matchesSearch = !lowerSearch || 
          task.title.toLowerCase().includes(lowerSearch) || 
          (typeof task.question === 'string' && task.question.toLowerCase().includes(lowerSearch));
          
        // Difficulty check
        const matchesDifficulty = selectedDifficulty === 'Alle' || task.difficulty === selectedDifficulty;
        
        return matchesSearch && matchesDifficulty;
      });
      return { ...category, tasks: matchingTasks };
    }).filter(category => category.tasks.length > 0);
  }, [searchTerm, activeTab, selectedDifficulty]);

  return (
    <div className="flex flex-col gap-8">
      {/* Central Mode Switcher */}
      <div className="flex flex-wrap sm:flex-nowrap bg-white p-1.5 rounded-2xl border border-home-grau/30 max-w-4xl mx-auto w-full shadow-xs gap-1">
        <button
          onClick={() => setMode('exercises')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            mode === 'exercises'
              ? 'bg-shiraz text-white shadow-xs'
              : 'text-text-main/70 hover:text-text-main hover:bg-slate-50'
          }`}
        >
          <ClipboardCheck size={16} />
          <span>Übungen</span>
        </button>
        <button
          onClick={() => setMode('trainer')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            mode === 'trainer'
              ? 'bg-shiraz text-white shadow-xs'
              : 'text-text-main/70 hover:text-text-main hover:bg-slate-50'
          }`}
        >
          <Calculator size={16} />
          <span>Prüfungs-Trainer</span>
        </button>
        <button
          onClick={() => setMode('forensik')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            mode === 'forensik'
              ? 'bg-shiraz text-white shadow-xs'
              : 'text-text-main/70 hover:text-text-main hover:bg-slate-50'
          }`}
        >
          <Search size={16} />
          <span>Bauforensik</span>
        </button>
        <button
          onClick={() => setMode('quizzes')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            mode === 'quizzes'
              ? 'bg-shiraz text-white shadow-xs'
              : 'text-text-main/70 hover:text-text-main hover:bg-slate-50'
          }`}
        >
          <GraduationCap size={16} />
          <span>Fach-Quizze</span>
        </button>
        <button
          onClick={() => setMode('klausur')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            mode === 'klausur'
              ? 'bg-shiraz text-white shadow-xs'
              : 'text-text-main/70 hover:text-text-main hover:bg-slate-50'
          }`}
        >
          <Trophy size={16} />
          <span>Klausur</span>
        </button>
      </div>

      {mode === 'klausur' ? (
        <KlausurSimulator />
      ) : mode === 'quizzes' ? (
        <InteractiveQuizSystem 
          initialScope={activeTab === 'aufgaben_quiz' ? 'diagnose_15' : 'cluster'}
          initialCluster={quizConfig.cluster}
          initialModuleId={quizConfig.moduleId}
        />
      ) : mode === 'trainer' ? (
        <DynamischerAufgabenGenerator />
      ) : mode === 'forensik' ? (
        <SchadensforensikSimulator />
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          {/* Action Card: Switch to Interactive Quiz for this topic (P26) */}
          <div className="bg-gradient-to-r from-shiraz/10 via-shiraz/5 to-transparent p-4 sm:p-5 rounded-2xl border border-shiraz/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 bg-shiraz text-white rounded-xl shadow-xs shrink-0">
                <GraduationCap size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-text-main">
                  Fach-Quiz &amp; Wissenscheck: {quizConfig.label} (Cluster {quizConfig.cluster})
                </h4>
                <p className="text-xs text-text-main/70 mt-0.5">
                  Prüfen Sie Ihr Verständnis mit didaktisch geprüften Multiple-Choice-Fragen und automatischer Wissenslücken-Analyse.
                </p>
              </div>
            </div>
            <button
              onClick={() => setMode('quizzes')}
              className="px-4 py-2.5 bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <span>Fach-Quiz starten</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Bloom Learning Objectives */}
          <BloomLernziele 
            moduleId="aufgaben_uebungen" 
            moduleTitle="Übungsaufgaben, Bemessungsnachweise & Fallstudien" 
            studyLevel="Bachelor Basis (1.-2. Semester)" 
            timeMinutes={60} 
            ects={5} 
          />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-shiraz/10 rounded-2xl text-shiraz col">
                  <BookOpen size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-main">
                    {searchTerm ? 'Suchergebnisse: Übungsaufgaben' : (filteredCategories.length === 1 && !searchTerm ? `Übungsaufgaben: ${filteredCategories[0].name}` : 'Übungsaufgaben & Fallstudien')}
                  </h2>
                  <p className="text-xs text-text-main/60 pt-0.5">Praxisbezogene Rechenbeispiele, Nachweise und Klausuraufgaben.</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-home-grau">
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Aufgaben durchsuchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-off-white border border-home-grau/30 rounded-xl focus:outline-none focus:border-shiraz focus:ring-1 focus:ring-shiraz transition-all text-sm"
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button onClick={expandAll} className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-shiraz bg-shiraz/5 hover:bg-shiraz/10 border border-shiraz/10 rounded-lg transition-colors">
                    Alle aufklappen
                  </button>
                  <button onClick={collapseAll} className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-text-main/60 bg-off-white hover:bg-home-grau/20 border border-home-grau/30 rounded-lg transition-colors">
                    Alle zuklappen
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 items-center pt-2">
                <span className="text-[11px] font-bold text-text-main/50 uppercase tracking-wider mr-2">Schwierigkeitsgrad:</span>
                {(['Alle', 'Leicht', 'Mittel', 'Schwer'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      selectedDifficulty === diff
                        ? diff === 'Leicht' ? 'bg-green-100 text-green-800 border-green-300' :
                          diff === 'Mittel' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                          diff === 'Schwer' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                          'bg-shiraz text-white border-shiraz'
                        : 'bg-off-white text-text-main/60 hover:text-text-main hover:bg-home-grau/10 border-home-grau/30'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-10 mt-4">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-10 bg-off-white rounded-2xl border border-home-grau/30">
                  <p className="text-text-main/60">Keine Aufgaben gefunden für "{searchTerm}"</p>
                </div>
              ) : (
                filteredCategories.map((category, catIdx) => (
                  <div key={catIdx} className="flex flex-col gap-5">
                    <div className="flex items-center gap-2">
                      <Tags size={16} className="text-shiraz opacity-80" />
                      <h3 className="text-lg font-bold text-text-main uppercase tracking-widest">
                        {category.name}
                      </h3>
                      <div className="ml-2 px-2 py-0.5 bg-home-grau/10 text-text-main/60 rounded-full text-xs font-bold">
                        {category.tasks.length}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {category.tasks.map((task) => (
                        <div key={task.id} className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md ${openTasks[task.id] ? 'border-shiraz/30 ring-1 ring-shiraz/10' : 'border-home-grau/30'}`}>
                          <div 
                            className="p-5 sm:p-6 cursor-pointer flex justify-between items-start gap-4 group"
                            onClick={() => toggleTask(task.id)}
                          >
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                  <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${openTasks[task.id] ? 'bg-shiraz/10 text-shiraz' : 'bg-off-white text-home-grau group-hover:text-shiraz'}`}>
                                    <HelpCircle size={18} />
                                  </div>
                                  <div className="space-y-1">
                                    <h4 className="font-bold text-text-main text-base pt-1 group-hover:text-shiraz transition-colors">{task.title}</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {task.difficulty && (
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase ${
                                          task.difficulty === 'Leicht' ? 'bg-green-50 text-green-700 border-green-200' :
                                          task.difficulty === 'Mittel' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                          'bg-rose-50 text-rose-700 border-rose-200'
                                        }`}>
                                          {task.difficulty}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-sm text-text-main/80 leading-relaxed pl-11">
                                {typeof task.question === 'string' ? <FormulaText text={task.question} /> : task.question}
                              </div>
                              
                              <div className="mt-4 pl-11 pt-2 flex flex-wrap items-center gap-2">
                                {Array.isArray(task.moduleHint) ? (
                                  task.moduleHint.map((hint, idx) => (
                                    <button
                                      key={idx}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveTab(hint.id);
                                      }}
                                      className="text-[11px] font-bold text-shiraz bg-shiraz/5 hover:bg-shiraz/10 px-3 py-1.5 rounded-lg border border-shiraz/10 transition-colors inline-flex items-center gap-1.5"
                                    >
                                      <BookOpen size={12} /> Modul: {hint.name}
                                    </button>
                                  ))
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveTab((task.moduleHint as any).id);
                                    }}
                                    className="text-[11px] font-bold text-shiraz bg-shiraz/5 hover:bg-shiraz/10 px-3 py-1.5 rounded-lg border border-shiraz/10 transition-colors inline-flex items-center gap-1.5"
                                  >
                                    <BookOpen size={12} /> Modul: {(task.moduleHint as any).name}
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className={`p-2 rounded-full shrink-0 mt-1 transition-colors ${openTasks[task.id] ? 'bg-shiraz/10 text-shiraz' : 'text-home-grau group-hover:bg-off-white'}`}>
                              {openTasks[task.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                          </div>
                          
                          {openTasks[task.id] && (
                            <div className="p-5 sm:p-6 bg-shiraz/5 border-t border-shiraz/10 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10"></div>
                              <div className="flex items-start gap-4 relative z-10">
                                <div className="p-2 bg-white rounded-xl shadow-sm border border-shiraz/10 text-shiraz shrink-0">
                                  <Lightbulb size={20} />
                                </div>
                                <div className="flex-1 pt-1">
                                  <h5 className="text-xs font-bold text-shiraz uppercase tracking-widest mb-2">Lösung & Erklärung</h5>
                                  <div className="text-sm text-text-main/90 leading-relaxed font-medium">
                                    {typeof task.solution === 'string' ? <FormulaText text={task.solution} /> : task.solution}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      <ModuleFooter 
        wikipedia={[
          { title: 'Übungsaufgabe' },
          { title: 'Klausur', url: 'https://de.wikipedia.org/wiki/Klausur_(Pr%C3%BCfung)' }
        ]}
        literatur={[
        ]}
        regelwerke={[
          { title: 'Rahmenprüfungsordnung für Ingenieurstudiengänge (APO)', url: 'https://www.tha.de/' },
          { title: 'DIN EN Normenreihe Baustoffe und Konstruktiver Ingenieurbau' }
        ]}
        formeln={[
          {
            formel: '\\text{Note} = 1{,}0 + 3{,}0 \\cdot \\left(1 - \\frac{P_{\\text{erreicht}} - P_{\\text{bestehen}}}{P_{\\text{max}} - P_{\\text{bestehen}}}\\right)',
            erklaerung: 'Lineare Notenberechnungsskala für akademische Klausuren und Übungsaufgaben im Bauingenieurwesen mit 50 % Bestehensgrenze.',
            quelle: 'Allgemeine Prüfungsordnung'
          },
          {
            formel: 'w/z = \\frac{m_w}{m_z} \\quad \\text{und} \\quad \\rho_c = \\frac{m_{\\text{dry}}}{V_{\\text{geom}}}',
            erklaerung: 'Grundlegende bauchemische und physikalische Berechnungsgleichungen zur Prüfungsvorbereitung.',
            quelle: 'Wendehorst Baustoffkunde'
          }
        ]}
      />
    </div>
  );
}
