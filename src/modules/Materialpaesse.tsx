import { formatDeZahl, formatDeWert, formatDeIntl } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { FileText, RefreshCw, Layers, Sparkles, AlertCircle, TrendingUp, CheckCircle, DollarSign, Award } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import inhalt from '@/content/materialpaesse/Materialpaesse.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface BuildingArchetype {
  id: string;
  name: string;
  description: string;
  concreteVolume: number; // m³ per m² GFA
  steelMass: number; // kg per m² GFA
  woodVolume: number; // m³ per m² GFA
  copperMass: number; // kg per m² GFA
  baseRecycledInput: number; // in %
  baseLösbarkeit: 'glued' | 'mortar' | 'screwed';
}

const ARCHETYPES: BuildingArchetype[] = [
  {
    id: 'massiv',
    name: inhalt.werte.szenarioAMassivbauBeton,
    description: inhalt.werte.konventionellesBürogebäudeAusOrtbeton,
    concreteVolume: 0.40,
    steelMass: 45,
    woodVolume: 0,
    copperMass: 1.5,
    baseRecycledInput: 10,
    baseLösbarkeit: 'glued'
  },
  {
    id: 'hybrid',
    name: inhalt.werte.szenarioBHolzHybridbauweise,
    description: inhalt.werte.tragwerkAusBrettschichtholzStützen,
    concreteVolume: 0.12,
    steelMass: 15,
    woodVolume: 0.25,
    copperMass: 1.2,
    baseRecycledInput: 35,
    baseLösbarkeit: 'screwed'
  },
  {
    id: 'circular',
    name: inhalt.werte.szenarioCCradleTo,
    description: inhalt.werte.konsequenteKreislaufarchitekturFundament,
    concreteVolume: 0.05,
    steelMass: 10,
    woodVolume: 0.30,
    copperMass: 1.0,
    baseRecycledInput: 85,
    baseLösbarkeit: 'screwed'
  }
];

// Mock values for commodity prices / recycling attributes
const COMMODITY_PRICES = {
  copper: 8400, // € per ton
  steel: 650,   // € per ton
  concreteRecycled: 18, // € per ton residual worth for clean crushed aggregate
  concreteWaste: -35,   // € per ton tipping fee (disposal cost if glued/hazardous)
  woodBiomass: 110,     // € per ton for energetic or particle use
  woodReuse: 450,       // € per ton for actual direct element reuse
};

