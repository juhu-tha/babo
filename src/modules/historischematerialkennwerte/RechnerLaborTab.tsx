import type { Dispatch, SetStateAction } from 'react';
import { Settings, CheckCircle, Ruler, BookOpen, Activity, Layers } from 'lucide-react';
import { formatDeZahl, formatDeTeX, formatDeWert } from '@/src/utils/numberFormat';
import { BlockMath, InlineMath } from 'react-katex';
import inhalt from '@/content/historischematerialkennwerte/RechnerLaborTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';
import { altbeton1972, fcdBeton, FCD_MODUL } from '@/src/data/kennwerte';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

// Beispiel 1: Bn 250 aus der gemeinsamen Zuordnungstabelle (Schnell/Fischer/Loch 2008, Tab. 2.2; Entscheidung 29.10.2026, Nachtrag)
const BN250 = altbeton1972('Bn 250')!;
const BN250_FCD = fcdBeton(BN250.fck, FCD_MODUL.historischStandard);

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
        <p><MdText text={inhalt.texte.laborprüfungsBeprobungsauswertungPrüfenS} /></p>
      </div>
    
      {/* Test type selector */}
      <AuswahlGruppe label="Probenart" className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <button {...alsOption(probeType === 'beton_bohrkern')}
          onClick={() => setProbeType('beton_bohrkern')}
          className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border text-sm transition-all ${
                  probeType === 'beton_bohrkern'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-slate-50 text-slate-850 border-home-grau/30 hover:bg-slate-100'
                }`}
        >
          <Activity size={16} /><MdText text={inhalt.texte.betonBohrkerneEc2} /></button>
        <button {...alsOption(probeType === 'mauerwerk_ziegel')}
          onClick={() => setProbeType('mauerwerk_ziegel')}
          className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border text-sm transition-all ${
                  probeType === 'mauerwerk_ziegel'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-slate-50 text-slate-850 border-home-grau/30 hover:bg-slate-100'
                }`}
        >
          <Layers size={16} /><MdText text={inhalt.texte.mauersteineFKEc6} /></button>
        <button {...alsOption(probeType === 'stahl_zugprobe')}
          onClick={() => setProbeType('stahl_zugprobe')}
          className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border text-sm transition-all ${
                  probeType === 'stahl_zugprobe'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-slate-50 text-slate-850 border-home-grau/30 hover:bg-slate-100'
                }`}
        >
          <Ruler size={16} /><MdText text={inhalt.texte.stahlZerreißversuchEc3} /></button>
      </AuswahlGruppe>
    
      {/* TWO-COLUMN LAYOUT: Input and Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        {/* Left Column: Parameter configuration */}
        <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-home-grau/30">
          <h3 className="text-md font-bold text-slate-900 mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-home-grau/30 pb-2">
            <Settings size={18} className="text-shiraz" /><MdText text={inhalt.texte.eingabewerteParameter} /></h3>
    
          {/* 1. BETON BOHRKERN CONTROLS */}
          {probeType === 'beton_bohrkern' && (
            <div className="space-y-5 text-sm">
              <div>
                <label className="block text-xs font-bold text-home-grau uppercase mb-2"><MdText text={inhalt.texte.kernSollDurchmesserD} /></label>
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
                  <span><MdText text={inhalt.texte.längeDesBohrkernsH} /></span>
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
                  <span><MdText text={inhalt.texte.verhältnisHD} /><strong className="font-mono text-text-main">{formatDeZahl((coreHeight / coreDiameter), 2)}</strong></span>
                  <span>300 mm</span>
                </div>
              </div>
    
              <div>
                <div className="flex justify-between text-xs font-bold text-home-grau uppercase mb-2">
                  <span><MdText text={inhalt.texte.prüfkraftZylinderpresseF} /></span>
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
                <label className="block text-xs font-bold text-home-grau uppercase mb-2"><MdText text={inhalt.texte.lagerungFeuchtigkeit} /></label>
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
                      {mode === 'standard' && inhalt.werte.raumklima10}
                      {mode === 'nass' && inhalt.werte.nassWasser109}
                      {mode === 'trocken' && inhalt.werte.ofentrocken092}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-home-grau mt-1 leading-normal"><MdText text={inhalt.texte.ofentrockenerBetonWeistKünstlich} /></p>
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
                      {mode === 'minor' && inhalt.werte.t1Stab104}
                      {mode === 'critical' && inhalt.werte.t2Stäbe110}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-home-grau mt-1 leading-normal"><MdText text={inhalt.texte.stahlstangenSchwächenDieNettodruckfläche} /></p>
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
                <span className="text-xs font-bold text-home-grau block mb-1"><MdText text={inhalt.texte.formatVorschlägeZiegelformat} /></span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => { setBrickWidth(115); setBrickLength(240); setBrickHeight(71); }}
                    className="px-2 py-1 text-xs font-bold bg-off-white hover:bg-home-grau/10 border rounded"
                  ><MdText text={inhalt.texte.nfNormalformat} /></button>
                  <button
                    onClick={() => { setBrickWidth(115); setBrickLength(240); setBrickHeight(52); }}
                    className="px-2 py-1 text-xs font-bold bg-off-white hover:bg-home-grau/10 border rounded"
                  ><MdText text={inhalt.texte.dfDünnformat} /></button>
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
                  <span><MdText text={inhalt.texte.zylinderStempelprüfkraftFC} /></span>
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
                  <span><MdText text={inhalt.texte.mörtelfestigkeitsklasseFM} /></span>
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
                  <span><MdText text={inhalt.texte.m1HistorischerKalkmörtel} /></span>
                  <span><MdText text={inhalt.texte.m50Standard} /></span>
                  <span><MdText text={inhalt.texte.m15Hochfest} /></span>
                </div>
              </div>
            </div>
          )}
    
          {/* 3. STAHL ZUGVERSUCH CONTROLS */}
          {probeType === 'stahl_zugprobe' && (
            <div className="space-y-5 text-sm">
              <div>
                <label className="block text-xs font-bold text-home-grau uppercase mb-2"><MdText text={inhalt.texte.geometrischeFormDerProbe} /></label>
                <AuswahlGruppe label="Form der Probe" className="grid grid-cols-2 gap-2">
                  <button {...alsOption(steelForm === 'round')}
                    onClick={() => setSteelForm('round')}
                    className={`py-2 px-1 rounded-lg text-xs font-bold border transition-colors ${
                            steelForm === 'round'
                              ? 'bg-shiraz/10 text-shiraz border-shiraz'
                              : 'bg-white text-text-main border-home-grau/25'
                          }`}
                  >
                    Rundzylinder-Stab
                  </button>
                  <button {...alsOption(steelForm === 'flat')}
                    onClick={() => setSteelForm('flat')}
                    className={`py-2 px-1 rounded-lg text-xs font-bold border transition-colors ${
                            steelForm === 'flat'
                              ? 'bg-shiraz/10 text-shiraz border-shiraz'
                              : 'bg-white text-text-main border-home-grau/25'
                          }`}
                  >
                    Flach-/Rechteckprobe
                  </button>
                </AuswahlGruppe>
              </div>
    
              {steelForm === 'flat' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-home-grau uppercase mb-1"><MdText text={inhalt.texte.breiteWMm} /></label>
                    <input aria-label={inhalt.werte.breiteWMm}
                      type="number"
                      min="1"
                      max="60"
                      value={steelWidth}
                      onChange={(e) => setSteelWidth(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-white border border-home-grau/25 rounded-lg p-2 text-center font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-home-grau uppercase mb-1"><MdText text={inhalt.texte.dickeTMm} /></label>
                    <input aria-label={inhalt.werte.dickeTMm}
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
                    <span><MdText text={inhalt.texte.nenndurchmesserD} /></span>
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
                  <span><MdText text={inhalt.texte.kraftAnDerStreckgrenze} /></span>
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
                  <span><MdText text={inhalt.texte.zerreißkraftPlastischFM} /></span>
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
                <div className="text-xs text-home-grau text-right mt-1"><MdText text={inhalt.texte.mussÜberDerElastic} /></div>
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
                <span className="text-xs font-bold text-shiraz uppercase tracking-widest block"><MdText text={inhalt.texte.protokollDinEn13791} /></span>
                <div className="px-3 py-1 text-xs font-semibold bg-shiraz/10 text-shiraz rounded-full border border-shiraz/20"><MdText text={inhalt.texte.einzelkernKlasse} /><strong className="font-bold">{coreSeries.valid ? `${coreSeries.cls} (aus n = ${coreSeries.n})` : inhalt.werte.erstAbN3}</strong>
                </div>
              </div>
    
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                  <span className="text-xs font-bold text-home-grau block uppercase"><MdText text={inhalt.texte.nettomessflächeA} /></span>
                  <span className="text-md font-extrabold text-text-main font-mono">{formatDeZahl(calculatedConcrete.areaSqCm, 1)} cm²</span>
                </div>
                <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                  <span className="text-xs font-bold text-home-grau block uppercase"><MdText text={inhalt.texte.bruchspannungFCCore} /></span>
                  <span className="text-md font-extrabold text-text-main font-mono">{formatDeZahl(calculatedConcrete.rawStrengthMpa, 1)} MPa</span>
                </div>
                <div className="bg-shiraz/10 p-3 rounded-xl border border-shiraz/25">
                  <span className="text-xs font-bold text-shiraz block uppercase"><MdText text={inhalt.texte.equivCylinderFIs} /></span>
                  <span className="text-lg font-black text-shiraz font-mono">{formatDeZahl(calculatedConcrete.fIsCyl, 1)} N/mm²</span>
                  <ErgebnisAnsage text={kurzzeile(ansageWert('Bohrkern: Druckfestigkeit', calculatedConcrete.rawStrengthMpa, 1, 'MPa'), ansageWert('Zylinderäquivalent f_is', calculatedConcrete.fIsCyl, 1, 'N/mm²'))} />
                </div>
              </div>
    
              {/* Equations section */}
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-3 font-serif text-sm">
                <h4 className="font-sans font-bold text-xs text-text-main uppercase tracking-wider mb-2"><MdText text={inhalt.texte.rechnerischeZwischenschritteMinderungsko} /></h4>
                <div className="text-[12px] space-y-2 leading-relaxed font-mono text-text-main/90">
                  <div>
                    <span className="font-sans text-home-grau"><MdText text={inhalt.texte.t1Schlankheitskorrektur} /></span>
                    <InlineMath math={`k_{ ratio} = ${formatDeTeX(calculatedConcrete.kRatioToCylinder, 2)}`} /> 
                    <span className="font-sans text-xs text-home-grau ml-1">
                      (h/d = {formatDeZahl(calculatedConcrete.ratioHd, 2)} → {calculatedConcrete.ratioHd >= 2 ? inhalt.werte.kompakterZylinder : inhalt.werte.interpoliertZuZylinderstärke})
                    </span>
                  </div>
                  <div>
                    <span className="font-sans text-home-grau"><MdText text={inhalt.texte.t2Feuchtigkeitskorrektur} /></span>
                    <InlineMath math={`k_{moist} = ${formatDeTeX(calculatedConcrete.kMoist, 2)}`} />
                  </div>
                  <div>
                    <span className="font-sans text-home-grau"><MdText text={inhalt.texte.t3Stahleinlagenminderung} /></span>
                    <InlineMath math={`k_{rebar} = ${formatDeTeX(calculatedConcrete.kRebar, 2)}`} />
                  </div>
                  <div>
                    <span className="font-sans text-home-grau"><MdText text={inhalt.texte.t4MaßstabsfaktorBohrkern} /></span>
                    <InlineMath math={`k_{dia} = ${formatDeTeX(calculatedConcrete.kDia, 2)}`} />
                  </div>
                  <hr className="my-1 border-home-grau/30" />
                  <div className="text-xs pt-1 font-bold text-shiraz">
                    <BlockMath math={`f_{is,cyl} = f_{c,core} \\cdot k_{ratio} \\cdot k_{moist} \\cdot k_{rebar} \\cdot k_{dia} = ${formatDeTeX(calculatedConcrete.fIsCyl, 2)} \\text{ MPa}`} />
                  </div>
                </div>
              </div>
    
              <p className="mt-3 text-[11px] text-home-grau leading-relaxed"><MdText text={inhalt.texte.hinweisDieFaktorenK} /></p>
    
              {/* Stichprobe: charakteristischer Wert und Klasse */}
              <div className="mt-6 border-t pt-4 space-y-3">
                <h4 className="text-xs font-bold text-text-main uppercase"><MdText text={inhalt.texte.stichprobeCharakteristischerWertUnd} /></h4>
                <label className="text-xs text-home-grau block"><MdText text={inhalt.texte.inSituFestigkeitenAller} /><input
                    type="text"
                    value={coreSeriesText}
                    onChange={(e) => setCoreSeriesText(e.target.value)}
                    className="mt-1 w-full p-2 border border-home-grau/30 rounded-lg text-xs font-mono"
                  />
                </label>
                {coreSeries.valid ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-home-grau/5 rounded-lg border border-home-grau/30">
                      <span className="text-xs font-bold text-home-grau block uppercase">n = {coreSeries.n}<MdText text={inhalt.texte.mittelwert} /></span>
                      <div className="text-md font-bold text-text-main">{formatDeZahl(coreSeries.mean, 1)} N/mm²</div>
                    </div>
                    <div className="p-3 bg-home-grau/5 rounded-lg border border-home-grau/30">
                      <span className="text-xs font-bold text-home-grau block uppercase"><MdText text={inhalt.texte.fCkIsK} />{formatDeZahl(coreSeries.kn, 2)})</span>
                      <div className="text-md font-bold text-text-main">{formatDeZahl(coreSeries.fckIs, 1)} N/mm²</div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-250">
                      <span className="text-xs font-bold text-emerald-800 block uppercase"><MdText text={inhalt.texte.fCkFCk} /></span>
                      <div className="text-md font-bold text-emerald-800">{formatDeZahl(coreSeries.fck, 1)} N/mm² → {coreSeries.cls}</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900"><MdText text={inhalt.texte.mindestens3KernwerteEingeben} /></div>
                )}
                <p className="text-[11px] text-home-grau leading-relaxed"><MdText text={inhalt.texte.charakteristischerWertAls5} /></p>
              </div>
            </div>
          )}
    
          {/* 2. MAUERWERK RESULT VIEW */}
          {probeType === 'mauerwerk_ziegel' && (
            <div className="bg-white rounded-2xl border border-shiraz/20 shadow-lg p-6 animate-pulseOnce">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block"><MdText text={inhalt.texte.protokollDinEn772} /></span>
                <div className="px-3 py-1 text-xs font-semibold bg-amber-55/10 text-amber-800 rounded-full border border-amber-800/20"><MdText text={inhalt.texte.normfestigkeitStein} /><strong className="font-bold">{formatDeZahl(calculatedBrick.fB, 1)} N/mm²</strong>
                </div>
              </div>
    
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                  <span className="text-xs font-bold text-home-grau block uppercase"><MdText text={inhalt.texte.druckflächeA} /></span>
                  <span className="text-md font-extrabold text-text-main font-mono">{formatDeZahl((calculatedBrick.areaSqMm / 100), 1)} cm²</span>
                </div>
                <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                  <span className="text-xs font-bold text-home-grau block uppercase"><MdText text={inhalt.texte.mauersteinDruckfestigkeitFP} /></span>
                  <span className="text-md font-extrabold text-text-main font-mono">{formatDeZahl(calculatedBrick.rawStrengthMpa, 1)} MPa</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-amber-300">
                  <span className="text-xs font-bold text-amber-800 block uppercase"><MdText text={inhalt.texte.wanddruckfestigkeitFK} /></span>
                  <span className="text-lg font-black text-amber-800 font-mono">{formatDeZahl(calculatedBrick.fK, 2)} N/mm²</span>
                  <ErgebnisAnsage text={kurzzeile(ansageWert('Mauerstein: Druckfestigkeit', calculatedBrick.rawStrengthMpa, 1, 'MPa'), ansageWert('Wanddruckfestigkeit f_k', calculatedBrick.fK, 2, 'N/mm²'))} />
                </div>
              </div>
    
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-3 font-serif text-sm">
                <h4 className="font-sans font-bold text-xs text-text-main uppercase tracking-wider mb-2"><MdText text={inhalt.texte.rechnerischerAnsatzNachEurocode} /></h4>
                <div className="text-[12px] space-y-2 leading-relaxed font-mono text-text-main/90">
                  <div>
                    <span className="font-sans text-home-grau"><MdText text={inhalt.texte.t1ProbenFormbeiwertD} /></span>
                    <InlineMath math={`d = ${formatDeTeX(calculatedBrick.dFactor, 2)}`} />
                    <span className="font-sans text-xs text-home-grau ml-1">
                      (h / w = {formatDeZahl(calculatedBrick.ratioHw, 2)})
                    </span>
                  </div>
                  <div>
                    <span className="font-sans text-home-grau"><MdText text={inhalt.texte.t2DeklarierteSteinfestigkeitF} /></span>
                    <InlineMath math={`f_b = f_p \\cdot d = ${formatDeTeX(calculatedBrick.fB, 2)} \\text{ MPa}`} />
                  </div>
                  <hr className="my-1 border-home-grau/30" />
                  <div>
                    <span className="font-sans font-bold text-text-main"><MdText text={inhalt.texte.mauerwerkgrundformelMörtelklasseM} />{formatDeWert(mortarStrength)}):</span>
                    <BlockMath math={`f_k = K \\cdot f_b^{0{,}7} \\cdot f_m^{0{,}3} = 0{,}55 \\cdot (${formatDeTeX(calculatedBrick.fB, 2)})^{0{,}7} \\cdot (${formatDeTeX(mortarStrength, 1)})^{0{,}3} = ${formatDeTeX(calculatedBrick.fK, 2)} \\text{ N/mm}^2`} />
                  </div>
                </div>
              </div>
    
              <div className="mt-6 border-t pt-4">
                <h4 className="text-xs font-bold text-text-main uppercase mb-2"><MdText text={inhalt.texte.statischZulässigesSpannungsniveauF} /></h4>
                <div className="p-4 bg-white rounded-xl border border-amber-300 text-sm leading-relaxed text-amber-900"><MdText text={inhalt.texte.bemessungswertDerWandfestigkeit} /><strong className="font-mono font-bold text-md text-amber-950">{formatDeZahl(calculatedBrick.fD, 2)} N/mm²</strong> 
                  <span className="text-xs text-amber-800 block mt-1"><MdText text={inhalt.texte.mitFDZeta} /></span>
                </div>
              </div>
            </div>
          )}
    
          {/* 3. STAHL RESULT VIEW */}
          {probeType === 'stahl_zugprobe' && (
            <div className="bg-white rounded-2xl border border-shiraz/20 shadow-lg p-6 animate-pulseOnce">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-widest block"><MdText text={inhalt.texte.protokollDinEnIso} /></span>
                <div className="px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200"><MdText text={inhalt.texte.klasseEinstufung} /><strong className="font-bold">{calculatedSteel.designation}</strong>
                </div>
              </div>
    
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                  <span className="text-xs font-bold text-home-grau block uppercase"><MdText text={inhalt.texte.probenquerschnittA0} /></span>
                  <span className="text-md font-extrabold text-text-main font-mono">{formatDeZahl(calculatedSteel.areaSqMm, 1)} mm²</span>
                </div>
                <div className="bg-off-white/80 p-3 rounded-xl border border-home-grau/15">
                  <span className="text-xs font-bold text-home-grau block uppercase"><MdText text={inhalt.texte.streckgrenzeREh} /></span>
                  <span className="text-md font-extrabold text-text-main font-mono">{formatDeZahl(calculatedSteel.yieldStrengthMpa, 1)} MPa</span>
                </div>
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200">
                  <span className="text-xs font-bold text-indigo-800 block uppercase"><MdText text={inhalt.texte.zugfestigkeitRM} /></span>
                  <span className="text-lg font-black text-indigo-800 font-mono">{formatDeZahl(calculatedSteel.tensileStrengthMpa, 1)} MPa</span>
                  <ErgebnisAnsage text={kurzzeile(ansageWert('Stahl: Streckgrenze', calculatedSteel.yieldStrengthMpa, 1, 'MPa'), ansageWert('Zugfestigkeit', calculatedSteel.tensileStrengthMpa, 1, 'MPa'))} />
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
                    <span className="font-sans text-home-grau"><MdText text={inhalt.texte.maximaleReißspannungPlastisch} /></span>
                    <InlineMath math={`R_{m} = \\frac{F_m}{A_0} = \\frac{${steelForceTensileKn} \\text{ kN}}{${formatDeTeX(calculatedSteel.areaSqMm, 1)} \\text{ mm}^2} = ${formatDeTeX(calculatedSteel.tensileStrengthMpa, 1)} \\text{ N/mm}^2`} />
                  </div>
                  <hr className="my-1 border-home-grau/30" />
                  <div>
                    <span className="font-sans text-home-grau"><MdText text={inhalt.texte.duktilitätsmaßStreckgrenzenverhältnis} /></span>
                    <InlineMath math={`\\frac{R_{eH}}{R_m} = ${formatDeTeX(calculatedSteel.yieldRatio, 3)}`} />
                    <span className="font-sans text-xs text-home-grau ml-1">
                      (Duktilität {calculatedSteel.yieldRatio <= 0.85 ? inhalt.werte.hochAusreichend : inhalt.werte.achtungSpröde})
                    </span>
                  </div>
                </div>
              </div>
    
              <div className="mt-6 border-t pt-4">
                <h4 className="text-xs font-bold text-text-main uppercase mb-2"><MdText text={inhalt.texte.bemessungsstreckgrenzeEurocode3F} /></h4>
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 text-sm leading-relaxed text-indigo-900"><MdText text={inhalt.texte.bemessungsspannungFürTragfähigkeitsnachw} /><strong className="font-mono font-bold text-md text-indigo-950">{formatDeZahl(calculatedSteel.fYd, 1)} N/mm²</strong> 
                  <span className="text-xs text-indigo-800 block mt-1"><MdText text={inhalt.texte.nachDinEn1993} /></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    
      {/* ----------------- SUBSECTION: THEORY AND MANUAL CALCS ----------------- */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <BookOpen className="text-shiraz" size={20} /><MdText text={inhalt.texte.handrechnungsBeispieleSchrittFür} /></h3>
    
        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
          {/* Example 1: Concrete */}
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <div className="flex items-center gap-2 text-shiraz mb-2">
              <CheckCircle size={16} />
              <h4 className="font-bold text-sm uppercase"><MdText text={inhalt.texte.beispiel1BetonstützeBaujahr} /></h4>
            </div>
            <p className="mb-4"><MdText text={inhalt.texte.einStatikerFindetIn} /></p>
            
            <div className="space-y-3 font-serif pl-2 border-l-2 border-shiraz/40 my-3">
              <div>
                <strong className="font-sans text-xs text-home-grau block uppercase"><MdText text={inhalt.texte.schritt1BestimmungDer} /></strong><MdText text={inhalt.texte.dieAlteKlasseBezieht} /><BlockMath math="\beta_{WN} = 25{,}0 \text{ N/mm}^2 \text{ (auf einen 200 mm Würfel)}" />
              </div>
              <div>
                <strong className="font-sans text-xs text-home-grau block uppercase"><MdText text={inhalt.texte.schritt2UmrechnungAuf} /></strong><MdText text={inhalt.texte.dieAktuellenEurocode2} /><BlockMath math={`f_{ck} \\approx ${formatDeTeX(BN250.fck / BN250.nennfestigkeit, 2)} \\cdot \\beta_{WN} = ${formatDeTeX(BN250.fck, 1)} \\text{ N/mm}^2 \\quad (\\text{Tab. 2.2})`} /><MdText text={inhalt.texte.damitEntsprichtDerBestandsbeton} /></div>
              <div>
                <strong className="font-sans text-xs text-home-grau block uppercase"><MdText text={inhalt.texte.schritt3BerechnungDes} /></strong><MdText text={inhalt.texte.derMaterialspezifischeBemessungswertF} /><BlockMath math={`f_{cd} = \\alpha_{cc} \\cdot \\frac{f_{ck}}{\\gamma_c} = 0{,}85 \\cdot \\frac{${formatDeTeX(BN250.fck, 1)} \\text{ N/mm}^2}{1{,}50} = ${formatDeTeX(BN250_FCD, 2)} \\text{ N/mm}^2`} />
                <span className="font-sans text-xs text-home-grau block mt-1"><MdText text={inhalt.texte.tippWerdenImBestand} /></span>
              </div>
            </div>
          </div>
    
          {/* Example 2: Steel */}
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <div className="flex items-center gap-2 text-shiraz mb-2">
              <CheckCircle size={16} />
              <h4 className="font-bold text-sm uppercase"><MdText text={inhalt.texte.beispiel2AltenStahlträger} /></h4>
            </div>
            <p className="mb-4"><MdText text={inhalt.texte.inEinerDeckeSoll} /></p>
    
            <div className="space-y-3 font-serif pl-2 border-l-2 border-shiraz/40 my-3">
              <div>
                <strong className="font-sans text-xs text-slate-400 block uppercase"><MdText text={inhalt.texte.schritt1ErmittlungDer} /></strong><MdText text={inhalt.texte.zulässigeTragspannungenWurdenHistorisch} /><BlockMath math="f_y = 235 \text{ N/mm}^2 \quad (\text{für Träger-Flanschdicke } t \le 16\text{ mm})" />
              </div>
              <div>
                <strong className="font-sans text-xs text-slate-400 block uppercase"><MdText text={inhalt.texte.schritt2ZuordnungIm} /></strong><MdText text={inhalt.texte.inDinEn10025} /><span className="block mt-1 text-[12px] font-sans text-amber-800"><MdText text={inhalt.texte.achtungOhneMaterialprüfungIst} /></span>
              </div>
              <div>
                <strong className="font-sans text-xs text-slate-400 block uppercase"><MdText text={inhalt.texte.schritt3BemessungswertErmittlung} /></strong><MdText text={inhalt.texte.fürDieTragfähigkeitsnachweiseGilt} /><BlockMath math="f_{yd} = \frac{f_y}{\gamma_{M0}} = \frac{235 \text{ N/mm}^2}{1{,}00} = 235{,}0 \text{ N/mm}^2" />
              </div>
            </div>
          </div>
    
          {/* Example 3: Masonry */}
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <div className="flex items-center gap-2 text-shiraz mb-2">
              <CheckCircle size={16} />
              <h4 className="font-bold text-sm uppercase"><MdText text={inhalt.texte.beispiel3ZiegelwandVon} /></h4>
            </div>
            <p className="mb-4"><MdText text={inhalt.texte.esSollEineTragende} /></p>
    
            <div className="space-y-3 font-serif pl-2 border-l-2 border-shiraz/40 my-3">
              <div>
                <strong className="font-sans text-xs text-slate-400 block uppercase"><MdText text={inhalt.texte.schritt1SteinDruckfestigkeit} /></strong><MdText text={inhalt.texte.durchProbeentnahmenVonDrei} /><BlockMath math="f_b = f_p \cdot d = 15{,}0 \cdot 0{,}82 = 12{,}3 \text{ N/mm}^2" />
              </div>
              <div>
                <strong className="font-sans text-xs text-slate-400 block uppercase"><MdText text={inhalt.texte.schritt2MörtelfestigkeitCharakteristisch} /></strong><MdText text={inhalt.texte.fürDenAltenKalksand} /><BlockMath math="f_k = K \cdot f_b^{0{,}7} \cdot f_m^{0{,}3} = 0{,}55 \cdot (12.3)^{0{,}7} \cdot (2.5)^{0{,}3} = 4{,}19 \text{ N/mm}^2" />
              </div>
              <div>
                <strong className="font-sans text-xs text-slate-400 block uppercase"><MdText text={inhalt.texte.schritt3BemessungswertF} /></strong><MdText text={inhalt.texte.mitDemDauerstandsbeiwertZeta} /><BlockMath math="f_d = \frac{\zeta \cdot f_k}{\gamma_M} = \frac{0{,}85 \cdot 4{,}19}{1{,}5} = 2{,}37 \text{ N/mm}^2" />
                <span className="block text-[12px] font-sans text-slate-500"><MdText text={inhalt.texte.fürBestandsmauerwerkMitKalkmörtel} /></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
