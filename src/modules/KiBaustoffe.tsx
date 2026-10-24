import React, { useState, useEffect } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { RelatedModules } from '@/src/components/ui/RelatedModules';
import ReactMarkdown from 'react-markdown';
import { useTabContext } from '@/src/contexts/TabContext';
import ToolsFuerThesen from '@/src/modules/ki/ToolsFuerThesen';
import FehlerRechtEthik from '@/src/modules/ki/FehlerRechtEthik';
import LokaleKI from '@/src/modules/ki/LokaleKI';
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
  Compass, 
  MessageSquare, 
  Copy, 
  Lightbulb, 
  ExternalLink,
  ChevronRight,
  Target,
  Loader2,
  ShieldAlert,
  Server,
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
  return <KiBaustoffeInhalt forceTab={forceTab} />;
}

function KiBaustoffeInhalt({ forceTab }: KiBaustoffeProps) {
  const { setActiveTab: oeffneModul } = useTabContext();

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
  const [hinweisBestaetigt, setHinweisBestaetigt] = useState<boolean>(false);

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
        // Systemanweisung legt der Server fest (keine Personifizierung, AI Act Art. 50)
        body: JSON.stringify({ prompt: customPromptText, hinweisBestaetigt })
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
    title = "Lokale KI & LM Studio (Datensouveränität)";
    description = "Betreiben Sie leistungsstarke Open-Source-LLMs (z. B. Qwen, Llama, DeepSeek) offline auf Ihrer büroeigenen Hardware – ohne Cloud-Übermittlung (DSGVO-Pflichten bleiben bestehen).";
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
          <button aria-pressed={activeTab === 'system'}
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'system' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Cpu size={16} /> a) Systemarchitektur
          </button>
          <button aria-pressed={activeTab === 'prompting'}
            onClick={() => setActiveTab('prompting')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'prompting' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <MessageSquare size={16} /> b) Prompting-Praxis
          </button>
          <button aria-pressed={activeTab === 'llmpraxis'}
            onClick={() => setActiveTab('llmpraxis')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'llmpraxis' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Terminal size={16} /> c) LLM-Praxis (Claude &amp; ChatGPT)
          </button>
          <button aria-pressed={activeTab === 'thesen'}
            onClick={() => setActiveTab('thesen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'thesen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <BookOpen size={16} /> d) Tools für Thesen
          </button>
          <button aria-pressed={activeTab === 'recht_ethik'}
            onClick={() => setActiveTab('recht_ethik')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'recht_ethik' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <ShieldAlert size={16} /> e) Fehler, Recht &amp; Ethik
          </button>
          <button aria-pressed={activeTab === 'lokal'}
            onClick={() => setActiveTab('lokal')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'lokal' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Server size={16} /> f) Lokale KI (LM Studio)
          </button>
          <button aria-pressed={activeTab === 'ressourcen'}
            onClick={() => setActiveTab('ressourcen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'ressourcen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Compass size={16} /> g) Unabhängige KI-Seiten
          </button>
          <button aria-pressed={activeTab === 'onlinekurse'}
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
                      <button aria-pressed={selectedMaterial === mat.id}
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
                      <button aria-pressed={selectedObjective === obj.id}
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
                      <button aria-pressed={selectedFormat === fmt.id}
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
                      <button aria-pressed={selectedTonality === tone.id}
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
                    maxLength={4000}
                    aria-label="Prompt (höchstens 4 000 Zeichen)"
                    onChange={(e) => setCustomPromptText(e.target.value)}
                    className="p-5 font-mono text-xs leading-relaxed bg-slate-950 text-emerald-400 overflow-y-auto whitespace-pre-wrap outline-none border-none focus:ring-0 resize-y max-h-80 select-all"
                  />

                  {/* Footer with run button */}
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <label className="flex items-start gap-2 text-xs text-slate-700 font-medium max-w-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hinweisBestaetigt}
                        onChange={(e) => setHinweisBestaetigt(e.target.checked)}
                        className="mt-0.5 accent-shiraz"
                      />
                      <span>
                        Der Prompt wird zur Beantwortung an Google (Gemini) übermittelt. Ich gebe keine personenbezogenen
                        oder vertraulichen Daten ein. Details in der <button type="button" onClick={() => oeffneModul('datenschutz')} className="underline text-shiraz">Datenschutzerklärung</button>.
                      </span>
                    </label>
                    <button
                      onClick={handleRunAiPrompt}
                      disabled={isLoadingAi || !hinweisBestaetigt}
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
                            ● KI-generiert (Google Gemini)
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
                            Die KI (Google Gemini) erzeugt eine Antwort …
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {apiMode === 'live' && (
                            <p role="note" className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                              KI-generierte Antwort (Google Gemini), nicht vom Autor geprüft. Inhalte können fehlerhaft sein und ersetzen keinen Nachweis und keine Normprüfung.
                            </p>
                          )}
                          <div className="prose prose-slate max-w-none text-xs text-text-main/90 font-normal space-y-4 markdown-body">
                            <ReactMarkdown>{aiOutput || ''}</ReactMarkdown>
                          </div>
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
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-950 bg-amber-50/70 p-1.5 rounded-lg border border-amber-100">
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
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100">
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
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-950 bg-indigo-50/70 p-1.5 rounded-lg border border-indigo-100">
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
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-950 bg-rose-50/70 p-1.5 rounded-lg border border-rose-100">
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

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      {activeTab === 'system' && (
        <>
      <FormulaDerivationBox
        title="Beispiel 1: Kosinus-Ähnlichkeit im RAG-Retrieval"
        zielGleichung="\cos\theta = \frac{\vec a \cdot \vec b}{|\vec a|\,|\vec b|}"
        schritte={[
          { titel: 'Vektoren', erklaerung: 'Frage-Embedding a und zwei Textabschnitte b (Expositionsklassen) und c (Schalung), vereinfacht dreidimensional:', formel: '\\vec a = (0{,}8;\\ 0{,}6;\\ 0),\\ \\vec b = (0{,}6;\\ 0{,}8;\\ 0),\\ \\vec c = (0;\\ 0{,}6;\\ 0{,}8)' },
          { titel: 'Skalarprodukte', erklaerung: 'Alle Vektoren haben die Länge 1, daher entspricht das Skalarprodukt direkt dem Kosinus:', formel: '\\vec a\\cdot\\vec b = 0{,}48 + 0{,}48 = 0{,}96;\\quad \\vec a\\cdot\\vec c = 0 + 0{,}36 + 0 = 0{,}36' },
          { titel: 'Ranking', erklaerung: 'Der Retriever übergibt Abschnitt b an das Sprachmodell:', formel: '\\cos\\theta_{ab} = 0{,}96 > \\cos\\theta_{ac} = 0{,}36' }
        ]}
        ergebnisHinweis="Hohe Ähnlichkeit heißt nur thematische Nähe, nicht fachliche Richtigkeit: Der gefundene Abschnitt muss aus der aktuellen Normausgabe stammen, sonst zitiert das System veraltete Werte."
        normQuelle="Grundlagen Information Retrieval; ISO/IEC 22989:2022"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Ausgabe eines einzelnen Neurons"
        zielGleichung="y = \sigma(z) = \frac{1}{1 + e^{-z}},\quad z = \sum w_i x_i + b"
        schritte={[
          { titel: 'Gewichtete Summe', erklaerung: 'Zwei normierte Eingänge x = (1,2; 0,4), Gewichte w = (0,8; −0,5), Bias b = 0,1:', formel: 'z = 0{,}8 \\cdot 1{,}2 - 0{,}5 \\cdot 0{,}4 + 0{,}1 = 0{,}86' },
          { titel: 'Aktivierung', erklaerung: 'Sigmoid-Funktion:', formel: 'y = \\frac{1}{1 + e^{-0{,}86}} = \\frac{1}{1 + 0{,}423} = 0{,}70' },
          { titel: 'Deutung', erklaerung: 'Bei einem Klassifikator für Riss ja/nein entspricht y einem Score, nicht einer kalibrierten Wahrscheinlichkeit:', formel: 'y = 0{,}70 > 0{,}5 \\Rightarrow \\text{Klasse Riss}' }
        ]}
        ergebnisHinweis="Ein Netz besteht aus Millionen bis Milliarden solcher Gewichte; die Schwelle 0,5 ist eine Festlegung und muss an Fehlerkosten (übersehener Riss vs. Fehlalarm) angepasst werden."
        normQuelle="Goodfellow/Bengio/Courville: Deep Learning (2016)"
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_system" />
        </>
      )}
      {activeTab === 'prompting' && (
        <>
      <FormulaDerivationBox
        title="Beispiel 1: Token- und Kostenabschätzung für eine Normenanalyse"
        zielGleichung="K = \frac{n_{in}}{10^6} \cdot p_{in} + \frac{n_{out}}{10^6} \cdot p_{out}"
        schritte={[
          { titel: 'Eingabe', erklaerung: '40 Seiten mit je 500 Wörtern; für deutsche Fachtexte etwa 1,5 Token pro Wort (Lehrannahme):', formel: 'n_{in} = 40 \\cdot 500 \\cdot 1{,}5 = 30\\,000\\ \\text{Token}' },
          { titel: 'Preise', erklaerung: 'Lehrwerte: 3 € je Million Eingabe-Token, 15 € je Million Ausgabe-Token; Ausgabe 2 000 Token:', formel: 'K = 0{,}03 \\cdot 3 + 0{,}002 \\cdot 15 = 0{,}09 + 0{,}03' },
          { titel: 'Ergebnis', erklaerung: 'Kosten je Anfrage:', formel: 'K = 0{,}12\\ \\text{€}' }
        ]}
        ergebnisHinweis="Tarife ändern sich häufig (Stand 10/2026; vor Nutzung beim Anbieter prüfen). Bei wiederholten Rückfragen wird der gesamte Verlauf erneut als Eingabe berechnet – die Kosten wachsen mit jeder Runde."
        normQuelle="Anbieter-Preislisten (Stand 10/2026)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Kontextfenster-Budget"
        zielGleichung="n_{frei} = n_{ctx} - n_{sys} - n_{res}"
        schritte={[
          { titel: 'Bilanz', erklaerung: 'Kontext 128 000 Token, Systemprompt 2 000, Reserve für die Antwort 8 000:', formel: 'n_{frei} = 128\\,000 - 2\\,000 - 8\\,000 = 118\\,000' },
          { titel: 'Seiten', erklaerung: 'Mit 750 Token pro Seite (500 Wörter × 1,5):', formel: 'n_S = \\frac{118\\,000}{750} = 157\\ \\text{Seiten}' },
          { titel: 'Konsequenz', erklaerung: 'Ein 300-seitiges Baugrundgutachten passt nicht vollständig hinein:', formel: '300 > 157 \\Rightarrow \\text{RAG oder Kapitelweise}' }
        ]}
        ergebnisHinweis="Auch wenn ein Dokument formal hineinpasst, sinkt die Trefferquote für Details in der Mitte langer Kontexte – wichtige Abschnitte gezielt zitieren lassen."
        normQuelle="Lehrbeispiel"
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_prompting" />
        </>
      )}
      {activeTab === 'llmpraxis' && (
        <>
      <FormulaDerivationBox
        title="Beispiel 1: Fehlerquote aus einer Stichprobenprüfung"
        zielGleichung="\hat p = \frac{k}{n}"
        schritte={[
          { titel: 'Stichprobe', erklaerung: 'Von 50 KI-gelieferten Normzitaten erweisen sich 6 als falsch oder veraltet:', formel: '\\hat p = \\frac{6}{50} = 0{,}12' },
          { titel: 'Hochrechnung', erklaerung: 'Erwartete Fehler in einem Bericht mit 200 Zitaten:', formel: 'E = 200 \\cdot 0{,}12 = 24' },
          { titel: 'Konsequenz', erklaerung: 'Jedes Zitat ist gegen die Originalquelle zu prüfen:', formel: 'E > 0 \\Rightarrow \\text{Vollprüfung}' }
        ]}
        ergebnisHinweis="Schon eine kleine Fehlerquote ist bei sicherheitsrelevanten Dokumenten nicht hinnehmbar. Die Stichprobe zeigt nur die Größenordnung, sie ersetzt keine Einzelprüfung."
        normQuelle="Lehrbeispiel; Prüfpflicht nach BGB § 633"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Mehrheitsentscheid aus drei Abfragen"
        zielGleichung="P_{Mehrheit} = p^3 + 3p^2(1-p)"
        schritte={[
          { titel: 'Annahme', erklaerung: 'Jede Abfrage liefert mit p = 0,8 das richtige Ergebnis, die Abfragen seien unabhängig:', formel: 'p = 0{,}8' },
          { titel: 'Rechnung', erklaerung: 'Mindestens zwei von drei richtig:', formel: 'P = 0{,}512 + 3 \\cdot 0{,}64 \\cdot 0{,}2 = 0{,}512 + 0{,}384 = 0{,}896' },
          { titel: 'Grenze', erklaerung: 'Bei systematischen Fehlern (gleiche falsche Trainingsquelle) sind die Abfragen nicht unabhängig:', formel: 'P \\to p = 0{,}8' }
        ]}
        ergebnisHinweis="Mehrfachabfragen erhöhen die Zuverlässigkeit nur bei zufälligen Fehlern. Gegen systematische Fehler hilft nur ein unabhängiger Rechenweg, z. B. Handrechnung oder geprüfte Software."
        normQuelle="Lehrbeispiel (Binomialverteilung)"
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_llmpraxis" />
        </>
      )}
      {activeTab === 'thesen' && (
        <>
      <FormulaDerivationBox
        title="Beispiel 1: Precision und Recall einer KI-Literatursuche"
        zielGleichung="P = \frac{TP}{TP + FP},\quad R = \frac{TP}{TP + FN}"
        schritte={[
          { titel: 'Treffer', erklaerung: 'Das Tool liefert 40 Artikel, davon 22 relevant; bekannt sind 30 relevante Artikel:', formel: 'TP = 22,\\ FP = 18,\\ FN = 8' },
          { titel: 'Precision', erklaerung: 'Anteil relevanter Treffer:', formel: 'P = \\frac{22}{40} = 0{,}55' },
          { titel: 'Recall', erklaerung: 'Anteil gefundener relevanter Artikel:', formel: 'R = \\frac{22}{30} = 0{,}73' }
        ]}
        ergebnisHinweis="Ein Viertel der relevanten Literatur fehlt. KI-Recherche ergänzt die systematische Suche in Fachdatenbanken und Bibliothekskatalogen, ersetzt sie aber nicht."
        normQuelle="Lehrbeispiel"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Bestimmtheitsmaß eines KI-generierten Auswerteskripts nachrechnen"
        zielGleichung="R^2 = 1 - \frac{SS_{res}}{SS_{tot}}"
        schritte={[
          { titel: 'Kennwerte', erklaerung: 'Das Skript gibt für eine Regression Festigkeit über w/z-Wert an:', formel: 'SS_{res} = 12,\\quad SS_{tot} = 150' },
          { titel: 'Rechnung', erklaerung: 'Handkontrolle:', formel: 'R^2 = 1 - \\frac{12}{150} = 1 - 0{,}08 = 0{,}92' },
          { titel: 'Abgleich', erklaerung: 'Weicht der vom Skript ausgegebene Wert ab, liegt ein Fehler im Code oder in den Daten vor:', formel: 'R^2_{Skript} \\overset{!}{=} 0{,}92' }
        ]}
        ergebnisHinweis="In der Abschlussarbeit sind Werkzeug, Version und Zweck des KI-Einsatzes zu deklarieren; die Verantwortung für die Auswertung liegt bei der Verfasserin oder dem Verfasser."
        normQuelle="Prüfungsordnung der Hochschule; Lehrbeispiel"
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_thesen" />
        </>
      )}
      {activeTab === 'recht_ethik' && (
        <>
      <FormulaDerivationBox
        title="Beispiel 1: Fristen der KI-Verordnung"
        zielGleichung="\Delta t = t_{Anwendung} - t_{heute}"
        schritte={[
          { titel: 'Gestaffelte Anwendung', erklaerung: 'In Kraft 1. August 2024; Verbote und KI-Kompetenz seit 2. Februar 2025; Modelle mit allgemeinem Verwendungszweck seit 2. August 2025; Art. 50 ab 2. August 2026:', formel: 't_0 = \\text{1. August 2024}' },
          { titel: 'Hochrisiko nach Digital Omnibus', erklaerung: 'Anhang III ab 2. Dezember 2027, Anhang I ab 2. August 2028:', formel: 't_{III} = \\text{2. Dezember 2027}' },
          { titel: 'Restzeit', erklaerung: 'Vom 20. Oktober 2026 bis zum 2. Dezember 2027:', formel: '\\Delta t = 365 + 31 + 12 = 408\\ \\text{Tage} \\approx 13{,}4\\ \\text{Monate}' }
        ]}
        ergebnisHinweis="Die Verschiebung betrifft die Hochrisiko-Pflichten; sie gilt seit Inkrafttreten der Verordnung (EU) 2026/1744 (ABl. L vom 24.07.2026) am 27.07.2026. Der Omnibus führt zudem ab 02.12.2026 zusätzliche Verbote ein."
        normQuelle="Verordnung (EU) 2024/1689 Art. 113; Digital Omnibus zur KI-VO"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Bußgeldrahmen nach DSGVO"
        zielGleichung="B_{max} = \max\left(20\ \text{Mio. €};\ 0{,}04 \cdot U\right)"
        schritte={[
          { titel: 'Großunternehmen', erklaerung: 'Weltweiter Jahresumsatz U = 800 Mio. €:', formel: '0{,}04 \\cdot 800 = 32\\ \\text{Mio. €} > 20\\ \\text{Mio. €}' },
          { titel: 'Ingenieurbüro', erklaerung: 'Jahresumsatz U = 5 Mio. €:', formel: '0{,}04 \\cdot 5 = 0{,}2\\ \\text{Mio. €} < 20\\ \\text{Mio. €}' },
          { titel: 'Obergrenzen', erklaerung: 'Es gilt jeweils der höhere Betrag:', formel: 'B_{max} = 32\\ \\text{Mio. €}\\ \\text{bzw.}\\ 20\\ \\text{Mio. €}' }
        ]}
        ergebnisHinweis="Das sind Obergrenzen für schwere Verstöße (Art. 83 Abs. 5). Die tatsächliche Höhe richtet sich nach Art, Schwere, Dauer, Vorsatz und Mitwirkung (Art. 83 Abs. 2)."
        normQuelle="Verordnung (EU) 2016/679 Art. 83"
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_recht_ethik" />
        </>
      )}
      {activeTab === 'lokal' && (
        <>
      <FormulaDerivationBox
        title="Beispiel 1: Speicherbedarf eines quantisierten 14B-Modells"
        zielGleichung="M \approx \frac{N \cdot b}{8} + M_{KV}"
        schritte={[
          { titel: 'Gewichte', erklaerung: 'N = 14 · 10⁹ Parameter, Q4_K_M mit rund 4,85 bit je Gewicht:', formel: '\\frac{14 \\cdot 10^9 \\cdot 4{,}85}{8} = 8{,}5 \\cdot 10^9\\ \\text{Byte} \\approx 8{,}5\\ \\text{GB}' },
          { titel: 'Kontext-Cache', erklaerung: 'Für mittlere Kontextlängen rund 1,5 GB (Lehrannahme):', formel: 'M \\approx 8{,}5 + 1{,}5 = 10\\ \\text{GB}' },
          { titel: 'Hardware', erklaerung: 'Passt auf eine Grafikkarte mit 12 GB:', formel: '10\\ \\text{GB} < 12\\ \\text{GB}' }
        ]}
        ergebnisHinweis="Der Kontext-Cache wächst mit der Kontextlänge; sehr lange Dokumente benötigen deutlich mehr Speicher oder werden auf CPU/RAM ausgelagert und dann langsam."
        normQuelle="GGUF/llama.cpp-Dokumentation (github.com/ggml-org/llama.cpp)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Wirkung der Quantisierung bei einem 70B-Modell"
        zielGleichung="\frac{M_{Q4}}{M_{FP16}} = \frac{4{,}85}{16}"
        schritte={[
          { titel: 'FP16', erklaerung: '16 bit je Gewicht:', formel: 'M_{FP16} = \\frac{70 \\cdot 10^9 \\cdot 16}{8} = 140\\ \\text{GB}' },
          { titel: 'Q4_K_M', erklaerung: 'Rund 4,85 bit je Gewicht:', formel: 'M_{Q4} = \\frac{70 \\cdot 10^9 \\cdot 4{,}85}{8} = 42\\ \\text{GB}' },
          { titel: 'Verhältnis', erklaerung: 'Speichereinsparung:', formel: '\\frac{42}{140} = 0{,}30 \\Rightarrow -70\\ \\%' }
        ]}
        ergebnisHinweis="Quantisierung kostet etwas Genauigkeit, besonders bei Rechenaufgaben. 42 GB Gewichte erfordern 48 GB Grafikspeicher oder einen Rechner mit 64 GB gemeinsamem Speicher."
        normQuelle="Lehrbeispiel"
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_lokal" />
        </>
      )}
      {activeTab === 'ressourcen' && (
        <>
      <FormulaDerivationBox
        title="Beispiel 1: Unsicherheit eines Benchmark-Ergebnisses"
        zielGleichung="u = 1{,}96 \cdot \sqrt{\frac{p(1-p)}{n}}"
        schritte={[
          { titel: 'Messung', erklaerung: 'Modell A löst 78 % von n = 200 Aufgaben, Modell B 74 %:', formel: 'p_A = 0{,}78,\\quad p_B = 0{,}74' },
          { titel: '95-%-Intervall A', erklaerung: 'Normalapproximation:', formel: 'u = 1{,}96 \\cdot \\sqrt{\\frac{0{,}78 \\cdot 0{,}22}{200}} = 1{,}96 \\cdot 0{,}029 = 0{,}057' },
          { titel: 'Vergleich', erklaerung: 'Der Unterschied von 4 Prozentpunkten liegt innerhalb der Unsicherheit:', formel: '0{,}04 < 0{,}057' }
        ]}
        ergebnisHinweis="Ranglisten unabhängiger KI-Seiten sind Momentaufnahmen. Kleine Abstände sind statistisch oft nicht belastbar; maßgeblich ist ein eigener Test mit fachtypischen Aufgaben."
        normQuelle="Lehrbeispiel (Binomialverteilung)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Strombedarf und Emissionen einer lokalen Auswertung"
        zielGleichung="E = P \cdot t,\quad CO_2 = E \cdot f"
        schritte={[
          { titel: 'Energie', erklaerung: 'Grafikkarte 350 W, Rechenzeit 30 min:', formel: 'E = 0{,}35\\ \\text{kW} \\cdot 0{,}5\\ \\text{h} = 0{,}175\\ \\text{kWh}' },
          { titel: 'Emissionen', erklaerung: 'Emissionsfaktor des Strommixes als Lehrwert 0,36 kg CO₂/kWh (aktuellen UBA-Wert prüfen):', formel: 'CO_2 = 0{,}175 \\cdot 0{,}36 = 0{,}063\\ \\text{kg}' },
          { titel: 'Kosten', erklaerung: 'Strompreis 0,35 €/kWh (Lehrwert):', formel: 'K = 0{,}175 \\cdot 0{,}35 = 0{,}061\\ \\text{€}' }
        ]}
        ergebnisHinweis="Die Rechnung erfasst nur den Betrieb. Herstellung der Hardware und – bei Cloud-Diensten – Rechenzentrum und Kühlung kommen hinzu und sind schwer zu beziffern."
        normQuelle="Umweltbundesamt: CO₂-Emissionsfaktoren für den Strommix (manuell prüfen)"
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_ressourcen" />
        </>
      )}
      {activeTab === 'onlinekurse' && (
        <>
      <FormulaDerivationBox
        title="Beispiel 1: Ein Schritt des Gradientenabstiegs"
        zielGleichung="w_{neu} = w - \eta \cdot \frac{\partial L}{\partial w}"
        schritte={[
          { titel: 'Verlustfunktion', erklaerung: 'L(w) = (w − 1)², Startwert w = 2,0:', formel: 'L(2{,}0) = 1{,}0,\\quad \\frac{\\partial L}{\\partial w} = 2(w-1) = 2{,}0' },
          { titel: 'Schritt', erklaerung: 'Lernrate η = 0,1:', formel: 'w_{neu} = 2{,}0 - 0{,}1 \\cdot 2{,}0 = 1{,}8' },
          { titel: 'Kontrolle', erklaerung: 'Der Verlust sinkt:', formel: 'L(1{,}8) = 0{,}8^2 = 0{,}64 < 1{,}0' }
        ]}
        ergebnisHinweis="Zu große Lernraten lassen das Verfahren über das Minimum hinausspringen, zu kleine machen es langsam – ein Kernthema fast aller Einführungskurse in maschinelles Lernen."
        normQuelle="Goodfellow/Bengio/Courville: Deep Learning (2016), Kap. 4"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Lernzeit für einen Onlinekurs planen"
        zielGleichung="t_{ges} = t_{Video} \cdot f_{\text{Ü}}"
        schritte={[
          { titel: 'Aufwand', erklaerung: '24 h Videomaterial, Faktor 1,5 für Übungen und Nacharbeit (Erfahrungswert):', formel: 't_{ges} = 24 \\cdot 1{,}5 = 36\\ \\text{h}' },
          { titel: 'Wochenplan', erklaerung: '6 h je Woche verfügbar:', formel: 'n = \\frac{36}{6} = 6\\ \\text{Wochen}' },
          { titel: 'Leistungspunkte', erklaerung: 'Bei 30 h je ECTS-Punkt entspricht das etwa:', formel: '\\frac{36}{30} = 1{,}2\\ \\text{ECTS}' }
        ]}
        ergebnisHinweis="Ohne eigene Programmierübungen bleibt Videowissen oberflächlich; Lernziele vorab festlegen und mit einem kleinen eigenen Projekt abschließen."
        normQuelle="Lehrbeispiel; ECTS-Leitfaden"
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_onlinekurse" />
        </>
      )}
      {activeTab === 'anwendungen' && (
        <>
      <FormulaDerivationBox
        title="Beispiel 1: Festigkeitsprognose mit einem linearen Lehrmodell"
        zielGleichung="f_{c,pred} = a - b \cdot (w/z)"
        schritte={[
          { titel: 'Modell', erklaerung: 'Aus Laborreihen angepasst (Lehrwerte): a = 105 N/mm², b = 110 N/mm²:', formel: 'f_{c,pred} = 105 - 110 \\cdot (w/z)' },
          { titel: 'Prognose', erklaerung: 'Rezeptur mit w/z = 0,50:', formel: 'f_{c,pred} = 105 - 55 = 50\\ \\text{N/mm}^2' },
          { titel: 'Gültigkeit', erklaerung: 'Nur innerhalb des Trainingsbereichs (hier w/z 0,40 bis 0,65) belastbar:', formel: '0{,}40 \\le w/z \\le 0{,}65' }
        ]}
        ergebnisHinweis="Ein Prognosemodell ersetzt keine Erstprüfung und keinen Konformitätsnachweis. Außerhalb des Datenbereichs (andere Zemente, Zusatzstoffe) kann es grob falsch liegen."
        normQuelle="DIN EN 206 / DIN 1045-2:2023-08 (Erstprüfung)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Modellgüte mit MAE und RMSE"
        zielGleichung="MAE = \frac{1}{n}\sum |e_i|,\quad RMSE = \sqrt{\frac{1}{n}\sum e_i^2}"
        schritte={[
          { titel: 'Fehler', erklaerung: 'Vier Validierungswürfel, Abweichung Prognose minus Messung in N/mm²:', formel: 'e = (3;\\ -2;\\ 4;\\ -1)' },
          { titel: 'MAE', erklaerung: 'Mittlerer absoluter Fehler:', formel: 'MAE = \\frac{3 + 2 + 4 + 1}{4} = 2{,}5\\ \\text{N/mm}^2' },
          { titel: 'RMSE', erklaerung: 'Wurzel des mittleren quadratischen Fehlers:', formel: 'RMSE = \\sqrt{\\frac{9 + 4 + 16 + 1}{4}} = \\sqrt{7{,}5} = 2{,}74\\ \\text{N/mm}^2' }
        ]}
        ergebnisHinweis="Der RMSE gewichtet große Ausreißer stärker. Validierungsdaten dürfen nicht zum Training verwendet worden sein, sonst wird die Güte überschätzt."
        normQuelle="Lehrbeispiel"
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_baustoffe" />
        </>
      )}

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 14 KI: KI-VO-Fristen inkl. Digital Omnibus, Art. 50/14, DSGVO-Artikel, UrhG § 44b, Modellangaben auf reale Modellfamilien zurückgeführt; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Künstliche Intelligenz', url: 'https://de.wikipedia.org/wiki/K%C3%BCnstliche_Intelligenz' },
          { title: 'Maschinelles Lernen', url: 'https://de.wikipedia.org/wiki/Maschinelles_Lernen' }
        ]} 
        literatur={[ 
          'Russell, S.; Norvig, P.: Artificial Intelligence – A Modern Approach. 4. Aufl., Hoboken: Pearson 2021',
          'Goodfellow, I.; Bengio, Y.; Courville, A.: Deep Learning. Cambridge (MA): MIT Press 2016' 
        ]} 
        regelwerke={[ 
          { title: 'Verordnung (EU) 2024/1689 (KI-Verordnung) – gestaffelte Anwendung, geändert durch Verordnung (EU) 2026/1744 (Digital Omnibus, ABl. L vom 24.07.2026)', url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj' },
          { title: 'Verordnung (EU) 2016/679 (DSGVO)', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj' },
          { title: 'UrhG § 44b (Text und Data Mining) und § 60d (wissenschaftliche Forschung)', url: 'https://www.gesetze-im-internet.de/urhg/__44b.html' },
          { title: 'ISO/IEC 42001:2023 (KI-Managementsysteme)' }
        ]} 
        formeln={[
          { formel: 'f_{ck, simul} = \\phi_{AI}(w/z, Z_{kg}, PCE_{\\%}, d_{max}) \\quad \\text{[N/mm²]}', erklaerung: 'Prädiktive Druckfestigkeitsschätzung im KI-Modell' },
          { formel: 'GWP_{total} = \\sum_{i=1}^{n} m_i \\cdot GWP_i \\quad \\text{[kg CO₂-Eq]}', erklaerung: 'Optimierte Treibhauspotenzials-Zielfunktion des Agenten' }
        ]} 
      />
    </div>
  );
}
