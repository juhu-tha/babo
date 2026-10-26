import type { Dispatch, SetStateAction } from 'react';
import { Sparkles, FolderTree, Globe, Copy, Check, Code, Database, Bot, Zap, Workflow, Laptop, FileCheck2 } from 'lucide-react';
import inhalt from '@/content/ki/LlmPraxisTeile/SkillsKonnektorenTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

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
                      <h3 className="text-lg font-bold text-text-main"><MdText text={inhalt.texte.skillsModelContextProtocol} /></h3>
                      <p className="text-xs text-text-main/60"><MdText text={inhalt.texte.wieModerneLlmsDurch} /></p>
                    </div>
                  </div>
    
                  {/* Subtabs for Skills & MCP */}
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button aria-pressed={skillSubTab === 'skills_system'}
                      onClick={() => setSkillSubTab('skills_system')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${skillSubTab === 'skills_system' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                    ><MdText text={inhalt.texte.t1WasSindSkills} /></button>
                    <button aria-pressed={skillSubTab === 'mcp_arch'}
                      onClick={() => setSkillSubTab('mcp_arch')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${skillSubTab === 'mcp_arch' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                    ><MdText text={inhalt.texte.t2McpArchitektur} /></button>
                    <button aria-pressed={skillSubTab === 'mcp_servers'}
                      onClick={() => setSkillSubTab('mcp_servers')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${skillSubTab === 'mcp_servers' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                    ><MdText text={inhalt.texte.t3PraxisKonnektoren} /></button>
                  </div>
                </div>
    
                {/* SUB-VIEW 1: WAS SIND SKILLS? (DAS SKILL.MD-KONZEPT) */}
                {skillSubTab === 'skills_system' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="text-xs sm:text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/20 leading-relaxed space-y-2">
                      <p><MdText text={inhalt.texte.einSkillIstEine} /><code className="font-mono bg-slate-200 px-1 py-0.5 rounded text-xs">SKILL.md</code><MdText text={inhalt.texte.abgelegtStattDasModell} /></p>
                    </div>
    
                    {/* COMPARISON CARDS: SYSTEM PROMPT VS SKILL VS MCP */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-text-main">
                          <Bot size={15} className="text-blue-600" /> System-Prompt
                        </div>
                        <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.statischeGrundhaltungDuBist} /></p>
                        <div className="pt-2 border-t border-home-grau/20 text-[11px] text-slate-500"><MdText text={inhalt.texte.grenzeVerbrauchtPermanentKontextfenster} /></div>
                      </div>
    
                      <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <Sparkles size={15} className="text-amber-600" /><MdText text={inhalt.texte.agentSkillSkillMd} /></div>
                        <p className="text-amber-950/80 leading-relaxed"><MdText text={inhalt.texte.spezialisiertesVerfahrenshandbuchEnthält} /></p>
                        <div className="pt-2 border-t border-amber-200/40 text-[11px] text-amber-900"><MdText text={inhalt.texte.vorteil0TokenVerbrauch} /></div>
                      </div>
    
                      <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/60 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                          <Zap size={15} className="text-emerald-600" /> MCP-Konnektor
                        </div>
                        <p className="text-emerald-950/80 leading-relaxed"><MdText text={inhalt.texte.schnittstelleZurAußenweltFührt} /></p>
                        <div className="pt-2 border-t border-emerald-200/40 text-[11px] text-emerald-900"><MdText text={inhalt.texte.vorteilEchteDatenStatt} /></div>
                      </div>
                    </div>
    
                    {/* SKILL.MD MUSTERCODE */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-shiraz flex items-center gap-1.5">
                          <FileCheck2 size={15} /><MdText text={inhalt.texte.praxisBauingenieurSkillVob} /></h4>
                        <button
                          onClick={() => copyToClipboard(inhalt.werte.nameVobBedenkenhinweisPruefer, 'skill_sample')}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-shiraz hover:text-white rounded text-xxs font-bold flex items-center gap-1 transition-all"
                        >
                          {copiedKey === 'skill_sample' ? <Check size={12} /> : <Copy size={12} />}
                          <span><MdText text={inhalt.texte.skillKopieren} /></span>
                        </button>
                      </div>
    
                      <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
    {inhalt.werte.nameVobBedenkenhinweisPruefer2}
                      </pre>
                    </div>
                  </div>
                )}
    
                {/* SUB-VIEW 2: MCP ARCHITEKTUR */}
                {skillSubTab === 'mcp_arch' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.mitDemVonAnthropic} /></p>
    
                    {/* Architecture diagram */}
                    <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 my-4 space-y-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-shiraz flex items-center gap-1.5">
                        <Workflow size={15} /><MdText text={inhalt.texte.mcpArchitekturImBauplanungsprozess} /></div>
    
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="p-4 bg-white rounded-xl border border-home-grau/30 shadow-xs space-y-2">
                          <div className="font-bold text-text-main flex items-center gap-1.5">
                            <Laptop size={15} className="text-blue-600" /><MdText text={inhalt.texte.t1LlmClientClaude} /></div>
                          <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.verstehtDieAbsichtDes} /></p>
                        </div>
    
                        <div className="p-4 bg-white rounded-xl border border-home-grau/30 shadow-xs space-y-2">
                          <div className="font-bold text-text-main flex items-center gap-1.5">
                            <Zap size={15} className="text-amber-600" /><MdText text={inhalt.texte.t2McpServerLokal} /></div>
                          <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.bietetWerkzeugeAn} /><code className="bg-slate-100 px-1 py-0.5 rounded">get_ifc_element_properties()</code>, <code className="bg-slate-100 px-1 py-0.5 rounded">read_statik_pdf()</code><MdText text={inhalt.texte.führtSichereAbfragenOhne} /></p>
                        </div>
    
                        <div className="p-4 bg-white rounded-xl border border-home-grau/30 shadow-xs space-y-2">
                          <div className="font-bold text-text-main flex items-center gap-1.5">
                            <Database size={15} className="text-emerald-600" /><MdText text={inhalt.texte.t3DatenquelleBauSoftware} /></div>
                          <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.bimDateienIfcSqlite} /></p>
                        </div>
                      </div>
                    </div>
    
                    <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 text-xs space-y-2">
                      <span className="font-bold text-text-main block"><MdText text={inhalt.texte.sicherheitsvorteilFürIngenieurbüros} /></span>
                      <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.mcpArbeitetÜberDas} /></p>
                    </div>
                  </div>
                )}
    
                {/* SUB-VIEW 3: PRAXIS-KONNEKTOREN */}
                {skillSubTab === 'mcp_servers' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 text-xs space-y-2">
                        <div className="font-bold text-text-main flex items-center gap-2">
                          <FolderTree size={16} className="text-shiraz" /><MdText text={inhalt.texte.filesystemMcpServer} /></div>
                        <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.ermöglichtClaudeGezieltIn} /></p>
                        <div className="text-[11px] text-text-main/60 bg-white p-2 rounded border border-home-grau/20 font-mono"><MdText text={inhalt.texte.claudeDesktopConfigJson} /></div>
                      </div>
    
                      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 text-xs space-y-2">
                        <div className="font-bold text-text-main flex items-center gap-2">
                          <Code size={16} className="text-shiraz" /><MdText text={inhalt.texte.pythonIfcopenshellMcp} /></div>
                        <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.verbindetDasModellMit} /><code className="font-mono">IfcWall</code>, <code className="font-mono">IfcBeam</code><MdText text={inhalt.texte.direktGeometrischUndMengenmäßig} /></p>
                        <div className="text-[11px] text-text-main/60 bg-white p-2 rounded border border-home-grau/20 font-mono"><MdText text={inhalt.texte.toolsQueryIfcVolumes} /></div>
                      </div>
    
                      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 text-xs space-y-2">
                        <div className="font-bold text-text-main flex items-center gap-2">
                          <Database size={16} className="text-shiraz" /><MdText text={inhalt.texte.gaebAvaMcpKonnektor} /></div>
                        <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.parstLeistungsverzeichnisseImFormat} /></p>
                        <div className="text-[11px] text-text-main/60 bg-white p-2 rounded border border-home-grau/20 font-mono"><MdText text={inhalt.texte.toolsParseGaebPositions} /></div>
                      </div>
    
                      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 text-xs space-y-2">
                        <div className="font-bold text-text-main flex items-center gap-2">
                          <Globe size={16} className="text-shiraz" /><MdText text={inhalt.texte.dwdWetterKonnektorBautagebuch} /></div>
                        <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.ziehtStundengenaueHistorischeTemperatur} /></p>
                        <div className="text-[11px] text-text-main/60 bg-white p-2 rounded border border-home-grau/20 font-mono"><MdText text={inhalt.texte.toolsFetchDwdWeather} /></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
  );
}
