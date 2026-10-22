import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { 
  Droplets, Thermometer, Wind, Beaker, Plus, Trash2, 
  ArrowUp, ArrowDown, ShieldAlert, Sparkles, AlertTriangle, CheckCircle, HelpCircle 
} from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { BlockMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
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

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Predefined materials for the quick s_d solver
interface Material {
  id: string;
  name: string;
  mu: number; // Wasserdampfdiffusionswiderstandszahl
  defaultD: number; // Default thickness in m
  lambda: number; // Wärmeleitfähigkeit W/(m·K)
}

const MAT_LIBRARY: Material[] = [
  { id: 'gipskarton', name: 'Gipskartonplatte (GKB)', mu: 10, defaultD: 0.0125, lambda: 0.25 },
  { id: 'innenputz_gips', name: 'Gips-Innenputz', mu: 10, defaultD: 0.015, lambda: 0.35 },
  { id: 'kalksandstein', name: 'Kalksandstein-Mauerwerk', mu: 15, defaultD: 0.175, lambda: 0.99 },
  { id: 'ziegel_hochloch', name: 'Hochlochziegel-Mauerwerk', mu: 5, defaultD: 0.24, lambda: 0.42 },
  { id: 'beton_arm', name: 'Stahlbeton (tragend)', mu: 80, defaultD: 0.20, lambda: 2.30 },
  { id: 'porenbeton', name: 'Porenbeton-Planstein', mu: 10, defaultD: 0.305, lambda: 0.11 },
  { id: 'mineralwolle', name: 'Mineralwolle (MW) Dämmung', mu: 1, defaultD: 0.16, lambda: 0.035 },
  { id: 'eps', name: 'EPS (Polystyrol, WLS 035)', mu: 50, defaultD: 0.16, lambda: 0.035 },
  { id: 'holz', name: 'Nadelholz (quer)', mu: 40, defaultD: 0.024, lambda: 0.13 },
  { id: 'dampfbremse_var', name: 'Feuchtevariable Dampfbremsbahn', mu: 15000, defaultD: 0.0002, lambda: 0.20 },
  { id: 'pe_folie', name: 'Dampfsperre PE-Folie', mu: 100000, defaultD: 0.0002, lambda: 0.50 },
  { id: 'aussenputz_zement', name: 'Kalk-Zement-Außenputz', mu: 25, defaultD: 0.02, lambda: 1.00 },
];

export default function Feuchteschutz() {
  // Indoor climate values
  const [Ti, setTi] = useState<number>(20.0); // Inside Temp (°C)
  const [phiI, setPhiI] = useState<number>(50.0); // Inside rel. humidity (%)
  const [Tsi, setTsi] = useState<number>(15.0); // Surface Temp (°C)

  // Outdoor climate values (for comparison)
  const [Te, setTe] = useState<number>(-5.0); // Outside Temp (°C)
  const [phiE, setPhiE] = useState<number>(80.0); // Outside rel. humidity (%)

  // Layers state for the s_d sandbox
  const [layers, setLayers] = useState([
    { id: 'l1', matId: 'innenputz_gips', d: 0.015 },
    { id: 'l2', matId: 'ziegel_hochloch', d: 0.24 },
    { id: 'l3', matId: 'eps', d: 0.16 },
    { id: 'l4', matId: 'aussenputz_zement', d: 0.02 }
  ]);

  // Helper functions for thermodynamic physics (Magnus-Formula)
  const calcPsat = (temp: number): number => {
    // Sättigungsdampfdruck in Pascal nach Magnus-Formel (DIN 4108-3 / DIN EN ISO 13788):
    // über Wasser für T >= 0 °C, über Eis für T < 0 °C
    if (temp < 0) return 610.5 * Math.exp((21.875 * temp) / (265.5 + temp));
    return 610.5 * Math.exp((17.269 * temp) / (237.3 + temp));
  };

  const calcAbsoluteHumidity = (temp: number, relHum: number): number => {
    // Absolute moisture g/m³ using ideal gas law of vapor
    const p_sat = calcPsat(temp);
    const p = p_sat * (relHum / 100.0);
    // Rv (Vapor gas constant) = 461.5 J/(kg K)
    // Absolute moisture = p / (Rv * T) * 1000 g/kg
    const T_kelvin = temp + 273.15;
    return (p / (461.5 * T_kelvin)) * 1000;
  };

  const calcDewPoint = (temp: number, relHum: number): number => {
    const p_sat = calcPsat(temp);
    const p = p_sat * (relHum / 100);
    // Inverse Magnus formulation to retrieve target Dewpoint (Eis-Koeffizienten unterhalb 610,5 Pa)
    const a = p < 610.5 ? 21.875 : 17.269;
    const b = p < 610.5 ? 265.5 : 237.3;
    const ln_p = Math.log(p / 610.5);
    return (b * ln_p) / (a - ln_p);
  };

  // Calculations for static climates
  const indoorClimate = useMemo(() => {
    const psat = calcPsat(Ti);
    const p_act = psat * (phiI / 100);
    const absHum = calcAbsoluteHumidity(Ti, phiI);
    const dewPoint = calcDewPoint(Ti, phiI);
    
    // Mold critical temperature (where humidity reaches 80% on surfaces)
    // T_schimmel -> p_act / p_sat(T_schimmel) = 0.8 => p_sat(T_schimmel) = p_act / 0.8
    const p_schimmel_limit = p_act / 0.8;
    const a = p_schimmel_limit < 610.5 ? 21.875 : 17.269;
    const b = p_schimmel_limit < 610.5 ? 265.5 : 237.3;
    let schimmelPoint = 0;
    if (p_schimmel_limit > 0) {
      const ln_pschimmel = Math.log(p_schimmel_limit / 610.5);
      schimmelPoint = (b * ln_pschimmel) / (a - ln_pschimmel);
    }

    return { psat, p_act, absHum, dewPoint, schimmelPoint };
  }, [Ti, phiI]);

  const outdoorClimate = useMemo(() => {
    const psat = calcPsat(Te);
    const p_act = psat * (phiE / 100);
    const absHum = calcAbsoluteHumidity(Te, phiE);
    const dewPoint = calcDewPoint(Te, phiE);
    return { psat, p_act, absHum, dewPoint };
  }, [Te, phiE]);

  // Evaluate surface risk based on user inside surface temperature input Tsi
  const surfaceAuditStatus = useMemo(() => {
    const dewPoint = indoorClimate.dewPoint;
    const schimmelPoint = indoorClimate.schimmelPoint;
    const actualSurfaceRH = (indoorClimate.p_act / calcPsat(Tsi)) * 100;

    let level: 'safe' | 'warning' | 'danger' = 'safe';
    let text = 'Hygienisch einwandfreier Bereich. Keine Gefahr für Kondensat oder biologisches Wachstum.';

    if (Tsi <= dewPoint) {
      level = 'danger';
      text = `Achtung: Freies Tauwasser! Die Bauteil-Oberflächentemperatur (${formatDeZahl(Tsi, 1)}°C) liegt auf oder unter dem Taupunkt (${formatDeZahl(dewPoint, 1)}°C). Es fällt flüssiges Kondensat aus.`;
    } else if (Tsi <= schimmelPoint || actualSurfaceRH >= 80) {
      level = 'warning';
      text = `Erhöhte Schimmelpilzgefahr! Die relative Oberflächenfeuchte liegt bei ${formatDeZahl(actualSurfaceRH, 0)}% (Grenzwert nach DIN 4108-2 liegt bei 80%). Schimmel bildet sich bereits weit vor dem eigentlichen Tauwasserausfall!`;
    }

    return { level, text, actualSurfaceRH };
  }, [Tsi, indoorClimate]);

  // Chart data setup for Sättigungsdampfdruck (Magnus Curve)
  const magnusChartData = useMemo(() => {
    // Generate data points from -15°C to 35°C
    const temps: number[] = [];
    const psatValues: number[] = [];
    const pActValues: number[] = [];

    for (let t = -15; t <= 35; t += 2) {
      temps.push(t);
      psatValues.push(Math.round(calcPsat(t)));
      // Constantly display actual partial pressure line for reference
      pActValues.push(Math.round(indoorClimate.p_act));
    }

    return {
      labels: temps.map(t => `${formatDeWert(t)}°C`),
      datasets: [
        {
          label: 'Sättigungsdampfdruck psat(T) [Pa]',
          data: psatValues,
          borderColor: '#3b82f6', // custom blue
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          borderWidth: 2,
          pointRadius: 1,
          tension: 0.3,
          fill: true,
        },
        {
          label: 'Ist-Dampfdruck p_innen [Pa]',
          data: pActValues,
          borderColor: '#10b981', // custom green
          borderWidth: 1.5,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        }
      ]
    };
  }, [indoorClimate]);

  // Layers calculated values
  const layerCalculations = useMemo(() => {
    let totalSd = 0;
    const computed = layers.map((l, index) => {
      const mat = MAT_LIBRARY.find(m => m.id === l.matId) || MAT_LIBRARY[0];
      const sd = mat.mu * l.d;
      totalSd += sd;
      return {
        ...l,
        name: mat.name,
        mu: mat.mu,
        sd
      };
    });

    // Check "Innen dichter als außen":
    let isInnerTighter = true;
    if (layers.length > 1) {
      const mid = Math.ceil(layers.length / 2);
      const innerPart = computed.slice(0, mid).reduce((sum, item) => sum + item.sd, 0);
      const outerPart = computed.slice(mid).reduce((sum, item) => sum + item.sd, 0);
      
      if (innerPart < outerPart) {
        isInnerTighter = false;
      }
    }

    // Glaser Condensation Check across layers
    const Rsi = 0.13;
    const Rse = 0.04;
    const R_layers = computed.map(l => {
      const mat = MAT_LIBRARY.find(m => m.id === l.matId) || MAT_LIBRARY[0];
      return l.d / (mat.lambda || 0.1);
    });
    const R_tot = Rsi + R_layers.reduce((a, b) => a + b, 0) + Rse;

    const p_i = calcPsat(Ti) * (phiI / 100);
    const p_e = calcPsat(Te) * (phiE / 100);

    let hasGlaserTauwasser = false;
    let accumR = Rsi;
    let accumSd = 0;

    for (let i = 0; i < computed.length; i++) {
      accumR += R_layers[i];
      accumSd += computed[i].sd;
      const T_boundary = Ti - (accumR / R_tot) * (Ti - Te);
      const psat_boundary = calcPsat(T_boundary);
      const p_boundary = totalSd > 0 ? p_i - (accumSd / totalSd) * (p_i - p_e) : p_e;
      if (p_boundary > psat_boundary + 1.0) {
        hasGlaserTauwasser = true;
        break;
      }
    }

    return { computed, totalSd, isInnerTighter, hasGlaserTauwasser };
  }, [layers, Ti, Te, phiI, phiE]);

  // Methods for layers sandbox
  const addLayer = () => {
    const defaultMat = MAT_LIBRARY[7]; // EPS Dämmung
    setLayers([...layers, { id: `l_${Date.now()}`, matId: defaultMat.id, d: defaultMat.defaultD }]);
  };

  const removeLayer = (index: number) => {
    const updated = [...layers];
    updated.splice(index, 1);
    setLayers(updated);
  };

  const moveLayer = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === layers.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...layers];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setLayers(updated);
  };

  const updateLayer = (index: number, key: 'matId' | 'd', value: any) => {
    const updated = [...layers];
    if (key === 'matId') {
      const mat = MAT_LIBRARY.find(m => m.id === value) || MAT_LIBRARY[0];
      updated[index] = { ...updated[index], matId: value, d: mat.defaultD };
    } else {
      updated[index] = { ...updated[index], d: parseFloat(value) || 0 };
    }
    setLayers(updated);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Introduction */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Droplets className="w-5 h-5 text-shiraz" />
              Feuchteschutz &amp; Wasserdampf-Taupunkt
            </h2>
            <p className="text-xs text-text-main/50 font-mono mt-1">
              Berechnungsverfahren nach DIN 4108-3 &amp; Sättigungsdampfdruck nach der Magnus-Formel
            </p>
          </div>
          <span className="hidden md:inline-flex items-center gap-1 bg-shiraz/10 text-shiraz px-2.5 py-1 rounded-full text-xs font-bold border border-shiraz/20">
            <Sparkles size={12} /> Interaktiv
          </span>
        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>
            Feuchtigkeit im Bauwerk führt zu Bauschäden und gesundheitsschädlichem Schimmel. 
            Mit diesem Berechnungs- und Demonstrationstool lassen sich die Luftfeuchte, der <strong>Taupunkt (Kondensation)</strong> 
            sowie der Diffusionswiderstand geschichteter Konstruktionen nach dem <strong>Periodenbilanzverfahren (Glaser-Verfahren)</strong> analysieren.
          </p>
        </div>
      </div>

      {/* Main Grid: Climate vs Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Interaktiver Berechner (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <Thermometer size={14} className="text-orange-800" /> Raumklima &amp; Bauteiloberfläche
            </h4>

            {/* Inputs: T_i and phi_i */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Innen-Lufttemperatur (T_i):</label>
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">{formatDeZahl(Ti, 1)} °C</span>
                </div>
                <input 
                  type="range" min="15" max="30" step="0.5"
                  value={Ti} 
                  onChange={(e) => setTi(parseFloat(e.target.value))}
                  className="w-full accent-orange-800 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Rel. Raumluftfeuchte (φ_i):</label>
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">{formatDeZahl(phiI, 0)} %</span>
                </div>
                <input 
                  type="range" min="20" max="95" step="1"
                  value={phiI} 
                  onChange={(e) => setPhiI(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-black text-orange-900 flex items-center gap-1">
                    Bauteil-Oberfläche (T_si):
                  </label>
                  <span className="text-xs font-mono font-bold text-rose-800 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">{formatDeZahl(Tsi, 1)} °C</span>
                </div>
                <input 
                  type="range" min="-5" max="25" step="0.5"
                  value={Tsi} 
                  onChange={(e) => setTsi(parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 mt-1 italic">
                  Temperatur der Wandinnenseite (simuliert eine ungedämmte Wärmebrücke / Ecke).
                </p>
              </div>
            </div>

            {/* Results Table */}
            <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Berechnete Werte (Innenklima)</div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-150">
                  <span className="text-slate-400 text-[10px] block font-bold">Sättigungsdruck p_sat:</span>
                  <span className="font-mono font-bold text-slate-800 text-[13px]">{formatDeZahl(indoorClimate.psat, 1)} Pa</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-150">
                  <span className="text-slate-400 text-[10px] block font-bold">Ist-Teildruck p:</span>
                  <span className="font-mono font-bold text-slate-800 text-[13px]">{formatDeZahl(indoorClimate.p_act, 1)} Pa</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-150">
                  <span className="text-slate-400 text-[10px] block font-bold">Absolute Luftfeuchte:</span>
                  <span className="font-mono font-bold text-slate-800 text-[13px]">{formatDeZahl(indoorClimate.absHum, 2)} g/m³</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-150 focus-within:ring-2">
                  <span className="text-blue-500 text-[10px] block font-extrabold">Taupunkt T_dp (100%):</span>
                  <span className="font-mono font-black text-blue-600 text-[13px]">{formatDeZahl(indoorClimate.dewPoint, 1)} °C</span>
                </div>
              </div>

              {/* Mold Limit Temperature indicator (80% boundary block) */}
              <div className="p-2.5 bg-yellow-50/50 border border-yellow-100 rounded-lg text-[10.5px]">
                <div className="flex justify-between items-center text-yellow-800 font-bold mb-1">
                  <span>Schimmelgrenze T_schimmel (80% r.f.):</span>
                  <span className="font-mono">{formatDeZahl(indoorClimate.schimmelPoint, 1)} °C</span>
                </div>
                <p className="text-slate-500 leading-relaxed text-[9.5px]">
                  Fällt die Wandoberfläche unter diesen Wert, herrscht direkt auf der Wand eine Feuchte von &gt; 80%. Hält dieser Zustand mehrere Tage an, können Schimmelpilze wachsen.
                </p>
              </div>
            </div>
          </div>

          {/* Audit Result Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed shadow-sm transition-colors ${
            surfaceAuditStatus.level === 'danger' 
              ? 'bg-red-50 border-red-200 text-red-950' 
              : surfaceAuditStatus.level === 'warning' 
                ? 'bg-yellow-50 border-yellow-200 text-yellow-950' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}>
            <div className="mt-0.5 shrink-0">
              {surfaceAuditStatus.level === 'danger' && <AlertTriangle size={18} className="text-red-600 animate-bounce" />}
              {surfaceAuditStatus.level === 'warning' && <ShieldAlert size={18} className="text-yellow-600" />}
              {surfaceAuditStatus.level === 'safe' && <CheckCircle size={18} className="text-emerald-600" />}
            </div>
            <div className="flex-1">
              <h5 className="font-extrabold uppercase tracking-wide text-[10px] text-slate-400 mb-1">
                {surfaceAuditStatus.level === 'danger' && 'KRITISCHER REZESS: TAUKONDENSAT'}
                {surfaceAuditStatus.level === 'warning' && 'VORSICHT: BIOLOGISCHES SCHIMMELRISIKO'}
                {surfaceAuditStatus.level === 'safe' && 'AUDIT: OBERFLÄCHE OPTIMAL'}
              </h5>
              <p className="font-medium text-[11px]">{surfaceAuditStatus.text}</p>
              <div className="mt-2 text-[10px] font-mono font-bold text-slate-500 border-t border-slate-200/50 pt-1 flex justify-between">
                <span>Rel. Oberflächenfeuchte:</span>
                <span className={
                  surfaceAuditStatus.level === 'danger' 
                    ? 'text-red-700 font-black' 
                    : surfaceAuditStatus.level === 'warning' 
                      ? 'text-yellow-700 font-black' 
                      : 'text-emerald-700'
                }>{formatDeZahl(surfaceAuditStatus.actualSurfaceRH, 0)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Graph & Physics (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 border-b border-slate-100 pb-2.5 mb-4 flex items-center justify-between">
              <span>Magnus-Sättigungskurve &amp; Dampfdruck</span>
              <span className="text-[10px] text-slate-400 font-mono tracking-normal capitalize">Zustand vs. Sättigungsdruck</span>
            </h4>

            {/* Coordinates Chart */}
            <div className="h-[260px] w-full relative">
              <Line 
                data={magnusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      title: { display: true, text: 'Temperatur T (°C)', font: { size: 10, weight: 'bold' } },
                      grid: { display: false },
                      ticks: { font: { size: 9, weight: 'bold' }, color: '#64748b' }
                    },
                    y: {
                      title: { display: true, text: 'Wasserdampfpartialdruck p (Pa)', font: { size: 10, weight: 'bold' } },
                      ticks: { font: { size: 9, weight: 'bold' }, color: '#64748b' }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: { boxWidth: 12, font: { size: 9, weight: 'bold' } }
                    }
                  }
                }}
              />
            </div>

            {/* Academic explanations */}
            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-slate-600">
              <div>
                <p className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <Wind size={12} className="text-blue-500" /> Was zeigt diese Kurve?
                </p>
                <p className="leading-relaxed text-[11px]">
                  Die blaue Begrenzungslinie stellt den <strong>Sättigungsdampfdruck p_sat(T)</strong> dar. Luft kann bei hohen Temperaturen exponentiell mehr Wasserdampf tragen als bei Kälte. 
                </p>
              </div>
              <div>
                <p className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <HelpCircle size={12} className="text-emerald-600" /> Was ist der Taupunkt?
                </p>
                <p className="leading-relaxed text-[11px]">
                  Die grüne gestrichelte Linie ist der aktuelle Dampfdruck (p) im Raum. Fällt die Temperatur unter den Schnittpunkt mit der blauen Linie (<strong>Taupunkt T_dp</strong>), kondensiert überschüssiger Dampf zu flüssigem Bautauwasser.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter 2: s_d-Value Multi-Layer Sandbox ("Innen dichter als außen") */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-150 pb-4 mb-5 gap-3">
          <div>
            <h4 className="text-md font-extrabold text-slate-800 flex items-center gap-2">
              <Beaker className="text-blue-600" size={18} /> s_d-Wert Sandbox: Schichtenfeuchte-Prüfer
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Testen Sie Ihre Konstruktion im Hinblick auf den Diffusionswiderstand und die goldene Bauphysikregel.
            </p>
          </div>
          
          <button 
            onClick={addLayer}
            className="px-3 py-1.5 bg-orange-800 hover:bg-slate-900 text-white rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer shadow-sm uppercase tracking-wider"
          >
            <Plus size={14} /> Neue Schicht hinzufügen
          </button>
        </div>

        {/* Sandbox Content Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Layer Configurator Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center text-[10px] font-black uppercase text-slate-400 px-3">
              <span className="w-10">Reihen.</span>
              <span className="flex-1 pl-4">Zuständiger Baustoff</span>
              <span className="w-24 text-center">Dicke d (m)</span>
              <span className="w-20 text-center">µ-Wert [-]</span>
              <span className="w-24 text-right">sd-Wert (m)</span>
              <span className="w-12"></span>
            </div>

            {/* Simulated wall structure stack (Inner to Outer, index 0 is Inside, last is Outside) */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {layerCalculations.computed.map((layer, index) => (
                <div key={layer.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 transition-shadow hover:shadow-subtle">
                  
                  {/* Position movers */}
                  <div className="flex flex-col gap-1 text-slate-400">
                    <button 
                      onClick={() => moveLayer(index, 'up')} 
                      disabled={index === 0}
                      className="hover:text-orange-800 disabled:opacity-25 cursor-pointer"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button 
                      onClick={() => moveLayer(index, 'down')} 
                      disabled={index === layers.length - 1}
                      className="hover:text-orange-800 disabled:opacity-25 cursor-pointer"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>

                  {/* Interface fields */}
                  <div className="flex-1 grid grid-cols-12 gap-2">
                    {/* Material Select */}
                    <div className="col-span-6">
                      <select 
                        value={layer.matId}
                        onChange={(e) => updateLayer(index, 'matId', e.target.value)}
                        className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-lg font-bold text-slate-800 cursor-pointer focus:ring-1 focus:ring-orange-800"
                      >
                        {MAT_LIBRARY.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Thickness Input */}
                    <div className="col-span-3 relative flex items-center">
                      <input 
                        type="number" step="0.005" min="0.0001"
                        value={layer.d}
                        onChange={(e) => updateLayer(index, 'd', e.target.value)}
                        className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-lg font-mono text-slate-800 text-center pr-5"
                      />
                      <span className="absolute right-1.5 text-[8.5px] font-bold text-slate-400">m</span>
                    </div>

                    {/* Mu factor (Static display) */}
                    <div className="col-span-3 bg-slate-100 rounded-lg p-1.5 flex items-center justify-center border border-slate-200 text-xs font-mono text-slate-600 font-bold">
                      µ = {layer.mu >= 10000 ? formatDeWert(layer.mu) : layer.mu}
                    </div>
                  </div>

                  {/* Individual computed value */}
                  <div className="w-24 text-right text-xs font-mono font-black text-slate-800">
                    {formatDeZahl(layer.sd, 3)} m
                  </div>

                  {/* Trash button */}
                  <button 
                    onClick={() => removeLayer(index)}
                    className="text-slate-450 hover:text-red-500 cursor-pointer p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-3 px-4 text-xs font-bold text-slate-600 mt-2">
              <span className="uppercase tracking-wide text-slate-400 font-black text-[10px]">Laufrichtung der Schichten:</span>
              <span className="flex items-center gap-1 text-slate-700">
                <span className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[10px]">Zimmer-Innenseite</span> 
                → 
                <span className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[10px]">Haus-Außenseite</span>
              </span>
            </div>
          </div>

          {/* Golden Rule Analysis (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
            
            {/* Computed total value banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                DIFFUSIONSTECHNISCHE AUSWERTUNG
              </span>
              
              <div className="flex justify-between items-baseline select-all">
                <span className="text-xs text-slate-600 font-bold">Äquivalente Gesamtluftdicke (s_d,ges):</span>
                <span className="text-xl font-mono font-black text-slate-900 border-b border-2 border-slate-200/50">
                  {formatDeZahl(layerCalculations.totalSd, 3)} m
                </span>
              </div>

              {/* Dynamic Analysis Check */}
              <div className={`p-4 rounded-xl border flex items-start gap-2.5 text-[11px] leading-relaxed ${
                !layerCalculations.hasGlaserTauwasser
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-950' 
                  : 'bg-red-50/50 border-red-200 text-red-950'
              }`}>
                <div className="mt-0.5 shrink-0">
                  {!layerCalculations.hasGlaserTauwasser
                    ? <CheckCircle size={16} className="text-emerald-600" />
                    : <AlertTriangle size={16} className="text-red-600 animate-pulse" />
                  }
                </div>
                <div className="flex-1">
                  <h6 className="font-extrabold uppercase tracking-wide text-[9.5px] text-slate-400">
                    Regel-Check "Innen dichter als außen"
                  </h6>
                  <p className="font-medium mt-1">
                    {layerCalculations.isInnerTighter && !layerCalculations.hasGlaserTauwasser
                      ? 'Konstruktion günstig: Die innenseitigen Schichten bieten einen höheren Wasserdampfwiderstand als die Bauteilaußenseite. Feuchte dringt schwer ein, aber leicht nach außen ab.'
                      : layerCalculations.isInnerTighter
                        ? 'Innen dichter als außen, aber im Glaser-Klima rechnerisch Tauwasser: Tauwassermasse und Verdunstung nach DIN 4108-3 nachweisen (Grenzwerte u. a. 1,0 kg/m² gesamt, 0,5 kg/m² an nicht kapillar wasseraufnahmefähigen Schichtgrenzen).'
                      : layerCalculations.hasGlaserTauwasser
                        ? 'Kritischer Konstruktionsfehler! Die äußeren Bauteilschichten bremsen den Dampf stärker als die inneren Schichten. Feuchte sammelt sich im Inneren an und kann nicht austrocknen.'
                        : 'Außen diffusionsdichter als innen – für diesen Aufbau rechnerisch unkritisch. Wärmedämmverbundsysteme auf Mauerwerk sind nach DIN 4108-3 ohne Nachweis zulässig.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Physic equations with LaTeX rendering */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
              <h5 className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Die physikalischen Grundlagen</h5>
              
              <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
                <div>
                  <span className="font-bold text-slate-800">1. Äquivalente Luftschichtdicke:</span>
                  <div className="my-1.5 p-1 bg-white border border-slate-100 rounded text-center">
                    <FormulaText text="s_d = \mu \cdot d" />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Beschreibt, wie viel dicker eine ruhende Luftschicht sein müsste, um denselben Dampfdiffusionswiderstand wie die Bauteilschicht zu erzeugen.
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-800">2. Dampfdruck-Magnusgleichung (über Wasser, DIN 4108-3 / DIN EN ISO 13788):</span>
                  <div className="my-1.5 p-1 bg-white border border-slate-100 rounded text-center overflow-x-auto text-xs">
                    <BlockMath math="p_{\text{sat}}(T) \approx 610{,}5 \cdot \exp\left( \frac{17{,}269 \cdot T}{237{,}3 + T} \right)" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Taupunkt und Schimmelgrenze eines Wohnraums"
        zielGleichung="\theta_{d} = \frac{237{,}3 \cdot \ln(p/610{,}5)}{17{,}269 - \ln(p/610{,}5)}"
        schritte={[
          { titel: 'Dampfdruck', erklaerung: 'Raumklima 20 °C / 50 % r. F.:', formel: 'p_{sat}(20\\,^\\circ\\text{C}) = 2\\,337\\,\\text{Pa}, \\quad p = 0{,}50 \\cdot 2\\,337 = 1\\,169\\,\\text{Pa}' },
          { titel: 'Taupunkt', erklaerung: 'Umkehrung der Magnus-Formel:', formel: '\\ln\\frac{1\\,169}{610{,}5} = 0{,}650 \\Rightarrow \\theta_d = \\frac{237{,}3 \\cdot 0{,}650}{17{,}269 - 0{,}650} = 9{,}3\\,^\\circ\\text{C}' },
          { titel: 'Schimmelgrenze (80 % r. F.)', erklaerung: 'Sättigungsdampfdruck, bei dem die Oberflächenfeuchte 80 % erreicht:', formel: 'p_{sat} = \\frac{1\\,169}{0{,}80} = 1\\,461\\,\\text{Pa} \\Rightarrow \\theta_{si,min} = 12{,}6\\,^\\circ\\text{C}' },
          { titel: 'Bei höherer Raumfeuchte', erklaerung: 'Bad oder schlecht gelüftetes Schlafzimmer mit 65 % r. F.:', formel: 'p = 1\\,519\\,\\text{Pa} \\Rightarrow \\theta_d = 13{,}2\\,^\\circ\\text{C}, \\quad \\theta_{si,min} = 16{,}7\\,^\\circ\\text{C}' }
        ]}
        ergebnisHinweis="Schimmel droht deutlich oberhalb des Taupunkts. Mehr Lüften senkt p und damit beide Grenztemperaturen; Dämmung hebt die Oberflächentemperatur."
        normQuelle="DIN 4108-3:2024-03; DIN EN ISO 13788:2013-05"
      />
      <FormulaDerivationBox
        title="Beispiel 2: s_d-Werte und die Regel „innen dichter als außen“"
        zielGleichung="s_d = \mu \cdot d"
        schritte={[
          { titel: 'Innen', erklaerung: 'Gipsputz 1,5 cm (µ = 10) und Hochlochziegel 24 cm (µ = 5):', formel: 's_{d,innen} = 10 \\cdot 0{,}015 + 5 \\cdot 0{,}24 = 0{,}15 + 1{,}20 = 1{,}35\\,\\text{m}' },
          { titel: 'Außen', erklaerung: 'EPS 16 cm (µ = 50) und Kalk-Zement-Putz 2 cm (µ = 25):', formel: 's_{d,außen} = 50 \\cdot 0{,}16 + 25 \\cdot 0{,}02 = 8{,}0 + 0{,}5 = 8{,}5\\,\\text{m}' },
          { titel: 'Bewertung', erklaerung: 'Außen ist diffusionsdichter, die Dämmung liegt aber außen und hält die Tauebene warm. Der Glaser-Nachweis im Rechner zeigt für 20 °C/50 % und −5 °C/80 % kein Tauwasser.', formel: 's_{d,außen} > s_{d,innen}, \\quad \\text{trotzdem tauwasserfrei}' }
        ]}
        ergebnisHinweis="Die Faustregel gilt vor allem für Holzbau und Innendämmung. WDVS auf Mauerwerk zählt nach DIN 4108-3 zu den Konstruktionen ohne rechnerischen Tauwassernachweis; maßgebend ist der Temperaturverlauf, nicht allein das s_d-Verhältnis."
        normQuelle="Bemessungswerte nach DIN 4108-4:2020-11; Nachweisfreiheit nach DIN 4108-3:2024-03"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="feuchteschutz" />

      {/* Footer-Integration mit normenbezogenen Vorgaben */}
      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 6 Bauphysik: Magnus-Formel über Eis ergänzt, Glaser-Bewertung korrigiert, Normausgaben aktualisiert; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Feuchteschutz', url: 'https://de.wikipedia.org/wiki/Feuchteschutz' },
          { title: 'Wasserdampfdiffusionswiderstand', url: 'https://de.wikipedia.org/wiki/Wasserdampfdiffusionswiderstand' },
          { title: 'Glaser-Verfahren', url: 'https://de.wikipedia.org/wiki/Glaser-Verfahren' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Hens, H.: Building Physics – Heat, Air and Moisture. 3. Aufl., Berlin: Ernst & Sohn 2017'
        ]}
        regelwerke={[
          { title: 'DIN 4108-3:2024-03 (Wärmeschutz und Energie-Einsparung in Gebäuden – Teil 3: Klimabedingter Feuchteschutz; ersetzt 2018-10)' },
          { title: 'DIN EN ISO 13788:2013-05 (Wärme- und feuchtetechnisches Verhalten von Bauteilen – Raumseitige Oberflächentemperatur zur Vermeidung kritischer Oberflächenfeuchte und Tauwasserbildung im Bauteilinneren)' },
          { title: 'DIN 4108-2 (Mindestanforderungen an den Wärmeschutz; Neuausgabe 2026-05, bisher 2013-02 – Änderungen manuell prüfen)' },
          { title: 'DIN 4108-4:2020-11 (Bemessungswerte µ und λ)' }
        ]}
        formeln={[
          {
            formel: 's_d = \\mu \\cdot d',
            erklaerung: 'Äquivalente Luftschichtdicke [m] zur Charakterisierung des Dampfdiffusionswiderstandes einer Schicht mit Dicke d und Wasserdampfdiffusionswiderstandszahl µ.',
            quelle: 'DIN 4108-3'
          },
          {
            formel: 'p_{sat}(T) \\approx 610{,}5 \\cdot e^{\\frac{17{,}269 \\cdot T}{237{,}3 + T}} \\; (T \\ge 0), \\quad 610{,}5 \\cdot e^{\\frac{21{,}875 \\cdot T}{265{,}5 + T}} \\; (T < 0)',
            erklaerung: 'Sättigungsdampfdruck [Pa] von Wasserdampf über Wasser (T ≥ 0 °C) bzw. über Eis (T < 0 °C) in Abhängigkeit von der Temperatur T in °C nach der Magnus-Formel.',
            quelle: 'DIN 4108-3:2024-03; DIN EN ISO 13788:2013-05'
          }
        ]}
      />
    </div>
  );
}
