import { Scale, Activity, Sparkles } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import inhalt from '@/content/mechanischekenngroessen/Grundlagen.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Grundlagen() {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Box 1: Spannung */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
                <Scale className="text-shiraz" size={18} /><MdText text={inhalt.texte.t1WasIstSpannung} /></h3>
              <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                Spannung ist die auf eine infinitesimale Querschnittsfläche bezogene Schnittkraft. Sie misst die 
                <strong><MdText text={inhalt.texte.innereBeanspruchungsintensität} /></strong> eines Körpers unter äußerer Last.
              </p>

              <div className="bg-off-white p-3.5 rounded-xl border border-home-grau/25 mb-4 space-y-2">
                <div className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.normalspannungZugDruckSenkrecht} /></div>
                <BlockMath math="\sigma = \frac{F_N}{A_0} \quad \left[\frac{\text{N}}{\text{mm}^2} = \text{MPa}\right]" />
                <div className="text-xs font-bold text-text-main pt-1"><MdText text={inhalt.texte.schubspannungTangentialZurSchnittfläche} /></div>
                <BlockMath math="\tau = \frac{V}{A_0} \quad \left[\frac{\text{N}}{\text{mm}^2} = \text{MPa}\right]" />
              </div>

              <div className="space-y-2 text-xs text-text-main/80">
                <div><MdText text={inhalt.texte.technischeVsWahreSpannung} /></div>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-text-main/75">
                  <li><MdText text={inhalt.texte.technischeSpannungSigmaText} /></li>
                  <li><MdText text={inhalt.texte.wahreSpannungSigmaText} /></li>
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-slate-500 font-mono"><MdText text={inhalt.texte.einheitenKonvention1Mpa} /></div>
          </div>

          {/* Box 2: Dehnung */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
                <Activity className="text-shiraz" size={18} /><MdText text={inhalt.texte.t2WasIstDehnung} /></h3>
              <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.dieDehnungIstDie} /></p>

              <div className="bg-off-white p-3.5 rounded-xl border border-home-grau/25 mb-4 space-y-2">
                <div className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.technischeIngenieurdehnung} /></div>
                <BlockMath math="\varepsilon = \frac{\Delta L}{L_0} = \frac{L - L_0}{L_0} \quad [-] \text{ oder } [\%] \text{ bzw. } [\text{‰}]" />
                <div className="text-xs font-bold text-text-main pt-1"><MdText text={inhalt.texte.logarithmischeWahreDehnung} /></div>
                <BlockMath math="\varepsilon_{\text{true}} = \int_{L_0}^{L} \frac{dL}{L} = \ln\left(\frac{L}{L_0}\right) = \ln(1 + \varepsilon)" />
              </div>

              <div className="space-y-2 text-xs text-text-main/80">
                <div><MdText text={inhalt.texte.elastischVsPlastisch} /></div>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-text-main/75">
                  <li><MdText text={inhalt.texte.elastischeDehnungVarepsilonText} /></li>
                  <li><MdText text={inhalt.texte.plastischeDehnungVarepsilonText} /></li>
                  <li><MdText text={inhalt.texte.gesamtdehnungVarepsilonTextTot} /></li>
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-slate-500 font-mono"><MdText text={inhalt.texte.umrechnung10001} /></div>
          </div>

        </div>

        {/* Querdehnung & Poisson-Effekt */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
            <Sparkles className="text-shiraz" size={18} /><MdText text={inhalt.texte.t3QuerdehnungPoissonZahl} /></h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 text-xs text-text-main/80 space-y-3">
              <p className="leading-relaxed"><MdText text={inhalt.texte.wirdEinStabIn} /></p>
              <BlockMath math="\nu = - \frac{\varepsilon_q}{\varepsilon_{\text{ax}}} = - \frac{\Delta d / d_0}{\Delta L / L_0}" />
              <p className="leading-relaxed"><MdText text={inhalt.texte.fürHomogeneIsotropeFestkörper} /></p>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-[11px] space-y-1.5">
                <div><MdText text={inhalt.texte.spezialfälleDerPoissonzahl} /></div>
                <div><MdText text={inhalt.texte.nu050Inkompressibles} /></div>
                <div><MdText text={inhalt.texte.nuApprox000} /></div>
                <div><MdText text={inhalt.texte.nu0AuxetischeStrukturen} /></div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-off-white p-4 rounded-xl border border-home-grau/25 flex flex-col items-center justify-center">
              <svg width="240" height="150" viewBox="0 0 240 150" className="select-none">
                {/* Original ungestreckter Stab */}
                <rect x="40" y="45" width="160" height="60" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" rx="4" />
                <text x="120" y="40" textAnchor="middle" fill="#94a3b8" fontSize="10" className="font-mono">Ausgangszustand (L0, d0)</text>

                {/* Gedehnter Stab unter Zug */}
                <rect x="20" y="55" width="200" height="40" fill="rgba(163, 17, 62, 0.1)" stroke="#A3113E" strokeWidth="2" rx="4" />
                <text x="120" y="78" textAnchor="middle" fill="#A3113E" fontSize="11" fontWeight="bold">Gedehnt (L0 + ΔL, d0 - Δd)</text>

                {/* Zugkraft Pfeile */}
                <line x1="5" y1="75" x2="18" y2="75" stroke="#dc2626" strokeWidth="2.5" />
                <polygon points="18,75 10,71 10,79" fill="#dc2626" />
                <text x="5" y="68" fill="#dc2626" fontSize="10" fontWeight="bold">F</text>

                <line x1="235" y1="75" x2="222" y2="75" stroke="#dc2626" strokeWidth="2.5" />
                <polygon points="222,75 230,71 230,79" fill="#dc2626" />
                <text x="230" y="68" fill="#dc2626" fontSize="10" fontWeight="bold">F</text>

                {/* Querkontraktion Pfeile */}
                <line x1="120" y1="46" x2="120" y2="54" stroke="#b45309" strokeWidth="1.5" />
                <line x1="120" y1="104" x2="120" y2="96" stroke="#b45309" strokeWidth="1.5" />
                <text x="126" y="112" fill="#b45309" fontSize="9" className="font-mono">Einschnürung -Δd</text>
              </svg>
              <span className="text-[10px] text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.querkontraktionBeiZugbeanspruchungNu} /></span>
            </div>
          </div>
        </div>
      </div>
    );
}
