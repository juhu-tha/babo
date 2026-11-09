import React, { useState, useMemo } from 'react';
import { GMODG_ANLAGE7, FX, uRetrofit, dRequired, CO2_ERDGAS, CO2_HEIZOEL, CO2_FERNWAERME, CO2_STROM, CO2_WAERMEPUMPE } from '@/src/utils/bestandKern';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Slider } from '@/src/components/ui/Slider';
import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import { BlockMath } from 'react-katex';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  Building2, 
  Layers, 
  Construction, 
  Calendar, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck,
  Calculator,
  BarChart3,
  BookOpen,
  AlertTriangle,
  Info,
  SlidersHorizontal
} from 'lucide-react';
import inhalt from '@/content/bestand/Bestand.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Baualtersklasse {
  id: string;
  vintage: string;
  label: string;
  description: string;
  typicalConstruction: string;
  characteristicMaterials: string[];
  windows: string;
  uValueWall: number;
  uValueRoof: number;
  uValueFloor: number;
  uValueWindow: number;
}

const BAUALTERSKLASSEN: Baualtersklasse[] = inhalt.daten.BAUALTERSKLASSEN;

// CO₂-Faktoren nach GModG Anlage 9 wie im Energieausweis-Kern (Erdgas 0,24, Heizöl 0,31, Netzstrom 0,56 kg/kWh;
// Fernwärme 0,12 als Lehrwert); Wärmepumpe = Netzstrom/JAZ 3,5
const HEATING_SOURCES = [
  { id: 'gas', label: 'Erdgas-Heizung', co2Factor: CO2_ERDGAS, costPerKwh: 0.11 },
  { id: 'oil', label: 'Heizöl', co2Factor: CO2_HEIZOEL, costPerKwh: 0.12 },
  { id: 'district', label: inhalt.werte.fernwärmeMix, co2Factor: CO2_FERNWAERME, costPerKwh: 0.14 },
  { id: 'electricity', label: 'Direkt-Elektroheizung', co2Factor: CO2_STROM, costPerKwh: 0.35 },
  { id: 'heatpump', label: inhalt.werte.wärmepumpeJaz35, co2Factor: CO2_WAERMEPUMPE, costPerKwh: 0.09 },
];

type BestandReiter = 'steckbrief' | 'sanierung' | 'vergleich' | 'theorie';
const REITER: readonly ModulTab<BestandReiter>[] = [
  { id: 'steckbrief', label: inhalt.texte.baualtersklassenEpochen.trim(), icon: Calendar },
  { id: 'sanierung', label: inhalt.texte.sanierungsSimulatorGmodg.trim(), icon: Calculator },
  { id: 'vergleich', label: inhalt.texte.epochenVergleichUWerte.trim(), icon: BarChart3 },
  { id: 'theorie', label: inhalt.texte.konstruktiveTypologieFeuchteschutz.trim(), icon: BookOpen },
];

