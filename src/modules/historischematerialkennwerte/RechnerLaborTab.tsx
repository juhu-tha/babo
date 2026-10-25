import type { Dispatch, SetStateAction } from 'react';
import { Settings, CheckCircle, Ruler, BookOpen, Activity, Layers } from 'lucide-react';
import { formatDeZahl, formatDeTeX, formatDeWert } from '@/src/utils/numberFormat';
import { BlockMath, InlineMath } from 'react-katex';

type TestProbeType = 'beton_bohrkern' | 'mauerwerk_ziegel' | 'stahl_zugprobe';

export interface RechnerLaborTabProps {
  probeType: TestProbeType;
  setProbeType: Dispatch<SetStateAction<TestProbeType>>;
  setCoreDiameter: Dispatch<SetStateAction<number>>;
  coreHeight: number;
  setCoreHeight: Dispatch<SetStateAction<number>>;
  coreDiameter: number;
  failureForceKn: number;
  setFailureForceKn: Dispatch<SetStateAction<number>>;
  setCoreMoisture: Dispatch<SetStateAction<"standard" | "nass" | "trocken">>;
  coreMoisture: "standard" | "nass" | "trocken";
  setCoreRebar: Dispatch<SetStateAction<"none" | "minor" | "critical">>;
  coreRebar: "none" | "minor" | "critical";
  brickWidth: number;
  setBrickWidth: Dispatch<SetStateAction<number>>;
  brickLength: number;
  setBrickLength: Dispatch<SetStateAction<number>>;
  brickHeight: number;
  setBrickHeight: Dispatch<SetStateAction<number>>;
  brickForceKn: number;
  setBrickForceKn: Dispatch<SetStateAction<number>>;
  mortarStrength: number;
  setMortarStrength: Dispatch<SetStateAction<number>>;
  steelForm: "flat" | "round";
  setSteelForm: Dispatch<SetStateAction<"flat" | "round">>;
  steelWidth: number;
  setSteelWidth: Dispatch<SetStateAction<number>>;
  steelThickness: number;
  setSteelThickness: Dispatch<SetStateAction<number>>;
  steelDiameter: number;
  setSteelDiameter: Dispatch<SetStateAction<number>>;
  steelForceYieldKn: number;
  setSteelForceYieldKn: Dispatch<SetStateAction<number>>;
  steelForceTensileKn: number;
  setSteelForceTensileKn: Dispatch<SetStateAction<number>>;
  coreSeries: { n: number; valid: false; mean?: undefined; fckIs?: undefined; kn?: undefined; fck?: undefined; cls?: undefined; } | { n: number; valid: true; mean: number; fckIs: number; kn: number; fck: number; cls: string; };
  calculatedConcrete: { areaSqMm: number; areaSqCm: number; rawStrengthMpa: number; ratioHd: number; kRatioToCylinder: number; kMoist: number; kRebar: number; kDia: number; fIsCyl: number; fIsCube: number; fCdStandard: number; fCdAssessment: number; classEstimate: string; };
  coreSeriesText: string;
  setCoreSeriesText: Dispatch<SetStateAction<string>>;
  calculatedBrick: { areaSqMm: number; rawStrengthMpa: number; ratioHw: number; dFactor: number; fB: number; fK: number; fD: number; };
  calculatedSteel: { areaSqMm: number; yieldStrengthMpa: number; tensileStrengthMpa: number; yieldRatio: number; fYd: number; designation: string; };
}

