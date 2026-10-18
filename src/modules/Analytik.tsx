import React, { useState } from 'react';
import { Microscope, Activity, Compass, Wind, Layers, Flame, MousePointerClick, Info } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

const TGAInteraction = () => {
  const [temp, setTemp] = useState(20);
  
  // Mass loss logic
  const getMass = (t: number) => {
    let mass = 100;
    if (t > 100) mass -= 2; // freies Wasser
    if (t > 450) mass -= 5 * Math.min(1, (t - 450) / 50); // Ca(OH)2
    if (t > 750) mass -= 15 * Math.min(1, (t - 750) / 80); // CaCO3
    return mass.toFixed(1);
  };

  const getPhase = (t: number) => {
    if (t < 100) return "Stabile Phase (Trocknung)";
    if (t >= 100 && t < 400) return "Abgabe von gebundenem Wasser (z.B. C-S-H)";
    if (t >= 400 && t < 500) return "Zersetzung von Portlandit (Ca(OH)₂ → CaO + H₂O)";
    if (t >= 500 && t < 700) return "Stabile Phase";
    if (t >= 700 && t < 850) return "Zersetzung von Calciumcarbonat (CaCO₃ → CaO + CO₂)";
    return "Sinterung / Schmelzphase";
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border border-home-grau/30 shadow-inner">
      <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><MousePointerClick size={16}/> Interaktiv: TGA-Simulator (Betonprobe)</h4>
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">Temperatur: {temp}°C</label>
        <input 
          type="range" 
          min="20" max="1000" 
          value={temp} 
          onChange={(e) => setTemp(Number(e.target.value))}
          className="w-full accent-orange-600" 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-50 p-3 rounded-md border border-orange-100 flex flex-col items-center justify-center">
          <span className="text-xs text-orange-800 uppercase tracking-wider font-bold">Masse</span>
          <span className="text-2xl font-mono text-orange-600">{getMass(temp)}%</span>
        </div>
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200 flex flex-col justify-center">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Prozess</span>
          <span className="text-sm text-gray-800 leading-tight">{getPhase(temp)}</span>
        </div>
      </div>
    </div>
  );
};

const MIPInteraction = () => {
  const [pressure, setPressure] = useState(1);
  
  const getPoreRadius = (p: number) => {
    return (7500 / p).toFixed(1);
  };

  const getPoreType = (p: number) => {
    const r = 7500 / p;
    if (r > 50) return "Kapillarporen (Transport von Wasser & Schadstoffen)";
    if (r > 10) return "Mesoporen / Größere Gelporen";
    return "Gelporen (Kaum Wassertransport, Festigkeitsbildner)";
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border border-home-grau/30 shadow-inner">
      <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><MousePointerClick size={16}/> Interaktiv: MIP-Druck in MPa (≙ 10 bar)</h4>
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">Druck (log): 10^{pressure} bar</label>
        <input 
          type="range" 
          min="0" max="3.6" step="0.1"
          value={pressure} 
          onChange={(e) => setPressure(Number(e.target.value))}
          className="w-full accent-cyan-600" 
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-cyan-50 p-3 rounded-md border border-cyan-100 flex flex-col items-center justify-center text-center">
          <span className="text-xs text-cyan-800 uppercase tracking-wider font-bold mb-1">Porenradius</span>
          <span className="text-xl font-mono text-cyan-600">ca. {getPoreRadius(Math.pow(10, pressure))} nm</span>
        </div>
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200 flex items-center text-center justify-center">
          <span className="text-sm text-gray-800 leading-tight">{getPoreType(Math.pow(10, pressure))}</span>
        </div>
      </div>
    </div>
  );
};

