import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, RotateCcw, ShieldCheck, Check, Download, FileText, Layers, Info } from 'lucide-react';
import { InlineMath } from 'react-katex';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { validateMechanicalTestIntegrity, exportToCSV, LabProtocolRecord } from '@/src/utils/labExportUtils';
import { saveStoredLabProtocol } from '@/src/utils/studyStorage';
import { AuswahlGruppe, alsOption } from '../ui/Auswahlgruppe';
import { Fz } from '../ui/Formelzeichen';
import { hoechstwert } from '@/src/calc/laborVersuch';
import { useDiagrammFarben, linAchse, PfeilDefs, Masslinie, useSchriftFaktor } from './laborGrafik';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type BeamMaterial = 'beton_unbewehrt' | 'beton_stahlbewehrt' | 'beton_stahlfasern' | 'beton_spannbeton' | 'holz_c24' | 'moertel_din196';
type LoadingSystem = '4punkt' | '3punkt';

export default function BiegezugPruefung() {
  const [material, setMaterial] = useState<BeamMaterial>('beton_unbewehrt');
  const [loadingSystem, setLoadingSystem] = useState<LoadingSystem>('4punkt');
  const [spanLength, setSpanLength] = useState<number>(450); // mm (Stützweite l = 3·d nach DIN EN 12390-5)
  const [beamHeight, setBeamHeight] = useState<number>(150); // mm
  const [beamWidth, setBeamWidth] = useState<number>(150); // mm

  // Test state
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [progress, setProgress] = useState(0); // 0 to 100
  const [currentForceKN, setCurrentForceKN] = useState(0);
  const [currentDeflectionMm, setCurrentDeflectionMm] = useState(0);
  const [currentBendingStressMPa, setCurrentBendingStressMPa] = useState(0);
  const [crackHeightPercent, setCrackHeightPercent] = useState(0);

  const [curveData, setCurveData] = useState<{ x: number; y: number }[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [chartMode, setChartMode] = useState<'force' | 'stress'>('force');
  const [showGrid, setShowGrid] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearCurrentInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Widerstandsmoment W = b * h² / 6
  const W = useMemo(() => {
    return (beamWidth * Math.pow(beamHeight, 2)) / 6; // mm³
  }, [beamWidth, beamHeight]);

  // Trägheitsmoment I = b * h³ / 12
  const I = useMemo(() => {
    return (beamWidth * Math.pow(beamHeight, 3)) / 12; // mm⁴
  }, [beamWidth, beamHeight]);

  // Material physics configuration
  const matProps = useMemo(() => {
    switch (material) {
      case 'beton_unbewehrt':
        return {
          name: 'Unbewehrter Beton (C30/37)',
          norm: 'DIN EN 12390-5',
          fctfl: 4.2, // MPa Biegezugfestigkeit
          E: 33000,
          maxDeflection: 0.18, // mm (sehr steif & spröde)
          desc: 'Klassischer spröder Biegebruch. Sobald die Zugspannung an der Unterkante fct,fl erreicht, schlägt ein Riss schlagartig nach oben durch.'
        };
      case 'beton_stahlbewehrt':
        return {
          name: 'Stahlbeton (2 Ø 10 mm B500B)',
          norm: 'DIN EN 1992-1-1',
          fctfl: 4.2,
          fy: 500,
          E: 33000,
          maxDeflection: 4.5, // mm
          desc: 'Duktiles Verbundverhalten. Zustand I (ungerissen) -> Zustand II (Rissbildung & Lastumlagerung auf den Stahl) -> Fließen des Stahls.'
        };
      case 'beton_stahlfasern':
        return {
          name: 'Stahlfaserbeton (30 kg/m³)',
          norm: 'DIN EN 14651 / DAfStb-Richtlinie Stahlfaserbeton',
          fctfl: 4.5,
          // Nachrissbiegezugfestigkeiten nach DIN EN 14651 (3-Punkt-Versuch am gekerbten Balken):
          fR1: 3.2, // f_R,1 bei CMOD = 0,5 mm
          fR3: 2.4, // f_R,3 bei CMOD = 2,5 mm
          // (Die DAfStb-Richtlinie Stahlfaserbeton definiert Leistungsklassen L1/L2 aus dem 4-Punkt-Versuch.)
          E: 33000,
          maxDeflection: 3.2,
          desc: 'Ausgeprägte Nachrisszugfestigkeit. Die Stahlfasern vernähen den Riss und verhindern ein schlagartiges Versagen.'
        };
      case 'beton_spannbeton':
        return {
          name: 'Spannbeton (Vorspannung mit sofortigem Verbund)',
          norm: 'DIN EN 1992-1-1',
          fctfl: 4.5,
          fy: 1860, // Y1860 Spannstahllitzen
          E: 36000,
          maxDeflection: 5.4,
          desc: 'Spannbeton-Prinzip: Durch planmäßige Vorspannung (Drucküberdrückung im Biegezugrand) wird das Entstehen von Zugspannungen drastisch hinausgezögert. Rissbildung (Zustand II) setzt erst nach vollständiger Dekompression ein.'
        };
      case 'holz_c24':
        return {
          name: 'Konstruktionsvollholz (Fichte C24)',
          norm: 'DIN EN 408 / DIN EN 338',
          fctfl: 24.0, // charakteristische Biegefestigkeit f_m,k nach DIN EN 338 (Prüfmittelwerte liegen höher)
          E: 11000,
          maxDeflection: 6.8,
          desc: 'Hohe Elastizität und beträchtliche Durchbiegung vor dem Faserbruch an der Unterseite.'
        };
      case 'moertel_din196':
        return {
          name: 'Normmörtel-Prisma (DIN EN 196-1)',
          norm: 'DIN EN 196-1',
          fctfl: 6.5,
          E: 22000,
          maxDeflection: 0.28,
          desc: 'Normprüfung an Prismen 40×40×160 mm (3-Punkt-Biegung, Stützweite 100 mm). Die Festigkeitsklasse des Zements (32,5 / 42,5 / 52,5) wird anschließend an den Prismenhälften über die Druckfestigkeit bestimmt.'
        };
    }
  }, [material]);

  // Max peak force kN: M = F * L / 6 (4-Punkt) bzw. M = F * L / 4 (3-Punkt)
  const lever = useMemo(() => {
    return loadingSystem === '4punkt' ? spanLength / 6 : spanLength / 4;
  }, [loadingSystem, spanLength]);

  const calcForceFromStress = (sigma: number) => {
    const M = sigma * W; // N*mm
    return (M / lever) / 1000; // in kN
  };

  const estimatedPeakStress = useMemo(() => {
    if (material === 'beton_spannbeton') {
      return 24.5;
    }
    if (material === 'beton_stahlbewehrt') {
      return matProps.fctfl * 0.88 + 10.5;
    }
    if (material === 'holz_c24') {
      return matProps.fctfl * 1.15;
    }
    return matProps.fctfl;
  }, [material, matProps]);

  const maxEstimatedForce = useMemo(() => {
    return calcForceFromStress(estimatedPeakStress);
  }, [estimatedPeakStress, calcForceFromStress]);

  const runTest = () => {
    setTestStatus('running');
    setProgress(0);
    setCurveData([]);
    setCrackHeightPercent(0);

    const steps = 110;
    const targetData: { x: number; y: number }[] = [];

    // Precalculate force-deflection curve
    for (let i = 0; i <= steps; i++) {
      const frac = i / steps;
      const deflection = frac * matProps.maxDeflection;
      let stress = 0;

      if (material === 'beton_unbewehrt') {
        if (frac <= 0.85) {
          stress = (frac / 0.85) * matProps.fctfl * 0.95;
        } else if (frac <= 0.92) {
          // Vorbruch-Mikrorisskrümmung
          const preFracture = (frac - 0.85) / 0.07;
          stress = matProps.fctfl * (0.95 + 0.05 * Math.sin(preFracture * Math.PI * 0.5));
        } else if (frac <= 0.96) {
          // Schlagartiger spröder Rissdurchschlag (Lastabfall auf 0)
          const dropFrac = (frac - 0.92) / 0.04;
          stress = matProps.fctfl * Math.max(0, 1 - dropFrac * 2.5);
        } else {
          stress = 0;
        }
      } else if (material === 'beton_stahlbewehrt') {
        const crackPoint = 0.14;
        if (frac <= crackPoint) {
          // Zustand I (ungerissen)
          stress = (frac / crackPoint) * matProps.fctfl;
        } else if (frac <= 0.20) {
          // Rissbildungsphase (Lastabfall/Umlagerung auf Bewehrung)
          const dropFrac = (frac - crackPoint) / 0.06;
          stress = matProps.fctfl * (1 - 0.12 * Math.sin(dropFrac * Math.PI));
        } else if (frac <= 0.70) {
          // Zustand II (gerissen): Lastaufnahme durch Bewehrungsstahl
          const postCrackProgress = (frac - 0.20) / 0.50;
          stress = (matProps.fctfl * 0.88) + postCrackProgress * 9.5;
        } else if (frac <= 0.92) {
          // Fließplateau des Betonstahls B500B mit Verfestigung
          const yieldFrac = (frac - 0.70) / 0.22;
          stress = (matProps.fctfl * 0.88 + 9.5) * (1 + 0.04 * Math.sin(yieldFrac * Math.PI * 0.5));
        } else {
          // Versagen der Betondruckzone / Stahlfließen
          const failFrac = (frac - 0.92) / 0.08;
          stress = (matProps.fctfl * 0.88 + 9.5) * 1.04 * Math.max(0.2, 1 - failFrac * 0.8);
        }
      } else if (material === 'beton_stahlfasern') {
        const crackPoint = 0.18;
        if (frac <= crackPoint) {
          stress = (frac / crackPoint) * matProps.fctfl;
        } else {
          // Zähes Nachrissverhalten (Faserauszug / Pull-out nach DAfStb)
          const decay = (frac - crackPoint) / (1 - crackPoint);
          stress = matProps.fctfl * (0.85 * Math.exp(-0.7 * decay) + 0.15);
        }
      } else if (material === 'beton_spannbeton') {
        // Spannbeton-Prinzip:
        // 1. Bis ~35% Durchbiegung: Drucküberdrückter Zustand I (extrem steif)
        // 2. Dekompressionsmoment & Rissbildung erst bei ~45% der Verformung
        // 3. Zustand II: Spannstahl Y1860 trägt die Biegezugkräfte hochgradig duktil
        const decompressionFrac = 0.32;
        const crackPoint = 0.44;
        if (frac <= decompressionFrac) {
          // Überdrückte Zugzone: reines lineares Zustand-I-Verhalten
          stress = (frac / crackPoint) * 16.5;
        } else if (frac <= crackPoint) {
          // Betonzugspannung wächst nach Dekompression bis zur Biegezugfestigkeit fct,fl
          stress = (frac / crackPoint) * 16.5;
        } else if (frac <= 0.50) {
          // Kurzer Rissbildungsknick (Umlagerung auf Spannstahl)
          const dropFrac = (frac - crackPoint) / 0.06;
          stress = 16.5 * (1 - 0.04 * Math.sin(dropFrac * Math.PI));
        } else if (frac <= 0.88) {
          // Zustand II: Hochfeste Spannlitze Y1860 spannt elastisch-plastisch weiter auf
          const postCrackProgress = (frac - 0.50) / 0.38;
          stress = 16.2 + postCrackProgress * 8.0; // wächst auf ca. 24.2 MPa
        } else if (frac <= 0.95) {
          // Erreichen der Streckgrenze fp0.1k und Plastifizierung der Betondruckzone
          const yieldFrac = (frac - 0.88) / 0.07;
          stress = 24.2 * (1 + 0.02 * Math.sin(yieldFrac * Math.PI * 0.5));
        } else {
          // Traglastversagen (Betondruckzonenbruch / Fließgrenze)
          const failFrac = (frac - 0.95) / 0.05;
          stress = 24.5 * Math.max(0.35, 1 - failFrac * 0.65);
        }
      } else if (material === 'holz_c24') {
        if (frac <= 0.72) {
          // Linear-elastischer Bereich
          stress = (frac / 0.72) * matProps.fctfl * 0.90;
        } else if (frac <= 0.90) {
          // Plastifizierung der randnahen Druckzone im Holz
          const plastFrac = (frac - 0.72) / 0.18;
          stress = matProps.fctfl * (0.90 + 0.10 * Math.sin(plastFrac * Math.PI * 0.5));
        } else if (frac <= 0.96) {
          // Faserspliss / Zugversagen der randnahen Zugfasern mit starkem Kraftabfall
          const failFrac = (frac - 0.90) / 0.06;
          stress = matProps.fctfl * Math.max(0, 1 - failFrac * 2.2);
        } else {
          stress = 0;
        }
      } else {
        // Moertel DIN EN 196-1
        if (frac <= 0.88) {
          stress = (frac / 0.88) * matProps.fctfl;
        } else if (frac <= 0.94) {
          // Spröder Prismenriss
          const dropFrac = (frac - 0.88) / 0.06;
          stress = matProps.fctfl * Math.max(0, 1 - dropFrac * 2.5);
        } else {
          stress = 0;
        }
      }

      const force = calcForceFromStress(stress);
      targetData.push({ x: deflection, y: force });
    }

    let currentStep = 0;
    clearCurrentInterval();
    intervalRef.current = setInterval(() => {
      if (currentStep < targetData.length) {
        const pt = targetData[currentStep];
        setCurveData(targetData.slice(0, currentStep + 1));
        const prog = (currentStep / steps) * 100;
        setProgress(prog);

        const curForce = pt.y;
        const curDefl = pt.x;
        const curStress = (curForce * 1000 * lever) / W;

        setCurrentForceKN(curForce);
        setCurrentDeflectionMm(curDefl);
        setCurrentBendingStressMPa(curStress);

        if (material === 'beton_unbewehrt') {
          if (prog > 80) setCrackHeightPercent(100);
        } else if (material === 'beton_stahlbewehrt') {
          if (prog > 15) setCrackHeightPercent(Math.min(75, ((prog - 15) / 85) * 75));
        } else if (material === 'beton_stahlfasern') {
          if (prog > 20) setCrackHeightPercent(Math.min(65, ((prog - 20) / 80) * 65));
        } else if (material === 'beton_spannbeton') {
          // Rissbildung erst nach Dekompression (prog > 44 %)
          if (prog > 44) setCrackHeightPercent(Math.min(65, ((prog - 44) / 56) * 65));
        }

        currentStep++;
      } else {
        clearCurrentInterval();
        setTestStatus('finished');
        setProgress(100);
      }
    }, 45);
  };

  const handleReset = () => {
    clearCurrentInterval();
    setTestStatus('idle');
    setProgress(0);
    setCurveData([]);
    setCurrentForceKN(0);
    setCurrentDeflectionMm(0);
    setCurrentBendingStressMPa(0);
    setCrackHeightPercent(0);
    setSavedSuccess(false);
  };

  useEffect(() => {
    handleReset();
  }, [material, loadingSystem, spanLength, beamHeight, beamWidth]);

  useEffect(() => {
    return () => clearCurrentInterval();
  }, []);

  // Höchstwert der aufgezeichneten Kurve (Bruchlast), nicht der letzte Messwert
  const maxForceObserved = useMemo(() => Math.max(hoechstwert(curveData).y, 0), [curveData]);

  const maxStressObserved = useMemo(() => {
    return (maxForceObserved * 1000 * (loadingSystem === '4punkt' ? spanLength / 6 : spanLength / 4)) / W;
  }, [maxForceObserved, loadingSystem, spanLength, W]);

  const handleArchive = () => {
    if (testStatus !== 'finished') return;

    const validation = validateMechanicalTestIntegrity(
      'beton',
      'zug',
      maxStressObserved,
      matProps.E / 1000,
      currentDeflectionMm
    );

    const newRecord: LabProtocolRecord = {
      id: `PROTO-BIEGE-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }),
      testTitle: `${loadingSystem === '4punkt' ? '4-Punkt' : '3-Punkt'}-Biegezugprüfung an ${matProps.name}`,
      norm: matProps.norm,
      operator: 'Biegeprüfstand (Lehrsimulation)',
      specimen: {
        material: matProps.name,
        geometry: `Prismatischer Balken ${beamWidth}×${beamHeight}×${formatDeWert(spanLength + 100)} mm`,
        dimensions: `b=${beamWidth} mm, h=${beamHeight} mm, L=${spanLength} mm`,
        conditioning: material === 'holz_c24'
          ? 'Normalklima 20 °C / 65 % r. F. (simuliert)'
          : material === 'moertel_din196'
            ? 'Wasserlagerung 20 ± 1 °C nach DIN EN 196-1 (simuliert)'
            : 'Wasserlagerung 20 ± 2 °C nach DIN EN 12390-2 (simuliert)'
      },
      parameters: {
        'Lagerungsart': loadingSystem === '4punkt' ? '4-Punkt-Biegung (Querkraftfreies Mittelfeld)' : '3-Punkt-Einzellast in Feldmitte',
        'Stützweite L': `${formatDeWert(spanLength)} mm`,
        'Widerstandsmoment W': `${formatDeZahl((W / 1000), 1)} cm³`,
        'Trägheitsmoment I': `${formatDeZahl((I / 10000), 1)} cm⁴`
      },
      metrics: {
        'Biegezugfestigkeit f_ct,fl (N/mm²)': formatDeZahl(maxStressObserved, 2),
        'Höchstkraft F_max (kN)': formatDeZahl(maxForceObserved, 1),
        'Mittige Durchbiegung δ (mm)': formatDeZahl(currentDeflectionMm, 2),
        'E-Modul (GPa)': formatDeZahl((matProps.E / 1000), 1)
      },
      status: validation.status,
      validationNotes: validation.notes,
      integrityHash: validation.hash,
      dataPointsCount: curveData.length
    };

    saveStoredLabProtocol(newRecord);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const displayChartData = useMemo(() => {
    if (chartMode === 'force') return curveData;
    return curveData.map(d => ({
      x: d.x,
      y: (d.y * 1000 * lever) / W
    }));
  }, [curveData, chartMode, lever, W]);

  const farben = useDiagrammFarben();
  const fs = useSchriftFaktor();
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: linAchse(farben, 'Durchbiegung δ in mm', matProps.maxDeflection * 1.05, showGrid),
      y: linAchse(
        farben,
        chartMode === 'force' ? 'F in kN' : 'σ in N/mm²',
        chartMode === 'force' ? Math.max(maxEstimatedForce * 1.1, 4) : Math.max(estimatedPeakStress * 1.1, 4),
        showGrid
      ),
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items: TooltipItem<'line'>[]) => `Durchbiegung δ = ${formatDeZahl(Number(items[0].parsed.x), 2)} mm`,
          label: (ctx: TooltipItem<'line'>) => chartMode === 'force'
            ? `Prüfkraft: ${formatDeZahl(Number(ctx.parsed.y), 2)} kN`
            : `Biegezugspannung: ${formatDeZahl(Number(ctx.parsed.y), 2)} N/mm²`
        }
      }
    }
  };

  // Balkenansicht: Stützweite L zwischen den Auflagerrollen x = 60 … 380 (320 px), Überstand je Seite 25 px
  const A1 = 60;
  const A2 = 380;
  const spannPx = A2 - A1;
  const mitteX = (A1 + A2) / 2;
  const lastPunkte = loadingSystem === '4punkt' ? [A1 + spannPx / 3, A1 + (2 * spannPx) / 3] : [mitteX];
  const ob = 74; // Balkenoberkante
  const hb = 40; // Balkenhöhe
  const durchbiegungPx = Math.min(18, currentDeflectionMm * 3);
  const gebrochen = (material === 'beton_unbewehrt' || material === 'moertel_din196' || material === 'holz_c24') && testStatus === 'finished';
  const biegeLabel = `${loadingSystem === '4punkt' ? '4-Punkt-Biegeversuch: zwei Lasten in den Drittelspunkten L/3' : '3-Punkt-Biegeversuch: Einzellast in Feldmitte'}, Auflagerrollen im Abstand L = ${formatDeWert(spanLength)} mm; Balken ${formatDeWert(beamWidth)} × ${formatDeWert(beamHeight)} mm aus ${matProps.name}. `
    + (testStatus === 'idle' ? 'Versuch noch nicht gestartet.' : testStatus === 'running' ? `Kraft ${formatDeZahl(currentForceKN, 1)} kN, Durchbiegung ${formatDeZahl(currentDeflectionMm, 2)} mm.` : `Versuch beendet, Höchstkraft ${formatDeZahl(maxForceObserved, 1)} kN${gebrochen ? ', Balken in Feldmitte gebrochen' : ''}.`);
  const yUnten = (x: number) => ob + hb + durchbiegungPx * (1 - Math.pow((x - mitteX) / (spannPx / 2 + 25), 2));
  const yOben = (x: number) => yUnten(x) - hb;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Settings Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
              <h3 className="font-bold text-text-main flex items-center gap-2">
                <Layers size={18} className="text-shiraz" /> 1. Balken &amp; Lagerung
              </h3>
              <span className="text-[11px] font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full">
                {matProps.norm}
              </span>
            </div>

            {/* Loading Scheme: 3-point vs 4-point */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-main uppercase tracking-wider">Lasteinleitung</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '4punkt', label: '4-Punkt-Biegung', sub: 'DIN EN 12390-5 (Querkraftfrei)' },
                  { id: '3punkt', label: '3-Punkt-Biegung', sub: 'Einzellast in Feldmitte' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setLoadingSystem(s.id as LoadingSystem)}
                    disabled={testStatus === 'running'}
                    className={`p-2 text-xs rounded-xl border transition-all cursor-pointer flex flex-col text-left ${
                      loadingSystem === s.id
                        ? 'bg-shiraz text-white border-shiraz shadow-xs font-bold'
                        : 'bg-off-white text-text-main border-home-grau/30 hover:bg-slate-100 disabled:opacity-50'
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className="text-[10px] opacity-75 font-normal">{s.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Material Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-main uppercase tracking-wider">Werkstoff</label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { id: 'beton_unbewehrt', label: 'Unbewehrter Beton', sub: 'Spröder Sofortbruch' },
                  { id: 'beton_stahlbewehrt', label: 'Stahlbeton (B500B)', sub: 'Duktiles Fließen' },
                  { id: 'beton_spannbeton', label: 'Spannbeton (Prinzip)', sub: 'Drucküberdrückung & Dekompression' },
                  { id: 'beton_stahlfasern', label: 'Stahlfaserbeton', sub: 'Nachrisszugfähigkeit' },
                  { id: 'holz_c24', label: 'Konstruktionsvollholz (C24)', sub: 'Faserriss' },
                  { id: 'moertel_din196', label: 'Normmörtel-Prisma', sub: 'DIN EN 196-1' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMaterial(m.id as BeamMaterial)}
                    disabled={testStatus === 'running'}
                    className={`py-2 px-3 text-xs rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                      material === m.id
                        ? 'bg-shiraz/15 text-shiraz border-shiraz font-bold shadow-xs'
                        : 'bg-off-white text-text-main border-home-grau/30 hover:border-shiraz/40 disabled:opacity-50'
                    }`}
                  >
                    <span>{m.label}</span>
                    <span className="text-[10px] opacity-75">{m.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Beam Dimensions */}
            <div className="space-y-2 pt-2 border-t border-home-grau/20 text-xs">
              <label className="font-bold text-text-main uppercase tracking-wider block">Abmessungen (<Fz>b × h × L</Fz>)</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-off-white p-2 rounded-lg border border-home-grau/20 text-center">
                  <span className="text-text-main/60 text-[10px] block">Breite b</span>
                  <span className="font-mono font-bold">{formatDeWert(beamWidth)} mm</span>
                </div>
                <div className="bg-off-white p-2 rounded-lg border border-home-grau/20 text-center">
                  <span className="text-text-main/60 text-[10px] block">Höhe h</span>
                  <span className="font-mono font-bold">{formatDeWert(beamHeight)} mm</span>
                </div>
                <div className="bg-off-white p-2 rounded-lg border border-home-grau/20 text-center">
                  <span className="text-text-main/60 text-[10px] block">Stützweite L</span>
                  <span className="font-mono font-bold">{formatDeWert(spanLength)} mm</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-home-grau/20">
              <button
                onClick={runTest}
                disabled={testStatus === 'running'}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Play size={16} /> Biegetest Starten
              </button>
              <button
                onClick={handleReset}
                disabled={testStatus === 'idle'}
                className="py-3 px-4 bg-off-white hover:bg-slate-200 text-text-main border border-home-grau/30 rounded-xl font-bold text-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Beam Graphic & F-delta Curve (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full">
            
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-home-grau/20 gap-3">
              <div>
                <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                  <Layers size={18} className="text-shiraz" /> 2. Biegebalken &amp; Rissfortschritt
                </h3>
                <p className="text-xs text-text-main/70">{matProps.desc}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                testStatus === 'idle' ? 'bg-slate-100 text-slate-700' :
                testStatus === 'running' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {testStatus === 'idle' ? 'Bereit' : testStatus === 'running' ? 'Biegebelastung...' : 'Bruch eingetreten'}
              </span>
            </div>

            {/* Beam Graphic & Curve */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-4 flex-1">
              
              {/* Biegeprüfeinrichtung (Ansicht) */}
              <figure className="pruefgeraet md:col-span-12 p-3 rounded-xl border flex flex-col items-center justify-center gap-1 m-0">
                <svg viewBox="0 0 440 230" className="w-full max-w-[560px] h-auto select-none" role="img" aria-label={biegeLabel}>
                  <title>{biegeLabel}</title>
                  <PfeilDefs praefix="bzp" />

                  {/* Bereich reiner Biegung (4-Punkt) */}
                  {loadingSystem === '4punkt' && (
                    <rect x={lastPunkte[0]} y={ob - 4} width={lastPunkte[1] - lastPunkte[0]} height={hb + 8 + durchbiegungPx} fill="var(--pg-akzent-hell)" />
                  )}

                  {/* Balken */}
                  {gebrochen ? (
                    <g>
                      <path d={`M 35 ${ob} L ${mitteX - 3} ${ob + 4} L ${mitteX - 6} ${ob + hb + 6} L 35 ${ob + hb} Z`} fill={material === 'holz_c24' ? 'var(--pg-holz)' : 'var(--pg-beton)'} stroke="var(--pg-kontur)" strokeWidth="1.5" />
                      <path d={`M ${mitteX + 3} ${ob + 4} L 405 ${ob} L 405 ${ob + hb} L ${mitteX + 6} ${ob + hb + 6} Z`} fill={material === 'holz_c24' ? 'var(--pg-holz)' : 'var(--pg-beton)'} stroke="var(--pg-kontur)" strokeWidth="1.5" />
                    </g>
                  ) : (
                    <g>
                      <path
                        d={`M 35 ${yOben(35)} Q ${mitteX} ${ob + 2 * durchbiegungPx} 405 ${yOben(405)} L 405 ${yUnten(405)} Q ${mitteX} ${ob + hb + 2 * durchbiegungPx} 35 ${yUnten(35)} Z`}
                        fill={material === 'holz_c24' ? 'var(--pg-holz)' : 'var(--pg-beton)'}
                        stroke="var(--pg-kontur)"
                        strokeWidth="1.5"
                      />
                      {material === 'beton_stahlbewehrt' && (
                        <path d={`M 42 ${yUnten(42) - 7} Q ${mitteX} ${ob + hb - 7 + 2 * durchbiegungPx} 398 ${yUnten(398) - 7}`} stroke="var(--pg-akzent)" strokeWidth="3" fill="none" />
                      )}
                      {material === 'beton_spannbeton' && (
                        <g>
                          <rect x="29" y={ob + hb - 16} width="7" height="14" rx="1" fill="var(--pg-stahl3)" stroke="var(--pg-kontur)" />
                          <rect x="404" y={ob + hb - 16} width="7" height="14" rx="1" fill="var(--pg-stahl3)" stroke="var(--pg-kontur)" />
                          <path d={`M 36 ${ob + hb - 9} Q ${mitteX} ${ob + hb - 9 + 2 * durchbiegungPx} 404 ${ob + hb - 9}`} stroke="var(--pg-kontur)" strokeWidth="3" strokeDasharray="6 2" fill="none" />
                          <line x1="6" y1={ob + hb - 9} x2="26" y2={ob + hb - 9} stroke="var(--pg-akzent)" strokeWidth="2" markerEnd="url(#bzp-pfeil)" />
                          <line x1="434" y1={ob + hb - 9} x2="414" y2={ob + hb - 9} stroke="var(--pg-akzent)" strokeWidth="2" markerEnd="url(#bzp-pfeil)" />
                        </g>
                      )}
                      {material === 'beton_stahlfasern' && (
                        <g stroke="var(--pg-kontur)" strokeWidth="1.5" opacity="0.7">
                          {[[150, 90], [190, 104], [232, 86], [262, 100], [300, 92], [118, 104], [330, 104]].map(([x, y], i) => (
                            <path key={i} d={`M ${x} ${y + durchbiegungPx * 0.6} l 4 -2 l 10 1 l 4 -2`} fill="none" />
                          ))}
                        </g>
                      )}
                      {material === 'holz_c24' && (
                        <g stroke="var(--pg-holz-faser)" strokeWidth="1" opacity="0.6" fill="none">
                          <path d={`M 40 ${ob + 12} Q ${mitteX} ${ob + 12 + 2 * durchbiegungPx} 400 ${ob + 12}`} />
                          <path d={`M 40 ${ob + 24} Q ${mitteX} ${ob + 24 + 2 * durchbiegungPx} 400 ${ob + 24}`} />
                        </g>
                      )}
                      {crackHeightPercent > 0 && (
                        <g stroke="var(--pg-riss)" strokeLinecap="round">
                          <line x1={mitteX} y1={ob + hb + durchbiegungPx} x2={mitteX + 1} y2={ob + hb + durchbiegungPx - hb * 0.9 * (crackHeightPercent / 100)} strokeWidth={1.5 + currentDeflectionMm * 0.25} />
                          {(material === 'beton_stahlbewehrt' || material === 'beton_spannbeton') && crackHeightPercent > 25 && (
                            <>
                              <line x1={mitteX - 42} y1={ob + hb + durchbiegungPx * 0.9} x2={mitteX - 43} y2={ob + hb + durchbiegungPx * 0.9 - 20} strokeWidth="1.3" />
                              <line x1={mitteX + 42} y1={ob + hb + durchbiegungPx * 0.9} x2={mitteX + 43} y2={ob + hb + durchbiegungPx * 0.9 - 20} strokeWidth="1.3" />
                            </>
                          )}
                        </g>
                      )}
                    </g>
                  )}
                  {gebrochen && <path d={`M ${mitteX - 2} ${ob + 2} L ${mitteX + 2} ${ob + 16} L ${mitteX - 3} ${ob + 28} L ${mitteX} ${ob + hb + 6}`} stroke="var(--pg-riss)" strokeWidth="2" fill="none" />}

                  {/* Auflagerrollen */}
                  {[A1, A2].map(x => (
                    <g key={x}>
                      <circle cx={x} cy={ob + hb + 7} r="7" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="1.3" />
                      <path d={`M ${x} ${ob + hb + 14} L ${x - 13} ${ob + hb + 34} L ${x + 13} ${ob + hb + 34} Z`} fill="var(--pg-stahl)" stroke="var(--pg-kontur)" strokeWidth="1.3" />
                    </g>
                  ))}
                  <rect x="20" y={ob + hb + 34} width="400" height="8" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="1" />

                  {/* Lastrollen, Lastverteilungsträger und Kraft F */}
                  {lastPunkte.map(x => (
                    <circle key={x} cx={x} cy={yOben(x) - 7} r="7" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="1.3" />
                  ))}
                  {loadingSystem === '4punkt' ? (
                    <rect x={lastPunkte[0] - 14} y={yOben(lastPunkte[0]) - 26} width={lastPunkte[1] - lastPunkte[0] + 28} height="12" rx="2" fill="var(--pg-stahl)" stroke="var(--pg-kontur)" strokeWidth="1.3" />
                  ) : (
                    <rect x={mitteX - 18} y={yOben(mitteX) - 26} width="36" height="12" rx="2" fill="var(--pg-stahl)" stroke="var(--pg-kontur)" strokeWidth="1.3" />
                  )}
                  <line x1={mitteX} y1="6" x2={mitteX} y2={yOben(mitteX) - 28} stroke="var(--pg-akzent)" strokeWidth="2.5" markerEnd="url(#bzp-pfeil)" />
                  <text x={mitteX + 8} y="20" fontSize={13 * fs} fontWeight="bold" fill="var(--pg-akzent)">
                    {testStatus === 'finished'
                      ? <>F<tspan fontSize={10 * fs} dy="3">max</tspan><tspan dy="-3"> = {formatDeZahl(maxForceObserved, 1)} kN</tspan></>
                      : `F = ${formatDeZahl(currentForceKN, 1)} kN`}
                  </text>

                  {/* Wegaufnehmer unter Feldmitte */}
                  <line x1={mitteX} y1={ob + hb + durchbiegungPx + 2} x2={mitteX} y2={ob + hb + 24} stroke="var(--pg-kontur)" strokeWidth="1.5" />
                  <rect x={mitteX - 5} y={ob + hb + 22} width="10" height="12" rx="1.5" fill="var(--pg-stahl3)" stroke="var(--pg-kontur)" strokeWidth="1" />
                  <text x={mitteX + 10} y={ob + hb + 30} fontSize={12 * fs} fill="var(--pg-text)">δ = {formatDeZahl(currentDeflectionMm, 2)} mm</text>

                  {/* Maßketten */}
                  {loadingSystem === '4punkt' ? (
                    <g>
                      <Masslinie praefix="bzp" schrift={12 * fs} x1={A1} y1={ob + hb + 82} x2={lastPunkte[0]} y2={ob + hb + 82} text="L/3" />
                      <Masslinie praefix="bzp" schrift={12 * fs} x1={lastPunkte[0]} y1={ob + hb + 82} x2={lastPunkte[1]} y2={ob + hb + 82} text="L/3" />
                      <Masslinie praefix="bzp" schrift={12 * fs} x1={lastPunkte[1]} y1={ob + hb + 82} x2={A2} y2={ob + hb + 82} text="L/3" />
                    </g>
                  ) : (
                    <g>
                      <Masslinie praefix="bzp" schrift={12 * fs} x1={A1} y1={ob + hb + 82} x2={mitteX} y2={ob + hb + 82} text="L/2" />
                      <Masslinie praefix="bzp" schrift={12 * fs} x1={mitteX} y1={ob + hb + 82} x2={A2} y2={ob + hb + 82} text="L/2" />
                    </g>
                  )}
                  <Masslinie praefix="bzp" schrift={12 * fs} x1={A1} y1={ob + hb + 112} x2={A2} y2={ob + hb + 112} text={`L = ${formatDeWert(spanLength)} mm`} />
                </svg>
                <figcaption className="text-[11px] text-center leading-snug px-2" style={{ color: 'var(--pg-text2)' }}>
                  {loadingSystem === '4punkt'
                    ? 'Lasten in den Drittelspunkten; zwischen den Lastrollen konstantes Moment ohne Querkraft (hinterlegt).'
                    : 'Einzellast in Feldmitte; größtes Moment unter der Lastrolle.'}
                  {' '}Wegaufnehmer unter Feldmitte misst die Durchbiegung δ.
                  {material === 'beton_spannbeton' && ' Gestrichelt: Spannlitzen mit Vorspannkraft P₀ (Pfeile), Ankerplatten an den Enden.'}
                  {material === 'beton_stahlbewehrt' && ' Rot: Längsbewehrung in der Zugzone.'}
                  {material === 'beton_stahlfasern' && ' Kurze Striche: Stahlfasern mit Endhaken.'}
                </figcaption>
              </figure>

              {/* Force-Deflection Line Chart (12 cols) */}
              <div className="md:col-span-12 flex flex-col gap-3">
                
                {/* Metric Cards */}
                <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-2.5">
                  <div className="bg-off-white text-text-main p-3 rounded-xl border border-home-grau/30 shadow-inner">
                    <span className="text-[11px] font-mono text-slate-600 font-bold uppercase tracking-wider block">Prüfkraft <Fz>F</Fz></span>
                    <span className="text-xl font-mono font-bold text-amber-700">
                      {formatDeZahl(currentForceKN, 1)} <span className="text-xs text-slate-700 font-normal">kN</span>
                    </span>
                  </div>

                  <div className="bg-off-white text-text-main p-3 rounded-xl border border-home-grau/30 shadow-inner">
                    <span className="text-[11px] font-mono text-slate-600 font-bold uppercase tracking-wider block">Biegezug&shy;spannung <Fz idx="fl">σ</Fz></span>
                    <span className="text-xl font-mono font-bold text-emerald-700">
                      {formatDeZahl(currentBendingStressMPa, 2)} <span className="text-xs text-slate-700 font-normal">N/mm²</span>
                    </span>
                  </div>

                  <div className="bg-off-white text-text-main p-3 rounded-xl border border-home-grau/30 shadow-inner">
                    <span className="text-[11px] font-mono text-slate-600 font-bold uppercase tracking-wider block">Durchbiegung <Fz>δ</Fz></span>
                    <span className="text-xl font-mono font-bold text-cyan-700">
                      {formatDeZahl(currentDeflectionMm, 2)} <span className="text-xs text-slate-700 font-normal">mm</span>
                    </span>
                  </div>
                </div>

                {/* Chart View Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <AuswahlGruppe label="Diagrammdarstellung" className="flex flex-wrap items-center gap-1.5">
                    <button {...alsOption(chartMode === 'force')}
                      onClick={() => setChartMode('force')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        chartMode === 'force'
                          ? 'bg-shiraz text-white shadow-xs'
                          : 'bg-white text-text-main/80 border border-home-grau/30 hover:bg-slate-100'
                      }`}
                    >
                      Last-Durchbiegung (F – δ)
                    </button>
                    <button {...alsOption(chartMode === 'stress')}
                      onClick={() => setChartMode('stress')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        chartMode === 'stress'
                          ? 'bg-shiraz text-white shadow-xs'
                          : 'bg-white text-text-main/80 border border-home-grau/30 hover:bg-slate-100'
                      }`}
                    >
                      Biegespannung (σ<sub>fl</sub> – δ)
                    </button>
                    </AuswahlGruppe>
                    <button
                      onClick={() => setShowGrid(!showGrid)}
                      className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                        showGrid
                          ? 'bg-shiraz text-white border-shiraz shadow-xs'
                          : 'bg-white text-text-main/70 border-home-grau/30 hover:bg-slate-100'
                      }`}
                      title="Gitterlinien ein- oder ausblenden"
                    >
                      {showGrid ? 'Gitter: Ein' : 'Gitter: Aus'}
                    </button>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {loadingSystem === '4punkt' ? '4-Punkt (reine Biegung)' : '3-Punkt'}
                  </span>
                </div>

                {/* Chart container */}
                <div className="w-full h-[220px] bg-off-white rounded-xl p-2.5 border border-home-grau/25 relative shadow-xs">
                  <Line
                    data={{
                      datasets: [
                        {
                          label: chartMode === 'force' ? 'Last-Verformungskurve F-δ' : 'Biegespannungsverlauf σ-δ',
                          data: displayChartData,
                          borderColor: farben.linie,
                          backgroundColor: farben.flaeche,
                          borderWidth: 2.8,
                          pointRadius: 0,
                          fill: true,
                          tension: 0.1
                        }
                      ]
                    }}
                    options={chartOptions}
                  />
                  {testStatus === 'idle' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[1px] rounded-xl text-text-main/70">
                      <p className="text-xs font-bold">Klicken Sie links auf &quot;Biegetest Starten&quot;</p>
                      <p className="text-[10px] text-text-main/50">Ermittelt Last-Durchbiegungs-Verhalten nach DIN EN 12390-5</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Test Summary & Archiving Toolbar */}
            {testStatus === 'finished' && (
              <div className="mt-2 p-4 bg-off-white rounded-xl border border-home-grau/30 flex flex-col gap-3 animate-in fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-text-main/60 uppercase text-[11px] font-bold block">Biegezug&shy;festigkeit <Fz idx="ct,fl">f</Fz></span>
                    <strong className="text-base text-shiraz font-mono">{formatDeZahl(maxStressObserved, 2)} N/mm²</strong>
                  </div>
                  <div>
                    <span className="text-text-main/60 uppercase text-[11px] font-bold block">Höchstkraft <Fz idx="max">F</Fz></span>
                    <strong className="text-base text-text-main font-mono">{formatDeZahl(maxForceObserved, 1)} kN</strong>
                  </div>
                  <div>
                    <span className="text-text-main/60 uppercase text-[11px] font-bold block">Enddurchbiegung <Fz idx="u">δ</Fz></span>
                    <strong className="text-base text-cyan-800 font-mono">{formatDeZahl(currentDeflectionMm, 2)} mm</strong>
                  </div>
                  <div>
                    <span className="text-text-main/60 uppercase text-[11px] font-bold block">Widerstandsmoment <Fz>W</Fz></span>
                    <strong className="text-base text-text-main font-mono">{formatDeZahl((W / 1000), 0)} cm³</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-home-grau/20 gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-text-main">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span>Simulierte Biegeprüfung abgeschlossen (Prüfnorm: <strong>{matProps.norm}</strong>).</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleArchive}
                      disabled={savedSuccess}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        savedSuccess
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-shiraz hover:bg-shiraz/90 text-white shadow-sm'
                      }`}
                    >
                      {savedSuccess ? (
                        <>
                          <Check size={14} /> Im Protokoll archiviert!
                        </>
                      ) : (
                        <>
                          <FileText size={14} /> Messung archivieren
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        const rows = curveData.map(d => [d.x.toFixed(3), d.y.toFixed(2), ((d.y * 1000 * lever) / W).toFixed(3)]);
                        exportToCSV(`Biegezug_${material}_${loadingSystem}`, ['Durchbiegung_mm', 'Kraft_kN', 'Biegezugspannung_N_mm2'], rows);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-text-main text-xs font-bold rounded-xl border border-home-grau/30 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download size={14} /> CSV
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Didactic Section: Werkstoffmechanik & Spannbeton-Prinzip */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
          <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
            <Info size={20} className="text-shiraz" /> Das Spannbeton-Prinzip im Biegezugversuch
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500 bg-off-white px-2.5 py-1 rounded-lg border border-home-grau/20">
            DIN EN 1992-1-1
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Card 1: Das Prinzip der planmäßigen Vorspannung */}
          <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-shiraz font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-shiraz/10 text-shiraz flex items-center justify-center text-xs">1</span>
              <span>Planmäßige Vorüberdrückung</span>
            </div>
            <p className="text-text-main/80 leading-relaxed">
              Beton besitzt eine hohe Druckfestigkeit, jedoch nur rund ein Zehntel seiner Festigkeit auf Zug. Beim <strong>Spannbeton</strong> werden hochfeste Spannstahllitzen (z.&nbsp;B. Y1860 mit <InlineMath math="f_{pk} = 1860\,\text{N/mm}^2" />) auf Zug vorgespannt; über den Verbund setzen sie den Betonquerschnitt unter Druck. Am Biegezugrand entsteht so eine Vordruckspannung <InlineMath math="\sigma_{c,p}" /> (Druck negativ):
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 font-mono text-[11px] text-center">
              <InlineMath math="\sigma_{c,\text{unterkante}} = -\frac{P_0}{A_c} - \frac{P_0 \cdot e_p}{W_c} + \frac{M_{\text{ext}}}{W_c}" />
            </div>
          </div>

          {/* Card 2: Dekompressionsmoment & Rissbildung */}
          <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-shiraz font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-shiraz/10 text-shiraz flex items-center justify-center text-xs">2</span>
              <span>Dekompression &amp; Rissmoment</span>
            </div>
            <p className="text-text-main/80 leading-relaxed">
              Wirkt ein äußeres Biegemoment <InlineMath math="M_{\text{ext}}" />, baut dieses zuerst die Druckvorspannung im Zugbereich ab. Erst wenn die Spannung Null wird, ist die <strong>Dekompression</strong> erreicht. Risse entstehen erst, wenn zusätzlich die Betonzugfestigkeit <InlineMath math="f_{ct,fl}" /> überschritten wird:
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 font-mono text-[11px] text-center">
              <InlineMath math="M_r = W_c \cdot \left(|\sigma_{c,p}| + f_{ct,fl}\right) \gg W_c \cdot f_{ct,fl}" />
            </div>
          </div>

          {/* Card 3: Zustand I vs. Zustand II & Durchbiegung */}
          <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-shiraz font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-shiraz/10 text-shiraz flex items-center justify-center text-xs">3</span>
              <span>Gebrauchstauglichkeit (GZG)</span>
            </div>
            <p className="text-text-main/80 leading-relaxed">
              Durch das Hinauszögern der Rissbildung verbleibt der Balken unter vollen Betriebs- und Verkehrslasten im ungerissenen <strong>Zustand I</strong> (volles Trägheitsmoment <InlineMath math="I_I" />). Die elastische Durchbiegung <InlineMath math="\delta" /> ist um ein Vielfaches geringer als bei gewöhnlichem Stahlbeton.
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 font-mono text-[11px] text-center">
              <InlineMath math="I_I = \frac{b \cdot h^3}{12} \quad \implies \quad \delta \propto \frac{1}{E_c \cdot I_I}" />
            </div>
          </div>
        </div>

        {/* Vergleichende Tabelle der Bruchmechanismen im Biegeversuch */}
        <div className="mt-2 border border-home-grau/25 rounded-xl overflow-hidden text-xs">
          <div className="bg-slate-100 p-3 font-bold text-text-main border-b border-home-grau/20 flex justify-between items-center">
            <span>Systematischer Vergleich der Versagensformen im Labor-Biegeversuch</span>
            <span className="text-[11px] font-normal text-text-main/60">Querschnitt 150 × 150 mm, Werte als rechnerische Randspannung M/W</span>
          </div>
          <div className="divide-y divide-home-grau/20 bg-white">
            <div className="p-3 grid grid-cols-1 md:grid-cols-4 gap-2">
              <span className="font-bold text-slate-800">Unbewehrter Beton</span>
              <span className="text-text-main/70">Sprödbruch ohne Vorankündigung</span>
              <span className="font-mono text-text-main/80">Risslast = Bruchlast (~4,2 MPa)</span>
              <span className="text-amber-800">Schlagartiger Kraftabfall auf 0 kN</span>
            </div>
            <div className="p-3 grid grid-cols-1 md:grid-cols-4 gap-2 bg-slate-50/50">
              <span className="font-bold text-slate-800">Stahlbeton (B500B)</span>
              <span className="text-text-main/70">Duktiler Biegebruch mit Rissverteilung</span>
              <span className="font-mono text-text-main/80">Riss bei ~4,2 MPa, Fließen bei ~14 MPa</span>
              <span className="text-emerald-700">Große Durchbiegung mit Fließplateau</span>
            </div>
            <div className="p-3 grid grid-cols-1 md:grid-cols-4 gap-2 bg-blue-50/40">
              <span className="font-bold text-blue-900">Spannbeton (Y1860)</span>
              <span className="text-text-main/70">Drucküberdrückung &amp; Dekompression</span>
              <span className="font-mono text-blue-900 font-bold">Riss erst bei ~16,5 MPa, Bruch ~24 MPa</span>
              <span className="text-blue-800">Sehr steif im Zustand I, danach hohe Tragreserve</span>
            </div>
            <div className="p-3 grid grid-cols-1 md:grid-cols-4 gap-2">
              <span className="font-bold text-slate-800">Stahlfaserbeton</span>
              <span className="text-text-main/70">Zähes Nachrisszugverhalten (Pull-Out)</span>
              <span className="font-mono text-text-main/80">Riss bei ~4,5 MPa, Resttragfähigkeit</span>
              <span className="text-purple-800">Fasern vernähen Rissflanken sukzessive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
