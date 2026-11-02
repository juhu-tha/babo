import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { zusatzmittelWz } from '@/src/calc/bauprodukte';
import { 
  Droplet, 
  BookOpen, 
  CheckCircle2, 
  Lightbulb, 
  ShieldAlert, 
  Sparkles, 
  AlertTriangle, 
  Activity, 
  ChevronRight, 
  Scale, 
  FileText, 
  Atom, 
  Gauge, 
  Check 
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath } from 'react-katex';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';
import inhalt from '@/content/bpbetonzusatzmittel/BpBetonzusatzmittel.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

export interface AdmixtureProduct {
  name: string;
  abbreviation: string;
  standard: string;
  chemicalBase: string;
  dosageCode: string;
  primaryEffect: string;
  secondaryEffect: string;
  mechanism: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  classificationCode: string;
}

const admixtureProducts: AdmixtureProduct[] = inhalt.daten.admixtureProducts;

// System kategorien herstellerneutral dargelegt
interface SystemCategory {
  category: string;
  fmName: string;
  lpName: string;
  vzName: string;
  beName: string;
  specialties: string;
}

const systemCategories: SystemCategory[] = inhalt.daten.systemCategories;

export default function BpBetonzusatzmittel() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'wirkstoffe' | 'dosierung' | 'praxis' | 'innovation'>('allgemein');
  const [selectedAdmixture, setSelectedAdmixture] = useState<AdmixtureProduct>(admixtureProducts[1]); // Pre-select PCE
  const [activeRepulsionType, setActiveRepulsionType] = useState<'electrostatic' | 'steric'>('steric');

  // Interactive Dosing & w/z Accounting calculator states (E-Schein requirements)
  const [cementContent, setCementContent] = useState<number>(320); // kg/m³
  const [dosagePercent, setDosagePercent] = useState<number>(1.2); // M.-%
  const [admixtureDensity, setAdmixtureDensity] = useState<number>(1.12); // kg/l
  const [admixtureWaterContent, setAdmixtureWaterContent] = useState<number>(65); // %
  const [freshWaterAdd, setFreshWaterAdd] = useState<number>(145); // l/m³
  const [targetWcValue, setTargetWcValue] = useState<number>(0.45);
  const [concreteApplication, setConcreteApplication] = useState<'spann' | 'stahl' | 'unbewehrt'>('stahl');
  const [admixtureChlorideContent, setAdmixtureChlorideContent] = useState<number>(0.04); // M.-%

  // Calculation results
  // Rechenkern src/calc/bauprodukte.ts (Wasseranrechnung bei > 3 l/m³ flüssiger Zusatzmittel, DIN EN 206)
  const zm = zusatzmittelWz({ zement: cementContent, dosierung: dosagePercent, dichte: admixtureDensity, wasseranteil: admixtureWaterContent, wasser: freshWaterAdd });
  const admixtureMass = zm.masse; // kg/m³
  const admixtureVolume = zm.volumen; // l/m³
  const admixtureWaterMass = zm.wasserZm; // kg/m³ (≈ l/m³)
  const isWaterAnrechnungMandatory = zm.anrechnung;
  const effectiveWater = zm.wasserEff;
  const rawWcRatio = zm.wzRoh;
  const effectiveWcRatio = zm.wzEff;

  const isDosingTooLow = zm.zuNiedrig;
  const isDosingTooHigh = zm.zuHoch;
  const isChlorideExcessive = concreteApplication === 'spann' && admixtureChlorideContent > 0.10;

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-home-grau/20 pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Droplet className="text-shiraz animate-pulse" /><MdText text={inhalt.texte.betonzusatzmittelBauchemie} /></h2>
            <p className="text-xs text-text-main/60 mt-1"><MdText text={inhalt.texte.normungNachDinEn} /></p>
          </div>
          <span className="text-[10px] font-mono bg-stone-100 text-stone-700 px-3 py-1 rounded border border-stone-200 self-start lg:self-center"><MdText text={inhalt.texte.dbcLehrvortragESchein} /></span>
        </div>

        {/* Primary Tabs Navigation */}
        <ModuleTabs
          label={inhalt.werte.reiterBereiche}
          tabs={[
            { id: 'allgemein' as const, label: inhalt.texte.einführungWirkprinzipien, icon: BookOpen },
            { id: 'wirkstoffe' as const, label: inhalt.texte.wirkstoffKatalogDin934, icon: Atom },
            { id: 'dosierung' as const, label: inhalt.texte.eScheinWZ, icon: Gauge },
            { id: 'praxis' as const, label: 'Praxisbeispiele', icon: CheckCircle2 },
            { id: 'innovation' as const, label: 'Zukunftstrends', icon: Lightbulb },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:my-6"
        >

        {/* TAB 1: EINFÜHRUNG & WIRKPRINZIPIEN */}
        {activeTab === 'allgemein' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 leading-relaxed text-sm">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-extrabold text-slate-800 text-lg"><MdText text={inhalt.texte.zusatzmittelVsZusatzstoffeKlarer} /></h3>
                <p className="text-text-main/80"><MdText text={inhalt.texte.dieBetontechnologischeSteuerungStützt} /></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100 flex flex-col justify-between">
                    <div>
                      <span className="text-sky-800 font-extrabold text-xs uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.betonzusatzstoffeBzs} /></span>
                      <p className="text-xs text-slate-700 leading-normal"><MdText text={inhalt.texte.pulverförmigeStoffeWieFlugasche} /></p>
                    </div>
                  </div>

                  <div className="bg-shiraz/5 p-4 rounded-xl border border-shiraz/10 flex flex-col justify-between">
                    <div>
                      <span className="text-shiraz font-extrabold text-xs uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.betonzusatzmittelBzm} /></span>
                      <p className="text-xs text-slate-700 leading-normal"><MdText text={inhalt.texte.meistFlüssigeSeltenPulverförmige} /></p>
                    </div>
                  </div>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/20 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-800"><MdText text={inhalt.texte.grundlegendeZieleDerBzm} /></h4>
                  <ul className="list-disc list-inside text-text-main/80 space-y-1 pl-1">
                    <li><MdText text={inhalt.texte.frischbetonEinstellenDerVerarbeitbarkeit} /></li>
                    <li><MdText text={inhalt.texte.hydratationSteuerungDesErstarrens} /></li>
                    <li><MdText text={inhalt.texte.festbetonHöhereDichteDurch} /></li>
                  </ul>
                </div>
              </div>

              {/* Sidebar Info: Regulatory Compliance */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <h4 className="font-extrabold text-slate-850 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="text-emerald-600" size={16} /><MdText text={inhalt.texte.konformitaetUndNormenbezug} /></h4>
                  <ul className="space-y-3.5 text-xs text-text-main/90">
                    <li className="flex gap-2 items-start">
                      <ChevronRight size={14} className="text-shiraz mt-0.5 flex-none" />
                      <div><MdText text={inhalt.texte.harmonisierungDinEn934} /></div>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ChevronRight size={14} className="text-shiraz mt-0.5 flex-none" />
                      <div><MdText text={inhalt.texte.nichtHarmonisierteZusatzmittelFür} /></div>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ChevronRight size={14} className="text-shiraz mt-0.5 flex-none" />
                      <div><MdText text={inhalt.texte.verträglichkeitInDerErstprüfung} /></div>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 text-xs text-amber-950 p-4 rounded-xl leading-relaxed space-y-1">
                  <div className="flex gap-1.5 items-center font-bold text-amber-900">
                    <AlertTriangle size={14} className="text-amber-800" />
                    <span><MdText text={inhalt.texte.lagerungsvorschriftenQualitätspflege} /></span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-normal"><MdText text={inhalt.texte.zusatzmittelFrostfreiUndNicht} /></p>
                </div>
              </div>
            </div>

            {/* INTERACTIVE COMPONENT: ELECTROSTATIC VS STERIC REPULSION */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200 space-y-6">
              <div className="max-w-2xl">
                <span className="text-xs font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-sm uppercase tracking-wider block w-fit mb-2"><MdText text={inhalt.texte.mikroskopischerWirkmechanismus} /></span>
                <h3 className="text-base font-extrabold text-slate-800"><MdText text={inhalt.texte.diePhysikalischenKräfteDer} /></h3>
                <p className="text-xs text-text-main/70 leading-relaxed mt-1"><MdText text={inhalt.texte.feinGemahleneZementkörnerWeisen} /></p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Repulsion Selector Buttons */}
                <AuswahlGruppe label="Abstoßungsmechanismus" className="lg:col-span-4 flex flex-col gap-2.5">
                  <button {...alsOption(activeRepulsionType === 'electrostatic')}
                    onClick={() => setActiveRepulsionType('electrostatic')}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      activeRepulsionType === 'electrostatic'
                        ? 'bg-shiraz/5 border-shiraz text-slate-900 shadow-sm ring-1 ring-shiraz/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-extrabold text-sm flex items-center gap-1.5">
                      <Atom size={16} className={activeRepulsionType === 'electrostatic' ? 'text-shiraz' : 'text-slate-400'} /><MdText text={inhalt.texte.t1ElektrostatischeAbstoßung} /></div>
                    <span className="text-xxs text-text-main/50 block mt-1"><MdText text={inhalt.texte.typischBeiKlassischenBv} /></span>
                  </button>

                  <button {...alsOption(activeRepulsionType === 'steric')}
                    onClick={() => setActiveRepulsionType('steric')}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      activeRepulsionType === 'steric'
                        ? 'bg-shiraz/5 border-shiraz text-slate-900 shadow-sm ring-1 ring-shiraz/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-extrabold text-sm flex items-center gap-1.5">
                      <Sparkles size={16} className={activeRepulsionType === 'steric' ? 'text-shiraz' : 'text-slate-400'} /><MdText text={inhalt.texte.t2SterischeAbstoßung} /></div>
                    <span className="text-xxs text-text-main/50 block mt-1"><MdText text={inhalt.texte.dieRevolutionDurchPce} /></span>
                  </button>
                </AuswahlGruppe>

                {/* Simulation Canvas / Description */}
                <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
                  {activeRepulsionType === 'electrostatic' ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-2">
                        <span className="text-xs font-bold text-indigo-850"><MdText text={inhalt.texte.mechanikPolareLadungsreaktion} /></span>
                        <span className="text-[10px] font-mono bg-indigo-100 text-indigo-850 px-2 py-0.5 rounded">Zeta-Potenzial-Verschiebung</span>
                      </div>
                      
                      {/* Diagram representation */}
                      <div className="h-28 bg-indigo-50/45 rounded-lg border border-indigo-100 flex items-center justify-center gap-8 p-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-slate-400 border border-slate-500 flex items-center justify-center text-xs font-bold text-white relative shadow-sm">
                            Zement
                            <span className="absolute -top-1 -right-1 bg-indigo-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold font-mono">-</span>
                            <span className="absolute -bottom-1 -left-1 bg-indigo-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold font-mono">-</span>
                          </div>
                          <span className="text-[9px] font-bold text-indigo-800 mt-1 uppercase"><MdText text={inhalt.texte.negativGeladen} /></span>
                        </div>
                        <span className="text-lg font-mono text-indigo-500 animate-pulse font-extrabold"><MdText text={inhalt.texte.abstoßung} /></span>
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-slate-400 border border-slate-500 flex items-center justify-center text-xs font-bold text-white relative shadow-sm">
                            Zement
                            <span className="absolute -top-1 -left-1 bg-indigo-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold font-mono">-</span>
                            <span className="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold font-mono">-</span>
                          </div>
                          <span className="text-[9px] font-bold text-indigo-800 mt-1 uppercase"><MdText text={inhalt.texte.negativGeladen2} /></span>
                        </div>
                      </div>

                      <p className="text-xs text-text-main/80 leading-normal"><MdText text={inhalt.texte.wieEsFunktioniertDie} /></p>
                      <div className="text-[10px] bg-indigo-50 border border-indigo-250 p-2.5 rounded-lg text-indigo-900 leading-tight"><MdText text={inhalt.texte.praxisregelElektrostatischeAbstoßungskrä} /></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-2">
                        <span className="text-xs font-bold text-emerald-850"><MdText text={inhalt.texte.mechanikMolekularerStoßdämpfer} /></span>
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-850 px-2 py-0.5 rounded"><MdText text={inhalt.texte.pceCopolymerMitPeg} /></span>
                      </div>

                      {/* Diagram representation */}
                      <div className="h-28 bg-emerald-50/45 rounded-lg border border-emerald-100 flex items-center justify-center gap-12 p-4">
                        <div className="flex flex-col items-center">
                          <div className="w-11 h-11 rounded-full bg-slate-400 border border-slate-500 flex items-center justify-center text-xs font-bold text-white relative shadow-sm">
                            Zement
                            {/* Comb-like representation */}
                            <span className="absolute -top-1.5 inset-x-0 mx-auto text-emerald-600 font-extrabold text-[15px] animate-pulse">〰️</span>
                            <span className="absolute -bottom-1.5 inset-x-0 mx-auto text-emerald-600 font-extrabold text-[15px] animate-pulse">〰️</span>
                          </div>
                          <span className="text-[9px] font-bold text-emerald-800 mt-1 uppercase"><MdText text={inhalt.texte.adsorbiertesRückgrat} /></span>
                        </div>
                        <span className="text-lg font-mono text-emerald-600 animate-pulse font-extrabold"><MdText text={inhalt.texte.schutzzone} /></span>
                        <div className="flex flex-col items-center">
                          <div className="w-11 h-11 rounded-full bg-slate-400 border border-slate-500 flex items-center justify-center text-xs font-bold text-white relative shadow-sm">
                            Zement
                            <span className="absolute -top-1.5 inset-x-0 mx-auto text-emerald-600 font-extrabold text-[15px] animate-pulse">〰️</span>
                            <span className="absolute -bottom-1.5 inset-x-0 mx-auto text-emerald-600 font-extrabold text-[15px] animate-pulse">〰️</span>
                          </div>
                          <span className="text-[9px] font-bold text-emerald-800 mt-1 uppercase"><MdText text={inhalt.texte.sterischerPuffer} /></span>
                        </div>
                      </div>

                      <p className="text-xs text-text-main/80 leading-normal"><MdText text={inhalt.texte.wieEsFunktioniertPolycarboxylatether} /></p>
                      <div className="text-[10px] bg-emerald-50 border border-emerald-250 p-2.5 rounded-lg text-emerald-900 leading-tight"><MdText text={inhalt.texte.baukastenSteuerungDurchGezielte} /></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WIRKSTOFF-KATALOG DIN 934-2 */}
        {activeTab === 'wirkstoffe' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed">
              <h3 className="font-bold text-shiraz text-base mb-2"><MdText text={inhalt.texte.die9GrundlegendenWirkungsgruppen} /></h3>
              <p><MdText text={inhalt.texte.inDerEuropäischenBauprodukt} /></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column Selector */}
              <div className="lg:col-span-5 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block pl-1"><MdText text={inhalt.texte.auswahlWirkungsgruppeEn934} /></span>
                <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {admixtureProducts.map((prod) => (
                    <button
                      key={prod.name}
                      onClick={() => setSelectedAdmixture(prod)}
                      className={`text-left p-3 rounded-xl border transition-all duration-150 flex items-start gap-3 w-full cursor-pointer ${
                        selectedAdmixture.name === prod.name
                          ? 'bg-shiraz/5 border-shiraz text-text-main shadow-xs'
                          : 'bg-white border-home-grau/25 text-text-main/75 hover:bg-stone-50 hover:border-home-grau/40'
                      }`}
                    >
                      <Atom className={`mt-0.5 flex-none ${selectedAdmixture.name === prod.name ? 'text-shiraz' : 'text-text-main/40'}`} size={16} />
                      <div className="w-full">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs lg:text-sm">{prod.name}</span>
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.25 rounded ${selectedAdmixture.name === prod.name ? 'bg-shiraz text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {prod.abbreviation}
                          </span>
                        </div>
                        <div className="text-[10px] text-text-main/50 mt-0.5 block truncate max-w-[250px]">{prod.chemicalBase}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-2">
                  <h5 className="font-bold flex items-center gap-1.5">
                    <FileText size={14} className="text-indigo-800" /><MdText text={inhalt.texte.gleichmäßigkeitsprüfungChargenkontrolle} /></h5>
                  <p className="leading-relaxed text-[11px] text-indigo-900"><MdText text={inhalt.texte.jedeHergestellteChargeEines} /></p>
                </div>
              </div>

              {/* Right Column details */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-home-grau/30 shadow-xs p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest bg-shiraz/10 px-2.5 py-1 rounded">
                      Tabelle: {selectedAdmixture.standard.split(' (')[1]?.replace(')', '') || inhalt.werte.dinEn9342}
                    </span>
                    <h4 className="text-lg font-bold text-text-main mt-2">{selectedAdmixture.name} ({selectedAdmixture.abbreviation})</h4>
                  </div>
                  <span className="text-xxs bg-stone-100 text-stone-700 font-mono px-2 py-1 rounded border">
                    {selectedAdmixture.classificationCode}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/15">
                    <span className="text-[10px] font-bold text-text-main/50 uppercase block mb-1"><MdText text={inhalt.texte.chemischeHauptwirkstoffe} /></span>
                    <span className="text-xs font-semibold text-text-main/90 leading-tight block">{selectedAdmixture.chemicalBase}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/15">
                    <span className="text-[10px] font-bold text-text-main/50 uppercase block mb-1"><MdText text={inhalt.texte.normativeRichtdosierung} /></span>
                    <span className="text-xs font-semibold text-text-main/90 leading-tight block font-mono">{selectedAdmixture.dosageCode}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider block"><MdText text={inhalt.texte.funktionProzessbeschreibung} /></span>
                  <p className="text-xs text-text-main/80 leading-relaxed bg-off-white/40 p-3 rounded-lg border border-home-grau/10">
                    {selectedAdmixture.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-stone-100 py-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Hauptwirkung:</span>
                    <span className="text-xs text-text-main/80 leading-tight block">{selectedAdmixture.primaryEffect}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.sekundärNebeneffekte} /></span>
                    <span className="text-xs text-text-main/80 leading-tight block">{selectedAdmixture.secondaryEffect}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-2">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-emerald-700" /> Vorteile:
                    </span>
                    <ul className="space-y-1.5">
                      {selectedAdmixture.advantages.map((adv, idx) => (
                        <li key={idx} className="text-xxs text-emerald-950 flex gap-1.5 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-2">
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                      <AlertTriangle size={14} className="text-amber-700" /><MdText text={inhalt.texte.anwendungsrisikenLimitierungen} /></span>
                    <ul className="space-y-1.5">
                      {selectedAdmixture.disadvantages.map((dis, idx) => (
                        <li key={idx} className="text-xxs text-amber-950 flex gap-1.5 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                          <span>{dis}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* NEUTRAL SYSTEM MATRIX SECTION */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider"><MdText text={inhalt.texte.systemklassenWirkstoffkombinationen} /></h3>
                <p className="text-xs text-text-main/60 mt-1"><MdText text={inhalt.texte.typischeBewährteKombinationskonzepteNach} /></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemCategories.map((sys, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 hover:border-shiraz/40 transition-colors">
                     <div className="font-extrabold text-xs text-shiraz border-b border-stone-100 pb-1.5 flex justify-between items-center">
                      <span>{sys.category}</span>
                      <span className="text-[9px] font-mono bg-stone-100 text-stone-600 px-1.5 rounded">Genormt</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-xxs text-text-main/85 leading-tight">
                      <p><MdText text={inhalt.texte.konsistenzVerflüssigungFmBv} />{sys.fmName}</p>
                      <p><MdText text={inhalt.texte.sonderporenLp} />{sys.lpName}</p>
                      <p><MdText text={inhalt.texte.kinetiksteuerungVzBe} />{sys.vzName} / {sys.beName}</p>
                      <p className="text-[10px] text-text-main/50 italic mt-1 pt-1 border-t border-dashed border-stone-100">
                        {sys.specialties}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: E-SCHEIN BEMESSUNGS- & w/z-ANRECHNER */}
        {activeTab === 'dosierung' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-shiraz/5 p-5 rounded-xl border border-shiraz/10 text-sm leading-relaxed text-text-main/80">
              <h3 className="font-extrabold text-shiraz text-base mb-1.5"><MdText text={inhalt.texte.eScheinPrüfungsrelevanzDie} /></h3>
              <p className="mb-2"><MdText text={inhalt.texte.beiDerBemessungHochpräziser} /></p>
              <div className="flex flex-wrap gap-4 mt-3 text-xs bg-white p-4 rounded-lg border border-shiraz/10 text-slate-800">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full block"></span><MdText text={inhalt.texte.mindestlimit02M} /></div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full block"></span><MdText text={inhalt.texte.höchstlimit50M} /></div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full block"></span><MdText text={inhalt.texte.dbcRegelWasseranrechnungPflichtige} /></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column - Inputs Form */}
              <div className="lg:col-span-5 bg-stone-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block border-b pb-1.5 mb-3"><MdText text={inhalt.texte.rezepturEckdatenEingeben} /></span>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block"><MdText text={inhalt.texte.zementgehaltZ} /></label>
                  <div className="relative">
                    <input aria-label={inhalt.werte.zementgehalt}
                      type="number"
                      step="5"
                      min="100"
                      max="600"
                      value={cementContent}
                      onChange={(e) => setCementContent(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                    />
                    <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">kg/m³</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block"><MdText text={inhalt.texte.zusatzmittelMenge} /></label>
                    <div className="relative">
                      <input aria-label={inhalt.werte.zusatzmittelMenge}
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={dosagePercent}
                        onChange={(e) => setDosagePercent(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">M.-%</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block"><MdText text={inhalt.texte.zusatzmittelDichteRho} /></label>
                    <div className="relative">
                      <input aria-label={inhalt.werte.zusatzmittelDichte}
                        type="number"
                        step="0.01"
                        min="0.9"
                        max="1.5"
                        value={admixtureDensity}
                        onChange={(e) => setAdmixtureDensity(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold font-mono">kg/l</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block"><MdText text={inhalt.texte.wassergehaltImAdditiv} /></label>
                    <div className="relative">
                      <input aria-label={inhalt.werte.wassergehaltImAdditiv}
                        type="number"
                        step="1"
                        min="20"
                        max="95"
                        value={admixtureWaterContent}
                        onChange={(e) => setAdmixtureWaterContent(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">%</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block"><MdText text={inhalt.texte.gewünschterZielWZ} /></label>
                    <input aria-label={inhalt.werte.gewünschterZielWZ}
                      type="number"
                      step="0.01"
                      min="0.30"
                      max="0.65"
                      value={targetWcValue}
                      onChange={(e) => setTargetWcValue(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block"><MdText text={inhalt.texte.abgemesseneFrischwasserZugabe} /></label>
                  <div className="relative">
                    <input aria-label={inhalt.werte.abgemesseneFrischwasserZugabe}
                      type="number"
                      step="5"
                      min="50"
                      max="250"
                      value={freshWaterAdd}
                      onChange={(e) => setFreshWaterAdd(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                    />
                    <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">l/m³</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.bewehrungskategorieChloridschranke} /></span>
                  <AuswahlGruppe label="Bewehrungskategorie" className="flex gap-2">
                    <button {...alsOption(concreteApplication === 'spann')}
                      onClick={() => setConcreteApplication('spann')}
                      className={`flex-1 p-2 border rounded-lg text-xxs font-bold text-center cursor-pointer transition-all ${
                        concreteApplication === 'spann'
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      Spannbeton
                    </button>
                    <button {...alsOption(concreteApplication === 'stahl')}
                      onClick={() => setConcreteApplication('stahl')}
                      className={`flex-1 p-2 border rounded-lg text-xxs font-bold text-center cursor-pointer transition-all ${
                        concreteApplication === 'stahl'
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      Stahlbeton
                    </button>
                    <button {...alsOption(concreteApplication === 'unbewehrt')}
                      onClick={() => setConcreteApplication('unbewehrt')}
                      className={`flex-1 p-2 border rounded-lg text-xxs font-bold text-center cursor-pointer transition-all ${
                        concreteApplication === 'unbewehrt'
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      Unbewehrt
                    </button>
                  </AuswahlGruppe>

                  <div className="space-y-1">
                    <label className="text-xxs font-bold text-slate-600 block"><MdText text={inhalt.texte.chloridgehaltImAdditivText} /></label>
                    <div className="relative">
                      <input aria-label={inhalt.werte.chloridgehaltImAdditiv}
                        type="number"
                        step="0.01"
                        min="0"
                        max="2"
                        value={admixtureChlorideContent}
                        onChange={(e) => setAdmixtureChlorideContent(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xxs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold font-mono">M.-%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Results Display */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm border-b pb-1.5 mb-4 flex items-center gap-1.5">
                    <Activity size={16} className="text-shiraz animate-pulse" /><MdText text={inhalt.texte.technischerPrüfberichtFürBetonprüfer} /></h4>

                  {/* Warning Flags */}
                  <div className="space-y-3 mb-6">
                    {/* Minimum Check */}
                    {isDosingTooLow ? (
                      <div className="bg-yellow-50 border border-yellow-200 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-yellow-950">
                        <AlertTriangle className="text-yellow-700 mt-0.5 flex-none" size={16} />
                        <div>
                          <span className="font-bold block"><MdText text={inhalt.texte.achtungSehrGeringeRezeptdosierung} />{formatDeWert(dosagePercent)} M.-%)</span><MdText text={inhalt.texte.unter02M} /></div>
                      </div>
                    ) : (
                      <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl flex items-center gap-2 text-xxs text-emerald-950">
                        <Check className="text-emerald-600" size={14} />
                        <span><MdText text={inhalt.texte.sollMindestdosierungEingehalten0} /></span>
                      </div>
                    )}

                    {/* Maximum Check */}
                    {isDosingTooHigh ? (
                      <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-red-950 animate-bounce">
                        <ShieldAlert className="text-red-700 mt-0.5 flex-none" size={16} />
                        <div>
                          <span className="font-bold block"><MdText text={inhalt.texte.fehlerHöchstdosierungNachDin} /></span><MdText text={inhalt.texte.dieDosierungVon} /><strong>{formatDeWert(dosagePercent)} M.-%</strong><MdText text={inhalt.texte.istZuHochZusatzmittel} /></div>
                      </div>
                    ) : (
                      <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl flex items-center gap-2 text-xxs text-emerald-950">
                        <Check className="text-emerald-600" size={14} />
                        <span><MdText text={inhalt.texte.maximaldosierungNachDinEn} /></span>
                      </div>
                    )}

                    {/* Chloride Check */}
                    {isChlorideExcessive ? (
                      <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-red-950">
                        <ShieldAlert className="text-red-700 mt-0.5 flex-none" size={16} />
                        <div>
                          <span className="font-bold block"><MdText text={inhalt.texte.fehlerUnzulässigeKorrosionsgefährdungSpa} /></span><MdText text={inhalt.texte.fürSpannbetonVorgespannteGlieder} /><strong>{formatDeWert(admixtureChlorideContent)} M.-%</strong><MdText text={inhalt.texte.birgtAkuteGefahrenVon} /></div>
                      </div>
                    ) : (
                      <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl flex items-center gap-2 text-xxs text-emerald-950">
                        <Check className="text-emerald-600" size={14} />
                        <span><MdText text={inhalt.texte.chloridGrenzwert} />{concreteApplication === 'spann' ? inhalt.werte.t010FürSpannbeton : inhalt.werte.keineKritischenSchranken}<MdText text={inhalt.texte.eingehalten} /></span>
                      </div>
                    )}
                  </div>

                  {/* Calculations Sheet */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-stone-50 p-4 rounded-xl border border-slate-200 text-center space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Zusatzmittel-Gewicht</span>
                      <span className="text-base font-extrabold text-slate-800 block">{formatDeZahl(admixtureMass, 2)} kg/m³</span>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-xl border border-slate-200 text-center space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block"><MdText text={inhalt.texte.zubehörtesVolumen} /></span>
                      <span className="text-base font-extrabold text-slate-800 block">{formatDeZahl(admixtureVolume, 2)} l/m³</span>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-xl border border-slate-200 text-center space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block"><MdText text={inhalt.texte.anteiligesWasserWEigenwasser} /></span>
                      <span className="text-base font-extrabold text-slate-800 block">{formatDeZahl(admixtureWaterMass, 2)} Liter</span>
                    </div>
                  </div>

                  {/* The 3-Liter Rule Box */}
                  <div className={`p-5 rounded-2xl border ${isWaterAnrechnungMandatory ? 'bg-sky-50 border-sky-200 text-sky-950' : 'bg-stone-50 border-stone-200 text-slate-700'} space-y-3`}>
                    <div className="flex items-center gap-2 font-extrabold">
                      <Scale className={isWaterAnrechnungMandatory ? 'text-sky-700' : 'text-slate-500'} size={18} />
                      <h5><MdText text={inhalt.texte.die3LiterWasseranrechnungsregel} /></h5>
                    </div>
                    {isWaterAnrechnungMandatory ? (
                      <p className="text-xs leading-relaxed font-normal"><MdText text={inhalt.texte.pflichtigesPrüfungskriteriumDaDas} /><strong>{formatDeZahl(admixtureVolume, 2)} Litern</strong><MdText text={inhalt.texte.dieGrenzeVon3} />{formatDeZahl(admixtureWaterMass, 1)}<MdText text={inhalt.texte.lZwingendAlsMischwasser} /></p>
                    ) : (
                      <p className="text-xs leading-relaxed font-normal"><MdText text={inhalt.texte.daDasZugegebeneVolumen} /><strong>{formatDeZahl(admixtureVolume, 2)} Litern</strong><MdText text={inhalt.texte.dieGrenzeVon32} /></p>
                    )}

                    {/* Compare W/C Ratio */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-bold block"><MdText text={inhalt.texte.wasserzementwertOhneAnrechnungRechnerisc} /></span>
                        <span className="text-sm font-extrabold text-slate-800 block font-mono">{formatDeZahl(rawWcRatio, 3)}</span>
                        <span className="text-[10px] text-slate-400 italic block mt-0.5"><MdText text={inhalt.texte.frischwasserZement} /></span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-semibold block flex items-center gap-1"><MdText text={inhalt.texte.tatsächlicherEffektiverWZ} />{isWaterAnrechnungMandatory && <span className="bg-sky-500 text-white font-mono font-bold text-[8px] px-1 py-0.2 px-1 rounded">VORSCHRIFT</span>}
                        </span>
                        <span className={`text-sm font-extrabold block font-mono ${!Number.isFinite(effectiveWcRatio) ? 'text-slate-700' : effectiveWcRatio > targetWcValue ? 'text-red-600' : 'text-emerald-700'}`}>
                          {formatDeZahl(effectiveWcRatio, 3)}
                        </span>
                        <span className="text-[10px] text-slate-400 italic block mt-0.5"><MdText text={inhalt.texte.effektivesWasser} />{formatDeZahl(effectiveWater, 1)} l) / Zement</span>
                      </div>
                    </div>

                    {!Number.isFinite(effectiveWcRatio) ? (
                      // keine Zahl (z. B. leeres Feld): keine Aussage zum Grenzwert (vorher „hält … sicher ein“)
                      <div className="p-3 bg-off-white border border-home-grau/30 text-text-main rounded-lg text-xxs leading-relaxed mt-2">–</div>
                    ) : effectiveWcRatio > targetWcValue ? (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-950 font-semibold rounded-lg text-xxs leading-relaxed mt-2 flex gap-1.5 items-start">
                        <AlertTriangle size={14} className="text-red-700 flex-none mt-0.5" />
                        <div><MdText text={inhalt.texte.gefahrZielWZ} />{formatDeZahl(effectiveWcRatio, 3)}<MdText text={inhalt.texte.übersteigtDenGrenzwertVon} />{formatDeZahl(targetWcValue, 2)}<MdText text={inhalt.texte.durchDasEigenwasserDes} /><strong>{formatDeZahl((targetWcValue * cementContent - (isWaterAnrechnungMandatory ? admixtureWaterMass : 0)), 0)} l/m³</strong><MdText text={inhalt.texte.umDieRezeptvorgabeZu} /></div>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-950 font-semibold rounded-lg text-xxs leading-relaxed mt-2 flex gap-1.5 items-center">
                        <Check size={14} className="text-emerald-700" />
                        <span><MdText text={inhalt.texte.derTatsächlicheWZ} />{formatDeZahl(effectiveWcRatio, 3)}<MdText text={inhalt.texte.hältDenGefordertenGrenzwert} />{formatDeZahl(targetWcValue, 2)} sicher ein.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRAXISBEISPIELE */}
        {activeTab === 'praxis' && (
          <div className="p-1 animate-in fade-in duration-300">
            <PraxisTabContent moduleKey="bp_betonzusatzmittel" />
          </div>
        )}

        {/* TAB 5: ZUKUNFTSTRENDS */}
        {activeTab === 'innovation' && (
          <div className="p-1 animate-in fade-in duration-300">
            <InnovationTabContent moduleKey="bp_betonzusatzmittel" />
          </div>
        )}
        </ModuleTabs>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielWasseranrechnungEinesF}
          zielGleichung="(w/z)_{eq} = \frac{w_{Zugabe} + w_{FM}}{z}"
          normQuelle={inhalt.werte.dinEn206Din}
          schritte={inhalt.daten["BpBetonzusatzmittel.schritte"]}
          ergebnisHinweis={inhalt.werte.dieAnrechnungVerschiebtDen}
        />
      </div>

      <ModulTest moduleId="bp_betonzusatzmittel" />

      <ModuleFooter
        weblinks={inhalt.daten["BpBetonzusatzmittel.weblinks"]}
        wikipedia={[
          { title: 'Betonzusatzmittel', url: 'https://de.wikipedia.org/wiki/Betonzusatzmittel' },
          { title: 'Wasserzementwert', url: 'https://de.wikipedia.org/wiki/Wasserzementwert' },
          { title: 'Zement', url: 'https://de.wikipedia.org/wiki/Zement' }
        ]}
        literatur={inhalt.daten["BpBetonzusatzmittel.literatur"]}
        regelwerke={inhalt.daten["BpBetonzusatzmittel.regelwerke"]}
        formeln={inhalt.daten["BpBetonzusatzmittel.formeln"]}
      />
    </div>
  );
}
