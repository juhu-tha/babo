import React, { useState, useEffect } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { RelatedModules } from '@/src/components/ui/RelatedModules';
import ReactMarkdown from 'react-markdown';
import { InlineMath, BlockMath } from 'react-katex';
import ToolsFuerThesen from '@/src/modules/ki/ToolsFuerThesen';
import FehlerRechtEthik from '@/src/modules/ki/FehlerRechtEthik';
import LokaleKI from '@/src/modules/ki/LokaleKI';
import RagDemonstrator from '@/src/modules/ki/RagDemonstrator';
import LlmPraxis from '@/src/modules/ki/LlmPraxis';
import KiOnlinekurse from '@/src/modules/ki/KiOnlinekurse';
import KiGlossar from '@/src/modules/ki/KiGlossar';
import KiUeberblick from '@/src/modules/ki/KiUeberblick';
import Systemarchitektur from '@/src/modules/ki/Systemarchitektur';
import { 
  Sparkles, 
  Cpu, 
  BookOpen, 
  Terminal, 
  Users, 
  Compass, 
  MessageSquare, 
  Copy, 
  CheckCircle2, 
  ArrowRight, 
  Lightbulb, 
  ExternalLink,
  ChevronRight,
  Code,
  Zap,
  Play,
  RotateCcw,
  Target,
  Loader2,
  Sliders,
  Scale,
  Gauge,
  Leaf,
  Shield,
  ShieldAlert,
  Server,
  Hourglass,
  HelpCircle,
  GraduationCap,
  Briefcase,
  Video
} from 'lucide-react';

interface PromptTemplate {
  title: string;
  material: string;
  objective: string;
  promptText: string;
  explanation: string;
}

const promptPresetMaterials = [
  { id: 'beton', name: 'RC-Beton (Recycling-Beton)', description: 'Gesteinskörnungen und Klinkerreduktion' },
  { id: 'fliesenkleber', name: 'Zementärer Flexmörtel S1', description: 'Kunststoffmodifiziert nach DIN EN 12004' },
  { id: 'bsh', name: 'Brettschichtholz (BSH)', description: 'Anisotropie-Ausgleich im Holzbau' }
];

const promptObjectives = [
  { id: 'norm', name: 'Regelwerksprüfung & Konformität', desc: 'Übereinstimmung mit DIN / EN / Eurocode' },
  { id: 'schaden', name: 'Schadensanalyse & Prävention', desc: 'Mikromechanische Ursachenforschung' },
  { id: 'nachhaltig', name: 'LCA & CO₂-Optimierung', desc: 'Verminderung des Treibhauspotenzials' }
];

const promptFormats = [
  { id: 'report', name: 'Technisches Gutachten / Prosa', desc: 'Formeller Fließtext mit klaren Fachüberschriften' },
  { id: 'bullets', name: 'Kondensierte Checkliste / Stichpunkte', desc: 'Ideal zur schnellen Qualitätskontrolle' },
  { id: 'code', name: 'Interaktiver Python-Rechner', desc: 'Nutzung von Streamlit oder Matplotlib zur Simulation' }
];

const promptTonalities = [
  { id: 'scientific', name: 'Akademisch / Wissenschaftlich', desc: 'Exakte mikrostrukturelle & physikalische Terme' },
  { id: 'pragmatic', name: 'Baustellen-Pragmatisch', desc: 'Lösungsorientierte Einbau-Anweisungen' },
  { id: 'didactic', name: 'Didaktisch / Sokratischer Tutor', desc: 'Zwischenfragen & Eselsbrücken zum Lernen' }
];

