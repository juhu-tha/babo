import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  RotateCcw,
  Activity,
  Check,
  Download,
  FileText,
  Info,
  ArrowUpFromLine,
  Disc
} from 'lucide-react';
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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { validateMechanicalTestIntegrity, exportToCSV, LabProtocolRecord } from '@/src/utils/labExportUtils';
import { saveStoredLabProtocol } from '@/src/utils/studyStorage';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export type SubstrateSystem =
  | 'pcc_gestrahlt'
  | 'os8_parkdeck'
  | 'pcc_schlaemme_mangel'
  | 'estrich_haftbruecke'
  | 'fliesen_flexkleber'
  | 'klebefehler_stempel';

export type StubDiameter = 50 | 20 | 100;

export default function HaftzugPruefung({ onNavigateToProtocols }: { onNavigateToProtocols?: () => void }) {
  const [substrateSystem, setSubstrateSystem] = useState<SubstrateSystem>('pcc_gestrahlt');
  const [stubDiameter, setStubDiameter] = useState<StubDiameter>(50); // mm
  const [drillDepthMm, setDrillDepthMm] = useState<number>(15); // mm
  const [loadingRate, setLoadingRate] = useState<number>(100); // N/s (0.05 MPa/s bei 50 mm)

  // Simulation test state
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [progress, setProgress] = useState(0); // 0 - 100
  const [currentForceKN, setCurrentForceKN] = useState(0);
  const [currentDisplacementMm, setCurrentDisplacementMm] = useState(0);
  const [currentStressMPa, setCurrentStressMPa] = useState(0);
  const [isDetached, setIsDetached] = useState(false);

  const [curveData, setCurveData] = useState<{ x: number; y: number }[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [chartMode, setChartMode] = useState<'stress' | 'force'>('stress');
  const [showGrid, setShowGrid] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearCurrentInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Cross-sectional Area A = π * (d/2)² = π * d² / 4 in mm²
  const stubArea = useMemo(() => {
    return (Math.PI * Math.pow(stubDiameter, 2)) / 4;
  }, [stubDiameter]);

  // Substrate & Instandsetzungssystem definitions
  const systemConfig = useMemo(() => {
    switch (substrateSystem) {
      case 'pcc_gestrahlt':
        return {
          title: 'PCC-Mörtel (Klasse R4) auf kugelgestrahltem Altbeton C30/37',
          norm: 'DIN EN 1542 / DIN EN 1504-3',
          nominalStrength: 2.15, // MPa
          stiffness: 14.0, // relative elasticity
          fractureType: 'Bruchtyp A',
          fractureShare: '100% Bruch im Betonuntergrund (Kohäsionsbruch)',
          concreteShare: 100,
          interfaceShare: 0,
          mortarShare: 0,
          glueShare: 0,
          validTest: true,
          compliantTR: true,
          desc: 'Optimal vorbereiteter Untergrund: Kugelstrahlen hat Zementschlämme restlos entfernt und Zuschlagskörner freigelegt. Die Verbundfestigkeit übersteigt die Betonzugfestigkeit, der Bruch erfolgt im Altbeton.',
          layerSubstrateName: 'Altbeton C30/37 (gestrahlt)',
          layerTopName: 'PCC-Reprofilierungsmörtel (15 mm)'
        };
      case 'os8_parkdeck':
        return {
          title: 'Epoxidharz-OS-8-Beschichtung auf gefrästem Beton',
          norm: 'DIN EN 1542 / TR Instandhaltung',
          nominalStrength: 2.45,
          stiffness: 18.0,
          fractureType: 'Bruchtyp A',
          fractureShare: '90% Betonuntergrund, 10% Grenzfläche',
          concreteShare: 90,
          interfaceShare: 10,
          mortarShare: 0,
          glueShare: 0,
          validTest: true,
          compliantTR: true,
          desc: 'Hervorragende Adhäsion der EP-Grundierung mit Quarzsandabstreuung. Die Zugspannung führt zum Ausbruch von Betonbrocken aus der tragenden Deckenplatte.',
          layerSubstrateName: 'Stahlbeton-Fahrbahnplatte',
          layerTopName: 'OS 8 Epoxidharzbelag (3 mm)'
        };
      case 'pcc_schlaemme_mangel':
        return {
          title: 'PCC-Mörtel auf unvorbereitetem Altbeton (Zementschlämme vorhanden)',
          norm: 'DIN EN 1542 (Fehlstelle)',
          nominalStrength: 0.52,
          stiffness: 8.5,
          fractureType: 'Bruchtyp A/B',
          fractureShare: '100% Adhäsionsbruch in der Kontaktfuge',
          concreteShare: 0,
          interfaceShare: 100,
          mortarShare: 0,
          glueShare: 0,
          validTest: true,
          compliantTR: false,
          desc: 'Typischer Ausführungsfehler: Zementschlämme wurde vor dem Auftrag nicht mechanisch abgetragen. Der Reparaturmörtel löst sich glatt und ohne Betonausbruch von der Kontaktzone ab. Der Richtwert von 1,5 N/mm² (Mittelwert) wird deutlich verfehlt.',
          layerSubstrateName: 'Altbeton (ungestrahlt / trennmittelbehaftet)',
          layerTopName: 'PCC-Instandsetzungsmörtel'
        };
      case 'estrich_haftbruecke':
        return {
          title: 'Verbundestrich CT-C25-F4 auf Rohbetondecke mit Haftschlämme',
          norm: 'DIN EN 13892-8 / DIN 18560',
          nominalStrength: 1.48,
          stiffness: 11.0,
          fractureType: 'Bruchtyp B',
          fractureShare: '80% im Estrichgefüge, 20% Verbundfuge',
          concreteShare: 0,
          interfaceShare: 20,
          mortarShare: 80,
          glueShare: 0,
          validTest: true,
          compliantTR: true,
          desc: 'Normgerechte Verbundestrich-Prüfung: Ausbruch erfolgt überwiegend innerhalb des Zementestrichs oberhalb der Haftbrücke. Die geforderte Haftzugfestigkeit legt die Planung fest (Haftzugfestigkeitsklasse B nach DIN EN 13813); der Bruch im Estrich zeigt einen tragfähigen Verbund.',
          layerSubstrateName: 'Beton-Rohdecke',
          layerTopName: 'Zementestrich CT (35 mm)'
        };
      case 'fliesen_flexkleber':
        return {
          title: 'Feinsteinzeugfliese mit Flexmörtel C2TE S1 auf Calciumsulfatestrich',
          norm: 'DIN EN 12004-2 / DIN EN 1015-12',
          nominalStrength: 1.15,
          stiffness: 12.0,
          fractureType: 'Bruchtyp A/B',
          fractureShare: '70% Fliesenkleber/Estrich-Grenzfläche, 30% Kleberbett',
          concreteShare: 0,
          interfaceShare: 70,
          mortarShare: 30,
          glueShare: 0,
          validTest: true,
          compliantTR: true,
          desc: 'Prüfung des Fliesenverbunds. Der Wert liegt über der Mindesthaftzugfestigkeit von 1,0 N/mm² für C2-Mörtel (gilt für die Laborprüfung auf Betonplatte nach DIN EN 12004-2). Auf Calciumsulfatestrich ist eine Grundierung erforderlich.',
          layerSubstrateName: 'Anhydritestrich CA (grundiert)',
          layerTopName: 'Flexkleber + Feinsteinzeug'
        };
      case 'klebefehler_stempel':
        return {
          title: 'Fehlversuch: Montagekleberversagen am Prüfstempel (Epoxidkleber unvollständig)',
          norm: 'DIN EN 1542 (Bruch in der Klebefuge – ungültig)',
          nominalStrength: 0.88,
          stiffness: 9.0,
          fractureType: 'Bruchtyp Y',
          fractureShare: '100% Abriss in der Klebefuge Prüfstempel / Probekörper',
          concreteShare: 0,
          interfaceShare: 0,
          mortarShare: 0,
          glueShare: 100,
          validTest: false,
          compliantTR: false,
          desc: 'Achtung: Der Stempel hat sich vom Probekörper gelöst, bevor das Bauteil versagen konnte (z. B. Mischfehler beim 2K-Kleber oder mangelnde Wartezeit). Liegt der Wert unter der Anforderung, ist der Versuch ungültig und mit neu geklebtem Stempel zu wiederholen.',
          layerSubstrateName: 'Betonuntergrund',
          layerTopName: 'PCC-Reprofilierung (unbeschädigt)'
        };
    }
  }, [substrateSystem]);

  // Calculate maximum peak force in kN
  const peakForceKN = useMemo(() => {
    return (systemConfig.nominalStrength * stubArea) / 1000;
  }, [systemConfig, stubArea]);

  // Max displacement in mm
  const maxDisplacementMm = useMemo(() => {
    return 0.15 + (systemConfig.nominalStrength / 1.5) * 0.12;
  }, [systemConfig]);

  // Run the virtual test
  const runTest = () => {
    if (testStatus === 'running') return;

    setTestStatus('running');
    setProgress(0);
    setCurveData([]);
    setIsDetached(false);
    setSavedSuccess(false);

    const steps = 70;
    const targetData: { x: number; y: number; forceKN: number; stressMPa: number }[] = [];

    for (let i = 0; i <= steps; i++) {
      const frac = i / steps;
      const disp = frac * maxDisplacementMm;
      let stress = 0;

      if (frac <= 0.88) {
        // Linearelastic loading phase: stress increases linearly with displacement
        stress = (frac / 0.88) * systemConfig.nominalStrength * 0.96;
      } else if (frac <= 0.96) {
        // Micro-cracking before detachment
        const microFrac = (frac - 0.88) / 0.08;
        stress = systemConfig.nominalStrength * (0.96 + 0.04 * Math.sin(microFrac * Math.PI * 0.5));
      } else if (frac <= 0.99) {
        // Sudden drop upon failure
        const dropFrac = (frac - 0.96) / 0.03;
        stress = systemConfig.nominalStrength * Math.max(0, 1 - dropFrac * 2.8);
      } else {
        stress = 0;
      }

      const force = (stress * stubArea) / 1000;
      targetData.push({
        x: Number(disp.toFixed(4)),
        y: Number((chartMode === 'stress' ? stress : force).toFixed(3)),
        forceKN: Number(force.toFixed(3)),
        stressMPa: Number(stress.toFixed(3))
      });
    }

    let currentStep = 0;
    clearCurrentInterval();
    intervalRef.current = setInterval(() => {
      if (currentStep < targetData.length) {
        const pt = targetData[currentStep];
        setCurveData(targetData.slice(0, currentStep + 1).map(d => ({ x: d.x, y: d.y })));
        const prog = (currentStep / steps) * 100;
        setProgress(prog);

        setCurrentForceKN(pt.forceKN);
        setCurrentDisplacementMm(pt.x);
        setCurrentStressMPa(pt.stressMPa);

        if (prog >= 96) {
          setIsDetached(true);
        }

        currentStep++;
      } else {
        clearCurrentInterval();
        setTestStatus('finished');
        setProgress(100);
      }
    }, 40);
  };

  const handleReset = () => {
    clearCurrentInterval();
    setTestStatus('idle');
    setProgress(0);
    setCurveData([]);
    setCurrentForceKN(0);
    setCurrentDisplacementMm(0);
    setCurrentStressMPa(0);
    setIsDetached(false);
    setSavedSuccess(false);
  };

  useEffect(() => {
    handleReset();
  }, [substrateSystem, stubDiameter, drillDepthMm, chartMode]);

  useEffect(() => {
    return () => clearCurrentInterval();
  }, []);

  // Observed peak metrics
  const maxStressObserved = useMemo(() => {
    if (curveData.length === 0) return 0;
    if (chartMode === 'stress') {
      return Math.max(...curveData.map(d => d.y), 0);
    }
    return (Math.max(...curveData.map(d => d.y), 0) * 1000) / stubArea;
  }, [curveData, chartMode, stubArea]);

  const maxForceObserved = useMemo(() => {
    return (maxStressObserved * stubArea) / 1000;
  }, [maxStressObserved, stubArea]);

  // Archive protocol
  const handleArchive = () => {
    if (testStatus !== 'finished') return;

    const validation = validateMechanicalTestIntegrity(
      'beton',
      'haftzug',
      maxStressObserved,
      30.0,
      currentDisplacementMm
    );

    const newRecord: LabProtocolRecord = {
      id: `PROTO-HAFTZUG-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }),
      testTitle: `Haftzugprüfung (Abreißversuch): ${systemConfig.title}`,
      norm: systemConfig.norm,
      operator: 'Haftzug-Prüfstand (Baustoffboard)',
      specimen: {
        material: systemConfig.title,
        geometry: `Kreisrunder Prüfstempel Ø ${stubDiameter} mm mit Ringnut (Bohrtiefe ${formatDeWert(drillDepthMm)} mm)`,
        dimensions: `Stempeldurchmesser d=${stubDiameter} mm, Prüffläche A=${formatDeZahl(stubArea, 1)} mm²`,
        conditioning: 'Trockenbaustelle / Labor 20 °C, 65 % r.F.'
      },
      parameters: {
        'Prüfstempeldurchmesser d': `${stubDiameter} mm`,
        'Prüffläche A': `${formatDeZahl(stubArea, 1)} mm²`,
        'Bohrkerntiefe': `${formatDeWert(drillDepthMm)} mm`,
        'Belastungsrate': `${loadingRate} N/s (ca. ${formatDeZahl((loadingRate / stubArea), 3)} MPa/s)`,
        'Bruchtyp nach DIN EN 1542': systemConfig.fractureType,
        'Bruchbild': systemConfig.fractureShare
      },
      metrics: {
        'Haftzugfestigkeit fh (MPa)': formatDeZahl(maxStressObserved, 2),
        'Abreißkraft Fmax (kN)': formatDeZahl(maxForceObserved, 2),
        'Max. Stempelabhebung (mm)': formatDeZahl(currentDisplacementMm, 3),
        'Anforderungswert des Systems (Einzelversuch)': systemConfig.compliantTR ? 'Erfüllt' : 'Nicht erfüllt',
        'Prüfstatus': systemConfig.validTest ? 'Gültiger Versuch' : 'Ungültig (Kleberversagen)'
      },
      status: systemConfig.validTest ? validation.status : 'Ungültig',
      validationNotes: [
        ...validation.notes,
        `Bruchcharakteristik: ${systemConfig.fractureShare}.`,
        systemConfig.validTest
          ? (systemConfig.compliantTR ? 'Anforderungswert des gewählten Systems eingehalten (Einzelversuch – die Bewertung erfolgt über Mittelwert und kleinsten Einzelwert einer Prüfserie).' : 'Anforderungswert des gewählten Systems verfehlt.')
          : 'Fehlprüfung nach DIN EN 1542: Klebefuge am Stempel versagt (Bruchbild Y) – Versuch wiederholen.'
      ],
      integrityHash: validation.hash,
      dataPointsCount: curveData.length
    };

    saveStoredLabProtocol(newRecord);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'Stempelabhebung / Mikrodehnung ΔL (mm)',
          font: { weight: 'bold' as const, size: 12 }
        },
        min: 0,
        max: maxDisplacementMm * 1.15,
        grid: { display: showGrid, color: 'rgba(0,0,0,0.06)' }
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: chartMode === 'stress' ? 'Haftzugspannung σ (MPa = N/mm²)' : 'Zugkraft F (kN)',
          font: { weight: 'bold' as const, size: 12 }
        },
        min: 0,
        max: chartMode === 'stress'
          ? Math.max(systemConfig.nominalStrength * 1.25, 3.0)
          : Math.max(peakForceKN * 1.25, 5.0),
        grid: { display: showGrid, color: 'rgba(0,0,0,0.06)' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items: any[]) => `Abhebung ΔL = ${formatDeZahl(Number(items[0].parsed.x), 3)} mm`,
          label: (ctx: any) => chartMode === 'stress'
            ? `Haftzugspannung: ${formatDeZahl(Number(ctx.parsed.y), 2)} MPa`
            : `Zugkraft: ${formatDeZahl(Number(ctx.parsed.y), 2)} kN`
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
                <ArrowUpFromLine size={18} className="text-shiraz" /> 1. Untergrund &amp; Prüfstempel
              </h3>
              <span className="text-[11px] font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full">
                DIN EN 1542
              </span>
            </div>

            {/* System Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-main uppercase tracking-wider">
                Instandsetzungs- &amp; Verbundsystem
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { id: 'pcc_gestrahlt', label: 'PCC auf kugelgestrahltem Beton', sub: 'Bruchtyp A (Sollzustand)' },
                  { id: 'os8_parkdeck', label: 'OS-8 Epoxidharzbelag (Parkhaus)', sub: 'Bruchtyp A (Hochfest)' },
                  { id: 'pcc_schlaemme_mangel', label: 'PCC auf Zementschlämme (Mangel)', sub: 'Bruchtyp A/B (Ablösung)' },
                  { id: 'estrich_haftbruecke', label: 'Verbundestrich CT mit Haftbrücke', sub: 'Bruchtyp B (Estrichversagen)' },
                  { id: 'fliesen_flexkleber', label: 'Fliesenkleber C2TE auf Estrich', sub: 'DIN EN 12004 (Flexverbund)' },
                  { id: 'klebefehler_stempel', label: 'Montagekleberversagen (Fehltest)', sub: 'Bruchtyp Y (Ungültig)' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSubstrateSystem(s.id as SubstrateSystem)}
                    disabled={testStatus === 'running'}
                    className={`py-2 px-3 text-xs rounded-xl border transition-all cursor-pointer flex justify-between items-center text-left ${
                      substrateSystem === s.id
                        ? 'bg-shiraz/15 text-shiraz border-shiraz font-bold shadow-xs'
                        : 'bg-off-white text-text-main border-home-grau/30 hover:border-shiraz/40 disabled:opacity-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{s.label}</div>
                      <div className="text-[10px] opacity-75 font-normal">{s.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stempeldurchmesser & Ringnut */}
            <div className="space-y-3 pt-2 border-t border-home-grau/20 text-xs">
              <label className="font-bold text-text-main uppercase tracking-wider block">
                Prüfstempel &amp; Kernbohrung
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { d: 50, label: 'Ø 50 mm', sub: 'Standard EN 1542' },
                  { d: 20, label: 'Ø 20 mm', sub: 'Fliesen / Fein' },
                  { d: 100, label: 'Ø 100 mm', sub: 'Grobkorn / Strassenbau' }
                ].map(item => (
                  <button
                    key={item.d}
                    onClick={() => setStubDiameter(item.d as StubDiameter)}
                    disabled={testStatus === 'running'}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-center ${
                      stubDiameter === item.d
                        ? 'bg-shiraz text-white border-shiraz font-bold shadow-xs'
                        : 'bg-off-white text-text-main border-home-grau/30 hover:bg-slate-100 disabled:opacity-50'
                    }`}
                  >
                    <span className="font-mono">{item.label}</span>
                    <span className="text-[9px] opacity-80">{item.sub}</span>
                  </button>
                ))}
              </div>

              {/* Detail Metrics */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-off-white p-2.5 rounded-lg border border-home-grau/20 text-center">
                  <span className="text-text-main/60 text-[10px] block">Prüffläche A</span>
                  <span className="font-mono font-bold text-sm text-text-main">{formatDeZahl(stubArea, 1)} mm²</span>
                </div>
                <div className="bg-off-white p-2.5 rounded-lg border border-home-grau/20 text-center">
                  <span className="text-text-main/60 text-[10px] block">Kernbohrtiefe</span>
                  <span className="font-mono font-bold text-sm text-text-main">{formatDeWert(drillDepthMm)} mm</span>
                </div>
              </div>
            </div>

            {/* Normative Requirements Box */}
            <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl text-xs space-y-1 text-amber-950">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <Info size={14} className="text-amber-700" /> Regel-Richtwerte Betonuntergrund (TR Instandhaltung):
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-900/90">
                <li>Mittelwert <InlineMath math="f_{ctm} \ge 1{,}5\text{ N/mm}^2" /></li>
                <li>Kleinster Einzelwert <InlineMath math="f_{ct,min} \ge 1{,}0\text{ N/mm}^2" /></li>
                <li>Laststeigerung nach DIN EN 1542: <InlineMath math="0{,}05\text{ MPa/s}" /> (bei Ø 50 mm ≈ 100 N/s)</li>
                <li>Objektspezifische Anforderungen (z. B. Estrich, Fliesen) gelten vorrangig.</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-home-grau/20">
              <button
                onClick={runTest}
                disabled={testStatus === 'running'}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Play size={16} /> Abreißversuch Starten
              </button>
              <button
                onClick={handleReset}
                disabled={testStatus === 'idle'}
                className="py-3 px-4 bg-off-white hover:bg-slate-200 text-text-main border border-home-grau/30 rounded-xl font-bold text-sm transition-all cursor-pointer disabled:opacity-50"
                title="Versuch zurücksetzen"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Simulation & Measurement Graphics (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full">
            
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-home-grau/20 gap-3">
              <div>
                <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                  <ArrowUpFromLine size={18} className="text-shiraz" /> 2. Abreißversuch &amp; Schichtgefüge
                </h3>
                <p className="text-xs text-text-main/70">{systemConfig.title}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                testStatus === 'idle' ? 'bg-slate-100 text-slate-700' :
                testStatus === 'running' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                systemConfig.validTest && systemConfig.compliantTR ? 'bg-emerald-100 text-emerald-800' :
                'bg-rose-100 text-rose-800'
              }`}>
                {testStatus === 'idle' ? 'Bereit zur Prüfung' :
                 testStatus === 'running' ? 'Zuglaststeigerung...' :
                 systemConfig.validTest ? (systemConfig.compliantTR ? 'Bestanden (≥ 1,5 MPa)' : 'Kriterium verfehlt') : 'Ungültig (Kleberriss)'}
              </span>
            </div>

            {/* Visual SVG Cross-Section & Apparatus */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-4 flex-1">
              
              {/* SVG Simulator (12 cols) */}
              <div className="md:col-span-12 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 dark:bg-slate-900 p-4 rounded-xl border border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center relative shadow-inner overflow-hidden min-h-[260px]">
                
                <svg width="100%" height="240" viewBox="0 0 600 240" className="overflow-visible select-none">
                  <defs>
                    <linearGradient id="concreteGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#64748b" />
                    </linearGradient>
                    <linearGradient id="mortarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#cbd5e1" />
                      <stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>
                    <linearGradient id="steelStubGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="50%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#334155" />
                    </linearGradient>
                    <pattern id="concretePatt" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="4" cy="4" r="2" fill="#475569" opacity="0.35" />
                      <circle cx="14" cy="12" r="3" fill="#334155" opacity="0.4" />
                      <circle cx="10" cy="18" r="1.5" fill="#1e293b" opacity="0.3" />
                    </pattern>
                  </defs>

                  {/* 1. Base Concrete Substrate (Altbeton) */}
                  <rect x="40" y="140" width="520" height="90" fill="url(#concreteGrad)" rx="4" />
                  <rect x="40" y="140" width="520" height="90" fill="url(#concretePatt)" rx="4" />
                  <text x="50" y="215" fill="#ffffff" fontSize="11" fontWeight="bold" opacity="0.8">
                    {systemConfig.layerSubstrateName}
                  </text>

                  {/* 2. Top Coating / Instandsetzungsmörtel Layer */}
                  <rect x="40" y="110" width="520" height="30" fill={substrateSystem === 'os8_parkdeck' ? '#475569' : 'url(#mortarGrad)'} opacity="0.9" />
                  {/* Interface Line (Verbundfuge) */}
                  <line x1="40" y1="140" x2="560" y2="140" stroke="#64748b" strokeWidth="2" strokeDasharray="3,3" />

                  <text x="50" y="128" fill={substrateSystem === 'os8_parkdeck' ? '#ffffff' : '#1e293b'} fontSize="11" fontWeight="bold">
                    {systemConfig.layerTopName}
                  </text>

                  {/* 3. Core drill circular slot (Kernbohrung-Freischnitt Ringnut) */}
                  {/* Left notch */}
                  <rect x="230" y="105" width="8" height="50" fill="#1e293b" opacity="0.75" />
                  {/* Right notch */}
                  <rect x="362" y="105" width="8" height="50" fill="#1e293b" opacity="0.75" />

                  {/* Dimension marker of drill depth */}
                  <line x1="222" y1="110" x2="222" y2="155" stroke="#A3113E" strokeWidth="1.5" />
                  <line x1="218" y1="110" x2="226" y2="110" stroke="#A3113E" strokeWidth="1.5" />
                  <line x1="218" y1="155" x2="226" y2="155" stroke="#A3113E" strokeWidth="1.5" />
                  <text x="180" y="136" fill="#A3113E" fontSize="10" fontWeight="bold">
                    t = {formatDeWert(drillDepthMm)} mm
                  </text>

                  {/* 4. Pull-off Cylindrical Core (der freigebohrte Kern) */}
                  {/* Dynamic vertical translation when detached */}
                  <g transform={`translate(0, ${isDetached ? -28 : 0})`} className="transition-transform duration-500 ease-out">
                    
                    {/* Drilled concrete core portion (Unterer Betonkern) */}
                    <rect
                      x="238"
                      y="140"
                      width="124"
                      height="15"
                      fill={isDetached && systemConfig.concreteShare > 50 ? '#64748b' : 'url(#concreteGrad)'}
                    />
                    <rect x="238" y="140" width="124" height="15" fill="url(#concretePatt)" />

                    {/* Drilled top layer portion (Oberer Schichtkern) */}
                    <rect
                      x="238"
                      y="110"
                      width="124"
                      height="30"
                      fill={substrateSystem === 'os8_parkdeck' ? '#475569' : 'url(#mortarGrad)'}
                    />

                    {/* Epoxy adhesive layer (Montagekleber für Prüfstempel) */}
                    <rect x="238" y="106" width="124" height="4" fill="#64748b" stroke="#475569" strokeWidth="0.5" />

                    {/* Steel Pull Stub (Prüfstempel aus Stahl) */}
                    <rect x="238" y="80" width="124" height="26" fill="url(#steelStubGrad)" rx="3" stroke="#334155" strokeWidth="1.5" />
                    
                    {/* Stub Diameter label */}
                    <text x="300" y="97" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Ø {stubDiameter} mm Stempel
                    </text>

                    {/* Pull Lug / Adapter (Zugöse) */}
                    <rect x="286" y="62" width="28" height="18" fill="#475569" rx="2" stroke="#1e293b" />
                    <circle cx="300" cy="71" r="5" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />

                    {/* Pull Rod / Loading shaft */}
                    <line x1="300" y1="62" x2="300" y2="20" stroke="#0f172a" strokeWidth="4" />

                    {/* Tensile Force Vector Arrow */}
                    {testStatus === 'running' && (
                      <g className="animate-bounce">
                        <polygon points="300,5 292,20 308,20" fill="#A3113E" />
                        <text x="318" y="18" fill="#A3113E" fontSize="12" fontWeight="bold">
                          F = {formatDeZahl(currentForceKN, 2)} kN
                        </text>
                      </g>
                    )}

                    {/* Fractured rough edge visual on detachment */}
                    {isDetached && (
                      <path
                        d="M 238,155 Q 260,158 280,153 T 320,157 T 362,154"
                        stroke="#A3113E"
                        strokeWidth="2.5"
                        fill="none"
                      />
                    )}
                  </g>

                  {/* Reaction frame / Testing device legs (Abreißprüfgerät Stützfüße) */}
                  <g opacity="0.85">
                    {/* Left foot */}
                    <rect x="190" y="70" width="16" height="40" fill="#334155" rx="2" />
                    <rect x="182" y="106" width="32" height="4" fill="#1e293b" rx="1" />
                    {/* Right foot */}
                    <rect x="394" y="70" width="16" height="40" fill="#334155" rx="2" />
                    <rect x="386" y="106" width="32" height="4" fill="#1e293b" rx="1" />
                    {/* Upper bridge / load cell box */}
                    <rect x="175" y="45" width="250" height="26" fill="#1e293b" rx="4" stroke="#475569" strokeWidth="1.5" />
                    <text x="300" y="62" fill="#64748b" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                      {testStatus === 'running'
                        ? `KRAFT: ${formatDeZahl(currentForceKN, 2)} kN | ${formatDeZahl((currentStressMPa), 2)} MPa`
                        : testStatus === 'finished'
                        ? `MAX: ${formatDeZahl(maxForceObserved, 2)} kN | ${formatDeZahl(maxStressObserved, 2)} MPa`
                        : 'KRAFTMESSDOSE 10 kN (BEREIT)'}
                    </text>
                  </g>

                  {/* Failure Plane Marker after detachment */}
                  {isDetached && (
                    <g>
                      <rect x="420" y="15" width="170" height="52" fill="#ffffff" rx="8" stroke="#cbd5e1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
                      <text x="430" y="32" fill="#A3113E" fontSize="11" fontWeight="bold">
                        Bruch: {systemConfig.fractureType}
                      </text>
                      <text x="430" y="48" fill="#475569" fontSize="9">
                        {systemConfig.fractureShare}
                      </text>
                      <text x="430" y="60" fill="#0f172a" fontSize="10" fontWeight="bold">
                        f_h = {formatDeZahl(maxStressObserved, 2)} MPa
                      </text>
                    </g>
                  )}
                </svg>

                {/* Progress bar during test */}
                {testStatus === 'running' && (
                  <div className="w-full max-w-md bg-slate-200 h-2 rounded-full overflow-hidden mt-2 border border-slate-300">
                    <div
                      className="bg-shiraz h-full transition-all duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Chart Section (12 cols) */}
              <div className="md:col-span-12 bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-home-grau/20 pb-2">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-shiraz" />
                    <span className="font-bold text-xs text-text-main">
                      {chartMode === 'stress' ? 'Haftzugspannung – Verformungs-Diagramm' : 'Abreißkraft – Verformungs-Diagramm'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="inline-flex rounded-lg border border-home-grau/30 p-0.5 bg-slate-50 text-xs">
                      <button aria-pressed={chartMode === 'stress'}
                        onClick={() => setChartMode('stress')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                          chartMode === 'stress' ? 'bg-shiraz text-white shadow-xs' : 'text-text-main/70 hover:text-text-main'
                        }`}
                      >
                        Spannung (MPa)
                      </button>
                      <button aria-pressed={chartMode === 'force'}
                        onClick={() => setChartMode('force')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                          chartMode === 'force' ? 'bg-shiraz text-white shadow-xs' : 'text-text-main/70 hover:text-text-main'
                        }`}
                      >
                        Zugkraft (kN)
                      </button>
                    </div>

                    <button
                      onClick={() => setShowGrid(!showGrid)}
                      className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                        showGrid
                          ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                          : 'bg-white text-text-main/80 border-home-grau/30 hover:bg-slate-100'
                      }`}
                    >
                      {showGrid ? 'Gitter: Ein' : 'Gitter: Aus'}
                    </button>
                  </div>
                </div>

                <div className="h-56 w-full relative">
                  <Line
                    data={{
                      datasets: [
                        {
                          label: chartMode === 'stress' ? 'Haftzugspannung σ (MPa)' : 'Prüfkraft F (kN)',
                          data: curveData,
                          borderColor: '#A3113E', // Shiraz
                          backgroundColor: 'rgba(139, 21, 56, 0.1)',
                          borderWidth: 2.5,
                          pointRadius: 0,
                          tension: 0.1
                        }
                      ]
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>

              {/* Real-time Telemetry Cards (12 cols) */}
              <div className="md:col-span-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-off-white p-3 rounded-xl border border-home-grau/20">
                  <span className="text-[10px] uppercase font-bold text-text-main/60 block">Aktuelle Zugkraft F</span>
                  <span className="text-xl font-bold font-mono text-text-main">
                    {formatDeZahl(currentForceKN, 2)} <span className="text-xs font-normal">kN</span>
                  </span>
                </div>

                <div className="bg-off-white p-3 rounded-xl border border-home-grau/20">
                  <span className="text-[10px] uppercase font-bold text-text-main/60 block">Haftzugspannung σ</span>
                  <span className="text-xl font-bold font-mono text-shiraz">
                    {formatDeZahl(currentStressMPa, 2)} <span className="text-xs font-normal">MPa</span>
                  </span>
                </div>

                <div className="bg-off-white p-3 rounded-xl border border-home-grau/20">
                  <span className="text-[10px] uppercase font-bold text-text-main/60 block">Höchstwert f_h</span>
                  <span className="text-xl font-bold font-mono text-emerald-700">
                    {formatDeZahl(maxStressObserved, 2)} <span className="text-xs font-normal">N/mm²</span>
                  </span>
                </div>

                <div className="bg-off-white p-3 rounded-xl border border-home-grau/20">
                  <span className="text-[10px] uppercase font-bold text-text-main/60 block">Bruchtyp nach EN 1542</span>
                  <span className="text-sm font-bold font-mono text-text-main block truncate">
                    {testStatus === 'finished' ? systemConfig.fractureType : '–'}
                  </span>
                </div>
              </div>

              {/* Fracture Surface Inspection (Bruchflächen-Analyse des Stempels) */}
              {testStatus === 'finished' && (
                <div className="md:col-span-12 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full border-4 border-slate-700 shadow-md relative overflow-hidden flex items-center justify-center bg-slate-300">
                      {/* Visual representations of fracture shares */}
                      {systemConfig.concreteShare > 0 && (
                        <div
                          className="absolute inset-0 bg-slate-500 opacity-90"
                          style={{ clipPath: `inset(0 0 ${100 - systemConfig.concreteShare}% 0)` }}
                        />
                      )}
                      {systemConfig.interfaceShare > 0 && (
                        <div
                          className="absolute inset-0 bg-amber-400 opacity-90"
                          style={{ clipPath: `inset(${systemConfig.concreteShare}% 0 0 0)` }}
                        />
                      )}
                      {systemConfig.mortarShare > 0 && (
                        <div
                          className="absolute inset-0 bg-slate-400 opacity-90"
                          style={{ clipPath: `inset(${systemConfig.concreteShare + systemConfig.interfaceShare}% 0 0 0)` }}
                        />
                      )}
                      {systemConfig.glueShare > 0 && (
                        <div className="absolute inset-0 bg-amber-500 opacity-95" />
                      )}
                      <Disc size={36} className="text-white/40 absolute" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 mt-1">
                      Stempelunterseite Ø {stubDiameter} mm
                    </span>
                  </div>

                  <div className="flex-1 space-y-1.5 text-xs text-text-main">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-text-main">
                        Bruchflächenanalyse &amp; Beurteilung:
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                        systemConfig.validTest && systemConfig.compliantTR
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {systemConfig.validTest
                          ? (systemConfig.compliantTR ? 'Anforderungswert erfüllt' : 'Haftzugfestigkeit nicht ausreichend')
                          : 'Fehlprüfung (Wiederholung erforderlich)'}
                      </span>
                    </div>

                    <p className="text-text-main/80 leading-relaxed">
                      {systemConfig.desc}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Betonuntergrund (A):</span>
                        <span className="font-bold font-mono">{formatDeWert(systemConfig.concreteShare)} %</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Kontaktfuge (A/B):</span>
                        <span className="font-bold font-mono">{formatDeWert(systemConfig.interfaceShare)} %</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Mörtelschicht (B):</span>
                        <span className="font-bold font-mono">{formatDeWert(systemConfig.mortarShare)} %</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Klebeschicht (Y):</span>
                        <span className="font-bold font-mono">{formatDeWert(systemConfig.glueShare)} %</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Archiving & Export Actions (12 cols) */}
              <div className="md:col-span-12 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-home-grau/20">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleArchive}
                    disabled={testStatus !== 'finished'}
                    className={`py-2.5 px-4 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer ${
                      savedSuccess
                        ? 'bg-emerald-700 text-white'
                        : 'bg-shiraz hover:bg-shiraz/90 text-white disabled:opacity-50'
                    }`}
                  >
                    {savedSuccess ? <Check size={16} /> : <FileText size={16} />}
                    <span>{savedSuccess ? 'In Prüfprotokoll archiviert!' : 'Prüfprotokoll archivieren'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (curveData.length === 0) return;
                      const rows = curveData.map(d => [d.x, d.y, ((d.y * 1000) / stubArea).toFixed(3)]);
                      exportToCSV(`Haftzug_${substrateSystem}_d${stubDiameter}`, ['Abhebung_mm', 'Kraft_kN', 'Spannung_MPa'], rows);
                    }}
                    disabled={curveData.length === 0}
                    className="py-2.5 px-3.5 bg-off-white hover:bg-slate-200 text-text-main border border-home-grau/30 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Download size={15} /> CSV-Export
                  </button>
                </div>

                {onNavigateToProtocols && (
                  <button
                    onClick={onNavigateToProtocols}
                    className="text-xs text-shiraz font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Zur Protokollübersicht &amp; SHA-256 Signatur</span> →
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
