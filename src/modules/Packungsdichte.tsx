import { formatDeZahl } from '@/src/utils/numberFormat';
import { Layers } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Line } from 'react-chartjs-2';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Packungsdichte() {
  const [activeTab, setActiveTab] = useState<'sieblinien' | 'zweikorn'>('sieblinien');
  
  // Anteile der Feststoffe in Vol.-%
  const [pZement, setPZement] = useState(12);
  const [pZusatz, setPZusatz] = useState(5); // z.B. Flugasche oder Kalksteinmehl
  const [pSand, setPSand] = useState(33); // Sand 0/2
  const [pKies1, setPKies1] = useState(20); // Kies 2/8
  // pKies2 (Kies 8/16) ergibt sich aus 100 - Summe

  // Parameter für Idealsieblinie
  const [q, setQ] = useState(0.30); // Verteilungsmodul
  const [kornform, setKornform] = useState<'rund' | 'gebrochen'>('rund');
  const [vFest, setVFest] = useState(750); // l/m³

  const dMax = 16; // Größtkorn
  const dMin = 0.001; // Kleinstkorn (1 µm)

  const results = useMemo(() => {
    // Sicherstellen, dass Summe <= 100
    let aZement = pZement;
    let aZusatz = pZusatz;
    let aSand = pSand;
    let aKies1 = pKies1;

    if (aZement > 100) aZement = 100;
    if (aZement + aZusatz > 100) aZusatz = 100 - aZement;
    if (aZement + aZusatz + aSand > 100) aSand = 100 - aZement - aZusatz;
    if (aZement + aZusatz + aSand + aKies1 > 100) aKies1 = 100 - aZement - aZusatz - aSand;
    
    const aKies2 = 100 - aZement - aZusatz - aSand - aKies1;

    // Massenberechnung in kg/m³
    const rhoZement = 3.1;
    const rhoGestein = 2.65;
    const mZement = (aZement / 100) * vFest * rhoZement;
    const mZusatz = (aZusatz / 100) * vFest * rhoGestein;
    const mSand = (aSand / 100) * vFest * rhoGestein;
    const mKies1 = (aKies1 / 100) * vFest * rhoGestein;
    const mKies2 = (aKies2 / 100) * vFest * rhoGestein;
    const mTotal = mZement + mZusatz + mSand + mKies1 + mKies2;

    // Siebgrößen (mm) - erweitert um Feinteilbereich
    const sieves = [0.001, 0.01, 0.063, 0.125, 0.25, 0.5, 1, 2, 4, 8, 16];

    // Typische Siebdurchgänge für die Einzelkomponenten (vereinfacht)
    // Zement (CEM I 42.5)
    const passZem = [0, 50, 95, 100, 100, 100, 100, 100, 100, 100, 100];
    // Zusatzstoff (Kalksteinmehl)
    const passZus = [5, 60, 98, 100, 100, 100, 100, 100, 100, 100, 100];
    // Sand 0/2
    const passSand = [0, 0, 2, 5, 15, 40, 75, 100, 100, 100, 100];
    // Kies 2/8
    const passKies1 = [0, 0, 0, 0, 0, 0, 0, 5, 40, 100, 100];
    // Kies 8/16
    const passKies2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 100];

    // Gemischte Sieblinie (Gesamtfeststoff)
    const mixedCurve = sieves.map((_, i) => {
      return (aZement * passZem[i] + aZusatz * passZus[i] + aSand * passSand[i] + aKies1 * passKies1[i] + aKies2 * passKies2[i]) / 100;
    });

    // Idealsieblinie nach modifiziertem Andreasen & Andersen Modell (A&A)
    const idealCurveAA = sieves.map(d => {
      if (d <= dMin) return 0;
      if (d >= dMax) return 100;
      const num = Math.pow(d, q) - Math.pow(dMin, q);
      const den = Math.pow(dMax, q) - Math.pow(dMin, q);
      return (num / den) * 100;
    });

    // Fuller-Parabel (Sonderfall A&A mit q=0.5 und dMin=0)
    const fullerCurve = sieves.map(d => {
      return Math.sqrt(d / dMax) * 100;
    });

    // Abweichung berechnen (Summe der Fehlerquadrate)
    let errorAA = 0;
    let errorFuller = 0;
    for (let i = 0; i < sieves.length; i++) {
      errorAA += Math.pow(mixedCurve[i] - idealCurveAA[i], 2);
      errorFuller += Math.pow(mixedCurve[i] - fullerCurve[i], 2);
    }
    const rmseAA = Math.sqrt(errorAA / sieves.length);
    const rmseFuller = Math.sqrt(errorFuller / sieves.length);

    // Abschätzung der Packungsdichte (sehr vereinfachtes Modell basierend auf Kornform und Mischungsgüte)
    // Grundpackungsdichte abhängig von Kornform
    const basePD = kornform === 'rund' ? 0.65 : 0.58;
    // Verbesserung durch gute Mischung (niedriger RMSE bei A&A)
    const mixBonus = Math.max(0, (20 - rmseAA) * 0.005);
    const estimatedPD = Math.min(0.85, basePD + mixBonus);

    return {
      aZement,
      aZusatz,
      aSand,
      aKies1,
      aKies2,
      mZement,
      mZusatz,
      mSand,
      mKies1,
      mKies2,
      mTotal,
      rmseAA,
      rmseFuller,
      estimatedPD,
      chartData: {
        labels: sieves,
        datasets: [
          {
            label: 'Aktuelles Gemisch',
            data: mixedCurve,
            borderColor: '#A3113E',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 3,
            tension: 0.3,
          },
          {
            label: `Ideal (A&A, q=${q})`,
            data: idealCurveAA,
            borderColor: '#475569',
            borderDash: [5, 5],
            borderWidth: 2,
            tension: 0.3,
          },
          {
            label: 'Fuller-Parabel',
            data: fullerCurve,
            borderColor: '#475569',
            borderDash: [2, 2],
            borderWidth: 2,
            tension: 0.3,
          }
        ]
      }
    };
  }, [pZement, pZusatz, pSand, pKies1, q, kornform]);

  // Handler für Slider, um Kaskadierung zu ermöglichen
  const handleZementChange = (val: number) => setPZement(val);
  const handleZusatzChange = (val: number) => setPZusatz(val);
  const handleSandChange = (val: number) => setPSand(val);
  const handleKies1Change = (val: number) => setPKies1(val);

  // Zweikornmischung Parameter
  const [d1, setD1] = useState(0.5); // Feinkorn
  const [d2, setD2] = useState(8);   // Grobkorn
  const [phi1, setPhi1] = useState(0.60); // Eigenpackungsdichte Fein
  const [phi2, setPhi2] = useState(0.62); // Eigenpackungsdichte Grob

  const zweikornResults = useMemo(() => {
    const fractions = [];
    const sizeRatio = d1 / d2;
    
    // Einfache Interaktions-Simulation: je größer d1/d2, desto mehr Auflockerung (Loosening Effect)
    const interaction = Math.min(1, Math.max(0, sizeRatio));

    for (let fineVol = 0; fineVol <= 100; fineVol += 2) {
      const y1 = fineVol / 100;
      const y2 = 1 - y1;

      // Ideales Modell (ohne Interaktion - d1/d2 -> 0)
      const idealCoarseBackbone = phi2 / (1 - y1);
      const idealFineBackbone = phi1 / (phi1 * y2 + y1);
      const idealPD = Math.min(idealCoarseBackbone, idealFineBackbone);

      // Reales Modell (vereinfachter Ansatz nach De Larrard / Toufar Art)
      // Bei interaction = 0 -> idealPD
      // Bei interaction = 1 -> lineare Mischung der Packungsdichten (keine Hohlraumfüllung)
      const linearPD = y1 * phi1 + y2 * phi2;
      
      // Empirische Abrundung / Verminderung der Packungsdichte durch Interaktion
      // Formel dient zur anschaulichen Visualisierung der Effekte (Loosening & Wall effect)
      let realPD = idealPD - interaction * (idealPD - linearPD) * 1.5;
      
      // Wandeffekt: Feinkorn um Grobkorn kann nicht perfekt packen
      const wallEffect = 0.05 * y1 * y2 * (1 - interaction); 
      realPD -= wallEffect;

      fractions.push({
        x: fineVol,
        ideal: idealPD * 100,
        real: realPD * 100,
        linear: linearPD * 100
      });
    }

    return {
      chartData: {
        labels: fractions.map(f => f.x),
        datasets: [
          {
            label: 'Ideale Theorie (Mooney/Furnas)',
            data: fractions.map(f => f.ideal),
            borderColor: '#94a3b8',
            borderDash: [5, 5],
            borderWidth: 2,
            tension: 0.1,
            pointRadius: 0
          },
          {
            label: 'Theoretisch linear (Gleiche Größen)',
            data: fractions.map(f => f.linear),
            borderColor: '#e2e8f0',
            borderWidth: 1,
            tension: 0,
            pointRadius: 0
          },
          {
            label: `Reales Modell (simuliert für d1/d2 = ${formatDeZahl(sizeRatio, 3)})`,
            data: fractions.map(f => f.real),
            borderColor: '#475569',
            backgroundColor: 'rgba(2, 132, 199, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 0
          }
        ]
      }
    };
  }, [d1, d2, phi1, phi2]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Packungsdichteoptimierung
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die Optimierung der Packungsdichte aller Feststoffe (Gesteinskörnung + Feinteile) ist entscheidend für 
          leistungsfähigen und ressourcenschonenden Beton (z.B. UHPC oder Eco-Beton). Eine optimale Sieblinie minimiert den Hohlraumgehalt, 
          wodurch weniger Wasser und Zementleim zur Verfüllung benötigt wird.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6 w-full">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'sieblinien' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('sieblinien')}
          >
            Kontinuierliche Modelle (Sieblinien)
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'zweikorn' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('zweikorn')}
          >
            Diskrete Modelle (Zweikornmischung)
          </button>
        </div>

        {activeTab === 'sieblinien' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Feststoffanteile (Vol.-%)</h3>
              <div className="space-y-4">
                <Slider
                  label="Zement" info="Menge des Zements."
                  value={results.aZement}
                  min={0}
                  max={30}
                  step={1}
                  onChange={(e) => handleZementChange(Number(e.target.value))}
                  unit="%"
                />
                <Slider
                  label="Zusatzstoff (z.B. Kalksteinmehl)" 
                  value={results.aZusatz}
                  min={0}
                  max={30}
                  step={1}
                  onChange={(e) => handleZusatzChange(Number(e.target.value))}
                  unit="%"
                />
                <Slider
                  label="Sand (0/2 mm)" info="Menge der feinen Gesteinskörnung."
                  value={results.aSand}
                  min={0}
                  max={60}
                  step={1}
                  onChange={(e) => handleSandChange(Number(e.target.value))}
                  unit="%"
                />
                <Slider
                  label="Kies (2/8 mm)" 
                  value={results.aKies1}
                  min={0}
                  max={60}
                  step={1}
                  onChange={(e) => handleKies1Change(Number(e.target.value))}
                  unit="%"
                />
                <div className="pt-2 border-t border-home-grau/30">
                  <div className="flex justify-between text-sm font-medium text-text-main">
                    <span>Kies (8/16 mm) - Rest</span>
                    <span>{formatDeZahl(results.aKies2, 0)} %</span>
                  </div>
                  <div className="w-full bg-home-grau/20 h-3 rounded-full mt-2 overflow-hidden flex">
                    <div style={{ width: `${results.aZement}%` }} className="bg-slate-400 h-full" title="Zement"></div>
                    <div style={{ width: `${results.aZusatz}%` }} className="bg-slate-300 h-full" title="Zusatzstoff"></div>
                    <div style={{ width: `${results.aSand}%` }} className="bg-amber-400 h-full" title="Sand"></div>
                    <div style={{ width: `${results.aKies1}%` }} className="bg-stone-400 h-full" title="Kies 2/8"></div>
                    <div style={{ width: `${results.aKies2}%` }} className="bg-stone-600 h-full" title="Kies 8/16"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Massen pro m³ Beton</h3>
              <Slider info="Volumenanteil aller festen Bestandteile im Beton." label="Feststoffvolumen im Beton"
                value={vFest}
                min={600}
                max={850}
                step={10}
                onChange={(e) => setVFest(Number(e.target.value))}
                unit="l/m³"
                
              />
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Zement (ρ = 3,1 kg/l)</span>
                  <span className="font-medium">{formatDeZahl(results.mZement, 0)} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Zusatzstoff (ρ = 2,65 kg/l)</span>
                  <span className="font-medium">{formatDeZahl(results.mZusatz, 0)} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-amber-600">Sand 0/2 (ρ = 2,65 kg/l)</span>
                  <span className="font-medium">{formatDeZahl(results.mSand, 0)} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Kies 2/8 (ρ = 2,65 kg/l)</span>
                  <span className="font-medium">{formatDeZahl(results.mKies1, 0)} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-700">Kies 8/16 (ρ = 2,65 kg/l)</span>
                  <span className="font-medium">{formatDeZahl(results.mKies2, 0)} kg</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-home-grau/30 pt-3 mt-3">
                  <span>Gesamtfeststoffmasse</span>
                  <span>{formatDeZahl(results.mTotal, 0)} kg</span>
                </div>
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Modellparameter & Eigenschaften</h3>
              
              <div className="mb-6">
                <div className="flex items-center gap-2"><label className="block text-sm font-medium text-text-main mb-2">Kornform der Gesteinskörnung</label><InfoTooltip text="Form der Gesteinskörner (z.B. gedrungen, plattig)." /></div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="kornform" 
                      value="rund" 
                      checked={kornform === 'rund'} 
                      onChange={() => setKornform('rund')}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Rund (Flusskies)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="kornform" 
                      value="gebrochen" 
                      checked={kornform === 'gebrochen'} 
                      onChange={() => setKornform('gebrochen')}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Gebrochen (Splitt)</span>
                  </label>
                </div>
              </div>

              <Slider info="Exponent q der modifizierten Andreasen-Gleichung. Ein kleineres q erhöht die Packungsdichte durch einen höheren Feinstoffanteil (Feinsand/Zement)." label={<FormulaText text="Verteilungsmodul (q)" />}
                value={q}
                min={0.20}
                max={0.50}
                step={0.01}
                onChange={(e) => setQ(Number(e.target.value))}
                
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Feststoff-Sieblinie</h3>
              <div className="h-72">
                <Line 
                  data={results.chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        type: 'logarithmic',
                        title: { display: true, text: 'Partikelgröße d (mm)' },
                        min: 0.001,
                        max: 20,
                        ticks: {
                          callback: function(value) {
                            return Number(value).toString();
                          }
                        }
                      },
                      y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: 'Durchgang (%)' }
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.dataset.label}: ${formatDeZahl(context.parsed.y, 1)} %`
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Bewertung & Visualisierung</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/30 text-center">
                  <div className="text-xs text-text-main/70 mb-1">RMSE zu A&A</div>
                  <div className={`text-xl font-bold ${results.rmseAA < 5 ? 'text-emerald-600' : results.rmseAA < 10 ? 'text-amber-500' : 'text-torch-red'}`}>
                    {formatDeZahl(results.rmseAA, 1)}
                  </div>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/30 text-center">
                  <div className="text-xs text-text-main/70 mb-1">RMSE zu Fuller</div>
                  <div className={`text-xl font-bold ${results.rmseFuller < 5 ? 'text-emerald-600' : results.rmseFuller < 10 ? 'text-amber-500' : 'text-torch-red'}`}>
                    {formatDeZahl(results.rmseFuller, 1)}
                  </div>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/30 text-center">
                  <div className="text-xs text-text-main/70 mb-1">Est. Packungsdichte</div>
                  <div className="text-xl font-bold text-primary">
                    {formatDeZahl((results.estimatedPD * 100), 1)} %
                  </div>
                </div>
              </div>

              {/* Grafische Darstellung des Querschnitts */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-text-main mb-2">Schematisches Gefügemodell</h4>
                <div className="relative w-full h-40 bg-slate-100 rounded-lg border border-home-grau/30 overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice">
                    {/* Hintergrund (Wasser/Luft) */}
                    <rect width="400" height="160" fill="#e2e8f0" />
                    
                    {/* Generiere Partikel basierend auf Anteilen */}
                    {/* Grobkorn (Kies 8/16) */}
                    {Array.from({ length: Math.floor(results.aKies2 / 3) }).map((_, i) => (
                      <circle 
                        key={`k2-${i}`} 
                        cx={20 + (i * 57) % 380} 
                        cy={20 + (i * 43) % 140} 
                        r={kornform === 'rund' ? 18 : 16} 
                        fill="#475569" 
                        opacity="0.9"
                        transform={kornform === 'gebrochen' ? `rotate(${i * 45} ${20 + (i * 57) % 380} ${20 + (i * 43) % 140}) scale(1.1, 0.9)` : ''}
                      />
                    ))}
                    
                    {/* Mittelkorn (Kies 2/8) */}
                    {Array.from({ length: Math.floor(results.aKies1 / 1.5) }).map((_, i) => (
                      <circle 
                        key={`k1-${i}`} 
                        cx={15 + (i * 31) % 380} 
                        cy={15 + (i * 27) % 140} 
                        r={kornform === 'rund' ? 9 : 8} 
                        fill="#94a3b8" 
                        opacity="0.9"
                        transform={kornform === 'gebrochen' ? `rotate(${i * 30} ${15 + (i * 31) % 380} ${15 + (i * 27) % 140}) scale(1.2, 0.8)` : ''}
                      />
                    ))}
                    
                    {/* Sand */}
                    {Array.from({ length: Math.floor(results.aSand * 1.5) }).map((_, i) => (
                      <circle 
                        key={`s-${i}`} 
                        cx={10 + (i * 17) % 390} 
                        cy={10 + (i * 13) % 150} 
                        r="3.5" 
                        fill="#94a3b8" 
                        opacity="0.8"
                      />
                    ))}

                    {/* Feinteile (Zement + Zusatzstoff) */}
                    {Array.from({ length: Math.floor((results.aZement + results.aZusatz) * 4) }).map((_, i) => (
                      <circle 
                        key={`f-${i}`} 
                        cx={5 + (i * 7) % 395} 
                        cy={5 + (i * 11) % 155} 
                        r="1" 
                        fill={i % 3 === 0 ? "#cbd5e1" : "#94a3b8"} 
                        opacity="0.7"
                      />
                    ))}
                  </svg>
                  <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded text-[10px] text-text-main/70 backdrop-blur-sm">
                    Visualisierung stark vereinfacht
                  </div>
                </div>
                <p className="text-xs text-text-main/60 mt-2">
                  Ein geringer RMSE-Wert bedeutet eine gute Annäherung an die Idealsieblinie. 
                  Die Feinteile (Zement, Zusatzstoffe) füllen die Hohlräume zwischen den Sand- und Kieskörnern.
                  Runde Körner ermöglichen eine dichtere Packung als gebrochene Körner.
                </p>
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'zweikorn' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-2 text-text-main">Diskrete Packungsdichtemodelle</h3>
              <p className="text-sm text-text-main/80 mb-4">
                Während kontinuierliche Modelle (wie A&A) eine ideale Kornverteilungskurve vorgeben, betrachten 
                diskrete Modelle (wie das Toufar-Modell oder CPM) die Interaktion einzelner Korngrößenklassen. 
                Sie berechnen die resultierende Packungsdichte basierend auf den Eigenpackungsdichten und den 
                Größenverhältnissen (d₁/d₂).
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="bg-white p-3 border border-home-grau/30 rounded-lg">
                  <h4 className="font-bold text-sm">Compressible Packing Model (CPM)</h4>
                  <p className="text-xs text-text-main/70 mt-1">Nach de Larrard (1999). Berücksichtigt zusätzlich zu idealen geometrischen Modellen den Wandeffekt (Wall effect) und den Auflockerungseffekt (Loosening effect) über einen Verdichtungsindex K.</p>
                </div>
                <div className="bg-white p-3 border border-home-grau/30 rounded-lg">
                  <h4 className="font-bold text-sm">Toufar-, Klose- und Born-Modell (1976)</h4>
                  <p className="text-xs text-text-main/70 mt-1">Beschreibt die Änderung der Packungsdichte einer binären Mischung in Abhängigkeit des Durchmessers der beiden Fraktionen und ihres Mischungsverhältnisses.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-text-main border-b border-home-grau/30 pb-2">Eingabeparameter Feinkorn (Index 1)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Slider label="Durchmesser (d₁)" value={d1} min={0.1} max={4} step={0.1} onChange={(e) => setD1(Number(e.target.value))} unit=" mm" />
                  <Slider label="Packungsdichte (φ₁)" value={phi1} min={0.4} max={0.7} step={0.01} onChange={(e) => setPhi1(Number(e.target.value))} unit="" />
                </div>
                
                <h4 className="font-medium text-sm text-text-main border-b border-home-grau/30 pb-2 mt-4">Eingabeparameter Grobkorn (Index 2)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Slider label="Durchmesser (d₂)" value={d2} min={4} max={32} step={1} onChange={(e) => setD2(Number(e.target.value))} unit=" mm" />
                  <Slider label="Packungsdichte (φ₂)" value={phi2} min={0.4} max={0.7} step={0.01} onChange={(e) => setPhi2(Number(e.target.value))} unit="" />
                </div>
              </div>
            </div>
            
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-2 text-text-main">Wandeffekt und Auflockerung</h3>
              <ul className="text-sm text-text-main/80 space-y-2 list-disc pl-5">
                <li><strong>Wandeffekt:</strong> Wenn ein kleines Korn an ein sehr großes Korn stößt (Grobkorn als "Wand"), entsteht dort ein asymmetrischer Hohlraum, weil sich Feinkörner nicht perfekt an ebene Wände anlegen können.</li>
                <li><strong>Auflockerungseffekt:</strong> Wenn das Größenverhältnis (d₁/d₂) zu groß ist, passen feine Partikel nicht mehr in die Poren der Grobkörner. Sie drücken die Grobkörner auseinander, was das Gesamtvolumen vergrößert.</li>
              </ul>
              
              <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg text-sm text-blue-900 shadow-sm">
                <strong>Verhältnis der Durchmesser (d₁/d₂): {formatDeZahl((d1/d2), 3)}</strong>
                <p className="mt-1 opacity-80">Je näher das Verhältnis an 0 ist, desto mehr nähert sich die reale Packungsdichte der idealen Theorieküste an. Je näher es an 1 ist, desto flacher verläuft die Kurve.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Zweikornmischung Packungsdichte (φ)</h3>
              <div className="h-[400px]">
                <Line 
                  data={zweikornResults.chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        title: { display: true, text: 'Volumenanteil Feinkorn (%)' },
                        min: 0,
                        max: 100
                      },
                      y: {
                        title: { display: true, text: 'Packungsdichte (%)' },
                        suggestedMin: Math.min(phi1, phi2) * 100 - 5,
                        suggestedMax: 85
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.dataset.label}: ${formatDeZahl(context.parsed.y, 1)} %`
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      <ModuleFooter
        wikipedia={[
        { title: 'Packungsdichte', url: 'https://de.wikipedia.org/wiki/Packungsdichte' },
        { title: 'Sieblinie', url: 'https://de.wikipedia.org/wiki/Sieblinie' }
      ]}
        literatur={[
          'De Larrard, F. (1999): Concrete Mixture Proportioning: A Scientific Approach (E & FN Spon)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Frings, K.: Optimierung von Betonzusammensetzungen mittels Kornpackungsmodellen (RWTH Aachen)'
        ]}
        regelwerke={[
          { title: 'DIN EN 12620: Gesteinskörnungen für Beton' },
          { title: 'DIN EN 933: Prüfverfahren für geometrische Eigenschaften von Gesteinskörnungen (Kornverteilung - Siebverfahren)' },
          { title: 'DIN 1045-2: Anhang L (Kornzusammensetzung der Gesteinskörnung)' }
        ]}
        formeln={[
          {
            formel: 'P(d) = \\frac{d^q - d_{\\text{min}}^q}{D_{\\text{max}}^q - d_{\\text{min}}^q} \\cdot 100\\,\\%',
            erklaerung: 'Modifiziertes Andreasen & Andersen Modell (A&A): Kontinuierliche Kornpackungsoptimierung unter Einbeziehung des Feinstkornbereichs d_min mit Verteilungsmodul q (für UHPC oft q = 0.23 bis 0.28).',
            quelle: 'Andreasen & Andersen / Funk & Dinger'
          },
          {
            formel: 'P(d) = \\left(\\frac{d}{D_{\\text{max}}}\\right)^n \\cdot 100\\,\\% \\quad (n = 0{,}5 \\implies \\text{Fuller-Kurve})',
            erklaerung: 'Fuller-Gleichung: Idealisierte stetige Sieblinie mit Exponent n = 0.5 für maximale Dichte und minimale Hohlraumvolumina.',
            quelle: 'DIN 1045-2 / Fuller-Thompson'
          },
          {
            formel: '\\Phi = \\frac{V_{\\text{Fest}}}{V_{\\text{Gesamt}}} = 1 - \\varepsilon',
            erklaerung: 'Packungsdichte Phi: Verhältnis des Feststoffvolumens zum Gesamtvolumen (wobei epsilon der Hohlraumgehalt ist).',
            quelle: 'De Larrard'
          }
        ]}
      />
    </div>
  );
}
