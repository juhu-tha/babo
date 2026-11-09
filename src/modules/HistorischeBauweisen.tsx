import React, { useState, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { 
  Building2, Landmark, Layers, AlertTriangle, PenTool, Hammer
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import inhalt from '@/content/historischebauweisen/HistorischeBauweisen.json';
import { SCHWINDBEIWERTE } from '@/src/calc/holzphysik';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

/** Lehrwert σ_zul = 120 N/mm² für historische Zugbänder (Schweißeisen/Flussstahl), ohne Normbeleg (DSC-HB-1) */
const SIGMA_ZUL_ZUGBAND_LEHRWERT = 120;

type BauweisenReiter = 'massivbau' | 'fachwerk' | 'decken' | 'dachwerke';
const REITER: readonly ModulTab<BauweisenReiter>[] = [
  { id: 'massivbau', label: inhalt.werte.massivbauMauerwerk, icon: Building2 },
  { id: 'fachwerk', label: inhalt.werte.fachwerkHolzskelett, icon: Hammer },
  { id: 'decken', label: inhalt.werte.historischeDecken, icon: Layers },
  { id: 'dachwerke', label: inhalt.werte.historischeDachwerke, icon: Landmark },
];

export default function HistorischeBauweisen() {
  const [activeTab, setActiveTab] = useState<BauweisenReiter>('massivbau');

  // --- TAB 1: MASSIVBAU STATE & CALCULATIONS ---
  const [archSpan, setArchSpan] = useState<number>(3.0); // L in m
  const [archRise, setArchRise] = useState<number>(1.0); // f in m
  const [archThickness, setArchThickness] = useState<number>(0.24); // d in m (e.g. 24cm full brick)
  const [masonryDensity, setMasonryDensity] = useState<number>(18.0); // kN/m³
  const [surchargeLoad, setSurchargeLoad] = useState<number>(5.0); // q in kN/m²
  const [pointLoad, setPointLoad] = useState<number>(0.0); // P in kN (crown point load)

  const archCalculations = useMemo(() => {
    const L = Math.max(0.5, archSpan);
    const f = Math.max(0.1, archRise);
    const d = Math.max(0.1, archThickness);
    const gamma = Math.max(10, masonryDensity);
    const q = Math.max(0, surchargeLoad);
    const P = Math.max(0, pointLoad);

    // Self-weight per meter span (approximate arch length taken into account)
    // Arch length approximation: s = L + 8/3 * f^2 / L
    const archLength = L + (8 / 3) * (f * f) / L;
    const selfWeightTotal = archLength * d * 1.0 * gamma; // kN per meter width
    const selfWeightPerMeterSpan = selfWeightTotal / L;

    const totalDeadLoad = selfWeightPerMeterSpan + q; // kN/m

    // Horizontal thrust: H = (w * L^2) / (8 * f) + (P * L) / (4 * f)
    const horizontalThrust = (totalDeadLoad * L * L) / (8 * f) + (P * L) / (4 * f);

    // Vertical reaction: V = (w * L) / 2 + P / 2
    const verticalReaction = (totalDeadLoad * L) / 2 + P / 2;

    // Resultant force at abutment: R = sqrt(H^2 + V^2)
    const resultantForce = Math.sqrt(horizontalThrust * horizontalThrust + verticalReaction * verticalReaction);

    // Angle of thrust force at support (in degrees)
    const thrustAngle = (Math.atan(verticalReaction / horizontalThrust) * 180) / Math.PI;

    return {
      H: horizontalThrust,
      V: verticalReaction,
      R: resultantForce,
      angle: thrustAngle,
      weight: selfWeightTotal
    };
  }, [archSpan, archRise, archThickness, masonryDensity, surchargeLoad, pointLoad]);

  // --- TAB 2: FACHWERK STATE & CALCULATIONS ---
  const [woodType, setWoodType] = useState<'fichte' | 'eiche' | 'kiefer'>('fichte');
  const [moistureInitial, setMoistureInitial] = useState<number>(24.0); // % (e.g. fresh wood)
  const [moistureFinal, setMoistureFinal] = useState<number>(12.0); // % (equilibrium moisture indoors)
  const [dimensionInitial, setDimensionInitial] = useState<number>(160); // mm (e.g. 16/16 cm timber)
  const [grainDirection, setGrainDirection] = useState<'radial' | 'tangential' | 'longitudinal'>('tangential');

  const shrinkageCalculations = useMemo(() => {
    const u1 = Math.max(0, moistureInitial);
    const u2 = Math.max(0, moistureFinal);
    const d0 = Math.max(1, dimensionInitial);

    // Differentielle Schwindmaße α je % Holzfeuchte (unterhalb der Fasersättigung, ~30 %);
    // gemeinsame Werte mit dem Holzbau-Modul (src/calc/holzphysik.ts, T10-HW-1 / T12-HB-1)
    const coefficients = SCHWINDBEIWERTE;

    const alpha = coefficients[woodType][grainDirection];

    // Dimensional changes only happen below the fiber saturation point (~30% moisture content)
    const limitU1 = Math.min(30, u1);
    const limitU2 = Math.min(30, u2);
    const deltaMoisture = limitU1 - limitU2; // Positive means drying/shrinking, negative swelling

    const percentChange = alpha * deltaMoisture;
    const dimensionChange = (d0 * percentChange) / 100;
    const dimensionFinalCalculated = d0 - dimensionChange;

    return {
      deltaU: deltaMoisture,
      alpha,
      change: dimensionChange,
      finalDim: dimensionFinalCalculated,
      percent: percentChange
    };
  }, [woodType, moistureInitial, moistureFinal, dimensionInitial, grainDirection]);

  // --- TAB 3: DECKS STATE & CALCULATIONS ---
  const [kappeSpacing, setKappeSpacing] = useState<number>(1.2); // a in m (beam distance)
  const [kappeSpan, setKappeSpan] = useState<number>(4.0); // s in m (beam span length)
  const [kappeRise, setKappeRise] = useState<number>(12); // f in cm (arch rise)
  const [kappeLoad, setKappeLoad] = useState<number>(6.5); // q in kN/m² (selfweight + fill + live load)
  const [tieRodDiameter, setTieRodDiameter] = useState<number>(16); // mm (round iron tie rod)

  const kappeCalculations = useMemo(() => {
    const a = Math.max(0.5, kappeSpacing);
    const s = Math.max(1.0, kappeSpan);
    const fMeters = Math.max(2, kappeRise) / 100; // cm to m
    const q = Math.max(0, kappeLoad);
    const dRod = Math.max(6, tieRodDiameter);

    // Load per meter on the supporting steel beam (I-profile)
    const w = q * a; // kN/m

    // Horizontal thrust of the shallow brick vault (Kappendecke) per meter beam length:
    // H = (w * a^2) / (8 * f)
    // Note: for a shallow arch, thrust per meter is H = (q * a^2) / (8 * f)
    const thrustPerMeter = (q * a * a) / (8 * fMeters);

    // Total horizontal thrust on the full span of the beam (transferred to the end supports or Zugbänder)
    const totalThrust = thrustPerMeter * s;

    // Cross-sectional area of the round tie rod (A = pi * d^2 / 4)
    const rodAreaSqMm = (Math.PI * dRod * dRod) / 4;

    // LEHRWERT (Umsetzung 30.10.2026, DSC-HB-1): zulässige Spannung für historisches Schweißeisen/Flussstahl,
    // ohne Normbeleg (Quelle der Altnorm nicht ermittelt); maßgebend sind Bestandsunterlagen bzw. Werkstoffprüfung
    const sigmaAllowable = SIGMA_ZUL_ZUGBAND_LEHRWERT; // N/mm²

    // Tension capacity of the tie-rod (kN)
    const tieRodCapacityKn = (rodAreaSqMm * sigmaAllowable) / 1000;

    // Required tie rods along the beam span (spacing or total number)
    // Number of rods required to balance the total thrust
    const requiredNumOfRods = totalThrust / tieRodCapacityKn;

    return {
      w,
      thrustPerMeter,
      totalThrust,
      rodArea: rodAreaSqMm,
      capacity: tieRodCapacityKn,
      requiredRods: requiredNumOfRods
    };
  }, [kappeSpacing, kappeSpan, kappeRise, kappeLoad, tieRodDiameter]);

  return (
    <div className="flex flex-col gap-8">
      {/* Main Module Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-6 border-b border-home-grau/30 pb-6">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Landmark className="text-shiraz" size={24} /><MdText text={inhalt.texte.histBauweisen} /></h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p><MdText text={inhalt.texte.fachlicheSystematikHistorischerTragwerke} /></p>
          </div>
        </div>

        <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6">

        {/* Dynamic Tab Content rendering */}
        <div className="space-y-6">

          {/* TAB 1: MASSIVBAU & MAUERWERK */}
          {activeTab === 'massivbau' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
              
              {/* Informational Column (Left) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Building2 className="text-shiraz" size={18} /><MdText text={inhalt.texte.historischeMauerwerksSteinkonstruktionen} /></h3>
                  <p className="text-text-main/80 text-sm leading-relaxed"><MdText text={inhalt.texte.derHistorischeMassivbauStützt} /></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20">
                    <h4 className="font-bold text-slate-900 text-sm mb-2"><MdText text={inhalt.texte.vollziegelReichsformat} /></h4>
                    <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.ziegelmauerwerkWurdeVor1950} /></p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20">
                    <h4 className="font-bold text-slate-900 text-sm mb-2">Stampfbeton</h4>
                    <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.imSpäten19Und} /></p>
                  </div>
                </div>

                <div className="bg-[#fcf8f2] p-4 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="text-amber-700" size={16} /><MdText text={inhalt.texte.statischeBesonderheitenSchwachstellen} /></h4>
                  <ul className="list-disc pl-5 text-xs text-amber-900 space-y-1.5">
                    <li><MdText text={inhalt.texte.zweischaligesMauerwerkOhneLuftschichtank} /></li>
                    <li><MdText text={inhalt.texte.spreizdruckVonGewölbenJeder} /></li>
                    <li><MdText text={inhalt.texte.sulfattreibenImMörtelEttringit} /></li>
                  </ul>
                </div>

                {/* Formeln im Massivbau */}
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold text-slate-900 text-sm mb-2"><MdText text={inhalt.texte.gewölbeschubStatischesGrundmodell} /></h4>
                  <p className="text-xs text-slate-600 mb-3"><MdText text={inhalt.texte.derStatischWirksameHorizontalschub} /></p>
                  <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center my-2">
                    <BlockMath math="H = \frac{w \cdot L^2}{8 \cdot f} + \frac{P \cdot L}{4 \cdot f}" />
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-2"><MdText text={inhalt.texte.wobeiLDieLichte} /></span>
                </div>
              </div>

              {/* Interactive Tool Column (Right) */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 h-fit space-y-5">
                <div>
                  <h3 className="font-bold text-slate-950 text-sm flex items-center gap-1.5">
                    <PenTool className="text-shiraz" size={16} /><MdText text={inhalt.texte.bogenGewölbeschubrechner} /></h3>
                  <p className="text-xs text-slate-600"><MdText text={inhalt.texte.berechnenSieDieResultierenden} /></p>
                </div>

                {/* Interactive Inputs */}
                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span><MdText text={inhalt.texte.lichteSpannweiteL} /></span>
                      <span className="text-shiraz font-bold">{formatDeZahl(archSpan, 2)} m</span>
                    </label>
                    <input 
                      type="range" min="1.0" max="10.0" step="0.1" 
                      value={archSpan} onChange={(e) => setArchSpan(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span><MdText text={inhalt.texte.bogenstichhöheF} /></span>
                      <span className="text-shiraz font-bold">{formatDeZahl(archRise, 2)} m</span>
                    </label>
                    <input 
                      type="range" min="0.1" max="3.0" step="0.05" 
                      value={archRise} onChange={(e) => setArchRise(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span><MdText text={inhalt.texte.bogenstärkeDickeD} /></span>
                      <span className="text-shiraz font-bold">{formatDeZahl(archThickness, 2)} m</span>
                    </label>
                    <input 
                      type="range" min="0.12" max="0.50" step="0.01" 
                      value={archThickness} onChange={(e) => setArchThickness(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span><MdText text={inhalt.texte.wichteMauerwerk} /></span>
                      <span className="text-shiraz font-bold">{formatDeZahl(masonryDensity, 1)} kN/m³</span>
                    </label>
                    <input 
                      type="range" min="12.0" max="24.0" step="0.5" 
                      value={masonryDensity} onChange={(e) => setMasonryDensity(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span><MdText text={inhalt.texte.gleichmäßigeAuflastQAuffüllung} /></span>
                      <span className="text-shiraz font-bold">{formatDeZahl(surchargeLoad, 1)} kN/m²</span>
                    </label>
                    <input 
                      type="range" min="0.0" max="15.0" step="0.5" 
                      value={surchargeLoad} onChange={(e) => setSurchargeLoad(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span><MdText text={inhalt.texte.einzellastImBogenscheitelP} /></span>
                      <span className="text-shiraz font-bold">{formatDeZahl(pointLoad, 1)} kN</span>
                    </label>
                    <input 
                      type="range" min="0.0" max="25.0" step="1.0" 
                      value={pointLoad} onChange={(e) => setPointLoad(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    />
                  </div>
                </div>

                {/* Live SVG Visualization */}
                <div className="bg-white p-3 rounded-xl border border-home-grau/20 flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-mono mb-2"><MdText text={inhalt.texte.vektormodellDerBogenstatik} /></span>
                  <svg width="220" height="110" viewBox="-10 -10 240 120" className="overflow-visible">
                    {/* Abutments (Widerlager) */}
                    <rect x="0" y="80" width="30" height="20" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                    <rect x="190" y="80" width="30" height="20" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                    
                    {/* Arch geometry path */}
                    {/* We draw a quadratic bezier curve to represent the arch */}
                    <path 
                      d={`M 15 80 Q 110 ${80 - (archRise / archSpan) * 120} 205 80`} 
                      fill="none" 
                      stroke="#800020" 
                      strokeWidth={Math.max(3, archThickness * 25)} 
                      strokeLinecap="round"
                    />
                    
                    {/* Inner/Intrados curve */}
                    <path 
                      d={`M 15 80 Q 110 ${80 - (archRise / archSpan) * 120 + 4} 205 80`} 
                      fill="none" 
                      stroke="#f1f5f9" 
                      strokeWidth="1" 
                      strokeDasharray="2,2"
                    />

                    {/* Surcharge representation */}
                    <rect x="30" y="15" width="160" height="20" fill="#b91c1c" fillOpacity="0.08" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
                    <text x="110" y="28" textAnchor="middle" fontSize="8" fill="#b91c1c" className="font-bold">q = {formatDeZahl(surchargeLoad, 1)} kN/m²</text>

                    {/* Thrust Vectors (Arrows showing forces) */}
                    {/* Left Horiz Thrust Arrow */}
                    <line x1="-5" y1="80" x2="10" y2="80" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#arrow)" />
                    {/* Right Horiz Thrust Arrow */}
                    <line x1="225" y1="80" x2="210" y2="80" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#arrow)" />
                    {/* Vertical reaction arrows */}
                    <line x1="15" y1="105" x2="15" y2="85" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrow)" />
                    <line x1="205" y1="105" x2="205" y2="85" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrow)" />

                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="currentColor" />
                      </marker>
                    </defs>
                  </svg>
                  <div className="flex justify-between w-full text-[10px] px-2 text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span> V-Kraft</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span><MdText text={inhalt.texte.hSchubSpreizdruck} /></span>
                  </div>
                </div>

                {/* Calculation Results */}
                <div className="bg-white p-4 rounded-xl border border-home-grau/20 space-y-2.5">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider"><MdText text={inhalt.texte.ergebnisseProLfdMeter} /></h4>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                      <span className="text-slate-500 block">Bogengewicht:</span>
                      <strong className="text-slate-900 text-sm">~{formatDeZahl(archCalculations.weight, 1)} kN</strong>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                      <span className="text-slate-500 block"><MdText text={inhalt.texte.vertikalkraftV} /></span>
                      <strong className="text-blue-600 text-sm">{formatDeZahl(archCalculations.V, 1)} kN</strong>
                    </div>

                    <div className="bg-red-50 p-2.5 rounded-lg border border-red-100 col-span-2">
                      <div className="flex justify-between items-center">
                        <span className="text-red-800 font-medium"><MdText text={inhalt.texte.horizontalschubH} /></span>
                        <strong className="text-red-600 text-base">{formatDeZahl(archCalculations.H, 1)} kN</strong>
                      </div>
                      <span className="text-[10px] text-red-600/80 block mt-1 leading-tight"><MdText text={inhalt.texte.dieserSchubMussÜber} /></span>
                    </div>

                    <ErgebnisAnsage text={kurzzeile(ansageWert('Gewölbe: Horizontalschub H', archCalculations.H, 1, 'kN'), ansageWert('resultierende Kraft R', archCalculations.R, 1, 'kN'), ansageWert('Winkel', archCalculations.angle, 1, '°'))} />
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150 col-span-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700"><MdText text={inhalt.texte.resultierendeKraftR} /></span>
                        <strong className="text-slate-900 font-bold">{formatDeZahl(archCalculations.R, 1)} kN</strong>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5"><MdText text={inhalt.texte.eintragswinkelDesDruckvektors} /><strong>{formatDeZahl(archCalculations.angle, 1)}°</strong><MdText text={inhalt.texte.zurHorizontalen} /></span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FACHWERK & HOLZSKELETTBAU */}
          {activeTab === 'fachwerk' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
              
              {/* Informational Column (Left) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Hammer className="text-shiraz" size={18} /><MdText text={inhalt.texte.fachwerkbauweiseHistorischeHolzskelette} /></h3>
                  <p className="text-text-main/80 text-sm leading-relaxed"><MdText text={inhalt.texte.derFachwerkbauIstEin} /></p>
                </div>

                {/* Anatomy of Fachwerk */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/20 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.dieHauptkomponentenEinesFachwerks} /></h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.t1SchwelleGrundschwelle} /></strong><MdText text={inhalt.texte.liegtMeistAufEinem} /></div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.t2StänderSäulenPfosten} /></strong><MdText text={inhalt.texte.dieVertikalenTragendenHölzer} /></div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.t3RiegelBrustSturzriegel} /></strong><MdText text={inhalt.texte.dieHorizontalenQuerhölzerWelche} /></div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.t4StrebenBänder} /></strong><MdText text={inhalt.texte.dieSchrägGestelltenHölzer} /></div>
                  </div>
                </div>

                <div className="bg-[#fcf8f2] p-4 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="text-amber-700" size={16} /><MdText text={inhalt.texte.bauschädenFäulnisAusfachungsprobleme} /></h4>
                  <p className="text-xs text-slate-700 leading-relaxed mb-3"><MdText text={inhalt.texte.einFachwerkAtmetUnd} /></p>
                  <ul className="list-disc pl-5 text-xs text-amber-900 space-y-1.5">
                    <li><MdText text={inhalt.texte.flankenabrisseZementmörtelVerbindetSich} /></li>
                    <li><MdText text={inhalt.texte.feuchtestauZementUndDispersionsfarben} /></li>
                    <li><MdText text={inhalt.texte.insektenbefallFeuchtesHolzZieht} /></li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold text-slate-900 text-sm mb-2">Holzfeuchtemechanik</h4>
                  <p className="text-xs text-slate-600 mb-2"><MdText text={inhalt.texte.holzSchwindetUndQuillt} /></p>
                  <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center my-2">
                    <BlockMath math="\Delta d = d_0 \cdot \alpha \cdot (u_1 - u_2) / 100" />
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1"><MdText text={inhalt.texte.wobeiAlphaDerSchwindbeiwert} /></span>
                </div>
              </div>

              {/* Interactive Tool Column (Right) */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 h-fit space-y-5">
                <div>
                  <h3 className="font-bold text-slate-950 text-sm flex items-center gap-1.5">
                    <PenTool className="text-shiraz" size={16} /><MdText text={inhalt.texte.holzfeuchteSchwindungsRechner} /></h3>
                  <p className="text-xs text-slate-600"><MdText text={inhalt.texte.berechnenSieDasHygrische} /></p>
                </div>

                {/* Interactive Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-800 block mb-1">Holzart:</label>
                    <select aria-label="Holzart" 
                      value={woodType} 
                      onChange={(e) => setWoodType(e.target.value as typeof woodType)}
                      className="w-full text-xs p-2 rounded-lg border border-home-grau/30 bg-white"
                    >
                      <option value="fichte">Fichte / Tanne (Standard-Nadelholz)</option>
                      <option value="eiche">Eiche (Hartholz, historisch tragend)</option>
                      <option value="kiefer">Kiefer (Kernholz)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 block mb-1"><MdText text={inhalt.texte.ausrichtungsrichtungDesHolzquerschnitts} /></label>
                    <select aria-label={inhalt.werte.ausrichtungsrichtungDesHolzquerschnitts} 
                      value={grainDirection} 
                      onChange={(e) => setGrainDirection(e.target.value as typeof grainDirection)}
                      className="w-full text-xs p-2 rounded-lg border border-home-grau/30 bg-white"
                    >
                      <option value="radial">Radial (stehende Jahresringe - stabiler)</option>
                      <option value="tangential">Tangential (flach liegende Jahresringe - arbeitet stark)</option>
                      <option value="longitudinal">Longitudinal (Faserrichtung - vernachlässigbar)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span><MdText text={inhalt.texte.anfangsHolzfeuchteU} /></span>
                      <span className="text-shiraz font-bold">{formatDeZahl(moistureInitial, 1)} %</span>
                    </label>
                    <input 
                      type="range" min="6.0" max="40.0" step="1.0" 
                      value={moistureInitial} onChange={(e) => setMoistureInitial(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    />
                    <span className="text-[10px] text-slate-400"><MdText text={inhalt.texte.frischesFeuchtesHolzLiegt} /></span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span><MdText text={inhalt.texte.zielHolzfeuchteZB} /></span>
                      <span className="text-shiraz font-bold">{formatDeZahl(moistureFinal, 1)} %</span>
                    </label>
                    <input 
                      type="range" min="6.0" max="24.0" step="1.0" 
                      value={moistureFinal} onChange={(e) => setMoistureFinal(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    />
                    <span className="text-[10px] text-slate-400"><MdText text={inhalt.texte.ausgleichsfeuchteImBeheiztenWohnraum} /></span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span><MdText text={inhalt.texte.bauteilNennmaßDDicke} /></span>
                      <span className="text-shiraz font-bold">{formatDeWert(dimensionInitial)} mm</span>
                    </label>
                    <input 
                      type="range" min="60" max="300" step="10" 
                      value={dimensionInitial} onChange={(e) => setDimensionInitial(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    />
                  </div>
                </div>

                {/* Calculation Results */}
                <div className="bg-white p-4 rounded-xl border border-home-grau/20 space-y-3">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Verformungsergebnisse:</h4>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500"><MdText text={inhalt.texte.effektivesUUnterhalbSättigung} /></span>
                      <span className="font-semibold text-slate-800">{formatDeZahl(shrinkageCalculations.deltaU, 1)} %-Punkte</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500"><MdText text={inhalt.texte.spezifischerSchwindbeiwert} /></span>
                      <span className="font-mono font-semibold text-slate-800">{formatDeZahl(shrinkageCalculations.alpha, 3)} % per 1% u</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500"><MdText text={inhalt.texte.erwarteteRelativeMaßänderung} /></span>
                      <span className="font-semibold text-amber-700">{formatDeZahl(shrinkageCalculations.percent, 2)} %</span>
                    </div>

                    <ErgebnisAnsage text={kurzzeile(ansageWert('Maßänderung durch Schwinden', shrinkageCalculations.change, 2, 'mm'), ansageWert('neues Maß', shrinkageCalculations.finalDim, 2, 'mm'))} />
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                      <div className="flex justify-between items-center text-sm font-bold text-amber-950">
                        <span><MdText text={inhalt.texte.maßänderungSchwund} /></span>
                        <span>{formatDeZahl(shrinkageCalculations.change, 2)} mm</span>
                      </div>
                      <p className="text-[10px] text-amber-800 mt-1 leading-relaxed"><MdText text={inhalt.texte.dasBauteilVerringertSeine} />{formatDeWert(dimensionInitial)} mm auf <strong>{formatDeZahl(shrinkageCalculations.finalDim, 1)} mm</strong><MdText text={inhalt.texte.imFachwerkFührtDieser} /></p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: HISTORISCHE DECKEN */}
          {activeTab === 'decken' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
              
              {/* Informational Column (Left) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Layers className="text-shiraz" size={18} /><MdText text={inhalt.texte.historischeDeckenkonstruktionen} /></h3>
                  <p className="text-text-main/80 text-sm leading-relaxed"><MdText text={inhalt.texte.deckenInAltbautenVariieren} /></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 text-xs">
                    <strong className="text-slate-950 font-bold block mb-1"><MdText text={inhalt.texte.holzbalkendeckenMitEinschub} /></strong>
                    <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.klassischeDeckeDerGründerzeit} /></p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 text-xs">
                    <strong className="text-slate-950 font-bold block mb-1"><MdText text={inhalt.texte.dippelbalkendeckenDübelbalken} /></strong>
                    <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.ganzholzdeckenAusDichtAn} /></p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 text-xs">
                    <strong className="text-slate-950 font-bold block mb-1"><MdText text={inhalt.texte.preußischeKappenKappendecke} /></strong>
                    <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.flachGewölbteZiegelschalenZwischen} /></p>
                  </div>
                </div>

                <div className="bg-[#fcf8f2] p-4 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="text-amber-700" size={16} /><MdText text={inhalt.texte.tragfähigkeitsschwundVerfallsgefahren} /></h4>
                  <ul className="list-disc pl-5 text-xs text-amber-900 space-y-1.5">
                    <li><MdText text={inhalt.texte.erlöschenDesAuflagerbereichsBalkenköpfe} /></li>
                    <li><MdText text={inhalt.texte.korrosionAnITrägern} /></li>
                    <li><MdText text={inhalt.texte.durchhangHistorischerDeckenDurch} /></li>
                  </ul>
                </div>

                {/* Preussische Kappe Formel */}
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold text-slate-900 text-sm mb-1.5"><MdText text={inhalt.texte.gewölbeschubEinerPreußischenKappe} /></h4>
                  <p className="text-xs text-slate-600 mb-2"><MdText text={inhalt.texte.derStatischeHorizontalschubH} /></p>
                  <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center my-2">
                    <BlockMath math="H = \frac{q \cdot a^2}{8 \cdot f}" />
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1"><MdText text={inhalt.texte.wobeiADerAbstand} /></span>
                </div>
              </div>

              {/* Interactive Tool Column (Right) */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 h-fit space-y-5">
                <div>
                  <h3 className="font-bold text-slate-950 text-sm flex items-center gap-1.5">
                    <PenTool className="text-shiraz" size={16} /><MdText text={inhalt.texte.kappendeckenSchubZugbandRechner} /></h3>
                  <p className="text-xs text-slate-600"><MdText text={inhalt.texte.ermittelnSieDenHorizontalen} /></p>
                </div>

                {/* Interactive Inputs */}
                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span><MdText text={inhalt.texte.abstandDerStahlträgerA} /></span>
                      <span className="text-shiraz font-bold">{formatDeZahl(kappeSpacing, 2)} m</span>
                    </label>
                    <input 
                      type="range" min="0.8" max="2.0" step="0.05" 
                      value={kappeSpacing} onChange={(e) => setKappeSpacing(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span><MdText text={inhalt.texte.spannweiteDesTrägersS} /></span>
                      <span className="text-shiraz font-bold">{formatDeZahl(kappeSpan, 1)} m</span>
                    </label>
                    <input 
                      type="range" min="2.0" max="8.0" step="0.5" 
                      value={kappeSpan} onChange={(e) => setKappeSpan(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span><MdText text={inhalt.texte.stichhöheDesGewölbesF} /></span>
                      <span className="text-shiraz font-bold">{formatDeWert(kappeRise)} cm</span>
                    </label>
                    <input 
                      type="range" min="5" max="25" step="1" 
                      value={kappeRise} onChange={(e) => setKappeRise(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span><MdText text={inhalt.texte.gesamtlastQEigenlastFüllung} /></span>
                      <span className="text-shiraz font-bold">{formatDeZahl(kappeLoad, 1)} kN/m²</span>
                    </label>
                    <input 
                      type="range" min="3.0" max="12.0" step="0.5" 
                      value={kappeLoad} onChange={(e) => setKappeLoad(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span><MdText text={inhalt.texte.durchmesserDerRundenZugstangen} /></span>
                      <span className="text-shiraz font-bold">Ø {formatDeWert(tieRodDiameter)} mm</span>
                    </label>
                    <input 
                      type="range" min="10" max="24" step="2" 
                      value={tieRodDiameter} onChange={(e) => setTieRodDiameter(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    />
                  </div>
                </div>

                {/* Calculation Results */}
                <div className="bg-white p-4 rounded-xl border border-home-grau/20 space-y-2.5">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider"><MdText text={inhalt.texte.lagerkräfteZugbandBemessung} /></h4>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500"><MdText text={inhalt.texte.gleichlastAufTrägerW} /></span>
                      <span className="font-semibold text-slate-800">{formatDeZahl(kappeCalculations.w, 2)} kN/m</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500"><MdText text={inhalt.texte.horizontalschubJeMeterTräger} /></span>
                      <span className="font-semibold text-red-600">{formatDeZahl(kappeCalculations.thrustPerMeter, 2)} kN/m</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500"><MdText text={inhalt.texte.gesamteSpreizkraftJeFeldträger} /></span>
                      <span className="font-bold text-red-700">{formatDeZahl(kappeCalculations.totalThrust, 1)} kN</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500"><MdText text={inhalt.texte.tragfähigkeitJeZugstange} /></span>
                      <span className="font-semibold text-blue-600">{formatDeZahl(kappeCalculations.capacity, 1)} kN</span>
                    </div>

                    <ErgebnisAnsage text={kurzzeile(ansageWert('Spreizkraft je Feldträger', kappeCalculations.totalThrust, 1, 'kN'), ansageWert('erforderliche Zugbänder', Math.ceil(kappeCalculations.requiredRods), 0, 'Stück'))} />
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <div className="flex justify-between items-center text-xs font-bold text-blue-950">
                        <span><MdText text={inhalt.texte.erforderlicheAnzahlZugbänder} /></span>
                        <span className="text-sm text-blue-700">{formatDeWert(Math.ceil(kappeCalculations.requiredRods))} Stk.</span>
                      </div>
                      <p className="text-[10px] text-blue-800 mt-1 leading-normal"><MdText text={inhalt.texte.fürDieTrägergesamtlängeVon} />{formatDeZahl(kappeSpan, 1)}<MdText text={inhalt.texte.mSindMindestens} /><strong>{formatDeWert(Math.ceil(kappeCalculations.requiredRods))} Zugstangen</strong> Ø {formatDeWert(tieRodDiameter)}<MdText text={inhalt.texte.mmAnzuordnenHistorischerVergleich} /></p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: HISTORISCHE DACHWERKE */}
          {activeTab === 'dachwerke' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
              
              {/* Informational Column (Left) */}
              <div className="lg:col-span-12 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Landmark className="text-shiraz" size={18} /><MdText text={inhalt.texte.historischeHolzdachwerkeTypologieUnd} /></h3>
                  <p className="text-text-main/80 text-sm leading-relaxed"><MdText text={inhalt.texte.derHistorischeZimmermannEntwickelte} /></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sparrendach / Kehlbalkendach */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/20 space-y-3">
                    <div className="flex items-center gap-2 border-b border-home-grau/20 pb-2">
                      <div className="p-1.5 bg-rose-50 text-shiraz rounded-lg">
                        <Layers size={18} />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.dasSparrenKehlbalkendach} /></h4>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.bestehtAusDreiecksförmigenSparrenpaaren} /></p>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5 text-xs text-slate-600">
                      <strong className="text-slate-800 text-xs block"><MdText text={inhalt.texte.tragwirkungDetails} /></strong>
                      <ul className="list-disc pl-4 space-y-1">
                        <li><MdText text={inhalt.texte.fußpunktanschlussMussZwingendÜber} /></li>
                        <li><MdText text={inhalt.texte.kehlbalkenVerkürzenDieKnicklänge} /></li>
                      </ul>
                    </div>
                  </div>

                  {/* Pfettendach */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/20 space-y-3">
                    <div className="flex items-center gap-2 border-b border-home-grau/20 pb-2">
                      <div className="p-1.5 bg-rose-50 text-shiraz rounded-lg">
                        <Building2 size={18} />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.dasPfettendachMitStuhlkonstruktion} /></h4>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.dieSparrenLiegenAuf} /></p>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5 text-xs text-slate-600">
                      <strong className="text-slate-800 text-xs block"><MdText text={inhalt.texte.stuhlkonstruktionenStehendLiegend} /></strong>
                      <ul className="list-disc pl-4 space-y-1">
                        <li><MdText text={inhalt.texte.stehenderDachstuhlDiePfetten} /></li>
                        <li><MdText text={inhalt.texte.liegenderDachstuhlDieStuhlsäulen} /></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-[#fcf8f2] p-5 rounded-xl border border-amber-200 space-y-3">
                  <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                    <AlertTriangle className="text-amber-700" size={16} /><MdText text={inhalt.texte.bauforschungSubstanzschonendeSanierungsp} /></h4>
                  <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.beiDerBeurteilungHistorischer} /></p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-amber-100">
                      <strong className="text-slate-950 block mb-1"><MdText text={inhalt.texte.abbundzeichenEntziffern} /></strong>
                      <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.dieEingehauenenRömischenZiffern} /></p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-amber-100">
                      <strong className="text-slate-950 block mb-1"><MdText text={inhalt.texte.passgenaueSchäftungen} /></strong>
                      <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.verrotteteBalkenabschnitteMüssenNicht} /></p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-amber-100">
                      <strong className="text-slate-950 block mb-1">Dendrochronologie</strong>
                      <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.dasEntnehmenKleinerBohrkerne} /></p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
        </ModuleTabs>
      </div>

      {/* Standardized Module Footer */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1BiegespannungIn}
        zielGleichung="\sigma_m = \frac{q \cdot l^2 / 8}{b \cdot h^2 / 6}"
        schritte={inhalt.daten["HistorischeBauweisen.schritte"]}
        ergebnisHinweis={inhalt.werte.dieBiegungIstBei}
        normQuelle={inhalt.werte.technischeMechanikNachweisNach}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2SchwindmaßEines}
        zielGleichung="\Delta b = b \cdot \alpha_t \cdot \Delta u"
        schritte={inhalt.daten["HistorischeBauweisen.schritte_2"]}
        ergebnisHinweis={inhalt.werte.rund1CmSchwinden}
        normQuelle={inhalt.werte.din68100201007}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="historische_bauweisen" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap8} 
        wikipedia={[
          { title: "Mauerwerk", url: "https://de.wikipedia.org/wiki/Mauerwerk" },
          { title: "Fachwerkhaus", url: "https://de.wikipedia.org/wiki/Fachwerkhaus" },
          { title: "Holzbalkendecke", url: "https://de.wikipedia.org/wiki/Holzbalkendecke" },
          { title: "Kappendecke", url: "https://de.wikipedia.org/wiki/Kappendecke" },
          { title: "Dachwerk", url: "https://de.wikipedia.org/wiki/Dachwerk" }
        ]}
        literatur={inhalt.daten["HistorischeBauweisen.literatur"]}
        regelwerke={inhalt.daten["HistorischeBauweisen.regelwerke"]}
        formeln={inhalt.daten["HistorischeBauweisen.formeln"]}
      />
    </div>
  );
}
