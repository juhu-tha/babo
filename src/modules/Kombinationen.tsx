import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Slider } from '@/src/components/ui/Slider';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { FormulaText } from '@/src/components/ui/FormulaText';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import { Querverweis } from '@/src/components/ui/Querverweis';
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
import '@/src/lib/chartSetup';
import { 
  Layers, 
  Shield, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Box, 
  GitMerge, 
  Activity, 
  Sliders,
  Flame,
  Network,
  BookOpen
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import inhalt from '@/content/kombinationen/Kombinationen.json';
import { faserverbund, eModulLaengs, eModulQuer, schichtaufbau, RSI_WAND, RSE_WAND } from '@/src/calc/kombinationen';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { MdText } from '@/src/components/inhalt/MdText';
import { ReiterLeiste, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WallLayer {
  id: string;
  name: string;
  thickness: number; // in mm
  lambda: number;    // in W/(m*K)
  mu: number;        // Wasserdampfdiffusionswiderstandszahl
  category: 'tragend' | 'daemmend' | 'schuetzend';
}

const PRESET_LAYERS: WallLayer[] = [
  { id: '1', name: 'Kalkgips-Innenputz', thickness: 15, lambda: 0.70, mu: 10, category: 'schuetzend' },
  { id: '2', name: inhalt.werte.hochlochziegelMauerwerkHlz, thickness: 240, lambda: 0.28, mu: 10, category: 'tragend' },
  { id: '3', name: inhalt.werte.epsHartschaumFassadendämmungWdvs, thickness: 160, lambda: 0.035, mu: 40, category: 'daemmend' },
  { id: '4', name: inhalt.werte.armierungsputzMitGlasfasergewebe, thickness: 5, lambda: 0.85, mu: 25, category: 'schuetzend' },
  { id: '5', name: inhalt.werte.silikonharzOberputzWasserabweisend, thickness: 3, lambda: 0.70, mu: 30, category: 'schuetzend' },
];

const fibers = {
  'Carbon (HT)': { ef: 230, sf: 3500, rho: 1.8, desc: inhalt.werte.highTenacityCarbonfaser },
  'Carbon (HM)': { ef: 390, sf: 2500, rho: 1.9, desc: inhalt.werte.highModulusCarbonfaser },
  'E-Glas': { ef: 73, sf: 2400, rho: 2.6, desc: inhalt.werte.standardGlasfaser },
  'Aramid': { ef: 130, sf: 2900, rho: 1.45, desc: 'Para-Aramidfaser' },
};

const matrices = {
  'Epoxidharz': { em: 3.2, sm: 70, rho: 1.2 },
  'Polyesterharz': { em: 2.8, sm: 50, rho: 1.2 },
  'Polyamid (PA6)': { em: 2.5, sm: 60, rho: 1.14 },
};

export type KombinationenTab = 
  | 'ueberblick'
  | 'aufbauten'
  | 'faserverbund'
  | 'verbundwerkstoffe'
  | 'schutzschichten'
  | 'rechner'
  | 'steckbrief';

interface KombinationenProps {
  initialTab?: KombinationenTab;
}

export default function Kombinationen({ initialTab = 'ueberblick' }: KombinationenProps) {
  const [activeTab, setActiveTab] = useState<KombinationenTab>(initialTab);

  // --- Faserverbund-Mikromechanik State ---
  const [fiberType, setFiberType] = useState<keyof typeof fibers>('Carbon (HT)');
  const [matrixType, setMatrixType] = useState<keyof typeof matrices>('Epoxidharz');
  const [vf, setVf] = useState(40); // Faservolumengehalt %

  const ef = fibers[fiberType].ef;
  const sf = fibers[fiberType].sf;
  const em = matrices[matrixType].em;
  const sm = matrices[matrixType].sm;

  const fvkResults = useMemo(() => {
    // Rechenkern src/calc/kombinationen.ts (Voigt/Reuss, Mischungsregel Festigkeit als Lehrmodell)
    const fvk = faserverbund({ ef, sf, rhoF: fibers[fiberType].rho, em, sm, rhoM: matrices[matrixType].rho, vf });
    const E_parallel = fvk.eLaengs;
    const S_parallel = fvk.festigkeitLaengs;
    const E_quer = fvk.eQuer;
    const rho_composite = fvk.rho;

    const labels = [];
    const eParallelData = [];
    const eQuerData = [];
    const currentPointParallel = [];
    const currentPointQuer = [];

    for (let v = 0; v <= 100; v += 5) {
      labels.push(v.toFixed(0));
      const current_E_parallel = eModulLaengs(ef, em, v / 100);
      const current_E_quer = eModulQuer(ef, em, v / 100);
      
      eParallelData.push(current_E_parallel);
      eQuerData.push(current_E_quer);

      if (Math.abs(v - vf) < 2.5) {
        currentPointParallel.push(E_parallel);
        currentPointQuer.push(E_quer);
      } else {
        currentPointParallel.push(null);
        currentPointQuer.push(null);
      }
    }

    const chartData = {
      labels,
      datasets: [
        {
          label: inhalt.werte.eModulLängsVoigt,
          data: eParallelData,
          borderColor: '#A3113E',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        },
        {
          label: inhalt.werte.eModulQuerReuss,
          data: eQuerData,
          borderColor: '#475569',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        },
        {
          label: inhalt.werte.aktuellerWertLängs,
          data: currentPointParallel,
          borderColor: '#A3113E',
          backgroundColor: '#A3113E',
          pointRadius: 6,
          pointStyle: 'circle',
          borderWidth: 2,
        },
        {
          label: inhalt.werte.aktuellerWertQuer,
          data: currentPointQuer,
          borderColor: '#475569',
          backgroundColor: '#475569',
          pointRadius: 6,
          pointStyle: 'circle',
          borderWidth: 2,
        }
      ]
    };

    return { E_parallel, E_quer, S_parallel, chartData, rho_composite, hinweise: fvk.hinweise };
  }, [vf, ef, em, sf, sm, fiberType, matrixType]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      x: {
        title: { display: true, text: inhalt.werte.faservolumengehaltVF, font: { weight: 'bold' as const } }
      },
      y: {
        title: { display: true, text: inhalt.werte.eModulGpa, font: { weight: 'bold' as const } },
        min: 0,
      }
    }
  };

  // --- Mehrschicht-Wand-Kalkulator State ---
  const [layers, setLayers] = useState<WallLayer[]>(PRESET_LAYERS);
  const rsi = RSI_WAND; // m²K/W (Wand horizontal)
  const rse = RSE_WAND; // m²K/W (Außenluft)

  // Rechenkern src/calc/kombinationen.ts (T6-KO-4/-5): R, U, s_d je Schicht; s_d-Regel geteilt an der Dämmschicht,
  // Außenwände mit Außendämmung nach den nachweisfreien Konstruktionen der DIN 4108-3
  const calcResults = useMemo(() => {
    const e = schichtaufbau(layers.map(l => ({ dicke: l.thickness, lambda: l.lambda, mu: l.mu, kategorie: l.category })), rsi, rse);
    return {
      layerCalculations: layers.map((layer, i) => ({ ...layer, r: e.schichten[i]?.r ?? NaN, sd: e.schichten[i]?.sd ?? NaN })),
      totalR: e.rT,
      uValue: e.u,
      totalSd: e.sdGesamt,
      totalThicknessM: e.dickeGesamt,
      hasDiffusionTrap: e.gueltig && !e.unkritisch,
      sdPruefung: e.sdPruefung,
      einordnung: e.einordnung,
      iDaemm: e.iDaemm,
      innerLayersSd: e.sdInnen,
      outerLayersSd: e.sdAussen,
      gueltig: e.gueltig,
      hinweise: e.hinweise,
    };
  }, [layers, rsi, rse]);

  const updateLayer = (id: string, field: keyof WallLayer, value: WallLayer[keyof WallLayer]) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const addLayer = () => {
    const newId = Date.now().toString();
    setLayers(prev => [
      ...prev,
      {
        id: newId,
        name: 'Zusatzschicht',
        thickness: 20,
        lambda: 0.10,
        mu: 15,
        category: 'daemmend'
      }
    ]);
  };

  const removeLayer = (id: string) => {
    if (layers.length <= 1) return;
    setLayers(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center justify-between pb-4 border-b border-home-grau/20 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-shiraz/10 text-shiraz flex items-center justify-center border border-shiraz/20 shadow-xxs">
              <Layers size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.werkstoffKombinationenFaserverbund} /></h2>
              <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.funktionsschichtenTragenDämmenSchützen} /></p>
            </div>
          </div>
          <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20"><MdText text={inhalt.texte.clusterIiMaterialienProdukte} /></span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
          <p className="leading-relaxed"><MdText text={inhalt.texte.imModernenBauwesenErfüllt} /></p>
        </div>

        {/* Navigation Tabs */}
        <ReiterLeiste label="Bereiche Kombinationen" className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
          <button {...alsReiter(activeTab === 'ueberblick', 'kombi-bereich', 'ueberblick')}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'ueberblick'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('ueberblick')}
          >
            <Box size={16} /><MdText text={inhalt.texte.systematikPrinzipien} /></button>
          <button {...alsReiter(activeTab === 'aufbauten', 'kombi-bereich', 'aufbauten')}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'aufbauten'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('aufbauten')}
          >
            <Layers size={16} /><MdText text={inhalt.texte.schichtaufbauAußenwand} /></button>
          <button {...alsReiter(activeTab === 'faserverbund', 'kombi-bereich', 'faserverbund')}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'faserverbund'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('faserverbund')}
          >
            <Network size={16} /><MdText text={inhalt.texte.faserverbundCfkGfkSimulator} /></button>
          <button {...alsReiter(activeTab === 'verbundwerkstoffe', 'kombi-bereich', 'verbundwerkstoffe')}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'verbundwerkstoffe'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('verbundwerkstoffe')}
          >
            <GitMerge size={16} /><MdText text={inhalt.texte.makroverbundeStbSandwichVsg} /></button>
          <button {...alsReiter(activeTab === 'schutzschichten', 'kombi-bereich', 'schutzschichten')}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'schutzschichten'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('schutzschichten')}
          >
            <Shield size={16} /><MdText text={inhalt.texte.schutzschichtenGrenzflächen} /></button>
          <button {...alsReiter(activeTab === 'rechner', 'kombi-bereich', 'rechner')}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'rechner'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('rechner')}
          >
            <Calculator size={16} /><MdText text={inhalt.texte.interaktiverSchichtrechner} /></button>
          <button {...alsReiter(activeTab === 'steckbrief', 'kombi-bereich', 'steckbrief')}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'steckbrief'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steckbrief')}
          >
            <BookOpen size={16} /> Faserverbund-Steckbrief
          </button>
        </ReiterLeiste>

        {/* Tab 1: Systematik & Prinzipien */}
        {activeTab === 'ueberblick' && (
          <div {...reiterPanel('kombi-bereich', activeTab)} className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-sm mb-3">1</div>
                  <h3 className="font-bold text-text-main text-base mb-2"><MdText text={inhalt.texte.makroSchichtverbunde} /></h3>
                  <p className="text-xs text-text-main/75 leading-relaxed mb-3"><MdText text={inhalt.texte.geometrischGetrennteMakroskopischeWerkst} /></p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-xs text-text-main/80 font-mono"><MdText text={inhalt.texte.funktionsdifferenzierungTragenDämmenSchü} /></div>
              </div>

              <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-sm mb-3">2</div>
                  <h3 className="font-bold text-text-main text-base mb-2"><MdText text={inhalt.texte.strukturFaserverbunde} /></h3>
                  <p className="text-xs text-text-main/75 leading-relaxed mb-3"><MdText text={inhalt.texte.kombinationMindestensZweierPhasen} /></p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-xs text-text-main/80 font-mono">
                  Mischungsregel: <InlineMath math="E = V_f E_f + V_m E_m" />
                </div>
              </div>

              <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-sm mb-3">3</div>
                  <h3 className="font-bold text-text-main text-base mb-2"><MdText text={inhalt.texte.grenzflächenSchutzschichten} /></h3>
                  <p className="text-xs text-text-main/75 leading-relaxed mb-3"><MdText text={inhalt.texte.oberflächenbehandlungenUndBeschichtungss} /></p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-xs text-text-main/80 font-mono">
                  Haftfestigkeit: <InlineMath math="f_{\text{ct,surf}} \ge 1{,}5\,\text{MPa}" />
                </div>
              </div>
            </div>

            {/* Matrix der Koppelmechanismen */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xxs">
              <h3 className="text-base font-bold text-text-main mb-3 flex items-center gap-2">
                <Sliders size={18} className="text-shiraz" /><MdText text={inhalt.texte.physikalischeVoraussetzungenFürErfolgrei} /></h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-off-white border-b border-home-grau/30 text-text-main font-bold">
                      <th className="p-3">Kriterium</th>
                      <th className="p-3"><MdText text={inhalt.texte.physikalischeAnforderung} /></th>
                      <th className="p-3"><MdText text={inhalt.texte.versagensrisikoBeiInkompatibilität} /></th>
                      <th className="p-3">Praxis-Beispiel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                    <tr>
                      <td className="p-3 font-bold text-text-main"><MdText text={inhalt.texte.thermischeDehnungskompatibilität} /></td>
                      <td className="p-3"><MdText text={inhalt.texte.ähnlicheLängenausdehnungskoeffizientenDe} /></td>
                      <td className="p-3 text-rose-700"><MdText text={inhalt.texte.thermischesZwangsversagenDelaminationAn} /></td>
                      <td className="p-3"><MdText text={inhalt.texte.stahlbetonAlphaTText} /></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-text-main"><MdText text={inhalt.texte.chemischeVerträglichkeitPassivierung} /></td>
                      <td className="p-3"><MdText text={inhalt.texte.stabilesElektrochemischesMilieuZ} /></td>
                      <td className="p-3 text-rose-700"><MdText text={inhalt.texte.lochfraßBimetallKorrosionEttringittreibe} /></td>
                      <td className="p-3"><MdText text={inhalt.texte.betonstahlImUnkarbonatisiertenZementstei} /></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-text-main"><MdText text={inhalt.texte.hygrothermischeSchichtfolge} /></td>
                      <td className="p-3"><MdText text={inhalt.texte.wasserdampfdiffusionswiderstandVonInnenN} /></td>
                      <td className="p-3 text-rose-700"><MdText text={inhalt.texte.tauwasserausfallImBauteilinnerenGlaser} /></td>
                      <td className="p-3"><MdText text={inhalt.texte.mehrschichtigeAußenwandZiegelDämmung} /></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-text-main"><MdText text={inhalt.texte.schubsteifeGrenzflächenverankerung} /></td>
                      <td className="p-3"><MdText text={inhalt.texte.formschlussReibungOderChemische} /></td>
                      <td className="p-3 text-rose-700"><MdText text={inhalt.texte.schlupfEntkoppelungVerlustDer} /></td>
                      <td className="p-3"><MdText text={inhalt.texte.rippungVonB500bBetonstahl} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Schichtaufbau Außenwand */}
        {activeTab === 'aufbauten' && (
          <div {...reiterPanel('kombi-bereich', activeTab)} className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.dasDreiklangPrinzipDer} /></h3>
              <p className="text-sm text-text-main/80 leading-relaxed mb-4"><MdText text={inhalt.texte.eineMonolithischeMassivwandAus} /></p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-xxs">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200 uppercase">
                    Funktion 1
                  </span>
                  <h4 className="font-bold text-text-main mt-2 mb-1"><MdText text={inhalt.texte.tragenStatischesSkelett} /></h4>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-2"><MdText text={inhalt.texte.übertragungVonEigenlastenNutzlasten} /></p>
                  <ul className="text-xs text-text-main/80 space-y-1 list-disc list-inside">
                    <li><MdText text={inhalt.texte.kalksandsteinKsHoheRohdichte} /></li>
                    <li><MdText text={inhalt.texte.mauerziegelHlzOderPorenbeton} /></li>
                    <li><MdText text={inhalt.texte.stahlbetonwandOrtbetonOderFertigteil} /></li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-xxs">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                    Funktion 2
                  </span>
                  <h4 className="font-bold text-text-main mt-2 mb-1"><MdText text={inhalt.texte.dämmenWärmeEnergie} /></h4>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-2"><MdText text={inhalt.texte.minimierungDesTransmissionswärmeverluste} /></p>
                  <ul className="text-xs text-text-main/80 space-y-1 list-disc list-inside">
                    <li><MdText text={inhalt.texte.expandiertesPolystyrolEpsWlg} /></li>
                    <li><MdText text={inhalt.texte.steinwolleGlaswolleNichtbrennbarA1} /></li>
                    <li><MdText text={inhalt.texte.holzfaserdämmplattenOderVakuumdämmungVip} /></li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-xxs">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                    Funktion 3
                  </span>
                  <h4 className="font-bold text-text-main mt-2 mb-1"><MdText text={inhalt.texte.schützenWitterungFeuchte} /></h4>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-2"><MdText text={inhalt.texte.abwehrVonSchlagregenFrost} /></p>
                  <ul className="text-xs text-text-main/80 space-y-1 list-disc list-inside">
                    <li><MdText text={inhalt.texte.bewehrterUnterputzMitGlasfasergewebe} /></li>
                    <li><MdText text={inhalt.texte.wasserabweisenderOberputzSilikonharzSili} /></li>
                    <li><MdText text={inhalt.texte.vorgehängteHinterlüfteteFassadenplattenV} /></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fassadensysteme im Vergleich */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xxs">
              <h3 className="font-bold text-text-main text-base mb-4"><MdText text={inhalt.texte.typischeFassadensystemeImBauphysikalisch} /></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/25">
                  <h4 className="font-bold text-shiraz text-sm mb-2"><MdText text={inhalt.texte.aWärmedämmVerbundsystemWdvs} /></h4>
                  <p className="text-xs text-text-main/80 mb-3 leading-relaxed"><MdText text={inhalt.texte.kompaktesSchichtsystemBeiDem} /></p>
                  <div className="space-y-1.5 text-xs text-text-main/75 border-t border-home-grau/20 pt-2">
                    <div><MdText text={inhalt.texte.vorteileKostengünstigFugenloseHülle} /></div>
                    <div><MdText text={inhalt.texte.herausforderungenAlgenbildungAufKühlen} /></div>
                    <div><MdText text={inhalt.texte.normbezugDin55699Etag} /></div>
                  </div>
                </div>

                <div className="p-4 bg-off-white rounded-xl border border-home-grau/25">
                  <h4 className="font-bold text-shiraz text-sm mb-2"><MdText text={inhalt.texte.bVorgehängteHinterlüfteteFassade} /></h4>
                  <p className="text-xs text-text-main/80 mb-3 leading-relaxed"><MdText text={inhalt.texte.konstruktiveTrennungVonWitterungsschutz} /></p>
                  <div className="space-y-1.5 text-xs text-text-main/75 border-t border-home-grau/20 pt-2">
                    <div><MdText text={inhalt.texte.vorteileHöchsteSchadenssicherheitDiffusi} /></div>
                    <div><MdText text={inhalt.texte.herausforderungenHöhereAnfangsinvestitio} /></div>
                    <div><MdText text={inhalt.texte.normbezugDin185161} /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Diffusionsregel (Faustregel); Glaser-Nachweis im Modul Feuchteschutz */}
            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-950 text-xs leading-relaxed">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 text-sm mb-1"><MdText text={inhalt.texte.bauphysikalischeGrundregelFürDiffusionss} /></h4>
                  <p className="mb-2"><MdText text={inhalt.texte.wasserdampfDiffundiertImWinter} /></p>
                  <div className="p-2 bg-white/80 rounded border border-amber-200 font-mono text-center font-bold text-amber-900">
                    <InlineMath math="s_{d,i} \ge 1{,}0\,\text{m}\ (s_{d,e} \le 0{,}1\,\text{m}),\quad s_{d,i} \ge 2{,}0\,\text{m}\ (s_{d,e} \le 0{,}3\,\text{m}),\quad s_{d,i} \ge 6 \cdot s_{d,e}\ (s_{d,e} \le 2{,}0\,\text{m})" />
                  </div>
                  <p className="mt-2 text-[11px] text-amber-900/80"><MdText text={inhalt.texte.wirdAußenEinDampfdichter} /></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Faserverbund (CFK/GFK Simulator & Mikromechanik) */}
        {activeTab === 'faserverbund' && (
          <div {...reiterPanel('kombi-bereich', activeTab)} className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                  <h3 className="font-bold text-shiraz text-base mb-4 flex items-center gap-2">
                    <Network size={18} />
                    FVK-Mikromechanik-Konfigurator
                  </h3>
                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-text-main">Faserart</label>
                        <InfoTooltip text={inhalt.werte.artDerVerwendetenVerstärkungsfasern} />
                      </div>
                      <select 
                        aria-label="Faserart" 
                        className="p-2 border border-home-grau/30 rounded-md bg-white text-text-main text-xs focus:outline-none focus:border-shiraz"
                        value={fiberType}
                        onChange={(e) => setFiberType(e.target.value as keyof typeof fibers)}
                      >
                        {Object.keys(fibers).map(k => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-text-main">Matrixart</label>
                        <InfoTooltip text={inhalt.werte.artDesVerwendetenMatrixmaterials} />
                      </div>
                      <select 
                        aria-label="Matrixart" 
                        className="p-2 border border-home-grau/30 rounded-md bg-white text-text-main text-xs focus:outline-none focus:border-shiraz"
                        value={matrixType}
                        onChange={(e) => setMatrixType(e.target.value as keyof typeof matrices)}
                      >
                        {Object.keys(matrices).map(k => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                  </div>

                  <Slider 
                    label={inhalt.werte.faservolumengehaltVF2} 
                    info={inhalt.werte.volumenanteilDerFasernIm} 
                    min={0} 
                    max={80} 
                    step={1} 
                    value={vf} 
                    unit="%" 
                    onChange={(e) => setVf(Number(e.target.value))} 
                  />
                  
                  <div className="mt-6 p-3 bg-white rounded-lg border border-home-grau/30 text-sm">
                    <h4 className="font-bold mb-2 text-text-main text-xs"><MdText text={inhalt.texte.eingesetztePhasenkennwerte} /></h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-text-main/60"><MdText text={inhalt.texte.eModulFaser} /></span><span className="font-bold">{formatDeWert(ef)} GPa</span></div>
                      <div className="flex justify-between"><span className="text-text-main/60"><MdText text={inhalt.texte.zugfestigkeitFaser} /></span><span className="font-bold">{formatDeWert(sf)} MPa</span></div>
                      <div className="flex justify-between"><span className="text-text-main/60"><MdText text={inhalt.texte.dichteFaser} /></span><span className="font-bold">{formatDeWert(fibers[fiberType].rho)} g/cm³</span></div>
                      <div className="col-span-2 border-t border-home-grau/20 my-1"></div>
                      <div className="flex justify-between"><span className="text-text-main/60"><MdText text={inhalt.texte.eModulMatrix} /></span><span className="font-bold">{formatDeWert(em)} GPa</span></div>
                      <div className="flex justify-between"><span className="text-text-main/60"><MdText text={inhalt.texte.zugfestigkeitMatrix} /></span><span className="font-bold">{formatDeWert(sm)} MPa</span></div>
                      <div className="flex justify-between"><span className="text-text-main/60"><MdText text={inhalt.texte.dichteMatrix} /></span><span className="font-bold">{formatDeWert(matrices[matrixType].rho)} g/cm³</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-shiraz text-white p-5 rounded-xl shadow-md">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-90"><MdText text={inhalt.texte.berechneteVerbundkennwerte} /></h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-white/70 text-xs"><MdText text={inhalt.texte.dichteVerbund} /></div>
                      <div className="text-2xl font-bold font-mono">{formatDeZahl(fvkResults.rho_composite, 2)} g/cm³</div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs"><MdText text={inhalt.texte.zugfestigkeitLängsLehrmodellIdeal} /></div>
                      <div className="text-2xl font-bold font-mono">{formatDeZahl(fvkResults.S_parallel, 0)} MPa</div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs"><MdText text={inhalt.texte.eModulLängsVoigt} /></div>
                      <div className="text-2xl font-bold font-mono">{formatDeZahl(fvkResults.E_parallel, 1)} GPa</div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs"><MdText text={inhalt.texte.eModulQuerReuss} /></div>
                      <div className="text-2xl font-bold font-mono">{formatDeZahl(fvkResults.E_quer, 1)} GPa</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-home-grau/30 h-[260px] flex flex-col">
                  <h3 className="text-xs font-bold text-center mb-1 text-text-main"><MdText text={inhalt.texte.eModulVsFaservolumengehalt} /></h3>
                  <div className="flex-1 relative">
                    <Line data={fvkResults.chartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>

            {/* Schematische Darstellung Voigt vs. Reuss */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xxs">
              <h3 className="font-bold mb-3 text-text-main text-sm"><MdText text={inhalt.texte.gefügemodelleDerMischungsregelnVoigt} /></h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg width="100%" height="150" viewBox="0 0 450 150" className="max-w-xl">
                  {/* Voigt (Parallel) */}
                  <g transform="translate(50, 30)">
                    <text x="50" y="-15" fontSize="11" fill="#1e293b" textAnchor="middle" fontWeight="bold">Voigt (Parallelschaltung)</text>
                    <text x="50" y="-2" fontSize="9" fill="#1e293b" textAnchor="middle">Längsrichtung (E_||)</text>
                    
                    <rect x="0" y="10" width="100" height="60" fill="#cbd5e1" stroke="#64748b" />
                    <line x1="0" y1="25" x2="100" y2="25" stroke="#A3113E" strokeWidth="4" />
                    <line x1="0" y1="40" x2="100" y2="40" stroke="#A3113E" strokeWidth="4" />
                    <line x1="0" y1="55" x2="100" y2="55" stroke="#A3113E" strokeWidth="4" />
                    
                    <path d="M -15 40 L -3 40" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-komb)" />
                    <path d="M 115 40 L 103 40" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-komb)" />
                    <text x="-20" y="43" fontSize="10" fill="#A3113E" textAnchor="end">σ</text>
                    <text x="120" y="43" fontSize="10" fill="#A3113E" textAnchor="start">σ</text>
                  </g>

                  {/* Reuss (Reihe) */}
                  <g transform="translate(260, 30)">
                    <text x="50" y="-15" fontSize="11" fill="#1e293b" textAnchor="middle" fontWeight="bold">Reuss (Reihenschaltung)</text>
                    <text x="50" y="-2" fontSize="9" fill="#1e293b" textAnchor="middle">Querrichtung (E_⊥)</text>
                    
                    <rect x="0" y="10" width="100" height="60" fill="#cbd5e1" stroke="#64748b" />
                    <line x1="25" y1="10" x2="25" y2="70" stroke="#475569" strokeWidth="4" />
                    <line x1="50" y1="10" x2="50" y2="70" stroke="#475569" strokeWidth="4" />
                    <line x1="75" y1="10" x2="75" y2="70" stroke="#475569" strokeWidth="4" />
                    
                    <path d="M -15 40 L -3 40" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow-gray-komb)" />
                    <path d="M 115 40 L 103 40" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow-gray-komb)" />
                    <text x="-20" y="43" fontSize="10" fill="#475569" textAnchor="end">σ</text>
                    <text x="120" y="43" fontSize="10" fill="#475569" textAnchor="start">σ</text>
                  </g>

                  <defs>
                    <marker id="arrow-red-komb" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                    </marker>
                    <marker id="arrow-gray-komb" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                    </marker>
                  </defs>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2 max-w-lg"><MdText text={inhalt.texte.faserverbundwerkstoffeSindHochgradigAnis} /></div>
              </div>
            </div>

            {/* Praxisanwendungen FVK im Bauwesen */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xxs">
              <h3 className="text-base font-bold text-text-main mb-3"><MdText text={inhalt.texte.baupraktischeFvkAnwendungen} /></h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/25">
                  <h4 className="font-bold text-shiraz text-sm mb-1.5"><MdText text={inhalt.texte.cfkLamellenBiegeverstärkung} /></h4>
                  <p className="text-text-main/75 leading-relaxed mb-2"><MdText text={inhalt.texte.nachträglichesAufklebenMitEpoxidharz} /></p>
                  <ul className="list-disc list-inside space-y-1 text-text-main/80">
                    <li><MdText text={inhalt.texte.keineQuerschnittsvergrößerung} /></li>
                    <li><MdText text={inhalt.texte.korrosionsfreiGegenüberTausalz} /></li>
                    <li><MdText text={inhalt.texte.kritischHarzerweichungBeiT} /></li>
                  </ul>
                </div>

                <div className="p-4 bg-off-white rounded-xl border border-home-grau/25">
                  <h4 className="font-bold text-shiraz text-sm mb-1.5">GFK-Bewehrungsstäbe</h4>
                  <p className="text-text-main/75 leading-relaxed mb-2"><MdText text={inhalt.texte.einsatzInChemischAggressiven} /></p>
                  <ul className="list-disc list-inside space-y-1 text-text-main/80">
                    <li><MdText text={inhalt.texte.betondeckungNurFürVerbund} /></li>
                    <li><MdText text={inhalt.texte.geringererEModulE} /></li>
                    <li><MdText text={inhalt.texte.größereRissbreitenBeiBemessung} /></li>
                  </ul>
                </div>

                <div className="p-4 bg-off-white rounded-xl border border-home-grau/25">
                  <h4 className="font-bold text-shiraz text-sm mb-1.5"><MdText text={inhalt.texte.pultrudierteTragprofile} /></h4>
                  <p className="text-text-main/75 leading-relaxed mb-2"><MdText text={inhalt.texte.stranggezogeneIUUnd} /></p>
                  <ul className="list-disc list-inside space-y-1 text-text-main/80">
                    <li><MdText text={inhalt.texte.deutlichGeringeresEigengewichtDichte} /></li>
                    <li><MdText text={inhalt.texte.geringerInstandhaltungsaufwand} /></li>
                    <li><MdText text={inhalt.texte.gefahrSprödenAbscherensAn} /></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Makroverbunde (Stahlbeton, Sandwich, VSG) */}
        {activeTab === 'verbundwerkstoffe' && (
          <div {...reiterPanel('kombi-bereich', activeTab)} className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Stahlbeton */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-2 flex items-center gap-2">
                <Flame size={20} className="text-shiraz" /><MdText text={inhalt.texte.t1StahlbetonDerUrtyp} /></h3>
              <p className="text-sm text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.betonBesitztEineHohe} /></p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-white rounded-lg border border-home-grau/25">
                  <strong className="text-text-main block mb-1"><MdText text={inhalt.texte.aThermischeDehnung} /></strong><MdText text={inhalt.texte.betonAlphaTApprox} /></div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/25">
                  <strong className="text-text-main block mb-1"><MdText text={inhalt.texte.bMechanischerVerbund} /></strong><MdText text={inhalt.texte.kombinationAusAdhäsionsverbundZementleim} /></div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/25">
                  <strong className="text-text-main block mb-1"><MdText text={inhalt.texte.cChemischerKorrosionsschutz} /></strong><MdText text={inhalt.texte.dasStarkAlkalischePorenwasser} /></div>
              </div>
            </div>

            {/* Sandwich-Querschnitte & VSG */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-text-main text-base mb-2"><MdText text={inhalt.texte.t2SandwichelementeDinEn} /></h3>
                <p className="text-xs text-text-main/75 leading-relaxed mb-3"><MdText text={inhalt.texte.sandwichkonstruktionenBestehenAusZwei} /></p>
                <div className="p-3 bg-white rounded-lg border border-home-grau/20 text-xs space-y-1.5">
                  <div><MdText text={inhalt.texte.mechanikDieDeckschichtenNehmen} /></div>
                  <div><MdText text={inhalt.texte.vorteilExtremHohesVerhältnis} /></div>
                </div>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-text-main text-base mb-2"><MdText text={inhalt.texte.t3VerbundSicherheitsglasVsg} /></h3>
                <p className="text-xs text-text-main/75 leading-relaxed mb-3"><MdText text={inhalt.texte.verbundAusMindestensZwei} /></p>
                <div className="p-3 bg-white rounded-lg border border-home-grau/20 text-xs space-y-1.5">
                  <div><MdText text={inhalt.texte.bruchverhaltenBeiGlasbruchBleiben} /></div>
                  <div><MdText text={inhalt.texte.resttragfähigkeitDieFolieHält} /></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Schutzschichten & Grenzflächen */}
        {activeTab === 'schutzschichten' && (
          <div {...reiterPanel('kombi-bereich', activeTab)} className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Schutz mineralischer Untergründe DIN EN 1504-2 */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xxs">
              <h3 className="font-bold text-shiraz text-lg mb-2 flex items-center gap-2">
                <Shield size={20} className="text-shiraz" /><MdText text={inhalt.texte.t1SchutzMineralischerBaustoffe} /></h3>
              <p className="text-sm text-text-main/80 leading-relaxed mb-4"><MdText text={inhalt.texte.betonUndMauerwerksflächenMüssen} /></p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25">
                  <span className="font-bold text-shiraz block mb-1"><MdText text={inhalt.texte.aHydrophobierung} /></span>
                  <p className="text-text-main/75 mb-2"><MdText text={inhalt.texte.applikationNiedermolekularerSilaneOder} /></p>
                  <div className="font-mono text-[11px] bg-white p-1.5 rounded border border-home-grau/20"><MdText text={inhalt.texte.wasseraufnahmeW01} /></div>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25">
                  <span className="font-bold text-shiraz block mb-1"><MdText text={inhalt.texte.bImprägnierung} /></span>
                  <p className="text-text-main/75 mb-2"><MdText text={inhalt.texte.dünnflüssigesHarzDringtIn} /></p>
                  <div className="font-mono text-[11px] bg-white p-1.5 rounded border border-home-grau/20"><MdText text={inhalt.texte.porenverengungMechanischeFestigung} /></div>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25">
                  <span className="font-bold text-shiraz block mb-1"><MdText text={inhalt.texte.cVersiegelung} /></span>
                  <p className="text-text-main/75 mb-2"><MdText text={inhalt.texte.erzeugungEinesGeschlossenenDünnen} /></p>
                  <div className="font-mono text-[11px] bg-white p-1.5 rounded border border-home-grau/20"><MdText text={inhalt.texte.schutzVorVerschmutzungGeringe} /></div>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25">
                  <span className="font-bold text-shiraz block mb-1"><MdText text={inhalt.texte.dBeschichtungOsSysteme} /></span>
                  <p className="text-text-main/75 mb-2"><MdText text={inhalt.texte.dickschichtigerPolymeraufbauDGe} /></p>
                  <div className="font-mono text-[11px] bg-white p-1.5 rounded border border-home-grau/20"><MdText text={inhalt.texte.os8StarrTiefgaragen} /></div>
                </div>
              </div>
            </div>

            {/* Korrosionsschutz Stahl DIN EN ISO 12944 */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-text-main text-base mb-2"><MdText text={inhalt.texte.t2KorrosionsschutzVonStahl} /></h3>
              <p className="text-xs text-text-main/75 leading-relaxed mb-4"><MdText text={inhalt.texte.stahlKorrodiertInGegenwart} /></p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 shadow-xxs">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t1Barrierewirkung} /></strong><MdText text={inhalt.texte.dickschichtigeEpoxidOderPolyurethanbesch} /></div>
                <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 shadow-xxs">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t2PassivierungInhibition} /></strong><MdText text={inhalt.texte.korrosionsschutzpigmenteZBZinkphosphat} /></div>
                <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 shadow-xxs">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t3KathodischerSchutzOpferanode} /></strong><MdText text={inhalt.texte.feuerverzinkungOderZinkstaubgrundierunge} /></div>
              </div>
            </div>

            {/* Grenzflächenmechanik & Haftzugprüfung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xxs">
              <h3 className="font-bold text-text-main text-base mb-2 flex items-center gap-2">
                <Activity size={18} className="text-shiraz" /><MdText text={inhalt.texte.t3GrenzflächenhaftungAbreißversuchNach} /></h3>
              <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.dieLeistungsfähigkeitJederBeschichtung} /></p>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-text-main mb-1"><MdText text={inhalt.texte.berechnungDerAbreißfestigkeit} /></div>
                  <BlockMath math="f_{\text{ct,surf}} = \frac{4 \cdot F_{\text{fail}}}{\pi \cdot d^2} \ge 1{,}5\,\text{MPa} \quad (\text{Mindestanforderung Betoninstandsetzung})" />
                </div>
                <div className="text-text-main/75 space-y-1 border-l md:border-l-2 border-home-grau/30 pl-4">
                  <div><strong>Bruchbild-Analyse:</strong></div>
                  <div><MdText text={inhalt.texte.bruchImUntergrundBeton} /></div>
                  <div><MdText text={inhalt.texte.adhäsionsbruchAnDerGrenze} /></div>
                  <div><MdText text={inhalt.texte.kohäsionsbruchInDerSchicht} /></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Interaktiver Schichtrechner */}
        {activeTab === 'rechner' && (
          <div {...reiterPanel('kombi-bereich', activeTab)} className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-xs text-text-main/80 flex items-center justify-between flex-wrap gap-2">
              <div><MdText text={inhalt.texte.interaktiverSchichtkalkulatorKonfigurier} /></div>
              <button
                type="button"
                onClick={addLayer}
                className="px-3 py-1.5 bg-shiraz text-white font-bold rounded-lg hover:bg-shiraz/90 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus size={14} /><MdText text={inhalt.texte.schichtHinzufügen} /></button>
            </div>

            {/* Schichten-Tabelle */}
            <div className="overflow-x-auto bg-white rounded-xl border border-home-grau/30 shadow-xxs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-off-white border-b border-home-grau/30 text-text-main font-bold">
                    <th className="p-3">Pos</th>
                    <th className="p-3">Schichtbezeichnung</th>
                    <th className="p-3">Kategorie</th>
                    <th className="p-3"><MdText text={inhalt.texte.dickeDMm} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.leitfähigkeitWMK} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.diffusionszahl} /></th>
                    <th className="p-3 text-right">R [m²K/W]</th>
                    <th className="p-3 text-right">sd [m]</th>
                    <th className="p-3 text-center">Aktion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                  {calcResults.layerCalculations.map((layer, idx) => (
                    <tr key={layer.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-mono font-bold text-shiraz">
                        {idx === 0 ? 'Innen (1)' : idx === layers.length - 1 ? `Außen (${idx + 1})` : idx + 1}
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={layer.name}
                          onChange={(e) => updateLayer(layer.id, 'name', e.target.value)}
                          className="w-full p-1.5 border border-home-grau/30 rounded bg-white text-text-main text-xs focus:ring-1 focus:ring-shiraz"
                        />
                      </td>
                      <td className="p-3">
                        <select
                          value={layer.category}
                          onChange={(e) => updateLayer(layer.id, 'category', e.target.value)}
                          className="p-1 border border-home-grau/30 rounded bg-white text-text-main text-xs"
                        >
                          <option value="tragend">Tragend</option>
                          <option value="daemmend">Dämmend</option>
                          <option value="schuetzend">Schützend</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          step="1"
                          value={Number.isFinite(layer.thickness) ? layer.thickness : ''}
                          onChange={(e) => updateLayer(layer.id, 'thickness', parseFloat(e.target.value))}
                          className="w-20 p-1.5 border border-home-grau/30 rounded bg-white text-text-main text-xs font-mono"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="0.01"
                          max="5.00"
                          step="0.005"
                          value={Number.isFinite(layer.lambda) ? layer.lambda : ''}
                          onChange={(e) => updateLayer(layer.id, 'lambda', parseFloat(e.target.value))}
                          className="w-24 p-1.5 border border-home-grau/30 rounded bg-white text-text-main text-xs font-mono"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="1"
                          max="100000"
                          step="1"
                          value={Number.isFinite(layer.mu) ? layer.mu : ''}
                          onChange={(e) => updateLayer(layer.id, 'mu', parseFloat(e.target.value))}
                          className="w-20 p-1.5 border border-home-grau/30 rounded bg-white text-text-main text-xs font-mono"
                        />
                      </td>
                      <td className="p-3 text-right font-mono font-medium text-text-main">
                        {formatDeZahl(layer.r, 3)}
                      </td>
                      <td className="p-3 text-right font-mono font-medium text-text-main">
                        {formatDeZahl(layer.sd, 2)}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeLayer(layer.id)}
                          disabled={layers.length <= 1}
                          className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                          title={inhalt.werte.schichtLöschen}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Randbedingungen & Kennwerte */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-xl border border-home-grau/30 shadow-xxs flex flex-col justify-between">
                <span className="text-xs text-text-main/60 font-medium">Gesamtdicke</span>
                <div className="text-xl font-bold font-mono text-text-main mt-1">
                  {formatDeZahl(calcResults.totalThicknessM * 100, 1)} cm
                </div>
                <span className="text-[11px] text-text-main/50 mt-1">
                  Summe d = {formatDeZahl(calcResults.totalThicknessM * 1000, 0)} mm
                </span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-home-grau/30 shadow-xxs flex flex-col justify-between">
                <span className="text-xs text-text-main/60 font-medium"><MdText text={inhalt.texte.wärmedurchlasswiderstandRt} /></span>
                <div className="text-xl font-bold font-mono text-text-main mt-1">
                  {formatDeZahl(calcResults.totalR, 3)} m²K/W
                </div>
                <span className="text-[11px] text-text-main/50 mt-1">
                  inkl. Rsi ({formatDeZahl(rsi, 2)}) + Rse ({formatDeZahl(rse, 2)})
                </span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-home-grau/30 shadow-xxs flex flex-col justify-between">
                <span className="text-xs text-text-main/60 font-medium"><MdText text={inhalt.texte.wärmedurchgangskoeffizientU} /></span>
                <div className={`text-xl font-bold font-mono mt-1 ${calcResults.uValue <= 0.24 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {calcResults.gueltig ? `${formatDeZahl(calcResults.uValue, 3)} W/(m²K)` : '–'}
                </div>
                <span className="text-[11px] text-text-main/60 mt-1">
                  {!calcResults.gueltig ? '' : calcResults.uValue <= 0.20 ? inhalt.werte.gegStandardÜbertroffen : calcResults.uValue <= 0.24 ? inhalt.werte.gegMindestwertEingehalten : inhalt.werte.gegVorgabeU0}
                </span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-home-grau/30 shadow-xxs flex flex-col justify-between">
                <span className="text-xs text-text-main/60 font-medium"><MdText text={inhalt.texte.gesamtDiffusionswiderstandSd} /></span>
                <div className="text-xl font-bold font-mono text-text-main mt-1">
                  {formatDeZahl(calcResults.totalSd, 2)} m
                </div>
                <span className="text-[11px] text-text-main/50 mt-1"><MdText text={inhalt.texte.äquivalenteLuftschichtdicke} /></span>
              </div>
            </div>

            <EingabeHinweise hinweise={calcResults.hinweise} />

            {/* Hygrothermische Risikobewertung (Feuchte-Ampel) */}
            {calcResults.gueltig && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
              calcResults.hasDiffusionTrap 
                ? 'bg-rose-50 border-rose-200 text-rose-950' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-950'
            }`}>
              {calcResults.hasDiffusionTrap ? (
                <AlertTriangle size={20} className="text-rose-700 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 size={20} className="text-emerald-700 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold text-sm mb-1">
                  {calcResults.hasDiffusionTrap
                    ? inhalt.werte.hinweisMöglichesTauwasserrisikoIm
                    : calcResults.einordnung === 'aussendaemmung'
                    ? inhalt.werte.außendämmungÜberschrift
                    : inhalt.werte.schichtfolgeEntsprichtDerGrundregel}
                </h4>
                <p>
                  {calcResults.einordnung === 'innendaemmung' ? (
                    <><MdText text={inhalt.texte.innendämmungNachweisErforderlich} /></>
                  ) : calcResults.hasDiffusionTrap ? (
                    <><MdText text={inhalt.texte.dieÄußerenSchichtenWeisen} />{formatDeZahl(calcResults.outerLayersSd, 2)}<MdText text={inhalt.texte.mVsInnereSchichten} />{formatDeZahl(calcResults.innerLayersSd, 2)}<MdText text={inhalt.texte.mImWinterDiffundierender} /></>
                  ) : calcResults.einordnung === 'aussendaemmung' ? (
                    <><MdText text={inhalt.texte.außendämmungNachweisfrei} /></>
                  ) : (
                    <><MdText text={inhalt.texte.dieSDWerte} /></>
                  )}
                  <span className="block mt-1 font-mono text-[11px]">Teilung an Schicht {calcResults.iDaemm + 1} (Dämmschicht, nicht mitgezählt): s_d,i = {formatDeZahl(calcResults.innerLayersSd, 2)} m, s_d,e = {formatDeZahl(calcResults.outerLayersSd, 2)} m. {calcResults.sdPruefung?.text}</span>
                </p>
              </div>
            </div>
            )}

            <Querverweis ziel="feuchteschutz" titel={inhalt.werte.tauwassernachweisNachGlaser} linkText={inhalt.werte.zumGlaserRechnerFeuchteschutz}>
              <p><MdText text={inhalt.texte.dieSDAmpel} /></p>
            </Querverweis>
          </div>
        )}

        {/* Tab 7: Baustoff-Steckbrief Faserverbund */}
        {activeTab === 'steckbrief' && (
          <div {...reiterPanel('kombi-bereich', activeTab)} className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="faserverbund" />
          </div>
        )}
      </div>

      {/* Formel-Herleitungs-Box nach Modulspezifikation */}
      <FormulaDerivationBox
        title={inhalt.werte.bauphysikalischeMechanischeHerleitungMeh}
        zielGleichung="U = \frac{1}{R_{si} + \sum_{i=1}^n \frac{d_i}{\lambda_i} + R_{se}} \quad \text{sowie} \quad E_{\parallel} = V_f E_f + (1-V_f) E_m"
        normQuelle={inhalt.werte.dinEnIso6946}
        ergebnisHinweis={inhalt.werte.uWertUndS}
        schritte={inhalt.daten["Kombinationen.schritte"]}
      />

      {/* Stufe 4 des Lehrpfads: ModulTest */}
      <ModulTest moduleId="kombinationen" title={inhalt.werte.selbsttestWerkstoffKombinationenSchichte} defaultOpen={false} />

      {/* Standardisierter Footer nach RULE[GEMINI_md] */}
      <ModuleFooter
        wikipedia={[
          { title: 'Verbundwerkstoff', url: 'https://de.wikipedia.org/wiki/Verbundwerkstoff' },
          { title: 'Faserverbundwerkstoff', url: 'https://de.wikipedia.org/wiki/Faserverbundwerkstoff' },
          { title: 'Wärmedämmverbundsystem', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmed%C3%A4mmverbundsystem' },
          { title: inhalt.werte.hinterlüfteteFassade, url: 'https://de.wikipedia.org/wiki/Hinterl%C3%BCftete_Fassade' },
          { title: 'Korrosionsschutz', url: 'https://de.wikipedia.org/wiki/Korrosionsschutz' },
          { title: 'Stahlbeton', url: 'https://de.wikipedia.org/wiki/Stahlbeton' }
        ]}
        literatur={inhalt.daten["Kombinationen.literatur"]}
        regelwerke={inhalt.daten["Kombinationen.regelwerke"]}
        formeln={inhalt.daten["Kombinationen.formeln"]}
      />
    </div>
  );
}
