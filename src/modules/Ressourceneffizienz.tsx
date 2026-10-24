import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
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

export const R_STRATEGIES: RStrategy[] = [
  {
    id: "R0",
    name: "Refuse",
    shortDe: "Produkt überflüssig machen; Funktion anders bereitstellen",
    category: "Produkte einsparen, klüger nutzen & Herstellen",
    categoryIndex: 0,
    circularLevel: "HIGH-LEVEL (Maximale Kreislaufschonung)",
    innovationLevel: "RADIKAL (Neue Entwurfsparadigmen)",
    positionPercent: 5,
    innovationPercent: 5,
    details: "Dieser radikalste Ansatz hinterfragt die Notwendigkeit bestimmter Bauwerke oder Bauteile bereits in der Entwurfsphase grundlegend.",
    example: "Verzicht auf Unterkellerung bei unkomplizierten Bodenverhältnissen spart enorme Mengen an kies- und zementintensivem Beton sowie Erdaushubtransporte. Oder Verzicht auf rein dekorative Beton-Auskragungen.",
    quote: "Bester Ressourcenschutz entsteht durch das Weglassen des Unnötigen."
  },
  {
    id: "R1",
    name: "Rethink",
    shortDe: "Produktnutzung intensivieren (z. B. Sharing)",
    category: "Produkte einsparen, klüger nutzen & Herstellen",
    categoryIndex: 0,
    circularLevel: "HIGH-LEVEL (Maximale Kreislaufschonung)",
    innovationLevel: "RADIKAL (Umnutzungskonzepte)",
    positionPercent: 15,
    innovationPercent: 15,
    details: "Moderne Gebäude müssen so flexibel entworfen werden, dass sie über ihren Lebenszyklus hinweg unterschiedliche Verwendungszwecke aufnehmen können, anstatt abgerissen zu werden.",
    example: "Modularer Skelettbau mit nicht-tragenden Trennwänden, der ein einfaches Umschalten zwischen Wohnnutzung, Büro- oder Pflege-Apartments ermöglicht, ohne statische Eingriffe vornehmen zu müssen.",
    quote: "Planung von vornherein multifunktional und flexibel gestalten."
  },
  {
    id: "R2",
    name: "Reduce",
    shortDe: "Effizienz in Produktion oder Nutzung erhöhen: Rohstoff-/Materialeinsatz reduzieren",
    category: "Produkte einsparen, klüger nutzen & Herstellen",
    categoryIndex: 0,
    circularLevel: "HIGH-LEVEL / TRANSITION",
    innovationLevel: "RADIKAL / HOCH (Materialoptimierung)",
    positionPercent: 25,
    innovationPercent: 30,
    details: "Durch Optimierung von Bauteilegeometrie und dem gezielten Einsatz hochentwickelter Baustoffe wird die absolute Masse an benötigten Rohstoffen minimiert.",
    example: "Verwendung von Hohlkörperdecken (z. B. Cobiax) oder hochfestem Carbonbeton anstelle dicker Vollbetonplatten. Dies reduziert das Eigengewicht um bis zu 30 % und spart Beton im gesamten Tragwerk.",
    quote: "Weniger Material durch intelligentere Ingenieurskunst."
  },
  {
    id: "R3",
    name: "Reuse",
    shortDe: "Wiederverwendung durch andere Nutzer; Nutzung gemäß Originalfunktion",
    category: "Lebensdauer von Produkten oder Teilen erhöhen",
    categoryIndex: 1,
    circularLevel: "MID-LEVEL (Erhalt der Produktform)",
    innovationLevel: "INTELLIGENT / MITTEL (Bauteilbörsen)",
    positionPercent: 44,
    innovationPercent: 45,
    details: "Direkter Wiedereinbau intakter Bauteile an anderer Stelle in ihrer ursprünglichen Funktion, ohne stoffliche Umwandlung.",
    example: "Zerstörungsfreie Demontage und anschließende Wiederverwendung von Stahlträgern, Klinkersteinen, Natursteinplatten oder Trennwandsystemen auf regionalen Baustellen (vermittelt über Bauteilbörsen).",
    quote: "Gebrauchte Bauteile direkt wertschätzen und neu montieren."
  },
  {
    id: "R4",
    name: "Repair",
    shortDe: "Reparatur durch Wartung kaputter Produkte; Nutzung im Originalzustand",
    category: "Lebensdauer von Produkten oder Teilen erhöhen",
    categoryIndex: 1,
    circularLevel: "MID-LEVEL (Erhalt der Produktform)",
    innovationLevel: "MITTEL (Instandsetzungskunst)",
    positionPercent: 54,
    innovationPercent: 55,
    details: "Erhalt und Wiederherstellung der Funktionsfähigkeit lokaler Bauteile direkt am Bestandsgebäude.",
    example: "Fachgerechte Reparatur historischer Massivholzfenster, energetische Aufarbeitung von Bestandsfassaden oder Betonsanierung mittels Rissinjektion, statt Bauteile komplett auszutauschen.",
    quote: "Instandhaltung vor Austausch schützt graue Energie."
  },
  {
    id: "R5",
    name: "Refurbish",
    shortDe: "Wiederherstellen/ Restaurieren und „Updaten“ alter Produkte",
    category: "Lebensdauer von Produkten oder Teilen erhöhen",
    categoryIndex: 1,
    circularLevel: "MID-LEVEL / TRANSITION",
    innovationLevel: "MITTEL-INKREMENTELL (Sanierung)",
    positionPercent: 64,
    innovationPercent: 65,
    details: "Tiefgreifende kosmetische und technische Modernisierung von Systemen, um sie den aktuellen Standards anzupassen.",
    example: "Energetische Sanierung eines Wohnblocks aus den 1970ern mit neuer WDVS-Dämmung oder ökologischer Einblasedämmung und moderner zentraler Haustechnik bei Erhalt der Grundstruktur.",
    quote: "Alte Gebäude technisch aufwerten statt abreißen."
  },
  {
    id: "R6",
    name: "Remanufacture",
    shortDe: "Teile eines alten Produkts in einem neuen Produkt mit selber Funktion nutzen",
    category: "Lebensdauer von Produkten oder Teilen erhöhen",
    categoryIndex: 1,
    circularLevel: "MID-LEVEL / TRANSITION",
    innovationLevel: "INKREMENTELL (Werks-Aufbereitung)",
    positionPercent: 74,
    innovationPercent: 72,
    details: "Industrielle Demontage gebrauchter Baugruppen mit anschließender Generalüberholung im Herstellerwerk zur Erreichung von Neugeräte-Garantien.",
    example: "Werksseitige Aufbereitung und technische Generalüberholung von komplexen Heizungsventilen, Kompressoren, Brandschutz-Schiebern oder Doppelbodenplatten durch den Ersthersteller.",
    quote: "Industrielles Remanufacturing sichert Qualität und Gewährleistung."
  },
  {
    id: "R7",
    name: "Repurpose",
    shortDe: "Teile eines alten Produkts in einem neuen Produkt mit anderer Funktion nutzen",
    category: "Material sinnvoll wiederverwenden",
    categoryIndex: 2,
    circularLevel: "LOW-LEVEL / STOFFLICH",
    innovationLevel: "INKREMENTELL (Sinnvolle Umnutzung)",
    positionPercent: 84,
    innovationPercent: 80,
    details: "Kreative stoffliche Zweckentfremdung ausgedienter Baustoffe oder Bauteile für völlig andere Einsatzgebiete (Upcycling).",
    example: "Umnutzung ausrangierter Stahl-Gitterroste als langlebiges Rankgitter-System für begrünte Fassaden oder Verwendung recycelter Holzdeckenbalken für wertvolles Echtholz-Interieur.",
    quote: "Alten Werkstoffen eine völlig neue Seele einhauchen."
  },
  {
    id: "R8",
    name: "Recycle",
    shortDe: "Materielle Verwertung",
    category: "Material sinnvoll wiederverwenden",
    categoryIndex: 2,
    circularLevel: "LOW-LEVEL (Stoffkreislauf)",
    innovationLevel: "INKREMENTELL (Aufbereitungs-Tech)",
    positionPercent: 92,
    innovationPercent: 90,
    details: "Aufarbeitung von Abfällen zu Sekundärrohstoffen zur Produktion neuer Produkte – der klassische Weg im Baustoffrecycling.",
    example: "Zerkleinerung und Aufarbeitung von Abbruchbeton in Prallbrecheranlagen zu genormtem RC-Brechsand und RC-Splitt der Klassen RC-1 und RC-2. Dieser dient als 1:1 Ersatz für Primärkies im Frischbeton.",
    quote: "Rohstoffe im stofflichen Kreislauf halten."
  },
  {
    id: "R9",
    name: "Recover",
    shortDe: "Energetische Verwertung",
    category: "Material sinnvoll wiederverwenden",
    categoryIndex: 2,
    circularLevel: "LOW-LEVEL (End-of-Pipe)",
    innovationLevel: "INKREMENTELL (Fossile Ersetzung)",
    positionPercent: 98,
    innovationPercent: 98,
    details: "Thermische Verwertung von brennbaren Materialien zur Gewinnung von Nutzwärme und Elektrizität, wenn kein stofflicher Verwertungspfad mehr zulässig ist.",
    example: "Heizkraftwerk-Verfeuerung kontaminierter Altholzfraktionen (Altholzkategorie A IV, z.B. teer- oder salzimprägnierte Balken) unter strenger Rauchgasreinigung zur regionalen Fernwärmegewinnung.",
    quote: "Gewinnung von Nutzwärme, wenn stoffliche Wege ausgeschlossen sind."
  }
];

