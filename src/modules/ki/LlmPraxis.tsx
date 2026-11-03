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
import inhalt from '@/content/ki/LlmPraxis.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';

interface LlmPraxisProps {
  embedded?: boolean;
}

type LlmTab = 'uebersicht' | 'skills_konnektoren' | 'markdown' | 'verzeichnisse' | 'browser' | 'praxisvorlagen';

/** Reiter (Z53: Gliederung langer Module über ModuleTabs) */
const LLM_TABS: readonly ModulTab<LlmTab>[] = [
  { id: 'uebersicht', label: inhalt.texte.t1AssistentenImBau.trim(), icon: Bot },
  { id: 'skills_konnektoren', label: inhalt.texte.t2SkillsMcpKonnektoren.trim(), icon: Zap },
  { id: 'markdown', label: inhalt.texte.t3MarkdownMdStandard.trim(), icon: FileCode },
  { id: 'verzeichnisse', label: inhalt.texte.t4ProjektverzeichnisseAnweisungsdatei.trim(), icon: FolderTree },
  { id: 'browser', label: inhalt.texte.t5BrowserWebGrounding.trim(), icon: Globe },
  { id: 'praxisvorlagen', label: inhalt.texte.t6InteraktiverGeneratorVorlagen.trim(), icon: Sliders },
];

