import React, { useState } from 'react';
import { Layers, Cuboid, Building2, BookOpen, CheckCircle2, Lightbulb, Info, Target, ShieldAlert, Sparkles } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';

export default function BpBetonfertigteile() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'praxis' | 'innovation'>('allgemein');
  
  // State for interactive prefabricated element workshop
  const [selectedElement, setSelectedElement] = useState<'filigran' | 'doppelwand' | 'hohldiele'>('filigran');
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // Explanatory data for internal interactive hotspot highlights
  const elementParts: Record<string, { title: string; description: string; type: string }> = {
    // Filigrandecke parts
    'gittertraeger': {
      title: 'Gitterträger (Schubträger & Montagebewehrung)',
      description: 'Zweidimensionale oder dreidimensionale verschweißte Stahlgitter-Fachwerke (DIN 488). Sie sichern die Steifigkeit gegen Durchbiegung beim Transport und Heben, tragen die bauseitige Belastung durch Frischbeton und Montage-Arbeiter und stellen im ausgemixten Endzustand den kraftschlüssigen Verbund (Schubübertragung / Schubverbund) zwischen Fertigteil und Ortbetonschicht her.',
      type: 'Statik & Verbundwirkung'
    },
    'ortbeton': {
      title: 'Ortbeton-Ergänzung',
      description: 'Wird auf der Baustelle nach dem Verlegen der Elementdecken aufbetoniert (meist Konsistenzklasse F4/F5, Festigkeitsklasse C25/30 oder C30/37). Nach dem Erhärten verschmilzt er mit der rauen Oberfläche der Fertigteilplatte zu einer tragenden Massivdecke (monolithisches Gesamttragwerk).',
      type: 'bauseitige Bauleistung'
    },
    'fertigteilplatte': {
      title: 'Vorgefertigte Betonplatte (Schalungsplatte)',
      description: 'Eine 4 bis 7 cm dicke Platte aus hochwertigem Werksbeton. Sie enthält bereits die untere Biegezugbewehrung (Tragfläche) sowie Versteifungselemente. Sichert eine vollständig glatte, putzfreie Untersicht (Sichtbeton-Eignung) und ersetzt die gesamte herkömmliche Deckenschalung (Spares Zeit und Rüstholz).',
      type: 'Werksseitige Vorfertigung'
    },
    'bewehrung': {
      title: 'Zusatz- & Stoßfugenbewehrung',
      description: 'Ergänzende Bewehrung, die bauseits eingelegt wird. Dazu gehören querverlaufende Bewehrungsstreifen über den Plattenstößen (Stoßfugenbewehrung zur Rissvermeidung), Zulagen für negative Biegemomente an Stützenauflagern (Stützbewehrung) und gegebenenfalls Ringanker-Eisen.',
      type: 'Rissbegrenzung'
    },
    // Doppelwand parts
    'doppelwand-schale': {
      title: 'Werksseitige Außenschalen',
      description: 'Zwei spiegelglatte, hochfeste Wandplatten (je 5 bis 6 cm dick) aus C30/37 Werksbeton. Sie bilden die Sichtflächen der Wand und fungieren im Montagezustand als extrem hoch belastbare, „verlorene“ Schalung. Keine Schalungsarbeiten vor Ort notwendig!',
      type: 'Werksseitige Vorfertigung'
    },
    'doppelwand-ortbeton': {
      title: 'Ortbeton-Fließkern (Kernverguss)',
      description: 'Flüssiger Kernbeton, der bauseits verfüllt wird. Um irreversible Schäden oder Sprengungen der dünnen Schalen durch physikalischen hydrostatischen Schalungsdruck zu vermeiden, ist die Steiggeschwindigkeit des Frischbetons stark reguliert (maximal 1,0 bis 1,5 Meter pro Stunde, abschnittsweise Verdichtung).',
      type: 'Sicherheit & Montagegeschwindigkeit'
    },
    'doppelwand-truss': {
      title: 'Verbindungsbolzen / Gitterträger',
      description: 'Lattice-Stahlträger, die beide Außenschalen im exakten lichten Abstand fixieren. Übernehmen im Einbauzustand die extremen Zugkräfte, welche durch den hydrostatischen Innendruck des flüssigen Frischbetons die Wandschalen nach außen drücken wollen.',
      type: 'Zulassungsrelevante Statik'
    },
    'doppelwand-fugen': {
      title: 'Fugen-Stabstahl & Eckzulagen',
      description: 'Spannungs- und Zuganker, die an Plattenstößen, Innenecken und Fundamentanschlüssen bauseits eingefädelt werden. Gewährleisten, dass die Einzelwandelemente statisch wie eine lückenlose, tragende Wandscheibe oder Gesamtbox wirken.',
      type: 'Gefügestabilität'
    },
    // Hohldiele parts
    'hohldiele-voids': {
      title: 'Gewichtsreduzierende Kreis-Hohlkanäle (Voids)',
      description: 'Runde, röhrenförmige Aussparungen, die sich über die gesamte Bauteillänge erstrecken. Reduzieren das Bauteileigengewicht um ca. 40 % im Vergleich zu massiven Decken. Dadurch sinken die Biegespannungen sowie die Lasten auf Stützen und Fundamente drastisch, während enorm viel Zement und CO2 eingespart werden.',
      type: 'Leichtbau & Ökologie'
    },
    'hohldiele-cables': {
      title: 'Vorspannstähle / Spannstahllitzen',
      description: 'Hochfeste Spannstähle (St 1660/1860) im Bereich des Untergurtes. Werden im Werk hydraulisch vorgespannt, bevor der Beton gegossen wird (Vorspannung mit sofortigem Verbund im Spannbett). Ermöglichen enorme Stützweiten (bis 20m) und extreme Tragfähigkeiten bei minimaler Deckenhöhe – ganz ohne baustellenseitige Rüststützen.',
      type: 'Vorspannung & Tragkraft-Multiplikator'
    },
    'hohldiele-body': {
      title: 'Deckenkörper aus hochfestem Werksbeton',
      description: 'Gefertigt aus erdstabilem C45/55 oder C50/60 Beton mittels kontinuierlich ziehendem Gleitfertiger (Gleitfertigungsverfahren). Extrem witterungsbeständig und dicht. Die rauen Flanken besitzen profilierte Längsnuten, in welche die Fugen der Nachbardielen kraftschlüssig mit Vergussmörtel eingebunden werden.',
      type: 'Betontechnologie Werk'
    }
  };

  const getPartExplanation = () => {
    if (!hoveredPart || !elementParts[hoveredPart]) {
      return (
        <div className="flex items-center justify-center h-full p-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <div className="text-slate-400 space-y-1.5 py-4">
            <Info className="w-5 h-5 mx-auto text-slate-350" />
            <p className="text-xs font-semibold">Interaktive Hotspots</p>
            <p className="text-[10px] leading-snug">
              Fahren Sie mit der Maus über die rot oder blau eingefärbten Bereiche der Skizze oder klicken Sie auf die Schaltflächen unten, um detaillierte Werkstoff- und Funktionseigenschaften einzublenden.
            </p>
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
            <Layers className="text-shiraz" /> Betonfertigteile (Bauprodukte)
          </h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
            <p>
              Industriell vorgefertigte Betonbauteile bieten höchste Präzision, hervorragende Sichtbetonqualität und extrem verkürzte Bauzeiten durch optimalen Logistikdurchlauf und standardisierte Montageknoten im Hoch- und Ingenieurbau.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6 px-6 pt-4">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <BookOpen size={16} /> Basiswissen &amp; Elementkatalog
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
              activeTab === 'praxis' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('praxis')}
          >
            <CheckCircle2 size={16} /> Praxisbeispiele
          </button>
          <button
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
        
        <div className="p-6 pt-0 space-y-8">
          {activeTab === 'allgemein' ? (
            <div className="prose max-w-none text-gray-700 animate-in fade-in duration-300 space-y-8">
              <div>
                <p className="lead text-base font-medium text-slate-800 leading-relaxed">
                  Betonfertigteile sind tragende oder nichttragende Elemente aus Beton, Stahlbeton oder Spannbeton, die werkstattmäßig unter kontrollierten, witterungsunabhängigen Klimabedingungen vorgefertigt, gehärtet und anschließend montagefertig auf die Baustelle geliefert werden.
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Die herausragenden Vorteile liegen in der extrem hohen Produktionsgeschwindigkeit, der exakten geometrischen Maßhaltigkeit (Maßtoleranzen im Millimeterbereich) und dem Wegfall aufwändiger Vor-Ort-Schalungsarbeiten.
                </p>
              </div>

              {/* INTERACTIVE COMPONENT WORKSHOP WITH SCHEMATICS */}
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 p-4 sm:p-6 shadow-xs">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="text-shiraz w-4 h-4" /> Interaktives Elementen-Studio (mit bautechnischen Skizzen)
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        Klicken Sie auf ein Element, um die 2D-Querschnittszeichnung zu laden und dessen Aufbau im Detail zu analysieren.
                      </p>
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
                              >
                                5cm Schalungsplatte
                              </button>
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
                              >
                                C50/60 Hohlplattenkörper
                              </button>
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
                          <Info size={12} /> Technische Kennwerte &amp; DIN-Normung
                        </span>

                        {selectedElement === 'filigran' && (
                          <div className="space-y-2 text-[11px]">
                            <p className="leading-relaxed font-light text-slate-600">
                              Die <strong>Filigrandecke (Elementdecke nach DIN EN 13747)</strong> ist das wirtschaftlichste Deckensystem des modernen Hochbaus.
                            </p>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[10px]">
                              <div>
                                <span className="text-slate-500 block font-mono">Regelwerk:</span>
                                <strong className="text-slate-900 block font-semibold">DIN EN 13747</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Plattenstärken:</span>
                                <strong className="text-slate-900 block font-semibold">4 – 7 cm (Fertigteil)</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Stützweiten (Max):</span>
                                <strong className="text-slate-900 block font-semibold">bis ~7,50 m (schlaff)</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Montagestützen:</span>
                                <strong className="text-rose-700 block font-bold">Zwingend nötig!</strong>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedElement === 'doppelwand' && (
                          <div className="space-y-2 text-[11px]">
                            <p className="leading-relaxed font-light text-slate-600">
                              Die <strong>Doppelwand (Hohlwand nach DIN EN 14992)</strong> vereint den massiven Schall- und Brandschutz von monolithischem Beton mit der makellosen Ästhetik von Fertigteilen.
                            </p>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[10px]">
                              <div>
                                <span className="text-slate-500 block font-mono">Regelwerk:</span>
                                <strong className="text-slate-900 block font-semibold">DIN EN 14992</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Wandstärken:</span>
                                <strong className="text-slate-900 block font-semibold">20, 24, 30, 36,5 cm</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Schalungsdruck:</span>
                                <strong className="text-slate-900 block font-semibold">Bemessung nach DIN 18218</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Betonier-Limit:</span>
                                <strong className="text-rose-700 block font-bold">Max. v ≤ 1,5 m/h</strong>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedElement === 'hohldiele' && (
                          <div className="space-y-2 text-[11px]">
                            <p className="leading-relaxed font-light text-slate-600">
                              Die <strong>Spannbeton-Hohlplatte (nach DIN EN 1168)</strong> ermöglicht extrem schlanke, weitgespannte und komplett unterstellungsfreie Tragwerkslösungen.
                            </p>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[10px]">
                              <div>
                                <span className="text-slate-500 block font-mono">Regelwerk:</span>
                                <strong className="text-slate-900 block font-semibold">DIN EN 1168</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Stützweiten (Max):</span>
                                <strong className="text-slate-900 block font-semibold">Bis zu 20 Meter!</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Gewichtsreduktion:</span>
                                <strong className="text-slate-900 block font-semibold">ca. 40 - 45 % Einsparung</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block font-mono">Verlegung:</span>
                                <strong className="text-emerald-700 block font-bold">Sofort belastbar</strong>
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
                    <Building2 className="w-4 h-4 text-stone-600 shrink-0" /> Filigrandecke (Elementdecke)
                  </h3>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-normal">
                    Das Halbfertigteil vereint die Vorteile der Schalungsfreiheit mit der monolithischen Steifigkeit einer Ortbetondecke. Bauseits wird eine Stoßfugenbewehrung eingebracht, um Risse an den Plattenübergängen im Putzbereich zu verhindern.
                  </p>
                  <div className="text-[10px] text-slate-600 bg-white p-3 rounded-lg border border-slate-100/80 space-y-1.5 font-medium">
                    <span className="font-bold text-slate-800">⚠️ Montage-Axiom:</span>
                    <span>Bauseitige Montagestützen müssen vor dem Auflegen exakt eingemessen und dürfen erst nach vollständigem Aushärten des Ortbetons (nach ca. 28 Tagen) entfernt werden!</span>
                  </div>
                </div>

                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <span className="text-[10px] font-bold text-shiraz bg-rose-50 px-2 py-0.5 rounded tracking-wide uppercase">Element 2</span>
                  <h3 className="font-extrabold text-slate-850 text-xs md:text-sm flex items-center gap-1.5 mt-1 border-b border-slate-200 pb-2">
                    <Building2 className="w-4 h-4 text-stone-600 shrink-0" /> Doppelwand (Hohlwand)
                  </h3>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-normal">
                    Die Hohlwand ersetzt die traditionelle Wandschalung auf der Baustelle. Die Werksplatten weisen eine exzellente Porenstruktur auf. Eine Kernbetonierung mit der vorgeschriebenen Steiggeschwindigkeit ist zwingend und wird statisch berechnet.
                  </p>
                  <div className="text-[10px] text-slate-600 bg-white p-3 rounded-lg border border-slate-100/80 space-y-1.5 font-medium">
                    <span className="font-bold text-slate-800">⚠️ Einbau-Axiom:</span>
                    <span>Wandanschlusseisen (Anschlussschwerter oder L-Verbinder) müssen exakt aus der Bodenplatte ragen, um die Wandscheibe am Fußpunkt starr zu verankern und abzustützen.</span>
                  </div>
                </div>

                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <span className="text-[10px] font-bold text-shiraz bg-rose-50 px-2 py-0.5 rounded tracking-wide uppercase">Element 3</span>
                  <h3 className="font-extrabold text-slate-850 text-xs md:text-sm flex items-center gap-1.5 mt-1 border-b border-slate-200 pb-2">
                    <Cuboid className="w-4 h-4 text-stone-600 shrink-0" /> Spannbeton-Hohldiele
                  </h3>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-normal">
                    Sofort voll tragfähige Deckenelemente ohne bauseitige Montagestützen. Ideal für weite stützenfreie Räume (Sporthallen, Industriegebäude). Der Lastübertrag zwischen den Platten geschieht über profilierten Längstfugen-Mörtelverguss.
                  </p>
                  <div className="text-[10px] text-slate-600 bg-white p-3 rounded-lg border border-slate-100/80 space-y-1.5 font-medium">
                    <span className="font-bold text-slate-800">⚠️ Frostgefahr-Axiom:</span>
                    <span>Im Winter muss bauseits in den Hohlräumen stehendes Kondenswasser durch werkseitige Entwässerungslöcher abgelassen werden, um Eissprengungen des Betons zu verhindern!</span>
                  </div>
                </div>
              </div>

              {/* CONSTRUCTIVE OVERVIEW BENTO GRID */}
              <div>
                <h3 className="text-lg font-bold text-home-prim mt-8 mb-4">Konstruktionsklassen von Fertigteilen im Hoch- und Tiefbau</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                    <h4 className="font-bold text-shiraz mb-2 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-stone-600" /> Konstruktiver Skelettbau &amp; Massivbauten
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs mt-3">
                      <li><strong>Skelett-Stützen:</strong> Werden meist stehend in Stahlmatrizen gegossen. Mit Fundamentköchern oder Schraubverbindungen (z.B. Peikko) starr oder gelenkig angeschlossen.</li>
                      <li><strong>Spannbeton-Träger:</strong> Große I- oder T-Querschnitte mit Spanngliedern. Sie decken weitgespannte Binderkonstruktionen im Industriehallenbau ab.</li>
                      <li><strong>Treppenläufe &amp; Podeste:</strong> Industriell mit vollflächigem Schalglanz gegossen, minimiert Schalungs- und Verlegezeit auf der Baustelle extrem.</li>
                    </ul>
                  </div>

                  <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                    <h4 className="font-bold text-shiraz mb-2 flex items-center gap-2">
                      <Cuboid className="w-5 h-5 text-stone-600" /> Tiefbau &amp; Spezial-Schwerlastfertigteile
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs mt-3">
                      <li><strong>Tunnel-Tübbinge:</strong> Kreissegment-Steine aus Stahlfaserbeton. Sie weisen extreme Tragfähigkeit und präziseste Gummidichtungsprofile gegen Bergwasser auf.</li>
                      <li><strong>Eisenbahnschwellen:</strong> Extreme Ermüdungsfestigkeit bei dynamischer Schwellenbelastung, meist aus hochwertigem Spannbeton gefertigt.</li>
                      <li><strong>Verkehrs-Leitelemente &amp; Lärmschutz:</strong> Module zur Absperrung oder Lärmminderung mit werkseitig unebenen, schallschluckenden Oberflächenstrukturen.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* ADVANTAGES & CHALLENGES */}
              <h3 className="text-lg font-bold text-home-prim mt-8 mb-4">Bilanz: Vor- und Nachteile von Fertigteilsystemen</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl">
                  <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Vorteile der industriellen Fertigung
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-emerald-800">
                    <li><strong>Garantierte Gütekontrolle (WPK):</strong> Witterungsunabhängiges Gießen und thermisches Härten führen zu extrem reproduzierbaren Betongüten.</li>
                    <li><strong>Monolithischer Sichtbeton-Standard:</strong> Glatte Schaltafeln und Vibrationsstraßen sichern Lunkerfreiheit und Sichtbetonklassen SB3/SB4 ohne bauseitige Nachbesserung.</li>
                    <li><strong>Massive Einsparung bauseitiger Schalfrist:</strong> Elementdecken und Hohlwände dienen als verlorene Schalung. Einrüstholz-Bedarf sinkt um bis zu 85 %.</li>
                    <li><strong>Spannbett-Vorspannung:</strong> Sichert schlanke Querschnitte bei enormen Gewichts- und Materialeinsparungen.</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl">
                  <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-700" /> Ingenieurmäßige Herausforderungen
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-amber-800">
                    <li><strong>Extremer planerischer Vorlauf (Planungs-Axiom):</strong> Sämtliche Einbauteile, Aussparungen, Kabelführungen und Sanitärauslässe müssen vor dem Betonier-Werksprozess endgültig festgelegt sein. Nachträgliches Fräsen oder Bohren gefährdet die Statik!</li>
                    <li><strong>Schwertransport-Logistik:</strong> Transport von tonnenschweren Hohlwänden, Bindern oder sperrigen Raumzellen bedarf polizeilicher Routenfreigaben und logistischer Just-In-Time-Genauigkeit.</li>
                    <li><strong>Statische Fugenproblematik:</strong> Knotenpunkte an Bauteilgrenzen (Vergussfugen, Koppelstellen, Scherkraftdübel) sind konstruktive Schwachstellen bezüglich Kraftfluss, Feuchtigkeit, Dichtigkeit und mechanischer Dauerhaftigkeit.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl">
                <p className="text-xs text-slate-650 leading-relaxed font-normal">
                  <strong>Bauaufsichtliche Zulassung:</strong> Gemäß <strong>DIN 1045-4</strong> sowie der harmonisierten europäischen Grundnorm <strong>DIN EN 13369</strong> unterliegen alle tragenden Fertigteile strengen Konformitätsnachweisen. Der Hersteller deklariert die mechanische Tragfähigkeit und Dauerhaftigkeit über das CE-Kennzeichen und die Leistungserklärung (DoP).
                </p>
              </div>
            </div>
          ) : activeTab === 'praxis' ? (
            <PraxisTabContent moduleKey="bp_betonfertigteile" />
          ) : (
            <InnovationTabContent moduleKey="bp_betonfertigteile" />
          )}
        </div>
      </div>
      <ModuleFooter
        wikipedia={[
          { title: 'Betonfertigteil', url: 'https://de.wikipedia.org/wiki/Betonfertigteil' },
          { title: 'Spannbeton', url: 'https://de.wikipedia.org/wiki/Spannbeton' },
          { title: 'Hohlplatte' },
          { title: 'Filigrandecke', url: 'https://de.wikipedia.org/wiki/Filigrandecke' }
        ]}
        literatur={[
          'Steinle, A. / Bachmann, H. / Tillmann, M.: Bauen mit Betonfertigteilen. Konstruktion und Bemessung.',
          'Forschungsgemeinschaft für Fertigteilbau: Handbuch Betonfertigteile & Bemessungsmodelle.',
          'Wendehorst Bautechnische Zahlentafeln, 38. Auflage, Springer Vieweg 2026'
        ]}
        regelwerke={[
          { title: 'DIN EN 13369 (Allgemeine Regeln für Betonfertigteile)' },
          { title: 'DIN EN 1168 (Betonfertigteile - Hohlplatten)' },
          { title: 'DIN EN 13747 (Betonfertigteile - Deckensysteme mit Ortbetonergänzung)' },
          { title: 'DIN EN 14992 (Betonfertigteile - Wandelemente)' },
          { title: 'DIN 1045-4:2023-08 (Zusatzregeln für Herstellung und Konformität von Fertigteilen)' }
        ]}
        formeln={[
          {
            formel: 'v_{Rdi} = c \\cdot f_{ctd} + \\mu \\cdot \\sigma_n + \\rho \\cdot f_{yd} \\cdot (\\mu \\cdot \\sin\\alpha + \\cos\\alpha) \\le 0{,}5 \\, \\nu \\, f_{cd}',
            erklaerung: 'Bemessungswert der Schubtragfähigkeit in der Verbundfuge zwischen Fertigteil und Ortbetonschicht nach Eurocode 2 (DIN EN 1992-1-1 Abs. 6.2.5).',
            quelle: 'DIN EN 1992-1-1'
          },
          {
            formel: 'G_{\\text{Hohl}} \\approx (1 - \\eta) \\cdot G_{\\text{Voll}} \\quad (\\eta \\approx 0{,}35 - 0{,}45)',
            erklaerung: 'Gewichtsersparnis einer Spannbeton-Hohlplatte gegenüber einer Vollbeton-Massivdecke gleicher Bauhöhe durch innenliegende Hohlkanäle.',
            quelle: 'DIN EN 1168'
          }
        ]}
      />
    </div>
  );
}
