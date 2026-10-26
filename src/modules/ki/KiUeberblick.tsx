import { useState } from 'react';
import {
  Sparkles,
  Database,
  Clock,
  TrendingUp,
  Workflow,
  Boxes,
  Compass
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import KernbegriffeTab from './ueberblick/KernbegriffeTab';
import HistorieTab from './ueberblick/HistorieTab';
import StandTab from './ueberblick/StandTab';
import AusblickTab from './ueberblick/AusblickTab';
import PipelineTab from './ueberblick/PipelineTab';
import VergleichTab from './ueberblick/VergleichTab';
import inhalt from '@/content/ki/KiUeberblick.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function KiUeberblick() {
  const [activeTab, setActiveTab] = useState<'kernbegriffe' | 'historie' | 'stand' | 'ausblick' | 'pipeline' | 'vergleich'>('kernbegriffe');
  const [pipelineStep, setPipelineStep] = useState<number>(1);
  
  // State for Kernbegriffe interactive selector
  const [selectedTerm, setSelectedTerm] = useState<'ki' | 'ml' | 'dl' | 'llm' | 'rag' | 'vision' | 'agenten'>('ki');
  const [detailSubTab, setDetailSubTab] = useState<'funktionsweise' | 'beispiele' | 'vergleich' | 'formel' | 'risiken'>('beispiele');
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number>(0);

  // State for interactive RAG demonstration
  const [simQuestion, setSimQuestion] = useState<'xc4' | 'xf4' | 'rc_beton'>('xc4');
  const [simMode, setSimMode] = useState<'llm_pur' | 'rag'>('rag');

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Modulheader & Einleitung */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-shiraz text-white rounded-xl shadow-sm">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.künstlicheIntelligenzKiIm} /></h2>
            <p className="text-xs text-text-main/60"><MdText text={inhalt.texte.historieAktuellerPraxisstandZukunftspers} /></p>
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p><MdText text={inhalt.texte.künstlicheIntelligenzIstIm} /></p>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pt-5 border-t border-home-grau/20 mt-5">
          <button aria-pressed={activeTab === 'kernbegriffe'}
            onClick={() => setActiveTab('kernbegriffe')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'kernbegriffe'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Boxes size={16} /><MdText text={inhalt.texte.t1KernbegriffeVerständlichMl} /></button>
          <button aria-pressed={activeTab === 'historie'}
            onClick={() => setActiveTab('historie')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'historie'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Clock size={16} /><MdText text={inhalt.texte.t2Historie1960Bis} /></button>
          <button aria-pressed={activeTab === 'stand'}
            onClick={() => setActiveTab('stand')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'stand'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <TrendingUp size={16} /><MdText text={inhalt.texte.t3StandHeutePraxis} /></button>
          <button aria-pressed={activeTab === 'ausblick'}
            onClick={() => setActiveTab('ausblick')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'ausblick'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Compass size={16} /><MdText text={inhalt.texte.t4AusblickNächste5} /></button>
          <button aria-pressed={activeTab === 'pipeline'}
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Database size={16} /><MdText text={inhalt.texte.t5EnterpriseRagVom} /></button>
          <button aria-pressed={activeTab === 'vergleich'}
            onClick={() => setActiveTab('vergleich')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'vergleich'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Workflow size={16} /><MdText text={inhalt.texte.t6InteraktiverRagSimulator} /></button>
        </div>
      </div>

      {/* 2. TAB CONTENT: KERNBEGRIFFE */}
      {activeTab === 'kernbegriffe' && <KernbegriffeTab detailSubTab={detailSubTab} selectedExampleIndex={selectedExampleIndex} selectedTerm={selectedTerm} setDetailSubTab={setDetailSubTab} setSelectedExampleIndex={setSelectedExampleIndex} setSelectedTerm={setSelectedTerm} />}

      {/* 3. TAB CONTENT: HISTORIE */}
      {activeTab === 'historie' && <HistorieTab />}

      {/* 4. TAB CONTENT: STAND HEUTE */}
      {activeTab === 'stand' && <StandTab />}

      {/* 5. TAB CONTENT: AUSBLICK */}
      {activeTab === 'ausblick' && <AusblickTab />}

      {/* 5. TAB CONTENT: ENTERPRISE RAG-PIPELINE (SCHRITT FÜR SCHRITT) */}
      {activeTab === 'pipeline' && <PipelineTab pipelineStep={pipelineStep} setPipelineStep={setPipelineStep} />}

      {/* 6. TAB CONTENT: INTERAKTIVER VERGLEICH (RAG-SIMULATOR) */}
      {activeTab === 'vergleich' && <VergleichTab setSimMode={setSimMode} setSimQuestion={setSimQuestion} simMode={simMode} simQuestion={simQuestion} />}

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1KennzahlenEiner}
        zielGleichung="P = \frac{TP}{TP+FP},\ R = \frac{TP}{TP+FN},\ F_1 = \frac{2PR}{P+R}"
        schritte={inhalt.daten["KiUeberblick.schritte"]}
        ergebnisHinweis={inhalt.werte.jederVierteRissWird}
        normQuelle={inhalt.werte.din1076202601}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2ErforderlicheBildauflösung}
        zielGleichung="GSD = \frac{B}{n_{px}}"
        schritte={inhalt.daten["KiUeberblick.schritte_2"]}
        ergebnisHinweis={inhalt.werte.mitZuGroberAuflösung}
        normQuelle={inhalt.werte.lehrbeispielBildverarbeitung}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_ueberblick" />

      {/* 7. ModuleFooter nach Styleguide */}
      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap14}
        wikipedia={[
          { title: inhalt.werte.künstlicheIntelligenz, url: 'https://de.wikipedia.org/wiki/K%C3%BCnstliche_Intelligenz' },
          { title: inhalt.werte.maschinellesLernen, url: 'https://de.wikipedia.org/wiki/Maschinelles_Lernen' },
          { title: inhalt.werte.deepLearning, url: 'https://de.wikipedia.org/wiki/Deep_Learning' },
          { title: inhalt.werte.retrievalAugmentedGeneration, url: 'https://en.wikipedia.org/wiki/Retrieval-augmented_generation' },
          { title: inhalt.werte.largeLanguageModel, url: 'https://de.wikipedia.org/wiki/Gro%C3%9Fes_Sprachmodell' }
        ]}
        literatur={inhalt.daten["KiUeberblick.literatur"]}
        regelwerke={inhalt.daten["KiUeberblick.regelwerke"]}
        formeln={
          activeTab === 'kernbegriffe'
            ? inhalt.daten.KiUeberblick
            : activeTab === 'stand'
            ? inhalt.daten.KiUeberblick_2
            : []
        }
      />
    </div>
  );
}
