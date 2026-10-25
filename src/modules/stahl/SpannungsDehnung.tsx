import { Activity, Layers, Check, Maximize2, Sparkles, Scale, Shield } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { formatDeWert, formatDeZahl } from '@/src/utils/numberFormat';
import { steelCurveDefinitions } from './daten';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions, Point } from 'chart.js';
import { Slider } from '@/src/components/ui/Slider';
import type { SteelCurveDefinition } from './daten';
import type { Dispatch, SetStateAction } from 'react';

interface SpannungsDehnungProps {
  activeSimSteel: SteelCurveDefinition;
  selectedCurves: string[];
  setSelectedCurves: Dispatch<SetStateAction<string[]>>;
  setSimGradeId: Dispatch<SetStateAction<string>>;
  setStrainZoom: Dispatch<SetStateAction<"auto" | "detail" | "work" | "full">>;
  setTestStrain: Dispatch<SetStateAction<number>>;
  simGradeId: string;
  simPhase: { phase: string; text: string; color: string; };
  simStress: number;
  strainZoom: "auto" | "detail" | "work" | "full";
  stressStrainChartOptions: ChartOptions<'line'> & { scales: { x: { max: number }; y: { max: number } } };
  stressStrainMultiData: ChartData<'line', Point[]>;
  testStrain: number;
}

