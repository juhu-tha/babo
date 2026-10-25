import { Clock, Layers, Scale, Activity } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

export default function KennwerteKriechen() {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
          <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <Clock className="text-shiraz h-5 w-5" />
              1. Kriechen des Betons (<InlineMath math="\varphi(t, t_0)" /> / Kriechzahl)
            </h4>
            <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md">
              Verlustanteil: ca. 8–15 % von P₀
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm text-text-main/80 leading-relaxed">
              <p>
                <strong>Was ist Kriechen?</strong> Unter einer anhaltenden mechanischen Dauer-Druckspannung 
                staucht sich erhärteter Beton zeitabhängig weiter zusammen. Während die elastische Dehnung 
                <InlineMath math="\varepsilon_{c,el}" /> im Moment der Lasteinleitung schlagartig auftritt, wächst die 
                <strong>Kriechdehnung <InlineMath math="\varepsilon_{cc}(t)" /></strong> über Monate und Jahre kontinuierlich an, 
                bis sie asymptotisch einem Endwert zustrebt.
              </p>
              <p>
                Das Verhältnis der Kriechdehnung zur anfänglichen elastischen Dehnung wird als 
                <strong> Kriechzahl <InlineMath math="\varphi(t, t_0)" /></strong> bezeichnet:
              </p>
              <div className="bg-off-white p-3 rounded-xl border border-home-grau/30 text-center">
                <BlockMath math="\varphi(t, t_0) = \frac{\varepsilon_{cc}(t, t_0)}{\varepsilon_{c,el}(t_0)} \quad \Longrightarrow \quad \varepsilon_c(t) = \varepsilon_{c,el} \cdot \left[1 + \varphi(t, t_0)\right]" />
              </div>
              <p>
                <strong>Typische Kriechzahlen nach DIN EN 1992-1-1:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-text-main/80">
                <li><strong>Trockener Innenraum (RH 50 %):</strong> <InlineMath math="\varphi_\infty \approx 2{,}2 - 3{,}5" /></li>
                <li><strong>Feuchtes Außenklima (RH 80 %):</strong> <InlineMath math="\varphi_\infty \approx 1{,}4 - 2{,}0" /></li>
                <li><strong>Frühes Vorspannen (t₀ = 3 d):</strong> Kriechzahl um 30–50 % höher als bei t₀ = 28 d!</li>
              </ul>
            </div>

            {/* Mikrostruktur & Grafik */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-4">
              <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-shiraz" />
                Mikrostruktureller Mechanismus im C-S-H-Gel
              </h5>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Zementstein besteht mikroskopisch aus kolloidalen <strong>Calciumsilicathydrat-Phasen (C-S-H)</strong>. In den Nanoporen 
                befindet sich adsorbiertes Wasser („Schichtenwasser“). Unter ständiger Druckspannung laufen folgende Vorgänge ab:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-home-grau/20">
                  <strong className="text-text-main block mb-0.5">1. Umlagerung von Schichtenwasser (Seepage Theory):</strong>
                  Das adsorbierte Wasser wird aus den hoch komprimierten Bereichen zwischen den C-S-H-Lamellen langsam in lastfreie Gel- und Kapillarporen herausgepresst.
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-home-grau/20">
                  <strong className="text-text-main block mb-0.5">2. Viskoses Gleiten der C-S-H-Nanoblättchen:</strong>
                  Unter Scher- und Druckspannungen brechen elektrostatische Brückenbindungen auf; Kristallitpakete gleiten irreversibel aneinander ab.
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-home-grau/20">
                  <strong className="text-text-main block mb-0.5">3. Nichtlineares Kriechen bei Überlastung:</strong>
                  Liegt die Betondruckspannung über <InlineMath math="0{,}45 \cdot f_{ck}(t_0)" />, entstehen Mikrorisse im Gefüge. Es tritt unkontrolliertes, beschleunigtes Kriechen auf (Gefahr des Kriechbruchs!).
                </div>
              </div>
            </div>
          </div>

          {/* SVG Visualisierung Dehnungsverlauf */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>Verformungs- und Dehnungsverlauf bei Be- und Entlastung:</span>
              <span className="font-mono text-[11px] text-slate-500">schematisch</span>
            </div>
            <div className="w-full overflow-x-auto">
              <svg viewBox="0 0 700 180" className="w-full h-44 min-w-[500px]">
                <defs>
                  <marker id="arrow-axis" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                  </marker>
                </defs>
                {/* Achsen */}
                <line x1="60" y1="150" x2="660" y2="150" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-axis)" />
                <line x1="60" y1="150" x2="60" y2="20" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-axis)" />
                <text x="665" y="155" fontSize="11" fill="#64748b">Zeit t</text>
                <text x="50" y="15" fontSize="11" fill="#64748b">Dehnung ε_c</text>

                {/* Belastungszeitpunkt t0 */}
                <line x1="120" y1="150" x2="120" y2="30" stroke="#94a3b8" strokeDasharray="3 3" />
                <text x="110" y="166" fontSize="10" fill="#475569">t₀ (Spannen)</text>

                {/* Entlastungszeitpunkt t1 */}
                <line x1="420" y1="150" x2="420" y2="30" stroke="#94a3b8" strokeDasharray="3 3" />
                <text x="410" y="166" fontSize="10" fill="#475569">t₁ (Entlastung)</text>

                {/* Elastischer Sprung bei t0 */}
                <line x1="120" y1="150" x2="120" y2="110" stroke="#3b82f6" strokeWidth="2.5" />
                <text x="125" y="130" fontSize="10" fill="#2563eb" fontWeight="bold">ε_el (sofort)</text>

                {/* Kriechkurve bis t1 */}
                <path d="M 120 110 Q 220 55 420 45" fill="none" stroke="#8b1a4f" strokeWidth="3" />
                <text x="240" y="60" fontSize="11" fill="#8b1a4f" fontWeight="bold">Kriechdehnung ε_cc(t) = φ · ε_el</text>

                {/* Elastische Rückfederung bei t1 */}
                <line x1="420" y1="45" x2="420" y2="85" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
                <text x="428" y="70" fontSize="10" fill="#2563eb">Elastische Rückfederung</text>

                {/* Kriecherholung und bleibende Verformung */}
                <path d="M 420 85 Q 500 100 640 105" fill="none" stroke="#ea580c" strokeWidth="2" strokeDasharray="3 2" />
                <text x="510" y="95" fontSize="10" fill="#c2410c">Kriecherholung</text>
                <text x="520" y="125" fontSize="10" fill="#475569" fontWeight="bold">Bleibende plastische Dehnung</text>

                {/* Horizontale Markierungen */}
                <line x1="60" y1="105" x2="640" y2="105" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
              </svg>
            </div>
          </div>

          {/* Didaktische Box: Schätzwerte vs. Rechenwerte für Kriechbeiwerte */}
          <div className="bg-amber-50/70 p-5 rounded-xl border border-amber-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
              <h5 className="font-bold text-xs text-amber-950 flex items-center gap-2 uppercase tracking-wide">
                <Scale className="h-4 w-4 text-amber-800" />
                Größenordnungen der Kriechbeiwerte: Schätzwerte vs. Rechenwerte nach EC2
              </h5>
              <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded border border-amber-300">
                DIN EN 1992-1-1 Abs. 3.1.4 &amp; Anhang B
              </span>
            </div>

            {/* Erläuterung der Dehnungsumrechnung in Promille */}
            <div className="bg-white/90 p-3.5 rounded-lg border border-amber-200 text-xs text-amber-950 space-y-1.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                  <Activity className="h-3.5 w-3.5 text-amber-700" />
                  Zusammenhang: Dimensionslose Kriechzahl <InlineMath math="\varphi" /> &amp; Kriechdehnung <InlineMath math="\varepsilon_{cc}" /> in Promille (‰ bzw. mm/m)
                </span>
                <span className="text-[10px] font-mono font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  1 ‰ = 1 mm/m = 10⁻³ = 1000 µm/m
                </span>
              </div>
              <p className="text-[11px] text-amber-900/90 leading-relaxed">
                Die Kriechzahl <InlineMath math="\varphi(\infty, t_0)" /> ist dimensionslos und skaliert die elastische Anfangsdehnung <InlineMath math="\varepsilon_{\text{el}} = \sigma_c / E_{cm}" />.
                Unter typischer Dauerlastspannung im Spannbeton (<InlineMath math="\sigma_c \approx 10 \dots 15\,\text{MPa}" />, <InlineMath math="E_{cm} \approx 33\,000 \dots 38\,000\,\text{MPa}" />) beträgt die elastische Stauchung rund <InlineMath math="\varepsilon_{\text{el}} \approx 0{,}28 \dots 0{,}43\,\text{‰}" />.
                Daraus errechnet sich die zeitabhängige Kriechdehnung in Promille:
              </p>
              <div className="text-center font-mono text-[11px] py-1 bg-amber-50/60 rounded border border-amber-200/60">
                <InlineMath math="\varepsilon_{cc}(\infty, t_0) = \varepsilon_{\text{el}} \cdot \varphi(\infty, t_0) = \frac{\sigma_c(t_0)}{E_{cm}} \cdot \varphi(\infty, t_0) \quad [\text{in ‰ bzw. mm/m}]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-amber-950/90 leading-relaxed">
              {/* Linke Spalte: Praxis-Schätzwerte */}
              <div className="space-y-2.5">
                <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  Praxis-Schätzwerte (Vordimensionierung):
                </div>
                <ul className="space-y-2 text-[11px]">
                  <li className="bg-white/60 p-2.5 rounded-lg border border-amber-200/70 space-y-0.5">
                    <div className="font-bold text-amber-950 flex items-center justify-between">
                      <span>Standard-Endkriechzahl (C30/37 bis C40/50):</span>
                      <span className="font-mono text-amber-800"><InlineMath math="\varphi_\infty \approx 2{,}0 \dots 2{,}5" /></span>
                    </div>
                    <div className="text-slate-700">
                      • Kriechdehnung: <strong className="text-amber-900 font-mono"><InlineMath math="\varepsilon_{cc} \approx 0{,}60 \dots 1{,}05\,\text{‰}" /></strong> (0,60 bis 1,05 mm/m)
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Gesamtstauchung (<InlineMath math="\varepsilon_{\text{el}} + \varepsilon_{cc}" />): <InlineMath math="\varepsilon_{c,\text{tot}} \approx 0{,}90 \dots 1{,}45\,\text{‰}" />
                    </div>
                  </li>

                  <li className="bg-white/60 p-2.5 rounded-lg border border-amber-200/70 space-y-0.5">
                    <div className="font-bold text-amber-950 flex items-center justify-between">
                      <span>Massive Brücken (<InlineMath math="h_0 \ge 500\,\text{mm}" />, Außenluft RH 80 %):</span>
                      <span className="font-mono text-amber-800"><InlineMath math="\varphi_\infty \approx 1{,}5 \dots 2{,}0" /></span>
                    </div>
                    <div className="text-slate-700">
                      • Kriechdehnung: <strong className="text-amber-900 font-mono"><InlineMath math="\varepsilon_{cc} \approx 0{,}40 \dots 0{,}80\,\text{‰}" /></strong> (0,40 bis 0,80 mm/m)
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Durch hohe wirksame Dicke und hohe Feuchte kriecht der Querschnitt deutlich langsamer und geringer.
                    </div>
                  </li>

                  <li className="bg-white/60 p-2.5 rounded-lg border border-amber-200/70 space-y-0.5">
                    <div className="font-bold text-amber-950 flex items-center justify-between">
                      <span>Schlanke Hochbaudecken (<InlineMath math="h_0 \le 150\,\text{mm}" />, Innenluft RH 50 %):</span>
                      <span className="font-mono text-amber-800"><InlineMath math="\varphi_\infty \approx 2{,}8 \dots 3{,}5" /></span>
                    </div>
                    <div className="text-slate-700">
                      • Kriechdehnung: <strong className="text-amber-900 font-mono"><InlineMath math="\varepsilon_{cc} \approx 0{,}80 \dots 1{,}45\,\text{‰}" /></strong> (0,80 bis 1,45 mm/m)
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Trockene Innenraumluft und dünne Querschnitte begünstigen starkes Austrocknungskriechen.
                    </div>
                  </li>

                  <li className="p-2 bg-amber-100/60 rounded border border-amber-300/60 text-[10.5px] text-amber-900">
                    <strong>Faustregel für Kriechverluste:</strong> Ca. <strong>8 % bis 15 %</strong> der Anfangsspannkraft <InlineMath math="P_0" /> gehen allein durch das Kriechen verloren (entspricht rund 120 bis 220 MPa Spannkraftverlust im Spannstahl).
                  </li>
                </ul>
              </div>

              {/* Rechte Spalte: Normativer Rechenwert */}
              <div className="space-y-2.5">
                <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Normativer Rechenwert (Eurocode 2 Ausführungsstatik):
                </div>
                <div className="bg-white/90 p-2.5 rounded border border-blue-200 font-mono text-[11px] text-blue-950 overflow-x-auto text-center space-y-1">
                  <div>
                    <InlineMath math="\varphi(\infty, t_0) = \varphi_{RH} \cdot \beta(f_{cm}) \cdot \beta(t_0)" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans">
                    Berechnung nach EC2 Gl. (B.1) / Anhang B
                  </div>
                </div>
                <ul className="list-disc pl-5 space-y-1.5 text-[11px] text-blue-950/90">
                  <li>
                    <InlineMath math="\varphi_{RH} = 1 + \frac{1 - RH/100}{0{,}1 \cdot \sqrt[3]{h_0}}" /> (Feuchtebeiwert: 1,1 Außenluft bis 2,2 Innenraum).
                  </li>
                  <li>
                    <InlineMath math="\beta(f_{cm}) = \frac{16{,}8}{\sqrt{f_{cm}}}" /> (Festigkeitsbeiwert: C25/30 ca. 3,0; C45/55 ca. 2,3; C60/75 ca. 2,0).
                  </li>
                  <li>
                    <InlineMath math="\beta(t_0) = \frac{1}{0{,}1 + t_0^{0{,}2}}" /> (Spannalter: <InlineMath math="t_0 = 3\,\text{d}" /> → 0,74; <InlineMath math="t_0 = 7\,\text{d}" /> → 0,63; <InlineMath math="t_0 = 28\,\text{d}" /> → 0,49; <InlineMath math="t_0" /> vorher nach Gl. (B.9) an die Zementart anpassen).
                  </li>
                  <li>
                    <strong>Kriechmaß (spezifische Dehnung):</strong> <InlineMath math="C(\infty, t_0) = \frac{\varphi(\infty, t_0)}{E_{cm}} \approx 0{,}05 \dots 0{,}10\,\frac{\text{‰}}{\text{MPa}}" /> (bzw. <InlineMath math="50 \dots 100 \cdot 10^{-6}\text{ MPa}^{-1}" />).
                  </li>
                  <li>
                    <strong>Gültigkeitsgrenze:</strong> Nur linear bis <InlineMath math="\sigma_c \le 0{,}45 \cdot f_{ck}(t_0)" />; bei <InlineMath math="\sigma_c > 0{,}45 \cdot f_{ck}(t_0)" /> muss nichtlineares Kriechen angesetzt werden (<InlineMath math="\varphi_k = \varphi \cdot e^{1{,}5(k_\sigma - 0{,}45)}" />).
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Baustellen- & Praxisrelevanz */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
              <span className="font-bold text-amber-900 block mb-1">Auswirkung im Spannbeton:</span>
              Der Träger verkürzt sich über Jahre. Der Abstand zwischen den Verankerungen schrumpft. Die Vorspannstähle entspannen sich elastisch <InlineMath math="\rightarrow" /> <strong>massiver Spannkraftverlust</strong>!
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs">
              <span className="font-bold text-blue-900 block mb-1">Verformungsverdopplung:</span>
              Kriechen vergrößert Biegungen und Überhöhungen: <InlineMath math="\kappa_\infty = \kappa_0 \cdot (1 + \varphi)" />. Brückenfahrbahnen senken sich im Laufe von Jahrzehnten um Zentimeter ab.
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-900 block mb-1">Praxis-Vermeidung:</span>
              Spätes Vorspannen abwarten (<InlineMath math="t_0 \ge 7 - 14\text{ d}" />), Betondruck beim Spannen auf <InlineMath math="\sigma_c \le 0{,}60\, f_{ck}(t_0)" /> begrenzen (Längsrisse); nichtlineares Kriechen beginnt bereits ab <InlineMath math="0{,}45\, f_{ck}(t_0)" /> (EC2 5.10.2.2(5)).
            </div>
          </div>
        </div>
      </div>
    );
}
