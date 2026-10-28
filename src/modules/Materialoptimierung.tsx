import React, { useState, useMemo } from 'react';
import { Leaf, Beaker, Layers, Sparkles, CheckCircle2, ChevronRight, Calculator, AlertTriangle, Trees, ChevronDown, ChevronUp, Activity, BookOpen, Scale, Award, Building2, Sliders } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { SAEULEN_DATA, BETON_PRINZIPIEN } from './materialoptimierung/daten';
import { DafstbRichtlinieTab } from './materialoptimierung/DafstbRichtlinieTab';
import inhalt from '@/content/materialoptimierung/Materialoptimierung.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { dafstbVergleich, type DafstbBauteil, type DafstbZement } from '@/src/calc/materialoptimierung';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

export default function Materialoptimierung() {
  const [activeSubTab, setActiveSubTab] = useState<'saeulen' | 'betonoptimierung' | 'dafstb_richtlinie'>('saeulen');
  const [selectedSaeule, setSelectedSaeule] = useState<'effizienz' | 'suffizienz' | 'konsistenz' | 'resilienz'>('effizienz');
  const [showPflanzenkohleModal, setShowPflanzenkohleModal] = useState<boolean>(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // DAfStb-Richtlinie Calculator States
  const [dafstbBauteil, setDafstbBauteil] = useState<DafstbBauteil>('decke');
  const [dafstbBauweise, setDafstbBauweise] = useState<string>('hohlkoerper');
  const [dafstbZement, setDafstbZement] = useState<DafstbZement>('cem3_a');
  const [dafstbPruefalter, setDafstbPruefalter] = useState<28 | 56>(56);
  const [dafstbStahlRoute, setDafstbStahlRoute] = useState<'standard_bof' | 'gruen_eaf'>('gruen_eaf');

  const activeSaeuleData = useMemo(() => {
    return SAEULEN_DATA.find(s => s.id === selectedSaeule)!;
  }, [selectedSaeule]);

  // DAfStb-Richtlinie Tragwerks-Berechnung: Rechenkern src/calc/materialoptimierung.ts (Z11),
  // hier nur Bezeichnung des Bauteils und Darstellung der Effizienzklasse
  const dafstbCalc = useMemo(() => {
    const r = dafstbVergleich({ bauteil: dafstbBauteil, bauweise: dafstbBauweise, zement: dafstbZement, pruefalter: dafstbPruefalter, stahlRoute: dafstbStahlRoute });
    const label = {
      decke: inhalt.werte.geschossdecke100MFläche2,
      stuetze: inhalt.werte.innenstützen4Stützen3,
      wand: inhalt.werte.tragwandKernwand60M,
      bodenplatte: inhalt.werte.fundamentplatteBodenplatte120M,
    }[dafstbBauteil];
    const klasse = {
      'Referenz': { efficiencyBadge: 'bg-slate-100 text-slate-800 border-slate-300', classLabel: inhalt.werte.konventionellerStandard, classStar: 'Basis' },
      'Klasse A+': { efficiencyBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300', classLabel: inhalt.werte.thgExzellenzUltraLow, classStar: '★★★★★' },
      'Klasse A': { efficiencyBadge: 'bg-green-100 text-green-900 border-green-300', classLabel: inhalt.werte.ambitionierteDekarbonisierung, classStar: '★★★★☆' },
      'Klasse B': { efficiencyBadge: 'bg-amber-100 text-amber-900 border-amber-300', classLabel: inhalt.werte.wirtschaftlichesOptimum, classStar: '★★★☆☆' },
      'Klasse C': { efficiencyBadge: 'bg-blue-100 text-blue-900 border-blue-300', classLabel: 'Einstiegs-Optimierung', classStar: '★★☆☆☆' },
    }[r.efficiencyClass];
    return { ...r, label, ...klasse };
  }, [dafstbBauteil, dafstbBauweise, dafstbZement, dafstbPruefalter, dafstbStahlRoute]);

  return (
    <div className="flex flex-col gap-6 w-full text-slate-800 animate-fade-in">
      
      {/* --- Header Panel --- */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
          <Leaf className="text-shiraz" /><MdText text={inhalt.texte.materialStoffoptimierung} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p><MdText text={inhalt.texte.ökologischeBilanzverbesserungDurchStoffl} /></p>
        </div>
      </div>

      {/* --- Navigation Subtabs --- */}
      <ModuleTabs
        label={inhalt.werte.bereicheMaterialoptimierung}
        tabs={[
          { id: 'saeulen' as const, label: inhalt.texte.die4SäulenDer, icon: Layers },
          { id: 'betonoptimierung' as const, label: inhalt.texte.betonoptimierungsLeitfadenPrinzipien, icon: Beaker },
          { id: 'dafstb_richtlinie' as const, label: inhalt.texte.dafstbRichtlinieTreibhausgasreduzierteTr, icon: Scale },
        ]}
        aktiv={activeSubTab}
        onWechsel={setActiveSubTab}
        className="flex flex-col gap-6"
      >
      {/* --- Tab 1: 4 Pillars of Optimization --- */}
      {activeSubTab === 'saeulen' && (
        <div className="space-y-6">
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Sparkles className="text-shiraz" size={18} /><MdText text={inhalt.texte.strategischeDimensionenFürKreislaufgerec} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.eineVerbesserteÖkobilanzLca} /></p>
        </div>

            {/* Left selector, right details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
              
              {/* Pillar Selector Buttons */}
              <AuswahlGruppe label="Säule" className="md:col-span-4 flex flex-col gap-3">
                {SAEULEN_DATA.map((saeule) => (
                  <button {...alsOption(selectedSaeule === saeule.id)}
                    key={saeule.id}
                    type="button"
                    onClick={() => setSelectedSaeule(saeule.id)}
                    className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      selectedSaeule === saeule.id
                        ? 'border-rose-500 bg-rose-50/20 text-slate-900 shadow'
                        : 'border-home-grau/30 bg-slate-50/50 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-xs text-slate-900">{saeule.title}</h3>
                        <ChevronRight size={14} className={selectedSaeule === saeule.id ? 'text-shiraz' : 'text-slate-400'} />
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{saeule.tagline}</p>
                    </div>
                  </button>
                ))}
              </AuswahlGruppe>

              {/* Pillar Content Visualization */}
              <div className="md:col-span-8 bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3 border-b border-home-grau/30 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-shiraz uppercase tracking-wider block font-mono">
                        Schnittstellen-Details
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 font-sans mt-0.5">
                        {activeSaeuleData.title}
                      </h3>
                    </div>
                    <span className="bg-rose-100/50 text-shiraz text-[10.5px] font-mono font-bold px-2 py-0.5 rounded border border-rose-100">
                      {activeSaeuleData.mitigationPotential}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4">
                    {activeSaeuleData.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] font-bold text-slate-800 block"><MdText text={inhalt.texte.maßgeblicheOptimierungsansätze} /></span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {activeSaeuleData.strategies.map((strat, idx) => (
                        <li key={idx} className="flex gap-2 items-start bg-slate-50 p-2 rounded border border-home-grau/30">
                          <CheckCircle2 size={14} className="text-shiraz shrink-0 mt-0.5" />
                          <span className="text-slate-700 leading-relaxed text-[11px]">{strat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-rose-50/20 border border-rose-200 p-3.5 rounded-lg mt-4">
                  <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest block mb-1 font-mono"><MdText text={inhalt.texte.praxisbeispielAusDemIngenieurbüro} /></span>
                  <p className="text-[11px] leading-relaxed text-slate-700 font-sans italic">
                    &quot;{activeSaeuleData.example}&quot;
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- Tab 2: Betonoptimierungs-Leitfaden --- */}
      {activeSubTab === 'betonoptimierung' && (
        <div className="space-y-6">
          
          {/* Main Informational Header Banner */}
          <div className="bg-gradient-to-r from-fuchsia-50/40 via-fuchsia-50/10 to-transparent border border-home-grau/30 p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-4 shadow-sm">
            <div className="bg-rose-50 p-3 rounded-xl border border-rose-200/60 shrink-0">
              <Beaker className="text-shiraz" size={26} />
            </div>
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.wissenschaftlichePrinzipienDerBetonoptim} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.über60DerCo} /></p>
        </div>
          </div>

          {/* Collapse/Expand Control Panel */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50/75 border border-slate-200 rounded-xl gap-3">
            <div>
              <span className="text-xs font-extrabold text-shiraz uppercase tracking-widest block font-mono flex items-center gap-1.5">
                <Layers size={13} className="text-shiraz" /><MdText text={inhalt.texte.klappbareMenüpunkteLeitfadenStruktur} /></span>
              <span className="text-[11px] text-slate-500 block mt-0.5"><MdText text={inhalt.texte.klickenSieAufEinzelne} /></span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const allKeys: Record<string, boolean> = {};
                  BETON_PRINZIPIEN.forEach(principle => {
                    principle.categories.forEach(category => {
                      allKeys[`${principle.id}-${category.name}`] = true;
                    });
                  });
                  setExpandedCategories(allKeys);
                }}
                className="px-3 py-1.5 text-[10.5px] font-bold text-shiraz bg-white border border-rose-300 hover:bg-rose-50 rounded-lg cursor-pointer transition-all shadow-xxs"
              ><MdText text={inhalt.texte.alleAufklappen} /></button>
              <button
                type="button"
                onClick={() => {
                  setExpandedCategories({});
                }}
                className="px-3 py-1.5 text-[10.5px] font-bold text-slate-700 bg-white border border-slate-250 hover:bg-slate-50 rounded-lg cursor-pointer transition-all shadow-xxs"
              ><MdText text={inhalt.texte.alleEinklappen} /></button>
            </div>
          </div>

          {/* Grid Layout of the Four Principles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {BETON_PRINZIPIEN.map((principle) => {
              const Icon = principle.icon;
              return (
                <div 
                  key={principle.id}
                  className={`border rounded-2xl p-5 md:p-6 shadow-sm transition-all duration-300 hover:shadow-md h-full space-y-4 ${principle.colorBg} ${principle.colorBorder}`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start gap-3 border-b pb-3 border-home-grau/30">
                    <div>
                      <h4 className="text-xs font-black tracking-tight text-slate-950 uppercase font-sans">
                        {principle.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium block leading-none mt-0.5 font-sans">
                        {principle.subtitle}
                      </p>
                    </div>
                    <div className={`p-1.5 rounded-lg border text-sm ${principle.colorIcon}`}>
                      {Icon}
                    </div>
                  </div>

                  {/* Intro Text */}
                  <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans font-normal italic">
                    {principle.intro}
                  </p>

                  {/* Categories Stack */}
                  <div className="space-y-4 pt-1">
                    {principle.categories.map((category, idx) => {
                      const categoryKey = `${principle.id}-${category.name}`;
                      const isExpanded = !!expandedCategories[categoryKey];
                      return (
                        <div key={idx} className="space-y-2 border border-slate-100/60 p-2 rounded-xl bg-slate-50/10 shadow-xxs">
                          <button
                            type="button"
                            onClick={() => {
                              setExpandedCategories(prev => ({
                                ...prev,
                                [categoryKey]: !prev[categoryKey]
                              }));
                            }}
                            className="w-full flex items-center justify-between py-1 px-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors text-left focus:outline-none"
                          >
                            <span className="text-[10px] uppercase font-black tracking-widest text-[#8a1438] block font-mono flex items-center gap-1.5 select-none">
                              {category.name}
                              <span className="text-[8px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded-full font-sans">
                                {category.items.length} {category.items.length === 1 ? 'Eintrag' : 'Einträge'}
                              </span>
                            </span>
                            <span className="text-slate-400">
                              {isExpanded ? (
                                <ChevronUp size={13} className="text-slate-600 font-bold animate-in spin-in-180 duration-200" />
                              ) : (
                                <ChevronDown size={13} className="text-slate-400" />
                              )}
                            </span>
                          </button>

                          {isExpanded && (
                            <div className="space-y-2.5 pt-1.5 animate-in slide-in-from-top-1 duration-200">
                              {category.items.map((item, idy) => {
                                const isPflanzenkohle = item.title.includes('Pflanzenkohle');
                                return (
                                  <div 
                                    key={idy}
                                    onClick={isPflanzenkohle ? () => setShowPflanzenkohleModal(true) : undefined}
                                    className={`p-3.5 bg-white border rounded-xl space-y-1.5 transition-all ${
                                      isPflanzenkohle 
                                        ? 'border-rose-500 bg-rose-50/5 hover:bg-rose-50/20 hover:border-shiraz cursor-pointer shadow-sm relative group active:scale-[0.99] border-2 animate-pulse' 
                                        : 'border-home-grau/30 hover:shadow-sm'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start gap-2">
                                      <strong className="text-[11px] text-slate-900 block font-bold font-sans font-medium">
                                        {item.title}
                                      </strong>
                                      {isPflanzenkohle && (
                                        <span className="shrink-0 text-[9px] bg-rose-100 text-shiraz font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                                          <span>Info 👆</span>
                                          <Sparkles size={8} className="text-shiraz font-bold" />
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans">
                                      {item.desc}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {item.tags.map((tag, tagId) => (
                                        <span 
                                          key={tagId}
                                          className={`text-[8.5px] font-mono font-medium px-1.5 py-0.5 rounded border ${
                                            isPflanzenkohle 
                                              ? 'text-shiraz bg-rose-100/10 border-rose-200/40' 
                                              : 'text-slate-500 bg-slate-50 border-home-grau/30'
                                          }`}
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* --- Tab 3: DAfStb-Richtlinie Treibhausgasreduzierte Tragwerke aus Beton, Stahlbeton oder Spannbeton --- */}
      {activeSubTab === 'dafstb_richtlinie' && (
        <DafstbRichtlinieTab dafstbCalc={dafstbCalc} dafstbBauteil={dafstbBauteil} setDafstbBauteil={setDafstbBauteil} setDafstbBauweise={setDafstbBauweise} dafstbBauweise={dafstbBauweise} dafstbZement={dafstbZement} setDafstbZement={setDafstbZement} dafstbPruefalter={dafstbPruefalter} setDafstbPruefalter={setDafstbPruefalter} dafstbStahlRoute={dafstbStahlRoute} setDafstbStahlRoute={setDafstbStahlRoute} />
      )}

      </ModuleTabs>

      {/* --- Detailed Pflanzenkohle Infobox Modal --- */}
      {showPflanzenkohleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-rose-200 overflow-hidden flex flex-col my-8 animate-scale-in max-h-[85vh] font-sans">
            
            {/* Header Banner */}
            <div className="bg-shiraz/5 p-6 text-text-main flex justify-between items-start">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-500/20 text-shiraz border border-rose-500/30 text-xxs font-bold uppercase tracking-wider">
                  <Trees size={12} /><MdText text={inhalt.texte.klimapositiverBetonbestandteil} /></div>
                <h3 className="text-lg md:text-xl font-extrabold tracking-tight"><MdText text={inhalt.texte.pyrogenePflanzenkohleImBetongefüge} /></h3>
                <p className="text-slate-700 text-xs font-normal"><MdText text={inhalt.texte.wissenschaftlicheHintergründeZurKohlenst} /></p>
              </div>
              <button 
                onClick={() => setShowPflanzenkohleModal(false)}
                className="text-slate-600 hover:text-text-main bg-white hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-home-grau/30 transition-all text-xs font-bold cursor-pointer"
              >
                ✕ Schließen
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-700 leading-relaxed text-sm select-none">
              
              {/* Bento Grid: Core Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-100 flex flex-col justify-between text-center">
                  <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest block mb-1">CO₂-Bindungspotenzial</span>
                  <strong className="text-xl font-black text-rose-900"><MdText text={inhalt.texte.t2530} /></strong>
                  <span className="text-[10px] text-slate-500 block leading-snug mt-1"><MdText text={inhalt.texte.coÄqLagernDauerhaft} /></span>
                </div>
                <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100 flex flex-col justify-between text-center">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest block mb-1">Gefüge-Hydratation</span>
                  <strong className="text-xl font-black text-blue-900"><MdText text={inhalt.texte.internalCuring} /></strong>
                  <span className="text-[10px] text-slate-500 block leading-snug mt-1"><MdText text={inhalt.texte.porenspeicherMindertSchwindrisseSignifik} /></span>
                </div>
                <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-100 flex flex-col justify-between text-center">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block mb-1"><MdText text={inhalt.texte.empfohleneDosierung} /></span>
                  <strong className="text-xl font-black text-amber-900">2% bis 5%</strong>
                  <span className="text-[10px] text-slate-500 block leading-snug mt-1"><MdText text={inhalt.texte.bezogenAufDasZementgewicht} /></span>
                </div>
              </div>

              {/* Carbon sink mechanism */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-rose-900 uppercase tracking-widest flex items-center gap-1 font-mono">
                  <Leaf size={14} className="text-shiraz" /><MdText text={inhalt.texte.t1WieFunktioniertDie} /></h4>
                <p className="text-slate-600 text-xs font-normal"><MdText text={inhalt.texte.bäumeEntziehenDerLuft} /></p>
              </div>

              {/* Physikalisch-chemischer Mechanismus */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <h5 className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                    <Activity size={12} className="text-blue-600" /><MdText text={inhalt.texte.gefügeVorteilInternalCuring} /></h5>
                  <p className="text-[11px] text-slate-500 leading-normal font-normal"><MdText text={inhalt.texte.pflanzenkohleBesitztEineEnorme} /></p>
                </div>
                <div className="space-y-1.5">
                  <h5 className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                    <Calculator size={12} className="text-amber-600" /><MdText text={inhalt.texte.praktischesRechenbeispiel} /></h5>
                  <p className="text-[11px] text-slate-500 leading-normal font-normal"><MdText text={inhalt.texte.einStandardbetonC2530} /></p>
                </div>
              </div>

              {/* Bautechnische Anforderungen */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-rose-950 uppercase tracking-widest flex items-center gap-1 font-mono">
                  <AlertTriangle size={14} className="text-rose-700" /><MdText text={inhalt.texte.t2TechnischeHerausforderungenIm} /></h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-red-50/30 rounded-xl border border-red-100 space-y-1">
                    <span className="font-extrabold text-xs text-rose-900 block"><MdText text={inhalt.texte.extremeFeuchtekorrektur} /></span>
                    <p className="text-[11px] text-slate-500 font-normal"><MdText text={inhalt.texte.aufgrundDerHohenPorosität} /></p>
                  </div>
                  <div className="p-3 bg-indigo-50/25 rounded-xl border border-indigo-100 space-y-1">
                    <span className="font-extrabold text-xs text-indigo-900 block"><MdText text={inhalt.texte.kWertAnrechenbarerAnteil} /></span>
                    <p className="text-[11px] text-slate-500 font-normal"><MdText text={inhalt.texte.pflanzenkohleDientAlsInerter} /></p>
                  </div>
                </div>
              </div>

              {/* Zulassungs- und Prüfsituation */}
              <div className="p-4 bg-shiraz/5 text-rose-950 rounded-xl border border-rose-200/40 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-shiraz block font-mono"><MdText text={inhalt.texte.normativeEinordnungZertifizierung} /></span>
                <p className="text-xs text-slate-600 font-normal leading-relaxed"><MdText text={inhalt.texte.pflanzenkohleFälltDerzeitNoch} /></p>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowPflanzenkohleModal(false)}
                className="bg-shiraz hover:bg-shiraz text-white px-5 py-2 rounded-xl text-xs font-bold shadow transition-all hover:shadow-md cursor-pointer"
              ><MdText text={inhalt.texte.verstandenSchließen} /></button>
            </div>

          </div>
        </div>
      )}

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1TreibhausgasEiner}
        zielGleichung="\text{GWP} = V_c \cdot \text{gwp}_c + m_s \cdot \text{gwp}_s"
        schritte={inhalt.daten["Materialoptimierung.schritte"]}
        ergebnisHinweis={inhalt.werte.geometrieMasseUndZementart}
        normQuelle={inhalt.werte.lehrwerteProjektwerteAusEpd}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2ÄquivalenterW}
        zielGleichung="(w/z)_{eq} = \frac{w}{z + k_f \cdot f}"
        schritte={inhalt.daten["Materialoptimierung.schritte_2"]}
        ergebnisHinweis={inhalt.werte.derKWertAnsatz}
        normQuelle={inhalt.werte.dinEn2062021}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <Querverweis ziel="normen_ausblick" titel={inhalt.werte.neueAusgabenErschienenDin} linkText={inhalt.werte.zumModulAusblickNeue}>
        <p><MdText text={inhalt.texte.maßgebendBleibenDinEn} /></p>
      </Querverweis>

      <ModulTest moduleId="materialoptimierung" />

      {/* --- Module Footer --- */}
      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap7} 
        wikipedia={[
          { title: inhalt.werte.deutscherAusschussFürStahlbeton, url: "https://de.wikipedia.org/wiki/Deutscher_Ausschuss_f%C3%BCr_Stahlbeton" },
          { title: "Bionik", url: "https://de.wikipedia.org/wiki/Bionik" },
          { title: "Carbonbeton", url: "https://de.wikipedia.org/wiki/Carbonbeton" },
          { title: "Materialeffizienz", url: "https://de.wikipedia.org/wiki/Materialeffizienz" }
        ]}
        literatur={inhalt.daten["Materialoptimierung.literatur"]}
        regelwerke={inhalt.daten["Materialoptimierung.regelwerke"]}
        formeln={inhalt.daten["Materialoptimierung.formeln"]}
      />

    </div>
  );
}
