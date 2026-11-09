import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { Layers, Mountain } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import inhalt from '@/content/leichtbeton/Leichtbeton.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

export default function Leichtbeton() {
  const [dichte, setDichte] = useState(1.4);

  // estimate compressive strength based on density (very rough linear approx for learning)
  const fc = Math.max(2, (dichte - 0.8) * 35); // Lehrnäherung (linear, nicht normativ): +35 N/mm² je kg/dm³ über 0,8
  const lambda = Math.max(0.15, (dichte - 0.4) * 0.4); // Wärmeleitfähigkeit, Lehrnäherung (nicht normativ, Bemessungswerte nach DIN 4108-4)

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.leichtbetonLb} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p><MdText text={inhalt.texte.konstruktionsleichtbetonRohdichte800Bis} /></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-home-grau/30 shadow-sm">
          <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
            <Mountain className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.eigenschaftenBemessung} /></h3>
          <p className="text-sm text-text-main/80 mb-4"><MdText text={inhalt.texte.beiLeichtbetonIstDas} /></p>
          <div className="bg-off-white border border-home-grau/20 rounded-xl p-4 mb-4">
            <div className="text-sm text-shiraz font-semibold mb-2"><FormulaText text="\eta_E = ( \rho / 2200 )^2" /></div>
            <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.modifikationsbeiwertFürDenE} /></p>
          </div>
          <div className="bg-off-white border border-home-grau/20 rounded-xl p-4">
            <div className="text-sm text-shiraz font-semibold mb-2"><FormulaText text="\eta_1 = 0.40 + 0.60 \cdot (\rho / 2200)" /></div>
            <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.abminderungDerZugfestigkeitIm} /></p>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-home-grau/30 shadow-sm relative overflow-hidden">
          <h3 className="text-lg font-bold text-text-main mb-4 relative z-10"><MdText text={inhalt.texte.dichteAbhängigkeitNäherung} /></h3>
          
          <div className="space-y-6 relative z-10">
            <div>
              <label className="text-sm font-medium text-text-main flex justify-between mb-2">
                <span>Rohdichte <FormulaText text="\rho" /></span>
                <span className="text-shiraz font-bold">{formatDeZahl(dichte, 2)} kg/dm³</span>
              </label>
              <input 
                type="range" min="0.8" max="2.0" step="0.1"
                value={dichte}
                onChange={(e) => setDichte(parseFloat(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
              <div className="flex justify-between text-xs text-home-grau mt-1">
                <span>Leicht</span><span>Schwer</span>
              </div>
            </div>
            
            <ErgebnisAnsage text={kurzzeile(ansageWert('Rohdichte', dichte, 2, 'kg/dm³'), ansageWert('geschätzte Festigkeit etwa', fc, 1, 'MPa'), ansageWert('Wärmeleitfähigkeit etwa', lambda, 2, 'W/(m·K)'))} />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-home-grau/20 p-4 rounded-xl text-center">
                <div className="text-xs text-text-main/70 mb-1 font-semibold uppercase tracking-wider"><MdText text={inhalt.texte.geschätzteFestigkeit} /></div>
                <div className="text-2xl font-bold text-shiraz"><FormulaText text={`\\approx ${formatDeTeX(fc, 1)}`} /> <span className="text-sm">MPa</span></div>
              </div>
              <div className="bg-slate-50 border border-home-grau/20 p-4 rounded-xl text-center">
                <div className="text-xs text-text-main/70 mb-1 font-semibold uppercase tracking-wider">Wärmeleitfähigkeit <FormulaText text="\lambda" /></div>
                <div className="text-2xl font-bold text-slate-800"><FormulaText text={`\\approx ${formatDeTeX(lambda, 2)}`} /> <span className="text-sm">W/(m·K)</span></div>
              </div>
            </div>
            <p className="text-[10px] text-text-main/50 text-center"><MdText text={inhalt.texte.achtungDiesSindStark} /></p>
          </div>
        </div>
      
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 md:col-span-2">
          <h3 className="font-bold text-text-main mb-4 flex items-center gap-2"><MdText text={inhalt.texte.beispielrezepturRichtwerte} /></h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[300px]">
              <thead>
                <tr className="border-b-2 border-home-grau/30 bg-off-white">
                  <th className="py-2.5 px-3 text-sm font-semibold text-text-main">Komponente</th>
                  <th className="py-2.5 px-3 text-sm font-semibold text-text-main text-right">Menge</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Zement</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 380 kg/m³</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Wasser</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 170 kg/m³</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.leichteGesteinskörnung} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 600 kg/m³</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">w/z</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 0,45</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    
</div>
  );
}