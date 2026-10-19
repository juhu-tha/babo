import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Activity, Ruler, Weight, ShieldAlert, Award, ArrowRight, Zap, RefreshCw, Sparkles } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

// List of preset materials for physical and mechanical properties comparison
interface MaterialPreset {
  name: string;
  eModul: number; // in MPa
  f_yk: number; // Streckgrenze / Zugfestigkeit/ Druckfestigkeit in MPa
  description: string;
}

const MATERIAL_PRESETS: MaterialPreset[] = [
  { name: 'Baustahl (S235)', eModul: 210000, f_yk: 235, description: 'Klassischer Konstruktionsstahl mit hoher Steifigkeit und ausgeprägtem Fließbereichen.' },
  { name: 'Normalbeton (C30/37)', eModul: 33000, f_yk: 30, description: 'Spröder Verbundbaustoff, hohe Druckfestigkeit, aber geringe Zugfestigkeit (ca. 10%).' },
  { name: 'Nadelholz (C24)', eModul: 11000, f_yk: 24, description: 'Anisotroper biologischer Faserwerkstoff. Hohes Verhältnis von E-Modul zu Eigengewicht.' },
  { name: 'Floatglas', eModul: 70000, f_yk: 45, description: 'Amorpher, rein elastischer Werkstoff. Versagt ohne Vorwarnung rein spröde.' },
  { name: 'CFK (Kohlenstofffaser)', eModul: 150000, f_yk: 1200, description: 'Hochleistungswerkstoff mit extrem hoher Zugfestigkeit und geringem Eigengewicht.' },
];

export interface ElastomechanikProps {
  embedMode?: boolean;
}

