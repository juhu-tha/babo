import React, { useState } from 'react';
import { Layers, Cuboid, Building2, BookOpen, CheckCircle2, Lightbulb, Info, Target, ShieldAlert, Sparkles } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';
import inhalt from '@/content/bpbetonfertigteile/BpBetonfertigteile.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

export default function BpBetonfertigteile() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'praxis' | 'innovation'>('allgemein');
  
  // State for interactive prefabricated element workshop
  const [selectedElement, setSelectedElement] = useState<'filigran' | 'doppelwand' | 'hohldiele'>('filigran');
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // Explanatory data for internal interactive hotspot highlights
  const elementParts: Record<string, { title: string; description: string; type: string }> = inhalt.daten["BpBetonfertigteile.elementParts"];

  const getPartExplanation = () => {
    if (!hoveredPart || !elementParts[hoveredPart]) {
      return (
        <div className="flex items-center justify-center h-full p-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <div className="text-slate-400 space-y-1.5 py-4">
            <Info className="w-5 h-5 mx-auto text-slate-350" />
            <p className="text-xs font-semibold"><MdText text={inhalt.texte.interaktiveHotspots} /></p>
            <p className="text-[10px] leading-snug"><MdText text={inhalt.texte.fahrenSieMitDer} /></p>
          </div>
        </div>
      );
    }

    const part = elementParts[hoveredPart];
    return (
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs transition-all animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="flex items-center justify-between border-b border-rose-100 pb-2 mb-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
            {part.type}
          </span>
          <span className="text-[9px] text-slate-400 font-mono">ID: {hoveredPart}</span>
        </div>
        <h5 className="font-extrabold text-slate-850 text-xs md:text-sm mb-1.5 flex items-center gap-1.5">
          <Target className="w-4 h-4 text-rose-600 shrink-0" />
          {part.title}
        </h5>
        <p className="text-[11px] text-slate-650 leading-relaxed font-normal">
          {part.description}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="bg-home-grau/5 border-b border-home-grau/10 px-6 py-5">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" /><MdText text={inhalt.texte.betonfertigteileBauprodukte} /></h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
            <p><MdText text={inhalt.texte.industriellVorgefertigteBetonbauteileBie} /></p>
          </div>
        </div>

        <ModuleTabs
          label={inhalt.werte.reiterBereiche}
          tabs={[
            { id: 'allgemein' as const, label: inhalt.texte.basiswissenElementkatalog, icon: BookOpen },
            { id: 'praxis' as const, label: 'Praxisbeispiele', icon: CheckCircle2 },
            { id: 'innovation' as const, label: 'Zukunftstrends', icon: Lightbulb },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6 [&>[role=tablist]]:px-6 [&>[role=tablist]]:pt-4"
        >
        
        <div className="p-6 pt-0 space-y-8">
          {activeTab === 'allgemein' ? (
            <div className="prose max-w-none text-gray-700 animate-in fade-in duration-300 space-y-8">
              <div>
                <p className="lead text-base font-medium text-slate-800 leading-relaxed"><MdText text={inhalt.texte.betonfertigteileSindTragendeOder} /></p>
                <p className="mt-2 text-sm text-slate-600"><MdText text={inhalt.texte.dieWesentlichenVorteileLiegen} /></p>
              </div>

              {/* INTERACTIVE COMPONENT WORKSHOP WITH SCHEMATICS */}
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 p-4 sm:p-6 shadow-xs">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.interaktivesElementenStudioMit} /></h4>
                      <p className="text-xs text-slate-600 font-medium"><MdText text={inhalt.texte.klickenSieAufEin} /></p>
                    </div>

                    {/* SELECTOR TABS */}
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 self-start md:self-auto shadow-xs text-xs font-bold shrink-0">
                      <button
                        onClick={() => {
                          setSelectedElement('filigran');
                          setHoveredPart(null);
                        }}
                        className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                          selectedElement === 'filigran'
                            ? 'bg-shiraz text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        Filigrandecke
                      </button>
                      <button
                        onClick={() => {
                          setSelectedElement('doppelwand');
                          setHoveredPart(null);
                        }}
                        className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                          selectedElement === 'doppelwand'
                            ? 'bg-shiraz text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        Doppelwand
                      </button>
                      <button
                        onClick={() => {
                          setSelectedElement('hohldiele');
                          setHoveredPart(null);
                        }}
                        className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                          selectedElement === 'hohldiele'
                            ? 'bg-shiraz text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        Spannbeton-Hohlplatte
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* LEFT COLUMN: INTERACTIVE SVG DRAWING */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs flex flex-col items-center justify-center relative min-h-[250px]">
                        
                        {/* 1. FILIGRAN DECKEN SVG */}
                        {selectedElement === 'filigran' && (
                          <svg 
                            viewBox="0 0 400 200" 
                            className="w-full h-auto select-none" 
                            style={{ maxHeight: '250px' }}
                            onMouseLeave={() => setHoveredPart(null)}
                          >
                            <defs>
                              <pattern id="grid-filigran" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid-filigran)" className="pointer-events-none" />
                            
                            {/* Ortbeton section (poured on top) */}
                            <rect 
                              x="50" y="35" width="300" height="75" 
                              fill={hoveredPart === 'ortbeton' ? '#f7ced6' : '#e2e8f0'} 
                              stroke={hoveredPart === 'ortbeton' ? '#A3113E' : '#475569'} 
                              strokeWidth="1.5" strokeDasharray="3 3"
                              className="transition-colors duration-150 cursor-pointer"
                              onMouseEnter={() => setHoveredPart('ortbeton')}
                              onClick={() => setHoveredPart('ortbeton')}
                            />
                            
                            {/* Precast slab (lower plate, 5cm) */}
                            <rect 
                              x="50" y="110" width="300" height="40" 
                              fill={hoveredPart === 'fertigteilplatte' ? '#f7ced6' : '#cbd5e1'} 
                              stroke={hoveredPart === 'fertigteilplatte' ? '#A3113E' : '#334155'} 
                              strokeWidth="2"
                              className="transition-colors duration-150 cursor-pointer"
                              onMouseEnter={() => setHoveredPart('fertigteilplatte')}
                              onClick={() => setHoveredPart('fertigteilplatte')}
                            />

                            {/* Rough joint interface */}
                            <line 
                              x1="50" y1="110" x2="350" y2="110" 
                              stroke="#A3113E" strokeWidth="2" strokeDasharray="5 3" 
                              className="pointer-events-none"
                            />

                            {/* Rebar lines upper mesh */}
                            <line 
                              x1="65" y1="75" x2="335" y2="75" 
                              stroke={hoveredPart === 'bewehrung' ? '#A3113E' : '#475569'} 
                              strokeWidth={hoveredPart === 'bewehrung' ? "2.5" : "1.5"}
                              strokeDasharray="4 4"
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredPart('bewehrung')}
                            />
                            <circle cx="100" cy="75" r="3" fill="#1e293b" className="cursor-pointer" onMouseEnter={() => setHoveredPart('bewehrung')} />
                            <circle cx="150" cy="75" r="3" fill="#1e293b" className="cursor-pointer" onMouseEnter={() => setHoveredPart('bewehrung')} />
                            <circle cx="200" cy="75" r="3" fill="#1e293b" className="cursor-pointer" onMouseEnter={() => setHoveredPart('bewehrung')} />
                            <circle cx="250" cy="75" r="3" fill="#1e293b" className="cursor-pointer" onMouseEnter={() => setHoveredPart('bewehrung')} />
                            <circle cx="300" cy="75" r="3" fill="#1e293b" className="cursor-pointer" onMouseEnter={() => setHoveredPart('bewehrung')} />

                            {/* Lattice Girder 1 (Gitterträger) */}
                            <path 
                              d="M 80,125 L 110,50 L 140,125" 
                              fill="none" 
                              stroke={hoveredPart === 'gittertraeger' ? '#A3113E' : '#A3113E'} 
                              strokeWidth={hoveredPart === 'gittertraeger' ? "4" : "2.5"}
                              className="transition-all duration-150 cursor-pointer"
                              onMouseEnter={() => setHoveredPart('gittertraeger')}
                              onClick={() => setHoveredPart('gittertraeger')}
                            />
                            <circle cx="110" cy="50" r="4" fill="#881235" className="cursor-pointer" onMouseEnter={() => setHoveredPart('gittertraeger')} />
                            <circle cx="80" cy="125" r="3" fill="#881235" className="cursor-pointer" onMouseEnter={() => setHoveredPart('gittertraeger')} />
                            <circle cx="140" cy="125" r="3" fill="#881235" className="cursor-pointer" onMouseEnter={() => setHoveredPart('gittertraeger')} />

                            {/* Lattice Girder 2 */}
                            <path 
                              d="M 220,125 L 250,50 L 280,125" 
                              fill="none" 
                              stroke={hoveredPart === 'gittertraeger' ? '#A3113E' : '#A3113E'} 
                              strokeWidth={hoveredPart === 'gittertraeger' ? "4" : "2.5"} 
                              className="transition-all duration-150 cursor-pointer"
                              onMouseEnter={() => setHoveredPart('gittertraeger')}
                              onClick={() => setHoveredPart('gittertraeger')}
                            />
                            <circle cx="250" cy="50" r="4" fill="#881235" className="cursor-pointer" onMouseEnter={() => setHoveredPart('gittertraeger')} />
                            <circle cx="220" cy="125" r="3" fill="#881235" className="cursor-pointer" onMouseEnter={() => setHoveredPart('gittertraeger')} />
                            <circle cx="280" cy="125" r="3" fill="#881235" className="cursor-pointer" onMouseEnter={() => setHoveredPart('gittertraeger')} />

                            {/* Explanatory direct visual keys */}
                            <line x1="110" y1="50" x2="160" y2="44" stroke="#A3113E" strokeWidth="0.75" className="pointer-events-none" />
                            <text x="165" y="47" className="text-[8px] font-bold font-mono fill-rose-700 pointer-events-none">1. Gitterträger (Schub)</text>

                            <line x1="200" y1="75" x2="210" y2="92" stroke="#475569" strokeWidth="0.75" className="pointer-events-none" />
                            <text x="175" y="101" className="text-[8px] font-bold fill-slate-650 pointer-events-none">4. Koppelbewehrung</text>

                            <line x1="260" y1="135" x2="260" y2="170" stroke="#1e293b" strokeWidth="0.75" className="pointer-events-none" />
                            <text x="220" y="179" className="text-[8px] font-extrabold fill-slate-800 pointer-events-none">3. Fertigteil (5cm)</text>

                            <line x1="330" y1="70" x2="350" y2="70" stroke="#64748b" strokeWidth="0.75" strokeDasharray="2 1" className="pointer-events-none" />
                            <text x="310" y="63" className="text-[8px] font-bold fill-slate-500 pointer-events-none">2. Ortbeton</text>

                            <text x="50" y="195" className="text-[9px] font-bold fill-slate-500 font-sans pointer-events-none">
                              Schnittdarstellung Element-Verbundplatte nach DIN EN 13747
                            </text>
                          </svg>
                        )}

                        {/* 2. DOPPELWAND SVG */}
                        {selectedElement === 'doppelwand' && (
                          <svg 
                            viewBox="0 0 400 200" 
                            className="w-full h-auto select-none" 
                            style={{ maxHeight: '250px' }}
                            onMouseLeave={() => setHoveredPart(null)}
                          >
                            <defs>
                              <pattern id="grid-doppelwand" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid-doppelwand)" className="pointer-events-none" />

                            {/* Left Precast Shell */}
                            <rect 
                              x="50" y="25" width="35" height="150" 
                              fill={hoveredPart === 'doppelwand-schale' ? '#f7ced6' : '#cbd5e1'} 
                              stroke={hoveredPart === 'doppelwand-schale' ? '#A3113E' : '#475569'} 
                              strokeWidth="1.5"
                              className="transition-colors duration-155 cursor-pointer"
                              onMouseEnter={() => setHoveredPart('doppelwand-schale')}
                              onClick={() => setHoveredPart('doppelwand-schale')}
                            />

                            {/* Right Precast Shell */}
                            <rect 
                              x="165" y="25" width="35" height="150" 
                              fill={hoveredPart === 'doppelwand-schale' ? '#f7ced6' : '#cbd5e1'} 
                              stroke={hoveredPart === 'doppelwand-schale' ? '#A3113E' : '#475569'} 
                              strokeWidth="1.5"
                              className="transition-colors duration-155 cursor-pointer"
                              onMouseEnter={() => setHoveredPart('doppelwand-schale')}
                              onClick={() => setHoveredPart('doppelwand-schale')}
                            />

                            {/* Inner Ortbeton core */}
                            <rect 
                              x="85" y="25" width="80" height="150" 
                              fill={hoveredPart === 'doppelwand-ortbeton' ? '#f7ced6' : '#cbd5e1'} 
                              opacity={hoveredPart === 'doppelwand-ortbeton' ? "0.7" : "0.35"}
                              stroke={hoveredPart === 'doppelwand-ortbeton' ? '#A3113E' : '#475569'} 
                              strokeWidth="1" strokeDasharray="3 3"
                              className="transition-all duration-155 cursor-pointer"
                              onMouseEnter={() => setHoveredPart('doppelwand-ortbeton')}
                              onClick={() => setHoveredPart('doppelwand-ortbeton')}
                            />

                            {/* Connector Gitterträger cross elements */}
                            <path 
                              d="M 75,50 L 175,70 M 75,70 L 175,50" 
                              stroke={hoveredPart === 'doppelwand-truss' ? '#A3113E' : '#A3113E'} 
                              strokeWidth={hoveredPart === 'doppelwand-truss' ? "3.5" : "2"}
                              className="transition-colors duration-150 cursor-pointer"
                              onMouseEnter={() => setHoveredPart('doppelwand-truss')}
                              onClick={() => setHoveredPart('doppelwand-truss')}
                            />
                            <circle cx="75" cy="60" r="3" fill="#A3113E" className="pointer-events-none" />
                            <circle cx="175" cy="60" r="3" fill="#A3113E" className="pointer-events-none" />

                            <path 
                              d="M 75,125 L 175,145 M 75,145 L 175,125" 
                              stroke={hoveredPart === 'doppelwand-truss' ? '#A3113E' : '#A3113E'} 
                              strokeWidth={hoveredPart === 'doppelwand-truss' ? "3.5" : "2"}
                              className="transition-colors duration-150 cursor-pointer"
                              onMouseEnter={() => setHoveredPart('doppelwand-truss')}
                              onClick={() => setHoveredPart('doppelwand-truss')}
                            />
                            <circle cx="75" cy="135" r="3" fill="#A3113E" className="pointer-events-none" />
                            <circle cx="175" cy="135" r="3" fill="#A3113E" className="pointer-events-none" />

                            {/* Fugen-Zusatzbewehrung rebars (vertical/horizontal lines) */}
                            <line 
                              x1="125" y1="30" x2="125" y2="170" 
                              stroke={hoveredPart === 'doppelwand-fugen' ? '#475569' : '#475569'} 
                              strokeWidth={hoveredPart === 'doppelwand-fugen' ? "3" : "1.5"}
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredPart('doppelwand-fugen')}
                            />
                            <circle cx="125" cy="90" r="4" fill="#334155" className="cursor-pointer" onMouseEnter={() => setHoveredPart('doppelwand-fugen')} />
                            <circle cx="125" cy="110" r="4" fill="#334155" className="cursor-pointer" onMouseEnter={() => setHoveredPart('doppelwand-fugen')} />

                            {/* Annotations */}
                            <line x1="68" y1="100" x2="240" y2="100" stroke="#334155" strokeWidth="0.75" strokeDasharray="3 1" className="pointer-events-none" />
                            <text x="245" y="103" className="text-[8px] font-bold fill-slate-700 pointer-events-none">1. Fertigteil-Außenschale</text>

                            <line x1="105" y1="63" x2="240" y2="80" stroke="#A3113E" strokeWidth="0.75" className="pointer-events-none" />
                            <text x="245" y="83" className="text-[8px] font-bold font-mono fill-rose-700 pointer-events-none">2. Verbindungsanker (Zugträger)</text>

                            <line x1="140" y1="150" x2="240" y2="150" stroke="#1e293b" strokeWidth="0.75" className="pointer-events-none" />
                            <text x="245" y="153" className="text-[8px] font-bold fill-slate-500 pointer-events-none">3. Flüssiger Füllbetonkern</text>

                            <line x1="125" y1="90" x2="240" y2="125" stroke="#475569" strokeWidth="0.75" className="pointer-events-none" />
                            <text x="245" y="128" className="text-[8px] font-bold fill-sky-850 pointer-events-none">4. Stoßbewehrung (Bügel)</text>

                            <text x="50" y="195" className="text-[9px] font-bold fill-slate-500 font-sans pointer-events-none">
                              Aufschnitt-Plan einer Hohlwandmontage (DIN EN 14992)
                            </text>
                          </svg>
                        )}

                        {/* 3. HOHLDIELE SVG */}
                        {selectedElement === 'hohldiele' && (
                          <svg 
                            viewBox="0 0 400 200" 
                            className="w-full h-auto select-none" 
                            style={{ maxHeight: '250px' }}
                            onMouseLeave={() => setHoveredPart(null)}
                          >
                            <defs>
                              <pattern id="grid-hohldiele" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid-hohldiele)" className="pointer-events-none" />

                            {/* Base Hollowcore Slab elements */}
                            <rect 
                              x="35" y="45" width="330" height="95" rx="4"
                              fill={hoveredPart === 'hohldiele-body' ? '#f7ced6' : '#cbd5e1'} 
                              stroke={hoveredPart === 'hohldiele-body' ? '#A3113E' : '#475569'} 
                              strokeWidth="2"
                              className="transition-colors duration-150 cursor-pointer"
                              onMouseEnter={() => setHoveredPart('hohldiele-body')}
                              onClick={() => setHoveredPart('hohldiele-body')}
                            />

                            {/* Continuous circular voids (Hohlkanäle) */}
                            { [75, 137, 200, 263, 325].map((cx) => (
                              <circle 
                                key={cx} cx={cx} cy="88" r="21" 
                                fill={hoveredPart === 'hohldiele-voids' ? '#fbe5e9' : '#f8fafc'} 
                                stroke={hoveredPart === 'hohldiele-voids' ? '#A3113E' : '#64748b'} 
                                strokeWidth={hoveredPart === 'hohldiele-voids' ? "2.5" : "1.2"}
                                className="transition-all duration-150 cursor-pointer"
                                onMouseEnter={() => setHoveredPart('hohldiele-voids')}
                                onClick={() => setHoveredPart('hohldiele-voids')}
                              />
                            ))}

                            {/* High-Tensile Prestressed Cables at bottom (Spannstähle) */}
                            { [55, 80, 105, 130, 155, 180, 205, 230, 255, 280, 305, 330, 345].map((cx) => (
                              <circle 
                                key={cx} cx={cx} cy="125" r="3.2" 
                                fill={hoveredPart === 'hohldiele-cables' ? '#A3113E' : '#A3113E'} 
                                stroke="#881235" strokeWidth="1"
                                className="transition-colors duration-150 cursor-pointer"
                                onMouseEnter={() => setHoveredPart('hohldiele-cables')}
                                onClick={() => setHoveredPart('hohldiele-cables')}
                              />
                            ))}

                            {/* Pointer Lines & Labels */}
                            <line x1="200" y1="88" x2="200" y2="23" stroke="#475569" strokeWidth="0.75" strokeDasharray="3 1" className="pointer-events-none" />
                            <text x="200" y="19" textAnchor="middle" className="text-[8px] font-bold fill-slate-650 pointer-events-none">
                              1. Gewichtsaussparende Hohlkanäle (reduziert Eigenlast um ~40 %)
                            </text>

                            <line x1="155" y1="125" x2="155" y2="158" stroke="#A3113E" strokeWidth="0.75" className="pointer-events-none" />
                            <text x="155" y="167" textAnchor="middle" className="text-[8px] font-mono font-bold fill-rose-700 pointer-events-none">
                              2. Vorgespannte Drahtlitzen (Spannstahl St 1660/1860) im Untergurt
                            </text>

                            <line x1="335" y1="110" x2="335" y2="182" stroke="#475569" strokeWidth="0.75" className="pointer-events-none" />
                            <text x="335" y="191" textAnchor="middle" className="text-[8px] font-bold fill-slate-800 pointer-events-none">
                              3. Hohe Betongüte (C50/60)
                            </text>

                            <text x="35" y="195" className="text-[9px] font-bold fill-slate-500 font-sans pointer-events-none">
                              Querschnitt einer vorgespannten System-Hohlplatte (DIN EN 1168)
                            </text>
                          </svg>
                        )}
                        
                        {/* Hover hint */}
                        <span className="absolute bottom-1 right-2 text-[8px] text-slate-400 font-mono flex items-center gap-1">
                          Hover-aktiviert <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                        </span>
                      </div>

                      {/* QUICK HOTSPOT BUTTONS FOR MOBILE USERS & ENHANCED NAVIGATION */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-extrabold text-slate-600 block uppercase tracking-wider mb-2">Skizzen-Komponenten:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedElement === 'filigran' && (
                            <>
                              <button 
                                onMouseEnter={() => setHoveredPart('gittertraeger')} 
                                onMouseLeave={() => setHoveredPart(null)}
                                className="px-2 py-1 text-[10px] rounded bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold transition-all cursor-pointer"
                              >
                                Gitterträger
                              </button>
                              <button 
                                onMouseEnter={() => setHoveredPart('ortbeton')} 
                                onMouseLeave={() => setHoveredPart(null)}
                                className="px-2 py-1 text-[10px] rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                              >
                                Ortbeton-Aufguss
                              </button>
                              <button 
                                onMouseEnter={() => setHoveredPart('fertigteilplatte')} 
                                onMouseLeave={() => setHoveredPart(null)}
                                className="px-2 py-1 text-[10px] rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                              ><MdText text={inhalt.texte.t5cmSchalungsplatte} /></button>
                              <button 
                                onMouseEnter={() => setHoveredPart('bewehrung')} 
                                onMouseLeave={() => setHoveredPart(null)}
                                className="px-2 py-1 text-[10px] rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                              >
                                Stoßfugenbewehrung
                              </button>
                            </>
                          )}

                          {selectedElement === 'doppelwand' && (
                            <>
                              <button 
                                onMouseEnter={() => setHoveredPart('doppelwand-schale')} 
                                onMouseLeave={() => setHoveredPart(null)}
                                className="px-2 py-1 text-[10px] rounded bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold transition-all cursor-pointer"
                              >
                                Beton-Außenschalen
                              </button>
                              <button 
                                onMouseEnter={() => setHoveredPart('doppelwand-ortbeton')} 
                                onMouseLeave={() => setHoveredPart(null)}
                                className="px-2 py-1 text-[10px] rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                              >
                                Ortbeton-Fließkern
                              </button>
                              <button 
                                onMouseEnter={() => setHoveredPart('doppelwand-truss')} 
                                onMouseLeave={() => setHoveredPart(null)}
                                className="px-2 py-1 text-[10px] rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                              >
                                Distanzträger
                              </button>
                              <button 
                                onMouseEnter={() => setHoveredPart('doppelwand-fugen')} 
                                onMouseLeave={() => setHoveredPart(null)}
                                className="px-2 py-1 text-[10px] rounded bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 font-bold transition-all cursor-pointer"
                              >
                                Stoßfugenverbinder
                              </button>
                            </>
                          )}

                          {selectedElement === 'hohldiele' && (
                            <>
                              <button 
                                onMouseEnter={() => setHoveredPart('hohldiele-voids')} 
                                onMouseLeave={() => setHoveredPart(null)}
                                className="px-2 py-1 text-[10px] rounded bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold transition-all cursor-pointer"
                              >
                                Kreis-Hohlräume
                              </button>
                              <button 
                                onMouseEnter={() => setHoveredPart('hohldiele-cables')} 
                                onMouseLeave={() => setHoveredPart(null)}
                                className="px-2 py-1 text-[10px] rounded bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold transition-all cursor-pointer"
                              >
                                Vorspannlitzen
                              </button>
                              <button 
                                onMouseEnter={() => setHoveredPart('hohldiele-body')} 
                                onMouseLeave={() => setHoveredPart(null)}
                                className="px-2 py-1 text-[10px] rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                              ><MdText text={inhalt.texte.c5060Hohlplattenkörper} /></button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: DETAILED TECHNICAL DESCRIPTION */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                      
                      {/* Interactive Explanation Box */}
                      {getPartExplanation()}

                      {/* Standard Technical Parameters Panel */}
                      <div className="bg-slate-50 text-slate-800 p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 font-sans">
                        <span className="text-[10px] font-bold text-rose-700 tracking-wider uppercase flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                          <Info size={12} /><MdText text={inhalt.texte.technischeKennwerteDinNormung} /></span>

                        {selectedElement === 'filigran' && (
                          <div className="space-y-2 text-[11px]">
                            <p className="leading-relaxed font-light text-slate-600"><MdText text={inhalt.texte.dieFiligrandeckeElementdeckeNach} /></p>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[10px]">
                              <div>
                                <span className="text-slate-500 block font-mono">Regelwerk:</span>
                                <strong className="text-slate-900 block font-semibold"><MdText text={inhalt.texte.dinEn13747} /></strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Plattenstärken:</span>
                                <strong className="text-slate-900 block font-semibold"><MdText text={inhalt.texte.t47CmFertigteil} /></strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono"><MdText text={inhalt.texte.stützweitenMax} /></span>
                                <strong className="text-slate-900 block font-semibold"><MdText text={inhalt.texte.bis750M} /></strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Montagestützen:</span>
                                <strong className="text-rose-700 block font-bold"><MdText text={inhalt.texte.zwingendNötig} /></strong>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedElement === 'doppelwand' && (
                          <div className="space-y-2 text-[11px]">
                            <p className="leading-relaxed font-light text-slate-600"><MdText text={inhalt.texte.dieDoppelwandHohlwandNach} /></p>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[10px]">
                              <div>
                                <span className="text-slate-500 block font-mono">Regelwerk:</span>
                                <strong className="text-slate-900 block font-semibold"><MdText text={inhalt.texte.dinEn14992} /></strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Wandstärken:</span>
                                <strong className="text-slate-900 block font-semibold"><MdText text={inhalt.texte.t20243036} /></strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Schalungsdruck:</span>
                                <strong className="text-slate-900 block font-semibold"><MdText text={inhalt.texte.bemessungNachDin18218} /></strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Betonier-Limit:</span>
                                <strong className="text-rose-700 block font-bold"><MdText text={inhalt.texte.maxV15} /></strong>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedElement === 'hohldiele' && (
                          <div className="space-y-2 text-[11px]">
                            <p className="leading-relaxed font-light text-slate-600"><MdText text={inhalt.texte.dieSpannbetonHohlplatteNach} /></p>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[10px]">
                              <div>
                                <span className="text-slate-500 block font-mono">Regelwerk:</span>
                                <strong className="text-slate-900 block font-semibold">DIN EN 1168</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono"><MdText text={inhalt.texte.stützweitenMax2} /></span>
                                <strong className="text-slate-900 block font-semibold"><MdText text={inhalt.texte.bisZu20Meter} /></strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Gewichtsreduktion:</span>
                                <strong className="text-slate-900 block font-semibold"><MdText text={inhalt.texte.ca4045Einsparung} /></strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Verlegung:</span>
                                <strong className="text-emerald-700 block font-bold"><MdText text={inhalt.texte.sofortBelastbar} /></strong>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* GEOMETERIE & DETAILBESCHREIBUNG ENGLISCH/DEUTSCH */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <span className="text-[10px] font-bold text-shiraz bg-rose-50 px-2 py-0.5 rounded tracking-wide uppercase">Element 1</span>
                  <h3 className="font-extrabold text-slate-850 text-xs md:text-sm flex items-center gap-1.5 mt-1 border-b border-slate-200 pb-2">
                    <Building2 className="w-4 h-4 text-stone-600 shrink-0" /><MdText text={inhalt.texte.filigrandeckeElementdecke} /></h3>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-normal"><MdText text={inhalt.texte.dasHalbfertigteilVereintDie} /></p>
                  <div className="text-[10px] text-slate-600 bg-white p-3 rounded-lg border border-slate-100/80 space-y-1.5 font-medium">
                    <span className="font-bold text-slate-800"><MdText text={inhalt.texte.montageAxiom} /></span>
                    <span><MdText text={inhalt.texte.bauseitigeMontagestützenMüssenVor} /></span>
                  </div>
                </div>

                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <span className="text-[10px] font-bold text-shiraz bg-rose-50 px-2 py-0.5 rounded tracking-wide uppercase">Element 2</span>
                  <h3 className="font-extrabold text-slate-850 text-xs md:text-sm flex items-center gap-1.5 mt-1 border-b border-slate-200 pb-2">
                    <Building2 className="w-4 h-4 text-stone-600 shrink-0" /><MdText text={inhalt.texte.doppelwandHohlwand} /></h3>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-normal"><MdText text={inhalt.texte.dieHohlwandErsetztDie} /></p>
                  <div className="text-[10px] text-slate-600 bg-white p-3 rounded-lg border border-slate-100/80 space-y-1.5 font-medium">
                    <span className="font-bold text-slate-800"><MdText text={inhalt.texte.einbauAxiom} /></span>
                    <span><MdText text={inhalt.texte.wandanschlusseisenAnschlussschwerterOder} /></span>
                  </div>
                </div>

                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <span className="text-[10px] font-bold text-shiraz bg-rose-50 px-2 py-0.5 rounded tracking-wide uppercase">Element 3</span>
                  <h3 className="font-extrabold text-slate-850 text-xs md:text-sm flex items-center gap-1.5 mt-1 border-b border-slate-200 pb-2">
                    <Cuboid className="w-4 h-4 text-stone-600 shrink-0" /> Spannbeton-Hohldiele
                  </h3>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-normal"><MdText text={inhalt.texte.sofortVollTragfähigeDeckenelemente} /></p>
                  <div className="text-[10px] text-slate-600 bg-white p-3 rounded-lg border border-slate-100/80 space-y-1.5 font-medium">
                    <span className="font-bold text-slate-800"><MdText text={inhalt.texte.frostgefahrAxiom} /></span>
                    <span><MdText text={inhalt.texte.imWinterMussBauseits} /></span>
                  </div>
                </div>
              </div>

              {/* CONSTRUCTIVE OVERVIEW BENTO GRID */}
              <div>
                <h3 className="text-lg font-bold text-home-prim mt-8 mb-4"><MdText text={inhalt.texte.konstruktionsklassenVonFertigteilenIm} /></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                    <h4 className="font-bold text-shiraz mb-2 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-stone-600" /><MdText text={inhalt.texte.konstruktiverSkelettbauMassivbauten} /></h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs mt-3">
                      <li><MdText text={inhalt.texte.skelettStützenWerdenMeist} /></li>
                      <li><MdText text={inhalt.texte.spannbetonTrägerGroßeI} /></li>
                      <li><MdText text={inhalt.texte.treppenläufePodesteIndustriellMit} /></li>
                    </ul>
                  </div>

                  <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                    <h4 className="font-bold text-shiraz mb-2 flex items-center gap-2">
                      <Cuboid className="w-5 h-5 text-stone-600" /><MdText text={inhalt.texte.tiefbauSpezialSchwerlastfertigteile} /></h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs mt-3">
                      <li><MdText text={inhalt.texte.tunnelTübbingeKreissegmenteAus} /></li>
                      <li><MdText text={inhalt.texte.eisenbahnschwellenHoheErmüdungsfestigkei} /></li>
                      <li><MdText text={inhalt.texte.verkehrsLeitelementeLärmschutzModule} /></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* ADVANTAGES & CHALLENGES */}
              <h3 className="text-lg font-bold text-home-prim mt-8 mb-4"><MdText text={inhalt.texte.bilanzVorUndNachteile} /></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl">
                  <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" /><MdText text={inhalt.texte.vorteileDerIndustriellenFertigung} /></h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-emerald-800">
                    <li><MdText text={inhalt.texte.gütekontrolleWpkWitterungsunabhängigesGi} /></li>
                    <li><MdText text={inhalt.texte.monolithischerSichtbetonStandardGlatte} /></li>
                    <li><MdText text={inhalt.texte.einsparungVonSchalarbeitenElementdecken} /></li>
                    <li><MdText text={inhalt.texte.spannbettVorspannungSichertSchlanke} /></li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl">
                  <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-700" /><MdText text={inhalt.texte.ingenieurmäßigeHerausforderungen} /></h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-amber-800">
                    <li><MdText text={inhalt.texte.hoherPlanerischerVorlaufSämtliche} /></li>
                    <li><MdText text={inhalt.texte.schwertransportLogistikTransportVon} /></li>
                    <li><MdText text={inhalt.texte.statischeFugenproblematikKnotenpunkteAn} /></li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl">
                <p className="text-xs text-slate-650 leading-relaxed font-normal"><MdText text={inhalt.texte.bauaufsichtlicheZulassungGemäßDin} /></p>
              </div>
            </div>
          ) : activeTab === 'praxis' ? (
            <PraxisTabContent moduleKey="bp_betonfertigteile" />
          ) : (
            <InnovationTabContent moduleKey="bp_betonfertigteile" />
          )}
        </div>
        </ModuleTabs>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielEigengewichtSpannbeton}
          zielGleichung="g_{Hohl} \approx (1 - \eta) \cdot h \cdot \gamma_c"
          normQuelle={inhalt.werte.dinEn1168Hohlraumanteil}
          schritte={inhalt.daten["BpBetonfertigteile.schritte"]}
          ergebnisHinweis={inhalt.werte.maßgebendSindDieHerstellerangaben}
        />
      </div>

      <ModulTest moduleId="bp_betonfertigteile" />

      <ModuleFooter
        wikipedia={[
          { title: 'Betonfertigteil', url: 'https://de.wikipedia.org/wiki/Betonfertigteil' },
          { title: 'Spannbeton', url: 'https://de.wikipedia.org/wiki/Spannbeton' },
          { title: 'Filigrandecke', url: 'https://de.wikipedia.org/wiki/Elementdecke' }
        ]}
        literatur={inhalt.daten["BpBetonfertigteile.literatur"]}
        regelwerke={inhalt.daten["BpBetonfertigteile.regelwerke"]}
        formeln={inhalt.daten["BpBetonfertigteile.formeln"]}
      />
    </div>
  );
}
