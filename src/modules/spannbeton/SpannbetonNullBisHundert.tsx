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
          <div className="space-y-6">
            <div className="border-b border-home-grau/20 pb-4">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md">
                Lektion 2 von 6 • 20% bis 40%
              </span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2">
                Rheologische Baustoffphysik & Die Notwendigkeit hochfester Spannstähle
              </h3>
              <p className="text-sm text-text-main/80 mt-1">
                Kriechen und Schwinden des Betons als physikalische Ursache für die Notwendigkeit von Spannstahl Y1860.
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
                    Werkstoffphysikalische Randbedingungen:
                  </p>
                  <p>
                    Frühe Versuche zur Einführung von Vorspannungen (u. a. P. H. Jackson 1886, C. W. Doehring 1888) 
                    mit gewöhnlichem Baustahl führten nach kurzer Standzeit zum vollständigen Verlust der Vorspannkraft.
                  </p>
                  <p>
                    Die Ursache liegt im rheologischen Verhalten des Betons: Beton schwindet infolge Wasserabgabe 
                    an die Umgebung (<InlineMath math="\varepsilon_{cs}" />) und kriecht zeitabhängig unter Dauerlast (<InlineMath math="\varepsilon_{cc}" />). 
                    Die Gesamtverkürzung des Betons über die Nutzungsdauer erreicht typische Werte von 
                    <InlineMath math="\Delta \varepsilon_c \approx 1{,}0\text{ bis }1{,}2\,\text{‰}" />.
                  </p>
                </div>
              </div>
            </div>

            {/* Mechanischer Vergleich: B500 vs Y1860 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50/70 p-5 rounded-xl border border-red-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-red-900 flex items-center gap-1.5">
                    <TrendingDown size={16} /> Verhalten von normalem Betonstahl B500
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-red-200 text-red-900 px-2 py-0.5 rounded">
                    Untauglich für Vorspannung
                  </span>
                </div>
                <div className="text-xs text-red-950 space-y-2 leading-relaxed">
                  <p>
                    Betonstahl B500 besitzt eine Bemessungsstreckgrenze von <InlineMath math="f_{yd} = 435\,\text{N/mm}^2" />. 
                    Seine elastische Grenzdehnung beträgt:
                  </p>
                  <div className="p-2 bg-white rounded border border-red-200 font-mono text-center">
                    <InlineMath math="\varepsilon_{s,el} = \frac{f_{yd}}{E_s} = \frac{435}{200\,000} \approx 2{,}175\,\text{‰}" />
                  </div>
                  <p>
                    Verkürzt sich der Beton durch Kriechen und Schwinden um <InlineMath math="\Delta \varepsilon \approx 1{,}0\,\text{‰}" />, 
                    sinkt die Stahlspannung um:
                  </p>
                  <div className="p-2 bg-white rounded border border-red-200 font-mono text-center text-red-700 font-bold">
                    <InlineMath math="\Delta \sigma_s = E_s \cdot \Delta \varepsilon = 200\,000 \cdot 0{,}0010 = 200\,\text{N/mm}^2" />
                  </div>
                  <p className="font-semibold text-red-900">
                    Dies entspricht einem Verlust von rund 46 % (bei 1,0 ‰) bis über 80 % (bei 1,8 ‰) der zulässigen Spannung. 
                    Nach Abzug von Einbautoleranzen und Reibung verbleibt nahezu keine dauerhafte Spannkraft im System.
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50/80 p-5 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 size={16} /> Verhalten von hochfestem Spannstahl Y1860
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                    Normkonformer Standard
                  </span>
                </div>
                <div className="text-xs text-emerald-950 space-y-2 leading-relaxed">
                  <p>
                    Spannstahl Y1860 (z. B. 7-drähtige Spannstahllitzen) besitzt eine Zugfestigkeit von <InlineMath math="f_{pk} = 1860\,\text{N/mm}^2" />. 
                    Die zulässige Anfangsspannung beträgt nach EC2 <InlineMath math="\sigma_{pm0} = \min(0{,}75 \cdot f_{pk};\, 0{,}85 \cdot f_{p0{,}1k}) = 1360\,\text{N/mm}^2" />:
                  </p>
                  <div className="p-2 bg-white rounded border border-emerald-200 font-mono text-center">
                    <InlineMath math="\varepsilon_{p0} = \frac{\sigma_{pm0}}{E_p} = \frac{1360}{195\,000} \approx 6{,}97\,\text{‰}" />
                  </div>
                  <p>
                    Bei typischer Betonverkürzung von <InlineMath math="1{,}0\,\text{‰}" /> beträgt der Spannungsverlust:
                  </p>
                  <div className="p-2 bg-white rounded border border-emerald-200 font-mono text-center text-emerald-800 font-bold">
                    <InlineMath math="\Delta \sigma_p = 195\,000 \cdot 0{,}0010 = 195\,\text{N/mm}^2 \quad (\approx 14{,}3\,\%\text{ Verlust})" />
                  </div>
                  <p className="font-semibold text-emerald-900">
                    Über 80–85 % der eingeprägten Vorspannkraft bleiben dauerhaft wirksam. 
                    Erst hochfeste, kaltgezogene Stähle machten den Spannbetonbau baupraktisch realisierbar (Freyssinet, ab 1928 mit hochfesten Drähten).
                  </p>
                </div>
              </div>
            </div>

            {/* Interaktiver Simulator: Spannungsverlust durch Betonverkürzung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={15} /> Interaktive Simulation: Einfluss der Betonstauchung
                </span>
                <span className="text-xs font-mono font-bold text-text-main">
                  Verkürzung <InlineMath math="\Delta \varepsilon_c" />: <strong className="text-shiraz">{formatDeZahl(concreteStauchung, 2)} ‰</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs text-text-main/70 mb-1 flex justify-between font-semibold">
                  <span>Gesamte zeitabhängige Betonverkürzung (Kriechen <InlineMath math="\varepsilon_{cc}" /> + Schwinden <InlineMath math="\varepsilon_{cs}" />):</span>
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
                  <span>0,20 ‰ (Geringe Dauerlast)</span>
                  <span>typisch 0,8–1,5 ‰ (ε_cs + φ·σ_c/E_cm)</span>
                  <span>2,00 ‰ (Sehr ungünstiges Klima & hohe Dauerlast)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-red-50 p-3.5 rounded-lg border border-red-200">
                  <div className="text-[11px] font-bold text-red-900 mb-1 flex justify-between">
                    <span>Betonstahl B500</span>
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
                    <span>Spannstahl Y1860</span>
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
                <span className="font-bold text-text-main block">Detaillierte Beiwerte nach Eurocode 2:</span>
                Die exakten Zeitfunktionen für Relaxation, Kriechzahl <InlineMath math="\varphi(t,t_0)" /> und Endschwindmaß finden Sie im Reiter <strong>"Baustoffkennwerte"</strong>.
              </div>
              <div className="flex gap-2">
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('kennwerte')}
                    className="px-3.5 py-2 bg-white text-shiraz border border-shiraz/40 hover:bg-shiraz/10 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <BookOpen size={13} /> Zu den Baustoffkennwerten
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
        {/* STATION 3: 40% - 60% DIE 3 VORSPANNVERFAHREN */}
        {/* ========================================================================= */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-home-grau/20 pb-4">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md">
                Lektion 3 von 6 • 40% bis 60%
              </span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2">
                Die 4 Vorspannverfahren nach DIN EN 1992-1-1
              </h3>
              <p className="text-sm text-text-main/80 mt-1">
                Verfahrenstechnische Differenzierung: Sofortiger Verbund, nachträglicher Verbund, ohne Verbund und externe Vorspannung.
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
                    Verfahrenstechnische Differenzierung:
                  </p>
                  <p>
                    Die Krafteinleitung und der Verbundmechanismus zwischen Spannstahl und Betonkörper bestimmen 
                    die bautechnischen Verfahren im Spannbetonbau. Je nach statischer Anforderung, 
                    Bauwerksabmessung und Fertigungsort kommen vier genormte bzw. geregelte Verfahren zur Ausführung.
                  </p>
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
                  <h4 className="font-bold text-xs text-text-main">
                    1. Sofortiger Verbund (Spannbett)
                  </h4>
                  <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
                    <p>
                      <strong>Fertigungsablauf:</strong> Spannstahldrähte oder -litzen werden im Fertigteilwerk 
                      in langen Spannbetten gegen externe Widerlager vorgespannt. Nach Erreichen der Übertragungsfestigkeit 
                      wird der Stahl entspannt und durchtrennt.
                    </p>
                    <p>
                      <strong>Krafteinleitung:</strong> Rein über Verbundspannungen und den Hoyer-Effekt. 
                      Keine Endverankerungen im Bauteil nötig; Krafteinleitung über die Übertragungslänge <InlineMath math="l_{pt}" /> (EC2 8.10.2.2).
                    </p>
                  </div>
                </div>
                <div className="p-2 bg-blue-50/70 rounded-lg border border-blue-200 text-[10px] text-blue-900 font-medium">
                  <strong>Typische Bauteile:</strong> Hohlplattendecken, Spannbetonschwellen, TT-Dachplatten.
                </div>
              </div>

              {/* Verfahren 2 */}
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      Ortbeton & Brücken
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-text-main">
                    2. Nachträglicher Verbund (Hüllrohre)
                  </h4>
                  <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
                    <p>
                      <strong>Fertigungsablauf:</strong> Wellrohre (Stahlblech oder Kunststoff) werden vor dem 
                      Betonieren verlegt. Nach dem Erhärten werden Litzenbündel eingezogen, gegen den Beton gespannt und verankert.
                    </p>
                    <p>
                      <strong>Verbund & Schutz:</strong> Die Rohre werden mit Zementmörtel (DIN EN 447) hohlraumfrei injiziert, 
                      wodurch der Dehnungsverbund und der alkalische Korrosionsschutz entstehen.
                    </p>
                  </div>
                </div>
                <div className="p-2 bg-amber-50/70 rounded-lg border border-amber-200 text-[10px] text-amber-900 font-medium">
                  <strong>Typische Bauteile:</strong> Großbrücken (Freivorbau, Taktschiebeverfahren), weitgespannte Träger.
                </div>
              </div>

              {/* Verfahren 3 */}
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Hochbau & Flachdecken
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-text-main">
                    3. Ohne Verbund (Monolitzen mit PE)
                  </h4>
                  <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
                    <p>
                      <strong>Fertigungsablauf:</strong> Einzelne Litzen sind werkseitig mit Korrosionsschutzfett 
                      und nahtlosem PE-HD-Mantel umhüllt. Sie werden wie Bewehrung verlegt und direkt einbetoniert.
                    </p>
                    <p>
                      <strong>Mechanik:</strong> Kein lokaler Dehnungsverbund; Dehnungsänderungen verteilen sich über die 
                      gesamte freie Länge. Injektionsarbeiten entfallen vollständig.
                    </p>
                  </div>
                </div>
                <div className="p-2 bg-emerald-50/70 rounded-lg border border-emerald-200 text-[10px] text-emerald-900 font-medium">
                  <strong>Typische Bauteile:</strong> Punktgestützte Flachdecken im Hochbau, Parkhausdecken, Behälter.
                </div>
              </div>

              {/* Verfahren 4 */}
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                      Hohlkasten & Verstärkung
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-text-main">
                    4. Externe Vorspannung
                  </h4>
                  <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
                    <p>
                      <strong>Fertigungsablauf:</strong> Spannglieder verlaufen außerhalb des Betonquerschnitts 
                      (z. B. im Inneren von Hohlkästen oder zwischen Stegen) und sind nur an diskreten Umlenkblöcken und Endquerträgern verankert.
                    </p>
                    <p>
                      <strong>Vorteile:</strong> Dünnere Betonstege, keine Hüllrohrschwächung, visuelle Inspektion auf voller Länge möglich, 
                      einfacher Austausch oder Nachspannen im Bedarfsfall.
                    </p>
                  </div>
                </div>
                <div className="p-2 bg-purple-50/70 rounded-lg border border-purple-200 text-[10px] text-purple-900 font-medium">
                  <strong>Typische Bauteile:</strong> Hohlkastenbrücken, Ertüchtigung & Verstärkung von Bestandsbrücken.
                </div>
              </div>
            </div>

            {/* Querschnitts-Phasen Info */}
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/25 space-y-2">
              <h5 className="font-bold text-xs text-text-main flex items-center gap-2">
                <Info size={15} className="text-shiraz" />
                Querschnittsphasen im Zeitablauf
              </h5>
              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-home-grau/20">
                  <span className="font-bold text-slate-900 block">1. Bruttoquerschnitt <InlineMath math="A_c" /></span>
                  <span className="text-slate-600 text-[11px]">Reine Betonabmessungen vor Einlegen bzw. Aussparen von Hüllrohren.</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/20">
                  <span className="font-bold text-slate-900 block">2. Nettoquerschnitt <InlineMath math="A_n = A_c - A_{Kanal}" /></span>
                  <span className="text-slate-600 text-[11px]">Gilt im Vorspannzustand <InlineMath math="t=0" /> bei noch unverpressten Hüllrohren.</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/20">
                  <span className="font-bold text-slate-900 block">3. Ideeller Querschnitt <InlineMath math="A_i" /></span>
                  <span className="text-slate-600 text-[11px]">Gilt nach dem Verpressen für spätere Einwirkungen (<InlineMath math="A_i = A_c + (\alpha-1)A_p" />), bezogen auf den Bruttoquerschnitt (Hüllrohr verpresst); bei sofortigem Verbund gilt der ideelle Querschnitt bereits ab Spannkraftübertragung.</span>
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
                <ArrowLeft size={14} /> Zurück zu Kapitel 2
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-4 py-2 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                Weiter zu Kapitel 4 <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 4: 60% - 80% STATIK & LOAD BALANCING (T.Y. LIN) */}
        {/* ========================================================================= */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-home-grau/20 pb-4">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md">
                Lektion 4 von 6 • 60% bis 80%
              </span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2">
                Tragwerksmechanik & Das Load-Balancing-Verfahren (T. Y. Lin)
              </h3>
              <p className="text-sm text-text-main/80 mt-1">
                Umlenkkräfte: Kompensation ständiger Lasten durch gezielt gekrümmte Spanngliedführungen.
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
                    Wirkungsweise der Umlenkpressung (Load Balancing nach T. Y. Lin):
                  </p>
                  <p>
                    Ein im Bauteil parabelförmig gekrümmt geführtes Spannglied übt unter Längszug eine kontinuierliche 
                    Radialpressung gegen den umgebenden Beton aus. Diese Umlenkkraft wirkt der Schwerkraft entgegen 
                    und erzeugt eine nach oben gerichtete Streckenlast <InlineMath math="u = \frac{8 \cdot P \cdot f}{L^2}" />.
                  </p>
                  <p>
                    Nach der von T. Y. Lin formulierten Load-Balancing-Methode kann die Vorspannkraft <InlineMath math="P" /> so 
                    dimensioniert werden, dass die Umlenkkraft <InlineMath math="u" /> das Trägereigengewicht <InlineMath math="g" /> exakt 
                    kompensiert (<InlineMath math="u = g" />). In diesem Zustand treten unter Eigengewicht keine Biegemomente 
                    und keine Durchbiegungen auf; der Querschnitt befindet sich im Zustand reiner zentrischer Druckbeanspruchung.
                  </p>
                </div>
              </div>
            </div>

            {/* Formeln und Überlagerung */}
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-3">
                <h4 className="font-bold text-sm text-shiraz flex items-center gap-2">
                  <Compass size={16} /> Mathematische Formulierung der Umlenkkraft
                </h4>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Für eine Parabel mit dem Stich <InlineMath math="f" /> über die Stützweite <InlineMath math="L" /> 
                  ergibt sich die nach oben gerichtete Streckenlast <InlineMath math="u" /> aus der Seiltheorie zu:
                </p>
                <div className="p-3 bg-white rounded-lg border border-home-grau/25 text-center font-mono">
                  <BlockMath math="u = \frac{8 \cdot P \cdot f}{L^2}" />
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Für einen vollständigen Lastausgleich des Eigengewichts (<InlineMath math="u = g" />) 
                  berechnet sich die erforderliche Vorspannkraft zu:
                </p>
                <div className="p-3 bg-white rounded-lg border border-home-grau/25 text-center font-mono text-shiraz font-bold">
                  <BlockMath math="P_{bal} = \frac{g \cdot L^2}{8 \cdot f}" />
                </div>
              </div>

              {/* Randspannungsüberlagerung */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Layers size={16} className="text-shiraz" /> Superposition der Randspannungen
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                    <div>
                      <strong className="text-slate-900 block">1. Zentrischer Druckanteil:</strong>
                      <span className="text-slate-600 text-[11px]">Gleichmäßige Stauchung über die Querschnittsfläche.</span>
                    </div>
                    <span className="font-mono font-bold text-shiraz shrink-0">- P / A</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                    <div>
                      <strong className="text-slate-900 block">2. Exzentrizitätsmoment:</strong>
                      <span className="text-slate-600 text-[11px]">Spannglied unten erzeugt Druck unten, Zug oben.</span>
                    </div>
                    <span className="font-mono font-bold text-blue-700 shrink-0">± (P · e_p) / W</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                    <div>
                      <strong className="text-slate-900 block">3. Äußere Lastmomente:</strong>
                      <span className="text-slate-600 text-[11px]">Eigengewicht und Nutzlast erzeugen Druck oben, Zug unten.</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700 shrink-0">∓ M_ext / W</span>
                  </div>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 font-medium">
                  <strong>Ergebnis:</strong> An der Trägerunterseite kompensieren sich das negative Vorspannmoment 
                  und das positive Lastmoment nahezu vollständig.
                </div>
              </div>
            </div>

            {/* Interaktiver Load-Balancing-Rechner */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={15} /> Interaktiver Load-Balancing-Rechner
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  Lastausgleich: 100 % (Vollständig kompensiert)
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-main/70 mb-1 flex justify-between">
                    <span>Stützweite (L):</span>
                    <span className="font-mono text-shiraz font-bold">{formatDeWert(beamLength)} m</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={40}
                    step={1}
                    value={beamLength}
                    onChange={(e) => setBeamLength(Number(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-main/70 mb-1 flex justify-between">
                    <span>Eigengewicht (g):</span>
                    <span className="font-mono text-shiraz font-bold">{formatDeWert(deadLoad)} kN/m</span>
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={60}
                    step={5}
                    value={deadLoad}
                    onChange={(e) => setDeadLoad(Number(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-main/70 mb-1 flex justify-between">
                    <span>Parabelstich (f):</span>
                    <span className="font-mono text-shiraz font-bold">{formatDeZahl((sagittaF * 100), 0)} cm</span>
                  </label>
                  <input
                    type="range"
                    min={0.10}
                    max={0.90}
                    step={0.05}
                    value={sagittaF}
                    onChange={(e) => setSagittaF(Number(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                </div>
              </div>

              {/* Ergebnis-Karten */}
              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase font-bold block">Erforderliche Spannkraft</span>
                  <span className="text-lg font-mono font-black text-shiraz">{formatDeWert(requiredP_kN)} kN</span>
                  <span className="text-[10px] text-text-main/50 block font-mono">ca. {formatDeWert(Math.round(requiredP_kN / 150))} Standard-Litzen</span>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase font-bold block">Aufwärts-Umlenkkraft (u)</span>
                  <span className="text-lg font-mono font-black text-emerald-700">{formatDeWert(upwardLoad_u)} kN/m</span>
                  <span className="text-[10px] text-emerald-600 block font-bold">Kompensiert Eigengewicht g</span>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase font-bold block">Netto-Biegemoment aus (g - u)</span>
                  <span className="text-lg font-mono font-black text-slate-800">{formatDeWert(netMomentMidspan)} kNm</span>
                  <span className="text-[10px] text-slate-500 block font-mono">Reine Axialdruckkraft im Träger</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-3.5 py-2 bg-white text-text-main hover:bg-slate-100 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-home-grau/30 cursor-pointer"
              >
                <ArrowLeft size={14} /> Zurück zu Kapitel 3
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="px-4 py-2 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                Weiter zu Kapitel 5 <ArrowRight size={14} />
              </button>
            </div>
          </div>
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
          <div className="space-y-6">
            <div className="border-b border-home-grau/20 pb-4">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md">
                Lektion 6 von 6 • 95% bis 100%
              </span>
              <h3 className="text-xl md:text-2xl font-black text-text-main mt-2">
                Eurocode 2 Nachweiskonzept & Die 5 wesentlichen Bemessungsregeln
              </h3>
              <p className="text-sm text-text-main/80 mt-1">
                Überblick über Grenzzustände (GZT / GZG) und systematische Nutzung der Berechnungsreiter dieses Moduls.
              </p>
            </div>

            {/* Die 5 Bemessungsregeln */}
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-shiraz flex items-center gap-2 uppercase tracking-wider">
                <Sparkles size={16} /> Die 5 wesentlichen Bemessungs- und Nachweisregeln
              </h4>
              <div className="grid sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">1</span>
                    Vorzeichenkonvention nach DIN EN 1992-1-1
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Im Massivbau ist Druckspannung <strong>negativ (-)</strong> und Zugspannung <strong>positiv (+)</strong>. 
                    Ein im unteren Querschnittsbereich liegendes Spannglied (<InlineMath math="e_p > 0" />) erzeugt an der Unterseite Druck: 
                    <InlineMath math="\sigma = -P/A - (P \cdot e_p)/W" />.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">2</span>
                    Zeitabhängige Vorspannkraftzustände
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Es ist stets zwischen dem Zustand <InlineMath math="t=0" /> (unmittelbar nach Verankern, Reibung und Keilschlupf, <InlineMath math="P_0" />) 
                    und dem Zustand <InlineMath math="t=\infty" /> (nach Abzug aller Kriech-, Schwind- und Relaxationsverluste, <InlineMath math="P_\infty \approx 0{,}80\dots 0{,}85 P_{m0}" />; zeitabhängige Verluste typisch 10–20 % von <InlineMath math="P_{m0}" />, Gesamtverluste inkl. Reibung/Schlupf 20–30 % der Pressenkraft) zu unterscheiden.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">3</span>
                    Dekompressionsnachweis (GZG)
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Zum Schutz der Spannglieder vor Korrosion verlangt EC2 je nach Expositionsklasse den Dekompressionsnachweis (Tab. 7.1N bzw. NA Tab. 7.1DE): Der Beton um das Spannglied muss unter der maßgebenden Kombination überdrückt bleiben (XC2–XC4: quasi-ständig, XD/XS: häufig). EN: Spannglied mind. <InlineMath math="25\,\text{mm}" /> innerhalb der Druckzone; NA(DE): keine Zugspannungen an dem Rand, der dem Spannglied am nächsten liegt (Nachweis am ungerissenen Querschnitt, wie bereits DIN 1045-1).
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">4</span>
                    Günstige Querkraftwirkung der Vorspannung
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Geneigte Spannglieder erzeugen eine vertikale Kraftkomponente <InlineMath math="V_p = P \cdot \sin \alpha" />, 
                    die direkt querkraftentlastend wirkt. Zusätzlich erhöht die Längsdruckspannung <InlineMath math="\sigma_{cp}" /> die Betonschubtragfähigkeit <InlineMath math="V_{Rd,c}" />.
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1 sm:col-span-2">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-[10px] font-mono">5</span>
                    Berücksichtigung der elastischen und kriechenden Überhöhung (Camber)
                  </div>
                  <p className="text-amber-900 text-[11px] leading-relaxed">
                    Unter alleinigem Eigengewicht wölben sich stark vorgespannte Bauteile nach oben auf. 
                    Diese Überhöhung vergrößert sich zeitabhängig durch Beton-Kriechen und ist bei Anschlüssen 
                    nichttragender Trennwände und Fußbodenaufbauten planerisch zu berücksichtigen.
                  </p>
                </div>
              </div>
            </div>

            {/* Interaktiver Wissens-Check */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
                <span className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle size={15} className="text-shiraz" /> Wissensprüfung: Grundkonzepte des Spannbetonbaus
                </span>
                <span className="text-[10px] font-mono font-bold text-text-main/70 bg-white px-2 py-0.5 rounded border border-home-grau/20">
                  8 Fachfragen (EC2)
                </span>
              </div>

              {/* Frage 1 */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-text-main">
                  Frage 1: Warum kann normaler Betonstahl B500 nicht als Vorspannbewehrung eingesetzt werden?
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q1: 1 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q1 === 1
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    A) Er besitzt keinen ausreichenden alkalischen Korrosionsschutz im Beton.
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q1: 2 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q1 === 2
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    B) Die elastische Dehngrenze ist so niedrig, dass Kriechen und Schwinden fast die gesamte Spannkraft aufbrauchen.
                  </button>
                </div>
                {quizAnswers.q1 === 2 && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ Richtig: Die zeitabhängige Betonstauchung von typisch 1,0–1,5 ‰ baut rund 200–300 N/mm² des B500 ab – das sind etwa 46–70 % der elastischen Dehnung bei f_yd = 435 N/mm² (2,175 ‰).
                  </p>
                )}
                {quizAnswers.q1 === 1 && (
                  <p className="text-[11px] text-red-600 font-medium">
                    ✗ Nicht zutreffend: Der Passivierungsschutz ist identisch; die Ursache ist rein dehnungsmechanischer Natur.
                  </p>
                )}
              </div>

              {/* Frage 2 */}
              <div className="space-y-2 pt-2 border-t border-home-grau/15">
                <p className="text-xs font-bold text-text-main">
                  Frage 2: Welcher Zustand wird durch die Load-Balancing-Methode nach T. Y. Lin erreicht?
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q2: 1 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q2 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    A) Die vertikale Umlenkkraft kompensiert das Eigengewicht, sodass der Träger unter ständiger Last nur zentrischen Druck erfährt.
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q2: 2 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q2 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    B) Die Querkräfte an den Auflagern werden auf null reduziert.
                  </button>
                </div>
                {quizAnswers.q2 === 1 && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ Richtig: Bei vollständigem Lastausgleich (<InlineMath math="u = g" />) heben sich Durchbiegung und Biegespannungen unter Eigengewicht auf.
                  </p>
                )}
                {quizAnswers.q2 === 2 && (
                  <p className="text-[11px] text-red-600 font-medium">
                    ✗ Falsch: Die Umlenkkraft entlastet zwar das Feld, die Vertikallasten müssen aber weiterhin über die Auflager abgetragen werden.
                  </p>
                )}
              </div>

              {/* Frage 3 */}
              <div className="space-y-2 pt-2 border-t border-home-grau/15">
                <p className="text-xs font-bold text-text-main">
                  Frage 3: Welche Größe steht in Gl. (5.46) des Eurocode 2 im Kriechterm?
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q3: 1 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q3 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    A) <InlineMath math="\sigma_{c,QP}" /> in Spanngliedhöhe (unter quasi-ständiger Einwirkung)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q3: 2 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q3 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    B) <InlineMath math="\sigma_{c,p0}" /> am äußersten Querschnittsrand
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q3: 3 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q3 === 3
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    C) <InlineMath math="f_{ctm}" /> (mittlere Betonzugfestigkeit)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q3: 4 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q3 === 4
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    D) <InlineMath math="\sigma_{pm0}" /> (zulässige Vorspannung zum Spannzeitpunkt)
                  </button>
                </div>
                {quizAnswers.q3 === 1 && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ Richtig: In Gl. (5.46) geht exakt die Betondruckspannung <InlineMath math="\sigma_{c,QP}" /> in Höhe des Spanngliedschwerpunkts unter der quasi-ständigen Einwirkungskombination ein.
                  </p>
                )}
                {quizAnswers.q3 && quizAnswers.q3 !== 1 && (
                  <p className="text-[11px] text-red-600 font-medium">
                    ✗ Falsch: Für das Kriechen des Verbundbetons ist allein die Betonspannung in Spanngliedachse unter quasi-ständiger Last maßgebend.
                  </p>
                )}
              </div>

              {/* Frage 4 */}
              <div className="space-y-2 pt-2 border-t border-home-grau/15">
                <p className="text-xs font-bold text-text-main">
                  Frage 4: Warum ist der Nenner von Gl. (5.46) im EC2 größer als 1?
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q4: 1 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q4 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    A) Rückkopplungseffekt: Durch den Spannkraftverlust sinkt die Betondruckspannung, wodurch das weitere Kriechen gebremst wird.
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q4: 2 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q4 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    B) Als pauschaler Teilsicherheitsbeiwert gegen Spanndrahtbruch.
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q4: 3 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q4 === 3
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    C) Berücksichtigung der Querdehnungszahl des Stahls.
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q4: 4 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q4 === 4
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    D) Erhöhung des Verlusts infolge dynamischer Ermüdungslasten.
                  </button>
                </div>
                {quizAnswers.q4 === 1 && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ Richtig: Der Nenner <InlineMath math="1 + \frac{E_p}{E_{cm}}\frac{A_p}{A_c}(1 + \frac{A_c}{I_c}z_{cp}^2)[1 + 0{,}8\varphi]" /> bildet die elastisch-viskose Rückkopplung zwischen Stahl und Beton exakt ab.
                  </p>
                )}
                {quizAnswers.q4 && quizAnswers.q4 !== 1 && (
                  <p className="text-[11px] text-red-600 font-medium">
                    ✗ Falsch: Der Nenner ist ein rein elastomechanischer Verbundterm, der die dämpfende Rückkopplung abbildet.
                  </p>
                )}
              </div>

              {/* Frage 5 */}
              <div className="space-y-2 pt-2 border-t border-home-grau/15">
                <p className="text-xs font-bold text-text-main">
                  Frage 5: Ab welcher Betondruckspannung ist nach DIN EN 1992-1-1 nichtlineares Kriechen anzusetzen?
                </p>
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
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ Richtig: Nach EC2 3.1.4(4) muss bei Druckspannungen über <InlineMath math="0{,}45 f_{ck}(t_0)" /> das nichtlineare Kriechen mit dem Vergrößerungsbeiwert <InlineMath math="\exp(1{,}5(k_\sigma - 0{,}45))" /> berücksichtigt werden.
                  </p>
                )}
                {quizAnswers.q5 && quizAnswers.q5 !== 1 && (
                  <p className="text-[11px] text-red-600 font-medium">
                    ✗ Falsch: <InlineMath math="0{,}60 f_{ck}" /> ist die Grenze zur Vermeidung von Längsrissen unter charakteristischer Last; für lineares Kriechen gilt strikt <InlineMath math="0{,}45 f_{ck}(t_0)" />.
                  </p>
                )}
              </div>

              {/* Frage 6 */}
              <div className="space-y-2 pt-2 border-t border-home-grau/15">
                <p className="text-xs font-bold text-text-main">
                  Frage 6: Was versteht man unter einer „konkordanten“ Spanngliedführung?
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q6: 1 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q6 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    A) Spanngliedführung bei statisch unbestimmten Systemen, die keine Zwangsschnittgrößen (<InlineMath math="M_{P,2} = 0" />) und Auflagerreaktionen hervorruft.
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q6: 2 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q6 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    B) Eine rein zentrische Spanngliedführung in der Schwerachse des Trägers.
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q6: 3 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q6 === 3
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    C) Eine Spanngliedführung mit über alle Felder konstantem Krümmungsradius.
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q6: 4 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q6 === 4
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    D) Parallele Führung von schlaffer Bewehrung und Spanngliedern.
                  </button>
                </div>
                {quizAnswers.q6 === 1 && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ Richtig: Bei konkordanten Spanngliedern entspricht die Verkrümmungslinie einer Biegelinie infolge eines zulässigen Lastfalls; sekundäre Zwangsmomente <InlineMath math="M_{P,2}" /> treten nicht auf.
                  </p>
                )}
                {quizAnswers.q6 && quizAnswers.q6 !== 1 && (
                  <p className="text-[11px] text-red-600 font-medium">
                    ✗ Falsch: Konkordanz bezieht sich spezifisch auf das Verschwinden von statisch unbestimmten Zwangsschnittgrößen (<InlineMath math="M_{P,2} = 0" />).
                  </p>
                )}
              </div>

              {/* Frage 7 */}
              <div className="space-y-2 pt-2 border-t border-home-grau/15">
                <p className="text-xs font-bold text-text-main">
                  Frage 7: Welcher physikalische Effekt bestimmt maßgeblich die Einflusslänge des Keilschlupfs <InlineMath math="l_{set}" />?
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q7: 1 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q7 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    A) Die Reibung zwischen Spannglied und Hüllrohr (<InlineMath math="l_{set} = \sqrt{w \cdot E_p \cdot A_p / p}" />)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q7: 2 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q7 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    B) Die Druckfestigkeit des Betons unter der Ankerplatte
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q7: 3 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q7 === 3
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    C) Der thermische Ausdehnungskoeffizient des Keilstahls
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q7: 4 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q7 === 4
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    D) Die Hydratationswärme des Einpressmörtels
                  </button>
                </div>
                {quizAnswers.q7 === 1 && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ Richtig: Die Umkehr der Reibungskraft beim Einziehen der Keile baut den Schlupfverlust über die Schlupflänge <InlineMath math="l_{set}" /> kontinuierlich ab.
                  </p>
                )}
                {quizAnswers.q7 && quizAnswers.q7 !== 1 && (
                  <p className="text-[11px] text-red-600 font-medium">
                    ✗ Falsch: Die Schlupfeinflusslänge wird primär durch den Reibungsverlustgradienten <InlineMath math="p" /> entlang des Hüllrohrs begrenzt.
                  </p>
                )}
              </div>

              {/* Frage 8 */}
              <div className="space-y-2 pt-2 border-t border-home-grau/15">
                <p className="text-xs font-bold text-text-main">
                  Frage 8: Warum ist vergüteter Spannstahl in älteren Bestandsbrücken besonders kritisch?
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q8: 1 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q8 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    A) Hohe Anfälligkeit für wasserstoffinduzierte Spannungsrisskorrosion (SpRK) mit plötzlichem Sprödbruch ohne Vorankündigung.
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q8: 2 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q8 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    B) Er neigt bei Frost zu starkem thermischen Schrumpfen.
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q8: 3 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q8 === 3
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    C) Fehlende Zinkbeschichtung führt zu sofortiger Flächenkorrosion.
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q8: 4 }))}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q8 === 4
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    D) Er besitzt eine unzureichende Ermüdungsfestigkeit bei Windschwingungen.
                  </button>
                </div>
                {quizAnswers.q8 === 1 && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ Richtig: Vergütete Stähle (z. B. Neptun, Hennigsdorfer) versagen unter korrosiver Feuchte oft schlagartig ohne sichtbare Rissbildung; dafür existiert die BMVI-Handlungsanweisung.
                  </p>
                )}
                {quizAnswers.q8 && quizAnswers.q8 !== 1 && (
                  <p className="text-[11px] text-red-600 font-medium">
                    ✗ Falsch: Die Gefahr liegt in der gefürchteten wasserstoffinduzierten Spannungsrisskorrosion (SpRK) mit schlagartigem Sprödbruch.
                  </p>
                )}
              </div>
            </div>

            {/* Übersicht und Weiterleitung in die Fachreiter (Helle Ausführung gemäß GEMINI.md) */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
              <div>
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider font-mono">
                  Leitfaden abgeschlossen • 100 % Wissensstand
                </span>
                <h4 className="text-lg md:text-xl font-bold text-text-main mt-1">
                  Werkzeugübersicht: Die Berechnungsreiter des Moduls
                </h4>
                <p className="text-xs md:text-sm text-text-main/80 mt-1 max-w-2xl leading-relaxed">
                  Nutzen Sie die spezialisierten Reiter dieses Moduls zur vertiefenden Untersuchung 
                  und quantitativen Bemessung:
                </p>
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
                        <span className="font-bold text-xs block text-text-main">1. Grundprinzipien</span>
                        <span className="text-[11px] text-text-main/70 mt-1 block">
                          Dehnungssimulator, Einfeldträger-Vergleich & Tragwerkstheorie.
                        </span>
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
                        <span className="font-bold text-xs block text-text-main">2. Baustoffkennwerte</span>
                        <span className="text-[11px] text-text-main/70 mt-1 block">
                          Kriechen, Schwinden & Stahlrelaxation nach EC2.
                        </span>
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
                        <span className="font-bold text-xs block text-text-main">3. Querschnitts-Rechner</span>
                        <span className="text-[11px] text-text-main/70 mt-1 block">
                          Spannungsdreiecke, Bewehrungsgrad & Rissmomente.
                        </span>
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
                        <span className="font-bold text-xs block text-text-main">4. Dauerhaftigkeit</span>
                        <span className="text-[11px] text-text-main/70 mt-1 block">
                          Expositionsklassen, Betondeckung & Korrosionsschutz.
                        </span>
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
                <ArrowLeft size={14} /> Zurück zu Kapitel 5
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
