import React, { useState } from 'react';
import { Layers, GripHorizontal, Info, BookOpen, CheckCircle2, Lightbulb, Target, Sparkles, Droplet, Zap, Eye, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';
import inhalt from '@/content/bpbetonwaren/BpBetonwaren.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function BpBetonwaren() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'praxis' | 'innovation'>('allgemein');
  
  // State for interactive workshop
  const [selectedStudio, setSelectedStudio] = useState<'paving' | 'pipe'>('paving');
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  // Hotspot explanations for paving and pipes
  const studioData: Record<string, { title: string; description: string; tag: string }> = inhalt.daten["BpBetonwaren.studioData"];

  const currentStudioInfo = () => {
    if (!hoveredHotspot || !studioData[hoveredHotspot]) {
      return (
        <div className="flex items-center justify-center h-full p-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <div className="text-slate-400 space-y-1.5 py-6">
            <Info className="w-5 h-5 mx-auto text-slate-350" />
            <p className="text-xs font-bold text-slate-600"><MdText text={inhalt.texte.interaktiveMaterialanalyse} /></p>
            <p className="text-[10px] leading-snug text-slate-500"><MdText text={inhalt.texte.bewegenSieDieMaus} /></p>
          </div>
        </div>
      );
    }

    const data = studioData[hoveredHotspot];
    return (
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs transition-all animate-in fade-in slide-in-from-bottom-2 duration-150">
        <div className="flex items-center justify-between border-b border-rose-100 pb-2 mb-2.5">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#A3113E] bg-rose-50 px-2 py-0.5 rounded">
            {data.tag}
          </span>
          <span className="text-[9px] text-slate-400 font-mono">CODE: {hoveredHotspot}</span>
        </div>
        <h5 className="font-extrabold text-slate-800 text-xs md:text-sm mb-1.5 flex items-center gap-1.5">
          <Target className="w-4 h-4 text-rose-600 shrink-0" />
          {data.title}
        </h5>
        <p className="text-[11px] text-slate-650 leading-relaxed font-normal">
          {data.description}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        {/* HEADER SECTION */}
        <div className="bg-home-grau/5 border-b border-home-grau/10 px-6 py-5">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" /><MdText text={inhalt.texte.betonwarenBauprodukteTiefbau} /></h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
            <p><MdText text={inhalt.texte.geprägtDurchUnbewehrteProfile} /></p>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6 px-6 pt-4">
          <button aria-pressed={activeTab === 'allgemein'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <BookOpen size={16} /><MdText text={inhalt.texte.basiswissenMaterialanalyse} /></button>
          <button aria-pressed={activeTab === 'praxis'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
              activeTab === 'praxis' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('praxis')}
          >
            <CheckCircle2 size={16} /> Praxisbeispiele
          </button>
          <button aria-pressed={activeTab === 'innovation'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
              activeTab === 'innovation' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('innovation')}
          >
            <Lightbulb size={16} /> Zukunftstrends
          </button>
        </div>
        
        {/* MAIN BODY AREA */}
        <div className="p-6 pt-0 space-y-8">
          {activeTab === 'allgemein' ? (
            <div className="prose max-w-none text-gray-750 animate-in fade-in duration-300 space-y-8">
              
              {/* INTRODUCTORY SECTION */}
              <div>
                <p className="lead text-base font-medium text-slate-800 leading-relaxed"><MdText text={inhalt.texte.imGegensatzZuGroßformatigen} /></p>
                <p className="mt-2 text-xs md:text-sm text-slate-600 leading-relaxed"><MdText text={inhalt.texte.dieWesentlichenFertigungstechnischenErru} /></p>
              </div>

              {/* INTERACTIVE BETONWAREN STUDIO WITH DETAILED VECTOR SCHEMATICS */}
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 p-4 sm:p-6 shadow-xs">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="text-shiraz w-4.5 h-4.5" /><MdText text={inhalt.texte.interaktivesBetonwarenZertifizierungsstu} /></h4>
                      <p className="text-xs text-slate-650 font-medium"><MdText text={inhalt.texte.wählenSieEineBauteilskizze} /></p>
                    </div>

                    {/* STUDIO TOGGLE BUTTONS */}
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-xxs text-xs font-bold gap-1">
                      <button
                        onClick={() => {
                          setSelectedStudio('paving');
                          setHoveredHotspot(null);
                        }}
                        className={`px-3 py-2 cursor-pointer rounded-lg transition-all flex items-center gap-1.5 ${
                          selectedStudio === 'paving'
                            ? 'bg-shiraz text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <GripHorizontal className="w-3.5 h-3.5" /><MdText text={inhalt.texte.t1PflastersteinVorsatz} /></button>
                      <button
                        onClick={() => {
                          setSelectedStudio('pipe');
                          setHoveredHotspot(null);
                        }}
                        className={`px-3 py-2 cursor-pointer rounded-lg transition-all flex items-center gap-1.5 ${
                          selectedStudio === 'pipe'
                            ? 'bg-shiraz text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /><MdText text={inhalt.texte.t2BetonrohrMuffung} /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* LEFT COLUMN: HIGH-CONTRAST PROFESSIONAL VECTOR ILLUSTRATION */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                      
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs flex flex-col items-center justify-center relative min-h-[300px]">
                        
                        {/* SCHEME A: PAVING CROSS-SECTION WITH COMPACTION PRESSURE */}
                        {/* SCHEME A: PAVING CROSS-SECTION WITH COMPACTION PRESSURE */}
                        {selectedStudio === 'paving' && (
                          <svg 
                            viewBox="0 0 420 220" 
                            className="w-full h-auto select-none" 
                            style={{ maxHeight: '280px' }}
                            onMouseLeave={() => setHoveredHotspot(null)}
                          >
                            <defs>
                              <pattern id="grid-paving" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f8fafc" strokeWidth="1" />
                              </pattern>
                              
                              {/* Texture for core concrete (rough aggregate circles) */}
                              <pattern id="aggregate-core" width="25" height="25" patternUnits="userSpaceOnUse">
                                <circle cx="3" cy="5" r="2" fill="#94a3b8" />
                                <circle cx="12" cy="18" r="3.5" fill="#64748b" />
                                <circle cx="20" cy="8" r="1.5" fill="#cbd5e1" />
                                <path d="M5,15 L10,12 L8,20 Z" fill="#94a3b8" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid-paving)" className="pointer-events-none" />

                            {/* Background shadow card of the paving stones */}
                            <rect x="50" y="30" width="180" height="150" rx="3" fill="#f1f5f9" opacity="0.6" className="pointer-events-none" />

                            {/* 1. Core Concrete (Hinterbeton/Kernbeton) - the thick lower block */}
                            <path 
                              d="M 50,70 L 230,70 L 230,180 L 50,180 Z" 
                              fill="url(#aggregate-core)" 
                              stroke={hoveredHotspot === 'paving-kern' ? '#A3113E' : '#475569'} 
                              strokeWidth={hoveredHotspot === 'paving-kern' ? "3" : "1.5"}
                              className="transition-all duration-150 cursor-pointer"
                              onMouseEnter={() => setHoveredHotspot('paving-kern')}
                              onClick={() => setHoveredHotspot('paving-kern')}
                            />

                            {/* 2. Face Concrete (Vorsatzbeton) - the top high-quality layer */}
                            <path 
                              d="M 50,30 L 230,30 L 230,70 L 50,70 Z" 
                              fill={hoveredHotspot === 'paving-vorsatz' ? '#f7ced6' : '#e2e8f0'} 
                              stroke={hoveredHotspot === 'paving-vorsatz' ? '#A3113E' : '#334155'} 
                              strokeWidth={hoveredHotspot === 'paving-vorsatz' ? "3" : "2"}
                              className="transition-colors duration-150 cursor-pointer animate-pulse"
                              onMouseEnter={() => setHoveredHotspot('paving-vorsatz')}
                              onClick={() => setHoveredHotspot('paving-vorsatz')}
                            />

                            {/* Monolithisch border (Interface Line) */}
                            <line 
                              x1="50" y1="70" x2="230" y2="70" 
                              stroke={hoveredHotspot === 'paving-interface' ? '#A3113E' : '#A3113E'} 
                              strokeWidth={hoveredHotspot === 'paving-interface' ? "4.5" : "2.5"} 
                              strokeDasharray={hoveredHotspot === 'paving-interface' ? "0" : "5 2"}
                              className="cursor-pointer transition-all duration-150"
                              onMouseEnter={() => setHoveredHotspot('paving-interface')}
                              onClick={() => setHoveredHotspot('paving-interface')}
                            />

                            {/* Compaction Mechanical Stamps / Vibration Symbols */}
                            <g className="opacity-80">
                              {/* Left mold bracket (for de-molding sketch) */}
                              <path d="M 40,25 L 45,25 L 45,185 L 40,185" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" className="pointer-events-none" />
                              {/* Right mold bracket */}
                              <path d="M 240,25 L 235,25 L 235,185 L 240,185" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" className="pointer-events-none" />
                              
                              {/* Double arrow showing mold raise (Stripping / Entschalen) */}
                              <path 
                                d="M 255,140 L 255,80 M 255,80 L 251,85 M 255,80 L 259,85" 
                                fill="none" stroke="#A3113E" strokeWidth="2" 
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredHotspot('paving-demold')}
                              />
                            </g>

                            {/* Direct annotations with pointing lines */}
                            {/* Vorsatz label */}
                            <line x1="140" y1="50" x2="280" y2="50" stroke="#0f172a" strokeWidth="0.75" className="pointer-events-none" />
                            <circle cx="140" cy="50" r="3" fill="#0f172a" className="pointer-events-none" />
                            <text x="285" y="53" className="text-[9px] font-extrabold fill-slate-800 pointer-events-none">1. Vorsatzbeton (4-8mm)</text>

                            {/* Interface layer label */}
                            <line x1="90" y1="70" x2="280" y2="90" stroke="#881235" strokeWidth="0.75" className="pointer-events-none" />
                            <circle cx="90" cy="70" r="3.5" fill="#881235" className="pointer-events-none" />
                            <text x="285" y="93" className="text-[9px] font-extrabold fill-rose-700 font-mono pointer-events-none">2. Nass-in-Nass Verbund</text>

                            {/* Kernbeton label */}
                            <line x1="160" y1="120" x2="280" y2="120" stroke="#475569" strokeWidth="0.75" className="pointer-events-none" />
                            <circle cx="160" cy="120" r="3" fill="#475569" className="pointer-events-none" />
                            <text x="285" y="123" className="text-[9px] font-bold fill-slate-700 pointer-events-none">3. Kernbeton (Hinterbeton)</text>

                            {/* Sofortentschalung/Grünstand label */}
                            <line x1="255" y1="110" x2="280" y2="150" stroke="#475569" strokeWidth="0.75" className="pointer-events-none" />
                            <text x="285" y="153" className="text-[9px] font-bold fill-slate-500 pointer-events-none">4. Sofortentschalung (Rütteln)</text>

                            {/* Explanatory text underlay */}
                            <text x="50" y="210" className="text-[8.5px] font-bold fill-slate-400 font-mono pointer-events-none">
                              2-Schicht Pflasterquerschnitt mit "Sofortentschalungs"-Schnittstelle
                            </text>
                          </svg>
                        )}

                        {/* SCHEME B: PIPELINES, SPIGOT AND GASKETS */}
                        {selectedStudio === 'pipe' && (
                          <svg 
                            viewBox="0 0 420 220" 
                            className="w-full h-auto select-none" 
                            style={{ maxHeight: '280px' }}
                            onMouseLeave={() => setHoveredHotspot(null)}
                          >
                            <defs>
                              <pattern id="grid-pipe" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f8fafc" strokeWidth="1" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid-pipe)" className="pointer-events-none" />

                            {/* 1. Pipe A Left (Containing the Glockenmuffe/Socket) */}
                            <path 
                              d="M 25,45 H 175 V 25 H 195 V 70 H 145 V 55 H 25 Z" 
                              fill={hoveredHotspot === 'pipe-socket' ? '#f7ced6' : '#cbd5e1'} 
                              stroke={hoveredHotspot === 'pipe-socket' ? '#A3113E' : '#475569'} 
                              strokeWidth="1.5"
                              className="transition-colors duration-150 cursor-pointer"
                              onMouseEnter={() => setHoveredHotspot('pipe-socket')}
                              onClick={() => setHoveredHotspot('pipe-socket')}
                            />
                            {/* Symmetric lower profile of left pipe */}
                            <path 
                              d="M 25,175 H 175 V 195 H 195 V 150 H 145 V 165 H 25 Z" 
                              fill={hoveredHotspot === 'pipe-socket' ? '#f7ced6' : '#cbd5e1'} 
                              stroke={hoveredHotspot === 'pipe-socket' ? '#A3113E' : '#475569'} 
                              strokeWidth="1.5"
                              className="transition-colors duration-150 cursor-pointer"
                              onMouseEnter={() => setHoveredHotspot('pipe-socket')}
                              onClick={() => setHoveredHotspot('pipe-socket')}
                            />

                            {/* 2. Pipe B Right (Spitzende/Spigot inserting into bell) */}
                            <path 
                              d="M 135,40 H 400 V 30 H 135 Z" 
                              fill={hoveredHotspot === 'pipe-spigot' ? '#f7ced6' : '#94a3b8'} 
                              stroke={hoveredHotspot === 'pipe-spigot' ? '#A3113E' : '#334155'} 
                              strokeWidth="1.5"
                              className="transition-colors duration-150 cursor-pointer"
                              onMouseEnter={() => setHoveredHotspot('pipe-spigot')}
                              onClick={() => setHoveredHotspot('pipe-spigot')}
                            />
                            {/* Symmetric lower profile of right pipe */}
                            <path 
                              d="M 135,180 H 400 V 190 H 135 Z" 
                              fill={hoveredHotspot === 'pipe-spigot' ? '#f7ced6' : '#94a3b8'} 
                              stroke={hoveredHotspot === 'pipe-spigot' ? '#A3113E' : '#334155'} 
                              strokeWidth="1.5"
                              className="transition-colors duration-150 cursor-pointer"
                              onMouseEnter={() => setHoveredHotspot('pipe-spigot')}
                              onClick={() => setHoveredHotspot('pipe-spigot')}
                            />

                            {/* 3. Elastomeric Dichtring / Keilgleitdichtung in action */}
                            <circle 
                              cx="171" cy="48" r="7" 
                              fill={hoveredHotspot === 'pipe-seal' ? '#A3113E' : '#A3113E'} 
                              stroke="#A3113E" strokeWidth="2.5"
                              className="transition-all duration-150 cursor-pointer animate-bounce"
                              onMouseEnter={() => setHoveredHotspot('pipe-seal')}
                              onClick={() => setHoveredHotspot('pipe-seal')}
                            />
                            <circle 
                              cx="171" cy="172" r="7" 
                              fill={hoveredHotspot === 'pipe-seal' ? '#A3113E' : '#A3113E'} 
                              stroke="#A3113E" strokeWidth="2.5"
                              className="transition-all duration-150 cursor-pointer"
                              onMouseEnter={() => setHoveredHotspot('pipe-seal')}
                              onClick={() => setHoveredHotspot('pipe-seal')}
                            />

                            {/* 4. Sewage center & BSK zones (Gaseous space warning zone) */}
                            <text x="210" y="110" className="text-[8px] font-bold fill-red-650 animate-pulse pointer-events-none">
                              Aggressive Gase (H₂S) ➔ Deckenkondensation (BSK)
                            </text>
                            
                            {/* Corrosion indicator line on top interior edge of pipe */}
                            <line 
                              x1="135" y1="41" x2="390" y2="41" 
                              stroke={hoveredHotspot === 'pipe-bsk' ? '#A3113E' : '#A3113E'} 
                              strokeWidth="2.5" strokeDasharray="3 3"
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredHotspot('pipe-bsk')}
                            />

                            {/* Direct Callout pointing links */}
                            <line x1="171" y1="48" x2="245" y2="42" stroke="#A3113E" strokeWidth="0.75" className="pointer-events-none" />
                            <text x="250" y="45" className="text-[9px] font-extrabold fill-rose-700 font-mono pointer-events-none">1. Gleitdichtung (EPDM)</text>

                            <line x1="160" y1="20" x2="245" y2="68" stroke="#475569" strokeWidth="0.75" className="pointer-events-none" />
                            <circle cx="160" cy="20" r="2.5" fill="#334155" className="pointer-events-none" />
                            <text x="250" y="71" className="text-[9px] font-bold fill-slate-800 pointer-events-none">2. Glockenmuffe</text>

                            <line x1="135" y1="180" x2="245" y2="135" stroke="#475569" strokeWidth="0.75" className="pointer-events-none" />
                            <circle cx="135" cy="180" r="2.5" fill="#334155" className="pointer-events-none" />
                            <text x="250" y="138" className="text-[9px] font-bold fill-slate-650 pointer-events-none">3. Spitzende (Anschliff)</text>

                            <line x1="330" y1="41" x2="245" y2="92" stroke="#881235" strokeWidth="0.75" className="pointer-events-none" />
                            <text x="250" y="95" className="text-[9px] font-extrabold fill-red-800 font-sans pointer-events-none">4. Säure-Angriffszone</text>

                            <text x="25" y="212" className="text-[8.5px] font-bold fill-slate-400 font-mono pointer-events-none">
                              Muffenverbindung bei Betonrohren im Querschnitt (DIN EN 1916)
                            </text>
                          </svg>
                        )}

                        {/* Interactive hint */}
                        <div className="absolute bottom-2.5 right-2.5 text-[8.5px] text-slate-400 font-mono flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded">
                          <Eye size={10} className="text-shiraz" /><MdText text={inhalt.texte.interaktivBewegeDenMauszeiger} /></div>
                      </div>

                      {/* QUICK NAVIGATION HOTSPOT CHIPS */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-[9px] font-extrabold text-slate-400 block uppercase tracking-wider mb-2"><MdText text={inhalt.texte.funktionaleDetailauswahl} /></span>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {selectedStudio === 'paving' ? (
                            <>
                              <button 
                                onMouseEnter={() => setHoveredHotspot('paving-vorsatz')} 
                                onMouseLeave={() => setHoveredHotspot(null)}
                                className="px-2 py-1 text-[10px] rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold transition-all cursor-pointer"
                              >
                                Vorsatzbeton
                              </button>
                              <button 
                                onMouseEnter={() => setHoveredHotspot('paving-kern')} 
                                onMouseLeave={() => setHoveredHotspot(null)}
                                className="px-2 py-1 text-[10px] rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                              >
                                Kernbeton
                              </button>
                              <button 
                                onMouseEnter={() => setHoveredHotspot('paving-interface')} 
                                onMouseLeave={() => setHoveredHotspot(null)}
                                className="px-2 py-1 text-[10px] rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold transition-all cursor-pointer"
                              >
                                Nass-in-Nass-Verbund
                              </button>
                              <button 
                                onMouseEnter={() => setHoveredHotspot('paving-compact')} 
                                onMouseLeave={() => setHoveredHotspot(null)}
                                className="px-2 py-1 text-[10px] rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                              ><MdText text={inhalt.texte.erdfeuchteThixotropie} /></button>
                              <button 
                                onMouseEnter={() => setHoveredHotspot('paving-demold')} 
                                onMouseLeave={() => setHoveredHotspot(null)}
                                className="px-2 py-1 text-[10px] rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                              ><MdText text={inhalt.texte.sofortentschalungGrünstandsfestigkeit} /></button>
                            </>
                          ) : (
                            <>
                              <button 
                                onMouseEnter={() => setHoveredHotspot('pipe-wall')} 
                                onMouseLeave={() => setHoveredHotspot(null)}
                                className="px-2 py-1 text-[10px] rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                              >
                                Rohr-Tragwandung
                              </button>
                              <button 
                                onMouseEnter={() => setHoveredHotspot('pipe-socket')} 
                                onMouseLeave={() => setHoveredHotspot(null)}
                                className="px-2 py-1 text-[10px] rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                              >
                                Glockenmuffe
                              </button>
                              <button 
                                onMouseEnter={() => setHoveredHotspot('pipe-spigot')} 
                                onMouseLeave={() => setHoveredHotspot(null)}
                                className="px-2 py-1 text-[10px] rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                              >
                                Spitzende
                              </button>
                              <button 
                                onMouseEnter={() => setHoveredHotspot('pipe-seal')} 
                                onMouseLeave={() => setHoveredHotspot(null)}
                                className="px-2 py-1 text-[10px] rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold transition-all cursor-pointer"
                              >
                                EPDM-Gleitdichtung
                              </button>
                              <button 
                                onMouseEnter={() => setHoveredHotspot('pipe-bsk')} 
                                onMouseLeave={() => setHoveredHotspot(null)}
                                className="px-2 py-1 text-[10px] rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold transition-all cursor-pointer"
                              ><MdText text={inhalt.texte.bskZementsäurekorrosion} /></button>
                            </>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* RIGHT COLUMN: HOTSPOT INFORMATION DESCRIPTIONS */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                      
                      {/* Active Spot Information Display */}
                      {currentStudioInfo()}

                      {/* Technical Norm Database Card */}
                      <div className="bg-slate-50 text-slate-800 p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                        <span className="text-[10px] font-bold text-rose-700 tracking-wider uppercase flex items-center gap-1 border-b border-slate-200 pb-1.5">
                          <Zap size={11} className="text-rose-600" /><MdText text={inhalt.texte.regelwerkskonformeParameter} /></span>

                        {selectedStudio === 'paving' ? (
                          <div className="space-y-2 text-[11px] leading-relaxed">
                            <p className="font-light text-slate-600"><MdText text={inhalt.texte.derMechanischVerpressteSofortentschalte} /></p>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[10px]">
                              <div>
                                <span className="text-slate-500 block font-mono">Pflaster-Norm:</span>
                                <strong className="text-slate-900 block font-semibold">DIN EN 1338</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Platten-Norm:</span>
                                <strong className="text-slate-900 block font-semibold">DIN EN 1339</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Biegewiderstand:</span>
                                <strong className="text-slate-900 block font-semibold"><MdText text={inhalt.texte.t50MpaKlasse} /></strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Frost-Tausalz-Axiom:</span>
                                <strong className="text-emerald-700 block font-bold"><MdText text={inhalt.texte.xf410Kg} /></strong>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 text-[11px] leading-relaxed">
                            <p className="font-light text-slate-600"><MdText text={inhalt.texte.betonUndStahlbetonrohreNach} /></p>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[10px]">
                              <div>
                                <span className="text-slate-500 block font-mono">Rohr-Normen:</span>
                                <strong className="text-slate-900 block font-semibold"><MdText text={inhalt.texte.dinEn1916Din} /></strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Dichtheitsprüfung:</span>
                                <strong className="text-slate-900 block font-semibold"><MdText text={inhalt.texte.prüfdruck05Bar} /></strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Scheiteldruckkraft:</span>
                                <strong className="text-slate-900 block font-semibold"><MdText text={inhalt.texte.tragfähigkeitsklasseFn} /></strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Säureschutz:</span>
                                <strong className="text-rose-700 block font-bold"><MdText text={inhalt.texte.innentemperungSrZement} /></strong>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* THREE-COLUMN DEEP DIVE: VORSATZBETON | SOFORTENTSCHALUNG | ROHRE */}
              <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4 border-b border-slate-200 pb-2"><MdText text={inhalt.texte.detaillierteWerkstoffUndProduktionstheor} /></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* COLUMN 1: VORSATZBETON */}
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 space-y-3 shadow-xxs">
                  <span className="text-[9px] font-bold text-shiraz bg-rose-50 px-2 py-0.5 rounded tracking-wide uppercase">Werkstofftechnik</span>
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 mt-1">
                    <GripHorizontal className="w-4 h-4 text-rose-600 shrink-0" /><MdText text={inhalt.texte.vorsatzbetonEdelvorsatz} /></h3>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-normal"><MdText text={inhalt.texte.pflastersteineWerdenFastAusnahmslos} /></p>
                  <ul className="text-[11.5px] leading-relaxed text-slate-650 space-y-1.5 pl-4 list-decimal">
                    <li><MdText text={inhalt.texte.tausalzResistenzHöhererZementgehalt} /></li>
                    <li><MdText text={inhalt.texte.abriebwiderstandEdelHartgesteineVerhinde} /></li>
                    <li><MdText text={inhalt.texte.wasserdichtheitOftWerkseitigDurch} /></li>
                  </ul>
                  <div className="bg-slate-100 p-2 text-[10px] italic rounded border-l-2 border-l-rose-600 text-slate-600 font-medium"><MdText text={inhalt.texte.schütztDieFarbpigmenteMeist} /></div>
                </div>

                {/* COLUMN 2: SOFORTENTSCHALUNG */}
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 space-y-3 shadow-xxs">
                  <span className="text-[9px] font-bold text-shiraz bg-rose-50 px-2 py-0.5 rounded tracking-wide uppercase">Produktionsverfahren</span>
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 mt-1">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" /><MdText text={inhalt.texte.sofortentschalungRüttelPress} /></h3>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-normal"><MdText text={inhalt.texte.derSchlüsselZurRasanten} /></p>
                  <ul className="text-[11.5px] leading-relaxed text-slate-650 space-y-1.5 pl-4 list-decimal">
                    <li><MdText text={inhalt.texte.konsistenzbereichErdfeuchtDerWasserzemen} /><span className="font-mono font-bold text-slate-800">w/z ≤ 0,38</span><MdText text={inhalt.texte.derFrischbetonVerhältSich} /></li>
                    <li><MdText text={inhalt.texte.rüttelpressVerdichtungDerBeton} /></li>
                    <li><MdText text={inhalt.texte.grünstandsfestigkeitNachBeendigungDes} /></li>
                  </ul>
                  <div className="bg-slate-100 p-2 text-[10px] text-slate-600 italic rounded border-l-2 border-l-amber-500 font-medium"><MdText text={inhalt.texte.taktzyklusEineFormFertigt} /></div>
                </div>

                {/* COLUMN 3: ROHRE & SCHACHTBAUTEILE */}
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 space-y-3 shadow-xxs">
                  <span className="text-[9px] font-bold text-indigo-750 bg-indigo-50 px-2 py-0.5 rounded tracking-wide uppercase">Tiefbau-Schnittstelle</span>
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 mt-1">
                    <Droplet className="w-4 h-4 text-blue-500 shrink-0" /><MdText text={inhalt.texte.rohreSchachtsysteme} /></h3>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-normal"><MdText text={inhalt.texte.betonrohreBildenDieUnterirdische} /></p>
                  <ul className="text-[11.5px] leading-relaxed text-slate-650 space-y-1.5 pl-4 list-decimal">
                    <li><MdText text={inhalt.texte.falzmuffenverbindungDieSpitzendenGleiten} /></li>
                    <li><MdText text={inhalt.texte.dichtungstechnikDieStandardisierteKeilgl} /></li>
                    <li><MdText text={inhalt.texte.säureangriffBskBakteriellerAbbau} /></li>
                  </ul>
                  <div className="bg-amber-100/60 p-2 text-[10px] text-amber-900 rounded border-l-2 border-l-amber-600 font-medium flex items-start gap-1">
                    <AlertTriangle size={11} className="shrink-0 mt-0.5 text-amber-800" />
                    <span><MdText text={inhalt.texte.lösungFaulprozesseVermeidenSäurewidersta} /></span>
                  </div>
                </div>

              </div>

              {/* MATERIAL CHECKS TABLE */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xxs mt-6">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="text-emerald-600" size={14} /><MdText text={inhalt.texte.qualitätskontrolleUndSchadensbilderBei} /></h4>
                </div>
                <div className="overflow-x-auto text-[11px] md:text-xs">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-100 text-slate-700 font-bold font-sans">
                      <tr>
                        <th className="px-4 py-2 text-left"><MdText text={inhalt.texte.phänomenPrüfung} /></th>
                        <th className="px-4 py-2 text-left"><MdText text={inhalt.texte.ursacheImWerkBaustelle} /></th>
                        <th className="px-4 py-2 text-left"><MdText text={inhalt.texte.hintergrundVermeidung} /></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-650 font-normal">
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-900"><MdText text={inhalt.texte.ausblühungenKalkschleier} /></td>
                        <td className="px-4 py-2.5"><MdText text={inhalt.texte.aufsteigenVonFreiemCa} /></td>
                        <td className="px-4 py-2.5"><MdText text={inhalt.texte.niedrigeZementhydratationImFrühen} /></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-900"><MdText text={inhalt.texte.kantenabplatzungenNachPflasterung} /></td>
                        <td className="px-4 py-2.5"><MdText text={inhalt.texte.fehlendeOderZuEnge} /></td>
                        <td className="px-4 py-2.5"><MdText text={inhalt.texte.betonflächenLeitenSpannungenBei} /></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-900"><MdText text={inhalt.texte.spaltzugprüfungDinEn1338} /></td>
                        <td className="px-4 py-2.5"><MdText text={inhalt.texte.spaltzugprüfungNachDinEn} /></td>
                        <td className="px-4 py-2.5"><MdText text={inhalt.texte.mittelwert36N} /></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-900"><MdText text={inhalt.texte.biogeneSchwefelsäurekorrosion} /></td>
                        <td className="px-4 py-2.5"><MdText text={inhalt.texte.stagnierendesAbwasserInTeilgefüllten} /></td>
                        <td className="px-4 py-2.5"><MdText text={inhalt.texte.esHandeltSichUm} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : activeTab === 'praxis' ? (
            <PraxisTabContent moduleKey="bp_betonwaren" />
          ) : (
            <InnovationTabContent moduleKey="bp_betonwaren" />
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielSpaltzugfestigkeitEine}
          zielGleichung="T = 0{,}637 \cdot k \cdot \frac{P}{S}, \quad S = l \cdot t"
          normQuelle={inhalt.werte.dinEn1338Anhang}
          schritte={inhalt.daten["BpBetonwaren.schritte"]}
          ergebnisHinweis={inhalt.werte.derSteinVerfehltDen}
        />
      </div>

      <ModulTest moduleId="bp_betonwaren" />

      {/* FOOTER METADATA */}
      <ModuleFooter
        wikipedia={[
          { title: inhalt.werte.pflasterBodenbelag, url: 'https://de.wikipedia.org/wiki/Pflaster_(Bodenbelag)' },
          { title: 'Kanalisation', url: 'https://de.wikipedia.org/wiki/Kanalisation' }
        ]}
        literatur={inhalt.daten["BpBetonwaren.literatur"]}
        regelwerke={inhalt.daten["BpBetonwaren.regelwerke"]}
        formeln={inhalt.daten["BpBetonwaren.formeln"]}
      />
    </div>
  );
}
