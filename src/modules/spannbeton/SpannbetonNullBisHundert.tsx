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

  const steps = [
    {
      id: 0,
      title: '1. Das Grundprinzip der Vorspannung',
      progress: '0% – 20%',
      subtitle: 'Mechanische Grenzen des Stahlbetons und Wirkungsweise künstlicher Drucküberlagerung',
      badge: 'Grundlagen & Motivation',
    },
    {
      id: 1,
      title: '2. Rheologische Baustoffphysik & Spannstahl',
      progress: '20% – 40%',
      subtitle: 'Kriechen, Schwinden und die Notwendigkeit hochfester Spannstähle (Y1860)',
      badge: 'Materialphysik',
    },
    {
      id: 2,
      title: '3. Die 4 Vorspannverfahren nach DIN EN 1992-1-1',
      progress: '40% – 60%',
      subtitle: 'Sofortiger Verbund, nachträglicher Verbund, ohne Verbund & externe Vorspannung',
      badge: 'Bauverfahren',
    },
    {
      id: 3,
      title: '4. Tragwerksmechanik & Load Balancing',
      progress: '60% – 80%',
      subtitle: 'Umlenkkräfte parabelförmiger Spannglieder zur Kompensation der Eigenlast',
      badge: 'Tragwerksmechanik',
    },
    {
      id: 4,
      title: '5. Statisch unbestimmte Systeme & Zwang',
      progress: '80% – 95%',
      subtitle: 'Durchlaufträger, sekundäre Zwangsmomente und das Konzept der Konkordanz',
      badge: 'Höhere Baustatik',
    },
    {
      id: 5,
      title: '6. Nachweiskonzept & Bemessungsregeln',
      progress: '95% – 100%',
      subtitle: 'Grenzzustände nach Eurocode 2 (GZT / GZG) und Orientierung im Modul',
      badge: 'Normen & Praxis',
    },
  ];

  // Calculations for Demonstrator 1:
  // B500: fyd = 435 N/mm2, Es = 200000 N/mm2, eps_el = 2.175 Promille
  // Y1860: fpk = 1860 N/mm2, fp01k = 1600 N/mm2, Ep = 195000 N/mm2, zulässige Vorspannung sigma_pm0 = min(0.75*fpk, 0.85*fp01k) = 1360 N/mm2
  const deltaEps = concreteStauchung / 1000;
  const deltaSigma_b500 = 200000 * deltaEps; // N/mm2 loss
  const lossPercent_b500 = Math.min(100, Math.round((deltaSigma_b500 / 435) * 100));
  const remaining_b500 = Math.max(0, 435 - deltaSigma_b500);

  const deltaSigma_y1860 = 195000 * deltaEps; // N/mm2 loss
  const initial_y1860 = 1360; // N/mm2 = min(0.75*1860, 0.85*1600)
  const lossPercent_y1860 = Math.min(100, Math.round((deltaSigma_y1860 / initial_y1860) * 100));
  const remaining_y1860 = Math.max(0, initial_y1860 - deltaSigma_y1860);

  // Calculations for Demonstrator 2 (Load Balancing u = 8 * P * f / L^2 => P_bal = g * L^2 / (8 * f))
  const requiredP_kN = Math.round((deadLoad * Math.pow(beamLength, 2)) / (8 * sagittaF));
  const upwardLoad_u = Math.round(((8 * requiredP_kN * sagittaF) / Math.pow(beamLength, 2)) * 10) / 10;
  const netMomentMidspan = Math.round(((deadLoad - upwardLoad_u) * Math.pow(beamLength, 2)) / 8);

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
              Spannbetonbau: Systematische Einführung von den Grundlagen bis zur Bemessung
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
            Dieser Leitfaden vermittelt die baustatischen, werkstofflichen und konstruktiven Gesetzmäßigkeiten 
            des Spannbetonbaus. Anhand von sechs logisch aufeinander aufbauenden Lektionen werden die mechanischen 
            Wirkungsweisen der künstlichen Druckvorspannung, die rheologischen Verluste (Kriechen, Schwinden, Relaxation), 
            die Herstellungsverfahren sowie die Schnittgrößenüberlagerung und Nachweisführung nach Eurocode 2 
            präzise und nachvollziehbar erläutert.
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

      {/* Schritt-Inhalte */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-home-grau/30 shadow-sm space-y-8 animate-in fade-in duration-300">
        
        {/* ========================================================================= */}
        {/* STATION 1: 0% - 20% DAS GRUNDPRINZIP */}
        {/* ========================================================================= */}
        {activeStep === 0 && (
          <div className="space-y-6">
            <div className="border-b border-home-grau/20 pb-4">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md">
                Lektion 1 von 6 • 0% bis 20%
              </span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2">
                Das Grundprinzip der Vorspannung & Mechanische Ausgangslage
              </h3>
              <p className="text-sm text-text-main/80 mt-1">
                Wirkungsweise künstlich eingeprägter Drucküberlagerungen zur Rissvermeidung bei Biegebeanspruchung.
              </p>
            </div>

            {/* Sachliche Problemstellung */}
            <div className="bg-off-white border-l-4 border-shiraz p-5 rounded-r-xl shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-shiraz shrink-0 mt-0.5 border border-home-grau/20">
                  <BookOpen size={20} />
                </div>
                <div className="text-sm text-text-main leading-relaxed space-y-2">
                  <p className="font-bold text-slate-900">
                    Mechanische Ausgangslage & Baustoffgrenzen:
                  </p>
                  <p>
                    Beton besitzt eine hohe Druckfestigkeit (z. B. <InlineMath math="f_{ck} = 35\,\text{N/mm}^2" /> bei einem C35/45), 
                    seine mittlere zentrische Zugfestigkeit <InlineMath math="f_{ctm}" /> liegt jedoch lediglich bei 
                    2,2 bis 4,1 N/mm² – etwa <strong>7–10 %</strong> der Druckfestigkeit (z. B. C35/45: 3,2/35 = 9 %; C50/60: 4,1/50 = 8 %).
                  </p>
                  <p>
                    Im schlaff bewehrten Stahlbeton (B500) ist das Aufreißen des Betons im Zugbereich (Zustand II) 
                    statisch einkalkuliert: Erst nach Rissbildung übernimmt der Bewehrungsstahl die anfallenden Zugkräfte. 
                    Bei weitgespannten Bauteilen (wie Brückenüberbauten oder Hallenbindern) führt dieser Steifigkeitsabfall 
                    jedoch zu unzulässig großen Durchbiegungen, breiten Rissen und damit einhergehenden Korrosionsrisiken.
                  </p>
                </div>
              </div>
            </div>

            {/* Physikalische Analogie & Wirkprinzip */}
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-3">
                <h4 className="font-bold text-sm text-shiraz flex items-center gap-2">
                  <Lightbulb size={16} /> Das physikalische Prinzip nach Eugène Freyssinet (1928)
                </h4>
                <p className="text-xs text-text-main/85 leading-relaxed">
                  Das Grundprinzip des Spannbetons lässt sich an einer Reihe frei aneinandergestellter Bücher 
                  ohne gegenseitigen Zugverbund veranschaulichen: Versucht man, die Reihe ohne Einspannung anzuheben, 
                  versagt das System schlagartig durch Klaffen der Kontaktfugen.
                </p>
                <p className="text-xs text-text-main/85 leading-relaxed">
                  Wird jedoch von beiden Enden eine ausreichend große <strong>künstliche Druckkraft <InlineMath math="P" /></strong> eingeleitet, 
                  überlagert die resultierende Druckspannung die aus dem Eigengewicht resultierenden Zugspannungen. 
                  Solange die resultierende Randspannung eine reine Druckspannung bleibt, bleibt der Querschnitt geschlossen 
                  und besitzt die volle Biegesteifigkeit des ungerissenen Zustands I.
                </p>
                <div className="p-3 bg-white rounded-lg border border-home-grau/20 text-xs font-mono text-center text-slate-800">
                  <InlineMath math="\sigma_u = -\frac{P}{A} - \frac{P \cdot e_p}{W_u} + \frac{M}{W_u} \le 0 \quad (\text{Vollständige Drucküberdeckung am Unterrand})" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
                    <Scale size={15} className="text-shiraz" /> Systemvergleich im Querschnitt
                  </h5>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-900">1. Unbewehrter Beton (Zustand I):</div>
                      <div className="text-slate-600 mt-0.5">
                        Versagt spröde und ohne Vorankündigung, sobald die Randzugspannung die Zugfestigkeit überschreitet (<InlineMath math="\sigma > f_{ctm}" />).
                      </div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-900">2. Normaler Stahlbeton (Zustand II):</div>
                      <div className="text-slate-600 mt-0.5">
                        Tragfähig, erfordert jedoch planmäßige Rissbildung. Der Beton in der Zugzone trägt rechnerisch nicht mehr zur Biegesteifigkeit bei.
                      </div>
                    </div>
                    <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg">
                      <div className="font-bold text-emerald-900">3. Spannbeton (Drucküberlagerung):</div>
                      <div className="text-emerald-800 mt-0.5">
                        Der Querschnitt bleibt durch die eingeprägte Kraft voll oder weitgehend überdrückt. Maximale Steifigkeit, geringe Durchbiegung und hoher Schutz vor Risskorrosion.
                      </div>
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
                <p className="text-xs text-text-main/80 mt-0.5">
                  Vorspannung ist die planmäßige Vorwegnahme von inneren Druckspannungen zur Kompensation späterer lastbedingter Zugbeanspruchungen.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl flex items-center gap-2 shrink-0 transition-all shadow-sm cursor-pointer"
              >
                Weiter zu Kapitel 2 <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 2: 20% - 40% DAS B500-DILEMMA */}
        {/* ========================================================================= */}
        {activeStep === 1 && (
          <Station2Dilemma concreteStauchung={concreteStauchung} setConcreteStauchung={setConcreteStauchung} lossPercent_b500={lossPercent_b500} remaining_b500={remaining_b500} lossPercent_y1860={lossPercent_y1860} remaining_y1860={remaining_y1860} onNavigateTab={onNavigateTab} setActiveStep={setActiveStep} />
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
          <Station4LoadBalancing beamLength={beamLength} setBeamLength={setBeamLength} deadLoad={deadLoad} setDeadLoad={setDeadLoad} sagittaF={sagittaF} setSagittaF={setSagittaF} requiredP_kN={requiredP_kN} upwardLoad_u={upwardLoad_u} netMomentMidspan={netMomentMidspan} setActiveStep={setActiveStep} />
        )}

        {/* ========================================================================= */}
        {/* STATION 5: 80% - 95% STATISCH UNBESTIMMTE SYSTEME & ZWANGSMOMENTE */}
        {/* ========================================================================= */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-home-grau/20 pb-4">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md">
                Lektion 5 von 6 • 80% bis 95%
              </span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2">
                Statisch unbestimmte Systeme & Zwangsmomente (Sekundärmomente)
              </h3>
              <p className="text-sm text-text-main/80 mt-1">
                Schnittgrößenüberlagerung beim Durchlaufträger: Primärmomente, Sekundärmomente und das Konzept der Konkordanz.
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
                    Schnittgrößenüberlagerung bei statisch unbestimmten Durchlaufträgern:
                  </p>
                  <p>
                    Während sich ein Einfeldträger infolge Vorspannung ungehindert nach oben durchbiegen kann, 
                    behindern Zwischenauflager bei Durchlaufträgern die freie Formänderung. 
                    Diese Behinderung erzeugt Zwangslagerkräfte und zusätzliche Biegemomente.
                  </p>
                  <p>
                    Das aus der Vorspannung resultierende Gesamtmoment setzt sich aus zwei Komponenten zusammen:
                    dem isostatischen <strong>Primärmoment</strong> (<InlineMath math="M_{P,1} = -P \cdot e_p" />) und 
                    dem hyperstatischen <strong>Sekundärmoment</strong> (<InlineMath math="M_{P,2}" />), das 
                    zwischen den Stützenachsen streng linear verläuft.
                  </p>
                </div>
              </div>
            </div>

            {/* Formel und Konkordanz */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-shiraz flex items-center gap-2">
                  <Zap size={16} /> Aufspaltung der Vorspannmomente
                </h4>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/25 font-mono text-center">
                  <BlockMath math="M_P = M_{P,1} + M_{P,2}" />
                </div>
                <div className="space-y-2 text-xs text-text-main/85 leading-relaxed">
                  <p>
                    <strong>1. Isostatisches Primärmoment (<InlineMath math="M_{P,1}" />):</strong><br />
                    Entsteht unmittelbar aus der lokalen Exzentrizität des Spannglieds bezüglich des Querschnittsschwerpunkts:
                    <span className="font-mono block text-center py-1 text-slate-800">
                      <InlineMath math="M_{P,1} = -P \cdot e_p" />
                    </span>
                  </p>
                  <p>
                    <strong>2. Hyperstatisches Sekundärmoment (<InlineMath math="M_{P,2}" />):</strong><br />
                    Es entsteht aus den Zwangsauflagerkräften, die die Vorspannung an den Zwischenstützen hervorruft.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" /> Das Konzept der Konkordanz
                </h4>
                <div className="text-xs text-slate-700 space-y-2.5 leading-relaxed">
                  <p>
                    Ein Spanngliedverlauf wird als <strong>konkordant</strong> bezeichnet, wenn die durch 
                    die Vorspannung hervorgerufenen Verformungen an allen Zwischenauflagern identisch null sind.
                  </p>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 font-mono text-center font-bold">
                    <InlineMath math="M_{P,2} = 0 \iff M_P \equiv M_{P,1}" />
                  </div>
                  <p>
                    Bei konkordanter Spanngliedführung entstehen keine Zwangskräfte an den Auflagern. 
                    Nach dem Satz der linearen Transformation (Guyon) ändert eine lineare Verschiebung der Spanngliedlage über den Innenstützen (bei unveränderten Endlagen und gleicher Krümmung im Feld) die Aufteilung in Primär- und Sekundärmoment, nicht aber das Gesamtmoment M_P aus Vorspannung. Im GZT sind die statisch unbestimmten Anteile der Vorspannung (M_P,2) als Einwirkung zu berücksichtigen (EC2 5.10.8).
                  </p>
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
        {/* STATION 6: 95% - 100% EUROCODE 2 NACHWEISE & BEMESSUNGSREGELN */}
        {/* ========================================================================= */}
        {activeStep === 5 && (
          <Station6Nachweise setQuizAnswers={setQuizAnswers} quizAnswers={quizAnswers} onNavigateTab={onNavigateTab} setActiveStep={setActiveStep} />
        )}

      </div>
    </div>
  );
}
