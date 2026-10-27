import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  Code, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  Sliders, 
  Terminal, 
  GraduationCap, 
  CheckSquare,
  Compass,
  FileCode2,
  FileCheck2,
  Table
} from 'lucide-react';
import { InlineMath } from 'react-katex';
import { FormulaText } from '@/src/components/ui/FormulaText';
import inhalt from '@/content/ki/ToolsFuerThesen.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';

interface ThesisTool {
  id: string;
  name: string;
  category: 'literatur' | 'schreiben' | 'coding';
  badge: string;
  badgeColor: string;
  url: string;
  pricing: string;
  summary: string;
  thesisWorkflow: string;
  proTip: string;
  caution: string;
}

const THESIS_TOOLS: ThesisTool[] = [
  // 1. Literatur & Research Mapping
  {
    id: 'elicit',
    name: 'Elicit',
    category: 'literatur',
    badge: inhalt.werte.paperExtraktionSynthese,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    url: 'https://elicit.com',
    pricing: 'Freemium',
    summary: inhalt.werte.durchsuchtÜber200Millionen,
    thesisWorkflow: inhalt.werte.perfektFürDenStand,
    proTip: inhalt.werte.nutzenSieDieFunktion,
    caution: inhalt.werte.prüfenSieImmerDie
  },
  {
    id: 'connected_papers',
    name: inhalt.werte.connectedPapers,
    category: 'literatur',
    badge: inhalt.werte.visuellerZitationsgraph,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    url: 'https://www.connectedpapers.com',
    pricing: 'Freemium',
    summary: inhalt.werte.erstelltInteraktiveZweidimensionaleZitat,
    thesisWorkflow: inhalt.werte.gebenSieEinSchlüsselpaper,
    proTip: inhalt.werte.dieClusterungZeigtOft,
    caution: inhalt.werte.keineVolltextsucheEsWerden
  },
  {
    id: 'research_rabbit',
    name: inhalt.werte.researchRabbit,
    category: 'literatur',
    badge: inhalt.werte.netzwerkAutorensuche,
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    url: 'https://www.researchrabbit.ai',
    pricing: 'Kostenfrei',
    summary: inhalt.werte.oftAlsSpotifyFür,
    thesisWorkflow: inhalt.werte.legenSieThematischeSammlungen,
    proTip: inhalt.werte.zoteroIntegrationSynchronisierenSie,
    caution: inhalt.werte.verführtLeichtZumExtensiven
  },
  {
    id: 'consensus',
    name: 'Consensus',
    category: 'literatur',
    badge: inhalt.werte.wissenschaftlicherKonsens,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    url: 'https://consensus.app',
    pricing: 'Freemium',
    summary: inhalt.werte.kiSuchmaschineDieAusschließlich,
    thesisWorkflow: inhalt.werte.hervorragendZurBeantwortungVon,
    proTip: inhalt.werte.idealFürEinleitungsUnd,
    caution: inhalt.werte.nichtFürQualitativeEinzelfallprüfungen
  },
  {
    id: 'scite',
    name: 'Scite.ai',
    category: 'literatur',
    badge: inhalt.werte.smartCitations,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    url: 'https://scite.ai',
    pricing: inhalt.werte.uniLizenzFreemium,
    summary: inhalt.werte.klassifiziertZitateInSupporting,
    thesisWorkflow: inhalt.werte.unverzichtbarZurVerifikationVon,
    proTip: inhalt.werte.zitierenSieInDer,
    caution: inhalt.werte.mancheHochschulenBietenCampuslizenzen
  },
  {
    id: 'deep_research',
    name: inhalt.werte.deepResearchOpenaiGemini,
    category: 'literatur',
    badge: inhalt.werte.autonomesWebResearch,
    badgeColor: 'bg-shiraz/10 text-shiraz border-shiraz/20',
    url: 'https://perplexity.ai',
    pricing: 'Freemium',
    summary: inhalt.werte.autonomeKiAgentenDie,
    thesisWorkflow: inhalt.werte.eignetSichFürKomplexe,
    proTip: inhalt.werte.verlangeImPromptExplizit,
    caution: inhalt.werte.erfordertStrikteQuellenkontrolleVerlasse
  },

  // 2. Schreiben, Synthese & LaTeX
  {
    id: 'notebooklm',
    name: inhalt.werte.googleNotebooklm,
    category: 'schreiben',
    badge: inhalt.werte.quellentreuePdfAnalyse,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    url: 'https://notebooklm.google.com',
    pricing: 'Kostenfrei',
    summary: inhalt.werte.arbeitetAusschließlichAufDen,
    thesisWorkflow: inhalt.werte.ladenSieAlle30,
    proTip: inhalt.werte.nutzenSieDieNotiz,
    caution: inhalt.werte.ladenSieKeineVertraulichen
  },
  {
    id: 'paperpal',
    name: 'Paperpal',
    category: 'schreiben',
    badge: inhalt.werte.akademischerSchreibassistent,
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    url: 'https://paperpal.com',
    pricing: 'Freemium',
    summary: inhalt.werte.aufMillionenWissenschaftlicherFachartike,
    thesisWorkflow: inhalt.werte.idealFürDasVerfassen,
    proTip: inhalt.werte.verfügbarAlsMicrosoftWord,
    caution: inhalt.werte.achtenSieDaraufDass
  },
  {
    id: 'deepl_write',
    name: 'DeepL Write',
    category: 'schreiben',
    badge: inhalt.werte.stilGrammatikfeinschliff,
    badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
    url: 'https://www.deepl.com/write',
    pricing: 'Kostenfrei',
    summary: inhalt.werte.vollwertigerDeutscherUndEnglischer,
    thesisWorkflow: inhalt.werte.fügenSieIhreFertigen,
    proTip: inhalt.werte.klickenSieAufEinzelne,
    caution: inhalt.werte.kopiereNichtUnbesehenGanze
  },
  {
    id: 'overleaf_copilot',
    name: inhalt.werte.overleafLatexCopilots,
    category: 'schreiben',
    badge: inhalt.werte.formelsatzTikzGrafiken,
    badgeColor: 'bg-green-50 text-green-700 border-green-200',
    url: 'https://www.overleaf.com',
    pricing: inhalt.werte.freemiumUniLizenz,
    summary: inhalt.werte.derWeltweiteGoldstandardFür,
    thesisWorkflow: inhalt.werte.bitteEinLlmErstelle,
    proTip: inhalt.werte.lassenSieKiTikz,
    caution: inhalt.werte.prüfenSieBeiLatex
  },
  {
    id: 'zotero',
    name: inhalt.werte.zoteroZoteroAi,
    category: 'schreiben',
    badge: inhalt.werte.literaturverwaltungZitation,
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    url: 'https://www.zotero.org',
    pricing: inhalt.werte.kostenfreiOpenSource,
    summary: inhalt.werte.dasFührendeFreieLiteraturverwaltungsprog,
    thesisWorkflow: inhalt.werte.erfasseAlleLiteraturstellenPer,
    proTip: inhalt.werte.integriereZoteroDirektMit,
    caution: inhalt.werte.automatischImportierteMetadatenEnthalten
  },

  // 3. Coding & Datenauswertung
  {
    id: 'cursor_claude',
    name: inhalt.werte.cursorClaudeCode,
    category: 'coding',
    badge: inhalt.werte.kiGestütztesProgrammieren,
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    url: 'https://www.cursor.com',
    pricing: 'Freemium',
    summary: inhalt.werte.nextGenerationCodeEditoren,
    thesisWorkflow: inhalt.werte.gebenSieIhrerPrüfmaschinen,
    proTip: inhalt.werte.nutzenSieFilesOder,
    caution: inhalt.werte.prüfenSieGenerierteMathematische
  },
  {
    id: 'python_datascience',
    name: inhalt.werte.pythonPandasNumpyMatplotlib,
    category: 'coding',
    badge: 'Labor-Datenanalyse',
    badgeColor: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    url: 'https://jupyter.org',
    pricing: inhalt.werte.kostenfreiOpenSource2,
    summary: inhalt.werte.derWissenschaftlicheIndustriestandardFür,
    thesisWorkflow: inhalt.werte.verabschiedenSieSichVon,
    proTip: inhalt.werte.exportiereGrafikenStetsIm,
    caution: inhalt.werte.achtenSieDaraufDass2
  },
  {
    id: 'streamlit',
    name: inhalt.werte.streamlitDash,
    category: 'coding',
    badge: inhalt.werte.interaktiveWebTools,
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    url: 'https://streamlit.io',
    pricing: inhalt.werte.kostenfreiOpenSource3,
    summary: inhalt.werte.verwandeltPythonSkripteMit,
    thesisWorkflow: inhalt.werte.bauenSieAlsHighlight,
    proTip: inhalt.werte.hostenSieIhreApp,
    caution: inhalt.werte.beschränkeDieBenutzeroberflächeAuf
  },
  {
    id: 'sympy_wolfram',
    name: inhalt.werte.sympyWolframAlphaVia,
    category: 'coding',
    badge: inhalt.werte.symbolischeMathematikEinheiten,
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    url: 'https://www.wolframalpha.com',
    pricing: inhalt.werte.kostenfreiFreemium,
    summary: inhalt.werte.analytischeGleichungslöserSymbolischeInt,
    thesisWorkflow: inhalt.werte.lassenSieSichBei,
    proTip: inhalt.werte.kombiniereLlmPromptsMit,
    caution: inhalt.werte.wolframAlphaEignetSich
  }
];

