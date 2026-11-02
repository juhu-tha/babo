import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  Target, 
  Calculator, 
  Layers, 
  Info, 
  Settings, 
  CheckCircle2, 
  TrendingUp, 
  RefreshCw,
  Award,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { MessunsicherheitTab } from './messenpruefen/MessunsicherheitTab';
import { BegriffeTab } from './messenpruefen/BegriffeTab';
import { TreffbildTab } from './messenpruefen/TreffbildTab';
import inhalt from '@/content/messenpruefen/MessenPruefen.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { messwerteAusText, gumMessunsicherheit, ringversuch } from '@/src/calc/pruefverfahren';

export default function MessenPruefen() {
  // Tabs for the Messen & Prüfen component
  const [activeSubTab, setActiveSubTab] = useState<'begriffe' | 'treffbild' | 'messunsicherheit' | 'pruefstreuung' | 'ringversuche'>('begriffe');

  const [selectedTool, setSelectedTool] = useState<'meterstab' | 'messschieber' | 'laser' | 'risslupe' | 'nivellier'>('meterstab');
  const [toolInputValue, setToolInputValue] = useState<number>(1000); // 1000 mm (1.0m) default

  // SVG Bullseye selections
  const [accuracy, setAccuracy] = useState<'high' | 'low'>('high');
  const [precision, setPrecision] = useState<'high' | 'low'>('high');

  // Input states for Measurement Uncertainty Calculator
  const [measurements, setMeasurements] = useState<string>('38,5; 39,2; 37,8; 38,9; 39,6');
  const [resolution, setResolution] = useState<number>(0.1); // d (digital resolution)
  const [calibrationError, setCalibrationError] = useState<number>(0.15); // U_cal from cert (k=2)

  // Input states for Ringversuch (Round-Robin Test) Simulator nach DIN EN ISO/IEC 17043 & ISO 13528
  const [rvMeasuredValue, setRvMeasuredValue] = useState<number>(48.2); // x_lab (z. B. Betondruckfestigkeit in MPa)
  const [rvAssignedValue, setRvAssignedValue] = useState<number>(50.0); // X (zugewiesener Referenzwert)
  const [rvSigmaPT, setRvSigmaPT] = useState<number>(1.8); // sigma_pt (Standardabweichung für Eignungsprüfung)
  const [rvULab, setRvULab] = useState<number>(1.4); // U_lab (erweiterte Messunsicherheit des Labors k=2)
  const [rvURef, setRvURef] = useState<number>(0.6); // U_ref (erweiterte Messunsicherheit des Referenzwerts k=2)
  const [rvProbeBOffset, setRvProbeBOffset] = useState<number>(-1.5); // Für den Youden-Plot (Probe B)

  // Parse measurements string into numbers
  // Rechenkern src/calc/pruefverfahren.ts. Deutsche Eingabe: Semikolon als Trenner, Dezimalkomma.
  // Ohne Semikolon wird (wie bisher) am Komma getrennt und der Punkt als Dezimaltrenner gelesen.
  const parsedData = useMemo(() => messwerteAusText(measurements), [measurements]);

  // GUM: u_A = s/√n, u_B,1 = d/(2√3), u_B,2 = U_kal/2, U = 2·u_c
  const gum = useMemo(() => gumMessunsicherheit(parsedData, resolution, calibrationError), [parsedData, resolution, calibrationError]);
  const { mean, sampleStdDev, uA, uB1, uB2, uc, expandedU, minInterval, maxInterval } = gum;

  // Ringversuch: z-Score und E_n-Wert nach DIN EN ISO 13528
  const rvStats = useMemo(() => {
    const rv = ringversuch({ x: rvMeasuredValue, X: rvAssignedValue, sigmaPt: rvSigmaPT, uLab: rvULab, uRef: rvURef, offsetB: rvProbeBOffset });

    // Simulated benchmark laboratories for the Youden plot (Pair: Probe A vs Probe B)
    // Reference center is (50, 48)
    const baseLabs = [
      { id: 1, a: 50.1, b: 48.0 },
      { id: 2, a: 49.8, b: 47.9 },
      { id: 3, a: 50.4, b: 48.3 },
      { id: 4, a: 49.5, b: 47.6 },
      { id: 5, a: 50.8, b: 48.7 },
      { id: 6, a: 49.2, b: 47.2 },
      { id: 7, a: 51.2, b: 49.0 },
      { id: 8, a: 48.7, b: 46.8 },
      { id: 9, a: 50.3, b: 48.1 },
      { id: 10, a: 49.9, b: 48.2 },
      { id: 11, a: 50.6, b: 48.5 },
      { id: 12, a: 49.4, b: 47.5 },
      { id: 13, a: 51.5, b: 49.4 }, // systematisch hoch
      { id: 14, a: 48.3, b: 46.4 }, // systematisch niedrig
      { id: 15, a: 50.0, b: 49.2 }, // zufällig Probe B hoch
      { id: 16, a: 50.2, b: 47.1 }, // zufällig Probe B niedrig
      { id: 17, a: 49.0, b: 48.5 }, // Streuung
      { id: 18, a: 51.0, b: 47.7 }  // Streuung
    ];

    return { ...rv, baseLabs };
  }, [rvMeasuredValue, rvAssignedValue, rvSigmaPT, rvULab, rvURef, rvProbeBOffset]);

  // Generate target points based on accuracy and precision selectors
  const targetShots = useMemo(() => {
    // Center is coordinates (100, 100)
    let cx = 100;
    let cy = 100;

    // systematic error (accuracy) off-center shift
    if (accuracy === 'low') {
      cx = 145;
      cy = 85;
    }

    // dispersion factor (precision)
    const rMax = precision === 'high' ? 8 : 45;

    // deterministic angles to keep rendering consistent but look scattered
    const angles = [12, 106, 215, 302, 45, 160, 265, 340, 75, 190];
    const distances = [0.1, 0.4, 0.3, 0.7, 0.2, 0.6, 0.8, 0.5, 0.9, 0.35];

    return angles.map((angle, idx) => {
      const rad = (angle * Math.PI) / 180;
      const d = distances[idx] * rMax;
      return {
        x: cx + d * Math.cos(rad),
        y: cy + d * Math.sin(rad),
      };
    });
  }, [accuracy, precision]);

  return (
    <div className="flex flex-col gap-6 w-full text-slate-800 animate-fade-in">
      
      {/* --- Unified Header: Clean Cockpit Theme --- */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
          <Scale className="text-shiraz" /><MdText text={inhalt.texte.messenPrüfenImBaulabor} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p><MdText text={inhalt.texte.metrologischeGrundlagenDerBaustoffprüfun} /></p>
        </div>
      </div>

      {/* --- Internal Sub-Navigation Tabs --- */}
      <ModuleTabs
        label={inhalt.werte.bereicheMessenPruefen}
        tabs={[
          { id: 'begriffe' as const, label: inhalt.texte.begriffeDefinitionen, icon: Settings },
          { id: 'treffbild' as const, label: inhalt.texte.richtigkeitVsPräzision, icon: Target },
          { id: 'messunsicherheit' as const, label: inhalt.texte.gumMessunsicherheit, icon: Calculator },
          { id: 'pruefstreuung' as const, label: inhalt.texte.prüfstreuungenRR, icon: Layers },
          { id: 'ringversuche' as const, label: inhalt.texte.ringversucheRoundRobin, icon: Award },
        ]}
        aktiv={activeSubTab}
        onWechsel={setActiveSubTab}
        className="flex flex-col gap-6"
      >

      {/* --- Tab 1: Begriffe & Definitionen (Justieren, Kalibrieren, Eichen) --- */}
      {activeSubTab === 'begriffe' && (
        <BegriffeTab setSelectedTool={setSelectedTool} setToolInputValue={setToolInputValue} selectedTool={selectedTool} toolInputValue={toolInputValue} />
      )}

      {/* --- Tab 2: Richtigkeit vs. Präzision (Accuracy vs. Precision) --- */}
      {activeSubTab === 'treffbild' && (
        <TreffbildTab accuracy={accuracy} setAccuracy={setAccuracy} precision={precision} setPrecision={setPrecision} targetShots={targetShots} />
      )}

      {/* --- Tab 3: GUM Messunsicherheit-Rechner (Type A & B Standard) --- */}
      {activeSubTab === 'messunsicherheit' && (
        <MessunsicherheitTab measurements={measurements} setMeasurements={setMeasurements} parsedData={parsedData} resolution={resolution} setResolution={setResolution} calibrationError={calibrationError} setCalibrationError={setCalibrationError} mean={mean} sampleStdDev={sampleStdDev} uA={uA} uB1={uB1} uB2={uB2} expandedU={expandedU} minInterval={minInterval} maxInterval={maxInterval} uc={uc} hinweise={gum.hinweise} />
      )}

      {/* --- Tab 4: Prüfstreuungen (r/R - Repeatability & Reproducibility) --- */}
      {activeSubTab === 'pruefstreuung' && (
        <div className="space-y-6">
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 font-sans">
              <Layers className="text-shiraz" size={20} /><MdText text={inhalt.texte.prüfstreuungenWiederholpräzisionVsVergle} /></h2>
            <p className="text-slate-600 text-xs leading-relaxed max-w-4xl font-sans"><MdText text={inhalt.texte.wennPrüfungenUnterGeringfügig} /><FormulaText text="r" /><MdText text={inhalt.texte.undVergleichsgrenze} /><FormulaText text="R" />.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              
              {/* Repeatability (Wiederholbedingungen) */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50 relative hover:bg-white transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start font-sans">
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase"><MdText text={inhalt.texte.wiederholpräzisionR} /></span>
                    <span className="text-[10px] text-slate-400 font-mono">Repeatability</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2.5 font-sans"><MdText text={inhalt.texte.gleichesLaborEngsterRaum} /></h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans"><MdText text={inhalt.texte.gibtDasAusmaßDer} /></p>
                  
                  <ul className="space-y-1.5 text-xs text-slate-600 mt-3 list-none font-sans">
                    <li className="flex items-center gap-1.5"><span className="text-emerald-500">•</span><MdText text={inhalt.texte.gleicherPrüferDerselbeBediener} /></li>
                    <li className="flex items-center gap-1.5"><span className="text-emerald-500">•</span><MdText text={inhalt.texte.gleichePrüfmaschineDasselbeMesssystem} /></li>
                    <li className="flex items-center gap-1.5"><span className="text-emerald-500">•</span><MdText text={inhalt.texte.kurzerZeitlicherAbstandUnmittelbarer} /></li>
                  </ul>
                  <p className="text-xs text-slate-500 leading-relaxed mt-3 font-sans"><MdText text={inhalt.texte.statistischGiltDieWiederholgrenze} /><FormulaText text="r = 2{,}8 \cdot \sigma_r" /> (mit <FormulaText text="\sigma_r" /><MdText text={inhalt.texte.alsWiederholstandardabweichungDieDiffere} /></p>
                </div>
                <div className="mt-4 pt-3 text-[10px] text-slate-400 font-mono italic leading-normal border-t border-home-grau/30"><MdText text={inhalt.texte.wirdZurInternenQualitätskontrolle} /></div>
              </div>

              {/* Reproducibility (Vergleichsbedingungen) */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50 relative hover:bg-white transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start font-sans">
                    <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded uppercase"><MdText text={inhalt.texte.vergleichspräzisionR} /></span>
                    <span className="text-[10px] text-slate-400 font-mono">Reproducibility</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2.5 font-sans"><MdText text={inhalt.texte.unterschiedlicheLaboreRingversuche} /></h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans"><MdText text={inhalt.texte.gibtDasAusmaßDer2} /></p>
                  
                  <ul className="space-y-1.5 text-xs text-slate-600 mt-3 list-none font-sans">
                    <li className="flex items-center gap-1.5"><span className="text-purple-500">•</span><MdText text={inhalt.texte.unterschiedlicheLaboranten} /></li>
                    <li className="flex items-center gap-1.5"><span className="text-purple-500">•</span><MdText text={inhalt.texte.völligUnterschiedlichePrüfmaschinenHerst} /></li>
                    <li className="flex items-center gap-1.5"><span className="text-purple-500">•</span><MdText text={inhalt.texte.größererZeitlicherVerzugZ} /></li>
                  </ul>
                  <p className="text-xs text-slate-500 leading-relaxed mt-3 font-sans"><MdText text={inhalt.texte.statistischGiltDieVergleichsgrenze} /><FormulaText text="R = 2{,}8 \cdot \sigma_R" /> (mit <FormulaText text="\sigma_R" /><MdText text={inhalt.texte.alsVergleichsstandardabweichungDieDiffer} /></p>
                </div>
                <div className="mt-4 pt-3 text-[10px] text-slate-400 font-mono italic leading-normal border-t border-home-grau/30"><MdText text={inhalt.texte.dieSystematischeRelevanzZeigt} /></div>
              </div>

            </div>
          </div>

          {/* Practical Relevance Card */}
          <div className="p-4 bg-white rounded-xl border border-home-grau/25 border-l-4 border-l-amber-500 text-xs text-slate-800 flex gap-2 font-sans">
            <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed"><MdText text={inhalt.texte.praktischeRelevanzBeiBaustoff} /><FormulaText text="R" /><MdText text={inhalt.texte.überhauptÜberschreitetErstDann} /></div>
          </div>
        </div>
      )}

      {/* --- Tab 5: Ringversuche & Round-Robin-Tests (DIN EN ISO/IEC 17043) --- */}
      {activeSubTab === 'ringversuche' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header Card */}
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-home-grau/20">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                <Award className="text-shiraz" size={22} /><MdText text={inhalt.texte.ringversucheEignungsprüfungenRoundRobin} /></h2>
              <span className="text-xs font-mono font-bold text-slate-500 bg-off-white px-2.5 py-1 rounded-lg border border-home-grau/20"><MdText text={inhalt.texte.dinEnIsoIec} /></span>
            </div>
            
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
              <p><MdText text={inhalt.texte.ringversucheProficiencyTestingInterlabor} /></p>
            </div>

            {/* Metrological Simulator Cockpit */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
              
              {/* Inputs Column (5 cols) */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4 text-xs font-sans">
                <div className="flex items-center justify-between pb-2 border-b border-home-grau/20">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Settings size={14} className="text-shiraz" /><MdText text={inhalt.texte.eingangsdatenDesPrüflabors} /></span>
                  <span className="text-[10px] text-slate-500 font-mono">Simulationsparameter</span>
                </div>

                {/* Input: Measured Value x_lab */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-slate-700"><MdText text={inhalt.texte.eigenesPrüfergebnis} /><FormulaText text="x_{\text{lab}}" />):</label>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-home-grau/30">
                      {formatDeZahl(rvMeasuredValue, 1)} MPa
                    </span>
                  </div>
                  <input
                    type="range"
                    min="42"
                    max="58"
                    step="0.1"
                    value={rvMeasuredValue}
                    onChange={(e) => setRvMeasuredValue(parseFloat(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block"><MdText text={inhalt.texte.zBZylinderdruckfestigkeitDin} /></span>
                </div>

                {/* Input: Assigned Reference Value X */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-slate-700"><MdText text={inhalt.texte.referenzwertDesRingversuchs} /><FormulaText text="X" />):</label>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-home-grau/30">
                      {formatDeZahl(rvAssignedValue, 1)} MPa
                    </span>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="55"
                    step="0.1"
                    value={rvAssignedValue}
                    onChange={(e) => setRvAssignedValue(parseFloat(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block"><MdText text={inhalt.texte.zBRobusterMittelwert} /></span>
                </div>

                {/* Input: Sigma_pt */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-slate-700"><MdText text={inhalt.texte.zielStandardabweichung} /><FormulaText text="\sigma_{\text{pt}}" />):</label>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-home-grau/30">
                      ±{formatDeZahl(rvSigmaPT, 2)} MPa
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="4.0"
                    step="0.1"
                    value={rvSigmaPT}
                    onChange={(e) => setRvSigmaPT(parseFloat(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block"><MdText text={inhalt.texte.vomAnbieterFestgelegteStandardabweichung} /></span>
                </div>

                {/* Input: U_lab & U_ref */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-home-grau/20">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-700 block">
                      <FormulaText text="U_{\text{lab}}" /> (k=2):
                    </label>
                    <div className="flex items-center gap-1">
                      <input aria-label="(k=2)"
                        type="number"
                        min="0.2"
                        max="5.0"
                        step="0.1"
                        value={rvULab}
                        onChange={(e) => setRvULab(parseFloat(e.target.value) || 0.5)}
                        className="w-full p-1.5 bg-white border border-home-grau/30 rounded font-mono font-bold text-xs"
                      />
                      <span className="text-slate-500 font-mono text-[10px]">MPa</span>
                    </div>
                    <span className="text-[9px] text-slate-400 block"><MdText text={inhalt.texte.unsicherheitLabor} /></span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-700 block">
                      <FormulaText text="U_{\text{ref}}" /> (k=2):
                    </label>
                    <div className="flex items-center gap-1">
                      <input aria-label="(k=2)"
                        type="number"
                        min="0.1"
                        max="3.0"
                        step="0.1"
                        value={rvURef}
                        onChange={(e) => setRvURef(parseFloat(e.target.value) || 0.2)}
                        className="w-full p-1.5 bg-white border border-home-grau/30 rounded font-mono font-bold text-xs"
                      />
                      <span className="text-slate-500 font-mono text-[10px]">MPa</span>
                    </div>
                    <span className="text-[9px] text-slate-400 block"><MdText text={inhalt.texte.unsicherheitReferenz} /></span>
                  </div>
                </div>

                {/* Preset Scenarios */}
                <div className="pt-2 border-t border-home-grau/20 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block"><MdText text={inhalt.texte.testSzenarienLaden} /></span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => { setRvMeasuredValue(49.8); setRvAssignedValue(50.0); setRvSigmaPT(1.8); setRvULab(1.2); setRvURef(0.5); }}
                      className="px-2 py-1 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 rounded text-[10px] font-bold transition-all cursor-pointer"
                    ><MdText text={inhalt.texte.exzellentZ02} /></button>
                    <button
                      onClick={() => { setRvMeasuredValue(46.0); setRvAssignedValue(50.0); setRvSigmaPT(1.8); setRvULab(1.4); setRvURef(0.6); }}
                      className="px-2 py-1 bg-white hover:bg-amber-50 border border-amber-300 text-amber-800 rounded text-[10px] font-bold transition-all cursor-pointer"
                    ><MdText text={inhalt.texte.warnsignal2Z3} /></button>
                    <button
                      onClick={() => { setRvMeasuredValue(43.5); setRvAssignedValue(50.0); setRvSigmaPT(1.8); setRvULab(1.5); setRvURef(0.6); }}
                      className="px-2 py-1 bg-white hover:bg-red-50 border border-red-300 text-red-800 rounded text-[10px] font-bold transition-all cursor-pointer"
                    ><MdText text={inhalt.texte.nichtkonformZ30} /></button>
                  </div>
                </div>
                <EingabeHinweise hinweise={rvStats.hinweise} />
              </div>

              {/* Evaluation Output Column (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {/* Metric Cards (z-Score & En-Zahl) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Card 1: z-Score */}
                  <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    rvStats.zStatus === '–'
                      ? 'bg-off-white border-home-grau/30'
                      : rvStats.zStatus === 'ok'
                      ? 'bg-emerald-50/70 border-emerald-300' 
                      : rvStats.zStatus === 'warning' 
                        ? 'bg-amber-50/70 border-amber-300' 
                        : 'bg-rose-50/70 border-rose-300'
                  }`}>
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border bg-white text-slate-800 border-home-grau/30">
                          Leistungsbewertung
                        </span>
                        <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full ${
                          rvStats.zStatus === '–' ? 'bg-slate-100 text-slate-700' :
                          rvStats.zStatus === 'ok' ? 'bg-emerald-600 text-white' :
                          rvStats.zStatus === 'warning' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white animate-pulse'
                        }`}>
                          {rvStats.zStatus === '–' ? '–' : rvStats.zStatus === 'ok' ? 'Zufriedenstellend' : rvStats.zStatus === 'warning'? 'Warnsignal' : inhalt.werte.nichtAkzeptabel}
                        </span>
                      </div>
                      
                      <div className="mt-3">
                        <span className="text-xs text-slate-600 font-medium"><MdText text={inhalt.texte.standardisierterKennwert} /></span>
                        <div className="text-2xl font-mono font-bold mt-0.5 text-slate-900">
                          z-Score = {rvStats.zScore > 0 ? `+${formatDeZahl(rvStats.zScore, 2)}` : formatDeZahl(rvStats.zScore, 2)}
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-slate-600 leading-relaxed font-sans">
                        <p>
                          Abweichung: <strong>{rvStats.dVal > 0 ? `+${formatDeZahl(rvStats.dVal, 2)}` : formatDeZahl(rvStats.dVal, 2)} MPa</strong> ({formatDeZahl(((rvStats.dVal / rvAssignedValue) * 100), 1)} %)
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] text-slate-700 leading-snug">
                      {rvStats.zStatus === 'ok' && (
                        <span className="text-emerald-800 font-medium flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="shrink-0" /><MdText text={inhalt.texte.z20Zufriedenstellende} /></span>
                      )}
                      {rvStats.zStatus === 'warning' && (
                        <span className="text-amber-800 font-medium flex items-center gap-1.5">
                          <AlertTriangle size={14} className="shrink-0" /><MdText text={inhalt.texte.t20Z3} /></span>
                      )}
                      {rvStats.zStatus === 'critical' && (
                        <span className="text-rose-800 font-bold flex items-center gap-1.5">
                          <AlertTriangle size={14} className="shrink-0" /><MdText text={inhalt.texte.z30Nicht} /></span>
                      )}
                    </div>
                  </div>

                  {/* Card 2: En-Zahl */}
                  <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    rvStats.enStatus === '–'
                      ? 'bg-off-white border-home-grau/30'
                      : rvStats.enStatus === 'ok'
                      ? 'bg-blue-50/70 border-blue-300' 
                      : 'bg-rose-50/70 border-rose-300'
                  }`}>
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border bg-white text-slate-800 border-home-grau/30">
                          Messunsicherheits-Check
                        </span>
                        <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full ${
                          rvStats.enStatus === '–' ? 'bg-slate-100 text-slate-700' : rvStats.enStatus === 'ok' ? 'bg-blue-600 text-white' : 'bg-rose-600 text-white animate-pulse'
                        }`}>
                          {rvStats.enStatus === '–' ? '–' : rvStats.enStatus === 'ok' ? inhalt.werte.en10Zufriedenstellend : inhalt.werte.en10Nicht}
                        </span>
                      </div>

                      <div className="mt-3">
                        <span className="text-xs text-slate-600 font-medium"><MdText text={inhalt.texte.metrologischeEnZahl} /></span>
                        <div className="text-2xl font-mono font-bold mt-0.5 text-slate-900">
                          E<sub>n</sub> = {rvStats.enScore > 0 ? `+${formatDeZahl(rvStats.enScore, 2)}` : formatDeZahl(rvStats.enScore, 2)}
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-slate-600 leading-relaxed font-sans">
                        <p>
                          Nenner: <FormulaText text="\sqrt{U_{\text{lab}}^2 + U_{\text{ref}}^2}" /> = <strong>±{formatDeZahl(rvStats.denomEn, 2)} MPa</strong>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] text-slate-700 leading-snug">
                      {rvStats.enStatus === '–' ? null : rvStats.enStatus === 'ok' ? (
                        <span className="text-blue-900font-medium flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="shrink-0 text-blue-700" /><MdText text={inhalt.texte.dieDeklarierteMessunsicherheitDeckt} /></span>
                      ) : (
                        <span className="text-rose-800 font-bold flex items-center gap-1.5">
                          <AlertTriangle size={14} className="shrink-0 text-rose-600" /><MdText text={inhalt.texte.messunsicherheitUnterschätztOderSignifik} /></span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Youden-Plot (Zwei-Proben-Diagramm) */}
                <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-home-grau/20">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 font-sans">
                        <Target size={15} className="text-shiraz" /><MdText text={inhalt.texte.interaktiverYoudenPlotZwei} /></h4>
                      <p className="text-[10px] text-slate-500 font-sans"><MdText text={inhalt.texte.wJYoudenMethode} /></p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded"><MdText text={inhalt.texte.probeAVsProbe} /></span>
                  </div>

                  {/* SVG Youden-Plot Canvas */}
                  <div className="w-full svg-buehne border rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
                    <svg width="100%" height="220" viewBox="0 0 460 220" className="select-none">
                      {/* Grid Lines */}
                      <line x1="30" y1="110" x2="430" y2="110" stroke="var(--bu-raster)" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="230" y1="20" x2="230" y2="200" stroke="var(--bu-raster)" strokeWidth="1" strokeDasharray="3,3" />

                      {/* 45-Degree Diagonal Line (Systematic Error Axis) */}
                      <line x1="60" y1="180" x2="400" y2="40" stroke="var(--bu-linie)" strokeWidth="1.5" strokeDasharray="5,3" />
                      <text x="390" y="32" fill="var(--bu-text2)" fontSize="9" fontWeight="bold">45°-Systematik-Achse</text>

                      {/* Tolerance Ellipse (Confidence Zone 95%) */}
                      <ellipse cx="230" cy="110" rx="90" ry="38" transform="rotate(-23 230 110)" fill="rgba(16, 185, 129, 0.08)" stroke="var(--bu-gruen)" strokeWidth="1.5" strokeDasharray="4,2" />

                      {/* Reference Center Cross (X_A, X_B) */}
                      <circle cx="230" cy="110" r="4" fill="var(--bu-blau)" />
                      <text x="238" y="106" fill="var(--bu-blau)" fontSize="9" fontWeight="bold">Referenzzentrum (X)</text>

                      {/* Other Benchmark Laboratories */}
                      {rvStats.baseLabs.map(lab => {
                        // Map 45..55 MPa to coords [60..400]
                        const px = 230 + (lab.a - 50.0) * 28;
                        const py = 110 - (lab.b - 48.0) * 28;
                        return (
                          <circle
                            key={lab.id}
                            cx={px}
                            cy={py}
                            r="3"
                            fill="var(--bu-punkt)"
                            opacity="0.9"
                          />
                        );
                      })}

                      {/* Current Laboratory Point (Highlighted) */}
                      {rvStats.gueltig && (() => {
                        const curX = Math.max(35, Math.min(425, 230 + (rvStats.currentLab.a - 50.0) * 28)); // Darstellungsfaktor: Plotmitte 50,0 MPa, 28 px je MPa
                        const curY = Math.max(25, Math.min(195, 110 - (rvStats.currentLab.b - 48.0) * 28)); // Darstellungsfaktor: Plotmitte 48,0 MPa, 28 px je MPa
                        const col = rvStats.zStatus === 'ok' ? 'var(--bu-ok)' : rvStats.zStatus === 'warning' ? 'var(--bu-warn)' : 'var(--bu-fehler)';
                        return (
                          <g>
                            {/* Pulse Aura */}
                            <circle cx={curX} cy={curY} r="9" fill={col} opacity="0.35" className="animate-ping" />
                            {/* Outer Border */}
                            <circle cx={curX} cy={curY} r="6.5" fill="var(--bu-panel)" stroke={col} strokeWidth="2.5" />
                            {/* Center Dot */}
                            <circle cx={curX} cy={curY} r="3" fill={col} />
                            {/* Label */}
                            <rect x={curX - 45} y={curY - 24} width="90" height="16" fill="var(--bu-panel)" rx="3" stroke={col} strokeWidth="1" />
                            <text x={curX} y={curY - 13} textAnchor="middle" fill="var(--bu-text)" fontSize="8.5" fontWeight="bold">
                              Ihr Labor (z={formatDeZahl(rvStats.zScore, 1)})
                            </text>
                          </g>
                        );
                      })()}

                      {/* Axis Labels */}
                      <text x="425" y="125" textAnchor="end" fill="var(--bu-text2)" fontSize="9">Probe A (MPa) &rarr;</text>
                      <text x="240" y="28" fill="var(--bu-text2)" fontSize="9">&uarr; Probe B (MPa)</text>
                    </svg>

                    <div className="w-full flex items-center justify-between text-[10px] bu-text2 mt-1 font-mono">
                      <span><MdText text={inhalt.texte.grauePunkte18Teilnehmende} /></span>
                      <span><MdText text={inhalt.texte.grüneEllipseSchematischerBereich} /></span>
                    </div>
                  </div>

                  {/* Youden Interpretation Guide */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 font-sans pt-1">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-home-grau/20">
                      <strong className="text-slate-900 block mb-0.5"><MdText text={inhalt.texte.entlangDer45Achse} /></strong><MdText text={inhalt.texte.beideProbenLiegenGemeinsam} /></div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-home-grau/20">
                      <strong className="text-slate-900 block mb-0.5"><MdText text={inhalt.texte.querZur45Achse} /></strong><MdText text={inhalt.texte.eineProbeIstHoch} /></div>
                  </div>
                </div>

              </div>
            </div>

            {/* In-depth Knowledge Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-xs font-sans">
              
              <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-shiraz font-bold text-sm">
                  <ShieldCheck size={18} />
                  <span><MdText text={inhalt.texte.akkreditierungRecht} /></span>
                </div>
                <p className="text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dinEnIsoIec2} /></p>
              </div>

              <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-shiraz font-bold text-sm">
                  <Calculator size={18} />
                  <span><MdText text={inhalt.texte.robusteStatistikAlgorithmusA} /></span>
                </div>
                <p className="text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.damitGrobeAusreißerEinzelner} /><FormulaText text="X" /><MdText text={inhalt.texte.undDieStandardabweichung} /><FormulaText text="\sigma_{\text{pt}}" /><MdText text={inhalt.texte.häufigMittelsRobusterStatistik} /></p>
              </div>

              <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-shiraz font-bold text-sm">
                  <TrendingUp size={18} />
                  <span><MdText text={inhalt.texte.typischeFehlerquellenImBaulabor} /></span>
                </div>
                <p className="text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.häufigeUrsachenFürNicht} /><FormulaText text="0{,}0006 \cdot d" /><MdText text={inhalt.texte.falscheBelastungsgeschwindigkeitSollNach} /><FormulaText text="0{,}6 \pm 0{,}2\,\text{MPa/s}" /><MdText text={inhalt.texte.oderReibungImKugelgelenk} /></p>
              </div>

            </div>

          </div>
        </div>
      )}

      </ModuleTabs>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <div className="flex flex-col gap-6">
        <FormulaDerivationBox
          title={inhalt.werte.beispiel1UnsicherheitsbudgetEiner}
          zielGleichung="U = k \cdot \sqrt{u_A^2 + u_{B,1}^2 + u_{B,2}^2}"
          schritte={inhalt.daten["MessenPruefen.schritte"]}
          ergebnisHinweis={inhalt.werte.ergebnis388Mpa}
          normQuelle={inhalt.werte.jcgm1002008Gum}
        />
        <FormulaDerivationBox
          title={inhalt.werte.beispiel2RingversuchZ}
          zielGleichung="z = \frac{x_{lab} - X}{\sigma_{pt}},\qquad E_n = \frac{x_{lab} - X}{\sqrt{U_{lab}^2 + U_{ref}^2}}"
          schritte={inhalt.daten["MessenPruefen.schritte_2"]}
          ergebnisHinweis={inhalt.werte.beideKennzahlenZeigenEine}
          normQuelle={inhalt.werte.dinIso135282025}
        />
      </div>

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="messen_pruefen" />

      {/* --- Footer Integration --- */}
      <ModuleFooter 
        weblinks={[
          { title: inhalt.werte.dkdDeutscherKalibrierdienstRichtlinien, url: "https://www.dkd.ptb.de/" },
          { title: inhalt.werte.gumBipmOfficialGuide, url: "https://www.bipm.org/en/committees/jc/jcgm/publications" },
          inhalt.daten["MessenPruefen.weblinks.2"]
        ]}
        wikipedia={[
          { title: 'Messtechnik', url: 'https://de.wikipedia.org/wiki/Messtechnik' },
          { title: 'Messunsicherheit', url: 'https://de.wikipedia.org/wiki/Messunsicherheit' },
          { title: 'Kalibrierung', url: 'https://de.wikipedia.org/wiki/Kalibrierung' },
          { title: 'Ringversuch', url: 'https://de.wikipedia.org/wiki/Ringversuch' }
        ]}
        regelwerke={inhalt.daten["MessenPruefen.regelwerke"]}
        literatur={inhalt.daten["MessenPruefen.literatur"]}
        formeln={inhalt.daten["MessenPruefen.formeln"]}
        lastReviewed={inhalt.werte.oktober2026Ap4}
      />

    </div>
  );
}
