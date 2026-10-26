import { Compass, BookOpen, FileSpreadsheet, Layers, Factory, Percent, ClipboardCheck, Building, AlertTriangle, HelpCircle, Globe, Sparkles, Recycle } from 'lucide-react';
import LeitfadenEpdKonzepte from './LeitfadenEpdKonzepte';
import { FormulaText } from '@/src/components/ui/FormulaText';
import LeitfadenLcaBerechnung from './LeitfadenLcaBerechnung';
import LeitfadenDgnbQng from './LeitfadenDgnbQng';
import AnhangPraxisbeispiele from './AnhangPraxisbeispiele';
import AnhangChecklisten from './AnhangChecklisten';
import AnhangUebungen from './AnhangUebungen';
import AnhangDatenbanken from './AnhangDatenbanken';
import AnhangGlossarSoftware from './AnhangGlossarSoftware';
import type { Dispatch, SetStateAction } from 'react';
import inhalt from '@/content/nachhaltigkeit/Leitfaden.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface LeitfadenProps {
  activeEcoDb: "oekobaudat" | "dgnb" | "ibu" | "wecobis";
  activeStep: number;
  checklistState: Record<string, boolean>;
  setActiveEcoDb: Dispatch<SetStateAction<"oekobaudat" | "dgnb" | "ibu" | "wecobis">>;
  setActiveStep: Dispatch<SetStateAction<number>>;
  setChecklistState: Dispatch<SetStateAction<Record<string, boolean>>>;
}

