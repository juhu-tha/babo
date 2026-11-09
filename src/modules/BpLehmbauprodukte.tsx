import { formatDeZahl, formatDeTeX, formatDeWert, formatDeTeXWert } from '@/src/utils/numberFormat';
import { lehmWand } from '@/src/calc/bauprodukte';
import React, { useState } from 'react';
import { 
  Layers, 
  BookOpen, 
  Droplets, 
  ShieldCheck, 
  CheckCircle2, 
  HardHat, 
  Calculator, 
  AlertTriangle, 
  Sparkles
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { BlockMath } from 'react-katex';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import inhalt from '@/content/bplehmbauprodukte/BpLehmbauprodukte.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';
import { ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

interface LoamStandardInfo {
  id: string;
  norm: string;
  title: string;
  classes: string;
  density: string;
  strength: string;
  rules: string;
  application: string;
  pros: string[];
}

const LOAM_STANDARDS_DB: LoamStandardInfo[] = inhalt.daten.LOAM_STANDARDS_DB;

export default function BpLehmbauprodukte() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'standards' | 'bemessung' | 'dauerhaftigkeit'>('steckbrief');
  const [selectedStandard, setSelectedStandard] = useState<string>('stein');

  // Load-bearing structural calculator states (following real simplified DIN 18940 / EC6 calculations)
  const [height, setHeight] = useState<number>(2.75); // m
  const [thickness, setThickness] = useState<number>(30); // cm (24, 30, 36.5)
  const [strengthClass, setStrengthClass] = useState<number>(2); // FK 2, 3, or 4
  const [holdsTopAndBottom, setHoldsTopAndBottom] = useState<boolean>(true); // held on both ends
  const [designLoad, setDesignLoad] = useState<number>(35); // kN/m

  // Rechenkern src/calc/bauprodukte.ts (vereinfachter Lehransatz; f_k-Werte, γ_M = 2,0, λ ≤ 21 und Φ vorläufig, F-Freigabe)
  const wand = lehmWand(height, thickness, strengthClass, holdsTopAndBottom);
  const effectiveHeightBeiwert = wand.beta;
  const effectiveHeight = wand.hef;
  const slenderness = wand.lambda;
  const isSlendernessOk = wand.schlankOk;
  const f_k = wand.fk;
  const f_d = wand.fd;
  const phi = wand.phi;
  const wallThicknessM = thickness / 100;
  const n_Rd = wand.nRd; // kN/m
  const isCapacityOk = isSlendernessOk && designLoad <= n_Rd;

  const currentStandard = LOAM_STANDARDS_DB.find(s => s.id === selectedStandard) || LOAM_STANDARDS_DB[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.industrielleLehmbauprodukteBauprodukte} /></h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 mb-6">
          <p><MdText text={inhalt.texte.derModerneLehmbauVerbindet} /></p>
        </div>

        {/* Primary Tabs Navigation */}
        <ModuleTabs
          label={inhalt.werte.reiterBereiche}
          tabs={[
            { id: 'steckbrief' as const, label: 'Baustoff-Steckbrief', icon: BookOpen },
            { id: 'standards' as const, label: 'DIN-Produktnormen', icon: Layers },
            { id: 'bemessung' as const, label: inhalt.texte.tragfähigkeitDin18940, icon: Calculator },
            { id: 'dauerhaftigkeit' as const, label: inhalt.texte.feuchteschutzKonstruktion, icon: Droplets },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6"
        >

        {/* Tab 1: Steckbrief */}
        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="lehmbau" />
          </div>
        )}

        {/* Tab 2: DIN Standards Explorer */}
        {activeTab === 'standards' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Selector list */}
              <AuswahlGruppe label="Norm" className="lg:col-span-1 flex flex-col gap-2">
                {LOAM_STANDARDS_DB.map((item) => (
                  <button {...alsOption(selectedStandard === item.id)}
                    key={item.id}
                    onClick={() => setSelectedStandard(item.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1 items-start cursor-pointer ${
                      selectedStandard === item.id
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold shadow-sm'
                        : 'bg-white border-home-grau/30 text-text-main/80 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">
                      {item.norm}
                    </span>
                    <span className="text-sm mt-1">{item.title}</span>
                  </button>
                ))}
              </AuswahlGruppe>

              {/* Main Detail panel */}
              <div className="lg:col-span-3 bg-slate-50/50 p-6 rounded-2xl border border-home-grau/25 space-y-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-home-grau/20 pb-4 gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                      <Sparkles className="text-shiraz w-5 h-5" /> DIN-Klassifizierung: {currentStandard.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-600 mt-1">Produktnorm: {currentStandard.norm}</p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shrink-0 self-start md:self-center">
                    <ShieldCheck size={14} /><MdText text={inhalt.texte.amtlichGeregelt} /></span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs">
                    <h4 className="text-xs font-bold text-text-main/70 uppercase tracking-wider mb-1">Qualitativ-Klassen</h4>
                    <p className="text-sm text-text-main leading-relaxed">{currentStandard.classes}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs">
                    <h4 className="text-xs font-bold text-text-main/70 uppercase tracking-wider mb-1"><MdText text={inhalt.texte.technischeRohdichten} /></h4>
                    <p className="text-sm text-text-main leading-relaxed">{currentStandard.density}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs">
                    <h4 className="text-xs font-bold text-text-main/70 uppercase tracking-wider mb-1">Festigkeitsbereiche</h4>
                    <p className="text-sm text-text-main leading-relaxed">{currentStandard.strength}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs">
                    <h4 className="text-xs font-bold text-text-main/70 uppercase tracking-wider mb-1">Einsatzgebiete</h4>
                    <p className="text-sm text-text-main leading-relaxed">{currentStandard.application}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs">
                  <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider mb-2"><MdText text={inhalt.texte.spezifischeVerarbeitungsvorschrift} /></h4>
                  <p className="text-sm text-text-main/90 leading-relaxed font-sans">{currentStandard.rules}</p>
                </div>

                <div className="space-y-2 mt-4">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider"><MdText text={inhalt.texte.werkstofflicheVorteile} /></h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {currentStandard.pros.map((pro, index) => (
                      <div key={index} className="bg-emerald-50/40 p-3 rounded-lg border border-emerald-500/15 flex gap-2 items-start">
                        <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={15} />
                        <span className="text-xs font-medium text-emerald-950 leading-normal">{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Load-bearing structural checker DIN 18940 */}
        {activeTab === 'bemessung' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-50 border border-home-grau/30 p-4 sm:p-5 rounded-xl">
              <h3 className="font-bold text-text-main flex items-center gap-1.5 text-base">
                <Calculator className="text-shiraz" size={20} /><MdText text={inhalt.texte.tragfähigkeitsprüfungNachDin18940} /></h3>
              <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.ermittelnSieDieMaximale} /></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input section */}
              <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-home-grau/30 space-y-4">
                <h4 className="font-bold text-sm text-text-main pb-2 border-b border-home-grau/20">Eingabeparameter</h4>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main/80 flex justify-between">
                    <span><MdText text={inhalt.texte.lichteWandhöheH} /></span>
                    <span className="text-shiraz">{formatDeZahl(height, 2)} m</span>
                  </label>
                  <input
                    type="range"
                    min="2.0"
                    max="3.5"
                    step="0.05"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>2,00 m</span>
                    <span>3,50 m</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main/80 flex justify-between">
                    <span><MdText text={inhalt.texte.wandstärkeT} /></span>
                    <span className="text-shiraz">{formatDeWert(thickness)} cm</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[24, 30, 36.5].map((val) => (
                      <button
                        key={val}
                        onClick={() => setThickness(val)}
                        className={`py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          thickness === val
                            ? 'bg-shiraz text-white border-shiraz shadow-xs'
                            : 'bg-white border-home-grau/25 text-text-main hover:bg-slate-50'
                        }`}
                      >
                        {formatDeWert(val)} cm
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main/80 flex justify-between">
                    <span><MdText text={inhalt.texte.festigkeitsklasseFk} /></span>
                    <span className="text-shiraz">Klasse {formatDeWert(strengthClass)}</span>
                  </label>
                  <div className="grid grid-cols-6 gap-1">
                    {[2, 2.5, 3, 4, 5, 6].map((val) => (
                      <button
                        key={val}
                        onClick={() => setStrengthClass(val)}
                        className={`py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          strengthClass === val
                            ? 'bg-shiraz text-white border-shiraz shadow-xs'
                            : 'bg-white border-home-grau/25 text-text-main hover:bg-slate-50'
                        }`}
                      >
                        {formatDeWert(val)}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 leading-normal block pt-1"><MdText text={inhalt.texte.charakteristischeMauerwerksdruckfestigke} />{formatDeZahl(f_k, 1)}<MdText text={inhalt.texte.nMmNachDin} /></span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-main/80 block"><MdText text={inhalt.texte.obenUntenHorizontalGehalten} /></label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input
                        type="radio"
                        checked={holdsTopAndBottom === true}
                        onChange={() => setHoldsTopAndBottom(true)}
                        className="accent-shiraz"
                      />
                      <span><MdText text={inhalt.texte.jaSlabHalterung0} /></span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input
                        type="radio"
                        checked={holdsTopAndBottom === false}
                        onChange={() => setHoldsTopAndBottom(false)}
                        className="accent-shiraz"
                      />
                      <span><MdText text={inhalt.texte.neinFreiAuskragend1} /></span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1 pt-1 border-t border-home-grau/10">
                  <label className="text-xs font-bold text-text-main/80 flex justify-between">
                    <span><MdText text={inhalt.texte.bemessungslastNSubEd} /></span>
                    <span className="text-amber-800 font-bold">{formatDeWert(designLoad)} kN/m</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={designLoad}
                    onChange={(e) => setDesignLoad(parseInt(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>10 kN/m</span>
                    <span>100 kN/m</span>
                  </div>
                </div>
              </div>

              {/* Output analysis panel */}
              <div className="lg:col-span-2 bg-slate-50 border border-home-grau/25 p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-text-main pb-2 border-b border-home-grau/20">Standsicherheits-Konstruktionsbericht</h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center">
                      <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.knicklängeHSubEf} /></span>
                      <span className="font-mono font-bold text-sm text-text-main">{formatDeZahl(effectiveHeight, 2)} m</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center">
                      <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.schlankheitsgrad} /></span>
                      <span className="font-mono font-bold text-sm text-text-main">{formatDeZahl(slenderness, 1)}</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center">
                      <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.reduktionsbeiwert} /></span>
                      <span className="font-mono font-bold text-sm text-text-main">{formatDeZahl(phi, 3)}</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center">
                      <span className="text-[10px] text-slate-500 block">Erhöhung f<sub>d</sub></span>
                      <span className="font-mono font-bold text-sm text-text-main">{formatDeZahl((f_d * 1000), 0)} kN/m²</span>
                    </div>
                  </div>

                  {/* Math representation */}
                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 mt-5 space-y-3">
                    <h5 className="text-xs font-bold text-slate-600"><MdText text={inhalt.texte.rechnerischerFestigkeitsbezugLatex} /></h5>
                    <div className="text-[13px] overflow-x-auto py-1">
                      <BlockMath math={`h_{ef} = \\beta \\cdot h = ${formatDeTeX(effectiveHeightBeiwert, 2)} \\cdot ${formatDeTeX(height, 2)} = ${formatDeTeX(effectiveHeight, 2)}\\text{ m}`} />
                      <BlockMath math={`\\lambda = \\frac{h_{ef}}{t} = \\frac{${formatDeTeX(effectiveHeight, 2)}}{${formatDeTeX(wallThicknessM, 3)}} = ${formatDeTeX(slenderness, 1)} \\leq 21`} />
                      <BlockMath math={`N_{Rd} = \\Phi \\cdot t \\cdot f_d = ${formatDeTeX(phi, 3)} \\cdot ${formatDeTeX(wallThicknessM, 3)} \\text{ m} \\cdot ${formatDeTeXWert(f_d * 1000)} \\text{ kN/m}^2 = ${formatDeTeX(n_Rd, 1)} \\text{ kN/m}`} />
                    </div>
                  </div>
                </div>

                {/* Verification result box */}
                <div className={`mt-5 p-4 rounded-xl border ${
                  isCapacityOk 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs' 
                    : 'bg-red-50 border-red-300 text-red-950 shadow-xs'
                }`}>
                  <div className="flex items-start gap-3">
                    {isCapacityOk ? (
                      <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5 w-6 h-6 animate-bounce" />
                    ) : (
                      <AlertTriangle className="text-red-500 shrink-0 mt-0.5 w-6 h-6 animate-pulse" />
                    )}
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm">
                        {isSlendernessOk ? (
                          isCapacityOk 
                            ? inhalt.werte.tragfähigkeitsnachweisErfüllt 
                            : inhalt.werte.tragfähigkeitNichtErfüllt
                        ) : inhalt.werte.schlankheitGreiftNichtÜberschritten}
                      </h4>
                      <p className="text-xs leading-normal opacity-90">
                        {isSlendernessOk ? (
                          isCapacityOk 
                            ? `Die bemessene Wandstärke von ${thickness} cm hält mit einer rechnerischen Wandkapazität von ${formatDeZahl(n_Rd, 1)} kN/m der Traglast von ${designLoad} kN/m einwandfrei stand.`
                            : `Die berechnete Wandtragfähigkeit beträgt nur ${formatDeZahl(n_Rd, 1)} kN/m. Dies reicht für die äußere Belastung von ${designLoad} kN/m nicht aus!`
                        ) : `Der berechnete Schlankheitsgrad beträgt ${formatDeZahl(slenderness, 1)}, der über dem im Rechner angesetzten Grenzwert 21 liegt (Lehrannahme; Grenzwert nach DIN 18940 vorläufig, Normprüfung ausstehend). Erhöhen Sie die Wanddicke.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rechenweg mit den aktuellen Eingaben (Z12) */}
            <FormulaDerivationBox
              live
              kurzzeile={kurzzeile(ansageWert('Schlankheit', slenderness, 1), ansageWert('N_Rd', isSlendernessOk ? n_Rd : NaN, 1, 'kN/m'), ansageWert('N_Ed', designLoad, 'frei', 'kN/m'), isCapacityOk ? 'Nachweis erfüllt' : 'Nachweis nicht erfüllt')}
              title={inhalt.werte.rwTitel}
              zielGleichung={`N_{Ed} \\leq N_{Rd} = \\Phi \\cdot t \\cdot f_d = ${formatDeTeX(n_Rd, 1)}\\,\\text{kN/m}`}
              normQuelle={inhalt.werte.rwNormQuelle}
              schritte={[
                {
                  titel: inhalt.werte.rwKnicklaengeTitel,
                  erklaerung: inhalt.werte.rwKnicklaenge,
                  formel: `h_{ef} = \\beta \\cdot h = ${formatDeTeX(effectiveHeightBeiwert, 2)} \\cdot ${formatDeTeX(height, 2)}\\,\\text{m} = ${formatDeTeX(effectiveHeight, 2)}\\,\\text{m}`,
                  einheit: 'm',
                },
                {
                  titel: inhalt.werte.rwSchlankheitTitel,
                  erklaerung: inhalt.werte.rwSchlankheit,
                  formel: `\\lambda = \\frac{h_{ef}}{t} = \\frac{${formatDeTeX(effectiveHeight, 2)}\\,\\text{m}}{${formatDeTeX(wallThicknessM, 3)}\\,\\text{m}} = ${formatDeTeX(slenderness, 1)} ${isSlendernessOk ? '\\leq' : '>'} 21`,
                },
                {
                  titel: inhalt.werte.rwFestigkeitTitel,
                  erklaerung: inhalt.werte.rwFestigkeit,
                  formel: `f_d = \\frac{f_k}{\\gamma_M} = \\frac{${formatDeTeX(f_k, 1)}}{2{,}0} = ${formatDeTeX(f_d, 2)}\\,\\text{N/mm}^2 = ${formatDeTeX(f_d * 1000, 0)}\\,\\text{kN/m}^2`,
                  einheit: 'N/mm²',
                },
                {
                  titel: inhalt.werte.rwAbminderungTitel,
                  erklaerung: inhalt.werte.rwAbminderung,
                  formel: `\\Phi = 0{,}85 \\cdot \\left(1 - \\left(\\frac{\\lambda}{24}\\right)^2\\right) = 0{,}85 \\cdot \\left(1 - \\left(\\frac{${formatDeTeX(slenderness, 1)}}{24}\\right)^2\\right) = ${formatDeTeX(phi, 3)}`,
                },
                {
                  titel: inhalt.werte.rwTragfaehigkeitTitel,
                  erklaerung: inhalt.werte.rwTragfaehigkeit,
                  formel: `N_{Rd} = \\Phi \\cdot t \\cdot f_d = ${formatDeTeX(phi, 3)} \\cdot ${formatDeTeX(wallThicknessM, 3)}\\,\\text{m} \\cdot ${formatDeTeX(f_d * 1000, 0)}\\,\\text{kN/m}^2 = ${formatDeTeX(n_Rd, 1)}\\,\\text{kN/m}`,
                  einheit: 'kN/m',
                },
                {
                  titel: inhalt.werte.rwNachweisTitel,
                  erklaerung: inhalt.werte.rwNachweis,
                  formel: `N_{Ed} = ${formatDeTeX(designLoad, 0)}\\,\\text{kN/m} ${designLoad <= n_Rd ? '\\leq' : '>'} N_{Rd} = ${formatDeTeX(n_Rd, 1)}\\,\\text{kN/m}`,
                },
              ]}
              ergebnisHinweis={inhalt.werte.rwHinweis}
            />
          </div>
        )}

        {/* Tab 4: Feuchteschutz & Konstruktion */}
        {activeTab === 'dauerhaftigkeit' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.daLehmReinPhysikalisch} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col gap-3">
                <h3 className="font-bold text-shiraz flex items-center gap-1.5 text-sm uppercase tracking-wider">
                  <ShieldCheck size={18} /><MdText text={inhalt.texte.t1SpritzwasserschutzDerStiefel} /></h3>
                <p className="text-xs text-text-main/80 leading-relaxed flex-1"><MdText text={inhalt.texte.derSensibleFußpunktDer} /></p>
                <div className="bg-slate-100 p-3 rounded-lg text-[11px] font-mono border text-slate-700"><MdText text={inhalt.texte.vorgabeDin18940Wta} /></div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col gap-3">
                <h3 className="font-bold text-shiraz flex items-center gap-1.5 text-sm uppercase tracking-wider">
                  <HardHat size={18} /><MdText text={inhalt.texte.t2NiederschlagsschutzDerHut} /></h3>
                <p className="text-xs text-text-main/80 leading-relaxed flex-1"><MdText text={inhalt.texte.gegenDirektenSchlagregenSind} /></p>
                <div className="bg-slate-100 p-3 rounded-lg text-[11px] font-mono border text-slate-700"><MdText text={inhalt.texte.schutzmaßnahmeGroßzügigeDachüberständeAl} /></div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col gap-3">
                <h3 className="font-bold text-shiraz flex items-center gap-1.5 text-sm uppercase tracking-wider">
                  <Droplets size={18} /><MdText text={inhalt.texte.t3DiffusionsoffenheitDieLunge} /></h3>
                <p className="text-xs text-text-main/80 leading-relaxed flex-1"><MdText text={inhalt.texte.lehmwändeMüssenDiffusionsoffenUnd} /></p>
                <div className="bg-slate-100 p-3 rounded-lg text-[11px] font-mono border text-slate-700"><MdText text={inhalt.texte.kompatibilitätSumpfkalkfarbenReinSilikat} /></div>
              </div>
            </div>

            <div className="bg-amber-50/50 border-l-4 border-l-amber-500 p-4 rounded-xl flex gap-3 text-sm text-stone-900 mt-4 shadow-3xs">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-sm">Feuchtebegrenzung:</strong><MdText text={inhalt.texte.lehmbauteileDürfenNichtDauerhaft} /></div>
            </div>
          </div>
        )}
        </ModuleTabs>
      </div>

      <ModulTest moduleId="bp_lehmbauprodukte" />

      {/* Structured Footer */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Lehmbau', url: 'https://de.wikipedia.org/wiki/Lehmbau' },
          { title: 'Lehmstein', url: 'https://de.wikipedia.org/wiki/Lehmstein' }
        ]}
        weblinks={[
          { title: inhalt.werte.dachverbandLehmEV, url: 'https://www.dachverband-lehm.de/' }
        ]}
        literatur={inhalt.daten["BpLehmbauprodukte.literatur"]}
        regelwerke={inhalt.daten["BpLehmbauprodukte.regelwerke"]}
        formeln={inhalt.daten["BpLehmbauprodukte.formeln"]}
      />
    </div>
  );
}
