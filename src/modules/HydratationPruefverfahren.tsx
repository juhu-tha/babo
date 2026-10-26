import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { InlineMath } from 'react-katex';
import { Activity, Thermometer, Layers, AlertOctagon, HelpCircle, CheckCircle, Flame, BarChart2 } from 'lucide-react';
import inhalt from '@/content/hydratationpruefverfahren/HydratationPruefverfahren.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface CementProfile {
  name: string;
  baseHeat: number; // J/g
  hydrationSpeed: number; // 1 = average, 0.5 = CEM III, 1.5 = CEM I R
  strengthSpeed: number;
}

const CEMENT_MAP: Record<string, CementProfile> = inhalt.daten.CEMENT_MAP;

export default function HydratationPruefverfahren() {
  const [panelTab, setPanelTab] = useState<'reissrahmen' | 'schwindrinne' | 'kalorimetrie'>('reissrahmen');

  // Interactive state for Reißrahmen-Sim
  const [selectedCement, setSelectedCement] = useState<string>(inhalt.werte.cemI425);
  const [freshTemp, setFreshTemp] = useState<number>(20); // °C
  const [ambientTemp, setAmbientTemp] = useState<number>(20); // °C
  const [fiberContent, setFiberContent] = useState<number>(0); // kg/m³ PP- bzw. Stahlfasern
  const [stiffnessFrame, setStiffnessFrame] = useState<number>(100); // Festhaltungsvermögen des Reißrahmens in % (100% = starrer Rahmen)

  // Recalculating curves
  const reissrahmenSimData = useMemo(() => {
    const hours = Array.from({ length: 73 }, (_, i) => i); // 0 to 72 hours
    const cement = CEMENT_MAP[selectedCement] || CEMENT_MAP['CEM I 42.5 N (Standard)'];

    // Fiber benefit multiplier (reduces net tension peak slightly, increases residual strength after cracking)
    const fiberReduction = Math.min(0.20, (fiberContent / 40) * 0.15); // max 20% stress release / redistribution

    let crackedHour = -1;
    let maxTemp = freshTemp;

    const dataPoints = hours.map((t) => {
      // 1. Temperature development (semi-adiabatic curve inside the restrained prism)
      // T(t) rises and then decays toward ambient
      const tNorm = t * cement.hydrationSpeed;
      const heatRelease = cement.baseHeat * (1 - Math.exp(-0.08 * tNorm));
      
      // Temperature rise (simplified thermal-mechanical balance of 1m³ block equivalent inside Reißrahmen)
      const dT = (heatRelease / 15) * Math.exp(-0.06 * Math.max(0, tNorm - 4));
      const currentTemp = freshTemp + dT * (1 - Math.exp(-0.15 * t)) - (freshTemp - ambientTemp) * (1 - Math.exp(-0.05 * t));
      if (currentTemp > maxTemp) {
        maxTemp = currentTemp;
      }

      // 2. Concrete tensile strength development f_ct(t) over hours
      // Starts at zero, rises as binder hydrates
      const strengthFactor = 3.2 * (t > 4 ? (1 - Math.exp(-0.06 * (t - 4) * cement.strengthSpeed)) : 0);
      const fct = strengthFactor * (1 + (fiberContent * 0.005));

      // 3. Restraint Stress development sigma_z (MPa)
      // Expansion at first (compression in frame is negative)
      // Contraction on cooling, shrinkage & thermal contraction (tension in frame is positive)
      const thermalExpansionStrain = 1.0e-5 * (currentTemp - freshTemp); 
      // Autogenous shrinkage begins around setting time (~5h)
      const shrinkageStrain = t > 5 ? 2.5e-5 * ((t - 5) / (t + 10)) : 0;
      
      // Net strain trying to happen
      const netStrain = -thermalExpansionStrain + shrinkageStrain;

      // Effective Youngs modulus of young concrete E_cm(t)
      const E_young = 31000 * (t > 3 ? (1 - Math.exp(-0.055 * (t - 3) * cement.strengthSpeed)) : 0);

      // Relaxations-Faktor: Kriechen schwächt frühen Zwang ab (~0.4 - 0.75)
      const k_relax = 0.55 + 0.15 * Math.exp(-0.03 * t);

      // Calculate restraint stress (compression active during heating, tension during cooling)
      const restraintRatio = stiffnessFrame / 100.0;
      let stress = E_young * netStrain * k_relax * restraintRatio;

      // Apply fiber contribution (fibers redistribute early stress slightly)
      if (stress > 0) {
        stress = stress * (1 - fiberReduction);
      }

      return {
        t,
        temp: currentTemp,
        fct,
        stress,
      };
    });

    // Detect first intersection point where tension stress > tensile strength fct after thermal peak
    // Tension stress is > 0, and concrete has set (fct > 0.1)
    const processedPoints = dataPoints.map((pt, idx) => {
      let isPointCracked = false;
      
      if (crackedHour !== -1) {
        isPointCracked = true;
      } else if (pt.t > 6 && pt.stress > pt.fct && pt.fct > 0.2) {
        crackedHour = pt.t;
        isPointCracked = true;
      }

      // If cracked, the stress drops down to residual fiber level or near zero immediately!
      let displayStress = pt.stress;
      if (isPointCracked) {
        if (crackedHour === pt.t) {
          // peak match
        } else {
          // drops to residual capacity
          const residual = (fiberContent / 30) * 0.55; // MPa residual strength
          displayStress = Math.max(0, Math.min(pt.fct * 0.15, residual));
        }
      }

      return {
        ...pt,
        displayStress,
        isPointCracked,
      };
    });

    return {
      points: processedPoints,
      crackedHour,
      maxTemp,
    };
  }, [selectedCement, freshTemp, ambientTemp, fiberContent, stiffnessFrame]);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Activity className="text-shiraz" /><MdText text={inhalt.texte.hydratationZwangLabormessverfahren} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
          <p><MdText text={inhalt.texte.dieBaupraktischeBeherrschungVon} /></p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2">
        <button aria-pressed={panelTab === 'reissrahmen'}
          onClick={() => setPanelTab('reissrahmen')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            panelTab === 'reissrahmen'
              ? 'bg-shiraz text-white border-shiraz shadow-md'
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
        >
          <Activity size={16} /><MdText text={inhalt.texte.t1ReißrahmenCrackingFrame} /></button>
        <button aria-pressed={panelTab === 'schwindrinne'}
          onClick={() => setPanelTab('schwindrinne')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            panelTab === 'schwindrinne'
              ? 'bg-shiraz text-white border-shiraz shadow-md'
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
        >
          <Layers size={16} /><MdText text={inhalt.texte.t2Schwindmessrinne} /></button>
        <button aria-pressed={panelTab === 'kalorimetrie'}
          onClick={() => setPanelTab('kalorimetrie')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            panelTab === 'kalorimetrie'
              ? 'bg-shiraz text-white border-shiraz shadow-md'
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
        >
          <Flame size={16} /><MdText text={inhalt.texte.t3KalorimetrischeWärmemessung} /></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Tab 1: Reißrahmen */}
        {panelTab === 'reissrahmen' && (
          <>
            {/* Interactive Inputs column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider border-b border-home-grau/20 pb-2 flex items-center gap-1.5">
                  <Thermometer size={16} className="text-shiraz" /><MdText text={inhalt.texte.reißrahmenParameterSteuerung} /></h3>

                {/* Zementauswahl */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-home-grau uppercase tracking-wider">Zementcharakteristik</label>
                  <select aria-label="Zementcharakteristik"
                    value={selectedCement}
                    onChange={(e) => setSelectedCement(e.target.value)}
                    className="p-2 text-sm border border-home-grau/30 rounded-lg bg-white text-text-main focus:outline-none focus:border-shiraz"
                  >
                    {Object.keys(CEMENT_MAP).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500 italic"><MdText text={inhalt.texte.beeinflusstDieHydratationsgeschwindigkei} /></p>
                </div>

                {/* Frischbetontemperatur */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold text-home-grau uppercase tracking-wider">
                    <span><MdText text={inhalt.texte.frischbetonTempTFrisch} /></span>
                    <span className="text-shiraz font-mono">{formatDeWert(freshTemp)} °C</span>
                  </div>
                  <input
                    type="range" min={5} max={35} step={1}
                    value={freshTemp}
                    onChange={(e) => setFreshTemp(Number(e.target.value))}
                    className="accent-shiraz cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.eineAbsenkungDerBetontemperatur} /></span>
                </div>

                {/* Umgebungstemperatur */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold text-home-grau uppercase tracking-wider">
                    <span><MdText text={inhalt.texte.umgebungstempTUmg} /></span>
                    <span className="text-shiraz font-mono">{formatDeWert(ambientTemp)} °C</span>
                  </div>
                  <input
                    type="range" min={5} max={30} step={1}
                    value={ambientTemp}
                    onChange={(e) => setAmbientTemp(Number(e.target.value))}
                    className="accent-shiraz cursor-pointer"
                  />
                </div>

                {/* Faserbewehrung */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold text-home-grau uppercase tracking-wider">
                    <span><MdText text={inhalt.texte.fasergehaltPpStahl} /></span>
                    <span className="text-shiraz font-mono">{formatDeWert(fiberContent)} kg/m³</span>
                  </div>
                  <input
                    type="range" min={0} max={60} step={5}
                    value={fiberContent}
                    onChange={(e) => setFiberContent(Number(e.target.value))}
                    className="accent-shiraz cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.fasernErhöhenDieZugfestigkeit} /></span>
                </div>

                {/* Rahmen-Steifigkeit */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold text-home-grau uppercase tracking-wider">
                    <span><MdText text={inhalt.texte.rahmenfesselungsgradRestraintStiffness} /></span>
                    <span className="text-shiraz font-mono">{formatDeWert(stiffnessFrame)} %</span>
                  </div>
                  <input
                    type="range" min={30} max={100} step={5}
                    value={stiffnessFrame}
                    onChange={(e) => setStiffnessFrame(Number(e.target.value))}
                    className="accent-shiraz cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-500">
                    {stiffnessFrame === 100 
                      ? inhalt.werte.starrerStahlrahmen100Einspannung 
                      : `Teilnachgiebiger Rahmen (${formatDeWert(stiffnessFrame)}% Festhaltungsgrad)`}
                  </div>
                </div>

              </div>

              {/* Explanatory Technical Card */}
              <div className="bg-[#FCF8F2] p-5 rounded-2xl border border-home-grau/25 text-xs text-text-main flex flex-col gap-3">
                <div>
                  <h4 className="font-bold text-shiraz flex items-center gap-1.5 mb-2">
                    <HelpCircle size={15} /><MdText text={inhalt.texte.wieFunktioniertDerReißrahmen} /></h4>
                  <p className="leading-relaxed text-text-main/80"><MdText text={inhalt.texte.imGegensatzZurFreien} /></p>
                  <ol className="list-decimal pl-4 mt-2 space-y-1 text-text-main/80 text-[11px]">
                    <li><MdText text={inhalt.texte.abbindeflattern05H} /></li>
                    <li><MdText text={inhalt.texte.kernaufheizung518H} /></li>
                    <li><MdText text={inhalt.texte.abkühlphaseKontraktion1872} /></li>
                    <li><MdText text={inhalt.texte.schnittpunktRissSchneidetDie} /></li>
                  </ol>
                </div>

                <div className="border-t border-home-grau/20 pt-3">
                  <h4 className="font-bold text-shiraz flex items-center gap-1.5 mb-1.5">
                    <CheckCircle size={14} /><MdText text={inhalt.texte.normungPrüfvorschriftenReißrahmen} /></h4>
                  <ul className="list-disc pl-4 space-y-1.5 text-text-main/80 text-[11px]">
                    <li><MdText text={inhalt.texte.rilemTc119Tce} /></li>
                    <li><MdText text={inhalt.texte.dafstbRichtlinieMassigeBauteile} /></li>
                    <li><MdText text={inhalt.texte.sollSteifigkeitDerPrüfrahmen} /></li>
                    <li><MdText text={inhalt.texte.temperatursimulationPrüfungenWerdenEntwe} /></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Visualizer & Outputs column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Dynamic Status Display */}
              <div className={`p-5 rounded-2xl border transition-all ${
                reissrahmenSimData.crackedHour !== -1 
                  ? 'bg-red-50 border-red-200 text-red-950' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-90"><MdText text={inhalt.texte.messergebnisImReißrahmen} /></span>
                  {reissrahmenSimData.crackedHour !== -1 ? (
                    <span className="bg-red-200 text-red-800 text-xs font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                      <AlertOctagon size={13} /><MdText text={inhalt.texte.rissEingetreten} /></span>
                  ) : (
                    <span className="bg-emerald-200 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                      <CheckCircle size={13} /><MdText text={inhalt.texte.probeRissfrei} /></span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <span className="text-xs opacity-75 block">Maximaltemperatur</span>
                    <span className="text-xl font-bold font-mono">{formatDeZahl(reissrahmenSimData.maxTemp, 1)} °C</span>
                  </div>
                  <div>
                    <span className="text-xs opacity-75 block"><MdText text={inhalt.texte.statusRissereignis} /></span>
                    <span className="text-xl font-bold font-mono">
                      {reissrahmenSimData.crackedHour !== -1 
                        ? `Nach t = ${formatDeWert(reissrahmenSimData.crackedHour)} Std.` 
                        : inhalt.werte.keinRiss72h}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs mt-3 opacity-90 leading-relaxed border-t border-black/10 pt-3">
                  {reissrahmenSimData.crackedHour !== -1 
                    ? inhalt.werte.derBetonRissFrühzeitig
                    : inhalt.werte.hervorragendDieInduziertenZugspannungen
                  }
                </p>
              </div>

              {/* SVG Curve Plotter */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main flex items-center gap-1.5">
                    <BarChart2 size={16} className="text-shiraz" /><MdText text={inhalt.texte.spannungsUndFestigkeitsverlaufZ} /></h4>
                  <div className="flex gap-3 text-[10px] font-semibold">
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-shiraz inline-block"></span><MdText text={inhalt.texte.zugfestigkeitFCt} /></span>
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-600 inline-block"></span><MdText text={inhalt.texte.zwangspannungZ} /></span>
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-500 inline-block"></span><MdText text={inhalt.texte.temperaturTC} /></span>
                  </div>
                </div>

                {/* SVG Graph */}
                <div className="w-full h-72 border border-slate-100 rounded-xl relative overflow-hidden bg-slate-50/20">
                  <svg viewBox="0 0 500 250" className="w-full h-full">
                    {/* Gridlines */}
                    <line x1="40" y1="20" x2="40" y2="220" stroke="#cccccc" strokeWidth="1" strokeDasharray="2" />
                    <line x1="40" y1="220" x2="480" y2="220" stroke="#888888" strokeWidth="1" />
                    <line x1="40" y1="140" x2="480" y2="140" stroke="#e2e8f0" strokeWidth="1" /> {/* zero stress line */}
                    
                    {/* Hour ticks on x-axis */}
                    {[0, 12, 24, 36, 48, 60, 72].map((hr) => {
                      const posX = 40 + (hr / 72) * 420;
                      return (
                        <g key={hr}>
                          <line x1={posX} y1="220" x2={posX} y2="223" stroke="#888888" strokeWidth="1" />
                          <text x={posX} y="235" fontSize="8" textAnchor="middle" fill="#64748b" className="font-mono">{formatDeWert(hr)}h</text>
                        </g>
                      );
                    })}

                    {/* Stress ticks on y-axis (range: -3 MPa to +5 MPa -> mapping to y=200 to y=30) */}
                    {[-2, 0, 2, 4].map((stress) => {
                      // Stress maps: y = 140 - stress * 30
                      const posY = 140 - stress * 25;
                      return (
                        <g key={stress}>
                          <line x1="37" y1={posY} x2="40" y2={posY} stroke="#888888" strokeWidth="1" />
                          <text x="32" y={posY + 3} fontSize="8" textAnchor="end" fill="#64748b" className="font-mono">{formatDeWert(stress)} MPa</text>
                        </g>
                      );
                    })}

                    {/* Auxiliary axis right (Temperature: 10°C to 70°C -> mapping to y=220 to y=20) */}
                    {[20, 40, 60].map((temp) => {
                      const posY = 220 - ((temp - 10) / 60) * 200;
                      return (
                        <g key={temp}>
                          <line x1="480" y1={posY} x2="483" y2={posY} stroke="#888888" strokeWidth="1" />
                          <text x="487" y={posY + 3} fontSize="8" textAnchor="start" fill="#d97706" className="font-mono">{formatDeWert(temp)}°C</text>
                        </g>
                      );
                    })}

                    {/* Plot Line: Temperature */}
                    <path
                      d={reissrahmenSimData.points
                        .map((pt, index) => {
                          const px = 40 + (pt.t / 72) * 420;
                          const py = 220 - ((pt.temp - 10) / 60) * 200;
                          return `${index === 0 ? 'M' : 'L'} ${px} ${py}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />

                    {/* Plot Line: Tensile Strength fct */}
                    <path
                      d={reissrahmenSimData.points
                        .map((pt, index) => {
                          const px = 40 + (pt.t / 72) * 420;
                          // Maps fct (0 to 5) to Y (140 to 15) -> y = 140 - fct * 25
                          const py = 140 - pt.fct * 25;
                          return `${index === 0 ? 'M' : 'L'} ${px} ${py}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#be123c"
                      strokeWidth="2"
                    />

                    {/* Plot Line: Restraint Stress sigma_z */}
                    <path
                      d={reissrahmenSimData.points
                        .map((pt, index) => {
                          const px = 40 + (pt.t / 72) * 420;
                          const py = 140 - pt.displayStress * 25;
                          return `${index === 0 ? 'M' : 'L'} ${px} ${py}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2"
                    />

                    {/* Intersection Rissbezeichnung */}
                    {reissrahmenSimData.crackedHour !== -1 && (
                      <g>
                        {(() => {
                          const cx = 40 + (reissrahmenSimData.crackedHour / 72) * 420;
                          const selectedPt = reissrahmenSimData.points.find((p) => p.t === reissrahmenSimData.crackedHour);
                          const cy = 140 - (selectedPt?.fct ?? 1.5) * 25;
                          return (
                            <>
                              <circle cx={cx} cy={cy} r="5" fill="#ef4444" className="animate-ping" />
                              <circle cx={cx} cy={cy} r="4" fill="#ef4444" />
                              {/* Crack flash icon or line */}
                              <path d={`M ${cx} ${cy - 20} L ${cx} ${cy + 30}`} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2" />
                              <text x={cx + 7} y={cy - 10} fontSize="9" fill="#991b1b" fontWeight="bold">Risszeitpunkt ({formatDeWert(reissrahmenSimData.crackedHour)} h)</text>
                            </>
                          );
                        })()}
                      </g>
                    )}
                  </svg>
                </div>
                
                {/* Formulas & Specs inside SVG */}
                <div className="mt-4 text-[10px] text-slate-500 leading-normal font-serif text-center"><MdText text={inhalt.texte.spannungsberechnungImReißrahmen} /><span className="italic font-sans text-xs bg-slate-50 px-2 py-1 rounded border inline-block"><MdText text={inhalt.texte.tECmD} /></span>
                </div>
              </div>

            </div>
          </>
        )}

        {/* Tab 2: Schwindrinne */}
        {panelTab === 'schwindrinne' && (
          <div className="lg:col-span-12 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-base font-bold text-text-main uppercase tracking-wider border-b border-home-grau/20 pb-3 mb-4 flex items-center gap-2">
                <Layers className="text-shiraz" /><MdText text={inhalt.texte.dieSchwindmessrinneGrundlagenAuswertung} /></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4 text-sm text-text-main/90">
                  <p><MdText text={inhalt.texte.betongemischeFangenDirektNach} /></p>
                  <ul className="list-disc pl-5 space-y-2 text-xs">
                    <li><MdText text={inhalt.texte.plastischesSchwinden06} /></li>
                    <li><MdText text={inhalt.texte.autogenesSchwindenAb5} /></li>
                    <li><MdText text={inhalt.texte.trocknungsschwindenLangfristigDiffusions} /></li>
                  </ul>
                  
                  <div className="bg-[#FCF8F2] p-4 rounded-xl border border-scratch/30 text-xs">
                    <span className="font-bold block text-shiraz mb-1"><MdText text={inhalt.texte.prüfungsaufbauSchwindrinne} /></span><MdText text={inhalt.texte.eineGussformOftU} /></div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2"><MdText text={inhalt.texte.schematischePrinzipskizze} /></h4>
                    <div className="w-full h-44 bg-slate-900 rounded-xl relative flex flex-col justify-center items-center text-white p-4 font-mono text-[10px]">
                      {/* Drawing the shrinkage rig */}
                      <div className="w-4/5 h-8 bg-slate-700 rounded border-2 border-slate-500 flex justify-between items-center px-4 relative">
                        <span className="text-white text-[9px] z-10"><MdText text={inhalt.texte.ptfeGussrinne1000Mm} /></span>
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-500" title="Festpunkt"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-emerald-500 flex items-center" title="Messanker">
                          <span className="absolute left-4 bg-orange-400 p-1 rounded text-black text-[8px] border">LVDT Sensor</span>
                        </div>
                      </div>
                      <div className="w-full flex justify-between px-10 mt-6 text-slate-400">
                        <span><MdText text={inhalt.texte.festlagerLinks} /></span>
                        <span><MdText text={inhalt.texte.konstanteTemperatursteuerung} /></span>
                        <span>[Gleitbett-Rinne]</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-900 space-y-2 flex flex-col">
                    <div>
                      <span className="font-bold text-blue-950 block">Prüfgrundlagen:</span>
                      <p className="leading-relaxed"><MdText text={inhalt.texte.prüfgrundlagenSindZB} /></p>
                    </div>
                    <div className="border-t border-blue-100 pt-2 text-blue-950/90">
                      <span className="font-bold block text-[11px] mb-1"><MdText text={inhalt.texte.prüfvorschriftenPrüfbedingungen} /></span>
                      <ul className="list-disc pl-4 space-y-1 text-[10.5px]">
                        <li><MdText text={inhalt.texte.reibungsfreieLagerungNachbehandlungMit} /></li>
                        <li><MdText text={inhalt.texte.klimaüberwachungTemperaturVon20} /></li>
                        <li><MdText text={inhalt.texte.astmC1581C1581mVerwandtes} /></li>
                        <li><MdText text={inhalt.texte.dinEn126174} /></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Kalorometrie */}
        {panelTab === 'kalorimetrie' && (
          <div className="lg:col-span-12 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-base font-bold text-text-main uppercase tracking-wider border-b border-home-grau/20 pb-3 mb-4 flex items-center gap-2">
                <Flame className="text-shiraz" /><MdText text={inhalt.texte.kalorimetrischeWärmemessungHydratationsw} /></h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-4 text-sm text-text-main/90">
                  <p><MdText text={inhalt.texte.dieHydratationVonZementklinkern} /></p>

                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-xs text-shiraz uppercase tracking-wider block"><MdText text={inhalt.texte.t1TeilAdiabatischesVerfahren} /></span>
                      <p className="text-xs text-slate-600 mt-1 leading-normal"><MdText text={inhalt.texte.hierzuWirdDerFrisch} /></p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-xs text-shiraz uppercase tracking-wider block"><MdText text={inhalt.texte.t2IsothermesKonduktionskalorimeterDin} /></span>
                      <p className="text-xs text-slate-600 mt-1 leading-normal"><MdText text={inhalt.texte.messungDesKontinuierlichenWärmestroms} /></p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-xs text-shiraz uppercase tracking-wider block"><MdText text={inhalt.texte.t3LösungswärmeverfahrenDinEn} /></span>
                      <p className="text-xs text-slate-600 mt-1 leading-normal"><MdText text={inhalt.texte.einNasschemischerVergleichstestDie} /></p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#FCF8F2] p-5 rounded-2xl border border-home-grau/25 space-y-3">
                    <span className="font-bold text-shiraz block text-xs uppercase tracking-wider"><MdText text={inhalt.texte.warumMessenWirDas} /></span>
                    <p className="text-xs leading-normal"><MdText text={inhalt.texte.überDieKalorimetrischenDaten} /></p>
                    <div className="bg-white p-3 rounded-lg border text-xs font-mono space-y-1 text-slate-800">
                      <div className="flex justify-between">
                        <span><MdText text={inhalt.texte.zementwärmeSpitze} /></span>
                        <span className="font-bold text-shiraz"><MdText text={inhalt.texte.cemI350400} /></span>
                      </div>
                      <div className="flex justify-between">
                        <span><MdText text={inhalt.texte.lhZementwärmeSpitze} /></span>
                        <span className="font-bold text-emerald-700"><MdText text={inhalt.texte.cemIiiLh270} /></span>
                      </div>
                      <div className="text-[10px] text-slate-500 italic mt-1 pt-1 border-t border-slate-100"><MdText text={inhalt.texte.lhLowHeatZement} /></div>
                    </div>
                    <p className="text-xs"><MdText text={inhalt.texte.durchDenGezieltenEinsatz} /></p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>


    </div>
  );
}
