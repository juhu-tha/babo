import React, { useState } from 'react';
import { 
  Cpu, 
  Cloud, 
  Server, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Coins, 
  Layers, 
  Lock, 
  Gauge, 
  FileText 
} from 'lucide-react';

interface ModelComparison {
  name: string;
  type: 'cloud' | 'local';
  providerOrWeights: string;
  normAccuracy: number; // 1-5 Sterne
  mathConsistency: number; // 1-5
  costPer1kPages: string;
  dataPrivacyLevel: 'Hoch (100% DSGVO)' | 'Mittel (US-Cloud, EU-SCC)' | 'Niedrig (Training aktiv)';
  vramOrSetup: string;
  idealUseInCivilEng: string;
  ratingNotes: string;
}

const COMPARISON_DATA: ModelComparison[] = [
  {
    name: 'Claude 5 Sonnet (Hybrid Thinking)',
    type: 'cloud',
    providerOrWeights: 'Anthropic Cloud API',
    normAccuracy: 5,
    mathConsistency: 5,
    costPer1kPages: 'ca. 3,80 €',
    dataPrivacyLevel: 'Mittel (US-Cloud, EU-SCC)',
    vramOrSetup: 'Reiner API-Key / Web-Interface',
    idealUseInCivilEng: 'Komplexe Baugutachten, statische Begründungsketten, Prüfingenieur-Ebene & autonome Tool-Orchestrierung.',
    ratingNotes: 'Weltweiter Spitzenreiter bei technischer Dokumentation, Code und agentischen Workflows. Bietet umschaltbares adaptives Denken (Extended Reasoning) für tiefgründige statische Plausibilisierungen.'
  },
  {
    name: 'OpenAI GPT-6 & o4-mini',
    type: 'cloud',
    providerOrWeights: 'OpenAI Cloud API',
    normAccuracy: 5,
    mathConsistency: 5,
    costPer1kPages: 'ca. 1,60 € bis 3,20 €',
    dataPrivacyLevel: 'Mittel (US-Cloud, EU-SCC)',
    vramOrSetup: 'Reiner API-Key / Web-Interface',
    idealUseInCivilEng: 'o4-mini für mathematisch-statische Herleitungen & Python-Code; GPT-6 als multimodaler Allrounder für 3D-Scans, Pläne und Schadensfotos.',
    ratingNotes: 'GPT-6 verbindet universelle Multimodalität mit integriertem Deep Reasoning und nativer Python-Sandbox (Advanced Data Analysis) zur fehlerfreien Versuchsauswertung.'
  },
  {
    name: 'Gemini 3.8 Flash & 4.0 Pro (Thinking)',
    type: 'cloud',
    providerOrWeights: 'Google Cloud / Vertex AI',
    normAccuracy: 5,
    mathConsistency: 5,
    costPer1kPages: 'ca. 0,50 € bis 2,00 €',
    dataPrivacyLevel: 'Mittel (US-Cloud, EU-SCC)',
    vramOrSetup: 'API-Key / Vertex AI Frankfurt',
    idealUseInCivilEng: 'Riesiges 2+ Mio. Token Kontextfenster für vollständige Normensammlungen, hunderte Bauakten, Punktwolken & Live-CAD.',
    ratingNotes: 'Aktueller Standard: Ultra-schnelle Latenz, nativer Multimodal-Core für CAD/Punktwolken und integriertes adaptives Denken mit unschlagbarem Preis-Leistungs-Verhältnis.'
  },
  {
    name: 'DeepSeek R2 (Open Reasoning)',
    type: 'local',
    providerOrWeights: 'DeepSeek / Open Weights (GGUF)',
    normAccuracy: 5,
    mathConsistency: 5,
    costPer1kPages: '0,00 € (Lokaler Strom)',
    dataPrivacyLevel: 'Hoch (100% DSGVO)',
    vramOrSetup: '10–24 GB VRAM (Qwen-Distill 14B/32B)',
    idealUseInCivilEng: 'Offene, transparente Nachweis-Plausibilisierung (zeigt den gesamten internen Denkprozess <think>).',
    ratingNotes: 'Open-Source-Spitzenreiter im mathematischen Reasoning. Reflektiert, widerlegt und verifiziert eigene Rechenschritte vor der endgültigen Ausgabe.'
  },
  {
    name: 'Qwen 3.8 Coder 32B Instruct',
    type: 'local',
    providerOrWeights: 'Open Source (GGUF Q4_K_M)',
    normAccuracy: 5,
    mathConsistency: 5,
    costPer1kPages: '0,00 € (Lokaler Strom)',
    dataPrivacyLevel: 'Hoch (100% DSGVO)',
    vramOrSetup: '20–24 GB VRAM (RTX 3090/4090/5090)',
    idealUseInCivilEng: 'Automatisierung, Python-Prüfmaschinenauswertung, IFC-Datenfilterung, FEM- & Statik-Skripte.',
    ratingNotes: 'Spitzenklasse beim fehlerfreien Generieren symbolischer Berechnungs-Skripte. Übertrifft viele proprietäre Cloud-Modelle im ingenieurtechnischen Coding.'
  },
  {
    name: 'Llama 4 70B Instruct',
    type: 'local',
    providerOrWeights: 'Meta AI (GGUF Q4_K_M)',
    normAccuracy: 5,
    mathConsistency: 5,
    costPer1kPages: '0,00 € (Lokaler Strom)',
    dataPrivacyLevel: 'Hoch (100% DSGVO)',
    vramOrSetup: '40–48 GB VRAM (2x RTX 3090/4090 oder Mac Studio 64GB)',
    idealUseInCivilEng: 'Gerichtliche Baugutachten, vertrauliche Schiedsgerichts-Akten, KRITIS-Infrastrukturbauten.',
    ratingNotes: 'Parität mit Spitzen-Cloud-Modellen bei vollständiger Offline-Garantie und 100 % DSGVO-Datensouveränität.'
  },
  {
    name: 'Qwen 3.8 14B Instruct',
    type: 'local',
    providerOrWeights: 'Open Source (Alibaba/Qwen GGUF)',
    normAccuracy: 5,
    mathConsistency: 5,
    costPer1kPages: '0,00 € (Lokaler Strom)',
    dataPrivacyLevel: 'Hoch (100% DSGVO)',
    vramOrSetup: '10–12 GB VRAM (RTX 3060/4060/5060)',
    idealUseInCivilEng: 'Der Sweet-Spot für jedes deutsche Ingenieurbüro. 100% datenschutzkonform auf Büro-PCs.',
    ratingNotes: 'Herausragendes deutsches Normenverständnis (DIN, EC2, DAfStb) und zuverlässige mechanische Gleichungen bei moderatem Hardware-Bedarf.'
  }
];

