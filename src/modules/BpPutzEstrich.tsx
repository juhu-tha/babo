import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Layers, BookOpen, CheckCircle2, Lightbulb, ClipboardList, Flame, Settings, ShieldAlert, Sparkles, FileText } from 'lucide-react';
import { InlineMath } from 'react-katex';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';
import inhalt from '@/content/bpputzestrich/BpPutzEstrich.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface PutzEstrichProduct {
  name: string;
  code: string;
  standard: string;
  strengthClass: string;
  binder: string;
  density: string;
  shrinkage: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  applications: string[];
}

const plasterProducts: PutzEstrichProduct[] = inhalt.daten.plasterProducts;

const screedProducts: PutzEstrichProduct[] = inhalt.daten.screedProducts;

export default function BpPutzEstrich() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'allgemein' | 'praxis' | 'innovation'>('steckbrief');
  const [selectedItem, setSelectedItem] = useState<PutzEstrichProduct>(plasterProducts[0]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.putzEstrichsystemeBauprodukte} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
          <p><MdText text={inhalt.texte.anforderungenNachDin18550} /></p>
        </div>

        {/* Primary Tabs */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button aria-pressed={activeTab === 'steckbrief'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'steckbrief' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steckbrief')}
          >
            <BookOpen size={16} /> Steckbrief
          </button>
          <button aria-pressed={activeTab === 'allgemein'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <FileText size={16} /><MdText text={inhalt.texte.basiswissenMörtelarten} /></button>
          <button aria-pressed={activeTab === 'praxis'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'praxis' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('praxis')}
          >
            <CheckCircle2 size={16} /> Praxisbeispiele
          </button>
          <button aria-pressed={activeTab === 'innovation'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'innovation' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('innovation')}
          >
            <Lightbulb size={16} /> Zukunftstrends
          </button>
        </div>

        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="putzemoertel" />
          </div>
        )}

        {activeTab === 'allgemein' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            
            {/* INTERACTIVE SPEC SHEET AND SELECTOR */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column Component List Selector */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.verfügbarePutzUndEstricharten} /></span>
                
                {/* Plasters subcategory */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <ClipboardList size={11} className="text-slate-400" /><MdText text={inhalt.texte.t1PutzeNachDin} /></div>
                  <div className="flex flex-col gap-1.5">
                    {plasterProducts.map((prod) => (
                      <button
                        key={prod.name}
                        onClick={() => setSelectedItem(prod)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex justify-between items-center ${
                          selectedItem.name === prod.name
                            ? 'bg-shiraz text-white border-shiraz shadow-sm'
                            : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{prod.name} (<strong>{prod.code.split(' ')[0]}</strong>)</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${selectedItem.name === prod.name ? 'bg-white/20 text-white' : 'bg-slate-150 text-slate-600'}`}>{prod.code}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Screeds subcategory */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Settings size={11} className="text-slate-400" /><MdText text={inhalt.texte.t2EstricheNachDin} /></div>
                  <div className="flex flex-col gap-1.5">
                    {screedProducts.map((prod) => (
                      <button
                        key={prod.name}
                        onClick={() => setSelectedItem(prod)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex justify-between items-center ${
                          selectedItem.name === prod.name
                            ? 'bg-shiraz text-white border-shiraz shadow-sm'
                            : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{prod.name} (<strong>{prod.code}</strong>)</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${selectedItem.name === prod.name ? 'bg-white/20 text-white' : 'bg-slate-150 text-slate-600'}`}>{prod.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column Technical Sheet */}
              <div className="lg:col-span-7 bg-slate-50/50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="border-b border-home-grau/20 pb-3 mb-4 flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full uppercase tracking-wider"><MdText text={inhalt.texte.normativesBauproduktdatenblatt} /></span>
                      <h3 className="text-base font-bold text-slate-800 mt-1">{selectedItem.name}</h3>
                    </div>
                    <div className="bg-white px-2 py-1 rounded border border-slate-200 text-right">
                      <span className="text-[9px] text-slate-400 block font-bold font-mono">REGELWERK</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">{selectedItem.standard}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed font-normal mb-4">
                    {selectedItem.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 text-center">
                    <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Druckfestigkeit</span>
                      <span className="text-xxs font-bold text-slate-700 font-mono leading-tight block">{selectedItem.strengthClass}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Hauptbindemittel</span>
                      <span className="text-xxs font-bold text-slate-700 leading-tight block">{selectedItem.binder.split('(')[0]}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Trockenrohdichte</span>
                      <span className="text-xxs font-bold text-slate-700 font-mono">{selectedItem.density}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Schwindverhalten</span>
                      <span className="text-xxs font-bold text-slate-700 leading-tight block">{selectedItem.shrinkage}</span>
                    </div>
                  </div>

                  {/* Advantages vs Disadvantages */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-600" /> Leistungsvorteile:
                      </span>
                      <ul className="space-y-1">
                        {selectedItem.advantages.map((adv, i) => (
                          <li key={i} className="text-xxs text-text-main/70 flex gap-1.5 items-start">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                        <ShieldAlert size={12} className="text-amber-600" /> Verarbeitungseinschränkungen:
                      </span>
                      <ul className="space-y-1">
                        {selectedItem.disadvantages.map((dis, i) => (
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
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5"><MdText text={inhalt.texte.standardEinsatzgebieteRegelkonform} /></div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.applications.map((app, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CHEMICAL / PHYSICAL BACKGROUND EXPLAINER */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-shiraz tracking-wider uppercase block flex items-center gap-1">
                  <Sparkles size={14} /><MdText text={inhalt.texte.gipsVsAnhydritAbbindechemie} /></span>
                <p className="text-xs text-slate-700 leading-relaxed font-normal"><MdText text={inhalt.texte.gipsmörtelUndCalciumsulfatestricheBinden} /></p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-800 tracking-wider uppercase block flex items-center gap-1">
                  <Flame size={14} /><MdText text={inhalt.texte.karbonatisierungVonKalkputzen} /></span>
                <p className="text-xs text-slate-700 leading-relaxed font-normal"><MdText text={inhalt.texte.luftkalkputzErhärtetNichtHydraulisch} /></p>
              </div>
            </div>

            {/* WERKSTROMÖRTEL - EXPLAINER */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 md:col-span-2 shadow-sm">
              <h3 className="font-bold text-shiraz text-base mb-2"><MdText text={inhalt.texte.werktrockenmörtelWtmImStrukturwandel} /></h3>
              <p className="text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed mb-3"><MdText text={inhalt.texte.zementUndKalkWurden} /></p>
            </div>

            {/* Quality Standard Classifications (Manufacturer Neutral) */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm bg-slate-50/50">
              <h3 className="font-bold text-home-prim text-base mb-2 flex items-center gap-2"><MdText text={inhalt.texte.standardAnwendungskriterienFürSystemputz} /></h3>
              <p className="text-xs text-text-main/60 mb-4 italic font-medium"><MdText text={inhalt.texte.hinweisZurHerstellerneutralitätZur} /></p>
              <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2 pl-2">
                <li><span className="font-bold text-slate-800"><MdText text={inhalt.texte.oberflächenqualitätInnenputze} /></span><MdText text={inhalt.texte.unterteilungInQualitätsstufenQ1} /></li>
                <li><span className="font-bold text-slate-800"><MdText text={inhalt.texte.festigkeitsklassenFürEstriche} /></span><MdText text={inhalt.texte.einteilungNachDinEn} /></li>
                <li><span className="font-bold text-slate-800"><MdText text={inhalt.texte.kalkZementputzeCrCs} /></span><MdText text={inhalt.texte.universellBeanspruchbaresAllwettersystem} /></li>
                <li><span className="font-bold text-slate-800"><MdText text={inhalt.texte.reineSilikatSpachtelmassen} /></span><MdText text={inhalt.texte.hochgradigDampfdiffusionsoffeneSystemeWe} /></li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'praxis' && (
          <PraxisTabContent moduleKey="bp_putz_estrich" />
        )}

        {activeTab === 'innovation' && (
          <InnovationTabContent moduleKey="bp_putz_estrich" />
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielWasserbedarfBeimAbbind}
          zielGleichung="\text{CaSO}_4 \cdot \tfrac{1}{2}\text{H}_2\text{O} + 1{,}5\,\text{H}_2\text{O} \rightarrow \text{CaSO}_4 \cdot 2\,\text{H}_2\text{O}"
          normQuelle={inhalt.werte.stöchiometrieMolmassenHalbhydrat145}
          schritte={inhalt.daten["BpPutzEstrich.schritte"]}
          ergebnisHinweis={inhalt.werte.nurGutEinViertel}
        />
      </div>

      <ModulTest moduleId="bp_putz_estrich" />

      <ModuleFooter 
        wikipedia={[
          { title: inhalt.werte.putzBaustoff, url: 'https://de.wikipedia.org/wiki/Putz_(Baustoff)' },
          { title: 'Estrich', url: 'https://de.wikipedia.org/wiki/Estrich' },
          { title: 'Mörtel', url: 'https://de.wikipedia.org/wiki/M%C3%B6rtel' }
        ]} 
        literatur={inhalt.daten["BpPutzEstrich.literatur"]} 
        regelwerke={inhalt.daten["BpPutzEstrich.regelwerke"]} 
        formeln={inhalt.daten["BpPutzEstrich.formeln"]} 
      />
    </div>
  );
}
