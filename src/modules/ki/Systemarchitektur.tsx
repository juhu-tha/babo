import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { BlockMath } from 'react-katex';
import RagDemonstrator from '@/src/modules/ki/RagDemonstrator';
import {
  Cpu,
  Database,
  Sparkles,
  Layers,
  Eye,
  Bot,
  Server,
  CheckCircle2,
  ArrowRight,
  FileText,
  Zap,
  Boxes,
  Scale,
  Network,
  Code2,
  HardDrive,
  Workflow,
  AlertTriangle
} from 'lucide-react';
import inhalt from '@/content/ki/Systemarchitektur.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, ReiterLeiste, alsOption, alsReiter, reiterPanel } from '../../components/ui/Auswahlgruppe';

type SystemBereich = 'schichten' | 'technologien' | 'vergleich';

/** Reiter (Z53: Gliederung langer Module über ModuleTabs) */
const SYSTEM_TABS: readonly ModulTab<SystemBereich>[] = [
  { id: 'schichten', label: 'Schichtenmodell', icon: Layers },
  { id: 'technologien', label: 'Technologien Schritt für Schritt', icon: Boxes },
  { id: 'vergleich', label: 'Vergleichsmatrix', icon: Scale },
];

export default function Systemarchitektur() {
  const [bereich, setBereich] = useState<SystemBereich>('schichten');
  const [activeTier, setActiveTier] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<'ml' | 'dl' | 'llm' | 'rag' | 'vision' | 'agenten' | 'edge'>('ml');
  const [techViewMode, setTechViewMode] = useState<'funktionsweise' | 'einsatzzwecke' | 'daten' | 'grenzen'>('funktionsweise');

  // Technologies data for detailed step-by-step breakdown
  const techDetails = {
    ml: {
      id: 'ml',
      title: inhalt.werte.classicalMachineLearningMl,
      subtitle: inhalt.werte.numerischeMustererkennungPrädiktionAuf,
      icon: Cpu,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      badge: inhalt.werte.strukturierteDatenRegression,
      oneLiner: inhalt.werte.klassischesMaschinellesLernenLernt,
      mechanismus: inhalt.daten["Systemarchitektur.techDetails.ml.mechanismus"],
      einsatzzwecke: inhalt.daten["Systemarchitektur.techDetails.ml.einsatzzwecke"],
      datenanforderungen: inhalt.daten["Systemarchitektur.techDetails.ml.datenanforderungen"],
      grenzen: inhalt.daten["Systemarchitektur.techDetails.ml.grenzen"]
    },
    dl: {
      id: 'dl',
      title: inhalt.werte.deepLearningNeuronaleNetze,
      subtitle: inhalt.werte.hierarchischeRepräsentationslernenFürKom,
      icon: Network,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      badge: inhalt.werte.mehrschichtigeNetzeFeSurrogate,
      oneLiner: inhalt.werte.deepLearningNutztTiefe,
      mechanismus: inhalt.daten["Systemarchitektur.techDetails.dl.mechanismus"],
      einsatzzwecke: inhalt.daten["Systemarchitektur.techDetails.dl.einsatzzwecke"],
      datenanforderungen: inhalt.daten["Systemarchitektur.techDetails.dl.datenanforderungen"],
      grenzen: inhalt.daten["Systemarchitektur.techDetails.dl.grenzen"]
    },
    llm: {
      id: 'llm',
      title: inhalt.werte.largeLanguageModelsLlms,
      subtitle: inhalt.werte.semantischesVerständnisUndErzeugung,
      icon: FileText,
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      badge: inhalt.werte.transformerSelfAttention,
      oneLiner: inhalt.werte.großeSprachmodelleWandelnUnstrukturierte,
      mechanismus: inhalt.daten["Systemarchitektur.techDetails.llm.mechanismus"],
      einsatzzwecke: inhalt.daten["Systemarchitektur.techDetails.llm.einsatzzwecke"],
      datenanforderungen: inhalt.daten["Systemarchitektur.techDetails.llm.datenanforderungen"],
      grenzen: inhalt.daten["Systemarchitektur.techDetails.llm.grenzen"]
    },
    rag: {
      id: 'rag',
      title: inhalt.werte.retrievalAugmentedGenerationRag,
      subtitle: inhalt.werte.quellentrunkeneWissenseinbettungÜberVekt,
      icon: Database,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      badge: inhalt.werte.vektordatenbankSemantischeSuche,
      oneLiner: inhalt.werte.ragVerbindetStatischeSprachmodelle,
      mechanismus: inhalt.daten["Systemarchitektur.techDetails.rag.mechanismus"],
      einsatzzwecke: inhalt.daten["Systemarchitektur.techDetails.rag.einsatzzwecke"],
      datenanforderungen: inhalt.daten["Systemarchitektur.techDetails.rag.datenanforderungen"],
      grenzen: inhalt.daten["Systemarchitektur.techDetails.rag.grenzen"]
    },
    vision: {
      id: 'vision',
      title: inhalt.werte.computerVisionMultimodaleBildverarbeitun,
      subtitle: inhalt.werte.optischeVermessungSchadenserkennungUnd,
      icon: Eye,
      color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
      badge: inhalt.werte.cnnVitPhotogrammetrie,
      oneLiner: inhalt.werte.computerVisionWandeltDrohnenaufnahmen,
      mechanismus: inhalt.daten["Systemarchitektur.techDetails.vision.mechanismus"],
      einsatzzwecke: inhalt.daten["Systemarchitektur.techDetails.vision.einsatzzwecke"],
      datenanforderungen: inhalt.daten["Systemarchitektur.techDetails.vision.datenanforderungen"],
      grenzen: inhalt.daten["Systemarchitektur.techDetails.vision.grenzen"]
    },
    agenten: {
      id: 'agenten',
      title: inhalt.werte.autonomeKiAgentenTool,
      subtitle: inhalt.werte.kognitiveHandlungsUndRegelschleifen,
      icon: Bot,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      badge: inhalt.werte.reasoningActingReactSchnittstellen,
      oneLiner: inhalt.werte.kiAgentenVerbindenSprachmodelle,
      mechanismus: inhalt.daten["Systemarchitektur.techDetails.agenten.mechanismus"],
      einsatzzwecke: inhalt.daten["Systemarchitektur.techDetails.agenten.einsatzzwecke"],
      datenanforderungen: inhalt.daten["Systemarchitektur.techDetails.agenten.datenanforderungen"],
      grenzen: inhalt.daten["Systemarchitektur.techDetails.agenten.grenzen"]
    },
    edge: {
      id: 'edge',
      title: inhalt.werte.lokaleEdgeKiOn,
      subtitle: inhalt.werte.volleDatenhoheitUndNetzunabhängige,
      icon: Server,
      color: 'text-slate-800 bg-slate-100 border-slate-300',
      badge: inhalt.werte.quantisierungOfflineDatensicherheit,
      oneLiner: inhalt.werte.lokaleKiBetreibtQuelloffene,
      mechanismus: inhalt.daten["Systemarchitektur.techDetails.edge.mechanismus"],
      einsatzzwecke: inhalt.daten["Systemarchitektur.techDetails.edge.einsatzzwecke"],
      datenanforderungen: inhalt.daten["Systemarchitektur.techDetails.edge.datenanforderungen"],
      grenzen: inhalt.daten["Systemarchitektur.techDetails.edge.grenzen"]
    }
  };

  const currentTech = techDetails[selectedTech];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      {/* 1. HEADER & INTRO BOX */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Cpu className="text-shiraz" /><MdText text={inhalt.texte.systemarchitekturDerBauKi} /></h2>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 font-mono text-xs rounded-full border border-slate-200 font-semibold"><MdText text={inhalt.texte.informatischeSchichtenEinsatzzwecke} /></span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed space-y-2">
          <p><MdText text={inhalt.texte.moderneKünstlicheIntelligenzIm} /></p>
          <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.dieseÜbersichtErklärtSchrittweise} /></p>
        </div>
      </div>

      {/* Reiter (Z53): Schichtenmodell, Technologien, Vergleichsmatrix */}
      <ModuleTabs label="Bereiche der Systemarchitektur" tabs={SYSTEM_TABS} aktiv={bereich} onWechsel={setBereich} className="flex flex-col gap-6">
      {/* 2. DAS SCHICHTENMODELL DER BAU-KI (PIPELINE) */}
      {bereich === 'schichten' && (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-home-grau/20 pb-3">
          <div>
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Layers className="text-shiraz" size={18} />
              <span><MdText text={inhalt.texte.das6SchichtenReferenzmodell} /></span>
            </h3>
            <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.klickenSieAufEine} /></p>
          </div>
          <button aria-pressed={activeTier === 'all'}
            onClick={() => setActiveTier('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTier === 'all'
                ? 'bg-shiraz text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          ><MdText text={inhalt.texte.alleSchichtenAnzeigen} /></button>
        </div>

        {/* Interactive Pipeline Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Layer 1: Datenerfassung */}
          <div
            onClick={() => setActiveTier('tier1')}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
              activeTier === 'tier1' || activeTier === 'all'
                ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-400/20 shadow-sm'
                : 'bg-white border-home-grau/30 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                Schicht 1
              </span>
              <HardDrive size={16} className="text-amber-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-800"><MdText text={inhalt.texte.datenerfassungSensorik} /></h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug"><MdText text={inhalt.texte.laborDruckprüfungenBaugrundCpts} /></p>
            <div className="mt-2 text-[10px] font-mono text-amber-800 bg-white/80 p-1.5 rounded border border-amber-200"><MdText text={inhalt.texte.outputUnstrukturierteTabellarischeRohdat} /></div>
          </div>

          {/* Layer 2: Prädiktives ML */}
          <div
            onClick={() => { setActiveTier('tier2'); setSelectedTech('ml'); }}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
              activeTier === 'tier2' || activeTier === 'all'
                ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-400/20 shadow-sm'
                : 'bg-white border-home-grau/30 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                Schicht 2
              </span>
              <Cpu size={16} className="text-emerald-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-800"><MdText text={inhalt.texte.prädiktiveMlDlModelle} /></h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug"><MdText text={inhalt.texte.xgboostRandomForestsUnd} /></p>
            <div className="mt-2 text-[10px] font-mono text-emerald-800 bg-white/80 p-1.5 rounded border border-emerald-200"><MdText text={inhalt.texte.outputFCm28} /></div>
          </div>

          {/* Layer 3: Computer Vision */}
          <div
            onClick={() => { setActiveTier('tier3'); setSelectedTech('vision'); }}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
              activeTier === 'tier3' || activeTier === 'all'
                ? 'bg-cyan-50/60 border-cyan-300 ring-2 ring-cyan-400/20 shadow-sm'
                : 'bg-white border-home-grau/30 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 uppercase">
                Schicht 3
              </span>
              <Eye size={16} className="text-cyan-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-800"><MdText text={inhalt.texte.computerVisionVlm} /></h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug"><MdText text={inhalt.texte.faltungsnetzeCnnsUndVision} /></p>
            <div className="mt-2 text-[10px] font-mono text-cyan-800 bg-white/80 p-1.5 rounded border border-cyan-200"><MdText text={inhalt.texte.outputSchadenskatasterSollIst} /></div>
          </div>

          {/* Layer 4: RAG & Vektorspeicher */}
          <div
            onClick={() => { setActiveTier('tier4'); setSelectedTech('rag'); }}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
              activeTier === 'tier4' || activeTier === 'all'
                ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-400/20 shadow-sm'
                : 'bg-white border-home-grau/30 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 uppercase">
                Schicht 4
              </span>
              <Database size={16} className="text-indigo-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-800"><MdText text={inhalt.texte.semantischeRagPipeline} /></h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug"><MdText text={inhalt.texte.chunkingEmbeddingModelleUnd} /></p>
            <div className="mt-2 text-[10px] font-mono text-indigo-800 bg-white/80 p-1.5 rounded border border-indigo-200"><MdText text={inhalt.texte.outputRelevanteOriginalabschnitteMit} /></div>
          </div>

          {/* Layer 5: Kognitive LLMs */}
          <div
            onClick={() => { setActiveTier('tier5'); setSelectedTech('llm'); }}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
              activeTier === 'tier5' || activeTier === 'all'
                ? 'bg-purple-50/60 border-purple-300 ring-2 ring-purple-400/20 shadow-sm'
                : 'bg-white border-home-grau/30 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase">
                Schicht 5
              </span>
              <Sparkles size={16} className="text-purple-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-800"><MdText text={inhalt.texte.kognitiveSprachmodelleLlm} /></h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug"><MdText text={inhalt.texte.transformerKerneAnalysierenWidersprüche} /></p>
            <div className="mt-2 text-[10px] font-mono text-purple-800 bg-white/80 p-1.5 rounded border border-purple-200"><MdText text={inhalt.texte.outputNormengerechteFachtexteReasoning} /></div>
          </div>

          {/* Layer 6: Autonome Agenten & Validierung */}
          <div
            onClick={() => { setActiveTier('tier6'); setSelectedTech('agenten'); }}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
              activeTier === 'tier6' || activeTier === 'all'
                ? 'bg-rose-50/60 border-rose-300 ring-2 ring-rose-400/20 shadow-sm'
                : 'bg-white border-home-grau/30 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 uppercase">
                Schicht 6
              </span>
              <Bot size={16} className="text-rose-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-800"><MdText text={inhalt.texte.agentenApisHumanIn} /></h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug"><MdText text={inhalt.texte.agentenRufenStatikApis} /></p>
            <div className="mt-2 text-[10px] font-mono text-rose-800 bg-white/80 p-1.5 rounded border border-rose-200"><MdText text={inhalt.texte.outputPrüffähigeStatikSignierte} /></div>
          </div>
        </div>

        {/* Dataflow Banner */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Workflow size={16} className="text-shiraz" />
            <span className="font-semibold text-slate-800"><MdText text={inhalt.texte.datenflussImBüro} /></span>
            <span className="hidden sm:inline"><MdText text={inhalt.texte.sensordatenPläne} /></span>
            <ArrowRight size={13} className="text-slate-400" />
            <span className="hidden sm:inline">ML / Vision</span>
            <ArrowRight size={13} className="text-slate-400" />
            <span className="hidden sm:inline">RAG-Verifikation</span>
            <ArrowRight size={13} className="text-slate-400" />
            <span className="hidden sm:inline"><MdText text={inhalt.texte.llmAgentenTools} /></span>
            <ArrowRight size={13} className="text-slate-400" />
            <span className="font-bold text-shiraz">Ingenieur-Freigabe</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500"><MdText text={inhalt.texte.iso19650DinEn} /></span>
        </div>
      </div>
      )}

      {/* 3. SCHRITTWEISE TECHNOLOGIE-ERKLÄRUNG (INTERAKTIVE DETAIL-MATRIX) */}
      {bereich === 'technologien' && (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
        <div>
          <h3 className="text-base font-bold text-text-main flex items-center gap-2">
            <Boxes className="text-shiraz" size={18} />
            <span><MdText text={inhalt.texte.schrittweiseTechnologieVertiefungEinsatz} /></span>
          </h3>
          <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.wählenSieEineTechnologie} /></p>
        </div>

        {/* Horizontal Technology Selector Tabs */}
        <AuswahlGruppe label="Technologie" className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          {(
            [
              { key: 'ml', label: inhalt.werte.t1ClassicalMl, icon: Cpu },
              { key: 'dl', label: inhalt.werte.t2DeepLearning, icon: Network },
              { key: 'llm', label: inhalt.werte.t3LlmTransformer, icon: FileText },
              { key: 'rag', label: inhalt.werte.t4RagVektoren, icon: Database },
              { key: 'vision', label: inhalt.werte.t5ComputerVision, icon: Eye },
              { key: 'agenten', label: inhalt.werte.t6KiAgentenTools, icon: Bot },
              { key: 'edge', label: inhalt.werte.t7LokaleEdgeKi, icon: Server }
            ] as const
          ).map(tab => {
            const Icon = tab.icon;
            const isSelected = selectedTech === tab.key;
            return (
              <button {...alsOption(isSelected)}
                key={tab.key}
                type="button"
                onClick={() => setSelectedTech(tab.key)}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </AuswahlGruppe>

        {/* Selected Technology Header Card */}
        <div className="p-5 rounded-2xl border border-home-grau/30 bg-off-white space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className={`p-2.5 rounded-xl border ${currentTech.color}`}>
                <currentTech.icon size={20} />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">{currentTech.title}</h4>
                <p className="text-xs text-text-main/70">{currentTech.subtitle}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-white text-slate-700 text-xs font-semibold rounded-full border border-home-grau/30 shadow-2xs">
              {currentTech.badge}
            </span>
          </div>

          <p className="text-xs text-text-main/80 font-normal leading-relaxed bg-white p-3.5 rounded-xl border border-home-grau/20">
            {currentTech.oneLiner}
          </p>

          {/* Sub-Aspect Navigation Tabs */}
          <ReiterLeiste label="Aspekte" className="flex flex-wrap gap-2 pt-2 border-t border-home-grau/20">
            <button {...alsReiter(techViewMode === 'funktionsweise', 'tech-aspekt', 'funktionsweise')}
              onClick={() => setTechViewMode('funktionsweise')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                techViewMode === 'funktionsweise'
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Code2 size={13} /><MdText text={inhalt.texte.technischeFunktionsweiseFormel} /></button>
            <button {...alsReiter(techViewMode === 'einsatzzwecke', 'tech-aspekt', 'einsatzzwecke')}
              onClick={() => setTechViewMode('einsatzzwecke')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                techViewMode === 'einsatzzwecke'
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 size={13} /><MdText text={inhalt.texte.t3BautechnischeEinsatzzwecke} /></button>
            <button {...alsReiter(techViewMode === 'daten', 'tech-aspekt', 'daten')}
              onClick={() => setTechViewMode('daten')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                techViewMode === 'daten'
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <HardDrive size={13} /><MdText text={inhalt.texte.datenanforderungenLatenz} /></button>
            <button {...alsReiter(techViewMode === 'grenzen', 'tech-aspekt', 'grenzen')}
              onClick={() => setTechViewMode('grenzen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                techViewMode === 'grenzen'
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle size={13} /><MdText text={inhalt.texte.risikenIngenieurPflichten} /></button>
          </ReiterLeiste>
        </div>

        {/* Dynamic Detail Content Rendering based on techViewMode */}
        {techViewMode === 'funktionsweise' && (
          <div {...reiterPanel('tech-aspekt', techViewMode)} className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Zap size={14} className="text-shiraz" />
                <span><MdText text={inhalt.texte.schrittweiserTechnischerBerechnungsablau} /></span>
              </h5>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                {currentTech.mechanismus.intro}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {currentTech.mechanismus.steps.map((st: { step: string; desc: string; formula?: string }, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5">
                    <span className="text-xs font-bold text-slate-800 block">{st.step}</span>
                    <p className="text-[11px] text-text-main/70 leading-relaxed">{st.desc}</p>
                    {st.formula && (
                      <div className="my-2 p-2 bg-slate-50 rounded border border-slate-200 text-center font-mono text-xs overflow-x-auto">
                        <BlockMath math={st.formula} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Special Interactive Demonstrator for RAG */}
            {selectedTech === 'rag' && (
              <div className="pt-2">
                <RagDemonstrator />
              </div>
            )}
          </div>
        )}

        {techViewMode === 'einsatzzwecke' && (
          <div {...reiterPanel('tech-aspekt', techViewMode)} className="space-y-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentTech.einsatzzwecke.map((ez, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-shiraz bg-shiraz/5 px-2 py-0.5 rounded border border-shiraz/10">
                      {ez.bereich}
                    </span>
                    <h5 className="text-xs font-bold text-slate-800 leading-snug">{ez.titel}</h5>
                    <p className="text-[11px] text-text-main/70 leading-relaxed">{ez.beschreibung}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 text-[10.5px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-150">
                    <span className="font-bold text-slate-700 block">Ergebnis:</span>
                    {ez.output}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {techViewMode === 'daten' && (
          <div {...reiterPanel('tech-aspekt', techViewMode)} className="p-5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-4 animate-in fade-in duration-200">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <HardDrive size={14} className="text-slate-600" />
              <span><MdText text={inhalt.texte.technischeSystemDatenanforderungen} /></span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Input-Datenformat</span>
                <span className="font-mono text-slate-800 text-[11px] leading-tight block">
                  {currentTech.datenanforderungen.inputFormat}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block"><MdText text={inhalt.texte.erforderlichesDatenvolumen} /></span>
                <span className="font-mono text-slate-800 text-[11px] leading-tight block">
                  {currentTech.datenanforderungen.datenvolumen}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block"><MdText text={inhalt.texte.inferenzzeitLatenz} /></span>
                <span className="font-mono text-emerald-800 font-bold text-[11px] leading-tight block">
                  {currentTech.datenanforderungen.latenz}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block"><MdText text={inhalt.texte.empfohleneRechenhardware} /></span>
                <span className="font-mono text-slate-800 text-[11px] leading-tight block">
                  {currentTech.datenanforderungen.hardware}
                </span>
              </div>
            </div>
          </div>
        )}

        {techViewMode === 'grenzen' && (
          <div {...reiterPanel('tech-aspekt', techViewMode)} className="p-5 bg-rose-50/50 rounded-xl border border-rose-200/80 space-y-3 animate-in fade-in duration-200">
            <h5 className="text-xs font-bold text-rose-900 uppercase tracking-wide flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-rose-700" />
              <span><MdText text={inhalt.texte.sicherheitsrelevanteRisikenIngenieurPfli} /></span>
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-rose-200 space-y-1.5">
                <span className="font-bold text-rose-950 block flex items-center gap-1"><MdText text={inhalt.texte.spezifischesFehlerrisiko} /></span>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {currentTech.grenzen.risiko}
                </p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-emerald-200 space-y-1.5">
                <span className="font-bold text-emerald-950 block flex items-center gap-1"><MdText text={inhalt.texte.notwendigeIngenieurMaßnahme} /></span>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {currentTech.grenzen.massnahme}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {/* 4. VERGLEICHENDE SYSTEMARCHITEKTUR-MATRIX */}
      {bereich === 'vergleich' && (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <Scale className="text-shiraz" size={18} />
          <span><MdText text={inhalt.texte.vergleichendeSystemarchitekturMatrixDer} /></span>
        </h3>
        <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.direkterVergleichAller7} /></p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-home-grau/20 text-slate-500 font-extrabold uppercase text-[9.5px]">
                <th className="py-2.5 px-3">Technologie</th>
                <th className="py-2.5 px-3"><MdText text={inhalt.texte.mathematischeBasis} /></th>
                <th className="py-2.5 px-3">Inferenz-Latenz</th>
                <th className="py-2.5 px-3">Hardware-Bedarf</th>
                <th className="py-2.5 px-3">Fehlerrisiko</th>
                <th className="py-2.5 px-3"><MdText text={inhalt.texte.primärerBaustelleneinsatz} /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-home-grau/10 text-slate-700 text-[11px]">
              <tr className="hover:bg-off-white transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900"><MdText text={inhalt.texte.classicalMl} /></td>
                <td className="py-2.5 px-3 font-mono"><MdText text={inhalt.texte.regressionMseBäume} /></td>
                <td className="py-2.5 px-3 font-mono text-emerald-700 font-semibold">&lt; 1 ms</td>
                <td className="py-2.5 px-3"><MdText text={inhalt.texte.cpuStandard} /></td>
                <td className="py-2.5 px-3 text-amber-700">Extrapolationsfehler</td>
                <td className="py-2.5 px-3"><MdText text={inhalt.texte.betonDruckfestigkeitCptSetzung} /></td>
              </tr>
              <tr className="hover:bg-off-white transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900"><MdText text={inhalt.texte.deepLearning} /></td>
                <td className="py-2.5 px-3 font-mono"><MdText text={inhalt.texte.mlpCnnBackpropagation} /></td>
                <td className="py-2.5 px-3 font-mono text-emerald-700 font-semibold">2–50 ms</td>
                <td className="py-2.5 px-3">GPU (CUDA)</td>
                <td className="py-2.5 px-3 text-amber-700">Black-Box-Intransparenz</td>
                <td className="py-2.5 px-3"><MdText text={inhalt.texte.feSurrogatstatikTopologie} /></td>
              </tr>
              <tr className="hover:bg-off-white transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900"><MdText text={inhalt.texte.llmTransformer} /></td>
                <td className="py-2.5 px-3 font-mono"><MdText text={inhalt.texte.selfAttentionBpe} /></td>
                <td className="py-2.5 px-3 font-mono text-amber-700">1–10 s</td>
                <td className="py-2.5 px-3"><MdText text={inhalt.texte.highEndGpuCloud} /></td>
                <td className="py-2.5 px-3 text-rose-700 font-semibold"><MdText text={inhalt.texte.halluzinationVonWerten} /></td>
                <td className="py-2.5 px-3"><MdText text={inhalt.texte.bedenkenanzeigenNormensynopse} /></td>
              </tr>
              <tr className="hover:bg-off-white transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900">RAG-Systeme</td>
                <td className="py-2.5 px-3 font-mono"><MdText text={inhalt.texte.kosinusDistanzHnsw} /></td>
                <td className="py-2.5 px-3 font-mono text-emerald-700">1–3 s</td>
                <td className="py-2.5 px-3"><MdText text={inhalt.texte.nvmeSsdServer} /></td>
                <td className="py-2.5 px-3 text-amber-700">Chunking-Informationsverlust</td>
                <td className="py-2.5 px-3"><MdText text={inhalt.texte.normenbibliothekZulassungsfinder} /></td>
              </tr>
              <tr className="hover:bg-off-white transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900"><MdText text={inhalt.texte.computerVision} /></td>
                <td className="py-2.5 px-3 font-mono"><MdText text={inhalt.texte.faltungskerneVitUNet} /></td>
                <td className="py-2.5 px-3 font-mono text-emerald-700"><MdText text={inhalt.texte.t30Ms1Min} /></td>
                <td className="py-2.5 px-3"><MdText text={inhalt.texte.gpuClusterEdgeChip} /></td>
                <td className="py-2.5 px-3 text-amber-700">Schatten-/Verschmutzungsfehler</td>
                <td className="py-2.5 px-3"><MdText text={inhalt.texte.din1076RissvermessungBim} /></td>
              </tr>
              <tr className="hover:bg-off-white transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900"><MdText text={inhalt.texte.autonomeAgenten} /></td>
                <td className="py-2.5 px-3 font-mono"><MdText text={inhalt.texte.reactJsonToolCalling} /></td>
                <td className="py-2.5 px-3 font-mono text-amber-700"><MdText text={inhalt.texte.t10S3Min} /></td>
                <td className="py-2.5 px-3">API-Schnittstellen</td>
                <td className="py-2.5 px-3 text-rose-700 font-semibold"><MdText text={inhalt.texte.endlosschleifenFehlaufrufe} /></td>
                <td className="py-2.5 px-3"><MdText text={inhalt.texte.stahlbauVorbemessungAvaGaeb} /></td>
              </tr>
              <tr className="hover:bg-off-white transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900"><MdText text={inhalt.texte.lokaleEdgeKi} /></td>
                <td className="py-2.5 px-3 font-mono"><MdText text={inhalt.texte.gguf4BitQuantisierung} /></td>
                <td className="py-2.5 px-3 font-mono text-emerald-700">15–60 Tok/s</td>
                <td className="py-2.5 px-3"><MdText text={inhalt.texte.lokaleWorkstationVram} /></td>
                <td className="py-2.5 px-3 text-slate-600"><MdText text={inhalt.texte.begrenzteModellgröße} /></td>
                <td className="py-2.5 px-3"><MdText text={inhalt.texte.t100DatenschutzTunnelbauOffline} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      )}
      </ModuleTabs>

      {/* 5. STANDARDISIERTER FOOTER GEMÄSS RULE[GEMINI_md] */}
      <ModuleFooter
        wikipedia={[
          { title: inhalt.werte.künstlicheIntelligenz, url: 'https://de.wikipedia.org/wiki/K%C3%BCnstliche_Intelligenz' },
          { title: inhalt.werte.künstlichesNeuronalesNetz, url: 'https://de.wikipedia.org/wiki/K%C3%BCnstliches_neuronales_Netz' },
          { title: inhalt.werte.transformerMaschinellesLernen, url: 'https://de.wikipedia.org/wiki/Transformer_(Maschinelles_Lernen)' },
          { title: inhalt.werte.computerVision, url: 'https://de.wikipedia.org/wiki/Computer_Vision' }
        ]}
        literatur={inhalt.daten["Systemarchitektur.literatur"]}
        regelwerke={inhalt.daten["Systemarchitektur.regelwerke"]}
        formeln={inhalt.daten["Systemarchitektur.formeln"]}
      />
    </div>
  );
}
