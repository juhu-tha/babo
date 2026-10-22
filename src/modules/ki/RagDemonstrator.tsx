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

interface NormChunk {
  id: string;
  norm: string;
  section: string;
  title: string;
  content: string;
  vectorSim: number; // 0..1
  keyTopics: string[];
}

const SAMPLE_CHUNKS: NormChunk[] = [
  {
    id: 'chunk_1',
    norm: 'DIN 1045-2:2023 / DIN EN 206',
    section: 'Tabelle F.1.2',
    title: 'Grenzwerte für Beton nach Expositionsklassen (XC4, XD3, XF4)',
    content: 'Für die Expositionsklasse XF4 (hohe Wassersättigung mit Taumittel, z. B. Parkdecks und Spritzwasserzonen) gilt: max (w/z)_eq = 0,45, Mindestdruckfestigkeitsklasse C30/37, Mindestzementgehalt 320 kg/m³ bei LP-Beton oder 340 kg/m³ ohne LP-Zusatz.',
    vectorSim: 0.94,
    keyTopics: ['XF4', 'Taumittel', 'w/z-Wert', 'Luftporenbeton', 'C30/37']
  },
  {
    id: 'chunk_2',
    norm: 'DIN EN 1992-1-1 (EC2)',
    section: 'Abschnitt 4.4.1.2',
    title: 'Mindestbetondeckung c_min zum Korrosionsschutz',
    content: 'Die Mindestbetondeckung zum Schutz gegen Bewehrungskorrosion c_min,dur beträgt für Expositionsklasse XC4 bei 50 Jahren Nutzungsdauer und Betonstahl 25 mm. Bei Bauteiloberflächen der Anforderungsklasse XC1 reichen 10 mm.',
    vectorSim: 0.82,
    keyTopics: ['c_min', 'Betondeckung', 'XC4', 'Bewehrung', 'Dauerhaftigkeit']
  },
  {
    id: 'chunk_3',
    norm: 'DIN EN 1992-1-1 / NA',
    section: 'NDP zu 2.4.2.4',
    title: 'Nationale Teilsicherheitsbeiwerte für Baustoffe (Deutschland)',
    content: 'Für die ständige und vorübergehende Bemessungssituation gilt verbindlich nach deutschem Nationalen Anhang: Beton γ_c = 1,50 und Betonstahl γ_s = 1,15. Der Beiwert α_cc zur Berücksichtigung von Langzeitwirkungen beträgt 0,85.',
    vectorSim: 0.76,
    keyTopics: ['Teilsicherheitsbeiwert', 'γ_c = 1,50', 'γ_s = 1,15', 'α_cc = 0,85']
  },
  {
    id: 'chunk_4',
    norm: 'DIN 18533-1:2017',
    section: 'Tabelle 5',
    title: 'Wassereinwirkungsklassen bei erdberührten Bauteilen',
    content: 'W1-E: Bodenfeuchte und nichtdrückendes Wasser; W2-E: Drückendes Wasser (Grundwasser oder Hochwasser bis HHW); W3-E: Nicht drückendes Wasser auf erdüberschütteten Decken; W4-E: Spritzwasser am Wandsockel.',
    vectorSim: 0.61,
    keyTopics: ['W1-E', 'W2-E', 'Abdichtung', 'Bodenfeuchte', 'Grundwasser']
  }
];

