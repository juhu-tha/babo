import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { burgersDehnung, laengenaenderungMm } from '@/src/calc/bauprodukte';
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
import inhalt from '@/content/bpkunststoffe/BpKunststoffe.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';
import { reglerName } from '@/src/lib/reglerName';

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
    name: inhalt.werte.polyethylenPeHdPe,
    short: 'PE',
    density: 0.95,
    lambda: 0.40,
    alpha: 200, // extremely high thermal expansion
    tempRange: inhalt.werte.t50CBis85,
    resistances: {
      acids: 'A',
      alkalis: 'A',
      solvents: 'B',
      oils: 'B',
      uv: 'B' // Needs carbon black additives to be UV stable
    },
    pros: [inhalt.werte.hervorragendeZähigkeitBeiKälte, inhalt.werte.geringesGewicht, inhalt.werte.keineWeichmacher, inhalt.werte.physiologischUnbedenklichTrinkwasser],
    mainApp: inhalt.werte.dampfbremsfolienGasUndTrinkwasserrohre
  },
  {
    id: 'pvc-u',
    name: inhalt.werte.hartPvcPolyvinylchloridUnplastifiziert,
    short: 'PVC-U',
    density: 1.40,
    lambda: 0.15,
    alpha: 80,
    tempRange: inhalt.werte.t0CBis60,
    resistances: {
      acids: 'A',
      alkalis: 'A',
      solvents: 'C',
      oils: 'A',
      uv: 'A'
    },
    pros: [inhalt.werte.sehrHoheMechanischeSteifigkeit, inhalt.werte.flammwidrigSelbstlöschend, inhalt.werte.äußerstKostengünstig, inhalt.werte.langeNutzungsdauer],
    mainApp: inhalt.werte.kanalrohreKgRohreFensterprofile
  },
  {
    id: 'pp',
    name: inhalt.werte.polypropylenPp,
    short: 'PP',
    density: 0.91,
    lambda: 0.22,
    alpha: 150,
    tempRange: inhalt.werte.t0CBis100,
    resistances: {
      acids: 'A',
      alkalis: 'A',
      solvents: 'B',
      oils: 'B',
      uv: 'C' // Sehr empfindlich gegen UV-Strahlung ohne Stabilisierung
    },
    pros: [inhalt.werte.hoheWärmeformbeständigkeit, inhalt.werte.sehrGuteSchlagzähigkeit, inhalt.werte.hervorragendRecycelbar],
    mainApp: inhalt.werte.hausabflussrohreHtHeißwasserrohreGeotext
  },
  {
    id: 'epdm',
    name: inhalt.werte.epdmKautschukElastomer,
    short: 'EPDM',
    density: 1.20,
    lambda: 0.25,
    alpha: 160,
    tempRange: inhalt.werte.t40CBis120,
    resistances: {
      acids: 'A',
      alkalis: 'A',
      solvents: 'C',
      oils: 'C',
      uv: 'A' // Phänomenale Witterungs- und Ozonstabilität
    },
    pros: [inhalt.werte.extremeElastizität400Dehnung, inhalt.werte.sichererVerbundExtremWitterungs],
    mainApp: inhalt.werte.teichfolienFlachdachbahnenResitrixDichtu
  },
  {
    id: 'pmma',
    name: inhalt.werte.acrylglasPolymethylmethacrylat,
    short: 'PMMA',
    density: 1.19,
    lambda: 0.19,
    alpha: 70,
    tempRange: inhalt.werte.t40CBis80,
    resistances: {
      acids: 'B',
      alkalis: 'B',
      solvents: 'C',
      oils: 'B',
      uv: 'A' // Höchste UV-Stabilität und sehr gute Transparenz
    },
    pros: [inhalt.werte.lichtdurchlässigkeit92HöherAls, inhalt.werte.hervorragendeBrillanzUndFarbechtheit, 'Wetterfest'],
    mainApp: inhalt.werte.lärmschutzwändeLichtkuppelnPlexiglassche
  },
  {
    id: 'pc',
    name: inhalt.werte.polycarbonatPc,
    short: 'PC',
    density: 1.20,
    lambda: 0.20,
    alpha: 65,
    tempRange: inhalt.werte.t40CBis1202,
    resistances: {
      acids: 'A',
      alkalis: 'C',
      solvents: 'C',
      oils: 'B',
      uv: 'C' // Vergilbt ohne spezielle UV-Schutzlackierung
    },
    pros: [inhalt.werte.sehrHoheSchlagzähigkeitAuch, inhalt.werte.hoheWärmeformbeständigkeit2, inhalt.werte.glasartigGlänzendeOptik],
    mainApp: inhalt.werte.vandalismusSchutzverglasungenGewächshäus
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
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.materialLehrpfadKunststoffeIm} /></h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5"><MdText text={inhalt.texte.weiterZuDenAnderen} /></p>
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
            <span><MdText text={inhalt.texte.t1BaustoffEigenschaften} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.thermoplastenVsDuroplastenE} /></span>
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
            <span><MdText text={inhalt.texte.t2MechanikRechner} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.peHdFolienPvc} /></span>
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
            <span><MdText text={inhalt.texte.t3AlterungDauerhaftigkeit} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.uvVerspödungWeichmacherAuswaschung} /></span>
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
  const elongationPlastic = laengenaenderungMm(compObj.alpha, length, tempDelta); // mm
  const elongationSteel = laengenaenderungMm(12, length, tempDelta); // mm (Stahl α ≈ 12·10⁻⁶/K)
  const elongationConcrete = laengenaenderungMm(10, length, tempDelta); // mm (Beton α ≈ 10·10⁻⁶/K)

  // Burgers calculation
  const burgersParams = inhalt.daten["BpKunststoffe.burgersParams"];

  const currentBurgers = burgersParams[burgersPolymer];
  
  // Math: Burgers Strain formula: epsilon(t) = sigma_0/E_1 + sigma_0/eta_1 * t + sigma_0/E_2 * (1 - exp(-E_2/eta_2 * t))
  // We represent strain in % (so multiplying by 100)
  const burgers = burgersDehnung(currentBurgers, burgersStress, burgersTime); // Rechenkern src/calc/bauprodukte.ts, Dehnungen in %
  const strainElastic = burgers.elastisch;
  const strainViscous = burgers.viskos;
  const strainDelayed = burgers.verzoegert;
  const strainTotal = burgers.gesamt;

  // Resistance rating renderer helper
  const renderRating = (r: 'A' | 'B' | 'C') => {
    switch (r) {
      case 'A':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-sans text-xs font-bold leading-none">
            <CheckCircle2 size={13} className="text-emerald-600" /><MdText text={inhalt.texte.hochbeständigA} /></span>
        );
      case 'B':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md font-sans text-xs font-bold leading-none animate-pulse">
            <Info size={13} className="text-amber-600" /><MdText text={inhalt.texte.bedingtBeständigB} /></span>
        );
      case 'C':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-md font-sans text-xs font-bold leading-none">
            <AlertTriangle size={13} className="text-rose-600" /><MdText text={inhalt.texte.ungeeignetC} /></span>
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
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.bauprodukteSynthetischeKunststoffe} /></h2>
          </div>
        </div>
        <p className="text-sm text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.synthetischeBauprodukteAufPolymerbasis} /></p>

      </div>
      <ModuleTabs
        label={inhalt.werte.reiterBereiche}
        tabs={[
          { id: 'allgemein' as const, label: 'Materialdatenbank', icon: BookOpen },
          { id: 'synthese' as const, label: inhalt.texte.t1SynthesenChemie, icon: Settings },
          { id: 'viskoelastizitaet' as const, label: inhalt.texte.t2BurgersKriechmodell, icon: Activity },
          { id: 'systeme' as const, label: inhalt.texte.t3BausystemeProdukte, icon: Wrench },
          { id: 'rechner' as const, label: inhalt.texte.t4Längenrechner, icon: Thermometer },
          { id: 'praxis' as const, label: 'Praxisbeispiele', icon: CheckCircle2 },
          { id: 'innovation' as const, label: 'Zukunftstrends', icon: Lightbulb },
        ]}
        aktiv={activeTab}
        onWechsel={setActiveTab}
        className="flex flex-col gap-8 [&>[role=tablist]]:bg-white [&>[role=tablist]]:p-4 [&>[role=tablist]]:rounded-2xl [&>[role=tablist]]:shadow-sm [&>[role=tablist]]:border [&>[role=tablist]]:border-home-grau/30"
      >

      {activeTab === 'allgemein' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          {/* Left selector */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-text-main/50 uppercase tracking-wider block"><MdText text={inhalt.texte.synthetischeWerkstoffAuswahl} /></span>
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
                <span><MdText text={inhalt.texte.weichmacherMigrationBeachten} /></span>
              </div>
              <p className="font-normal text-[11px] text-emerald-950/80 leading-relaxed"><MdText text={inhalt.texte.beiDirektemKontaktVon} /></p>
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
                <span className="text-[10px] text-text-main/40 block leading-tight"><MdText text={inhalt.texte.ausdehnungskoeff} /></span>
                <span className="text-sm font-bold text-slate-800 font-mono">{formatDeWert(selectedPlastic.alpha)} × 10⁻⁶/K</span>
              </div>
            </div>

            {/* Quick Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1"><MdText text={inhalt.texte.dichteHaftgewicht} /></span>
                <span className="text-sm font-bold font-mono text-slate-800">{formatDeZahl(selectedPlastic.density, 2)} g/cm³</span>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1"><MdText text={inhalt.texte.thermischeLeitfähigkeit} /></span>
                <span className="text-sm font-bold font-mono text-slate-800">{formatDeZahl(selectedPlastic.lambda, 2)} W/(m·K)</span>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1"><MdText text={inhalt.texte.einsatztemperaturLim} /></span>
                <span className="text-xs font-bold text-slate-800 leading-normal block mt-1">{selectedPlastic.tempRange}</span>
              </div>
            </div>

            {/* Chemical Resistances Dashboard */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-text-main/60 uppercase block tracking-wider"><MdText text={inhalt.texte.chemischeMedialeBeständigkeit} /></span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                <div className="bg-slate-50/50 p-2.5 rounded-xl border border-home-grau/30 flex flex-col justify-between items-center text-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-text-main/50">Säuren</span>
                  {renderRating(selectedPlastic.resistances.acids)}
                </div>
                <div className="bg-slate-50/50 p-2.5 rounded-xl border border-home-grau/30 flex flex-col justify-between items-center text-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-text-main/50"><MdText text={inhalt.texte.laugenAlkalis} /></span>
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
                <span className="text-xs font-bold text-text-main/50 uppercase block"><MdText text={inhalt.texte.primäreBauproduktVerwendung} /></span>
                <p className="text-xs font-bold text-slate-800 leading-relaxed">
                  {selectedPlastic.mainApp}
                </p>
                <span className="text-[10px] text-text-main/50 leading-relaxed mt-1 block font-normal leading-normal"><MdText text={inhalt.texte.imErdberührtenBauwerksschutzSind} /></span>
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
              <Settings className="text-shiraz" size={20} /><MdText text={inhalt.texte.synthesereaktionenReaktionsmechanismen} /></h3>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.kunststoffeWerdenDurchKovalente} /></p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Polymerisation */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                    Polymerisation
                  </span>
                  <span className="text-xs font-semibold text-slate-400 font-mono"><MdText text={inhalt.texte.keineSpaltprodukte} /></span>
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm mb-2"><MdText text={inhalt.texte.kettenpolymerisationCCÖffnung} /></h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4"><MdText text={inhalt.texte.doppelbindungenUngesättigterMonomereWerd} /></p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-[10px] block"><MdText text={inhalt.texte.chemischeMatrix} /></span>
                  <code className="text-shiraz font-mono block text-[11px]"><MdText text={inhalt.texte.nChChCl} /></code>
                  <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.reinesPolymerohneVerbleibendeAbgase} /></span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold block uppercase text-slate-400"><MdText text={inhalt.texte.realeSystemeIndustriemarken} /></span>
                <div className="text-xs space-y-1 text-slate-700">
                  <p><MdText text={inhalt.texte.kgKanalgrundrohrZB} /></p>
                  <p><MdText text={inhalt.texte.peHdEntwässerungssystemZ} /></p>
                  <p><MdText text={inhalt.texte.feuchtevariableDampfbremsbahnZB} /></p>
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
                  <span className="text-xs font-semibold text-slate-400 font-mono"><MdText text={inhalt.texte.hUmlagerungRein} /></span>
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm mb-2"><MdText text={inhalt.texte.stufenadditionHydrogenShift} /></h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4"><MdText text={inhalt.texte.reaktionVonMonomerenMit} /></p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-[10px] block"><MdText text={inhalt.texte.chemischeMatrix2} /></span>
                  <code className="text-shiraz font-mono block text-[10px]"><MdText text={inhalt.texte.oCNR} /></code>
                  <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.verzögerungsfreieVernetzungUnterHitze} /></span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold block uppercase text-slate-400"><MdText text={inhalt.texte.systemlösungenDerPraxis} /></span>
                <div className="text-xs space-y-1 text-slate-700">
                  <p><MdText text={inhalt.texte.pirDauerschäumungenPolyurethanHartschaum} /></p>
                  <p><MdText text={inhalt.texte.cfkVerstärkungslamellenEpoxidharzGebunde} /></p>
                  <p><MdText text={inhalt.texte.t2kEpoxidschutzschichtenReaktionsharzbesc} /></p>
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
                  <span className="text-xs font-semibold text-slate-400 font-mono"><MdText text={inhalt.texte.abspaltungHOHcl} /></span>
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm mb-2"><MdText text={inhalt.texte.kondensationspolymerisationStepGrowth} /></h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4"><MdText text={inhalt.texte.monomereReagierenUnterObligatorischer} /></p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-[10px] block"><MdText text={inhalt.texte.chemischeMatrix3} /></span>
                  <code className="text-shiraz font-mono block text-[11px]"><MdText text={inhalt.texte.rCoohRNh} /></code>
                  <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.dasAbgeführteWasserMuss} /></span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold block uppercase text-slate-400"><MdText text={inhalt.texte.systemlösungenDerPraxis2} /></span>
                <div className="text-xs space-y-1 text-slate-700">
                  <p><MdText text={inhalt.texte.polyamidVerbindungselementeKonstruktione} /></p>
                  <p><MdText text={inhalt.texte.phenolharzHartschaumplattenHochleistungs} /></p>
                  <p><MdText text={inhalt.texte.feuchtigkeitsvernetzendesSiliconElastisc} /></p>
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
              <Activity className="text-shiraz" size={20} /><MdText text={inhalt.texte.viskoelastizitätDasBurgersVier} /></h3>
            <p className="text-xs text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.imGegensatzZuIdeal} /></p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-center">
                <span className="text-[10px] text-blue-900 font-bold block uppercase leading-none mb-1"><MdText text={inhalt.texte.federEMaxwell} /></span>
                <span className="text-xs font-semibold text-slate-700"><MdText text={inhalt.texte.sofortElastischeDehnungReversibel} /></span>
              </div>
              <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100 text-center">
                <span className="text-[10px] text-purple-900 font-bold block uppercase leading-none mb-1"><MdText text={inhalt.texte.dämpferMaxwell} /></span>
                <span className="text-xs font-semibold text-slate-700"><MdText text={inhalt.texte.viskosesFließenIrreversibelPlastisch} /></span>
              </div>
              <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100 text-center">
                <span className="text-[10px] text-amber-900 font-bold block uppercase leading-none mb-1"><MdText text={inhalt.texte.federEKelvin} /></span>
                <span className="text-xs font-semibold text-slate-700"><MdText text={inhalt.texte.rückstellfederZurVerzögertenElastik} /></span>
              </div>
              <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 text-center">
                <span className="text-[10px] text-emerald-900 font-bold block uppercase leading-none mb-1"><MdText text={inhalt.texte.dämpferKelvin} /></span>
                <span className="text-xs font-semibold text-slate-700"><MdText text={inhalt.texte.verzögerungselementDerViskoelastischenRe} /></span>
              </div>
            </div>
          </div>

          {/* Rheologisches SVG Schaubild */}
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-slate-800"><MdText text={inhalt.texte.rheologischerModellaufbau} /></h4>
            <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="w-full md:w-1/3 flex justify-center py-2">
                <svg role="img" aria-label="Rheologischer Modellaufbau" width="220" height="150" viewBox="0 0 220 150" className="opacity-90">
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
                <span className="font-bold text-slate-800 block"><MdText text={inhalt.texte.kriechMathematikFürBauteilprüfungen} /></span>
                <p className="leading-relaxed font-normal"><MdText text={inhalt.texte.dieKriechgleichungErmitteltDie} /></p>
                <div className="bg-white p-3 rounded border border-slate-200 text-center py-2.5">
                  <code className="text-shiraz font-semibold font-mono text-xs sm:text-sm"><MdText text={inhalt.texte.tETE} /></code>
                </div>
                <div className="pt-1.5 space-y-1 text-[11px] text-slate-650 leading-relaxed font-normal">
                  <p><MdText text={inhalt.texte.eSpontanelastischerVollReversibler} /></p>
                  <p><MdText text={inhalt.texte.tUnbegrenztAnsteigendesViskoses} /></p>
                  <p><MdText text={inhalt.texte.e1ET} /></p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Burgers Simulation Calculator */}
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
            <h4 className="font-extrabold text-slate-850 text-sm border-b border-slate-100 pb-2"><MdText text={inhalt.texte.kriechSimulatorDehnungsberechnungUnter} /></h4>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Sliders Area */}
              <div className="md:col-span-5 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-main flex items-center justify-between">
                    <span><MdText text={inhalt.texte.t1WerkstoffWählen} /></span>
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
                    <label className="text-text-main"><MdText text={inhalt.texte.t2ZugspannungKonstantlast} /></label>
                    <span className="text-shiraz font-mono font-bold">{formatDeZahl(burgersStress, 1)} MPa</span>
                  </div>
                  <input 
                    type="range" 
                    min="1.0" 
                    max="20.0" 
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    step="0.5"
                    value={burgersStress}
                    aria-label={reglerName(inhalt.texte.t2ZugspannungKonstantlast)}
                    aria-valuetext={`${formatDeZahl(burgersStress, 1)} MPa`}
                    onChange={(e) => setBurgersStress(Number(e.target.value))}
                  />
                  <span className="text-[10px] text-slate-400 block leading-none"><MdText text={inhalt.texte.lastniveauImInnerenVon} /></span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <label className="text-text-main"><MdText text={inhalt.texte.t3StandzeitLastzeitraumT} /></label>
                    <span className="text-shiraz font-mono font-bold">{formatDeWert(burgersTime)} Stunden</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="500" 
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    step="5"
                    value={burgersTime}
                    aria-label={reglerName(inhalt.texte.t3StandzeitLastzeitraumT)}
                    aria-valuetext={`${formatDeWert(burgersTime)} Stunden`}
                    onChange={(e) => setBurgersTime(Number(e.target.value))}
                  />
                  <span className="text-[10px] text-slate-400 block leading-none"><MdText text={inhalt.texte.intervallZurVeranschaulichungDes} /></span>
                </div>
              </div>

              {/* Outputs Area */}
              <div className="md:col-span-7 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-700 uppercase block"><MdText text={inhalt.texte.berechnungsdatenAnteileNach} />{formatDeWert(burgersTime)} Stunden:</span>
                  
                  {/* Results bars stack representation */}
                  <div className="space-y-3.5">
                    
                    {/* Elastic Strain */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-600 rounded-full inline-block"></span><MdText text={inhalt.texte.sofortelastischReversibleElastic} /></span>
                        <span className="font-mono font-bold text-red-600">{formatDeZahl(strainElastic, 4)} %</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${Math.min(100, (strainElastic / strainTotal) * 100)}%` }}></div>
                      </div>
                    </div>

                    {/* Delayed elastic strain */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span><MdText text={inhalt.texte.verzögertElastischViskoelastischesDelaye} /></span>
                        <span className="font-mono font-bold text-amber-500">{formatDeZahl(strainDelayed, 4)} %</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${Math.min(100, (strainDelayed / strainTotal) * 100)}%` }}></div>
                      </div>
                    </div>

                    {/* Viscous flow */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-purple-600 rounded-full inline-block"></span><MdText text={inhalt.texte.zähflüssigeGleitungIrreversiblesViscous} /></span>
                        <span className="font-mono font-bold text-purple-600">{formatDeZahl(strainViscous, 4)} %</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 transition-all duration-300" style={{ width: `${Math.min(100, (strainViscous / strainTotal) * 100)}%` }}></div>
                      </div>
                    </div>

                  </div>
                </div>

                <ErgebnisAnsage text={kurzzeile(ansageWert('Gesamtdehnung', strainTotal, 3, '%'), ansageWert('davon Kriechverformung', strainViscous, 3, '%'))} />
                {/* Total results callout block */}
                <div className="bg-white p-4 rounded-xl border border-slate-300 mt-4 flex flex-col justify-between sm:flex-row items-center gap-4">
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block"><MdText text={inhalt.texte.gesamtdehnungTotal} /></span>
                    <span className="text-xl font-black text-rose-800 leading-tight block">{formatDeZahl(strainTotal, 3)} %</span>
                    <span className="text-[9px] text-slate-400 font-medium leading-none block mt-0.5"><MdText text={inhalt.texte.dauerhafteKriechverformung} />{formatDeZahl((strainViscous), 3)}%</span>
                  </div>
                  <div className="bg-rose-50 text-rose-950 px-3.5 py-2 rounded-lg border border-rose-100 text-[11px] leading-relaxed max-w-[280px] font-normal"><MdText text={inhalt.texte.hinweisUnterDauerlastSinkt} /></div>
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
              <Wrench className="text-shiraz" size={20} /><MdText text={inhalt.texte.baupraktischeBausystemeKommerzielleMarke} /></h3>
            <p className="text-xs text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.inDerBauplanungWird} /></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Rohrleitungen */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-shiraz text-[10px] font-extrabold uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.infrastrukturHaustechnik} /></span>
                <h4 className="font-extrabold text-slate-800 text-sm mb-3"><MdText text={inhalt.texte.thermodimensionierteRohrleitungssysteme} /></h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4 font-normal"><MdText text={inhalt.texte.kanalisationenImErdreichVerlangen} /></p>
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.htAbflussrohrPolypropylenZ} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.werkstoffPpPolypropylenGrau} /></span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.kgKanalrohrPvcU} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.werkstoffUnplastifiziertesPvcZiegelrot} /></span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.peXaInstallationssystemZ} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.werkstoffPeXaVernetztes} /></span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PROFI-REGEL</span>
                <p className="text-[10px] text-slate-700 leading-normal font-medium"><MdText text={inhalt.texte.warmwasserleitungenAusKunststoffDehnen} /></p>
              </div>
            </div>

            {/* Dämmstoffe */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-shiraz text-[10px] font-extrabold uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.wärmeschutzPerimeter} /></span>
                <h4 className="font-extrabold text-slate-800 text-sm mb-3"><MdText text={inhalt.texte.schäumbareThermoplasteDuroplaste} /></h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4 font-normal"><MdText text={inhalt.texte.wärmedämmstoffeUnterscheidenSichIn} /></p>
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.spezifischeXpsPlatten} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.werkstoffExtrudiertesPolystyrolXps} /></span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.spezifischeEpsPlatten} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.werkstoffExpandiertesPolystyrolEps} /></span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.pirHartschaumplattenStandardWerte} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.werkstoffPolyisocyanuratHartschaumDuropl} /></span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.phenolharzResolhartschaumStandardWerte} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.werkstoffPhenolformaldehydResolhartschau} /></span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PROFI-REGEL</span>
                <p className="text-[10px] text-slate-700 leading-normal font-medium"><MdText text={inhalt.texte.xpsBesitztEineRaue} /></p>
              </div>
            </div>

            {/* Dichtungsbahnen */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-shiraz text-[10px] font-extrabold uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.bauwerksabdichtungFlachdach} /></span>
                <h4 className="font-extrabold text-slate-800 text-sm mb-3"><MdText text={inhalt.texte.dauerhafteAbdichtungsorgane} /></h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4 font-normal"><MdText text={inhalt.texte.flachdachabdichtungenSindExtremenWitteru} /></p>
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.mehrlagigeEpdmDichtungsbahnSelbstklebend} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.werkstoffEpdmEthylenPropylen} /></span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.fpoDichtungsbahnFpoTpo} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.werkstoffFlexiblePolyolefineÖkologisch} /></span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.weichPvcDichtungsbahnPvc} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.werkstoffWeichgemachtesPvcWirtschaftlich} /></span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PROFI-REGEL</span>
                <p className="text-[10px] text-slate-700 leading-normal font-medium"><MdText text={inhalt.texte.beimÜberlappenVonPvc} /></p>
              </div>
            </div>

            {/* Flüssigabdichtung & Epoxide */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-shiraz text-[10px] font-extrabold uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.sanierungHarzsysteme} /></span>
                <h4 className="font-extrabold text-slate-800 text-sm mb-3">Reaktionsharz-Flüssigkunststoffe</h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4 font-normal"><MdText text={inhalt.texte.komplizierteSockelanschlüsseFensteransch} /></p>
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.schnellreaktivesPmmaFlüssigharz} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.werkstoffPolymethylmethacrylatSchnellhar} /></span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.geruchsarmer2kPurFlüssigkunststoff} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.werkstoff2KomponentenPolyurethanbeschich} /></span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.strukturelleCfkLamellenEpoxydharz} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.werkstoffCfkKohlenstofffaserverstärktesP} /></span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PROFI-REGEL</span>
                <p className="text-[10px] text-slate-700 leading-normal font-medium"><MdText text={inhalt.texte.flüssigkunststoffeVerlangenStaubtrockene} /></p>
              </div>
            </div>

            {/* Befestigungstechnik */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-shiraz text-[10px] font-extrabold uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.dübelAnkertechnik} /></span>
                <h4 className="font-extrabold text-slate-800 text-sm mb-3"><MdText text={inhalt.texte.strukturelleDübelbefestigung} /></h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4 font-normal"><MdText text={inhalt.texte.dübelMüssenKräfteMechanisch} /></p>
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.mehrzonenUniversaldübelPolyamidPa6} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.t2KomponentenTechnologieWeiches} /></span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.t4FachSpreizdübelAus} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.flügeldübelAusReinemPolyamid} /></span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.gfkBewehrungsstäbeNichtMetallisch} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.hochfesterGlasfaserverstärkterKunststoff} /></span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PROFI-REGEL</span>
                <p className="text-[10px] text-slate-700 leading-normal font-medium"><MdText text={inhalt.texte.nylonUniversaldübelWeisenBei} /></p>
              </div>
            </div>

            {/* Sonderanwendungen / Membranbau */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-shiraz text-[10px] font-extrabold uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.architektonischerMembranbau} /></span>
                <h4 className="font-extrabold text-slate-800 text-sm mb-3"><MdText text={inhalt.texte.fluriertePolymerfolienkissen} /></h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4 font-normal"><MdText text={inhalt.texte.transparenteSehrLeichteDächer} /></p>
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.etfeKissenfassadenZB} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.werkstoffEthylenTetrafluorethylenCopolym} /></span>
                  </div>
                  <div className="text-xs">
                    <strong className="block text-slate-800"><MdText text={inhalt.texte.ptfePolytetrafluorethylenTeflon} /></strong>
                    <span className="text-[11px] text-slate-500 leading-normal block"><MdText text={inhalt.texte.werkstoffGlasfasergewebeMitPtfe} /></span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PROFI-REGEL</span>
                <p className="text-[10px] text-slate-700 leading-normal font-medium"><MdText text={inhalt.texte.etfeKissenWerdenDurch} /></p>
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
            <h3 className="text-lg font-extrabold text-text-main"><MdText text={inhalt.texte.thermischerLängenänderungsRechnerT} /></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Controls Column (col span 5) */}
            <div className="md:col-span-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.vergleichsPlastikAusListe} /></label>
                <select aria-label={inhalt.werte.vergleichsPlastikAusListe}
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
                  <label className="text-text-main"><MdText text={inhalt.texte.ausgangslängeLDesProfils} /></label>
                  <span className="text-shiraz font-mono font-bold">{formatDeZahl(length, 1)} Meter</span>
                </div>
                <input 
                  type="range" 
                  min="1.0" 
                  max="30.0" 
                  step="0.5" 
                  value={length}
                  aria-label={reglerName(inhalt.texte.ausgangslängeLDesProfils)}
                  aria-valuetext={`${formatDeZahl(length, 1)} Meter`} 
                  onChange={(e) => setLength(Number(e.target.value))} 
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-text-main"><MdText text={inhalt.texte.temperaturbereichTZB} /></label>
                  <span className="text-shiraz font-mono font-bold">{formatDeWert(tempDelta)} K (°C)</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="80" 
                  step="2" 
                  value={tempDelta}
                  aria-label={reglerName(inhalt.texte.temperaturbereichTZB)}
                  aria-valuetext={`${formatDeWert(tempDelta)} K (°C)`} 
                  onChange={(e) => setTempDelta(Number(e.target.value))} 
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
                />
                <span className="text-[10px] text-text-main/40 block leading-none"><MdText text={inhalt.texte.wändeVerkleidungenUnterDirekter} /></span>
              </div>
            </div>

            {/* Visual Bar Elongation comparison (col span 7) */}
            <div className="md:col-span-7 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase block mb-3"><MdText text={inhalt.texte.berechneteLängenänderungLL} /></span>
                
                <div className="space-y-3 font-mono text-xs">
                  <ErgebnisAnsage text={kurzzeile(`${compObj.short}: ${ansageWert('Längenänderung', elongationPlastic, 2, 'mm')}`, ansageWert('Stahl', elongationSteel, 2, 'mm'), ansageWert('Beton', elongationConcrete, 2, 'mm'))} />
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
                      <span className="font-sans font-semibold text-text-main/80"><MdText text={inhalt.texte.baustahlBetonstahl12} /></span>
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
                      <span className="font-sans font-semibold text-text-main/80"><MdText text={inhalt.texte.beton10} /></span>
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
                  <span><MdText text={inhalt.texte.konstruktionsempfehlungGegenZwangsspannu} /></span>
                </div>
                <p className="leading-snug text-text-main/80 text-[11px] font-normal leading-relaxed"><MdText text={inhalt.texte.derThermodehnungsMismatchBeträgt} /><strong>{formatDeZahl((elongationPlastic / Math.max(0.1, elongationConcrete)), 1)}x</strong><MdText text={inhalt.texte.gegenüberNormalbetonOhneGleitmuffen} />{compObj.id === 'pe' && inhalt.werte.beiPeHdLeitungen}
                  {compObj.id === 'pvc-u' && inhalt.werte.hartPvcRinnenMüssen}
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
      </ModuleTabs>

      <PlasticsThematicLinks current="bauprodukt" />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielKriechdehnungImBurgers}
          zielGleichung="\varepsilon(t) = \frac{\sigma_0}{E_1} + \frac{\sigma_0}{\eta_1} t + \frac{\sigma_0}{E_2}\left(1 - e^{-t E_2/\eta_2}\right)"
          normQuelle={inhalt.werte.rheologischesLehrmodellParameterAls}
          schritte={inhalt.daten["BpKunststoffe.schritte"]}
          ergebnisHinweis={inhalt.werte.schonNachGutEinem}
        />
      </div>

      <ModulTest moduleId="bp_kunststoffe" />

      <ModuleFooter 
        wikipedia={[
          { title: inhalt.werte.kunststoffeImBauwesen, url: "https://de.wikipedia.org/wiki/Kunststoff" },
          { title: "Flachdachabdichtung", url: "https://de.wikipedia.org/wiki/Flachdach" },
          { title: inhalt.werte.polymethylmethacrylatPlexiglas, url: "https://de.wikipedia.org/wiki/Polymethylmethacrylat" }
        ]} 
        literatur={inhalt.daten["BpKunststoffe.literatur"]} 
        regelwerke={inhalt.daten["BpKunststoffe.regelwerke"]} 
        formeln={inhalt.daten["BpKunststoffe.formeln"]} 
      />
    </div>
  );
}
