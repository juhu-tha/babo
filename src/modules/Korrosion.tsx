import type { ChartData } from 'chart.js';
import React, { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import '@/src/lib/chartSetup';
import { ShieldAlert, Droplets, Cloud, Timer, Zap, Activity } from "lucide-react";
import { Slider } from "@/src/components/ui/Slider";
import { erf } from "@/src/lib/math";
import { FormulaText } from "@/src/components/ui/FormulaText";
import { ModuleFooter } from "@/src/components/ui/ModuleFooter";
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath } from "react-katex";
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import inhalt from '@/content/korrosion/Korrosion.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

function LokalelementSimulator() {
  const [clContent, setClContent] = useState(0.85); // % bezogen auf Zement
  const [relHum, setRelHum] = useState(80); // % RH
  const [coverMm, setCoverMm] = useState(35); // mm
  const [durationYears, setDurationYears] = useState(6); // Jahre

  const isDepassivated = clContent >= 0.50; // Kritischer Grenzwert

  // Korrosionsstromdichte icorr in µA/cm²
  const iCorr = useMemo(() => {
    if (!isDepassivated) return 0.08; // Passivstrombereich
    // Peaks around 80-85% RH (good moisture + sufficient O2 diffusion)
    let humidityFactor = 1.0;
    if (relHum < 50) {
      humidityFactor = Math.max(0.05, (relHum - 30) / 20 * 0.4);
    } else if (relHum <= 85) {
      humidityFactor = 0.4 + ((relHum - 50) / 35) * 0.6;
    } else {
      // water saturated -> O2 diffusion severely blocked
      humidityFactor = Math.max(0.15, 1.0 - ((relHum - 85) / 15) * 0.85);
    }
    const clExcess = Math.min(3.5, clContent / 0.50);
    return Math.min(18.0, 1.2 * clExcess * humidityFactor * 2.8);
  }, [isDepassivated, relHum, clContent]);

  // Jährlicher Abtrag nach Faraday: 1 µA/cm² ≈ 11.6 µm/Jahr
  const vCorrMicronYear = (iCorr * 11.6);
  const totalLossMicron = (vCorrMicronYear * durationYears);
  
  // Rust volume expansion factor ~ 3.0
  const rustWedgeThicknessMm = ((totalLossMicron * 2.5) / 1000); // mm

  // Radial splitting stress (approximate cylinder cavity model: sigma_t ~ E_eff * delta / c_nom)
  // Concrete tensile strength ~ 3.0 MPa
  const radialStressMPa = useMemo(() => {
    if (!isDepassivated) return 0;
    const Eeff = 12000; // MPa with creep
    const stress = (Eeff * (rustWedgeThicknessMm / 10)) / coverMm;
    return Math.min(14.0, stress);
  }, [isDepassivated, rustWedgeThicknessMm, coverMm]);

  const fctm = 3.0; // MPa Betonzugfestigkeit
  const crackState = useMemo(() => {
    if (!isDepassivated) return { code: 'passiv', title: inhalt.werte.passivGeschützt, color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
    if (radialStressMPa < fctm * 0.7) return { code: 'initiierung', title: inhalt.werte.lochfraßAktivMikrokorrosion, color: 'text-amber-700 bg-amber-50 border-amber-300' };
    if (radialStressMPa < fctm * 1.5) return { code: 'rissbildung', title: inhalt.werte.spaltzugrissImBetoninneren, color: 'text-orange-700 bg-orange-50 border-orange-300' };
    if (radialStressMPa < fctm * 2.8) return { code: 'oberflaechenriss', title: inhalt.werte.durchgehenderLängsrissAnOberfläche, color: 'text-rose-700 bg-rose-50 border-rose-300' };
    return { code: 'abplatzung', title: inhalt.werte.betondeckungAbgeplatztSpalling, color: 'text-red-700 bg-red-100 border-red-500 font-bold animate-pulse' };
  }, [isDepassivated, radialStressMPa]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
        <p><MdText text={inhalt.texte.elektrochemischeKorrosionszelleImStahlbe} /></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center gap-2 border-b border-home-grau/20 pb-2">
              <Zap size={16} className="text-shiraz" /><MdText text={inhalt.texte.t1KorrosionsParameter} /></h3>

            {/* Chloride Content Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-text-main"><MdText text={inhalt.texte.chloridgehaltAmBewehrungsstahl} /></span>
                <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                  clContent >= 0.50 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {formatDeZahl(clContent, 2)} % z.G.Z.
                </span>
              </div>
              <input
                type="range"
                min={0.10}
                max={2.50}
                step={0.05}
                value={clContent}
                onChange={(e) => setClContent(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
              <div className="flex justify-between text-[10px] text-text-main/60">
                <span><MdText text={inhalt.texte.t010Passiv} /></span>
                <span className="font-bold text-shiraz"><MdText text={inhalt.texte.kritisch050} /></span>
                <span><MdText text={inhalt.texte.t250Extrem} /></span>
              </div>
            </div>

            {/* Relative Humidity Slider */}
            <div className="space-y-1.5 pt-2 border-t border-home-grau/20">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-text-main"><MdText text={inhalt.texte.relativeBetonfeuchteRh} /></span>
                <span className="font-mono font-bold bg-slate-100 text-text-main px-2 py-0.5 rounded text-xs">
                  {formatDeWert(relHum)} %
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={98}
                step={2}
                value={relHum}
                onChange={(e) => setRelHum(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
              <p className="text-[10px] text-text-main/60">
                {relHum < 60
                  ? inhalt.werte.geringeFeuchteTrockenerBeton
                  : relHum <= 85
                  ? inhalt.werte.kritischerFeuchtebereich7585
                  : inhalt.werte.wassergesättigtSauerstoffdiffusionswider}
              </p>
            </div>

            {/* Concrete Cover Slider */}
            <div className="space-y-1.5 pt-2 border-t border-home-grau/20">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-text-main"><MdText text={inhalt.texte.betondeckungCnom} /></span>
                <span className="font-mono font-bold bg-slate-100 text-text-main px-2 py-0.5 rounded text-xs">
                  {formatDeWert(coverMm)} mm
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={55}
                step={5}
                value={coverMm}
                onChange={(e) => setCoverMm(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
            </div>

            {/* Duration Slider */}
            <div className="space-y-1.5 pt-2 border-t border-home-grau/20">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-text-main"><MdText text={inhalt.texte.wirkungsdauerT} /></span>
                <span className="font-mono font-bold bg-slate-100 text-text-main px-2 py-0.5 rounded text-xs">
                  {durationYears} Jahre
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                step={1}
                value={durationYears}
                onChange={(e) => setDurationYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
            </div>

            {/* Live Metrics Cards */}
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-home-grau/20">
              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block"><MdText text={inhalt.texte.korrosionsstromIcorr} /></span>
                <span className="text-xl font-mono font-bold text-shiraz">{formatDeZahl(iCorr, 2)} µA/cm²</span>
              </div>
              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block"><MdText text={inhalt.texte.abtragsrateVcorr} /></span>
                <span className="text-xl font-mono font-bold text-amber-700">{formatDeZahl(vCorrMicronYear, 1)} µm/a</span>
              </div>
              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block">Rost-Sprengdruck</span>
                <span className="text-xl font-mono font-bold text-red-600">{formatDeZahl(radialStressMPa, 1)} MPa</span>
              </div>
              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block"><MdText text={inhalt.texte.stahlverlustD} /></span>
                <span className="text-xl font-mono font-bold text-text-main">{formatDeZahl(totalLossMicron, 0)} µm</span>
              </div>
            </div>

            {/* Damage Status Badge */}
            <div className={`p-3 rounded-xl border text-xs font-semibold text-center ${crackState.color}`}>
              Zustand: {crackState.title}
            </div>

          </div>
        </div>

        {/* Visualizer Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full">
            
            <div className="flex items-center justify-between pb-3 border-b border-home-grau/20 mb-3">
              <div>
                <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                  <Activity size={18} className="text-shiraz" /><MdText text={inhalt.texte.t2ElektrochemischeZelleRissfortschritt} /></h3>
                <span className="text-xs text-text-main/70 font-medium"><MdText text={inhalt.texte.querschnittBetondeckungMitRebar} /></span>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                isDepassivated ? 'bg-red-100 text-red-800 border-red-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                {isDepassivated ? 'Depassiviert' : inhalt.werte.passiviertPh125}
              </span>
            </div>

            {/* SVG Visualizer */}
            <div className="relative w-full aspect-4/3 max-h-[380px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 540 380" className="select-none">
                <defs>
                  {/* Concrete matrix gradient */}
                  <linearGradient id="concreteCrossGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>

                  {/* Steel rebar cross section */}
                  <radialGradient id="rebarGrad" cx="40%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="65%" stopColor="#64748b" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </radialGradient>

                  {/* Rust layer gradient */}
                  <radialGradient id="rustLayerGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#b45309" />
                    <stop offset="100%" stopColor="#78350f" />
                  </radialGradient>
                </defs>

                {/* 1. Concrete Matrix */}
                <rect x="30" y="40" width="480" height="300" fill="url(#concreteCrossGrad)" rx="4" />

                {/* Concrete Top Surface Line */}
                <line x1="30" y1="40" x2="510" y2="40" stroke="#0f172a" strokeWidth="4" />
                <text x="270" y="30" fill="#cbd5e1" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Betonaußenfläche (Exposition Tausalz / Feuchte)
                </text>

                {/* Ingress arrows for Chloride & Moisture from top */}
                <g opacity="0.8">
                  <path d="M 120 12 L 120 36" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#arrow)" />
                  <text x="120" y="8" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">Cl⁻</text>

                  <path d="M 270 12 L 270 36" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#arrow)" />
                  <text x="270" y="8" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">H₂O</text>

                  <path d="M 420 12 L 420 36" stroke="#cbd5e1" strokeWidth="2.5" markerEnd="url(#arrow)" />
                  <text x="420" y="8" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">O₂</text>
                </g>

                {/* Dimension Line of Concrete Cover c_nom */}
                <g transform="translate(480, 0)">
                  <line x1="0" y1="40" x2="0" y2={40 + coverMm * 3.5} stroke="#fde047" strokeWidth="2" />
                  <line x1="-5" y1="40" x2="5" y2="40" stroke="#fde047" strokeWidth="2" />
                  <line x1="-5" y1={40 + coverMm * 3.5} x2="5" y2={40 + coverMm * 3.5} stroke="#fde047" strokeWidth="2" />
                  <text x="-12" y={40 + (coverMm * 3.5) / 2 + 4} fill="#fde047" fontSize="10" fontWeight="bold" textAnchor="end">
                    cnom = {formatDeWert(coverMm)} mm
                  </text>
                </g>

                {/* Rebar Center Y based on cover */}
                {(() => {
                  const rebarCenterY = 40 + coverMm * 3.5 + 45;
                  const rebarRadius = 45;
                  const rustThickness = isDepassivated ? Math.min(22, 4 + rustWedgeThicknessMm * 8) : 0;
                  const isSpalled = radialStressMPa >= fctm * 2.8;

                  return (
                    <g>
                      {/* Concrete Cover Spall Flake lifting if spalling reached */}
                      {isSpalled && (
                        <path
                          d={`M 180 40 L 270 ${rebarCenterY - rebarRadius} L 360 40 Z`}
                          fill="#475569"
                          stroke="#ef4444"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                          transform="translate(0, -12)"
                        />
                      )}

                      {/* Radial Spalling Cracks propagating from Rebar to Surface */}
                      {radialStressMPa >= fctm * 0.7 && (
                        <g>
                          {/* Main Vertical Crack */}
                          <path
                            d={`M 270 ${rebarCenterY - rebarRadius - rustThickness} L 270 40`}
                            stroke="#dc2626"
                            strokeWidth={Math.min(6, 1.5 + (radialStressMPa / fctm) * 1.5)}
                            fill="none"
                          />
                          {/* Diagonal Shear Cracks */}
                          {radialStressMPa >= fctm * 1.5 && (
                            <>
                              <path
                                d={`M 240 ${rebarCenterY - rebarRadius * 0.7} L 180 40`}
                                stroke="#dc2626"
                                strokeWidth={Math.min(4, 1 + radialStressMPa * 0.3)}
                                fill="none"
                              />
                              <path
                                d={`M 300 ${rebarCenterY - rebarRadius * 0.7} L 360 40`}
                                stroke="#dc2626"
                                strokeWidth={Math.min(4, 1 + radialStressMPa * 0.3)}
                                fill="none"
                              />
                            </>
                          )}
                        </g>
                      )}

                      {/* Rust Layer expanding around Rebar */}
                      {isDepassivated && (
                        <circle
                          cx="270"
                          cy={rebarCenterY}
                          r={rebarRadius + rustThickness}
                          fill="url(#rustLayerGrad)"
                          opacity="0.9"
                        />
                      )}

                      {/* Steel Rebar Body (shrinking slightly at pit) */}
                      <circle
                        cx="270"
                        cy={rebarCenterY}
                        r={rebarRadius}
                        fill="url(#rebarGrad)"
                        stroke="#0f172a"
                        strokeWidth="3"
                      />

                      {/* Passive Layer (Microscopic Cr2O3 / Fe-Oxide layer) */}
                      {!isDepassivated ? (
                        <circle
                          cx="270"
                          cy={rebarCenterY}
                          r={rebarRadius + 2}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeDasharray="none"
                        />
                      ) : (
                        // Depassivated Pitting Crater at the apex
                        <g>
                          {/* Intact passive layer on sides/bottom (Kathode) */}
                          <path
                            d={`M ${270 - rebarRadius + 4} ${rebarCenterY} A ${rebarRadius + 2} ${rebarRadius + 2} 0 1 0 ${270 + rebarRadius - 4} ${rebarCenterY}`}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3"
                          />
                          {/* Active Anode Crater at top */}
                          <path
                            d={`M ${270 - 24} ${rebarCenterY - rebarRadius + 5} Q 270 ${rebarCenterY - rebarRadius + 18} ${270 + 24} ${rebarCenterY - rebarRadius + 5}`}
                            fill="#b91c1c"
                            stroke="#ef4444"
                            strokeWidth="2"
                          />
                          <text x="270" y={rebarCenterY - rebarRadius + 32} fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="middle">
                            ANODE (Fe → Fe²⁺ + 2e⁻)
                          </text>

                          {/* Electron flow arrows inside rebar */}
                          <path d="M 270 240 Q 230 250 200 230" stroke="#fde047" strokeWidth="2.5" markerEnd="url(#arrow)" fill="none" />
                          <text x="235" y="270" fill="#fde047" fontSize="10" fontWeight="bold">e⁻ Strom</text>

                          {/* Cathode Zone Label at bottom/side */}
                          <text x="270" y={rebarCenterY + 30} fill="#86efac" fontSize="10" fontWeight="bold" textAnchor="middle">
                            KATHODE (O₂ + 2H₂O + 4e⁻ → 4OH⁻)
                          </text>
                        </g>
                      )}

                      {/* Rebar Diameter Label */}
                      <text x="270" y={rebarCenterY + 4} fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                        Ø 16 mm B500B
                      </text>
                    </g>
                  );
                })()}

                {/* Chemical Reaction Equation Footnote inside canvas */}
                <g transform="translate(40, 310)">
                  <rect width="460" height="25" rx="4" fill="#0f172a" opacity="0.85" />
                  <text x="230" y="16" fill="#38bdf8" fontSize="10" className="font-mono" textAnchor="middle">
                    Rostbildung: Fe²⁺ + 2 OH⁻ → Fe(OH)₂  ⎯⎯(+O₂)⎯→  FeOOH (Volumen × 2 bis 6!)
                  </text>
                </g>
              </svg>
            </div>

            {/* Chemical & Mechanical Summary Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-xs">
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/25 space-y-1">
                <span className="font-bold text-shiraz block"><MdText text={inhalt.texte.t1AnodischeTeilreaktionLochfraß} /></span>
                <div className="overflow-x-auto py-0.5">
                  <InlineMath math="Fe \rightarrow Fe^{2+} + 2\,e^-" />
                </div>
                <p className="text-[11px] text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.eisenGehtAlsHydratisiertes} /></p>
              </div>

              <div className="p-3 bg-off-white rounded-xl border border-home-grau/25 space-y-1">
                <span className="font-bold text-emerald-700 block"><MdText text={inhalt.texte.t2KathodischeTeilreaktionPassivfläche} /></span>
                <div className="overflow-x-auto py-0.5">
                  <InlineMath math="O_2 + 2\,H_2O + 4\,e^- \rightarrow 4\,OH^-" />
                </div>
                <p className="text-[11px] text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.sauerstoffAusDerPorenluft} /></p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

type KorrosionReiter = 'chlorid' | 'karbonatisierung' | 'schnellkarbonatisierung' | 'lokalelement';
const REITER: readonly ModulTab<KorrosionReiter>[] = [
  { id: 'chlorid', label: 'Chlorid-Eindringen', icon: Droplets },
  { id: 'karbonatisierung', label: inhalt.texte.natürlicheKarbonatisierung.trim(), icon: Cloud },
  { id: 'schnellkarbonatisierung', label: 'Schnellkarbonatisierung', icon: Timer },
  { id: 'lokalelement', label: inhalt.texte.elektrochemischeKorrosionszelleLochfraß.trim(), icon: Zap },
];

export default function Korrosion() {
  const [activeTab, setActiveTab] = useState<KorrosionReiter>("chlorid");

  // Chlorid State
  const [t, setT] = useState(50); // Jahre
  const [cNom, setCNom] = useState(35); // mm
  const [dApp, setDApp] = useState(5.0); // * 10^-12 m²/s
  const [cS, setCS] = useState(3.0); // Gew.-%
  const [a, setA] = useState(0.2); // Alterungsexponent

  // Karbonatisierung State
  const [tKarb, setTKarb] = useState(50); // Jahre
  const [cNomKarb, setCNomKarb] = useState(25); // mm
  const [kKarb, setKKarb] = useState(3.0); // mm/sqrt(a)

  // Schnellkarbonatisierung State
  const [co2Konz, setCo2Konz] = useState(0.04); // Vol.-% (natürlich)
  const [co2KonzSchnell, setCo2KonzSchnell] = useState(2.0); // Vol.-% (Kammer)
  const [tSchnell, setTSchnell] = useState(28); // Tage
  const [kKarbSchnell, setKKarbSchnell] = useState(2.0); // mm/sqrt(d)

  const chloridChartData = useMemo(() => {
    const depths = Array.from({ length: 101 }, (_, i) => i); // 0 to 100 mm
    const tSeconds = t * 365 * 24 * 3600;
    const dAppActual = dApp * 1e-12;
    const t0 = 28 / 365; // 28 days in years

    const dEffActual = dAppActual * Math.pow(t0 / Math.max(t, t0), a);

    const cValues = depths.map((x) => {
      const xMeters = x / 1000;
      const denominator = 2 * Math.sqrt(dEffActual * tSeconds);
      const val = cS * (1 - erf(xMeters / denominator));
      return val;
    });

    const isCorroding = cValues[cNom] >= 0.5;

    return {
      labels: depths,
      datasets: [
        {
          label: inhalt.werte.chloridgehalt,
          data: cValues,
          borderColor: "#A3113E", // Shiraz
          backgroundColor: "rgba(255, 119, 165, 0.4)", // Tickle Me Pink
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        },
        {
          label: inhalt.werte.betondeckungCNom,
          data: depths.map((x) => (x === cNom ? 5 : null)),
          borderColor: isCorroding ? "#A3113E" : "#A3113E", // Torch Red or Middle Blue
          borderWidth: 3,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        },
        {
          label: inhalt.werte.kritischerGehalt05,
          data: depths.map(() => 0.5),
          borderColor: "#1e293b",
          borderWidth: 1,
          borderDash: [2, 2],
          pointRadius: 0,
          fill: false,
        }],
      isCorroding,
    };
  }, [t, cNom, dApp, cS, a]);

  const karbonatisierungChartData = useMemo(() => {
    const years = Array.from({ length: 101 }, (_, i) => i); // 0 to 100 years

    // d_c = K * sqrt(t)
    const depths = years.map((year) => kKarb * Math.sqrt(year));

    const isCorroding = depths[tKarb] >= cNomKarb;

    return {
      labels: years,
      datasets: [
        {
          label: inhalt.werte.karbonatisierungstiefeMm,
          data: depths,
          borderColor: "#A3113E", // Middle Blue
          backgroundColor: "rgba(14, 85, 140, 0.2)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        },
        {
          label: inhalt.werte.betondeckungCNom2,
          data: years.map(() => cNomKarb),
          borderColor: isCorroding ? "#A3113E" : "#1e293b",
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        },
        {
          label: inhalt.werte.aktuellesJahr,
          data: years.map((y) => (y === tKarb ? 100 : null)),
          borderColor: "#A3113E",
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        }],
      isCorroding,
    };
  }, [tKarb, cNomKarb, kKarb]);

  const schnellkarbonatisierungChartData = useMemo(() => {
    const days = Array.from({ length: 91 }, (_, i) => i); // 0 to 90 days

    // d_c = K_schnell * sqrt(t_tage)
    const depthsSchnell = days.map((day) => kKarbSchnell * Math.sqrt(day));

    // Umrechnung auf natürliche Karbonatisierung (vereinfachtes Modell)
    // K_nat = K_schnell * sqrt(CO2_nat / CO2_schnell); K_schnell in mm/√d -> Umrechnung in mm/√a mit √365
    const kNatEquivalent = kKarbSchnell * Math.sqrt(co2Konz / co2KonzSchnell) * Math.sqrt(365);

    // d_c_nat = K_nat * sqrt(t_jahre) -> Umrechnung Tage in Jahre für den Vergleich
    const depthsNatEquivalent = days.map(
      (day) => kNatEquivalent * Math.sqrt(day / 365),
    );

    return {
      labels: days,
      datasets: [
        {
          label: inhalt.werte.tiefeSchnellkarbonatisierungMm,
          data: depthsSchnell,
          borderColor: "#A3113E", // Shiraz
          backgroundColor: "rgba(163, 17, 62, 0.2)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        },
        {
          label: inhalt.werte.äquivalenteNatürlicheTiefeMm,
          data: depthsNatEquivalent,
          borderColor: "#A3113E", // Middle Blue
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        },
        {
          label: "Prüfdauer",
          data: days.map((d) =>
            d === tSchnell ? Math.max(...depthsSchnell) : null,
          ),
          borderColor: "#1e293b",
          borderWidth: 1,
          pointRadius: 0,
          fill: false,
        }],
      kNatEquivalent,
    };
  }, [kKarbSchnell, tSchnell, co2Konz, co2KonzSchnell]);

  const chloridOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 5,
        title: {
          display: true,
          text: inhalt.werte.chloridgehaltGew,
          font: { family: "Work Sans", weight: "bold" as const },
        },
      },
      x: {
        title: {
          display: true,
          text: inhalt.werte.tiefeInsBauteilX,
          font: { family: "Work Sans", weight: "bold" as const },
        },
      },
    },
    plugins: { legend: { position: "top" as const } },
  };

  const karbonatisierungOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Tiefe (mm)",
          font: { family: "Work Sans", weight: "bold" as const },
        },
      },
      x: {
        title: {
          display: true,
          text: inhalt.werte.zeitTJahre,
          font: { family: "Work Sans", weight: "bold" as const },
        },
      },
    },
    plugins: { legend: { position: "top" as const } },
  };

  const schnellkarbonatisierungOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 50,
        title: {
          display: true,
          text: "Tiefe (mm)",
          font: { family: "Work Sans", weight: "bold" as const },
        },
      },
      x: {
        title: {
          display: true,
          text: inhalt.werte.zeitTTage,
          font: { family: "Work Sans", weight: "bold" as const },
        },
      },
    },
    plugins: { legend: { position: "top" as const } },
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
          <ShieldAlert size={24} />
        </div>
        <h2 className="text-2xl font-bold text-text-main">
          Bewehrungskorrosion
        </h2>
      </div>

      <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
        <p>
          <FormulaText text={inhalt.werte.dieDauerhaftigkeitVonStahlbeton} />
        </p>
      </div>

      <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="flex flex-col gap-6 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20">

      {activeTab === "chlorid" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.parameter2FickSches} /></h2>

            <Slider
              label={inhalt.werte.expositionszeitT}
              min={1}
              max={100}
              step={1}
              value={t}
              unit="Jahre"
              info={inhalt.werte.geplanteNutzungsdauerOderBetrachtungszei}
              onChange={(e) => setT(Number(e.target.value))}
            />

            <Slider
              label={<FormulaText text={inhalt.werte.betondeckungCNom3} />}
              min={10}
              max={70}
              step={1}
              value={cNom}
              unit="mm"
              info={inhalt.werte.abstandVonDerBetonoberfläche}
              onChange={(e) => setCNom(Number(e.target.value))}
            />

            <Slider
              info={inhalt.werte.apparenterChloriddiffusionskoeffizientDe}
              label={<FormulaText text={inhalt.werte.diffusionskoeffizientDApp} />}
              min={1.0}
              max={10.0}
              step={0.1}
              value={dApp}
              unit={<FormulaText text={inhalt.werte.t1012M2S} />}
              onChange={(e) => setDApp(Number(e.target.value))}
            />

            <Slider
              info={inhalt.werte.chloridgehaltAnDerGeländeseitigen}
              label={<FormulaText text={inhalt.werte.oberflächenkonzentrationCS} />}
              min={1.0}
              max={5.0}
              step={0.1}
              value={cS}
              unit="%"
              onChange={(e) => setCS(Number(e.target.value))}
            />

            <Slider
              label={inhalt.werte.alterungsexponentA}
              min={0.0}
              max={0.8}
              step={0.05}
              value={a}
              unit=""
              info={inhalt.werte.beschreibtDieAbnahmeDes}
              onChange={(e) => setA(Number(e.target.value))}
            />
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[500px]">
              <h2 className="text-xl font-bold text-text-main mb-2">
                Chlorid-Eindringprofil
              </h2>

              {chloridChartData.isCorroding && (
                <div className="bg-torch-red/10 text-torch-red p-4 rounded-lg mb-4 font-bold border border-torch-red/30 animate-pulse"><MdText text={inhalt.texte.achtungDepassivierungErreichtRestnutzung} /></div>
              )}

              <div className="flex-1 relative w-full h-full">
                <Line data={chloridChartData as ChartData<'line', (number | null)[]>} options={chloridOptions} />
              </div>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungChloridfrontBeweh} /></h3>
              <div className="relative w-full h-48 bg-off-white rounded-lg border border-home-grau/30 overflow-hidden flex items-center justify-center">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 200"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Beton */}
                  <rect x="50" y="20" width="300" height="160" fill="#cbd5e1" />

                  {/* Oberfläche (links) */}
                  <rect x="40" y="20" width="10" height="160" fill="#64748b" />
                  <text
                    x="30"
                    y="100"
                    fontSize="12"
                    fill="#334155"
                    textAnchor="middle"
                    transform="rotate(-90 30,100)"
                  >
                    Oberfläche (x=0)
                  </text>

                  {/* Chlorid-Gradient (simuliert durch Farbverlauf) */}
                  <defs>
                    <linearGradient
                      id="chloridGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="rgba(163, 17, 62, 0.6)" />
                      <stop offset="30%" stopColor="rgba(163, 17, 62, 0.2)" />
                      <stop offset="100%" stopColor="rgba(163, 17, 62, 0)" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="50"
                    y="20"
                    width="300"
                    height="160"
                    fill="url(#chloridGrad)"
                  />

                  {/* Bewehrung */}
                  <circle
                    cx={50 + (cNom / 100) * 300}
                    cy="100"
                    r="15"
                    fill={chloridChartData.isCorroding ? "#A3113E" : "#475569"}
                    stroke={
                      chloridChartData.isCorroding ? "#881235" : "#1e293b"
                    }
                    strokeWidth="2"
                    className={
                      chloridChartData.isCorroding
                        ? "animate-pulse"
                        : "transition-colors duration-500"
                    }
                  />
                  {chloridChartData.isCorroding && (
                    <>
                      {/* Rost-Partikel-Animation */}
                      <circle
                        cx={50 + (cNom / 100) * 300}
                        cy="100"
                        r="22"
                        fill="none"
                        stroke="#A3113E"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        className="animate-spin-slow opacity-60"
                        style={{ animationDuration: "4s" }}
                      />
                      <circle
                        cx={50 + (cNom / 100) * 300}
                        cy="100"
                        r="28"
                        fill="none"
                        stroke="#A3113E"
                        strokeWidth="1"
                        strokeDasharray="8 8"
                        className="animate-spin-slow opacity-30"
                        style={{
                          animationDuration: "6s",
                          animationDirection: "reverse",
                        }}
                      />
                    </>
                  )}
                  <circle
                    cx={50 + (cNom / 100) * 300}
                    cy="100"
                    r="10"
                    fill="none"
                    stroke={
                      chloridChartData.isCorroding ? "#fbe5e9" : "#94a3b8"
                    }
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />

                  {/* Betondeckung Maßlinie */}
                  <path
                    d={`M 50 160 L ${50 + (cNom / 100) * 300 - 15} 160`}
                    stroke="#334155"
                    strokeWidth="2"
                    markerStart="url(#arrow-dark)"
                    markerEnd="url(#arrow-dark)"
                  />
                  <text
                    x={50 + ((cNom / 100) * 300) / 2}
                    y="155"
                    fontSize="12"
                    fill="#334155"
                    textAnchor="middle"
                  >
                    c_nom = {formatDeWert(cNom)} mm
                  </text>

                  {/* Kritische Front (vereinfacht dargestellt bei 0.5%) */}
                  <path
                    d={`M ${50 + (cNom / 100) * 300 * 0.8} 20 L ${50 + (cNom / 100) * 300 * 0.8} 180`}
                    stroke="#A3113E"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                  />
                  <text
                    x={50 + (cNom / 100) * 300 * 0.8}
                    y="15"
                    fontSize="10"
                    fill="#A3113E"
                    textAnchor="middle"
                  >
                    C_crit Front
                  </text>

                  {/* Korrosionswarnung */}
                  {chloridChartData.isCorroding && (
                    <g
                      transform={`translate(${50 + (cNom / 100) * 300}, 80)`}
                      className="animate-pulse"
                    >
                      <path
                        d="M -10 -10 L 10 10 M 10 -10 L -10 10"
                        stroke="#A3113E"
                        strokeWidth="3"
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r="18"
                        fill="none"
                        stroke="#A3113E"
                        strokeWidth="2"
                      />
                    </g>
                  )}

                  <defs>
                    <marker
                      id="arrow-dark"
                      viewBox="0 0 10 10"
                      refX="5"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
              <h2 className="text-xl font-bold text-text-main mb-4"><MdText text={inhalt.texte.normenFormeln} /></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-text-main/80">
                <div>
                  <strong className="text-text-main">Grundlage:</strong><MdText text={inhalt.texte.fibModelCode2010} /><strong className="text-text-main"><MdText text={inhalt.texte.t2FickSchesDiffusionsgesetz} /></strong>
                  <div className="bg-off-white p-2 rounded mt-1 font-mono text-xs border border-home-grau/30">
                    <FormulaText text="C(x,t) = C_s \cdot [ 1 - erf( x / (2 \cdot \sqrt{D_{app}(t) \cdot t}) ) ]" />
                  </div>
                  <p className="text-xs mt-1"><MdText text={inhalt.texte.erfGaußscheFehlerfunktionBr} /><FormulaText text="C_{crit} \approx 0{,}5" /><MdText text={inhalt.texte.mBezogenAufDen} /></p>
                </div>
                <div>
                  <strong className="text-text-main"><MdText text={inhalt.texte.zeitabhängigerDiffusionskoeffizient} /></strong>
                  <div className="bg-off-white p-2 rounded mt-1 font-mono text-xs border border-home-grau/30">
                    <FormulaText text="D_{app}(t) = D_{app}(t_0) \cdot (t_0 / t)^a" />
                  </div>
                  <p className="text-xs mt-1">
                    <FormulaText text="t_0" /><MdText text={inhalt.texte.referenzzeitpunktMeist28Tage} /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "karbonatisierung" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.parameterWurzelTGesetz} /></h2>

            <Slider
              label={inhalt.werte.betrachtungszeitpunktT}
              min={1}
              max={100}
              step={1}
              value={tKarb}
              unit="Jahre"
              onChange={(e) => setTKarb(Number(e.target.value))}
            />

            <Slider
              info={inhalt.werte.nennmaßDerBetondeckungFür}
              label={<FormulaText text={inhalt.werte.betondeckungCNom4} />}
              min={10}
              max={70}
              step={1}
              value={cNomKarb}
              unit="mm"
              onChange={(e) => setCNomKarb(Number(e.target.value))}
            />

            <Slider
              label={inhalt.werte.karbonatisierungsgeschwindigkeitK}
              min={0.5}
              max={10.0}
              step={0.1}
              value={kKarb}
              unit="mm/√a"
              info={inhalt.werte.hängtVonDerBetonqualität}
              onChange={(e) => setKKarb(Number(e.target.value))}
            />
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[500px]">
              <h2 className="text-xl font-bold text-text-main mb-2">
                Karbonatisierungsfortschritt
              </h2>

              {karbonatisierungChartData.isCorroding && (
                <div className="bg-torch-red/10 text-torch-red p-4 rounded-lg mb-4 font-bold border border-torch-red/30 animate-pulse"><MdText text={inhalt.texte.achtungDepassivierungErreichtDie} /></div>
              )}

              <div className="flex-1 relative w-full h-full">
                <Line
                  data={karbonatisierungChartData as ChartData<'line', (number | null)[]>}
                  options={karbonatisierungOptions}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === "schnellkarbonatisierung" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.parameterSchnelltest} /></h2>

            <Slider
              label={inhalt.werte.prüfdauerT}
              min={1}
              max={90}
              step={1}
              value={tSchnell}
              unit="Tage"
              onChange={(e) => setTSchnell(Number(e.target.value))}
            />

            <Slider
              label={inhalt.werte.co2KonzentrationKammer}
              min={0.5}
              max={4.0}
              step={0.1}
              value={co2KonzSchnell}
              unit="Vol.-%"
              info={inhalt.werte.erhöhteCo2KonzentrationIm}
              onChange={(e) => setCo2KonzSchnell(Number(e.target.value))}
            />

            <Slider
              label={inhalt.werte.natürlicheCo2Konzentration}
              min={0.03}
              max={0.1}
              step={0.01}
              value={co2Konz}
              unit="Vol.-%"
              onChange={(e) => setCo2Konz(Number(e.target.value))}
            />

            <Slider
              info={inhalt.werte.imLaborbeschleunigtenSchnellprüfverfahre}
              label={
                <FormulaText text={inhalt.werte.karbonatisierungsgeschwindigkeitKSchnell} />
              }
              min={1.0}
              max={30.0}
              step={0.5}
              value={kKarbSchnell}
              unit="mm/√d"
              onChange={(e) => setKKarbSchnell(Number(e.target.value))}
            />
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[500px]">
              <h2 className="text-xl font-bold text-text-main mb-2"><MdText text={inhalt.texte.schnellkarbonatisierungVsNatürlich} /></h2>

              <div className="bg-off-white p-4 rounded-lg mb-4 border border-home-grau/30">
                <div className="font-bold text-text-main"><MdText text={inhalt.texte.äquivalenterNatürlicherKWert} /></div>
                <div className="text-2xl font-bold text-shiraz mt-1">
                  {formatDeZahl(schnellkarbonatisierungChartData.kNatEquivalent, 2)}{" "}
                  mm/√a
                </div>
                <div className="text-xs text-text-main/70 mt-1">
                  <FormulaText text={inhalt.werte.berechnetÜberDasVerhältnis} />
                </div>
              </div>

              <div className="flex-1 relative w-full h-full">
                <Line
                  data={schnellkarbonatisierungChartData}
                  options={schnellkarbonatisierungOptions}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "lokalelement" && (
        <LokalelementSimulator />
      )}
      </ModuleTabs>

      {/* Global ModuleFooter */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1ChloridgehaltAn}
        zielGleichung="C(x,t) = C_s \cdot \left[1 - \mathrm{erf}\left(\frac{x}{2\sqrt{D_{app} \cdot t}}\right)\right]"
        schritte={inhalt.daten["Korrosion.schritte"]}
        ergebnisHinweis={inhalt.werte.mit35MmDeckung}
        normQuelle={inhalt.werte.fibBulletin342006}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2QuerschnittsverlustEines}
        zielGleichung="v_{corr} = \frac{M \cdot i_{corr}}{z \cdot F \cdot \rho}"
        schritte={inhalt.daten["Korrosion.schritte_2"]}
        ergebnisHinweis={inhalt.werte.beiChloridinduziertemLochfraßIst}
        normQuelle={inhalt.werte.faradayschesGesetzDinEn}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="korrosion" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap10}
        wikipedia={[
          { title: 'Bewehrungskorrosion' },
          { title: inhalt.werte.karbonatisierungBeton },
          { title: 'Lochfraßkorrosion', url: 'https://de.wikipedia.org/wiki/Lochfra%C3%9Fkorrosion' }
        ]}
        literatur={inhalt.daten["Korrosion.literatur"]}
        regelwerke={inhalt.daten["Korrosion.regelwerke"]}
        formeln={inhalt.daten["Korrosion.formeln"]}
      />
    </div>
  );
}