export default function SpannungsDehnung({ activeSimSteel, selectedCurves, setSelectedCurves, setSimGradeId, setStrainZoom, setTestStrain, simGradeId, simPhase, simStress, strainZoom, stressStrainChartOptions, stressStrainMultiData, testStrain }: SpannungsDehnungProps) {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300">
        {/* Header & Didaktische Einführung */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-home-grau/15 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-shiraz/10 text-shiraz rounded-xl">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-main">
                  Spannungs-Dehnungs-Linien (<InlineMath math="\sigma" />-<InlineMath math="\varepsilon" />) unterschiedlicher Stahlsorten
                </h3>
                <p className="text-xs text-text-main/70">
                  Vergleich des Verformungs- und Versagensverhaltens nach DIN EN ISO 6892-1 (Zugversuch)
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-shiraz/10 text-shiraz px-3 py-1 rounded-full border border-shiraz/20">
              DIN EN 1993-1-1 / DIN EN ISO 6892-1
            </span>
          </div>

          <p className="text-sm text-text-main/80 leading-relaxed">
            Die <strong>Spannungs-Dehnungs-Linie</strong> ist der maßgebende Fingerabdruck jedes metallischen Werkstoffs. Sie beschreibt die mechanische Reaktion eines Prüfstabs unter einachsiger Zugbeanspruchung und gliedert sich in vier charakteristische Werkstoffphasen:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl space-y-1">
              <span className="font-bold text-blue-900 block flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span> 1. Elastischer Bereich (Hooke)
              </span>
              <p className="text-blue-950/80 leading-relaxed">
                Lineare Steigung durch atomare Gitterdehnung: <InlineMath math="\sigma = E \cdot \varepsilon" />. Vollständig reversibel. Steigung entspricht dem <InlineMath math="E" />-Modul (<InlineMath math="\approx 210.000\text{ MPa}" />).
              </p>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-1">
              <span className="font-bold text-amber-900 block flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span> 2. Fließbeginn (<InlineMath math="f_y" /> bzw. <InlineMath math="R_{p0{,}2}" />)
              </span>
              <p className="text-amber-950/80 leading-relaxed">
                Übergang zu irreversiblen Versetzungsbewegungen. Baustähle zeigen ein horizontales Lüders-Plateau; hochfeste Stähle fließen stetig (Ersatzstreckgrenze <InlineMath math="R_{p0{,}2}" />).
              </p>
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl space-y-1">
              <span className="font-bold text-emerald-900 block flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span> 3. Kaltverfestigung (<InlineMath math="f_u" />)
              </span>
              <p className="text-emerald-950/80 leading-relaxed">
                Versetzungen stauen sich an Korngrenzen auf und behindern sich gegenseitig. Die Spannung steigt bis zum Höchstwert <InlineMath math="f_u" /> bei der Gleichmaßdehnung <InlineMath math="A_{gt}" />.
              </p>
            </div>

            <div className="p-3 bg-rose-50/70 border border-rose-200/60 rounded-xl space-y-1">
              <span className="font-bold text-rose-900 block flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span> 4. Einschnürung &amp; Bruch (<InlineMath math="A" />)
              </span>
              <p className="text-rose-950/80 leading-relaxed">
                Instabile plastische Einschnürung an der schwächsten Stelle. Der tragende Querschnitt verengt sich bis zum Scherbruch bei der Bruchdehnung <InlineMath math="A" />.
              </p>
            </div>
          </div>
        </div>

        {/* Interaktives Multi-Kurven Diagramm */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-home-grau/15">
            <div>
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <Layers className="text-shiraz h-5 w-5" />
                Vergleichende <InlineMath math="\sigma" />-<InlineMath math="\varepsilon" />-Kennlinien im Großformat
              </h4>
              <div className="text-xs text-text-main/70 flex items-center gap-2 flex-wrap mt-0.5">
                <span>{selectedCurves.length} Werkstoffe aktiv eingeblendet (Klick auf Güten zur Selektion)</span>
                {strainZoom === 'auto' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                    <Check size={12} className="text-emerald-600" />
                    Auto-Fit: ε ≤ {formatDeWert(stressStrainChartOptions.scales.x.max)} % | σ ≤ {formatDeWert(stressStrainChartOptions.scales.y.max)} MPa
                  </span>
                )}
              </div>
            </div>

            {/* Zoom- / Skalierungs-Stufen */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <span className="text-[11px] font-bold text-slate-500 uppercase px-2 flex items-center gap-1">
                <Maximize2 size={13} /> Skalierung:
              </span>
              <button aria-pressed={strainZoom === 'auto'}
                onClick={() => setStrainZoom('auto')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    strainZoom === 'auto' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                title="Passt X- und Y-Achse automatisch an Maximalwerte der aktiven Stähle an"
              >
                Auto-Skalierung
              </button>
              <button aria-pressed={strainZoom === 'detail'}
                onClick={() => setStrainZoom('detail')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    strainZoom === 'detail' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Fließbeginn (0–3 %)
              </button>
              <button aria-pressed={strainZoom === 'work'}
                onClick={() => setStrainZoom('work')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    strainZoom === 'work' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Arbeitsbereich (0–15 %)
              </button>
              <button aria-pressed={strainZoom === 'full'}
                onClick={() => setStrainZoom('full')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    strainZoom === 'full' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Gesamt (0–50 %)
              </button>
            </div>
          </div>

          {/* Schnell-Filter & Güten-Schalter */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider">Schnellauswahl:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedCurves(steelCurveDefinitions.map(s => s.id))}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium cursor-pointer"
                >
                  Alle einblenden
                </button>
                <button
                  onClick={() => setSelectedCurves(['S235', 'S355', 'S460', 'S690', 'S960'])}
                  className="px-2.5 py-1 rounded-lg border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-800 font-medium cursor-pointer"
                >
                  Nur Baustähle (S235–S960)
                </button>
                <button
                  onClick={() => setSelectedCurves(['B500A', 'B500B', 'SAS670', 'Y1860'])}
                  className="px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-800 font-medium cursor-pointer"
                >
                  Bewehrungs- &amp; Spannstähle
                </button>
                <button
                  onClick={() => setSelectedCurves(['B500B', 'Y1860'])}
                  className="px-2.5 py-1 rounded-lg border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-purple-800 font-medium cursor-pointer"
                >
                  Fokus: Betonstahl vs. Spannstahl
                </button>
              </div>
            </div>

            {/* Einzel-Güten Schalter */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {steelCurveDefinitions.map((def) => {
                const isChecked = selectedCurves.includes(def.id);
                return (
                  <button
                    key={def.id}
                    onClick={() => {
                      if (isChecked) {
                        if (selectedCurves.length > 1) {
                          setSelectedCurves(selectedCurves.filter(id => id !== def.id));
                        }
                      } else {
                        setSelectedCurves([...selectedCurves, def.id]);
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isChecked 
                          ? 'bg-white shadow-sm' 
                          : 'bg-slate-50/60 border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    style={{ 
                      borderColor: isChecked ? def.color : undefined,
                      boxShadow: isChecked ? `0 0 0 2px ${def.color}25` : undefined 
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: def.color }} />
                      <div className="overflow-hidden">
                        <div className="font-bold text-xs text-text-main truncate">{def.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">fy={formatDeWert(def.fy)} | fu={formatDeWert(def.fu)}</div>
                      </div>
                    </div>
                    <span className={`text-[11px] font-bold ${isChecked ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {isChecked ? '✓' : '+'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="relative w-full h-[440px] bg-slate-50/30 rounded-xl p-2 border border-home-grau/15">
            <Line data={stressStrainMultiData} options={stressStrainChartOptions} />
          </div>

          {/* Virtueller Zugversuch / Prüfdehnungs-Schieber */}
          <div className="bg-off-white/80 p-5 rounded-2xl border border-home-grau/25 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-home-grau/15 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="text-shiraz h-5 w-5" />
                <span className="text-sm font-bold text-text-main">
                  Virtueller Zugversuch: Belastungssimulator bei Dehnung <InlineMath math="\varepsilon" />
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 min-w-0 max-w-full">
                <span className="text-xs font-semibold text-slate-500">Prüfwerkstoff:</span>
                <select aria-label="Prüfwerkstoff"
                  value={simGradeId}
                  onChange={(e) => setSimGradeId(e.target.value)}
                  className="w-full sm:w-auto max-w-full min-w-0 p-1.5 text-xs font-bold border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:border-shiraz"
                >
                  {steelCurveDefinitions.map(def => (
                    <option key={def.id} value={def.id}>{def.name} ({def.sub})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              <div className="lg:col-span-7 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-text-main">Aktuelle Dehnungsbeaufschlagung <InlineMath math="\varepsilon" />:</span>
                  <span className="font-mono text-base font-black text-shiraz bg-white px-2.5 py-0.5 rounded border border-home-grau/20 shadow-xs">
                    {formatDeZahl(testStrain, 2)} % ({formatDeZahl((testStrain * 10), 1)} ‰)
                  </span>
                </div>
                <Slider
                  label="Prüfdehnung ε"
                  min={0}
                  max={activeSimSteel.A}
                  step={0.1}
                  value={testStrain}
                  unit="%"
                  onChange={(e) => setTestStrain(Number(e.target.value))}
                />
                <p className="text-[11px] text-slate-500 leading-normal">
                  * Bewegen Sie den Schieber, um die Verformungsschritte und den mikromechanischen Zustand in Echtzeit zu analysieren.
                </p>
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 gap-2.5">
                <div className="bg-white p-3 rounded-xl border border-home-grau/20 flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spannung <InlineMath math="\sigma" /></span>
                  <span className="text-lg font-black text-shiraz font-mono mt-0.5">
                    {simStress > 0 ? `${formatDeZahl(simStress, 1)} MPa` : '0 MPa'}
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5">N/mm² Zugspannung</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-home-grau/20 flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ausnutzung</span>
                  <span className="text-lg font-black text-slate-800 font-mono mt-0.5">
                    {activeSimSteel.fu > 0 ? `${Math.min(100, ((simStress / activeSimSteel.fu) * 100)).toFixed(0)} %` : '0 %'}
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5">bezogen auf <InlineMath math="f_u" /></span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-home-grau/20 col-span-2 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Werkstoffphase</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${simPhase.color}`}>
                      {simPhase.phase}
                    </span>
                  </div>
                  <p className="text-xs text-text-main/80 font-normal leading-normal">
                    {simPhase.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Didaktische Fachkarten im 2x2-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Karte 1 */}
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-home-grau/15 pb-2.5">
              <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Activity size={18} />
              </div>
              <h4 className="font-bold text-sm text-text-main">
                1. Ausgeprägte Streckgrenze vs. Dehngrenze <InlineMath math="R_{p0{,}2}" />
              </h4>
            </div>
            <div className="text-xs text-text-main/80 space-y-2 leading-relaxed">
              <p>
                <strong>Warum haben S235 und S355 ein horizontales Fließplateau?</strong><br />
                In weichen unlegierten Baustählen sind freie Kohlenstoff- und Stickstoffatome im Ferritgitter eingelagert. Sie wandern zu Versetzungskernen und blockieren diese (sog. <em>Cottrell-Atmosphären</em>). Zum Start der Verformung wird eine hohe Aktivierungsenergie benötigt (<InlineMath math="R_{eH}" />, obere Streckgrenze). Sobald sich die Versetzungen losgerissen haben, gleiten sie sprunghaft unter geringerer Kraft weiter (<InlineMath math="R_{eL}" />, untere Streckgrenze), bis sich makroskopische <strong>Lüders-Bänder</strong> über das Bauteil ausgebreitet haben.
              </p>
              <p>
                <strong>Warum fließen hochfeste Stähle &amp; Spannstähle stetig?</strong><br />
                Durch intensive Kaltverformung (Ziehen von Spannlitzen Y1860) oder thermomechanisches Vergüten (S690/S960) ist das Gitter bereits mit Abermillionen von Versetzungen durchsetzt. Es gibt kein Cottrell-Losreißen mehr. Da der Fließbeginn kontinuierlich erfolgt, wird normativ die <strong>0,2 %-Dehngrenze <InlineMath math="R_{p0{,}2}" /></strong> (Spannung bei 0,2 % bleibender plastischer Restdehnung) als Streckgrenze definiert.
              </p>
            </div>
          </div>

          {/* Karte 2 */}
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-home-grau/15 pb-2.5">
              <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                <Scale size={18} />
              </div>
              <h4 className="font-bold text-sm text-text-main">
                2. Festigkeit vs. Duktilität (Das Werkstoff-Dilemma)
              </h4>
            </div>
            <div className="text-xs text-text-main/80 space-y-2 leading-relaxed">
              <p>
                <strong>Der fundamentale Zielkonflikt der Metallurgie:</strong><br />
                Grundsätzlich gilt: <em>Je höher die Zugfestigkeit eines Stahls, desto geringer ist seine plastische Bruchdehnung (<InlineMath math="A" />) und Gleichmaßdehnung (<InlineMath math="A_{gt}" />)</em>.
              </p>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>S235JR (Weicher Baustahl):</span>
                  <span className="font-bold text-blue-700">fy = 235 MPa | A ≥ 26 %</span>
                </div>
                <div className="flex justify-between">
                  <span>S690QL (Vergütungsstahl):</span>
                  <span className="font-bold text-purple-700">fy = 690 MPa | A ≥ 14 %</span>
                </div>
                <div className="flex justify-between">
                  <span>Y1860 S7 (Spannlitze):</span>
                  <span className="font-bold text-shiraz">fpk = 1860 MPa | Agt ≥ 3,5 %</span>
                </div>
              </div>
              <p>
                <strong>Bedeutung für die Tragsicherheit:</strong> Hohe Duktilität erlaubt im Stahl- und Verbundbau die Anwendung der <strong>Fließgelenktheorie (Plastizitätstheorie)</strong>. Bei unvorhergesehener Überlastung verformt sich das Bauteil sichtbar, baut Spannungsspitzen durch plastisches Fließen ab und warnt rechtzeitig vor Einsturz. Hochfeste Stähle hingegen reagieren empfindlich auf Kerben und versagen mit minimaler Vorwarnung.
              </p>
            </div>
          </div>

          {/* Karte 3 */}
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-home-grau/15 pb-2.5">
              <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                <Shield size={18} />
              </div>
              <h4 className="font-bold text-sm text-text-main">
                3. Physikalisches Grundgesetz: Die Konstanz des E-Moduls
              </h4>
            </div>
            <div className="text-xs text-text-main/80 space-y-2 leading-relaxed">
              <p>
                <strong>Warum steigt die Steifigkeit nicht mit der Festigkeit?</strong><br />
                Ein häufiges Missverständnis unter Studierenden: Ein Träger aus S690 biegt sich unter identischer elastischer Gebrauchslast <strong>exakt genauso stark durch</strong> wie ein geometrisch identischer Träger aus S235!
              </p>
              <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200/60 text-emerald-950 font-semibold text-center">
                <InlineMath math="E \approx 210.000\text{ N/mm² (MPa) für ALLE Baustähle!}" />
              </div>
              <p>
                <strong>Atomare Ursache:</strong> Der Elastizitätsmodul spiegelt die Steifigkeit der atomaren metallischen Bindung zwischen den Eisenatomen im Kristallgitter wider. Durch Legierungsanteile (&lt; 2 %) oder Wärmebehandlungen ändert sich der Atomabstand und die Bindungsenergie nicht messbar.
              </p>
              <p>
                <strong>Praxisfolge:</strong> Bei schlanken Tragwerken aus höherfesten Stählen (S460, S690) entscheidet fast immer der <strong>Gebrauchstauglichkeitsnachweis (Durchbiegung)</strong> oder die <strong>Stabilität (Biegedrillknicken / Beulen)</strong> nach Euler (<InlineMath math="N_{cr} = \pi^2 E I / s_k^2" />), nicht die Materialfestigkeit!
              </p>
            </div>
          </div>

          {/* Karte 4 */}
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-home-grau/15 pb-2.5">
              <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                <Sparkles size={18} />
              </div>
              <h4 className="font-bold text-sm text-text-main">
                4. Bewehrungsstahl vs. Spannstahl im Betonbau
              </h4>
            </div>
            <div className="text-xs text-text-main/80 space-y-2 leading-relaxed">
              <p>
                <strong>Zwei völlig unterschiedliche Philosophien im Betonbau:</strong>
              </p>
              <div className="space-y-1.5">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <strong className="text-emerald-800 block mb-0.5">Bewehrungsstahl (B500B / B500A / B500C):</strong>
                  Arbeitet im gerissenen Beton (Zustand II). Beton nimmt den Druck auf, Stahl die Zugkräfte. Verlangt hohe Rippung zur Rissbreitenbegrenzung und garantierte Duktilität (<InlineMath math="A_{gt} \ge 5\%" />), um bei Rissbildung Verformungsenergie aufzunehmen.
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <strong className="text-sky-800 block mb-0.5">Spannstahl (Y1860 S7 / SAS 670):</strong>
                  Wird vorweg aktiv auf ca. 70–80 % seiner Zugfestigkeit (<InlineMath math="\approx 1400\text{ MPa}" />) gedehnt, um den Beton künstlich zu überdrücken. Verhindert Risse komplett (Zustand I). Verlangt minimale Relaxation (<InlineMath math="\le 2{,}5\%" />) und darf wegen Sprödbruchgefahr <strong>unter keinen Umständen geschweißt</strong> werden!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
