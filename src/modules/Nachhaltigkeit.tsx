import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
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
import { FormulaText } from '@/src/components/ui/FormulaText';
import { 
  Leaf, Factory, Truck, Recycle, ArrowRight, Activity, 
  Trash2, Plus, ArrowUp, ArrowDown, Settings, AlertTriangle, 
  CheckCircle, Zap, Building, Percent, Sparkles, ClipboardCheck,
  Share2, Globe, FileSpreadsheet, HelpCircle, ExternalLink,
  BookOpen, Compass, Layers, ShieldCheck,
  TrendingDown, TrendingUp, Sliders, Scale, FileText, CheckCircle2,
  Award, Landmark, HardHat, RefreshCw, AlertCircle, ArrowUpRight, Home
} from 'lucide-react';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { InlineMath, BlockMath } from 'react-katex';
import { RechtsrahmenKompendium } from '@/src/components/ui/RechtsrahmenKompendium';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Scientific EPD Material Database for dynamic compilation
interface MaterialData {
  name: string;
  category: string;
  density: number;          // kg/m³
  lambda: number;           // W/(m·K) - thermal conductivity
  gwp_fossil_a1a3: number;  // kg CO₂-eq pro kg material
  gwp_biogenic_a1a3: number;// kg CO₂-eq pro kg material
  gwp_c3c4: number;         // kg CO₂-eq pro kg material (End-of-Life release/processing)
  gwp_d: number;            // kg CO₂-eq pro kg material (Substitutionspotential)
  penrt: number;            // MJ pro kg material (nicht-erneuerbare Primärenergie)
  circularity_pct: number;  // Inherent recyclability or circularity score (0 - 100%)
}

const EPD_DATABASE: Record<string, MaterialData> = {
  concrete_cem1: {
    name: 'Normalbeton C25/30 (CEM I)',
    category: 'Mineralisch',
    density: 2400,
    lambda: 2.10,
    gwp_fossil_a1a3: 0.102,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.008,
    gwp_d: -0.010,
    penrt: 0.77,
    circularity_pct: 15
  },
  concrete_rc: {
    name: 'RC-Beton C25/30 (klinkerreduziert)',
    category: 'Mineralisch',
    density: 2350,
    lambda: 1.95,
    gwp_fossil_a1a3: 0.083,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.006,
    gwp_d: -0.015,
    penrt: 0.60,
    circularity_pct: 45
  },
  brick_unfilled: {
    name: 'Hochlochziegel (ungefüllt)',
    category: 'Mineralisch',
    density: 800,
    lambda: 0.45,
    gwp_fossil_a1a3: 0.275,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.012,
    gwp_d: -0.005,
    penrt: 3.12,
    circularity_pct: 25
  },
  brick_perlite: {
    name: 'Wärmedämmziegel (Perlite-gefüllt)',
    category: 'Mineralisch',
    density: 680,
    lambda: 0.07,
    gwp_fossil_a1a3: 0.426,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.018,
    gwp_d: -0.008,
    penrt: 4.55,
    circularity_pct: 15
  },
  bsh_softwood: {
    name: 'Brettschichtholz (BSH, Fichte)',
    category: 'Holz',
    density: 480,
    lambda: 0.13,
    gwp_fossil_a1a3: 0.229,
    gwp_biogenic_a1a3: -1.583, // active carbon pool sequestering CO2
    gwp_c3c4: 1.583,            // fully released at waste-to-energy plant
    gwp_d: -0.65,               // substitute-credit for fuel heating displacement
    penrt: 6.45,
    circularity_pct: 85
  },
  wood_fiber: {
    name: 'Holzfaserdämmung (WF)',
    category: 'Dämmung',
    density: 160,
    lambda: 0.045,
    gwp_fossil_a1a3: 0.531,
    gwp_biogenic_a1a3: -1.50,
    gwp_c3c4: 1.50,
    gwp_d: -0.55,
    penrt: 10.0,
    circularity_pct: 90
  },
  mineral_wool: {
    name: 'Glaswolle-Dämmplatte',
    category: 'Dämmung',
    density: 50,
    lambda: 0.035,
    gwp_fossil_a1a3: 0.96,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.04,
    gwp_d: -0.05,
    penrt: 25.0,
    circularity_pct: 35
  },
  eps_styropor: {
    name: 'EPS-Hartschaumplatte (Styropor)',
    category: 'Dämmung',
    density: 20,
    lambda: 0.040,
    gwp_fossil_a1a3: 3.25,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 3.20,
    gwp_d: -1.20,
    penrt: 92.5,
    circularity_pct: 10
  },
  plaster_mineral: {
    name: 'Kalk-Gipsputz / Leichtputz',
    category: 'Mineralisch',
    density: 1200,
    lambda: 0.70,
    gwp_fossil_a1a3: 0.15,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.005,
    gwp_d: 0.0,
    penrt: 1.22,
    circularity_pct: 30
  },
  gypsum_board: {
    name: 'Gipsfaserplatte',
    category: 'Mineralisch',
    density: 1150,
    lambda: 0.32,
    gwp_fossil_a1a3: 0.30,
    gwp_biogenic_a1a3: -0.05,
    gwp_c3c4: 0.05,
    gwp_d: -0.02,
    penrt: 3.48,
    circularity_pct: 45
  },
  osb_board: {
    name: 'OSB-Platte',
    category: 'Holz',
    density: 620,
    lambda: 0.13,
    gwp_fossil_a1a3: 0.32,
    gwp_biogenic_a1a3: -1.30,
    gwp_c3c4: 1.30,
    gwp_d: -0.45,
    penrt: 8.5,
    circularity_pct: 75
  },
  straw_bale: {
    name: 'Strohdämmung (Strohballen)',
    category: 'Dämmung',
    density: 100,
    lambda: 0.045,
    gwp_fossil_a1a3: 0.035,
    gwp_biogenic_a1a3: -1.45,
    gwp_c3c4: 1.45,
    gwp_d: -0.40,
    penrt: 0.55,
    circularity_pct: 95
  },
  clay_plaster: {
    name: 'Lehm-Feinputz / Lehmputz',
    category: 'Mineralisch',
    density: 1600,
    lambda: 0.82,
    gwp_fossil_a1a3: 0.015,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.002,
    gwp_d: 0.0,
    penrt: 0.18,
    circularity_pct: 100
  },
  clay_brick_din18940: {
    name: 'Lehmstein DIN 18940 (SFK 3, tragend)',
    category: 'Mineralisch',
    density: 1800,
    lambda: 0.90,
    gwp_fossil_a1a3: 0.022,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.002,
    gwp_d: 0.0,
    penrt: 0.28,
    circularity_pct: 100
  },
  baustahl: {
    name: 'Baustahl (Elektrookoroute - 100% RC)',
    category: 'Metalle',
    density: 7850,
    lambda: 50.0,
    gwp_fossil_a1a3: 0.48,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.02,
    gwp_d: -0.32,
    penrt: 4.8,
    circularity_pct: 95
  }
};

interface ConfiguredLayer {
  materialKey: string;
  thicknessCm: number; // thickness in centimeters
}

const PRESET_WALLS: Record<string, { name: string; desc: string; layers: ConfiguredLayer[] }> = {
  massiv_wdvs: {
    name: 'Stahlbeton + EPS (WDVS)',
    desc: 'Konventionelle mineralische Tragschale (20cm) mit marktüblichem organischen Wärmedämmverbundsystem.',
    layers: [
      { materialKey: 'plaster_mineral', thicknessCm: 1.5 },
      { materialKey: 'concrete_cem1', thicknessCm: 20.0 },
      { materialKey: 'eps_styropor', thicknessCm: 16.0 },
      { materialKey: 'plaster_mineral', thicknessCm: 1.5 }
    ]
  },
  massiv_eco: {
    name: 'RC-Beton + Holzfaser',
    desc: 'Klinkerreduzierte mineralische Tragschale (20cm) gedämmt mit nachwachsender Holzfaser-Dämmplatte.',
    layers: [
      { materialKey: 'plaster_mineral', thicknessCm: 1.5 },
      { materialKey: 'concrete_rc', thicknessCm: 20.0 },
      { materialKey: 'wood_fiber', thicknessCm: 16.0 },
      { materialKey: 'plaster_mineral', thicknessCm: 1.5 }
    ]
  },
  holz_staender: {
    name: 'Holzrahmenbau (Passivhaus)',
    desc: 'Hocheffiziente, kreislauffähige Leichtbaukonstruktion mit exzellenter Dämmwirkung und biogenem Kohlenstoffspeicher.',
    layers: [
      { materialKey: 'gypsum_board', thicknessCm: 1.25 },
      { materialKey: 'osb_board', thicknessCm: 1.5 },
      { materialKey: 'bsh_softwood', thicknessCm: 24.0 }, // also serves as framing
      { materialKey: 'wood_fiber', thicknessCm: 8.0 },
      { materialKey: 'plaster_mineral', thicknessCm: 1.5 }
    ]
  },
  ziegel_mono: {
    name: 'Monolithischer perlite-gefüllter Ziegel',
    desc: 'Tragendes einschaliges Ziegelmauerwerk ohne Zusatzdämmung, sehr robust und langlebig.',
    layers: [
      { materialKey: 'plaster_mineral', thicknessCm: 1.5 },
      { materialKey: 'brick_perlite', thicknessCm: 36.5 },
      { materialKey: 'plaster_mineral', thicknessCm: 2.0 }
    ]
  },
  lehm_massiv_18940: {
    name: 'Tragender Lehmbau (DIN 18940)',
    desc: 'Schlanke 17,5 cm Lehmsteinwand (SFK 3) mit Holzfaserdämmung und Lehmputz – 100 % zirkulär.',
    layers: [
      { materialKey: 'clay_plaster', thicknessCm: 1.5 },
      { materialKey: 'clay_brick_din18940', thicknessCm: 17.5 },
      { materialKey: 'wood_fiber', thicknessCm: 16.0 },
      { materialKey: 'clay_plaster', thicknessCm: 2.0 }
    ]
  },
  naturbaustoff_stroh: {
    name: 'Naturbaustoff Stroh & Lehm',
    desc: 'Holzrahmenkonstruktion ausgefacht mit hochdämmenden Strohballen, innen und außen geschützt durch dicken Lehmputz.',
    layers: [
      { materialKey: 'clay_plaster', thicknessCm: 3.0 },
      { materialKey: 'osb_board', thicknessCm: 1.5 },
      { materialKey: 'straw_bale', thicknessCm: 32.0 },
      { materialKey: 'osb_board', thicknessCm: 1.5 },
      { materialKey: 'clay_plaster', thicknessCm: 1.5 }
    ]
  }
};

