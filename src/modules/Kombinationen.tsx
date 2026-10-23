import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Slider } from '@/src/components/ui/Slider';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { FormulaText } from '@/src/components/ui/FormulaText';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
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
  { id: '2', name: 'Hochlochziegel Mauerwerk (HLz)', thickness: 240, lambda: 0.28, mu: 10, category: 'tragend' },
  { id: '3', name: 'EPS-Hartschaum Fassadendämmung (WDVS)', thickness: 160, lambda: 0.035, mu: 40, category: 'daemmend' },
  { id: '4', name: 'Armierungsputz mit Glasfasergewebe', thickness: 5, lambda: 0.85, mu: 25, category: 'schuetzend' },
  { id: '5', name: 'Silikonharz-Oberputz (wasserabweisend)', thickness: 3, lambda: 0.70, mu: 30, category: 'schuetzend' },
];

const fibers = {
  'Carbon (HT)': { ef: 230, sf: 3500, rho: 1.8, desc: 'High-Tenacity Carbonfaser' },
  'Carbon (HM)': { ef: 390, sf: 2500, rho: 1.9, desc: 'High-Modulus Carbonfaser' },
  'E-Glas': { ef: 73, sf: 2400, rho: 2.6, desc: 'Standard Glasfaser' },
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
    const v_f = vf / 100;
    const v_m = 1 - v_f;
    
    // Voigt-Modell (Parallel, Längsrichtung)
    const E_parallel = ef * v_f + em * v_m;
    // Mischungsregel Festigkeit (Lehrmodell): Versagen bei Faserbruchdehnung sf/ef; Matrixspannung dann em·sf/ef (≤ sm)
    const S_parallel = sf * v_f + Math.min(sm, em * sf / ef) * v_m;
    
    // Reuss-Modell (Reihe, Querrichtung)
    const E_quer = (ef * em) / (v_f * em + v_m * ef);
    
    const rho_composite = fibers[fiberType].rho * v_f + matrices[matrixType].rho * v_m;

    const labels = [];
    const eParallelData = [];
    const eQuerData = [];
    const currentPointParallel = [];
    const currentPointQuer = [];

    for (let v = 0; v <= 100; v += 5) {
      labels.push(v.toFixed(0));
      const current_v_f = v / 100;
      const current_v_m = 1 - current_v_f;
      
      const current_E_parallel = ef * current_v_f + em * current_v_m;
      const current_E_quer = (ef * em) / (current_v_f * em + current_v_m * ef);
      
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
          label: 'E-Modul Längs (Voigt)',
          data: eParallelData,
          borderColor: '#A3113E',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        },
        {
          label: 'E-Modul Quer (Reuss)',
          data: eQuerData,
          borderColor: '#475569',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        },
        {
          label: 'Aktueller Wert (Längs)',
          data: currentPointParallel,
          borderColor: '#A3113E',
          backgroundColor: '#A3113E',
          pointRadius: 6,
          pointStyle: 'circle',
          borderWidth: 2,
        },
        {
          label: 'Aktueller Wert (Quer)',
          data: currentPointQuer,
          borderColor: '#475569',
          backgroundColor: '#475569',
          pointRadius: 6,
          pointStyle: 'circle',
          borderWidth: 2,
        }
      ]
    };

    return { E_parallel, E_quer, S_parallel, chartData, rho_composite };
  }, [vf, ef, em, sf, sm, fiberType, matrixType]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      x: {
        title: { display: true, text: 'Faservolumengehalt v_f [%]', font: { weight: 'bold' as const } }
      },
      y: {
        title: { display: true, text: 'E-Modul [GPa]', font: { weight: 'bold' as const } },
        min: 0,
      }
    }
  };

  // --- Mehrschicht-Wand-Kalkulator State ---
  const [layers, setLayers] = useState<WallLayer[]>(PRESET_LAYERS);
  const [rsi] = useState<number>(0.13); // m²K/W (Wand horizontal)
  const [rse] = useState<number>(0.04); // m²K/W (Außenluft)

  const calcResults = useMemo(() => {
    let totalR = rsi + rse;
    let totalSd = 0;
    let totalThicknessM = 0;

    const layerCalculations = layers.map(layer => {
      const dM = layer.thickness / 1000;
      totalThicknessM += dM;
      const r = layer.lambda > 0 ? dM / layer.lambda : 0;
      totalR += r;
      const sd = layer.mu * dM;
      totalSd += sd;
      return {
        ...layer,
        dM,
        r,
        sd
      };
    });

    const uValue = totalR > 0 ? 1 / totalR : 0;

    const innerLayersSd = layerCalculations.slice(0, Math.ceil(layers.length / 2)).reduce((acc, l) => acc + l.sd, 0);
    const outerLayersSd = layerCalculations.slice(Math.ceil(layers.length / 2)).reduce((acc, l) => acc + l.sd, 0);
    
    // Warnung, falls Kaltseite signifikant diffusionsdichter ist als Innenseite
    const hasDiffusionTrap = outerLayersSd > innerLayersSd * 1.5 && outerLayersSd > 2.0;

    return {
      layerCalculations,
      totalR,
      uValue,
      totalSd,
      totalThicknessM,
      hasDiffusionTrap,
      innerLayersSd,
      outerLayersSd
    };
  }, [layers, rsi, rse]);

  const updateLayer = (id: string, field: keyof WallLayer, value: any) => {
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
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                Werkstoff-Kombinationen &amp; Faserverbund
              </h2>
              <p className="text-xs text-text-main/70">
                Funktionsschichten (Tragen · Dämmen · Schützen) · Faserverbundwerkstoffe (CFK/GFK) · Stahlbeton &amp; Sandwich · Grenzflächen &amp; Schutzschichten
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20">
            Cluster II: Materialien &amp; Produkte
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
          <p className="leading-relaxed">
            Im modernen Bauwesen erfüllt selten ein Einzelwerkstoff alle statischen, bauphysikalischen und dauerhaftigkeitsrelevanten Anforderungen zugleich. Erst durch <strong>Werkstoff-Kombinationen</strong> – vom mehrschichtigen Wandaufbau nach dem Prinzip <em>„Tragen, Dämmen, Schützen“</em> über mikro- und makroskopische <strong>Faser- und Verbundwerkstoffe</strong> (CFK, GFK, Stahlbeton, Sandwich) bis hin zu funktionellen <strong>Schutzschichten</strong> – entstehen dauerhafte, wärmebrückenarme und tragfähige Konstruktionen.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'ueberblick'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('ueberblick')}
          >
            <Box size={16} /> Systematik &amp; Prinzipien
          </button>
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'aufbauten'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('aufbauten')}
          >
            <Layers size={16} /> Schichtaufbau Außenwand
          </button>
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'faserverbund'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('faserverbund')}
          >
            <Network size={16} /> Faserverbund (CFK/GFK Simulator)
          </button>
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'verbundwerkstoffe'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('verbundwerkstoffe')}
          >
            <GitMerge size={16} /> Makroverbunde (Stb/Sandwich/VSG)
          </button>
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'schutzschichten'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('schutzschichten')}
          >
            <Shield size={16} /> Schutzschichten &amp; Grenzflächen
          </button>
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'rechner'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('rechner')}
          >
            <Calculator size={16} /> Interaktiver Schichtrechner
          </button>
          <button
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
        </div>

        {/* Tab 1: Systematik & Prinzipien */}
        {activeTab === 'ueberblick' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-sm mb-3">1</div>
                  <h3 className="font-bold text-text-main text-base mb-2">Makro- &amp; Schichtverbunde</h3>
                  <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                    Geometrisch getrennte, makroskopische Werkstoffschichten, die jeweils eine dedizierte Schutz-, Dämm- oder Tragfunktion übernehmen (z. B. Mauerwerk + Dämmung + Putz, Sandwichpaneele oder Verbundsicherheitsglas).
                  </p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-xs text-text-main/80 font-mono">
                  Funktionsdifferenzierung: Tragen | Dämmen | Schützen
                </div>
              </div>

              <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-sm mb-3">2</div>
                  <h3 className="font-bold text-text-main text-base mb-2">Struktur- &amp; Faserverbunde</h3>
                  <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                    Kombination mindestens zweier Phasen auf Materialebene: Eine kontinuierliche <strong>Matrix</strong> (Beton, Polymerharz) überträgt Schubkräfte, während eine eingebettete <strong>Bewehrungsphase</strong> (Carbon, Glas, Stahl, Aramid) Zugspannungen absorbiert.
                  </p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-xs text-text-main/80 font-mono">
                  Mischungsregel: <InlineMath math="E = V_f E_f + V_m E_m" />
                </div>
              </div>

              <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-sm mb-3">3</div>
                  <h3 className="font-bold text-text-main text-base mb-2">Grenzflächen &amp; Schutzschichten</h3>
                  <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                    Oberflächenbehandlungen und Beschichtungssysteme (Hydrophobierung, OS-Systeme nach DIN EN 1504-2, Feuerverzinkung nach DIN EN ISO 1461, Beschichtungen nach DIN EN ISO 12944), die das Grundmaterial vor chemischem und physikalischem Umwelteinfluss absichern.
                  </p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-xs text-text-main/80 font-mono">
                  Haftfestigkeit: <InlineMath math="f_{\text{ct,surf}} \ge 1{,}5\,\text{MPa}" />
                </div>
              </div>
            </div>

            {/* Matrix der Koppelmechanismen */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xxs">
              <h3 className="text-base font-bold text-text-main mb-3 flex items-center gap-2">
                <Sliders size={18} className="text-shiraz" />
                Physikalische Voraussetzungen für erfolgreiche Werkstoff-Kombinationen
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-off-white border-b border-home-grau/30 text-text-main font-bold">
                      <th className="p-3">Kriterium</th>
                      <th className="p-3">Physikalische Anforderung</th>
                      <th className="p-3">Versagensrisiko bei Inkompatibilität</th>
                      <th className="p-3">Praxis-Beispiel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                    <tr>
                      <td className="p-3 font-bold text-text-main">Thermische Dehnungskompatibilität</td>
                      <td className="p-3">Ähnliche Längenausdehnungskoeffizienten (<InlineMath math="\Delta \alpha_T \approx 0" />)</td>
                      <td className="p-3 text-rose-700">Thermisches Zwangsversagen, Delamination an Grenzflächen</td>
                      <td className="p-3">Stahlbeton (<InlineMath math="\alpha_{T,\text{Beton}} \approx 10 \cdot 10^{-6}\,\text{K}^{-1} \approx \alpha_{T,\text{Stahl}}" />)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-text-main">Chemische Verträglichkeit &amp; Passivierung</td>
                      <td className="p-3">Stabiles elektrochemisches Milieu (z. B. Alkalität <InlineMath math="\text{pH} > 12{,}5" />)</td>
                      <td className="p-3 text-rose-700">Lochfraß, Bimetall-Korrosion, Ettringittreiben</td>
                      <td className="p-3">Betonstahl im unkarbonatisierten Zementstein</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-text-main">Hygrothermische Schichtfolge</td>
                      <td className="p-3">Wasserdampfdiffusionswiderstand von innen nach außen abnehmend (<InlineMath math="s_{d,\text{innen}} \gg s_{d,\text{außen}}" />)</td>
                      <td className="p-3 text-rose-700">Tauwasserausfall im Bauteilinneren (Glaser-Kondensat), Schimmel, Frostschäden</td>
                      <td className="p-3">Mehrschichtige Außenwand (Ziegel + Dämmung + Diffusionsoffener Putz)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-text-main">Schubsteife Grenzflächenverankerung</td>
                      <td className="p-3">Formschluss, Reibung oder chemische Adhäsion (<InlineMath math="\tau_{\text{bond}} > \tau_{\text{einw}}" />)</td>
                      <td className="p-3 text-rose-700">Schlupf, Entkoppelung, Verlust der Verbundtragwirkung</td>
                      <td className="p-3">Rippung von B500B Betonstahl, Klebeharz bei CFK-Lamellen</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Schichtaufbau Außenwand */}
        {activeTab === 'aufbauten' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-2">
                Das Dreiklang-Prinzip der Gebäudehülle: Tragen · Dämmen · Schützen
              </h3>
              <p className="text-sm text-text-main/80 leading-relaxed mb-4">
                Eine monolithische Massivwand aus gewöhnlichem Normalbeton kann zwar enorme Lasten tragen, weist jedoch eine sehr hohe Wärmeleitfähigkeit auf (<InlineMath math="\lambda \approx 2{,}0\,\text{W/(m}\cdot\text{K)}" />) und erfordert dicke Querschnitte, um die heutigen Anforderungen des GModG (vormals GEG) zu erfüllen. Moderne Hüllkonstruktionen entkoppeln die Aufgaben in spezialisierte Funktionsschichten:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-xxs">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200 uppercase">
                    Funktion 1
                  </span>
                  <h4 className="font-bold text-text-main mt-2 mb-1">Tragen (Statisches Skelett)</h4>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-2">
                    Übertragung von Eigenlasten, Nutzlasten, Wind- und Erdbebenkräften in die Gründung.
                  </p>
                  <ul className="text-xs text-text-main/80 space-y-1 list-disc list-inside">
                    <li>Kalksandstein (KS, hohe Rohdichte, sehr guter Schallschutz)</li>
                    <li>Mauerziegel (HLz) oder Porenbeton</li>
                    <li>Stahlbetonwand (Ortbeton oder Fertigteil)</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-xxs">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                    Funktion 2
                  </span>
                  <h4 className="font-bold text-text-main mt-2 mb-1">Dämmen (Wärme &amp; Energie)</h4>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-2">
                    Minimierung des Transmissionswärmeverlustes <InlineMath math="H_T" /> zur Erfüllung des Gebäudeenergiegesetzes (GEG).
                  </p>
                  <ul className="text-xs text-text-main/80 space-y-1 list-disc list-inside">
                    <li>Expandiertes Polystyrol (EPS, WLG 032–035)</li>
                    <li>Steinwolle / Glaswolle (nichtbrennbar A1)</li>
                    <li>Holzfaserdämmplatten oder Vakuumdämmung (VIP)</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-xxs">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                    Funktion 3
                  </span>
                  <h4 className="font-bold text-text-main mt-2 mb-1">Schützen (Witterung &amp; Feuchte)</h4>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-2">
                    Abwehr von Schlagregen, Frost-Tau-Wechseln, UV-Strahlung und mechanischen Stoßbelastungen.
                  </p>
                  <ul className="text-xs text-text-main/80 space-y-1 list-disc list-inside">
                    <li>Bewehrter Unterputz mit Glasfasergewebe</li>
                    <li>Wasserabweisender Oberputz (Silikonharz/Silikat)</li>
                    <li>Vorgehängte hinterlüftete Fassadenplatten (VHF)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fassadensysteme im Vergleich */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xxs">
              <h3 className="font-bold text-text-main text-base mb-4">
                Typische Fassadensysteme im bauphysikalischen Vergleich
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/25">
                  <h4 className="font-bold text-shiraz text-sm mb-2">
                    A. Wärmedämm-Verbundsystem (WDVS)
                  </h4>
                  <p className="text-xs text-text-main/80 mb-3 leading-relaxed">
                    Kompaktes Schichtsystem, bei dem der Dämmstoff direkt auf den Massivbau geklebt/gedübelt wird. Der bewehrte Unterputz nimmt Zugspannungen aus thermischer Dehnung auf.
                  </p>
                  <div className="space-y-1.5 text-xs text-text-main/75 border-t border-home-grau/20 pt-2">
                    <div><strong>Vorteile:</strong> Kostengünstig, fugenlose Hülle, minimale Wanddicke für sehr niedrige U-Werte.</div>
                    <div><strong>Herausforderungen:</strong> Algenbildung auf kühlen Außenflächen (Taupunktunterschreitung durch geringe thermische Trägheit der Putzschicht), Spechtschäden, selektiver Rückbau/Recycling aufwändig.</div>
                    <div><strong>Normbezug:</strong> DIN 55699 / ETAG 004 / DIN EN 13499.</div>
                  </div>
                </div>

                <div className="p-4 bg-off-white rounded-xl border border-home-grau/25">
                  <h4 className="font-bold text-shiraz text-sm mb-2">
                    B. Vorgehängte Hinterlüftete Fassade (VHF)
                  </h4>
                  <p className="text-xs text-text-main/80 mb-3 leading-relaxed">
                    Konstruktive Trennung von Witterungsschutz (Bekleidung) und Dämmschicht durch einen durchgehenden Hinterlüftungsspalt (<InlineMath math="\ge 20\,\text{mm}" /> nach DIN 18516-1).
                  </p>
                  <div className="space-y-1.5 text-xs text-text-main/75 border-t border-home-grau/20 pt-2">
                    <div><strong>Vorteile:</strong> Höchste Schadenssicherheit, diffusionsfeuchte Ablüftung durch Kamineffekt, einfache Demontierbarkeit (zirkuläres Bauen), sehr guter sommerlicher Hitzeschutz.</div>
                    <div><strong>Herausforderungen:</strong> Höhere Anfangsinvestition, Wärmebrücken durch Unterkonstruktionsanker (müssen mit punktuellen <InlineMath math="\chi" />-Werten berechnet werden).</div>
                    <div><strong>Normbezug:</strong> DIN 18516-1 / DIN 4108-3.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Glaser-Diffusionsregel */}
            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-950 text-xs leading-relaxed">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 text-sm mb-1">
                    Bauphysikalische Grundregel für diffusionssichere Schichtfolgen (DIN 4108-3)
                  </h4>
                  <p className="mb-2">
                    Wasserdampf diffundiert im Winter infolge des Dampfdruckgefälles von innen (warm, hoher Partialdruck <InlineMath math="p_i" />) nach außen (kalt, niedriger Partialdruck <InlineMath math="p_e" />). Um schädliche Kondensation (Tauwasser) an kalten Grenzflächen zu verhindern, muss die <strong>diffusionsäquivalente Luftschichtdicke</strong> <InlineMath math="s_d = \mu \cdot d" /> von innen nach außen abnehmen:
                  </p>
                  <div className="p-2 bg-white/80 rounded border border-amber-200 font-mono text-center font-bold text-amber-900">
                    <InlineMath math="s_{d,\text{innen}} \gg s_{d,\text{außen}} \quad (\text{Faustregel, Lehrannahme: innen mind. 10-fach dichter als außen})" />
                  </div>
                  <p className="mt-2 text-[11px] text-amber-900/80">
                    Wird außen ein dampfdichter Kunstharzfilm oder eine Metallfolie ohne Hinterlüftung montiert, entsteht eine sogenannte <em>„Dampfsperren-Falle“</em>, die zu Auffeuchtung, Schimmel und Frostabsprengungen führt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Faserverbund (CFK/GFK Simulator & Mikromechanik) */}
        {activeTab === 'faserverbund' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
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
                        <InfoTooltip text="Art der verwendeten Verstärkungsfasern." />
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
                        <InfoTooltip text="Art des verwendeten Matrixmaterials (Kunstharz)." />
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
                    label="Faservolumengehalt v_f" 
                    info="Volumenanteil der Fasern im Verbundwerkstoff." 
                    min={0} 
                    max={80} 
                    step={1} 
                    value={vf} 
                    unit="%" 
                    onChange={(e) => setVf(Number(e.target.value))} 
                  />
                  
                  <div className="mt-6 p-3 bg-white rounded-lg border border-home-grau/30 text-sm">
                    <h4 className="font-bold mb-2 text-text-main text-xs">Eingesetzte Phasenkennwerte</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-text-main/60">E-Modul Faser:</span><span className="font-bold">{formatDeWert(ef)} GPa</span></div>
                      <div className="flex justify-between"><span className="text-text-main/60">Zugfestigkeit Faser:</span><span className="font-bold">{formatDeWert(sf)} MPa</span></div>
                      <div className="flex justify-between"><span className="text-text-main/60">Dichte Faser:</span><span className="font-bold">{formatDeWert(fibers[fiberType].rho)} g/cm³</span></div>
                      <div className="col-span-2 border-t border-home-grau/20 my-1"></div>
                      <div className="flex justify-between"><span className="text-text-main/60">E-Modul Matrix:</span><span className="font-bold">{formatDeWert(em)} GPa</span></div>
                      <div className="flex justify-between"><span className="text-text-main/60">Zugfestigkeit Matrix:</span><span className="font-bold">{formatDeWert(sm)} MPa</span></div>
                      <div className="flex justify-between"><span className="text-text-main/60">Dichte Matrix:</span><span className="font-bold">{formatDeWert(matrices[matrixType].rho)} g/cm³</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-shiraz text-white p-5 rounded-xl shadow-md">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-90">Berechnete Verbundkennwerte</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-white/70 text-xs">Dichte Verbund</div>
                      <div className="text-2xl font-bold font-mono">{formatDeZahl(fvkResults.rho_composite, 2)} g/cm³</div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs">Zugfestigkeit Längs (Lehrmodell, ideal)</div>
                      <div className="text-2xl font-bold font-mono">{formatDeZahl(fvkResults.S_parallel, 0)} MPa</div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs">E-Modul Längs (Voigt)</div>
                      <div className="text-2xl font-bold font-mono">{formatDeZahl(fvkResults.E_parallel, 1)} GPa</div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs">E-Modul Quer (Reuss)</div>
                      <div className="text-2xl font-bold font-mono">{formatDeZahl(fvkResults.E_quer, 1)} GPa</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-home-grau/30 h-[260px] flex flex-col">
                  <h3 className="text-xs font-bold text-center mb-1 text-text-main">E-Modul vs. Faservolumengehalt</h3>
                  <div className="flex-1 relative">
                    <Line data={fvkResults.chartData} options={chartOptions as any} />
                  </div>
                </div>
              </div>
            </div>

            {/* Schematische Darstellung Voigt vs. Reuss */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xxs">
              <h3 className="font-bold mb-3 text-text-main text-sm">Gefügemodelle der Mischungsregeln (Voigt vs. Reuss)</h3>
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
                <div className="text-xs text-text-main/70 text-center mt-2 max-w-lg">
                  Faserverbundwerkstoffe sind hochgradig anisotrop: In Faserrichtung (Voigt) dominieren die steifen Fasern (<InlineMath math="E_{\parallel}" /> hoch). Quer zur Faser (Reuss) staucht sich die weiche Matrix elastisch zusammen (<InlineMath math="E_{\perp}" /> niedrig).
                </div>
              </div>
            </div>

            {/* Praxisanwendungen FVK im Bauwesen */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xxs">
              <h3 className="text-base font-bold text-text-main mb-3">Baupraktische FVK-Anwendungen</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/25">
                  <h4 className="font-bold text-shiraz text-sm mb-1.5">CFK-Lamellen (Biegeverstärkung)</h4>
                  <p className="text-text-main/75 leading-relaxed mb-2">
                    Nachträgliches Aufkleben mit Epoxidharz auf Zugzonen von Brückenfahrbahnplatten und Decken.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-text-main/80">
                    <li>Keine Querschnittsvergrößerung</li>
                    <li>Korrosionsfrei gegenüber Tausalz</li>
                    <li>Kritisch: Harzerweichung bei <InlineMath math="T > 60\,^\circ\text{C}" /> (Brandschutz)</li>
                  </ul>
                </div>

                <div className="p-4 bg-off-white rounded-xl border border-home-grau/25">
                  <h4 className="font-bold text-shiraz text-sm mb-1.5">GFK-Bewehrungsstäbe</h4>
                  <p className="text-text-main/75 leading-relaxed mb-2">
                    Einsatz in chemisch aggressiven Umgebungen (Klärbecken, Kaimauern) oder MRT-Räumen (elektrisch nichtleitend).
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-text-main/80">
                    <li>Betondeckung nur für Verbund und Brandschutz nötig, nicht für Korrosionsschutz (Werte nach Zulassung)</li>
                    <li>Geringerer E-Modul (<InlineMath math="E \approx 40 - 60\,\text{GPa}" />)</li>
                    <li>Größere Rissbreiten bei Bemessung beachten</li>
                  </ul>
                </div>

                <div className="p-4 bg-off-white rounded-xl border border-home-grau/25">
                  <h4 className="font-bold text-shiraz text-sm mb-1.5">Pultrudierte Tragprofile</h4>
                  <p className="text-text-main/75 leading-relaxed mb-2">
                    Stranggezogene I-, U- und Kastenprofile aus Glasfaser-Polyester für Fußgängerbrücken und Kühltürme.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-text-main/80">
                    <li>Deutlich geringeres Eigengewicht (Dichte ≈ 1,9 statt 7,85 g/cm³)</li>
                    <li>Geringer Instandhaltungsaufwand</li>
                    <li>Gefahr spröden Abscherens an Schraubanschlüssen</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Makroverbunde (Stahlbeton, Sandwich, VSG) */}
        {activeTab === 'verbundwerkstoffe' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Stahlbeton */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-2 flex items-center gap-2">
                <Flame size={20} className="text-shiraz" />
                1. Stahlbeton: Der Urtyp des konstruktiven Makroverbunds
              </h3>
              <p className="text-sm text-text-main/80 leading-relaxed mb-3">
                Beton besitzt eine hohe Druckfestigkeit (<InlineMath math="f_{\text{ck}} = 20 - 100\,\text{MPa}" />), aber nur eine verschwindend geringe Zugfestigkeit (<InlineMath math="f_{\text{ctm}} \approx 0{,}1 \cdot f_{\text{ck}}" />). Durch das Einbetten von geripptem Betonstahl (B500B mit Streckgrenze <InlineMath math="f_{\text{yk}} = 500\,\text{MPa}" />) in den Zugzonen entsteht ein Verbundwerkstoff, in dem der Stahl die Zugkräfte übernimmt.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-white rounded-lg border border-home-grau/25">
                  <strong className="text-text-main block mb-1">A. Thermische Dehnung</strong>
                  Beton (<InlineMath math="\alpha_T \approx 10 \cdot 10^{-6}\,\text{K}^{-1}" />) und Stahl (<InlineMath math="\alpha_T \approx 12 \cdot 10^{-6}\,\text{K}^{-1}" />) haben eine ähnliche Wärmedehnzahl. Daher entstehen an der Grenzfläche nur geringe thermische Zwangsspannungen.
                </div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/25">
                  <strong className="text-text-main block mb-1">B. Mechanischer Verbund</strong>
                  Kombination aus Adhäsionsverbund (Zementleimhaftung), Scherverbund (Formschluss durch Schrägrippung nach DIN 488) und Reibung.
                </div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/25">
                  <strong className="text-text-main block mb-1">C. Chemischer Korrosionsschutz</strong>
                  Das stark alkalische Porenwasser des Betons (<InlineMath math="\text{pH} \approx 12{,}5 - 13{,}5" />) bildet eine nanometerdünne Passivschicht aus Eisenoxiden auf dem Stahl, die vor Rost schützt, solange keine Karbonatisierung oder Chloride vorliegen.
                </div>
              </div>
            </div>

            {/* Sandwich-Querschnitte & VSG */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-text-main text-base mb-2">2. Sandwichelemente (DIN EN 14509)</h3>
                <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                  Sandwichkonstruktionen bestehen aus zwei dünnen, hochfesten Deckschichten (Stahlblech, Aluminium, GFK) und einem leichten, schubsteifen Kern (PIR-Hartschaum oder Mineralwolle).
                </p>
                <div className="p-3 bg-white rounded-lg border border-home-grau/20 text-xs space-y-1.5">
                  <div><strong>Mechanik:</strong> Die Deckschichten nehmen das Biegemoment als Zug-Druck-Kräftepaar auf; der Kern überträgt Querkräfte über Schub (<InlineMath math="\tau = V / (b \cdot h)" />) und stabilisiert die Deckschichten gegen Knicken (Beulen).</div>
                  <div><strong>Vorteil:</strong> Extrem hohes Verhältnis von Biegesteifigkeit <InlineMath math="EI" /> zu Eigengewicht.</div>
                </div>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-text-main text-base mb-2">3. Verbund-Sicherheitsglas (VSG, DIN 18008)</h3>
                <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                  Verbund aus mindestens zwei Glasscheiben mit einer zähelastischen Polyvinylbutyral-Zwischenfolie (PVB, Dicke meist 0,76 mm oder 1,52 mm).
                </p>
                <div className="p-3 bg-white rounded-lg border border-home-grau/20 text-xs space-y-1.5">
                  <div><strong>Bruchverhalten:</strong> Bei Glasbruch bleiben die Splitter an der Folie haften (Verletzungsschutz).</div>
                  <div><strong>Resttragfähigkeit:</strong> Die Folie hält die gebrochene Scheibe zusammen; ob sie als Absturzsicherung ausreicht, hängt von Aufbau und Lagerung ab und ist nach DIN 18008 nachzuweisen.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Schutzschichten & Grenzflächen */}
        {activeTab === 'schutzschichten' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Schutz mineralischer Untergründe DIN EN 1504-2 */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xxs">
              <h3 className="font-bold text-shiraz text-lg mb-2 flex items-center gap-2">
                <Shield size={20} className="text-shiraz" />
                1. Schutz mineralischer Baustoffe nach DIN EN 1504-2
              </h3>
              <p className="text-sm text-text-main/80 leading-relaxed mb-4">
                Beton- und Mauerwerksflächen müssen gegen kapillares Eindringen von Wasser, Frost-Tausalz, sauren Regen und Chloride geschützt werden. DIN EN 1504-2 unterscheidet drei Produktarten (hydrophobierende Imprägnierung, Imprägnierung, Beschichtung); die nationale Praxis der OS-Systeme führt zusätzlich die Versiegelung:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25">
                  <span className="font-bold text-shiraz block mb-1">A. Hydrophobierung</span>
                  <p className="text-text-main/75 mb-2">
                    Applikation niedermolekularer Silane oder Siloxane. Sie kleiden die Porenwände hydrophob aus (<InlineMath math="\theta > 90^{\circ}" />), <strong>ohne</strong> die Poren zu verschließen.
                  </p>
                  <div className="font-mono text-[11px] bg-white p-1.5 rounded border border-home-grau/20">
                    Wasseraufnahme <InlineMath math="w < 0{,}1\,\text{kg/(m}^2\cdot\text{h}^{0{,}5})" /> · voll diffusionsoffen!
                  </div>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25">
                  <span className="font-bold text-shiraz block mb-1">B. Imprägnierung</span>
                  <p className="text-text-main/75 mb-2">
                    Dünnflüssiges Harz dringt in das Kapillarsystem ein und füllt Porenräume teilweise aus, um die Oberfläche zu verfestigen und Abriebfestigkeit zu steigern.
                  </p>
                  <div className="font-mono text-[11px] bg-white p-1.5 rounded border border-home-grau/20">
                    Porenverengung · mechanische Festigung
                  </div>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25">
                  <span className="font-bold text-shiraz block mb-1">C. Versiegelung</span>
                  <p className="text-text-main/75 mb-2">
                    Erzeugung eines geschlossenen, dünnen Kunststofffilms (<InlineMath math="d < 100\,\mu\text{m}" />) auf der Oberfläche.
                  </p>
                  <div className="font-mono text-[11px] bg-white p-1.5 rounded border border-home-grau/20">
                    Schutz vor Verschmutzung · geringe Rissüberbrückung
                  </div>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25">
                  <span className="font-bold text-shiraz block mb-1">D. Beschichtung (OS-Systeme)</span>
                  <p className="text-text-main/75 mb-2">
                    Dickschichtiger Polymeraufbau (<InlineMath math="d \ge 0{,}2 - 5\,\text{mm}" />, Epoxidharz, Polyurethan) – je nach System starr oder rissüberbrückend.
                  </p>
                  <div className="font-mono text-[11px] bg-white p-1.5 rounded border border-home-grau/20">
                    OS 8 (starr, Tiefgaragen) · OS 11 (rissüberbrückend, Freidecks)
                  </div>
                </div>
              </div>
            </div>

            {/* Korrosionsschutz Stahl DIN EN ISO 12944 */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-text-main text-base mb-2">
                2. Korrosionsschutz von Stahl (DIN EN ISO 12944)
              </h3>
              <p className="text-xs text-text-main/75 leading-relaxed mb-4">
                Stahl korrodiert in Gegenwart von Sauerstoff und Feuchtigkeit elektrochemisch zu Eisenoxiden (<InlineMath math="\text{Fe} \rightarrow \text{Fe}^{2+} + 2e^-" />). Beschichtungssysteme kombinieren drei Schutzwirkungen:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 shadow-xxs">
                  <strong className="text-shiraz block mb-1">1. Barrierewirkung</strong>
                  Dickschichtige Epoxid- oder Polyurethanbeschichtungen trennen den Stahl physisch von Elektrolyt (Wasser) und Sauerstoff. Durch Zugabe von Eisenglimmer (Lamellenpigmente) wird der Diffusionsweg für Wasser künstlich verlängert.
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 shadow-xxs">
                  <strong className="text-shiraz block mb-1">2. Passivierung / Inhibition</strong>
                  Korrosionsschutzpigmente (z. B. Zinkphosphat) reagieren mit eindringender Feuchtigkeit und bilden an der Stahloberfläche schützende Reaktionsschichten, die den anodischen Lösungsprozess verlangsamen.
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 shadow-xxs">
                  <strong className="text-shiraz block mb-1">3. Kathodischer Schutz (Opferanode)</strong>
                  Feuerverzinkung oder Zinkstaubgrundierungen: Zink ist unedler als Eisen (<InlineMath math="E_{\text{Zn}}^{0} = -0{,}76\,\text{V}" /> vs. <InlineMath math="E_{\text{Fe}}^{0} = -0{,}44\,\text{V}" />). Bei mechanischer Beschädigung opfert sich Zink anodisch und schützt den frei liegenden Stahl vor Rost.
                </div>
              </div>
            </div>

            {/* Grenzflächenmechanik & Haftzugprüfung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xxs">
              <h3 className="font-bold text-text-main text-base mb-2 flex items-center gap-2">
                <Activity size={18} className="text-shiraz" />
                3. Grenzflächenhaftung &amp; Abreißversuch nach DIN EN 1542
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                Die Leistungsfähigkeit jeder Beschichtung, jedes Putzes und jedes Reparaturmörtels steht und fällt mit der Haftzugfestigkeit an der Grenzfläche zum Untergrund. Nach DIN EN 1542 wird ein kreisrunder Prüfstempel (<InlineMath math="\varnothing 50\,\text{mm}" />) auf die eingeschnittene Schicht geklebt und per Abreißprüfgerät zentrisch auf Zug belastet.
              </p>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-text-main mb-1">Berechnung der Abreißfestigkeit:</div>
                  <BlockMath math="f_{\text{ct,surf}} = \frac{4 \cdot F_{\text{fail}}}{\pi \cdot d^2} \ge 1{,}5\,\text{MPa} \quad (\text{Mindestanforderung Betoninstandsetzung})" />
                </div>
                <div className="text-text-main/75 space-y-1 border-l md:border-l-2 border-home-grau/30 pl-4">
                  <div><strong>Bruchbild-Analyse:</strong></div>
                  <div>• <em>Bruch im Untergrund (Beton):</em> Optimal! Verbund &gt; Betonzugfestigkeit.</div>
                  <div>• <em>Adhäsionsbruch an der Grenze:</em> Mangelhafte Oberflächenvorbereitung (z. B. Zementschlämme nicht gestrahlt).</div>
                  <div>• <em>Kohäsionsbruch in der Schicht:</em> Schichtmaterial innerlich zu schwach.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Interaktiver Schichtrechner */}
        {activeTab === 'rechner' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-xs text-text-main/80 flex items-center justify-between flex-wrap gap-2">
              <div>
                <strong>Interaktiver Schichtkalkulator:</strong> Konfigurieren Sie den mehrschichtigen Wandaufbau von innen (oben) nach außen (unten). Der Rechner ermittelt Wärmedurchlasswiderstände <InlineMath math="R" />, den U-Wert nach DIN EN ISO 6946 und den Dampfdiffusionswiderstand <InlineMath math="s_d" /> mit Glaser-Feuchteüberprüfung.
              </div>
              <button
                type="button"
                onClick={addLayer}
                className="px-3 py-1.5 bg-shiraz text-white font-bold rounded-lg hover:bg-shiraz/90 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus size={14} /> Schicht hinzufügen
              </button>
            </div>

            {/* Schichten-Tabelle */}
            <div className="overflow-x-auto bg-white rounded-xl border border-home-grau/30 shadow-xxs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-off-white border-b border-home-grau/30 text-text-main font-bold">
                    <th className="p-3">Pos</th>
                    <th className="p-3">Schichtbezeichnung</th>
                    <th className="p-3">Kategorie</th>
                    <th className="p-3">Dicke d [mm]</th>
                    <th className="p-3">Leitfähigkeit λ [W/(m·K)]</th>
                    <th className="p-3">Diffusionszahl μ [-]</th>
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
                          value={layer.thickness}
                          onChange={(e) => updateLayer(layer.id, 'thickness', Math.max(1, parseFloat(e.target.value) || 1))}
                          className="w-20 p-1.5 border border-home-grau/30 rounded bg-white text-text-main text-xs font-mono"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="0.01"
                          max="5.00"
                          step="0.005"
                          value={layer.lambda}
                          onChange={(e) => updateLayer(layer.id, 'lambda', Math.max(0.005, parseFloat(e.target.value) || 0.01))}
                          className="w-24 p-1.5 border border-home-grau/30 rounded bg-white text-text-main text-xs font-mono"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="1"
                          max="100000"
                          step="1"
                          value={layer.mu}
                          onChange={(e) => updateLayer(layer.id, 'mu', Math.max(1, parseFloat(e.target.value) || 1))}
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
                          title="Schicht löschen"
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
                <span className="text-xs text-text-main/60 font-medium">Wärmedurchlasswiderstand RT</span>
                <div className="text-xl font-bold font-mono text-text-main mt-1">
                  {formatDeZahl(calcResults.totalR, 3)} m²K/W
                </div>
                <span className="text-[11px] text-text-main/50 mt-1">
                  inkl. Rsi ({formatDeZahl(rsi, 2)}) + Rse ({formatDeZahl(rse, 2)})
                </span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-home-grau/30 shadow-xxs flex flex-col justify-between">
                <span className="text-xs text-text-main/60 font-medium">Wärmedurchgangskoeffizient U</span>
                <div className={`text-xl font-bold font-mono mt-1 ${calcResults.uValue <= 0.24 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {formatDeZahl(calcResults.uValue, 3)} W/(m²K)
                </div>
                <span className="text-[11px] text-text-main/60 mt-1">
                  {calcResults.uValue <= 0.20 ? '✔ GEG-Standard übertroffen' : calcResults.uValue <= 0.24 ? '✔ GEG-Mindestwert eingehalten' : '⚠️ GEG-Vorgabe (U ≤ 0,24) verfehlt'}
                </span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-home-grau/30 shadow-xxs flex flex-col justify-between">
                <span className="text-xs text-text-main/60 font-medium">Gesamt-Diffusionswiderstand sd</span>
                <div className="text-xl font-bold font-mono text-text-main mt-1">
                  {formatDeZahl(calcResults.totalSd, 2)} m
                </div>
                <span className="text-[11px] text-text-main/50 mt-1">
                  äquivalente Luftschichtdicke
                </span>
              </div>
            </div>

            {/* Hygrothermische Risikobewertung (Feuchte-Ampel) */}
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
                    ? 'Hinweis: mögliches Tauwasserrisiko im Bauteilinneren' 
                    : 'Schichtfolge entspricht der Grundregel (Lehrheuristik)'}
                </h4>
                <p>
                  {calcResults.hasDiffusionTrap ? (
                    <>Die äußeren Schichten weisen einen höheren Diffusionswiderstand auf als die inneren Schichten (äußere Schichten: sd = {formatDeZahl(calcResults.outerLayersSd, 2)} m vs. innere Schichten: sd = {formatDeZahl(calcResults.innerLayersSd, 2)} m). Im Winter diffundierender Wasserdampf kann nicht ungehindert nach außen entweichen und kondensiert an der Grenzfläche zur kalten Dämm- oder Putzschicht. <strong>Empfehlung:</strong> Außen diffusionsoffenere Schichten wählen oder innen eine Dampfbremse/Sperre anordnen.</>
                  ) : (
                    <>Die s_d-Werte nehmen von innen nach außen nicht zu; Wasserdampf kann nach außen abdiffundieren. Vereinfachte Prüfung (Schichten je zur Hälfte innen/außen gewertet) – ersetzt keinen Tauwassernachweis nach DIN 4108-3.</>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Baustoff-Steckbrief Faserverbund */}
        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="faserverbund" />
          </div>
        )}
      </div>

      {/* Formel-Herleitungs-Box nach Modulspezifikation */}
      <FormulaDerivationBox
        title="Bauphysikalische &amp; mechanische Herleitung: Mehrschichtiger Wärmedurchgang &amp; Voigt-Verbund"
        zielGleichung="U = \frac{1}{R_{si} + \sum_{i=1}^n \frac{d_i}{\lambda_i} + R_{se}} \quad \text{sowie} \quad E_{\parallel} = V_f E_f + (1-V_f) E_m"
        normQuelle="DIN EN ISO 6946:2018-03, DIN 4108-3:2024-03 &amp; VDI 2014"
        ergebnisHinweis="U-Wert und s_d-Werte sind vereinfachte Berechnungen (ohne Wärmebrücken und ohne Tauwassernachweis)."
        schritte={[
          {
            titel: "1. Schichtspezifischer Wärmedurchlasswiderstand",
            erklaerung: "Jede Baustoffschicht i setzt dem Wärmestrom einen Widerstand entgegen, der direkt proportional zur Schichtdicke d_i und umgekehrt proportional zur werkstoffspezifischen Wärmeleitfähigkeit λ_i ist.",
            formel: "R_i = \\frac{d_i}{\\lambda_i} \\quad [\\text{m}^2\\text{K/W}]",
            einheit: "m²K/W"
          },
          {
            titel: "2. Gesamter Wärmedurchgangskoeffizient (U-Wert)",
            erklaerung: "Addition der Einzelschichten inklusive der Wärmeübergangswiderstände R_si (innen, horizontal = 0,13 m²K/W) und R_se (außen = 0,04 m²K/W). Der Kehrwert liefert den U-Wert.",
            formel: "U = \\frac{1}{R_T} = \\frac{1}{R_{si} + \\sum_{i=1}^n R_i + R_{se}} \\quad [\\text{W/(m}^2\\text{K)}]",
            einheit: "W/(m²K)"
          },
          {
            titel: "3. Diffusionsäquivalente Luftschichtdicke (sd-Wert)",
            erklaerung: "Produkt aus Schichtdicke d_i und werkstoffspezifischer Wasserdampfdiffusionswiderstandszahl μ_i. Als Grundregel sollte s_d von innen nach außen abnehmen; ein Tauwassernachweis ersetzt das nicht.",
            formel: "s_{d,\\text{ges}} = \\sum_{i=1}^n s_{d,i} = \\sum_{i=1}^n \\mu_i \\cdot d_i \\quad [\\text{m}]",
            einheit: "m"
          },
          {
            titel: "4. Voigt-Mischungsregel für Faserverbunde",
            erklaerung: "Bei Parallelschaltung unter Dehnungsgleichheit (Iso-Strain) summieren sich die Steifigkeiten von Faser und Matrix gewichtet nach ihren Volumenanteilen.",
            formel: "E_{\\parallel} = V_f \\cdot E_f + (1 - V_f) \\cdot E_m \\quad [\\text{GPa}]",
            einheit: "GPa"
          }
        ]}
      />

      {/* Stufe 4 des Lehrpfads: ModulTest */}
      <ModulTest moduleId="kombinationen" title="Selbsttest: Werkstoff-Kombinationen, Schichten &amp; Verbunde" defaultOpen={false} />

      {/* Standardisierter Footer nach RULE[GEMINI_md] */}
      <ModuleFooter
        wikipedia={[
          { title: 'Verbundwerkstoff', url: 'https://de.wikipedia.org/wiki/Verbundwerkstoff' },
          { title: 'Faserverbundwerkstoff', url: 'https://de.wikipedia.org/wiki/Faserverbundwerkstoff' },
          { title: 'Wärmedämmverbundsystem', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmed%C3%A4mmverbundsystem' },
          { title: 'Hinterlüftete Fassade', url: 'https://de.wikipedia.org/wiki/Hinterl%C3%BCftete_Fassade' },
          { title: 'Korrosionsschutz', url: 'https://de.wikipedia.org/wiki/Korrosionsschutz' },
          { title: 'Stahlbeton', url: 'https://de.wikipedia.org/wiki/Stahlbeton' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Scholz, W. (begr.); Möhring, R. (Hrsg.): Baustoffkenntnis. 19. Aufl., Köln: Bundesanzeiger Verlag 2016',
          'Schürmann, H.: Konstruieren mit Faser-Kunststoff-Verbunden. 2. Aufl., Berlin, Heidelberg: Springer 2007',
          'Ehrenstein, G. W.: Faserverbund-Kunststoffe. 2. Aufl., München: Hanser 2006',
          'Fischer, H.-M. et al.: Lehrbuch der Bauphysik. Wiesbaden: Springer Vieweg (Auflage manuell prüfen)'
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 6946:2018-03 (Bauteile – Wärmedurchlasswiderstand und Wärmedurchgangskoeffizient – Berechnungsverfahren)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+6946' },
          { title: 'DIN 4108-3:2024-03 (Wärmeschutz und Energie-Einsparung in Gebäuden – Teil 3: Klimabedingter Feuchteschutz)', url: 'https://www.dinmedia.de/de/suche?q=DIN+4108-3' },
          { title: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA (Eurocode 2: Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1992-1-1' },
          { title: 'DIN EN 1504-2:2005-01 (Produkte und Systeme für den Schutz und die Instandsetzung von Betontragwerken – Teil 2: Oberflächenschutzsysteme)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1504-2' },
          { title: 'DIN EN 1542:1999-07 (Produkte und Systeme für den Schutz und die Instandsetzung von Betontragwerken – Messung der Haftfestigkeit im Abreißversuch)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1542' },
          { title: 'DIN EN ISO 12944-1:2019-01 (Beschichtungsstoffe – Korrosionsschutz von Stahlbauten durch Beschichtungssysteme – Teil 1: Allgemeine Einleitung)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+12944-1' },
          { title: 'DIN 18516-1:2010-06 (Außenwandbekleidungen, hinterlüftet – Teil 1: Anforderungen, Prüfgrundsätze)', url: 'https://www.dinmedia.de/de/suche?q=DIN+18516-1' },
          { title: 'DIN EN 14509:2013-12 (Selbsttragende isolierende Sandwichelemente mit beidseitigen Metalldeckschichten)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+14509' },
          { title: 'VDI 2014 Blatt 3:2006-09 (Entwicklung von Bauteilen aus Faser-Kunststoff-Verbund - Berechnung)', url: 'https://www.dinmedia.de/de/suche?q=VDI+2014+Blatt+3' },
          { title: 'DIN EN ISO 527-4:2023-09 (Kunststoffe – Bestimmung der Zugeigenschaften – Teil 4: Prüfbedingungen für isotrope und anisotrop faserverstärkte Kunststoffverbundwerkstoffe)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+527-4' }
        ]}
        formeln={[
          {
            formel: 'U = \\frac{1}{R_{si} + \\sum_{i=1}^n \\frac{d_i}{\\lambda_i} + R_{se}}',
            erklaerung: 'Wärmedurchgangskoeffizient eines mehrschichtigen opaken Außenbauteils nach DIN EN ISO 6946.',
            quelle: 'DIN EN ISO 6946:2018-03'
          },
          {
            formel: 's_d = \\mu \\cdot d',
            erklaerung: 'Diffusionsäquivalente Luftschichtdicke als Maß für den Wasserdampfdiffusionswiderstand einer Schicht der Dicke d mit Diffusionswiderstandszahl μ.',
            quelle: 'DIN 4108-3:2024-03'
          },
          {
            formel: 'E_{\\parallel} = V_f \\cdot E_f + (1 - V_f) \\cdot E_m',
            erklaerung: 'Voigt-Mischungsregel zur Bestimmung des E-Moduls in Faserrichtung unter Iso-Strain-Bedingung.',
            quelle: 'VDI 2014 Blatt 3'
          },
          {
            formel: 'E_{\\perp} = \\frac{E_f \\cdot E_m}{V_f \\cdot E_m + (1 - V_f) \\cdot E_f}',
            erklaerung: 'Reuss-Mischungsregel zur Bestimmung des E-Moduls quer zur Faserrichtung unter Iso-Stress-Bedingung.',
            quelle: 'VDI 2014 Blatt 3'
          },
          {
            formel: 'f_{\\text{ct,surf}} = \\frac{4 \\cdot F_{\\text{fail}}}{\\pi \\cdot d^2}',
            erklaerung: 'Haftzugfestigkeit im zentrischen Abreißversuch nach DIN EN 1542 mit Prüfstempel d = 50 mm.',
            quelle: 'DIN EN 1542:1999-07'
          }
        ]}
      />
    </div>
  );
}
