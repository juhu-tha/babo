// Ausgelagert aus src/modules/BpVerkehrswegebau.tsx (AP 5.2)
import { formatDeZahl } from '@/src/utils/numberFormat';
import React from 'react';
import { InlineMath } from 'react-katex';
import { Calculator, CheckCircle2 } from 'lucide-react';
import inhalt from '@/content/bpverkehrswegebau/PrueftechnikTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

export interface PrueftechnikTabProps {
  asphaltMischung: { gesteinAnteil: number; bitumenAnteil: number; rhoGestein: number; rhoBitumen: number; raumdichteMischung: number; };
  luftPorenErrechnet: { maxDichte: string; luftporen: string; hohlraum: number; isOk: boolean; };
  setAsphaltMischung: React.Dispatch<React.SetStateAction<{ gesteinAnteil: number; bitumenAnteil: number; rhoGestein: number; rhoBitumen: number; raumdichteMischung: number; }>>;
}

export default function PrueftechnikTab({ asphaltMischung, luftPorenErrechnet, setAsphaltMischung }: PrueftechnikTabProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Marshall-Verfahren */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30">
          <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-700" /><MdText text={inhalt.texte.prüftechnikImLabor} /></h3>
          
          <div className="space-y-4 text-xs text-text-main/75 leading-relaxed">
            <div>
              <h4 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1 wie-h5"><MdText text={inhalt.texte.marshallStabilitätUndFließwert} /></h4>
              <p><MdText text={inhalt.texte.mischprobenWerdenMitDem} /></p>
            </div>

            <div className="border-t border-zinc-100 pt-3">
              <h4 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1 wie-h5"><MdText text={inhalt.texte.spurbildungsversuchWheelTrackingDin} /></h4>
              <p><MdText text={inhalt.texte.simuliertDieSpurinnenbildungUnter} /></p>
            </div>
          </div>
        </div>

        {/* Interaktive Berechnungen (Hohlraum / Dichte) */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30">
          <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calculator size={16} className="text-shiraz" /><MdText text={inhalt.texte.interaktiverHohlraumrechnerRiceMaximaldi} /></h3>
          <p className="text-xs text-text-main/70 leading-relaxed mb-4"><MdText text={inhalt.texte.studentischeÜbungsrechnungBestimmenSie} /></p>

          <div className="space-y-4">
            
            {/* Gesteinsanteil */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span><MdText text={inhalt.texte.bitumengehaltB} /></span>
                <span className="font-mono text-xs">{formatDeZahl(asphaltMischung.bitumenAnteil, 1)}<MdText text={inhalt.texte.mGestein} />{formatDeZahl(asphaltMischung.gesteinAnteil, 1)} M.-%)</span>
              </div>
              <input 
                type="range" 
                min="3.0" 
                max="9.0" 
                step="0.1"
                value={asphaltMischung.bitumenAnteil}
                onChange={(e) => {
                  const bit = parseFloat(e.target.value);
                  setAsphaltMischung(prev => ({
                    ...prev,
                    bitumenAnteil: bit,
                    gesteinAnteil: 100 - bit
                  }));
                }}
                className="w-full accent-shiraz" 
              />
            </div>

            {/* Raumdichte */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span><MdText text={inhalt.texte.gemesseneRaumdichteRhoR} /></span>
                <span className="font-mono text-xs">{formatDeZahl(asphaltMischung.raumdichteMischung, 2)} g/cm³</span>
              </div>
              <input 
                type="range" 
                min="2.20" 
                max="2.55" 
                step="0.01"
                value={asphaltMischung.raumdichteMischung}
                onChange={(e) => {
                  const rd = parseFloat(e.target.value);
                  setAsphaltMischung(prev => ({
                    ...prev,
                    raumdichteMischung: rd
                  }));
                }}
                className="w-full accent-shiraz" 
              />
            </div>

            {/* Ergebnisse Rechner */}
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2 mt-4">
              <div className="grid grid-cols-2 text-xs font-mono">
                <div><MdText text={inhalt.texte.theorHohlraumfreieDichte} /></div>
                <div className="text-right font-extrabold text-zinc-800">{luftPorenErrechnet.maxDichte} g/cm³</div>
              </div>
              <div className="grid grid-cols-2 text-xs font-mono border-t border-zinc-200/50 pt-2">
                <div className="font-bold"><MdText text={inhalt.texte.errechneterLuftporengehaltVU} /></div>
                <div className="text-right font-extrabold text-lg text-zinc-900">{formatDeZahl(luftPorenErrechnet.hohlraum, 2)} Vol.-%</div>
              </div>
              <ErgebnisAnsage text={kurzzeile(`Hohlraumfreie Dichte ${luftPorenErrechnet.maxDichte} g/cm³`, ansageWert('Hohlraumgehalt', luftPorenErrechnet.hohlraum, 2, 'Vol.-%'), Number.isFinite(luftPorenErrechnet.hohlraum) && (luftPorenErrechnet.isOk ? 'konform' : 'nicht konform'))} />

              <div className="mt-2 text-[10.5px] border-t border-zinc-250 pt-2">
                {luftPorenErrechnet.isOk ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1"><MdText text={inhalt.texte.konformZtvAsphaltStb} /></span>
                ) : (
                  <span className="text-rose-700 font-bold flex items-center gap-1"><MdText text={inhalt.texte.nichtKonformFürDeckschichten} />{luftPorenErrechnet.hohlraum < 1.5 ? inhalt.werte.zuDichtGefahrVon : inhalt.werte.zuOffenGefahrVon})
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
