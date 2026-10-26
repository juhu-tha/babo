import type { LucideIcon } from 'lucide-react';
import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { 
  FileText, ShieldCheck, Scale, AlertTriangle, FileSignature, CheckCircle, Globe, 
  Building, ShieldAlert, Briefcase, Leaf, Search, ArrowUpRight, ClipboardCheck,
  Award, BookOpen
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { useTabContext } from '@/src/contexts/TabContext';
import { getNormsByCategory } from '@/src/data/centralNormenRegistry';
import inhalt from '@/content/regularien/Regularien.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

const REGELUNGS_HIERARCHIE_DATA = inhalt.daten.REGELUNGS_HIERARCHIE_DATA;

const levelIcons: Record<string, LucideIcon> = {
  globe: Globe,
  scale: Scale,
  building: Building,
  briefcase: Briefcase,
  shieldAlert: ShieldAlert,
  fileText: FileText,
  fileSignature: FileSignature,
  award: Award,
};

export default function Regularien() {
  const [activeTab, setActiveTab] = useState<'hierarchie' | 'katalog' | 'normen'>('hierarchie');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [hierarchySearchTerm, setHierarchySearchTerm] = useState('');
  const { setActiveTab: setGlobalActiveTab } = useTabContext();

  // Filtering norms dynamically from Central SSOT Registry
  const allNormCategories = getNormsByCategory();
  const filteredNormenData = allNormCategories.map(group => {
    const norms = group.norms.filter(norm => 
      norm.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      norm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      norm.beschreibung.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...group, norms };
  }).filter(group => group.norms.length > 0);

  // Filtering regulations hierarchy based on search term
  const filteredHierarchy = REGELUNGS_HIERARCHIE_DATA.map(level => {
    const term = hierarchySearchTerm.toLowerCase().trim();
    if (!term) {
      return { ...level, hasMatches: true, matchedItems: level.items };
    }

    const levelMatches = 
      level.title.toLowerCase().includes(term) || 
      level.subtitle.toLowerCase().includes(term) || 
      level.scope.toLowerCase().includes(term) || 
      level.summary.toLowerCase().includes(term) ||
      level.detailDesc.toLowerCase().includes(term) ||
      level.bindingForce.toLowerCase().includes(term);

    const matchedItems = level.items.filter(item => 
      item.name.toLowerCase().includes(term) ||
      item.abbreviation.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.impact.toLowerCase().includes(term) ||
      item.regulatoryLevel.toLowerCase().includes(term)
    );

    if (levelMatches || matchedItems.length > 0) {
      return {
        ...level,
        matchedItems: levelMatches ? level.items : matchedItems,
        hasMatches: true
      };
    }
    return { ...level, matchedItems: [], hasMatches: false };
  }).filter(level => level.hasMatches);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
            <Scale size={24} />
          </div>
          <h2 className="text-2xl font-bold text-text-main"><MdText text={inhalt.texte.regulativesImBauwesen} /></h2>
        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.baustoffeUndBauprodukteUnterliegen} /></p>
        </div>

        <ModuleTabs
          label={inhalt.werte.bereicheRegularien}
          tabs={[
            { id: 'hierarchie' as const, label: inhalt.texte.hierarchieAllerRegelungen, icon: Scale },
            { id: 'katalog' as const, label: inhalt.texte.grundbegriffeBauaufsicht, icon: Building },
            { id: 'normen' as const, label: inhalt.texte.technischeNormenKatalog, icon: ClipboardCheck },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="flex flex-col gap-6"
        >

        {/* Tab 0: Hierarchie der Regelungen */}
        {activeTab === 'hierarchie' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-text-main uppercase tracking-wider flex items-center gap-2">
                    <BookOpen size={16} className="text-shiraz" /><MdText text={inhalt.texte.stufenbauDerRechtsordnungIm} /></h3>
                  <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.suchenSieNachBestimmten} /></p>
                </div>
                
                {/* Search Bar for hierarchy */}
                <div className="relative w-full md:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-home-grau">
                    <Search size={14} />
                  </div>
                  <input
                    type="text"
                    placeholder={inhalt.werte.regelungenDurchsuchen}
                    value={hierarchySearchTerm}
                    onChange={(e) => setHierarchySearchTerm(e.target.value)}
                    className="w-full bg-white border border-home-grau/30 rounded-lg pl-9 pr-4 py-1.5 text-xs text-text-main placeholder:text-home-grau focus:ring-1 focus:ring-shiraz focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {hierarchySearchTerm.trim() === '' ? (
              // Split screens layout (Pyramid left / Details right)
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Hierarchical selection column */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="p-1 text-[10px] font-bold text-home-grau uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.stufeDerRechtspyramideWählen} /></div>
                  
                  <div className="flex flex-col gap-2.5">
                    {REGELUNGS_HIERARCHIE_DATA.map((level) => {
                      const IconComponent = levelIcons[level.icon] || FileText;
                      const isSelected = selectedLevel === level.level;
                      
                      return (
                        <button
                          key={level.level}
                          onClick={() => setSelectedLevel(level.level)}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 transform ${
                            isSelected
                              ? 'bg-white border-shiraz shadow-md ring-2 ring-shiraz/20 scale-[1.01]'
                              : 'bg-slate-50/50 hover:bg-slate-55 border-home-grau/20 hover:border-home-grau/35'
                          }`}
                        >
                          <div className={`p-2.5 rounded-lg shrink-0 flex items-center justify-center ${
                            isSelected ? 'bg-shiraz/10 text-shiraz' : 'bg-slate-200/60 text-slate-550'
                          }`}>
                            <IconComponent size={20} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-[10px] uppercase font-bold tracking-wider ${
                                isSelected ? 'text-shiraz' : 'text-slate-500'
                              }`}>
                                Stufe {formatDeWert(level.level)}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${level.badgeColor}`}>
                                {level.scope}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-xs text-text-main leading-tight mt-1 truncate">
                              {level.title.replace(/^\d+\.\s+/, '')}
                            </h4>
                            <p className="text-[11px] text-text-main/60 mt-0.5 line-clamp-1">
                              {level.subtitle}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-4 bg-orange-50/40 border border-orange-200 rounded-xl space-y-2 mt-4 text-xs text-slate-700">
                    <span className="font-bold flex items-center gap-1.5 text-orange-950">
                      <AlertTriangle size={14} className="text-orange-700" /><MdText text={inhalt.texte.derGoldeneGrundsatzD} /></span>
                    <p className="text-[11px] leading-relaxed"><MdText text={inhalt.texte.höherrangigesRechtGehtDem} /></p>
                  </div>
                </div>

                {/* Details view column */}
                <div className="lg:col-span-7 bg-white p-6 border border-home-grau/35 rounded-2xl space-y-6">
                  {(() => {
                    const level = REGELUNGS_HIERARCHIE_DATA.find(l => l.level === selectedLevel)!;
                    const IconComponent = levelIcons[level.icon] || FileText;
                    
                    return (
                      <div className="space-y-6">
                        <div className="border-b border-home-grau/20 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] bg-slate-100 text-slate-700 border border-home-grau/20 px-2 py-0.5 rounded font-mono font-bold">
                                Stufe {formatDeWert(level.level)} von 6
                              </span>
                              <span className={`text-[10px] uppercase font-bold tracking-wider ${level.badgeColor} px-2 py-0.5 rounded`}>
                                {level.scope}
                              </span>
                            </div>
                            <h3 className="text-lg font-black text-text-main flex items-center gap-2 mt-1.5">
                              <IconComponent size={22} className="text-shiraz shrink-0" />
                              {level.title}
                            </h3>
                            <p className="text-xs text-text-main/55 font-medium italic">
                              {level.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Summary Block */}
                        <p className="text-xs text-text-main/80 leading-relaxed font-medium">
                          {level.summary}
                        </p>

                        {/* Legal force disclaimer box */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold block"><MdText text={inhalt.texte.rechtlicheVerbindlichkeitWirkungskraft} /></span>
                          <p className="text-xs font-semibold text-text-main leading-relaxed">
                            {level.bindingForce}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="font-bold text-xs text-text-main uppercase tracking-wider block mb-3"><MdText text={inhalt.texte.maßgebendeVerordnungenGesetzeRichtlinien} /></span>

                          <div className="space-y-4">
                            {level.items.map((item, idx) => (
                              <div key={idx} className="bg-white border border-home-grau/25 rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow">
                                <div className="bg-slate-50 px-4 py-3 border-b border-home-grau/15 flex flex-wrap items-center justify-between gap-2">
                                  <div className="space-y-0.5">
                                    <h4 className="font-bold text-xs text-text-main flex items-center gap-1.5 leading-tight">
                                      {item.name}
                                    </h4>
                                    {item.abbreviation && (
                                      <span className="font-mono text-[10px] text-home-grau font-semibold">
                                        Kürzel: {item.abbreviation}
                                      </span>
                                    )}
                                  </div>
                                  <span className="bg-shiraz/5 text-shiraz border border-shiraz/20 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                                    {item.regulatoryLevel}
                                  </span>
                                </div>

                                <div className="p-4 space-y-3">
                                  <p className="text-xs text-text-main/75 leading-relaxed">
                                    {item.description}
                                  </p>

                                  <div className="bg-stone-50 border border-stone-150 p-3 rounded-lg space-y-1 text-xs">
                                    <span className="text-[9px] uppercase text-stone-500 font-extrabold tracking-wider flex items-center gap-1">
                                      <ShieldAlert size={12} className="text-shiraz" /><MdText text={inhalt.texte.konkretePraxisrelevanzFürDas} /></span>
                                    <p className="text-text-main/80 text-[11px] leading-relaxed">
                                      {item.impact}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    );
                  })()}
                </div>

              </div>
            ) : (
              // Search active state layout (Search results)
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-home-grau/20 pb-2.5">
                  <span className="text-xs font-bold text-text-main flex items-center gap-2">
                    <Search size={14} /><MdText text={inhalt.texte.suchergebnisseFür} />{hierarchySearchTerm}“ ({filteredHierarchy.length} Treffer)
                  </span>
                  
                  <button
                    onClick={() => setHierarchySearchTerm('')}
                    className="text-shiraz hover:underline text-xs font-bold"
                  ><MdText text={inhalt.texte.sucheZurücksetzen} /></button>
                </div>

                {filteredHierarchy.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-home-grau/20 rounded-2xl bg-white text-home-grau text-xs"><MdText text={inhalt.texte.keineRegelungenOderVerordnungen} /><strong>„{hierarchySearchTerm}“</strong><MdText text={inhalt.texte.inDerHierarchieGefunden} /><span className="block mt-2 text-slate-400"><MdText text={inhalt.texte.tippSuchenSieNach} /></span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredHierarchy.map((level) => {
                      const IconComponent = levelIcons[level.icon] || FileText;
                      return (
                        <div key={level.level} className="bg-white border border-home-grau/30 rounded-2xl overflow-hidden shadow-sm">
                          {/* Level Banner */}
                          <div className="bg-slate-50 px-5 py-3.5 border-b border-home-grau/20 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 rounded-lg bg-shiraz/10 text-shiraz shrink-0">
                                <IconComponent size={16} />
                              </div>
                              <div>
                                <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-home-grau block leading-none">
                                  Stufe {formatDeWert(level.level)} ({level.scope})
                                </span>
                                <h4 className="font-extrabold text-sm text-text-main mt-0.5">
                                  {level.title}
                                </h4>
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${level.badgeColor}`}>
                              {level.scope}
                            </span>
                          </div>

                          <div className="p-5 space-y-4">
                            <p className="text-xs text-text-main/70 leading-relaxed max-w-4xl">
                              {level.detailDesc}
                            </p>

                            <div className="divide-y divide-home-grau/10">
                              {level.matchedItems && level.matchedItems.map((item, idx) => (
                                <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-2">
                                  <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <h5 className="font-extrabold text-xs text-text-main flex items-center gap-2">
                                      {item.name}
                                      {item.abbreviation && (
                                        <span className="font-mono text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-home-grau/15">
                                          {item.abbreviation}
                                        </span>
                                      )}
                                    </h5>
                                    <span className="text-[10px] bg-shiraz/5 text-shiraz font-bold border border-shiraz/20 px-2 py-0.5 rounded">
                                      {item.regulatoryLevel}
                                    </span>
                                  </div>

                                  <p className="text-xs text-text-main/75 transition-colors leading-relaxed">
                                    {item.description}
                                  </p>

                                  <div className="bg-stone-50 border border-stone-150 p-3 rounded-xl space-y-1 text-xs">
                                    <span className="text-[9px] uppercase text-stone-500 font-extrabold tracking-wider flex items-center gap-1">
                                      <ShieldAlert size={12} className="text-shiraz" />
                                      Praxisrelevanz:
                                    </span>
                                    <p className="text-slate-800 text-[11px] leading-relaxed">
                                      {item.impact}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 1: Grundbegriffe & Gesetzliche Regularien (Katalog) */}
        {activeTab === 'katalog' && (

          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Section 1: Normung & Technikstandards */}
            <div className="mt-2">
              <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                <FileText className="text-shiraz" size={20} /><MdText text={inhalt.texte.normungTechnikstandards} /></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Normen */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-slate-100 text-slate-700 p-2 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.normenRichtlinien} /></h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.isoInternationaleNormenWeltweit} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.hierarchieIsoUndEn} /></div>
                </div>

                {/* Technikklauseln */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-orange-100 text-orange-700 p-2 rounded-lg">
                      <Scale size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">Technikklauseln</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.allgemeinAnerkannteRegelnDer} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.relevanzDieArdtSind} /></div>
                </div>
              </div>
            </div>

            {/* Section 2: Europäisches Recht (BauPVO) */}
            <div className="mt-4">
              <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                <Globe className="text-shiraz" size={20} /><MdText text={inhalt.texte.europäischesRechtBaupvo} /></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* BauPVO */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">
                      <Scale size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.baupvoBauproduktenverordnung} /></h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.baupvoEu20243110} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.zielAbbauVonHandelshemmnissen} /></div>
                </div>

                {/* hEN */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 text-purple-700 p-2 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.henHarmonisierteNorm} /></h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.eineVonEuropäischenNormungsorganisatione} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.funktionSieBildetDie} /></div>
                </div>

                {/* ETA */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-cyan-100 text-cyan-700 p-2 rounded-lg">
                      <ShieldCheck size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.etaEuropäischeTechnischeBewertung} /></h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.europeanTechnicalAssessmentEin} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.funktionErmöglichtDieCe} /></div>
                </div>

                {/* DoP */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                      <FileSignature size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.dopLeistungserklärung} /></h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.declarationOfPerformanceEin} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.voraussetzungOhneDopDarf} /></div>
                </div>

                {/* CE-Kennzeichnung */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                      <CheckCircle size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">CE-Kennzeichnung</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.conformitEuropEnneBestätigt} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.wichtigDasCeZeichen} /></div>
                </div>
              </div>
            </div>

            {/* Section 3: Nationales Baurecht (Deutschland) */}
            <div className="mt-4">
              <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                <Building className="text-shiraz" size={20} /><MdText text={inhalt.texte.nationalesBaurechtDeutschland} /></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* MBO & LBO */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                      <Building size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">MBO &amp; LBO</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.musterbauordnungMboMustergesetzDer} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.wichtigBaurechtIstLändersache} /></div>
                </div>

                {/* GEG */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                      <Leaf size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.gmodgVormalsGeg} /></h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.dasGebäudeenergiegesetz2020Zusammenführu} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.fokusBegrenzungDesPrimärenergiebedarfs} /></div>
                </div>

                {/* VV TB */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-stone-100 text-stone-700 p-2 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">VV TB</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.verwaltungsvorschriftTechnischeBaubestim} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.relevanzVerbindlicheVorgabeDer} /></div>
                </div>

                {/* aBZ / abG */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-amber-100 text-amber-700 p-2 rounded-lg">
                      <ShieldCheck size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">abZ / aBG</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.abzAllgemeineBauaufsichtlicheZulassung} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.nationalDErteiltVom} /></div>
                </div>

                {/* Ü-Zeichen */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-rose-100 text-rose-700 p-2 rounded-lg">
                      <CheckCircle size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">Ü-Zeichen</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.übereinstimmungszeichenBestätigtDieÜbere} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.funktionDasNationalePendant} /></div>
                </div>

                {/* ZiE */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-torch-red/10 text-torch-red p-2 rounded-lg">
                      <AlertTriangle size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">ZiE / vBG</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.zieZustimmungImEinzelfall} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.gültigkeitStrengObjektbezogenUnd} /></div>
                </div>

                {/* abP */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                      <ShieldCheck size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">abP</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.allgemeinesBauaufsichtlichesPrüfzeugnisF} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.nachweisWirdVonEiner} /></div>
                </div>

                {/* VOB */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">
                      <FileSignature size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">VOB</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.vergabeUndVertragsordnungFür} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.relevanzÖffentlicheAuftraggeberMüssen} /></div>
                </div>

                {/* BauGB & BauNVO */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-sans-gray text-indigo-700 p-2 rounded-lg">
                      <Globe size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.baugbBaunvo} /></h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.baugesetzbuchBaunutzungsverordnungDasFun} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.unterschiedBauplanungsrechtRegeltDas} /></div>
                </div>

                {/* BGB Werkvertrag */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gray-100 text-gray-700 p-2 rounded-lg">
                      <FileSignature size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">BGB-Werkvertragsrecht</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.t631FfBgbDas} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.verhältnisZurVobB} /></div>
                </div>
              </div>
            </div>

            {/* Section 4: Vergabe- und Vertragsrecht */}
            <div className="mt-4">
              <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                <Briefcase className="text-shiraz" size={20} /><MdText text={inhalt.texte.vergabeVertragsPlanungsrechtVob} /></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* VOB/A */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">VOB/A</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.vergabeVonBauleistungenRegelt} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.fokusTransparenzWettbewerbUnd} /></div>
                </div>

                {/* VOB/B */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">
                      <Scale size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">VOB/B</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.vertragsbedingungenRegeltDieAllgemeinen} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.fokusBauausführungKooperativeStreitbeile} /></div>
                </div>

                {/* VOB/C */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                      <Building size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">VOB/C (ATV)</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.allgemeineTechnischeVertragsbedingungenS} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.fokusAbrechnungsregelnMessenAbziehen} /></div>
                </div>

                {/* HOAI */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-amber-100 text-amber-700 p-2 rounded-lg">
                      <Scale size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">HOAI</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.honorarordnungFürArchitektenUnd} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.wichtigSeitDemEugh} /></div>
                </div>

                {/* Gewährleistungsfristen */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-red-100 text-red-700 p-2 rounded-lg">
                      <ShieldCheck size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.verjährungVonMängelansprüchenBgb} /></h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.verjährungsfristenFürMängelansprücheBei} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.hemmungUndVerlängerungNach} /></div>
                </div>

                {/* DIN 276 */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 text-purple-700 p-2 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.kostenImBauwesenDin} /></h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.normierteGliederungDerKosten} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.relevanzBildetZusammenMit} /></div>
                </div>
              </div>
            </div>

            {/* Section 5: Umwelt, Sicherheit & Nachhaltigkeit */}
            <div className="mt-4">
              <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                <ShieldAlert className="text-shiraz" size={20} /><MdText text={inhalt.texte.umweltSicherheitNachhaltigkeitGreen} /></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SDB */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-teal-100 text-teal-700 p-2 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.sdbSicherheitsdatenblatt} /></h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.safetyDataSheetEin} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.zielgruppeRichtetSichPrimär} /></div>
                </div>

                {/* TRGS */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-orange-100 text-orange-700 p-2 rounded-lg">
                      <AlertTriangle size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.trgsGefahrstoffe} /></h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.technischeRegelnFürGefahrstoffe} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.beispielTrgs559Quarzhaltiger} /></div>
                </div>

                {/* KrWG & ErsatzbaustoffV */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                      <Leaf size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.krwgErsatzbaustoffv} /></h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.kreislaufwirtschaftsgesetzVerpflichtetBa} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.zielFörderungVonKreislauffähigem} /></div>
                </div>

                {/* AwSV */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-cyan-100 text-cyan-700 p-2 rounded-lg">
                      <ShieldCheck size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.awsvGewässerschutz} /></h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.anlagenverordnungWassergefährdendeStoffe} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.relevanzWichtigBeiDer} /></div>
                </div>

                {/* Green Building Zertifikate */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                      <Leaf size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.greenBuildingDgnbLeed} /></h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.internationaleUndNationaleBewertungssyst} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/85 border border-home-grau/30"><MdText text={inhalt.texte.dgnbDDeutscheGesellschaft} /></div>
                </div>

                {/* QNG */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                      <CheckCircle size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.qngQualitätssiegelNachhaltigesGebäude} /></h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.einStaatlichesDeutschesGütesiegel} /></p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30"><MdText text={inhalt.texte.förderungImKfwProgramm} /></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Aggregated Key Standards Registry (Die wichtigsten Normen) */}
        {activeTab === 'normen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Search and Guidance */}
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="max-w-xl text-xs text-text-main/80">
                <p className="font-semibold text-text-main mb-1"><MdText text={inhalt.texte.gewerkübergreifendesNormenverzeichnisDes} /></p>
                <p><MdText text={inhalt.texte.suchenSieGezieltNach} /></p>
              </div>

              {/* Interactive Search Bar widget */}
              <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-home-grau">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  placeholder={inhalt.werte.suchenNachStandardCode}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-home-grau/30 rounded-lg pl-9 pr-4 py-2 text-sm text-text-main placeholder:text-home-grau focus:ring-1 focus:ring-shiraz focus:outline-none"
                />
              </div>
            </div>

            {/* Normen Content Rendering */}
            {filteredNormenData.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-home-grau/30 rounded-xl bg-white text-home-grau text-sm"><MdText text={inhalt.texte.keinePassendenNormenFür} /><strong>„{searchTerm}“</strong><MdText text={inhalt.texte.gefundenProbierenSieAndere} /></div>
            ) : (
              <div className="space-y-8">
                {filteredNormenData.map((categoryGroup, catIndex) => (
                  <div key={catIndex} className="bg-white rounded-xl border border-home-grau/30 overflow-hidden">
                    <h3 className="bg-off-white px-5 py-3.5 border-b border-home-grau/30 font-bold text-text-main text-base flex items-center justify-between">
                      <span>{categoryGroup.category}</span>
                      <span className="text-xs bg-shiraz/10 text-shiraz px-2 py-0.5 rounded-full font-medium">
                        {categoryGroup.norms.length} {categoryGroup.norms.length === 1 ? 'Norm' : 'Normen'}
                      </span>
                    </h3>

                    <div className="divide-y divide-home-grau/10">
                      {categoryGroup.norms.map((norm) => (
                        <div key={norm.id} className="p-5 hover:bg-slate-50/40 transition-colors flex flex-col md:flex-row md:items-start gap-4">
                          <div className="flex-shrink-0 flex md:flex-col items-start gap-1.5">
                            <span className="inline-block bg-slate-100 border border-home-grau/30 text-slate-700 font-mono text-xs font-bold px-2.5 py-1 rounded">
                              {norm.code}
                            </span>
                            {norm.status === 'ersetzt' ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-shiraz/10 text-shiraz border border-shiraz/20" title={norm.ersetztDurch ? `Ersetzt durch ${norm.ersetztDurch}` : undefined}><MdText text={inhalt.texte.zurückgezogen} />{norm.ausgabeStand})
                              </span>
                            ) : norm.status === 'in_ueberarbeitung' ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200"><MdText text={inhalt.texte.übergangNeueFassung} />{norm.ausgabeStand})
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Gültig ({norm.ausgabeStand})
                              </span>
                            )}
                          </div>
                          
                          <div className="flex-1 flex flex-col gap-1">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <h4 className="font-bold text-text-main text-sm flex items-center gap-1.5 leading-tight">
                                {norm.title}
                              </h4>
                              {norm.url && (
                                <a
                                  href={norm.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-bold text-shiraz hover:underline inline-flex items-center gap-1"
                                >
                                  DIN Media <ArrowUpRight size={13} />
                                </a>
                              )}
                            </div>
                            <p className="text-xs text-text-main/75 mt-1 leading-relaxed">
                              {norm.beschreibung}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </ModuleTabs>


      </div>

      <ModulTest moduleId="regularien" />

      <ModuleFooter 
        wikipedia={[
          { title: inhalt.werte.baurechtDeutschland, url: 'https://de.wikipedia.org/wiki/Baurecht_(Deutschland)' },
          { title: 'Bauordnungsrecht', url: 'https://de.wikipedia.org/wiki/Bauordnungsrecht' },
          { title: 'Bauproduktenverordnung', url: 'https://de.wikipedia.org/wiki/Bauproduktenverordnung' }
        ]}
        regelwerke={inhalt.daten["Regularien.regelwerke"]}
        literatur={inhalt.daten["Regularien.literatur"]}
        formeln={inhalt.daten["Regularien.formeln"]}
        lastReviewed={inhalt.werte.oktober2026Ap3}
      />
    </div>
  );
}
