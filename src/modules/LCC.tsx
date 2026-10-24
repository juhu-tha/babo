import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Scale, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  Coins,
  CheckCircle2,
  Download
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { exportToPDF } from '../lib/pdfExport';

// Define the scenario profiles for LCC calculation
interface OptionConfig {
  name: string;
  className: string;
  capex: number; // Initial cost
  opex0: number; // Starting annual operating cost
  maintenanceInterval: number; // maintenance cycle years
  maintenanceCost: number; // maintenance cost per cycle
  lifespan: number; // material lifespans in years
  replacementCost: number; // replacement cost
  eolCost: number; // EOL cost at the very end (positive for costs, negative for positive residue value)
  details: string[];
  embodiedCO2: number; // kg CO2-eq (production greenhouse gases)
  operatingCO2: number; // kg CO2-eq / year (operating energy greenhouse gases)
}

interface ScenarioConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  unit: string;
  optionA: OptionConfig;
  optionB: OptionConfig;
}

const SCENARIOS: ScenarioConfig[] = [
  {
    id: 'daemmung',
    title: 'Außenwand-Dämmsystem (Bezugsfläche: 150 m²)',
    subtitle: 'Konventionelles EPS vs. Kreislauffähige Öko-Holzfaser',
    description: 'Vergleich eines kostengünstigen Erdöl-basierten Wärmedämmverbundsystems mit einer hochwertigen, diffusionsoffenen und kreislauffähigen Naturfaserdämmung.',
    unit: '€/150m²',
    optionA: {
      name: 'Option A: EPS-WDVS (Polystyrol)',
      className: 'Fokus auf minimale Errichtungskosten (CapEx)',
      capex: 18000,
      opex0: 1400, // 1.400 € / Jahr Heizkostenanteil
      maintenanceInterval: 15,
      maintenanceCost: 2500, // Algenreinigung & biozider Anstrich
      lifespan: 30,
      replacementCost: 16000, // Kompletter Austausch nach 30 Jahren inkl. Gerüst
      eolCost: 4500, // Sondermülldeponie EPS-Platten (HBCD-Belastung)
      embodiedCO2: 12500, // 12.5 t CO2-eq
      operatingCO2: 1800, // 1.8 t CO2-eq / year
      details: [
        'Kunststoffbasiertes System mit geringer dynamischer Wärmespeicherung',
        'Turnusmäßige biozide Anstriche gegen Veralgung notwendig',
        'Sehr teure Entsorgung als gefährlicher Abfall am Lebensende'
      ]
    },
    optionB: {
      name: 'Option B: Holzfaser-WDVS (Natur)',
      className: 'Fokus auf minimale Betriebs- & Kreislaufkosten (OpEx/EOL)',
      capex: 31500,
      opex0: 1050, // 1.050 € / Jahr Heizkostenanteil (bessere Dämmleistung & Sommerkühllast)
      maintenanceInterval: 20,
      maintenanceCost: 1800, // Mechanische Reinigung & rein mineralischer Silikatanstrich
      lifespan: 60, // Hält über den gesamten 50-jährigen Gebäudezeitraum ohne Gesamttausch
      replacementCost: 0,
      eolCost: -1500, // Thermische Verwertung oder Holzfaser-Recycling (Gegenbuchung/Gutschrift)
      embodiedCO2: 1500, // 1.5 t CO2-eq
      operatingCO2: 950, // 0.95 t CO2-eq / year
      details: [
        'Nachwachsendes, diffusionsoffenes Material mit hoher Phasenverschiebung',
        'Hervorragender sommerlicher Hitzeschutz mindert Energieaufwand für Kühlung',
        'Stoffliche Rückführbarkeit sichert Restwertgutschrift beim Rückbau'
      ]
    }
  },
  {
    id: 'fenster',
    title: 'Austausch von Fensteranlagen (Glastragwerke, 35 m²)',
    subtitle: 'Basis-Kunststofffenster (2-fach) vs. Premium Holz-Aluminium (3-fach)',
    description: 'Vergleich herkömmlicher Kurzläufer-Verglasung auf Kunststoffrahmen mit einer langlebigen Witterungsschutz-Verbundkonstruktion mit Hochleistungsisolierglas.',
    unit: 'Gesamtprojekt',
    optionA: {
      name: 'Option A: Kunststofffenster (2-fach)',
      className: 'Günstiges Standardprodukt',
      capex: 11500,
      opex0: 800, // Jährlicher Energieverlastanteil durch U_w = 1.3
      maintenanceInterval: 10,
      maintenanceCost: 600, // Beschlagwartung & Profilpolitur
      lifespan: 25,
      replacementCost: 11500, // Voller Austausch nach 25 Jahren
      eolCost: 1200, // Entsorgungskosten (PVC-Verbundmüll)
      embodiedCO2: 4500,
      operatingCO2: 1050,
      details: [
        'Verformt sich über Jahrzehnte leicht unter Temperatureinfluss',
        'Geringere solare Gewinne und verringertes Schalldämmmaß',
        'Eingeschränkte Wiederverwertbarkeit durch Co-extrudiertes Altplastik'
      ]
    },
    optionB: {
      name: 'Option B: Holz-Aluminium-Fenster (3-fach)',
      className: 'Premium Energie- & Langlebigkeitsschutz',
      capex: 22000,
      opex0: 450, // Sehr hohe Energieeffizienz bei U_w = 0.8
      maintenanceInterval: 15,
      maintenanceCost: 400, // Wartungsfreie Alu-Deckschale, nur Dichtungspflege
      lifespan: 45, // Nahezu wartungsfreier Holz-Alu-Verbund
      replacementCost: 22000,
      eolCost: -2500, // Hoher Metallschrott-Restwert (Sortenreine Trennung Aluminium)
      embodiedCO2: 1800,
      operatingCO2: 550,
      details: [
        'Perfekte Witterungsbeständigkeit durch außenliegendes eloxiertes Aluminium',
        'Hohe energetische Einsparung und maximaler Wohnkomfort',
        'Sehr gute Trennbarkeit von Altglas, Holzsteg und Alu-Profilen'
      ]
    }
  },
  {
    id: 'flachdach',
    title: 'Flachdach-Abdichtungskonstruktion (Fläche: 120 m²)',
    subtitle: 'Standard-Bitumenerneuerung vs. EPDM-Kautschukdeckbahn mit Gründach',
    description: 'Die Abdichtungsklassiker. Bitumen verwittert relativ rasch durch UV-Strahlung und muss abgeschält werden. EPDM mit Extensivbegrünung ist extrem alterungsbeständig.',
    unit: 'Gesamtdach',
    optionA: {
      name: 'Option A: Bitumen-Schweißbahnen (2-lagig)',
      className: 'Kostengünstiger Klassiker',
      capex: 14000,
      opex0: 450, // Dachreinigung & laufende Reparaturrückstellungen
      maintenanceInterval: 12,
      maintenanceCost: 1200, // Nahtfestsetzung & Nachbesandung
      lifespan: 20,
      replacementCost: 14000, // Kompletter Abtrag und zweilagiger Neuaufbau
      eolCost: 3500, // Teure Entsorgung bitumenhaltiger Gefahrstoffe
      embodiedCO2: 8500,
      operatingCO2: 600,
      details: [
        'UV-Abbau führt zu Versprödung der Bitumenketten nach wenigen Jahrzehnten',
        'Wärmeeintrag im Sommer erhöht Raumkühllast im Dachgeschoss',
        'Komplett thermische Sonderabfallentsorgung erforderlich'
      ]
    },
    optionB: {
      name: 'Option B: EPDM-Folie & Extensivbegrünung',
      className: 'Nachhaltiges "Kühles Dach" (Cool Roof)',
      capex: 26500,
      opex0: 100, // Gründach-Düngung, aber spart massiv Kühl- & Heizenergie durch mikroklimatische Verdunstung
      maintenanceInterval: 15,
      maintenanceCost: 400, // Visuelle Nahtkontrolle & Unkrautentfernung
      lifespan: 40,
      replacementCost: 18000, // Austausch EPDM-Bahn, Substrat verbleibt
      eolCost: 800, // Geringe Trennungskosten durch ungebundenes System
      embodiedCO2: 2500,
      operatingCO2: 150,
      details: [
        'Hervorragende Dehnfähigkeit (&gt; 300%) und brutto UV-Resistenz',
        'Kühleffekt schützt Abdichtung vor thermischen Spannungsrissen',
        'Gründach speichert bis zu 70% des jährlichen Niederschlags (Abwassergebühr-Spartat)'
      ]
    }
  }
];

