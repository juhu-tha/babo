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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { LabProtocolRecord, generateIntegrityChecksum } from '@/src/utils/labExportUtils';
import { saveStoredLabProtocol } from '@/src/utils/studyStorage';

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

  // Consistency Class determination
  const consistencyClass = (spread: number): { code: string; name: string } => {
    // Ausbreitmaßklassen nach DIN EN 206 (Benennung nach DIN 1045-2)
    if (spread <= 345) return { code: 'F1', name: 'steif (≤ 340 mm)' };
    if (spread <= 415) return { code: 'F2', name: 'plastisch (350–410 mm)' };
    if (spread <= 485) return { code: 'F3', name: 'weich (420–480 mm)' };
    if (spread <= 555) return { code: 'F4', name: 'sehr weich (490–550 mm)' };
    if (spread <= 625) return { code: 'F5', name: 'fließfähig (560–620 mm)' };
    if (spread < 700) return { code: 'F6', name: 'sehr fließfähig (≥ 630 mm)' };
    return { code: 'F6', name: 'sehr fließfähig – für SVB Setzfließversuch nach DIN EN 12350-8 (Klassen SF)' };
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

  const rheoPoints = [0, 5, 10, 15, 20, 25, 30, 40, 50].map(gammaDot => ({
    x: gammaDot,
    y: binghamYieldStress + binghamPlasticViscosity * gammaDot
  }));

  const handleArchive = () => {
    const isSpread = activeTest === 'ausbreittisch';
    const classInfo = isSpread ? consistencyClass(spreadDiameterMm) : slumpClass(slumpMm);

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
        'Ausbreitmaß d (mm)': formatDeWert(spreadDiameterMm),
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
          { id: 'rheologie', label: 'Bingham-Rheologie (τ0 & μp)', norm: 'Schubspannung' }
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
                  {activeTest === 'rheologie' && 'Bingham-Modell (Lehrwerte): τ = τ0 + μp · γ̇'}
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
                
                {/* Visualizer Table Top View SVG */}
                <div className="bg-stone-200 p-5 rounded-xl border border-stone-300 flex flex-col items-center justify-center relative shadow-inner min-h-[300px]">
                  
                  {/* Table outline 700x700 mm */}
                  <div className="relative w-[280px] h-[280px] bg-slate-300 rounded-lg border-2 border-slate-500 shadow-md flex items-center justify-center overflow-hidden">
                    
                    {/* Metal plate shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/20"></div>

                    {/* Centering crosslines engraved in plate */}
                    <line className="stroke-slate-400 stroke-1" x1="0" y1="140" x2="280" y2="140" />
                    <line className="stroke-slate-400 stroke-1" x1="140" y1="0" x2="140" y2="280" />

                    {/* Scale Circle for 700 mm limit */}
                    <circle cx="140" cy="140" r="135" fill="none" stroke="#94a3b8" strokeDasharray="3,3" />

                    {/* Concrete Spread Circle */}
                    <div
                      className="rounded-full shadow-lg transition-all duration-300 flex items-center justify-center relative border border-stone-500"
                      style={{
                        width: `${(spreadDiameterMm / 700) * 270}px`,
                        height: `${(spreadDiameterMm / 700) * 270}px`,
                        backgroundColor: '#94a3b8',
                        backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
                        backgroundSize: '8px 8px'
                      }}
                    >
                      {/* Flow rings */}
                      {coneLifted && (
                        <div className="w-3/4 h-3/4 rounded-full border border-stone-400/50"></div>
                      )}
                      
                      {/* Trichter silhouette before lifting */}
                      {!coneLifted && (
                        <div className="w-16 h-16 rounded-full border-2 border-amber-600 bg-amber-700/80 flex items-center justify-center text-white text-[9px] font-bold">
                          Kegel
                        </div>
                      )}
                    </div>

                    {/* Measuring Dimension Line */}
                    {coneLifted && (
                      <div
                        className="absolute h-0.5 bg-shiraz transition-all duration-300 flex items-center justify-between"
                        style={{ width: `${(spreadDiameterMm / 700) * 270}px` }}
                      >
                        <div className="w-2 h-2 rounded-full bg-shiraz"></div>
                        <span className="text-[10px] font-mono font-bold bg-white text-shiraz px-1.5 py-0.5 rounded shadow-sm border border-shiraz/30">
                          Ø {formatDeWert(spreadDiameterMm)} mm
                        </span>
                        <div className="w-2 h-2 rounded-full bg-shiraz"></div>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 text-[11px] text-stone-600 font-bold">
                    Stahl-Tischplatte 700 × 700 mm (Hubhöhe 40 mm)
                  </div>
                </div>

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
                      <span className="text-text-main/60 block text-[10px] uppercase font-bold">Ausbreitmaß d</span>
                      <strong className="text-xl text-shiraz font-mono">{formatDeWert(spreadDiameterMm)} mm</strong>
                    </div>

                    <div>
                      <span className="text-text-main/60 block text-[10px] uppercase font-bold">Konsistenzklasse</span>
                      <strong className="text-base text-text-main font-bold">
                        {consistencyClass(spreadDiameterMm).code} ({consistencyClass(spreadDiameterMm).name})
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
                
                {/* Slump Simulator Visualizer */}
                <div className="bg-stone-200 p-5 rounded-xl border border-stone-300 flex flex-col items-center justify-center relative shadow-inner min-h-[300px]">
                  
                  <div className="relative w-full max-w-[340px] h-[240px] flex items-end justify-center">
                    
                    {/* Floor Plate */}
                    <div className="absolute bottom-0 w-full h-4 bg-slate-700 rounded shadow"></div>

                    {/* Abrams Cone Outline (height = 300 mm scaled) */}
                    <div className="absolute bottom-4 w-40 h-[190px] border-2 border-dashed border-slate-500 rounded-t-sm pointer-events-none flex flex-col justify-between items-center py-1">
                      <span className="text-[9px] font-mono text-slate-500">Trichteroberkante (h = 300 mm)</span>
                      <span className="text-[9px] font-mono text-slate-500">Bodenplatte</span>
                    </div>

                    {/* Slump Concrete Cone Body */}
                    <div
                      className="bg-stone-400 border-2 border-stone-600 transition-all duration-500 flex flex-col items-center justify-center shadow-lg relative"
                      style={{
                        width: `${Math.min(240, 120 + slumpMm * 0.45)}px`,
                        height: `${Math.max(40, 190 - (slumpMm / 300) * 190)}px`,
                        borderRadius: slumpMm > 150 ? '30px 30px 4px 4px' : '15px 15px 2px 2px'
                      }}
                    >
                      <span className="text-[10px] font-bold text-stone-800">
                        {slumpLifted ? `${formatDeWert(slumpMm)} mm Setzmaß` : 'Gefüllter Trichter'}
                      </span>
                    </div>

                    {/* Measuring Ruler (slump height difference) */}
                    {slumpLifted && (
                      <div
                        className="absolute right-6 top-[46px] flex items-center transition-all duration-300"
                        style={{ height: `${(slumpMm / 300) * 190}px` }}
                      >
                        <div className="w-1 bg-red-600 h-full relative">
                          <div className="absolute -top-1 -left-1 w-3 h-1 bg-red-600"></div>
                          <div className="absolute -bottom-1 -left-1 w-3 h-1 bg-red-600"></div>
                        </div>
                        <span className="ml-2 text-xs font-mono font-bold text-red-600 bg-white px-1.5 py-0.5 rounded shadow border border-red-300">
                          s = {formatDeWert(slumpMm)} mm
                        </span>
                      </div>
                    )}
                  </div>
                </div>

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
                      <span className="text-text-main/60 block text-[10px] uppercase font-bold">Setzmaß s</span>
                      <strong className="text-xl text-shiraz font-mono">{formatDeWert(slumpMm)} mm</strong>
                    </div>

                    <div>
                      <span className="text-text-main/60 block text-[10px] uppercase font-bold">Setzmaßklasse</span>
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
                  <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-inner">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                      Fließgrenze τ0 (Yield Stress)
                    </span>
                    <span className="text-xl font-mono font-bold text-amber-400">
                      {formatDeZahl(binghamYieldStress, 0)} <span className="text-xs text-slate-300 font-normal">Pa</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Mindestspannung zum Fließbeginn</span>
                  </div>

                  <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-inner">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                      Plastische Viskosität μp
                    </span>
                    <span className="text-xl font-mono font-bold text-emerald-400">
                      {formatDeZahl(binghamPlasticViscosity, 1)} <span className="text-xs text-slate-300 font-normal">Pa·s</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Fließwiderstand in Bewegung</span>
                  </div>
                </div>

                <div className="w-full h-[230px] bg-off-white rounded-xl p-2.5 border border-home-grau/25 shadow-xs">
                  <Line
                    data={{
                      datasets: [
                        {
                          label: 'Bingham-Fließkurve τ(γ̇)',
                          data: rheoPoints,
                          borderColor: '#A3113E',
                          backgroundColor: 'rgba(163, 17, 62, 0.08)',
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
                        x: {
                          type: 'linear' as const,
                          title: { display: true, text: 'Schergeschwindigkeit γ̇ (1/s)', font: { weight: 'bold' as const, size: 12 } },
                          min: 0,
                          max: 55,
                          grid: { color: 'rgba(0,0,0,0.06)' }
                        },
                        y: {
                          type: 'linear' as const,
                          title: { display: true, text: 'Schubspannung τ (Pa)', font: { weight: 'bold' as const, size: 12 } },
                          min: 0,
                          max: Math.max(500, binghamYieldStress + binghamPlasticViscosity * 55 * 1.15),
                          grid: { color: 'rgba(0,0,0,0.06)' }
                        }
                      },
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (ctx: any) => `τ = ${formatDeZahl(Number(ctx.parsed.y), 1)} Pa bei γ̇ = ${formatDeZahl(Number(ctx.parsed.x), 0)} 1/s`
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
