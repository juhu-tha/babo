import { Droplets, Activity, Info, Scale } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import inhalt from '@/content/spannbeton/kennwerte/KennwerteSchwinden.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function KennwerteSchwinden() {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
          <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <Droplets className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.t2SchwindenDesBetons} /></h4>
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.verlustanteilCa48} /></span>
          </div>

          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
            <p><MdText text={inhalt.texte.wasIstSchwindenSchwinden} /></p>
            <div className="text-center my-3">
              <BlockMath math="\varepsilon_{cs}(t, t_s) = \varepsilon_{ca}(t) + \varepsilon_{cd}(t, t_s)" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Autogenes Schwinden */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber-600" /><MdText text={inhalt.texte.aAutogenesSchwindenVarepsilon} /></h5>
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Chemisch</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.mechanismusBeiDerHydratation} /><span className="italic">Le-Chatelier-Kontraktion</span><MdText text={inhalt.texte.daImKernKein} /></p>
              <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
                <div><MdText text={inhalt.texte.endwertNachEc2} /></div>
                <div className="text-shiraz font-bold">
                  <InlineMath math="\varepsilon_{ca}(\infty) = 2{,}5 \cdot (f_{ck} - 10) \cdot 10^{-6}" />
                </div>
                <div className="text-[10px] text-slate-500 pt-1"><MdText text={inhalt.texte.c5060VarepsilonCa} /></div>
              </div>
              <p className="text-xs text-slate-600"><MdText text={inhalt.texte.besonderheitBeiSpannbetonSpannbeton} /></p>
            </div>

            {/* Trocknungsschwinden */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-600" /><MdText text={inhalt.texte.bTrocknungsschwindenVarepsilonCd} /></h5>
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
                <div className="text-[10px] text-slate-500 pt-1"><MdText text={inhalt.texte.dieserUnterdruckZiehtDas} /></div>
              </div>
              <p className="text-xs text-slate-600"><MdText text={inhalt.texte.einflussDerBauteilabmessungDas} /></p>
            </div>
          </div>

          {/* Zahlenbeispiel Spannkraftverlust aus Schwinden */}
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="font-bold flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-amber-600" /><MdText text={inhalt.texte.auswirkungAufDenSpannstahl} /></div>
            <p><MdText text={inhalt.texte.beträgtDasGesamtschwindmaßVarepsilon} /></p>
            <div className="font-mono bg-white p-2.5 rounded border border-amber-200 font-bold text-center">
              <InlineMath math="\Delta\sigma_{p,s} = \varepsilon_{cs} \cdot E_p = 0{,}00035 \cdot 195.000\text{ N/mm}^2 = 68{,}25\text{ N/mm}^2" />
            </div>
            <p><MdText text={inhalt.texte.beiEinerTypischenAnfangsspannung} /></p>
          </div>

          {/* Didaktische Box: Schätzwerte vs. Rechenwerte für Schwindbeiwerte */}
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/60 pb-2">
              <h5 className="font-bold text-xs text-blue-950 flex items-center gap-2 uppercase tracking-wide">
                <Scale className="h-4 w-4 text-blue-800" /><MdText text={inhalt.texte.größenordnungenDerSchwindbeiwerteSchätzw} /></h5>
              <span className="text-[11px] font-mono font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded border border-blue-300"><MdText text={inhalt.texte.dinEn19921} /></span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-950/90 leading-relaxed">
              <div className="space-y-2">
                <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span><MdText text={inhalt.texte.praxisSchätzwerteVordimensionierung} /></div>
                <ul className="list-disc pl-5 space-y-1 text-[11px]">
                  <li><MdText text={inhalt.texte.gesamtschwindmaßVarepsilonCsApprox} /></li>
                  <li><MdText text={inhalt.texte.feuchterAußenbereichRh80} /></li>
                  <li><MdText text={inhalt.texte.trockenerInnenbereichRh50} /></li>
                  <li><MdText text={inhalt.texte.faustregelFürSchwindverlusteCa} /></li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span><MdText text={inhalt.texte.normativerRechenwertEurocode2} /></div>
                <div className="bg-white/80 p-2 rounded border border-blue-200 font-mono text-[11px] text-blue-950 overflow-x-auto text-center">
                  <InlineMath math="\varepsilon_{cs}(\infty) = \varepsilon_{cd}(\infty) + \varepsilon_{ca}(\infty) = k_h \cdot \varepsilon_{cd,0} + 2{,}5(f_{ck}-10) \cdot 10^{-6}" />
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-blue-950/90">
                  <li><MdText text={inhalt.texte.kHGeometriefaktor1} /></li>
                  <li><MdText text={inhalt.texte.varepsilonCd0Grundwert} /></li>
                  <li><MdText text={inhalt.texte.varepsilonCaAutogenesSchwinden} /></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
