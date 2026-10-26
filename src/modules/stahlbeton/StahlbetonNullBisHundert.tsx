import { MU_LIM_STAHL } from '@/src/calc/biegung';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { InlineMath } from 'react-katex';
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Activity,
  Layers,
  Sparkles,
  HelpCircle,
  Scale,
  Box,
  Scissors,
  Columns,
  CircleDashed,
  GitCommit
} from 'lucide-react';
import type { BemessungSubTab } from '../Stahlbetonbemessung';

import { betonAuswahl } from '@/src/data/kennwerte';
import inhalt from '@/content/stahlbeton/StahlbetonNullBisHundert.json';
import { MdText } from '@/src/components/inhalt/MdText';
interface Props {
  onNavigateTab?: (tab: BemessungSubTab) => void;
}

export default function StahlbetonNullBisHundert({ onNavigateTab }: Props) {
  // Aktiver Schritt (0 bis 5)
  const [activeStep, setActiveStep] = useState<number>(0);

  // Interaktiver Demonstrator 1: Baustoffkennwerte & Festigkeiten nach EC2
  const [selectedConcrete, setSelectedConcrete] = useState<string>('C30/37');

  // Interaktiver Demonstrator 2: Biegung nach dem mu-Verfahren
  const [calcMed, setCalcMed] = useState<number>(180); // kNm
  const [calcWidth, setCalcWidth] = useState<number>(30); // cm
  const [calcDepth, setCalcDepth] = useState<number>(55); // cm Nutzhöhe d

  // Wissens-Check Status
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number | null }>({
    q1: null,
    q2: null,
  });

  const steps = inhalt.daten["StahlbetonNullBisHundert.steps"];

  // Concrete classes database for demonstrator 1
  // Kennwerte nach EC2 Tab. 3.1 aus der zentralen Tabelle (src/data/kennwerte.ts)
  const CONCRETE_DATA: Record<string, { fck: number; fctm: number; Ecm: number }> = betonAuswahl(['C20/25', 'C25/30', 'C30/37', 'C35/45', 'C40/50', 'C50/60']);

  const currentConcrete = CONCRETE_DATA[selectedConcrete] || CONCRETE_DATA['C30/37'];
  const fcd = (0.85 * currentConcrete.fck) / 1.5; // N/mm2
  const fyd = 500 / 1.15; // 434.78 N/mm2

  // Calculation for Demonstrator 2: mu-Verfahren
  // mu = Med / (b * d^2 * fcd) with b in mm, d in mm, Med in Nmm
  const b_mm = calcWidth * 10;
  const d_mm = calcDepth * 10;
  const Med_Nmm = calcMed * 1e6;
  const mu_Eds = Med_Nmm / (b_mm * Math.pow(d_mm, 2) * fcd);
  
  // zeta = 0.5 * (1 + sqrt(1 - 2*mu))
  let zeta = 0.5 * (1 + Math.sqrt(Math.max(0, 1 - 2 * Math.min(0.48, mu_Eds))));
  if (mu_Eds > MU_LIM_STAHL) {
    zeta = 0.814; // Approximate limit before compressive reinforcement
  }
  const As_erf_cm2 = (Med_Nmm / (zeta * d_mm * fyd)) / 100;

  return (
    <div className="space-y-6">
      {/* Sachlicher Header & Einleitung (Gemäß GEMINI.md) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-md font-mono"><MdText text={inhalt.texte.didaktischerLeitfadenVon0} /></span>
            <h2 className="text-xl md:text-2xl font-bold text-text-main flex items-center gap-2.5 mt-1.5">
              <GraduationCap className="text-shiraz" size={24} /><MdText text={inhalt.texte.stahlbetonbauSystematischeEinführungVon} /></h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-home-grau/20"><MdText text={inhalt.texte.eurocode2DinEn} /></span>
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p><MdText text={inhalt.texte.dieserModulareLeitfadenVermittelt} /></p>
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

      {/* Lektionsinhalte */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-home-grau/30 shadow-sm space-y-8 animate-in fade-in duration-300">
        
        {/* ========================================================================= */}
        {/* LEKTION 1: DAS VERBUNDPRINZIP */}
        {/* ========================================================================= */}
        {activeStep === 0 && (
          <div className="space-y-6">
            <div className="border-b border-home-grau/20 pb-4">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.lektion1Von6} /></span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2"><MdText text={inhalt.texte.dasVerbundprinzipVonStahl} /></h3>
              <p className="text-sm text-text-main/80 mt-1"><MdText text={inhalt.texte.warumZweiVölligUnterschiedliche} /></p>
            </div>

            {/* Sachliche Einführung */}
            <div className="bg-off-white border-l-4 border-shiraz p-5 rounded-r-xl shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-shiraz shrink-0 mt-0.5 border border-home-grau/20">
                  <BookOpen size={20} />
                </div>
                <div className="text-sm text-text-main leading-relaxed space-y-2">
                  <p className="font-bold text-slate-900"><MdText text={inhalt.texte.mechanischeKomplementaritätDerBeiden} /></p>
                  <p><MdText text={inhalt.texte.betonIstDruckfestAber} /></p>
                  <p><MdText text={inhalt.texte.imVerbundwerkstoffStahlbetonBettet} /></p>
                </div>
              </div>
            </div>

            {/* Die 3 physikalischen Voraussetzungen */}
            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded"><MdText text={inhalt.texte.physikalischerGlücksfall} /></span>
                  <span className="text-xs font-bold text-shiraz">Faktor 1</span>
                </div>
                <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.thermischeDehnkompatibilität} /></h4>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.betonUndStahlBesitzen} /></p>
                <div className="p-2.5 bg-off-white rounded-lg border border-home-grau/20 font-mono text-center text-xs text-slate-800">
                  <InlineMath math="\alpha_T \approx 10 \cdot 10^{-6}\,\text{K}^{-1}" />
                </div>
                <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.beiTemperaturänderungenSommerWinter} /></p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Bauchemie
                  </span>
                  <span className="text-xs font-bold text-shiraz">Faktor 2</span>
                </div>
                <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.alkalischerKorrosionsschutz} /></h4>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dasPorenwasserDesErhärteten} /></p>
                <div className="p-2.5 bg-off-white rounded-lg border border-home-grau/20 font-mono text-center text-xs text-emerald-800 font-bold">
                  <InlineMath math="\text{pH-Wert} \ge 12{,}5" />
                </div>
                <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.inDiesemMilieuBildet} /></p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Mechanik
                  </span>
                  <span className="text-xs font-bold text-shiraz">Faktor 3</span>
                </div>
                <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.formschlüssigerRippenverbund} /></h4>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.modernerBetonstahlB500aB} /></p>
                <div className="p-2.5 bg-off-white rounded-lg border border-home-grau/20 font-mono text-center text-xs text-blue-900 font-bold">
                  <InlineMath math="f_{bd} = 2{,}25 \cdot \eta_1 \cdot \eta_2 \cdot f_{ctd}" />
                </div>
                <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.kräfteWerdenNichtNur} /></p>
              </div>
            </div>

            {/* Navigation */}
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 flex justify-between items-center">
              <span className="text-xs text-text-main/70 font-medium"><MdText text={inhalt.texte.alsNächstesDieNormativen} /></span>
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              ><MdText text={inhalt.texte.weiterZuKapitel2} /><ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LEKTION 2: WERKSTOFFGESETZE NACH EC2 */}
        {/* ========================================================================= */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-home-grau/20 pb-4">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.lektion2Von6} /></span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2"><MdText text={inhalt.texte.werkstoffgesetzeNachEurocode2} /></h3>
              <p className="text-sm text-text-main/80 mt-1"><MdText text={inhalt.texte.dasParabelRechteckDiagramm} /></p>
            </div>

            {/* Sachliche Einführung */}
            <div className="bg-off-white border-l-4 border-shiraz p-5 rounded-r-xl shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-shiraz shrink-0 mt-0.5 border border-home-grau/20">
                  <BookOpen size={20} />
                </div>
                <div className="text-sm text-text-main leading-relaxed space-y-2">
                  <p className="font-bold text-slate-900"><MdText text={inhalt.texte.sicherheitskonzeptBemessungswerte} /></p>
                  <p><MdText text={inhalt.texte.eurocode2ArbeitetIm} /></p>
                  <div className="grid sm:grid-cols-2 gap-3 pt-1">
                    <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 font-mono text-xs">
                      <strong>Beton:</strong> <InlineMath math="f_{cd} = \alpha_{cc} \cdot \frac{f_{ck}}{\gamma_C} = 0{,}85 \cdot \frac{f_{ck}}{1{,}5}" />
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 font-mono text-xs">
                      <strong>Stahl:</strong> <InlineMath math="f_{yd} = \frac{f_{yk}}{\gamma_S} = \frac{500}{1{,}15} \approx 435\,\text{N/mm}^2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Die beiden Diagramme im Detail */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-text-main flex items-center justify-between">
                  <span><MdText text={inhalt.texte.betonParabelRechteckEc2} /></span>
                  <span className="text-xs font-mono text-shiraz font-bold"><MdText text={inhalt.texte.c220} /></span>
                </h4>
                <div className="space-y-2 text-xs text-text-main/80 leading-relaxed">
                  <p><MdText text={inhalt.texte.fürNormalbetonBisC50} /></p>
                  <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 font-mono text-center">
                    <InlineMath math="\sigma_c = f_{cd} \cdot \left[1 - \left(1 - \frac{|\varepsilon_c|}{2{,}0}\right)^2\right] \quad (0 \le |\varepsilon_c| \le 2{,}0\,\char8240)" />
                  </div>
                  <p className="text-[11px] text-slate-500"><MdText text={inhalt.texte.fürDieHandberechnungDarf} /></p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-text-main flex items-center justify-between">
                  <span><MdText text={inhalt.texte.betonstahlB500Ec23} /></span>
                  <span className="text-xs font-mono text-shiraz font-bold"><MdText text={inhalt.texte.yd2175} /></span>
                </h4>
                <div className="space-y-2 text-xs text-text-main/80 leading-relaxed">
                  <p><MdText text={inhalt.texte.betonstahlB500WeistEin} /></p>
                  <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 font-mono text-center">
                    <InlineMath math="\varepsilon_{yd} = \frac{f_{yd}}{E_s} = \frac{435}{200\,000} \approx 2{,}175\,\char8240" />
                  </div>
                  <p className="text-[11px] text-slate-500"><MdText text={inhalt.texte.beiDehnungenVarepsilonS} /></p>
                </div>
              </div>
            </div>

            {/* Interaktiver Festigkeits-Vergleicher */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={15} /><MdText text={inhalt.texte.interaktiverKennwerteVergleichNach} /></span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  Ausgewählt: <strong className="text-shiraz">{selectedConcrete}</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main/70 mb-1.5"><MdText text={inhalt.texte.betonfestigkeitsklasseWählen} /></label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {Object.keys(CONCRETE_DATA).map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setSelectedConcrete(cls)}
                      className={`p-2 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                        selectedConcrete === cls
                          ? 'bg-shiraz text-white border-shiraz shadow-xs'
                          : 'bg-off-white text-text-main border-home-grau/30 hover:bg-slate-100'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase font-bold block"><MdText text={inhalt.texte.charaktDruckfestigkeit} /></span>
                  <span className="text-lg font-mono font-black text-slate-900">{formatDeWert(currentConcrete.fck)} N/mm²</span>
                  <span className="text-[10px] text-slate-500 block font-mono"><MdText text={inhalt.texte.fCkZylinder} /></span>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase font-bold block">Bemessungsfestigkeit</span>
                  <span className="text-lg font-mono font-black text-shiraz">{formatDeZahl(fcd, 2)} N/mm²</span>
                  <span className="text-[10px] text-shiraz/80 block font-mono"><MdText text={inhalt.texte.fCd085} /></span>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase font-bold block"><MdText text={inhalt.texte.mittlereZugfestigkeit} /></span>
                  <span className="text-lg font-mono font-black text-slate-900">{formatDeWert(currentConcrete.fctm)} N/mm²</span>
                  <span className="text-[10px] text-slate-500 block font-mono"><MdText text={inhalt.texte.fCtm030} /></span>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase font-bold block">Elastizitätsmodul</span>
                  <span className="text-lg font-mono font-black text-emerald-700">{formatDeZahl((currentConcrete.Ecm / 1000), 0)} kN/mm²</span>
                  <span className="text-[10px] text-emerald-600 block font-mono"><MdText text={inhalt.texte.eCmSekantenmodul} /></span>
                </div>
              </div>
            </div>

            {/* Navigation & Link in Reiter 1 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-text-main/80"><MdText text={inhalt.texte.imUnterrechner1Spannung} /></div>
              <div className="flex gap-2">
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('spannung')}
                    className="px-3.5 py-2 bg-white text-shiraz border border-shiraz/40 hover:bg-shiraz/10 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Activity size={13} /><MdText text={inhalt.texte.zuSpannungDehnung} /></button>
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
        )}

        {/* ========================================================================= */}
        {/* LEKTION 3: BIEGEBEMESSUNG IM GZT (mu-VERFAHREN) */}
        {/* ========================================================================= */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-home-grau/20 pb-4">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.lektion3Von6} /></span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2"><MdText text={inhalt.texte.biegebemessungImGztDas} /></h3>
              <p className="text-sm text-text-main/80 mt-1"><MdText text={inhalt.texte.ebenbleibenDerQuerschnitteBernoulli} /></p>
            </div>

            {/* Sachliche Einführung */}
            <div className="bg-off-white border-l-4 border-shiraz p-5 rounded-r-xl shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-shiraz shrink-0 mt-0.5 border border-home-grau/20">
                  <BookOpen size={20} />
                </div>
                <div className="text-sm text-text-main leading-relaxed space-y-2">
                  <p className="font-bold text-slate-900"><MdText text={inhalt.texte.dasInnereKräftepaarBei} /></p>
                  <p><MdText text={inhalt.texte.einBiegemomentMEd} /></p>
                  <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 font-mono text-center text-xs text-slate-800">
                    <InlineMath math="M_{Ed} = F_{cd} \cdot z = F_{sd} \cdot z \quad \text{mit innerem Hebelarm } z = \zeta \cdot d" />
                  </div>
                  <p><MdText text={inhalt.texte.dasBewährteDimensionsloseMomentenbeiwert} /></p>
                </div>
              </div>
            </div>

            {/* Formeln und Grenzwerte */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-shiraz flex items-center gap-2">
                  <Box size={16} /><MdText text={inhalt.texte.schrittweiseBemessungsgleichungen} /></h4>
                <div className="space-y-2 text-xs text-text-main/85 leading-relaxed">
                  <div><MdText text={inhalt.texte.t1BezogenesBemessungsmoment} /><div className="p-2 bg-off-white rounded font-mono text-center my-1">
                      <InlineMath math="\mu_{Eds} = \frac{M_{Eds}}{b \cdot d^2 \cdot f_{cd}}" />
                    </div>
                  </div>
                  <div><MdText text={inhalt.texte.t2BezogenerInnererHebelarm} /><div className="p-2 bg-off-white rounded font-mono text-center my-1">
                      <InlineMath math="\zeta = 0{,}5 \cdot \left(1 + \sqrt{1 - 2 \cdot \mu_{Eds}}\right)" />
                    </div>
                  </div>
                  <div><MdText text={inhalt.texte.t3ErforderlicheZugbewehrung} /><div className="p-2 bg-off-white rounded font-mono text-center my-1 text-shiraz font-bold">
                      <InlineMath math="A_{s,erf} = \frac{M_{Eds}}{\zeta \cdot d \cdot f_{yd}}" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Scale size={16} className="text-shiraz" /><MdText text={inhalt.texte.grenzwerteDuktilität} /></h4>
                <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
                  <p><MdText text={inhalt.texte.einfacheBewehrungMuEds} /></p>
                  <p><MdText text={inhalt.texte.druckbewehrungErforderlichMuEds} /></p>
                  <p className="text-[11px] text-slate-500 italic"><MdText text={inhalt.texte.tippNachDinEn} /></p>
                </div>
              </div>
            </div>

            {/* Interaktiver Biegebemessungs-Rechner */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={15} /><MdText text={inhalt.texte.interaktiverSchnelldemonstratorRechteckB} /></span>
                <span className="text-xs font-mono font-bold text-slate-700"><MdText text={inhalt.texte.betonC3037F} /></span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-main/70 mb-1 flex justify-between">
                    <span><MdText text={inhalt.texte.bemessungsmomentMEd} /></span>
                    <span className="font-mono text-shiraz font-bold">{formatDeWert(calcMed)} kNm</span>
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={500}
                    step={10}
                    value={calcMed}
                    onChange={(e) => setCalcMed(Number(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-main/70 mb-1 flex justify-between">
                    <span><MdText text={inhalt.texte.balkenbreiteB} /></span>
                    <span className="font-mono text-shiraz font-bold">{formatDeWert(calcWidth)} cm</span>
                  </label>
                  <input
                    type="range"
                    min={20}
                    max={60}
                    step={5}
                    value={calcWidth}
                    onChange={(e) => setCalcWidth(Number(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-main/70 mb-1 flex justify-between">
                    <span><MdText text={inhalt.texte.nutzhöheD} /></span>
                    <span className="font-mono text-shiraz font-bold">{formatDeWert(calcDepth)} cm</span>
                  </label>
                  <input
                    type="range"
                    min={30}
                    max={90}
                    step={5}
                    value={calcDepth}
                    onChange={(e) => setCalcDepth(Number(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                </div>
              </div>

              {/* Ergebnis-Karten */}
              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase font-bold block"><MdText text={inhalt.texte.beiwertEds} /></span>
                  <span className="text-lg font-mono font-black text-slate-900">{formatDeZahl(mu_Eds, 3)}</span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    {mu_Eds <= MU_LIM_STAHL ? inhalt.werte.einfachBewehrt : inhalt.werte.druckbewehrungNötig}
                  </span>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase font-bold block"><MdText text={inhalt.texte.hebelarmFaktor} /></span>
                  <span className="text-lg font-mono font-black text-slate-900">{formatDeZahl(zeta, 3)}</span>
                  <span className="text-[10px] text-slate-500 block font-mono">z = {formatDeZahl((zeta * calcDepth), 1)} cm</span>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase font-bold block"><MdText text={inhalt.texte.erforderlicheBewehrung} /></span>
                  <span className="text-lg font-mono font-black text-shiraz">{formatDeZahl(As_erf_cm2, 2)} cm²</span>
                  <span className="text-[10px] text-shiraz/80 block font-mono">
                    z. B. {formatDeWert(Math.ceil(As_erf_cm2 / 2.01))}<MdText text={inhalt.texte.t16MmStäbe} /></span>
                </div>
              </div>
            </div>

            {/* Navigation & Link in Reiter 2 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-text-main/80"><MdText text={inhalt.texte.imUnterrechner2Biegebemessung} /></div>
              <div className="flex gap-2">
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('biegebemessung')}
                    className="px-3.5 py-2 bg-white text-shiraz border border-shiraz/40 hover:bg-shiraz/10 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Box size={13} /><MdText text={inhalt.texte.zurBiegebemessung} /></button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                ><MdText text={inhalt.texte.weiterZuKapitel4} /><ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LEKTION 4: QUERKRAFT & FACHWERKMODELL */}
        {/* ========================================================================= */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-home-grau/20 pb-4">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.lektion4Von6} /></span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2"><MdText text={inhalt.texte.querkraftbemessungDasFachwerkmodellNach} /></h3>
              <p className="text-sm text-text-main/80 mt-1"><MdText text={inhalt.texte.nachweisführungFürBauteileOhne} /></p>
            </div>

            {/* Sachliche Einführung */}
            <div className="bg-off-white border-l-4 border-shiraz p-5 rounded-r-xl shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-shiraz shrink-0 mt-0.5 border border-home-grau/20">
                  <BookOpen size={20} />
                </div>
                <div className="text-sm text-text-main leading-relaxed space-y-2">
                  <p className="font-bold text-slate-900"><MdText text={inhalt.texte.schubspannungenSchrägrisse} /></p>
                  <p><MdText text={inhalt.texte.querkräfteErzeugenImTrägersteg} /></p>
                  <p><MdText text={inhalt.texte.dinEn19921} /></p>
                </div>
              </div>
            </div>

            {/* Die beiden Modelle */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-shiraz flex items-center justify-between">
                  <span><MdText text={inhalt.texte.t1OhneQuerkraftbewehrungVrd} /></span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-700"><MdText text={inhalt.texte.plattenDecken} /></span>
                </h4>
                <div className="space-y-2 text-xs text-text-main/85 leading-relaxed">
                  <p><MdText text={inhalt.texte.dieTragfähigkeitVRd} /></p>
                  <div className="p-2.5 bg-off-white rounded font-mono text-center">
                    <InlineMath math="V_{Rd,c} = \left[C_{Rd,c} \cdot k \cdot (100 \cdot \rho_l \cdot f_{ck})^{1/3}\right] b_w \cdot d" />
                  </div>
                  <div className="p-2 bg-white rounded border border-home-grau/20 space-y-1 text-[11px]">
                    <div><MdText text={inhalt.texte.maßstabsbeiwertK1Sqrt} /></div>
                    <div><MdText text={inhalt.texte.längsbewehrungsgradRhoLA} /></div>
                    <div><MdText text={inhalt.texte.mindestwertVRdC} /></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-shiraz flex items-center justify-between">
                  <span><MdText text={inhalt.texte.t2FachwerkmodellMitVariablem} /></span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-700"><MdText text={inhalt.texte.balkenTräger} /></span>
                </h4>
                <div className="space-y-2 text-xs text-text-main/85 leading-relaxed">
                  <p><MdText text={inhalt.texte.dasTragmodellBestehtAus} /></p>
                  <div className="p-2.5 bg-off-white rounded font-mono text-center">
                    <InlineMath math="V_{Rd,s} = \frac{A_{sw}}{s} \cdot z \cdot f_{ywd} \cdot \cot \theta" />
                  </div>
                  <div className="p-2 bg-white rounded border border-home-grau/20 space-y-1 text-[11px]">
                    <div><MdText text={inhalt.texte.druckstrebenwinkel10Le} /></div>
                    <div><MdText text={inhalt.texte.betondruckstrebennachweisVEdLe} /></div>
                    <div><MdText text={inhalt.texte.versatzmaßZugkraftdeckungslinieUmA} /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation & Link in Reiter 3 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-text-main/80"><MdText text={inhalt.texte.imUnterrechner3Querkraftbemessung} /></div>
              <div className="flex gap-2">
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('querkraftbemessung')}
                    className="px-3.5 py-2 bg-white text-shiraz border border-shiraz/40 hover:bg-shiraz/10 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Scissors size={13} /><MdText text={inhalt.texte.zurQuerkraftbemessung} /></button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="px-4 py-2 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                ><MdText text={inhalt.texte.weiterZuKapitel5} /><ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LEKTION 5: STÜTZEN, DURCHSTANZEN & VERANKERUNG */}
        {/* ========================================================================= */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-home-grau/20 pb-4">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.lektion5Von6} /></span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2"><MdText text={inhalt.texte.sondernachweiseStützenknickenDurchstanze} /></h3>
              <p className="text-sm text-text-main/80 mt-1"><MdText text={inhalt.texte.theorieIiOrdnungBei} /></p>
            </div>

            {/* 3 Sonder-Themen */}
            <div className="grid md:grid-cols-3 gap-5">
              {/* Stützen */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded"><MdText text={inhalt.texte.ec2Kap58} /></span>
                    <Columns size={16} className="text-shiraz" />
                  </div>
                  <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.t1StützenNachTheorie} /></h4>
                  <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
                    <p><MdText text={inhalt.texte.schlankeDruckgliederKnickenAus} /></p>
                    <p><MdText text={inhalt.texte.dasGesamtmomentSetztSich} /></p>
                    <div className="p-2 bg-off-white rounded font-mono text-center text-[11px]">
                      <InlineMath math="M_{Ed} = M_{0Ed} + N_{Ed} \cdot e_2" />
                    </div>
                    <p className="text-[11px] text-slate-500"><MdText text={inhalt.texte.zusatzexzentrizitätE2Berücksichtigt} /></p>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-home-grau/20 text-[11px] text-slate-700"><MdText text={inhalt.texte.typischeAnwendungGeschossstützenHallenst} /></div>
              </div>

              {/* Durchstanzen */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded"><MdText text={inhalt.texte.ec2Kap64} /></span>
                    <CircleDashed size={16} className="text-shiraz" />
                  </div>
                  <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.t2DurchstanzenAnFlachdecken} /></h4>
                  <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
                    <p><MdText text={inhalt.texte.anStützenköpfenPunktgestützterPlatten} /></p>
                    <p><MdText text={inhalt.texte.derNachweisErfolgtIm} /></p>
                    <div className="p-2 bg-off-white rounded font-mono text-center text-[11px]">
                      <InlineMath math="v_{Ed} = \beta \cdot \frac{V_{Ed}}{u_1 \cdot d} \le v_{Rd,c}" />
                    </div>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-home-grau/20 text-[11px] text-slate-700"><MdText text={inhalt.texte.lösungBeiÜberlastungDurchstanzbewehrung} /></div>
              </div>

              {/* Verankerung */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded"><MdText text={inhalt.texte.ec2Kap84} /></span>
                    <GitCommit size={16} className="text-shiraz" />
                  </div>
                  <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.t3VerankerungslängeVonStäben} /></h4>
                  <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
                    <p><MdText text={inhalt.texte.umDieVolleStahlkraft} /></p>
                    <div className="p-2 bg-off-white rounded font-mono text-center text-[11px]">
                      <InlineMath math="l_{b,rqd} = \frac{\phi}{4} \cdot \frac{\sigma_{sd}}{f_{bd}}" />
                    </div>
                    <p className="text-[11px] text-slate-600"><MdText text={inhalt.texte.unterscheidungNachVerbundbereichenGute} /></p>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-home-grau/20 text-[11px] text-slate-700"><MdText text={inhalt.texte.formgebungGeradeEndenHaken} /></div>
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
        {/* LEKTION 6: GEBRAUCHSTAUGLICHKEIT & BEMESSUNGSREGELN */}
        {/* ========================================================================= */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-home-grau/20 pb-4">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.lektion6Von6} /></span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2"><MdText text={inhalt.texte.gebrauchstauglichkeitGzg5Kernregeln} /></h3>
              <p className="text-sm text-text-main/80 mt-1"><MdText text={inhalt.texte.rissbreitenbegrenzungNachEc2Kap} /></p>
            </div>

            {/* Die 5 Kernregeln */}
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-shiraz flex items-center gap-2 uppercase tracking-wider">
                <Sparkles size={16} /><MdText text={inhalt.texte.die5FundamentalenStahlbeton} /></h4>
              <div className="grid sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">1</span><MdText text={inhalt.texte.zustandIiIstDer} /></div>
                  <p className="text-slate-600 text-[11px] leading-relaxed"><MdText text={inhalt.texte.stahlbetonFunktioniertImGrenzzustand} /></p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">2</span><MdText text={inhalt.texte.duktilitätGehtVorTraglastüberhöhung} /></div>
                  <p className="text-slate-600 text-[11px] leading-relaxed"><MdText text={inhalt.texte.überbewehrteQuerschnitteMuEds} /></p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">3</span><MdText text={inhalt.texte.mindestbewehrungFürZwangskräfte} /></div>
                  <p className="text-slate-600 text-[11px] leading-relaxed"><MdText text={inhalt.texte.beimErhärtenHydratationswärmeBehindern} /></p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">4</span><MdText text={inhalt.texte.maßstabseffektBeiSchub} /></div>
                  <p className="text-slate-600 text-[11px] leading-relaxed"><MdText text={inhalt.texte.dickereBauteileOhneQuerkraftbewehrung} /></p>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1 sm:col-span-2">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-[10px] font-mono">5</span><MdText text={inhalt.texte.zugkraftdeckungVerankerungsversatz} /></div>
                  <p className="text-amber-900 text-[11px] leading-relaxed"><MdText text={inhalt.texte.infolgeDerFachwerkwirkungBei} /></p>
                </div>
              </div>
            </div>

            {/* Interaktiver Wissens-Check */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
                <span className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle size={15} className="text-shiraz" /><MdText text={inhalt.texte.wissensprüfungStahlbetonbauGrundlagen} /></span>
                <span className="text-[10px] font-mono font-bold text-text-main/70 bg-white px-2 py-0.5 rounded border border-home-grau/20"><MdText text={inhalt.texte.t2Kontrollfragen} /></span>
              </div>

              {/* Frage 1 */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.frage1WarumIst} /></p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q1: 1 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q1 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  ><MdText text={inhalt.texte.aWeilSichBei} /></button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q1: 2 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q1 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  ><MdText text={inhalt.texte.bWeilDadurchDer} /></button>
                </div>
                {quizAnswers.q1 === 1 && (
                  <p className="text-[11px] text-emerald-700 font-medium"><MdText text={inhalt.texte.vollkommenRichtigWärenDie} /></p>
                )}
                {quizAnswers.q1 === 2 && (
                  <p className="text-[11px] text-red-600 font-medium"><MdText text={inhalt.texte.nichtZutreffendDerBrandschutz} /></p>
                )}
              </div>

              {/* Frage 2 */}
              <div className="space-y-2 pt-2 border-t border-home-grau/15">
                <p className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.frage2WasBeschreibt} /></p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q2: 1 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q2 === 1
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  ><MdText text={inhalt.texte.aDenHorizontalenAbstand} /></button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q2: 2 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q2 === 2
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  ><MdText text={inhalt.texte.bDieVerschiebungDer} /></button>
                </div>
                {quizAnswers.q2 === 2 && (
                  <p className="text-[11px] text-emerald-700 font-medium"><MdText text={inhalt.texte.exaktDieGeneigtenBetondruckstreben} /></p>
                )}
              </div>
            </div>

            {/* Übersicht und Weiterleitung in alle Fachreiter */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
              <div>
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider font-mono"><MdText text={inhalt.texte.leitfadenAbgeschlossen100Wissensstand} /></span>
                <h4 className="text-lg md:text-xl font-bold text-text-main mt-1"><MdText text={inhalt.texte.werkzeugübersichtAlleBerechnungsmoduleVo} /></h4>
                <p className="text-xs md:text-sm text-text-main/80 mt-1 max-w-2xl leading-relaxed"><MdText text={inhalt.texte.nutzenSieDieSpezialisierten} /></p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {onNavigateTab && (
                  <>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('spannung')}
                      className="p-3.5 bg-off-white hover:bg-slate-100 rounded-xl border border-home-grau/30 text-left transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <Activity className="text-shiraz mb-2" size={18} />
                        <span className="font-bold text-xs block text-text-main"><MdText text={inhalt.texte.t1SpannungDehnung} /></span>
                        <span className="text-[11px] text-text-main/70 mt-1 block"><MdText text={inhalt.texte.parabelRechteckB500Werkstofflinien} /></span>
                      </div>
                      <span className="text-[10px] text-shiraz font-bold mt-2 flex items-center gap-1">
                        Öffnen <ArrowRight size={10} />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigateTab('biegebemessung')}
                      className="p-3.5 bg-off-white hover:bg-slate-100 rounded-xl border border-home-grau/30 text-left transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <Box className="text-shiraz mb-2" size={18} />
                        <span className="font-bold text-xs block text-text-main"><MdText text={inhalt.texte.t2Biegebemessung} /></span>
                        <span className="text-[11px] text-text-main/70 mt-1 block"><MdText text={inhalt.texte.rechteckquerschnitteNachDemVerfahren} /></span>
                      </div>
                      <span className="text-[10px] text-shiraz font-bold mt-2 flex items-center gap-1">
                        Öffnen <ArrowRight size={10} />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigateTab('querkraftbemessung')}
                      className="p-3.5 bg-off-white hover:bg-slate-100 rounded-xl border border-home-grau/30 text-left transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <Scissors className="text-shiraz mb-2" size={18} />
                        <span className="font-bold text-xs block text-text-main"><MdText text={inhalt.texte.t3Querkraftbemessung} /></span>
                        <span className="text-[11px] text-text-main/70 mt-1 block"><MdText text={inhalt.texte.vrdCOhneSchubbewehrung} /></span>
                      </div>
                      <span className="text-[10px] text-shiraz font-bold mt-2 flex items-center gap-1">
                        Öffnen <ArrowRight size={10} />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigateTab('stuetzenbemessung')}
                      className="p-3.5 bg-off-white hover:bg-slate-100 rounded-xl border border-home-grau/30 text-left transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <Columns className="text-shiraz mb-2" size={18} />
                        <span className="font-bold text-xs block text-text-main"><MdText text={inhalt.texte.t4Stützenbemessung} /></span>
                        <span className="text-[11px] text-text-main/70 mt-1 block"><MdText text={inhalt.texte.schlankheitKnickenTheorieIi} /></span>
                      </div>
                      <span className="text-[10px] text-shiraz font-bold mt-2 flex items-center gap-1">
                        Öffnen <ArrowRight size={10} />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigateTab('durchstanzen')}
                      className="p-3.5 bg-off-white hover:bg-slate-100 rounded-xl border border-home-grau/30 text-left transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <CircleDashed className="text-shiraz mb-2" size={18} />
                        <span className="font-bold text-xs block text-text-main"><MdText text={inhalt.texte.t5Durchstanzen} /></span>
                        <span className="text-[11px] text-text-main/70 mt-1 block"><MdText text={inhalt.texte.kritischerRundschnittAnFlachdeckenstütze} /></span>
                      </div>
                      <span className="text-[10px] text-shiraz font-bold mt-2 flex items-center gap-1">
                        Öffnen <ArrowRight size={10} />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigateTab('verankerungslaenge')}
                      className="p-3.5 bg-off-white hover:bg-slate-100 rounded-xl border border-home-grau/30 text-left transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <GitCommit className="text-shiraz mb-2" size={18} />
                        <span className="font-bold text-xs block text-text-main"><MdText text={inhalt.texte.t6Verankerungslänge} /></span>
                        <span className="text-[11px] text-text-main/70 mt-1 block"><MdText text={inhalt.texte.guteVsMäßigeVerbundbedingungen} /></span>
                      </div>
                      <span className="text-[10px] text-shiraz font-bold mt-2 flex items-center gap-1">
                        Öffnen <ArrowRight size={10} />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigateTab('rissbreite')}
                      className="p-3.5 bg-off-white hover:bg-slate-100 rounded-xl border border-home-grau/30 text-left transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <Layers className="text-shiraz mb-2" size={18} />
                        <span className="font-bold text-xs block text-text-main"><MdText text={inhalt.texte.t7RissbreiteGzg} /></span>
                        <span className="text-[11px] text-text-main/70 mt-1 block"><MdText text={inhalt.texte.begrenzungDerRissbreiteWk} /></span>
                      </div>
                      <span className="text-[10px] text-shiraz font-bold mt-2 flex items-center gap-1">
                        Öffnen <ArrowRight size={10} />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigateTab('ec2_generation2')}
                      className="p-3.5 bg-off-white hover:bg-slate-100 rounded-xl border border-home-grau/30 text-left transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <Sparkles className="text-amber-500 mb-2" size={18} />
                        <span className="font-bold text-xs block text-text-main"><MdText text={inhalt.texte.t8Ec22Generation} /></span>
                        <span className="text-[11px] text-text-main/70 mt-1 block"><MdText text={inhalt.texte.csctSchubmodellExposureResistance} /></span>
                      </div>
                      <span className="text-[10px] text-amber-600 font-bold mt-2 flex items-center gap-1">
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
        )}

      </div>
    </div>
  );
}
