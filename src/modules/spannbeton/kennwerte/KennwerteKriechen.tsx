import { Clock, Layers, Scale, Activity } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import inhalt from '@/content/spannbeton/kennwerte/KennwerteKriechen.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function KennwerteKriechen() {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
          <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <Clock className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.t1KriechenDesBetons} /></h4>
            <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.verlustanteilCa815} /></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm text-text-main/80 leading-relaxed">
              <p><MdText text={inhalt.texte.wasIstKriechenUnter} /></p>
              <p>
                Das Verhältnis der Kriechdehnung zur anfänglichen elastischen Dehnung wird als 
                <strong> Kriechzahl <InlineMath math="\varphi(t, t_0)" /></strong> bezeichnet:
              </p>
              <div className="bg-off-white p-3 rounded-xl border border-home-grau/30 text-center">
                <BlockMath math="\varphi(t, t_0) = \frac{\varepsilon_{cc}(t, t_0)}{\varepsilon_{c,el}(t_0)} \quad \Longrightarrow \quad \varepsilon_c(t) = \varepsilon_{c,el} \cdot \left[1 + \varphi(t, t_0)\right]" />
              </div>
              <p><MdText text={inhalt.texte.typischeKriechzahlenNachDin} /></p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-text-main/80">
                <li><MdText text={inhalt.texte.trockenerInnenraumRh50} /></li>
                <li><MdText text={inhalt.texte.feuchtesAußenklimaRh80} /></li>
                <li><MdText text={inhalt.texte.frühesVorspannenT3} /></li>
              </ul>
            </div>

            {/* Mikrostruktur & Grafik */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-4">
              <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-shiraz" /><MdText text={inhalt.texte.mikrostrukturellerMechanismusImC} /></h5>
              <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.zementsteinBestehtMikroskopischAus} /></p>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-home-grau/20">
                  <strong className="text-text-main block mb-0.5"><MdText text={inhalt.texte.t1UmlagerungVonSchichtenwasser} /></strong><MdText text={inhalt.texte.dasAdsorbierteWasserWird} /></div>
                <div className="p-2.5 rounded-lg bg-white border border-home-grau/20">
                  <strong className="text-text-main block mb-0.5"><MdText text={inhalt.texte.t2ViskosesGleitenDer} /></strong><MdText text={inhalt.texte.unterScherUndDruckspannungen} /></div>
                <div className="p-2.5 rounded-lg bg-white border border-home-grau/20">
                  <strong className="text-text-main block mb-0.5"><MdText text={inhalt.texte.t3NichtlinearesKriechenBei} /></strong><MdText text={inhalt.texte.liegtDieBetondruckspannungÜber} /></div>
              </div>
            </div>
          </div>

          {/* SVG Visualisierung Dehnungsverlauf */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span><MdText text={inhalt.texte.verformungsUndDehnungsverlaufBei} /></span>
              <span className="font-mono text-[11px] text-slate-500">schematisch</span>
            </div>
            <div className="w-full overflow-x-auto">
              <svg role="img" aria-label="Mikrostruktureller Mechanismus des Kriechens im C-S-H-Gel" viewBox="0 0 700 180" className="w-full h-44 min-w-[500px]">
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
                <Scale className="h-4 w-4 text-amber-800" /><MdText text={inhalt.texte.größenordnungenDerKriechbeiwerteSchätzwe} /></h5>
              <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded border border-amber-300"><MdText text={inhalt.texte.dinEn19921} /></span>
            </div>

            {/* Erläuterung der Dehnungsumrechnung in Promille */}
            <div className="bg-white/90 p-3.5 rounded-lg border border-amber-200 text-xs text-amber-950 space-y-1.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                  <Activity className="h-3.5 w-3.5 text-amber-700" /><MdText text={inhalt.texte.zusammenhangDimensionsloseKriechzahlVarp} /></span>
                <span className="text-[10px] font-mono font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded"><MdText text={inhalt.texte.t11MmM} /></span>
              </div>
              <p className="text-[11px] text-amber-900/90 leading-relaxed"><MdText text={inhalt.texte.dieKriechzahlVarphiInfty} /></p>
              <div className="text-center font-mono text-[11px] py-1 bg-amber-50/60 rounded border border-amber-200/60">
                <InlineMath math="\varepsilon_{cc}(\infty, t_0) = \varepsilon_{\text{el}} \cdot \varphi(\infty, t_0) = \frac{\sigma_c(t_0)}{E_{cm}} \cdot \varphi(\infty, t_0) \quad [\text{in \char8240{} bzw. mm/m}]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-amber-950/90 leading-relaxed">
              {/* Linke Spalte: Praxis-Schätzwerte */}
              <div className="space-y-2.5">
                <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span><MdText text={inhalt.texte.praxisSchätzwerteVordimensionierung} /></div>
                <ul className="space-y-2 text-[11px]">
                  <li className="bg-white/60 p-2.5 rounded-lg border border-amber-200/70 space-y-0.5">
                    <div className="font-bold text-amber-950 flex items-center justify-between">
                      <span><MdText text={inhalt.texte.standardEndkriechzahlC3037} /></span>
                      <span className="font-mono text-amber-800"><InlineMath math="\varphi_\infty \approx 2{,}0 \dots 2{,}5" /></span>
                    </div>
                    <div className="text-slate-700"><MdText text={inhalt.texte.kriechdehnung} /><strong className="text-amber-900 font-mono"><InlineMath math="\varepsilon_{cc} \approx 0{,}60 \dots 1{,}05\,\text{\char8240}" /></strong><MdText text={inhalt.texte.t060Bis1} /></div>
                    <div className="text-[10px] text-slate-500"><MdText text={inhalt.texte.gesamtstauchungVarepsilonTextEl} /></div>
                  </li>

                  <li className="bg-white/60 p-2.5 rounded-lg border border-amber-200/70 space-y-0.5">
                    <div className="font-bold text-amber-950 flex items-center justify-between">
                      <span><MdText text={inhalt.texte.massiveBrückenH0} /></span>
                      <span className="font-mono text-amber-800"><InlineMath math="\varphi_\infty \approx 1{,}5 \dots 2{,}0" /></span>
                    </div>
                    <div className="text-slate-700"><MdText text={inhalt.texte.kriechdehnung2} /><strong className="text-amber-900 font-mono"><InlineMath math="\varepsilon_{cc} \approx 0{,}40 \dots 0{,}80\,\text{\char8240}" /></strong><MdText text={inhalt.texte.t040Bis0} /></div>
                    <div className="text-[10px] text-slate-500"><MdText text={inhalt.texte.durchHoheWirksameDicke} /></div>
                  </li>

                  <li className="bg-white/60 p-2.5 rounded-lg border border-amber-200/70 space-y-0.5">
                    <div className="font-bold text-amber-950 flex items-center justify-between">
                      <span><MdText text={inhalt.texte.schlankeHochbaudeckenH0} /></span>
                      <span className="font-mono text-amber-800"><InlineMath math="\varphi_\infty \approx 2{,}8 \dots 3{,}5" /></span>
                    </div>
                    <div className="text-slate-700"><MdText text={inhalt.texte.kriechdehnung3} /><strong className="text-amber-900 font-mono"><InlineMath math="\varepsilon_{cc} \approx 0{,}80 \dots 1{,}45\,\text{\char8240}" /></strong><MdText text={inhalt.texte.t080Bis1} /></div>
                    <div className="text-[10px] text-slate-500"><MdText text={inhalt.texte.trockeneInnenraumluftUndDünne} /></div>
                  </li>

                  <li className="p-2 bg-amber-100/60 rounded border border-amber-300/60 text-[10.5px] text-amber-900"><MdText text={inhalt.texte.faustregelFürKriechverlusteCa} /></li>
                </ul>
              </div>

              {/* Rechte Spalte: Normativer Rechenwert */}
              <div className="space-y-2.5">
                <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span><MdText text={inhalt.texte.normativerRechenwertEurocode2} /></div>
                <div className="bg-white/90 p-2.5 rounded border border-blue-200 font-mono text-[11px] text-blue-950 overflow-x-auto text-center space-y-1">
                  <div>
                    <InlineMath math="\varphi(\infty, t_0) = \varphi_{RH} \cdot \beta(f_{cm}) \cdot \beta(t_0)" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans"><MdText text={inhalt.texte.berechnungNachEc2Gl} /></div>
                </div>
                <ul className="list-disc pl-5 space-y-1.5 text-[11px] text-blue-950/90">
                  <li><MdText text={inhalt.texte.varphiRh1Frac} /></li>
                  <li><MdText text={inhalt.texte.betaFCmFrac} /></li>
                  <li><MdText text={inhalt.texte.betaT0Frac} /></li>
                  <li><MdText text={inhalt.texte.kriechmaßSpezifischeDehnungC} /></li>
                  <li><MdText text={inhalt.texte.gültigkeitsgrenzeNurLinearBis} /></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Baustellen- & Praxisrelevanz */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
              <span className="font-bold text-amber-900 block mb-1"><MdText text={inhalt.texte.auswirkungImSpannbeton} /></span><MdText text={inhalt.texte.derTrägerVerkürztSich} /></div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs">
              <span className="font-bold text-blue-900 block mb-1">Verformungsverdopplung:</span><MdText text={inhalt.texte.kriechenVergrößertBiegungenUnd} /></div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-900 block mb-1">Praxis-Vermeidung:</span><MdText text={inhalt.texte.spätesVorspannenAbwartenT} /></div>
          </div>
        </div>
      </div>
    );
}
