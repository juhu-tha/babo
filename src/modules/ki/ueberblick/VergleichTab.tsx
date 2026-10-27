// Ausgelagert aus src/modules/ki/KiUeberblick.tsx (AP 5.2)
import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, Workflow } from 'lucide-react';
import { ragDemonstrations } from './daten';
import inhalt from '@/content/ki/ueberblick/VergleichTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../../../components/ui/Auswahlgruppe';

export interface VergleichTabProps {
  setSimMode: React.Dispatch<React.SetStateAction<'rag' | 'llm_pur'>>;
  setSimQuestion: React.Dispatch<React.SetStateAction<'xc4' | 'xf4' | 'rc_beton'>>;
  simMode: 'rag' | 'llm_pur';
  simQuestion: 'xc4' | 'xf4' | 'rc_beton';
}

export default function VergleichTab({ setSimMode, setSimQuestion, simMode, simQuestion }: VergleichTabProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <Workflow className="text-shiraz" size={20} /><MdText text={inhalt.texte.interaktiverPraxisSimulatorWarum} /></h3>
        <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.erlebenSieDenUnterschied} /></p>
      </div>

      {/* Question Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.wählenSieEineTypische} /></label>
        <AuswahlGruppe label="Fragestellung" className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <button {...alsOption(simQuestion === 'xc4')}
            onClick={() => setSimQuestion('xc4')}
            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
              simQuestion === 'xc4'
                ? 'bg-shiraz/5 border-shiraz ring-1 ring-shiraz text-text-main font-bold'
                : 'bg-off-white border-home-grau/30 text-text-main/80 hover:bg-slate-50'
            }`}
          >
            <div className="text-xs"><MdText text={inhalt.texte.betondeckungXc4} /></div>
            <div className="text-[10px] text-text-main/60 mt-0.5"><MdText text={inhalt.texte.dinEn19921} /></div>
          </button>

          <button {...alsOption(simQuestion === 'xf4')}
            onClick={() => setSimQuestion('xf4')}
            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
              simQuestion === 'xf4'
                ? 'bg-shiraz/5 border-shiraz ring-1 ring-shiraz text-text-main font-bold'
                : 'bg-off-white border-home-grau/30 text-text-main/80 hover:bg-slate-50'
            }`}
          >
            <div className="text-xs"><MdText text={inhalt.texte.wZGrenzwertTaumittel} /></div>
            <div className="text-[10px] text-text-main/60 mt-0.5"><MdText text={inhalt.texte.din10452Din} /></div>
          </button>

          <button {...alsOption(simQuestion === 'rc_beton')}
            onClick={() => setSimQuestion('rc_beton')}
            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
              simQuestion === 'rc_beton'
                ? 'bg-shiraz/5 border-shiraz ring-1 ring-shiraz text-text-main font-bold'
                : 'bg-off-white border-home-grau/30 text-text-main/80 hover:bg-slate-50'
            }`}
          >
            <div className="text-xs"><MdText text={inhalt.texte.rcBetonInSpannbeton} /></div>
            <div className="text-[10px] text-text-main/60 mt-0.5"><MdText text={inhalt.texte.zulässigkeitNachDin1045} /></div>
          </button>
        </AuswahlGruppe>
      </div>

      {/* Mode Switcher */}
      <AuswahlGruppe label="Modus" className="flex border border-home-grau/30 bg-slate-50 p-1 rounded-xl max-w-md">
        <button {...alsOption(simMode === 'llm_pur')}
          onClick={() => setSimMode('llm_pur')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            simMode === 'llm_pur'
              ? 'bg-white text-rose-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        ><MdText text={inhalt.texte.modusAReinesLlm} /></button>
        <button {...alsOption(simMode === 'rag')}
          onClick={() => setSimMode('rag')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            simMode === 'rag'
              ? 'bg-shiraz text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        ><MdText text={inhalt.texte.modusBLlmRag} /></button>
      </AuswahlGruppe>

      {/* Current Question Display */}
      <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium flex items-start gap-2.5">
        <HelpCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Fragestellung:</strong> {ragDemonstrations[simQuestion].question}
        </div>
      </div>

      {/* Comparison Output Box */}
      {simMode === 'llm_pur' ? (
        <div className="p-5 bg-rose-50/40 rounded-xl border border-rose-200 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-rose-100 pb-2">
            <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
              <AlertTriangle size={15} /><MdText text={inhalt.texte.antwortDesReinenLlm} /></span>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
              {ragDemonstrations[simQuestion].llmPur.verdict}
            </span>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-line bg-white p-3 rounded-lg border border-rose-100">
            "{ragDemonstrations[simQuestion].llmPur.text}"
          </p>
          <div className="text-xs text-rose-900 bg-rose-100/60 p-3 rounded-lg"><MdText text={inhalt.texte.fachlicheKritik} />{ragDemonstrations[simQuestion].llmPur.critique}
          </div>
        </div>
      ) : (
        <div className="p-5 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 size={15} /><MdText text={inhalt.texte.antwortMitRagDin} /></span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              {ragDemonstrations[simQuestion].rag.verdict}
            </span>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-line bg-white p-3 rounded-lg border border-emerald-100">
            {ragDemonstrations[simQuestion].rag.text}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-emerald-100/60 p-3 rounded-lg text-emerald-950">
            <div><MdText text={inhalt.texte.automatischZitierteNormenquelle} />{ragDemonstrations[simQuestion].rag.source}
            </div>
            <div className="font-bold text-[11px] text-emerald-800">
              {ragDemonstrations[simQuestion].rag.benefit}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
