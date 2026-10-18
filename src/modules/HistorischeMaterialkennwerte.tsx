import React, { useState, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Line } from 'react-chartjs-2';
import { BlockMath, InlineMath } from 'react-katex';
import { designLognormal, charValue, fckFromInSitu, classFor, fkMasonry, fdMasonry } from '@/src/utils/bestandKern';
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
import { 
  Database, 
  Calculator, 
  Settings, 
  CheckCircle, 
  ArrowRight, 
  Percent, 
  Ruler, 
  Scale, 
  BookOpen, 
  Droplets, 
  AlertTriangle, 
  Activity, 
  FileText, 
  Layers,
  ShieldCheck,
  History as HistoryIcon,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { MaterialCategory, historicalData } from '@/src/data/historicalMaterialsData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function HistorischeMaterialkennwerte() {
  // Main toggle between Database, Laboratory Converter and Existing Structures Design tabs
  const [mainTab, setMainTab] = useState<'datenbank' | 'rechner_labor' | 'nachweis_bestand'>('datenbank');

  // Database Tab States
  const [activeCategory, setActiveCategory] = useState<MaterialCategory>('beton');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const currentData = historicalData[activeCategory];

  // Rechner / Labor Tab States
  type TestProbeType = 'beton_bohrkern' | 'mauerwerk_ziegel' | 'stahl_zugprobe';
  const [probeType, setProbeType] = useState<TestProbeType>('beton_bohrkern');

  // Concrete drill core inputs
  const [coreDiameter, setCoreDiameter] = useState<number>(100);
  const [coreHeight, setCoreHeight] = useState<number>(100);
  const [failureForceKn, setFailureForceKn] = useState<number>(250);
  const [coreMoisture, setCoreMoisture] = useState<'standard' | 'nass' | 'trocken'>('standard');
  const [coreRebar, setCoreRebar] = useState<'none' | 'minor' | 'critical'>('none');

  // Masonry brick laboratory specimen inputs
  const [brickWidth, setBrickWidth] = useState<number>(115);
  const [brickLength, setBrickLength] = useState<number>(240);
  const [brickHeight, setBrickHeight] = useState<number>(71);
  const [brickForceKn, setBrickForceKn] = useState<number>(150);
  const [mortarStrength, setMortarStrength] = useState<number>(5.0); // f_m in MPa

  // Steel tension sample inputs
  const [steelForm, setSteelForm] = useState<'flat' | 'round'>('round');
  const [steelWidth, setSteelWidth] = useState<number>(20);
  const [steelThickness, setSteelThickness] = useState<number>(10);
  const [steelDiameter, setSteelDiameter] = useState<number>(12);
  const [steelForceYieldKn, setSteelForceYieldKn] = useState<number>(32);
  const [steelForceTensileKn, setSteelForceTensileKn] = useState<number>(48);

  // Tab 3: Bestandsnachweis / DBV & EN 1990-2:2026 States
  const [nachweisMaterial, setNachweisMaterial] = useState<'stahl' | 'beton' | 'mauerwerk'>('stahl');
  const [failureDuctility, setFailureDuctility] = useState<'duktil' | 'sproed'>('duktil');
  const [sampleMean, setSampleMean] = useState<number>(260); // f_ym in N/mm²
  const [sampleCov, setSampleCov] = useState<number>(0.08); // V_f (z.B. 0.08 für homogenen Stahl)
  const [targetBeta, setTargetBeta] = useState<number>(3.8); // Beta (3.8 für 50 Jahre, 3.3 für 30 Jahre Restnutzung)
  const [alphaR, setAlphaR] = useState<number>(0.8); // Sensitivitätsfaktor alpha_R = 0.8
  const [gammaRd, setGammaRd] = useState<number>(1.1); // Modellunsicherheit γ_Rd
  // Bohrkern-Stichprobe: In-situ-Festigkeiten aller Kerne (N/mm²), kommagetrennt
  const [coreSeriesText, setCoreSeriesText] = useState<string>('24,8; 27,1; 22,9; 26,4; 25,3; 23,7');
  const [measuredGeometry, setMeasuredGeometry] = useState<boolean>(true); // Querschnitt gemessen

  // Math Memo for Tab 3 according to DBV-Merkblatt & EN 1990-2:2026
  const nachweisCalc = useMemo(() => {
    const f_m = sampleMean;
    const V = sampleCov;
    const beta = targetBeta;
    const aR = alphaR;

    // 1. Charakteristischer Wert (5%-Quantil der Grundgesamtheit):
    const f_k = Math.max(0.1, f_m * (1 - 1.645 * V));

    // 2. Teilsicherheitsbeiwerte nach Eurocode (Neubau):
    //    Baustahl γ_M0 = 1,0 (EC3), Beton γ_c = 1,5 (EC2), Mauerwerk γ_M = 1,5 (EC6/NA, Regelwert)
    const gamma_M_ec = nachweisMaterial === 'stahl' ? 1.0 : 1.5;
    const f_d_ec = f_k / gamma_M_ec;

    // 3. Modifizierte Beiwerte nach DBV-Merkblatt – gilt nur für Beton und Betonstahl
    const dbvApplicable = nachweisMaterial === 'beton';
    let gamma_M_dbv = gamma_M_ec;
    if (dbvApplicable) {
      gamma_M_dbv = (failureDuctility === 'duktil' && measuredGeometry) ? 1.30 : 1.40;
    }
    const f_d_dbv = f_k / gamma_M_dbv;

    // 4. EN 1990-2:2026 – lognormaler Bemessungswert inkl. Modellunsicherheit γ_Rd (bestandKern.designLognormal)
    const f_d_pren = designLognormal(f_m, V, beta, aR, gammaRd);

    // Rechnerischer Zugewinn
    const gainDbvPercent = ((f_d_dbv / f_d_ec) - 1) * 100;
    const gainPrenPercent = ((f_d_pren / f_d_ec) - 1) * 100;

    return {
      f_k,
      gamma_M_ec,
      f_d_ec,
      gamma_M_dbv,
      f_d_dbv,
      gainDbvPercent,
      f_d_pren,
      gainPrenPercent,
      equivalentGammaPren: f_k / f_d_pren,
      dbvApplicable
    };
  }, [nachweisMaterial, failureDuctility, sampleMean, sampleCov, targetBeta, alphaR, measuredGeometry, gammaRd]);

  // Math Memo for Concrete Drill Core according to DIN EN 13791 & EC2
  const calculatedConcrete = useMemo(() => {
    const radius = coreDiameter / 2;
    const areaSqMm = Math.PI * Math.pow(radius, 2);
    const areaSqCm = areaSqMm / 100;
    
    // Measured raw compressive strength (MPa = N/mm²)
    const rawStrengthMpa = (failureForceKn * 1000) / areaSqMm;
    
    // Core height-to-diameter ratio
    const ratioHd = coreHeight / coreDiameter;
    
    // Ratio core shape converter factor (k_ratio) to standard cylinder (h/d = 2)
    let kRatioToCylinder = 1.0;
    if (ratioHd >= 2.0) {
      kRatioToCylinder = 1.0;
    } else if (ratioHd <= 1.0) {
      kRatioToCylinder = 0.82; // standard multiplier for 1:1 ratio to find cylinder strength
    } else {
      // Linear interpolation between h/d = 1 (0.82) and h/d = 2 (1.00)
      kRatioToCylinder = 0.82 + 0.18 * (ratioHd - 1.0);
    }

    // Moisture factor (dry core is over-estimated by ca. 8%, fully saturated core under-estimates)
    let kMoist = 1.0;
    if (coreMoisture === 'nass') {
      kMoist = 1.09; // adjust wet measured values upward
    } else if (coreMoisture === 'trocken') {
      kMoist = 0.92; // adjust dry measured values downward to be safe on moist structure
    }

    // Rebar penalty (rebar presence slashes mechanical load path)
    let kRebar = 1.0;
    if (coreRebar === 'minor') {
      kRebar = 1.04;
    } else if (coreRebar === 'critical') {
      kRebar = 1.10;
    }

    // Specimen size core diameter penalty
    let kDia = 1.0;
    if (coreDiameter === 50) {
      kDia = 0.85; // small core scale penalty (high distribution scattering)
    } else if (coreDiameter === 80) {
      kDia = 0.95;
    } else if (coreDiameter === 150) {
      kDia = 1.02;
    }

    // In-situ equivalent cylinder compressive strength
    const fIsCyl = rawStrengthMpa * kRatioToCylinder * kMoist * kRebar * kDia;
    // In-situ equivalent cube strength (assuming standard 0.80 cylinder-to-cube factor)
    const fIsCube = fIsCyl / 0.80;

    // Eurocode EC2 Design stress recalculations
    const gammaC_standard = 1.5;
    const gammaC_assessment = 1.35; // Assessment limit with verified on-site drill drilling cores
    const alphaCc = 0.85;

    const fCdStandard = (alphaCc * fIsCyl) / gammaC_standard;
    const fCdAssessment = (alphaCc * fIsCyl) / gammaC_assessment;

    // Aus EINEM Kern keine Festigkeitsklasse: Einstufung erfolgt über die Stichprobe (siehe coreSeries)
    const classEstimate = 'nur aus Stichprobe (n ≥ 3 Kerne) – siehe unten';

    return {
      areaSqMm,
      areaSqCm,
      rawStrengthMpa,
      ratioHd,
      kRatioToCylinder,
      kMoist,
      kRebar,
      kDia,
      fIsCyl,
      fIsCube,
      fCdStandard,
      fCdAssessment,
      classEstimate
    };
  }, [coreDiameter, coreHeight, failureForceKn, coreMoisture, coreRebar]);

  // Stichprobe: charakteristische In-situ-Festigkeit (DIN EN 1990 Anh. D, lognormal) → f_ck = f_ck,is / 0,85 (DIN EN 13791)
  const coreSeries = useMemo(() => {
    const values = coreSeriesText
      .split(/[;\s]+/)
      .map(v => parseFloat(v.replace(',', '.')))
      .filter(v => Number.isFinite(v) && v > 0 && v < 200);
    if (values.length < 3) return { n: values.length, valid: false as const };
    const cv = charValue(values);
    if (!cv.valid) return { n: values.length, valid: false as const };
    const fck = fckFromInSitu(cv.Xk);
    return { n: values.length, valid: true as const, mean: cv.mean, fckIs: cv.Xk, kn: cv.kn, fck, cls: classFor(fck) };
  }, [coreSeriesText]);

  // Math Memo for Masonry Brick specimens according to DIN EN 772-1 & EC6
  const calculatedBrick = useMemo(() => {
    const areaSqMm = brickWidth * brickLength;
    const rawStrengthMpa = (brickForceKn * 1000) / areaSqMm;
    
    // Continuous Shape conversion factor "d" based on height-to-width ratio
    const ratioHw = brickHeight / brickWidth;
    let dFactor = 1.0;
    if (ratioHw <= 0.3) dFactor = 0.65;
    else if (ratioHw >= 1.5) dFactor = 1.25;
    else {
      // interpolation between 0.3 and 1.5
      dFactor = 0.65 + 0.50 * ((ratioHw - 0.3) / 1.2);
    }
    
    // Normalized brick strength f_b [N/mm²]
    const fB = rawStrengthMpa * dFactor;
    
    // Mauerwerk charakteristisches Mauerwerkdruckfestigkeit (f_k) nach EC6
    // Simplified formula: f_k = K * f_b^0.7 * f_m^0.3
    // K = 0,55 (Gruppe 1, Normalmauermörtel) – für DE die K-Werte des NA verwenden; Anwendbarkeit bei Kalkmörtel prüfen
    const fK = fkMasonry(fB, mortarStrength, 0.55);

    // Bemessungswert f_d = ζ · f_k / γ_M mit ζ = 0,85 und γ_M = 1,5 (DIN EN 1996-1-1/NA, Regelwert)
    const fD = fdMasonry(fK, 1.5, 0.85);

    return {
      areaSqMm,
      rawStrengthMpa,
      ratioHw,
      dFactor,
      fB,
      fK,
      fD
    };
  }, [brickWidth, brickLength, brickHeight, brickForceKn, mortarStrength]);

  // Math Memo for Steel tensile test specimens according to DIN EN ISO 6892-1 & EC3
  const calculatedSteel = useMemo(() => {
    let areaSqMm = 0;
    if (steelForm === 'flat') {
      areaSqMm = steelWidth * steelThickness;
    } else {
      areaSqMm = Math.PI * Math.pow(steelDiameter / 2, 2);
    }
    
    const yieldStrengthMpa = (steelForceYieldKn * 1000) / areaSqMm;
    const tensileStrengthMpa = (steelForceTensileKn * 1000) / areaSqMm;
    const yieldRatio = yieldStrengthMpa / tensileStrengthMpa;
    
    // Design yield limit
    const gammaM0 = 1.00;
    const fYd = yieldStrengthMpa / gammaM0;

    let designation = 'S235JR (St 37-2)';
    if (yieldStrengthMpa < 210) designation = 'Schmiedeeisen / Flusseisen (< 1900)';
    else if (yieldStrengthMpa < 255) designation = 'St 37-2 / S235JR';
    else if (yieldStrengthMpa < 310) designation = 'St 44-2 / S275JR';
    else if (yieldStrengthMpa < 450) designation = 'St 52-3 / S355J2';
    else designation = 'BSt 500S / B500B (Betonstahl)';

    return {
      areaSqMm,
      yieldStrengthMpa,
      tensileStrengthMpa,
      yieldRatio,
      fYd,
      designation
    };
  }, [steelForm, steelWidth, steelThickness, steelDiameter, steelForceYieldKn, steelForceTensileKn]);

  // Chart setup for Database Tab
  const chartData = useMemo(() => {
    if (activeCategory === 'betonstahl' || activeCategory === 'baustahl') {
      const labels = currentData.data.map(d => d.old);
      const data = currentData.data.map(d => {
        if (typeof d.f_old === 'string') {
          return parseInt(d.f_old.replace('ca. ', '').split('-')[0]);
        }
        return d.f_old;
      });

      return {
        labels,
        datasets: [
          {
            label: 'Streckgrenze / Zugfestigkeit (MPa)',
            data,
            borderColor: '#be123c', // Shiraz red style
            backgroundColor: '#be123c',
            tension: 0.1,
          }
        ]
      };
    }
    return null;
  }, [activeCategory, currentData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: { display: true, text: 'Festigkeit (MPa)' },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="border-b border-home-grau/30 p-6 bg-slate-50/50">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <HistoryIcon className="w-5 h-5 text-shiraz" />
            Historische Kennwerte &amp; Prüfungsverfahren
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Forschungswerkzeug für das Bauen im Bestand, die Festigkeitseinstufung historischer Baustoffe und die Auswertung experimenteller Bauwerkproben.
          </p>
        </div>
        </div>

        {/* Top-Level Module Sub-Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 bg-slate-50/50 p-4">
          <button
            onClick={() => setMainTab('datenbank')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              mainTab === 'datenbank'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Database size={16} /> Historische Materialdatenbank
          </button>
          <button
            onClick={() => setMainTab('rechner_labor')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              mainTab === 'rechner_labor'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Calculator size={16} /> Rechner &amp; Laborprüfungen
          </button>
          <button
            onClick={() => setMainTab('nachweis_bestand')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              mainTab === 'nachweis_bestand'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <ShieldCheck size={16} /> Statische Nachweise im Bestand (DBV &amp; EN 1990-2:2026)
          </button>
        </div>
        <div className="p-6">

        {/* -------------------- TAB 1: DATENBANK -------------------- */}
        {mainTab === 'datenbank' && (
          <div>
            <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30 mb-6">
              <p>
                <strong>Für Studierende &amp; Prüfingenieure:</strong> Ein ordentliches Tragfähigkeitsgutachten setzt voraus, dass alte Gliederungen, wie z.B. visuelle Holzgüteklassen nach DIN 4074 oder die frühere Beton-Bezeichnungsart Bn/B nach DIN 1045, präzise in aktuelle Eurocode-Nenngrößen übersetzt werden.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {(Object.keys(historicalData) as MaterialCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setExpandedIndex(null);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-colors cursor-pointer ${
                    activeCategory === cat 
                      ? 'bg-shiraz text-white' 
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-home-grau/30'
                  }`}
                  id={`historical-cat-${cat}`}
                >
                  {cat === 'mauerwerk' ? 'Mauerwerk' : historicalData[cat].title.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-home-grau/30 mb-8 animate-fadeIn">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{currentData.title}</h3>
              <p className="text-slate-705 mb-4">{currentData.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-home-grau/30">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alte Normenlandschaft</span>
                  <div className="font-semibold text-slate-800 mt-1">{currentData.normOld}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-home-grau/30">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aktueller Status</span>
                  <div className="font-semibold text-shiraz mt-1">{currentData.normNew}</div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-home-grau/30 mb-8">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-home-grau/30 bg-slate-50">
                    <th className="py-3 px-4 font-bold text-text-main">Alte Bezeichnung</th>
                    <th className="py-3 px-4 font-bold text-shiraz">Neue Entsprechung (EC)</th>
                    {activeCategory === 'beton' && (
                      <>
                        <th className="py-3 px-4 font-bold text-text-main"><FormulaText text="f_{ck,cube}" /> (Alt-Wert) [MPa]</th>
                        <th className="py-3 px-4 font-bold text-shiraz"><FormulaText text="f_{ck,cyl}" /> (Neu-Wert) [MPa]</th>
                      </>
                    )}
                    {(activeCategory === 'betonstahl' || activeCategory === 'baustahl') && (
                      <>
                        <th className="py-3 px-4 font-bold text-text-main">
                          {activeCategory === 'baustahl' ? <FormulaText text="f_y" /> : <FormulaText text="f_{yk}" />} (Alt) [MPa]
                        </th>
                        <th className="py-3 px-4 font-bold text-shiraz">
                          {activeCategory === 'baustahl' ? <FormulaText text="f_{y}" /> : <FormulaText text="f_{yk}" />} (Neu) [MPa]
                        </th>
                      </>
                    )}
                    {activeCategory === 'holz' && (
                      <>
                        <th className="py-3 px-4 font-bold text-text-main">Zul. Biegespannung (Alt) [MPa]</th>
                        <th className="py-3 px-4 font-bold text-shiraz"><FormulaText text="f_{m,k}" /> (Neu) [MPa]</th>
                      </>
                    )}
                    {activeCategory === 'mauerwerk' && (
                      <>
                        <th className="py-3 px-4 font-bold text-text-main">SFK Steinklasse (Alt)</th>
                        <th className="py-3 px-4 font-bold text-shiraz">SFK Steinklasse (Neu)</th>
                      </>
                    )}
                    <th className="py-3 px-4 font-bold text-slate-500 text-right w-12">Info</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.data.map((row, idx) => {
                    const isExpanded = expandedIndex === idx;
                    return (
                      <React.Fragment key={idx}>
                        <tr 
                          onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                          className={`border-b border-home-grau/30 hover:bg-shiraz/5 transition-colors cursor-pointer ${
                            isExpanded ? 'bg-shiraz/5 font-semibold' : idx % 2 === 0 ? 'bg-slate-50/30' : ''
                          }`}
                          id={`historic-row-${activeCategory}-${idx}`}
                        >
                          <td className="py-3 px-4 font-medium text-slate-800">{row.old}</td>
                          <td className="py-3 px-4 font-bold text-shiraz">{row.new}</td>
                          <td className="py-3 px-4 text-slate-705 font-mono">{row.f_old}</td>
                          <td className="py-3 px-4 text-shiraz font-semibold font-mono">{row.f_new}</td>
                          <td className="py-3 px-4 text-slate-400 text-right">
                            {isExpanded ? <ChevronUp size={16} className="ml-auto text-shiraz" /> : <ChevronDown size={16} className="ml-auto" />}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-shiraz/5 border-b border-home-grau/25">
                            <td colSpan={5} className="p-4">
                              <div className="bg-white p-4 rounded-xl border border-shiraz/15 shadow-sm space-y-2">
                                <h5 className="font-bold text-shiraz flex items-center gap-1.5 text-xs uppercase tracking-wider">
                                  <Info size={14} /> Praxis- &amp; Diagnostikhinweis für {row.old}
                                </h5>
                                <p className="text-slate-750 leading-relaxed text-sm font-normal">
                                  {row.explanation}
                                </p>
                                <div className="text-xs text-slate-400 pt-1 border-t border-slate-50 font-sans font-normal">
                                  Normungsquellen: {currentData.normOld} vs. {currentData.normNew}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {(activeCategory === 'betonstahl' || activeCategory === 'baustahl') && chartData && (
              <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm mb-8">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Chronologische Festigkeitsentwicklung</h3>
                <div className="h-[280px] w-full">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            )}

            {/* Sicherheitskonzepte Block */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 my-4">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Layers className="text-shiraz" size={20} /> Umrechnung auf Eurocode (Sicherheitskonzepte)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="text-md font-bold text-slate-900 mb-3">Historisch: Globale Sicherheit</h4>
                  <p className="text-xs md:text-sm text-slate-700 mb-4 leading-relaxed">
                    Bis ca. 2004 galt das <strong>globale Sicherheitskonzept</strong> (z.B. DIN 1045:1988). Die Beanspruchungen wurden unskaliert verglichen mit herabgesetzten Festigkeiten. Ein einziger mittlerer Beiwert deckte alle Lastschwankungen ab:
                  </p>
                  <div className="bg-white p-3 rounded border border-home-grau/30 text-center font-serif text-sm">
                    <BlockMath math="\sigma_{vorh} \le \sigma_{zul} = \frac{f_k}{\gamma_{global}}" />
                  </div>
                  <ul className="list-disc pl-5 mt-4 text-xs text-slate-500 space-y-1">
                    <li>Sicherheitsfaktor meist <InlineMath math="\gamma \approx 1.75\text{ bis }2.1" />.</li>
                    <li>Keine separate Sicherheit für ständige (G) und variable (Q) Lasten.</li>
                  </ul>
                </div>

                <div className="bg-shiraz/5 p-5 rounded-xl border border-shiraz/20">
                  <h4 className="text-md font-bold text-shiraz mb-3">Modern: Teilsicherheitsbeiwerte</h4>
                  <p className="text-xs md:text-sm text-slate-755 mb-4 leading-relaxed">
                    Die heutigen Eurocodes verwenden das <strong>Teilsicherheitskonzept</strong>. Einwirkungen werden mit Lastfaktoren (<InlineMath math="\gamma_F" />) erhöht, Werkstoffeigenschaften durch Materialfaktoren (<InlineMath math="\gamma_M" />) gemindert:
                  </p>
                  <div className="bg-white p-3 rounded border border-shiraz/20 text-center font-serif text-sm">
                    <BlockMath math="E_d \le R_d" />
                  </div>
                  <div className="text-center mt-2">
                    <InlineMath math="(E_k \cdot \gamma_F) \le \frac{R_k}{\gamma_M}" />
                  </div>
                  <ul className="list-disc pl-5 mt-4 text-xs text-shiraz/80 space-y-1">
                    <li><InlineMath math="\gamma_G = 1.35" /> für Eigengewichte</li>
                    <li><InlineMath math="\gamma_Q = 1.50" /> für Verkehrslasten (Nutz-, Schnee-, Windlast)</li>
                    <li>Materialbeiwerte: Beton (<InlineMath math="\gamma_C = 1.5" />), Stahl (<InlineMath math="\gamma_{M0} = 1.0" />), Holz (<InlineMath math="\gamma_M = 1.3" />).</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB 2: RECHNER & LABORPRÜFUNGEN -------------------- */}
        {mainTab === 'rechner_labor' && (
          <div className="animate-fadeIn">
            {/* Context manual */}
            <div className="text-sm bg-slate-50 text-slate-700 p-4 rounded-xl border border-home-grau/30 mb-8">
              <p>
                <strong>Laborprüfungs- &amp; Beprobungsauswertung:</strong> Prüfen Sie gewonnene Proben aus Bauteilen und überführen Sie diese nach geltenden Normen (z.B. DIN EN 13791 für Bohrkerne, DIN EN 772-1 für Mauersteine und Zugprüfungen nach ISO 6892-1) in charakteristische Kenngrößen.
              </p>
            </div>

            {/* Test type selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              <button
                onClick={() => setProbeType('beton_bohrkern')}
                className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border text-sm transition-all ${
                  probeType === 'beton_bohrkern'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-slate-50 text-slate-850 border-home-grau/30 hover:bg-slate-100'
                }`}
              >
                <Activity size={16} /> Beton-Bohrkerne (EC2)
              </button>
              <button
                onClick={() => setProbeType('mauerwerk_ziegel')}
                className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border text-sm transition-all ${
                  probeType === 'mauerwerk_ziegel'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-slate-50 text-slate-850 border-home-grau/30 hover:bg-slate-100'
                }`}
              >
                <Layers size={16} /> Mauersteine &amp; f_k (EC6)
              </button>
              <button
                onClick={() => setProbeType('stahl_zugprobe')}
                className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border text-sm transition-all ${
                  probeType === 'stahl_zugprobe'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-slate-50 text-slate-850 border-home-grau/30 hover:bg-slate-100'
                }`}
              >
                <Ruler size={16} /> Stahl-Zerreißversuch (EC3)
              </button>
            </div>

            {/* TWO-COLUMN LAYOUT: Input and Output */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              
              {/* Left Column: Parameter configuration */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-home-grau/30">
                <h3 className="text-md font-bold text-slate-900 mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-home-grau/30 pb-2">
                  <Settings size={18} className="text-shiraz" /> Eingabewerte &amp; Parameter
                </h3>

                {/* 1. BETON BOHRKERN CONTROLS */}
                {probeType === 'beton_bohrkern' && (
                  <div className="space-y-5 text-sm">
                    <div>
                      <label className="block text-xs font-bold text-home-grau uppercase mb-2">Kern-Soll-Durchmesser (d)</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[50, 80, 100, 150].map((dia) => (
                          <button
                            key={dia}
                            onClick={() => {
                              setCoreDiameter(dia);
                              // Auto set core height for proportional 1:1 or 2:1 depending on selection
                              if (coreHeight === 100 && dia === 50) setCoreHeight(50);
                              else if (coreHeight === 100 && dia === 150) setCoreHeight(150);
                            }}
                            className={`py-2 px-1 rounded-lg text-xs font-bold border transition-colors ${
                              coreDiameter === dia
                                ? 'bg-shiraz/10 text-shiraz border-shiraz'
                                : 'bg-white text-text-main border-home-grau/25 hover:bg-home-grau/5'
                            }`}
                          >
                            {dia} mm
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-home-grau uppercase mb-2">
                        <span>Länge des Bohrkerns (h)</span>
                        <span className="text-shiraz font-mono">{coreHeight} mm</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="300"
                        step="5"
                        value={coreHeight}
                        onChange={(e) => setCoreHeight(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                      <div className="flex justify-between text-xs text-home-grau mt-1">
                        <span>50 mm</span>
                        <span>Verhältnis h/d = <strong className="font-mono text-text-main">{(coreHeight / coreDiameter).toFixed(2)}</strong></span>
                        <span>300 mm</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-home-grau uppercase mb-2">
                        <span>Prüfkraft Zylinderpresse (F)</span>
                        <span className="text-shiraz font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-home-grau/30">{failureForceKn} kN</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="800"
                        step="10"
                        value={failureForceKn}
                        onChange={(e) => setFailureForceKn(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                      <div className="flex justify-between text-xs mt-1 text-home-grau">
                        <span>20 kN</span>
                        <span>Druck-Versagensgrenze</span>
                        <span>800 kN</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-home-grau uppercase mb-2">Lagerung & Feuchtigkeit</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['standard', 'nass', 'trocken'] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setCoreMoisture(mode)}
                            className={`py-2 px-1 rounded-lg text-xs font-bold border transition-colors ${
                              coreMoisture === mode
                                ? 'bg-shiraz/10 text-shiraz border-shiraz'
                                : 'bg-white text-text-main border-home-grau/25 hover:bg-home-grau/5'
                            }`}
                          >
                            {mode === 'standard' && 'Raumklima (1.0)'}
                            {mode === 'nass' && 'Nass / Wasser (1.09)'}
                            {mode === 'trocken' && 'Ofentrocken (0.92)'}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-home-grau mt-1 leading-normal">
                        Ofentrockener Beton weist künstlich höhere Bruchspannungen auf; nasse Proben brechen mechanisch früher.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-home-grau uppercase mb-2">Bewehrungskreuzungen</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['none', 'minor', 'critical'] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setCoreRebar(mode)}
                            className={`py-2 px-1 rounded-lg text-xs font-bold border transition-colors ${
                              coreRebar === mode
                                ? 'bg-shiraz/10 text-shiraz border-shiraz'
                                : 'bg-white text-text-main border-home-grau/25'
                            }`}
                          >
                            {mode === 'none' && 'Keine (1.0)'}
                            {mode === 'minor' && '1 Stab (1.04)'}
                            {mode === 'critical' && '2 Stäbe (1.10)'}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-home-grau mt-1 leading-normal">
                        Stahlstangen schwächen die Nettodruckfläche des Zylinders. Die ermittelte Last muss rechnerisch korrigiert werden.
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. MAUERZIEGEL CONTROLS */}
                {probeType === 'mauerwerk_ziegel' && (
                  <div className="space-y-5 text-sm">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-home-grau uppercase mb-1">Breite (w)</label>
                        <input
                          type="number"
                          value={brickWidth}
                          onChange={(e) => setBrickWidth(Math.max(1, Number(e.target.value)))}
                          className="w-full bg-white border border-home-grau/25 rounded-lg p-2 text-center font-semibold font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-home-grau uppercase mb-1">Länge (l)</label>
                        <input
                          type="number"
                          value={brickLength}
                          onChange={(e) => setBrickLength(Math.max(1, Number(e.target.value)))}
                          className="w-full bg-white border border-home-grau/25 rounded-lg p-2 text-center font-semibold font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-home-grau uppercase mb-1">Höhe (h)</label>
                        <input
                          type="number"
                          value={brickHeight}
                          onChange={(e) => setBrickHeight(Math.max(1, Number(e.target.value)))}
                          className="w-full bg-white border border-home-grau/25 rounded-lg p-2 text-center font-semibold font-mono"
                        />
                      </div>
                    </div>

                    <div className="bg-white/80 p-3 rounded-lg border border-home-grau/30">
                      <span className="text-xs font-bold text-home-grau block mb-1">Format-Vorschläge (Ziegelformat)</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => { setBrickWidth(115); setBrickLength(240); setBrickHeight(71); }}
                          className="px-2 py-1 text-xs font-bold bg-off-white hover:bg-home-grau/10 border rounded"
                        >
                          NF (Normalformat)
                        </button>
                        <button
                          onClick={() => { setBrickWidth(115); setBrickLength(240); setBrickHeight(52); }}
                          className="px-2 py-1 text-xs font-bold bg-off-white hover:bg-home-grau/10 border rounded"
                        >
                          DF (Dünnformat)
                        </button>
                        <button
                          onClick={() => { setBrickWidth(175); setBrickLength(240); setBrickHeight(113); }}
                          className="px-2 py-1 text-xs font-bold bg-off-white hover:bg-home-grau/10 border rounded"
                        >
                          2DF-Format
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-home-grau uppercase mb-2">
                        <span>Zylinder-/Stempelprüfkraft (F_c)</span>
                        <span className="text-shiraz font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-home-grau/30">{brickForceKn} kN</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="600"
                        step="10"
                        value={brickForceKn}
                        onChange={(e) => setBrickForceKn(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-home-grau uppercase mb-2">
                        <span>Mörtelfestigkeitsklasse (f_m)</span>
                        <span className="text-shiraz font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-home-grau/30">{mortarStrength.toFixed(1)} MPa</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="15.0"
                        step="0.5"
                        value={mortarStrength}
                        onChange={(e) => setMortarStrength(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                      <div className="flex justify-between text-xs mt-1 text-home-grau">
                        <span>M 1 (historischer Kalkmörtel)</span>
                        <span>M 5.0 (Standard)</span>
                        <span>M 15 (Hochfest)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. STAHL ZUGVERSUCH CONTROLS */}
                {probeType === 'stahl_zugprobe' && (
                  <div className="space-y-5 text-sm">
                    <div>
                      <label className="block text-xs font-bold text-home-grau uppercase mb-2">Geometrische Form der Probe</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSteelForm('round')}
                          className={`py-2 px-1 rounded-lg text-xs font-bold border transition-colors ${
                            steelForm === 'round'
                              ? 'bg-shiraz/10 text-shiraz border-shiraz'
                              : 'bg-white text-text-main border-home-grau/25'
                          }`}
                        >
                          Rundzylinder-Stab
                        </button>
                        <button
                          onClick={() => setSteelForm('flat')}
                          className={`py-2 px-1 rounded-lg text-xs font-bold border transition-colors ${
                            steelForm === 'flat'
                              ? 'bg-shiraz/10 text-shiraz border-shiraz'
                              : 'bg-white text-text-main border-home-grau/25'
                          }`}
                        >
                          Flach-/Rechteckprobe
                        </button>
                      </div>
                    </div>

                    {steelForm === 'flat' ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-home-grau uppercase mb-1">Breite w (mm)</label>
                          <input
                            type="number"
                            min="1"
                            max="60"
                            value={steelWidth}
                            onChange={(e) => setSteelWidth(Math.max(1, Number(e.target.value)))}
                            className="w-full bg-white border border-home-grau/25 rounded-lg p-2 text-center font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-home-grau uppercase mb-1">Dicke t (mm)</label>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={steelThickness}
                            onChange={(e) => setSteelThickness(Math.max(1, Number(e.target.value)))}
                            className="w-full bg-white border border-home-grau/25 rounded-lg p-2 text-center font-mono font-bold"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between text-xs font-bold text-home-grau uppercase mb-2">
                          <span>Nenndurchmesser d</span>
                          <span className="text-shiraz font-mono">{steelDiameter} mm</span>
                        </div>
                        <input
                          type="range"
                          min="4"
                          max="32"
                          step="1"
                          value={steelDiameter}
                          onChange={(e) => setSteelDiameter(Number(e.target.value))}
                          className="w-full accent-shiraz"
                        />
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between text-xs font-bold text-home-grau uppercase mb-2">
                        <span>Kraft an der Streckgrenze (F_eH / F_p0.2)</span>
                        <span className="text-shiraz font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-home-grau/30">{steelForceYieldKn} kN</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="250"
                        step="2"
                        value={steelForceYieldKn}
                        onChange={(e) => setSteelForceYieldKn(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-home-grau uppercase mb-2">
                        <span>Zerreißkraft / Plastisch (F_m)</span>
                        <span className="text-shiraz font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-home-grau/30">{steelForceTensileKn} kN</span>
                      </div>
                      <input
                        type="range"
                        min={steelForceYieldKn + 2}
                        max="350"
                        step="2"
                        value={steelForceTensileKn}
                        onChange={(e) => setSteelForceTensileKn(Math.max(steelForceYieldKn + 1, Number(e.target.value)))}
                        className="w-full accent-shiraz"
                      />
                      <div className="text-xs text-home-grau text-right mt-1">
                        Muss über der Elastic-Streckgrenze liegen.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Calculations writeout and results */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. BETON RESULT VIEW */}
                {probeType === 'beton_bohrkern' && (
                  <div className="bg-white rounded-2xl border border-shiraz/20 shadow-lg p-6 animate-pulseOnce">
                    <div className="flex items-center justify-between border-b pb-4 mb-4">
                      <span className="text-xs font-bold text-shiraz uppercase tracking-widest block">Protokoll: DIN EN 13791</span>
                      <div className="px-3 py-1 text-xs font-semibold bg-shiraz/10 text-shiraz rounded-full border border-shiraz/20">
                        Einzelkern – Klasse: <strong className="font-bold">{coreSeries.valid ? `${coreSeries.cls} (aus n = ${coreSeries.n})` : 'erst ab n ≥ 3'}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-center">
                      <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                        <span className="text-xs font-bold text-home-grau block uppercase">Nettomessfläche A</span>
                        <span className="text-md font-extrabold text-text-main font-mono">{calculatedConcrete.areaSqCm.toFixed(1)} cm²</span>
                      </div>
                      <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                        <span className="text-xs font-bold text-home-grau block uppercase">Bruchspannung f_c,core</span>
                        <span className="text-md font-extrabold text-text-main font-mono">{calculatedConcrete.rawStrengthMpa.toFixed(1)} MPa</span>
                      </div>
                      <div className="bg-shiraz/10 p-3 rounded-xl border border-shiraz/25">
                        <span className="text-xs font-bold text-shiraz block uppercase">Equiv Cylinder f_is,cyl</span>
                        <span className="text-lg font-black text-shiraz font-mono">{calculatedConcrete.fIsCyl.toFixed(1)} N/mm²</span>
                      </div>
                    </div>

                    {/* Equations section */}
                    <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-3 font-serif text-sm">
                      <h4 className="font-sans font-bold text-xs text-text-main uppercase tracking-wider mb-2">Rechnerische Zwischenschritte & Minderungskoeffizienten:</h4>
                      <div className="text-[12px] space-y-2 leading-relaxed font-mono text-text-main/90">
                        <div>
                          <span className="font-sans text-home-grau">1. Schlankheitskorrektur: </span>
                          <InlineMath math={`k_{ ratio} = ${calculatedConcrete.kRatioToCylinder.toFixed(2)}`} /> 
                          <span className="font-sans text-xs text-home-grau ml-1">
                            (h/d = {calculatedConcrete.ratioHd.toFixed(2)} → {calculatedConcrete.ratioHd >= 2 ? 'Kompakter Zylinder' : 'Interpoliert zu Zylinderstärke'})
                          </span>
                        </div>
                        <div>
                          <span className="font-sans text-home-grau">2. Feuchtigkeitskorrektur: </span>
                          <InlineMath math={`k_{moist} = ${calculatedConcrete.kMoist.toFixed(2)}`} />
                        </div>
                        <div>
                          <span className="font-sans text-home-grau">3. Stahleinlagenminderung: </span>
                          <InlineMath math={`k_{rebar} = ${calculatedConcrete.kRebar.toFixed(2)}`} />
                        </div>
                        <div>
                          <span className="font-sans text-home-grau">4. Maßstabsfaktor (Ø-Bohrkern): </span>
                          <InlineMath math={`k_{dia} = ${calculatedConcrete.kDia.toFixed(2)}`} />
                        </div>
                        <hr className="my-1 border-home-grau/30" />
                        <div className="text-xs pt-1 font-bold text-shiraz">
                          <BlockMath math={`f_{is,cyl} = f_{c,core} \\cdot k_{ratio} \\cdot k_{moist} \\cdot k_{rebar} \\cdot k_{dia} = ${calculatedConcrete.fIsCyl.toFixed(2)} \\text{ MPa}`} />
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-[11px] text-home-grau leading-relaxed">
                      Hinweis: Die Faktoren k_moist, k_rebar und k_dia stehen nicht in DIN EN 13791 (Literaturwerte, z. B. Concrete Society TR 11 / ACI 214.4R – Quelle prüfen). DIN EN 13791 verlangt bewehrungsfreie Kerne.
                    </p>

                    {/* Stichprobe: charakteristischer Wert und Klasse */}
                    <div className="mt-6 border-t pt-4 space-y-3">
                      <h4 className="text-xs font-bold text-text-main uppercase">Stichprobe: charakteristischer Wert und Druckfestigkeitsklasse</h4>
                      <label className="text-xs text-home-grau block">
                        In-situ-Festigkeiten aller Kerne f_is [N/mm²], getrennt durch Semikolon:
                        <input
                          type="text"
                          value={coreSeriesText}
                          onChange={(e) => setCoreSeriesText(e.target.value)}
                          className="mt-1 w-full p-2 border border-home-grau/30 rounded-lg text-xs font-mono"
                        />
                      </label>
                      {coreSeries.valid ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="p-3 bg-home-grau/5 rounded-lg border border-home-grau/30">
                            <span className="text-xs font-bold text-home-grau block uppercase">n = {coreSeries.n} · Mittelwert</span>
                            <div className="text-md font-bold text-text-main">{coreSeries.mean.toFixed(1)} N/mm²</div>
                          </div>
                          <div className="p-3 bg-home-grau/5 rounded-lg border border-home-grau/30">
                            <span className="text-xs font-bold text-home-grau block uppercase">f_ck,is (k_n = {coreSeries.kn.toFixed(2)})</span>
                            <div className="text-md font-bold text-text-main">{coreSeries.fckIs.toFixed(1)} N/mm²</div>
                          </div>
                          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-250">
                            <span className="text-xs font-bold text-emerald-800 block uppercase">f_ck = f_ck,is / 0,85</span>
                            <div className="text-md font-bold text-emerald-800">{coreSeries.fck.toFixed(1)} N/mm² → {coreSeries.cls}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                          Mindestens 3 Kernwerte eingeben – aus einem einzelnen Kern darf weder eine Festigkeitsklasse noch ein Bemessungswert abgeleitet werden.
                        </div>
                      )}
                      <p className="text-[11px] text-home-grau leading-relaxed">
                        Charakteristischer Wert als 5-%-Fraktile (log-normal, V unbekannt) nach DIN EN 1990 Anhang D; Umrechnung auf die Druckfestigkeitsklasse nach DIN EN 13791. Für die verbindliche Bewertung Verfahren und Mindestanzahl der geltenden DIN EN 13791:2020-02 + A20 anwenden.
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. MAUERWERK RESULT VIEW */}
                {probeType === 'mauerwerk_ziegel' && (
                  <div className="bg-white rounded-2xl border border-shiraz/20 shadow-lg p-6 animate-pulseOnce">
                    <div className="flex items-center justify-between border-b pb-4 mb-4">
                      <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block">Protokoll: DIN EN 772-1 & EC6</span>
                      <div className="px-3 py-1 text-xs font-semibold bg-amber-55/10 text-amber-800 rounded-full border border-amber-800/20">
                        Normfestigkeit Stein <strong className="font-bold">{calculatedBrick.fB.toFixed(1)} N/mm²</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-center">
                      <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                        <span className="text-xs font-bold text-home-grau block uppercase">Druckfläche A</span>
                        <span className="text-md font-extrabold text-text-main font-mono">{(calculatedBrick.areaSqMm / 100).toFixed(1)} cm²</span>
                      </div>
                      <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                        <span className="text-xs font-bold text-home-grau block uppercase">Mauerstein-Druckfestigkeit f_p</span>
                        <span className="text-md font-extrabold text-text-main font-mono">{calculatedBrick.rawStrengthMpa.toFixed(1)} MPa</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-amber-300">
                        <span className="text-xs font-bold text-amber-800 block uppercase">Wanddruckfestigkeit f_k</span>
                        <span className="text-lg font-black text-amber-800 font-mono">{calculatedBrick.fK.toFixed(2)} N/mm²</span>
                      </div>
                    </div>

                    <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-3 font-serif text-sm">
                      <h4 className="font-sans font-bold text-xs text-text-main uppercase tracking-wider mb-2">Rechnerischer Ansatz nach Eurocode 6 (DIN EN 1996-1-1)</h4>
                      <div className="text-[12px] space-y-2 leading-relaxed font-mono text-text-main/90">
                        <div>
                          <span className="font-sans text-home-grau">1. Proben-Formbeiwert d: </span>
                          <InlineMath math={`d = ${calculatedBrick.dFactor.toFixed(2)}`} />
                          <span className="font-sans text-xs text-home-grau ml-1">
                            (h / w = {calculatedBrick.ratioHw.toFixed(2)})
                          </span>
                        </div>
                        <div>
                          <span className="font-sans text-home-grau">2. Deklarierte Steinfestigkeit f_b: </span>
                          <InlineMath math={`f_b = f_p \\cdot d = ${calculatedBrick.fB.toFixed(2)} \\text{ MPa}`} />
                        </div>
                        <hr className="my-1 border-home-grau/30" />
                        <div>
                          <span className="font-sans font-bold text-text-main">Mauerwerkgrundformel (Mörtelklasse M{mortarStrength}):</span>
                          <BlockMath math={`f_k = K \\cdot f_b^{0.7} \\cdot f_m^{0.3} = 0.55 \\cdot (${calculatedBrick.fB.toFixed(2)})^{0.7} \\cdot (${mortarStrength.toFixed(1)})^{0.3} = ${calculatedBrick.fK.toFixed(2)} \\text{ N/mm}^2`} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 border-t pt-4">
                      <h4 className="text-xs font-bold text-text-main uppercase mb-2">Statisch zulässiges Spannungsniveau (<InlineMath math="f_{d} = f_k / \gamma_M" />)</h4>
                      <div className="p-4 bg-white rounded-xl border border-amber-300 text-sm leading-relaxed text-amber-900">
                        Bemessungswert der Wandfestigkeit: <strong className="font-mono font-bold text-md text-amber-950">{calculatedBrick.fD.toFixed(2)} N/mm²</strong> 
                        <span className="text-xs text-amber-800 block mt-1">
                          (Mit <InlineMath math="f_d = \zeta \cdot f_k / \gamma_M" />, <InlineMath math="\zeta = 0{,}85" /> und <InlineMath math="\gamma_M = 1{,}5" /> nach DIN EN 1996-1-1/NA.)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. STAHL RESULT VIEW */}
                {probeType === 'stahl_zugprobe' && (
                  <div className="bg-white rounded-2xl border border-shiraz/20 shadow-lg p-6 animate-pulseOnce">
                    <div className="flex items-center justify-between border-b pb-4 mb-4">
                      <span className="text-xs font-bold text-indigo-800 uppercase tracking-widest block">Protokoll: DIN EN ISO 6892-1</span>
                      <div className="px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                        Klasse Einstufung: <strong className="font-bold">{calculatedSteel.designation}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-center">
                      <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                        <span className="text-xs font-bold text-home-grau block uppercase">Probenquerschnitt A_0</span>
                        <span className="text-md font-extrabold text-text-main font-mono">{calculatedSteel.areaSqMm.toFixed(1)} mm²</span>
                      </div>
                      <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                        <span className="text-xs font-bold text-home-grau block uppercase">Streckgrenze R_eH</span>
                        <span className="text-md font-extrabold text-text-main font-mono">{calculatedSteel.yieldStrengthMpa.toFixed(1)} MPa</span>
                      </div>
                      <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200">
                        <span className="text-xs font-bold text-indigo-800 block uppercase">Zugfestigkeit R_m</span>
                        <span className="text-lg font-black text-indigo-800 font-mono">{calculatedSteel.tensileStrengthMpa.toFixed(1)} MPa</span>
                      </div>
                    </div>

                    <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-3 font-serif text-sm">
                      <h4 className="font-sans font-bold text-xs text-text-main uppercase tracking-wider mb-2">Zugprüfungsauswertung:</h4>
                      <div className="text-[12px] space-y-2 leading-relaxed font-mono text-text-main/90">
                        <div>
                          <span className="font-sans text-home-grau">Streckgrenze: </span>
                          <InlineMath math={`R_{eH} = \\frac{F_{eH}}{A_0} = \\frac{${steelForceYieldKn} \\text{ kN}}{${calculatedSteel.areaSqMm.toFixed(1)} \\text{ mm}^2} = ${calculatedSteel.yieldStrengthMpa.toFixed(1)} \\text{ N/mm}^2`} />
                        </div>
                        <div>
                          <span className="font-sans text-home-grau">Maximale Reißspannung plastisch: </span>
                          <InlineMath math={`R_{m} = \\frac{F_m}{A_0} = \\frac{${steelForceTensileKn} \\text{ kN}}{${calculatedSteel.areaSqMm.toFixed(1)} \\text{ mm}^2} = ${calculatedSteel.tensileStrengthMpa.toFixed(1)} \\text{ N/mm}^2`} />
                        </div>
                        <hr className="my-1 border-home-grau/30" />
                        <div>
                          <span className="font-sans text-home-grau">Duktilitätsmaß (Streckgrenzenverhältnis): </span>
                          <InlineMath math={`\\frac{R_{eH}}{R_m} = ${calculatedSteel.yieldRatio.toFixed(3)}`} />
                          <span className="font-sans text-xs text-home-grau ml-1">
                            (Duktilität {calculatedSteel.yieldRatio <= 0.85 ? 'Hoch / Ausreichend' : 'Achtung: Spröde!'})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 border-t pt-4">
                      <h4 className="text-xs font-bold text-text-main uppercase mb-2">Bemessungsstreckgrenze Eurocode 3 (<InlineMath math="f_{yd} = f_y / \gamma_{M0}" />)</h4>
                      <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 text-sm leading-relaxed text-indigo-900">
                        Bemessungsspannung für Tragfähigkeitsnachweise: <strong className="font-mono font-bold text-md text-indigo-950">{calculatedSteel.fYd.toFixed(1)} N/mm²</strong> 
                        <span className="text-xs text-indigo-800 block mt-1">
                          (Nach DIN EN 1993-1-1 beträgt der Teilsicherheitsbeiwert <InlineMath math="\gamma_{M0} = 1.00" />).
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ----------------- SUBSECTION: THEORY AND MANUAL CALCS ----------------- */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 mt-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="text-shiraz" size={20} /> Handrechnungs-Beispiele &amp; Schritt-für-Schritt Rechenwege
              </h3>

              <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
                {/* Example 1: Concrete */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                  <div className="flex items-center gap-2 text-shiraz mb-2">
                    <CheckCircle size={16} />
                    <h4 className="font-bold text-sm uppercase">Beispiel 1: Betonstütze Baujahr 1974 (Einstufung Bn 250)</h4>
                  </div>
                  <p className="mb-4">
                    Ein Statiker findet in historischen Bauakten eines Bürogebäudes von 1974 eine Betonklassifizierung der Stützpfeiler als <strong>"Bn 250"</strong> nach DIN 1045 (Fassung 1972). Er soll die Stütze mit dem aktuellen Eurocode 2 nachrechnen. Der vollständige Rechenweg gestaltet sich wie folgt:
                  </p>
                  
                  <div className="space-y-3 font-serif pl-2 border-l-2 border-shiraz/40 my-3">
                    <div>
                      <strong className="font-sans text-xs text-home-grau block uppercase">Schritt 1: Bestimmung der Würfelfestigkeit (alt)</strong>
                      Die alte Klasse bezieht sich auf die Würfeldruckfestigkeit <InlineMath math="\beta_{WN}" />. Das Nennmaß Bn 250 garantiert eine 5%-Fraktilfestigkeit von:
                      <BlockMath math="\beta_{WN} = 25.0 \text{ N/mm}^2 \text{ (auf einen 200 mm Würfel)}" />
                    </div>
                    <div>
                      <strong className="font-sans text-xs text-home-grau block uppercase">Schritt 2: Umrechnung auf standardisierten Zylinder (f_ck)</strong>
                      Die aktuellen Eurocode 2 Klassen basieren auf der Zylinderdruckfestigkeit <InlineMath math="f_{ck}" /> (Durchmesser 150 mm/Länge 300 mm). Die Festigkeit verhält sich bei unbeschädigtem Beton konstruktiv wie folgt:
                      <BlockMath math="f_{ck} = \beta_{WN} \cdot 0.80 = 25.0 \cdot 0.80 = 20.0 \text{ N/mm}^2" />
                      Damit entspricht der Bestandsbeton exakt der aktuellen Festigkeitsklasse <strong>C20/25</strong> (<InlineMath math="f_{ck} = 20.0 \text{ N/mm}^2, f_{ck,cube} = 25.0 \text{ N/mm}^2" />).
                    </div>
                    <div>
                      <strong className="font-sans text-xs text-home-grau block uppercase">Schritt 3: Berechnung des Bemessungswerts (Eurocode 2)</strong>
                      Der materialspezifische Bemessungswert <InlineMath math="f_{cd}" /> unter ständigen axialen Druckspannungen wird unter Berücksichtigung des Dauerstandseffekts (<InlineMath math="\alpha_{cc} = 0.85" />) ermittelt:
                      <BlockMath math="f_{cd} = \alpha_{cc} \cdot \frac{f_{ck}}{\gamma_c} = 0.85 \cdot \frac{20.0 \text{ N/mm}^2}{1.50} = 11.33 \text{ N/mm}^2" />
                      <span className="font-sans text-xs text-home-grau block mt-1">
                        *Tipp: Werden im Bestand systematisch Bohrkerne entnommen und so die Geometrie und Güte direkt experimentell verifiziert, darf der Sicherheitsfaktor gemindert werden (<InlineMath math="\gamma_c = 1.35 \rightarrow f_{cd} = 12.59 \text{ N/mm}^2" />).
                      </span>
                    </div>
                  </div>
                </div>

                {/* Example 2: Steel */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                  <div className="flex items-center gap-2 text-shiraz mb-2">
                    <CheckCircle size={16} />
                    <h4 className="font-bold text-sm uppercase">Beispiel 2: Alten Stahlträger nachweisen (Baujahr 1968, St 37-2)</h4>
                  </div>
                  <p className="mb-4">
                    In einer Decke soll ein Profilträger aus Walzstahl mit der Markierung <strong>St 37-2</strong> nach DIN 17100 tragfähig nachgewiesen werden.
                  </p>

                  <div className="space-y-3 font-serif pl-2 border-l-2 border-shiraz/40 my-3">
                    <div>
                      <strong className="font-sans text-xs text-slate-400 block uppercase">Schritt 1: Ermittlung der alten Normfestigkeiten</strong>
                      Zulässige Tragspannungen wurden historisch nach dem globalen System berechnet (<InlineMath math="\sigma_{zul} = 140 \text{ N/mm}^2" />). Zur heutigen Nachrechnung benötigen wir jedoch die charakteristische Fließgrenze <InlineMath math="f_y" />:
                      <BlockMath math="f_y = 235 \text{ N/mm}^2 \quad (\text{für Träger-Flanschdicke } t \le 16\text{ mm})" />
                    </div>
                    <div>
                      <strong className="font-sans text-xs text-slate-400 block uppercase">Schritt 2: Zuordnung im Eurocode 3 System</strong>
                      In DIN EN 10025-2 entspricht dies der heutigen Standardgüte <strong>S235JR</strong>.
                      <span className="block mt-1 text-[12px] font-sans text-amber-800">
                        Achtung: Ohne Materialprüfung ist bei Stählen vor ca. 1970 mit Thomasstahl zu rechnen (Alterung, Sprödbruch, eingeschränkte Schweißeignung). Vor Ansatz von S235 und vor Schweißarbeiten Werkstoffprüfung durchführen (Zugversuch, Kerbschlagarbeit, chemische Analyse).
                      </span>
                    </div>
                    <div>
                      <strong className="font-sans text-xs text-slate-400 block uppercase">Schritt 3: Bemessungswert-Ermittlung</strong>
                      Für die Tragfähigkeitsnachweise gilt mit Teilsicherheitsbeiwert <InlineMath math="\gamma_{M0} = 1.00" />:
                      <BlockMath math="f_{yd} = \frac{f_y}{\gamma_{M0}} = \frac{235 \text{ N/mm}^2}{1.00} = 235.0 \text{ N/mm}^2" />
                    </div>
                  </div>
                </div>

                {/* Example 3: Masonry */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                  <div className="flex items-center gap-2 text-shiraz mb-2">
                    <CheckCircle size={16} />
                    <h4 className="font-bold text-sm uppercase">Beispiel 3: Ziegelwand von 1920 (Berechnung für Wanddruck)</h4>
                  </div>
                  <p className="mb-4">
                    Es soll eine tragende Altbauwand aus Vollziegeln im Reichsformat (RF) und Kalkmörtel statisch bewertet werden.
                  </p>

                  <div className="space-y-3 font-serif pl-2 border-l-2 border-shiraz/40 my-3">
                    <div>
                      <strong className="font-sans text-xs text-slate-400 block uppercase">Schritt 1: Stein-Druckfestigkeit &amp; Formbeiwert (DIN EN 772-1)</strong>
                      Durch Probeentnahmen von drei unbeschädigten Reichsformat-Mauersteinen im Labor wird das arithmetische Mittel der Druckfestigkeit ermittelt: <InlineMath math="f_p = 15.0 \text{ N/mm}^2" />. Das Reichsformat hat ca. h = 65 mm und w = 120 mm (<InlineMath math="h/w = 0{,}54" />). Für eine belastbare Aussage sind mindestens 6 Steine (DIN EN 772-1) und eine Mörtelprüfung erforderlich. Der zugehörige Formfaktor beträgt <InlineMath math="d = 0.82" />. Damit lautet die normierte Steinfestigkeit <InlineMath math="f_b" />:
                      <BlockMath math="f_b = f_p \cdot d = 15.0 \cdot 0.82 = 12.3 \text{ N/mm}^2" />
                    </div>
                    <div>
                      <strong className="font-sans text-xs text-slate-400 block uppercase">Schritt 2: Mörtelfestigkeit &amp; charakteristische Festigkeit (f_k) nach EC6</strong>
                      Für den alten Kalksand-Mörtel (historisch weich, entspr. heute ca. Festigkeitsklasse <InlineMath math="f_m = 2.5 \text{ N/mm}^2" />) liefert die empirische EC6-Formel:
                      <BlockMath math="f_k = K \cdot f_b^{0.7} \cdot f_m^{0.3} = 0.55 \cdot (12.3)^{0.7} \cdot (2.5)^{0.3} = 4.19 \text{ N/mm}^2" />
                    </div>
                    <div>
                      <strong className="font-sans text-xs text-slate-400 block uppercase">Schritt 3: Bemessungswert (f_d) nach DIN EN 1996-1-1/NA</strong>
                      Mit dem Dauerstandsbeiwert <InlineMath math="\zeta = 0{,}85" /> und dem Regelwert <InlineMath math="\gamma_M = 1{,}5" /> (DIN EN 1996-1-1/NA, keine Modifikation) ergibt sich:
                      <BlockMath math="f_d = \frac{\zeta \cdot f_k}{\gamma_M} = \frac{0{,}85 \cdot 4{,}19}{1{,}5} = 2{,}37 \text{ N/mm}^2" />
                      <span className="block text-[12px] font-sans text-slate-500">Für Bestandsmauerwerk mit Kalkmörtel die Anwendbarkeit der EC6-Formel und die K-Werte des NA prüfen.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB 3: STATISCHE NACHWEISE IM BESTAND (DBV & EN 1990-2:2026) -------------------- */}
        {mainTab === 'nachweis_bestand' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header info */}
            <div className="text-sm text-slate-700 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 leading-relaxed">
              <h3 className="text-base font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="text-shiraz" size={20} />
                Das Paradoxon des Teilsicherheitskonzepts beim Bauen im Bestand
              </h3>
              <p className="mb-3">
                Das semiprobabilistische Sicherheitskonzept der Eurocodes (DIN EN 1990 mit Ziel-Zuverlässigkeitsindex{' '}
                <InlineMath math="\beta = 3{,}8" /> bzw. Versagenswahrscheinlichkeit{' '}
                <InlineMath math="P_f \approx 10^{-4}" />) wurde ausschließlich für <em>Neubauten</em> konzipiert. Hohe Teilsicherheitsbeiwerte ({' '}
                <InlineMath math="\gamma_G = 1{,}35" />, <InlineMath math="\gamma_c = 1{,}50" />, <InlineMath math="\gamma_s = 1{,}15" />) sichern dort Streuungen ab, die beim Bestandsbau durch Messung (Bauaufnahme, Bohrkerne, Wiegung) teilweise reduziert werden können; Modell- und Einwirkungsunsicherheiten bleiben bestehen.
              </p>
              <p>
                Werden Neubau-Beiwerte unverändert auf den Bestand angewendet, bleiben Informationen aus der Bauwerksuntersuchung ungenutzt.
                Das <strong>DBV-Merkblatt „Bauen im Bestand – Modifizierte Teilsicherheitsbeiwerte“</strong> (Beton und Betonstahl) und die{' '}
                <strong>EN 1990-2:2026 („Assessment of existing structures“)</strong> erlauben auf Grundlage gemessener Kennwerte angepasste Teilsicherheitsbeiwerte und das <strong>Bayes&apos;sche Updating</strong>. Ob sich daraus eine Tragreserve ergibt, hängt vom Stichprobenumfang, der Streuung und der Modellunsicherheit ab – der Rechner unten zeigt, dass der Effekt auch negativ sein kann.
              </p>
            </div>

            {/* Interactive Bestands-Tragfähigkeitsrechner */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-5">
                <div>
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Calculator className="text-shiraz" size={18} />
                    Interaktiver Tragfähigkeits- und Zuverlässigkeitsrechner
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Vergleich: Starre Eurocode-Neubau-Bemessung vs. DBV-Merkblatt vs. probabilistische EN 1990-2:2026-Bemessung
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-shiraz/10 text-shiraz border border-shiraz/20">
                  EN 1990-2:2026 &amp; DBV
                </span>
              </div>

              {/* Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-2">
                    1. Baustoff &amp; Versagensart
                  </span>
                  
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1.5">Materialart:</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['stahl', 'beton', 'mauerwerk'] as const).map((mat) => (
                        <button
                          key={mat}
                          type="button"
                          onClick={() => {
                            setNachweisMaterial(mat);
                            if (mat === 'stahl') {
                              setSampleMean(260);
                              setSampleCov(0.08);
                            } else if (mat === 'beton') {
                              setSampleMean(24);
                              setSampleCov(0.15);
                            } else {
                              setSampleMean(4.5);
                              setSampleCov(0.22);
                            }
                          }}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                            nachweisMaterial === mat
                              ? 'bg-shiraz text-white shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {mat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1.5">Versagensmechanismus:</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFailureDuctility('duktil')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          failureDuctility === 'duktil'
                            ? 'bg-shiraz text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Duktil (Biegezug)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFailureDuctility('sproed')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          failureDuctility === 'sproed'
                            ? 'bg-shiraz text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Spröde (Querkraft/Knick)
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={measuredGeometry}
                        onChange={(e) => setMeasuredGeometry(e.target.checked)}
                        className="rounded text-shiraz focus:ring-shiraz"
                      />
                      <span>Querschnittsmaße millimetergenau aufgemessen</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-2">
                    2. Statistische Stichprobendaten
                  </span>

                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span>Mittelwert der Festigkeit (<InlineMath math="f_m" />):</span>
                      <strong className="font-mono text-shiraz">{sampleMean.toFixed(1)} N/mm²</strong>
                    </div>
                    <input
                      type="range"
                      min={nachweisMaterial === 'stahl' ? 180 : (nachweisMaterial === 'beton' ? 8 : 1.5)}
                      max={nachweisMaterial === 'stahl' ? 550 : (nachweisMaterial === 'beton' ? 60 : 25)}
                      step={nachweisMaterial === 'stahl' ? 5 : (nachweisMaterial === 'beton' ? 1 : 0.5)}
                      value={sampleMean}
                      onChange={(e) => setSampleMean(parseFloat(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span>Variationskoeffizient (<InlineMath math="V_f" />):</span>
                      <strong className="font-mono text-slate-900">{(sampleCov * 100).toFixed(1)} %</strong>
                    </div>
                    <input
                      type="range"
                      min={0.04}
                      max={0.35}
                      step={0.01}
                      value={sampleCov}
                      onChange={(e) => setSampleCov(parseFloat(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Typisch: Stahl 6–10 %, Beton 12–18 %, Mauerwerk 20–30 %
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-2">
                    3. Zuverlässigkeit &amp; Ziel-Index
                  </span>

                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span>Ziel-Zuverlässigkeit (<InlineMath math="\beta" />):</span>
                      <strong className="font-mono text-slate-900">{targetBeta.toFixed(1)}</strong>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                      <button
                        type="button"
                        onClick={() => setTargetBeta(3.8)}
                        className={`py-1 px-2 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                          targetBeta === 3.8
                            ? 'bg-shiraz text-white border-shiraz'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        β = 3.8 (50 a)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTargetBeta(4.7)}
                        className={`py-1 px-2 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                          targetBeta === 4.7
                            ? 'bg-shiraz text-white border-shiraz'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        β = 4.7 (1 a)
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      β gilt für die jeweilige Bezugsdauer (RC2: β₅₀ = 3,8 ≙ β₁ = 4,7). Eine kürzere Restnutzungsdauer senkt β nicht automatisch – Anpassungen nach EN 1990-2:2026 mit Fundstelle begründen.
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span>Modellunsicherheit (<InlineMath math="\gamma_{Rd}" />):</span>
                      <strong className="font-mono text-slate-900">{gammaRd.toFixed(2)}</strong>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="1.3"
                      step="0.05"
                      value={gammaRd}
                      onChange={(e) => setGammaRd(Number(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span>Sensitivitätsfaktor (<InlineMath math="\alpha_R" />):</span>
                      <strong className="font-mono text-slate-900">{alphaR.toFixed(2)}</strong>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Normierter Standardwert nach EN 1990 Anhang C: <InlineMath math="\alpha_R = 0{,}8" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Comparative Results Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Method 1: Eurocode Classic */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      1. Konventioneller Eurocode (Neubau)
                    </span>
                    <strong className="text-xl font-extrabold text-slate-800 block mt-1">
                      {nachweisCalc.f_d_ec.toFixed(2)} N/mm²
                    </strong>
                    <span className="text-xs text-slate-600 block mt-0.5">
                      Bemessungsfestigkeit <InlineMath math="f_d = f_k / \gamma_M" />
                    </span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Charakt. Wert (<InlineMath math="f_k" />):</span>
                      <strong className="font-mono">{nachweisCalc.f_k.toFixed(1)} N/mm²</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Teilsicherheit (<InlineMath math="\gamma_M" />):</span>
                      <strong className="font-mono text-slate-700">{nachweisCalc.gamma_M_ec.toFixed(2)}</strong>
                    </div>
                    <span className="text-[10px] text-rose-600 font-semibold block pt-1">
                      Referenzbasis (0 % Reserve)
                    </span>
                  </div>
                </div>

                {/* Method 2: DBV-Merkblatt */}
                <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                      2. DBV-Merkblatt (Modifiziert)
                    </span>
                    <strong className="text-xl font-extrabold text-amber-900 block mt-1">
                      {nachweisCalc.f_d_dbv.toFixed(2)} N/mm²
                    </strong>
                    <span className="text-xs text-amber-800 block mt-0.5">
                      Modifizierte Teilsicherheit <InlineMath math="\gamma_{M,\text{mod}}" />
                    </span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-200 text-xs text-slate-700 space-y-1">
                    <div className="flex justify-between">
                      <span>Modifizierter Beiwert:</span>
                      <strong className="font-mono text-amber-900">{nachweisCalc.gamma_M_dbv.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Traglastvorteil:</span>
                      <strong className="font-mono text-emerald-700">{nachweisCalc.gainDbvPercent >= 0 ? '+' : ''}{nachweisCalc.gainDbvPercent.toFixed(1)} %</strong>
                    </div>
                    <span className="text-[10px] text-amber-900 font-semibold block pt-1">
                      {nachweisCalc.dbvApplicable
                        ? 'DBV-Merkblatt „Modifizierte Teilsicherheitsbeiwerte für Stahlbetonbauteile“'
                        : 'Nicht anwendbar: Das DBV-Merkblatt gilt nur für Beton und Betonstahl.'}
                    </span>
                  </div>
                </div>

                {/* Method 3: EN 1990-2:2026 (Eurocode 2. Gen) */}
                <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                      3. EN 1990-2:2026 (versuchsgestützt)
                    </span>
                    <strong className="text-xl font-extrabold text-emerald-900 block mt-1">
                      {nachweisCalc.f_d_pren.toFixed(2)} N/mm²
                    </strong>
                    <span className="text-xs text-emerald-800 block mt-0.5">
                      Lognormaler Bemessungswert mit <InlineMath math="\gamma_{Rd}" /></span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-200 text-xs text-slate-700 space-y-1">
                    <div className="flex justify-between">
                      <span>Äquivalente Sicherheit:</span>
                      <strong className="font-mono text-emerald-900">{nachweisCalc.equivalentGammaPren.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Differenz zum Neubauwert:</span>
                      <strong className={`font-mono text-sm font-extrabold ${nachweisCalc.gainPrenPercent >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {nachweisCalc.gainPrenPercent >= 0 ? '+' : ''}{nachweisCalc.gainPrenPercent.toFixed(1)} %
                      </strong>
                    </div>
                    <span className="text-[10px] text-emerald-900 font-semibold block pt-1">
                      Nur mit ausreichender Stichprobe und belegtem V
                    </span>
                  </div>
                </div>
              </div>

              {/* Explanatory Formula Box */}
              <div className="mt-5 p-4 rounded-xl bg-slate-900 text-white font-mono text-xs">
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1">
                  Lognormaler Bemessungswert (Grundgleichung nach DIN EN 1990, Anhang C; Anwendung im Bestand nach EN 1990-2:2026):
                </span>
                <BlockMath math="f_d = \frac{f_m}{\gamma_{Rd}} \cdot \exp\left(-\alpha_R \cdot \beta \cdot \sigma_{\ln} - 0{,}5 \cdot \sigma_{\ln}^2\right),\quad \sigma_{\ln} = \sqrt{\ln(1 + V_f^2)}" />
                <div className="text-[11px] text-slate-300 font-sans mt-2 leading-relaxed">
                  <strong>Ergebnis-Interpretation:</strong> Durch den Nachweis geringer In-situ-Streuung (<InlineMath math={`V_f = ${(sampleCov * 100).toFixed(1)}\\%`} />) ergibt sich gegenüber dem Neubauwert eine Differenz von{' '}
                  <strong className="text-emerald-400">{nachweisCalc.gainPrenPercent >= 0 ? '+' : ''}{nachweisCalc.gainPrenPercent.toFixed(1)} %</strong>. Ergibt sich eine Reserve, kann eine Verstärkung ggf. entfallen; Voraussetzung sind ausreichende Stichproben und die Berücksichtigung der Modellunsicherheit.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    
      <ModuleFooter 
        wikipedia={[
          { title: 'Baustoffprüfung', url: 'https://de.wikipedia.org/wiki/Baustoffpr%C3%BCfung' },
          { title: 'Bohrkern', url: 'https://de.wikipedia.org/wiki/Bohrkern' },
          { title: 'Eurocode 2', url: 'https://de.wikipedia.org/wiki/Eurocode_2' },
          { title: 'Mauerwerk', url: 'https://de.wikipedia.org/wiki/Mauerwerk' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1990 Anhang D (Versuchsgestützte Bemessung)', url: 'https://www.dinmedia.de/' },
          { title: 'EN 1990-2:2026 (Eurocode: Bewertung bestehender Tragwerke - Existing Structures)', url: 'https://www.dinmedia.de/' },
          { title: 'DBV-Merkblatt: Bauen im Bestand – Modifizierte Teilsicherheitsbeiwerte', url: 'https://www.betonverein.de/' },
          { title: 'DIN EN 1992-1-1 (Eurocode 2: Bemessung und Konstruktion von Betontragwerken)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 13791 (Bewertung der In-situ-Druckfestigkeit in Bauwerken)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 12504-1 (Prüfung von Beton in Bauwerken - Teil 1: Bohrkerne)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 1996-1-1 (Eurocode 6: Bemessung und Konstruktion von Mauerwerksbauten)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN ISO 6892-1 (Metallische Werkstoffe - Zugversuch)', url: 'https://www.dinmedia.de/' }
        ]}
        literatur={[
          'DBV (Deutscher Beton- und Bautechnik-Verein): Merkblatt Modifizierte Teilsicherheitsbeiwerte',
          'Wicke, M. et al.: Historische Baukonstruktion und Sanierung',
          'Ahnert, R., Krause, K. H.: Typische Baukonstruktionen von 1860 bis 1960',
          'DBV-Merkblätter „Bauen im Bestand“ (Beton und Betonstahl; Modifizierte Teilsicherheitsbeiwerte)',
          'Fischer, A.: Bestimmung modifizierter Teilsicherheitsbeiwerte zur Beurteilung von Bestandsbauten (Dissertation)'
        ]}
        formeln={[
          {
            formel: 'f_d = f_m \\cdot \\exp\\left(-\\alpha_R \\cdot \\beta \\cdot V_f - 0{,}5 \\cdot V_f^2\\right)',
            erklaerung: 'Probabilistischer Bemessungswert nach EN 1990-2:2026 zur Bewertung von Bestandsbauten unter Berücksichtigung von Mittelwert f_m, Sensitivitätsfaktor alpha_R (0.8), Zuverlässigkeitsindex beta und Variationskoeffizient V_f.',
            quelle: 'EN 1990-2:2026'
          },
          {
            formel: 'f_{is,cyl} = f_{c,core} \\cdot k_{ratio} \\cdot k_{moist} \\cdot k_{rebar} \\cdot k_{dia}',
            erklaerung: 'Sorgfältige aggressive Umrechnung der in-situ Bohrkern-Festigkeit auf standardisierte Zylinder-Größe (DIN EN 13791).\n\nParameter:\n• f_{is,cyl}: Äquivalente in-situ Zylinderdruckfestigkeit [N/mm²]\n• f_{c,core}: Experimentell gemessene Bohrkerndruckfestigkeit [N/mm²]\n• k_{ratio} (oder k_{ratioToCylinder}): Schlankheits-Formbeiwert bezogen auf Höhe/Durchmesser-Verhältnis (h/d)\n• k_{moist}: Korrekturbeiwert für den Feuchtezustand (nass = 1.09, raumklimatrocken = 1.00, ofentrocken = 0.92)\n• k_{rebar}: Minderungskoeffizient für getroffene Bewehrung im Kern (ohne = 1.00, 1 Stab = 1.04, 2 Stäbe = 1.10)\n• k_{dia}: Maßstabsfaktor für den Kernmaßstab (Ø50 = 0.85, Ø80 = 0.95, Ø100 = 1.00, Ø150 = 1.02)',
            quelle: 'DIN EN 13791'
          },
          {
            formel: 'f_k = K \\cdot f_b^{\\alpha} \\cdot f_m^{\\beta}',
            erklaerung: 'Charakteristische Druckfestigkeit des Mauerwerks nach Eurocode 6.\n\nParameter:\n• f_k: Charakteristische Tragfähigkeit der Mauerwerkswand [N/mm²]\n• K: Systembeiwert der Stein-Mörtel-Paarung (standardisiert K = 0.55 für Steingruppe 1 mit Normalmörtel)\n• f_b: Normierte Steindruckfestigkeit (inklusive Formbeiwert d) [N/mm²]\n• f_m: Festigkeit des Mauermörtels [N/mm²]\n• \\alpha: Exponentielle Einwirkmacht der Steinqualität (Eurocode-Wert = 0.7)\n• \\beta: Exponentielle Einwirkmacht der Mörtelqualität (Eurocode-Wert = 0.3)',
            quelle: 'DIN EN 1996-1-1'
          },
          {
            formel: 'R_{eH} = \\frac{F_{eH}}{A_0} \\quad \\text{bzw.} \\quad R_m = \\frac{F_m}{A_0}',
            erklaerung: 'Mechanische Spannungsübertragungen aus dem Zerreißversuch von historischen Baustählen.\n\nParameter:\n• R_{eH}: Elastische obere Streckgrenze des Stahls [N/mm²]\n• R_m: Maximale plastische Zugfestigkeit [N/mm²]\n• F_{eH}: Beanspruchende Zugkraft beim Einsetzen des Fließens [kN]\n• F_m: Höchste ertragbare Zugkraft der flachen oder runden Probe [kN]\n• A_0: Anfangs-Nettomessquerschnitt der Stahlprobe [mm²]',
            quelle: 'DIN EN ISO 6892-1'
          }
        ]}
      />
    </div>
  );
}
