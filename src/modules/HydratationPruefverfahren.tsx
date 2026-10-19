import React, { useState, useMemo } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Activity, Thermometer, Layers, AlertOctagon, HelpCircle, CheckCircle, Flame, RefreshCw, BarChart2 } from 'lucide-react';

interface CementProfile {
  name: string;
  baseHeat: number; // J/g
  hydrationSpeed: number; // 1 = average, 0.5 = CEM III, 1.5 = CEM I R
  strengthSpeed: number;
}

const CEMENT_MAP: Record<string, CementProfile> = {
  'CEM I 52.5 R (Schnell)': { name: 'CEM I 52.5 R (Sehr schnell erhärtend, hohe Hydratationswärme)', baseHeat: 380, hydrationSpeed: 1.4, strengthSpeed: 1.3 },
  'CEM I 42.5 N (Standard)': { name: 'CEM I 42.5 N (Standardzement, mittlere Wärmeentwicklung)', baseHeat: 320, hydrationSpeed: 1.0, strengthSpeed: 1.0 },
  'CEM II/B-M 32.5 R': { name: 'CEM II/B-M 32.5 R (Klinkerreduziert, mäßige Wärme)', baseHeat: 265, hydrationSpeed: 0.85, strengthSpeed: 0.8 },
  'CEM III/B 32.5 N-LH (Slow)': { name: 'CEM III/B 32.5 N-LH (Hochofenzement, extrem niedrige Wärme)', baseHeat: 210, hydrationSpeed: 0.5, strengthSpeed: 0.55 },
};

