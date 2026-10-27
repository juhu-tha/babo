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
import { formatDeZahl, formatDeWert, formatDeTeX, formatDeTeXWert } from '@/src/utils/numberFormat';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';

/** KaTeX-Summe mit korrekten Vorzeichen (für den Live-Rechenweg) */
const texSumme = (werte: number[], n = 0) =>
  werte.map((w, k) => (k === 0 ? formatDeTeX(w, n) : w < 0 ? ` - ${formatDeTeX(-w, n)}` : ` + ${formatDeTeX(w, n)}`)).join('');
import { exportToPDF } from '../lib/pdfExport';
import inhalt from '@/content/lcc/LCC.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { lccVergleich, type LccOption } from '@/src/calc/lcc';

// Define the scenario profiles for LCC calculation
interface OptionConfig extends LccOption {
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

const SCENARIOS: ScenarioConfig[] = inhalt.daten.SCENARIOS;

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
  // Restwert: Standard AUS (BNB 2.1.1 ohne Restwert), Schalter für Vergleichsrechnung linear nach Del. VO (EU) 244/2012
  const [restwertEnabled, setRestwertEnabled] = useState<boolean>(false);

  const activeScenario = useMemo(() => {
    return SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];
  }, [selectedScenarioId]);

  // Rechenkern src/calc/lcc.ts (Barwertmethode, Förderung nur für Option B)
  const calcData = useMemo(() => lccVergleich(activeScenario.optionA, activeScenario.optionB, {
    r: discountRate / 100,
    e: energyInflation / 100,
    i: generalInflation / 100,
    N: analysisPeriod,
    co2Bepreisung: co2PricingEnabled,
    co2Preis: co2BasePrice,
    co2Steigerung: co2Escalation / 100,
    foerderungB: subsidyEnabled ? subsidyPercent : 0,
    restwertLinear: restwertEnabled,
  }), [analysisPeriod, discountRate, energyInflation, generalInflation, co2PricingEnabled, co2BasePrice, co2Escalation, subsidyEnabled, subsidyPercent, restwertEnabled, activeScenario]);

  return (
    <div className="flex flex-col gap-8">
      {/* Introduction Banner aligned with styleguide */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Coins className="text-shiraz" /><MdText text={inhalt.texte.lebenszykluskostenRechnungLcc} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4">
          <p><MdText text={inhalt.texte.dieLebenszykluskostenrechnungLifeCycle} /></p>
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
            <Coins size={14} /><MdText text={inhalt.texte.t1InteraktiverKostenrechnerSzenarien} /></button>
          <button aria-pressed={activeTab === 'theorie'}
            onClick={() => setActiveTab('theorie')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'theorie'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-slate-50'
            }`}
          >
            <Layers size={14} /><MdText text={inhalt.texte.t2FachgrundlagenNormenDin} /></button>

          {activeTab === 'rechner' && (
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="ml-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 text-white border border-emerald-600 shadow-sm hover:bg-emerald-700 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-55"
            >
              {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
              {isExporting ? 'Generiere...' : inhalt.werte.berichtExportierenPdf}
            </button>
          )}
        </div>
      </div>

      {activeTab === 'rechner' && (
        <div id="lcc-print-area" className="space-y-8 animate-in fade-in duration-350 p-1">
          {/* PDF Export Title header: only visible during PDF generation */}
          <div className="pdf-header hidden bg-white p-6 rounded-2xl border border-home-grau/30 mb-4 text-center">
            <div className="flex justify-between items-center text-xs text-slate-500 font-mono pb-3 border-b border-home-grau/20">
              <span><MdText text={inhalt.texte.technischeHochschuleAugsburg} /></span>
              <span><MdText text={inhalt.texte.fakultätFürArchitekturUnd} /></span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-4 uppercase tracking-wide"><MdText text={inhalt.texte.lebenszyklusanalyseLccGutachtenNach} /></h2>
            <p className="text-[11px] text-slate-500 mt-1 font-mono"><MdText text={inhalt.texte.wirtschaftlichkeitsprüfungProfDrIng} /></p>
            <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-slate-50 rounded-xl text-left text-xs border border-home-grau/25">
              <div>
                <span className="font-bold text-slate-950 block mb-1"><MdText text={inhalt.texte.untersuchtesBauteilszenario} /></span>
                <span className="text-shiraz font-bold">{activeScenario.title}</span>
                <p className="text-stone-500 text-[11px] mt-1">{activeScenario.subtitle}</p>
              </div>
              <div>
                <span className="font-bold text-slate-950 block mb-1">Berechnungsparameter:</span>
                <ul className="space-y-0.5 font-mono text-[11px]">
                  <li><MdText text={inhalt.texte.betrachtungszeitraum} /><span className="font-bold text-shiraz">{formatDeWert(analysisPeriod)} Jahre</span></li>
                  <li><MdText text={inhalt.texte.kalkulationszinssatzR} /><span className="font-bold text-shiraz">{formatDeZahl(discountRate, 1)} % / a</span></li>
                  <li><MdText text={inhalt.texte.energiepreisInflationE} /><span className="font-bold text-shiraz">{formatDeZahl(energyInflation, 1)} % / a</span></li>
                  <li><MdText text={inhalt.texte.coSchattenpreis} /><span className="font-bold text-shiraz">{co2PricingEnabled ? `Aktiv (${co2BasePrice} €/t, +${co2Escalation}%)` : 'Inaktiv'}</span></li>
                  <li><MdText text={inhalt.texte.kfwFördermodus} /><span className="font-bold text-shiraz">{subsidyEnabled ? `Aktiv (${formatDeWert(subsidyPercent)}%)` : 'Inaktiv'}</span></li>
                  <li><MdText text={inhalt.texte.restwertModus} /><span className="font-bold text-shiraz">{restwertEnabled ? 'linear (Del. VO (EU) 244/2012, Vergleich)' : 'ohne (BNB 2.1.1)'}</span></li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main Scenario Selector */}
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm">
            <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest block font-mono mb-2"><MdText text={inhalt.texte.didaktischesPraxisSzenario} /></span>
            <h3 className="text-base font-bold text-slate-950 mb-4"><MdText text={inhalt.texte.wählenSieDasBauliche} /></h3>
            
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
                <Scale size={16} className="text-shiraz" /><MdText text={inhalt.texte.volkswirtschaftlicheMathematischeParamet} /></h3>
              
              {/* Parameter 1: Analysis period N */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="period-slider" className="text-xs font-bold text-slate-700"><MdText text={inhalt.texte.betrachtungszeitraumN} /></label>
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
                <span className="text-[9px] text-slate-400 block font-mono"><MdText text={inhalt.texte.dgnbStandardwertFürGebäude} /></span>
              </div>

              {/* Parameter 2: Discount Rate r */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="discount-slider" className="text-xs font-bold text-slate-700"><MdText text={inhalt.texte.abzinsungssatzKalkulationszinsR} /></label>
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
                <span className="text-[9px] text-slate-400 block font-mono"><MdText text={inhalt.texte.stelltDenZinseffektDar} /></span>
              </div>

              {/* Parameter 3: Energy Price escalation e */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="inflation-slider" className="text-xs font-bold text-slate-700"><MdText text={inhalt.texte.sektorEnergiepreissteigerungE} /></label>
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
                <span className="text-[9px] text-slate-400 block font-mono"><MdText text={inhalt.texte.wachstumskoeffizientFürBetrieblicheHeiz} /></span>
              </div>

              {/* Parameter 4: General Inflation i */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="geninflation-slider" className="text-xs font-bold text-slate-700"><MdText text={inhalt.texte.allgemeineInflationI} /></label>
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
                <span className="text-[9px] text-slate-400 block font-mono"><MdText text={inhalt.texte.jährlicheTeuerungsrateFürLohnarbeiten} /></span>
              </div>

              {/* Professor Huber Enhancements: CO2 & Subsidy */}
              <div className="border-t border-slate-150 pt-4 mt-2 space-y-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono"><MdText text={inhalt.texte.wissenschaftlicheParameter} /></span>

                {/* CO2 Shadow Pricing */}
                <div className="bg-[#fcf8f2] p-3 rounded-xl border border-orange-200/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="co2-toggle" className="text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer select-none">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><MdText text={inhalt.texte.coSchattenpreisTextCo} /></label>
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
                          <span className="text-[10px] font-medium text-slate-600"><MdText text={inhalt.texte.coBasispreisStart} /></span>
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
                        <span className="text-[8px] text-slate-400 block font-mono"><MdText text={inhalt.texte.ubaKostenansatzCa180} /></span>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[10px] font-medium text-slate-600"><MdText text={inhalt.texte.jährlicheCoTeuerung} /></span>
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
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span><MdText text={inhalt.texte.staatlKfwFörderung} /></label>
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
                        <span className="text-[10px] font-medium text-slate-600"><MdText text={inhalt.texte.zuschussAufOptionB} /></span>
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
                      <span className="text-[8px] text-slate-400 block font-mono"><MdText text={inhalt.texte.reduziertInvestitionskostenCapexDer} /></span>
                    </div>
                  )}
                </div>

                {/* Restwert: Standard AUS (BNB 2.1.1), Vergleich linear nach Del. VO (EU) 244/2012 */}
                <div className="bg-[#fcf8f2] p-3 rounded-xl border border-orange-200/50 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="restwert-toggle" className="text-xs font-bold text-slate-800 cursor-pointer select-none">{inhalt.texte.restwertLinearSchalter}</label>
                    <button
                      id="restwert-toggle"
                      type="button"
                      role="switch"
                      aria-checked={restwertEnabled}
                      aria-describedby="restwert-erklaerung"
                      onClick={() => setRestwertEnabled(!restwertEnabled)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shiraz ${
                        restwertEnabled ? 'bg-shiraz' : 'bg-slate-400'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          restwertEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <p id="restwert-erklaerung" className="text-[10px] text-slate-600 leading-snug"><MdText text={inhalt.texte.restwertLinearErklaerung} /></p>
                </div>
              </div>

              {/* Math context hint */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mt-2">
                <span className="font-bold text-[10px] text-slate-700 block mb-1 uppercase font-mono"><MdText text={inhalt.texte.diskontierungNpv} /></span>
                <p className="text-[11px] text-slate-600 leading-normal"><MdText text={inhalt.texte.kostenInNutzungsjahrT} /></p>
                <div className="py-2 flex justify-center text-xs">
                  <InlineMath math="F_{diskont} = \frac{(1+Inflation)^{t-1}}{(1+r)^t}" />
                </div>
                <span className="text-[9px] text-slate-400 block leading-tight"><MdText text={inhalt.texte.daRInDer} /></span>
              </div>
            </div>

            {/* Results Compare Dashboard (Right) */}
            <div className="lg:col-span-8 space-y-6">
              
              <EingabeHinweise hinweise={calcData.hinweise} />

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
                      : inhalt.werte.unterDenGewähltenFinanzrandbedingungen
                    }
                  </p>
                </div>
              </div>

              {/* Live-Rechenweg (AP 3.7) mit den aktuellen Parametern */}
              <FormulaDerivationBox
                live
                title={`Ihr Rechenweg: Barwertvergleich über ${formatDeZahl(analysisPeriod, 0)} Jahre`}
                zielGleichung="LCC = C_0 + \sum_{t=1}^{N} \frac{C_t}{(1+r)^t} + \frac{C_{\text{EOL}} - R_N}{(1+r)^N}"
                schritte={[
                  {
                    titel: inhalt.werte.ihreFinanzparameter,
                    erklaerung: inhalt.werte.kalkulationszinsREnergiepreissteigerungE,
                    formel: `r = ${formatDeTeXWert(discountRate / 100)},\\; e = ${formatDeTeXWert(energyInflation / 100)},\\; i = ${formatDeTeXWert(generalInflation / 100)},\\; N = ${formatDeTeX(analysisPeriod, 0)}\\,\\text{a}`
                  },
                  {
                    titel: inhalt.werte.betriebskostenOptionAAbzinsen,
                    erklaerung: `Die jährlichen Betriebskosten von ${formatDeZahl(activeScenario.optionA.opex0, 0)} € steigen ab dem 2. Jahr mit e (BNB 2.1.1) und werden mit r auf heute abgezinst:`,
                    formel: `\\sum_{t=1}^{${formatDeTeX(analysisPeriod, 0)}} \\frac{${formatDeTeX(activeScenario.optionA.opex0, 0)} \\cdot ${formatDeTeXWert(1 + energyInflation / 100)}^{t-1}}{${formatDeTeXWert(1 + discountRate / 100)}^t} = ${formatDeTeX(calcData.resultA.cumulativeOpExDiscounted, 0)}\\,\\text{EUR}`
                  },
                  {
                    titel: inhalt.werte.barwertOptionA,
                    erklaerung: `Investition + CO₂ (Herstellung) + Betrieb + Wartung + Ersatz + CO₂ (Nutzung) + Rückbau${restwertEnabled ? ' − Restwert (linear, Vergleich nach Del. VO (EU) 244/2012)' : ' (ohne Restwert, BNB 2.1.1)'}, jeweils als Barwert${co2PricingEnabled ? '' : inhalt.werte.coPreisInaktiv}:`,
                    formel: `LCC_A = ${texSumme([calcData.resultA.capex, calcData.resultA.initialCO2Cost, calcData.resultA.cumulativeOpExDiscounted, calcData.resultA.cumulativeMaintenanceDiscounted, calcData.resultA.cumulativeReplacementDiscounted, calcData.resultA.cumulativeCO2Discounted, calcData.resultA.eolDiscounted, -calcData.resultA.restwertDiscounted])} = ${formatDeTeX(calcData.resultA.totalLCCDiscounted, 0)}\\,\\text{EUR}`
                  },
                  {
                    titel: inhalt.werte.investitionOptionB,
                    erklaerung: subsidyEnabled
                      ? `Die KfW-Förderung von ${formatDeZahl(subsidyPercent, 0)} % mindert die Investitionskosten der Option B:`
                      : inhalt.werte.ohneFörderungGehenDie,
                    formel: subsidyEnabled
                      ? `C_{0,B} = ${formatDeTeX(activeScenario.optionB.capex, 0)} \\cdot (1 - ${formatDeTeX(subsidyPercent / 100, 2)}) = ${formatDeTeX(calcData.resultB.capex, 0)}\\,\\text{EUR}`
                      : `C_{0,B} = ${formatDeTeX(calcData.resultB.capex, 0)}\\,\\text{EUR}`
                  },
                  {
                    titel: inhalt.werte.barwertOptionB,
                    erklaerung: inhalt.werte.gleicheGliederungWieBei,
                    formel: `LCC_B = ${texSumme([calcData.resultB.capex, calcData.resultB.initialCO2Cost, calcData.resultB.cumulativeOpExDiscounted, calcData.resultB.cumulativeMaintenanceDiscounted, calcData.resultB.cumulativeReplacementDiscounted, calcData.resultB.cumulativeCO2Discounted, calcData.resultB.eolDiscounted, -calcData.resultB.restwertDiscounted])} = ${formatDeTeX(calcData.resultB.totalLCCDiscounted, 0)}\\,\\text{EUR}`
                  },
                  {
                    titel: inhalt.werte.differenzDerBarwerte,
                    erklaerung: calcData.saving >= 0 ? inhalt.werte.einPositiverWertBedeutet : inhalt.werte.einNegativerWertBedeutet,
                    formel: `\\Delta LCC = LCC_A - LCC_B = ${formatDeTeX(calcData.saving, 0)}\\,\\text{EUR}`
                  }
                ]}
                ergebnisHinweis={inhalt.werte.rundungsdifferenzenInDerLetzten}
                normQuelle={inhalt.werte.iso1568652017}
              />

              {/* Graphical representation: Visual Stacked Cost meters */}
              <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <BarChart3 size={15} className="text-shiraz" /><MdText text={inhalt.texte.strukturierteBarwertZusammensetzungLcc} /></h4>

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
                      className="bg-red-600 h-full flex items-center justify-center cursor-help"
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
                      className="bg-red-600 h-full flex items-center justify-center cursor-help"
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
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-600 rounded-xs block"></span><MdText text={inhalt.texte.anschaffungCapex} /></div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-xs block"></span><MdText text={inhalt.texte.betriebHeizungOpex} /></div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#059669] rounded-xs block"></span> CO₂-Zertifikatsteuer</div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-xs block"></span> Wartung</div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-violet-600 rounded-xs block"></span> Bauteiltausch</div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-stone-500 rounded-xs block"></span> Rückbau/Deponie/Restwert</div>
                </div>
              </div>

              {/* Side-by-side exact table breakdown */}
              <div className="bg-white rounded-2xl border border-home-grau/30 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-home-grau/25"><MdText text={inhalt.texte.detaillierteBilanzNachBarwertmethode} /></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-home-grau/20 text-[10px] text-slate-500 uppercase">
                        <th className="p-3">Kostenart</th>
                        <th className="p-3 text-right"><MdText text={inhalt.texte.optionANominal} /></th>
                        <th className="p-3 text-right font-bold bg-slate-100/60"><MdText text={inhalt.texte.optionABarwert} /></th>
                        <th className="p-3 text-right"><MdText text={inhalt.texte.optionBNominal} /></th>
                        <th className="p-3 text-right font-bold bg-indigo-50/60 text-indigo-950"><MdText text={inhalt.texte.optionBBarwert} /></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3 font-medium"><MdText text={inhalt.texte.t1ErrichtungskostenCapex} /></td>
                        <td className="p-3 text-right text-slate-500">{(activeScenario.optionA.capex).toLocaleString('de-DE')} €</td>
                        <td className="p-3 text-right font-bold bg-slate-100/30">{(activeScenario.optionA.capex).toLocaleString('de-DE')} €</td>
                        <td className="p-3 text-right text-slate-500">{(activeScenario.optionB.capex).toLocaleString('de-DE')} €</td>
                        <td className="p-3 text-right font-bold bg-indigo-50/30 text-indigo-950">{(activeScenario.optionB.capex).toLocaleString('de-DE')} €</td>
                      </tr>
                      {subsidyEnabled && (
                        <tr className="bg-blue-50/40 text-blue-900 border-b border-blue-100/30">
                          <td className="p-2.5 pl-6 font-normal text-[11px] text-blue-800 flex items-center gap-1"><MdText text={inhalt.texte.staatlKfwZuschuss} />{formatDeWert(subsidyPercent)}%)</td>
                          <td className="p-2.5 text-right text-slate-400 font-mono">- 0 €</td>
                          <td className="p-2.5 text-right font-mono bg-slate-100/20 text-slate-700">- 0 €</td>
                          <td className="p-2.5 text-right font-mono text-blue-700">- {((activeScenario.optionB.capex * subsidyPercent) / 100).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                          <td className="p-2.5 text-right font-bold font-mono bg-indigo-50/20 text-blue-800">- {((activeScenario.optionB.capex * subsidyPercent) / 100).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        </tr>
                      )}
                      <tr>
                        <td className="p-3 font-medium text-slate-750"><MdText text={inhalt.texte.t2BetriebskostenNettoOpex} /></td>
                        <td className="p-3 text-right text-slate-500">{(calcData.resultA.cumulativeOpExNominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right font-bold bg-slate-100/30">{(calcData.resultA.cumulativeOpExDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right text-slate-500">{(calcData.resultB.cumulativeOpExNominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right font-bold bg-indigo-50/30 text-indigo-950">{(calcData.resultB.cumulativeOpExDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium"><MdText text={inhalt.texte.t3LaufendeInstandhaltung} /></td>
                        <td className="p-3 text-right text-slate-500">{(calcData.resultA.cumulativeMaintenanceNominal).toLocaleString('de-DE')} €</td>
                        <td className="p-3 text-right font-bold bg-slate-100/30">{(calcData.resultA.cumulativeMaintenanceDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right text-slate-500">{(calcData.resultB.cumulativeMaintenanceNominal).toLocaleString('de-DE')} €</td>
                        <td className="p-3 text-right font-bold bg-indigo-50/30 text-indigo-950">{(calcData.resultB.cumulativeMaintenanceDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium"><MdText text={inhalt.texte.t4ErneuerungBauteiltausch} /></td>
                        <td className="p-3 text-right text-slate-500">{(calcData.resultA.cumulativeReplacementNominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right font-bold bg-slate-100/30">{(calcData.resultA.cumulativeReplacementDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right text-slate-500">{(calcData.resultB.cumulativeReplacementNominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right font-bold bg-indigo-50/30 text-indigo-950">{(calcData.resultB.cumulativeReplacementDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium"><MdText text={inhalt.texte.t5RückbauRestwertEol} /></td>
                        <td className="p-3 text-right text-slate-500">{(calcData.resultA.eolNominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right font-bold bg-slate-100/30">{(calcData.resultA.eolDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right text-slate-500">{(calcData.resultB.eolNominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        <td className="p-3 text-right font-bold bg-indigo-50/30 text-indigo-950">{(calcData.resultB.eolDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                      </tr>
                      {co2PricingEnabled && (
                        <tr className="bg-emerald-50/45 text-emerald-950 border-t border-emerald-100">
                          <td className="p-3 font-medium text-emerald-900"><MdText text={inhalt.texte.t6CoSchattenpreisKlima} /></td>
                          <td className="p-3 text-right text-slate-500 font-mono">{(calcData.resultA.initialCO2Cost + calcData.resultA.cumulativeCO2Nominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                          <td className="p-3 text-right font-bold font-mono bg-[#fcf8f2]/30 text-emerald-800">{(calcData.resultA.initialCO2Cost + calcData.resultA.cumulativeCO2Discounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                          <td className="p-3 text-right text-slate-500 font-mono">{(calcData.resultB.initialCO2Cost + calcData.resultB.cumulativeCO2Nominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                          <td className="p-3 text-right font-bold font-mono bg-indigo-50/30 text-emerald-900">{(calcData.resultB.initialCO2Cost + calcData.resultB.cumulativeCO2Discounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        </tr>
                      )}
                      {restwertEnabled && (calcData.resultA.restwertNominal > 0 || calcData.resultB.restwertNominal > 0) && (
                        <tr>
                          <td className="p-3 font-medium"><MdText text={inhalt.texte.t7RestwertLinear} /></td>
                          <td className="p-3 text-right text-slate-500">- {(calcData.resultA.restwertNominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                          <td className="p-3 text-right font-bold bg-slate-100/30">- {(calcData.resultA.restwertDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                          <td className="p-3 text-right text-slate-500">- {(calcData.resultB.restwertNominal).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                          <td className="p-3 text-right font-bold bg-indigo-50/30 text-indigo-950">- {(calcData.resultB.restwertDiscounted).toLocaleString('de-DE', {maximumFractionDigits: 0})} €</td>
                        </tr>
                      )}
                      <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-350">
                        <td className="p-3 uppercase tracking-wide text-[10px]"><MdText text={inhalt.texte.lccGesamtsummeBarwert} /></td>
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
            <Layers size={18} className="text-shiraz" /><MdText text={inhalt.texte.theorieNormungStrukturierungNach} /></h3>

          <div className="space-y-4 text-sm text-slate-800 leading-relaxed">
            <h4 className="font-bold text-slate-900 text-base"><MdText text={inhalt.texte.t1DieKostenstrukturNach} /></h4>
            <p><MdText text={inhalt.texte.fürHochbautenRegeltDie} /></p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><MdText text={inhalt.texte.kg100KapitalkostenVerzinsung} /></li>
              <li><MdText text={inhalt.texte.kg200ObjektmanagementkostenPersonal} /></li>
              <li><MdText text={inhalt.texte.kg300BetriebskostenVersorgung} /></li>
              <li><MdText text={inhalt.texte.kg400InstandsetzungskostenWiederherstell} /></li>
            </ul>

            <h4 className="font-bold text-slate-900 text-base pt-2"><MdText text={inhalt.texte.t2DieMathematischeBarwertmethode} /></h4>
            <p><MdText text={inhalt.texte.finanzmathematischWirdDerUmstand} /></p>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs my-3">
              <span className="font-bold text-slate-900 block mb-1"><MdText text={inhalt.texte.volleMathematischeLccZusammenführung} /></span>
              <BlockMath math="LCC = C_{CapEx} + \sum_{t=1}^{N} \frac{C_{OpEx, t} \cdot (1+e)^{t-1}}{(1+r)^t} + \sum \frac{C_{Maint, t} \cdot (1+i)^{t-1}}{(1+r)^t} \pm \frac{C_{End-of-Life}}{(1+r)^N} - \frac{R_N}{(1+r)^N}" />
              <div className="mt-4 text-[10px] text-slate-500 font-sans space-y-1">
                <p><MdText text={inhalt.texte.cSubCapexSub} /></p>
                <p><MdText text={inhalt.texte.cSubOpexT} /></p>
                <p><MdText text={inhalt.texte.cSubMaintT} /></p>
                <p><MdText text={inhalt.texte.cSubEndOf} /></p>
                <p><MdText text={inhalt.texte.cSubRestwert} /></p>
                <p><MdText text={inhalt.texte.preissteigerungAbJahr2} /></p>
                <p><MdText text={inhalt.texte.rAbzinsungssatzKalkulationszinssatz} /></p>
              </div>
            </div>

            <h4 className="font-bold text-slate-900 text-base pt-2"><MdText text={inhalt.texte.t3ÖkologischerÖkonomischerZielkonflikt} /></h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#f2f6fc] p-4 rounded-xl border border-blue-150">
              <div>
                <span className="font-bold text-slate-900 block mb-1"><MdText text={inhalt.texte.nationaleDgnbBnbNutzung} /></span>
                <p className="text-slate-700"><MdText text={inhalt.texte.umFürDasStaatliche} /></p>
              </div>
              <div>
                <span className="font-bold text-slate-900 block mb-1"><MdText text={inhalt.texte.wirtschaftlicheTriebfeder} /></span>
                <p className="text-slate-700"><MdText text={inhalt.texte.währendEineGünstigeInvestition} /></p>
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
        regelwerke={inhalt.daten["LCC.regelwerke"]}
        literatur={inhalt.daten["LCC.literatur"]}
        formeln={inhalt.daten["LCC.formeln"]}
      />
    </div>
  );
}
