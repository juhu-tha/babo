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
  ArrowUpFromLine
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

  // Messreihe: Abhebung x (mm), Kraft F (kN) und Spannung σ (N/mm²) – die Diagrammart wählt nur die Darstellung
  const [curveData, setCurveData] = useState<{ x: number; f: number; s: number }[]>([]);
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
          desc: 'Optimal vorbereiteter Untergrund: Kugelstrahlen hat Zementschlämme restlos entfernt und Gesteinskörner freigelegt. Die Verbundfestigkeit übersteigt die Betonzugfestigkeit, der Bruch erfolgt im Altbeton.',
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
    const targetData: { x: number; forceKN: number; stressMPa: number }[] = [];

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
        forceKN: Number(force.toFixed(3)),
        stressMPa: Number(stress.toFixed(3))
      });
    }

    let currentStep = 0;
    clearCurrentInterval();
    intervalRef.current = setInterval(() => {
      if (currentStep < targetData.length) {
        const pt = targetData[currentStep];
        setCurveData(targetData.slice(0, currentStep + 1).map(d => ({ x: d.x, f: d.forceKN, s: d.stressMPa })));
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
  }, [substrateSystem, stubDiameter, drillDepthMm]);

  useEffect(() => {
    return () => clearCurrentInterval();
  }, []);

  // Höchstwerte der aufgezeichneten Kurve (nach dem Abriss fällt die Kraft auf 0)
  const maxStressObserved = useMemo(() => Math.max(hoechstwert(curveData.map(d => ({ x: d.x, y: d.s }))).y, 0), [curveData]);
  const maxForceObserved = useMemo(() => Math.max(hoechstwert(curveData.map(d => ({ x: d.x, y: d.f }))).y, 0), [curveData]);
  const chartPunkte = useMemo(() => curveData.map(d => ({ x: d.x, y: chartMode === 'stress' ? d.s : d.f })), [curveData, chartMode]);

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
        'Haftzugfestigkeit f_h (N/mm²)': formatDeZahl(maxStressObserved, 2),
        'Abreißkraft F_max (kN)': formatDeZahl(maxForceObserved, 2),
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

  const farben = useDiagrammFarben();
  const fs = useSchriftFaktor();
  const zeile = 20 * fs;
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: linAchse(farben, 'Stempelabhebung ΔL in mm', maxDisplacementMm * 1.05, showGrid),
      y: linAchse(
        farben,
        chartMode === 'stress' ? 'σ in N/mm²' : 'F in kN',
        chartMode === 'stress' ? Math.max(systemConfig.nominalStrength * 1.1, 3.0) : Math.max(peakForceKN * 1.1, 5.0),
        showGrid
      ),
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items: TooltipItem<'line'>[]) => `Abhebung ΔL = ${formatDeZahl(Number(items[0].parsed.x), 3)} mm`,
          label: (ctx: TooltipItem<'line'>) => chartMode === 'stress'
            ? `Haftzugspannung: ${formatDeZahl(Number(ctx.parsed.y), 2)} N/mm²`
            : `Zugkraft: ${formatDeZahl(Number(ctx.parsed.y), 2)} kN`
        }
      }
    }
  };

  // Schnitt durch Prüfstelle (Maßstab 2 px = 1 mm): Schicht oben, Untergrund unten, Ringnut, Prüfstempel, Abreißgerät
  const CXH = 220;
  const dPx = stubDiameter * 2;
  const halb = dPx / 2;
  const nut = 5;
  const schichtOben = 128;
  const schichtDicke = 30;
  const fuge = schichtOben + schichtDicke;
  const nutTiefe = drillDepthMm * 2;
  const nutUnten = fuge + nutTiefe;
  const fussAbstand = halb + 34;
  // Bruchebene nach überwiegendem Bruchanteil: Untergrund (A), Kontaktfuge (A/B), Schicht (B) oder Klebefuge (Y)
  const anteile: [number, number][] = [
    [systemConfig.concreteShare, fuge + nutTiefe * 0.55],
    [systemConfig.interfaceShare, fuge],
    [systemConfig.mortarShare, schichtOben + schichtDicke * 0.5],
    [systemConfig.glueShare, schichtOben],
  ];
  const bruchY = anteile.reduce((a, b) => (b[0] > a[0] ? b : a))[1];
  const hub = isDetached ? 26 : 0;
  const schichtFarbe = substrateSystem === 'os8_parkdeck' ? 'var(--pg-stahl3)' : 'var(--pg-beton)';
  const haftLabel = `Schnitt durch die Prüfstelle: ${systemConfig.layerTopName} auf ${systemConfig.layerSubstrateName}, Ringnut ${formatDeWert(drillDepthMm)} mm in den Untergrund, aufgeklebter Prüfstempel Ø ${stubDiameter} mm, Abreißgerät mit Kraftmessdose 10 kN. `
    + (testStatus === 'idle' ? 'Versuch noch nicht gestartet.' : isDetached ? `Stempel abgerissen, ${systemConfig.fractureType}: ${systemConfig.fractureShare}; Haftzugfestigkeit ${formatDeZahl(maxStressObserved, 2)} N/mm².` : `Zugkraft ${formatDeZahl(currentForceKN, 2)} kN.`);

  // Bruchfläche an der Stempelunterseite als Kreisdiagramm der Bruchanteile
  const bruchSegmente = [
    { anteil: systemConfig.concreteShare, farbe: 'var(--pg-beton2)', name: 'Untergrund (A)' },
    { anteil: systemConfig.interfaceShare, farbe: 'var(--pg-hartfaser)', name: 'Kontaktfuge (A/B)' },
    { anteil: systemConfig.mortarShare, farbe: 'var(--pg-beton)', name: 'Schicht (B)' },
    { anteil: systemConfig.glueShare, farbe: 'var(--pg-stahl3)', name: 'Klebefuge (Y)' },
  ].filter(s => s.anteil > 0);
  const kreisSektoren = (() => {
    let start = -Math.PI / 2;
    return bruchSegmente.map(s => {
      const w = (s.anteil / 100) * Math.PI * 2;
      const ende = start + w;
      const p = (a: number) => `${48 + 40 * Math.cos(a)} ${48 + 40 * Math.sin(a)}`;
      const d = s.anteil >= 100 ? 'M 8 48 A 40 40 0 1 1 88 48 A 40 40 0 1 1 8 48 Z' : `M 48 48 L ${p(start)} A 40 40 0 ${w > Math.PI ? 1 : 0} 1 ${p(ende)} Z`;
      start = ende;
      return { ...s, d };
    });
  })();

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
              {/* #253-HZ: Bezug der Ringnut-Tiefe nicht am Normtext geprüft (Freigabepaket labor, 04.11.2026) */}
              <p className="mt-1.5 text-[11px] leading-snug text-text-main/70">
                Kernbohrtiefe der Ringnut gemessen ab der Kontaktfuge in den Untergrund (DIN EN 1542; vorläufig, Normprüfung ausstehend).
              </p>
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
              
              {/* Prüfstelle im Schnitt mit Abreißgerät */}
              <figure className="pruefgeraet md:col-span-12 p-3 rounded-xl border flex flex-col items-center justify-center gap-2 m-0">
                <svg viewBox={`0 0 440 ${fs > 1 ? 330 : 310}`} className="w-full max-w-[560px] h-auto select-none" role="img" aria-label={haftLabel}>
                  <title>{haftLabel}</title>
                  <PfeilDefs praefix="hzp" />
                  <defs>
                    <pattern id="hzp-beton" width="14" height="14" patternUnits="userSpaceOnUse">
                      <circle cx="3" cy="4" r="2" fill="var(--pg-korn)" opacity="0.5" />
                      <circle cx="10" cy="10" r="2.6" fill="var(--pg-korn)" opacity="0.45" />
                    </pattern>
                    <clipPath id="hzp-kern"><rect x={CXH - halb} y="0" width={dPx} height={bruchY} /></clipPath>
                  </defs>

                  {/* Untergrund und Schicht */}
                  <rect x="20" y={fuge} width="400" height={238 - fuge} fill="var(--pg-beton2)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
                  <rect x="20" y={fuge} width="400" height={238 - fuge} fill="url(#hzp-beton)" />
                  <rect x="20" y={schichtOben} width="400" height={schichtDicke} fill={schichtFarbe} stroke="var(--pg-kontur)" strokeWidth="1.2" />
                  <line x1="20" y1={fuge} x2="420" y2={fuge} stroke="var(--pg-kontur)" strokeWidth="1.2" strokeDasharray="4 3" />

                  {/* Ringnut (Kernbohrung) */}
                  <rect x={CXH - halb - nut} y={schichtOben} width={nut} height={nutUnten - schichtOben} fill="var(--pg-grund)" stroke="var(--pg-kontur)" strokeWidth="0.8" />
                  <rect x={CXH + halb} y={schichtOben} width={nut} height={nutUnten - schichtOben} fill="var(--pg-grund)" stroke="var(--pg-kontur)" strokeWidth="0.8" />
                  <Masslinie praefix="hzp" schrift={12 * fs} x1={CXH + halb + nut + 10} y1={fuge} x2={CXH + halb + nut + 10} y2={nutUnten} text={`t = ${formatDeWert(drillDepthMm)} mm`} />

                  {/* abgerissener Teil: Kern oberhalb der Bruchebene mit Kleber und Stempel */}
                  {isDetached && (
                    <rect x={CXH - halb} y={schichtOben} width={dPx} height={bruchY - schichtOben + 3} fill="var(--pg-grund)" />
                  )}
                  <g transform={`translate(0 ${-hub})`} className="transition-transform duration-500 ease-out">
                    <g clipPath="url(#hzp-kern)">
                      <rect x={CXH - halb} y={schichtOben} width={dPx} height={schichtDicke} fill={schichtFarbe} />
                      <rect x={CXH - halb} y={fuge} width={dPx} height={nutTiefe + 4} fill="var(--pg-beton2)" />
                      <rect x={CXH - halb} y={fuge} width={dPx} height={nutTiefe + 4} fill="url(#hzp-beton)" />
                      <line x1={CXH - halb} y1={fuge} x2={CXH + halb} y2={fuge} stroke="var(--pg-kontur)" strokeWidth="1.2" strokeDasharray="4 3" />
                    </g>
                    {isDetached && (
                      <path d={`M ${CXH - halb} ${bruchY} l ${dPx * 0.2} 3 l ${dPx * 0.2} -4 l ${dPx * 0.2} 4 l ${dPx * 0.2} -3 l ${dPx * 0.2} 2`} stroke="var(--pg-akzent)" strokeWidth="2" fill="none" />
                    )}
                    {/* Kleber und Prüfstempel */}
                    <rect x={CXH - halb} y={schichtOben - 4} width={dPx} height="4" fill="var(--pg-hartfaser)" stroke="var(--pg-hartfaser-rand)" strokeWidth="0.6" />
                    <rect x={CXH - halb} y={schichtOben - 24} width={dPx} height="20" rx="2" fill="var(--pg-stahl)" stroke="var(--pg-kontur)" strokeWidth="1.5" />
                    {dPx >= 150 && <text x={CXH} y={schichtOben - 10} textAnchor="middle" fontSize={12 * fs} fill="var(--pg-text)">Stempel Ø {stubDiameter} mm</text>}
                    <rect x={CXH - 9} y={schichtOben - 38} width="18" height="14" rx="2" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="1" />
                    <line x1={CXH} y1={schichtOben - 38} x2={CXH} y2="70" stroke="var(--pg-kontur)" strokeWidth="3.5" />
                  </g>


                  {/* Abreißgerät: Traverse mit Kraftmessdose auf zwei Füßen */}
                  <rect x={CXH - fussAbstand - 8} y="70" width="16" height={schichtOben - 74} fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
                  <rect x={CXH + fussAbstand - 8} y="70" width="16" height={schichtOben - 74} fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
                  <rect x={CXH - fussAbstand - 16} y={schichtOben - 6} width="32" height="6" rx="1" fill="var(--pg-stahl3)" stroke="var(--pg-kontur)" strokeWidth="1" />
                  <rect x={CXH + fussAbstand - 16} y={schichtOben - 6} width="32" height="6" rx="1" fill="var(--pg-stahl3)" stroke="var(--pg-kontur)" strokeWidth="1" />
                  <rect x={CXH - Math.max(fussAbstand + 16, 100)} y="40" width={2 * Math.max(fussAbstand + 16, 100)} height="30" rx="4" fill="var(--pg-stahl)" stroke="var(--pg-kontur)" strokeWidth="1.5" />
                  <text x={CXH} y="60" textAnchor="middle" fontSize={13 * fs} fontWeight="bold" fill="var(--pg-text)">
                    {testStatus === 'running'
                      ? `F = ${formatDeZahl(currentForceKN, 2)} kN`
                      : testStatus === 'finished'
                        ? <>F<tspan fontSize={10 * fs} dy="3">max</tspan><tspan dy="-3"> = {formatDeZahl(maxForceObserved, 2)} kN</tspan></>
                        : 'Kraftmessdose 10 kN'}
                  </text>

                  {/* Zugkraft */}
                  <line x1={CXH} y1="38" x2={CXH} y2="6" stroke="var(--pg-akzent)" strokeWidth="2.5" markerEnd="url(#hzp-pfeil)" opacity={testStatus === 'idle' ? 0.45 : 1} />
                  <text x={CXH + 10} y="22" fontSize={12 * fs} fontWeight="bold" fill="var(--pg-akzent)">Zugkraft F</text>

                  {/* Legende */}
                  <rect x="20" y={252} width="16" height="10" fill={schichtFarbe} stroke="var(--pg-kontur)" strokeWidth="0.8" />
                  <text x="42" y={261 + (fs - 1) * 4} fontSize={12 * fs} fill="var(--pg-text)">{systemConfig.layerTopName}</text>
                  <rect x="20" y={252 + zeile} width="16" height="10" fill="var(--pg-beton2)" stroke="var(--pg-kontur)" strokeWidth="0.8" />
                  <text x="42" y={261 + zeile + (fs - 1) * 4} fontSize={12 * fs} fill="var(--pg-text)">{systemConfig.layerSubstrateName}</text>
                  <rect x="20" y={252 + 2 * zeile} width="16" height="6" fill="var(--pg-stahl)" stroke="var(--pg-kontur)" strokeWidth="0.8" />
                  <rect x="20" y={258 + 2 * zeile} width="16" height="3" fill="var(--pg-hartfaser)" stroke="var(--pg-hartfaser-rand)" strokeWidth="0.5" />
                  <text x="42" y={261 + 2 * zeile + (fs - 1) * 4} fontSize={12 * fs} fill="var(--pg-text)">Prüfstempel Ø {stubDiameter} mm (aufgeklebt)</text>
                </svg>

                {/* Fortschritt */}
                {testStatus === 'running' && (
                  <div className="w-full max-w-md bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300" aria-hidden="true">
                    <div className="bg-shiraz h-full transition-all duration-75" style={{ width: `${progress}%` }} />
                  </div>
                )}
              </figure>

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
                    <AuswahlGruppe label="Diagrammdarstellung" className="inline-flex rounded-lg border border-home-grau/30 p-0.5 bg-slate-50 text-xs">
                      <button {...alsOption(chartMode === 'stress')}
                        onClick={() => setChartMode('stress')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                          chartMode === 'stress' ? 'bg-shiraz text-white shadow-xs' : 'text-text-main/70 hover:text-text-main'
                        }`}
                      >
                        Spannung (N/mm²)
                      </button>
                      <button {...alsOption(chartMode === 'force')}
                        onClick={() => setChartMode('force')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                          chartMode === 'force' ? 'bg-shiraz text-white shadow-xs' : 'text-text-main/70 hover:text-text-main'
                        }`}
                      >
                        Zugkraft (kN)
                      </button>
                    </AuswahlGruppe>

                    <button
                      onClick={() => setShowGrid(!showGrid)}
                      className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                        showGrid
                          ? 'bg-shiraz text-white border-shiraz shadow-xs'
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
                          label: chartMode === 'stress' ? 'Haftzugspannung σ (N/mm²)' : 'Prüfkraft F (kN)',
                          data: chartPunkte,
                          borderColor: farben.linie,
                          backgroundColor: farben.flaeche,
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
                  <span className="text-[11px] uppercase font-bold text-text-main/60 block">Aktuelle Zugkraft <Fz>F</Fz></span>
                  <span className="text-xl font-bold font-mono text-text-main">
                    {formatDeZahl(currentForceKN, 2)} <span className="text-xs font-normal">kN</span>
                  </span>
                </div>

                <div className="bg-off-white p-3 rounded-xl border border-home-grau/20">
                  <span className="text-[11px] uppercase font-bold text-text-main/60 block">Haftzug&shy;spannung <Fz>σ</Fz></span>
                  <span className="text-xl font-bold font-mono text-shiraz">
                    {formatDeZahl(currentStressMPa, 2)} <span className="text-xs font-normal">N/mm²</span>
                  </span>
                </div>

                <div className="bg-off-white p-3 rounded-xl border border-home-grau/20">
                  <span className="text-[11px] uppercase font-bold text-text-main/60 block">Höchstwert <Fz idx="h">f</Fz></span>
                  <span className="text-xl font-bold font-mono text-emerald-700">
                    {formatDeZahl(maxStressObserved, 2)} <span className="text-xs font-normal">N/mm²</span>
                  </span>
                </div>

                <div className="bg-off-white p-3 rounded-xl border border-home-grau/20">
                  <span className="text-[11px] uppercase font-bold text-text-main/60 block">Bruchtyp nach EN 1542</span>
                  <span className="text-sm font-bold font-mono text-text-main block truncate">
                    {testStatus === 'finished' ? systemConfig.fractureType : '–'}
                  </span>
                </div>
              </div>

              {/* Fracture Surface Inspection (Bruchflächen-Analyse des Stempels) */}
              {testStatus === 'finished' && (
                <div className="md:col-span-12 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
                  <figure className="pruefgeraet flex-shrink-0 flex flex-col items-center m-0 p-2 rounded-xl border">
                    <svg viewBox="0 0 96 96" className="w-24 h-24" role="img" aria-label={`Bruchfläche an der Stempelunterseite: ${bruchSegmente.map(s => `${s.name} ${s.anteil} %`).join(', ')}`}>
                      {kreisSektoren.map(s => <path key={s.name} d={s.d} fill={s.farbe} stroke="var(--pg-kontur)" strokeWidth="0.8" />)}
                      <circle cx="48" cy="48" r="40" fill="none" stroke="var(--pg-kontur)" strokeWidth="2.5" />
                    </svg>
                    <figcaption className="text-[11px] font-mono font-bold mt-1" style={{ color: 'var(--pg-text2)' }}>
                      Stempelunterseite Ø {stubDiameter} mm
                    </figcaption>
                    <ul className="mt-1 space-y-0.5 text-[11px]" style={{ color: 'var(--pg-text)' }}>
                      {bruchSegmente.map(s => (
                        <li key={s.name} className="flex items-center gap-1.5">
                          <svg width="10" height="10" aria-hidden="true"><rect width="10" height="10" fill={s.farbe} stroke="var(--pg-kontur)" strokeWidth="1" /></svg>
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  </figure>

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
                      const rows = curveData.map(d => [d.x, d.f, d.s.toFixed(3)]);
                      exportToCSV(`Haftzug_${substrateSystem}_d${stubDiameter}`, ['Abhebung_mm', 'Kraft_kN', 'Spannung_N_mm2'], rows);
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