export default function ModelBenchmarkMatrix() {
  const [filterType, setFilterType] = useState<'all' | 'cloud' | 'local'>('all');

  const filtered = COMPARISON_DATA.filter(m => {
    if (filterType === 'cloud') return m.type === 'cloud';
    if (filterType === 'local') return m.type === 'local';
    return true;
  });

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5 text-amber-500">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < count ? 'opacity-100 font-bold' : 'opacity-20'}>★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-home-grau/20">
        <div>
          <h4 className="font-bold text-base text-text-main flex items-center gap-2">
            <Gauge className="text-shiraz w-5 h-5" />
            Benchmarking-Matrix: Cloud- vs. Lokale KI im Bauwesen
          </h4>
          <p className="text-xs text-text-main/70 mt-1">
            Objektive Gegenüberstellung für Ingenieurbüros: Normengenauigkeit, Rechenkonsistenz, Tokenkosten und Datenschutz.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex p-1 bg-slate-100 rounded-xl max-w-max self-start sm:self-center">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filterType === 'all' ? 'bg-white text-text-main shadow-xs' : 'text-slate-500 hover:text-text-main'
            }`}
          >
            Alle Modelle
          </button>
          <button
            onClick={() => setFilterType('cloud')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filterType === 'cloud' ? 'bg-white text-text-main shadow-xs' : 'text-slate-500 hover:text-text-main'
            }`}
          >
            Nur Cloud
          </button>
          <button
            onClick={() => setFilterType('local')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filterType === 'local' ? 'bg-white text-text-main shadow-xs' : 'text-slate-500 hover:text-text-main'
            }`}
          >
            Nur Lokal (Offline)
          </button>
        </div>
      </div>

      {/* Tabelle */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-home-grau/20 bg-off-white text-text-main/70 uppercase text-[10px] font-bold">
              <th className="p-3">Modell &amp; Architektur</th>
              <th className="p-3">Typ &amp; Plattform</th>
              <th className="p-3">Normengenauigkeit (DIN/EC)</th>
              <th className="p-3">Rechenkonsistenz</th>
              <th className="p-3">Kosten / 1.000 S.</th>
              <th className="p-3">Datenschutz (DSGVO)</th>
              <th className="p-3">Hardware / Anforderung</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-home-grau/20 text-xxs">
            {filtered.map((m) => (
              <tr key={m.name} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-bold text-text-main">
                  <div>{m.name}</div>
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5">{m.idealUseInCivilEng}</div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase inline-flex items-center gap-1 ${
                    m.type === 'cloud' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {m.type === 'cloud' ? <Cloud size={10} /> : <Server size={10} />}
                    {m.type}
                  </span>
                </td>
                <td className="p-3">
                  {renderStars(m.normAccuracy)}
                </td>
                <td className="p-3">
                  {renderStars(m.mathConsistency)}
                </td>
                <td className="p-3 font-mono font-bold text-slate-700">
                  {m.costPer1kPages}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                    m.dataPrivacyLevel.includes('Hoch') 
                      ? 'bg-emerald-100 text-emerald-900 font-bold' 
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {m.dataPrivacyLevel}
                  </span>
                </td>
                <td className="p-3 text-slate-600 font-mono text-[10px]">
                  {m.vramOrSetup}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fazit Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5">
          <h5 className="font-bold text-blue-900 flex items-center gap-1.5">
            <Cloud size={14} className="text-blue-700" />
            Wann ist die Cloud die richtige Wahl?
          </h5>
          <p className="text-xxs text-blue-950 leading-relaxed">
            Für wissenschaftliche Literaturrecherchen, unkritische Textzusammenfassungen, Sprachkorrekturen und das Auslesen riesiger PDF-Gutachten (1 Mio. Tokens), sofern keine vertraulichen Kundendaten oder Bauherrenpläne enthalten sind.
          </p>
        </div>

        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
          <h5 className="font-bold text-emerald-900 flex items-center gap-1.5">
            <Server size={14} className="text-emerald-700" />
            Wann ist die Lokale KI zwingend vorgeschrieben?
          </h5>
          <p className="text-xxs text-emerald-950 leading-relaxed">
            Bei patentierten Rezepturen, internen Kalkulationen, KRITIS-Infrastrukturprojekten, gerichtlichen Schadensgutachten und auf Baustellen ohne stabile Internetverbindung. Qwen 3.8 14B liefert hier maximale Sicherheit bei 0 € Folgekosten.
          </p>
        </div>
      </div>

    </div>
  );
}