export default function Ressourceneffizienz() {
  const [activeTab, setActiveTab] = useState<RezTab>('informieren');
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
      subtitle: 'Wissen & Sensibilisierung',
      description: 'Systematisches Erschließen von Fachwissen zu Material- und Ressourceneffizienz. Zugriff auf bayerische Studien, Leitfäden des LfU und neutrale Fachberatung.',
      colorClass: 'bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/55 dark:hover:bg-slate-800/80 text-slate-850 dark:text-slate-100',
      borderColorClass: 'border-slate-200 dark:border-slate-800',
      icon: BookOpen
    },
    {
      id: 'handeln',
      title: 'Handeln',
      subtitle: 'Werkzeuge & Praxis',
      description: 'Konkrete Maßnahmen zur Materialeinsparung und Stoffkreislaufführung auf Baustellen. Einsatz von KI, digitaler Gebäudeplanung (BIM) und Materialpässen.',
      colorClass: 'bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/55 dark:hover:bg-slate-800/80 text-slate-850 dark:text-slate-100',
      borderColorClass: 'border-slate-200 dark:border-slate-800',
      icon: Activity
    },
    {
      id: 'nutzen',
      title: 'Nutzen',
      subtitle: 'Wirtschaftlichkeit & Ökologie',
      description: 'Erfassung der ökologischen und ökonomischen Potenziale. Reduktion von CO₂-Abgaben, Einsparung von Entsorgungskosten und Sicherung von Fördermitteln.',
      colorClass: 'bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/55 dark:hover:bg-slate-800/80 text-slate-850 dark:text-slate-100',
      borderColorClass: 'border-slate-200 dark:border-slate-800',
      icon: TrendingUp
    },
    {
      id: 'staerken',
      title: 'Stärken',
      subtitle: 'Kompetenz & Netzwerke',
      description: 'Verankerung der Ressourceneffizienz in der bayerischen Baupraxis. Vernetzung von Planern, Recyclern, Bauherren und wissenschaftlichen Clustern.',
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
    const primaryGravelNeed = concreteType === 'rc_beton' ? finalVolume * 1.8 * 0.5 : finalVolume * 1.8; // 50% substituted in typical RC-beton
    const secondaryGravelNeed = concreteType === 'rc_beton' ? finalVolume * 1.8 * 0.5 : 0;
    
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
    const primaryMineralSavings = Math.max(0, (baselineVolume * 1.8) - primaryGravelNeed);

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
    const certificationBonus = recyclingUsage >= 30 ? 'Positiver Beitrag zu Zertifizierungskriterien (z. B. DGNB Ressourcen)' : 'Basis-Standard';

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
  const regionalHubs = [
    {
      name: 'Ressourceneffizienz-Zentrum Bayern (REZ) Hauptquartier',
      city: 'Augsburg',
      region: 'schwaben',
      focus: 'Zentrale Koordinierung, Landesweites LfU-Beraternetzwerk & Publikationen',
      partner: 'Bayerisches Landesamt für Umwelt (LfU) / TH Augsburg',
      description: 'Zentrale Institution für herstellerneutrale Beratung, Forschungsförderung und Initiator von Best-Practice-Projekten im Freistaat.'
    },
    {
      name: 'BaustoffAllianz Kreislaufwirtschaft Bayern',
      city: 'München',
      region: 'oberbayern',
      focus: 'Recycling-Beton Richtlinien, Baustoffbörsen & Vergaberatgeber',
      partner: 'Bayerischer Industrieverband Steine und Erden',
      description: 'Gemeinsame Arbeitsgruppe zur Standardisierung von RC-Zustandszulassungen in Kooperation mit Kommunen und Landratsämtern.'
    },
    {
      name: 'Entwicklungszentrum für Ressourceneffizienz Nordbayern',
      city: 'Nürnberg',
      region: 'franken',
      focus: 'Industrieller Bauteilkreislauf, thermischer Rückbau & Gipskartonrecycling',
      partner: 'IHK Nürnberg für Mittelfranken & Fraunhofer IPA',
      description: 'Technikum zur mechanischen Trennung von Verbundwerkstoffen und Optimierung der Gips-zu-Gips-Recyclingkette.'
    },
    {
      name: 'Forschungsgruppe Ressourceneffizientes Bauen TH Augsburg',
      city: 'Augsburg',
      region: 'schwaben',
      focus: 'Carbonbeton-Aufbereitung, Sortenreines Abbruch-Design & Didaktik',
      partner: 'Prof. Dr.-Ing. Jürgen Huber / Technische Hochschule Augsburg (THA)',
      description: 'Wegweisendes Labor zur Entwicklung von mineralischen Dämmstoffen aus Abbruchabfällen und BIM-basierten Rückbaukonzepten.'
    },
    {
      name: 'Kompetenzcluster Holz- und Kreislaufwirtschaft Ostbayern',
      city: 'Straubing / Roßbach',
      region: 'ostbayern',
      focus: 'Kaskadennutzung von Altholz, biogene Kreisläufe & Strohdämmung Systems',
      partner: 'CARMEN e.V. & HS Weihenstephan-Triesdorf',
      description: 'Fördert das Schließen von Stoffströmen bei Holzprodukten und optimiert CO₂-optimierte Gebäudehüllen aus bayerischen Naturmaterialien.'
    }
  ];

  const filteredHubs = selectedRegion === 'all' 
    ? regionalHubs 
    : regionalHubs.filter(h => h.region === selectedRegion);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Welcome Title Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-md border border-slate-800/40 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Leaf size={140} className="text-slate-400" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="bg-shiraz/20 text-shiraz dark:text-rose-300 border border-shiraz/35 px-3 py-1 rounded-full text-xs font-bold leading-none uppercase tracking-wider">
              Kooperation TH Augsburg & REZ Bayern
            </span>
            <span className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full text-xs font-mono">
              Stand: LfU 2026
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Leaf className="text-shiraz dark:text-rose-400 shrink-0 w-8 h-8" />
              Ressourceneffizienz im Bauwesen
            </h2>
            <p className="text-slate-300 max-w-3xl text-sm md:text-base leading-relaxed">
              Die Schonung natürlicher Ressourcen gehört zu den drängendsten Aufgaben im Bauwesen. 
              Durch Materialeinsparung, selektiven Rückbau und den zielführenden Einsatz von mineralischen Recycling-Baustoffen 
              schließen wir Kreisläufe und dekarbonisieren die Wertschöpfungskette. Entdecken Sie die vier Säulen des 
              <strong> Ressourceneffizienz-Zentrums Bayern (REZ)</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of the 4 Pillars as big action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {concepts.map((concept) => {
          const IconComponent = concept.icon;
          const isSelected = activeTab === concept.id;
          return (
            <button aria-pressed={isSelected}
              key={concept.id}
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        
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
            <span>Klicken Sie oben auf eine Säule zum Umschalten</span>
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
                    <BookOpen size={18} className="text-shiraz" />
                    Wissenstransfer &amp; Sensibilisierung des REZ Bayern
                  </h4>
                  
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Das <strong>Ressourceneffizienz-Zentrum Bayern (REZ)</strong> ist die zentrale neutrale Anlaufstelle für kleine und mittelständische Unternehmen im Bereich Umweltpakt Bayern. Ein wesentlicher Fokus liegt im zirkulären und ressourcenschonenden Planen und Bauen (Circular Construction).
                  </p>
                  
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">Das Multibarrieren- und Kaskadenprinzip:</span>
                    <ul className="text-xs text-slate-600 dark:text-slate-350 space-y-2">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="text-shiraz shrink-0 mt-0.5" size={14} />
                        <span><strong>Informationsangebote:</strong> Publikation neutraler Datenblätter zu Ersatzbaustoffen, Umweltproduktdeklarationen (EPD) und Recycling-Leitfäden.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="text-shiraz shrink-0 mt-0.5" size={14} />
                        <span><strong>Technologie-Vergleich:</strong> Abwägung der CO₂-Minderung durch klinkerreduzierte Bindemittel und optimierte Gesteinskörnung.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="text-shiraz shrink-0 mt-0.5" size={14} />
                        <span><strong>Bayerische Bestimmungen:</strong> Hilfestellungen zur Ersatzbaustoffverordnung (EBV) und dem Wasserrecht zur schadlosen mineralischen Wiederverwertung.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-start gap-3">
                    <HelpCircle className="text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" size={16} />
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">Schon gewusst? (Prof. Hubers Faktencheck)</span>
                      <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                        Mineralische Bau- und Abbruchabfälle (Bauschutt, Straßenaufbruch, Bodenaushub) sind in Bayern wie bundesweit der mit Abstand größte Abfallstrom (Größenordnung mehrere zehn Millionen Tonnen jährlich; aktuelle Zahlen in der Abfallbilanz des LfU bzw. im Monitoringbericht Kreislaufwirtschaft Bau). Eine hohe Verwertungsquote wird zwar statistisch erreicht, jedoch fließt ein Großteil in den niederwertigen Straßenunterbau (Downcycling). Echtes Hochbau-Recycling (RC-Beton) schont bayerischen Kiesabbaugebiete und Waldlandschaften langfristig.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Circular Data Chart Dashboard Column */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-4">
                    <span className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold block">
                      Fakten-Datenbank Bayern
                    </span>
                    <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">
                      Zusammensetzung &amp; Verbleib bayerischer mineralischer Abfälle
                    </h5>
                    
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <span>Straßenbau &amp; Erdbau (Verfüllung)</span>
                          <span className="font-mono text-slate-700 dark:text-slate-300">72 %</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-slate-600 dark:bg-slate-400 h-full rounded-full" style={{ width: '72%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <span>Deponierung (Abfallbeseitigung)</span>
                          <span className="font-mono text-slate-600 dark:text-slate-400">18 %</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-slate-450 dark:bg-slate-500 h-full rounded-full" style={{ width: '18%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <span>Hochwertiges RC-Material (Hochbau)</span>
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
                        <span>Downcycling schützt zwar Deponieraum, trägt aber wenig zur Baustoffautarkie bei.</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-shiraz shrink-0"></span>
                        <span>Politisches Ziel: mehr RC-Beton im öffentlichen Hochbau (konkrete Zielwerte der bayerischen Strategie manuell prüfen).</span>
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
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold px-2 py-0.5 rounded font-mono uppercase">
                      R-Strategien des Produktlebenszyklus
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      Bayerisches Ressourceneffizienz-Zentrum Bayern (REZ)
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Leaf className="text-shiraz dark:text-rose-400 w-5 h-5" />
                    Der zirkuläre Produktlebenszyklus – Innovative R-Strategien
                  </h3>
                  <p className="text-xs text-slate-650 dark:text-slate-350 max-w-4xl leading-relaxed">
                    Die Schonung der Rohstoffvorräte wird durch intelligente Entwurfs- und Verwertungsstufen systematisiert. 
                    Das Spektrum reicht von der radikalen Vermeidung <strong>(R0)</strong> bis zur ungeliebten thermischen Entsorgung <strong>(R9)</strong>. 
                    Klicken Sie auf eines der Wertschöpfungsfelder in der bayerischen Heuristik-Matrix, um Praxisanwendungen im Hoch- und Tiefbau zu studieren:
                  </p>
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
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            
                            {/* Column 0: Produkte einsparen (R0-R2) */}
                            <div className="flex flex-col gap-3">
                              <div className="bg-slate-800 dark:bg-slate-950 border border-slate-750 dark:border-slate-800 text-white px-3 py-2 text-center text-xs uppercase font-black tracking-tight rounded-t-xl select-none min-h-[46px] flex items-center justify-center">
                                Produkte einsparen, klüger nutzen &amp; Herstellen
                              </div>
                              <div className="flex flex-col gap-3 bg-slate-50/40 dark:bg-slate-900/10 p-2.5 rounded-b-xl border border-slate-150 dark:border-slate-800 p-3 flex-1">
                                {R_STRATEGIES.filter(r => r.categoryIndex === 0).map((strategy) => (
                                  <button aria-pressed={selectedR === strategy.id}
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
                              <div className="bg-slate-800 dark:bg-slate-950 border border-slate-750 dark:border-slate-800 text-white px-3 py-2 text-center text-xs uppercase font-black tracking-tight rounded-t-xl select-none min-h-[46px] flex items-center justify-center">
                                Lebensdauer von Produkten oder Teilen erhöhen
                              </div>
                              <div className="flex flex-col gap-3 bg-slate-50/40 dark:bg-slate-900/20 p-2.5 rounded-b-xl border border-slate-150 dark:border-slate-800 p-3 flex-1">
                                {R_STRATEGIES.filter(r => r.categoryIndex === 1).map((strategy) => (
                                  <button aria-pressed={selectedR === strategy.id}
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
                              <div className="bg-slate-800 dark:bg-slate-950 border border-slate-750 dark:border-slate-800 text-white px-3 py-2 text-center text-xs uppercase font-black tracking-tight rounded-t-xl select-none min-h-[46px] flex items-center justify-center">
                                Material sinnvoll wiederverwenden
                              </div>
                              <div className="flex flex-col gap-3 bg-slate-50/40 dark:bg-slate-900/20 p-2.5 rounded-b-xl border border-slate-150 dark:border-slate-800 p-3 flex-1">
                                {R_STRATEGIES.filter(r => r.categoryIndex === 2).map((strategy) => (
                                  <button aria-pressed={selectedR === strategy.id}
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

                          </div>

                          {/* Dynamic slider tracking double bars from Attachment bottom */}
                          <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-4">
                            
                            {/* Bar 1: Zirkulare Wertschöpfung with automatic pointer tracking */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <span>Zirkulare Wertschöpfung</span>
                                </span>
                                <span className="text-shiraz dark:text-rose-450 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded font-mono">
                                  Einordnung: {activeStrategy.circularLevel}
                                </span>
                              </div>
                              <div className="relative w-full h-8 bg-gradient-to-r from-slate-700 dark:from-slate-800 via-slate-500 dark:via-slate-600 to-slate-400 dark:to-slate-500 rounded-lg flex items-center justify-between px-4 overflow-hidden select-none">
                                <span className="text-white text-xs font-black uppercase tracking-wider z-10 flex items-center gap-1">
                                  ◀ HIGH-LEVEL
                                </span>
                                <span className="text-white text-xs font-black tracking-widest uppercase opacity-85 z-10 font-sans hidden sm:inline">
                                  Zirkulare Wertschöpfung
                                </span>
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
                                <span className="text-white text-xs font-black uppercase tracking-wider z-10 flex items-center gap-1">
                                  INKREMENTELL ▶
                                </span>

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
                              <span>Quelle: Prognos 2023, basierend auf (Kirchherr, Reike, &amp; Hekkert, 2017)</span>
                              <span>LfU / REZ Bayern Handlungsrahmen</span>
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
                            <span className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-extrabold block">Deutsche Formulierung:</span>
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
                            <span className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-extrabold block">Bedeutung &amp; Einordnung:</span>
                            <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed">
                              {activeStrategy.details}
                            </p>
                          </div>

                          {/* Specific construction examples */}
                          <div className="bg-shiraz/5 border border-shiraz/20 dark:border-rose-950/40 p-4 rounded-xl space-y-2">
                            <span className="text-xs uppercase text-shiraz dark:text-rose-400 font-black tracking-wider flex items-center gap-1.5 leading-none">
                              <CheckCircle2 size={11} className="text-shiraz dark:text-rose-400" />
                              Praxisbeispiel im bayerischen Bauwesen:
                            </span>
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
                                <span className="text-slate-550 dark:text-slate-350 font-medium">Klimaschutz-Wirkung (CO₂):</span>
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
                  <span className="font-bold text-slate-900 dark:text-white text-xs text-shiraz-950">Interaktiver Werkstoff- &amp; Konstruktionsoptimierer</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Spielen Sie unterschiedliche Tragwerksbauweisen am Simulator durch. Kombiniere nachhaltige Zementsorten (CEM III), den Einsatz von mineralischer Gesteinskörnung der Kategorie RC-1 (Bauschuttaufbereitung) und geometrische Tragwerksoptimierungen, um Ressourcenverbräuche und graue Energie drastisch zu senken!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Configuration Column */}
                <div className="lg:col-span-5 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
                    <Calculator size={14} className="text-shiraz dark:text-rose-500" />
                    Tragwerk &amp; Betonmischung konfigurieren
                  </h4>

                  {/* Bauteil selection */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">1. Bauteiltyp und Standardmaß</label>
                    <select aria-label="1. Bauteiltyp und Standardmaß" 
                      value={selectedBauteil}
                      onChange={(e: any) => setSelectedBauteil(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-shiraz dark:focus:ring-rose-500"
                    >
                      <option value="slab">Stahlbetondeckenplatte (ca. 120 m³ Beton)</option>
                      <option value="column">Tragsäulen-Satz im Skelettbau (ca. 30 m³ Beton)</option>
                      <option value="foundation">Fundament- &amp; Bodenplatte (ca. 150 m³ Beton)</option>
                    </select>
                  </div>

                  {/* Concrete Class */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">2. Zement- &amp; Gesteinskörnungsklasse</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button aria-pressed={concreteType === 'standard'} 
                        type="button"
                        onClick={() => setConcreteType('standard')}
                        className={`px-2 py-2 rounded-lg text-xs font-semibold border ${
                          concreteType === 'standard' 
                            ? 'bg-shiraz dark:bg-rose-600 text-white border-shiraz dark:border-rose-700 shadow-sm' 
                            : 'bg-white dark:bg-slate-800 text-slate-650 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80'
                        }`}
                      >
                        Standard CEM I
                      </button>
                      <button aria-pressed={concreteType === 'cem3'} 
                        type="button"
                        onClick={() => setConcreteType('cem3')}
                        className={`px-2 py-2 rounded-lg text-xs font-semibold border ${
                          concreteType === 'cem3' 
                            ? 'bg-shiraz dark:bg-rose-600 text-white border-shiraz dark:border-rose-700 shadow-sm' 
                            : 'bg-white dark:bg-slate-800 text-slate-650 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80'
                        }`}
                      >
                        Hüttensand CEM III
                      </button>
                      <button aria-pressed={concreteType === 'rc_beton'} 
                        type="button"
                        onClick={() => setConcreteType('rc_beton')}
                        className={`px-2 py-2 rounded-lg text-xs font-semibold border ${
                          concreteType === 'rc_beton' 
                            ? 'bg-shiraz dark:bg-rose-600 text-white border-shiraz dark:border-rose-700 shadow-sm' 
                            : 'bg-white dark:bg-slate-800 text-slate-650 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80'
                        }`}
                      >
                        RC-Beton (rezykl. Gesteinskörnung)
                      </button>
                    </div>
                  </div>

                  {/* Reinforcement ratio */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>3. Bewehrungsgehalt (Stahl)</span>
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
                      <span>Stahlminimiert (Filigraner)</span>
                      <span>100% (Soll / Eurocode)</span>
                      <span>Dicht bewehrt</span>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">4. Prozess- &amp; Bau-Optionen</label>
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
                          <span className="font-bold text-slate-800 dark:text-slate-200">Regionale Gesteinskörnung</span>
                          <span className="text-slate-500 dark:text-slate-400 text-xs">Verkürzt Transportwege von 65 km auf 15 km (Vermeidung von Importen).</span>
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
                          <span className="font-bold text-slate-800 dark:text-slate-200">Bauwerksintegrierte Optimierung</span>
                          <span className="text-slate-500 dark:text-slate-400 text-xs">Sparsame Elementstärken &amp; Hohlkörperdecken sparen ca. 15 % Gesamtvolumen.</span>
                        </div>
                      </label>

                    </div>
                  </div>
                </div>

                {/* Outputs Real time Simulation */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900/60 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span>Echtzeit-Berechnung &amp; Bewertung</span>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 px-2 py-0.5 rounded text-xs font-mono">Bayerisches LfU-Modell</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    
                    <div className="bg-slate-50/65 dark:bg-slate-850/45 p-3 rounded-xl text-center space-y-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block uppercase">Erforderliche Masse</span>
                      <span className="font-mono text-lg font-bold text-slate-800 dark:text-slate-200">{simResult.rawMass} t</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 block">Endgewicht des Bauteils</span>
                    </div>

                    <div className="bg-slate-50/65 dark:bg-slate-850/45 p-3 rounded-xl text-center space-y-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block uppercase">Primärkies-Schonung</span>
                      <span className="font-mono text-lg font-bold text-shiraz dark:text-rose-400">{simResult.primaryMineralSavings} t</span>
                      <span className="text-xs text-slate-450 dark:text-slate-550 block font-semibold">Abbauradius reduziert</span>
                    </div>

                    <div className="bg-slate-50/65 dark:bg-slate-850/45 p-3 rounded-xl text-center space-y-1 col-span-2 sm:col-span-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block uppercase">Grauer CO₂-Gehalt</span>
                      <span className="font-mono text-lg font-bold text-slate-800 dark:text-slate-200">{simResult.totalCo2} t</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 block">Inkl. Transport &amp; Stahl</span>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50/60 dark:bg-slate-850/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-850">
                    <div className="md:col-span-4 text-center md:text-left space-y-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase block">CO₂-Einsparung</span>
                      <span className="font-mono text-2.5xl font-black text-shiraz dark:text-rose-450 block leading-none">{simResult.co2SavingsPercent}%</span>
                      <span className="text-xs text-slate-450 dark:text-slate-500 block italic">geg. Standard-Skelettbau</span>
                    </div>
                    <div className="md:col-span-8 text-xs text-slate-650 dark:text-slate-300 space-y-1.5 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-3 md:pt-0 md:pl-4">
                      <p>🚀 <strong>Vergleichsanalyse:</strong> Ihr optimierter Entwurf emittiert ca. {simResult.totalCo2} Tonnen CO₂-eq im Vergleich zum veralteten traditionellen Referenzwert von <strong>{simResult.baselineCo2} Tonnen</strong>.</p>
                      <p>🌾 <strong>Recycling-Bonus:</strong> Sie verwenden {simResult.secondaryGravelNeed} t aufbereiteten Bauschutt und stoppen damit die Mülldeponierung wertvollen Betons.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">Handlungsempfehlung des REZ Bayern:</span>
                    <div className="p-3.5 bg-shiraz/5 border border-shiraz/10 dark:border-rose-950/20 rounded-xl text-xs text-slate-700 dark:text-slate-300 space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="text-shiraz dark:text-rose-450 shrink-0 mt-0.5" size={14} />
                        <span><strong>Vergabeerleichterung:</strong> Nach bayerischem Bauvergabeerlass dürfen mineralische RC-Baustoffe der Güteklasse RC-1 im Straßen- und Hochbau gleichwertig wie Primärbaustoffe ausgeschrieben werden.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="text-shiraz dark:text-rose-450 shrink-0 mt-0.5" size={14} />
                        <span><strong>Mischungsrezeptur:</strong> Achten Sie auf ausreichende Nachbehandlung (Feuchthaltung) von RC-Beton der Klassen C25/30 bis C30/37, da die rezyklierte Gesteinskörnung im Vorfeld mehr Wasser aufsaugt.</span>
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

                    <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                      Legen Sie fest, wie energie- und materialbewusst Ihre Baustelle gesteuert wird. Der Rechner ermittelt finanzielle Ersparnisse durch Müllvermeidung, Transportoptimierung und CO₂-Abgabenbefreiung in Bayern.
                    </p>

                    {/* Input: Project Size */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>Gebäude-Nutzfläche (m²)</span>
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
                        <span>Abfallvermeidung vor Ort (Gewerke-Trennung)</span>
                        <span className="font-mono text-shiraz dark:text-rose-400 font-bold">{formatDeWert(wasteOptimization)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="80" 
                        step="5"
                        value={wasteOptimization} 
                        onChange={(e) => setWasteOptimization(parseInt(e.target.value) || 30)}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-shiraz dark:accent-rose-500"
                      />
                      <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
                        <span>Unsortierter Container</span>
                        <span>Hohe Disziplin / Sortiereimer</span>
                      </div>
                    </div>

                    {/* Input: Recycling substitution */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>RC-Baustoff-Ersatzanteil im Rohbau</span>
                        <span className="font-mono text-shiraz dark:text-rose-400 font-bold">{formatDeWert(recyclingUsage)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="60" 
                        step="5"
                        value={recyclingUsage} 
                        onChange={(e) => setRecyclingUsage(parseInt(e.target.value) || 20)}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-shiraz dark:accent-rose-500"
                      />
                      <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
                        <span>Reiner Primärkies</span>
                        <span>Max. statische RC-Lastung</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Economic Results Column */}
                <div className="lg:col-span-7 bg-slate-50/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span>Errechneter ökonomischer Mehrwert (ROI)</span>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 px-2 py-0.5 rounded text-xs font-mono">Bayerische Tarifübersicht</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-650 dark:text-slate-300 text-xs font-bold uppercase">
                        <DollarSign size={14} className="text-shiraz dark:text-rose-450" />
                        Deponiekosten gespart
                      </div>
                      <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">+{costResult.disposalSavings} €</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                        Reduzierter Misch-Bauschutt von {costResult.wasteBaseline} t auf <strong>{costResult.wasteOptimized} t</strong> spart teure Klassen-Einstufungen auf bayerischen Deponien.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-650 dark:text-slate-300 text-xs font-bold uppercase">
                        <Layers size={14} className="text-shiraz dark:text-rose-450" />
                        Günstigerer RC-Bezug
                      </div>
                      <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">+{costResult.materialCostSavings} €</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                        RC-Gesteinskörnung im Hochbau ist regional in Bayern im Schnitt 4-8 €/Tonne preiswerter als frisch gebrochener Primärkies.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-650 dark:text-slate-300 text-xs font-bold uppercase">
                        <TrendingUp size={14} className="text-shiraz dark:text-rose-450" />
                        CO₂-Kosten (Schattenpreis)
                      </div>
                      <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">+{costResult.co2TaxSavings} €</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                        Kalkulatorischer CO₂-Preis von 65 €/t (Obergrenze des BEHG-Preiskorridors 2026) als Schattenpreis; eine direkte CO₂-Abgabe auf Baustoffe gibt es für das Bauvorhaben nicht.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-650 dark:text-slate-300 text-xs font-bold uppercase">
                        <Sparkles size={14} className="text-shiraz dark:text-rose-450" />
                        Förderbonus (fiktiver Lehrwert)
                      </div>
                      <span className="font-mono text-xl font-bold text-shiraz dark:text-rose-400">+{costResult.fundingBonus} €</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                        Modellannahme ohne reales Förderprogramm: Bonus ab 25 % Substitution. Prüfen Sie aktuelle Programme (z. B. KfW/QNG-Förderung) im Einzelfall.
                      </p>
                    </div>

                  </div>

                  <div className="bg-shiraz/10 dark:bg-shiraz/20 border border-shiraz/20 dark:border-shiraz/40 text-slate-800 dark:text-slate-100 p-4 rounded-xl space-y-1">
                    <span className="text-xs uppercase tracking-wider text-shiraz dark:text-rose-350 font-bold block">Zusammenfassung: Profitabilität &amp; Nachhaltigkeit</span>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-xs">Gesamtfreigestellter Projektnutzen:</span>
                      <span className="font-mono text-2xl font-black text-shiraz dark:text-rose-450">ca. {costResult.totalAnnualBenefits} €</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-350 border-t border-shiraz/10 dark:border-shiraz/20 pt-2">
                       Ein sparsames, kreislauffreundliches Baustellenmanagement rechnet sich bereits ab Tag 1 durch gesparte Logistikkombinationen und niedrige Entsorgungsentgelte. Zertifizierung: <strong>{costResult.certificationBonus}</strong>.
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
                  <Network size={18} className="text-shiraz dark:text-rose-500" />
                  Bayerische Netzwerke &amp; Regionale Vernetzung stärken
                </h4>
                <p className="text-xs text-slate-650 dark:text-slate-300 max-w-4xl leading-relaxed">
                  Ressourceneffizienz lebt vom Zusammenwirken aller Akteure. Das REZ Bayern stellt Verbindungen her zwischen Bauunternehmen, Recyclern, Bauaufsichten und Hochschul-Forschungszentren. Wählen Sie eine bayerische Region, um lokal aktive Akteure und Koordinations-Cluster des REZ zu finden:
                </p>
              </div>

              {/* Selector buttons */}
              <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl max-w-xl">
                <button aria-pressed={selectedRegion === 'all'} 
                  type="button"
                  onClick={() => setSelectedRegion('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedRegion === 'all' ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm' : 'text-slate-650 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  Ganz Bayern
                </button>
                <button aria-pressed={selectedRegion === 'schwaben'} 
                  type="button"
                  onClick={() => setSelectedRegion('schwaben')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedRegion === 'schwaben' ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm' : 'text-slate-650 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  Schwaben (Augsburg)
                </button>
                <button aria-pressed={selectedRegion === 'oberbayern'} 
                  type="button"
                  onClick={() => setSelectedRegion('oberbayern')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedRegion === 'oberbayern' ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm' : 'text-slate-650 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  Oberbayern
                </button>
                <button aria-pressed={selectedRegion === 'franken'} 
                  type="button"
                  onClick={() => setSelectedRegion('franken')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedRegion === 'franken' ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm' : 'text-slate-650 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  Franken
                </button>
                <button aria-pressed={selectedRegion === 'ostbayern'} 
                  type="button"
                  onClick={() => setSelectedRegion('ostbayern')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedRegion === 'ostbayern' ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm' : 'text-slate-650 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  Ostbayern
                </button>
              </div>

              {/* Grid representation of selected region's coordinators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHubs.map((hub, idx) => (
                  <div key={idx} className="bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-5 rounded-2xl space-y-3 shadow-none transition-all duration-200">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-xs uppercase tracking-wider font-bold text-shiraz dark:text-rose-400 font-mono flex items-center gap-1">
                          <MapPin size={9} />
                          Region: {hub.region === 'schwaben' ? 'Schwaben' : hub.region === 'oberbayern' ? 'Oberbayern' : hub.region === 'franken' ? 'Franken / Nordbayern' : 'Ostbayern'}
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
                  <span className="font-bold text-slate-900 dark:text-white text-xs">Aktiv werden als THA-Absolvent oder Partnerbetrieb</span>
                </div>
                <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed max-w-4xl">
                  Um die Kreislaufwirtschaft zu stärken, unterstützen Prof. Huber und das REZ Bayern gezielt Studierende bei der Verfassung von praxisnahen Abschlussarbeiten (Bachelor / Master) in direkter Zusammenarbeit mit bayerischen Recycling-Unternehmen und Ingenieurbüros.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a 
                    href="mailto:juergen.huber@tha.de?subject=Kooperationsanfrage%20Ressourceneffizienz"
                    className="inline-flex items-center gap-1.5 bg-shiraz dark:bg-rose-600 hover:bg-shiraz/95 dark:hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-sm transition-all"
                  >
                    Forschungsanfrage stellen <ArrowRight size={12} />
                  </a>
                  <a 
                    href="https://www.umweltpakt.bayern.de/rez/index.htm" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-250 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-sm transition-colors"
                  >
                    Offizielle REZ Website aufrufen <FileText size={12} />
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
        title="Beispiel 1: Material Circularity Indicator eines Betonbauteils"
        zielGleichung="MCI = \max\left(0;\; 1 - LFI \cdot F(X)\right), \quad F(X) = \frac{0{,}9}{X}"
        schritte={[
          { titel: 'Lineare Flussrate', erklaerung: 'Rezyklatanteil der Gesteinskörnung 30 %, stoffliche Verwertung am Lebensende 70 % (davon Recycling-Effizienz berücksichtigt), vereinfachter Ansatz:', formel: 'LFI = \\frac{V + W}{2M} = \\frac{0{,}70 + 0{,}30}{2} = 0{,}50' },
          { titel: 'Nutzungsfaktor', erklaerung: 'Nutzungsdauer gleich dem Branchendurchschnitt:', formel: 'X = 1 \\Rightarrow F(X) = 0{,}9' },
          { titel: 'Ergebnis', erklaerung: 'Einsetzen:', formel: 'MCI = 1 - 0{,}50 \\cdot 0{,}9 = 0{,}55' }
        ]}
        ergebnisHinweis="V = Anteil Primärmaterial, W = nicht verwerteter Abfallanteil (beide bezogen auf die Masse M). Eine längere Nutzungsdauer (X = 2) senkt F(X) auf 0,45 und hebt den MCI auf 0,78 – Langlebigkeit wirkt so stark wie Rezyklateinsatz."
        normQuelle="Ellen MacArthur Foundation / Granta Design: Circularity Indicators, Methodology (2015/2019)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Rezyklatanteil und Primärkieseinsparung im Hochbau"
        zielGleichung="m_{RC} = V_{Beton} \cdot m_{GK} \cdot a_{RC}"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Bürogebäude mit 2 500 m³ Beton, Gesteinskörnung 1 850 kg/m³, Austauschanteil grober Körnung 35 % (Lehrwert; zulässige Anteile nach DAfStb-Richtlinie je Expositionsklasse prüfen):', formel: 'm_{RC} = 2\\,500 \\cdot 1{,}85 \\cdot 0{,}35 = 1\\,619\\,\\text{t}' },
          { titel: 'Lkw-Fahrten', erklaerung: 'Bei 25 t Nutzlast:', formel: 'n = \\frac{1\\,619}{25} = 65\\,\\text{Fahrten Primärkies weniger}' },
          { titel: 'Massenbezogene Quote', erklaerung: 'Bezogen auf die gesamte Gesteinskörnung:', formel: 'RER = \\frac{1\\,619}{2\\,500 \\cdot 1{,}85} = 0{,}35 = 35\\,\\%' }
        ]}
        ergebnisHinweis="Rezyklierte Gesteinskörnung ersetzt Primärkies, senkt die CO₂-Bilanz des Betons aber nur wenig – der Zementgehalt dominiert. Der größere Hebel liegt bei klinkerarmen Zementen und schlanker Bemessung."
        normQuelle="DIN EN 12620; DAfStb-Richtlinie Beton mit rezyklierter Gesteinskörnung (2010-09, mit Berichtigung 1:2019-09)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ressourceneffizienz" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 9 Rückbau & Schadstoffe: Statistik- und Förderangaben als Lehrwerte gekennzeichnet, MCI und Quellen geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Ressourceneffizienz', url: 'https://de.wikipedia.org/wiki/Ressourceneffizienz' },
          { title: 'Kreislaufwirtschaft', url: 'https://de.wikipedia.org/wiki/Kreislaufwirtschaft' },
          { title: 'Urban Mining', url: 'https://de.wikipedia.org/wiki/Urban_Mining' },
          { title: 'Ersatzbaustoffverordnung', url: 'https://de.wikipedia.org/wiki/Ersatzbaustoffverordnung' }
        ]}
        literatur={[
          'Ressourceneffizienz-Zentrum Bayern (REZ) am LfU: Informationsangebote zum ressourceneffizienten Bauen (www.umweltpakt.bayern.de/rez; Titel manuell prüfen)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Sobek, W. (2022): non nobis – über das Bauen in der Zukunft (av edition)'
        ]}
        regelwerke={[
          { title: 'Ersatzbaustoffverordnung (EBV)', url: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/' },
          { title: 'Kreislaufwirtschaftsgesetz (KrWG § 14 Abs. 3: Ziel 70 % für Bau- und Abbruchabfälle)', url: 'https://www.gesetze-im-internet.de/krwg/' },
          { title: 'VDI 4800 Blatt 1:2016-02 (Ressourceneffizienz – Methodische Grundlagen, Prinzipien und Strategien)' },
          { title: 'DIN EN 12620 / DIN EN 13242 (Gesteinskörnungen für Beton und Tiefbau)' }
        ]}
        formeln={[
          {
            formel: 'RER = \\frac{m_{\\text{recycelt}} + m_{\\text{sekundär}}}{m_{\\text{gesamt}}} \\cdot 100\\% \\quad (\\text{Recycling-Einsatz-Quote})',
            erklaerung: 'Massenbezogene Recycling-Einsatzquote (Recycled Content Rate) für mineralische Baustoffe, wie sie in Zertifizierungssystemen (z. B. DGNB) bewertet wird.',
            quelle: 'VDI 4800 / DGNB'
          },
          {
            formel: 'MCI = 1 - LFI \\cdot F(X) \\in [0; 1]',
            erklaerung: 'Material Circularity Indicator: MCI = max(0; 1 − LFI · F(X)) mit linearer Flussrate LFI und Nutzungsfaktor F(X) = 0,9/X.',
            quelle: 'Ellen MacArthur Foundation'
          }
        ]}
      />
    </div>
  );
}
