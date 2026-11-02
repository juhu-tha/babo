import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  Layers, 
  Flame, 
  Hammer, 
  Trees, 
  BookOpen, 
  Calculator, 
  Info, 
  ShieldAlert
} from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath } from 'react-katex';
import inhalt from '@/content/mechanischepruefungen/MechanischePruefungen.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { bohrkernPruefung, spaltzugfestigkeit, marshallQuotient, zugversuchStahl, holzSchaetzung } from '@/src/calc/pruefverfahren';
import { ReiterLeiste, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';

// Define categories of building materials
type MaterialCategory = 'beton_mineralisch' | 'asphalt_bituminoes' | 'stahl_metalle' | 'holz_organisch';

interface TestDetail {
  id: string;
  title: string;
  subtitle: string;
  norm: string;
  material: string;
  proben: string;
  durchfuehrung: string;
  ergebnisse: string;
  kennwerte: string[];
}

export default function MechanischePruefungen() {
  const [activeCategory, setActiveCategory] = useState<MaterialCategory>('beton_mineralisch');
  
  // Active test selection within each category
  const [activeTestMap, setActiveTestMap] = useState<Record<MaterialCategory, string>>({
    beton_mineralisch: 'druck_festigkeit',
    asphalt_bituminoes: 'spaltzug_asphalt',
    stahl_metalle: 'zugversuch_stahl',
    holz_organisch: 'biegeholz'
  });

  const activeTestId = activeTestMap[activeCategory];

  // Map of category-specific definitions and essential test specifications
  const testDirectory: Record<MaterialCategory, TestDetail[]> = inhalt.daten["MechanischePruefungen.testDirectory"];

  const activeTestDetail = useMemo(() => {
    return testDirectory[activeCategory].find(t => t.id === activeTestId) || testDirectory[activeCategory][0];
  }, [activeCategory, activeTestId]);

  // Handler to switch categories
  const handleCategoryChange = (category: MaterialCategory) => {
    setActiveCategory(category);
  };

  // Handler to switch active tests
  const handleTestChange = (testId: string) => {
    setActiveTestMap(prev => ({ ...prev, [activeCategory]: testId }));
  };

  // --- CALCULATOR STATES & CALCULATIONS ---
  
  // 1. Concrete Core Compressive Strength
  const [concreteDiam, setConcreteDiam] = useState<number>(100);
  const [concreteHeight, setConcreteHeight] = useState<number>(100);
  const [concreteForce, setConcreteForce] = useState<number>(350);
  const [concreteRebars, setConcreteRebars] = useState<number>(0);
  const [boreDirection, setBoreDirection] = useState<'vertikal' | 'horizontal'>('vertikal');

  // Rechenkern src/calc/pruefverfahren.ts: Schlankheitsfaktor ASTM C42 (h/d < 1 → NaN „–“, h/d > 2 → 1,0),
  // Lehrfaktoren Bewehrung (+3,5 % je Stab) und Bohrrichtung (BS 1881-120: 1,085); Würfel ↔ Zylinder über die Klassenverhältnisse der Tab. 3.1
  const concreteRes = useMemo(
    () => bohrkernPruefung({ dMm: concreteDiam, hMm: concreteHeight, kraftKn: concreteForce, staebe: concreteRebars, richtung: boreDirection }),
    [concreteDiam, concreteHeight, concreteForce, concreteRebars, boreDirection],
  );

  // 2. Asphalt Testing: Sub-selection & States
  const [asphaltSubTest, setAsphaltSubTest] = useState<'spaltzug' | 'marshall'>('spaltzug');
  
  // A. Asphalt Spaltzug (Indirect tensile)
  const [asphaltDiam, setAsphaltDiam] = useState<number>(100);
  const [asphaltHeight, setAsphaltHeight] = useState<number>(60);
  const [asphaltForce, setAsphaltForce] = useState<number>(16.5);

  const asphaltSt = useMemo(() => spaltzugfestigkeit(asphaltForce, asphaltDiam, asphaltHeight), [asphaltForce, asphaltDiam, asphaltHeight]);

  // B. Asphalt Marshall-Stabilität (Stability & Flow)
  const [marshallStability, setMarshallStability] = useState<number>(9.5);
  const [marshallFlow, setMarshallFlow] = useState<number>(3.2);

  const marshallQ = useMemo(() => marshallQuotient(marshallStability, marshallFlow), [marshallStability, marshallFlow]); // kN/mm

  // 3. Metall/Stahl Tensile Test
  const [steelDiam, setSteelDiam] = useState<number>(12); // Nominaldifferenz
  const [steelForceYield, setSteelForceYield] = useState<number>(58.0); // kN at Re
  const [steelForceUltimate, setSteelForceUltimate] = useState<number>(71.5); // kN at Rm
  const [steelLength0, setSteelLength0] = useState<number>(100); // mm iniziale
  const [steelLengthU, setSteelLengthU] = useState<number>(115); // mm frattura

  // Rechenkern src/calc/pruefverfahren.ts: Einzelwertvergleich mit B500A/B500B nach DIN 488-1
  // (R_e ≥ 500 N/mm²; R_m/R_e ≥ 1,05 bzw. 1,08; A_gt ≥ 2,5 % bzw. 5,0 % aus der Messlänge unter Höchstkraft).
  // Hinweis: Die Norm verlangt charakteristische Werte (Quantile) aus Prüfserien.
  const steelRes = useMemo(() => {
    const r = zugversuchStahl({ dMm: steelDiam, kraftReKn: steelForceYield, kraftRmKn: steelForceUltimate, l0Mm: steelLength0, luMm: steelLengthU });
    const complianceClass = r.einstufung === '–' ? '–' : r.einstufung === 'B500B' ?inhalt.werte.einzelwertErfülltB500bHochduktil
      : r.einstufung === 'B500A' ? inhalt.werte.einzelwertErfülltB500aNormalduktil : inhalt.werte.anforderungenB500aB500bNicht;
    return { ...r, complianceClass };
  }, [steelDiam, steelForceYield, steelForceUltimate, steelLength0, steelLengthU]);

  // 4. Wood Estimator parallel & bending
  const [woodDensity, setWoodDensity] = useState<number>(0.46); // g/cm³
  const [woodMoisture, setWoodMoisture] = useState<number>(12); // %
  const [woodWidth, setWoodWidth] = useState<number>(50); // mm
  const [woodHeight, setWoodHeight] = useState<number>(100); // mm
  const [woodSpan, setWoodSpan] = useState<number>(1800); // mm
  const [woodBendingForce, setWoodBendingForce] = useState<number>(6.5); // kN

  // Rechenkern src/calc/pruefverfahren.ts: Lehr-Näherungen f_c,0 ≈ 90·ρ − 3, Feuchtefaktor (Fasersättigung ≈ 28 %),
  // f_m = F·L/(b·h²) nach DIN EN 408 (4-Punkt-Biegung), E ≈ 25 000·ρ·k_u (kein Ansatz der DIN EN 338).
  // Nur Orientierung: Eine Klassenzuordnung erfordert charakteristische Werte aus Prüfserien (DIN EN 384).
  const woodRes = useMemo(() => {
    const r = holzSchaetzung({ rohdichte: woodDensity, feuchte: woodMoisture, bMm: woodWidth, hMm: woodHeight, stuetzweiteMm: woodSpan, kraftKn: woodBendingForce });
    const klassenText = {
      laubholz: inhalt.werte.laubholzDKlassen, C30: inhalt.werte.niveauC30Einzelwert, C24: inhalt.werte.niveauC24Einzelwert,
      C18: inhalt.werte.niveauC18Einzelwert, unterC18: inhalt.werte.unterC18Einzelwert, '–': '–',
    } as const;
    return { ...r, strengthClassName: klassenText[r.niveau] };
  }, [woodDensity, woodMoisture, woodWidth, woodHeight, woodSpan, woodBendingForce]);


  return (
    <div className="flex flex-col gap-6 w-full text-slate-800 animate-fade-in font-sans">
      
      {/* --- Unified Header: Modern Laboratory Setup --- */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Scale className="text-shiraz" /><MdText text={inhalt.texte.mechanischeZerstörendePrüfungen} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p><MdText text={inhalt.texte.inSituFestigkeitsermittlungQualitätskont} /></p>
        </div>
      </div>

      {/* --- Material Band Category Tabs (Primary Selection) --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-1.5 rounded-xl border border-home-grau/30">
        <button
          onClick={() => handleCategoryChange('beton_mineralisch')}
          className={`px-4 py-3.5 rounded-lg flex items-center justify-center gap-2.5 transition-all text-sm font-bold shadow-xs cursor-pointer ${
            activeCategory === 'beton_mineralisch'
              ? 'bg-shiraz text-white shadow-md'
              : 'bg-white hover:bg-slate-100/80 text-slate-700 border border-home-grau/30'
          }`}
        >
          <Layers size={16} />
          <div className="text-center font-sans tracking-tight">
            <span><MdText text={inhalt.texte.betonMineralisch} /></span>
            <span className="block text-[10px] opacity-75 font-normal"><MdText text={inhalt.texte.t3Standardprüfungen} /></span>
          </div>
        </button>

        <button
          onClick={() => handleCategoryChange('asphalt_bituminoes')}
          className={`px-4 py-3.5 rounded-lg flex items-center justify-center gap-2.5 transition-all text-sm font-bold shadow-xs cursor-pointer ${
            activeCategory === 'asphalt_bituminoes'
              ? 'bg-shiraz text-white shadow-md'
              : 'bg-white hover:bg-slate-100/80 text-slate-700 border border-home-grau/30'
          }`}
        >
          <Flame size={16} />
          <div className="text-center font-sans tracking-tight">
            <span><MdText text={inhalt.texte.asphaltBitumen} /></span>
            <span className="block text-[10px] opacity-75 font-normal"><MdText text={inhalt.texte.t3Standardprüfungen2} /></span>
          </div>
        </button>

        <button
          onClick={() => handleCategoryChange('stahl_metalle')}
          className={`px-4 py-3.5 rounded-lg flex items-center justify-center gap-2.5 transition-all text-sm font-bold shadow-xs cursor-pointer ${
            activeCategory === 'stahl_metalle'
              ? 'bg-shiraz text-white shadow-md'
              : 'bg-white hover:bg-slate-100/80 text-slate-700 border border-home-grau/30'
          }`}
        >
          <Hammer size={16} />
          <div className="text-center font-sans tracking-tight">
            <span><MdText text={inhalt.texte.stahlMetalle} /></span>
            <span className="block text-[10px] opacity-75 font-normal"><MdText text={inhalt.texte.t3Standardprüfungen3} /></span>
          </div>
        </button>

        <button
          onClick={() => handleCategoryChange('holz_organisch')}
          className={`px-4 py-3.5 rounded-lg flex items-center justify-center gap-2.5 transition-all text-sm font-bold shadow-xs cursor-pointer ${
            activeCategory === 'holz_organisch'
              ? 'bg-shiraz text-white shadow-md'
              : 'bg-white hover:bg-slate-100/80 text-slate-700 border border-home-grau/30'
          }`}
        >
          <Trees size={16} />
          <div className="text-center font-sans tracking-tight">
            <span><MdText text={inhalt.texte.holzNaturstoff} /></span>
            <span className="block text-[10px] opacity-75 font-normal"><MdText text={inhalt.texte.t3Standardprüfungen4} /></span>
          </div>
        </button>
      </div>

      {/* --- Alert Info Info Box --- */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-slate-700 leading-relaxed flex gap-3">
        <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Baulabor-Leitfaden:</strong><MdText text={inhalt.texte.mechanischePrüfdatenSindGrundlage} /></div>
      </div>

      {/* --- Main Contents Splitted --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Test Specifications and Standards (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-home-grau/30 p-6 space-y-5">
            
            {/* Sub-Tabs: Test Method Selectors */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono mb-2"><MdText text={inhalt.texte.normverfahrenDieserSparte} /></span>
              <div className="flex gap-2 border-b border-home-grau/30 pb-3 overflow-x-auto">
                {testDirectory[activeCategory].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTestChange(t.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeTestId === t.id
                        ? 'bg-shiraz text-white shadow-sm font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-home-grau/30'
                    }`}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Core Data Display */}
            <div className="space-y-4">
              <div className="border-b border-home-grau/30 pb-3">
                <div className="text-xs uppercase tracking-wider text-shiraz font-bold font-mono">Verfahrensdatenblatt</div>
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
          {activeTestDetail.title}
        </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            {activeTestDetail.subtitle}
          </p>
        </div>
              </div>

              {/* Norm reference */}
              <div className="bg-slate-50 border border-home-grau/30 p-3.5 rounded-lg flex gap-3">
                <BookOpen className="w-5 h-5 text-shiraz shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block font-mono"><MdText text={inhalt.texte.prüfvorschriftNorm} /></span>
                  <span className="text-xs font-bold text-slate-800">{activeTestDetail.norm}</span>
                </div>
              </div>

              {/* Step-by-Step Breakdown */}
              <div className="space-y-3.5 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4">
                  <span className="md:col-span-3 text-xs font-bold text-shiraz uppercase tracking-wider font-mono">Material:</span>
                  <div className="md:col-span-9 text-xs text-slate-700 leading-relaxed font-sans">
                    <FormulaText text={activeTestDetail.material} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 border-t border-home-grau/30 pt-3">
                  <span className="md:col-span-3 text-xs font-bold text-shiraz uppercase tracking-wider font-mono">Probenkörper:</span>
                  <div className="md:col-span-9 text-xs text-slate-700 leading-relaxed font-sans">
                    <FormulaText text={activeTestDetail.proben} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 border-t border-home-grau/30 pt-3">
                  <span className="md:col-span-3 text-xs font-bold text-shiraz uppercase tracking-wider font-mono">Versuchsinhalt:</span>
                  <div className="md:col-span-9 text-xs text-slate-700 leading-relaxed font-sans">
                    <FormulaText text={activeTestDetail.durchfuehrung} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 border-t border-home-grau/30 pt-3">
                  <span className="md:col-span-3 text-xs font-bold text-shiraz uppercase tracking-wider font-mono">Ergebnisse:</span>
                  <div className="md:col-span-9 text-xs text-slate-700 leading-relaxed font-sans">
                    <FormulaText text={activeTestDetail.ergebnisse} />
                  </div>
                </div>
              </div>

              {/* Typical Kennwerte Badge Strip */}
              <div className="pt-4 border-t border-home-grau/30 flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase mr-1">Ausgabekennwerte:</span>
                {activeTestDetail.kennwerte.map((val, idx) => (
                  <span key={idx} className="bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-800 font-sans">
                    ✓ <FormulaText text={val} />
                  </span>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Testing Stand Simulators (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-home-grau/30 p-6 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-home-grau/30 pb-3 mb-5">
                <Calculator className="w-5 h-5 text-shiraz" />
                <h4 className="text-base font-bold text-slate-900 font-sans"><MdText text={inhalt.texte.interaktiverBaustoffPrüfstand} /></h4>
              </div>

              {/* 1. BETON-PRÜFSTAND */}
              {activeCategory === 'beton_mineralisch' && (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-150 font-mono uppercase"><MdText text={inhalt.texte.modusBetondruckKompression} /></div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-750 flex justify-between">
                      <span><MdText text={inhalt.texte.probenDurchmesserDBohrkern} /></span>
                      <span className="text-shiraz font-mono font-bold">{formatDeWert(concreteDiam)} mm</span>
                    </label>
                    <input 
                      type="range" min="50" max="150" step="5" value={concreteDiam}
                      onChange={(e) => setConcreteDiam(Number(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block leading-tight"><MdText text={inhalt.texte.regeldurchmesser100MmOder} /></span>
                  </div>

                  <div className="space-y-1 pt-1.5">
                    <label className="text-xs font-bold text-slate-750 flex justify-between">
                      <span><MdText text={inhalt.texte.probenHöheHPlanhöhe} /></span>
                      <span className="text-shiraz font-mono font-bold">{formatDeWert(concreteHeight)} mm</span>
                    </label>
                    <input 
                      type="range" min="50" max="300" step="5" value={concreteHeight}
                      onChange={(e) => setConcreteHeight(Number(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span><MdText text={inhalt.texte.schlankheitHDPrüfbar} /></span>
                      <strong className="text-slate-700 font-mono">{formatDeZahl((concreteHeight / concreteDiam), 2)}</strong>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1.5">
                    <label className="text-xs font-bold text-slate-750 flex justify-between">
                      <span><MdText text={inhalt.texte.zerstörendeBruchkraftLastspitzeF} /></span>
                      <span className="text-emerald-700 font-mono font-bold">{formatDeWert(concreteForce)} kN</span>
                    </label>
                    <input 
                      type="range" min="50" max="1200" step="10" value={concreteForce}
                      onChange={(e) => setConcreteForce(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-750 font-sans">Bewehrungsstörungen:</label>
                      <select aria-label="Bewehrungsstörungen" 
                        value={concreteRebars}
                        onChange={(e) => setConcreteRebars(Number(e.target.value))}
                        className="w-full border border-home-grau/30 p-2 rounded-lg text-xs bg-slate-50 font-bold focus:outline-none"
                      >
                        <option value="0">Keine Bewehrung</option>
                        <option value="1">1 Stab im Bohrkern (Lehrannahme)</option>
                        <option value="2">2 Stäbe im Bohrkern (Lehrannahme)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-750 font-sans">Bohrrichtung:</label>
                      <select aria-label="Bohrrichtung" 
                        value={boreDirection}
                        onChange={(e) => setBoreDirection(e.target.value as 'vertikal' | 'horizontal')}
                        className="w-full border border-home-grau/30 p-2 rounded-lg text-xs bg-slate-50 font-bold focus:outline-none"
                      >
                        <option value="vertikal">Vertikal (in Betonierrichtung)</option>
                        <option value="horizontal">Horizontal (quer zur Betonierrichtung)</option>
                      </select>
                    </div>
                  </div>

                  {/* Calculated Outputs Beton */}
                  <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl mt-4 space-y-3">
                    <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-widest border-b border-emerald-200 pb-1 font-mono"><MdText text={inhalt.texte.messergebnisseFestbetonwert} /></h5>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs font-sans">
                      <div className="text-slate-500"><MdText text={inhalt.texte.zylinderquerschnittA0} /></div>
                      <div className="font-bold text-right text-slate-800 font-mono">{formatDeZahl((concreteRes.area), 0)} mm²</div>

                      <div className="text-slate-500"><MdText text={inhalt.texte.roheSpannungAmKern} /></div>
                      <div className="font-bold text-right text-slate-800 font-mono">{formatDeZahl(concreteRes.rawStrength, 1)} MPa</div>

                      <div className="text-slate-500 font-bold text-shiraz"><MdText text={inhalt.texte.kernAufHD} /></div>
                      <div className="font-bold text-right text-shiraz font-mono">{formatDeZahl(concreteRes.equivalentCylinder, 1)} N/mm²</div>

                      <div className="text-slate-500 font-bold text-emerald-800"><MdText text={inhalt.texte.würfelwertNäherungFcEq} /></div>
                      <div className="font-bold text-right text-emerald-800 font-mono">{formatDeZahl(concreteRes.equivalentCube, 1)} N/mm²</div>
                    </div>
                    
                    {!Number.isFinite(concreteRes.equivalentCube) ? (
                      <div className="text-[10px] bg-rose-50 text-rose-950 border border-rose-200 px-2 py-1.5 rounded-lg text-center font-bold flex items-center justify-center gap-1.5">
                        <ShieldAlert size={14} className="text-rose-700 shrink-0" /><MdText text={inhalt.texte.hD1Kern} /></div>
                    ) : concreteRes.equivalentCube >= 37 ? (
                      <div className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-200 px-2 py-1.5 rounded-lg text-center font-bold"><MdText text={inhalt.texte.einzelwertImBereichC30} /></div>
                    ) : concreteRes.equivalentCube >= 25 ? (
                      <div className="text-[10px] bg-amber-50 text-amber-950 border border-amber-200 px-2 py-1.5 rounded-lg text-center font-semibold"><MdText text={inhalt.texte.einzelwertImBereichC20} /></div>
                    ) : (
                      <div className="text-[10px] bg-rose-50 text-rose-950 border border-rose-200 px-2 py-1.5 rounded-lg text-center font-bold flex items-center justify-center gap-1.5">
                        <ShieldAlert size={14} className="text-rose-700 shrink-0" /><MdText text={inhalt.texte.einzelwertUnterC2025} /></div>
                    )}
                    {/* h/d < 1 meldet der Kasten oben; hier nur die Warnungen des Rechenkerns */}
                    <EingabeHinweise hinweise={concreteRes.hinweise.filter(h => h.stufe === 'warnung')} />
                  </div>
                </div>
              )}

              {/* 2. ASPHALT-PRÜFSTAND */}
              {activeCategory === 'asphalt_bituminoes' && (
                <div className="space-y-4">
                  {/* Asphalt SubTest Selector Toggle */}
                  <ReiterLeiste label="Asphaltprüfung" className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg border border-home-grau/30">
                    <button {...alsReiter(asphaltSubTest === 'spaltzug', 'asphalt-pruefung', 'spaltzug')}
                      onClick={() => setAsphaltSubTest('spaltzug')}
                      className={`py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                        asphaltSubTest === 'spaltzug' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Spaltzugfestigkeit
                    </button>
                    <button {...alsReiter(asphaltSubTest === 'marshall', 'asphalt-pruefung', 'marshall')}
                      onClick={() => setAsphaltSubTest('marshall')}
                      className={`py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                        asphaltSubTest === 'marshall' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Marshall-Stabilität
                    </button>
                  </ReiterLeiste>

                  {asphaltSubTest === 'spaltzug' ? (
                    <div {...reiterPanel('asphalt-pruefung', asphaltSubTest)} className="space-y-3 pt-1">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-150 font-mono uppercase"><MdText text={inhalt.texte.spaltzugbelastungIndirekt} /></div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-750 flex justify-between">
                          <span><MdText text={inhalt.texte.bohrkernDurchmesserD} /></span>
                          <span className="text-shiraz font-mono font-bold">{formatDeWert(asphaltDiam)} mm</span>
                        </label>
                        <select
                          value={asphaltDiam}
                          onChange={(e) => setAsphaltDiam(Number(e.target.value))}
                          className="w-full border border-home-grau/30 p-2 rounded-lg text-xs bg-slate-50 font-bold focus:outline-none"
                        >
                          <option value="100">d = 100 mm (Typisch für Deckschichten)</option>
                          <option value="150">d = 150 mm (Typisch für Tragschichten)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-750 flex justify-between">
                          <span><MdText text={inhalt.texte.bohrkernDickeHSchichthöhe} /></span>
                          <span className="text-shiraz font-mono font-bold">{formatDeWert(asphaltHeight)} mm</span>
                        </label>
                        <input 
                          type="range" min="30" max="150" step="5" value={asphaltHeight}
                          onChange={(e) => setAsphaltHeight(Number(e.target.value))}
                          className="w-full accent-shiraz cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-750 flex justify-between">
                          <span><MdText text={inhalt.texte.maximaleBelastungskraftP} /></span>
                          <span className="text-emerald-700 font-mono font-bold">{formatDeWert(asphaltForce)} kN</span>
                        </label>
                        <input 
                          type="range" min="2" max="60" step="0.5" value={asphaltForce}
                          onChange={(e) => setAsphaltForce(Number(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer"
                        />
                      </div>

                      {/* Calculations output Spaltzug Asphalt */}
                      <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl mt-4 space-y-2.5 text-xs font-sans">
                        <h5 className="font-bold text-emerald-800 uppercase tracking-widest border-b border-emerald-200 pb-1 font-mono"><MdText text={inhalt.texte.ergebnisseIndirekterZugversuch} /></h5>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500"><MdText text={inhalt.texte.dickeDurchmesserVerhältnisH} /></span>
                          <span className="font-bold font-mono text-slate-800">{formatDeZahl((asphaltHeight / asphaltDiam), 2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-emerald-100">
                          <span className="text-slate-500 font-bold"><MdText text={inhalt.texte.spaltzugfestigkeitSt} /></span>
                          <span className="font-bold font-mono text-shiraz text-sm">{formatDeZahl(asphaltSt, 2)} MPa</span>
                        </div>
                        <div className="bg-slate-100 p-2 rounded text-[10px] text-slate-700 leading-normal font-semibold text-center">
                          {asphaltSt > 2.2 ? (
                            <span className="text-emerald-800"><MdText text={inhalt.texte.hoherWertSteifesMischgut} /></span>
                          ) : asphaltSt < 1.0 ? (
                            <span className="text-rose-800 font-bold"><MdText text={inhalt.texte.niedrigerWertGeringerZusammenhalt} /></span>
                          ) : (
                            <span className="text-slate-800"><MdText text={inhalt.texte.mittlererBereichBewertungNur} /></span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Marshall-Stabilität Rechner
                    <div {...reiterPanel('asphalt-pruefung', asphaltSubTest)} className="space-y-3 pt-1">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-150 font-mono uppercase"><MdText text={inhalt.texte.marshallKompressionBei60} /></div>

                      <div className="bg-white text-slate-850 border border-slate-200 p-2.5 rounded-lg text-[10.5px] leading-snug flex gap-2">
                        <Info size={14} className="text-amber-700 shrink-0 mt-0.5" />
                        <span><MdText text={inhalt.texte.wasserbad601C} /></span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-750 flex justify-between">
                          <span><MdText text={inhalt.texte.marshallStabilitätSBruchlast} /></span>
                          <span className="text-shiraz font-mono font-bold">{formatDeWert(marshallStability)} kN</span>
                        </label>
                        <input 
                          type="range" min="2.0" max="25.0" step="0.5" value={marshallStability}
                          onChange={(e) => setMarshallStability(Number(e.target.value))}
                          className="w-full accent-shiraz cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.orientierungswerteAusDerLiteratur} /></span>
                      </div>

                      <div className="space-y-1 pt-1">
                        <label className="text-xs font-bold text-slate-750 flex justify-between">
                          <span><MdText text={inhalt.texte.prüfFließwertFStauchung} /></span>
                          <span className="text-emerald-700 font-mono font-bold">{formatDeWert(marshallFlow)} mm</span>
                        </label>
                        <input 
                          type="range" min="0.5" max="8.0" step="0.1" value={marshallFlow}
                          onChange={(e) => setMarshallFlow(Number(e.target.value))}
                          className="w-full accent-shiraz cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.typischeFließwerteLiegenEtwa} /></span>
                      </div>

                      {/* Calculations output Marshall */}
                      <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl mt-4 space-y-2.5 text-xs font-sans">
                        <h5 className="font-bold text-shiraz uppercase tracking-widest border-b border-home-grau/20 pb-1 font-mono"><MdText text={inhalt.texte.ergebnisseMarshallprüfung} /></h5>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500"><MdText text={inhalt.texte.stabilitätS} /></span>
                          <span className="font-bold font-mono text-slate-800">{formatDeZahl(marshallStability, 1)} kN</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Fließwert <InlineMath math="F" />:</span>
                          <span className="font-bold font-mono text-slate-800">{formatDeZahl(marshallFlow, 1)} mm</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-home-grau/20">
                          <span className="text-slate-500 font-bold text-shiraz"><MdText text={inhalt.texte.marshallQuotientQS} /></span>
                          <span className="font-bold font-mono text-shiraz text-sm">{formatDeZahl(marshallQ, 2)} kN/mm</span>
                        </div>
                        <div className="bg-slate-100 p-2 rounded text-[10px] text-slate-700 leading-normal font-semibold text-center">
                          {marshallQ > 4.5 ? (
                            <span className="text-red-900 font-bold block"><MdText text={inhalt.texte.hoherQuotientSehrSteifes} /></span>
                          ) : marshallQ < 1.5 ? (
                            <span className="text-amber-900 font-bold block"><MdText text={inhalt.texte.niedrigerQuotientPlastischesMischgut} /></span>
                          ) : (
                            <span className="text-emerald-900 font-bold block"><MdText text={inhalt.texte.mittlererBereichOrientierungMaßgebend} /></span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. METALL/STAHL-PRÜFSTAND */}
              {activeCategory === 'stahl_metalle' && (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-150 font-mono uppercase"><MdText text={inhalt.texte.modusBetonstahlZerreißprüfung} /></div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-750 font-sans"><MdText text={inhalt.texte.nennDurchmesserD} /></label>
                      <select aria-label={inhalt.werte.nennDurchmesserD} 
                        value={steelDiam}
                        onChange={(e) => setSteelDiam(Number(e.target.value))}
                        className="w-full border border-home-grau/30 p-2 rounded-lg text-xs bg-slate-50 font-bold focus:outline-none"
                      >
                        <option value="8">d = 8 mm</option>
                        <option value="10">d = 10 mm</option>
                        <option value="12">d = 12 mm</option>
                        <option value="14">d = 14 mm</option>
                        <option value="16">d = 16 mm</option>
                        <option value="20">d = 20 mm</option>
                        <option value="25">d = 25 mm</option>
                        <option value="28">d = 28 mm</option>
                        <option value="32">d = 32 mm</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-750 flex justify-between">
                        <span>Anfangs-L0:</span>
                        <span className="text-slate-600 font-mono font-bold">{formatDeWert(steelLength0)} mm</span>
                      </label>
                      <input 
                        type="number" min="0"
                        value={steelLength0}
                        onChange={(e) => setSteelLength0(Math.max(10, Number(e.target.value)))}
                        className="w-full border border-home-grau/30 p-1 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-shiraz text-center bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-slate-750 flex justify-between">
                      <span><MdText text={inhalt.texte.kraftAnDerStreckgrenze} /></span>
                      <span className="text-shiraz font-mono font-bold">{formatDeZahl(steelForceYield, 1)} kN</span>
                    </label>
                    <input 
                      type="range" min="10" max="400" step="1" value={steelForceYield}
                      onChange={(e) => {
                        setSteelForceYield(Number(e.target.value));
                        // ultimate strength must be higher than yield strength always
                        if (steelForceUltimate < Number(e.target.value) + 2) {
                          setSteelForceUltimate(Number(e.target.value) + 5);
                        }
                      }}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-slate-750 flex justify-between">
                      <span><MdText text={inhalt.texte.höchstkraftFM} /></span>
                      <span className="text-emerald-700 font-mono font-bold">{formatDeZahl(steelForceUltimate, 1)} kN</span>
                    </label>
                    <input 
                      type="range" min="12" max="500" step="1" value={steelForceUltimate}
                      onChange={(e) => setSteelForceUltimate(Math.max(steelForceYield + 2, Number(e.target.value)))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-slate-750 flex justify-between">
                      <span><MdText text={inhalt.texte.messlängeBeiHöchstkraftL} /></span>
                      <span className="text-slate-700 font-mono font-bold">{formatDeWert(steelLengthU)} mm</span>
                    </label>
                    <input 
                      type="range" min={steelLength0} max={steelLength0 + 40} step="0.5" value={steelLengthU}
                      onChange={(e) => setSteelLengthU(Math.max(steelLength0, Number(e.target.value)))}
                      className="w-full accent-slate-800 cursor-pointer"
                    />
                  </div>

                  {/* Steel calculations output panel */}
                  <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl mt-4 space-y-3 font-sans">
                    <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-widest border-b border-emerald-200 pb-1 font-mono"><MdText text={inhalt.texte.auswertungZugversuchVergleichMit} /></h5>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs">
                      
                      <div className="text-slate-500"><MdText text={inhalt.texte.stabquerschnittS0} /></div>
                      <div className="font-bold text-right text-slate-800 font-mono">{formatDeZahl(steelRes.area, 1)} mm²</div>

                      <div className="text-slate-500 font-semibold text-slate-800"><MdText text={inhalt.texte.streckgrenzeRe} /></div>
                      <div className={`font-bold text-right font-mono ${steelRes.yieldPassed ? 'text-emerald-800' : 'text-rose-700'}`}>
                        {formatDeZahl(steelRes.yieldStrength, 1)} MPa
                      </div>

                      <div className="text-slate-500 font-semibold text-slate-800"><MdText text={inhalt.texte.zugfestigkeitRm} /></div>
                      <div className="font-bold text-right text-slate-800 font-mono font-bold">{formatDeZahl(steelRes.ultimateStrength, 1)} MPa</div>

                      <div className="text-slate-500"><MdText text={inhalt.texte.verhältnisRmRe} /></div>
                      <div className={`font-bold text-right font-mono ${steelRes.ratiosPassed ? 'text-emerald-800' : 'text-amber-700'}`}>
                        {formatDeZahl(steelRes.ratio, 2)}
                      </div>

                      <div className="text-slate-500"><MdText text={inhalt.texte.gesamtdehnungBeiHöchstkraftA} /></div>
                      <div className={`font-bold text-right font-mono ${steelRes.elongationPassed ? 'text-emerald-800' : 'text-slate-800'}`}>
                        {formatDeZahl(steelRes.elongation, 1)} %
                      </div>
                    </div>
                    
                    <div className="text-[10px] bg-white border border-emerald-200 px-2.5 py-2 rounded-lg text-center">
                      <span className="font-bold text-slate-700 block"><MdText text={inhalt.texte.duktilitätsbewertungEinzelwertNennquersc} /></span>
                      <span className="text-shiraz font-bold">{steelRes.complianceClass}</span>
                    </div>
                    <EingabeHinweise hinweise={steelRes.hinweise} />
                  </div>
                </div>
              )}

              {/* 4. HOLZ-PRÜFSTAND */}
              {activeCategory === 'holz_organisch' && (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-150 font-mono uppercase"><MdText text={inhalt.texte.modusHolzBiegeversuch4} /></div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-750 flex justify-between">
                        <span><MdText text={inhalt.texte.rohdichte0} /></span>
                        <span className="text-shiraz font-mono font-bold">{formatDeZahl(woodDensity, 2)} g/cm³</span>
                      </label>
                      <input 
                        type="range" min="0.30" max="0.85" step="0.01" value={woodDensity}
                        onChange={(e) => setWoodDensity(Number(e.target.value))}
                        className="w-full h-1 accent-shiraz cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-500 leading-none"><MdText text={inhalt.texte.fichteCa046} /></span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-750 flex justify-between">
                        <span><MdText text={inhalt.texte.holzfeuchteU} /></span>
                        <span className="text-emerald-700 font-mono font-bold">{formatDeWert(woodMoisture)} %</span>
                      </label>
                      <input 
                        type="range" min="5" max="35" step="1" value={woodMoisture}
                        onChange={(e) => setWoodMoisture(Number(e.target.value))}
                        className="w-full h-1 accent-emerald-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Beam Geometry Settings */}
                  <div className="grid grid-cols-3 gap-2 border-t border-home-grau/30 pt-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600"><MdText text={inhalt.texte.balkenbreiteBMm} /></label>
                      <input aria-label={inhalt.werte.balkenbreiteBMm} 
                        type="number" min="0" value={woodWidth}
                        onChange={(e) => setWoodWidth(Math.max(10, Number(e.target.value)))}
                        className="w-full border border-home-grau/30 p-1 rounded font-mono text-xs text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600"><MdText text={inhalt.texte.balkenhöheHMm} /></label>
                      <input aria-label={inhalt.werte.balkenhöheHMm} 
                        type="number" min="0" value={woodHeight}
                        onChange={(e) => setWoodHeight(Math.max(10, Number(e.target.value)))}
                        className="w-full border border-home-grau/30 p-1 rounded font-mono text-xs text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600"><MdText text={inhalt.texte.stützweiteLMmNorm} /></label>
                      <input aria-label={inhalt.werte.stützweiteLMmNorm} 
                        type="number" min="0" value={woodSpan}
                        onChange={(e) => setWoodSpan(Math.max(100, Number(e.target.value)))}
                        className="w-full border border-home-grau/30 p-1 rounded font-mono text-xs text-center"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-1.5">
                    <label className="text-xs font-bold text-slate-750 flex justify-between">
                      <span><MdText text={inhalt.texte.gemesseneGesamtBruchlastF} /></span>
                      <span className="text-emerald-700 font-mono font-bold">{formatDeZahl(woodBendingForce, 1)} kN</span>
                    </label>
                    <input 
                      type="range" min="0.5" max="25" step="0.5" value={woodBendingForce}
                      onChange={(e) => setWoodBendingForce(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  {/* Wood Estimator Calculation Outputs */}
                  <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl mt-4 space-y-3 font-sans">
                    <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-widest border-b border-emerald-200 pb-1 font-mono"><MdText text={inhalt.texte.biegeUndDruckschätzungLehrmodell} /></h5>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs">
                      
                      <div className="text-slate-500"><MdText text={inhalt.texte.druckfestigkeitFaserparallelFc0} /></div>
                      <div className="font-bold text-right text-slate-800 font-mono">{formatDeZahl(woodRes.fc0_actual, 1)} MPa</div>

                      <div className="text-slate-500 font-semibold text-slate-800"><MdText text={inhalt.texte.biegefestigkeitFmAusF} /></div>
                      <div className="font-bold text-right text-shiraz font-mono font-bold">
                        {formatDeZahl(woodRes.f_bending, 1)} N/mm²
                      </div>

                      <div className="text-slate-500"><MdText text={inhalt.texte.eModulE0Grobe} /></div>
                      <div className="font-bold text-right text-slate-800 font-mono">
                        {formatDeZahl(woodRes.e_modul, 0)} MPa
                      </div>

                      <div className="text-slate-500 font-bold text-slate-850"><MdText text={inhalt.texte.festigkeitsniveauOrientierung} /></div>
                      <div className="font-bold text-right text-emerald-800 font-bold font-mono">
                        {woodRes.strengthClassName}
                      </div>

                    </div>

                    <span className="block text-[10px] text-emerald-850 italic text-center"><MdText text={inhalt.texte.schätzwerteFürEineHolzfeuchte} />{formatDeWert(woodMoisture)}<MdText text={inhalt.texte.bezugsfeuchteDerFestigkeitsklassen12} /></span>
                    <EingabeHinweise hinweise={woodRes.hinweise} />
                  </div>
                </div>
              )}

            </div>

            <div className="mt-6 pt-3 border-t border-home-grau/30 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
              <Info size={11} /> 
              <span><MdText text={inhalt.texte.normformelnDerPrüfnormenKorrektur} /></span>
            </div>
          </div>

        </div>

      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <div className="flex flex-col gap-6">
        <FormulaDerivationBox
          title={inhalt.werte.beispiel1WürfeldruckfestigkeitAus}
          zielGleichung="f_c = \frac{F}{A_c}"
          schritte={inhalt.daten["MechanischePruefungen.schritte"]}
          ergebnisHinweis={inhalt.werte.derEinzelwertWirdAuf}
          normQuelle={inhalt.werte.dinEn123903}
        />
        <FormulaDerivationBox
          title={inhalt.werte.beispiel2SpaltzugUnd}
          zielGleichung="f_{ct,sp} = \frac{2F}{\pi L d},\qquad f_{ct} = 0{,}9 \cdot f_{ct,sp}"
          schritte={inhalt.daten["MechanischePruefungen.schritte_2"]}
          ergebnisHinweis={inhalt.werte.zumVergleichDinEn}
          normQuelle={inhalt.werte.dinEn123906}
        />
        <FormulaDerivationBox
          title={inhalt.werte.beispiel3BetonstahlZugversuch}
          zielGleichung="R_e = \frac{F_e}{S_0},\quad R_m = \frac{F_m}{S_0},\quad k = \frac{R_m}{R_e}"
          schritte={inhalt.daten["MechanischePruefungen.schritte_3"]}
          ergebnisHinweis={inhalt.werte.derEinzelstabErfülltDie}
          normQuelle={inhalt.werte.dinEnIso15630}
        />
      </div>

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="mechanische_pruefungen" />

      {/* --- Unified Module Footer Integration --- */}
      <ModuleFooter 
        weblinks={inhalt.daten["MechanischePruefungen.weblinks"]}
        wikipedia={[
          { title: inhalt.werte.betonDruckfestigkeit, url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Zugversuch', url: 'https://de.wikipedia.org/wiki/Zugversuch' },
          { title: 'Kerbschlagbiegeversuch', url: 'https://de.wikipedia.org/wiki/Kerbschlagbiegeversuch' },
          { title: 'Asphalt', url: 'https://de.wikipedia.org/wiki/Asphalt' }
        ]}
        regelwerke={inhalt.daten["MechanischePruefungen.regelwerke"]}
        literatur={inhalt.daten["MechanischePruefungen.literatur"]}
        formeln={inhalt.daten["MechanischePruefungen.formeln"]}
        lastReviewed={inhalt.werte.oktober2026Ap4}
      />

    </div>
  );
}
