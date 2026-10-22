import { formatDeZahl } from '@/src/utils/numberFormat';
import React, { useState, useRef } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Play, RotateCcw, Activity } from 'lucide-react';
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

type MaterialType = 'beton_unbewehrt' | 'beton_stahlbewehrt' | 'beton_stahlfasern';

export default function Biegezugversuch() {
  const [material, setMaterial] = useState<MaterialType>('beton_unbewehrt');
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [progress, setProgress] = useState(0);
  const [mechData, setMechData] = useState<{x: number, y: number}[]>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearCurrentInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getMaterialProps = () => {
    switch (material) {
      case 'beton_unbewehrt':
        return {
          name: 'Beton (unbewehrt)',
          E: 33000,
          fctm: 3.8, // Biegezugfestigkeit
          failureStrain: 0.15, // Spröder Bruch
        };
      case 'beton_stahlbewehrt':
        return {
          name: 'Stahlbeton',
          E: 33000,
          fctm: 3.8, // Risslast
          failureStrain: 25, // Duktiles Verhalten
        };
      case 'beton_stahlfasern':
        return {
          name: 'Stahlfaserbeton',
          E: 33000,
          fctm: 4.5, // Erhöhte Erstrisslast
          failureStrain: 10, // Nachrisszugfestigkeit
        };
    }
  };

  const props = getMaterialProps();

  const runTest = () => {
    setTestStatus('running');
    setMechData([]);
    setProgress(0);

    const targetData: {x: number, y: number}[] = [];
    const steps = 100;
    const maxStrain = props.failureStrain;

    for (let i = 0; i <= steps; i++) {
      const strain = (i / steps) * maxStrain;
      let stress = 0;
      let hasFailed = false;

      if (material === 'beton_unbewehrt') {
        stress = (props.E * strain) / 1000;
        if (stress > props.fctm) {
          hasFailed = true;
        }
      } else if (material === 'beton_stahlbewehrt') {
        const crackStrain = (props.fctm / props.E) * 1000;
        if (strain <= crackStrain) {
          stress = (props.E * strain) / 1000;
        } else {
          const yieldStrain = 2.5;
          if (strain <= yieldStrain) {
             const crackedE = props.E * 0.1; 
             stress = props.fctm + (crackedE * (strain - crackStrain)) / 1000;
          } else {
             const postYieldE = props.E * 0.01;
             const yieldStress = props.fctm + (props.E * 0.1 * (yieldStrain - crackStrain)) / 1000;
             stress = yieldStress + (postYieldE * (strain - yieldStrain)) / 1000;
          }
        }
      } else if (material === 'beton_stahlfasern') {
        const crackStrain = (props.fctm / props.E) * 1000;
        if (strain <= crackStrain) {
          stress = (props.E * strain) / 1000;
        } else {
          stress = props.fctm * (1 - 0.5 * ((strain - crackStrain) / (maxStrain - crackStrain)));
        }
      }

      if (!hasFailed) {
        targetData.push({ x: strain, y: stress });
      } else {
        break;
      }
    }

    let currentStep = 0;
    clearCurrentInterval();
    intervalRef.current = setInterval(() => {
      if (currentStep < targetData.length) {
        setMechData(targetData.slice(0, currentStep + 1));
        setProgress((currentStep / steps) * 100);
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
    setMechData([]);
    setProgress(0);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: {
        type: 'linear' as const,
        title: { display: true, text: 'Dehnung (‰)' },
        min: 0,
        max: props.failureStrain * 1.1
      },
      y: {
        title: { display: true, text: 'Spannung (N/mm²)' },
        min: 0,
        max: material === 'beton_unbewehrt' ? 5 : 15
      }
    },
    plugins: {
      legend: { display: true, position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => `Spannung: ${formatDeZahl(Number(context.parsed.y), 2)} MPa`,
          title: (context: any) => `Dehnung: ${formatDeZahl(Number(context[0].parsed.x), 2)} ‰`
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Activity className="text-shiraz" /> Biegezugversuch
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Der Biegezugversuch simuliert die Belastung eines Balkens. Hierbei wird das Verhalten von unbewehrtem Beton, Stahlbeton und Stahlfaserbeton verglichen.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Konfiguration</h3>
            
            <div className="space-y-3">
              <label className="text-sm font-bold text-text-main">Material wählen</label>
              <div className="grid grid-cols-1 gap-2">
                {(['beton_unbewehrt', 'beton_stahlbewehrt', 'beton_stahlfasern'] as MaterialType[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMaterial(m)}
                    disabled={testStatus === 'running'}
                    className={`py-2 px-3 text-sm font-medium rounded-lg border transition-colors capitalize ${
                      material === m 
                        ? 'bg-shiraz text-white border-shiraz' 
                        : 'bg-off-white text-text-main border-home-grau/30 hover:border-shiraz/50 disabled:opacity-50'
                    }`}
                  >
                    {m.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-home-grau/30 flex gap-2">
              <button
                onClick={runTest}
                disabled={testStatus !== 'idle'}
                className="flex-1 py-3 bg-shiraz hover:bg-shiraz/90 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play size={18} /> Test Starten
              </button>
              <button
                onClick={resetTest}
                disabled={testStatus === 'idle'}
                className="py-3 px-4 bg-off-white hover:bg-home-grau/20 text-text-main border border-home-grau/30 rounded-xl font-bold flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-6 border-b border-home-grau/30 pb-4">
              <h3 className="text-lg font-bold text-text-main">Versuchsdurchführung & Ergebnisse</h3>
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

            {testStatus !== 'idle' && (
              <div className="w-full bg-home-grau/20 rounded-full h-2.5 mb-6 overflow-hidden">
                <div className="bg-shiraz h-2.5 rounded-full transition-all duration-75" style={{ width: `${progress}%` }}></div>
              </div>
            )}

            <div className="flex-1 flex flex-col gap-4">
              <div className="flex-1 relative w-full min-h-[300px]">
                <Line 
                  data={{
                    datasets: [{
                      label: props.name,
                      data: mechData,
                      borderColor: '#A3113E',
                      borderWidth: 3,
                      pointRadius: 0,
                      tension: 0.1
                    }]
                  }} 
                  options={chartOptions} 
                />
              </div>
              {/* Angepasste Grafik für Biegezugversuch (4-Punkt-Biegung) */}
              <div className="w-full h-40 bg-off-white border-2 border-home-grau/30 rounded-xl flex flex-col items-center justify-center relative overflow-hidden shrink-0 mt-4">
                <svg width="80%" height="100%" viewBox="0 0 400 150">
                  {/* Auflager */}
                  <polygon points="50,120 40,140 60,140" fill="#64748b" />
                  <polygon points="350,120 340,140 360,140" fill="#64748b" />
                  
                  {/* Balken */}
                  {material === 'beton_unbewehrt' && testStatus === 'finished' ? (
                    <>
                      {/* Linke Hälfte (abgebrochen) */}
                      <g transform="rotate(8, 50, 120)">
                        <path d="M 30 90 L 200 90 L 195 105 L 200 120 L 30 120 Z" fill="#cbd5e1" stroke="#94a3b8" />
                      </g>
                      {/* Rechte Hälfte (abgebrochen) */}
                      <g transform="rotate(-8, 350, 120)">
                        <path d="M 200 90 L 370 90 L 370 120 L 200 120 L 195 105 Z" fill="#cbd5e1" stroke="#94a3b8" />
                      </g>
                    </>
                  ) : (
                    <rect x="30" y="90" width="340" height="30" fill="#cbd5e1" stroke="#94a3b8" />
                  )}
                  
                  {/* Risse (nur wenn Fortschritt > 0 und Material reißt) */}
                  {progress > 0 && material !== 'beton_unbewehrt' && (
                    <path d="M 200 120 Q 195 105 205 90" stroke="#1e293b" strokeWidth="1.5" fill="none" />
                  )}
                  {progress > 30 && material !== 'beton_unbewehrt' && (
                    <>
                      <path d="M 150 120 Q 155 105 145 90" stroke="#1e293b" strokeWidth="1.5" fill="none" />
                      <path d="M 250 120 Q 245 105 255 90" stroke="#1e293b" strokeWidth="1.5" fill="none" />
                    </>
                  )}
                  
                  {/* Bewehrung (falls vorhanden) */}
                  {material !== 'beton_unbewehrt' && (
                    <line x1="40" y1="110" x2="360" y2="110" stroke="#A3113E" strokeWidth="3" strokeDasharray={material === 'beton_stahlfasern' ? "5,5" : "none"} />
                  )}

                  {/* Lasteinleitung (4-Punkt) */}
                  <polygon points="150,90 140,70 160,70" fill="#64748b" />
                  <polygon points="250,90 240,70 260,70" fill="#64748b" />
                  
                  {/* Kraftpfeile */}
                  <path d="M 150 20 L 150 60" stroke="#A3113E" strokeWidth="3" markerEnd="url(#arrow-red)" />
                  <path d="M 250 20 L 250 60" stroke="#A3113E" strokeWidth="3" markerEnd="url(#arrow-red)" />
                  
                  {/* Verformung (Biegung) */}
                  {progress > 0 && !(material === 'beton_unbewehrt' && testStatus === 'finished') && (
                    <path d={`M 30 90 Q 200 ${90 + progress * 0.3} 370 90`} stroke="#475569" strokeWidth="2" fill="none" opacity="0.5" />
                  )}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ModuleFooter 
        wikipedia={[
                { title: 'Biegezugversuch', url: 'https://de.wikipedia.org/wiki/Biegezugversuch' }
              ]}
              regelwerke={[
          'DIN EN 12390-5: Prüfung von Festbeton - Teil 5: Biegezugfestigkeit von Probekörpern',
          'DAfStb-Richtlinie Stahlfaserbeton'
        ]}
        literatur={[
          'Wendehorst Baustoffkunde, 27. Auflage, Vieweg+Teubner 2011',
          'Zilch, K., Zehetmaier, G.: Bemessung im konstruktiven Betonbau (2010)'
        ]}
        formeln={[
          {
            formel: 'f_{cf} = \\frac{F \\cdot l}{d_1 \\cdot d_2^2}',
            erklaerung: 'Biegezugfestigkeit (3-Punkt-Biegung):\nf_cf: Biegezugfestigkeit (MPa)\nF: Höchstlast (N)\nl: Stützweite (mm)\nd1, d2: Querschnittsabmessungen (mm)',
              quelle: 'Wendehorst Baustoffkunde, 27. Auflage, Vieweg+Teubner 2011'
          },
          {
            formel: 'f_{cf} = \\frac{3 \\cdot F \\cdot l}{2 \\cdot d_1 \\cdot d_2^2}',
            erklaerung: 'Biegezugfestigkeit (4-Punkt-Biegung):\nf_cf: Biegezugfestigkeit (MPa)\nF: Höchstlast (N)\nl: Abstand der Auflager (mm)\nd1, d2: Querschnittsabmessungen (mm)',
              quelle: 'Wendehorst Baustoffkunde, 27. Auflage, Vieweg+Teubner 2011'
          }
        ]}
      />
    </div>
  );
}