export default function Nachhaltigkeit() {
  const [activeWorkspace, setActiveWorkspace] = useState<'wandkonfigurator' | 'qng_nachweis' | 'crrem_regulatorik' | 'praxis_innovationen' | 'leitfaden'>('wandkonfigurator');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeEcoDb, setActiveEcoDb] = useState<'oekobaudat' | 'dgnb' | 'ibu' | 'wecobis'>('oekobaudat');
  const [regulatorikSubTab, setRegulatorikSubTab] = useState<'rechtsrahmen' | 'crrem_sim'>('rechtsrahmen');

  // CRREM Simulator States
  const [crremBuildingType, setCrremBuildingType] = useState<'office' | 'residential'>('office');
  const [crremCurrentGwp, setCrremCurrentGwp] = useState<number>(45); // kg CO2e/(m²·a)
  const [crremCurrentEnergy, setCrremCurrentEnergy] = useState<number>(135); // kWh/(m²·a)
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
        label: 'Passivhaus-Standard (KfW 40)',
        color: 'bg-slate-100 text-slate-800 border-slate-300',
        rating: 'Exzellent'
      };
    }
    if (uVal <= 0.24) {
      return {
        label: 'GEG-Sanierungsanforderung',
        color: 'bg-slate-50 text-slate-700 border-slate-200',
        rating: 'Konform'
      };
    }
    return {
      label: 'Mangelnde Dämmwirkung (Nicht GEG-konform für Neubauten)',
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
            <button
              onClick={() => setActiveWorkspace('wandkonfigurator')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                activeWorkspace === 'wandkonfigurator'
                  ? 'bg-shiraz text-white border-shiraz shadow-md'
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
              }`}
            >
              1. Wandaufbau
            </button>
            <button
              onClick={() => setActiveWorkspace('qng_nachweis')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                activeWorkspace === 'qng_nachweis'
                  ? 'bg-shiraz text-white border-shiraz shadow-md'
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
              }`}
            >
              2. QNG-Nachweis
            </button>
            <button
              onClick={() => setActiveWorkspace('crrem_regulatorik')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                activeWorkspace === 'crrem_regulatorik'
                  ? 'bg-shiraz text-white border-shiraz shadow-md'
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
              }`}
            >
              3. CRREM &amp; Regulatorik
            </button>
            <button
              onClick={() => setActiveWorkspace('praxis_innovationen')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                activeWorkspace === 'praxis_innovationen'
                  ? 'bg-shiraz text-white border-shiraz shadow-md'
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
              }`}
            >
              4. Praxis &amp; Gebäudetyp E
            </button>
            <button
              onClick={() => setActiveWorkspace('leitfaden')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                activeWorkspace === 'leitfaden'
                  ? 'bg-shiraz text-white border-shiraz shadow-md'
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
              }`}
            >
              5. EPD- &amp; QNG-Leitfaden
            </button>
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
      {activeWorkspace === 'wandkonfigurator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          
          {/* Editor & presets card (7-cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            
            {/* Presets block */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-3">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                <Sparkles size={11} className="text-shiraz" />
                Vorkonfigurierte Wand-Presets laden
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {Object.entries(PRESET_WALLS).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    className="p-2 border border-home-grau/30 rounded-lg text-left hover:border-shiraz/50 hover:bg-shiraz/5 transition-all flex flex-col gap-1"
                  >
                    <strong className="text-[11px] text-slate-900 leading-tight font-bold">{item.name}</strong>
                    <span className="text-[9px] text-slate-400 line-clamp-2 leading-normal">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Callout: Massebezug vs. Bauteilbezug */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
              <div className="text-xs text-amber-950 leading-relaxed">
                <strong className="font-bold text-amber-900 block mb-0.5">
                  Falle der Ökobilanzierung: Massebezug (kg CO₂e/kg) vs. Bauteilbezug (kg CO₂e/m²)
                </strong>
                <p>
                  In EPDs werden Materialwerte häufig auf 1 kg Masse bezogen. Hier wirkt Normalbeton (CEM I) mit ca. <strong>0,10 kg CO₂e/kg</strong> scheinbar harmlos. 
                  Aufgrund der hohen Rohdichte (2.400 kg/m³) wiegt jedoch eine 20 cm Betonwand 480 kg/m² und verursacht ca. <strong>49 kg CO₂e/m²</strong>! 
                  Konstruktionsvollholz (KVH) speichert hingegen biogenes CO₂ (-1,47 kg CO₂e/kg), und ein Lehmstein (DIN 18940) benötigt überhaupt keine klinkerspezifische Brennenergie (nur 0,022 kg CO₂e/kg). 
                  <strong> Grundsatz:</strong> Bauteile müssen immer auf die funktionelle Einheit (1 m² Bauteil mit gefordertem U-Wert und Tragfähigkeit) bezogen verglichen werden.
                </p>
              </div>
            </div>

            {/* Configurator Layer Board */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-home-grau/30 pb-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Settings size={16} className="text-shiraz" />
                  Schichtenaufbau konfigurieren (von Innen nach Außen)
                </h3>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                  Layers: {wallLayers.length}
                </span>
              </div>

              {/* Joint Connection - Design for Deconstruction */}
              <div className="bg-slate-50 p-4 border border-home-grau/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Design for Deconstruction
                    </span>
                    <span className="text-[9px] text-shiraz font-mono font-bold">Lerneffekt</span>
                  </div>
                  <label className="block text-xs font-bold text-slate-800 mt-1.5 leading-tight">
                    Fügungsmethode der Wandschichten
                  </label>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                    Nassputze und vollflächige Verklebungen verhindern sortenreine Trennung (Zirkularitäts-Abzug). Mechanisch gefügtes Trockenbauen maximiert die Recycelbarkeit.
                  </p>
                </div>
                <div className="w-full md:w-56 shrink-0">
                  <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-lg text-center text-xs">
                    <button
                      onClick={() => setConnectionType('glued')}
                      className={`py-1.5 rounded-md cursor-pointer transition-all font-semibold ${
                        connectionType === 'glued'
                          ? 'bg-shiraz text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🔗 Verklebt / Mörtel
                    </button>
                    <button
                      onClick={() => setConnectionType('screwed')}
                      className={`py-1.5 rounded-md cursor-pointer transition-all font-semibold ${
                        connectionType === 'screwed'
                          ? 'bg-shiraz text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🔩 Geschraubt (Trocken)
                    </button>
                  </div>
                </div>
              </div>

              {/* Layer list tables */}
              <div className="space-y-3">
                {computedWall.layers.map((layer, index) => (
                  <div 
                    key={index}
                    className="bg-slate-50 border border-home-grau/30 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-home-grau/30"
                  >
                    {/* Material Identity & sorting buttons */}
                    <div className="flex items-center gap-2.5">
                      <div className="flex flex-col gap-0.5 shrink-0 select-none">
                        <button 
                          disabled={index === 0}
                          onClick={() => moveLayer(index, 'up')}
                          className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-30 text-slate-500"
                          title="Nach links / innen schieben"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button 
                          disabled={index === wallLayers.length - 1}
                          onClick={() => moveLayer(index, 'down')}
                          className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-30 text-slate-500"
                          title="Nach rechts / außen schieben"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                      
                      <div>
                        <strong className="text-xs text-slate-900 font-bold block leading-snug">{layer.mat.name}</strong>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold">
                          {layer.mat.category} &bull; λ = {formatDeZahl(layer.mat.lambda, 3)} W/mK
                        </span>
                      </div>
                    </div>

                    {/* Thickness slider controls */}
                    <div className="flex items-center gap-4 flex-1 max-w-xs md:justify-end">
                      <div className="flex flex-col w-full">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-0.5 px-0.5">
                          <span>Dicke:</span>
                          <span className="font-mono font-bold text-shiraz">{formatDeWert(layer.thicknessCm)} cm</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="40"
                          step="0.5"
                          value={layer.thicknessCm}
                          onChange={(e) => handleThicknessChange(index, parseFloat(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                        />
                      </div>

                      {/* Delete item */}
                      <button
                        onClick={() => removeLayer(index)}
                        disabled={wallLayers.length <= 1}
                        className="text-stone-400 hover:text-red-600 disabled:opacity-35 p-1.5 rounded-lg hover:bg-slate-100 transition-colors self-end md:self-auto shrink-0"
                        title="Schicht löschen"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Layer Controller */}
              <div className="mt-4 pt-4 border-t border-home-grau/30 flex flex-col md:flex-row items-end gap-3 bg-slate-50/50 p-4 rounded-xl border border-home-grau/30">
                <div className="w-full md:flex-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-900 mb-1 tracking-wider">Werkstoff auswählen</label>
                  <select
                    value={selectedAddMaterial}
                    onChange={(e) => setSelectedAddMaterial(e.target.value)}
                    className="w-full p-2 border border-home-grau/30 rounded-lg text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-shiraz"
                  >
                    {Object.entries(EPD_DATABASE).map(([key, mat]) => (
                      <option key={key} value={key}>{mat.name} ({mat.category})</option>
                    ))}
                  </select>
                </div>

                <div className="w-24 shrink-0">
                  <label className="block text-[10px] uppercase font-bold text-slate-900 mb-1 tracking-wider">Stärke (cm)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={addThickness}
                    onChange={(e) => setAddThickness(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full p-1.5 border border-home-grau/30 rounded-lg text-xs text-center bg-white font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-shiraz"
                  />
                </div>

                <button
                  onClick={addLayer}
                  className="bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shrink-0 transition-all select-none w-full md:w-auto justify-center"
                >
                  <Plus size={14} /> Schicht hinzufügen
                </button>
              </div>

            </div>
          </div>

          {/* Calculations Fact Sheet & chart display (5-cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            
            {/* Physics outputs card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b border-home-grau/30 pb-1">
                Bauphysikalische Kennwerte
              </h3>
              
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Gesamtstärke</span>
                  <strong className="text-sm font-mono font-bold text-slate-900 mt-0.5 block">{formatDeZahl(computedWall.thicknessCm, 1)} cm</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Flächengewicht</span>
                  <strong className="text-sm font-mono font-bold text-slate-900 mt-0.5 block">~ {formatDeWert(Math.round(computedWall.totalWeightKg))} kg/m²</strong>
                </div>
              </div>

              {/* Thermal conductivity indicator */}
              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col items-center">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Berechneter U-Wert</span>
                <strong className="text-2xl font-mono text-shiraz font-bold">{formatDeZahl(computedWall.uValue, 3)} W/m²K</strong>
                
                {/* GEG limits validation badge */}
                <div className={`mt-2.5 px-3 py-1 text-[10px] font-bold border rounded-full text-center ${gegRating.color}`}>
                  Rating: <strong>{gegRating.rating}</strong> &bull; {gegRating.label}
                </div>
              </div>

              {/* Circular Economy Matrix */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-[10px] text-slate-800 uppercase font-bold tracking-wider flex items-center gap-1.5 font-sans">
                    <Recycle size={13} className="text-shiraz" />
                    Zirkularitäts-Index (MCI)
                  </span>
                  <span className="text-[10px] bg-shiraz/10 text-shiraz border border-shiraz/20 px-1.5 py-0.5 rounded font-bold font-mono">
                    {formatDeWert(Math.round(computedWall.effectiveCircularity))} / 100
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        computedWall.effectiveCircularity >= 60 ? 'bg-emerald-600' :
                        computedWall.effectiveCircularity >= 30 ? 'bg-amber-600' : 'bg-shiraz'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, computedWall.effectiveCircularity))}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block font-normal">Material-Zyklus (Inhärent):</span>
                      <strong className="text-slate-800 font-bold font-mono mt-0.5 block">{formatDeWert(Math.round(computedWall.inherentCircularity))}%</strong>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block font-normal">Trennungs-Weiche (Fügung):</span>
                      <strong className="text-slate-800 font-bold font-mono mt-0.5 block">{formatDeWert(Math.round(computedWall.jointSeparabilityFactor * 100))}%</strong>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-600 leading-normal">
                    {computedWall.effectiveCircularity >= 70 ? (
                      <span className="text-slate-800 font-medium">✓ Exzellentes Design! Erleichtert das Cradle-to-Cradle Kreislaufverfahren vollends.</span>
                    ) : computedWall.effectiveCircularity >= 40 ? (
                      <span className="text-slate-600 font-medium font-normal">⚠ Teilweise kreislauffähig. Verbessern Sie die Fügung auf "Geschraubt" oder nutzen Sie naturnah rückbaubare Rohstoffe.</span>
                    ) : (
                      <span className="text-shiraz font-medium font-normal">❌ Hohes Downcycling- oder Deponierisiko! Inseparable Verklebungen sabotieren künftige Erdnischen oder Recyclingkörper.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Footprint visualization card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <div className="flex justify-between items-baseline border-b border-home-grau/30 pb-1">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  Ökobilanzierung (Netto)
                </h3>
                <span className="text-xs text-slate-400 font-mono">1 m² Wandfläche</span>
              </div>

              <div className="h-56 relative w-full pt-1">
                <Bar data={chartData} options={chartOptions as any} />
              </div>

              {/* Dynamic explanations */}
              <div className="bg-slate-50 text-slate-800 p-3.5 rounded-xl border border-slate-200 text-[11px] leading-relaxed">
                <strong className="text-xs text-slate-900 block font-bold mb-1 flex items-center gap-1.5 uppercase">
                  <Percent size={13} className="text-shiraz" /> GWP-Biogenic Nachweisbericht
                </strong>
                Mit diesem Schichtenaufbau binden die nachwachsenden Anteile rechnerisch{' '}
                <span className="font-bold text-slate-900">{formatDeZahl(computedWall.gwpBiogenicA1A3, 1)} kg CO₂-eq/m²</span> biogenen Kohlenstoff in der Herstellungsphase. 
                Die herstellungsbedingten fossilen Emissionen belaufen sich auf{' '}
                <span className="font-bold text-shiraz">+{formatDeZahl(computedWall.gwpFossilA1A3, 1)} kg CO₂-eq</span>. 
                Die Netto-LCA über 50 Jahre schließt die Entsorgungsemissionen und Recyclinggutschriften außerhalb der Systemgrenze voll ein.
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Workspace 2: QNG-Nachweis Simulator */}
      {activeWorkspace === 'qng_nachweis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          
          {/* Editor control column (7-cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
              
              <div className="border-b border-home-grau/30 pb-2">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Gebäudekonfiguration &amp; Primärenergetik</h3>
                <p className="text-xs text-slate-400 mt-0.5">Stellen Sie Bausubstanz und Betriebsenergie ein, um die QNG-Jahresbilanz zu berechnen.</p>
              </div>

              <div className="space-y-4">
                
                {/* BGF Slider */}
                <div>
                  <div className="flex justify-between text-xs text-slate-900 font-bold mb-1.5">
                    <span>Bruttogrundfläche (BGF):</span>
                    <span className="font-mono text-shiraz">{formatDeWert(bgf)} m²</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1500"
                    step="20"
                    value={bgf}
                    onChange={(e) => setBgf(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 mt-1 uppercase tracking-wider font-mono">
                    <span>Einfamilienhaus (150 m²)</span>
                    <span>Mehrfamilienhaus (&gt; 800 m²)</span>
                  </div>
                </div>

                {/* Construction materials selection block */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2">Hauptsächliche Bauweise (Tragwerk &amp; Decken):</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'holzbau', name: 'Holzrahmen- & Massivholzbau', r_coef: 'Niedrige graue Energie' },
                      { id: 'hybrid', name: 'Holz-Beton-Hybridbau', r_coef: 'Ausgewogene graue Energie' },
                      { id: 'massiv', name: 'Klassischer Massivbau (Mauerwerk/Beton)', r_coef: 'Hohe graue Energie' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setConstructionType(item.id as any)}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          constructionType === item.id
                            ? 'border-shiraz bg-shiraz/5 shadow-sm font-bold'
                            : 'border-home-grau/30 bg-white hover:border-home-grau/30'
                        }`}
                      >
                        <span className="text-xs text-slate-900 block font-bold leading-tight">{item.name}</span>
                        <span className="text-[9px] text-slate-400 leading-normal">{item.r_coef}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Heating systems */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2">Energieträger / Primär-Heizungssystem:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: 'waermepumpe', name: 'Zentrale Luft-Wasser-Wärmepumpe', details: 'Hocheffizienter Stromprozess' },
                      { id: 'fernwaerme', name: 'Fern- / Nahwärmenetz mit Kraft-Wärme-Kopplung', details: 'Fernwärme fossiler/regenerativer Mix' },
                      { id: 'biomasse', name: 'Pelletkessel / Holzbiomasse', details: 'CO2-neutraler Holzbrennstoff' },
                      { id: 'gasherdfossil', name: 'Fossil-Brennwertkessel (Erdgas)', details: 'Zukunftskritische fossile Verbrennung' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setHeatingSystem(item.id)}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          heatingSystem === item.id
                            ? 'border-shiraz bg-shiraz/5 shadow-sm font-bold'
                            : 'border-home-grau/30 bg-white hover:border-home-grau/30'
                        }`}
                      >
                        <span className="text-xs text-slate-900 block font-bold leading-tight">{item.name}</span>
                        <span className="text-[9px] text-slate-400 leading-normal">{item.details}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tariffs and PV */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  
                  {/* Green Tariff Switch */}
                  <div className="bg-slate-50 p-4 border border-home-grau/30 rounded-xl flex items-center justify-between">
                    <div>
                      <strong className="text-xs text-slate-900 block">Ökostromvertrag (Zertifiziert)</strong>
                      <span className="text-[10px] text-slate-400">Senkt den Emissionsfaktor der Wärmepumpenschleife.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={greenTariff}
                        onChange={(e) => setGreenTariff(e.target.checked)}
                        disabled={heatingSystem !== 'waermepumpe'}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600 peer-disabled:bg-slate-100 peer-disabled:after:bg-stone-300"></div>
                    </label>
                  </div>

                  {/* PV sizing slider */}
                  <div className="bg-slate-50 p-3.5 border border-home-grau/30 rounded-xl">
                    <div className="flex justify-between text-xs text-slate-900 font-bold mb-1">
                      <span>Photovoltaikanlage:</span>
                      <span className="font-mono text-emerald-700 font-bold">{formatDeWert(pvSizeKwp)} kWp</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="2"
                      value={pvSizeKwp}
                      onChange={(e) => setPvSizeKwp(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <span className="text-[9px] text-slate-400 block mt-0.5">Erzeugt Strom für Eigenverbrauch &amp; Netzeinspeisung.</span>
                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* QNG Certificate Gauge Display (5-cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5 animate-in fade-in duration-300">
            
            {/* Main result badge */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col items-center justify-center text-center gap-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block font-bold">
                PROGNOSTIZIERTE JAHRESBILANZ
              </span>
              
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">Nachweis-GWP</span>
                <strong className="text-4xl font-mono text-shiraz font-black mt-1">
                  {formatDeZahl(qngComputation.totalYearlyGwp, 1)}
                </strong>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  kg CO₂-eq / m² NRF / Jahr
                </span>
              </div>

              {/* Status block showing certificate limits */}
              <div className={`w-full p-4 rounded-xl border text-center ${qngComputation.ratingColor}`}>
                <strong className="text-xs font-bold block uppercase tracking-wide leading-none">{qngComputation.label}</strong>
              </div>

              {/* Gauge Limits explanation */}
              <div className="w-full text-xs space-y-2 mt-2 leading-relaxed font-normal text-slate-500">
                <div className="flex justify-between items-center text-[11px] border-b border-stone-100 pb-1.5">
                  <span className="font-bold">QNG-Premium Grenzwert:</span>
                  <span className="font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">≤ 20,0</span>
                </div>
                <div className="flex justify-between items-center text-[11px] border-b border-stone-100 pb-1.5">
                  <span className="font-bold">QNG-Plus Grenzwert:</span>
                  <span className="font-mono bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-bold">≤ 24,0</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>Projektlaufzeit Referenzwert:</span>
                  <span>50 Jahre</span>
                </div>
              </div>

            </div>

            {/* Strategic Consultation Advice box */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-home-grau/30 pb-1 flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                Nachweis-Optimierungsempfehlungen
              </h4>

              <div className="space-y-3 text-xs leading-relaxed font-normal text-slate-700">
                
                {qngComputation.status === 'failed' && (
                  <div className="flex gap-2.5 items-start bg-red-50 text-red-950 p-3 rounded-lg border border-red-150">
                    <span className="text-red-600 block text-lg leading-none shrink-0 font-bold">&#10007;</span>
                    <div>
                      <strong className="block text-[11px] font-bold">Fossile Energie blockiert das Siegel:</strong>
                      Der Erdgaskessel erzeugt extreme Verbrennungsfrachten von ca. 28 kg CO₂/(m² NRF · a). 
                      Das QNG-Siegel ist so unmöglich zu erreichen. 
                      <span className="font-bold block mt-1 underline">Lösung: Installiere eine Wärmepumpe.</span>
                    </div>
                  </div>
                )}

                {constructionType === 'massiv' && (
                  <div className="flex gap-2.5 items-start bg-white text-slate-850 p-3 rounded-lg border border-slate-200">
                    <span className="text-amber-600 block text-lg leading-none shrink-0 font-bold">&#9888;</span>
                    <div>
                      <strong className="block text-[11px] font-bold">Graue Energie des Massivbaus senken:</strong>
                      Decken und Pfahlgründungen aus Standardbeton binden Enormen Zement-Footprint. 
                      <span className="block mt-1">Lösung: Ersetze klassischen Beton durch Öko- oder RC-Beton bzw. wandle tragende Wände in Holzständerbauweisen um, um Negativgutschriften zu erwirtschaften.</span>
                    </div>
                  </div>
                )}

                {pvSizeKwp < 10 && (
                  <div className="flex gap-2.5 items-start bg-indigo-50 text-indigo-950 p-3 rounded-lg border border-indigo-150 animate-in fade-in">
                    <span className="text-indigo-600 block text-lg leading-none shrink-0 font-bold">&#10137;</span>
                    <div>
                      <strong className="block text-[11px] font-bold">PV-Potenziale ausschöpfen:</strong>
                      Die Photovoltaikanlage speist wertvollen Grünstrom ins Netz und verringert die eigene rechnerische Deckungslücke der QNG-Zertifizierung.
                      <span className="font-bold block mt-1">Lösung: PV-Leistung auf mindestens 12 kWp auslegen.</span>
                    </div>
                  </div>
                )}

                {qngComputation.status === 'premium' && (
                  <div className="flex gap-2.5 items-start bg-emerald-50 text-emerald-950 p-3 rounded-lg border border-emerald-150 animate-in shrink-0">
                    <CheckCircle size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px] font-bold text-emerald-900">Ausgezeichnete KfW 40 QNG-Förderfähigkeit:</strong>
                      Ihr Entwurf erzielt mit {formatDeZahl(qngComputation.totalYearlyGwp, 1)} kg CO₂-eq locker die Premium-Stufe. 
                      Sie erfüllen alle Anforderungen des BMWSB zur Beantragung zinsgünstiger Kredite.
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      )}

      {/* Workspace 3: CRREM & Regulatorik (EPBD, BauPVO, ESPR, CBAM, ETS, CSRD...) */}
      {activeWorkspace === 'crrem_regulatorik' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          
          {/* Sub-Navigation: Rechtsrahmen-Kompendium vs. CRREM Simulator */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest">Regulatorik-Schwerpunkt</span>
              <span className="text-sm font-extrabold text-text-main">Wählen Sie Analysebereich &amp; Werkzeug</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setRegulatorikSubTab('rechtsrahmen')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border cursor-pointer ${
                  regulatorikSubTab === 'rechtsrahmen'
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'
                }`}
              >
                <Scale size={16} /> 1. Rechtsrahmen-Kompendium &amp; Hierarchie
              </button>
              <button
                onClick={() => setRegulatorikSubTab('crrem_sim')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border cursor-pointer ${
                  regulatorikSubTab === 'crrem_sim'
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'
                }`}
              >
                <TrendingDown size={16} /> 2. CRREM-Dekarbonisierungssimulator
              </button>
            </div>
          </div>

          {/* SubTab 1: Hierarchisches Rechtsrahmen-Kompendium */}
          {regulatorikSubTab === 'rechtsrahmen' && (
            <RechtsrahmenKompendium />
          )}

          {/* SubTab 2: Interaktiver CRREM Simulator */}
          {regulatorikSubTab === 'crrem_sim' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              
              {/* Header Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-shiraz/10 border border-shiraz/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-shiraz self-start">
                  <TrendingDown size={12} className="text-shiraz" />
                  CRREM v2 &bull; Paris 1,5&deg;C &bull; EU-Taxonomie
                </span>
                <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Scale className="text-shiraz" size={24} /> CRREM-Dekarbonisierungspfad &amp; Stranded Assets
                </h2>
                <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
                  <p>
                    Simulieren Sie das Stranding-Risiko von Immobilienbeständen nach der globalen CRREM-Methodik (Carbon Risk Real Estate Monitor). Erkennen Sie das Misalignment Year, bewerten Sie den drohenden &bdquo;Brown Discount&ldquo; und prüfen Sie die neuen regulatorischen Vorgaben der EPBD (EU 2024/1275) und der Ersatzbaustoffverordnung (EBV).
                  </p>
                </div>
              </div>

          {/* Interactive CRREM Simulator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Inputs (7-cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
              <div className="border-b border-home-grau/25 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Sliders size={16} className="text-shiraz" />
                    Gebäudeparameter &amp; Sanierungsszenarien
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Wählen Sie Gebäudetyp, Ausgangs-Emissionsintensität und Dekarbonisierungshebel.</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                  Standort: Deutschland
                </span>
              </div>

              {/* Building Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2">Immobilien-Assetklasse:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCrremBuildingType('office')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      crremBuildingType === 'office'
                        ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold shadow-xs'
                        : 'border-home-grau/30 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Building size={16} className="mb-1" />
                    <strong className="block text-xs">Büroimmobilie (Commercial Office)</strong>
                    <span className="text-[10px] text-slate-400 font-normal">CRREM-Basispfad: 52 kg CO₂e (2020) &rarr; 18 kg (2030) &rarr; 0 kg (2050)</span>
                  </button>
                  <button
                    onClick={() => setCrremBuildingType('residential')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      crremBuildingType === 'residential'
                        ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold shadow-xs'
                        : 'border-home-grau/30 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Home size={16} className="mb-1" />
                    <strong className="block text-xs">Wohngebäude (Multi-Family Residential)</strong>
                    <span className="text-[10px] text-slate-400 font-normal">CRREM-Basispfad: 35 kg CO₂e (2020) &rarr; 15 kg (2030) &rarr; 0 kg (2050)</span>
                  </button>
                </div>
              </div>

              {/* Slider Current GWP Intensity */}
              <div>
                <div className="flex justify-between text-xs text-slate-900 font-bold mb-1.5">
                  <span>Aktuelle CO₂-Intensität des Betriebs (Ist-Zustand 2026):</span>
                  <span className="font-mono text-shiraz text-sm">{formatDeWert(crremCurrentGwp)} kg CO₂e / (m²_NFA &middot; a)</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="90"
                  step="1"
                  value={crremCurrentGwp}
                  onChange={(e) => setCrremCurrentGwp(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>Neubau / KfW 40 (ca. 10–15 kg)</span>
                  <span>Teilsaniert (ca. 35–50 kg)</span>
                  <span>Ungedämmter Altbau (&gt; 70 kg)</span>
                </div>
              </div>

              {/* Retrofit Lever Intervention Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2">Dekarbonisierungshebel (Intervention):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'none', label: 'Keine Maßnahme (Status Quo)', desc: 'Ist-Zustand wird fortgeschrieben', icon: AlertCircle },
                    { id: 'opex', label: 'Opex: Betriebsoptimierung (-15 %)', desc: 'Smart Metering, thermischer Abgleich, Nachtabsenkung', icon: Sliders },
                    { id: 'capex_huelle', label: 'Capex Hülle: Sanierung (-35 %)', desc: 'Fassadendämmung (WDVS/Holzfaser) + 3-fach-Verglasung', icon: Layers },
                    { id: 'capex_deep', label: 'Deep Capex: Hülle + WP + PV (-75 %)', desc: 'Komplette energetische Transformation (Ausstieg aus Gas/Öl)', icon: Zap }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCrremRetrofit(item.id as any)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        crremRetrofit === item.id
                          ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold shadow-xs'
                          : 'border-home-grau/30 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <item.icon size={16} className={`shrink-0 mt-0.5 ${crremRetrofit === item.id ? 'text-shiraz' : 'text-slate-400'}`} />
                      <div>
                        <strong className="block text-xs leading-tight">{item.label}</strong>
                        <span className="text-[10px] text-slate-500 font-normal leading-normal">{item.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status & Stranding Calculation Outcome */}
              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Ergebnis der CRREM-Konformitätsprüfung</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-700">Effektive CO₂-Intensität nach Intervention:</span>
                  <strong className="text-base font-mono text-slate-900 font-extrabold">
                    {formatDeZahl(crremResult.effectiveGwp, 1)} kg CO₂e / (m² &middot; a)
                  </strong>
                </div>
                <div className="flex items-baseline justify-between text-xs text-slate-600">
                  <span>Zulässiger CRREM-Zielwert im Jahr 2026:</span>
                  <span className="font-mono font-bold text-slate-800">{formatDeZahl(crremResult.target2026, 1)} kg CO₂e</span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-slate-600">
                  <span>Zulässiger CRREM-Zielwert im Jahr 2030:</span>
                  <span className="font-mono font-bold text-slate-800">{formatDeZahl(crremResult.target2030, 1)} kg CO₂e</span>
                </div>
              </div>

            </div>

            {/* Output & Stranded Asset Analysis (5-cols) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              
              {/* Stranding Alert Box */}
              <div className={`p-6 rounded-2xl border shadow-sm flex flex-col gap-4 ${
                crremResult.isCurrentlyStranded
                  ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                  : crremResult.strandingYear && crremResult.strandingYear <= 2032
                  ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/70">
                    Misalignment &amp; Stranding
                  </span>
                  <span className="text-xs font-mono font-bold">Paris 1,5&deg;C</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-medium">Berechnetes Stranding Year (Misalignment):</span>
                  <strong className="text-3xl font-extrabold font-mono mt-1">
                    {crremResult.strandingYear ? `Jahr ${crremResult.strandingYear}` : 'Nach 2050 (Klimaneutral)'}
                  </strong>
                </div>

                <div className="text-xs leading-relaxed">
                  {crremResult.isCurrentlyStranded ? (
                    <div className="space-y-2">
                      <p className="font-bold text-rose-900">
                        &bull; Akute Gefahr: Das Gebäude ist bereits ein Stranded Asset!
                      </p>
                      <p className="text-rose-800/90 text-[11px]">
                        Die Emissionen überschreiten den degressiven Pariser 1,5&deg;C-Pfad für 2026. Es droht ein massiver <strong>Brown Discount</strong> (bis zu 20–30 % Marktwertverlust), Verlust der EU-Taxonomie-Konformität und stark verteuerte Bankfinanzierungs-Spreads.
                      </p>
                    </div>
                  ) : crremResult.strandingYear && crremResult.strandingYear <= 2035 ? (
                    <div className="space-y-2">
                      <p className="font-bold text-amber-900">
                        &bull; Mittelfristiges Stranding-Risiko (Stranding ab {crremResult.strandingYear})
                      </p>
                      <p className="text-amber-800/90 text-[11px]">
                        Das Objekt erfüllt die aktuellen Vorgaben knapp, wird aber vor 2035 aus dem Zielkorridor fallen. Die Capex-Planung (Sanierungsfahrplan / iSFP) muss spätestens jetzt eingeleitet werden.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-bold text-emerald-900">
                        &bull; Zukunftsfähig: Paris- und Taxonomie-konform (Green Premium)
                      </p>
                      <p className="text-emerald-800/90 text-[11px]">
                        Das Gebäude erfüllt die anspruchsvollen Dekarbonisierungskriterien über einen langen Horizont und sichert institutionellen Investoren ESG-Fähigkeit und stabile Renditen.
                      </p>
                    </div>
                  )}
                </div>

                {/* Progress Visual Bar */}
                <div className="space-y-1.5 pt-2 border-t border-current/15">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span>2020</span>
                    <span>2030 (Zwischenziel)</span>
                    <span>2050 (Net-Zero)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        crremResult.isCurrentlyStranded ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.max(5, ((crremResult.strandingYear || 2050) - 2020) / 30 * 100))}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Economic & Market Impacts Table */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale size={14} className="text-shiraz" />
                  Immobilienwirtschaftliche Auswirkungen
                </h4>
                <div className="text-[11px] space-y-2 text-slate-600">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-150">
                    <strong className="text-slate-900 block font-bold">Brown Discount vs. Green Premium:</strong>
                    Investoren fordern bei ineffizienten Beständen Risikoabschläge von 10–30 %. Energieeffiziente Gebäude erzielen Mietaufschläge und Spitzenbewertungen.
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-150">
                    <strong className="text-slate-900 block font-bold">CO₂-Bepreisung (ETS II &amp; BEHG):</strong>
                    Mit dem europäischen Brennstoffemissionshandel (ETS II; Start nach Beschluss von Ende 2025 auf 2028 verschoben, bis dahin nationaler Emissionshandel nach BEHG) steigen die Betriebskosten fossiler Heizsysteme deutlich.
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-150">
                    <strong className="text-slate-900 block font-bold">98 % Sanierungsdruck:</strong>
                    Laut Branchenanalysen verfehlen rund 98 % des europäischen gewerblichen Bestands ohne Intervention die 2050-Ziele (Gefahr von 303 Mrd. &euro; Abschreibungen).
                  </div>
                </div>
              </div>

            </div>

          </div>

              {/* Teaser bridge to the full Rechtsrahmen-Kompendium */}
              <div className="bg-off-white p-5 rounded-2xl border border-home-grau/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Scale size={24} className="text-shiraz shrink-0" />
                  <div>
                    <h4 className="text-xs md:text-sm font-extrabold text-text-main">
                      Europäischer &amp; Nationaler Rechtsrahmen für Gebäude und Baustoffe
                    </h4>
                    <p className="text-xs text-text-main/80 mt-0.5">
                      Entdecken Sie alle 23 relevanten Rechtsvereinbarungen (BauPVO, EPBD, ESPR, ETS II, CBAM, Level(s) u.v.m.) in der interaktiven Kaskade.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setRegulatorikSubTab('rechtsrahmen')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-shiraz text-white border border-shiraz hover:bg-shiraz/90 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  Rechtsrahmen öffnen &rarr;
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Workspace 4: Praxis, Suffizienz & Gebäudetyp E */}
      {activeWorkspace === 'praxis_innovationen' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          
          {/* Header Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-shiraz/10 border border-shiraz/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-shiraz self-start">
              <HardHat size={12} className="text-shiraz" />
              Bauwende in der Praxis &bull; Suffizienz &bull; Zirkularität
            </span>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Landmark className="text-shiraz" size={24} /> Praxis, Suffizienz &amp; Gebäudetyp E
            </h2>
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Überregulierung abbauen, Materialkreisläufe schließen und robuste Baustoffe einsetzen: Erkunden Sie das Forschungsprojekt &bdquo;Einfach Bauen&ldquo; (TU München), das neue Gebäudetyp-E-Gesetz (&sect; 650o BGB), Urban Mining (Rathaus Korbach), tragenden Lehmbau nach DIN 18940 und Großholzbau-Leuchttürme.
              </p>
            </div>
          </div>

          {/* Subnavigation Tabs for Praxis */}
          <div className="flex flex-wrap gap-2 border-b border-home-grau/20 pb-3">
            {[
              { id: 'gebaeudetyp_e', label: '1. Gebäudetyp E & Einfach Bauen', icon: FileText, desc: 'Gesetzesvorhaben & Bad Aibling' },
              { id: 'urban_mining', label: '2. Urban Mining & Materialpässe', icon: Recycle, desc: 'Rathaus Korbach & Neues Museum' },
              { id: 'lehmbau', label: '3. Tragender Lehmbau (DIN 18940)', icon: Layers, desc: 'Normenreihe 2023 & SFK 3' },
              { id: 'holz_hybrid', label: '4. Holz- & Hybrid-Leuchttürme', icon: Building, desc: 'Timber Pioneer, Prinz-Eugen-Park & Diedorf' }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = praxisCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setPraxisCategory(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
                    isActive
                      ? 'bg-shiraz text-white border-shiraz shadow-sm'
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                  }`}
                >
                  <TabIcon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Subcategory Content 1: Gebäudetyp E & Einfach Bauen */}
          {praxisCategory === 'gebaeudetyp_e' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Forschungsprojekt &bdquo;Einfach Bauen&ldquo; &amp; Das Gebäudetyp-E-Vorhaben
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Befreiung von Komfortnormen zugunsten robuster, bezahlbarer und langlebiger Architektur.</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-rose-50 text-shiraz border border-rose-200">
                    Kabinettsbeschluss Nov. 2024
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left: Das juristische Problem und das Gebäudetyp-E-Vorhaben */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Scale size={14} className="text-shiraz" />
                      Der angestrebte juristische Paradigmenwechsel
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Bislang galt im deutschen Bauvertragsrecht (&sect; 633 BGB) die strikte Vermutung, dass jede Abweichung von den <strong>&bdquo;anerkannten Regeln der Technik&ldquo; (aRdT)</strong> einen Sachmangel begründet. Da DIN-Normen zunehmend reine Komfort- und Ausstattungsansprüche festschreiben (z.B. Schallschutzstufen, Raumautomation, extreme Steckdosenzahlen), führte dies zu einer Kosten- und Fehler-Explosion.
                    </p>
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                      <strong className="block font-bold text-amber-900 mb-1">Kern des Gebäudetyp-E-Vorhabens (Stand Oktober 2026: noch kein Gesetz):</strong>
                      Der Regierungsentwurf von 2024 (BT-Drs. 20/13959, u. a. § 650a Abs. 3/4 und § 650o BGB-E) ist mit Ablauf der 20. Wahlperiode erledigt; BMJ und BMWSB haben im November 2025 Eckpunkte für einen neuen Entwurf vorgelegt. Ziel: Fachkundige Vertragsparteien sollen im Bauvertrag wirksam vereinbaren können, von reinen <em>Komfort- und Ausstattungsnormen</em> abzuweichen. Dies soll keinen Mangel begründen, <strong>solange die öffentlich-rechtlichen Schutzziele gewahrt bleiben:</strong>
                      <ul className="list-disc pl-4 mt-1.5 space-y-0.5 font-medium text-[11px]">
                        <li>Standsicherheit (Statik &amp; Tragfähigkeit nach Eurocodes)</li>
                        <li>Brandschutz (Rettungswege, Brandwände, Baustoffklassen)</li>
                        <li>Gesundheitsschutz &amp; primäre Hygiene</li>
                        <li>Elementarer Schall- und Wärmeschutz</li>
                      </ul>
                    </div>
                  </div>

                  {/* Right: Forschung "Einfach Bauen" TU München */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen size={14} className="text-shiraz" />
                      Forschungshaus Bad Aibling (TUM / Florian Nagler &amp; Thomas Auer)
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      An der TU München untersuchten die Lehrstühle von Prof. Florian Nagler und Prof. Thomas Auer an drei realisierten Forschungshäusern in Bad Aibling (Massivholz, Dämmbeton und hochdämmender Ziegel) das Prinzip des <strong>monolithischen, einschichtigen Bauens</strong>.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-1">
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                        <strong className="text-xs font-bold text-slate-900 block">Monolithik</strong>
                        <span className="text-[10px] text-slate-500">Verzicht auf Mehrschicht-Verbund und verklebte WDVS</span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                        <strong className="text-xs font-bold text-slate-900 block">Low-Tech TGA</strong>
                        <span className="text-[10px] text-slate-500">Natürliche Fensterlüftung statt wartungsintensiver Automation</span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                        <strong className="text-xs font-bold text-slate-900 block">Speichermasse</strong>
                        <span className="text-[10px] text-slate-500">Thermische Trägheit puffert Temperaturspitzen im Sommer</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Practical Savings Levers Table */}
                <div className="mt-4 pt-4 border-t border-home-grau/20">
                  <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    Konkrete Einsparpotenziale in Pilotprojekten (z.B. Bayern / IGEWO Augsburg 54 WE):
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-home-grau/25 rounded-xl overflow-hidden">
                      <thead className="bg-slate-50 text-[11px] font-bold text-slate-700 uppercase">
                        <tr>
                          <th className="p-3 border-b border-home-grau/20">Gewerk / Bauteil</th>
                          <th className="p-3 border-b border-home-grau/20">Konventioneller Komfortstandard</th>
                          <th className="p-3 border-b border-home-grau/20">Gebäudetyp E / Suffiziente Praxis</th>
                          <th className="p-3 border-b border-home-grau/20 text-emerald-800">Ressourcen- &amp; Kosteneffekt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-home-grau/20 text-[11px]">
                        <tr className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900">Deckenaufbauten</td>
                          <td className="p-3 text-slate-600">Schwimmender Nassestrich auf Trittschalldämmung (DIN 4109 Komfort)</td>
                          <td className="p-3 text-slate-800">Direkt sichtbare Holzbalkendecke ohne Nassestrich</td>
                          <td className="p-3 font-bold text-emerald-700">-4 bis 6 Wochen Trocknungszeit, erhebliche Material- und Gewichtsersparnis</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900">Betondecken</td>
                          <td className="p-3 text-slate-600">22–24 cm Dicke zur Übererfüllung von Schallschutznormen</td>
                          <td className="p-3 text-slate-800">18–20 cm (strikte statische Mindestdicke nach Eurocode 2)</td>
                          <td className="p-3 font-bold text-emerald-700">15–20 % Zement- und Beton-Einsparung (GWP-Minderung)</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900">Elektroinstallation</td>
                          <td className="p-3 text-slate-600">DIN 18015 (Mindestanzahl: 4–5 Steckdosen pro Zimmer, Leerrohre)</td>
                          <td className="p-3 text-slate-800">Nutzerangepasste, schlanke Leitungsführung</td>
                          <td className="p-3 font-bold text-emerald-700">30 % weniger Kupfer- und Kunststoffleitungen in Wänden</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900">Fenster &amp; Fassade</td>
                          <td className="p-3 text-slate-600">Elektrisch gesteuerte Raffstores mit Windwächtern und Sensorik</td>
                          <td className="p-3 text-slate-800">Konstruktiv verschattende Vordächer und manuelle Holz-Klappläden</td>
                          <td className="p-3 font-bold text-emerald-700">Wartungsfrei, null Ausfallrisiko, 100 % recyclingfähig</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Subcategory Content 2: Urban Mining & Materialpässe */}
          {praxisCategory === 'urban_mining' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
                <div className="border-b border-home-grau/20 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Urban Mining, Re-Use &amp; Digitale Materialpässe
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Das Bauwerk als temporäres Rohstofflager für zukünftige Baustoffgenerationen.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Fallbeispiel Rathaus Korbach */}
                  <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50/60 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Pionierprojekt Hessen
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">60 % Re-Use</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Rathaus Korbach: In-situ Recycling</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Beim Abbruch des Rathauserweiterungsbaus aus den 1970er-Jahren wurde die Bausubstanz im Vorfeld detailliert auditiert und schadstoffbereinigt. Der anfallende mineralische Bauschutt wurde direkt <strong>vor Ort gebrochen, aufbereitet und als RC-Gesteinskörnung für den Neubau verwendet</strong>.
                    </p>
                    <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 font-medium">
                      <li>Vermeidung von Hunderten LKW-Transporten zur Deponie</li>
                      <li>Erfolgreicher Einsatz von R-Beton (Typ 1 / Typ 2 nach DIN 1045-2)</li>
                      <li>Vorbildcharakter für kommunale Ausschreibungen nach KrWG</li>
                    </ul>
                  </div>

                  {/* Fallbeispiel Neues Museum Berlin */}
                  <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50/60 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                        Kulturerbe &amp; Zirkularität
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">375.000 Ziegel</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Neues Museum Berlin (David Chipperfield)</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Beim denkmalgerechten Wiederaufbau des kriegszerstörten Museums wurden rund <strong>375.000 historische Mauerziegel</strong> aus Trümmern geborgen, manuell vom Mörtel befreit und in den neuen Mauerschalen erneut vermauert.
                    </p>
                    <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 font-medium">
                      <li>Höchste Ressourcenschonung durch echtes Component-Re-Use</li>
                      <li>Verbindung historischer Bausubstanz mit zeitgenössischer Architektur</li>
                      <li>Null Graue Energie für die Ziegelherstellung</li>
                    </ul>
                  </div>

                </div>

                {/* Materialpässe & Madaster Box */}
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <FileSpreadsheet className="text-blue-700 shrink-0 mt-0.5" size={20} />
                    <div className="text-xs text-blue-950 leading-relaxed">
                      <strong className="block font-bold mb-0.5">Digitale Materialpässe &amp; Madaster-Plattform:</strong>
                      Der Materialpass dokumentiert Art, Masse, Einbauort und Lösbarkeit aller Baustoffe eines Gebäudes. Er ermittelt den <strong>Circularity Index (CI)</strong> und den monetären Restwert der Materialien am Lebensende – die Voraussetzung für DGNB-Zusatzpunkte und zirkuläres Bauen ohne chemische Verbundkleber.
                    </div>
                  </div>
                  <span className="shrink-0 px-3 py-1 bg-blue-700 text-white font-bold rounded-lg text-xs">
                    Design for Disassembly
                  </span>
                </div>

              </div>

            </div>
          )}

          {/* Subcategory Content 3: Tragender Lehmbau nach DIN 18940 */}
          {praxisCategory === 'lehmbau' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
                <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Tragender Lehmbau nach DIN 18940:2023-06
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Konstruktion, Bemessung und Ausführung von tragendem Lehmsteinmauerwerk bis Gebäudeklasse 4.</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                    DIN 18940
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left: Normdetails (7-cols) */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Mit der Veröffentlichung der <strong>DIN 18940 im Juni 2023</strong> erhielt der Lehmbau nach über 50 Jahren erstmals wieder eine vollwertige bauaufsichtliche Bemessungsgrundlage in Deutschland. Die Norm ist eng an das Sicherheitskonzept des <strong>Eurocode 6 (DIN EN 1996)</strong> angelehnt und ermöglicht den mehrgeschossigen Wohnungsbau bis zu einer Gebäudehöhe von 13 Metern.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl border border-home-grau/25 bg-slate-50">
                        <strong className="text-xs font-bold text-slate-900 block mb-1">Schlanke Wandstärken:</strong>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Statt der früher üblichen 24 oder 36,5 cm lässt die DIN 18940 tragende Wandstärken bereits <strong>ab 17,5 cm</strong> zu (bei entsprechender Steindruckfestigkeitsklasse).
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-home-grau/25 bg-slate-50">
                        <strong className="text-xs font-bold text-slate-900 block mb-1">Druckfestigkeitsklasse SFK 3:</strong>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Für tragendes Mauerwerk sind Lehmsteine nach DIN 18945 mindestens der Klasse <strong>SFK 3 (<InlineMath math="f_{\text{St}} \ge 3{,}5\text{ N/mm}^2" />)</strong> erforderlich.
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-home-grau/25 bg-slate-50">
                        <strong className="text-xs font-bold text-slate-900 block mb-1">Brandschutz Klasse A1:</strong>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Mineralische Lehmbaustoffe sind rein anorganisch und erreichen die <strong>Brandklasse A1 (nicht brennbar)</strong> sowie Feuerwiderstand <strong>REI 30 bis REI 90</strong>.
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-home-grau/25 bg-slate-50">
                        <strong className="text-xs font-bold text-slate-900 block mb-1">100 % Zirkulär (C2C):</strong>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Lehm bindet physikalisch durch Tonmineralien (keine chemische Hydratation). Durch Wasserzugabe ist er beliebig oft rezyklierbar – null Brennenergie.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                      <span>Ökobilanz-Effekt gegenüber gebrannten Ziegeln:</span>
                      <strong className="font-mono font-bold text-emerald-800 text-sm">-85 % bis -90 % Primärenergie (PENRT)</strong>
                    </div>
                  </div>

                  {/* Right: Normenmatrix Lehmbau (5-cols) */}
                  <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen size={14} className="text-shiraz" />
                      Die Deutsche Lehmbau-Normenfamilie
                    </h4>
                    <div className="text-[11px] space-y-2 text-slate-700">
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <strong className="text-slate-950 block font-mono">DIN 18940:2023-06</strong>
                        <span>Tragendes Lehmsteinmauerwerk – Konstruktion, Bemessung und Ausführung</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <strong className="text-slate-950 block font-mono">DIN 18945:2018-12</strong>
                        <span>Lehmsteine – Begriffe, Anforderungen und Prüfverfahren</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <strong className="text-slate-950 block font-mono">DIN 18946:2018-12</strong>
                        <span>Lehmmauermörtel – Begriffe, Anforderungen und Prüfverfahren</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <strong className="text-slate-950 block font-mono">DIN 18947:2018-12</strong>
                        <span>Lehmputzmörtel – Begriffe, Anforderungen und Prüfverfahren</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <strong className="text-slate-950 block font-mono">DIN 18948:2018-12</strong>
                        <span>Lehmplatten – Begriffe, Anforderungen und Prüfverfahren</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* Subcategory Content 4: Holz- & Hybrid-Leuchttürme */}
          {praxisCategory === 'holz_hybrid' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
                <div className="border-b border-home-grau/20 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Großmaßstäblicher Holz- &amp; Holz-Hybridbau
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Herausragende Ingenieurbauwerke und ökologische Mustersiedlungen in Deutschland.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Prinz-Eugen-Park München */}
                  <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between gap-3">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded self-start">
                        München &bull; 30 Hektar
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">Prinz-Eugen-Park (Ökologische Mustersiedlung)</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Die derzeit größte zusammenhängende Holzbausiedlung Deutschlands mit <strong>570 bis 600 Wohneinheiten</strong>. 
                        Vom mehrgeschossigen Atriumhaus bis zu 7-geschossigen Holzhybridbauten mit hohem Vorfertigungsgrad.
                      </p>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 border-t border-slate-200 pt-2 font-bold">
                      Vorzeigeprojekt für kommunalen Klimaschutz
                    </div>
                  </div>

                  {/* Timber Pioneer Frankfurt */}
                  <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between gap-3">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded self-start">
                        Frankfurt &bull; 14.100 m² BGF
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">Timber Pioneer (Europaviertel)</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Erstes Holz-Hybrid-Bürogebäude Frankfurts. 1.800 m³ Holz binden dauerhaft ca. <strong>1.800 t CO₂</strong>. 
                        Mit nur <strong>300 kg/m²</strong> ist die Tragstruktur 57 % leichter als ein Massivbau (ca. 700 kg/m²). Ausgezeichnet mit DGNB Gold.
                      </p>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 border-t border-slate-200 pt-2 font-bold">
                      57 % Gewichtsersparnis bei Decken
                    </div>
                  </div>

                  {/* Schmuttertal-Gymnasium Diedorf */}
                  <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between gap-3">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded self-start">
                        Diedorf &bull; Plusenergiehaus
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">Schmuttertal-Gymnasium (Nagler &amp; Kaufmann)</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Vier Baukörper in modularer Holz-Skelettbauweise mit Holz-Beton-Verbunddecken und Aufdachdämmung im Landschaftsschutzgebiet. 
                        Erzeugt mehr Energie als es verbraucht; von der DBU mit <strong>1,1 Mio. Euro</strong> gefördert.
                      </p>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 border-t border-slate-200 pt-2 font-bold">
                      Architektur-Vorbild für Schulbauten
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* Workspace 5: EPD- & QNG-Wegweiser (Leitfaden) */}
      {activeWorkspace === 'leitfaden' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          
          {/* Header Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-shiraz/10 border border-shiraz/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-shiraz self-start">
              <Compass size={12} className="text-shiraz" />
              Akademischer Wegweiser
            </span>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <BookOpen className="text-shiraz" size={24} /> EPD- &amp; QNG-Leitfaden für Studierende
            </h2>
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Eine praxisbezogene, schrittweise Anleitung zur fachgerechten Erstellung einer Gebäude-Ökobilanz (LCA), dem wissenschaftlichen Umgang mit Umweltproduktdeklarationen (EPDs) sowie dem Konformitätsnachweis nach DGNB- und QNG-Kriterien.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* Steps Left Interactive Sidebar */}
            <div className="lg:col-span-1 flex flex-col gap-2">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest pl-2 mb-1">
                Leitfaden-Schritte
              </span>
              {[
                { label: 'Schritt 1: EPD-Konzepte', sub: 'Datenquellen & EPD-Typen', icon: FileSpreadsheet },
                { label: 'Schritt 2: Mengen & Dichten', sub: 'Massenbilanz & BIM', icon: Layers },
                { label: 'Schritt 3: Lebenszyklus', sub: 'DIN EN 15978 Phasen', icon: Factory },
                { label: 'Schritt 4: LCA-Berechnung', sub: 'Formeln & Faktoren', icon: Percent },
                { label: 'Schritt 5: DGNB & QNG', sub: 'Förderung & Auditierung', icon: ClipboardCheck },
                { label: 'Anhang 1: Praxisbeispiele', sub: 'Außenwand & Gebäude', icon: Building },
                { label: 'Anhang 2: Checklisten & Fehler', sub: 'Prävention & Kontrollen', icon: AlertTriangle },
                { label: 'Anhang 3: Übungsaufgaben', sub: 'Klausuren & Lösungen', icon: HelpCircle },
                { label: 'Anhang 4: Öko-Datenbanken', sub: 'QNG, DGNB, IBU & Co.', icon: Globe },
                { label: 'Anhang 5: Glossar & Software', sub: 'Wichtige Begriffe & Tools', icon: Compass }
              ].map((step, idx) => {
                const IconComp = step.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer select-none ${
                      activeStep === idx
                        ? 'border-shiraz bg-shiraz/5 shadow-xs'
                        : 'border-home-grau/30 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      activeStep === idx ? 'bg-shiraz text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <IconComp size={15} />
                    </div>
                    <div className="min-w-0">
                      <strong className={`text-[11px] block font-bold leading-tight ${activeStep === idx ? 'text-shiraz' : 'text-slate-800'}`}>
                        {step.label}
                      </strong>
                      <span className="text-[9px] text-slate-400 truncate block mt-0.5">{step.sub}</span>
                    </div>
                  </button>
                )
              })}

              <div className="bg-emerald-50/30 p-4 border border-emerald-100/80 rounded-xl mt-4">
                <h4 className="text-[10px] uppercase font-bold text-emerald-900 tracking-wider flex items-center gap-1">
                  <Sparkles size={11} className="text-emerald-700" />
                  Prüfungsrelevant:
                </h4>
                <p className="text-[10px] text-emerald-800/80 mt-1.5 leading-relaxed">
                  Ökobilanzierungen sind Kernbestandteil moderner Bauingenieurs- und Projektmanagement-Thesis-Ausarbeitungen. Verwenden Sie diesen Leitfaden als strukturelles Grundgerüst.
                </p>
              </div>
            </div>

            {/* Stepper Details Right Panel (3-cols) */}
            <div className="lg:col-span-3 flex flex-col gap-6">

              {activeStep === 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5 animate-in fade-in duration-200">
                  <div className="border-b border-home-grau/25 pb-3">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Schritt 1 von 5</span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      Grundkonzept &amp; EPD-Wahl (Generische vs. Spezifische Deklarationen)
                    </h3>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Der Einstieg in jede Ökobilanzierung (LCA) verlangt den Zugriff auf validierte Umweltproduktdeklarationen (<strong>EPD - Environmental Product Declarations</strong>) gemäß DIN EN 15804. EPDs bündeln alle quantifizierten Umweltwirkungen eines Baustoffs über dessen Lebenszyklus. Für Studierende ist das Verständnis der zwei EPD-Haupttypen von eminentem Wert:
                  </p>

                  {/* Comparative Matrix table */}
                  <div className="border border-home-grau/30 rounded-xl overflow-hidden shadow-2xs">
                    <div className="bg-slate-50 p-2.5 border-b border-home-grau/20 grid grid-cols-3 gap-2 text-[10px] font-bold uppercase text-slate-800 tracking-wide">
                      <div>Kriterium</div>
                      <div>Generische EPD (z.B. ÖKOBAUDAT)</div>
                      <div>Spezifische hersteller-EPD</div>
                    </div>
                    
                    {[
                      {
                        krit: 'Datengrundlage',
                        gen: 'Branchenmittelschnitte & theoretische Mittelwerte eines Wirtschaftszweiges.',
                        spec: 'Gemessene, auditierte Primärdaten eines konkreten Zement-, Ziegel- oder Sägewerks.'
                      },
                      {
                        krit: 'Sicherheitsbeiwert (QNG/DGNB)',
                        gen: '⚠️ Unvorteilhafter Aufschlag (+10% auf GWP etc.) zum Ausgleich von Qualitätsschwankungen.',
                        spec: '✅ 0% Zuschlag (reale Werte). Führt rechnerisch zu deutlich besseren Gebäude-Ökobilanzen.'
                      },
                      {
                        krit: 'Nutzen für Planer',
                        gen: 'Hervorragend in der frühen Entwurfsphase (LPH 1-3), falls Hersteller noch unklar sind.',
                        spec: 'Unerlässlich für die detaillierte Ausführungsplanung und das schlussendliche QNG-Audit.'
                      },
                      {
                        krit: 'Innovationswirkung',
                        gen: 'Trägt keine marktverändernde Wirkung, zementiert den Ist-Mittelzustand.',
                        spec: 'Belohnt CO₂-effiziente Werke (z.B. CO2-arme Klinker, regenerative Werksenergie).'
                      }
                    ].map((row, r_idx) => (
                      <div key={r_idx} className="p-3 grid grid-cols-3 gap-2 text-xs border-b border-stone-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <div className="font-bold text-slate-900 text-[11px]">{row.krit}</div>
                        <div className="text-slate-600 leading-relaxed text-[11px]">{row.gen}</div>
                        <div className="text-emerald-955 leading-relaxed text-[11px]">{row.spec}</div>
                      </div>
                    ))}
                  </div>

                  {/* PCR Explanation Panel (Product Category Rules) */}
                  <div className="bg-emerald-50/15 border border-emerald-100 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                      <strong className="text-xs font-black uppercase tracking-wider font-mono">
                        Exkurs: Was sind PCR (Product Category Rules)?
                      </strong>
                    </div>
                    <p className="text-[11px] text-slate-650 leading-relaxed font-sans">
                      Eine <strong>EPD</strong> darf nicht willkürlich berechnet werden. Hier kommen die <strong>PCR (Produktkategorieregeln)</strong> ins Spiel. PCR sind standardisierte Regelwerke (meist basierend auf <strong>DIN EN 15804</strong>), die definieren, wie Ökobilanzen für bestimmte Baustoffklassen berechnet werden müssen, um deren EPDs überhaupt vergleichbar zu machen.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] mt-1">
                      <div className="bg-white/60 p-2.5 rounded border border-stone-200/50 space-y-1">
                        <span className="font-extrabold text-emerald-900 block font-mono">Part A: Allgemeine Rechenregeln</span>
                        <p className="text-slate-500 leading-normal font-normal font-sans">
                          Gilt übergreifend für alle Bauprodukte. Definiert Ökobilanz-Grundregeln, anzuwendende Lebenszyklusmodule (A1-D), Gutschriftverfahren und Datenqualität.
                        </p>
                      </div>
                      <div className="bg-white/60 p-2.5 rounded border border-stone-200/50 space-y-1">
                        <span className="font-extrabold text-emerald-900 block font-mono">Part B: Spezifische Baustoffklasse</span>
                        <p className="text-slate-500 leading-normal font-normal font-sans">
                          Gilt für eine konkrete Produktgruppe (z. B. mineralische Dämmstoffe, Betonbauteile, Bauhölzer). Regelt die exakte deklarierte Einheit und stoffspezifische Szenarien.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-amber-500 p-4 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                    {/* DIN EN 15804+A2 Kernindikatoren */}
                    <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                      <div className="flex items-center justify-between border-b border-home-grau/15 pb-1.5">
                        <strong className="text-xs text-text-main font-bold">DIN EN 15804+A2 Pflicht-Kernindikatoren</strong>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">ÖKOBAUDAT Standard</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                        <div className="p-2 bg-white rounded border border-home-grau/15">
                          <span className="font-bold text-shiraz font-mono block">GWP-total</span>
                          <span className="text-[10px] text-text-main/70">Gesamtes Erderwärmungspotenzial (fossil + biogen + LULUC)</span>
                        </div>
                        <div className="p-2 bg-white rounded border border-home-grau/15">
                          <span className="font-bold text-text-main font-mono block">GWP-fossil</span>
                          <span className="text-[10px] text-text-main/70">Fossile Treibhausgasemissionen aus Brennstoffen/Prozessen</span>
                        </div>
                        <div className="p-2 bg-white rounded border border-home-grau/15">
                          <span className="font-bold text-emerald-700 font-mono block">GWP-biogenic</span>
                          <span className="text-[10px] text-text-main/70">Biogener Kohlenstoff (temporäre CO₂-Speicherung in Holz/Nawaro)</span>
                        </div>
                        <div className="p-2 bg-white rounded border border-home-grau/15">
                          <span className="font-bold text-indigo-700 font-mono block">PENRT</span>
                          <span className="text-[10px] text-text-main/70">Total nicht-erneuerbare Primärenergie [MJ]</span>
                        </div>
                        <div className="p-2 bg-white rounded border border-home-grau/15">
                          <span className="font-bold text-amber-700 font-mono block">PERT</span>
                          <span className="text-[10px] text-text-main/70">Total erneuerbare Primärenergie [MJ]</span>
                        </div>
                        <div className="p-2 bg-white rounded border border-home-grau/15">
                          <span className="font-bold text-slate-700 font-mono block">ÖKOBAUDAT</span>
                          <span className="text-[10px] text-text-main/70">Verbindliche Bundesplattform des BMWSB für QNG-Berechnungen</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-amber-955 leading-relaxed">
                      <strong className="font-bold block mb-1">Akademischer Praxistipp für die Thesis:</strong>
                      Beginnen Sie im Vorentwurf mit generischen EPDs der nationalen <strong>ÖKOBAUDAT</strong>-Datenbank (gemäß DIN EN 15804+A2). Demonstrieren Sie Optimierungskompetenz, indem Sie im Hauptentwurf gezielt emissionsarme Hersteller-EPDs (z.B. für CO₂-reduzierten Beton oder zertifizierten Holzbau) substituieren und die GWP-Senkung quantifizieren!
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5 animate-in fade-in duration-200">
                  <div className="border-b border-home-grau/25 pb-3">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Schritt 2 von 5</span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      Mengenermittlung, Dichteabgleich &amp; BIM-Kopplung
                    </h3>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    EPD-Werte sind in der Regel auf eine funktionelle Einheit (<strong>Functional Unit</strong>) normiert, meist auf <strong>1 kg</strong> eines Stoffs oder <strong>1 m³</strong> eines Bauprodukts. Um eine vollständige Bauteil- oder Gebäude-Ökobilanzierung zu berechnen, müssen Sie die Volumina akkurat ermitteln und mittels Rohdichten in Massen konvertieren.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/25 flex flex-col gap-2">
                      <strong className="text-xs font-bold text-slate-900 block uppercase tracking-wider">Massenermittlungs-Formel</strong>
                      <div className="bg-white p-3 rounded-lg border border-stone-200/60 flex justify-center items-center">
                        <FormulaText text="m = V \cdot \rho \quad \text{mit} \quad \mathrm{[kg] = [m^3] \cdot [kg/m^3]}" className="text-xs font-semibold text-shiraz" />
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                        Rohdichten variieren stark je nach Zuschlag, Feuchte und Porenanteil. Nutzen Sie die baustoffkundigen Standardwerte der Board-Module.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/25 flex flex-col gap-2">
                      <strong className="text-xs font-bold text-slate-900 block uppercase tracking-wider">Kopplung mit der BIM-Methodik</strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        In modernen Planungsbüros und bei Studienprojekten werden Volumina direkt aus 3D-BIM-Modellen (z.B. Autodesk Revit, Allplan) über Bauteillisten oder den IFC-Datenstandard exportiert.
                      </p>
                    </div>
                  </div>

                  {/* References table to other modules */}
                  <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wide">
                      <Compass size={14} className="text-emerald-700" />
                      Interdisziplinärer Bezug zu anderen Board-Modulen:
                    </h4>
                    
                    <div className="space-y-2.5 text-[11px]">
                      <div className="p-2.5 bg-white border border-stone-150 rounded-lg flex items-start gap-2.5">
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded shrink-0">BIM &amp; Baustoffe</span>
                        <div>
                          <strong>Attribute &amp; Schichtdaten:</strong> Schaue in dieses Modul, um zu sehen, wie IFC-Schnittstellen Schichtdicken und Material-UUIDs halten, um automatisierte Ökobilanzen direkt im CAD-Kern anzustoßen.
                        </div>
                      </div>

                      <div className="p-2.5 bg-white border border-stone-150 rounded-lg flex items-start gap-2.5">
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded shrink-0">Materialdatenbanken</span>
                        <div>
                          <strong>ÖKOBAUDAT Mapping:</strong> Bietet direkten Zugang zu den Datenbankportalen und Suchregistern, um LCA-Charakterisierungsfaktoren verifiziert abzugreifen.
                        </div>
                      </div>

                      <div className="p-2.5 bg-white border border-stone-150 rounded-lg flex items-start gap-2.5">
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded shrink-0">Baustoffkenngrößen</span>
                        <div>
                          <strong>Dichtewerte &amp; Porosität:</strong> Finde dort exakte physikalische Kenngrößen von mineralischen und metallischen Rohstoffen für genaue Massenabbildungen.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5 animate-in fade-in duration-200">
                  <div className="border-b border-home-grau/25 pb-3">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Schritt 3 von 5</span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      Systemgrenzen &amp; Lebenszyklusmodule (DIN EN 15978)
                    </h3>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Lebenszyklusberechnungen erfassen nicht nur die unmittelbare Produktion eines Baustoffs, sondern bewerten die ökologischen Einflüsse in streng abgegrenzten Modulen von der Wiege bis zur Bahre (<strong>Cradle to Grave</strong>) sowie darüber hinaus (Wiederverwertbarkeit):
                  </p>

                  <div className="space-y-3 mt-1">
                    {[
                      { code: 'A1 - A3', phase: 'Herstellungsphase (Cradle-to-Gate)', desc: 'Rohstoffbereitstellung (A1), Transport zum Werk (A2), tatsächliche Herstellung im Werk (A3). Dies ist die fossil-intensivste Phase mineralischer Baustoffe.' },
                      { code: 'A4 - A5', phase: 'Errichtungsphase', desc: 'Transporte zur Baustelle (A4), Einbautätigkeiten und Baustellenabfälle (A5).' },
                      { code: 'B1 - B7', phase: 'Nutzungsphase', desc: 'Nutzung (B1), Instandhaltung/Wartung (B2), Reparatur (B3), Ersatz (B4) sowie der operative Energie- (B6) und Wasserverbrauch (B7).' },
                      { code: 'C1 - C4', phase: 'Entsorgungsphase (End-of-Life)', desc: 'Rückbau/Abbruch (C1), Transport zum Recycling (C2), Abfallaufbereitung (C3) und finale Beseitigung/Deponierung (C4). Bei Biomassen wird hier das CO₂ wieder freigesetzt.' },
                      { code: 'Modul D', phase: 'Gutschriften und Lasten außerhalb der Systemgrenzen', desc: 'Recyclingpotenziale, thermische Verwertung mit Gutschriften für verdrängte fossile Kraftwerke und Wiederverwendungsnutzen. Enorm wichtig für nachwachsende Werkstoffe.' }
                    ].map((mod, m_idx) => (
                      <div key={m_idx} className="flex gap-4 p-3.5 bg-slate-50 border border-stone-150 rounded-xl hover:shadow-2xs transition-all">
                        <div className="w-16 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-inner overflow-hidden">
                          {mod.code}
                        </div>
                        <div>
                          <strong className="text-xs text-slate-900 block font-bold leading-tight">{mod.phase}</strong>
                          <p className="text-[11px] text-slate-600 leading-relaxed mt-1">{mod.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-indigo-50/50 p-4 border border-indigo-150 rounded-xl">
                    <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 uppercase">
                      <Recycle size={14} className="text-indigo-700" />
                      Schnittstelle zur Kreislaufwirtschaft &amp; Rückbaufähigkeit:
                    </h4>
                    <p className="text-[11px] text-indigo-950 mt-1.5 leading-relaxed">
                      Spezielle Berechnungen für das <strong>Modul D</strong> setzen vertieftes Wissen über Sortenreinheit, Trennbarkeit und Recyclingquoten voraus. Verweise hierzu finden Sie im Modul <strong>Kreislaufwirtschaft &amp; Altlasten</strong> sowie im Modul <strong>Rückbau</strong>. Geringe Verbundstoffanteile begünstigen ein hohes Entsorgungs- und Substitutionsergebnis in Modul D!
                    </p>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5 animate-in fade-in duration-200">
                  <div className="border-b border-home-grau/25 pb-3">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Schritt 4 von 5</span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      Berechnung der LCA-Indikatoren &amp; Umweltwirkungsklassen
                    </h3>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Nachdem die Schichten, Massen und EPD-Charakterisierungsfaktoren bestimmt sind, wird die mathematische Akkumulation für das Bauteil durchgeführt. Hierbei müssen Sie die wichtigsten Kenngrößen unterscheiden:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-red-50/40 border border-red-100 rounded-lg">
                      <strong className="text-xs text-red-900 block font-bold">GWP-fossil</strong>
                      <p className="text-[10px] text-slate-600 leading-relaxed mt-1">
                        Erfasst Emissionen aus fossilen Brennstoffen (Kohle, Erdgas). Dominierender Faktor bei Zementwerksprozessen und Stahlherstellung.
                      </p>
                    </div>
                    <div className="p-3 bg-teal-50/45 border border-teal-100 rounded-lg">
                      <strong className="text-xs text-teal-900 block font-bold">GWP-biogenic</strong>
                      <p className="text-[10px] text-slate-600 leading-relaxed mt-1">
                        CO₂-Speicherleistung nachwachsender Baustoffe (z.B. Holz, Stroh). Wird bei der Herstellung als negatives GWP ausgewiesen (Kohlenstoffspeicherung).
                      </p>
                    </div>
                    <div className="p-3 bg-amber-50/40 border border-amber-100 rounded-lg">
                      <strong className="text-xs text-amber-900 block font-bold">PENRT &amp; PERE</strong>
                      <p className="text-[10px] text-slate-600 leading-relaxed mt-1">
                        Primärenergieverbrauch nicht-erneuerbar / erneuerbar. Beschreibt die energetische Gesamteffizienz der Herstellungslogistik.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-stone-200 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2">Exemplarisches Rechenbeispiel (1 m² Wand):</span>
                    <div className="space-y-2 text-[11px] leading-relaxed">
                      <p className="font-bold text-slate-800 flex flex-wrap items-center gap-1">
                        Gegeben: Schicht 16 cm EPS-Dämmung (<FormulaText text="\rho = 20\,\mathrm{kg/m^3}" />, <FormulaText text="GWP_{\mathrm{A1\text{-}A3}} = 3{,}25\,\mathrm{kg\,CO_2\text{-}eq/kg}" />)
                      </p>
                      <div className="bg-white p-3.5 rounded-lg border border-stone-200/60 flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                          <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded uppercase self-start sm:self-auto shrink-0 font-mono">1. Masse pro m²:</span>
                          <FormulaText text="M_i = d_i \cdot 1\,\mathrm{m^2} \cdot \rho_i = 0{,}16\,\mathrm{m} \cdot 1\,\mathrm{m^2} \cdot 20\,\mathrm{kg/m^3} = 3{,}2\,\mathrm{kg/m^2}" className="text-xs font-semibold text-slate-700 font-mono" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                          <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded uppercase self-start sm:self-auto shrink-0 font-mono">2. GWP A1-A3:</span>
                          <FormulaText text="GWP_{\mathrm{A1\text{-}A3}} = M_i \cdot gwp_{\mathrm{fossil}} = 3{,}2\,\mathrm{kg/m^2} \cdot 3{,}25\,\mathrm{kg\,CO_2\text{-}eq/kg} = 10{,}4\,\mathrm{kg\,CO_2\text{-}eq/m^2}" className="text-xs font-semibold text-shiraz font-mono" />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Wiederhole diese Summenrechnung für jede Schicht, um das Bauteil-GWP zu kollationieren, wie es im obenstehenden <strong>Wandaufbau-Konfigurator (Tab 1)</strong> automatisiert geschieht!
                      </p>
                    </div>
                  </div>

                  {/* Weitere EPD-Wirkungsindikatoren Grid */}
                  <div className="bg-slate-50/50 border border-stone-150 rounded-xl p-4 flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2">
                      <Globe size={14} className="text-emerald-700" />
                      Weitere ökologische EPD-Wirkungsindikatoren (DIN EN 15804)
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Eine vollständige EPD deklariert neben dem klassischen Treibhauspotenzial (GWP) weitere standardisierte biogeochemische Wirkungsklassen, die in Prüfungen und Fachberichten eine Rolle spielen:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                      {[
                        { 
                          name: 'ODP (Ozone Depletion Potential)', 
                          desc: 'Spezifische Abbauwirkung halogenierter Gase auf die schützende stratosphärische Ozonschicht.', 
                          unit: 'kg CFC-11-Äqv.', 
                          ref: 'Relevant bei geschäumten Dämmstoffen (PUR/XPS).' 
                        },
                        { 
                          name: 'AP (Acidification Potential)', 
                          desc: 'Versauerungseffekt auf Böden und Gewässer (Saurer Regen) durch ssaure Gase wie SO2 und NOx.', 
                          unit: 'kg SO₂-Äqv.', 
                          ref: 'Entsteht bei Brennprozessen und Klinkerentsäuerung.' 
                        },
                        { 
                          name: 'EP (Eutrophication Potential)', 
                          desc: 'Überdüngungseffekt (Nährstoffeintrag) in Gewässern und Böden, begünstigt Algenblüten.', 
                          unit: 'kg PO₄³⁻-Äqv.', 
                          ref: 'Erhöht bei NaWaRo-Baustoffen durch Düngung beim Anbau.' 
                        },
                        { 
                          name: 'POCP (Photochemical Ozone Creation)', 
                          desc: 'Zunahme des bodennahen Ozons durch flüchtige organische Verbindungen und Sonnenlicht (Sommersmog).', 
                          unit: 'kg C₂H₄-Äqv.', 
                          ref: 'Kritisch bei lösemittelhaltigen Farben, Klebern und Harzen.' 
                        }
                      ].map((ind, i_idx) => (
                        <div key={i_idx} className="bg-white p-3 rounded-lg border border-stone-150 flex flex-col justify-between hover:shadow-2xs transition-all">
                          <div>
                            <strong className="text-[11px] text-slate-900 block font-bold leading-tight">{ind.name}</strong>
                            <p className="text-[10px] text-slate-500 mt-1 leading-snug">{ind.desc}</p>
                          </div>
                          <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px]">
                            <span className="font-semibold text-emerald-800">Einheit: {ind.unit}</span>
                            <span className="text-[9px] text-slate-400 font-mono italic">{ind.ref}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex items-start gap-3">
                    <Building className="text-slate-600 shrink-0 mt-0.5" size={16} />
                    <div className="text-xs text-slate-800 leading-relaxed">
                      <strong className="font-bold block mb-1">Verbindung zu innovativen Baumaterialien:</strong>
                      Die Einführung zerspanungsfreier Carbonbewehrungen statt Baustahl (siehe Modul <strong>Innovative Werkstoffe &bull; Carbonbeton</strong>) verringert zwar das Bauteilvolumen, bedingt aber ein sehr hohes initiales GWP bei der Kohlefaserherstellung. Studierende müssen eine Lebenszyklus-Sensitivitätsanalyse anfertigen, um zu prüfen, ab welcher Abminderung der Betonschichtstärke sich Carbonbeton ökologisch amortisiert.
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 4 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5 animate-in fade-in duration-200">
                  <div className="border-b border-home-grau/25 pb-3">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Schritt 5 von 5</span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      DGNB- &amp; QNG-Zertifizierungsprozess (Qualitätssiegel)
                    </h3>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Nach Abschluss der Bauteilbilanzierung werden die Einzelergebnisse zum Gebäude zusammengesetzt. In der Praxis dienen zwei führende Zertifizierungs- und Qualitätssiegel-Verfahren zur Validierung der Nachhaltigkeit:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* DGNB Column */}
                    <div className="p-4 bg-emerald-50/20 border border-emerald-100 rounded-xl flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase rounded">DGNB</span>
                        <strong className="text-xs font-bold text-slate-900">DGNB-Zertifizierungssystem</strong>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Ein ganzheitlicher, freiwilliger Systemansatz der Deutschen Gesellschaft für Nachhaltiges Bauen. Bewertet 6 Themenfelder über 50 Jahre Betrachtungszeitraum.
                      </p>
                      <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 leading-normal">
                        <li>Auszeichnungsklassen: Platin (≥ 80%), Gold (≥ 65%), Silber (≥ 50%), Bronze (≥ 35%).</li>
                        <li>Verbindet Ökobilanz (GWP, ODP) mit ökonomischen Lebenszykluskosten (LCC) und soziokulturellem Komfort.</li>
                        <li>Fördert sortenreinen Modulrückbau durch CE-Bonuspunkte.</li>
                      </ul>
                    </div>

                    {/* QNG Column */}
                    <div className="p-4 bg-sky-50/20 border border-sky-100 rounded-xl flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold text-[10px] uppercase rounded">QNG</span>
                        <strong className="text-xs font-bold text-slate-900">QNG-Siegel (BMWSB)</strong>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Das staatliche <strong>Qualitätssiegel Nachhaltiges Gebäude</strong> ist Voraussetzung für die Inanspruchnahme der zinsgünstigen KFN-Förderung (Klimafreundlicher Neubau) der KfW-Bank.
                      </p>
                      <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 leading-normal">
                        <li><strong>QNG-Plus:</strong> ≤ 24 kg CO₂-eq/(m² NRF · a) (LCA über 50 Jahre; PENRT ≤ 96 kWh/(m² NRF · a)).</li>
                        <li><strong>QNG-Premium:</strong> ≤ 20 kg CO₂-eq/(m² NRF · a) (PENRT ≤ 64 kWh/(m² NRF · a); erfordert z. B. sehr gut gedämmten Holz- oder Hybridbau).</li>
                        <li>Strikte Pflichten zur schadstofffreien Baustoffwahl auf der Baustelle.</li>
                      </ul>
                    </div>

                  </div>

                  {/* Intersect with Schadstoffvermeidung */}
                  <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-amber-500 rounded-xl p-4 flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-amber-955 flex items-center gap-1.5 uppercase">
                      <AlertTriangle size={14} className="text-amber-700" />
                      Schadstoffvermeidung als QNG-Ausschlusskriterium:
                    </h4>
                    <p className="text-[11px] text-amber-955 leading-relaxed">
                      Das beste Gebäude-GWP nützt nichts, wenn schadstoffhaltige Materialien verbaut werden. Die QNG-Zertifizierung definiert strikte Grenzwerte für Organische Halogenverbindungen, Biozide, Blei und flüchtige organische Verbindungen (VOCs) in Farben, Klebern und Dämmstoffen. Machen Sie sich mit diesen Anforderungen im Modul <strong>Schadstoffe</strong> sowie im Modul <strong>Farben &amp; Lacke</strong> vertraut, um Planungsfehler im Zertifizierungsprozess zu verhindern!
                    </p>
                  </div>

                  {/* Urban Mining Index (UMI) & Zirkularitäts-Kennwerte */}
                  <div className="bg-white border border-home-grau/25 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
                      <h4 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
                        <Recycle size={14} className="text-shiraz" />
                        Zirkularitätsmetriken: Urban Mining Index (UMI) &amp; Materialpässe
                      </h4>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Zirkuläres Bauen
                      </span>
                    </div>
                    <p className="text-xs text-text-main/80 leading-relaxed">
                      Moderne Ökobilanzierungen und DGNB-/QNG-Audits bewerten neben GWP zunehmend die Kreislauffähigkeit von Bauteilen:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-off-white rounded-lg border border-home-grau/15 space-y-1">
                        <span className="font-bold text-shiraz block text-xs">Urban Mining Index (UMI):</span>
                        <p className="text-[11px] text-text-main/70 leading-relaxed">
                          Gibt an, wie viel Prozent der Baustoffmasse nach dem Rückbau tatsächlich wieder hochwertig in den Stoffkreislauf zurückgeführt werden können (Closed-Loop-Recyclingquote abzüglich Downcycling und Deponieanteil).
                        </p>
                      </div>
                      <div className="p-3 bg-off-white rounded-lg border border-home-grau/15 space-y-1">
                        <span className="font-bold text-indigo-700 block text-xs">Materialpässe (Madaster / DIN SPEC 91525):</span>
                        <p className="text-[11px] text-text-main/70 leading-relaxed">
                          Digitale Inventarisierung aller verbauten Werkstoffe, Schadstofffreiheit und Demontagepfade auf Bauteilebene für zukünftige Rückbauaudits.
                        </p>
                      </div>
                      <div className="p-3 bg-off-white rounded-lg border border-home-grau/15 space-y-1">
                        <span className="font-bold text-emerald-700 block text-xs">Trennbarkeit von Verbundbauteilen:</span>
                        <p className="text-[11px] text-text-main/70 leading-relaxed">
                          Präferenz mechanisch lösbarer Verbindungen (Schrauben, Stecken) statt vollflächiger Verklebungen oder Verbundestrichen, um sortenreines Trennen im Rückbau zu garantieren.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* QNG Qualitätsstufen Schadstoffvermeidung (Dokument 313) */}
                  <div className="bg-white border border-home-grau/25 rounded-xl p-4 flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2">
                      <AlertTriangle size={14} className="text-amber-600" />
                      QNG-Schadstoffvermeidung: Qualitätsstufen (QS1-QS4) nach Steckbrief 313
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Neben den GWP-Grenzdaten ist die absolute **Schadstofffreiheit** das schärfste Ausschlusskriterium im QNG. Alle bauchemischen Produkte müssen in Qualitätsstufen eingeordnet werden:
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 mt-1">
                      {[
                        { 
                          stufe: 'QS 1', 
                          title: 'Gesetzlich konform', 
                          desc: 'Erfüllt das REACH-Minimum. Kaum förderfähig für anspruchsvolle Zertifikate.', 
                          style: 'bg-red-50 border-red-200 text-red-950 shadow-2xs' 
                        },
                        { 
                          stufe: 'QS 2', 
                          title: 'Standard-Qualität', 
                          desc: 'Grundlegende Schadstoffreduzierung, z.B. lösemittelarme Dispersionsklebstoffe.', 
                          style: 'bg-amber-50 border-amber-100 text-amber-950 shadow-2xs' 
                        },
                        { 
                          stufe: 'QS 3', 
                          title: 'Erhöhte Qualität', 
                          desc: 'Sehr emissionsarme Produkte, z.B. weichmacherfreie Innenfarben.', 
                          style: 'bg-blue-50 border-blue-150 text-blue-950 shadow-2xs' 
                        },
                        { 
                          stufe: 'QS 4', 
                          title: 'Spitzen-Qualität', 
                          desc: 'Lösemittel- und weichmacherfrei (z.B. Blauer Engel oder EMICODE EC1 Plus).', 
                          style: 'bg-emerald-50 border-emerald-150 text-emerald-950 font-semibold shadow-2xs' 
                        }
                      ].map((item, idx) => (
                        <div key={idx} className={`p-2.5 rounded-lg border flex flex-col gap-1 ${item.style}`}>
                          <strong className="text-[11px] uppercase tracking-wider block font-bold">{item.stufe}</strong>
                          <span className="text-[9px] font-bold block leading-tight">{item.title}</span>
                          <p className="text-[9px] text-slate-600 mt-1 leading-normal font-normal">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {activeStep === 5 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-200">
                  <div className="border-b border-home-grau/25 pb-3">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Anhang 1</span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      Durchgerechnete Praxisbeispiele &amp; Variantenstudien
                    </h3>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Das theoretische Wissen wird durch die nachfolgenden, vollständig gelösten Berechnungsbeispiele veranschaulicht. Diese orientieren sich an realen Projektunterlagen und den QNG/BBSR-Zertifizierungsregeln.
                  </p>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-1.5">
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">BSP 1</span>
                      Außenwandvergleich: Massivbau vs. Holzständerwand
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Aufgabe: Vergleich zweier Standard-Außenwandkonstruktionen für die funktionelle Einheit: <strong>1 m² Außenwand, U ≈ 0,20 W/(m²·K) über 50 Jahre</strong>, Phasen A1–A3 (Herstellungsphase).
                    </p>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {/* Variante 1 */}
                      <div className="border border-stone-200 rounded-xl overflow-hidden shadow-3xs bg-white">
                        <div className="bg-off-white border-b border-home-grau/20 p-3">
                          <h5 className="text-xs font-bold font-mono text-text-main">Variante 1: Kalksandstein + WDVS (EPS)</h5>
                          <p className="text-[10px] text-text-main/70">Schwerer Massivbau mit hervorragender Schallisolierung.</p>
                        </div>
                        <div className="p-3 overflow-x-auto">
                          <table className="w-full text-left text-[11px] border-collapse min-w-[320px]">
                            <thead>
                              <tr className="border-b border-stone-250 font-bold text-slate-700">
                                <th className="pb-1">Schicht</th>
                                <th className="pb-1 text-center">d [m]</th>
                                <th className="pb-1 text-right">Masse [kg/m²]</th>
                                <th className="pb-1 text-right">GWP-Fkt. [fossil]</th>
                                <th className="pb-1 text-right">GWP [kg CO₂]</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                              <tr className="hover:bg-slate-50/50">
                                <td className="py-1.5 font-medium">Innenputz (Gips)</td>
                                <td className="py-1.5 text-center font-mono">0,010</td>
                                <td className="py-1.5 text-right font-mono">10,0</td>
                                <td className="py-1.5 text-right font-mono">0,12</td>
                                <td className="py-1.5 text-right font-mono font-medium text-red-700">1,2</td>
                              </tr>
                              <tr className="hover:bg-slate-50/50">
                                <td className="py-1.5 font-medium">KS-Mauerwerk</td>
                                <td className="py-1.5 text-center font-mono">0,175</td>
                                <td className="py-1.5 text-right font-mono">315,0</td>
                                <td className="py-1.5 text-right font-mono">0,12</td>
                                <td className="py-1.5 text-right font-mono font-medium text-red-700">37,8</td>
                              </tr>
                              <tr className="hover:bg-slate-50/50">
                                <td className="py-1.5 font-medium">EPS-Dämmung 032</td>
                                <td className="py-1.5 text-center font-mono">0,160</td>
                                <td className="py-1.5 text-right font-mono">2,9</td>
                                <td className="py-1.5 text-right font-mono">3,50</td>
                                <td className="py-1.5 text-right font-mono font-medium text-red-700">10,1</td>
                              </tr>
                              <tr className="hover:bg-slate-50/50">
                                <td className="py-1.5 font-medium">Außenputz mineral.</td>
                                <td className="py-1.5 text-center font-mono">0,008</td>
                                <td className="py-1.5 text-right font-mono">12,8</td>
                                <td className="py-1.5 text-right font-mono">0,20</td>
                                <td className="py-1.5 text-right font-mono font-medium text-red-700">2,6</td>
                              </tr>
                              <tr className="font-bold bg-slate-50 text-slate-900 text-xs">
                                <td className="py-2 pl-1">Summe A1–A3</td>
                                <td className="py-2 text-center">-</td>
                                <td className="py-2 text-right font-mono">≈ 341 kg/m²</td>
                                <td className="py-2 text-right">-</td>
                                <td className="py-2 text-right font-mono text-red-800">51,7 kg/m²</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Variante 2 */}
                      <div className="border border-stone-200 rounded-xl overflow-hidden shadow-3xs bg-white">
                        <div className="bg-off-white border-b border-home-grau/20 p-3">
                          <h5 className="text-xs font-bold font-mono text-text-main">Variante 2: Holzständerwand, zellulosegedämmt</h5>
                          <p className="text-[10px] text-text-main/70">Biobasierte Leichtbauwand mit biogener Kohlenstoffspeicherung.</p>
                        </div>
                        <div className="p-3 overflow-x-auto">
                          <table className="w-full text-left text-[11px] border-collapse min-w-[320px]">
                            <thead>
                              <tr className="border-b border-stone-250 font-bold text-slate-700">
                                <th className="pb-1">Schicht</th>
                                <th className="pb-1 text-right">Masse [kg/m²]</th>
                                <th className="pb-1 text-right">GWP-fossil</th>
                                <th className="pb-1 text-right">GWP-biogen</th>
                                <th className="pb-1 text-right">GWP-total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                              <tr className="hover:bg-slate-50/50">
                                <td className="py-1.5 font-medium">GK-Platte 12,5 mm</td>
                                <td className="py-1.5 text-right font-mono">10,0</td>
                                <td className="py-1.5 text-right font-mono text-red-600">2,0</td>
                                <td className="py-1.5 text-right font-mono text-teal-600">≈ 0</td>
                                <td className="py-1.5 text-right font-mono">+2,0</td>
                              </tr>
                              <tr className="hover:bg-slate-50/50">
                                <td className="py-1.5 font-medium">Konstruktionsholz (ant.)</td>
                                <td className="py-1.5 text-right font-mono">12,0</td>
                                <td className="py-1.5 text-right font-mono text-red-600">1,5</td>
                                <td className="py-1.5 text-right font-mono text-teal-600">-19,8</td>
                                <td className="py-1.5 text-right font-mono text-teal-800">-18,3</td>
                              </tr>
                              <tr className="hover:bg-slate-50/50">
                                <td className="py-1.5 font-medium">Zellulose-Einblasdämm.</td>
                                <td className="py-1.5 text-right font-mono">11,0</td>
                                <td className="py-1.5 text-right font-mono text-red-600">0,8</td>
                                <td className="py-1.5 text-right font-mono text-teal-600">-13,2</td>
                                <td className="py-1.5 text-right font-mono text-teal-800">-12,4</td>
                              </tr>
                              <tr className="hover:bg-slate-50/50">
                                <td className="py-1.5 font-medium">Holzfaserplatte 16 mm</td>
                                <td className="py-1.5 text-right font-mono">9,0</td>
                                <td className="py-1.5 text-right font-mono text-red-600">1,6</td>
                                <td className="py-1.5 text-right font-mono text-teal-600">-14,9</td>
                                <td className="py-1.5 text-right font-mono text-teal-800">-13,3</td>
                              </tr>
                              <tr className="hover:bg-slate-50/50">
                                <td className="py-1.5 font-medium">Außenputz mineral.</td>
                                <td className="py-1.5 text-right font-mono">12,8</td>
                                <td className="py-1.5 text-right font-mono text-red-600">2,6</td>
                                <td className="py-1.5 text-right font-mono text-teal-600">≈ 0</td>
                                <td className="py-1.5 text-right font-mono">+2,6</td>
                              </tr>
                              <tr className="font-bold bg-emerald-50 text-emerald-950 text-xs">
                                <td className="py-2 pl-1">Summe A1–A3</td>
                                <td className="py-2 text-right font-mono">≈ 55 kg/m²</td>
                                <td className="py-2 text-right font-mono text-red-700">8,5 kg/m²</td>
                                <td className="py-2 text-right font-mono text-teal-700">-47,9 kg/m²</td>
                                <td className="py-2 text-right font-mono text-emerald-800">-39,4 kg/m²</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50/30 p-4 border border-emerald-100 rounded-xl flex items-start gap-3 mt-2">
                      <Sparkles className="text-emerald-700 shrink-0 mt-0.5" size={16} />
                      <div className="text-[11px] text-emerald-950 leading-relaxed">
                        <strong className="block font-bold mb-1">Interpretation (Wichtiger als nackte Zahlen!):</strong>
                        <ol className="list-decimal pl-4 space-y-1">
                          <li><strong>A1-A3 Bilanz:</strong> Variante 2 erscheint mit ≈ -39 kg CO₂-Äq./m² (GWP-total) drastisch besser als Variante 1 (51,7 kg CO₂-Äq./m²).</li>
                          <li><strong>Aber (Cradle-to-Grave):</strong> Der biogene Kohlenstoff (-47,9 kg CO₂-Äq./m²) wird am Lebensende (Modul C3, thermische Verwertung) als CO₂ wieder freigesetzt. Die Treibhausgase schmälern den Vorsprung im Gesamten, wenngleich Variante 2 ökologisch überlegen bleibt.</li>
                          <li><strong>Masseunterschied:</strong> 55 kg vs. 341 kg/m² entlastet Fundamente und Transportaufwände (A4/C1).</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-stone-100">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-1.5">
                      <span className="px-1.5 py-0.5 bg-sky-100 text-sky-800 rounded font-bold text-[10px]">BSP 2</span>
                      Vereinfachte Gebäudeökobilanz (QNG-Nachweis)
                    </h4>
                    <p className="text-[11px] text-slate-650 leading-relaxed">
                      <strong>Objekt:</strong> fiktives Mehrfamilienhaus „MFH Augsburg-Nord" &bull; 4 Geschosse, Massivbau, <strong>Netto-Raumfläche NRF = 1.200 m²</strong>, EH-40-Standard, Wärmepumpe, Betrachtungszeitraum 50 Jahre.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-2">
                      <div className="bg-slate-50 border border-stone-200 p-3.5 rounded-xl">
                        <strong className="text-xs text-slate-900 block font-bold mb-1">Schritt A: Konstruktion (A1-A3 + C3/C4)</strong>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Mengenermittlung ergibt als Summe über alle Bauteile (KG 300 + 400 Pauschale):
                        </p>
                        <div className="mt-2 text-[11px] font-mono space-y-1 border-t border-slate-200 pt-1.5">
                          <div>KG 300 Bauteile: 540 t CO₂-Äq.</div>
                          <div>KG 400 Anlagentechnik: 70 t CO₂-Äq.</div>
                          <div>C3/C4 Entsorgung: 95 t CO₂-Äq.</div>
                          <div className="font-bold border-t border-slate-200 pt-1 mt-1 text-slate-900">
                            Summe: 705 t CO₂ = 11,75 kg CO₂/(m²·a)
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-stone-200 p-3.5 rounded-xl">
                        <strong className="text-xs text-slate-900 block font-bold mb-1">Schritt B: Ersatz (B4)</strong>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Bauteile mit einer Nutzungsdauer &lt; 50 a (Fenster, Putze, Bodenbeläge etc.) müssen im Betrachtungszeitraum saniert oder getauscht werden:
                        </p>
                        <div className="mt-4 text-[11px] font-mono text-slate-900 font-bold border-t border-slate-200 pt-1.5">
                          Ersatzaufwand (50 Jahre): 180 t CO₂-Äq.
                          <div className="font-mono text-slate-500 font-normal pt-1">
                            → 180.000 / (1200 m² * 50 a) =
                          </div>
                          <div className="text-shiraz">3,00 kg CO₂-eq/(m²·a)</div>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-stone-200 p-3.5 rounded-xl">
                        <strong className="text-xs text-slate-900 block font-bold mb-1">Schritt C: Betrieb (B6)</strong>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Endenergie Strom (Heizung, Warmwasser, Hilfsstrom) aus GEG-Berechnung: 18 kWh/(m²NRF·a). Emissionsfaktor Strommix (50 a gewichtet sinkend): 0,43 kg CO₂-Äq./kWh.
                        </p>
                        <div className="mt-2 text-[11px] font-mono text-slate-900 font-bold border-t border-slate-200 pt-1.5">
                          Stromverbrauch (B6):
                          <div className="font-mono text-slate-500 font-normal pt-1">
                            → 18 kWh/m²a * 0,43 kg/kWh =
                          </div>
                          <div className="text-shiraz">7,74 kg CO₂-eq/(m²·a)</div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-stone-200 rounded-xl overflow-hidden mt-3 max-w-2xl mx-auto shadow-2xs">
                      <div className="bg-slate-100 p-2.5 border-b border-stone-200 text-xs font-bold text-slate-800">
                        Schritt D: Gesamtergebnis &amp; QNG-Zertifikatsbewertung
                      </div>
                      <div className="p-3 bg-white space-y-3">
                        <div className="grid grid-cols-3 text-xs border-b border-stone-100 pb-1.5 text-slate-500 font-bold">
                          <div>Lebenszyklus-Anteil</div>
                          <div className="text-center font-bold">kg CO₂-Äq./(m²NRF·a)</div>
                          <div className="text-right font-bold font-mono">Prozentualer Anteil</div>
                        </div>
                        <div className="grid grid-cols-3 text-xs py-0.5 text-slate-800">
                          <div>Herstellung + Entsorgung (A1-A3, C3-C4)</div>
                          <div className="text-center font-mono font-medium">11,75</div>
                          <div className="text-right font-mono text-slate-500">52 %</div>
                        </div>
                        <div className="grid grid-cols-3 text-xs py-0.5 text-slate-800">
                          <div>Ersatzzyklus (B4)</div>
                          <div className="text-center font-mono font-medium">3,00</div>
                          <div className="text-right font-mono text-slate-500">13 %</div>
                        </div>
                        <div className="grid grid-cols-3 text-xs py-0.5 text-slate-800">
                          <div>Anlagen-Betrieb (B6)</div>
                          <div className="text-center font-mono font-medium">7,75</div>
                          <div className="text-right font-mono text-slate-500 font-semibold">34 %</div>
                        </div>
                        <div className="grid grid-cols-3 text-xs font-bold pt-2 border-t border-stone-250 text-slate-900 bg-slate-50 -mx-3 -mb-3 p-3">
                          <div>Lehr-Gesamtergebnis</div>
                          <div className="text-center font-mono text-shiraz">22,50 kg/m²a</div>
                          <div className="text-right">100 %</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-indigo-50/50 border border-indigo-150 rounded-xl flex items-start gap-3">
                      <CheckCircle className="text-indigo-700 shrink-0 mt-0.5" size={16} />
                      <div className="text-[11px] text-indigo-950 leading-relaxed">
                        <strong className="block font-bold">QNG-Plus/Premium Bewertung:</strong>
                        Der Wert von <strong>22,50 kg CO₂-eq/(m²·a)</strong> liegt unter dem QNG-Plus Grenzwert von <strong>≤ 24 kg</strong>. Das Qualitätssiegel **QNG-Plus** wird somit im GWP-Kriterium erfolgreich bestanden! Um QNG-Premium (≤ 20 kg) zu ergattern, sind weitere Schichtenoptimierungen notwendig (z.B. klinkerreduzierter Zementeinsatz, stärkere Integration von Holzkonstruktionen in Außenwand/Dach).
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 6 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-200">
                  <div className="border-b border-home-grau/25 pb-3">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Anhang 2</span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      Checklisten &amp; Klausurklassiker (Fehlerprävention)
                    </h3>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Studienerfolge hängen meist davon ab, systematische Ungenauigkeiten auszuschließen. Verwenden Sie diese interaktiven Checklisten für Ihre Seminar- und Klausurausarbeitungen.
                  </p>

                  <div className="space-y-3.5">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-stone-100 pb-1.5">
                      ✓ Checkliste Produktökobilanz / EPD-Nutzung
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {[
                        { id: 'epd_1', text: 'Deklarierte Einheit exakt notiert und auf Projektbezug umgerechnet (1 kg ≠ 1 m³ ≠ 1 m²)' },
                        { id: 'epd_2', text: 'Normfassung prüfen (EN 15804+A1 und +A2 nicht vermischen!)' },
                        { id: 'epd_3', text: 'Datensatztyp (spezifisch vs. repräsentativ) und Bezugsjahr im Beiblatt dokumentieren' },
                        { id: 'epd_4', text: 'GWP-fossil und GWP-biogenic getrennt ausgewiesen und bilanziert (unfreiwilliges Greenwashing vermieden)' },
                        { id: 'epd_5', text: 'Szenarien (Transportdistanzen A4, Nutzungsdauer RSL, EoL C/D) auf Projektpassung geprüft' },
                        { id: 'epd_6', text: 'Nutzeffekt Modul D streng getrennt ausgewiesen und nicht unzulässig in Summen A-C eingerechnet' }
                      ].map((item) => (
                        <label 
                          key={item.id} 
                          className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all select-none ${
                            checklistState[item.id] 
                              ? 'bg-emerald-50/40 border-emerald-300 text-slate-800' 
                              : 'bg-slate-50/50 border-stone-200/80 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={!!checklistState[item.id]} 
                            onChange={() => setChecklistState(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                            className="mt-1 accent-emerald-600 rounded shadow-inner"
                          />
                          <span className="text-[11px] leading-relaxed font-medium">{item.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3.5 pt-4 border-t border-stone-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-stone-100 pb-1.5">
                      ✓ Checkliste Gebäudeökobilanz (QNG)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {[
                        { id: 'qng_1', text: 'Grundflächenbezug: Netto-Raumfläche NRF(R) nach DIN 277:2021-08 ermittelt (Nicht NGF oder Wohnfläche!)' },
                        { id: 'qng_2', text: 'Betrachtungszeitraum einheitlich auf 50 Jahre festgesetzt' },
                        { id: 'qng_3', text: 'Lebenszyklusmodule A1-A3, B4, B6, C3, C4 und D getrennt bilanziert' },
                        { id: 'qng_4', text: 'Mengengerüst vollständig: Kostengruppe 300 (Bauwerk) u. Kostengruppe 400 (Haustechnik Pauschale) nach DIN 276 erfasst' },
                        { id: 'qng_5', text: 'ÖKOBAUDAT-Datensätze regelkonform gewählt und deren UUID-Kennungen dokumentiert' },
                        { id: 'qng_6', text: 'Nutzungsdauern (RSL) nach BBSR-Tabelle richtig eingepflegt und Ersatzzyklen für B4 kalkuliert' },
                        { id: 'qng_7', text: 'Betrieblicher Energiebedarf (B6) exakt aus GEG-Zertifikat (DIN V 18599) überführt' },
                        { id: 'qng_8', text: 'Das errechnete CO₂-Gesamtergebnis plausibilisiert (Zahlenwerte kg/m²a mit Benchmarks abgeglichen)' }
                      ].map((item) => (
                        <label 
                          key={item.id} 
                          className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all select-none ${
                            checklistState[item.id] 
                              ? 'bg-emerald-50/40 border-emerald-300 text-slate-800' 
                              : 'bg-slate-50/50 border-stone-200/80 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={!!checklistState[item.id]} 
                            onChange={() => setChecklistState(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                            className="mt-1 accent-emerald-600 rounded shadow-inner"
                          />
                          <span className="text-[11px] leading-relaxed font-medium">{item.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-stone-100">
                    <h4 className="text-xs font-bold text-red-950 uppercase tracking-widest flex items-center gap-1.5">
                      <AlertTriangle size={15} className="text-red-700" /> DIE 12 HÄUFIGSTEN FEHLEINGABEN (PRAXISKREISE &amp; EXAMEN)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {[
                        { 
                          no: '1', 
                          title: 'Datensätze mischen', 
                          err: 'Datensätze der Normversionen EN 15804+A1 und +A2 werden fälschlich addiert.', 
                          sol: 'GWP-Indikatoren sind nicht deckungsgleich. Niemals Datensätze unterschiedlicher Normgenerationen mischen.' 
                        },
                        { 
                          no: '2', 
                          title: 'Falsche Bezugsfläche', 
                          err: 'Nutzung der Netto-Grundfläche (NGF) oder Reinen Wohnfläche als Basis.', 
                          sol: 'Das QNG verlangt die Netto-Raumfläche NRF(R) nach DIN 277:2021-08.' 
                        },
                        { 
                          no: '3', 
                          title: 'Einheitenfehler', 
                          err: 'GWP-Faktoren (kg CO2-eq/kg) werden direkt mit Bauteilvolumen (m³) multipliziert, ohne die Rohdichte einzurechnen.', 
                          sol: 'Stets den Dichteabgleich durchführen: Masse = Volumen * Rohdichte.' 
                        },
                        { 
                          no: '4', 
                          title: 'Einberechnen des Moduls D', 
                          err: 'Ökologische Recycling-Gutschriften (Modul D) werden in die GWP-Gesamtsumme A-C hineingerechnet.', 
                          sol: 'Gutschriften außerhalb der Systemgrenzen müssen als separater Posten deklariert werden!' 
                        },
                        { 
                          no: '5', 
                          title: 'Biogenen Kohlenstoff ignorieren', 
                          err: 'Vergleich von Holzbaustoffen rein im Modul A1-A3, ohne die Freisetzung im Modul C3/C4 zu bilanzieren.', 
                          sol: 'Holz bindet CO₂ im Wachstum (A1-A3 negativ), gibt dieses aber bei Verbrennung/EoL (C3) wieder frei (Netto-Effekt ≈ 0).' 
                        },
                        { 
                          no: '6', 
                          title: 'Instandhaltung (B4) vergessen', 
                          err: 'Dichtungsschichten, Verputze oder mechanische Klimateile werden mit 50 Jahren Lebensdauer fehlerfrei durchgeschleust.', 
                          sol: 'Nutzeffekt-Intervalle nach BBSR-Tabelle abbilden (z.B. Heizkessel RSL 20 a, d.h. 1,5-facher Austausch nötig).' 
                        },
                        { 
                          no: '7', 
                          title: 'Ungleiche funktionale Einheit', 
                          err: 'Konkurrierende Tragwerkswände (Beton vs. Holz) werden ohne denselben Schall- und Brandschutzeffekt berechnet.', 
                          sol: 'Niemals reine Stoffmengen vergleichen, sondern gleichwertige bauphysikalische Gesamtbauteile!' 
                        },
                        { 
                          no: '8', 
                          title: 'Veraltete Datenbestände', 
                          err: 'Nutzung nicht regelkonform, veralteter ÖKOBAUDAT-Uraltversionen für neue Nachweise.', 
                          sol: 'Nutzen Sie für QNG-konforme Audits immer die aktuell freigegebene BBSR-Rechenwert-Generiktabelle.' 
                        },
                        { 
                          no: '9', 
                          title: 'Kategorien aufaddieren', 
                          err: 'Wirkungswerte verschiedener Wirkungskategorien (z.B. kg CO₂-eq + kg SO₂-eq) werden zu einem einzigen Gesamtwert aufsummiert.', 
                          sol: 'Es ist physikalisch unmöglich und methodisch unzulässig, unterschiedliche Umweltwirkungen zu addieren.' 
                        },
                        { 
                          no: '10', 
                          title: 'Unvollständige Mengenermittlung', 
                          err: 'Fehlende Erfassung der Technischen Anlagen (Kostengruppe 400) oder doppelte Bilanzierung von Putzen.', 
                          sol: 'Sicherstellen, dass alle Konstruktionsbereiche nach DIN 276 vollständig und überschneidungsfrei vorliegen.' 
                        },
                        { 
                          no: '11', 
                          title: 'EPD-Szenarien blind übernehmen', 
                          err: 'Spezifische Hersteller-EPD-Transportdistanzen ungeprüft in die Gebäudeermittlung einrechnen.', 
                          sol: 'Die Standardvorgaben des QNG-Handbuchs (z.B. Pauschalen für Transportdistanzen) müssen vorrangig genutzt werden.' 
                        },
                        { 
                          no: '12', 
                          title: 'Scheingenauigkeit', 
                          err: 'Ergebnisdeklarationen mit 3 bis 4 Nachkommastellen bei einer inhärenten Datenunsicherheit von ±30 %.', 
                          sol: 'Runden Sie Ihre Endergebnisse sinngemäß auf eine Nachkommastelle, um eine realistische Präzision zu suggerieren.' 
                        }
                      ].map((item) => (
                        <div key={item.no} className="bg-slate-50/50 p-4 rounded-xl border border-stone-200 flex gap-3">
                          <span className="w-6 h-6 bg-red-100 border border-red-250 text-red-800 font-bold font-mono text-xs rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            {item.no}
                          </span>
                          <div className="space-y-1">
                            <strong className="text-xs font-bold text-slate-900 block">{item.title}</strong>
                            <div className="text-[10px] text-red-950 font-medium leading-relaxed bg-red-50/30 p-1.5 rounded border border-red-100">
                              <span className="font-bold">Typischer Fehler:</span> {item.err}
                            </div>
                            <div className="text-[10px] text-emerald-955 font-medium leading-relaxed bg-emerald-50/30 p-1.5 rounded border border-emerald-100">
                              <span className="font-bold">Richtige Lösung:</span> {item.sol}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 7 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-200">
                  <div className="border-b border-home-grau/25 pb-3">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Anhang 3</span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      Klausurrelevante Übungsaufgaben mit Musterlösungen
                    </h3>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Testen Sie Ihr rechnerisches und begriffliches Geschick mit den typischen Vorlesungs- und Klausuraufgaben. Klicken Sie auf „Lösungsweg einblenden", um die akademischen Berechnungen nachzuvollziehen.
                  </p>

                  <div className="space-y-5">
                    {/* Aufgabe 1 */}
                    <div className="bg-slate-50/50 p-5 rounded-xl border border-stone-200/80">
                      <div className="flex gap-2.5 items-start">
                        <span className="px-2 py-0.5 bg-shiraz/10 text-shiraz border border-shiraz/20 font-bold font-mono text-[10px] rounded uppercase mt-0.5">A 1</span>
                        <div className="space-y-0.5">
                          <strong className="text-slate-900 text-xs font-bold block">Unterschied deklarierte vs. funktionelle Einheit</strong>
                          <p className="text-[11px] text-slate-700 leading-relaxed pt-1">
                            Erläutern Sie den fachlichen Unterschied zwischen einer deklarierten Einheit und einer funktionalen Einheit an je einem präzisen Beispiel aus dem Betonbau.
                          </p>
                        </div>
                      </div>
                      
                      <details className="mt-3 ml-7 group">
                        <summary className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider cursor-pointer list-none flex items-center gap-1.5 select-none hover:text-emerald-800">
                          <span className="group-open:hidden">✚ Lösungsweg einblenden</span>
                          <span className="hidden group-open:inline">➖ Lösungsweg ausblenden</span>
                        </summary>
                        <div className="mt-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-150 animate-in slide-in-from-top-1 duration-150 text-[11px] text-emerald-950 leading-relaxed font-medium space-y-2">
                          <div>
                            <span className="font-bold underline">Deklarierte Einheit:</span> Bezugsgröße einer EPD auf reiner Produktebene ohne definierte baukonstruktive Funktion.
                            <br />
                            <strong>Beispiel:</strong> 1 m³ Transportbeton C25/30 oder 1 kg Baustahl B500B. Dies reicht nicht für Bauteilvergleiche, da Bauteilhauptstärken (statische Erfordernisse) unberücksichtigt bleiben.
                          </div>
                          <div>
                            <span className="font-bold underline">Funktionelle Einheit:</span> Legt konkrete Funktion mit bauphysikalischen Leistungswerten und der Nutzungsdauer für ein fertiges Bauteil fest.
                            <br />
                            <strong>Beispiel:</strong> 1 m² Deckenfeld im Innenbereich (Spannweite l = 5 m, Verkehrslast = 2,7 kN/m², Nutzungsdauer = 50 Jahre). Ein solcher funktioneller Bezug ermöglicht erst den vergleichenden ökologischen Nachweis zwischen einer Stahlbeton- und einer Holz-Rippendecke!
                          </div>
                        </div>
                      </details>
                    </div>

                    {/* Aufgabe 2 */}
                    <div className="bg-slate-50/50 p-5 rounded-xl border border-stone-200/80">
                      <div className="flex gap-2.5 items-start">
                        <span className="px-2 py-0.5 bg-shiraz/10 text-shiraz border border-shiraz/20 font-bold font-mono text-[10px] rounded uppercase mt-0.5">A 2</span>
                        <div className="space-y-0.5">
                          <strong className="text-slate-900 text-xs font-bold block">Modul-Zuordnung im Gebäudelebenszyklus</strong>
                          <p className="text-[11px] text-slate-700 leading-relaxed pt-1">
                            Ordnen Sie die folgenden baulichen Prozesse den korrekten Lebenszyklusmodulen gemäß DIN EN 15978 zu:
                            <br />
                            <em>Austausch der Holzfenster nach 40 Jahren / Kraftstoffverbrauch eines Abbruchbaggers / Heizwärmebedarf / Carbonatisierung von Konstruktionsbeton / Schrottgutschrift für recycelten Baustahl.</em>
                          </p>
                        </div>
                      </div>
                      
                      <details className="mt-3 ml-7 group">
                        <summary className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider cursor-pointer list-none flex items-center gap-1.5 select-none hover:text-emerald-800">
                          <span className="group-open:hidden">✚ Lösungsweg einblenden</span>
                          <span className="hidden group-open:inline">➖ Lösungsweg ausblenden</span>
                        </summary>
                        <div className="mt-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-150 animate-in slide-in-from-top-1 duration-150 text-[11px] text-emerald-950 leading-relaxed font-semibold space-y-1 font-mono">
                          <div>&bull; Austausch der Holzfenster nach 40 Jahren &rarr; <strong>Modul B4 (Ersatz / Sanierung)</strong></div>
                          <div>&bull; Kraftstoffverbrauch des Baggers im Abbruch &rarr; <strong>Modul C1 (Rückbau)</strong></div>
                          <div>&bull; Jährlicher Heizwärmebedarf der Nutzer &rarr; <strong>Modul B6 (Betriebsenergie)</strong></div>
                          <div>&bull; CO₂-Bindung durch Carbonatisierung von Beton &rarr; <strong>Modul B1 (Nutzungsphase)</strong></div>
                          <div>&bull; Gutschrift für verwertbaren Bewehrungsstahlschrott &rarr; <strong>Modul D (Recycling / Gutschriften)</strong></div>
                        </div>
                      </details>
                    </div>

                    {/* Aufgabe 3 */}
                    <div className="bg-slate-50/50 p-5 rounded-xl border border-stone-200/80">
                      <div className="flex gap-2.5 items-start">
                        <span className="px-2 py-0.5 bg-shiraz/10 text-shiraz border border-shiraz/20 font-bold font-mono text-[10px] rounded uppercase mt-0.5">A 3</span>
                        <div className="space-y-0.5">
                          <strong className="text-slate-900 text-xs font-bold block">Rechnerische GWP-Massenbilanz einer Stahlbetondecke</strong>
                          <p className="text-[11px] text-slate-700 leading-relaxed pt-1">
                            Gegeben ist eine tragende Stahlbetondeckenplatte mit einer Dicke von <strong>d = 22 cm</strong>, einer Rohdichte von <strong>&rho; = 2.500 kg/m³</strong> und einem normativ festgelegten Bewehrungsgehalt von <strong>100 kg Baustahl pro Kubikmeter</strong> Gesamtbetonvolumen.
                            Die spezifischen GWP-Herstellungsfaktoren (Phasen A1–A3, fiktiv) lauten:
                            <br />
                            &bull; GWP-Beton: <strong>0,10 kg CO₂-eq/kg</strong> &bull; GWP-Bewehrungsstahl: <strong>0,75 kg CO₂-eq/kg</strong>.
                            <br />
                            Berechnen Sie das Gesamt-Herstellungs-Treibhauspotenzial (GWP) dieser Platte bezogen auf <strong>1 m² Deckenfläche</strong>.
                          </p>
                        </div>
                      </div>
                      
                      <details className="mt-3 ml-7 group">
                        <summary className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider cursor-pointer list-none flex items-center gap-1.5 select-none hover:text-emerald-800">
                          <span className="group-open:hidden">✚ Lösungsweg einblenden</span>
                          <span className="hidden group-open:inline">➖ Lösungsweg ausblenden</span>
                        </summary>
                        <div className="mt-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-150 animate-in slide-in-from-top-1 duration-150 text-[11px] text-emerald-950 leading-relaxed font-medium space-y-3.5">
                          <div>
                            <strong className="font-bold underline block mb-1">Detaillierte Rechenschritt-Akkumulation:</strong>
                            
                            <div className="space-y-2">
                              <div>
                                <span className="font-bold">1. Volumen der Deckenplatte pro m² Fläche:</span>
                                <div className="p-2 bg-white rounded border border-stone-200 mt-1 font-mono">
                                  V = d * A = 0,22 m * 1 m² = 0,22 m³ Beton/m²
                                </div>
                              </div>

                              <div>
                                <span className="font-bold">2. Masse des reinen Betonanteils pro m²:</span>
                                <div className="p-2 bg-white rounded border border-stone-200 mt-1 font-mono">
                                  Masse_Beton = 0,22 m³ * 2500 kg/m³ = 550 kg Beton/m²
                                </div>
                              </div>

                              <div>
                                <span className="font-bold">3. GWP des Betonanteils pro m²:</span>
                                <div className="p-2 bg-white rounded border border-stone-200 mt-1 font-mono text-red-800">
                                  GWP_Beton = 550 kg * 0,10 kg CO₂-eq/kg = 55,00 kg CO₂-eq/m²
                                </div>
                              </div>

                              <div>
                                <span className="font-bold">4. Masse des Bewehrungsstahls pro m²:</span>
                                <div className="p-2 bg-white rounded border border-stone-200 mt-1 font-mono">
                                  Masse_Stahl = 0,22 m³ Beton * 100 kg Stahl/m³ Beton = 22 kg Stahl/m²
                                </div>
                              </div>

                              <div>
                                <span className="font-bold">5. GWP des Stahlanteils pro m²:</span>
                                <div className="p-2 bg-white rounded border border-stone-200 mt-1 font-mono text-red-800">
                                  GWP_Stahl = 22 kg * 0,75 kg CO₂-eq/kg = 16,50 kg CO₂-eq/m²
                                </div>
                              </div>

                              <div>
                                <span className="font-bold">6. Summation zum Gesamt-Bauteilwert:</span>
                                <div className="p-2 bg-emerald-100/50 rounded border border-emerald-300 mt-1 font-mono font-bold text-emerald-950 text-xs">
                                  GWP_Gesamt = GWP_Beton + GWP_Stahl = 55,00 + 16,50 = 71,50 kg CO₂-eq pro m² Decke
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>

                    {/* Aufgabe 4 */}
                    <div className="bg-slate-50/50 p-5 rounded-xl border border-stone-200/80">
                      <div className="flex gap-2.5 items-start">
                        <span className="px-2 py-0.5 bg-slate-905 text-white font-bold font-mono text-[10px] rounded uppercase mt-0.5" style={{ backgroundColor: '#1e293b' }}>A 4</span>
                        <div className="space-y-0.5">
                          <strong className="text-slate-900 text-xs font-bold block">LCA-Transfer &amp; Reduzierung von GWP-Grenzwerten</strong>
                          <p className="text-[11px] text-slate-700 leading-relaxed pt-1">
                            Der berechnete Lebenszyklus-Treibhauswert eines Entwurfs liegt bei <strong>26,0 kg CO₂-eq/(m² NRF·a)</strong>. Der Bauherr fordert das staatliche QNG-PLUS-Siegel (≤ 24 kg), um Fördergelder zu sichern.
                            Nennen Sie drei konkrete baubegleitende Optimierungsmaßnahmen, begründen Sie deren GWP-Kompensationseffekt, und ordnen Sie diese den jeweiligen Lebenszyklusmodulen zu.
                          </p>
                        </div>
                      </div>
                      
                      <details className="mt-3 ml-7 group">
                        <summary className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider cursor-pointer list-none flex items-center gap-1.5 select-none hover:text-emerald-800">
                          <span className="group-open:hidden">✚ Lösungsweg einblenden</span>
                          <span className="hidden group-open:inline">➖ Lösungsweg ausblenden</span>
                        </summary>
                        <div className="mt-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-150 animate-in slide-in-from-top-1 duration-150 text-[11px] text-emerald-950 leading-relaxed font-medium space-y-2.5">
                          <ol className="list-decimal pl-4 space-y-2">
                            <li>
                              <strong>Austausch des Standardbetons (A1–A3):</strong> Verminderung des Klinkeranteils durch Substitution mit Hochofenzementen (z.B. Wechsel von CEM I auf CEM III/B). Dies verringert das herstellungsbedingte GWP der KG 300 im Schnitt um 35–45% und senkt den GWP-Gesamtwert um ca. 1,5 kg CO₂-eq/(m²·a).
                            </li>
                            <li>
                              <strong>Einplanung langlebiger Bauteilschichten (B4):</strong> Einbau eines robusten Klinker- oder Holzfaserputzverbunds mit einer BBSR-RSL von 50 Jahren statt Dichtbahnen, die nach 20 Jahren getauscht werden müssen. Dies drückt den Sanierungs-Ersatzwert im Modul B4.
                            </li>
                            <li>
                              <strong>Einbindung regenerativer Energiekomponenten (B6):</strong> Beheizung mittels einer modernen Sole-Wasser-Wärmepumpe in Kombination mit einer großflächigen Photovoltaikanlage. Der erzeugte regenerative Strom drückt den operativen Netzstrom-Anteil im Modul B6 drastisch (Einsparung von ca. 3–5 kg CO₂-eq/m²a).
                            </li>
                          </ol>
                        </div>
                      </details>
                    </div>

                    {/* Aufgabe 5 */}
                    <div className="bg-slate-50/50 p-5 rounded-xl border border-stone-200/80">
                      <div className="flex gap-2.5 items-start">
                        <span className="px-2 py-0.5 bg-slate-905 text-white font-bold font-mono text-[10px] rounded uppercase mt-0.5" style={{ backgroundColor: '#1e293b' }}>A 5</span>
                        <div className="space-y-0.5">
                          <strong className="text-slate-900 text-xs font-bold block">Kritisches Denken: Bewertung von Produktwerbung</strong>
                          <p className="text-[11px] text-slate-700 leading-relaxed pt-1">
                            Ein Dämmstoffhersteller bewirbt sein Produkt offensiv mit dem Slogan „klimapositiv laut EPD". 
                            Welche fünf kriteriengeleiteten Prüffragen müssen Sie als fachkundige Gutachterin oder fachkundiger Gutachter stellen, um diese Werbeaussage wissenschaftlich zu verifizieren?
                          </p>
                        </div>
                      </div>
                      
                      <details className="mt-3 ml-7 group">
                        <summary className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider cursor-pointer list-none flex items-center gap-1.5 select-none hover:text-emerald-800">
                          <span className="group-open:hidden">✚ Lösungsweg einblenden</span>
                          <span className="hidden group-open:inline">➖ Lösungsweg ausblenden</span>
                        </summary>
                        <div className="mt-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-150 animate-in slide-in-from-top-1 duration-150 text-[11px] text-emerald-950 leading-relaxed font-medium space-y-2.5">
                          <strong className="block font-bold mb-1">Kritisches Prüfgitter für die EPD-Analyse:</strong>
                          <ol className="list-decimal pl-4 space-y-1.5">
                            <li>
                              <strong>Modulumfang?</strong> Bezieht sich der negative Wert nur auf die Wiege-bis-Werkstor-Fassung (A1–A3, Cradle-to-Gate), wodurch die am Lebensende (End-of-Life) in Phase C3/C4 unweigerlich freigesetzten Thermikgase schlicht ausgeblendet wurden?
                            </li>
                            <li>
                              <strong>Biogener Trick?</strong> Wurde hier die biogene CO₂-Einspeicherung von Holz/Stoffen ungerechtfertigt als permanenter Entlastungseffekt deklariert (obwohl dieser biogene Vorbehalt physisch am Lebenszyklusende netto neutralisiert wird)?
                            </li>
                            <li>
                              <strong>Modul D unzulässig verrechnet?</strong> Wurden zukünftige theoretische Recyclinggutschriften aus dem Modul D rechtswidrig direkt vom Herstellungsaufwand (Mo. A) abgezogen, um eine künstliche GWP-Minussumme zu erzeugen?
                            </li>
                            <li>
                              <strong>Fehlende funktionelle Gleichwertigkeit?</strong> Deckt sich die funktionelle Leistung des Dämmstoffs (z.B. Druckfestigkeit, Wärmeleitgruppe, Brandklasse A1 vs. B2) mit jenen Produkten, die er im Planungsprozess substituieren soll?
                            </li>
                            <li>
                              <strong>Versteckte Transportlasten (A4/C2)?</strong> Wurden die Transportentfernungen so geschönt oder unterschlagen, dass die realen Logistik-GWP-Werte ungenannt bleiben?
                            </li>
                          </ol>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 8 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-200">
                  <div className="border-b border-home-grau/25 pb-3">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Anhang 4</span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      Öko-Datenbanken &amp; Nachweisportale (QNG, DGNB, IBU &amp; ÖKOBAUDAT)
                    </h3>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Die Durchführung präziser Produkt- und Gebäudeökobilanzen setzt den verlässlichen Zugriff auf validierte Stammdaten voraus. In Deutschland stützt sich die Nachweisführung für das staatliche <strong>QNG (Qualitätssiegel Nachhaltiges Gebäude)</strong> sowie für private Zertifizierungssysteme (wie <strong>DGNB</strong>) auf ein aufeinander abgestimmtes Geflecht aus herstellerunabhängigen Datenbanken und herstellerspezifischen EPD-Schnittstellen.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Database 1: ÖKOBAUDAT */}
                    <div className={`p-4 rounded-xl border transition-all flex flex-col gap-3 ${activeEcoDb === 'oekobaudat' ? 'bg-emerald-50/30 border-emerald-400' : 'bg-white border-stone-200 hover:bg-slate-50'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[9px] uppercase rounded">ÖKOBAUDAT (BBSR)</span>
                        <button onClick={() => setActiveEcoDb('oekobaudat')} className="text-[10px] text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                          Details ansehen <ArrowRight size={10} />
                        </button>
                      </div>
                      <strong className="text-xs font-bold text-slate-900">Bundesreferenzdatenbank für Ökobilanzierung</strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                        Die vom BBSR bereitgestellte Datenbank ist die gesetzlich vorgeschriebene Rechenwertbasis für alle BNB- und QNG-Gebäudebilanzierungen in Deutschland. Sie enthält verifizierte generische und produktspezifische Stoffdatensätze.
                      </p>
                      <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 font-sans leading-normal">
                        <li><strong>Identifikation:</strong> Jeder Baustoff besitzt eine eindeutige 32-gestellige <strong>UUID</strong>.</li>
                        <li><strong>Datenstruktur:</strong> XML-Formatierung nach dem internationalen <strong>ILCD+EPD-Standard</strong>.</li>
                        <li><strong>Normative Basis:</strong> Enthält LCA-Wirkungsindikatoren nach <strong>DIN EN 15804+A1 u. +A2</strong>.</li>
                      </ul>
                      <a href="https://www.oekobaudat.de" target="_blank" rel="noreferrer" className="text-[11px] text-teal-700 font-bold hover:underline flex items-center gap-1 self-start mt-1">
                        oekobaudat.de <ExternalLink size={11} />
                      </a>
                    </div>

                    {/* Database 2: DGNB Navigator */}
                    <div className={`p-4 rounded-xl border transition-all flex flex-col gap-3 ${activeEcoDb === 'dgnb' ? 'bg-emerald-50/30 border-emerald-400' : 'bg-white border-stone-200 hover:bg-slate-50'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold text-[9px] uppercase rounded">DGNB Navigator e.V.</span>
                        <button onClick={() => setActiveEcoDb('dgnb')} className="text-[10px] text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                          Details ansehen <ArrowRight size={10} />
                        </button>
                      </div>
                      <strong className="text-xs font-bold text-slate-900">Brücke zwischen EPDs &amp; Bewertungssystemen</strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                        Die Online-Plattform der Deutschen Gesellschaft für Nachhaltiges Bauen (DGNB) verbindet herstellerspezifische Kennwerte direkt mit den ökologischen, ökonomischen und gesundheitlichen Kriterien der DGNB-Zertifizierung.
                      </p>
                      <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 font-sans leading-normal">
                        <li><strong>DGNB Navigator Code:</strong> Einheitlicher Bezeichner zur automatisierten Eingabe in Auditierungs-Tools.</li>
                        <li><strong>Fokus Schadstofffreiheit:</strong> Deklariert direkt die Erfüllung der lokalen Umwelt-Risiken (QS4-Zulassung).</li>
                        <li><strong>Kreislauffähigkeit:</strong> Listet konkrete Rückbaufähigkeits- und Materialpässe (Circular Economy).</li>
                      </ul>
                      <a href="https://www.dgnb-navigator.de" target="_blank" rel="noreferrer" className="text-[11px] text-teal-700 font-bold hover:underline flex items-center gap-1 self-start mt-1">
                        dgnb-navigator.de <ExternalLink size={11} />
                      </a>
                    </div>

                    {/* Database 3: IBU.data / IBU e.V. */}
                    <div className={`p-4 rounded-xl border transition-all flex flex-col gap-3 ${activeEcoDb === 'ibu' ? 'bg-emerald-50/30 border-emerald-400' : 'bg-white border-stone-200 hover:bg-slate-50'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[9px] uppercase rounded">IBU.data (IBU e.V.)</span>
                        <button onClick={() => setActiveEcoDb('ibu')} className="text-[10px] text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                          Details ansehen <ArrowRight size={10} />
                        </button>
                      </div>
                      <strong className="text-xs font-bold text-slate-900">Das offizielle EPD-Herstellerportal</strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                        Das Institut Bauen und Umwelt e.V. (IBU) ist der führende EPD-Programmhalter in Deutschland. IBU.data ist das digitale Portal, das diese verifizierten Typ-III-Umweltdeklarationen maschinenlesbar im XML-Format bereitstellt.
                      </p>
                      <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 font-sans leading-normal">
                        <li><strong>PCR-Kontrolle:</strong> Gewährleistet einheitliche Produktbewertungsregeln (Part A und B).</li>
                        <li><strong>Datenfilter:</strong> Filterung nach spezifischen Baustoffen, Rohdichten und GWP-Faktoren.</li>
                        <li><strong>Vollständigkeit:</strong> Primäre EPDs enthalten Modul A1-A3, B1-B7, C1-C4 und D (Kreislaufpotenzial).</li>
                      </ul>
                      <a href="https://ibu-epd.com" target="_blank" rel="noreferrer" className="text-[11px] text-teal-700 font-bold hover:underline flex items-center gap-1 self-start mt-1">
                        ibu-epd.com <ExternalLink size={11} />
                      </a>
                    </div>

                    {/* Database 4: WECOBIS / LNID */}
                    <div className={`p-4 rounded-xl border transition-all flex flex-col gap-3 ${activeEcoDb === 'wecobis' ? 'bg-emerald-50/30 border-emerald-400' : 'bg-white border-stone-200 hover:bg-slate-50'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold text-[9px] uppercase rounded">WECOBIS (BBSR)</span>
                        <button onClick={() => setActiveEcoDb('wecobis')} className="text-[10px] text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                          Details ansehen <ArrowRight size={10} />
                        </button>
                      </div>
                      <strong className="text-xs font-bold text-slate-900">Ökologisches Produktinformationssystem</strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                        Gemeinsames Informationsportal des Bundes und der Bayerischen Architektenkammer zu bauökologischen Aspekten, Schadstoffemissionen (VOC) und Nachbehandlungen.
                      </p>
                      <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 font-sans leading-normal">
                        <li><strong>Interaktive Planungshilfen:</strong> Listet Vor- und Nachteile sowie VOC-Prüfkriterien strukturierter Stoffgruppen.</li>
                        <li><strong>QNG-Schnittstelle:</strong> Leitfaden zur Erlangung der Schadstoff-Qualitätsstufen QS3 und QS4.</li>
                        <li><strong>Lebenszyklus-Betrachtung:</strong> Beschreibt ökologische Relevanz von der Rohstoffgewinnung bis zur Deponie.</li>
                      </ul>
                      <a href="https://www.wecobis.de" target="_blank" rel="noreferrer" className="text-[11px] text-teal-700 font-bold hover:underline flex items-center gap-1 self-start mt-1">
                        wecobis.de <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>

                  {/* Dynamic scenario display based on active database click */}
                  <div className="bg-slate-50/60 p-5 rounded-2xl border border-home-grau/30 shadow-2xs space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-2 border-b border-stone-200 pb-2 animate-in fade-in">
                      <Compass size={14} className="text-shiraz" /> Interaktiver Praxis-Fahrplan zur gewählten Datenbank:
                    </h4>

                    {activeEcoDb === 'oekobaudat' && (
                      <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed animate-in fade-in duration-150">
                        <p>
                          <strong>Anwendungsfall in Arbeitsentwürfen (eLCA / BNB-Konformität):</strong>
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                          <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                            <span className="font-bold text-emerald-900 block font-mono">1. UUID-Mapping in BIM</span>
                            <p className="text-slate-500 leading-relaxed">
                              Um die Bauteilflächen einer Wand im 3D-BIM-Modell automatisch mit der ÖKOBAUDAT zu verknüpfen, liest eLCA die spezifische <strong>UUID</strong> aus. Beispiel-UUID für Kalksandstein: <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] font-mono text-purple-700">8d94e77d-7c25-4fc1-aee4-20b6697b0a8f</code>.
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                            <span className="font-bold text-emerald-900 block font-mono">2. Anrechnung QNG-Sicherheitszuschlag</span>
                            <p className="text-slate-500 leading-relaxed">
                              In der ÖKOBAUDAT können Sie nach <strong>generischen</strong> Datensätzen filtern. Achtung: Das QNG verlangt bei generischen Daten einen pauschalen **Sicherheitsaufschlag von +10 %** auf alle Wirkungskategorien, um Datenunsicherheiten abzufedern.
                            </p>
                          </div>
                        </div>
                        <div className="bg-emerald-50/20 border-l-4 border-emerald-500 p-3 rounded-r-lg text-[10.5px] text-emerald-950">
                          <span className="font-bold">Akademischer Nachweistipp:</span> Versuchen Sie stets, durch den Nachweis spezifischer Hersteller-EPDs (wie sie in IBU.data gelistet sind) die generischen Datensätze zu ersetzen. Dies mindert den rechnerischen GWP-Wert Ihres Gebäudes um signifikante Prozentpunkte und sichert somit leichter die KfW-KFN-Förderkredite!
                        </div>
                      </div>
                    )}

                    {activeEcoDb === 'dgnb' && (
                      <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed animate-in fade-in duration-150">
                        <p>
                          <strong>Anwendungsfall in Projekten (Zertifikatsbewertung nach System DGNB):</strong>
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                          <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                            <span className="font-bold text-emerald-950 block font-mono">1. Produktdeklarationen im Navigator</span>
                            <p className="text-slate-500 leading-relaxed font-sans">
                              Hersteller registrieren ihre Produkte im DGNB Navigator und erhalten eine spezifische Registrierungsnummer (z. B. <strong>DGNB-Code: AX85G2</strong>). Damit werden alle Nachhaltigkeitsdatenblätter für Auditoren direkt importierbar gemacht.
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                            <span className="font-bold text-emerald-950 block font-mono">2. Kriterium ENV 1.2 (Risiken lokale Umwelt)</span>
                            <p className="text-slate-500 leading-relaxed font-sans">
                              Der Navigator deklariert, in welche <strong>Qualitätsstufe</strong> (QS1 bis QS4) ein Bauteil im Bereich VOC, Halogene oder Schwermetalle einzuordnen ist. Dies ist unabdingbar für die soziokulturelle Punktebewertung.
                            </p>
                          </div>
                        </div>
                        <div className="bg-sky-50/20 border-l-4 border-sky-500 p-3 rounded-r-lg text-[10.5px] text-sky-950">
                          <span className="font-bold">Regelung für die Praxis:</span> Der DGNB Navigator verknüpft Ökobilanzierung und Bauchemie. Er stellt sicher, dass ein Baustoff im Betrieb frei von umweltgefährdenden Inhaltsstoffen bleibt und fordert im Rahmen der Kreislaufwirtschaft klare Rückbauprofile der Lieferanten ein.
                        </div>
                      </div>
                    )}

                    {activeEcoDb === 'ibu' && (
                      <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed animate-in fade-in duration-150">
                        <p>
                          <strong>Anwendungsfall (Ausstellung und Überprüfung von EPDs dritter Hersteller):</strong>
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                          <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                            <span className="font-bold text-amber-955 block font-mono">1. Aufbau von herstellereigenen EPDs</span>
                            <p className="text-slate-500 leading-relaxed font-sans">
                              Die Hersteller ermitteln die Lebenszyklusdaten im eigenen Werk nach den standardisierten <strong>IBU-Produktkategorieregeln (PCR)</strong>. Ein unabhängiger dritter Prüfer verifiziert diese Zahlen, bevor die EPD veröffentlicht wird.
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                            <span className="font-bold text-amber-955 block font-mono">2. Auslesen von Lebenszyklusmodulen</span>
                            <p className="text-slate-500 leading-relaxed font-sans">
                              In der herstellereigenen IBU-EPD (als PDF) befinden sich strukturierte Tabellen. Der Planer liest dort herstellerspezifische Kennwerte wie GWP-fossil in Modul A1–A3 ab und vergleicht diese direkt mit den Bundes-Durchschnittswerten.
                            </p>
                          </div>
                        </div>
                        <div className="bg-amber-50/20 border-l-4 border-amber-500 p-3 rounded-r-lg text-[10.5px] text-amber-950">
                          <span className="font-bold">Bedeutung im Lebensende:</span> EPDs enthalten in Modul C3/C4 ökologische Daten zur thermischen Entsorgung (wichtig bei Biomasse) und in Modul D konkrete Gutschriften über das Kreislaufpotenzial durch thermische oder materielle Substitutionen.
                        </div>
                      </div>
                    )}

                    {activeEcoDb === 'wecobis' && (
                      <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed animate-in fade-in duration-150">
                        <p>
                          <strong>Anwendungsfall (Schadstoffvermeidung und VOC-Grenzwerte nach QNG):</strong>
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                          <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                            <span className="font-bold text-rose-950 block font-mono">1. Bauökologisches Materialscreening</span>
                            <p className="text-slate-500 leading-relaxed font-sans">
                              Architekten suchen vor Ausschreibungen in WECOBIS gezielt nach Stoffgruppen (z.B. Abdichtungen auf Bitumen- oder Polymerbasis). WECOBIS listet die gesundheitlichen Einflüsse im gesamten Einbau- und Verarbeitungsfenster auf.
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                            <span className="font-bold text-rose-950 block font-mono">2. Einhaltung des QNG-Steckbriefs 313</span>
                            <p className="text-slate-500 leading-relaxed font-sans">
                              Um für Kredite die höchste Qualitätsstufe QS4 nachzuweisen, liefert WECOBIS konkrete Leitfäden und Klauseln für Textausschreibungen im Leistungsverzeichnis (LV), wie z.B. geforderte Emissionszertifikate (EMICODE EC1).
                            </p>
                          </div>
                        </div>
                        <div className="bg-rose-50/20 border-l-4 border-rose-500 p-3 rounded-r-lg text-[10.5px] text-rose-950">
                          <span className="font-bold">Verbindung der Module:</span> Nutzen Sie WECOBIS parallel zu den Modul-Steckbriefen für das handwerkliche Verständnis auf Baustellen, um unerwünschte Bauschäden und gesundheitsschädliche Belastungen von Planungsbeginn an auszuschließen.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeStep === 9 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-200">
                  <div className="border-b border-home-grau/25 pb-3">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Anhang 5</span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      Epilog: Glossar, Werkzeuge &amp; normative Standards
                    </h3>
                  </div>

                  <div className="space-y-3.5">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-stone-100 pb-1.5">
                      ⌨ Glossar der Ökobilanzierung (Kurzfassung)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {[
                        { term: 'Allokation', def: 'Zuweisung von Umweltaufwendungen auf Koppelprodukte (z.B. Hüttensand aus der Roheisenherstellung).' },
                        { term: 'BNB', def: 'Bewertungssystem Nachhaltiges Bauen – Pflichtsystem der Bundesregierung für Bundes- und Staatsgebäude.' },
                        { term: 'EF 3.1', def: 'Environmental Footprint-Methodenreferenz der Europ. Kommission, bildet die LCIA-Grundlage nach EN 15804+A2.' },
                        { term: 'EEE', def: 'Energieeffizienz-Experte; staatlich registrierter Gutachter für Förderungen und Konformitätsprüfungen.' },
                        { term: 'eLCA / Bauteileditor', def: 'Vom BBSR entwickeltes kostenloses Online-Tool zur vereinfachten Bilanzierung von Gebäudeschichten.' },
                        { term: 'End-of-Life (EoL)', def: 'Lebensende eines Baustoffes (Rückbau, Sortierung, thermische Verwertung oder Deponierung).' },
                        { term: 'EPBD', def: 'EU-Gebäuderichtlinie (EU) 2024/1275: Lebenszyklus-GWP ist für Neubauten ab 2028 (> 1 000 m²) bzw. 2030 (alle) zu berechnen und im Energieausweis offenzulegen.' },
                        { term: 'GWP 100', def: 'Global Warming Potential – Erderwärmungspotenzial über einen normierten Zeithorizont von 100 Jahren.' },
                        { term: 'ILCD+EPD', def: 'Gemeinsames xml-Datenformat zur Standardübertragung von EPD-Kennwerten in die ÖKOBAUDAT.' },
                        { term: 'KFN / KNN', def: 'KfW-Klimaförderrichtlinien (Klimafreundlicher Neubau). Knüpfen Kredite an strenge GWP-Grenzwerte.' },
                        { term: 'PCR (Product Category Rules)', def: 'Produktkategorieregeln, die Berechnungsverfahren zur Herstellung vergleichbarer EPDs festlegen.' },
                        { term: 'PENRT', def: 'Primärenergie nicht-erneuerbar total. Wichtige QNG-Kompensationsgröße.' },
                        { term: 'RSL (Reference Service Life)', def: 'Referenznutzungsdauer eines Baustoffes gemäß BBSR-Zählung (z.B. Gipsputz = 40 Jahre).' },
                        { term: 'RSP (Reference Study Period)', def: 'Betrachtungszeitraum eines Gebäudes; für Ökobilanzen in Deutschland standardmäßig 50 Jahre.' },
                        { term: 'UUID', def: 'Universell eindeutige Datenkennnummer im XML-Satz der ÖKOBAUDAT zur exakten Materialzuordnung.' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-50/50 rounded-lg border border-stone-200/60 leading-normal">
                          <strong className="text-[11px] font-mono text-slate-900 block font-bold">{item.term}</strong>
                          <span className="text-[10px] text-slate-500 block pt-1">{item.def}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3.5 pt-4 border-t border-stone-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-stone-100 pb-1.5">
                      🌐 Werkzeuge, Datenbanken &amp; Software
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-50 border border-stone-200 rounded-lg flex flex-col justify-between">
                        <div>
                          <strong className="text-xs text-slate-955 block font-bold leading-tight">ÖKOBAUDAT (BBSR)</strong>
                          <p className="text-[10px] text-slate-500 mt-1.5 leading-snug">
                            Zentrales deutsches Referenzregister für generische Ökobilanz-Datensätze und verifizierte Produkt-EPDs im ILCD-Format.
                          </p>
                        </div>
                        <a href="https://www.oekobaudat.de" target="_blank" rel="noreferrer" className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-1 mt-3">
                          oekobaudat.de <ExternalLink size={10} />
                        </a>
                      </div>

                      <div className="p-3 bg-slate-50 border border-stone-200 rounded-lg flex flex-col justify-between">
                        <div>
                          <strong className="text-xs text-slate-955 block font-bold leading-tight">eLCA (BBSR)</strong>
                          <p className="text-[10px] text-slate-500 mt-1.5 leading-snug">
                            Webbasierte kostenfreie Software des Bundes zur Berechnung von Gebäude-Ökobilanzen konform mit QNG- und BNB-Richtlinien.
                          </p>
                        </div>
                        <a href="https://www.bauteileditor.de" target="_blank" rel="noreferrer" className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-1 mt-3">
                          bauteileditor.de <ExternalLink size={10} />
                        </a>
                      </div>

                      <div className="p-3 bg-slate-50 border border-stone-200 rounded-lg flex flex-col justify-between">
                        <div>
                          <strong className="text-xs text-slate-955 block font-bold leading-tight">openLCA (GreenDelta)</strong>
                          <p className="text-[10px] text-slate-500 mt-1.5 leading-snug">
                            Hervorragendes, kostenloses Open-Source-Werkzeug zur Modellierung hochkomplexer Stoffstromsysteme und EPDs auf Werksebene.
                          </p>
                        </div>
                        <a href="https://www.openlca.org" target="_blank" rel="noreferrer" className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-1 mt-3">
                          openlca.org <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3.5 pt-4 border-t border-stone-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-stone-100 pb-1.5">
                      📖 Normative Quellennachweise (Normenhierarchie)
                    </h4>
                    <ul className="text-[11px] text-slate-650 space-y-1.5 list-disc pl-5 leading-relaxed">
                      <li><strong>ISO 14040 / ISO 14044:</strong> Allgemeine, produktübergreifende Grundsätze und Rechenrahmen für Ökobilanzen.</li>
                      <li><strong>ISO 14025:</strong> Leitfaden zur Erarbeitung von verifizierten Typ-III-Umweltdeklarationen (EPDs).</li>
                      <li><strong>DIN EN 15804+A2 (2020):</strong> Zentrale Branchennorm zur Definition der Product Category Rules (PCR) für EPDs im Bauwesen.</li>
                      <li><strong>DIN EN 15978:</strong> Berechnungsmethode zur Aggregation von EPDs auf die Gebäudeebene über 50 Jahre.</li>
                      <li><strong>DIN 277-1:2021-08:</strong> Ermittlung der Netto-Raumflächen (NRF) als gesetzliche QNG-Flächenreferenz.</li>
                      <li><strong>GEG / DIN V 18599:</strong> Energetische Berechnungen zum nutzerseitigen Betriebsenergie-Gegenüber (Modul B6).</li>
                    </ul>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

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
          { title: 'Bauprodukte-Verordnung', url: 'https://de.wikipedia.org/wiki/Bauprodukte-Verordnung' },
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
          { title: 'DIN EN 15978 / DIN EN 15804 (Ökobilanzierung von Gebäuden & EPDs)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+15978' }
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
            formel: '\\text{CBAM-Abgabe} = M_{\\text{Import}} \\cdot \\text{GWP}_{\\text{spec}} \\cdot \\left( P_{\\text{ETS}} - P_{\\text{Herkunft}} \\right) \\quad [\\text{\€}]',
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
