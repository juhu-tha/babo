import type { Dispatch, SetStateAction } from 'react';
import { ArrowRight, CheckCircle2, BookOpen, Activity, TrendingDown } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import inhalt from '@/content/spannbeton/nullbishundert/Station2Dilemma.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface Station2DilemmaProps {
  concreteStauchung: number;
  setConcreteStauchung: Dispatch<SetStateAction<number>>;
  lossPercent_b500: number;
  remaining_b500: number;
  lossPercent_y1860: number;
  remaining_y1860: number;
  onNavigateTab: ((tab: "grundprinzipien" | "kennwerte" | "rechner" | "dauerhaftigkeit") => void) | undefined;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export function Station2Dilemma({ concreteStauchung, setConcreteStauchung, lossPercent_b500, remaining_b500, lossPercent_y1860, remaining_y1860, onNavigateTab, setActiveStep }: Station2DilemmaProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-home-grau/20 pb-4">
        <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.lektion2Von6} /></span>
        <h3 className="text-xl md:text-2xl font-black text-text-main mt-2"><MdText text={inhalt.texte.rheologischeBaustoffphysikDieNotwendigke} /></h3>
        <p className="text-sm text-text-main/80 mt-1"><MdText text={inhalt.texte.kriechenUndSchwindenDes} /></p>
      </div>
    
      {/* Sachliche Einführung */}
      <div className="bg-off-white border-l-4 border-shiraz p-5 rounded-r-xl shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg text-shiraz shrink-0 mt-0.5 border border-home-grau/20">
            <BookOpen size={20} />
          </div>
          <div className="text-sm text-text-main leading-relaxed space-y-2">
            <p className="font-bold text-slate-900"><MdText text={inhalt.texte.werkstoffphysikalischeRandbedingungen} /></p>
            <p><MdText text={inhalt.texte.früheVersucheZurEinführung} /></p>
            <p><MdText text={inhalt.texte.dieUrsacheLiegtIm} /></p>
          </div>
        </div>
      </div>
    
      {/* Mechanischer Vergleich: B500 vs Y1860 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-red-50/70 p-5 rounded-xl border border-red-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-red-900 flex items-center gap-1.5">
              <TrendingDown size={16} /><MdText text={inhalt.texte.verhaltenVonNormalemBetonstahl} /></h4>
            <span className="text-[10px] font-mono font-bold bg-red-200 text-red-900 px-2 py-0.5 rounded"><MdText text={inhalt.texte.untauglichFürVorspannung} /></span>
          </div>
          <div className="text-xs text-red-950 space-y-2 leading-relaxed">
            <p><MdText text={inhalt.texte.betonstahlB500BesitztEine} /></p>
            <div className="p-2 bg-white rounded border border-red-200 font-mono text-center">
              <InlineMath math="\varepsilon_{s,el} = \frac{f_{yd}}{E_s} = \frac{435}{200\,000} \approx 2{,}175\,\text{‰}" />
            </div>
            <p><MdText text={inhalt.texte.verkürztSichDerBeton} /></p>
            <div className="p-2 bg-white rounded border border-red-200 font-mono text-center text-red-700 font-bold">
              <InlineMath math="\Delta \sigma_s = E_s \cdot \Delta \varepsilon = 200\,000 \cdot 0{,}0010 = 200\,\text{N/mm}^2" />
            </div>
            <p className="font-semibold text-red-900"><MdText text={inhalt.texte.diesEntsprichtEinemVerlust} /></p>
          </div>
        </div>
    
        <div className="bg-emerald-50/80 p-5 rounded-xl border border-emerald-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 size={16} /><MdText text={inhalt.texte.verhaltenVonHochfestemSpannstahl} /></h4>
            <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded"><MdText text={inhalt.texte.normkonformerStandard} /></span>
          </div>
          <div className="text-xs text-emerald-950 space-y-2 leading-relaxed">
            <p><MdText text={inhalt.texte.spannstahlY1860ZB} /></p>
            <div className="p-2 bg-white rounded border border-emerald-200 font-mono text-center">
              <InlineMath math="\varepsilon_{p0} = \frac{\sigma_{pm0}}{E_p} = \frac{1360}{195\,000} \approx 6{,}97\,\text{‰}" />
            </div>
            <p><MdText text={inhalt.texte.beiTypischerBetonverkürzungVon} /></p>
            <div className="p-2 bg-white rounded border border-emerald-200 font-mono text-center text-emerald-800 font-bold">
              <InlineMath math="\Delta \sigma_p = 195\,000 \cdot 0{,}0010 = 195\,\text{N/mm}^2 \quad (\approx 14{,}3\,\%\text{ Verlust})" />
            </div>
            <p className="font-semibold text-emerald-900"><MdText text={inhalt.texte.über8085Der} /></p>
          </div>
        </div>
      </div>
    
      {/* Interaktiver Simulator: Spannungsverlust durch Betonverkürzung */}
      <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
          <span className="text-xs font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
            <Activity size={15} /><MdText text={inhalt.texte.interaktiveSimulationEinflussDer} /></span>
          <span className="text-xs font-mono font-bold text-text-main"><MdText text={inhalt.texte.verkürzungDeltaVarepsilonC} /><strong className="text-shiraz">{formatDeZahl(concreteStauchung, 2)} ‰</strong>
          </span>
        </div>
    
        <div>
          <label className="block text-xs text-text-main/70 mb-1 flex justify-between font-semibold">
            <span><MdText text={inhalt.texte.gesamteZeitabhängigeBetonverkürzungKriec} /></span>
            <span className="font-mono text-shiraz font-bold">{formatDeZahl(concreteStauchung, 2)} ‰</span>
          </label>
          <input
            type="range"
            min={0.2}
            max={2.0}
            step={0.05}
            value={concreteStauchung}
            onChange={(e) => setConcreteStauchung(Number(e.target.value))}
            className="w-full accent-shiraz cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-text-main/50 font-mono mt-1">
            <span><MdText text={inhalt.texte.t020GeringeDauerlast} /></span>
            <span><MdText text={inhalt.texte.typisch081} /></span>
            <span><MdText text={inhalt.texte.t200SehrUngünstiges} /></span>
          </div>
        </div>
    
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-red-50 p-3.5 rounded-lg border border-red-200">
            <div className="text-[11px] font-bold text-red-900 mb-1 flex justify-between">
              <span><MdText text={inhalt.texte.betonstahlB500} /></span>
              <span className="font-mono">{formatDeWert(lossPercent_b500)} % Verlust</span>
            </div>
            <div className="w-full bg-red-200 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-red-600 h-full transition-all duration-200"
                style={{ width: `${lossPercent_b500}%` }}
              />
            </div>
            <div className="text-[11px] font-mono text-red-950 flex justify-between">
              <span>Restspannung:</span>
              <strong>{formatDeZahl(remaining_b500, 0)} N/mm²</strong>
            </div>
          </div>
    
          <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-200">
            <div className="text-[11px] font-bold text-emerald-900 mb-1 flex justify-between">
              <span><MdText text={inhalt.texte.spannstahlY1860} /></span>
              <span className="font-mono">{formatDeWert(lossPercent_y1860)} % Verlust</span>
            </div>
            <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-emerald-600 h-full transition-all duration-200"
                style={{ width: `${lossPercent_y1860}%` }}
              />
            </div>
            <div className="text-[11px] font-mono text-emerald-950 flex justify-between">
              <span>Restspannung:</span>
              <strong>{formatDeZahl(remaining_y1860, 0)} N/mm²</strong>
            </div>
          </div>
        </div>
      </div>
    
      {/* Sprunglink */}
      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-text-main/80">
          <span className="font-bold text-text-main block"><MdText text={inhalt.texte.detaillierteBeiwerteNachEurocode} /></span><MdText text={inhalt.texte.dieExaktenZeitfunktionenFür} /></div>
        <div className="flex gap-2">
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('kennwerte')}
              className="px-3.5 py-2 bg-white text-shiraz border border-shiraz/40 hover:bg-shiraz/10 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <BookOpen size={13} /><MdText text={inhalt.texte.zuDenBaustoffkennwerten} /></button>
          )}
          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className="px-4 py-2 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          ><MdText text={inhalt.texte.weiterZuKapitel3} /><ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
