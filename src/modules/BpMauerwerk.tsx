import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Layers, BookOpen, ShieldAlert, ArrowRight, CheckCircle2, Lightbulb, Settings, Settings as ToolIcon, Sparkles, AlertTriangle } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';
import inhalt from '@/content/bpmauerwerk/BpMauerwerk.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

interface MauerwerkProduct {
  name: string;
  code: string;
  standard: string;
  lambdaRange: string;
  densityRange: string;
  strengthClass: string;
  mortarType: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  applications: string[];
}

const masonryProducts: MauerwerkProduct[] = inhalt.daten.masonryProducts;

function MauerwerkThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  const handleDauerhaftigkeitClick = () => {
    localStorage.setItem('dauerhaftigkeit_subtab', 'naturstein');
    setActiveTab('dauerhaftigkeit');
  };

  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.materialLehrpfadMauerwerkStein} /></h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5"><MdText text={inhalt.texte.weiterZuDenAnderen} /></p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('mauerwerk')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
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
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.steinartenZiegelKsPorenbeton} /></span>
          {current !== 'baustoff' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_mauerwerk')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t2MauerwerksproduktePraxis} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.hintermauerUndVormauerziegelPlanblöcke} /></span>
          {current !== 'bauprodukt' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={handleDauerhaftigkeitClick}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t3AlterungDenkmalschutz} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.salzkristallisationFrostsprengungChemisc} /></span>
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

