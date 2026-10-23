import { formatDeZahl } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { useTabContext } from '@/src/contexts/TabContext';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Box, Info } from 'lucide-react';
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

export default function Eigenspannungen() {
  // Eingebettet in Hydratation & Folgen: Quellenblock dort zentral
  const { activeTab: aktiverReiter } = useTabContext();
  const eingebettet = aktiverReiter === 'hydratation_folgen';
  const [activeTab, setActiveTab] = useState<'beton'>('beton');
  
  // Beton State
  const [tInnen, setTInnen] = useState(20); // °C
  const [tMitte, setTMitte] = useState(45); // °C
  const [tAussen, setTAussen] = useState(15); // °C
  const [eModulBeton, setEModulBeton] = useState(15000); // MPa (effektiver E-Modul im frühen Alter)
  const [thicknessBeton, setThicknessBeton] = useState(1.0); // m
  const [fCtmEarly, setFCtmEarly] = useState(1.5); // MPa (Zugfestigkeit im frühen Alter)
  const [epsilonCs, setEpsilonCs] = useState(0.0); // ‰ (Schwinddehnung am Rand)

  const betonResults = useMemo(() => {
    const labels = [];
    const stressTotalData = [];
    const stressNData = [];
    const stressMData = [];
    const stressVData = [];
    const alphaT = 10e-6; // 1/K
    
    const points = 50;
    
    // Parabolische Temperaturverteilung über den Querschnitt
    // T(x) = a*x^2 + b*x + c
    // x geht von -d/2 (innen) bis +d/2 (außen)
    const d = thicknessBeton;
    const c = tMitte;
    const b = (tAussen - tInnen) / d;
    const a = (4 / (d * d)) * ((tAussen + tInnen) / 2 - tMitte);

    // Zerlegung der Temperatur
    // T_avg = 1/d * int T(x) dx = a/12 * d^2 + c
    const tAvg = (a / 12) * d * d + c;
    
    // Schwinddehnungsprofil (parabolisch, max am Rand, 0 in der Mitte)
    // epsilon_cs(x) = epsilonCs * 1e-3 * (2x/d)^2
    
    let maxTensile = 0;
    let maxCompressive = 0;

    for (let i = 0; i <= points; i++) {
      const xRatio = (i / points) * 2 - 1; // -1 to 1 (entspricht 2x/d)
      const x = (xRatio * d) / 2;
      labels.push(`${formatDeZahl((x * 100), 0)} cm`);
      
      const tX = a * x * x + b * x + c;
      const tN = tAvg;
      const tM = b * x;
      const tV = tX - tN - tM;

      // Schwinddehnung (negativ, da Verkürzung)
      const epsCsX = -epsilonCs * 1e-3 * Math.pow(xRatio, 2);
      // Mittlere Schwinddehnung (N-Anteil)
      const epsCsN = -epsilonCs * 1e-3 * (1/3); // Integral von x^2 von -1 bis 1 ist 2/3, geteilt durch 2 ist 1/3
      
      // Eigenspannungsanteil aus Schwinden: sigma = E * (eps_total - eps_free)
      // eps_total = epsCsN (da M-Anteil aus Symmetriegründen 0 ist)
      // eps_free = epsCsX
      const epsCsV = epsCsN - epsCsX;

      // Spannungen bei voller Einspannung (Zwang)
      // sigma_total = -E * alphaT * DeltaT + E * eps_cs
      // Hier nehmen wir an, dass die Bezugstemperatur (spannungsfrei) 20°C ist.
      // Für Eigenspannungen (V) ist die Bezugstemperatur egal, da sie sich heraushebt.
      // Die Eigenspannungen (ohne äußeren Zwang) sind:
      const sigmaV = -eModulBeton * alphaT * tV + eModulBeton * epsCsV;
      
      // Wenn das Bauteil voll eingespannt ist (N und M behindert):
      // sigma_total = E * (0 - eps_free)
      const sigmaTotal = -eModulBeton * alphaT * (tX - 20) - eModulBeton * epsCsX; // Annahme: 20°C war Herstelltemperatur
      const sigmaN = -eModulBeton * alphaT * (tN - 20) - eModulBeton * epsCsN;
      const sigmaM = -eModulBeton * alphaT * tM;

      stressTotalData.push(sigmaTotal);
      stressNData.push(sigmaN);
      stressMData.push(sigmaM);
      stressVData.push(sigmaV);

      if (sigmaV > maxTensile) maxTensile = sigmaV;
      if (sigmaV < maxCompressive) maxCompressive = sigmaV;
    }

    const crackRisk = maxTensile > fCtmEarly;

    return {
      maxTensile,
      maxCompressive,
      crackRisk,
      chartData: {
        labels,
        datasets: [
          {
            label: 'Eigenspannung σ_V (MPa)',
            data: stressVData,
            borderColor: '#475569',
            backgroundColor: (context: any) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
              gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)'); // Zug (Rot)
              gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)'); // Druck (Blau)
              return gradient;
            },
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 3
          },
          {
            label: 'Zwangsnormalkraft σ_N (MPa)',
            data: stressNData,
            borderColor: '#64748b',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false
          },
          {
            label: 'Zwangsbiegemoment σ_M (MPa)',
            data: stressMData,
            borderColor: '#64748b',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false
          },
          {
            label: 'Zugfestigkeit f_ctm(t)',
            data: labels.map(() => fCtmEarly),
            borderColor: '#A3113E',
            borderDash: [2, 2],
            borderWidth: 1,
            pointRadius: 0,
            fill: false
          }
        ]
      }
    };
  }, [tInnen, tMitte, tAussen, eModulBeton, thicknessBeton, fCtmEarly, epsilonCs]);

  return (
    <div className="flex flex-col gap-8">
      

      <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'beton' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('beton')}
        >
          <Box size={16} /> Beton (Hydratation)
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
          <Box className="text-shiraz" /> Eigenspannungen (Beton)
        </h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 my-4">
            <p>
              Bei massigen Betonbauteilen entsteht durch die Hydratation des Zements Wärme. Der Kern dehnt sich aus, während die Ränder kühler bleiben. In der <strong>Aufheizphase</strong> entstehen dadurch <strong>Zugeigenspannungen an den Rändern</strong> (Gefahr von Oberflächenrissen) und Druckspannungen im Kern. In der Abkühlphase kehrt sich das Bild um; bei äußerer Behinderung drohen dann Trennrisse (siehe Reiter „Zwang &amp; Risse“).
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Inputs */}
          <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Betonparameter (Aufheizphase)</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Slider info="Temperatur an der Innenseite." label={<FormulaText text="Temperatur Innen T_{innen}" />} min={10} max={80} step={1} value={tInnen} unit="°C" onChange={(e) => setTInnen(Number(e.target.value))} />
                  <Slider  label={<FormulaText text="Temperatur Mitte T_{mitte}" />} min={10} max={90} step={1} value={tMitte} unit="°C" onChange={(e) => setTMitte(Number(e.target.value))} />
                  <Slider info="Temperatur an der Außenseite." label={<FormulaText text="Temperatur Außen T_{aussen}" />} min={-10} max={50} step={1} value={tAussen} unit="°C" onChange={(e) => setTAussen(Number(e.target.value))} />
                </div>
                <div className="mt-4 pt-4 border-t border-home-grau/30">
                  <Slider  label={<FormulaText text="Effektiver E-Modul E_{c,eff}(t)" />} min={1000} max={35000} step={1000} value={eModulBeton} unit="MPa" onChange={(e) => setEModulBeton(Number(e.target.value))} />
                  <p className="text-[10px] text-home-grau mt-1 leading-tight">Im frühen Alter (Aufheizphase) ist der E-Modul noch gering und wird durch Relaxation weiter abgemindert. Annahme: <FormulaText text="E_{c,eff} = E_c(t) / (1 + \varphi)" />.</p>
                </div>
                <div className="mt-4">
                  <Slider info="Mittlere Zugfestigkeit zum Zeitpunkt t." label={<FormulaText text="Zugfestigkeit f_{ctm}(t)" />} min={0.5} max={4.0} step={0.1} value={fCtmEarly} unit="MPa" onChange={(e) => setFCtmEarly(Number(e.target.value))} />
                </div>
                <div className="mt-4">
                  <Slider  label={<FormulaText text="Schwinddehnung (Rand) \varepsilon_{cs}" />} min={0} max={1.0} step={0.1} value={epsilonCs} unit="‰" onChange={(e) => setEpsilonCs(Number(e.target.value))} />
                  <p className="text-[10px] text-home-grau mt-1 leading-tight">Zusätzliche Eigenspannungen durch ungleichmäßiges Austrocknen (außen trockener als innen).</p>
                </div>
                <div className="mt-4">
                  <Slider label="Bauteildicke d" info="Dicke des Bauteils." min={0.5} max={3.0} step={0.1} value={thicknessBeton} unit="m" onChange={(e) => setThicknessBeton(Number(e.target.value))} />
                </div>
                <p className="text-xs text-home-grau mt-3">
                  Die Temperaturverteilung wird in einen konstanten Anteil (N), einen linearen Anteil (M) und einen nichtlinearen Anteil (V = Eigenspannungen) zerlegt.
                </p>
              </div>
          </div>

          {/* Charts & Results */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                    <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Max. Zugeigenspannung (Rand)</div>
                    <div className={`text-2xl font-bold ${betonResults.crackRisk ? 'text-red-600' : 'text-emerald-600'}`}>+{formatDeZahl(betonResults.maxTensile, 1)} MPa</div>
                    <div className="text-xs text-text-main/60 mt-1">
                      {betonResults.crackRisk ? (
                        <span className="text-red-600 font-medium">Gefahr von Oberflächenrissen! (σ &gt; f_ctm)</span>
                      ) : (
                        <span className="text-emerald-600 font-medium">Keine Oberflächenrisse (σ &lt; f_ctm)</span>
                      )}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                    <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Max. Druckeigenspannung (Kern)</div>
                    <div className="text-2xl font-bold text-blue-600">{formatDeZahl(betonResults.maxCompressive, 1)} MPa</div>
                    <div className="text-xs text-text-main/60 mt-1">Ausgleichsspannung im Querschnitt</div>
                  </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm h-[350px]">
              <h3 className="text-sm font-bold text-text-main mb-4">
                Eigenspannungsverteilung über die Bauteildicke
              </h3>
              <div className="relative w-full h-[260px]">
                <Line 
                  data={betonResults.chartData} 
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                      x: { 
                        title: { display: true, text: 'Position im Querschnitt' },
                        ticks: { maxTicksLimit: 11 }
                      },
                      y: { 
                        title: { display: true, text: 'Eigenspannung (MPa)' },
                        suggestedMin: Math.min(betonResults.maxCompressive * 1.2, -fCtmEarly * 1.2),
                        suggestedMax: Math.max(betonResults.maxTensile * 1.2, fCtmEarly * 1.2)
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ${formatDeZahl(context.parsed.y, 1)} MPa`;
                          }
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New section for Gleichgewicht der Eigenspannungen */}
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
          <Info size={20} /> Gleichgewicht der Eigenspannungen (N = 0, M = 0)
        </h3>
        <p className="text-sm text-blue-800 mb-6">
          Eigenspannungen sind innere Spannungen, die <strong>ohne das Einwirken äußerer Kräfte</strong> im Bauteil bestehen. Daher müssen sie sich selbst im Gleichgewicht befinden. Das bedeutet für die resultierenden Schnittgrößen:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm text-center">
            <div className="font-bold text-blue-900 mb-2">Normalkraft (N) = 0</div>
            <div className="text-sm text-blue-700 mb-2"><FormulaText text="N = \int \sigma_{res} dA = 0" /></div>
            <div className="text-xs text-blue-600">Zug- und Druckspannungen heben sich über den Querschnitt exakt auf.</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm text-center">
            <div className="font-bold text-blue-900 mb-2">Biegemoment (M) = 0</div>
            <div className="text-sm text-blue-700 mb-2"><FormulaText text="M = \int \sigma_{res} \cdot z dA = 0" /></div>
            <div className="text-xs text-blue-600">Die Spannungen erzeugen kein resultierendes Moment um die Schwerachse.</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm text-center">
            <div className="font-bold text-blue-900 mb-2">Bezeichnung „V“</div>
            <div className="text-sm text-blue-700 mb-2"><FormulaText text="T_V = T - T_N - T_M" /></div>
            <div className="text-xs text-blue-600">„V“ steht hier für den verbleibenden, nichtlinearen Temperaturanteil – nicht für die Querkraft. Er erzeugt die Eigenspannungen.</div>
          </div>
        </div>

          <div className="mt-6 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
            <h4 className="font-bold text-blue-900 mb-2">Zerlegung der Temperatur (Zwang vs. Eigenspannung)</h4>
            <p className="text-xs text-blue-800 mb-3">
              In der Massivbau-Praxis wird eine beliebige (z.B. parabolische) Temperaturverteilung <FormulaText text="T(z)" /> in drei Anteile zerlegt:
            </p>
            <ul className="list-disc list-inside text-xs text-blue-800 space-y-2 ml-2">
              <li><strong>Konstanter Anteil (<FormulaText text="T_N" />):</strong> Führt zu Längsdehnung. Ist das Bauteil an den Enden eingespannt, entsteht hieraus die <strong>Zwangsnormalkraft N</strong>.</li>
              <li><strong>Linearer Anteil (<FormulaText text="T_M" />):</strong> Führt zu Krümmung. Ist das Bauteil an den Enden eingespannt, entsteht hieraus das <strong>Zwangsbiegemoment M</strong>.</li>
              <li><strong>Nicht-linearer Anteil (<FormulaText text="T_V" />):</strong> Der verbleibende Rest führt <strong>immer</strong> zu den hier gezeigten Eigenspannungen (V), selbst wenn das Bauteil völlig frei beweglich ist!</li>
            </ul>
          </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title="Anwendungsbeispiel: Randzugspannung in der Aufheizphase einer 1 m dicken Wand"
          zielGleichung="\sigma_{V,Rand} = \tfrac{2}{3} \cdot E_{c,eff} \cdot \alpha_T \cdot \Delta T_{par}, \quad \Delta T_{par} = T_{mitte} - \tfrac{T_{innen} + T_{aussen}}{2}"
          normQuelle="Lehrmodell: parabolische Temperaturverteilung, Zerlegung in T_N, T_M, T_V"
          schritte={[
            { titel: '1. Gegeben', formel: 'T_{innen} = 20,\\; T_{mitte} = 45,\\; T_{aussen} = 15\\,^\\circ\\text{C};\\; E_{c,eff} = 15\\,000\\,\\text{N/mm}^2,\\; \\alpha_T = 10^{-5}\\,\\text{K}^{-1}', erklaerung: 'Werte der Voreinstellung des Rechners.' },
            { titel: '2. Parabelanteil', formel: '\\Delta T_{par} = 45 - \\frac{20 + 15}{2} = 27{,}5\\,\\text{K}', erklaerung: 'Nur die Krümmung der Temperaturkurve erzeugt Eigenspannungen.' },
            { titel: '3. Nichtlinearer Anteil', formel: 'T_{V,Rand} = -\\tfrac{2}{3} \\cdot 27{,}5 = -18{,}3\\,\\text{K};\\; T_{V,Kern} = +\\tfrac{1}{3} \\cdot 27{,}5 = +9{,}2\\,\\text{K}', erklaerung: 'Mittelwert und linearer Anteil sind abgezogen.' },
            { titel: '4. Spannungen', formel: '\\sigma_{V,Rand} = 15\\,000 \\cdot 10^{-5} \\cdot 18{,}3 = +2{,}75\\,\\text{N/mm}^2;\\; \\sigma_{V,Kern} = -1{,}38\\,\\text{N/mm}^2', erklaerung: 'Zug am Rand, Druck im Kern; N = 0 und M = 0 sind erfüllt.' },
            { titel: '5. Vergleich mit der Zugfestigkeit', formel: '2{,}75 > f_{ctm}(t) = 1{,}5\\,\\text{N/mm}^2', erklaerung: 'Oberflächenrisse wahrscheinlich.' },
          ]}
          ergebnisHinweis="Abhilfe: Temperaturdifferenz zwischen Kern und Rand begrenzen (wärmedämmende Schalung, späteres Ausschalen, wärmearme Rezeptur); Faustwert ΔT ≤ 20 K (Lehrannahme)."
        />
      </div>

      <ModulTest moduleId="eigenspannungen" />

      {!eingebettet && (
<ModuleFooter weblinks={[{ title: "Beton.wiki: Eigenspannungen", url: "https://beton.wiki/index.php?title=Eigenspannungen" }, { title: "Zement-Merkblätter Übersicht", url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }]} 
        wikipedia={[
        { title: 'Eigenspannung', url: 'https://de.wikipedia.org/wiki/Eigenspannung' }
      ]}
        literatur={[
          'Rostásy, F. S.; Krauß, M.: Frühe Risse in massigen Betonbauteilen – Ingenieurmodelle für die Planung von Gegenmaßnahmen. DAfStb (Heftnummer und Jahr manuell prüfen)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Breitenbücher, R.: Zwangsspannungen und Rißbildung infolge Hydratationswärme. Dissertation, TU München 1989'
        ]}
        regelwerke={[
          { title: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04 (Eurocode 2), Abschn. 7.3 Rissbreitenbegrenzung' },
          { title: 'DAfStb-Richtlinie Massige Bauteile aus Beton (Ausgabe manuell prüfen)' },
          { title: 'DAfStb-Richtlinie Wasserundurchlässige Bauwerke aus Beton (WU-Richtlinie), 2017-12' }
        ]}
        formeln={[
          {
            formel: '\\sigma_{\\text{res,cs}}(x) = E_{c,\\text{eff}} \\cdot \\varepsilon_{cs} \\cdot \\left(\\left(\\frac{2x}{d}\\right)^2 - \\frac{1}{3}\\right)',
            erklaerung: 'Eigenspannungsverteilung infolge ungleichmäßigen Schwindens (Bauteilränder trocknen schneller aus als der feuchte Kern): Randbereiche stehen unter Zugspannung, der Kern unter Druckspannung.',
            quelle: 'Lehrmodell (Zerlegung T_N, T_M, T_V)'
          },
          {
            formel: '\\sigma_t(t) = R_{\\text{ax}} \\cdot E_{c,\\text{eff}}(t) \\cdot \\alpha_T \\cdot \\Delta T(t) \\le f_{\\text{ct,eff}}(t)',
            erklaerung: 'Thermisch induzierte Zwangsspannung bei Abkühlung massiger Betonbauteile mit Festhaltungsgrad R_ax (Restraint). Übersteigt sigma_t die wirksame Betonzugfestigkeit f_ct,eff, entstehen Trennrisse.',
            quelle: 'Lehrmodell (Zerlegung T_N, T_M, T_V)'
          }
        ]}
      />
)}
    </div>
  );
}
