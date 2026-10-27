import type { ChartData, ChartOptions, ScriptableContext } from 'chart.js';
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
import inhalt from '@/content/nachhaltigkeit/Nachhaltigkeit.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';

/** Reiter der Arbeitsbereiche (Z53: ModuleTabs); angezeigt werden nur die über `bereiche` gewählten */
const WERKSTATT_TABS: readonly ModulTab<NachhaltigkeitBereich>[] = [
  { id: 'wandkonfigurator', label: 'Wandaufbau' },
  { id: 'qng_nachweis', label: 'QNG-Nachweis' },
  { id: 'crrem_regulatorik', label: inhalt.texte.crremRegulatorik },
  { id: 'praxis_innovationen', label: inhalt.texte.praxisGebäudetypE },
  { id: 'leitfaden', label: inhalt.texte.epdQngLeitfaden },
];
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
  const chartData: ChartData<'bar'> = {
    labels: [inhalt.werte.herstellungA1A3, inhalt.werte.entsorgungC3C4, inhalt.werte.gutschriftenModulD, inhalt.werte.ökobilanzNettoGesamt],
    datasets: [
      {
        label: inhalt.werte.treibhauspotenzialKgCoEq,
        data: [
          computedWall.gwpTotalA1A3,
          computedWall.gwpC3C4,
          computedWall.gwpD,
          computedWall.gwpNetTotal
        ],
        backgroundColor: (context: ScriptableContext<'bar'>) => {
          const value = context.raw as number;
          if (value < 0) return '#475569'; // positive credit is teal green
          if (context.dataIndex === 3) return '#A3113E'; // Net total is deep red
          return '#475569'; // basic emission is slate-blue
        },
        borderRadius: 8,
        borderWidth: 0
      }
    ]
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` ${formatDeZahl(context.raw as number, 2)} kg CO₂-eq`
        }
      }
    },
    scales: {
      y: {
        grid: { color: '#e2e8f0' },
        title: { display: true, text: inhalt.werte.kgCoEqM }
      }
    }
  };

  // GEG Rating assessment
  const getGegRating = (uVal: number) => {
    if (uVal <= 0.15) {
      return {
        label: inhalt.werte.passivhausNiveauU0,
        color: 'bg-slate-100 text-slate-800 border-slate-300',
        rating: 'Exzellent'
      };
    }
    if (uVal <= 0.24) {
      return {
        label: inhalt.werte.erfülltGegHöchstwertSanierung,
        color: 'bg-slate-50 text-slate-700 border-slate-200',
        rating: 'Konform'
      };
    }
    return {
      label: inhalt.werte.überGegHöchstwertSanierung,
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
    let label = inhalt.werte.nichtGefördert;
    let ratingColor = 'text-shiraz bg-shiraz/5 border-shiraz/20';
    let status = 'failed';

    if (totalYearlyGwp <= 20.0) {
      label = inhalt.werte.qngPremiumSiegelErreicht;
      ratingColor = 'text-slate-900 bg-slate-100 border-slate-300';
      status = 'premium';
    } else if (totalYearlyGwp <= 24.0) {
      label = inhalt.werte.qngPlusSiegelErreicht;
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
    let reductionLabel = inhalt.werte.keineSanierungsmaßnahmeStatusQuo;
    let reductionPct = 0;

    if (crremRetrofit === 'opex') {
      reductionPct = 15;
      effectiveGwp *= 0.85;
      reductionLabel = inhalt.werte.opexBetriebsoptimierungSmartMetering;
    } else if (crremRetrofit === 'capex_huelle') {
      reductionPct = 35;
      effectiveGwp *= 0.65;
      reductionLabel = inhalt.werte.capexHülleFassadenDach;
    } else if (crremRetrofit === 'capex_deep') {
      reductionPct = 75;
      effectiveGwp *= 0.25;
      reductionLabel = inhalt.werte.deepCapexHülleWärmepumpe;
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
            <Building className="text-shiraz" /><MdText text={inhalt.texte.lcaPraxiswerkstattNachhaltigkeit} /></h2>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p><MdText text={inhalt.texte.führenSieAkademischeBauteil} /></p>
        </div>
      </div>

      {/* Info-Sektion: Treibhausgase (THG), CO₂ und CO₂-eq im Bauwesen */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b border-home-grau/20 pb-3">
          <Leaf className="text-shiraz w-6 h-6 shrink-0" />
          <div>
            <h3 className="text-base font-bold text-slate-900"><MdText text={inhalt.texte.wissenschaftlicherLeitfadenThgCo} /></h3>
            <p className="text-xs text-slate-500"><MdText text={inhalt.texte.klimawirkungsindikatorenVerstehenUndMit} /></p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: THG */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">Definition</span>
              <strong className="text-sm text-slate-900 font-bold"><MdText text={inhalt.texte.t1TreibhausgaseThg} /></strong>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.treibhausgaseSindInfrarotstrahlungAbsorb} /></p>
          </div>

          {/* Card 2: CO2 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">Referenz</span>
              <strong className="text-sm text-slate-900 font-bold"><MdText text={inhalt.texte.t2KohlendioxidCo} /></strong>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.kohlendioxidDientAlsInternationaler} /></p>
          </div>

          {/* Card 3: CO2-eq */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">Äquivalent</span>
              <strong className="text-sm text-slate-900 font-bold"><MdText text={inhalt.texte.t3CoÄquivalentCo} /></strong>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.daVerschiedeneGaseDie} /></p>
          </div>
        </div>

        {/* Umrechnungsfaktoren Subgrid */}
        <div className="mt-2 pt-4 border-t border-home-grau/20">
          <h4 className="text-xs font-bold text-slate-900 mb-2.5 flex items-center gap-1.5 uppercase tracking-wider">
            <Percent size={14} className="text-shiraz" /><MdText text={inhalt.texte.standardisierteGwpUmrechnungsfaktorenIpc} /></h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {inhalt.daten.Nachhaltigkeit.map((u, i) => (
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

      {/* Reiter (Z53: ModuleTabs) über den Arbeitsbereichen */}
      <ModuleTabs label={inhalt.texte.lcaPraxiswerkstattNachhaltigkeit.trim()} tabs={WERKSTATT_TABS.filter(t => zeige(t.id))} aktiv={activeWorkspace} onWechsel={setActiveWorkspace} className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
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
      </div>
      </ModuleTabs>

      {/* Embedded Reference Rules Footnote */}
      <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 text-[10px] text-slate-500 leading-normal flex items-start gap-1.5">
        <span className="text-shiraz font-bold block shrink-0 select-none">HINWEIS:</span>
        <span><MdText text={inhalt.texte.dieDargestelltenUWerte} /></span>
      </div>

      <ModuleFooter
        wikipedia={[
          { title: 'Passivhaus', url: 'https://de.wikipedia.org/wiki/Passivhaus' },
          { title: 'U-Wert', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmedurchgangskoeffizient' },
          { title: inhalt.werte.graueEnergie, url: 'https://de.wikipedia.org/wiki/Graue_Energie' },
          { title: 'Bauprodukte-Verordnung' },
          { title: inhalt.werte.europeanGreenDeal, url: 'https://de.wikipedia.org/wiki/European_Green_Deal' },
          { title: inhalt.werte.europäischerEmissionshandel, url: 'https://de.wikipedia.org/wiki/EU-Emissionshandel' },
          { title: 'CO2-Grenzausgleichssystem', url: 'https://de.wikipedia.org/wiki/CO2-Grenzausgleichssystem' },
          { title: 'Ersatzbaustoffverordnung', url: 'https://de.wikipedia.org/wiki/Ersatzbaustoffverordnung' },
          { title: 'Lehmbau', url: 'https://de.wikipedia.org/wiki/Lehmbau' }
        ]}
        literatur={inhalt.daten["Nachhaltigkeit.literatur"]}
        regelwerke={inhalt.daten["Nachhaltigkeit.regelwerke"]}
        formeln={inhalt.daten["Nachhaltigkeit.formeln"]}
      />
    </div>
  );
}