export function RechnerLaborTab({ probeType, setProbeType, setCoreDiameter, coreHeight, setCoreHeight, coreDiameter, failureForceKn, setFailureForceKn, setCoreMoisture, coreMoisture, setCoreRebar, coreRebar, brickWidth, setBrickWidth, brickLength, setBrickLength, brickHeight, setBrickHeight, brickForceKn, setBrickForceKn, mortarStrength, setMortarStrength, steelForm, setSteelForm, steelWidth, setSteelWidth, steelThickness, setSteelThickness, steelDiameter, setSteelDiameter, steelForceYieldKn, setSteelForceYieldKn, steelForceTensileKn, setSteelForceTensileKn, coreSeries, calculatedConcrete, coreSeriesText, setCoreSeriesText, calculatedBrick, calculatedSteel }: RechnerLaborTabProps) {
  return (
    <div className="animate-fadeIn">
      {/* Context manual */}
      <div className="text-sm bg-slate-50 text-slate-700 p-4 rounded-xl border border-home-grau/30 mb-8">
        <p>
          <strong>Laborprüfungs- &amp; Beprobungsauswertung:</strong> Prüfen Sie gewonnene Proben aus Bauteilen und überführen Sie diese nach geltenden Normen (z.B. DIN EN 13791 für Bohrkerne, DIN EN 772-1 für Mauersteine und Zugprüfungen nach ISO 6892-1) in charakteristische Kenngrößen.
        </p>
      </div>
    
      {/* Test type selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <button aria-pressed={probeType === 'beton_bohrkern'}
          onClick={() => setProbeType('beton_bohrkern')}
          className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border text-sm transition-all ${
                  probeType === 'beton_bohrkern'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-slate-50 text-slate-850 border-home-grau/30 hover:bg-slate-100'
                }`}
        >
          <Activity size={16} /> Beton-Bohrkerne (EC2)
        </button>
        <button aria-pressed={probeType === 'mauerwerk_ziegel'}
          onClick={() => setProbeType('mauerwerk_ziegel')}
          className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border text-sm transition-all ${
                  probeType === 'mauerwerk_ziegel'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-slate-50 text-slate-850 border-home-grau/30 hover:bg-slate-100'
                }`}
        >
          <Layers size={16} /> Mauersteine &amp; f_k (EC6)
        </button>
        <button aria-pressed={probeType === 'stahl_zugprobe'}
          onClick={() => setProbeType('stahl_zugprobe')}
          className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border text-sm transition-all ${
                  probeType === 'stahl_zugprobe'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-slate-50 text-slate-850 border-home-grau/30 hover:bg-slate-100'
                }`}
        >
          <Ruler size={16} /> Stahl-Zerreißversuch (EC3)
        </button>
      </div>
    
      {/* TWO-COLUMN LAYOUT: Input and Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        {/* Left Column: Parameter configuration */}
        <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-home-grau/30">
          <h3 className="text-md font-bold text-slate-900 mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-home-grau/30 pb-2">
            <Settings size={18} className="text-shiraz" /> Eingabewerte &amp; Parameter
          </h3>
    
          {/* 1. BETON BOHRKERN CONTROLS */}
          {probeType === 'beton_bohrkern' && (
            <div className="space-y-5 text-sm">
              <div>
                <label className="block text-xs font-bold text-home-grau uppercase mb-2">Kern-Soll-Durchmesser (d)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[50, 80, 100, 150].map((dia) => (
                    <button
                      key={dia}
                      onClick={() => {
                        setCoreDiameter(dia);
                        // Auto set core height for proportional 1:1 or 2:1 depending on selection
                        if (coreHeight === 100 && dia === 50) setCoreHeight(50);
                        else if (coreHeight === 100 && dia === 150) setCoreHeight(150);
                      }}
                      className={`py-2 px-1 rounded-lg text-xs font-bold border transition-colors ${
                              coreDiameter === dia
                                ? 'bg-shiraz/10 text-shiraz border-shiraz'
                                : 'bg-white text-text-main border-home-grau/25 hover:bg-home-grau/5'
                            }`}
                    >
                      {formatDeWert(dia)} mm
                    </button>
                  ))}
                </div>
              </div>
    
              <div>
                <div className="flex justify-between text-xs font-bold text-home-grau uppercase mb-2">
                  <span>Länge des Bohrkerns (h)</span>
                  <span className="text-shiraz font-mono">{formatDeWert(coreHeight)} mm</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="5"
                  value={coreHeight}
                  onChange={(e) => setCoreHeight(Number(e.target.value))}
                  className="w-full accent-shiraz"
                />
                <div className="flex justify-between text-xs text-home-grau mt-1">
                  <span>50 mm</span>
                  <span>Verhältnis h/d = <strong className="font-mono text-text-main">{formatDeZahl((coreHeight / coreDiameter), 2)}</strong></span>
                  <span>300 mm</span>
                </div>
              </div>
    
              <div>
                <div className="flex justify-between text-xs font-bold text-home-grau uppercase mb-2">
                  <span>Prüfkraft Zylinderpresse (F)</span>
                  <span className="text-shiraz font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-home-grau/30">{formatDeWert(failureForceKn)} kN</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="800"
                  step="10"
                  value={failureForceKn}
                  onChange={(e) => setFailureForceKn(Number(e.target.value))}
                  className="w-full accent-shiraz"
                />
                <div className="flex justify-between text-xs mt-1 text-home-grau">
                  <span>20 kN</span>
                  <span>Druck-Versagensgrenze</span>
                  <span>800 kN</span>
                </div>
              </div>
    
              <div>
                <label className="block text-xs font-bold text-home-grau uppercase mb-2">Lagerung & Feuchtigkeit</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['standard', 'nass', 'trocken'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setCoreMoisture(mode)}
                      className={`py-2 px-1 rounded-lg text-xs font-bold border transition-colors ${
                              coreMoisture === mode
                                ? 'bg-shiraz/10 text-shiraz border-shiraz'
                                : 'bg-white text-text-main border-home-grau/25 hover:bg-home-grau/5'
                            }`}
                    >
                      {mode === 'standard' && 'Raumklima (1.0)'}
                      {mode === 'nass' && 'Nass / Wasser (1.09)'}
                      {mode === 'trocken' && 'Ofentrocken (0.92)'}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-home-grau mt-1 leading-normal">
                  Ofentrockener Beton weist künstlich höhere Bruchspannungen auf; nasse Proben brechen mechanisch früher.
                </p>
              </div>
    
              <div>
                <label className="block text-xs font-bold text-home-grau uppercase mb-2">Bewehrungskreuzungen</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['none', 'minor', 'critical'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setCoreRebar(mode)}
                      className={`py-2 px-1 rounded-lg text-xs font-bold border transition-colors ${
                              coreRebar === mode
                                ? 'bg-shiraz/10 text-shiraz border-shiraz'
                                : 'bg-white text-text-main border-home-grau/25'
                            }`}
                    >
                      {mode === 'none' && 'Keine (1.0)'}
                      {mode === 'minor' && '1 Stab (1.04)'}
                      {mode === 'critical' && '2 Stäbe (1.10)'}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-home-grau mt-1 leading-normal">
                  Stahlstangen schwächen die Nettodruckfläche des Zylinders. Die ermittelte Last muss rechnerisch korrigiert werden.
                </p>
              </div>
            </div>
          )}
    
          {/* 2. MAUERZIEGEL CONTROLS */}
          {probeType === 'mauerwerk_ziegel' && (
            <div className="space-y-5 text-sm">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-home-grau uppercase mb-1">Breite (w)</label>
                  <input aria-label="Breite (w)"
                    type="number" min="0"
                    value={brickWidth}
                    onChange={(e) => setBrickWidth(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-white border border-home-grau/25 rounded-lg p-2 text-center font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-home-grau uppercase mb-1">Länge (l)</label>
                  <input aria-label="Länge (l)"
                    type="number" min="0"
                    value={brickLength}
                    onChange={(e) => setBrickLength(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-white border border-home-grau/25 rounded-lg p-2 text-center font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-home-grau uppercase mb-1">Höhe (h)</label>
                  <input aria-label="Höhe (h)"
                    type="number" min="0"
                    value={brickHeight}
                    onChange={(e) => setBrickHeight(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-white border border-home-grau/25 rounded-lg p-2 text-center font-semibold font-mono"
                  />
                </div>
              </div>
    
              <div className="bg-white/80 p-3 rounded-lg border border-home-grau/30">
                <span className="text-xs font-bold text-home-grau block mb-1">Format-Vorschläge (Ziegelformat)</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => { setBrickWidth(115); setBrickLength(240); setBrickHeight(71); }}
                    className="px-2 py-1 text-xs font-bold bg-off-white hover:bg-home-grau/10 border rounded"
                  >
                    NF (Normalformat)
                  </button>
                  <button
                    onClick={() => { setBrickWidth(115); setBrickLength(240); setBrickHeight(52); }}
                    className="px-2 py-1 text-xs font-bold bg-off-white hover:bg-home-grau/10 border rounded"
                  >
                    DF (Dünnformat)
                  </button>
                  <button
                    onClick={() => { setBrickWidth(175); setBrickLength(240); setBrickHeight(113); }}
                    className="px-2 py-1 text-xs font-bold bg-off-white hover:bg-home-grau/10 border rounded"
                  >
                    2DF-Format
                  </button>
                </div>
              </div>
    
              <div>
                <div className="flex justify-between text-xs font-bold text-home-grau uppercase mb-2">
                  <span>Zylinder-/Stempelprüfkraft (F_c)</span>
                  <span className="text-shiraz font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-home-grau/30">{formatDeWert(brickForceKn)} kN</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="600"
                  step="10"
                  value={brickForceKn}
                  onChange={(e) => setBrickForceKn(Number(e.target.value))}
                  className="w-full accent-shiraz"
                />
              </div>
    
              <div>
                <div className="flex justify-between text-xs font-bold text-home-grau uppercase mb-2">
                  <span>Mörtelfestigkeitsklasse (f_m)</span>
                  <span className="text-shiraz font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-home-grau/30">{formatDeZahl(mortarStrength, 1)} MPa</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="15.0"
                  step="0.5"
                  value={mortarStrength}
                  onChange={(e) => setMortarStrength(Number(e.target.value))}
                  className="w-full accent-shiraz"
                />
                <div className="flex justify-between text-xs mt-1 text-home-grau">
                  <span>M 1 (historischer Kalkmörtel)</span>
                  <span>M 5.0 (Standard)</span>
                  <span>M 15 (Hochfest)</span>
                </div>
              </div>
            </div>
          )}
    
          {/* 3. STAHL ZUGVERSUCH CONTROLS */}
          {probeType === 'stahl_zugprobe' && (
            <div className="space-y-5 text-sm">
              <div>
                <label className="block text-xs font-bold text-home-grau uppercase mb-2">Geometrische Form der Probe</label>
                <div className="grid grid-cols-2 gap-2">
                  <button aria-pressed={steelForm === 'round'}
                    onClick={() => setSteelForm('round')}
                    className={`py-2 px-1 rounded-lg text-xs font-bold border transition-colors ${
                            steelForm === 'round'
                              ? 'bg-shiraz/10 text-shiraz border-shiraz'
                              : 'bg-white text-text-main border-home-grau/25'
                          }`}
                  >
                    Rundzylinder-Stab
                  </button>
                  <button aria-pressed={steelForm === 'flat'}
                    onClick={() => setSteelForm('flat')}
                    className={`py-2 px-1 rounded-lg text-xs font-bold border transition-colors ${
                            steelForm === 'flat'
                              ? 'bg-shiraz/10 text-shiraz border-shiraz'
                              : 'bg-white text-text-main border-home-grau/25'
                          }`}
                  >
                    Flach-/Rechteckprobe
                  </button>
                </div>
              </div>
    
              {steelForm === 'flat' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-home-grau uppercase mb-1">Breite w (mm)</label>
                    <input aria-label="Breite w (mm)"
                      type="number"
                      min="1"
                      max="60"
                      value={steelWidth}
                      onChange={(e) => setSteelWidth(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-white border border-home-grau/25 rounded-lg p-2 text-center font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-home-grau uppercase mb-1">Dicke t (mm)</label>
                    <input aria-label="Dicke t (mm)"
                      type="number"
                      min="1"
                      max="30"
                      value={steelThickness}
                      onChange={(e) => setSteelThickness(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-white border border-home-grau/25 rounded-lg p-2 text-center font-mono font-bold"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-xs font-bold text-home-grau uppercase mb-2">
                    <span>Nenndurchmesser d</span>
                    <span className="text-shiraz font-mono">{formatDeWert(steelDiameter)} mm</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="32"
                    step="1"
                    value={steelDiameter}
                    onChange={(e) => setSteelDiameter(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                </div>
              )}
    
              <div>
                <div className="flex justify-between text-xs font-bold text-home-grau uppercase mb-2">
                  <span>Kraft an der Streckgrenze (F_eH / F_p0.2)</span>
                  <span className="text-shiraz font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-home-grau/30">{formatDeWert(steelForceYieldKn)} kN</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="250"
                  step="2"
                  value={steelForceYieldKn}
                  onChange={(e) => setSteelForceYieldKn(Number(e.target.value))}
                  className="w-full accent-shiraz"
                />
              </div>
    
              <div>
                <div className="flex justify-between text-xs font-bold text-home-grau uppercase mb-2">
                  <span>Zerreißkraft / Plastisch (F_m)</span>
                  <span className="text-shiraz font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-home-grau/30">{formatDeWert(steelForceTensileKn)} kN</span>
                </div>
                <input
                  type="range"
                  min={steelForceYieldKn + 2}
                  max="350"
                  step="2"
                  value={steelForceTensileKn}
                  onChange={(e) => setSteelForceTensileKn(Math.max(steelForceYieldKn + 1, Number(e.target.value)))}
                  className="w-full accent-shiraz"
                />
                <div className="text-xs text-home-grau text-right mt-1">
                  Muss über der Elastic-Streckgrenze liegen.
                </div>
              </div>
            </div>
          )}
        </div>
    
        {/* Right Column: Calculations writeout and results */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. BETON RESULT VIEW */}
          {probeType === 'beton_bohrkern' && (
            <div className="bg-white rounded-2xl border border-shiraz/20 shadow-lg p-6 animate-pulseOnce">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <span className="text-xs font-bold text-shiraz uppercase tracking-widest block">Protokoll: DIN EN 13791</span>
                <div className="px-3 py-1 text-xs font-semibold bg-shiraz/10 text-shiraz rounded-full border border-shiraz/20">
                  Einzelkern – Klasse: <strong className="font-bold">{coreSeries.valid ? `${coreSeries.cls} (aus n = ${coreSeries.n})` : 'erst ab n ≥ 3'}</strong>
                </div>
              </div>
    
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                  <span className="text-xs font-bold text-home-grau block uppercase">Nettomessfläche A</span>
                  <span className="text-md font-extrabold text-text-main font-mono">{formatDeZahl(calculatedConcrete.areaSqCm, 1)} cm²</span>
                </div>
                <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                  <span className="text-xs font-bold text-home-grau block uppercase">Bruchspannung f_c,core</span>
                  <span className="text-md font-extrabold text-text-main font-mono">{formatDeZahl(calculatedConcrete.rawStrengthMpa, 1)} MPa</span>
                </div>
                <div className="bg-shiraz/10 p-3 rounded-xl border border-shiraz/25">
                  <span className="text-xs font-bold text-shiraz block uppercase">Equiv Cylinder f_is,cyl</span>
                  <span className="text-lg font-black text-shiraz font-mono">{formatDeZahl(calculatedConcrete.fIsCyl, 1)} N/mm²</span>
                </div>
              </div>
    
              {/* Equations section */}
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-3 font-serif text-sm">
                <h4 className="font-sans font-bold text-xs text-text-main uppercase tracking-wider mb-2">Rechnerische Zwischenschritte & Minderungskoeffizienten:</h4>
                <div className="text-[12px] space-y-2 leading-relaxed font-mono text-text-main/90">
                  <div>
                    <span className="font-sans text-home-grau">1. Schlankheitskorrektur: </span>
                    <InlineMath math={`k_{ ratio} = ${formatDeTeX(calculatedConcrete.kRatioToCylinder, 2)}`} /> 
                    <span className="font-sans text-xs text-home-grau ml-1">
                      (h/d = {formatDeZahl(calculatedConcrete.ratioHd, 2)} → {calculatedConcrete.ratioHd >= 2 ? 'Kompakter Zylinder' : 'Interpoliert zu Zylinderstärke'})
                    </span>
                  </div>
                  <div>
                    <span className="font-sans text-home-grau">2. Feuchtigkeitskorrektur: </span>
                    <InlineMath math={`k_{moist} = ${formatDeTeX(calculatedConcrete.kMoist, 2)}`} />
                  </div>
                  <div>
                    <span className="font-sans text-home-grau">3. Stahleinlagenminderung: </span>
                    <InlineMath math={`k_{rebar} = ${formatDeTeX(calculatedConcrete.kRebar, 2)}`} />
                  </div>
                  <div>
                    <span className="font-sans text-home-grau">4. Maßstabsfaktor (Ø-Bohrkern): </span>
                    <InlineMath math={`k_{dia} = ${formatDeTeX(calculatedConcrete.kDia, 2)}`} />
                  </div>
                  <hr className="my-1 border-home-grau/30" />
                  <div className="text-xs pt-1 font-bold text-shiraz">
                    <BlockMath math={`f_{is,cyl} = f_{c,core} \\cdot k_{ratio} \\cdot k_{moist} \\cdot k_{rebar} \\cdot k_{dia} = ${formatDeTeX(calculatedConcrete.fIsCyl, 2)} \\text{ MPa}`} />
                  </div>
                </div>
              </div>
    
              <p className="mt-3 text-[11px] text-home-grau leading-relaxed">
                Hinweis: Die Faktoren k_moist, k_rebar und k_dia stehen nicht in DIN EN 13791 (Literaturwerte, z. B. Concrete Society TR 11 / ACI 214.4R – Quelle prüfen). DIN EN 13791 verlangt bewehrungsfreie Kerne.
              </p>
    
              {/* Stichprobe: charakteristischer Wert und Klasse */}
              <div className="mt-6 border-t pt-4 space-y-3">
                <h4 className="text-xs font-bold text-text-main uppercase">Stichprobe: charakteristischer Wert und Druckfestigkeitsklasse</h4>
                <label className="text-xs text-home-grau block">
                  In-situ-Festigkeiten aller Kerne f_is [N/mm²], getrennt durch Semikolon:
                  <input
                    type="text"
                    value={coreSeriesText}
                    onChange={(e) => setCoreSeriesText(e.target.value)}
                    className="mt-1 w-full p-2 border border-home-grau/30 rounded-lg text-xs font-mono"
                  />
                </label>
                {coreSeries.valid ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-home-grau/5 rounded-lg border border-home-grau/30">
                      <span className="text-xs font-bold text-home-grau block uppercase">n = {coreSeries.n} · Mittelwert</span>
                      <div className="text-md font-bold text-text-main">{formatDeZahl(coreSeries.mean, 1)} N/mm²</div>
                    </div>
                    <div className="p-3 bg-home-grau/5 rounded-lg border border-home-grau/30">
                      <span className="text-xs font-bold text-home-grau block uppercase">f_ck,is (k_n = {formatDeZahl(coreSeries.kn, 2)})</span>
                      <div className="text-md font-bold text-text-main">{formatDeZahl(coreSeries.fckIs, 1)} N/mm²</div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-250">
                      <span className="text-xs font-bold text-emerald-800 block uppercase">f_ck = f_ck,is / 0,85</span>
                      <div className="text-md font-bold text-emerald-800">{formatDeZahl(coreSeries.fck, 1)} N/mm² → {coreSeries.cls}</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                    Mindestens 3 Kernwerte eingeben – aus einem einzelnen Kern darf weder eine Festigkeitsklasse noch ein Bemessungswert abgeleitet werden.
                  </div>
                )}
                <p className="text-[11px] text-home-grau leading-relaxed">
                  Charakteristischer Wert als 5-%-Fraktile (log-normal, V unbekannt) nach DIN EN 1990 Anhang D; Umrechnung auf die Druckfestigkeitsklasse nach DIN EN 13791. Für die verbindliche Bewertung Verfahren und Mindestanzahl der geltenden DIN EN 13791:2020-02 + A20 anwenden.
                </p>
              </div>
            </div>
          )}
    
          {/* 2. MAUERWERK RESULT VIEW */}
          {probeType === 'mauerwerk_ziegel' && (
            <div className="bg-white rounded-2xl border border-shiraz/20 shadow-lg p-6 animate-pulseOnce">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block">Protokoll: DIN EN 772-1 & EC6</span>
                <div className="px-3 py-1 text-xs font-semibold bg-amber-55/10 text-amber-800 rounded-full border border-amber-800/20">
                  Normfestigkeit Stein <strong className="font-bold">{formatDeZahl(calculatedBrick.fB, 1)} N/mm²</strong>
                </div>
              </div>
    
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                  <span className="text-xs font-bold text-home-grau block uppercase">Druckfläche A</span>
                  <span className="text-md font-extrabold text-text-main font-mono">{formatDeZahl((calculatedBrick.areaSqMm / 100), 1)} cm²</span>
                </div>
                <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                  <span className="text-xs font-bold text-home-grau block uppercase">Mauerstein-Druckfestigkeit f_p</span>
                  <span className="text-md font-extrabold text-text-main font-mono">{formatDeZahl(calculatedBrick.rawStrengthMpa, 1)} MPa</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-amber-300">
                  <span className="text-xs font-bold text-amber-800 block uppercase">Wanddruckfestigkeit f_k</span>
                  <span className="text-lg font-black text-amber-800 font-mono">{formatDeZahl(calculatedBrick.fK, 2)} N/mm²</span>
                </div>
              </div>
    
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-3 font-serif text-sm">
                <h4 className="font-sans font-bold text-xs text-text-main uppercase tracking-wider mb-2">Rechnerischer Ansatz nach Eurocode 6 (DIN EN 1996-1-1)</h4>
                <div className="text-[12px] space-y-2 leading-relaxed font-mono text-text-main/90">
                  <div>
                    <span className="font-sans text-home-grau">1. Proben-Formbeiwert d: </span>
                    <InlineMath math={`d = ${formatDeTeX(calculatedBrick.dFactor, 2)}`} />
                    <span className="font-sans text-xs text-home-grau ml-1">
                      (h / w = {formatDeZahl(calculatedBrick.ratioHw, 2)})
                    </span>
                  </div>
                  <div>
                    <span className="font-sans text-home-grau">2. Deklarierte Steinfestigkeit f_b: </span>
                    <InlineMath math={`f_b = f_p \\cdot d = ${formatDeTeX(calculatedBrick.fB, 2)} \\text{ MPa}`} />
                  </div>
                  <hr className="my-1 border-home-grau/30" />
                  <div>
                    <span className="font-sans font-bold text-text-main">Mauerwerkgrundformel (Mörtelklasse M{formatDeWert(mortarStrength)}):</span>
                    <BlockMath math={`f_k = K \\cdot f_b^{0{,}7} \\cdot f_m^{0{,}3} = 0{,}55 \\cdot (${formatDeTeX(calculatedBrick.fB, 2)})^{0{,}7} \\cdot (${formatDeTeX(mortarStrength, 1)})^{0{,}3} = ${formatDeTeX(calculatedBrick.fK, 2)} \\text{ N/mm}^2`} />
                  </div>
                </div>
              </div>
    
              <div className="mt-6 border-t pt-4">
                <h4 className="text-xs font-bold text-text-main uppercase mb-2">Statisch zulässiges Spannungsniveau (<InlineMath math="f_{d} = f_k / \gamma_M" />)</h4>
                <div className="p-4 bg-white rounded-xl border border-amber-300 text-sm leading-relaxed text-amber-900">
                  Bemessungswert der Wandfestigkeit: <strong className="font-mono font-bold text-md text-amber-950">{formatDeZahl(calculatedBrick.fD, 2)} N/mm²</strong> 
                  <span className="text-xs text-amber-800 block mt-1">
                    (Mit <InlineMath math="f_d = \zeta \cdot f_k / \gamma_M" />, <InlineMath math="\zeta = 0{,}85" /> und <InlineMath math="\gamma_M = 1{,}5" /> nach DIN EN 1996-1-1/NA.)
                  </span>
                </div>
              </div>
            </div>
          )}
    
          {/* 3. STAHL RESULT VIEW */}
          {probeType === 'stahl_zugprobe' && (
            <div className="bg-white rounded-2xl border border-shiraz/20 shadow-lg p-6 animate-pulseOnce">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-widest block">Protokoll: DIN EN ISO 6892-1</span>
                <div className="px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                  Klasse Einstufung: <strong className="font-bold">{calculatedSteel.designation}</strong>
                </div>
              </div>
    
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                  <span className="text-xs font-bold text-home-grau block uppercase">Probenquerschnitt A_0</span>
                  <span className="text-md font-extrabold text-text-main font-mono">{formatDeZahl(calculatedSteel.areaSqMm, 1)} mm²</span>
                </div>
                <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                  <span className="text-xs font-bold text-home-grau block uppercase">Streckgrenze R_eH</span>
                  <span className="text-md font-extrabold text-text-main font-mono">{formatDeZahl(calculatedSteel.yieldStrengthMpa, 1)} MPa</span>
                </div>
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200">
                  <span className="text-xs font-bold text-indigo-800 block uppercase">Zugfestigkeit R_m</span>
                  <span className="text-lg font-black text-indigo-800 font-mono">{formatDeZahl(calculatedSteel.tensileStrengthMpa, 1)} MPa</span>
                </div>
              </div>
    
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-3 font-serif text-sm">
                <h4 className="font-sans font-bold text-xs text-text-main uppercase tracking-wider mb-2">Zugprüfungsauswertung:</h4>
                <div className="text-[12px] space-y-2 leading-relaxed font-mono text-text-main/90">
                  <div>
                    <span className="font-sans text-home-grau">Streckgrenze: </span>
                    <InlineMath math={`R_{eH} = \\frac{F_{eH}}{A_0} = \\frac{${steelForceYieldKn} \\text{ kN}}{${formatDeTeX(calculatedSteel.areaSqMm, 1)} \\text{ mm}^2} = ${formatDeTeX(calculatedSteel.yieldStrengthMpa, 1)} \\text{ N/mm}^2`} />
                  </div>
                  <div>
                    <span className="font-sans text-home-grau">Maximale Reißspannung plastisch: </span>
                    <InlineMath math={`R_{m} = \\frac{F_m}{A_0} = \\frac{${steelForceTensileKn} \\text{ kN}}{${formatDeTeX(calculatedSteel.areaSqMm, 1)} \\text{ mm}^2} = ${formatDeTeX(calculatedSteel.tensileStrengthMpa, 1)} \\text{ N/mm}^2`} />
                  </div>
                  <hr className="my-1 border-home-grau/30" />
                  <div>
                    <span className="font-sans text-home-grau">Duktilitätsmaß (Streckgrenzenverhältnis): </span>
                    <InlineMath math={`\\frac{R_{eH}}{R_m} = ${formatDeTeX(calculatedSteel.yieldRatio, 3)}`} />
                    <span className="font-sans text-xs text-home-grau ml-1">
                      (Duktilität {calculatedSteel.yieldRatio <= 0.85 ? 'Hoch / Ausreichend' : 'Achtung: Spröde!'})
                    </span>
                  </div>
                </div>
              </div>
    
              <div className="mt-6 border-t pt-4">
                <h4 className="text-xs font-bold text-text-main uppercase mb-2">Bemessungsstreckgrenze Eurocode 3 (<InlineMath math="f_{yd} = f_y / \gamma_{M0}" />)</h4>
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 text-sm leading-relaxed text-indigo-900">
                  Bemessungsspannung für Tragfähigkeitsnachweise: <strong className="font-mono font-bold text-md text-indigo-950">{formatDeZahl(calculatedSteel.fYd, 1)} N/mm²</strong> 
                  <span className="text-xs text-indigo-800 block mt-1">
                    (Nach DIN EN 1993-1-1 beträgt der Teilsicherheitsbeiwert <InlineMath math="\gamma_{M0} = 1{,}00" />).
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    
      {/* ----------------- SUBSECTION: THEORY AND MANUAL CALCS ----------------- */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <BookOpen className="text-shiraz" size={20} /> Handrechnungs-Beispiele &amp; Schritt-für-Schritt Rechenwege
        </h3>
    
        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
          {/* Example 1: Concrete */}
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <div className="flex items-center gap-2 text-shiraz mb-2">
              <CheckCircle size={16} />
              <h4 className="font-bold text-sm uppercase">Beispiel 1: Betonstütze Baujahr 1974 (Einstufung Bn 250)</h4>
            </div>
            <p className="mb-4">
              Ein Statiker findet in historischen Bauakten eines Bürogebäudes von 1974 eine Betonklassifizierung der Stützpfeiler als <strong>"Bn 250"</strong> nach DIN 1045 (Fassung 1972). Er soll die Stütze mit dem aktuellen Eurocode 2 nachrechnen. Der vollständige Rechenweg gestaltet sich wie folgt:
            </p>
            
            <div className="space-y-3 font-serif pl-2 border-l-2 border-shiraz/40 my-3">
              <div>
                <strong className="font-sans text-xs text-home-grau block uppercase">Schritt 1: Bestimmung der Würfelfestigkeit (alt)</strong>
                Die alte Klasse bezieht sich auf die Würfeldruckfestigkeit <InlineMath math="\beta_{WN}" />. Das Nennmaß Bn 250 garantiert eine 5%-Fraktilfestigkeit von:
                <BlockMath math="\beta_{WN} = 25{,}0 \text{ N/mm}^2 \text{ (auf einen 200 mm Würfel)}" />
              </div>
              <div>
                <strong className="font-sans text-xs text-home-grau block uppercase">Schritt 2: Umrechnung auf standardisierten Zylinder (f_ck)</strong>
                Die aktuellen Eurocode 2 Klassen basieren auf der Zylinderdruckfestigkeit <InlineMath math="f_{ck}" /> (Durchmesser 150 mm/Länge 300 mm). Die Festigkeit verhält sich bei unbeschädigtem Beton konstruktiv wie folgt:
                <BlockMath math="f_{ck} = \beta_{WN} \cdot 0{,}80 = 25{,}0 \cdot 0{,}80 = 20{,}0 \text{ N/mm}^2" />
                Damit entspricht der Bestandsbeton exakt der aktuellen Festigkeitsklasse <strong>C20/25</strong> (<InlineMath math="f_{ck} = 20{,}0 \text{ N/mm}^2, f_{ck,cube} = 25{,}0 \text{ N/mm}^2" />).
              </div>
              <div>
                <strong className="font-sans text-xs text-home-grau block uppercase">Schritt 3: Berechnung des Bemessungswerts (Eurocode 2)</strong>
                Der materialspezifische Bemessungswert <InlineMath math="f_{cd}" /> unter ständigen axialen Druckspannungen wird unter Berücksichtigung des Dauerstandseffekts (<InlineMath math="\alpha_{cc} = 0{,}85" />) ermittelt:
                <BlockMath math="f_{cd} = \alpha_{cc} \cdot \frac{f_{ck}}{\gamma_c} = 0{,}85 \cdot \frac{20{,}0 \text{ N/mm}^2}{1{,}50} = 11{,}33 \text{ N/mm}^2" />
                <span className="font-sans text-xs text-home-grau block mt-1">
                  *Tipp: Werden im Bestand systematisch Bohrkerne entnommen und so die Geometrie und Güte direkt experimentell verifiziert, darf der Sicherheitsfaktor gemindert werden (<InlineMath math="\gamma_c = 1{,}35 \rightarrow f_{cd} = 12{,}59 \text{ N/mm}^2" />).
                </span>
              </div>
            </div>
          </div>
    
          {/* Example 2: Steel */}
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <div className="flex items-center gap-2 text-shiraz mb-2">
              <CheckCircle size={16} />
              <h4 className="font-bold text-sm uppercase">Beispiel 2: Alten Stahlträger nachweisen (Baujahr 1968, St 37-2)</h4>
            </div>
            <p className="mb-4">
              In einer Decke soll ein Profilträger aus Walzstahl mit der Markierung <strong>St 37-2</strong> nach DIN 17100 tragfähig nachgewiesen werden.
            </p>
    
            <div className="space-y-3 font-serif pl-2 border-l-2 border-shiraz/40 my-3">
              <div>
                <strong className="font-sans text-xs text-slate-400 block uppercase">Schritt 1: Ermittlung der alten Normfestigkeiten</strong>
                Zulässige Tragspannungen wurden historisch nach dem globalen System berechnet (<InlineMath math="\sigma_{zul} = 140 \text{ N/mm}^2" />). Zur heutigen Nachrechnung benötigen wir jedoch die charakteristische Fließgrenze <InlineMath math="f_y" />:
                <BlockMath math="f_y = 235 \text{ N/mm}^2 \quad (\text{für Träger-Flanschdicke } t \le 16\text{ mm})" />
              </div>
              <div>
                <strong className="font-sans text-xs text-slate-400 block uppercase">Schritt 2: Zuordnung im Eurocode 3 System</strong>
                In DIN EN 10025-2 entspricht dies der heutigen Standardgüte <strong>S235JR</strong>.
                <span className="block mt-1 text-[12px] font-sans text-amber-800">
                  Achtung: Ohne Materialprüfung ist bei Stählen vor ca. 1970 mit Thomasstahl zu rechnen (Alterung, Sprödbruch, eingeschränkte Schweißeignung). Vor Ansatz von S235 und vor Schweißarbeiten Werkstoffprüfung durchführen (Zugversuch, Kerbschlagarbeit, chemische Analyse).
                </span>
              </div>
              <div>
                <strong className="font-sans text-xs text-slate-400 block uppercase">Schritt 3: Bemessungswert-Ermittlung</strong>
                Für die Tragfähigkeitsnachweise gilt mit Teilsicherheitsbeiwert <InlineMath math="\gamma_{M0} = 1{,}00" />:
                <BlockMath math="f_{yd} = \frac{f_y}{\gamma_{M0}} = \frac{235 \text{ N/mm}^2}{1{,}00} = 235{,}0 \text{ N/mm}^2" />
              </div>
            </div>
          </div>
    
          {/* Example 3: Masonry */}
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <div className="flex items-center gap-2 text-shiraz mb-2">
              <CheckCircle size={16} />
              <h4 className="font-bold text-sm uppercase">Beispiel 3: Ziegelwand von 1920 (Berechnung für Wanddruck)</h4>
            </div>
            <p className="mb-4">
              Es soll eine tragende Altbauwand aus Vollziegeln im Reichsformat (RF) und Kalkmörtel statisch bewertet werden.
            </p>
    
            <div className="space-y-3 font-serif pl-2 border-l-2 border-shiraz/40 my-3">
              <div>
                <strong className="font-sans text-xs text-slate-400 block uppercase">Schritt 1: Stein-Druckfestigkeit &amp; Formbeiwert (DIN EN 772-1)</strong>
                Durch Probeentnahmen von drei unbeschädigten Reichsformat-Mauersteinen im Labor wird das arithmetische Mittel der Druckfestigkeit ermittelt: <InlineMath math="f_p = 15{,}0 \text{ N/mm}^2" />. Das Reichsformat hat ca. h = 65 mm und w = 120 mm (<InlineMath math="h/w = 0{,}54" />). Für eine belastbare Aussage sind mindestens 6 Steine (DIN EN 772-1) und eine Mörtelprüfung erforderlich. Der zugehörige Formfaktor beträgt <InlineMath math="d = 0{,}82" />. Damit lautet die normierte Steinfestigkeit <InlineMath math="f_b" />:
                <BlockMath math="f_b = f_p \cdot d = 15{,}0 \cdot 0{,}82 = 12{,}3 \text{ N/mm}^2" />
              </div>
              <div>
                <strong className="font-sans text-xs text-slate-400 block uppercase">Schritt 2: Mörtelfestigkeit &amp; charakteristische Festigkeit (f_k) nach EC6</strong>
                Für den alten Kalksand-Mörtel (historisch weich, entspr. heute ca. Festigkeitsklasse <InlineMath math="f_m = 2{,}5 \text{ N/mm}^2" />) liefert die empirische EC6-Formel:
                <BlockMath math="f_k = K \cdot f_b^{0{,}7} \cdot f_m^{0{,}3} = 0{,}55 \cdot (12.3)^{0{,}7} \cdot (2.5)^{0{,}3} = 4{,}19 \text{ N/mm}^2" />
              </div>
              <div>
                <strong className="font-sans text-xs text-slate-400 block uppercase">Schritt 3: Bemessungswert (f_d) nach DIN EN 1996-1-1/NA</strong>
                Mit dem Dauerstandsbeiwert <InlineMath math="\zeta = 0{,}85" /> und dem Regelwert <InlineMath math="\gamma_M = 1{,}5" /> (DIN EN 1996-1-1/NA, keine Modifikation) ergibt sich:
                <BlockMath math="f_d = \frac{\zeta \cdot f_k}{\gamma_M} = \frac{0{,}85 \cdot 4{,}19}{1{,}5} = 2{,}37 \text{ N/mm}^2" />
                <span className="block text-[12px] font-sans text-slate-500">Für Bestandsmauerwerk mit Kalkmörtel die Anwendbarkeit der EC6-Formel und die K-Werte des NA prüfen.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