export default function LlmPraxis({ embedded = false }: LlmPraxisProps) {
  const [activeTab, setActiveTab] = useState<LlmTab>('uebersicht');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sub-tab states for enriched tabs
  const [skillSubTab, setSkillSubTab] = useState<'skills_system' | 'mcp_arch' | 'mcp_servers'>('skills_system');
  const [dirProjectType, setDirProjectType] = useState<'bauleitung' | 'pruefstatik' | 'masterarbeit'>('bauleitung');
  const [markdownView, setMarkdownView] = useState<'vergleich' | 'syntax' | 'rechner'>('vergleich');
  const [browserEngine, setBrowserEngine] = useState<'deep_research' | 'chat_suche' | 'agent_suche'>('deep_research');

  // States for interactive prompt generator
  const [genRole, setGenRole] = useState<'pruefstatik' | 'bauleitung_vob' | 'sachverstaendiger' | 'baustofflabor' | 'nachhaltigkeit_lca'>('pruefstatik');
  const [genNorm, setGenNorm] = useState<'ec2_din1045' | 'vob_b' | 'din18533' | 'din_en_206' | 'geg_dgnb'>('ec2_din1045');
  const [genFormat, setGenFormat] = useState<'anweisungsdatei' | 'eigener_assistent' | 'workflow_prompt'>('anweisungsdatei');
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
    const costInputStandard = (totalTokens / 1_000_000) * 3.0; // typischer Listenpreis Frontier-Modell, ca. 3 $/MTok Eingabe (Stand prüfen)
    const costCached = (totalTokens / 1_000_000) * 0.30; // Prompt Caching: zwischengespeicherte Eingabe ca. 10 % des Listenpreises
    const contextUsagePercent = Math.min(100, Math.round((totalTokens / 200_000) * 100));
    return { totalTokens, costInputStandard, costCached, contextUsagePercent };
  }, [calcDocPages, calcDocType]);

  // Dynamic generated template
  const generatedTemplate = useMemo(() => {
    const roleTitles = inhalt.daten["LlmPraxis.roleTitles"];

    const normGuidelines = inhalt.daten["LlmPraxis.normGuidelines"];

    if (genFormat === 'anweisungsdatei') {
      return `# PROJEKTANWEISUNGEN.md – Projektrichtlinien für das Ingenieurbüro
<!-- Dateiname je nach Werkzeug anpassen (werkzeugübergreifende Konvention z. B. AGENTS.md) -->

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

    if (genFormat === 'eigener_assistent') {
      return `### System-Anweisungen für einen eigenen KI-Assistenten (${roleTitles[genRole]})

Du bist der KI-Fachassistent für "${roleTitles[genRole]}".

VERHALTENSREGELN:
1. Grundhaltung: Höchste Präzision, faktenbasiert, keine fiktiven Normen oder Paragraphen.
2. Normenbezug: ${normGuidelines[genNorm]}
3. Arbeitsweise bei Dokumenten:
   - Extrahiere Kennwerte stets mit Angabe von Seite und Bauteilbezeichnung.
   - Vergleichen Sie Soll-Werte mit Ist-Werten in einer Markdown-Matrix.
4. Berechnungen:
   - Nutzen Sie bei numerischen Daten bevorzugt die Code-Ausführung (Python), um Rechenfehler auszuschließen.
   - Geben Sie Zwischenschritte und Formeln mit Einheiten an (z. B. kN, MPa, cm²).
5. Grenzen: Erteile keine verbindliche Baufreigabe, sondern weise darauf hin, dass die finale Verantwortung beim zeichnungsberechtigten Ingenieur liegt.`;
    }

    return `### Workflow-Prompt für LLM-Assistenten (Chat-KI)

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

  // Reiter (Z53: ModuleTabs) mit Inhaltsbereich
  const innerContent = (
    <ModuleTabs label="Bereiche der LLM-Praxis" tabs={LLM_TABS} aktiv={activeTab} onWechsel={setActiveTab} className="space-y-6 [&>[role=tablist]]:pt-2 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20">
    <div className="space-y-6">

      {/* TAB 1: ASSISTENTENTYPEN IM VERGLEICH */}
      {activeTab === 'uebersicht' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Typ A: Dokumente & Code */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
                    <h3 className="text-lg font-bold text-text-main"><MdText text={inhalt.texte.assistentTypA} /></h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200"><MdText text={inhalt.texte.assistentTypABadge} /></span>
                </div>
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.starkBeiPräziserTechnischer} /></p>

                <div className="space-y-2.5 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20 text-xs">
                    <div className="font-bold text-text-main flex items-center gap-1.5 mb-1">
                      <FolderGit2 size={14} className="text-amber-600" /><MdText text={inhalt.texte.projektbereicheGrosserKontext} /></div>
                    <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.zentraleWissensbasisFürGanze} /></p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20 text-xs">
                    <div className="font-bold text-text-main flex items-center gap-1.5 mb-1">
                      <Code size={14} className="text-amber-600" /><MdText text={inhalt.texte.artifactsInteraktiveToolsSvg} /></div>
                    <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.vorschauRendertInteraktiveReact} /></p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20 text-xs">
                    <div className="font-bold text-text-main flex items-center gap-1.5 mb-1">
                      <Sparkles size={14} className="text-amber-600" /><MdText text={inhalt.texte.extendedThinkingDeepReasoning} /></div>
                    <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.ermöglichtTransparenteDenkkettenBei} /></p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-home-grau/20 text-xs text-text-main/60 flex items-center justify-between">
                <span><MdText text={inhalt.texte.besteEignung} /></span>
                <strong className="text-shiraz"><MdText text={inhalt.texte.gutachtenLvsCodeProjektordner} /></strong>
              </div>
            </div>

            {/* Typ B: Datenanalyse & Multimodalität */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h3 className="text-lg font-bold text-text-main"><MdText text={inhalt.texte.assistentTypB} /></h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200"><MdText text={inhalt.texte.assistentTypBBadge} /></span>
                </div>
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.verbreitetFürNumerischeDatenanalysen} /></p>

                <div className="space-y-2.5 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20 text-xs">
                    <div className="font-bold text-text-main flex items-center gap-1.5 mb-1">
                      <Database size={14} className="text-emerald-600" /><MdText text={inhalt.texte.advancedDataAnalysisPython} /></div>
                    <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.ladenSieCsvRohdaten} /></p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20 text-xs">
                    <div className="font-bold text-text-main flex items-center gap-1.5 mb-1">
                      <FileText size={14} className="text-emerald-600" /><MdText text={inhalt.texte.canvasKooperativerTexteditor} /></div>
                    <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.erlaubtDasGezielteÜberarbeiten} /></p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20 text-xs">
                    <div className="font-bold text-text-main flex items-center gap-1.5 mb-1">
                      <Bot size={14} className="text-emerald-600" /><MdText text={inhalt.texte.customGptsMitOpenapi} /></div>
                    <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.bindenSieEigeneBürowerkzeuge} /></p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-home-grau/20 text-xs text-text-main/60 flex items-center justify-between">
                <span><MdText text={inhalt.texte.besteEignung2} /></span>
                <strong className="text-emerald-700"><MdText text={inhalt.texte.messreihenExcelCsvVoice} /></strong>
              </div>
            </div>
          </div>

          <p className="text-xs text-text-main/70 bg-off-white p-3 rounded-xl border border-home-grau/20 leading-relaxed"><MdText text={inhalt.texte.hinweisFunktionsklassen} /></p>

          {/* DECISION MATRIX */}
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Table size={18} className="text-shiraz" /><MdText text={inhalt.texte.entscheidungsmatrixWannWelchesModell} /></h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-home-grau/30 bg-slate-50">
                    <th className="p-3 font-bold text-text-main">Ingenieuraufgabe</th>
                    <th className="p-3 font-bold text-text-main"><MdText text={inhalt.texte.empfohlenesModell} /></th>
                    <th className="p-3 font-bold text-text-main"><MdText text={inhalt.texte.bevorzugtesFeature} /></th>
                    <th className="p-3 font-bold text-text-main"><MdText text={inhalt.texte.technischerHintergrundMehrwert} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium"><MdText text={inhalt.texte.baugrundgutachten150SeitenPdf} /></td>
                    <td className="p-3 text-amber-700 font-bold"><MdText text={inhalt.texte.mtxTypA} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.mtxProjektbereich} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.höchsteSchärfeBeimAuffinden} /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium"><MdText text={inhalt.texte.zugversuchsRohdatenCsvMit} /></td>
                    <td className="p-3 text-emerald-700 font-bold"><MdText text={inhalt.texte.mtxTypB} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.advancedDataAnalysisPython2} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.rechnetMitEchtenPandas} /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium"><MdText text={inhalt.texte.prüfberichtFürBauschadenSchreiben} /></td>
                    <td className="p-3 text-emerald-700 font-bold"><MdText text={inhalt.texte.mtxTypBEditor} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.canvasInlineEditing} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.präziseKorrekturenAnEinzelnen} /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium"><MdText text={inhalt.texte.erstellungEinesBauphysikRechners} /></td>
                    <td className="p-3 text-amber-700 font-bold"><MdText text={inhalt.texte.mtxTypA2} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.artifactsReactHtml} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.sofortBedienbareInteraktiveOberfläche} /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium"><MdText text={inhalt.texte.rechtssichereVobMängelrüge4} /></td>
                    <td className="p-3 text-shiraz font-bold"><MdText text={inhalt.texte.mtxTypAoderB} /></td>
                    <td className="p-3">Markdown-Striktheit</td>
                    <td className="p-3"><MdText text={inhalt.texte.formuliertFormellNüchternPräzise} /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium"><MdText text={inhalt.texte.rechercheZuDibtZulassungen} /></td>
                    <td className="p-3 text-blue-700 font-bold"><MdText text={inhalt.texte.mtxSuchassistent} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.webGroundingZitate} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.liveWebsucheMitDirekten} /></td>
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

      {/* TAB 4: VERZEICHNISSTRUKTUREN & PROJEKTANWEISUNGSDATEI */}
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
                <Sliders size={20} className="text-shiraz" /><MdText text={inhalt.texte.interaktiverIngenieurPromptVorlagen} /></h3>
              <p className="text-xs sm:text-sm text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.konfiguriereMaßgeschneiderteSystemPrompt} /><code className="font-mono text-xs">PROJEKTANWEISUNGEN.md</code><MdText text={inhalt.texte.projektdateienOderWorkflowAnweisungen} /></p>
            </div>

            {/* CONFIGURATION CONTROLS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-off-white rounded-xl border border-home-grau/20 text-xs">
              <div>
                <label className="font-bold text-text-main block mb-1.5"><MdText text={inhalt.texte.t1IngenieurRolleFachdisziplin} /></label>
                <select aria-label={inhalt.werte.t1IngenieurRolleFachdisziplin} 
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
                <label className="font-bold text-text-main block mb-1.5"><MdText text={inhalt.texte.t2LeitendesRegelwerk} /></label>
                <select aria-label={inhalt.werte.t2LeitendesRegelwerk} 
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
                <label className="font-bold text-text-main block mb-1.5"><MdText text={inhalt.texte.t3ZielFormatierung} /></label>
                <select aria-label={inhalt.werte.t3ZielFormatierung} 
                  value={genFormat} 
                  onChange={(e) => setGenFormat(e.target.value as typeof genFormat)}
                  className="w-full p-2 rounded-lg bg-white border border-home-grau/30 text-text-main focus:ring-2 focus:ring-shiraz"
                >
                  <option value="anweisungsdatei">Projektanweisungsdatei (Markdown, Projektordner-Regeln)</option>
                  <option value="eigener_assistent">System-Anweisungen (eigener Assistent)</option>
                  <option value="workflow_prompt">Aufgaben-Prompt (Einmalige Analyse)</option>
                </select>
              </div>
            </div>

            {/* GENERATED TEMPLATE OUTPUT BOX */}
            <div className="relative">
              <div className="flex items-center justify-between bg-slate-100 text-text-main px-4 py-2.5 rounded-t-xl text-xs font-mono">
                <span className="flex items-center gap-2">
                  <FileCode size={14} className="text-shiraz" /> 
                  {genFormat === 'anweisungsdatei' ? 'PROJEKTANWEISUNGEN.md' : genFormat === 'eigener_assistent' ? 'Assistent_System_Anweisungen.txt' : 'Analyse_Prompt.md'}
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
                      <Copy size={13} /><MdText text={inhalt.texte.vorlageKopieren} /></>
                  )}
                </button>
              </div>

              <pre className="p-4 bg-off-white text-text-main rounded-b-xl text-xs font-mono overflow-x-auto border border-home-grau/30 leading-relaxed max-h-96">
                {generatedTemplate}
              </pre>
            </div>

            {/* CURATED READY-TO-USE INGENIEUR TEMPLATES */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <BookOpen size={16} className="text-shiraz" /><MdText text={inhalt.texte.weitereGeprüfteKopiervorlagenFür} /></h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* TEMPLATE 1: VOB MÄNGELRÜGE */}
                <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-3 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-text-main"><MdText text={inhalt.texte.vobBMängelrüge4} /></span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">Rechtssicher</span>
                    </div>
                    <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.erstelltAufBasisVon} /></p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(inhalt.werte.duBistBauleiterEines, 'vob_ruege')}
                    className="w-full py-2 bg-slate-100 hover:bg-shiraz hover:text-white rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'vob_ruege' ? <Check size={14} /> : <Copy size={14} />}<MdText text={inhalt.texte.musterPromptKopieren} /></button>
                </div>

                {/* TEMPLATE 2: VOB BEDENKENANMELDUNG */}
                <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-3 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-text-main"><MdText text={inhalt.texte.vobBBedenkenhinweis4} /></span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">Vorleistung</span>
                    </div>
                    <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.schütztDasUnternehmenVor} /></p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(inhalt.werte.duBistBauleiterEines2, 'vob_bedenken')}
                    className="w-full py-2 bg-slate-100 hover:bg-shiraz hover:text-white rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'vob_bedenken' ? <Check size={14} /> : <Copy size={14} />}<MdText text={inhalt.texte.musterPromptKopieren2} /></button>
                </div>

                {/* TEMPLATE 3: BETONREZEPTUR CHECK */}
                <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-3 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-text-main">Betonrezeptur-Prüfung</span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">DIN EN 206</span>
                    </div>
                    <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.prüftEineGegebeneMischung} /></p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(inhalt.werte.prüfeFolgendeBetonrezepturAuf, 'beton_check')}
                    className="w-full py-2 bg-slate-100 hover:bg-shiraz hover:text-white rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'beton_check' ? <Check size={14} /> : <Copy size={14} />}<MdText text={inhalt.texte.musterPromptKopieren3} /></button>
                </div>

                {/* TEMPLATE 4: STATISCHE VORBEMESSUNG */}
                <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-3 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-text-main"><MdText text={inhalt.texte.vorbemessungEinfeldträger} /></span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">Eurocode 2</span>
                    </div>
                    <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.führtEineStatischeVorbemessung} /></p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(inhalt.werte.duBistPrüfingenieurFür, 'statik_vor')}
                    className="w-full py-2 bg-slate-100 hover:bg-shiraz hover:text-white rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'statik_vor' ? <Check size={14} /> : <Copy size={14} />}<MdText text={inhalt.texte.musterPromptKopieren4} /></button>
                </div>

                {/* TEMPLATE 5: BAUSCHADEN DIAGNOSTIK DIN 18533 */}
                <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-3 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-text-main">Bauschadens-Befundung</span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">DIN 18533</span>
                    </div>
                    <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.strukturiertDieSchadensaufnahmeBei} /></p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(inhalt.werte.duBistÖffentlichBestellter, 'schaden_din')}
                    className="w-full py-2 bg-slate-100 hover:bg-shiraz hover:text-white rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'schaden_din' ? <Check size={14} /> : <Copy size={14} />}<MdText text={inhalt.texte.musterPromptKopieren5} /></button>
                </div>

                {/* TEMPLATE 6: PYTHON DATENAUSWERTUNG LABOR */}
                <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-3 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-text-main">Prüfdaten-Python-Skript</span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">Automatisierung</span>
                    </div>
                    <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.generiertEinPythonSkript} /></p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(inhalt.werte.schreibeEinVollständigesSauber, 'python_labor')}
                    className="w-full py-2 bg-slate-100 hover:bg-shiraz hover:text-white rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'python_labor' ? <Check size={14} /> : <Copy size={14} />}<MdText text={inhalt.texte.musterPromptKopieren6} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </ModuleTabs>
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
              <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight"><MdText text={inhalt.texte.llmPraxisImBauwesen} /><span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-shiraz/10 text-shiraz border border-shiraz/20"><MdText text={inhalt.texte.chatKiProfessional} /></span>
              </h2>
              <p className="text-xs text-text-main/60 font-semibold uppercase tracking-wider mt-0.5"><MdText text={inhalt.texte.skillsMcpKonnektorenMarkdown} /></p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 px-3 py-1.5 rounded-xl border border-home-grau/20 text-xs text-text-main/70">
            <Laptop size={14} className="text-shiraz" />
            <span><MdText text={inhalt.texte.leitfadenFürIngenieurbüroMasterstudium} /></span>
          </div>
        </div>

        <div className="mt-4 text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/20 leading-relaxed">
          <p><MdText text={inhalt.texte.derNaiveEinsatzVon} /><strong><MdText text={inhalt.texte.projektordner} /><code className="text-xs bg-slate-200 px-1 py-0.5 rounded">PROJEKTANWEISUNGEN.md</code>)</strong><MdText text={inhalt.texte.undGerichtetesBrowserGrounding} /></p>
        </div>

        {innerContent}
      </div>

      {/* MODULE FOOTER */}
      <ModuleFooter
        wikipedia={[
          { title: inhalt.werte.modelContextProtocolMcp, url: 'https://modelcontextprotocol.io' },
          { title: inhalt.werte.largeLanguageModel, url: 'https://de.wikipedia.org/wiki/Large_Language_Model' },
          { title: 'Markdown', url: 'https://de.wikipedia.org/wiki/Markdown' }
        ]}
        literatur={inhalt.daten["LlmPraxis.literatur"]}
        regelwerke={inhalt.daten["LlmPraxis.regelwerke"]}
        formeln={inhalt.daten["LlmPraxis.formeln"]}
      />
    </div>
  );
}
