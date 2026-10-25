// Ausgelagert aus src/modules/ki/KiUeberblick.tsx (AP 5.2)
import { formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import {
  Sparkles,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Clock,
  HelpCircle,
  Workflow,
  FileText,
  Lightbulb,
  Compass,
  Zap,
  Scale,
  ShieldCheck,
  Check,
  Target,
  FileCheck,
  Calculator
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { termsData } from './daten';

export interface KernbegriffeTabProps {
  detailSubTab: 'funktionsweise' | 'beispiele' | 'vergleich' | 'formel' | 'risiken';
  selectedExampleIndex: number;
  selectedTerm: 'ki' | 'ml' | 'dl' | 'llm' | 'rag' | 'vision' | 'agenten';
  setDetailSubTab: React.Dispatch<React.SetStateAction<'funktionsweise' | 'beispiele' | 'vergleich' | 'formel' | 'risiken'>>;
  setSelectedExampleIndex: React.Dispatch<React.SetStateAction<number>>;
  setSelectedTerm: React.Dispatch<React.SetStateAction<'ki' | 'ml' | 'dl' | 'llm' | 'rag' | 'vision' | 'agenten'>>;
}

export default function KernbegriffeTab({ detailSubTab, selectedExampleIndex, selectedTerm, setDetailSubTab, setSelectedExampleIndex, setSelectedTerm }: KernbegriffeTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Das Zwiebelschalenmodell */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" size={20} />
            Das Zwiebelschalen-Modell: Wie die Begriffe zusammenhängen
          </h3>
          <span className="text-[11px] font-mono bg-shiraz/10 text-shiraz px-2.5 py-1 rounded-full font-bold">
            Keine Synonyme!
          </span>
        </div>

        <p className="text-xs text-text-main/80 leading-relaxed">
          Oft werden die Begriffe <em>Künstliche Intelligenz</em>, <em>Machine Learning</em> und <em>Neuronale Netze</em> durcheinandergeworfen. In Wahrheit verhalten sie sich wie die Schalen einer Zwiebel – von der umfassenden Idee bis zum konkreten Spezialwerkzeug:
        </p>

        {/* Grafisches Schichten-Schema */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider">Ebene 1 (Äußerste Schale)</span>
            <h4 className="font-bold text-sm text-blue-900">Künstliche Intelligenz (KI)</h4>
            <p className="text-xs text-blue-800/80 leading-snug">
              Das Gesamtfeld: Jede Maschine, die menschenähnliche Problemlösungen zeigt (auch einfache Wenn-Dann-Logiken).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">Ebene 2 (Teilmenge)</span>
            <h4 className="font-bold text-sm text-indigo-900">Machine Learning (ML)</h4>
            <p className="text-xs text-indigo-800/80 leading-snug">
              Lernen aus Daten: Algorithmen finden mathematische Muster in Beispielen, ohne fest verdrahtete Regeln.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">Ebene 3 (Spezialisierung)</span>
            <h4 className="font-bold text-sm text-purple-900">Deep Learning</h4>
            <p className="text-xs text-purple-800/80 leading-snug">
              Mehrschichtige neuronale Netze für Rohdaten wie Fotos, Punktwolken oder Schwingungsspektren.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-shiraz/30 bg-shiraz/5 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-shiraz tracking-wider">Ebene 4 (Moderner Kern)</span>
            <h4 className="font-bold text-sm text-slate-900">LLMs & Generative KI</h4>
            <p className="text-xs text-slate-700 leading-snug">
              Transformer-Modelle, die Sprache, Normen, Tabellen oder Programmcode verstehen und neu generieren.
            </p>
          </div>
        </div>
      </div>

      {/* Interaktiver Detail-Erklärer */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <Lightbulb className="text-shiraz" size={20} />
          Die 7 Kernbegriffe der Bauinformatik & KI-Technologie im Detail
        </h3>

        {/* Term Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'ki', label: '1. Künstliche Intelligenz (KI-Systeme)' },
            { id: 'ml', label: '2. Maschinelles Lernen (ML)' },
            { id: 'dl', label: '3. Deep Learning (ANN / CNN)' },
            { id: 'llm', label: '4. Large Language Models (LLM)' },
            { id: 'rag', label: '5. Retrieval-Augmented Generation (RAG)' },
            { id: 'vision', label: '6. Computer Vision & Sensorik' },
            { id: 'agenten', label: '7. KI-Agenten & Tool-Use' }
          ].map((term) => (
            <button
              key={term.id}
              onClick={() => setSelectedTerm(term.id as "ml" | "rag" | "llm" | "vision" | "agenten" | "ki" | "dl")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedTerm === term.id
                  ? 'bg-shiraz text-white border-shiraz shadow-sm'
                  : 'bg-off-white text-text-main/80 border-home-grau/30 hover:border-home-grau hover:text-text-main'
              }`}
            >
              {term.label}
            </button>
          ))}
        </div>

        {/* Selected Term Detail Card */}
        {termsData[selectedTerm] && (
          <div className="bg-white rounded-2xl border border-home-grau/30 shadow-sm overflow-hidden space-y-0 animate-in fade-in duration-200">
            {/* Header Banner */}
            <div className="p-5 bg-off-white border-b border-home-grau/20 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-full">
                    {termsData[selectedTerm].badge}
                  </span>
                  <span className="text-xs bg-white px-2.5 py-1 rounded-md border border-home-grau/20 text-text-main/70 flex items-center gap-1 font-mono">
                    <Compass size={13} className="text-shiraz" />
                    Klassifikation: <strong>{termsData[selectedTerm].analogy}</strong>
                  </span>
                </div>
                <span className="text-[11px] text-text-main/60 bg-white px-2 py-0.5 rounded border border-home-grau/20">
                  Fachbegriff {['ki', 'ml', 'dl', 'llm', 'rag', 'vision', 'agenten'].indexOf(selectedTerm) + 1} von 7
                </span>
              </div>

              <div>
                <h4 className="text-xl font-black text-text-main">
                  {termsData[selectedTerm].title}
                </h4>
                <p className="text-xs text-text-main/80 mt-1 leading-relaxed">
                  {termsData[selectedTerm].summary}
                </p>
              </div>

              {/* Sub-Tab Navigation inside Term Card */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-home-grau/15">
                {[
                  { id: 'beispiele', label: '🏗️ 3 Ingenieur-Praxisanwendungen', count: 'EC / Normen' },
                  { id: 'funktionsweise', label: '📘 Systemarchitektur & Methodik', count: 'Algorithmen' },
                  { id: 'vergleich', label: '⚖️ Konventionell vs. KI-Workflow', count: 'Prozessanalyse' },
                  { id: 'formel', label: '📐 Mathematische Modellierung', count: 'LaTeX' },
                  { id: 'risiken', label: '⚠️ Normative Konformität & Haftung', count: 'Risikoklasse' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setDetailSubTab(st.id as "funktionsweise" | "beispiele" | "vergleich" | "formel" | "risiken")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      detailSubTab === st.id
                        ? 'bg-shiraz text-white border-shiraz shadow-sm'
                        : 'bg-white text-text-main/80 border-home-grau/30 hover:border-home-grau hover:text-text-main hover:bg-slate-50'
                    }`}
                  >
                    <span>{st.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                      detailSubTab === st.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {st.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Tab 1: 3 Bau-Praxisbeispiele im Detail */}
            {detailSubTab === 'beispiele' && (
              <div className="p-5 space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Target className="text-shiraz" size={18} />
                    <h5 className="font-bold text-sm text-text-main">
                      Ingenieurtechnische Anwendungsfälle aus Tragwerksplanung, Baustoffkunde & Bauüberwachung
                    </h5>
                  </div>
                  <span className="text-[11px] text-text-main/60">
                    Nachweise nach DIN EN, Eurocodes & VOB
                  </span>
                </div>

                {/* Example Selector Tabs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {termsData[selectedTerm].examples.map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedExampleIndex(idx)}
                      className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                        selectedExampleIndex === idx
                          ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold shadow-sm'
                          : 'bg-off-white/80 border-home-grau/25 text-text-main/80 hover:bg-white hover:border-home-grau'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider mb-1">
                        <span className="font-black">Anwendung {idx + 1}</span>
                        <span className="bg-white px-1.5 py-0.5 rounded border border-home-grau/20 text-text-main/60">
                          {ex.category.split('/')[0]}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-text-main line-clamp-1">
                        {ex.title}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Active Example Deep-Dive Card */}
                {termsData[selectedTerm].examples[selectedExampleIndex] && (
                  <div className="p-5 rounded-xl border border-shiraz/20 bg-gradient-to-br from-white to-shiraz/5 space-y-4 shadow-sm animate-in fade-in duration-150">
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-home-grau/15 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">
                          {termsData[selectedTerm].examples[selectedExampleIndex].category}
                        </span>
                        <h4 className="text-base font-bold text-text-main mt-1 flex items-center gap-2">
                          <span>Anwendungsfall {formatDeWert(selectedExampleIndex + 1)}:</span>
                          <span>{termsData[selectedTerm].examples[selectedExampleIndex].title}</span>
                        </h4>
                      </div>
                      <div className="text-xs bg-white px-3 py-1.5 rounded-lg border border-home-grau/25 text-slate-700 font-mono">
                        <strong>Normativer Bezug:</strong> {termsData[selectedTerm].examples[selectedExampleIndex].normRef}
                      </div>
                    </div>

                    <div className="text-xs text-text-main/80 bg-white/80 p-3 rounded-lg border border-home-grau/20">
                      <strong>Problemstellung & Normative Randbedingungen:</strong> {termsData[selectedTerm].examples[selectedExampleIndex].scenario}
                    </div>

                    {/* 4 Pillars: Input -> Process -> Output -> Benefit */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {/* 1. Input */}
                      <div className="p-3.5 bg-white rounded-xl border border-blue-200/80 space-y-1.5 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                          <FileText size={15} className="text-blue-600" />
                          <span>Eingangsgrößen & Datenbasis (Input):</span>
                        </div>
                        <p className="text-text-main/80 leading-relaxed">
                          {termsData[selectedTerm].examples[selectedExampleIndex].input}
                        </p>
                      </div>

                      {/* 2. Process */}
                      <div className="p-3.5 bg-white rounded-xl border border-purple-200/80 space-y-1.5 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-purple-900 font-bold">
                          <Cpu size={15} className="text-purple-600" />
                          <span>Algorithmische Prozessierung & Inferenz (Process):</span>
                        </div>
                        <p className="text-text-main/80 leading-relaxed">
                          {termsData[selectedTerm].examples[selectedExampleIndex].process}
                        </p>
                      </div>

                      {/* 3. Output */}
                      <div className="p-3.5 bg-white rounded-xl border border-emerald-200/80 space-y-1.5 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                          <CheckCircle2 size={15} className="text-emerald-600" />
                          <span>Prüffähiges Rechenergebnis & Artefakt (Output):</span>
                        </div>
                        <p className="text-text-main/80 leading-relaxed">
                          {termsData[selectedTerm].examples[selectedExampleIndex].output}
                        </p>
                      </div>

                      {/* 4. Benefit */}
                      <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 space-y-1.5 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                          <Zap size={15} className="text-amber-600" />
                          <span>Ingenieurtechnische Relevanz & Wirtschaftlichkeit:</span>
                        </div>
                        <p className="text-text-main/80 leading-relaxed font-semibold text-slate-800">
                          {termsData[selectedTerm].examples[selectedExampleIndex].benefit}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sub-Tab 2: Funktionsweise & Kern */}
            {detailSubTab === 'funktionsweise' && (
              <div className="p-5 space-y-5 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Technical Definition Box */}
                  <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-shiraz flex items-center gap-1.5">
                      <HelpCircle size={15} />
                      Wissenschaftliche Definition & Funktionsprinzip:
                    </h5>
                    <p className="text-xs text-text-main/80 leading-relaxed">
                      {termsData[selectedTerm].simpleExpl}
                    </p>
                  </div>

                  {/* Key Characteristics */}
                  <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                      <Check size={15} className="text-shiraz" />
                      Ingenieurwissenschaftliche Schlüsselmerkmale:
                    </h5>
                    <ul className="text-xs text-text-main/80 space-y-1.5 list-none">
                      {termsData[selectedTerm].keyCharacteristics.map((kc, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{kc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Step-by-Step Technical Mechanism */}
                <div className="space-y-3">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                    <Workflow size={15} className="text-shiraz" />
                    Prozessarchitektur & algorithmischer Signalfluss:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    {termsData[selectedTerm].technicalMechanism.map((mech, idx) => (
                      <div key={idx} className="p-3.5 bg-white rounded-xl border border-home-grau/25 space-y-1.5 shadow-2xs">
                        <span className="text-[10px] font-mono font-black text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">
                          Phase {mech.step}
                        </span>
                        <h6 className="font-bold text-text-main text-xs">{mech.title}</h6>
                        <p className="text-text-main/70 text-[11px] leading-relaxed">
                          {mech.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Klassischer Workflow vs. KI */}
            {detailSubTab === 'vergleich' && (
              <div className="p-5 space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                    <Scale className="text-shiraz" size={18} />
                    Komparative Prozessanalyse: Konventionelle Ingenieurmethodik vs. KI-gestützter Workflow
                  </h5>
                  <span className="text-xs font-bold text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-full font-mono">
                    {termsData[selectedTerm].classicVsAi.roiSummary}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Classical Side */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h6 className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Clock size={16} className="text-slate-500" />
                        {termsData[selectedTerm].classicVsAi.classicTitle}
                      </h6>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                        Konventionelle Methodik
                      </span>
                    </div>
                    <ol className="space-y-2 text-slate-700 list-decimal list-inside leading-relaxed">
                      {termsData[selectedTerm].classicVsAi.classicSteps.map((step, idx) => (
                        <li key={idx} className="pl-1">
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="p-2.5 bg-red-50 text-red-900 rounded-lg border border-red-200 text-[11px] flex items-start gap-1.5">
                      <AlertTriangle size={14} className="text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Systematische Schwachstelle:</strong> {termsData[selectedTerm].classicVsAi.classicDisadvantage}
                      </div>
                    </div>
                  </div>

                  {/* AI-Powered Side */}
                  <div className="p-4 bg-gradient-to-br from-shiraz/5 to-white rounded-xl border border-shiraz/30 space-y-3">
                    <div className="flex items-center justify-between border-b border-shiraz/20 pb-2">
                      <h6 className="font-bold text-shiraz flex items-center gap-1.5">
                        <Sparkles size={16} className="text-shiraz" />
                        {termsData[selectedTerm].classicVsAi.aiTitle}
                      </h6>
                      <span className="text-[10px] font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">
                        KI-gestützte Methodik
                      </span>
                    </div>
                    <ol className="space-y-2 text-text-main/90 list-decimal list-inside leading-relaxed">
                      {termsData[selectedTerm].classicVsAi.aiSteps.map((step, idx) => (
                        <li key={idx} className="pl-1 font-medium">
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 text-[11px] flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Ingenieurvorteil:</strong> {termsData[selectedTerm].classicVsAi.aiAdvantage}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 4: Mathematik & Formel */}
            {detailSubTab === 'formel' && (
              <div className="p-5 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                    <Calculator className="text-shiraz" size={18} />
                    Mathematisch-physikalische Modellierung & Zielfunktion
                  </h5>
                  <span className="text-xs font-mono text-text-main/70 bg-off-white px-2.5 py-1 rounded border border-home-grau/25">
                    {termsData[selectedTerm].math.formulaName}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                  <div className="text-xs text-text-main/70 font-semibold">
                    {termsData[selectedTerm].math.formulaText}
                  </div>
                  <div className="overflow-x-auto py-2">
                    <BlockMath math={termsData[selectedTerm].math.formula} />
                  </div>
                  <p className="text-xs text-text-main/80 max-w-2xl mx-auto leading-relaxed text-left bg-white p-3 rounded-lg border border-slate-200">
                    <strong>Mathematische Erläuterung:</strong> {termsData[selectedTerm].math.explanation}
                  </p>
                </div>

                {/* Variables Table */}
                <div className="space-y-2">
                  <h6 className="font-bold text-xs uppercase tracking-wider text-text-main">
                    Nomenklatur, physikalische Einheiten & Parameterbedeutung:
                  </h6>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {termsData[selectedTerm].math.variables.map((v, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-home-grau/25 flex items-start gap-3">
                        <div className="px-2 py-1 bg-slate-100 rounded text-slate-800 font-mono text-xs font-bold shrink-0">
                          <InlineMath math={v.sym} />
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-bold text-text-main text-xs">{v.name}</div>
                          <div className="text-[11px] text-text-main/70 leading-snug">{v.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 5: Risiken, Grenzen & Normen */}
            {detailSubTab === 'risiken' && (
              <div className="p-5 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-shiraz" size={18} />
                  <h5 className="font-bold text-sm text-text-main">
                    Normative Konformität, Fehlerschranken & Haftungsrechtliche Einordnung
                  </h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Main Risk */}
                  <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                      <AlertTriangle size={16} className="text-amber-600" />
                      <span>Kritische Fehlermodi & Systemgrenzen:</span>
                    </div>
                    <p className="text-amber-950/80 leading-relaxed text-[11px]">
                      {termsData[selectedTerm].pitfalls.mainRisk}
                    </p>
                  </div>

                  {/* Engineer Duty */}
                  <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                      <ShieldAlert size={16} className="text-blue-600" />
                      <span>Sorgfalts- & Prüfpflichten des Ingenieurs (BGB / HOAI / BauO):</span>
                    </div>
                    <p className="text-blue-950/80 leading-relaxed text-[11px]">
                      {termsData[selectedTerm].pitfalls.engineerDuty}
                    </p>
                  </div>

                  {/* Standards & Law */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                      <FileCheck size={16} className="text-slate-600" />
                      <span>Normativer & gesetzlicher Bezugsrahmen:</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed text-[11px] font-mono">
                      {termsData[selectedTerm].pitfalls.standards}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
