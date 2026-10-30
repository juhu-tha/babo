import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ShieldAlert, Droplets, ShieldCheck, Zap, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { motion } from 'framer-motion';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeWert } from '@/src/utils/numberFormat';

function MetalThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.materialLehrpfadMetalleIm} /></h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5"><MdText text={inhalt.texte.wechselnSieNahtlosZwischen} /></p>
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
            <span><MdText text={inhalt.texte.t1BaustoffKennwerte} /></span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.physikalischeEigenschaftenSchmelzpunktLe} /></span>
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
            <span><MdText text={inhalt.texte.t2MechanikPraxis} /></span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.plattenrechnerKontaktkorrosionsPrüfungLi} /></span>
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
            <span><MdText text={inhalt.texte.t3Dauerhaftigkeit} /></span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.galvanischeZellenKorrosionsartenSchutz} /></span>
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
import inhalt from '@/content/metallkorrosion/Metallkorrosion.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';

type MetallkorrosionReiter = 'simulation' | 'deckschichten' | 'arten' | 'schutz';
const REITER: readonly ModulTab<MetallkorrosionReiter>[] = [
  { id: 'simulation', label: inhalt.texte.grundlagenSimulation, icon: Zap },
  { id: 'deckschichten', label: inhalt.texte.deckschichtenPassivierung, icon: Layers },
  { id: 'arten', label: 'Korrosionsarten', icon: ShieldAlert },
  { id: 'schutz', label: inhalt.texte.korrosionsschutzDinEnIso, icon: ShieldCheck },
];

