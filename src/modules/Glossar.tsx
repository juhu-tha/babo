import React, { useState, useMemo } from 'react';
import { BookOpen, Search, X, Hash } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/glossar/Glossar.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface GlossaryEntry {
  term: string;
  category: string;
  definition: string;
  unit?: string;
  standards?: string;
}

export const GLOSSARY_TERMS: GlossaryEntry[] = inhalt.daten.GLOSSARY_TERMS;

export default function Glossar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Alle');

  const categories = useMemo(() => {
    return ['Alle', ...Array.from(new Set(GLOSSARY_TERMS.map(t => t.category)))].sort();
  }, []);

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter(term => {
      const termLower = term.term.toLowerCase();
      const defLower = term.definition.toLowerCase();
      const catLower = term.category.toLowerCase();
      const queryLower = searchTerm.toLowerCase();

      const matchesSearch = termLower.includes(queryLower) || 
                            defLower.includes(queryLower) ||
                            catLower.includes(queryLower) ||
                            (term.standards && term.standards.toLowerCase().includes(queryLower));

      const matchesCategory = activeCategory === 'Alle' || term.category === activeCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.term.localeCompare(b.term, 'de'));
  }, [searchTerm, activeCategory]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-shiraz/10 rounded-xl text-shiraz">
              <BookOpen size={26} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.fachglossarDerBaustoffkundeWerkstofftech} /></h2>
              <p className="text-xs text-text-main/70 mt-0.5"><MdText text={inhalt.texte.umfassendesFachlexikonMit} />{GLOSSARY_TERMS.length}<MdText text={inhalt.texte.ingenieurtechnischenBegriffenFormelzeich} /></p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-off-white px-3 py-1.5 rounded-lg border border-home-grau/25 text-xs text-text-main/80 shrink-0 self-start sm:self-auto">
            <Hash size={14} className="text-shiraz" />
            <span>Gefiltert: <strong>{filteredTerms.length}</strong> von {GLOSSARY_TERMS.length}</span>
          </div>
        </div>
        
        {/* Search & Category Filter Controls */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-home-grau" size={18} />
            <input 
              type="text" 
              placeholder={inhalt.werte.begriffNormZB} 
              className="w-full pl-10 pr-10 py-2.5 border border-home-grau/30 rounded-xl focus:outline-none focus:border-shiraz focus:ring-1 focus:ring-shiraz bg-off-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-home-grau hover:text-shiraz p-1 rounded-full"
                title={inhalt.werte.suchenSieZurücksetzen}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Chips Bar */}
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 hide-scrollbar">
            {categories.map(category => {
              const count = category === 'Alle' 
                ? GLOSSARY_TERMS.length 
                : GLOSSARY_TERMS.filter(t => t.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                    activeCategory === category 
                      ? 'bg-shiraz text-white border-shiraz shadow-xs font-semibold' 
                      : 'bg-off-white text-text-main/80 hover:bg-home-grau/15 border-home-grau/25 hover:text-text-main'
                  }`}
                >
                  <span>{category}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeCategory === category ? 'bg-white/20 text-white' : 'bg-home-grau/20 text-text-main/70'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Glossary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((item, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-xl border border-home-grau/20 bg-off-white hover:border-shiraz/40 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-text-main text-sm leading-tight">{item.term}</h3>
                    <span className="text-[10px] font-medium px-2 py-0.5 bg-white rounded-md border border-home-grau/20 text-text-main/70 whitespace-nowrap shrink-0">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-text-main/80 mb-3 leading-relaxed">
                    {item.definition}
                  </p>
                </div>

                <div className="pt-2 border-t border-home-grau/15 flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
                  {item.unit && item.unit !== '-' ? (
                    <div className="text-text-main/70 bg-white px-2 py-0.5 rounded border border-home-grau/15">
                      Einheit: <span className="font-mono font-semibold text-text-main">{item.unit}</span>
                    </div>
                  ) : (
                    <div />
                  )}
                  {item.standards && (
                    <div className="text-shiraz font-medium bg-shiraz/5 px-2 py-0.5 rounded border border-shiraz/20 truncate max-w-[180px]" title={item.standards}>
                      {item.standards}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-12 text-center text-text-main/70 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
              <p className="font-semibold text-base"><MdText text={inhalt.texte.keineFachbegriffeGefunden} /></p>
              <p className="text-xs"><MdText text={inhalt.texte.fürDenSuchbegriff} />{searchTerm}<MdText text={inhalt.texte.undDieKategorie} />{activeCategory}<MdText text={inhalt.texte.liegenKeineEinträgeVor} /></p>
              <button
                onClick={() => { setSearchTerm(''); setActiveCategory('Alle'); }}
                className="mt-3 px-4 py-2 bg-shiraz text-white text-xs font-bold rounded-lg hover:bg-shiraz/90 transition-all cursor-pointer"
              ><MdText text={inhalt.texte.filterZurücksetzen} /></button>
            </div>
          )}
        </div>
      </div>

      {/* Module Footer with Norms, Literature and Math Formulas */}
      <ModuleFooter
        wikipedia={[
          { title: 'Glossar', url: 'https://de.wikipedia.org/wiki/Glossar' },
          { title: 'Baustoff', url: 'https://de.wikipedia.org/wiki/Baustoff' },
          { title: 'Werkstoffprüfung', url: 'https://de.wikipedia.org/wiki/Werkstoffpr%C3%BCfung' },
          { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' }
        ]}
        literatur={inhalt.daten["Glossar.literatur"]}
        regelwerke={inhalt.daten["Glossar.regelwerke"]}
        weblinks={inhalt.daten["Glossar.weblinks"]}
        formeln={inhalt.daten["Glossar.formeln"]}
      />
    </div>
  );
}
