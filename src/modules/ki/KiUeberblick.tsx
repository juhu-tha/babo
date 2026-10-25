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
            <h2 className="text-xl font-bold text-text-main">
              Künstliche Intelligenz (KI) im Bauwesen: Überblick
            </h2>
            <p className="text-xs text-text-main/60">
              Historie, aktueller Praxisstand, Zukunftsperspektiven und wesentliche Kerntechnologien verständlich erklärt
            </p>
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>
            Künstliche Intelligenz ist im Bauwesen kein futuristisches Science-Fiction-Thema mehr, sondern hat sich zu einem konkreten Werkzeugkasten entwickelt. Ob <strong>CO₂-arme Betonmischungsoptimierung</strong>, <strong>KI-gestützte Risserkennung an Brücken</strong> oder <strong>automatisierte Normenrecherchen mit RAG</strong>: Dieses Modul vermittelt Ihnen das fundamentale Verständnis, wie diese Technologien funktionieren, wo die Chancen liegen – und wo Ingenieure nach wie vor unverzichtbar bleiben.
          </p>
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
            <Boxes size={16} /> 1. Kernbegriffe verständlich (ML, RAG & Co.)
          </button>
          <button aria-pressed={activeTab === 'historie'}
            onClick={() => setActiveTab('historie')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'historie'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Clock size={16} /> 2. Historie (1960 bis heute)
          </button>
          <button aria-pressed={activeTab === 'stand'}
            onClick={() => setActiveTab('stand')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'stand'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <TrendingUp size={16} /> 3. Stand heute (Praxis & Grenzen)
          </button>
          <button aria-pressed={activeTab === 'ausblick'}
            onClick={() => setActiveTab('ausblick')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'ausblick'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Compass size={16} /> 4. Ausblick (Nächste 5–10 Jahre)
          </button>
          <button aria-pressed={activeTab === 'pipeline'}
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Database size={16} /> 5. Enterprise-RAG: Vom Dokument zum Tool
          </button>
          <button aria-pressed={activeTab === 'vergleich'}
            onClick={() => setActiveTab('vergleich')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'vergleich'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Workflow size={16} /> 6. Interaktiver RAG-Simulator
          </button>
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
        title="Beispiel 1: Kennzahlen einer KI-Risserkennung"
        zielGleichung="P = \frac{TP}{TP+FP},\ R = \frac{TP}{TP+FN},\ F_1 = \frac{2PR}{P+R}"
        schritte={[
          { titel: 'Konfusionsmatrix', erklaerung: '200 Bildausschnitte: 45 richtig erkannte Risse, 5 Fehlalarme, 15 übersehene Risse, 135 richtig als rissfrei erkannt:', formel: 'TP = 45,\\ FP = 5,\\ FN = 15,\\ TN = 135' },
          { titel: 'Precision und Recall', erklaerung: 'Anteil zutreffender Meldungen und Anteil erkannter Risse:', formel: 'P = \\frac{45}{50} = 0{,}90,\\quad R = \\frac{45}{60} = 0{,}75' },
          { titel: 'F1 und Genauigkeit', erklaerung: 'Die Genauigkeit wirkt gut, verdeckt aber die übersehenen Risse:', formel: 'F_1 = \\frac{2 \\cdot 0{,}90 \\cdot 0{,}75}{1{,}65} = 0{,}82,\\quad Acc = \\frac{180}{200} = 0{,}90' }
        ]}
        ergebnisHinweis="Jeder vierte Riss wird übersehen. Für die Bauwerksprüfung ist der Recall maßgeblich; die KI kann die handnahe Prüfung nach DIN 1076 unterstützen, nicht ersetzen."
        normQuelle="DIN 1076:2026-01; ISO/IEC 22989:2022"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Erforderliche Bildauflösung für Haarrisse"
        zielGleichung="GSD = \frac{B}{n_{px}}"
        schritte={[
          { titel: 'Ist-Auflösung', erklaerung: 'Bildbreite 1,20 m auf 4 000 Pixel:', formel: 'GSD = \\frac{1\\,200\\ \\text{mm}}{4\\,000} = 0{,}30\\ \\text{mm/px}' },
          { titel: 'Anforderung', erklaerung: 'Ein Riss von 0,2 mm sollte mindestens 2 Pixel überdecken:', formel: 'GSD_{erf} \\le \\frac{0{,}2}{2} = 0{,}10\\ \\text{mm/px}' },
          { titel: 'Folge', erklaerung: 'Bei 4 000 Pixeln darf die Bildbreite höchstens betragen:', formel: 'B_{max} = 4\\,000 \\cdot 0{,}10 = 400\\ \\text{mm}' }
        ]}
        ergebnisHinweis="Mit zu grober Auflösung kann kein Algorithmus feine Risse zuverlässig finden – die Datenerfassung bestimmt die Grenze der KI-Auswertung."
        normQuelle="Lehrbeispiel; Bildverarbeitung"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_ueberblick" />

      {/* 7. ModuleFooter nach Styleguide */}
      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 14 KI: KI-VO-Fristen inkl. Digital Omnibus, Art. 50/14, DSGVO-Artikel, UrhG § 44b, Modellangaben auf reale Modellfamilien zurückgeführt; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Künstliche Intelligenz', url: 'https://de.wikipedia.org/wiki/K%C3%BCnstliche_Intelligenz' },
          { title: 'Maschinelles Lernen', url: 'https://de.wikipedia.org/wiki/Maschinelles_Lernen' },
          { title: 'Deep Learning', url: 'https://de.wikipedia.org/wiki/Deep_Learning' },
          { title: 'Retrieval-Augmented Generation', url: 'https://en.wikipedia.org/wiki/Retrieval-augmented_generation' },
          { title: 'Large Language Model', url: 'https://de.wikipedia.org/wiki/Gro%C3%9Fes_Sprachmodell' }
        ]}
        literatur={[
          'VDI-Statusreport: Künstliche Intelligenz im Bauwesen (Verein Deutscher Ingenieure e.V.)',
          'Goodfellow, I., Bengio, Y., Courville, A.: Deep Learning (MIT Press)',
          'Fraunhofer IESE: Leitfaden zur vertrauenswürdigen KI im industriellen Einsatz',
          'Karniadakis, G. E. et al.: Physics-informed machine learning (Nature Reviews Physics 3, 2021)'
        ]}
        regelwerke={[
          { title: 'Verordnung (EU) 2024/1689 (KI-Verordnung) – in Kraft 01.08.2024, gestaffelte Anwendung; geändert durch Verordnung (EU) 2026/1744 (Digital Omnibus, ABl. L vom 24.07.2026)', url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj' },
          { title: 'ISO/IEC 22989:2022 (Information technology — Artificial intelligence concepts and terminology)', url: 'https://www.iso.org/' },
          { title: 'DIN SPEC 92001 (Künstliche Intelligenz – Qualitätsanforderungen an KI-Module)' },
          { title: 'DIN EN ISO 19650 (Organisation von Daten zu Bauwerken / BIM)' }
        ]}
        formeln={
          activeTab === 'kernbegriffe'
            ? [
                {
                  formel: 'y = \\sigma\\left(\\sum_{i=1}^n w_i x_i + b\\right)',
                  erklaerung: 'Künstliches Neuron (Perzeptron): Gewichtete Summe der Eingangsgrößen x_i mit Gewichten w_i und Schwellenwert (Bias) b, überführt durch die Aktivierungsfunktion σ.',
                  quelle: 'Grundmodell des künstlichen Neurons'
                },
                {
                  formel: '\\text{Sim}_{\\cos}(\\mathbf{u}, \\mathbf{v}) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}',
                  erklaerung: 'Kosinus-Ähnlichkeit für Text-Embeddings in RAG-Systemen: Misst den Winkel zwischen der Frage u und dem Normabschnitt v im hochdimensionalen Vektorraum.',
                  quelle: 'Vektorsuche & Informationsrückgewinnung (IR)'
                }
              ]
            : activeTab === 'stand'
            ? [
                {
                  formel: 'f_{c,28} = f(w/z, c, s, \\text{Aggregates}, T_{\\text{cure}})',
                  erklaerung: 'Multivariates Regressions- / ML-Modell zur Prädiktion der 28-Tage-Betondruckfestigkeit aus Mischungsparametern und Aushärtebedingungen.',
                  quelle: 'Baustoff-Informatik & Betontechnologie'
                }
              ]
            : []
        }
      />
    </div>
  );
}
