import { useState } from 'react';
import { useTabContext } from '../contexts/TabContext';
import {
  Info,
  Layers,
  BookOpen,
  FileText,
  Globe,
  FileSearch,
  Compass,
  History,
  CheckCircle,
  GraduationCap
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import ModuleHistoryView from '@/src/components/ui/ModuleHistoryView';
import ModuleOverviewView from '@/src/components/ui/ModuleOverviewView';
import { MODULE_HISTORY_DATA } from '@/src/data/moduleHistoryData';
import { MODULES_DATA } from './moduleinfo/daten';
import { COMPREHENSIVE_RESOURCES } from './moduleinfo/ressourcen';

interface ModuleInfoProps {
  group: string;
}

export default function ModuleInfo({ group }: ModuleInfoProps) {
  const { setActiveTab } = useTabContext();
  const [activeSection, setActiveSection] = useState<'grundlagen' | 'ueberblick' | 'inhalte' | 'weiterfuehrend' | 'klassifizierung' | 'historie'>('grundlagen');
  const [laborStep, setLaborStep] = useState(0);

  const normalizedGroup = group.toLowerCase().replace('_info', '');
  const data = MODULES_DATA[normalizedGroup];
  const resources = COMPREHENSIVE_RESOURCES[normalizedGroup] || { websites: [], books: [], publications: [], dissertations: [] };
  const historyData = MODULE_HISTORY_DATA[normalizedGroup];

  if (!data) {
    return (
      <div className="bg-white dark:bg-slate-900 text-text-main dark:text-slate-100 rounded-2xl shadow-sm border border-home-grau/30 dark:border-slate-800 p-12 text-center">
        <Info className="w-12 h-12 text-shiraz mx-auto mb-4" />
        <h3 className="text-lg font-bold text-text-main dark:text-slate-100 mb-2">Modulinfos für dieses Thema</h3>
        <p className="text-sm text-text-main/60 dark:text-slate-400">Aktuell ist dieses Informationsmodul leer oder befindet sich in Vorbereitung.</p>
      </div>
    );
  }

  const IconComponent = data.icon;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HEADER CARD */}
      <div className="bg-white dark:bg-slate-900 text-text-main dark:text-slate-100 rounded-2xl shadow-sm border border-home-grau/30 dark:border-slate-800 overflow-hidden">
        <div className="border-b border-home-grau/30 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-shiraz/10 rounded-xl text-shiraz">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main dark:text-slate-100">Bereich: {data.title}</h2>
              <p className="text-sm text-text-main/70 dark:text-slate-350">{data.tagline}</p>
            </div>
          </div>
        </div>

        {/* SECTION TABS */}
        <div className="border-b border-home-grau/30 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 p-2 sm:p-4 print:hidden">
          <div className="flex flex-wrap gap-2">
            <button aria-pressed={activeSection === 'grundlagen'}
              onClick={() => setActiveSection('grundlagen')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'grundlagen'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <Info size={14} />
              <span className="truncate">Modulbasis</span>
            </button>
            <button aria-pressed={activeSection === 'ueberblick'}
              onClick={() => setActiveSection('ueberblick')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'ueberblick'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <Compass size={14} />
              <span className="truncate">Überblick</span>
            </button>
            <button aria-pressed={activeSection === 'inhalte'}
              onClick={() => setActiveSection('inhalte')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'inhalte'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <BookOpen size={14} />
              <span className="truncate">Lehrthemen</span>
            </button>
            <button aria-pressed={activeSection === 'weiterfuehrend'}
              onClick={() => setActiveSection('weiterfuehrend')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'weiterfuehrend'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <FileSearch size={14} />
              <span className="truncate">Quellen</span>
            </button>
            <button aria-pressed={activeSection === 'historie'}
              onClick={() => setActiveSection('historie')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'historie'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <History size={14} />
              <span className="truncate">Historie</span>
            </button>
            {normalizedGroup === 'baustoffe' && (
              <button aria-pressed={activeSection === 'klassifizierung'}
                onClick={() => setActiveSection('klassifizierung')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeSection === 'klassifizierung'
                    ? 'bg-shiraz text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                <Layers size={14} />
                <span className="truncate">Systematik</span>
              </button>
            )}
          </div>
        </div>

        {/* CONTENT PANEL */}
        <div className="p-6">
          {activeSection === 'grundlagen' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <FileText className="text-shiraz w-5 h-5" />
                  {data.basicsTitle}
                </h3>
                <p className="text-sm text-text-main/80 leading-relaxed">
                  {data.basicsDesc1}
                </p>
                <p className="text-sm text-text-main/80 leading-relaxed">
                  {data.basicsDesc2}
                </p>
              </div>

              {/* LABOR WORKFLOW DIRECTIVE (Interactive stepwise roadmap/Fahrplan) */}
              {normalizedGroup === 'labor' && (
                <div className="p-5 bg-stone-50 border border-home-grau/25 rounded-xl space-y-4">
                  <div className="border-b border-home-grau/25 pb-3">
                    <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest block mb-0.5">Praxis-Fahrplan</span>
                    <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <Compass size={18} className="text-shiraz" />
                      Interaktiver Schritt-für-Schritt Prüfungsleitfaden (Workflow)
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Dieser chronologische Leitfaden führt Sie Schritt für Schritt durch das Zusammenwirken aller Einzelmodule und Werkstoffdisziplinen der Baubetreuung – von der Baustelle bis zur schlussendlichen Freigabeentscheidung. Jedes Modul ist so eigenständig und ohne Vorwissen anwendbar.
                    </p>
                  </div>

                  {/* Flow Steps Buttons Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {[
                      { num: "01", label: "Probenahme", title: "Probenahme", desc: "Entnahme & Logistik" },
                      { num: "02", label: "Sensorik & Messen", title: "Sensorik", desc: "Applikation & Justierung" },
                      { num: "03", label: "Laborprüfung", title: "Mechanische Prüfung", desc: "Druck, Biegezug & E-Modul" },
                      { num: "04", label: "Materialanalytik", title: "Mikroanalytik", desc: "XRD, GC-MS & RFA" },
                      { num: "05", label: "Statistik", title: "Statistische Absicherung", desc: "Konformität & Ausschuss" },
                    ].map((step, idx) => (
                      <button
                        key={idx}
                        onClick={() => setLaborStep(idx)}
                        className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                          laborStep === idx
                            ? 'bg-shiraz text-white border-shiraz shadow-sm ring-1 ring-shiraz hover:bg-shiraz/95'
                            : 'bg-white text-slate-800 border-home-grau/25 hover:bg-slate-50 hover:border-slate-350'
                        }`}
                      >
                        <span className={`text-[10px] font-black tracking-wider ${laborStep === idx ? 'text-white/80' : 'text-shiraz/80'}`}>{step.num}</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold leading-tight truncate">{step.label}</span>
                          <span className={`text-[8.5px] leading-tight truncate mt-0.5 ${laborStep === idx ? 'text-white/70' : 'text-slate-450'}`}>{step.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Flow Step Card Content */}
                  <div className="bg-white p-4 rounded-lg border border-home-grau/25 shadow-inner">
                    {laborStep === 0 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-home-grau/15 pb-2">
                          <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 bg-shiraz text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
                            Schritt 1: Normgerechte Probenahme &amp; Feld-Erkundung (Probenahme-Modul)
                          </h5>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 font-mono rounded">DIN EN 12504-1 / LAGA PN 98</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          Keine Laborprüfung ist besser als ihre Probenahme. Eine unsachgemäße oder willkürliche Materialentnahme (z. B. nur von der Oberfläche eines Haufwerks oder aus nur einem Bauteilbereich) führt zu Entmischungseffekten und nicht repräsentativen Kennwerten.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1.5">
                            <span className="font-extrabold text-slate-900 block text-[11px] uppercase tracking-wide">Praxistipp für Bohrkernentnahme:</span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-650">
                              <li><strong>Bewehrung orten:</strong> Vor der Kernbohrung ist ein zerstörungsfreies Scannen der Bewehrungsstähle zwingend erforderlich, um ein Durchtrennen tragender Eisen zu vermeiden.</li>
                              <li><strong>Mindestmaß beachten:</strong> Der Kerndurchmesser sollte mindestens das Dreifache des Größtkorns betragen (d_K ≥ 3 · d_max). Bei 32 mm Größtkorn ist daher eine Bohrkrone von mindestens 100 mm erforderlich.</li>
                              <li><strong>Kernanzahl planen:</strong> Je Prüfbereich mehrere Kerne entnehmen (Mindestanzahl je Bewertungsverfahren nach DIN EN 13791).</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-stone-50 border border-home-grau/15 rounded-md flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-shiraz block text-[10.5px]">LAGA PN 98 (Abfallbeprobung)</span>
                              <p className="text-[10.5px] text-slate-600 leading-normal mt-1">
                                Um z. B. PAK-haltige Asphaltschichten, HBCD-haltige Dämmstoffe (EPS/XPS) oder auslaugbare Salze im Bauschutt nachvollziehbar zu erfassen, verlangt die LAGA PN 98 eine planmäßige Beprobung des gesamten Haufwerks (nach § 8 EBV verbindlich für mineralische Ersatzbaustoffe).
                              </p>
                            </div>
                            <div className="bg-white p-1.5 border border-home-grau/10 rounded text-[9.5px] font-mono text-slate-500 mt-2 text-center">
                              Mindestvolumen der Proben: abhängig vom Größtkorn (Tabelle der LAGA PN 98)
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {laborStep === 1 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-home-grau/15 pb-2">
                          <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 bg-shiraz text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
                            Schritt 2: Sensor-Applikation, Justierung &amp; Unsicherheit (Messen &amp; Prüfen-Modul)
                          </h5>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 font-mono rounded">VDI/VDE 2635 / GUM-Standard</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          Für verlässliche Messdaten (z. B. Verformungen im E-Modul-Versuch oder Spannungsaufzeichnungen an Trägern) müssen Sensoren kalibriert, thermische Störungen kompensiert und mechanisch starr angebunden sein.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1.5">
                            <span className="font-extrabold text-slate-900 block text-[11px] uppercase tracking-wide">Dehnungsaufzeichnung (DMS):</span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-650">
                              <li><strong>Oberflächenvorbereitung:</strong> Die Baustoffkontaktfläche muss planparallel angeschliffen, absolut staubbefreit und chemisch entfettet (z. B. mit Isopropanol) werden.</li>
                              <li><strong>Brückenschaltung konfigurieren:</strong> Verwenden Sie Wheatstone-Voll- oder Halbbrücken, um parasitäre Biegespannungen oder witterungsbedingte Temperatureffekte (&Delta;T) automatisch zu kompensieren.</li>
                              <li><strong>Kalibrierfaktor (k-Wert):</strong> Exakt im Verstärker einstellen. Dehnung entspricht &epsilon; = (1/k) · (&Delta;R/R).</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-md flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-indigo-900 block text-[10.5px]">Messunsicherheit nach GUM (BIPM)</span>
                              <p className="text-[10.5px] text-indigo-950/80 leading-normal mt-1">
                                Messwerte ohne Angabe der Unsicherheit sind wissenschaftlich unbrauchbar. Im Modul &quot;Messen &amp; Prüfen&quot; berechnen Sie die kombinierte Standardunsicherheit u_c aus Typ-A-Beiträgen (Statistik der Messreihe) und Typ-B-Beiträgen (Geräteauflösung, Kalibrierschein).
                              </p>
                            </div>
                            <div className="bg-white p-1.5 border border-indigo-100 rounded text-[9.5px] font-mono text-indigo-700 mt-2 text-center">
                              GUM: Erweiterte Unsicherheit U = k · u_c mit k = 2 (≈ 95 % Überdeckung)
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {laborStep === 2 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-home-grau/15 pb-2">
                          <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 bg-shiraz text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
                            Schritt 3: Zerstörende mechanische Laborprüfungen (Prüfstandsversuche)
                          </h5>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 font-mono rounded">DIN EN 12390-3 / -13</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          Die Bestimmung der Festigkeiten (Druckfestigkeit, Spaltzug- und Biegezugfestigkeit) erfolgt in hydraulischen Prüfmaschinen unter exakt definierten Belastungsraten und Probenbedingungen.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1.5">
                            <span className="font-extrabold text-slate-900 block text-[11px] uppercase tracking-wide">Prüfungsdurchführung &amp; Fehlerminimierung:</span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-650">
                              <li><strong>Ebenheit sichern:</strong> Die Lastflächen von Würfeln und Zylindern müssen die Ebenheitstoleranz nach DIN EN 12390-1 (0,0006 · d) einhalten, sonst führen Kantenpressungen zu deutlich zu niedrigen Werten. Andernfalls planschleifen oder abgleichen.</li>
                              <li><strong>Lasteinleitungsrate steuern:</strong> Beton verhält sich viskoelastisch. Zu schnelle Lasteinleitung verfälscht die Kennwerte nach oben. Für die Druckprüfung gilt nach DIN EN 12390-3 0,6 ± 0,2 MPa/s.</li>
                              <li><strong>E-Modul-Zyklen:</strong> Der Elastizitätsmodul wird nicht beim Erstbruch, sondern durch wiederholte Be- und Entlastungszyklen (Hystereseeffekte) im elastischen Kernspannungsbereich ermittelt.</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-red-50/50 border border-red-100 rounded-md flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-red-900 block text-[10.5px]">Spannungs-Dehnungs-Visualisierung</span>
                              <p className="text-[10.5px] text-red-950/80 leading-normal mt-1">
                                Im Modul &quot;Virtuelle Versuche&quot; simulieren Sie Spannungs-Dehnungs-Kurven für verschiedene Werkstoffe und Prüfarten. Vergleichen Sie sprödes Versagen (Beton, Glas) mit zähelastischem Fließverhalten (B500B Betonstahl).
                              </p>
                            </div>
                            <div className="bg-white p-1.5 border border-red-100 rounded text-[9.5px] font-mono text-red-700 mt-2 text-center">
                              Bruchspannung: σ_B = F_max / A_0 [MPa]
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {laborStep === 3 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-home-grau/15 pb-2">
                          <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 bg-shiraz text-white text-xs font-bold rounded-full flex items-center justify-center">4</span>
                            Schritt 4: Materialanalytik &amp; Chemophysikalische Gefügediagnose (Analytik &amp; Diagnostik)
                          </h5>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 font-mono rounded">Methodenspektrum</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          Makroskopisches Materialverhalten (Tragfähigkeit, Festigkeit) wurzelt in der Nano- und Mikrostruktur. Weisen Sie schädliche Reaktionsphasen, Hydratation und Chemikalien zerstörungsfrei oder mikroskopisch nach.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1.5">
                            <span className="font-extrabold text-slate-900 block text-[11px] uppercase tracking-wide">Analysen-Entscheidungsmatrix:</span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-650">
                              <li><strong>XRD &amp; FTIR (Mineralogie / Molekülbindungen):</strong> XRD weist an Pulverproben kristalline Treibphasen (Ettringit, Thaumasit) nach; FTIR identifiziert organische Polymeradditive.</li>
                              <li><strong>TGA (Thermogravimetrie):</strong> Bestimmt den Portlanditgehalt Ca(OH)₂ (Wasserabgabe bei ca. 400–500&nbsp;&deg;C) und den Calcitgehalt (CO₂-Abgabe bei ca. 600–800&nbsp;&deg;C).</li>
                              <li><strong>RFA &amp; LIPS (Elemente):</strong> RFA liefert makroskopische Elementoxide, während LIBS (laserbasiert, auch mobil) ortsaufgelöste Tiefenprofile (z. B. Chlorid an Bohrkernen aus Tunnelsockeln) liefert.</li>
                              <li><strong>GC-MS (organische Schadstoffe):</strong> Standardverfahren für Holzschutzmittel (PCP/Lindan), Teerbestandteile (PAK) oder Flammschutzmittel.</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-md flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-emerald-950 block text-[10.5px]">Interaktive Diagnostik-Schnittstelle</span>
                              <p className="text-[10.5px] text-emerald-800 leading-normal mt-1">
                                Nutzen Sie das Modul &quot;Analytik &amp; Diagnostik&quot;, um XRD-Beugung oder REM/EDX-Punktsonden live zu bedienen und Minerale durch reale physikochemische Kriterien zuzuordnen.
                              </p>
                            </div>
                            <div className="bg-white p-1.5 border border-emerald-100 rounded text-[9.5px] font-mono text-emerald-700 mt-2 text-center">
                              Chloridgrenze: ≤ 0,40% (Stahlbeton); ≤ 0,20% (Spannbeton)
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {laborStep === 4 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-home-grau/15 pb-2">
                          <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 bg-shiraz text-white text-xs font-bold rounded-full flex items-center justify-center">5</span>
                            Schritt 5: Statistische Absicherung &amp; Konformitätsnachweis (Statistik-Untermodule)
                          </h5>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 font-mono rounded">DIN EN 206 / DIN EN 1990 / ISO 12491</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          Keine Einzelfestigkeit entscheidet allein über die Freigabe eines Bauwerks oder einer Betoncharge. Prüfstreuungen und mögliche Ausreißer werden statistisch bewertet und – nur mit technischer Begründung – ausgeschlossen.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1.5">
                            <span className="font-extrabold text-slate-900 block text-[11px] uppercase tracking-wide">Statistisches Handwerkszeug für Konstrukteure:</span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-650">
                              <li><strong>Ausreißertest nach Grubbs:</strong> Zeigt, ob ein extremer Einzelwert statistisch auffällig ist; ob er ein Prüffehler ist (z. B. Hohlraum im Würfel), muss technisch geklärt werden.</li>
                              <li><strong>Das 5%-Quantil (f_ck):</strong> Festigkeit, die mit 95 % Wahrscheinlichkeit überschritten wird: f_ck = f_m − 1,645 · σ bei bekannter Streuung; bei aus der Stichprobe geschätztem s mit k_n nach DIN EN 1990, Anhang D.</li>
                              <li><strong>Konformität nach EN 206:</strong> Regelt die Konformität der Produktion (stetige Herstellung: f_cm ≥ f_ck + 1,48 · σ und f_ci ≥ f_ck − 4 N/mm²).</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-md flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-purple-950 block text-[10.5px]">Statistik &amp; Festbeton-Module</span>
                              <p className="text-[10.5px] text-purple-800 leading-normal mt-1">
                                Nutzen Sie die Module &quot;Statistik&quot; und &quot;Festbeton (Statistik)&quot;, um Stichproben zu erzeugen, Histogramme mit der Normalverteilung zu vergleichen und Konformitätskriterien nachzuvollziehen.
                              </p>
                            </div>
                            <div className="bg-white p-1.5 border border-purple-100 rounded text-[9.5px] font-mono text-purple-700 mt-2 text-center">
                              Statistik-Ziel: Ausschaltquoten ≤ 5%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {data.basicsCards.map((bc, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-home-grau/20 rounded-xl space-y-2">
                    <h4 className="font-bold text-sm text-text-main">{bc.title}</h4>
                    <p className="text-xs text-text-main/70 leading-relaxed">
                      {bc.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* DIDACTIC PRINCIPLES */}
              {data.didacticCards && data.didacticCards.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-home-grau/15">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/60 flex items-center gap-1.5">
                    <CheckCircle className="text-emerald-600 w-4 h-4" /> Didaktische Leitgedanken &amp; Schlüsselkonzepte
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.didacticCards.map((dc, idx) => (
                      <div key={idx} className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Leitlinie {idx + 1}</span>
                        <h5 className="font-bold text-xs text-text-main">{dc.title}</h5>
                        <p className="text-[11px] text-text-main/75 leading-relaxed">{dc.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TARGET AUDIENCE SECTIONS */}
              {(data.appStudents || data.appProfessionals) && (
                <div className="space-y-3 pt-4 border-t border-home-grau/15">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/60 flex items-center gap-1.5">
                    <GraduationCap className="text-indigo-600 w-4 h-4" /> Zielgruppen &amp; Praxis-Eignung
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.appStudents && (
                      <div className="p-4 bg-indigo-50/35 border border-indigo-100/60 rounded-xl space-y-1.5">
                        <h5 className="font-bold text-xs text-indigo-900 flex items-center gap-1">
                          Für Studierende &amp; Lehre
                        </h5>
                        <p className="text-[11px] text-indigo-950/80 leading-relaxed">
                          {data.appStudents}
                        </p>
                      </div>
                    )}
                    {data.appProfessionals && (
                      <div className="p-4 bg-slate-50 border border-home-grau/25 rounded-xl space-y-1.5">
                        <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1">
                          Für Planer &amp; Bauingenieure
                        </h5>
                        <p className="text-[11px] text-slate-800 leading-relaxed">
                          {data.appProfessionals}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'ueberblick' && (
            <ModuleOverviewView groupKey={normalizedGroup} />
          )}

          {activeSection === 'inhalte' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <BookOpen className="text-shiraz w-5 h-5" />
                  Gliederung der Lehrthemen &amp; Inhalte
                </h3>
                <p className="text-sm text-text-main/80">
                  Die Strukturierung dieses Fachbereichs deckt die folgenden relevanten mathematischen, normativen oder physikalisch-chemischen Ausprägungen ab:
                </p>
              </div>

              {/* ITERATING SUBMODULE DESCRIPTIONS */}
              {/* No scrollbars here, using natural high-contrast grid so it page-scrolls safely */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.submodules.map((m, idx) => {
                  const SubIcon = m.icon;
                  return (
                    <div key={idx} className="p-4 bg-white border border-home-grau/25 rounded-xl space-y-3 hover:shadow-md transition-all flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 border-b border-home-grau/15 pb-2 mb-1.5">
                          <SubIcon size={16} className="text-shiraz shrink-0" />
                          <h4 className="font-bold text-sm text-text-main line-clamp-1">{m.title}</h4>
                        </div>
                        <p className="text-[11px] text-text-main/80 leading-relaxed">
                          <strong className="text-text-main font-semibold">Zweck:</strong> {m.purpose}
                        </p>
                        {m.standards && (
                          <div className="text-[10px] text-indigo-700 bg-indigo-50/50 border border-indigo-100/50 px-2.5 py-1 rounded w-fit font-medium">
                            <span className="font-semibold">Regelwerk:</span> {m.standards}
                          </div>
                        )}
                        {m.useCase && (
                          <div className="text-[10px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/50 leading-relaxed transition-all">
                            <strong className="font-semibold text-slate-700 block mb-0.5">Praxis-Einsatz:</strong>
                            {m.useCase}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Standardisierter Druck-Fußzeilen-Bereich */}
              <div className="hidden print-footer">
                <span className="font-bold">Quelle: BaustoffBoard (TH Augsburg)</span>
                <span className="font-semibold">Version: 2.11.0</span>
                <span>Gedruckt am: {new Date().toLocaleString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })} Uhr</span>
              </div>

            </div>
          )}

          {activeSection === 'weiterfuehrend' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <Compass className="text-shiraz w-5 h-5" />
                  Umfangreiche wissenschaftliche Ressourcen &amp; Fachpublikationen
                </h3>
                <p className="text-sm text-text-main/80 leading-relaxed">
                  Dieses Fachmodul greift auf anerkannte, unabhängige Quellen zurück. Nachfolgend finden Sie verifizierte Portale, wissenschaftliche Fachliteratur, referenzierte Aufsätze sowie akademische Dissertationen der Baustoffwissenschaften.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* WEBSITES */}
                <div className="bg-slate-50/50 rounded-xl p-5 border border-home-grau/25 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
                      <Globe className="text-rose-600 w-4 h-4 shrink-0" />
                      Unabhängige Verbände &amp; Fachportale
                    </h4>
                    <p className="text-xs text-text-main/70 leading-relaxed pt-1 mb-3">
                      Direkt zugängliche, neutrale Fachinhalte und Schriftenreihen für Lehre und Ingenieurpraxis.
                    </p>
                    <ul className="space-y-2.5">
                      {resources.websites.map((web, idx) => (
                        <li key={idx} className="text-xs">
                          {web.url ? (
                            <a href={web.url} target="_blank" rel="noopener noreferrer" className="font-bold text-shiraz hover:underline flex items-center gap-1">
                              {web.name} <span className="text-[10px]">↗</span>
                            </a>
                          ) : (
                            <span className="font-bold text-text-main flex items-center gap-1">
                              {web.name}
                            </span>
                          )}
                          <span className="text-text-main/70 block mt-0.5">{web.desc}</span>
                        </li>
                      ))}
                      {resources.websites.length === 0 && (
                        <li className="text-xs text-text-main/50 italic">Keine Fachportale direkt gelistet.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* TEXTBOOKS */}
                <div className="bg-slate-50/50 rounded-xl p-5 border border-home-grau/25 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
                      <BookOpen className="text-indigo-600 w-4 h-4 shrink-0" />
                      Wissenschaftliche Monografien &amp; Lehrbücher
                    </h4>
                    <p className="text-xs text-text-main/70 leading-relaxed pt-1 mb-3">
                      In Bibliotheken etablierte Standardwerke zur vertiefenden wissenschaftlichen Einarbeitung.
                    </p>
                    <ul className="space-y-3 text-xs leading-relaxed text-text-main/80">
                      {resources.books.map((book, idx) => (
                        <li key={idx}>
                          <strong>{book.title}</strong>
                          <span className="block text-[11px] text-text-main/60 mt-0.5">{book.desc}</span>
                        </li>
                      ))}
                      {resources.books.length === 0 && (
                        <li className="text-xs text-text-main/50 italic">Keine Lehrbücher gelistet.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* SCIENTIFIC PUBLICATIONS */}
                <div className="bg-slate-50/50 rounded-xl p-5 border border-home-grau/25 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
                      <FileText className="text-emerald-600 w-4 h-4 shrink-0" />
                      Wissenschaftliche Fachaufsätze (Peer-Reviewed)
                    </h4>
                    <p className="text-xs text-text-main/70 leading-relaxed pt-1 mb-3">
                      Internationale wissenschaftliche Publikationen in namhaften Forschungsjournals.
                    </p>
                    <ul className="space-y-3 text-xs">
                      {resources.publications.map((pub, idx) => (
                        <li key={idx}>
                          <span className="font-bold text-emerald-800 block">{pub.journal}</span>
                          <span className="text-[11px] leading-relaxed text-text-main/70 mt-0.5">&quot;{pub.title}&quot; {pub.desc && `— ${pub.desc}`}</span>
                        </li>
                      ))}
                      {resources.publications.length === 0 && (
                        <li className="text-xs text-text-main/50 italic">Keine Publikationsarbeiten aufgezeichnet.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* DISSERTATIONS */}
                <div className="bg-slate-50/50 rounded-xl p-5 border border-home-grau/25 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
                      <GraduationCap className="text-amber-600 w-4 h-4 shrink-0" />
                      Dissertationen &amp; Forschungsberichte
                    </h4>
                    <p className="text-xs text-text-main/70 leading-relaxed pt-1 mb-3">
                      Über deutsche Universitätsbibliotheken offen zugängliche Promotionsschriften und Berichte.
                    </p>
                    <ul className="space-y-3 text-xs leading-relaxed text-text-main/80">
                      {resources.dissertations.map((diss, idx) => (
                        <li key={idx}>
                          <strong>{diss.title}</strong>
                          <span className="block text-[11px] text-text-main/60 mt-0.5">{diss.desc}</span>
                        </li>
                      ))}
                      {resources.dissertations.length === 0 && (
                        <li className="text-xs text-text-main/50 italic">Keine Dissertationen gelistet.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'klassifizierung' && normalizedGroup === 'baustoffe' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* WIKIPEDIA BAUSTOFF-RECHERCHE UND KLASSIFIZIERUNG */}
              <div className="bg-slate-50 border border-slate-300/80 p-6 rounded-xl text-left">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="text-shiraz" size={22} />
                  <h3 className="text-lg font-bold text-slate-800">Baustoff-Klassifizierung (Wikipedia-Recherche)</h3>
                </div>
                <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                  Basierend auf der Wikipedia-Enzyklopädie für <strong>Baustoffe</strong> haben wir alle dort klassifizierten Materialarten analysiert und im BaustoffBoard zwecks interaktiver Lehre integriert. Klicken Sie auf einen Baustoff, um direkt in das entsprechende Fachbereichsmodul zu springen:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Kolonne 1: Anorganische Baustoffe */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                      1. Anorganische Baustoffe
                    </h4>
                    
                    {/* Mineralisch */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-xs font-bold text-slate-800 block mb-2">A. Mineralische Baustoffe & Bindemittel</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: "Natursteine", tab: "gesteine" },
                          { name: "Lehm & Tone", tab: "lehm" },
                          { name: "Ziegel & Klinker", tab: "mauerwerk" },
                          { name: "KS / Porenbeton", tab: "mauerwerk" },
                          { name: "Zement & Kalk", tab: "bindemittel" },
                          { name: "Gips & Anhydrit", tab: "gips" },
                          { name: "Mörtel & Putze", tab: "putzemoertel" },
                          { name: "Betonprodukte", tab: "betonpraxis" },
                          { name: "Flachglas & ESG", tab: "glas" }
                        ].map((m) => (
                          <button
                            key={m.name}
                            onClick={() => setActiveTab(m.tab as any)}
                            className="text-[11px] bg-slate-100 hover:bg-shiraz/10 border border-slate-250 hover:border-shiraz/40 text-slate-700 hover:text-shiraz py-1 px-2 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap"
                          >
                            {m.name} ✓
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Metallisch */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-xs font-bold text-slate-800 block mb-2">B. Metallische Baustoffe</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: "Baustahl", tab: "stahl" },
                          { name: "Bewehrungsstahl", tab: "korrosion" },
                          { name: "Gusseisen", tab: "metalle" },
                          { name: "Aluminium", tab: "metalle" },
                          { name: "Zink & Kupfer", tab: "metalle" },
                          { name: "Blei & Titan", tab: "metalle" }
                        ].map((m) => (
                          <button
                            key={m.name}
                            onClick={() => setActiveTab(m.tab as any)}
                            className="text-[11px] bg-slate-100 hover:bg-shiraz/10 border border-slate-250 hover:border-shiraz/40 text-slate-700 hover:text-shiraz py-1 px-2 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap"
                          >
                            {m.name} ✓
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Kolonne 2: Organische, Verbundstoffe & Biologisch-Lebendig */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                      2. Organische, Verbundwerkstoffe & Myzel
                    </h4>

                    {/* Organische */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-xs font-bold text-slate-800 block mb-2">A. Organische Baustoffe</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: "Bauschnittholz", tab: "holz" },
                          { name: "BSH & CLT Werkstoffe", tab: "holzwerkstoffe" },
                          { name: "Bitumen & Asphalt", tab: "asphalt" },
                          { name: "Duro- & Thermoplaste", tab: "kunststoffe" },
                          { name: "Stroh & Hanf dämmung", tab: "daemmstoffe" },
                          { name: "Kork & Naturfasern", tab: "weitere_organik" }
                        ].map((m) => (
                          <button
                            key={m.name}
                            onClick={() => setActiveTab(m.tab as any)}
                            className="text-[11px] bg-slate-100 hover:bg-shiraz/10 border border-slate-250 hover:border-shiraz/40 text-slate-700 hover:text-shiraz py-1 px-2 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap"
                          >
                            {m.name} ✓
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Verbundwerkstoffe */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-xs font-bold text-slate-800 block mb-2">B. Verbundwerkstoffe (Composites)</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: "Stahlbeton", tab: "labor" },
                          { name: "Carbonbeton", tab: "carbonbeton" },
                          { name: "Faserverbund (FVK)", tab: "faserverbund" },
                          { name: "Spannbeton", tab: "spannbeton" },
                          { name: "Gipskartonplatten", tab: "bp_trockenbau" }
                        ].map((m) => (
                          <button
                            key={m.name}
                            onClick={() => setActiveTab(m.tab as any)}
                            className="text-[11px] bg-slate-100 hover:bg-shiraz/10 border border-slate-250 hover:border-shiraz/40 text-slate-700 hover:text-shiraz py-1 px-2 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap"
                          >
                            {m.name} ✓
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Living / Innovativ */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-xs font-bold text-slate-800 block mb-2">C. „Lebende“ &amp; Bio-Baustoffe</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: "Weidenrute Baubotanik", tab: "weitere_organik" },
                          { name: "Pilzmyzel Dämmplatten", tab: "weitere_organik" },
                          { name: "Bakterieller Bio-Beton", tab: "innovative_werkstoffe" }
                        ].map((m) => (
                          <button
                            key={m.name}
                            onClick={() => setActiveTab(m.tab as any)}
                            className="text-[11px] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 py-1 px-2 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap"
                          >
                            {m.name} ✓
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'historie' && (
            <div className="animate-in fade-in duration-300">
              {historyData ? (
                <ModuleHistoryView history={historyData} />
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-home-grau/30 text-center text-sm text-text-main/70">
                  Keine historische Chronik für diesen Bereich hinterlegt.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ModuleFooter 
        wikipedia={data.wikipedia}
        literatur={data.literatur}
        regelwerke={data.regelwerke}
        formeln={data.formeln}
      />
    </div>
  );
}
