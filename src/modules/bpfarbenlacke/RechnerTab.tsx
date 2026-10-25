import type { Dispatch, SetStateAction } from 'react';
import { Calculator, Check } from 'lucide-react';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { FormulaText } from '@/src/components/ui/FormulaText';

export interface RechnerTabProps {
  targetDft: number;
  setTargetDft: Dispatch<SetStateAction<number>>;
  solidsVol: number;
  setSolidsVol: Dispatch<SetStateAction<number>>;
  thinning: number;
  setThinning: Dispatch<SetStateAction<number>>;
  lossFactor: number;
  setLossFactor: Dispatch<SetStateAction<number>>;
  areaSquareMeters: number;
  setAreaSquareMeters: Dispatch<SetStateAction<number>>;
  numCoats: number;
  setNumCoats: Dispatch<SetStateAction<number>>;
  baseWft: number;
  thinnedWft: number;
  theoreticalConsumption: number;
  effectiveConsumption: number;
  totalLitersRequired: number;
}

export function RechnerTab({ targetDft, setTargetDft, solidsVol, setSolidsVol, thinning, setThinning, lossFactor, setLossFactor, areaSquareMeters, setAreaSquareMeters, numCoats, setNumCoats, baseWft, thinnedWft, theoreticalConsumption, effectiveConsumption, totalLitersRequired }: RechnerTabProps) {
  return (
    <div className="space-y-6">
      <div className="p-5 bg-stone-50 border border-home-grau/25 rounded-xl">
        <div className="flex items-center gap-2 mb-4 border-b border-home-grau/15 pb-2">
          <Calculator className="text-shiraz" size={20} />
          <span className="text-sm font-bold text-text-main">
            Interaktiver Schichtdicken-, Verbrauch- &amp; Mengenschätzer
          </span>
        </div>
    
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SLIDERS & PARAMETERS */}
          <div className="lg:col-span-6 space-y-5 bg-white p-5 rounded-xl border border-home-grau/15">
            
            {/* Desired Dry Film Thickness (DFT) */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-text-main flex items-center gap-1.5">
                  Trockenschichtdicke (DFT / <span className="italic">dry film thickness</span>)
                  <InfoTooltip text="Die Enddicke der getrockneten Beschichtung. Standardwandfarbe liegt bei ca. 30-50 µm pro Schicht, schwerer Korrosionsschutz bei über 150-250 µm." />
                </label>
                <span className="font-mono text-xs font-bold text-shiraz bg-shiraz/5 px-2 py-0.5 rounded border border-shiraz/10">
                  {formatDeWert(targetDft)} µm
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={targetDft}
                onChange={(e) => setTargetDft(Number(e.target.value))}
                className="w-full accent-shiraz h-2 bg-home-grau/20 rounded-lg cursor-pointer"
              />
            </div>
    
            {/* Festkörper-Volumenanteil (Volume Solids) */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-text-main flex items-center gap-1.5">
                  Festkörper-Volumenanteil (Vol-% Solids)
                  <InfoTooltip text="Prozentsatz der flüssigen Farbe, der nach Verdunstung des Lösemittels/Wassers dauerhaft auf der Fläche verbleibt." />
                </label>
                <span className="font-mono text-xs font-bold text-shiraz bg-shiraz/5 px-2 py-0.5 rounded border border-shiraz/10">
                  {formatDeWert(solidsVol)} %
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="100"
                step="1"
                value={solidsVol}
                onChange={(e) => setSolidsVol(Number(e.target.value))}
                className="w-full accent-shiraz h-2 bg-home-grau/20 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-text-main/50 font-bold px-0.5">
                <span>Lösemittelreich (25%)</span>
                <span>Mittelklasse (45%)</span>
                <span>High-Solid / Lösemittelfrei (80-100%)</span>
              </div>
            </div>
    
            {/* Dilution add (Verdünnungszugabe) */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-text-main flex items-center gap-1.5">
                  Verdünnungszugabe
                  <InfoTooltip text="Wasser- oder Lösemittelmenge, die zur Erleichterung des Farbauftrags hinzugefügt wird (erhöht die temporäre Nassdicke, entweicht vollständig)." />
                </label>
                <span className="font-mono text-xs font-bold text-shiraz bg-shiraz/5 px-2 py-0.5 rounded border border-shiraz/10">
                  {formatDeWert(thinning)} %
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={thinning}
                onChange={(e) => setThinning(Number(e.target.value))}
                className="w-full accent-shiraz h-2 bg-home-grau/20 rounded-lg cursor-pointer"
              />
            </div>
    
            {/* Loss factor (%) */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-text-main flex items-center gap-1.5">
                  Verlustfaktor (Prozessverlust)
                  <InfoTooltip text="Farbverluste durch Spraynebel (Overspray), im Gebinde verbleibende Restmengen oder Verlust in Rollen/Pinseln." />
                </label>
                <span className="font-mono text-xs font-bold text-shiraz bg-shiraz/5 px-2 py-0.5 rounded border border-shiraz/10">
                  {formatDeWert(lossFactor)} %
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={lossFactor}
                onChange={(e) => setLossFactor(Number(e.target.value))}
                className="w-full accent-shiraz h-2 bg-home-grau/20 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-text-main/50 font-bold px-0.5">
                <span>Rolle (10-15%)</span>
                <span>Spritzen / Airless (30-45%)</span>
                <span>Extrem stürmischer Außenwind (50%+)</span>
              </div>
            </div>
    
            {/* Area & Coats fields */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-home-grau/10">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-main/50 uppercase">Fläche (m²)</label>
                <input aria-label="Fläche (m²)"
                  type="number"
                  value={areaSquareMeters}
                  min="1"
                  onChange={(e) => setAreaSquareMeters(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2 text-xs border border-home-grau rounded-md bg-white font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-main/50 uppercase">Anzahl Arbeitsgänge</label>
                <select aria-label="Anzahl Arbeitsgänge"
                  value={numCoats}
                  onChange={(e) => setNumCoats(Number(e.target.value))}
                  className="w-full p-2 text-xs border border-home-grau rounded-md bg-white font-bold"
                >
                  <option value={1}>1 Anstrich</option>
                  <option value={2}>2 Anstriche (Standard)</option>
                  <option value={3}>3 Anstriche (Hoher Schutz)</option>
                </select>
              </div>
            </div>
    
          </div>
    
          {/* RESULTS ENGINE PANEL */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-shiraz/5 border border-shiraz/15 p-5 rounded-xl space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest block font-bold">
                Ermittelte Applikations- &amp; Mengenergebnisse
              </span>
    
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-white p-3.5 rounded-lg border border-home-grau/10 shadow-xs">
                  <span className="text-[9px] text-text-main/40 block font-bold uppercase">Erforderliche Nassdicke (WFT)</span>
                  <span className="text-base font-black text-text-main font-mono block mt-1">{formatDeZahl(baseWft, 1)} µm</span>
                  <span className="text-[9px] text-text-main/50 block leading-tight mt-1">Nassfilm-Auftragsdicke vor Verdunstung</span>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-home-grau/10 shadow-xs">
                  <span className="text-[9px] text-text-main/40 block font-bold uppercase">WFT (inkl. Verdünnung)</span>
                  <span className="text-base font-black text-indigo-700 font-mono block mt-1">{formatDeZahl(thinnedWft, 1)} µm</span>
                  <span className="text-[9px] text-text-main/50 block leading-tight mt-1">Nassfilm-Soll für die Schichtdickenmessung</span>
                </div>
              </div>
    
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-white p-3.5 rounded-lg border border-home-grau/10 shadow-xs">
                  <span className="text-[9px] text-text-main/40 block font-bold uppercase">Verbrauch (Theoretisch)</span>
                  <span className="text-base font-black text-text-main font-mono block mt-1">{formatDeZahl(theoreticalConsumption, 0)} ml/m²</span>
                  <span className="text-[9px] text-text-main/50 block leading-tight mt-1">Verbrauch ohne jegliche Spritzverluste</span>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-home-grau/10 shadow-xs">
                  <span className="text-[9px] text-text-main/40 block font-bold uppercase">Verbrauch (Praxis/Soll)</span>
                  <span className="text-base font-black text-emerald-700 font-mono block mt-1">{formatDeZahl(effectiveConsumption, 0)} ml/m²</span>
                  <span className="text-[9px] text-text-main/50 block leading-tight mt-1">Inkl. Verlustfaktor von {formatDeWert(lossFactor)}%</span>
                </div>
              </div>
    
              {/* TOTAL PAINT VALUE GAUGE CARD */}
              <div className="bg-white p-4 rounded-xl border border-shiraz/20 shadow-xs text-center space-y-1">
                <span className="text-[10px] text-text-main/50 font-bold uppercase tracking-wider block">
                  Gesamte benötigte Farbmenge ({formatDeWert(areaSquareMeters)} m² x {numCoats} Anstriche)
                </span>
                <div className="text-3xl font-black font-mono text-shiraz block py-1">
                  {formatDeZahl(totalLitersRequired, 2)} Liter
                </div>
                <div className="text-[10px] text-text-main/60 inline-flex items-center gap-1.5 max-w-sm px-2 text-center">
                  <Check className="text-emerald-600 flex-none" size={12} />
                  <span>Empfohlene Gebindebestellung: <strong>{formatDeWert(Math.ceil(totalLitersRequired / 10))} Eimer &agrave; 10 Liter</strong> (oder {formatDeWert(Math.ceil(totalLitersRequired / 2.5))} Eimer &agrave; 2,5 Liter)</span>
                </div>
              </div>
            </div>
    
            {/* MATHEMATICAL EQUATIONS SECTION */}
            <div className="bg-white p-3 rounded-lg border border-home-grau/15 text-[10px] text-text-main/70 space-y-1">
              <span className="font-bold text-text-main block">Verwendete Berechnungsformeln:</span>
              
              <div className="bg-stone-50 p-1.5 rounded text-text-main/90 overflow-x-auto my-1 flex justify-center">
                <FormulaText text="WFT = \frac{DFT \times 100}{Vol\text{-}\%_{Solids}}" />
              </div>
    
              <div className="bg-stone-50 p-1.5 rounded text-text-main/90 overflow-x-auto flex justify-center">
                <FormulaText text="\text{Verbrauch}_{effektiv} = \frac{\text{WFT}}{1 - \text{Verlust}/100} \quad \text{[ml/m²]}" />
              </div>
            </div>
    
          </div>
    
        </div>
      </div>
    </div>
  );
}
