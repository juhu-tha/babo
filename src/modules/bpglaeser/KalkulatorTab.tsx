import type { Dispatch, SetStateAction } from 'react';
import type { Hinweis } from '@/src/calc/plausibilitaet';
import { Calculator } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';

export interface KalkulatorTabProps {
  fensterBreite: number;
  setFensterBreite: Dispatch<SetStateAction<number>>;
  fensterHoehe: number;
  setFensterHoehe: Dispatch<SetStateAction<number>>;
  rahmenBreiteMm: number;
  setRahmenBreiteMm: Dispatch<SetStateAction<number>>;
  ufWert: number;
  setUfWert: Dispatch<SetStateAction<number>>;
  ugWert: number;
  setUgWert: Dispatch<SetStateAction<number>>;
  abstandhalterTyp: "alu" | "edelstahl" | "warm_edge_kunststoff";
  setAbstandhalterTyp: Dispatch<SetStateAction<"alu" | "edelstahl" | "warm_edge_kunststoff">>;
  gWert: number;
  setGWert: Dispatch<SetStateAction<number>>;
  sonneneinstrahlung: number;
  setSonneneinstrahlung: Dispatch<SetStateAction<number>>;
  calcResults: { Af_total: number; Ag: number; Af: number; Lg: number; psi: 0.08 | 0.06 | 0.038; waermestromGlas: number; waermestromRahmen: number; waermestromKante: number; uw: number; solareGewinneWatt: number; gegKonform: boolean; passivhausStandard: boolean; hinweise: Hinweis[]; };
}

