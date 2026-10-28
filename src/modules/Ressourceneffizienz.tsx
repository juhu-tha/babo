import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useId, useRef, useState } from 'react';
import { 
  Leaf, 
  BookOpen, 
  Activity, 
  TrendingUp, 
  Network, 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  Calculator, 
  Layers, 
  CheckCircle2, 
  Info, 
  ChevronRight, 
  DollarSign, 
  MapPin, 
  Share2, 
  FileText 
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/ressourceneffizienz/Ressourceneffizienz.json';
import { rcAufteilung } from '@/src/calc/rcBeton';
import { MdText } from '@/src/components/inhalt/MdText';
import { reiterZiel } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

// Define the tabs representing the 4 concepts of REZ Bayern
type RezTab = 'informieren' | 'handeln' | 'nutzen' | 'staerken';

interface ConceptCard {
  id: RezTab;
  title: string;
  subtitle: string;
  description: string;
  colorClass: string;
  borderColorClass: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface RStrategy {
  id: string;
  name: string;
  shortDe: string;
  category: string;
  categoryIndex: number;
  circularLevel: string;
  innovationLevel: string;
  positionPercent: number;
  innovationPercent: number;
  details: string;
  example: string;
  quote: string;
}

export const R_STRATEGIES: RStrategy[] = inhalt.daten.R_STRATEGIES;

export default function Ressourceneffizienz() {
  const [activeTab, setActiveTab] = useState<RezTab>('informieren');
  // Konzeptkarten als Reiter (AP 2.8): ARIA-Tabs mit Pfeiltasten wie ModuleTabs; die Karten tragen
  // Untertitel und Beschreibung, deshalb eigenes Markup mit der gemeinsamen Tastenlogik reiterZiel
  const reiterBasis = useId();
  const reiterRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [selectedR, setSelectedR] = useState<string>('R0');

  // Input states for Tab 2: Handeln (Material-Effizienz-Simulator)
  const [selectedBauteil, setSelectedBauteil] = useState<'slab' | 'column' | 'foundation'>('slab');
  const [concreteType, setConcreteType] = useState<'standard' | 'cem3' | 'rc_beton'>('standard');
  const [reinforcementRatio, setReinforcementRatio] = useState<number>(100); // 100% of standard reinforcement steel
  const [localAggregates, setLocalAggregates] = useState<boolean>(false); // Transportation distance
  const [optimizedGeometry, setOptimizedGeometry] = useState<boolean>(false); // 15% material reduction from structural optimization

  // Input states for Tab 3: Nutzen (ROI & Cost-Benefit-Rechner)
  const [projectSize, setProjectSize] = useState<number>(650); // m² usable area
  const [wasteOptimization, setWasteOptimization] = useState<number>(30); // % waste reduction by planning site sorting
  const [recyclingUsage, setRecyclingUsage] = useState<number>(20); // % RC construction materials used in standard works

  // Bavarian Region selection for Tab 4: Stärken
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const concepts: ConceptCard[] = [
    {
      id: 'informieren',
      title: 'Informieren',
      subtitle: inhalt.werte.wissenSensibilisierung,
      description: inhalt.werte.systematischesErschließenVonFachwissen,
      colorClass: 'bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/55 dark:hover:bg-slate-800/80 text-slate-850 dark:text-slate-100',
      borderColorClass: 'border-slate-200 dark:border-slate-800',
      icon: BookOpen
    },
    {
      id: 'handeln',
      title: 'Handeln',
      subtitle: inhalt.werte.werkzeugePraxis,
      description: inhalt.werte.konkreteMaßnahmenZurMaterialeinsparung,
      colorClass: 'bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/55 dark:hover:bg-slate-800/80 text-slate-850 dark:text-slate-100',
      borderColorClass: 'border-slate-200 dark:border-slate-800',
      icon: Activity
    },
    {
      id: 'nutzen',
      title: 'Nutzen',
      subtitle: inhalt.werte.wirtschaftlichkeitÖkologie,
      description: inhalt.werte.erfassungDerÖkologischenUnd,
      colorClass: 'bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/55 dark:hover:bg-slate-800/80 text-slate-850 dark:text-slate-100',
      borderColorClass: 'border-slate-200 dark:border-slate-800',
      icon: TrendingUp
    },
    {
      id: 'staerken',
      title: 'Stärken',
      subtitle: inhalt.werte.kompetenzNetzwerke,
      description: inhalt.werte.verankerungDerRessourceneffizienzIn,
      colorClass: 'bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/55 dark:hover:bg-slate-800/80 text-slate-850 dark:text-slate-100',
      borderColorClass: 'border-slate-200 dark:border-slate-800',
      icon: Network
    }
  ];

  // Logic for Material Efficiency Calculations (Tab 2)
  const getSimulationsLog = () => {
    // Standard baseline values for 100m³ slab/columns/foundations
    const volume = selectedBauteil === 'slab' ? 120 : selectedBauteil === 'column' ? 30 : 150; // m³
    const geomFactor = optimizedGeometry ? 0.85 : 1.0;
    const finalVolume = volume * geomFactor;

    // Weight Calculations (approx. 2.4 t/m³ concrete)
    // RC-Anteil nach DIN 1045-2:2023-08, Anhang E: 45 Vol.-% der groben Gesteinskörnung (Typ 1), Kern src/calc/rcBeton.ts (T12-RE-1)
    const rc = rcAufteilung(finalVolume, concreteType === 'rc_beton');
    const primaryGravelNeed = rc.primaer;
    const secondaryGravelNeed = rc.rezykliert;
    
    // Carbon footprint (kg CO2-eq per m³ concrete + steel contribution)
    // CEM I (Standard): ~310 kg; CEM III (low carbon): ~170 kg; RC-Beton (with CEM III): ~155 kg CO2/m³
    const kgCo2PerM3 = concreteType === 'standard' ? 310 : concreteType === 'cem3' ? 170 : 155;
    
    // Bewehrungsgehalt (Lehrwerte): Platte 110, Stütze 170, Fundament 70 kg/m³
    const steelIntensity = selectedBauteil === 'slab' ? 110 : selectedBauteil === 'column' ? 170 : 70; // kg/m³
    const finalSteelWeightKilograms = (finalVolume * steelIntensity) * (reinforcementRatio / 100);
    const steelCo2PerKg = 1.3; // Standard rebar CO2 factor

    // Logistics penalty (km and emission factor)
    const distanceKm = localAggregates ? 15 : 65; // local regional quarries vs imports
    const transportCo2PerTonKm = 0.08; // kg/tkm
    const concreteMassTons = finalVolume * 2.4;
    const logisticsCo2 = concreteMassTons * distanceKm * transportCo2PerTonKm;

    const concreteCo2 = finalVolume * kgCo2PerM3;
    const steelCo2 = (finalSteelWeightKilograms * steelCo2PerKg);
    const totalCo2 = concreteCo2 + steelCo2 + logisticsCo2;

    // Baseline calculation (Standard concrete type, 100% reinforcement ratio, standard transport, non-optimized geometry)
    const baselineVolume = volume;
    const baselineSteelWeightKgs = volume * steelIntensity;
    const baselineConcreteCo2 = baselineVolume * 310;
    const baselineSteelCo2 = baselineSteelWeightKgs * steelCo2PerKg;
    const baselineLogisticsCo2 = (baselineVolume * 2.4) * 65 * transportCo2PerTonKm;
    const baselineTotalCo2 = baselineConcreteCo2 + baselineSteelCo2 + baselineLogisticsCo2;

    const co2SavingsPercent = Math.max(0, ((baselineTotalCo2 - totalCo2) / baselineTotalCo2) * 100);
    const primaryMineralSavings = Math.max(0, rcAufteilung(baselineVolume, false).primaer - primaryGravelNeed);

    return {
      finalVolume: formatDeZahl(finalVolume, 0),
      rawMass: formatDeZahl((finalVolume * 2.4), 0),
      concreteCo2: formatDeZahl((concreteCo2 / 1000), 1),
      steelCo2: formatDeZahl((steelCo2 / 1000), 1),
      logisticsCo2: formatDeZahl((logisticsCo2 / 1000), 1),
      totalCo2: formatDeZahl((totalCo2 / 1000), 1),
      baselineCo2: formatDeZahl((baselineTotalCo2 / 1000), 1),
      co2SavingsPercent: formatDeZahl(co2SavingsPercent, 0),
      primaryMineralSavings: formatDeZahl(primaryMineralSavings, 1),
      secondaryGravelNeed: formatDeZahl(secondaryGravelNeed, 1),
      rebarWeight: formatDeZahl((finalSteelWeightKilograms / 1000), 1)
    };
  };

  const simResult = getSimulationsLog();

  // Logic for Cost Benefit Calculations (Tab 3)
  const getCostBenefits = () => {
    // Baumasse je m² Nutzfläche (Lehrwert): 1,45 t
    const totalMassTons = projectSize * 1.45;
    // Bauabfallquote bei der Errichtung (Lehrwert): 3,5 %
    const standardConstructionWasteTons = totalMassTons * 0.035;
    // Optimized waste quantity
    const optimizedWasteTons = standardConstructionWasteTons * (1 - wasteOptimization / 100);
    
    // Entsorgungskosten (Lehrwert): 38 €/t
    const standardDisposalCost = standardConstructionWasteTons * 38;
    const optimizedDisposalCost = optimizedWasteTons * 38;
    const disposalSavings = standardDisposalCost - optimizedDisposalCost;

    // Material cost savings by purchasing RC materials or optimizing thickness
    // Ersparnis RC-Gesteinskörnung gegenüber Primärkies inkl. Logistik (Lehrwert): 7,5 €/t
    const massiveMineralDemandTons = totalMassTons * 0.65; // 65% of building is mineralic
    const rcSubstitutionTons = massiveMineralDemandTons * (recyclingUsage / 100);
    const materialCostSavings = rcSubstitutionTons * 7.5; // average savings rate with logistics optimization in Bavaria

    // Total CO2 credits or taxes saved (assuming future scenario / current carbon taxes of € 45 to € 85/ton)
    const co2ReductionTons = projectSize * 0.085 * (recyclingUsage / 100 + wasteOptimization / 200); // estimation model
    const co2TaxSavings = co2ReductionTons * 65; // €65 per ton CO2-eq

    // State / Bavaria "Klimaschutzförderung" bonus (extra funding points in Bavaria e.g. BayFina / KfW climate premiums)
    const fundingBonus = recyclingUsage >= 25 ? (projectSize * 8.5) : 0;

    const totalAnnualBenefits = disposalSavings + materialCostSavings + co2TaxSavings + fundingBonus;
    const certificationBonus = recyclingUsage >= 30 ? inhalt.werte.positiverBeitragZuZertifizierungskriteri : 'Basis-Standard';

    return {
      wasteBaseline: formatDeZahl(standardConstructionWasteTons, 1),
      wasteOptimized: formatDeZahl(optimizedWasteTons, 1),
      disposalSavings: formatDeZahl(disposalSavings, 0),
      materialCostSavings: formatDeZahl(materialCostSavings, 0),
      co2TaxSavings: formatDeZahl(co2TaxSavings, 0),
      fundingBonus: formatDeZahl(fundingBonus, 0),
      totalAnnualBenefits: formatDeZahl(totalAnnualBenefits, 0),
      certificationBonus
    };
  };

  const costResult = getCostBenefits();

  // Regional Network data for Tab 4: Stärken
  const regionalHubs = inhalt.daten["Ressourceneffizienz.regionalHubs"];

  const filteredHubs = selectedRegion === 'all' 
    ? regionalHubs 
    : regionalHubs.filter(h => h.region === selectedRegion);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Welcome Title Card */}
      <div className="bg-shiraz/5 text-text-main rounded-2xl p-6 md:p-8 shadow-md border border-shiraz/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Leaf size={140} className="text-shiraz" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="bg-shiraz/20 text-shiraz dark:text-rose-300 border border-shiraz/35 px-3 py-1 rounded-full text-xs font-bold leading-none uppercase tracking-wider"><MdText text={inhalt.texte.kooperationThAugsburgRez} /></span>
            <span className="bg-white text-slate-700 border border-home-grau/30 px-3 py-1 rounded-full text-xs font-mono"><MdText text={inhalt.texte.standLfu2026} /></span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-text-main flex items-center gap-3">
              <Leaf className="text-shiraz dark:text-rose-400 shrink-0 w-8 h-8" /><MdText text={inhalt.texte.ressourceneffizienzImBauwesen} /></h2>
            <p className="text-slate-700 max-w-3xl text-sm md:text-base leading-relaxed">
              Die Schonung natürlicher Ressourcen gehört zu den drängendsten Aufgaben im Bauwesen. 
              Durch Materialeinsparung, selektiven Rückbau und den zielführenden Einsatz von mineralischen Recycling-Baustoffen 
              schließen wir Kreisläufe und dekarbonisieren die Wertschöpfungskette. Entdecken Sie die vier Säulen des 
              <strong><MdText text={inhalt.texte.ressourceneffizienzZentrumsBayernRez} /></strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of the 4 Pillars as big action Cards */}
      <div
        role="tablist"
        aria-label={inhalt.werte.bereicheRessourceneffizienz}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        onKeyDown={(e) => {
          const ziel = reiterZiel(e.key, Math.max(0, concepts.findIndex(c => c.id === activeTab)), concepts.length);
          if (ziel < 0) return;
          e.preventDefault();
          setActiveTab(concepts[ziel].id);
          reiterRefs.current[ziel]?.focus();
        }}
      >
        {concepts.map((concept, index) => {
          const IconComponent = concept.icon;
          const isSelected = activeTab === concept.id;
          return (
            <button
              key={concept.id}
              ref={el => { reiterRefs.current[index] = el; }}
              type="button"
              role="tab"
              id={`${reiterBasis}-tab-${concept.id}`}
              aria-selected={isSelected}
              aria-controls={`${reiterBasis}-panel`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveTab(concept.id)}
              className={`text-left p-5 rounded-xl border ${concept.borderColorClass} transition-all duration-200 transform hover:-translate-y-0.5 ${concept.colorClass} ${
                isSelected 
                  ? 'ring-2 ring-shiraz ring-offset-2 dark:ring-offset-slate-950 scale-[1.01] shadow-md border-transparent bg-white dark:bg-slate-900 border-shiraz dark:border-shiraz' 
                  : 'shadow-sm bg-white/60 dark:bg-slate-900/60 hover:shadow'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm inline-flex items-center justify-center border border-slate-150 dark:border-slate-800">
                  <IconComponent className="text-slate-900 dark:text-slate-200 w-5 h-5" />
                </div>
                <ChevronRight size={16} className={`text-slate-400 transition-transform ${isSelected ? 'rotate-90 text-shiraz' : ''}`} />
              </div>
              
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-bold">
                  Konzept {concepts.indexOf(concept) + 1}
                </span>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  {concept.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium pb-2 italic">
                  {concept.subtitle}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-normal line-clamp-3 md:line-clamp-none border-t border-slate-100 dark:border-slate-800 pt-2">
                  {concept.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main interactive segment based on chosen pillar */}
      <div
        role="tabpanel"
        id={`${reiterBasis}-panel`}
        aria-labelledby={`${reiterBasis}-tab-${activeTab}`}
        tabIndex={0}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden focus:outline-none"
      >
        
        {/* Navigation bar mirroring the selection */}
        <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-shiraz/10 text-shiraz">
              <Leaf size={16} />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white font-mono uppercase tracking-wider">
              Fokusbereich: {concepts.find(c => c.id === activeTab)?.title}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-450 font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg">
            <Info size={14} className="text-blue-500" />
            <span><MdText text={inhalt.texte.klickenSieObenAuf} /></span>
          </div>
        </div>

        <div className="p-6 md:p-8">
          
          {/* TAB 1: INFORMIEREN (Wissen & Sensibilisierung) */}
          {activeTab === 'informieren' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Info Text Column */}
                <div className="lg:col-span-7 space-y-4">
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen size={18} className="text-shiraz" /><MdText text={inhalt.texte.wissenstransferSensibilisierungDesRez} /></h4>
                  
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"><MdText text={inhalt.texte.dasRessourceneffizienzZentrumBayern} /></p>
                  
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider"><MdText text={inhalt.texte.dasMultibarrierenUndKaskadenprinzip} /></span>
                    <ul className="text-xs text-slate-600 dark:text-slate-350 space-y-2">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="text-shiraz shrink-0 mt-0.5" size={14} />
                        <span><MdText text={inhalt.texte.informationsangebotePublikationNeutraler} /></span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="text-shiraz shrink-0 mt-0.5" size={14} />
                        <span><MdText text={inhalt.texte.technologieVergleichAbwägungDer} /></span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="text-shiraz shrink-0 mt-0.5" size={14} />
                        <span><MdText text={inhalt.texte.bayerischeBestimmungenHilfestellungenZur} /></span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-start gap-3">
                    <HelpCircle className="text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" size={16} />
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white text-xs"><MdText text={inhalt.texte.schonGewusstProfHubers} /></span>
                      <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed"><MdText text={inhalt.texte.mineralischeBauUndAbbruchabfälle} /></p>
                    </div>
                  </div>
                </div>

                {/* Circular Data Chart Dashboard Column */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-4">
                    <span className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold block"><MdText text={inhalt.texte.faktenDatenbankBayern} /></span>
                    <h5 className="font-extrabold text-xs text-slate-900 dark:text-white"><MdText text={inhalt.texte.zusammensetzungVerbleibBayerischerMinera} /></h5>
                    
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <span><MdText text={inhalt.texte.straßenbauErdbauVerfüllung} /></span>
                          <span className="font-mono text-slate-700 dark:text-slate-300">72 %</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-slate-600 dark:bg-slate-400 h-full rounded-full" style={{ width: '72%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <span><MdText text={inhalt.texte.deponierungAbfallbeseitigung} /></span>
                          <span className="font-mono text-slate-600 dark:text-slate-400">18 %</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-slate-450 dark:bg-slate-500 h-full rounded-full" style={{ width: '18%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <span><MdText text={inhalt.texte.hochwertigesRcMaterialHochbau} /></span>
                          <span className="font-mono text-shiraz dark:text-rose-400">10 %</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-shiraz dark:bg-rose-600 h-full rounded-full" style={{ width: '10%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-800 pt-3 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-400 shrink-0"></span>
                        <span><MdText text={inhalt.texte.downcyclingSchütztZwarDeponieraum} /></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-shiraz shrink-0"></span>
                        <span><MdText text={inhalt.texte.politischesZielMehrRc} /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section visual divider */}
              <div className="border-t border-slate-200/80 dark:border-slate-800 pt-8 mt-8"></div>

              {/* Interactive R-Strategies visual dashboard from Attachment */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold px-2 py-0.5 rounded font-mono uppercase"><MdText text={inhalt.texte.rStrategienDesProduktlebenszyklus} /></span>
                    <span className="text-xs text-slate-500 font-bold"><MdText text={inhalt.texte.bayerischesRessourceneffizienzZentrumBay} /></span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Leaf className="text-shiraz dark:text-rose-400 w-5 h-5" /><MdText text={inhalt.texte.derZirkuläreProduktlebenszyklusInnovativ} /></h3>
                  <p className="text-xs text-slate-650 dark:text-slate-350 max-w-4xl leading-relaxed"><MdText text={inhalt.texte.dieSchonungDerRohstoffvorräte} /></p>
                </div>

                  {/* Core 3-Column Grid representing the original attachment layout structure */}
                  {(() => {
                    const activeStrategy = R_STRATEGIES.find(x => x.id === selectedR) || R_STRATEGIES[0];
                    const activeIndex = R_STRATEGIES.indexOf(activeStrategy);
                    const primaerScore = (10 - activeIndex) / 2;
                    const complexScore = activeStrategy.innovationPercent / 20;
                    const co2Score = (10 - activeIndex) / 2 + 1;

                    return (
                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                        
                        {/* Matrix layout (Columns 0 to 2) - takes 8 columns out of 12 */}
                        <div className="xl:col-span-8 space-y-5">
                          
                          <AuswahlGruppe label="R-Strategie" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            
                            {/* Column 0: Produkte einsparen (R0-R2) */}
                            <div className="flex flex-col gap-3">
                              <div className="bg-shiraz/10 dark:bg-slate-950 border border-shiraz/20 dark:border-slate-800 text-text-main px-3 py-2 text-center text-xs uppercase font-black tracking-tight rounded-t-xl select-none min-h-[46px] flex items-center justify-center"><MdText text={inhalt.texte.produkteEinsparenKlügerNutzen} /></div>
                              <div className="flex flex-col gap-3 bg-slate-50/40 dark:bg-slate-900/10 p-2.5 rounded-b-xl border border-slate-150 dark:border-slate-800 p-3 flex-1">
                                {R_STRATEGIES.filter(r => r.categoryIndex === 0).map((strategy) => (
                                  <button {...alsOption(selectedR === strategy.id)}
                                    key={strategy.id}
                                    type="button"
                                    onClick={() => setSelectedR(strategy.id)}
                                    className={`flex flex-col w-full text-left rounded-xl overflow-hidden border transition-all transform ${
                                      selectedR === strategy.id
                                        ? 'ring-2 ring-shiraz dark:ring-rose-500 scale-[1.03] shadow-md border-shiraz dark:border-rose-500 bg-white dark:bg-slate-900/90'
                                        : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow hover:scale-[1.01]'
                                    }`}
                                  >
                                    <div className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 px-3 py-2 font-black text-xs uppercase flex justify-between items-center w-full border-b border-slate-200/50 dark:border-slate-700/50">
                                      <span>{strategy.id} / {strategy.name}</span>
                                      <span className="text-[8px] bg-slate-200 dark:bg-slate-700 dark:text-slate-350 text-slate-700 px-1 py-0.2 rounded font-bold">
                                        RADIKAL
                                      </span>
                                    </div>
                                    <div className="p-3 bg-slate-50/30 dark:bg-slate-900/40 flex-1 min-h-[64px] flex items-center w-full">
                                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-normal">
                                        {strategy.shortDe}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Column 1: Lebensdauer erhöhen (R3-R6) */}
                            <div className="flex flex-col gap-3">
                              <div className="bg-shiraz/10 dark:bg-slate-950 border border-shiraz/20 dark:border-slate-800 text-text-main px-3 py-2 text-center text-xs uppercase font-black tracking-tight rounded-t-xl select-none min-h-[46px] flex items-center justify-center"><MdText text={inhalt.texte.lebensdauerVonProduktenOder} /></div>
                              <div className="flex flex-col gap-3 bg-slate-50/40 dark:bg-slate-900/20 p-2.5 rounded-b-xl border border-slate-150 dark:border-slate-800 p-3 flex-1">
                                {R_STRATEGIES.filter(r => r.categoryIndex === 1).map((strategy) => (
                                  <button {...alsOption(selectedR === strategy.id)}
                                    key={strategy.id}
                                    type="button"
                                    onClick={() => setSelectedR(strategy.id)}
                                    className={`flex flex-col w-full text-left rounded-xl overflow-hidden border transition-all transform ${
                                      selectedR === strategy.id
                                        ? 'ring-2 ring-shiraz dark:ring-rose-500 scale-[1.03] shadow-md border-shiraz dark:border-rose-500 bg-white dark:bg-slate-900/90'
                                        : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow hover:scale-[1.01]'
                                    }`}
                                  >
                                    <div className="bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-200 px-3 py-2 font-black text-xs uppercase flex justify-between items-center w-full border-b border-slate-200/50 dark:border-slate-700/50">
                                      <span>{strategy.id} / {strategy.name}</span>
                                      <span className="text-[8px] bg-slate-200 dark:bg-slate-700 dark:text-slate-350 text-slate-700 px-1 py-0.2 rounded font-bold">
                                        WERTERHALT
                                      </span>
                                    </div>
                                    <div className="p-3 bg-slate-50/30 dark:bg-slate-900/40 flex-1 min-h-[64px] flex items-center w-full">
                                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-normal">
                                        {strategy.shortDe}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Column 2: Material sinnvoll wiederverwenden (R7-R9) */}
                            <div className="flex flex-col gap-3">
                              <div className="bg-shiraz/10 dark:bg-slate-950 border border-shiraz/20 dark:border-slate-800 text-text-main px-3 py-2 text-center text-xs uppercase font-black tracking-tight rounded-t-xl select-none min-h-[46px] flex items-center justify-center"><MdText text={inhalt.texte.materialSinnvollWiederverwenden} /></div>
                              <div className="flex flex-col gap-3 bg-slate-50/40 dark:bg-slate-900/20 p-2.5 rounded-b-xl border border-slate-150 dark:border-slate-800 p-3 flex-1">
                                {R_STRATEGIES.filter(r => r.categoryIndex === 2).map((strategy) => (
                                  <button {...alsOption(selectedR === strategy.id)}
                                    key={strategy.id}
                                    type="button"
                                    onClick={() => setSelectedR(strategy.id)}
                                    className={`flex flex-col w-full text-left rounded-xl overflow-hidden border transition-all transform ${
                                      selectedR === strategy.id
                                        ? 'ring-2 ring-shiraz dark:ring-rose-500 scale-[1.03] shadow-md border-shiraz dark:border-rose-500 bg-white dark:bg-slate-900/90'
                                        : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow hover:scale-[1.01]'
                                    }`}
                                  >
                                    <div className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 px-3 py-2 font-black text-xs uppercase flex justify-between items-center w-full border-b border-slate-200/50 dark:border-slate-700/50">
                                      <span>{strategy.id} / {strategy.name}</span>
                                      <span className="text-[8px] bg-slate-200 dark:bg-slate-700 dark:text-slate-350 text-slate-700 px-1 py-0.2 rounded font-bold">
                                        RECYCLING
                                      </span>
                                    </div>
                                    <div className="p-3 bg-slate-50/30 dark:bg-slate-900/40 flex-1 min-h-[64px] flex items-center w-full">
                                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-normal">
                                        {strategy.shortDe}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>

                          </AuswahlGruppe>

                          {/* Dynamic slider tracking double bars from Attachment bottom */}
                          <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-4">
                            
                            {/* Bar 1: Zirkulare Wertschöpfung with automatic pointer tracking */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <span><MdText text={inhalt.texte.zirkulareWertschöpfung} /></span>
                                </span>
                                <span className="text-shiraz dark:text-rose-450 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded font-mono">
                                  Einordnung: {activeStrategy.circularLevel}
                                </span>
                              </div>
                              <div className="relative w-full h-8 bg-gradient-to-r from-slate-700 dark:from-slate-800 via-slate-500 dark:via-slate-600 to-slate-400 dark:to-slate-500 rounded-lg flex items-center justify-between px-4 overflow-hidden select-none">
                                <span className="text-white text-xs font-black uppercase tracking-wider z-10 flex items-center gap-1"><MdText text={inhalt.texte.highLevel} /></span>
                                <span className="text-white text-xs font-black tracking-widest uppercase opacity-85 z-10 font-sans hidden sm:inline"><MdText text={inhalt.texte.zirkulareWertschöpfung2} /></span>
                                <span className="text-white text-xs font-black uppercase tracking-wider z-10 flex items-center gap-1">
                                  LOW-LEVEL ▶
                                </span>

                                {/* Slider pointer widget */}
                                <div 
                                  className="absolute top-0 bottom-0 w-2.5 bg-shiraz dark:bg-rose-500 hover:bg-shiraz/80 shadow-xl ring-2 ring-white dark:ring-slate-900 transition-all duration-300 transform -translate-x-1/2"
                                  style={{ left: `${activeStrategy.positionPercent}%` }}
                                >
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-950 dark:bg-slate-100 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[7px] font-bold text-white dark:text-slate-950 leading-none shadow">
                                    {activeStrategy.id}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Bar 2: Innovationsbedarf with automatic pointer tracking */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400">
                                <span>Innovationsbedarf</span>
                                <span className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded font-mono">
                                  Entwicklungs-Aufwand: {activeStrategy.innovationLevel}
                                </span>
                              </div>
                              <div className="relative w-full h-8 bg-gradient-to-r from-slate-700 dark:from-slate-800 via-slate-550 dark:via-slate-600 to-slate-400 dark:to-slate-500 rounded-lg flex items-center justify-between px-4 overflow-hidden select-none">
                                <span className="text-white text-xs font-black uppercase tracking-wider z-10 flex items-center gap-1">
                                  ◀ RADIKAL
                                </span>
                                <span className="text-white text-xs font-black tracking-widest uppercase opacity-85 z-10 font-sans hidden sm:inline">
                                  Innovationsbedarf
                                </span>
                                <span className="text-white text-xs font-black uppercase tracking-wider z-10 flex items-center gap-1"><MdText text={inhalt.texte.inkrementell} /></span>

                                {/* Slider pointer widget */}
                                <div 
                                  className="absolute top-0 bottom-0 w-2.5 bg-shiraz dark:bg-rose-500 hover:bg-shiraz/80 shadow-xl ring-2 ring-white dark:ring-slate-900 transition-all duration-300 transform -translate-x-1/2"
                                  style={{ left: `${activeStrategy.innovationPercent}%` }}
                                >
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-950 dark:bg-slate-100 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[7px] font-extrabold text-white dark:text-slate-950 leading-none shadow">
                                    {activeStrategy.id}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Source and validation notice */}
                            <div className="flex justify-between items-center text-xs text-slate-450 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-2 font-medium">
                              <span><MdText text={inhalt.texte.quellePrognos2023Basierend} /></span>
                              <span><MdText text={inhalt.texte.lfuRezBayernHandlungsrahmen} /></span>
                            </div>

                          </div>

                        </div>

                        {/* Interactive bento-details card side panel - takes 4 columns out of 12 */}
                        <div className="xl:col-span-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                          
                          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                            <span className="text-xs font-bold text-shiraz dark:text-rose-400 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono inline-block">
                              Ausgewählt: {activeStrategy.category}
                            </span>
                            
                            <div className="flex items-center gap-2.5 mt-2">
                              <span className="w-12 h-12 rounded-xl bg-shiraz dark:bg-rose-600 text-white font-black text-lg flex items-center justify-center font-mono border border-slate-300 dark:border-slate-700 shadow-sm shrink-0">
                                {activeStrategy.id}
                              </span>
                              <div>
                                <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                                  {activeStrategy.name}
                                </h4>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">
                                  Stufe {R_STRATEGIES.indexOf(activeStrategy)} von 9
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* German summary description */}
                          <div className="space-y-1">
                            <span className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-extrabold block"><MdText text={inhalt.texte.deutscheFormulierung} /></span>
                            <p className="text-xs text-slate-800 dark:text-slate-100 font-bold leading-normal">
                              "{activeStrategy.shortDe}"
                            </p>
                          </div>

                          {/* Quote / slogan */}
                          <div className="bg-slate-100 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-650 dark:text-slate-300 font-medium italic relative">
                            <span className="text-2xl text-slate-300 dark:text-slate-600 font-serif absolute top-1 left-2 pointer-events-none">“</span>
                            <p className="pl-4 leading-relaxed relative z-10 pr-2">
                              {activeStrategy.quote}
                            </p>
                          </div>

                          {/* In-depth details */}
                          <div className="space-y-1 pt-1">
                            <span className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-extrabold block"><MdText text={inhalt.texte.bedeutungEinordnung} /></span>
                            <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed">
                              {activeStrategy.details}
                            </p>
                          </div>

                          {/* Specific construction examples */}
                          <div className="bg-shiraz/5 border border-shiraz/20 dark:border-rose-950/40 p-4 rounded-xl space-y-2">
                            <span className="text-xs uppercase text-shiraz dark:text-rose-400 font-black tracking-wider flex items-center gap-1.5 leading-none">
                              <CheckCircle2 size={11} className="text-shiraz dark:text-rose-400" /><MdText text={inhalt.texte.praxisbeispielImBayerischenBauwesen} /></span>
                            <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
                              {activeStrategy.example}
                            </p>
                          </div>

                          {/* Scorecard visualization */}
                          <div className="space-y-2 pt-1 border-t border-slate-150 dark:border-slate-800">
                            <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-extrabold block leading-none">Bewertungspotenziale:</span>
                            
                            <div className="space-y-2 text-xs">
                              
                              <div className="flex items-center justify-between">
                                <span className="text-slate-550 dark:text-slate-350 font-medium">Primärrohstoff-Schonung:</span>
                                <div className="flex gap-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span 
                                      key={i} 
                                      className={`w-2.5 h-2.5 rounded-full ${
                                        i < primaerScore ? 'bg-shiraz dark:bg-rose-500' : 'bg-slate-200 dark:bg-slate-800'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-slate-550 dark:text-slate-350 font-medium">Entwicklungs-Komplexität:</span>
                                <div className="flex gap-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span 
                                      key={i} 
                                      className={`w-2.5 h-2.5 rounded-full ${
                                        i < complexScore ? 'bg-slate-500 dark:bg-slate-400' : 'bg-slate-200 dark:bg-slate-800'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-slate-550 dark:text-slate-350 font-medium"><MdText text={inhalt.texte.klimaschutzWirkungCo} /></span>
                                <div className="flex gap-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span 
                                      key={i} 
                                      className={`w-2.5 h-2.5 rounded-full ${
                                        i < co2Score ? 'bg-shiraz dark:bg-rose-500' : 'bg-slate-200 dark:bg-slate-800'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>

                            </div>
                          </div>

                        </div>
                      </div>

                    );
                  })()}
                </div>
              </div>
            )}

            {activeTab === 'handeln' && (
            <div className="space-y-6 animate-in fade-in duration-200 animate-slide-in">
              <div className="bg-shiraz/5 border border-shiraz/20 dark:border-rose-950/20 p-4 rounded-xl flex items-start gap-3">
                <Sparkles className="text-shiraz dark:text-rose-450 shrink-0 mt-0.5" size={16} />
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white text-xs text-shiraz-950"><MdText text={inhalt.texte.interaktiverWerkstoffKonstruktionsoptimi} /></span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed"><MdText text={inhalt.texte.spielenSieUnterschiedlicheTragwerksbauwe} /></p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Configuration Column */}
                <div className="lg:col-span-5 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
                    <Calculator size={14} className="text-shiraz dark:text-rose-500" /><MdText text={inhalt.texte.tragwerkBetonmischungKonfigurieren} /></h4>

                  {/* Bauteil selection */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block"><MdText text={inhalt.texte.t1BauteiltypUndStandardmaß} /></label>
                    <select aria-label={inhalt.werte.t1BauteiltypUndStandardmaß} 
                      value={selectedBauteil}
                      onChange={(e) => setSelectedBauteil(e.target.value as typeof selectedBauteil)}
                      className="w-full px-2.5 py-1.5 border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-shiraz dark:focus:ring-rose-500"
                    >
                      <option value="slab">Stahlbetondeckenplatte (ca. 120 m³ Beton)</option>
                      <option value="column">Tragsäulen-Satz im Skelettbau (ca. 30 m³ Beton)</option>
                      <option value="foundation">Fundament- &amp; Bodenplatte (ca. 150 m³ Beton)</option>
                    </select>
                  </div>

                  {/* Concrete Class */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block"><MdText text={inhalt.texte.t2ZementGesteinskörnungsklasse} /></label>
                    <AuswahlGruppe label="Zement- und Gesteinskörnungsklasse" className="grid grid-cols-3 gap-2">
                      <button {...alsOption(concreteType === 'standard')} 
                        type="button"
                        onClick={() => setConcreteType('standard')}
                        className={`px-2 py-2 rounded-lg text-xs font-semibold border ${
                          concreteType === 'standard' 
                            ? 'bg-shiraz dark:bg-rose-600 text-white border-shiraz dark:border-rose-700 shadow-sm' 
                            : 'bg-white dark:bg-slate-800 text-slate-650 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80'
                        }`}
                      ><MdText text={inhalt.texte.standardCemI} /></button>
                      <button {...alsOption(concreteType === 'cem3')} 
                        type="button"
                        onClick={() => setConcreteType('cem3')}
                        className={`px-2 py-2 rounded-lg text-xs font-semibold border ${
                          concreteType === 'cem3' 
                            ? 'bg-shiraz dark:bg-rose-600 text-white border-shiraz dark:border-rose-700 shadow-sm' 
                            : 'bg-white dark:bg-slate-800 text-slate-650 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80'
                        }`}
                      ><MdText text={inhalt.texte.hüttensandCemIii} /></button>
                      <button {...alsOption(concreteType === 'rc_beton')} 
                        type="button"
                        onClick={() => setConcreteType('rc_beton')}
                        className={`px-2 py-2 rounded-lg text-xs font-semibold border ${
                          concreteType === 'rc_beton' 
                            ? 'bg-shiraz dark:bg-rose-600 text-white border-shiraz dark:border-rose-700 shadow-sm' 
                            : 'bg-white dark:bg-slate-800 text-slate-650 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80'
                        }`}
                      ><MdText text={inhalt.texte.rcBetonRezyklGesteinskörnung} /></button>
                    </AuswahlGruppe>
                  </div>

                  {/* Reinforcement ratio */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span><MdText text={inhalt.texte.t3BewehrungsgehaltStahl} /></span>
                      <span className="font-mono text-shiraz dark:text-rose-400">{formatDeWert(reinforcementRatio)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="150" 
                      step="5"
                      value={reinforcementRatio} 
                      onChange={(e) => setReinforcementRatio(parseInt(e.target.value) || 100)}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-shiraz dark:accent-rose-500"
                    />
                    <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
                      <span><MdText text={inhalt.texte.stahlminimiertFiligraner} /></span>
                      <span><MdText text={inhalt.texte.t100SollEurocode} /></span>
                      <span><MdText text={inhalt.texte.dichtBewehrt} /></span>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block"><MdText text={inhalt.texte.t4ProzessBauOptionen} /></label>
                    <div className="flex flex-col gap-2">
                      
                      {/* Regional quarry */}
                      <label className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-850/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800">
                        <input 
                          type="checkbox" 
                          checked={localAggregates} 
                          onChange={(e) => setLocalAggregates(e.target.checked)}
                          className="rounded border-slate-300 dark:border-slate-700 text-shiraz focus:ring-shiraz dark:focus:ring-rose-500 w-4 h-4"
                        />
                        <div className="flex flex-col text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200"><MdText text={inhalt.texte.regionaleGesteinskörnung} /></span>
                          <span className="text-slate-500 dark:text-slate-400 text-xs"><MdText text={inhalt.texte.verkürztTransportwegeVon65} /></span>
                        </div>
                      </label>

                      {/* Optimized structural thickness */}
                      <label className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-850/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800">
                        <input 
                          type="checkbox" 
                          checked={optimizedGeometry} 
                          onChange={(e) => setOptimizedGeometry(e.target.checked)}
                          className="rounded border-slate-300 dark:border-slate-700 text-shiraz focus:ring-shiraz dark:focus:ring-rose-500 w-4 h-4"
                        />
                        <div className="flex flex-col text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200"><MdText text={inhalt.texte.bauwerksintegrierteOptimierung} /></span>
                          <span className="text-slate-500 dark:text-slate-400 text-xs"><MdText text={inhalt.texte.sparsameElementstärkenHohlkörperdeckenSp} /></span>
                        </div>
                      </label>

                    </div>
                  </div>
                </div>

                {/* Outputs Real time Simulation */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900/60 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span><MdText text={inhalt.texte.echtzeitBerechnungBewertung} /></span>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 px-2 py-0.5 rounded text-xs font-mono"><MdText text={inhalt.texte.bayerischesLfuModell} /></span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    
                    <div className="bg-slate-50/65 dark:bg-slate-850/45 p-3 rounded-xl text-center space-y-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block uppercase"><MdText text={inhalt.texte.erforderlicheMasse} /></span>
                      <span className="font-mono text-lg font-bold text-slate-800 dark:text-slate-200">{simResult.rawMass} t</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 block"><MdText text={inhalt.texte.endgewichtDesBauteils} /></span>
                    </div>

                    <div className="bg-slate-50/65 dark:bg-slate-850/45 p-3 rounded-xl text-center space-y-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block uppercase">Primärkies-Schonung</span>
                      <span className="font-mono text-lg font-bold text-shiraz dark:text-rose-400">{simResult.primaryMineralSavings} t</span>
                      <span className="text-xs text-slate-450 dark:text-slate-550 block font-semibold"><MdText text={inhalt.texte.abbauradiusReduziert} /></span>
                    </div>

                    <div className="bg-slate-50/65 dark:bg-slate-850/45 p-3 rounded-xl text-center space-y-1 col-span-2 sm:col-span-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block uppercase"><MdText text={inhalt.texte.grauerCoGehalt} /></span>
                      <span className="font-mono text-lg font-bold text-slate-800 dark:text-slate-200">{simResult.totalCo2} t</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 block"><MdText text={inhalt.texte.inklTransportStahl} /></span>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50/60 dark:bg-slate-850/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-850">
                    <div className="md:col-span-4 text-center md:text-left space-y-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase block">CO₂-Einsparung</span>
                      <span className="font-mono text-2.5xl font-black text-shiraz dark:text-rose-450 block leading-none">{simResult.co2SavingsPercent}%</span>
                      <span className="text-xs text-slate-450 dark:text-slate-500 block italic"><MdText text={inhalt.texte.gegStandardSkelettbau} /></span>
                    </div>
                    <div className="md:col-span-8 text-xs text-slate-650 dark:text-slate-300 space-y-1.5 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-3 md:pt-0 md:pl-4">
                      <p><MdText text={inhalt.texte.vergleichsanalyseIhrOptimierterEntwurf} />{simResult.totalCo2}<MdText text={inhalt.texte.tonnenCoEqIm} /><strong>{simResult.baselineCo2} Tonnen</strong>.</p>
                      <p><MdText text={inhalt.texte.recyclingBonusSieVerwenden} />{simResult.secondaryGravelNeed}<MdText text={inhalt.texte.tAufbereitetenBauschuttUnd} /></p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider"><MdText text={inhalt.texte.handlungsempfehlungDesRezBayern} /></span>
                    <div className="p-3.5 bg-shiraz/5 border border-shiraz/10 dark:border-rose-950/20 rounded-xl text-xs text-slate-700 dark:text-slate-300 space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="text-shiraz dark:text-rose-450 shrink-0 mt-0.5" size={14} />
                        <span><MdText text={inhalt.texte.vergabeerleichterungNachBayerischemBauve} /></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="text-shiraz dark:text-rose-450 shrink-0 mt-0.5" size={14} />
                        <span><MdText text={inhalt.texte.mischungsrezepturAchtenSieAuf} /></span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* TAB 3: NUTZEN (Wirtschaftlichkeit & Ökologie) */}
          {activeTab === 'nutzen' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Inputs Columns */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
                      <TrendingUp size={14} className="text-shiraz dark:text-rose-500" />
                      Wirtschaftlichkeits-Faktoren
                    </h4>

                    <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed"><MdText text={inhalt.texte.legenSieFestWie} /></p>

                    {/* Input: Project Size */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span><MdText text={inhalt.texte.gebäudeNutzflächeM} /></span>
                        <span className="font-mono text-shiraz dark:text-rose-400 font-bold">{formatDeWert(projectSize)} m²</span>
                      </div>
                      <input 
                        type="range" 
                        min="100" 
                        max="3000" 
                        step="50"
                        value={projectSize} 
                        onChange={(e) => setProjectSize(parseInt(e.target.value) || 650)}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-shiraz dark:accent-rose-500"
                      />
                    </div>

                    {/* Input: Waste optimization */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span><MdText text={inhalt.texte.abfallvermeidungVorOrtGewerke} /></span>
                        <span className="font-mono text-shiraz dark:text-rose-400 font-bold">{formatDeWert(wasteOptimization)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="80" 
                        step="5"
                        value={wasteOptimization} 
                        onChange={(e) => { const v = Number(e.target.value); if (Number.isFinite(v)) setWasteOptimization(v); }}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-shiraz dark:accent-rose-500"
                      />
                      <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
                        <span><MdText text={inhalt.texte.unsortierterContainer} /></span>
                        <span><MdText text={inhalt.texte.hoheDisziplinSortiereimer} /></span>
                      </div>
                    </div>

                    {/* Input: Recycling substitution */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span><MdText text={inhalt.texte.rcBaustoffErsatzanteilIm} /></span>
                        <span className="font-mono text-shiraz dark:text-rose-400 font-bold">{formatDeWert(recyclingUsage)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="60" 
                        step="5"
                        value={recyclingUsage} 
                        onChange={(e) => { const v = Number(e.target.value); if (Number.isFinite(v)) setRecyclingUsage(v); }}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-shiraz dark:accent-rose-500"
                      />
                      <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
                        <span><MdText text={inhalt.texte.reinerPrimärkies} /></span>
                        <span><MdText text={inhalt.texte.maxStatischeRcLastung} /></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Economic Results Column */}
                <div className="lg:col-span-7 bg-slate-50/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span><MdText text={inhalt.texte.errechneterÖkonomischerMehrwertRoi} /></span>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 px-2 py-0.5 rounded text-xs font-mono"><MdText text={inhalt.texte.bayerischeTarifübersicht} /></span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-650 dark:text-slate-300 text-xs font-bold uppercase">
                        <DollarSign size={14} className="text-shiraz dark:text-rose-450" /><MdText text={inhalt.texte.deponiekostenGespart} /></div>
                      <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">+{costResult.disposalSavings} €</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal"><MdText text={inhalt.texte.reduzierterMischBauschuttVon} />{costResult.wasteBaseline} t auf <strong>{costResult.wasteOptimized} t</strong><MdText text={inhalt.texte.spartTeureKlassenEinstufungen} /></p>
                    </div>

                    <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-650 dark:text-slate-300 text-xs font-bold uppercase">
                        <Layers size={14} className="text-shiraz dark:text-rose-450" /><MdText text={inhalt.texte.günstigererRcBezug} /></div>
                      <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">+{costResult.materialCostSavings} €</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal"><MdText text={inhalt.texte.rcGesteinskörnungImHochbau} /></p>
                    </div>

                    <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-650 dark:text-slate-300 text-xs font-bold uppercase">
                        <TrendingUp size={14} className="text-shiraz dark:text-rose-450" /><MdText text={inhalt.texte.coKostenSchattenpreis} /></div>
                      <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">+{costResult.co2TaxSavings} €</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal"><MdText text={inhalt.texte.kalkulatorischerCoPreisVon} /></p>
                    </div>

                    <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-650 dark:text-slate-300 text-xs font-bold uppercase">
                        <Sparkles size={14} className="text-shiraz dark:text-rose-450" /><MdText text={inhalt.texte.förderbonusFiktiverLehrwert} /></div>
                      <span className="font-mono text-xl font-bold text-shiraz dark:text-rose-400">+{costResult.fundingBonus} €</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal"><MdText text={inhalt.texte.modellannahmeOhneRealesFörderprogramm} /></p>
                    </div>

                  </div>

                  <div className="bg-shiraz/10 dark:bg-shiraz/20 border border-shiraz/20 dark:border-shiraz/40 text-slate-800 dark:text-slate-100 p-4 rounded-xl space-y-1">
                    <span className="text-xs uppercase tracking-wider text-shiraz dark:text-rose-350 font-bold block"><MdText text={inhalt.texte.zusammenfassungProfitabilitätNachhaltigk} /></span>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-xs"><MdText text={inhalt.texte.gesamtfreigestellterProjektnutzen} /></span>
                      <span className="font-mono text-2xl font-black text-shiraz dark:text-rose-450">ca. {costResult.totalAnnualBenefits} €</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-350 border-t border-shiraz/10 dark:border-shiraz/20 pt-2"><MdText text={inhalt.texte.einSparsamesKreislauffreundlichesBaustel} /><strong>{costResult.certificationBonus}</strong>.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: STÄRKEN (Netzwerke, Partner & bayerische Strukturen) */}
          {activeTab === 'staerken' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-3">
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Network size={18} className="text-shiraz dark:text-rose-500" /><MdText text={inhalt.texte.bayerischeNetzwerkeRegionaleVernetzung} /></h4>
                <p className="text-xs text-slate-650 dark:text-slate-300 max-w-4xl leading-relaxed"><MdText text={inhalt.texte.ressourceneffizienzLebtVomZusammenwirken} /></p>
              </div>

              {/* Selector buttons */}
              <AuswahlGruppe label="Region" className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl max-w-xl">
                <button {...alsOption(selectedRegion === 'all')} 
                  type="button"
                  onClick={() => setSelectedRegion('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedRegion === 'all' ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm' : 'text-slate-650 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  Ganz Bayern
                </button>
                <button {...alsOption(selectedRegion === 'schwaben')} 
                  type="button"
                  onClick={() => setSelectedRegion('schwaben')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedRegion === 'schwaben' ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm' : 'text-slate-650 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                ><MdText text={inhalt.texte.schwabenAugsburg} /></button>
                <button {...alsOption(selectedRegion === 'oberbayern')} 
                  type="button"
                  onClick={() => setSelectedRegion('oberbayern')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedRegion === 'oberbayern' ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm' : 'text-slate-650 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  Oberbayern
                </button>
                <button {...alsOption(selectedRegion === 'franken')} 
                  type="button"
                  onClick={() => setSelectedRegion('franken')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedRegion === 'franken' ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm' : 'text-slate-650 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  Franken
                </button>
                <button {...alsOption(selectedRegion === 'ostbayern')} 
                  type="button"
                  onClick={() => setSelectedRegion('ostbayern')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedRegion === 'ostbayern' ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm' : 'text-slate-650 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  Ostbayern
                </button>
              </AuswahlGruppe>

              {/* Grid representation of selected region's coordinators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHubs.map((hub, idx) => (
                  <div key={idx} className="bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-5 rounded-2xl space-y-3 shadow-none transition-all duration-200">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-xs uppercase tracking-wider font-bold text-shiraz dark:text-rose-400 font-mono flex items-center gap-1">
                          <MapPin size={9} />
                          Region: {hub.region === 'schwaben' ? 'Schwaben' : hub.region === 'oberbayern' ? 'Oberbayern' : hub.region === 'franken' ? inhalt.werte.frankenNordbayern : 'Ostbayern'}
                        </span>
                        <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">{hub.name}</h5>
                      </div>
                      <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded text-xs font-mono shrink-0 uppercase font-bold">{hub.city}</span>
                    </div>

                    <div className="space-y-1 bg-white dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 p-2.5 rounded-lg text-xs text-slate-650 dark:text-slate-300 font-medium">
                      <div><strong className="text-slate-800 dark:text-slate-200">Fokus:</strong> {hub.focus}</div>
                      <div><strong className="text-slate-800 dark:text-slate-200">Träger/Akteur:</strong> {hub.partner}</div>
                    </div>

                    <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-normal">
                      {hub.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Call to action for students and companies */}
              <div className="bg-shiraz/5 border border-shiraz/20 dark:border-rose-950/30 p-5 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Share2 className="text-shiraz dark:text-rose-450" size={16} />
                  <span className="font-bold text-slate-900 dark:text-white text-xs"><MdText text={inhalt.texte.aktivWerdenAlsTha} /></span>
                </div>
                <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed max-w-4xl"><MdText text={inhalt.texte.umDieKreislaufwirtschaftZu} /></p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a 
                    href="mailto:juergen.huber@tha.de?subject=Kooperationsanfrage%20Ressourceneffizienz"
                    className="inline-flex items-center gap-1.5 bg-shiraz dark:bg-rose-600 hover:bg-shiraz/95 dark:hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-sm transition-all"
                  ><MdText text={inhalt.texte.forschungsanfrageStellen} /><ArrowRight size={12} />
                  </a>
                  <a 
                    href="https://www.umweltpakt.bayern.de/rez/index.htm" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-250 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-sm transition-colors"
                  ><MdText text={inhalt.texte.offizielleRezWebsiteAufrufen} /><FileText size={12} />
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Module standard footer */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1MaterialCircularity}
        zielGleichung="MCI = \max\left(0;\; 1 - LFI \cdot F(X)\right), \quad F(X) = \frac{0{,}9}{X}"
        schritte={inhalt.daten["Ressourceneffizienz.schritte"]}
        ergebnisHinweis={inhalt.werte.vAnteilPrimärmaterialW}
        normQuelle={inhalt.werte.ellenMacarthurFoundationGranta}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2RezyklatanteilUnd}
        zielGleichung="m_{RC} = V_{Beton} \cdot m_{GK} \cdot a_{RC}"
        schritte={inhalt.daten["Ressourceneffizienz.schritte_2"]}
        ergebnisHinweis={inhalt.werte.rezyklierteGesteinskörnungErsetztPrimärk}
        normQuelle={inhalt.werte.dinEn12620Dafstb}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ressourceneffizienz" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap9} 
        wikipedia={[
          { title: 'Ressourceneffizienz', url: 'https://de.wikipedia.org/wiki/Ressourceneffizienz' },
          { title: 'Kreislaufwirtschaft', url: 'https://de.wikipedia.org/wiki/Kreislaufwirtschaft' },
          { title: inhalt.werte.urbanMining, url: 'https://de.wikipedia.org/wiki/Urban_Mining' },
          { title: 'Ersatzbaustoffverordnung', url: 'https://de.wikipedia.org/wiki/Ersatzbaustoffverordnung' }
        ]}
        literatur={inhalt.daten["Ressourceneffizienz.literatur"]}
        regelwerke={inhalt.daten["Ressourceneffizienz.regelwerke"]}
        formeln={inhalt.daten["Ressourceneffizienz.formeln"]}
      />
    </div>
  );
}
