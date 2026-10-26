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
  Filler,
  type ScriptableContext
} from 'chart.js';
import inhalt from '@/content/eigenspannungen/Eigenspannungen.json';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { MdText } from '@/src/components/inhalt/MdText';

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

const REITER = [
  { id: 'beton', label: inhalt.texte.betonHydratation, icon: Box },
] as const;

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
            label: inhalt.werte.eigenspannungVMpa,
            data: stressVData,
            borderColor: '#475569',
            backgroundColor: (context: ScriptableContext<'line'>) => {
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
            label: inhalt.werte.zwangsnormalkraftNMpa,
            data: stressNData,
            borderColor: '#64748b',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false
          },
          {
            label: inhalt.werte.zwangsbiegemomentMMpa,
            data: stressMData,
            borderColor: '#64748b',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false
          },
          {
            label: inhalt.werte.zugfestigkeitFCtmT,
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
      

      {/* AP 2.8: bisher eine einzelne Umschaltfläche; als Reiterleiste mit einem Reiter (weitere Werkstoffe folgen) */}
      <ModuleTabs label="Werkstoff" tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-8 [&>[role=tabpanel]]:flex [&>[role=tabpanel]]:flex-col [&>[role=tabpanel]]:gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
          <Box className="text-shiraz" /><MdText text={inhalt.texte.eigenspannungenBeton} /></h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 my-4">
            <p><MdText text={inhalt.texte.beiMassigenBetonbauteilenEntsteht} /></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Inputs */}
          <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4"><MdText text={inhalt.texte.betonparameterAufheizphase} /></h3>
                <div className="grid grid-cols-1 gap-4">
                  <Slider info={inhalt.werte.temperaturAnDerInnenseite} label={<FormulaText text={inhalt.werte.temperaturInnenTInnen} />} min={10} max={80} step={1} value={tInnen} unit="°C" onChange={(e) => setTInnen(Number(e.target.value))} />
                  <Slider  label={<FormulaText text={inhalt.werte.temperaturMitteTMitte} />} min={10} max={90} step={1} value={tMitte} unit="°C" onChange={(e) => setTMitte(Number(e.target.value))} />
                  <Slider info={inhalt.werte.temperaturAnDerAußenseite} label={<FormulaText text={inhalt.werte.temperaturAußenTAussen} />} min={-10} max={50} step={1} value={tAussen} unit="°C" onChange={(e) => setTAussen(Number(e.target.value))} />
                </div>
                <div className="mt-4 pt-4 border-t border-home-grau/30">
                  <Slider  label={<FormulaText text={inhalt.werte.effektiverEModulE} />} min={1000} max={35000} step={1000} value={eModulBeton} unit="MPa" onChange={(e) => setEModulBeton(Number(e.target.value))} />
                  <p className="text-[10px] text-home-grau mt-1 leading-tight"><MdText text={inhalt.texte.imFrühenAlterAufheizphase} /><FormulaText text="E_{c,eff} = E_c(t) / (1 + \varphi)" />.</p>
                </div>
                <div className="mt-4">
                  <Slider info={inhalt.werte.mittlereZugfestigkeitZumZeitpunkt} label={<FormulaText text={inhalt.werte.zugfestigkeitFCtmT2} />} min={0.5} max={4.0} step={0.1} value={fCtmEarly} unit="MPa" onChange={(e) => setFCtmEarly(Number(e.target.value))} />
                </div>
                <div className="mt-4">
                  <Slider  label={<FormulaText text="Schwinddehnung (Rand) \varepsilon_{cs}" />} min={0} max={1.0} step={0.1} value={epsilonCs} unit="‰" onChange={(e) => setEpsilonCs(Number(e.target.value))} />
                  <p className="text-[10px] text-home-grau mt-1 leading-tight"><MdText text={inhalt.texte.zusätzlicheEigenspannungenDurchUngleichm} /></p>
                </div>
                <div className="mt-4">
                  <Slider label={inhalt.werte.bauteildickeD} info={inhalt.werte.dickeDesBauteils} min={0.5} max={3.0} step={0.1} value={thicknessBeton} unit="m" onChange={(e) => setThicknessBeton(Number(e.target.value))} />
                </div>
                <p className="text-xs text-home-grau mt-3"><MdText text={inhalt.texte.dieTemperaturverteilungWirdIn} /></p>
              </div>
          </div>

          {/* Charts & Results */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                    <div className="text-xs text-home-grau uppercase tracking-wider mb-1"><MdText text={inhalt.texte.maxZugeigenspannungRand} /></div>
                    <div className={`text-2xl font-bold ${betonResults.crackRisk ? 'text-red-600' : 'text-emerald-600'}`}>+{formatDeZahl(betonResults.maxTensile, 1)} MPa</div>
                    <div className="text-xs text-text-main/60 mt-1">
                      {betonResults.crackRisk ? (
                        <span className="text-red-600 font-medium"><MdText text={inhalt.texte.gefahrVonOberflächenrissenF} /></span>
                      ) : (
                        <span className="text-emerald-600 font-medium"><MdText text={inhalt.texte.keineOberflächenrisseFCtm} /></span>
                      )}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                    <div className="text-xs text-home-grau uppercase tracking-wider mb-1"><MdText text={inhalt.texte.maxDruckeigenspannungKern} /></div>
                    <div className="text-2xl font-bold text-blue-600">{formatDeZahl(betonResults.maxCompressive, 1)} MPa</div>
                    <div className="text-xs text-text-main/60 mt-1"><MdText text={inhalt.texte.ausgleichsspannungImQuerschnitt} /></div>
                  </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm h-[350px]">
              <h3 className="text-sm font-bold text-text-main mb-4"><MdText text={inhalt.texte.eigenspannungsverteilungÜberDieBauteildi} /></h3>
              <div className="relative w-full h-[260px]">
                <Line 
                  data={betonResults.chartData} 
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                      x: { 
                        title: { display: true, text: inhalt.werte.positionImQuerschnitt },
                        ticks: { maxTicksLimit: 11 }
                      },
                      y: { 
                        title: { display: true, text: inhalt.werte.eigenspannungMpa },
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
          <Info size={20} /><MdText text={inhalt.texte.gleichgewichtDerEigenspannungenN} /></h3>
        <p className="text-sm text-blue-800 mb-6"><MdText text={inhalt.texte.eigenspannungenSindInnereSpannungen} /></p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm text-center">
            <div className="font-bold text-blue-900 mb-2"><MdText text={inhalt.texte.normalkraftN0} /></div>
            <div className="text-sm text-blue-700 mb-2"><FormulaText text="N = \int \sigma_{res} dA = 0" /></div>
            <div className="text-xs text-blue-600"><MdText text={inhalt.texte.zugUndDruckspannungenHeben} /></div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm text-center">
            <div className="font-bold text-blue-900 mb-2"><MdText text={inhalt.texte.biegemomentM0} /></div>
            <div className="text-sm text-blue-700 mb-2"><FormulaText text="M = \int \sigma_{res} \cdot z dA = 0" /></div>
            <div className="text-xs text-blue-600"><MdText text={inhalt.texte.dieSpannungenErzeugenKein} /></div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm text-center">
            <div className="font-bold text-blue-900 mb-2"><MdText text={inhalt.texte.bezeichnungV} /></div>
            <div className="text-sm text-blue-700 mb-2"><FormulaText text={inhalt.werte.tVTT} /></div>
            <div className="text-xs text-blue-600"><MdText text={inhalt.texte.vStehtHierFür} /></div>
          </div>
        </div>

          <div className="mt-6 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
            <h4 className="font-bold text-blue-900 mb-2"><MdText text={inhalt.texte.zerlegungDerTemperaturZwang} /></h4>
            <p className="text-xs text-blue-800 mb-3"><MdText text={inhalt.texte.inDerMassivbauPraxis} /><FormulaText text="T(z)" /><MdText text={inhalt.texte.inDreiAnteileZerlegt} /></p>
            <ul className="list-disc list-inside text-xs text-blue-800 space-y-2 ml-2">
              <li><strong><MdText text={inhalt.texte.konstanterAnteil} /><FormulaText text="T_N" />):</strong><MdText text={inhalt.texte.führtZuLängsdehnungIst} /></li>
              <li><strong><MdText text={inhalt.texte.linearerAnteil} /><FormulaText text="T_M" />):</strong><MdText text={inhalt.texte.führtZuKrümmungIst} /></li>
              <li><strong><MdText text={inhalt.texte.nichtLinearerAnteil} /><FormulaText text="T_V" />):</strong><MdText text={inhalt.texte.derVerbleibendeRestFührt} /></li>
            </ul>
          </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielRandzugspannungInDer}
          zielGleichung="\sigma_{V,Rand} = \tfrac{2}{3} \cdot E_{c,eff} \cdot \alpha_T \cdot \Delta T_{par}, \quad \Delta T_{par} = T_{mitte} - \tfrac{T_{innen} + T_{aussen}}{2}"
          normQuelle={inhalt.werte.lehrmodellParabolischeTemperaturverteilu}
          schritte={inhalt.daten["Eigenspannungen.schritte"]}
          ergebnisHinweis={inhalt.werte.abhilfeTemperaturdifferenzZwischenKern}
        />
      </div>

      </ModuleTabs>

      <ModulTest moduleId="eigenspannungen" />

      {!eingebettet && (
<ModuleFooter weblinks={[{ title: inhalt.werte.betonWikiEigenspannungen, url: "https://beton.wiki/index.php?title=Eigenspannungen" }, { title: inhalt.werte.zementMerkblätterÜbersicht, url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }]} 
        wikipedia={[
        { title: 'Eigenspannung', url: 'https://de.wikipedia.org/wiki/Eigenspannung' }
      ]}
        literatur={inhalt.daten["Eigenspannungen.literatur"]}
        regelwerke={inhalt.daten["Eigenspannungen.regelwerke"]}
        formeln={inhalt.daten["Eigenspannungen.formeln"]}
      />
)}
    </div>
  );
}
