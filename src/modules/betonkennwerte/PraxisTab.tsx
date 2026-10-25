// Ausgelagert aus src/modules/Betonkennwerte.tsx (AP 5.2)
import { ShieldCheck } from 'lucide-react';
import { InlineMath } from 'react-katex';
import inhalt from '@/content/betonkennwerte/PraxisTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function PraxisTab() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <ShieldCheck size={18} className="text-shiraz" /><MdText text={inhalt.texte.relevanzDerBetonkennwerteIn} /></h3>
        <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.dieNormativenKennwerteNach} /></p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-3">
          
          <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
            <div>
              <strong className="text-slate-900 font-bold block mb-1 text-sm"><MdText text={inhalt.texte.t1DurchbiegungsnachweisGzg} /></strong>
              <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.langzeitverformungenVonDeckenUnd} /></p>
              <div className="my-2 p-2 bg-white rounded border border-slate-200 text-center font-mono">
                <InlineMath math="E_{c,\text{eff}} = \frac{E_{cm}}{1 + \varphi(t, t_0)}" />
              </div>
              <p className="text-[11px] text-slate-500"><MdText text={inhalt.texte.beiSchwindzwangEC} /></p>
            </div>
            <span className="text-[10px] text-slate-500 block pt-2 border-t border-slate-200"><MdText text={inhalt.texte.dinEn19921} /></span>
          </div>

          <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
            <div>
              <strong className="text-slate-900 font-bold block mb-1 text-sm"><MdText text={inhalt.texte.t2MindestbewehrungFürRissbreite} /></strong>
              <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.zurBegrenzungDerRissbreite} /></p>
              <div className="my-2 p-2 bg-white rounded border border-slate-200 text-center font-mono">
                <InlineMath math="A_{s,\text{min}} \cdot \sigma_s = k_c \cdot k \cdot f_{ct,\text{eff}} \cdot A_{ct}" />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 block pt-2 border-t border-slate-200"><MdText text={inhalt.texte.dinEn199212} /></span>
          </div>

          <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
            <div>
              <strong className="text-slate-900 font-bold block mb-1 text-sm"><MdText text={inhalt.texte.t3BauwerksdiagnoseNachDin} /></strong>
              <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.dieInSituDruckfestigkeit} /></p>
              <div className="my-2 p-2 bg-white rounded border border-slate-200 text-center font-mono">
                <InlineMath math="f_{ck,\text{is}} = 0{,}85 \cdot f_{ck}" />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 block pt-2 border-t border-slate-200"><MdText text={inhalt.texte.dinEn137912020} /></span>
          </div>

        </div>
      </div>

    </div>
  );
}
