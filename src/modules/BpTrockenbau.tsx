import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath } from 'react-katex';
import { 
  Layers, BookOpen, CheckCircle2, Lightbulb, Calculator, Percent, Sparkles, 
  AlertCircle, FileText, CheckCircle, Flame, Volume2, 
  Compass, ChevronRight, Wrench, Info
} from 'lucide-react';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';
import inhalt from '@/content/bptrockenbau/BpTrockenbau.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, ReiterLeiste, alsOption, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';

interface ProductSpec {
  id: string;
  name: string;
  category: string;
  dinNorm: string;
  colorCodeName: string;
  colorCodeBg: string; // Background class for visualization
  colorBorder: string; // Border class
  density: number; // in kg/m³
  lambda: number; // in W/mK
  muValue: number; // dampfdiffusionswiderstand
  fireClass: string;
  weightPerM2: number; // kg per m²
  advantages: string[];
  description: string;
  systemIntegration: string;
}

interface SystemSpec {
  id: string;
  code: string;
  name: string;
  structure: string;
  thickness: string;
  fireRating: string;
  soundRating: string;
  description: string;
  application: string;
  profileType: string;
  spacing: string;
}

const DRY_PRODUCTS_DB: ProductSpec[] = inhalt.daten.DRY_PRODUCTS_DB;

const DRY_SYSTEMS_DB: SystemSpec[] = inhalt.daten.DRY_SYSTEMS_DB;

