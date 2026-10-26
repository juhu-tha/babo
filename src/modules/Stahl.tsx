import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { useState, useMemo } from 'react';
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
  LogarithmicScale,
  Filler,
  type ChartDataset,
  type ChartOptions,
  type Point,
  type ScriptableContext,
} from 'chart.js';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import { Flame, Minimize2, Activity, Sparkles, Layers, BookOpen, Shield } from 'lucide-react';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { steelGrades, corrosionClasses, getReductionFactors, extendedSteelGrades, structuralProfiles, steelCurveDefinitions, calculateSteelStressAtStrain, getSteelDeformationPhase, generateSteelCurveDataPoints } from './stahl/daten';
import type { ExtendedSteelGrade, StructuralProfile, SteelCurveDefinition } from './stahl/daten';
import StahlWerkstoffkunde from './stahl/StahlWerkstoffkunde';
import SpannungsDehnung from './stahl/SpannungsDehnung';
import Stahlsorten from './stahl/Stahlsorten';
import inhalt from '@/content/stahl/Stahl.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
export type { ExtendedSteelGrade } from './stahl/daten';
export type { StructuralProfile } from './stahl/daten';
export { extendedSteelGrades } from './stahl/daten';
export { structuralProfiles } from './stahl/daten';
export type { SteelCurveDefinition } from './stahl/daten';
export { steelCurveDefinitions } from './stahl/daten';
export { calculateSteelStressAtStrain } from './stahl/daten';
export { getSteelDeformationPhase } from './stahl/daten';
export { generateSteelCurveDataPoints } from './stahl/daten';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
  Filler
);

type StahlReiter = 'steckbrief' | 'spannungsdehnung' | 'stahlsorten' | 'allgemein' | 'walzen' | 'schweissen' | 'legierungen';
const REITER: readonly ModulTab<StahlReiter>[] = [
  { id: 'steckbrief', label: 'Baustoff-Steckbrief', icon: BookOpen },
  { id: 'spannungsdehnung', label: 'Spannungs-Dehnungs-Linien', icon: Activity },
  { id: 'stahlsorten', label: inhalt.texte.stahlwerkstoffeGüten.trim(), icon: Layers },
  { id: 'allgemein', label: inhalt.texte.allgemeinErmüdung.trim(), icon: Shield },
  { id: 'walzen', label: inhalt.texte.walzprofileEigenspannungen.trim(), icon: Minimize2 },
  { id: 'schweissen', label: 'Schweißverbindungen', icon: Flame },
  { id: 'legierungen', label: inhalt.texte.legierungenEdelstahl.trim(), icon: Sparkles },
];

