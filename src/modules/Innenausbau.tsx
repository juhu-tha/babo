import { formatDeZahl } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { 
  LayoutGrid, 
  Layers, 
  Box, 
  Shield, 
  Flame, 
  Activity, 
  BookOpen, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Calculator, 
  Thermometer,
  Volume2,
  Droplets,
  HardHat,
  Filter,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { useTabContext, TabType } from '../contexts/TabContext';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath } from 'react-katex';
import inhalt from '@/content/innenausbau/Innenausbau.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface AusbauToolItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'trockenbau' | 'estrich_putz' | 'physik_labor' | 'normen_aufgaben';
  targetTab: TabType;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  features: string[];
  keyStandard: string;
  quickFact: string;
}

export default function Innenausbau() {
  const { setActiveTab } = useTabContext();
  const [mainTab, setMainTab] = useState<'uebersicht' | 'estriche' | 'trockenbau' | 'abdichtung' | 'rechner'>('uebersicht');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'trockenbau' | 'estrich_putz' | 'physik_labor' | 'normen_aufgaben'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // CM-Rechner State
  const [estrichArt, setEstrichArt] = useState<'CT' | 'CA'>('CT');
  const [mitFussbodenheizung, setMitFussbodenheizung] = useState<boolean>(true);
  const [belagArt, setBelagArt] = useState<'fliesen' | 'parkett' | 'elastisch'>('parkett');
  const [gemessenerCM, setGemessenerCM] = useState<number>(1.8);

  // CM Grenzwerte nach DIN 18560-1 / DIN 18560-2
  const cmGrenzwert = useMemo(() => {
    if (estrichArt === 'CT') {
      return mitFussbodenheizung ? 1.8 : 2.0;
    } else {
      // CA / CAF
      return mitFussbodenheizung ? 0.3 : 0.5;
    }
  }, [estrichArt, mitFussbodenheizung]);

  const istBelegreif = gemessenerCM <= cmGrenzwert;

  const tools: AusbauToolItem[] = [
    {
      id: 'bp_trockenbau',
      title: inhalt.werte.trockenbausystemeStänderwerke,
      subtitle: inhalt.werte.metallunterkonstruktionenBeplankungenSys,
      category: 'trockenbau',
      targetTab: 'bp_trockenbau',
      badge: 'Bauprodukt-Modul',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: Box,
      description: inhalt.werte.detaillierteÜbersichtÜberCw,
      features: inhalt.daten["Innenausbau.tools.bp_trockenbau.features"],
      keyStandard: inhalt.werte.din18181DinEn,
      quickFact: inhalt.werte.zweischaligeTrockenbauwändeErreichenTrot
    },
    {
      id: 'bp_putz_estrich',
      title: inhalt.werte.putzEstrichsysteme,
      subtitle: inhalt.werte.innenputzeHeizestricheCalciumsulfat,
      category: 'estrich_putz',
      targetTab: 'bp_putz_estrich',
      badge: 'Bauprodukt-Modul',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Layers,
      description: inhalt.werte.gegenüberstellungAllerMineralischenAusba,
      features: inhalt.daten["Innenausbau.tools.bp_putz_estrich.features"],
      keyStandard: inhalt.werte.din18560DinEn,
      quickFact: inhalt.werte.calciumsulfatFließestricheCafSchwinden
    },
    {
      id: 'ausbau',
      title: inhalt.werte.ausbauAbdichtungBeläge,
      subtitle: inhalt.werte.bodenaufbautenFliesenParkettDin,
      category: 'estrich_putz',
      targetTab: 'ausbau',
      badge: 'Praxismodul',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: LayoutGrid,
      description: inhalt.werte.umfassendesFachmodulZuAusbaumaterialien,
      features: inhalt.daten["Innenausbau.tools.ausbau.features"],
      keyStandard: inhalt.werte.din18534Din18157,
      quickFact: inhalt.werte.bodengleicheDuschenFallenNach
    },
    {
      id: 'gips',
      title: inhalt.werte.bindemittelGipsCalciumsulfat,
      subtitle: inhalt.werte.materialwissenschaftHydratationBrandschu,
      category: 'trockenbau',
      targetTab: 'gips',
      badge: 'Baustoff-Modul',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: BookOpen,
      description: inhalt.werte.tiefgehendesMaterialwissenschaftlichesPr,
      features: inhalt.daten["Innenausbau.tools.gips.features"],
      keyStandard: inhalt.werte.dinEn132791,
      quickFact: inhalt.werte.imBrandfallVerdampfenAus
    },
    {
      id: 'bp_daemmung',
      title: inhalt.werte.dämmstoffeImInnenausbau,
      subtitle: inhalt.werte.trittschallHohlraumdämpfungInnendämmung,
      category: 'physik_labor',
      targetTab: 'bp_daemmung',
      badge: 'Dämmungs-Modul',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Thermometer,
      description: inhalt.werte.auswahlUndBemessungVon,
      features: inhalt.daten["Innenausbau.tools.bp_daemmung.features"],
      keyStandard: inhalt.werte.dinEn13162Din,
      quickFact: inhalt.werte.einSchwimmenderEstrichAuf
    },
    {
      id: 'labor',
      title: inhalt.werte.laborprüfstandHaftzugprüfung,
      subtitle: inhalt.werte.virtuelleAbreißprüfungAnEstrich,
      category: 'physik_labor',
      targetTab: 'labor',
      badge: 'Labor-Simulator',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: Activity,
      description: inhalt.werte.interaktiverLaborversuchNachDin,
      features: inhalt.daten["Innenausbau.tools.labor.features"],
      keyStandard: inhalt.werte.dinEn12004Din,
      quickFact: inhalt.werte.calciumsulfatFließestricheWerdenVor
    },
    {
      id: 'schallschutz',
      title: inhalt.werte.bauakustikSchallschutz,
      subtitle: inhalt.werte.biegeweicheWandschalenTrittschallminderu,
      category: 'physik_labor',
      targetTab: 'schallschutz',
      badge: 'Bauphysik-Modul',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: Volume2,
      description: inhalt.werte.berechnungUndOptimierungDer,
      features: inhalt.daten["Innenausbau.tools.schallschutz.features"],
      keyStandard: inhalt.werte.din4109Vdi4100,
      quickFact: inhalt.werte.schonEineEinzelneSchallbrücke
    },
    {
      id: 'feuchteschutz',
      title: inhalt.werte.feuchteschutzDampfdiffusion,
      subtitle: inhalt.werte.tauwasserausfallDampfbremsenBaufeuchte,
      category: 'physik_labor',
      targetTab: 'feuchteschutz',
      badge: 'Bauphysik-Modul',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      icon: Droplets,
      description: inhalt.werte.nachweisDerTauwasserfreiheitUnd,
      features: inhalt.daten["Innenausbau.tools.feuchteschutz.features"],
      keyStandard: 'DIN 4108-3',
      quickFact: inhalt.werte.gipsplattenPuffernFeuchtespitzenDauerhaf
    },
    {
      id: 'brandschutz',
      title: inhalt.werte.vorbeugenderBrandschutz,
      subtitle: inhalt.werte.feuerwiderstandsklassenBekleidungenAbsch,
      category: 'physik_labor',
      targetTab: 'brandschutz',
      badge: 'Bauphysik-Modul',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: Flame,
      description: inhalt.werte.nachweisVonF30Bis,
      features: inhalt.daten["Innenausbau.tools.brandschutz.features"],
      keyStandard: inhalt.werte.din41024Din,
      quickFact: inhalt.werte.inNotwendigenTreppenräumenUnd
    },
    {
      id: 'aufgaben_bauprodukte',
      title: inhalt.werte.prüfungsaufgabenAusbauBauprodukte,
      subtitle: inhalt.werte.klausurrelevanteFragenBerechnungen,
      category: 'normen_aufgaben',
      targetTab: 'aufgaben_bauprodukte',
      badge: 'Klausurtraining',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      description: inhalt.werte.interaktiveÜbungsUndKlausuraufgaben,
      features: inhalt.daten["Innenausbau.tools.aufgaben_bauprodukte.features"],
      keyStandard: inhalt.werte.prüfungsordnungTha,
      quickFact: inhalt.werte.typischePrüfungsfrageWarumSind
    },
    {
      id: 'wta',
      title: inhalt.werte.wtaMerkblätterInnensanierung,
      subtitle: inhalt.werte.nachträglicheAbdichtungSchimmelsanierung,
      category: 'normen_aufgaben',
      targetTab: 'wta',
      badge: 'Regelwerk-Modul',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      icon: Shield,
      description: inhalt.werte.leitfädenDerWissenschaftlichTechnischen,
      features: inhalt.daten["Innenausbau.tools.wta.features"],
      keyStandard: inhalt.werte.wtaMerkblatt64,
      quickFact: inhalt.werte.sanierputzeLagernSalzeFür
    },
    {
      id: 'rechnung_u_wert',
      title: inhalt.werte.rechnerUWertVon,
      subtitle: inhalt.werte.berechnungVonTrockenbauDachaufbauten,
      category: 'normen_aufgaben',
      targetTab: 'rechnung_u_wert',
      badge: inhalt.werte.interaktiverRechner,
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
      icon: Calculator,
      description: inhalt.werte.berechnenSieDenWärmedurchgangskoeffizien,
      features: inhalt.daten["Innenausbau.tools.rechnung_u_wert.features"],
      keyStandard: inhalt.werte.dinEnIso6946,
      quickFact: inhalt.werte.derWärmeübergangswiderstandRsiBeträgt
    }
  ];

  const filteredTools = useMemo(() => {
    return tools.filter((t) => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesQuery = 
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.keyStandard.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [tools, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/20 pb-4">
          <div>
            <span className="text-[11px] font-bold text-shiraz tracking-widest uppercase font-mono"><MdText text={inhalt.texte.clusterIiiEntwurfBemessung} /></span>
            <h2 className="text-2xl font-bold text-text-main flex items-center gap-2 mt-1">
              <LayoutGrid className="text-shiraz" size={26} /><MdText text={inhalt.texte.innenausbauAusbausysteme} /></h2>
            <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.trockenbausystemeMineralischeEstricheVer} /></p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-shiraz/10 text-shiraz border border-shiraz/20 flex items-center gap-1.5">
              <HardHat size={14} /><MdText text={inhalt.texte.fachingenieurAusbauIbi} /></span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-4 pb-1">
          <button aria-pressed={mainTab === 'uebersicht'}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              mainTab === 'uebersicht' 
                ? 'bg-shiraz text-white border-shiraz shadow-sm' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMainTab('uebersicht')}
          >
            <LayoutGrid size={15} /> Modul-Navigator
          </button>
          <button aria-pressed={mainTab === 'estriche'}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              mainTab === 'estriche' 
                ? 'bg-shiraz text-white border-shiraz shadow-sm' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMainTab('estriche')}
          >
            <Layers size={15} /><MdText text={inhalt.texte.estricheCtCaAs} /></button>
          <button aria-pressed={mainTab === 'trockenbau'}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              mainTab === 'trockenbau' 
                ? 'bg-shiraz text-white border-shiraz shadow-sm' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMainTab('trockenbau')}
          >
            <Box size={15} /><MdText text={inhalt.texte.trockenbauGipsplatten} /></button>
          <button aria-pressed={mainTab === 'abdichtung'}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              mainTab === 'abdichtung' 
                ? 'bg-shiraz text-white border-shiraz shadow-sm' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMainTab('abdichtung')}
          >
            <Droplets size={15} /><MdText text={inhalt.texte.verbundabdichtungDin18534} /></button>
          <button aria-pressed={mainTab === 'rechner'}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              mainTab === 'rechner' 
                ? 'bg-shiraz text-white border-shiraz shadow-sm' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMainTab('rechner')}
          >
            <Calculator size={15} /> CM-Restfeuchte-Rechner
          </button>
        </div>
      </div>

      {/* TAB 1: UEBERSICHT / MODUL-NAVIGATOR */}
      {mainTab === 'uebersicht' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {[
                { id: 'all', label: inhalt.werte.alleAusbauTools12, icon: Filter },
                { id: 'trockenbau', label: 'Trockenbausysteme', icon: Box },
                { id: 'estrich_putz', label: inhalt.werte.estrichPutzBelag, icon: Layers },
                { id: 'physik_labor', label: inhalt.werte.physikLaborversuche, icon: Activity },
                { id: 'normen_aufgaben', label: inhalt.werte.normenÜbungen, icon: BookOpen }
              ].map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-2xs cursor-pointer ${
                      isActive
                        ? 'bg-shiraz text-white border-shiraz shadow-sm'
                        : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                    }`}
                  >
                    <Icon size={13} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 text-text-main/40" size={15} />
              <input
                type="text"
                placeholder={inhalt.werte.themaNormOderBaustoff}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-home-grau/30 bg-off-white/50 focus:bg-white focus:border-shiraz focus:outline-hidden transition-all text-text-main"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-[10px] text-text-main/50 hover:text-text-main"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Grid of Tool Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="bg-white rounded-2xl border border-home-grau/30 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-home-grau/60"
                >
                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border ${tool.badgeColor}`}>
                        {tool.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-off-white px-2 py-0.5 rounded border border-home-grau/20">
                        {tool.keyStandard}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 mt-1">
                      <div className="p-2.5 rounded-xl bg-off-white border border-home-grau/25 text-shiraz group-hover:scale-105 transition-transform shrink-0">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-text-main group-hover:text-shiraz transition-colors leading-tight">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-text-main/60 mt-0.5 leading-snug">
                          {tool.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-text-main/80 leading-relaxed mt-1">
                      {tool.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-home-grau/15 space-y-1">
                      {tool.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-text-main/75">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 p-2.5 rounded-lg bg-off-white/80 border border-home-grau/20 text-[11px] text-text-main/70 italic">
                      💡 {tool.quickFact}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/70 border-t border-home-grau/20 flex items-center justify-between">
                    <span className="text-[11px] font-mono font-medium text-slate-500">
                      Tab: <code className="text-text-main font-bold">#{tool.targetTab}</code>
                    </span>
                    <button
                      onClick={() => setActiveTab(tool.targetTab)}
                      className="px-3 py-1.5 rounded-lg bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer group/btn"
                    >
                      <span><MdText text={inhalt.texte.modulÖffnen} /></span>
                      <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ESTRICHE & BELEGREIFE (DEEP DIVE) */}
      {mainTab === 'estriche' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Layers className="text-shiraz" size={20} /><MdText text={inhalt.texte.baustoffkundeDerEstricheNach} /></h3>
              <p className="text-xs text-text-main/75 mt-1 leading-relaxed"><MdText text={inhalt.texte.estricheErfüllenImInnenausbau} /></p>
            </div>

            {/* Matrix of Estrich Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.zementestrichCt} /></span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Hydraulisch</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.bestehendAusZementCem} /></p>
                <div className="mt-2 pt-2 border-t border-home-grau/20 text-[11px] space-y-1">
                  <div><MdText text={inhalt.texte.schwindmaßCa04} /></div>
                  <div><MdText text={inhalt.texte.belegreifeUnbeheizt20} /></div>
                  <div><MdText text={inhalt.texte.belegreifeBeheizt18} /></div>
                  <div className="text-amber-800 text-[10px] mt-1 font-semibold"><MdText text={inhalt.texte.neigtBeiSchnellerAustrocknung} /></div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.calciumsulfatestrichCaCaf} /></span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Calciumsulfat</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.bestehendAusAnhydritOder} /></p>
                <div className="mt-2 pt-2 border-t border-home-grau/20 text-[11px] space-y-1">
                  <div><MdText text={inhalt.texte.schwindmaßMinimal01} /></div>
                  <div><MdText text={inhalt.texte.belegreifeUnbeheizt05} /></div>
                  <div><MdText text={inhalt.texte.belegreifeBeheizt03} /></div>
                  <div className="text-rose-800 text-[10px] mt-1 font-semibold"><MdText text={inhalt.texte.strengFeuchteempfindlichKeinEinsatz} /></div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.gussasphaltAs} /></span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">Thermoplastisch</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.gemischAusBitumenFüller} /></p>
                <div className="mt-2 pt-2 border-t border-home-grau/20 text-[11px] space-y-1">
                  <div><MdText text={inhalt.texte.wassergehalt00Keine} /></div>
                  <div><MdText text={inhalt.texte.belegreifeSobaldErkaltetNach} /></div>
                  <div><MdText text={inhalt.texte.brandschutzSchwerEntflammbarRaucharm} /></div>
                  <div className="text-slate-600 text-[10px] mt-1 font-semibold"><MdText text={inhalt.texte.idealerSchnellbauestrichErfordertTempera} /></div>
                </div>
              </div>
            </div>

            {/* CM-Messung Detailbox */}
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-2">
                <Activity size={15} className="text-shiraz" /><MdText text={inhalt.texte.dasCalciumcarbidVerfahrenCm} /></h4>
              <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dieCmMessungIst} /></p>
              <div className="my-2 p-3 bg-white rounded-lg border border-home-grau/20 text-center font-mono text-xs">
                <InlineMath math="CaC_2 + 2\,H_2O \rightarrow Ca(OH)_2 + C_2H_2 \uparrow" />
              </div>
              <p className="text-[11px] text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.derEntstehendeGasdruckIm} /></p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TROCKENBAU & GIPSPLATTEN (DEEP DIVE) */}
      {mainTab === 'trockenbau' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Box className="text-shiraz" size={20} /><MdText text={inhalt.texte.plattenwerkstoffeImTrockenbauNach} /></h3>
              <p className="text-xs text-text-main/75 mt-1 leading-relaxed"><MdText text={inhalt.texte.trockenbausystemeBasierenAufWerkseitig} /></p>
            </div>

            {/* Plattenarten */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">Typ A (GKB)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Standard</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.klassischeBauplatteMitKartonummantelung} /></p>
                <div className="text-[11px] text-slate-500 font-mono mt-auto"><MdText text={inhalt.texte.kartonElfenbeinGrau} /></div>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.typDfGkf} /></span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">Feuerschutz</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.plattenkernMitGlasfasernArmiert} /></p>
                <div className="text-[11px] text-rose-700 font-mono mt-auto"><MdText text={inhalt.texte.kartonRoterStempel} /></div>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.typH2Gkbi} /></span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Imprägniert</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.kernUndKartonSilikonisiert} /></p>
                <div className="text-[11px] text-emerald-700 font-mono mt-auto"><MdText text={inhalt.texte.kartonGrün} /></div>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">Gipsfaserplatte</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">Gipsfaserplatte</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.homogeneMischungAusGips} /></p>
                <div className="text-[11px] text-indigo-700 font-mono mt-auto"><MdText text={inhalt.texte.strukturFaserverbund} /></div>
              </div>
            </div>

            {/* Verspachtelung Q1 bis Q4 */}
            <div className="border border-home-grau/30 rounded-xl p-4 bg-off-white">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-shiraz" /><MdText text={inhalt.texte.verspachtelungsstufenQualitätsstufenQ1Bi} /></h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-800 block mb-1"><MdText text={inhalt.texte.stufeQ1Grundverspachtelung} /></strong>
                  <p className="text-text-main/75"><MdText text={inhalt.texte.füllenDerFugenUnd} /></p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-800 block mb-1"><MdText text={inhalt.texte.stufeQ2Standardverspachtelung} /></strong>
                  <p className="text-text-main/75"><MdText text={inhalt.texte.nachspachtelnBisZumStufenlosen} /></p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-800 block mb-1"><MdText text={inhalt.texte.stufeQ3Sonderverspachtelung} /></strong>
                  <p className="text-text-main/75"><MdText text={inhalt.texte.breitesAusspachtelnDerFugen} /></p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-800 block mb-1"><MdText text={inhalt.texte.stufeQ4Vollflächenspachtelung} /></strong>
                  <p className="text-text-main/75"><MdText text={inhalt.texte.vollflächigerSpachtelauftrag1Mm} /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VERBUNDABDICHTUNG DIN 18534 */}
      {mainTab === 'abdichtung' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Droplets className="text-shiraz" size={20} /><MdText text={inhalt.texte.innenraumabdichtungImVerbundAiv} /></h3>
              <p className="text-xs text-text-main/75 mt-1 leading-relaxed"><MdText text={inhalt.texte.fliesenUndPlattenbelägeSind} /></p>
            </div>

            {/* Wassereinwirkungsklassen W0-I bis W3-I */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">Klasse W0-I</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Gering</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.flächenMitSeltenemSpritzwasserkontakt} /></p>
                <div className="text-[11px] text-slate-600 mt-auto font-semibold"><MdText text={inhalt.texte.keineAbdichtungAufFeuchteunempfindlichen} /></div>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">Klasse W1-I</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">Mäßig</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.wandflächenÜberBadewannenUnd} /></p>
                <div className="text-[11px] text-blue-800 mt-auto font-semibold"><MdText text={inhalt.texte.verbundabdichtungFlüssigPolymerdispersio} /></div>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">Klasse W2-I</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">Hoch</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.wandUndBodenflächenIn} /></p>
                <div className="text-[11px] text-amber-800 mt-auto font-semibold"><MdText text={inhalt.texte.bahnenförmigeAbdichtungAivB} /></div>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">Klasse W3-I</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">Sehr hoch</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.flächenMitSehrHäufiger} /></p>
                <div className="text-[11px] text-rose-800 mt-auto font-semibold"><MdText text={inhalt.texte.reaktionsharzabdichtungenEpoxidPolyureth} /></div>
              </div>
            </div>

            {/* Baustellendetails & Fehlerquellen */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 text-xs text-text-main/80 space-y-2">
              <strong className="text-amber-900 font-bold flex items-center gap-1.5">
                <AlertTriangle size={15} className="text-amber-600" /><MdText text={inhalt.texte.häufigeSchadensursachenImAusbau} /></strong>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-text-main/75">
                <li><MdText text={inhalt.texte.fehlendeOderMangelhaftEingearbeitete} /></li>
                <li><MdText text={inhalt.texte.verwendungUngeeigneterSilikoneAn} /></li>
                <li><MdText text={inhalt.texte.verlegungVonFliesenbelägenAuf} /></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CM-RESTFEUCHTE-RECHNER */}
      {mainTab === 'rechner' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Calculator className="text-shiraz" size={20} /><MdText text={inhalt.texte.interaktiverBelegreifeCmRestfeuchterechn} /></h3>
              <p className="text-xs text-text-main/75 mt-1 leading-relaxed"><MdText text={inhalt.texte.prüfenSieDieBelegreife} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Parameters */}
              <div className="space-y-4 p-5 rounded-xl border border-home-grau/25 bg-slate-50/40">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block"><MdText text={inhalt.texte.t1EstrichBelagsparameter} /></span>

                <div>
                  <label className="text-xs font-bold text-text-main block mb-1.5">Estrich-Bindemittel:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button aria-pressed={estrichArt === 'CT'}
                      type="button"
                      onClick={() => setEstrichArt('CT')}
                      className={`p-2.5 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                        estrichArt === 'CT' 
                          ? 'bg-shiraz text-white border-shiraz shadow-xs' 
                          : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                      }`}
                    ><MdText text={inhalt.texte.zementestrichCt2} /></button>
                    <button aria-pressed={estrichArt === 'CA'}
                      type="button"
                      onClick={() => setEstrichArt('CA')}
                      className={`p-2.5 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                        estrichArt === 'CA' 
                          ? 'bg-shiraz text-white border-shiraz shadow-xs' 
                          : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                      }`}
                    ><MdText text={inhalt.texte.calciumsulfatCaCaf} /></button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-main block mb-1.5"><MdText text={inhalt.texte.fußbodenheizungHeizestrich} /></label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMitFussbodenheizung(true)}
                      className={`p-2.5 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                        mitFussbodenheizung 
                          ? 'bg-shiraz text-white border-shiraz shadow-xs' 
                          : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                      }`}
                    ><MdText text={inhalt.texte.jaMitHeizung} /></button>
                    <button
                      type="button"
                      onClick={() => setMitFussbodenheizung(false)}
                      className={`p-2.5 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                        !mitFussbodenheizung 
                          ? 'bg-shiraz text-white border-shiraz shadow-xs' 
                          : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                      }`}
                    ><MdText text={inhalt.texte.neinUnbeheizt} /></button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-main block mb-1.5"><MdText text={inhalt.texte.geplanterOberbodenbelag} /></label>
                  <select aria-label={inhalt.werte.geplanterOberbodenbelag}
                    value={belagArt}
                    onChange={(e) => setBelagArt(e.target.value as typeof belagArt)}
                    className="w-full p-2.5 rounded-xl border border-home-grau/30 bg-white text-xs font-medium text-text-main focus:border-shiraz focus:outline-hidden"
                  >
                    <option value="parkett">Parkett / Massivholz / Laminat (feuchteempfindlich)</option>
                    <option value="fliesen">Keramische Fliesen / Naturstein</option>
                    <option value="elastisch">Elastische Beläge (Vinyl / Linoleum / Kautschuk)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.gemessenerCmWert} /></label>
                    <span className="text-sm font-mono font-bold text-shiraz">{formatDeZahl(gemessenerCM, 1)} CM-%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="4.0"
                    step="0.1"
                    value={gemessenerCM}
                    onChange={(e) => setGemessenerCM(parseFloat(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>0,1 %</span>
                    <span>1,0 %</span>
                    <span>2,0 %</span>
                    <span>3,0 %</span>
                    <span>4,0 %</span>
                  </div>
                </div>
              </div>

              {/* Live Result Evaluation */}
              <div className="flex flex-col justify-between p-5 rounded-xl border border-home-grau/25 bg-slate-50/40">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block"><MdText text={inhalt.texte.t2NormativeBeurteilungDer} /></span>

                  <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                    istBelegreif 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}>
                    {istBelegreif ? (
                      <CheckCircle2 size={24} className="text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle size={24} className="text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-bold text-base">
                        {istBelegreif ? inhalt.werte.estrichIstBelegreif : inhalt.werte.achtungNochNichtBelegreif}
                      </h4>
                      <p className="text-xs mt-1 leading-relaxed">
                        {istBelegreif 
                          ? `Der gemessene Feuchtigkeitsgehalt von ${formatDeZahl(gemessenerCM, 1)} CM-% liegt unter dem Richtwert von ${formatDeZahl(cmGrenzwert, 1)} CM-%. Belegreife für ${belagArt} im Sinne dieses Richtwerts erreicht; Herstellerangaben des Belags beachten.`
                          : `Der gemessene Wert (${formatDeZahl(gemessenerCM, 1)} CM-%) liegt über dem Richtwert von ${formatDeZahl(cmGrenzwert, 1)} CM-%. Eine Verlegung führt zu schweren Folgeschäden (Parkettaufwölbung, Schimmelbildung, Hohllagen)!`}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                      <span className="text-slate-500 text-[10px] block"><MdText text={inhalt.texte.zulässigerGrenzwert} /></span>
                      <strong className="text-text-main text-sm">≤ {formatDeZahl(cmGrenzwert, 1)} CM-%</strong>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                      <span className="text-slate-500 text-[10px] block"><MdText text={inhalt.texte.differenzÜberschreitung} /></span>
                      <strong className={`text-sm ${istBelegreif ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {(gemessenerCM - cmGrenzwert > 0 ? '+' : '') + formatDeZahl((gemessenerCM - cmGrenzwert), 1)} CM-%
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-text-main/70"><MdText text={inhalt.texte.rechtlicherHinweisNachVob} /></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielResonanzfrequenzEinerM}
          zielGleichung="f_0 = \frac{1}{2\pi}\sqrt{s' \cdot \left(\frac{1}{m'_1} + \frac{1}{m'_2}\right)}"
          normQuelle={inhalt.werte.masseFederMasseModell}
          schritte={inhalt.daten["Innenausbau.schritte"]}
          ergebnisHinweis={inhalt.werte.einfacheBeplankungM8}
        />
      </div>

      <ModulTest moduleId="innenausbau" />

      {/* Footer mit Modul-Spezifikation (RULE[GEMINI_md]) */}
      <ModuleFooter
        wikipedia={[
          { title: 'Trockenbau', url: 'https://de.wikipedia.org/wiki/Trockenbau' },
          { title: 'Gipskarton', url: 'https://de.wikipedia.org/wiki/Gipskarton' },
          { title: 'Estrich', url: 'https://de.wikipedia.org/wiki/Estrich' },
          { title: 'Trittschall', url: 'https://de.wikipedia.org/wiki/Trittschall' }
        ]}
        literatur={inhalt.daten["Innenausbau.literatur"]}
        regelwerke={inhalt.daten["Innenausbau.regelwerke"]}
        formeln={inhalt.daten["Innenausbau.formeln"]}
      />
    </div>
  );
}
