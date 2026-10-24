import React, { useState } from 'react';
import { Layers, GripHorizontal, Info, BookOpen, CheckCircle2, Lightbulb, Target, Sparkles, Droplet, Zap, Eye, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';

export default function BpBetonwaren() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'praxis' | 'innovation'>('allgemein');
  
  // State for interactive workshop
  const [selectedStudio, setSelectedStudio] = useState<'paving' | 'pipe'>('paving');
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  // Hotspot explanations for paving and pipes
  const studioData: Record<string, { title: string; description: string; tag: string }> = {
    // Paving & Sofortentschalung hotspots
    'paving-vorsatz': {
      title: 'Vorsatzbeton (Edelvorsatzschicht)',
      description: 'Eine einige Millimeter dicke Oberflächenschicht aus zementreichem Feinbeton (häufig CEM I) mit Hartgesteinskörnungen (Granit, Quarz, Basalt) bis ca. 4 mm. Sichert Abriebwiderstand, Frost-Tausalz-Widerstand und eine dauerhafte Farbe (Eisenoxidpigmente).',
      tag: 'Oberflächenschutz & Ästhetik'
    },
    'paving-kern': {
      title: 'Kernbeton (Hinterbeton / Tragschicht)',
      description: 'Bildet den tragenden, dicken Unterkörper des Pflasters. Besteht aus wirtschaftlichen, gröberen Gesteinskörnungen (bis 8 oder 11 mm) und hat einen etwas geringeren Zementanteil als der Vorsatz. Sichert die Stoß- und Auflastdämpfung sowie den lückenlosen Verbund zur Tragschicht auf der Baustelle.',
      tag: 'Tragfähigkeit & Massenoptimierung'
    },
    'paving-interface': {
      title: 'Monolithischer Verbund (Grenzschicht)',
      description: 'Trotz zweier separater Einbringungsprozesse im Fertiger (Doppelfüllwagen im Werk) härtet der Stein vollfugig und monolithisch aus. Es darf im Bauteilleben niemals zum Abscheren oder Abblättern des Vorsatzes kommen! Dies wird durch das Nass-in-Nass-Verpressen erzielt.',
      tag: 'Bauteilsicherheit'
    },
    'paving-compact': {
      title: 'Erdfeuchte Konsistenz & Grünfestigkeit',
      description: 'Zentralschlüssel der Fertigung: Der Beton hat einen w/z-Wert von nur ca. 0.30 bis 0.38 (sehr trocken / erdfeucht). Bei Vibration verflüssigt sich die dichte Packung kurzzeitig (thixotroper Effekt) und verkeilt sich unter hohem Rütteldruck. Dies schafft hohe Kapillarkohäsion und die so genannte „Grünfestigkeit“.',
      tag: 'Verarbeitungstechnik'
    },
    'paving-demold': {
      title: 'Sofortentschalung im Taktverfahren',
      description: 'Die frisch gepressten, noch nassen Steine haben sofort eine so hohe Kantenstabilität („Grünstand“), dass die stählerne Hohlform maschinell nach oben abgezogen wird. Der formstabile „grüne“ Betonling verbleibt ohne Schutzrahmen auf dem Fertigungsbrett und fährt direkt in die Klimakammer zur Hydratation.',
      tag: 'Produktions-Wirtschaftlichkeit'
    },
    // Pipes & Manholes
    'pipe-wall': {
      title: 'Hochfester Rohrkörper (Beton/Stahlbeton)',
      description: 'Betonrohre werden aus hochfestem, dichten Beton (meist C40/50 bis C60/75) im Radialpress- oder Rüttelverfahren hergestellt. Sie sind dicht und tragen Erd- und Verkehrslasten (z. B. SLW 60) nach statischer Berechnung (z. B. ATV-DVWK-A 127).',
      tag: 'Schwerlast-Festigkeit'
    },
    'pipe-spigot': {
      title: 'Spitzende (Pointy Tip)',
      description: 'Das angeschrägte Ende des Rohres, das in die nachfolgende Glockenmuffe eingeschoben wird. Es besitzt eine exakte Passmaße mit einer profilierten Nut zur Aufnahme der Gleitdichtung.',
      tag: 'Präzisions-Knoten'
    },
    'pipe-socket': {
      title: 'Glockenmuffe (Socket Bell)',
      description: 'Das aufgeweitete Rohrende, das die Lasten übertragen und Platz für die Dichtung bieten muss. Einbauseitig fängt die Muffe die vertikalen Scherkräfte durch umliegende Bodensetzungen ab.',
      tag: 'Geometrische Führung'
    },
    'pipe-seal': {
      title: 'Keilgleitdichtung (Integrierte Elastomerdichtung)',
      description: 'Ein hochpräziser Dichtring aus EPDM oder SBR. Beim Zusammenschieben der Rohre wird die Dichtung elastisch komprimiert und gleitet spaltfrei in das Gelenk. Sichert zuverlässig gegen Exfiltration (Abwasseraustritt in den Boden) und Infiltration (Grundwassereintritt in den Kanal) gemäß DIN EN 1916.',
      tag: 'Wasser- & Dichtheit'
    },
    'pipe-bsk': {
      title: 'Gefahr: Biogene Schwefelsäurekorrosion (BSK)',
      description: 'Im Abwasser bilden Bakterien unter Sauerstoffmangel Schwefelwasserstoff (H₂S). Im Kondenswasser an der Rohrdecke oxidieren andere Bakterien das H₂S zu Schwefelsäure, die den Zementstein auflöst (biogene Schwefelsäurekorrosion). Abhilfe: Faulprozesse vermeiden (Belüftung, Gefälle), säurewiderstandsfähiger Beton oder Auskleidung (z. B. PE-HD). SR-Zemente allein schützen nicht vor Säureangriff.',
      tag: 'Dauerhaftigkeits-Schnittstelle'
    }
  };

  const currentStudioInfo = () => {
    if (!hoveredHotspot || !studioData[hoveredHotspot]) {
      return (
        <div className="flex items-center justify-center h-full p-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <div className="text-slate-400 space-y-1.5 py-6">
            <Info className="w-5 h-5 mx-auto text-slate-350" />
            <p className="text-xs font-bold text-slate-600">Interaktive Materialanalyse</p>
            <p className="text-[10px] leading-snug text-slate-500">
              Bewegen Sie die Maus über die markierten Hotspots der technischen Skizze, um die physikalischen, mechanischen und chemischen Eigenschaften einzublenden.
            </p>
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
            <Layers className="text-shiraz" /> Betonwaren (Bauprodukte &amp; Tiefbau)
          </h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
            <p>
              Geprägt durch unbewehrte Profile, hohe Stückproduktion im erdfeuchten Rüttel-Press-Druckverfahren sowie optimierte Frost-Tausalz-Dauerhaftigkeiten gehören Betonwaren zu den am stärksten automatisierten Standard-Baukomponenten des modernen Stadt- und Kanalkonstrukts.
            </p>
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
            <BookOpen size={16} /> Basiswissen &amp; Materialanalyse
          </button>
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
                <p className="lead text-base font-medium text-slate-800 leading-relaxed">
                  Im Gegensatz zu großformatigen, hochgradig konstruktiv bewehrten Betonfertigteilen zeichnet sich die Warengruppe der <strong>Betonwaren</strong> durch eine massenweise, serielle Fertigung meist unbewehrter Produkte aus. Hierzu zählen Pflastersteine, Gehwegplatten, Straßenborde sowie Rohr- und Schachtsysteme des Abwasserwesens.
                </p>
                <p className="mt-2 text-xs md:text-sm text-slate-600 leading-relaxed">
                  Die wesentlichen fertigungstechnischen Errungenschaften der Betonwarenindustrie ruhen auf dem physikalischen Prinzip der <strong>Sofortentschalung erdfeuchter Gemische</strong> und dem zweischichtigen Werkstoffaufbau durch den formgetreuen Einsatz von <strong>Vorsatzbeton</strong>.
                </p>
              </div>

              {/* INTERACTIVE BETONWAREN STUDIO WITH DETAILED VECTOR SCHEMATICS */}
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 p-4 sm:p-6 shadow-xs">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="text-shiraz w-4.5 h-4.5" /> Interaktives Betonwaren-Zertifizierungsstudio
                      </h4>
                      <p className="text-xs text-slate-650 font-medium">
                        Wählen Sie eine Bauteilskizze aus, um den Werkstoffaufbau, Fertigungszonen und Anschlussdetails zu untersuchen.
                      </p>
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
                        <GripHorizontal className="w-3.5 h-3.5" /> 1. Pflasterstein &amp; Vorsatz
                      </button>
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
                        <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> 2. Betonrohr &amp; Muffung
                      </button>
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
                          <Eye size={10} className="text-shiraz" /> Interaktiv – Bewege den Mauszeiger über Elemente.
                        </div>
                      </div>

                      {/* QUICK NAVIGATION HOTSPOT CHIPS */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-[9px] font-extrabold text-slate-400 block uppercase tracking-wider mb-2">
                          Funktionale Detailauswahl:
                        </span>
                        
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
                              >
                                Erdfeuchte Thixotropie
                              </button>
                              <button 
                                onMouseEnter={() => setHoveredHotspot('paving-demold')} 
                                onMouseLeave={() => setHoveredHotspot(null)}
                                className="px-2 py-1 text-[10px] rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                              >
                                Sofortentschalung (Grünstandsfestigkeit)
                              </button>
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
                              >
                                BSK (Zementsäurekorrosion)
                              </button>
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
                          <Zap size={11} className="text-rose-600" /> Regelwerkskonforme Parameter
                        </span>

                        {selectedStudio === 'paving' ? (
                          <div className="space-y-2 text-[11px] leading-relaxed">
                            <p className="font-light text-slate-600">
                              Der mechanisch verpresste, sofortentschalte Betonwarenkörper ist bei richtiger Verlegung sehr dauerhaft.
                            </p>
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
                                <strong className="text-slate-900 block font-semibold">≥ 5,0 MPa (Klasse T)</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Frost-Tausalz-Axiom:</span>
                                <strong className="text-emerald-700 block font-bold">XF4 (≤ 1,0 kg/m² Abwitterung)</strong>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 text-[11px] leading-relaxed">
                            <p className="font-light text-slate-600">
                              Beton- und Stahlbetonrohre nach DIN EN 1916 tragen statisch schwere Erdlasten und bleiben durch gedichtete Muffen bei kleinen Setzungen beweglich.
                            </p>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[10px]">
                              <div>
                                <span className="text-slate-500 block font-mono">Rohr-Normen:</span>
                                <strong className="text-slate-900 block font-semibold">DIN EN 1916 / DIN V 1201</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Dichtheitsprüfung:</span>
                                <strong className="text-slate-900 block font-semibold">Prüfdruck ≥ 0,5 bar (Kanal)</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Scheiteldruckkraft:</span>
                                <strong className="text-slate-900 block font-semibold">Tragfähigkeitsklasse (Fn)</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Säureschutz:</span>
                                <strong className="text-rose-700 block font-bold">Innentemperung / SR-Zement</strong>
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
              <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4 border-b border-slate-200 pb-2">
                Detaillierte Werkstoff- und Produktionstheorie
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* COLUMN 1: VORSATZBETON */}
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 space-y-3 shadow-xxs">
                  <span className="text-[9px] font-bold text-shiraz bg-rose-50 px-2 py-0.5 rounded tracking-wide uppercase">Werkstofftechnik</span>
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 mt-1">
                    <GripHorizontal className="w-4 h-4 text-rose-600 shrink-0" />
                    Vorsatzbeton (Edelvorsatz)
                  </h3>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-normal">
                    Pflastersteine werden fast ausnahmslos in <strong>Zweischicht-Bauweise</strong> gefertigt. Vorsatzbeton bildet die bewitterte Sichtseite. Er besteht aus feinen Edel-Hartgesteinskörnungen (Körnung meist 0/2 bis 0/4 aus Granit, Basalt, Diabas oder Quarzsand).
                  </p>
                  <ul className="text-[11.5px] leading-relaxed text-slate-650 space-y-1.5 pl-4 list-decimal">
                    <li>
                      <strong>Tausalz-Resistenz:</strong> Höherer Zementgehalt und optimiertes Porensystem schützen wirksam vor dem winterlichen Frostangriff.
                    </li>
                    <li>
                      <strong>Abriebwiderstand:</strong> Edel-Hartgesteine verhindern ein "Glattpolieren" des Gehwegkörpers über Jahrzehnte.
                    </li>
                    <li>
                      <strong>Wasserdichtheit:</strong> Oft werkseitig durch Zugabe von flüssigen Hydrophobierungsmitteln im Mischer vergütet (Core-Hydrophobierung).
                    </li>
                  </ul>
                  <div className="bg-slate-100 p-2 text-[10px] italic rounded border-l-2 border-l-rose-600 text-slate-600 font-medium">
                    Schützt die Farbpigmente (meist anorganische Metalloxide wie Fe₂O₃ oder Cr₂O₃) vor saurem Regen.
                  </div>
                </div>

                {/* COLUMN 2: SOFORTENTSCHALUNG */}
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 space-y-3 shadow-xxs">
                  <span className="text-[9px] font-bold text-shiraz bg-rose-50 px-2 py-0.5 rounded tracking-wide uppercase">Produktionsverfahren</span>
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 mt-1">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    Sofortentschalung (Rüttel-Press)
                  </h3>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-normal">
                    Der Schlüssel zur rasanten Taktzeit (wenige Sekunden pro Palette) ist die <strong>Sofortentschalung im erdfeuchten Frischzustand</strong>. Es wird kein teures Gussformensystem je Stein benötigt.
                  </p>
                  <ul className="text-[11.5px] leading-relaxed text-slate-650 space-y-1.5 pl-4 list-decimal">
                    <li>
                      <strong>Konsistenzbereich erdfeucht:</strong> Der Wasserzementwert wird sehr niedrig eingestellt (<span className="font-mono font-bold text-slate-800">w/z ≤ 0,38</span>). Der Frischbeton verhält sich wie leicht feuchter Sand.
                    </li>
                    <li>
                      <strong>Rüttelpress-Verdichtung:</strong> Der Beton wird in die Gussform gefüllt. Ein Rütteltisch versetzt das System in Schwingung, wodurch die Körner dicht gleiten. Gleichzeitig presst ein Hydraulikschuh (Auflast) mechanisch von oben.
                    </li>
                    <li>
                      <strong>Grünstandsfestigkeit:</strong> Nach Beendigung des Rüttelns bewirkt die innere Reibung der dichten Gesteinskörnung, dass die Steinlinge sofort standsicher sind. Die Stahlform wird nach oben gezogen („Sofortentschalung“).
                    </li>
                  </ul>
                  <div className="bg-slate-100 p-2 text-[10px] text-slate-600 italic rounded border-l-2 border-l-amber-500 font-medium">
                     Taktzyklus: Eine Form fertigt je Takt ein ganzes Brett voller Steine in wenigen Sekunden.
                  </div>
                </div>

                {/* COLUMN 3: ROHRE & SCHACHTBAUTEILE */}
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 space-y-3 shadow-xxs">
                  <span className="text-[9px] font-bold text-indigo-750 bg-indigo-50 px-2 py-0.5 rounded tracking-wide uppercase">Tiefbau-Schnittstelle</span>
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 mt-1">
                    <Droplet className="w-4 h-4 text-blue-500 shrink-0" />
                    Rohre &amp; Schachtsysteme
                  </h3>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-normal">
                    Betonrohre bilden die unterirdische Infrastruktur der Entwässerung (DIN EN 1916). Sie müssen Erd- und Verkehrslasten aufnehmen.
                  </p>
                  <ul className="text-[11.5px] leading-relaxed text-slate-650 space-y-1.5 pl-4 list-decimal">
                    <li>
                      <strong>Falzmuffenverbindung:</strong> Die Spitzenden gleiten flexibel in die Glockenmuffen des Nachbarrohres. Sichert elastische Winkelbeweglichkeit bei Geländesetzungen.
                    </li>
                    <li>
                      <strong>Dichtungstechnik:</strong> Die standardisierte *Keilgleitdichtung* (aus Synthesekautschuk) dichtet das Gelenk dauerhaft gegen einsickerndes Grundwasser und austretendes Schmutzwasser (Exfiltration) ab.
                    </li>
                    <li>
                      <strong>Säureangriff (BSK):</strong> Bakterieller Abbau von organischem Abwasser setzt Schwefelwasserstoff (H₂S) frei. Bakterien oxidieren ihn an der Rohrdecke zu Schwefelsäure, die den Zementstein auflöst.
                    </li>
                  </ul>
                  <div className="bg-amber-100/60 p-2 text-[10px] text-amber-900 rounded border-l-2 border-l-amber-600 font-medium flex items-start gap-1">
                    <AlertTriangle size={11} className="shrink-0 mt-0.5 text-amber-800" />
                    <span>Lösung: Faulprozesse vermeiden, säurewiderstandsfähiger Beton oder Auskleidung – SR-Zement allein genügt nicht.</span>
                  </div>
                </div>

              </div>

              {/* MATERIAL CHECKS TABLE */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xxs mt-6">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="text-emerald-600" size={14} /> Qualitätskontrolle und Schadensbilder bei Betonwaren
                  </h4>
                </div>
                <div className="overflow-x-auto text-[11px] md:text-xs">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-100 text-slate-700 font-bold font-sans">
                      <tr>
                        <th className="px-4 py-2 text-left">Phänomen / Prüfung</th>
                        <th className="px-4 py-2 text-left">Ursache im Werk/Baustelle</th>
                        <th className="px-4 py-2 text-left">Hintergrund &amp; Vermeidung</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-650 font-normal">
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-900">Ausblühungen (Kalkschleier)</td>
                        <td className="px-4 py-2.5">Aufsteigen von freiem Ca(OH)₂ an die bewitterte Oberfläche, Reaktion mit H₂CO₃ zu schwerlöslichem CaCO₃.</td>
                        <td className="px-4 py-2.5">Niedrige Zementhydratation im frühen Alter begünstigt diesen Effekt. Vermeidung durch dichte Gefügepackung, puzzolanische Zusatzstoffe (Trass) oder Hydrophobierungen.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-900">Kantenabplatzungen nach Pflasterung</td>
                        <td className="px-4 py-2.5">Fehlende oder zu enge Fuge bei der Verlegung im Sand/Splittbett. Knirsch-Verlegung führt zu Scherdruckspitzen.</td>
                        <td className="px-4 py-2.5">Betonflächen leiten Spannungen bei Ausdehnung ab. Fugenbreite 3 bis 5 mm (DIN 18318 / ZTV Wegebau). Pflasterabstandhalter weisen darauf hin, ersetzen die Fuge jedoch nicht.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-900">Spaltzugprüfung (DIN EN 1338)</td>
                        <td className="px-4 py-2.5">Spaltzugprüfung nach DIN EN 1338 entlang der Längsachse des Steins.</td>
                        <td className="px-4 py-2.5">Mittelwert ≥ 3,6 N/mm², Einzelwert ≥ 2,9 N/mm², Bruchlast je Länge ≥ 250 N/mm.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-900">Biogene Schwefelsäurekorrosion</td>
                        <td className="px-4 py-2.5">Stagnierendes Abwasser in teilgefüllten Abwasserrohren, H₂S Oxidation im Gasraum oberhalb der Wasserlinie.</td>
                        <td className="px-4 py-2.5">Einsatz hochsulfatbeständiger Bindemittel (z.B. Hochofenzemente CEM III), Epoxidharz-Auskleidungen (Lining-Verfahren) oder HDPE-Inliner.</td>
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
          title="Anwendungsbeispiel: Spaltzugfestigkeit eines Pflastersteins"
          zielGleichung="T = 0{,}637 \cdot k \cdot \frac{P}{S}, \quad S = l \cdot t"
          normQuelle="DIN EN 1338, Anhang F (k = Dickenfaktor, für t = 80 mm: k = 1,0)"
          schritte={[
            { titel: '1. Gegeben', formel: 'P = 72\\,000\\,\\text{N},\\; l = 200\\,\\text{mm},\\; t = 80\\,\\text{mm},\\; k = 1{,}0', erklaerung: 'Bruchlast und Spaltlänge eines Rechtecksteins.' },
            { titel: '2. Bruchfläche', formel: 'S = 200 \\cdot 80 = 16\\,000\\,\\text{mm}^2', erklaerung: 'Spaltfläche = Spaltlänge × Dicke.' },
            { titel: '3. Spaltzugfestigkeit', formel: 'T = 0{,}637 \\cdot 1{,}0 \\cdot 72\\,000 / 16\\,000 = 2{,}87\\,\\text{N/mm}^2', erklaerung: 'Unter dem Einzelwert 2,9 N/mm².' },
            { titel: '4. Bruchlast je Länge', formel: 'F = P/l = 72\\,000/200 = 360\\,\\text{N/mm} \\ge 250', erklaerung: 'Dieses Kriterium ist erfüllt.' },
          ]}
          ergebnisHinweis="Der Stein verfehlt den Einzelwert knapp – die Serie ist mit Mittelwert (≥ 3,6) und allen Einzelwerten zu bewerten."
        />
      </div>

      <ModulTest moduleId="bp_betonwaren" />

      {/* FOOTER METADATA */}
      <ModuleFooter
        wikipedia={[
          { title: 'Pflaster (Bodenbelag)', url: 'https://de.wikipedia.org/wiki/Pflaster_(Bodenbelag)' },
          { title: 'Kanalisation', url: 'https://de.wikipedia.org/wiki/Kanalisation' }
        ]}
        literatur={[
          'FGSV: ZTV Wegebau – Zusätzliche Technische Vertragsbedingungen und Richtlinien für den Bau von Wegen und Plätzen außerhalb von Flächen des Straßenverkehrs (Ausgabe 2013)',
          'FGSV: Merkblatt für Flächenbefestigungen mit Pflasterdecken und Plattenbelägen in ungebundener Ausführung (M FP), FGSV 618/1, Ausgabe 2024',
          'ATV-DVWK-A 127:2000-08 (Statische Berechnung von Abwasserkanälen und -leitungen, 3. Aufl.) bzw. DWA-A 127-1:2022-12 (Statische Berechnung von Entwässerungsanlagen – Teil 1: Grundlagen)'
        ]}
        regelwerke={[
          { title: 'DIN EN 1338 (Pflastersteine aus Beton - Anforderungen und Prüfverfahren)' },
          { title: 'DIN EN 1339 (Platten aus Beton - Anforderungen und Prüfverfahren)' },
          { title: 'DIN EN 1340 (Bordsteine aus Beton - Anforderungen und Prüfverfahren)' },
          { title: 'DIN EN 1916 (Rohre und Formstücke aus Beton, Stahlfaserbeton und Stahlbeton)' },
          { title: 'DIN V 1201 (Rohre und Formstücke aus Beton, Stahlfaserbeton und Stahlbeton für Abwasserleitungen)' }
        ]}
        formeln={[
          {
            formel: 'T = \\frac{2 \\cdot F}{\\pi \\cdot l \\cdot t} \\ge 3{,}6\\,\\text{N/mm}^2',
            erklaerung: 'Spaltzugfestigkeit von Betonpflastersteinen nach DIN EN 1338: F = Bruchlast [N], l = Länge der Bruchlinie [mm], t = Steindicke [mm]. Einzelwert ≥ 2,9 N/mm²; Bruchlast je Länge ≥ 250 N/mm.',
            quelle: 'DIN EN 1338 Anhang F'
          },
          {
            formel: 'w/z \\approx 0{,}30 - 0{,}38 \\quad (\\text{Konsistenz: erdfeucht})',
            erklaerung: 'Niedriger Wasserzementwert zur Gewährleistung der sofortigen Entschalung und Formstabilität (Grünstandsfestigkeit).',
            quelle: 'Betonwaren-Technologie'
          }
        ]}
      />
    </div>
  );
}
