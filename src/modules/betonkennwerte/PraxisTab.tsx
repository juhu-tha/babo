// Ausgelagert aus src/modules/Betonkennwerte.tsx (AP 5.2)
import { ShieldCheck } from 'lucide-react';
import { InlineMath } from 'react-katex';

export default function PraxisTab() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <ShieldCheck size={18} className="text-shiraz" />
          Relevanz der Betonkennwerte in der Tragwerksplanung
        </h3>
        <p className="text-xs text-slate-700 leading-relaxed">
          Die normativen Kennwerte nach EC2 steuern nicht nur die Querschnittstragfähigkeit im GZT, sondern maßgeblich die Gebrauchstauglichkeitsnachweise (GZG) sowie baupraktische Bauzustände:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-3">
          
          <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
            <div>
              <strong className="text-slate-900 font-bold block mb-1 text-sm">1. Durchbiegungsnachweis (GZG)</strong>
              <p className="text-slate-600 leading-relaxed">
                Langzeitverformungen von Decken und Trägern werden durch das Kriechen um den Faktor <InlineMath math="(1 + \varphi)" /> vergrößert. Die Berechnung erfolgt über den effektiven Kriechmodul:
              </p>
              <div className="my-2 p-2 bg-white rounded border border-slate-200 text-center font-mono">
                <InlineMath math="E_{c,\text{eff}} = \frac{E_{cm}}{1 + \varphi(t, t_0)}" />
              </div>
              <p className="text-[11px] text-slate-500">
                Bei Schwindzwang: <InlineMath math="E_{c,\text{eff,Zwang}} = \frac{E_{cm}}{1 + 0{,}8 \cdot \varphi}" />
              </p>
            </div>
            <span className="text-[10px] text-slate-500 block pt-2 border-t border-slate-200">
              DIN EN 1992-1-1 Abs. 7.4.3 (Gl. 7.20)
            </span>
          </div>

          <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
            <div>
              <strong className="text-slate-900 font-bold block mb-1 text-sm">2. Mindestbewehrung für Rissbreite</strong>
              <p className="text-slate-600 leading-relaxed">
                Zur Begrenzung der Rissbreite infolge abfließender Hydratationswärme oder Schwindzwang muss die Mindestbewehrung die Zugkraft bei Erstrissbildung aufnehmen:
              </p>
              <div className="my-2 p-2 bg-white rounded border border-slate-200 text-center font-mono">
                <InlineMath math="A_{s,\text{min}} \cdot \sigma_s = k_c \cdot k \cdot f_{ct,\text{eff}} \cdot A_{ct}" />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 block pt-2 border-t border-slate-200">
              DIN EN 1992-1-1 Abs. 7.3.2
            </span>
          </div>

          <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
            <div>
              <strong className="text-slate-900 font-bold block mb-1 text-sm">3. Bauwerksdiagnose nach DIN EN 13791</strong>
              <p className="text-slate-600 leading-relaxed">
                Die In-situ-Druckfestigkeit <InlineMath math="f_{ck,\text{is}}" /> aus Bohrkernen ist bauartbedingt ca. 15 % geringer als die Standard-Zylinderfestigkeit aus dem Labor (Probekörperlagerung unter Wasser):
              </p>
              <div className="my-2 p-2 bg-white rounded border border-slate-200 text-center font-mono">
                <InlineMath math="f_{ck,\text{is}} = 0{,}85 \cdot f_{ck}" />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 block pt-2 border-t border-slate-200">
              DIN EN 13791:2020-02
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
