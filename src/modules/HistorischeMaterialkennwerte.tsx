import { formatDeZahl, formatDeTeX, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
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
  Ruler, 
  BookOpen, 
  Activity, 
  Layers,
  ShieldCheck,
  History as HistoryIcon,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { MaterialCategory, historicalData } from '@/src/data/historicalMaterialsData';
import { NachweisBestandTab } from './historischematerialkennwerte/NachweisBestandTab';
import { RechnerLaborTab } from './historischematerialkennwerte/RechnerLaborTab';
import { DatenbankTab } from './historischematerialkennwerte/DatenbankTab';

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
          <button aria-pressed={mainTab === 'datenbank'}
            onClick={() => setMainTab('datenbank')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              mainTab === 'datenbank'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Database size={16} /> Historische Materialdatenbank
          </button>
          <button aria-pressed={mainTab === 'rechner_labor'}
            onClick={() => setMainTab('rechner_labor')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              mainTab === 'rechner_labor'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Calculator size={16} /> Rechner &amp; Laborprüfungen
          </button>
          <button aria-pressed={mainTab === 'nachweis_bestand'}
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
          <DatenbankTab setActiveCategory={setActiveCategory} setExpandedIndex={setExpandedIndex} activeCategory={activeCategory} currentData={currentData} expandedIndex={expandedIndex} chartData={chartData} chartOptions={chartOptions} />
        )}

        {/* -------------------- TAB 2: RECHNER & LABORPRÜFUNGEN -------------------- */}
        {mainTab === 'rechner_labor' && (
          <RechnerLaborTab probeType={probeType} setProbeType={setProbeType} setCoreDiameter={setCoreDiameter} coreHeight={coreHeight} setCoreHeight={setCoreHeight} coreDiameter={coreDiameter} failureForceKn={failureForceKn} setFailureForceKn={setFailureForceKn} setCoreMoisture={setCoreMoisture} coreMoisture={coreMoisture} setCoreRebar={setCoreRebar} coreRebar={coreRebar} brickWidth={brickWidth} setBrickWidth={setBrickWidth} brickLength={brickLength} setBrickLength={setBrickLength} brickHeight={brickHeight} setBrickHeight={setBrickHeight} brickForceKn={brickForceKn} setBrickForceKn={setBrickForceKn} mortarStrength={mortarStrength} setMortarStrength={setMortarStrength} steelForm={steelForm} setSteelForm={setSteelForm} steelWidth={steelWidth} setSteelWidth={setSteelWidth} steelThickness={steelThickness} setSteelThickness={setSteelThickness} steelDiameter={steelDiameter} setSteelDiameter={setSteelDiameter} steelForceYieldKn={steelForceYieldKn} setSteelForceYieldKn={setSteelForceYieldKn} steelForceTensileKn={steelForceTensileKn} setSteelForceTensileKn={setSteelForceTensileKn} coreSeries={coreSeries} calculatedConcrete={calculatedConcrete} coreSeriesText={coreSeriesText} setCoreSeriesText={setCoreSeriesText} calculatedBrick={calculatedBrick} calculatedSteel={calculatedSteel} />
        )}

        {/* -------------------- TAB 3: STATISCHE NACHWEISE IM BESTAND (DBV & EN 1990-2:2026) -------------------- */}
        {mainTab === 'nachweis_bestand' && (
          <NachweisBestandTab setNachweisMaterial={setNachweisMaterial} setSampleMean={setSampleMean} setSampleCov={setSampleCov} nachweisMaterial={nachweisMaterial} failureDuctility={failureDuctility} setFailureDuctility={setFailureDuctility} measuredGeometry={measuredGeometry} setMeasuredGeometry={setMeasuredGeometry} sampleMean={sampleMean} sampleCov={sampleCov} targetBeta={targetBeta} setTargetBeta={setTargetBeta} gammaRd={gammaRd} setGammaRd={setGammaRd} alphaR={alphaR} nachweisCalc={nachweisCalc} />
        )}
      </div>
    </div>
    
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Bemessungswert der Betonfestigkeit aus Bestandsprüfungen (lognormal)"
        zielGleichung="f_d = f_m \cdot \exp\left(-\alpha_R \cdot \beta \cdot V - 0{,}5 \cdot V^2\right)"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Mittelwert aus Bohrkernen f_m = 25,0 N/mm², Variationskoeffizient V = 0,15; α_R = 0,8, β = 3,8 (Referenzzeitraum 50 Jahre, RC2):', formel: '\\alpha_R \\cdot \\beta \\cdot V = 0{,}8 \\cdot 3{,}8 \\cdot 0{,}15 = 0{,}456' },
          { titel: 'Exponent', erklaerung: 'Mit Lognormal-Korrekturterm:', formel: '-0{,}456 - 0{,}5 \\cdot 0{,}15^2 = -0{,}467 \\Rightarrow e^{-0{,}467} = 0{,}627' },
          { titel: 'Bemessungswert', erklaerung: 'Direkter Bemessungswert ohne Teilsicherheitsbeiwert:', formel: 'f_d = 25{,}0 \\cdot 0{,}627 = 15{,}7\\,\\text{N/mm}^2' }
        ]}
        ergebnisHinweis="Zum Vergleich: Klassisch mit f_ck = 20 N/mm² und γ_c = 1,5 ergäbe sich 13,3 N/mm² (ohne α_cc). Gemessene, geringe Streuung kann im Bestand Reserven aufdecken – Modelleunsicherheit und Umrechnungsfaktoren sind zusätzlich zu berücksichtigen."
        normQuelle="DIN EN 1990, Anhang C/D; EN 1990-2:2026 (DIN-Fassung noch nicht erschienen, geplant 2027)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Zugversuch an einem historischen Flussstahl"
        zielGleichung="R_{eH} = \frac{F_{eH}}{A_0}, \quad R_m = \frac{F_m}{A_0}"
        schritte={[
          { titel: 'Probe', erklaerung: 'Rundprobe aus einem Unterzug um 1910, Ausgangsdurchmesser 20 mm:', formel: 'A_0 = \\frac{\\pi \\cdot 20^2}{4} = 314{,}2\\,\\text{mm}^2' },
          { titel: 'Streckgrenze', erklaerung: 'Obere Streckgrenzkraft 70 kN:', formel: 'R_{eH} = \\frac{70\\,000}{314{,}2} = 223\\,\\text{N/mm}^2' },
          { titel: 'Zugfestigkeit', erklaerung: 'Höchstkraft 113 kN:', formel: 'R_m = \\frac{113\\,000}{314{,}2} = 360\\,\\text{N/mm}^2, \\quad \\frac{R_m}{R_{eH}} = 1{,}61' }
        ]}
        ergebnisHinweis="Die Werte liegen im Bereich heutiger S235-Stähle. Vor einer Schweißung sind Schweißeignung (chemische Analyse, P- und S-Gehalt, Alterung) und Sprödbruchneigung zu prüfen; Flussstahl vor etwa 1900 kann auch Puddeleisen sein."
        normQuelle="DIN EN ISO 6892-1"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="historisch" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 8 Bestand: probabilistischer Bemessungswert, Umrechnungen, Normausgaben und Literatur geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Baustoffprüfung', url: 'https://de.wikipedia.org/wiki/Baustoffpr%C3%BCfung' },
          { title: 'Bohrkern', url: 'https://de.wikipedia.org/wiki/Bohrkern' },
          { title: 'Eurocode 2', url: 'https://de.wikipedia.org/wiki/Eurocode_2' },
          { title: 'Mauerwerk', url: 'https://de.wikipedia.org/wiki/Mauerwerk' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1990 Anhang D (Versuchsgestützte Bemessung)' },
          { title: 'EN 1990-2:2026 (Eurocode – Grundlagen der Bewertung und Ertüchtigung bestehender Tragwerke; ersetzt CEN/TS 17440:2020; DIN-Fassung noch nicht erschienen, geplant 2027)' },
          { title: 'DBV-Merkblatt: Bauen im Bestand – Modifizierte Teilsicherheitsbeiwerte', url: 'https://www.betonverein.de/' },
          { title: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA (Eurocode 2); neue Generation 2025-09' },
          { title: 'DIN EN 13791:2020-02 + A20:2022-04 (Bewertung der In-situ-Druckfestigkeit in Bauwerken)' },
          { title: 'DIN EN 12504-1:2021-02 (Prüfung von Beton in Bauwerken – Teil 1: Bohrkernproben)' },
          { title: 'DIN EN 1996-1-1 (Eurocode 6: Bemessung und Konstruktion von Mauerwerksbauten)' },
          { title: 'DIN EN ISO 6892-1 (Metallische Werkstoffe - Zugversuch)' }
        ]}
        literatur={[
          'DBV (Deutscher Beton- und Bautechnik-Verein): Merkblatt Modifizierte Teilsicherheitsbeiwerte',
          
          'Ahnert, R.; Krause, K. H.: Typische Baukonstruktionen von 1860 bis 1960, Bände 1–3. Berlin: Huss-Medien (aktuelle Auflage)',
          'DBV-Merkblätter „Bauen im Bestand“ (Beton und Betonstahl; Modifizierte Teilsicherheitsbeiwerte)',
          'Fischer, A.: Bestimmung modifizierter Teilsicherheitsbeiwerte zur Beurteilung von Bestandsbauten (Dissertation)'
        ]}
        formeln={[
          {
            formel: 'f_d = f_m \\cdot \\exp\\left(-\\alpha_R \\cdot \\beta \\cdot V_f - 0{,}5 \\cdot V_f^2\\right)',
            erklaerung: 'Probabilistischer Bemessungswert nach EN 1990-2:2026 zur Bewertung von Bestandsbauten unter Berücksichtigung von Mittelwert f_m, Sensitivitätsfaktor alpha_R (0,8), Zuverlässigkeitsindex beta und Variationskoeffizient V_f.',
            quelle: 'EN 1990-2:2026'
          },
          {
            formel: 'f_{is,cyl} = f_{c,core} \\cdot k_{ratio} \\cdot k_{moist} \\cdot k_{rebar} \\cdot k_{dia}',
            erklaerung: 'Umrechnung der In-situ-Bohrkernfestigkeit auf standardisierte Zylinder-Größe (DIN EN 13791).\n\nParameter:\n• f_{is,cyl}: Äquivalente in-situ Zylinderdruckfestigkeit [N/mm²]\n• f_{c,core}: Experimentell gemessene Bohrkerndruckfestigkeit [N/mm²]\n• k_{ratio} (oder k_{ratioToCylinder}): Schlankheits-Formbeiwert bezogen auf Höhe/Durchmesser-Verhältnis (h/d)\n• k_{moist}: Korrekturbeiwert für den Feuchtezustand (nass = 1.09, raumklimatrocken = 1.00, ofentrocken = 0.92)\n• k_{rebar}: Minderungskoeffizient für getroffene Bewehrung im Kern (ohne = 1.00, 1 Stab = 1.04, 2 Stäbe = 1.10)\n• k_{dia}: Maßstabsfaktor für den Kernmaßstab (Ø50 = 0.85, Ø80 = 0.95, Ø100 = 1.00, Ø150 = 1.02)',
            quelle: 'DIN EN 13791'
          },
          {
            formel: 'f_k = K \\cdot f_b^{\\alpha} \\cdot f_m^{\\beta}',
            erklaerung: 'Charakteristische Druckfestigkeit des Mauerwerks nach Eurocode 6.\n\nParameter:\n• f_k: Charakteristische Tragfähigkeit der Mauerwerkswand [N/mm²]\n• K: Systembeiwert der Stein-Mörtel-Paarung (empfohlener Wert K = 0,55 für Mauerziegel Gruppe 1 mit Normalmauermörtel; der deutsche NA verwendet abweichende Tabellenwerte)\n• f_b: Normierte Steindruckfestigkeit (inklusive Formbeiwert d) [N/mm²]\n• f_m: Festigkeit des Mauermörtels [N/mm²]\n• \\alpha: Exponentielle Einwirkmacht der Steinqualität (Eurocode-Wert = 0.7)\n• \\beta: Exponentielle Einwirkmacht der Mörtelqualität (Eurocode-Wert = 0.3)',
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
