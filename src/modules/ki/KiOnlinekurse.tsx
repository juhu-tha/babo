import React, { useState, useMemo } from 'react';
import { 
  Video, 
  Play, 
  ExternalLink, 
  BookOpen, 
  GraduationCap, 
  Code, 
  Cpu, 
  Database, 
  CheckCircle2, 
  Search, 
  Filter, 
  Sparkles, 
  Terminal, 
  Clock, 
  Star, 
  ArrowRight, 
  Laptop, 
  Award, 
  Info, 
  Copy, 
  Check,
  Server,
  Layers,
  HelpCircle,
  Lightbulb,
  Youtube
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InlineMath, BlockMath } from 'react-katex';

interface OnlineCourse {
  id: string;
  title: string;
  channel: string;
  category: 'python' | 'ml_visual' | 'rag_nlp' | 'lokal_mcp' | 'hochschule';
  categoryLabel: string;
  badgeColor: string;
  url: string;
  duration: string;
  level: 'Einsteiger (0 Vorwissen)' | 'Fortgeschrittene Grundlagen' | 'Praxis & Projekt';
  summary: string;
  justification: string;
  constructionTransfer: string;
  highlightTopics: string[];
  recommendedStart: string;
}

const COURSES: OnlineCourse[] = [
  // 1. Python Grundlagen
  {
    id: 'felix_python',
    title: 'Python Komplettkurs für Anfänger (von Null auf Programmierer)',
    channel: 'Programmieren lernen (Felix Schweilm)',
    category: 'python',
    categoryLabel: 'Python Grundlagen',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    url: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
    duration: 'ca. 4 Stunden (Kompaktkurs)',
    level: 'Einsteiger (0 Vorwissen)',
    summary: 'Didaktisch strukturierter, fehlerfreier Einstieg in die moderne Python-Syntax. Behandelt Datentypen, Listen, Schleifen, Funktionen, Objektorientierung und Datei-Handling (Text, CSV, JSON).',
    justification: 'Ingenieurstudenten ohne Vorkenntnisse lernen hier in kürzester Zeit die unverzichtbare Basis. Der Dozent erklärt logisch, verzichtet auf unnötigen Informatik-Jargon und legt Wert auf sauberen Code.',
    constructionTransfer: 'Unerlässlich für das Einlesen von Labor-Prüfdaten (Zug-/Druckversuche), das Parsen von CSV-Dateien aus Gesteinsprüfungen und das Schreiben erster Berechnungsroutinen.',
    highlightTopics: ['Variablen & Datentypen', 'Dateizugriff (open/read/write)', 'Funktionen & Module', 'Fehlerbehandlung (try/except)'],
    recommendedStart: 'Kapitel 1 bis 6: Grundlagen, Listen & Dictionaries für Messwerte.'
  },
  {
    id: 'morpheus_datascience',
    title: 'Python für Data Science & Ingenieure: NumPy & Pandas',
    channel: 'Morpheus Tutorials',
    category: 'python',
    categoryLabel: 'Python & Data Science',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    url: 'https://www.youtube.com/playlist?list=PLNmsVeXQZj7rx5r9H5y4Vq_26_a8dI6Yc',
    duration: 'Playlist (ca. 6 Stunden)',
    level: 'Fortgeschrittene Grundlagen',
    summary: 'Fokussiert auf numerische Datenanalyse: Arrays mit NumPy, strukturierte Tabellen und Filterungen mit Pandas sowie technische Diagramme mit Matplotlib.',
    justification: 'Bauingenieure arbeiten fast nie mit isolierten Zahlen, sondern mit Messreihen, Zeitreihen (z. B. Sensorik bei Brückenprüfungen) und Tabellen. NumPy und Pandas sind der weltweite Standard für Messwertauswertungen.',
    constructionTransfer: 'Automatisierte Sieblinienberechnungen, Regressionsanalysen von Festigkeitskurven nach 2, 7 und 28 Tagen sowie grafische Gegenüberstellung von LCA-/GWP-Werten verschiedener Baustoffgemische.',
    highlightTopics: ['NumPy Arrays & Matrizenrechnung', 'Pandas DataFrame-Filterung', 'Diagramme mit Matplotlib', 'Export nach Excel/CSV'],
    recommendedStart: 'NumPy Grundlagen → Pandas DataFrames für Bautabellen.'
  },

  // 2. ML & Visualisierung
  {
    id: 'statquest_de',
    title: 'StatQuest: Machine Learning & Neuronale Netze visuell erklärt',
    channel: 'StatQuest mit Josh Starmer (Deutsche Synchronisation / Übersetzungen)',
    category: 'ml_visual',
    categoryLabel: 'ML & Mathe Visuell',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
    url: 'https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF',
    duration: 'Modulare Video-Häppchen (je 10-15 Min.)',
    level: 'Einsteiger (0 Vorwissen)',
    summary: 'Die weltweit gefeiertste visuelle Einführung in Machine Learning: Von linearer Regression und Entscheidungsbäumen über Gradient Descent bis hin zu neuronalen Netzen und Transformer-Architekturen.',
    justification: 'Entzaubert die angebliche "Black Box" der KI. Jeder Schritt wird mit anschaulichen Grafiken und geometrischen Konzepten erklärt – exakt so, wie Ingenieure mathematische Zusammenhänge am besten erfassen.',
    constructionTransfer: 'Verständnis dafür, wie ein Modell Betondruckfestigkeiten interpoliert, welche Rolle Gewichte und Bias spielen und warum Modelle außerhalb ihrer Trainingsdaten (Extrapolation) bei neuen Bindemitteln versagen können.',
    highlightTopics: ['Lineare & Nichtlineare Regression', 'Neuronale Netze Schritt für Schritt', 'Backpropagation & Gradient Descent', 'Transformer & Attention-Mechanismus'],
    recommendedStart: 'Video: "Neuronale Netze: Die absoluten Grundlagen".'
  },
  {
    id: '3blue1brown_de',
    title: 'Was ist ein neuronales Netz? & Wie lernen Transformer?',
    channel: '3Blue1Brown (Deutsche Version)',
    category: 'ml_visual',
    categoryLabel: 'Mathematische Ästhetik',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
    url: 'https://www.youtube.com/playlist?list=PL0-LLZsQ2S3Xp_n_J36b_kZ9r2-v79v_B',
    duration: '4-teilige Meisterserie (ca. 2 Stunden)',
    level: 'Fortgeschrittene Grundlagen',
    summary: 'Visuell atemberaubende mathematische Animationen von Grant Sanderson. Zeigt die Vektor- und Matrizenmultiplikationen innerhalb von Schichten (Layers) und Aktivierungsfunktionen.',
    justification: 'Bietet das tiefste intuitive Verständnis für Matrizenoperationen und hochdimensionale Vektorräume, die auch modernen LLMs zugrunde liegen.',
    constructionTransfer: 'Grundlegend für das Verständnis von Schadensmuster-Klassifikatoren (Risserkennung auf Betonoberflächen via Convolutional Neural Networks).',
    highlightTopics: ['Matrizenmultiplikation in Netzen', 'Gradientenabstieg im Vektorraum', 'Aktivierungsfunktionen (ReLU, Sigmoid)', 'Feature-Maps bei Bildanalysen'],
    recommendedStart: 'Kapitel 1: "Aber was ist ein neuronales Netz wirklich?".'
  },

  // 3. RAG, NLP & Vektordatenbanken
  {
    id: 'dahlitz_rag',
    title: 'Eigene Dokumente befragen mit LangChain, ChromaDB & Python (RAG)',
    channel: 'Florian Dahlitz (Python & AI)',
    category: 'rag_nlp',
    categoryLabel: 'RAG & Vektordatenbanken',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    url: 'https://www.youtube.com/results?search_query=florian+dahlitz+langchain+rag+deutsch',
    duration: 'Tutorial-Reihe (ca. 2,5 Stunden)',
    level: 'Praxis & Projekt',
    summary: 'Schritt-für-Schritt-Anleitung zum Aufbau einer lokalen RAG-Pipeline (Retrieval-Augmented Generation). Zeigt das Zerlegen von PDFs in Chunks, Erstellen von Embeddings und die semantische Suche in ChromaDB.',
    justification: 'RAG ist die Kerntechnologie für Bauingenieure zur Beherrschung riesiger Normenwerke (Eurocode, VOB, ZTV). Florian Dahlitz codet live ohne Marketing-Floskeln und zeigt echte Fehlersuche.',
    constructionTransfer: 'Direkt übertragbar: Bauen Sie Ihren eigenen interaktiven Frage-Assistenten für ein 200-seitiges Baugrundgutachten oder ein Brandschutzkonzept, der nur mit exakten Seitenzitaten antwortet.',
    highlightTopics: ['Text-Chunking & Overlap-Strategien', 'Sentence-Transformers (Embeddings)', 'Vektorspeicher ChromaDB / FAISS', 'Prompt-Augmentierung mit Kontext'],
    recommendedStart: 'Tutorial: "PDF Q&A System mit Python & Vektordatenbank in 20 Minuten".'
  },
  {
    id: 'heise_nlp',
    title: 'Wie LLMs, Tokens & Embeddings funktionieren: Praxistest & Konzepte',
    channel: 'heise online / c\'t Magazin',
    category: 'rag_nlp',
    categoryLabel: 'NLP & Tokenisierung',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    url: 'https://www.youtube.com/results?search_query=heise+online+ct+wie+funktionieren+llm+embeddings',
    duration: 'Fokussierte Sendungen (je 30-45 Min.)',
    level: 'Einsteiger (0 Vorwissen)',
    summary: 'Technisch fundierte, journalistisch neutrale Erklärungen aus dem c\'t-Labor: Wie verwandeln Sprachmodelle Text in Zahlenvektoren? Warum treten Halluzinationen auf und wie schützt man sich davor?',
    justification: 'Ideal zur Vorbereitung auf wissenschaftliche Arbeiten und Gutachten. Schafft ein kritisches Risikobewusstsein gegen blindes Vertrauen in KI-Generierungen.',
    constructionTransfer: 'Grundlage für die rechtlich belastbare Verwendung von LLMs bei Bedenkenanzeigen (VOB/B § 4) und Vergabeunterlagen nach HOAI.',
    highlightTopics: ['Token-Ökonomie & Kontextfenster', 'Halluzinationsursachen & Entropie', 'Datensicherheit bei Cloud-APIs', 'Embedding-Visualisierung'],
    recommendedStart: 'c\'t uplink: "Große Sprachmodelle verstehen und lokal betreiben".'
  },

  // 4. Lokale KI & MCP
  {
    id: 'jens_polomski_local',
    title: 'Lokale KI komplett kostenlos einrichten: Ollama, LM Studio & Open WebUI',
    channel: 'Jens Polomski / KI Mensch',
    category: 'lokal_mcp',
    categoryLabel: 'Lokale KI & Datenschutz',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    url: 'https://www.youtube.com/results?search_query=jens+polomski+ollama+lm+studio+deutsch',
    duration: 'Praxis-Tutorials (je 15-25 Min.)',
    level: 'Einsteiger (0 Vorwissen)',
    summary: 'Kompakte Schritt-für-Schritt-Anleitung zur Installation von LM Studio und Ollama auf Windows und Mac. Zeigt das Herunterladen von Open-Source-Modellen (Llama 3, Qwen, DeepSeek) im GGUF-Format.',
    justification: 'Bauunternehmen und Behörden verbieten vertraglich oft das Hochladen von Leistungsverzeichnissen und CAD-Plänen auf fremde US-Cloudserver. Lokale KI ist die einzige datenschutzkonforme Lösung für das Büro.',
    constructionTransfer: 'Betreiben Sie einen völlig autarken KI-Assistenten auf dem Büro-Laptop, der vertrauliche Kalkulationen und Prüfstatiken ohne Internetverbindung zusammenfasst.',
    highlightTopics: ['GGUF-Formate & Quantisierung (Q4/Q8)', 'VRAM-Hardwareanforderungen (RTX)', 'System-Prompts für lokale Modelle', 'REST-API Schnittstelle für Skripte'],
    recommendedStart: 'Tutorial: "LM Studio in 10 Minuten einrichten und offline nutzen".'
  },
  {
    id: 'mcp_architektur_de',
    title: 'Model Context Protocol (MCP) verstehen: Lokale Tools mit LLMs verbinden',
    channel: 'KI & Developer Workflows DE (Diverse Beiträge / Curated)',
    category: 'lokal_mcp',
    categoryLabel: 'MCP & Agenten-Schnittstellen',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    url: 'https://www.youtube.com/results?search_query=model+context+protocol+deutsch+tutorial+mcp',
    duration: 'Überblick & Walkthrough (ca. 45 Min.)',
    level: 'Praxis & Projekt',
    summary: 'Einführung in das offene Standardprotokoll MCP (Model Context Protocol). Erklärt, wie Claude Desktop oder Cursor lokale Schnittstellen (Dateisystem, SQL, Python-Skripte) sicher ansprechen können.',
    justification: 'MCP ist die Zukunft der Büroautomation. Statt Texte manuell hin- und herzukopieren, greift das Modell strukturiert auf lokale Baudaten und IFC-Modelle zu.',
    constructionTransfer: 'Anbindung eines lokalen Python-Skripts mit `ifcopenshell` an Claude Desktop: Das Modell ermittelt auf Zuruf die Kubatur aller tragenden Wände aus dem IFC4-Modell.',
    highlightTopics: ['JSON-RPC Schnittstellenstandard', 'claude_desktop_config.json konfigurieren', 'Filesystem & SQLite MCP-Server', 'Sicherheitsbarrieren & Berechtigungen'],
    recommendedStart: 'Video: "Was ist MCP und warum ersetzt es traditionelle Plugins?".'
  },

  // 5. Hochschul- & Zertifikatskurse
  {
    id: 'kicampus_ingenieure',
    title: 'KI-Campus: Die Lernplattform für Künstliche Intelligenz (BMFTR)',
    channel: 'KI-Campus (Gefördert vom BMFTR / Stifterverband)',
    category: 'hochschule',
    categoryLabel: 'Offizieller Hochschul-MOOC',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    url: 'https://ki-campus.org/',
    duration: 'Mehrwöchige Kurse (mit Leistungsnachweis/Zertifikat)',
    level: 'Einsteiger (0 Vorwissen)',
    summary: 'Offiziell akkreditierte Plattform der deutschen Bundesregierung in Kooperation mit führenden Universitäten (TU München, RWTH Aachen, DFKI). Bietet kostenlose Kurse zu Data Science, Machine Learning, Ethik und Recht.',
    justification: 'Höchste akademische Qualität, wissenschaftlich fundiert, zitierfähig und mit anerkanntem Leistungsnachweis (ECTS-Bescheinigung oder Zertifikat für den Lebenslauf).',
    constructionTransfer: 'Ideal zur Vorbereitung auf Bachelor- und Masterarbeiten sowie zur Dokumentation von Weiterbildungsnachweisen gegenüber Ingenieurkammern.',
    highlightTopics: ['Einführung in die KI für Ingenieure', 'Verantwortungsvoller Umgang mit Daten & Ethik', 'Mathematische Fundamente', 'Zertifikat & ECTS-Anerkennung'],
    recommendedStart: 'Kurs: "Dr. med. KI / KI für Natur- und Ingenieurwissenschaften".'
  },
  {
    id: 'tum_machine_learning',
    title: 'Angewandtes Maschinelles Lernen im Bauingenieurwesen',
    channel: 'TU München & Universitäts-Vorlesungen (OpenCourseWare / YouTube)',
    category: 'hochschule',
    categoryLabel: 'Universitätsvorlesung',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    url: 'https://www.youtube.com/results?search_query=machine+learning+civil+engineering+deutsch+vorlesung',
    duration: 'Semesterbegleitende Vorlesungsreihe',
    level: 'Fortgeschrittene Grundlagen',
    summary: 'Akademische Vorlesungen zur Anwendung datengetriebener Methoden im Bau- und Umweltingenieurwesen: Systemidentifikation, Sensorik, Monitoring und Finite-Elemente-Ergänzung.',
    justification: 'Verbindet die klassische Baumechanik mit modernen KI-Algorithmen und zeigt, wo die mathematischen Grenzen von Black-Box-Modellen im Sicherheitsnachweis liegen.',
    constructionTransfer: 'Zustandsüberwachung von Brücken (Structural Health Monitoring, SHM) und Schwingungsanalysen.',
    highlightTopics: ['Sensordaten-Fusion', 'Anomalie-Erkennung bei Tragwerken', 'Surrogat-Modelle für FE-Berechnungen', 'Validierung nach Eurocode-Sicherheitsbeiwerten'],
    recommendedStart: 'Vorlesungseinheit: "System-Identifikation & Datenaufbereitung im Bauwesen".'
  }
];

