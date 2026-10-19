import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Calculator, Network } from 'lucide-react';
import StatistischeVersuchsplanung from './StatistischeVersuchsplanung';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter, Bar } from 'react-chartjs-2';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// Helper to generate random normal distribution (Box-Muller)
function randomNormal(mean: number, stdDev: number) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

// Error function approximation (Abramowitz and Stegun)
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);

  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

// Cumulative distribution function (CDF) for normal distribution
function normalCDF(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) return x < mean ? 0 : 1;
  return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
}

// Probability density function (PDF) for normal distribution
function normalPDF(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) return x === mean ? 1 : 0;
  const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
  const coeff = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  return coeff * Math.exp(exponent);
}

type MaterialType = 'beton' | 'stahl' | 'holz';
type OutlierMethod = '2sigma' | 'grubbs' | 'boxplot';

export default function Statistik() {
  const [activeTab, setActiveTab] = useState<'grundlagen' | 'probengenerator' | 'doe'>('grundlagen');
  const [material, setMaterial] = useState<MaterialType>('beton');
  const [outlierMethod, setOutlierMethod] = useState<OutlierMethod>('2sigma');
  const [numberOfSamples, setNumberOfSamples] = useState<number>(15);
  const [statValues, setStatValues] = useState<number[]>([]);
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [progress, setProgress] = useState(0);

  // Real-time Begriffserklärer state
  const [interactiveSamples, setInteractiveSamples] = useState<number[]>([25, 30, 38, 42, 48, 67]);
  const [hoveredMetric, setHoveredMetric] = useState<'mean' | 'median' | 'stddev' | 'cv' | null>(null);
  const [interactiveChartMode, setInteractiveChartMode] = useState<'pdf' | 'cdf'>('pdf');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const intStats = useMemo(() => {
    const vals = [...interactiveSamples];
    const n = vals.length;
    const sorted = [...vals].sort((a, b) => a - b);
    const mean = vals.reduce((sum, val) => sum + val, 0) / n;
    const variance = vals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0 ? (stdDev / mean) * 100 : 0;
    const median = n % 2 === 0 ? (sorted[n/2 - 1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];
    return { n, sorted, mean, median, stdDev, cv };
  }, [interactiveSamples]);

  const getSgX = (val: number) => {
    const minVal = 10;
    const maxVal = 80;
    const padding = 40;
    const width = 420;
    const capped = Math.max(minVal, Math.min(maxVal, val));
    return padding + ((capped - minVal) / (maxVal - minVal)) * width;
  };

  const pdfScale = useMemo(() => {
    const peakDensity = normalPDF(intStats.mean, intStats.mean, intStats.stdDev);
    return peakDensity > 0 ? (75 / peakDensity) * (1 - Math.min(0.25, intStats.stdDev / 120)) : 1000;
  }, [intStats.mean, intStats.stdDev]);

  const curvePoints = useMemo(() => {
    const pts: { x: number; yPdf: number; yCdf: number }[] = [];
    for (let v = 10; v <= 80; v += 1) {
      const x = getSgX(v);
      const d = normalPDF(v, intStats.mean, intStats.stdDev);
      const yPdf = 115 - d * pdfScale;

      const c = normalCDF(v, intStats.mean, intStats.stdDev);
      const yCdf = 115 - c * 80;

      pts.push({ x, yPdf, yCdf });
    }
    return pts;
  }, [intStats.mean, intStats.stdDev, pdfScale]);

  const pdfPathClosed = useMemo(() => {
    if (curvePoints.length === 0) return '';
    const coords = curvePoints.map(p => `${p.x.toFixed(1)},${p.yPdf.toFixed(1)}`).join(' L ');
    return `M 40,115 L ${coords} L 460,115 Z`;
  }, [curvePoints]);

  const pdfLine = useMemo(() => {
    if (curvePoints.length === 0) return '';
    return 'M ' + curvePoints.map(p => `${p.x.toFixed(1)},${p.yPdf.toFixed(1)}`).join(' L ');
  }, [curvePoints]);

  const cdfPathClosed = useMemo(() => {
    if (curvePoints.length === 0) return '';
    const coords = curvePoints.map(p => `${p.x.toFixed(1)},${p.yCdf.toFixed(1)}`).join(' L ');
    return `M 40,115 L ${coords} L 460,115 Z`;
  }, [curvePoints]);

  const cdfLine = useMemo(() => {
    if (curvePoints.length === 0) return '';
    return 'M ' + curvePoints.map(p => `${p.x.toFixed(1)},${p.yCdf.toFixed(1)}`).join(' L ');
  }, [curvePoints]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearCurrentInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handlePointerDown = (idx: number, e: React.PointerEvent<SVGElement>) => {
    e.preventDefault();
    setDraggedIndex(idx);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggedIndex === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const xSvg = (clientX / rect.width) * 500;

    const minVal = 10;
    const maxVal = 80;
    const padding = 40;
    const width = 420;

    let newVal = minVal + ((xSvg - padding) / width) * (maxVal - minVal);
    newVal = Math.max(10, Math.min(80, newVal));

    setInteractiveSamples(prev => {
      const next = [...prev];
      next[draggedIndex] = Number(newVal.toFixed(1));
      return next;
    });
  };

  const handlePointerUp = (e: React.PointerEvent<SVGElement>) => {
    if (draggedIndex !== null) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setDraggedIndex(null);
    }
  };

  const getMaterialProps = () => {
    switch (material) {
      case 'beton': return { fc: 38, fy: undefined };
      case 'stahl': return { fc: undefined, fy: 500 };
      case 'holz': return { fc: 45, fy: undefined };
    }
  };

  const runStatistikTest = () => {
    setTestStatus('running');
    setProgress(0);
    setStatValues([]);

    let currentStep = 0;
    const steps = numberOfSamples;
    const targetData: number[] = [];
    
    const props = getMaterialProps();
    let targetMean = props.fc || 38;
    if (material === 'stahl') targetMean = props.fy || 500;
    
    let cv = 0.10;
    if (material === 'stahl') cv = 0.05;
    if (material === 'holz') cv = 0.15;
    
    const targetStdDev = targetMean * cv;

    for (let i = 0; i < steps; i++) {
      targetData.push(randomNormal(targetMean, targetStdDev));
    }
    
    // Force at least one outlier ALWAYS
    const outlierIndex = Math.floor(Math.random() * steps);
    const sign = Math.random() > 0.5 ? 1 : -1;
    targetData[outlierIndex] = targetMean + sign * targetStdDev * (4 + Math.random());

    clearCurrentInterval();
    intervalRef.current = setInterval(() => {
      if (currentStep < steps) {
        const nextVal = targetData[currentStep];
        if (nextVal !== undefined && !isNaN(nextVal)) {
          setStatValues(prev => [...prev, nextVal]);
        }
        setProgress(((currentStep + 1) / steps) * 100);
        currentStep++;
      } else {
        clearCurrentInterval();
        setTestStatus('finished');
      }
    }, 100);
  };

  const resetTest = () => {
    clearCurrentInterval();
    setTestStatus('idle');
    setStatValues([]);
    setProgress(0);
  };

  useEffect(() => {
    resetTest();
  }, [material]);

  useEffect(() => {
    return () => clearCurrentInterval();
  }, []);

  const stats = useMemo(() => {
    if (statValues.length === 0) return null;

    const n = statValues.length;
    const sorted = [...statValues].sort((a, b) => a - b);
    const median = n % 2 === 0 ? (sorted[n/2 - 1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];

    const mean = statValues.reduce((a, b) => a + b, 0) / n;
    const variance = n > 1 ? statValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1) : 0;
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0 ? (stdDev / mean) * 100 : 0;

    let isOutlierFn = (v: number) => false;
    let thresholdDesc = 'Wird nach Generierung berechnet...';
    let lowerBound = 0;
    let upperBound = 0;
    let formula = '';

    if (testStatus === 'finished') {
      if (outlierMethod === '2sigma') {
        const threshold = 2 * stdDev;
        lowerBound = mean - threshold;
        upperBound = mean + threshold;
        isOutlierFn = (v) => v < lowerBound || v > upperBound;
        thresholdDesc = `± 2σ`;
        formula = '\\mu \\pm 2\\sigma';
      } else if (outlierMethod === 'boxplot') {
        const q1 = sorted[Math.floor(n * 0.25)];
        const q3 = sorted[Math.floor(n * 0.75)];
        const iqr = q3 - q1;
        lowerBound = q1 - 1.5 * iqr;
        upperBound = q3 + 1.5 * iqr;
        isOutlierFn = (v) => v < lowerBound || v > upperBound;
        thresholdDesc = `1.5 IQR`;
        formula = '[Q_1 - 1.5 \\cdot IQR, Q_3 + 1.5 \\cdot IQR]';
      } else if (outlierMethod === 'grubbs') {
        const gCrit = 2.409;
        lowerBound = mean - gCrit * stdDev;
        upperBound = mean + gCrit * stdDev;
        isOutlierFn = (v) => v < lowerBound || v > upperBound;
        thresholdDesc = `Grubbs G > ${formatDeWert(gCrit)}`;
        formula = '\\mu \\pm G_{crit} \\cdot \\sigma';
      }
    }

    const cleanedValues = statValues.filter(v => !isOutlierFn(v));
    const outliers = statValues.filter(v => isOutlierFn(v));

    const nClean = cleanedValues.length;
    const meanClean = nClean > 0 ? cleanedValues.reduce((a, b) => a + b, 0) / nClean : 0;
    const varianceClean = nClean > 1 ? cleanedValues.reduce((a, b) => a + Math.pow(b - meanClean, 2), 0) / (nClean - 1) : 0;
    const stdDevClean = Math.sqrt(varianceClean);

    let kn = 2.0; 
    if (nClean === 15) kn = 1.99;
    else if (nClean === 14) kn = 2.01;
    else if (nClean === 13) kn = 2.04;
    else kn = 2.0;

    const xk = meanClean - kn * stdDevClean;
    
    let gammaM = 1.5;
    if (material === 'stahl') gammaM = 1.15;
    if (material === 'holz') gammaM = 1.3;

    const xd = xk / gammaM;

    return {
      n, mean, stdDev, cv, median,
      cleanedValues, outliers, isOutlierFn, thresholdDesc,
      lowerBound, upperBound, formula,
      nClean, meanClean, stdDevClean,
      kn, xk, xd, gammaM
    };
  }, [statValues, outlierMethod, material, testStatus]);

  const statChartData = useMemo(() => {
    if (!stats) return { datasets: [] };

    const dataPoints = statValues.map((v, i) => ({
      x: i + 1,
      y: v,
      isOutlier: stats.isOutlierFn(v)
    }));

    return {
      datasets: [
        {
          label: 'Gültige Werte',
          data: dataPoints.filter(p => !p.isOutlier),
          backgroundColor: '#A3113E',
          pointRadius: 6,
        },
        {
          label: 'Ausreißer',
          data: dataPoints.filter(p => p.isOutlier),
          backgroundColor: '#A3113E',
          borderColor: '#A3113E',
          borderWidth: 2,
          pointRadius: 8,
          pointStyle: 'circle',
        },
        {
          label: 'Mittelwert (bereinigt)',
          data: [{x: 0, y: stats.meanClean}, {x: numberOfSamples + 1, y: stats.meanClean}],
          borderColor: '#475569',
          borderWidth: 2,
          showLine: true,
          pointRadius: 0,
        },
        {
          label: 'Charakt. Wert (X_k)',
          data: [{x: 0, y: stats.xk}, {x: numberOfSamples + 1, y: stats.xk}],
          borderColor: '#64748b',
          borderWidth: 2,
          borderDash: [5, 5],
          showLine: true,
          pointRadius: 0,
        },
        {
          label: 'Bemessungswert (X_d)',
          data: [{x: 0, y: stats.xd}, {x: numberOfSamples + 1, y: stats.xd}],
          borderColor: '#64748b',
          borderWidth: 2,
          borderDash: [2, 2],
          showLine: true,
          pointRadius: 0,
        },
        {
          label: 'Ausreißer-Grenze (Oben)',
          data: testStatus === 'finished' ? [{x: 0, y: stats.upperBound}, {x: numberOfSamples + 1, y: stats.upperBound}] : [],
          borderColor: '#A3113E',
          borderWidth: 1,
          borderDash: [4, 4],
          showLine: true,
          pointRadius: 0,
        },
        {
          label: 'Ausreißer-Grenze (Unten)',
          data: testStatus === 'finished' ? [{x: 0, y: stats.lowerBound}, {x: numberOfSamples + 1, y: stats.lowerBound}] : [],
          borderColor: '#A3113E',
          borderWidth: 1,
          borderDash: [4, 4],
          showLine: true,
          pointRadius: 0,
        }
      ]
    };
  }, [statValues, stats]);

  const histogramData = useMemo(() => {
    if (!stats || statValues.length === 0) return { labels: [], datasets: [] };
    
    const min = Math.min(...statValues);
    const max = Math.max(...statValues);
    const binCount = 7;
    const binWidth = (max - min) / binCount || 1;
    
    const bins = Array(binCount).fill(0);
    const labels = Array(binCount).fill('');
    const gaussData = Array(binCount).fill(0);
    
    for (let i = 0; i < binCount; i++) {
      const binStart = min + i * binWidth;
      const binEnd = binStart + binWidth;
      labels[i] = `${formatDeZahl(binStart, 1)} - ${formatDeZahl(binEnd, 1)}`;
      
      statValues.forEach(v => {
        if (v >= binStart && (v < binEnd || (i === binCount - 1 && v <= binEnd))) {
          bins[i]++;
        }
      });

      const binCenter = binStart + binWidth / 2;
      if (stats.stdDevClean > 0) {
        const exponent = -0.5 * Math.pow((binCenter - stats.meanClean) / stats.stdDevClean, 2);
        const coeff = 1 / (stats.stdDevClean * Math.sqrt(2 * Math.PI));
        gaussData[i] = stats.nClean * binWidth * coeff * Math.exp(exponent);
      }
    }

    return {
      labels,
      datasets: [
        {
          type: 'line' as const,
          label: 'Normalverteilung (bereinigt)',
          data: gaussData,
          borderColor: '#64748b',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
        },
        {
          type: 'bar' as const,
          label: 'Häufigkeit',
          data: bins,
          backgroundColor: 'rgba(163, 17, 62, 0.5)',
          borderColor: '#A3113E',
          borderWidth: 1,
        }
      ]
    };
  }, [statValues, stats]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3 mb-2 px-2">
        <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
          <Calculator size={24} />
        </div>
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          Statistik & Auswertung
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Mathematisch-statistische Auswertung von Baustoffuntersuchungen zur Ermittlung von charakteristischen Festigkeitswerten nach DIN EN 1990.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'grundlagen' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('grundlagen')}
        >
          <Calculator size={16} /> Grundlagen &amp; Begriffserklärer
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'probengenerator' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('probengenerator')}
        >
          <Calculator size={16} /> Probengenerator
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'doe' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('doe')}
        >
          <Network size={16} /> Statistische Versuchsplanung (DoE)
        </button>
      </div>

      {activeTab === 'grundlagen' && (
      <div className="flex flex-col gap-8 animate-in fade-in duration-300">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 font-medium">
            <p>
              <strong>Statistische Auswertung von Materialkennwerten:</strong> Generieren Sie zufällige Stichproben für verschiedene Materialien und analysiere diese. 
              Identifizieren Sie Ausreißer und berechne charakteristische Werte sowie Bemessungswerte nach EC0.
            </p>
          </div>
        </div>

        {/* Interaktiver Begriffserklärer */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="border-b border-home-grau/30 pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                <span className="p-1 px-2.5 bg-shiraz/10 text-shiraz rounded text-sm">💡</span>
                Interaktiver Statistik-Begriffserklärer (Baustoff-Prüfsandbox)
              </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            <strong>Anleitung:</strong> Ziehen Sie die kreisförmigen Proben (P1 bis P6) <strong>direkt im Diagramm</strong> nach links/rechts, nutzen Sie die Zylinderschieberegler darunter oder schalten Sie zwischen der <strong>Dichte-</strong> und <strong>Verteilungsfunktion</strong> um!
          </p>
        </div>
            
            {/* Chart Mode Toggle Buttons */}
            <div className="flex bg-stone-100 hover:bg-stone-200/80 p-1 rounded-xl self-start border border-stone-200 shrink-0 select-none">
              <button
                type="button"
                onClick={() => setInteractiveChartMode('pdf')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  interactiveChartMode === 'pdf'
                    ? 'bg-white text-emerald-700 shadow-sm border border-stone-200/50'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Dichtefunktion (PDF / Glocke)
              </button>
              <button
                type="button"
                onClick={() => setInteractiveChartMode('cdf')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  interactiveChartMode === 'cdf'
                    ? 'bg-white text-blue-700 shadow-sm border border-stone-200/50'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Verteilungsfunktion (CDF / S-Kurve)
              </button>
            </div>
          </div>

          {/* Visual SVG Timeline Diagram */}
          <div className="bg-stone-50 border border-home-grau/15 rounded-xl p-4 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-2 px-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest select-none">
                Glocken- &amp; Verteilungsfunktionen der Normalverteilung (MPa)
              </span>
              <span className="text-[9.5px] font-semibold text-text-main/60 italic font-mono select-none">
                Klicken &amp; Ziehen Sie die Messpunkte
              </span>
            </div>
            <div className="w-full max-w-[500px] aspect-[500/145] relative">
              <svg
                ref={svgRef}
                viewBox="0 0 500 145"
                className="w-full h-full overflow-visible touch-none select-none"
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                <defs>
                  {/* Shiraz Wine red for PDF (bell Curve) */}
                  <linearGradient id="shirazGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A3113E" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#A3113E" stopOpacity="0.01" />
                  </linearGradient>
                  {/* Blue for CDF (S-Curve) */}
                  <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#334155" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#334155" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Grid Background Lines */}
                {[20, 30, 40, 50, 60, 70].map((gl) => (
                  <line
                    key={gl}
                    x1={getSgX(gl)}
                    y1={10}
                    x2={getSgX(gl)}
                    y2={115}
                    stroke="#f1f5f9"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                ))}

                {/* Standardabweichungs-Spanne rect */}
                {(() => {
                  const lowerS = intStats.mean - intStats.stdDev;
                  const upperS = intStats.mean + intStats.stdDev;
                  const rectX = getSgX(lowerS);
                  const rectW = getSgX(upperS) - rectX;
                  return (
                    <g>
                      <rect
                        x={rectX}
                        y={10}
                        width={Math.max(2, rectW)}
                        height={105}
                        fill="#64748b"
                        fillOpacity={hoveredMetric === 'stddev' || hoveredMetric === 'cv' ? 0.16 : 0.04}
                        stroke="#64748b"
                        strokeWidth={hoveredMetric === 'stddev' || hoveredMetric === 'cv' ? 1.5 : 0.75}
                        strokeDasharray="4 3"
                        className="transition-all duration-300"
                      />
                      <text
                        x={rectX + rectW / 2}
                        y={21}
                        fontSize={8.5}
                        fontWeight="bold"
                        fill="#334155"
                        textAnchor="middle"
                        className="transition-all duration-300 select-none"
                        opacity={hoveredMetric === 'stddev' || hoveredMetric === 'cv' ? 1 : 0.6}
                      >
                        Streuung (μ ± s): {formatDeZahl(lowerS, 1)}–{formatDeZahl(upperS, 1)} MPa
                      </text>
                    </g>
                  );
                })()}

                {/* Core Math Distribution Curve Elements */}
                {interactiveChartMode === 'pdf' ? (
                  <g className="animate-in fade-in duration-200">
                    {/* Distribution Area under Bell Curve */}
                    <path d={pdfPathClosed} fill="url(#shirazGrad)" className="transition-all duration-300" />
                    {/* Outline of Bell Curve */}
                    <path
                      d={pdfLine}
                      fill="none"
                      stroke="#A3113E"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </g>
                ) : (
                  <g className="animate-in fade-in duration-200">
                    {/* Distribution Area under Cumulative Curve */}
                    <path d={cdfPathClosed} fill="url(#indigoGrad)" className="transition-all duration-300" />
                    {/* Outline of Cumulative Curve */}
                    <path
                      d={cdfLine}
                      fill="none"
                      stroke="#334155"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </g>
                )}

                {/* Base Axis line at y = 115 */}
                <line x1={40} y1={115} x2={460} y2={115} stroke="#64748b" strokeWidth={2} strokeLinecap="round" />

                {/* Scale ticks */}
                {[10, 20, 30, 40, 50, 60, 70, 80].map((tick) => (
                  <g key={tick} className="opacity-80">
                    <line x1={getSgX(tick)} y1={115} x2={getSgX(tick)} y2={121} stroke="#64748b" strokeWidth={1} />
                    <text x={getSgX(tick)} y={133} fontSize={9} fontFamily="monospace" textAnchor="middle" fill="#334155">
                      {formatDeWert(tick)}
                    </text>
                  </g>
                ))}

                {/* Median-Linie (Median trace) */}
                {(() => {
                  const medianX = getSgX(intStats.median);
                  return (
                    <g>
                      <line
                        x1={medianX}
                        y1={10}
                        x2={medianX}
                        y2={115}
                        stroke="#475569"
                        strokeWidth={hoveredMetric === 'median' ? 2.5 : 1.25}
                        strokeDasharray="4 2"
                        className="transition-all duration-300"
                      />
                      <circle
                        cx={medianX}
                        cy={115}
                        r={3}
                        fill="#475569"
                      />
                      <text
                        x={medianX > getSgX(intStats.mean) ? medianX + 6 : medianX - 6}
                        y={34}
                        fontSize={8.5}
                        fontWeight="bold"
                        fill="#334155"
                        textAnchor={medianX > getSgX(intStats.mean) ? "start" : "end"}
                        className="transition-all duration-300 select-none"
                      >
                        Median: {formatDeZahl(intStats.median, 1)}
                      </text>
                    </g>
                  );
                })()}

                {/* Mittelwert-Linie (Mittelwert μ trace) */}
                {(() => {
                  const meanX = getSgX(intStats.mean);
                  return (
                    <g>
                      <line
                        x1={meanX}
                        y1={10}
                        x2={meanX}
                        y2={115}
                        stroke="#475569"
                        strokeWidth={hoveredMetric === 'mean' ? 3 : 1.5}
                        strokeDasharray="5 3"
                        className="transition-all duration-300"
                      />
                      <circle
                        cx={meanX}
                        cy={115}
                        r={3.5}
                        fill="#475569"
                      />
                      <text
                        x={meanX}
                        y={9}
                        fontSize={9}
                        fontWeight="bold"
                        fill="#334155"
                        textAnchor="middle"
                        className="transition-all duration-300 select-none"
                      >
                        μ = {formatDeZahl(intStats.mean, 1)} MPa
                      </text>
                    </g>
                  );
                })()}

                {/* Interactive Grab Sample Points directly sitting ON the respective curves! */}
                {interactiveSamples.map((v, idx) => {
                  const ptX = getSgX(v);
                  // Calculate dynamic Y coordinate of points so they stay magnetically fixed on the respective PDF/CDF curve!
                  const ptY =
                    interactiveChartMode === 'pdf'
                      ? 115 - normalPDF(v, intStats.mean, intStats.stdDev) * pdfScale
                      : 115 - normalCDF(v, intStats.mean, intStats.stdDev) * 80;

                  return (
                    <g key={idx}>
                      {/* Vertical link trace to X-Axis */}
                      <line
                        x1={ptX}
                        y1={ptY}
                        x2={ptX}
                        y2={115}
                        stroke={draggedIndex === idx ? "#A3113E" : "#94a3b8"}
                        strokeWidth={draggedIndex === idx ? 1.5 : 0.75}
                        strokeDasharray="2 2"
                        className="transition-all"
                      />

                      {/* Broad invisible capture circle for rich hover click target zone */}
                      <circle
                        cx={ptX}
                        cy={ptY}
                        r={16}
                        fill="transparent"
                        className="cursor-ew-resize select-none"
                        onPointerDown={(e) => handlePointerDown(idx, e)}
                        onPointerUp={handlePointerUp}
                      />

                      {/* Display visual dot */}
                      <circle
                        cx={ptX}
                        cy={ptY}
                        r={draggedIndex === idx ? 7.5 : 5.5}
                        fill={draggedIndex === idx ? "#A3113E" : "#475569"}
                        stroke="#ffffff"
                        strokeWidth={1.5}
                        className="transition-all duration-150 select-none pointer-events-none shadow"
                      />

                      {/* Text indicator sitting above point */}
                      <text
                        x={ptX}
                        y={ptY - 10}
                        fontSize={8.2}
                        fontFamily="monospace"
                        fill={draggedIndex === idx ? "#A3113E" : "#334155"}
                        textAnchor="middle"
                        fontWeight="bold"
                        className="select-none pointer-events-none transition-all"
                      >
                        P{idx + 1}({formatDeZahl(v, 0)})
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Interactive Core Cylinder Specimens */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10.5px] font-bold text-text-main/60 uppercase tracking-wider">
              Zerstörende Prüfung simulieren (Zylinder-Bohrkerne feineinstellen):
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {interactiveSamples.map((v, idx) => (
                <div key={idx} className="bg-stone-50 border border-home-grau/15 rounded-xl p-3 flex flex-col items-center gap-2 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Probe {idx + 1}</span>
                  {/* Visual concrete cylinder core */}
                  <div className="w-10 h-16 bg-stone-150 border border-stone-300 rounded-md relative flex items-end overflow-hidden justify-center shadow-inner mt-0.5 select-none shrink-0">
                    <div 
                      className="w-full bg-stone-400 absolute bottom-0 transition-all duration-200 border-t border-stone-500/50"
                      style={{ height: `${((v - 10) / 70) * 100}%` }}
                    />
                    {/* concrete aggregate dots pattern */}
                    <div className="absolute inset-0 opacity-25 p-1 pointer-events-none flex flex-wrap gap-1 content-start">
                      <div className="w-1.5 h-1.5 bg-neutral-800 rounded-full"></div>
                      <div className="w-1 h-1 bg-neutral-900 rounded-full mt-1"></div>
                      <div className="w-2 h-1 bg-neutral-700 rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-neutral-800 rounded-full"></div>
                    </div>
                    {/* Measurement label */}
                    <div className="z-10 text-[9.5px] font-mono font-bold text-stone-900 drop-shadow mb-1 whitespace-nowrap bg-white/75 px-1 rounded">
                      {formatDeZahl(v, 0)} <span className="text-[7.5px]">MPa</span>
                    </div>
                  </div>
                  {/* Slider */}
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="1"
                    value={v}
                    onChange={(e) => {
                      const newVal = Number(e.target.value);
                      setInteractiveSamples(prev => {
                        const next = [...prev];
                        next[idx] = newVal;
                        return next;
                      });
                    }}
                    className="w-full h-1.5 bg-gray-250 cursor-pointer rounded-lg appearance-none accent-shiraz"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Term Explanation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Mittelwert Card */}
            <div 
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                hoveredMetric === 'mean' 
                  ? 'bg-emerald-50/50 border-emerald-500 ring-1 ring-emerald-100 shadow-sm' 
                  : 'bg-white border-home-grau/15 hover:border-emerald-300'
              }`}
              onMouseEnter={() => setHoveredMetric('mean')}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">μ</div>
                <h4 className="font-bold text-xs text-emerald-950">Mittelwert (Arithmetisches Mittel)</h4>
                <span className="font-mono text-xs font-bold text-emerald-600 ml-auto">{formatDeZahl(intStats.mean, 2)} MPa</span>
              </div>
              <FormulaText text="\mu = \frac{1}{n} \sum_{i=1}^{n} x_i" />
              <p className="text-[11px] text-slate-600 leading-relaxed mt-1.5">
                Der physikalische <strong>Schwerpunkt</strong> bzw. Schwerpunkt des Waagebalkens. Jeder Wert zieht an der Waage. Ein extremer Ausreißer verschiebt den Mittelwert stark mit.
                <span className="text-emerald-700 block mt-1 font-semibold">📈 Tipp: Schiebe Probe 6 ganz nach rechts (80) – beobachte den Mittelwert!</span>
              </p>
            </div>

            {/* Median Card */}
            <div 
              className={`p-4 rounded-xl border transition-all duration-205 cursor-pointer ${
                hoveredMetric === 'median' 
                  ? 'bg-blue-50/50 border-blue-500 ring-1 ring-blue-150 shadow-sm' 
                  : 'bg-white border-home-grau/15 hover:border-blue-300'
              }`}
              onMouseEnter={() => setHoveredMetric('median')}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">M</div>
                <h4 className="font-bold text-xs text-blue-950">Median (Zentralwert)</h4>
                <span className="font-mono text-xs font-bold text-blue-600 ml-auto">{formatDeZahl(intStats.median, 1)} MPa</span>
              </div>
              <div className="text-[9.5px] text-stone-500 font-mono mb-1 bg-stone-100 px-1.5 py-0.5 rounded inline-block">
                Sortierte Messreihe: {intStats.sorted.map(x => x.toFixed(0)).join(', ')}
              </div>
              <p className="text-[11px] text-slate-605 leading-relaxed mt-1">
                Teilt die sortierte Stichprobe exakt in <strong>zwei Hälften</strong> (50% kleiner, 50% größer). Der Median ist extrem <strong>ausreißerrobust</strong>. Egal wie hoch der Maximalwert ist – der Median bleibt ungerührt auf Platzmitte.
              </p>
            </div>

            {/* Standardabweichung Card */}
            <div 
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                hoveredMetric === 'stddev' 
                  ? 'bg-amber-50/50 border-amber-500 ring-1 ring-amber-100 shadow-sm' 
                  : 'bg-white border-home-grau/15 hover:border-amber-300'
              }`}
              onMouseEnter={() => setHoveredMetric('stddev')}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded bg-amber-600 text-white flex items-center justify-center font-bold text-[10px]">s</div>
                <h4 className="font-bold text-xs text-amber-950">Standardabweichung (Streuungsbreite)</h4>
                <span className="font-mono text-xs font-bold text-amber-600 ml-auto">s = {formatDeZahl(intStats.stdDev, 2)} MPa</span>
              </div>
              <FormulaText text="s = \sqrt{\frac{1}{n-1} \sum_{i=1}^{n} (x_i - \mu)^2}" />
              <p className="text-[11px] text-slate-605 leading-relaxed mt-1.5">
                Die mittlere Abweichung der Einzelwerte vom Mittelwert. Sie spannt das <strong>gestreifte orange Band</strong> im Diagramm auf. Je homogener die Werte (enger beieinander), desto geringer ist die Standardabweichung und desto schmaler das Band.
              </p>
            </div>

            {/* Variationskoeffizient Card */}
            <div 
              className={`p-4 rounded-xl border transition-all duration-205 cursor-pointer ${
                hoveredMetric === 'cv' 
                  ? 'bg-indigo-50/50 border-indigo-500 ring-1 ring-indigo-100 shadow-sm' 
                  : 'bg-white border-home-grau/15 hover:border-indigo-300'
              }`}
              onMouseEnter={() => setHoveredMetric('cv')}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded bg-indigo-650 text-white flex items-center justify-center font-bold text-[10px]">V</div>
                <h4 className="font-bold text-xs text-indigo-950">Variationskoeffizient (Var.Koeff.)</h4>
                <span className="font-mono text-xs font-bold text-indigo-600 ml-auto">V = {formatDeZahl(intStats.cv, 1)} %</span>
              </div>
              <FormulaText text="V = \frac{s}{\mu} \cdot 100\,\%" />
              <p className="text-[11px] text-slate-605 leading-relaxed mt-1.5">
                Das relative Maß für die Streuung, normiert auf den Mittelwert. Macht die Streuung verschiedener Baustoffgüten direkt vergleichbar. Ein Baustellenbeton hat ca. 10–15 %, kontrollierter Werksbeton ca. 6 %, Konstruktionsstahl oft unter 5 %.
              </p>
            </div>

          </div>
        </div>

        <CalculatorDisclaimerBanner className="my-2" />
      <ModuleFooter 
          wikipedia={[
            { title: 'Statistik', url: 'https://de.wikipedia.org/wiki/Statistik' }
          ]}
          literatur={[
            'Sachs, L.; Hedderich, J. (2018): Angewandte Statistik: Methodensammlung mit R (Springer-Verlag)',
            'Albert, A. (Hrsg.): Schneider – Bautabellen für Ingenieure. 26. Aufl., Köln: Reguvis 2024',
            'DIN EN 1990:2023-11: Eurocode - Grundlagen der Tragwerksplanung, Anhang D: Bemessung mit Hilfe von Versuchen'
          ]}
          regelwerke={[
            { title: 'DIN EN 1990:2023-11 Anhang D (Versuchsgestützte Bemessung und statistische Auswertung)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1990' },
            { title: 'ISO 2394:2015 (General principles on reliability for structures)', url: 'https://www.iso.org/' },
            { title: 'DIN ISO 12491:2000-09 (Statistische Verfahren für die Qualitätskontrolle von Baustoffen und Bauteilen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+ISO+12491' }
          ]}
          formeln={[
            {
              formel: 's = \\sqrt{\\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\mu)^2}',
              erklaerung: 'Empirische Standardabweichung:\ns: Standardabweichung\nn: Anzahl der Proben\nx_i: Einzelmesswert\nμ: Mittelwert',
              quelle: 'Allgemeine Fachliteratur'
            },
            {
              formel: 'v = \\frac{s}{\\mu}',
              erklaerung: 'Variationskoeffizient:\nv: Variationskoeffizient (oft in %)\ns: Standardabweichung\nμ: Mittelwert',
              quelle: 'Allgemeine Fachliteratur'
            }
          ]}
        />
      </div>
      )}

      {activeTab === 'probengenerator' && (
      <div className="flex flex-col gap-8 animate-in fade-in duration-300">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 font-medium font-sans">
            <p>
              <strong>Statistische Auswertung von Materialkennwerten (Probengenerator):</strong> Generieren Sie zufällige Stichproben für verschiedene Materialien und analysiere diese. 
              Identifizieren Sie Ausreißer und berechne charakteristische Werte sowie Bemessungswerte nach EC0.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-8">
        {/* Top: Configuration */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Konfiguration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-text-main">Material wählen</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['beton', 'stahl', 'holz'] as MaterialType[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMaterial(m)}
                      disabled={testStatus === 'running'}
                      className={`py-2 px-1 text-sm font-medium rounded-lg border transition-colors capitalize ${
                        material === m 
                          ? 'bg-shiraz text-white border-shiraz' 
                          : 'bg-off-white text-text-main border-home-grau/30 hover:border-shiraz/50 disabled:opacity-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-text-main">Anzahl der Prüfwerte (n)</label>
                <select
                  value={numberOfSamples}
                  onChange={(e) => setNumberOfSamples(Number(e.target.value))}
                  disabled={testStatus === 'running'}
                  className="w-full p-2 border border-home-grau/30 rounded-lg bg-off-white text-sm"
                >
                  <option value={5}>5 Prüfwerte</option>
                  <option value={10}>10 Prüfwerte</option>
                  <option value={15}>15 Prüfwerte</option>
                  <option value={20}>20 Prüfwerte</option>
                  <option value={30}>30 Prüfwerte</option>
                  <option value={50}>50 Prüfwerte</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-text-main">Ausreißertest</label>
                <select
                  value={outlierMethod}
                  onChange={(e) => setOutlierMethod(e.target.value as OutlierMethod)}
                  disabled={testStatus === 'running'}
                  className="w-full p-2 border border-home-grau/30 rounded-lg bg-off-white text-sm"
                >
                  <option value="2sigma">± 2σ (Standardabweichung)</option>
                  <option value="boxplot">Boxplot (1,5 IQR)</option>
                  <option value="grubbs">Grubbs-Test (vereinfacht)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-home-grau/30">
              <button
                onClick={runStatistikTest}
                disabled={testStatus === 'running'}
                className="w-full py-3 bg-shiraz hover:bg-shiraz/90 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {numberOfSamples} Proben generieren
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: Execution & Results */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-6 border-b border-home-grau/30 pb-4">
              <h3 className="text-lg font-bold text-text-main">Ergebnisse</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-home-grau">Status:</span>
                <span className={`text-sm font-bold px-2 py-1 rounded ${
                  testStatus === 'idle' ? 'bg-home-grau/20 text-text-main' :
                  testStatus === 'running' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {testStatus === 'idle' ? 'Bereit' : testStatus === 'running' ? 'Läuft...' : 'Abgeschlossen'}
                </span>
              </div>
            </div>

            {testStatus !== 'idle' && (
              <div className="w-full bg-home-grau/20 rounded-full h-2.5 mb-6 overflow-hidden">
                <div className="bg-shiraz h-2.5 rounded-full transition-all duration-75" style={{ width: `${progress}%` }}></div>
              </div>
            )}

            <div className="flex-1 flex flex-col">
              {testStatus === 'idle' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-home-grau">
                  <Calculator size={64} className="mb-4 opacity-20" />
                  <p className="text-lg font-medium">Bereit für die Auswertung.</p>
                  <p className="text-sm mt-2">Klicken Sie links auf "15 Proben generieren".</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
                  {testStatus === 'running' ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                      <Calculator size={48} className="text-shiraz animate-bounce" />
                      <p className="text-sm font-medium text-shiraz animate-pulse">Generiere und analysiere 15 Proben...</p>
                      <div className="grid grid-cols-5 gap-2 mt-4">
                        {statValues.map((val, idx) => (
                          <div key={idx} className="p-2 text-center rounded-md border bg-off-white border-home-grau/30 text-text-main text-xs">
                            {formatDeZahl(val, 1) ?? '-'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : stats && (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
                      <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-sm font-bold text-text-main">Rohdaten & Ausreißertest ({stats.thresholdDesc})</h4>
                          {testStatus === 'finished' && (
                            <div className="text-right bg-white p-2 rounded border border-home-grau/30">
                              <div className="text-xs text-home-grau font-medium mb-1 flex items-center justify-end gap-2">
                                <span>Formel:</span> <FormulaText text={stats.formula} />
                              </div>
                              <div className="text-xs font-bold text-torch-red">
                                Grenzwerte: {formatDeZahl(stats.lowerBound, 1)} / {formatDeZahl(stats.upperBound, 1)}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {statValues.map((val, idx) => {
                            const isOutlier = val !== undefined ? stats.isOutlierFn(val) : false;
                            return (
                              <div key={idx} className={`p-2 text-center rounded-md border text-sm font-medium ${isOutlier ? 'bg-torch-red/10 border-torch-red text-torch-red' : 'bg-white border-home-grau/30 text-text-main'}`}>
                                {formatDeZahl(val, 1) ?? '-'}
                              </div>
                            );
                          })}
                        </div>
                        {stats.outliers.length > 0 && (
                          <div className="mt-3 text-sm text-torch-red font-medium">
                            {stats.outliers.length} Ausreißer gefunden und eliminiert.
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
                          <div className="text-xs text-home-grau font-bold uppercase">Mittelwert (μ)</div>
                          <div className="text-lg font-bold text-text-main">{formatDeZahl(stats.mean, 1)}</div>
                        </div>
                        <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
                          <div className="text-xs text-home-grau font-bold uppercase">Median</div>
                          <div className="text-lg font-bold text-text-main">{formatDeZahl(stats.median, 1)}</div>
                        </div>
                        <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
                          <div className="text-xs text-home-grau font-bold uppercase">Std.Abw. (σ)</div>
                          <div className="text-lg font-bold text-text-main">{formatDeZahl(stats.stdDev, 2)}</div>
                        </div>
                        <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
                          <div className="text-xs text-home-grau font-bold uppercase">Var.Koeff. (V)</div>
                          <div className="text-lg font-bold text-text-main">{formatDeZahl(stats.cv, 1)} %</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-[250px] relative border border-home-grau/30 rounded-xl p-2">
                          <Scatter 
                            data={statChartData as any} 
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                x: { title: { display: true, text: 'Proben-Nr.' } },
                                y: { title: { display: true, text: 'Wert' } }
                              },
                              plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } }
                            }} 
                          />
                        </div>
                        <div className="h-[250px] relative border border-home-grau/30 rounded-xl p-2">
                          <Bar 
                            data={histogramData as any} 
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                y: { beginAtZero: true, ticks: { stepSize: 1 }, title: { display: true, text: 'Anzahl' } },
                                x: { title: { display: true, text: 'Wertebereich' } }
                              },
                              plugins: { legend: { display: false } }
                            }} 
                          />
                        </div>
                      </div>

                      <div className="bg-off-white p-4 rounded-xl border border-shiraz/20">
                        <h4 className="text-sm font-bold text-shiraz mb-3">Bemessungswerte nach EC0</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-black font-bold uppercase">Bereinigter Mittelwert</div>
                            <div className="text-xl font-bold text-text-main">{formatDeZahl(stats.meanClean, 1)}</div>
                            <div className="text-xs text-black mt-1">n = {formatDeWert(stats.nClean)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-black font-bold uppercase">Charakt. Wert (X_k)</div>
                            <div className="text-xl font-bold text-fuchsia-600">{formatDeZahl(stats.xk, 1)}</div>
                            <div className="text-xs text-black mt-1">5%-Fraktil (k_n = {formatDeWert(stats.kn)})</div>
                          </div>
                          <div>
                            <div className="text-xs text-black font-bold uppercase">Bemessungswert (X_d)</div>
                            <div className="text-xl font-bold text-torch-red">{formatDeZahl(stats.xd, 1)}</div>
                            <div className="text-xs text-black mt-1">γ_M = {formatDeWert(stats.gammaM)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <ModuleFooter 
        wikipedia={[
        { title: 'Statistik', url: 'https://de.wikipedia.org/wiki/Statistik' },
        { title: 'Statistische Versuchsplanung', url: 'https://de.wikipedia.org/wiki/Statistische_Versuchsplanung' }
      ]}
        literatur={[
          'Montgomery, D. C. (2017): Design and Analysis of Experiments (John Wiley & Sons)',
          'Sachs, L.; Hedderich, J. (2018): Angewandte Statistik (Springer-Verlag)',
          'Wendehorst Bautechnische Zahlentafeln: Statistische Auswertungen und 5%-Fraktilwerte'
        ]}
        regelwerke={[
          { title: 'DIN EN 1990 Anhang D (Versuchsgestützte Bemessung)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1990' },
          { title: 'DIN ISO 2859-1 (Annahmestichprobenprüfung)', url: 'https://www.dinmedia.de/de/suche?q=DIN+ISO+2859-1' }
        ]}
        formeln={[
          {
            formel: 's = \\sqrt{\\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2}',
            erklaerung: 'Empirische Standardabweichung s zur quantitativen Erfassung der Messwertstreuung einer Stichprobe vom Umfang n um den arithmetischen Mittelwert.',
            quelle: 'DIN ISO 3534-1'
          },
          {
            formel: 'v = \\frac{s}{\\bar{x}} \\cdot 100\\,\\%',
            erklaerung: 'Variationskoeffizient v als dimensionsloses relatives Streumaß (Standardabweichung bezogen auf den Mittelwert).',
            quelle: 'DIN ISO 3534-1'
          },
          {
            formel: 'X_k = \\bar{x} - k_n \\cdot s',
            erklaerung: 'Charakteristischer Kennwert (5 %-Fraktil) nach DIN EN 1990 Anhang D unter Berücksichtigung des Stichprobenfaktors k_n für unbekannte Varianz.',
            quelle: 'DIN EN 1990 Anhang D'
          },
          {
            formel: 'X_d = \\frac{X_k}{\\gamma_M}',
            erklaerung: 'Bemessungswert X_d für den Grenzzustand der Tragfähigkeit (GZT) unter Abminderung durch den materialspezifischen Teilsicherheitsbeiwert γ_M.',
            quelle: 'DIN EN 1990'
          }
        ]}
      />
      </div>
      )}

      {activeTab === 'doe' && (
        <StatistischeVersuchsplanung />
      )}
    </div>
  );
}
