import type { Dispatch, SetStateAction } from 'react';
import { FolderTree, FileCode, Copy, Check } from 'lucide-react';

export interface VerzeichnisseTabProps {
  dirProjectType: "bauleitung" | "pruefstatik" | "masterarbeit";
  setDirProjectType: Dispatch<SetStateAction<"bauleitung" | "pruefstatik" | "masterarbeit">>;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
}

export function VerzeichnisseTab({ dirProjectType, setDirProjectType, copyToClipboard, copiedKey }: VerzeichnisseTabProps) {
  return (
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
                    <button aria-pressed={dirProjectType === 'bauleitung'}
                      onClick={() => setDirProjectType('bauleitung')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${dirProjectType === 'bauleitung' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                    >
                      Bauleitung (VOB)
                    </button>
                    <button aria-pressed={dirProjectType === 'pruefstatik'}
                      onClick={() => setDirProjectType('pruefstatik')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${dirProjectType === 'pruefstatik' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                    >
                      Prüfstatik (EC2)
                    </button>
                    <button aria-pressed={dirProjectType === 'masterarbeit'}
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
- Geltende Normen: Eurocode 2 (DIN EN 1992-1-1), DIN 1045-2, GModG (vormals GEG), VOB/B

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
  );
}
