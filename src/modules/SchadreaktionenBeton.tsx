import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { AlertTriangle, CheckCircle2, Info, Droplets, Snowflake, ShieldAlert, Sparkles, Microscope } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function AkrGefuegeSimulator() {
  const [alkaliContent, setAlkaliContent] = useState(1.10); // Na2O-Äquivalent in M.-%
  const [exposureEnv, setExposureEnv] = useState<'WO' | 'WF' | 'WS'>('WS');
  const [years, setYears] = useState(8);
  const [aggregateSensitivity, setAggregateSensitivity] = useState<'E1' | 'E2' | 'E3'>('E3');

  const simResults = useMemo(() => {
    const isReactive = aggregateSensitivity !== 'E1';
    const hasMoisture = exposureEnv !== 'WO';
    const isAlkaliCritical = alkaliContent > 0.60;

    const akrTriggered = isReactive && hasMoisture && isAlkaliCritical;

    // Environmental acceleration factor
    const envFactor = exposureEnv === 'WO' ? 0.0 : exposureEnv === 'WF' ? 1.0 : 1.85;
    const aggFactor = aggregateSensitivity === 'E1' ? 0.0 : aggregateSensitivity === 'E2' ? 0.65 : 1.35;
    const alkaliExcess = Math.max(0, alkaliContent - 0.50);

    // Gel swelling pressure build-up (MPa)
    const timeProgress = Math.min(1.0, years / 15);
    const maxGelPressure = akrTriggered ? Math.min(13.5, alkaliExcess * aggFactor * envFactor * 7.5) : 0;
    const currentGelPressure = maxGelPressure * Math.pow(timeProgress, 1.4);

    // Concrete tensile strength ~ 3.0 MPa
    const fctm = 3.0;
    const isCracked = currentGelPressure >= fctm;
    const crackWidthMm = isCracked ? Math.min(2.8, (currentGelPressure - fctm) * 0.28 * (years / 10)) : 0;
    const expansionEpsMm = isCracked ? Math.min(3.5, 0.4 + crackWidthMm * 1.1) : 0;

    let damageLevel = 'Keine AKR (Dauerhaft)';
    let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';

    if (akrTriggered) {
      if (currentGelPressure < fctm) {
        damageLevel = 'Gelbildungsphase (Latenzzeit)';
        badgeColor = 'bg-amber-50 text-amber-800 border-amber-300';
      } else if (crackWidthMm < 0.3) {
        damageLevel = 'Mikrorissbildung (Drei-Sterne-Risse)';
        badgeColor = 'bg-orange-50 text-orange-800 border-orange-300';
      } else if (crackWidthMm < 1.0) {
        damageLevel = 'Netzrissmuster & Gelaustritt';
        badgeColor = 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
      } else {
        damageLevel = 'Strukturelles Versagen ("Betonkrebs")';
        badgeColor = 'bg-red-100 text-red-800 border-red-500 font-bold animate-pulse';
      }
    }

    return {
      akrTriggered,
      currentGelPressure,
      isCracked,
      crackWidthMm,
      expansionEpsMm,
      damageLevel,
      badgeColor,
    };
  }, [alkaliContent, exposureEnv, years, aggregateSensitivity]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Intro Box */}
      <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
        <p>
          <strong>Mikrostrukturelle Simulation der Alkali-Kieselsäure-Reaktion (AKR / „Betonkrebs“):</strong> Alkalilösliche 
          Kieselsäure (<InlineMath math="\text{SiO}_2" />) aus empfindlichen Gesteinskörnern (Opalsandstein, Flinte) reagiert 
          mit Alkalihydroxiden (<InlineMath math="\text{Na}^+, \text{K}^+, \text{OH}^-" />) aus dem Zement und externen Tausalzen. 
          Das gebildete Alkali-Kieselsäure-Gel nimmt Feuchtigkeit auf und quillt enorm. Sobald der osmotische Quelldruck 
          die Betonzugfestigkeit (<InlineMath math="f_{\text{ctm}} \approx 3{,}0\text{ MPa}" />) übersteigt, entstehen 
          charakteristische <strong>Drei-Sterne-Radialrisse</strong> und das typische netzartige Oberflächenrissmuster.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center gap-2 border-b border-home-grau/20 pb-2">
              <Microscope size={16} className="text-shiraz" /> 1. Reaktionsbedingungen
            </h3>

            {/* Alkali Content Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-text-main">Alkaligehalt (Na₂O-Äquivalent):</span>
                <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                  alkaliContent > 0.60 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {formatDeZahl(alkaliContent, 2)} M.-%
                </span>
              </div>
              <input
                type="range"
                min={0.40}
                max={1.60}
                step={0.05}
                value={alkaliContent}
                onChange={(e) => setAlkaliContent(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
              <div className="flex justify-between text-[10px] text-text-main/60">
                <span>0,40 %</span>
                <span className="font-bold text-shiraz">NA-Grenze: 0,60 %</span>
                <span>1,60 % (Sehr hoch)</span>
              </div>
            </div>

            {/* Aggregate Sensitivity Radio */}
            <div className="space-y-1.5 pt-2 border-t border-home-grau/20 text-xs">
              <span className="font-bold text-text-main block">Alkaliempfindlichkeitsklasse Gestein:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'E1', label: 'E I (unbedenklich)', sub: 'Quarz/Granit' },
                  { id: 'E2', label: 'E II (bedenklich)', sub: 'z. B. Kies mit Flint' },
                  { id: 'E3', label: 'E III (schädlich)', sub: 'Opalsandstein' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAggregateSensitivity(item.id as any)}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      aggregateSensitivity === item.id
                        ? 'bg-shiraz/10 text-shiraz border-shiraz font-bold shadow-xs'
                        : 'bg-off-white text-text-main border-home-grau/30 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-xs">{item.id}</span>
                    <span className="text-[9px] opacity-75">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Exposure Environment */}
            <div className="space-y-1.5 pt-2 border-t border-home-grau/20 text-xs">
              <span className="font-bold text-text-main block">Feuchte- &amp; Tausalz-Exposition:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'WO', label: 'WO (Trocken)', sub: 'Innenräume' },
                  { id: 'WF', label: 'WF (Feucht)', sub: 'Außenbauteile' },
                  { id: 'WS', label: 'WS (Tausalz)', sub: 'Autobahnen' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setExposureEnv(item.id as any)}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      exposureEnv === item.id
                        ? 'bg-shiraz text-white border-shiraz font-bold shadow-xs'
                        : 'bg-off-white text-text-main border-home-grau/30 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-xs">{item.id}</span>
                    <span className="text-[9px] opacity-80">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Standzeit Slider */}
            <div className="space-y-1.5 pt-2 border-t border-home-grau/20">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-text-main">Expositionsdauer:</span>
                <span className="font-mono font-bold bg-slate-100 text-text-main px-2 py-0.5 rounded text-xs">
                  {years} Jahre
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
            </div>

            {/* Live Readout Cards */}
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-home-grau/20">
              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block">Gel-Quelldruck</span>
                <span className={`text-xl font-mono font-bold ${
                  simResults.currentGelPressure >= 3.0 ? 'text-red-600' : 'text-text-main'
                }`}>
                  {formatDeZahl(simResults.currentGelPressure, 1)} MPa
                </span>
                <span className="text-[9px] text-text-main/70 block">fctm ≈ 3,0 MPa</span>
              </div>

              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block">Rissweite w</span>
                <span className="text-xl font-mono font-bold text-shiraz">
                  {formatDeZahl(simResults.crackWidthMm, 2)} mm
                </span>
                <span className="text-[9px] text-text-main/70 block">Drei-Sterne-Riss</span>
              </div>

              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block">Dehnung ε_AKR</span>
                <span className="text-xl font-mono font-bold text-amber-700">
                  {formatDeZahl(simResults.expansionEpsMm, 2)} mm/m
                </span>
                <span className="text-[9px] text-text-main/70 block">Treiberweiterung</span>
              </div>

              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block">Reaktionsstatus</span>
                <span className="text-xs font-bold text-text-main mt-1 block">
                  {simResults.akrTriggered ? 'Aktiv quellend' : 'Inaktiv (Stabil)'}
                </span>
              </div>
            </div>

            {/* Status Banner */}
            <div className={`p-3 rounded-xl border text-xs font-semibold text-center ${simResults.badgeColor}`}>
              {simResults.damageLevel}
            </div>

          </div>
        </div>

        {/* Visualizer Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full">
            
            <div className="flex items-center justify-between pb-3 border-b border-home-grau/20 mb-3">
              <div>
                <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                  <Sparkles size={18} className="text-shiraz" /> 2. Mikrogefüge &amp; Gelquellen (Mikroskopie)
                </h3>
                <span className="text-xs text-text-main/70 font-medium">Reaktives Opalkorn im Zementsteingefüge</span>
              </div>
              <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
                Vergrößerung: 200×
              </span>
            </div>

            {/* SVG Visualizer Canvas */}
            <div className="relative w-full aspect-4/3 max-h-[380px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 540 380" className="select-none">
                <defs>
                  {/* Cement paste background */}
                  <radialGradient id="cementPasteGrad" cx="50%" cy="50%" r="65%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="70%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </radialGradient>

                  {/* Reactive aggregate body */}
                  <radialGradient id="aggregateGrainGrad" cx="45%" cy="45%" r="60%">
                    <stop offset="0%" stopColor="#cbd5e1" />
                    <stop offset="70%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#64748b" />
                  </radialGradient>

                  {/* Swelling Gel Gradient */}
                  <radialGradient id="gelGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                    <stop offset="70%" stopColor="#0284c7" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
                  </radialGradient>
                </defs>

                {/* Cement matrix background */}
                <rect width="540" height="380" fill="url(#cementPasteGrad)" />

                {/* Surrounding Inert Aggregates */}
                <circle cx="80" cy="80" r="38" fill="#475569" stroke="#334155" strokeWidth="2" opacity="0.6" />
                <circle cx="460" cy="70" r="45" fill="#475569" stroke="#334155" strokeWidth="2" opacity="0.6" />
                <circle cx="90" cy="300" r="42" fill="#475569" stroke="#334155" strokeWidth="2" opacity="0.6" />
                <circle cx="450" cy="310" r="40" fill="#475569" stroke="#334155" strokeWidth="2" opacity="0.6" />

                {/* Influx of Alkali and Water molecules from perimeter */}
                {simResults.akrTriggered && (
                  <g opacity="0.85">
                    <path d="M 170 80 L 220 130" stroke="#fde047" strokeWidth="2" strokeDasharray="3 3" />
                    <text x="160" y="75" fill="#fde047" fontSize="10" fontWeight="bold">Na⁺ / K⁺</text>

                    <path d="M 370 80 L 320 130" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                    <text x="375" y="75" fill="#38bdf8" fontSize="10" fontWeight="bold">H₂O</text>

                    <path d="M 150 260 L 210 230" stroke="#fde047" strokeWidth="2" strokeDasharray="3 3" />
                    <text x="130" y="275" fill="#fde047" fontSize="10" fontWeight="bold">OH⁻</text>
                  </g>
                )}

                {/* Tri-Star Cracks propagating into cement paste */}
                {simResults.isCracked && (
                  <g>
                    {/* Star Ray 1: Top Right ~ 30 deg */}
                    <path
                      d="M 310 160 L 390 120 L 480 90"
                      stroke="#fca5a5"
                      strokeWidth={2 + simResults.crackWidthMm * 2.5}
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Star Ray 2: Top Left / North ~ 150 deg */}
                    <path
                      d="M 230 140 L 190 80 L 140 30"
                      stroke="#fca5a5"
                      strokeWidth={2 + simResults.crackWidthMm * 2.5}
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Star Ray 3: Bottom South ~ 270 deg */}
                    <path
                      d="M 270 240 L 265 310 L 280 370"
                      stroke="#fca5a5"
                      strokeWidth={2 + simResults.crackWidthMm * 2.5}
                      strokeLinecap="round"
                      fill="none"
                    />

                    {/* Secondary crack branching */}
                    {simResults.crackWidthMm > 0.8 && (
                      <>
                        <path d="M 390 120 L 440 160" stroke="#ef4444" strokeWidth="2" fill="none" />
                        <path d="M 190 80 L 130 90" stroke="#ef4444" strokeWidth="2" fill="none" />
                        <path d="M 265 310 L 220 340" stroke="#ef4444" strokeWidth="2" fill="none" />
                      </>
                    )}

                    {/* Exuded White Alkali-Silica Gel inside crack mouths */}
                    <circle cx="340" cy="145" r="4" fill="#ffffff" opacity="0.85" />
                    <circle cx="215" cy="115" r="4" fill="#ffffff" opacity="0.85" />
                    <circle cx="268" cy="275" r="4" fill="#ffffff" opacity="0.85" />
                  </g>
                )}

                {/* Swelling Gel Zone surrounding the aggregate grain */}
                {simResults.akrTriggered && (
                  <circle
                    cx="270"
                    cy="190"
                    r={68 + (simResults.currentGelPressure / 14) * 22}
                    fill="url(#gelGrad)"
                    className={simResults.currentGelPressure > 3.0 ? 'animate-pulse' : ''}
                  />
                )}

                {/* Central Reactive Aggregate Grain (Opalsandstein) */}
                <g transform="translate(270, 190)">
                  <circle
                    cx="0"
                    cy="0"
                    r="68"
                    fill="url(#aggregateGrainGrad)"
                    stroke="#1e293b"
                    strokeWidth="3"
                  />
                  <text x="0" y="-8" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Reaktives Quarzkorn
                  </text>
                  <text x="0" y="8" fill="#334155" fontSize="10" className="font-mono" textAnchor="middle">
                    ({aggregateSensitivity === 'E3' ? 'Opalsandstein' : aggregateSensitivity === 'E2' ? 'Grauwacke' : 'Inertes Korn'})
                  </text>

                  {/* Internal pressure radial arrows if swelling */}
                  {simResults.currentGelPressure > 1.5 && (
                    <g opacity="0.9">
                      <line x1="0" y1="-30" x2="0" y2="-55" stroke="#ef4444" strokeWidth="2.5" />
                      <polygon points="-4,-50 0,-58 4,-50" fill="#ef4444" />

                      <line x1="30" y1="20" x2="52" y2="35" stroke="#ef4444" strokeWidth="2.5" />
                      <polygon points="46,38 58,40 50,30" fill="#ef4444" />

                      <line x1="-30" y1="20" x2="-52" y2="35" stroke="#ef4444" strokeWidth="2.5" />
                      <polygon points="-46,38 -58,40 -50,30" fill="#ef4444" />

                      <text x="0" y="28" fill="#dc2626" fontSize="10" fontWeight="bold" textAnchor="middle">
                        p_gel = {formatDeZahl(simResults.currentGelPressure, 1)} MPa
                      </text>
                    </g>
                  )}
                </g>

                {/* Legend Overlay top left */}
                <g transform="translate(20, 20)">
                  <rect width="180" height="75" rx="6" fill="#0f172a" opacity="0.85" stroke="#334155" />
                  <circle cx="15" cy="18" r="5" fill="#38bdf8" />
                  <text x="28" y="22" fill="#cbd5e1" fontSize="10">Quellendes Kieselgel</text>

                  <line x1="10" y1="38" x2="20" y2="38" stroke="#ef4444" strokeWidth="3" />
                  <text x="28" y="42" fill="#cbd5e1" fontSize="10">Drei-Sterne-Radialriss</text>

                  <circle cx="15" cy="58" r="4" fill="#ffffff" />
                  <text x="28" y="62" fill="#cbd5e1" fontSize="10">Ausgetretenes Kieselgel</text>
                </g>

                {/* Surface Map Cracking (Netzrisse) Inset Preview bottom right */}
                <g transform="translate(370, 230)">
                  <rect width="150" height="130" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <text x="75" y="18" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Makroskopisches Bild
                  </text>
                  <text x="75" y="30" fill="#94a3b8" fontSize="8" textAnchor="middle">
                    (Netzrissmuster an Bauteil)
                  </text>

                  {/* Concrete Pavement Slab in inset */}
                  <rect x="15" y="40" width="120" height="75" rx="4" fill="#64748b" stroke="#334155" />

                  {/* Map Cracking Network */}
                  {simResults.isCracked && (
                    <g opacity={Math.min(1, simResults.crackWidthMm * 0.8)}>
                      <path d="M 25 55 L 50 65 L 75 50 L 110 60" stroke="#fca5a5" strokeWidth="1.5" fill="none" />
                      <path d="M 50 65 L 45 95 L 70 105" stroke="#fca5a5" strokeWidth="1.5" fill="none" />
                      <path d="M 75 50 L 95 80 L 125 75" stroke="#fca5a5" strokeWidth="1.5" fill="none" />
                      <path d="M 95 80 L 90 105" stroke="#fca5a5" strokeWidth="1.5" fill="none" />
                      {/* Gel exudation spot */}
                      <circle cx="50" cy="65" r="2.5" fill="#ffffff" />
                      <circle cx="95" cy="80" r="2.5" fill="#ffffff" />
                    </g>
                  )}
                  {!simResults.isCracked && (
                    <text x="75" y="80" fill="#a7f3d0" fontSize="9" textAnchor="middle">
                      Rissfreie Oberfläche
                    </text>
                  )}
                </g>
              </svg>
            </div>

            {/* Scientific Explanation Footer */}
            <div className="mt-3 p-3 bg-off-white rounded-xl border border-home-grau/25 text-xs text-text-main/80 space-y-1">
              <span className="font-bold text-shiraz block">Schadensmechanismus der Alkali-Kieselsäure-Reaktion:</span>
              <p className="leading-relaxed">
                Hydroxidionen spalten die festen Siloxanbrücken (<InlineMath math="\equiv\text{Si}-\text{O}-\text{Si}\equiv" />) 
                des amorphen Quarzes. Die positiv geladenen Alkali-Kationen (<InlineMath math="\text{Na}^+, \text{K}^+" />) 
                lagern sich an die negativ geladenen Silanolatgruppen an. Das entstehende hygroskopische Gel saugt Porenwasser auf 
                und baut Sprengdrücke von über <InlineMath math="10\text{ MPa}" /> auf, die den Beton von innen her sprengen.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