export default function BpTrockenbau() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'klassen' | 'rechner' | 'praxis' | 'innovation'>('allgemein');
  const [selectedSubCategory, setSelectedSubCategory] = useState<'produkte' | 'systeme'>('produkte');
  const [selectedProductId, setSelectedProductId] = useState<string>('standard_gkb');
  const [selectedSystemId, setSelectedSystemId] = useState<string>('w111');

  // Calculator State
  const [wallArea, setWallArea] = useState<number>(20);
  const [layerCount, setLayerCount] = useState<1 | 2>(2); // 1 = einfach, 2 = doppelt beplankt
  const [profileSpacing, setProfileSpacing] = useState<62.5 | 31.25>(62.5); // standard Ständerabstand in cm
  const [includeInsulation, setIncludeInsulation] = useState<boolean>(true);

  // Calculation coefficients
  const plasterboardArea = parseFloat((wallArea * layerCount * 2 * 1.05).toFixed(1)); // both sides + 5% waste
  const cwProfilesMeter = parseFloat((wallArea * (profileSpacing === 62.5 ? 2.0 : 3.8) * 1.05).toFixed(1));
  const uwProfilesMeter = parseFloat((wallArea * 0.7 * 1.05).toFixed(1));
  const screwsCount = Math.ceil(wallArea * (layerCount === 1 ? 30 : 55) * 1.05);
  const jointFillerKg = parseFloat((wallArea * layerCount * 2 * 0.45).toFixed(1)); // 0.45 kg per m² per layer per side
  const sealTapeMeter = parseFloat((wallArea * 0.8).toFixed(1));
  const insulationArea = includeInsulation ? parseFloat((wallArea * 1.02).toFixed(1)) : 0;

  // Selected details
  const activeProduct = DRY_PRODUCTS_DB.find(p => p.id === selectedProductId) || DRY_PRODUCTS_DB[0];
  const activeSystem = DRY_SYSTEMS_DB.find(s => s.id === selectedSystemId) || DRY_SYSTEMS_DB[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.trockenbauBauprodukte} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.imModernenTrockenbauWerden} /></p>
        </div>

        {/* Dynamic sub navigation tabs */}
        <ModuleTabs
          label={inhalt.werte.reiterBereiche}
          tabs={[
            { id: 'allgemein' as const, label: 'Basiswissen', icon: BookOpen },
            { id: 'klassen' as const, label: inhalt.texte.spachtelklassenAkustik, icon: Percent },
            { id: 'rechner' as const, label: 'Bedarfsrechner', icon: Calculator },
            { id: 'praxis' as const, label: 'Praxisbeispiele', icon: CheckCircle2 },
            { id: 'innovation' as const, label: 'Zukunftstrends', icon: Lightbulb },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6"
        >

        {/* Tab 1: Allgemeines Basiswissen */}
        {activeTab === 'allgemein' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.derModerneTrockenbauIst} /></p>
            </div>

            {/* Toggle Subcategory switcher */}
            <ReiterLeiste label="Produkte oder Systeme" className="bg-slate-50 border border-slate-200 p-1.5 rounded-xl flex gap-2">
              <button {...alsReiter(selectedSubCategory === 'produkte', 'trockenbau-bereich', 'produkte')}
                onClick={() => setSelectedSubCategory('produkte')}
                className={`flex-1 py-2 text-center text-xs font-extrabold flex items-center justify-center gap-2 rounded-lg transition-all border cursor-pointer ${
                  selectedSubCategory === 'produkte'
                    ? 'bg-white border-slate-200 text-shiraz shadow-sm'
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText size={14} /><MdText text={inhalt.texte.t1BauprodukteSpezialplattenDin} /></button>
              <button {...alsReiter(selectedSubCategory === 'systeme', 'trockenbau-bereich', 'systeme')}
                onClick={() => setSelectedSubCategory('systeme')}
                className={`flex-1 py-2 text-center text-xs font-extrabold flex items-center justify-center gap-2 rounded-lg transition-all border cursor-pointer ${
                  selectedSubCategory === 'systeme'
                    ? 'bg-white border-slate-200 text-shiraz shadow-sm'
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers size={14} /><MdText text={inhalt.texte.t2SystemaufbautenMontagestandardsDin} /></button>
            </ReiterLeiste>

            {/* Sub-Tab 1.1: Interactive Products Database */}
            {selectedSubCategory === 'produkte' && (
              <div {...reiterPanel('trockenbau-bereich', selectedSubCategory)} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Product List Sidebar */}
                <AuswahlGruppe label="Produkt" className="lg:col-span-5 flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 select-none"><MdText text={inhalt.texte.verfügbareAusbauproduktePlatten} /></h4>
                  {DRY_PRODUCTS_DB.map((prod) => (
                    <button {...alsOption(selectedProductId === prod.id)}
                      key={prod.id}
                      onClick={() => setSelectedProductId(prod.id)}
                      className={`p-3 text-left rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        selectedProductId === prod.id
                          ? 'bg-shiraz/5 border-shiraz text-shiraz ring-1 ring-shiraz'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-350'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-3.5 h-3.5 rounded-full border ${prod.colorCodeBg} ${prod.colorBorder} shrink-0`} />
                        <div>
                          <p className="text-xs font-bold leading-tight">{prod.name}</p>
                          <p className="text-[10px] text-slate-450 font-mono mt-0.5">{prod.dinNorm}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>
                  ))}
                </AuswahlGruppe>

                {/* Selected Product Specifications Detail Panel */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm">
                  {/* Visual Header */}
                  <div className={`p-5 border-b border-slate-100 flex items-start gap-4 ${activeProduct.colorCodeBg}`}>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">{activeProduct.category}</div>
                      <h3 className="text-lg font-black text-slate-900 leading-tight">{activeProduct.name}</h3>
                      <p className="text-[11px] font-semibold text-slate-600 mt-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-slate-400" /> Farbcodierung: {activeProduct.colorCodeName}
                      </p>
                    </div>
                    <span className="bg-white border border-slate-200 text-slate-800 text-[10px] px-2.5 py-1 rounded-md font-mono font-bold shrink-0">
                      {activeProduct.dinNorm}
                    </span>
                  </div>

                  {/* Physical Parameters Bento Grid */}
                  <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50/50">
                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Flächengewicht</span>
                      <span className="text-sm font-mono font-black text-slate-800">{formatDeZahl(activeProduct.weightPerM2, 1)} kg/m²</span>
                      <span className="text-[8px] text-slate-450 block font-bold leading-none mt-0.5"><MdText text={inhalt.texte.stärkeD125mm} /></span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Rohdichte α</span>
                      <span className="text-sm font-mono font-black text-slate-800">{formatDeWert(activeProduct.density)} kg/m³</span>
                      <span className="text-[8px] text-slate-450 block font-bold leading-none mt-0.5">(Verdichtungsfaktor)</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase"><MdText text={inhalt.texte.wasserdampf} /></span>
                      <span className="text-sm font-mono font-black text-slate-800">µ = {formatDeWert(activeProduct.muValue)}</span>
                      <span className="text-[8px] text-slate-450 block font-bold leading-none mt-0.5">(Diffusionswiderstand)</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase"><MdText text={inhalt.texte.thermischeLeitf} /></span>
                      <span className="text-sm font-mono font-black text-slate-800">{formatDeZahl(activeProduct.lambda, 3)} W/mK</span>
                      <span className="text-[8px] text-slate-450 block font-bold leading-none mt-0.5">(Wärmeübertrag)</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl col-span-2">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase"><MdText text={inhalt.texte.brandschutzklasseEn13501} /></span>
                      <span className="text-xs font-mono font-black text-slate-800 flex items-center gap-1 mt-0.5 uppercase tracking-tight">
                        <Flame size={12} className="text-red-500 shrink-0" /> {activeProduct.fireClass}
                      </span>
                    </div>
                  </div>

                  {/* Text descriptions */}
                  <div className="p-5 space-y-4 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                        <Info size={12} className="text-slate-400" /><MdText text={inhalt.texte.bauphysikalischeWirkungsweise} /></h4>
                      <p className="text-slate-600 leading-relaxed">{activeProduct.description}</p>
                    </div>

                    {/* Checkbox list of advantages */}
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                        <CheckCircle2 size={12} className="text-shiraz" /><MdText text={inhalt.texte.vorteileEigenschaftenImAusbau} /></h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-650">
                        {activeProduct.advantages.map((adv, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <CheckCircle size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                            <span className="text-[11px] leading-tight font-medium text-slate-750">{adv}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-2xl">
                      <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <Wrench size={12} className="text-shiraz" /><MdText text={inhalt.texte.typischeEinbindungInSysteme} /></h4>
                      <p className="text-slate-600 text-[11px] font-medium leading-relaxed">{activeProduct.systemIntegration}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 1.2: Interactive Systems Database */}
            {selectedSubCategory === 'systeme' && (
              <div {...reiterPanel('trockenbau-bereich', selectedSubCategory)} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* System List Sidebar */}
                <AuswahlGruppe label="System" className="lg:col-span-5 flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 select-none"><MdText text={inhalt.texte.ausgewählteTrockenbauMontagesysteme} /></h4>
                  {DRY_SYSTEMS_DB.map((sys) => (
                    <button {...alsOption(selectedSystemId === sys.id)}
                      key={sys.id}
                      onClick={() => setSelectedSystemId(sys.id)}
                      className={`p-3 text-left rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        selectedSystemId === sys.id
                          ? 'bg-shiraz/5 border-shiraz text-shiraz ring-1 ring-shiraz'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-350'
                      }`}
                    >
                      <div>
                        <p className="text-[9px] font-semibold text-slate-400 font-mono">{sys.code}</p>
                        <p className="text-xs font-bold leading-tight mt-0.5">{sys.name}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>
                  ))}
                </AuswahlGruppe>

                {/* Selected System Specification Detail Panel */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm">
                  {/* Header */}
                  <div className="p-5 border-b border-slate-100 bg-slate-50">
                    <div className="text-[9px] font-bold text-slate-400 font-mono mb-1">{activeSystem.code}</div>
                    <h3 className="text-base font-black text-slate-900 leading-tight">{activeSystem.name}</h3>
                  </div>

                  {/* Parameters Grid */}
                  <div className="p-5 grid grid-cols-2 gap-3 bg-slate-50/50">
                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Konstruktionsaufbau</span>
                      <span className="text-xs font-bold text-slate-800 leading-tight block mt-1">{activeSystem.structure}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase"><MdText text={inhalt.texte.gesamtdickeCa} /></span>
                      <span className="text-sm font-mono font-black text-slate-800 block mt-1">{activeSystem.thickness}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase flex items-center gap-1">
                        <Flame size={10} className="text-red-500" /> Brandschutzklasse
                      </span>
                      <span className="text-xs font-bold text-slate-800 block mt-1">{activeSystem.fireRating}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase flex items-center gap-1">
                        <Volume2 size={10} className="text-blue-500" /><MdText text={inhalt.texte.schalldämmMassRW} /></span>
                      <span className="text-xs font-bold text-slate-800 block mt-1">{activeSystem.soundRating}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Profil-Typ</span>
                      <span className="text-xs font-mono font-bold text-slate-800 block mt-1">{activeSystem.profileType}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase"><MdText text={inhalt.texte.profilabstandStandard} /></span>
                      <span className="text-xs font-mono font-bold text-slate-800 block mt-1">{activeSystem.spacing}</span>
                    </div>
                  </div>

                  {/* Description & Application */}
                  <div className="p-5 space-y-4 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                        <Compass size={12} className="text-slate-400" /> Systembeschreibung
                      </h4>
                      <p className="text-slate-600 leading-relaxed">{activeSystem.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-2xl">
                      <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-shiraz" /><MdText text={inhalt.texte.primäresEinsatzgebiet} /></h4>
                      <p className="text-slate-600 text-[11px] font-medium leading-relaxed">{activeSystem.application}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* General Profile Specs Banner (Metal Profiles DIN EN 14195) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <Layers size={14} className="text-shiraz" /><MdText text={inhalt.texte.systemkomponentenMetallProfiltechnikDin} /></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="font-semibold text-slate-900 border-b border-slate-200 pb-1.5 mb-1.5"><MdText text={inhalt.texte.wandStänderwerkeStahlstärke0} /></p>
                  <ul className="list-inside list-disc space-y-1 leading-relaxed">
                    <li><MdText text={inhalt.texte.uwRahmenprofilHorizontaleBefestigung} /></li>
                    <li><MdText text={inhalt.texte.cwStänderprofilVertikaleSteh} /></li>
                    <li><MdText text={inhalt.texte.uaAussteifungsprofil20} /></li>
                  </ul>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="font-semibold text-slate-900 border-b border-slate-200 pb-1.5 mb-1.5"><MdText text={inhalt.texte.deckenrasterKorrosionsschutz} /></p>
                  <ul className="list-inside list-disc space-y-1 leading-relaxed">
                    <li><MdText text={inhalt.texte.udWandprofilCdTragprofil} /></li>
                    <li><MdText text={inhalt.texte.schnellbauschraubenDin18182Phosphatbesch} /></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Spachtelklassen & Bauphysik */}
        {activeTab === 'klassen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-sm">
              <h3 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.oberflächenqualitätenNachBundesverbandDe} /></h3>
              <p className="text-text-main/80 text-xs"><MdText text={inhalt.texte.dieSpachtelklassenRegelnDie} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border border-home-grau/30 rounded-xl p-4 bg-white relative overflow-hidden">
                <span aria-hidden="true" data-wasserzeichen="Q 1" className="absolute top-2 right-2 text-3xl font-black text-home-grau/10 after:content-[attr(data-wasserzeichen)]" />
                <h4 className="font-bold text-text-main text-lg mb-2">Klasse Q1</h4>
                <p className="text-xs text-text-main/70 mb-3"><MdText text={inhalt.texte.grundverspachtelungNurStoßfugenFüllen} /></p>
                <div className="bg-slate-50 p-2 rounded text-xxs text-slate-700 font-medium"><MdText text={inhalt.texte.eignungUnterFliesenPlatten} /></div>
              </div>

              <div className="border border-home-grau/30 rounded-xl p-4 bg-white relative overflow-hidden">
                <span aria-hidden="true" data-wasserzeichen="Q 2" className="absolute top-2 right-2 text-3xl font-black text-home-grau/10 after:content-[attr(data-wasserzeichen)]" />
                <h4 className="font-bold text-text-main text-lg mb-2">Klasse Q2</h4>
                <p className="text-xs text-text-main/70 mb-3"><MdText text={inhalt.texte.standardspachtelungQ1MitNachspachteln} /></p>
                <div className="bg-slate-50 p-2 rounded text-xxs text-slate-700 font-medium"><MdText text={inhalt.texte.eignungRaufasertapetenMatteFüllende} /></div>
              </div>

              <div className="border border-home-grau/30 rounded-xl p-4 bg-white relative overflow-hidden">
                <span aria-hidden="true" data-wasserzeichen="Q 3" className="absolute top-2 right-2 text-3xl font-black text-home-grau/10 after:content-[attr(data-wasserzeichen)]" />
                <h4 className="font-bold text-text-main text-lg mb-2">Klasse Q3</h4>
                <p className="text-xs text-text-main/70 mb-3"><MdText text={inhalt.texte.sonderverspachtelungQ2MitEiner} /></p>
                <div className="bg-amber-50 text-amber-900 p-2 rounded text-xxs font-medium"><MdText text={inhalt.texte.eignungFeinstrukturierteTapetenMatte} /></div>
              </div>

              <div className="border border-home-grau/30 rounded-xl p-4 bg-white relative overflow-hidden">
                <span aria-hidden="true" data-wasserzeichen="Q 4" className="absolute top-2 right-2 text-3xl font-black text-home-grau/10 after:content-[attr(data-wasserzeichen)]" />
                <h4 className="font-bold text-text-main text-lg mb-2">Klasse Q4</h4>
                <p className="text-xs text-text-main/70 mb-3"><MdText text={inhalt.texte.vollflächigeSpachtelungVollflächigeÜberz} /></p>
                <div className="bg-emerald-50 text-emerald-900 p-2 rounded text-xxs font-medium"><MdText text={inhalt.texte.eignungGlänzendeBeschichtungenMetall} /></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-bold text-home-prim text-lg mb-3"><MdText text={inhalt.texte.bauphysikalischeKennwerteVonMetallstände} /></h3>
              <div className="overflow-x-auto text-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-off-white border-b border-home-grau/30">
                      <th className="p-3 font-bold">Wandaufbau</th>
                      <th className="p-3 font-bold"><MdText text={inhalt.texte.profilbreiteMm} /></th>
                      <th className="p-3 font-bold"><MdText text={inhalt.texte.wanddickeMm} /></th>
                      <th className="p-3 font-bold"><MdText text={inhalt.texte.beplankungJeSeite} /></th>
                      <th className="p-3 font-bold"><MdText text={inhalt.texte.schallschutzRWDb} /></th>
                      <th className="p-3 font-bold">Brandschutzklasse</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/10">
                    <tr>
                      <td className="p-3"><MdText text={inhalt.texte.cw50EinfachBeplankt} /></td>
                      <td className="p-3">50</td>
                      <td className="p-3">75</td>
                      <td className="p-3"><MdText text={inhalt.texte.t1x125Mm} /></td>
                      <td className="p-3">ca. 45 dB</td>
                      <td className="p-3"><MdText text={inhalt.texte.f30AMit} /></td>
                    </tr>
                    <tr>
                      <td className="p-3"><MdText text={inhalt.texte.cw75EinfachBeplankt} /></td>
                      <td className="p-3">75</td>
                      <td className="p-3">100</td>
                      <td className="p-3"><MdText text={inhalt.texte.t1x125Mm2} /></td>
                      <td className="p-3">ca. 48 dB</td>
                      <td className="p-3">F 30-A</td>
                    </tr>
                    <tr className="bg-emerald-50/20">
                      <td className="p-3 font-semibold"><MdText text={inhalt.texte.cw50DoppeltBeplankt} /></td>
                      <td className="p-3">50</td>
                      <td className="p-3">100</td>
                      <td className="p-3"><MdText text={inhalt.texte.t2x125Mm} /></td>
                      <td className="p-3">ca. 52 dB</td>
                      <td className="p-3"><MdText text={inhalt.texte.f90AMit} /></td>
                    </tr>
                    <tr className="bg-emerald-50/20">
                      <td className="p-3 font-semibold"><MdText text={inhalt.texte.cw75DoppeltBeplankt} /></td>
                      <td className="p-3">75</td>
                      <td className="p-3">125</td>
                      <td className="p-3"><MdText text={inhalt.texte.t2x125Mm2} /></td>
                      <td className="p-3">ca. 56 dB</td>
                      <td className="p-3">F 90-A</td>
                    </tr>
                    <tr>
                      <td className="p-3"><MdText text={inhalt.texte.doppelständerwerkCw5050} /></td>
                      <td className="p-3"><MdText text={inhalt.texte.t2x50Entkoppelt} /></td>
                      <td className="p-3">155</td>
                      <td className="p-3"><MdText text={inhalt.texte.t2x125Mm3} /></td>
                      <td className="p-3"><MdText text={inhalt.texte.ca62DbHervorragend} /></td>
                      <td className="p-3">F 90-A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-text-main/60 mt-3 italic"><MdText text={inhalt.texte.dieAngegebenenSchalldämmMaße} /></p>
            </div>
          </div>
        )}

        {/* Tab 3: Interactive Material Estimator */}
        {activeTab === 'rechner' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-text-main text-lg mb-2 flex items-center gap-2">
                <Calculator className="text-shiraz" size={20} /><MdText text={inhalt.texte.trockenbauMaterialbedarfsRechnerWände} /></h3>
              <p className="text-xs text-text-main/80 mb-4"><MdText text={inhalt.texte.errechnenSieDenMaterialtechnischen} /></p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end mt-4">
                {/* Wall area */}
                <div>
                  <label className="block text-xs font-bold text-text-main mb-1"><MdText text={inhalt.texte.wandflächeM} /></label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="20"
                    value={wallArea}
                    onChange={(e) => setWallArea(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full bg-white border border-home-grau/30 rounded-lg p-2.5 text-sm text-text-main focus:ring-1 focus:ring-shiraz focus:outline-none"
                  />
                </div>

                {/* Beplankung */}
                <div>
                  <label className="block text-xs font-bold text-text-main mb-1"><MdText text={inhalt.texte.beplankungJeWandseite} /></label>
                  <select aria-label={inhalt.werte.beplankungJeWandseite}
                    value={layerCount}
                    onChange={(e) => setLayerCount(parseInt(e.target.value) as 1 | 2)}
                    className="w-full bg-white border border-home-grau/30 rounded-lg p-2.5 text-sm text-text-main focus:ring-1 focus:ring-shiraz focus:outline-none"
                  >
                    <option value={1}>1-lagig (Einfach - 12,5mm)</option>
                    <option value={2}>2-lagig (Doppelt - 25,0mm)</option>
                  </select>
                </div>

                {/* Profilabstand */}
                <div>
                  <label className="block text-xs font-bold text-text-main mb-1"><MdText text={inhalt.texte.ständerachsabstandCm} /></label>
                  <select aria-label={inhalt.werte.ständerachsabstandCm}
                    value={profileSpacing}
                    onChange={(e) => setProfileSpacing(parseFloat(e.target.value) as 62.5 | 31.25)}
                    className="w-full bg-white border border-home-grau/30 rounded-lg p-2.5 text-sm text-text-main focus:ring-1 focus:ring-shiraz focus:outline-none"
                  >
                    <option value={62.5}>62,5 cm (Standard)</option>
                    <option value={31.25}>31,25 cm (Erhöhter Schall/Fliesen)</option>
                  </select>
                </div>

                {/* Insulation */}
                <div className="flex items-center h-[42px]">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-main select-none">
                    <input
                      type="checkbox"
                      checked={includeInsulation}
                      onChange={(e) => setIncludeInsulation(e.target.checked)}
                      className="accent-shiraz size-4"
                    /><MdText text={inhalt.texte.inklusiveHohlraumdämmung} /></label>
                </div>
              </div>
            </div>

            {/* Results Output */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 border border-home-grau/30 rounded-xl p-5 bg-white">
                <h4 className="font-bold text-home-prim text-md mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-shiraz" /><MdText text={inhalt.texte.errechneteMaterialmengen} /></h4>
                <div className="space-y-4 divide-y divide-home-grau/10">
                  <div className="flex items-center justify-between pb-2">
                    <div>
                      <p className="text-sm font-semibold text-text-main">Gipsbauplatten</p>
                      <p className="text-xs text-text-main/50"><MdText text={inhalt.texte.beidseitigBeplanktInkl5} /></p>
                    </div>
                    <p className="text-base font-bold text-shiraz">{formatDeWert(plasterboardArea)} m²</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 pb-2">
                    <div>
                      <p className="text-sm font-semibold text-text-main">CW-Ständerprofile</p>
                      <p className="text-xs text-text-main/50"><MdText text={inhalt.texte.vertikalesStänderwerkSchnittgrößenZ} /></p>
                    </div>
                    <p className="text-base font-bold text-text-main">{formatDeWert(cwProfilesMeter)} lfm</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 pb-2">
                    <div>
                      <p className="text-sm font-semibold text-text-main">UW-Boden/Deckenprofile</p>
                      <p className="text-xs text-text-main/50"><MdText text={inhalt.texte.obererUndUntererWandanschluss} /></p>
                    </div>
                    <p className="text-base font-bold text-text-main">{formatDeWert(uwProfilesMeter)} lfm</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 pb-2">
                    <div>
                      <p className="text-sm font-semibold text-text-main"><MdText text={inhalt.texte.schnellbauschrauben253545} /></p>
                      <p className="text-xs text-text-main/50"><MdText text={inhalt.texte.phosphatiertMitFeingewindeFür} /></p>
                    </div>
                    <p className="text-base font-bold text-text-main">{screwsCount} Stk</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 pb-2">
                    <div>
                      <p className="text-sm font-semibold text-text-main"><MdText text={inhalt.texte.fugenUndSpachtelmasseKunststoff} /></p>
                      <p className="text-xs text-text-main/50"><MdText text={inhalt.texte.fürFugenUndSchraubenköpfe} /></p>
                    </div>
                    <p className="text-base font-bold text-text-main">{formatDeWert(jointFillerKg)} kg</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 pb-2">
                    <div>
                      <p className="text-sm font-semibold text-text-main">Anschluss-Dichtungsband</p>
                      <p className="text-xs text-text-main/50"><MdText text={inhalt.texte.elastischesSchaumstoffbandFürEntkopplung} /></p>
                    </div>
                    <p className="text-base font-bold text-text-main">{formatDeWert(sealTapeMeter)} lfm</p>
                  </div>

                  {includeInsulation && (
                    <div className="flex items-center justify-between pt-2 pb-2 text-emerald-800 bg-emerald-50/40 p-1.5 rounded">
                      <div>
                        <p className="text-sm font-semibold"><MdText text={inhalt.texte.trennwandDämmungMineralwolle} /></p>
                        <p className="text-xs text-emerald-700"><MdText text={inhalt.texte.dickeAngepasstAnCw} /></p>
                      </div>
                      <p className="text-base font-bold">{formatDeWert(insulationArea)} m²</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-off-white flex flex-col gap-4">
                <h4 className="font-bold text-text-main text-sm flex items-center gap-1.5">
                  <AlertCircle size={16} className="text-home-grau" />
                  Kalkulations-Insidertips
                </h4>
                <div className="text-xs text-text-main/80 space-y-3">
                  <p><MdText text={inhalt.texte.t1ZweitlagigeVerschraubungBei} /></p>
                  <p><MdText text={inhalt.texte.t2FugenversatzVermeidenSie} /></p>
                  <p><MdText text={inhalt.texte.t3SchallentkopplungOhneDas} /></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Praxisbeispiele */}
        {activeTab === 'praxis' && <PraxisTabContent moduleKey="bp_trockenbau" />}

        {/* Tab 5: Zukunftstrends */}
        {activeTab === 'innovation' && <InnovationTabContent moduleKey="bp_trockenbau" />}
        </ModuleTabs>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielResonanzfrequenzEinerM}
          zielGleichung="f_0 \approx 50 \cdot \sqrt{\frac{1}{d}\left(\frac{1}{m'_1} + \frac{1}{m'_2}\right)}"
          normQuelle={inhalt.werte.masseFederMasseModell}
          schritte={inhalt.daten["BpTrockenbau.schritte"]}
          ergebnisHinweis={inhalt.werte.doppelbeplankungSenktF0}
        />
      </div>

      <ModulTest moduleId="bp_trockenbau" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Trockenbau', url: 'https://de.wikipedia.org/wiki/Trockenbau' },
          { title: 'Gipskarton', url: 'https://de.wikipedia.org/wiki/Gipskarton' },
          { title: 'Schallschutz', url: 'https://de.wikipedia.org/wiki/Schallschutz' }
        ]} 
        literatur={inhalt.daten["BpTrockenbau.literatur"]} 
        regelwerke={inhalt.daten["BpTrockenbau.regelwerke"]} 
        formeln={inhalt.daten["BpTrockenbau.formeln"]} 
      />
    </div>
  );
}
