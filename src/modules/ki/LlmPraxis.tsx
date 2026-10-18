import React, { useState, useMemo } from 'react';
import { 
  Terminal, 
  Sparkles, 
  FolderTree, 
  FileCode, 
  Globe, 
  Cpu, 
  Copy, 
  Check, 
  Layers, 
  BookOpen, 
  Sliders, 
  Code, 
  AlertTriangle, 
  ArrowRight, 
  Database, 
  Bot, 
  CheckCircle2, 
  Share2,
  FileText,
  Search,
  Zap,
  ShieldCheck,
  FolderGit2,
  Table,
  Workflow,
  Laptop,
  CheckSquare,
  FileSpreadsheet,
  Download,
  ExternalLink,
  Shield,
  HelpCircle,
  Clock,
  Compass,
  FileCheck2,
  Scale
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

interface LlmPraxisProps {
  embedded?: boolean;
}

export default function LlmPraxis({ embedded = false }: LlmPraxisProps) {
  const [activeTab, setActiveTab] = useState<'uebersicht' | 'skills_konnektoren' | 'markdown' | 'verzeichnisse' | 'browser' | 'praxisvorlagen'>('uebersicht');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sub-tab states for enriched tabs
  const [skillSubTab, setSkillSubTab] = useState<'skills_system' | 'mcp_arch' | 'mcp_servers'>('skills_system');
  const [dirProjectType, setDirProjectType] = useState<'bauleitung' | 'pruefstatik' | 'masterarbeit'>('bauleitung');
  const [markdownView, setMarkdownView] = useState<'vergleich' | 'syntax' | 'rechner'>('vergleich');
  const [browserEngine, setBrowserEngine] = useState<'perplexity' | 'chatgpt_search' | 'claude_search'>('perplexity');

  // States for interactive prompt generator
  const [genRole, setGenRole] = useState<'pruefstatik' | 'bauleitung_vob' | 'sachverstaendiger' | 'baustofflabor' | 'nachhaltigkeit_lca'>('pruefstatik');
  const [genNorm, setGenNorm] = useState<'ec2_din1045' | 'vob_b' | 'din18533' | 'din_en_206' | 'geg_dgnb'>('ec2_din1045');
  const [genFormat, setGenFormat] = useState<'claudemd' | 'custom_gpt' | 'workflow_prompt'>('claudemd');
  const [genDetailLevel, setGenDetailLevel] = useState<'kompakt' | 'ausfuehrlich'>('ausfuehrlich');

  // Token calculator state
  const [calcDocPages, setCalcDocPages] = useState<number>(35);
  const [calcDocType, setCalcDocType] = useState<'pdf_scan' | 'pdf_text' | 'word_docx' | 'markdown'>('markdown');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  // Estimated tokens calculation based on format
  const tokenStats = useMemo(() => {
    let tokensPerPage = 650;
    let overheadFactor = 1.0;
    if (calcDocType === 'pdf_scan') {
      tokensPerPage = 1200; // OCR noise, base64 images
      overheadFactor = 2.4;
    } else if (calcDocType === 'pdf_text') {
      tokensPerPage = 850; // layout tags, repeated headers/footers
      overheadFactor = 1.4;
    } else if (calcDocType === 'word_docx') {
      tokensPerPage = 750; // XML overhead, styles
      overheadFactor = 1.2;
    } else {
      tokensPerPage = 420; // Pure clean markdown
      overheadFactor = 0.65;
    }
    const totalTokens = Math.round(calcDocPages * tokensPerPage * overheadFactor);
    const costInputClaude = (totalTokens / 1_000_000) * 3.0; // Sonnet $3/MTok
    const costCachedClaude = (totalTokens / 1_000_000) * 0.30; // 90% Prompt Caching discount
    const contextUsagePercent = Math.min(100, Math.round((totalTokens / 200_000) * 100));
    return { totalTokens, costInputClaude, costCachedClaude, contextUsagePercent };
  }, [calcDocPages, calcDocType]);

  // Dynamic generated template
  const generatedTemplate = useMemo(() => {
    const roleTitles = {
      pruefstatik: 'Prüfingenieur für Tragwerksplanung & Massivbau (Eurocode 2 & DIN 1045-2)',
      bauleitung_vob: 'Erfahrener Oberbauleiter mit VOB/B-, Nachtrags- und Abnahme-Fokus',
      sachverstaendiger: 'Öffentlich bestellter und vereidigter Sachverständiger für Bauschäden & Bauwerksdiagnostik',
      baustofflabor: 'Leiter Baustoffprüflabor (Erstprüfung, Konformitätskontrolle nach DIN EN 206 & DIN 1045)',
      nachhaltigkeit_lca: 'DGNB-Auditor & Berater für kreislaufgerechtes Bauen und Ökobilanzierung (LCA/LCC)'
    };

    const normGuidelines = {
      ec2_din1045: 'Grundlage aller Berechnungen sind DIN EN 1992-1-1 mit nationalem Anhang (NA) und DIN 1045-2. Verwende ausschließlich charakteristische Werte f_ck, f_yk und führe Bemessungswerte f_cd, f_yd transparent mit Teilsicherheitsbeiwerten (gamma_C=1,5, gamma_S=1,15) an.',
      vob_b: 'Fokussiere auf VOB/B §§ 4, 13 (Mängelhaftung) und 15 (Bautagebuch & Stundenlohn). Formuliere Mängelrügen und Bedenkenanmeldungen nach VOB/B § 4 Abs. 3 präzise mit konkreter Fristsetzung und Androhung der Kündigung nach § 8 Abs. 3.',
      din18533: 'Beurteile alle erdberührten Abdichtungen streng nach DIN 18533 (Wassereinwirkungsklassen W1-E bis W4-E, Rissklassen R1-E bis R4-E). Weise stets auf Übergangsdetails und Hohlkehlenausbildungen hin.',
      din_en_206: 'Prüfen Sie Konformitätskriterien nach DIN EN 206 Tabellen 17 bis 19. Differenziere exakt zwischen Anfangsherstellung (3 Proben) und stetiger Herstellung (15 Proben).',
      geg_dgnb: 'Berechnen Sie U-Werte und H\'T-Grenzwerte nach dem Gebäudemodernisierungsgesetz (GModG, vormals GEG) und DIN 4108-2 (Mindestwärmeschutz f_Rsi >= 0,70). Berücksichtige EPD-Kennwerte (GWP_total in kg CO2-Äq/m²a).'
    };

    if (genFormat === 'claudemd') {
      return `# CLAUDE.md - Projektrichtlinien für das Ingenieurbüro

## 1. Rolle & Fachautorität
Du agierst als hochqualifizierter **${roleTitles[genRole]}**.
Dein Ziel ist es, technische Fragestellungen wissenschaftlich exakt, baurechtlich unanfechtbar und praxisnah zu beantworten.

## 2. Normative Randbedingungen
* ${normGuidelines[genNorm]}
* Halte dich strikt an die anerkannten Regeln der Technik (a.R.d.T.).
* Falls Normentexte oder Nachweismethoden unklar sind, markiere dies explizit statt Annahmen zu erfinden ("Striktes Halluzinationsverbot").

## 3. Ausgabe- und Formatierungsregeln
* **Sprache:** Technisches Ingenieur-Deutsch (DIN-Fachterminologie).
* **Formeln:** Mathematische Formeln müssen zwingend in LaTeX gesetzt werden (z. B. \`$f_{cd} = \\alpha_{cc} \\cdot \\frac{f_{ck}}{\\gamma_C}$\`).
* **Dokumentenstruktur:** Verwende klare Hierarchien mit Markdown-Überschriften (\`##\`, \`###\`), Aufzählungspunkten und Tabellen.
* **Ergebnisprüfung:** Bei allen Rechenwerten muss die Plausibilität durch Überschlagsrechnungen oder Kennwertgrenzen validiert werden.
* **Checklisten:** Aufgaben und Prüfschritte sind als interaktive Checklisten mit \`- [ ]\` zu formatieren.

## 4. Sicherheits- & Bedenkenhinweise
Falls die Aufgabenstellung ein Risiko für Tragfähigkeit, Gebrauchstauglichkeit oder Personensicherheit birgt, füge einen hervorgehobenen Bedenkenhinweis ein:
> ⚠️ **Prüfhinweis:** Statisch relevante Abweichungen bedürfen der schriftlichen Freigabe durch den aufstellenden Tragwerksplaner!`;
    }

    if (genFormat === 'custom_gpt') {
      return `### System Instructions für Custom GPT (${roleTitles[genRole]})

Du bist der KI-Fachassistent für "${roleTitles[genRole]}".

VERHALTENSREGELN:
1. Grundhaltung: Höchste Präzision, faktenbasiert, keine fiktiven Normen oder Paragraphen.
2. Normenbezug: ${normGuidelines[genNorm]}
3. Arbeitsweise bei Dokumenten:
   - Extrahiere Kennwerte stets mit Angabe von Seite und Bauteilbezeichnung.
   - Vergleichen Sie Soll-Werte mit Ist-Werten in einer Markdown-Matrix.
4. Berechnungen:
   - Nutzen Sie bei numerischen Daten bevorzugt das Code-Interpreter-Modul (Python), um Rechenfehler auszuschließen.
   - Geben Sie Zwischenschritte und Formeln mit Einheiten an (z. B. kN, MPa, cm²).
5. Grenzen: Erteile keine verbindliche Baufreigabe, sondern weise darauf hin, dass die finale Verantwortung beim zeichnungsberechtigten Ingenieur liegt.`;
    }

    return `### Workflow-Prompt für Claude / ChatGPT

[ROLLE & ZIEL]
Handle als erfahrener ${roleTitles[genRole]}.
Analysiere die nachfolgenden Projektunterlagen und erstelle eine strukturierte Auswertung für die Bauleitung.

[REGELWERK]
${normGuidelines[genNorm]}

[AUFGABENSTELLUNG]
1. Identifiziere alle maßgebenden Lastannahmen, Materialkennwerte oder Mängelbeschreibungen.
2. Erstelle eine tabellarische Übersicht:
   | Bauteil / Position | Befund / Kennwert | Norm-Sollwert | Abweichung / Bewertung |
   |---|---|---|---|
3. Formuliere konkrete Handlungsempfehlungen mit Zuständigkeiten und Fristsetzungen.
4. Hebe kritische Schnittstellen hervor.

[EINGABEDATEN HIER EINFÜGEN]`;
  }, [genRole, genNorm, genFormat, genDetailLevel]);

  // Main interactive tabs & content block
  const tabsNavigation = (
    <div className="flex flex-wrap gap-2 pt-2 border-b border-home-grau/20 pb-3">
      <button
        onClick={() => setActiveTab('uebersicht')}
        className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
          activeTab === 'uebersicht'
            ? 'bg-shiraz text-white border-shiraz shadow-md'
            : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
        }`}
      >
        <Bot size={16} /> 1. Claude vs. ChatGPT im Bau
      </button>
      <button
        onClick={() => setActiveTab('skills_konnektoren')}
        className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
          activeTab === 'skills_konnektoren'
            ? 'bg-shiraz text-white border-shiraz shadow-md'
            : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
        }`}
      >
        <Zap size={16} /> 2. Skills &amp; MCP-Konnektoren
      </button>
      <button
        onClick={() => setActiveTab('markdown')}
        className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
          activeTab === 'markdown'
            ? 'bg-shiraz text-white border-shiraz shadow-md'
            : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
        }`}
      >
        <FileCode size={16} /> 3. Markdown (.md) Standard
      </button>
      <button
        onClick={() => setActiveTab('verzeichnisse')}
        className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
          activeTab === 'verzeichnisse'
            ? 'bg-shiraz text-white border-shiraz shadow-md'
            : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
        }`}
      >
        <FolderTree size={16} /> 4. Projektverzeichnisse &amp; CLAUDE.md
      </button>
      <button
        onClick={() => setActiveTab('browser')}
        className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
          activeTab === 'browser'
            ? 'bg-shiraz text-white border-shiraz shadow-md'
            : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
        }`}
      >
        <Globe size={16} /> 5. Browser &amp; Web-Grounding
      </button>
      <button
        onClick={() => setActiveTab('praxisvorlagen')}
        className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
          activeTab === 'praxisvorlagen'
            ? 'bg-shiraz text-white border-shiraz shadow-md'
            : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
        }`}
      >
        <Sliders size={16} /> 6. Interaktiver Generator &amp; Vorlagen
      </button>
    </div>
  );

  const innerContent = (
    <div className="space-y-6">
      {tabsNavigation}

      {/* TAB 1: CLAUDE VS CHATGPT VERGLEICH */}
      {activeTab === 'uebersicht' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Claude Box */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
                    <h3 className="text-lg font-bold text-text-main">Claude (Anthropic)</h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Claude 5 Sonnet / Opus
                  </span>
                </div>
                <p className="text-xs text-text-main/70">
                  Der Spitzenreiter für präzise technische Dokumentenanalyse, Code-Erstellung, strikte Formatierung und ausgedehnten Reasoning-Modus.
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20 text-xs">
                    <div className="font-bold text-text-main flex items-center gap-1.5 mb-1">
                      <FolderGit2 size={14} className="text-amber-600" /> Claude Projects (200k+ Token Context + Caching)
                    </div>
                    <p className="text-text-main/70 leading-relaxed">
                      Zentrale Wissensbasis für ganze Bauprojekte. Bodengutachten, statische Vorbemessungen und Baubeschreibungen dauerhaft hinterlegen. Durch <strong>Prompt Caching</strong> sinken die Abfragekosten um bis zu 90 %.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20 text-xs">
                    <div className="font-bold text-text-main flex items-center gap-1.5 mb-1">
                      <Code size={14} className="text-amber-600" /> Artifacts (Interaktive Tools &amp; SVG)
                    </div>
                    <p className="text-text-main/70 leading-relaxed">
                      Claude rendert interaktive React-Rechner, Sieblinien-Visualisierer und technische SVG-Bewehrungszeichnungen direkt im geteilten Seitenfenster – ideal zum schnellen Prototyping vor Ort.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20 text-xs">
                    <div className="font-bold text-text-main flex items-center gap-1.5 mb-1">
                      <Sparkles size={14} className="text-amber-600" /> Extended Thinking (Deep Reasoning)
                    </div>
                    <p className="text-text-main/70 leading-relaxed">
                      Ermöglicht transparente Denkketten bei mehrstufigen statischen Nachweisen (z. B. Biegebemessung mit Druckbewehrung oder Rissbreitennachweis nach EC2).
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-home-grau/20 text-xs text-text-main/60 flex items-center justify-between">
                <span>Beste Eignung:</span>
                <strong className="text-shiraz">Gutachten, LVs, Code &amp; Projektordner</strong>
              </div>
            </div>

            {/* ChatGPT Box */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h3 className="text-lg font-bold text-text-main">ChatGPT (OpenAI)</h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    GPT-6 / o4 / o4-mini
                  </span>
                </div>
                <p className="text-xs text-text-main/70">
                  Der Marktführer für numerische Datenanalysen in Sandboxes, kollaboratives Text-Editing und multimodale Sprach-/Bildinteraktion.
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20 text-xs">
                    <div className="font-bold text-text-main flex items-center gap-1.5 mb-1">
                      <Database size={14} className="text-emerald-600" /> Advanced Data Analysis (Python Sandbox)
                    </div>
                    <p className="text-text-main/70 leading-relaxed">
                      Laden Sie CSV-Rohdaten von Zugversuchen, Druckprüfmaschinen oder Temperaturfühlern hoch. ChatGPT führt echten Python-Code aus und erzeugt druckfertige Diagramme und Regressionen ohne Rechenfehler.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20 text-xs">
                    <div className="font-bold text-text-main flex items-center gap-1.5 mb-1">
                      <FileText size={14} className="text-emerald-600" /> Canvas (Kooperativer Texteditor)
                    </div>
                    <p className="text-text-main/70 leading-relaxed">
                      Erlaubt das gezielte Überarbeiten einzelner Abschnitte in Gutachten oder Mängelrügen, ohne den gesamten Text neu generieren zu müssen. Mit integrierter Versionshistorie.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20 text-xs">
                    <div className="font-bold text-text-main flex items-center gap-1.5 mb-1">
                      <Bot size={14} className="text-emerald-600" /> Custom GPTs mit OpenAPI-Actions
                    </div>
                    <p className="text-text-main/70 leading-relaxed">
                      Binden Sie eigene Bürowerkzeuge an (z. B. REST-API für Wetterdaten am Bautag oder Abruf von tagesaktuellen Betonpreisen aus dem ERP-System).
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-home-grau/20 text-xs text-text-main/60 flex items-center justify-between">
                <span>Beste Eignung:</span>
                <strong className="text-emerald-700">Messreihen, Excel/CSV, Voice &amp; Canvas</strong>
              </div>
            </div>
          </div>

          {/* DECISION MATRIX */}
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Table size={18} className="text-shiraz" /> Entscheidungsmatrix: Wann welches Modell einsetzen?
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-home-grau/30 bg-slate-50">
                    <th className="p-3 font-bold text-text-main">Ingenieuraufgabe</th>
                    <th className="p-3 font-bold text-text-main">Empfohlenes Modell</th>
                    <th className="p-3 font-bold text-text-main">Bevorzugtes Feature</th>
                    <th className="p-3 font-bold text-text-main">Technischer Hintergrund &amp; Mehrwert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium">Baugrundgutachten (150 Seiten PDF) zusammenfassen</td>
                    <td className="p-3 text-amber-700 font-bold">Claude 5 Sonnet</td>
                    <td className="p-3">Claude Project + 200k Window</td>
                    <td className="p-3">Höchste Schärfe beim Auffinden einzelner Schichtdicken im tiefen Fließtext ("Needle in a Haystack Benchmark").</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium">Zugversuchs-Rohdaten (CSV mit 50.000 Messpunkten)</td>
                    <td className="p-3 text-emerald-700 font-bold">ChatGPT Plus / Pro (GPT-6 / o4)</td>
                    <td className="p-3">Advanced Data Analysis (Python)</td>
                    <td className="p-3">Rechnet mit echten Pandas-Bibliotheken im Sandbox-Container; kein Token-Verbrauch für reine Zahlenkolonnen.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium">Prüfbericht für Bauschaden schreiben &amp; iterieren</td>
                    <td className="p-3 text-emerald-700 font-bold">ChatGPT (GPT-6 Canvas)</td>
                    <td className="p-3">Canvas Inline-Editing</td>
                    <td className="p-3">Präzise Korrekturen an einzelnen Absätzen (z. B. Ursachennachweis), ohne dass die Formatierung zerbricht.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium">Erstellung eines Bauphysik-Rechners (U-Wert / Glaser)</td>
                    <td className="p-3 text-amber-700 font-bold">Claude 5 Sonnet</td>
                    <td className="p-3">Artifacts (React / HTML)</td>
                    <td className="p-3">Sofort bedienbare, interaktive Oberfläche im Browserfenster zum Testen und Weiterentwickeln.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium">Rechtssichere VOB-Mängelrüge (§ 4 Abs. 7 VOB/B)</td>
                    <td className="p-3 text-amber-700 font-bold">Claude 5 Sonnet</td>
                    <td className="p-3">Markdown-Striktheit</td>
                    <td className="p-3">Formuliert formell nüchtern, präzise nach Baurecht, ohne blumige Füllwörter oder typische AI-Klischees.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium">Recherche zu DIBt-Zulassungen &amp; neuen Normen</td>
                    <td className="p-3 text-blue-700 font-bold">Perplexity / ChatGPT Search (GPT-6)</td>
                    <td className="p-3">Web-Grounding + Zitate</td>
                    <td className="p-3">Live-Websuche mit direkten Quellenlinks verhindert Normen-Halluzinationen bei veralteten Ständen.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SKILLS & KONNEKTOREN (MCP) */}
      {activeTab === 'skills_konnektoren' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
                  <Zap size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main">
                    Skills &amp; Model Context Protocol (MCP) im Ingenieurbüro
                  </h3>
                  <p className="text-xs text-text-main/60">
                    Wie moderne LLMs durch Skills und offene Konnektoren von isolierten Textfeldern zu vernetzten Fachsystemen werden
                  </p>
                </div>
              </div>

              {/* Subtabs for Skills & MCP */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setSkillSubTab('skills_system')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${skillSubTab === 'skills_system' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                >
                  1. Was sind Skills?
                </button>
                <button
                  onClick={() => setSkillSubTab('mcp_arch')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${skillSubTab === 'mcp_arch' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                >
                  2. MCP-Architektur
                </button>
                <button
                  onClick={() => setSkillSubTab('mcp_servers')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${skillSubTab === 'mcp_servers' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                >
                  3. Praxis-Konnektoren
                </button>
              </div>
            </div>

            {/* SUB-VIEW 1: WAS SIND SKILLS? (DAS SKILL.MD-KONZEPT) */}
            {skillSubTab === 'skills_system' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="text-xs sm:text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/20 leading-relaxed space-y-2">
                  <p>
                    Ein <strong>Skill</strong> ist eine modulare, in sich geschlossene Verhaltens- und Verfahrensanweisung (typischerweise als <code className="font-mono bg-slate-200 px-1 py-0.5 rounded text-xs">SKILL.md</code> abgelegt). 
                    Statt das Modell mit einem 50-seitigen System-Prompt zu überfrachten, der bei jeder einzelnen Nachricht bezahlt und verarbeitet werden muss, 
                    wird der Skill <strong>erst dann vom Agenten geladen, wenn die Aufgabe ihn erfordert</strong>.
                  </p>
                </div>

                {/* COMPARISON CARDS: SYSTEM PROMPT VS SKILL VS MCP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-text-main">
                      <Bot size={15} className="text-blue-600" /> System-Prompt
                    </div>
                    <p className="text-text-main/70 leading-relaxed">
                      Statische Grundhaltung ("Du bist Prüfingenieur"). Wird bei <em>jedem</em> Turn neu übertragen.
                    </p>
                    <div className="pt-2 border-t border-home-grau/20 text-[11px] text-slate-500">
                      <strong>Grenze:</strong> Verbraucht permanent Kontextfenster; bei vielen Sonderregeln unübersichtlich.
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <Sparkles size={15} className="text-amber-600" /> Agent-Skill (SKILL.md)
                    </div>
                    <p className="text-amber-950/80 leading-relaxed">
                      Spezialisiertes Verfahrenshandbuch. Enthält YAML-Metadaten, Trigger-Keywords und strikte Schrittfolgen.
                    </p>
                    <div className="pt-2 border-t border-amber-200/40 text-[11px] text-amber-900">
                      <strong>Vorteil:</strong> 0 Token-Verbrauch im Ruhezustand; wird nur bei Bedarf eingeklinkt!
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/60 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <Zap size={15} className="text-emerald-600" /> MCP-Konnektor
                    </div>
                    <p className="text-emerald-950/80 leading-relaxed">
                      Schnittstelle zur Außenwelt. Führt reale Funktionen aus (z. B. SQL-Query, IFC-Parsen, Wetterabruf).
                    </p>
                    <div className="pt-2 border-t border-emerald-200/40 text-[11px] text-emerald-900">
                      <strong>Vorteil:</strong> Echte Daten statt Schätzungen; sicherer lokaler Datenfluss.
                    </div>
                  </div>
                </div>

                {/* SKILL.MD MUSTERCODE */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-shiraz flex items-center gap-1.5">
                      <FileCheck2 size={15} /> Praxis-Bauingenieur-Skill: VOB-Bedenkenhinweis
                    </h4>
                    <button
                      onClick={() => copyToClipboard(`---
name: vob-bedenkenhinweis-pruefer
description: Prüft Planungsunterlagen und Baustellen-Befunde auf rechtssichere Bedenkenanmeldung nach VOB/B § 4 Abs. 3.
triggers:
  - bedenkenanmeldung
  - vob b § 4
  - vorleistung fehlerhaft
  - behinderungsanzeige
---

# VOB/B Bedenkenanmeldung Skill

## 1. Trigger & Geltungsbereich
Dieser Skill wird aktiviert, sobald ein Bauunternehmer oder Nachunternehmer Mängel in Vorleistungen (z. B. unebene Bodenplatte, fehlende Feuchtigkeitssperre) oder Planungsfehler erkennt.

## 2. Pflicht-Prüfschritte
1. **Sachverhaltsanalyse:** Konkrete Bauteillage (Achsen, Geschoss) und Mangelbeschreibung erfassen.
2. **Kausalitätsprüfung:** Warum führt die Vorleistung zu Folgeschäden am eigenen Gewerk?
3. **Fristsetzung:** Gesetzte Frist zur schriftlichen Klärung vor Arbeitsaufnahme definieren.
4. **Schriftformerfordernis:** Formuliere das Dokument strikt nach § 4 Abs. 3 VOB/B (Textform ist nicht ausreichend; nachweisbarer Zugang erforderlich).

## 3. Negative Constraints (Verbote)
- Verwende niemals unpräzise Floskeln wie "könnte eventuell feucht sein".
- Benenne stets das konkrete Schadensbild (z. B. "Haftungsverbund des Estrichs gefährdet durch Zementschlämme").`, 'skill_sample')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-shiraz hover:text-white rounded text-xxs font-bold flex items-center gap-1 transition-all"
                    >
                      {copiedKey === 'skill_sample' ? <Check size={12} /> : <Copy size={12} />}
                      <span>Skill kopieren</span>
                    </button>
                  </div>

                  <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`---
name: vob-bedenkenhinweis-pruefer
description: Prüft Planungsunterlagen und Baustellen-Befunde auf Bedenkenanmeldung nach VOB/B § 4 Abs. 3.
triggers: [bedenkenanmeldung, vob b § 4, vorleistung fehlerhaft, behinderungsanzeige]
---

# VOB/B Bedenkenanmeldung Skill
1. Sachverhaltsanalyse: Bauteillage und Mangelbeschreibung erfassen.
2. Kausalitätsprüfung: Warum führt die Vorleistung zu Folgeschäden am eigenen Gewerk?
3. Schriftformerfordernis: Formuliere das Dokument strikt nach § 4 Abs. 3 VOB/B.`}
                  </pre>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: MCP ARCHITEKTUR */}
            {skillSubTab === 'mcp_arch' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <p className="text-sm text-text-main/80 leading-relaxed">
                  Mit dem von Anthropic initiierten und inzwischen branchenweiten Standard <strong>MCP (Model Context Protocol)</strong> können 
                  Claude Desktop, Cursor und andere AI-Clients sicher und standardisiert auf lokale Dateisysteme, IFC-Modelldatenbanken, GAEB-Dateien und REST-APIs zugreifen.
                </p>

                {/* Architecture diagram */}
                <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 my-4 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-shiraz flex items-center gap-1.5">
                    <Workflow size={15} /> MCP-Architektur im Bauplanungsprozess
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 bg-white rounded-xl border border-home-grau/30 shadow-xs space-y-2">
                      <div className="font-bold text-text-main flex items-center gap-1.5">
                        <Laptop size={15} className="text-blue-600" /> 1. LLM-Client (Claude / Cursor)
                      </div>
                      <p className="text-text-main/70 leading-relaxed">
                        Versteht die Absicht des Ingenieurs: <em>"Prüfe, ob die Durchstanzbewehrung über Stütze S4 im 2. OG im IFC-Modell korrekt modelliert ist."</em>
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-home-grau/30 shadow-xs space-y-2">
                      <div className="font-bold text-text-main flex items-center gap-1.5">
                        <Zap size={15} className="text-amber-600" /> 2. MCP-Server (Lokal auf PC)
                      </div>
                      <p className="text-text-main/70 leading-relaxed">
                        Bietet Werkzeuge an: <code className="bg-slate-100 px-1 py-0.5 rounded">get_ifc_element_properties()</code>, <code className="bg-slate-100 px-1 py-0.5 rounded">read_statik_pdf()</code>. Führt sichere Abfragen ohne Cloud-Transfer durch.
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-home-grau/30 shadow-xs space-y-2">
                      <div className="font-bold text-text-main flex items-center gap-1.5">
                        <Database size={15} className="text-emerald-600" /> 3. Datenquelle &amp; Bau-Software
                      </div>
                      <p className="text-text-main/70 leading-relaxed">
                        BIM-Dateien (.ifc), SQLite-Bautagebücher, AVA-Exportdateien (.x83 GAEB) oder lokale Normen-Archive im PDF/Markdown-Format.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 text-xs space-y-2">
                  <span className="font-bold text-text-main block">Sicherheitsvorteil für Ingenieurbüros:</span>
                  <p className="text-text-main/70 leading-relaxed">
                    MCP arbeitet über das standardisierte JSON-RPC-Protokoll. Sensible CAD-Dateien und vertrauliche Leistungsverzeichnisse verlassen Ihren Büro-Rechner <strong>nicht</strong>. Das LLM sieht nur die gefilterten Rückgabewerte des lokalen Servers (z. B. "Volumen Betonstütze: 2,40 m³").
                  </p>
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: PRAXIS-KONNEKTOREN */}
            {skillSubTab === 'mcp_servers' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 text-xs space-y-2">
                    <div className="font-bold text-text-main flex items-center gap-2">
                      <FolderTree size={16} className="text-shiraz" /> Filesystem MCP Server
                    </div>
                    <p className="text-text-main/70 leading-relaxed">
                      Ermöglicht Claude, gezielt in Projektordnern nach Plänen, Besprechungsprotokollen oder Lieferscheinen zu suchen, ohne dass Sie jede Datei manuell ins Chatfenster ziehen müssen.
                    </p>
                    <div className="text-[11px] text-text-main/60 bg-white p-2 rounded border border-home-grau/20 font-mono">
                      claude_desktop_config.json: "filesystem": &#123; "args": ["D:/Bauprojekte"] &#125;
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 text-xs space-y-2">
                    <div className="font-bold text-text-main flex items-center gap-2">
                      <Code size={16} className="text-shiraz" /> Python / IfcOpenShell MCP
                    </div>
                    <p className="text-text-main/70 leading-relaxed">
                      Verbindet das Modell mit einer lokalen Python-Umgebung. So können IFC-Klassen (z. B. <code className="font-mono">IfcWall</code>, <code className="font-mono">IfcBeam</code>) direkt geometrisch und mengenmäßig abgefragt werden.
                    </p>
                    <div className="text-[11px] text-text-main/60 bg-white p-2 rounded border border-home-grau/20 font-mono">
                      Tools: query_ifc_volumes(), calculate_reinforcement_ratio()
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 text-xs space-y-2">
                    <div className="font-bold text-text-main flex items-center gap-2">
                      <Database size={16} className="text-shiraz" /> GAEB / AVA MCP Konnektor
                    </div>
                    <p className="text-text-main/70 leading-relaxed">
                      Parst Leistungsverzeichnisse im Format GAEB 90 / 2000 / XML (X83, X84) und gleicht Bieterpreise automatisch mit statistischen Baupreisdatenbanken ab.
                    </p>
                    <div className="text-[11px] text-text-main/60 bg-white p-2 rounded border border-home-grau/20 font-mono">
                      Tools: parse_gaeb_positions(), check_unbalanced_bidding()
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 text-xs space-y-2">
                    <div className="font-bold text-text-main flex items-center gap-2">
                      <Globe size={16} className="text-shiraz" /> DWD Wetter-Konnektor (Bautagebuch)
                    </div>
                    <p className="text-text-main/70 leading-relaxed">
                      Zieht stundengenaue historische Temperatur- und Niederschlagswerte des Deutschen Wetterdienstes (DWD) für Baustellenkoordinaten ab – rechtssicher bei Schlechtwetteranzeigen nach VOB/B § 6.
                    </p>
                    <div className="text-[11px] text-text-main/60 bg-white p-2 rounded border border-home-grau/20 font-mono">
                      Tools: fetch_dwd_weather(lat, lon, date)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MARKDOWN (.MD) ALS LINGUA FRANCA */}
      {activeTab === 'markdown' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <FileCode size={20} className="text-shiraz" /> Markdown (.md) als nativer Standard für Bau-LLMs
                </h3>
                <p className="text-xs text-text-main/70">
                  Warum Markdown das mit Abstand effizienteste, kostengünstigste und fehlerresistenteste Format für KI-Workflows ist
                </p>
              </div>

              {/* View toggle */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setMarkdownView('vergleich')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${markdownView === 'vergleich' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                >
                  Warum .md?
                </button>
                <button
                  onClick={() => setMarkdownView('syntax')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${markdownView === 'syntax' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                >
                  Ingenieur-Syntax
                </button>
                <button
                  onClick={() => setMarkdownView('rechner')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${markdownView === 'rechner' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                >
                  Token- &amp; Kosten-Rechner
                </button>
              </div>
            </div>

            {/* VIEW 1: REASONS FOR MARKDOWN */}
            {markdownView === 'vergleich' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-1.5">
                    <div className="text-shiraz font-black text-xl">1.</div>
                    <h4 className="font-bold text-sm text-text-main">60-80% Tokenersparnis</h4>
                    <p className="text-xs text-text-main/70 leading-relaxed">
                      Keine unsichtbaren XML-Tags, Schriftarten-Definitionen oder Vektorpfade. Jedes Byte ist echter semantischer Inhalt.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-1.5">
                    <div className="text-shiraz font-black text-xl">2.</div>
                    <h4 className="font-bold text-sm text-text-main">Perfekte Hierarchie</h4>
                    <p className="text-xs text-text-main/70 leading-relaxed">
                      Überschriften mit <code className="font-mono text-xs">#</code>, <code className="font-mono text-xs">##</code> signalisieren den Attention-Heads des Modells sofort den logischen Dokumentenaufbau.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-1.5">
                    <div className="text-shiraz font-black text-xl">3.</div>
                    <h4 className="font-bold text-sm text-text-main">Robuste Tabellen</h4>
                    <p className="text-xs text-text-main/70 leading-relaxed">
                      Markdown-Pipes (<code className="font-mono text-xs">| A | B |</code>) werden spalten- und zeilengetreu geparst. Kein Verrutschen von Zeilen wie bei OCR-PDFs.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-1.5">
                    <div className="text-shiraz font-black text-xl">4.</div>
                    <h4 className="font-bold text-sm text-text-main">LaTeX-Kompatibilität</h4>
                    <p className="text-xs text-text-main/70 leading-relaxed">
                      Mathematische Formeln werden nahtlos in <code className="font-mono text-xs">$...$</code> eingebettet und fehlerfrei interpretiert.
                    </p>
                  </div>
                </div>

                {/* SIDE-BY-SIDE COMPARISON: OCR VS CLEAN MARKDOWN */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                    Live-Vergleich: Schlechter PDF-OCR-Scan vs. Strukturiertes Markdown
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 space-y-2 font-mono text-[11px] text-rose-900">
                      <div className="font-bold text-rose-800 flex items-center justify-between">
                        <span>❌ Schlechter PDF-Text (OCR-Artefakte)</span>
                        <span className="text-[10px] bg-rose-200/60 px-1.5 py-0.5 rounded">~1.400 Tokens</span>
                      </div>
                      <p className="leading-relaxed bg-white/80 p-2.5 rounded border border-rose-200/60">
                        [Header: Baugrundinstitut Dr. Muelller S. 42]<br/>
                        Schicht 2.... Sand Kies k_f = 1,4 * 10^-4 m/s?<br/>
                        c=0 phi = 32.5? Wichte gamma=19kN/m3?<br/>
                        [Footer: DIN 4020 Vertraulichkeitsvermerk...]
                      </p>
                      <span className="text-[10px] text-rose-700 block">
                        Gefahr: Fragmente im Tabellenumbruch werden fehlinterpretiert; hohe Token-Verschwendung.
                      </span>
                    </div>

                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2 font-mono text-[11px] text-emerald-900">
                      <div className="font-bold text-emerald-800 flex items-center justify-between">
                        <span>✅ Reines Markdown (.md)</span>
                        <span className="text-[10px] bg-emerald-200/60 px-1.5 py-0.5 rounded">~280 Tokens (-80%)</span>
                      </div>
                      <p className="leading-relaxed bg-white/80 p-2.5 rounded border border-emerald-200/60">
                        ### Schicht 2: Quartär-Kies (Tiefe 1,20 - 8,50 m)<br/>
                        | Parameter | Symbol | Wert | Einheit |<br/>
                        |---|---|---|---|<br/>
                        | Reibungswinkel | $\varphi'$ | 35,0 | ° |<br/>
                        | Kohäsion | $c'$ | 0,0 | kN/m² |<br/>
                        | Durchlässigkeit | $k_f$ | {"$1{,}4 \\cdot 10^{-4}$"} | m/s |
                      </p>
                      <span className="text-[10px] text-emerald-700 block">
                        Vorteil: Perfekte maschinelle Lesbarkeit, kein Halluzinationsrisiko durch Zeilenverschiebungen.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: SYNTAX-GUIDE FÜR BAUINGENIEURE */}
            {markdownView === 'syntax' && (
              <div className="space-y-4 animate-in fade-in duration-200 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
                    <span className="font-bold text-text-main flex items-center gap-1.5">
                      <Table size={14} className="text-shiraz" /> Tabellen mit Ausrichtung &amp; Einheiten
                    </span>
                    <pre className="p-2.5 bg-slate-900 text-slate-100 rounded font-mono text-[11px] overflow-x-auto">
{`| Bauteil | Beton | Dicke [cm] | Bewehrung |
|:---|:---:|---:|:---|
| Decke 1.OG | C30/37 | 24,0 | B500B d12-15 |
| Außenwand | C25/30 | 30,0 | B500B d10-20 |`}
                    </pre>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
                    <span className="font-bold text-text-main flex items-center gap-1.5">
                      <Code size={14} className="text-shiraz" /> Formelsatz nach Eurocode
                    </span>
                    <pre className="p-2.5 bg-slate-900 text-slate-100 rounded font-mono text-[11px] overflow-x-auto">
{`Bemessungswert der Betondruckfestigkeit:
$$f_{cd} = \\alpha_{cc} \\cdot \\frac{f_{ck}}{\\gamma_C}$$

Mit $\\alpha_{cc} = 0{,}85$ und $\\gamma_C = 1{,}50$.`}
                    </pre>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
                    <span className="font-bold text-text-main flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-amber-600" /> Bedenken- &amp; Gefahrenhinweise
                    </span>
                    <pre className="p-2.5 bg-slate-900 text-slate-100 rounded font-mono text-[11px] overflow-x-auto">
{`> ⚠️ **VOB/B Bedenkenhinweis gem. § 4 Abs. 3:**
> Vorleistung uneben. Höhenversatz > 15 mm.
> Rissgefahr für Folgegewerk Estrich.`}
                    </pre>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
                    <span className="font-bold text-text-main flex items-center gap-1.5">
                      <CheckSquare size={14} className="text-emerald-600" /> Baustellen-Abnahmechecklisten
                    </span>
                    <pre className="p-2.5 bg-slate-900 text-slate-100 rounded font-mono text-[11px] overflow-x-auto">
{`- [x] Bewehrungsabnahme Achse A-D erfolgt
- [ ] Betondeckung c_nom = 35 mm nachgemessen
- [ ] Rüttelgaschen freigehalten`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: TOKEN- & KOSTEN-RECHNER */}
            {markdownView === 'rechner' && (
              <div className="p-5 bg-off-white rounded-2xl border border-home-grau/20 space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                    <Sliders size={16} className="text-shiraz" /> Interaktiver Format- &amp; Token-Kostenrechner
                  </h4>
                  <span className="text-xs text-text-main/60">Vergleich: Dokumentgröße vs. Modell-Kontext</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-text-main/80 block mb-1">
                      Dokumentenumfang: <strong className="text-shiraz font-mono">{calcDocPages} Seiten</strong>
                    </label>
                    <input 
                      type="range" 
                      min={5} 
                      max={150} 
                      step={5} 
                      value={calcDocPages} 
                      onChange={(e) => setCalcDocPages(Number(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer" 
                    />
                    <div className="flex justify-between text-[10px] text-text-main/50 mt-1">
                      <span>5 Seiten (Kurzbericht)</span>
                      <span>75 S.</span>
                      <span>150 S. (Baugrundgutachten)</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-main/80 block mb-1">Eingabeformat:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setCalcDocType('pdf_scan')}
                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all border ${
                          calcDocType === 'pdf_scan' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/30'
                        }`}
                      >
                        PDF-Scan (OCR)
                      </button>
                      <button
                        onClick={() => setCalcDocType('pdf_text')}
                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all border ${
                          calcDocType === 'pdf_text' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/30'
                        }`}
                      >
                        PDF (Digital)
                      </button>
                      <button
                        onClick={() => setCalcDocType('word_docx')}
                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all border ${
                          calcDocType === 'word_docx' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/30'
                        }`}
                      >
                        Word (.docx)
                      </button>
                      <button
                        onClick={() => setCalcDocType('markdown')}
                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all border ${
                          calcDocType === 'markdown' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white text-text-main border-home-grau/30'
                        }`}
                      >
                        ✨ Markdown (.md)
                      </button>
                    </div>
                  </div>
                </div>

                {/* STATS TILES */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 bg-white rounded-xl border border-home-grau/20">
                    <span className="text-[10px] uppercase font-bold text-text-main/60 block">Geschätzte Token</span>
                    <span className="text-lg font-black text-text-main font-mono">
                      {tokenStats.totalTokens.toLocaleString('de-DE')}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-home-grau/20">
                    <span className="text-[10px] uppercase font-bold text-text-main/60 block">Auslastung 200k Kontext</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${tokenStats.contextUsagePercent > 80 ? 'bg-rose-500' : tokenStats.contextUsagePercent > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${tokenStats.contextUsagePercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-text-main">{tokenStats.contextUsagePercent}%</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-home-grau/20">
                    <span className="text-[10px] uppercase font-bold text-text-main/60 block">Kosten Standard</span>
                    <span className="text-lg font-black text-shiraz font-mono">
                      ${tokenStats.costInputClaude.toFixed(3)}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-home-grau/20">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Mit Prompt Caching</span>
                    <span className="text-lg font-black text-emerald-700 font-mono">
                      ${tokenStats.costCachedClaude.toFixed(3)} (-90%)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: VERZEICHNISSTRUKTUREN & CLAUDE.MD */}
      {activeTab === 'verzeichnisse' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <FolderTree size={20} className="text-shiraz" /> Projektverzeichnisse &amp; CLAUDE.md-Leitfaden
                </h3>
                <p className="text-xs text-text-main/70">
                  Strukturierte Datenhaltung für reibungslose Zusammenarbeit zwischen Ingenieur, Claude Projects und Coding-Agenten
                </p>
              </div>

              {/* Project Type Selector */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setDirProjectType('bauleitung')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${dirProjectType === 'bauleitung' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                >
                  Bauleitung (VOB)
                </button>
                <button
                  onClick={() => setDirProjectType('pruefstatik')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${dirProjectType === 'pruefstatik' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                >
                  Prüfstatik (EC2)
                </button>
                <button
                  onClick={() => setDirProjectType('masterarbeit')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${dirProjectType === 'masterarbeit' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                >
                  Masterarbeit / Labor
                </button>
              </div>
            </div>

            {/* DYNAMIC FOLDER TREE PER SCENARIO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-950 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto shadow-inner border border-slate-800 space-y-1">
                <div className="text-emerald-400 font-bold pb-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FolderTree size={14} /> 
                    {dirProjectType === 'bauleitung' ? 'BV_Wohnanlage_Augsburg_Bauleitung/' : dirProjectType === 'pruefstatik' ? 'BV_Gewerbepark_Tragwerksplanung/' : 'Masterarbeit_Recyclingbeton_THA/'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">ISO 8601 Nomenklatur</span>
                </div>

                <div className="pt-2 text-slate-300">
                  <div className="pl-2">├── 📄 <span className="text-emerald-300 font-bold">CLAUDE.md</span> <span className="text-slate-500"># Zentrale Büro- &amp; Projektrichtlinien</span></div>
                  <div className="pl-2">├── 📄 <span className="text-amber-300 font-bold">.cursorrules</span> <span className="text-slate-500"># Coding- &amp; Formelstandards für KI-Agenten</span></div>
                  
                  {dirProjectType === 'bauleitung' && (
                    <>
                      <div className="pl-2">├── 📁 <span className="text-amber-300">01_vertrag_vob/</span></div>
                      <div className="pl-6">├── 📄 bauvertrag_eckdaten.md</div>
                      <div className="pl-6">└── 📄 leistungsverzeichnis_kurz.md</div>
                      <div className="pl-2">├── 📁 <span className="text-amber-300">02_bautagebuch/</span></div>
                      <div className="pl-6">├── 📄 2026-03-12_bodenplatte.md</div>
                      <div className="pl-6">└── 📄 2026-03-13_stuetzen_eg.md</div>
                      <div className="pl-2">├── 📁 <span className="text-amber-300">03_lieferscheine/</span></div>
                      <div className="pl-6">└── 📄 2026-03-12_beton_c30-37.csv</div>
                      <div className="pl-2">└── 📁 <span className="text-amber-300">04_maengel_behinderung/</span></div>
                      <div className="pl-6">├── 📄 maengelliste_rohbau.md</div>
                      <div className="pl-6">└── 📄 vob_bedenkenanmeldungen.md</div>
                    </>
                  )}

                  {dirProjectType === 'pruefstatik' && (
                    <>
                      <div className="pl-2">├── 📁 <span className="text-amber-300">01_grundlagen_lasten/</span></div>
                      <div className="pl-6">├── 📄 lastannahmen_din_en_1991.md</div>
                      <div className="pl-6">└── 📄 baugrundschichten_ec7.md</div>
                      <div className="pl-2">├── 📁 <span className="text-amber-300">02_baustoffe/</span></div>
                      <div className="pl-6">└── 📄 beton_stahl_kennwerte.md <span className="text-slate-500"># C35/45, B500B</span></div>
                      <div className="pl-2">├── 📁 <span className="text-amber-300">03_bauteile/</span></div>
                      <div className="pl-6">├── 📄 decke_og1_durchstanzen.md</div>
                      <div className="pl-6">└── 📄 stuetzenbemessung_knicken.md</div>
                      <div className="pl-2">└── 📁 <span className="text-amber-300">04_positionsplaene/</span></div>
                      <div className="pl-6">└── 📄 pos_uebersicht_abmessungen.md</div>
                    </>
                  )}

                  {dirProjectType === 'masterarbeit' && (
                    <>
                      <div className="pl-2">├── 📁 <span className="text-amber-300">01_expose_literatur/</span></div>
                      <div className="pl-6">├── 📄 forschungsfragen.md</div>
                      <div className="pl-6">└── 📄 literatur_matrix.md</div>
                      <div className="pl-2">├── 📁 <span className="text-amber-300">02_labor_messdaten/</span></div>
                      <div className="pl-6">├── 📄 druckversuch_28d.csv</div>
                      <div className="pl-6">└── 📄 spaltzugversuche.csv</div>
                      <div className="pl-2">├── 📁 <span className="text-amber-300">03_skripte_python/</span></div>
                      <div className="pl-6">├── 📄 auswertung_regression.py</div>
                      <div className="pl-6">└── 📄 sieblinien_plotter.py</div>
                      <div className="pl-2">└── 📁 <span className="text-amber-300">04_manuskript/</span></div>
                      <div className="pl-6">└── 📄 kapitel_04_ergebnisse.md</div>
                    </>
                  )}
                </div>
              </div>

              {/* EXPLANATION OF DIRECTORY LAYOUT & RULES */}
              <div className="space-y-3 flex flex-col justify-between text-xs">
                <div className="space-y-2.5">
                  <h4 className="font-bold text-sm text-text-main">
                    Die goldenen Verzeichnis-Regeln für Bau-LLMs:
                  </h4>
                  
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-home-grau/20">
                    <strong className="text-shiraz">1. CLAUDE.md im Stammverzeichnis:</strong>
                    <p className="text-text-main/70 mt-0.5">Wird von Claude Desktop / Claude Code bei jeder Sitzung automatisch als System-Kontext geladen. Definiert die Rolle des Ingenieurs, geltende Eurocodes und Formatierungsregeln.</p>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-home-grau/20">
                    <strong className="text-text-main">2. Kuratierte Auszüge statt 500-Seiten-Dumps:</strong>
                    <p className="text-text-main/70 mt-0.5">Lege nicht das komplette 300-seitige Baugrundgutachten als Roh-Scan ab, sondern eine bereinigte 3-seitige Markdown-Zusammenfassung mit den maßgebenden Schichten und Kennwerten.</p>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-home-grau/20">
                    <strong className="text-text-main">3. ISO 8601 Dateinamen (YYYY-MM-DD):</strong>
                    <p className="text-text-main/70 mt-0.5">Verwende stets <code className="font-mono">YYYY-MM-DD_thema.md</code>. LLMs verstehen zeitliche Abfolgen und Kausalitäten bei Nachträgen und Bautagebüchern dadurch erheblich besser.</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                  <strong>💡 Pro-Tipp für Claude Projects:</strong> Laden Sie die <code className="font-mono">CLAUDE.md</code> direkt in die "Project Knowledge". So müssen Sie in einzelnen Chats nie wieder erwähnen, welches Bauvorhaben oder welche Normen gelten!
                </div>
              </div>
            </div>

            {/* READY-TO-USE CLAUDE.MD CODE TEMPLATE */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-shiraz flex items-center gap-1.5">
                  <FileCode size={15} /> Vollständige Büro-Vorlage: CLAUDE.md für Bauingenieure
                </span>
                <button
                  onClick={() => copyToClipboard(`# CLAUDE.md - Ingenieurbüro Richtlinien
## 1. Projektkontext & Rolle
- Projekt: Neubau Mehrfamilienhaus Augsburg (KfW 40)
- Rolle: Prüfingenieur für Tragwerksplanung & Bauphysik
- Geltende Normen: Eurocode 2 (DIN EN 1992-1-1), DIN 1045-2, GEG 2024, VOB/B

## 2. Mathematische & Normative Vorgaben
- Alle Berechnungen mit nachvollziehbaren Formeln in LaTeX: $M_{Ed} = \\frac{q \\cdot L^2}{8}$
- Teilsicherheitsbeiwerte stets explizit angeben: $\\gamma_G = 1{,}35$, $\\gamma_Q = 1{,}50$, $\\gamma_C = 1{,}50$, $\\gamma_S = 1{,}15$
- Striktes Halluzinationsverbot: Falls Normentabellen unklar sind, explizit auf Nachschlagen im Originalnormblatt hinweisen!

## 3. Ausgabe-Formatierung
- Tabellen immer mit standardisierten Einheiten [kN, kNm, MPa, cm²]
- Sicherheitsrelevante Befunde stets als Blockquote (> ⚠️ Prüfhinweis:)`, 'claudemd_full')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-shiraz hover:text-white rounded text-xxs font-bold flex items-center gap-1 transition-all"
                >
                  {copiedKey === 'claudemd_full' ? <Check size={12} /> : <Copy size={12} />}
                  <span>CLAUDE.md kopieren</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`# CLAUDE.md - Ingenieurbüro Richtlinien
## 1. Projektkontext & Rolle: Prüfingenieur für Tragwerksplanung (EC2 & DIN 1045)
## 2. Mathematische Vorgaben: LaTeX-Formeln, Teilsicherheitsbeiwerte angeben, Halluzinationsverbot
## 3. Formatierung: Markdown-Tabellen mit Einheiten [kN, kNm, MPa], Bedenkenhinweise mit > ⚠️`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BROWSER & WEB-GROUNDING */}
      {activeTab === 'browser' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <Globe size={20} className="text-shiraz" /> Browser-Nutzung &amp; Web-Grounding: Normenrecherche ohne Halluzinationen
                </h3>
                <p className="text-xs text-text-main/70">
                  Wie Sie Echtzeit-Suchwerkzeuge mit gezielten Suchfiltern einsetzen, um stets den tagesaktuellen Stand der Bautechnik zu verifizieren
                </p>
              </div>

              {/* Browser Engine Toggle */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setBrowserEngine('perplexity')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${browserEngine === 'perplexity' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                >
                  Perplexity / Deep Research
                </button>
                <button
                  onClick={() => setBrowserEngine('chatgpt_search')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${browserEngine === 'chatgpt_search' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                >
                  ChatGPT Search
                </button>
                <button
                  onClick={() => setBrowserEngine('claude_search')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${browserEngine === 'claude_search' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                >
                  Claude Web Search
                </button>
              </div>
            </div>

            {/* ENGINE EXPLANATION */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-xs">
              {browserEngine === 'perplexity' && (
                <div className="space-y-1.5">
                  <span className="font-bold text-text-main flex items-center gap-1.5">
                    <Search size={14} className="text-blue-600" /> Perplexity &amp; Deep Research: Synthese aus 30+ Primärquellen
                  </span>
                  <p className="text-text-main/70 leading-relaxed">
                    Ideal für wissenschaftliche Literaturrecherchen und neue bauaufsichtliche Zulassungen. Deep Research führt mehrstufige Suchketten aus, filtert Werbetexte heraus und belegt jede Aussage mit Fußnoten und direkten DOI/URL-Nachweisen.
                  </p>
                </div>
              )}

              {browserEngine === 'chatgpt_search' && (
                <div className="space-y-1.5">
                  <span className="font-bold text-text-main flex items-center gap-1.5">
                    <Globe size={14} className="text-emerald-600" /> ChatGPT Search: Interaktives Fact-Checking mit Karten &amp; News
                  </span>
                  <p className="text-text-main/70 leading-relaxed">
                    Hervorragend zur schnellen Überprüfung von Baustoffpreisen, Hersteller-Lieferzeiten oder regionalen Verwaltungsvorschriften der Bundesländer (z. B. VV TB Bayern).
                  </p>
                </div>
              )}

              {browserEngine === 'claude_search' && (
                <div className="space-y-1.5">
                  <span className="font-bold text-text-main flex items-center gap-1.5">
                    <Terminal size={14} className="text-amber-600" /> Claude Web Search: Gezielter Abruf während der Code- &amp; Dokumentenerstellung
                  </span>
                  <p className="text-text-main/70 leading-relaxed">
                    Ruft bei unklaren Normentexten oder fehlenden API-Parametern selbstständig die Dokumentation ab und bettet die verifizierten Daten direkt in Ihre Markdown-Berichte oder Berechnungen ein.
                  </p>
                </div>
              )}
            </div>

            {/* SEARCH OPERATORS TABLE FOR CIVIL ENGINEERING */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-text-main">
                Gezielte Such-Operatoren (Google Dorks) für Bau-Recherchen im LLM
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
                  <div className="font-mono font-bold text-shiraz bg-white p-2 rounded border border-home-grau/20">
                    site:dibt.de [Zulassungsnr]
                  </div>
                  <div className="font-bold text-text-main">DIBt-Zulassungen verifizieren</div>
                  <p className="text-text-main/70 leading-relaxed">
                    Sucht ausschließlich auf den Servern des Deutschen Instituts für Bautechnik nach allgemeinen bauaufsichtlichen Zulassungen (abZ) oder Bauartgenehmigungen (aBG).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
                  <div className="font-mono font-bold text-shiraz bg-white p-2 rounded border border-home-grau/20">
                    site:oekobaudat.de [Baustoff]
                  </div>
                  <div className="font-bold text-text-main">Ökobilanzdaten (EPD) abrufen</div>
                  <p className="text-text-main/70 leading-relaxed">
                    Findet verifizierte EPD-Datensätze und Treibhauspotenziale (GWP A1-A3) für konkrete Baustoffe auf der Bundesplattform ÖKOBAUDAT.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
                  <div className="font-mono font-bold text-shiraz bg-white p-2 rounded border border-home-grau/20">
                    filetype:pdf "Technisches Merkblatt" [Produkt]
                  </div>
                  <div className="font-bold text-text-main">Herstellerdatenblätter filtern</div>
                  <p className="text-text-main/70 leading-relaxed">
                    Filtert Marketingtexte heraus und erzwingt das Herunterladen des reinen technischen Datenblatts (Verarbeitungstemperatur, Festigkeit, Mischungsverhältnis).
                  </p>
                </div>
              </div>
            </div>

            {/* CHECKLIST AGAINST HALLUCINATIONS */}
            <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 space-y-3">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" /> Der 4-Stufen-Sicherheitscheck gegen Halluzinationen
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>1. Zitationszwang mit URL verlangen:</strong>
                    <p className="text-text-main/70">Instruieren Sie die KI: <em>"Nenne mir zu jedem Normen-Grenzwert die exakte Normentabelle und verlinke die Primärquelle per Websuche."</em></p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>2. Blindtext-Verbot (Negativ-Constraint):</strong>
                    <p className="text-text-main/70"><em>"Wenn du den genauen Wert nach DIN EN 1992 nicht kennst, rate nicht, sondern sage explizit: 'Wert muss im Original-Normblatt nachgeschlagen werden'."</em></p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>3. Rechnen immer mit Python-Tool:</strong>
                    <p className="text-text-main/70">Reine Sprachmodelle rechnen per Token-Wahrscheinlichkeit. Zwingen Sie das Modell per Code-Interpreter oder Vorrechnung per Hand zur Plausibilitätsprüfung.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>4. Zwei-Modell-Validierung (Cross-Checking):</strong>
                    <p className="text-text-main/70">Lassen Sie einen statischen Nachweis von Claude 5 formulieren und übergeben Sie die Lösung an ChatGPT (GPT-6 / o4-mini) mit dem Prompt: <em>"Finde den Rechenfehler in diesem statischen Nachweis."</em></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: INTERAKTIVER GENERATOR & PRAXISVORLAGEN */}
      {activeTab === 'praxisvorlagen' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Sliders size={20} className="text-shiraz" /> Interaktiver Ingenieur-Prompt- &amp; Vorlagen-Generator
              </h3>
              <p className="text-xs sm:text-sm text-text-main/75 leading-relaxed">
                Konfiguriere maßgeschneiderte System-Prompts, <code className="font-mono text-xs">CLAUDE.md</code>-Projektdateien oder Workflow-Anweisungen 
                für Ihr Büro oder Ihre Masterarbeit. Mit 1-Klick kopieren und direkt in Claude Projects oder Custom GPTs einfügen.
              </p>
            </div>

            {/* CONFIGURATION CONTROLS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-off-white rounded-xl border border-home-grau/20 text-xs">
              <div>
                <label className="font-bold text-text-main block mb-1.5">1. Ingenieur-Rolle / Fachdisziplin:</label>
                <select 
                  value={genRole} 
                  onChange={(e) => setGenRole(e.target.value as any)}
                  className="w-full p-2 rounded-lg bg-white border border-home-grau/30 text-text-main focus:ring-2 focus:ring-shiraz"
                >
                  <option value="pruefstatik">Prüfstatiker (Eurocode 2 / DIN 1045-2)</option>
                  <option value="bauleitung_vob">Bauleiter (VOB/B &amp; Bautagebuch)</option>
                  <option value="sachverstaendiger">Sachverständiger (Bauschäden)</option>
                  <option value="baustofflabor">Laborleiter (DIN EN 206 Konformität)</option>
                  <option value="nachhaltigkeit_lca">DGNB-Auditor (Ökobilanz &amp; LCA)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-text-main block mb-1.5">2. Leitendes Regelwerk:</label>
                <select 
                  value={genNorm} 
                  onChange={(e) => setGenNorm(e.target.value as any)}
                  className="w-full p-2 rounded-lg bg-white border border-home-grau/30 text-text-main focus:ring-2 focus:ring-shiraz"
                >
                  <option value="ec2_din1045">DIN EN 1992-1-1 &amp; DIN 1045-2 (Betonbau)</option>
                  <option value="vob_b">VOB/B §§ 4, 13, 15 (Bauvertragsrecht)</option>
                  <option value="din18533">DIN 18533 (Bauwerksabdichtung)</option>
                  <option value="din_en_206">DIN EN 206 (Konformitätskontrolle)</option>
                  <option value="geg_dgnb">GEG 2024 &amp; DGNB (Bauphysik &amp; Öko)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-text-main block mb-1.5">3. Ziel-Formatierung:</label>
                <select 
                  value={genFormat} 
                  onChange={(e) => setGenFormat(e.target.value as any)}
                  className="w-full p-2 rounded-lg bg-white border border-home-grau/30 text-text-main focus:ring-2 focus:ring-shiraz"
                >
                  <option value="claudemd">CLAUDE.md (Projektordner-Regeln)</option>
                  <option value="custom_gpt">Custom GPT Instructions (OpenAI)</option>
                  <option value="workflow_prompt">Aufgaben-Prompt (Einmalige Analyse)</option>
                </select>
              </div>
            </div>

            {/* GENERATED TEMPLATE OUTPUT BOX */}
            <div className="relative">
              <div className="flex items-center justify-between bg-slate-900 text-slate-200 px-4 py-2.5 rounded-t-xl text-xs font-mono">
                <span className="flex items-center gap-2">
                  <FileCode size={14} className="text-shiraz" /> 
                  {genFormat === 'claudemd' ? 'CLAUDE.md' : genFormat === 'custom_gpt' ? 'Custom_GPT_System_Instructions.txt' : 'Analyse_Prompt.md'}
                </span>
                <button
                  onClick={() => copyToClipboard(generatedTemplate, 'template')}
                  className="px-3 py-1 bg-shiraz text-white hover:bg-shiraz/90 rounded font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedKey === 'template' ? (
                    <>
                      <Check size={13} /> Kopiert!
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Vorlage kopieren
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 bg-slate-950 text-slate-200 rounded-b-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed max-h-96">
                {generatedTemplate}
              </pre>
            </div>

            {/* CURATED READY-TO-USE INGENIEUR TEMPLATES */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <BookOpen size={16} className="text-shiraz" /> Weitere geprüfte Kopiervorlagen für die Baupraxis
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* TEMPLATE 1: VOB MÄNGELRÜGE */}
                <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-3 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-text-main">VOB/B Mängelrüge (§ 4 Abs. 7)</span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">Rechtssicher</span>
                    </div>
                    <p className="text-text-main/70 leading-relaxed">
                      Erstellt auf Basis von Baustellenfotos und Bautagebuch-Notizen ein formelles Schreiben mit Nachfrist und Kündigungsandrohung.
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`Du bist Bauleiter eines Generalunternehmers. Formuliere auf Basis nachfolgender Stichpunkte eine formelle Mängelrüge nach § 4 Abs. 7 VOB/B vor Abnahme.
Gewerke: Estricharbeiten.
Mangel: Massive Rissbildungen (Rissbreite > 1,5 mm) und fehlende Randdämmstreifen im 1. OG Raum 102-105.
Forderungen:
1. Konkrete Aufforderung zur Mängelbeseitigung bis zum [Datum in 6 Werktagen].
2. Androhung, dass nach fruchtlosem Fristablauf der Auftrag für diese Restleistung nach § 8 Abs. 3 VOB/B entzogen und ein Drittunternehmen auf Kosten des Auftragnehmers beauftragt wird.
3. Sachlicher, bestimmter Tonfall ohne Emotionen.`, 'vob_ruege')}
                    className="w-full py-2 bg-slate-100 hover:bg-shiraz hover:text-white rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'vob_ruege' ? <Check size={14} /> : <Copy size={14} />}
                    Muster-Prompt kopieren
                  </button>
                </div>

                {/* TEMPLATE 2: VOB BEDENKENANMELDUNG */}
                <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-3 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-text-main">VOB/B Bedenkenhinweis (§ 4 Abs. 3)</span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">Vorleistung</span>
                    </div>
                    <p className="text-text-main/70 leading-relaxed">
                      Schützt das Unternehmen vor Schadensersatzansprüchen bei fehlerhaften Vorleistungen anderer Gewerke (z. B. unebene Bodenplatte vor Estrich).
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`Du bist Bauleiter eines Estrichlegers. Formuliere eine Bedenkenanmeldung nach § 4 Abs. 3 VOB/B an den Auftraggeber:
Sachverhalt:
Die bauseits gestellte Stahlbeton-Bodenplatte weist Unebenheiten von bis zu 22 mm auf einer 4-Meter-Messstrecke auf (Zulässig nach DIN 18202 Zeile 3: max. 10 mm).
Risiko: Bei Verlegung des Estrichs auf Trennlage droht ungleichmäßige Estrichdicke, Abreißen der Fugen und Rissbildung.
Forderung: Aufforderung an den AG, den Ausgleich durch den Rohbauer herstellen zu lassen oder schriftliche Freigabe für einen kostenpflichtigen Ausgleichsestrich zu erteilen.`, 'vob_bedenken')}
                    className="w-full py-2 bg-slate-100 hover:bg-shiraz hover:text-white rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'vob_bedenken' ? <Check size={14} /> : <Copy size={14} />}
                    Muster-Prompt kopieren
                  </button>
                </div>

                {/* TEMPLATE 3: BETONREZEPTUR CHECK */}
                <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-3 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-text-main">Betonrezeptur-Prüfung</span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">DIN EN 206</span>
                    </div>
                    <p className="text-text-main/70 leading-relaxed">
                      Prüft eine gegebene Mischung (Zement, w/z, Flugasche, Gestein) gegen Expositionsklassen XC4, XF1 und berechnet den äquivalenten Wasserzementwert.
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`Prüfe folgende Betonrezeptur auf normgerechte Einhaltung der Mindestanforderungen nach DIN EN 206 / DIN 1045-2 für Expositionsklassen XC4, XF1:
Rezeptur pro m³:
- Zement: 300 kg CEM II/A-LL 42,5 R
- Steinkohlenflugasche: 50 kg
- Wirksamer Wassergehalt: 165 Liter
- Gesteinskörnung: 1850 kg (A/B16)
Aufgaben:
1. Berechne den anrechenbaren Flugascheanteil mit k-Wert (k = 0,4) und den resultierenden äquivalenten w/z-Wert (w/z)_eq.
2. Prüfe die Einhaltung von min z, max (w/z)_eq und Mindestdruckfestigkeit.
3. Gib das Ergebnis in einer übersichtlichen Konformitätstabelle aus.`, 'beton_check')}
                    className="w-full py-2 bg-slate-100 hover:bg-shiraz hover:text-white rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'beton_check' ? <Check size={14} /> : <Copy size={14} />}
                    Muster-Prompt kopieren
                  </button>
                </div>

                {/* TEMPLATE 4: STATISCHE VORBEMESSUNG */}
                <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-3 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-text-main">Vorbemessung Einfeldträger</span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">Eurocode 2</span>
                    </div>
                    <p className="text-text-main/70 leading-relaxed">
                      Führt eine statische Vorbemessung für einen Stahlbetonbalken durch: Lastkombination <InlineMath math="q_{Ed}" />, Biegemoment <InlineMath math="M_{Ed}" /> und erforderliche Bewehrung <InlineMath math="a_s" />.
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`Du bist Prüfingenieur für Tragwerksplanung nach Eurocode 2 (DIN EN 1992-1-1).
Führe eine Vorbemessung für einen frei aufliegenden Stahlbeton-Einfeldträger durch:
Eckdaten:
- Stützweite: L = 6,50 m
- Querschnitt: b = 30 cm, h = 50 cm
- Baustoffe: Beton C30/37, Betonstahl B500B
- Ständige Last: g_k = 18 kN/m (inkl. Eigengewicht)
- Veränderliche Last: q_k = 12 kN/m
Aufgaben:
1. Berechne die Bemessungslast q_Ed im GZT mit Teilsicherheitsbeiwerten (gamma_G=1,35, gamma_Q=1,50).
2. Berechne das maximale Feldmoment M_Ed.
3. Berechne die erforderliche Längsbewehrung a_s mit Angabe der statischen Nutzhöhe d (d1 = 5 cm).
4. Schlage eine praxisgerechte Bewehrungswahl vor (z. B. 4 d 20).`, 'statik_vor')}
                    className="w-full py-2 bg-slate-100 hover:bg-shiraz hover:text-white rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'statik_vor' ? <Check size={14} /> : <Copy size={14} />}
                    Muster-Prompt kopieren
                  </button>
                </div>

                {/* TEMPLATE 5: BAUSCHADEN DIAGNOSTIK DIN 18533 */}
                <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-3 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-text-main">Bauschadens-Befundung</span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">DIN 18533</span>
                    </div>
                    <p className="text-text-main/70 leading-relaxed">
                      Strukturiert die Schadensaufnahme bei Feuchteschäden im Kellerbereich (Wassereinwirkungsklasse W1-E bis W2-E) mit Sanierungskonzept.
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`Du bist öffentlich bestellter und vereidigter Sachverständiger für Bauschäden.
Erstelle eine gutachterliche Gliederung und Befundaufnahme zu folgendem Fall:
Befund: Im Kellergeschoss eines 2018 errichteten Wohnhauses tritt an der Sohlen-Wand-Fuge Wasser ein.
Wandbaustoff: Ortbeton C25/30, außen Bitumen-Dickbeschichtung (PMBC).
Grundwasserstand: HGW liegt 80 cm über Oberkante Kellersohle.
Aufgaben:
1. Einordnung der Wassereinwirkungsklasse nach DIN 18533 (W1.1-E vs. W2.1-E).
2. Typische Schadensursachen an der Hohlkehle / Fugenblech analysieren.
3. Notwendige zerstörungsfreie und invasive Baustoffprüfungen auflisten.
4. Skizziere zwei Sanierungsansätze (innenliegende Schleierinjektion vs. Freilegen von außen).`, 'schaden_din')}
                    className="w-full py-2 bg-slate-100 hover:bg-shiraz hover:text-white rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'schaden_din' ? <Check size={14} /> : <Copy size={14} />}
                    Muster-Prompt kopieren
                  </button>
                </div>

                {/* TEMPLATE 6: PYTHON DATENAUSWERTUNG LABOR */}
                <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-3 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-text-main">Prüfdaten-Python-Skript</span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">Automatisierung</span>
                    </div>
                    <p className="text-text-main/70 leading-relaxed">
                      Generiert ein Python-Skript zur automatisierten Auswertung von 28-Tage-Würfeldruckfestigkeiten mit Gauß-Plot und Konformitätscheck.
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`Schreibe ein vollständiges, sauber kommentiertes Python-Skript (pandas, scipy.stats, matplotlib) zur statistischen Auswertung einer Betonprüfserie nach DIN EN 206:
Input: CSV-Datei mit Spalte 'Druckfestigkeit_MPa' (15 Proben C30/37).
Berechnungen:
1. Mittelwert f_cm, Standardabweichung s und charakteristische Festigkeit f_ck,est = f_cm - 1,48 * s.
2. Prüfung von Kriterium 1 (f_cm >= f_ck + 1,48*s) und Kriterium 2 (f_ci >= f_ck - 4).
3. Ausgabe einer Matplotlib-Grafik mit Histogramm, gefitteter Gauß-Glockenkurve und eingezeichnetem Grenzwert f_ck = 30 MPa.`, 'python_labor')}
                    className="w-full py-2 bg-slate-100 hover:bg-shiraz hover:text-white rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'python_labor' ? <Check size={14} /> : <Copy size={14} />}
                    Muster-Prompt kopieren
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // If embedded in KiBaustoffe, render directly without repeating the outer parent header
  if (embedded) {
    return (
      <div className="space-y-6">
        {innerContent}
      </div>
    );
  }

  // Standalone mode: render full card with header and ModuleFooter
  return (
    <div className="flex flex-col gap-8">
      {/* HEADER HERO */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-shiraz/10 text-shiraz rounded-2xl flex-shrink-0">
              <Terminal size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight">
                LLM-Praxis im Bauwesen
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-shiraz/10 text-shiraz border border-shiraz/20">
                  Claude &amp; ChatGPT Professional
                </span>
              </h2>
              <p className="text-xs text-text-main/60 font-semibold uppercase tracking-wider mt-0.5">
                Skills, MCP-Konnektoren, Markdown-Standardisierung, Projektverzeichnisse &amp; Web-Grounding
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 px-3 py-1.5 rounded-xl border border-home-grau/20 text-xs text-text-main/70">
            <Laptop size={14} className="text-shiraz" />
            <span>Leitfaden für Ingenieurbüro &amp; Masterstudium</span>
          </div>
        </div>

        <div className="mt-4 text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/20 leading-relaxed">
          <p>
            Der naive Einsatz von Large Language Models (LLMs) per unstrukturiertem Copy-Paste führt im Bauwesen schnell zu gefährlichen Halluzinationen, Normenverwechslungen und explodierenden Token-Kosten. 
            Dieses Modul vermittelt den <strong>professionellen Ingenieur-Workflow</strong>: Wie Sie <strong>Claude</strong> und <strong>ChatGPT</strong> durch 
            maßgeschneiderte <strong>Skills</strong>, offene <strong>MCP-Konnektoren</strong>, verlustfreie <strong>Markdown-Hierarchien</strong>, 
            kuratierte <strong>Projektordner (<code className="text-xs bg-slate-200 px-1 py-0.5 rounded">CLAUDE.md</code>)</strong> und 
            gerichtetes <strong>Browser-Grounding</strong> in zuverlässige Hochleistungs-Kopiloten für Statik, Bauleitung und Gutachten verwandeln.
          </p>
        </div>

        {innerContent}
      </div>

      {/* MODULE FOOTER */}
      <ModuleFooter
        wikipedia={[
          { title: 'Model Context Protocol (MCP)', url: 'https://modelcontextprotocol.io' },
          { title: 'Large Language Model', url: 'https://de.wikipedia.org/wiki/Gro%C3%9Fes_Sprachmodell' },
          { title: 'Markdown', url: 'https://de.wikipedia.org/wiki/Markdown' }
        ]}
        literatur={[
          'Anthropic (2024): Model Context Protocol Specification & Architecture (modelcontextprotocol.io)',
          'VDI 2552 Blatt 1ff.: Building Information Modeling (BIM) - Datenmanagement und Informationsaustausch',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'EU AI Act (Verordnung (EU) 2024/1689 zur Regulierung Künstlicher Intelligenz)', url: 'https://eur-lex.europa.eu/' },
          { title: 'DIN EN ISO 19650: Organisation und Digitalisierung von Informationen zu Bauwerken und Ingenieurleistungen (BIM)', url: 'https://www.dinmedia.de/' },
          { title: 'VOB/B: Vergabe- und Vertragsordnung für Bauleistungen - Teil B: Allgemeine Vertragsbedingungen', url: 'https://www.dinmedia.de/' }
        ]}
        formeln={[
          {
            formel: 'T_{\\text{eff}} = N_{\\text{words}} \\cdot 1{,}33 \\quad [\\text{Tokens}]',
            erklaerung: 'Faustformel für deutschsprachigen technischen Text: 1 Wort entspricht im Durchschnitt ca. 1,33 bis 1,5 Subword-Tokens im BPE-Tokenizer (Byte Pair Encoding).',
            quelle: 'OpenAI / Anthropic Tokenizer Guidelines'
          },
          {
            formel: '\\text{Context-Ratio} = \\frac{\\sum T_{\\text{Prompt}} + \\sum T_{\\text{Docs}}}{T_{\\text{MaxWindow}}} \\le 0{,}70',
            erklaerung: 'Empfohlene Obergrenze der Kontextauslastung. Um den "Lost-in-the-Middle"-Effekt bei RAG und langen Projektordnern zu minimieren, sollte der Arbeitskontext unter 70 % des maximalen Fensters gehalten werden.',
            quelle: 'Liu et al. (2023): Lost in the Middle - How Language Models Use Long Contexts'
          }
        ]}
      />
    </div>
  );
}