export default function Elastomechanik({ embedMode = false }: ElastomechanikProps = {}) {
  const [activeTab, setActiveTab] = useState<'spannungen' | 'dehnungen' | 'emodul'>('spannungen');

  // --- Spannungen Tab State ---
  const [forceKn, setForceKn] = useState(150); // kN
  const [shapeInputType, setShapeInputType] = useState<'direct' | 'rectangle' | 'circle'>('rectangle');
  const [directAreaCm2, setDirectAreaCm2] = useState(100); // cm²
  const [rectWidthMm, setRectWidthMm] = useState(100); // mm
  const [rectHeightMm, setRectHeightMm] = useState(200); // mm
  const [circleDiaMm, setCircleDiaMm] = useState(150); // mm

  // Calculated Area in mm² and cm²
  const areaCalculated = useMemo(() => {
    if (shapeInputType === 'direct') {
      return { mm2: directAreaCm2 * 100, cm2: directAreaCm2 };
    } else if (shapeInputType === 'rectangle') {
      const mm2 = rectWidthMm * rectHeightMm;
      return { mm2, cm2: mm2 / 100 };
    } else {
      const mm2 = (Math.PI * Math.pow(circleDiaMm, 2)) / 4;
      return { mm2, cm2: mm2 / 100 };
    }
  }, [shapeInputType, directAreaCm2, rectWidthMm, rectHeightMm, circleDiaMm]);

  // Calculated Stress: σ = F / A
  // F in N, A in mm² => MPa
  const stressMpa = useMemo(() => {
    const forceN = forceKn * 1000;
    if (areaCalculated.mm2 <= 0) return 0;
    return forceN / areaCalculated.mm2;
  }, [forceKn, areaCalculated]);

  // --- Dehnungen Tab State ---
  const [originalLengthM, setOriginalLengthM] = useState(5.0); // m
  const [elongationMm, setElongationMm] = useState(4.5); // mm

  // Calculated Strain ε = Δl / l0
  // ε is unitless, and ofter expressed in ‰ or %
  const strainCalculated = useMemo(() => {
    const l0_mm = originalLengthM * 1000;
    if (l0_mm <= 0) return { raw: 0, permille: 0, percent: 0 };
    const raw = elongationMm / l0_mm;
    return {
      raw,
      permille: raw * 1000,
      percent: raw * 100,
    };
  }, [originalLengthM, elongationMm]);

  // --- E-Modul (Hooke's Law) State ---
  const [selectedMaterialPreset, setSelectedMaterialPreset] = useState<number>(0);
  const [customEModul, setCustomEModul] = useState(210000); // MPa
  const [isCustomMaterial, setIsCustomMaterial] = useState(false);
  const [hookeStrainPermille, setHookeStrainPermille] = useState(1.0); // ‰

  const E_to_use = isCustomMaterial ? customEModul : MATERIAL_PRESETS[selectedMaterialPreset].eModul;
  const stressHooke = useMemo(() => {
    // σ = E * ε, ε is in ‰, so divide by 1000
    const strainRaw = hookeStrainPermille / 1000;
    return E_to_use * strainRaw;
  }, [E_to_use, hookeStrainPermille]);

  const handleSelectPreset = (index: number) => {
    setIsCustomMaterial(false);
    setSelectedMaterialPreset(index);
    // Adjust strain slider if stress exceeds the strength of selected material
    const mat = MATERIAL_PRESETS[index];
    const maxStrainPermille = (mat.f_yk / mat.eModul) * 1000;
    if (hookeStrainPermille > maxStrainPermille) {
      setHookeStrainPermille(Math.round(maxStrainPermille * 10) / 10);
    }
  };

  const handleCustomEChange = (val: number) => {
    setIsCustomMaterial(true);
    setCustomEModul(val);
  };

  return (
    <div className={`space-y-6 ${embedMode ? 'p-1' : ''}`}>
      {/* Header section with branding and overview */}
      {!embedMode && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Activity className="text-shiraz" /> Elastomechanik
          </h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
            <p>
              Grundlagen der Elastomechanik: Spannungen, Dehnungen &amp; Hooke&apos;sches Gesetz. Das mechanische Verhalten von Baustoffen beschreibt, wie ein Körper auf äußere mechanische Belastungen (Kräfte, Verformungen) reagiert. Mithilfe der Grundgrößen <strong>Spannung (<InlineMath math="\sigma" /> oder <InlineMath math="\tau" />)</strong>, <strong>Dehnung (<InlineMath math="\varepsilon" />)</strong> und dem Proportionalitätsfaktor <strong>E-Modul (<InlineMath math="E" />)</strong> lässt sich das Tragverhalten im elastischen Bereich exakt berechnen.
            </p>
          </div>
        </div>
      )}

      {/* Tabs configuration inside layout */}
      <div className="flex flex-wrap gap-2 border-b border-home-grau/20 pb-px">
        <button
          onClick={() => setActiveTab('spannungen')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'spannungen'
              ? 'border-shiraz text-shiraz bg-shiraz/5'
              : 'border-transparent text-text-main/60 hover:text-text-main hover:bg-slate-50'
          }`}
        >
          <Weight className="w-4 h-4" />
          1. Spannungen (Stress)
        </button>
        <button
          onClick={() => setActiveTab('dehnungen')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'dehnungen'
              ? 'border-shiraz text-shiraz bg-shiraz/5'
              : 'border-transparent text-text-main/60 hover:text-text-main hover:bg-slate-50'
          }`}
        >
          <Ruler className="w-4 h-4" />
          2. Dehnungen (Strain)
        </button>
        <button
          onClick={() => setActiveTab('emodul')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'emodul'
              ? 'border-shiraz text-shiraz bg-shiraz/5'
              : 'border-transparent text-text-main/60 hover:text-text-main hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          3. E-Modul & Elastizität (Hooke)
        </button>
      </div>

      {/* Tab 1: Spannungen (Stress) */}
      {activeTab === 'spannungen' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Slider & inputs column */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-805 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-shiraz"></span>
                Was ist eine mechanische Spannung?
              </h2>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Wird ein Bauteil durch eine äußere Kraft belastet, reagiert der Werkstoff mit einer inneren Gegenkraft.
                Die <strong>mechanische Spannung (<InlineMath math="\sigma" />)</strong> gibt diese Belastung bezogen auf die zur Kraftrichtung senkrechte Querschnittsfläche an.
              </p>
              
              <div className="bg-slate-50 p-3 rounded-xl border border-home-grau/25 text-center">
                <BlockMath math="\sigma = \frac{F}{A}" />
                <p className="text-[10px] text-slate-500 mt-1 font-mono">
                  \sigma = Nennspannung [N/mm² = MPa] | F = Normalkraft [N] | A = Querschnittsfläche [mm²]
                </p>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/50 text-[11px] leading-relaxed text-slate-700">
                <span className="font-bold text-indigo-900 block mb-0.5">💡 Normal- vs. Schubspannung:</span>
                • <strong>Normalspannungen (<InlineMath math="\sigma" />):</strong> Wirken senkrecht auf der Schnittfläche (Zug oder Druck).<br/>
                • <strong>Schub- oder Scherspannungen (<InlineMath math="\tau" />):</strong> Wirken tangential in der Schnittebene (z.B. bei Querkraft oder Torsion).
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Interaktiver Spannungsrechner</h3>
              
              <div className="space-y-4">
                {/* Kraft Slider */}
                <Slider 
                  label="Äußere Last / Normalkraft (F)" 
                  min={1} 
                  max={2000} 
                  step={1} 
                  value={forceKn} 
                  unit="kN" 
                  onChange={(e) => setForceKn(Number(e.target.value))} 
                />
                <div className="text-[11px] text-slate-500 italic mt-px pl-2">
                  (= { formatDeWert((forceKn * 1000)) } N | entsprechend dem Gewicht von ca. {formatDeWert(Math.round(forceKn * 1.0197))} Bauarbeitern)
                </div>

                {/* Querschnitts-Geometriewähler */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-text-main/80 block">Querschnittsgeometrie (A):</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setShapeInputType('rectangle')}
                      className={`py-1.5 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                        shapeInputType === 'rectangle'
                          ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Rechteck
                    </button>
                    <button
                      onClick={() => setShapeInputType('circle')}
                      className={`py-1.5 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                        shapeInputType === 'circle'
                          ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Kreis
                    </button>
                    <button
                      onClick={() => setShapeInputType('direct')}
                      className={`py-1.5 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                        shapeInputType === 'direct'
                          ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Fläche (direkt)
                    </button>
                  </div>
                </div>

                {/* Inputs responsive based on selected shape geometry */}
                {shapeInputType === 'rectangle' && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <Slider 
                      label="Breite (b)" 
                      min={10} 
                      max={500} 
                      step={5} 
                      value={rectWidthMm} 
                      unit="mm" 
                      onChange={(e) => setRectWidthMm(Number(e.target.value))} 
                    />
                    <Slider 
                      label="Höhe (h)" 
                      min={10} 
                      max={1000} 
                      step={5} 
                      value={rectHeightMm} 
                      unit="mm" 
                      onChange={(e) => setRectHeightMm(Number(e.target.value))} 
                    />
                  </div>
                )}

                {shapeInputType === 'circle' && (
                  <div className="pt-2">
                    <Slider 
                      label="Durchmesser (d)" 
                      min={10} 
                      max={600} 
                      step={5} 
                      value={circleDiaMm} 
                      unit="mm" 
                      onChange={(e) => setCircleDiaMm(Number(e.target.value))} 
                    />
                  </div>
                )}

                {shapeInputType === 'direct' && (
                  <div className="pt-2">
                    <Slider 
                      label="Fläche (A)" 
                      min={1} 
                      max={2000} 
                      step={10} 
                      value={directAreaCm2} 
                      unit="cm²" 
                      onChange={(e) => setDirectAreaCm2(Number(e.target.value))} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Graphical/result column */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between h-full">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-80s uppercase tracking-wider block">Spannungs-Berechnungsergebnis</h3>
                
                {/* Mathematical result badge */}
                <div className="p-5 bg-shiraz/5 rounded-2xl border border-shiraz/10 text-center space-y-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Vorhandene Normalspannung (σ)</span>
                  <div className="text-4xl font-black text-shiraz tracking-tight font-mono">
                    {formatDeZahl(stressMpa, 2)} <span className="text-lg font-normal">N/mm²</span>
                  </div>
                  <div className="text-xs text-text-main/70">
                    (= {formatDeZahl(stressMpa, 2)} MPa)
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-shiraz/10 text-xs font-mono text-slate-600 bg-white/75 rounded p-2 text-left">
                    <div className="font-bold text-slate-800 mb-1">🔢 Berechnungsschritt:</div>
                    F = {formatDeWert(forceKn)} kN = {formatDeWert((forceKn * 1000))} N <br />
                    A = {formatDeZahl(areaCalculated.mm2, 0)} mm² (= {formatDeZahl(areaCalculated.cm2, 1)} cm²)<br />
                    σ = {formatDeWert((forceKn * 1000))} N / {formatDeZahl(areaCalculated.mm2, 1)} mm² = <span className="text-shiraz font-bold">{formatDeZahl(stressMpa, 2)} N/mm²</span>
                  </div>
                </div>

                {/* Practical comparison table */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Grenzwert-Einordnung bei typischen Baustoffen:</span>
                  <div className="grid grid-cols-1 gap-2 text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50 border border-orange-100">
                      <span>🧱 C25/30 Beton (Druckversagen):</span>
                      <span className="font-mono font-bold text-orange-950">~30 N/mm²</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                      <span>🏗️ S235 Baustahl (Fließen):</span>
                      <span className="font-mono font-bold text-emerald-950">~235 N/mm²</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic SVG illustrating the tension specimen */}
              <div className="bg-slate-50 rounded-xl p-4 border border-home-grau/25 mt-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Visuelle Analogie: Einwirkendes Kraftverhältnis</span>
                <div className="h-28 flex items-center justify-center relative">
                  {/* Anchor block */}
                  <div className="absolute left-4 w-8 h-12 bg-slate-300 rounded border border-slate-400 flex items-center justify-center text-[10px]">Lager</div>
                  {/* Tension Member */}
                  <div className="h-6 bg-amber-100 border-y border-amber-300 transition-all duration-300 relative flex items-center justify-center" style={{ width: '45%' }}>
                    <div className="text-[9px] font-mono text-amber-800">Prüfkörper</div>
                    {/* Interior stress lines */}
                    <div className="absolute inset-0 flex justify-between px-2 items-center opacity-40">
                      <div className="w-px h-full bg-red-600"></div>
                      <div className="w-px h-full bg-red-600"></div>
                      <div className="w-px h-full bg-red-600"></div>
                    </div>
                  </div>
                  {/* Arrow for force */}
                  <div className="flex items-center transition-all duration-300" style={{ transform: `scale(${Math.min(2.0, 0.5 + forceKn / 1000)})` }}>
                    <ArrowRight className="w-8 h-8 text-shiraz" />
                  </div>
                  <div className="absolute right-4 bg-white px-2 py-1 border border-slate-200 rounded text-[10px] shadow-sm font-mono text-shiraz font-bold">
                    F = {formatDeWert(forceKn)} kN
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Dehnungen (Strain) */}
      {activeTab === 'dehnungen' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Slider & inputs column */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-805 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-shiraz"></span>
                Was ist eine mechanische Dehnung?
              </h2>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Unter einer mechanischer Zugbelastung verlängert sich ein Bauteil um die Länge <InlineMath math="\Delta l" />.
                Die <strong>Dehnung (<InlineMath math="\varepsilon" />)</strong> definiert diese relative Längenänderung bezogen auf die Ursprungslänge <InlineMath math="l_0" />.
                Da sich gleichartige Einheiten kürzen (mm/mm), ist die Dehnung <strong>dimensionslos</strong> (wird aber oft in Promille ‰ oder Prozent % angegeben).
              </p>
              
              <div className="bg-slate-50 p-3 rounded-xl border border-home-grau/25 text-center">
                <BlockMath math="\varepsilon = \frac{\Delta l}{l_0}" />
                <p className="text-[10px] text-slate-500 mt-1 font-mono">
                  \varepsilon = Dehnung [- oder ‰] | \Delta l = Längenänderung [mm] | l_0 = Ursprungslänge [mm]
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] leading-relaxed text-amber-950">
                <span className="font-bold block mb-0.5">⚠️ Vorzeichenregel:</span>
                • <strong>Positive Dehnung (<InlineMath math="\varepsilon > 0" />):</strong> Entspricht einer Zugbeanspruchung (Zunahme der Bauteillänge).<br />
                • <strong>Negative Dehnung (<InlineMath math="\varepsilon < 0" />):</strong> Entspricht einer Stauchung (Druckbeanspruchung / Verkürzung).
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Interaktiver Dehnungsrechner</h3>
              
              <div className="space-y-4">
                <Slider 
                  label="Ursprungslänge des Bauteils (l₀)" 
                  min={0.1} 
                  max={25.0} 
                  step={0.1} 
                  value={originalLengthM} 
                  unit="m" 
                  onChange={(e) => setOriginalLengthM(Number(e.target.value))} 
                />
                <div className="text-[11px] text-slate-500 italic mt-px pl-2">
                  (= { formatDeWert((originalLengthM * 1000)) } mm)
                </div>

                <Slider 
                  label="Längenänderung (Δl)" 
                  min={-50} 
                  max={50} 
                  step={0.1} 
                  value={elongationMm} 
                  unit="mm" 
                  onChange={(e) => setElongationMm(Number(e.target.value))} 
                />
                <div className="text-[11px] text-slate-500 italic mt-px pl-2">
                  {elongationMm < 0 ? 'Negative Längenänderung (Stauchung)' : 'Positive Längenänderung (Zug-Verlängerung)'}
                </div>
              </div>
            </div>
          </div>

          {/* Graphical/result column */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between h-full">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-80s uppercase tracking-wider block">Dehnungs-Berechnungsergebnis</h3>
                
                {/* Result box in Shiraz theme */}
                <div className="p-5 bg-shiraz/5 rounded-2xl border border-shiraz/10 text-center space-y-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">
                    {elongationMm < 0 ? 'Errechnete Stauchung' : 'Errechnete Dehnung'} (<InlineMath math="\varepsilon" />)
                  </span>
                  <div className="text-4xl font-black text-shiraz tracking-tight font-mono">
                    {formatDeZahl(strainCalculated.permille, 3)} <span className="text-lg font-normal">‰</span>
                  </div>
                  <div className="text-xs text-text-main/70 grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-shiraz/10 max-w-xs mx-auto">
                    <div>Prozent: <span className="font-bold">{formatDeZahl(strainCalculated.percent, 4)} %</span></div>
                    <div>Dimensionslos: <span className="font-bold font-mono">{strainCalculated.raw.toExponential(3)}</span></div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-shiraz/10 text-xs font-mono text-slate-600 bg-white/75 rounded p-2 text-left">
                    <div className="font-bold text-slate-800 mb-1">🔢 Berechnungsschritt:</div>
                    l₀ = {formatDeWert(originalLengthM)} m = {formatDeWert((originalLengthM * 1000))} mm<br />
                    Δl = {formatDeWert(elongationMm)} mm <br />
                    ε = {formatDeWert(elongationMm)} mm / {formatDeWert((originalLengthM * 1000))} mm = <span className="text-shiraz font-bold">{formatDeZahl(strainCalculated.raw, 6)}</span> = <span className="text-shiraz font-bold">{formatDeZahl(strainCalculated.permille, 3)} ‰</span>
                  </div>
                </div>

                {/* Engineering strain benchmarks */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Dehnungsgrenzwerte im Baustoffbereich:</span>
                  <div className="grid grid-cols-1 gap-2 text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 border border-red-100">
                      <span>🧱 Beton-Druckstauchungsgrenze (<InlineMath math="\varepsilon_{c2}" />):</span>
                      <span className="font-mono font-bold text-red-950">-2,0 ‰ (sprödes Limit)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-pink-50 border border-pink-100">
                      <span>🏗️ Beton-Bruchstauchung (<InlineMath math="\varepsilon_{cu2}" />):</span>
                      <span className="font-mono font-bold text-pink-950">-3,5 ‰ (plastifiziertes Limit)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                      <span>🏗️ Stahldehnung bei Fließgrenze S235 (<InlineMath math="\varepsilon_{yd}" />):</span>
                      <span className="font-mono font-bold text-emerald-950">~1,12 ‰ (elastische Fließgrenze)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic SVG elongation display */}
              <div className="bg-slate-50 rounded-xl p-4 border border-home-grau/25 mt-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Visuelle Elongations-Übertreibung</span>
                <div className="h-16 flex items-center justify-center relative bg-white rounded border border-slate-200">
                  {/* Original outline */}
                  <div className="absolute h-4 border border-dashed border-slate-300 w-2/3 flex items-center justify-center bg-slate-50 opacity-60">
                    <span className="text-[8px] text-slate-400">Ausgangszustand (l₀ = {formatDeZahl(originalLengthM, 1)}m)</span>
                  </div>
                  {/* Stretched specimen */}
                  <div 
                    className={`h-5 transition-all duration-300 border flex items-center justify-center text-[8.5px] font-bold ${
                      elongationMm < 0 
                        ? 'bg-red-100 border-red-400 text-red-800' 
                        : 'bg-emerald-100 border-emerald-400 text-emerald-800'
                    }`}
                    style={{ width: `${Math.max(10, Math.min(95, 66.6 + (elongationMm * 1.5)))}%` }}
                  >
                    <span>Länge neu (+ {formatDeZahl(elongationMm, 1)} mm)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: E-Modul & Elastizität */}
      {activeTab === 'emodul' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preset selection & custom Emodul section */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-805 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-shiraz"></span>
                Das Hooke&apos;sche Gesetz &amp; der E-Modul
              </h2>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Der <strong>Elastizitätsmodul (<InlineMath math="E" />)</strong> beschreibt den proportionalen Zusammenhang zwischen Spannung (<InlineMath math="\sigma" />)
                und Dehnung (<InlineMath math="\varepsilon" />) im elastischen Verformungsbereich. Er ist die Steifigkeits-Kenngröße eines Werkstoffs.
              </p>
              
              <div className="bg-slate-50 p-3 rounded-xl border border-home-grau/25 text-center">
                <BlockMath math="\sigma = E \cdot \varepsilon" />
                <p className="text-[10px] text-slate-500 mt-1 font-mono">
                  \sigma = Elastische Spannung [N/mm²] | E = E-Modul [N/mm² oder MPa] | \varepsilon = Relative Verformung [-]
                </p>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/50 text-[11px] leading-relaxed text-slate-700">
                <span className="font-bold text-indigo-900 block mb-0.5">🧠 Merksatz:</span>
                Je <strong>höher</strong> der E-Modul eines Baustoffs, desto <strong>größer</strong> ist der mechanische Widerstand gegen Verformung (Standsicherheit & Steifigkeit).
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Material-Stiffness Vergleiche</h3>
              
              <div className="grid grid-cols-1 gap-2">
                {MATERIAL_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.name}
                    onClick={() => handleSelectPreset(idx)}
                    className={`p-3 text-left rounded-xl transition-all border text-xs flex flex-col gap-1 ${
                      !isCustomMaterial && selectedMaterialPreset === idx
                        ? 'border-shiraz bg-shiraz/5 text-slate-900 shadow-sm'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-bold">{preset.name}</span>
                      <span className="font-mono font-black text-shiraz whitespace-nowrap bg-white border border-slate-100 rounded px-1.5 py-0.5 text-[10px]">
                        E = {formatDeWert(preset.eModul)} MPa
                      </span>
                    </div>
                    <p className="text-[10px] text-text-main/60">{preset.description}</p>
                  </button>
                ))}
              </div>

              {/* Custom manual parameter controller */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Eigenen E-Modul festlegen:</span>
                  {isCustomMaterial && (
                    <span className="text-[9px] bg-amber-500/10 text-amber-700 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Aktiv</span>
                  )}
                </div>
                <Slider 
                  label="E-Modul (E)" 
                  min={1000} 
                  max={300000} 
                  step={1000} 
                  value={E_to_use} 
                  unit="MPa" 
                  onChange={(e) => handleCustomEChange(Number(e.target.value))} 
                />
              </div>
            </div>
          </div>

          {/* Interactive Result calculations & Hooke Simulation */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between h-full">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-80s uppercase tracking-wider block">Berechnung von Hookes Bereich</h3>
                
                {/* Strain slider for simulation */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <Slider 
                    label="Gewählte Dehnung (ε)" 
                    min={0.1} 
                    max={10.0} 
                    step={0.1} 
                    value={hookeStrainPermille} 
                    unit="‰" 
                    onChange={(e) => setHookeStrainPermille(Number(e.target.value))} 
                  />
                  <div className="text-[10px] text-slate-500 mt-2 italic flex justify-between">
                    <span>(= {formatDeZahl(hookeStrainPermille, 1)} mm Verlängerung pro Meter Länge)</span>
                    <span>= {formatDeZahl((hookeStrainPermille / 1000), 4)} [-]</span>
                  </div>
                </div>

                {/* Computed Hooke Stress representation */}
                <div className="p-5 bg-shiraz/5 rounded-2xl border border-shiraz/10 text-center space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">
                    Errechnete Elastische Spannung (σ)
                  </span>
                  <div className="text-4xl font-black text-shiraz tracking-tight font-mono">
                    {formatDeZahl(stressHooke, 2)} <span className="text-lg font-normal">N/mm²</span>
                  </div>
                  <div className="text-xs text-text-main/70">
                    (= {formatDeZahl(stressHooke, 2)} MPa)
                  </div>

                  <div className="mt-4 pt-3 border-t border-shiraz/10 text-xs font-mono text-slate-600 bg-white/75 rounded p-2 text-left">
                    <div className="font-bold text-slate-800 mb-1">🔢 Berechnungsschritt:</div>
                    E = {formatDeWert(E_to_use)} MPa (N/mm²)<br />
                    ε = {formatDeWert(hookeStrainPermille)} ‰ = {formatDeZahl((hookeStrainPermille / 1000), 4)} <br />
                    σ = {formatDeWert(E_to_use)} · {formatDeZahl((hookeStrainPermille / 1000), 4)} = <span className="text-shiraz font-bold">{formatDeZahl(stressHooke, 2)} N/mm²</span>
                  </div>
                </div>
              </div>

              {/* Stress-strain physical visual illustration via simple react state lines */}
              <div className="bg-slate-50 rounded-xl p-4 border border-home-grau/25 mt-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Graphischer Steifigkeit-Vergleich (σ / ε Steigung)</span>
                
                <div className="h-64 bg-white rounded-lg border border-slate-200 relative p-2 flex items-end">
                  {/* Axis line vertical */}
                  <div className="absolute left-10 top-2 bottom-6 w-0.5 bg-slate-400"></div>
                  {/* Axis line horizontal */}
                  <div className="absolute left-10 bottom-6 right-2 h-0.5 bg-slate-400"></div>

                  {/* Y Axis Label */}
                  <span className="absolute left-2.5 top-2 text-[8px] font-bold text-slate-500 font-mono select-none">σ (MPa)</span>
                  {/* X Axis Label */}
                  <span className="absolute right-2 bottom-1 text-[8px] font-bold text-slate-500 font-mono select-none">ε (‰)</span>

                  {/* Reactive plotting slope representation line */}
                  <svg className="absolute left-10 top-2 right-2 bottom-6 w-[calc(100%-3rem)] h-[calc(100%-2rem)]" overflow="visible">
                    {/* Active material linear elastic line slope */}
                    {/* Max length calculations: we can map the active preset Emodul to slope */}
                    {(() => {
                      // Normalize slope rendering: Emodul = 300000 should represent near vertical, wood 11000 near horizontal
                      const maxPresetE = 300000;
                      const pctStrength = E_to_use / maxPresetE;
                      
                      // Calculate rendering end points
                      const xTarget = 180;
                      // Slope proportional height
                      const yTarget = Math.max(15, Math.min(180, 25 + pctStrength * 145));

                      return (
                        <>
                          {/* Reference lines of predefined common presets */}
                          {MATERIAL_PRESETS.map((p, i) => {
                            const pStrength = p.eModul / maxPresetE;
                            const pY = Math.max(15, Math.min(180, 25 + pStrength * 145));
                            return (
                              <g key={p.name} className="opacity-25 hover:opacity-100 transition-opacity">
                                <line 
                                  x1="0" 
                                  y1="190" 
                                  x2={xTarget} 
                                  y2={190 - pY} 
                                  stroke="#64748b" 
                                  strokeWidth="1.5" 
                                  strokeDasharray="2,2" 
                                />
                                <text x={xTarget + 4} y={190 - pY + 2} className="text-[7.5px] font-mono fill-slate-500">{p.name.split(' ')[0]}</text>
                              </g>
                            );
                          })}

                          {/* Current active line */}
                          <line 
                            x1="0" 
                            y1="190" 
                            x2={xTarget} 
                            y2={190 - yTarget} 
                            stroke="#A3113E" 
                            strokeWidth="3.5" 
                          />
                          
                          {/* Current Strain intersection point circle */}
                          {(() => {
                            const currStrainPct = hookeStrainPermille / 10; // max val is 10
                            const currentX = xTarget * currStrainPct;
                            const currentY = 190 - (yTarget * currStrainPct);
                            
                            return (
                              <g>
                                <circle 
                                  cx={currentX} 
                                  cy={currentY} 
                                  r="5" 
                                  className="fill-shiraz stroke-white stroke-2 animate-pulse" 
                                />
                                <text x={currentX + 8} y={currentY - 4} className="text-[9px] font-bold fill-shiraz font-mono bg-white">
                                  σ = {formatDeZahl(stressHooke, 0)} MPa
                                </text>
                              </g>
                            );
                          })()}
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer information and modules reference */}
      {!embedMode && (
        <ModuleFooter 
          wikipedia={[
            { title: 'Hookesches Gesetz', url: 'https://de.wikipedia.org/wiki/Hookesches_Gesetz' },
            { title: 'Elastizitätsmodul', url: 'https://de.wikipedia.org/wiki/Elastizit%C3%A4tsmodul' },
            { title: 'Poissonzahl', url: 'https://de.wikipedia.org/wiki/Poissonzahl' }
          ]}
          literatur={[
            'Gross, D.; Hauger, W.; Schröder, J.; Wall, W. A. (2021): Technische Mechanik 2: Elastostatik (Springer Vieweg)',
            'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
          ]}
          regelwerke={[
            { title: 'DIN EN 1992-1-1 (Eurocode 2: Bemessung von Stahlbeton- und Spannbetontragwerken)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1992-1-1' },
            { title: 'DIN EN 12390-13 (Prüfung von Festbeton - Teil 13: Bestimmung des Elastizitätsmoduls unter Druckbelastung)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12390-13' }
          ]}
          formeln={[
            {
              formel: '\\sigma = E \\cdot \\varepsilon',
              erklaerung: 'Hookesches Gesetz (eindimensional): Normalspannung sigma ist im linear-elastischen Bereich direkt proportional zur bezogenen Dehnung epsilon über den Elastizitätsmodul E.',
              quelle: 'DIN EN 1992-1-1'
            },
            {
              formel: '\\nu = -\\frac{\\varepsilon_{\\text{quer}}}{\\varepsilon_{\\text{längs}}}',
              erklaerung: 'Querkontraktionszahl (Poissonzahl nu): Verhältnis der relativen Querdehnung zur Längsdehnung unter einachsiger Normalbeanspruchung.',
              quelle: 'DIN EN 12390-13'
            }
          ]}
        />
      )}
    </div>
  );
}
