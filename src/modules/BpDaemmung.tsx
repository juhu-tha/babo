import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath } from 'react-katex';
import { Layers, BookOpen, CheckCircle2, Lightbulb, BadgeCheck, AlertTriangle, ShieldCheck, Settings, Compass, Calculator } from 'lucide-react';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';
import { DaemmungBerater } from '@/src/components/DaemmungBerater';
import inhalt from '@/content/bpdaemmung/BpDaemmung.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

interface InsulationProduct {
  name: string;
  abbreviation: string;
  standard: string;
  lambdaRange: string;
  density: string;
  vaporResistance: string;
  fireClass: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  applications: string[];
}

const mineralInsulation: InsulationProduct[] = inhalt.daten.mineralInsulation;

const syntheticInsulation: InsulationProduct[] = inhalt.daten.syntheticInsulation;

const ecologicalInsulation: InsulationProduct[] = inhalt.daten.ecologicalInsulation;

const highPerformanceInsulation: InsulationProduct[] = inhalt.daten.highPerformanceInsulation;

export default function BpDaemmung() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'praxis' | 'innovation' | 'berater'>('allgemein');
  const [selectedProduct, setSelectedProduct] = useState<InsulationProduct>(mineralInsulation[0]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.wärmedämmstoffeImHochbauBauprodukte} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
          <p><MdText text={inhalt.texte.systematischeGegenüberstellungPhysikalis} /></p>
        </div>

        {/* Navigation Tabs */}
        <ModuleTabs
          label={inhalt.werte.reiterBereiche}
          tabs={[
            { id: 'allgemein' as const, label: inhalt.texte.basiswissenKennwerte, icon: BookOpen },
            { id: 'praxis' as const, label: inhalt.texte.praxisbeispieleSchadensbilder, icon: CheckCircle2 },
            { id: 'innovation' as const, label: inhalt.texte.zukunftstrendsZirkularität, icon: Lightbulb },
            { id: 'berater' as const, label: inhalt.texte.interaktiverDämmstoffBerater, icon: Calculator },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:my-6"
        >

        {activeTab === 'allgemein' ? (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            
            {/* IN-DEPTH PHYSICAL PARAMETERS & PRODUCT SELECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Product Selector Left Column */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.katalogHerstellerneutralerDämmstoffe} /></span>
                
                {/* Mineral Section */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider flex items-center gap-1">
                    <Compass size={11} className="text-slate-400" /><MdText text={inhalt.texte.t1AnorganischMineralisch} /></div>
                  <div className="flex flex-col gap-1.5">
                    {mineralInsulation.map((prod) => (
                      <button
                        key={prod.name}
                        onClick={() => setSelectedProduct(prod)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex justify-between items-center ${
                          selectedProduct.name === prod.name
                            ? 'bg-shiraz text-white border-shiraz shadow-sm'
                            : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{prod.name} (<strong>{prod.abbreviation}</strong>)</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${selectedProduct.name === prod.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{prod.lambdaRange}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Synthetic Section */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider flex items-center gap-1">
                    <Settings size={11} className="text-slate-400" /><MdText text={inhalt.texte.t2PetrochemischSynthetisch} /></div>
                  <div className="flex flex-col gap-1.5">
                    {syntheticInsulation.map((prod) => (
                      <button
                        key={prod.name}
                        onClick={() => setSelectedProduct(prod)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex justify-between items-center ${
                          selectedProduct.name === prod.name
                            ? 'bg-shiraz text-white border-shiraz shadow-sm'
                            : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{prod.name} (<strong>{prod.abbreviation}</strong>)</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${selectedProduct.name === prod.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{prod.lambdaRange}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ecological Section */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider flex items-center gap-1">
                    <BadgeCheck size={11} className="text-slate-400" /><MdText text={inhalt.texte.t3NachwachsendeRohstoffeBiobasiert} /></div>
                  <div className="flex flex-col gap-1.5">
                    {ecologicalInsulation.map((prod) => (
                      <button
                        key={prod.name}
                        onClick={() => setSelectedProduct(prod)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex justify-between items-center ${
                          selectedProduct.name === prod.name
                            ? 'bg-shiraz text-white border-shiraz shadow-sm'
                            : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{prod.name} (<strong>{prod.abbreviation}</strong>)</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${selectedProduct.name === prod.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{prod.lambdaRange}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* High Performance Section */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck size={11} className="text-slate-400" /><MdText text={inhalt.texte.t4HochleistungsSondermaterialien} /></div>
                  <div className="flex flex-col gap-1.5">
                    {highPerformanceInsulation.map((prod) => (
                      <button
                        key={prod.name}
                        onClick={() => setSelectedProduct(prod)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex justify-between items-center ${
                          selectedProduct.name === prod.name
                            ? 'bg-shiraz text-white border-shiraz shadow-sm'
                            : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{prod.name} (<strong>{prod.abbreviation}</strong>)</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${selectedProduct.name === prod.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{prod.lambdaRange}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technical Factsheet Display Right Column */}
              <div className="lg:col-span-7 bg-slate-50/50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="border-b border-home-grau/20 pb-3 mb-4 flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full uppercase tracking-wider"><MdText text={inhalt.texte.normativesStoffdatenblatt} /></span>
                      <h3 className="text-lg font-bold text-text-main mt-1">{selectedProduct.name} - Typ {selectedProduct.abbreviation}</h3>
                    </div>
                    <div className="bg-white px-2.5 py-1 rounded border border-slate-200 text-right">
                      <span className="text-[9px] text-slate-400 block font-bold font-mono">PRODUKTNORM</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">{selectedProduct.standard}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed font-normal mb-5">
                    {selectedProduct.description}
                  </p>

                  {/* Scientific Properties Block */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5"><MdText text={inhalt.texte.dWMK} /></span>
                      <span className="text-sm font-black text-slate-700 font-mono">{selectedProduct.lambdaRange}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5"><MdText text={inhalt.texte.rohdichte} /></span>
                      <span className="text-xs font-bold text-slate-700 font-mono">{selectedProduct.density}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Dampf (μ)</span>
                      <span className="text-xs font-bold text-slate-700 font-mono">{selectedProduct.vaporResistance}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Brandschutz</span>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight block truncate" title={selectedProduct.fireClass}>
                        {selectedProduct.fireClass.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Advantages, Risks & Installation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <BadgeCheck size={12} className="text-emerald-600" /> Materialstärken:
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
                        <AlertTriangle size={12} className="text-amber-600" /><MdText text={inhalt.texte.schwachstellenGefahren} /></span>
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

                {/* Typical Installation Use Cases */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 mt-4">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2"><MdText text={inhalt.texte.standardisierteEinsatzgebieteBaupraxis} /></div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.applications.map((app, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* LEGISLATIVE CONTEXT - GEG REQUIREMENTS (GEBÄUDEENERGIEGESETZ) */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-4">
              <h3 className="font-extrabold text-sm text-text-main mb-3 flex items-center gap-1.5 border-b border-home-grau/15 pb-2">
                <ShieldCheck className="text-shiraz" size={18} /><MdText text={inhalt.texte.gesetzlicheAnforderungenMaximaleU} /></h3>
              <p className="text-xs text-text-main/70 leading-relaxed mb-4"><MdText text={inhalt.texte.dasGmodgBisJuli} /></p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-medium">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1"><MdText text={inhalt.texte.außenwändeSanierung} /></span>
                  <span className="text-sm font-mono font-black text-slate-800"><MdText text={inhalt.texte.uMax024} /></span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal mt-1"><MdText text={inhalt.texte.dickeBeiWlg035} /></p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1"><MdText text={inhalt.texte.steildachSparren} /></span>
                  <span className="text-sm font-mono font-black text-slate-800"><MdText text={inhalt.texte.uMax0242} /></span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal mt-1"><MdText text={inhalt.texte.anlage7Nr5a} /></p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1"><MdText text={inhalt.texte.flachdachErneuerungDerAbdichtung} /></span>
                  <span className="text-sm font-mono font-black text-slate-800"><MdText text={inhalt.texte.uMax020} /></span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal mt-1"><MdText text={inhalt.texte.wegenGefälleOftAsymmetrisch} /></p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1"><MdText text={inhalt.texte.kellerdeckeUnbeheiztErd} /></span>
                  <span className="text-sm font-mono font-black text-slate-800"><MdText text={inhalt.texte.uMax030} /></span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal mt-1"><MdText text={inhalt.texte.dickeBeiWlg0352} /></p>
                </div>
              </div>
            </div>

            {/* INHERENT COMPONENT ACCENTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="space-y-2">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block"><MdText text={inhalt.texte.wärmebrückenDetailpunkte} /></span>
                <p className="text-xs text-slate-700 leading-relaxed font-normal"><MdText text={inhalt.texte.wärmebrückenSindLokaleThermische} /></p>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block"><MdText text={inhalt.texte.luftdichtigkeitDiffusion} /></span>
                <p className="text-xs text-slate-700 leading-relaxed font-normal"><MdText text={inhalt.texte.nachDin41087} /></p>
              </div>
            </div>

            {/* Normative Anwendungstypen & Systemklassen (Herstellerneutral) */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm bg-slate-50/50">
              <h3 className="font-bold text-home-prim text-base mb-2 flex items-center gap-2"><MdText text={inhalt.texte.normativeAnwendungstypenNachDin} /></h3>
              <p className="text-xs text-text-main/60 mb-4 italic"><MdText text={inhalt.texte.dieNachfolgendeSystematisierungErörtert} /></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-normal">
                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1.5">
                  <span className="font-bold text-slate-800 block"><MdText text={inhalt.texte.dachdämmungenTypenDadDaa} /></span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.dadAußendämmungUnterDeckung} /></p>
                </div>
                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1.5">
                  <span className="font-bold text-slate-800 block"><MdText text={inhalt.texte.wandFassadendämmungenTypenWap} /></span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.wapAußendämmungDerWand} /></p>
                </div>
                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1.5">
                  <span className="font-bold text-slate-800 block"><MdText text={inhalt.texte.deckenEstrichdämmungenTypenDeo} /></span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.deoInnendämmungDerDecke} /></p>
                </div>
                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1.5">
                  <span className="font-bold text-slate-800 block"><MdText text={inhalt.texte.erdberührteBauwerksdämmungenTypenPw} /></span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.pwPerimeterdämmungAnDer} /></p>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'praxis' ? (
          <PraxisTabContent moduleKey="bp_daemmung" />
        ) : activeTab === 'innovation' ? (
          <InnovationTabContent moduleKey="bp_daemmung" />
        ) : (
          <DaemmungBerater />
        )}
        </ModuleTabs>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielUWertEiner}
          zielGleichung="U = \frac{1}{R_{si} + \sum d_i/\lambda_i + R_{se}}"
          normQuelle={inhalt.werte.dinEnIso6946}
          schritte={inhalt.daten["BpDaemmung.schritte"]}
          ergebnisHinweis={inhalt.werte.dieDämmschichtLiefertÜber}
        />
      </div>

      <ModulTest moduleId="bp_daemmung" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Dämmstoff', url: 'https://de.wikipedia.org/wiki/D%C3%A4mmstoff' },
          { title: 'Wärmedämmung', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmed%C3%A4mmung' }
        ]} 
        literatur={inhalt.daten["BpDaemmung.literatur"]} 
        regelwerke={inhalt.daten["BpDaemmung.regelwerke"]} 
        formeln={inhalt.daten["BpDaemmung.formeln"]} 
      />
    </div>
  );
}
