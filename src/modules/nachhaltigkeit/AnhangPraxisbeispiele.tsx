import { Sparkles, CheckCircle } from 'lucide-react';
import inhalt from '@/content/nachhaltigkeit/AnhangPraxisbeispiele.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function AnhangPraxisbeispiele() {
  return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-200">
        <div className="border-b border-home-grau/25 pb-3">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Anhang 1</span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1"><MdText text={inhalt.texte.durchgerechnetePraxisbeispieleVariantens} /></h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.dasTheoretischeWissenWird} /></p>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-1.5">
            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">BSP 1</span><MdText text={inhalt.texte.außenwandvergleichMassivbauVsHolzständer} /></h4>
          <p className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.aufgabeVergleichZweierStandard} /></p>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Variante 1 */}
            <div className="border border-stone-200 rounded-xl overflow-hidden shadow-3xs bg-white">
              <div className="bg-off-white border-b border-home-grau/20 p-3">
                <h5 className="text-xs font-bold font-mono text-text-main"><MdText text={inhalt.texte.variante1KalksandsteinWdvs} /></h5>
                <p className="text-[10px] text-text-main/70"><MdText text={inhalt.texte.schwererMassivbauMitHervorragender} /></p>
              </div>
              <div className="p-3 overflow-x-auto">
                <table className="w-full text-left text-[11px] border-collapse min-w-[320px]">
                  <thead>
                    <tr className="border-b border-stone-250 font-bold text-slate-700">
                      <th className="pb-1">Schicht</th>
                      <th className="pb-1 text-center">d [m]</th>
                      <th className="pb-1 text-right"><MdText text={inhalt.texte.masseKgM} /></th>
                      <th className="pb-1 text-right"><MdText text={inhalt.texte.gwpFktFossil} /></th>
                      <th className="pb-1 text-right"><MdText text={inhalt.texte.gwpKgCo} /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium"><MdText text={inhalt.texte.innenputzGips} /></td>
                      <td className="py-1.5 text-center font-mono">0,010</td>
                      <td className="py-1.5 text-right font-mono">10,0</td>
                      <td className="py-1.5 text-right font-mono">0,12</td>
                      <td className="py-1.5 text-right font-mono font-medium text-red-700">1,2</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium">KS-Mauerwerk</td>
                      <td className="py-1.5 text-center font-mono">0,175</td>
                      <td className="py-1.5 text-right font-mono">315,0</td>
                      <td className="py-1.5 text-right font-mono">0,12</td>
                      <td className="py-1.5 text-right font-mono font-medium text-red-700">37,8</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium"><MdText text={inhalt.texte.epsDämmung032} /></td>
                      <td className="py-1.5 text-center font-mono">0,160</td>
                      <td className="py-1.5 text-right font-mono">2,9</td>
                      <td className="py-1.5 text-right font-mono">3,50</td>
                      <td className="py-1.5 text-right font-mono font-medium text-red-700">10,1</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium"><MdText text={inhalt.texte.außenputzMineral} /></td>
                      <td className="py-1.5 text-center font-mono">0,008</td>
                      <td className="py-1.5 text-right font-mono">12,8</td>
                      <td className="py-1.5 text-right font-mono">0,20</td>
                      <td className="py-1.5 text-right font-mono font-medium text-red-700">2,6</td>
                    </tr>
                    <tr className="font-bold bg-slate-50 text-slate-900 text-xs">
                      <td className="py-2 pl-1">Summe A1–A3</td>
                      <td className="py-2 text-center">-</td>
                      <td className="py-2 text-right font-mono">≈ 341 kg/m²</td>
                      <td className="py-2 text-right">-</td>
                      <td className="py-2 text-right font-mono text-red-800">51,7 kg/m²</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Variante 2 */}
            <div className="border border-stone-200 rounded-xl overflow-hidden shadow-3xs bg-white">
              <div className="bg-off-white border-b border-home-grau/20 p-3">
                <h5 className="text-xs font-bold font-mono text-text-main"><MdText text={inhalt.texte.variante2HolzständerwandZellulosegedämmt} /></h5>
                <p className="text-[10px] text-text-main/70"><MdText text={inhalt.texte.biobasierteLeichtbauwandMitBiogener} /></p>
              </div>
              <div className="p-3 overflow-x-auto">
                <table className="w-full text-left text-[11px] border-collapse min-w-[320px]">
                  <thead>
                    <tr className="border-b border-stone-250 font-bold text-slate-700">
                      <th className="pb-1">Schicht</th>
                      <th className="pb-1 text-right"><MdText text={inhalt.texte.masseKgM2} /></th>
                      <th className="pb-1 text-right">GWP-fossil</th>
                      <th className="pb-1 text-right">GWP-biogen</th>
                      <th className="pb-1 text-right">GWP-total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium"><MdText text={inhalt.texte.gkPlatte125} /></td>
                      <td className="py-1.5 text-right font-mono">10,0</td>
                      <td className="py-1.5 text-right font-mono text-red-600">2,0</td>
                      <td className="py-1.5 text-right font-mono text-teal-600">≈ 0</td>
                      <td className="py-1.5 text-right font-mono">+2,0</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium"><MdText text={inhalt.texte.konstruktionsholzAnt} /></td>
                      <td className="py-1.5 text-right font-mono">12,0</td>
                      <td className="py-1.5 text-right font-mono text-red-600">1,5</td>
                      <td className="py-1.5 text-right font-mono text-teal-600">-19,8</td>
                      <td className="py-1.5 text-right font-mono text-teal-800">-18,3</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium">Zellulose-Einblasdämm.</td>
                      <td className="py-1.5 text-right font-mono">11,0</td>
                      <td className="py-1.5 text-right font-mono text-red-600">0,8</td>
                      <td className="py-1.5 text-right font-mono text-teal-600">-13,2</td>
                      <td className="py-1.5 text-right font-mono text-teal-800">-12,4</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium"><MdText text={inhalt.texte.holzfaserplatte16Mm} /></td>
                      <td className="py-1.5 text-right font-mono">9,0</td>
                      <td className="py-1.5 text-right font-mono text-red-600">1,6</td>
                      <td className="py-1.5 text-right font-mono text-teal-600">-14,9</td>
                      <td className="py-1.5 text-right font-mono text-teal-800">-13,3</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium"><MdText text={inhalt.texte.außenputzMineral2} /></td>
                      <td className="py-1.5 text-right font-mono">12,8</td>
                      <td className="py-1.5 text-right font-mono text-red-600">2,6</td>
                      <td className="py-1.5 text-right font-mono text-teal-600">≈ 0</td>
                      <td className="py-1.5 text-right font-mono">+2,6</td>
                    </tr>
                    <tr className="font-bold bg-emerald-50 text-emerald-950 text-xs">
                      <td className="py-2 pl-1">Summe A1–A3</td>
                      <td className="py-2 text-right font-mono">≈ 55 kg/m²</td>
                      <td className="py-2 text-right font-mono text-red-700">8,5 kg/m²</td>
                      <td className="py-2 text-right font-mono text-teal-700">-47,9 kg/m²</td>
                      <td className="py-2 text-right font-mono text-emerald-800">-39,4 kg/m²</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/30 p-4 border border-emerald-100 rounded-xl flex items-start gap-3 mt-2">
            <Sparkles className="text-emerald-700 shrink-0 mt-0.5" size={16} />
            <div className="text-[11px] text-emerald-950 leading-relaxed">
              <strong className="block font-bold mb-1"><MdText text={inhalt.texte.interpretationWichtigerAlsNackte} /></strong>
              <ol className="list-decimal pl-4 space-y-1">
                <li><MdText text={inhalt.texte.a1A3BilanzVariante} /></li>
                <li><MdText text={inhalt.texte.aberCradleToGrave} /></li>
                <li><MdText text={inhalt.texte.masseunterschied55KgVs} /></li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-1.5">
            <span className="px-1.5 py-0.5 bg-sky-100 text-sky-800 rounded font-bold text-[10px]">BSP 2</span><MdText text={inhalt.texte.vereinfachteGebäudeökobilanzQngNachweis} /></h4>
          <p className="text-[11px] text-slate-650 leading-relaxed"><MdText text={inhalt.texte.objektFiktivesMehrfamilienhausMfh} /></p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-2">
            <div className="bg-slate-50 border border-stone-200 p-3.5 rounded-xl">
              <strong className="text-xs text-slate-900 block font-bold mb-1"><MdText text={inhalt.texte.schrittAKonstruktionA1} /></strong>
              <p className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.mengenermittlungErgibtAlsSumme} /></p>
              <div className="mt-2 text-[11px] font-mono space-y-1 border-t border-slate-200 pt-1.5">
                <div><MdText text={inhalt.texte.kg300Bauteile540} /></div>
                <div><MdText text={inhalt.texte.kg400Anlagentechnik70} /></div>
                <div><MdText text={inhalt.texte.c3C4Entsorgung95} /></div>
                <div className="font-bold border-t border-slate-200 pt-1 mt-1 text-slate-900"><MdText text={inhalt.texte.summe705TCo} /></div>
              </div>
            </div>

            <div className="bg-slate-50 border border-stone-200 p-3.5 rounded-xl">
              <strong className="text-xs text-slate-900 block font-bold mb-1"><MdText text={inhalt.texte.schrittBErsatzB4} /></strong>
              <p className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.bauteileMitEinerNutzungsdauer} /></p>
              <div className="mt-4 text-[11px] font-mono text-slate-900 font-bold border-t border-slate-200 pt-1.5"><MdText text={inhalt.texte.ersatzaufwand50Jahre180} /><div className="font-mono text-slate-500 font-normal pt-1"><MdText text={inhalt.texte.t1800001200M} /></div>
                <div className="text-shiraz"><MdText text={inhalt.texte.t300KgCo} /></div>
              </div>
            </div>

            <div className="bg-slate-50 border border-stone-200 p-3.5 rounded-xl">
              <strong className="text-xs text-slate-900 block font-bold mb-1"><MdText text={inhalt.texte.schrittCBetriebB6} /></strong>
              <p className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.endenergieStromHeizungWarmwasser} /></p>
              <div className="mt-2 text-[11px] font-mono text-slate-900 font-bold border-t border-slate-200 pt-1.5"><MdText text={inhalt.texte.stromverbrauchB6} /><div className="font-mono text-slate-500 font-normal pt-1"><MdText text={inhalt.texte.t18KwhMA} /></div>
                <div className="text-shiraz"><MdText text={inhalt.texte.t774KgCo} /></div>
              </div>
            </div>
          </div>

          <div className="border border-stone-200 rounded-xl overflow-hidden mt-3 max-w-2xl mx-auto shadow-2xs">
            <div className="bg-slate-100 p-2.5 border-b border-stone-200 text-xs font-bold text-slate-800"><MdText text={inhalt.texte.schrittDGesamtergebnisQng} /></div>
            <div className="p-3 bg-white space-y-3">
              <div className="grid grid-cols-3 text-xs border-b border-stone-100 pb-1.5 text-slate-500 font-bold">
                <div>Lebenszyklus-Anteil</div>
                <div className="text-center font-bold"><MdText text={inhalt.texte.kgCoÄqM} /></div>
                <div className="text-right font-bold font-mono"><MdText text={inhalt.texte.prozentualerAnteil} /></div>
              </div>
              <div className="grid grid-cols-3 text-xs py-0.5 text-slate-800">
                <div><MdText text={inhalt.texte.herstellungEntsorgungA1A3} /></div>
                <div className="text-center font-mono font-medium">11,75</div>
                <div className="text-right font-mono text-slate-500">52 %</div>
              </div>
              <div className="grid grid-cols-3 text-xs py-0.5 text-slate-800">
                <div><MdText text={inhalt.texte.ersatzzyklusB4} /></div>
                <div className="text-center font-mono font-medium">3,00</div>
                <div className="text-right font-mono text-slate-500">13 %</div>
              </div>
              <div className="grid grid-cols-3 text-xs py-0.5 text-slate-800">
                <div><MdText text={inhalt.texte.anlagenBetriebB6} /></div>
                <div className="text-center font-mono font-medium">7,75</div>
                <div className="text-right font-mono text-slate-500 font-semibold">34 %</div>
              </div>
              <div className="grid grid-cols-3 text-xs font-bold pt-2 border-t border-stone-250 text-slate-900 bg-slate-50 -mx-3 -mb-3 p-3">
                <div>Lehr-Gesamtergebnis</div>
                <div className="text-center font-mono text-shiraz"><MdText text={inhalt.texte.t2250KgM} /></div>
                <div className="text-right">100 %</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-50/50 border border-indigo-150 rounded-xl flex items-start gap-3">
            <CheckCircle className="text-indigo-700 shrink-0 mt-0.5" size={16} />
            <div className="text-[11px] text-indigo-950 leading-relaxed">
              <strong className="block font-bold"><MdText text={inhalt.texte.qngPlusPremiumBewertung} /></strong><MdText text={inhalt.texte.derWertVon22} /></div>
          </div>
        </div>
      </div>
    );
}
