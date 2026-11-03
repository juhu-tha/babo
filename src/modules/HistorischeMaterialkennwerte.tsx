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
import { fcdBeton, FCD_MODUL, GAMMA_C } from '@/src/data/kennwerte';
import { EC3_NA_DE } from '@/src/calc/stahlbau';
import { GAMMA_M_MW, ZETA_MW } from '@/src/calc/mauerwerk';
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
import { BohrkernserieTab } from './historischematerialkennwerte/BohrkernserieTab';
import inhalt from '@/content/historischematerialkennwerte/HistorischeMaterialkennwerte.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type KennwerteReiter = 'datenbank' | 'rechner_labor' | 'bohrkernserie' | 'nachweis_bestand';
const REITER: readonly ModulTab<KennwerteReiter>[] = [
  { id: 'datenbank', label: inhalt.texte.historischeMaterialdatenbank.trim(), icon: Database },
  { id: 'rechner_labor', label: inhalt.texte.rechnerLaborprüfungen.trim(), icon: Calculator },
  // Ergänzung 02.11.2026: Probenanzahl und Statistik nach DIN EN 13791:2020-02
  { id: 'bohrkernserie', label: inhalt.texte.bohrkernserieDinEn13791.trim(), icon: Activity },
  { id: 'nachweis_bestand', label: inhalt.texte.statischeNachweiseImBestand.trim(), icon: ShieldCheck },
];

export default function HistorischeMaterialkennwerte() {
  // Main toggle between Database, Laboratory Converter and Existing Structures Design tabs
  const [mainTab, setMainTab] = useState<KennwerteReiter>('datenbank');

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
    // γ_M nach Eurocode aus den zentralen Konstanten (Umstellung 03.11.2026): Stahl γ_M0 (EC3/NA), Beton γ_C, Mauerwerk γ_M
    const gamma_M_ec = nachweisMaterial === 'stahl' ? EC3_NA_DE.gammaM0 : nachweisMaterial === 'beton' ? GAMMA_C.staendig : GAMMA_M_MW;
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
    // f_cd zentral (src/data/kennwerte.ts, α_cc = 0,85): Neubau-Ansatz γ_c = 1,5 und Bestandsbewertung mit
    // γ_c = 1,35 nach DBV-Merkblatt „Modifizierte Teilsicherheitsbeiwerte für Stahlbetonbauteile“ (2013); Quelle siehe kennwerte.ts.
    const fCdStandard = fcdBeton(fIsCyl, FCD_MODUL.historischStandard);
    const fCdAssessment = fcdBeton(fIsCyl, FCD_MODUL.historischBewertung);

    // Aus EINEM Kern keine Festigkeitsklasse: Einstufung erfolgt über die Stichprobe (siehe coreSeries)
    const classEstimate = inhalt.werte.nurAusStichprobeN;

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
    const fD = fdMasonry(fK, GAMMA_M_MW, ZETA_MW);

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
    const gammaM0 = EC3_NA_DE.gammaM0;
    const fYd = yieldStrengthMpa / gammaM0;

    let designation = inhalt.werte.s235jrSt372;
    if (yieldStrengthMpa < 210) designation = inhalt.werte.schmiedeeisenFlusseisen1900;
    else if (yieldStrengthMpa < 255) designation = inhalt.werte.st372S235jr;
    else if (yieldStrengthMpa < 310) designation = inhalt.werte.st442S275jr;
    else if (yieldStrengthMpa < 450) designation = inhalt.werte.st523S355j2;
    else designation = inhalt.werte.bst500sB500bBetonstahl;

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
            label: inhalt.werte.streckgrenzeZugfestigkeitMpa,
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
        title: { display: true, text: inhalt.werte.festigkeitMpa },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="border-b border-home-grau/30 p-6 bg-slate-50/50">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <HistoryIcon className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.historischeKennwertePrüfungsverfahren} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.forschungswerkzeugFürDasBauen} /></p>
        </div>
        </div>

        <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={mainTab} onWechsel={setMainTab} className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:bg-slate-50/50 [&>[role=tablist]]:p-4">
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
        {mainTab === 'bohrkernserie' && <BohrkernserieTab />}

        {mainTab === 'nachweis_bestand' && (
          <NachweisBestandTab setNachweisMaterial={setNachweisMaterial} setSampleMean={setSampleMean} setSampleCov={setSampleCov} nachweisMaterial={nachweisMaterial} failureDuctility={failureDuctility} setFailureDuctility={setFailureDuctility} measuredGeometry={measuredGeometry} setMeasuredGeometry={setMeasuredGeometry} sampleMean={sampleMean} sampleCov={sampleCov} targetBeta={targetBeta} setTargetBeta={setTargetBeta} gammaRd={gammaRd} setGammaRd={setGammaRd} alphaR={alphaR} nachweisCalc={nachweisCalc} />
        )}
      </div>
        </ModuleTabs>
    </div>
    
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1BemessungswertDer}
        zielGleichung="f_d = f_m \cdot \exp\left(-\alpha_R \cdot \beta \cdot V - 0{,}5 \cdot V^2\right)"
        schritte={inhalt.daten["HistorischeMaterialkennwerte.schritte"]}
        ergebnisHinweis={inhalt.werte.zumVergleichKlassischMit}
        normQuelle={inhalt.werte.dinEn1990Anhang}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2ZugversuchAn}
        zielGleichung="R_{eH} = \frac{F_{eH}}{A_0}, \quad R_m = \frac{F_m}{A_0}"
        schritte={inhalt.daten["HistorischeMaterialkennwerte.schritte_2"]}
        ergebnisHinweis={inhalt.werte.dieWerteLiegenIm}
        normQuelle={inhalt.werte.dinEnIso6892}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="historisch" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap8} 
        wikipedia={[
          { title: 'Baustoffprüfung', url: 'https://de.wikipedia.org/wiki/Baustoffpr%C3%BCfung' },
          { title: 'Bohrkern', url: 'https://de.wikipedia.org/wiki/Bohrkern' },
          { title: 'Eurocode 2', url: 'https://de.wikipedia.org/wiki/Eurocode_2' },
          { title: 'Mauerwerk', url: 'https://de.wikipedia.org/wiki/Mauerwerk' }
        ]}
        regelwerke={inhalt.daten["HistorischeMaterialkennwerte.regelwerke"]}
        literatur={inhalt.daten["HistorischeMaterialkennwerte.literatur"]}
        formeln={inhalt.daten["HistorischeMaterialkennwerte.formeln"]}
      />
    </div>
  );
}
