import { formatDeZahl } from '@/src/utils/numberFormat';
import { useState, useMemo } from 'react';
import '@/src/lib/chartSetup';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Leaf, Building, Percent } from 'lucide-react';
import { EPD_DATABASE, PRESET_WALLS, ALLE_BEREICHE } from './nachhaltigkeit/daten';
import type { ConfiguredLayer, NachhaltigkeitBereich } from './nachhaltigkeit/daten';
import Wandkonfigurator from './nachhaltigkeit/Wandkonfigurator';
import QngNachweis from './nachhaltigkeit/QngNachweis';
import CrremRegulatorik from './nachhaltigkeit/CrremRegulatorik';
import PraxisInnovationen from './nachhaltigkeit/PraxisInnovationen';
import Leitfaden from './nachhaltigkeit/Leitfaden';
export type { NachhaltigkeitBereich } from './nachhaltigkeit/daten';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Nachhaltigkeit({ bereiche = ALLE_BEREICHE }: { bereiche?: readonly NachhaltigkeitBereich[] }) {
  const [activeWorkspace, setActiveWorkspace] = useState<NachhaltigkeitBereich>(bereiche[0]);
  const zeige = (b: NachhaltigkeitBereich) => bereiche.includes(b);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeEcoDb, setActiveEcoDb] = useState<'oekobaudat' | 'dgnb' | 'ibu' | 'wecobis'>('oekobaudat');
  const [regulatorikSubTab, setRegulatorikSubTab] = useState<'rechtsrahmen' | 'crrem_sim'>('rechtsrahmen');

  // CRREM Simulator States
  const [crremBuildingType, setCrremBuildingType] = useState<'office' | 'residential'>('office');
  const [crremCurrentGwp, setCrremCurrentGwp] = useState<number>(45); // kg CO2e/(m²·a)
  const [crremRetrofit, setCrremRetrofit] = useState<'none' | 'opex' | 'capex_huelle' | 'capex_deep'>('none');

  // Praxis & Suffizienz States
  const [praxisCategory, setPraxisCategory] = useState<'gebaeudetyp_e' | 'urban_mining' | 'lehmbau' | 'holz_hybrid'>('gebaeudetyp_e');
  const [lehmWandstaerke, setLehmWandstaerke] = useState<number>(17.5);

  // Wandkonfigurator States
  const [wallLayers, setWallLayers] = useState<ConfiguredLayer[]>(PRESET_WALLS.massiv_wdvs.layers);
  const [selectedAddMaterial, setSelectedAddMaterial] = useState<string>('concrete_cem1');
  const [addThickness, setAddThickness] = useState<number>(10);
  const [connectionType, setConnectionType] = useState<'glued' | 'screwed'>('glued');

  // QNG States
  const [bgf, setBgf] = useState<number>(350); // m²
  const [constructionType, setConstructionType] = useState<'holzbau' | 'hybrid' | 'massiv'>('hybrid');
  const [heatingSystem, setHeatingSystem] = useState<string>('waermepumpe');
  const [pvSizeKwp, setPvSizeKwp] = useState<number>(12); // kWp
  const [greenTariff, setGreenTariff] = useState<boolean>(true);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});

  // Apply preset wall config
  const applyPreset = (presetKey: string) => {
    if (PRESET_WALLS[presetKey]) {
      setWallLayers(PRESET_WALLS[presetKey].layers);
    }
  };

  // Modify Layer thickness
  const handleThicknessChange = (index: number, val: number) => {
    const updated = [...wallLayers];
    updated[index].thicknessCm = Math.max(0.5, parseFloat(val.toFixed(2)));
    setWallLayers(updated);
  };

  // Move layer order
  const moveLayer = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === wallLayers.length - 1) return;
    const destIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...wallLayers];
    const temp = updated[index];
    updated[index] = updated[destIndex];
    updated[destIndex] = temp;
    setWallLayers(updated);
  };

  // Remove Layer
  const removeLayer = (index: number) => {
    if (wallLayers.length <= 1) return;
    setWallLayers(wallLayers.filter((_, i) => i !== index));
  };

  // Add Layer
  const addLayer = () => {
    setWallLayers([...wallLayers, { materialKey: selectedAddMaterial, thicknessCm: addThickness }]);
  };

  // Mathematical processing of configured wall assemblies
  const computedWall = useMemo(() => {
    let totalThicknessM = 0;
    let totalR = 0.13 + 0.04; // R_si = 0.13, R_se = 0.04
    let gwpFossilA1A3 = 0;
    let gwpBiogenicA1A3 = 0;
    let gwpC3C4 = 0;
    let gwpD = 0;
    let penrtTotal = 0;
    let totalWeightKg = 0;
    let weightedCircularitySum = 0;

    const layerDetails = wallLayers.map((layer) => {
      const mat = EPD_DATABASE[layer.materialKey] || EPD_DATABASE.concrete_cem1;
      const thicknessM = layer.thicknessCm / 100;
      const r_i = thicknessM / mat.lambda;
      const massKg = thicknessM * mat.density; // per 1 m² wall

      totalThicknessM += thicknessM;
      totalR += r_i;
      totalWeightKg += massKg;

      // Footprint indices
      const layerGwpFossil = massKg * mat.gwp_fossil_a1a3;
      const layerGwpBiogenic = massKg * mat.gwp_biogenic_a1a3;
      const layerGwpC3C4 = massKg * mat.gwp_c3c4;
      const layerGwpD = massKg * mat.gwp_d;
      const layerPenrt = massKg * mat.penrt;

      gwpFossilA1A3 += layerGwpFossil;
      gwpBiogenicA1A3 += layerGwpBiogenic;
      gwpC3C4 += layerGwpC3C4;
      gwpD += layerGwpD;
      penrtTotal += layerPenrt;
      
      // Accumulate mass-weighted circularity potential
      weightedCircularitySum += massKg * mat.circularity_pct;

      return {
        ...layer,
        mat,
        massKg,
        r_i,
        gwpTotalA1A3: layerGwpFossil + layerGwpBiogenic
      };
    });

    const uValue = 1 / totalR;
    const gwpTotalA1A3 = gwpFossilA1A3 + gwpBiogenicA1A3;
    const gwpNetTotal = gwpTotalA1A3 + gwpC3C4 + gwpD;

    // Calculate dynamic circularity score decision tree based on material mix & decoupling joints
    const inherentCircularity = totalWeightKg > 0 ? (weightedCircularitySum / totalWeightKg) : 0;
    const jointSeparabilityFactor = connectionType === 'screwed' ? 1.0 : 0.45;
    const effectiveCircularity = inherentCircularity * jointSeparabilityFactor;

    return {
      layers: layerDetails,
      thicknessCm: totalThicknessM * 100,
      totalWeightKg,
      rVal: totalR,
      uValue,
      gwpFossilA1A3,
      gwpBiogenicA1A3,
      gwpTotalA1A3,
      gwpC3C4,
      gwpD,
      gwpNetTotal,
      penrtTotal,
      inherentCircularity,
      jointSeparabilityFactor,
      effectiveCircularity
    };
  }, [wallLayers, connectionType]);

  // Chart configuration for dynamic GWP breakdown
  const chartData = {
    labels: ['Herstellung (A1-A3)', 'Entsorgung (C3-C4)', 'Gutschriften (Modul D)', 'Ökobilanz Netto-Gesamt'],
    datasets: [
      {
        label: 'Treibhauspotenzial (kg CO₂-eq/m² Wand)',
        data: [
          computedWall.gwpTotalA1A3,
          computedWall.gwpC3C4,
          computedWall.gwpD,
          computedWall.gwpNetTotal
        ],
        backgroundColor: (context: any) => {
          const value = context.raw;
          if (value < 0) return '#475569'; // positive credit is teal green
          if (context.dataIndex === 3) return '#A3113E'; // Net total is deep red
          return '#475569'; // basic emission is slate-blue
        },
        borderRadius: 8,
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${formatDeZahl(context.raw, 2)} kg CO₂-eq`
        }
      }
    },
    scales: {
      y: {
        grid: { color: '#e2e8f0' },
        title: { display: true, text: 'kg CO₂-eq / m² Wand' }
      }
    }
  };

  // GEG Rating assessment
  const getGegRating = (uVal: number) => {
    if (uVal <= 0.15) {
      return {
        label: 'Passivhaus-Niveau (U ≤ 0,15)',
        color: 'bg-slate-100 text-slate-800 border-slate-300',
        rating: 'Exzellent'
      };
    }
    if (uVal <= 0.24) {
      return {
        label: 'Erfüllt GEG-Höchstwert Sanierung (0,24)',
        color: 'bg-slate-50 text-slate-700 border-slate-200',
        rating: 'Konform'
      };
    }
    return {
      label: 'Über GEG-Höchstwert Sanierung (0,24 W/(m²K))',
      color: 'bg-shiraz/5 text-shiraz border-shiraz/20',
      rating: 'Kritisch'
    };
  };

  const gegRating = getGegRating(computedWall.uValue);

  // QNG-Nachweis Simulator Calculations
  const qngComputation = useMemo(() => {
    // 1. Material-based footprint estimation (kg CO₂/m² NRF/year) over 50 years standard lifetime
    let materialGwpAnnual = 0;
    if (constructionType === 'holzbau') materialGwpAnnual = 5.5; // low, sequestering offsets some elements
    else if (constructionType === 'hybrid') materialGwpAnnual = 11.2;
    else materialGwpAnnual = 18.5; // heavy masonry/concrete

    // 2. Operational footprint (HVAC)
    let heatingGwpAnnual = 0;
    if (heatingSystem === 'gasherdfossil') heatingGwpAnnual = 28.0; // fossil gas
    else if (heatingSystem === 'fernwaerme') heatingGwpAnnual = 10.5; // district heat
    else if (heatingSystem === 'waermepumpe') heatingGwpAnnual = greenTariff ? 0.3 : 2.5; // standard heat pump
    else if (heatingSystem === 'biomasse') heatingGwpAnnual = 1.2; // pellet boiler

    // 3. Solar PV Credits (capped dynamically by standard grids)
    const pvYieldCo2Credit = Math.min(4.5, (pvSizeKwp * 0.28)); // CO2 displacement credits
    
    // Yearly score
    const totalYearlyGwp = Math.max(0.5, (materialGwpAnnual + heatingGwpAnnual) - pvYieldCo2Credit);

    // QNG certification thresholds (residential new builds)
    // Limits WG23: QNG-Plus <= 24,0, QNG-Premium <= 20,0 kg CO₂-eq / (m² NRF · a) (QNG-Handbuch Anlage 3, v1.4)
    let label = 'Nicht gefördert';
    let ratingColor = 'text-shiraz bg-shiraz/5 border-shiraz/20';
    let status = 'failed';

    if (totalYearlyGwp <= 20.0) {
      label = 'QNG-PREMIUM Siegel erreicht';
      ratingColor = 'text-slate-900 bg-slate-100 border-slate-300';
      status = 'premium';
    } else if (totalYearlyGwp <= 24.0) {
      label = 'QNG-PLUS Siegel erreicht';
      ratingColor = 'text-slate-800 bg-slate-50 border-slate-200';
      status = 'plus';
    }

    return {
      materialGwpAnnual,
      heatingGwpAnnual,
      pvYieldCo2Credit,
      totalYearlyGwp,
      label,
      ratingColor,
      status
    };
  }, [constructionType, heatingSystem, pvSizeKwp, greenTariff]);

  // CRREM Decarbonization Pathway Simulator Calculations (Paris 1.5°C v2 for Germany)
  const crremResult = useMemo(() => {
    let effectiveGwp = crremCurrentGwp;
    let reductionLabel = 'Keine Sanierungsmaßnahme (Status Quo)';
    let reductionPct = 0;

    if (crremRetrofit === 'opex') {
      reductionPct = 15;
      effectiveGwp *= 0.85;
      reductionLabel = 'Opex: Betriebsoptimierung & Smart Metering (-15 %)';
    } else if (crremRetrofit === 'capex_huelle') {
      reductionPct = 35;
      effectiveGwp *= 0.65;
      reductionLabel = 'Capex Hülle: Fassaden-, Dach- & Fensterdämmung (-35 %)';
    } else if (crremRetrofit === 'capex_deep') {
      reductionPct = 75;
      effectiveGwp *= 0.25;
      reductionLabel = 'Deep Capex: Hülle + Wärmepumpe + PV-Eigenstrom (-75 %)';
    }

    const isOffice = crremBuildingType === 'office';

    // Target intensity curves [kg CO2e/m²_NFA/a]
    const getTargetForYear = (year: number): number => {
      if (year <= 2020) return isOffice ? 52.0 : 35.0;
      if (year <= 2025) {
        const t = (year - 2020) / 5;
        return isOffice ? 52.0 - t * (52.0 - 38.0) : 35.0 - t * (35.0 - 26.0);
      }
      if (year <= 2030) {
        const t = (year - 2025) / 5;
        return isOffice ? 38.0 - t * (38.0 - 18.0) : 26.0 - t * (26.0 - 15.0);
      }
      if (year <= 2035) {
        const t = (year - 2030) / 5;
        return isOffice ? 18.0 - t * (18.0 - 10.0) : 15.0 - t * (15.0 - 8.0);
      }
      if (year <= 2040) {
        const t = (year - 2035) / 5;
        return isOffice ? 10.0 - t * (10.0 - 5.0) : 8.0 - t * (8.0 - 4.0);
      }
      if (year <= 2045) {
        const t = (year - 2040) / 5;
        return isOffice ? 5.0 - t * (5.0 - 1.5) : 4.0 - t * (4.0 - 1.2);
      }
      if (year <= 2050) {
        const t = (year - 2045) / 5;
        return isOffice ? 1.5 - t * 1.5 : 1.2 - t * 1.2;
      }
      return 0.0;
    };

    let strandingYear: number | null = null;
    for (let yr = 2020; yr <= 2050; yr++) {
      if (effectiveGwp > getTargetForYear(yr)) {
        strandingYear = yr;
        break;
      }
    }

    const target2026 = getTargetForYear(2026);
    const target2030 = getTargetForYear(2030);
    const isCurrentlyStranded = strandingYear !== null && strandingYear <= 2026;

    return {
      effectiveGwp,
      reductionLabel,
      reductionPct,
      strandingYear,
      isCurrentlyStranded,
      target2026,
      target2030,
      getTargetForYear
    };
  }, [crremBuildingType, crremCurrentGwp, crremRetrofit]);

  return (
    <div className="flex flex-col gap-6 font-normal">
      
      {/* Title & Tool Selection banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Building className="text-shiraz" /> LCA-Praxiswerkstatt &amp; Nachhaltigkeit
          </h2>

          {/* Workspace select button group */}
          <div className="flex flex-wrap gap-2">
            {zeige('wandkonfigurator') && (
            <button aria-pressed={activeWorkspace === 'wandkonfigurator'}
              onClick={() => setActiveWorkspace('wandkonfigurator')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                activeWorkspace === 'wandkonfigurator'
                  ? 'bg-shiraz text-white border-shiraz shadow-md'
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
              }`}
            >
              Wandaufbau
            </button>
            )}
            {zeige('qng_nachweis') && (
            <button aria-pressed={activeWorkspace === 'qng_nachweis'}
              onClick={() => setActiveWorkspace('qng_nachweis')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                activeWorkspace === 'qng_nachweis'
                  ? 'bg-shiraz text-white border-shiraz shadow-md'
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
              }`}
            >
              QNG-Nachweis
            </button>
            )}
            {zeige('crrem_regulatorik') && (
            <button aria-pressed={activeWorkspace === 'crrem_regulatorik'}
              onClick={() => setActiveWorkspace('crrem_regulatorik')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                activeWorkspace === 'crrem_regulatorik'
                  ? 'bg-shiraz text-white border-shiraz shadow-md'
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
              }`}
            >
              CRREM &amp; Regulatorik
            </button>
            )}
            {zeige('praxis_innovationen') && (
            <button aria-pressed={activeWorkspace === 'praxis_innovationen'}
              onClick={() => setActiveWorkspace('praxis_innovationen')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                activeWorkspace === 'praxis_innovationen'
                  ? 'bg-shiraz text-white border-shiraz shadow-md'
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
              }`}
            >
              Praxis &amp; Gebäudetyp E
            </button>
            )}
            {zeige('leitfaden') && (
            <button aria-pressed={activeWorkspace === 'leitfaden'}
              onClick={() => setActiveWorkspace('leitfaden')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                activeWorkspace === 'leitfaden'
                  ? 'bg-shiraz text-white border-shiraz shadow-md'
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
              }`}
            >
              EPD- &amp; QNG-Leitfaden
            </button>
            )}
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>
            Führen Sie akademische Bauteil- und Gebäude-Ökobilanzierungen (LCA) durch, simulieren Sie Dekarbonisierungspfade (CRREM / EPBD 2024/1275), prüfen Sie QNG-Nachweise und erkunden Sie zirkuläre Innovationen von tragendem Lehmbau (DIN 18940) bis zum Gebäudetyp E (§ 650o BGB).
          </p>
        </div>
      </div>

      {/* Info-Sektion: Treibhausgase (THG), CO₂ und CO₂-eq im Bauwesen */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b border-home-grau/20 pb-3">
          <Leaf className="text-shiraz w-6 h-6 shrink-0" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Wissenschaftlicher Leitfaden: THG, CO₂ &amp; CO₂-äq im Bauwesen</h3>
            <p className="text-xs text-slate-500">Klimawirkungsindikatoren verstehen und mit standardisierten GWP-Faktoren umrechnen.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: THG */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">Definition</span>
              <strong className="text-sm text-slate-900 font-bold">1. Treibhausgase (THG)</strong>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Treibhausgase sind Infrarotstrahlung absorbierende gasförmige Moleküle in der Erdatmosphäre. 
              Im Bauwesen spielen vor allem Kohlendioxid (<strong>CO₂</strong>) durch Zemententsäuerung, Methan (<strong>CH₄</strong>) aus vorgelagerten Energieversorgungsketten sowie Distickstoffmonoxid (<strong>N₂O</strong>, Lachgas) eine entscheidende ökologische Rolle.
            </p>
          </div>

          {/* Card 2: CO2 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">Referenz</span>
              <strong className="text-sm text-slate-900 font-bold">2. Kohlendioxid (CO₂)</strong>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Kohlendioxid dient als internationaler Referenzmaßstab der Klimawirkung mit einem Treibhauspotenzial (Global Warming Potential, <strong>GWP</strong>) von exakt <strong>1,0</strong>. 
              Mehr als die Hälfte der CO₂-Emissionen im Massivbau entsteht direkt chemisch-prozessbedingt während des Klinker-Brennens (Kalkstein-Entsäuerung im Zementwerk).
            </p>
          </div>

          {/* Card 3: CO2-eq */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">Äquivalent</span>
              <strong className="text-sm text-slate-900 font-bold">3. CO₂-Äquivalent (CO₂-eq)</strong>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Da verschiedene Gase die Atmosphäre um ein Vielfaches intensiver erwärmen als CO₂, normiert man ihre spezifische Treibhauswirkung über das relative Massenverhältnis zu CO₂ in einem 100-Jahre-Zeitfenster (<strong>GWP₁₀₀</strong>). 
              Dadurch lassen sich alle relevanten THG-Einflüsse zu einem einzigen LCA-Summenwert vergleichen.
            </p>
          </div>
        </div>

        {/* Umrechnungsfaktoren Subgrid */}
        <div className="mt-2 pt-4 border-t border-home-grau/20">
          <h4 className="text-xs font-bold text-slate-900 mb-2.5 flex items-center gap-1.5 uppercase tracking-wider">
            <Percent size={14} className="text-shiraz" /> Standardisierte GWP₁₀₀-Umrechnungsfaktoren (IPCC AR6):
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { gas: 'CO₂', name: 'Kohlendioxid', factor: '1.0', units: '1,0 kg CO₂-eq', desc: 'Referenzgas' },
              { gas: 'CH₄', name: 'Methan', factor: '29.8', units: '29,8 kg CO₂-eq', desc: 'z.B. aus Erdgas-Leitungen' },
              { gas: 'N₂O', name: 'Distickstoffmonoxid', factor: '273.0', units: '273,0 kg CO₂-eq', desc: 'z.B. durch Dünger/Klinkerprozesse' },
              { gas: 'SF₆', name: 'Schwefelhexafluorid', factor: '24.300', units: '24.300 kg CO₂-eq', desc: 'stärkstes THG (z.B. Isoliergase)' }
            ].map((u, i) => (
              <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-between hover:shadow-xs transition-shadow">
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold font-mono text-slate-800">{u.gas}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{u.name}</span>
                  </div>
                  <p className="text-[9px] text-slate-500 mt-0.5 leading-snug">{u.desc}</p>
                </div>
                <div className="mt-2.5 pt-1.5 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-400">1 kg × {u.factor} =</span>
                  <span className="text-[10px] font-mono font-bold text-shiraz">{u.units}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workspace 1: Wandkonfigurator */}
      {activeWorkspace === 'wandkonfigurator' && <Wandkonfigurator addLayer={addLayer} addThickness={addThickness} applyPreset={applyPreset} chartData={chartData} chartOptions={chartOptions} computedWall={computedWall} connectionType={connectionType} gegRating={gegRating} handleThicknessChange={handleThicknessChange} moveLayer={moveLayer} removeLayer={removeLayer} selectedAddMaterial={selectedAddMaterial} setAddThickness={setAddThickness} setConnectionType={setConnectionType} setSelectedAddMaterial={setSelectedAddMaterial} wallLayers={wallLayers} />}

      {/* Workspace 2: QNG-Nachweis Simulator */}
      {activeWorkspace === 'qng_nachweis' && <QngNachweis bgf={bgf} constructionType={constructionType} greenTariff={greenTariff} heatingSystem={heatingSystem} pvSizeKwp={pvSizeKwp} qngComputation={qngComputation} setBgf={setBgf} setConstructionType={setConstructionType} setGreenTariff={setGreenTariff} setHeatingSystem={setHeatingSystem} setPvSizeKwp={setPvSizeKwp} />}

      {/* Workspace 3: CRREM & Regulatorik (EPBD, BauPVO, ESPR, CBAM, ETS, CSRD...) */}
      {activeWorkspace === 'crrem_regulatorik' && <CrremRegulatorik crremBuildingType={crremBuildingType} crremCurrentGwp={crremCurrentGwp} crremResult={crremResult} crremRetrofit={crremRetrofit} regulatorikSubTab={regulatorikSubTab} setCrremBuildingType={setCrremBuildingType} setCrremCurrentGwp={setCrremCurrentGwp} setCrremRetrofit={setCrremRetrofit} setRegulatorikSubTab={setRegulatorikSubTab} />}

      {/* Workspace 4: Praxis, Suffizienz & Gebäudetyp E */}
      {activeWorkspace === 'praxis_innovationen' && <PraxisInnovationen praxisCategory={praxisCategory} setPraxisCategory={setPraxisCategory} />}

      {/* Workspace 5: EPD- & QNG-Wegweiser (Leitfaden) */}
      {activeWorkspace === 'leitfaden' && <Leitfaden activeEcoDb={activeEcoDb} activeStep={activeStep} checklistState={checklistState} setActiveEcoDb={setActiveEcoDb} setActiveStep={setActiveStep} setChecklistState={setChecklistState} />}

      {/* Embedded Reference Rules Footnote */}
      <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 text-[10px] text-slate-500 leading-normal flex items-start gap-1.5">
        <span className="text-shiraz font-bold block shrink-0 select-none">HINWEIS:</span>
        <span>
          Die dargestellten U-Werte und Ökobilanzindikatoren basieren auf vereinfachten Charakterisierungsfaktoren gemäß ÖKOBAUDAT-Referenzen 2023 und standardisierten Berechnungsverfahren der DIN EN ISO 6946 und DIN EN 15978 für Bauteilschichten. Sie dienen dem akademischen Verständnis bauphysikalischer und ökologischer Zusammenhänge und ersetzen keinen offiziellen bautechnischen Nachweis nach dem Gebäudemodernisierungsgesetz (GModG, vormals GEG/EnEV) oder QNG-Nachweis durch staatlich zugelassene Energieauditer.
        </span>
      </div>

      <ModuleFooter
        wikipedia={[
          { title: 'Passivhaus', url: 'https://de.wikipedia.org/wiki/Passivhaus' },
          { title: 'U-Wert', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmedurchgangskoeffizient' },
          { title: 'Graue Energie', url: 'https://de.wikipedia.org/wiki/Graue_Energie' },
          { title: 'Bauprodukte-Verordnung' },
          { title: 'European Green Deal', url: 'https://de.wikipedia.org/wiki/European_Green_Deal' },
          { title: 'Europäischer Emissionshandel', url: 'https://de.wikipedia.org/wiki/EU-Emissionshandel' },
          { title: 'CO2-Grenzausgleichssystem', url: 'https://de.wikipedia.org/wiki/CO2-Grenzausgleichssystem' },
          { title: 'Ersatzbaustoffverordnung', url: 'https://de.wikipedia.org/wiki/Ersatzbaustoffverordnung' },
          { title: 'Lehmbau', url: 'https://de.wikipedia.org/wiki/Lehmbau' }
        ]}
        literatur={[
          'Hegger, M. et al.: Baustoff-Atlas (Detail Verlag / Birkhäuser)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Nagler, F.; Auer, T.: Einfach Bauen – Forschungshäuser Bad Aibling (Detail Verlag)',
          'Fraunhofer IBP: Graue Emissionen im Gebäudesektor – Bilanzierungsregeln und Grenzwerte für Embodied Carbon (2024)',
          'JRC Science for Policy Report: Level(s) – Taking action on the total carbon footprint of buildings (European Commission)'
        ]}
        regelwerke={[
          { title: 'Revidierte BauPVO (VO EU 2024/3110 CPR – Grundanforderung 7 & DPP)', url: 'https://eur-lex.europa.eu/' },
          { title: 'EPBD IV (Richtlinie EU 2024/1275 – ZEB, Lebenszyklus-GWP & MEPS)', url: 'https://eur-lex.europa.eu/' },
          { title: 'ESPR (Ökodesign-Verordnung EU 2024/1781 – Digitaler Produktpass)', url: 'https://eur-lex.europa.eu/' },
          { title: 'CBAM (CO2-Grenzausgleichsmechanismus VO EU 2023/956 für Zement & Stahl)', url: 'https://eur-lex.europa.eu/' },
          { title: 'EU-Klimagesetz (VO EU 2021/1119 – 55 % bis 2030, Net-Zero 2050)', url: 'https://eur-lex.europa.eu/' },
          { title: 'EU-ETS I & II (Richtlinie EU 2023/958 & 2023/959)', url: 'https://eur-lex.europa.eu/' },
          { title: 'EU-Taxonomie-Verordnung (VO EU 2020/852 mit DNSH-Kriterien)', url: 'https://eur-lex.europa.eu/' },
          { title: 'Gebäudemodernisierungsgesetz (GModG, verkündet 28.07.2026; vormals GEG – 65-%-Vorgabe entfallen, Bio-Treppe)', url: 'https://www.gesetze-im-internet.de/geg/' },
          { title: 'Wärmeplanungsgesetz (WPG vom 20.12.2023)', url: 'https://www.gesetze-im-internet.de/wpg/' },
          { title: 'Bundes-Klimaschutzgesetz (KSG – Treibhausgasneutralität 2045)', url: 'https://www.gesetze-im-internet.de/ksg/' },
          { title: 'Ersatzbaustoffverordnung (EBV – Mineralische Sekundärbaustoffe)', url: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/' },
          { title: 'Qualitätssiegel Nachhaltiges Gebäude (QNG Kriterienkatalog)', url: 'https://www.qng.info/' },
          { title: 'DIN EN 15978 / DIN EN 15804 (Ökobilanzierung von Gebäuden & EPDs)' }
        ]}
        formeln={[
          {
            formel: 'U = \\frac{1}{R_{si} + \\sum_{i=1}^n \\frac{d_i}{\\lambda_i} + R_{se}} \\quad [\\text{W/(m}^2\\cdot\\text{K)}]',
            erklaerung: 'Berechnung des Wärmedurchgangskoeffizienten U für mehrschichtige Bauteile mit Wärmeübergangswiderständen Rsi und Rse.',
            quelle: 'DIN EN ISO 6946'
          },
          {
            formel: 'GWP_{\\text{tot}} = \\sum_{i=1}^n \\left( d_i \\cdot \\rho_i \\cdot gwp_{\\text{spec},i} \\right) \\quad [\\text{kg CO}_2\\text{-eq/m}^2]',
            erklaerung: 'Flächenbezogene Herstellungs-Treibhausgasemissionen der Bauteilschichten aus Schichtdicke di, Rohdichte ρi und EPD-Kennwert gwp.',
            quelle: 'DIN EN 15804 / QNG'
          },
          {
            formel: '\\text{GWP}_{\\text{life-cycle}} = \\frac{\\text{GWP}_{\\text{emb}} + \\sum_{t=1}^{50} \\text{GWP}_{\\text{use}}(t) + \\text{GWP}_{\\text{EoL}}}{A_{\\text{NFA}} \\cdot 50\\,\\text{a}} \\quad [\\text{kg CO}_2\\text{e/(m}^2\\cdot\\text{a})]',
            erklaerung: 'Lebenszyklus-GWP nach EPBD (EU 2024/1275) Art. 7 und Anhang III: Berechnung und Offenlegung für Neubauten ab 01.01.2028 (Nutzfläche > 1 000 m²) bzw. ab 01.01.2030 (alle Neubauten), Betrachtungszeitraum 50 Jahre.',
            quelle: 'EPBD (EU 2024/1275) / DIN EN 15978'
          },
          {
            formel: '\\text{CBAM-Abgabe} = M_{\\text{Import}} \\cdot \\text{GWP}_{\\text{spec}} \\cdot \\left( P_{\\text{ETS}} - P_{\\text{Herkunft}} \\right) \\quad [\\text{€}]',
            erklaerung: 'CO2-Grenzausgleichsabgabe für importierte emissionsintensive Baustoffe (Zement, Stahl, Aluminium) zur Vermeidung von Carbon Leakage.',
            quelle: 'VO (EU) 2023/956 (CBAM) Art. 21'
          },
          {
            formel: '\\text{GHG-Intensität} = \\frac{\\sum_{j} E_j \\cdot f_{\\text{CO2},j}}{\\text{NFA}} \\le \\text{Target}_{\\text{CRREM}}(t) \\quad [\\text{kg CO}_2\\text{e/(m}^2_{\\text{NFA}}\\cdot\\text{a})]',
            erklaerung: 'CRREM-Dekarbonisierungspfad: Zulässige flächenbezogene Treibhausgasemissionen des Gebäudebetriebs pro Jahr im 1,5°C-Pariser-Klimaziel bis zum Zielwert 0 im Jahr 2050.',
            quelle: 'CRREM v2 / EU-Taxonomie'
          },
          {
            formel: 'f_k = K \\cdot f_{\\text{st}}^{\\alpha} \\cdot f_m^{\\beta} \\quad [\\text{N/mm}^2]',
            erklaerung: 'Charakteristische Mauerwerksdruckfestigkeit nach DIN 18940 für tragendes Lehmsteinmauerwerk analog DIN EN 1996-1-1 (Eurocode 6).',
            quelle: 'DIN 18940:2023-06'
          }
        ]}
      />
    </div>
  );
}
