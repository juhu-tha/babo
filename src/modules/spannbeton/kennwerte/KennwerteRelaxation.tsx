import { Zap, Scale, Thermometer, BookOpen } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import inhalt from '@/content/spannbeton/kennwerte/KennwerteRelaxation.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function KennwerteRelaxation() {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
          <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <Zap className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.t3RelaxationDesSpannstahls} /></h4>
            <span className="text-xs font-mono font-bold bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.verlustanteilCa25} /></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm text-text-main/80 leading-relaxed">
              <p><MdText text={inhalt.texte.wasIstRelaxationWährend} /></p>
              <div className="bg-off-white p-3 rounded-xl border border-home-grau/30 text-center">
                <BlockMath math="\varepsilon_p = \text{const.} \quad \Longrightarrow \quad \sigma_p(t) < \sigma_{p0}" />
              </div>
              <p><MdText text={inhalt.texte.mikrostrukturellerVorgangImKristallgitte} /></p>
            </div>

            {/* Relaxationsklassen nach Eurocode 2 */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-purple-700" /><MdText text={inhalt.texte.die3RelaxationsklassenDin} /></h5>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-900 mb-1">
                    <span><MdText text={inhalt.texte.klasse1NormaleRelaxation} /></span>
                    <span className="text-red-700 font-mono"><MdText text={inhalt.texte.t80} /></span>
                  </div>
                  <p className="text-[11px] text-slate-600"><MdText text={inhalt.texte.kaltgezogeneDrähteUndLitzen} /></p>
                </div>

                <div className="p-3 bg-purple-50/70 rounded-lg border border-purple-200">
                  <div className="flex justify-between font-bold text-purple-950 mb-1">
                    <span><MdText text={inhalt.texte.klasse2SehrNiedrige} /></span>
                    <span className="text-purple-800 font-mono font-bold"><MdText text={inhalt.texte.t25} /></span>
                  </div>
                  <p className="text-[11px] text-purple-900"><MdText text={inhalt.texte.heutigerStandardDieLitzen} /></p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-900 mb-1">
                    <span><MdText text={inhalt.texte.klasse3WarmgewalzteSpannstähle} /></span>
                    <span className="text-amber-800 font-mono"><MdText text={inhalt.texte.t40} /></span>
                  </div>
                  <p className="text-[11px] text-slate-600"><MdText text={inhalt.texte.spannstäbeMitWarmAufgewalztem} /></p>
                </div>
              </div>
            </div>
          </div>

          {/* Eurocode 2 Formel für Relaxation */}
          <div className="bg-purple-50/40 p-4 rounded-xl border border-purple-100 space-y-3">
            <div className="font-bold text-purple-900 text-xs flex items-center justify-between">
              <span><MdText text={inhalt.texte.berechnungNachEurocode2} /></span>
              <span className="font-mono text-[11px] text-purple-700"><MdText text={inhalt.texte.tZeitInStunden} /></span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-purple-200 text-center font-mono text-xs overflow-x-auto">
              <BlockMath math="\frac{\Delta\sigma_{pr}}{\sigma_{pi}} = 0{,}66 \cdot \rho_{1000} \cdot e^{9{,}1 \mu} \cdot \left(\frac{t}{1000}\right)^{0{,}75 \cdot (1 - \mu)} \cdot 10^{-5}" />
            </div>
            <div className="text-[11px] text-slate-600 space-y-1">
              <p><MdText text={inhalt.texte.wobeiMuSigmaPi} /></p>
              <div className="font-bold text-purple-950 font-mono text-center">
                <InlineMath math="\Delta\sigma_{pr,\infty} \approx 3{,}0 \cdot \Delta\sigma_{pr,1000}" />
              </div>
            </div>
          </div>

          {/* Warnbox Temperatureinfluss */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1.5 flex gap-3 items-start">
            <Thermometer className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm"><MdText text={inhalt.texte.achtungExponentielleZunahmeBei} /></strong><MdText text={inhalt.texte.dieDiffusionsgeschwindigkeitImStahl} /></div>
          </div>

          {/* Tabelle 2 nach DIN EN 1992-1-1 */}
          <div className="p-5 rounded-xl bg-white border border-home-grau/30 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-shiraz" /><MdText text={inhalt.texte.tabelle2RepräsentativeMechanische} /></h5>
              <span className="text-[10px] font-mono bg-purple-50 text-purple-900 border border-purple-200 px-2 py-0.5 rounded"><MdText text={inhalt.texte.zBY1770s7Y1860s7} /></span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                    <th className="p-2.5"><MdText text={inhalt.texte.eigenschaftDesSpannstahls} /></th>
                    <th className="p-2.5"><MdText text={inhalt.texte.symbolNachEc2} /></th>
                    <th className="p-2.5"><MdText text={inhalt.texte.typischerParameterwert} /></th>
                    <th className="p-2.5"><MdText text={inhalt.texte.bedeutungFürDieTragwerksbemessung} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold"><MdText text={inhalt.texte.charakteristischeZugfestigkeit} /></td>
                    <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="f_{pk}" /></td>
                    <td className="p-2.5 font-mono font-bold text-slate-900"><MdText text={inhalt.texte.t17701860NMm} /></td>
                    <td className="p-2.5 text-[11px]"><MdText text={inhalt.texte.bruchfestigkeitsgrenzeImGrenzzustandDer} /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold"><MdText text={inhalt.texte.t01DehngrenzeErsatzstreckgrenze} /></td>
                    <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="f_{p0{,}1k}" /></td>
                    <td className="p-2.5 font-mono font-bold text-slate-900"><MdText text={inhalt.texte.t15201600NMm} /></td>
                    <td className="p-2.5 text-[11px]"><MdText text={inhalt.texte.elastizitätsgrenzeMaßgebendFürZulässige} /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold"><MdText text={inhalt.texte.elastizitätsmodulLitzenDrähte} /></td>
                    <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="E_p" /></td>
                    <td className="p-2.5 font-mono font-bold text-slate-900"><MdText text={inhalt.texte.ca195000N} /></td>
                    <td className="p-2.5 text-[11px]"><MdText text={inhalt.texte.geringerAlsStabstahl205} /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold"><MdText text={inhalt.texte.charaktDehnungBeiHöchstlast} /></td>
                    <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="\varepsilon_{uk}" /></td>
                    <td className="p-2.5 font-mono font-bold text-slate-900">≥ 3,5 % (≥ 35 ‰)</td>
                    <td className="p-2.5 text-[11px]"><MdText text={inhalt.texte.mindestduktilitätZurVorankündigungUnd} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Didaktische Box: Schätzwerte vs. Rechenwerte für Stahlrelaxation */}
          <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200/60 pb-2">
              <h5 className="font-bold text-xs text-purple-950 flex items-center gap-2 uppercase tracking-wide">
                <Scale className="h-4 w-4 text-purple-800" /><MdText text={inhalt.texte.größenordnungenDerRelaxationsbeiwerteSch} /></h5>
              <span className="text-[11px] font-mono font-bold text-purple-900 bg-purple-100/80 px-2 py-0.5 rounded border border-purple-300"><MdText text={inhalt.texte.dinEn19921} /></span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-purple-950/90 leading-relaxed">
              <div className="space-y-2">
                <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span><MdText text={inhalt.texte.praxisSchätzwerteVordimensionierung} /></div>
                <ul className="list-disc pl-5 space-y-1 text-[11px]">
                  <li><MdText text={inhalt.texte.t1000StundenReferenzverlustRho} /></li>
                  <li><MdText text={inhalt.texte.alteBauwerkeDrahtKlasse} /></li>
                  <li><MdText text={inhalt.texte.langzeitRelaxationsverlust500000} /></li>
                  <li><MdText text={inhalt.texte.spannkraftverlustEntsprichtTypischerweis} /></li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span><MdText text={inhalt.texte.normativerRechenwertEurocode2} /></div>
                <div className="bg-white/80 p-2 rounded border border-blue-200 font-mono text-[11px] text-blue-950 overflow-x-auto text-center">
                  <InlineMath math="\frac{\Delta\sigma_{pr}}{\sigma_{pi}} = 0{,}66 \cdot \rho_{1000} \cdot e^{9{,}1 \mu} \cdot \left(\frac{t}{1000}\right)^{0{,}75 (1-\mu)} \cdot 10^{-5}" />
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-blue-950/90">
                  <li><MdText text={inhalt.texte.muSigmaPiF} /></li>
                  <li><MdText text={inhalt.texte.t500000Stunden} /></li>
                  <li><MdText text={inhalt.texte.wärmebehandlungBeiDampfhärtung50} /></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
