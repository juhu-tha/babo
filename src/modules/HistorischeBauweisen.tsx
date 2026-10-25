import React, { useState, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { 
  Building2, Landmark, Layers, AlertTriangle, PenTool, Hammer
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';

export default function HistorischeBauweisen() {
  const [activeTab, setActiveTab] = useState<'massivbau' | 'fachwerk' | 'decken' | 'dachwerke'>('massivbau');

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

    // Shrinkage coefficients alpha per 1% moisture change (below fiber saturation point of ~30%)
    // Coefficients approximate values for common European woods
    const coefficients = {
      fichte: { radial: 0.15, tangential: 0.27, longitudinal: 0.01 },
      eiche: { radial: 0.18, tangential: 0.34, longitudinal: 0.01 },
      kiefer: { radial: 0.16, tangential: 0.31, longitudinal: 0.01 }
    };

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

    // Allowable steel stress for historical steel/iron (approx. 100-140 N/mm²)
    const sigmaAllowable = 120.0; // N/mm²

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
            <Landmark className="text-shiraz" size={24} /> Hist. Bauweisen
          </h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p>
              Fachliche Systematik historischer Tragwerke und Bauteile. Das Erkennen und Verstehen historischer 
              Lastabtragungsmechanismen, traditioneller Holzverbindungen und Fügungstechniken bildet das unabdingbare 
              Fundament für Standsicherheitsnachweise und substanzschonende Sanierungsplanungen im Bestand.
            </p>
          </div>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
          {[
            { id: 'massivbau' as const, label: 'Massivbau & Mauerwerk', icon: Building2 },
            { id: 'fachwerk' as const, label: 'Fachwerk & Holzskelett', icon: Hammer },
            { id: 'decken' as const, label: 'Historische Decken', icon: Layers },
            { id: 'dachwerke' as const, label: 'Historische Dachwerke', icon: Landmark }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button aria-pressed={activeTab === tab.id}
                key={tab.id}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-shiraz text-white border-shiraz shadow-md' 
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Content rendering */}
        <div className="space-y-6">

          {/* TAB 1: MASSIVBAU & MAUERWERK */}
          {activeTab === 'massivbau' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
              
              {/* Informational Column (Left) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Building2 className="text-shiraz" size={18} /> Historische Mauerwerks- &amp; Steinkonstruktionen
                  </h3>
                  <p className="text-text-main/80 text-sm leading-relaxed">
                    Der historische Massivbau stützt sich statisch primär auf das Prinzip des reinen Druckabtrags. Da herkömmliche Kalk- und Luftmörtel keine nennenswerte Zugfestigkeit besitzen, durften in Decken- und Wandöffnungen keine nennenswerten Biegespannungen auftreten. Öffnungen wurden konsequent mittels gemauerter Bögen und Gewölbe überspannt.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20">
                    <h4 className="font-bold text-slate-900 text-sm mb-2">Vollziegel &amp; Reichsformat</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Ziegelmauerwerk wurde vor 1950 im Regelfall im <strong>Reichsformat RF (250 × 120 × 65 mm)</strong> (zum Vergleich heute: Normalformat NF 240 × 115 × 71 mm, Dünnformat DF 240 × 115 × 52 mm) und im vollfugigen Verband gemauert. Die Steinfestigkeit lag oft hoch (<InlineMath math="f_b \ge 10 - 20\text{ N/mm}^2" />), wohingegen die historische Mörtelfestigkeit (<InlineMath math="f_m" />) mangels Zementanteil oft unter <InlineMath math="1{,}0 - 2{,}5\text{ N/mm}^2" /> liegt. Dies führt zu einem weichen, verformungsfähigen Tragverhalten.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20">
                    <h4 className="font-bold text-slate-900 text-sm mb-2">Stampfbeton</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Im späten 19. und frühen 20. Jahrhundert weit verbreitet für Fundamente, Kellerwände und schwere Stützwände. Ohne oder mit nur minimaler Bewehrung eingebracht, erfordert dieser Baustoff die konsequente Vermeidung exzentrischer Belastungen und klaffender Fugen, da sonst schlagartig Zugrisse auftreten.
                    </p>
                  </div>
                </div>

                <div className="bg-[#fcf8f2] p-4 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="text-amber-700" size={16} /> Statische Besonderheiten &amp; Schwachstellen
                  </h4>
                  <ul className="list-disc pl-5 text-xs text-amber-900 space-y-1.5">
                    <li><strong>Zweischaliges Mauerwerk ohne Luftschichtanker:</strong> Bei historischen Vorsatzschalen (z.B. Sichtmauerwerk der Gründerzeit) fehlen oft korrosionsbeständige Drahtanker. Unter Windsog können Vorsatzschalen dann abgelöst werden; Verankerung prüfen.</li>
                    <li><strong>Spreizdruck von Gewölben:</strong> Jeder gemauerte Bogen leitet beträchtliche horizontale Schubkräfte in die Auflagerwände ein. Setzen sich diese Wände seitlich ab, stürzt das Gewölbe ein.</li>
                    <li><strong>Sulfattreiben im Mörtel:</strong> Ettringit- bzw. Thaumasittreiben entsteht, wenn gipshaltige Mörtel oder Steine mit zementhaltigen (aluminathaltigen) Reparaturmörteln in Kontakt kommen und durchfeuchtet werden; das Gefüge kann dabei vollständig zerstört werden.</li>
                  </ul>
                </div>

                {/* Formeln im Massivbau */}
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold text-slate-900 text-sm mb-2">Gewölbeschub (statisches Grundmodell)</h4>
                  <p className="text-xs text-slate-600 mb-3">
                    Der statisch wirksame Horizontalschub <InlineMath math="H" /> eines Bogens unter Gleichlast <InlineMath math="w" /> und Kronenpunktlast <InlineMath math="P" /> berechnet sich näherungsweise zu:
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center my-2">
                    <BlockMath math="H = \frac{w \cdot L^2}{8 \cdot f} + \frac{P \cdot L}{4 \cdot f}" />
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-2">
                    Wobei <InlineMath math="L" /> die lichte Spannweite und <InlineMath math="f" /> die Stichhöhe (Bogenaufstieg) darstellen.
                  </span>
                </div>
              </div>

              {/* Interactive Tool Column (Right) */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 h-fit space-y-5">
                <div>
                  <h3 className="font-bold text-slate-950 text-sm flex items-center gap-1.5">
                    <PenTool className="text-shiraz" size={16} /> Bogen- &amp; Gewölbeschubrechner
                  </h3>
                  <p className="text-xs text-slate-600">
                    Berechnen Sie die resultierenden Lagerkräfte eines historischen Tonnengewölbes oder Segmentbogens pro Meter Gewölbebreite.
                  </p>
                </div>

                {/* Interactive Inputs */}
                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span>Lichte Spannweite L:</span>
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
                      <span>Bogenstichhöhe f:</span>
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
                      <span>Bogenstärke / Dicke d:</span>
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
                      <span>Wichte Mauerwerk:</span>
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
                      <span>Gleichmäßige Auflast q (Auffüllung + Nutzlast):</span>
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
                      <span>Einzellast im Bogenscheitel P:</span>
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
                  <span className="text-[10px] text-slate-400 font-mono mb-2">Vektormodell der Bogenstatik</span>
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
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span> H-Schub (Spreizdruck)</span>
                  </div>
                </div>

                {/* Calculation Results */}
                <div className="bg-white p-4 rounded-xl border border-home-grau/20 space-y-2.5">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Ergebnisse (pro lfd. Meter):</h4>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                      <span className="text-slate-500 block">Bogengewicht:</span>
                      <strong className="text-slate-900 text-sm">~{formatDeZahl(archCalculations.weight, 1)} kN</strong>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                      <span className="text-slate-500 block">Vertikalkraft V:</span>
                      <strong className="text-blue-600 text-sm">{formatDeZahl(archCalculations.V, 1)} kN</strong>
                    </div>

                    <div className="bg-red-50 p-2.5 rounded-lg border border-red-100 col-span-2">
                      <div className="flex justify-between items-center">
                        <span className="text-red-800 font-medium">Horizontalschub H:</span>
                        <strong className="text-red-600 text-base">{formatDeZahl(archCalculations.H, 1)} kN</strong>
                      </div>
                      <span className="text-[10px] text-red-600/80 block mt-1 leading-tight">
                        Dieser Schub muss über Zugbänder oder ausreichend dimensionierte Strebepfeiler (Widerlager) abgetragen werden!
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150 col-span-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Resultierende Kraft R:</span>
                        <strong className="text-slate-900 font-bold">{formatDeZahl(archCalculations.R, 1)} kN</strong>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Eintragswinkel des Druckvektors: <strong>{formatDeZahl(archCalculations.angle, 1)}°</strong> zur Horizontalen
                      </span>
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
                    <Hammer className="text-shiraz" size={18} /> Fachwerkbauweise &amp; historische Holzskelette
                  </h3>
                  <p className="text-text-main/80 text-sm leading-relaxed">
                    Der Fachwerkbau ist ein hocheffizientes, dreidimensionales Stabtragwerk. Horizontalkräfte (Wind, Auslenkung) werden primär durch schräge Streben, Kopf- und Fußbänder in die massiven Fundamentschwellen geleitet. Die Verbindungen beruhen ausschließlich auf passgenauen, formschlüssigen Holzverbindungen, gesichert mit Holznägeln aus Eiche.
                  </p>
                </div>

                {/* Anatomy of Fachwerk */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/20 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">Die Hauptkomponenten eines Fachwerks:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1">1. Schwelle (Grundschwelle):</strong>
                      Liegt meist auf einem flachen Steinsockel auf. Verteilt alle Vertikal- und Horizontalkräfte auf das Fundament. Extrem gefährdet durch aufsteigende Feuchtigkeit.
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1">2. Ständer (Säulen/Pfosten):</strong>
                      Die vertikalen, tragenden Hölzer, die Druckkräfte aufnehmen. Ständerbau: Ständer laufen geschossübergreifend durch; Rähmbau (Stockwerkbau): Ständer werden je Geschoss abgezimmert und auf Rähm bzw. Schwelle gestellt.
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1">3. Riegel (Brust-/Sturzriegel):</strong>
                      Die horizontalen Querhölzer, welche die Gefache begrenzen und Fenster- und Türöffnungen ausbilden.
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1">4. Streben &amp; Bänder:</strong>
                      Die schräg gestellten Hölzer zur Aussteifung. Sichern das Fachwerk gegen parallelogrammartige Verschiebung unter seitlicher Einwirkung.
                    </div>
                  </div>
                </div>

                <div className="bg-[#fcf8f2] p-4 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="text-amber-700" size={16} /> Bauschäden, Fäulnis &amp; Ausfachungsprobleme
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed mb-3">
                    Ein Fachwerk atmet und arbeitet. Historische Gefache wurden traditionell mit einer elastischen, weichen Ausfachung (Flechtwerk mit Stroh-Lehm-Bewurf) versehen. Ein häufiger, folgenschwerer Sanierungsfehler der Nachkriegszeit ist das Ausmauern der Gefache mit harten, zementhaltigen Steinen und Mörteln:
                  </p>
                  <ul className="list-disc pl-5 text-xs text-amber-900 space-y-1.5">
                    <li><strong>Flankenabrisse:</strong> Zementmörtel verbindet sich nicht elastisch mit Holz. Regen dringt in die Haarrisse zwischen Holz und Gefach ein.</li>
                    <li><strong>Feuchtestau:</strong> Zement und Dispersionsfarben behindern die Austrocknung. Das eingedrungene Wasser staut sich am Holzgefüge, was zu rasanter <strong>Schwellenfäule</strong> durch Echten Hausschwamm oder den Braunen Kellerschwamm führt.</li>
                    <li><strong>Insektenbefall:</strong> Feuchtes Holz zieht Schadinsekten wie den Hausbock (Hylotrupes bajulus) oder den Gewöhnlichen Nagekäfer (Anobium punctatum, „Holzwurm“) an, welche die statischen Restquerschnitte aushöhlen.</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold text-slate-900 text-sm mb-2">Holzfeuchtemechanik</h4>
                  <p className="text-xs text-slate-600 mb-2">
                    Holz schwindet und quillt hygroskopisch unterhalb des Fasersättigungsbereichs (<InlineMath math="u \approx 30\%" />). Das differentielle Schwindmaß <InlineMath math="\Delta d" /> einer Holzdimension <InlineMath math="d_0" /> berechnet sich über:
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center my-2">
                    <BlockMath math="\Delta d = d_0 \cdot \alpha \cdot (u_1 - u_2) / 100" />
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Wobei <InlineMath math="\alpha" /> der Schwindbeiwert (% Maßänderung pro 1% Feuchteänderung) und <InlineMath math="u_1, u_2" /> die Holzfeuchten (<InlineMath math="u \le 30\%" />) sind.
                  </span>
                </div>
              </div>

              {/* Interactive Tool Column (Right) */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 h-fit space-y-5">
                <div>
                  <h3 className="font-bold text-slate-950 text-sm flex items-center gap-1.5">
                    <PenTool className="text-shiraz" size={16} /> Holzfeuchte &amp; Schwindungs-Rechner
                  </h3>
                  <p className="text-xs text-slate-600">
                    Berechnen Sie das hygrische Arbeiten und Maßänderungen historischer Holzbauteile beim Austrocknen oder Wiederbefeuchten.
                  </p>
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
                    <label className="text-xs font-semibold text-slate-800 block mb-1">Ausrichtungsrichtung des Holzquerschnitts:</label>
                    <select aria-label="Ausrichtungsrichtung des Holzquerschnitts" 
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
                      <span>Anfangs-Holzfeuchte u₁:</span>
                      <span className="text-shiraz font-bold">{formatDeZahl(moistureInitial, 1)} %</span>
                    </label>
                    <input 
                      type="range" min="6.0" max="40.0" step="1.0" 
                      value={moistureInitial} onChange={(e) => setMoistureInitial(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    />
                    <span className="text-[10px] text-slate-400">Frisches/feuchtes Holz liegt oft bei &gt; 25-30%</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span>Ziel-Holzfeuchte (z.B. Innenraumklima) u₂:</span>
                      <span className="text-shiraz font-bold">{formatDeZahl(moistureFinal, 1)} %</span>
                    </label>
                    <input 
                      type="range" min="6.0" max="24.0" step="1.0" 
                      value={moistureFinal} onChange={(e) => setMoistureFinal(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    />
                    <span className="text-[10px] text-slate-400">Ausgleichsfeuchte im beheizten Wohnraum liegt bei ~ 8-12%</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span>Bauteil-Nennmaß d₀ (Dicke/Höhe):</span>
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
                      <span className="text-slate-500">Effektives Δu unterhalb Sättigung:</span>
                      <span className="font-semibold text-slate-800">{formatDeZahl(shrinkageCalculations.deltaU, 1)} %-Punkte</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Spezifischer Schwindbeiwert α:</span>
                      <span className="font-mono font-semibold text-slate-800">{formatDeZahl(shrinkageCalculations.alpha, 3)} % per 1% u</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Erwartete relative Maßänderung:</span>
                      <span className="font-semibold text-amber-700">{formatDeZahl(shrinkageCalculations.percent, 2)} %</span>
                    </div>

                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                      <div className="flex justify-between items-center text-sm font-bold text-amber-950">
                        <span>Maßänderung (Schwund):</span>
                        <span>{formatDeZahl(shrinkageCalculations.change, 2)} mm</span>
                      </div>
                      <p className="text-[10px] text-amber-800 mt-1 leading-relaxed">
                        Das Bauteil verringert seine Abmessung von ehemals {formatDeWert(dimensionInitial)} mm auf <strong>{formatDeZahl(shrinkageCalculations.finalDim, 1)} mm</strong>. Im Fachwerk führt dieser Schwund zu Spalten an den Verbindungen und Flankenabrissen an Ausfachungen!
                      </p>
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
                    <Layers className="text-shiraz" size={18} /> Historische Deckenkonstruktionen
                  </h3>
                  <p className="text-text-main/80 text-sm leading-relaxed">
                    Decken in Altbauten variieren stark je nach Bauzeitklasse und regionalen Ressourcen. Die statische Ertüchtigung erfordert genaue Materialkenntnisse und das Wissen über den Schichtenaufbau zur Beurteilung des Eigenklimas sowie der Schall- und Brandschutzeigenschaften.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 text-xs">
                    <strong className="text-slate-950 font-bold block mb-1">Holzbalkendecken mit Einschub</strong>
                    <p className="text-slate-700 leading-relaxed">
                      Klassische Decke der Gründerzeit. Tragende Deckenbalken im Abstand von ca. 70-100 cm. Dazwischen liegt auf Fehlboden-Leisten der hölzerne Einschub (Fehlboden), gedeckt mit Lehm-Stroh-Füllung oder trockenem Bauschutt/Sand zur Beschwerung (Luftschalldämpfung).
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 text-xs">
                    <strong className="text-slate-950 font-bold block mb-1">Dippelbalkendecken (Dübelbalken)</strong>
                    <p className="text-slate-700 leading-relaxed">
                      Ganzholzdecken aus dicht an dicht nebeneinander liegenden, zweiseitig abgeflachten Balken, die durch Holzdübel miteinander verbunden sind. Finden sich häufig in barocken Altbauten oder historischen Kornspeichern. Enorm massiv, schwer und hochbelastbar.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 text-xs">
                    <strong className="text-slate-950 font-bold block mb-1">Preußische Kappen (Kappendecke)</strong>
                    <p className="text-slate-700 leading-relaxed">
                      Flach gewölbte Ziegelschalen zwischen stählernen oder gusseisernen I-Trägern. Sie kamen ab ca. 1870 vor allem in feuchtegefährdeten Kellern oder Gewerbebauten zum Einsatz. Erfordern statisch zwingend ein stabiles Randwiderlager oder Zugbänder (Zugbänder).
                    </p>
                  </div>
                </div>

                <div className="bg-[#fcf8f2] p-4 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="text-amber-700" size={16} /> Tragfähigkeitsschwund &amp; Verfallsgefahren
                  </h4>
                  <ul className="list-disc pl-5 text-xs text-amber-900 space-y-1.5">
                    <li><strong>Erlöschen des Auflagerbereichs (Balkenköpfe):</strong> Holzbalkenköpfe liegen oft direkt in kalten Außenmauern. Durch Kondensation der Raumluft fault das Hirnholz unbemerkt ab (Fäulnis im Mauerauflager).</li>
                    <li><strong>Korrosion an I-Trägern bei Kappendecken:</strong> Feuchtigkeit in Kellern lässt die Flansche der Stahlträger rosten. Rost nimmt je nach Oxid das 2- bis 6-fache Volumen des Stahls ein, sprengt die Ziegelkappe ab und destabilisiert das Gewölbe.</li>
                    <li><strong>Durchhang historischer Decken:</strong> Durch jahrzehntelanges Kriechen des Holzes verformen sich Holzbalkendecken massiv plastisch. Das führt zu unebenen Fußböden und Rissen in den Deckenputzen darunter.</li>
                  </ul>
                </div>

                {/* Preussische Kappe Formel */}
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold text-slate-900 text-sm mb-1.5">Gewölbeschub einer Preußischen Kappe</h4>
                  <p className="text-xs text-slate-600 mb-2">
                    Der statische Horizontalschub <InlineMath math="H" /> einer flach gewölbten Kappendecke unter Vollbelastung <InlineMath math="q" /> (kN/m²) je Meter Trägerlänge beträgt:
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center my-2">
                    <BlockMath math="H = \frac{q \cdot a^2}{8 \cdot f}" />
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Wobei <InlineMath math="a" /> der Abstand der Stahlträger (Kappen-Spannweite) und <InlineMath math="f" /> die Stichhöhe des Gewölbes ist.
                  </span>
                </div>
              </div>

              {/* Interactive Tool Column (Right) */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 h-fit space-y-5">
                <div>
                  <h3 className="font-bold text-slate-950 text-sm flex items-center gap-1.5">
                    <PenTool className="text-shiraz" size={16} /> Kappendecken-Schub &amp; Zugband-Rechner
                  </h3>
                  <p className="text-xs text-slate-600">
                    Ermitteln Sie den horizontalen Spreizdruck einer Preußischen Kappe auf die Randträger und berechnen Sie den erforderlichen Querschnitt der stählernen Zugbänder.
                  </p>
                </div>

                {/* Interactive Inputs */}
                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-800 flex justify-between">
                      <span>Abstand der Stahlträger a:</span>
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
                      <span>Spannweite des Trägers s:</span>
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
                      <span>Stichhöhe des Gewölbes f:</span>
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
                      <span>Gesamtlast q (Eigenlast + Füllung + Verkehrslast):</span>
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
                      <span>Durchmesser der runden Zugstangen d_rod:</span>
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
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Lagerkräfte &amp; Zugband-Bemessung:</h4>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Gleichlast auf Träger w:</span>
                      <span className="font-semibold text-slate-800">{formatDeZahl(kappeCalculations.w, 2)} kN/m</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Horizontalschub je Meter Träger:</span>
                      <span className="font-semibold text-red-600">{formatDeZahl(kappeCalculations.thrustPerMeter, 2)} kN/m</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Gesamte Spreizkraft je Feldträger:</span>
                      <span className="font-bold text-red-700">{formatDeZahl(kappeCalculations.totalThrust, 1)} kN</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Tragfähigkeit je Zugstange:</span>
                      <span className="font-semibold text-blue-600">{formatDeZahl(kappeCalculations.capacity, 1)} kN</span>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <div className="flex justify-between items-center text-xs font-bold text-blue-950">
                        <span>Erforderliche Anzahl Zugbänder:</span>
                        <span className="text-sm text-blue-700">{formatDeWert(Math.ceil(kappeCalculations.requiredRods))} Stk.</span>
                      </div>
                      <p className="text-[10px] text-blue-800 mt-1 leading-normal">
                        Für die Trägergesamtlänge von {formatDeZahl(kappeSpan, 1)} m sind mindestens <strong>{formatDeWert(Math.ceil(kappeCalculations.requiredRods))} Zugstangen</strong> Ø {formatDeWert(tieRodDiameter)} mm anzuordnen (historischer Vergleich mit zulässiger Spannung <InlineMath math="\sigma_{zul} = 120\text{ N/mm}^2" /> für Schweißeisen/Flussstahl; ein Nachweis nach Eurocode 3 erfolgt dagegen mit Bemessungslasten und <InlineMath math="f_y/\gamma_{M0}" />, bei Gewindestangen mit dem Spannungsquerschnitt im Gewinde). Zugbänder sind nur in Endfeldern und an freien Rändern erforderlich; in Innenfeldern heben sich die Horizontalschübe benachbarter Kappen weitgehend auf.
                      </p>
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
                    <Landmark className="text-shiraz" size={18} /> Historische Holzdachwerke: Typologie und Tragverhalten
                  </h3>
                  <p className="text-text-main/80 text-sm leading-relaxed">
                    Der historische Zimmermann entwickelte hochkomplexe Systeme zur schadfreien Überbrückung weiter Spannweiten. Grundsätzlich unterscheidet man zwischen zwei statischen Grundsystemen, die bis heute den Großteil des Altbaubestands ausmachen.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sparrendach / Kehlbalkendach */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/20 space-y-3">
                    <div className="flex items-center gap-2 border-b border-home-grau/20 pb-2">
                      <div className="p-1.5 bg-rose-50 text-shiraz rounded-lg">
                        <Layers size={18} />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Das Sparren- &amp; Kehlbalkendach</h4>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Besteht aus dreiecksförmigen Sparrenpaaren (Gebinden), die sich gegenseitig stützen. 
                      Es gibt keine tragenden Pfetten oder Zwischenstützen im Dachraum. Die Sparren leiten neben Vertikallasten auch erhebliche <strong>Spreizkräfte (horizontale Schubkräfte)</strong> am Fußpunkt ein.
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5 text-xs text-slate-600">
                      <strong className="text-slate-800 text-xs block">Tragwirkung &amp; Details:</strong>
                      <ul className="list-disc pl-4 space-y-1">
                        <li><strong>Fußpunktanschluss:</strong> Muss zwingend über einen Deckenbalken geschlossen werden (Zugbandwirkung). Fehlt oder verrottet der Deckenbalkenkopf, drückt das Dach die Traufwände nach außen weg.</li>
                        <li><strong>Kehlbalken:</strong> Verkürzen die Knicklänge der Sparren bei Schnee- und Windlasten und dienen als mittiges Lager.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Pfettendach */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/20 space-y-3">
                    <div className="flex items-center gap-2 border-b border-home-grau/20 pb-2">
                      <div className="p-1.5 bg-rose-50 text-shiraz rounded-lg">
                        <Building2 size={18} />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Das Pfettendach mit Stuhlkonstruktion</h4>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Die Sparren liegen auf horizontal verlaufenden Längshölzern, den <strong>Pfetten</strong> (First-, Mittel-, Fußpfetten), auf. Die Pfetten leiten die Lasten vertikal nach unten ab. Das System ist weitgehend frei von horizontalen Spreizkräften am Traufpunkt.
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5 text-xs text-slate-600">
                      <strong className="text-slate-800 text-xs block">Stuhlkonstruktionen (Stehend &amp; Liegend):</strong>
                      <ul className="list-disc pl-4 space-y-1">
                        <li><strong>Stehender Dachstuhl:</strong> Die Pfetten ruhen auf vertikalen Stuhlsäulen. Diese übertragen erhebliche Einzellasten direkt vertikal in die darunter liegenden tragenden Wände.</li>
                        <li><strong>Liegender Dachstuhl:</strong> Die Stuhlsäulen sind schräg gestellt. Dadurch wird der Dachinnenraum weitgehend stützenfrei gehalten, die Lasten werden an die Außenwände geleitet.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-[#fcf8f2] p-5 rounded-xl border border-amber-200 space-y-3">
                  <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                    <AlertTriangle className="text-amber-700" size={16} /> Bauforschung &amp; Substanzschonende Sanierungsplanung
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Bei der Beurteilung historischer Holzdachwerke sind folgende handwerkliche Eingriffe von hoher Bedeutung für Tragfähigkeit und Denkmalwert:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-amber-100">
                      <strong className="text-slate-950 block mb-1">Abbundzeichen entziffern</strong>
                      <p className="text-slate-600 leading-relaxed">
                        Die eingehauenen römischen Ziffern, Reiß- oder Ritzzeichen dienten dem Zimmermann zum lagegenauen Zusammenbau am Boden. Sie erlauben Rückschlüsse auf Umbauten oder nachträgliche Veränderungen im Tragwerk.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-amber-100">
                      <strong className="text-slate-950 block mb-1">Passgenaue Schäftungen</strong>
                      <p className="text-slate-600 leading-relaxed">
                        Verrottete Balkenabschnitte müssen nicht komplett getauscht werden. Durch zimmermannsmäßige Schäftungen (z. B. schräges Hakenblatt, Jupiterstoß) wird das Holz formschlüssig unter minimalem Materialverlust repariert.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-amber-100">
                      <strong className="text-slate-950 block mb-1">Dendrochronologie</strong>
                      <p className="text-slate-600 leading-relaxed">
                        Das Entnehmen kleiner Bohrkerne zur Analyse der Jahrringbreiten ermöglicht eine jahrgenaue Datierung der Fällung des Bauholzes und liefert wertvolle Nachweise über historische Bauphasen.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* Standardized Module Footer */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Biegespannung in einer Holzbalkendecke um 1900"
        zielGleichung="\sigma_m = \frac{q \cdot l^2 / 8}{b \cdot h^2 / 6}"
        schritte={[
          { titel: 'System', erklaerung: 'Balken 16/22 cm im Abstand 0,80 m, Spannweite 4,50 m; Eigenlast 1,5 kN/m² (mit Schüttung), Nutzlast 2,0 kN/m² (charakteristisch):', formel: 'q = (1{,}5 + 2{,}0) \\cdot 0{,}80 = 2{,}8\\,\\text{kN/m}' },
          { titel: 'Moment und Widerstandsmoment', erklaerung: 'Einfeldträger:', formel: 'M = \\frac{2{,}8 \\cdot 4{,}5^2}{8} = 7{,}09\\,\\text{kNm}, \\quad W = \\frac{160 \\cdot 220^2}{6} = 1{,}29 \\cdot 10^6\\,\\text{mm}^3' },
          { titel: 'Spannung', erklaerung: 'Charakteristische Biegespannung:', formel: '\\sigma_m = \\frac{7{,}09 \\cdot 10^6}{1{,}29 \\cdot 10^6} = 5{,}5\\,\\text{N/mm}^2' }
        ]}
        ergebnisHinweis="Die Biegung ist bei historischen Decken selten maßgebend; kritisch sind Durchbiegung, Schwingungen und Balkenkopffäule im Mauerwerksauflager."
        normQuelle="Technische Mechanik; Nachweis nach DIN EN 1995-1-1 mit NA"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Schwindmaß eines Deckenbalkens nach dem Austrocknen"
        zielGleichung="\Delta b = b \cdot \alpha_t \cdot \Delta u"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Fichte, tangentiale Querschnittsabmessung 220 mm; Einbau mit u = 30 %, Ausgleichsfeuchte im beheizten Gebäude u = 12 %; differentielles Schwindmaß tangential ≈ 0,27 % je % Holzfeuchte (Richtwert, wie im Rechner).', formel: '\\Delta u = 30 - 12 = 18\\,\\%' },
          { titel: 'Schwindmaß', erklaerung: 'Lineare Näherung unterhalb des Fasersättigungsbereichs:', formel: '\\Delta b = 220 \\cdot 0{,}0027 \\cdot 18 = 10{,}7\\,\\text{mm}' }
        ]}
        ergebnisHinweis="Rund 1 cm Schwinden erklärt typische Risse, lockere Verbindungen und Fugen in Fachwerk und Dielenböden. Schwindrisse sind meist unkritisch, Verbindungsmittel sind aber nachzuziehen."
        normQuelle="DIN 68100:2010-07 (Schwind- und Quellmaße)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="historische_bauweisen" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 8 Bestand: Konstruktionsbeispiele und Quellen geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: "Mauerwerk", url: "https://de.wikipedia.org/wiki/Mauerwerk" },
          { title: "Fachwerkhaus", url: "https://de.wikipedia.org/wiki/Fachwerkhaus" },
          { title: "Holzbalkendecke", url: "https://de.wikipedia.org/wiki/Holzbalkendecke" },
          { title: "Kappendecke", url: "https://de.wikipedia.org/wiki/Kappendecke" },
          { title: "Dachwerk", url: "https://de.wikipedia.org/wiki/Dachwerk" }
        ]}
        literatur={[
          "Breymann, G. A.: Allgemeine Bau-Constructions-Lehre, mehrere Bände (ab 1849; Nachdrucke verfügbar).",
          "WTA-Merkblatt 8-1-14/D: Fachwerkinstandsetzung nach WTA I – Bauphysikalische Anforderungen an Fachwerkgebäude (Ausgabe 09.2014)"
        ]}
        regelwerke={[
          { title: "DIN 1053-1:1996-11 (zurückgezogen; Mauerwerk – Berechnung und Ausführung, für Altstatiken relevant)" },
          { title: "WTA-Merkblätter Reihe 8 (Fachwerkinstandsetzung, u. a. Ausfachungen)", url: "https://www.wta-gmbh.de" },
          { title: "DIN 68100:2010-07 (Toleranzsystem für Holzbe- und -verarbeitung – Schwind- und Quellmaße)" },
          { title: "DIN EN 1995-1-1:2010-12 + A2:2014-07 mit NA (Eurocode 5)" }
        ]}
        formeln={[
          {
            formel: "H_G = \\frac{w \\cdot L^2}{8 \\cdot f}",
            erklaerung: "Grundhorizontalschub eines gleichmäßig belasteten dreigelenkigen Gewölbes oder Segmentbogens zur Bemessung der Widerlager.",
            quelle: "Breymann: Baukonstruktionslehre"
          },
          {
            formel: "\\epsilon_{hyg} = \\alpha \\cdot \\Delta u",
            erklaerung: "Hygrische Quell- und Schwindverformung von Holz quer zur Faserrichtung bei Feuchteänderungen unterhalb des Fasersättigungsbereichs.",
            quelle: "DIN 68100 / Holzkunde-Literatur"
          }
        ]}
      />
    </div>
  );
}