export default function Bestand() {
  const [activeTab, setActiveTab] = useState<BestandReiter>('steckbrief');
  const [selectedEra, setSelectedEra] = useState<string>('vor-1919');
  const [showCalculations, setShowCalculations] = useState<boolean>(false);
  
  // Sanierungskonfigurator-States
  const [selectedComp, setSelectedComp] = useState<'wall' | 'roof' | 'ogd' | 'floor'>('wall');
  const [area, setArea] = useState<number>(100);
  const [thickness, setThickness] = useState<number>(140); // in mm
  const [lambda, setLambda] = useState<number>(0.035); // W/(mK)
  const [insulationCostM2, setInsulationCostM2] = useState<number>(120); // €/m²
  const [heatingSource, setHeatingSource] = useState<string>('gas');

  const currentEraData = useMemo(() => {
    return BAUALTERSKLASSEN.find(e => e.id === selectedEra) || BAUALTERSKLASSEN[0];
  }, [selectedEra]);

  // Calculations for thermal refurbishment
  const sanierungResults = useMemo(() => {
    // Höchstwerte nach Anlage 7 GModG; Temperatur-Korrekturfaktor Fx nach DIN V 4108-6
    let originalU = currentEraData.uValueWall;
    let gegLimit: number = GMODG_ANLAGE7.aussenwand;
    let fx = FX.aussenwand ?? 1.0;

    if (selectedComp === 'roof' || selectedComp === 'ogd') {
      // Anlage 7: ein Höchstwert für Steildach und oberste Geschossdecke (Flachdach: 0,20);
      // F_x nach DIN V 4108-6 getrennt: Dach als Systemgrenze 1,0, Decke zum unbeheizten Dachraum 0,8 (NS5B-BE-1)
      originalU = currentEraData.uValueRoof;
      gegLimit = GMODG_ANLAGE7.steildach_oGD;
      fx = selectedComp === 'roof' ? (FX.steildach ?? 1.0) : (FX.oberste_geschossdecke ?? 0.8);
    } else if (selectedComp === 'floor') {
      originalU = currentEraData.uValueFloor;
      gegLimit = GMODG_ANLAGE7.kellerdecke_erdreich;
      fx = FX.kellerdecke_erdreich ?? 0.6;
    }

    const newU = uRetrofit(originalU, thickness / 1000, lambda);
    const deltaU = Math.max(0, originalU - newU);

    // Heizwärmeeinsparung: ΔQ = ΔU · A · F_x · G_t20/15 · 24 / 1000 [kWh/a], G_t = 3 500 Kd/a (Standortmittel)
    const GT = 3500;
    const annualEnergySavings = deltaU * area * fx * GT * 24 / 1000;
    const dReqMm = Math.ceil(dRequired(newU, gegLimit, lambda) * 1000);

    const heatConfig = HEATING_SOURCES.find(h => h.id === heatingSource) || HEATING_SOURCES[0];
    const annualCostSavings = annualEnergySavings * heatConfig.costPerKwh;
    const annualCo2Savings = annualEnergySavings * heatConfig.co2Factor;

    const totalInvestment = area * insulationCostM2;
    const paybackYears = annualCostSavings > 0 ? (totalInvestment / annualCostSavings) : 999;
    const gegCompliant = newU <= gegLimit + 1e-9;

    return {
      originalU,
      newU,
      deltaU,
      gegLimit,
      gegCompliant,
      annualEnergySavings,
      annualCostSavings,
      annualCo2Savings,
      totalInvestment,
      paybackYears,
      fx, GT, dReqMm
    };
  }, [currentEraData, selectedComp, area, thickness, lambda, insulationCostM2, heatingSource]);

  // Chart data
  const chartData = {
    labels: BAUALTERSKLASSEN.map(b => b.vintage),
    datasets: [
      {
        label: inhalt.werte.außenwandUWertW,
        data: BAUALTERSKLASSEN.map(b => b.uValueWall),
        borderColor: '#9E2A2B',
        backgroundColor: '#9E2A2B',
        borderWidth: 2,
        tension: 0.1,
      },
      {
        label: inhalt.werte.dachUWertW,
        data: BAUALTERSKLASSEN.map(b => b.uValueRoof),
        borderColor: '#334155',
        backgroundColor: '#334155',
        borderWidth: 2,
        tension: 0.1,
      },
      {
        label: inhalt.werte.gmodgGrenzwertAußenwand0,
        data: Array(BAUALTERSKLASSEN.length).fill(0.24),
        borderColor: '#64748B',
        borderDash: [6, 4],
        pointRadius: 0,
        borderWidth: 1.5,
        fill: false,
      },
      {
        label: inhalt.werte.gmodgGrenzwertSteildachOberste,
        data: Array(BAUALTERSKLASSEN.length).fill(0.24),
        borderColor: '#94A3B8',
        borderDash: [4, 4],
        pointRadius: 0,
        borderWidth: 1.5,
        fill: false,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 11, family: 'Inter' }
        }
      },
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        type: 'linear' as const,
        title: { display: true, text: inhalt.werte.uWertWM },
        beginAtZero: true,
        max: 2.2
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Header Panel */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Building2 className="text-shiraz" /><MdText text={inhalt.texte.altbauBestandEnergetischeSanierung} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
          <p><MdText text={inhalt.texte.wissenschaftlicheUWertAbschätzungen} /></p>
        </div>

        {/* Tab Navigation following GEMINI_md */}
        <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:my-6">

        {/* Tab 1: Baualtersklassen */}
        {activeTab === 'steckbrief' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Era Buttons */}
              <div className="lg:col-span-4 flex flex-col gap-2.5">
                <h3 className="text-sm font-bold text-text-main flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-shiraz" /><MdText text={inhalt.texte.baualtersklasseAuswählen} /></h3>
                <AuswahlGruppe label="Baualtersklasse" className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  {BAUALTERSKLASSEN.map((era) => (
                    <button {...alsOption(selectedEra === era.id)}
                      key={era.id}
                      onClick={() => setSelectedEra(era.id)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedEra === era.id
                          ? 'bg-shiraz text-white border-shiraz shadow-sm'
                          : 'bg-white hover:bg-off-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <div className="font-bold text-xs flex justify-between items-center">
                        <span>{era.vintage}</span>
                        {selectedEra === era.id && <ArrowRight className="w-3.5 h-3.5" />}
                      </div>
                      <div className={`text-[11px] truncate mt-0.5 ${selectedEra === era.id ? 'text-white/80' : 'text-slate-500'}`}>
                        {era.label}
                      </div>
                    </button>
                  ))}
                </AuswahlGruppe>
              </div>

              {/* Right Column: Era Detail Card */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="bg-off-white rounded-2xl border border-home-grau/30 p-6 flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-home-grau/20 pb-4">
                    <div>
                      <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">
                        Baualtersklasse {currentEraData.vintage}
                      </span>
                      <h3 className="text-lg font-bold text-text-main">
                        {currentEraData.label}
                      </h3>
                    </div>
                    <div className="px-3 py-1 bg-white border border-home-grau/30 rounded-lg text-xs font-semibold text-slate-700"><MdText text={inhalt.texte.standardwerteNachAltbauAtlas} /></div>
                  </div>

                  <p className="text-sm text-text-main/80 leading-relaxed">
                    {currentEraData.description}
                  </p>

                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-home-grau/20">
                      <span className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                        <Layers size={14} className="text-shiraz" /><MdText text={inhalt.texte.typischeKonstruktionsmerkmale} /></span>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        {currentEraData.typicalConstruction}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-home-grau/20">
                      <span className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
                        <Construction size={14} className="text-shiraz" /><MdText text={inhalt.texte.charakteristischeBaustoffeKomponenten} /></span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentEraData.characteristicMaterials.map((mat, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-800 border border-slate-200 rounded-lg text-xs font-medium">
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-home-grau/20">
                      <span className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.historischeVerglasungFenster} /></span>
                      <p className="text-xs text-text-main/80">
                        {currentEraData.windows}
                      </p>
                    </div>
                  </div>

                  {/* Thermal Metrics Grid */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider"><MdText text={inhalt.texte.typischeUngedämmteBauteilKennwerte} /></h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 flex flex-col items-center text-center">
                        <span className="text-[11px] text-slate-500 font-medium mb-1">Außenwand</span>
                        <span className="text-base font-black text-shiraz font-mono">
                          {formatDeZahl(currentEraData.uValueWall, 2)}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">W/(m²K)</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 flex flex-col items-center text-center">
                        <span className="text-[11px] text-slate-500 font-medium mb-1">Dach</span>
                        <span className="text-base font-black text-slate-800 font-mono">
                          {formatDeZahl(currentEraData.uValueRoof, 2)}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">W/(m²K)</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 flex flex-col items-center text-center">
                        <span className="text-[11px] text-slate-500 font-medium mb-1">Kellerdecke</span>
                        <span className="text-base font-black text-blue-800 font-mono">
                          {formatDeZahl(currentEraData.uValueFloor, 2)}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">W/(m²K)</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 flex flex-col items-center text-center">
                        <span className="text-[11px] text-slate-500 font-medium mb-1">Fenster</span>
                        <span className="text-base font-black text-teal-700 font-mono">
                          {formatDeZahl(currentEraData.uValueWindow, 2)}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">W/(m²K)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sanierungskonfigurator */}
        {activeTab === 'sanierung' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Controls */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                <div className="bg-off-white p-5 rounded-2xl border border-home-grau/30 space-y-4">
                  <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-shiraz" /><MdText text={inhalt.texte.sanierungsparameterKonfigurieren} /></h3>

                  {/* Component selector */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5"><MdText text={inhalt.texte.bauteilFürDieSanierungsmaßnahme} /></label>
                    <AuswahlGruppe label="Bauteil" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'wall' as const, label: 'Außenwand' },
                        { id: 'roof' as const, label: inhalt.werte.steildach },
                        { id: 'ogd' as const, label: inhalt.werte.obersteGeschossdecke },
                        { id: 'floor' as const, label: 'Kellerdecke' }
                      ].map(c => (
                        <button {...alsOption(selectedComp === c.id)}
                          key={c.id}
                          onClick={() => setSelectedComp(c.id)}
                          className={`p-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            selectedComp === c.id
                              ? 'bg-shiraz text-white border-shiraz'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </AuswahlGruppe>
                  </div>

                  <Slider
                    label={inhalt.werte.bauteilflächeAM}
                    value={area}
                    min={20}
                    max={500}
                    step={10}
                    unit=" m²"
                    onChange={(e) => setArea(parseFloat(e.target.value))}
                  />

                  <Slider
                    label={inhalt.werte.zusätzlicheDämmstoffdickeDMm}
                    value={thickness}
                    min={40}
                    max={300}
                    step={10}
                    unit=" mm"
                    onChange={(e) => setThickness(parseFloat(e.target.value))}
                  />

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1"><MdText text={inhalt.texte.wärmeleitfähigkeitDWMk} /></label>
                    <select aria-label={inhalt.werte.wärmeleitfähigkeitDWMk}
                      value={lambda}
                      onChange={(e) => setLambda(parseFloat(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-lg border border-home-grau/30 bg-white"
                    >
                      <option value={0.022}>λ = 0,022 (PUR/PIR Hochleistungsdämmung / Resol)</option>
                      <option value={0.032}>λ = 0,032 (EPS WLG 032 / Mineralwolle 032)</option>
                      <option value={0.035}>λ = 0,035 (Standard Mineralwolle / EPS 035)</option>
                      <option value={0.040}>λ = 0,040 (Holzfaser / Zellulose / Hanf 040)</option>
                      <option value={0.065}>λ = 0,065 (Calciumsilikatplatte, kapillaraktive Innendämmung)</option>
                    </select>
                  </div>

                  <Slider
                    label={inhalt.werte.spezifischeSanierungskostenM}
                    value={insulationCostM2}
                    min={40}
                    max={300}
                    step={10}
                    unit=" €/m²"
                    onChange={(e) => setInsulationCostM2(parseFloat(e.target.value))}
                  />

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1"><MdText text={inhalt.texte.bestehendesHeizsystem} /></label>
                    <select aria-label={inhalt.werte.bestehendesHeizsystem}
                      value={heatingSource}
                      onChange={(e) => setHeatingSource(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-home-grau/30 bg-white"
                    >
                      {HEATING_SOURCES.map(h => (
                        <option key={h.id} value={h.id}>
                          {h.label} (~{formatDeZahl(h.costPerKwh * 100, 1)} ct/kWh, {formatDeZahl(h.co2Factor, 2)} kg CO₂/kWh)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Results */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                <div className="bg-white rounded-2xl border border-home-grau/30 p-6 shadow-sm flex flex-col gap-5">
                  <div className="flex justify-between items-center border-b border-home-grau/20 pb-3">
                    <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-shiraz" /><MdText text={inhalt.texte.energetischeÖkonomischeSanierungsbilanz} /></h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      sanierungResults.gegCompliant
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300'
                    }`}>
                      {sanierungResults.gegCompliant ? inhalt.werte.gmodgKonformAnlage7 : `⚠ Grenzwert überschritten – ca. ${formatDeWert(sanierungResults.dReqMm)} mm mehr Dämmung`}
                    </span>
                  </div>

                  <ErgebnisAnsage text={kurzzeile(ansageWert('U-Wert neu', sanierungResults.newU, 2, 'W/(m²K)'),
                    sanierungResults.gegCompliant ? inhalt.werte.gmodgKonformAnlage7 : `Grenzwert überschritten, ca. ${formatDeWert(sanierungResults.dReqMm)} mm mehr Dämmung`,
                    sanierungResults.paybackYears > 60 ? inhalt.werte.keineAmortisation : ansageWert('Amortisation', sanierungResults.paybackYears, 1, 'Jahre'))} />
                  {/* U-Value Comparison */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                      <span className="text-[11px] text-slate-500 font-medium block"><MdText text={inhalt.texte.uWertAltbau} /></span>
                      <span className="text-base font-bold text-slate-900 font-mono">
                        {formatDeZahl(sanierungResults.originalU, 2)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">W/(m²K)</span>
                    </div>

                    <div className="bg-rose-50/50 p-3.5 rounded-xl border border-shiraz/30 text-center">
                      <span className="text-[11px] text-shiraz font-medium block"><MdText text={inhalt.texte.uWertSaniert} /></span>
                      <span className="text-base font-black text-shiraz font-mono">
                        {formatDeZahl(sanierungResults.newU, 3)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">W/(m²K)</span>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                      <span className="text-[11px] text-slate-500 font-medium block"><MdText text={inhalt.texte.gmodgGrenzwert} /></span>
                      <span className="text-base font-bold text-slate-700 font-mono">
                        {formatDeZahl(sanierungResults.gegLimit, 2)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">W/(m²K)</span>
                    </div>
                  </div>

                  {/* Savings Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-center">
                      <span className="text-[11px] text-slate-500 block">Wärmeeinsparung</span>
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        {formatDeZahl(sanierungResults.annualEnergySavings, 0)} kWh/a
                      </span>
                    </div>

                    <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-center">
                      <span className="text-[11px] text-slate-500 block">Kostenvorteil</span>
                      <span className="text-xs font-extrabold text-emerald-700 font-mono">
                        ~{formatDeZahl(sanierungResults.annualCostSavings, 0)} €/a
                      </span>
                    </div>

                    <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-center">
                      <span className="text-[11px] text-slate-500 block">CO₂-Minderung</span>
                      <span className="text-xs font-bold text-emerald-800 font-mono">
                        {formatDeZahl(sanierungResults.annualCo2Savings, 0)} kg/a
                      </span>
                    </div>

                    <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-center">
                      <span className="text-[11px] text-slate-500 block">Investitionsvolumen</span>
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        {formatDeZahl(sanierungResults.totalInvestment, 0)} €
                      </span>
                    </div>
                  </div>

                  {/* Amortization banner */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block"><MdText text={inhalt.texte.statischeAmortisationszeit} /></span>
                      <span className="text-[11px] text-slate-500"><MdText text={inhalt.texte.investitionGeteiltDurchJährliche} /></span>
                    </div>
                    <span className="text-sm font-extrabold text-shiraz font-mono">
                      {sanierungResults.paybackYears > 60 
                        ? inhalt.werte.keineAmortisation 
                        : `${formatDeZahl(sanierungResults.paybackYears, 1)} Jahre`}
                    </span>
                  </div>

                  {/* Toggle Detailed Math */}
                  <button
                    onClick={() => setShowCalculations(!showCalculations)}
                    className="text-xs font-bold text-shiraz hover:underline flex items-center gap-1.5 self-start cursor-pointer"
                  >
                    <Info size={14} />
                    {showCalculations ? inhalt.werte.rechenwegFormelnAusblenden : inhalt.werte.ausführlichenRechenwegDinEn}
                  </button>

                  {showCalculations && (
                    <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3 text-xs text-slate-700 animate-in fade-in">
                      <span className="font-bold text-slate-900 block"><MdText text={inhalt.texte.schrittweiseHerleitungDesSanierungsbedin} /></span>
                      
                      <p><MdText text={inhalt.texte.t1WärmedurchgangswiderstandDesUngedämmten} /></p>
                      <BlockMath math={`R_{\\text{alt}} = \\frac{1}{U_{\\text{alt}}} = \\frac{1}{${formatDeTeX(sanierungResults.originalU, 2)}} \\approx ${formatDeTeX(1 / sanierungResults.originalU, 3)} \\text{ m}^2\\text{K/W}`} />

                      <p><MdText text={inhalt.texte.t2ZusätzlicherWärmedurchlasswiderstandDer} />{formatDeWert(thickness)} mm = {formatDeZahl(thickness / 1000, 3)} m):
                      </p>
                      <BlockMath math={`R_{\\text{Dämm}} = \\frac{d}{\\lambda_D} = \\frac{${formatDeTeX(thickness / 1000, 3)}}{${formatDeTeX(lambda, 3)}} \\approx ${formatDeTeX((thickness / 1000) / lambda, 3)} \\text{ m}^2\\text{K/W}`} />

                      <p><MdText text={inhalt.texte.t3GesamtwiderstandUndNeuer} /></p>
                      <BlockMath math={`U_{\\text{neu}} = \\frac{1}{R_{\\text{alt}} + R_{\\text{Dämm}}} = \\frac{1}{${formatDeTeX(1 / sanierungResults.originalU, 3)} + ${formatDeTeX((thickness / 1000) / lambda, 3)}} \\approx ${formatDeTeX(sanierungResults.newU, 3)} \\text{ W/(m}^2\\text{K)}`} />

                      <p><MdText text={inhalt.texte.t4JährlicheHeizwärmeeinsparungMit} /></p>
                      <BlockMath math={`\\Delta Q = \\Delta U \\cdot A \\cdot F_x \\cdot G_t \\cdot 0{,}024 = (${formatDeTeX(sanierungResults.originalU, 2)} - ${formatDeTeX(sanierungResults.newU, 3)}) \\cdot ${area} \\cdot ${formatDeTeX(sanierungResults.fx, 1)} \\cdot 3500 \\cdot 0{,}024 \\approx ${formatDeTeX(sanierungResults.annualEnergySavings, 0)} \\text{ kWh/a}`} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Epochen-Vergleich */}
        {activeTab === 'vergleich' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm">
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-shiraz" /><MdText text={inhalt.texte.historischerTrendDerBauteil} /></h3>
              <p className="text-xs text-slate-500 mb-6"><MdText text={inhalt.texte.entwicklungDesThermischenStandards} /></p>

              <div className="h-80 w-full">
                <Line data={chartData} options={chartOptions} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1"><MdText text={inhalt.texte.bauphysikalischeEpochensprünge} /></span><MdText text={inhalt.texte.bisInDie1970er} /></div>

                <div className="bg-rose-50/40 p-4 rounded-xl border border-shiraz/20 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-shiraz block mb-1"><MdText text={inhalt.texte.grenzwerteNachGebäudemodernisierungsgese} /></span><MdText text={inhalt.texte.nach36GmodgVormals} /></div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Konstruktive Typologie & Feuchteschutz */}
        {activeTab === 'theorie' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                  <AlertTriangle className="text-amber-600" size={18} /><MdText text={inhalt.texte.schadenspotenzialeImAltbaubestand} /></h3>
                <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                  <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-200"><MdText text={inhalt.texte.holzbalkenköpfeInAußenwändenDurch} /></li>
                  <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-200"><MdText text={inhalt.texte.preußischeKappendeckenKorrosionDer} /></li>
                  <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-200"><MdText text={inhalt.texte.schadstoffeDerNachkriegsepochenAsbestzem} /></li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                  <ShieldCheck className="text-emerald-700" size={18} /><MdText text={inhalt.texte.innendämmungNachWtaMerkblatt} /></h3>
                <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
                  <p><MdText text={inhalt.texte.beiDenkmalgeschütztenFassadenIst} /></p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 block"><MdText text={inhalt.texte.t1KapillaraktiveDiffusionsoffeneSysteme} /></span>
                    <span><MdText text={inhalt.texte.anfallendesKondensatWirdDurch} /></span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 block"><MdText text={inhalt.texte.t2DiffusionsdichteSystemeMit} /></span>
                    <span><MdText text={inhalt.texte.erfordernAbsoluteLuftdichtheitDer} /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </ModuleTabs>
      </div>

      {/* ModuleFooter following GEMINI_md */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1InnendämmungEiner}
        zielGleichung="U_{neu} = \frac{1}{1/U_{alt} + d/\lambda}"
        schritte={inhalt.daten["Bestand.schritte"]}
        ergebnisHinweis={inhalt.werte.moderateInnendämmungVerbessertBehaglichk}
        normQuelle={inhalt.werte.dinEnIso6946}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2TransmissionswärmeverlustVor}
        zielGleichung="\Delta Q = \Delta U \cdot A \cdot HGT \cdot 24 / 1000"
        schritte={inhalt.daten["Bestand.schritte_2"]}
        ergebnisHinweis={inhalt.werte.wärmebrückenAnEinbindendenInnenwänden}
        normQuelle={inhalt.werte.vdi2067Vdi4710}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="bestand" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap8} 
        wikipedia={[
          { title: "Altbau", url: "https://de.wikipedia.org/wiki/Altbau" },
          { title: "Wärmedurchgangskoeffizient", url: "https://de.wikipedia.org/wiki/W%C3%A4rmedurchgangskoeffizient" },
          { title: inhalt.werte.innendämmungNachWta, url: "https://de.wikipedia.org/wiki/Innend%C3%A4mmung" }
        ]}
        literatur={inhalt.daten["Bestand.literatur"]}
        regelwerke={inhalt.daten["Bestand.regelwerke"]}
        formeln={inhalt.daten["Bestand.formeln"]}
        weblinks={inhalt.daten["Bestand.weblinks"]}
      />
    </div>
  );
}