export default function KiOnlinekurse() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return COURSES.filter(course => {
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      const matchesSearch = searchQuery === '' || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.channel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.constructionTransfer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.highlightTopics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [selectedCategory, selectedLevel, searchQuery]);

  // Code snippet for quick engineering starter
  const pythonStarterCode = `# ==============================================================================
# BaustoffBoard Starter-Skript: Datenanalyse für Baustoffversuche in Python
# Ausführbar in Google Colab, Jupyter Lab oder lokal auf dem Rechner
# ==============================================================================
import numpy as np
import matplotlib.pyplot as plt

# 1. Labor-Messdaten: Betondruckfestigkeiten f_c [N/mm²] nach 28 Tagen
# Probenreihe C30/37 mit Recycling-Gesteinskörnung (RC-Anteil in %)
rc_anteil = np.array([0, 10, 20, 30, 45, 60, 80, 100])
fc_gemessen = np.array([42.5, 41.8, 39.4, 38.1, 35.6, 33.2, 30.5, 27.8])

# 2. Lineare Regression (Grundlegendes ML / Modellbildung)
koeff = np.polyfit(rc_anteil, fc_gemessen, deg=1)
modell_funktion = np.poly1d(koeff)
rc_trend = np.linspace(0, 100, 200)

print(f"Modell-Formel: f_c = {koeff[0]:.3f} * (RC-%) + {koeff[1]:.2f} N/mm²")
print(f"Prognostizierte Festigkeit bei 50% RC: {modell_funktion(50):.2f} N/mm²")

# 3. Wissenschaftliche Visualisierung (Ingenieur-Standard)
plt.figure(figsize=(8, 4.5), dpi=120)
plt.scatter(rc_anteil, fc_gemessen, color='#8B0000', s=60, label='Labor-Prüfkörper (Würfel 150mm)')
plt.plot(rc_trend, modell_funktion(rc_trend), color='#1e293b', linestyle='--', label='Regressionsgerade (ML-Schätzer)')
plt.axhline(37.0, color='#059669', linestyle=':', label='Charakt. Mindestfestigkeit f_ck,cube (C30/37)')

plt.title('Einfluss des RC-Gesteinsanteils auf die 28d-Druckfestigkeit', fontsize=12, fontweight='bold')
plt.xlabel('Rezyklierte Gesteinskörnung RC [%]', fontsize=10)
plt.ylabel('Druckfestigkeit f_c [N/mm²]', fontsize=10)
plt.grid(True, linestyle=':', alpha=0.6)
plt.legend(frameon=True, facecolor='#f8fafc', edgecolor='#cbd5e1')
plt.tight_layout()
plt.show()`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonStarterCode);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Video className="text-shiraz" /> Onlinekurse &amp; Video-Lernpfade für Bauingenieure
            </h2>
            <p className="text-xs text-text-main/60 mt-1">
              Kuratierte deutschsprachige Tutorials, YouTube-Kanäle und Hochschul-MOOCs – handverlesen für den schnellen, praxisnahen Einstieg in Python, ML, RAG und MCP.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-shiraz/10 text-shiraz px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 self-start md:self-auto">
            <Award size={15} /> Akademisch &amp; Praxisgeprüft
          </div>
        </div>

        {/* EINFÜHRUNGSBOX */}
        <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 mt-5 leading-relaxed space-y-3">
          <p>
            Im Bauingenieurwesen geht es nicht darum, Informatik von Grund auf neu zu erfinden. Vielmehr geht es um <strong>zielgerichtete Befähigung</strong>: Wie nutze ich Python, um hundert Labor-Zugversuche in 3 Sekunden auszuwerten? Wie baue ich eine RAG-Pipeline, die ein 400-seitiges Baugrundgutachten sekundenschnell durchsucht? Wie lasse ich lokale LLMs per MCP-Server sicher auf Projektordner zugreifen, ohne dass Betriebsgeheimnisse auf Cloud-Server gelangen?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="bg-white p-3 rounded-lg border border-home-grau/20 flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block">100% Deutsch &amp; Einsteigergerecht</strong>
                <span className="text-slate-500">Klare Erklärungen ohne ablenkenden Fachjargon oder Marketing-Hype.</span>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-home-grau/20 flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block">Direkter Bau-Transfer</strong>
                <span className="text-slate-500">Jedes Tutorial wird mit konkreten Anwendungsfällen (Eurocode, EPD, IFC, Labor) verknüpft.</span>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-home-grau/20 flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block">Gegen die "Tutorial Hell"</strong>
                <span className="text-slate-500">Kompakte Zeitfenster mit sofort lauffähigem Begleitcode zum Selbst-Ausprobieren.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5-STUFEN-FAHRPLAN (LEARNING ROADMAP) */}
        <div className="mt-8 pt-6 border-t border-home-grau/20">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="text-shiraz" size={18} />
            <h3 className="text-base font-bold text-slate-800">Der 5-Stufen-Lernpfad für das Bau- und Umweltingenieurwesen</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Stufe 1</span>
                  <Code size={16} className="text-emerald-600" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 mb-1">Python-Basics</h4>
                <p className="text-xxs text-slate-600 leading-relaxed">
                  Variablen, Schleifen, CSV-Importe und Listen zur Verwaltung von Baustoffkennwerten.
                </p>
              </div>
              <span className="text-xxs font-semibold text-slate-500 mt-3 pt-2 border-t border-slate-200">
                Empfehlung: Felix Schweilm
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">Stufe 2</span>
                  <Database size={16} className="text-teal-600" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 mb-1">NumPy &amp; Pandas</h4>
                <p className="text-xxs text-slate-600 leading-relaxed">
                  Messwertmatrizen, Sieblinien, Filterung riesiger Bautabellen und Plotting mit Matplotlib.
                </p>
              </div>
              <span className="text-xxs font-semibold text-slate-500 mt-3 pt-2 border-t border-slate-200">
                Empfehlung: Morpheus
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">Stufe 3</span>
                  <Cpu size={16} className="text-sky-600" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 mb-1">ML Visuell Verstehen</h4>
                <p className="text-xxs text-slate-600 leading-relaxed">
                  Regressionen, künstliche neuronale Netze und Transformer ohne Programmierstress begreifen.
                </p>
              </div>
              <span className="text-xxs font-semibold text-slate-500 mt-3 pt-2 border-t border-slate-200">
                Empfehlung: StatQuest DE
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Stufe 4</span>
                  <Terminal size={16} className="text-amber-600" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 mb-1">RAG &amp; Vektorsuche</h4>
                <p className="text-xxs text-slate-600 leading-relaxed">
                  Eigene PDF-Normen und Gutachten mit ChromaDB indexieren und präzise abfragen.
                </p>
              </div>
              <span className="text-xxs font-semibold text-slate-500 mt-3 pt-2 border-t border-slate-200">
                Empfehlung: Florian Dahlitz
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">Stufe 5</span>
                  <Server size={16} className="text-purple-600" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 mb-1">Lokale KI &amp; MCP</h4>
                <p className="text-xxs text-slate-600 leading-relaxed">
                  Modelle offline per LM Studio betreiben und IFC-/CAD-Tools über MCP anbinden.
                </p>
              </div>
              <span className="text-xxs font-semibold text-slate-500 mt-3 pt-2 border-t border-slate-200">
                Empfehlung: Jens Polomski / MCP
              </span>
            </div>

          </div>
        </div>

        {/* FILTER & SUCHE */}
        <div className="mt-8 pt-6 border-t border-home-grau/20 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Alle Kurse ({COURSES.length})
            </button>
            <button
              onClick={() => setSelectedCategory('python')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'python'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Python &amp; Data Science
            </button>
            <button
              onClick={() => setSelectedCategory('ml_visual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'ml_visual'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ML &amp; Mathe Visuell
            </button>
            <button
              onClick={() => setSelectedCategory('rag_nlp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'rag_nlp'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              RAG &amp; Vektordatenbanken
            </button>
            <button
              onClick={() => setSelectedCategory('lokal_mcp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'lokal_mcp'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Lokale KI &amp; MCP
            </button>
            <button
              onClick={() => setSelectedCategory('hochschule')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'hochschule'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Hochschule &amp; Zertifikate
            </button>
          </div>

          <div className="relative min-w-[240px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Thema, Tool oder Dozent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-shiraz bg-white text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* KURS-KARTEN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
          {filteredCourses.map(course => (
            <div 
              key={course.id}
              className="bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200/90 p-5 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* OBERE ZEILE: BADGES & KANAL */}
                <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
                  <span className={`text-xxs px-2.5 py-1 rounded-full font-bold border ${course.badgeColor}`}>
                    {course.categoryLabel}
                  </span>
                  <div className="flex items-center gap-2 text-xxs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-400" /> {course.duration}
                    </span>
                    <span>•</span>
                    <span className="text-slate-600 font-bold">{course.level}</span>
                  </div>
                </div>

                {/* TITEL & DOZENT */}
                <h4 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                  {course.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-shiraz font-semibold mb-3">
                  <Youtube size={14} className="text-red-600" /> {course.channel}
                </div>

                {/* ZUSAMMENFASSUNG */}
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {course.summary}
                </p>

                {/* BEGRÜNDUNG (WARUM FÜR INGENIEURE) */}
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 mb-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xxs font-bold text-slate-800 uppercase tracking-wider">
                    <Sparkles size={12} className="text-amber-500" /> Warum für Bauingenieure ausgewählt:
                  </div>
                  <p className="text-xxs text-slate-600 leading-relaxed">
                    {course.justification}
                  </p>
                </div>

                {/* KONKRETER BAU-TRANSFER */}
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/70 mb-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xxs font-bold text-amber-900 uppercase tracking-wider">
                    <Lightbulb size={12} className="text-amber-600" /> Konkreter Bau-Transfer:
                  </div>
                  <p className="text-xxs text-amber-950/80 leading-relaxed font-medium">
                    {course.constructionTransfer}
                  </p>
                </div>

                {/* HIGHLIGHT TOPICS */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {course.highlightTopics.map((topic, i) => (
                    <span key={i} className="text-xxs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* FOOTER-LEISTE MIT LINK */}
              <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between gap-3">
                <div className="text-xxs text-slate-500 truncate max-w-[260px]">
                  <strong>Start:</strong> {course.recommendedStart}
                </div>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-shiraz hover:bg-shiraz/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm hover:shadow shrink-0 cursor-pointer"
                >
                  <Play size={13} className="fill-white" /> Zum Kurs / Video
                  <ExternalLink size={12} />
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* INTERAKTIVER STARTER-CODE BLOCK */}
        <div className="mt-10 bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Terminal className="text-emerald-400" size={18} />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Sofort-Starter: Python-Datenanalyse für Baustoffprüfungen (Laborversuch)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Kopiere diesen Code direkt in <a href="https://colab.research.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline hover:text-emerald-300">Google Colab</a> oder Ihr lokales Jupyter Notebook, um das Gelernte ohne Installationsaufwand live auszuführen.
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 transition-all shrink-0 cursor-pointer"
            >
              {copiedSnippet ? (
                <>
                  <Check size={14} className="text-emerald-400" /> Kopiert!
                </>
              ) : (
                <>
                  <Copy size={14} /> Code kopieren
                </>
              )}
            </button>
          </div>

          <pre className="text-xxs font-mono bg-slate-950 p-4 rounded-xl overflow-x-auto text-slate-300 border border-slate-800/80 leading-relaxed max-h-72">
            <code>{pythonStarterCode}</code>
          </pre>
        </div>

        {/* METHODISCHE EMPFEHLUNG: VERMEIDUNG DER "TUTORIAL HELL" */}
        <div className="mt-8 bg-blue-50/70 p-5 rounded-2xl border border-blue-200/80 space-y-3">
          <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
            <Info size={16} className="text-blue-700" />
            Ingenieur-Didaktik: Wie man die „Tutorial Hell“ vermeidet
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-blue-950/80">
            <div>
              <strong className="block text-blue-900 mb-1">1. Nicht nur passiv zuschauen</strong>
              <span>Öffnen Sie parallel zum Video immer ein Notebook (z. B. Google Colab). Tippen Sie den Code selbst ab und provozieren Sie gezielt Tippfehler, um die Fehlermeldungen von Python zu verstehen.</span>
            </div>
            <div>
              <strong className="block text-blue-900 mb-1">2. Eigene Prüfdaten einsetzen</strong>
              <span>Ersetzen Sie die Beispieldaten des Dozenten sofort durch eigene Zahlen: Tragen Sie Prüfwerte aus Ihrem Baustofflabor, Festigkeitsklassen nach DIN EN 206 oder U-Werte Ihrer Bauphysik-Aufgabe ein.</span>
            </div>
            <div>
              <strong className="block text-blue-900 mb-1">3. Vibe Coding als Tutor nutzen</strong>
              <span>Verstehen Sie eine Fehlermeldung nicht? Kopiere die Zeile in Claude oder ChatGPT mit dem Prompt: <em>„Erkläre mir diese Python-Fehlermeldung für einen Bauingenieur-Anfänger in 2 Sätzen.“</em></span>
            </div>
          </div>
        </div>

      </div>

      {/* MODULE FOOTER */}
      <ModuleFooter
        wikipedia={[
          { title: 'Maschinelles Lernen', url: 'https://de.wikipedia.org/wiki/Maschinelles_Lernen' },
          { title: 'Python (Programmiersprache)', url: 'https://de.wikipedia.org/wiki/Python_(Programmiersprache)' },
          { title: 'Retrieval-Augmented Generation', url: 'https://de.wikipedia.org/wiki/Retrieval-Augmented_Generation' },
          { title: 'Künstliche Intelligenz', url: 'https://de.wikipedia.org/wiki/K%C3%BCnstliche_Intelligenz' }
        ]}
        literatur={[
          'Raschka, S. & Mirjalili, V.: Python Machine Learning: Maschinelles Lernen und Deep Learning mit Python (mitp Verlag)',
          'Russell, S. & Norvig, P.: Künstliche Intelligenz: Ein moderner Ansatz (4. Auflage, Pearson Studium)',
          'Stifterverband & BMFTR: Whitepaper KI-Campus – Kompetenzaufbau für die Hochschule der Zukunft'
        ]}
        regelwerke={[
          { title: 'EU AI Act (Verordnung (EU) 2024/1689 über künstliche Intelligenz)', url: 'https://eur-lex.europa.eu/' },
          { title: 'VDI 2221 (Methodik für die Entwicklung von technischen Produkten und Systemen)', url: 'https://www.vdi.de/' },
          { title: 'DIN EN ISO 19650 (Organisation von Daten zu Bauwerken - Informationsmanagement mit BIM)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+19650' }
        ]}
        weblinks={[
          { title: 'KI-Campus – Offizielle deutsche Lernplattform für KI', url: 'https://ki-campus.org/' },
          { title: 'Google Colab – Kostenlose Python-Umgebung im Browser', url: 'https://colab.research.google.com/' },
          { title: 'StatQuest mit Josh Starmer (YouTube)', url: 'https://www.youtube.com/@statquest' },
          { title: 'Model Context Protocol (Offizielle Spezifikation)', url: 'https://modelcontextprotocol.io/' }
        ]}
        formeln={[
          {
            formel: '\\text{Cosine Similarity} = \\cos(\\theta) = \\frac{\\mathbf{A} \\cdot \\mathbf{B}}{\\|\\mathbf{A}\\| \\|\\mathbf{B}\\|} = \\frac{\\sum_{i=1}^n A_i B_i}{\\sqrt{\\sum_{i=1}^n A_i^2} \\cdot \\sqrt{\\sum_{i=1}^n B_i^2}}',
            erklaerung: 'Mathematische Basis semantischer Vektorsuchen (RAG): Misst den Winkel zwischen der Benutzerfrage A und dem Normen-Chunk B im n-dimensionalen Embedding-Vektorraum.',
            quelle: 'Grundlagen des Information Retrieval / Vektordatenbanken'
          },
          {
            formel: '\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)^2',
            erklaerung: 'Mittlerer quadratischer Fehler (Mean Squared Error) als Standard-Verlustfunktion bei Regressionsmodellen zur Vorhersage von Baustoffkennwerten (z. B. Betondruckfestigkeit).',
            quelle: 'Mathematische Statistik / Maschinelles Lernen'
          }
        ]}
      />
    </div>
  );
}
