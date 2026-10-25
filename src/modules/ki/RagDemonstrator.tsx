import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { 
  Search, 
  Database, 
  Layers, 
  AlertTriangle,
  ShieldCheck,
  Terminal
} from 'lucide-react';
import { InlineMath } from 'react-katex';
import inhalt from '@/content/ki/RagDemonstrator.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface NormChunk {
  id: string;
  norm: string;
  section: string;
  title: string;
  content: string;
  vectorSim: number; // 0..1
  keyTopics: string[];
}

const SAMPLE_CHUNKS: NormChunk[] = inhalt.daten.SAMPLE_CHUNKS;

export default function RagDemonstrator() {
  const [query, setQuery] = useState<string>(inhalt.werte.welcheBetonrezepturUndBetondeckung);
  const [topK, setTopK] = useState<number>(2);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [ragActive, setRagActive] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sortedChunks = [...SAMPLE_CHUNKS].sort((a, b) => b.vectorSim - a.vectorSim);
  const selectedChunks = sortedChunks.slice(0, topK);

  return (
    <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-home-grau/20">
        <div>
          <h4 className="font-bold text-base text-text-main flex items-center gap-2">
            <Database className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.interaktiverRagDemonstratorNormen} /></h4>
          <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.visualisierungDes4Stufigen} /></p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xxs font-bold text-text-main/60 uppercase">Modus:</span>
          <button
            onClick={() => setRagActive(!ragActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
              ragActive 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs' 
                : 'bg-red-50 text-red-800 border-red-300 shadow-xs'
            }`}
          >
            {ragActive ? <ShieldCheck size={14} className="text-emerald-600" /> : <AlertTriangle size={14} className="text-red-600" />}
            {ragActive ? inhalt.werte.ragAktivQuellentreu : inhalt.werte.ragAusReineLlm}
          </button>
        </div>
      </div>

      {/* Pipeline Visualisierung: 4 Schritte */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-shiraz text-white text-[9px] flex items-center justify-center font-mono">1</span>
              User Query
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Text</span>
          </div>
          <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.ingenieurFormuliertFragestellungIn} /></p>
        </div>

        <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-shiraz text-white text-[9px] flex items-center justify-center font-mono">2</span>
              Vektor-Embedding
            </span>
            <span className="text-[10px] text-indigo-500 font-mono">1536 dim</span>
          </div>
          <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.queryWirdInHochdimensionalen} /></p>
        </div>

        <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-shiraz text-white text-[9px] flex items-center justify-center font-mono">3</span><MdText text={inhalt.texte.cosineSimilarity} /></span>
            <span className="text-[10px] text-emerald-600 font-mono">Top-{formatDeWert(topK)} Chunks</span>
          </div>
          <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.vektordatenbankFindetPassendsteNormenabs} /></p>
        </div>

        <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-shiraz text-white text-[9px] flex items-center justify-center font-mono">4</span>
              Prompt-Augmentation
            </span>
            <span className="text-[10px] text-amber-600 font-mono"><MdText text={inhalt.texte.contextInject} /></span>
          </div>
          <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.llmAntwortetStrengGebunden} /></p>
        </div>
      </div>

      {/* Query Input & Presets */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-text-main flex items-center justify-between">
          <span><MdText text={inhalt.texte.ingenieurFragestellungUserPrompt} /></span>
          <span className="text-xxs text-slate-400 font-normal"><MdText text={inhalt.texte.klickenSieAufEin} /></span>
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setQuery(inhalt.werte.welcheBetonrezepturUndBetondeckung2)}
            className="px-2.5 py-1 text-xxs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
          ><MdText text={inhalt.texte.tiefgaragenrampeXf4Xc4} /></button>
          <button
            onClick={() => setQuery(inhalt.werte.wieHochSindDie)}
            className="px-2.5 py-1 text-xxs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
          ><MdText text={inhalt.texte.teilsicherheitsbeiwerteCS} /></button>
          <button
            onClick={() => setQuery(inhalt.werte.welcheWassereinwirkungsklasseGiltFür)}
            className="px-2.5 py-1 text-xxs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
          ><MdText text={inhalt.texte.bauwerksabdichtungW2E} /></button>
        </div>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 pl-10 text-xs bg-slate-50 border border-home-grau/30 rounded-xl focus:outline-none focus:border-shiraz focus:bg-white transition-all text-text-main"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Vektordatenbank: Gefundene Chunks & Similarity */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
            <Layers size={15} className="text-shiraz" /><MdText text={inhalt.texte.trefferAusDerVektordatenbank} /></span>
          <div className="flex items-center gap-2 text-xxs">
            <span className="text-slate-500"><MdText text={inhalt.texte.retrievalTiefeTopK} /></span>
            <select aria-label={inhalt.werte.retrievalTiefeTopK}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="bg-slate-100 border border-slate-300 rounded px-2 py-0.5 text-xs font-bold text-slate-700"
            >
              <option value={1}>Top-1 (streng)</option>
              <option value={2}>Top-2 (empfohlen)</option>
              <option value={3}>Top-3 (breit)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sortedChunks.map((chunk, idx) => {
            const isSelected = idx < topK && ragActive;
            return (
              <div 
                key={chunk.id} 
                className={`p-4 rounded-xl border transition-all text-xs ${
                  isSelected 
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-xs' 
                    : 'bg-off-white border-home-grau/20 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[11px] text-slate-800">
                    {chunk.norm} – {chunk.section}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    chunk.vectorSim > 0.85 
                      ? 'bg-emerald-200 text-emerald-900' 
                      : chunk.vectorSim > 0.7 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    Score: {formatDeZahl((chunk.vectorSim * 100), 1)} %
                  </span>
                </div>
                <h5 className="font-bold text-xs text-text-main mb-1">{chunk.title}</h5>
                <p className="text-xxs text-text-main/80 leading-relaxed italic bg-white/70 p-2.5 rounded-lg border border-slate-200">
                  &quot;{chunk.content}&quot;
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {chunk.keyTopics.map(t => (
                    <span key={t} className="px-1.5 py-0.5 bg-slate-200/70 text-slate-700 rounded text-[9px] font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gegenüberstellung: Generierte Antwort (RAG vs. OHNE RAG) */}
      <div className="space-y-3">
        <h5 className="text-xs font-bold text-text-main flex items-center gap-1.5">
          <Terminal size={15} className="text-shiraz" /><MdText text={inhalt.texte.modellantwortImDirektenVergleich} /></h5>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* OHNE RAG: HALLUZINATIONSGEFAHR */}
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-200 space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-red-200">
              <span className="text-xs font-bold text-red-900 flex items-center gap-1">
                <AlertTriangle size={14} className="text-red-600" /><MdText text={inhalt.texte.ohneRagFreiesLlm} /></span>
              <span className="text-[10px] px-2 py-0.5 bg-red-200 text-red-900 font-bold rounded"><MdText text={inhalt.texte.gefahrHoch} /></span>
            </div>
            <div className="text-xxs text-red-950 leading-relaxed space-y-2 bg-white/80 p-3 rounded-lg border border-red-150">
              <p><MdText text={inhalt.texte.fürDieTiefgaragenrampeReicht} /></p>
              <div className="pt-2 border-t border-red-150 text-[10px] text-red-800"><MdText text={inhalt.texte.analyseDerFehler} /><ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li><MdText text={inhalt.texte.wZ055} /></li>
                  <li><MdText text={inhalt.texte.t20MmBetondeckungFührt} /></li>
                  <li><MdText text={inhalt.texte.c135Ist} /></li>
                </ul>
              </div>
            </div>
          </div>

          {/* MIT RAG: DETERMINISTISCH NORMENTREU */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-300 space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-700" /><MdText text={inhalt.texte.mitRagGesteuertDurch} /></span>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-200 text-emerald-900 font-bold rounded"><MdText text={inhalt.texte.geprüftNachDinEc2} /></span>
            </div>
            <div className="text-xxs text-emerald-950 leading-relaxed space-y-2 bg-white/80 p-3 rounded-lg border border-emerald-200">
              <p><MdText text={inhalt.texte.gemäßDin10452} /></p>
              <p><MdText text={inhalt.texte.fürDieBewehrungsüberdeckungGilt} /></p>
              <p><MdText text={inhalt.texte.alleTragfähigkeitsnachweiseMüssenVerbind} /></p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
