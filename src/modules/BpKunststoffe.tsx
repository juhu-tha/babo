import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath } from 'react-katex';
import { 
  Layers, 
  Box, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ArrowUpRight, 
  Thermometer, 
  ShieldAlert, 
  BookOpen, 
  ArrowRight, 
  Lightbulb, 
  Activity, 
  Settings, 
  Wrench 
} from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';

interface PlasticType {
  id: string;
  name: string;
  short: string;
  density: number; // g/cm³
  lambda: number; // W/(m·K) (thermal conductivity)
  alpha: number; // 10^-6 / K (thermal expansion coefficient)
  tempRange: string; // temperature limits
  resistances: {
    acids: 'A' | 'B' | 'C'; // A: High, B: Medium, C: Low
    alkalis: 'A' | 'B' | 'C';
    solvents: 'A' | 'B' | 'C';
    oils: 'A' | 'B' | 'C';
    uv: 'A' | 'B' | 'C';
  };
  pros: string[];
  mainApp: string;
}

const plasticsDatabase: PlasticType[] = [
  {
    id: 'pe',
    name: 'Polyethylen (PE-HD / PE-LD)',
    short: 'PE',
    density: 0.95,
    lambda: 0.40,
    alpha: 200, // extremely high thermal expansion
    tempRange: '-50 °C bis +85 °C',
    resistances: {
      acids: 'A',
      alkalis: 'A',
      solvents: 'B',
      oils: 'B',
      uv: 'B' // Needs carbon black additives to be UV stable
    },
    pros: ['Hervorragende Zähigkeit bei Kälte', 'Geringes Gewicht', 'Keine Weichmacher', 'Physiologisch unbedenklich (Trinkwasser)'],
    mainApp: 'Dampfbremsfolien, Gas- und Trinkwasserrohre im Erdreich, Drainagefolien'
  },
  {
    id: 'pvc-u',
    name: 'Hart-PVC (Polyvinylchlorid unplastifiziert)',
    short: 'PVC-U',
    density: 1.40,
    lambda: 0.15,
    alpha: 80,
    tempRange: '0 °C bis +60 °C',
    resistances: {
      acids: 'A',
      alkalis: 'A',
      solvents: 'C',
      oils: 'A',
      uv: 'A'
    },
    pros: ['Sehr hohe mechanische Steifigkeit', 'Flammwidrig (selbstlöschend)', 'Äußerst kostengünstig', 'Lange Nutzungsdauer'],
    mainApp: 'Kanalrohre (KG-Rohre), Fensterprofile, Kabelkanäle, Regenrinnen'
  },
  {
    id: 'pp',
    name: 'Polypropylen (PP)',
    short: 'PP',
    density: 0.91,
    lambda: 0.22,
    alpha: 150,
    tempRange: '0 °C bis +100 °C (heißwasserbeständig)',
    resistances: {
      acids: 'A',
      alkalis: 'A',
      solvents: 'B',
      oils: 'B',
      uv: 'C' // Sehr empfindlich gegen UV-Strahlung ohne Stabilisierung
    },
    pros: ['Hohe Wärmeformbeständigkeit', 'Sehr gute Schlagzähigkeit', 'Hervorragend recycelbar'],
    mainApp: 'Hausabflussrohre (HT-Heißwasserrohre), Geotextilien, Fassadenbahnen'
  },
  {
    id: 'epdm',
    name: 'EPDM (Kautschuk-Elastomer)',
    short: 'EPDM',
    density: 1.20,
    lambda: 0.25,
    alpha: 160,
    tempRange: '-40 °C bis +120 °C',
    resistances: {
      acids: 'A',
      alkalis: 'A',
      solvents: 'C',
      oils: 'C',
      uv: 'A' // Phänomenale Witterungs- und Ozonstabilität
    },
    pros: ['Extreme Elastizität (>400% Dehnung)', 'Sicherer Verbund, extrem witterungs- und ozonbeständig (>50 Jahre Lebensdauer)'],
    mainApp: 'Teichfolien, Flachdachbahnen (Resitrix), Dichtungsprofile bei Fenstern'
  },
  {
    id: 'pmma',
    name: 'Acrylglas (Polymethylmethacrylat)',
    short: 'PMMA',
    density: 1.19,
    lambda: 0.19,
    alpha: 70,
    tempRange: '-40 °C bis +80 °C',
    resistances: {
      acids: 'B',
      alkalis: 'B',
      solvents: 'C',
      oils: 'B',
      uv: 'A' // Höchste UV-Stabilität und sehr gute Transparenz
    },
    pros: ['Lichtdurchlässigkeit (92%) höher als Glas', 'Hervorragende Brillanz und Farbechtheit', 'Wetterfest'],
    mainApp: 'Lärmschutzwände, Lichtkuppeln, Plexiglasscheiben, Sanitärelemente'
  },
  {
    id: 'pc',
    name: 'Polycarbonat (PC)',
    short: 'PC',
    density: 1.20,
    lambda: 0.20,
    alpha: 65,
    tempRange: '-40 °C bis +120 °C',
    resistances: {
      acids: 'A',
      alkalis: 'C',
      solvents: 'C',
      oils: 'B',
      uv: 'C' // Vergilbt ohne spezielle UV-Schutzlackierung
    },
    pros: ['Sehr hohe Schlagzähigkeit (auch für durchwurf-/durchschusshemmende Verglasungen)', 'Hohe Wärmeformbeständigkeit', 'Glasartig glänzende Optik'],
    mainApp: 'Vandalismus-Schutzverglasungen, Gewächshäuser (Stegmehrfachplatten), Schutzhelme'
  }
];

function PlasticsThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  const handleDauerhaftigkeitClick = () => {
    localStorage.setItem('dauerhaftigkeit_subtab', 'kunststoffe');
    setActiveTab('dauerhaftigkeit');
  };

  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">
          Material-Lehrpfad: Kunststoffe im Bauwesen
        </h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5">
          Weiter zu den anderen Teilen des Lehrpfads:
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('kunststoffe')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span>1. Baustoff-Eigenschaften</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Thermoplasten vs. Duroplasten, E-Modul-Temperatur-Scherkurven & Arten.
          </span>
          {current !== 'baustoff' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_kunststoffe')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span>2. Mechanik & Rechner</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            PE-HD Folien, PVC-U Rohre, Flachdachbahnen (EPDM) & Dehnungsrechner.
          </span>
          {current !== 'bauprodukt' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={handleDauerhaftigkeitClick}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span>3. Alterung & Dauerhaftigkeit</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            UV-Verspödung, Weichmacher-Auswaschung, Spannungsrisse & thermische Alterung.
          </span>
          {current !== 'dauerhaftigkeit' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default function BpKunststoffe() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'synthese' | 'viskoelastizitaet' | 'systeme' | 'rechner' | 'praxis' | 'innovation'>('allgemein');
  const [selectedPlastic, setSelectedPlastic] = useState<PlasticType>(plasticsDatabase[0]);

  // Thermischer Ausdehnungsrechner States
  const [length, setLength] = useState<number>(10.0); // m
  const [tempDelta, setTempDelta] = useState<number>(50); // Kelvin / °C (bspw. Einbautemperatur 15°C zu Höchsttemperatur 65°C im Sommer unter Blech)
  const [comparativePlastic, setComparativePlastic] = useState<string>('pe');

  // Burgers-Modell Simulation States
  const [burgersPolymer, setBurgersPolymer] = useState<'pe' | 'pvc' | 'pmma' | 'epdm'>('pe');
  const [burgersStress, setBurgersStress] = useState<number>(5); // MPa
  const [burgersTime, setBurgersTime] = useState<number>(100); // Stunden

  // Find object for thermal comparison
  const compObj = plasticsDatabase.find((x) => x.id === comparativePlastic) || plasticsDatabase[0];

  // Elongations: Delta_L = alpha * L * delta_T (10^-6 * m * K -> mm)
  const elongationPlastic = compObj.alpha * length * tempDelta * 0.001; // mm
  const elongationSteel = 12 * length * tempDelta * 0.001; // mm (Steel ~ 12)
  const elongationConcrete = 10 * length * tempDelta * 0.001; // mm (Concrete ~ 10)

  // Burgers calculation
  const burgersParams = {
    pe: { 
      name: 'PE-HD (Polyethylen)', 
      E1: 1000, 
      E2: 700, 
      eta1: 35000, 
      eta2: 1200, 
      desc: 'Hohe Kriechneigung. Zeigt unter Dauerlast erhebliche viskositäre Verformungen sowie verzögerte Rückstellkräfte.' 
    },
    pvc: { 
      name: 'PVC-U (Hart-PVC)', 
      E1: 3000, 
      E2: 2400, 
      eta1: 180000, 
      eta2: 8000, 
      desc: 'Sehr formstabil im baurelevanten Temperaturbereich. Geringes viskoses Fließen und hohe Eigendämpfung.' 
    },
    pmma: { 
      name: 'PMMA (Acrylglas)', 
      E1: 3300, 
      E2: 3800, 
      eta1: 320000, 
      eta2: 15000, 
      desc: 'Hohe Steifigkeit und Festigkeit. Weist die geringsten Langzeit-Deformationszuwächse bei normaler Beanspruchung auf.' 
    },
    epdm: { 
      name: 'EPDM (Präzipitierter Kautschuk)', 
      E1: 6, 
      E2: 4, 
      eta1: 250, 
      eta2: 15, 
      desc: 'Sehr geringe Steifigkeit; großer gummielastischer Dehnbereich.' 
    }
  };

  const currentBurgers = burgersParams[burgersPolymer];
  
  // Math: Burgers Strain formula: epsilon(t) = sigma_0/E_1 + sigma_0/eta_1 * t + sigma_0/E_2 * (1 - exp(-E_2/eta_2 * t))
  // We represent strain in % (so multiplying by 100)
  const strainElastic = (burgersStress / currentBurgers.E1) * 100; // in %
  const strainViscous = ((burgersStress / currentBurgers.eta1) * burgersTime) * 100; // in %
  const exponentMultiplier = currentBurgers.E2 / currentBurgers.eta2;
  const strainDelayed = ((burgersStress / currentBurgers.E2) * (1 - Math.exp(-exponentMultiplier * burgersTime))) * 100; // in %
  const strainTotal = strainElastic + strainDelayed + strainViscous; // in %

  // Resistance rating renderer helper
  const renderRating = (r: 'A' | 'B' | 'C') => {
    switch (r) {
      case 'A':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-sans text-xs font-bold leading-none">
            <CheckCircle2 size={13} className="text-emerald-600" />
            Hochbeständig (A)
          </span>
        );
      case 'B':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md font-sans text-xs font-bold leading-none animate-pulse">
            <Info size={13} className="text-amber-600" />
            Bedingt beständig (B)
          </span>
        );
      case 'C':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-md font-sans text-xs font-bold leading-none">
            <AlertTriangle size={13} className="text-rose-600" />
            Ungeeignet (C)
          </span>
        );
    }
  };

  return (
    <div id="bp-kunststoffe-module" className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Introduction Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-shiraz uppercase tracking-wider block">Fachmodul</span>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              Bauprodukte: Synthetische Kunststoffe
            </h2>
          </div>
        </div>
        <p className="text-sm text-text-main/80 leading-relaxed font-normal">
          Synthetische Bauprodukte auf Polymerbasis zeichnen sich durch flexibel modifizierbare Kennwertekombinationen aus. Die mechanisch-thermische Stabilität beruht direkt auf chemischen Reaktionstypen und molekularen Vernetzungsarchitekturen. Im Bauwesen erfordern kunststofftypische Merkmale wie <strong>photochemischer Strahlungungsabbau</strong>, <strong>Weichmachermigration</strong> und <strong>Ausflussspannungswiderstand (Viskoelastizität)</strong> differenzierte Planungsregeln und Systemkenntnisse.
        </p>

        {/* Tab Navigation Menu */}
        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-home-grau/20 mt-6 -mx-6 px-6">
          <button aria-pressed={activeTab === 'allgemein'}
            className={`px-3 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 border cursor-pointer ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <BookOpen size={14} /> Materialdatenbank
          </button>

          <button aria-pressed={activeTab === 'synthese'}
            className={`px-3 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 border cursor-pointer ${
              activeTab === 'synthese' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('synthese')}
          >
            <Settings size={14} /> 1. Synthesen & Chemie
          </button>

          <button aria-pressed={activeTab === 'viskoelastizitaet'}
            className={`px-3 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 border cursor-pointer ${
              activeTab === 'viskoelastizitaet' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('viskoelastizitaet')}
          >
            <Activity size={14} /> 2. Burgers-Kriechmodell
          </button>

          <button aria-pressed={activeTab === 'systeme'}
            className={`px-3 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 border cursor-pointer ${
              activeTab === 'systeme' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('systeme')}
          >
            <Wrench size={14} /> 3. Bausysteme & Produkte
          </button>

          <button aria-pressed={activeTab === 'rechner'}
            className={`px-3 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 border cursor-pointer ${
              activeTab === 'rechner' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('rechner')}
          >
            <Thermometer size={14} /> 4. Längenrechner
          </button>

          <button aria-pressed={activeTab === 'praxis'}
            className={`px-3 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 border cursor-pointer ${
              activeTab === 'praxis' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('praxis')}
          >
            <CheckCircle2 size={14} /> Praxisbeispiele
          </button>

          <button aria-pressed={activeTab === 'innovation'}
            className={`px-3 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 border cursor-pointer ${
              activeTab === 'innovation' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('innovation')}
          >
            <Lightbulb size={14} /> Zukunftstrends
          </button>
        </div>
      </div>

      {activeTab === 'allgemein' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          {/* Left selector */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-text-main/50 uppercase tracking-wider block">Synthetische Werkstoff-Auswahl:</span>
            <div className="flex flex-col gap-2">
              {plasticsDatabase.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlastic(p)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex justify-between items-center ${
                    selectedPlastic.id === p.id
                      ? 'bg-shiraz text-white border-shiraz shadow-md scale-[1.01]'
                      : 'bg-white text-text-main hover:bg-slate-50 border-home-grau/30 shadow-sm'
                  }`}
                >
                  <div>
                    <span className={`text-[9px] uppercase font-mono font-bold tracking-wider block ${selectedPlastic.id === p.id ? 'text-white/60' : 'text-text-main/40'}`}>
                      {p.short}
                    </span>
                    <span className="font-extrabold text-sm">{p.name}</span>
                  </div>
                  <ArrowUpRight size={15} className={`opacity-70 ${selectedPlastic.id === p.id ? 'translate-x-0.5 -translate-y-0.5' : ''} transition-transform`} />
                </button>
              ))}
            </div>

            <div className="bg-emerald-50/40 p-4 border border-emerald-200/50 rounded-xl space-y-2 text-xs text-emerald-900 leading-relaxed mt-4">
              <div className="flex gap-1.5 items-center font-bold">
                <ShieldAlert size={14} className="text-emerald-800" />
                <span>Weichmacher-Migration beachten!</span>
              </div>
              <p className="font-normal text-[11px] text-emerald-950/80 leading-relaxed">
                Bei direktem Kontakt von <strong>EPS-Dämmstoffen</strong> mit <strong>Weich-PVC-Folien (PVC-P)</strong> wandern Weichmacher in das EPS. Die PVC-Bahn schrumpft und versprödet, das EPS wird angelöst. <strong>Konstruktion:</strong> Trennlage zwischen PVC-P und EPS vorsehen (z. B. Glasvlies; Flächengewicht nach Herstellerangabe).
              </p>
            </div>
          </div>

          {/* Right Details Panel */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
            <div className="border-b border-home-grau/15 pb-4 flex justify-between items-start flex-wrap gap-2">
              <div>
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">WERKSTOFFBEWERTUNG</span>
                <h3 className="text-lg font-extrabold text-text-main">{selectedPlastic.name}</h3>
              </div>
              <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-home-grau/10 text-right">
                <span className="text-[10px] text-text-main/40 block leading-tight">Ausdehnungskoeff. α</span>
                <span className="text-sm font-bold text-slate-800 font-mono">{formatDeWert(selectedPlastic.alpha)} × 10⁻⁶/K</span>
              </div>
            </div>

            {/* Quick Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1">Dichte (Haftgewicht)</span>
                <span className="text-sm font-bold font-mono text-slate-800">{formatDeZahl(selectedPlastic.density, 2)} g/cm³</span>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1">Thermische Leitfähigkeit λ</span>
                <span className="text-sm font-bold font-mono text-slate-800">{formatDeZahl(selectedPlastic.lambda, 2)} W/(m·K)</span>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1">Einsatztemperatur (lim.)</span>
                <span className="text-xs font-bold text-slate-800 leading-normal block mt-1">{selectedPlastic.tempRange}</span>
              </div>
            </div>

            {/* Chemical Resistances Dashboard */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-text-main/60 uppercase block tracking-wider">Chemische &amp; Mediale Beständigkeit:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                <div className="bg-slate-50/50 p-2.5 rounded-xl border border-home-grau/30 flex flex-col justify-between items-center text-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-text-main/50">Säuren</span>
                  {renderRating(selectedPlastic.resistances.acids)}
                </div>
                <div className="bg-slate-50/50 p-2.5 rounded-xl border border-home-grau/30 flex flex-col justify-between items-center text-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-text-main/50">Laugen / Alkalis</span>
                  {renderRating(selectedPlastic.resistances.alkalis)}
                </div>
                <div className="bg-slate-50/50 p-2.5 rounded-xl border border-home-grau/30 flex flex-col justify-between items-center text-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-text-main/50">Lösemittel</span>
                  {renderRating(selectedPlastic.resistances.solvents)}
                </div>
                <div className="bg-slate-50/50 p-2.5 rounded-xl border border-home-grau/30 flex flex-col justify-between items-center text-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-text-main/50">Öle &amp; Fette</span>
                  {renderRating(selectedPlastic.resistances.oils)}
                </div>
                <div className="bg-slate-50/50 p-2.5 rounded-xl border border-home-grau/30 flex flex-col justify-between items-center text-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-text-main/50">UV- &amp; Ozon</span>
                  {renderRating(selectedPlastic.resistances.uv)}
                </div>
              </div>
            </div>

            {/* Pros & Core Applications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-home-grau/30">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-800 uppercase block tracking-wider">Werkstoff-Vorteile:</span>
                <ul className="space-y-1">
                  {selectedPlastic.pros.map((p, i) => (
                    <li key={i} className="text-xs text-text-main/80 flex gap-1.5 items-start font-normal leading-relaxed">
                      <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2 bg-slate-50/70 p-3 rounded-xl border border-home-grau/30">
                <span className="text-xs font-bold text-text-main/50 uppercase block">Primäre Bauprodukt-Verwendung:</span>
                <p className="text-xs font-bold text-slate-800 leading-relaxed">
                  {selectedPlastic.mainApp}
                </p>
                <span className="text-[10px] text-text-main/50 leading-relaxed mt-1 block font-normal leading-normal">
                  Im erdberührten Bauwerksschutz sind thermo-mechanische Spannungen aufgrund hoher Verlegungspräzision gering zu halten (Längsdehnung!).
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Chemische Synthesen */}
      {activeTab === 'synthese' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-850 mb-2 flex items-center gap-2">
              <Settings className="text-shiraz" size={20} /> Synthesereaktionen & Reaktionsmechanismen
            </h3>
            <p className="text-xs text-text-main/80 leading-relaxed">
              Kunststoffe werden durch kovalente Verknüpfung niedermolekularer Monomere zu langkettigen Makromolekülen synthetisiert. Die Herstellungsreaktionen bestimmen im hohen Maße das chemische Tragwerk (Kettenaufbau, Reinheit, Restmonomeranteile) und werden in drei Fundamentalpfade unterteilt:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Polymerisation */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                    Polymerisation
                  </span>
                  <span className="text-xs font-semibold text-slate-400 font-mono">Keine Spaltprodukte</span>
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm mb-2">Kettenpolymerisation (C=C Öffnung)</h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4">
                  Doppelbindungen ungesättigter Monomere werden thermisch oder katalytisch (freies Radikal <InlineMath math="R^\bullet" />) aufgebrochen. Die Monomere lagern sich in einer schnellen Kettenreaktion kontinuierlich an, ohne dass kleine Spaltmoleküle abgespalten werden.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-[10px] block">CHEMISCHE MATRIX</span>
                  <code className="text-shiraz font-mono block text-[11px]">n CH₂=CH-Cl → -[CH₂-CHCl]-n</code>
                  <span className="text-[10px] text-slate-500 block">Reines Polymerohne verbleibende Abgase.</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold block uppercase text-slate-400">Reale Systeme &amp; Industriemarken</span>
                <div className="text-xs space-y-1 text-slate-700">
                  <p>• <strong>KG-Kanalgrundrohr (z. B. Ostendorf als Beispiel):</strong> PVC-U Abwasserrohre</p>
                  <p>• <strong>PE-HD-Entwässerungssystem (z. B. Geberit als Beispiel):</strong> Entwässerungssysteme im Industriebau</p>
                  <p>• <strong>Feuchtevariable Dampfbremsbahn (z. B. Pro Clima Intello als Beispiel):</strong> Feuchtevariable PE-Polymerbahnen</p>
                </div>
              </div>
            </div>

            {/* Polyaddition */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                    Polyaddition
                  </span>
                  <span className="text-xs font-semibold text-slate-400 font-mono">H-Umlagerung, Rein</span>
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm mb-2">Stufenaddition (Hydrogen-Shift)</h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4">
                  Reaktion von Monomeren mit unterschiedlichen funktionellen Endgruppen (z.B. Isocyanate und Alkohole). Die Bindung entsteht durch Umlagerung von Wasserstoffatomen. Es spalten sich auch hier keine Nebenprodukte ab. Das Polymer ist sofort homogen.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-[10px] block">CHEMISCHE MATRIX</span>
                  <code className="text-shiraz font-mono block text-[10px]">O=C=N-R-N=C=O + HO-R'-OH → [Urethanbrücken]</code>
                  <span className="text-[10px] text-slate-500 block">Verzögerungsfreie Vernetzung unter Hitze/Druck.</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold block uppercase text-slate-400">Systemlösungen der Praxis</span>
                <div className="text-xs space-y-1 text-slate-700">
                  <p>• <strong>PIR-Dauerschäumungen:</strong> Polyurethan-Hartschaum (<InlineMath math="\lambda = 0{,}022\text{ W/(m}\cdot\text{K)}" />)</p>
                  <p>• <strong>CFK-Verstärkungslamellen:</strong> Epoxidharz-gebundene CFK-Lamellen</p>
                  <p>• <strong>2K-Epoxidschutzschichten:</strong> Reaktionsharzbeschichtungen für befahrbare Parkdecks</p>
                </div>
              </div>
            </div>

            {/* Polykondensation */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                    Polykondensation
                  </span>
                  <span className="text-xs font-semibold text-slate-400 font-mono">Abspaltung (H₂O, HCl)</span>
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm mb-2">Kondensationspolymerisation (Step-Growth)</h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4">
                  Monomere reagieren unter obligatorischer Abspaltung eines niedermolekularen Spaltprodukts (oft Wasser H₂O oder Chlorwasserstoff HCl). Die Reaktion erfordert lange Verweilzeiten und ist thermodynamisch reversibel (Achtung vor Hydrolyse im feuchten Zustand!).
                </p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-[10px] block">CHEMISCHE MATRIX</span>
                  <code className="text-shiraz font-mono block text-[11px]">R-COOH + R\'-NH₂ → R-CO-NH-R\' + H₂O ↑</code>
                  <span className="text-[10px] text-slate-500 block">Das abgeführte Wasser muss abgesaugt werden.</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold block uppercase text-slate-400">Systemlösungen der Praxis</span>
                <div className="text-xs space-y-1 text-slate-700">
                  <p>• <strong>Polyamid-Verbindungselemente:</strong> Konstruktionen aus Polyamid 6 (Nylon-Kondensat)</p>
                  <p>• <strong>Phenolharz-Hartschaumplatten:</strong> Hochleistungsträger für schlanke Wärmeschutzkerne</p>
                  <p>• <strong>Feuchtigkeitsvernetzendes Silicon:</strong> Elastischer B1-Fugenfüllstoff</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Viskoelastizität & Burgers-Modell */}
      {activeTab === 'viskoelastizitaet' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm space-y-3">
            <h3 className="text-lg font-extrabold text-slate-850 flex items-center gap-2">
              <Activity className="text-shiraz" size={20} /> Viskoelastizität &amp; Das Burgers-Vier-Element-Modell
            </h3>
            <p className="text-xs text-text-main/80 leading-relaxed font-normal">
              Im Gegensatz zu ideal-elastischen mineralischen Baustoffen (Zementstein, Stahl) reagieren feste Kunststoffe stark zeitabhängig auf Biege- und Druckspannungen. Unter gleichbleibender mechanischer Spannung steigt die viskoelastische Verformung kontinuierlich. Das **Burgers-Modell** (Kombination aus einer Maxwell-Einheit und einer Kelvin-Voigt-Einheit in Reihe) beschreibt dieses Verhalten präzise mit vier Parametern:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-center">
                <span className="text-[10px] text-blue-900 font-bold block uppercase leading-none mb-1">Feder E₁ (Maxwell)</span>
                <span className="text-xs font-semibold text-slate-700">Sofort-elastische Dehnung (reversibel)</span>
              </div>
              <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100 text-center">
                <span className="text-[10px] text-purple-900 font-bold block uppercase leading-none mb-1">Dämpfer η₁ (Maxwell)</span>
                <span className="text-xs font-semibold text-slate-700">Viskoses Fließen (irreversibel / plastisch)</span>
              </div>
              <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100 text-center">
                <span className="text-[10px] text-amber-900 font-bold block uppercase leading-none mb-1">Feder E₂ (Kelvin)</span>
                <span className="text-xs font-semibold text-slate-700">Rückstellfeder zur verzögerten Elastik</span>
              </div>
              <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 text-center">
                <span className="text-[10px] text-emerald-900 font-bold block uppercase leading-none mb-1">Dämpfer η₂ (Kelvin)</span>
                <span className="text-xs font-semibold text-slate-700">Verzögerungselement der viskoelastischen Relevanz</span>
              </div>
            </div>
          </div>

          {/* Rheologisches SVG Schaubild */}
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-slate-800">Rheologischer Modellaufbau</h4>
            <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="w-full md:w-1/3 flex justify-center py-2">
                <svg width="220" height="150" viewBox="0 0 220 150" className="opacity-90">
                  {/* Outer Frame */}
                  <line x1="110" y1="10" x2="110" y2="25" stroke="#475569" strokeWidth="2" />
                  
                  {/* Hookean Spring E1 */}
                  <path d="M 110 25 L 110 30 L 100 35 L 120 40 L 100 45 L 120 50 L 100 55 L 120 60 L 110 65 L 110 70" fill="none" stroke="#A3113E" strokeWidth="2" />
                  <text x="135" y="48" fontSize="11" fontWeight="bold" fill="#A3113E" className="font-mono">E₁</text>
                  
                  {/* Intermediate connection */}
                  <line x1="110" y1="70" x2="110" y2="80" stroke="#475569" strokeWidth="2" />
                  
                  {/* Kelvin-Voigt Parallel Block */}
                  <line x1="60" y1="80" x2="160" y2="80" stroke="#475569" strokeWidth="2" />
                  
                  {/* Kelvin Branch 1 (Spring E2) */}
                  <line x1="75" y1="80" x2="75" y2="90" stroke="#475569" strokeWidth="2" />
                  <path d="M 75 90 L 75 92 L 67 95 L 83 98 L 67 101 L 83 104 L 67 107 L 83 110 L 75 113 L 75 115" fill="none" stroke="#475569" strokeWidth="2" />
                  <line x1="75" y1="115" x2="75" y2="125" stroke="#475569" strokeWidth="2" />
                  <text x="50" y="105" fontSize="11" fontWeight="bold" fill="#475569" className="font-mono">E₂</text>
                  
                  {/* Kelvin Branch 2 (Dashpot eta2) */}
                  <line x1="145" y1="80" x2="145" y2="92" stroke="#475569" strokeWidth="2" />
                  {/* Dashpot cup */}
                  <path d="M 135 102 L 135 112 L 155 112 L 155 102" fill="none" stroke="#334155" strokeWidth="2" />
                  {/* Dashpot blade */}
                  <line x1="145" y1="92" x2="145" y2="105" stroke="#334155" strokeWidth="2" />
                  <line x1="138" y1="105" x2="152" y2="105" stroke="#334155" strokeWidth="2" />
                  <line x1="145" y1="112" x2="145" y2="125" stroke="#475569" strokeWidth="2" />
                  <text x="165" y="105" fontSize="11" fontWeight="bold" fill="#334155" className="font-mono">η₂</text>
                  
                  {/* Bottom parallel unification */}
                  <line x1="60" y1="125" x2="160" y2="125" stroke="#475569" strokeWidth="2" />
                  <line x1="110" y1="125" x2="110" y2="135" stroke="#475569" strokeWidth="2" />
                  
                  {/* Dashpot eta1 */}
                  {/* Dashpot cup */}
                  <path d="M 100 137 L 100 144 L 120 144 L 120 137" fill="none" stroke="#64748b" strokeWidth="2" />
                  {/* Dashpot blade */}
                  <line x1="110" y1="131" x2="110" y2="141" stroke="#64748b" strokeWidth="2" />
                  <line x1="104" y1="141" x2="116" y2="141" stroke="#64748b" strokeWidth="2" />
                  <text x="135" y="141" fontSize="11" fontWeight="bold" fill="#64748b" className="font-mono">η₁</text>
                </svg>
              </div>
              <div className="w-full md:w-2/3 space-y-2 text-xs">
                <span className="font-bold text-slate-800 block">Kriech-Mathematik für Bauteilprüfungen:</span>
                <p className="leading-relaxed font-normal">
                  Die Kriechgleichung ermittelt die resultierende Gesamtdehnung <InlineMath math="\varepsilon(t)" /> im Belastungsverlauf:
                </p>
                <div className="bg-white p-3 rounded border border-slate-200 text-center py-2.5">
                  <code className="text-shiraz font-semibold font-mono text-xs sm:text-sm">
                    ε(t) = σ₀/E₁ + (σ₀/η₁)·t + (σ₀/E₂)·[1 - e^(-(E₂/η₂)·t)]
                  </code>
                </div>
                <div className="pt-1.5 space-y-1 text-[11px] text-slate-650 leading-relaxed font-normal">
                  <p>• <strong>σ₀/E₁:</strong> Spontanelastischer, voll-reversibler Dehnweg beim Erstkontakt.</p>
                  <p>• <strong>(σ₀/η₁)·t:</strong> Unbegrenzt ansteigendes viskoses Fließen (bleibt dauerhaft als Verzug bestehen).</p>
                  <p>• <strong>(σ₀/E₂)·[1 - e^(-t/τ)]:</strong> Verzögerte gummielastische Dehnung mit der Retardationszeit t_ret = η₂/E₂.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Burgers Simulation Calculator */}
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
            <h4 className="font-extrabold text-slate-850 text-sm border-b border-slate-100 pb-2">
              Kriech-Simulator (Dehnungsberechnung unter konstanten Dauerlasten)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Sliders Area */}
              <div className="md:col-span-5 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-main flex items-center justify-between">
                    <span>1. Werkstoff wählen:</span>
                    <span className="text-xs text-shiraz font-mono font-bold">{currentBurgers.name}</span>
                  </label>
                  <select
                    value={burgersPolymer}
                    onChange={(e) => setBurgersPolymer(e.target.value as typeof burgersPolymer)}
                    className="w-full p-2.5 border border-home-grau/30 rounded-lg bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-shiraz"
                  >
                    <option value="pe">PE-HD (Polyethylen) - Weich, hohe kriech-viskose Trägheit</option>
                    <option value="pvc">PVC-U (Hart-PVC) - Steif, gute Langlebigkeit</option>
                    <option value="pmma">PMMA (Acrylglas) - Hochsteif, niedrigster Kriechfaktor</option>
                    <option value="epdm">EPDM (Kautschuk) - Reines elastomeres Zugband</option>
                  </select>
                  <span className="text-[10px] text-slate-400 block leading-tight mt-1">{currentBurgers.desc}</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <label className="text-text-main">2. Zugspannung (Konstantlast σ₀):</label>
                    <span className="text-shiraz font-mono font-bold">{formatDeZahl(burgersStress, 1)} MPa</span>
                  </div>
                  <input 
                    type="range" 
                    min="1.0" 
                    max="20.0" 
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    step="0.5"
                    value={burgersStress}
                    onChange={(e) => setBurgersStress(Number(e.target.value))}
                  />
                  <span className="text-[10px] text-slate-400 block leading-none">Lastniveau im Inneren von Rohrleitungen oder Tragprofilen.</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <label className="text-text-main">3. Standzeit / Lastzeitraum (t):</label>
                    <span className="text-shiraz font-mono font-bold">{formatDeWert(burgersTime)} Stunden</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="500" 
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    step="5"
                    value={burgersTime}
                    onChange={(e) => setBurgersTime(Number(e.target.value))}
                  />
                  <span className="text-[10px] text-slate-400 block leading-none">Intervall zur Veranschaulichung des fortlaufenden Kriechverhaltens.</span>
                </div>
              </div>

              {/* Outputs Area */}
              <div className="md:col-span-7 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-700 uppercase block">Berechnungsdaten (ε-Anteile) nach {formatDeWert(burgersTime)} Stunden:</span>
                  
                  {/* Results bars stack representation */}
                  <div className="space-y-3.5">
                    
                    {/* Elastic Strain */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-600 rounded-full inline-block"></span>Sofortelastisch (reversible ε_elastic):</span>
                        <span className="font-mono font-bold text-red-600">{formatDeZahl(strainElastic, 4)} %</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${Math.min(100, (strainElastic / strainTotal) * 100)}%` }}></div>
                      </div>
                    </div>

                    {/* Delayed elastic strain */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span>Verzögert-elastisch (Viskoelastisches ε_delayed):</span>
                        <span className="font-mono font-bold text-amber-500">{formatDeZahl(strainDelayed, 4)} %</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${Math.min(100, (strainDelayed / strainTotal) * 100)}%` }}></div>
                      </div>
                    </div>

                    {/* Viscous flow */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-purple-600 rounded-full inline-block"></span>Zähflüssige Gleitung (irreversibles ε_viscous):</span>
                        <span className="font-mono font-bold text-purple-600">{formatDeZahl(strainViscous, 4)} %</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 transition-all duration-300" style={{ width: `${Math.min(100, (strainViscous / strainTotal) * 100)}%` }}></div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Total results callout block */}
                <div className="bg-white p-4 rounded-xl border border-slate-300 mt-4 flex flex-col justify-between sm:flex-row items-center gap-4">
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">Gesamtdehnung (ε_total)</span>
                    <span className="text-xl font-black text-rose-800 leading-tight block">{formatDeZahl(strainTotal, 3)} %</span>
                    <span className="text-[9px] text-slate-400 font-medium leading-none block mt-0.5">Dauerhafte Kriechverformung: {formatDeZahl((strainViscous), 3)}%</span>
                  </div>
                  <div className="bg-rose-50 text-rose-950 px-3.5 py-2 rounded-lg border border-rose-100 text-[11px] leading-relaxed max-w-[280px] font-normal">
                    <strong>Hinweis:</strong> Unter Dauerlast sinkt der wirksame Modul (Kriechmodul E_c) von Kunststoffen deutlich – je nach Werkstoff, Temperatur und Dauer auf einen Bruchteil des Kurzzeitwerts. Für Langzeitnachweise ist daher der Kriechmodul anzusetzen.
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 3: Bausysteme & Markenprodukte */}
      {activeTab === 'systeme' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-850 mb-2 flex items-center gap-2">
              <Wrench className="text-shiraz" size={20} /> Baupraktische Bausysteme &amp; Kommerzielle Markenprodukte
            </h3>
            <p className="text-xs text-text-main/80 leading-relaxed font-normal">
              In der Bauplanung wird selten vom reinen Rohpolymer gesprochen, sondern von zugelassenen, anwendungsbereiten Baustoffsystemen. Die folgende Zusammenstellung listet die wichtigsten bauaufsichtlich geprüften Systeme auf, namentlich zugeordnet zu den führenden Branchen-Klassikern:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Rohrleitungen */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-shiraz text-[10px] font-extrabold uppercase tracking-wider block mb-1">Infrastruktur &amp; Haustechnik</span>
                <h4 className="font-extrabold text-slate-800 text-sm mb-3">Thermodimensionierte Rohrleitungssysteme</h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4 font-normal">
                  Kanalisationen im Erdreich verlangen hohe Ringsteifigkeiten, während haustechnische Abflussleitungen heißwasser-resistent bis 95 °C sein müssen. Trinkwasser-Installationen erfordern hygienisch geeignete Werkstoffe (UBA-Bewertungsgrundlagen) und Flexibilität.
                </p>
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <div className="text-xs">
                    <strong className="block text-slate-800">HT-Abflussrohr (Polypropylen, z. B. Ostendorf als Beispiel)</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">Werkstoff: PP (Polypropylen, grau) für den Heißwasser-Innenbereich. Beständig gegen alkalische Medien.</span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800">KG-Kanalrohr (PVC-U, z. B. Ostendorf als Beispiel)</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">Werkstoff: Unplastifiziertes PVC (ziegelrot) mit hoher Ringsteifigkeit (SN4/SN8) für den Erdkabel- und Kanalbau.</span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800">PE-Xa-Installationssystem (z. B. REHAU RAUTITAN als Beispiel)</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">Werkstoff: PE-Xa (Vernetztes Polyethylen). Sehr zähes Rohr, z. B. mit Schiebehülsen-Verbindung, für Trinkwasser- und Heizungsinstallationen.</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PROFI-REGEL</span>
                <p className="text-[10px] text-slate-700 leading-normal font-medium">Warmwasserleitungen aus Kunststoff dehnen sich durch Temperatur deutlich aus. Fest- und Gleitpunkte sowie Dehnungsausgleich einplanen.</p>
              </div>
            </div>

            {/* Dämmstoffe */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-shiraz text-[10px] font-extrabold uppercase tracking-wider block mb-1">Wärmeschutz &amp; Perimeter</span>
                <h4 className="font-extrabold text-slate-800 text-sm mb-3">Schäumbare Thermoplaste &amp; Duroplaste</h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4 font-normal">
                  Wärmedämmstoffe unterscheiden sich in ihrer Druckbelastbarkeit und Wasseraufnahmefähigkeit. Perimeterdämmungen im nassen Erdreich erfordern geschlossenzellige Porenstrukturen, während Flachabdichtungen geringste Leitfähigkeiten einfordern.
                </p>
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <div className="text-xs">
                    <strong className="block text-slate-800">Spezifische XPS-Platten</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">Werkstoff: Extrudiertes Polystyrol (XPS). Hohe Druckfestigkeit (≥ 300 kPa), sehr geringe Wasseraufnahme, für Perimeterdämmung geeignet (Anwendung im Grundwasser nach Zulassung).</span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800">Spezifische EPS-Platten</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">Werkstoff: Expandiertes Polystyrol (EPS). Geschlossenzellig, sehr wirtschaftlich für WDVS-Fassaden. Empfindlich bei Dauernässe.</span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800">PIR-Hartschaumplatten (Standard-Werte)</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">Werkstoff: Polyisocyanurat-Hartschaum (Duroplast). Dünne Platten mit sehr guter Dämmwirkung (λ ab ca. 0,022 W/(m·K), mit Alu-Kaschierung).</span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800">Phenolharz-Resolhartschaum (Standard-Werte)</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">Werkstoff: Phenolformaldehyd-Resolhartschaum (λ = 0,021 W/(m·K)) für schlankeste Außendämmung. Hoher Brandschutz (B1).</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PROFI-REGEL</span>
                <p className="text-[10px] text-slate-700 leading-normal font-medium">XPS besitzt eine raue gaufrierte Oberfläche zur sicheren Putzhaftung im Perimeterbereich.</p>
              </div>
            </div>

            {/* Dichtungsbahnen */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-shiraz text-[10px] font-extrabold uppercase tracking-wider block mb-1">Bauwerksabdichtung (Flachdach)</span>
                <h4 className="font-extrabold text-slate-800 text-sm mb-3">Dauerhafte Abdichtungsorgane</h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4 font-normal">
                  Flachdachabdichtungen sind extremen Witterungszyklen (≥ 80 °C im Sommer unter Strahlung, ≤ -20 °C im Winter) sowie Ozonkonzentrationen ausgesetzt. Nur hochstabilisierte flexible Membranen gewährleisten Standzeiten über 40 Jahre.
                </p>
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <div className="text-xs">
                    <strong className="block text-slate-800">Mehrlagige EPDM-Dichtungsbahn (selbstklebend)</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">Werkstoff: EPDM (Ethylen-Propylen-Dien-Mischpolymerisat) teils mit selbstklebender Unterseite. Sehr alterungsbeständig und wurzelfest (Nutzungsdauer nach Herstellerangaben mehrere Jahrzehnte).</span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800">FPO-Dichtungsbahn (FPO / TPO)</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">Werkstoff: Flexible Polyolefine. Ökologisch rückbaufähig, chlor- und halogenfrei, Heißluft-Schmelzschweißung an den Stoßkanten.</span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800">Weich-PVC-Dichtungsbahn (PVC-P)</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">Werkstoff: Weichgemachtes PVC. Wirtschaftlichste Flachdachbahnsorte. Enthält Weichmacher, die über Jahrzehnte diffundieren können.</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PROFI-REGEL</span>
                <p className="text-[10px] text-slate-700 leading-normal font-medium">Beim Überlappen von PVC-Bahnen auf bituminösen Vorgängerbahnen unbdingt mechanische Vliestrennlagen vorsehen (Migration!).</p>
              </div>
            </div>

            {/* Flüssigabdichtung & Epoxide */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-shiraz text-[10px] font-extrabold uppercase tracking-wider block mb-1">Sanierung &amp; Harzsysteme</span>
                <h4 className="font-extrabold text-slate-800 text-sm mb-3">Reaktionsharz-Flüssigkunststoffe</h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4 font-normal">
                  Komplizierte Sockelanschlüsse, Fensteranschlussfugen oder befahrbare Industrieböden erfordern flüssig aufzutragende reactive Harze, die rasch ohne Schrumpfung homogen durchhärten.
                </p>
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <div className="text-xs">
                    <strong className="block text-slate-800">Schnellreaktives PMMA-Flüssigharz</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">Werkstoff: Polymethylmethacrylat-Schnellharz. Härtet nach Zugabe eines Peroxid-Katalysators sehr schnell aus (regenfest oft nach ca. 30 min, Herstellerangabe). Geeignet für Anschlüsse an Gullys, Geländer und Durchdringungen.</span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800">Geruchsarmer 2K-PUR-Flüssigkunststoff</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">Werkstoff: 2-Komponenten-Polyurethanbeschichtung. Lösemittel- und geruchsarm. Bevorzugt in Krankenhäusern, Schulen und Innenräumen zur detailreichen Flächenabdichtung.</span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800">Strukturelle CFK-Lamellen &amp; Epoxydharz-Klebstoff</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">Werkstoff: CFK (Kohlenstofffaserverstärktes Plastik) als starre Zugschnittlamelle, verklebt mit thixotropem Zwei-Komponenten-Epoxidharzkleber zur statischen Bauwerksverstärkung im Brückenbau und Hochleistungsbauwerke.</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PROFI-REGEL</span>
                <p className="text-[10px] text-slate-700 leading-normal font-medium">Flüssigkunststoffe verlangen staubtrockene und tragfähige Zementuntergründe mit einer Restfeuchte ≤ 4%.</p>
              </div>
            </div>

            {/* Befestigungstechnik */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-shiraz text-[10px] font-extrabold uppercase tracking-wider block mb-1">Dübel- &amp; Ankertechnik</span>
                <h4 className="font-extrabold text-slate-800 text-sm mb-3">Strukturelle Dübelbefestigung</h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4 font-normal">
                  Dübel müssen Kräfte mechanisch durch Spreizung, Faltung oder Verknotung sicher übertragen. Das Trägermaterial (Polyamid PA6) beeinflusst entscheidend die Alterungsbeständigkeit und Zugbelastung über Jahrzehnte.
                </p>
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <div className="text-xs">
                    <strong className="block text-slate-800">Mehrzonen-Universaldübel (Polyamid PA6)</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">2-Komponenten-Technologie: Weiches elastisches Polyamid für optimalen Halt und spreizendes robustes Polyamid 6 für sichere Führung der Stahlschraube. Passt sich durch Falten, Knoten oder Spreizen automatisch dem Baustofftyp an.</span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800">4-fach-Spreizdübel aus Polyamid</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">Flügeldübel aus reinem Polyamid PA6. Hohe Auszugswerte in Vollbaustoffen wie Beton durch robusten 4-fach-Spreizdruck.</span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800">GFK-Bewehrungsstäbe (nicht metallisch)</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">Hochfester glasfaserverstärkter Kunststoffstab (GFK) als Korrosionsfreie Betonbewehrungsalternative im Tiefsee- und Schienenbau (nicht magnetisch, hohe Zugfestigkeit 1000 MPa).</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PROFI-REGEL</span>
                <p className="text-[10px] text-slate-700 leading-normal font-medium">Nylon-Universaldübel weisen bei Dauertemperaturen ≥ 80 °C erhebliche Tragkraftminderungen auf.</p>
              </div>
            </div>

            {/* Sonderanwendungen / Membranbau */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-shiraz text-[10px] font-extrabold uppercase tracking-wider block mb-1">Architektonischer Membranbau</span>
                <h4 className="font-extrabold text-slate-800 text-sm mb-3">Flurierte Polymerfolienkissen</h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4 font-normal">
                  Transparente, sehr leichte Dächer überspannen große Hallen. Fluorpolymer-Folien wiegen nur einen Bruchteil von Glas und sind lichtdurchlässig, auch für UV-Strahlung.
                </p>
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <div className="text-xs">
                    <strong className="block text-slate-800">ETFE-Kissenfassaden (z.B. Allianz-Arena)</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">Werkstoff: Ethylen-Tetrafluorethylen-Copolymer-Folie (unplastifiziert). Zwei- bis fünflagige Kissen, pneumatisch mit minimalem Gebläsedruck (ca. 300 Pa) aufgespannt. UV-durchlässig, schmutzabweisend (antiadhäsive Oberfläche, kein Lotuseffekt).</span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800">PTFE (Polytetrafluorethylen / Teflon)</strong>
                    <span className="text-[11px] text-slate-500 leading-normal block">Werkstoff: Glasfasergewebe mit PTFE-Beschichtung. Hochfeste, dauerhafte Membranen für Stadion- und Hallendächer. Chemisch sehr beständig; Brandverhalten je nach Produkt bis nichtbrennbar (A2).</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PROFI-REGEL</span>
                <p className="text-[10px] text-slate-700 leading-normal font-medium">ETFE-Kissen werden durch Gebläse dauerhaft unter Innendruck gehalten; bei Schnee oder Wind wird der Druck erhöht.</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 4: Thermischer Ausdehnungsrechner */}
      {activeTab === 'rechner' && (
        <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 border-b border-home-grau/15 pb-4">
            <Thermometer className="text-shiraz" />
            <h3 className="text-lg font-extrabold text-text-main">
              Thermischer Längenänderungs-Rechner (α_T Schnittstelle)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Controls Column (col span 5) */}
            <div className="md:col-span-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-main">Vergleichs-Plastik aus Liste:</label>
                <select aria-label="Vergleichs-Plastik aus Liste"
                  value={comparativePlastic}
                  onChange={(e) => setComparativePlastic(e.target.value)}
                  className="w-full text-xs p-2.5 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800 focus:outline-none focus:border-shiraz"
                >
                  {plasticsDatabase.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name} (α = {formatDeWert(x.alpha)} × 10⁻⁶/K)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-text-main">Ausgangslänge L₀ des Profils/Rohrs:</label>
                  <span className="text-shiraz font-mono font-bold">{formatDeZahl(length, 1)} Meter</span>
                </div>
                <input 
                  type="range" 
                  min="1.0" 
                  max="30.0" 
                  step="0.5" 
                  value={length} 
                  onChange={(e) => setLength(Number(e.target.value))} 
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-text-main">Temperaturbereich ΔT (z. B. Montage vs. Extrem-Sommer):</label>
                  <span className="text-shiraz font-mono font-bold">{formatDeWert(tempDelta)} K (°C)</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="80" 
                  step="2" 
                  value={tempDelta} 
                  onChange={(e) => setTempDelta(Number(e.target.value))} 
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
                />
                <span className="text-[10px] text-text-main/40 block leading-none">Wände/Verkleidungen unter direkter Solarstrahlung erreichen im Hochsommer bis zu 75°C.</span>
              </div>
            </div>

            {/* Visual Bar Elongation comparison (col span 7) */}
            <div className="md:col-span-7 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase block mb-3">Berechnete Längenänderung (ΔL = L₀ · α · ΔT)</span>
                
                <div className="space-y-3 font-mono text-xs">
                  {/* comparative Plastic Bar */}
                  <div>
                    <div className="flex justify-between mb-0.5 text-slate-800">
                      <span className="font-sans font-bold">{compObj.short}:</span>
                      <span className="font-bold text-red-700">+{formatDeZahl(elongationPlastic, 2)} mm</span>
                    </div>
                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-600 transition-all duration-300"
                        style={{ width: `${Math.min(100, (elongationPlastic / 120) * 100)}%` }} // normalized for visual mapping where 120mm is 100%
                      />
                    </div>
                  </div>

                  {/* Steel Bar */}
                  <div>
                    <div className="flex justify-between mb-0.5 text-slate-600">
                      <span className="font-sans font-semibold text-text-main/80">Baustahl / Betonstahl (α ≈ 12):</span>
                      <span className="font-bold text-slate-750">+{formatDeZahl(elongationSteel, 2)} mm</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, (elongationSteel / 120) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Concrete Bar */}
                  <div>
                    <div className="flex justify-between mb-0.5 text-slate-600">
                      <span className="font-sans font-semibold text-text-main/80">Beton (α ≈ 10):</span>
                      <span className="font-bold text-slate-750">+{formatDeZahl(elongationConcrete, 2)} mm</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-700 transition-all duration-300"
                        style={{ width: `${Math.min(100, (elongationConcrete / 120) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Practical engineering advice card based on results */}
              <div className="bg-white p-3 rounded-xl border border-rose-100/80 text-rose-900 text-xs mt-1 space-y-1">
                <div className="flex items-center gap-1 text-red-800 font-bold">
                  <AlertTriangle size={13} />
                  <span>Konstruktionsempfehlung gegen Zwangsspannungen</span>
                </div>
                <p className="leading-snug text-text-main/80 text-[11px] font-normal leading-relaxed">
                  Der Thermodehnungs-Mismatch beträgt ca. <strong>{formatDeZahl((elongationPlastic / Math.max(0.1, elongationConcrete)), 1)}x</strong> gegenüber Normalbeton. Ohne Gleitmuffen oder Dehnungskompensatoren entstehen an Muffen sofort Risse und Undichtigkeiten. 
                  {compObj.id === 'pe' && ' Bei PE-HD-Leitungen Festpunkte und Dehnungsausgleich (z. B. Dehnungsmuffen, Biegeschenkel) nach Herstellerangabe planen.'}
                  {compObj.id === 'pvc-u' && ' Hart-PVC-Rinnen müssen an den Rinnenkopplungen min. 10 - 15 mm Verfahrweg aufweisen, ansonsten beult die Rinne im Sommer aus.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'praxis' && (
        <div className="animate-in fade-in duration-200">
          <PraxisTabContent moduleKey="bp_kunststoffe" />
        </div>
      )}

      {activeTab === 'innovation' && (
        <div className="animate-in fade-in duration-200">
          <InnovationTabContent moduleKey="bp_kunststoffe" />
        </div>
      )}

      <PlasticsThematicLinks current="bauprodukt" />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title="Anwendungsbeispiel: Kriechdehnung im Burgers-Modell"
          zielGleichung="\varepsilon(t) = \frac{\sigma_0}{E_1} + \frac{\sigma_0}{\eta_1} t + \frac{\sigma_0}{E_2}\left(1 - e^{-t E_2/\eta_2}\right)"
          normQuelle="Rheologisches Lehrmodell (Parameter als Lehrwerte)"
          schritte={[
            { titel: '1. Gegeben', formel: '\\sigma_0 = 5\\,\\text{N/mm}^2,\\; E_1 = 1000,\\; E_2 = 2000\\,\\text{N/mm}^2,\\; \\eta_1 = 5 \\cdot 10^6,\\; \\eta_2 = 10^5\\,\\text{N·h/mm}^2', erklaerung: 'Thermoplast unter konstanter Spannung; t in Stunden.' },
            { titel: '2. Sofortdehnung', formel: '\\varepsilon_0 = 5/1000 = 0{,}50\\,\\%', erklaerung: 'Elastischer Anteil (Feder E_1).' },
            { titel: '3. Nach t = 1000 h', formel: '\\varepsilon = 0{,}50\\,\\% + \\tfrac{5 \\cdot 1000}{5 \\cdot 10^6} + \\tfrac{5}{2000}\\left(1 - e^{-20}\\right) = 0{,}50 + 0{,}10 + 0{,}25 = 0{,}85\\,\\%', erklaerung: 'Viskoses Fließen plus verzögert elastischer Anteil.' },
            { titel: '4. Wirksamer Kriechmodul', formel: 'E_c = \\sigma_0 / \\varepsilon = 5 / 0{,}0085 = 590\\,\\text{N/mm}^2', erklaerung: 'Rund 60 % des Kurzzeitmoduls.' },
          ]}
          ergebnisHinweis="Schon nach gut einem Monat ist die Dehnung um 70 % gewachsen – deshalb wird mit dem Kriechmodul statt dem Kurzzeit-E-Modul bemessen."
        />
      </div>

      <ModulTest moduleId="bp_kunststoffe" />

      <ModuleFooter 
        wikipedia={[
          { title: "Kunststoffe im Bauwesen", url: "https://de.wikipedia.org/wiki/Kunststoff" },
          { title: "Flachdachabdichtung", url: "https://de.wikipedia.org/wiki/Flachdach" },
          { title: "Polymethylmethacrylat (Plexiglas)", url: "https://de.wikipedia.org/wiki/Polymethylmethacrylat" }
        ]} 
        literatur={[ 
          'Elsner, P.; Eyerer, P.; Hirth, T. (Hrsg.): Domininghaus – Kunststoffe: Eigenschaften und Anwendungen. 8. Aufl., Berlin: Springer 2012',
          'Ehrenstein, G. W.: Polymer-Werkstoffe. 3. Aufl., München: Hanser 2011',
          'ZVDH: Fachregel für Abdichtungen – Flachdachrichtlinie (Ausgabe Januar 2026)' 
        ]} 
        regelwerke={[ 
          { title: 'DIN EN ISO 1043-1 (Kunststoffe - Kennbuchstaben und Kurzzeichen)' },
          { title: 'DIN 18531 (Abdichtung von Dächern sowie von Balkonen, Loggien und Laubengängen)' },
          { title: 'DIN EN 13956 (Abdichtungsbahnen - Kunststoff- und Elastomerbahnen für Dachabdichtungen)' }
        ]} 
        formeln={[
          { 
            formel: '\\Delta L = L_0 \\cdot \\alpha_T \\cdot \\Delta T', 
            erklaerung: 'Thermische Längenänderung von Kunststoffbauteilen (z.B. PE alpha_T ca. 150-200·10⁻⁶ 1/K, PVC-U ca. 70-80·10⁻⁶ 1/K im Vergleich zu Beton mit 10·10⁻⁶ 1/K).',
            quelle: 'Domininghaus: Kunststoffe'
          },
          { 
            formel: '\\sigma_{\\text{th}} = E_c(t, T) \\cdot \\alpha_T \\cdot \\Delta T', 
            erklaerung: 'Thermisches Zwangsspannungsrisiko bei beidseitig starrer Festhaltung unter Berücksichtigung des Kriechmoduls Ec.',
            quelle: 'Ehrenstein: Polymerwerkstoffe'
          },
          { 
            formel: '\\varepsilon(t) = \\frac{\\sigma_0}{E_1} + \\frac{\\sigma_0}{\\eta_1} \\cdot t + \\frac{\\sigma_0}{E_2} \\cdot \\left(1 - e^{-\\frac{E_2}{\\eta_2} \\cdot t}\\right)', 
            erklaerung: 'Burgers-Vier-Element-Modell (Reihenschaltung aus Maxwell- und Kelvin-Voigt-Element) zur Abbildung von elastischer Spontandehnung, viskosem Fließen und verzögerter elastischer Nachdehnung.',
            quelle: 'Rheologie / Werkstoffkunde'
          }
        ]} 
      />
    </div>
  );
}