export default function HydratationPruefverfahren() {
  const [panelTab, setPanelTab] = useState<'reissrahmen' | 'schwindrinne' | 'kalorimetrie'>('reissrahmen');

  // Interactive state for Reißrahmen-Sim
  const [selectedCement, setSelectedCement] = useState<string>('CEM I 42.5 N (Standard)');
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
          <Activity className="text-shiraz" /> Hydratation &amp; Zwang: Labormessverfahren
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
          <p>
            Die baupraktische Beherrschung von Zwang- und Eigenspannungen ruht auf der präzisen labortechnischen Kennwertermittlung.
            Dazu gehören das Erfassen der adiabaten Hydratationswärme, das freie Schwindverhalten in jungen Altersstufen und vor allem die direkte Zwangsprüfung in hoch- und teilstarr gefesselten Reißrahmen.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setPanelTab('reissrahmen')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            panelTab === 'reissrahmen'
              ? 'bg-shiraz text-white border-shiraz shadow-md'
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
        >
          <Activity size={16} /> 1. Reißrahmen / Cracking Frame
        </button>
        <button
          onClick={() => setPanelTab('schwindrinne')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            panelTab === 'schwindrinne'
              ? 'bg-shiraz text-white border-shiraz shadow-md'
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
        >
          <Layers size={16} /> 2. Schwindmessrinne
        </button>
        <button
          onClick={() => setPanelTab('kalorimetrie')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            panelTab === 'kalorimetrie'
              ? 'bg-shiraz text-white border-shiraz shadow-md'
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
        >
          <Flame size={16} /> 3. Kalorimetrische Wärmemessung
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Tab 1: Reißrahmen */}
        {panelTab === 'reissrahmen' && (
          <>
            {/* Interactive Inputs column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider border-b border-home-grau/20 pb-2 flex items-center gap-1.5">
                  <Thermometer size={16} className="text-shiraz" /> Reißrahmen Parameter-Steuerung
                </h3>

                {/* Zementauswahl */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-home-grau uppercase tracking-wider">Zementcharakteristik</label>
                  <select
                    value={selectedCement}
                    onChange={(e) => setSelectedCement(e.target.value)}
                    className="p-2 text-sm border border-home-grau/30 rounded-lg bg-white text-text-main focus:outline-none focus:border-shiraz"
                  >
                    {Object.keys(CEMENT_MAP).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500 italic">
                    Beeinflusst die Hydratationsgeschwindigkeit und die Spitzenwärmeentwicklung (J/g).
                  </p>
                </div>

                {/* Frischbetontemperatur */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold text-home-grau uppercase tracking-wider">
                    <span>Frischbeton-Temp. (T_frisch)</span>
                    <span className="text-shiraz font-mono">{freshTemp} °C</span>
                  </div>
                  <input
                    type="range" min={5} max={35} step={1}
                    value={freshTemp}
                    onChange={(e) => setFreshTemp(Number(e.target.value))}
                    className="accent-shiraz cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500">
                    Eine Absenkung der Betontemperatur verringert die thermodehnungsbasierten Zwangkräfte im Reißrahmen drastisch.
                  </span>
                </div>

                {/* Umgebungstemperatur */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold text-home-grau uppercase tracking-wider">
                    <span>Umgebungstemp. (T_umg)</span>
                    <span className="text-shiraz font-mono">{ambientTemp} °C</span>
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
                    <span>Fasergehalt (PP / Stahl)</span>
                    <span className="text-shiraz font-mono">{fiberContent} kg/m³</span>
                  </div>
                  <input
                    type="range" min={0} max={60} step={5}
                    value={fiberContent}
                    onChange={(e) => setFiberContent(Number(e.target.value))}
                    className="accent-shiraz cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500">
                    Fasern erhöhen die Zugfestigkeit des Gefüges frühzeitig und bieten nach der Erstbruchstufe ein signifikantes Arbeitsvermögen.
                  </span>
                </div>

                {/* Rahmen-Steifigkeit */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold text-home-grau uppercase tracking-wider">
                    <span>Rahmenfesselungsgrad (restraint stiffness)</span>
                    <span className="text-shiraz font-mono">{stiffnessFrame} %</span>
                  </div>
                  <input
                    type="range" min={30} max={100} step={5}
                    value={stiffnessFrame}
                    onChange={(e) => setStiffnessFrame(Number(e.target.value))}
                    className="accent-shiraz cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-500">
                    {stiffnessFrame === 100 
                      ? 'Starrer Stahlrahmen (100% Einspannung; maximaler Zwang)' 
                      : `Teilnachgiebiger Rahmen (${stiffnessFrame}% Festhaltungsgrad)`}
                  </div>
                </div>

              </div>

              {/* Explanatory Technical Card */}
              <div className="bg-[#FCF8F2] p-5 rounded-2xl border border-home-grau/25 text-xs text-text-main flex flex-col gap-3">
                <div>
                  <h4 className="font-bold text-shiraz flex items-center gap-1.5 mb-2">
                    <HelpCircle size={15} /> Wie funktioniert der Reißrahmen?
                  </h4>
                  <p className="leading-relaxed text-text-main/80">
                    Im Gegensatz zur freien Dehnungsmessung wird der Betonprisma-Körper hier sofort nach Gießen an beiden Enden fest eingespannt. 
                  </p>
                  <ol className="list-decimal pl-4 mt-2 space-y-1 text-text-main/80 text-[11px]">
                    <li><strong>Abbindeflattern (0-5 h):</strong> Zementleim geliert, thermische Expansion wandelt sich in ersten Druck im Rahmen um (negative Spannungen).</li>
                    <li><strong>Kernaufheizung (5-18 h):</strong> Bei Maximaltemperatur ist das elastische Material im Kriechexpress; es baut Druckspannungen ab.</li>
                    <li><strong>Abkühlphase &amp; Kontraktion (18-72 h):</strong> Der Beton kühlt ab und erleidet irreversibles autogenes Schwinden. Aufgrund der starren Fesselung steigen die <strong>Zugspannungen (<InlineMath math="\sigma_z(t)" />)</strong> stark an.</li>
                    <li><strong>Schnittpunkt (Riss):</strong> Schneidet die Zugspannung die anwachsende Zugfestigkeitslinie <InlineMath math="f_{ct}(t)" />, kommt es zum lautstarken Trennriss!</li>
                  </ol>
                </div>

                <div className="border-t border-home-grau/20 pt-3">
                  <h4 className="font-bold text-shiraz flex items-center gap-1.5 mb-1.5">
                    <CheckCircle size={14} /> Normung &amp; Prüfvorschriften (Reißrahmen)
                  </h4>
                  <ul className="list-disc pl-4 space-y-1.5 text-text-main/80 text-[11px]">
                    <li><strong>RILEM TC 119-TCE / TC 195-ATG:</strong> Internationale Empfehlungen für standardisierte Zwangsprüfrahmen (Cracking Frames) zur Bestimmung thermo-mechanischer Werkstoffkennwerte.</li>
                    <li><strong>DAfStb-Richtlinie „Massige Bauteile“:</strong> Regelt die messtechnische Einordnung für Bauteile mit einer kleinsten Abmessung <InlineMath math="d \ge 0.80\,\text{m}" /> zur Rissvermeidung.</li>
                    <li><strong>Soll-Steifigkeit:</strong> Der Prüfrahmen muss eine Dehnsteifigkeit von mindestens <InlineMath math="500\,\text{kN/mm}" /> aufweisen, um starre Randbedingungen abzubilden.</li>
                    <li><strong>Temperatursimulation:</strong> Prüfungen werden entweder temperaturgeregelt (z.B. Nachfahren eines adiabatischen Hydratationsverlaufs im Kern) oder isotherm bei <InlineMath math="20\,^{\circ}\text{C}" /> durchgeführt.</li>
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
                  <span className="text-xs font-bold uppercase tracking-wider opacity-90">Messergebnis im Reißrahmen</span>
                  {reissrahmenSimData.crackedHour !== -1 ? (
                    <span className="bg-red-200 text-red-800 text-xs font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                      <AlertOctagon size={13} /> Riss eingetreten
                    </span>
                  ) : (
                    <span className="bg-emerald-200 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                      <CheckCircle size={13} /> Probe rissfrei
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <span className="text-xs opacity-75 block">Maximaltemperatur</span>
                    <span className="text-xl font-bold font-mono">{reissrahmenSimData.maxTemp.toFixed(1)} °C</span>
                  </div>
                  <div>
                    <span className="text-xs opacity-75 block">Status Rissereignis</span>
                    <span className="text-xl font-bold font-mono">
                      {reissrahmenSimData.crackedHour !== -1 
                        ? `Nach t = ${reissrahmenSimData.crackedHour} Std.` 
                        : 'Kein Riss (72h)'}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs mt-3 opacity-90 leading-relaxed border-t border-black/10 pt-3">
                  {reissrahmenSimData.crackedHour !== -1 
                    ? `Der Beton riss frühzeitig infolge hoher Hydratationstemperatur und unzureichender Kriechrelaxation. Tipp: Reduziere die Frischbetontemperatur oder wähle einen langsameren LH-Zement (z.B. CEM III/B).`
                    : `Hervorragend! Die induzierten Zugspannungen blieben im gesamten Zeitlauf sicher unterhalb der Zugfestigkeitslinie. Die Kombination aus geringerer Wärme und hohem viskoelastischen Kriechen verhinderte Rissbildung.`
                  }
                </p>
              </div>

              {/* SVG Curve Plotter */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main flex items-center gap-1.5">
                    <BarChart2 size={16} className="text-shiraz" /> Spannungs- und Festigkeitsverlauf σ_z(t) / f_ct(t)
                  </h4>
                  <div className="flex gap-3 text-[10px] font-semibold">
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-shiraz inline-block"></span> Zugfestigkeit f_ct</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-600 inline-block"></span> Zwangspannung σ_z</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-500 inline-block"></span> Temperatur T(°C)</span>
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
                          <text x={posX} y="235" fontSize="8" textAnchor="middle" fill="#64748b" className="font-mono">{hr}h</text>
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
                          <text x="32" y={posY + 3} fontSize="8" textAnchor="end" fill="#64748b" className="font-mono">{stress} MPa</text>
                        </g>
                      );
                    })}

                    {/* Auxiliary axis right (Temperature: 10°C to 70°C -> mapping to y=220 to y=20) */}
                    {[20, 40, 60].map((temp) => {
                      const posY = 220 - ((temp - 10) / 60) * 200;
                      return (
                        <g key={temp}>
                          <line x1="480" y1={posY} x2="483" y2={posY} stroke="#888888" strokeWidth="1" />
                          <text x="487" y={posY + 3} fontSize="8" textAnchor="start" fill="#d97706" className="font-mono">{temp}°C</text>
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
                              <text x={cx + 7} y={cy - 10} fontSize="9" fill="#991b1b" fontWeight="bold">Risszeitpunkt ({reissrahmenSimData.crackedHour} h)</text>
                            </>
                          );
                        })()}
                      </g>
                    )}
                  </svg>
                </div>
                
                {/* Formulas & Specs inside SVG */}
                <div className="mt-4 text-[10px] text-slate-500 leading-normal font-serif text-center">
                  Spannungsberechnung im Reißrahmen: <span className="italic font-sans text-xs bg-slate-50 px-2 py-1 rounded border inline-block">σ(t) = ∫ [E_cm(τ) · d(-α_T · dT(τ) + dε_cs(τ))] · k_relax</span>
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
                <Layers className="text-shiraz" /> Die Schwindmessrinne: Grundlagen &amp; Auswertung
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4 text-sm text-text-main/90">
                  <p>
                    Betongemische fangen direkt nach dem Mischen und Einbringen an, an Volumen zu verlieren. Dieser Prozess teilt sich in:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs">
                    <li><strong>Plastisches Schwinden (0 - 6 h):</strong> Kapillarer Wasserentzug durch Oberflächenverdunstung in flüssiger Phase vor Erstarrungsbeginn.</li>
                    <li><strong>Autogenes Schwinden (ab 5 h / Hydratationsbeginn):</strong> Chemische Volumenminderung (Kontraktion) infolge der Zementreaktion. Da das Hydratationsprodukt dichter gepackt ist als die Ausgangsstoffe (Zement + Wasser), entsteht eine starke Kapillarentfeuchtung im Gefüge.</li>
                    <li><strong>Trocknungsschwinden (Langfristig):</strong> Diffusionsbedingtes Entweichen physikalischen Überschusswassers an die Umwelt.</li>
                  </ul>
                  
                  <div className="bg-[#FCF8F2] p-4 rounded-xl border border-scratch/30 text-xs">
                    <span className="font-bold block text-shiraz mb-1">Prüfungsaufbau Schwindrinne:</span>
                    Eine Gussform (oft u-förmiges Profil mit PTFE-Antihaftfolie, Länge meist 1.0 m) wird mit Frischbeton befüllt. 
                    Am festen Anschlag lagert eine Ankerplatte, während am entgegengesetzten freien Ende eine Ankerplatte mit einem hochempfindlichen **Wegaufnehmer (LVDT-Taster)** verbunden ist.
                    Die Längenänderung wird kontinuierlich mit einer Auflösung von <InlineMath math="< 1\,\mu\text{m}" /> aufgezeichnet.
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">Schematische Prinzipskizze</h4>
                    <div className="w-full h-44 bg-slate-900 rounded-xl relative flex flex-col justify-center items-center text-white p-4 font-mono text-[10px]">
                      {/* Drawing the shrinkage rig */}
                      <div className="w-4/5 h-8 bg-slate-700 rounded border-2 border-slate-500 flex justify-between items-center px-4 relative">
                        <span className="text-white text-[9px] z-10">PTFE-Gussrinne (1000 mm)</span>
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-500" title="Festpunkt"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-emerald-500 flex items-center" title="Messanker">
                          <span className="absolute left-4 bg-orange-400 p-1 rounded text-black text-[8px] border">LVDT Sensor</span>
                        </div>
                      </div>
                      <div className="w-full flex justify-between px-10 mt-6 text-slate-400">
                        <span>[Festlager links]</span>
                        <span>[Konstante Temperatursteuerung]</span>
                        <span>[Gleitbett-Rinne]</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-900 space-y-2 flex flex-col">
                    <div>
                      <span className="font-bold text-blue-950 block">Normativer Bezug (WTA &amp; DBV):</span>
                      <p className="leading-relaxed">
                        In Deutschland regelt das <strong>WTA-Merkblatt 8-10</strong> sowie der zugehörige DBV-Sachstandsbericht den Versuchsablauf. Die Schwindmessrinne liefert den präzisen Dehnungsverlauf <InlineMath math="\varepsilon_{cs}(t)" /> für thermo-mechanische Finite-Elemente-Analysen (FE-Simulationen).
                      </p>
                    </div>
                    <div className="border-t border-blue-100 pt-2 text-blue-950/90">
                      <span className="font-bold block text-[11px] mb-1">Prüfvorschriften &amp; Prüfbedingungen:</span>
                      <ul className="list-disc pl-4 space-y-1 text-[10.5px]">
                        <li><strong>Reibungsfreie Lagerung:</strong> Nachbehandlung mit doppelter PTFE-Gleitfolie zur freien Verformbarkeit ohne Eigenreibungswiderstände.</li>
                        <li><strong>Klimaüberwachung:</strong> Temperatur von <InlineMath math="20 \pm 1\,^{\circ}\text{C}" /> und relative Feuchte von <InlineMath math="65 \pm 5\%" /> müssen im Klimaraum strikt konstant gehalten werden.</li>
                        <li><strong>ASTM C1581 / C1581M:</strong> Verwandtes amerikanisches Verfahren zur Bestimmung der Rissneigung unter behinderter Schwinddehnung an Ringprüfkörpern.</li>
                        <li><strong>DIN EN 12617-4:</strong> Bestimmung des Schwindens und Quellens von Instandsetzungsmörteln.</li>
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
                <Flame className="text-shiraz" /> Kalorimetrische Wärmemessung (Hydratationswärmekurven)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-4 text-sm text-text-main/90">
                  <p>
                    Die Hydratation von Zementklinkern ist eine stark <strong>exotherme chemische Reaktion</strong>. 
                    Um den zeitlichen Verlauf der Wärmefreisetzung (<InlineMath math="q = \text{Wärmefluss in J/g}\cdot\text{h}" />) und die kumulierte Gesamthydratationswärme (<InlineMath math="Q = \text{Gesamtwärme in J/g}" />) präzise zu bestimmen, definiert die Normung drei fundamentale Laborprüfverfahren:
                  </p>

                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-xs text-shiraz uppercase tracking-wider block">1. Teil-adiabatisches Verfahren (DIN EN 196-9 / Langavant)</span>
                      <p className="text-xs text-slate-600 mt-1 leading-normal">
                        Hierzu wird der frisch angemischte Mörtel/Beton in ein hochisoliertes Dewar-Gefäß eingesetzt. Über die gemessene Temperaturdifferenz zur Referenzflasche wird die freigesetzte Wärmemenge <InlineMath math="Q(t)" /> ermittelt. Dieses Verfahren ist baustellentauglich und ideal für die ersten 48 Stunden geeignet.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-xs text-shiraz uppercase tracking-wider block">2. Isothermes Konduktionskalorimeter (DIN EN 196-11 / ICC)</span>
                      <p className="text-xs text-slate-600 mt-1 leading-normal">
                        Messung des kontinuierlichen Wärmestroms bei einer konstant geregelten Temperatur (meist <InlineMath math="20\,^{\circ}\text{C}" />). Hochsensible thermoelektrische Sensoren leiten die Hydratationsenergie ab. Das ICC-Verfahren ist die präziseste Methode, um das exotherme Peak-Verhalten im ersten kritischen Erstarrungsfenster zu charakterisieren.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-xs text-shiraz uppercase tracking-wider block">3. Lösungswärmeverfahren (DIN EN 196-8)</span>
                      <p className="text-xs text-slate-600 mt-1 leading-normal">
                        Ein nasschemischer Vergleichstest: Die Lösungswärme von unhydratisiertem Zement wird jener einer teils oder vollhydratisierten Probe (z.B. nach 7 oder 28 Tagen) in Säure gegenübergestellt. Die Differenz liefert die kumulierte Gesamthydratationswärme.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#FCF8F2] p-5 rounded-2xl border border-home-grau/25 space-y-3">
                    <span className="font-bold text-shiraz block text-xs uppercase tracking-wider">Warum messen wir das? (Der Praxisnutzen)</span>
                    <p className="text-xs leading-normal">
                      Über die kalorimetrischen Daten lässt sich die Festigkeitsentwicklung von Beton im realen Bauteil über das **Reifegradmodell nach de Vree (Arrhenius)** abbilden. 
                      Da Bauteile sich ungleichmäßig erwärmen (Kern kühlt mangels Oberfläche kaum ab, Ränder kühlen schnell), entstehen gewaltige thermische Gradienten:
                    </p>
                    <div className="bg-white p-3 rounded-lg border text-xs font-mono space-y-1 text-slate-800">
                      <div className="flex justify-between">
                        <span>Zementwärme (Spitze)</span>
                        <span className="font-bold text-shiraz">CEM I: ~350-400 J/g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>LH-Zementwärme (Spitze)</span>
                        <span className="font-bold text-emerald-700">CEM III LH: &lt;270 J/g</span>
                      </div>
                      <div className="text-[10px] text-slate-500 italic mt-1 pt-1 border-t border-slate-100">
                        *LH = Low Heat (Zement mit niedriger Hydratationswärmeentwicklung)
                      </div>
                    </div>
                    <p className="text-xs">
                      Durch den gezielten Einsatz von Zusatzstoffen wie Flugasche wird die exotherme Klinkerreaktivität "verdünnt", wodurch Bauteilschäden verlässlich gemindert werden.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      <ModuleFooter
        wikipedia={[
          { title: 'Betontechnologie', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Hydratationswärme', url: 'https://de.wikipedia.org/wiki/Hydratations%C3%A4rme' }
        ]}
        literatur={[
          'Beton-Laborpraxis: Frisch- und Festbetonprüfung, Bindemittelprüfungen (11. Auflage, Verlag Bau+Technik)',
          'Zementchemie: Reaktionsmechanismen der Hydratationsphasen, Prof. Dr. Stark, Bauhaus-Universität Weimar'
        ]}
        regelwerke={[
          { title: 'DIN EN 196-9 (Bestimmung der Hydratationswärme - Teil-adiabatisches Verfahren)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+196-9' },
          { title: 'DIN EN 196-11 (Bestimmung der Hydratationswärme - Isothermes Konduktionskalorimeter-Verfahren)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+196-11' },
          { title: 'DIN EN 196-8 (Bestimmung der Hydratationswärme - Lösungswärmeverfahren)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+196-8' },
          { title: 'WTA-Merkblatt 8-10 (Schwinden von Beton - Messverfahren)', url: 'https://www.wta-gmbh.de/' },
          { title: 'RILEM TC 119-TCE / 195-ATG (Testing conditions for Cracking Frames)', url: 'https://www.rilem.net/' },
          { title: 'DAfStb-Richtlinie „Massige Bauteile aus Beton“', url: 'https://www.dafstb.de/' }
        ]}
        formeln={[
          {
            formel: 'q(t) = \\frac{dQ(t)}{dt}',
            erklaerung: 'Spezifischer Wärmefluss (Entwicklungswärmestrom) der Hydratationsdauer.',
            quelle: 'Zementchemie'
          }
        ]}
      />

    </div>
  );
}
