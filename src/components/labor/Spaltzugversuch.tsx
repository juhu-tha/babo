import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, RotateCcw, ShieldCheck, Check, Download, FileText, Split } from 'lucide-react';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type ConcreteGrade = 'C20/25' | 'C30/37' | 'C45/55' | 'C60/75' | 'C90/105' | 'LC25/28' | 'Zementstein';

interface SpaltzugversuchProps {
  onNavigateToProtocols?: () => void;
}

export default function Spaltzugversuch({ onNavigateToProtocols }: SpaltzugversuchProps) {
  const [grade, setGrade] = useState<ConcreteGrade>('C30/37');
  const [diameter, setDiameter] = useState<number>(150); // mm
  const [length, setLength] = useState<number>(300); // mm
  const [stripWidth, setStripWidth] = useState<number>(15); // mm, Lehrwert – Abmessungen der Hartfaserstreifen nach DIN EN 12390-6
  const [loadingRate, setLoadingRate] = useState<number>(0.05); // MPa/s (Norm: 0,04 bis 0,06 MPa/s)

  // Simulation status
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [progress, setProgress] = useState(0); // 0 to 100
  const [currentForceKN, setCurrentForceKN] = useState(0);
  const [currentStressMPa, setCurrentStressMPa] = useState(0);
  const [currentDeformationMm, setCurrentDeformationMm] = useState(0);
  const [crackOpeningMm, setCrackOpeningMm] = useState(0);

  const [chartMode, setChartMode] = useState<'stress' | 'force'>('stress');
  const [showGrid, setShowGrid] = useState(false);
  const [testData, setTestData] = useState<{ x: number; y: number }[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearCurrentInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Physical concrete parameters based on DIN EN 1992-1-1
  const gradeProps = useMemo(() => {
    switch (grade) {
      case 'C20/25':
        return { fck: 20, fctm: 2.2, fctsp: 2.45, E: 30000, desc: 'Normalfester Konstruktionsbeton für Standardbauteile' };
      case 'C30/37':
        return { fck: 30, fctm: 2.9, fctsp: 3.22, E: 33000, desc: 'Hochbau-Standardbeton (Außenwände, Decken, Stützen)' };
      case 'C45/55':
        return { fck: 45, fctm: 3.8, fctsp: 4.22, E: 36000, desc: 'Leistungsfähiger Ingenieurbeton (Brücken, Parkhäuser)' };
      case 'C60/75':
        return { fck: 60, fctm: 4.4, fctsp: 4.90, E: 39000, desc: 'Hochfester Beton mit dichtem Matrixgefüge' };
      case 'C90/105':
        return { fck: 90, fctm: 5.0, fctsp: 5.60, E: 44000, desc: 'Hochfester Beton (obere Klassen nach DIN EN 206) mit Silikastaub; sehr sprödes Spaltversagen' };
      case 'LC25/28':
        return { fck: 25, fctm: 1.8, fctsp: 2.05, E: 19000, desc: 'Konstruktiver Leichtbeton mit Blähtonkörnung (Werte für Rohdichte ca. 1600 kg/m³ abgeschätzt)' };
      case 'Zementstein':
        return { fck: 55, fctm: 3.5, fctsp: 3.90, E: 24000, desc: 'Reine Zementsteinmatrix ohne Gesteinskörnung' };
    }
  }, [grade]);

  // Max theoretical force: F = fctsp * pi * d * L / 2
  const maxForceKN = useMemo(() => {
    const areaFactor = (Math.PI * diameter * length) / 2; // mm²
    return (gradeProps.fctsp * areaFactor) / 1000;
  }, [gradeProps, diameter, length]);

  // Max theoretical deformation (mm)
  const maxDeformationMm = useMemo(() => {
    return ((2.5 * gradeProps.fctsp * diameter) / gradeProps.E) * 2.5;
  }, [gradeProps, diameter]);

  const runTest = () => {
    setTestStatus('running');
    setProgress(0);
    setTestData([]);
    setCrackOpeningMm(0);

    const steps = 95;
    const targetData: { x: number; y: number }[] = [];

    // Precalculate stress-deformation curve
    for (let i = 0; i <= steps; i++) {
      const frac = i / steps;
      let stress = 0;
      const deflection = frac * maxDeformationMm;

      if (frac <= 0.88) {
        // Linear-elastischer Anstieg
        stress = (frac / 0.88) * gradeProps.fctsp * 0.94;
      } else if (frac <= 0.95) {
        // Mikrorissentwicklung im Zentrum des Zylinders kurz vor dem Bruch
        const microFrac = (frac - 0.88) / 0.07;
        stress = gradeProps.fctsp * (0.94 + 0.06 * Math.sin(microFrac * Math.PI * 0.5));
      } else if (frac <= 0.99) {
        // Sprödes Spalten: schlagartiger Lastabfall auf 0
        const dropFrac = (frac - 0.95) / 0.04;
        stress = gradeProps.fctsp * Math.max(0, 1 - dropFrac * 2.5);
      } else {
        stress = 0;
      }

      targetData.push({ x: deflection, y: stress });
    }

    let currentStep = 0;
    clearCurrentInterval();
    intervalRef.current = setInterval(() => {
      if (currentStep < targetData.length) {
        const pt = targetData[currentStep];
        setTestData(targetData.slice(0, currentStep + 1));
        const prog = (currentStep / steps) * 100;
        setProgress(prog);

        const curStress = pt.y;
        const curForce = (curStress * (Math.PI * diameter * length)) / 2000;
        const curDefl = pt.x;

        setCurrentStressMPa(curStress);
        setCurrentForceKN(curForce);
        setCurrentDeformationMm(curDefl);

        if (prog > 80) {
          setCrackOpeningMm(((prog - 80) / 20) * 1.8);
        }

        currentStep++;
      } else {
        clearCurrentInterval();
        setTestStatus('finished');
        setProgress(100);
        setCrackOpeningMm(2.5); // Spalt vollständig geöffnet
      }
    }, 45);
  };

  const handleReset = () => {
    clearCurrentInterval();
    setTestStatus('idle');
    setProgress(0);
    setTestData([]);
    setCurrentForceKN(0);
    setCurrentStressMPa(0);
    setCurrentDeformationMm(0);
    setCrackOpeningMm(0);
    setSavedSuccess(false);
  };

  useEffect(() => {
    handleReset();
  }, [grade, diameter, length]);

  useEffect(() => {
    return () => clearCurrentInterval();
  }, []);

  // Archive protocol
  const handleArchive = () => {
    if (testStatus !== 'finished') return;

    const validation = validateMechanicalTestIntegrity(
      'beton',
      'zug',
      currentStressMPa,
      gradeProps.E / 1000,
      0.15
    );

    const newRecord: LabProtocolRecord = {
      id: `PROTO-SPALT-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }),
      testTitle: `Spaltzugversuch (Brasilianischer Test) an ${grade}`,
      norm: 'DIN EN 12390-6',
      operator: 'Virtuelles Betonlabor (Lehrsimulation)',
      specimen: {
        material: `Beton ${grade}`,
        geometry: `Zylinder d=${diameter} mm, L=${length} mm`,
        dimensions: `Ø ${formatDeWert(diameter)} mm × ${length} mm`,
        conditioning: 'Wasserlagerung 20 ± 2 °C nach DIN EN 12390-2, 28 Tage (simuliert)'
      },
      parameters: {
        'Prüfgeschwindigkeit': `${formatDeZahl(loadingRate, 2)} MPa/s`,
        'Hartfaserstreifen-Breite': `${stripWidth} mm`,
        'Zylinderdurchmesser': `${formatDeWert(diameter)} mm`,
        'Zylinderlänge': `${length} mm`
      },
      metrics: {
        'Spaltzugfestigkeit fct,sp (MPa)': formatDeZahl(currentStressMPa, 2),
        'Zentrische Zugfestigkeit fct ≈ 0,9·fct,sp (MPa)': formatDeZahl((currentStressMPa * 0.9), 2),
        'Bruchlast Fmax (kN)': formatDeZahl(currentForceKN, 1),
        'Verformung Δd (mm)': formatDeZahl(currentDeformationMm, 3),
        'E-Modul (GPa)': formatDeZahl((gradeProps.E / 1000), 1)
      },
      status: validation.status,
      validationNotes: validation.notes,
      integrityHash: validation.hash,
      dataPointsCount: testData.length
    };

    saveStoredLabProtocol(newRecord);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const displayChartData = useMemo(() => {
    if (chartMode === 'stress') return testData;
    return testData.map(d => ({
      x: d.x,
      y: (d.y * Math.PI * diameter * length) / 2000 // in kN
    }));
  }, [testData, chartMode, diameter, length]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: {
        type: 'linear' as const,
        title: { display: true, text: 'Zylinderstauchung / Weg Δd (mm)', font: { weight: 'bold' as const, size: 12 } },
        min: 0,
        max: maxDeformationMm * 1.15,
        grid: { display: showGrid, color: 'rgba(0,0,0,0.06)' }
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: chartMode === 'stress' ? 'Spaltzugspannung σx (MPa = N/mm²)' : 'Prüfkraft F (kN)',
          font: { weight: 'bold' as const, size: 12 }
        },
        min: 0,
        max: chartMode === 'stress' ? gradeProps.fctsp * 1.25 : maxForceKN * 1.25,
        grid: { display: showGrid, color: 'rgba(0,0,0,0.06)' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items: TooltipItem<'line'>[]) => `Weg Δd = ${formatDeZahl(Number(items[0].parsed.x), 3)} mm`,
          label: (ctx: TooltipItem<'line'>) => chartMode === 'stress'
            ? `Spaltzugspannung: ${formatDeZahl(Number(ctx.parsed.y), 2)} MPa`
            : `Prüfkraft F: ${formatDeZahl(Number(ctx.parsed.y), 1)} kN`
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Settings Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
              <h3 className="font-bold text-text-main flex items-center gap-2">
                <Split size={18} className="text-shiraz" /> 1. Probenkonfiguration
              </h3>
              <span className="text-[11px] font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full">
                DIN EN 12390-6
              </span>
            </div>

            {/* Concrete Grade Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-main uppercase tracking-wider">Betongüte</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['C20/25', 'C30/37', 'C45/55', 'C60/75', 'C90/105', 'LC25/28', 'Zementstein'] as ConcreteGrade[]).map(g => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    disabled={testStatus === 'running'}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                      grade === g
                        ? 'bg-shiraz text-white border-shiraz shadow-xs'
                        : 'bg-off-white text-text-main border-home-grau/30 hover:bg-slate-100 disabled:opacity-50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-text-main/70 pt-1">{gradeProps.desc}</p>
            </div>

            {/* Specimen Dimensions */}
            <div className="space-y-3 pt-2 border-t border-home-grau/20 text-xs">
              <label className="font-bold text-text-main uppercase tracking-wider block">Zylinderabmessungen</label>
              
              <div className="flex justify-between items-center bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                <span className="flex items-center gap-1">
                  Durchmesser <InlineMath math="d" />:
                </span>
                <div className="flex items-center gap-1 font-mono font-bold">
                  <span>{formatDeWert(diameter)} mm</span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                <span className="flex items-center gap-1">
                  Länge <InlineMath math="L" />:
                </span>
                <div className="flex items-center gap-1 font-mono font-bold">
                  <span>{length} mm</span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900">
                <span className="flex items-center gap-1">
                  Hartfaserstreifen <InlineMath math="b" />:
                </span>
                <span className="font-mono font-bold">{formatDeWert(stripWidth)} × 4 mm</span>
              </div>
            </div>

            {/* Loading Rate */}
            <div className="space-y-1.5 pt-2 border-t border-home-grau/20">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-text-main">Prüfgeschwindigkeit:</span>
                <span className="font-mono font-bold text-shiraz">{formatDeZahl(loadingRate, 2)} MPa/s</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.10"
                step="0.01"
                value={loadingRate}
                onChange={e => setLoadingRate(parseFloat(e.target.value))}
                disabled={testStatus === 'running'}
                className="w-full accent-shiraz cursor-pointer"
              />
              <span className="text-[10px] text-text-main/60 block">Normbereich DIN EN 12390-6: 0,04 bis 0,06 MPa/s</span>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2 pt-2 border-t border-home-grau/20">
              <button
                onClick={runTest}
                disabled={testStatus === 'running'}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Play size={16} /> Spaltversuch Starten
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

        {/* Right Graphical Rig & Results (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full">
            
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-home-grau/20 gap-3">
              <div>
                <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                  <Split size={18} className="text-shiraz" /> 2. Zylinder-Spaltung &amp; Querzugspannungsfeld
                </h3>
                <p className="text-xs text-text-main/70">
                  Brasilianischer Versuch: Die Linienlast entlang zweier gegenüberliegender Mantellinien erzeugt in der Lastebene eine nahezu gleichmäßige Querzugspannung
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                testStatus === 'idle' ? 'bg-slate-100 text-slate-700' :
                testStatus === 'running' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {testStatus === 'idle' ? 'Bereit' : testStatus === 'running' ? 'Spaltkraft steigt...' : 'Zylinder gespalten'}
              </span>
            </div>

            {/* Split Visualizer & Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-4 flex-1">
              
              {/* Graphic Rig View (Cross-section and 3D) */}
              <div className="md:col-span-5 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-900 dark:bg-slate-900 p-4 rounded-xl border border-slate-300 dark:border-slate-800 flex flex-col items-center justify-between relative shadow-inner min-h-[340px]">
                
                {/* Upper Pressure Platen with Force Arrow */}
                <div className="w-full flex flex-col items-center">
                  <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-red-700 dark:text-red-400 mb-1">
                    <span>F = {formatDeZahl(currentForceKN, 1)} kN</span>
                  </div>
                  {/* Hydraulic Platen */}
                  <div className="w-48 h-5 bg-gradient-to-r from-slate-700 to-slate-800 dark:from-slate-800 dark:to-slate-800 dark:bg-slate-800 rounded-t shadow-md border border-slate-600 dark:border-slate-700 flex items-center justify-center">
                    <div className="w-12 h-1 bg-red-400 rounded-full animate-pulse"></div>
                  </div>
                  {/* Top Hardboard packing strip */}
                  <div className="w-8 h-2 bg-amber-700 rounded-xs shadow-xs border border-amber-900"></div>
                </div>

                {/* Cylinder Cross Section SVG */}
                <div className="relative my-auto flex items-center justify-center">
                  <svg width="180" height="180" viewBox="0 0 180 180">
                    <defs>
                      <radialGradient id="concreteGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#cbd5e1" />
                        <stop offset="85%" stopColor="#94a3b8" />
                        <stop offset="100%" stopColor="#64748b" />
                      </radialGradient>
                    </defs>

                    {/* Cylinder Body */}
                    <circle cx="90" cy="90" r="75" fill="url(#concreteGrad)" stroke="#475569" strokeWidth="2.5" />

                    {/* Aggregate Speckles */}
                    <circle cx="60" cy="70" r="6" fill="#334155" opacity="0.6" />
                    <circle cx="120" cy="80" r="8" fill="#1e293b" opacity="0.6" />
                    <circle cx="85" cy="125" r="7" fill="#334155" opacity="0.5" />
                    <circle cx="110" cy="130" r="5" fill="#475569" opacity="0.6" />
                    <circle cx="70" cy="110" r="9" fill="#1e293b" opacity="0.5" />
                    <circle cx="100" cy="55" r="7" fill="#334155" opacity="0.6" />

                    {/* Transverse Tensile Stress Field Arrows (Horizontal) */}
                    <g opacity={Math.min(1, progress / 60)}>
                      {/* Center Arrows pointing outward */}
                      <path d="M 85 90 L 55 90" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow)" />
                      <path d="M 95 90 L 125 90" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow)" />
                      <path d="M 85 65 L 60 65" stroke="#A3113E" strokeWidth="1.5" />
                      <path d="M 95 65 L 120 65" stroke="#A3113E" strokeWidth="1.5" />
                      <path d="M 85 115 L 60 115" stroke="#A3113E" strokeWidth="1.5" />
                      <path d="M 95 115 L 120 115" stroke="#A3113E" strokeWidth="1.5" />
                      <text x="90" y="80" textAnchor="middle" fill="#881235" fontSize="10" fontWeight="bold">σx &gt; 0 (Zug)</text>
                    </g>

                    {/* Vertical Diametral Split Crack */}
                    {crackOpeningMm > 0 && (
                      <g>
                        <path
                          d={`M 90 15 Q ${88 + Math.sin(progress) * 2} 90 90 165`}
                          stroke="#0f172a"
                          strokeWidth={2 + crackOpeningMm * 2.5}
                          fill="none"
                        />
                        {/* Secondary micro-branching */}
                        <path d="M 89 75 L 78 88" stroke="#1e293b" strokeWidth="1.5" fill="none" opacity="0.8" />
                        <path d="M 91 105 L 102 118" stroke="#1e293b" strokeWidth="1.5" fill="none" opacity="0.8" />
                      </g>
                    )}
                  </svg>
                </div>

                {/* Lower Hardboard Strip and Bed Platen */}
                <div className="w-full flex flex-col items-center">
                  <div className="w-8 h-2 bg-amber-700 rounded-xs shadow-xs border border-amber-900"></div>
                  <div className="w-48 h-6 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-800 dark:bg-slate-800 rounded-b shadow-lg border border-slate-600 dark:border-slate-700 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-slate-300">Stahl-Druckplatte (DIN EN 12390-4)</span>
                  </div>
                </div>
              </div>

              {/* Stress Chart & Numerical Display (7 cols) */}
              <div className="md:col-span-7 flex flex-col justify-between">
                
                {/* Real-time Display Cards */}
                <div className="grid grid-cols-3 gap-2.5 mb-2.5">
                  <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-inner">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Spaltkraft F</span>
                    <span className="text-lg font-mono font-bold text-amber-400">
                      {formatDeZahl(currentForceKN, 1)} <span className="text-xs text-slate-300 font-normal">kN</span>
                    </span>
                  </div>

                  <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-inner">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Spaltzugspannung σx</span>
                    <span className="text-lg font-mono font-bold text-emerald-400">
                      {formatDeZahl(currentStressMPa, 2)} <span className="text-xs text-slate-300 font-normal">MPa</span>
                    </span>
                  </div>

                  <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-inner">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Stauchung Δd</span>
                    <span className="text-lg font-mono font-bold text-cyan-400">
                      {formatDeZahl(currentDeformationMm, 3)} <span className="text-xs text-slate-300 font-normal">mm</span>
                    </span>
                  </div>
                </div>

                {/* Chart Mode Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button aria-pressed={chartMode === 'stress'}
                      onClick={() => setChartMode('stress')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        chartMode === 'stress'
                          ? 'bg-shiraz text-white shadow-xs'
                          : 'bg-white text-text-main/80 border border-home-grau/30 hover:bg-slate-100'
                      }`}
                    >
                      Spaltspannung (σx – Δd)
                    </button>
                    <button aria-pressed={chartMode === 'force'}
                      onClick={() => setChartMode('force')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        chartMode === 'force'
                          ? 'bg-shiraz text-white shadow-xs'
                          : 'bg-white text-text-main/80 border border-home-grau/30 hover:bg-slate-100'
                      }`}
                    >
                      Last-Verformung (F – Δd)
                    </button>
                    <button
                      onClick={() => setShowGrid(!showGrid)}
                      className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                        showGrid
                          ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                          : 'bg-white text-text-main/70 border-home-grau/30 hover:bg-slate-100'
                      }`}
                      title="Gitterlinien ein- oder ausblenden"
                    >
                      {showGrid ? 'Gitter: Ein' : 'Gitter: Aus'}
                    </button>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    DIN EN 12390-6
                  </span>
                </div>

                {/* Stress / Force Chart */}
                <div className="w-full h-[240px] bg-off-white rounded-xl p-2.5 border border-home-grau/25 relative shadow-xs">
                  <Line
                    data={{
                      datasets: [
                        {
                          label: chartMode === 'stress' ? 'Spaltzugspannung σx' : 'Last-Verformungskurve F-Δd',
                          data: displayChartData,
                          borderColor: '#A3113E',
                          backgroundColor: 'rgba(163, 17, 62, 0.08)',
                          borderWidth: 2.8,
                          pointRadius: 0,
                          fill: true,
                          tension: 0.05
                        }
                      ]
                    }}
                    options={chartOptions}
                  />
                  {testStatus === 'idle' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[1px] rounded-xl text-text-main/70">
                      <p className="text-xs font-bold">Klicken Sie auf &quot;Spaltversuch Starten&quot;</p>
                      <p className="text-[10px] text-text-main/50">Ermittelt Querzugspannung nach Formel von Timoshenko</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Test Summary & Norm Relations */}
            {testStatus === 'finished' && (
              <div className="mt-2 p-4 bg-off-white rounded-xl border border-home-grau/30 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-text-main/60 uppercase text-[10px] font-bold block">Spaltzugfestigkeit fct,sp</span>
                    <strong className="text-base text-shiraz font-mono">{formatDeZahl(currentStressMPa, 2)} MPa</strong>
                  </div>
                  <div>
                    <span className="text-text-main/60 uppercase text-[10px] font-bold block">Zentrische Zugfestigkeit fct (≈ 0,9·fct,sp)</span>
                    <strong className="text-base text-emerald-700 font-mono">{formatDeZahl((currentStressMPa * 0.9), 2)} MPa</strong>
                  </div>
                  <div>
                    <span className="text-text-main/60 uppercase text-[10px] font-bold block">Bruchlast Fmax</span>
                    <strong className="text-base text-text-main font-mono">{formatDeZahl(currentForceKN, 1)} kN</strong>
                  </div>
                  <div>
                    <span className="text-text-main/60 uppercase text-[10px] font-bold block">Verhältnis fct,sp / fck</span>
                    <strong className="text-base text-text-main font-mono">{formatDeZahl(((currentStressMPa / gradeProps.fck) * 100), 1)} %</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-home-grau/20 gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-text-main">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span>Simulierter Spaltzugversuch nach DIN EN 12390-6 abgeschlossen.</span>
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
                        const rows = testData.map(d => [d.x.toFixed(2), d.y.toFixed(3)]);
                        exportToCSV(`Spaltzug_${grade}`, ['Fortschritt_Prozent', 'Spaltspannung_MPa'], rows);
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
    </div>
  );
}
