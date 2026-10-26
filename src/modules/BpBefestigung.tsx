import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Layers, BookOpen, CheckCircle2, Lightbulb, ShieldAlert, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';
import inhalt from '@/content/bpbefestigung/BpBefestigung.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

interface FastenerProduct {
  name: string;
  category: string;
  standard: string;
  loadCapacity: string;
  edgeDistance: string;
  installTemp: string;
  substrate: string;
  failureMode: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
}

const anchorProducts: FastenerProduct[] = inhalt.daten.anchorProducts;

export default function BpBefestigung() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'praxis' | 'innovation'>('allgemein');
  const [selectedFastener, setSelectedFastener] = useState<FastenerProduct>(anchorProducts[1]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.befestigungstechnikVerankerungBauprodukt} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 animate-in fade-in">
          <p><MdText text={inhalt.texte.anforderungenNachDinEn} /></p>
        </div>

        {/* Primary Navigation Tabs */}
        <ModuleTabs
          label={inhalt.werte.reiterBereiche}
          tabs={[
            { id: 'allgemein' as const, label: inhalt.texte.basiswissenVerankerungsKatalog, icon: BookOpen },
            { id: 'praxis' as const, label: 'Praxisbeispiele', icon: CheckCircle2 },
            { id: 'innovation' as const, label: 'Zukunftstrends', icon: Lightbulb },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:my-6"
        >

        {activeTab === 'allgemein' ? (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            
            {/* INTERACTIVE COMPONENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Selector List */}
              <div className="lg:col-span-5 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.befestigungssystemeHerstellerneutral} /></span>
                <div className="flex flex-col gap-2">
                  {anchorProducts.map((prod) => (
                    <button
                      key={prod.name}
                      onClick={() => setSelectedFastener(prod)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center cursor-pointer ${
                        selectedFastener.name === prod.name
                          ? 'bg-shiraz text-white border-shiraz shadow-md'
                          : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider block ${selectedFastener.name === prod.name ? 'text-white/60' : 'text-text-main/40'}`}>
                          {prod.category}
                        </span>
                        <span className="font-extrabold text-xs lg:text-sm">{prod.name}</span>
                      </div>
                      <ArrowRight size={16} className={`opacity-70 ${selectedFastener.name === prod.name ? 'translate-x-1' : ''} transition-transform`} />
                    </button>
                  ))}
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-2 mt-4 text-xs text-red-950 leading-relaxed">
                  <div className="flex gap-1.5 items-center font-bold">
                    <ShieldAlert size={14} className="text-red-800" />
                    <span><MdText text={inhalt.texte.kritischDrehmomentÜberprüfung} /></span>
                  </div>
                  <p className="font-normal text-[11px] text-red-900"><MdText text={inhalt.texte.mechanischeBolzenankerMüssenZwingend} /></p>
                </div>
              </div>

              {/* Right Factsheet Display Card */}
              <div className="lg:col-span-7 bg-slate-50/50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="border-b border-home-grau/20 pb-3 mb-4 flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full uppercase tracking-wider"><MdText text={inhalt.texte.normativesBefestigungsdatenblatt} /></span>
                      <h3 className="text-base font-bold text-slate-800 mt-1">{selectedFastener.name}</h3>
                    </div>
                    <div className="bg-white px-2 py-1 rounded border border-slate-200 text-right font-mono">
                      <span className="text-[9px] text-slate-400 block font-bold leading-none">BEMESSUNGSREGEL</span>
                      <span className="text-xs font-bold text-slate-800">{selectedFastener.standard}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed font-normal mb-5">
                    {selectedFastener.description}
                  </p>

                  {/* Scientific Anchor Properties Block */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Bemessungszuglast</span>
                      <span className="text-xxs font-bold text-slate-700 font-mono block leading-snug">{selectedFastener.loadCapacity}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5"><MdText text={inhalt.texte.randabstandMin} /></span>
                      <span className="text-xxs font-bold text-slate-700 leading-snug block">{selectedFastener.edgeDistance}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Untergrund-Freigabe</span>
                      <span className="text-[9px] font-bold text-slate-700 leading-snug block truncate" title={selectedFastener.substrate}>{selectedFastener.substrate}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Versagensmodus</span>
                      <span className="text-[9px] font-bold text-slate-700 leading-tight block truncate" title={selectedFastener.failureMode}>{selectedFastener.failureMode}</span>
                    </div>
                  </div>

                  {/* Advantages vs Disadvantages */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-s600" /> Systemvorteile:
                      </span>
                      <ul className="space-y-1">
                        {selectedFastener.advantages.map((adv, i) => (
                          <li key={i} className="text-xxs text-text-main/70 flex gap-1.5 items-start">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle size={12} className="text-amber-600" /> Einschränkungen/Risiken:
                      </span>
                      <ul className="space-y-1">
                        {selectedFastener.disadvantages.map((dis, i) => (
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
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5"><MdText text={inhalt.texte.zulässigeTemperaturbeständigkeit} /></div>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold font-mono">
                    {selectedFastener.installTemp}
                  </span>
                </div>
              </div>
            </div>

            {/* FAILURE MODES EXPLAINED (SCIENTIFIC BACKGROUND ACCENTS) */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-4">
              <h3 className="font-extrabold text-sm text-text-main mb-3 flex items-center gap-1.5 border-b border-home-grau/15 pb-2">
                <Sparkles className="text-shiraz" size={18} /><MdText text={inhalt.texte.versagensmodiVonBetonverankerungenNach} /></h3>
              <p className="text-xs text-text-main/75 leading-relaxed mb-4"><MdText text={inhalt.texte.beiDerBemessungEiner} /></p>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center font-medium">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-[9px] text-slate-400 font-bold block mb-1"><MdText text={inhalt.texte.t1Stahlversagen} /></span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal"><MdText text={inhalt.texte.derZugbolzenReißtMechanisch} /></p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-[9px] text-slate-400 font-bold block mb-1"><MdText text={inhalt.texte.t2Herausziehen} /></span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal"><MdText text={inhalt.texte.derAnkerRutschtMitsamt} /></p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-[9px] text-slate-400 font-bold block mb-1"><MdText text={inhalt.texte.t3Betonausbruch} /></span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal"><MdText text={inhalt.texte.unterZuglastPlatztEin} /></p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-[9px] text-slate-400 font-bold block mb-1"><MdText text={inhalt.texte.t4GespaltenesBeton} /></span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal"><MdText text={inhalt.texte.spreizkräfteOderDieLast} /></p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-[9px] text-slate-400 font-bold block mb-1"><MdText text={inhalt.texte.t5PryOutVersagen} /></span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal"><MdText text={inhalt.texte.beiQuerkraftpressungenBrichtDie} /></p>
                </div>
              </div>
            </div>

            {/* SYSTEM OVERVIEW */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-4 bg-slate-50/50">
              <h3 className="font-bold text-home-prim text-base mb-2 flex items-center gap-2"><MdText text={inhalt.texte.marktübersichtTypischerSystemlösungenHer} /></h3>
              <p className="text-xs text-text-main/60 mb-4 italic"><MdText text={inhalt.texte.hinweisZurHerstellerneutralitätDie} /></p>
              <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2 pl-2">
                <li><span className="font-bold text-slate-800">Injektionssysteme:</span><MdText text={inhalt.texte.zweikomponentenInjektionsmörtelVerbunddü} /></li>
                <li><span className="font-bold text-slate-800"><MdText text={inhalt.texte.bolzenankerVerbundanker} /></span><MdText text={inhalt.texte.schwereMechanischeBolzenankersystemeUnd} /></li>
                <li><span className="font-bold text-slate-800">Holzbauschraubensysteme:</span><MdText text={inhalt.texte.vollgewindeHolzbauschraubenZurStatisch} /></li>
                <li><span className="font-bold text-slate-800">Ankerschienensysteme:</span><MdText text={inhalt.texte.systemAnkerschienenZumRüttelfreien} /></li>
              </ul>
            </div>
          </div>
        ) : activeTab === 'praxis' ? (
          <PraxisTabContent moduleKey="bp_befestigung" />
        ) : (
          <InnovationTabContent moduleKey="bp_befestigung" />
        )}
        </ModuleTabs>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielBetonausbruchEinesEinz}
          zielGleichung="N^0_{Rk,c} = k_1 \cdot \sqrt{f_{ck}} \cdot h_{ef}^{1{,}5}"
          normQuelle={inhalt.werte.dinEn19924}
          schritte={inhalt.daten["BpBefestigung.schritte"]}
          ergebnisHinweis={inhalt.werte.dieTragfähigkeitWächstMit}
        />
      </div>

      <ModulTest moduleId="bp_befestigung" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Dübel', url: 'https://de.wikipedia.org/wiki/D%C3%BCbel' },
          { title: 'Befestigungstechnik', url: 'https://de.wikipedia.org/wiki/Befestigungstechnik' }
        ]} 
        literatur={inhalt.daten["BpBefestigung.literatur"]} 
        regelwerke={inhalt.daten["BpBefestigung.regelwerke"]} 
        formeln={inhalt.daten["BpBefestigung.formeln"]} 
      />
    </div>
  );
}