export default function Metallkorrosion() {
  const { activeTab, setActiveTab } = useTabContext();
  const [activeSection, setActiveSection] = React.useState<MetallkorrosionReiter>('simulation');
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
      setAnodeErosion(prev => Math.min(45, prev + speed * 0.4)); // Darstellungsfaktor der Animation
    }, 1000);
    
    return () => clearInterval(interval);
  }, [env]);

  const clipPath = `polygon(0% 0%, 100% 0%, ${formatDeWert(100 - anodeErosion / 2)}% ${formatDeWert(anodeErosion / 3)}%, ${formatDeWert(100 - anodeErosion)}% 50%, 100% 100%, 0% 100%)`;
  const electronSpeed = env === 'salty' ? 1.0 : env === 'wet' ? 2.5 : env === 'moist' ? 5.0 : 0;

  const envInfo = inhalt.daten["Metallkorrosion.envInfo"];

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeSection} onWechsel={setActiveSection} className="[&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:pb-4 [&>[role=tablist]]:mb-6">
        <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
          <ShieldAlert className="text-shiraz" /><MdText text={inhalt.texte.korrosionUndSchutzVon} /></h2>
        
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          {/* DIN EN ISO 8044 Definition & Systemcharakter Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm text-text-main">
            <div className="md:col-span-2 bg-off-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-2.5">
              <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.normativeDefinitionNachDin} /></span>
              <p className="text-xs leading-relaxed font-normal text-slate-700"><MdText text={inhalt.texte.unterMetallischerKorrosionVersteht} /></p>
              <p className="text-xs text-slate-500 italic font-medium mt-1"><MdText text={inhalt.texte.elektrochemischeKorrosionErfordertEinen} /></p>
            </div>
            
            <div className="bg-rose-50/20 p-5 rounded-xl border border-rose-200/40 flex flex-col gap-2.5">
              <span className="text-xs font-black text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.derSystemcharakter} /></span>
              <p className="text-xs leading-relaxed text-slate-700 font-medium"><MdText text={inhalt.texte.alsKernprinzipNachBgrci} /></p>
              <ul className="text-xs space-y-1 text-slate-650 font-bold list-disc pl-4 mt-0.5">
                <li><span className="font-medium"><MdText text={inhalt.texte.werkstoffOberflächenzustand} /></span></li>
                <li><span className="font-medium"><MdText text={inhalt.texte.elektrolytUmgebungsmedium} /></span></li>
                <li><span className="font-medium"><MdText text={inhalt.texte.baulicheKonstruktionZugspannung} /></span></li>
              </ul>
            </div>
          </div>

          {activeSection === 'simulation' && (
            <section className="animate-in fade-in duration-300 flex flex-col gap-6">
              <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 text-sm text-text-main/80 flex flex-col gap-4">
                <h3 className="text-lg font-extrabold text-home-prim flex items-center gap-2">
                  <Zap className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.grundlagenDerElektrochemischenKorrosion} /></h3>
                <p className="font-medium text-slate-700"><MdText text={inhalt.texte.damitEinElektrochemischerKorrosionsproze} /></p>
                
                {/* 3 Pillars of Electrochemistry */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1 mb-2">
                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-1.5">
                    <strong className="text-xs text-slate-900 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span><MdText text={inhalt.texte.t1PotenzialdifferenzAnodeKathode} /></strong>
                    <span className="text-xs text-slate-600 leading-relaxed block font-medium"><MdText text={inhalt.texte.zweiLeitendVerbundeneBereiche} /></span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-1.5">
                    <strong className="text-xs text-slate-900 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span><MdText text={inhalt.texte.t2ElektrolytIonenleiter} /></strong>
                    <span className="text-xs text-slate-600 leading-relaxed block font-medium"><MdText text={inhalt.texte.einFlüssigerFeuchtigkeitsfilmWasser} /></span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-1.5">
                    <strong className="text-xs text-slate-900 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span><MdText text={inhalt.texte.t3KathodischerElektronenakzeptor} /></strong>
                    <span className="text-xs text-slate-600 leading-relaxed block font-medium"><MdText text={inhalt.texte.einReaktionspartnerAnDer} /><strong className="text-slate-800">Sauerstoff</strong><MdText text={inhalt.texte.sauerstofftypInNeutralenAlkalischen} /><strong className="text-slate-800">Hydronium-Ionen</strong><MdText text={inhalt.texte.textHWasserstofftypSäuretyp} /></span>
                  </div>
                </div>

                <div className="my-4 bg-slate-150 p-5 sm:p-6 rounded-2xl border border-home-grau/35 shadow-inner relative overflow-hidden">
                  <h4 className="text-center font-extrabold text-slate-800 mb-4 text-sm sm:text-base flex items-center justify-center gap-2">
                    <span><MdText text={inhalt.texte.dasKorrosionselementGalvanischeZelle} /></span>
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
                        <span className="font-bold text-slate-700 text-xs tracking-wide uppercase"><MdText text={inhalt.texte.anodeEisen} /></span>
                        <FormulaText text={inhalt.werte.mathrmFeRightarrowMathrm} className="text-xs text-slate-650 font-mono font-semibold mt-1.5 text-center px-1" />
                        
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
                        <div className="absolute left-2 text-[8px] text-slate-600 font-bold uppercase tracking-wider z-10 font-semibold"><MdText text={inhalt.texte.leiterFlussE} /></div>
                        
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
                             <span>Rost-Pegel: {formatDeWert(Math.round(rustThickness))}%</span>
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
                           Elektrolyt {env === 'dry' ? '(Fehlt)' : env === 'moist' ? '(Feuchte)' : env === 'salty' ? inhalt.werte.salzwasserCl : '(Wasserfilm)'}
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
                        <span className="font-bold text-slate-700 text-xs tracking-wide uppercase"><MdText text={inhalt.texte.kathodeStahl} /></span>
                        <FormulaText text={inhalt.werte.mathrmO22} className="text-xs text-slate-650 font-mono font-semibold mt-1 text-center" />
                        <FormulaText text={inhalt.werte.rightarrow4MathrmOh} className="text-xs text-slate-650 font-mono font-semibold text-center" />
                        
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
                      <span className="text-xs font-bold text-slate-850 uppercase tracking-wide font-bold"><MdText text={inhalt.texte.umgebungsklimaWählen} /></span>
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
                            {k === 'dry' ? '🏜️ Trocken' : k === 'moist' ? '🌫️ Feucht' : k === 'wet' ? inhalt.werte.nassRegen : inhalt.werte.salzwasser}
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
                                ? inhalt.werte.schwereKrustenbildungGefahrVon 
                                : rustThickness > 35 
                                  ? inhalt.werte.deutlichAngerostet 
                                  : rustThickness > 5 
                                    ? inhalt.werte.leichterFlugrost 
                                    : inhalt.werte.einwandfreierZustand}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setRustThickness(0);
                            setAnodeErosion(0);
                          }}
                          className="px-3.5 py-1.5 bg-shiraz hover:bg-shiraz/90 text-xs text-white rounded-lg font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1 shrink-0 cursor-pointer"
                        ><MdText text={inhalt.texte.rostReinigenEntfernen} /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Chemical Reaction Pathway */}
              <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
                <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-shiraz animate-pulse"></span><MdText text={inhalt.texte.chemischeReaktionsketteDerRostbildung} /></h4>
                <p className="text-xs text-slate-700 leading-relaxed font-normal"><MdText text={inhalt.texte.diePrimäreMetallauflösungMathrm} /></p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Schritt 1 */}
                  <div className="bg-white p-3.5 rounded-xl border border-home-grau/15 flex flex-col gap-2 shadow-xs">
                    <span className="text-xs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.schritt1AusfällungVon} /></span>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium"><MdText text={inhalt.texte.dieAnodischEmittierten} /><FormulaText text={"$\\mathrm{Fe}^{2+}$"} /><MdText text={inhalt.texte.ionenVerbindenSichIm} /><FormulaText text={"$\\mathrm{OH}^-$"} /><MdText text={inhalt.texte.zuUnlöslichemEisenIi} /></p>
                    <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/35 text-center font-mono text-xs text-slate-850 mt-1">
                      <FormulaText text={inhalt.werte.mathrmFe22} />
                    </div>
                  </div>

                  {/* Schritt 2 */}
                  <div className="bg-white p-3.5 rounded-xl border border-home-grau/15 flex flex-col gap-2 shadow-xs">
                    <span className="text-xs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.schritt2OxidationZu} /></span>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium"><MdText text={inhalt.texte.inGegenwartVonIm} /><FormulaText text={"$\\mathrm{O}_2$"} /><MdText text={inhalt.texte.wirdDasInstabileEisen} /></p>
                    <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/35 text-center font-mono text-xs text-slate-850 mt-1">
                      <FormulaText text={inhalt.werte.t4MathrmFeOh} />
                    </div>
                  </div>

                  {/* Schritt 3 Endprodukt */}
                  <div className="bg-white p-3.5 rounded-xl border border-home-grau/15 md:col-span-2 flex flex-col gap-2 shadow-xs">
                    <span className="text-xs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.schritt3DehydratisierungZum} /></span>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium"><MdText text={inhalt.texte.dasInstabileEisenIii} /></p>
                    <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/35 flex flex-col sm:flex-row justify-around items-center font-mono text-xs text-slate-850 gap-2 mt-1">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-500 font-sans font-medium mb-1"><MdText text={inhalt.texte.goethitEisenIiiHydroxidoxid} /></span>
                        <FormulaText text={inhalt.werte.mathrmFeOh3} />
                      </div>
                      <div className="hidden sm:block h-8 w-px bg-slate-200"></div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-500 font-sans font-medium mb-1">Eisen(III)-oxid-Hydrat</span>
                        <FormulaText text={inhalt.werte.t2MathrmFeoOh} />
                      </div>
                    </div>
                    <div className="p-3 bg-red-500/5 rounded-lg border border-shiraz/20 text-xs text-slate-800 leading-relaxed mt-1.5"><MdText text={inhalt.texte.volumendehnungseffektBauteilsprengungRos} /></div>
                  </div>
                </div>
              </div>

              {/* BGRCI Influencing Factors on Corrosion Rate */}
              <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
                <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.einflussfaktorenAufDieKorrosionsgeschwin} /></h4>
                <p className="text-xs text-slate-700 leading-relaxed font-normal"><MdText text={inhalt.texte.dieKinetikDerKorrosion} /></p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-900 block border-b border-slate-100 pb-1 mb-1"><MdText text={inhalt.texte.phWertSäuregrad} /></span>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium"><MdText text={inhalt.texte.unterhalbVonPh5} /></p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-900 block border-b border-slate-100 pb-1 mb-1">Temperatur-Paradoxon</span>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium"><MdText text={inhalt.texte.chemischeReaktionenVerdoppelnSich} /></p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-900 block border-b border-slate-100 pb-1 mb-1"><MdText text={inhalt.texte.salzgehaltChloride} /></span>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium"><MdText text={inhalt.texte.ionenWieChloridCl} /></p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-900 block border-b border-slate-100 pb-1 mb-1">Sauerstoffzutritt</span>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium"><MdText text={inhalt.texte.beiDerSauerstoffkorrosionIst} /></p>
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
                <ShieldAlert className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.korrosionsmechanismenImDetailNach} /></h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium"><MdText text={inhalt.texte.metallischeKorrosionBrichtSich} /></p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Flächenkorrosion */}
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-1.5">
                  <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.t1GleichmäßigeFlächenkorrosion} /></span>
                  <p className="text-xs text-slate-650 leading-relaxed font-normal"><MdText text={inhalt.texte.derMetallischeAbtragSchreitet} /></p>
                </div>

                {/* 2. Kontaktkorrosion */}
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-1.5">
                  <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.t2KontaktkorrosionBimetallkorrosion} /></span>
                  <p className="text-xs text-slate-650 leading-relaxed font-normal"><MdText text={inhalt.texte.zweiMetalleMitSignifikant} /></p>
                  <p className="text-xs text-red-650 font-bold bg-white p-2 rounded-lg border border-home-grau/20 mt-1"><MdText text={inhalt.texte.katastrophalerFlächeneffektIstDie} /></p>
                </div>

                {/* 3. Lochfraßkorrosion */}
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-1.5">
                  <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.t3LochfraßkorrosionPitting} /></span>
                  <p className="text-xs text-slate-650 leading-relaxed font-normal"><MdText text={inhalt.texte.extremHeimtückischeKorrosionsformDie} /></p>
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 mt-1.5 text-xs text-slate-700">
                    <strong className="block mb-1 text-xs text-slate-800 uppercase tracking-wide"><MdText text={inhalt.texte.pittingResistanceEquivalentNumber} /></strong>
                    <span><MdText text={inhalt.texte.bestimmtDieWiderstandskraftHochlegierter} /></span>
                    <div className="bg-slate-50 p-2 text-center text-xs font-mono rounded border border-home-grau/30 my-1 font-bold overflow-x-auto">
                      <BlockMath math="\mathrm{PREN} = \%\,\mathrm{Cr} + 3{,}3 \cdot (\%\,\mathrm{Mo} + 0{,}5 \cdot \%\,\mathrm{W}) + 16 \cdot \%\,\mathrm{N}" />
                    </div>
                    <span className="text-xs text-slate-500 italic font-medium block"><MdText text={inhalt.texte.alsFaustregelGeltenPren} /></span>
                  </div>
                </div>

                {/* 4. Spaltkorrosion */}
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-1.5">
                  <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.t4SpaltkorrosionBelüftungselement} /></span>
                  <p className="text-xs text-slate-650 leading-relaxed font-normal"><MdText text={inhalt.texte.trittInEngenSpalten} /></p>
                </div>

                {/* 5. Interkristalline Korrosion */}
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-1.5">
                  <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.t5InterkristallineKorrosionIk} /></span>
                  <p className="text-xs text-slate-650 leading-relaxed font-medium"><MdText text={inhalt.texte.trittBeiNichtrostendemChrom} /></p>
                  <p className="text-xs text-red-700 font-bold bg-white p-2.5 rounded-lg border border-home-grau/25 mt-1"><MdText text={inhalt.texte.dieFolgeDirektNeben} /></p>
                  <p className="text-xs text-emerald-800 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 font-bold"><MdText text={inhalt.texte.gegenmaßnahmenVerwendungVonLc} /></p>
                </div>

                {/* 6. Spannungsrisskorrosion */}
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-1.5">
                  <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.t6SpannungsrisskorrosionSprkScc} /></span>
                  <p className="text-xs text-slate-650 leading-relaxed font-normal"><MdText text={inhalt.texte.kombinationAusZugspannungIntern} /></p>
                  <ul className="text-xs text-slate-650 font-bold space-y-0.5 list-disc pl-4 mt-1">
                    <li><span className="font-semibold"><MdText text={inhalt.texte.austenitischeEdelstähle} /></span><MdText text={inhalt.texte.sensibilisiertDurchChloridhaltigeMedien} /></li>
                    <li><span className="font-semibold"><MdText text={inhalt.texte.kupferZinkLegierungenMessing} /></span><MdText text={inhalt.texte.reagiertEmpfindlichAufAmmoniak} /></li>
                  </ul>
                </div>

                {/* 7. Corrosion Under Insulation */}
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-1.5 md:col-span-2">
                  <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.t7CorrosionUnderInsulation} /></span>
                  <p className="text-xs text-slate-650 leading-relaxed font-normal"><MdText text={inhalt.texte.einEnormesVerdecktesSchadensbild} /></p>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'schutz' && (
            <section className="animate-in fade-in duration-300 flex flex-col gap-6">
              <h3 className="text-lg font-extrabold text-slate-850 border-l-2 border-shiraz pl-1.5 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.korrosionsschutzNachSystematikDer} /></h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium"><MdText text={inhalt.texte.derWirksameKorrosionsschutzVon} /></p>

              {/* Korrosivitätskategorien ISO 12944-2 */}
              <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 flex flex-col gap-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider leading-none"><MdText text={inhalt.texte.t1KorrosivitätskategorienNachDin} /></span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium"><MdText text={inhalt.texte.derPlanerMussDie} /></p>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-1 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col gap-1">
                    <span className="font-extrabold text-slate-900 block border-b border-slate-100 pb-0.5"><MdText text={inhalt.texte.c1Unbedeutend} /></span>
                    <span className="text-xs text-slate-500 leading-normal font-medium"><MdText text={inhalt.texte.beheizteInnenräumeZB} /></span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col gap-1">
                    <span className="font-extrabold text-slate-900 block border-b border-slate-100 pb-0.5">C2 (Gering)</span>
                    <span className="text-xs text-slate-500 leading-normal font-medium"><MdText text={inhalt.texte.ländlicheBereicheMitGeringer} /></span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col gap-1">
                    <span className="font-extrabold text-slate-950 block border-b border-slate-100 pb-0.5">C3 (Mäßig)</span>
                    <span className="text-xs text-slate-500 leading-normal font-medium"><MdText text={inhalt.texte.stadtIndustrieatmosphäreMitMäßiger} /></span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col gap-1">
                    <span className="font-extrabold text-red-650 block border-b border-slate-100 pb-0.5">C4 (Stark)</span>
                    <span className="text-xs text-slate-500 leading-normal font-medium"><MdText text={inhalt.texte.industriegebieteUndMaritimeKüstengebiete} /></span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-red-200 bg-rose-50/10 flex flex-col gap-1">
                    <span className="font-extrabold text-red-700 block border-b border-red-100 pb-0.5"><MdText text={inhalt.texte.c5CxSehrStark} /></span>
                    <span className="text-xs text-slate-500 leading-normal font-medium"><MdText text={inhalt.texte.offshoreWindkraftanlagenTropischeMeeresa} /></span>
                  </div>
                </div>
              </div>

              {/* Konstruktiver Korrosionsschutz ISO 12944-3 */}
              <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 flex flex-col gap-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider leading-none"><MdText text={inhalt.texte.t2KonstruktiveGestaltungsregelnNach} /></span>
                <p className="text-xs text-slate-650 leading-relaxed font-medium mb-1"><MdText text={inhalt.texte.derWirksamsteSchutzBeginnt} /></p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-home-grau/15 flex gap-3 shadow-xs">
                    <span className="p-2 bg-shiraz/5 text-shiraz font-black rounded-lg text-sm shrink-0 flex items-center justify-center w-8 h-8">
                      1
                    </span>
                    <div className="flex flex-col gap-1">
                      <strong className="text-xs text-slate-900 font-bold"><MdText text={inhalt.texte.kantenabrundungKantenfluchtVermeiden} /></strong>
                      <span className="text-xs text-slate-600 leading-normal font-medium"><MdText text={inhalt.texte.flüssigeLackeZiehenSich} /></span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-home-grau/15 flex gap-3 shadow-xs">
                    <span className="p-2 bg-shiraz/5 text-shiraz font-black rounded-lg text-sm shrink-0 flex items-center justify-center w-8 h-8">
                      2
                    </span>
                    <div className="flex flex-col gap-1">
                      <strong className="text-xs text-slate-900 font-bold"><MdText text={inhalt.texte.vermeidungVonWassertaschenNestern} /></strong>
                      <span className="text-xs text-slate-600 leading-normal font-medium"><MdText text={inhalt.texte.offeneUCOder} /></span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-home-grau/15 flex gap-3 shadow-xs">
                    <span className="p-2 bg-shiraz/5 text-shiraz font-black rounded-lg text-sm shrink-0 flex items-center justify-center w-8 h-8">
                      3
                    </span>
                    <div className="flex flex-col gap-1">
                      <strong className="text-xs text-slate-900 font-bold"><MdText text={inhalt.texte.durchgehendesSchweißenStattHeftnähte} /></strong>
                      <span className="text-xs text-slate-600 leading-normal font-medium"><MdText text={inhalt.texte.schweißnähteMüssenAbsolutPorenfrei} /></span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-home-grau/15 flex gap-3 shadow-xs">
                    <span className="p-2 bg-shiraz/5 text-shiraz font-black rounded-lg text-sm shrink-0 flex items-center justify-center w-8 h-8">
                      4
                    </span>
                    <div className="flex flex-col gap-1">
                      <strong className="text-xs text-slate-900 font-bold"><MdText text={inhalt.texte.isolierendeZwischenlagenAnKontaktstellen} /></strong>
                      <span className="text-xs text-slate-600 leading-normal font-medium"><MdText text={inhalt.texte.verbindetManUnterschiedlicheWerkstoffe} /></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passive vs. Active Protection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-3">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.passiveSchutzmaßnahmen} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 font-medium">
                    <li><MdText text={inhalt.texte.barrieremembranenBeschichtungenKunstharz} /></li>
                    <li><MdText text={inhalt.texte.passivierendeLegierungenZulegierenVon} /></li>
                    <li><MdText text={inhalt.texte.inhibitorenChemischeAdditiveIm} /></li>
                  </ul>
                </div>

                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-3">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.aktiveKathodischeSchutzmaßnahmen} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 font-medium">
                    <li><MdText text={inhalt.texte.opferanodenGalvanischerSchutzMetalle} /></li>
                    <li><MdText text={inhalt.texte.fremdstromanodenEinKünstlicherElektrisch} /></li>
                  </ul>
                </div>
              </div>
            </section>
          )}
        </div>
        </ModuleTabs>
      </div>

      <MetalThematicLinks current="dauerhaftigkeit" />
      
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1SchutzdauerEiner}
        zielGleichung="t_{Schutz} \approx \frac{s_{Zn}}{r_{corr,Zn}}"
        schritte={inhalt.daten["Metallkorrosion.schritte"]}
        ergebnisHinweis={inhalt.werte.mitEinerZusätzlichenBeschichtung}
        normQuelle={inhalt.werte.dinEnIso9223}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2LochfraßbeständigkeitNichtroste}
        zielGleichung="\mathrm{PREN} = \%\mathrm{Cr} + 3{,}3 \cdot \%\mathrm{Mo} + 16 \cdot \%\mathrm{N}"
        schritte={inhalt.daten["Metallkorrosion.schritte_2"]}
        ergebnisHinweis={inhalt.werte.fürSchwimmhallenUndMeerwasserbereiche}
        normQuelle={inhalt.werte.dinEn19931}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="metallkorrosion" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap10} 
        wikipedia={[
          { title: "Korrosion", url: "https://de.wikipedia.org/wiki/Korrosion" },
          { title: "Pilling-Bedworth-Verhältnis", url: "https://de.wikipedia.org/wiki/Pilling-Bedworth-Verh%C3%A4ltnis" },
          { title: inhalt.werte.wetterfesterBaustahlCorten, url: "https://de.wikipedia.org/wiki/Wetterfester_Baustahl" },
          { title: "Patina", url: "https://de.wikipedia.org/wiki/Patina" },
          { title: "Korrosionsschutz", url: "https://de.wikipedia.org/wiki/Korrosionsschutz" },
          { title: "Pitting-Korrosion", url: "https://de.wikipedia.org/wiki/Lochfra%C3%9Fkorrosion" },
          { title: "Spannungsrisskorrosion", url: "https://de.wikipedia.org/wiki/Spannungsrisskorrosion" }
        ]} 
        literatur={inhalt.daten["Metallkorrosion.literatur"]} 
        regelwerke={inhalt.daten["Metallkorrosion.regelwerke"]} 
        formeln={inhalt.daten["Metallkorrosion.formeln"]} 
      />
    </div>
  );
}
