import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Check, FileText, Waves, Droplet, ArrowDown } from 'lucide-react';
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
import { LabProtocolRecord, generateIntegrityChecksum } from '@/src/utils/labExportUtils';
import { saveStoredLabProtocol } from '@/src/utils/studyStorage';
import { Fz } from '../ui/Formelzeichen';
import { useDiagrammFarben, linAchse } from './laborGrafik';
import { AusbreitDraufsicht, AusbreitSeitenansicht, SetzversuchAnsicht, SetzFormen } from './FrischbetonGeraete';
import { ausbreitAuswertung } from '@/src/calc/laborVersuch';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type FreshConcreteTest = 'ausbreittisch' | 'slump' | 'rheologie';

export default function FrischbetonPruefung() {
  const [activeTest, setActiveTest] = useState<FreshConcreteTest>('ausbreittisch');
  
  // Mix formulation sliders
  const [wzValue, setWzValue] = useState<number>(0.50); // w/z-Wert 0.35 bis 0.70
  const [fließmittelPCE, setFließmittelPCE] = useState<number>(0.5); // % Zementmasse
  const [airEntrainment, setAirEntrainment] = useState<boolean>(false);

  // --- Ausbreittisch State ---
  const [shocksDone, setShocksDone] = useState<number>(0);
  const [coneLifted, setConeLifted] = useState<boolean>(false);
  const [spreadDiameterMm, setSpreadDiameterMm] = useState<number>(200); // Initialer Kegelfuß = 200 mm
  const [isShocking, setIsShocking] = useState<boolean>(false);
  // nur Darstellung: Tischplatte kurz angehoben (Hubschlag)
  const [platteOben, setPlatteOben] = useState<boolean>(false);

  // --- Slump (Setzversuch) State ---
  const [slumpLifted, setSlumpLifted] = useState<boolean>(false);
  const [slumpMm, setSlumpMm] = useState<number>(0);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Target final spread based on w/z and PCE
  const targetSpread = Math.min(
    740,
    Math.round(240 + (wzValue - 0.35) * 600 + fließmittelPCE * 180 + (airEntrainment ? 25 : 0))
  );

  // Target slump mm based on w/z and PCE
  const targetSlump = Math.min(
    260,
    Math.round(10 + (wzValue - 0.35) * 350 + fließmittelPCE * 110 + (airEntrainment ? 15 : 0))
  );

  // Reset tests on parameter change
  const handleReset = () => {
    setShocksDone(0);
    setConeLifted(false);
    setSpreadDiameterMm(200);
    setIsShocking(false);
    setSlumpLifted(false);
    setSlumpMm(0);
    setSavedSuccess(false);
  };

  useEffect(() => {
    handleReset();
  }, [wzValue, fließmittelPCE, airEntrainment, activeTest]);

  // Lift cone
  const liftCone = () => {
    setConeLifted(true);
    // Slight initial slump without shocks
    const initialSpread = 200 + (targetSpread - 200) * 0.25;
    setSpreadDiameterMm(Math.round(initialSpread));
  };

  // Perform one shock
  const doSingleShock = () => {
    if (!coneLifted || shocksDone >= 15 || isShocking) return;
    setIsShocking(true);
    setPlatteOben(true);
    setTimeout(() => setPlatteOben(false), 120);

    setTimeout(() => {
      setShocksDone(prev => {
        const next = prev + 1;
        const remainingSpread = targetSpread - (200 + (targetSpread - 200) * 0.25);
        const currentAddition = (remainingSpread / 15) * next;
        setSpreadDiameterMm(Math.round(200 + (targetSpread - 200) * 0.25 + currentAddition));
        return next;
      });
      setIsShocking(false);
    }, 180);
  };

  // Run full 15 shocks automatically
  const runAll15Shocks = () => {
    if (!coneLifted) {
      liftCone();
    }
    let count = shocksDone;
    const interval = setInterval(() => {
      if (count < 15) {
        count++;
        setShocksDone(count);
        setPlatteOben(true);
        setTimeout(() => setPlatteOben(false), 110);
        const remainingSpread = targetSpread - (200 + (targetSpread - 200) * 0.25);
        const currentAddition = (remainingSpread / 15) * count;
        setSpreadDiameterMm(Math.round(200 + (targetSpread - 200) * 0.25 + currentAddition));
      } else {
        clearInterval(interval);
      }
    }, 240);
  };

  // Slump pull
  const liftSlumpCone = () => {
    setSlumpLifted(true);
    let cur = 0;
    const interval = setInterval(() => {
      cur += 15;
      if (cur <= targetSlump) {
        setSlumpMm(cur);
      } else {
        setSlumpMm(targetSlump);
        clearInterval(interval);
      }
    }, 40);
  };

  // Ausbreitmaß f = (d1 + d2)/2 auf 10 mm gerundet (DIN EN 12350-5); Klasse aus dem gerundeten Wert (DIN EN 206)
  const ausbreit = ausbreitAuswertung(spreadDiameterMm);
  const KLASSENNAMEN: Record<string, string> = {
    F1: 'steif (≤ 340 mm)',
    F2: 'plastisch (350–410 mm)',
    F3: 'weich (420–480 mm)',
    F4: 'sehr weich (490–550 mm)',
    F5: 'fließfähig (560–620 mm)',
    F6: 'sehr fließfähig (≥ 630 mm)',
  };
  // Ausbreitmaßklassen nach DIN EN 206 (Benennung nach DIN 1045-2), bestimmt aus dem auf 10 mm gerundeten Ausbreitmaß
  const consistencyClass = (fGerundet: number): { code: string; name: string } => {
    const code = ausbreitAuswertung(fGerundet).klasse;
    if (code === 'F6' && fGerundet >= 700) return { code, name: 'sehr fließfähig – für SVB Setzfließversuch nach DIN EN 12350-8 (Klassen SF)' };
    return { code, name: KLASSENNAMEN[code] ?? code };
  };

  const slumpClass = (slump: number): { code: string; name: string } => {
    if (slump <= 40) return { code: 'S1', name: 'Steif (10 - 40 mm)' };
    if (slump <= 90) return { code: 'S2', name: 'Plastisch (50 - 90 mm)' };
    if (slump <= 150) return { code: 'S3', name: 'Weich (100 - 150 mm)' };
    if (slump <= 210) return { code: 'S4', name: 'Sehr weich (160 - 210 mm)' };
    return { code: 'S5', name: 'Fließfähig (≥ 220 mm)' };
  };

  // Bingham Rheology Data
  const binghamYieldStress = Math.max(15, 280 - (wzValue - 0.35) * 450 - fließmittelPCE * 180); // Pa
  const binghamPlasticViscosity = Math.max(8, 65 - (wzValue - 0.35) * 70 - fließmittelPCE * 18); // Pa*s

  const farben = useDiagrammFarben();
  // Darstellung der Setzform: ab S5 (≥ 220 mm) fällt der Kegel in sich zusammen; Scherung wird nicht simuliert
  const setzForm = slumpMm >= 220 ? 'zusammenbruch' as const : 'setzung' as const;

  const rheoPoints = [0, 5, 10, 15, 20, 25, 30, 40, 50].map(gammaDot => ({
    x: gammaDot,
    y: binghamYieldStress + binghamPlasticViscosity * gammaDot
  }));

  const handleArchive = () => {
    const isSpread = activeTest === 'ausbreittisch';
    const classInfo = isSpread ? consistencyClass(ausbreit.f) : slumpClass(slumpMm);

    const newRecord: LabProtocolRecord = {
      id: `PROTO-FRISCH-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }),
      testTitle: isSpread ? 'Ausbreitversuch nach DIN EN 12350-5' : 'Setzversuch (Slump) nach DIN EN 12350-2',
      norm: isSpread ? 'DIN EN 12350-5' : 'DIN EN 12350-2',
      operator: 'Frischbetonprüfung (Lehrsimulation)',
      specimen: {
        material: `Frischbeton (w/z = ${formatDeZahl(wzValue, 2)}, PCE = ${formatDeZahl(fließmittelPCE, 1)} %)`,
        geometry: isSpread ? 'Ausbreitkegel (h = 200 mm)' : 'Abrams-Trichter (h = 300 mm)',
        dimensions: isSpread ? 'Tisch 700 × 700 mm' : 'Kegel Ø 100/200 mm',
        conditioning: 'Frisch angemischt, Prüfung unmittelbar nach der Probenahme (simuliert)'
      },
      parameters: {
        'Wasserzementwert w/z': formatDeZahl(wzValue, 2),
        'Fließmittel (PCE)': `${formatDeZahl(fließmittelPCE, 1)} M.-%`,
        'Luftporenbildner': airEntrainment ? 'Ja' : 'Nein',
        ...(isSpread ? { 'Hubschläge': `${formatDeWert(shocksDone)} / 15` } : {})
      },
      metrics: isSpread ? {
        'Einzelmessungen d1 / d2 (mm)': `${formatDeWert(ausbreit.d1)} / ${formatDeWert(ausbreit.d2)}`,
        'Ausbreitmaß f (mm, auf 10 mm gerundet)': formatDeWert(ausbreit.f),
        'Konsistenzklasse': `${classInfo.code} (${classInfo.name})`,
        'Fließgrenze τ0 (Pa, Lehrmodell)': formatDeZahl(binghamYieldStress, 0),
        'Plastische Viskosität μp (Pa·s, Lehrmodell)': formatDeZahl(binghamPlasticViscosity, 1)
      } : {
        'Setzmaß h (mm)': formatDeWert(slumpMm),
        'Setzmaßklasse': `${classInfo.code} (${classInfo.name})`,
        'Fließgrenze τ0 (Pa, Lehrmodell)': formatDeZahl(binghamYieldStress, 0)
      },
      status: 'Plausibel',
      validationNotes: [
        `Simulierte Konsistenzprüfung nach ${isSpread ? 'DIN EN 12350-5' : 'DIN EN 12350-2'}; Konsistenzwerte aus einem Lehrmodell (w/z, Fließmittel, LP).`,
        `Klassifizierung: ${classInfo.code} (${classInfo.name}).`
      ],
      integrityHash: generateIntegrityChecksum(`frisch|${activeTest}|${wzValue}|${fließmittelPCE}|${airEntrainment}|${spreadDiameterMm}|${slumpMm}|${Date.now()}`),
      dataPointsCount: isSpread ? shocksDone : 1
    };

    saveStoredLabProtocol(newRecord);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Top Test Selector Tabs */}
      <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
        {[
          { id: 'ausbreittisch', label: 'Ausbreittisch (DIN EN 12350-5)', norm: 'F1 - F6' },
          { id: 'slump', label: 'Setzversuch Slump (DIN EN 12350-2)', norm: 'S1 - S5' },
          { id: 'rheologie', label: 'Bingham-Rheologie (τ₀ und μₚ)', norm: 'Schubspannung' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTest(t.id as FreshConcreteTest)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTest === t.id
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-slate-100'
            }`}
          >
            <span>{t.label}</span>
            <span className="text-[10px] font-mono opacity-80 bg-black/10 px-1.5 py-0.5 rounded">
              {t.norm}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Concrete Mix Formulation Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
              <h3 className="font-bold text-text-main flex items-center gap-2">
                <Droplet size={18} className="text-shiraz" /> 1. Rezepturparameter
              </h3>
              <span className="text-[11px] font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full">
                Frischbeton
              </span>
            </div>

            {/* w/z Value Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-text-main">
                <span>Wasserzementwert (w/z-Wert):</span>
                <span className="font-mono text-shiraz">{formatDeZahl(wzValue, 2)}</span>
              </div>
              <input
                type="range"
                min="0.35"
                max="0.70"
                step="0.01"
                value={wzValue}
                onChange={e => setWzValue(parseFloat(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-text-main/60">
                <span>0,35 (Sehr steif / hochfest)</span>
                <span>0,70 (Sehr weich / porös)</span>
              </div>
            </div>

            {/* PCE Superplasticizer Slider */}
            <div className="space-y-1.5 pt-2 border-t border-home-grau/20">
              <div className="flex justify-between text-xs font-bold text-text-main">
                <span>Fließmittel (PCE):</span>
                <span className="font-mono text-emerald-700">{formatDeZahl(fließmittelPCE, 1)} M.-%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.1"
                value={fließmittelPCE}
                onChange={e => setFließmittelPCE(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[10px] text-text-main/60 block">
                Senkt die Fließgrenze <InlineMath math="\tau_0" /> deutlich durch elektrosterische Abstoßung der Zementpartikel.
              </span>
            </div>

            {/* Air Entrainment Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-home-grau/20">
              <label className="text-xs font-bold text-text-main">Luftporenbildner (LP)</label>
              <input
                type="checkbox"
                checked={airEntrainment}
                onChange={e => setAirEntrainment(e.target.checked)}
                className="w-4 h-4 accent-shiraz cursor-pointer"
              />
            </div>

            {/* Reset */}
            <div className="pt-2 border-t border-home-grau/20">
              <button
                onClick={handleReset}
                className="w-full py-2.5 px-3 bg-off-white hover:bg-slate-200 text-text-main border border-home-grau/30 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} /> Versuch zurücksetzen
              </button>
            </div>
          </div>
        </div>

        {/* Right Interactive Apparatus View (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full">
            
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-home-grau/20 gap-3">
              <div>
                <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                  <Waves size={18} className="text-shiraz" /> 2. {
                    activeTest === 'ausbreittisch' ? 'Ausbreittisch nach DIN EN 12350-5' :
                    activeTest === 'slump' ? 'Setzmaßprüfung (Slump-Test DIN EN 12350-2)' :
                    'Bingham-Fließkurve (Rheologische Kenngrößen)'
                  }
                </h3>
                <p className="text-xs text-text-main/70">
                  {activeTest === 'ausbreittisch' && '15 Hubschläge (je Hub etwa 1 bis 3 s) breiten den Beton auf dem Ausbreittisch aus'}
                  {activeTest === 'slump' && 'Senkrechtes Heben des Abrams-Trichters in 2 bis 5 Sekunden'}
                  {activeTest === 'rheologie' && 'Bingham-Modell (Lehrwerte): τ = τ₀ + μₚ · γ̇'}
                </p>
              </div>

              {activeTest === 'ausbreittisch' && (
                <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-3 py-1 rounded-full">
                  Hubschläge: {formatDeWert(shocksDone)} / 15
                </span>
              )}
            </div>

            {/* Sub-View 1: Ausbreittisch */}
            {activeTest === 'ausbreittisch' && (
              <div className="flex flex-col gap-4 my-3 flex-1">
                
                {/* Ausbreittisch: Draufsicht und Seitenansicht */}
                <figure className="pruefgeraet p-3 rounded-xl border flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-4 m-0">
                  <div className="w-full sm:w-auto sm:flex-[3] flex justify-center min-w-0">
                    <AusbreitDraufsicht ausbreitmass={spreadDiameterMm} kegelGehoben={coneLifted} hubschlaege={shocksDone} />
                  </div>
                  <div className="w-full sm:w-auto sm:flex-[2] flex justify-center min-w-0">
                    <AusbreitSeitenansicht ausbreitmass={spreadDiameterMm} kegelGehoben={coneLifted} hubschlaege={shocksDone} gehoben={platteOben} />
                  </div>
                  <figcaption className="w-full text-[11px] text-center leading-snug" style={{ color: 'var(--pg-text2)' }}>
                    Ausbreitmaß f = Mittel aus zwei Durchmessern d1 und d2, parallel zu den Tischkanten gemessen, auf 10 mm gerundet (DIN EN 12350-5); die Klasse folgt aus dem gerundeten Wert.
                  </figcaption>
                </figure>

                {/* Ausbreittisch Interactive Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {!coneLifted ? (
                    <button
                      onClick={liftCone}
                      className="sm:col-span-3 py-3 px-4 bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ArrowDown size={16} /> Ausbreitkegel senkrecht anheben
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={doSingleShock}
                        disabled={shocksDone >= 15 || isShocking}
                        className="py-2.5 px-3 bg-off-white hover:bg-slate-200 text-text-main border border-home-grau/30 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Play size={14} /> 1 Hubschlag ausführen
                      </button>
                      <button
                        onClick={runAll15Shocks}
                        disabled={shocksDone >= 15}
                        className="sm:col-span-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Play size={14} /> Alle 15 Hubschläge automatisch durchführen
                      </button>
                    </>
                  )}
                </div>

                {/* Results Card */}
                {coneLifted && (
                  <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-text-main/60 block text-[11px] uppercase font-bold">Ausbreitmaß <Fz>f</Fz></span>
                      <strong className="text-xl text-shiraz font-mono">{formatDeWert(ausbreit.f)} mm</strong>
                      <span className="block text-[11px] text-text-main/70">auf 10 mm gerundet (DIN EN 12350-5)</span>
                    </div>

                    <div>
                      <span className="text-text-main/60 block text-[11px] uppercase font-bold">Konsistenzklasse</span>
                      <strong className="text-base text-text-main font-bold">
                        {consistencyClass(ausbreit.f).code} ({consistencyClass(ausbreit.f).name})
                      </strong>
                    </div>

                    <button
                      onClick={handleArchive}
                      disabled={savedSuccess}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        savedSuccess ? 'bg-emerald-600 text-white' : 'bg-shiraz hover:bg-shiraz/90 text-white'
                      }`}
                    >
                      {savedSuccess ? <><Check size={14} /> Archiviert</> : <><FileText size={14} /> Im Protokoll archivieren</>}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Sub-View 2: Slump-Test */}
            {activeTest === 'slump' && (
              <div className="flex flex-col gap-4 my-3 flex-1">
                
                {/* Setzversuch: Abrams-Trichter und Setzmaß */}
                <figure className="pruefgeraet p-3 rounded-xl border flex flex-col items-center justify-center gap-3 m-0">
                  <SetzversuchAnsicht setzmass={slumpMm} gezogen={slumpLifted} form={setzForm} />
                  <div className="w-full max-w-[460px]">
                    <SetzFormen aktiv={slumpLifted ? setzForm : null} />
                  </div>
                  <figcaption className="text-[11px] text-center leading-snug" style={{ color: 'var(--pg-text2)' }}>
                    Setzmaß h: Abstand von der Oberkante des daneben gestellten Trichters bis zur höchsten Stelle des Betons (DIN EN 12350-2).
                  </figcaption>
                </figure>

                {/* Slump Control Button */}
                {!slumpLifted ? (
                  <button
                    onClick={liftSlumpCone}
                    className="py-3 px-4 bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowDown size={16} /> Abrams-Trichter nach oben abziehen (2 - 5 s)
                  </button>
                ) : (
                  <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-text-main/60 block text-[11px] uppercase font-bold">Setzmaß <Fz>h</Fz></span>
                      <strong className="text-xl text-shiraz font-mono">{formatDeWert(slumpMm)} mm</strong>
                    </div>

                    <div>
                      <span className="text-text-main/60 block text-[11px] uppercase font-bold">Setzmaßklasse</span>
                      <strong className="text-base text-text-main font-bold">
                        {slumpClass(slumpMm).code} ({slumpClass(slumpMm).name})
                      </strong>
                    </div>

                    <button
                      onClick={handleArchive}
                      disabled={savedSuccess}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        savedSuccess ? 'bg-emerald-600 text-white' : 'bg-shiraz hover:bg-shiraz/90 text-white'
                      }`}
                    >
                      {savedSuccess ? <><Check size={14} /> Archiviert</> : <><FileText size={14} /> Im Protokoll archivieren</>}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Sub-View 3: Bingham Rheology */}
            {activeTest === 'rheologie' && (
              <div className="flex flex-col gap-4 my-3 flex-1">
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-off-white text-text-main p-3 rounded-xl border border-home-grau/30 shadow-inner">
                    <span className="text-[11px] font-mono text-slate-600 font-bold uppercase tracking-wider block">
                      Fließgrenze <Fz idx="0">τ</Fz>
                    </span>
                    <span className="text-xl font-mono font-bold text-amber-700">
                      {formatDeZahl(binghamYieldStress, 0)} <span className="text-xs text-slate-700 font-normal">Pa</span>
                    </span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">Mindestspannung zum Fließbeginn</span>
                  </div>

                  <div className="bg-off-white text-text-main p-3 rounded-xl border border-home-grau/30 shadow-inner">
                    <span className="text-[11px] font-mono text-slate-600 font-bold uppercase tracking-wider block">
                      Plastische Viskosität <Fz idx="p">μ</Fz>
                    </span>
                    <span className="text-xl font-mono font-bold text-emerald-700">
                      {formatDeZahl(binghamPlasticViscosity, 1)} <span className="text-xs text-slate-700 font-normal">Pa·s</span>
                    </span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">Fließwiderstand in Bewegung</span>
                  </div>
                </div>

                <div className="w-full h-[230px] bg-off-white rounded-xl p-2.5 border border-home-grau/25 shadow-xs">
                  <Line
                    data={{
                      datasets: [
                        {
                          label: 'Bingham-Fließkurve τ(γ̇)',
                          data: rheoPoints,
                          borderColor: farben.linie,
                          backgroundColor: farben.flaeche,
                          pointBackgroundColor: farben.linie,
                          borderWidth: 2.8,
                          pointRadius: 3,
                          fill: true
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: linAchse(farben, 'Schergeschwindigkeit in 1/s', 50, true),
                        y: linAchse(farben, 'Schubspannung τ in Pa', Math.max(500, binghamYieldStress + binghamPlasticViscosity * 50 * 1.05), true),
                      },
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (ctx: TooltipItem<'line'>) => `τ = ${formatDeZahl(Number(ctx.parsed.y), 1)} Pa bei γ̇ = ${formatDeZahl(Number(ctx.parsed.x), 0)} 1/s`
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
