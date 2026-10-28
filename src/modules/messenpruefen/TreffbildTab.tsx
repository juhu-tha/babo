import type { Dispatch, SetStateAction } from 'react';
import { Target } from 'lucide-react';
import inhalt from '@/content/messenpruefen/TreffbildTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';

export interface TreffbildTabProps {
  accuracy: "high" | "low";
  setAccuracy: Dispatch<SetStateAction<"high" | "low">>;
  precision: "high" | "low";
  setPrecision: Dispatch<SetStateAction<"high" | "low">>;
  targetShots: { x: number; y: number; }[];
}

export function TreffbildTab({ accuracy, setAccuracy, precision, setPrecision, targetShots }: TreffbildTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 font-sans">
          <Target className="text-shiraz" size={20} /><MdText text={inhalt.texte.systematischeAbweichungVsZufällige} /></h2>
        <p className="text-slate-600 text-xs leading-relaxed max-w-4xl font-sans"><MdText text={inhalt.texte.dasMessergebnisBeiFestigkeits} /></p>
    
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          
          {/* Left Selector: Dynamic Controls */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-home-grau/30 p-5 rounded-xl bg-slate-50 gap-4">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Modul-Konfigurator</span>
              
              {/* Selector 1: Accuracy (Richtigkeit) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between font-sans">
                  <span><MdText text={inhalt.texte.richtigkeitEnglTrueness} /></span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                        accuracy === 'high' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                    {accuracy === 'high' ? inhalt.werte.richtigkeitHoch : inhalt.werte.systematischeAbweichung}
                  </span>
                </label>
                <AuswahlGruppe label="Richtigkeit" className="grid grid-cols-2 gap-2">
                  <button {...alsOption(accuracy === 'high')}
                    onClick={() => setAccuracy('high')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all font-sans ${
                          accuracy === 'high' ? 'bg-shiraz text-white border-shiraz shadow-sm' : 'bg-white text-slate-600 border-home-grau/30 hover:bg-slate-50'
                        }`}
                  ><MdText text={inhalt.texte.hochZentriert} /></button>
                  <button {...alsOption(accuracy === 'low')}
                    onClick={() => setAccuracy('low')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all font-sans ${
                          accuracy === 'low' ? 'bg-shiraz text-white border-shiraz shadow-sm' : 'bg-white text-slate-600 border-home-grau/30 hover:bg-slate-50'
                        }`}
                  ><MdText text={inhalt.texte.niedrigVerschoben} /></button>
                </AuswahlGruppe>
                <p className="text-[10px] text-slate-500 leading-normal font-sans"><MdText text={inhalt.texte.systematischeMessfehlerZB} /></p>
              </div>
    
              {/* Selector 2: Precision (Präzision) */}
              <div className="space-y-2 pt-4 border-t border-home-grau/30">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between font-sans">
                  <span><MdText text={inhalt.texte.präzisionStreuungEnglPrecision} /></span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                        precision === 'high' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                    {precision === 'high' ? inhalt.werte.geringeStreuung : inhalt.werte.hohePrüfstreuung}
                  </span>
                </label>
                <AuswahlGruppe label="Präzision" className="grid grid-cols-2 gap-2">
                  <button {...alsOption(precision === 'high')}
                    onClick={() => setPrecision('high')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all font-sans ${
                          precision === 'high' ? 'bg-shiraz text-white border-shiraz shadow-sm' : 'bg-white text-slate-600 border-home-grau/30 hover:bg-slate-50'
                        }`}
                  ><MdText text={inhalt.texte.hochGeringeStreuung} /></button>
                  <button {...alsOption(precision === 'low')}
                    onClick={() => setPrecision('low')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all font-sans ${
                          precision === 'low' ? 'bg-shiraz text-white border-shiraz shadow-sm' : 'bg-white text-slate-600 border-home-grau/30 hover:bg-slate-50'
                        }`}
                  ><MdText text={inhalt.texte.niedrigWeitGestreut} /></button>
                </AuswahlGruppe>
                <p className="text-[10px] text-slate-500 leading-normal font-sans"><MdText text={inhalt.texte.zufälligeMessfehlerZB} /></p>
              </div>
    
            </div>
    
            <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 mt-2 text-xs text-slate-600 space-y-1 font-sans">
              <span className="font-bold text-slate-800 block"><MdText text={inhalt.texte.ingenieurtechnischeDiagnose} /></span>
              <p className="text-[11px] leading-relaxed">
                {accuracy === 'high' && precision === 'high' && inhalt.werte.richtigUndPräziseGeringe}
                {accuracy === 'low' && precision === 'high' && inhalt.werte.achtungGuteWiederholbarkeitAber}
                {accuracy === 'high' && precision === 'low' && inhalt.werte.imMittelRichtigAber}
                {accuracy === 'low' && precision === 'low' && inhalt.werte.wederRichtigNochPräzise}
              </p>
            </div>
          </div>
    
          {/* Right Target Screen (Interactive SVG) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-100 rounded-xl border border-home-grau/30 relative">
            <span className="absolute top-4 left-4 text-[10px] font-bold text-slate-400 font-mono"><MdText text={inhalt.texte.schussbildAnzeigeTreffbild} /></span>
            
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
                  {accuracy === 'high' ? inhalt.werte.hochZentriert : inhalt.werte.niedrigSystemFehler}
                </span>
              </div>
              <div className="px-3 py-1.5 bg-white border border-home-grau/30 rounded shadow-xs font-sans">
                <span className="text-slate-500 font-mono block text-[9px] uppercase">Präzision</span>
                <span className={`font-bold ${precision === 'high' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {precision === 'high' ? inhalt.werte.hochKompakt : inhalt.werte.niedrigGestreut}
                </span>
              </div>
            </div>
    
          </div>
    
        </div>
      </div>
    </div>
  );
}
