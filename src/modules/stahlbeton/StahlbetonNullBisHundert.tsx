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

  const steps = [
    {
      id: 0,
      title: '1. Das Verbundprinzip von Stahl & Beton',
      progress: '0% – 15%',
      subtitle: 'Thermische Dehnkompatibilität, alkalischer Passivierungsschutz und Verbundmechanik',
      badge: 'Grundlagen',
    },
    {
      id: 1,
      title: '2. Werkstoffgesetze (σ-ε) nach EC2',
      progress: '15% – 35%',
      subtitle: 'Parabel-Rechteck-Diagramm für Beton und Fließplateau für Betonstahl B500',
      badge: 'Materialgesetze',
    },
    {
      id: 2,
      title: '3. Biegebemessung im GZT (μ-Verfahren)',
      progress: '35% – 55%',
      subtitle: 'Bernoulli-Hypothese, innerer Hebelarm, Druckzonenhöhe und Bewehrungsermittlung',
      badge: 'Biegung',
    },
    {
      id: 3,
      title: '4. Querkraft & Fachwerkmodell',
      progress: '55% – 75%',
      subtitle: 'Plattentragfähigkeit ohne Schubbewehrung (VRd,c) und Bügelbemessung nach Ritter-Mörsch',
      badge: 'Querkraft',
    },
    {
      id: 4,
      title: '5. Stützen, Durchstanzen & Verankerung',
      progress: '75% – 90%',
      subtitle: 'Knicken nach Theorie II. Ordnung, kritischer Rundschnitt und Verbundspannungen',
      badge: 'Sondernachweise',
    },
    {
      id: 5,
      title: '6. Gebrauchstauglichkeit (GZG) & Praxis',
      progress: '90% – 100%',
      subtitle: 'Rissbreitenbegrenzung, Mindestbewehrung und Orientierung im Berechnungsmodul',
      badge: 'Praxis & GZG',
    },
  ];

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
            <span className="text-[11px] font-bold uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-md font-mono">
              Didaktischer Leitfaden • Von 0 auf 100
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-text-main flex items-center gap-2.5 mt-1.5">
              <GraduationCap className="text-shiraz" size={24} />
              Stahlbetonbau: Systematische Einführung von den Grundlagen bis zur Bauteilbemessung
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-home-grau/20">
              Eurocode 2 • DIN EN 1992-1-1
            </span>
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p>
            Dieser modulare Leitfaden vermittelt die baustatischen, werkstofflichen und normativen 
            Zusammenhänge des Stahlbetonbaus nach DIN EN 1992-1-1 (Eurocode 2). In sechs systematischen 
            Lektionen lernen Sie das Verbundprinzip, die Werkstoffgesetze, die Biege- und Querkraftbemessung 
            im Grenzzustand der Tragfähigkeit (GZT) sowie die Nachweise im Grenzzustand der Gebrauchstauglichkeit (GZG) 
            kennen und beherrschen die entsprechenden Fachreiter dieser Plattform.
          </p>
        </div>

        {/* Fortschritts-Indikator */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-main/70">Aktueller Themenbereich:</span>
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
          <span>Themenübersicht (Kapitelauswahl)</span>
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
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md">
                Lektion 1 von 6 • 0% bis 15%
              </span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2">
                Das Verbundprinzip von Stahl & Beton
              </h3>
              <p className="text-sm text-text-main/80 mt-1">
                Warum zwei völlig unterschiedliche Baustoffe einen der leistungsfähigsten Verbundwerkstoffe der Baugeschichte bilden.
              </p>
            </div>

            {/* Sachliche Einführung */}
            <div className="bg-off-white border-l-4 border-shiraz p-5 rounded-r-xl shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-shiraz shrink-0 mt-0.5 border border-home-grau/20">
                  <BookOpen size={20} />
                </div>
                <div className="text-sm text-text-main leading-relaxed space-y-2">
                  <p className="font-bold text-slate-900">
                    Mechanische Komplementarität der beiden Partner:
                  </p>
                  <p>
                    Beton ist druckfest, aber spröde und zugschwach (mittlere Zugfestigkeit <InlineMath math="f_{ctm} \approx 2{,}2\dots 4{,}1\,\text{N/mm}^2" />). 
                    Stahl hingegen ist hochelastisch und extrem zugfest (<InlineMath math="f_{yk} = 500\,\text{N/mm}^2" />), knickt aber bei schlanker Druckbeanspruchung aus.
                  </p>
                  <p>
                    Im Verbundwerkstoff Stahlbeton bettet der Beton den Stahl ein, schützt ihn vor Knicken und Brandeinwirkung, 
                    während der Bewehrungsstahl die Zugspannungen im gerissenen Zustand (Zustand II) zuverlässig aufnimmt.
                  </p>
                </div>
              </div>
            </div>

            {/* Die 3 physikalischen Voraussetzungen */}
            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                    Physikalischer Glücksfall
                  </span>
                  <span className="text-xs font-bold text-shiraz">Faktor 1</span>
                </div>
                <h4 className="font-bold text-sm text-text-main">
                  Thermische Dehnkompatibilität
                </h4>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Beton und Stahl besitzen nahezu den identischen thermischen Längenausdehnungskoeffizienten:
                </p>
                <div className="p-2.5 bg-off-white rounded-lg border border-home-grau/20 font-mono text-center text-xs text-slate-800">
                  <InlineMath math="\alpha_T \approx 10 \cdot 10^{-6}\,\text{K}^{-1}" />
                </div>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  Bei Temperaturänderungen (Sommer/Winter) dehnt sich der Verbundkörper einheitlich aus, 
                  ohne dass innere Eigenspannungen den Verbund zerstören.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Bauchemie
                  </span>
                  <span className="text-xs font-bold text-shiraz">Faktor 2</span>
                </div>
                <h4 className="font-bold text-sm text-text-main">
                  Alkalischer Korrosionsschutz
                </h4>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Das Porenwasser des erhärteten Zementsteins enthält gelöstes Calciumhydroxid <InlineMath math="\text{Ca(OH)}_2" /> und ist stark alkalisch:
                </p>
                <div className="p-2.5 bg-off-white rounded-lg border border-home-grau/20 font-mono text-center text-xs text-emerald-800 font-bold">
                  <InlineMath math="\text{pH-Wert} \ge 12{,}5" />
                </div>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  In diesem Milieu bildet sich auf dem Stahl eine dichte Eisenoxid-Passivschicht, 
                  die die Korrosion dauerhaft unterbindet, solange kein Karbonatisierungs- oder Chlorideintrag vorliegt.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Mechanik
                  </span>
                  <span className="text-xs font-bold text-shiraz">Faktor 3</span>
                </div>
                <h4 className="font-bold text-sm text-text-main">
                  Formschlüssiger Rippenverbund
                </h4>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Moderner Betonstahl (B500A/B nach DIN 488) besitzt schräg gewalzte Rippen.
                </p>
                <div className="p-2.5 bg-off-white rounded-lg border border-home-grau/20 font-mono text-center text-xs text-blue-900 font-bold">
                  <InlineMath math="f_{bd} = 2{,}25 \cdot \eta_1 \cdot \eta_2 \cdot f_{ctd}" />
                </div>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  Kräfte werden nicht nur durch Adhäsion und Reibung, sondern vor allem durch 
                  mechanischen Formschluss der Rippen gegen den umgebenden Beton übertragen.
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 flex justify-between items-center">
              <span className="text-xs text-text-main/70 font-medium">
                Als Nächstes: Die normativen Werkstoffkurven für Beton und Stahl nach DIN EN 1992-1-1.
              </span>
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                Weiter zu Kapitel 2 <ArrowRight size={14} />
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
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md">
                Lektion 2 von 6 • 15% bis 35%
              </span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2">
                Werkstoffgesetze (σ-ε) nach Eurocode 2
              </h3>
              <p className="text-sm text-text-main/80 mt-1">
                Das Parabel-Rechteck-Diagramm für Beton und das bilineare Fließplateau für Betonstahl B500.
              </p>
            </div>

            {/* Sachliche Einführung */}
            <div className="bg-off-white border-l-4 border-shiraz p-5 rounded-r-xl shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-shiraz shrink-0 mt-0.5 border border-home-grau/20">
                  <BookOpen size={20} />
                </div>
                <div className="text-sm text-text-main leading-relaxed space-y-2">
                  <p className="font-bold text-slate-900">
                    Sicherheitskonzept & Bemessungswerte:
                  </p>
                  <p>
                    Eurocode 2 arbeitet im Grenzzustand der Tragfähigkeit (GZT) mit dem semi-probabilistischen Sicherheitskonzept. 
                    Aus den charakteristischen Werkstofffestigkeiten werden durch Teilsicherheitsbeiwerte die Bemessungswerte gebildet:
                  </p>
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
                  <span>Beton: Parabel-Rechteck (EC2 3.1.7)</span>
                  <span className="text-xs font-mono text-shiraz font-bold">εc2 = -2,0 ‰</span>
                </h4>
                <div className="space-y-2 text-xs text-text-main/80 leading-relaxed">
                  <p>
                    Für Normalbeton bis C50/60 setzt sich die Druckspannungs-Dehnungslinie aus einer quadratischen Parabel 
                    bis zur Stauchung <InlineMath math="\varepsilon_{c2} = -2{,}0\,\text{‰}" /> und einem anschließenden Rechteck-Plateau 
                    bis zur Bruchdehnung <InlineMath math="\varepsilon_{cu2} = -3{,}5\,\text{‰}" /> zusammen.
                  </p>
                  <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 font-mono text-center">
                    <InlineMath math="\sigma_c = f_{cd} \cdot \left[1 - \left(1 - \frac{|\varepsilon_c|}{2{,}0}\right)^2\right] \quad (0 \le |\varepsilon_c| \le 2{,}0\,\text{‰})" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Für die Handberechnung darf alternativ das Rechteckmodell mit wirksamer Druckzonenhöhe <InlineMath math="x_{eff} = 0{,}8 \cdot x" /> angesetzt werden.
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-text-main flex items-center justify-between">
                  <span>Betonstahl B500 (EC2 3.2.7)</span>
                  <span className="text-xs font-mono text-shiraz font-bold">εyd = 2.175 ‰</span>
                </h4>
                <div className="space-y-2 text-xs text-text-main/80 leading-relaxed">
                  <p>
                    Betonstahl B500 weist ein idealisiertes linear-elastisches, ideal-plastisches Verhalten auf. 
                    Bis zur Fließgrenzdehnung gilt das Hooke'sche Gesetz mit <InlineMath math="E_s = 200\,000\,\text{N/mm}^2" />:
                  </p>
                  <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 font-mono text-center">
                    <InlineMath math="\varepsilon_{yd} = \frac{f_{yd}}{E_s} = \frac{435}{200\,000} \approx 2{,}175\,\text{‰}" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Bei Dehnungen <InlineMath math="\varepsilon_s > \varepsilon_{yd}" /> bleibt die Spannung konstant bei <InlineMath math="f_{yd}" /> (horizontaler oberer Ast).
                  </p>
                </div>
              </div>
            </div>

            {/* Interaktiver Festigkeits-Vergleicher */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={15} /> Interaktiver Kennwerte-Vergleich nach DIN EN 1992-1-1
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  Ausgewählt: <strong className="text-shiraz">{selectedConcrete}</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main/70 mb-1.5">
                  Betonfestigkeitsklasse wählen:
                </label>
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
                  <span className="text-[10px] text-text-main/60 uppercase font-bold block">Charakt. Druckfestigkeit</span>
                  <span className="text-lg font-mono font-black text-slate-900">{formatDeWert(currentConcrete.fck)} N/mm²</span>
                  <span className="text-[10px] text-slate-500 block font-mono">f_ck (Zylinder)</span>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase font-bold block">Bemessungsfestigkeit</span>
                  <span className="text-lg font-mono font-black text-shiraz">{formatDeZahl(fcd, 2)} N/mm²</span>
                  <span className="text-[10px] text-shiraz/80 block font-mono">f_cd = 0,85 · f_ck / 1.5</span>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase font-bold block">Mittlere Zugfestigkeit</span>
                  <span className="text-lg font-mono font-black text-slate-900">{formatDeWert(currentConcrete.fctm)} N/mm²</span>
                  <span className="text-[10px] text-slate-500 block font-mono">f_ctm = 0,30 · f_ck^(2/3)</span>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase font-bold block">Elastizitätsmodul</span>
                  <span className="text-lg font-mono font-black text-emerald-700">{formatDeZahl((currentConcrete.Ecm / 1000), 0)} kN/mm²</span>
                  <span className="text-[10px] text-emerald-600 block font-mono">E_cm (Sekantenmodul)</span>
                </div>
              </div>
            </div>

            {/* Navigation & Link in Reiter 1 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-text-main/80">
                Im Unterrechner <strong>"1. Spannung-Dehnung (σ-ε)"</strong> können Sie die Kurven interaktiv als Diagramm auswerten.
              </div>
              <div className="flex gap-2">
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('spannung')}
                    className="px-3.5 py-2 bg-white text-shiraz border border-shiraz/40 hover:bg-shiraz/10 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Activity size={13} /> Zu Spannung-Dehnung
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  Weiter zu Kapitel 3 <ArrowRight size={14} />
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
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md">
                Lektion 3 von 6 • 35% bis 55%
              </span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2">
                Biegebemessung im GZT & Das dimensionslose μ-Verfahren
              </h3>
              <p className="text-sm text-text-main/80 mt-1">
                Ebenbleiben der Querschnitte (Bernoulli), innerer Hebelarm und rechnerische Ermittlung der Biegebewehrung.
              </p>
            </div>

            {/* Sachliche Einführung */}
            <div className="bg-off-white border-l-4 border-shiraz p-5 rounded-r-xl shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-shiraz shrink-0 mt-0.5 border border-home-grau/20">
                  <BookOpen size={20} />
                </div>
                <div className="text-sm text-text-main leading-relaxed space-y-2">
                  <p className="font-bold text-slate-900">
                    Das innere Kräftepaar bei Biegung:
                  </p>
                  <p>
                    Ein Biegemoment <InlineMath math="M_{Ed}" /> wird im Querschnitt durch ein inneres Kräftepaar aus 
                    Betondruckkraft <InlineMath math="F_{cd}" /> und Stahlzugkraft <InlineMath math="F_{sd}" /> abgetragen:
                  </p>
                  <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 font-mono text-center text-xs text-slate-800">
                    <InlineMath math="M_{Ed} = F_{cd} \cdot z = F_{sd} \cdot z \quad \text{mit innerem Hebelarm } z = \zeta \cdot d" />
                  </div>
                  <p>
                    Das bewährte <strong>dimensionslose Momentenbeiwert-Verfahren (<InlineMath math="\mu" />-Verfahren)</strong> 
                    erlaubt die rasche Ermittlung der Zugbewehrung <InlineMath math="A_{s,erf}" /> ohne iterative Gleichgewichtsberechnung.
                  </p>
                </div>
              </div>
            </div>

            {/* Formeln und Grenzwerte */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-shiraz flex items-center gap-2">
                  <Box size={16} /> Schrittweise Bemessungsgleichungen
                </h4>
                <div className="space-y-2 text-xs text-text-main/85 leading-relaxed">
                  <div>
                    <strong>1. Bezogenes Bemessungsmoment:</strong>
                    <div className="p-2 bg-off-white rounded font-mono text-center my-1">
                      <InlineMath math="\mu_{Eds} = \frac{M_{Eds}}{b \cdot d^2 \cdot f_{cd}}" />
                    </div>
                  </div>
                  <div>
                    <strong>2. Bezogener innerer Hebelarm (<InlineMath math="\zeta" />):</strong>
                    <div className="p-2 bg-off-white rounded font-mono text-center my-1">
                      <InlineMath math="\zeta = 0{,}5 \cdot \left(1 + \sqrt{1 - 2 \cdot \mu_{Eds}}\right)" />
                    </div>
                  </div>
                  <div>
                    <strong>3. Erforderliche Zugbewehrung:</strong>
                    <div className="p-2 bg-off-white rounded font-mono text-center my-1 text-shiraz font-bold">
                      <InlineMath math="A_{s,erf} = \frac{M_{Eds}}{\zeta \cdot d \cdot f_{yd}}" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Scale size={16} className="text-shiraz" /> Grenzwerte & Duktilität
                </h4>
                <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
                  <p>
                    <strong>Einfache Bewehrung (<InlineMath math="\mu_{Eds} \le \mu_{lim} \approx 0{,}296" />):</strong><br />
                    Die Zugbewehrung fließt vor dem Betonbruch (<InlineMath math="\varepsilon_s \ge 2{,}175\,\text{‰}" />). 
                    Dies garantiert ein duktiles Bauteilverhalten mit deutlicher Vorankündigung durch Rissbildung.
                  </p>
                  <p>
                    <strong>Druckbewehrung erforderlich (<InlineMath math="\mu_{Eds} > \mu_{lim}" />):</strong><br />
                    Übersteigt das Moment den Grenzwert, reicht die Betondruckzone allein nicht mehr aus. 
                    Es muss entweder die Querschnittshöhe vergrößert oder eine Druckbewehrung <InlineMath math="A_{s2}" /> eingebaut werden.
                  </p>
                  <p className="text-[11px] text-slate-500 italic">
                    Tipp: Nach DIN EN 1992-1-1 gilt stets eine Mindestbewehrung <InlineMath math="A_{s,min} = 0{,}26 \cdot (f_{ctm}/f_{yk}) \cdot b_t \cdot d \ge 0{,}0013 \cdot b_t \cdot d" /> zur Vermeidung von Sprödbruch.
                  </p>
                </div>
              </div>
            </div>

            {/* Interaktiver Biegebemessungs-Rechner */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={15} /> Interaktiver Schnelldemonstrator: Rechteck-Biegebemessung
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  Beton: C30/37 (<InlineMath math="f_{cd} = 17{,}0\,\text{N/mm}^2" />) • B500B
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-main/70 mb-1 flex justify-between">
                    <span>Bemessungsmoment (M_Ed):</span>
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
                    <span>Balkenbreite (b):</span>
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
                    <span>Nutzhöhe (d):</span>
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
                  <span className="text-[10px] text-text-main/60 uppercase font-bold block">Beiwert μ_Eds</span>
                  <span className="text-lg font-mono font-black text-slate-900">{formatDeZahl(mu_Eds, 3)}</span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    {mu_Eds <= MU_LIM_STAHL ? '✓ Einfach bewehrt' : '⚠ Druckbewehrung nötig'}
                  </span>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase font-bold block">Hebelarm-Faktor ζ</span>
                  <span className="text-lg font-mono font-black text-slate-900">{formatDeZahl(zeta, 3)}</span>
                  <span className="text-[10px] text-slate-500 block font-mono">z = {formatDeZahl((zeta * calcDepth), 1)} cm</span>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase font-bold block">Erforderliche Bewehrung</span>
                  <span className="text-lg font-mono font-black text-shiraz">{formatDeZahl(As_erf_cm2, 2)} cm²</span>
                  <span className="text-[10px] text-shiraz/80 block font-mono">
                    z. B. {formatDeWert(Math.ceil(As_erf_cm2 / 2.01))} ⌀ 16 mm Stäbe
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation & Link in Reiter 2 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-text-main/80">
                Im Unterrechner <strong>"2. Biegebemessung"</strong> bemessen Sie Rechteckquerschnitte – auch mit Druckbewehrung und nichtmetallischer Bewehrung.
              </div>
              <div className="flex gap-2">
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('biegebemessung')}
                    className="px-3.5 py-2 bg-white text-shiraz border border-shiraz/40 hover:bg-shiraz/10 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Box size={13} /> Zur Biegebemessung
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  Weiter zu Kapitel 4 <ArrowRight size={14} />
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
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md">
                Lektion 4 von 6 • 55% bis 75%
              </span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2">
                Querkraftbemessung & Das Fachwerkmodell nach Ritter-Mörsch
              </h3>
              <p className="text-sm text-text-main/80 mt-1">
                Nachweisführung für Bauteile ohne Querkraftbewehrung (<InlineMath math="V_{Rd,c}" />) und Bemessung von Bügeln nach der Fachwerktheorie.
              </p>
            </div>

            {/* Sachliche Einführung */}
            <div className="bg-off-white border-l-4 border-shiraz p-5 rounded-r-xl shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-shiraz shrink-0 mt-0.5 border border-home-grau/20">
                  <BookOpen size={20} />
                </div>
                <div className="text-sm text-text-main leading-relaxed space-y-2">
                  <p className="font-bold text-slate-900">
                    Schubspannungen & Schrägrisse:
                  </p>
                  <p>
                    Querkräfte erzeugen im Trägersteg Hauptzugspannungen unter ca. 45° Neigung zur Bauteilachse. 
                    Da Beton kaum Zug aufnehmen kann, bilden sich charakteristische <strong>Schubschrägrisse</strong>.
                  </p>
                  <p>
                    DIN EN 1992-1-1 unterscheidet grundlegend zwei Fälle:
                    <br />
                    1. <strong>Ohne Querkraftbewehrung:</strong> Weitflächige Bauteile (Platten, Fundamente), bei denen der ungerissene Druckgurt und die Rissreibung die Querkraft <InlineMath math="V_{Rd,c}" /> allein abtragen.
                    <br />
                    2. <strong>Mit Querkraftbewehrung:</strong> Balken und Träger, bei denen geschlossene Bügel oder Schrägstäbe als Zugstreben in einem gedachten Fachwerk modelliert werden.
                  </p>
                </div>
              </div>
            </div>

            {/* Die beiden Modelle */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-shiraz flex items-center justify-between">
                  <span>1. Ohne Querkraftbewehrung (VRd,c)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-700">Platten & Decken</span>
                </h4>
                <div className="space-y-2 text-xs text-text-main/85 leading-relaxed">
                  <p>
                    Die Tragfähigkeit <InlineMath math="V_{Rd,c}" /> berechnet sich nach der empirischen Potenzformel:
                  </p>
                  <div className="p-2.5 bg-off-white rounded font-mono text-center">
                    <InlineMath math="V_{Rd,c} = \left[C_{Rd,c} \cdot k \cdot (100 \cdot \rho_l \cdot f_{ck})^{1/3}\right] b_w \cdot d" />
                  </div>
                  <div className="p-2 bg-white rounded border border-home-grau/20 space-y-1 text-[11px]">
                    <div>• <strong>Maßstabsbeiwert:</strong> <InlineMath math="k = 1 + \sqrt{200/d} \le 2{,}0" /> (dickere Platten tragen spezifisch weniger Schub!)</div>
                    <div>• <strong>Längsbewehrungsgrad:</strong> <InlineMath math="\rho_l = A_{sl} / (b_w \cdot d) \le 0{,}02" /></div>
                    <div>• <strong>Mindestwert:</strong> <InlineMath math="V_{Rd,c} \ge v_{min} \cdot b_w \cdot d" /></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-shiraz flex items-center justify-between">
                  <span>2. Fachwerkmodell mit variablem Winkel</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-700">Balken & Träger</span>
                </h4>
                <div className="space-y-2 text-xs text-text-main/85 leading-relaxed">
                  <p>
                    Das Tragmodell besteht aus Betondruckstreben unter dem Winkel <InlineMath math="\theta" /> und vertikalen Bügeln als Zugstreben:
                  </p>
                  <div className="p-2.5 bg-off-white rounded font-mono text-center">
                    <InlineMath math="V_{Rd,s} = \frac{A_{sw}}{s} \cdot z \cdot f_{ywd} \cdot \cot \theta" />
                  </div>
                  <div className="p-2 bg-white rounded border border-home-grau/20 space-y-1 text-[11px]">
                    <div>• <strong>Druckstrebenwinkel:</strong> <InlineMath math="1{,}0 \le \cot \theta \le 3{,}0" /> nach NA, zusätzlich begrenzt nach Gl. (6.7aDE)</div>
                    <div>• <strong>Betondruckstrebennachweis:</strong> <InlineMath math="V_{Ed} \le V_{Rd,max}" /> zur Vermeidung von Betonzerquetschen im Steg.</div>
                    <div>• <strong>Versatzmaß:</strong> Zugkraftdeckungslinie um <InlineMath math="a_l = z \cdot \cot \theta / 2" /> versetzen!</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation & Link in Reiter 3 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-text-main/80">
                Im Unterrechner <strong>"3. Querkraftbemessung"</strong> können Sie Druckstrebenwinkel optimieren und Bügelabstände dimensionieren.
              </div>
              <div className="flex gap-2">
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('querkraftbemessung')}
                    className="px-3.5 py-2 bg-white text-shiraz border border-shiraz/40 hover:bg-shiraz/10 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Scissors size={13} /> Zur Querkraftbemessung
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="px-4 py-2 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  Weiter zu Kapitel 5 <ArrowRight size={14} />
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
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md">
                Lektion 5 von 6 • 75% bis 90%
              </span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2">
                Sondernachweise: Stützenknicken, Durchstanzen & Verankerungslänge
              </h3>
              <p className="text-sm text-text-main/80 mt-1">
                Theorie II. Ordnung bei schlanken Druckgliedern, lokales Plattenversagen und Kraftübertragung an Stabenden.
              </p>
            </div>

            {/* 3 Sonder-Themen */}
            <div className="grid md:grid-cols-3 gap-5">
              {/* Stützen */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      EC2 Kap. 5.8
                    </span>
                    <Columns size={16} className="text-shiraz" />
                  </div>
                  <h4 className="font-bold text-sm text-text-main">
                    1. Stützen nach Theorie II. Ordnung
                  </h4>
                  <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
                    <p>
                      Schlanke Druckglieder knicken aus, bevor die reine Querschnittstragfähigkeit erreicht wird. 
                      Die Schlankheit <InlineMath math="\lambda = l_0 / i" /> entscheidet, ob Theorie II. Ordnung erforderlich ist.
                    </p>
                    <p>
                      Das Gesamtmoment setzt sich zusammen aus:
                    </p>
                    <div className="p-2 bg-off-white rounded font-mono text-center text-[11px]">
                      <InlineMath math="M_{Ed} = M_{0Ed} + N_{Ed} \cdot e_2" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Zusatzexzentrizität <InlineMath math="e_2" /> berücksichtigt Krümmung und Betonkriechen.
                    </p>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-home-grau/20 text-[11px] text-slate-700">
                  <strong>Typische Anwendung:</strong> Geschossstützen, Hallenstützen, Brückenpfeiler.
                </div>
              </div>

              {/* Durchstanzen */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      EC2 Kap. 6.4
                    </span>
                    <CircleDashed size={16} className="text-shiraz" />
                  </div>
                  <h4 className="font-bold text-sm text-text-main">
                    2. Durchstanzen an Flachdecken
                  </h4>
                  <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
                    <p>
                      An Stützenköpfen punktgestützter Platten konzentrieren sich extrem hohe Querkräfte. 
                      Das Versagen erfolgt durch Ausbrechen eines pyramidenförmigen Bruchkörpers.
                    </p>
                    <p>
                      Der Nachweis erfolgt im kritischen Rundschnitt im Abstand <InlineMath math="2{,}0\,d" /> vom Stützenrand:
                    </p>
                    <div className="p-2 bg-off-white rounded font-mono text-center text-[11px]">
                      <InlineMath math="v_{Ed} = \beta \cdot \frac{V_{Ed}}{u_1 \cdot d} \le v_{Rd,c}" />
                    </div>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-home-grau/20 text-[11px] text-slate-700">
                  <strong>Lösung bei Überlastung:</strong> Durchstanzbewehrung (Bügel oder Doppelkopfanker).
                </div>
              </div>

              {/* Verankerung */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      EC2 Kap. 8.4
                    </span>
                    <GitCommit size={16} className="text-shiraz" />
                  </div>
                  <h4 className="font-bold text-sm text-text-main">
                    3. Verankerungslänge von Stäben
                  </h4>
                  <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
                    <p>
                      Um die volle Stahlkraft in den Beton einzuleiten, ist eine rechnerische Verankerungslänge erforderlich:
                    </p>
                    <div className="p-2 bg-off-white rounded font-mono text-center text-[11px]">
                      <InlineMath math="l_{b,rqd} = \frac{\phi}{4} \cdot \frac{\sigma_{sd}}{f_{bd}}" />
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Unterscheidung nach Verbundbereichen: <strong>Gute Bedingungen</strong> (untenliegende Bewehrung) vs. <strong>mäßige Bedingungen</strong> (obenliegend wegen aufsteigendem Anmachwasser / Bluten).
                    </p>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-home-grau/20 text-[11px] text-slate-700">
                  <strong>Formgebung:</strong> Gerade Enden, Haken, Winkelhaken oder angeschweißte Querstäbe.
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
                <ArrowLeft size={14} /> Zurück zu Kapitel 4
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(5)}
                className="px-4 py-2 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                Weiter zu Kapitel 6 <ArrowRight size={14} />
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
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md">
                Lektion 6 von 6 • 90% bis 100%
              </span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2">
                Gebrauchstauglichkeit (GZG), 5 Kernregeln & Modulnavigator
              </h3>
              <p className="text-sm text-text-main/80 mt-1">
                Rissbreitenbegrenzung nach EC2 Kap. 7, Mindestbewehrung für Zwang und Nutzung der acht Berechnungsreiter.
              </p>
            </div>

            {/* Die 5 Kernregeln */}
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-shiraz flex items-center gap-2 uppercase tracking-wider">
                <Sparkles size={16} /> Die 5 fundamentalen Stahlbeton-Regeln
              </h4>
              <div className="grid sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">1</span>
                    Zustand II ist der Regelfall
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Stahlbeton funktioniert im Grenzzustand der Tragfähigkeit erst durch kontrolliertes Aufreißen 
                    des Betons. Ein Riss ist kein Bauschaden, solange die berechnete Rissbreite <InlineMath math="w_k \le w_{max}" /> (z. B. 0,3 mm) eingehalten wird.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">2</span>
                    Duktilität geht vor Traglastüberhöhung
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Überbewehrte Querschnitte (<InlineMath math="\mu_{Eds} > 0{,}296" />) müssen vermieden werden, 
                    da der Beton vor dem Fließen des Stahls schlagartig versagt. Stahlbetonbauteile müssen sich vor dem Bruch durch große Durchbiegungen ankündigen.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">3</span>
                    Mindestbewehrung für Zwangskräfte
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Beim Erhärten (Hydratationswärme) behindern Fundamente die Kontraktion junger Bauteile (früher Zwang). 
                    Es ist stets eine Mindestbewehrung <InlineMath math="A_{s,min} = k_c \cdot k \cdot f_{ct,eff} \cdot A_{ct} / \sigma_s" /> einzubauen.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">4</span>
                    Maßstabseffekt bei Schub
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Dickere Bauteile ohne Querkraftbewehrung haben eine geringere bezogene Schubtragfähigkeit als dünne Platten (<InlineMath math="k = 1 + \sqrt{200/d} \le 2{,}0" />). 
                    Dies ist bei dicken Bodenplatten und Fundamenten stets zu beachten.
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1 sm:col-span-2">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-[10px] font-mono">5</span>
                    Zugkraftdeckung & Verankerungsversatz
                  </div>
                  <p className="text-amber-900 text-[11px] leading-relaxed">
                    Infolge der Fachwerkwirkung bei Querkraftbelastung sind die Längszugkräfte gegenüber der 
                    Biegemomentenlinie um das Versatzmaß <InlineMath math="a_l = z \cdot \cot \theta / 2" /> zur Auflagerseite hin verschoben. 
                    Längsstäbe dürfen erst dort abgemindert werden, wo die verschobene Zugkraftlinie dies erlaubt!
                  </p>
                </div>
              </div>
            </div>

            {/* Interaktiver Wissens-Check */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
                <span className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle size={15} className="text-shiraz" /> Wissensprüfung: Stahlbetonbau-Grundlagen
                </span>
                <span className="text-[10px] font-mono font-bold text-text-main/70 bg-white px-2 py-0.5 rounded border border-home-grau/20">
                  2 Kontrollfragen
                </span>
              </div>

              {/* Frage 1 */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-text-main">
                  Frage 1: Warum ist der identische thermische Ausdehnungskoeffizient von Stahl und Beton (<InlineMath math="\alpha_T \approx 10^{-5}\,\text{K}^{-1}" />) so elementar?
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q1: 1 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q1 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    A) Weil sich bei Temperaturwechseln keine zerstörenden inneren Verbund-Zwangsspannungen aufbauen.
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q1: 2 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q1 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    B) Weil dadurch der Schmelzpunkt des Verbunds im Brandfall steigt.
                  </button>
                </div>
                {quizAnswers.q1 === 1 && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ Vollkommen richtig! Wären die Ausdehnungskoeffizienten verschieden, würde der Verbundkörper bei Frost oder Hitze intern zerreißen.
                  </p>
                )}
                {quizAnswers.q1 === 2 && (
                  <p className="text-[11px] text-red-600 font-medium">
                    ✗ Nicht zutreffend: Der Brandschutz wird durch die Betondeckung (c_nom) gewährleistet, nicht durch den Schmelzpunkt.
                  </p>
                )}
              </div>

              {/* Frage 2 */}
              <div className="space-y-2 pt-2 border-t border-home-grau/15">
                <p className="text-xs font-bold text-text-main">
                  Frage 2: Was beschreibt das Versatzmaß <InlineMath math="a_l = z \cdot \cot \theta / 2" /> bei der Querkraftbemessung?
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q2: 1 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q2 === 1
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    A) Den horizontalen Abstand zwischen zwei aufeinanderfolgenden Bügeln.
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q2: 2 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q2 === 2
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    B) Die Verschiebung der Zugkraftdeckungslinie gegenüber der reinen Biegemomentenlinie infolge der Fachwerkwirkung.
                  </button>
                </div>
                {quizAnswers.q2 === 2 && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ Exakt: Die geneigten Betondruckstreben leiten zusätzliche Längszugkräfte in das Zugband ein, weshalb Bewehrungsstäbe weiter zum Auflager hin geführt werden müssen.
                  </p>
                )}
              </div>
            </div>

            {/* Übersicht und Weiterleitung in alle Fachreiter */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
              <div>
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider font-mono">
                  Leitfaden abgeschlossen • 100 % Wissensstand
                </span>
                <h4 className="text-lg md:text-xl font-bold text-text-main mt-1">
                  Werkzeugübersicht: Alle Berechnungsmodule von Stahlbeton
                </h4>
                <p className="text-xs md:text-sm text-text-main/80 mt-1 max-w-2xl leading-relaxed">
                  Nutzen Sie die spezialisierten Reiter dieses Moduls zur quantitativen Bemessung nach Eurocode 2:
                </p>
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
                        <span className="font-bold text-xs block text-text-main">1. Spannung-Dehnung</span>
                        <span className="text-[11px] text-text-main/70 mt-1 block">
                          Parabel-Rechteck & B500 Werkstofflinien.
                        </span>
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
                        <span className="font-bold text-xs block text-text-main">2. Biegebemessung</span>
                        <span className="text-[11px] text-text-main/70 mt-1 block">
                          Rechteckquerschnitte nach dem μ-Verfahren.
                        </span>
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
                        <span className="font-bold text-xs block text-text-main">3. Querkraftbemessung</span>
                        <span className="text-[11px] text-text-main/70 mt-1 block">
                          VRd,c ohne Schubbewehrung & Bügelnachweis.
                        </span>
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
                        <span className="font-bold text-xs block text-text-main">4. Stützenbemessung</span>
                        <span className="text-[11px] text-text-main/70 mt-1 block">
                          Schlankheit, Knicken & Theorie II. Ordnung.
                        </span>
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
                        <span className="font-bold text-xs block text-text-main">5. Durchstanzen</span>
                        <span className="text-[11px] text-text-main/70 mt-1 block">
                          Kritischer Rundschnitt an Flachdeckenstützen.
                        </span>
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
                        <span className="font-bold text-xs block text-text-main">6. Verankerungslänge</span>
                        <span className="text-[11px] text-text-main/70 mt-1 block">
                          Gute vs. mäßige Verbundbedingungen (lb,rqd).
                        </span>
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
                        <span className="font-bold text-xs block text-text-main">7. Rissbreite (GZG)</span>
                        <span className="text-[11px] text-text-main/70 mt-1 block">
                          Begrenzung der Rissbreite wk & Mindestbewehrung.
                        </span>
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
                        <span className="font-bold text-xs block text-text-main">8. EC2 (2. Generation)</span>
                        <span className="text-[11px] text-text-main/70 mt-1 block">
                          CSCT-Schubmodell & Exposure Resistance Classes.
                        </span>
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
                <ArrowLeft size={14} /> Zurück zu Kapitel 5
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