export default function Stahl() {
  const [activeTab, setActiveTab] = useState<StahlReiter>('spannungsdehnung');

  // Spannungs-Dehnungs-Linien State
  const [selectedCurves, setSelectedCurves] = useState<string[]>(['S235', 'S355', 'S460', 'S690', 'B500B', 'Edelstahl']);
  const [strainZoom, setStrainZoom] = useState<'auto' | 'detail' | 'work' | 'full'>('auto');
  const [testStrain, setTestStrain] = useState<number>(1.5);
  const [simGradeId, setSimGradeId] = useState<string>('S235');

  const [grade, setGrade] = useState<keyof typeof steelGrades>('S355');
  const [corrosion, setCorrosion] = useState<keyof typeof corrosionClasses>('C3');
  const [temp, setTemp] = useState(20);
  const [detailCategory, setDetailCategory] = useState(80);
  const [deltaSigma, setDeltaSigma] = useState(150);
  const [m1, setM1] = useState(3);

  // Alloys State
  const [alloyCr, setAlloyCr] = useState<number>(18.0); // %
  const [alloyNi, setAlloyNi] = useState<number>(8.0); // %
  const [alloyMo, setAlloyMo] = useState<number>(0.0); // %
  const [alloyC, setAlloyC] = useState<number>(0.06); // %

  // Walzen State
  const [profileType, setProfileType] = useState<'h' | 'i'>('h'); // H-Profil (HEB) oder I-Profil (IPE)
  
  // Schweißen State
  const [heatInput, setHeatInput] = useState(1500); // J/mm
  const [plateThickness, setPlateThickness] = useState(15); // mm

  // Stahlsorten Visualizer & Rechner State
  const [steelCatalogFilter, setSteelCatalogFilter] = useState<'all' | 'baustahl' | 'bewehrung' | 'spannstahl' | 'edelstahl'>('all');
  const [reinforcementDeepDiveTab, setReinforcementDeepDiveTab] = useState<'bewehrung' | 'spannstahl'>('bewehrung');
  const [selectedStahlsorteId, setSelectedStahlsorteId] = useState<string>('S355');
  const [designMoment, setDesignMoment] = useState<number>(120); // kNm
  const [selectedProfileId, setSelectedProfileId] = useState<string>('IPE200');

  const filteredSteelGrades = useMemo(() => {
    if (steelCatalogFilter === 'all') return extendedSteelGrades;
    return extendedSteelGrades.filter(g => g.category === steelCatalogFilter);
  }, [steelCatalogFilter]);

  const activeProfile = useMemo(() => {
    return structuralProfiles.find(p => p.id === selectedProfileId) || structuralProfiles[0];
  }, [selectedProfileId]);

  const activeGradedData = useMemo(() => {
    return extendedSteelGrades.find(g => g.id === selectedStahlsorteId) || extendedSteelGrades[1];
  }, [selectedStahlsorteId]);

  const { fy, fu } = steelGrades[grade];
  const E0 = 210000; // MPa

  const { ky, kE } = getReductionFactors(temp);
  const fy_T = fy * ky;
  const E_T = E0 * kE;

  const walzResults = useMemo(() => {
    const labels = [];
    const stressData = [];
    
    // Vereinfachtes Eigenspannungsmodell für Flansche von Walzprofilen
    // Druckspannungen an den Rändern (kühlen schneller ab), Zugspannungen in der Mitte (kühlen langsamer ab)
    const points = 50;
    const width = 100; // % der Flanschbreite
    
    // Max Druckspannung an den Rändern (typischerweise 0.3 bis 0.5 f_y)
    const maxCompressiveRatio = profileType === 'h' ? 0.5 : 0.3; 
    const maxCompressive = -maxCompressiveRatio * fy;
    
    // Max Zugspannung in der Mitte (Gleichgewicht)
    const maxTensile = (maxCompressiveRatio / 2) * fy;

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width - width / 2; // -50% to 50%
      labels.push(`${x.toFixed(0)}%`);
      
      // Parabelform für die Eigenspannungsverteilung
      // sigma(x) = a * x^2 + c
      // Rand: x = 50 -> sigma = maxCompressive
      // Mitte: x = 0 -> sigma = maxTensile
      const a = (maxCompressive - maxTensile) / Math.pow(50, 2);
      const sigma = a * Math.pow(x, 2) + maxTensile;
      
      stressData.push(sigma);
    }

    return {
      maxCompressive,
      maxTensile,
      chartData: {
        labels,
        datasets: [
          {
            label: inhalt.werte.eigenspannungResMpa,
            data: stressData,
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
            pointRadius: 0
          },
          {
            label: inhalt.werte.fließgrenzeFYZug,
            data: labels.map(() => fy),
            borderColor: '#A3113E',
            borderDash: [5, 5],
            borderWidth: 1,
            pointRadius: 0,
            fill: false
          },
          {
            label: inhalt.werte.fließgrenzeFYDruck,
            data: labels.map(() => -fy),
            borderColor: '#A3113E',
            borderDash: [5, 5],
            borderWidth: 1,
            pointRadius: 0,
            fill: false
          }
        ]
      }
    };
  }, [fy, profileType]);

  const weldResults = useMemo(() => {
    const labels = [];
    const stressData = [];
    
    const points = 200;
    const distance = 150; // mm von der Schweißnahtmitte
    
    // Lehrmodell (Näherung nach Okerblom/Masubuchi), keine Bemessungsgrundlage
    // Max Zugspannung in der Schweißnaht entspricht meist der Fließgrenze
    const sigma_max = fy; 
    
    // Breite der Zugzone hängt von der Streckenenergie (Heat Input) und Blechdicke ab
    // Q = Heat Input (J/mm), t = thickness (mm)
    // Breite b_t proportional zu Q / t
    const b_t = Math.max(10, (heatInput / plateThickness) * 0.15); 

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * 2 * distance - distance; 
      labels.push(x.toFixed(0));
      
      // Näherungsfunktion für Längseigenspannungen
      // sigma(x) = sigma_max * (1 - (x/b_t)^2) * exp(-0.5 * (x/b_t)^2)
      const ratio = x / b_t;
      const sigma = sigma_max * (1 - Math.pow(ratio, 2)) * Math.exp(-0.5 * Math.pow(ratio, 2));
      
      stressData.push(sigma);
    }

    return {
      b_t,
      chartData: {
        labels,
        datasets: [
          {
            label: inhalt.werte.längsEigenspannungResMpa,
            data: stressData,
            borderColor: '#64748b',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0
          },
          {
            label: inhalt.werte.fließgrenzeFY,
            data: labels.map(() => fy),
            borderColor: '#A3113E',
            borderDash: [5, 5],
            borderWidth: 1,
            pointRadius: 0,
            fill: false
          }
        ]
      }
    };
  }, [fy, heatInput, plateThickness]);

  const stressStrainData = useMemo(() => {
    const eps = [];
    const sig20 = [];
    const sigT = [];

    for (let e = 0; e <= 0.2; e += 0.005) {
      eps.push(e);
      
      // 20°C Curve (Simplified bi-linear with hardening)
      const eps_y20 = fy / E0;
      if (e <= eps_y20) sig20.push(e * E0);
      else if (e <= 0.02) sig20.push(fy);
      else sig20.push(fy + (fu - fy) * ((e - 0.02) / 0.18));

      // T°C Curve
      const eps_yT = fy_T / E_T;
      if (e <= eps_yT) sigT.push(e * E_T);
      else if (e <= 0.02) sigT.push(fy_T);
      else sigT.push(fy_T + (fu * ky - fy_T) * ((e - 0.02) / 0.18));
    }

    return {
      labels: eps.map(e => (e * 100).toFixed(1)),
      datasets: [
        {
          label: inhalt.werte.spannungBei20C,
          data: sig20,
          borderColor: '#cbd5e1',
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0,
        },
        {
          label: `Spannung bei ${formatDeWert(temp)}°C`,
          data: sigT,
          borderColor: '#A3113E',
          backgroundColor: 'rgba(255, 3, 80, 0.1)',
          fill: true,
          borderWidth: 3,
          pointRadius: 0,
        }
      ]
    };
  }, [fy, fu, E0, fy_T, E_T, ky, temp]);

  const { nR, woehlerData } = useMemo(() => {
    const N_values = [1e4, 1e5, 2e6, 5e6, 1e7, 1e8];
    const delta_sigma = [];

    const nC = 2000000;
    const deltaSigmaC = detailCategory;
    
    const deltaSigmaD = deltaSigmaC * Math.pow(nC / 5e6, 1/m1);
    const deltaSigmaL = deltaSigmaD * Math.pow(5e6 / 1e8, 1/5);

    let nR = 0;
    if (deltaSigma > 0) {
      if (deltaSigma > deltaSigmaD) {
        nR = nC * Math.pow(deltaSigmaC / deltaSigma, m1);
      } else if (deltaSigma > deltaSigmaL) {
        nR = 5e6 * Math.pow(deltaSigmaD / deltaSigma, 5);
      } else {
        nR = Infinity;
      }
    }

    for (const N of N_values) {
      if (N <= 5e6) {
        delta_sigma.push(deltaSigmaC * Math.pow(nC / N, 1/m1));
      } else if (N <= 1e8) {
        delta_sigma.push(deltaSigmaD * Math.pow(5e6 / N, 1/5));
      } else {
        delta_sigma.push(deltaSigmaL);
      }
    }

    const chartData = {
      labels: N_values,
      datasets: [
        {
          label: `Wöhlerlinie (Kerbfall Δσ_C = ${formatDeWert(detailCategory)})`,
          data: delta_sigma,
          borderColor: '#A3113E',
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: '#A3113E',
          fill: false,
        },
        {
          label: inhalt.werte.aktuelleBelastung,
          data: N_values.map(n => (Math.abs(Math.log10(n) - Math.log10(nR)) < 0.2) ? deltaSigma : null),
          borderColor: '#A3113E',
          backgroundColor: '#A3113E',
          pointRadius: 8,
          pointStyle: 'crossRot',
          borderWidth: 3,
          showLine: false,
        }
      ]
    };
    return { nR, woehlerData: chartData };
  }, [detailCategory, deltaSigma, m1]);

  // Aktive simulierte Stahlsorte für Dehnungsschieber
  const activeSimSteel = useMemo(() => {
    return steelCurveDefinitions.find(s => s.id === simGradeId) || steelCurveDefinitions[0];
  }, [simGradeId]);

  const activeCurveDefs = useMemo(() => {
    return steelCurveDefinitions.filter(s => selectedCurves.includes(s.id));
  }, [selectedCurves]);

  const maxActiveStress = useMemo(() => {
    if (activeCurveDefs.length === 0) return 600;
    return Math.max(...activeCurveDefs.map(s => s.fu));
  }, [activeCurveDefs]);

  const maxActiveStrain = useMemo(() => {
    if (activeCurveDefs.length === 0) return 25;
    return Math.max(...activeCurveDefs.map(s => s.A));
  }, [activeCurveDefs]);

  const simStress = useMemo(() => {
    return calculateSteelStressAtStrain(activeSimSteel, testStrain);
  }, [activeSimSteel, testStrain]);

  const simPhase = useMemo(() => {
    return getSteelDeformationPhase(activeSimSteel, testStrain);
  }, [activeSimSteel, testStrain]);

  // Chart-Datensätze für Spannungs-Dehnungs-Linien (Lineare Skala)
  const stressStrainMultiData = useMemo(() => {
    const activeDefs = activeCurveDefs;
    
    const datasets: ChartDataset<'line', Point[]>[] = activeDefs.map(def => {
      const pts = generateSteelCurveDataPoints(def);
      return {
        label: `${def.name} (fy = ${formatDeWert(def.fy)} MPa)`,
        data: pts,
        borderColor: def.color,
        backgroundColor: `${def.color}15`,
        borderWidth: def.id === simGradeId ? 3.5 : 2.2,
        tension: 0.15,
        pointRadius: 0,
        pointHoverRadius: 5,
      };
    });

    // Prüfdehnungs-Linie (vertikale Markierung)
    if (testStrain > 0) {
      const markerTop = Math.max(400, Math.ceil((maxActiveStress * 1.15) / 50) * 50);
      datasets.push({
        label: `Prüfdehnung ε = ${formatDeZahl(testStrain, 1)} %`,
        data: [
          { x: testStrain, y: 0 },
          { x: testStrain, y: markerTop }
        ],
        borderColor: '#64748b',
        borderDash: [4, 4],
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
      });

      // Schnittpunkt-Marker für die gewählte Bezugs-Stahlsorte
      if (simStress > 0) {
        datasets.push({
          label: `${activeSimSteel.name} @ ε = ${formatDeZahl(testStrain, 1)}% (${formatDeZahl(simStress, 0)} MPa)`,
          data: [{ x: testStrain, y: simStress }],
          borderColor: activeSimSteel.color,
          backgroundColor: '#ffffff',
          pointRadius: 7,
          pointBorderWidth: 3,
          showLine: false,
        });
      }
    }

    return { datasets };
  }, [activeCurveDefs, maxActiveStress, simGradeId, testStrain, activeSimSteel, simStress]);

  const stressStrainChartOptions = useMemo(() => {
    let maxX = 50;
    let stepX = 5;

    if (strainZoom === 'detail') {
      maxX = 3.0;
      stepX = 0.5;
    } else if (strainZoom === 'work') {
      maxX = 15.0;
      stepX = 2.0;
    } else if (strainZoom === 'full') {
      maxX = 50.0;
      stepX = 5.0;
    } else {
      // 'auto': Automatische Skalierung basierend auf den aktuell gewählten Kurven
      if (maxActiveStrain <= 4.5) {
        maxX = 5.0;
        stepX = 0.5;
      } else if (maxActiveStrain <= 7.0) {
        maxX = 8.0;
        stepX = 1.0;
      } else if (maxActiveStrain <= 15.0) {
        maxX = Math.ceil(maxActiveStrain * 1.12);
        stepX = 2.0;
      } else if (maxActiveStrain <= 30.0) {
        maxX = Math.ceil(maxActiveStrain * 1.10 / 5) * 5;
        stepX = 5.0;
      } else {
        maxX = 50.0;
        stepX = 5.0;
      }
    }

    // Y-Achse dynamisch skalieren: automatische Obergrenze mit 12% Headroom
    const suggestedMaxY = Math.max(350, Math.ceil((maxActiveStress * 1.12) / 50) * 50);
    const stepY = suggestedMaxY >= 1800 ? 250 : suggestedMaxY >= 900 ? 100 : 50;

    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 350
      },
      scales: {
        x: {
          type: 'linear' as const,
          min: 0,
          max: maxX,
          title: {
            display: true,
            text: inhalt.werte.dehnung,
            font: { family: 'Work Sans', weight: 'bold' as const, size: 12 },
            color: '#1e293b'
          },
          ticks: {
            stepSize: stepX,
            callback: (v) => `${v} %`,
            font: { size: 11, weight: 'bold' as const },
            color: '#475569'
          },
          grid: { color: 'rgba(0,0,0,0.06)' }
        },
        y: {
          min: 0,
          max: suggestedMaxY,
          title: {
            display: true,
            text: inhalt.werte.spannungMpaBzwN,
            font: { family: 'Work Sans', weight: 'bold' as const, size: 12 },
            color: '#A3113E'
          },
          ticks: {
            stepSize: stepY,
            callback: (v) => `${v} MPa`,
            font: { size: 11 },
            color: '#64748b'
          },
          grid: { color: 'rgba(0,0,0,0.06)' }
        }
      },
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            boxWidth: 12,
            usePointStyle: true,
            font: { family: 'Work Sans', size: 11, weight: 'bold' as const }
          }
        },
        tooltip: {
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const xVal = items[0].parsed.x;
              return `Dehnung ε = ${formatDeZahl(xVal, 2)} % (${formatDeZahl(((xVal ?? 0) * 10), 1)} ‰)`;
            },
            label: (context) => {
              const yVal = context.parsed.y;
              return `${context.dataset.label}: ${formatDeZahl(yVal, 1)} MPa`;
            }
          }
        }
      }
    } satisfies ChartOptions<'line'>;
  }, [strainZoom, maxActiveStrain, maxActiveStress]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Activity className="text-shiraz" /><MdText text={inhalt.texte.stahlImBauwesen} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.stahlIstEinerDer} /></p>
        </div>

        <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="flex flex-col gap-6 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20">

        {(activeTab === 'allgemein' || activeTab === 'walzen' || activeTab === 'schweissen' || activeTab === 'legierungen') && <StahlWerkstoffkunde activeTab={activeTab} alloyC={alloyC} alloyCr={alloyCr} alloyMo={alloyMo} alloyNi={alloyNi} corrosion={corrosion} deltaSigma={deltaSigma} detailCategory={detailCategory} fy={fy} grade={grade} heatInput={heatInput} kE={kE} ky={ky} m1={m1} nR={nR} plateThickness={plateThickness} profileType={profileType} setAlloyC={setAlloyC} setAlloyCr={setAlloyCr} setAlloyMo={setAlloyMo} setAlloyNi={setAlloyNi} setCorrosion={setCorrosion} setDeltaSigma={setDeltaSigma} setDetailCategory={setDetailCategory} setGrade={setGrade} setHeatInput={setHeatInput} setM1={setM1} setPlateThickness={setPlateThickness} setProfileType={setProfileType} setTemp={setTemp} stressStrainData={stressStrainData} temp={temp} walzResults={walzResults} weldResults={weldResults} woehlerData={woehlerData} />}

      {/* 2. REITER: SPANNUNGS-DEHNUNGS-LINIEN UNTERSCHIEDLICHER STAHLSORTEN */}
      {activeTab === 'spannungsdehnung' && <SpannungsDehnung activeSimSteel={activeSimSteel} selectedCurves={selectedCurves} setSelectedCurves={setSelectedCurves} setSimGradeId={setSimGradeId} setStrainZoom={setStrainZoom} setTestStrain={setTestStrain} simGradeId={simGradeId} simPhase={simPhase} simStress={simStress} strainZoom={strainZoom} stressStrainChartOptions={stressStrainChartOptions} stressStrainMultiData={stressStrainMultiData} testStrain={testStrain} />}

      {/* 3. REITER: STAHLWERKSTOFFE, GÜTEN, BEWEHRUNGS- & SPANNSTÄHLE */}
      {activeTab === 'stahlsorten' && <Stahlsorten activeGradedData={activeGradedData} activeProfile={activeProfile} designMoment={designMoment} filteredSteelGrades={filteredSteelGrades} reinforcementDeepDiveTab={reinforcementDeepDiveTab} selectedProfileId={selectedProfileId} selectedStahlsorteId={selectedStahlsorteId} setDesignMoment={setDesignMoment} setReinforcementDeepDiveTab={setReinforcementDeepDiveTab} setSelectedProfileId={setSelectedProfileId} setSelectedStahlsorteId={setSelectedStahlsorteId} setSteelCatalogFilter={setSteelCatalogFilter} steelCatalogFilter={steelCatalogFilter} />}

      {activeTab === 'steckbrief' && (
        <div className="animate-in fade-in duration-300">
          <BaustoffProfil materialKey="stahl" />
        </div>
      )}
        </ModuleTabs>
      </div>
    
      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielPlastischerBiegewiders}
        zielGleichung="M_{pl,Rd} = \frac{W_{pl,y} \cdot f_y}{\gamma_{M0}}"
        normQuelle={inhalt.werte.dinEn19931}
        schritte={inhalt.daten["Stahl.schritte"]}
        ergebnisHinweis={inhalt.werte.ausnutzung54BiegedrillknickenUnd}
      />

      <ModulTest moduleId="stahl" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Stahlbau', url: 'https://de.wikipedia.org/wiki/Stahlbau' },
          { title: inhalt.werte.ermüdungWerkstoff, url: 'https://de.wikipedia.org/wiki/Materialerm%C3%BCdung' },
          { title: 'Schweißen', url: 'https://de.wikipedia.org/wiki/Schwei%C3%9Fen' },
          { title: 'Stahlsorte', url: 'https://de.wikipedia.org/wiki/Stahlsorte' }
        ]}
        literatur={inhalt.daten["Stahl.literatur"]}
        regelwerke={inhalt.daten["Stahl.regelwerke"]}
        weblinks={inhalt.daten["Stahl.weblinks"]}
        formeln={inhalt.daten["Stahl.formeln"]}
      />
    </div>
  );
}