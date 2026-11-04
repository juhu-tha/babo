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
import { AuswahlGruppe, alsOption } from '../ui/Auswahlgruppe';
import { Fz } from '../ui/Formelzeichen';
import { hoechstwert, spaltkraft } from '@/src/calc/laborVersuch';
import { useDiagrammFarben, linAchse, PfeilDefs } from './laborGrafik';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

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

  // Ergebnis aus dem Höchstwert der aufgezeichneten Kurve (nach dem Spalten fällt die Kraft auf 0)
  const spitze = useMemo(() => hoechstwert(testData), [testData]);
  const fctsp = spitze.y;
  const fMaxKN = spaltkraft(spitze.y, diameter, length);

  // Archive protocol
  const handleArchive = () => {
    if (testStatus !== 'finished') return;

    const validation = validateMechanicalTestIntegrity(
      'beton',
      'zug',
      fctsp,
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
        'Spaltzugfestigkeit f_ct,sp (N/mm²)': formatDeZahl(fctsp, 2),
        'Zentrische Zugfestigkeit f_ct ≈ 0,9·f_ct,sp (N/mm²)': formatDeZahl((fctsp * 0.9), 2),
        'Bruchlast F_max (kN)': formatDeZahl(fMaxKN, 1),
        'Weg bei F_max Δd (mm)': formatDeZahl(spitze.x, 3),
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

  const farben = useDiagrammFarben();
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: linAchse(farben, 'Weg Δd in mm', maxDeformationMm * 1.05, showGrid),
      y: linAchse(farben, chartMode === 'stress' ? 'σₓ in N/mm²' : 'F in kN', chartMode === 'stress' ? gradeProps.fctsp * 1.1 : maxForceKN * 1.1, showGrid),
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items: TooltipItem<'line'>[]) => `Weg Δd = ${formatDeZahl(Number(items[0].parsed.x), 3)} mm`,
          label: (ctx: TooltipItem<'line'>) => chartMode === 'stress'
            ? `Spaltzugspannung: ${formatDeZahl(Number(ctx.parsed.y), 2)} N/mm²`
            : `Prüfkraft F: ${formatDeZahl(Number(ctx.parsed.y), 1)} kN`
        }
      }
    }
  };

  // Querschnitt im Maßstab 1 px = 1 mm (d = 150 mm → r = 75); Hartfaserstreifen b × 4 mm oben und unten
  const rZyl = 75;
  const cx = 120;
  const cy = 135;
  const gebrochen = crackOpeningMm > 0;
  const rigLabel = `Querschnitt des Zylinders Ø ${formatDeWert(diameter)} mm zwischen oberer und unterer Druckplatte; Last über Hartfaserstreifen ${formatDeWert(stripWidth)} × 4 mm entlang der Lastebene. `
    + (testStatus === 'idle' ? 'Versuch noch nicht gestartet.' : gebrochen ? `Spaltriss in der Lastebene; Höchstkraft ${formatDeZahl(fMaxKN, 1)} kN.` : `Aktuelle Kraft ${formatDeZahl(currentForceKN, 1)} kN, Querzugspannung σx wirkt rechtwinklig zur Lastebene.`);

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
              
              {/* Prüfeinrichtung im Querschnitt (DIN EN 12390-6) */}
              <figure className="pruefgeraet md:col-span-5 p-3 rounded-xl border flex flex-col items-center justify-center gap-2 m-0">
                <svg viewBox="0 0 240 290" className="w-full max-w-[320px] h-auto select-none" role="img" aria-label={rigLabel}>
                  <title>{rigLabel}</title>
                  <PfeilDefs praefix="spz" />
                  <defs>
                    <clipPath id="spz-zylinder"><circle cx={cx} cy={cy} r={rZyl} /></clipPath>
                  </defs>

                  {/* Kraft F mit Pfeil auf die obere Druckplatte */}
                  <text x={cx - 8} y="16" textAnchor="end" fontSize="12" fontWeight="bold" fill="var(--pg-akzent)">
                    {testStatus === 'finished'
                      ? <>F<tspan fontSize="9" dy="3">max</tspan><tspan dy="-3"> = {formatDeZahl(fMaxKN, 1)} kN</tspan></>
                      : `F = ${formatDeZahl(currentForceKN, 1)} kN`}
                  </text>
                  <line x1={cx} y1="4" x2={cx} y2="34" stroke="var(--pg-akzent)" strokeWidth="2.5" markerEnd="url(#spz-pfeil)" />

                  {/* obere Druckplatte */}
                  <rect x="30" y="36" width="180" height="20" rx="2" fill="var(--pg-stahl)" stroke="var(--pg-kontur)" strokeWidth="1.5" />
                  <text x="66" y="50" textAnchor="middle" fontSize="11" fill="var(--pg-text)">Druckplatte</text>
                  {/* Hartfaserstreifen oben */}
                  <rect x={cx - stripWidth / 2} y="56" width={stripWidth} height="4" fill="var(--pg-hartfaser)" stroke="var(--pg-hartfaser-rand)" strokeWidth="0.8" />

                  {/* Zylinder (Beton mit Gesteinskörnung) */}
                  <g clipPath="url(#spz-zylinder)">
                    <circle cx={cx} cy={cy} r={rZyl} fill="var(--pg-beton)" />
                    {[[88, 112, 7], [150, 104, 9], [112, 170, 8], [160, 158, 6], [80, 152, 10], [134, 86, 7], [98, 82, 5], [170, 128, 5], [72, 122, 6], [140, 190, 6]].map(([x, y, r], i) => (
                      <circle key={i} cx={x} cy={y} r={r} fill="var(--pg-beton2)" stroke="var(--pg-korn)" strokeWidth="0.6" />
                    ))}
                    {/* Spaltriss in der Lastebene */}
                    {gebrochen && (
                      <path d={`M ${cx} ${cy - rZyl} L ${cx - 2} ${cy - 50} L ${cx + 2} ${cy - 25} L ${cx - 1.5} ${cy} L ${cx + 2} ${cy + 25} L ${cx - 2} ${cy + 50} L ${cx} ${cy + rZyl}`}
                        stroke="var(--pg-riss)" strokeWidth={1.5 + crackOpeningMm * 1.6} strokeLinejoin="round" fill="none" />
                    )}
                  </g>
                  <circle cx={cx} cy={cy} r={rZyl} fill="none" stroke="var(--pg-kontur)" strokeWidth="2" />

                  {/* Lastebene (gestrichelt) */}
                  {!gebrochen && (
                    <line x1={cx} y1={cy - rZyl} x2={cx} y2={cy + rZyl} stroke="var(--pg-akzent)" strokeWidth="1" strokeDasharray="4 3" />
                  )}

                  {/* Querzugspannung σx rechtwinklig zur Lastebene */}
                  <g opacity={testStatus === 'idle' ? 0.4 : Math.max(0.4, Math.min(1, progress / 60))}>
                    <line x1={cx + 6} y1={cy} x2={cx + 40} y2={cy} stroke="var(--pg-akzent)" strokeWidth="2" markerEnd="url(#spz-pfeil)" />
                    <line x1={cx - 6} y1={cy} x2={cx - 40} y2={cy} stroke="var(--pg-akzent)" strokeWidth="2" markerEnd="url(#spz-pfeil)" />
                    <line x1={cx + 6} y1={cy - 34} x2={cx + 30} y2={cy - 34} stroke="var(--pg-akzent)" strokeWidth="1.5" markerEnd="url(#spz-pfeil)" />
                    <line x1={cx - 6} y1={cy - 34} x2={cx - 30} y2={cy - 34} stroke="var(--pg-akzent)" strokeWidth="1.5" markerEnd="url(#spz-pfeil)" />
                    <line x1={cx + 6} y1={cy + 34} x2={cx + 30} y2={cy + 34} stroke="var(--pg-akzent)" strokeWidth="1.5" markerEnd="url(#spz-pfeil)" />
                    <line x1={cx - 6} y1={cy + 34} x2={cx - 30} y2={cy + 34} stroke="var(--pg-akzent)" strokeWidth="1.5" markerEnd="url(#spz-pfeil)" />
                  </g>
                  <rect x={cx + 9} y={cy - 24} width="56" height="17" rx="3" fill="var(--pg-anzeige)" stroke="var(--pg-akzent)" strokeWidth="0.6" />
                  <text x={cx + 13} y={cy - 12} fontSize="11" fontWeight="bold" fill="var(--pg-akzent)">σ<tspan fontSize="9" dy="3">x</tspan><tspan dy="-3"> (Zug)</tspan></text>

                  {/* Hartfaserstreifen unten und untere Druckplatte */}
                  <rect x={cx - stripWidth / 2} y={cy + rZyl} width={stripWidth} height="4" fill="var(--pg-hartfaser)" stroke="var(--pg-hartfaser-rand)" strokeWidth="0.8" />
                  <rect x="30" y={cy + rZyl + 4} width="180" height="20" rx="2" fill="var(--pg-stahl)" stroke="var(--pg-kontur)" strokeWidth="1.5" />
                  <text x="66" y={cy + rZyl + 18} textAnchor="middle" fontSize="11" fill="var(--pg-text)">Druckplatte</text>

                  {/* Legende */}
                  <rect x="22" y="250" width="15" height="5" fill="var(--pg-hartfaser)" stroke="var(--pg-hartfaser-rand)" strokeWidth="0.8" />
                  <text x="44" y="256" fontSize="11" fill="var(--pg-text)">Hartfaserstreifen {formatDeWert(stripWidth)} × 4 mm</text>
                  {gebrochen ? (
                    <line x1="22" y1="274" x2="37" y2="274" stroke="var(--pg-riss)" strokeWidth="3" />
                  ) : (
                    <line x1="22" y1="274" x2="37" y2="274" stroke="var(--pg-akzent)" strokeWidth="1" strokeDasharray="4 3" />
                  )}
                  <text x="44" y="278" fontSize="11" fill="var(--pg-text)">{gebrochen ? 'Spaltriss in der Lastebene' : 'Lastebene (Linienlast)'}</text>
                </svg>
                <figcaption className="text-[11px] text-center leading-snug" style={{ color: 'var(--pg-text2)' }}>
                  Querschnitt, Maßstab in mm · Druckplatten nach DIN EN 12390-4
                </figcaption>
              </figure>

              {/* Stress Chart & Numerical Display (7 cols) */}
              <div className="md:col-span-7 flex flex-col justify-between">
                
                {/* Real-time Display Cards */}
                <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-2.5 mb-2.5">
                  <div className="bg-off-white text-text-main p-3 rounded-xl border border-home-grau/30 shadow-inner">
                    <span className="text-[11px] font-mono text-slate-600 font-bold uppercase tracking-wider block">Spaltkraft <Fz>F</Fz></span>
                    <span className="text-lg font-mono font-bold text-amber-700">
                      {formatDeZahl(currentForceKN, 1)} <span className="text-xs text-slate-700 font-normal">kN</span>
                    </span>
                  </div>

                  <div className="bg-off-white text-text-main p-3 rounded-xl border border-home-grau/30 shadow-inner">
                    <span className="text-[11px] font-mono text-slate-600 font-bold uppercase tracking-wider block">Spaltzug&shy;spannung <Fz idx="x">σ</Fz></span>
                    <span className="text-lg font-mono font-bold text-emerald-700">
                      {formatDeZahl(currentStressMPa, 2)} <span className="text-xs text-slate-700 font-normal">N/mm²</span>
                    </span>
                  </div>

                  <div className="bg-off-white text-text-main p-3 rounded-xl border border-home-grau/30 shadow-inner">
                    <span className="text-[11px] font-mono text-slate-600 font-bold uppercase tracking-wider block">Weg <Fz>Δd</Fz></span>
                    <span className="text-lg font-mono font-bold text-cyan-700">
                      {formatDeZahl(currentDeformationMm, 3)} <span className="text-xs text-slate-700 font-normal">mm</span>
                    </span>
                  </div>
                </div>

                {/* Chart Mode Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <AuswahlGruppe label="Diagrammdarstellung" className="flex flex-wrap items-center gap-1.5">
                    <button {...alsOption(chartMode === 'stress')}
                      onClick={() => setChartMode('stress')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        chartMode === 'stress'
                          ? 'bg-shiraz text-white shadow-xs'
                          : 'bg-white text-text-main/80 border border-home-grau/30 hover:bg-slate-100'
                      }`}
                    >
                      Spaltspannung (σₓ – Δd)
                    </button>
                    <button {...alsOption(chartMode === 'force')}
                      onClick={() => setChartMode('force')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        chartMode === 'force'
                          ? 'bg-shiraz text-white shadow-xs'
                          : 'bg-white text-text-main/80 border border-home-grau/30 hover:bg-slate-100'
                      }`}
                    >
                      Last-Verformung (F – Δd)
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

            <ErgebnisAnsage text={testStatus === 'finished' ? kurzzeile(ansageWert('Spaltzugfestigkeit', fctsp, 2, 'N/mm²'), ansageWert('Höchstkraft', fMaxKN, 1, 'kN')) : ''} />
            {/* Test Summary & Norm Relations */}
            {testStatus === 'finished' && (
              <div className="mt-2 p-4 bg-off-white rounded-xl border border-home-grau/30 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-text-main/60 uppercase text-[11px] font-bold block">Spaltzug&shy;festigkeit <Fz idx="ct,sp">f</Fz></span>
                    <strong className="text-base text-shiraz font-mono">{formatDeZahl(fctsp, 2)} N/mm²</strong>
                  </div>
                  <div>
                    <span className="text-text-main/60 uppercase text-[11px] font-bold block">Zentrische Zugfestigkeit <Fz><>f<sub>ct</sub> ≈ 0,9 · f<sub>ct,sp</sub></></Fz></span>
                    <strong className="text-base text-emerald-700 font-mono">{formatDeZahl((fctsp * 0.9), 2)} N/mm²</strong>
                  </div>
                  <div>
                    <span className="text-text-main/60 uppercase text-[11px] font-bold block">Bruchlast <Fz idx="max">F</Fz></span>
                    <strong className="text-base text-text-main font-mono">{formatDeZahl(fMaxKN, 1)} kN</strong>
                  </div>
                  <div>
                    <span className="text-text-main/60 uppercase text-[11px] font-bold block">Verhältnis <Fz><>f<sub>ct,sp</sub> / f<sub>ck</sub></></Fz></span>
                    <strong className="text-base text-text-main font-mono">{formatDeZahl(((fctsp / gradeProps.fck) * 100), 1)} %</strong>
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
                        // CSV: keine Zahl → leeres Feld statt „NaN“ (Prüfung „Kein Ergebnis in der Anzeige“ 02.11.2026)
                        const csv = (v: number, n: number) => (Number.isFinite(v) ? v.toFixed(n) : '');
                        const rows = testData.map(d => [csv(d.x, 4), csv(d.y, 3), csv(spaltkraft(d.y, diameter, length), 2)]);
                        exportToCSV(`Spaltzug_${grade}`, ['Weg_mm', 'Spaltzugspannung_N_mm2', 'Kraft_kN'], rows);
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
