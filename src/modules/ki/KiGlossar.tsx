import type { LucideIcon } from 'lucide-react';
import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Code, 
  Server, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  ArrowRight,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { useTabContext, TabId } from '@/src/contexts/TabContext';
import inhalt from '@/content/ki/KiGlossar.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';

export interface GlossarEntry {
  id: string;
  term: string;
  shortName: string;
  badge: string;
  category: 'core' | 'architecture' | 'practice';
  icon: LucideIcon;
  oneLiner: string;
  analogy: string;
  constructionUse: string;
  deepDiveTab?: TabId;
  deepDiveLabel?: string;
}

export const GLOSSAR_ENTRIES: GlossarEntry[] = [
  {
    id: 'llm',
    term: inhalt.werte.largeLanguageModelLlm,
    shortName: 'LLM',
    badge: inhalt.werte.großesSprachmodell,
    category: 'core',
    icon: Sparkles,
    oneLiner: inhalt.werte.einKünstlichesNeuronalesNetz,
    analogy: inhalt.werte.wieEinHochbelesenerAssistent,
    constructionUse: inhalt.werte.entwurfVonVobBedenkenanzeigen,
    deepDiveTab: 'ki_llmpraxis',
    deepDiveLabel: inhalt.werte.zurLlmPraxis
  },
  {
    id: 'rag',
    term: inhalt.werte.retrievalAugmentedGenerationRag,
    shortName: 'RAG',
    badge: inhalt.werte.quellengestützteGenerierung,
    category: 'architecture',
    icon: Layers,
    oneLiner: inhalt.werte.eineMethodeBeiDer,
    analogy: inhalt.werte.wieEinePrüfungMit,
    constructionUse: inhalt.werte.verlässlicheHalluzinationsfreieBefragung,
    deepDiveTab: 'ki_system',
    deepDiveLabel: inhalt.werte.zumRagDemonstrator
  },
  {
    id: 'prompt_engineering',
    term: 'Prompt-Engineering',
    shortName: 'Prompt-Engineering',
    badge: inhalt.werte.präziseArbeitsanweisung,
    category: 'practice',
    icon: Terminal,
    oneLiner: inhalt.werte.dieGezielteFormulierungVon,
    analogy: inhalt.werte.wieEinPräzisesLeistungsverzeichnis,
    constructionUse: inhalt.werte.vermeidungVonOberflächlichemBla,
    deepDiveTab: 'ki_prompting',
    deepDiveLabel: inhalt.werte.zumPromptOptimierer
  },
  {
    id: 'vibe_coding',
    term: 'Vibe Coding',
    shortName: 'Vibe Coding',
    badge: inhalt.werte.kiGeführtesProgrammieren,
    category: 'practice',
    icon: Code,
    oneLiner: inhalt.werte.einModernerEntwicklungsansatzBei,
    analogy: inhalt.werte.wieEinErfahrenerBauleiter,
    constructionUse: inhalt.werte.bauenEigenerMiniTools,
    deepDiveTab: 'ki_ueberblick',
    deepDiveLabel: inhalt.werte.zumKiÜberblickGrundlagen
  },
  {
    id: 'mcp_server',
    term: inhalt.werte.modelContextProtocolMcp,
    shortName: 'MCP-Server',
    badge: inhalt.werte.universelleWerkzeugSchnittstelle,
    category: 'architecture',
    icon: Server,
    oneLiner: inhalt.werte.einOffenerIndustriestandardWie,
    analogy: inhalt.werte.wieEineStandardisierteSchnellwechsel,
    constructionUse: inhalt.werte.mcpClientsKoennen,
    deepDiveTab: 'ki_llmpraxis',
    deepDiveLabel: inhalt.werte.zuMcpKonnektoren
  },
  {
    id: 'halluzination',
    term: inhalt.werte.halluzinationFehlerrisiko,
    shortName: 'Halluzination',
    badge: inhalt.werte.verlässlichkeitHaftung,
    category: 'core',
    icon: ShieldCheck,
    oneLiner: inhalt.werte.wennEinSprachmodellFakten,
    analogy: inhalt.werte.wieEinPraktikantDer,
    constructionUse: inhalt.werte.bauingenieureHaftenPersönlichNach,
    deepDiveTab: 'ki_recht_ethik',
    deepDiveLabel: inhalt.werte.zuRechtEthikHaftung
  }
];

interface KiGlossarProps {
  initialExpanded?: boolean;
}

