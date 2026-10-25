import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Layers, BookOpen, CheckCircle2, Lightbulb, AlertTriangle, ShieldCheck, Sparkles, ArrowRight, Calculator } from 'lucide-react';
import { InnovationPraxisSection, PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';
import { KlebstoffBerater } from '@/src/components/KlebstoffBerater';
import inhalt from '@/content/bpklebstoffe/BpKlebstoffe.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface AdhesiveProduct {
  name: string;
  category: string;
  standard: string;
  chemicalBase: string;
  curingType: string;
  durabilityClass: string;
  maxElongation: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
}

const adhesiveProducts: AdhesiveProduct[] = inhalt.daten.adhesiveProducts;

export default function BpKlebstoffe() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'berater' | 'praxis' | 'innovation'>('allgemein');
  const [selectedItem, setSelectedItem] = useState<AdhesiveProduct>(adhesiveProducts[0]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.klebDichtstoffsystemeBauprodukte} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
          <p><MdText text={inhalt.texte.anforderungenNachDinEn} /></p>
        </div>

        {/* Primary Tabs Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button aria-pressed={activeTab === 'allgemein'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <BookOpen size={16} /><MdText text={inhalt.texte.basiswissenProduktkatalog} /></button>
          <button aria-pressed={activeTab === 'berater'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'berater' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('berater')}
          >
            <Calculator size={16} /><MdText text={inhalt.texte.fugenKlebetechnikRechner} /></button>
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

        {activeTab === 'allgemein' ? (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            
            {/* COMPONENT INTERACTIVE LIST GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Selector List */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.verfügbareKlebUndDichtstoffe} /></span>
                
                <div className="flex flex-col gap-2">
                  {adhesiveProducts.map((prod) => (
                    <button
                      key={prod.name}
                      onClick={() => setSelectedItem(prod)}
                      className={`w-full text-left p-4 rounded-xl border text-xs font-medium transition-all flex justify-between items-center cursor-pointer ${
                        selectedItem.name === prod.name
                          ? 'bg-shiraz text-white border-shiraz shadow-md scale-[1.01]'
                          : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider block ${selectedItem.name === prod.name ? 'text-white/60' : 'text-text-main/40'}`}>
                          {prod.category}
                        </span>
                        <span className="font-extrabold text-xs lg:text-sm">{prod.name}</span>
                      </div>
                      <ArrowRight size={16} className={`opacity-70 ${selectedItem.name === prod.name ? 'translate-x-1' : ''} transition-transform`} />
                    </button>
                  ))}
                </div>

                <div className="bg-amber-50/45 p-4 border border-amber-200/50 rounded-xl space-y-1.5 text-xs text-amber-950 leading-relaxed">
                  <div className="flex gap-1.5 items-center font-bold">
                    <AlertTriangle size={14} className="text-amber-800" />
                    <span><MdText text={inhalt.texte.silikonDreipunfthaftungVerhindern} /></span>
                  </div>
                  <p className="font-normal text-[11px] text-amber-950/80"><MdText text={inhalt.texte.beiBauDehnungsfugenDarf} /></p>
                </div>
              </div>

              {/* Right Technical Sheet */}
              <div className="lg:col-span-7 bg-slate-50/50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="border-b border-home-grau/20 pb-3 mb-4 flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full uppercase tracking-wider"><MdText text={inhalt.texte.werkstoffdatenblattBauchemie} /></span>
                      <h3 className="text-base font-bold text-slate-800 mt-1">{selectedItem.name}</h3>
                    </div>
                    <div className="bg-white px-2 py-1 rounded border border-slate-200 text-right font-mono">
                      <span className="text-[9px] text-slate-400 block font-bold leading-none">PRÜFNORM</span>
                      <span className="text-xs font-bold text-slate-800">{selectedItem.standard}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed font-normal mb-5">
                    {selectedItem.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5"><MdText text={inhalt.texte.chemischeBasis} /></span>
                      <span className="text-xxs font-bold text-slate-700 leading-snug block">{selectedItem.chemicalBase.split(' (')[0]}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Abbinde-Prinzip</span>
                      <span className="text-xxs font-bold text-slate-700 leading-snug block">{selectedItem.curingType.split(' (')[0]}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Beanspruchungsklasse</span>
                      <span className="text-xxs font-bold text-slate-700 leading-snug block truncate" title={selectedItem.durabilityClass}>{selectedItem.durabilityClass}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Dehnfähigkeit</span>
                      <span className="text-xxs font-bold text-slate-700 leading-snug block">{selectedItem.maxElongation}</span>
                    </div>
                  </div>

                  {/* Advantages vs Disadvantages */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-s600" /> Stärken:
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
                        <AlertTriangle size={12} className="text-amber-600" /> Einschränkungen:
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
              </div>
            </div>

            {/* ADHESION VS COHESION SCIENTIFIC BACKGROUND CARD */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-1.5 text-xs text-slate-700">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block flex items-center gap-1">
                  <Sparkles size={14} /><MdText text={inhalt.texte.adhäsionGrenzflächenhaftung} /></span>
                <p className="font-normal leading-relaxed text-slate-600"><MdText text={inhalt.texte.diePhysikalischenWechselwirkungenAn} /></p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block flex items-center gap-1">
                  <ShieldCheck size={14} /><MdText text={inhalt.texte.kohäsionInnereFestigkeit} /></span>
                <p className="font-normal leading-relaxed text-slate-600"><MdText text={inhalt.texte.beschreibtDieInnerenMolekularen} /></p>
              </div>
            </div>

            {/* HERSTELLERNEUTRALE SYSTEMKLASSEN */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-4 bg-slate-50/50 space-y-3">
              <h3 className="font-bold text-home-prim text-base mb-1 flex items-center gap-2"><MdText text={inhalt.texte.übersichtNormgerechterSystemanwendungenI} /></h3>
              <p className="text-xs text-text-main/60 leading-normal font-normal"><MdText text={inhalt.texte.dieChemischeZusammensetzungUnd} /></p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-normal pt-2">
                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1">
                  <span className="font-bold text-slate-800 block"><MdText text={inhalt.texte.hochbauFassadendichtstoffeDinEn} /></span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.systemeZurAbdichtungVon} /></p>
                </div>

                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1">
                  <span className="font-bold text-slate-800 block"><MdText text={inhalt.texte.sanitärFeuchtraumdichtstoffeDinEn} /></span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.spezialsystemeFürDehnungsfugenIm} /></p>
                </div>

                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1">
                  <span className="font-bold text-slate-800 block"><MdText text={inhalt.texte.bodenfugensystemeDinEn15651} /></span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.hochelastischeSystemeFürBefahrbare} /></p>
                </div>

                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1">
                  <span className="font-bold text-slate-800 block"><MdText text={inhalt.texte.konstruktiveBausystemverklebungenDinEn} /></span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.strukturelleEpoxidharzKlebemittelZur} /></p>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'berater' ? (
          <KlebstoffBerater />
        ) : activeTab === 'praxis' ? (
          <PraxisTabContent moduleKey="bp_klebstoffe" />
        ) : (
          <InnovationTabContent moduleKey="bp_klebstoffe" />
        )}
      </div>

      <InnovationPraxisSection moduleKey="bp_klebstoffe" />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielMindestfugenbreiteEine}
          zielGleichung="b_{min} = \frac{\Delta l}{ZGV}"
          normQuelle={inhalt.werte.din18540FugenIm}
          schritte={inhalt.daten["BpKlebstoffe.schritte"]}
          ergebnisHinweis={inhalt.werte.istDieFugeZu}
        />
      </div>

      <ModulTest moduleId="bp_klebstoffe" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Klebstoff', url: 'https://de.wikipedia.org/wiki/Klebstoff' },
          { title: 'Dichtstoff', url: 'https://de.wikipedia.org/wiki/Dichtstoff' }
        ]} 
        literatur={inhalt.daten["BpKlebstoffe.literatur"]} 
        regelwerke={inhalt.daten["BpKlebstoffe.regelwerke"]} 
        formeln={inhalt.daten["BpKlebstoffe.formeln"]} 
      />
    </div>
  );
}
