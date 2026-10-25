import { Droplets, Activity, Info, Scale } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

export default function KennwerteSchwinden() {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
          <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <Droplets className="text-shiraz h-5 w-5" />
              2. Schwinden des Betons (<InlineMath math="\varepsilon_{cs}" /> / Autogen &amp; Trocknung)
            </h4>
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-md">
              Verlustanteil: ca. 4–8 % von P₀
            </span>
          </div>

          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
            <p>
              <strong>Was ist Schwinden?</strong> Schwinden ist die <strong>vollkommen lastunabhängige Volumenverringerung</strong> des 
              Betons infolge von inneren chemischen Reaktionen und Feuchtigkeitsabgabe an die ungesättigte Umwelt. Im Gegensatz 
              zum Kriechen tritt Schwinden auch an völlig unbelasteten Bauteilen auf! Nach Eurocode 2 setzt sich das Gesamtschwindmaß 
              <InlineMath math="\varepsilon_{cs}" /> aus zwei physikalisch völlig unterschiedlichen Komponenten zusammen:
            </p>
            <div className="text-center my-3">
              <BlockMath math="\varepsilon_{cs}(t, t_s) = \varepsilon_{ca}(t) + \varepsilon_{cd}(t, t_s)" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Autogenes Schwinden */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber-600" />
                  A. Autogenes Schwinden (<InlineMath math="\varepsilon_{ca}" />)
                </h5>
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Chemisch</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Mechanismus:</strong> Bei der Hydratation von Zement nehmen die entstehenden Hydratationsprodukte (C-S-H, Portlandit) 
                ein geringeres Volumen ein als die Ausgangsstoffe Zement und Wasser (<span className="italic">Le-Chatelier-Kontraktion</span>). 
                Da im Kern kein Wasser von außen nachströmen kann, trocknet sich der Beton selbst aus („chemische Selbstaustrocknung“).
              </p>
              <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
                <div>Endwert nach EC2:</div>
                <div className="text-shiraz font-bold">
                  <InlineMath math="\varepsilon_{ca}(\infty) = 2{,}5 \cdot (f_{ck} - 10) \cdot 10^{-6}" />
                </div>
                <div className="text-[10px] text-slate-500 pt-1">
                  C50/60: <InlineMath math="\varepsilon_{ca} \approx -0{,}10\text{ mm/m}" /> | C90/105: <InlineMath math="\varepsilon_{ca} \approx -0{,}20\text{ mm/m}" />
                </div>
              </div>
              <p className="text-xs text-slate-600">
                <strong>Besonderheit bei Spannbeton:</strong> Spannbeton wird meist mit C35/45–C50/60 (w/z ≈ 0,40–0,50) hergestellt; bei hochfesten Betonen mit niedrigem w/z ist das autogene Schwinden ausgeprägt und läuft bereits in den ersten Tagen ab.
              </p>
            </div>

            {/* Trocknungsschwinden */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-600" />
                  B. Trocknungsschwinden (<InlineMath math="\varepsilon_{cd}" />)
                </h5>
                <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Physikalisch</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Mechanismus:</strong> Diffusionsgesteuerte Feuchtigkeitsabgabe aus dem Porennetz an die ungesättigte Umgebungsluft. 
                In den engen Kapillarporen (<InlineMath math="2 - 50\text{ nm}" />) bilden sich gekrümmte Menisken. Nach der 
                <strong> Laplace-Gleichung</strong> entsteht im Porenwasser ein extremer kapillarer Unterdruck:
              </p>
              <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
                <div>Kapillardruck-Gleichung:</div>
                <div className="text-blue-700 font-bold">
                  <InlineMath math="\Delta p = \frac{2 \cdot \gamma \cdot \cos\theta}{r_{kap}}" />
                </div>
                <div className="text-[10px] text-slate-500 pt-1">
                  Dieser Unterdruck zieht das elastische C-S-H-Gefüge zusammen wie einen trocknenden Schwamm.
                </div>
              </div>
              <p className="text-xs text-slate-600">
                <strong>Einfluss der Bauteilabmessung:</strong> Das Trocknungsschwinden hängt massiv von der 
                wirksamen Bauteildicke <InlineMath math="h_0 = 2 A_c / u" /> ab. Dicke Brückenkästen trocknen über 
                Jahrzehnte hinweg aus, während dünne Stege bereits nach wenigen Monaten geschwunden sind.
              </p>
            </div>
          </div>

          {/* Zahlenbeispiel Spannkraftverlust aus Schwinden */}
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="font-bold flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-amber-600" />
              Auswirkung auf den Spannstahl im Tragwerk (Zahlenbeispiel):
            </div>
            <p>
              Beträgt das Gesamtschwindmaß <InlineMath math="\varepsilon_{cs} = -0{,}35\text{ mm/m} = -0{,}00035" /> und der 
              Spannstahl-E-Modul <InlineMath math="E_p = 195.000\text{ N/mm}^2" />, so verkürzt sich das Bauteil lastfrei. 
              Da das Spannglied starr im Bauteil verankert ist, wird der Stahl um genau dieses Maß zusammengestaucht:
            </p>
            <div className="font-mono bg-white p-2.5 rounded border border-amber-200 font-bold text-center">
              <InlineMath math="\Delta\sigma_{p,s} = \varepsilon_{cs} \cdot E_p = 0{,}00035 \cdot 195.000\text{ N/mm}^2 = 68{,}25\text{ N/mm}^2" />
            </div>
            <p>
              Bei einer typischen Anfangsspannung von <InlineMath math="\sigma_{p0} = 1400\text{ N/mm}^2" /> entspricht allein der 
              Schwindverlust einem dauerhaften Spannungsverlust von rund <strong>5 %</strong>.
            </p>
          </div>

          {/* Didaktische Box: Schätzwerte vs. Rechenwerte für Schwindbeiwerte */}
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/60 pb-2">
              <h5 className="font-bold text-xs text-blue-950 flex items-center gap-2 uppercase tracking-wide">
                <Scale className="h-4 w-4 text-blue-800" />
                Größenordnungen der Schwindbeiwerte: Schätzwerte vs. Rechenwerte nach EC2
              </h5>
              <span className="text-[11px] font-mono font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded border border-blue-300">
                DIN EN 1992-1-1 Abs. 3.1.4 &amp; Anhang B.2
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-950/90 leading-relaxed">
              <div className="space-y-2">
                <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  Praxis-Schätzwerte (Vordimensionierung):
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px]">
                  <li><strong>Gesamtschwindmaß:</strong> <InlineMath math="\varepsilon_{cs} \approx -0{,}35 \text{ bis } -0{,}40\,\text{mm/m}" /> (bzw. ‰).</li>
                  <li><strong>Feuchter Außenbereich (RH 80 %):</strong> <InlineMath math="\varepsilon_{cs} \approx -0{,}25 \text{ bis } -0{,}32\,\text{mm/m}" /> (‰).</li>
                  <li><strong>Trockener Innenbereich (RH 50 %):</strong> <InlineMath math="\varepsilon_{cs} \approx -0{,}45 \text{ bis } -0{,}55\,\text{mm/m}" /> (‰).</li>
                  <li><strong>Faustregel für Schwindverluste:</strong> Ca. 4 % bis 8 % der Anfangsspannkraft P₀ (entspricht ~60–100 MPa Spannungsabfall im Spannstahl).</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Normativer Rechenwert (Eurocode 2 Ausführungsstatik):
                </div>
                <div className="bg-white/80 p-2 rounded border border-blue-200 font-mono text-[11px] text-blue-950 overflow-x-auto text-center">
                  <InlineMath math="\varepsilon_{cs}(\infty) = \varepsilon_{cd}(\infty) + \varepsilon_{ca}(\infty) = k_h \cdot \varepsilon_{cd,0} + 2{,}5(f_{ck}-10) \cdot 10^{-6}" />
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-blue-950/90">
                  <li><InlineMath math="k_h" /> (Geometriefaktor): 1,00 bei <InlineMath math="h_0 \le 100\,\text{mm}" /> bis 0,70 bei massigen Querschnitten (<InlineMath math="h_0 \ge 500\,\text{mm}" />).</li>
                  <li><InlineMath math="\varepsilon_{cd,0}" /> (Grundwert Trocknung): für C30/37 und RH = 50 %: Zement N ≈ 0,48 ‰, R ≈ 0,67 ‰, S ≈ 0,39 ‰ (Gl. B.11/B.12).</li>
                  <li><InlineMath math="\varepsilon_{ca}" /> (Autogenes Schwinden): C30/37 ~ -0,05 ‰; C60/75 ~ -0,125 ‰ (setzt sofort ein!).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
