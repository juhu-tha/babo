import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Activity,
  Layers,
  Compass,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Scale,
  Zap,
  TrendingDown,
  Info
} from 'lucide-react';
import { Station6Nachweise } from './nullbishundert/Station6Nachweise';
import { Station4LoadBalancing } from './nullbishundert/Station4LoadBalancing';
import { Station3Verfahren } from './nullbishundert/Station3Verfahren';
import { Station2Dilemma } from './nullbishundert/Station2Dilemma';
import inhalt from '@/content/spannbeton/SpannbetonNullBisHundert.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { stauchungsVerlust, lastausgleich } from '@/src/calc/spannbeton';

interface Props {
  onNavigateTab?: (tab: 'grundprinzipien' | 'kennwerte' | 'rechner' | 'dauerhaftigkeit') => void;
}

export default function SpannbetonNullBisHundert({ onNavigateTab }: Props) {
  // Current active lecture step (0 to 5)
  const [activeStep, setActiveStep] = useState<number>(0);

  // Interactive Mini-Demonstrator 1: B500 vs Y1860 Creep & Shrinkage Loss
  const [concreteStauchung, setConcreteStauchung] = useState<number>(1.2); // ‰ (Permille, typisch 0,8–1,5 ‰)

  // Interactive Mini-Demonstrator 2: Load Balancing (T.Y. Lin)
  const [beamLength, setBeamLength] = useState<number>(20); // Meter
  const [deadLoad, setDeadLoad] = useState<number>(25); // kN/m (z.B. Balken 0.5m x 1.0m)
  const [sagittaF, setSagittaF] = useState<number>(0.35); // m (Parabelstich)

  // Interactive Quiz State
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number | null }>({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null,
    q7: null,
    q8: null,
  });

  const steps = inhalt.daten["SpannbetonNullBisHundert.steps"];

  // Demonstrator 1 (B500 vs. Y1860) und Demonstrator 2 (Lastausgleich nach T. Y. Lin) im Rechenkern
  const verlust = stauchungsVerlust(concreteStauchung);
  const lossPercent_b500 = verlust.b500.verlustProzent;
  const remaining_b500 = verlust.b500.rest;
  const lossPercent_y1860 = verlust.y1860.verlustProzent;
  const remaining_y1860 = verlust.y1860.rest;

  const ausgleich = lastausgleich(beamLength, deadLoad, sagittaF);
  const requiredP_kN = ausgleich.P;
  const upwardLoad_u = ausgleich.u;
  const netMomentMidspan = ausgleich.mNetto;

  return (
    <div className="space-y-6">
      {/* Sachlicher Header & Einleitung (Gemäß GEMINI.md) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-md font-mono"><MdText text={inhalt.texte.didaktischerLeitfadenVon0} /></span>
            <h2 className="text-xl md:text-2xl font-bold text-text-main flex items-center gap-2.5 mt-1.5">
              <GraduationCap className="text-shiraz" size={24} /><MdText text={inhalt.texte.spannbetonbauSystematischeEinführungVon} /></h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-home-grau/20"><MdText text={inhalt.texte.eurocode2DinEn} /></span>
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p><MdText text={inhalt.texte.dieserLeitfadenVermitteltDie} /></p>
        </div>

        {/* Fortschritts-Indikator */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-main/70"><MdText text={inhalt.texte.aktuellerThemenbereich} /></span>
            <span className="font-mono font-bold text-shiraz bg-shiraz/10 px-2.5 py-1 rounded">
              {steps[activeStep].progress}
            </span>
            <span className="font-bold text-text-main">{steps[activeStep].title}</span>
          </div>
          <span className="text-text-main/60 font-mono text-[11px]">
            Lektion {activeStep + 1} von {steps.length}
          </span>
        </div>
      </div>

      {/* Interaktive Kapitel-Navigation */}
      <div className="bg-white p-4 rounded-2xl border border-home-grau/30 shadow-sm">
        <div className="text-xs font-bold text-text-main/70 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span><MdText text={inhalt.texte.themenübersichtKapitelauswahl} /></span>
          <span className="text-shiraz font-mono font-bold">{steps[activeStep].progress}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {steps.map((st) => {
            const isActive = activeStep === st.id;
            const isCompleted = activeStep > st.id;
            return (
              <button aria-pressed={isActive}
                key={st.id}
                type="button"
                onClick={() => setActiveStep(st.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : isCompleted
                    ? 'bg-off-white text-text-main border-emerald-300/70 hover:border-shiraz/50'
                    : 'bg-white text-text-main/80 border-home-grau/25 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {st.progress}
                  </span>
                  {isCompleted && !isActive && <CheckCircle2 size={13} className="text-emerald-600" />}
                </div>
                <div className="font-bold text-xs leading-snug line-clamp-2">{st.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Schritt-Inhalte */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-home-grau/30 shadow-sm space-y-8 animate-in fade-in duration-300">
        
        {/* ========================================================================= */}
        {/* STATION 1: 0% - 20% DAS GRUNDPRINZIP */}
        {/* ========================================================================= */}
        {activeStep === 0 && (
          <div className="space-y-6">
            <div className="border-b border-home-grau/20 pb-4">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.lektion1Von6} /></span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2"><MdText text={inhalt.texte.dasGrundprinzipDerVorspannung} /></h3>
              <p className="text-sm text-text-main/80 mt-1"><MdText text={inhalt.texte.wirkungsweiseKünstlichEingeprägterDruckü} /></p>
            </div>

            {/* Sachliche Problemstellung */}
            <div className="bg-off-white border-l-4 border-shiraz p-5 rounded-r-xl shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-shiraz shrink-0 mt-0.5 border border-home-grau/20">
                  <BookOpen size={20} />
                </div>
                <div className="text-sm text-text-main leading-relaxed space-y-2">
                  <p className="font-bold text-slate-900"><MdText text={inhalt.texte.mechanischeAusgangslageBaustoffgrenzen} /></p>
                  <p><MdText text={inhalt.texte.betonBesitztEineHohe} /></p>
                  <p><MdText text={inhalt.texte.imSchlaffBewehrtenStahlbeton} /></p>
                </div>
              </div>
            </div>

            {/* Physikalische Analogie & Wirkprinzip */}
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-3">
                <h4 className="font-bold text-sm text-shiraz flex items-center gap-2">
                  <Lightbulb size={16} /><MdText text={inhalt.texte.dasPhysikalischePrinzipNach} /></h4>
                <p className="text-xs text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.dasGrundprinzipDesSpannbetons} /></p>
                <p className="text-xs text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.wirdJedochVonBeiden} /></p>
                <div className="p-3 bg-white rounded-lg border border-home-grau/20 text-xs font-mono text-center text-slate-800">
                  <InlineMath math="\sigma_u = -\frac{P}{A} - \frac{P \cdot e_p}{W_u} + \frac{M}{W_u} \le 0 \quad (\text{Vollständige Drucküberdeckung am Unterrand})" />
                </div>
                <details className="text-xs text-text-main/85">
                  <summary className="cursor-pointer font-semibold text-shiraz"><MdText text={inhalt.texte.freyssinetLegendeTitel} /></summary>
                  <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
                    {inhalt.daten["SpannbetonNullBisHundert.freyssinetLegende"].map((z, i) => (
                      <React.Fragment key={i}>
                        <dt className="font-mono text-slate-800"><MdText text={z.symbol} /></dt>
                        <dd className="leading-relaxed"><MdText text={z.text} /></dd>
                      </React.Fragment>
                    ))}
                  </dl>
                  <p className="mt-2 text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.freyssinetLegendeHinweis} /></p>
                </details>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
                    <Scale size={15} className="text-shiraz" /><MdText text={inhalt.texte.systemvergleichImQuerschnitt} /></h5>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-900"><MdText text={inhalt.texte.t1UnbewehrterBetonZustand} /></div>
                      <div className="text-slate-600 mt-0.5"><MdText text={inhalt.texte.versagtSprödeUndOhne} /></div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-900"><MdText text={inhalt.texte.t2NormalerStahlbetonZustand} /></div>
                      <div className="text-slate-600 mt-0.5"><MdText text={inhalt.texte.tragfähigErfordertJedochPlanmäßige} /></div>
                    </div>
                    <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg">
                      <div className="font-bold text-emerald-900"><MdText text={inhalt.texte.t3SpannbetonDrucküberlagerung} /></div>
                      <div className="text-emerald-800 mt-0.5"><MdText text={inhalt.texte.derQuerschnittBleibtDurch} /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fazit */}
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-bold text-xs text-text-main flex items-center gap-1.5">
                  <Zap size={14} className="text-shiraz" /> Kernaussage:
                </span>
                <p className="text-xs text-text-main/80 mt-0.5"><MdText text={inhalt.texte.vorspannungIstDiePlanmäßige} /></p>
              </div>
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl flex items-center gap-2 shrink-0 transition-all shadow-sm cursor-pointer"
              ><MdText text={inhalt.texte.weiterZuKapitel2} /><ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 2: 20% - 40% DAS B500-DILEMMA */}
        {/* ========================================================================= */}
        {activeStep === 1 && (
          <>
          <EingabeHinweise hinweise={verlust.hinweise} />
          <Station2Dilemma concreteStauchung={concreteStauchung} setConcreteStauchung={setConcreteStauchung} lossPercent_b500={lossPercent_b500} remaining_b500={remaining_b500} lossPercent_y1860={lossPercent_y1860} remaining_y1860={remaining_y1860} onNavigateTab={onNavigateTab} setActiveStep={setActiveStep} />
          </>
        )}

        {/* ========================================================================= */}
        {/* STATION 3: 40% - 60% DIE 3 VORSPANNVERFAHREN */}
        {/* ========================================================================= */}
        {activeStep === 2 && (
          <Station3Verfahren setActiveStep={setActiveStep} />
        )}

        {/* ========================================================================= */}
        {/* STATION 4: 60% - 80% STATIK & LOAD BALANCING (T.Y. LIN) */}
        {/* ========================================================================= */}
        {activeStep === 3 && (
          <>
          <EingabeHinweise hinweise={ausgleich.hinweise} />
          <Station4LoadBalancing beamLength={beamLength} setBeamLength={setBeamLength} deadLoad={deadLoad} setDeadLoad={setDeadLoad} sagittaF={sagittaF} setSagittaF={setSagittaF} requiredP_kN={requiredP_kN} upwardLoad_u={upwardLoad_u} netMomentMidspan={netMomentMidspan} setActiveStep={setActiveStep} />
          </>
        )}

        {/* ========================================================================= */}
        {/* STATION 5: 80% - 95% STATISCH UNBESTIMMTE SYSTEME & ZWANGSMOMENTE */}
        {/* ========================================================================= */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-home-grau/20 pb-4">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.lektion5Von6} /></span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2"><MdText text={inhalt.texte.statischUnbestimmteSystemeZwangsmomente} /></h3>
              <p className="text-sm text-text-main/80 mt-1"><MdText text={inhalt.texte.schnittgrößenüberlagerungBeimDurchlauftr} /></p>
            </div>

            {/* Sachliche Einführung */}
            <div className="bg-off-white border-l-4 border-shiraz p-5 rounded-r-xl shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-shiraz shrink-0 mt-0.5 border border-home-grau/20">
                  <BookOpen size={20} />
                </div>
                <div className="text-sm text-text-main leading-relaxed space-y-2">
                  <p className="font-bold text-slate-900"><MdText text={inhalt.texte.schnittgrößenüberlagerungBeiStatischUnbe} /></p>
                  <p><MdText text={inhalt.texte.währendSichEinEinfeldträger} /></p>
                  <p><MdText text={inhalt.texte.dasAusDerVorspannung} /></p>
                </div>
              </div>
            </div>

            {/* Formel und Konkordanz */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-shiraz flex items-center gap-2">
                  <Zap size={16} /><MdText text={inhalt.texte.aufspaltungDerVorspannmomente} /></h4>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/25 font-mono text-center">
                  <BlockMath math="M_P = M_{P,1} + M_{P,2}" />
                </div>
                <div className="space-y-2 text-xs text-text-main/85 leading-relaxed">
                  <p><MdText text={inhalt.texte.t1IsostatischesPrimärmomentM} /><span className="font-mono block text-center py-1 text-slate-800">
                      <InlineMath math="M_{P,1} = -P \cdot e_p" />
                    </span>
                  </p>
                  <p><MdText text={inhalt.texte.t2HyperstatischesSekundärmomentM} /></p>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" /><MdText text={inhalt.texte.dasKonzeptDerKonkordanz} /></h4>
                <div className="text-xs text-slate-700 space-y-2.5 leading-relaxed">
                  <p><MdText text={inhalt.texte.einSpanngliedverlaufWirdAls} /></p>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 font-mono text-center font-bold">
                    <InlineMath math="M_{P,2} = 0 \iff M_P \equiv M_{P,1}" />
                  </div>
                  <p><MdText text={inhalt.texte.beiKonkordanterSpanngliedführungEntstehe} /></p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-3.5 py-2 bg-white text-text-main hover:bg-slate-100 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-home-grau/30 cursor-pointer"
              >
                <ArrowLeft size={14} /><MdText text={inhalt.texte.zurückZuKapitel4} /></button>
              <button
                type="button"
                onClick={() => setActiveStep(5)}
                className="px-4 py-2 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              ><MdText text={inhalt.texte.weiterZuKapitel6} /><ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 6: 95% - 100% EUROCODE 2 NACHWEISE & BEMESSUNGSREGELN */}
        {/* ========================================================================= */}
        {activeStep === 5 && (
          <Station6Nachweise setQuizAnswers={setQuizAnswers} quizAnswers={quizAnswers} onNavigateTab={onNavigateTab} setActiveStep={setActiveStep} />
        )}

      </div>
    </div>
  );
}
