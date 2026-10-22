import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  Cpu, 
  Code, 
  Server, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  ArrowRight,
  ExternalLink,
  Lightbulb,
  CheckCircle2,
  Workflow
} from 'lucide-react';
import { useTabContext, TabId } from '@/src/contexts/TabContext';

export interface GlossarEntry {
  id: string;
  term: string;
  shortName: string;
  badge: string;
  category: 'core' | 'architecture' | 'practice';
  icon: any;
  oneLiner: string;
  analogy: string;
  constructionUse: string;
  deepDiveTab?: TabId;
  deepDiveLabel?: string;
}

export const GLOSSAR_ENTRIES: GlossarEntry[] = [
  {
    id: 'llm',
    term: 'Large Language Model (LLM)',
    shortName: 'LLM',
    badge: 'Großes Sprachmodell',
    category: 'core',
    icon: Sparkles,
    oneLiner: 'Ein künstliches neuronales Netz (z. B. GPT-4, Claude 3.7, Qwen), das auf riesigen Textmengen trainiert wurde und Sprache, Verträge, Normen und Programmcode tiefgehend versteht und erzeugen kann.',
    analogy: 'Wie ein hochbelesener Assistent im Büro, der tausende Fachbücher und DIN-Normen überflogen hat und auf Zuruf druckreife Texte oder Code entwirft.',
    constructionUse: 'Entwurf von VOB-Bedenkenanzeigen, Zusammenfassung 200-seitiger Bodengutachten, Formatierung von Leistungsverzeichnissen und Schreiben technischer Gutachten.',
    deepDiveTab: 'ki_llmpraxis',
    deepDiveLabel: 'Zur LLM-Praxis'
  },
  {
    id: 'rag',
    term: 'Retrieval-Augmented Generation (RAG)',
    shortName: 'RAG',
    badge: 'Quellengestützte Generierung',
    category: 'architecture',
    icon: Layers,
    oneLiner: 'Eine Methode, bei der das LLM vor dem Antworten eine externe Vektordatenbank mit Ihren eigenen PDF-Dateien (z. B. Eurocodes, Baugrundgutachten) durchsucht und nur anhand dieser geprüften Zitate antwortet.',
    analogy: 'Wie eine Prüfung mit „Open Book“: Statt aus dem unsicheren Gedächtnis zu raten (und evtl. falsche Werte zu erfinden), schlägt die KI zuerst die exakte Seite im Ordner auf und zitiert wörtlich.',
    constructionUse: 'Verlässliche, halluzinationsfreie Befragung von DIN-Normen, statischen Nachweisen und Baustellen-Tagebüchern mit direkter Seitenangabe.',
    deepDiveTab: 'ki_system',
    deepDiveLabel: 'Zum RAG-Demonstrator'
  },
  {
    id: 'prompt_engineering',
    term: 'Prompt-Engineering',
    shortName: 'Prompt-Engineering',
    badge: 'Präzise Arbeitsanweisung',
    category: 'practice',
    icon: Terminal,
    oneLiner: 'Die gezielte Formulierung von Arbeitsanweisungen mit klarer Rolle, fachlichem Kontext, Randbedingungen und gewünschtem Format, um verlässliche und ingenieurgerechte Antworten zu erzielen.',
    analogy: 'Wie ein präzises Leistungsverzeichnis (LV): Je eindeutiger die technischen Vorbemerkungen und Toleranzen formuliert sind, desto mangelfreier ist das Bauergebnis.',
    constructionUse: 'Vermeidung von oberflächlichem Bla-Bla durch Vorgabe exakter Tabellenformate, Eurocode-Referenzen und mathematischer Rechengänge.',
    deepDiveTab: 'ki_prompting',
    deepDiveLabel: 'Zum Prompt-Optimierer'
  },
  {
    id: 'vibe_coding',
    term: 'Vibe Coding',
    shortName: 'Vibe Coding',
    badge: 'KI-geführtes Programmieren',
    category: 'practice',
    icon: Code,
    oneLiner: 'Ein moderner Entwicklungsansatz, bei dem Sie als Fachexperte (Bauingenieur) Software und Skripte in natürlicher Alltagssprache beschreiben, während KI-Tools (Cursor, Claude Code) den Code schreiben und debuggen.',
    analogy: 'Wie ein erfahrener Bauleiter, der die Ausführung an Spezialhandwerker delegiert: Sie definieren das Ziel, die Physik und die Logik – die KI übernimmt die handwerkliche Code-Tipparbeit.',
    constructionUse: 'Bauen eigener Mini-Tools in Minuten: z. B. ein U-Wert-Rechner, Sieblinien-Plotter, Betonrezeptur-Prüfer oder IFC-Mengenermittler ohne Informatikstudium.',
    deepDiveTab: 'ki_ueberblick',
    deepDiveLabel: 'Zum KI-Überblick & Grundlagen'
  },
  {
    id: 'mcp_server',
    term: 'Model Context Protocol (MCP-Server)',
    shortName: 'MCP-Server',
    badge: 'Universelle Werkzeug-Schnittstelle',
    category: 'architecture',
    icon: Server,
    oneLiner: 'Ein offener Industriestandard (wie ein USB-C-Stecker für KI), der es LLMs erlaubt, sicher auf lokale Werkzeuge, das Dateisystem, Baudatenbanken oder CAD/BIM-Schnittstellen zuzugreifen.',
    analogy: 'Wie eine standardisierte Schnellwechsel-Kupplung am Bagger: Die Maschine kann je nach Aufgabe automatisch den Grablöffel, den Hydraulikmeißel oder den Verdichter ankoppeln.',
    constructionUse: 'Claude Desktop oder Cursor können direkt Bauteil-Tabellen aus lokalen SQLite-Datenbanken abfragen oder mit `ifcopenshell` Bauteilmengen aus IFC-Modellen extrahieren.',
    deepDiveTab: 'ki_llmpraxis',
    deepDiveLabel: 'Zu MCP-Konnektoren'
  },
  {
    id: 'halluzination',
    term: 'Halluzination & Fehlerrisiko',
    shortName: 'Halluzination',
    badge: 'Verlässlichkeit & Haftung',
    category: 'core',
    icon: ShieldCheck,
    oneLiner: 'Wenn ein Sprachmodell Fakten, Normen-Ziffern oder Rechenergebnisse völlig plausibel und selbstbewusst formuliert, diese in der Realität jedoch falsch oder frei erfunden sind.',
    analogy: 'Wie ein Praktikant, der eine fehlende Messzahl im Laborbericht errät, statt noch einmal an der Prüfmaschine nachzumessen. Unbedingt durch Vier-Augen-Prinzip prüfen!',
    constructionUse: 'Bauingenieure haften persönlich nach BGB/HOAI: KI-Ergebnisse dürfen niemals ungeprüft in statische Nachweise oder behördliche Einreichungen übernommen werden.',
    deepDiveTab: 'ki_recht_ethik',
    deepDiveLabel: 'Zu Recht, Ethik & Haftung'
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
              <h3 className="font-bold text-sm text-slate-800">
                Interaktives Einsteiger-Glossar: Die wichtigsten KI-Fachbegriffe
              </h3>
              <span className="text-xxs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Hemmschwellen senken
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              LLM, RAG, Prompting, Vibe Coding &amp; MCP in einfachen Analogien und konkreten Bau-Beispielen erklärt.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs font-medium hidden sm:inline text-slate-500">
            {isExpanded ? 'Einklappen' : 'Begriffe anzeigen'}
          </span>
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </div>

      {/* EXPANDED CONTENT */}
      {isExpanded && (
        <div className="p-4 sm:p-6 animate-in fade-in duration-200 space-y-5">
          
          {/* SCHNELLAUSWAHL-CHIPS & SUCHE */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {GLOSSAR_ENTRIES.map(entry => {
                const IconComponent = entry.icon;
                const isSelected = selectedTermId === entry.id;
                return (
                  <button
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
            </div>

            {/* KLEINES SUCHFELD */}
            <div className="relative min-w-[180px]">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Begriff suchen..."
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
                  <span>{selectedEntry.deepDiveLabel || 'Mehr erfahren'}</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>

            {/* 1-SATZ DEFINITION */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Kompakte Definition:
              </span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {selectedEntry.oneLiner}
              </p>
            </div>

            {/* ZWEI SPALTEN: ANALOGIE & BAU-NUTZEN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              
              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xxs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
                    <Lightbulb size={13} className="text-amber-600" />
                    Anschauliche Ingenieur-Analogie:
                  </div>
                  <p className="text-xs text-amber-950/80 leading-relaxed">
                    {selectedEntry.analogy}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xxs font-bold text-emerald-900 uppercase tracking-wider mb-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    Konkreter Praxis-Nutzen im Bauwesen:
                  </div>
                  <p className="text-xs text-emerald-950/80 leading-relaxed">
                    {selectedEntry.constructionUse}
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* SCHNELLE GRID-ÜBERSICHT ALLER 5 BEGRIFFE FÜR SCHNELL-LESER */}
          <div className="pt-2 border-t border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Schnell-Spickzettel (Auf einen Blick):
            </span>
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
