import { Zap, Scale, Thermometer, BookOpen } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

export default function KennwerteRelaxation() {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
          <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <Zap className="text-shiraz h-5 w-5" />
              3. Relaxation des Spannstahls (<InlineMath math="\Delta\sigma_{pr}" /> / Spannungsabfall bei starrer Dehnung)
            </h4>
            <span className="text-xs font-mono font-bold bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-1 rounded-md">
              Verlustanteil: ca. 2–5 % von P₀
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm text-text-main/80 leading-relaxed">
              <p>
                <strong>Was ist Relaxation?</strong> Während Kriechen die <em>Dehnungszunahme bei konstanter Spannung</em> beschreibt, 
                ist die Relaxation das exakte Gegenstück: der <strong>Spannungsabfall im hochfesten Stahl bei festgehaltener, konstanter Dehnung</strong>:
              </p>
              <div className="bg-off-white p-3 rounded-xl border border-home-grau/30 text-center">
                <BlockMath math="\varepsilon_p = \text{const.} \quad \Longrightarrow \quad \sigma_p(t) < \sigma_{p0}" />
              </div>
              <p>
                <strong>Mikrostruktureller Vorgang im Kristallgitter:</strong> An der Presse höchstens <InlineMath math="\sigma_{p,max} = \min(0{,}80 f_{pk};\, 0{,}90 f_{p0{,}1k}) = 1440\text{ N/mm}^2" />, nach dem Verankern <InlineMath math="\sigma_{pm0} \le 1360\text{ N/mm}^2" /> (Y1860). Unter 
                dieser immensen atomaren Spannung wandern Versetzungen (Gitterbaufehler) durch thermisch aktiviertes Versetzungsgleiten. Ein winziger Teil der elastischen Gitterdehnung wandelt sich mikroskopisch in bleibende plastische 
                Verformung um <InlineMath math="\rightarrow" /> die makroskopische Zugspannung sinkt ab!
              </p>
            </div>

            {/* Relaxationsklassen nach Eurocode 2 */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-purple-700" />
                Die 3 Relaxationsklassen (DIN EN 10138 / EC2)
              </h5>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-900 mb-1">
                    <span>Klasse 1: Normale Relaxation</span>
                    <span className="text-red-700 font-mono">ρ₁₀₀₀ ≈ 8,0 %</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Kaltgezogene Drähte und Litzen ohne spezielle Thermobehandlung. Historischer Standard, heute kaum noch verwendet.</p>
                </div>

                <div className="p-3 bg-purple-50/70 rounded-lg border border-purple-200">
                  <div className="flex justify-between font-bold text-purple-950 mb-1">
                    <span>Klasse 2: Sehr niedrige Relaxation (Low-Relaxation)</span>
                    <span className="text-purple-800 font-mono font-bold">ρ₁₀₀₀ ≈ 2,5 %</span>
                  </div>
                  <p className="text-[11px] text-purple-900">
                    <strong>Heutiger Standard:</strong> Die Litzen werden nach dem Ziehen unter ständiger Zugspannung kurz auf ca. 350 °C erwärmt („thermisches Stabilisieren“). 
                    Versetzungen werden blockiert.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-900 mb-1">
                    <span>Klasse 3: Warmgewalzte Spannstähle</span>
                    <span className="text-amber-800 font-mono">ρ₁₀₀₀ ≈ 4,0 %</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Spannstäbe mit warm aufgewalztem Gewinde (z. B. Dywidag-Gewindestangen SAS).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Eurocode 2 Formel für Relaxation */}
          <div className="bg-purple-50/40 p-4 rounded-xl border border-purple-100 space-y-3">
            <div className="font-bold text-purple-900 text-xs flex items-center justify-between">
              <span>Berechnung nach Eurocode 2 (DIN EN 1992-1-1 Gl. 3.29 für Klasse 2):</span>
              <span className="font-mono text-[11px] text-purple-700">t = Zeit in Stunden</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-purple-200 text-center font-mono text-xs overflow-x-auto">
              <BlockMath math="\frac{\Delta\sigma_{pr}}{\sigma_{pi}} = 0{,}66 \cdot \rho_{1000} \cdot e^{9{,}1 \mu} \cdot \left(\frac{t}{1000}\right)^{0{,}75 \cdot (1 - \mu)} \cdot 10^{-5}" />
            </div>
            <div className="text-[11px] text-slate-600 space-y-1">
              <p>wobei <InlineMath math="\mu = \sigma_{pi} / f_{pk}" /> das Ausnutzungsverhältnis der Vorspannung darstellt. Für den Endwert setzt EC2 3.3.2(8) <InlineMath math="t = 500\,000\text{ h} \approx 57\text{ Jahre}" /> in Gl. (3.28)–(3.30) ein; der Faktor gegenüber dem 1000-h-Wert hängt von μ ab (μ = 0,70 → ≈ 4,1; μ = 0,75 → ≈ 3,2; μ = 0,80 → ≈ 2,5). In Deutschland gelten die Relaxationswerte der abZ des Spannstahls:</p>
              <div className="font-bold text-purple-950 font-mono text-center">
                <InlineMath math="\Delta\sigma_{pr,\infty} \approx 3{,}0 \cdot \Delta\sigma_{pr,1000}" />
              </div>
            </div>
          </div>

          {/* Warnbox Temperatureinfluss */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1.5 flex gap-3 items-start">
            <Thermometer className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm">Achtung: Exponentielle Zunahme bei Wärmebehandlung (Fertigteilwerk / Brand)!</strong>
              Die Diffusionsgeschwindigkeit im Stahl verdoppelt sich etwa alle 10–15 °C. Bei Wärmebehandlung (Dampfhärtung von Fertigteilen bei 60–80 °C zur Erhärtungsbeschleunigung) 
              nimmt die Relaxation deutlich zu; EC2 10.3.2.2 berücksichtigt dies über das temperaturäquivalente Alter <InlineMath math="t_{eq}" /> in Gl. (3.28)–(3.30).
            </div>
          </div>

          {/* Tabelle 2 nach DIN EN 1992-1-1 */}
          <div className="p-5 rounded-xl bg-white border border-home-grau/30 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-shiraz" />
                Tabelle 2: Repräsentative mechanische Kennwerte für typische Spannstahllitzen (DIN EN 1992-1-1 / Zulassungen)
              </h5>
              <span className="text-[10px] font-mono bg-purple-50 text-purple-900 border border-purple-200 px-2 py-0.5 rounded">
                z. B. Y1770S7 / Y1860S7 (St 1500/1770, St 1660/1860 nach abZ)
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                    <th className="p-2.5">Eigenschaft des Spannstahls</th>
                    <th className="p-2.5">Symbol nach EC2</th>
                    <th className="p-2.5">Typischer Parameterwert</th>
                    <th className="p-2.5">Bedeutung für die Tragwerksbemessung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold">Charakteristische Zugfestigkeit</td>
                    <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="f_{pk}" /></td>
                    <td className="p-2.5 font-mono font-bold text-slate-900">1770 – 1860 N/mm²</td>
                    <td className="p-2.5 text-[11px]">Bruchfestigkeitsgrenze im Grenzzustand der Tragfähigkeit (GZT)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold">0,1 %-Dehngrenze (Ersatzstreckgrenze)</td>
                    <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="f_{p0{,}1k}" /></td>
                    <td className="p-2.5 font-mono font-bold text-slate-900">1520 – 1600 N/mm²</td>
                    <td className="p-2.5 text-[11px]">Elastizitätsgrenze; maßgebend für zulässige Vorspannkraft beim Spannen</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold">Elastizitätsmodul (Litzen / Drähte)</td>
                    <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="E_p" /></td>
                    <td className="p-2.5 font-mono font-bold text-slate-900">ca. 195.000 N/mm²</td>
                    <td className="p-2.5 text-[11px]">Geringer als Stabstahl (205.000 N/mm²) infolge des Dralls der 7 Einzeldrähte</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold">Charakt. Dehnung bei Höchstlast</td>
                    <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="\varepsilon_{uk}" /></td>
                    <td className="p-2.5 font-mono font-bold text-slate-900">≥ 3,5 % (≥ 35 ‰)</td>
                    <td className="p-2.5 text-[11px]">Mindestduktilität zur Vorankündigung und Rotationsfähigkeit im Bruchzustand</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Didaktische Box: Schätzwerte vs. Rechenwerte für Stahlrelaxation */}
          <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200/60 pb-2">
              <h5 className="font-bold text-xs text-purple-950 flex items-center gap-2 uppercase tracking-wide">
                <Scale className="h-4 w-4 text-purple-800" />
                Größenordnungen der Relaxationsbeiwerte: Schätzwerte vs. Rechenwerte nach EC2
              </h5>
              <span className="text-[11px] font-mono font-bold text-purple-900 bg-purple-100/80 px-2 py-0.5 rounded border border-purple-300">
                DIN EN 1992-1-1 Abs. 3.3.2 &amp; DIN EN 10138
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-purple-950/90 leading-relaxed">
              <div className="space-y-2">
                <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  Praxis-Schätzwerte (Vordimensionierung):
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px]">
                  <li><strong>1000-Stunden-Referenzverlust:</strong> <InlineMath math="\rho_{1000} = 2{,}5\,\%" /> für moderne Litzen der Klasse 2 (niedrige Relaxation).</li>
                  <li><strong>Alte Bauwerke / Draht:</strong> Klasse 1 mit <InlineMath math="\rho_{1000} = 8{,}0\,\%" /> (dreifacher Verlust!).</li>
                  <li><strong>Langzeit-Relaxationsverlust (500.000 h):</strong> Ca. das 2,5- bis 3,0-Fache des 1000-h-Werts (~4 % bis 7 % von <InlineMath math="\sigma_{p0}" />).</li>
                  <li><strong>Spannkraftverlust:</strong> Entspricht typischerweise 30 bis 60 MPa Spannungsabfall (~2–5 % von P₀).</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Normativer Rechenwert (Eurocode 2 Ausführungsstatik):
                </div>
                <div className="bg-white/80 p-2 rounded border border-blue-200 font-mono text-[11px] text-blue-950 overflow-x-auto text-center">
                  <InlineMath math="\frac{\Delta\sigma_{pr}}{\sigma_{pi}} = 0{,}66 \cdot \rho_{1000} \cdot e^{9{,}1 \mu} \cdot \left(\frac{t}{1000}\right)^{0{,}75 (1-\mu)} \cdot 10^{-5}" />
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-blue-950/90">
                  <li><InlineMath math="\mu = \sigma_{pi} / f_{pk}" /> (Ausnutzungsgrad, typ. 0,70 bis 0,80). Die Formel reagiert <em>exponentiell</em> auf <InlineMath math="\mu" />!</li>
                  <li><InlineMath math="t" /> = 500.000 Stunden (~57 Jahre) als normativer Dauerstandswert.</li>
                  <li><strong>Wärmebehandlung:</strong> Bei Dampfhärtung (&gt; 50 °C) muss die Relaxation um bis zu Faktor 2 bis 3 erhöht werden!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