interface PromptPreset {
  id: string;
  title: string;
  targetChapter: string;
  scenario: string;
  promptText: string;
  sampleOutput: string;
}

const THESIS_PROMPTS: PromptPreset[] = inhalt.daten.THESIS_PROMPTS;

type ThesenTab = 'literatur' | 'schreiben' | 'coding' | 'integritaet' | 'prompts';

/** Reiter (Z53: Gliederung langer Module über ModuleTabs) */
const THESEN_TABS: readonly ModulTab<ThesenTab>[] = [
  { id: 'literatur', label: inhalt.texte.t1LiteraturResearchMapping.trim(), icon: Search },
  { id: 'schreiben', label: inhalt.texte.t2SchreibenSyntheseLatex.trim(), icon: FileText },
  { id: 'coding', label: inhalt.texte.t3ToolsProgrammierenDatenanalyse.trim(), icon: Code },
  { id: 'prompts', label: inhalt.texte.t4ThesisPromptLabor.trim(), icon: Sparkles },
  { id: 'integritaet', label: inhalt.texte.t5IntegritätKiDeklaration.trim(), icon: CheckSquare },
];

export default function ToolsFuerThesen() {
  const [activeSubTab, setActiveSubTab] = useState<ThesenTab>('literatur');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'literatur' | 'schreiben' | 'coding'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Custom Prompt Builder State
  const [activePromptId, setActivePromptId] = useState<string>('expose');
  const [customTopic, setCustomTopic] = useState<string>(inhalt.werte.klinkerreduzierteBetoneMitCalcinierten);
  const [customMaterial, setCustomMaterial] = useState<string>(inhalt.werte.c3037Xc4Xf1);
  const [customTesting, setCustomTesting] = useState<string>(inhalt.werte.druckfestigkeit28dCdfFrosttest);
  const [promptCopied, setPromptCopied] = useState<boolean>(false);

  const filteredTools = THESIS_TOOLS.filter(t => categoryFilter === 'all' || t.category === categoryFilter);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const currentPrompt = THESIS_PROMPTS.find(p => p.id === activePromptId) || THESIS_PROMPTS[0];

  // Dynamic Prompt with customized inputs
  const dynamicPromptString = currentPrompt.promptText
    .replace(/\[HIER THEMA EINTRAGEN.*?\]/g, customTopic)
    .replace(/\[FRAGESTELLUNG EINGEBEN.*?\]/g, `Einfluss von ${customMaterial} auf ${customTesting}`)
    .replace(/\[z\. B\. Hohe CO2-Emissionen.*?\]/g, `Hohe Emissionen erfordern ${customMaterial}`)
    .replace(/\[z\. B\. 48 Probekörper.*?\]/g, `Laborprogramm mit ${customTesting}`)
    .replace(/\[z\. B\. f_cm nach 28d lag bei 48,3 MPa.*?\]/g, `Gute Festigkeit und Dauerhaftigkeit bei ${customTopic}`);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* INTRO HERO BANNER */}
      <div className="bg-gradient-to-br from-shiraz/5 via-white to-off-white p-6 rounded-2xl border border-shiraz/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-shiraz/10 text-shiraz text-xs font-bold font-mono">
            <GraduationCap size={14} /><MdText text={inhalt.texte.akademischerWerkzeugkastenFürAbschlussar} /></div>
          <h3 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.toolsWorkflowsFürBachelor} /></h3>
          <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.wissenschaftlichesArbeitenImBauingenieur} /></p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-home-grau/30 shadow-xs shrink-0 text-center w-full md:w-auto">
          <div className="text-xs text-text-main/70 font-semibold uppercase tracking-wider mb-1"><MdText text={inhalt.texte.empfohlenerStack} /></div>
          <div className="text-lg font-black text-shiraz font-mono"><MdText text={inhalt.texte.top12Tools} /></div>
          <div className="text-[11px] text-text-main/60 mt-0.5"><MdText text={inhalt.texte.kuratierteIngenieurAuswahl} /></div>
        </div>
      </div>

      {/* Reiter (Z53: ModuleTabs) */}
      <ModuleTabs label="Bereiche: Tools für Thesen" tabs={THESEN_TABS} aktiv={activeSubTab} onWechsel={setActiveSubTab} className="space-y-6">
      <div className="space-y-6">

      {/* 1. LITERATUR & RESEARCH MAPPING */}
      {activeSubTab === 'literatur' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Search className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.systematischeLiteraturrecherchePaperMapp} /></h4>
              <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.kombiniereZitationsgraphenConnectedPaper} /></p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-home-grau/25 text-shiraz font-bold shrink-0"><MdText text={inhalt.texte.t6SpezialTools} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {THESIS_TOOLS.filter(t => t.category === 'literatur').map(tool => (
              <div key={tool.id} className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-shiraz/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                    <a 
                      href={tool.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-text-main/40 hover:text-shiraz transition-colors p-1"
                      title={inhalt.werte.websiteÖffnen}
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-text-main">{tool.name}</h4>
                    <span className="text-[10px] font-mono text-text-main/50 block mt-0.5">Lizenz: {tool.pricing}</span>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                    {tool.summary}
                  </p>

                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-shiraz uppercase tracking-wider block">
                      Thesis-Einsatz:
                    </span>
                    <p className="text-text-main/80 leading-relaxed text-[11px]">
                      {tool.thesisWorkflow}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-home-grau/20 space-y-2 text-[11px]">
                  <div className="text-emerald-700 flex items-start gap-1">
                    <span className="font-bold shrink-0">Tipp:</span>
                    <span>{tool.proTip}</span>
                  </div>
                  <div className="text-amber-800 flex items-start gap-1">
                    <span className="font-bold shrink-0">Achtung:</span>
                    <span>{tool.caution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Workflow Diagram Box */}
          <div className="p-5 bg-white rounded-2xl border border-home-grau/30 space-y-3">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
              <Compass className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.derPerfekte4Stufen} /></h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-1">
                <span className="font-mono font-bold text-shiraz text-xs"><MdText text={inhalt.texte.schritt1Entdecken} /></span>
                <h5 className="font-bold text-text-main"><MdText text={inhalt.texte.connectedPapers} /></h5>
                <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.startenSieMitDem} /></p>
              </div>
              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-1">
                <span className="font-mono font-bold text-shiraz text-xs"><MdText text={inhalt.texte.schritt2Extrahieren} /></span>
                <h5 className="font-bold text-text-main"><MdText text={inhalt.texte.elicitSciteAi} /></h5>
                <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.zieheDosierungenWZ} /></p>
              </div>
              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-1">
                <span className="font-mono font-bold text-shiraz text-xs"><MdText text={inhalt.texte.schritt3Konsolidieren} /></span>
                <h5 className="font-bold text-text-main"><MdText text={inhalt.texte.zoteroZoteroAi} /></h5>
                <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.speichereAlleVolltextPdfs} /></p>
              </div>
              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-1">
                <span className="font-mono font-bold text-shiraz text-xs"><MdText text={inhalt.texte.schritt4Verifizieren} /></span>
                <h5 className="font-bold text-text-main">NotebookLM</h5>
                <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.befragenSieAusschließlichIhre} /></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SCHREIBEN, SYNTHESE & LATEX */}
      {activeSubTab === 'schreiben' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <FileText className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.wissenschaftlichesFormulierenSyntheseLat} /></h4>
              <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.sparenSieHunderteStunden} /></p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-home-grau/25 text-shiraz font-bold shrink-0"><MdText text={inhalt.texte.t5Schreibwerkzeuge} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {THESIS_TOOLS.filter(t => t.category === 'schreiben').map(tool => (
              <div key={tool.id} className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-shiraz/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                    <a 
                      href={tool.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-text-main/40 hover:text-shiraz transition-colors p-1"
                      title={inhalt.werte.websiteÖffnen2}
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-text-main">{tool.name}</h4>
                    <span className="text-[10px] font-mono text-text-main/50 block mt-0.5">Lizenz: {tool.pricing}</span>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                    {tool.summary}
                  </p>

                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-shiraz uppercase tracking-wider block">
                      Thesis-Einsatz:
                    </span>
                    <p className="text-text-main/80 leading-relaxed text-[11px]">
                      {tool.thesisWorkflow}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-home-grau/20 space-y-2 text-[11px]">
                  <div className="text-emerald-700 flex items-start gap-1">
                    <span className="font-bold shrink-0">Tipp:</span>
                    <span>{tool.proTip}</span>
                  </div>
                  <div className="text-amber-800 flex items-start gap-1">
                    <span className="font-bold shrink-0">Achtung:</span>
                    <span>{tool.caution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* LaTeX Tip Box */}
          <div className="p-5 bg-white rounded-2xl border border-home-grau/30 space-y-3">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
              <FileCode2 className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.bestPracticeTabellenFormelgenerierung} /></h4>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.stattMühsamTabellenspaltenVon} /><code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-shiraz">booktabs</code> und <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-shiraz">siunitx</code><MdText text={inhalt.texte.zuTransformieren} /></p>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              <pre><MdText text={inhalt.texte.empfohlenerLatexPromptFür} /></pre>
            </div>
          </div>
        </div>
      )}

      {/* 3. TOOLS PROGRAMMIEREN & DATENANALYSE */}
      {activeSubTab === 'coding' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Code className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.vibeCodingWissenschaftlicheDatenpipeline} /></h4>
              <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.alsBauingenieurMüssenSie} /></p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-home-grau/25 text-shiraz font-bold shrink-0"><MdText text={inhalt.texte.t4CodingTools} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {THESIS_TOOLS.filter(t => t.category === 'coding').map(tool => (
              <div key={tool.id} className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-shiraz/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                    <a 
                      href={tool.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-text-main/40 hover:text-shiraz transition-colors p-1"
                      title={inhalt.werte.websiteÖffnen3}
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-text-main">{tool.name}</h4>
                    <span className="text-[10px] font-mono text-text-main/50 block mt-0.5">Lizenz: {tool.pricing}</span>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                    {tool.summary}
                  </p>

                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-shiraz uppercase tracking-wider block">
                      Thesis-Einsatz:
                    </span>
                    <p className="text-text-main/80 leading-relaxed text-[11px]">
                      {tool.thesisWorkflow}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-home-grau/20 space-y-2 text-[11px]">
                  <div className="text-emerald-700 flex items-start gap-1">
                    <span className="font-bold shrink-0">Tipp:</span>
                    <span>{tool.proTip}</span>
                  </div>
                  <div className="text-amber-800 flex items-start gap-1">
                    <span className="font-bold shrink-0">Achtung:</span>
                    <span>{tool.caution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Practical Example Architecture */}
          <div className="p-5 bg-white rounded-2xl border border-home-grau/30 space-y-4">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
              <Terminal className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.typischePythonAufgabenIn} /></h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <span className="font-bold text-shiraz text-xs block"><MdText text={inhalt.texte.t1RohdatenParsing} /></span>
                <p className="text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.einlesenVonCsvTxt} /></p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <span className="font-bold text-shiraz text-xs block"><MdText text={inhalt.texte.t2StatistischeAuswertung} /></span>
                <p className="text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.berechnungVonMittelwertF} /></p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <span className="font-bold text-shiraz text-xs block"><MdText text={inhalt.texte.t3InteraktivesStreamlitTool} /></span>
                <p className="text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.bereitstellungDesBerechnungsverfahrensAl} /></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. THESIS-PROMPT-LABOR */}
      {activeSubTab === 'prompts' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Sparkles className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.interaktivesThesisPromptLabor} /></h4>
              <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.wählenSieEinWissenschaftliches} /></p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-home-grau/25 text-shiraz font-bold shrink-0"><MdText text={inhalt.texte.t4Praxisszenarien} /></div>
          </div>

          {/* Scenario Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {THESIS_PROMPTS.map(p => (
              <button aria-pressed={activePromptId === p.id}
                key={p.id}
                onClick={() => setActivePromptId(p.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  activePromptId === p.id
                    ? 'bg-shiraz/5 border-shiraz shadow-xs text-text-main'
                    : 'bg-white border-home-grau/30 hover:border-shiraz/40 text-text-main/80'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-shiraz block uppercase mb-1">
                    {p.targetChapter}
                  </span>
                  <h5 className="font-bold text-xs text-text-main leading-snug">{p.title}</h5>
                </div>
                <div className="text-[11px] text-text-main/60 line-clamp-2">
                  {p.scenario}
                </div>
              </button>
            ))}
          </div>

          {/* Parameters Customizer */}
          <div className="p-5 bg-white rounded-2xl border border-home-grau/30 space-y-4">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
              <Sliders className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.parameterFürIhreThesis} /></h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.thesisThemaFragestellung} /></label>
                <input 
                  type="text" 
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-home-grau/30 bg-off-white text-text-main focus:outline-none focus:border-shiraz"
                  placeholder={inhalt.werte.zBRezyklatbetonMit}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.untersuchteBaustoffeKlassen} /></label>
                <input 
                  type="text" 
                  value={customMaterial}
                  onChange={(e) => setCustomMaterial(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-home-grau/30 bg-off-white text-text-main focus:outline-none focus:border-shiraz"
                  placeholder={inhalt.werte.zBC3037}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.prüfmethodenKenngrößen} /></label>
                <input 
                  type="text" 
                  value={customTesting}
                  onChange={(e) => setCustomTesting(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-home-grau/30 bg-off-white text-text-main focus:outline-none focus:border-shiraz"
                  placeholder={inhalt.werte.zBDruckfestigkeitE}
                />
              </div>
            </div>
          </div>

          {/* Generated Prompt Box */}
          <div className="p-5 bg-white rounded-2xl border border-home-grau/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-home-grau/20">
              <div>
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block font-mono"><MdText text={inhalt.texte.generierterPromptFür} />{currentPrompt.title}
                </span>
                <p className="text-xs text-text-main/70">{currentPrompt.targetChapter}</p>
              </div>

              <button
                onClick={() => handleCopyText(dynamicPromptString, 'prompt_labor')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                  copiedId === 'prompt_labor'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-shiraz text-white border-shiraz hover:bg-shiraz/90'
                }`}
              >
                {copiedId === 'prompt_labor' ? (
                  <>
                    <CheckCircle2 size={15} /><MdText text={inhalt.texte.inDieZwischenablageKopiert} /></>
                ) : (
                  <>
                    <Copy size={15} /><MdText text={inhalt.texte.promptKopieren} /></>
                )}
              </button>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {dynamicPromptString}
            </div>

            {/* Collapsible Sample Output */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-text-main/80 flex items-center gap-1.5">
                <FileCheck2 size={14} className="text-shiraz" /><MdText text={inhalt.texte.erwartetesAntwortmusterDesLlms} /></span>
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 text-xs text-text-main/80 whitespace-pre-wrap font-sans leading-relaxed">
                <FormulaText text={currentPrompt.sampleOutput} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. INTEGRITÄT & KI-DEKLARATION */}
      {activeSubTab === 'integritaet' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <CheckSquare className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.wissenschaftlicheIntegritätPrüfungsrecht} /></h4>
              <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.dieNutzungVonKi} /></p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-home-grau/25 text-shiraz font-bold shrink-0"><MdText text={inhalt.texte.rechtlichBelastbar} /></div>
          </div>

          {/* The 5 Golden Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-2">
              <span className="w-6 h-6 rounded-full bg-shiraz/10 text-shiraz font-mono font-bold flex items-center justify-center text-xs">1</span>
              <h5 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.vollständigeTransparenz} /></h5>
              <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.deklarierenSieImAnhang} /></p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-2">
              <span className="w-6 h-6 rounded-full bg-shiraz/10 text-shiraz font-mono font-bold flex items-center justify-center text-xs">2</span>
              <h5 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.keineFakeZitateAnti} /></h5>
              <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.zitierenSieNiemalsEine} /></p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-2">
              <span className="w-6 h-6 rounded-full bg-shiraz/10 text-shiraz font-mono font-bold flex items-center justify-center text-xs">3</span>
              <h5 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.eigeneWissenschaftlicheLeistung} /></h5>
              <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.dieInterpretationDerMessergebnisse} /></p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-2">
              <span className="w-6 h-6 rounded-full bg-shiraz/10 text-shiraz font-mono font-bold flex items-center justify-center text-xs">4</span>
              <h5 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.datenschutzBeiIndustriekooperationen} /></h5>
              <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.wirdIhreThesisIn} /></p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-2">
              <span className="w-6 h-6 rounded-full bg-shiraz/10 text-shiraz font-mono font-bold flex items-center justify-center text-xs">5</span>
              <h5 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.eigenverantwortungFürFehler} /></h5>
              <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.rechenfehlerFehlerhafteEinheitenOder} /></p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-2">
              <span className="w-6 h-6 rounded-full bg-shiraz/10 text-shiraz font-mono font-bold flex items-center justify-center text-xs">6</span>
              <h5 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.prüfungsordnungBeachten} /></h5>
              <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.informierenSieSichVor} /></p>
            </div>
          </div>

          {/* Copyable Declaration Matrix Table */}
          <div className="p-5 bg-white rounded-2xl border border-home-grau/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-home-grau/20">
              <div>
                <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                  <Table className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.musterDeklarationsmatrixFürDen} /></h4>
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.fügenSieDieseTabelle} /></p>
              </div>

              <button
                onClick={() => handleCopyText(inhalt.werte.werkzeugKiModellVersion, 'matrix')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer shrink-0 ${
                  copiedId === 'matrix'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-text-main border-home-grau/30 hover:border-shiraz hover:bg-off-white'
                }`}
              >
                {copiedId === 'matrix' ? (
                  <>
                    <CheckCircle2 size={15} className="text-white" /><MdText text={inhalt.texte.markdownKopiert} /></>
                ) : (
                  <>
                    <Copy size={15} /><MdText text={inhalt.texte.tabelleAlsMarkdownKopieren} /></>
                )}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-home-grau/30 bg-off-white text-text-main font-bold">
                    <th className="p-3"><MdText text={inhalt.texte.werkzeugKiModell} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.versionAnbieter} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.kapitelBereich} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.konkreterVerwendungszweck} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main/80 font-normal">
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz">Elicit</td>
                    <td className="p-3 font-mono text-[11px]">elicit.com</td>
                    <td className="p-3"><MdText text={inhalt.texte.kap2StandDer} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.auffindenRelevanterPrimärquellenUnd} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz"><MdText text={inhalt.texte.connectedPapers2} /></td>
                    <td className="p-3 font-mono text-[11px]">connectedpapers.com</td>
                    <td className="p-3"><MdText text={inhalt.texte.kap2Literatur} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.erstellungVonZitationsgraphenZur} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz">DeepL Write</td>
                    <td className="p-3 font-mono text-[11px]">DeepL SE</td>
                    <td className="p-3"><MdText text={inhalt.texte.gesamtesDokument} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.stilistischerFeinschliffEliminierungVon} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz"><MdText text={inhalt.texte.cursorZBMit} /></td>
                    <td className="p-3 font-mono text-[11px]"><MdText text={inhalt.texte.anysphereAnthropic} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.kap4Versuchsauswertung} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.generierungDesPythonMatplotlib} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz"><MdText text={inhalt.texte.googleNotebooklm} /></td>
                    <td className="p-3 font-mono text-[11px]">Google LLC</td>
                    <td className="p-3"><MdText text={inhalt.texte.kap35Methodik} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.gegenprüfungVonPrüfnormenZitaten} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Ehrenwörtliche Erklärung Mustertext */}
          <div className="p-5 bg-white rounded-2xl border border-home-grau/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-home-grau/20">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <FileCheck2 className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.mustertextErgänzungZurEhrenwörtlichen} /></h4>
              <button
                onClick={() => handleCopyText(inhalt.werte.ergänzungZurEigenständigkeitserklärungBe, 'erklaerung')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                  copiedId === 'erklaerung'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-text-main border-home-grau/30 hover:border-shiraz'
                }`}
              >
                {copiedId === 'erklaerung' ? (
                  <>
                    <CheckCircle2 size={14} className="text-white" /> Kopiert!
                  </>
                ) : (
                  <>
                    <Copy size={14} /><MdText text={inhalt.texte.textKopieren} /></>
                )}
              </button>
            </div>

            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-xs text-text-main/80 leading-relaxed font-serif italic"><MdText text={inhalt.texte.ichVersichereDassIch} /></div>
          </div>
        </div>
      )}
      </div>
      </ModuleTabs>

    </div>
  );
}