export default function Leitfaden({ activeEcoDb, activeStep, checklistState, setActiveEcoDb, setActiveStep, setChecklistState }: LeitfadenProps) {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300">

        {/* Header Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-shiraz/10 border border-shiraz/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-shiraz self-start">
            <Compass size={12} className="text-shiraz" /><MdText text={inhalt.texte.akademischerWegweiser} /></span>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <BookOpen className="text-shiraz" size={24} /><MdText text={inhalt.texte.epdQngLeitfadenFür} /></h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p><MdText text={inhalt.texte.einePraxisbezogeneSchrittweiseAnleitung} /></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

          {/* Steps Left Interactive Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-2">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest pl-2 mb-1">
              Leitfaden-Schritte
            </span>
            {[
              { label: inhalt.werte.schritt1EpdKonzepte, sub: inhalt.werte.datenquellenEpdTypen, icon: FileSpreadsheet },
              { label: inhalt.werte.schritt2MengenDichten, sub: inhalt.werte.massenbilanzBim, icon: Layers },
              { label: inhalt.werte.schritt3Lebenszyklus, sub: inhalt.werte.dinEn15978Phasen, icon: Factory },
              { label: inhalt.werte.schritt4LcaBerechnung, sub: inhalt.werte.formelnFaktoren, icon: Percent },
              { label: inhalt.werte.schritt5DgnbQng, sub: inhalt.werte.förderungAuditierung, icon: ClipboardCheck },
              { label: inhalt.werte.anhang1Praxisbeispiele, sub: inhalt.werte.außenwandGebäude, icon: Building },
              { label: inhalt.werte.anhang2ChecklistenFehler, sub: inhalt.werte.präventionKontrollen, icon: AlertTriangle },
              { label: inhalt.werte.anhang3Übungsaufgaben, sub: inhalt.werte.klausurenLösungen, icon: HelpCircle },
              { label: inhalt.werte.anhang4ÖkoDatenbanken, sub: inhalt.werte.qngDgnbIbuCo, icon: Globe },
              { label: inhalt.werte.anhang5GlossarSoftware, sub: inhalt.werte.wichtigeBegriffeTools, icon: Compass }
            ].map((step, idx) => {
              const IconComp = step.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer select-none ${
                      activeStep === idx
                        ? 'border-shiraz bg-shiraz/5 shadow-xs'
                        : 'border-home-grau/30 bg-white hover:bg-slate-50'
                    }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                      activeStep === idx ? 'bg-shiraz text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                    <IconComp size={15} />
                  </div>
                  <div className="min-w-0">
                    <strong className={`text-[11px] block font-bold leading-tight ${activeStep === idx ? 'text-shiraz' : 'text-slate-800'}`}>
                      {step.label}
                    </strong>
                    <span className="text-[9px] text-slate-400 truncate block mt-0.5">{step.sub}</span>
                  </div>
                </button>
              )
            })}

            <div className="bg-emerald-50/30 p-4 border border-emerald-100/80 rounded-xl mt-4">
              <h4 className="text-[10px] uppercase font-bold text-emerald-900 tracking-wider flex items-center gap-1">
                <Sparkles size={11} className="text-emerald-700" />
                Prüfungsrelevant:
              </h4>
              <p className="text-[10px] text-emerald-800/80 mt-1.5 leading-relaxed"><MdText text={inhalt.texte.ökobilanzierungenSindKernbestandteilMode} /></p>
            </div>
          </div>

          {/* Stepper Details Right Panel (3-cols) */}
          <div className="lg:col-span-3 flex flex-col gap-6">

            {activeStep === 0 && <LeitfadenEpdKonzepte />}

            {activeStep === 1 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5 animate-in fade-in duration-200">
                <div className="border-b border-home-grau/25 pb-3">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest"><MdText text={inhalt.texte.schritt2Von5} /></span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1"><MdText text={inhalt.texte.mengenermittlungDichteabgleichBimKopplun} /></h3>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.epdWerteSindIn} /></p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/25 flex flex-col gap-2">
                    <strong className="text-xs font-bold text-slate-900 block uppercase tracking-wider">Massenermittlungs-Formel</strong>
                    <div className="bg-white p-3 rounded-lg border border-stone-200/60 flex justify-center items-center">
                      <FormulaText text="m = V \cdot \rho \quad \text{mit} \quad \mathrm{[kg] = [m^3] \cdot [kg/m^3]}" className="text-xs font-semibold text-shiraz" />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1"><MdText text={inhalt.texte.rohdichtenVariierenStarkJe} /></p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/25 flex flex-col gap-2">
                    <strong className="text-xs font-bold text-slate-900 block uppercase tracking-wider"><MdText text={inhalt.texte.kopplungMitDerBim} /></strong>
                    <p className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.inModernenPlanungsbürosUnd} /></p>
                  </div>
                </div>

                {/* References table to other modules */}
                <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wide">
                    <Compass size={14} className="text-emerald-700" /><MdText text={inhalt.texte.interdisziplinärerBezugZuAnderen} /></h4>

                  <div className="space-y-2.5 text-[11px]">
                    <div className="p-2.5 bg-white border border-stone-150 rounded-lg flex items-start gap-2.5">
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded shrink-0"><MdText text={inhalt.texte.bimBaustoffe} /></span>
                      <div><MdText text={inhalt.texte.attributeSchichtdatenSchaueIn} /></div>
                    </div>

                    <div className="p-2.5 bg-white border border-stone-150 rounded-lg flex items-start gap-2.5">
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded shrink-0">Materialdatenbanken</span>
                      <div><MdText text={inhalt.texte.ökobaudatMappingBietetDirekten} /></div>
                    </div>

                    <div className="p-2.5 bg-white border border-stone-150 rounded-lg flex items-start gap-2.5">
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded shrink-0">Baustoffkenngrößen</span>
                      <div><MdText text={inhalt.texte.dichtewertePorositätFindeDort} /></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5 animate-in fade-in duration-200">
                <div className="border-b border-home-grau/25 pb-3">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest"><MdText text={inhalt.texte.schritt3Von5} /></span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1"><MdText text={inhalt.texte.systemgrenzenLebenszyklusmoduleDinEn} /></h3>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.lebenszyklusberechnungenErfassenNichtNur} /></p>

                <div className="space-y-3 mt-1">
                  {inhalt.daten.Leitfaden.map((mod, m_idx) => (
                    <div key={m_idx} className="flex gap-4 p-3.5 bg-slate-50 border border-stone-150 rounded-xl hover:shadow-2xs transition-all">
                      <div className="w-16 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-inner overflow-hidden">
                        {mod.code}
                      </div>
                      <div>
                        <strong className="text-xs text-slate-900 block font-bold leading-tight">{mod.phase}</strong>
                        <p className="text-[11px] text-slate-600 leading-relaxed mt-1">{mod.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-indigo-50/50 p-4 border border-indigo-150 rounded-xl">
                  <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 uppercase">
                    <Recycle size={14} className="text-indigo-700" /><MdText text={inhalt.texte.schnittstelleZurKreislaufwirtschaftRückb} /></h4>
                  <p className="text-[11px] text-indigo-950 mt-1.5 leading-relaxed"><MdText text={inhalt.texte.spezielleBerechnungenFürDas} /></p>
                </div>
              </div>
            )}

            {activeStep === 3 && <LeitfadenLcaBerechnung />}

            {activeStep === 4 && <LeitfadenDgnbQng />}

            {activeStep === 5 && <AnhangPraxisbeispiele />}

            {activeStep === 6 && <AnhangChecklisten checklistState={checklistState} setChecklistState={setChecklistState} />}

            {activeStep === 7 && <AnhangUebungen />}

            {activeStep === 8 && <AnhangDatenbanken activeEcoDb={activeEcoDb} setActiveEcoDb={setActiveEcoDb} />}

            {activeStep === 9 && <AnhangGlossarSoftware />}

          </div>

        </div>

      </div>
    );
}
