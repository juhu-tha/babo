// Ausgelagert aus src/modules/Stahlbetoninstandhaltung.tsx (AP 5.2)
import React from 'react';
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Zap,
  Sliders,
  Calculator
} from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import inhalt from '@/content/stahlbetoninstandhaltung/ChloridrechnerTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface ChloridrechnerTabProps {
  bauteilAlter: number;
  betondeckung: number;
  chloridCs: number;
  chloridStats: { points: { x: number; c: number; }[]; cAtRebar: number; rebarStatus: 'ok' | 'warning' | 'critical'; depassivatedDepth: number; erfAbtrag: number; critLimit: number; };
  diffD: number;
  setBauteilAlter: React.Dispatch<React.SetStateAction<number>>;
  setBetondeckung: React.Dispatch<React.SetStateAction<number>>;
  setChloridCs: React.Dispatch<React.SetStateAction<number>>;
  setDiffD: React.Dispatch<React.SetStateAction<number>>;
}

export default function ChloridrechnerTab({ bauteilAlter, betondeckung, chloridCs, chloridStats, diffD, setBauteilAlter, setBetondeckung, setChloridCs, setDiffD }: ChloridrechnerTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border-y border-r border-l-4 border-amber-600 border-home-grau/20 p-5 rounded-xl shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-home-grau/20">
          <h3 className="font-bold text-amber-800 flex items-center gap-2 text-base">
            <Calculator size={20} /><MdText text={inhalt.texte.chloriddiffusionFickIiKathodischer} /></h3>
          <span className="text-xs font-mono font-bold text-slate-500 bg-off-white px-2.5 py-1 rounded-lg border border-home-grau/20"><MdText text={inhalt.texte.prinzipRVsPrinzip} /></span>
        </div>
        <p className="text-text-main/80 text-xs mt-3 leading-relaxed"><MdText text={inhalt.texte.tausalzeUndMeerwasserTransportieren} /><FormulaText text="Cl^-" /><MdText text={inhalt.texte.diffusivDurchDieBetondeckung} /><FormulaText text="C \ge 0.40 - 0.50\,\text{M.-\%}" /><MdText text={inhalt.texte.bezogenAufZementmasseWird} /></p>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-home-grau/25 shadow-xs space-y-4 text-xs font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-home-grau/20">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sliders size={14} className="text-amber-700" /> Diffusions-Parameter
            </span>
            <span className="text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.fickschesGesetz} /></span>
          </div>

          {/* Cs Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-800"><MdText text={inhalt.texte.oberflächenchlorid} /><FormulaText text="C_s" />):</label>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-home-grau/30">
                {formatDeZahl(chloridCs, 2)}<MdText text={inhalt.texte.mZement} /></span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.1"
              value={chloridCs}
              onChange={(e) => setChloridCs(parseFloat(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block"><MdText text={inhalt.texte.tausalzSprühnebelInParkhaus} /></span>
          </div>

          {/* D_app Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-800"><MdText text={inhalt.texte.diffusionskoeffizient} /><FormulaText text="D_{\text{app}}" />):</label>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-home-grau/30">
                {formatDeZahl(diffD, 1)}<MdText text={inhalt.texte.t10MS} /></span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={diffD}
              onChange={(e) => setDiffD(parseFloat(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block"><MdText text={inhalt.texte.dichterBetonWZ} /></span>
          </div>

          {/* Alter t Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-800"><MdText text={inhalt.texte.bauteilalterExpositionsdauer} /><FormulaText text="t" />):</label>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-home-grau/30">
                {formatDeWert(bauteilAlter)} Jahre
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              step="1"
              value={bauteilAlter}
              onChange={(e) => setBauteilAlter(parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Betondeckung c Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-800"><MdText text={inhalt.texte.betondeckung} /><FormulaText text="c_{\text{nom}}" />):</label>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-home-grau/30">
                {formatDeWert(betondeckung)} mm
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="65"
              step="5"
              value={betondeckung}
              onChange={(e) => setBetondeckung(parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Status Callout */}
          <div className={`p-3.5 rounded-xl border mt-2 leading-relaxed ${
            chloridStats.rebarStatus === 'critical'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : chloridStats.rebarStatus === 'warning'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
          }`}>
            <div className="font-bold text-xs flex items-center gap-1.5 mb-1">
              {chloridStats.rebarStatus === 'critical' ? (
                <AlertTriangle size={15} className="text-rose-600 shrink-0" />
              ) : (
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              )}
              <span>
                {chloridStats.rebarStatus === 'critical' 
                  ? inhalt.werte.bewehrungsebeneDepassiviert 
                  : chloridStats.rebarStatus === 'warning'
                    ? inhalt.werte.kritischerSchwellenbereich
                    : inhalt.werte.bewehrungNochPassivGeschützt}
              </span>
            </div>
            <p className="text-[11px]"><MdText text={inhalt.texte.chloridgehaltBeiX} />{formatDeWert(betondeckung)} mm: <strong>{formatDeZahl(chloridStats.cAtRebar, 2)} M.-%</strong><MdText text={inhalt.texte.grenzwert050M} /></p>
          </div>
        </div>

        {/* Visualization & Strategy Column */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* SVG Chloridprofil Graph */}
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-home-grau/20">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 font-sans">
                <TrendingUp size={15} className="text-amber-600" /><MdText text={inhalt.texte.berechnetesChloridTiefenprofilC} /></h4>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded"><MdText text={inhalt.texte.fickIiDiffusion} /></span>
            </div>

            <div className="w-full bg-slate-50 border border-home-grau/25 rounded-xl p-3 flex flex-col items-center justify-center">
              <svg width="100%" height="210" viewBox="0 0 500 210" className="select-none font-mono">
                {/* Grid lines */}
                <line x1="50" y1="30" x2="470" y2="30" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="50" y1="80" x2="470" y2="80" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="50" y1="130" x2="470" y2="130" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="50" y1="180" x2="470" y2="180" stroke="#94a3b8" strokeWidth="1.5" />

                {/* Y-Axis Labels */}
                <text x="42" y="34" fill="#64748b" fontSize="9" textAnchor="end">3,0%</text>
                <text x="42" y="84" fill="#64748b" fontSize="9" textAnchor="end">2,0%</text>
                <text x="42" y="134" fill="#64748b" fontSize="9" textAnchor="end">1,0%</text>
                <text x="42" y="184" fill="#64748b" fontSize="9" textAnchor="end">0,0%</text>

                {/* Critical Chlorid Threshold Line (0.50 M.-%) */}
                {(() => {
                  // 0% at y=180, 3% at y=30 (range 150px for 3% -> 50px per 1%)
                  const yCrit = 180 - (0.50 * 50);
                  return (
                    <g>
                      <line x1="50" y1={yCrit} x2="470" y2={yCrit} stroke="#A3113E" strokeWidth="1.5" strokeDasharray="5,2" />
                      <text x="465" y={yCrit - 4} fill="#A3113E" fontSize="9" textAnchor="end" fontWeight="bold">
                        C_krit ≈ 0,50 M.-% (Bewertungswert)
                      </text>
                    </g>
                  );
                })()}

                {/* Rebar Position Vertical Line */}
                {(() => {
                  // x in 0..65 mm mapped to 50..470 px (420px for 65mm -> 6.46 px/mm)
                  const pxRebar = 50 + betondeckung * (420 / 65);
                  return (
                    <g>
                      <line x1={pxRebar} y1="20" x2={pxRebar} y2="180" stroke="#475569" strokeWidth="2" strokeDasharray="4,3" />
                      <circle cx={pxRebar} cy="180" r="4" fill="#475569" />
                      <text x={pxRebar} y="16" fill="#334155" fontSize="9" textAnchor="middle" fontWeight="bold">
                        Bewehrung (c = {formatDeWert(betondeckung)} mm)
                      </text>
                    </g>
                  );
                })()}

                {/* Chloride Curve */}
                {(() => {
                  const pathData = chloridStats.points.map((pt, idx) => {
                    const px = 50 + pt.x * (420 / 65);
                    const py = Math.max(25, 180 - Math.min(3.2, pt.c) * 50);
                    return `${idx === 0 ? 'M' : 'L'} ${px} ${py}`;
                  }).join(' ');

                  return (
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#475569"
                      strokeWidth="2.5"
                    />
                  );
                })()}

                {/* X-Axis ticks */}
                <text x="50" y="195" fill="#64748b" fontSize="9" textAnchor="middle">0 mm</text>
                <text x="179" y="195" fill="#64748b" fontSize="9" textAnchor="middle">20 mm</text>
                <text x="308" y="195" fill="#64748b" fontSize="9" textAnchor="middle">40 mm</text>
                <text x="438" y="195" fill="#64748b" fontSize="9" textAnchor="middle">60 mm</text>
                <text x="470" y="172" fill="#475569" fontSize="9" textAnchor="end">Tiefe x &rarr;</text>
              </svg>
            </div>
          </div>

          {/* Decision Comparison: Prinzip R (Abtrag) vs. Prinzip K (KKS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
            
            {/* Option A: Prinzip R */}
            <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/30 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-home-grau/20 pb-1.5">
                <Wrench size={16} className="text-amber-700" />
                <span><MdText text={inhalt.texte.optionAPrinzipR} /></span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]"><MdText text={inhalt.texte.konventionellerVollständigerAbtragDes} /><FormulaText text="C \ge 0.50\,\text{M.-\%}" />.
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-[11px] space-y-1">
                <div><MdText text={inhalt.texte.erforderlicheAbtragstiefe} /><strong className="text-slate-900 font-mono">{formatDeWert(chloridStats.erfAbtrag)} mm</strong>
                </div>
                <div className="text-[10px] text-slate-500">
                  (Depassivierungstiefe {formatDeZahl(chloridStats.depassivatedDepth, 0)}<MdText text={inhalt.texte.mm15MmHinterstemmung} /></div>
              </div>
              <span className="text-[10px] text-rose-700 block font-medium"><MdText text={inhalt.texte.hoherSubstanzverlustSprießungsaufwandBau} /></span>
            </div>

            {/* Option B: Prinzip K (KKS) */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 border-b border-emerald-200 pb-1.5">
                <Zap size={16} className="text-emerald-700" />
                <span><MdText text={inhalt.texte.optionBPrinzipK} /></span>
              </div>
              <p className="text-emerald-900 leading-relaxed text-[11px]"><MdText text={inhalt.texte.kathodischerKorrosionsschutzMittelsFremd} /></p>
              <div className="p-2.5 bg-white rounded-lg border border-emerald-200 text-[11px] space-y-1">
                <div>
                  100-mV-Depolarisationskriterium: <strong className="text-emerald-800 font-mono">&Delta;E ≥ 100 mV</strong>
                </div>
                <div className="text-[10px] text-slate-500"><MdText text={inhalt.texte.chloridbelasteterBetonVerbleibtIm} /></div>
              </div>
              <span className="text-[10px] text-emerald-800 block font-bold"><MdText text={inhalt.texte.ca70WenigerBaustellenlärm} /></span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
