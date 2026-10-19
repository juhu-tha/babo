import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Play, RotateCcw, CircleDashed } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type ConsistencyClass = 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'SVB';

export default function Ausbreitversuch() {
  const [consistency, setConsistency] = useState<ConsistencyClass>('F3');
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [progress, setProgress] = useState(0);
  const [ausbreitmass, setAusbreitmass] = useState<number>(200);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearCurrentInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getRheologyParams = (c: ConsistencyClass) => {
    // Approximate values for yield stress (tau_0 in Pa) and plastic viscosity (mu in Pa*s)
    switch(c) {
      case 'F1': return { tau0: 1500, mu: 100, targetMass: 320 };
      case 'F2': return { tau0: 1000, mu: 80, targetMass: 380 };
      case 'F3': return { tau0: 600, mu: 60, targetMass: 450 };
      case 'F4': return { tau0: 300, mu: 40, targetMass: 520 };
      case 'F5': return { tau0: 150, mu: 30, targetMass: 590 };
      case 'F6': return { tau0: 50, mu: 20, targetMass: 660 };
      case 'SVB': return { tau0: 10, mu: 50, targetMass: 750 }; // SVB has very low yield stress but higher viscosity to prevent segregation
    }
  };

  const params = getRheologyParams(consistency);

  const runTest = () => {
    setTestStatus('running');
    setProgress(0);
    setAusbreitmass(200);

    let targetMass = params.targetMass + (Math.random() * 20 - 10);

    let currentStep = 0;
    const steps = 40;
    clearCurrentInterval();
    intervalRef.current = setInterval(() => {
      if (currentStep <= steps) {
        setProgress((currentStep / steps) * 100);
        const t = currentStep / steps;
        const easedT = 1 - Math.pow(1 - t, 3); // easeOutCubic
        setAusbreitmass(200 + (targetMass - 200) * easedT);
        currentStep++;
      } else {
        clearCurrentInterval();
        setTestStatus('finished');
      }
    }, 50);
  };

  const resetTest = () => {
    clearCurrentInterval();
    setTestStatus('idle');
    setAusbreitmass(200);
    setProgress(0);
  };

  useEffect(() => {
    resetTest();
  }, [consistency]);

  useEffect(() => {
    return () => clearCurrentInterval();
  }, []);

  const rheologyChartData = useMemo(() => {
    const data = [];
    
    // Always show the full Bingham curve for the selected consistency
    const maxGammaDot = 50;
    for (let gammaDot = 0; gammaDot <= maxGammaDot; gammaDot += 5) {
      const tau = params.tau0 + params.mu * gammaDot;
      data.push({ x: gammaDot, y: tau });
    }

    return {
      datasets: [
        {
          label: `Bingham-Modell (${consistency})`,
          data: data,
          borderColor: '#A3113E',
          backgroundColor: 'rgba(139, 21, 56, 0.2)',
          borderWidth: 3,
          pointRadius: 0,
          fill: true,
        }
      ]
    };
  }, [consistency, params]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear' as const,
        title: { display: true, text: 'Schergeschwindigkeit γ̇ (1/s)' },
        min: 0,
        max: 50
      },
      y: {
        title: { display: true, text: 'Scherspannung τ (Pa)' },
        min: 0,
        // Let Chart.js auto-scale the y-axis based on the data
      }
    },
    plugins: { legend: { position: 'top' as const } }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <CircleDashed className="text-shiraz" /> Ausbreitversuch & Rheologie
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Der Ausbreitversuch nach DIN EN 12350-5 dient zur Bestimmung der Konsistenz von Frischbeton. 
            Gleichzeitig lässt sich das Fließverhalten von Beton rheologisch durch das <strong>Bingham-Modell</strong> beschreiben, 
            welches durch die Fließgrenze (τ₀) und die plastische Viskosität (μ) definiert ist.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">1. Versuchskonfiguration</h3>
            
            <div className="space-y-3">
              <label className="text-sm font-bold text-text-main">Konsistenzklasse wählen</label>
              <select
                value={consistency}
                onChange={(e) => setConsistency(e.target.value as ConsistencyClass)}
                disabled={testStatus === 'running'}
                className="w-full p-3 border border-home-grau/30 rounded-lg bg-off-white text-sm font-medium"
              >
                <option value="F1">F1 (steif, &lt; 340 mm)</option>
                <option value="F2">F2 (plastisch, 350 - 410 mm)</option>
                <option value="F3">F3 (weich, 420 - 480 mm)</option>
                <option value="F4">F4 (sehr weich, 490 - 550 mm)</option>
                <option value="F5">F5 (fließfähig, 560 - 620 mm)</option>
                <option value="F6">F6 (sehr fließfähig, 630 - 700 mm)</option>
                <option value="SVB">SVB: Prüfung über Setzfließmaß nach DIN EN 12350-8 (Klassen SF1–SF3), nicht über den Ausbreittisch</option>
              </select>
            </div>

            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="text-sm font-bold text-shiraz mb-2">Rheologische Parameter</h4>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-text-main">Fließgrenze (τ₀):</span>
                <span className="text-sm font-bold">{formatDeWert(params.tau0)} Pa</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-main">Plastische Viskosität (μ):</span>
                <span className="text-sm font-bold">{formatDeWert(params.mu)} Pa·s</span>
              </div>
            </div>

            <div className="pt-4 border-t border-home-grau/30 flex gap-2">
              <button
                onClick={runTest}
                disabled={testStatus !== 'idle'}
                className="flex-1 py-3 bg-shiraz hover:bg-shiraz/90 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Play size={18} /> Test Starten
              </button>
              <button
                onClick={resetTest}
                disabled={testStatus === 'idle'}
                className="py-3 px-4 bg-home-grau/20 hover:bg-home-grau/30 text-text-main rounded-xl font-bold flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Execution & Results */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col">
            <h3 className="text-lg font-bold text-text-main mb-6 border-b border-home-grau/30 pb-4">2. Versuchsdurchführung</h3>
            
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
              <div className="w-full max-w-md h-64 bg-stone-200 rounded-xl flex items-center justify-center relative border-2 border-stone-300 overflow-hidden shadow-inner">
                <svg viewBox="0 0 300 150" className="w-full h-full">
                  <defs>
                    <clipPath id="ground-clip">
                      <rect x="0" y="0" width="300" height="120" />
                    </clipPath>
                  </defs>
                  
                  {/* Base plate */}
                  <line x1="10" y1="120" x2="290" y2="120" stroke="#94a3b8" strokeWidth="4" />
                  
                  {/* Scale */}
                  <g transform="translate(150, 122)">
                    <line x1="0" y1="0" x2="0" y2="4" stroke="#64748b" strokeWidth="1" />
                    {[300, 400, 500, 600, 700].map(d => {
                      const rx = d * 0.15;
                      return (
                        <g key={d}>
                          <line x1={rx} y1="0" x2={rx} y2="4" stroke="#64748b" strokeWidth="1" />
                          <line x1={-rx} y1="0" x2={-rx} y2="4" stroke="#64748b" strokeWidth="1" />
                          <text x={rx} y="10" fontSize="6" fill="#64748b" textAnchor="middle">{formatDeWert(d)}</text>
                          <text x={-rx} y="10" fontSize="6" fill="#64748b" textAnchor="middle">{formatDeWert(d)}</text>
                        </g>
                      );
                    })}
                    {/* F-Classes */}
                    <text x={0} y="18" fontSize="5" fill="#94a3b8" textAnchor="middle">F1</text>
                    <text x={380 * 0.15} y="18" fontSize="5" fill="#94a3b8" textAnchor="middle">F2</text>
                    <text x={450 * 0.15} y="18" fontSize="5" fill="#94a3b8" textAnchor="middle">F3</text>
                    <text x={520 * 0.15} y="18" fontSize="5" fill="#94a3b8" textAnchor="middle">F4</text>
                    <text x={590 * 0.15} y="18" fontSize="5" fill="#94a3b8" textAnchor="middle">F5</text>
                    <text x={665 * 0.15} y="18" fontSize="5" fill="#94a3b8" textAnchor="middle">F6</text>
                    <text x={730 * 0.15} y="18" fontSize="5" fill="#94a3b8" textAnchor="middle">SVB</text>
                    
                    <text x={-(380 * 0.15)} y="18" fontSize="5" fill="#94a3b8" textAnchor="middle">F2</text>
                    <text x={-(450 * 0.15)} y="18" fontSize="5" fill="#94a3b8" textAnchor="middle">F3</text>
                    <text x={-(520 * 0.15)} y="18" fontSize="5" fill="#94a3b8" textAnchor="middle">F4</text>
                    <text x={-(590 * 0.15)} y="18" fontSize="5" fill="#94a3b8" textAnchor="middle">F5</text>
                    <text x={-(665 * 0.15)} y="18" fontSize="5" fill="#94a3b8" textAnchor="middle">F6</text>
                    <text x={-(730 * 0.15)} y="18" fontSize="5" fill="#94a3b8" textAnchor="middle">SVB</text>
                  </g>

                  {/* Concrete spread (ellipse) */}
                  <ellipse 
                    cx="150" 
                    cy="120" 
                    rx={ausbreitmass * 0.15} 
                    ry={(8.3e6 / Math.pow(ausbreitmass, 2)) * 0.3} 
                    fill="#64748b" 
                    clipPath="url(#ground-clip)"
                    className="transition-all duration-100"
                  />
                  
                  {/* Lifting cone */}
                  <path 
                    d="M 120 120 L 130.5 60 L 169.5 60 L 180 120 Z" 
                    fill="none" 
                    stroke="#475569" 
                    strokeWidth="2" 
                    style={{
                      transform: `translateY(-${progress * 1.5}px)`,
                      opacity: Math.max(0, 1 - progress / 20),
                      transition: 'all 0.1s'
                    }}
                  />
                </svg>
              </div>
              
              <div className="text-center space-y-2 min-w-[150px]">
                <h4 className="text-4xl font-bold text-shiraz">{formatDeZahl(ausbreitmass, 0)} mm</h4>
                <p className="text-sm text-home-grau font-bold uppercase">Ausbreitmaß</p>
                {testStatus === 'finished' && (
                  <p className="text-sm text-emerald-600 font-medium mt-2">
                    Klasse {consistency} erreicht.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[400px]">
            <h3 className="text-lg font-bold text-text-main mb-4 border-b border-home-grau/30 pb-2">3. Rheologisches Modell (Bingham)</h3>
            <div className="flex-1 relative">
              <Line data={rheologyChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    
      <ModuleFooter 
        wikipedia={[
          { title: 'Ausbreitmaß', url: 'https://de.wikipedia.org/wiki/Ausbreitma%C3%9F' },
          { title: 'Bingham-Fluid', url: 'https://de.wikipedia.org/wiki/Bingham-Fluid' }
        ]}
        regelwerke={[
          { title: 'DIN EN 12350-5 (Prüfung von Frischbeton - Teil 5: Ausbreitmaß)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12350-5' },
          { title: 'DIN EN 206 / DIN 1045-2 (Konsistenzklassen F1 bis F6 und SVB)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+206' },
          { title: 'DAfStb-Richtlinie: Selbstverdichtender Beton (SVB)', url: 'https://www.dafstb.de/' }
        ]}
        literatur={[
          'Walz, K. (1970): Zur Prüfung der Konsistenz des Frischbetons (Beton 20)',
          'Tattersall, G. H.; Banfill, P. F. G. (1983): The Rheology of Fresh Concrete (Pitman Publishing)',
          'Grübl, P.; Weigler, H.; Karl, S. (2001): Beton - Arten, Herstellung und Eigenschaften (Ernst & Sohn)'
        ]}
        formeln={[
          {
            formel: 'f = \\frac{d_1 + d_2}{2}',
            erklaerung: 'Ausbreitmaß f [mm]: Arithmetischer Mittelwert aus zwei zueinander rechtwinklig gemessenen Durchmessern des Betonkuchens nach 15 Hubschlägen auf dem Ausbreittisch.',
            quelle: 'DIN EN 12350-5'
          },
          {
            formel: '\\tau = \\tau_0 + \\mu_p \\cdot \\dot{\\gamma}',
            erklaerung: 'Bingham-Modell für Frischbeton: τ = Schubspannung, τ0 = Fließgrenze (maßgebend für Ausbreitmaß/Slump), μp = plastische Viskosität (maßgebend für Fließgeschwindigkeit/Pumpbarkeit), γ̇ = Scherrate.',
            quelle: 'Bingham (1922) / Tattersall (1983)'
          }
        ]}
      />
</div>
  );
}