export default function LCC() {
  const [activeTab, setActiveTab ] = useState<'rechner' | 'theorie'>('rechner');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('daemmung');
  const [isExporting, setIsExporting ] = useState<boolean>(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF('lcc-print-area', `LCC-Gutachten_${selectedScenarioId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };
  
  // Economic Parameters set by user
  const [discountRate, setDiscountRate] = useState<number>(2.0); // Kalkulationszinssatz r in %
  const [energyInflation, setEnergyInflation] = useState<number>(3.0); // Energiepreis-Teigerung e in %
  const [generalInflation, setGeneralInflation] = useState<number>(1.5); // Allgemeine Inflation i in %
  const [analysisPeriod, setAnalysisPeriod] = useState<number>(50); // Zeitraum N in Jahren

  // Professor's Added Parameters: CO2 Shadow price & KfW Government Subsidies
  const [co2PricingEnabled, setCo2PricingEnabled] = useState<boolean>(true);
  const [co2BasePrice, setCo2BasePrice] = useState<number>(75); // base price in € / t (e.g. 2026 German tier)
  const [co2Escalation, setCo2Escalation] = useState<number>(5.0); // annual co2 tax increase in %
  const [subsidyEnabled, setSubsidyEnabled] = useState<boolean>(true);
  const [subsidyPercent, setSubsidyPercent] = useState<number>(15); // KfW Individual measures grant (up to 15-20%)

  const activeScenario = useMemo(() => {
    return SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];
  }, [selectedScenarioId]);

  // Comprehensive LCC calculation engine
  const calcData = useMemo(() => {
    const r = discountRate / 100;
    const e = energyInflation / 100;
    const i = generalInflation / 100;
    const N = analysisPeriod;

    const computeLCCForOption = (opt: OptionConfig, isOptionB: boolean) => {
      // Apply government subsidy if enabled (only applies to sustainable Option B)
      let capex = opt.capex;
      if (subsidyEnabled && isOptionB) {
        capex = opt.capex * (1 - subsidyPercent / 100);
      }

      let cumulativeOpEx = 0;
      let cumulativeOpExDiscounted = 0;
      let cumulativeMaintenance = 0;
      let cumulativeMaintenanceDiscounted = 0;
      let cumulativeReplacement = 0;
      let cumulativeReplacementDiscounted = 0;
      
      let cumulativeCO2Nominal = 0;
      let cumulativeCO2Discounted = 0;

      // Initial Embodied Carbon CO2 shadow cost at Year 0
      const initialCO2Tons = opt.embodiedCO2 / 1000;
      const initialCO2Cost = co2PricingEnabled ? initialCO2Tons * co2BasePrice : 0;

      let runningCumulativeDiscounted = capex + initialCO2Cost;

      // Year-by-year cashflow tracking
      const yearlyBreakdown: {
        year: number;
        opexNominal: number;
        opexDiscounted: number;
        maintNominal: number;
        maintDiscounted: number;
        replNominal: number;
        replDiscounted: number;
        co2PricePerTon: number;
        co2Nominal: number;
        co2Discounted: number;
        totalNominal: number;
        totalDiscounted: number;
        cumulativeDiscounted: number;
      }[] = [];

      for (let yr = 1; yr <= N; yr++) {
        // --- OpEx (Energy & standard operations) compounds with energy inflation e, then discounted with r
        const opexNom = opt.opex0 * Math.pow(1 + e, yr);
        const opexDisc = opexNom / Math.pow(1 + r, yr);
        cumulativeOpEx += opexNom;
        cumulativeOpExDiscounted += opexDisc;

        // --- CO2 Price per Ton compounding annually
        const co2PricePerTon = co2BasePrice * Math.pow(1 + co2Escalation / 100, yr);
        let co2Nom = 0;
        let co2Disc = 0;

        if (co2PricingEnabled) {
          const opCO2Tons = opt.operatingCO2 / 1000;
          co2Nom = opCO2Tons * co2PricePerTon;
          co2Disc = co2Nom / Math.pow(1 + r, yr);
          cumulativeCO2Nominal += co2Nom;
          cumulativeCO2Discounted += co2Disc;
        }

        // --- Maintenance compounds with general inflation i, then discounted with r
        let maintNom = 0;
        let maintDisc = 0;
        if (yr % opt.maintenanceInterval === 0 && yr < N) {
          maintNom = opt.maintenanceCost * Math.pow(1 + i, yr);
          maintDisc = maintNom / Math.pow(1 + r, yr);
          cumulativeMaintenance += maintNom;
          cumulativeMaintenanceDiscounted += maintDisc;
        }

        // --- Replacement cycles compound with general inflation i, then discounted with r
        let replNom = 0;
        let replDisc = 0;
        let replCO2Cost = 0;
        let replCO2CostDisc = 0;
        if (yr % opt.lifespan === 0 && yr < N) {
          replNom = opt.replacementCost * Math.pow(1 + i, yr);
          replDisc = replNom / Math.pow(1 + r, yr);
          cumulativeReplacement += replNom;
          cumulativeReplacementDiscounted += replDisc;

          // Re-calculate embodied CO2 shadow price on material replacement
          if (co2PricingEnabled) {
            replCO2Cost = (opt.embodiedCO2 / 1000) * co2PricePerTon;
            replCO2CostDisc = replCO2Cost / Math.pow(1 + r, yr);
            cumulativeCO2Nominal += replCO2Cost;
            cumulativeCO2Discounted += replCO2CostDisc;
          }
        }

        const yrTotalNom = opexNom + maintNom + replNom + co2Nom + replCO2Cost;
        const yrTotalDisc = opexDisc + maintDisc + replDisc + co2Disc + replCO2CostDisc;
        runningCumulativeDiscounted += yrTotalDisc;

        yearlyBreakdown.push({
          year: yr,
          opexNominal: opexNom,
          opexDiscounted: opexDisc,
          maintNominal: maintNom,
          maintDiscounted: maintDisc,
          replNominal: replNom,
          replDiscounted: replDisc,
          co2PricePerTon,
          co2Nominal: co2Nom + replCO2Cost,
          co2Discounted: co2Disc + replCO2CostDisc,
          totalNominal: yrTotalNom,
          totalDiscounted: yrTotalDisc,
          cumulativeDiscounted: runningCumulativeDiscounted
        });
      }

      // --- End of Life (EOL) cost/residue compounded with general inflation to year N, discounted with r
      const eolNom = opt.eolCost * Math.pow(1 + i, N);
      const eolDisc = eolNom / Math.pow(1 + r, N);
      
      const totalLCCDiscounted = capex + initialCO2Cost + cumulativeOpExDiscounted + cumulativeMaintenanceDiscounted + cumulativeReplacementDiscounted + cumulativeCO2Discounted + eolDisc;

      return {
        capex,
        initialCO2Cost,
        cumulativeOpExNominal: cumulativeOpEx,
        cumulativeOpExDiscounted,
        cumulativeMaintenanceNominal: cumulativeMaintenance,
        cumulativeMaintenanceDiscounted,
        cumulativeReplacementNominal: cumulativeReplacement,
        cumulativeReplacementDiscounted,
        cumulativeCO2Nominal,
        cumulativeCO2Discounted,
        eolNominal: eolNom,
        eolDiscounted: eolDisc,
        totalLCCDiscounted,
        yearlyBreakdown
      };
    };

    const resultA = computeLCCForOption(activeScenario.optionA, false);
    const resultB = computeLCCForOption(activeScenario.optionB, true);

    return {
      resultA,
      resultB,
      saving: resultA.totalLCCDiscounted - resultB.totalLCCDiscounted,
      percentSaving: ((resultA.totalLCCDiscounted - resultB.totalLCCDiscounted) / resultA.totalLCCDiscounted) * 100
    };
  }, [analysisPeriod, discountRate, energyInflation, generalInflation, co2PricingEnabled, co2BasePrice, co2Escalation, subsidyEnabled, subsidyPercent, activeScenario]);

  return (
    <div className="flex flex-col gap-8">
      {/* Introduction Banner aligned with styleguide */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Coins className="text-shiraz" /> Lebenszykluskosten-Rechnung (LCC)
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4">
          <p>
            Die Lebenszykluskostenrechnung (Life Cycle Costing - LCC) ist das betriebswirtschaftliche Spiegelbild zur ökologischen Ökobilanzierung (LCA). Sie ermöglicht eine rationale Wirtschaftlichkeitsentscheidung, indem sie nicht nur die unmittelbaren Anschaffungskosten (CapEx) bewertet, sondern alle anfallenden Nutzungs-, Instandsetzungs-, und Entsorgungskosten (OpEx &amp; End-of-Life) über standardisierte Gebäudezeiträume (z.B. 50 Jahre nach DGNB) finanzmathematisch auf den heutigen Tag abzinst.
          </p>
        </div>

        {/* Flat horizontal buttons for subtabs inside the main view to keep single screen clean */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-home-grau/20 mt-4">
          <button aria-pressed={activeTab === 'rechner'}
            onClick={() => setActiveTab('rechner')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'rechner'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-slate-50'
            }`}
          >
            <Coins size={14} /> 1. Interaktiver Kostenrechner &amp; Szenarien
          </button>
          <button aria-pressed={activeTab === 'theorie'}
            onClick={() => setActiveTab('theorie')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'theorie'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-slate-50'
            }`}
          >
            <Layers size={14} /> 2. Fachgrundlagen &amp; Normen (DIN 18960)
          </button>

          {activeTab === 'rechner' && (
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="ml-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 text-white border border-emerald-600 shadow-sm hover:bg-emerald-700 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-55"
            >
              {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
              {isExporting ? 'Generiere...' : 'Bericht exportieren (PDF)'}
            </button>
          )}
        </div>
      </div>

      {activeTab === 'rechner' && (
        <div id="lcc-print-area" className="space-y-8 animate-in fade-in duration-350 p-1">
          {/* PDF Export Title header: only visible during PDF generation */}
          <div className="pdf-header hidden bg-white p-6 rounded-2xl border border-home-grau/30 mb-4 text-center">
            <div className="flex justify-between items-center text-xs text-slate-500 font-mono pb-3 border-b border-home-grau/20">
              <span>TECHNISCHE HOCHSCHULE AUGSBURG</span>
              <span>Fakultät für Architektur und Bauwesen</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-4 uppercase tracking-wide">
              Lebenszyklusanalyse (LCC-Gutachten) nach DIN 18960
            </h2>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              Wirtschaftlichkeitsprüfung • Prof. Dr.-Ing. Jürgen Huber • Baustoffkunde &amp; Bauchemie
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-slate-50 rounded-xl text-left text-xs border border-home-grau/25">
              <div>
                <span className="font-bold text-slate-950 block mb-1">Untersuchtes Bauteilszenario:</span>
                <span className="text-shiraz font-bold">{activeScenario.title}</span>
                <p className="text-stone-500 text-[11px] mt-1">{activeScenario.subtitle}</p>
              </div>
              <div>
                <span className="font-bold text-slate-950 block mb-1">Berechnungsparameter:</span>
                <ul className="space-y-0.5 font-mono text-[11px]">
                  <li>• Betrachtungszeitraum: <span className="font-bold text-shiraz">{formatDeWert(analysisPeriod)} Jahre</span></li>
                  <li>• Kalkulationszinssatz (<InlineMath math="r" />): <span className="font-bold text-shiraz">{formatDeZahl(discountRate, 1)} % / a</span></li>
                  <li>• Energiepreis-Inflation (<InlineMath math="e" />): <span className="font-bold text-shiraz">{formatDeZahl(energyInflation, 1)} % / a</span></li>
                  <li>• CO₂-Schattenpreis: <span className="font-bold text-shiraz">{co2PricingEnabled ? `Aktiv (${co2BasePrice} €/t, +${co2Escalation}%)` : 'Inaktiv'}</span></li>
                  <li>• KfW-Fördermodus: <span className="font-bold text-shiraz">{subsidyEnabled ? `Aktiv (${formatDeWert(subsidyPercent)}%)` : 'Inaktiv'}</span></li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main Scenario Selector */}
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm">
            <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest block font-mono mb-2">Didaktisches Praxis-Szenario</span>
            <h3 className="text-base font-bold text-slate-950 mb-4">Wählen Sie das bauliche Bauteilszenario für den Lebenszyklus-Vergleich:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SCENARIOS.map((scen) => (
                <button aria-pressed={selectedScenarioId === scen.id}
                  key={scen.id}
                  onClick={() => setSelectedScenarioId(scen.id)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    selectedScenarioId === scen.id
                      ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold shadow-sm'
                      : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xs font-mono text-stone-500 uppercase block mb-1">PROJEKT {scen.id === 'daemmung' ? '1' : scen.id === 'fenster' ? '2' : '3'}</span>
                  <span className="text-sm font-bold block leading-tight">{scen.title.split('(')[0]}</span>
                  <span className="text-[11px] font-normal text-slate-500 block mt-1 line-clamp-1">{scen.subtitle}</span>
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <strong>Szenario-Beschreibung:</strong> {activeScenario.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Economic Parameters Control panel (Left) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-5">
              <h3 className="font-bold text-slate-900 border-b border-home-grau/20 pb-3 flex items-center gap-2 text-sm leading-snug">
                <Scale size={16} className="text-shiraz" /> Volkswirtschaftliche &amp; Mathematische Parameter
              </h3>
              
              {/* Parameter 1: Analysis period N */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="period-slider" className="text-xs font-bold text-slate-700">Betrachtungszeitraum (N)</label>
                  <span className="text-xs font-mono font-bold text-shiraz">{formatDeWert(analysisPeriod)} Jahre</span>
                </div>
                <input
                  id="period-slider"
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={analysisPeriod}
                  onChange={(e) => setAnalysisPeriod(parseInt(e.target.value))}
                  className="w-full text-shiraz accent-shiraz cursor-pointer"
                />
                <span className="text-[9px] text-slate-400 block font-mono">DGNB-Standardwert für Gebäude: 50 Jahre.</span>
              </div>

              {/* Parameter 2: Discount Rate r */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="discount-slider" className="text-xs font-bold text-slate-700">Abzinsungssatz (Kalkulationszins <InlineMath math="r" />)</label>
                  <span className="text-xs font-mono font-bold text-shiraz">{formatDeZahl(discountRate, 1)} % / a</span>
                </div>
                <input
                  id="discount-slider"
                  type="range"
                  min="0.5"
                  max="6.0"
                  step="0.5"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
                  className="w-full text-shiraz accent-shiraz cursor-pointer"
                />
                <span className="text-[9px] text-slate-400 block font-mono">Stellt den Zinseffekt dar. Ein höherer Satz wertet ferne Kosten extrem ab.</span>
              </div>

              {/* Parameter 3: Energy Price escalation e */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="inflation-slider" className="text-xs font-bold text-slate-700">Sektor-Energiepreissteigerung (<InlineMath math="e" />)</label>
                  <span className="text-xs font-mono font-bold text-shiraz">{formatDeZahl(energyInflation, 1)} % / a</span>
                </div>
                <input
                  id="inflation-slider"
                  type="range"
                  min="0.0"
                  max="8.0"
                  step="0.5"
                  value={energyInflation}
                  onChange={(e) => setEnergyInflation(parseFloat(e.target.value))}
                  className="w-full text-shiraz accent-shiraz cursor-pointer"
                />
                <span className="text-[9px] text-slate-400 block font-mono">Wachstumskoeffizient für betriebliche Heiz- &amp; Kühlkosten.</span>
              </div>

              {/* Parameter 4: General Inflation i */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="geninflation-slider" className="text-xs font-bold text-slate-700">Allgemeine Inflation (<InlineMath math="i" />)</label>
                  <span className="text-xs font-mono font-bold text-shiraz">{formatDeZahl(generalInflation, 1)} % / a</span>
                </div>
                <input
                  id="geninflation-slider"
                  type="range"
                  min="0.0"
                  max="5.0"
                  step="0.5"
                  value={generalInflation}
                  onChange={(e) => setGeneralInflation(parseFloat(e.target.value))}
                  className="w-full text-shiraz accent-shiraz cursor-pointer"
                />
                <span className="text-[9px] text-slate-400 block font-mono">Jährliche Teuerungsrate für Lohnarbeiten, Austausch und Deponiekosten.</span>
              </div>

              {/* Professor Huber Enhancements: CO2 & Subsidy */}
              <div className="border-t border-slate-150 pt-4 mt-2 space-y-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Wissenschaftliche Parameter</span>

                {/* CO2 Shadow Pricing */}
                <div className="bg-[#fcf8f2] p-3 rounded-xl border border-orange-200/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="co2-toggle" className="text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer select-none">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      CO₂-Schattenpreis (<InlineMath math="\text{CO}_2" />)
                    </label>
                    <button
                      id="co2-toggle"
                      onClick={() => setCo2PricingEnabled(!co2PricingEnabled)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        co2PricingEnabled ? 'bg-shiraz' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          co2PricingEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {co2PricingEnabled && (
                    <div className="space-y-3 pt-2 border-t border-orange-100/50 animate-in fade-in duration-200">
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[10px] font-medium text-slate-600">CO₂-Basispreis (Start):</span>
                          <span className="text-xs font-mono font-bold text-shiraz">{formatDeWert(co2BasePrice)} € / t</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="220"
                          step="5"
                          value={co2BasePrice}
                          onChange={(e) => setCo2BasePrice(parseInt(e.target.value))}
                          className="w-full text-shiraz accent-shiraz cursor-pointer"
                        />
                        <span className="text-[8px] text-slate-400 block font-mono">UBA-Kostenansatz: ca. 180-200 €/t Schadensäquivalent.</span>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[10px] font-medium text-slate-600">Jährliche CO₂-Teuerung:</span>
                          <span className="text-xs font-mono font-bold text-shiraz">{formatDeZahl(co2Escalation, 1)} % / a</span>
                        </div>
                        <input
                          type="range"
                          min="0.0"
                          max="10.0"
                          step="0.5"
                          value={co2Escalation}
                          onChange={(e) => setCo2Escalation(parseFloat(e.target.value))}
                          className="w-full text-shiraz accent-shiraz cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* State Subsidy / Fördereffekt */}
                <div className="bg-[#fcf8f2] p-3 rounded-xl border border-orange-200/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="subsidy-toggle" className="text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer select-none">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                      Staatl. KfW-Förderung
                    </label>
                    <button
                      id="subsidy-toggle"
                      onClick={() => setSubsidyEnabled(!subsidyEnabled)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        subsidyEnabled ? 'bg-shiraz' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          subsidyEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {subsidyEnabled && (
                    <div className="pt-2 border-t border-orange-100/50 animate-in fade-in duration-200">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[10px] font-medium text-slate-600">Zuschuss auf Option B:</span>
                        <span className="text-xs font-mono font-bold text-shiraz">{formatDeWert(subsidyPercent)} %</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="40"
                        step="5"
                        value={subsidyPercent}
                        onChange={(e) => setSubsidyPercent(parseInt(e.target.value))}
                        className="w-full text-shiraz accent-shiraz cursor-pointer"
                      />
                      <span className="text-[8px] text-slate-400 block font-mono">Reduziert Investitionskosten (CapEx) der ökologischen Baustoffe.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Math context hint */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mt-2">
                <span className="font-bold text-[10px] text-slate-700 block mb-1 uppercase font-mono">Diskontierung ( NPV )</span>
                <p className="text-[11px] text-slate-600 leading-normal">
                  Kosten in Nutzungsjahr <InlineMath math="t" /> werden durch den Abzinsungsfaktor vermindert:
                </p>
                <div className="py-2 flex justify-center text-xs">
                  <InlineMath math="F_{diskont} = \frac{(1+Inflation)^t}{(1+r)^t}" />
                </div>
                <span className="text-[9px] text-slate-400 block leading-tight">Da <InlineMath math="r" /> in der Regel größer als die Inflation <InlineMath math="i" /> ist, gewinnen niedrige Errichtungskosten an Attraktivität, je höher Sie <InlineMath math="r" /> ansetzen.</span>
              </div>
            </div>

            {/* Results Compare Dashboard (Right) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Summary Savings Alert Card */}
              <div className={`p-5 rounded-2xl border flex gap-4 ${
                calcData.saving >= 0 
                  ? 'bg-emerald-50/70 border-emerald-250 text-emerald-950'
                  : 'bg-rose-50 border-rose-250 text-rose-950'
              }`}>
                <div className="p-3 bg-white rounded-xl shadow-xs shrink-0 flex items-center justify-center">
                  <Sparkles className={calcData.saving >= 0 ? 'text-emerald-600' : 'text-rose-600'} size={24} />
                </div>
                <div>
                  <h4 className="text-base font-bold">
                    {calcData.saving >= 0 
                      ? `Option B spart über den Lebenszyklus ${calcData.saving.toLocaleString('de-DE', {maximumFractionDigits: 0})} €`
                      : `Option A bleibt wirtschaftlicher um ${(Math.abs(calcData.saving)).toLocaleString('de-DE', {maximumFractionDigits: 0})} €`
                    }
                  </h4>
                  <p className="text-xs leading-relaxed mt-1">
                    {calcData.saving >= 0 
                      ? `Trotz einer höheren Initialinvestition an Tag Null (CapEx-Aufpreis von ${(activeScenario.optionB.capex - activeScenario.optionA.capex).toLocaleString('de-DE')} €) amortisiert sich Option B über die Lebensdauer von ${formatDeWert(analysisPeriod)} Jahren durch immense OpEx-Vorteile und das Ausbleiben teurer Austauschzyklen. Ein klarer Beleg für nachhaltiges Investment!`
                      : `Unter den gewählten Finanzrandbedingungen (insb. hohem Zinssatz oder kurzem Nutzungszeitraum) kann der Mehrpreis für die kreislauffähige Option B auf Grund der Abzinsung nicht vollständig kompensiert werden.`
                    }
                  </p>
                </div>
              </div>

              {/* Graphical representation: Visual Stacked Cost meters */}
              <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <BarChart3 size={15} className="text-shiraz" /> Strukturierte Barwert-Zusammensetzung (LCC-Vergleich)
                </h4>

                {/* Option A Horizontal bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{activeScenario.optionA.name}</span>
                    <span className="font-mono font-bold text-slate-950">{calcData.resultA.totalLCCDiscounted.toLocaleString('de-DE', {maximumFractionDigits: 0})} €</span>
                  </div>
                  
                  {/* Visual segments bar */}
                  <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden flex text-[10px] text-white font-mono font-bold">
                    {/* CapEx */}
                    <div 
                      className="bg-red-500 h-full flex items-center justify-center cursor-help"
                      style={{ width: `${Math.max(10, (calcData.resultA.capex / Math.max(calcData.resultA.totalLCCDiscounted, calcData.resultB.totalLCCDiscounted)) * 100)}%` }}
                      title={`Schritt 1 (Initialkosten): ${calcData.resultA.capex.toLocaleString('de-DE')} €`}
                    >
                      Cap{calcData.resultA.capex > 8000 ? 'Ex' : ''}
                    </div>
                    {/* OpEx */}
                    <div 
                      className="bg-amber-500 h-full flex items-center justify-center cursor-help border-l border-white/20"
                      style={{ width: `${Math.max(10, (calcData.resultA.cumulativeOpExDiscounted / Math.max(calcData.resultA.totalLCCDiscounted, calcData.resultB.totalLCCDiscounted)) * 100)}%` }}
                      title={`Betrieb (abgezinst): ${calcData.resultA.cumulativeOpExDiscounted.toLocaleString('de-DE', {maximumFractionDigits: 0})} €`}
                    >
                      Op{calcData.resultA.cumulativeOpExDiscounted > 8000 ? 'Ex' : ''}
                    </div>
                    {/* Maintenance */}
                    <div 
                      className="bg-indigo-500 h-full flex items-center justify-center cursor-help border-l border-white/20"
                      style={{ width: `${Math.max(5, (calcData.resultA.cumulativeMaintenanceDiscounted / Math.max(calcData.resultA.totalLCCDiscounted, calcData.resultB.totalLCCDiscounted)) * 100)}%` }}
                      title={`Wartung (abgezinst): ${calcData.resultA.cumulativeMaintenanceDiscounted.toLocaleString('de-DE', {maximumFractionDigits: 0})} €`}
                    >
                      {calcData.resultA.cumulativeMaintenanceDiscounted > 3000 ? 'Wart.' : 'W'}
                    </div>
                    {/* Replacement */}
                    {calcData.resultA.cumulativeReplacementDiscounted > 0 && (
                      <div 
                        className="bg-violet-600 h-full flex items-center justify-center cursor-help border-l border-white/20"
                        style={{ width: `${Math.max(5, (calcData.resultA.cumulativeReplacementDiscounted / Math.max(calcData.resultA.totalLCCDiscounted, calcData.resultB.totalLCCDiscounted)) * 100)}%` }}
                        title={`Austausch (abgezinst): ${calcData.resultA.cumulativeReplacementDiscounted.toLocaleString('de-DE', {maximumFractionDigits: 0})} €`}
                      >
                        {calcData.resultA.cumulativeReplacementDiscounted > 4000 ? 'Aust.' : 'A'}
                      </div>
                    )}
                    {/* CO2 Pricing */}
                    {co2PricingEnabled && (calcData.resultA.initialCO2Cost + calcData.resultA.cumulativeCO2Discounted) > 0 && (
                      <div 
                        className="bg-emerald-600 h-full flex items-center justify-center cursor-help border-l border-white/20"
                        style={{ width: `${Math.max(5, (((calcData.resultA.initialCO2Cost + calcData.resultA.cumulativeCO2Discounted) / Math.max(calcData.resultA.totalLCCDiscounted, calcData.resultB.totalLCCDiscounted)) * 100))}%` }}
                        title={`CO2-Umweltpreis (abgezinst): ${(calcData.resultA.initialCO2Cost + calcData.resultA.cumulativeCO2Discounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €`}
                      >
                        CO₂
                      </div>
                    )}
                    {/* Eol */}
                    {calcData.resultA.eolDiscounted > 0 && (
                      <div 
                        className="bg-stone-500 h-full flex items-center justify-center cursor-help border-l border-white/20"
                        style={{ width: `${Math.max(5, (calcData.resultA.eolDiscounted / Math.max(calcData.resultA.totalLCCDiscounted, calcData.resultB.totalLCCDiscounted)) * 100)}%` }}
                        title={`Rückbau (abgezinst): ${calcData.resultA.eolDiscounted.toLocaleString('de-DE', {maximumFractionDigits: 0})} €`}
                      >
                        EOL
                      </div>
                    )}
                  </div>
                </div>

                {/* Option B Horizontal bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{activeScenario.optionB.name}</span>
                    <span className="font-mono font-bold text-slate-950">{calcData.resultB.totalLCCDiscounted.toLocaleString('de-DE', {maximumFractionDigits: 0})} €</span>
                  </div>
                  
                  {/* Visual segments bar */}
                  <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden flex text-[10px] text-white font-mono font-bold">
                    {/* CapEx */}
                    <div 
                      className="bg-red-500 h-full flex items-center justify-center cursor-help"
                      style={{ width: `${Math.max(10, (calcData.resultB.capex / Math.max(calcData.resultA.totalLCCDiscounted, calcData.resultB.totalLCCDiscounted)) * 100)}%` }}
                      title={`Schritt 1 (Initialkosten abzügl. Förderung): ${calcData.resultB.capex.toLocaleString('de-DE')} €`}
                    >
                      Cap{calcData.resultB.capex > 8000 ? 'Ex' : ''}
                    </div>
                    {/* OpEx */}
                    <div 
                      className="bg-amber-500 h-full flex items-center justify-center cursor-help border-l border-white/20"
                      style={{ width: `${Math.max(10, (calcData.resultB.cumulativeOpExDiscounted / Math.max(calcData.resultA.totalLCCDiscounted, calcData.resultB.totalLCCDiscounted)) * 100)}%` }}
                      title={`Betrieb (abgezinst): ${calcData.resultB.cumulativeOpExDiscounted.toLocaleString('de-DE', {maximumFractionDigits: 0})} €`}
                    >
                      Op{calcData.resultB.cumulativeOpExDiscounted > 8000 ? 'Ex' : ''}
                    </div>
                    {/* Maintenance */}
                    <div 
                      className="bg-indigo-500 h-full flex items-center justify-center cursor-help border-l border-white/20"
                      style={{ width: `${Math.max(5, (calcData.resultB.cumulativeMaintenanceDiscounted / Math.max(calcData.resultA.totalLCCDiscounted, calcData.resultB.totalLCCDiscounted)) * 100)}%` }}
                      title={`Wartung (abgezinst): ${calcData.resultB.cumulativeMaintenanceDiscounted.toLocaleString('de-DE', {maximumFractionDigits: 0})} €`}
                    >
                      {calcData.resultB.cumulativeMaintenanceDiscounted > 3000 ? 'Wart.' : 'W'}
                    </div>
                    {/* Replacement */}
                    {calcData.resultB.cumulativeReplacementDiscounted > 0 && (
                      <div 
                        className="bg-violet-600 h-full flex items-center justify-center cursor-help border-l border-white/20"
                        style={{ width: `${Math.max(5, (calcData.resultB.cumulativeReplacementDiscounted / Math.max(calcData.resultA.totalLCCDiscounted, calcData.resultB.totalLCCDiscounted)) * 100)}%` }}
                        title={`Austausch (abgezinst): ${calcData.resultB.cumulativeReplacementDiscounted.toLocaleString('de-DE', {maximumFractionDigits: 0})} €`}
                      >
                        {calcData.resultB.cumulativeReplacementDiscounted > 4000 ? 'Aust.' : 'A'}
                      </div>
                    )}
                    {/* CO2 Pricing */}
                    {co2PricingEnabled && (calcData.resultB.initialCO2Cost + calcData.resultB.cumulativeCO2Discounted) > 0 && (
                      <div 
                        className="bg-emerald-600 h-full flex items-center justify-center cursor-help border-l border-white/20"
                        style={{ width: `${Math.max(5, (((calcData.resultB.initialCO2Cost + calcData.resultB.cumulativeCO2Discounted) / Math.max(calcData.resultA.totalLCCDiscounted, calcData.resultB.totalLCCDiscounted)) * 100))}%` }}
                        title={`CO2-Umweltpreis (abgezinst): ${(calcData.resultB.initialCO2Cost + calcData.resultB.cumulativeCO2Discounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €`}
                      >
                        CO₂
                      </div>
                    )}
                    {/* Eol (Note if negative, it represents a residue credit, so we render it conditionally or just ignore to keep graph visually bounded) */}
                    {calcData.resultB.eolDiscounted > 0 && (
                      <div 
                        className="bg-stone-500 h-full flex items-center justify-center cursor-help border-l border-white/20"
                        style={{ width: `${Math.max(5, (calcData.resultB.eolDiscounted / Math.max(calcData.resultA.totalLCCDiscounted, calcData.resultB.totalLCCDiscounted)) * 100)}%` }}
                        title={`Rückbau (abgezinst): ${calcData.resultB.eolDiscounted.toLocaleString('de-DE', {maximumFractionDigits: 0})} €`}
                      >
                        EOL
                      </div>
                    )}
                  </div>
                </div>

                {/* Legend and description for bar */}
                <div className="flex flex-wrap gap-2 justify-between pt-2 border-t border-slate-150 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500 rounded-xs block"></span> Anschaffung (CapEx)</div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-xs block"></span> Betrieb/Heizung (OpEx)</div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#059669] rounded-xs block"></span> CO₂-Zertifikatsteuer</div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-xs block"></span> Wartung</div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-violet-600 rounded-xs block"></span> Bauteiltausch</div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-stone-500 rounded-xs block"></span> Rückbau/Deponie/Restwert</div>
                </div>
              </div>

              {/* Side-by-side exact table breakdown */}
              <div className="bg-white rounded-2xl border border-home-grau/30 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-home-grau/25">
                  Detaillierte Bilanz nach Barwertmethode (Net Present Value)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-home-grau/20 text-[10px] text-slate-500 uppercase">
                        <th className="p-3">Kostenart</th>
                        <th className="p-3 text-right">Option A (Nominal)</th>
                        <th className="p-3 text-right font-bold bg-slate-100/60">Option A (Barwert)</th>
                        <th className="p-3 text-right">Option B (Nominal)</th>
                        <th className="p-3 text-right font-bold bg-indigo-50/60 text-indigo-950">Option B (Barwert)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3 font-medium">1. Errichtungskosten (CapEx)</td>
                        <td className="p-3 text-right text-slate-500">{(activeScenario.optionA.capex).toLocaleString('de-DE')} €</td>
                        <td className="p-3 text-right font-bold bg-slate-100/30">{(activeScenario.optionA.capex).toLocaleString('de-DE')} €</td>
                        <td className="p-3 text-right text-slate-500">{(activeScenario.optionB.capex).toLocaleString('de-DE')} €</td>
                        <td className="p-3 text-right font-bold bg-indigo-50/30 text-indigo-950">{(activeScenario.optionB.capex).toLocaleString('de-DE')} €</td>
                      </tr>
                      {subsidyEnabled && (
                        <tr className="bg-blue-50/40 text-blue-900 border-b border-blue-100/30">
                          <td className="p-2.5 pl-6 font-normal text-[11px] text-blue-800 flex items-center gap-1">↳ Staatl. KfW-Zuschuss ({formatDeWert(subsidyPercent)}%)</td>
                          <td className="p-2.5 text-right text-slate-400 font-mono">- 0 €</td>
                          <td className="p-2.5 text-right font-mono bg-slate-100/20 text-slate-400">- 0 €</td>
                          <td className="p-2.5 text-right font-mono text-blue-700">- {((activeScenario.optionB.capex * subsidyPercent) / 100).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                          <td className="p-2.5 text-right font-bold font-mono bg-indigo-50/20 text-blue-800">- {((activeScenario.optionB.capex * subsidyPercent) / 100).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        </tr>
                      )}
                      <tr>
                        <td className="p-3 font-medium text-slate-750">2. Betriebskosten (Netto OpEx)</td>
                        <td className="p-3 text-right text-slate-500">{(calcData.resultA.cumulativeOpExNominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right font-bold bg-slate-100/30">{(calcData.resultA.cumulativeOpExDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right text-slate-500">{(calcData.resultB.cumulativeOpExNominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right font-bold bg-indigo-50/30 text-indigo-950">{(calcData.resultB.cumulativeOpExDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">3. Laufende Instandhaltung</td>
                        <td className="p-3 text-right text-slate-500">{(calcData.resultA.cumulativeMaintenanceNominal).toLocaleString('de-DE')} €</td>
                        <td className="p-3 text-right font-bold bg-slate-100/30">{(calcData.resultA.cumulativeMaintenanceDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right text-slate-500">{(calcData.resultB.cumulativeMaintenanceNominal).toLocaleString('de-DE')} €</td>
                        <td className="p-3 text-right font-bold bg-indigo-50/30 text-indigo-950">{(calcData.resultB.cumulativeMaintenanceDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">4. Erneuerung &amp; Bauteiltausch</td>
                        <td className="p-3 text-right text-slate-500">{(calcData.resultA.cumulativeReplacementNominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right font-bold bg-slate-100/30">{(calcData.resultA.cumulativeReplacementDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right text-slate-500">{(calcData.resultB.cumulativeReplacementNominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right font-bold bg-indigo-50/30 text-indigo-950">{(calcData.resultB.cumulativeReplacementDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">5. Rückbau / Restwert (EOL)</td>
                        <td className="p-3 text-right text-slate-500">{(calcData.resultA.eolNominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right font-bold bg-slate-100/30">{(calcData.resultA.eolDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right text-slate-500">{(calcData.resultB.eolNominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right font-bold bg-indigo-50/30 text-indigo-950">{(calcData.resultB.eolDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                      </tr>
                      {co2PricingEnabled && (
                        <tr className="bg-emerald-50/45 text-emerald-950 border-t border-emerald-100">
                          <td className="p-3 font-medium text-emerald-900">6. CO₂-Schattenpreis (Klima)</td>
                          <td className="p-3 text-right text-slate-500 font-mono">{(calcData.resultA.initialCO2Cost + calcData.resultA.cumulativeCO2Nominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                          <td className="p-3 text-right font-bold font-mono bg-[#fcf8f2]/30 text-emerald-800">{(calcData.resultA.initialCO2Cost + calcData.resultA.cumulativeCO2Discounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                          <td className="p-3 text-right text-slate-500 font-mono">{(calcData.resultB.initialCO2Cost + calcData.resultB.cumulativeCO2Nominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                          <td className="p-3 text-right font-bold font-mono bg-indigo-50/30 text-emerald-900">{(calcData.resultB.initialCO2Cost + calcData.resultB.cumulativeCO2Discounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        </tr>
                      )}
                      <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-350">
                        <td className="p-3 uppercase tracking-wide text-[10px]">LCC-Gesamtsumme (Barwert)</td>
                        <td colSpan={2} className="p-3 text-right text-sm">{(calcData.resultA.totalLCCDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td colSpan={2} className="p-3 text-right text-sm text-indigo-850">{(calcData.resultB.totalLCCDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>

          {/* Detailed features check and explanations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-3 border-b border-home-grau/25 pb-2">{activeScenario.optionA.name}</h4>
              <p className="text-xs text-slate-500 mb-4">{activeScenario.optionA.className}</p>
              <div className="space-y-3">
                {activeScenario.optionA.details.map((det, index) => (
                  <div key={index} className="flex gap-2.5 text-xs text-slate-700 leading-normal">
                    <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={14} />
                    <span>{det}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-indigo-900 text-sm mb-3 border-b border-home-grau/25 pb-2">{activeScenario.optionB.name}</h4>
              <p className="text-xs text-indigo-600 mb-4">{activeScenario.optionB.className}</p>
              <div className="space-y-3">
                {activeScenario.optionB.details.map((det, index) => (
                  <div key={index} className="flex gap-2.5 text-xs text-slate-700 leading-normal">
                    <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                    <span>{det}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'theorie' && (
        <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6 animate-in fade-in duration-305">
          <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2 border-b border-home-grau/20 pb-3">
            <Layers size={18} className="text-shiraz" /> Theorie, Normung &amp; Strukturierung nach DIN 18960
          </h3>

          <div className="space-y-4 text-sm text-slate-800 leading-relaxed">
            <h4 className="font-bold text-slate-900 text-base">1. Die Kostenstruktur nach DIN 18960</h4>
            <p>
              Für Hochbauten regelt die <strong>DIN 18960 (Nutzungskosten im Hochbau)</strong> die standardisierte Berücksichtigung aller Kostenarten über die Betriebsphase eines Bauwerks. Sie gliedert sich im Wesentlichen in folgende baulich relevante Kostengruppen (KG):
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>KG 100 (Kapitalkosten):</strong> Verzinsung des eingesetzten Kapitals, Abschreibungen, Kredite.</li>
              <li><strong>KG 200 (Betriebskosten):</strong> Kosten für Energieträger (Strom, Fernwärme, Gas), Frisch- und Abwasser, Reinigungspflege sowie technischer Betriebdienst.</li>
              <li><strong>KG 300 (Instandhaltungskosten):</strong> Bauliche Wartungsarbeiten, Schönheitsreparaturen und der zyklische baustoff-spezifische Austausch einzelner Verschleißteile (z. B. Fensterflügel nach 30 Jahren).</li>
              <li><strong>KG 400 (Sonstige Nutzungskosten):</strong> Versicherungen, Steuern, Liegenschaftsabgaben und Verwaltungsaufwendungen.</li>
            </ul>

            <h4 className="font-bold text-slate-900 text-base pt-2">2. Die mathematische Barwertmethode (Net Present Value - NPV)</h4>
            <p>
              Finanzmathematisch wird der Umstand modelliert, dass zukünftiges Geld auf Grund von Opportunitätszinsen und Liquiditätspräferenz heute einen geringeren Sachwert besitzt. LCC nutzt zur Zusammenführung zeitlich unterschiedlich verteilter Kosten die **Barwertmethode**:
            </p>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs my-3">
              <span className="font-bold text-slate-900 block mb-1">Volle mathematische LCC-Zusammenführung:</span>
              <BlockMath math="LCC = C_{CapEx} + \sum_{t=1}^{N} \frac{C_{OpEx, t} \cdot (1+e)^t}{(1+r)^t} + \sum \frac{C_{Maint, t} \cdot (1+i)^t}{(1+r)^t} \pm \frac{C_{End-of-Life}}{(1+r)^N}" />
              <div className="mt-4 text-[10px] text-slate-500 font-sans space-y-1">
                <p>• <strong>C<sub>CapEx</sub></strong>: Initial-Investitionskosten an Tag 0</p>
                <p>• <strong>C<sub>OpEx, t</sub></strong>: Betriebskosten im Jahr t, erhöht unter der Sektor-Energiepreissteigerungsrate e</p>
                <p>• <strong>C<sub>Maint, t</sub></strong>: Wartungs- und Austauschkosten in den jeweiligen Erneuerungsjahren, erhöht um die allgemeine Inflation i</p>
                <p>• <strong>C<sub>End-of-Life</sub></strong>: Abtragungs- oder Rückbaukosten am Berechnungsende im Jahr N</p>
                <p>• <strong>r</strong>: Abzinsungssatz (Kalkulationszinssatz)</p>
              </div>
            </div>

            <h4 className="font-bold text-slate-900 text-base pt-2">3. Ökologischer &amp; ökonomischer Zielkonflikt</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#f2f6fc] p-4 rounded-xl border border-blue-150">
              <div>
                <span className="font-bold text-slate-900 block mb-1">Nationale DGNB-/BNB-Nutzung</span>
                <p className="text-slate-700">
                  Um für das staatliche QNG-Qualitätssiegel bezuschussungsfähig zu sein, fordert das Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen (BMWSB) die Durchführung beider Bilanzen. LCC-Szenarien werden regulär mit einem normativ fixierten Kalkulationszins von <strong>1,5% oder 2,0%</strong> über genau 50 Jahre modelliert.
                </p>
              </div>
              <div>
                <span className="font-bold text-slate-900 block mb-1">Wirtschaftliche Triebfeder</span>
                <p className="text-slate-700">
                  Während eine günstige Investition an Tag Null den schnellen Rendite-Fokus des Immobilienentwicklers befriedigt, ist sie für den langfristigen Betreiber (Eigennutzer, Wohnungsgesellschaften) oft unvorteilhaft. LCC macht diesen "Trittbrettfahrer-Effekt" transparent und schützt Planer und Bauherren vor unerwarteten Betriebskostenexplosionen.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ModuleFooter
        wikipedia={[
          { title: 'Lebenszykluskostenrechnung', url: 'https://de.wikipedia.org/wiki/Lebenszykluskostenrechnung' },
          { title: 'Barwert', url: 'https://de.wikipedia.org/wiki/Barwert' },
          { title: 'Kapitalwertmethode', url: 'https://de.wikipedia.org/wiki/Kapitalwertmethode' }
        ]}
        regelwerke={[
          { title: 'DIN 18960 (Nutzungskosten im Hochbau)' },
          { title: 'ISO 15686-5:2017 (Buildings and constructed assets — Service-life planning — Part 5: Life-cycle costing)', url: 'https://www.iso.org/' },
          { title: 'GEFMA 220 (Lebenszykluskostenrechnung im Facility Management)', url: 'https://www.gefma.de/' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Pelzeter, A. (2006): Lebenszykluskosten von Immobilien (Fraunhofer IRB Verlag)',
          'DGNB Handbuch: Kriterium ENV2.1 / ECO1.1 Lebenszykluskosten'
        ]}
        formeln={[
          {
            formel: 'LCC = C_0 + \\sum_{t=1}^N \\frac{C_t}{(1 + r)^t} - \\frac{R_N}{(1 + r)^N}',
            erklaerung: 'Lebenszykluskosten (Kapitalwert/Net Present Value): Summe aus Anfangsinvestition C_0, diskontierten Betriebskosten/Instandhaltungskosten C_t und abgezinstem Restwert R_N bei Diskontierungsrate r.',
            quelle: 'ISO 15686-5 / DIN 18960'
          },
          {
            formel: 'q = 1 + \\frac{p}{100} \\implies \\text{RBF}(n, r) = \\frac{(1 + r)^n - 1}{r \\cdot (1 + r)^n}',
            erklaerung: 'Rentenbarwertfaktor (RBF) zur Abzinsung gleichförmig wiederkehrender jährlicher Instandhaltungs- und Energiekosten über n Nutzungsjahre.',
            quelle: 'DIN 18960'
          }
        ]}
      />
    </div>
  );
}
