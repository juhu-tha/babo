// Ausgelagert aus src/modules/Betonkennwerte.tsx (AP 5.2)
import { Activity, Clock, Droplets } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

export default function ZeitTheorieTab() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Box 1: Zeitliche Festigkeitsentwicklung */}
        <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
              <Clock size={16} className="text-shiraz" /> Festigkeitsentwicklung β_cc(t) (Abschnitt 1)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Die Druckfestigkeit wächst mit fortschreitender Zementhydratation. Nach EC2 Abs. 3.1.2 berechnet sich der Mittelwert zum Zeitpunkt <InlineMath math="t" /> [Tage] nach:
            </p>
            <div className="p-3 bg-off-white rounded-xl border border-home-grau/25 text-center my-2 overflow-x-auto">
              <BlockMath math="f_{cm}(t) = \beta_{cc}(t) \cdot f_{cm}" />
              <BlockMath math="\beta_{cc}(t) = \exp\left\{ s \cdot \left[1 - \left(\frac{28}{t}\right)^{0{,}5}\right] \right\}" />
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5 mt-3">
              <li>&bull; <strong>s = 0,20:</strong> Klasse R (CEM 42,5 R, CEM 52,5 N/R)</li>
              <li>&bull; <strong>s = 0,25:</strong> Klasse N (CEM 32,5 R, CEM 42,5 N)</li>
              <li>&bull; <strong>s = 0,38:</strong> Klasse S (CEM 32,5 N)</li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Zeitliche Entwicklung der Zugfestigkeit nach Gl. (3.4): <InlineMath math="f_{ctm}(t) = (\beta_{cc}(t))^{\alpha} \cdot f_{ctm}" /> (<InlineMath math="\alpha = 1{,}0" /> für <InlineMath math="t < 28\text{ d}" />, <InlineMath math="\alpha = 2/3" /> für <InlineMath math="t \ge 28\text{ d}" />).
          </div>
        </div>

        {/* Box 2: Spannungs-Dehnungs-Gesetze */}
        <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
              <Activity size={16} className="text-indigo-600" /> Spannungs-Dehnungs-Linien (Abschnitt 4)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Für die Querschnittsbemessung im Grenzzustand der Tragfähigkeit (GZT) stellt EC2 das <strong>Parabel-Rechteck-Diagramm</strong> bereit (Gl. 3.17 – 3.20):
            </p>
            <div className="p-3 bg-off-white rounded-xl border border-home-grau/25 text-center my-2 overflow-x-auto">
              <BlockMath math="\sigma_c = \begin{cases} f_{cd} \cdot \left[ 1 - \left(1 - \frac{\varepsilon_c}{\varepsilon_{c2}}\right)^n \right] & \text{für } 0 \le \varepsilon_c \le \varepsilon_{c2} \ f_{cd} & \text{für } \varepsilon_{c2} \le \varepsilon_c \le \varepsilon_{cu2} \end{cases}" />
            </div>
            <div className="text-xs text-slate-700 mt-2">
              Für Normalbeton gilt: <InlineMath math="\varepsilon_{c2} = 2{,}0\,\text{‰}" />, <InlineMath math="\varepsilon_{cu2} = 3{,}5\,\text{‰}" />, <InlineMath math="n = 2{,}0" /> (reine quadratische Parabel).
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Nichtlineare Beziehung für Verformungsberechnungen (Gl. 3.14): <InlineMath math="\frac{\sigma_c}{f_{cm}} = \frac{k \cdot \eta - \eta^2}{1 + (k - 2) \cdot \eta}" />
          </div>
        </div>

      </div>

      {/* Detaillierter Vergleich der Schwindarten */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h4 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
          <Droplets size={18} className="text-rose-600" />
          Trocknungsschwinden vs. Autogenes Schwinden (Physikalischer Mechanismus)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 bg-off-white rounded-xl border border-home-grau/20">
            <strong className="block text-slate-900 font-bold mb-1 text-sm">
              1. Trocknungsschwinden ε_cd(t) (Abschnitt 5)
            </strong>
            <p>
              Entsteht durch den physikalischen Wasserverlust des Betons an eine ungesättigte Umgebung (relative Luftfeuchte RH &lt; 100 %). Durch das Verdunsten von Meniskuswasser in den Kapillarporen entstehen enorme Kapillarkräfte (Unterdruck), die die Porenwände zusammenziehen.
            </p>
            <div className="mt-2 font-mono text-[11px] bg-white p-2 rounded border border-slate-200">
              <InlineMath math="\varepsilon_{cd}(t, t_s) = \beta_{ds}(t, t_s) \cdot k_h \cdot \varepsilon_{cd,0}" />
            </div>
          </div>

          <div className="p-4 bg-off-white rounded-xl border border-home-grau/20">
            <strong className="block text-slate-900 font-bold mb-1 text-sm">
              2. Autogenes Schwinden ε_ca(t) (Abschnitt 5)
            </strong>
            <p>
              Tritt vollkommen ohne Wasserverlust an die Außenwelt auf (sogar unter lückenloser Versiegelung oder unter Wasser). Ursache ist die <strong>chemische Kontraktion (Le-Chatelier)</strong>: Das Volumen der Hydratationsprodukte (C-S-H) ist um ca. 8–10 % kleiner als die Summe der Ausgangsvolumina von Zement und Wasser.
            </p>
            <div className="mt-2 font-mono text-[11px] bg-white p-2 rounded border border-slate-200">
              <InlineMath math="\varepsilon_{ca}(\infty) = 2{,}5 \cdot (f_{ck} - 10) \cdot 10^{-6}, \quad \beta_{as}(t) = 1 - \exp(-0{,}2 \cdot t^{0{,}5})" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
