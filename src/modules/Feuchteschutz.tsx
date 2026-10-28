import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import { psat, taupunkt, temperaturBeiPsat } from '@/src/calc/waermeschutz';
import { glaser, TAUPERIODE_DIN_4108_3, verdunstungDin4108_3 } from '@/src/calc/glaser';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import React, { useState, useMemo } from 'react';
import { 
  Droplets, Thermometer, Wind, Beaker, Plus, Trash2, 
  ArrowUp, ArrowDown, ShieldAlert, Sparkles, AlertTriangle, CheckCircle, HelpCircle 
} from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { BlockMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { NachErstemBild } from '@/src/components/ui/NachErstemBild';
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
import inhalt from '@/content/feuchteschutz/Feuchteschutz.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

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
  { id: 'gipskarton', name: inhalt.werte.gipskartonplatteGkb, mu: 10, defaultD: 0.0125, lambda: 0.25 },
  { id: 'innenputz_gips', name: 'Gips-Innenputz', mu: 10, defaultD: 0.015, lambda: 0.35 },
  { id: 'kalksandstein', name: 'Kalksandstein-Mauerwerk', mu: 15, defaultD: 0.175, lambda: 0.99 },
  { id: 'ziegel_hochloch', name: 'Hochlochziegel-Mauerwerk', mu: 5, defaultD: 0.24, lambda: 0.42 },
  inhalt.daten["MAT_LIBRARY.beton_arm"],
  { id: 'porenbeton', name: 'Porenbeton-Planstein', mu: 10, defaultD: 0.305, lambda: 0.11 },
  { id: 'mineralwolle', name: inhalt.werte.mineralwolleMwDämmung, mu: 1, defaultD: 0.16, lambda: 0.035 },
  inhalt.daten["MAT_LIBRARY.eps"],
  { id: 'holz', name: inhalt.werte.nadelholzQuer, mu: 40, defaultD: 0.024, lambda: 0.13 },
  { id: 'dampfbremse_var', name: inhalt.werte.feuchtevariableDampfbremsbahn, mu: 15000, defaultD: 0.0002, lambda: 0.20 },
  { id: 'pe_folie', name: inhalt.werte.dampfsperrePeFolie, mu: 100000, defaultD: 0.0002, lambda: 0.50 },
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
  const [tauperiodeTage, setTauperiodeTage] = useState<number>(90); // Dauer der Tauperiode (Lehrvariante)
  // Glaser-Klima: Normklima DIN 4108-3 oder Innenklima aus den Reglern (Lehrvariante); Bauteilart für die Verdunstung
  const [glaserKlima, setGlaserKlima] = useState<'norm' | 'regler'>('norm');
  const [glaserBauteil, setGlaserBauteil] = useState<'wand' | 'dach'>('wand');

  // Layers state for the s_d sandbox
  const [layers, setLayers] = useState([
    { id: 'l1', matId: 'innenputz_gips', d: 0.015 },
    { id: 'l2', matId: 'ziegel_hochloch', d: 0.24 },
    { id: 'l3', matId: 'eps', d: 0.16 },
    { id: 'l4', matId: 'aussenputz_zement', d: 0.02 }
  ]);

  // Helper functions for thermodynamic physics (Magnus-Formula)
  const calcPsat = psat; // DIN 4108-3 (Magnus), Rechenkern src/calc/waermeschutz.ts


  const calcAbsoluteHumidity = (temp: number, relHum: number): number => {
    // Absolute moisture g/m³ using ideal gas law of vapor
    const p_sat = calcPsat(temp);
    const p = p_sat * (relHum / 100.0);
    // Rv (Vapor gas constant) = 461.5 J/(kg K)
    // Absolute moisture = p / (Rv * T) * 1000 g/kg
    const T_kelvin = temp + 273.15;
    return (p / (461.5 * T_kelvin)) * 1000;
  };

  const calcDewPoint = taupunkt;


  // Calculations for static climates
  const indoorClimate = useMemo(() => {
    const psat = calcPsat(Ti);
    const p_act = psat * (phiI / 100);
    const absHum = calcAbsoluteHumidity(Ti, phiI);
    const dewPoint = calcDewPoint(Ti, phiI);
    
    // Mold critical temperature (where humidity reaches 80% on surfaces)
    // T_schimmel -> p_act / p_sat(T_schimmel) = 0.8 => p_sat(T_schimmel) = p_act / 0.8
    const p_schimmel_limit = p_act / 0.8;
    const schimmelPoint = p_schimmel_limit > 0 ? temperaturBeiPsat(p_schimmel_limit) : 0;

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
    let text = inhalt.werte.hygienischEinwandfreierBereichKeine;

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
          label: inhalt.werte.sättigungsdampfdruckPsatTPa,
          data: psatValues,
          borderColor: '#3b82f6', // custom blue
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          borderWidth: 2,
          pointRadius: 1,
          tension: 0.3,
          fill: true,
        },
        {
          label: inhalt.werte.istDampfdruckPInnen,
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

    // Glaser-Verfahren aus dem Rechenkern src/calc/glaser.ts – die einzige Implementierung der Plattform (AP 4.9)
    const tauKlima = glaserKlima === 'norm'
      ? TAUPERIODE_DIN_4108_3
      : { ...TAUPERIODE_DIN_4108_3, thetaI: Ti, phiI, thetaE: Te, phiE, stunden: tauperiodeTage * 24 };
    const g = glaser(
      computed.map(l => {
        const mat = MAT_LIBRARY.find(m => m.id === l.matId) || MAT_LIBRARY[0];
        return { name: mat.name, d: l.d, lambda: mat.lambda, mu: mat.mu };
      }),
      tauKlima,
      verdunstungDin4108_3(glaserBauteil),
    );
    const hasGlaserTauwasser = g.tauwasser;

    return { computed, totalSd, isInnerTighter, hasGlaserTauwasser, glaser: g };
  }, [layers, Ti, Te, phiI, phiE, tauperiodeTage, glaserKlima, glaserBauteil]);

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

  const updateLayer = (index: number, key: 'matId' | 'd', value: string) => {
    const updated = [...layers];
    if (key === 'matId') {
      const mat = MAT_LIBRARY.find(m => m.id === value) || MAT_LIBRARY[0];
      updated[index] = { ...updated[index], matId: value, d: mat.defaultD };
    } else {
      updated[index] = { ...updated[index], d: parseFloat(value) || 0 };
    }
    setLayers(updated);
  };

  // Live-Rechenweg (AP 3.7): Magnus-Koeffizienten wie im Rechenkern (über Eis für θ < 0 °C bzw. p < 610,5 Pa)
  const tex = (x: number, n: number) => formatDeTeX(x, n);
  const magnusTeX = (theta: number) => {
    const [a, b] = theta < 0 ? [21.875, 265.5] : [17.269, 237.3];
    return `610{,}5 \\cdot \\exp\\left(\\frac{${tex(a, 3)} \\cdot ${tex(theta, 1)}}{${tex(b, 1)} + ${tex(theta, 1)}}\\right)`;
  };
  const taupunktTeX = (p: number) => {
    const [a, b] = p < 610.5 ? [21.875, 265.5] : [17.269, 237.3];
    const l = Math.log(p / 610.5);
    return `\\frac{${tex(b, 1)} \\cdot ${tex(l, 4)}}{${tex(a, 3)} - ${tex(l, 4)}}`;
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Introduction */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Droplets className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.feuchteschutzWasserdampfTaupunkt} /></h2>
            <p className="text-xs text-text-main/50 font-mono mt-1"><MdText text={inhalt.texte.berechnungsverfahrenNachDin4108} /></p>
          </div>
          <span className="hidden md:inline-flex items-center gap-1 bg-shiraz/10 text-shiraz px-2.5 py-1 rounded-full text-xs font-bold border border-shiraz/20">
            <Sparkles size={12} /> Interaktiv
          </span>
        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p><MdText text={inhalt.texte.feuchtigkeitImBauwerkFührt} /></p>
        </div>
      </div>

      {/* Main Grid: Climate vs Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Interaktiver Berechner (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <Thermometer size={14} className="text-orange-800" /><MdText text={inhalt.texte.raumklimaBauteiloberfläche} /></h4>

            {/* Inputs: T_i and phi_i */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700"><MdText text={inhalt.texte.innenLufttemperaturTI} /></label>
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
                  <label className="text-xs font-bold text-slate-700"><MdText text={inhalt.texte.relRaumluftfeuchteI} /></label>
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
                  <label className="text-xs font-black text-orange-900 flex items-center gap-1"><MdText text={inhalt.texte.bauteilOberflächeTSi} /></label>
                  <span className="text-xs font-mono font-bold text-rose-800 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">{formatDeZahl(Tsi, 1)} °C</span>
                </div>
                <input 
                  type="range" min="-5" max="25" step="0.5"
                  value={Tsi} 
                  onChange={(e) => setTsi(parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 mt-1 italic"><MdText text={inhalt.texte.temperaturDerWandinnenseiteSimuliert} /></p>
              </div>
            </div>

            {/* Results Table */}
            <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400"><MdText text={inhalt.texte.berechneteWerteInnenklima} /></div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-150">
                  <span className="text-slate-400 text-[10px] block font-bold"><MdText text={inhalt.texte.sättigungsdruckPSat} /></span>
                  <span className="font-mono font-bold text-slate-800 text-[13px]">{formatDeZahl(indoorClimate.psat, 1)} Pa</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-150">
                  <span className="text-slate-400 text-[10px] block font-bold"><MdText text={inhalt.texte.istTeildruckP} /></span>
                  <span className="font-mono font-bold text-slate-800 text-[13px]">{formatDeZahl(indoorClimate.p_act, 1)} Pa</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-150">
                  <span className="text-slate-400 text-[10px] block font-bold"><MdText text={inhalt.texte.absoluteLuftfeuchte} /></span>
                  <span className="font-mono font-bold text-slate-800 text-[13px]">{formatDeZahl(indoorClimate.absHum, 2)} g/m³</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-150 focus-within:ring-2">
                  <span className="text-blue-500 text-[10px] block font-extrabold"><MdText text={inhalt.texte.taupunktTDp100} /></span>
                  <span className="font-mono font-black text-blue-600 text-[13px]">{formatDeZahl(indoorClimate.dewPoint, 1)} °C</span>
                </div>
              </div>

              {/* Mold Limit Temperature indicator (80% boundary block) */}
              <div className="p-2.5 bg-yellow-50/50 border border-yellow-100 rounded-lg text-[10.5px]">
                <div className="flex justify-between items-center text-yellow-800 font-bold mb-1">
                  <span><MdText text={inhalt.texte.schimmelgrenzeTSchimmel80} /></span>
                  <span className="font-mono">{formatDeZahl(indoorClimate.schimmelPoint, 1)} °C</span>
                </div>
                <p className="text-slate-500 leading-relaxed text-[9.5px]"><MdText text={inhalt.texte.fälltDieWandoberflächeUnter} /></p>
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
                {surfaceAuditStatus.level === 'danger' && inhalt.werte.kritischerRezessTaukondensat}
                {surfaceAuditStatus.level === 'warning' && inhalt.werte.vorsichtBiologischesSchimmelrisiko}
                {surfaceAuditStatus.level === 'safe' && inhalt.werte.auditOberflächeOptimal}
              </h5>
              <p className="font-medium text-[11px]">{surfaceAuditStatus.text}</p>
              <div className="mt-2 text-[10px] font-mono font-bold text-slate-500 border-t border-slate-200/50 pt-1 flex justify-between">
                <span><MdText text={inhalt.texte.relOberflächenfeuchte} /></span>
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

          {/* Live-Rechenweg (AP 3.7) mit dem aktuellen Innenklima */}
          <FormulaDerivationBox
            live
            title={inhalt.werte.ihrRechenwegTaupunktUnd}
            zielGleichung="\varphi_{si} = \frac{\varphi_i \cdot p_{sat}(\theta_i)}{p_{sat}(\theta_{si})}"
            schritte={[
              {
                titel: inhalt.werte.sättigungsdampfdruckDerRaumluft,
                erklaerung: `Magnus-Formel nach DIN 4108-3 für θ_i = ${formatDeZahl(Ti, 1)} °C:`,
                formel: `p_{sat}(\\theta_i) = ${magnusTeX(Ti)} = ${tex(indoorClimate.psat, 1)}\\,\\text{Pa}`
              },
              {
                titel: inhalt.werte.vorhandenerWasserdampfteildruck,
                erklaerung: `Relative Feuchte φ_i = ${formatDeZahl(phiI, 0)} % mal Sättigungsdruck:`,
                formel: `p = ${tex(phiI / 100, 2)} \\cdot ${tex(indoorClimate.psat, 1)} = ${tex(indoorClimate.p_act, 1)}\\,\\text{Pa}`
              },
              {
                titel: 'Taupunkttemperatur',
                erklaerung: inhalt.werte.umkehrungDerMagnusFormel,
                formel: `\\theta_s = ${taupunktTeX(indoorClimate.p_act)} = ${tex(indoorClimate.dewPoint, 1)}\\,^{\\circ}\\text{C}`
              },
              {
                titel: inhalt.werte.schimmelgrenze80RF,
                erklaerung: inhalt.werte.gesuchtIstDieTemperatur,
                formel: `p_{sat} = \\frac{${tex(indoorClimate.p_act, 1)}}{0{,}8} = ${tex(indoorClimate.p_act / 0.8, 1)}\\,\\text{Pa} \\;\\Rightarrow\\; \\theta_{80} = ${tex(indoorClimate.schimmelPoint, 1)}\\,^{\\circ}\\text{C}`
              },
              {
                titel: inhalt.werte.relativeFeuchteAnDer,
                erklaerung: `An der ${formatDeZahl(Tsi, 1)} °C kalten Oberfläche ist der Sättigungsdruck kleiner, die relative Feuchte steigt:`,
                formel: `\\varphi_{si} = \\frac{${tex(indoorClimate.p_act, 1)}}{${tex(calcPsat(Tsi), 1)}} = ${tex(surfaceAuditStatus.actualSurfaceRH, 0)}\\,\\%`
              }
            ]}
            ergebnisHinweis={inhalt.werte.liegtSiDauerhaftÜber}
            normQuelle={inhalt.werte.din410832024}
          />
        </div>

        {/* Right Side: Visual Graph & Physics (7 Cols) */}
        <NachErstemBild minHoehe="30rem">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 border-b border-slate-100 pb-2.5 mb-4 flex items-center justify-between">
              <span><MdText text={inhalt.texte.magnusSättigungskurveDampfdruck} /></span>
              <span className="text-[10px] text-slate-400 font-mono tracking-normal capitalize"><MdText text={inhalt.texte.zustandVsSättigungsdruck} /></span>
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
                      title: { display: true, text: inhalt.werte.temperaturTC, font: { size: 10, weight: 'bold' } },
                      grid: { display: false },
                      ticks: { font: { size: 9, weight: 'bold' }, color: '#64748b' }
                    },
                    y: {
                      title: { display: true, text: inhalt.werte.wasserdampfpartialdruckPPa, font: { size: 10, weight: 'bold' } },
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
                  <Wind size={12} className="text-blue-500" /><MdText text={inhalt.texte.wasZeigtDieseKurve} /></p>
                <p className="leading-relaxed text-[11px]"><MdText text={inhalt.texte.dieBlaueBegrenzungslinieStellt} /></p>
              </div>
              <div>
                <p className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <HelpCircle size={12} className="text-emerald-600" /><MdText text={inhalt.texte.wasIstDerTaupunkt} /></p>
                <p className="leading-relaxed text-[11px]"><MdText text={inhalt.texte.dieGrüneGestrichelteLinie} /></p>
              </div>
            </div>
          </div>
        </div>
        </NachErstemBild>
      </div>

      {/* Chapter 2: s_d-Value Multi-Layer Sandbox ("Innen dichter als außen") */}
      {/* Abschnitte unterhalb des Bildausschnitts erst nach dem ersten Bild (Ladezeit, AP 5.5) */}
      <NachErstemBild minHoehe="50rem">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-150 pb-4 mb-5 gap-3">
          <div>
            <h4 className="text-md font-extrabold text-slate-800 flex items-center gap-2">
              <Beaker className="text-blue-600" size={18} /><MdText text={inhalt.texte.sDWertSandbox} /></h4>
            <p className="text-xs text-slate-500 mt-1"><MdText text={inhalt.texte.testenSieIhreKonstruktion} /></p>
          </div>
          
          <button 
            onClick={addLayer}
            className="px-3 py-1.5 bg-shiraz hover:bg-shiraz/90 text-white rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer shadow-sm uppercase tracking-wider"
          >
            <Plus size={14} /><MdText text={inhalt.texte.neueSchichtHinzufügen} /></button>
        </div>

        {/* Sandbox Content Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Layer Configurator Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center text-[10px] font-black uppercase text-slate-400 px-3">
              <span className="w-10">Reihen.</span>
              <span className="flex-1 pl-4"><MdText text={inhalt.texte.zuständigerBaustoff} /></span>
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
                      aria-label={inhalt.werte.schichtNachObenVerschieben}
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button 
                      onClick={() => moveLayer(index, 'down')} 
                      disabled={index === layers.length - 1}
                      className="hover:text-orange-800 disabled:opacity-25 cursor-pointer"
                      aria-label={inhalt.werte.schichtNachUntenVerschieben}
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
                        aria-label={`Baustoff der Schicht ${index + 1}`}
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
                        aria-label={`Dicke der Schicht ${index + 1} in m`}
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
                    aria-label={inhalt.werte.schichtEntfernen}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-3 px-4 text-xs font-bold text-slate-600 mt-2">
              <span className="uppercase tracking-wide text-slate-400 font-black text-[10px]"><MdText text={inhalt.texte.laufrichtungDerSchichten} /></span>
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
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1"><MdText text={inhalt.texte.diffusionstechnischeAuswertung} /></span>
              
              <div className="flex justify-between items-baseline select-all">
                <span className="text-xs text-slate-600 font-bold"><MdText text={inhalt.texte.äquivalenteGesamtluftdickeSD} /></span>
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
                  <h6 className="font-extrabold uppercase tracking-wide text-[9.5px] text-slate-400"><MdText text={inhalt.texte.regelCheckInnenDichter} /></h6>
                  <p className="font-medium mt-1">
                    {layerCalculations.isInnerTighter && !layerCalculations.hasGlaserTauwasser
                      ? inhalt.werte.konstruktionGünstigDieInnenseitigen
                      : layerCalculations.isInnerTighter
                        ? inhalt.werte.innenDichterAlsAußen
                      : layerCalculations.hasGlaserTauwasser
                        ? inhalt.werte.kritischerKonstruktionsfehlerDieÄußeren
                        : inhalt.werte.außenDiffusionsdichterAlsInnen
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Physic equations with LaTeX rendering */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
              <h5 className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400"><MdText text={inhalt.texte.diePhysikalischenGrundlagen} /></h5>
              
              <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
                <div>
                  <span className="font-bold text-slate-800"><MdText text={inhalt.texte.t1ÄquivalenteLuftschichtdicke} /></span>
                  <div className="my-1.5 p-1 bg-white border border-slate-100 rounded text-center">
                    <FormulaText text="s_d = \mu \cdot d" />
                  </div>
                  <p className="text-[10px] text-slate-500"><MdText text={inhalt.texte.beschreibtWieVielDicker} /></p>
                </div>

                <div>
                  <span className="font-bold text-slate-800"><MdText text={inhalt.texte.t2DampfdruckMagnusgleichungÜber} /></span>
                  <div className="my-1.5 p-1 bg-white border border-slate-100 rounded text-center overflow-x-auto text-xs">
                    <BlockMath math="p_{\text{sat}}(T) \approx 610{,}5 \cdot \exp\left( \frac{17{,}269 \cdot T}{237{,}3 + T} \right)" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      </NachErstemBild>
      
      {/* GLASER-DIAGRAMM & TAUWASSERBILANZ – Rechenkern src/calc/glaser.ts (AP 4.9) */}
      <NachErstemBild minHoehe="40rem">
      {(() => {
        const g = layerCalculations.glaser;
        const namen = layerCalculations.computed.map(l => l.name);
        const kg = (x: number) => `${formatDeZahl(x, 3)} kg/m²`;
        const umschalter = (aktiv: boolean) => `px-3 py-1.5 rounded-lg text-[11px] font-bold border ${aktiv ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-600 border-slate-200'}`;
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5" id="glaser-diagramm">
            <div>
              <h4 className="text-md font-extrabold text-slate-800 flex items-center gap-2">
                <Droplets className="text-shiraz" size={18} /><MdText text={inhalt.texte.glaserDiagrammTauwasserbilanzDin} /></h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed"><MdText text={inhalt.texte.schichtaufbauAusDerS} /></p>
            </div>

            <div className="flex flex-wrap gap-4 items-center text-xs">
              <AuswahlGruppe aria-label={inhalt.werte.glaserKlimaWahl} className="flex gap-1.5">
                <button type="button" {...alsOption(glaserKlima === 'norm')} className={umschalter(glaserKlima === 'norm')} onClick={() => setGlaserKlima('norm')}>{inhalt.werte.glaserKlimaNorm}</button>
                <button type="button" {...alsOption(glaserKlima === 'regler')} className={umschalter(glaserKlima === 'regler')} onClick={() => setGlaserKlima('regler')}>{inhalt.werte.glaserKlimaRegler}</button>
              </AuswahlGruppe>
              <AuswahlGruppe aria-label={inhalt.werte.glaserBauteilWahl} className="flex gap-1.5">
                <button type="button" {...alsOption(glaserBauteil === 'wand')} className={umschalter(glaserBauteil === 'wand')} onClick={() => setGlaserBauteil('wand')}>{inhalt.werte.glaserBauteilWand}</button>
                <button type="button" {...alsOption(glaserBauteil === 'dach')} className={umschalter(glaserBauteil === 'dach')} onClick={() => setGlaserBauteil('dach')}>{inhalt.werte.glaserBauteilDach}</button>
              </AuswahlGruppe>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <div className="h-[280px] w-full relative">
                  {g.gueltig && (
                  <Line
                    data={{
                      datasets: [
                        { label: inhalt.werte.sättigungsdampfdruckPSatPa, data: g.verlauf.sd.map((x, i) => ({ x, y: g.verlauf.psat[i] })), borderColor: '#A3113E', borderDash: [4, 4], borderWidth: 2, pointRadius: 0, fill: false, tension: 0 },
                        { label: inhalt.werte.partialdampfdruckPPa, data: g.verlauf.sd.map((x, i) => ({ x, y: g.verlauf.p[i] })), borderColor: '#475569', backgroundColor: 'rgba(59, 130, 246, 0.07)', fill: true, borderWidth: 3, pointRadius: 0, tension: 0 },
                        { label: inhalt.werte.schichtgrenzen, data: g.grenzen.sd.map((x, i) => ({ x, y: g.grenzen.psat[i] })), borderColor: '#A3113E', backgroundColor: '#A3113E', showLine: false, pointRadius: 3, fill: false },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { type: 'linear', min: 0, max: g.sdGes, title: { display: true, text: inhalt.werte.diffusionsäquivalenteLuftschichtdickeSD, font: { size: 10, weight: 'bold' } } },
                        y: { min: 0, title: { display: true, text: inhalt.werte.dampfdruckPa, font: { size: 10, weight: 'bold' } } },
                      },
                      plugins: { legend: { labels: { font: { size: 11, weight: 'bold' } } } },
                    }}
                  />
                  )}
                </div>
                {glaserKlima === 'regler' ? (
                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                    <span><MdText text={inhalt.texte.dauerDerTauperiode} /></span>
                    <span className="text-shiraz font-mono">{formatDeWert(tauperiodeTage)} Tage ({formatDeWert(tauperiodeTage * 24)} h)</span>
                  </div>
                  <input
                    type="range" min="30" max="150" step="5" value={tauperiodeTage}
                    aria-label={inhalt.werte.dauerDerTauperiodeIn}
                    onChange={(e) => setTauperiodeTage(Number(e.target.value))}
                    className="w-full accent-shiraz h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400 mt-1"><MdText text={inhalt.texte.glaserLehrvarianteHinweis} /></p>
                </div>
                ) : (
                  <p className="mt-3 text-[10px] text-slate-400 leading-relaxed"><MdText text={inhalt.texte.klassischesGlaserKlima90} /></p>
                )}
              </div>

              <div className="lg:col-span-5 space-y-3">
                <EingabeHinweise hinweise={g.hinweise} />
                {!g.gueltig ? null : !g.tauwasser ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                    <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                    <div className="text-xs text-emerald-900 leading-relaxed">
                      <h5 className="font-extrabold text-sm text-emerald-800"><MdText text={inhalt.texte.keinTauwasserInDer} /></h5><MdText text={inhalt.texte.anKeinerSchichtgrenzeErreicht} /><FormulaText text="p < p_{sat}" /><MdText text={inhalt.texte.rechnerischeTauwassermasse0G} /></div>
                  </div>
                ) : (
                  <>
                    {g.zonen.map((z, k) => (
                      <div key={k} className="p-4 bg-slate-50 border border-slate-300 rounded-xl flex items-start gap-3">
                        <Droplets className="text-slate-600 shrink-0 mt-0.5" size={18} />
                        <div className="text-xs text-slate-800 leading-relaxed">
                          {z.art === 'ebene' && z.grenzeVon > 0 ? (
                            <>
                              <h5 className="font-extrabold text-sm text-slate-900"><MdText text={inhalt.texte.tauwasserAnGrenzfläche} />{formatDeWert(z.grenzeVon)}</h5>
                              <MdText text={inhalt.texte.tauwasserebeneHinterDerSchicht} /><strong>„{namen[z.grenzeVon - 1]}“</strong><MdText text={inhalt.texte.dortIstPGleich} />
                            </>
                          ) : (
                            <>
                              <h5 className="font-extrabold text-sm text-slate-900">{z.art === 'bereich' ? inhalt.werte.tauwasserbereich : inhalt.werte.tauwasserebene}: s_d = {formatDeZahl(z.sdVon, 3)} … {formatDeZahl(z.sdBis, 3)} m</h5>
                              <span>{inhalt.werte.inDerSchicht} <strong>„{namen[z.schichtVon]}“</strong>{z.schichtBis !== z.schichtVon && <> {inhalt.werte.bis} <strong>„{namen[z.schichtBis]}“</strong></>}. {inhalt.werte.tauwasserbereichText}</span>
                            </>
                          )}
                          <div className="mt-1 font-mono text-[11px]">M_c = {kg(z.mc)}</div>
                        </div>
                      </div>
                    ))}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="text-[9.5px] text-slate-500 font-bold uppercase"><MdText text={inhalt.texte.tauwasserMC} /></div>
                        <div className="text-base font-black text-slate-800 font-mono mt-0.5">{formatDeZahl(g.mc, 3)} <span className="text-[10px]">kg/m²</span></div>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="text-[9.5px] text-slate-500 font-bold uppercase"><MdText text={inhalt.texte.verdunstungMEv} /></div>
                        <div className="text-base font-black text-slate-800 font-mono mt-0.5">{formatDeZahl(g.mev, 3)} <span className="text-[10px]">kg/m²</span></div>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="text-[9.5px] text-slate-500 font-bold uppercase">{inhalt.werte.trocknungsdauer}</div>
                        <div className="text-base font-black text-slate-800 font-mono mt-0.5">{Number.isFinite(g.trocknungsTage) ? `${formatDeZahl(g.trocknungsTage, 1)} d` : '–'}</div>
                      </div>
                    </div>
                    <ul className="text-[11px] text-slate-700 leading-relaxed space-y-1" aria-label={inhalt.werte.kriterienDin4108}>
                      {g.kriterien.map((kr, k) => (
                        <li key={k} className="flex items-start gap-1.5">
                          {kr.eingehalten ? <CheckCircle size={13} className="text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" /> : <AlertTriangle size={13} className="text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />}
                          <span>{kr.text}: <strong>{kr.eingehalten ? inhalt.werte.kriteriumEingehalten : inhalt.werte.kriteriumNichtEingehalten}</strong></span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {g.kriterien.every(kr => kr.eingehalten)
                        ? inhalt.werte.grundkriterienNachDin4108
                        : inhalt.werte.dasBauteilTrocknetIn}
                    </p>
                  </>
                )}
                {g.gueltig && (
                <div className="text-[11px] text-slate-500 bg-off-white border border-home-grau/30 rounded-xl p-3 leading-relaxed">
                  U = {formatDeZahl(g.U, 3)}<MdText text={inhalt.texte.wMKS} />{formatDeZahl(g.sdGes, 2)} m · p_i = {formatDeZahl(g.pi, 0)} Pa · p_e = {formatDeZahl(g.pe, 0)} Pa
                </div>
                )}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed"><MdText text={inhalt.texte.vereinfachtesLehrmodellMitEiner} /></p>
          </div>
        );
      })()}
      </NachErstemBild>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <NachErstemBild minHoehe="20rem">
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1TaupunktUnd}
        zielGleichung="\theta_{d} = \frac{237{,}3 \cdot \ln(p/610{,}5)}{17{,}269 - \ln(p/610{,}5)}"
        schritte={inhalt.daten["Feuchteschutz.schritte"]}
        ergebnisHinweis={inhalt.werte.schimmelDrohtDeutlichOberhalb}
        normQuelle={inhalt.werte.din4108320242}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2SD}
        zielGleichung="s_d = \mu \cdot d"
        schritte={inhalt.daten["Feuchteschutz.schritte_2"]}
        ergebnisHinweis={inhalt.werte.dieFaustregelGiltVor}
        normQuelle={inhalt.werte.bemessungswerteNachDin4108}
      />
      </NachErstemBild>

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="feuchteschutz" />

      {/* Footer-Integration mit normenbezogenen Vorgaben */}
      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap6}
        wikipedia={[
          { title: 'Feuchteschutz', url: 'https://de.wikipedia.org/wiki/Feuchteschutz' },
          { title: 'Wasserdampfdiffusionswiderstand', url: 'https://de.wikipedia.org/wiki/Wasserdampfdiffusionswiderstand' },
          { title: 'Glaser-Verfahren', url: 'https://de.wikipedia.org/wiki/Glaser-Verfahren' }
        ]}
        literatur={inhalt.daten["Feuchteschutz.literatur"]}
        regelwerke={inhalt.daten["Feuchteschutz.regelwerke"]}
        formeln={inhalt.daten["Feuchteschutz.formeln"]}
      />
    </div>
  );
}
