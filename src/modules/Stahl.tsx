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
import { Flame, Minimize2, Activity, Sparkles, Layers, BookOpen, Shield, Thermometer } from 'lucide-react';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { stahlBrand, woehlerEc3, walzEigenspannung, schweissEigenspannung } from '@/src/calc/werkstoffmodelle';
import { steelGrades, corrosionClasses, extendedSteelGrades, structuralProfiles, steelCurveDefinitions, calculateSteelStressAtStrain, getSteelDeformationPhase, generateSteelCurveDataPoints } from './stahl/daten';
import type { ExtendedSteelGrade, StructuralProfile, SteelCurveDefinition } from './stahl/daten';
import StahlWerkstoffkunde from './stahl/StahlWerkstoffkunde';
import SpannungsDehnung from './stahl/SpannungsDehnung';
import Stahlsorten from './stahl/Stahlsorten';
import inhalt from '@/content/stahl/Stahl.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { GruppierteModuleTabs, type ModulTabGruppe } from '@/src/components/ui/GruppierteModuleTabs';
import EisenKohlenstoff, { EISEN_KOHLENSTOFF_FUSS } from './stahl/EisenKohlenstoff';
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

type StahlReiter = 'steckbrief' | 'spannungsdehnung' | 'eisenkohlenstoff' | 'stahlsorten' | 'allgemein' | 'walzen' | 'schweissen' | 'legierungen';
// Höchstens 7 Hauptreiter (AP 3.8): Fe-C-Diagramm und Stahlsorten als Gruppe „Gefüge & Stahlsorten“
const REITER: readonly ModulTabGruppe<StahlReiter>[] = [
  { id: 'steckbrief', label: 'Baustoff-Steckbrief', icon: BookOpen, mitglieder: [{ id: 'steckbrief', label: 'Baustoff-Steckbrief', icon: BookOpen }] },
  { id: 'spannungsdehnung', label: 'Spannungs-Dehnungs-Linien', icon: Activity, mitglieder: [{ id: 'spannungsdehnung', label: 'Spannungs-Dehnungs-Linien', icon: Activity }] },
  { id: 'gefuege', label: 'Gefüge & Stahlsorten', icon: Layers, mitglieder: [
    { id: 'eisenkohlenstoff', label: 'Eisen-Kohlenstoff-Diagramm', icon: Thermometer },
    { id: 'stahlsorten', label: inhalt.texte.stahlwerkstoffeGüten.trim(), icon: Layers },
  ] },
  { id: 'allgemein', label: inhalt.texte.allgemeinErmüdung.trim(), icon: Shield, mitglieder: [{ id: 'allgemein', label: inhalt.texte.allgemeinErmüdung.trim(), icon: Shield }] },
  { id: 'walzen', label: inhalt.texte.walzprofileEigenspannungen.trim(), icon: Minimize2, mitglieder: [{ id: 'walzen', label: inhalt.texte.walzprofileEigenspannungen.trim(), icon: Minimize2 }] },
  { id: 'schweissen', label: 'Schweißverbindungen', icon: Flame, mitglieder: [{ id: 'schweissen', label: 'Schweißverbindungen', icon: Flame }] },
  { id: 'legierungen', label: inhalt.texte.legierungenEdelstahl.trim(), icon: Sparkles, mitglieder: [{ id: 'legierungen', label: inhalt.texte.legierungenEdelstahl.trim(), icon: Sparkles }] },
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

  // Brandfall: k_y,θ und k_E,θ nach DIN EN 1993-1-2 und vereinfachte σ-ε-Linie (Rechenkern)
  const brand = useMemo(() => stahlBrand({ fy, fu, theta: temp }), [fy, fu, temp]);
  const { ky, kE } = brand;

  const walzResults = useMemo(() => {
    // Parabolische Eigenspannung im Flansch (Rechenkern): Druck am Rand, Zug in der Mitte, Gleichgewicht
    const w = walzEigenspannung(fy, profileType);
    const labels = w.verlauf.map(p => `${formatDeZahl(p.x, 0)}%`);
    const stressData = w.verlauf.map(p => p.sigma);
    const maxCompressive = w.maxDruck;
    const maxTensile = w.maxZug;

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
    // Lehrmodell (Näherung nach Okerblom/Masubuchi), keine Bemessungsgrundlage – Rechenkern
    const w = schweissEigenspannung({ fy, streckenenergie: heatInput, blechdicke: plateThickness });
    const labels = w.verlauf.map(p => formatDeZahl(p.x, 0));
    const stressData = w.verlauf.map(p => p.sigma);
    const b_t = w.bt;

    return {
      b_t,
      hinweise: w.hinweise,
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
    const eps = brand.kurve.map(p => p.eps);
    const sig20 = brand.kurve.map(p => p.sig20);
    const sigT = brand.kurve.map(p => p.sigT);

    return {
      labels: eps.map(e => formatDeZahl(e * 100, 1)),
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
  }, [brand, temp]);

  const { nR, woehlerData, woehlerHinweise } = useMemo(() => {
    // Wöhlerlinie nach DIN EN 1993-1-9, 7.1 (Rechenkern)
    const w = woehlerEc3({ deltaSigmaC: detailCategory, m: m1, deltaSigma });
    const N_values = w.kurve.map(p => p.N);
    const delta_sigma = w.kurve.map(p => p.deltaSigma);
    const nR = w.nR;

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
    return { nR, woehlerData: chartData, woehlerHinweise: [...brand.hinweise, ...w.hinweise] };
  }, [detailCategory, deltaSigma, m1, brand]);

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

        <GruppierteModuleTabs label={inhalt.werte.reiterBereiche} gruppen={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="flex flex-col gap-6 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20">

        {(activeTab === 'allgemein' || activeTab === 'walzen' || activeTab === 'schweissen' || activeTab === 'legierungen') && <StahlWerkstoffkunde activeTab={activeTab} alloyC={alloyC} alloyCr={alloyCr} alloyMo={alloyMo} alloyNi={alloyNi} corrosion={corrosion} deltaSigma={deltaSigma} detailCategory={detailCategory} fy={fy} grade={grade} heatInput={heatInput} kE={kE} ky={ky} m1={m1} nR={nR} hinweiseErmuedung={woehlerHinweise} hinweiseSchweissen={weldResults.hinweise} plateThickness={plateThickness} profileType={profileType} setAlloyC={setAlloyC} setAlloyCr={setAlloyCr} setAlloyMo={setAlloyMo} setAlloyNi={setAlloyNi} setCorrosion={setCorrosion} setDeltaSigma={setDeltaSigma} setDetailCategory={setDetailCategory} setGrade={setGrade} setHeatInput={setHeatInput} setM1={setM1} setPlateThickness={setPlateThickness} setProfileType={setProfileType} setTemp={setTemp} stressStrainData={stressStrainData} temp={temp} walzResults={walzResults} weldResults={weldResults} woehlerData={woehlerData} />}

      {/* 2. REITER: SPANNUNGS-DEHNUNGS-LINIEN UNTERSCHIEDLICHER STAHLSORTEN */}
      {activeTab === 'spannungsdehnung' && <SpannungsDehnung activeSimSteel={activeSimSteel} selectedCurves={selectedCurves} setSelectedCurves={setSelectedCurves} setSimGradeId={setSimGradeId} setStrainZoom={setStrainZoom} setTestStrain={setTestStrain} simGradeId={simGradeId} simPhase={simPhase} simStress={simStress} strainZoom={strainZoom} stressStrainChartOptions={stressStrainChartOptions} stressStrainMultiData={stressStrainMultiData} testStrain={testStrain} />}

      {/* 3. REITER: STAHLWERKSTOFFE, GÜTEN, BEWEHRUNGS- & SPANNSTÄHLE */}
      {activeTab === 'stahlsorten' && <Stahlsorten activeGradedData={activeGradedData} activeProfile={activeProfile} designMoment={designMoment} filteredSteelGrades={filteredSteelGrades} reinforcementDeepDiveTab={reinforcementDeepDiveTab} selectedProfileId={selectedProfileId} selectedStahlsorteId={selectedStahlsorteId} setDesignMoment={setDesignMoment} setReinforcementDeepDiveTab={setReinforcementDeepDiveTab} setSelectedProfileId={setSelectedProfileId} setSelectedStahlsorteId={setSelectedStahlsorteId} setSteelCatalogFilter={setSteelCatalogFilter} steelCatalogFilter={steelCatalogFilter} />}

      {activeTab === 'eisenkohlenstoff' && <EisenKohlenstoff />}

      {activeTab === 'steckbrief' && (
        <div className="animate-in fade-in duration-300">
          <BaustoffProfil materialKey="stahl" />
        </div>
      )}
        </GruppierteModuleTabs>
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
        literatur={[...(inhalt.daten["Stahl.literatur"]), ...EISEN_KOHLENSTOFF_FUSS.literatur]}
        regelwerke={inhalt.daten["Stahl.regelwerke"]}
        weblinks={[...(inhalt.daten["Stahl.weblinks"]), ...EISEN_KOHLENSTOFF_FUSS.weblinks]}
        formeln={[...(inhalt.daten["Stahl.formeln"]), ...EISEN_KOHLENSTOFF_FUSS.formeln]}
      />
    </div>
  );
}