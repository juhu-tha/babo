import React, { useState } from 'react';
import { Layers, HardHat, Info, Truck, BookOpen, ShieldAlert, ArrowRight, CheckCircle2, Lightbulb } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { useTabContext } from '@/src/contexts/TabContext';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';
import inhalt from '@/content/bpbeton/BpBeton.json';
import { MdText } from '@/src/components/inhalt/MdText';

function ConcreteThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  const handleDauerhaftigkeitClick = () => {
    localStorage.setItem('dauerhaftigkeit_subtab', 'beton');
    setActiveTab('dauerhaftigkeit');
  };

  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.materialLehrpfadBetonIm} /></h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5"><MdText text={inhalt.texte.weiterZuDenAnderen} /></p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe / Betonpraxis */}
        <button
          onClick={() => setActiveTab('betonpraxis')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t1BetontechnologiePraxis} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.expositionsklassenKonfiguratorNachbehand} /></span>
          {current !== 'baustoff' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_beton')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t2BetonzulassungBauprodukt} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.transportVsBaustellenbetonWpk} /></span>
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
            <span><MdText text={inhalt.texte.t3DauerhaftungSchäden} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.karbonatisierungFrostTausalzAngriff} /></span>
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

export default function BpBeton() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'praxis' | 'innovation'>('allgemein');

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="bg-home-grau/5 border-b border-home-grau/10 px-6 py-5">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.betonBauprodukte} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.derBaustoffBetonZeichnet} /></p>
        </div>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
          <button aria-pressed={activeTab === 'allgemein'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <BookOpen size={16} /> Basiswissen
          </button>
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
        
        <div className="p-6 pt-0 space-y-6">
          {activeTab === 'allgemein' ? (
            <div className="prose max-w-none text-gray-700 animate-in fade-in duration-300">
              <p className="lead text-lg font-medium text-home-prim"><MdText text={inhalt.texte.betonIstDerWeltweit} /></p>
              <p className="mt-4"><MdText text={inhalt.texte.gemäßDinEn206} /></p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h3 className="font-bold text-shiraz mb-2 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-stone-600" /> Transportbeton
                  </h3>
                  <p className="text-sm"><MdText text={inhalt.texte.wirdInEinemStationären} /></p>
                </div>

                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h3 className="font-bold text-shiraz mb-2 flex items-center gap-2">
                    <HardHat className="w-5 h-5 text-stone-600" /> Baustellenbeton
                  </h3>
                  <p className="text-sm"><MdText text={inhalt.texte.wirdDirektAufDer} /></p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-home-prim mt-8 mb-4"><MdText text={inhalt.texte.normativeAnforderungenAlsBauprodukt} /></h3>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><MdText text={inhalt.texte.eigenschaftenDieLieferungErfolgt} /></li>
                <li><MdText text={inhalt.texte.zusammensetzungSeltenerIstBeton} /></li>
                <li><MdText text={inhalt.texte.üZeichenBetonNach} /></li>
                <li><MdText text={inhalt.texte.nachhaltigkeitCscImmerÖfter} /></li>
              </ul>

              <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-blue-500 p-4 rounded-xl mt-6">
                <p className="text-sm text-blue-900 flex items-start gap-2">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" /><MdText text={inhalt.texte.detaillierteInformationenZuFrischbeton} /></p>
              </div>
            </div>
          ) : activeTab === 'praxis' ? (
            <PraxisTabContent moduleKey="bp_beton" />
          ) : (
            <InnovationTabContent moduleKey="bp_beton" />
          )}
        </div>
      </div>
      
      <ConcreteThematicLinks current="bauprodukt" />
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielErreichtEinePrüfserie}
          zielGleichung="f_{ck} = f_{cm} - 1{,}645 \cdot s"
          normQuelle={inhalt.werte.statistischeDefinitionDerCharakteristisc}
          schritte={inhalt.daten["BpBeton.schritte"]}
          ergebnisHinweis={inhalt.werte.jeGrößerDieStreuung}
        />
      </div>

      <ModulTest moduleId="bp_beton" />

      <ModuleFooter
        wikipedia={[
          { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Frischbeton', url: 'https://de.wikipedia.org/wiki/Frischbeton' },
          { title: 'Festbeton', url: 'https://de.wikipedia.org/wiki/Festbeton' }
        ]}
        literatur={inhalt.daten["BpBeton.literatur"]}
        regelwerke={inhalt.daten["BpBeton.regelwerke"]}
        formeln={inhalt.daten["BpBeton.formeln"]}
      />
    </div>
  );
}
