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
  const parsedData = useMemo(() => {
    // Deutsche Eingabe: Semikolon als Trenner, Dezimalkomma. Ohne Semikolon wird (wie bisher)
    // am Komma getrennt und der Punkt als Dezimaltrenner gelesen.
    const teile = measurements.includes(';')
      ? measurements.split(';').map(v => v.trim().replace(',', '.'))
      : measurements.split(',').map(v => v.trim());
    return teile
      .map(v => parseFloat(v))
      .filter(v => Number.isFinite(v));
  }, [measurements]);

  // Calculations according to GUM
  const {
    mean,
    sampleStdDev,
    uA,          // Type A Standard Uncertainty
    uB1,         // Type B from Resolution
    uB2,         // Type B from Certificate
    uc,          // Combined Standard Uncertainty
    expandedU,    // Expanded Uncertainty (k=2)
    minInterval,
    maxInterval
  } = useMemo(() => {
    const n = parsedData.length;
    if (n < 2) {
      return {
        mean: n === 1 ? parsedData[0] : 0,
        sampleStdDev: 0,
        uA: 0,
        uB1: 0,
        uB2: 0,
        uc: 0,
        expandedU: 0,
        minInterval: 0,
        maxInterval: 0
      };
    }

    // Mean
    const sum = parsedData.reduce((acc, curr) => acc + curr, 0);
    const m = sum / n;

    // Sample Standard Deviation
    const sqDiffSum = parsedData.reduce((acc, curr) => acc + Math.pow(curr - m, 2), 0);
    const s = Math.sqrt(sqDiffSum / (n - 1));

    // Type A uncertainty: uA = s / sqrt(n)
    const stdU_A = s / Math.sqrt(n);

    // Type B1 uncertainty (rectangular distribution from resolution d): uB1 = d / (2 * sqrt(3))
    const stdU_B1 = resolution / (2 * Math.sqrt(3));

    // Type B2 uncertainty (normal distribution from standard calibration cert k=2): uB2 = U_cal / 2
    const stdU_B2 = calibrationError / 2;

    // Combined Standard Uncertainty: uc = sqrt(uA^2 + uB1^2 + uB2^2)
    const combinedU = Math.sqrt(Math.pow(stdU_A, 2) + Math.pow(stdU_B1, 2) + Math.pow(stdU_B2, 2));

    // Expanded Uncertainty with k=2 (95.45% confidence)
    const expU = 2 * combinedU;

    return {
      mean: m,
      sampleStdDev: s,
      uA: stdU_A,
      uB1: stdU_B1,
      uB2: stdU_B2,
      uc: combinedU,
      expandedU: expU,
      minInterval: m - expU,
      maxInterval: m + expU
    };
  }, [parsedData, resolution, calibrationError]);

  // Statistical evaluation of the Round-Robin Ringversuch
  const rvStats = useMemo(() => {
    const dVal = rvMeasuredValue - rvAssignedValue;
    const zScore = rvSigmaPT > 0 ? dVal / rvSigmaPT : 0;
    const absZ = Math.abs(zScore);
    const zStatus: 'ok' | 'warning' | 'critical' = absZ <= 2.0 ? 'ok' : absZ < 3.0 ? 'warning' : 'critical';

    const denomEn = Math.sqrt(Math.pow(rvULab, 2) + Math.pow(rvURef, 2));
    const enScore = denomEn > 0 ? dVal / denomEn : 0;
    const absEn = Math.abs(enScore);
    const enStatus: 'ok' | 'critical' = absEn <= 1.0 ? 'ok' : 'critical';

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

    const currentLab = {
      a: rvMeasuredValue,
      b: rvAssignedValue + rvProbeBOffset + (rvMeasuredValue - rvAssignedValue) * 0.95
    };

    return {
      dVal,
      zScore,
      absZ,
      zStatus,
      denomEn,
      enScore,
      absEn,
      enStatus,
      baseLabs,
      currentLab
    };
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
          <Scale className="text-shiraz" /> Messen &amp; Prüfen im Baulabor
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Metrologische Grundlagen der Baustoffprüfung: Begriffe und Normen zur Genauigkeit von Messverfahren (ISO 5725-1), zur Kalibrierung von Prüfmaschinen (DIN EN ISO 7500-1) und zur Ermittlung der Messunsicherheit nach GUM (JCGM 100) im Rahmen der DIN EN ISO/IEC 17025.
          </p>
        </div>
      </div>

      {/* --- Internal Sub-Navigation Tabs --- */}
      <div className="flex border-b border-home-grau/30 overflow-x-auto bg-white p-1 rounded-xl shadow-sm border">
        <button aria-pressed={activeSubTab === 'begriffe'}
          className={`flex-1 min-w-[150px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'begriffe' 
              ? 'bg-shiraz text-white shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('begriffe')}
        >
          <Settings size={14} /> Begriffe &amp; Definitionen
        </button>
        <button aria-pressed={activeSubTab === 'treffbild'}
          className={`flex-1 min-w-[150px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'treffbild' 
              ? 'bg-shiraz text-white shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('treffbild')}
        >
          <Target size={14} /> Richtigkeit vs. Präzision
        </button>
        <button aria-pressed={activeSubTab === 'messunsicherheit'}
          className={`flex-1 min-w-[150px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'messunsicherheit' 
              ? 'bg-shiraz text-white shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('messunsicherheit')}
        >
          <Calculator size={14} /> GUM Messunsicherheit
        </button>
        <button aria-pressed={activeSubTab === 'pruefstreuung'}
          className={`flex-1 min-w-[150px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'pruefstreuung' 
              ? 'bg-shiraz text-white shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('pruefstreuung')}
        >
          <Layers size={14} /> Prüfstreuungen (r/R)
        </button>
        <button aria-pressed={activeSubTab === 'ringversuche'}
          className={`flex-1 min-w-[150px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'ringversuche' 
              ? 'bg-shiraz text-white shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('ringversuche')}
        >
          <Award size={14} /> Ringversuche (Round-Robin)
        </button>
      </div>

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
        <MessunsicherheitTab measurements={measurements} setMeasurements={setMeasurements} parsedData={parsedData} resolution={resolution} setResolution={setResolution} calibrationError={calibrationError} setCalibrationError={setCalibrationError} mean={mean} sampleStdDev={sampleStdDev} uA={uA} uB1={uB1} uB2={uB2} expandedU={expandedU} minInterval={minInterval} maxInterval={maxInterval} uc={uc} />
      )}

      {/* --- Tab 4: Prüfstreuungen (r/R - Repeatability & Reproducibility) --- */}
      {activeSubTab === 'pruefstreuung' && (
        <div className="space-y-6">
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 font-sans">
              <Layers className="text-shiraz" size={20} /> Prüfstreuungen: Wiederholpräzision vs. Vergleichspräzision
            </h2>
            <p className="text-slate-600 text-xs leading-relaxed max-w-4xl font-sans">
              Wenn Prüfungen unter geringfügig wechselnden Randbedingungen durchgeführt werden (anderer Bediener, geändertes Prüfgerät, andere Kalibrierniveaus), 
              nimmt die Streuung der Messergebnisse zu. Nach ISO 5725 wird zwischen der Wiederholgrenze <FormulaText text="r" /> 
              und Vergleichsgrenze <FormulaText text="R" />.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              
              {/* Repeatability (Wiederholbedingungen) */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50 relative hover:bg-white transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start font-sans">
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">Wiederholpräzision (r)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Repeatability</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2.5 font-sans">Gleiches Labor, engster Raum</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans">
                    Gibt das Ausmaß der Abweichung zwischen unabhängigen Prüfergebnissen an, die mit derselben Methode unter identischen Bedingungen ermittelt werden:
                  </p>
                  
                  <ul className="space-y-1.5 text-xs text-slate-600 mt-3 list-none font-sans">
                    <li className="flex items-center gap-1.5"><span className="text-emerald-500">•</span> Gleicher Prüfer / derselbe Bediener</li>
                    <li className="flex items-center gap-1.5"><span className="text-emerald-500">•</span> Gleiche Prüfmaschine / dasselbe Messsystem</li>
                    <li className="flex items-center gap-1.5"><span className="text-emerald-500">•</span> Kurzer zeitlicher Abstand (unmittelbarer Versuchsnachlauf)</li>
                  </ul>
                  <p className="text-xs text-slate-500 leading-relaxed mt-3 font-sans">
                    Statistisch gilt die Wiederholgrenze: <FormulaText text="r = 2{,}8 \cdot \sigma_r" /> (mit <FormulaText text="\sigma_r" /> als Wiederholstandardabweichung). 
                    Die Differenz zweier Einzelergebnisse überschreitet r nur mit etwa 5 % Wahrscheinlichkeit (2,8 ≈ 1,96 · √2).
                  </p>
                </div>
                <div className="mt-4 pt-3 text-[10px] text-slate-400 font-mono italic leading-normal border-t border-home-grau/30">
                  Wird zur internen Qualitätskontrolle des Labors (Überprüfung von Bedienerfehlern) genutzt.
                </div>
              </div>

              {/* Reproducibility (Vergleichsbedingungen) */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50 relative hover:bg-white transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start font-sans">
                    <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded uppercase">Vergleichspräzision (R)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Reproducibility</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2.5 font-sans">Unterschiedliche Labore, Ringversuche</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans">
                    Gibt das Ausmaß der Abweichung zwischen unabhängigen Prüfergebnissen an, die mit derselben Methode in verschiedenen Institutionen ermittelt werden:
                  </p>
                  
                  <ul className="space-y-1.5 text-xs text-slate-600 mt-3 list-none font-sans">
                    <li className="flex items-center gap-1.5"><span className="text-purple-500">•</span> Unterschiedliche Laboranten</li>
                    <li className="flex items-center gap-1.5"><span className="text-purple-500">•</span> Völlig unterschiedliche Prüfmaschinen / Hersteller</li>
                    <li className="flex items-center gap-1.5"><span className="text-purple-500">•</span> Größerer zeitlicher Verzug (z. B. Wochen oder Monate)</li>
                  </ul>
                  <p className="text-xs text-slate-500 leading-relaxed mt-3 font-sans">
                    Statistisch gilt die Vergleichsgrenze: <FormulaText text="R = 2{,}8 \cdot \sigma_R" /> (mit <FormulaText text="\sigma_R" /> als Vergleichsstandardabweichung). 
                    Die Differenz zweier Ergebnisse aus verschiedenen Laboren überschreitet R nur mit etwa 5 % Wahrscheinlichkeit.
                  </p>
                </div>
                <div className="mt-4 pt-3 text-[10px] text-slate-400 font-mono italic leading-normal border-t border-home-grau/30">
                  Die systematische Relevanz zeigt sich bei Schiedsuntersuchungen und Ringversuchen (Cross-Testing).
                </div>
              </div>

            </div>
          </div>

          {/* Practical Relevance Card */}
          <div className="p-4 bg-white rounded-xl border border-home-grau/25 border-l-4 border-l-amber-500 text-xs text-slate-800 flex gap-2 font-sans">
            <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Praktische Relevanz bei Baustoff-Konformität:</strong> 
              Bei der Festigkeitsbewertung von Transportbeton oder Asphaltbelägen sind die Vergleichs- und Wiederholgrenzen von herausragender Bedeutung. 
              Weichen die Zylinderfestigkeiten zwischen dem Herstellerwerk und einem externen Prüflabor ab, ist zuerst zu prüfen, ob die Differenz die Vergleichsgrenze 
              (<FormulaText text="R" />) überhaupt überschreitet – erst dann ist sie messtechnisch signifikant und als Grundlage für Mängelansprüche (z. B. nach VOB/B) belastbar.
            </div>
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
                <Award className="text-shiraz" size={22} /> Ringversuche &amp; Eignungsprüfungen (Round-Robin Tests)
              </h2>
              <span className="text-xs font-mono font-bold text-slate-500 bg-off-white px-2.5 py-1 rounded-lg border border-home-grau/20">
                DIN EN ISO/IEC 17043 &bull; DIN ISO 13528
              </span>
            </div>
            
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
              <p>
                <strong>Ringversuche (Proficiency Testing / Interlaboratory Comparisons)</strong> sind das zentrale externe Instrument zur Sicherung der Prüfqualität akkreditierter Baustoffprüfstellen nach <strong>DIN EN ISO/IEC 17025</strong>. 
                Homogene, identische Proben (z.&nbsp;B. Betonwürfel, Zementnormmörtel, Bitumenchargen) werden an Dutzende unabhängige Labore versandt und &bdquo;blind&ldquo; nach genormten Prüfverfahren untersucht. Die Auswertung deckt systematische Prüfmaschinenfehler, Kalibrierdrifts und Bedienerabweichungen auf.
              </p>
            </div>

            {/* Metrological Simulator Cockpit */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
              
              {/* Inputs Column (5 cols) */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4 text-xs font-sans">
                <div className="flex items-center justify-between pb-2 border-b border-home-grau/20">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Settings size={14} className="text-shiraz" /> Eingangsdaten des Prüflabors
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Simulationsparameter</span>
                </div>

                {/* Input: Measured Value x_lab */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-slate-700">Eigenes Prüfergebnis (<FormulaText text="x_{\text{lab}}" />):</label>
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
                  <span className="text-[10px] text-slate-400 block">z. B. Zylinderdruckfestigkeit (DIN EN 12390-3)</span>
                </div>

                {/* Input: Assigned Reference Value X */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-slate-700">Referenzwert des Ringversuchs (<FormulaText text="X" />):</label>
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
                  <span className="text-[10px] text-slate-400 block">z. B. robuster Mittelwert der Teilnehmer (Algorithmus A nach DIN ISO 13528)</span>
                </div>

                {/* Input: Sigma_pt */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-slate-700">Ziel-Standardabweichung (<FormulaText text="\sigma_{\text{pt}}" />):</label>
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
                  <span className="text-[10px] text-slate-400 block">Vom Anbieter festgelegte Standardabweichung für die Eignungsbeurteilung</span>
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
                    <span className="text-[9px] text-slate-400 block">Unsicherheit Labor</span>
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
                    <span className="text-[9px] text-slate-400 block">Unsicherheit Referenz</span>
                  </div>
                </div>

                {/* Preset Scenarios */}
                <div className="pt-2 border-t border-home-grau/20 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Test-Szenarien laden:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => { setRvMeasuredValue(49.8); setRvAssignedValue(50.0); setRvSigmaPT(1.8); setRvULab(1.2); setRvURef(0.5); }}
                      className="px-2 py-1 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 rounded text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Exzellent (|z| &lt; 0,2)
                    </button>
                    <button
                      onClick={() => { setRvMeasuredValue(46.0); setRvAssignedValue(50.0); setRvSigmaPT(1.8); setRvULab(1.4); setRvURef(0.6); }}
                      className="px-2 py-1 bg-white hover:bg-amber-50 border border-amber-300 text-amber-800 rounded text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Warnsignal (2 &lt; |z| &lt; 3)
                    </button>
                    <button
                      onClick={() => { setRvMeasuredValue(43.5); setRvAssignedValue(50.0); setRvSigmaPT(1.8); setRvULab(1.5); setRvURef(0.6); }}
                      className="px-2 py-1 bg-white hover:bg-red-50 border border-red-300 text-red-800 rounded text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Nichtkonform (|z| ≥ 3,0)
                    </button>
                  </div>
                </div>
              </div>

              {/* Evaluation Output Column (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {/* Metric Cards (z-Score & En-Zahl) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Card 1: z-Score */}
                  <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    rvStats.zStatus === 'ok' 
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
                          rvStats.zStatus === 'ok' ? 'bg-emerald-600 text-white' :
                          rvStats.zStatus === 'warning' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white animate-pulse'
                        }`}>
                          {rvStats.zStatus === 'ok' ? 'Zufriedenstellend' : rvStats.zStatus === 'warning' ? 'Warnsignal' : 'Nicht akzeptabel'}
                        </span>
                      </div>
                      
                      <div className="mt-3">
                        <span className="text-xs text-slate-600 font-medium">Standardisierter Kennwert:</span>
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
                          <CheckCircle2 size={14} className="shrink-0" /> |z| ≤ 2,0: zufriedenstellende Leistung nach DIN ISO 13528.
                        </span>
                      )}
                      {rvStats.zStatus === 'warning' && (
                        <span className="text-amber-800 font-medium flex items-center gap-1.5">
                          <AlertTriangle size={14} className="shrink-0" /> 2,0 &lt; |z| &lt; 3,0: fragwürdiges Ergebnis (Warnsignal). Laborinterne Prüfung empfohlen.
                        </span>
                      )}
                      {rvStats.zStatus === 'critical' && (
                        <span className="text-rose-800 font-bold flex items-center gap-1.5">
                          <AlertTriangle size={14} className="shrink-0" /> |z| ≥ 3,0: nicht zufriedenstellend (Eingriffssignal). Nach DIN EN ISO/IEC 17025 sind Ursachenanalyse &amp; Korrekturmaßnahmen erforderlich.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card 2: En-Zahl */}
                  <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    rvStats.enStatus === 'ok' 
                      ? 'bg-blue-50/70 border-blue-300' 
                      : 'bg-rose-50/70 border-rose-300'
                  }`}>
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border bg-white text-slate-800 border-home-grau/30">
                          Messunsicherheits-Check
                        </span>
                        <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full ${
                          rvStats.enStatus === 'ok' ? 'bg-blue-600 text-white' : 'bg-rose-600 text-white animate-pulse'
                        }`}>
                          {rvStats.enStatus === 'ok' ? '|En| ≤ 1,0 (zufriedenstellend)' : '|En| > 1,0 (nicht zufriedenstellend)'}
                        </span>
                      </div>

                      <div className="mt-3">
                        <span className="text-xs text-slate-600 font-medium">Metrologische En-Zahl:</span>
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
                      {rvStats.enStatus === 'ok' ? (
                        <span className="text-blue-900 font-medium flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="shrink-0 text-blue-700" /> Die deklarierte Messunsicherheit deckt die Abweichung statistisch plausibel ab.
                        </span>
                      ) : (
                        <span className="text-rose-800 font-bold flex items-center gap-1.5">
                          <AlertTriangle size={14} className="shrink-0 text-rose-600" /> Messunsicherheit unterschätzt oder signifikante systematische Kalibrierabweichung!
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Youden-Plot (Zwei-Proben-Diagramm) */}
                <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-home-grau/20">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 font-sans">
                        <Target size={15} className="text-shiraz" /> Interaktiver Youden-Plot (Zwei-Proben-Diagnostik)
                      </h4>
                      <p className="text-[10px] text-slate-500 font-sans">
                        W. J. Youden-Methode: Trennung von systematischen Laborfehlern von zufälligen Streuungen.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Probe A vs. Probe B
                    </span>
                  </div>

                  {/* SVG Youden-Plot Canvas */}
                  <div className="w-full bg-slate-900 rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
                    <svg width="100%" height="220" viewBox="0 0 460 220" className="select-none">
                      {/* Grid Lines */}
                      <line x1="30" y1="110" x2="430" y2="110" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="230" y1="20" x2="230" y2="200" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />

                      {/* 45-Degree Diagonal Line (Systematic Error Axis) */}
                      <line x1="60" y1="180" x2="400" y2="40" stroke="#64748b" strokeWidth="1.5" strokeDasharray="5,3" />
                      <text x="390" y="32" fill="#94a3b8" fontSize="9" fontWeight="bold">45°-Systematik-Achse</text>

                      {/* Tolerance Ellipse (Confidence Zone 95%) */}
                      <ellipse cx="230" cy="110" rx="90" ry="38" transform="rotate(-23 230 110)" fill="rgba(16, 185, 129, 0.08)" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,2" />

                      {/* Reference Center Cross (X_A, X_B) */}
                      <circle cx="230" cy="110" r="4" fill="#38bdf8" />
                      <text x="238" y="106" fill="#38bdf8" fontSize="9" fontWeight="bold">Referenzzentrum (X)</text>

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
                            fill="#94a3b8"
                            opacity="0.75"
                          />
                        );
                      })}

                      {/* Current Laboratory Point (Highlighted) */}
                      {(() => {
                        const curX = Math.max(35, Math.min(425, 230 + (rvStats.currentLab.a - 50.0) * 28));
                        const curY = Math.max(25, Math.min(195, 110 - (rvStats.currentLab.b - 48.0) * 28));
                        const col = rvStats.zStatus === 'ok' ? '#22c55e' : rvStats.zStatus === 'warning' ? '#f59e0b' : '#ef4444';
                        return (
                          <g>
                            {/* Pulse Aura */}
                            <circle cx={curX} cy={curY} r="9" fill={col} opacity="0.35" className="animate-ping" />
                            {/* Outer Border */}
                            <circle cx={curX} cy={curY} r="6.5" fill="#ffffff" stroke={col} strokeWidth="2.5" />
                            {/* Center Dot */}
                            <circle cx={curX} cy={curY} r="3" fill={col} />
                            {/* Label */}
                            <rect x={curX - 45} y={curY - 24} width="90" height="16" fill="rgba(15, 23, 42, 0.9)" rx="3" stroke={col} strokeWidth="1" />
                            <text x={curX} y={curY - 13} textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">
                              Ihr Labor (z={formatDeZahl(rvStats.zScore, 1)})
                            </text>
                          </g>
                        );
                      })()}

                      {/* Axis Labels */}
                      <text x="425" y="125" textAnchor="end" fill="#cbd5e1" fontSize="9">Probe A (MPa) &rarr;</text>
                      <text x="240" y="28" fill="#cbd5e1" fontSize="9">&uarr; Probe B (MPa)</text>
                    </svg>

                    <div className="w-full flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>• Graue Punkte = 18 teilnehmende Baustofflabore</span>
                      <span>• Grüne Ellipse = schematischer Bereich üblicher Streuung</span>
                    </div>
                  </div>

                  {/* Youden Interpretation Guide */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 font-sans pt-1">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-home-grau/20">
                      <strong className="text-slate-900 block mb-0.5">Entlang der 45°-Achse (Diagonale):</strong>
                      Beide Proben liegen gemeinsam zu hoch oder zu niedrig. Ursache ist ein <strong>systematischer Laborfehler</strong> (z.&nbsp;B. Kraftmesszelle falsch kalibriert, Trockenofentemperatur fehlerhaft).
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-home-grau/20">
                      <strong className="text-slate-900 block mb-0.5">Quer zur 45°-Achse:</strong>
                      Eine Probe ist hoch, die andere niedrig. Ursache ist ein <strong>zufälliger Fehler</strong> (z.&nbsp;B. schiefe Druckflächen des Prüfkörpers, unvollständige Verdichtung, Bedienerfehler).
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* In-depth Knowledge Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-xs font-sans">
              
              <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-shiraz font-bold text-sm">
                  <ShieldCheck size={18} />
                  <span>Akkreditierung &amp; Recht</span>
                </div>
                <p className="text-text-main/80 leading-relaxed">
                  <strong>DIN EN ISO/IEC 17025 (Abschn. 7.7.2)</strong> verlangt, dass Laboratorien ihre Leistung durch Vergleich mit anderen Laboratorien überwachen, soweit verfügbar und angemessen – in der Praxis durch Eignungsprüfungen, deren Teilnahme die DAkkS bei Akkreditierungen einfordert. Im Straßenbau setzt die Anerkennung von Prüfstellen nach <strong>RAP Stra</strong> die regelmäßige erfolgreiche Teilnahme an Vergleichsprüfungen voraus.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-shiraz font-bold text-sm">
                  <Calculator size={18} />
                  <span>Robuste Statistik (Algorithmus A)</span>
                </div>
                <p className="text-text-main/80 leading-relaxed">
                  Damit grobe Ausreißer einzelner Labore das Gesamtergebnis nicht verzerren, berechnet der Ringversuchsveranstalter den Referenzwert <FormulaText text="X" /> und die Standardabweichung <FormulaText text="\sigma_{\text{pt}}" /> häufig mittels <strong>robuster Statistik (Algorithmus A nach DIN ISO 13528)</strong> statt eines einfachen arithmetischen Mittels.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-shiraz font-bold text-sm">
                  <TrendingUp size={18} />
                  <span>Typische Fehlerquellen im Baulabor</span>
                </div>
                <p className="text-text-main/80 leading-relaxed">
                  Häufige Ursachen für &bdquo;Nicht zufriedenstellende&ldquo; Ringversuchsergebnisse: nicht ebene Druckflächen (Ebenheitstoleranz nach DIN EN 12390-1: <FormulaText text="0{,}0006 \cdot d" />), falsche Belastungsgeschwindigkeit (Soll nach DIN EN 12390-3: <FormulaText text="0{,}6 \pm 0{,}2\,\text{MPa/s}" />) oder Reibung im Kugelgelenk der oberen Druckplatte.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <div className="flex flex-col gap-6">
        <FormulaDerivationBox
          title="Beispiel 1: Unsicherheitsbudget einer Würfeldruckprüfung"
          zielGleichung="U = k \cdot \sqrt{u_A^2 + u_{B,1}^2 + u_{B,2}^2}"
          schritte={[
            { titel: 'Messreihe', erklaerung: 'Fünf Würfel derselben Charge: 38,5 / 39,2 / 37,8 / 38,9 / 39,6 MPa. Mittelwert und Standardabweichung:', formel: '\\bar{x} = 38{,}80\\,\\text{MPa},\\quad s = 0{,}69\\,\\text{MPa}' },
            { titel: 'Typ A (Streuung des Mittelwerts)', erklaerung: 'Standardunsicherheit des Mittelwerts aus n = 5 Werten:', formel: 'u_A = \\frac{0{,}69}{\\sqrt{5}} = 0{,}31\\,\\text{MPa}' },
            { titel: 'Typ B (Auflösung und Kalibrierung)', erklaerung: 'Anzeigeauflösung d = 0,1 MPa (Rechteckverteilung) und Kalibrierschein U_cal = 0,15 MPa mit k = 2:', formel: 'u_{B,1} = \\frac{0{,}1}{\\sqrt{12}} = 0{,}029,\\quad u_{B,2} = \\frac{0{,}15}{2} = 0{,}075\\,\\text{MPa}' },
            { titel: 'Kombinieren und erweitern', erklaerung: 'Quadratische Addition, dann Erweiterung mit k = 2:', formel: 'u_c = \\sqrt{0{,}31^2 + 0{,}029^2 + 0{,}075^2} = 0{,}32,\\quad U = 0{,}64\\,\\text{MPa}' }
          ]}
          ergebnisHinweis="Ergebnis: 38,8 MPa ± 0,6 MPa (k = 2). Der Typ-A-Anteil dominiert – mehr Probekörper verringern die Unsicherheit stärker als eine feinere Anzeige."
          normQuelle="JCGM 100:2008 (GUM), Abschn. 4.2, 4.3.7, 5.1.2, 6.2"
        />
        <FormulaDerivationBox
          title="Beispiel 2: Ringversuch – z-Score und En-Zahl bewerten"
          zielGleichung="z = \frac{x_{lab} - X}{\sigma_{pt}},\qquad E_n = \frac{x_{lab} - X}{\sqrt{U_{lab}^2 + U_{ref}^2}}"
          schritte={[
            { titel: 'Gegeben', erklaerung: 'Eigenes Ergebnis 46,0 MPa, zugewiesener Wert X = 50,0 MPa, σ_pt = 1,8 MPa, U_lab = 1,4 MPa, U_ref = 0,6 MPa (jeweils k = 2).', formel: 'x_{lab} - X = -4{,}0\\,\\text{MPa}' },
            { titel: 'z-Score', erklaerung: 'Nach DIN ISO 13528: |z| ≤ 2 zufriedenstellend, 2 < |z| < 3 fragwürdig, |z| ≥ 3 nicht zufriedenstellend.', formel: 'z = \\frac{-4{,}0}{1{,}8} = -2{,}22 \\;\\Rightarrow\\; \\text{Warnsignal}' },
            { titel: 'En-Zahl', erklaerung: 'Bezieht die angegebenen Messunsicherheiten ein; |En| ≤ 1 ist zufriedenstellend.', formel: 'E_n = \\frac{-4{,}0}{\\sqrt{1{,}4^2 + 0{,}6^2}} = \\frac{-4{,}0}{1{,}52} = -2{,}63' }
          ]}
          ergebnisHinweis="Beide Kennzahlen zeigen eine zu niedrige Festigkeit. |En| > 1 bedeutet zusätzlich, dass die angegebene Laborunsicherheit die Abweichung nicht erklärt – Kalibrierung der Presse und Probenvorbereitung prüfen."
          normQuelle="DIN ISO 13528:2025-07; DIN EN ISO/IEC 17043:2023-10"
        />
      </div>

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="messen_pruefen" />

      {/* --- Footer Integration --- */}
      <ModuleFooter 
        weblinks={[
          { title: "DKD - Deutscher Kalibrierdienst Richtlinien", url: "https://www.ptb.de/cms/de/metrologische-dienstleistungen/dkd.html" },
          { title: "GUM - BIPM Official Guide", url: "https://www.bipm.org/en/committees/jc/jcgm/publications" },
          { title: "DAkkS - Deutsche Akkreditierungsstelle Ringversuche", url: "https://www.dakks.de" }
        ]}
        wikipedia={[
          { title: 'Messtechnik', url: 'https://de.wikipedia.org/wiki/Messtechnik' },
          { title: 'Messunsicherheit', url: 'https://de.wikipedia.org/wiki/Messunsicherheit' },
          { title: 'Kalibrierung', url: 'https://de.wikipedia.org/wiki/Kalibrierung' },
          { title: 'Ringversuch', url: 'https://de.wikipedia.org/wiki/Ringversuch' }
        ]}
        regelwerke={[
          { title: 'DIN EN ISO/IEC 17025:2018-03 (Allgemeine Anforderungen an die Kompetenz von Prüf- und Kalibrierlaboratorien)' },
          { title: 'DIN EN ISO/IEC 17043:2023-10 + A11:2024-09 (Konformitätsbewertung – Anforderungen an Anbieter von Eignungsprüfungen)' },
          { title: 'DIN ISO 13528:2025-07 (Statistische Verfahren für Eignungsprüfungen durch Vergleiche zwischen Laboratorien)' },
          { title: 'ISO 5725-1:2023-07 (Genauigkeit (Richtigkeit und Präzision) von Messverfahren und Messergebnissen – Teil 1); DIN ISO 5725-1:1997-11 zurückgezogen' },
          { title: 'DIN EN ISO 7500-1:2018-06 (Kalibrierung und Überprüfung von Zug- und Druckprüfmaschinen – Kraftmesssystem)' },
          { title: 'DIN EN ISO 13385-1:2020-03 (Messschieber; ersetzt DIN 862:2015-03)' },
          { title: 'DIN ISO 17123-2:2023-12 (Feldprüfverfahren geodätischer Instrumente – Nivelliere)' },
          { title: 'Mess- und Eichgesetz (MessEG) und Mess- und Eichverordnung (MessEV)', url: 'https://www.gesetze-im-internet.de/messeg/' },
          { title: 'JCGM 100:2008 (Guide to the expression of uncertainty in measurement - GUM)', url: 'https://www.bipm.org/en/committees/jc/jcgm/publications' }
        ]}
        literatur={[
          'Gerlach, G.; Sommer, K.-D.: Messunsicherheit – kurz und praktisch für Ingenieure und Naturwissenschaftler. Berlin: De Gruyter 2024',
          'Funk, W.; Dammann, V.; Donnevert, G.: Qualitätssicherung in der Analytischen Chemie. 2. Aufl., Weinheim: Wiley-VCH 2005',
          'JCGM 100:2008: Evaluation of measurement data – Guide to the expression of uncertainty in measurement (GUM). BIPM 2008'
        ]}
        formeln={[
          {
            formel: 'z = \\frac{x_i - X}{\\sigma_{pt}}',
            erklaerung: 'z-Score zur Bewertung der Laborleistung in Eignungsprüfungen. |z| ≤ 2 zufriedenstellend, 2 < |z| < 3 fragwürdig, |z| ≥ 3 nicht zufriedenstellend.',
            quelle: 'DIN ISO 13528:2025-07'
          },
          {
            formel: 'E_n = \\frac{x_{lab} - X_{ref}}{\\sqrt{U_{lab}^2 + U_{ref}^2}}',
            erklaerung: 'En-Zahl zur Beurteilung der Messwertübereinstimmung unter Berücksichtigung der erweiterten Messunsicherheiten (k=2). Werte |En| ≤ 1,0 sind zufriedenstellend.',
            quelle: 'DIN ISO 13528:2025-07'
          },
          {
            formel: 'u_A = \\frac{s}{\\sqrt{n}}',
            erklaerung: 'Standardunsicherheit Typ A (empirische Standardabweichung des Mittelwerts).',
            quelle: 'JCGM 100:2008 (GUM) Abschn. 4.2.3'
          },
          {
            formel: 'u_{B,1} = \\frac{d}{2\\sqrt{3}}',
            erklaerung: 'Standardunsicherheit Typ B aus der Auflösung d unter Annahme einer Rechteckverteilung.',
            quelle: 'JCGM 100:2008 (GUM) Abschn. 4.3.7, F.2.2.1'
          },
          {
            formel: 'u_c = \\sqrt{u_A^2 + u_{B,1}^2 + u_{B,2}^2}',
            erklaerung: 'Kombinierte Standardunsicherheit nach dem Fortpflanzungsgesetz bei unkorrelierten Eingangsgrößen (Empfindlichkeitskoeffizienten hier 1).',
            quelle: 'JCGM 100:2008 (GUM) Abschn. 5.1.2'
          },
          {
            formel: 'U = k \\cdot u_c',
            erklaerung: 'Erweiterte Messunsicherheit mit dem Erweiterungsfaktor k = 2 für eine Überdeckungswahrscheinlichkeit von etwa 95 % (bei Normalverteilung).',
            quelle: 'JCGM 100:2008 (GUM) Abschn. 6.2'
          }
        ]}
        lastReviewed="Oktober 2026 (AP 4 Labor: Begriffe nach ISO 5725-1/MessEG, GUM-Budget, Präzisionsgrenzen und Eignungsprüfung nach DIN ISO 13528:2025-07 geprüft; fachliche Freigabe durch den Autor ausstehend)"
      />

    </div>
  );
}