const RemEdxInteraction = () => {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  const points = [
    { id: 1, x: 20, y: 30, name: "Portlandit (CH)", elements: "Ca, O", desc: "Große, blättrig/hexagonale Kristalle" },
    { id: 2, x: 60, y: 50, name: "C-S-H Phasen", elements: "Ca, Si, O", desc: "Amorphe, wolkige Struktur, Hauptfestigkeitsbildner" },
    { id: 3, x: 80, y: 20, name: "Ettringit", elements: "Ca, Al, S, O", desc: "Nadelige Kristalle oft im Porenraum" },
  ];

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border border-home-grau/30 shadow-inner">
      <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><MousePointerClick size={16}/> Interaktiv: REM/EDX Punktsonde</h4>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-1/2 aspect-video bg-stone-300 rounded-md border border-stone-400 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] mix-blend-multiply"></div>
          <span className="text-stone-500 font-mono text-xs z-0 relative font-bold uppercase tracking-widest">REM Visualisierung</span>
          
          {points.map((pt) => (
            <button
              key={pt.id}
              onClick={() => setSelectedPoint(pt.id)}
              className={`absolute w-5 h-5 rounded-full border-[3px] transform -translate-x-1/2 -translate-y-1/2 transition-all shadow-sm z-10 ${selectedPoint === pt.id ? 'bg-purple-500 border-white scale-125 cursor-default' : 'bg-white/50 border-purple-500 hover:scale-110 cursor-pointer animate-pulse'}`}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              title="EDX Analyse"
            />
          ))}
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          {selectedPoint ? (
            <div className="bg-purple-50 p-4 rounded-md border border-purple-100 animate-in fade-in zoom-in-95 duration-200 h-full flex flex-col justify-center">
              <span className="text-xs text-purple-800 uppercase tracking-wider font-bold block mb-1">Spektrum Auswertung</span>
              <h5 className="font-bold text-gray-900 text-lg">{points.find(p => p.id === selectedPoint)?.name}</h5>
              <div className="flex gap-2 items-center mt-2 mb-2">
                <span className="font-mono text-sm bg-purple-200 text-purple-900 px-2 py-0.5 rounded shadow-sm font-bold border border-purple-300">{points.find(p => p.id === selectedPoint)?.elements}</span>
              </div>
              <p className="text-sm text-gray-700 mt-1 leading-snug">{points.find(p => p.id === selectedPoint)?.desc}</p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 p-4 rounded-md text-center flex flex-col items-center justify-center h-full text-gray-500">
              <Info size={24} className="mb-2 opacity-50"/>
              <p className="text-sm">Klicken Sie auf Messpunkte im Bild, um die Elemente (EDX) anzuzeigen.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const XrdInteraction = () => {
    const [selectedMineral, setSelectedMineral] = useState<string | null>(null);

    const peaks = [
        { angle: 9.1, name: "Ettringit", mineral: "Ettringit", intensity: 40 },
        { angle: 18.0, name: "Portlandit", mineral: "CH", intensity: 65 },
        { angle: 26.6, name: "Quarz", mineral: "SiO2", intensity: 100 },
        { angle: 29.4, name: "Calcit", mineral: "CaCO3", intensity: 80 }
    ];

    return (
        <div className="mt-4 p-4 bg-white rounded-lg border border-home-grau/30 shadow-inner">
            <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                <MousePointerClick size={16} /> Interaktiv: XRD Diffraktogramm (Reflex-ID)
            </h4>
            <div className="relative h-40 bg-slate-50 border-b-2 border-l-2 border-home-grau/30 rounded-bl-sm pt-4 pr-4 ml-6 mb-6 mt-4">
                <div className="absolute -bottom-6 right-2 text-xs text-slate-500 font-mono">2 Theta (°)</div>
                <div className="absolute top-2 -left-8 text-xs text-slate-500 font-mono -rotate-90 origin-top-left transform translate-y-8">Intensität</div>
                
                {/* Simulated baseline noise */}
                <svg className="absolute inset-x-0 bottom-0 h-full w-full opacity-30 pointer-events-none" preserveAspectRatio="none">
                    <path d="M0,150 Q10,145 20,150 T40,150 T60,150 T80,148 T100,150 T120,150 T140,150 T160,152 T180,150 T200,150 T220,149 T240,150 T260,150 T280,150 T300,150 T320,151 T340,150 L340,160 L0,160 Z" fill="none" stroke="#64748b" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                </svg>

                {/* Peaks */}
                <div className="absolute bottom-0 left-0 right-0 h-full flex items-end px-2">
                    <div className="relative w-full h-full">
                        {peaks.map((p, i) => {
                            const percentX = (p.angle / 40) * 100;
                            const isSelected = selectedMineral === p.mineral;
                            return (
                                <div 
                                    key={i} 
                                    className="absolute bottom-0 flex flex-col items-center transform -translate-x-1/2 cursor-pointer group"
                                    style={{ left: `${percentX}%`, height: `${p.intensity}%` }}
                                    onClick={() => setSelectedMineral(p.mineral)}
                                >
                                    <div className={`absolute -top-7 whitespace-nowrap px-2 py-0.5 bg-slate-800 text-white text-[10px] sm:text-xs rounded transition-opacity shadow-sm z-20 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                        {p.name} ({p.angle}°)
                                    </div>
                                    <div className={`w-0.5 transition-all z-10 origin-bottom ${isSelected ? 'h-full bg-blue-600 scale-x-[3] scale-y-[1.05]' : 'h-full bg-blue-500 group-hover:scale-y-[1.05]'}`}></div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            
            <div className="mt-2 flex gap-2 justify-center items-center">
                <span className="text-sm text-gray-600">Erkannte Phase:</span>
                {selectedMineral ? 
                    <span className="text-sm font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-md shadow-sm border border-blue-200">{peaks.find(p => p.mineral === selectedMineral)?.name}</span> : 
                    <span className="text-sm italic text-gray-600 bg-gray-100 px-3 py-1 rounded-md">Klicke auf einen Reflex (Linie)</span>
                }
            </div>
        </div>
    );
};

export default function Analytik() {
  const [activeTab, setActiveTab] = useState<'kristall' | 'chemie' | 'mikroskopie' | 'poren_thermo'>('kristall');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Microscope className="text-shiraz" /> Analyseverfahren in der Baustoffkunde
          </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Umfassende physikalische, chemische und mineralogische Diagnosemethoden im Labor
          </p>
        </div>
        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Moderne Materialdiagnostik ermöglicht es, die chemische Zusammensetzung, die mineralogische Struktur sowie das thermische Verhalten von Baustoffen bis in den Nano-Bereich zu untersuchen. Diese Methoden sind essenziell für die Schadensanalyse, Qualitätskontrolle und Schadstofferkundung.
          </p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 border shadow-sm cursor-pointer ${
              activeTab === 'kristall' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('kristall')}
          >
            Kristallographie &amp; Phasen (XRD, FTIR)
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 border shadow-sm cursor-pointer ${
              activeTab === 'chemie' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('chemie')}
          >
            Elementaranalyse (RFA, ICP-OES)
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 border shadow-sm cursor-pointer ${
              activeTab === 'mikroskopie' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('mikroskopie')}
          >
            Mikroskopie &amp; Gefüge (REM &amp; EDX)
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 border shadow-sm cursor-pointer ${
              activeTab === 'poren_thermo' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('poren_thermo')}
          >
            Porendiagnostik &amp; Thermobar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* XRD */}
          {(activeTab === 'kristall') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Layers className="text-blue-600" size={20} />
                XRD (Röntgendiffraktometrie)
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Bestimmt die <strong>mineralogische (kristalline) Phasenzusammensetzung</strong>. Amorphe Stoffe (wie Glas oder C-S-H-Phasen) können nicht direkt erfasst werden.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><strong>Was wird gemessen:</strong> Beugung (Diffraktion) von Röntgenstrahlen am Kristallgitter. Jedes Mineral hat ein einzigartiges "Fingerabdruck"-Diffraktogramm.</li>
                <li><strong>Anwendung:</strong> Klinkerphasen im Zement bestimmen, Nachweis von Ettringit oder Thaumasit bei Sulfattreiben, Identifikation von bauschädlichen Salzen (Nitrate, Sulfate).</li>
                <li><strong>Probenvorbereitung:</strong> Material muss zu feinem Pulver zermahlen werden (Pulverdiffraktometrie).</li>
              </ul>
              <XrdInteraction />
            </div>
          )}

          {/* FTIR */}
          {(activeTab === 'kristall') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Activity className="text-pink-600" size={20} />
                FTIR (Infrarotspektroskopie)
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Analysiert funktionelle Gruppen organischer sowie anorganischer Verbindungen durch Absorption von Infrarotstrahlung.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><strong>Was wird gemessen:</strong> Molekülschwingungen (Banden im IR-Spektrum), die charakteristisch für bestimmte chemische Bindungen sind.</li>
                <li><strong>Anwendung:</strong> Ideal für die Identifikation von Kunststoffen (Polymere, Harze, Folien), Bitumenalterung (Oxidation), Additiven in Farben und Putzen sowie zur Analyse von Salzkristallen.</li>
              </ul>
            </div>
          )}

          {/* NIR */}
          {(activeTab === 'kristall') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Activity className="text-indigo-500" size={20} />
                NIR (Nahes Infrarotspektroskopie)
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Zerstörungsfreie optische Absorptionsspektroskopie im Wellenlängenbereich von 780 bis 2500 nm für schnelle Screenings und Recycling.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><strong>Was wird gemessen:</strong> Molekulare Oberschwingungen und Kombinationsbanden (besonders empfindlich auf C-H, O-H, N-H-Bindungen im Baustoff).</li>
                <li><strong>Anwendung:</strong> Zerstörungsfreie Bestimmung der Holzfeuchte, Sortierung von Bau- und Abbruchholz im Recyclingprozess, Identifikation von Asbestvorkommen in Putzen sowie Sortentrennung von Kunststoffen und Gipsplatten im Schuttstrom.</li>
                <li><strong>Vorteil:</strong> Kontaklose Echtzeitmessung (auch bandfähig), extrem transportabel (Handgeräte) und vollständig zerstörungsfrei ohne Chemie.</li>
              </ul>
            </div>
          )}

          {/* RFA */}
          {(activeTab === 'chemie') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Activity className="text-emerald-600" size={20} />
                RFA (Röntgenfluoreszenzanalyse)
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Bestimmt die <strong>elementare (chemische) Zusammensetzung</strong> einer Probe (welche Elemente sind vorhanden und in welcher Konzentration?).
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><strong>Was wird gemessen:</strong> Probe wird mit Röntgenstrahlung angeregt. Elemente senden spezifische Fluoreszenzstrahlung zurück.</li>
                <li><strong>Anwendung:</strong> Nachweis von Schwermetallen (Blei, Cadmium) im Altbestand, Chloridgehalt im Beton, Bestimmung der Hauptoxide von Zement (CaO, SiO2, Al2O3).</li>
                <li><strong>Tragbare Geräte:</strong> Hand-RFA ("guns") ermöglichen schnelle Analysen direkt auf der Baustelle, z.B. für die Legierungsbestimmung im Stahlbau oder Schadstoffdetektion (HBCD).</li>
              </ul>
            </div>
          )}

          {/* ICP-OES */}
          {(activeTab === 'chemie') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Activity className="text-amber-600" size={20} />
                ICP-OES
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Optische Emissionsspektroskopie mit induktiv gekoppeltem Plasma.</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><strong>Wie es funktioniert:</strong> Eine flüssige Probe wird in ein bis zu 10.000 K heißes Argon-Plasma vernebelt. Die emittierten Wellenlängen der Atome werden spektral ausgewertet.</li>
                <li><strong>Anwendung:</strong> Hochempfindliches Verfahren zur exakten Spurenelement-Analyse von gelösten Stoffen (Schwermetalle, Kationen) – häufig der Standard zur chemischen Untersuchung nach Elutionsversuchen gemäß Ersatzbaustoffverordnung.</li>
              </ul>
            </div>
          )}

          {/* LIPS / LIBS */}
          {(activeTab === 'chemie') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Activity className="text-teal-600" size={20} />
                LIPS / LIBS (Laserinduzierte Plasmaspektroskopie)
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Laser-Induced Breakdown Spectroscopy (Zerstörungsfreie Mikrosondierung mittels Hochenergie-Laserpuls).</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><strong>Wie es funktioniert:</strong> Ein ultrakurzer, hochenergetischer Laserpuls wird auf die Baustoffoberfläche gebündelt. Eine mikroskopische Menge des Stoffs verdampft und bildet ein heißes, leuchtendes Gas-Plasma. Die optischen Emissionslinien dieses abkühlenden Plasmas werden spektral analysiert und verraten die Elementzusammensetzung.</li>
                <li><strong>Anwendung:</strong> Schnelle, kontinuierliche Vor-Ort-Tiefenprofile von Schadelementen (z. B. zerstörungsfreie Erhöhungen oder Profilkurven von Chlorideneindringtiefen an Brücken/Stahlbeton), Nachweis von extrem leichten Elementen (C, Li, Be, B), die mit tragbaren RFA-Systemen nicht erfasst werden können.</li>
                <li><strong>Vorteil:</strong> Vor-Ort-Eignung als Handgerät, vernachlässigbare Probebeschädigung, keinerlei zeitintensive nasschemische Vorbereitung von Säureaufschlüssen oder Presslingen.</li>
              </ul>
            </div>
          )}

          {/* Chloridbestimmung */}
          {(activeTab === 'chemie') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Activity className="text-red-650" size={20} />
                Nasschemische Chloridbestimmung (DIN EN 14629)
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Der Standard-Laborweg zur Quantifizierung korrosionsauslösender <strong>Chloride im Beton</strong>. Schützt Bauwerke vor unerwartetem Lochfraß (Bewehrungskorrosion).
              </p>
              <div className="space-y-4 text-xs text-gray-700">
                <div className="bg-white p-2.5 rounded border border-home-grau/15">
                  <span className="font-bold text-shiraz">Prüfungsablauf im Detail:</span>
                  <ol className="list-decimal pl-4 mt-1 space-y-1">
                    <li><strong>Probenahme & Aufbereitung:</strong> Entnahme von Bohrmehl aus verschiedenen Tiefen (z.B. 0-10 mm, 10-20 mm, etc.) zur Erstellung eines Tiefenprofils. Einwiegen einer pulverisierten Teilprobe im Labor.</li>
                    <li><strong>Säureaufschluss:</strong> Kochen des Bohrmehls in heißer, verdünnter Salpetersäure (<strong className="font-mono text-[10px]">HNO₃</strong>), um sämtliche gebundenen Chloride aus der Zementsteinmatrix vollständig freizusetzen.</li>
                    <li><strong>Titration (Volhard oder Potentiometrisch):</strong> Ausfällung der Chlorid-Ionen durch Zugabe von Silbernitrat (<strong className="font-mono text-[10px]">AgNO₃</strong>) zu Silberchlorid-Niederschlag. Die Erfassung des Endpunkts erfolgt hochpräzise über eine ionenselektive Silberelektrode.</li>
                    <li><strong>Berechnung:</strong> Bestimmung des prozentualen Chloridgewichts bezogen auf die Zementmasse.</li>
                  </ol>
                </div>
                <div className="bg-white p-2.5 rounded border border-home-grau/15 flex justify-between gap-2.5">
                  <div className="flex-1">
                    <span className="font-bold text-gray-800">Grenzwert ULS (Stahlbeton):</span>
                    <p className="font-mono font-bold text-amber-600 text-[11px] mt-0.5">max. 0.40 Masse-% / Zement</p>
                  </div>
                  <div className="border-l border-home-grau/15 pl-2.5 flex-1">
                    <span className="font-bold text-gray-800">Grenzwert ULS (Spannbeton):</span>
                    <p className="font-mono font-bold text-red-600 text-[11px] mt-0.5">max. 0.20 Masse-% / Zement</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REM / ESEM / EDX */}
          {(activeTab === 'mikroskopie') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm md:col-span-2 transition-all animate-in fade-in duration-305">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Compass className="text-purple-600" size={20} />
                REM / ESEM & EDX (Rasterelektronenmikroskopie)
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Abbildung von Mikrostrukturen mit höchster Auflösung bis in den Nanometerbereich sowie lokale Elementanalyse.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><strong>REM (Rasterelektronenmikroskop):</strong> Hohes Vakuum nötig. Proben müssen elektrisch leitend sein (oft mit Gold oder Kohlenstoff bedampft). Zeigt z.B. Ettringit-Nadeln im Porenraum sehr plastisch.</li>
                <li><strong>ESEM (Environmental Scanning Electron Microscope):</strong> Braucht kein Hochvakuum. Sehr vorteilhaft für Bauchemie: Feuchte Proben, Erhärtungsvorgänge (Hydratation von Zement) können live beobachtet werden (ohne Trocknung).</li>
                <li><strong>EDX (Energiedispersive Röntgenspektroskopie):</strong> Ist meist an ein REM gekoppelt. Erkennt, welche chemischen Elemente an einem bestimmten mikroskopischen Punkt vorliegen ("Punktanalyse").</li>
              </ul>
              <RemEdxInteraction />
            </div>
          )}

          {/* μ-CT */}
          {(activeTab === 'mikroskopie') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm md:col-span-2 transition-all animate-in fade-in duration-305">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Compass className="text-indigo-600" size={20} />
                μ-CT (Röntgen-Mikrocomputertomographie)
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Zerstörungsfreie dreidimensionale Bildgebung der inneren Mikrostruktur mit hoher räumlicher Auflösung im Mikrometerbereich.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><strong>Was wird gemessen:</strong> Prototypische Röntgen-Abschwächung aus hunderten rotatorischen Richtungen. Ein Hochleistungsrechner rekonstruiert ein lückenloses 3D-Volumenmodell des inneren Aufbaus.</li>
                <li><strong>Anwendung:</strong> Charakterisierung von Porensystemen in Dämmstoffen und Beton, In-situ-Spurenverfolgung von Rissentwicklung bei Zug-/Druckbelastung, Überprüfung der Faserorientierung in Carbon- und Faserbeton, berührungsfreie Verschleiß- und Gefügediagnostik.</li>
                <li><strong>Vorteil:</strong> Völlig zerstörungsfrei und liefert echte, unverzerrte 3D-Volumendaten gegenüber traditionellen zweidimensionalen Dünnschliffen.</li>
              </ul>
            </div>
          )}

          {/* TGA */}
          {(activeTab === 'poren_thermo') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Flame className="text-orange-600" size={20} />
                TGA (Thermogravimetrische Analyse)
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Misst die <strong>Massenänderung einer Probe in Abhängigkeit ihrer Temperatur</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><strong>Anwendung:</strong> Bestimmung des Portlanditgehalts Ca(OH)2 (Abgabe von chemisch gebundenem Wasser bei ca. 450°C), Bestimmung des Karbonatisierungsgrads (CO2-Abspaltung bei ca. 800°C).</li>
              </ul>
              <TGAInteraction />
            </div>
          )}

          {/* MIP */}
          {(activeTab === 'poren_thermo') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Compass className="text-cyan-600" size={20} />
                MIP (Quecksilberdruckporosimetrie)
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Bestimmung der <strong>Porenradienverteilung und Porosität</strong> poröser Baustoffe.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><strong>Wie es funktioniert:</strong> Quecksilber (nicht-benetzend) wird unter extrem hohem Druck (bis über 4000 bar) in die Poren gepresst. Je höher der Druck, desto kleinere Poren werden gefüllt.</li>
                <li><strong>Anwendung:</strong> Frostwiderstand von Beton/Ziegeln, Kapillarsaugverhalten, Dichtigkeit, Dauerhaftigkeitsstudien.</li>
              </ul>
              <MIPInteraction />
            </div>
          )}

          {/* GC-MS */}
          {(activeTab === 'poren_thermo') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all md:col-span-2 animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Wind className="text-teal-600" size={20} />
                GC-MS / MS-GC (Gaschromatografie-Massenspektrometrie)
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Gaschromatografie mit gekoppeltem Massenspektrometer zur hochempfindlichen Schadstoffanalyse.</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><strong>Funktionsweise:</strong> Das organische Gemisch wird thermisch verdampft und in einer Kapillartrennsäule molekülspezifisch aufgetrennt (Gaschromatografie). Der Austrittsstrom wird im Massenspektrometer ionisiert, fragmentiert und anhand des Ladung-Masse-Verhältnisses (m/z) im Detektor absolut identifiziert.</li>
                <li><strong>Anwendung:</strong> Der unangefochtene Goldstandard zur Qualifizierung und Quantifizierung von komplexen schwer- und leichtflüchtigen organischen Schadstoffen (z. B. PAK, Holzschutzmittel wie PCP, Lindan oder Carbolineum, PCB, flüchtige Emissionen / VOCs sowie Weichmacher in Farben oder Klebstoffen).</li>
              </ul>
            </div>
          )}

          {/* Protonen-NMR */}
          {(activeTab === 'poren_thermo') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all md:col-span-2 animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Layers className="text-emerald-600" size={20} />
                Protonen-NMR / 1H-NMR-Relaxometrie
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Zerstörungsfreie Kernspinresonanz-Spektroskopie zur Bestimmung von Wasserzuständen und Porengeometrien.</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><strong>Wie es funktioniert:</strong> In einem statischen Magnetfeld werden die magnetischen Momente von Wasserstoffkernen (Protonen ¹H) des Porenwassers ausgerichtet und durch Hochfrequenzpulse ausgelenkt. Die gemessene Relaxationszeit beim Zurückschwenken in den Grundzustand ist direkt proportional zur spezifischen Oberfläche und Porengröße.</li>
                <li><strong>Anwendung:</strong> Kontinuierliche In-situ-Verfolgung der Zementhydratation (Erstarrungsprozess) ab Minute 1, quantitative Unterscheidung von chemisch, physikalisch und kapillar gebundenem Wasser im Betongefüge, Bestimmung der Porengrößenverteilung im Nanometerbereich ohne den Einsatz hochgiftigen Quecksilbers.</li>
                <li><strong>Vorteil:</strong> Extrem schonendes und zerstörungsfreies Online-Monitoring, das die echte Gefügestruktur nicht durch schädigendes Austrocknen oder Vakuumbeanspruchung verändert.</li>
              </ul>
            </div>
          )}

        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Röntgendiffraktometrie (XRD)', url: 'https://de.wikipedia.org/wiki/R%C3%B6ntgendiffraktometrie' },
          { title: 'Röntgenfluoreszenzanalyse (RFA)', url: 'https://de.wikipedia.org/wiki/R%C3%B6ntgenfluoreszenzanalyse' },
          { title: 'Rasterelektronenmikroskop (REM)', url: 'https://de.wikipedia.org/wiki/Rasterelektronenmikroskop' },
          { title: 'Infrarotspektroskopie (FTIR)', url: 'https://de.wikipedia.org/wiki/Infrarotspektroskopie' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Stark, J., Wicht, B.: Zement und Beton: Entstehung, Eigenschaften und Verwendung (Springer)',
          'Plank, J.: Vorlesungsskriptum Bauchemische Analytik (TU München)'
        ]}
        regelwerke={[
          { title: 'DIN EN 14629:2007-06 (Produkte und Systeme für den Schutz und die Instandsetzung von Betontragwerken - Bestimmung des Chloridgehaltes von Festbeton)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN ISO 15901-1:2019-03 (Porengrößenverteilung und Porosität von Feststoffen durch Quecksilberporosimetrie)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 13925-1:2003-07 (Zerstörungsfreie Prüfung - Röntgendiffraktometrie an polykristallinen und amorphen Materialien)', url: 'https://www.dinmedia.de/' }
        ]}
        formeln={[
          {
            formel: '\\lambda = 2d \\cdot \\sin(\\theta)',
            erklaerung: 'Bragg-Gleichung für die Röntgendiffraktometrie (XRD). Bestimmt den Netzebenenabstand d riss- und zerstörungsfrei aus Beugungswinkeln.',
            quelle: 'DIN EN 13925-1:2003-07'
          },
          {
            formel: 'p \\cdot r = -2\\gamma \\cdot \\cos(\\theta)',
            erklaerung: 'Washburn-Gleichung für die Quecksilberdruckporosimetrie (MIP). Setzt den erforderlichen Einpressdruck p in Relation zum Porenradius r, Oberflächenspannung γ und Benetzungswinkel θ.',
            quelle: 'DIN ISO 15901-1:2019-03'
          },
          {
            formel: 'E = h \\cdot \\nu = \\frac{h \\cdot c}{\\lambda}',
            erklaerung: 'Planck-Einstein-Beziehung für spektroskopische Verfahren (FTIR/RFA). Verknüpft die Energie der Strahlung E mit Wellenlänge λ.',
            quelle: 'Basis-Physik'
          }
        ]}
      />
    </div>
  );
}