export default function BpMauerwerk() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'praxis' | 'innovation'>('allgemein');
  const [selectedProduct, setSelectedProduct] = useState<MauerwerkProduct>(masonryProducts[0]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.mauerwerksprodukteWerkstoffeBauprodukte} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 animate-in fade-in">
          <p><MdText text={inhalt.texte.werkstofftechnischeEigenschaftenUnbewehr} /></p>
        </div>

        {/* Primary Tab Navigation */}
        <ModuleTabs
          label={inhalt.werte.reiterBereiche}
          tabs={[
            { id: 'allgemein' as const, label: inhalt.texte.basiswissenSteinDatenblätter, icon: BookOpen },
            { id: 'praxis' as const, label: inhalt.texte.praxisbeispieleMauerverbände, icon: CheckCircle2 },
            { id: 'innovation' as const, label: 'Zukunftstrends', icon: Lightbulb },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:my-6"
        >

        {activeTab === 'allgemein' ? (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            
            {/* INTERACTIVE DATA SHEET SELECTOR GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Product Buttons Left */}
              <div className="lg:col-span-5 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.verfügbareMauersteinprodukte} /></span>
                <div className="flex flex-col gap-2.5">
                  {masonryProducts.map((prod) => (
                    <button
                      key={prod.name}
                      onClick={() => setSelectedProduct(prod)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center cursor-pointer ${
                        selectedProduct.name === prod.name
                          ? 'bg-shiraz text-white border-shiraz shadow-md scale-[1.01]'
                          : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider block ${selectedProduct.name === prod.name ? 'text-white/60' : 'text-text-main/40'}`}>
                          {prod.code}
                        </span>
                        <span className="font-extrabold text-xs lg:text-sm">{prod.name}</span>
                      </div>
                      <ArrowRight size={16} className={`opacity-70 ${selectedProduct.name === prod.name ? 'translate-x-1' : ''} transition-transform`} />
                    </button>
                  ))}
                </div>

                <div className="bg-amber-50/40 p-4 border border-amber-200/50 rounded-xl space-y-2 mt-4 text-xs text-amber-900 leading-relaxed">
                  <div className="flex gap-1.5 items-center font-bold">
                    <ShieldAlert size={14} className="text-amber-800" />
                    <span><MdText text={inhalt.texte.lagerungsUndFeuchtigkeitsrisiko} /></span>
                  </div>
                  <p className="font-normal text-[11px] text-amber-950/80"><MdText text={inhalt.texte.porenbetonsteinePpUndLeichtbetonwaren} /></p>
                </div>
              </div>

              {/* Factsheet Data Display Right */}
              <div className="lg:col-span-7 bg-slate-50/50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="border-b border-home-grau/20 pb-3 mb-4 flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full uppercase tracking-wider"><MdText text={inhalt.texte.normativesMauersteindatenblatt} /></span>
                      <h3 className="text-base font-bold text-slate-800 mt-1">{selectedProduct.name} - Typ {selectedProduct.code.split(' ')[0]}</h3>
                    </div>
                    <div className="bg-white px-2 py-1 rounded border border-slate-200 text-right font-mono">
                      <span className="text-[9px] text-slate-400 block font-bold leading-none">PRODUKTNORM</span>
                      <span className="text-xs font-bold text-slate-800">{selectedProduct.standard}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed font-normal mb-5">
                    {selectedProduct.description}
                  </p>

                  {/* Mechanical Fact Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5"><MdText text={inhalt.texte.wärmeleit} /></span>
                      <span className="text-xs font-black text-slate-700 font-mono block truncate">{selectedProduct.lambdaRange}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Rohdichteklasse</span>
                      <span className="text-xs font-bold text-slate-700 font-mono block truncate">{selectedProduct.densityRange}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Mindestfestigkeit</span>
                      <span className="text-[9px] font-bold text-slate-700 leading-tight block truncate" title={selectedProduct.strengthClass}>{selectedProduct.strengthClass}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Mörtelzuweisung</span>
                      <span className="text-[9px] font-bold text-slate-700 leading-tight block truncate" title={selectedProduct.mortarType}>{selectedProduct.mortarType.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Advantages vs Disadvantages */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-s600" /> Baustoffstärken:
                      </span>
                      <ul className="space-y-1">
                        {selectedProduct.advantages.map((adv, i) => (
                          <li key={i} className="text-xxs text-text-main/70 flex gap-1.5 items-start">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle size={12} className="text-amber-600" /> Einschränkungen:
                      </span>
                      <ul className="space-y-1">
                        {selectedProduct.disadvantages.map((dis, i) => (
                          <li key={i} className="text-xxs text-text-main/70 flex gap-1.5 items-start">
                            <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                            <span>{dis}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Applications block at bottom */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 mt-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5"><MdText text={inhalt.texte.typischesRegelDetailgebiet} /></div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.applications.map((app, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* MORTARS SUB-SECTION */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-4">
              <h3 className="font-extrabold text-sm text-text-main mb-3 flex items-center gap-1.5 border-b border-home-grau/15 pb-2">
                <Settings className="text-shiraz" size={18} /><MdText text={inhalt.texte.mauermörtelartenNachDinEn} /></h3>
              <p className="text-xs text-text-main/75 leading-relaxed mb-4"><MdText text={inhalt.texte.mauermörtelVerteiltDieLasten} /></p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-slate-200 p-4 rounded-xl space-y-2 bg-slate-50/50">
                  <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded block w-max uppercase"><MdText text={inhalt.texte.nmFuge12Mm} /></span>
                  <h4 className="font-bold text-slate-800 text-xs"><MdText text={inhalt.texte.normalmauermörtelNm} /></h4>
                  <p className="text-xxs text-slate-600 leading-normal"><MdText text={inhalt.texte.derHandwerklicheKlassikerFür} /></p>
                </div>

                <div className="border border-slate-200 p-4 rounded-xl space-y-2 bg-slate-50/50">
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded block w-max uppercase"><MdText text={inhalt.texte.lm021W} /></span>
                  <h4 className="font-bold text-slate-800 text-xs"><MdText text={inhalt.texte.leichtmauermörtelLm} /></h4>
                  <p className="text-xxs text-slate-600 leading-normal"><MdText text={inhalt.texte.versetztMitWärmedämmendenLeichten} /></p>
                </div>

                <div className="border border-slate-200 p-4 rounded-xl space-y-2 bg-slate-50/50">
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded block w-max uppercase"><MdText text={inhalt.texte.dmFuge13} /></span>
                  <h4 className="font-bold text-slate-800 text-xs"><MdText text={inhalt.texte.dünnbettmörtelDm} /></h4>
                  <p className="text-xxs text-slate-600 leading-normal"><MdText text={inhalt.texte.werkmörtelMitGrößtkorn2} /></p>
                </div>
              </div>
            </div>

            {/* INSULATION SYSTEMS SUB-SECTION */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-4">
              <h3 className="font-extrabold text-sm text-text-main mb-1.5 flex items-center gap-1.5 border-b border-home-grau/15 pb-2">
                <Layers className="text-shiraz" size={18} /><MdText text={inhalt.texte.systemischeMauerwerksDämmungenWandaufbau} /></h3>
              <p className="text-xs text-text-main/75 leading-relaxed mb-4"><MdText text={inhalt.texte.jeNachSteinartUnd} /></p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. WDVS */}
                <div className="border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center flex-wrap gap-1">
                      <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded block w-max uppercase"><MdText text={inhalt.texte.wdvsAußendämmung} /></span>
                      <span className="text-xxs font-mono text-slate-500 font-bold"><MdText text={inhalt.texte.dinEn1349913500} /></span>
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-xs"><MdText text={inhalt.texte.wärmedämmverbundsystemEinschalig} /></h4>
                    <p className="text-xxs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.derDämmstoffEpsMineralfaser} /></p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-white p-2 rounded-lg border border-slate-100 font-medium">
                      <div>🌡️ λ-Wert: <span className="font-mono font-bold text-indigo-700">0,022 - 0,040</span></div>
                      <div><MdText text={inhalt.texte.brandschutz} /><span className="font-bold text-slate-700">A1 bis B1</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xxs">
                    <div className="text-emerald-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span><MdText text={inhalt.texte.vorteilHochgradigWirtschaftlichWärmebrüc} /></span>
                    </div>
                    <div className="text-amber-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <span><MdText text={inhalt.texte.risikoSchlechteresRecyclingVerbund} /></span>
                    </div>
                  </div>
                </div>

                {/* 2. Kerndämmung */}
                <div className="border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center flex-wrap gap-1">
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded block w-max uppercase"><MdText text={inhalt.texte.kerndämmungZweischalig} /></span>
                      <span className="text-xxs font-mono text-slate-500 font-bold">DIN EN 1996</span>
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-xs"><MdText text={inhalt.texte.zweischaligesVerblendmauerwerk} /></h4>
                    <p className="text-xxs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.dämmplattenWasserabweisendeSteinwolleEps} /></p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-white p-2 rounded-lg border border-slate-100 font-medium">
                      <div>🌡️ λ-Wert: <span className="font-mono font-bold text-emerald-800">0,030 - 0,038</span></div>
                      <div><MdText text={inhalt.texte.brandschutz2} /><span className="font-bold text-slate-700"><MdText text={inhalt.texte.klasseA1BisA2} /></span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xxs">
                    <div className="text-emerald-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span><MdText text={inhalt.texte.vorteilSehrGuterWitterungsschutz} /></span>
                    </div>
                    <div className="text-amber-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <span><MdText text={inhalt.texte.risikoErheblicheWandstärken45} /></span>
                    </div>
                  </div>
                </div>

                {/* 3. Innendämmung */}
                <div className="border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center flex-wrap gap-1">
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded block w-max uppercase"><MdText text={inhalt.texte.innendämmungWta} /></span>
                      <span className="text-xxs font-mono text-slate-500 font-bold"><MdText text={inhalt.texte.wtaMerkblatt64} /></span>
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-xs"><MdText text={inhalt.texte.kapillaraktiveInnendämmung} /></h4>
                    <p className="text-xxs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.dämmplattenWieSchimmelpilzverhütendesCal} /></p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-white p-2 rounded-lg border border-slate-100 font-medium">
                      <div>🌡️ λ-Wert: <span className="font-mono font-bold text-amber-700">0,038 - 0,048</span></div>
                      <div><MdText text={inhalt.texte.brandschutz3} /><span className="font-bold text-slate-700"><MdText text={inhalt.texte.klasseA1Unbrennbar} /></span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xxs">
                    <div className="text-emerald-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span><MdText text={inhalt.texte.vorteilOftDieEinzige} /></span>
                    </div>
                    <div className="text-amber-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <span><MdText text={inhalt.texte.risikoVerlustVonInnenraum} /></span>
                    </div>
                  </div>
                </div>

                {/* 4. Integrierte Füllung */}
                <div className="border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center flex-wrap gap-1">
                      <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded block w-max uppercase"><MdText text={inhalt.texte.integrierteKernfüllung} /></span>
                      <span className="text-xxs font-mono text-slate-500 font-bold">Herstellerzulassung</span>
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-xs"><MdText text={inhalt.texte.werkseitigGefüllteSteinHohlräume} /></h4>
                    <p className="text-xxs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.derDämmstoffBefindetSich} /></p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-white p-2 rounded-lg border border-slate-100 font-medium">
                      <div>🌡️ λ-Wert: <span className="font-mono font-bold text-rose-700">0,060 - 0,080</span></div>
                      <div><MdText text={inhalt.texte.brandschutz4} /><span className="font-bold text-slate-700"><MdText text={inhalt.texte.klasseA1BisA22} /></span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xxs">
                    <div className="text-emerald-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span><MdText text={inhalt.texte.vorteilDiffusionsoffeneEinstofflichkeitH} /></span>
                    </div>
                    <div className="text-amber-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <span><MdText text={inhalt.texte.risikoVorsichtBeiWandaussparungen} /></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MASONRY ACCESSORIES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-4">
              <div className="space-y-1.5 text-xs text-slate-700">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block flex items-center gap-1">
                  <Sparkles size={14} /><MdText text={inhalt.texte.kimmelementeSockelKältebrücken} /></span>
                <p className="font-normal leading-relaxed"><MdText text={inhalt.texte.geradeAmErdberührtenSockelanlauf} /></p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block flex items-center gap-1">
                  <ToolIcon size={14} /><MdText text={inhalt.texte.stumpfstoßtechnikAnkersysteme} /></span>
                <p className="font-normal leading-relaxed"><MdText text={inhalt.texte.moderneInnenwändeWerdenHeute} /></p>
              </div>
            </div>

            {/* MANUFACTURERS */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-4 bg-slate-50/50">
              <h3 className="font-bold text-home-prim text-base mb-2 flex items-center gap-2"><MdText text={inhalt.texte.marktübersichtTypischerSystemanbieterHer} /></h3>
              <p className="text-xs text-text-main/60 mb-4 italic"><MdText text={inhalt.texte.hinweisZurHerstellerneutralitätDie} /></p>
              <div className="overflow-x-auto rounded-xl border border-home-grau/15 bg-white">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-home-grau/15 text-slate-700 font-bold font-sans">
                      <th className="p-3">Werkstoffgruppe</th>
                      <th className="p-3"><MdText text={inhalt.texte.systemgruppenLieferformenHerstellerneutr} /></th>
                      <th className="p-3"><MdText text={inhalt.texte.normZulassung} /></th>
                      <th className="p-3">Beispiel-Systemprodukte</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 text-xxs font-normal">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold"><MdText text={inhalt.texte.tonZiegel} /></td>
                      <td className="p-3 font-semibold text-shiraz"><MdText text={inhalt.texte.ziegelwerkeHerstellerkooperationenSonder} /></td>
                      <td className="p-3 font-mono"><MdText text={inhalt.texte.dinEn7711} /></td>
                      <td className="p-3"><MdText text={inhalt.texte.perlitOderMineralwollegefüllteHintermaue} /></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold">Kalksandstein</td>
                      <td className="p-3 font-semibold text-shiraz"><MdText text={inhalt.texte.kalksandsteinWerksverbündeXlGroßformate} /></td>
                      <td className="p-3 font-mono"><MdText text={inhalt.texte.dinEn7712} /></td>
                      <td className="p-3"><MdText text={inhalt.texte.großformatigeKsXlPlanelemente} /></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold">Porenbeton</td>
                      <td className="p-3 font-semibold text-shiraz"><MdText text={inhalt.texte.porenbetonWerkeDampfgehärtetePlansteinsy} /></td>
                      <td className="p-3 font-mono"><MdText text={inhalt.texte.dinEn7714} /></td>
                      <td className="p-3"><MdText text={inhalt.texte.monolithischePlansteinePp2Pp4} /></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold"><MdText text={inhalt.texte.leichtbetonBims} /></td>
                      <td className="p-3 font-semibold text-shiraz"><MdText text={inhalt.texte.leichtbetonUndBimssteinHerstellerwerke} /></td>
                      <td className="p-3 font-mono"><MdText text={inhalt.texte.dinEn7713} /></td>
                      <td className="p-3"><MdText text={inhalt.texte.leichtbetonVollblöckeAusNaturbims} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === 'praxis' ? (
          <PraxisTabContent moduleKey="bp_mauerwerk" />
        ) : (
          <InnovationTabContent moduleKey="bp_mauerwerk" />
        )}
        </ModuleTabs>
      </div>

      <MauerwerkThematicLinks current="bauprodukt" />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielTragfähigkeitEinerKs}
          zielGleichung="f_k = K \cdot f_b^{0{,}7} \cdot f_m^{0{,}3}, \quad N_{Rd} = \Phi \cdot t \cdot \zeta \cdot f_k / \gamma_M"
          normQuelle={inhalt.werte.dinEn19961}
          schritte={inhalt.daten["BpMauerwerk.schritte"]}
          ergebnisHinweis={inhalt.werte.rund710KnM}
        />
      </div>

      <ModulTest moduleId="bp_mauerwerk" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Mauerwerk', url: 'https://de.wikipedia.org/wiki/Mauerwerk' },
          { title: 'Kalksandstein', url: 'https://de.wikipedia.org/wiki/Kalksandstein' },
          { title: 'Porenbeton', url: 'https://de.wikipedia.org/wiki/Porenbeton' }
        ]} 
        literatur={inhalt.daten["BpMauerwerk.literatur"]} 
        regelwerke={inhalt.daten["BpMauerwerk.regelwerke"]} 
        formeln={inhalt.daten["BpMauerwerk.formeln"]} 
      />
    </div>
  );
}
