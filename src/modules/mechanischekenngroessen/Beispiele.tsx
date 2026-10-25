import { CheckCircle2 } from 'lucide-react';
import { InlineMath } from 'react-katex';

export default function Beispiele() {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">

        {/* Beispiel 1: Stahlbau Zugstab */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-home-grau/20">
            <h3 className="font-bold text-base text-text-main flex items-center gap-2">
              <CheckCircle2 className="text-emerald-600" size={18} /> Beispiel 1: Zugstab im Stahlbau &amp; Dehnsteifigkeit EA (DIN EN 1993-1-1)
            </h3>
            <span className="text-xs font-mono bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-200">
              Stahlbau S235
            </span>
          </div>

          <div className="text-xs text-text-main/80 space-y-3 leading-relaxed">
            <p>
              <strong>Aufgabenstellung:</strong> Ein Rundstahl-Zugstab aus S235 (<InlineMath math="f_y = 235\text{ MPa}, E = 210.000\text{ MPa}, \nu = 0{,}30" />) 
              mit Durchmesser <InlineMath math="d_0 = 30\text{ mm}" /> und einer Stablänge von <InlineMath math="L_0 = 4{,}00\text{ m}" /> 
              wird durch eine Zugkraft <InlineMath math="F = 120\text{ kN}" /> beansprucht.
              Gesucht sind die Dehnsteifigkeit <InlineMath math="EA" />, die Normalspannung <InlineMath math="\sigma" />, die Längsdehnung <InlineMath math="\varepsilon" />, die Verlängerung <InlineMath math="\Delta L" /> 
              und die Querschnittseinschnürung <InlineMath math="\Delta d" />.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                <div className="font-bold text-text-main font-sans">1. Querschnitt, Dehnsteifigkeit &amp; Spannung:</div>
                <div>A0 = π · (30 mm)² / 4 = <strong>706,86 mm²</strong></div>
                <div>EA = 210.000 N/mm² · 706,86 mm² = <strong>148,44 MN (148.440 kN)</strong></div>
                <div>σ = F / A0 = 120.000 N / 706,86 mm² = <strong>169,76 N/mm² (MPa)</strong></div>
                <div className="text-emerald-700">Nachweis: σ = 169,8 MPa ≤ fy = 235 MPa (Auslastung: 72,2 %) ✓</div>
              </div>

              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                <div className="font-bold text-text-main font-sans">2. Dehnung &amp; Verformungen:</div>
                <div>ε = σ / E = 169,76 / 210.000 = <strong>0,000808 (0,808 ‰)</strong></div>
                <div>ΔL = (F · L0) / EA = (120 kN · 4000 mm) / 148.440 kN = <strong>+3,23 mm</strong></div>
                <div>ε_q = -ν · ε = -0,30 · 0,000808 = -0,000242</div>
                <div>Δd = ε_q · d0 = -0,000242 · 30 mm = <strong>-0,0073 mm (-7,3 µm)</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Beispiel 2: Biegesteifigkeit eines Einfeldträgers */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-home-grau/20">
            <h3 className="font-bold text-base text-text-main flex items-center gap-2">
              <CheckCircle2 className="text-indigo-600" size={18} /> Beispiel 2: Biegesteifigkeit EI &amp; Trägerdurchbiegung (Holzbalken C24)
            </h3>
            <span className="text-xs font-mono bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded border border-indigo-200">
              Holzbau C24 (DIN EN 1995-1-1)
            </span>
          </div>

          <div className="text-xs text-text-main/80 space-y-3 leading-relaxed">
            <p>
              <strong>Aufgabenstellung:</strong> Ein Deckenbalken aus Nadelholz C24 (<InlineMath math="E_{0,\text{mean}} = 11.000\text{ MPa}" />) 
              mit Querschnitt <InlineMath math="b/h = 12 / 24\text{ cm}" /> überbrückt eine Spannweite von <InlineMath math="L = 5{,}00\text{ m}" />. 
              In Feldmitte wirkt eine Nutzlast (Einzellast) von <InlineMath math="F = 15\text{ kN}" />.
              Gesucht sind das Flächenträgheitsmoment <InlineMath math="I_y" />, die Biegesteifigkeit <InlineMath math="EI_y" /> und die maximale Durchbiegung <InlineMath math="w_{\max}" />.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                <div className="font-bold text-text-main font-sans">1. Flächenträgheitsmoment &amp; Biegesteifigkeit:</div>
                <div>Iy = (120 mm · (240 mm)³) / 12 = <strong>138.240.000 mm⁴ (13.824 cm⁴)</strong></div>
                <div>EIy = 11.000 N/mm² · 138.240.000 mm⁴ = 1,521 · 10¹² N·mm²</div>
                <div>EIy = <strong>1.520,6 kNm²</strong></div>
              </div>

              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                <div className="font-bold text-text-main font-sans">2. Durchbiegung (Einzellast Feldmitte):</div>
                <div>w_max = (F · L³) / (48 · EIy)</div>
                <div>w_max = (15.000 N · (5000 mm)³) / (48 · 1,521 · 10¹² N·mm²)</div>
                <div>w_max = 1,875 · 10¹⁵ / 7,299 · 10¹³ = <strong>25,69 mm</strong></div>
                <div className="text-indigo-800">Vergleich mit dem Empfehlungswert w_inst ≤ L/300 = 16,7 mm (DIN EN 1995-1-1/NA): nicht eingehalten – Querschnitt vergrößern; Kriechen (k_def) erhöht die Enddurchbiegung zusätzlich.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Beispiel 3: Massivbau Betonstütze mit Kriecheffekt */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-home-grau/20">
            <h3 className="font-bold text-base text-text-main flex items-center gap-2">
              <CheckCircle2 className="text-blue-600" size={18} /> Beispiel 3: Stauchung einer Betonstütze (Kriechzahl φ = 2,0 nach EC2)
            </h3>
            <span className="text-xs font-mono bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded border border-blue-200">
              Massivbau C30/37
            </span>
          </div>

          <div className="text-xs text-text-main/80 space-y-3 leading-relaxed">
            <p>
              <strong>Aufgabenstellung:</strong> Eine quadratische Stahlbetonstütze (<InlineMath math="b = h = 40\text{ cm}" />, <InlineMath math="L_0 = 3{,}50\text{ m}" />) 
              aus Beton C30/37 (<InlineMath math="E_{cm} = 33.000\text{ MPa}" />, Bewehrung vereinfachend vernachlässigt) wird durch eine ständige Normalkraft <InlineMath math="N = 1200\text{ kN}" /> 
              auf Druck beansprucht. Die Kriechzahl nach DIN EN 1992-1-1 beträgt <InlineMath math="\varphi = 2{,}0" />.
              Gesucht sind die sofortige elastische Stauchung <InlineMath math="\Delta L_0" /> und die Endstauchung <InlineMath math="\Delta L_{\infty}" /> nach Abschluss des Kriechens.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                <div className="font-bold text-text-main font-sans">1. Spannung &amp; Sofortverformung:</div>
                <div>A = 400 mm · 400 mm = <strong>160.000 mm²</strong></div>
                <div>σ = -1.200.000 N / 160.000 mm² = <strong>-7,50 N/mm²</strong></div>
                <div>ε_0 = -7,50 / 33.000 = <strong>-0,227 ‰</strong></div>
                <div>ΔL_0 = ε_0 · 3500 mm = <strong>-0,80 mm</strong></div>
              </div>

              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                <div className="font-bold text-text-main font-sans">2. Langzeitverformung mit Kriechzahl φ = 2,0:</div>
                <div>E_c,eff = E_cm / (1 + φ) = 33.000 / (1 + 2,0) = <strong>11.000 MPa</strong></div>
                <div>ε_end = -7,50 / 11.000 = -0,682 ‰ = ε_0 · (1 + φ)</div>
                <div>ΔL_end = ε_end · 3500 mm = <strong>-2,39 mm</strong></div>
                <div className="text-blue-700">Kriechanteil allein: ΔL_kriechen = -1,59 mm</div>
              </div>
            </div>
          </div>
        </div>

        {/* Beispiel 4: Spannbeton Relaxation */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-home-grau/20">
            <h3 className="font-bold text-base text-text-main flex items-center gap-2">
              <CheckCircle2 className="text-purple-600" size={18} /> Beispiel 4: Spannkraftverlust durch Stahlrelaxation (DIN EN 1992-1-1 Abs. 3.3.2)
            </h3>
            <span className="text-xs font-mono bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded border border-purple-200">
              Spannbeton Y1860
            </span>
          </div>

          <div className="text-xs text-text-main/80 space-y-3 leading-relaxed">
            <p>
              <strong>Aufgabenstellung:</strong> Ein Spannstahl Y1860 (<InlineMath math="f_{pk} = 1860\text{ MPa}, f_{p0{,}1k} = 1600\text{ MPa}" />) 
              wird mit <InlineMath math="\sigma_{p0} = 0{,}75 \cdot f_{pk} = 1395\text{ MPa}" /> vorgespannt. Die Dehnung wird konstant gehalten (<InlineMath math="\varepsilon_p = \text{konst.}" />).
              Für Spannstahllitzen der Klasse 2 (niedrige Relaxation nach DIN EN 1992-1-1, 3.3.2) beträgt der 1000-Stunden-Relaxationsverlust <InlineMath math="\rho_{1000} = 2{,}5\,\%" />.
              Gesucht ist der 1000-Stunden-Spannungsverlust <InlineMath math="\Delta\sigma_{pr}" />.
            </p>

            <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
              <div>Ausnutzungsgrad: μ = σ_p0 / f_pk = 1395 / 1860 = <strong>0,75</strong></div>
              <div>Relaxationsverlust nach Eurocode 2:</div>
              <div>Δσ_pr / σ_p0 = 0,66 · ρ_1000 · e^(9,1 · μ) · (t / 1000)^(0,75·(1-μ)) · 10⁻⁵</div>
              <div>Δσ_pr / σ_p0 = 0,66 · 2,5 · e^(9,1 · 0,75) · 1,0 · 10⁻⁵ = 1,65 · 920,58 · 10⁻⁵ = <strong>0,0152 (1,52 %)</strong></div>
              <div>Spannungsverlust nach 1000 h: Δσ_pr = 0,0152 · 1395 MPa = <strong>21,2 MPa</strong></div>
              <div>Verbleibende Vorspannung: σ_p(1000h) = 1395 - 21,2 = <strong>1373,8 MPa</strong></div>
            </div>
          </div>
        </div>

      </div>
    );
}