export default function Materialpaesse() {
  const [selectedArchId, setSelectedArchId] = useState<string>('massiv');
  const [gfa, setGfa] = useState<number>(2500); // Gross Floor Area m²
  const [recycledInput, setRecycledInput] = useState<number>(15); // %
  const [joiningMethod, setJoiningMethod] = useState<'glued' | 'mortar' | 'screwed'>('glued');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const archetype = ARCHETYPES.find(a => a.id === selectedArchId) || ARCHETYPES[0];

  const handleArchetypeSelect = (id: string) => {
    setSelectedIdAndSyncSliders(id);
  };

  const setSelectedIdAndSyncSliders = (id: string) => {
    setSelectedArchId(id);
    const found = ARCHETYPES.find(a => a.id === id);
    if (found) {
      setRecycledInput(found.baseRecycledInput);
      setJoiningMethod(found.baseLösbarkeit);
    }
  };

  // 1. Calculate materials inventory (tons)
  const concreteDensity = 2.4; // t/m³
  const woodDensity = 0.5; // t/m³
  
  const concreteTons = archetype.concreteVolume * gfa * concreteDensity;
  const steelTons = (archetype.steelMass * gfa) / 1000;
  const woodTons = archetype.woodVolume * gfa * woodDensity;
  const copperTons = (archetype.copperMass * gfa) / 1000;
  const totalWeightTons = concreteTons + steelTons + woodTons + copperTons;

  // 2. Madaster Circularity Indikator Calculation (simplified but academically sound)
  // Input circularity: Recycled content %
  // Output circularity: based on connection/separation index (screwed = 90%, mortar = 50%, glued = 10%)
  const outputCircularityMap = {
    glued: 10,
    mortar: 50,
    screwed: 95
  };
  const outputCircularity = outputCircularityMap[joiningMethod];
  const circularityIndex = Math.round((recycledInput + outputCircularity) / 2);

  // 3. Biogenic CO2 carbon storage calculation
  // Biogener Kohlenstoff: ca. 50 % C in darrtrockenem Holz -> 0,5 * 44/12 ≈ 1,83 t CO2 je t Holz
  // (Rohdichte 0,5 t/m³ hier vereinfacht als darrtrockene Masse angesetzt; EN 16449)
  const carbonStoredTons = Math.round(woodTons * 0.5 * 44 / 12);

  // 4. Urban Mining Potential / Restwert calculation
  // If glued, concrete has negative value (tipping fee) because you can't reuse or separate it.
  // If screwed, it can be separated. Steel is highly recyclable (95% value).
  const concreteRecoveryRate = joiningMethod === 'screwed' ? 0.90 : joiningMethod === 'mortar' ? 0.60 : 0.0;
  const concreteValue = concreteRecoveryRate > 0 
    ? concreteTons * concreteRecoveryRate * COMMODITY_PRICES.concreteRecycled
    : concreteTons * COMMODITY_PRICES.concreteWaste; // pay to throw away!

  const steelRecoveryRate = joiningMethod === 'screwed' ? 0.98 : joiningMethod === 'mortar' ? 0.80 : 0.50;
  const steelValue = steelTons * steelRecoveryRate * COMMODITY_PRICES.steel;

  const woodRecoveryRate = joiningMethod === 'screwed' ? 0.85 : joiningMethod === 'mortar' ? 0.40 : 0.05;
  const woodValue = woodRecoveryRate > 0.5
    ? woodTons * woodRecoveryRate * COMMODITY_PRICES.woodReuse
    : woodTons * COMMODITY_PRICES.woodBiomass;

  const copperValue = copperTons * 0.95 * COMMODITY_PRICES.copper;

  const totalResidualValue = Math.round(concreteValue + steelValue + woodValue + copperValue);
  const residualValuePerM2 = Math.round(totalResidualValue / gfa);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Intro section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <FileText className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.materialpässeZBMadaster} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.umDenRohstoffverbrauchIm} /></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 font-normal">
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <h4 className="font-bold text-shiraz mb-2 flex items-center gap-2 text-sm">
              <Layers className="w-4 h-4 text-stone-500" /><MdText text={inhalt.texte.zweckEinesMaterialpasses} /></h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
              <li><MdText text={inhalt.texte.ressourcentransparenzLückenloseDokumenta} /></li>
              <li><MdText text={inhalt.texte.zirkuläresPotenzialGenaueAngabe} /></li>
              <li><MdText text={inhalt.texte.gebäudeRestwertErmittlungDes} /></li>
              <li><MdText text={inhalt.texte.klimaschutznachweisBasisFürDgnb} /></li>
            </ul>
          </div>
          
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <h4 className="font-bold text-shiraz mb-2 flex items-center gap-2 text-sm">
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} /><MdText text={inhalt.texte.dieMadasterPlattform} /></h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
              <li><MdText text={inhalt.texte.einGebäudeWirdAls} /></li>
              <li><MdText text={inhalt.texte.dasPortalBerechnetDen} /></li>
              <li><MdText text={inhalt.texte.derFinaleMaterialpassWeiß} /></li>
              <li><MdText text={inhalt.texte.bauherrenKönnenRestwertSzenarien} /></li>
            </ul>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <h4 className="font-bold text-shiraz mb-2 flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-purple-600" /><MdText text={inhalt.texte.dgnbGebäuderessourcenpass} /></h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
              <li><MdText text={inhalt.texte.steckbriefVorgabenOrientiertAm} /></li>
              <li><MdText text={inhalt.texte.massenBilanzierungGenaueAufteilung} /></li>
              <li><MdText text={inhalt.texte.rückbauklassenDetailliertesTrackingDer} /></li>
              <li><MdText text={inhalt.texte.anrechnungFörderungErfülltKriterien} /></li>
            </ul>
          </div>
        </div>
      </div>

      {/* INTERACTIVE COMPONENT: MADASTER CALCULATOR & URBAN MINING SIMULATION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center justify-between border-b border-home-grau/30 pb-4 mb-6">
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Sparkles className="text-shiraz shrink-0" size={20} /><MdText text={inhalt.texte.interaktiverKreislaufRestwertrechnerUrba} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.entwerfenUndOptimierenSie} /></p>
        </div>
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
            <TrendingUp size={13} className="text-emerald-600" /><MdText text={inhalt.texte.madasterApiSim} /></span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column (5-cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5 border-r border-transparent lg:border-home-grau/30 pr-0 lg:pr-6 font-normal">
            
            {/* 1. Select Scenario Archetype */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2"><MdText text={inhalt.texte.t1GebäudeSzenarioWählen} /></label>
              <div className="flex flex-col gap-2">
                {ARCHETYPES.map((arch) => (
                  <button
                    key={arch.id}
                    onClick={() => handleArchetypeSelect(arch.id)}
                    className={`p-3 text-left border rounded-xl hover:bg-slate-50 transition-all ${
                      selectedArchId === arch.id 
                        ? 'border-shiraz bg-shiraz/5 shadow-sm ring-1 ring-shiraz/30' 
                        : 'border-home-grau/30 bg-white'
                    }`}
                  >
                    <span className="font-bold text-xs text-slate-900 block">{arch.name}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block leading-normal">{arch.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Bruttogrundfläche Slider */}
            <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-bold text-slate-900"><MdText text={inhalt.texte.bruttogrundflächeBgf} /></span>
                <span className="font-mono font-bold text-shiraz text-sm">{formatDeIntl(gfa)} m²</span>
              </div>
              <input 
                type="range" 
                min={500} 
                max={15000} 
                step={250} 
                value={gfa} 
                onChange={(e) => setGfa(Number(e.target.value))}
                className="cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1 leading-normal font-normal"><MdText text={inhalt.texte.skaliertDieGesamteVerbaute} /></p>
            </div>

            {/* 3. Recycled Input (Sekundärrohstoffe) */}
            <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-bold text-slate-900"><MdText text={inhalt.texte.recyceltesMaterialInput} /></span>
                <span className="font-mono font-bold text-shiraz text-sm">{formatDeWert(recycledInput)}%</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={100} 
                step={5} 
                value={recycledInput} 
                onChange={(e) => setRecycledInput(Number(e.target.value))}
                className="cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1 leading-normal font-normal"><MdText text={inhalt.texte.anteilAnRecyclatenOder} /></p>
            </div>

            {/* 4. Connection types (Lösbarkeit) */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2"><MdText text={inhalt.texte.t2KonstruktiveVerbindungsmethodeFügung} /></label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'glued', label: inhalt.werte.starrVerklebt, desc: inhalt.werte.nassvergussKleber },
                  { id: 'mortar', label: 'Gemörtelt', desc: 'Halbtrennbar' },
                  { id: 'screwed', label: inhalt.werte.trockenGeschraubt, desc: inhalt.werte.zerstörungsfreiDemontierbar }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setJoiningMethod(type.id as typeof joiningMethod)}
                    className={`p-2.5 rounded-lg border text-center flex flex-col items-center justify-between h-20 transition-all ${
                      joiningMethod === type.id 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm' 
                        : 'border-home-grau/30 text-slate-700 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[10.5px] font-bold leading-tight block">{type.label}</span>
                    <span className="text-[9px] text-slate-400 font-normal leading-normal mt-1 block">{type.desc}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Results Output Column (7-cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 font-normal">
            
            {/* Upper: Big Circularity Indicator Gauge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Circularity indicator card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-600 tracking-wider"><MdText text={inhalt.texte.ergebnisMetrik1} /></span>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mt-0.5"><MdText text={inhalt.texte.circularityIndicatorCi} /><InfoTooltip text={inhalt.werte.mittelwertAusRezyklierterHerkunft} />
                  </h4>
                </div>

                <div className="my-4 flex items-baseline gap-2">
                  <span className={`text-4xl md:text-5xl font-black ${
                    circularityIndex > 70 ? 'text-emerald-600' : circularityIndex > 40 ? 'text-amber-500' : 'text-red-500'
                  }`}>{formatDeWert(circularityIndex)}%</span>
                  <span className="text-xs text-slate-500 font-medium">Kreislauffähigkeit</span>
                </div>

                {/* Micro progress bar */}
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      circularityIndex > 70 ? 'bg-emerald-500' : circularityIndex > 40 ? 'bg-amber-400' : 'bg-red-500'
                    }`} 
                    style={{ width: `${circularityIndex}%` }}
                  />
                </div>

                <span className="text-[10px] text-slate-500 block mt-2 font-normal">
                  {circularityIndex > 70 
                    ? inhalt.werte.sehrGuterZirkulärerEntwurf 
                    : circularityIndex > 40 
                    ? inhalt.werte.guterBranchenstandardAberMaterialbedingt 
                    : inhalt.werte.klassischesLinearwirtschaftGebäudeSchwer}
                </span>
              </div>

              {/* Urban mining potential card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-600 tracking-wider"><MdText text={inhalt.texte.ergebnisMetrik2} /></span>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mt-0.5"><MdText text={inhalt.texte.urbanMiningRestwert} /><InfoTooltip text={inhalt.werte.geschätzteÖkonomischeWertschöpfungDer} />
                  </h4>
                </div>

                <div className="my-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-3xl md:text-4xl font-black ${
                      totalResidualValue >= 0 ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {totalResidualValue < 0 ? '-' : ''}€ {formatDeIntl(Math.abs(totalResidualValue))}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-1">
                    Umgelegt: <strong className="text-sm font-bold text-shiraz">{formatDeWert(residualValuePerM2)} €/m² BGF</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-home-grau/30 flex items-center gap-1.5 text-[10px] text-slate-500 leading-normal">
                  <DollarSign size={12} className="text-emerald-600 shrink-0" />
                  <span>
                    {totalResidualValue < 0 
                      ? inhalt.werte.deponiegebührenÜbersteigenDenRohstofferl 
                      : inhalt.werte.positiverRohstoffwertDasGebäude}
                  </span>
                </div>
              </div>

            </div>

            {/* DGNB Gebäuderessourcenpass Evaluation Banner */}
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 border border-purple-100 rounded-lg text-purple-700 shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider"><MdText text={inhalt.texte.dgnbTec16} /></h4>
                  <p className="text-[11px] text-slate-500 mt-0.5"><MdText text={inhalt.texte.automatisierteEinstufungFürDen} /></p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono"><MdText text={inhalt.texte.dgnbStatus} /></span>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    circularityIndex > 70 
                      ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                      : circularityIndex > 40 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'bg-slate-100 text-slate-600 border border-home-grau/30'
                  }`}>
                    {circularityIndex > 70 ? 'Platin-Konform' : circularityIndex > 40 ? 'Gold-Konform' : inhalt.werte.geringeKreislaufEffizienz}
                  </span>
                </div>
                <button
                  onClick={() => setShowCertificate(true)}
                  className="px-3 py-1.5 bg-shiraz hover:bg-shiraz/90 text-white rounded-lg text-[11px] font-bold font-sans transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <FileText size={12} />
                  <span><MdText text={inhalt.texte.passAnsehen} /></span>
                </button>
              </div>
            </div>

            {/* Mass Balance Breakdown & CO2 Carbon Storage bonus */}
            <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider"><MdText text={inhalt.texte.massenbilanzMaterialinventar} /></h4>
                {carbonStoredTons > 0 && (
                  <span className="bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1"><MdText text={inhalt.texte.coSpeicher} />{formatDeIntl(carbonStoredTons)} t CO₂-eq
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs font-normal">
                {/* Concrete */}
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5 text-slate-700">
                    <span>Normalbeton-Anteil:</span>
                    <span className="font-mono font-semibold">{formatDeIntl(concreteTons, {maximumFractionDigits: 0})} t</span>
                  </div>
                  <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border">
                    <div className="bg-gray-400 h-full rounded-full" style={{ width: `${Math.min(100, (concreteTons / totalWeightTons) * 100)}%` }} />
                  </div>
                </div>

                {/* Steel */}
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5 text-slate-700">
                    <span>Baustahl-Anteil:</span>
                    <span className="font-mono font-semibold">{formatDeIntl(steelTons, {maximumFractionDigits: 1})} t</span>
                  </div>
                  <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(100, (steelTons / totalWeightTons) * 100)}%` }} />
                  </div>
                </div>

                {/* Wood */}
                {woodTons > 0 && (
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5 text-slate-700">
                      <span><MdText text={inhalt.texte.nutzholzBshBiogen} /></span>
                      <span className="font-mono font-semibold text-emerald-600 font-bold">{formatDeIntl(woodTons, {maximumFractionDigits: 0})} t</span>
                    </div>
                    <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (woodTons / totalWeightTons) * 100)}%` }} />
                    </div>
                  </div>
                )}

                {/* Copper */}
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5 text-slate-700">
                    <span><MdText text={inhalt.texte.kupferleitungenMetalle} /></span>
                    <span className="font-mono font-semibold">{formatDeIntl(copperTons, {maximumFractionDigits: 2})} t</span>
                  </div>
                  <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: `${Math.min(100, (copperTons / totalWeightTons) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Real-Time Evaluation & Optimization Alert */}
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm font-normal">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertCircle size={14} className="text-shiraz" /><MdText text={inhalt.texte.umsetzungshinweisHebelZurOptimierung} /></h4>

              <div className="text-xs text-slate-700 leading-relaxed font-normal space-y-2">
                {joiningMethod === 'glued' && (
                  <p className="border-l-2 border-red-500 pl-3"><MdText text={inhalt.texte.problemStarrerVerbundwerkstoffeVerklebun} /></p>
                )}
                {recycledInput < 30 && (
                  <p className="border-l-2 border-amber-500 pl-3"><MdText text={inhalt.texte.primärrohstoffDominanzSieNutzen} /></p>
                )}
                {joiningMethod === 'screwed' && (
                  <p className="border-l-2 border-emerald-500 pl-3"><MdText text={inhalt.texte.echterDesignForDisassembly} /></p>
                )}
                <p className="text-[11px] bg-slate-50 p-2.5 rounded-lg border text-slate-500 mt-3 font-normal">
                  <span className="font-bold text-shiraz"><MdText text={inhalt.texte.praxisbezugFürDieLehre} /></span><MdText text={inhalt.texte.dieErstellteMassenbilanzBildet} /></p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* DGNB GEBÄUDERESSOURCENPASS STECKBRIEF MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-home-grau/30 overflow-hidden flex flex-col font-sans text-slate-800 animate-in zoom-in-95 duration-200 max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-purple-900 text-white p-5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <Award className="text-purple-300 animate-bounce" size={24} style={{ animationDuration: '3s' }} />
                <div>
                  <h3 className="font-bold text-base tracking-tight text-white uppercase font-sans"><MdText text={inhalt.texte.gebäuderessourcenpassGrp} /></h3>
                  <span className="text-[10px] text-purple-200 font-mono tracking-wider"><MdText text={inhalt.texte.offiziellesDgnbBerichtsformatEntwurf} /></span>
                </div>
              </div>
              <button
                onClick={() => setShowCertificate(false)}
                className="text-white bg-purple-950/40 hover:bg-purple-950/75 w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Scrollable Content with GRP Steckbrief layout */}
            <div className="overflow-y-auto p-6 space-y-5 flex-1 select-all" id="print-area">
              <div className="border border-home-grau/30 p-5 rounded-xl space-y-4">
                
                {/* Official Crest Header */}
                <div className="flex justify-between items-start border-b border-home-grau/30 pb-4">
                  <div className="space-y-1">
                    <span className="text-lg font-black tracking-tight text-slate-900"><MdText text={inhalt.texte.grpDeutschland} /></span>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider"><MdText text={inhalt.texte.registrierIdGrp2026} />{selectedArchId.toUpperCase()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-purple-800 block"><MdText text={inhalt.texte.dgnbTec162} /></span>
                    <span className="text-[9px] text-slate-420 block"><MdText text={inhalt.texte.ressourcenpassFürGebäude} /></span>
                  </div>
                </div>

                {/* Building Parameters */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider"><MdText text={inhalt.texte.t1Gebäudestammdaten} /></span>
                  <div className="grid grid-cols-2 gap-y-2 mt-2 p-3 bg-slate-50 border border-home-grau/30 rounded-lg text-xs font-normal text-slate-600">
                    <div>Szenario: <strong className="text-slate-900 block font-semibold">{archetype.name}</strong></div>
                    <div>Berechnungsgrundlage: <strong className="text-slate-900 block font-semibold"><MdText text={inhalt.texte.bomMassenTakeOff} /></strong></div>
                    <div><MdText text={inhalt.texte.bruttogrundflächeBgf2} /><strong className="text-slate-900 block font-semibold">{formatDeIntl(gfa)} m²</strong></div>
                    <div><MdText text={inhalt.texte.konstruktiveFügung} /><strong className="text-slate-900 block font-semibold">
                      {joiningMethod === 'screwed' ? inhalt.werte.zerstörungsfreiTrocken : joiningMethod === 'mortar' ? 'Halb-demontierbar' : inhalt.werte.klassischNassStarr}
                    </strong></div>
                  </div>
                </div>

                {/* Circularity Evaluation */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider"><MdText text={inhalt.texte.t2ZirkuläreQualitätsbewertung} /></span>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    
                    <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/30 text-center">
                      <span className="text-[9px] text-slate-400 uppercase block font-medium"><MdText text={inhalt.texte.circularityCi} /></span>
                      <strong className={`text-2xl font-black block mt-0.5 ${
                        circularityIndex > 70 ? 'text-emerald-600' : circularityIndex > 40 ? 'text-blue-600' : 'text-slate-700'
                      }`}>
                        {formatDeWert(circularityIndex)}%
                      </strong>
                      <span className="text-[8px] text-slate-400 block leading-tight mt-0.5">Ressourcen-Effizienz</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/30 text-center">
                      <span className="text-[9px] text-slate-400 uppercase block font-medium"><MdText text={inhalt.texte.urbanMiningWert} /></span>
                      <strong className="text-xl font-black text-slate-900 block mt-0.5">
                        € {formatDeIntl(totalResidualValue)}
                      </strong>
                      <span className="text-[8px] text-slate-400 block leading-tight mt-0.5">
                        {formatDeWert(residualValuePerM2)} €/m² BGF
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/30 text-center">
                      <span className="text-[9px] text-slate-400 uppercase block font-medium">CO₂-Speicher</span>
                      <strong className="text-2xl font-black text-emerald-600 block mt-0.5">
                        -{formatDeWert(carbonStoredTons)} t
                      </strong>
                      <span className="text-[8px] text-slate-400 block leading-tight mt-0.5"><MdText text={inhalt.texte.inHolzMasse} /></span>
                    </div>

                  </div>
                </div>

                {/* Mass breakdown inventory table */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider"><MdText text={inhalt.texte.t3VerbauteRohstoffmassen} /></span>
                  <div className="border border-home-grau/30 rounded-lg overflow-hidden mt-2">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-home-grau/30">
                        <tr>
                          <th className="p-2 pl-3"><MdText text={inhalt.texte.stoffgruppeHauptgruppe} /></th>
                          <th className="p-2 text-right">Volumen/Gewicht</th>
                          <th className="p-2 text-right">BOM-Masse %</th>
                          <th className="p-2 text-right"><MdText text={inhalt.texte.rückbaubarkeitOutput} /></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-normal">
                        <tr>
                          <td className="p-2 pl-3 font-semibold"><MdText text={inhalt.texte.normalbetonC3037} /></td>
                          <td className="p-2 text-right font-mono">{formatDeIntl(concreteTons, {maximumFractionDigits: 0})} t</td>
                          <td className="p-2 text-right font-mono">{formatDeZahl(((concreteTons / totalWeightTons) * 100), 1)}%</td>
                          <td className="p-2 text-right font-mono">{joiningMethod === 'screwed' ? '90%' : joiningMethod === 'mortar' ? '60%' : '0%'}</td>
                        </tr>
                        <tr>
                          <td className="p-2 pl-3 font-semibold"><MdText text={inhalt.texte.tragwerksstahlHebB500} /></td>
                          <td className="p-2 text-right font-mono">{formatDeIntl(steelTons, {maximumFractionDigits: 1})} t</td>
                          <td className="p-2 text-right font-mono">{formatDeZahl(((steelTons / totalWeightTons) * 100), 1)}%</td>
                          <td className="p-2 text-right font-mono">{joiningMethod === 'screwed' ? '98%' : joiningMethod === 'mortar' ? '80%' : '50%'}</td>
                        </tr>
                        {woodTons > 0 && (
                          <tr>
                            <td className="p-2 pl-3 font-semibold text-emerald-700"><MdText text={inhalt.texte.brettschichtholzNadelholz} /></td>
                            <td className="p-2 text-right font-mono text-emerald-700">{formatDeIntl(woodTons, {maximumFractionDigits: 0})} t</td>
                            <td className="p-2 text-right font-mono text-emerald-700">{formatDeZahl(((woodTons / totalWeightTons) * 100), 1)}%</td>
                            <td className="p-2 text-right font-mono text-emerald-700">{joiningMethod === 'screwed' ? '85%' : joiningMethod === 'mortar' ? '40%' : '5%'}</td>
                          </tr>
                        )}
                        <tr>
                          <td className="p-2 pl-3 font-semibold"><MdText text={inhalt.texte.kupferHaustechnikmetalle} /></td>
                          <td className="p-2 text-right font-mono">{formatDeIntl(copperTons, {maximumFractionDigits: 2})} t</td>
                          <td className="p-2 text-right font-mono">{formatDeZahl(((copperTons / totalWeightTons) * 100), 1)}%</td>
                          <td className="p-2 text-right font-mono">95%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Compliance Statement */}
                <div className="pt-3 border-t border-home-grau/30 flex items-start gap-2 text-[9.5px] text-slate-400 font-normal leading-normal">
                  <CheckCircle size={14} className="text-purple-600 shrink-0 mt-0.5" />
                  <span><MdText text={inhalt.texte.dieBerechnungenDiesesRessourcenpasses} /></span>
                </div>

              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 border-t border-home-grau/30 p-4 shrink-0 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-200 rounded-xl text-xs font-semibold font-sans transition-all flex items-center gap-1 cursor-pointer"
              >
                <Award size={14} />
                <span><MdText text={inhalt.texte.grpDruckenPdf} /></span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-home-grau/30 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer"
              >
                Schließen
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1MassenbezogeneRecyclingquote}
        zielGleichung="R_{rec} = \frac{\sum m_i \cdot r_i}{\sum m_i}"
        schritte={inhalt.daten["Materialpaesse.schritte"]}
        ergebnisHinweis={inhalt.werte.dieHoheQuoteWird}
        normQuelle={inhalt.werte.dgnbKriteriumTec1}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2MaterialCircularity}
        zielGleichung="MCI = 1 - LFI \cdot F(X), \quad LFI = \frac{V + W}{2M}"
        schritte={inhalt.daten["Materialpaesse.schritte_2"]}
        ergebnisHinweis={inhalt.werte.derMciIstEin}
        normQuelle={inhalt.werte.ellenMacarthurFoundationCircularity}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="materialpaesse" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap13}
        wikipedia={[
          { title: 'Gebäuderessourcenpass' },
          { title: inhalt.werte.urbanMining, url: 'https://de.wikipedia.org/wiki/Urban_Mining' },
          { title: 'Kreislaufwirtschaft', url: 'https://de.wikipedia.org/wiki/Kreislaufwirtschaft' },
          { title: 'Ökobilanz', url: 'https://de.wikipedia.org/wiki/%C3%96kobilanz' }
        ]}
        regelwerke={inhalt.daten["Materialpaesse.regelwerke"]}
        literatur={inhalt.daten["Materialpaesse.literatur"]}
        formeln={inhalt.daten["Materialpaesse.formeln"]}
      />

    </div>
  );
}