export default function RagDemonstrator() {
  const [query, setQuery] = useState<string>('Welche Betonrezeptur und Betondeckung fordert die Norm für eine frost- und tausalzbeanspruchte Tiefgaragenrampe?');
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
            <Database className="text-shiraz w-5 h-5" />
            Interaktiver RAG-Demonstrator (Normen-Retrieval)
          </h4>
          <p className="text-xs text-text-main/70 mt-1">
            Visualisierung des 4-stufigen RAG-Pipelines: Embedding ➔ Vektorsuche ➔ Kontext-Injektion ➔ Halluzinationsfreie Antwort.
          </p>
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
            {ragActive ? 'RAG AKTIV (Quellentreu)' : 'RAG AUS (Reine LLM-Intuition)'}
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
          <p className="text-xxs text-text-main/70 leading-relaxed">
            Ingenieur formuliert Fragestellung in natürlicher Sprache.
          </p>
        </div>

        <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-shiraz text-white text-[9px] flex items-center justify-center font-mono">2</span>
              Vektor-Embedding
            </span>
            <span className="text-[10px] text-indigo-500 font-mono">1536 dim</span>
          </div>
          <p className="text-xxs text-text-main/70 leading-relaxed">
            Query wird in hochdimensionalen Zahlenvektor umgerechnet (<InlineMath math="\vec{q} \in \mathbb{R}^d" />).
          </p>
        </div>

        <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-shiraz text-white text-[9px] flex items-center justify-center font-mono">3</span>
              Cosine Similarity
            </span>
            <span className="text-[10px] text-emerald-600 font-mono">Top-{formatDeWert(topK)} Chunks</span>
          </div>
          <p className="text-xxs text-text-main/70 leading-relaxed">
            Vektordatenbank findet passendste Normenabschnitte nach Cosinus-Winkel.
          </p>
        </div>

        <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-shiraz text-white text-[9px] flex items-center justify-center font-mono">4</span>
              Prompt-Augmentation
            </span>
            <span className="text-[10px] text-amber-600 font-mono">Context Inject</span>
          </div>
          <p className="text-xxs text-text-main/70 leading-relaxed">
            LLM antwortet streng gebunden an die injizierten Normen-Auszüge.
          </p>
        </div>
      </div>

      {/* Query Input & Presets */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-text-main flex items-center justify-between">
          <span>Ingenieur-Fragestellung (User Prompt):</span>
          <span className="text-xxs text-slate-400 font-normal">Klicken Sie auf ein Baubeispiel:</span>
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setQuery('Welche Betonrezeptur und Betondeckung fordert die Norm für eine frost- und tausalzbeanspruchte Tiefgaragenrampe?')}
            className="px-2.5 py-1 text-xxs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
          >
            Tiefgaragenrampe (XF4 / XC4)
          </button>
          <button
            onClick={() => setQuery('Wie hoch sind die Teilsicherheitsbeiwerte für Beton und Stahl nach deutschem Eurocode 2?')}
            className="px-2.5 py-1 text-xxs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
          >
            Teilsicherheitsbeiwerte (γ_c / γ_s)
          </button>
          <button
            onClick={() => setQuery('Welche Wassereinwirkungsklasse gilt für eine Kellerwand gegen drückendes Grundwasser nach DIN 18533?')}
            className="px-2.5 py-1 text-xxs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
          >
            Bauwerksabdichtung (W2-E)
          </button>
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
            <Layers size={15} className="text-shiraz" />
            Treffer aus der Vektordatenbank (Normen-Chunks):
          </span>
          <div className="flex items-center gap-2 text-xxs">
            <span className="text-slate-500">Retrieval-Tiefe Top-K:</span>
            <select
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
          <Terminal size={15} className="text-shiraz" />
          Modellantwort im direkten Vergleich (Impact-Analyse):
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* OHNE RAG: HALLUZINATIONSGEFAHR */}
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-200 space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-red-200">
              <span className="text-xs font-bold text-red-900 flex items-center gap-1">
                <AlertTriangle size={14} className="text-red-600" />
                Ohne RAG (Freies LLM, reines Parametertraining)
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-red-200 text-red-900 font-bold rounded">
                Gefahr: Hoch
              </span>
            </div>
            <div className="text-xxs text-red-950 leading-relaxed space-y-2 bg-white/80 p-3 rounded-lg border border-red-150">
              <p>
                &quot;Für die Tiefgaragenrampe reicht üblicherweise ein <strong>C25/30 mit w/z = 0,55</strong>. Die Betondeckung kann mit <strong>20 mm</strong> angesetzt werden. Als Sicherheitsbeiwert für Beton nutze nach Eurocode 2 den Wert <strong>γ_c = 1,35</strong>.&quot;
              </p>
              <div className="pt-2 border-t border-red-150 text-[10px] text-red-800">
                <strong>Analyse der Fehler:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>w/z = 0,55 führt bei XF4 zu schnellem Frost-Tausalz-Abplatzen (Zulässig max. 0,45).</li>
                  <li>20 mm Betondeckung führt bei XC4/XD3 zu Chloridkorrosion der Bewehrung (min 25–40 mm erforderlich).</li>
                  <li>γ_c = 1,35 ist erfunden (DIN EN 1992-1-1/NA verlangt zwingend γ_c = 1,50).</li>
                </ul>
              </div>
            </div>
          </div>

          {/* MIT RAG: DETERMINISTISCH NORMENTREU */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-300 space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-700" />
                Mit RAG (Gesteuert durch gefundene Normen-Chunks)
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-200 text-emerald-900 font-bold rounded">
                Geprüft nach DIN / EC2
              </span>
            </div>
            <div className="text-xxs text-emerald-950 leading-relaxed space-y-2 bg-white/80 p-3 rounded-lg border border-emerald-200">
              <p>
                &quot;Gemäß <strong>DIN 1045-2 / DIN EN 206 (Tabelle F.1.2)</strong> ist für die Taumittel-Exposition <strong>XF4</strong> zwingend ein <strong>max (w/z)_eq = 0,45</strong> und eine Mindestfestigkeitsklasse <strong>C30/37</strong> einzuhalten (320 kg/m³ Zement bei LP-Beton).
              </p>
              <p>
                Für die Bewehrungsüberdeckung gilt nach <strong>DIN EN 1992-1-1 (Abschnitt 4.4.1.2)</strong> bei Expositionsklasse XC4 eine Mindestbetondeckung von <strong>c_min,dur = 25 mm</strong> (zzgl. Vorhaltemaß <InlineMath math="\Delta c_{dev} = 10\text{ mm}" /> ergibt sich das Nennmaß <InlineMath math="c_{nom} = 35\text{ mm}" />).
              </p>
              <p>
                Alle Tragfähigkeitsnachweise müssen verbindlich mit dem nationalen Teilsicherheitsbeiwert <strong>γ_c = 1,50</strong> geführt werden (DIN EN 1992-1-1/NA).&quot;
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
