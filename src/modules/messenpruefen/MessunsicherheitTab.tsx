import type { Dispatch, SetStateAction } from 'react';
import { Calculator, RefreshCw } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';

export interface MessunsicherheitTabProps {
  measurements: string;
  setMeasurements: Dispatch<SetStateAction<string>>;
  parsedData: number[];
  resolution: number;
  setResolution: Dispatch<SetStateAction<number>>;
  calibrationError: number;
  setCalibrationError: Dispatch<SetStateAction<number>>;
  mean: number;
  sampleStdDev: number;
  uA: number;
  uB1: number;
  uB2: number;
  expandedU: number;
  minInterval: number;
  maxInterval: number;
  uc: number;
}

export function MessunsicherheitTab({ measurements, setMeasurements, parsedData, resolution, setResolution, calibrationError, setCalibrationError, mean, sampleStdDev, uA, uB1, uB2, expandedU, minInterval, maxInterval, uc }: MessunsicherheitTabProps) {
  return (
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
              <input aria-label="Messwerte in MPa (durch Semikolon getrennt, Dezimalkomma)"
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
  );
}
