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
import inhalt from '@/content/praxisbeispiele/Praxisbeispiele.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Praxisbeispiele() {
  const [thickness, setThickness] = useState(1.5);
  const [cementType, setCementType] = useState(inhalt.werte.cemI425);
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
      // DIN EN 1992-1-1, 3.1.3: E_cm(t) = (f_cm(t)/f_cm)^0,3 · E_cm = β_cc(t)^0,3 · E_cm
      const E_c = t > 0 ? 30000 * Math.pow(Math.exp(s * (1 - Math.sqrt(28 / t))), 0.3) : 0;

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
            label: inhalt.werte.kerntemperaturC,
            data: tempCurve,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0
          },
          {
            label: inhalt.werte.umgebungstemperaturC,
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
            label: inhalt.werte.zwangspannungMpa,
            data: stressCurve,
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0
          },
          {
            label: inhalt.werte.zugfestigkeitFCtmT,
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
          <h2 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.zwangRissbreiteBeiMassigen} /></h2>
      

        </div>

        <div className="text-sm text-text-main/80 bg-blue-50 border-blue-200 p-5 rounded-xl border my-4">
          <h3 className="text-base font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Info size={20} /><MdText text={inhalt.texte.einfacheErklärungDerPhänomene} /></h3>
          <p className="mb-4"><MdText text={inhalt.texte.beimBetonierenMassigerBauteile} /></p>
          <ul className="list-disc pl-5 space-y-3">
            <li><MdText text={inhalt.texte.wärmeflussHydratationZementReagiert} /></li>
            <li><MdText text={inhalt.texte.verformungsbehinderungZwangWennDas} /></li>
            <li><MdText text={inhalt.texte.schwindartenBetonZiehtSich} /></li>
            <li><MdText text={inhalt.texte.festigkeitsentwicklungJungerBetonIst} /></li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4"><MdText text={inhalt.texte.bauteilZwang} /></h3>
              <Slider info={inhalt.werte.dickeDesBauteils} label={<FormulaText text={inhalt.werte.bauteildickeH} />} min={0.5} max={3.0} step={0.1} value={thickness} unit="m" onChange={(e) => setThickness(Number(e.target.value))} />
              <div className="mt-4">
                <Slider  label={<FormulaText text={inhalt.werte.behinderungsgradR} />} min={0} max={1.0} step={0.1} value={restraint} unit="-" onChange={(e) => setRestraint(Number(e.target.value))} />
                <p className="text-xs text-home-grau mt-1"><MdText text={inhalt.texte.r0FreiBeweglich} /></p>
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Betonrezeptur</h3>
              <div className="flex items-center gap-2"><label className="text-xs font-bold text-home-grau uppercase tracking-wider mb-1 block">Zementart</label><InfoTooltip text={inhalt.werte.artDesVerwendetenZements} /></div>
              <select aria-label="Zementart" 
                value={cementType}
                onChange={(e) => setCementType(e.target.value)}
                className="w-full p-2 text-sm border border-home-grau/30 rounded-lg focus:outline-none focus:border-shiraz bg-white mb-4"
              >
                <option value="CEM I 42.5 R">CEM I 42.5 R (Schnell, hohe Wärme)</option>
                <option value="CEM II/A-LL 32.5 R">CEM II/A-LL 32.5 R (Mittel)</option>
                <option value="CEM III/B 32.5 N">CEM III/B 32.5 N (Langsam, niedrige Wärme)</option>
              </select>
              <Slider label="Zementgehalt" info={inhalt.werte.mengeDesZementsPro} min={250} max={450} step={10} value={cementContent} unit="kg/m³" onChange={(e) => setCementContent(Number(e.target.value))} />
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Temperaturen</h3>
              <Slider label="Frischbetontemperatur"  min={5} max={30} step={1} value={tFresh} unit="°C" onChange={(e) => setTFresh(Number(e.target.value))} />
              <div className="mt-4">
                <Slider label="Umgebungstemperatur" info={inhalt.werte.temperaturDerUmgebung} min={-5} max={35} step={1} value={tAmbient} unit="°C" onChange={(e) => setTAmbient(Number(e.target.value))} />
              </div>
            </div>
          </div>

          {/* Results & Charts */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                <div className="text-xs text-home-grau uppercase tracking-wider mb-1"><MdText text={inhalt.texte.maxKerntemperatur} /></div>
                <div className="text-2xl font-bold text-shiraz">{formatDeZahl(results.T_max, 1)} °C</div>
                <div className="text-xs text-text-main/60 mt-1">ΔT = {formatDeZahl((results.T_max - tAmbient), 1)}<MdText text={inhalt.texte.kZurUmgebung} /></div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                <div className="text-xs text-home-grau uppercase tracking-wider mb-1"><MdText text={inhalt.texte.maxZwangspannung} /></div>
                <div className="text-2xl font-bold text-fuchsia-600">{formatDeZahl(results.maxStress, 2)} MPa</div>
                <div className="text-xs text-text-main/60 mt-1"><MdText text={inhalt.texte.trittInDerAbkühlphase} /></div>
              </div>
              <div className={`p-4 rounded-xl border shadow-sm text-white ${results.crackRisk ? 'bg-red-500 border-red-600' : 'bg-emerald-500 border-emerald-600'}`}>
                <div className="text-xs uppercase tracking-wider mb-1 opacity-90"><MdText text={inhalt.texte.rissrisikoTrennrisse} /></div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {results.crackRisk ? <><AlertTriangle size={24} /> Sehr Hoch</> : <><CheckCircle2 size={24} /> Gering</>}
                </div>
                <div className="text-xs opacity-90 mt-1">
                  {results.crackRisk ? inhalt.werte.spannungZugfestigkeit : inhalt.werte.spannungZugfestigkeit2}
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm h-[300px]">
              <h3 className="text-sm font-bold text-text-main mb-4"><MdText text={inhalt.texte.temperaturverlaufKern} /></h3>
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
                      y: { title: { display: true, text: inhalt.werte.temperaturC } }
                    }
                  }} 
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm h-[300px]">
              <h3 className="text-sm font-bold text-text-main mb-4"><MdText text={inhalt.texte.spannungsentwicklungVsFestigkeit} /></h3>
              <div className="relative w-full h-[220px]">
                <Line 
                  data={results.stressChartData} 
                  options={inhalt.daten["Praxisbeispiele.options"]} 
                />
              </div>
            </div>

            {results.crackRisk && (
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                  <AlertTriangle size={18} /><MdText text={inhalt.texte.maßnahmenZurRissvermeidung} /></h4>
                <ul className="list-disc list-inside text-sm text-orange-900 ml-4 space-y-1">
                  <li><MdText text={inhalt.texte.verwendungEinesZementsMit} /></li>
                  <li><MdText text={inhalt.texte.reduzierungDesZementgehaltsSofern} /></li>
                  <li><MdText text={inhalt.texte.absenkungDerFrischbetontemperaturZ} /></li>
                  <li><MdText text={inhalt.texte.einbauEinerAusreichendenMindestbewehrung} />{formatDeZahl(results.As_min, 1)}<MdText text={inhalt.texte.cmMJeSeite} /></li>
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