export default function KiGlossar({ initialExpanded = true }: KiGlossarProps) {
  const { setActiveTab } = useTabContext();
  const [isExpanded, setIsExpanded] = useState<boolean>(initialExpanded);
  const [selectedTermId, setSelectedTermId] = useState<string>('llm');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedEntry = GLOSSAR_ENTRIES.find(e => e.id === selectedTermId) || GLOSSAR_ENTRIES[0];

  const filteredEntries = GLOSSAR_ENTRIES.filter(e => 
    e.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.oneLiner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.constructionUse.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-home-grau/30 shadow-sm overflow-hidden mb-6 transition-all duration-200">
      
      {/* HEADER / TOGGLE BAR */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-off-white to-slate-50 border-b border-home-grau/20 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-shiraz/10 text-shiraz flex items-center justify-center shrink-0">
            <BookOpen size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm text-slate-800"><MdText text={inhalt.texte.interaktivesEinsteigerGlossarDie} /></h3>
              <span className="text-xxs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200"><MdText text={inhalt.texte.hemmschwellenSenken} /></span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.llmRagPromptingVibe} /></p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs font-medium hidden sm:inline text-slate-500">
            {isExpanded ? 'Einklappen' : inhalt.werte.begriffeAnzeigen}
          </span>
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </div>

      {/* EXPANDED CONTENT */}
      {isExpanded && (
        <div className="p-4 sm:p-6 animate-in fade-in duration-200 space-y-5">
          
          {/* SCHNELLAUSWAHL-CHIPS & SUCHE */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <AuswahlGruppe label="Begriff" className="flex flex-wrap gap-1.5">
              {GLOSSAR_ENTRIES.map(entry => {
                const IconComponent = entry.icon;
                const isSelected = selectedTermId === entry.id;
                return (
                  <button {...alsOption(isSelected)}
                    key={entry.id}
                    onClick={() => setSelectedTermId(entry.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                      isSelected
                        ? 'bg-shiraz text-white border-shiraz shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <IconComponent size={13} className={isSelected ? 'text-white' : 'text-slate-500'} />
                    <span>{entry.shortName}</span>
                  </button>
                );
              })}
            </AuswahlGruppe>

            {/* KLEINES SUCHFELD */}
            <div className="relative min-w-[180px]">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={inhalt.werte.begriffSuchen}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-shiraz bg-white text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          {/* DETAIL-KARTE DES AKTIVEN BEGRIFFS */}
          <div className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-5 space-y-4">
            
            {/* OBERE ZEILE: TITEL & BADGE */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center shrink-0">
                  <selectedEntry.icon size={16} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {selectedEntry.term}
                  </h4>
                  <span className="text-xxs font-semibold text-slate-500">
                    Kategorie: {selectedEntry.badge}
                  </span>
                </div>
              </div>

              {selectedEntry.deepDiveTab && (
                <button
                  onClick={() => setActiveTab(selectedEntry.deepDiveTab as TabId)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-shiraz hover:text-shiraz/80 self-start sm:self-auto bg-white px-3 py-1.5 rounded-lg border border-home-grau/30 shadow-2xs hover:shadow-xs cursor-pointer transition-all"
                >
                  <span>{selectedEntry.deepDiveLabel || inhalt.werte.mehrErfahren}</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>

            {/* 1-SATZ DEFINITION */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1"><MdText text={inhalt.texte.kompakteDefinition} /></span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {selectedEntry.oneLiner}
              </p>
            </div>

            {/* ZWEI SPALTEN: ANALOGIE & BAU-NUTZEN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              
              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xxs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
                    <Lightbulb size={13} className="text-amber-600" /><MdText text={inhalt.texte.anschaulicheIngenieurAnalogie} /></div>
                  <p className="text-xs text-amber-950/80 leading-relaxed">
                    {selectedEntry.analogy}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xxs font-bold text-emerald-900 uppercase tracking-wider mb-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" /><MdText text={inhalt.texte.konkreterPraxisNutzenIm} /></div>
                  <p className="text-xs text-emerald-950/80 leading-relaxed">
                    {selectedEntry.constructionUse}
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* SCHNELLE GRID-ÜBERSICHT ALLER 5 BEGRIFFE FÜR SCHNELL-LESER */}
          <div className="pt-2 border-t border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2"><MdText text={inhalt.texte.schnellSpickzettelAufEinen} /></span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {GLOSSAR_ENTRIES.map(e => (
                <div 
                  key={e.id}
                  onClick={() => setSelectedTermId(e.id)}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    selectedTermId === e.id
                      ? 'bg-shiraz/5 border-shiraz ring-1 ring-shiraz/30 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={`block font-bold text-xs ${selectedTermId === e.id ? 'text-shiraz' : 'text-slate-800'}`}>
                    {e.shortName}
                  </span>
                  <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {e.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
