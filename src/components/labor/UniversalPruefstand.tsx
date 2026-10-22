import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, RotateCcw, Activity, ShieldCheck, Check, Download, FileText, ArrowRight, Gauge, Sliders, Zap } from 'lucide-react';
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
import { validateMechanicalTestIntegrity, exportToCSV, LabProtocolRecord } from '@/src/utils/labExportUtils';
import { saveStoredLabProtocol } from '@/src/utils/studyStorage';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export type MaterialType = 'beton' | 'stahl' | 'holz' | 'ziegel' | 'eps' | 'aluminium' | 'glas' | 'carbon' | 'gusseisen';
export type TestType = 'zug' | 'druck' | 'emodul';
export type SpecimenShape = 'wuerfel150' | 'zylinder150' | 'flachstab';

interface UniversalPruefstandProps {
  onNavigateToProtocols?: () => void;
}

export default function UniversalPruefstand({ onNavigateToProtocols }: UniversalPruefstandProps) {
  const [material, setMaterial] = useState<MaterialType>('beton');
  const [testType, setTestType] = useState<TestType>('druck');
  const [specimenShape, setSpecimenShape] = useState<SpecimenShape>('wuerfel150');
  const [loadingRate, setLoadingRate] = useState<number>(0.6); // MPa/s nach DIN EN 12390-3
  const [woodAngle, setWoodAngle] = useState<number>(0); // 0 = parallel, 90 = quer zur Faser
  
  // Test state
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [progress, setProgress] = useState(0); // 0 to 100
  const [currentForceKN, setCurrentForceKN] = useState(0);
  const [currentStressMPa, setCurrentStressMPa] = useState(0);
  const [currentStrainPermille, setCurrentStrainPermille] = useState(0);
  const [crackSeverity, setCrackSeverity] = useState(0); // 0 to 1
  
  // Result dataset
  const [mechData, setMechData] = useState<{ x: number; y: number }[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [chartViewMode, setChartViewMode] = useState<'sigma_eps' | 'f_delta'>('sigma_eps');
  const [showAuxLines, setShowAuxLines] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearCurrentInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // --- Material Physics & Properties ---
  const materialProps = useMemo(() => {
    switch (material) {
      case 'beton':
        return {
          name: 'Beton (C30/37)',
          norm: testType === 'emodul' ? 'DIN EN 12390-13' : 'DIN EN 12390-3',
          density: 2400,
          E: 33000, // MPa, E_cm nach DIN EN 1992-1-1, Tab. 3.1
          // Mittelwerte nach DIN EN 1992-1-1, Tab. 3.1: f_cm = f_ck + 8 = 38 MPa (Zylinder);
          // Würfel 150 mm: f_ck,cube + 8 = 45 MPa
          fc: specimenShape === 'wuerfel150' ? 45 : 38,
          fu: 2.9, // f_ctm nach DIN EN 1992-1-1, Tab. 3.1
          strainAtMax: 2.2, // ‰
          failureStrain: 3.5, // ‰
          color: '#94a3b8',
          accentColor: '#64748b',
          isAnisotropic: false,
          texture: 'concrete',
          desc: 'Spröder Verbundwerkstoff aus Zementstein und Gesteinskörnung. Typisches Bruchbild am Würfel: Sanduhrform (zwei Pyramidenstümpfe) infolge Querdehnungsbehinderung an den Druckplatten.'
        };
      case 'stahl':
        return {
          name: 'Betonstahl (B500B)',
          norm: 'DIN EN ISO 6892-1 / DIN 488',
          density: 7850,
          E: 200000,
          fy: 500, // Streckgrenze
          fu: 550, // Zugfestigkeit
          yieldStrain: 2.5, // ‰
          failureStrain: 50, // ‰
          color: '#64748b',
          accentColor: '#334155',
          isAnisotropic: false,
          texture: 'steel',
          desc: 'Hochduktiler, warmgewalzter Betonstahl mit ausgeprägter Streckgrenze, Fließplateau (Lüdersbänder), Verfestigung und Einschnürung vor dem Bruch.'
        };
      case 'holz': {
        const rad = (woodAngle * Math.PI) / 180;
        // Mittelwerte für fehlerfreies Fichtenholz (Lehrwerte); E-Werte wie C24 nach DIN EN 338
        const fc0 = 45; // MPa parallel
        const fc90 = 5.5; // MPa rechtwinklig
        const fu0 = 85;
        const fu90 = 3.0;
        const E0 = 11000;
        const E90 = 370;

        // Hankinson-Formel
        const fcAngle = (fc0 * fc90) / (fc0 * Math.pow(Math.sin(rad), 2) + fc90 * Math.pow(Math.cos(rad), 2));
        const fuAngle = (fu0 * fu90) / (fu0 * Math.pow(Math.sin(rad), 2) + fu90 * Math.pow(Math.cos(rad), 2));
        const EAngle = (E0 * E90) / (E0 * Math.pow(Math.sin(rad), 2) + E90 * Math.pow(Math.cos(rad), 2));

        return {
          name: `Nadelholz (Fichte, fehlerfrei, α=${woodAngle}°)`,
          norm: 'DIN EN 408 / DIN EN 338',
          density: 460,
          E: EAngle,
          fc: fcAngle,
          fu: fuAngle,
          strainAtMax: (fcAngle / (EAngle / 1000)) * 1.4,
          failureStrain: (fcAngle / (EAngle / 1000)) * 1.9,
          color: '#475569',
          accentColor: '#334155',
          isAnisotropic: true,
          texture: 'wood',
          desc: 'Anisotroper Faserwerkstoff. Höchste Festigkeiten parallel zur Faser (0°); bei 90° Querpressung Faserzerquetschung ohne definierte Bruchspitze.'
        };
      }
      case 'ziegel':
        return {
          name: 'Mauerziegel (Vollziegel, Festigkeitsklasse 12)',
          norm: 'DIN EN 772-1',
          density: 1800,
          E: 10000,
          fc: 18,
          fu: 1.8,
          strainAtMax: 1.8,
          failureStrain: 2.4,
          color: '#881235',
          accentColor: '#881235',
          isAnisotropic: false,
          texture: 'brick',
          desc: 'Keramisch gebrannter Tonbaustoff mit Porengefüge. Sprödes Versagen unter vertikalen Spaltrissen infolge Querdehnungsbehinderung.'
        };
      case 'eps':
        return {
          name: 'EPS-Hartschaum (WLS 035, ca. 20 kg/m³)',
          norm: 'DIN EN 826',
          density: 20,
          E: 6.5,
          fc: 0.16,
          fu: 0.22,
          strainAtMax: 28, // ‰
          failureStrain: 650, // ‰
          color: '#f8fafc',
          accentColor: '#cbd5e1',
          isAnisotropic: false,
          texture: 'eps',
          desc: 'Geschäumtes Polystyrol. Unter Druck folgt auf den linearen Bereich ein langes Plateau (Zellkollaps) und schließlich Verdichtung. Kennwert nach DIN EN 826 ist die Druckspannung bei 10 % Stauchung (σ10).'
        };
      case 'aluminium':
        return {
          name: 'Aluminium-Knetlegierung (EN AW-6082)',
          norm: 'DIN EN ISO 6892-1 / DIN EN 755',
          density: 2700,
          E: 70000,
          fy: 260, // 0,2%-Dehngrenze Rp0.2
          fu: 310,
          yieldStrain: 3.7,
          failureStrain: 120, // 12% Dehnung
          color: '#94a3b8',
          accentColor: '#64748b',
          isAnisotropic: false,
          texture: 'aluminium',
          desc: 'Aushärtbare Al-Mg-Si Legierung mit kontinuierlichem Übergang in die Plastizität ohne ausgeprägte Streckgrenze.'
        };
      case 'glas':
        return {
          name: 'Kalk-Natron-Floatglas',
          norm: 'DIN EN 572-1 / DIN EN 1288',
          density: 2500,
          E: 70000,
          fc: 850, // Hohe Druckfestigkeit
          fu: 45, // charakteristische Biegezugfestigkeit Floatglas nach DIN EN 572-1 (Griffith-Mikrorisse)
          strainAtMax: 12.1,
          failureStrain: 12.1,
          color: '#cbd5e1',
          accentColor: '#475569',
          isAnisotropic: false,
          texture: 'glass',
          desc: 'Amorpher Silikatwerkstoff. Vollkommen linear-elastisches Verhalten bis zum katastrophalen Spontanbruch (sprödes Spaltversagen).'
        };
      case 'carbon':
        return {
          name: 'Carbonlamelle (CFK unidirektional)',
          norm: 'DIN EN 2561 / DIN EN ISO 527-5',
          density: 1600,
          E: 165000,
          fc: 700,
          fu: 2400,
          strainAtMax: 14.5,
          failureStrain: 14.5,
          color: '#0f172a',
          accentColor: '#1e293b',
          isAnisotropic: true,
          texture: 'carbon',
          desc: 'Hochleistungs-Faserverbundwerkstoff zur Bauwerksverstärkung. Extrem hohe Zugfestigkeit bei rein elastischem Dehnungsverhalten.'
        };
      case 'gusseisen':
        return {
          name: 'Gusseisen mit Lamellengraphit (EN-GJL-200)',
          norm: 'DIN EN 1561',
          density: 7200,
          E: 105000,
          fc: 750,
          fu: 200,
          strainAtMax: 7.5,
          failureStrain: 11.0,
          color: '#475569',
          accentColor: '#1e293b',
          isAnisotropic: false,
          texture: 'cast_iron',
          desc: 'Klassischer historischer Werkstoff. Die Graphitlamellen wirken als innere Kerben: Asymmetrische Festigkeit (Druckfestigkeit ca. 4x höher als Zugfestigkeit).'
        };
      default:
        return {
          name: 'Beton',
          norm: 'DIN EN 12390-3',
          density: 2400,
          E: 30000,
          fc: 30,
          fu: 3,
          strainAtMax: 2.2,
          failureStrain: 3.5,
          color: '#94a3b8',
          accentColor: '#64748b',
          isAnisotropic: false,
          texture: 'concrete',
          desc: ''
        };
    }
  }, [material, testType, woodAngle, specimenShape]);

  // Specimen cross section area [mm²]
  const specimenCrossSection = useMemo(() => {
    switch (specimenShape) {
      case 'wuerfel150':
        return 150 * 150; // 22500 mm²
      case 'zylinder150':
        return Math.PI * Math.pow(75, 2); // 17671 mm²
      case 'flachstab':
        return 20 * 10; // 200 mm² (Standard-Zugstab DIN 50125)
    }
  }, [specimenShape]);

  // Specimen height / gauge length [mm]
  const specimenHeight = useMemo(() => {
    switch (specimenShape) {
      case 'wuerfel150':
        return 150;
      case 'zylinder150':
        return 300;
      case 'flachstab':
        return 200;
    }
  }, [specimenShape]);

  // Mechanical simulation math
  const runMechanicalTest = () => {
    setTestStatus('running');
    setMechData([]);
    setProgress(0);
    setCrackSeverity(0);

    const steps = testType === 'emodul' ? 240 : 120;
    const targetData: { x: number; y: number }[] = [];

    const refStrength = materialProps.fc || materialProps.fy || materialProps.fu || 40;
    const isMetal = ['stahl', 'aluminium'].includes(material);

    let maxStrain = materialProps.failureStrain;
    if (testType === 'emodul') {
      const upper = isMetal ? refStrength * 0.40 : refStrength / 3;
      const sUpper = upper / (materialProps.E / 1000);
      maxStrain = Math.max((sUpper + 0.05) * 1.35, 0.4);
    } else if (testType === 'zug') {
      if (['beton', 'ziegel', 'glas', 'gusseisen', 'carbon', 'holz'].includes(material)) {
        const ft = materialProps.fu || materialProps.fc! * 0.1;
        maxStrain = (ft / (materialProps.E / 1000)) * 1.35;
      }
    }

    const calcStressAtStrain = (s: number, tType: TestType): number => {
      if (material === 'beton' || material === 'ziegel' || material === 'gusseisen') {
        if (tType === 'zug') {
          const ft = materialProps.fu || materialProps.fc! * 0.1;
          const st = (materialProps.E * s) / 1000;
          return st > ft ? -1 : st;
        } else {
          // Parabel (n = 2) bis ε_c1, danach linearer Abfall – vereinfachte Arbeitslinie (vgl. DIN EN 1992-1-1, 3.1.5/3.1.7)
          const ec1 = materialProps.strainAtMax || 2.2;
          const ecu = materialProps.failureStrain || 3.5;
          const eta = s / ec1;
          const fc = materialProps.fc!;

          if (s <= ec1) {
            return fc * (2 * eta - eta * eta);
          } else if (s <= ecu) {
            const drop = (s - ec1) / (ecu - ec1);
            return fc * (1 - 0.25 * drop);
          } else {
            return -1; // Bruch
          }
        }
      } else if (material === 'stahl' || material === 'aluminium') {
        const fy = materialProps.fy || 500;
        const fu = materialProps.fu || 550;
        const Ey = materialProps.E;
        const sy = materialProps.yieldStrain || fy / (Ey / 1000);

        if (s <= sy) {
          return (Ey * s) / 1000;
        } else {
          if (material === 'stahl') {
            const plateauEnd = sy + 14;
            if (s <= plateauEnd) {
              return fy + (Math.sin(s * 8) * 1.8); // Lüders-Plateau Oszillation
            } else {
              const hardRatio = (s - plateauEnd) / (materialProps.failureStrain - plateauEnd);
              let st = fy + (fu - fy) * (1 - Math.pow(1 - hardRatio, 2));
              if (tType === 'zug' && s > materialProps.failureStrain * 0.75) {
                // Einschnürungsabfall
                const necking = (s - materialProps.failureStrain * 0.75) / (materialProps.failureStrain * 0.25);
                st = st * (1 - 0.18 * necking);
              }
              return st;
            }
          } else {
            const ratio = (s - sy) / (materialProps.failureStrain - sy);
            return fy + (fu - fy) * (1 - Math.pow(1 - ratio, 2));
          }
        }
      } else if (material === 'holz') {
        if (tType === 'zug') {
          const st = (materialProps.E * s) / 1000;
          return st > materialProps.fu ? -1 : st;
        } else {
          const sElastic = (materialProps.fc! * 0.7) / (materialProps.E / 1000);
          if (s <= sElastic) {
            return (materialProps.E * s) / 1000;
          } else if (s <= materialProps.strainAtMax!) {
            const r = (s - sElastic) / (materialProps.strainAtMax! - sElastic);
            return materialProps.fc! * 0.7 + (materialProps.fc! * 0.3) * Math.sin((r * Math.PI) / 2);
          } else {
            return materialProps.fc! * (1 - 0.15 * ((s - materialProps.strainAtMax!) / (materialProps.failureStrain - materialProps.strainAtMax!)));
          }
        }
      } else if (material === 'eps') {
        if (tType === 'zug') {
          const st = (materialProps.E * s) / 1000;
          return st > materialProps.fu ? -1 : st;
        } else {
          if (s <= materialProps.strainAtMax!) {
            return (materialProps.E * s) / 1000;
          } else {
            let st = materialProps.fc!;
            if (s > 400) {
              st += 0.00008 * Math.pow(s - 400, 2); // Verdichtung
            }
            return st;
          }
        }
      } else {
        // Glas, Carbon
        const st = (materialProps.E * s) / 1000;
        const limit = tType === 'zug' ? materialProps.fu : materialProps.fc;
        return st > limit! ? -1 : st;
      }
    };

    // Precompute timeline
    for (let i = 0; i <= steps; i++) {
      let strain = (i / steps) * maxStrain;
      let stress = 0;

      if (testType === 'emodul') {
        // DIN EN 12390-13 / DIN EN ISO 6892-1 Zyklenprüfung
        const upper = isMetal ? refStrength * 0.40 : refStrength / 3;
        const lower = isMetal ? refStrength * 0.08 : refStrength * 0.10;
        const sUpper = upper / (materialProps.E / 1000);
        const sLower = lower / (materialProps.E / 1000);

        // 3 Be- und Entlastungszyklen mit realistischem Schließen der Hysterese nach DIN EN 12390-13 / ISO 6892-1
        if (i <= 35) {
          // Zyklus 1: Erstbelastung bis σa (leichte dissipative Anfangskrümmung)
          const frac = i / 35;
          const bow = 0.008 * Math.sin(frac * Math.PI);
          strain = frac * sUpper + bow;
          stress = frac * upper;
        } else if (i <= 70) {
          // Zyklus 1: Entlastung bis Basisspannung σb (bleibende Verformung ca. 0.015 ‰)
          const frac = (i - 35) / 35;
          const baseStrain = sUpper - frac * (sUpper - (sLower + 0.015));
          const hysteresisBow = 0.012 * Math.sin(frac * Math.PI);
          strain = baseStrain + hysteresisBow;
          stress = upper - frac * (upper - lower);
        } else if (i <= 105) {
          // Zyklus 2: Wiederbelastung bis σa
          const frac = (i - 70) / 35;
          const baseStrain = (sLower + 0.015) + frac * ((sUpper + 0.018) - (sLower + 0.015));
          const loadBow = -0.004 * Math.sin(frac * Math.PI);
          strain = baseStrain + loadBow;
          stress = lower + frac * (upper - lower);
        } else if (i <= 140) {
          // Zyklus 2: Entlastung bis σb
          const frac = (i - 105) / 35;
          const baseStrain = (sUpper + 0.018) - frac * ((sUpper + 0.018) - (sLower + 0.02));
          const hysteresisBow = 0.007 * Math.sin(frac * Math.PI);
          strain = baseStrain + hysteresisBow;
          stress = upper - frac * (upper - lower);
        } else if (i <= 180) {
          // Zyklus 3: Messzyklus Belastung bis σa (stabilisiert linear)
          const frac = (i - 140) / 40;
          const baseStrain = (sLower + 0.02) + frac * ((sUpper + 0.02) - (sLower + 0.02));
          strain = baseStrain;
          stress = lower + frac * (upper - lower);
        } else {
          // Zyklus 3: Entlastung bis Haltepunkt σb
          const frac = (i - 180) / (steps - 180);
          const baseStrain = (sUpper + 0.02) - frac * ((sUpper + 0.02) - (sLower + 0.02));
          const hysteresisBow = 0.003 * Math.sin(frac * Math.PI);
          strain = baseStrain + hysteresisBow;
          stress = upper - frac * (upper - lower);
        }
      } else {
        stress = calcStressAtStrain(strain, testType);
        if (stress === -1) {
          targetData.push({ x: strain, y: 0 });
          break;
        }
      }

      targetData.push({ x: strain, y: stress });
    }

    let stepIndex = 0;
    clearCurrentInterval();
    intervalRef.current = setInterval(() => {
      if (stepIndex < targetData.length) {
        const pt = targetData[stepIndex];
        setMechData(targetData.slice(0, stepIndex + 1));
        const prog = (stepIndex / targetData.length) * 100;
        setProgress(prog);

        const currentStress = pt.y;
        const currentStrain = pt.x;
        const currentForce = (currentStress * specimenCrossSection) / 1000; // in kN

        setCurrentStressMPa(currentStress);
        setCurrentStrainPermille(currentStrain);
        setCurrentForceKN(currentForce);

        // Crack / failure visualization triggers
        if (testType === 'druck') {
          if (prog > 70) {
            setCrackSeverity((prog - 70) / 30);
          }
        } else if (testType === 'zug') {
          if (prog > 60) {
            setCrackSeverity((prog - 60) / 40);
          }
        }

        stepIndex++;
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
    setMechData([]);
    setProgress(0);
    setCurrentForceKN(0);
    setCurrentStressMPa(0);
    setCurrentStrainPermille(0);
    setCrackSeverity(0);
    setSavedSuccess(false);
  };

  useEffect(() => {
    handleReset();
  }, [material, testType, specimenShape, woodAngle]);

  useEffect(() => {
    return () => clearCurrentInterval();
  }, []);

  // Compute final summary metrics
  const maxStressObserved = useMemo(() => {
    if (mechData.length === 0) return 0;
    return Math.max(...mechData.map(d => d.y), 0);
  }, [mechData]);

  const maxForceObserved = useMemo(() => {
    return (maxStressObserved * specimenCrossSection) / 1000;
  }, [maxStressObserved, specimenCrossSection]);

  const finalStrainObserved = useMemo(() => {
    if (mechData.length === 0) return 0;
    return mechData[mechData.length - 1].x;
  }, [mechData]);

  // Formänderungsarbeit je Volumen W = ∫σ dε (Fläche unter der σ-ε-Kurve, Trapezregel).
  // Einheit: MPa · ‰ = 10⁶ N/m² · 10⁻³ = kJ/m³
  const elasticEnergy = useMemo(() => {
    if (mechData.length < 2) return 0;
    let w = 0;
    for (let i = 1; i < mechData.length; i++) {
      w += 0.5 * (mechData[i].y + mechData[i - 1].y) * Math.abs(mechData[i].x - mechData[i - 1].x);
    }
    return w;
  }, [mechData]);

  // Protocol archive
  const handleArchiveProtocol = () => {
    if (testStatus !== 'finished' || mechData.length === 0) return;

    const validation = validateMechanicalTestIntegrity(
      material,
      testType,
      maxStressObserved,
      materialProps.E / 1000,
      finalStrainObserved
    );

    const shapeLabel =
      specimenShape === 'wuerfel150' ? 'Prüfwürfel 150×150×150 mm (DIN EN 12390-1)' :
      specimenShape === 'zylinder150' ? 'Zylinder d=150 mm, h=300 mm (DIN EN 12390-1)' :
      'Proportional-Zugstab (DIN 50125)';

    const newRecord: LabProtocolRecord = {
      id: `PROTO-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }),
      testTitle: `${testType === 'druck' ? 'Einaxialer Druckversuch' : testType === 'zug' ? 'Zugversuch' : 'E-Modul-Prüfung'} an ${materialProps.name}`,
      norm: materialProps.norm,
      operator: 'Virtuelle Prüfmaschine UTM-3000 (Baustoffboard)',
      specimen: {
        material: materialProps.name,
        geometry: shapeLabel,
        dimensions: specimenShape === 'wuerfel150' ? '150 x 150 x 150 mm' : specimenShape === 'zylinder150' ? 'Ø 150 mm, h = 300 mm' : 'A0 = 200 mm²',
        conditioning: material === 'beton'
          ? 'Wasserlagerung 20 ± 2 °C nach DIN EN 12390-2 (simuliert)'
          : material === 'holz'
            ? 'Normalklima 20 °C / 65 % r. F. bis Massekonstanz (simuliert)'
            : 'Raumtemperatur (simuliert)'
      },
      parameters: {
        'Prüfgeschwindigkeit': `${formatDeZahl(loadingRate, 2)} MPa/s`,
        'Versuchsart': testType === 'druck' ? 'Einaxialer Druck' : testType === 'zug' ? 'Axialer Zugversuch' : 'Zyklische Sekanten-E-Modul-Prüfung',
        'Prüfquerschnitt A0': `${formatDeZahl(specimenCrossSection, 0)} mm²`,
        ...(material === 'holz' ? { 'Faserwinkel α': `${formatDeWert(woodAngle)}°` } : {})
      },
      metrics: {
        'Höchstspannung (MPa)': formatDeZahl(maxStressObserved, 2),
        'Höchstkraft Fmax (kN)': formatDeZahl(maxForceObserved, 1),
        'E-Modul (GPa)': formatDeZahl((materialProps.E / 1000), 2),
        'Enddehnung (‰)': formatDeZahl(finalStrainObserved, 3),
        'Rohdichte (kg/m³)': `${materialProps.density}`
      },
      status: validation.status,
      validationNotes: validation.notes,
      integrityHash: validation.hash,
      dataPointsCount: mechData.length
    };

    saveStoredLabProtocol(newRecord);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  // Reference values for E-modulus secant line (DIN EN 12390-13 / DIN EN ISO 6892-1)
  const emodulReference = useMemo(() => {
    const refStrength = materialProps.fc || materialProps.fy || materialProps.fu || 40;
    const isMetal = ['stahl', 'aluminium'].includes(material);
    const upperStress = isMetal ? refStrength * 0.40 : refStrength / 3;
    const lowerStress = isMetal ? refStrength * 0.08 : refStrength * 0.10;
    const sUpper = upperStress / (materialProps.E / 1000);
    const sLower = lowerStress / (materialProps.E / 1000);
    const epsUpper = sUpper + 0.02;
    const epsLower = sLower + 0.02;
    const measuredE = ((upperStress - lowerStress) / (epsUpper - epsLower)) * 1000; // in MPa
    return {
      upperStress,
      lowerStress,
      epsUpper,
      epsLower,
      measuredE: measuredE / 1000 // in GPa
    };
  }, [materialProps, material]);

  // Chart configuration
  const chartScales = useMemo(() => {
    let xMax = materialProps.failureStrain * 1.15;
    let yMax = (materialProps.fc || materialProps.fu || materialProps.fy || 10) * 1.25;

    if (testType === 'zug') {
      if (material === 'beton') {
        xMax = 0.25;
        yMax = (materialProps.fu || 3.5) * 1.3;
      } else if (materialProps.fu) {
        yMax = materialProps.fu * 1.25;
      }
    } else if (testType === 'emodul') {
      const refF = materialProps.fc || materialProps.fy || materialProps.fu || 40;
      const isMetal = ['stahl', 'aluminium'].includes(material);
      const upper = isMetal ? refF * 0.40 : refF / 3;
      yMax = upper * 1.4;
      const sUpper = upper / (materialProps.E / 1000);
      xMax = Math.max((sUpper + 0.05) * 1.35, 0.4);
    } else if (testType === 'druck' && material === 'eps') {
      yMax = 0.35;
      xMax = 700;
    }

    if (chartViewMode === 'f_delta') {
      xMax = (xMax * specimenHeight) / 1000;
      yMax = (yMax * specimenCrossSection) / 1000;
    }

    return { xMax: Math.max(xMax, 0.1), yMax: Math.max(yMax, 0.1) };
  }, [materialProps, testType, material, chartViewMode, specimenHeight, specimenCrossSection]);

  const chartDatasets = useMemo(() => {
    const mainCurve = chartViewMode === 'sigma_eps'
      ? mechData
      : mechData.map(d => ({
          x: (d.x * specimenHeight) / 1000,
          y: (d.y * specimenCrossSection) / 1000
        }));

    const list: any[] = [
      {
        label: chartViewMode === 'sigma_eps' 
          ? `${materialProps.name} (${testType === 'emodul' ? 'Zyklen DIN EN 12390-13' : 'Messkurve'})` 
          : `${materialProps.name} (Last-Verformungskurve F-ΔL)`,
        data: mainCurve,
        borderColor: '#A3113E',
        backgroundColor: 'rgba(163, 17, 62, 0.08)',
        borderWidth: 2.8,
        pointRadius: 0,
        fill: testType !== 'emodul',
        tension: testType === 'emodul' ? 0.05 : 0.15
      }
    ];

    if (testType === 'emodul' && showAuxLines) {
      const { upperStress, lowerStress, epsUpper, epsLower, measuredE } = emodulReference;
      
      const pt1 = chartViewMode === 'sigma_eps' 
        ? { x: epsLower, y: lowerStress } 
        : { x: (epsLower * specimenHeight) / 1000, y: (lowerStress * specimenCrossSection) / 1000 };
      const pt2 = chartViewMode === 'sigma_eps' 
        ? { x: epsUpper, y: upperStress } 
        : { x: (epsUpper * specimenHeight) / 1000, y: (upperStress * specimenCrossSection) / 1000 };

      // 1. Sekanten-E-Modul-Ausgleichsgerade
      list.push({
        label: `Sekante Ec = ${formatDeZahl(measuredE, 1)} GPa (Δσ/Δε)`,
        data: [pt1, pt2],
        borderColor: '#334155',
        backgroundColor: '#334155',
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
        tension: 0
      });

      // 2. Obere Prüfspannungsgrenze
      const xMax = chartScales.xMax;
      const upperY = chartViewMode === 'sigma_eps' ? upperStress : (upperStress * specimenCrossSection) / 1000;
      list.push({
        label: `Obere Spannung σa = ${formatDeZahl(upperStress, 1)} MPa`,
        data: [{ x: 0, y: upperY }, { x: xMax, y: upperY }],
        borderColor: '#475569',
        borderWidth: 1.5,
        borderDash: [5, 4],
        pointRadius: 0,
        fill: false
      });

      // 3. Untere Basisspannungsgrenze
      const lowerY = chartViewMode === 'sigma_eps' ? lowerStress : (lowerStress * specimenCrossSection) / 1000;
      list.push({
        label: `Basisspannung σb = ${formatDeZahl(lowerStress, 1)} MPa`,
        data: [{ x: 0, y: lowerY }, { x: xMax, y: lowerY }],
        borderColor: '#64748b',
        borderWidth: 1.5,
        borderDash: [5, 4],
        pointRadius: 0,
        fill: false
      });
    }

    return list;
  }, [chartViewMode, mechData, specimenHeight, specimenCrossSection, materialProps, testType, emodulReference, chartScales, showAuxLines]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: chartViewMode === 'f_delta'
            ? (testType === 'druck' ? 'Stauchung / Hub ΔL (mm)' : 'Dehnung / Weg ΔL (mm)')
            : (testType === 'druck' ? 'Stauchung ε (‰)' : 'Dehnung ε (‰)'),
          font: { weight: 'bold' as const, size: 12 }
        },
        min: 0,
        max: chartScales.xMax,
        grid: { display: showGrid, color: 'rgba(0,0,0,0.06)' }
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: chartViewMode === 'f_delta'
            ? 'Prüfkraft F (kN)'
            : 'Spannung σ (MPa = N/mm²)',
          font: { weight: 'bold' as const, size: 12 }
        },
        min: 0,
        max: chartScales.yMax,
        grid: { display: showGrid, color: 'rgba(0,0,0,0.06)' }
      }
    },
    plugins: {
      legend: {
        display: testType === 'emodul' && showAuxLines,
        position: 'top' as const,
        labels: { boxWidth: 12, font: { size: 10, weight: 'bold' as const } }
      },
      tooltip: {
        callbacks: {
          title: (items: any[]) => chartViewMode === 'f_delta'
            ? `Weg ΔL = ${formatDeZahl(Number(items[0].parsed.x), 3)} mm`
            : `Dehnung ε = ${formatDeZahl(Number(items[0].parsed.x), 3)} ‰`,
          label: (item: any) => chartViewMode === 'f_delta'
            ? `Kraft F = ${formatDeZahl(Number(item.parsed.y), 1)} kN`
            : `Spannung σ = ${formatDeZahl(Number(item.parsed.y), 2)} MPa (${formatDeZahl(((Number(item.parsed.y) * specimenCrossSection) / 1000), 1)} kN)`
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Configuration & Testing Rig Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Control Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
              <h3 className="font-bold text-text-main flex items-center gap-2">
                <Sliders size={18} className="text-shiraz" /> 1. Versuchsparameter
              </h3>
              <span className="text-[11px] font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full">
                {materialProps.norm}
              </span>
            </div>

            {/* Test Type Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-main uppercase tracking-wider">Prüfungsart</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'druck', label: 'Druckversuch' },
                  { id: 'zug', label: 'Zugversuch' },
                  { id: 'emodul', label: 'E-Modul (Zyklen)' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTestType(t.id as TestType)}
                    disabled={testStatus === 'running'}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                      testType === t.id
                        ? 'bg-shiraz text-white border-shiraz shadow-sm'
                        : 'bg-off-white text-text-main border-home-grau/30 hover:bg-slate-100 disabled:opacity-50'
                    }`}
                  >
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Material Selection Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-main uppercase tracking-wider">Prüfwerkstoff</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'beton', label: 'Beton' },
                  { id: 'stahl', label: 'Stahl' },
                  { id: 'holz', label: 'Holz' },
                  { id: 'ziegel', label: 'Ziegel' },
                  { id: 'eps', label: 'EPS' },
                  { id: 'aluminium', label: 'Aluminium' },
                  { id: 'glas', label: 'Glas' },
                  { id: 'carbon', label: 'CFK' },
                  { id: 'gusseisen', label: 'Gusseisen' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMaterial(m.id as MaterialType)}
                    disabled={testStatus === 'running'}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-all cursor-pointer text-center ${
                      material === m.id
                        ? 'bg-shiraz/15 text-shiraz border-shiraz font-bold shadow-xs'
                        : 'bg-off-white text-text-main border-home-grau/30 hover:border-shiraz/40 disabled:opacity-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wood Anisotropy Slider */}
            {material === 'holz' && (
              <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/80 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-amber-900">
                  <span>Faserwinkel α (Hankinson)</span>
                  <span className="font-mono">{formatDeWert(woodAngle)}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={woodAngle}
                  onChange={e => setWoodAngle(Number(e.target.value))}
                  disabled={testStatus === 'running'}
                  className="w-full accent-amber-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-amber-800">
                  <span>0° (Parallel zur Faser)</span>
                  <span>90° (Quer zur Faser)</span>
                </div>
              </div>
            )}

            {/* Specimen Geometry */}
            <div className="space-y-2 pt-2 border-t border-home-grau/20">
              <label className="text-xs font-bold text-text-main uppercase tracking-wider">Probekörper-Geometrie</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'wuerfel150', title: 'Würfel 150', sub: '150 mm' },
                  { id: 'zylinder150', title: 'Zylinder', sub: 'Ø 150 / 300' },
                  { id: 'flachstab', title: 'Zugstab', sub: 'DIN 50125' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSpecimenShape(s.id as SpecimenShape)}
                    disabled={testStatus === 'running'}
                    className={`p-2 text-xs rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                      specimenShape === s.id
                        ? 'bg-shiraz text-white border-shiraz font-bold shadow-xs'
                        : 'bg-off-white text-text-main border-home-grau/30 hover:bg-slate-100 disabled:opacity-50'
                    }`}
                  >
                    <span>{s.title}</span>
                    <span className="text-[10px] opacity-75">{s.sub}</span>
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-text-main/70 bg-off-white px-3 py-1.5 rounded-lg border border-home-grau/20 flex justify-between items-center">
                <span className="flex items-center gap-1">Prüffläche <InlineMath math="A_0" />:</span>
                <strong className="font-mono text-text-main">{specimenCrossSection.toLocaleString('de-DE')} mm²</strong>
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
                min="0.1"
                max="1.5"
                step="0.05"
                value={loadingRate}
                onChange={e => setLoadingRate(parseFloat(e.target.value))}
                disabled={testStatus === 'running'}
                className="w-full accent-shiraz cursor-pointer"
              />
              <span className="text-[10px] text-text-main/60 block">
                Normbereich Beton-Druck: 0,6 ± 0,2 MPa/s nach DIN EN 12390-3. In der Simulation wird der Wert nur protokolliert.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-home-grau/20">
              <button
                onClick={runMechanicalTest}
                disabled={testStatus === 'running'}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play size={16} /> Test Starten
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

        {/* Right Universal Testing Machine & Live Terminal (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full">
            
            {/* Header / Live Status Bar */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-home-grau/20 gap-3">
              <div>
                <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                  <Activity size={18} className="text-shiraz" /> 2. Live-Prüfstand: {materialProps.name}
                </h3>
                <p className="text-xs text-text-main/70">{materialProps.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-text-main/70">Zustand:</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  testStatus === 'idle' ? 'bg-slate-100 text-slate-700' :
                  testStatus === 'running' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {testStatus === 'idle' ? 'Bereit' : testStatus === 'running' ? 'Belastung aktiv...' : 'Prüfung beendet'}
                </span>
              </div>
            </div>

            {/* Machine & Diagram Split View */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-4 flex-1">
              
              {/* Graphic Universal Testing Machine Rig (5 cols) */}
              <div className="md:col-span-5 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 dark:bg-slate-900 p-4 rounded-xl border border-slate-300 dark:border-slate-800 flex flex-col items-center justify-between relative shadow-inner overflow-hidden min-h-[360px]">
                
                {/* Rig Frame Top (Head crosshead with Load Cell) */}
                <div className="w-full flex flex-col items-center z-10">
                  <div className="w-full h-8 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 dark:from-slate-800 dark:to-slate-800 dark:bg-slate-800 rounded-t-lg shadow-md flex items-center justify-center border-b border-slate-500 dark:border-slate-700">
                    <span className="text-[10px] font-mono tracking-widest text-slate-200 font-bold uppercase">
                      Universalprüfmaschine UTM-3000
                    </span>
                  </div>
                  {/* Load Cell Sensor (Kraftmessdose) */}
                  <div className="w-16 h-7 bg-amber-400 border border-amber-600 rounded-b shadow-sm flex items-center justify-center">
                    <div className="flex items-center gap-1 text-[9px] font-bold font-mono text-amber-950">
                      <Gauge size={10} /> DMS-Zelle
                    </div>
                  </div>
                </div>

                {/* Machine Columns (Left & Right Spindles) */}
                <div className="absolute top-8 bottom-12 left-4 w-4 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 dark:from-slate-700 dark:to-slate-700 dark:bg-slate-700 rounded-sm shadow-sm border border-slate-400 dark:border-slate-600"></div>
                <div className="absolute top-8 bottom-12 right-4 w-4 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 dark:from-slate-700 dark:to-slate-700 dark:bg-slate-700 rounded-sm shadow-sm border border-slate-400 dark:border-slate-600"></div>

                {/* Central Testing Space: Platens, Specimen & Extensometer */}
                <div className="w-44 flex flex-col items-center justify-center my-auto relative z-10">
                  
                  {/* Upper Compression Platen / Grip */}
                  <div className="w-28 h-5 bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-800 dark:to-slate-800 dark:bg-slate-800 rounded-t shadow-md border border-slate-500 dark:border-slate-700 flex items-center justify-center">
                    <div className="w-8 h-1 bg-slate-400 dark:bg-slate-600 rounded-full"></div>
                  </div>

                  {/* Specimen Render */}
                  <div
                    className="relative transition-all duration-75 flex items-center justify-center shadow-lg border border-black/30 overflow-hidden"
                    style={{
                      backgroundColor: materialProps.color,
                      height: `${
                        testType === 'zug'
                          ? Math.min(170, 120 + progress * 0.45)
                          : Math.max(70, 120 - progress * 0.42)
                      }px`,
                      width: `${
                        testType === 'zug'
                          ? Math.max(34, 60 - progress * 0.22)
                          : Math.min(94, 64 + progress * 0.28)
                      }px`,
                      borderRadius: specimenShape === 'zylinder150' ? '12px' : '4px'
                    }}
                  >
                    {/* Material Textures Overlay */}
                    {material === 'beton' && (
                      <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:6px_6px]"></div>
                    )}
                    {material === 'holz' && (
                      <div
                        className="absolute inset-0 opacity-50 bg-[repeating-linear-gradient(0deg,#475569,#475569_2px,#475569_2px,#475569_8px)]"
                        style={{ transform: `rotate(${woodAngle}deg) scale(1.5)` }}
                      ></div>
                    )}
                    {material === 'stahl' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    )}

                    {/* Crack Propagation Animation */}
                    {crackSeverity > 0 && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {testType === 'druck' ? (
                          <>
                            {/* Concrete / Brick Shear Cone Cracks */}
                            <path
                              d="M 10 5 L 48 50 L 15 95"
                              stroke="#1e293b"
                              strokeWidth={2 + crackSeverity * 2.5}
                              strokeLinecap="round"
                              fill="none"
                              opacity={crackSeverity}
                            />
                            <path
                              d="M 90 5 L 52 50 L 85 95"
                              stroke="#1e293b"
                              strokeWidth={2 + crackSeverity * 2.5}
                              strokeLinecap="round"
                              fill="none"
                              opacity={crackSeverity}
                            />
                          </>
                        ) : (
                          <>
                            {/* Tensile Necking & Fracture Line */}
                            <path
                              d="M 5 50 Q 50 48 95 50"
                              stroke="#0f172a"
                              strokeWidth={2 + crackSeverity * 3.5}
                              strokeDasharray={crackSeverity > 0.8 ? 'none' : '4,2'}
                              fill="none"
                              opacity={crackSeverity}
                            />
                          </>
                        )}
                      </svg>
                    )}

                    {/* LVDT Clip-on Extensometer Attached */}
                    <div className="absolute left-[-10px] top-1/4 bottom-1/4 w-2.5 bg-slate-800 border border-slate-600 rounded-xs flex flex-col justify-between items-center py-0.5">
                      <div className="w-1.5 h-1 bg-cyan-400 rounded-full"></div>
                      <div className="w-1.5 h-1 bg-cyan-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Lower Moving Crosshead Platen (stays flush with specimen bottom) */}
                  <div className="w-28 h-6 bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-800 dark:to-slate-800 dark:bg-slate-800 rounded-b shadow-lg border border-slate-500 dark:border-slate-700 flex items-center justify-center transition-all duration-75 z-10">
                    <div className="w-12 h-1.5 bg-emerald-400/80 rounded-full animate-pulse"></div>
                  </div>

                  {/* Hydraulic Ram Piston Shaft */}
                  <div
                    className="w-10 bg-slate-400 dark:bg-slate-600 border-x border-slate-500 dark:border-slate-700 shadow-inner transition-all duration-75"
                    style={{
                      height: `${testType === 'zug' ? Math.max(8, 28 - progress * 0.22) : Math.min(60, 28 + progress * 0.28)}px`
                    }}
                  ></div>
                </div>

                {/* Base Plate with Drive Piston */}
                <div className="w-full flex flex-col items-center z-10">
                  <div className="w-full h-10 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 dark:from-slate-800 dark:to-slate-800 dark:bg-slate-800 rounded-b-lg shadow-xl flex items-center justify-between px-4 border-t border-slate-600 dark:border-slate-700">
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> ONLINE
                    </span>
                    <span className="text-[10px] font-mono text-slate-300">Hub: ±100 mm</span>
                  </div>
                </div>
              </div>

              {/* Stress-Strain Line Chart (7 cols) */}
              <div className="md:col-span-7 flex flex-col justify-between">
                
                {/* Live Digital Display Bar (Force, Stress, Strain) */}
                <div className="grid grid-cols-3 gap-2.5 mb-3">
                  <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-inner flex flex-col">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Kraft F</span>
                    <div className="text-xl font-mono font-bold text-amber-400 mt-0.5">
                      {formatDeZahl(currentForceKN, 1)} <span className="text-xs text-slate-300 font-normal">kN</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-inner flex flex-col">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Spannung σ</span>
                    <div className="text-xl font-mono font-bold text-emerald-400 mt-0.5">
                      {formatDeZahl(currentStressMPa, 2)} <span className="text-xs text-slate-300 font-normal">MPa</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-inner flex flex-col">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Dehnung ε</span>
                    <div className="text-xl font-mono font-bold text-cyan-400 mt-0.5">
                      {formatDeZahl(currentStrainPermille, 2)} <span className="text-xs text-slate-300 font-normal">‰</span>
                    </div>
                  </div>
                </div>

                {/* Diagram Mode Switcher & Chart Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => setChartViewMode('sigma_eps')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        chartViewMode === 'sigma_eps'
                          ? 'bg-shiraz text-white shadow-xs'
                          : 'bg-white text-text-main/80 border border-home-grau/30 hover:bg-slate-100'
                      }`}
                    >
                      Spannung-Dehnung (σ – ε)
                    </button>
                    <button
                      onClick={() => setChartViewMode('f_delta')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        chartViewMode === 'f_delta'
                          ? 'bg-shiraz text-white shadow-xs'
                          : 'bg-white text-text-main/80 border border-home-grau/30 hover:bg-slate-100'
                      }`}
                    >
                      Last-Verformung (F – ΔL)
                    </button>
                    {testType === 'emodul' && (
                      <div className="inline-flex rounded-lg border border-home-grau/30 p-0.5 bg-slate-50 text-xs">
                        <button
                          onClick={() => setShowAuxLines(false)}
                          className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                            !showAuxLines ? 'bg-white text-shiraz shadow-xs' : 'text-text-main/60 hover:text-text-main'
                          }`}
                          title="Reine Messkurve ohne Sekante und Spannungsgrenzen"
                        >
                          Ohne Linien
                        </button>
                        <button
                          onClick={() => setShowAuxLines(true)}
                          className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                            showAuxLines ? 'bg-emerald-700 text-white shadow-xs' : 'text-text-main/60 hover:text-text-main'
                          }`}
                          title="Sekante Ec und obere/untere Spannungsgrenzen einblenden"
                        >
                          Mit Hilfslinien
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => setShowGrid(!showGrid)}
                      className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                        showGrid
                          ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                          : 'bg-white text-text-main/70 border-home-grau/30 hover:bg-slate-100'
                      }`}
                      title="Gitterlinien im Diagramm ein- oder ausblenden"
                    >
                      {showGrid ? 'Gitter: Ein' : 'Gitter: Aus'}
                    </button>
                  </div>
                  {testType === 'emodul' && (
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                      Ec-Sekante: {formatDeZahl(emodulReference.measuredE, 1)} GPa
                    </span>
                  )}
                </div>

                {/* Chart.js Graph */}
                <div className="w-full h-[260px] bg-off-white rounded-xl p-2.5 border border-home-grau/25 relative shadow-xs">
                  <Line
                    data={{
                      datasets: chartDatasets
                    }}
                    options={chartOptions}
                  />
                  {testStatus === 'idle' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[1px] rounded-xl text-text-main/70">
                      <Zap size={24} className="text-shiraz/50 mb-1" />
                      <p className="text-xs font-bold">Klicken Sie links auf &quot;Test Starten&quot;</p>
                      <p className="text-[10px] text-text-main/50">
                        {testType === 'emodul'
                          ? 'Zyklenprüfung mit Sekanten-E-Modul-Auswertung nach DIN EN 12390-13'
                          : 'Simuliert Echtzeit-Prüfvorschub und Datenerfassung'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Finished Test Analysis & Protocol Toolbar */}
            {testStatus === 'finished' && (
              <div className="mt-2 p-4 bg-off-white rounded-xl border border-home-grau/30 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {testType === 'emodul' ? (
                    <>
                      <div>
                        <span className="text-text-main/60 uppercase text-[10px] font-bold block">Sekanten-E-Modul Ec</span>
                        <strong className="text-base text-emerald-700 font-mono">{formatDeZahl(emodulReference.measuredE, 1)} GPa</strong>
                      </div>
                      <div>
                        <span className="text-text-main/60 uppercase text-[10px] font-bold block">E-Modul (Literatur)</span>
                        <strong className="text-base text-text-main font-mono">{formatDeZahl((materialProps.E / 1000), 1)} GPa</strong>
                      </div>
                      <div>
                        <span className="text-text-main/60 uppercase text-[10px] font-bold block">Prüfspannungsbereich</span>
                        <strong className="text-base text-amber-700 font-mono">
                          {formatDeZahl(emodulReference.lowerStress, 1)} – {formatDeZahl(emodulReference.upperStress, 1)} MPa
                        </strong>
                      </div>
                      <div>
                        <span className="text-text-main/60 uppercase text-[10px] font-bold block">Prüfvorschrift</span>
                        <strong className="text-base text-shiraz font-mono">DIN EN 12390-13</strong>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-text-main/60 uppercase text-[10px] font-bold block">Höchstspannung σmax</span>
                        <strong className="text-base text-shiraz font-mono">{formatDeZahl(maxStressObserved, 2)} MPa</strong>
                      </div>
                      <div>
                        <span className="text-text-main/60 uppercase text-[10px] font-bold block">Höchstkraft Fmax</span>
                        <strong className="text-base text-text-main font-mono">{formatDeZahl(maxForceObserved, 1)} kN</strong>
                      </div>
                      <div>
                        <span className="text-text-main/60 uppercase text-[10px] font-bold block">E-Modul (Literatur)</span>
                        <strong className="text-base text-text-main font-mono">{formatDeZahl((materialProps.E / 1000), 1)} GPa</strong>
                      </div>
                      <div>
                        <span className="text-text-main/60 uppercase text-[10px] font-bold block">Formänderungsarbeit W (Fläche σ–ε)</span>
                        <strong className="text-base text-emerald-700 font-mono">{formatDeZahl(elasticEnergy, 1)} kJ/m³</strong>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-home-grau/20 gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-text-main">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span>Simulierte Prüfdaten, plausibilisiert gegen typische Kennwerte (Prüfnorm: <strong>{materialProps.norm}</strong>).</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleArchiveProtocol}
                      disabled={savedSuccess}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        savedSuccess
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-shiraz hover:bg-shiraz/90 text-white shadow-sm'
                      }`}
                    >
                      {savedSuccess ? (
                        <>
                          <Check size={14} /> Protokoll archiviert!
                        </>
                      ) : (
                        <>
                          <FileText size={14} /> Im Prüfprotokoll archivieren
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        const rows = mechData.map(d => [d.x.toFixed(4), d.y.toFixed(3)]);
                        exportToCSV(`UTM_${material}_${testType}`, ['Dehnung_Promille', 'Spannung_MPa'], rows);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-text-main text-xs font-bold rounded-xl border border-home-grau/30 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Rohdaten exportieren"
                    >
                      <Download size={14} /> CSV
                    </button>

                    {onNavigateToProtocols && (
                      <button
                        onClick={onNavigateToProtocols}
                        className="text-xs font-bold text-shiraz hover:underline flex items-center gap-1 transition-all cursor-pointer ml-1"
                      >
                        Zu den Protokollen <ArrowRight size={13} />
                      </button>
                    )}
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
