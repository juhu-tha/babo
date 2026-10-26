import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { 
  Terminal, 
  Sparkles, 
  FolderTree, 
  FileCode, 
  Globe, 
  Copy, 
  Check, 
  BookOpen, 
  Sliders, 
  Code, 
  AlertTriangle, 
  Database, 
  Bot, 
  CheckCircle2,
  FileText,
  Search,
  Zap,
  ShieldCheck,
  FolderGit2,
  Table,
  Workflow,
  Laptop,
  CheckSquare,
  FileCheck2
} from 'lucide-react';
import { InlineMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { BrowserTab } from './LlmPraxisTeile/BrowserTab';
import { VerzeichnisseTab } from './LlmPraxisTeile/VerzeichnisseTab';
import { MarkdownTab } from './LlmPraxisTeile/MarkdownTab';
import { SkillsKonnektorenTab } from './LlmPraxisTeile/SkillsKonnektorenTab';

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
      din18533: 'Beurteile alle erdberührten Abdichtungen streng nach DIN 18533 (Ausgabe 2026-06: Wasserbeanspruchungsklassen W1-E bis W4-E, Rissklassen R1-E bis R4-E mit integrierter Rissüberbrückung). Weise stets auf Übergangsdetails und Hohlkehlenausbildungen hin.',
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
      <button aria-pressed={activeTab === 'uebersicht'}
        onClick={() => setActiveTab('uebersicht')}
        className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
          activeTab === 'uebersicht'
            ? 'bg-shiraz text-white border-shiraz shadow-md'
            : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
        }`}
      >
        <Bot size={16} /> 1. Claude vs. ChatGPT im Bau
      </button>
      <button aria-pressed={activeTab === 'skills_konnektoren'}
        onClick={() => setActiveTab('skills_konnektoren')}
        className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
          activeTab === 'skills_konnektoren'
            ? 'bg-shiraz text-white border-shiraz shadow-md'
            : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
        }`}
      >
        <Zap size={16} /> 2. Skills &amp; MCP-Konnektoren
      </button>
      <button aria-pressed={activeTab === 'markdown'}
        onClick={() => setActiveTab('markdown')}
        className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
          activeTab === 'markdown'
            ? 'bg-shiraz text-white border-shiraz shadow-md'
            : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
        }`}
      >
        <FileCode size={16} /> 3. Markdown (.md) Standard
      </button>
      <button aria-pressed={activeTab === 'verzeichnisse'}
        onClick={() => setActiveTab('verzeichnisse')}
        className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
          activeTab === 'verzeichnisse'
            ? 'bg-shiraz text-white border-shiraz shadow-md'
            : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
        }`}
      >
        <FolderTree size={16} /> 4. Projektverzeichnisse &amp; CLAUDE.md
      </button>
      <button aria-pressed={activeTab === 'browser'}
        onClick={() => setActiveTab('browser')}
        className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
          activeTab === 'browser'
            ? 'bg-shiraz text-white border-shiraz shadow-md'
            : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
        }`}
      >
        <Globe size={16} /> 5. Browser &amp; Web-Grounding
      </button>
      <button aria-pressed={activeTab === 'praxisvorlagen'}
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
                    Claude Sonnet / Opus (aktuelle Generation)
                  </span>
                </div>
                <p className="text-xs text-text-main/70">
                  Stark bei präziser technischer Dokumentenanalyse, Code-Erstellung, strikte Formatierung und ausgedehnten Reasoning-Modus.
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
                    GPT (aktuelle Generation inkl. Reasoning)
                  </span>
                </div>
                <p className="text-xs text-text-main/70">
                  Verbreitet für numerische Datenanalysen in Sandboxes, kollaboratives Text-Editing und multimodale Sprach-/Bildinteraktion.
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
                    <td className="p-3 text-amber-700 font-bold">Claude Sonnet</td>
                    <td className="p-3">Claude Project + 200k Window</td>
                    <td className="p-3">Höchste Schärfe beim Auffinden einzelner Schichtdicken im tiefen Fließtext ("Needle in a Haystack Benchmark").</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium">Zugversuchs-Rohdaten (CSV mit 50.000 Messpunkten)</td>
                    <td className="p-3 text-emerald-700 font-bold">ChatGPT Plus / Pro</td>
                    <td className="p-3">Advanced Data Analysis (Python)</td>
                    <td className="p-3">Rechnet mit echten Pandas-Bibliotheken im Sandbox-Container; kein Token-Verbrauch für reine Zahlenkolonnen.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium">Prüfbericht für Bauschaden schreiben &amp; iterieren</td>
                    <td className="p-3 text-emerald-700 font-bold">ChatGPT (Canvas)</td>
                    <td className="p-3">Canvas Inline-Editing</td>
                    <td className="p-3">Präzise Korrekturen an einzelnen Absätzen (z. B. Ursachennachweis), ohne dass die Formatierung zerbricht.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium">Erstellung eines Bauphysik-Rechners (U-Wert / Glaser)</td>
                    <td className="p-3 text-amber-700 font-bold">Claude Sonnet</td>
                    <td className="p-3">Artifacts (React / HTML)</td>
                    <td className="p-3">Sofort bedienbare, interaktive Oberfläche im Browserfenster zum Testen und Weiterentwickeln.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium">Rechtssichere VOB-Mängelrüge (§ 4 Abs. 7 VOB/B)</td>
                    <td className="p-3 text-amber-700 font-bold">Claude Sonnet</td>
                    <td className="p-3">Markdown-Striktheit</td>
                    <td className="p-3">Formuliert formell nüchtern, präzise nach Baurecht, ohne blumige Füllwörter oder typische AI-Klischees.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium">Recherche zu DIBt-Zulassungen &amp; neuen Normen</td>
                    <td className="p-3 text-blue-700 font-bold">Perplexity / ChatGPT Search</td>
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
        <SkillsKonnektorenTab skillSubTab={skillSubTab} setSkillSubTab={setSkillSubTab} copyToClipboard={copyToClipboard} copiedKey={copiedKey} />
      )}

      {/* TAB 3: MARKDOWN (.MD) ALS LINGUA FRANCA */}
      {activeTab === 'markdown' && (
        <MarkdownTab markdownView={markdownView} setMarkdownView={setMarkdownView} calcDocPages={calcDocPages} setCalcDocPages={setCalcDocPages} calcDocType={calcDocType} setCalcDocType={setCalcDocType} tokenStats={tokenStats} />
      )}

      {/* TAB 4: VERZEICHNISSTRUKTUREN & CLAUDE.MD */}
      {activeTab === 'verzeichnisse' && (
        <VerzeichnisseTab dirProjectType={dirProjectType} setDirProjectType={setDirProjectType} copyToClipboard={copyToClipboard} copiedKey={copiedKey} />
      )}

      {/* TAB 5: BROWSER & WEB-GROUNDING */}
      {activeTab === 'browser' && (
        <BrowserTab browserEngine={browserEngine} setBrowserEngine={setBrowserEngine} />
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
                <select aria-label="1. Ingenieur-Rolle / Fachdisziplin" 
                  value={genRole} 
                  onChange={(e) => setGenRole(e.target.value as typeof genRole)}
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
                <select aria-label="2. Leitendes Regelwerk" 
                  value={genNorm} 
                  onChange={(e) => setGenNorm(e.target.value as typeof genNorm)}
                  className="w-full p-2 rounded-lg bg-white border border-home-grau/30 text-text-main focus:ring-2 focus:ring-shiraz"
                >
                  <option value="ec2_din1045">DIN EN 1992-1-1 &amp; DIN 1045-2 (Betonbau)</option>
                  <option value="vob_b">VOB/B §§ 4, 13, 15 (Bauvertragsrecht)</option>
                  <option value="din18533">DIN 18533 (Bauwerksabdichtung)</option>
                  <option value="din_en_206">DIN EN 206 (Konformitätskontrolle)</option>
                  <option value="geg_dgnb">GModG &amp; DGNB (Bauphysik &amp; Öko)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-text-main block mb-1.5">3. Ziel-Formatierung:</label>
                <select aria-label="3. Ziel-Formatierung" 
                  value={genFormat} 
                  onChange={(e) => setGenFormat(e.target.value as typeof genFormat)}
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
          { title: 'DIN EN ISO 19650: Organisation und Digitalisierung von Informationen zu Bauwerken und Ingenieurleistungen (BIM)' },
          { title: 'VOB/B: Vergabe- und Vertragsordnung für Bauleistungen - Teil B: Allgemeine Vertragsbedingungen' }
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
