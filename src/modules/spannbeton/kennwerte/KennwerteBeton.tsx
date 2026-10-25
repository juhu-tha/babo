import { Building, Activity, Thermometer, BookOpen, Check, ShieldAlert, Layers, Scale } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeWert, formatDeZahl } from '@/src/utils/numberFormat';
import type { Dispatch, SetStateAction } from 'react';

interface KennwerteBetonProps {
  activeMatData: { fck: number; fck_cube: number; fcm: number; fctm: number; fctk005: number; fctk095: number; Ecm: number; eps_c1: number; eps_cu1: number; eps_c2: number; eps_cu2: number; typicalUse: string; prestressSuitability: string; };
  concDatabase: Record<string, { fck: number; fck_cube: number; fcm: number; fctm: number; fctk005: number; fctk095: number; Ecm: number; eps_c1: number; eps_cu1: number; eps_c2: number; eps_cu2: number; typicalUse: string; prestressSuitability: string; }>;
  matAgeDays: number;
  matAggregate: "quarzit" | "basalt" | "kalkstein" | "sandstein";
  matBeamHeight: number;
  matCement: "R" | "N" | "S";
  matGrade: string;
  matMaturity: { t_eff: number; beta_cc: number; fcm_t: number; fck_t: number; Ecm_28: number; Ecm_t: number; aggFactor: number; fctm_t: number; fctk005_t: number; fctk095_t: number; fctm_fl_t: number; fcd_28: number; fcd_t: number; maturity_pct: number; releaseReady: boolean; releaseOptimum: boolean; sigma_c_zul: number; };
  matTemp: number;
  setMatAgeDays: Dispatch<SetStateAction<number>>;
  setMatAggregate: Dispatch<SetStateAction<"quarzit" | "basalt" | "kalkstein" | "sandstein">>;
  setMatBeamHeight: Dispatch<SetStateAction<number>>;
  setMatCement: Dispatch<SetStateAction<"R" | "N" | "S">>;
  setMatGrade: Dispatch<SetStateAction<string>>;
  setMatTemp: Dispatch<SetStateAction<number>>;
  stressStrainCurvePoints: { points: { eps: number; sigma: number; sigma_parabel: number; }[]; eps_c1: number; eps_cu1: number; fcm: number; fcd: number; eps_c2: number; eps_cu2: number; };
}