// Generates dynamic prompt based on selection of 4 categories
function generateCustomPrompt(materialId: string, objectiveId: string, formatId: string, toneId: string): { promptText: string; explanation: string } {
  let materialName = "";
  let matSubject = "";
  switch (materialId) {
    case 'beton':
      materialName = "Recycling-Beton (RC-Beton mit Typ-1-Gesteinskörnung nach DIN EN 206 / DIN 1045-2)";
      matSubject = "Einsatz im Hochbau, Expositionsklassen XC1 bis XC4, Klinkerreduktion durch Hüttensandmehl.";
      break;
    case 'fliesenkleber':
      materialName = "Kunststoffmodifizierter zementärer Dünnbettmörtel (DIN EN 12004 Klasse C2 TE S1)";
      matSubject = "Verlegung von Großformatfliesen auf Heizestrich (thermodynamische Längenänderungen).";
      break;
    case 'bsh':
      materialName = "Brettschichtholz (BSH GL24h DIN EN 14080)";
      matSubject = "Einsatz in chemisch aggressiver Atmosphäre (Schwimmbaddach), Holzfeuchte-Steuerung.";
      break;
    default:
      materialName = "Standardbaustoff";
      matSubject = "Reguläre Bauanwendung.";
  }

  // 2. Objective / Role / Task instructions
  let role = "";
  let task = "";
  switch (objectiveId) {
    case 'norm':
      role = "Prüfsachverständiger für Baustoffe im Hoch- und Ingenieurbau";
      task = `Überprüfen Sie die baurechtliche Konformität des folgenden Materials:
Baustoff: ${materialName} (${matSubject})
- Führe alle harmonisierten Prüf- und Anforderungsnormen an (z. B. DIN, EN, ISO).
- Analysiere Leistungserklärungen (DoP), CE-Kennzeichnungen und bauaufsichtliche Zulassungen (abZ).
- Hebe kritische Kennwerte (Festigkeitsklassen, Schwindmaß, etc.) hervor.`;
      break;
    case 'schaden':
      role = "Unabhängiger Schadengutachter im Bauwesen mit Schwerpunkt Werkstoffmikromechanik";
      task = `Führe eine präventive Schadensanalyse und mikromechanische Ursachenforschung durch für:
Baustoff/Einsatzszenario: ${materialName} (${matSubject})
- Untersuche chemische Alterung (z.B. Carbonatisierung, Weichmacherverlust, Alkalitreiben) und physikalische Risiken.
- Definiere zerstörungsfreie oder laboratoriumstechnische Prüfverfahren (z.B. Dünnschliffmikroskopie, REM, FTIR-Spektroskopie) zum klaren Nachweis.`;
      break;
    case 'nachhaltig':
      role = "DGNB-Auditor und Fachexperte für Ökobilanzierung (LCA/EPD) nach DIN EN 15804";
      task = `Erstellen Sie ein Optimierungskonzept zur CO2-Reduktion bzw. Ressourceneinsparung für:
Baustoff/Einsatzszenario: ${materialName} (${matSubject})
- Optimiere die Lebenszyklus-Module A1-A3 (Rohstoffe/Herstellung), C3 (Rückbau) und D (Recyclingpotenzial).
- Schätze das Treibhauspotenzial (GWP in kg CO2-eq) ab und schlage konkrete Ersatzstoffe vor.`;
      break;
    default:
      role = "Bautechnischer Berater";
      task = `Analysiere den Baustoff ${materialName} im Kontext von ${matSubject}.`;
  }

  // 3. Output Format instructions
  let formatDesc = "";
  switch (formatId) {
    case 'report':
      formatDesc = "Präsentiere die Antwort als strukturierter technischer Bericht in Fließtext mit prägnanten ingenieurwissenschaftlichen Zwischenüberschriften (Einleitung, Untersuchung, Befund, Fazit).";
      break;
    case 'bullets':
      formatDesc = "Geben Sie die Ergebnisse als extrem kondensierte, tabelle-ähnliche oder listenbasierte Checkliste im Telegrammstil aus. Perfekt zur schnellen Qualitätskontrolle direkt am Bau.";
      break;
    case 'code':
      formatDesc = "Ergänze das Ergebnis um ein sauberes Python-Grafikskript (z.B. Streamlit- oder Matplotlib-Code), welches die numerischen Beziehungen, Festigkeitskurven oder CO₂-Einsparungen dieses Baustoffs visualisiert.";
      break;
    default:
      formatDesc = "Formatiere strukturiert.";
  }

  // 4. Tone / Target Audience instructions
  let toneDesc = "";
  switch (toneId) {
    case 'scientific':
      toneDesc = "Wählen Sie einen hochgradig sachlichen, präzisen, akademischen Schreibstil. Verwenden Sie exakte physikalische und mikrostrukturelle Fachbegriffe (z.B. Adhäsionsversagen, Hydratationswärme, Porengrößenverteilung).";
      break;
    case 'pragmatic':
      toneDesc = "Formuliere die Antwort maximal verständlich, praxisnah, direkt und lösungsorientiert. Verzichte auf unnötige akademische Schnörkel und fokussiere Sie auf einbaurelevante Handlungsempfehlungen für Poliere und Bauleiter.";
      break;
    case 'didactic':
      toneDesc = "Wählen Sie die Perspektive eines didaktischen Hochschul-Dozenten (sokratische Methode). Erkläre die Hintergründe schrittweise, formuliere 3 nützliche Zwischenfragen zum Selbststudium und schließe mit einer eingängigen Eselsbrücke (Mnemonic) ab.";
      break;
    default:
      toneDesc = "Schreibe sachbezogen.";
  }

  const promptText = `Rolle: Du agierst als ${role}.

Aufgabe und Kontext:
${task}

Formatvorgabe des Beitrags:
${formatDesc}

Tonalität & Zielgruppe:
${toneDesc}

Wichtig: Verweise explizit auf Baustoffeigenschaften und deutsches/europäisches Regelwerk. Nehmen Sie direkten Bezug auf die Praxis oder Nutzung beim Lernen.`;

  const explanation = `Dieser Prompt kombiniert perfekt die vier Säulen des Prompt Engineering:
1. **Spezifischer Baustoff-Kontext: ${materialName}**
2. **Fachspezifische Aufgabenstellung (Rolle & Task für ${objectiveId})**
3. **Erwartetes Ausgabe-Format: ${formatId}**
4. **Angepasste Tonalität: ${toneId}**
Er erzeugt hochpräzise Antworten frei von leerem Marketing-Slang.`;

  return { promptText, explanation };
}

