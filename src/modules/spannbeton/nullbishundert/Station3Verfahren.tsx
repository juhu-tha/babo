import type { Dispatch, SetStateAction } from 'react';
import { ArrowRight, ArrowLeft, BookOpen, Info } from 'lucide-react';
import { InlineMath } from 'react-katex';
import inhalt from '@/content/spannbeton/nullbishundert/Station3Verfahren.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface Station3VerfahrenProps {
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export function Station3Verfahren({ setActiveStep }: Station3VerfahrenProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-home-grau/20 pb-4">
        <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.lektion3Von6} /></span>
        <h3 className="text-xl md:text-2xl font-black text-text-main mt-2"><MdText text={inhalt.texte.die4VorspannverfahrenNach} /></h3>
        <p className="text-sm text-text-main/80 mt-1"><MdText text={inhalt.texte.verfahrenstechnischeDifferenzierungSofor} /></p>
      </div>
    
      {/* Sachliche Einführung */}
      <div className="bg-off-white border-l-4 border-shiraz p-5 rounded-r-xl shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg text-shiraz shrink-0 mt-0.5 border border-home-grau/20">
            <BookOpen size={20} />
          </div>
          <div className="text-sm text-text-main leading-relaxed space-y-2">
            <p className="font-bold text-slate-900"><MdText text={inhalt.texte.verfahrenstechnischeDifferenzierung} /></p>
            <p><MdText text={inhalt.texte.dieKrafteinleitungUndDer} /></p>
          </div>
        </div>
      </div>
    
      {/* 4-Spalten-Vergleich */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Verfahren 1 */}
        <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Werksproduktion
              </span>
            </div>
            <h4 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t1SofortigerVerbundSpannbett} /></h4>
            <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
              <p><MdText text={inhalt.texte.fertigungsablaufSpannstahldrähteOderLitz} /></p>
              <p><MdText text={inhalt.texte.krafteinleitungReinÜberVerbundspannungen} /></p>
            </div>
          </div>
          <div className="p-2 bg-blue-50/70 rounded-lg border border-blue-200 text-[10px] text-blue-900 font-medium"><MdText text={inhalt.texte.typischeBauteileHohlplattendeckenSpannbe} /></div>
        </div>
    
        {/* Verfahren 2 */}
        <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded"><MdText text={inhalt.texte.ortbetonBrücken} /></span>
            </div>
            <h4 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t2NachträglicherVerbundHüllrohre} /></h4>
            <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
              <p><MdText text={inhalt.texte.fertigungsablaufWellrohreStahlblechOder} /></p>
              <p><MdText text={inhalt.texte.verbundSchutzDieRohre} /></p>
            </div>
          </div>
          <div className="p-2 bg-amber-50/70 rounded-lg border border-amber-200 text-[10px] text-amber-900 font-medium"><MdText text={inhalt.texte.typischeBauteileGroßbrückenFreivorbau} /></div>
        </div>
    
        {/* Verfahren 3 */}
        <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded"><MdText text={inhalt.texte.hochbauFlachdecken} /></span>
            </div>
            <h4 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t3OhneVerbundMonolitzen} /></h4>
            <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
              <p><MdText text={inhalt.texte.fertigungsablaufEinzelneLitzenSind} /></p>
              <p><MdText text={inhalt.texte.mechanikKeinLokalerDehnungsverbund} /></p>
            </div>
          </div>
          <div className="p-2 bg-emerald-50/70 rounded-lg border border-emerald-200 text-[10px] text-emerald-900 font-medium"><MdText text={inhalt.texte.typischeBauteilePunktgestützteFlachdecke} /></div>
        </div>
    
        {/* Verfahren 4 */}
        <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded"><MdText text={inhalt.texte.hohlkastenVerstärkung} /></span>
            </div>
            <h4 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t4ExterneVorspannung} /></h4>
            <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
              <p><MdText text={inhalt.texte.fertigungsablaufSpanngliederVerlaufenAuß} /></p>
              <p><MdText text={inhalt.texte.vorteileDünnereBetonstegeKeine} /></p>
            </div>
          </div>
          <div className="p-2 bg-purple-50/70 rounded-lg border border-purple-200 text-[10px] text-purple-900 font-medium"><MdText text={inhalt.texte.typischeBauteileHohlkastenbrückenErtücht} /></div>
        </div>
      </div>
    
      {/* Querschnitts-Phasen Info */}
      <div className="bg-off-white p-4 rounded-xl border border-home-grau/25 space-y-2">
        <h5 className="font-bold text-xs text-text-main flex items-center gap-2">
          <Info size={15} className="text-shiraz" /><MdText text={inhalt.texte.querschnittsphasenImZeitablauf} /></h5>
        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-lg border border-home-grau/20">
            <span className="font-bold text-slate-900 block"><MdText text={inhalt.texte.t1BruttoquerschnittAC} /></span>
            <span className="text-slate-600 text-[11px]"><MdText text={inhalt.texte.reineBetonabmessungenVorEinlegen} /></span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-home-grau/20">
            <span className="font-bold text-slate-900 block"><MdText text={inhalt.texte.t2NettoquerschnittAN} /></span>
            <span className="text-slate-600 text-[11px]"><MdText text={inhalt.texte.giltImVorspannzustandT} /></span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-home-grau/20">
            <span className="font-bold text-slate-900 block"><MdText text={inhalt.texte.t3IdeellerQuerschnittA} /></span>
            <span className="text-slate-600 text-[11px]"><MdText text={inhalt.texte.giltNachDemVerpressen} /></span>
          </div>
        </div>
      </div>
    
      {/* Navigation */}
      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 flex justify-between items-center">
        <button
          type="button"
          onClick={() => setActiveStep(1)}
          className="px-3.5 py-2 bg-white text-text-main hover:bg-slate-100 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-home-grau/30 cursor-pointer"
        >
          <ArrowLeft size={14} /><MdText text={inhalt.texte.zurückZuKapitel2} /></button>
        <button
          type="button"
          onClick={() => setActiveStep(3)}
          className="px-4 py-2 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
        ><MdText text={inhalt.texte.weiterZuKapitel4} /><ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