export default function KennwerteBeton({ activeMatData, concDatabase, matAgeDays, matAggregate, matBeamHeight, matCement, matGrade, matMaturity, matTemp, setMatAgeDays, setMatAggregate, setMatBeamHeight, setMatCement, setMatGrade, setMatTemp, stressStrainCurvePoints }: KennwerteBetonProps) {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Hauptkarte: Werkstoff-Labor & Reife-Simulator */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/15 pb-4">
            <div>
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <Building className="text-shiraz h-5 w-5" />
                0. Beton-Materialeigenschaften im Spannbetonbau
              </h4>
              <p className="text-xs text-text-main/70 mt-1">
                Druckfestigkeit (<InlineMath math="f_{ck}" />), Elastizitätsmodul (<InlineMath math="E_{cm}" />), Zugfestigkeiten (<InlineMath math="f_{ctm}" />) &amp; Reifeentwicklung nach DIN EN 1992-1-1 (Eurocode 2) Kap. 3.1 &amp; DIN 1045-2
              </p>
            </div>
            <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap">
              EC2 Tab. 3.1 &amp; Gl. (3.1)–(3.5)
            </span>
          </div>

          {/* Didaktische Einleitung */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
            <div>
              <strong className="text-text-main block mb-1">Warum sind die Betoneigenschaften im Spannbetonbau kritischer als im Stahlbeton?</strong>
              <p>
                Im klassischen Stahlbetonbau werden Risse in der Zugzone einkalkuliert. Im <strong>Spannbetonbau</strong> muss der Beton 
                enorme konzentrierte Einleitungsdrücke unter den Spannankern aufnehmen und über Jahrzehnte hinweg 
                kriech- und schwindarm bleiben. Die Dekompression verlangt Druckspannungen um das Spannglied (<InlineMath math="\sigma_c \le 0" />); die Zugfestigkeit ist dafür nicht maßgebend, wohl aber für die Rissschnittgröße und Rissvermeidung.
              </p>
            </div>
            <div>
              <strong className="text-text-main block mb-1">Vorspannzeitpunkt (<InlineMath math="t_0" />) &amp; Frühfestigkeit:</strong>
              <p>
                Die Spannkraft darf erst eingeleitet werden, wenn der Beton eine ausreichende Druckfestigkeit aufweist 
                (typischerweise <InlineMath math="f_{ck}(t) \ge 0{,}70 \cdot f_{ck}" />). Ein zu frühes Spannen führt zu 
                übermäßigen Kriechverlusten, Gefügezerrüttung und Verankerungsversagen.
              </p>
            </div>
          </div>

          {/* Interaktive Steuerung: Klasse, Zement, Alter, Temperatur, Gesteinskörnung */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={14} className="text-shiraz" />
                Interaktiver Werkstoff- &amp; Reifesimulator
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Aktuell: <strong className="text-shiraz font-bold">{matGrade}</strong> | Alter: <strong className="text-slate-800 font-bold">{formatDeWert(matAgeDays)} d</strong> ({formatDeWert(matTemp)} °C)
              </span>
            </div>

            {/* 1. Betonklassen Schnellwahlschalter */}
            <div>
              <label className="text-xs font-semibold text-text-main block mb-2">
                Druckfestigkeitsklasse wählen (DIN EN 1992-1-1 Tab. 3.1):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {Object.keys(concDatabase).map((grade) => {
                  const isSelected = matGrade === grade;
                  const item = concDatabase[grade];
                  return (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setMatGrade(grade)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-shiraz text-white border-shiraz shadow-sm ring-2 ring-shiraz/30'
                            : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                        }`}
                    >
                      <span className="text-xs font-bold font-mono">{grade}</span>
                      <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                        {formatDeWert(item.fck)} / {formatDeWert(item.fck_cube)} MPa
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Zement, Alter, Temperatur, Gesteinskörnung & Querschnittshöhe h */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
              {/* Zementklasse */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-main flex items-center justify-between">
                  <span>Zement-Klasse:</span>
                  <span className="font-mono text-shiraz font-bold">Klasse {matCement}</span>
                </label>
                <select
                  value={matCement}
                  onChange={(e) => setMatCement(e.target.value as 'R' | 'N' | 'S')}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium outline-none focus:border-shiraz"
                >
                  <option value="R">Klasse R (schnell; s = 0,20)</option>
                  <option value="N">Klasse N (normal; s = 0,25)</option>
                  <option value="S">Klasse S (langsam; s = 0,38)</option>
                </select>
                <p className="text-[10px] text-slate-500">Beiwert s in EC2 Gl. (3.2)</p>
              </div>

              {/* Betonalter t */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                  <span>Betonalter t:</span>
                  <span className="font-mono text-shiraz font-bold">{formatDeWert(matAgeDays)} d</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="90"
                  step="1"
                  value={matAgeDays}
                  onChange={(e) => setMatAgeDays(Number(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <button type="button" onClick={() => setMatAgeDays(1)} className="hover:text-shiraz cursor-pointer">1 d</button>
                  <button type="button" onClick={() => setMatAgeDays(3)} className="hover:text-shiraz cursor-pointer">3 d</button>
                  <button type="button" onClick={() => setMatAgeDays(7)} className="hover:text-shiraz cursor-pointer">7 d</button>
                  <button type="button" onClick={() => setMatAgeDays(28)} className="hover:text-shiraz cursor-pointer">28 d</button>
                  <button type="button" onClick={() => setMatAgeDays(90)} className="hover:text-shiraz cursor-pointer">90 d</button>
                </div>
              </div>

              {/* Erhärtungstemperatur T */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                  <span className="flex items-center gap-1">
                    <Thermometer size={13} className="text-shiraz" />
                    Temperatur T:
                  </span>
                  <span className="font-mono text-shiraz font-bold">{formatDeWert(matTemp)} °C</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={matTemp}
                  onChange={(e) => setMatTemp(Number(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <button type="button" onClick={() => setMatTemp(10)} className="hover:text-shiraz cursor-pointer">10 °C</button>
                  <button type="button" onClick={() => setMatTemp(20)} className="hover:text-shiraz cursor-pointer">20 °C</button>
                  <button type="button" onClick={() => setMatTemp(60)} className="hover:text-shiraz cursor-pointer">60 °C (Dampf)</button>
                </div>
              </div>

              {/* Gesteinskörnung */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-main flex items-center justify-between">
                  <span>Gestein (EC2 3.1.3):</span>
                  <span className="font-mono text-shiraz font-bold">α_E = {formatDeZahl(matMaturity.aggFactor, 2)}</span>
                </label>
                <select
                  value={matAggregate}
                  onChange={(e) => setMatAggregate(e.target.value as 'quarzit' | 'basalt' | 'kalkstein' | 'sandstein')}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium outline-none focus:border-shiraz"
                >
                  <option value="quarzit">Quarzit (α_E = 1,00)</option>
                  <option value="basalt">Basalt (+20 %, α_E = 1,20)</option>
                  <option value="kalkstein">Kalkstein (-10 %, α_E = 0,90)</option>
                  <option value="sandstein">Sandstein (-30 %, α_E = 0,70)</option>
                </select>
                <p className="text-[10px] text-slate-500">Beeinflusst E-Modul &amp; Kriechen</p>
              </div>

              {/* Querschnittshöhe h für Biegezugfestigkeit */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                  <span>Höhe h (f_ctm,fl):</span>
                  <span className="font-mono text-shiraz font-bold">{formatDeWert(matBeamHeight)} mm</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="2000"
                  step="50"
                  value={matBeamHeight}
                  onChange={(e) => setMatBeamHeight(Number(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>h = {formatDeWert(matBeamHeight)} mm</span>
                  <span>f_ctm,fl = {formatDeWert(matMaturity.fctm_fl_t)} MPa</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 KPI Highlight-Karten */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Druckfestigkeit */}
            <div className="p-4 rounded-xl bg-white border border-home-grau/30 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-text-main/70">
                <span className="font-semibold uppercase tracking-wider">Zylinderfestigkeit</span>
                <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">t = {formatDeWert(matAgeDays)} d</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-shiraz">{formatDeWert(matMaturity.fck_t)}</span>
                <span className="text-xs text-text-main/60 font-medium">N/mm² (f_ck(t))</span>
              </div>
              <div className="text-[11px] text-text-main/80 space-y-0.5 border-t border-home-grau/15 pt-2">
                <div className="flex justify-between">
                  <span>28-Tage-Normwert:</span>
                  <strong className="font-mono">{formatDeWert(activeMatData.fck)} N/mm²</strong>
                </div>
                <div className="flex justify-between">
                  <span>Mittlere Druckfestigkeit:</span>
                  <strong className="font-mono">{formatDeWert(matMaturity.fcm_t)} N/mm²</strong>
                </div>
                <div className="flex justify-between">
                  <span>Würfelfestigkeit f_ck,cube:</span>
                  <strong className="font-mono">{formatDeWert(activeMatData.fck_cube)} N/mm²</strong>
                </div>
                <div className="flex justify-between">
                  <span>Bemessungswert f_cd(t):</span>
                  <strong className="font-mono text-shiraz">{formatDeWert(matMaturity.fcd_t)} N/mm²</strong>
                </div>
              </div>
            </div>

            {/* Card 2: Elastizitätsmodul */}
            <div className="p-4 rounded-xl bg-white border border-home-grau/30 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-text-main/70">
                <span className="font-semibold uppercase tracking-wider">Elastizitätsmodul</span>
                <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">E_cm(t)</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">{formatDeWert(matMaturity.Ecm_t)}</span>
                <span className="text-xs text-text-main/60 font-medium">N/mm²</span>
              </div>
              <div className="text-[11px] text-text-main/80 space-y-0.5 border-t border-home-grau/15 pt-2">
                <div className="flex justify-between">
                  <span>28-Tage-Wert (mit Gestein):</span>
                  <strong className="font-mono">{formatDeWert(matMaturity.Ecm_28)} N/mm²</strong>
                </div>
                <div className="flex justify-between">
                  <span>Tabellenwert EC2 Tab. 3.1:</span>
                  <strong className="font-mono">{formatDeWert(activeMatData.Ecm)} N/mm²</strong>
                </div>
                <div className="flex justify-between">
                  <span>Gesteinsfaktor α_E:</span>
                  <strong className="font-mono">{formatDeZahl(matMaturity.aggFactor, 2)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Elastische Stauchung bei 10 MPa:</span>
                  <strong className="font-mono">{formatDeZahl(((10 / matMaturity.Ecm_t) * 1000), 2)} ‰</strong>
                </div>
              </div>
            </div>

            {/* Card 3: Zugfestigkeiten */}
            <div className="p-4 rounded-xl bg-white border border-home-grau/30 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-text-main/70">
                <span className="font-semibold uppercase tracking-wider">Zugfestigkeit</span>
                <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">f_ctm(t)</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">{formatDeWert(matMaturity.fctm_t)}</span>
                <span className="text-xs text-text-main/60 font-medium">N/mm²</span>
              </div>
              <div className="text-[11px] text-text-main/80 space-y-0.5 border-t border-home-grau/15 pt-2">
                <div className="flex justify-between">
                  <span>Unteres 5%-Quantil f_ctk,0.05:</span>
                  <strong className="font-mono text-blue-700">{formatDeWert(matMaturity.fctk005_t)} N/mm²</strong>
                </div>
                <div className="flex justify-between">
                  <span>Oberes 95%-Quantil f_ctk,0.95:</span>
                  <strong className="font-mono text-purple-700">{formatDeWert(matMaturity.fctk095_t)} N/mm²</strong>
                </div>
                <div className="flex justify-between">
                  <span>Biegezugfestigkeit f_ctm,fl:</span>
                  <strong className="font-mono">{formatDeWert(matMaturity.fctm_fl_t)} N/mm²</strong>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Rissnachweis / Dekompression maßgebend: f_ctk,0.05</span>
                </div>
              </div>
            </div>

            {/* Card 4: Spannfreigabe & Reife */}
            <div className={`p-4 rounded-xl border shadow-xs space-y-2 ${
                matMaturity.releaseOptimum
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : matMaturity.releaseReady
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'bg-rose-50/70 border-rose-200'
              }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-slate-700">Spannfreigabe (Transfer)</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    matMaturity.releaseOptimum
                      ? 'bg-emerald-600 text-white'
                      : matMaturity.releaseReady
                      ? 'bg-amber-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}>
                  {matMaturity.releaseOptimum ? 'Optimal' : matMaturity.releaseReady ? 'Bedingt zulässig' : 'Gesperrt!'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold font-mono ${
                    matMaturity.releaseOptimum ? 'text-emerald-900' : matMaturity.releaseReady ? 'text-amber-900' : 'text-rose-900'
                  }`}>
                  {formatDeWert(matMaturity.maturity_pct)} %
                </span>
                <span className="text-xs text-slate-600 font-medium">von f_ck,28</span>
              </div>
              <div className="text-[11px] text-slate-700 space-y-0.5 border-t border-slate-300/40 pt-2">
                <div className="flex justify-between">
                  <span>Zulässige Betondruckspannung:</span>
                  <strong className="font-mono text-slate-900">{formatDeWert(matMaturity.sigma_c_zul)} N/mm²</strong>
                </div>
                <div className="text-[10px] text-slate-600">
                  <InlineMath math="\sigma_{c,zul} = 0{,}60 \cdot f_{ck}(t)" /> (EC2 5.10.2.2)
                </div>
                <div className="flex justify-between pt-0.5">
                  <span>Äquivalentes Alter t_eff:</span>
                  <strong className="font-mono">{formatDeWert(matMaturity.t_eff)} d</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Interaktives SVG-Diagramm: Spannungs-Dehnungs-Linie nach EC2 Bild 3.2 */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-home-grau/15 pb-2">
              <div>
                <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                  <Activity className="text-shiraz h-4 w-4" />
                  Spannungs-Dehnungs-Kennlinie (<InlineMath math="\sigma_c - \varepsilon_c" />) für {matGrade} bei t = {formatDeWert(matAgeDays)} d
                </h5>
                <p className="text-[11px] text-text-main/70">
                  Vergleich der realen Arbeitslinie nach DIN EN 1992-1-1 Gl. (3.14) mit dem Parabel-Rechteck-Diagramm (GZT)
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-shiraz">
                  <span className="w-3.5 h-1 bg-shiraz rounded-full inline-block"></span> Reale Arbeitslinie Gl. (3.14)
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-500">
                  <span className="w-3.5 h-0.5 border-b-2 border-dashed border-slate-500 inline-block"></span> Parabel-Rechteck (GZT)
                </span>
              </div>
            </div>

            {/* SVG Plot */}
            <div className="w-full overflow-x-auto bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <div className="min-w-[620px]">
                <svg viewBox="0 0 700 280" className="w-full h-64">
                  <defs>
                    <marker id="arrow-axis-mat" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                    </marker>
                  </defs>

                  {/* Koordinatensystem: Ursprung bei (70, 240) */}
                  {/* Y-Achse: Spannung sigma_c [N/mm²] (0 bis ca. 110 MPa) */}
                  {/* X-Achse: Stauchung eps_c [‰] (0 bis 4.0 ‰) */}
                  <line x1="70" y1="240" x2="660" y2="240" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-axis-mat)" />
                  <line x1="70" y1="240" x2="70" y2="20" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-axis-mat)" />

                  <text x="665" y="245" fontSize="11" fill="#475569" fontWeight="bold">Stauchung ε_c [‰]</text>
                  <text x="75" y="20" fontSize="11" fill="#475569" fontWeight="bold">Druckspannung σ_c [N/mm²]</text>

                  {/* Gitternetzlinien X (Dehnung 1.0, 2.0, 3.0, 3.5, 4.0 ‰) */}
                  {[1.0, 2.0, 3.0, 3.5].map((val) => {
                    const xPos = 70 + (val / 4.0) * 560;
                    return (
                      <g key={val}>
                        <line x1={xPos} y1="240" x2={xPos} y2="30" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                        <text x={xPos} y="255" fontSize="10" fill="#64748b" textAnchor="middle">{formatDeWert(val)} ‰</text>
                      </g>
                    );
                  })}

                  {/* Gitternetzlinien Y (Spannungsskalierung dynamisch an matMaturity.fcm_t) */}
                  {(() => {
                    const maxSigmaY = Math.max(50, Math.ceil(matMaturity.fcm_t * 1.15 / 10) * 10);
                    const yTicks = [
                      Math.round(maxSigmaY * 0.25),
                      Math.round(maxSigmaY * 0.5),
                      Math.round(maxSigmaY * 0.75),
                      maxSigmaY
                    ];

                    return yTicks.map((yVal) => {
                      const yPos = 240 - (yVal / maxSigmaY) * 200;
                      return (
                        <g key={yVal}>
                          <line x1="70" y1={yPos} x2="630" y2={yPos} stroke="#e2e8f0" strokeWidth="1" />
                          <text x="62" y={yPos + 3} fontSize="10" fill="#64748b" textAnchor="end">{formatDeWert(yVal)}</text>
                        </g>
                      );
                    });
                  })()}

                  {/* Skalierungsfunktionen */}
                  {(() => {
                    const maxSigmaY = Math.max(50, Math.ceil(matMaturity.fcm_t * 1.15 / 10) * 10);
                    const getX = (eps: number) => 70 + (eps / 4.0) * 560;
                    const getY = (sig: number) => 240 - (sig / maxSigmaY) * 200;

                    // Kurven-Pfade
                    const pts = stressStrainCurvePoints.points;
                    if (pts.length === 0) return null;

                    const pathReal = pts
                      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.eps)} ${getY(p.sigma)}`)
                      .join(' ');

                    const pathParabel = pts
                      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.eps)} ${getY(p.sigma_parabel)}`)
                      .join(' ');

                    // Peak Point Coordinates
                    const peakX = getX(activeMatData.eps_c1);
                    const peakY = getY(matMaturity.fcm_t);

                    // Ultimate Point Coordinates
                    const ultX = getX(activeMatData.eps_cu1);
                    const ultPt = pts[pts.length - 1];
                    const ultY = getY(ultPt ? ultPt.sigma : matMaturity.fcm_t * 0.85);

                    // Design strength line
                    const fcdY = getY(matMaturity.fcd_t);

                    return (
                      <g>
                        {/* Parabel-Rechteck-Pfad (GZT Bemessung) */}
                        <path d={pathParabel} fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5 4" />

                        {/* Reale Kurve (EC2 Gl. 3.14) */}
                        <path d={pathReal} fill="none" stroke="#990033" strokeWidth="3" />

                        {/* Scheitelpunkt f_cm Marker */}
                        <circle cx={peakX} cy={peakY} r="5" fill="#990033" stroke="#ffffff" strokeWidth="2" />
                        <line x1={peakX} y1={peakY} x2={peakX} y2="240" stroke="#990033" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="70" y1={peakY} x2={peakX} y2={peakY} stroke="#990033" strokeWidth="1" strokeDasharray="3 3" />
                        <text x={peakX + 8} y={peakY - 6} fontSize="11" fill="#990033" fontWeight="bold">
                          f_cm(t) = {formatDeWert(matMaturity.fcm_t)} MPa (ε_c1 = {formatDeWert(activeMatData.eps_c1)} ‰)
                        </text>

                        {/* Bruchstauchung ε_cu1 Marker (Arbeitslinie Gl. 3.14) */}
                        <circle cx={ultX} cy={ultY} r="4" fill="#990033" stroke="#ffffff" strokeWidth="1.5" />
                        <line x1={ultX} y1={ultY} x2={ultX} y2="240" stroke="#990033" strokeWidth="1" strokeDasharray="3 3" />
                        <text x={ultX} y={235} fontSize="10" fill="#990033" textAnchor="end" fontWeight="bold">
                          Arbeitslinie: ε_cu1 = {formatDeWert(activeMatData.eps_cu1)} ‰
                        </text>

                        {/* Parabel-Rechteck Marker: eps_c2 und eps_cu2 */}
                        {(() => {
                          const c2X = getX(activeMatData.eps_c2);
                          const cu2X = getX(activeMatData.eps_cu2);
                          return (
                            <g>
                              <line x1={c2X} y1={fcdY} x2={c2X} y2="240" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                              <text x={c2X} y={fcdY - 5} fontSize="9" fill="#475569" textAnchor="middle">
                                ε_c2 = {formatDeWert(activeMatData.eps_c2)} ‰
                              </text>
                              <line x1={cu2X} y1={fcdY} x2={cu2X} y2="240" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                              <text x={cu2X} y={fcdY - 5} fontSize="9" fill="#475569" textAnchor="end" fontWeight="bold">
                                Parabel Bruch: ε_cu2 = {formatDeWert(activeMatData.eps_cu2)} ‰
                              </text>
                            </g>
                          );
                        })()}

                        {/* Zulässige Vorspann-Spannung 0.60 fck */}
                        {(() => {
                          const zulY = getY(matMaturity.sigma_c_zul);
                          return (
                            <g>
                              <line x1="70" y1={zulY} x2="550" y2={zulY} stroke="#059669" strokeWidth="1.5" strokeDasharray="4 2" />
                              <text x="555" y={zulY + 3} fontSize="10" fill="#059669" fontWeight="bold">
                                zul σ_c = 0,60 f_ck(t) ({formatDeWert(matMaturity.sigma_c_zul)} MPa)
                              </text>
                            </g>
                          );
                        })()}

                        {/* fcd Bemessungswert */}
                        <line x1="70" y1={fcdY} x2="450" y2={fcdY} stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                        <text x="455" y={fcdY + 3} fontSize="10" fill="#64748b">
                          f_cd(t) = {formatDeWert(matMaturity.fcd_t)} MPa
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>
            </div>
            <p className="text-xs text-text-main/70">
              <strong>Didaktischer Hinweis:</strong> Achten Sie auf den Unterschied zwischen Normalbeton (C30/37 bis C50/60) 
              und Hochleistungsbeton (C70/85 und C90/105): Bei hochfestem Beton steigt der Scheitelwert drastisch an, 
              der abfallende Ast wird jedoch wesentlich steiler und die Bruchstauchung <InlineMath math="\varepsilon_{cu1}" /> 
              sinkt von 3,5 ‰ auf 2,8 ‰, <InlineMath math="\varepsilon_{cu2}" /> (Parabel-Rechteck) von 3,5 ‰ auf 2,6 ‰ (spröderes Bruchverhalten!).
            </p>
          </div>

          {/* Vollständige DIN EN 1992-1-1 Tabelle 3.1 & 3.2 Normübersicht */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
              <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                <BookOpen className="text-shiraz h-4 w-4" />
                Eurocode 2 Normkennwerte aller Spannbeton-Festigkeitsklassen (DIN EN 1992-1-1 Tab. 3.1)
              </h5>
              <span className="text-[11px] text-slate-500">Klick auf eine Zeile wählt die Klasse</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-text-main border-b border-home-grau/30 font-semibold">
                    <th className="p-2.5">Klasse</th>
                    <th className="p-2.5 font-mono">f_ck [MPa]</th>
                    <th className="p-2.5 font-mono">f_ck,cube</th>
                    <th className="p-2.5 font-mono">f_cm [MPa]</th>
                    <th className="p-2.5 font-mono">f_ctm [MPa]</th>
                    <th className="p-2.5 font-mono">f_ctk,0.05</th>
                    <th className="p-2.5 font-mono">f_ctk,0.95</th>
                    <th className="p-2.5 font-mono">E_cm [MPa]</th>
                    <th className="p-2.5 font-mono">ε_c1 [‰]</th>
                    <th className="p-2.5 font-mono">ε_cu1 [‰]</th>
                    <th className="p-2.5">Eignung im Spannbetonbau</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20">
                  {Object.keys(concDatabase).map((grade) => {
                    const isRowActive = matGrade === grade;
                    const d = concDatabase[grade];
                    return (
                      <tr
                        key={grade}
                        onClick={() => setMatGrade(grade)}
                        className={`cursor-pointer transition-colors ${
                            isRowActive
                              ? 'bg-shiraz/10 font-semibold text-shiraz'
                              : 'hover:bg-off-white text-text-main/80'
                          }`}
                      >
                        <td className="p-2.5 font-bold font-mono flex items-center gap-1.5">
                          {isRowActive && <Check size={13} className="text-shiraz" />}
                          {grade}
                        </td>
                        <td className="p-2.5 font-mono">{formatDeWert(d.fck)}</td>
                        <td className="p-2.5 font-mono">{formatDeWert(d.fck_cube)}</td>
                        <td className="p-2.5 font-mono">{formatDeWert(d.fcm)}</td>
                        <td className="p-2.5 font-mono">{formatDeZahl(d.fctm, 2)}</td>
                        <td className="p-2.5 font-mono text-blue-700">{formatDeZahl(d.fctk005, 2)}</td>
                        <td className="p-2.5 font-mono text-purple-700">{formatDeZahl(d.fctk095, 2)}</td>
                        <td className="p-2.5 font-mono">{formatDeWert(d.Ecm)}</td>
                        <td className="p-2.5 font-mono">{formatDeWert(d.eps_c1)}</td>
                        <td className="p-2.5 font-mono">{formatDeWert(d.eps_cu1)}</td>
                        <td className="p-2.5 text-[11px]">{d.typicalUse}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4 Fachtechnische Vertiefungs-Boxen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Mindestdruckfestigkeiten */}
            <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-shiraz" />
                1. Normative Mindestdruckfestigkeiten &amp; Baupraxis
              </h5>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Nach <strong>DIN EN 1992-1-1 Abs. 3.1.2</strong> und den nationalen Anwendungsregeln (DIN 1045-2) gelten folgende Erfahrungswerte und Regelungen:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-xs text-text-main/80">
                <li><strong>Nachträglicher Verbund (Hüllrohre):</strong> Übliche Praxis mindestens <strong>C30/37</strong>, um Berst- und Spaltzugspannungen hinter den Ankerkörpern sicher abzutragen.</li>
                <li><strong>Sofortiger Verbund (Spannbett):</strong> Übliche Praxis mindestens <strong>C35/45</strong>, da die Kraftübertragung rein über Verbund, Keilwirkung (Hoyer-Effekt) und Adhäsion erfolgt.</li>
                <li><strong>Brückenbau:</strong> In der Praxis werden meist <strong>C35/45 bis C45/55</strong> eingesetzt (Anforderungen der ZTV-ING und des Bauherrn prüfen).</li>
                <li><strong>Zulassungsbezug:</strong> Die Mindestfestigkeit zum Spannzeitpunkt regelt verbindlich die europäische technische Bewertung (ETA) bzw. allgemeine bauaufsichtliche Zulassung (abZ) des jeweiligen Spannverfahrens.</li>
              </ul>
            </div>

            {/* Box 2: Reife & Dampfhärtung */}
            <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                <Thermometer className="h-4 w-4 text-shiraz" />
                2. Reifeentwicklung &amp; Wärmebehandlung
              </h5>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Im Fertigteilwerk werden Spannbetonelemente oft <strong>wärmebehandelt (60 °C)</strong>, um die Formen nach 12–16 Stunden 
                wieder zu entspannen. Das äquivalente Alter wird nach der <strong>Arrhenius-Gleichung</strong> (EC2 Gl. B.10) berechnet:
              </p>
              <div className="bg-white p-2 rounded-lg border border-home-grau/20 text-center font-mono text-[11px]">
                <InlineMath math="t_T = \sum_{i=1}^n \Delta t_i \cdot \exp\left[ 4000 \cdot \left(\frac{1}{293} - \frac{1}{273 + T(\Delta t_i)}\right) \right]" />
              </div>
              <p className="text-[11px] text-text-main/70">
                Bei 60 °C läuft die Hydratation etwa 5-mal schneller ab als bei 20 °C Normtemperatur (nach Gl. B.10).
              </p>
            </div>

            {/* Box 3: Gesteinskörnung & E-Modul */}
            <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-shiraz" />
                3. Einfluss der Gesteinskörnung auf Steifigkeit
              </h5>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Der Elastizitätsmodul hängt stark vom Gesteinstyp der Gesteinskörnung ab (EC2 Abs. 3.1.3):
              </p>
              <ul className="list-disc pl-4 space-y-1 text-xs text-text-main/80">
                <li><strong>Basalt / Diabas:</strong> <InlineMath math="\alpha_E = 1{,}20" /> (+20 % E-Modul, extrem steif, minimale Durchbiegung).</li>
                <li><strong>Quarzit (Normreferenz):</strong> <InlineMath math="\alpha_E = 1{,}00" />.</li>
                <li><strong>Kalkstein:</strong> <InlineMath math="\alpha_E = 0{,}90" /> (-10 % E-Modul).</li>
                <li><strong>Sandstein:</strong> <InlineMath math="\alpha_E = 0{,}70" /> (-30 % E-Modul, führt zu massiv erhöhter elastischer Stauchung und Kriechverlusten!).</li>
              </ul>
            </div>

            {/* Box 4: Mehraxialer Druck & Verankerung */}
            <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-shiraz" />
                4. Teilflächenbelastung in der Verankerungszone
              </h5>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Direkt unter den Spannankern entsteht ein <strong>dreiachsiger Druckspannungszustand</strong>, 
                der die lokale Druckfestigkeit des Betons gegenüber dem einachsigen Zylinderwert dramatisch steigert (EC2 Gl. 6.63):
              </p>
              <div className="bg-white p-2 rounded-lg border border-home-grau/20 text-center font-mono text-[11px]">
                <BlockMath math="F_{Rdu} = A_{c0} \cdot f_{cd} \cdot \sqrt{\frac{A_{c1}}{A_{c0}}} \le 3{,}0 \cdot f_{cd} \cdot A_{c0}" />
              </div>
              <p className="text-[11px] text-text-main/70">
                Trotzdem müssen Spaltzug- und Berstzugkräfte im dahinterliegenden ungestörten Bereich 
                durch kräftige Wendel- und Bügelbewehrungen aufgenommen werden.
              </p>
            </div>
          </div>

          {/* Tabelle 3.1 nach DIN EN 1992-1-1 */}
          <div className="p-5 rounded-xl bg-white border border-home-grau/30 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-shiraz" />
                Tabelle 1: Wesentliche mechanische Betonkennwerte und deren Zeitabhängigkeit (DIN EN 1992-1-1)
              </h5>
              <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">EC2 Kap. 3.1</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                    <th className="p-2.5">Mechanische Eigenschaft</th>
                    <th className="p-2.5">Formelzeichen (EC2)</th>
                    <th className="p-2.5">Zeit- und Alterungsabhängigkeit</th>
                    <th className="p-2.5">Praxisbedeutung im Spannbetonbau</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold">Charakt. Zylinderdruckfestigkeit</td>
                    <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="f_{ck}" /></td>
                    <td className="p-2.5">Genormt bei <InlineMath math="t = 28" /> Tagen (Wasserlagerung 20 °C)</td>
                    <td className="p-2.5 text-[11px]">Klassifizierungsgrundlage (z. B. C30/37 oder C50/60)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold">Mittlere Zylinderdruckfestigkeit</td>
                    <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="f_{cm}(t)" /></td>
                    <td className="p-2.5">Steigt stark in den ersten 7 Tagen, danach asymptotisch (<InlineMath math="\beta_{cc}(t)" />)</td>
                    <td className="p-2.5 text-[11px]">Bestimmt Übertragungsdruckfestigkeit beim Spannen (<InlineMath math="t_0" />)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold">Mittlere axiale Zugfestigkeit</td>
                    <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="f_{ctm}(t)" /></td>
                    <td className="p-2.5">EC2 setzt für t &lt; 28 d dieselbe Entwicklung wie für f_cm an (α = 1, Gl. 3.4)</td>
                    <td className="p-2.5 text-[11px]">Maßgebend für Rissbildung &amp; Dekompressionsgrenzen</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold">Sekanten-Elastizitätsmodul</td>
                    <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="E_{cm}(t)" /></td>
                    <td className="p-2.5">Folgt der 0,3-Potenz der Druckfestigkeitsentwicklung</td>
                    <td className="p-2.5 text-[11px]">Bestimmt elastische Stauchung &amp; Kriechverformung</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
}
