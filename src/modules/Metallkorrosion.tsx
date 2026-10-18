import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ShieldAlert, Droplets, ShieldCheck, Zap, ArrowRight, BookOpen, Layers, CheckCircle2, XCircle, AlertTriangle, Sparkles, Clock, Scale, Info } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { motion } from 'framer-motion';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl } from '@/src/utils/numberFormat';

function MetalThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">
          Material-Lehrpfad: Metalle im Bauwesen
        </h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5">
          Wechseln Sie nahtlos zwischen den drei Säulen der Baustofflehre (Basis, Anwendung und Alterung):
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('metalle')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span>1. Baustoff-Kennwerte</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Physikalische Eigenschaften, Schmelzpunkt & Legierungen der Metalle.
          </span>
          {current !== 'baustoff' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_metallisch')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span>2. Mechanik & Praxis</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Plattenrechner, Kontaktkorrosions-Prüfung & Lieferantenlisten der BauPVO.
          </span>
          {current !== 'bauprodukt' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={() => setActiveTab('metallkorrosion')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span>3. Dauerhaftigkeit</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Galvanische Zellen, Korrosionsarten & Schutz nach DIN EN ISO 12944.
          </span>
          {current !== 'dauerhaftigkeit' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

import { DeckschichtenVergleich } from '@/src/components/korrosion/DeckschichtenVergleich';

export default function Metallkorrosion() {
  const { activeTab, setActiveTab } = useTabContext();
  const [activeSection, setActiveSection] = React.useState<'simulation' | 'deckschichten' | 'arten' | 'schutz'>('simulation');
  const [env, setEnv] = React.useState<'dry' | 'moist' | 'wet' | 'salty'>('wet');
  const [rustThickness, setRustThickness] = React.useState<number>(15);
  const [anodeErosion, setAnodeErosion] = React.useState<number>(10);

  React.useEffect(() => {
    if (env === 'dry') return;
    
    let speed = 0.5;
    if (env === 'moist') speed = 0.12;
    if (env === 'wet') speed = 0.45;
    if (env === 'salty') speed = 1.5;
    
    const interval = setInterval(() => {
      setRustThickness(prev => Math.min(100, prev + speed));
      setAnodeErosion(prev => Math.min(45, prev + speed * 0.4));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [env]);

  const clipPath = `polygon(0% 0%, 100% 0%, ${100 - anodeErosion / 2}% ${anodeErosion / 3}%, ${100 - anodeErosion}% 50%, 100% 100%, 0% 100%)`;
  const electronSpeed = env === 'salty' ? 1.0 : env === 'wet' ? 2.5 : env === 'moist' ? 5.0 : 0;

  const envInfo = {
    dry: {
      title: 'Trocken (keine Korrosion)',
      desc: 'Ohne flüssigen Elektrolyten (Wasserfilm) ist der elektrische Stromkreis vollständig unterbrochen. Es findet trotz Anwesenheit von Sauerstoff keine messbare Korrosion statt.',
      color: 'border-home-grau/30 text-slate-700 bg-slate-50'
    },
    moist: {
      title: 'Feuchte Luft (langsam)',
      desc: 'Ein winziger, meist unsichtbarer Kondensatfilm (z. B. durch hohe Luftfeuchtigkeit bzw. Taupunktunterschreitung) auf der Oberfläche dient als schwacher Elektrolyt. Die Korrosion schreitet langsam voran.',
      color: 'border-home-grau/30 text-slate-750 bg-slate-50/50'
    },
    wet: {
      title: 'Nass / Regen (aktiv)',
      desc: 'Ein durchgehender, stabile Wasserfilm bildet einen hervorragenden Elektrolyten. Ionen diffundieren ungehindert, die galvanische Rostzelle läuft unter Sauerstoffverbrauch auf Hochtouren.',
      color: 'border-home-grau/30 text-slate-800 bg-slate-100'
    },
    salty: {
      title: 'Salzhaltig / Chloride + (sehr rasant)',
      desc: 'Chloride (z.B. aus Tausalz oder Meerluft) zerstören unvollständige Passivschutzschichten und erhöhen die Leitfähigkeit des Elektrolyten massiv. Es kommt zu rasantem Rosten und lokalem Lochfraß!',
      color: 'border-shiraz/35 text-shiraz bg-rose-50/40'
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-wrap gap-2 border-b border-home-grau/20 pb-4 mb-6">
          <button
            onClick={() => setActiveSection('simulation')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeSection === 'simulation'
                ? 'bg-shiraz border-shiraz text-white shadow-md'
                : 'bg-white hover:bg-off-white border-home-grau/30 text-text-main'
            }`}
          >
            <Zap size={14} />
            <span>Grundlagen & Simulation</span>
          </button>
          <button
            onClick={() => setActiveSection('deckschichten')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeSection === 'deckschichten'
                ? 'bg-shiraz border-shiraz text-white shadow-md'
                : 'bg-white hover:bg-off-white border-home-grau/30 text-text-main'
            }`}
          >
            <Layers size={14} />
            <span>Deckschichten & Passivierung</span>
          </button>
          <button
            onClick={() => setActiveSection('arten')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeSection === 'arten'
                ? 'bg-shiraz border-shiraz text-white shadow-md'
                : 'bg-white hover:bg-off-white border-home-grau/30 text-text-main'
            }`}
          >
            <ShieldAlert size={14} />
            <span>Korrosionsarten</span>
          </button>
          <button
            onClick={() => setActiveSection('schutz')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeSection === 'schutz'
                ? 'bg-shiraz border-shiraz text-white shadow-md'
                : 'bg-white hover:bg-off-white border-home-grau/30 text-text-main'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Korrosionsschutz (DIN EN ISO 12944)</span>
          </button>
        </div>
        <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
          <ShieldAlert className="text-shiraz" /> Korrosion und Schutz von Metallen
        </h2>
        
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          {/* DIN EN ISO 8044 Definition & Systemcharakter Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm text-text-main">
            <div className="md:col-span-2 bg-off-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-2.5">
              <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span>
                Normative Definition nach DIN EN ISO 8044
              </span>
              <p className="text-xs leading-relaxed font-normal text-slate-700">
                Unter metallischer Korrosion versteht man die <strong>physikochemische Wechselwirkung</strong> zwischen einem Metall und seiner Umgebung. Diese führt zu einer Veränderung der Eigenschaften des Metalls und kann gravierende Funktionsbeeinträchtigungen des metallischen Bauteils, der Systemumgebung oder des gesamten Tragwerks verursachen.
              </p>
              <p className="text-xs text-slate-500 italic font-medium mt-1">
                Elektrochemische Korrosion erfordert einen geschlossenen ionenleitenden (Elektrolyt) und elektronenleitenden (metallischer Kontakt) Stromkreis zwischen Anode und Kathode.
              </p>
            </div>
            
            <div className="bg-rose-50/20 p-5 rounded-xl border border-rose-200/40 flex flex-col gap-2.5">
              <span className="text-xs font-black text-shiraz uppercase tracking-wider">Der Systemcharakter</span>
              <p className="text-xs leading-relaxed text-slate-700 font-medium">
                Als Kernprinzip nach BGRCI gilt: Korrosion ist <strong>keine Werkstoffeigenschaft allein</strong>. Sie entsteht erst im Zusammenwirken eines komplexen Dreiecks:
              </p>
              <ul className="text-xs space-y-1 text-slate-650 font-bold list-disc pl-4 mt-0.5">
                <li><span className="font-medium">Werkstoff & Oberflächenzustand</span></li>
                <li><span className="font-medium">Elektrolyt & Umgebungsmedium</span></li>
                <li><span className="font-medium">Bauliche Konstruktion / Zugspannung</span></li>
              </ul>
            </div>
          </div>

          {activeSection === 'simulation' && (
            <section className="animate-in fade-in duration-300 flex flex-col gap-6">
              <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 text-sm text-text-main/80 flex flex-col gap-4">
                <h3 className="text-lg font-extrabold text-home-prim flex items-center gap-2">
                  <Zap className="w-5 h-5 text-shiraz" /> Grundlagen der elektrochemischen Korrosion
                </h3>
                <p className="font-medium text-slate-700">
                  Damit ein elektrochemischer Korrosionsprozess (Rosten) angetrieben wird, müssen drei physikalische Hauptvoraussetzungen gleichzeitig vorliegen:
                </p>
                
                {/* 3 Pillars of Electrochemistry */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1 mb-2">
                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-1.5">
                    <strong className="text-xs text-slate-900 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      1. Potenzialdifferenz (Anode / Kathode)
                    </strong>
                    <span className="text-xs text-slate-600 leading-relaxed block font-medium">
                      Zwei leitend verbundene Bereiche unterschiedlichen Standardpotenzials (<InlineMath math="E^0" />). Dies entsteht durch Kontakt unedler/edler Metalle, Gefügegrenzen, Korngrenzen, Eigenspannungen oder ungleiche Belüftung (Konzentrationszellen).
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-1.5">
                    <strong className="text-xs text-slate-900 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                      2. Elektrolyt (Ionenleiter)
                    </strong>
                    <span className="text-xs text-slate-600 leading-relaxed block font-medium">
                      Ein flüssiger Feuchtigkeitsfilm (Wasser, Regen, Schwitzwasser). Salze wie Chloride (<InlineMath math="\text{Cl}^-" />) oder saure Ablagerungen steigern die Ionenleitfähigkeit dramatisch und reduzieren den Ohmschen Widerstand des Systems.
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-1.5">
                    <strong className="text-xs text-slate-900 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      3. Kathodischer Elektronenakzeptor
                    </strong>
                    <span className="text-xs text-slate-600 leading-relaxed block font-medium">
                      Ein Reaktionspartner an der Kathode, der e⁻ aufnimmt: Gelöster <strong className="text-slate-800">Sauerstoff</strong> (Sauerstofftyp, in neutralen/alkalischen Medien) oder <strong className="text-slate-800">Hydronium-Ionen</strong> (<InlineMath math="\text{H}^+" />, Wasserstofftyp/Säuretyp in saurem Milieu).
                    </span>
                  </div>
                </div>

                <div className="my-4 bg-slate-150 p-5 sm:p-6 rounded-2xl border border-home-grau/35 shadow-inner relative overflow-hidden">
                  <h4 className="text-center font-extrabold text-slate-800 mb-4 text-sm sm:text-base flex items-center justify-center gap-2">
                    <span>Das Korrosionselement (Galvanische Zelle) - Live-Simulation</span>
                    <span className="animate-pulse flex h-2 w-2 rounded-full bg-shiraz"></span>
                  </h4>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6 md:mt-8">
                    
                    {/* Anode */}
                    <div className="flex flex-col items-center z-10">
                      <motion.div 
                        className="w-28 h-28 border-4 rounded-2xl flex items-center justify-center flex-col relative shadow-md overflow-hidden bg-gradient-to-br from-stone-50 to-stone-150"
                        animate={{ borderColor: env !== 'dry' ? ['#ef4444', '#991b1b', '#ef4444'] : '#cbd5e1' }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        style={{ clipPath: env !== 'dry' ? clipPath : undefined }}
                      >
                        <span className="font-bold text-slate-700 text-xs tracking-wide uppercase">Anode (Eisen)</span>
                        <FormulaText text={"$\\mathrm{Fe} \\rightarrow \\mathrm{Fe}^{2+} + 2\\mathrm{e}^-$"} className="text-xs text-slate-650 font-mono font-semibold mt-1.5 text-center px-1" />
                        
                        {/* Rostkruste (Rust crust) growing on anode */}
                        {env !== 'dry' && rustThickness > 0 && (
                          <motion.div
                            className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-800 via-rose-950 to-transparent pointer-events-none"
                            style={{ height: `${rustThickness * 0.45}%`, opacity: 0.35 + (rustThickness / 200) }}
                          />
                        )}
                        
                        <div className="absolute -top-1.5 -right-1.5 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow z-10 border border-white">-</div>
                        
                        {/* Floating Fe2+ ions */}
                        {env !== 'dry' && (
                          <motion.div
                            className="absolute bottom-2 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full z-20 shadow border border-red-700"
                            animate={{ 
                              y: [0, 25, 45], 
                              x: [0, 15, 30], 
                              opacity: [0, 1, 0] 
                            }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: env === 'salty' ? 1.5 : env === 'wet' ? 3.0 : 5.0, 
                              ease: 'easeOut' 
                            }}
                          >
                            Fe²⁺
                          </motion.div>
                        )}
                      </motion.div>
                      <span className="text-xs text-slate-650 mt-3 text-center font-medium leading-tight">Oxidation<br/><span className="text-red-600 font-bold">{env !== 'dry' ? 'Materialabtrag' : 'Inaktiv'}</span></span>
                    </div>

                    {/* Leitende Verbindung & Elektrolyt */}
                    <div className="flex flex-col items-center flex-1 min-w-[200px] max-w-[280px] my-4 sm:my-0">
                      {/* Elektronenfluss (Draht) */}
                      <div className="w-full relative h-7 mb-3 bg-slate-200 rounded-lg border border-home-grau/30 overflow-hidden flex items-center shadow-inner">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-400"></div>
                        <div className="absolute left-2 text-[8px] text-slate-600 font-bold uppercase tracking-wider z-10 font-semibold">Leiter (Fluss e⁻)</div>
                        
                        {env !== 'dry' && (
                          <motion.div 
                            className="absolute bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded font-mono font-bold shadow-sm flex items-center gap-0.5 whitespace-nowrap z-10 border border-amber-600"
                            animate={{ left: ['-15%', '105%'] }}
                            transition={{ repeat: Infinity, duration: electronSpeed, ease: 'linear' }}
                          >
                            <span>2e⁻</span>
                            <span className="text-xs font-bold leading-none">→</span>
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Elektrolyt */}
                      <div className="w-full h-24 bg-stone-50 rounded-xl border border-home-grau/30 flex flex-col items-center justify-center relative shadow-inner overflow-hidden mt-1 transition-all">
                         {/* Rising water body based on environment */}
                         <div 
                           className={`absolute inset-x-0 bottom-0 border-t transition-all duration-700 ${
                             env === 'dry' 
                               ? 'h-[10%] bg-amber-100/5 border-amber-200/10' 
                               : env === 'moist' 
                                 ? 'h-[40%] bg-sky-200/20 border-sky-300/30' 
                                 : env === 'salty'
                                   ? 'h-full bg-teal-100/40 border-teal-300'
                                   : 'h-full bg-sky-200/30 border-sky-300'
                           }`}
                         />

                         <motion.div 
                           className="absolute inset-x-0 bottom-0 h-1/2 bg-sky-400/10 mix-blend-multiply"
                           animate={{ y: env !== 'dry' ? [2, -2, 2] : 0 }}
                           transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                         />

                         {/* Rising Rust Sediment layer in center! */}
                         {env !== 'dry' && rustThickness > 0 && (
                           <motion.div 
                             className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-800 to-amber-900 border-t border-amber-800/20 z-10 shadow-inner"
                             style={{ height: `${Math.min(45, rustThickness * 0.4)}%` }}
                             layout
                           />
                         )}

                         {/* Interactive clean overlay inside Elektrolyt box */}
                         {env !== 'dry' && rustThickness > 12 && (
                           <div className="absolute top-1 right-1.5 flex items-center gap-1 bg-shiraz text-[8px] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse z-20 border border-shiraz/30">
                             <span>Rost-Pegel: {Math.round(rustThickness)}%</span>
                           </div>
                         )}

                         {/* Floating ions meeting in electrolyte */}
                         {env !== 'dry' && (
                          <>
                            {/* Floating Rust Particle 1 */}
                            <motion.div
                              className="absolute bg-amber-800/95 border border-amber-900 text-white text-[7px] font-bold px-1.5 py-0.5 rounded shadow-sm z-20 font-sans"
                              animate={{ 
                                x: [20, -10, 10, 20], 
                                y: [20, -15, 5, 20], 
                                scale: [1, 1.1, 0.9, 1],
                                opacity: [0.3, 0.9, 0.6, 0.3]
                              }}
                              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                            >
                              Fe(OH)₃
                            </motion.div>
                            
                            {/* Floating Rust Particle 2 */}
                            <motion.div
                              className="absolute bg-stone-700/95 text-white text-[6px] font-medium px-1.5 py-0.5 rounded shadow-sm z-20 font-sans border border-stone-800"
                              animate={{ 
                                x: [-40, 20, -10, -40], 
                                y: [-5, 15, -20, -5], 
                                opacity: [0.4, 0.8, 0.5, 0.4]
                              }}
                              transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1 }}
                            >
                              FeO(OH)
                            </motion.div>

                            {/* Floating Rust Particle 3 */}
                            <motion.div
                              className="absolute bg-amber-900/90 text-[6px] text-white font-semibold px-1 py-0.5 rounded shadow-sm z-20 font-sans"
                              animate={{ 
                                x: [40, 0, 30, 40], 
                                y: [-15, 10, -5, -15], 
                                opacity: [0.2, 0.7, 0.4, 0.2]
                              }}
                              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 2.2 }}
                            >
                              Rost-Kristalle
                            </motion.div>
                          </>
                         )}

                         {/* Chloride Icons when salty */}
                         {env === 'salty' && (
                          <>
                            <motion.div
                              className="absolute bg-emerald-500 border border-emerald-600 text-white text-xs font-extrabold px-1.5 py-0.5 rounded-full z-25 shadow-sm"
                              animate={{ 
                                x: [-50, 40, -20, -50], 
                                y: [-25, 10, -10, -25]
                              }}
                              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                            >
                              Cl⁻
                            </motion.div>
                            <motion.div
                              className="absolute bg-emerald-500 border border-emerald-600 text-white text-xs font-extrabold px-1.5 py-0.5 rounded-full z-25 shadow-sm"
                              animate={{ 
                                x: [40, -50, 10, 40], 
                                y: [20, -20, 15, 20]
                              }}
                              transition={{ repeat: Infinity, duration: 5, ease: 'linear', delay: 1.5 }}
                            >
                              Cl⁻
                            </motion.div>
                          </>
                         )}

                         <Droplets size={16} className={`text-sky-500 mb-1.5 z-10 ${env !== 'dry' ? 'animate-bounce' : 'opacity-35'}`} />
                         <span className="text-slate-800 font-bold text-xs z-20 bg-white/95 border border-home-grau/30 px-2 py-0.5 rounded shadow-xs font-semibold">
                           Elektrolyt {env === 'dry' ? '(Fehlt)' : env === 'moist' ? '(Feuchte)' : env === 'salty' ? '(Salzwasser + Cl⁻)' : '(Wasserfilm)'}
                         </span>
                      </div>
                    </div>

                    {/* Kathode */}
                    <div className="flex flex-col items-center z-10">
                      <motion.div 
                        className="w-28 h-28 bg-gradient-to-br from-slate-100 to-slate-200 border-4 rounded-2xl flex items-center justify-center flex-col relative shadow-md"
                        animate={{ borderColor: env !== 'dry' ? ['#2563eb', '#1e3a8a', '#2563eb'] : '#cbd5e1' }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 0.5 }}
                      >
                        <span className="font-bold text-slate-700 text-xs tracking-wide uppercase">Kathode (Stahl)</span>
                        <FormulaText text={"$\\mathrm{O}_2 + 2\\mathrm{H}_2\\mathrm{O} + 4\\mathrm{e}^-$"} className="text-xs text-slate-650 font-mono font-semibold mt-1 text-center" />
                        <FormulaText text={"$\\rightarrow 4\\mathrm{OH}^-$"} className="text-xs text-slate-650 font-mono font-semibold text-center" />
                        
                        <div className="absolute -top-1.5 -left-1.5 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shadow z-10 border border-white">+</div>

                        {/* Floating OH- ions */}
                        {env !== 'dry' && (
                          <motion.div
                            className="absolute bottom-2 bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full z-20 shadow border border-blue-700"
                            animate={{ 
                              y: [0, 25, 45], 
                              x: [0, -15, -30], 
                              opacity: [0, 1, 0] 
                            }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: env === 'salty' ? 1.5 : env === 'wet' ? 3.0 : 5.0, 
                              ease: 'easeOut', 
                              delay: env === 'salty' ? 0.75 : env === 'wet' ? 1.5 : 2.5 
                            }}
                          >
                            OH⁻
                          </motion.div>
                        )}
                      </motion.div>
                      <span className="text-xs text-slate-650 mt-3 text-center font-medium leading-tight">Reduktion<br/><span className="text-blue-600 font-bold">{env !== 'dry' ? 'Sauerstoffverbrauch' : 'Inaktiv'}</span></span>
                    </div>

                  </div>

                  {/* Control Panel inside Simulation Box */}
                  <div className="mt-8 border-t border-home-grau/30 pt-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-850 uppercase tracking-wide font-bold">Umgebungsklima wählen:</span>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-1.5">
                        {(['dry', 'moist', 'wet', 'salty'] as const).map(k => (
                          <button
                            key={k}
                            onClick={() => setEnv(k)}
                            className={`px-3 py-2 text-xs rounded-xl font-bold border transition-all shadow-sm ${
                              env === k 
                                ? 'bg-shiraz border-shiraz text-white scale-[1.02] ring-2 ring-shiraz/10' 
                                : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-home-grau/30'
                            }`}
                          >
                            {k === 'dry' ? '🏜️ Trocken' : k === 'moist' ? '🌫️ Feucht' : k === 'wet' ? '🌧️ Nass / Regen' : '🌊 Salzwasser'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active Environmental Info */}
                    <div className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${envInfo[env].color}`}>
                      <strong className="block text-sm mb-1 font-bold">{envInfo[env].title}</strong>
                      <span className="font-medium text-slate-750">{envInfo[env].desc}</span>
                    </div>

                    {/* Cleaning and Status */}
                    {env !== 'dry' && (
                      <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-home-grau/30 mt-1">
                        <div className="flex-1 flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-400 uppercase font-black tracking-wider">Oberflächenzustand:</span>
                            <span className="text-xs font-extrabold text-slate-700">
                              {rustThickness > 70 
                                ? '⚠️ Schwere Krustenbildung (Gefahr von Betonabplatzungen!)' 
                                : rustThickness > 35 
                                  ? '⚠️ Deutlich angerostet' 
                                  : rustThickness > 5 
                                    ? 'Leichter Flugrost' 
                                    : 'Einwandfreier Zustand'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setRustThickness(0);
                            setAnodeErosion(0);
                          }}
                          className="px-3.5 py-1.5 bg-slate-850 hover:bg-slate-900 text-xs text-white rounded-lg font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          ⚡ Rost reinigen (entfernen)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Chemical Reaction Pathway */}
              <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
                <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-shiraz animate-pulse"></span>
                  Chemische Reaktionskette der Rostbildung (nach BGRCI 2025)
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  Die primäre Metallauflösung (<InlineMath math="\mathrm{Fe} \rightarrow \mathrm{Fe}^{2+}" />) und der kathodische Elektroneneinfang sind nur der chemische Auslöser. Erst durch sekundäre Folgereaktionen im Elektrolytwasser schlägt sich das typische braune Oxidhydrat (Rost) nieder. Die Kette verläuft in drei thermodynamischen Teilschritten:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Schritt 1 */}
                  <div className="bg-white p-3.5 rounded-xl border border-home-grau/15 flex flex-col gap-2 shadow-xs">
                    <span className="text-xs font-bold text-shiraz uppercase tracking-wider">Schritt 1: Ausfällung von Eisen(II)-hydroxid</span>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium">
                      Die anodisch emittierten <FormulaText text={"$\\mathrm{Fe}^{2+}$"} />-Ionen verbinden sich im wässrigen Elektrolyt mit den kathodischen Hydroxid-Ionen (<FormulaText text={"$\\mathrm{OH}^-$"} />) zu unlöslichem Eisen(II)-hydroxid (weiß-grüner Primärniederschlag):
                    </p>
                    <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/35 text-center font-mono text-xs text-slate-850 mt-1">
                      <FormulaText text={"$\\mathrm{Fe}^{2+} + 2\\mathrm{OH}^- \\longrightarrow \\mathrm{Fe(OH)}_2 \\downarrow$"} />
                    </div>
                  </div>

                  {/* Schritt 2 */}
                  <div className="bg-white p-3.5 rounded-xl border border-home-grau/15 flex flex-col gap-2 shadow-xs">
                    <span className="text-xs font-bold text-shiraz uppercase tracking-wider">Schritt 2: Oxidation zu Eisen(III)-hydroxid</span>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium">
                      In Gegenwart von im Elektrolytwasser gelöstem Luft-Sauerstoff (<FormulaText text={"$\\mathrm{O}_2$"} />) wird das instabile Eisen(II)-hydroxid rasch zu dunkelbraunem Eisen(III)-hydroxid oxidiert:
                    </p>
                    <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/35 text-center font-mono text-xs text-slate-850 mt-1">
                      <FormulaText text={"$4\\mathrm{Fe(OH)}_2 + \\mathrm{O}_2 + 2\\mathrm{H}_2\\mathrm{O} \\longrightarrow 4\\mathrm{Fe(OH)}_3 \\downarrow$"} />
                    </div>
                  </div>

                  {/* Schritt 3 Endprodukt */}
                  <div className="bg-white p-3.5 rounded-xl border border-home-grau/15 md:col-span-2 flex flex-col gap-2 shadow-xs">
                    <span className="text-xs font-bold text-shiraz uppercase tracking-wider">Schritt 3: Dehydratisierung zum Endprodukt (Rost)</span>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium">
                      Das instabile Eisen(III)-hydroxid spaltet unter Wasserverlust molekulare Anteile ab und geht in stabiles Goethit (FeO(OH)) bzw. wasserhaltige Eisen(III)-oxide über (Endstufe "Rost"):
                    </p>
                    <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/35 flex flex-col sm:flex-row justify-around items-center font-mono text-xs text-slate-850 gap-2 mt-1">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-500 font-sans font-medium mb-1">Goethit (Eisen(III)-hydroxidoxid)</span>
                        <FormulaText text={"$\\mathrm{Fe(OH)}_3 \\longrightarrow \\mathrm{FeO(OH)} + \\mathrm{H}_2\\mathrm{O}$"} />
                      </div>
                      <div className="hidden sm:block h-8 w-px bg-slate-200"></div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-500 font-sans font-medium mb-1">Eisen(III)-oxid-Hydrat</span>
                        <FormulaText text={"$2\\mathrm{FeO(OH)} \\longrightarrow \\mathrm{Fe}_2\\mathrm{O}_3 \\cdot \\mathrm{H}_2\\mathrm{O}$"} />
                      </div>
                    </div>
                    <div className="p-3 bg-red-500/5 rounded-lg border border-shiraz/20 text-xs text-slate-800 leading-relaxed mt-1.5">
                      <strong>Volumendehnungseffekt & Bauteilsprengung:</strong> Rost beansprucht je nach Hydratationsgrad das <strong>4- bis 6-fache Volumen</strong> des ursprünglichen Eisengitters. Im Stahlbetonbau führt dieser expansive Kristallisationsdruck (oft weit über 100 MPa) zu einer gewaltigen Radialspannung um die Bewehrung. Sobald dieser Druck die Betonzugfestigkeit (ca. 2–4 MPa) überschreitet, reißt die Betondeckung auf und platzt flächig ab (Sprengeffekt).
                    </div>
                  </div>
                </div>
              </div>

              {/* BGRCI Influencing Factors on Corrosion Rate */}
              <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
                <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span>
                  Einflussfaktoren auf die Korrosionsgeschwindigkeit
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  Die Kinetik der Korrosion wird nach den BGRCI-Richtlinien maßgeblich durch vier thermodynamische und chemische Leitgrößen gesteuert:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-900 block border-b border-slate-100 pb-1 mb-1">pH-Wert (Säuregrad)</span>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium">
                      Unterhalb von <strong>pH 5</strong> (Säuren) wird jede schützende Metall-Passivschicht zersetzt. Es tritt die extrem schnelle <strong>Wasserstoffkorrosion</strong> ein. Über **pH 12** (z. B. in Porenbeton durch Calciumhydroxid) passiviert Stahl spontan, wodurch der Abtrag nahezu erlischt (pH-Passivierung).
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-900 block border-b border-slate-100 pb-1 mb-1">Temperatur-Paradoxon</span>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium">
                      Chemische Reaktionen verdoppeln sich pro <strong>10 K Erwärmung</strong> (Arrhenius). Aber: In <em>offenen Systemen</em> sinkt ab ca. <strong>80 °C</strong> die Sauerstofflöslichkeit im Wasser drastisch, wodurch die Sauerstoffkorrosion abnimmt. In *geschlossenen, unter Druck stehenden Systemen* (Rohrleitungen) steigt sie hingegen ungebremst weiter!
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-900 block border-b border-slate-100 pb-1 mb-1">Salzgehalt (Chloride)</span>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium">
                      Ionen wie Chlorid (Cl⁻) erhöhen nicht nur die elektrische Leitfähigkeit des Wassers (verringerter Ohmscher Bahnwiderstand), sondern durchbrechen gezielt die Oxidhaut von Edelstahl und rufen aggressive Lochfraßkeime hervor.
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-900 block border-b border-slate-100 pb-1 mb-1">Sauerstoffzutritt</span>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium">
                      Bei der Sauerstoffkorrosion ist die Zufuhr von gelöstem Sauerstoff (O₂) an der Kathodenoberfläche der geschwindigkeitsbestimmende Schritt (Diffusionskontrolle). Hohe Strömungsgeschwindigkeiten spülen frischen Sauerstoff heran und beschleunigen die kathodische Reduktion.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'deckschichten' && (
            <DeckschichtenVergleich />
          )}

          {activeSection === 'arten' && (
            <section className="animate-in fade-in duration-300 flex flex-col gap-6">
              <h3 className="text-lg font-extrabold text-slate-850 border-l-2 border-shiraz pl-1.5 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-shiraz" /> Korrosionsmechanismen im Detail (nach DIN-Klassifikation)
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Metallische Korrosion bricht sich in unterschiedlichen geometrischen und thermodynamischen Mustern Bahn. Die Abgrenzung ist für Werkstoffprüfer essenziell:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Flächenkorrosion */}
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-1.5">
                  <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span>
                    1. Gleichmäßige Flächenkorrosion
                  </span>
                  <p className="text-xs text-slate-650 leading-relaxed font-normal">
                    Der metallische Abtrag schreitet gleichmäßig über die Gesamtoberfläche fort. Diese Form ist rechnerisch hervorragend prognostizierbar (v_corr = konstant). Korrosionszuschläge (Opferblechdicken) in der Tragwerksbemessung fangen diesen berechenbaren Verlust sicher auf.
                  </p>
                </div>

                {/* 2. Kontaktkorrosion */}
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-1.5">
                  <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span>
                    2. Kontaktkorrosion (Bimetallkorrosion)
                  </span>
                  <p className="text-xs text-slate-650 leading-relaxed font-normal">
                    Zwei Metalle mit signifikant unterschiedlichen Standardpotenzialen sind im Elektrolyten direkt verbunden. Das **unedlere** Metall oxidiert als Opferanode, während das **edlere** kathodisch geschützt wird. 
                  </p>
                  <p className="text-xs text-red-650 font-bold bg-white p-2 rounded-lg border border-home-grau/20 mt-1">
                    <strong>Katastrophaler Flächeneffekt:</strong> Ist die Anodenfläche (z. B. unedle Stahlschraube) sehr klein im Verhältnis zur Kathodenfläche (z. B. große Edelstahlplatte), konzentriert sich der Elektronenabfluss extrem lokal, was zu raschem mechanischen Versagen der Schraube führt!
                  </p>
                </div>

                {/* 3. Lochfraßkorrosion */}
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-1.5">
                  <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span>
                    3. Lochfraßkorrosion (Pitting)
                  </span>
                  <p className="text-xs text-slate-650 leading-relaxed font-normal">
                    Extrem heimtückische Korrosionsform, die tiefen Lochfraß im Material erzeugt, während die Oberfläche unversehrt scheint. Sie Sie betrifft vor allem passive Metalle (nichtrostender Stahl, Aluminium) in Gegenwart von Chlorid-Ionen. Die Ionen durchbrechen die Passivschicht (bei Edelstahl Chromoxid, bei Aluminium Aluminiumoxid) an mikroskopischen Schwachstellen. in Gegenwart von Chlorid-Ionen. Die Ionen infiltrieren an mikroskopischen Schwachstellen die Chromoxidschicht.
                  </p>
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 mt-1.5 text-xs text-slate-700">
                    <strong className="block mb-1 text-xs text-slate-805 uppercase tracking-wide">Pitting Resistance Equivalent Number (PREN-Index)</strong>
                    <span>Bestimmt die Widerstandskraft hochlegierter Edelstähle gegen Lochfraß:</span>
                    <div className="bg-slate-50 p-2 text-center text-xs font-mono rounded border border-home-grau/30 my-1 font-bold overflow-x-auto">
                      <BlockMath math="\mathrm{PREN} = \%\,\mathrm{Cr} + 3{,}3 \cdot (\%\,\mathrm{Mo} + 1{,}5 \cdot \%\,\mathrm{W}) + 16 \cdot \%\,\mathrm{N}" />
                    </div>
                    <span className="text-xs text-slate-500 italic font-medium block">Ein PREN-Wert &gt; 35 charakterisiert einen Werkstoff als voll meerwasser- und chloridbeständig (z. B. Superduplex-Stähle).</span>
                  </div>
                </div>

                {/* 4. Spaltkorrosion */}
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-1.5">
                  <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span>
                    4. Spaltkorrosion (Belüftungselement)
                  </span>
                  <p className="text-xs text-slate-650 leading-relaxed font-normal">
                    Tritt in engen Spalten (Spaltbreite &lt; 0,1 mm, z. B. Schraubenauflagen, Flansche) auf, in denen Wasser steht. Da der Spaltgrund kaum Sauerstoff erhält (Belüftungselement nach Evans), verarmt diese Zone an Sauerstoff und wird zur Anode. Die gut belüftete äußere Metallfläche fungiert als Kathode.
                  </p>
                </div>

                {/* 5. Interkristalline Korrosion */}
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-1.5">
                  <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span>
                    5. Interkristalline Korrosion (IK)
                  </span>
                  <p className="text-xs text-slate-650 leading-relaxed font-medium">
                    Tritt bei nichtrostendem Chrom-Nickel-Stahl auf, wenn dieser thermisch beansprucht wird (z. B. im Bereich von <strong>450 °C bis 850 °C</strong> durch unkontrolliertes Schweißen). Kohlenstoff diffundiert an die Korngrenzen und verbindet sich dort mit Chrom zu unlöslichen **Chromcarbiden** (<InlineMath math="\mathrm{Cr}_{23}\mathrm{C}_6" />).
                  </p>
                  <p className="text-xs text-red-700 font-bold bg-white p-2.5 rounded-lg border border-home-grau/25 mt-1">
                    <strong>Die Folge:</strong> Direkt neben den Korngrenzen fällt der freie Chromgehalt unter die kritische Passivierungsschwelle von **12 %**. Hier wird der Werkstoff ungeschützt und löst sich entlang der Kornpfade pulverförmig auf.
                  </p>
                  <p className="text-xs text-emerald-800 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 font-bold">
                    <strong>Gegenmaßnahmen:</strong> Verwendung von LC-Stählen (Low Carbon, C &lt; 0,03 %, z. B. Werkstoff 1.4404) oder stabilisierten Qualitäten mit Niob (Nb) oder Titan (Ti, z. B. 1.4571), da Ti/Nb den Kohlenstoff effektiver binden als Chrom.
                  </p>
                </div>

                {/* 6. Spannungsrisskorrosion */}
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-1.5">
                  <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span>
                    6. Spannungsrisskorrosion (SpRK / SCC)
                  </span>
                  <p className="text-xs text-slate-650 leading-relaxed font-normal">
                    Kombination aus <strong>Zugspannung</strong> (intern durch Eigenspannung beim Abkühlen/Biegen oder extern durch Nutzlasten) und einem **spezifischen Korrosionsmedium**. Sie führt zu einem extrem plötzlichen, spröden Phänomen (transkristalline oder interkristalline Risse) **ohne plastische Verformung oder Flugrost-Vorankündigung**.
                  </p>
                  <ul className="text-xs text-slate-650 font-bold space-y-0.5 list-disc pl-4 mt-1">
                    <li><span className="font-semibold">Austenitische Edelstähle:</span> Sensibilisiert durch chloridhaltige Medien (klassischer Einsturz von Schwimmbaddächern).</li>
                    <li><span className="font-semibold">Kupfer-Zink-Legierungen (Messing):</span> Reagiert empfindlich auf Ammoniak oder Ammonium-Ionen.</li>
                  </ul>
                </div>

                {/* 7. Corrosion Under Insulation */}
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-1.5 md:col-span-2">
                  <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span>
                    7. Corrosion Under Insulation (CUI / Korrosion unter Isolierungen)
                  </span>
                  <p className="text-xs text-slate-650 leading-relaxed font-normal">
                    Ein enormes, verdecktes Schadensbild in Chemie- und Heizungsanlagen. Unter Dämmstoffen (z. B. Mineralwolle), die unbemerkt Feuchtigkeit aufsaugen (Leckage, Regen, Kondensat), bilden sich dauerhafte Feuchtigkeitsnester. Salze (Chloride, Sulfate) reichern sich zyklisch an und konzentrieren sich im Temperaturbereich von **50 °C bis 150 °C**, was die lokale Korrosionsgeschwindigkeit exponentiell eskaliert. Da die Rohre optisch verdeckt sind, wird CUI meist erst bei Leckagen entdeckt.
                  </p>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'schutz' && (
            <section className="animate-in fade-in duration-300 flex flex-col gap-6">
              <h3 className="text-lg font-extrabold text-slate-850 border-l-2 border-shiraz pl-1.5 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-shiraz" /> Korrosionsschutz nach Systematik der DIN EN ISO 12944
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Der wirksame Korrosionsschutz von Stählen gliedert sich nach ISO 12944 in die quantitative Erfassung der Umgebungsschärfe, die konstruktive Reduktion von Schadstellen und die gezielte Werkstoffbarriere:
              </p>

              {/* Korrosivitätskategorien ISO 12944-2 */}
              <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 flex flex-col gap-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider leading-none">
                  1. Korrosivitätskategorien nach DIN EN ISO 12944-2
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Der Planer muss die Umwelt vorab in standardisierte Kategorien einordnen (Schutzdauerklassen L, M, H, VH):
                </p>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-1 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-205 flex flex-col gap-1">
                    <span className="font-extrabold text-slate-900 block border-b border-slate-100 pb-0.5">C1 (Unbedeutend)</span>
                    <span className="text-xs text-slate-500 leading-normal font-medium">Beheizte Innenräume (z. B. Schulen, Büros) ohne Kondensationsgefahr.</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-205 flex flex-col gap-1">
                    <span className="font-extrabold text-slate-900 block border-b border-slate-100 pb-0.5">C2 (Gering)</span>
                    <span className="text-xs text-slate-500 leading-normal font-medium">Ländliche Bereiche mit geringer atmosphärischer Schadstoffbelastung. Ungeheizte Hallen.</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-205 flex flex-col gap-1">
                    <span className="font-extrabold text-slate-950 block border-b border-slate-100 pb-0.5">C3 (Mäßig)</span>
                    <span className="text-xs text-slate-500 leading-normal font-medium">Stadt- & Industrieatmosphäre mit mäßiger Schwefeldioxid-Belastung. Brauereien, Molkereien.</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-205 flex flex-col gap-1">
                    <span className="font-extrabold text-red-650 block border-b border-slate-100 pb-0.5">C4 (Stark)</span>
                    <span className="text-xs text-slate-500 leading-normal font-medium">Industriegebiete und maritime Küstengebiete mit signifikanter Salzbelastung. Schwimmbäder.</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-red-200 bg-rose-50/10 flex flex-col gap-1">
                    <span className="font-extrabold text-red-700 block border-b border-red-100 pb-0.5">C5 / CX (Sehr Stark / Extrem)</span>
                    <span className="text-xs text-slate-500 leading-normal font-medium">Offshore-Windkraftanlagen, tropische Meeresatmosphären, Extrembereiche mit permanenter Feuchte.</span>
                  </div>
                </div>
              </div>

              {/* Konstruktiver Korrosionsschutz ISO 12944-3 */}
              <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 flex flex-col gap-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider leading-none">
                  2. Konstruktive Gestaltungsregeln nach DIN EN ISO 12944-3
                </span>
                <p className="text-xs text-slate-650 leading-relaxed font-medium mb-1">
                  Der wirksamste Schutz beginnt auf dem Reißbrett des Konstrukteurs. Fehlerhafte Metallgeometrien lassen sich durch spätere Beschichtungen nicht heilen:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-home-grau/15 flex gap-3 shadow-xs">
                    <span className="p-2 bg-shiraz/5 text-shiraz font-black rounded-lg text-sm shrink-0 flex items-center justify-center w-8 h-8">
                      1
                    </span>
                    <div className="flex flex-col gap-1">
                      <strong className="text-xs text-slate-900 font-bold">Kantenabrundung (Kantenflucht vermeiden)</strong>
                      <span className="text-xs text-slate-600 leading-normal font-medium">
                        Flüssige Lacke ziehen sich beim Trocknen durch Oberflächenspannung von scharfen Ecken zusammen. Kanten müssen zwingend mit einem Radius von **r ≥ 2 mm** abgerundet oder gefast werden, um eine homogene Schutzschichtdicke zu sichern (Norm ISO 12944-3).
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-home-grau/15 flex gap-3 shadow-xs">
                    <span className="p-2 bg-shiraz/5 text-shiraz font-black rounded-lg text-sm shrink-0 flex items-center justify-center w-8 h-8">
                      2
                    </span>
                    <div className="flex flex-col gap-1">
                      <strong className="text-xs text-slate-900 font-bold">Vermeidung von Wassertaschen (Nestern)</strong>
                      <span className="text-xs text-slate-600 leading-normal font-medium">
                        Offene U-, C- oder L-Profile müssen nach oben entwässert oder gedreht werden. Ist das nicht möglich, sind wirksame Entwässerungsbohrungen (Ablauflöcher) an den tiefsten Punkten vorzusehen, damit Elektrolyt rückstandsfrei fließen kann.
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-home-grau/15 flex gap-3 shadow-xs">
                    <span className="p-2 bg-shiraz/5 text-shiraz font-black rounded-lg text-sm shrink-0 flex items-center justify-center w-8 h-8">
                      3
                    </span>
                    <div className="flex flex-col gap-1">
                      <strong className="text-xs text-slate-900 font-bold">Durchgehendes Schweißen statt Heftnähte</strong>
                      <span className="text-xs text-slate-600 leading-normal font-medium">
                        Schweißnähte müssen absolut porenfrei und voll durchgeschweißt sein (keine offenen überlappenden Bleche). Enge, nicht verschweißte Hohlräume ziehen über Kapillareffekte aggressive Feuchtigkeit ein und rufen unkontrollierbare Spaltkorrosion hervor.
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-home-grau/15 flex gap-3 shadow-xs">
                    <span className="p-2 bg-shiraz/5 text-shiraz font-black rounded-lg text-sm shrink-0 flex items-center justify-center w-8 h-8">
                      4
                    </span>
                    <div className="flex flex-col gap-1">
                      <strong className="text-xs text-slate-900 font-bold">Isolierende Zwischenlagen an Kontaktstellen</strong>
                      <span className="text-xs text-slate-600 leading-normal font-medium">
                        Verbindet man unterschiedliche Werkstoffe (z. B. Aluminium-Verbundfassade mit Edelstahlunterkonstruktion), sind elektrochemisch isolierende Scheiben oder Hülsen (z. B. EPDM, Elastomere) einzubauen, um den Stromfluss des galvanischen Elements wirksam zu trennen.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passive vs. Active Protection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-3">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span>
                    Passive Schutzmaßnahmen
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 font-medium">
                    <li>
                      <strong>Barrieremembranen (Beschichtungen):</strong> Kunstharze, Acrylate und Epoxide trennen das Basismetall makroskopisch von der äußeren Sauerstoff- und Wasserexpansionszone.
                    </li>
                    <li>
                      <strong>Passivierende Legierungen:</strong> Zulegieren von Chrom (&gt; 12 %) erzeugt unter Luftzutritt spontan eine atomar dünne Chromoxidschicht (Cr2O3), welche die Diffusion von Eisenionen blockiert.
                    </li>
                    <li>
                      <strong>Inhibitoren:</strong> Chemische Additive im Kreislaufwasser. Anodische Inhibitoren passivieren Fehlstellen lokal, während kathodische Inhibitoren chemisch schwerlösliche Deckschichten (z. B. Calciumcarbonate) auf der Oberfläche anlagern.
                    </li>
                  </ul>
                </div>

                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-3">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span>
                    Aktive (Kathodische) Schutzmaßnahmen
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 font-medium">
                    <li>
                      <strong>Opferanoden (Galvanischer Schutz):</strong> Metalle wie Zink oder Magnesium, die ein signifikant negativeres elektrochemisches Potenzial als Eisen aufweisen, werden fest montiert. Selbst bei Haarrissen in der äußeren Zinkhaut fängt das unedle Zink den Ionenstrom ab und opfert sich unter Massenverlust auf, um den Stahl zu schützen (Fernwirkung).
                    </li>
                    <li>
                      <strong>Fremdstromanoden:</strong> Ein künstlicher elektrischer Gleichstrom aus einer externen Gleichspannungsquelle polarisiert den Werkstoff als Kathode in den Bereich der thermodynamischen Immunität. Einsatz vor allem bei Brückenpfeilern, Pipelines und Tankbehältern im Erdboden.
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      <MetalThematicLinks current="dauerhaftigkeit" />
      
      <ModuleFooter 
        wikipedia={[
          { title: "Korrosion", url: "https://de.wikipedia.org/wiki/Korrosion" },
          { title: "Pilling-Bedworth-Verhältnis", url: "https://de.wikipedia.org/wiki/Pilling-Bedworth-Verh%C3%A4ltnis" },
          { title: "Wetterfester Baustahl (Corten)", url: "https://de.wikipedia.org/wiki/Wetterfester_Baustahl" },
          { title: "Patina", url: "https://de.wikipedia.org/wiki/Patina" },
          { title: "Korrosionsschutz", url: "https://de.wikipedia.org/wiki/Korrosionsschutz" },
          { title: "Pitting-Korrosion", url: "https://de.wikipedia.org/wiki/Lochfra%C3%9Fkorrosion" },
          { title: "Spannungsrisskorrosion", url: "https://de.wikipedia.org/wiki/Spannungsrisskorrosion" }
        ]} 
        literatur={[
          'Pilling, N. B.; Bedworth, R. E. (1923): The Oxidation of Metals at High Temperatures (J. Inst. Met. 29, S. 529–591)',
          'Schütze, M. et al. (2018): Korrosion und Korrosionsschutz (Wiley-VCH)',
          'Bargel, H.-J.; Schulze, G. (2018): Werkstoffkunde: Korrosionserscheinungen (Springer Vieweg)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]} 
        regelwerke={[
          { title: "DIN EN ISO 12944 (Korrosionsschutz von Stahlbauten durch Beschichtungssysteme - Teile 1 bis 9)", url: "https://www.dinmedia.de/" },
          { title: "DIN EN 10025-5 (Warmgewalzte Erzeugnisse aus Baustählen - Teil 5: Wetterfeste Baustähle)", url: "https://www.dinmedia.de/" },
          { title: "DIN EN 1172 (Kupfer und Kupferlegierungen - Bleche und Bänder für das Bauwesen)", url: "https://www.dinmedia.de/" },
          { title: "DIN EN 485 / DIN EN 573 (Aluminium und Aluminiumlegierungen für das Bauwesen)", url: "https://www.dinmedia.de/" },
          { title: "DIN EN ISO 8044 (Korrosion von Metallen und Legierungen - Grundbegriffe)", url: "https://www.dinmedia.de/" },
          { title: "DIN EN ISO 9223 (Korrosion von Metallen – Korrosivitätskategorien C1 bis CX)", url: "https://www.dinmedia.de/" }
        ]} 
        formeln={[
          {
            formel: '\\text{Anode: } \\text{Fe} \\rightarrow \\text{Fe}^{2+} + 2\\,e^- \\quad | \\quad \\text{Kathode: } \\text{O}_2 + 2\\,\\text{H}_2\\text{O} + 4\\,e^- \\rightarrow 4\\,\\text{OH}^-',
            erklaerung: 'Elektrochemische Sauerstoffkorrosion von Eisen in neutralem/alkalischem wässrigem Elektrolyt unter Bildung von Rost (FeO(OH) bzw. Fe2O3·H2O).',
            quelle: 'DIN EN ISO 8044'
          },
          {
            formel: '\\mathrm{PBR} = \\frac{V_{\\text{Oxid}}}{V_{\\text{Metall}}} = \\frac{M_{\\text{Oxid}} \\cdot \\rho_{\\text{Metall}}}{n \\cdot M_{\\text{Metall}} \\cdot \\rho_{\\text{Oxid}}}',
            erklaerung: 'Pilling-Bedworth-Verhältnis: Kriterium für Deckschichten. 1,0 <= PBR <= 2,0 kennzeichnet dichte, passivierende Schutzschichten (z. B. Aluminium 1,28, Kupfer 1,68, Corten 1,75). PBR > 2,0 erzeugt schuppiges Abblättern (Eisen/Rost ca. 2,1 bis 3,3).',
            quelle: 'Pilling & Bedworth (1923)'
          },
          {
            formel: '2\\,\\text{Cu} + \\text{O}_2 + \\text{CO}_2 + \\text{H}_2\\text{O} \\longrightarrow \\text{Cu}_2[(\\text{OH})_2|\\text{CO}_3] \\; (\\text{Malachit})',
            erklaerung: 'Bildung der dichten, langlebigen Patina an Kupferbauteilen (Dächer, Rinnen) durch Reaktion mit Luftsauerstoff, Kohlendioxid und Feuchtigkeit.',
            quelle: 'DIN EN 1172'
          },
          {
            formel: '4\\,\\text{Al} + 3\\,\\text{O}_2 \\longrightarrow 2\\,\\text{Al}_2\\text{O}_3',
            erklaerung: 'Spontane Bildung der porenfreien, amorphen Aluminiumoxidschicht (PBR = 1,28, Dicke 2–10 nm). Verhindert weiteren Sauerstoffzutritt im pH-Bereich 4,5–8,5.',
            quelle: 'DIN EN 573'
          },
          {
            formel: 'm = \\frac{M \\cdot I \\cdot t}{z \\cdot F}',
            erklaerung: 'Faradaysches Gesetz für den elektrolytischen Metallabtrag: m = abgebaute Masse, M = molare Masse, I = Korrosionsstrom, t = Zeit, z = Wertigkeit der Ionen, F = Faraday-Konstante (96.485 C/mol).',
            quelle: 'Elektrochemie / Werkstoffkunde'
          }
        ]} 
      />
    </div>
  );
}
