import type { Dispatch, SetStateAction } from 'react';
import { Sparkles, FolderTree, Globe, Copy, Check, Code, Database, Bot, Zap, Workflow, Laptop, FileCheck2 } from 'lucide-react';

export interface SkillsKonnektorenTabProps {
  skillSubTab: "skills_system" | "mcp_arch" | "mcp_servers";
  setSkillSubTab: Dispatch<SetStateAction<"skills_system" | "mcp_arch" | "mcp_servers">>;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
}

export function SkillsKonnektorenTab({ skillSubTab, setSkillSubTab, copyToClipboard, copiedKey }: SkillsKonnektorenTabProps) {
  return (
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
                    <button aria-pressed={skillSubTab === 'skills_system'}
                      onClick={() => setSkillSubTab('skills_system')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${skillSubTab === 'skills_system' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                    >
                      1. Was sind Skills?
                    </button>
                    <button aria-pressed={skillSubTab === 'mcp_arch'}
                      onClick={() => setSkillSubTab('mcp_arch')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${skillSubTab === 'mcp_arch' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                    >
                      2. MCP-Architektur
                    </button>
                    <button aria-pressed={skillSubTab === 'mcp_servers'}
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
  );
}
