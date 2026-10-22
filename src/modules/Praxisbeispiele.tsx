import { formatDeZahl } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { AlertTriangle, CheckCircle2, Layers, Info } from 'lucide-react';
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
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import { ZwangCalculator } from './Zwang';

export default function Praxisbeispiele() {
  const [thickness, setThickness] = useState(1.5);
  const [cementType, setCementType] = useState('CEM I 42.5 R');
  const [cementContent, setCementContent] = useState(350);
  const [tFresh, setTFresh] = useState(20);
  const [tAmbient, setTAmbient] = useState(15);
  const [restraint, setRestraint] = useState(0.5);

  const results = useMemo(() => {
    const heatFactors: Record<string, number> = {
      'CEM I 42.5 R': 12,
      'CEM II/A-LL 32.5 R': 10,
      'CEM III/B 32.5 N': 7
    };

    const heatFactor = heatFactors[cementType];
    const deltaT_ad = (cementContent / 100) * heatFactor;
    const thicknessFactor = 1 - Math.exp(-thickness);
    const T_max = tFresh + deltaT_ad * thicknessFactor;
    const t_p = 1 + thickness; // Peak time in days

    const labels = [];
    const tempCurve = [];
    const stressCurve = [];
    const strengthCurve = [];

    let maxStress = 0;
    let crackRisk = false;

    for (let t = 0; t <= 28; t += 0.5) {
      labels.push(t);
      
      // Temperature curve
      let T;
      if (t === 0) {
        T = tFresh;
      } else {
        const heating = (T_max - tFresh) * (t / t_p) * Math.exp(1 - t / t_p);
        const cooling = (T_max - tAmbient) * Math.exp(-(t - t_p) / (thickness * 2));
        
        if (t <= t_p) {
          T = tFresh + heating;
        } else {
          T = tAmbient + cooling;
        }
      }
      tempCurve.push(T);

      // Strength curve
      const f_ctm = 2.5; 
      const s = cementType.includes('CEM I') ? 0.2 : (cementType.includes('CEM III') ? 0.38 : 0.25);
      const f_ct = t > 0 ? f_ctm * Math.exp(s * (1 - Math.sqrt(28 / t))) : 0;
      strengthCurve.push(f_ct);

      // E-Modulus curve
      const E_c = t > 0 ? 30000 * Math.exp(s * (1 - Math.sqrt(28 / t))) : 0;

      // Stress curve
      let sigma = 0;
      if (t > t_p) {
        const deltaT_cool = T_max - T;
        sigma = 10e-6 * deltaT_cool * E_c * restraint;
      }
      stressCurve.push(sigma);

      if (sigma > maxStress) {
        maxStress = sigma;
      }
      
      if (sigma > f_ct && t > 0) {
        crackRisk = true;
      }
    }

    // Mindestbewehrung (vereinfacht)
    // As = kc * k * fct,eff * Act / sigma_s
    const d_cm = thickness * 100 - 5; // Annahme: 5 cm Randabstand
    const hc_eff = Math.min(2.5 * (thickness * 100 - d_cm), (thickness * 100) / 2);
    const Act = 100 * hc_eff; // cm² per face per meter
    const As_min = (1.0 * 0.8 * 2.5 * Act) / 240; // cm²/m per face

    return {
      T_max,
      maxStress,
      crackRisk,
      As_min,
      tempChartData: {
        labels,
        datasets: [
          {
            label: 'Kerntemperatur (°C)',
            data: tempCurve,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0
          },
          {
            label: 'Umgebungstemperatur (°C)',
            data: labels.map(() => tAmbient),
            borderColor: '#3b82f6',
            borderDash: [5, 5],
            tension: 0,
            pointRadius: 0
          }
        ]
      },
      stressChartData: {
        labels,
        datasets: [
          {
            label: 'Zwangspannung (MPa)',
            data: stressCurve,
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0
          },
          {
            label: 'Zugfestigkeit f_ctm(t) (MPa)',
            data: strengthCurve,
            borderColor: '#22c55e',
            borderDash: [5, 5],
            tension: 0.4,
            pointRadius: 0
          }
        ]
      }
    };
  }, [thickness, cementType, cementContent, tFresh, tAmbient, restraint]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
            <Layers size={24} />
          </div>
          <h2 className="text-xl font-bold text-text-main">Zwang & Rissbreite bei massigen Bauteilen</h2>
      

        </div>

        <div className="text-sm text-text-main/80 bg-blue-50 border-blue-200 p-5 rounded-xl border my-4">
          <h3 className="text-base font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Info size={20} />
            Einfache Erklärung der Phänomene
          </h3>
          <p className="mb-4">
            Beim Betonieren massiger Bauteile (z.B. dicke Bodenplatten) greifen verschiedene Effekte ineinander, die zu Rissen führen können:
          </p>
          <ul className="list-disc pl-5 space-y-3">
            <li><strong>Wärmefluss & Hydratation:</strong> Zement reagiert mit Wasser und erzeugt Wärme (Hydratationswärme). Ein massiges Bauteil kann diese Wärme im Kern schlecht abgeben, wodurch es sich ausdehnt (Aufheizphase).</li>
            <li><strong>Verformungsbehinderung (Zwang):</strong> Wenn das Bauteil abkühlt oder schwindet, möchte es sich zusammenziehen. Ist es aber z.B. starr mit dem Untergrund verbunden, wird diese Verkürzung behindert. Das erzeugt enorme Zugkräfte (Zwangspannungen).</li>
            <li><strong>Schwindarten:</strong> Beton zieht sich beim Austrocknen (Trocknungsschwinden) und chemisch bei der Hydratation (Autogenes Schwinden) zusammen. Das erhöht die Dehnungsbehinderung und somit die Zugspannungen.</li>
            <li><strong>Festigkeitsentwicklung:</strong> Junger Beton ist noch sehr weich und hat eine geringe Zugfestigkeit. Gleichzeitig entwickeln sich in dieser frühen Phase die höchsten Spannungen durch Hitze und Abkühlung. Überschreitet die Zwangspannung die junge Zugfestigkeit, reißt der Beton (Trennrisse).</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Bauteil & Zwang</h3>
              <Slider info="Dicke des Bauteils." label={<FormulaText text="Bauteildicke h" />} min={0.5} max={3.0} step={0.1} value={thickness} unit="m" onChange={(e) => setThickness(Number(e.target.value))} />
              <div className="mt-4">
                <Slider  label={<FormulaText text="Behinderungsgrad R" />} min={0} max={1.0} step={0.1} value={restraint} unit="-" onChange={(e) => setRestraint(Number(e.target.value))} />
                <p className="text-xs text-home-grau mt-1">R=0 (frei beweglich), R=1 (starr eingespannt). Bodenplatten typischerweise R=0.3 bis 0.5.</p>
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Betonrezeptur</h3>
              <div className="flex items-center gap-2"><label className="text-xs font-bold text-home-grau uppercase tracking-wider mb-1 block">Zementart</label><InfoTooltip text="Art des verwendeten Zements (z.B. CEM I, CEM II)." /></div>
              <select aria-label="Zementart" 
                value={cementType}
                onChange={(e) => setCementType(e.target.value)}
                className="w-full p-2 text-sm border border-home-grau/30 rounded-lg focus:outline-none focus:border-shiraz bg-white mb-4"
              >
                <option value="CEM I 42.5 R">CEM I 42.5 R (Schnell, hohe Wärme)</option>
                <option value="CEM II/A-LL 32.5 R">CEM II/A-LL 32.5 R (Mittel)</option>
                <option value="CEM III/B 32.5 N">CEM III/B 32.5 N (Langsam, niedrige Wärme)</option>
              </select>
              <Slider label="Zementgehalt" info="Menge des Zements pro Kubikmeter." min={250} max={450} step={10} value={cementContent} unit="kg/m³" onChange={(e) => setCementContent(Number(e.target.value))} />
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Temperaturen</h3>
              <Slider label="Frischbetontemperatur"  min={5} max={30} step={1} value={tFresh} unit="°C" onChange={(e) => setTFresh(Number(e.target.value))} />
              <div className="mt-4">
                <Slider label="Umgebungstemperatur" info="Temperatur der Umgebung." min={-5} max={35} step={1} value={tAmbient} unit="°C" onChange={(e) => setTAmbient(Number(e.target.value))} />
              </div>
            </div>
          </div>

          {/* Results & Charts */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Max. Kerntemperatur</div>
                <div className="text-2xl font-bold text-shiraz">{formatDeZahl(results.T_max, 1)} °C</div>
                <div className="text-xs text-text-main/60 mt-1">ΔT = {formatDeZahl((results.T_max - tAmbient), 1)} K zur Umgebung</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Max. Zwangspannung</div>
                <div className="text-2xl font-bold text-fuchsia-600">{formatDeZahl(results.maxStress, 2)} MPa</div>
                <div className="text-xs text-text-main/60 mt-1">Tritt in der Abkühlphase auf</div>
              </div>
              <div className={`p-4 rounded-xl border shadow-sm text-white ${results.crackRisk ? 'bg-red-500 border-red-600' : 'bg-emerald-500 border-emerald-600'}`}>
                <div className="text-xs uppercase tracking-wider mb-1 opacity-90">Rissrisiko (Trennrisse)</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {results.crackRisk ? <><AlertTriangle size={24} /> Sehr Hoch</> : <><CheckCircle2 size={24} /> Gering</>}
                </div>
                <div className="text-xs opacity-90 mt-1">
                  {results.crackRisk ? 'Spannung > Zugfestigkeit' : 'Spannung < Zugfestigkeit'}
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm h-[300px]">
              <h3 className="text-sm font-bold text-text-main mb-4">Temperaturverlauf (Kern)</h3>
              <div className="relative w-full h-[220px]">
                <Line 
                  data={results.tempChartData} 
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                      x: { 
                        title: { display: true, text: 'Zeit (Tage)' },
                        ticks: { maxTicksLimit: 15 }
                      },
                      y: { title: { display: true, text: 'Temperatur (°C)' } }
                    }
                  }} 
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm h-[300px]">
              <h3 className="text-sm font-bold text-text-main mb-4">Spannungsentwicklung vs. Festigkeit</h3>
              <div className="relative w-full h-[220px]">
                <Line 
                  data={results.stressChartData} 
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                      x: { 
                        title: { display: true, text: 'Zeit (Tage)' },
                        ticks: { maxTicksLimit: 15 }
                      },
                      y: { title: { display: true, text: 'Spannung / Festigkeit (MPa)' } }
                    }
                  }} 
                />
              </div>
            </div>

            {results.crackRisk && (
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                  <AlertTriangle size={18} /> Maßnahmen zur Rissvermeidung
                </h4>
                <ul className="list-disc list-inside text-sm text-orange-900 ml-4 space-y-1">
                  <li>Verwendung eines Zements mit niedriger Wärmeentwicklung (z.B. CEM III).</li>
                  <li>Reduzierung des Zementgehalts (sofern statisch/dauerhaft zulässig).</li>
                  <li>Absenkung der Frischbetontemperatur (z.B. durch Zugabe von Eiswasser).</li>
                  <li>Einbau einer ausreichenden Mindestbewehrung zur Rissbreitenbegrenzung (ca. {formatDeZahl(results.As_min, 1)} cm²/m je Seite).</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ZwangCalculator />
      
    </div>
  );
}
