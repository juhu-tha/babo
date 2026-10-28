import { EULER_BETA, eulerEigenform } from '@/src/calc/stabilitaet';
import React, { useState, useMemo } from 'react';
import { Activity, Sliders, BookOpen } from 'lucide-react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { Querverweis } from '@/src/components/ui/Querverweis';
import inhalt from '@/content/knicken/Knicken.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const REITER = [
  { id: 'simulation', label: inhalt.texte.interaktiverKnickprüfstandLiveLast, icon: Sliders },
  { id: 'diagramm', label: inhalt.texte.biegelinieIiOrdnungDiagramm, icon: Activity },
  { id: 'eulerfaelle', label: inhalt.texte.die4EulerFälle, icon: BookOpen },
] as const;

export default function Knicken() {
  const [activeTab, setActiveTab] = useState<'simulation' | 'diagramm' | 'eulerfaelle'>('simulation');

  // Stabparameter
  const [l, setL] = useState(3.5); // Stablänge in m
  const [eModul, setEModul] = useState(210000); // E-Modul in MPa (Stahl)
  const [i, setI] = useState(850); // Flächenträgheitsmoment in cm^4
  const [eulerFall, setEulerFall] = useState(2); // Euler-Fall 1–4

  // Live Load Parameter (N_Ed)
  const [loadPercent, setLoadPercent] = useState(65); // 0% bis 120% der Euler-Last

  const results = useMemo(() => {
    const beta = EULER_BETA[eulerFall as 1 | 2 | 3 | 4]; // gemeinsame Tabelle src/calc/stabilitaet.ts

    const l_k = beta * l; // in m
    const E_Nmm2 = eModul;
    const I_mm4 = i * 10000;
    const l_k_mm = l_k * 1000;

    // F_K = (pi^2 * E * I) / l_k^2
    const F_K_N = (Math.PI * Math.PI * E_Nmm2 * I_mm4) / (l_k_mm * l_k_mm);
    const F_K_kN = F_K_N / 1000;

    // Angewandte Normalkraft N_Ed
    const N_Ed_kN = (loadPercent / 100) * F_K_kN;
    const utilization = (N_Ed_kN / F_K_kN) * 100;
    const isBuckled = loadPercent >= 100;

    // Theorie II. Ordnung: Auslenkung w = w0 / (1 − N/F_K) mit angenommener Vorkrümmung w0 = l/300 (Lehrwert;
    // die Ersatzimperfektionen nach DIN EN 1993-1-1, Tab. 5.1 hängen von der Knicklinie ab)
    const w0_mm = (l * 1000) / 300;
    // Darstellung: Verstärkung auf 12,5 begrenzt; ab N ≥ F_K bleibt sie auf dem Höchstwert (instabil, Auslenkung theoretisch unbegrenzt)
    const amplification = isBuckled ? 12.5 : (1 / Math.max(0.08, 1 - (loadPercent / 100)));
    const maxDeflectionMm = w0_mm * amplification;

    // Biegelinie im Diagramm: erste Eigenform des Euler-Falls (src/calc/stabilitaet.ts), skaliert auf w_max in mm
    // (vorher Fall 3 mit falscher Form, w = 0 ab 0,7·l, und Werte je Fall durch 15 bis 25 geteilt – Modulprüfung Tranche 10)
    const steps = 50;
    const labels: string[] = [];
    const deflectionData: number[] = [];

    for (let j = 0; j <= steps; j++) {
      const xi = j / steps;
      labels.push(formatDeZahl(xi * l, 2));
      deflectionData.push(eulerEigenform(eulerFall as 1 | 2 | 3 | 4, xi) * maxDeflectionMm);
    }

    const chartData = {
      labels,
      datasets: [
        {
          label: `Biegelinie II. Ordnung (w_max = ${formatDeZahl(maxDeflectionMm, 1)} mm)`,
          data: deflectionData,
          borderColor: isBuckled ? '#ef4444' : '#A3113E',
          backgroundColor: isBuckled ? 'rgba(239, 68, 68, 0.15)' : 'rgba(163, 17, 62, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        }
      ]
    };

    return { beta, l_k, F_K_kN, N_Ed_kN, utilization, isBuckled, maxDeflectionMm, chartData };
  }, [l, eModul, i, eulerFall, loadPercent]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Activity className="text-shiraz" /><MdText text={inhalt.texte.knickenStabilitätsversagenEulerFälle} /></h2>
          <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-3 py-1 rounded-full border border-shiraz/20"><MdText text={inhalt.texte.dinEn19931} /></span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6 leading-relaxed">
          <p><MdText text={inhalt.texte.dasKnickenIstEin} /></p>
        </div>

        {/* Tab-Navigation */}
        <ModuleTabs label="Bereiche Knicken" tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6">

        {/* TAB 1: Interaktiver Knickprüfstand */}
        {activeTab === 'simulation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            
            {/* Left Controls (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center gap-2 border-b border-home-grau/20 pb-2">
                  <Sliders size={16} className="text-shiraz" /><MdText text={inhalt.texte.t1LastGeometrie} /></h3>

                {/* Axial Load Slider */}
                <div className="space-y-1.5 p-3 rounded-xl border border-home-grau/30 bg-off-white">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text-main"><MdText text={inhalt.texte.normalkraftNEd} /></span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                      results.isBuckled ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {formatDeZahl(results.N_Ed_kN, 1)} kN ({formatDeZahl(results.utilization, 0)} % FK)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={120}
                    step={1}
                    value={loadPercent}
                    onChange={(e) => setLoadPercent(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-shiraz"
                  />
                  <div className="flex justify-between text-[10px] text-text-main/60 font-mono">
                    <span><MdText text={inhalt.texte.t0KnEntlastet} /></span>
                    <span className="font-bold text-shiraz">Knicklast: {formatDeZahl(results.F_K_kN, 1)} kN</span>
                    <span>120 %</span>
                  </div>
                </div>

                {/* Euler Fall Selection */}
                <div className="space-y-1.5 pt-2 border-t border-home-grau/20">
                  <label className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.lagerungsbedingungEulerFall} /></label>
                  <select aria-label={inhalt.werte.lagerungsbedingungEulerFall}
                    value={eulerFall}
                    onChange={(e) => setEulerFall(Number(e.target.value))}
                    className="w-full p-2.5 border border-home-grau/30 rounded-xl bg-off-white text-xs font-medium focus:ring-2 focus:ring-shiraz outline-none cursor-pointer"
                  >
                    <option value={1}>Euler-Fall 1: Kragarm (Eingespannt / Frei) — β = 2,0</option>
                    <option value={2}>Euler-Fall 2: Beidseitig gelenkig gelagert — β = 1,0</option>
                    <option value={3}>Euler-Fall 3: Einseitig eingespannt, gelenkig — β ≈ 0,7</option>
                    <option value={4}>Euler-Fall 4: Beidseitig starr eingespannt — β = 0,5</option>
                  </select>
                </div>

                {/* Stablänge Slider */}
                <Slider
                  label={<FormulaText text="Stablänge l" />}
                  min={1.0}
                  max={12.0}
                  step={0.5}
                  value={l}
                  unit="m"
                  onChange={(e) => setL(Number(e.target.value))}
                />

                {/* Flächenträgheitsmoment Slider */}
                <Slider
                  label={<FormulaText text={inhalt.werte.trägheitsmomentI} />}
                  min={50}
                  max={3000}
                  step={50}
                  value={i}
                  unit="cm⁴"
                  onChange={(e) => setI(Number(e.target.value))}
                />

                {/* E-Modul */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-home-grau/20">
                  <span className="text-text-main/70"><MdText text={inhalt.texte.elastizitätsmodulE} /></span>
                  <span className="font-mono font-bold text-text-main">{formatDeWert(eModul)} MPa (Stahl)</span>
                </div>

                {/* Results Card */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-home-grau/20">
                  <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                    <span className="text-[10px] uppercase font-bold text-text-main/60 block"><MdText text={inhalt.texte.knicklängeLK} /></span>
                    <span className="text-lg font-mono font-bold text-text-main">{formatDeZahl(results.l_k, 2)} m</span>
                    <span className="text-[9px] text-text-main/70 block">β = {formatDeWert(results.beta)}</span>
                  </div>

                  <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                    <span className="text-[10px] uppercase font-bold text-text-main/60 block"><MdText text={inhalt.texte.eulerKnicklastFk} /></span>
                    <span className="text-lg font-mono font-bold text-shiraz">{formatDeZahl(results.F_K_kN, 1)} kN</span>
                    <span className="text-[9px] text-text-main/70 block">Stabilitätsgrenze</span>
                  </div>
                </div>

                {/* Status Warning Badge */}
                <div className={`p-3 rounded-xl border text-xs text-center font-bold ${
                  results.isBuckled
                    ? 'bg-red-100 text-red-800 border-red-300 animate-pulse'
                    : results.utilization > 80
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}>
                  {results.isBuckled
                    ? inhalt.werte.stabilitätsversagenIdealeKnicklastErreic
                    : `Unterhalb der idealen Knicklast (N_Ed/F_K = ${formatDeZahl(results.utilization, 0)} %) – der Bemessungsnachweis erfordert zusätzlich den Abminderungsbeiwert χ nach DIN EN 1993-1-1, 6.3.1`}
                </div>

                <FormulaDerivationBox
                  live
                  title={inhalt.werte.ihrRechenwegEulerKnicklast}
                  zielGleichung={`F_K = \\frac{\\pi^2 \\cdot E \\cdot I}{(\\beta \\cdot l)^2} = ${formatDeTeX(results.F_K_kN, 1)}\\,\\text{kN}`}
                  normQuelle={inhalt.werte.eulerKnickfälleTheorieIi}
                  schritte={[
                    {
                      titel: 'Knicklänge',
                      erklaerung: `Euler-Fall ${formatDeZahl(eulerFall, 0)} mit dem Knicklängenbeiwert β = ${formatDeZahl(results.beta, 1)}.`,
                      formel: `l_k = \\beta \\cdot l = ${formatDeTeX(results.beta, 1)} \\cdot ${formatDeTeX(l, 2)} = ${formatDeTeX(results.l_k, 2)}\\,\\text{m}`,
                    },
                    {
                      titel: inhalt.werte.idealeKnicklast,
                      erklaerung: `Mit E = ${formatDeZahl(eModul, 0)} N/mm² und I = ${formatDeZahl(i, 0)} cm⁴ = ${formatDeZahl(i / 100, 2)} · 10⁶ mm⁴.`,
                      formel: `F_K = \\frac{\\pi^2 \\cdot ${formatDeTeX(eModul, 0)} \\cdot ${formatDeTeX(i / 100, 2)} \\cdot 10^{6}}{${formatDeTeX(results.l_k * 1000, 0)}^2} \\cdot 10^{-3} = ${formatDeTeX(results.F_K_kN, 1)}\\,\\text{kN}`,
                    },
                    {
                      titel: inhalt.werte.einwirkendeNormalkraft,
                      erklaerung: inhalt.werte.dieLastWirdAls,
                      formel: `N_{Ed} = ${formatDeTeX(loadPercent / 100, 2)} \\cdot ${formatDeTeX(results.F_K_kN, 1)} = ${formatDeTeX(results.N_Ed_kN, 1)}\\,\\text{kN}`,
                    },
                    {
                      titel: inhalt.werte.ausbiegungNachTheorieIi,
                      erklaerung: results.isBuckled
                        ? inhalt.werte.nEdFK
                        : inhalt.werte.angenommeneVorkrümmungWL,
                      formel: results.isBuckled || 1 - loadPercent / 100 < 0.08
                        ? `w = ${formatDeTeX((l * 1000) / 300, 1)} \\cdot 12{,}5 = ${formatDeTeX(results.maxDeflectionMm, 1)}\\,\\text{mm}`
                        : `w = \\frac{w_0}{1 - N_{Ed}/F_K} = \\frac{${formatDeTeX((l * 1000) / 300, 1)}}{1 - ${formatDeTeX(loadPercent / 100, 2)}} = ${formatDeTeX(results.maxDeflectionMm, 1)}\\,\\text{mm}`,
                    },
                  ]}
                  ergebnisHinweis={`F_K = ${formatDeZahl(results.F_K_kN, 1)} kN, w ≈ ${formatDeZahl(results.maxDeflectionMm, 1)} mm`}
                />

              </div>
            </div>

            {/* Right Simulation Visual (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full">
                
                <div className="flex items-center justify-between pb-3 border-b border-home-grau/20 mb-3">
                  <div>
                    <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                      <Activity size={18} className="text-shiraz" /><MdText text={inhalt.texte.t2LiveKnickfigurAuslenkung} /></h3>
                    <span className="text-xs text-text-main/70 font-medium">
                      Euler-Fall {formatDeWert(eulerFall)}: {eulerFall === 1 ? 'Kragarm' : eulerFall === 2 ? 'Gelenk-Gelenk' : eulerFall === 3 ? 'Eingespannt-Gelenk' : inhalt.werte.beidseitigEingespannt}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
                    w_max ≈ {formatDeZahl(results.maxDeflectionMm, 1)} mm
                  </span>
                </div>

                {/* SVG Visualizer with White Background */}
                <div className="relative w-full aspect-4/3 max-h-[380px] bg-white rounded-xl overflow-hidden border border-home-grau/30 shadow-sm flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 460 360" className="select-none">
                    <defs>
                      <linearGradient id="columnGradKnicken" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="50%" stopColor="#64748b" />
                        <stop offset="100%" stopColor="#334155" />
                      </linearGradient>
                      {/* Grid pattern for technical drawing look */}
                      <pattern id="knickGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                      </pattern>
                    </defs>

                    {/* Explicit white background and subtle engineering drawing grid */}
                    <rect width="100%" height="100%" fill="#ffffff" />
                    <rect width="100%" height="100%" fill="url(#knickGrid)" />

                    {/* System axis (undeformed reference line) */}
                    <line x1="230" y1="30" x2="230" y2="330" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5 4" />
                    <text x="236" y="44" fill="#94a3b8" fontSize="10" className="font-mono font-medium">Systemachse (ungerade)</text>

                    {/* Top Force Arrow N_Ed */}
                    <g transform="translate(230, 15)">
                      <line x1="0" y1="0" x2="0" y2={results.isBuckled ? 35 : 25} stroke="#dc2626" strokeWidth="3.5" />
                      <polygon points="-6,25 0,35 6,25" fill="#dc2626" />
                      <text x="14" y="22" fill="#dc2626" fontSize="12" fontWeight="bold">
                        N_Ed = {formatDeZahl(results.N_Ed_kN, 1)} kN
                      </text>
                    </g>

                    {/* Buckled Deflection Line Path depending on Euler Case */}
                    {(() => {
                      const topY = 50;
                      const botY = 310;
                      const centerX = 230;
                      // Dynamic lateral deflection amplitude (px)
                      const amp = Math.min(85, (results.maxDeflectionMm / 150) * 85);

                      let pathD = '';
                      if (eulerFall === 1) {
                        // Free top, fixed bottom
                        pathD = `M ${centerX + amp} ${topY} Q ${centerX + amp * 0.8} 180 ${centerX} ${botY}`;
                      } else if (eulerFall === 2) {
                        // Pinned top, pinned bottom
                        pathD = `M ${centerX} ${topY} Q ${centerX + amp * 1.5} 180 ${centerX} ${botY}`;
                      } else if (eulerFall === 3) {
                        // Pinned top, clamped bottom
                        pathD = `M ${centerX} ${topY} C ${centerX + amp * 1.6} 130 ${centerX + amp * 0.4} 240 ${centerX} ${botY}`;
                      } else {
                        // Clamped top, clamped bottom
                        pathD = `M ${centerX} ${topY} C ${centerX} 120 ${centerX + amp * 1.8} 140 ${centerX + amp * 1.8} 180 C ${centerX + amp * 1.8} 220 ${centerX} 240 ${centerX} ${botY}`;
                      }

                      return (
                        <g>
                          {/* Soft shadow / glow */}
                          <path
                            d={pathD}
                            fill="none"
                            stroke={results.isBuckled ? '#ef4444' : '#A3113E'}
                            strokeWidth={results.isBuckled ? 10 : 8}
                            strokeLinecap="round"
                            opacity={0.15}
                          />
                          {/* Main Buckled Bar */}
                          <path
                            d={pathD}
                            fill="none"
                            stroke={results.isBuckled ? '#dc2626' : '#A3113E'}
                            strokeWidth={results.isBuckled ? 5.5 : 4.5}
                            strokeLinecap="round"
                          />

                          {/* Deflection Dimension Arrow in Field Center */}
                          {amp > 3 && (
                            <g transform="translate(0, 180)">
                              <line x1={centerX} y1="0" x2={centerX + amp} y2="0" stroke="#b45309" strokeWidth="1.5" strokeDasharray="3 2" />
                              <polygon points={`${centerX + amp - 4},-3 ${centerX + amp},0 ${centerX + amp - 4},3`} fill="#b45309" />
                              <text x={centerX + amp + 8} y="4" fill="#b45309" fontSize="11" fontWeight="bold">
                                w = {formatDeZahl(results.maxDeflectionMm, 1)} mm
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })()}

                    {/* TOP SUPPORT RENDERING */}
                    {eulerFall === 1 ? (
                      // Free top
                      <circle cx="230" cy="50" r="4.5" fill="#dc2626" />
                    ) : eulerFall === 2 || eulerFall === 3 ? (
                      // Gelenk oben
                      <g transform="translate(230, 50)">
                        <circle cx="0" cy="0" r="4" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
                        <polygon points="-9,-12 0,0 9,-12" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
                        <line x1="-16" y1="-12" x2="16" y2="-12" stroke="#334155" strokeWidth="2.5" />
                      </g>
                    ) : (
                      // Clamped top
                      <g transform="translate(230, 50)">
                        <rect x="-26" y="-14" width="52" height="14" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
                        <line x1="-30" y1="-14" x2="30" y2="-14" stroke="#1e293b" strokeWidth="3" />
                      </g>
                    )}

                    {/* BOTTOM SUPPORT RENDERING */}
                    {eulerFall === 2 ? (
                      // Pinned bottom
                      <g transform="translate(230, 310)">
                        <circle cx="0" cy="0" r="4" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
                        <polygon points="-10,12 0,0 10,12" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
                        <line x1="-18" y1="12" x2="18" y2="12" stroke="#1e293b" strokeWidth="2.5" />
                      </g>
                    ) : (
                      // unten eingespannt (Euler-Fall 1, 3, 4)
                      <g transform="translate(230, 310)">
                        <rect x="-28" y="0" width="56" height="16" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
                        <line x1="-32" y1="0" x2="32" y2="0" stroke="#1e293b" strokeWidth="3" />
                        {/* Ground hatching */}
                        <line x1="-24" y1="16" x2="-18" y2="24" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="-12" y1="16" x2="-6" y2="24" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="0" y1="16" x2="6" y2="24" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="12" y1="16" x2="18" y2="24" stroke="#94a3b8" strokeWidth="1.5" />
                      </g>
                    )}

                    {/* Dimension Line Height L */}
                    <g transform="translate(50, 0)">
                      <line x1="0" y1="50" x2="0" y2="310" stroke="#64748b" strokeWidth="1.5" />
                      <line x1="-5" y1="50" x2="5" y2="50" stroke="#64748b" strokeWidth="1.5" />
                      <line x1="-5" y1="310" x2="5" y2="310" stroke="#64748b" strokeWidth="1.5" />
                      <text x="-12" y="185" fill="#475569" fontSize="12" fontWeight="bold" textAnchor="end">
                        l = {formatDeZahl(l, 1)} m
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Info Text below */}
                <div className="mt-2 p-3 bg-off-white rounded-xl border border-home-grau/25 text-xs text-text-main/80 space-y-1">
                  <div className="font-bold text-shiraz"><MdText text={inhalt.texte.theorieIiOrdnungVerformungsrückkopplung} /></div>
                  <p className="leading-relaxed"><MdText text={inhalt.texte.mitSteigenderNormalkraftN} /></p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Biegelinie Diagramm */}
        {activeTab === 'diagramm' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 animate-in fade-in duration-300">
            <h3 className="font-bold text-base text-text-main mb-3 flex items-center gap-2">
              <Activity className="text-shiraz" /><MdText text={inhalt.texte.biegelinienverlaufÜberDieStablänge} /></h3>
            <div className="h-[360px] relative w-full">
              <Line data={results.chartData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { title: { display: true, text: inhalt.werte.achseX } }, y: { title: { display: true, text: inhalt.werte.achseW } } } }} />
            </div>
          </div>
        )}

        {/* TAB 3: Die 4 Euler-Fälle im Vergleich */}
        {activeTab === 'eulerfaelle' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {inhalt.daten.Knicken.map((f) => (
                <div key={f.fall} className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-shiraz text-sm">{f.name}</span>
                      <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-home-grau/30">β = {formatDeWert(f.beta)}</span>
                    </div>
                    <div className="font-mono text-xs text-text-main font-semibold mb-2">{f.lk}</div>
                    <p className="text-xs text-text-main/75 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </ModuleTabs>

      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1EulerKnicklast}
        zielGleichung="F_K = \frac{\pi^2 \cdot E \cdot I}{(\beta \cdot l)^2}"
        schritte={inhalt.daten["Knicken.schritte"]}
        ergebnisHinweis={inhalt.werte.dieLagerungWirktQuadratisch}
        normQuelle={inhalt.werte.euler1744KnicklängenbeiwerteDer}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2WieStark}
        zielGleichung="w = \frac{w_0}{1 - N_{Ed}/F_K}"
        schritte={inhalt.daten["Knicken.schritte_2"]}
        ergebnisHinweis={inhalt.werte.dasZusatzmomentNW}
        normQuelle={inhalt.werte.stabilitätstheorieNachweisNachDin}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <Querverweis ziel="stahlbau_ec3" titel={inhalt.werte.bemessungNachEurocode3} linkText={inhalt.werte.zumModulStahlbauNach}>{inhalt.werte.dieEulerLastIst}</Querverweis>
      <ModulTest moduleId="knicken" />

      <ModuleFooter 
        lastReviewed={inhalt.werte.oktober2026Ap5}
        wikipedia={[
          { title: 'Knicken', url: 'https://de.wikipedia.org/wiki/Knicken' },
          { title: inhalt.werte.eulerscheKnickfälle, url: 'https://de.wikipedia.org/wiki/Knicken' }
        ]}
        regelwerke={inhalt.daten["Knicken.regelwerke"]}
        literatur={inhalt.daten["Knicken.literatur"]}
        formeln={inhalt.daten["Knicken.formeln"]}
      />

    </div>
  );
}