export default function SchadreaktionenBeton() {
  const [activeTab, setActiveTab] = useState<'akr' | 'akr_simulation' | 'frost' | 'sulfat'>('akr');

  // AKR State
  const [na2o, setNa2o] = useState(0.8);
  const [zement, setZement] = useState(350);
  const [feuchteklasse, setFeuchteklasse] = useState('WF');
  const [eKlasse, setEKlasse] = useState('E1');

  // Frost State
  const [wz, setWz] = useState(0.50);
  const [lp, setLp] = useState(4.5);
  const [saettigung, setSaettigung] = useState(85);
  const [tausalz, setTausalz] = useState(false);

  // Sulfat State
  const [sulfatKonz, setSulfatKonz] = useState(1500); // mg/l
  const [zementArt, setZementArt] = useState('CEM I');

  // AKR Logic
  const akrResults = useMemo(() => {
    const alkaliEintrag = zement * (na2o / 100);
    let risiko = 'Gering';
    let massnahmen = 'Keine besonderen Maßnahmen erforderlich.';
    let isOk = true;

    if (feuchteklasse === 'WO') {
      risiko = 'Kein Risiko';
      massnahmen = 'Beton ist trocken. Keine AKR möglich.';
    } else if (eKlasse === 'E1') {
      risiko = 'Gering';
      massnahmen = 'Unbedenkliche Gesteinskörnung. Keine weiteren Maßnahmen erforderlich.';
    } else {
      if (alkaliEintrag <= 3.0) {
        risiko = 'Mittel';
        massnahmen = 'Alkalimenge ≤ 3,0 kg/m³ (vereinfachte Lehrgrenze nach britischem Ansatz). In Deutschland: Maßnahme nach Tabelle der Alkali-Richtlinie, z. B. NA-Zement oder begrenzter Zementgehalt.';
      } else {
        risiko = 'Hoch';
        isOk = false;
        massnahmen = 'Alkalimenge > 3,0 kg/m³ (vereinfachte Lehrgrenze). Maßnahmen nach Alkali-Richtlinie erforderlich: NA-Zement, Zementgehalt begrenzen oder Gesteinskörnung E I wählen.';
      }
      if (feuchteklasse === 'WS' && eKlasse === 'E3') {
        risiko = 'Sehr Hoch';
        isOk = false;
        massnahmen = 'Feuchtigkeitsklasse WS mit E III: Gesteinskörnung austauschen oder gutachterliche Stellungnahme bzw. Performance-Prüfung erforderlich (Alkali-Richtlinie).';
      }
    }
    return { alkaliEintrag, risiko, massnahmen, isOk };
  }, [na2o, zement, feuchteklasse, eKlasse]);

  const akrChartData = useMemo(() => {
    const labels = [];
    const dataCurrent = [];
    const dataNA = [];
    for (let z = 250; z <= 500; z += 25) {
      labels.push(z);
      dataCurrent.push(z * (na2o / 100));
      dataNA.push(z * 0.006);
    }
    return {
      labels,
      datasets: [
        {
          label: `Aktueller Zement (${formatDeWert(na2o)} M.-%)`,
          data: dataCurrent,
          borderColor: '#dc2626',
          backgroundColor: '#dc2626',
          tension: 0.1,
        },
        {
          label: 'NA-Zement (0,60 M.-%)',
          data: dataNA,
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f6',
          tension: 0.1,
          borderDash: [5, 5],
        }
      ]
    };
  }, [na2o]);

  // Frost Logic
  const frostResults = useMemo(() => {
    const l_bar = Math.max(0.1, 3 * (1.4 * Math.max(0.01, wz - 0.35) / Math.max(0.1, lp)));
    const s_krit = 88;
    let risiko = 'Gering';
    let isOk = true;
    let massnahmen = 'Beton ist ausreichend frostbeständig.';

    if (saettigung > s_krit) {
      risiko = 'Sehr Hoch (Frostsprengung)';
      isOk = false;
      massnahmen = `Der Sättigungsgrad (${formatDeWert(saettigung)}%) überschreitet den kritischen Wert (${s_krit}%). Das gefrierende Wasser hat keinen Platz zum Ausweichen. Frostsprengung wahrscheinlich!`;
    } else if (tausalz) {
      if (wz > 0.50 || lp < 4.0 || l_bar > 0.20) {
        risiko = 'Hoch (Oberflächenabwitterung)';
        isOk = false;
        massnahmen = 'Bei Frost-Tausalz-Angriff (XF4) ist ein w/z-Wert ≤ 0.50 und ausreichend künstliche Luftporen (LP ≥ 4,0 Vol.-%, Abstandsfaktor ≤ 0,20 mm) zwingend erforderlich.';
      } else {
        risiko = 'Gering (Frost-Tausalz-beständig)';
        massnahmen = 'Ausreichender Luftporengehalt und niedriger w/z-Wert schützen vor osmotischem Druck und Abwitterung.';
      }
    } else {
      if (wz > 0.55 && saettigung > 80) {
        risiko = 'Mittel (Mikrorissbildung)';
        isOk = false;
        massnahmen = 'Hoher w/z-Wert führt zu hoher Kapillarporosität. Bei hoher Sättigung drohen Mikrorisse durch Eisdruck.';
      } else {
        risiko = 'Gering (Frostbeständig)';
        massnahmen = 'Beton ist für reinen Frostangriff ohne Tausalz ausreichend ausgelegt.';
      }
    }
    return { l_bar, s_krit, risiko, isOk, massnahmen };
  }, [wz, lp, saettigung, tausalz]);

  const frostChartData = useMemo(() => {
    const labels = [];
    const lBarData = [];
    const currentPointData = [];
    for (let currentLp = 1; currentLp <= 8; currentLp += 0.5) {
      labels.push(formatDeZahl(currentLp, 1));
      const currentLBar = Math.max(0.1, 3 * (1.4 * Math.max(0.01, wz - 0.35) / Math.max(0.1, currentLp)));
      lBarData.push(currentLBar);
      if (Math.abs(currentLp - lp) < 0.25) {
        currentPointData.push(frostResults.l_bar);
      } else {
        currentPointData.push(null);
      }
    }
    return {
      labels,
      datasets: [
        {
          label: 'Abstandsfaktor L_bar [mm]',
          data: lBarData,
          borderColor: '#A3113E',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0.4,
        },
        {
          label: 'Aktueller Wert',
          data: currentPointData,
          borderColor: '#0e558c',
          backgroundColor: '#0e558c',
          pointRadius: 6,
          pointStyle: 'circle',
          borderWidth: 2,
        }
      ]
    };
  }, [wz, lp, frostResults.l_bar]);

  // Sulfat Logic
  const sulfatResults = useMemo(() => {
    let xA = 'XA1';
    let risiko = 'Gering';
    let isOk = true;
    let massnahmen = 'Keine besonderen Maßnahmen erforderlich.';

    if (sulfatKonz <= 200) {
      xA = 'X0';
      risiko = 'Kein Risiko';
      massnahmen = 'Sulfatkonzentration unbedenklich.';
    } else if (sulfatKonz <= 600) {
      xA = 'XA1';
      risiko = 'Schwach angreifend';
      if (zementArt !== 'CEM I' && zementArt !== 'CEM III/B' && zementArt !== 'SR-Zement') {
        massnahmen = 'Verwendung von Zementen mit mäßigem Sulfatwiderstand empfohlen.';
      }
    } else if (sulfatKonz <= 3000) {
      xA = 'XA2';
      risiko = 'Mäßig angreifend';
      if (zementArt !== 'SR-Zement' && zementArt !== 'CEM III/B') {
        isOk = false;
        massnahmen = 'Zwingend SR-Zement (hoher Sulfatwiderstand) oder CEM III/B / CEM III/C verwenden!';
      } else {
        massnahmen = 'SR-Zement oder Hochofenzement schützt vor Ettringitbildung.';
      }
    } else {
      xA = 'XA3';
      risiko = 'Stark angreifend';
      isOk = false;
      if (zementArt !== 'SR-Zement' && zementArt !== 'CEM III/B') {
        massnahmen = 'Zwingend SR-Zement oder CEM III/B / CEM III/C verwenden! Ggf. zusätzliche Schutzbeschichtung erforderlich.';
      } else {
        massnahmen = 'Zusätzliche Schutzmaßnahmen (z.B. Beschichtung) bei XA3 oft erforderlich, trotz SR-Zement.';
      }
    }

    return { xA, risiko, isOk, massnahmen };
  }, [sulfatKonz, zementArt]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
          <ShieldAlert size={24} />
        </div>
        <h2 className="text-2xl font-bold text-text-main">Betonkorrosion</h2>
      </div>

      <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
        <p>
          <FormulaText text="Schadreaktionen im Beton können durch innere chemische Reaktionen (AKR), physikalische Einwirkungen (Frost-Tau) oder äußere chemische Angriffe (Sulfattreiben) entstehen. Alle diese Prozesse führen zu einer Volumenvergrößerung und damit zu Rissen und Abplatzungen." />
        </p>
      </div>

      <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 animate-in fade-in duration-300">
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'akr' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('akr')}>
          <Sparkles size={16} /> Alkalitreiben (AKR)
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'frost' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('frost')}>
          <Snowflake size={16} /> Frost-Tau-Widerstand
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'sulfat' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('sulfat')}>
          <AlertTriangle size={16} /> Sulfattreiben
        </button>
      </div>

      {activeTab === 'akr' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Eingabeparameter (AKR)</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Feuchtigkeitsklasse</label></div>
                  <select aria-label="Feuchtigkeitsklasse" 
                    className="p-2 border border-home-grau rounded-md bg-white"
                    value={feuchteklasse}
                    onChange={(e) => setFeuchteklasse(e.target.value)}
                  >
                    <option value="WO">WO (Trocken)</option>
                    <option value="WF">WF (Feucht)</option>
                    <option value="WA">WA (Feucht + Alkalizufuhr von außen)</option>
                    <option value="WS">WS (Feucht + starke Alkalizufuhr, z.B. Tausalz)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Alkaliempfindlichkeit</label></div>
                  <select aria-label="Alkaliempfindlichkeit" 
                    className="p-2 border border-home-grau rounded-md bg-white"
                    value={eKlasse}
                    onChange={(e) => setEKlasse(e.target.value)}
                  >
                    <option value="E1">E I (unbedenklich)</option>
                    <option value="E2">E II (bedenklich)</option>
                    <option value="E3">E III (schädlich)</option>
                  </select>
                </div>
              </div>

              <Slider info="Menge an Zement im Beton." label={<FormulaText text="Zementgehalt" />} min={250} max={500} step={10} value={zement} unit="kg/m³" onChange={(e) => setZement(Number(e.target.value))} />
              <div className="mt-4">
                <Slider label={<FormulaText text="Alkaligehalt Zement (Na_2O-Äq.)" />} info="NA-Zemente haben i.d.R. ≤ 0,60 M.-%" min={0.2} max={1.5} step={0.05} value={na2o} unit="M.-%" onChange={(e) => setNa2o(Number(e.target.value))} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className={`p-6 rounded-xl shadow-md text-white ${akrResults.isOk ? 'bg-shiraz' : 'bg-red-600'}`}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Bewertung & Alkalieintrag</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-white/70 text-sm mb-1">Alkalieintrag (Zement)</div>
                  <div className="text-3xl font-bold">{formatDeZahl(akrResults.alkaliEintrag, 2)} kg/m³</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm mb-1">AKR-Risiko</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    {akrResults.isOk ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                    {akrResults.risiko}
                  </div>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                <div className="text-sm font-bold mb-1 flex items-center gap-2">
                  <Info size={16} /> Maßnahmen
                </div>
                <div className="text-sm leading-relaxed">
                  {akrResults.massnahmen}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Alkalieintrag über Zementgehalt</h3>
              <div className="h-[250px] w-full">
                <Line data={akrChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'frost' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Eingabeparameter (Frost)</h3>
              
              <div className="flex items-center gap-3 mb-6 bg-white p-3 rounded-lg border border-home-grau/30">
                <input 
                  type="checkbox" 
                  id="tausalz" 
                  checked={tausalz} 
                  onChange={(e) => setTausalz(e.target.checked)}
                  className="w-5 h-5 text-shiraz rounded border-gray-300 focus:ring-middle-blue"
                />
                <label htmlFor="tausalz" className="text-sm font-medium text-text-main flex items-center gap-2 cursor-pointer">
                  <Snowflake size={16} className="text-blue-500" />
                  Frost-Tausalz-Angriff (XF2, XF4)
                </label>
              </div>

              <Slider label="w/z-Wert" min={0.35} max={0.70} step={0.01} value={wz} unit="-" onChange={(e) => setWz(Number(e.target.value))} />
              <div className="mt-4">
                <Slider label="Luftporengehalt (LP)" min={1.0} max={8.0} step={0.1} value={lp} unit="Vol.-%" onChange={(e) => setLp(Number(e.target.value))} />
              </div>
              <div className="mt-4">
                <Slider label="Sättigungsgrad (Wasser)" min={50} max={100} step={1} value={saettigung} unit="%" onChange={(e) => setSaettigung(Number(e.target.value))} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className={`p-6 rounded-xl shadow-md text-white ${frostResults.isOk ? 'bg-shiraz' : 'bg-red-600'}`}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Bewertung & Kennwerte</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-white/70 text-sm mb-1">Abstandsfaktor L_bar</div>
                  <div className="text-3xl font-bold">{formatDeZahl(frostResults.l_bar, 2)} mm</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm mb-1">Risiko</div>
                  <div className="text-xl font-bold flex items-center gap-2">
                    {frostResults.isOk ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                    {frostResults.risiko}
                  </div>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                <div className="text-sm font-bold mb-1 flex items-center gap-2">
                  <Droplets size={16} /> Diagnose & Maßnahmen
                </div>
                <div className="text-sm leading-relaxed">
                  {frostResults.massnahmen}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-home-grau/30 h-[300px] flex flex-col">
              <h3 className="text-sm font-bold text-center mb-2">Abstandsfaktor L_bar vs. Luftporengehalt</h3>
              <div className="flex-1 relative">
                <Line data={frostChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sulfat' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Eingabeparameter (Sulfat)</h3>
              
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Zementart</label></div>
                <select aria-label="Zementart" 
                  className="p-2 border border-home-grau rounded-md bg-white"
                  value={zementArt}
                  onChange={(e) => setZementArt(e.target.value)}
                >
                  <option value="CEM I">CEM I (Portlandzement)</option>
                  <option value="CEM II">CEM II (Portlandkompositzement)</option>
                  <option value="CEM III/A">CEM III/A (Hochofenzement)</option>
                  <option value="CEM III/B">CEM III/B (Hochofenzement, sulfatbeständig)</option>
                  <option value="SR-Zement">SR-Zement (Sulfatresistenter Zement)</option>
                </select>
              </div>

              <Slider label="Sulfatkonzentration im Grundwasser" min={0} max={4000} step={50} value={sulfatKonz} unit="mg/l" onChange={(e) => setSulfatKonz(Number(e.target.value))} />
            </div>
            
            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Sulfattreiben</h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg width="100%" height="160" viewBox="0 0 300 160">
                  <rect width="300" height="160" fill="#cbd5e1" />
                  
                  {/* Zementstein */}
                  <rect x="100" y="40" width="100" height="80" fill="#a8a29e" stroke="#78716c" strokeWidth="2" />
                  <text x="150" y="85" fontSize="10" fill="#ffffff" textAnchor="middle">C<tspan baselineShift="sub" fontSize="7">3</tspan>A (Zement)</text>
                  
                  {/* Sulfat dringt ein */}
                  <path d="M 30 80 L 80 80" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow-orange)" />
                  <text x="55" y="75" fontSize="10" fill="#f59e0b" textAnchor="middle">SO₄²⁻</text>

                  {/* Ettringitbildung */}
                  <circle cx="150" cy="80" r="50" fill="none" stroke="#facc15" strokeWidth="4" strokeDasharray="4 4" />
                  <text x="220" y="60" fontSize="10" fill="#ca8a04">Ettringitbildung</text>
                  <path d="M 200 60 L 180 70" stroke="#ca8a04" strokeWidth="1" markerEnd="url(#arrow-yellow)" />

                  {/* Expansion / Risse */}
                  <path d="M 150 20 L 150 0" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)" />
                  <path d="M 150 140 L 150 160" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)" />
                  <text x="160" y="15" fontSize="10" fill="#ef4444">Volumenzunahme</text>

                  <defs>
                    <marker id="arrow-orange" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                    </marker>
                    <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                    </marker>
                    <marker id="arrow-yellow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#ca8a04" />
                    </marker>
                  </defs>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2">
                  Sulfationen reagieren mit C3A aus dem Zement zu Ettringit. Diese Kristallbildung ist mit einer starken Volumenzunahme verbunden und sprengt das Gefüge.
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className={`p-6 rounded-xl shadow-md text-white ${sulfatResults.isOk ? 'bg-shiraz' : 'bg-red-600'}`}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Bewertung & Expositionsklasse</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-white/70 text-sm mb-1">Expositionsklasse</div>
                  <div className="text-3xl font-bold">{sulfatResults.xA}</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm mb-1">Risiko</div>
                  <div className="text-xl font-bold flex items-center gap-2">
                    {sulfatResults.isOk ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                    {sulfatResults.risiko}
                  </div>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                <div className="text-sm font-bold mb-1 flex items-center gap-2">
                  <Info size={16} /> Maßnahmen
                </div>
                <div className="text-sm leading-relaxed">
                  {sulfatResults.massnahmen}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Alkaligehalt eines Betons und Vergleich mit NA-Zement"
        zielGleichung="\mathrm{Na_2O_{eq}} = \mathrm{Na_2O} + 0{,}658 \cdot \mathrm{K_2O}, \quad A = z \cdot \mathrm{Na_2O_{eq}}"
        schritte={[
          { titel: 'Zementanalyse', erklaerung: 'CEM I 42,5 R: Na₂O = 0,25 M.-%, K₂O = 0,95 M.-%:', formel: '\\mathrm{Na_2O_{eq}} = 0{,}25 + 0{,}658 \\cdot 0{,}95 = 0{,}88\\,\\text{M.-\\%}' },
          { titel: 'Alkalimenge im Beton', erklaerung: 'Zementgehalt z = 360 kg/m³:', formel: 'A = 360 \\cdot 0{,}0088 = 3{,}2\\,\\text{kg/m}^3' },
          { titel: 'Mit NA-Zement', erklaerung: 'CEM I-NA (Na₂O-Äq. ≤ 0,60 M.-%):', formel: 'A_{NA} \\le 360 \\cdot 0{,}0060 = 2{,}2\\,\\text{kg/m}^3' }
        ]}
        ergebnisHinweis="In Deutschland richten sich die Maßnahmen nicht nach einem Grenzwert in kg/m³, sondern nach der Maßnahmentabelle der Alkali-Richtlinie (Alkaliempfindlichkeitsklasse E I bis E III, Feuchtigkeitsklasse WO/WF/WA/WS, Zementgehalt, NA-Zement oder Gutachten)."
        normQuelle="DAfStb-Alkali-Richtlinie (2013-10); DIN 1164-10 (NA-Zement)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Kritischer Sättigungsgrad bei Frost"
        zielGleichung="S_{krit} = \frac{1}{1 + \Delta V_{Eis}}"
        schritte={[
          { titel: 'Volumenzunahme', erklaerung: 'Wasser dehnt sich beim Gefrieren um etwa 9 % aus:', formel: '\\Delta V_{Eis} = 0{,}09' },
          { titel: 'Grenzsättigung', erklaerung: 'Bis zu diesem Füllungsgrad findet das Eis noch Platz im Porenraum:', formel: 'S_{krit} = \\frac{1}{1{,}09} = 0{,}917 = 91{,}7\\,\\%' },
          { titel: 'Folgerung', erklaerung: 'Künstliche Luftporen bleiben bei kapillarem Saugen weitgehend luftgefüllt und senken den Sättigungsgrad:', formel: 'S < S_{krit} \\Rightarrow \\text{kein Frostschaden}' }
        ]}
        ergebnisHinweis="Deshalb fordert DIN 1045-2 bei XF2 bis XF4 (bzw. alternativ sehr dichten Beton bei XF3) Luftporenbildner mit einem Abstandsfaktor der Poren unter etwa 0,20 mm."
        normQuelle="Powers (1949); DIN 1045-2:2023-08"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="schadreaktionen_beton" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 10 Dauerhaftigkeit: AKR-Klassen nach Alkali-Richtlinie, Sulfat- und Frostangriff, Normausgaben geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Alkalitreiben', url: 'https://de.wikipedia.org/wiki/Alkalitreiben' },
          { title: 'Frost-Tau-Wechsel', url: 'https://de.wikipedia.org/wiki/Frost-Tau-Wechsel' },
          { title: 'Sulfattreiben', url: 'https://de.wikipedia.org/wiki/Sulfattreiben' }
        ]}
        literatur={[
          'Stark, J.; Wicht, B.: Dauerhaftigkeit von Beton. 2. Aufl., Berlin: Springer Vieweg 2013',
          'Verein Deutscher Zementwerke (VDZ): Zement-Taschenbuch. Düsseldorf: Verlag Bau+Technik (aktuelle Ausgabe)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DAfStb-Richtlinie: Vorbeugende Maßnahmen gegen schädigende Alkalireaktion im Beton (Alkali-Richtlinie), Ausgabe 2013-10' },
          { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton – Festlegung, Eigenschaften, Herstellung und Konformität)' },
          { title: 'DIN 19573 (Mörtel für Neubau und Sanierung von Entwässerungssystemen außerhalb von Gebäuden; Ausgabe manuell prüfen)' }
        ]}
        formeln={[
          {
            formel: '3\\text{CaO} \\cdot \\text{Al}_2\\text{O}_3 \\cdot \\text{CaSO}_4 \\cdot 12\\text{H}_2\\text{O} + 2\\text{Ca}^{2+} + 2\\text{SO}_4^{2-} + 20\\text{H}_2\\text{O} \\rightarrow 3\\text{CaO} \\cdot \\text{Al}_2\\text{O}_3 \\cdot 3\\text{CaSO}_4 \\cdot 32\\text{H}_2\\text{O}',
            erklaerung: 'Klassisches Sulfattreiben: Reaktion von Monosulfat (im erhärteten Hydratgefüge) mit eindringenden Sulfationen und Calciumionen zu expansivem, kristallwasserreichem Ettringit (Trisulfat, 32 H2O). Die drastische Volumenvergrößerung sprengt die gehärtete Zementsteinmatrix.',
            quelle: 'Stark/Wicht: Dauerhaftigkeit von Beton'
          },
          {
            formel: '\\equiv\\text{Si}-\\text{O}-\\text{Si}\\equiv + \\, 2\\text{Na}^+ + 2\\text{OH}^- \\rightarrow 2(\\equiv\\text{Si}-\\text{O}^-\\text{Na}^+) + \\text{H}_2\\text{O}',
            erklaerung: 'Spaltung stabiler Neutralsiloxanbrücken des amorphen Quarzes durch hochalkalisches Porenwasser (OH-Ionen) bei der Alkali-Kieselsäure-Reaktion (AKR). Es bildet sich quellfähiges, stark wasseranziehendes Natrium-Alkali-Kieselgel, das Risse initiiert.',
            quelle: 'DAfStb-Alkali-Richtlinie / Stark & Wicht'
          },
          {
            formel: 'S_{\\text{crit}} = \\frac{V_w}{V_p} \\approx 91{,}7\\,\\% \\quad (\\Delta V_{\\text{Eis}} \\approx +9\\,\\%)',
            erklaerung: 'Kritischer Wassersättigungsgrad bei Frostbeanspruchung. Überschreitet der Füllungsgrad der Kapillarporen 91,7%, kann das Wasser die 9-prozentige Volumenzunahme beim Phasenübergang zu Eis nicht mehr schadlos in freie Luftporen verdrängen; es entsteht zerstörerischer hydraulischer Sprengdruck.',
            quelle: 'Powers: Freezing in Hardened Cement Paste'
          }
        ]}
      />
    </div>
  );
} 