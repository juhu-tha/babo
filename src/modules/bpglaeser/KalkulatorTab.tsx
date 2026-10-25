import type { Dispatch, SetStateAction } from 'react';
import type { Hinweis } from '@/src/calc/plausibilitaet';
import { Calculator } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import inhalt from '@/content/bpglaeser/KalkulatorTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

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
          <Calculator className="text-shiraz" size={20} /><MdText text={inhalt.texte.interaktiverFensterUwRechner} /></h3>
        <p className="text-xs text-home-grau mb-6"><MdText text={inhalt.texte.berechnungDesExaktenGesamtwärmedurchgang} /></p>
    
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Steuerung / Slider */}
          <div className="lg:col-span-2 space-y-5 bg-off-white p-6 rounded-2xl border border-home-grau/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Fensterbreite */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span><MdText text={inhalt.texte.fensterbreiteB} /></span>
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
                  <span><MdText text={inhalt.texte.t123MDin} /></span>
                  <span>3,00 m</span>
                </div>
              </div>
    
              {/* Fensterhöhe */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span><MdText text={inhalt.texte.fensterhöheH} /></span>
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
                  <span><MdText text={inhalt.texte.t148MDin} /></span>
                  <span>3,00 m</span>
                </div>
              </div>
            </div>
    
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-home-grau/20">
              {/* Rahmenansichtsbreite */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span><MdText text={inhalt.texte.rahmenbreiteBF} /></span>
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
                  <span><MdText text={inhalt.texte.t60MmSchlank} /></span>
                  <span><MdText text={inhalt.texte.t110MmStandard} /></span>
                  <span>160 mm</span>
                </div>
              </div>
    
              {/* Rahmen-Uf */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span><MdText text={inhalt.texte.rahmenUfWert} /></span>
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
                  <span><MdText text={inhalt.texte.t070Passivhaus} /></span>
                  <span>1,10 (PVC)</span>
                  <span><MdText text={inhalt.texte.t200AltHolz} /></span>
                </div>
              </div>
            </div>
    
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-home-grau/20">
              {/* Glas-Ug */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span><MdText text={inhalt.texte.glasUgWert} /></span>
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
                  <span><MdText text={inhalt.texte.t0503Iv} /></span>
                  <span><MdText text={inhalt.texte.t0603Iv} /></span>
                  <span>1,10 (2-IV)</span>
                </div>
              </div>
    
              {/* Abstandhalter / Warme Kante */}
              <div>
                <label className="text-xs font-bold block mb-1"><MdText text={inhalt.texte.glasrandverbundAbstandhalter} /></label>
                <select aria-label={inhalt.werte.glasrandverbundAbstandhalter}
                  value={abstandhalterTyp}
                  onChange={(e) => setAbstandhalterTyp(e.target.value as "edelstahl" | "alu" | "warm_edge_kunststoff")}
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
                  <span><MdText text={inhalt.texte.gesamtenergiedurchlassGWert} /></span>
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
                  <span><MdText text={inhalt.texte.t025Sonnenschutz} /></span>
                  <span><MdText text={inhalt.texte.t0533Iv} /></span>
                  <span>0,65 (2-IV)</span>
                </div>
              </div>
    
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span><MdText text={inhalt.texte.sonneneinstrahlungAufFassade} /></span>
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
                  <span><MdText text={inhalt.texte.t150Bewölkt} /></span>
                  <span><MdText text={inhalt.texte.t450FrühjahrHerbst} /></span>
                  <span><MdText text={inhalt.texte.t850Hochsommer} /></span>
                </div>
              </div>
            </div>
          </div>
    
          {/* Ergebnis-Panel */}
          <div className="bg-white p-6 rounded-2xl border-2 border-shiraz shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-3 mb-4">
                <span className="text-xs uppercase tracking-wider font-bold text-home-grau"><MdText text={inhalt.texte.ergebnisNachDinEn} /></span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      calcResults.passivhausStandard 
                        ? 'bg-slate-800 text-white' 
                        : calcResults.gegKonform 
                          ? 'bg-slate-600 text-white' 
                          : 'bg-shiraz text-white'
                    }`}>
                  {calcResults.passivhausStandard ? 'Passivhaus-Tauglich' : calcResults.gegKonform ? 'GModG-Konform' : inhalt.werte.nichtZulässigGmodg}
                </span>
              </div>
    
              <EingabeHinweise hinweise={calcResults.hinweise} />
              <div className="text-center my-3">
                <span className="text-xs text-home-grau font-semibold block"><MdText text={inhalt.texte.gesamterWärmedurchgangskoeffizient} /></span>
                <div className="text-4xl font-extrabold text-shiraz font-mono mt-1">
                  {formatDeZahl(calcResults.uw, 2)}
                  <span className="text-base font-normal text-text-main ml-1">W/(m²K)</span>
                </div>
              </div>
    
              {/* Aufschlüsselung der Wärmeströme */}
              <div className="mt-4 pt-4 border-t border-home-grau/20 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-main/70"><MdText text={inhalt.texte.gesamtfensterflächeAW} /></span>
                  <span className="font-mono font-bold text-slate-800">{formatDeZahl(calcResults.Af_total, 2)} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-main/70"><MdText text={inhalt.texte.sichtbareGlasflächeAG} /></span>
                  <span className="font-mono font-bold text-slate-800">{formatDeZahl(calcResults.Ag, 2)} m² ({formatDeZahl((calcResults.Ag / calcResults.Af_total * 100), 0)} %)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-main/70"><MdText text={inhalt.texte.rahmenflächeAF} /></span>
                  <span className="font-mono font-bold text-slate-800">{formatDeZahl(calcResults.Af, 2)} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-main/70"><MdText text={inhalt.texte.glasumfangLG} /></span>
                  <span className="font-mono font-bold text-slate-800">{formatDeZahl(calcResults.Lg, 2)} m</span>
                </div>
              </div>
    
              <div className="mt-4 pt-4 border-t border-home-grau/20 space-y-1.5 text-[11px] bg-off-white p-3 rounded-xl border border-home-grau/25">
                <div className="font-bold text-slate-900 mb-1"><MdText text={inhalt.texte.anteiligeWärmeverlusteBeiT} /></div>
                <div className="flex justify-between">
                  <span><MdText text={inhalt.texte.glasverlustAGU} /></span>
                  <span className="font-mono font-semibold">{formatDeZahl(calcResults.waermestromGlas, 2)} W/K ({formatDeZahl((calcResults.waermestromGlas / (calcResults.uw * calcResults.Af_total) * 100), 0)} %)</span>
                </div>
                <div className="flex justify-between">
                  <span><MdText text={inhalt.texte.rahmenverlustAFU} /></span>
                  <span className="font-mono font-semibold">{formatDeZahl(calcResults.waermestromRahmen, 2)} W/K ({formatDeZahl((calcResults.waermestromRahmen / (calcResults.uw * calcResults.Af_total) * 100), 0)} %)</span>
                </div>
                <div className="flex justify-between">
                  <span><MdText text={inhalt.texte.kantenverlustLGG} /></span>
                  <span className="font-mono font-semibold">{formatDeZahl(calcResults.waermestromKante, 2)} W/K ({formatDeZahl((calcResults.waermestromKante / (calcResults.uw * calcResults.Af_total) * 100), 0)} %)</span>
                </div>
              </div>
    
              {/* Solare Gewinne */}
              <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs">
                <div className="flex items-center justify-between text-amber-900 font-bold mb-0.5">
                  <span><MdText text={inhalt.texte.solareWärmezufuhr} /></span>
                  <span className="font-mono">{formatDeZahl(calcResults.solareGewinneWatt, 0)} Watt</span>
                </div>
                <p className="text-[10px] text-amber-800"><MdText text={inhalt.texte.passiveErwärmungDurchSonneneinstrahlung} />{formatDeWert(sonneneinstrahlung)}<MdText text={inhalt.texte.wMWinterHeizunterstützung} /></p>
              </div>
            </div>
    
            <div className="mt-4 pt-3 border-t border-home-grau/20 text-[10px] text-home-grau text-center"><MdText text={inhalt.texte.berechnungsgrundlageDinEnIso} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
