// Ausgelagert aus src/modules/Betonkennwerte.tsx (AP 5.2)
import { Activity, Clock, Droplets } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import inhalt from '@/content/betonkennwerte/ZeitTheorieTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function ZeitTheorieTab() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Box 1: Zeitliche Festigkeitsentwicklung */}
        <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2 wie-h4">
              <Clock size={16} className="text-shiraz" /><MdText text={inhalt.texte.festigkeitsentwicklungCcTAbschnitt} /></h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3"><MdText text={inhalt.texte.dieDruckfestigkeitWächstMit} /></p>
            <div className="p-3 bg-off-white rounded-xl border border-home-grau/25 text-center my-2 overflow-x-auto">
              <BlockMath math="f_{cm}(t) = \beta_{cc}(t) \cdot f_{cm}" />
              <BlockMath math="\beta_{cc}(t) = \exp\left\{ s \cdot \left[1 - \left(\frac{28}{t}\right)^{0{,}5}\right] \right\}" />
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5 mt-3">
              <li><MdText text={inhalt.texte.s020Klasse} /></li>
              <li><MdText text={inhalt.texte.s025Klasse} /></li>
              <li><MdText text={inhalt.texte.s038Klasse} /></li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500"><MdText text={inhalt.texte.zeitlicheEntwicklungDerZugfestigkeit} /></div>
        </div>

        {/* Box 2: Spannungs-Dehnungs-Gesetze */}
        <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2 wie-h4">
              <Activity size={16} className="text-indigo-600" /><MdText text={inhalt.texte.spannungsDehnungsLinienAbschnitt} /></h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3"><MdText text={inhalt.texte.fürDieQuerschnittsbemessungIm} /></p>
            <div className="p-3 bg-off-white rounded-xl border border-home-grau/25 text-center my-2 overflow-x-auto">
              <BlockMath math="\sigma_c = \begin{cases} f_{cd} \cdot \left[ 1 - \left(1 - \frac{\varepsilon_c}{\varepsilon_{c2}}\right)^n \right] & \text{für } 0 \le \varepsilon_c \le \varepsilon_{c2} \ f_{cd} & \text{für } \varepsilon_{c2} \le \varepsilon_c \le \varepsilon_{cu2} \end{cases}" />
            </div>
            <div className="text-xs text-slate-700 mt-2"><MdText text={inhalt.texte.fürNormalbetonGiltVarepsilon} /></div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500"><MdText text={inhalt.texte.nichtlineareBeziehungFürVerformungsberec} /></div>
        </div>

      </div>

      {/* Detaillierter Vergleich der Schwindarten */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2 wie-h4">
          <Droplets size={18} className="text-rose-600" /><MdText text={inhalt.texte.trocknungsschwindenVsAutogenesSchwinden} /></h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 bg-off-white rounded-xl border border-home-grau/20">
            <strong className="block text-slate-900 font-bold mb-1 text-sm"><MdText text={inhalt.texte.t1TrocknungsschwindenCdT} /></strong>
            <p><MdText text={inhalt.texte.entstehtDurchDenPhysikalischen} /></p>
            <div className="mt-2 font-mono text-[11px] bg-white p-2 rounded border border-slate-200">
              <InlineMath math="\varepsilon_{cd}(t, t_s) = \beta_{ds}(t, t_s) \cdot k_h \cdot \varepsilon_{cd,0}" />
            </div>
          </div>

          <div className="p-4 bg-off-white rounded-xl border border-home-grau/20">
            <strong className="block text-slate-900 font-bold mb-1 text-sm"><MdText text={inhalt.texte.t2AutogenesSchwindenCa} /></strong>
            <p><MdText text={inhalt.texte.trittVollkommenOhneWasserverlust} /></p>
            <div className="mt-2 font-mono text-[11px] bg-white p-2 rounded border border-slate-200">
              <InlineMath math="\varepsilon_{ca}(\infty) = 2{,}5 \cdot (f_{ck} - 10) \cdot 10^{-6}, \quad \beta_{as}(t) = 1 - \exp(-0{,}2 \cdot t^{0{,}5})" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