interface KiBaustoffeProps {
  forceTab?: 'ueberblick' | 'system' | 'prompting' | 'anwendungen' | 'llmpraxis' | 'ressourcen' | 'thesen' | 'recht_ethik' | 'lokal' | 'onlinekurse';
}

export default function KiBaustoffe({ forceTab }: KiBaustoffeProps = {}) {
  if (forceTab === 'ueberblick') {
    return <KiUeberblick />;
  }

  const [localActiveTab, setLocalActiveTab] = useState<'system' | 'prompting' | 'llmpraxis' | 'ressourcen' | 'thesen' | 'recht_ethik' | 'lokal' | 'onlinekurse'>('system');
  const activeTab = forceTab || localActiveTab;
  const setActiveTab = (tab: 'system' | 'prompting' | 'llmpraxis' | 'ressourcen' | 'thesen' | 'recht_ethik' | 'lokal' | 'onlinekurse') => {
    if (!forceTab) {
      setLocalActiveTab(tab);
    }
  };

  // Prompting & Interactive AI State
  const [selectedMaterial, setSelectedMaterial] = useState<string>('beton');
  const [selectedObjective, setSelectedObjective] = useState<string>('norm');
  const [selectedFormat, setSelectedFormat] = useState<string>('report');
  const [selectedTonality, setSelectedTonality] = useState<string>('scientific');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  
  const [customPromptText, setCustomPromptText] = useState<string>('');
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [apiMode, setApiMode] = useState<'live' | 'simulated' | null>(null);

  // Sync custom prompt text when presets change
  useEffect(() => {
    const generated = generateCustomPrompt(selectedMaterial, selectedObjective, selectedFormat, selectedTonality);
    setCustomPromptText(generated.promptText);
  }, [selectedMaterial, selectedObjective, selectedFormat, selectedTonality]);

  // Handler to call backend Gemini proxy
  const handleRunAiPrompt = async () => {
    setIsLoadingAi(true);
    setAiOutput(null);
    setApiMode(null);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: customPromptText,
          systemInstruction: 'Du bist ein erfahrener Professor und Dr.-Ing. für Baustoffkunde und Bauchemie an der TH Augsburg.'
        })
      });
      const data = await res.json();
      if (data.error) {
        setAiOutput(`### ❌ Fehler bei der Anfrage\n\n${data.error}\n\n${data.details || ''}`);
        setApiMode('simulated');
      } else {
        setAiOutput(data.text);
        setApiMode(data.status); // 'live' or 'simulated'
      }
    } catch (err: any) {
      setAiOutput(`### ❌ Fehler\n\nVerbindung zum lokalen Server fehlgeschlagen: ${err.message}`);
      setApiMode('simulated');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const currentCustomPrompt = generateCustomPrompt(selectedMaterial, selectedObjective, selectedFormat, selectedTonality);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(customPromptText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Useful AI sites list
  const aiResources = [
    {
      name: "GitHub",
      url: "https://github.com",
      description: "Die weltweit größte Entwicklungs- und Open-Source-Plattform. Ein unschätzbarer Pool an gebrauchsfertigen KI-Repositories, bautechnischen Python-Skripten, CAD-Automatisierungen und ML-Modellen.",
      baucase: "Auffinden von Machine-Learning-Skripten zur videobasierten Risserkennung und automatisierten Auswertung von Druckversuchen.",
      iconCircle: "bg-slate-100 text-slate-800"
    },
    {
      name: "Futurepedia",
      url: "https://www.futurepedia.io",
      description: "Das führende Verzeichnis für künstliche Intelligenz. Aggregiert täglich die neuesten spezialisierten AI-Werkzeuge, geordnet nach praktischen Anwendungskategorien und Nutzerbewertungen.",
      baucase: "Schnelle Suche nach spezialisierten PDF-Analysetools zur Auslesung von mehrhundertseitigen Ausschreibungs- und Prüffertigungsdokumenten.",
      iconCircle: "bg-indigo-100 text-indigo-800"
    },
    {
      name: "THE DECODER",
      url: "https://the-decoder.de",
      description: "Hervorragendes deutsches Online-Fachmagazin und Info-Portal für Künstliche Intelligenz. Bietet fundierten, unabhängigen Journalismus, News-Analysen sowie tiefe Berichte über den Stand der Forschung.",
      baucase: "Verfolgen des aktuellen Forschungsstands bezüglich physikgestützter neuronaler Netze (PINNs) in Strömungs- und Festkörpersimulationen.",
      iconCircle: "bg-red-100 text-red-800"
    },
    {
      name: "Hugging Face",
      url: "https://huggingface.co",
      description: "Die universelle Open-Source-Plattform der weltweiten AI-Forschungscommunity. Hostet Millionen fertige, direkt nutzbare Machine-Learning-Modelle, Datensätze und Demos (Spaces).",
      baucase: "Lokales Herunterladen von quelloffenen Bildklassifizierungs-Modellen zur automatischen Klassifikation von Betonoberflächen-Schäden per Smartphone-Foto.",
      iconCircle: "bg-amber-100 text-amber-800"
    },
    {
      name: "AI Valley",
      url: "https://aivalley.ai",
      description: "Eine umfangreiche, kuratierte Plattform für Produktivitätswerkzeuge, modernste KI-Anwendungen und AI-Automatisierungslinks mit anwendernahem Praxisbezug.",
      baucase: "Recherche nach lokalen, datenschutzkonformen AI-Werkzeugen zur Zusammenfassung von Protokollen bei Baustellen-Jour-Fixes.",
      iconCircle: "bg-blue-100 text-blue-800"
    },
    {
      name: "There's An AI For That",
      url: "https://theresanaiforthat.com",
      description: "Die größte, chronologische Suchdatenbank für KI-Systeme weltweit. Listet tausende Tools für extrem spezifische Problemstellungen auf und lässt sich filtern.",
      baucase: "Spezifische Stichwortsuche für Nischenkomponenten wie automatische GIS-Geländemuster-Analysatoren oder Betonporen-Bildauswerter.",
      iconCircle: "bg-purple-100 text-purple-800"
    }
  ];

  // Dynamic header based on tab
  let title = "Künstliche Intelligenz (KI) in der Baustoffkunde";
  let description = "Werkzeuge wie LLMs, Maschinelles Lernen, Vibe Coding und KI-Agenten verändern die Art, wie Baustoffe entwickelt, geprüft und verplant werden. Dieses Modul vermittelt Grundlagen, Prompt-Konzepte, Live-Agenten-Simulationen und hilfreiche Ressourcen speziell für Bauingenieure.";

  if (activeTab === 'system') {
    title = "Systemarchitektur";
    description = "Schrittweise Erklärung aller Schlüsseltechnologien der Künstlichen Intelligenz (ML, Deep Learning, LLM, RAG, Computer Vision, Agenten und Edge-KI), ihrer mathematischen Mechanismen und praktischen bautechnischen Einsatzzwecke.";
  } else if (activeTab === 'prompting') {
    title = "Prompting-Praxis für Ingenieure";
    description = "Nutzen Sie den interaktiven Prompt-Optimierer, um präzise, ingenieurgerechte Arbeitsanweisungen mit klarer Tonalität und strukturiertem Output zu generieren.";
  } else if (activeTab === 'llmpraxis') {
    title = "LLM-Praxis: Effiziente Anwendung von Claude & ChatGPT";
    description = "Master-Workflows für Bauingenieure: Skills, MCP-Konnektoren, verlustfreie Markdown-Hierarchien, kuratierte Projektordner (CLAUDE.md) und quellenbasiertes Browser-Grounding.";
  } else if (activeTab === 'thesen') {
    title = "Tools für Thesen (Bachelor- & Masterarbeiten)";
    description = "Wissenschaftliches Arbeiten im Bauingenieurwesen: Von Literatur-Mapping (Elicit, Connected Papers) über quellentreue Synthese (NotebookLM, Overleaf) bis zur Prüfmaschinen-Datenauswertung (Python, Cursor) und KI-Deklarationsvorlagen.";
  } else if (activeTab === 'recht_ethik') {
    title = "Fehler, Anwendungsgrenzen, Recht & Ethik";
    description = "Sicherheits- und Haftungsrisiken von KI im Bauwesen: BGB-Werkvertragsrecht, HOAI-Sorgfaltspflichten, EU AI Act, Vermeidung von Normen-Halluzinationen und Rechenfehlern.";
  } else if (activeTab === 'lokal') {
    title = "Lokale KI & LM Studio (100% Datensouveränität)";
    description = "Betreiben Sie leistungsstarke Open-Source-LLMs (Qwen 3.8, Llama 4, DeepSeek R2) vollkommen offline auf Ihrer büroeigenen Hardware – datenschutzkonform nach DSGVO ohne Cloud-Zwang.";
  } else if (activeTab === 'ressourcen') {
    title = "Unabhängige KI-Ressourcen & Verzeichnisse";
    description = "Eine kuratierte Sammlung unabhängiger Suchdatenbanken, Forschungsplattformen und Repositories für weitreichende Recherchen im Bauwesen.";
  } else if (activeTab === 'onlinekurse') {
    title = "Onlinekurse & Video-Lernpfade für Bauingenieure";
    description = "Kuratierte deutschsprachige Tutorials, YouTube-Kanäle und Hochschul-MOOCs für Python, Data Science, Machine Learning, RAG-Pipelines und lokale KI im Ingenieurwesen.";
  }

  return (
    <div className="flex flex-col gap-8">
      
      {/* HEADER INFO */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Sparkles className="text-shiraz animate-pulse" /> {title}
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            {description}
          </p>
        </div>

        {/* INTERAKTIVES EINSTEIGER-GLOSSAR */}
        <div className="mt-5">
          <KiGlossar initialExpanded={!forceTab || activeTab === 'system'} />
        </div>

        {/* PRIMARY TABS */}
        {!forceTab && (
          <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'system' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Cpu size={16} /> a) Systemarchitektur
          </button>
          <button
            onClick={() => setActiveTab('prompting')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'prompting' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <MessageSquare size={16} /> b) Prompting-Praxis
          </button>
          <button
            onClick={() => setActiveTab('llmpraxis')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'llmpraxis' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Terminal size={16} /> c) LLM-Praxis (Claude &amp; ChatGPT)
          </button>
          <button
            onClick={() => setActiveTab('thesen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'thesen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <BookOpen size={16} /> d) Tools für Thesen
          </button>
          <button
            onClick={() => setActiveTab('recht_ethik')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'recht_ethik' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <ShieldAlert size={16} /> e) Fehler, Recht &amp; Ethik
          </button>
          <button
            onClick={() => setActiveTab('lokal')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'lokal' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Server size={16} /> f) Lokale KI (LM Studio)
          </button>
          <button
            onClick={() => setActiveTab('ressourcen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'ressourcen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Compass size={16} /> g) Unabhängige KI-Seiten
          </button>
          <button
            onClick={() => setActiveTab('onlinekurse')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'onlinekurse' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Video size={16} /> h) Onlinekurse
          </button>
        </div>
        )}

        {/* TAB 1: SYSTEMARCHITEKTUR */}
        {activeTab === 'system' && (
          <Systemarchitektur />
        )}

        {/* TAB 2: PROMPTING */}
        {activeTab === 'prompting' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <h3 className="font-extrabold text-base text-slate-800">Professionelles Prompt Engineering im Bauwesen</h3>
              <p className="text-xs text-text-main/70 leading-relaxed font-normal">
                Künstliche Intelligenz ist nur so scharf wie der eingegebene Text. Reines Chatten führt oft zu verallgemeinerndem "Schwafeln". Für prägnante Antworten nutzen Ingenieure strukturierte Templates, die dem Modell eine **Rolle**, klare **Aufgabenstellungen**, relevante **Randbedingungen** und das **Soll-Format** vorgeben.
              </p>
            </div>

            {/* INTERACTIVE BUILDER ZONE */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Target size={14} className="text-shiraz" /> Interaktiver Baustoff-Prompt-Generator
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                
                {/* Selector 1: Material */}
                <div className="space-y-1.5">
                  <label className="text-xxs font-black text-slate-500 uppercase tracking-wider block">1. Baustoff / Bauprodukt:</label>
                  <div className="space-y-2">
                    {promptPresetMaterials.map((mat) => (
                      <button
                        key={mat.id}
                        onClick={() => setSelectedMaterial(mat.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex justify-between items-center cursor-pointer ${
                          selectedMaterial === mat.id 
                            ? 'bg-shiraz text-white border-shiraz shadow-md font-bold' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-bold block text-xs truncate">{mat.name}</span>
                          <span className={`text-[10px] block truncate ${selectedMaterial === mat.id ? 'text-white/70' : 'text-slate-400 font-normal'}`}>{mat.description}</span>
                        </div>
                        <ChevronRight size={14} className={`flex-shrink-0 ml-1 ${selectedMaterial === mat.id ? 'text-white' : 'text-slate-400'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selector 2: Objective */}
                <div className="space-y-1.5">
                  <label className="text-xxs font-black text-slate-500 uppercase tracking-wider block">2. Zielsetzung / Aufgabe:</label>
                  <div className="space-y-2">
                    {promptObjectives.map((obj) => (
                      <button
                        key={obj.id}
                        onClick={() => setSelectedObjective(obj.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex justify-between items-center cursor-pointer ${
                          selectedObjective === obj.id 
                            ? 'bg-shiraz text-white border-shiraz shadow-md font-bold' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-bold block text-xs truncate">{obj.name}</span>
                          <span className={`text-[10px] block truncate ${selectedObjective === obj.id ? 'text-white/70' : 'text-slate-400 font-normal'}`}>{obj.desc}</span>
                        </div>
                        <ChevronRight size={14} className={`flex-shrink-0 ml-1 ${selectedObjective === obj.id ? 'text-white' : 'text-slate-400'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selector 3: Format */}
                <div className="space-y-1.5">
                  <label className="text-xxs font-black text-slate-500 uppercase tracking-wider block">3. Format / Ausgabeformat:</label>
                  <div className="space-y-2">
                    {promptFormats.map((fmt) => (
                      <button
                        key={fmt.id}
                        onClick={() => setSelectedFormat(fmt.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex justify-between items-center cursor-pointer ${
                          selectedFormat === fmt.id 
                            ? 'bg-shiraz text-white border-shiraz shadow-md font-bold' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-bold block text-xs truncate">{fmt.name}</span>
                          <span className={`text-[10px] block truncate ${selectedFormat === fmt.id ? 'text-white/70' : 'text-slate-400 font-normal'}`}>{fmt.desc}</span>
                        </div>
                        <ChevronRight size={14} className={`flex-shrink-0 ml-1 ${selectedFormat === fmt.id ? 'text-white' : 'text-slate-400'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selector 4: Tonality */}
                <div className="space-y-1.5">
                  <label className="text-xxs font-black text-slate-500 uppercase tracking-wider block">4. Tonalität / Zielgruppe:</label>
                  <div className="space-y-2">
                    {promptTonalities.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => setSelectedTonality(tone.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex justify-between items-center cursor-pointer ${
                          selectedTonality === tone.id 
                            ? 'bg-shiraz text-white border-shiraz shadow-md font-bold' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-bold block text-xs truncate">{tone.name}</span>
                          <span className={`text-[10px] block truncate ${selectedTonality === tone.id ? 'text-white/70' : 'text-slate-400 font-normal'}`}>{tone.desc}</span>
                        </div>
                        <ChevronRight size={14} className={`flex-shrink-0 ml-1 ${selectedTonality === tone.id ? 'text-white' : 'text-slate-400'}`} />
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* GENERATED PROMPT PREVIEW & LIVE RUN CONSOLE */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  {/* Header */}
                  <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal size={12} className="text-slate-500" /> Modell-Input (Direkt im Browser edtierbar)
                    </span>
                    <button
                      onClick={handleCopyPrompt}
                      className="bg-white hover:bg-slate-50 text-slate-700 hover:text-shiraz px-3 py-1.5 rounded-lg border border-slate-200 transition-all text-xxs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy size={12} />
                      {copySuccess ? "Kopiert!" : "In die Zwischenablage"}
                    </button>
                  </div>
                  
                  {/* Editable prompt text area */}
                  <textarea
                    rows={8}
                    value={customPromptText}
                    onChange={(e) => setCustomPromptText(e.target.value)}
                    className="p-5 font-mono text-xs leading-relaxed bg-slate-950 text-emerald-400 overflow-y-auto whitespace-pre-wrap outline-none border-none focus:ring-0 resize-y max-h-80 select-all"
                  />

                  {/* Footer with run button */}
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
                    <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                      Passen Sie den Prompt an und testen Sie die Analyse direkt.
                    </span>
                    <button
                      onClick={handleRunAiPrompt}
                      disabled={isLoadingAi}
                      className="bg-shiraz hover:bg-shiraz-dark text-white px-5 py-2.5 rounded-xl transition-all text-xs font-black flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isLoadingAi ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-white" />
                          <span>Gemini generiert...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} className="text-amber-300" />
                          <span>Analyse live ausführen</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 bg-amber-50/50 border-t border-slate-200 text-xxs text-amber-950 font-normal">
                    <div className="flex gap-1.5 items-center font-bold text-amber-900 mb-1">
                      <Lightbulb size={12} />
                      <span>Didaktischer Hintergrund:</span>
                    </div>
                    {currentCustomPrompt.explanation}
                  </div>
                </div>

                {/* LIVE GEMINI OUTPUT CARD */}
                {(isLoadingAi || aiOutput) && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-slate-900 text-white px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Cpu size={14} className="text-shiraz animate-pulse" />
                        <span className="text-xs font-bold font-mono">KI-Kernel-Terminal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isLoadingAi ? (
                          <span className="bg-slate-800 text-slate-300 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-lg border border-slate-700 flex items-center gap-1">
                            <Loader2 size={10} className="animate-spin" /> Verarbeite...
                          </span>
                        ) : apiMode === 'live' ? (
                          <span className="bg-emerald-950 text-emerald-400 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-lg border border-emerald-800">
                            ● Live-API (Gemini 3.5)
                          </span>
                        ) : (
                          <span className="bg-amber-950 text-amber-400 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-lg border border-amber-800">
                            ● Demo-Modus
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 bg-stone-50/50 min-h-[140px] leading-relaxed">
                      {isLoadingAi ? (
                        <div className="flex flex-col items-center justify-center p-8 gap-3 text-slate-400">
                          <Loader2 size={32} className="animate-spin text-shiraz" />
                          <p className="text-xs font-medium animate-pulse text-slate-500">
                            Professor Huber (AI) formuliert Ihre detaillierte Normen- und Schadensanalyse...
                          </p>
                        </div>
                      ) : (
                        <div className="prose prose-slate max-w-none text-xs text-text-main/90 font-normal space-y-4 markdown-body">
                          <ReactMarkdown>{aiOutput || ''}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ADVANCED PROMPTING TIPS */}
              <div className="mt-8 space-y-4">
                <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <Lightbulb size={16} className="text-amber-500" /> Goldene Regeln &amp; Prompt-Hacks für Ingenieure
                </h4>
                <p className="text-xs text-text-main/70 leading-relaxed font-normal">
                  Ergänzend zum Prompt-Generator können Sie diese bewährten Taktiken direkt in Ihren Entwurfsprozess integrieren, um Halluzinationen zu verhindern und exakte Regelwerksprüfungen zu forcieren.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-amber-50/[0.22] border border-amber-200/55 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-955 bg-amber-50/70 p-1.5 rounded-lg border border-amber-100">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] flex items-center justify-center font-black">1</span>
                      <span>Stelle Rückfragen vor der Bearbeitung</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                      Verhindern Sie falsche Annahmen der KI. Zwingen Sie das System dazu, Unbeziffertes proaktiv zu klären, bevor wertvolle Arbeitszeit mit ungenauen Antworten verloren geht.
                    </p>
                    <div className="p-2.5 bg-white rounded-xl border border-amber-100 font-mono text-[9.5px] text-slate-700 select-all">
                      &quot;Bevor du mit der Rezeptur-Berechnung beginnst: Stelle mir 3 gezielte Verständnisfragen zu den Expositionsklassen oder Baugrundverhältnissen, um Fehler zu minimieren.&quot;
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/[0.18] border border-emerald-200/40 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-955 bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-black">2</span>
                      <span>Regelwerke &amp; Absätze kritisch verifizieren</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                      LLMs halluzinieren gelegentlich Normnummern. Fordern Sie einen expliziten, zweitstufigen Prüfdurchlauf ein, der die Ergebnisse gegen deutsches/europäisches Recht abgleicht.
                    </p>
                    <div className="p-2.5 bg-white rounded-xl border border-emerald-100/80 font-mono text-[9.5px] text-slate-700 select-all">
                      &quot;Erstelle den Entwurf. Gehe das Dokument danach nochmals Schritt für Schritt durch und prüfe es kritisch auf Vereinbarkeit mit den Grenzwerten der DIN EN 206.&quot;
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50/[0.2] border border-indigo-200/40 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-955 bg-indigo-50/70 p-1.5 rounded-lg border border-indigo-100">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] flex items-center justify-center font-black">3</span>
                      <span>Chain of Thought (Herleitungsschritte fordern)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                      Fehler bei mathematischen Berechnungen verringern sich drastisch, wenn die KI gezwungen wird, Zwischenrechnungen und Annahmen zuerst auszuschreiben.
                    </p>
                    <div className="p-2.5 bg-white rounded-xl border border-indigo-100/80 font-mono text-[9.5px] text-slate-700 select-all">
                      &quot;Berechne mir die Packungsdichte der Gesteinskörnung. Leite jeden mathematischen Schritt nach dem Modell von Funk &amp; Dinger einzeln her, bevor du die Gesamtsumme nennst.&quot;
                    </div>
                  </div>

                  <div className="p-4 bg-rose-50/[0.18] border border-rose-200/40 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-955 bg-rose-50/70 p-1.5 rounded-lg border border-rose-100">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 text-[10px] flex items-center justify-center font-black">4</span>
                      <span>Referenzvorgaben bestimmen (Few-Shot Prompts)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                      Füttern Sie die KI mit einem kurzen Textmuster oder einer Tabellenstruktur, um das Design und die fachliche Tiefe der Antwort exakt abzustimmen.
                    </p>
                    <div className="p-2.5 bg-white rounded-xl border border-rose-100/80 font-mono text-[9.5px] text-slate-700 select-all">
                      &quot;Schreibe ein technisches Gutachten. Nutzen Sie exakt folgenden Aufbau: [Dauerhaftigkeitsklasse] / [Mikroskopischer Befund] / [Normbezug DIN 1045] / [Sanierungsempfehlung].&quot;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LLM-PRAXIS */}
        {activeTab === 'llmpraxis' && (
          <LlmPraxis embedded={true} />
        )}

        {/* TAB 6: TOOLS FÜR THESEN (BACHELOR- & MASTERARBEITEN) */}
        {activeTab === 'thesen' && (
          <ToolsFuerThesen />
        )}

        {/* TAB 7: FEHLER, RECHT & ETHIK */}
        {activeTab === 'recht_ethik' && (
          <FehlerRechtEthik />
        )}

        {/* TAB 8: LOKALE KI (LM STUDIO) */}
        {activeTab === 'lokal' && (
          <LokaleKI />
        )}

        {/* TAB 9: RESSOURCEN */}
        {activeTab === 'ressourcen' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <h3 className="font-extrabold text-base text-slate-800">Unabhängige KI-Anwendungen im Überblick</h3>
              <p className="text-xs text-text-main/70 leading-relaxed font-normal">
                Verwenden Sie für Ihre Studienprojekte, Laborberechnungen oder wissenschaftlichen Arbeiten stets das am besten geeignete Werkzeug. Nachfolgend finden Sie eine sorgfältig kuratierte Zusammenstellung mächtiger KI-Seiten mit direktem Best-Practice-Bezug für das Bauwesen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiResources.map((res) => (
                <div key={res.name} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className={`text-xxs font-extrabold px-2.5 py-1 rounded-full uppercase ${res.iconCircle}`}>
                        {res.name.split(' (')[0]}
                      </span>
                      <a 
                        href={res.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-slate-400 hover:text-shiraz transition-colors cursor-pointer"
                        title="Website öffnen"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                    
                    <h4 className="font-extrabold text-sm text-slate-800">{res.name}</h4>
                    <p className="text-xs text-text-main/70 leading-relaxed font-normal">{res.description}</p>
                    
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xxs font-normal text-slate-800 leading-normal">
                      <span className="font-bold text-shiraz uppercase tracking-wider text-[9px] block mb-0.5">Praxis-Nutzen im Bauwesen:</span>
                      {res.baucase}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: ONLINEKURSE & YOUTUBE-LERNPFADE */}
        {activeTab === 'onlinekurse' && (
          <KiOnlinekurse />
        )}

      </div>

      {/* Vernetzte Fachmodule & Querverweise */}
      <RelatedModules
        title="Verwandte Digitalisierungs- &amp; Planungsmodule"
        subtitle="Didaktisch vernetzte Querverweise zu BIM, Datenanalyse, Automatisierung und wissenschaftlicher Abschlussarbeit"
        modules={[
          {
            tab: 'bim_baustoffe',
            title: 'BIM & Materialdaten (IFC)',
            description: 'IFC4/IFC4.3-Klassifikation, benutzerdefinierte Property Sets (Pset) und Baustoffdatenübergabe.',
            tag: 'Digitales',
            badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200'
          },
          {
            tab: 'statistik',
            title: 'Datenanalyse & Statistik',
            description: 'Gauß-Normalverteilung, Konfidenzintervalle und Regressionsanalyse zur Validierung von ML-Modellen.',
            tag: 'Methodik',
            badgeColor: 'bg-sky-50 text-sky-700 border-sky-200'
          },
          {
            tab: 'thesen_projekte',
            title: 'Thesen & Semesterprojekte',
            description: 'Themenkatalog für Bachelor- und Masterarbeiten an der TH Augsburg mit KI- und Werkstofffokus.',
            tag: 'Forschung',
            badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
          },
          {
            tab: 'oekobilanz_lca',
            title: 'Ökobilanzierung (LCA/EPD)',
            description: 'GWP-Berechnung nach DIN EN 15804 zur KI-gestützten Optimierung von CO₂-neutralen Bindemitteln.',
            tag: 'Nachhaltigkeit',
            badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
          },
          {
            tab: 'messen_pruefen',
            title: 'Messen & Prüfen (Sensorik)',
            description: 'Sensoren, DMS und digitale Messdatenerfassung zur Speisung automatisierter Auswertungspipelines.',
            tag: 'Labor',
            badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
          },
          {
            tab: 'software',
            title: 'Engineering Software & Tools',
            description: 'Übersicht über FE-Software, BIM-Viewer, Python-Umgebungen und bauphysikalische Rechner.',
            tag: 'Werkzeuge',
            badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
          }
        ]}
      />

      <ModuleFooter 
        wikipedia={[
          { title: 'Künstliche Intelligenz', url: 'https://de.wikipedia.org/wiki/K%C3%BCnstliche_Intelligenz' },
          { title: 'Maschinelles Lernen', url: 'https://de.wikipedia.org/wiki/Maschinelles_Lernen' }
        ]} 
        literatur={[ 
          'Russel, S. et al.: Artificial Intelligence - A Modern Approach.',
          'Sacks, R. et al.: BIM and AI in Civil Engineering.' 
        ]} 
        regelwerke={[ 
          { title: 'DIN EN 15804 (Nachhaltigkeit von Bauwerken - Umweltdeklarationen für Produkte)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+15804' },
          { title: 'DIN 1045-2 (Beton, Stahlbeton und Spannbeton - Teil 2)', url: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2' }
        ]} 
        formeln={[
          { formel: 'f_{ck, simul} = \\phi_{AI}(w/z, Z_{kg}, PCE_{\\%}, d_{max}) \\quad \\text{[N/mm²]}', erklaerung: 'Prädiktive Druckfestigkeitsschätzung im KI-Modell' },
          { formel: 'GWP_{total} = \\sum_{i=1}^{n} m_i \\cdot GWP_i \\quad \\text{[kg CO₂-Eq]}', erklaerung: 'Optimierte Treibhauspotenzials-Zielfunktion des Agenten' }
        ]} 
      />
    </div>
  );
}