export function KalkulatorTab({ fensterBreite, setFensterBreite, fensterHoehe, setFensterHoehe, rahmenBreiteMm, setRahmenBreiteMm, ufWert, setUfWert, ugWert, setUgWert, abstandhalterTyp, setAbstandhalterTyp, gWert, setGWert, sonneneinstrahlung, setSonneneinstrahlung, calcResults }: KalkulatorTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-2">
          <Calculator className="text-shiraz" size={20} />
          Interaktiver Fenster-Uw-Rechner nach DIN EN ISO 10077-1
        </h3>
        <p className="text-xs text-home-grau mb-6">
          Berechnung des exakten Gesamtwärmedurchgangskoeffizienten <InlineMath math="U_w" /> und der solaren Wärmegewinne 
          in Abhängigkeit von Geometrie, Rahmenbautiefe, Verglasungsart und Glasrandverbund.
        </p>
    
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Steuerung / Slider */}
          <div className="lg:col-span-2 space-y-5 bg-off-white p-6 rounded-2xl border border-home-grau/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Fensterbreite */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Fensterbreite (B):</span>
                  <span className="font-mono text-shiraz">{formatDeZahl(fensterBreite, 2)} m</span>
                </div>
                <input 
                  type="range"
                  min={0.60}
                  max={3.00}
                  step={0.05}
                  value={fensterBreite}
                  onChange={(e) => setFensterBreite(parseFloat(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-home-grau">
                  <span>0,60 m</span>
                  <span>1,23 m (DIN-Standard)</span>
                  <span>3,00 m</span>
                </div>
              </div>
    
              {/* Fensterhöhe */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Fensterhöhe (H):</span>
                  <span className="font-mono text-shiraz">{formatDeZahl(fensterHoehe, 2)} m</span>
                </div>
                <input 
                  type="range"
                  min={0.60}
                  max={3.00}
                  step={0.05}
                  value={fensterHoehe}
                  onChange={(e) => setFensterHoehe(parseFloat(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-home-grau">
                  <span>0,60 m</span>
                  <span>1,48 m (DIN-Standard)</span>
                  <span>3,00 m</span>
                </div>
              </div>
            </div>
    
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-home-grau/20">
              {/* Rahmenansichtsbreite */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Rahmenbreite (b_f):</span>
                  <span className="font-mono text-shiraz">{formatDeWert(rahmenBreiteMm)} mm</span>
                </div>
                <input 
                  type="range"
                  min={60}
                  max={160}
                  step={5}
                  value={rahmenBreiteMm}
                  onChange={(e) => setRahmenBreiteMm(parseInt(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-home-grau">
                  <span>60 mm (Schlank)</span>
                  <span>110 mm (Standard)</span>
                  <span>160 mm</span>
                </div>
              </div>
    
              {/* Rahmen-Uf */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Rahmen Uf-Wert:</span>
                  <span className="font-mono text-shiraz">{formatDeZahl(ufWert, 2)} W/(m²K)</span>
                </div>
                <input 
                  type="range"
                  min={0.70}
                  max={2.00}
                  step={0.05}
                  value={ufWert}
                  onChange={(e) => setUfWert(parseFloat(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-home-grau">
                  <span>0,70 (Passivhaus)</span>
                  <span>1,10 (PVC)</span>
                  <span>2,00 (Alt-Holz)</span>
                </div>
              </div>
            </div>
    
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-home-grau/20">
              {/* Glas-Ug */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Glas Ug-Wert:</span>
                  <span className="font-mono text-shiraz">{formatDeZahl(ugWert, 2)} W/(m²K)</span>
                </div>
                <input 
                  type="range"
                  min={0.40}
                  max={3.00}
                  step={0.05}
                  value={ugWert}
                  onChange={(e) => setUgWert(parseFloat(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-home-grau">
                  <span>0,50 (3-IV Krypton)</span>
                  <span>0,60 (3-IV Argon)</span>
                  <span>1,10 (2-IV)</span>
                </div>
              </div>
    
              {/* Abstandhalter / Warme Kante */}
              <div>
                <label className="text-xs font-bold block mb-1">Glasrandverbund (Abstandhalter):</label>
                <select aria-label="Glasrandverbund (Abstandhalter)"
                  value={abstandhalterTyp}
                  onChange={(e) => setAbstandhalterTyp(e.target.value as any)}
                  className="w-full p-2 bg-white border border-home-grau/30 rounded-xl text-xs font-medium focus:ring-1 focus:ring-shiraz outline-none"
                >
                  <option value="warm_edge_kunststoff">Warme Kante Kunststoff (Ψ = 0,038 W/mK)</option>
                  <option value="edelstahl">Edelstahl-Abstandhalter (Ψ = 0,060 W/mK)</option>
                  <option value="alu">Standard Aluminium (Ψ = 0,080 W/mK - Veraltet)</option>
                </select>
              </div>
            </div>
    
            {/* Solarstrahlung & g-Wert */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-home-grau/20">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Gesamtenergiedurchlass (g-Wert):</span>
                  <span className="font-mono text-shiraz">{formatDeZahl((gWert * 100), 0)} % ({formatDeZahl(gWert, 2)})</span>
                </div>
                <input 
                  type="range"
                  min={0.20}
                  max={0.80}
                  step={0.02}
                  value={gWert}
                  onChange={(e) => setGWert(parseFloat(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-home-grau">
                  <span>0,25 (Sonnenschutz)</span>
                  <span>0,53 (3-IV Standard)</span>
                  <span>0,65 (2-IV)</span>
                </div>
              </div>
    
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Sonneneinstrahlung auf Fassade:</span>
                  <span className="font-mono text-shiraz">{formatDeWert(sonneneinstrahlung)} W/m²</span>
                </div>
                <input 
                  type="range"
                  min={100}
                  max={900}
                  step={50}
                  value={sonneneinstrahlung}
                  onChange={(e) => setSonneneinstrahlung(parseInt(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-home-grau">
                  <span>150 (Bewölkt)</span>
                  <span>450 (Frühjahr/Herbst)</span>
                  <span>850 (Hochsommer)</span>
                </div>
              </div>
            </div>
          </div>
    
          {/* Ergebnis-Panel */}
          <div className="bg-white p-6 rounded-2xl border-2 border-shiraz shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-3 mb-4">
                <span className="text-xs uppercase tracking-wider font-bold text-home-grau">Ergebnis nach DIN EN ISO 10077-1</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      calcResults.passivhausStandard 
                        ? 'bg-slate-800 text-white' 
                        : calcResults.gegKonform 
                          ? 'bg-slate-600 text-white' 
                          : 'bg-shiraz text-white'
                    }`}>
                  {calcResults.passivhausStandard ? 'Passivhaus-Tauglich' : calcResults.gegKonform ? 'GModG-Konform' : 'Nicht zulässig (GModG)'}
                </span>
              </div>
    
              <EingabeHinweise hinweise={calcResults.hinweise} />
              <div className="text-center my-3">
                <span className="text-xs text-home-grau font-semibold block">Gesamter Wärmedurchgangskoeffizient</span>
                <div className="text-4xl font-extrabold text-shiraz font-mono mt-1">
                  {formatDeZahl(calcResults.uw, 2)}
                  <span className="text-base font-normal text-text-main ml-1">W/(m²K)</span>
                </div>
              </div>
    
              {/* Aufschlüsselung der Wärmeströme */}
              <div className="mt-4 pt-4 border-t border-home-grau/20 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-main/70">Gesamtfensterfläche (A_w):</span>
                  <span className="font-mono font-bold text-slate-800">{formatDeZahl(calcResults.Af_total, 2)} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-main/70">Sichtbare Glasfläche (A_g):</span>
                  <span className="font-mono font-bold text-slate-800">{formatDeZahl(calcResults.Ag, 2)} m² ({formatDeZahl((calcResults.Ag / calcResults.Af_total * 100), 0)} %)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-main/70">Rahmenfläche (A_f):</span>
                  <span className="font-mono font-bold text-slate-800">{formatDeZahl(calcResults.Af, 2)} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-main/70">Glasumfang (l_g):</span>
                  <span className="font-mono font-bold text-slate-800">{formatDeZahl(calcResults.Lg, 2)} m</span>
                </div>
              </div>
    
              <div className="mt-4 pt-4 border-t border-home-grau/20 space-y-1.5 text-[11px] bg-off-white p-3 rounded-xl border border-home-grau/25">
                <div className="font-bold text-slate-900 mb-1">Anteilige Wärmeverluste (bei ΔT = 1 K):</div>
                <div className="flex justify-between">
                  <span>Glasverlust (A_g · U_g):</span>
                  <span className="font-mono font-semibold">{formatDeZahl(calcResults.waermestromGlas, 2)} W/K ({formatDeZahl((calcResults.waermestromGlas / (calcResults.uw * calcResults.Af_total) * 100), 0)} %)</span>
                </div>
                <div className="flex justify-between">
                  <span>Rahmenverlust (A_f · U_f):</span>
                  <span className="font-mono font-semibold">{formatDeZahl(calcResults.waermestromRahmen, 2)} W/K ({formatDeZahl((calcResults.waermestromRahmen / (calcResults.uw * calcResults.Af_total) * 100), 0)} %)</span>
                </div>
                <div className="flex justify-between">
                  <span>Kantenverlust (l_g · Ψ_g):</span>
                  <span className="font-mono font-semibold">{formatDeZahl(calcResults.waermestromKante, 2)} W/K ({formatDeZahl((calcResults.waermestromKante / (calcResults.uw * calcResults.Af_total) * 100), 0)} %)</span>
                </div>
              </div>
    
              {/* Solare Gewinne */}
              <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs">
                <div className="flex items-center justify-between text-amber-900 font-bold mb-0.5">
                  <span>Solare Wärmezufuhr:</span>
                  <span className="font-mono">{formatDeZahl(calcResults.solareGewinneWatt, 0)} Watt</span>
                </div>
                <p className="text-[10px] text-amber-800">
                  Passive Erwärmung durch Sonneneinstrahlung bei {formatDeWert(sonneneinstrahlung)} W/m² (Winter-Heizunterstützung vs. Sommer-Kühllast).
                </p>
              </div>
            </div>
    
            <div className="mt-4 pt-3 border-t border-home-grau/20 text-[10px] text-home-grau text-center">
              Berechnungsgrundlage: DIN EN ISO 10077-1:2020-10
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
