import type { Dispatch, SetStateAction } from 'react';
import { ArrowRight, ArrowLeft, BookOpen, Activity, Compass, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';
import { InlineMath } from 'react-katex';
import inhalt from '@/content/spannbeton/nullbishundert/Station6Nachweise.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface Station6NachweiseProps {
  setQuizAnswers: Dispatch<SetStateAction<{ [key: string]: number | null; }>>;
  quizAnswers: { [key: string]: number | null; };
  onNavigateTab: ((tab: "grundprinzipien" | "kennwerte" | "rechner" | "dauerhaftigkeit") => void) | undefined;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export function Station6Nachweise({ setQuizAnswers, quizAnswers, onNavigateTab, setActiveStep }: Station6NachweiseProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-home-grau/20 pb-4">
        <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.lektion6Von6} /></span>
        <h3 className="text-xl md:text-2xl font-black text-text-main mt-2"><MdText text={inhalt.texte.eurocode2NachweiskonzeptDie} /></h3>
        <p className="text-sm text-text-main/80 mt-1"><MdText text={inhalt.texte.überblickÜberGrenzzuständeGzt} /></p>
      </div>
    
      {/* Die 5 Bemessungsregeln */}
      <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
        <h4 className="font-bold text-sm text-shiraz flex items-center gap-2 uppercase tracking-wider">
          <Sparkles size={16} /><MdText text={inhalt.texte.die5WesentlichenBemessungs} /></h4>
        <div className="grid sm:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">1</span><MdText text={inhalt.texte.vorzeichenkonventionNachDinEn} /></div>
            <p className="text-slate-600 text-[11px] leading-relaxed"><MdText text={inhalt.texte.imMassivbauIstDruckspannung} /></p>
          </div>
    
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">2</span><MdText text={inhalt.texte.zeitabhängigeVorspannkraftzustände} /></div>
            <p className="text-slate-600 text-[11px] leading-relaxed"><MdText text={inhalt.texte.esIstStetsZwischen} /></p>
          </div>
    
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">3</span><MdText text={inhalt.texte.dekompressionsnachweisGzg} /></div>
            <p className="text-slate-600 text-[11px] leading-relaxed"><MdText text={inhalt.texte.zumSchutzDerSpannglieder} /></p>
          </div>
    
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">4</span><MdText text={inhalt.texte.günstigeQuerkraftwirkungDerVorspannung} /></div>
            <p className="text-slate-600 text-[11px] leading-relaxed"><MdText text={inhalt.texte.geneigteSpanngliederErzeugenEine} /></p>
          </div>
    
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1 sm:col-span-2">
            <div className="font-bold text-amber-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-[10px] font-mono">5</span><MdText text={inhalt.texte.berücksichtigungDerElastischenUnd} /></div>
            <p className="text-amber-900 text-[11px] leading-relaxed"><MdText text={inhalt.texte.unterAlleinigemEigengewichtWölben} /></p>
          </div>
        </div>
      </div>
    
      {/* Interaktiver Wissens-Check */}
      <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
          <span className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
            <HelpCircle size={15} className="text-shiraz" /><MdText text={inhalt.texte.wissensprüfungGrundkonzepteDesSpannbeton} /></span>
          <span className="text-[10px] font-mono font-bold text-text-main/70 bg-white px-2 py-0.5 rounded border border-home-grau/20"><MdText text={inhalt.texte.t8FachfragenEc2} /></span>
        </div>
    
        {/* Frage 1 */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.frage1WarumKann} /></p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q1: 1 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q1 === 1
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.aErBesitztKeinen} /></button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q1: 2 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q1 === 2
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.bDieElastischeDehngrenze} /></button>
          </div>
          {quizAnswers.q1 === 2 && (
            <p className="text-[11px] text-emerald-700 font-medium"><MdText text={inhalt.texte.richtigDieZeitabhängigeBetonstauchung} /></p>
          )}
          {quizAnswers.q1 === 1 && (
            <p className="text-[11px] text-red-600 font-medium"><MdText text={inhalt.texte.nichtZutreffendDerPassivierungsschutz} /></p>
          )}
        </div>
    
        {/* Frage 2 */}
        <div className="space-y-2 pt-2 border-t border-home-grau/15">
          <p className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.frage2WelcherZustand} /></p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q2: 1 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q2 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.aDieVertikaleUmlenkkraft} /></button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q2: 2 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q2 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.bDieQuerkräfteAn} /></button>
          </div>
          {quizAnswers.q2 === 1 && (
            <p className="text-[11px] text-emerald-700 font-medium"><MdText text={inhalt.texte.richtigBeiVollständigemLastausgleich} /></p>
          )}
          {quizAnswers.q2 === 2 && (
            <p className="text-[11px] text-red-600 font-medium"><MdText text={inhalt.texte.falschDieUmlenkkraftEntlastet} /></p>
          )}
        </div>
    
        {/* Frage 3 */}
        <div className="space-y-2 pt-2 border-t border-home-grau/15">
          <p className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.frage3WelcheGröße} /></p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q3: 1 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q3 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.aSigmaCQp} /></button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q3: 2 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q3 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.bSigmaCP0} /></button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q3: 3 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q3 === 3
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.cFCtmMittlere} /></button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q3: 4 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q3 === 4
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.dSigmaPm0Zulässige} /></button>
          </div>
          {quizAnswers.q3 === 1 && (
            <p className="text-[11px] text-emerald-700 font-medium"><MdText text={inhalt.texte.richtigInGl5} /></p>
          )}
          {quizAnswers.q3 && quizAnswers.q3 !== 1 && (
            <p className="text-[11px] text-red-600 font-medium"><MdText text={inhalt.texte.falschFürDasKriechen} /></p>
          )}
        </div>
    
        {/* Frage 4 */}
        <div className="space-y-2 pt-2 border-t border-home-grau/15">
          <p className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.frage4WarumIst} /></p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q4: 1 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q4 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.aRückkopplungseffektDurchDen} /></button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q4: 2 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q4 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.bAlsPauschalerTeilsicherheitsbeiwert} /></button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q4: 3 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q4 === 3
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.cBerücksichtigungDerQuerdehnungszahl} /></button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q4: 4 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q4 === 4
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.dErhöhungDesVerlusts} /></button>
          </div>
          {quizAnswers.q4 === 1 && (
            <p className="text-[11px] text-emerald-700 font-medium"><MdText text={inhalt.texte.richtigDerNenner1} /></p>
          )}
          {quizAnswers.q4 && quizAnswers.q4 !== 1 && (
            <p className="text-[11px] text-red-600 font-medium"><MdText text={inhalt.texte.falschDerNennerIst} /></p>
          )}
        </div>
    
        {/* Frage 5 */}
        <div className="space-y-2 pt-2 border-t border-home-grau/15">
          <p className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.frage5AbWelcher} /></p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q5: 1 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q5 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              A) <InlineMath math="|\sigma_c| > 0{,}45 \cdot f_{ck}(t_0)" />
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q5: 2 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q5 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              B) <InlineMath math="|\sigma_c| > 0{,}60 \cdot f_{ck}" />
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q5: 3 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q5 === 3
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              C) <InlineMath math="|\sigma_c| > 0{,}85 \cdot f_{cd}" />
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q5: 4 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q5 === 4
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              D) <InlineMath math="|\sigma_c| > 1{,}00 \cdot f_{ctm}" />
            </button>
          </div>
          {quizAnswers.q5 === 1 && (
            <p className="text-[11px] text-emerald-700 font-medium"><MdText text={inhalt.texte.richtigNachEc23} /></p>
          )}
          {quizAnswers.q5 && quizAnswers.q5 !== 1 && (
            <p className="text-[11px] text-red-600 font-medium"><MdText text={inhalt.texte.falsch060F} /></p>
          )}
        </div>
    
        {/* Frage 6 */}
        <div className="space-y-2 pt-2 border-t border-home-grau/15">
          <p className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.frage6WasVersteht} /></p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q6: 1 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q6 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.aSpanngliedführungBeiStatisch} /></button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q6: 2 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q6 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.bEineReinZentrische} /></button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q6: 3 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q6 === 3
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.cEineSpanngliedführungMit} /></button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q6: 4 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q6 === 4
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.dParalleleFührungVon} /></button>
          </div>
          {quizAnswers.q6 === 1 && (
            <p className="text-[11px] text-emerald-700 font-medium"><MdText text={inhalt.texte.richtigBeiKonkordantenSpanngliedern} /></p>
          )}
          {quizAnswers.q6 && quizAnswers.q6 !== 1 && (
            <p className="text-[11px] text-red-600 font-medium"><MdText text={inhalt.texte.falschKonkordanzBeziehtSich} /></p>
          )}
        </div>
    
        {/* Frage 7 */}
        <div className="space-y-2 pt-2 border-t border-home-grau/15">
          <p className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.frage7WelcherPhysikalische} /></p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q7: 1 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q7 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.aDieReibungZwischen} /></button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q7: 2 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q7 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.bDieDruckfestigkeitDes} /></button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q7: 3 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q7 === 3
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.cDerThermischeAusdehnungskoeffizient} /></button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q7: 4 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q7 === 4
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.dDieHydratationswärmeDes} /></button>
          </div>
          {quizAnswers.q7 === 1 && (
            <p className="text-[11px] text-emerald-700 font-medium"><MdText text={inhalt.texte.richtigDieUmkehrDer} /></p>
          )}
          {quizAnswers.q7 && quizAnswers.q7 !== 1 && (
            <p className="text-[11px] text-red-600 font-medium"><MdText text={inhalt.texte.falschDieSchlupfeinflusslängeWird} /></p>
          )}
        </div>
    
        {/* Frage 8 */}
        <div className="space-y-2 pt-2 border-t border-home-grau/15">
          <p className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.frage8WarumIst} /></p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q8: 1 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q8 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.aHoheAnfälligkeitFür} /></button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q8: 2 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q8 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.bErNeigtBei} /></button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q8: 3 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q8 === 3
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.cFehlendeZinkbeschichtungFührt} /></button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q8: 4 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q8 === 4
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            ><MdText text={inhalt.texte.dErBesitztEine} /></button>
          </div>
          {quizAnswers.q8 === 1 && (
            <p className="text-[11px] text-emerald-700 font-medium"><MdText text={inhalt.texte.richtigVergüteteStähleZ} /></p>
          )}
          {quizAnswers.q8 && quizAnswers.q8 !== 1 && (
            <p className="text-[11px] text-red-600 font-medium"><MdText text={inhalt.texte.falschDieGefahrLiegt} /></p>
          )}
        </div>
      </div>
    
      {/* Übersicht und Weiterleitung in die Fachreiter (Helle Ausführung gemäß GEMINI.md) */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold text-shiraz uppercase tracking-wider font-mono"><MdText text={inhalt.texte.leitfadenAbgeschlossen100Wissensstand} /></span>
          <h4 className="text-lg md:text-xl font-bold text-text-main mt-1"><MdText text={inhalt.texte.werkzeugübersichtDieBerechnungsreiterDes} /></h4>
          <p className="text-xs md:text-sm text-text-main/80 mt-1 max-w-2xl leading-relaxed"><MdText text={inhalt.texte.nutzenSieDieSpezialisierten} /></p>
        </div>
    
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {onNavigateTab && (
            <>
              <button
                type="button"
                onClick={() => onNavigateTab('grundprinzipien')}
                className="p-4 bg-off-white hover:bg-slate-100 rounded-xl border border-home-grau/30 text-left transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <Compass className="text-shiraz mb-2" size={20} />
                  <span className="font-bold text-xs block text-text-main"><MdText text={inhalt.texte.t1Grundprinzipien} /></span>
                  <span className="text-[11px] text-text-main/70 mt-1 block"><MdText text={inhalt.texte.dehnungssimulatorEinfeldträgerVergleichT} /></span>
                </div>
                <span className="text-[10px] text-shiraz font-bold mt-3 flex items-center gap-1">
                  Öffnen <ArrowRight size={10} />
                </span>
              </button>
    
              <button
                type="button"
                onClick={() => onNavigateTab('kennwerte')}
                className="p-4 bg-off-white hover:bg-slate-100 rounded-xl border border-home-grau/30 text-left transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <BookOpen className="text-shiraz mb-2" size={20} />
                  <span className="font-bold text-xs block text-text-main"><MdText text={inhalt.texte.t2Baustoffkennwerte} /></span>
                  <span className="text-[11px] text-text-main/70 mt-1 block"><MdText text={inhalt.texte.kriechenSchwindenStahlrelaxationNach} /></span>
                </div>
                <span className="text-[10px] text-shiraz font-bold mt-3 flex items-center gap-1">
                  Öffnen <ArrowRight size={10} />
                </span>
              </button>
    
              <button
                type="button"
                onClick={() => onNavigateTab('rechner')}
                className="p-4 bg-off-white hover:bg-slate-100 rounded-xl border border-home-grau/30 text-left transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <Activity className="text-shiraz mb-2" size={20} />
                  <span className="font-bold text-xs block text-text-main"><MdText text={inhalt.texte.t3QuerschnittsRechner} /></span>
                  <span className="text-[11px] text-text-main/70 mt-1 block"><MdText text={inhalt.texte.spannungsdreieckeBewehrungsgradRissmomen} /></span>
                </div>
                <span className="text-[10px] text-shiraz font-bold mt-3 flex items-center gap-1">
                  Öffnen <ArrowRight size={10} />
                </span>
              </button>
    
              <button
                type="button"
                onClick={() => onNavigateTab('dauerhaftigkeit')}
                className="p-4 bg-off-white hover:bg-slate-100 rounded-xl border border-home-grau/30 text-left transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <ShieldCheck className="text-shiraz mb-2" size={20} />
                  <span className="font-bold text-xs block text-text-main"><MdText text={inhalt.texte.t4Dauerhaftigkeit} /></span>
                  <span className="text-[11px] text-text-main/70 mt-1 block"><MdText text={inhalt.texte.expositionsklassenBetondeckungKorrosions} /></span>
                </div>
                <span className="text-[10px] text-shiraz font-bold mt-3 flex items-center gap-1">
                  Öffnen <ArrowRight size={10} />
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    
      {/* Navigation */}
      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 flex justify-start items-center">
        <button
          type="button"
          onClick={() => setActiveStep(4)}
          className="px-3.5 py-2 bg-white text-text-main hover:bg-slate-100 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-home-grau/30 cursor-pointer"
        >
          <ArrowLeft size={14} /><MdText text={inhalt.texte.zurückZuKapitel5} /></button>
      </div>
    </div>
  );
}
