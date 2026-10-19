import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  Target, 
  Calculator, 
  Layers, 
  HelpCircle, 
  Info, 
  Settings, 
  CheckCircle2, 
  FileText, 
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
        <button
          className={`flex-1 min-w-[150px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'begriffe' 
              ? 'bg-shiraz text-white shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('begriffe')}
        >
          <Settings size={14} /> Begriffe &amp; Definitionen
        </button>
        <button
          className={`flex-1 min-w-[150px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'treffbild' 
              ? 'bg-shiraz text-white shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('treffbild')}
        >
          <Target size={14} /> Richtigkeit vs. Präzision
        </button>
        <button
          className={`flex-1 min-w-[150px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'messunsicherheit' 
              ? 'bg-shiraz text-white shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('messunsicherheit')}
        >
          <Calculator size={14} /> GUM Messunsicherheit
        </button>
        <button
          className={`flex-1 min-w-[150px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'pruefstreuung' 
              ? 'bg-shiraz text-white shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('pruefstreuung')}
        >
          <Layers size={14} /> Prüfstreuungen (r/R)
        </button>
        <button
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
        <div className="space-y-6">
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Settings className="text-shiraz" size={20} /> Kalibrieren, Justieren, Eichen vergleichen
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Im alltäglichen Laborbetrieb werden diese drei Begriffe fälschlicherweise oft synonym verwendet. 
              Sie bezeichnen jedoch grundlegend verschiedene physikalische und rechtliche Handlungen an einer Prüfeinrichtung (z. B. Betonpresse oder Rückprallhammer).
          </p>
        </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              
              {/* Kalibrieren */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50 hover:bg-white transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">Kalibrieren</span>
                    <span className="text-[10px] text-slate-400 font-mono">Kein Eingriff</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2.5 font-sans">Zusammenhang ermitteln</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans">
                    Ermitteln der Messabweichung zwischen dem angezeigten Wert des Prüfgeräts und dem bekannten Wert eines höherwertigen, rückgeführten Normals (Bezugswert). 
                    Der gemessene Wert wird in einem <strong>Kalibrierschein</strong> protokolliert.
                  </p>
                  <blockquote className="border-l-2 border-shiraz/40 pl-2.5 text-[11px] text-slate-600 italic mt-3 font-sans">
                    Beispiel: Kalibrierung des Kraftmesssystems einer Betonprüfmaschine mit rückgeführten Referenz-Kraftaufnehmern nach DIN EN ISO 7500-1 (für Betonprüfmaschinen nach DIN EN 12390-4 mindestens Klasse 1).
                  </blockquote>
                </div>
                <div className="mt-4 pt-3.5 border-t border-home-grau/30 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                  <CheckCircle2 size={12} className="text-emerald-500" /> Dokumentiert systematische Abweichung.
                </div>
              </div>

              {/* Justieren */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50 hover:bg-white transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">Justieren</span>
                    <span className="text-[10px] text-slate-400 font-mono">Geräte-Eingriff</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2.5 font-sans">Sollwertharmonisierung</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans">
                    Einstellen oder Abgleichen eines Messgeräts, um die systematische Abweichung so gering wie möglich zu halten. Typischerweise wird das Gerät 
                    hierbei bleibend verändert. Dieser Vorgang ist nach einer unzulässigen Kalibrierungsabweichung notwendig.
                  </p>
                  <blockquote className="border-l-2 border-shiraz/40 pl-2.5 text-[11px] text-slate-600 italic mt-3 font-sans">
                    Beispiel: Programmieren und Justieren des Nullpunkts oder Steigungsfaktors im elektronischen Verstärker der Prüfmaschine zur Reduktion systematischer Anzeigefehler.
                  </blockquote>
                </div>
                <div className="mt-4 pt-3.5 border-t border-home-grau/30 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                  <CheckCircle2 size={12} className="text-blue-500" /> Verändert das Geräteverhalten dauerhaft.
                </div>
              </div>

              {/* Eichen */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50 hover:bg-white transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase">Eichen</span>
                    <span className="text-[10px] text-slate-400 font-mono">Gesetzliche Pflicht</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2.5 font-sans">Amtliche Prüfung</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans">
                    Gesetzlich vorgeschriebene Prüfung und Kennzeichnung eines verwendeten Messgeräts durch die Eichbehörde des Landes (oder eine staatlich anerkannte Prüfstelle) nach Mess- und Eichgesetz. 
                    Pflicht gilt u. a. im geschäftlichen Verkehr (Abrechnung nach Messwert) sowie im amtlichen, Medizin- und Umweltbereich.
                  </p>
                  <blockquote className="border-l-2 border-shiraz/40 pl-2.5 text-[11px] text-slate-600 italic mt-3 font-sans">
                    Beispiel: Eichung der Fahrzeugwaage eines Kies- oder Transportbetonwerks, über die Lieferungen nach Gewicht abgerechnet werden. Die Dosierwaagen der Mischanlage werden dagegen im Rahmen der Produktionskontrolle nach DIN EN 206 kalibriert.
                  </blockquote>
                </div>
                <div className="mt-4 pt-3.5 border-t border-home-grau/30 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                  <CheckCircle2 size={12} className="text-amber-500" /> Eichmarke mit Ablauf der Eichfrist, Sicherungsplomben.
                </div>
              </div>

            </div>
          </div>

          {/* Table Comparison Overview */}
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm overflow-x-auto">
            <h3 className="text-sm font-bold text-slate-900 mb-3 font-sans">Direkter Kriterien-Vergleich</h3>
            <table className="min-w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 border-b border-home-grau/30">
                <tr>
                  <th className="py-2.5 px-3">Eigenschaft / Kriterium</th>
                  <th className="py-2.5 px-3">Kalibrieren</th>
                  <th className="py-2.5 px-3">Justieren</th>
                  <th className="py-2.5 px-3">Eichen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Eingriff am Messgerät?</td>
                  <td className="py-2.5 px-3 text-slate-600">Nein (nur Ermittlung und Dokumentation)</td>
                  <td className="py-2.5 px-3 text-slate-600 font-semibold text-blue-700">Ja (mechanische/elektronische Justage)</td>
                  <td className="py-2.5 px-3 text-slate-600">Eventuell (falls Justage während Eichung nötig)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Wer darf es durchführen?</td>
                  <td className="py-2.5 px-3 text-slate-600">Beliebige geschulte Stelle (DAkkS-Labor empfohlen)</td>
                  <td className="py-2.5 px-3 text-slate-600">Prüfgerät-Betreiber, Service-Techniker des Herstellers</td>
                  <td className="py-2.5 px-3 text-slate-600 font-semibold text-amber-700">Eichbehörde oder staatlich anerkannte Prüfstelle</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Rechtliche bzw. normative Grundlage</td>
                  <td className="py-2.5 px-3 text-slate-600">Vertrag/QM: DIN EN ISO 9001, DIN EN ISO/IEC 17025; Prüfnormen (z. B. DIN EN ISO 7500-1)</td>
                  <td className="py-2.5 px-3 text-slate-600">Nutzer-Spezifikation, Hersteller-Wartungshandbuch</td>
                  <td className="py-2.5 px-3 text-slate-600 font-semibold text-amber-700">Mess- und Eichgesetz (MessEG) / MessEV</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Resultat / Beleg</td>
                  <td className="py-2.5 px-3 text-slate-600">Kalibrierschein (Messwerte &amp; -unsicherheiten)</td>
                  <td className="py-2.5 px-3 text-slate-600">Gerät ist &quot;sollwertjustiert&quot; (Justierprotokoll)</td>
                  <td className="py-2.5 px-3 text-slate-600">Eichmarke; Neugeräte: Konformitätsbewertung mit CE- und Metrologie-Kennzeichnung (MessEG)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Sektion: Genauigkeit von Messverfahren im Bauwesen */}
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 font-sans">
              <Scale size={20} className="text-indigo-600" /> Genauigkeit &amp; Toleranzgrenzen gängiger Messverfahren
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed max-w-4xl mb-6 font-sans">
              Jedes Messverfahren unterliegt systematischen und zufälligen Unsicherheiten. Im Baubetrieb und Labor hängen zulässige Toleranzen stark vom eingesetzten Werkzeug und den Normvorgaben ab. Wählen Sie ein Instrument aus, um dessen messtechnische Kenngrößen und die typischen Fehlerquellen auf der Baustelle zu visualisieren.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Linkes Menü: Messgeräte */}
              <div className="lg:col-span-4 space-y-2">
                {[
                  { id: 'meterstab', label: 'Zollstock / Meterstab', sub: 'EU-Genauigkeitsklasse II (MID)' },
                  { id: 'messschieber', label: 'Messschieber (Schieblehre)', sub: 'DIN EN ISO 13385-1' },
                  { id: 'laser', label: 'Laser-Entfernungsmesser', sub: 'ISO 16331-1' },
                  { id: 'risslupe', label: 'Risslupe & Rissmikroskop', sub: 'Schadensdiagnostik' },
                  { id: 'nivellier', label: 'Baunivellier (optisch/digital)', sub: 'DIN ISO 17123-2' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTool(t.id as any);
                      // Default values fitted to the tool range
                      if (t.id === 'meterstab') setToolInputValue(2000);
                      else if (t.id === 'messschieber') setToolInputValue(120);
                      else if (t.id === 'laser') setToolInputValue(15000);
                      else if (t.id === 'risslupe') setToolInputValue(0.3);
                      else if (t.id === 'nivellier') setToolInputValue(50000);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedTool === t.id
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm'
                        : 'border-home-grau/30 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{t.label}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{t.sub}</div>
                  </button>
                ))}
              </div>

              {/* Detail-Panel auf der rechten Seite */}
              <div className="lg:col-span-8 border border-home-grau/30 rounded-xl p-5 bg-slate-50/40 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-home-grau/30 pb-3 mb-4 font-sans">
                    <span className="text-sm font-bold text-slate-900">
                      {selectedTool === 'meterstab' && 'Meterstab (z. B. Holz-Gliedermaßstab) & Rollbandmaß'}
                      {selectedTool === 'messschieber' && 'Taschenmessschieber (Schieblehre)'}
                      {selectedTool === 'laser' && 'Hand-Laserentfernungsmesser (Distanzer)'}
                      {selectedTool === 'risslupe' && 'Präzisions-Risslupe & Taschenmikroskop'}
                      {selectedTool === 'nivellier' && 'Optisch-mechanisches Bau-Nivelliergerät'}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200 py-0.5 px-2 rounded">
                      {selectedTool === 'meterstab' && 'Toleranzklasse II'}
                      {selectedTool === 'messschieber' && 'DIN EN ISO 13385-1'}
                      {selectedTool === 'laser' && 'ISO 16331-1'}
                      {selectedTool === 'risslupe' && 'ZfP-Methodik'}
                      {selectedTool === 'nivellier' && 'DIN ISO 17123-2'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                    <div className="bg-white p-3 rounded-lg border border-home-grau/30">
                      <span className="text-slate-400 font-medium block text-[10px] uppercase">Auflösung / Ablesbarkeit</span>
                      <strong className="text-slate-800 text-xs mt-0.5 block">
                        {selectedTool === 'meterstab' && '1,0 mm (Skalenteilung)'}
                        {selectedTool === 'messschieber' && '0,05 mm (analog mit Nonius) / 0,01 mm (digital)'}
                        {selectedTool === 'laser' && '1,0 mm (interne Rundung / Digitalanzeige)'}
                        {selectedTool === 'risslupe' && '0,05 mm (Messskala) / 0,02 mm schätzbar'}
                        {selectedTool === 'nivellier' && '0,5 mm bis 1,0 mm (Ablesung an Nivellierlatte)'}
                      </strong>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-home-grau/30">
                      <span className="text-slate-400 font-medium block text-[10px] uppercase">Fehlergrenze (typisch)</span>
                      <strong className="text-slate-800 text-xs mt-0.5 block font-mono">
                        {selectedTool === 'meterstab' && '±(0,3 + 0,2 · L) mm  [L in m], Klasse II'}
                        {selectedTool === 'messschieber' && '±0,03 mm (bis 100 mm) / ±0,05 mm (bis 200 mm), Herstellerangabe'}
                        {selectedTool === 'laser' && '±(1,0 + 0,05 · L) mm  [L in m], Herstellerangabe'}
                        {selectedTool === 'risslupe' && '±0,05 mm (Ablesegrenze der Skala)'}
                        {selectedTool === 'nivellier' && '1,5 mm Standardabweichung je km Doppelnivellement'}
                      </strong>
                    </div>
                  </div>

                  {/* Interaktiver Toleranz-Rechner */}
                  <div className="bg-indigo-50/40 border border-indigo-150/60 rounded-lg p-4 mb-4">
                    <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                      <Calculator size={14} className="text-indigo-600" />
                      Interaktiver Toleranz-Schätzer
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          {selectedTool === 'meterstab' && 'Ziel-Messlänge (mm):'}
                          {selectedTool === 'messschieber' && 'Zylinderdurchmesser d (mm):'}
                          {selectedTool === 'laser' && 'Raumdiagonale L (mm):'}
                          {selectedTool === 'risslupe' && 'Rissbreite w (mm):'}
                          {selectedTool === 'nivellier' && 'Entfernung zur Nivellierlatte (mm):'}
                        </label>
                        <input
                          type="number" min="0"
                          step={selectedTool === 'risslupe' ? '0.05' : '10'}
                          value={toolInputValue}
                          onChange={(e) => setToolInputValue(Math.max(0.01, parseFloat(e.target.value) || 0))}
                          className="w-full bg-white border border-home-grau/30 rounded px-2.5 py-1 text-xs font-mono font-bold"
                        />
                      </div>
                      <div className="bg-white p-2.5 rounded border border-indigo-100 flex flex-col justify-center">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Fehlergrenze bzw. Standardabweichung</span>
                        <span className="text-xs font-mono font-extrabold text-indigo-700">
                          {selectedTool === 'meterstab' && (
                            <>± {formatDeZahl((0.3 + 0.2 * (toolInputValue / 1000)), 2)} mm</>
                          )}
                          {selectedTool === 'messschieber' && (
                            <>{toolInputValue <= 100 ? '± 0,03' : '± 0,05'} mm</>
                          )}
                          {selectedTool === 'laser' && (
                            <>± {formatDeZahl((1.0 + 0.05 * (toolInputValue / 1000)), 2)} mm</>
                          )}
                          {selectedTool === 'risslupe' && (
                            <>± 0,05 mm</>
                          )}
                          {selectedTool === 'nivellier' && (
                            <>± {formatDeZahl(Math.max(0.5, 1.5 * Math.sqrt((toolInputValue / 1000) / 1000)), 2)} mm</>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 font-sans">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Häufige Fehlerquellen im Baubetrieb:</span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-[11px] text-slate-600">
                      {selectedTool === 'meterstab' && (
                        <>
                          <li><strong>Parallaxenfehler:</strong> Schiefes Ablesen von oben/unten verändert das Maß optisch.</li>
                          <li><strong>Gelenkverschleiß:</strong> Abgenutzte Federgelenke erzeugen Spiel von bis zu 1–2 mm.</li>
                          <li><strong>Thermisches Verhalten:</strong> Holz dehnt sich bei Feuchte aus, Metall z. B. bei Hitze.</li>
                          <li><strong>Geneigte Messlinie:</strong> Schräglage des Maßstabs verlängert das Messergebnis künstlich.</li>
                        </>
                      )}
                      {selectedTool === 'messschieber' && (
                        <>
                          <li><strong>Verkanteter Messschenkel:</strong> Führt zu Kippen und verfälscht Dicken nach oben.</li>
                          <li><strong>Messdruck:</strong> Überhöhter Handdruck biegt die Digitalschenkel auf (Mikrometerbereich).</li>
                          <li><strong>Schmutzpartikel:</strong> Betonstaub oder Trennmittel blockieren die feste Anlage.</li>
                          <li><strong>Abgenutzte Schneiden:</strong> Rundung der Kontaktflächen durch häufigen Gebrauch.</li>
                        </>
                      )}
                      {selectedTool === 'laser' && (
                        <>
                          <li><strong>Zieloberfläche:</strong> Strukturierter Spritzbeton streut das Signal, was Phasen stört.</li>
                          <li><strong>Lufteinfluss:</strong> Starker Baustaub oder Rauch dämpft oder reflektiert den Laserstrahl.</li>
                          <li><strong>Ausrichtungszittern:</strong> Freihandmessungen bei Entfernungen ab ca. 15 m erhöhen Abweichung.</li>
                          <li><strong>Fremdlicht:</strong> Direkte Sonneneinstrahlung überlagert die Empfangsoptik.</li>
                        </>
                      )}
                      {selectedTool === 'risslupe' && (
                        <>
                          <li><strong>Schattenwurf:</strong> Schlecht ausgeleuchtete Risse verfälschen die visuelle Breite.</li>
                          <li><strong>Schrägaufsicht:</strong> Kippen der Lupe führt zu optischen Verzerrungen (scheinbare Verschmälerung).</li>
                          <li><strong>Subjektiver Fehler:</strong> Schätzen zwischen 0,05-mm-Skalenschritten je nach Prüfer.</li>
                          <li><strong>Verschmutzung:</strong> Ausgebrochene Risskanten (Krater) täuschen über wahren Spalt hinweg.</li>
                        </>
                      )}
                      {selectedTool === 'nivellier' && (
                        <>
                          <li><strong>Dosenlibelle:</strong> Fehljustierung oder schlampige Horizontierung führt zu Neigungsfehlern.</li>
                          <li><strong>Messlatten-Kippung:</strong> Schräg stehende Latten vergrößern den Höhenwert drastisch.</li>
                          <li><strong>Refraktion / Flimmern:</strong> Flirrende Hitze über Asphalt lenkt den Zielstrahl wellig ab.</li>
                          <li><strong>Vibrationen:</strong> Baustellenverkehr (z. B. Walzen) bringt das Kompensatorsystem zum Schwingen.</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-home-grau/30 text-[10px] text-slate-500 font-sans leading-relaxed flex items-center gap-1.5">
                  <Info size={12} className="text-slate-400 shrink-0" />
                  <span>
                    <strong>Einsatzgebiet &amp; Relevanz:</strong>{' '}
                    {selectedTool === 'meterstab' && 'Standardmäßig verwendet für grobe Raumkontrollen und Maßtoleranzen im Hochbau nach DIN 18202.'}
                    {selectedTool === 'messschieber' && 'Unerlässlich im Labor für die Maßkontrolle von Probekörpern (DIN EN 12390-1), Stabdurchmesser und Bohrkern-Durchmesser (DIN EN 12504-1).'}
                    {selectedTool === 'laser' && 'Gut geeignet für verformungsgerechte Aufmaße im Bestand, Gebäudeaufmaße und schnelles Einmessen von Prüfgittern.'}
                    {selectedTool === 'risslupe' && 'Wichtiges Handwerkszeug bei Bauzustandsanalysen, Abnahme von Spannbetonbauteilen und Beweissicherungen.'}
                    {selectedTool === 'nivellier' && 'Bestandteil von Deformationsmessungen, Durchbiegungsversuchen auf Baustellen und Abnahmeprüfungen.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Tab 2: Richtigkeit vs. Präzision (Accuracy vs. Precision) --- */}
      {activeSubTab === 'treffbild' && (
        <div className="space-y-6">
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 font-sans">
              <Target className="text-shiraz" size={20} /> Systematische Abweichung vs. Zufällige Abweichung
            </h2>
            <p className="text-slate-600 text-xs leading-relaxed max-w-4xl font-sans">
              Das Messergebnis bei Festigkeits- und Verdrängungsversuchen wird durch zwei grundlegende Abweichungsformen beeinflusst. 
              Nach ISO 5725-1 setzt sich die <strong>Genauigkeit</strong> aus <strong>Richtigkeit</strong> (systematische Abweichung des Mittelwerts) 
              und <strong>Präzision</strong> (zufällige Streuung) zusammen. Das Treffbild unten zeigt die vier Kombinationen.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
              
              {/* Left Selector: Dynamic Controls */}
              <div className="lg:col-span-5 flex flex-col justify-between border border-home-grau/30 p-5 rounded-xl bg-slate-50 gap-4">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Modul-Konfigurator</span>
                  
                  {/* Selector 1: Accuracy (Richtigkeit) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between font-sans">
                      <span>Richtigkeit (engl. trueness)</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                        accuracy === 'high' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {accuracy === 'high' ? 'Richtigkeit hoch' : 'Systematische Abweichung'}
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setAccuracy('high')}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all font-sans ${
                          accuracy === 'high' ? 'bg-slate-800 text-white border-home-grau/30 shadow-sm' : 'bg-white text-slate-600 border-home-grau/30 hover:bg-slate-50'
                        }`}
                      >
                        Hoch (Zentriert)
                      </button>
                      <button
                        onClick={() => setAccuracy('low')}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all font-sans ${
                          accuracy === 'low' ? 'bg-slate-800 text-white border-home-grau/30 shadow-sm' : 'bg-white text-slate-600 border-home-grau/30 hover:bg-slate-50'
                        }`}
                      >
                        Niedrig (verschoben)
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-sans">
                      Systematische Messfehler (z. B. verbogene Druckplatte, falsch kalibrierter Kraftaufnehmer) verzerren den Mittelwert dauerhaft in eine Richtung.
                    </p>
                  </div>

                  {/* Selector 2: Precision (Präzision) */}
                  <div className="space-y-2 pt-4 border-t border-home-grau/30">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between font-sans">
                      <span>Präzision / Streuung (engl. precision)</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                        precision === 'high' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {precision === 'high' ? 'Geringe Streuung' : 'Hohe Prüfstreuung'}
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPrecision('high')}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all font-sans ${
                          precision === 'high' ? 'bg-slate-800 text-white border-home-grau/30 shadow-sm' : 'bg-white text-slate-600 border-home-grau/30 hover:bg-slate-50'
                        }`}
                      >
                        Hoch (Geringe Streuung)
                      </button>
                      <button
                        onClick={() => setPrecision('low')}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all font-sans ${
                          precision === 'low' ? 'bg-slate-800 text-white border-home-grau/30 shadow-sm' : 'bg-white text-slate-600 border-home-grau/30 hover:bg-slate-50'
                        }`}
                      >
                        Niedrig (Weit gestreut)
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-sans">
                      Zufällige Messfehler (z. B. Schwankungen des Raumklimas, inhomogenes Gestein, Ableseunsicherheit) führen zu unvorhersehbaren Streuungen um den Mittelwert.
                    </p>
                  </div>

                </div>

                <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 mt-2 text-xs text-slate-600 space-y-1 font-sans">
                  <span className="font-bold text-slate-800 block">Ingenieurtechnische Diagnose:</span>
                  <p className="text-[11px] leading-relaxed">
                    {accuracy === 'high' && precision === 'high' && 'Richtig und präzise: geringe systematische Abweichung und geringe Streuung. Die Ergebnisse sind verlässlich.'}
                    {accuracy === 'low' && precision === 'high' && 'Achtung: gute Wiederholbarkeit, aber verschobener Mittelpunkt! Alle Werte weichen in dieselbe Richtung ab. Typische Ursache ist ein unentdeckter Kalibrierfehler – Mehrfachmessungen helfen hier nicht.'}
                    {accuracy === 'high' && precision === 'low' && 'Im Mittel richtig, aber die Einzelwerte streuen stark. Ursache kann eine uneinheitliche Probenherstellung oder -vorbereitung sein; mehr Wiederholungen verkleinern die Unsicherheit des Mittelwerts.'}
                    {accuracy === 'low' && precision === 'low' && 'Weder richtig noch präzise: systematische und zufällige Abweichungen sind unkontrolliert. Die Prüfeinrichtung ist bis zur Klärung (Kalibrierung, Verfahrensprüfung) außer Betrieb zu nehmen.'}
                  </p>
                </div>
              </div>

              {/* Right Target Screen (Interactive SVG) */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-100 rounded-xl border border-home-grau/30 relative">
                <span className="absolute top-4 left-4 text-[10px] font-bold text-slate-400 font-mono">Schussbild-Anzeige (Treffbild)</span>
                
                <svg width="220" height="220" viewBox="0 0 200 200" className="drop-shadow-sm select-none">
                  {/* Outer ring */}
                  <circle cx="100" cy="100" r="90" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                  <circle cx="100" cy="100" r="70" fill="transparent" stroke="#cbd5e1" strokeWidth="1.5" />
                  <circle cx="100" cy="100" r="50" fill="transparent" stroke="#cbd5e1" strokeWidth="1.5" />
                  <circle cx="100" cy="100" r="30" fill="transparent" stroke="#cbd5e1" strokeWidth="1.5" />
                  {/* Bullseye Center */}
                  <circle cx="100" cy="100" r="10" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
                  {/* Bullseye centerpoint */}
                  <circle cx="100" cy="100" r="2" fill="#ef4444" />

                  {/* Lines for coordinates */}
                  <line x1="100" y1="5" x2="100" y2="195" stroke="#e2e8f0" strokeDasharray="3,3" />
                  <line x1="5" y1="100" x2="195" y2="100" stroke="#e2e8f0" strokeDasharray="3,3" />

                  {/* Render Shots */}
                  {targetShots.map((shot, idx) => (
                    <g key={idx}>
                      <circle cx={shot.x} cy={shot.y} r="4" fill="#A3113E" className="opacity-80" />
                      <circle cx={shot.x} cy={shot.y} r="1.5" fill="#ffffff" />
                    </g>
                  ))}
                </svg>

                <div className="flex gap-4 mt-6 text-center text-xs">
                  <div className="px-3 py-1.5 bg-white border border-home-grau/30 rounded shadow-xs font-sans">
                    <span className="text-slate-500 font-mono block text-[9px] uppercase">Richtigkeit</span>
                    <span className={`font-bold ${accuracy === 'high' ? 'text-emerald-700' : 'text-red-700'}`}>
                      {accuracy === 'high' ? 'Hoch (zentriert)' : 'Niedrig (system. Fehler)'}
                    </span>
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-home-grau/30 rounded shadow-xs font-sans">
                    <span className="text-slate-500 font-mono block text-[9px] uppercase">Präzision</span>
                    <span className={`font-bold ${precision === 'high' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {precision === 'high' ? 'Hoch (Kompakt)' : 'Niedrig (Gestreut)'}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- Tab 3: GUM Messunsicherheit-Rechner (Type A & B Standard) --- */}
      {activeSubTab === 'messunsicherheit' && (
        <div className="space-y-6">
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 font-sans">
              <Calculator className="text-shiraz" size={20} /> GUM-Rechner: Kombinierte &amp; Erweiterte Messunsicherheit
            </h2>
            <p className="text-slate-600 text-xs leading-relaxed max-w-4xl font-sans">
              Gemäß dem internationalen Leitfaden <strong>GUM (Guide to the Expression of Uncertainty in Measurement)</strong> gilt es, 
              die Unsicherheitsbeiträge (Typ A: statistische Auswertung von Messreihen, Typ B: andere Informationen wie Auflösung oder Kalibrierschein) 
              zu einer kombinierten Standardunsicherheit (<FormulaText text="u_c" />) quadratisch zu addieren (Wurzel aus der Quadratsumme, bei unkorrelierten Größen).
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
              
              {/* Left Column: Input Adjustments */}
              <div className="lg:col-span-5 border border-home-grau/30 rounded-xl p-5 bg-slate-50 flex flex-col gap-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">GUM Eingangsdaten</span>

                {/* Input 1: Raw values string */}
                <div className="space-y-1.5 font-sans">
                  <label className="text-xs font-bold text-slate-700 block">Messwerte in MPa (durch Semikolon getrennt, Dezimalkomma):</label>
                  <input
                    type="text"
                    value={measurements}
                    onChange={(e) => setMeasurements(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 bg-white border border-home-grau/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-shiraz"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Aktuell erkannt: <strong>{formatDeWert(parsedData.length)}</strong> gültige Messwerte.
                  </p>
                </div>

                {/* Input 2: Display Resolution (d) */}
                <div className="space-y-1.5 pt-3.5 border-t border-home-grau/30 font-sans">
                  <div className="flex justify-between items-center text-xs text-slate-700 font-bold">
                    <label>Auflösung d (Ziffernschritt bzw. Skalenteilungswert):</label>
                    <span className="font-mono text-slate-900">{formatDeWert(resolution)} MPa</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="1.0"
                    step="0.01"
                    value={resolution}
                    onChange={(e) => setResolution(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                  />
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Führt nach GUM zu einem Typ-B-Beitrag (Rechteckverteilung): <FormulaText text="u_{B,1} = d / \sqrt{12}" />.
                  </p>
                </div>

                {/* Input 3: Calibration cert uncertainty (U_cal) */}
                <div className="space-y-1.5 pt-3.5 border-t border-home-grau/30 font-sans">
                  <div className="flex justify-between items-center text-xs text-slate-700 font-bold">
                    <label>Kalibrierschein-Unsicherheit U_cal (k=2):</label>
                    <span className="font-mono text-slate-900">{formatDeWert(calibrationError)} MPa</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="1.5"
                    step="0.01"
                    value={calibrationError}
                    onChange={(e) => setCalibrationError(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                  />
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Erweiterte Unsicherheit laut (DAkkS-)Kalibrierschein. Typ B (Normalverteilung): <FormulaText text="u_{B,2} = U / 2" /> (für k=2).
                  </p>
                </div>

                {/* Button to restore default sample set */}
                <button
                  onClick={() => {
                    setMeasurements('38,5; 39,2; 37,8; 38,9; 39,6');
                    setResolution(0.1);
                    setCalibrationError(0.15);
                  }}
                  className="mt-2 text-xs text-shiraz font-bold flex items-center justify-center gap-1 hover:text-shiraz-dark font-sans cursor-pointer"
                >
                  <RefreshCw size={12} /> Standardwerte wiederherstellen
                </button>
              </div>

              {/* Right Column: Detailed Metrology Report Output */}
              <div className="lg:col-span-7 border border-home-grau/30 rounded-xl p-5 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start border-b border-home-grau/30 pb-2.5 font-sans">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">Berechnungsberichte</span>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">Unsicherheitsbudget nach GUM</h3>
                    </div>
                    <div className="text-right text-xs font-mono font-bold text-shiraz">
                      <span>k = 2 (≈ 95 % Überdeckung)</span>
                    </div>
                  </div>

                  {/* Calculations breakdown list */}
                  {parsedData.length >= 2 ? (
                    <div className="space-y-3 mt-4 text-xs font-sans">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="bg-white p-2.5 rounded border border-home-grau/30">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">arithm. Mittel x̄</span>
                          <span className="font-mono text-slate-900 font-bold text-sm">{formatDeZahl(mean, 3)} MPa</span>
                        </div>
                        <div className="bg-white p-2.5 rounded border border-home-grau/30">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">Standardabweich. s</span>
                          <span className="font-mono text-slate-900 font-bold text-sm">{formatDeZahl(sampleStdDev, 3)} MPa</span>
                        </div>
                        <div className="bg-white p-2.5 rounded border border-home-grau/30">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">Probenanzahl n</span>
                          <span className="font-mono text-slate-900 font-bold text-sm">{formatDeWert(parsedData.length)}</span>
                        </div>
                      </div>

                      {/* Geometric uncertainty elements list */}
                      <div className="space-y-1.5 bg-white p-3.5 rounded-lg border border-home-grau/30 mt-2 font-sans">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Unsicherheitsbeiträge (u_i)</span>
                        
                        <div className="flex justify-between items-center text-[11px] border-b border-home-grau/30 py-1 font-mono">
                          <span>uA (Typ A, statistisch: s / &radic;n)</span>
                          <span className="font-bold text-slate-800">{formatDeZahl(uA, 4)} MPa</span>
                        </div>

                        <div className="flex justify-between items-center text-[11px] border-b border-home-grau/30 py-1 font-mono">
                          <span>uB,1 (Typ B, Auflösung: d / &radic;12)</span>
                          <span className="font-bold text-slate-800">{formatDeZahl(uB1, 4)} MPa</span>
                        </div>

                        <div className="flex justify-between items-center text-[11px] py-1 font-mono">
                          <span>uB,2 (Typ B, Kalibrierung: U_cal / 2)</span>
                          <span className="font-bold text-slate-800">{formatDeZahl(uB2, 4)} MPa</span>
                        </div>
                      </div>

                      {/* Quadratic Summation indicator */}
                      <p className="text-[10px] text-slate-500 italic text-right -mt-1 leading-normal font-sans">
                        Quadratische Addition: <FormulaText text="u_c = \sqrt{u_A^2 + u_{B,1}^2 + u_{B,2}^2}" />
                      </p>

                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs font-sans">
                      Bitte geben Sie mindestens zwei gültige Messwerte (durch Semikolon getrennt) an, um die statistische Auswertung (Typ A) zu aktivieren.
                    </div>
                  )}
                </div>

                {/* Combined & Expanded Uncertainty outputs footer */}
                {parsedData.length >= 2 && (
                  <div className="mt-6 pt-4 border-t border-home-grau/30 bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1 font-sans">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Vollständiges Messergebnis</span>
                      <div className="text-base md:text-lg font-mono font-bold text-slate-900 tracking-tight">
                        {formatDeZahl(mean, 2)} ± {formatDeZahl(expandedU, 2)} MPa
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Der Wert der Messgröße liegt mit einer Überdeckungswahrscheinlichkeit von etwa 95 % (k = 2) zwischen <strong>{formatDeZahl(minInterval, 2)}</strong> und <strong>{formatDeZahl(maxInterval, 2)}</strong> MPa.
                      </p>
                    </div>
                    <div className="bg-shiraz/5 border border-shiraz/20 p-3 rounded-lg flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-start shrink-0 font-sans">
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">Komb. Unsicherheit u_c</span>
                        <span className="text-xs font-bold font-mono text-shiraz">{formatDeZahl(uc, 3)} MPa</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-shiraz/10 border border-shiraz/30 flex items-center justify-center text-[10px] font-mono font-bold text-shiraz shrink-0">
                        ±{formatDeZahl(expandedU, 2)}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
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
                      <input
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
                      <input
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
            { titel: 'z-Score', erklaerung: 'Nach DIN ISO 13528: |z| ≤ 2 zufriedenstellend, 2 < |z| < 3 fragwürdig, |z| ≥ 3 nicht zufriedenstellend.', formel: 'z = \\frac{-4{,}0}{1{,}8} = -2{,}22 \;\\Rightarrow\; \\text{Warnsignal}' },
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
          { title: 'DIN EN ISO/IEC 17025:2018-03 (Allgemeine Anforderungen an die Kompetenz von Prüf- und Kalibrierlaboratorien)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO%2FIEC+17025' },
          { title: 'DIN EN ISO/IEC 17043:2023-10 + A11:2024-09 (Konformitätsbewertung – Anforderungen an Anbieter von Eignungsprüfungen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO%2FIEC+17043' },
          { title: 'DIN ISO 13528:2025-07 (Statistische Verfahren für Eignungsprüfungen durch Vergleiche zwischen Laboratorien)', url: 'https://www.dinmedia.de/de/suche?q=DIN+ISO+13528' },
          { title: 'ISO 5725-1:2023-07 (Genauigkeit (Richtigkeit und Präzision) von Messverfahren und Messergebnissen – Teil 1); DIN ISO 5725-1:1997-11 zurückgezogen', url: 'https://www.dinmedia.de/de/suche?q=ISO+5725-1' },
          { title: 'DIN EN ISO 7500-1:2018-06 (Kalibrierung und Überprüfung von Zug- und Druckprüfmaschinen – Kraftmesssystem)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+7500-1' },
          { title: 'DIN EN ISO 13385-1:2020-03 (Messschieber; ersetzt DIN 862:2015-03)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+13385-1' },
          { title: 'DIN ISO 17123-2:2023-12 (Feldprüfverfahren geodätischer Instrumente – Nivelliere)', url: 'https://www.dinmedia.de/de/suche?q=DIN+ISO+17123-2' },
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
