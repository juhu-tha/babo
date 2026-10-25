import React, { useState, useMemo } from 'react';
import { Leaf, Beaker, Layers, Sparkles, CheckCircle2, ChevronRight, Calculator, AlertTriangle, Trees, ChevronDown, ChevronUp, Activity, BookOpen, Scale, Award, Building2, Sliders } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { SAEULEN_DATA, BETON_PRINZIPIEN } from './materialoptimierung/daten';
import { DafstbRichtlinieTab } from './materialoptimierung/DafstbRichtlinieTab';

export default function Materialoptimierung() {
  const [activeSubTab, setActiveSubTab] = useState<'saeulen' | 'betonoptimierung' | 'dafstb_richtlinie'>('saeulen');
  const [selectedSaeule, setSelectedSaeule] = useState<'effizienz' | 'suffizienz' | 'konsistenz' | 'resilienz'>('effizienz');
  const [showPflanzenkohleModal, setShowPflanzenkohleModal] = useState<boolean>(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // DAfStb-Richtlinie Calculator States
  const [dafstbBauteil, setDafstbBauteil] = useState<'decke' | 'stuetze' | 'wand' | 'bodenplatte'>('decke');
  const [dafstbBauweise, setDafstbBauweise] = useState<string>('hohlkoerper');
  const [dafstbZement, setDafstbZement] = useState<'cem1' | 'cem2_all' | 'cem2_bs' | 'cem3_a' | 'cem2_cm'>('cem3_a');
  const [dafstbPruefalter, setDafstbPruefalter] = useState<28 | 56>(56);
  const [dafstbStahlRoute, setDafstbStahlRoute] = useState<'standard_bof' | 'gruen_eaf'>('gruen_eaf');

  const activeSaeuleData = useMemo(() => {
    return SAEULEN_DATA.find(s => s.id === selectedSaeule)!;
  }, [selectedSaeule]);

  // DAfStb-Richtlinie Tragwerks-Berechnung
  const dafstbCalc = useMemo(() => {
    let refBetonVol = 26.0;
    let refStahlKg = 2860;
    let refArea = 100;
    let areaUnit = 'm² Deckenfläche';
    let label = 'Geschossdecke (100 m² Fläche)';

    let optBetonVol = 26.0;
    let optStahlKg = 2860;

    if (dafstbBauteil === 'decke') {
      label = 'Geschossdecke (100 m² Fläche)';
      refArea = 100;
      areaUnit = 'm² Decke';
      refBetonVol = 26.0; // 26 cm Massivplatte
      refStahlKg = 2860; // 110 kg/m³
      if (dafstbBauweise === 'massiv') {
        optBetonVol = 24.0; // 24 cm schlank optimiert
        optStahlKg = 2520; // 105 kg/m³
      } else if (dafstbBauweise === 'hohlkoerper') {
        optBetonVol = 19.5; // -25% durch Hohlkörperverdrängung
        optStahlKg = 2470; // 95 kg/m³ bezogen auf Bruttomaß
      } else if (dafstbBauweise === 'vorgespannt') {
        optBetonVol = 20.0; // 20 cm Flachdecke mit Spannbeton
        optStahlKg = 1400; // 70 kg/m³ Spann- und Zulagebewehrung
      }
    } else if (dafstbBauteil === 'stuetze') {
      label = 'Innenstützen (4 Stützen à 3,50 m = 14 m Gesamtlänge)';
      refArea = 14;
      areaUnit = 'm Stütze';
      refBetonVol = 2.835; // 45x45 cm C25/30
      refStahlKg = 397; // 140 kg/m³
      if (dafstbBauweise === 'hochfest_c50_schlank') {
        optBetonVol = 1.26; // 30x30 cm hochfest C50/60 (-55% Betonvolumen)
        optStahlKg = 202; // 160 kg/m³
      } else {
        optBetonVol = 2.835;
        optStahlKg = 397;
      }
    } else if (dafstbBauteil === 'wand') {
      label = 'Tragwand / Kernwand (60 m² Ansichtsfläche)';
      refArea = 60;
      areaUnit = 'm² Wand';
      refBetonVol = 14.4; // 24 cm Dicke
      refStahlKg = 1152; // 80 kg/m³
      if (dafstbBauweise === 'optimiert_18') {
        optBetonVol = 10.8; // 18 cm Dicke (-25% Betonvolumen)
        optStahlKg = 864;
      } else {
        optBetonVol = 14.4;
        optStahlKg = 1152;
      }
    } else if (dafstbBauteil === 'bodenplatte') {
      label = 'Fundamentplatte / Bodenplatte (120 m² Grundfläche)';
      refArea = 120;
      areaUnit = 'm² Platte';
      refBetonVol = 42.0; // 35 cm Dicke
      refStahlKg = 3780; // 90 kg/m³
      if (dafstbBauweise === 'optimiert_28') {
        optBetonVol = 33.6; // 28 cm Dicke (-20% Betonvolumen)
        optStahlKg = 2856;
      } else {
        optBetonVol = 42.0;
        optStahlKg = 3780;
      }
    }

    // Concrete GWP factors [kg CO2e / m³]
    const zementGwpMap: Record<string, number> = {
      cem1: 310,
      cem2_all: 250,
      cem2_bs: 190,
      cem3_a: 135,
      cem2_cm: 105
    };

    const optZementBaseGwp = zementGwpMap[dafstbZement] || 250;
    // 56-day testing age allows ~9% cement reduction due to prolonged hydration of slag/pozzolana
    const ageFactor = dafstbPruefalter === 56 ? 0.91 : 1.0;
    const optConcreteGwpPerM3 = Math.round(optZementBaseGwp * ageFactor);

    // Steel GWP factors [kg CO2e / kg]
    const refSteelGwpPerKg = 0.98; // European BOF average
    const optSteelGwpPerKg = dafstbStahlRoute === 'gruen_eaf' ? 0.42 : 0.98;

    // Totals Reference
    const refConcreteGwpTotal = Math.round(refBetonVol * 310);
    const refSteelGwpTotal = Math.round(refStahlKg * refSteelGwpPerKg);
    const refTotalGwp = refConcreteGwpTotal + refSteelGwpTotal;
    const refSpecificGwp = refTotalGwp / refArea;

    // Totals Optimized
    const optConcreteGwpTotal = Math.round(optBetonVol * optConcreteGwpPerM3);
    const optSteelGwpTotal = Math.round(optStahlKg * optSteelGwpPerKg);
    const optTotalGwp = optConcreteGwpTotal + optSteelGwpTotal;
    const optSpecificGwp = optTotalGwp / refArea;

    // Reduction
    const diffAbs = Math.max(0, refTotalGwp - optTotalGwp);
    const diffPct = Math.max(0, ((refTotalGwp - optTotalGwp) / refTotalGwp) * 100);

    // DAfStb Efficiency Class
    let efficiencyClass = 'Referenz';
    let efficiencyBadge = 'bg-slate-100 text-slate-800 border-slate-300';
    let classLabel = 'Konventioneller Standard';
    let classStar = 'Basis';

    if (diffPct >= 50) {
      efficiencyClass = 'Klasse A+';
      efficiencyBadge = 'bg-emerald-100 text-emerald-900 border-emerald-300';
      classLabel = 'THG-Exzellenz (Ultra-Low-Carbon)';
      classStar = '★★★★★';
    } else if (diffPct >= 40) {
      efficiencyClass = 'Klasse A';
      efficiencyBadge = 'bg-green-100 text-green-900 border-green-300';
      classLabel = 'Ambitionierte Dekarbonisierung';
      classStar = '★★★★☆';
    } else if (diffPct >= 25) {
      efficiencyClass = 'Klasse B';
      efficiencyBadge = 'bg-amber-100 text-amber-900 border-amber-300';
      classLabel = 'Wirtschaftliches Optimum';
      classStar = '★★★☆☆';
    } else if (diffPct >= 10) {
      efficiencyClass = 'Klasse C';
      efficiencyBadge = 'bg-blue-100 text-blue-900 border-blue-300';
      classLabel = 'Einstiegs-Optimierung';
      classStar = '★★☆☆☆';
    }

    return {
      label,
      areaUnit,
      refArea,
      refBetonVol,
      refStahlKg,
      optBetonVol,
      optStahlKg,
      optConcreteGwpPerM3,
      refTotalGwp,
      optTotalGwp,
      refConcreteGwpTotal,
      optConcreteGwpTotal,
      refSteelGwpTotal,
      optSteelGwpTotal,
      refSpecificGwp,
      optSpecificGwp,
      diffAbs,
      diffPct,
      efficiencyClass,
      efficiencyBadge,
      classLabel,
      classStar
    };
  }, [dafstbBauteil, dafstbBauweise, dafstbZement, dafstbPruefalter, dafstbStahlRoute]);

  return (
    <div className="flex flex-col gap-6 w-full text-slate-800 animate-fade-in">
      
      {/* --- Header Panel --- */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
          <Leaf className="text-shiraz" /> Material- &amp; Stoffoptimierung
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Ökologische Bilanzverbesserung durch stoffliche Optimierungspfade. Erschließen Sie Potenziale mit den Säulen der Kreislaufwirtschaft und analysiere klinkerarme Bindemittel- und Substitutionskonzepte nach DIN EN 15804+A2 und VDI 4800.
          </p>
        </div>
      </div>

      {/* --- Navigation Subtabs --- */}
      <div className="flex border-b border-home-grau/30 overflow-x-auto bg-white p-1 rounded-xl shadow-sm border gap-1">
        <button aria-pressed={activeSubTab === 'saeulen'}
          className={`flex-1 min-w-[150px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'saeulen' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('saeulen')}
        >
          <Layers size={14} /> Die 4 Säulen der Stoffoptimierung
        </button>
        <button aria-pressed={activeSubTab === 'betonoptimierung'}
          className={`flex-1 min-w-[150px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'betonoptimierung' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('betonoptimierung')}
        >
          <Beaker size={14} /> Betonoptimierungs-Leitfaden (Prinzipien)
        </button>
        <button aria-pressed={activeSubTab === 'dafstb_richtlinie'}
          className={`flex-1 min-w-[180px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'dafstb_richtlinie' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('dafstb_richtlinie')}
        >
          <Scale size={14} /> DAfStb-Richtlinie: Treibhausgasreduzierte Tragwerke aus Beton, Stahlbeton oder Spannbeton
        </button>
      </div>

      {/* --- Tab 1: 4 Pillars of Optimization --- */}
      {activeSubTab === 'saeulen' && (
        <div className="space-y-6">
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Sparkles className="text-shiraz" size={18} /> Strategische Dimensionen für kreislaufgerechte Gebäude
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Eine verbesserte Ökobilanz (LCA) lässt sich nicht allein durch nachlaufende Dämmstoffverbesserungen erzielen. Vielmehr greift die systemische Stoffoptimierung an der Tragwerksplanung an. Durch geschicktes Ineinandergreifen von Suffizienz, Effizienz, Konsistenz und Resilienz wird mineralischer Müll verhindert und der Carbon footprint drastisch minimiert.
          </p>
        </div>

            {/* Left selector, right details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
              
              {/* Pillar Selector Buttons */}
              <div className="md:col-span-4 flex flex-col gap-3">
                {SAEULEN_DATA.map((saeule) => (
                  <button aria-pressed={selectedSaeule === saeule.id}
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
              </div>

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
                    <span className="text-[11px] font-bold text-slate-800 block">
                      Maßgebliche Optimierungsansätze:
                    </span>
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
                  <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest block mb-1 font-mono">
                    🎓 Praxisbeispiel aus dem Ingenieurbüro
                  </span>
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
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                Wissenschaftliche Prinzipien der Betonoptimierung
              </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Über 60% der CO₂-Emissionen des klassischen Betons basieren auf rohstoff- und prozessbedingten Prozeduren beim Entsäuern des Kalksteins im Ofen, während ~40% auf thermischen Brennstoffen lagern. Hier sind die vier baupraktischen Kern-Sektoren der systematischen Treibhausgasminimierung strukturiesystematisch gelistet.
          </p>
        </div>
          </div>

          {/* Collapse/Expand Control Panel */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50/75 border border-slate-200 rounded-xl gap-3">
            <div>
              <span className="text-xs font-extrabold text-shiraz uppercase tracking-widest block font-mono flex items-center gap-1.5">
                <Layers size={13} className="text-shiraz" /> Klappbare Menüpunkte (Leitfaden-Struktur)
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Klicken Sie auf einzelne Kategorieüberschriften, um spezifische Optimierungswege ein- oder auszublenden.
              </span>
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
              >
                📂 Alle aufklappen
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpandedCategories({});
                }}
                className="px-3 py-1.5 text-[10.5px] font-bold text-slate-700 bg-white border border-slate-250 hover:bg-slate-50 rounded-lg cursor-pointer transition-all shadow-xxs"
              >
                📁 Alle einklappen
              </button>
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

      {/* --- Detailed Pflanzenkohle Infobox Modal --- */}
      {showPflanzenkohleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-rose-200 overflow-hidden flex flex-col my-8 animate-scale-in max-h-[85vh] font-sans">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-shiraz via-fuchsia-900 to-slate-950 p-6 text-white flex justify-between items-start">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-500/20 text-shiraz-300 border border-rose-500/30 text-xxs font-bold uppercase tracking-wider">
                  <Trees size={12} /> Klimapositiver Betonbestandteil
                </div>
                <h3 className="text-lg md:text-xl font-extrabold tracking-tight">
                  Pyrogene Pflanzenkohle im Betongefüge
                </h3>
                <p className="text-fuchsia-200/80 text-xs font-normal">
                  Wissenschaftliche Hintergründe zur Kohlenstoffsenke im Tragwerk
                </p>
              </div>
              <button 
                onClick={() => setShowPflanzenkohleModal(false)}
                className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 transition-all text-xs font-bold cursor-pointer"
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
                  <strong className="text-xl font-black text-rose-900">~ 2,5 - 3,0 t</strong>
                  <span className="text-[10px] text-slate-500 block leading-snug mt-1">CO₂-Äq lagern dauerhaft pro 1 t reiner Pflanzenkohle</span>
                </div>
                <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100 flex flex-col justify-between text-center">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest block mb-1">Gefüge-Hydratation</span>
                  <strong className="text-xl font-black text-blue-900">Internal Curing</strong>
                  <span className="text-[10px] text-slate-500 block leading-snug mt-1">Porenspeicher mindert Schwindrisse signifikant</span>
                </div>
                <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-100 flex flex-col justify-between text-center">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block mb-1">Empfohlene Dosierung</span>
                  <strong className="text-xl font-black text-amber-900">2% bis 5%</strong>
                  <span className="text-[10px] text-slate-500 block leading-snug mt-1">bezogen auf das Zementgewicht als inerte Feinstsubstitution</span>
                </div>
              </div>

              {/* Carbon sink mechanism */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-rose-900 uppercase tracking-widest flex items-center gap-1 font-mono">
                  <Leaf size={14} className="text-shiraz" /> 1. Wie funktioniert die dauerhafte Carbon-Senke?
                </h4>
                <p className="text-slate-600 text-xs font-normal">
                  Bäume entziehen der Luft während des Wachstums Kohlendioxid. Stirbt der Baum oder verrottet Holzschutt, geht das CO₂ zurück in die Atmosphäre. 
                  Durch die <strong>thermochemische Pyrolyse</strong> (Erhitzung unter Sauerstoffentzug bei 500 °C bis 800 °C) wird der biologische Kohlenstoff hochgradig in aromatische Kohlenstoffringe strukturiert. Über Jahrhunderte ist diese feste Kohle resistent gegen Verrottung (inert). 
                  Wird dieser stabilisierte Kohlenstoff homogen im Zementstein des Betons umschlossen, entsteht ein künstliches, unlösliches Endlager im Fundament oder der Decke.
                </p>
              </div>

              {/* Physikalisch-chemischer Mechanismus */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <h5 className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                    <Activity size={12} className="text-blue-600" /> Gefüge-Vorteil (Internal Curing)
                  </h5>
                  <p className="text-[11px] text-slate-500 leading-normal font-normal">
                    Pflanzenkohle besitzt eine enorme spezifische Oberfläche (bis zu 350 m²/g) und ein ausgeprägtes Porensystem. Beim Betonmischen saugt sie überschüssiges Anmachwasser auf und speichert es. 
                    Während der 28-tägigen Hydratation (Erstarren des Zements) gibt sie dieses Wasser langsam wieder ab. Dies sichert eine konstante Feuchte im Mikromilieu und verhindert autogenes Schwinden und Mikrorisse.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h5 className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                    <Calculator size={12} className="text-amber-600" /> Praktisches Rechenbeispiel
                  </h5>
                  <p className="text-[11px] text-slate-500 leading-normal font-normal">
                    Ein Standardbeton C25/30 verursacht ca. 240 kg CO₂ pro Kubikmeter. 
                    Substituiert man 10 kg Feinstsand durch 10 kg hochaktive Pflanzenkohle (Erhöhung des Biochar-Anteils um ca. 3% des Zementgewichts), filtert und bindet diese Menge rechnerisch rund <strong>25 bis 30 kg CO₂</strong> im Bauteil. 
                    Damit reduziert sich die herstellungsbedingte Gesamtbilanz auf einen Schlag um <strong>über 10 %</strong>!
                  </p>
                </div>
              </div>

              {/* Bautechnische Anforderungen */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-rose-950 uppercase tracking-widest flex items-center gap-1 font-mono">
                  <AlertTriangle size={14} className="text-rose-700" /> 2. Technische Herausforderungen im Betonwerk
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-red-50/30 rounded-xl border border-red-100 space-y-1">
                    <span className="font-extrabold text-xs text-rose-900 block">Extreme Feuchtekorrektur</span>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Aufgrund der hohen Porosität der Kohle muss das wirksame Wasser beim Mischen peinlichst korrigiert werden. Geschieht dies nicht, entzieht die Kohle dem Zementleim das Hydratationswasser und bricht das Ausbreitmaß (Konsistenz) ein.
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-50/25 rounded-xl border border-indigo-100 space-y-1">
                    <span className="font-extrabold text-xs text-indigo-900 block">k-Wert &amp; anrechenbarer Anteil</span>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Pflanzenkohle dient als inerter Zusatzstoff (Typ I). Sie besitzt keine hydraulischen oder nennenswert puzzeolane Eigenreaktionen, weswegen die Festigkeitsklasse geringfügig absinken kann. Ihre Korngrößenverteilung muss präzise auf die Fuller-Sieblinie abgestimmt sein.
                    </p>
                  </div>
                </div>
              </div>

              {/* Zulassungs- und Prüfsituation */}
              <div className="p-4 bg-shiraz/5 text-rose-950 rounded-xl border border-rose-200/40 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-shiraz block font-mono">Normative Einordnung &amp; Zertifizierung</span>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  Pflanzenkohle fällt derzeit noch nicht unter das Standardregelwerk der DIN EN 206 (kein genormter Typ-II-Zusatzstoff). Für tragende Teile ist eine <strong>Zustimmung im Einzelfall (ZiE)</strong> oder eine vorzeitige bauaufsichtliche Zulassung (abZ) erforderlich. 
                  Die Zertifizierung über das <strong>European Biochar Certificate (EBC-Bau)</strong> garantiert, dass die Aktivkohle schadstofffrei ist (Einheit über polyzyklische aromatische Kohlenwasserstoffe - PAKs) und unbedenklich verbaut werden darf.
                </p>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowPflanzenkohleModal(false)}
                className="bg-shiraz hover:bg-shiraz text-white px-5 py-2 rounded-xl text-xs font-bold shadow transition-all hover:shadow-md cursor-pointer"
              >
                Verstanden &amp; Schließen ✓
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Treibhausgas einer Stahlbetondecke je m² – Standard gegen optimiert"
        zielGleichung="\text{GWP} = V_c \cdot \text{gwp}_c + m_s \cdot \text{gwp}_s"
        schritte={[
          { titel: 'Standard', erklaerung: 'Vollplatte 20 cm, C25/30 mit CEM I (Lehrwert 245 kg CO₂-Äq./m³), Bewehrung 20 kg/m² (Elektrostahl, Lehrwert 0,7 kg CO₂-Äq./kg):', formel: '0{,}20 \\cdot 245 + 20 \\cdot 0{,}7 = 49{,}0 + 14{,}0 = 63{,}0\\,\\text{kg CO}_2\\text{-Äq./m}^2' },
          { titel: 'Optimiert', erklaerung: 'Hohlkörperdecke mit 25 % weniger Beton (0,15 m³/m²), CEM III/A (174 kg CO₂-Äq./m³), Bewehrung 18 kg/m²:', formel: '0{,}15 \\cdot 174 + 18 \\cdot 0{,}7 = 26{,}1 + 12{,}6 = 38{,}7\\,\\text{kg CO}_2\\text{-Äq./m}^2' },
          { titel: 'Einsparung', erklaerung: 'Relative Minderung:', formel: '\\frac{63{,}0 - 38{,}7}{63{,}0} = 39\\,\\%' }
        ]}
        ergebnisHinweis="Geometrie (Masse) und Zementart wirken multiplikativ. Tragfähigkeit, Durchstanzen, Schall- und Brandschutz der Hohlkörperdecke sind gesondert nachzuweisen."
        normQuelle="Lehrwerte; Projektwerte aus EPD (DIN EN 15804+A2) bzw. ÖKOBAUDAT"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Äquivalenter w/z-Wert mit Flugasche"
        zielGleichung="(w/z)_{eq} = \frac{w}{z + k_f \cdot f}"
        schritte={[
          { titel: 'Rezeptur', erklaerung: 'Wasser 165 kg/m³, Zement 280 kg/m³, Flugasche 60 kg/m³, k_f = 0,4:', formel: 'w = 165,\\; z = 280,\\; f = 60' },
          { titel: 'Anrechenbarer Bindemittelgehalt', erklaerung: 'Flugasche wird nur mit dem k-Wert angerechnet:', formel: 'z + 0{,}4 \\cdot 60 = 304\\,\\text{kg/m}^3' },
          { titel: 'Äquivalenter w/z-Wert', erklaerung: 'Vergleich mit Grenzwerten der Expositionsklassen (z. B. XC4: max. 0,60):', formel: '(w/z)_{eq} = \\frac{165}{304} = 0{,}54 \\le 0{,}60' }
        ]}
        ergebnisHinweis="Der k-Wert-Ansatz erlaubt Klinkereinsparung ohne Dauerhaftigkeitsverlust. Für Hüttensandmehl ist er in Deutschland nur eingeschränkt anwendbar; Höchstmengen an Flugasche je Zementart sind zu beachten."
        normQuelle="DIN EN 206:2021-06 / DIN 1045-2:2023-08 (k-Wert-Ansatz)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="materialoptimierung" />

      {/* --- Module Footer --- */}
      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 7 Nachhaltigkeit: Bilanzformeln, k-Wert-Ansatz und Quellen geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: "Deutscher Ausschuss für Stahlbeton", url: "https://de.wikipedia.org/wiki/Deutscher_Ausschuss_f%C3%BCr_Stahlbeton" },
          { title: "Bionik", url: "https://de.wikipedia.org/wiki/Bionik" },
          { title: "Carbonbeton", url: "https://de.wikipedia.org/wiki/Carbonbeton" },
          { title: "Materialeffizienz", url: "https://de.wikipedia.org/wiki/Materialeffizienz" }
        ]}
        literatur={[
          "Deutscher Ausschuss für Stahlbeton (DAfStb): DAfStb-Richtlinie Treibhausgasreduzierte Tragwerke aus Beton, Stahlbeton oder Spannbeton – Teil 1: Grundlagen und Nachweis am gesamten Tragwerk; Teil 2: Deckenbauteile. Ausgabe August 2024. Berlin: DIN Media 2024",
          "Sobek, W.: non nobis – über das Bauen in der Zukunft. Band 1: Ausgehen muss man von dem, was ist. Stuttgart: av edition 2022",
          "Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011",
          "Stark, J.; Wicht, B.: Dauerhaftigkeit von Beton. 2. Aufl., Berlin: Springer Vieweg 2013"
        ]}
        regelwerke={[
          { title: "DAfStb-Richtlinie Treibhausgasreduzierte Tragwerke aus Beton, Stahlbeton oder Spannbeton (Teile 1 und 2), Ausgabe August 2024", url: "https://www.dafstb.de/" },
          { title: "DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA (Eurocode 2); neue Generation DIN EN 1992-1-1:2025-09" },
          { title: "DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton – Festlegung, Eigenschaften, Herstellung und Konformität; Neuausgaben DIN EN 206-1 und -2:2026-07 erschienen)" },
          { title: "DIN EN 13670 / DIN 1045-3 (Ausführung von Tragwerken aus Beton)" },
          { title: "VDI 4800 Blatt 1: Ressourceneffizienz - Methodische Grundlagen, Prinzipien und Strategien" }
        ]}
        formeln={[
          {
            formel: "GWP_{\\text{Bauteil}} = V_{\\text{c}} \\cdot gwp_{\\text{c}} + m_{\\text{s}} \\cdot gwp_{\\text{s}} \\quad [\\text{kg CO}_2\\text{-eq}]",
            erklaerung: "Treibhausgasbilanzierung von Stahlbetonbauteilen über Beton- und Bewehrungsstahlanteile (Modul A1–A3).",
            quelle: "Bilanzierung nach DIN EN 15804+A2 / DIN EN 15978 (Module A1–A3)"
          },
          {
            formel: "(w/c)_{\\text{eq}} = \\frac{w}{c + k \\cdot z} \\quad [\\text{k-Wert nach DIN 1045-2}]",
            erklaerung: "Äquivalenter Wasserzementwert zur Anrechnung von Flugasche (k = 0,4) und Silikastaub (k = 1,0); für Hüttensandmehl nach DIN EN 15167-1 enthält DIN 1045-2:2023-08 einen eigenen k-Wert-Ansatz (Abschn. 5.2.5.2.5).",
            quelle: "DIN 1045-2 / DIN EN 206"
          },
          {
            formel: "\\eta_{\\text{Material}} = \\frac{m_{\\text{Soll}}}{m_{\\text{Ist}}} \\cdot 100 \\quad [\\%]",
            erklaerung: "Materialnutzungsgrad zur Quantifizierung bionischer oder topologieoptimierter Leichtbaustrukturen.",
            quelle: "VDI 4800 Blatt 1"
          },
          {
            formel: "\\Delta G = \\left(1 - \\frac{\\rho_{\\text{leicht}}}{\\rho_{\\text{standard}}}\\right) \\cdot 100 \\quad [\\%]",
            erklaerung: "Gewichtseinsparungsquote bei Substitution von Normalbeton durch gradierte Strukturen oder leichte Gesteinskörnungen.",
            quelle: "Massivbau-Leichtbaupraxis"
          }
        ]}
      />

    </div>
  );
}
