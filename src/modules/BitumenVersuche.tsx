import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Thermometer, ArrowDownToLine, Flame, BookOpen, Activity, Box } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';

type BitumenSorte = '160/220' | '70/100' | '50/70' | '30/45' | '20/30' | 'PmB 25/55-55';

interface BitumenVersucheProps {
  isEmbedded?: boolean;
}

export default function BitumenVersuche({ isEmbedded = false }: BitumenVersucheProps = {}) {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'versuche'>('versuche');
  const [sorte, setSorte] = useState<BitumenSorte>('50/70');
  const [activeTest, setActiveTest] = useState<'penetration' | 'ruk'>('penetration');
  
  // Test states
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [progress, setProgress] = useState(0); // 0 to 100
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getBitumenProps = (s: BitumenSorte) => {
    switch (s) {
      case '160/220': return { pen: 190, ruk: 39 }; // Soft
      case '70/100': return { pen: 85, ruk: 46 };
      case '50/70': return { pen: 60, ruk: 50 };
      case '30/45': return { pen: 38, ruk: 56 };
      case '20/30': return { pen: 25, ruk: 63 }; // Hard
      case 'PmB 25/55-55': return { pen: 40, ruk: 58 }; // Polymer modified
    }
  };

  const currentProps = getBitumenProps(sorte);

  const clearTestInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    resetTest();
    return () => clearTestInterval();
  }, [sorte, activeTest]);

  const resetTest = () => {
    clearTestInterval();
    setTestStatus('idle');
    setProgress(0);
  };

  const startTest = () => {
    setTestStatus('running');
    setProgress(0);
    
    const steps = 100;
    const intervalTime = activeTest === 'penetration' ? 50 : 80;
    let currentStep = 0;
    
    intervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setProgress(currentStep);
      } else {
        clearTestInterval();
        setTestStatus('finished');
      }
    }, intervalTime);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Box className="text-shiraz" /> Bitumen &amp; Bitumenprüfung
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Standardisierte Prüfverfahren zur Bestimmung der Konsistenz von Bitumen nach DIN EN 12591 und DIN EN 14023. 
            Die Nadelpenetration beschreibt die Härte bei mittleren Gebrauchstemperaturen (25 °C), 
            während der Erweichungspunkt Ring und Kugel (EP RuK) das Verhalten bei hohen Sommertemperaturen charakterisiert.
          </p>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'steckbrief' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steckbrief')}
          >
            <BookOpen size={16} /> Steckbrief
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'versuche' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('versuche')}
          >
            <Activity size={16} /> Virtuelle Versuche (Penetration &amp; EP RuK)
          </button>
        </div>

        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="bitumen" />
          </div>
        )}
      </div>

      {activeTab === 'versuche' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">1. Konfiguration</h3>
            
            <div className="space-y-3">
              <label className="text-sm font-bold text-text-main">Bitumensorte wählen</label>
              <select 
                className="w-full p-2 border border-home-grau rounded-md bg-off-white text-sm focus:outline-none focus:border-shiraz"
                value={sorte}
                onChange={(e) => setSorte(e.target.value as BitumenSorte)}
                disabled={testStatus === 'running'}
              >
                <option value="160/220">160/220 (Sehr weich)</option>
                <option value="70/100">70/100 (Weich)</option>
                <option value="50/70">50/70 (Standard)</option>
                <option value="30/45">30/45 (Hart)</option>
                <option value="20/30">20/30 (Sehr hart)</option>
                <option value="PmB 25/55-55">PmB 25/55-55 (Polymermodifiziert)</option>
              </select>
            </div>

            <div className="space-y-3 pt-4 border-t border-home-grau/30">
               <label className="text-sm font-bold text-text-main">Versuchsart</label>
               <div className="grid grid-cols-2 gap-2">
                 <button
                   onClick={() => setActiveTest('penetration')}
                   disabled={testStatus === 'running'}
                   className={`py-3 px-2 text-xs font-medium rounded-lg border transition-colors flex flex-col items-center gap-2 ${
                     activeTest === 'penetration' 
                       ? 'bg-shiraz text-white border-shiraz' 
                       : 'bg-off-white text-text-main border-home-grau/30 hover:border-shiraz/50'
                   }`}
                 >
                   <ArrowDownToLine size={18} />
                   Nadelpenetration
                 </button>
                 <button
                   onClick={() => setActiveTest('ruk')}
                   disabled={testStatus === 'running'}
                   className={`py-3 px-2 text-xs font-medium rounded-lg border transition-colors flex flex-col items-center gap-2 ${
                     activeTest === 'ruk' 
                       ? 'bg-shiraz text-white border-shiraz' 
                       : 'bg-off-white text-text-main border-home-grau/30 hover:border-shiraz/50'
                   }`}
                 >
                   <Thermometer size={18} />
                   Erweichungspunkt
                 </button>
               </div>
            </div>

            <div className="pt-4 border-t border-home-grau/30 flex gap-2">
               <button
                 onClick={startTest}
                 disabled={testStatus !== 'idle'}
                 className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <Play size={18} /> Start
               </button>
               <button
                 onClick={resetTest}
                 disabled={testStatus === 'idle'}
                 className="py-3 px-4 bg-home-grau/20 hover:bg-home-grau/30 text-text-main rounded-lg font-bold flex items-center justify-center transition-colors disabled:opacity-50"
               >
                 <RotateCcw size={18} />
               </button>
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full min-h-[400px]">
             <div className="flex justify-between items-center mb-6 border-b border-home-grau/30 pb-4">
               <h3 className="text-lg font-bold text-text-main">2. Durchführung ({activeTest === 'penetration' ? 'DIN EN 1426' : 'DIN EN 1427'})</h3>
               <div className="flex items-center gap-2">
                 <span className="text-sm font-medium text-home-grau">Status:</span>
                 <span className={`text-sm font-bold px-2 py-1 rounded ${
                   testStatus === 'idle' ? 'bg-home-grau/20 text-text-main' :
                   testStatus === 'running' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                   'bg-emerald-100 text-emerald-700'
                 }`}>
                   {testStatus === 'idle' ? 'Bereit' : testStatus === 'running' ? 'Läuft...' : 'Abgeschlossen'}
                 </span>
               </div>
             </div>

             <div className="flex-1 flex flex-col md:flex-row gap-8 items-center justify-center">
               
               <div className="relative w-64 h-64 bg-off-white border-2 border-home-grau/30 rounded-xl overflow-hidden flex-shrink-0">
                 {activeTest === 'penetration' ? (
                   <>
                     <div className="absolute left-2 top-2 bottom-2 w-4 border-r border-home-grau/50 flex flex-col justify-between text-[8px] text-home-grau pb-8">
                       <span>0</span>
                       <span>50</span>
                       <span>100</span>
                       <span>150</span>
                       <span>200</span>
                     </div>
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-24 bg-zinc-300 rounded-sm border-2 border-zinc-400">
                       <div className="absolute bottom-0 w-full h-20 bg-zinc-900 border-t border-zinc-700"></div>
                     </div>
                     
                     <div 
                       className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none"
                       style={{ 
                         bottom: `${100 - (progress / 100) * (currentProps.pen / 200) * 100}px` 
                       }}
                     >
                       <div className="w-12 h-16 bg-slate-400 border-2 border-home-grau/30 rounded-sm mx-auto shadow-sm flex items-center justify-center -translate-y-full absolute bottom-8 left-1/2 -translate-x-1/2">
                          <span className="text-xs font-bold text-white">100g</span>
                       </div>
                       <div className="w-1 h-32 bg-slate-300 border-x border-home-grau/30 mx-auto absolute bottom-0 left-1/2 -translate-x-1/2"></div>
                       <div className="w-0 h-0 border-l-[2px] border-r-[2px] border-t-[8px] border-transparent border-t-slate-500 mx-auto absolute -bottom-2 left-1/2 -translate-x-1/2"></div>
                     </div>

                     {testStatus === 'running' && (
                       <div className="absolute top-4 right-4 text-xs font-mono bg-white px-2 py-1 rounded border border-home-grau/30">
                         {((progress / 100) * 5).toFixed(1)} s
                       </div>
                     )}
                   </>
                 ) : (
                   <>
                     <div className="absolute left-2 top-2 bottom-2 w-4 flex flex-col justify-between text-[8px] text-home-grau pb-8 z-10">
                       <span>80°C</span>
                       <span>60°C</span>
                       <span>40°C</span>
                       <span>20°C</span>
                     </div>
                     
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-48 border-x-4 border-b-4 border-cyan-200 rounded-b-xl overflow-hidden">
                       <div className="absolute bottom-0 w-full h-40 bg-cyan-100/50">
                         {testStatus === 'running' && progress > 10 && (
                           <div className="absolute bottom-0 w-full h-full">
                             <div className="absolute w-2 h-2 bg-white/50 rounded-full left-1/4 animate-ping" style={{ bottom: `${(progress * 2) % 100}%` }}></div>
                             <div className="absolute w-3 h-3 bg-white/40 rounded-full left-2/4 animate-ping" style={{ bottom: `${(progress * 1.5 + 20) % 100}%`, animationDelay: '0.2s' }}></div>
                             <div className="absolute w-1.5 h-1.5 bg-white/60 rounded-full left-3/4 animate-ping" style={{ bottom: `${(progress * 2.5 + 10) % 100}%`, animationDelay: '0.5s' }}></div>
                           </div>
                         )}
                       </div>
                     </div>
                     
                     {testStatus === 'running' && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-3 bg-red-500 blur-sm rounded-full opacity-70"></div>
                     )}
                     
                     <div className="absolute top-16 left-1/2 -translate-x-1/2 w-24 h-32 border-x-2 border-home-grau/30">
                       <div className="absolute top-0 w-full h-1 bg-slate-400"></div>
                       <div className="absolute bottom-0 w-full h-1 bg-slate-400"></div>
                       
                       <div className="absolute top-1/4 w-12 h-4 left-1/2 -translate-x-1/2">
                          <div className="absolute w-full h-full border-x-4 border-amber-600 bg-zinc-900 z-10"></div>
                          <div 
                            className="absolute bg-zinc-900 w-8 left-1/2 -translate-x-1/2 rounded-b-full transition-all duration-300"
                            style={{
                              height: `${testStatus === 'finished' ? 24 : (progress / 100) * 24}px`,
                              top: '100%'
                            }}
                          ></div>
                          <div 
                            className="absolute w-6 h-6 bg-slate-300 rounded-full border-2 border-home-grau/30 shadow-sm left-1/2 -translate-x-1/2 transition-all duration-300 z-20"
                            style={{
                              top: `${testStatus === 'finished' ? 16 : -12 + (progress / 100) * 28}px`,
                            }}
                          ></div>
                       </div>
                     </div>

                     <div className="absolute top-4 right-4 text-xs font-mono bg-white px-2 py-1 rounded border border-home-grau/30 shadow-sm">
                       {(20 + (progress / 100) * (currentProps.ruk - 20)).toFixed(1)} °C
                     </div>
                   </>
                 )}
               </div>

               <div className="flex-1 space-y-4">
                 {testStatus === 'finished' ? (
                   <div className="animate-in fade-in slide-in-from-right-4 space-y-4">
                     <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                       <h4 className="font-bold text-emerald-900 mb-2">Ergebnis</h4>
                       {activeTest === 'penetration' ? (
                         <div>
                           <div className="text-3xl font-bold text-emerald-700">{currentProps.pen} <span className="text-sm font-normal text-emerald-800">1/10 mm</span></div>
                           <p className="text-sm text-emerald-800 mt-2">Die Nadel ist standardgemäß {currentProps.pen / 10} mm in die Bitumenprobe eingedrungen.</p>
                         </div>
                       ) : (
                         <div>
                           <div className="text-3xl font-bold text-emerald-700">{currentProps.ruk.toFixed(1)} <span className="text-sm font-normal text-emerald-800">°C</span></div>
                           <p className="text-sm text-emerald-800 mt-2">Die Bitumenprobe hat bei dieser Temperatur die vorgegebene Fließlänge (25,4 mm) erreicht.</p>
                         </div>
                       )}
                     </div>
                     <div className="bg-off-white border border-home-grau/30 p-4 rounded-xl">
                       <h4 className="font-bold text-sm text-text-main mb-1">Bedeutung für die Praxis</h4>
                       <p className="text-sm text-text-main/80">
                         {activeTest === 'penetration' 
                           ? `Geringe Penetrationswerte (z.B. 20/30) deuten auf ein hartes Bitumen hin (hoher Verformungswiderstand). Hohe Werte (z.B. 160/220) deuten auf ein weiches Bitumen hin (besser für kalte Regionen zur Vermeidung von Kälterissen).`
                           : `Ein hoher Erweichungspunkt (z.B. bei PmB oder harten Bitumen) bedeutet eine hohe Standfestigkeit bei sommerlichen Temperaturen, was die Gefahr von Spurrinnenbildung reduziert.`
                         }
                       </p>
                     </div>
                   </div>
                 ) : (
                   <div className="text-sm text-home-grau text-center p-8">
                     Drücke Start, um den Versuch durchzuführen.
                   </div>
                 )}
               </div>
             </div>

          </div>
        </div>
      </div>
    )}
      
      {!isEmbedded && (
        <ModuleFooter 
          wikipedia={[
            { title: 'Bitumen', url: 'https://de.wikipedia.org/wiki/Bitumen' },
            { title: 'Nadelpenetration', url: 'https://de.wikipedia.org/wiki/Nadelpenetration' },
            { title: 'Erweichungspunkt RuK', url: 'https://de.wikipedia.org/wiki/Erweichungspunkt_Ring_und_Kugel' }
          ]}
          regelwerke={[
            { title: 'DIN EN 12591 (Bitumen und bitumenhaltige Bindemittel - Spezifikationen für Straßenbaubitumen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12591' },
            { title: 'DIN EN 1426 (Bitumen und bitumenhaltige Bindemittel - Bestimmung der Nadelpenetration)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1426' },
            { title: 'DIN EN 1427 (Bitumen und bitumenhaltige Bindemittel - Bestimmung des Erweichungspunktes Ring und Kugel)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1427' }
          ]}
          literatur={[
            'Radenberg, M. (2014): Asphalt im Straßenbau (Kirschbaum Verlag)',
            'Velske, S.; Mentlein, H.; Eymann, P. (2013): Straßenbaupraxis (Bauwerk Verlag)',
            'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
          ]}
          formeln={[
            {
              formel: 'I_P = \\frac{20 \\cdot T_{\\text{R\\&K}} + 500 \\cdot \\lg(\\text{Pen}) - 1952}{T_{\\text{R\\&K}} - 50 \\cdot \\lg(\\text{Pen}) + 120}',
              erklaerung: 'Pfeiffer-van-Doormaal-Penetrationsindex (Ip): Kennzeichnet die Temperaturempfindlichkeit von Straßenbaubitumen (Standard: -1 bis +1; polymermodifiziert: Ip > +1).',
              quelle: 'DIN EN 12591 Anhang A'
            },
            {
              formel: '\\text{Pen} = \\frac{s}{0.1\\,\\text{mm}}',
              erklaerung: 'Nadelpenetration nach DIN EN 1426: Eindringtiefe einer genormten Prüfnadel (100 g Belastung, 5 s Prüfdauer, 25 °C Prüftemperatur) in Zehntelmillimetern.',
              quelle: 'DIN EN 1426'
            },
            {
              formel: 'T_{\\text{R\\&K}} = T \\quad \\text{bei} \\quad \\Delta h = 25.0\\,\\text{mm}',
              erklaerung: 'Erweichungspunkt Ring und Kugel nach DIN EN 1427: Badtemperatur, bei welcher die Stahlkugel das Bitumen im Ring um exakt 25 mm nach unten durchbiegt.',
              quelle: 'DIN EN 1427'
            },
            {
              formel: '\\lg(a_T) = \\frac{-C_1 \\cdot (T - T_s)}{C_2 + (T - T_s)}',
              erklaerung: 'Williams-Landel-Ferry-Gleichung (WLF): Beschreibt die temperaturabhängige Viskositäts- und Schermodulverschiebung von Bitumen als rheologisch einfaches Material.',
              quelle: 'Rheologie der Baustoffe'
            }
          ]}
        />
      )}
    </div>
  );
}
