import React from 'react';
import { BookOpen, Sliders, LineChart, BrainCircuit, Lightbulb, Info, Compass, Box, TreePine, Scale, Layers, Activity, GraduationCap, CheckCircle2 } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

export default function Anleitung() {
  return (
    <div className="flex flex-col gap-8 w-full mt-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-8">
        
        <div className="flex items-center gap-4 border-b border-home-grau/20 pb-6">
          <div className="w-16 h-16 bg-shiraz/10 rounded-2xl flex items-center justify-center text-shiraz shrink-0">
            <BookOpen size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-text-main">Anleitung &amp; Konzept</h2>
            <p className="text-lg text-text-main/70 mt-1">
              Wie Sie diese Plattform optimal für Ihr Studium nutzen.
            </p>
          </div>
        </div>

        <div className="bg-shiraz/5 border border-shiraz/20 p-6 rounded-xl text-left w-full">
          <div className="flex items-start gap-4">
            <Lightbulb className="text-shiraz shrink-0 mt-1" size={28} />
            <div>
              <h3 className="text-xl font-bold text-shiraz mb-2">Das Kernziel: "Ein Gefühl bekommen"</h3>
              <p className="text-text-main/80 leading-relaxed text-sm">
                Diese Module sind nicht primär als exakte Taschenrechner für die Baupraxis gedacht. 
                Vielmehr ist das Ziel, dass Sie durch das interaktive Verändern von Parametern ein 
                <strong> intuitives Gefühl für die zugrundeliegenden Formeln, physikalischen Zusammenhänge und Größenordnungen der Ergebnisse</strong> entwickelst.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="bg-off-white p-6 rounded-xl border border-home-grau/30 flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 bg-shiraz/10 text-shiraz rounded-full flex items-center justify-center">
              <Sliders size={24} />
            </div>
            <h4 className="font-bold text-text-main">1. Parameter variieren</h4>
            <p className="text-sm text-text-main/70">
              Nutzen Sie die Schieberegler, um Eingabewerte (z. B. Temperatur, w/z-Wert, Zeit) zu verändern. Beobachten Sie, welche Parameter den größten Einfluss haben.
            </p>
          </div>

          <div className="bg-off-white p-6 rounded-xl border border-home-grau/30 flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 bg-shiraz/10 text-shiraz rounded-full flex items-center justify-center">
              <LineChart size={24} />
            </div>
            <h4 className="font-bold text-text-main">2. Zusammenhänge erkennen</h4>
            <p className="text-sm text-text-main/70">
              Die dynamischen Diagramme zeigen Ihnen sofort, ob ein Zusammenhang linear, exponentiell oder logarithmisch ist. Suchen Sie nach Grenzwerten und Extremata.
            </p>
          </div>

          <div className="bg-off-white p-6 rounded-xl border border-home-grau/30 flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 bg-shiraz/10 text-shiraz rounded-full flex items-center justify-center">
              <BrainCircuit size={24} />
            </div>
            <h4 className="font-bold text-text-main">3. Formeln verstehen</h4>
            <p className="text-sm text-text-main/70">
              Am Ende jedes Moduls finden Sie die verwendeten Formeln und Normen. Verknüpfen Sie das visuelle Feedback der Diagramme mit der mathematischen Theorie.
            </p>
          </div>
        </div>

        {/* Methodischer Pfeiler: Baustoffe vs. Bauprodukte */}
        <div className="bg-slate-50/50 border border-slate-200/80 p-6 rounded-xl text-left w-full space-y-4">
          <div className="flex items-start gap-4">
            <Layers className="text-slate-500 shrink-0 mt-1" size={24} />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 font-sans">
                Methodische Trennung: Baustoffkunde vs. Bauprodukte
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Dieses Lernportal trennt systematisch zwischen der <strong>Stoffebene (Baustoffe)</strong> und der <strong>Anwendungsebene (Bauprodukte)</strong>. Dies vermeidet Informationsdoppelungen und sorgt für eine klare didaktische Struktur:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            
            {/* Linke Spalte: Baustoffe */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 text-[9.5px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-full mb-3 uppercase tracking-wider">
                  Baustoff-Ebene (Stoffeigenschaften)
                </span>
                <p className="text-xs text-slate-700 leading-relaxed mb-4">
                  Hier stehen die physikalischen, chemischen, metallurgischen und mikrostrukturellen Eigenschaften des Rohmaterials im Vordergrund. Du lernst das grundlegende Materialverhalten kennen – unabhängig vom finalen Produktformat:
                </p>
                <ul className="space-y-2 text-[11px] text-slate-600 pl-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><strong>Kristallin &amp; Chemisch:</strong> Hydratation von Zement, Gips-/Kalk-Phasenumwandlung, Polymerstrukturen von Kunststoffen.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><strong>Anisotropie &amp; Physik:</strong> Richtungsabhängige Quell- und Schwindkoeffizienten (<InlineMath math="q_r, q_t, q_l" />) bei Feuchteaufbau im 3D-Holzmodell.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><strong>Werkstoffmechanik:</strong> Plastische Gittergleitungen im Stahl, Elastizitätsmoduln, Kriech- und Schwindprozesse des Verbundwerkstoffes Beton.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 italic">
                Module: Holz, Kunststoffe, Metalle/Stahl, Bindemittel, Zementchemie, Bruchmechanik
              </div>
            </div>

            {/* Rechte Spalte: Bauprodukte */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 text-[9.5px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-full mb-3 uppercase tracking-wider">
                  Bauprodukt-Ebene (Konkrete Anwendung)
                </span>
                <p className="text-xs text-slate-700 leading-relaxed mb-4">
                  Hier geht es um die anwendungsfertige Form, standardisierte Bauprodukte, genormte Zulassungen und das Tragverhalten bzw. bauphysikalische Funktion im Gesamtsystem (z.B. Wandaufbau):
                </p>
                <ul className="space-y-2 text-[11px] text-slate-600 pl-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><strong>Handelsübliche Geometrien:</strong> Holzprodukte (KVH mit definierter Trockenfeuchte <InlineMath math="15\% \pm 3\%" />, CLT, BSH), normierte IPE- und HEB-Stahlprofile.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><strong>Tiefbau &amp; Infrastruktur:</strong> Gussasphalt- und Walzasphaltdeckschichten, Drainbeton zur Versickerung, Bohrpfahlbetone für Gründungselemente und Geogitter zur Bodenstabilisierung.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><strong>Funktionale Leistungsfähigkeit:</strong> Konkrete Schichtsysteme (z.B. U-Wert-Wandbemessungen), mechanische Absicherungen (Querkraft- und Biegebemessung, Knickwiderstand).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><strong>Inverkehrbringen &amp; Siegel:</strong> Technische Bewertung nach BauPVO, CE-Kennzeichnung samt DoP, nationale Verwendbarkeitsnachweise (Ü-Zeichen, MVV TB, AVCP-Klassen).</span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 italic">
                Bauprodukt-Module: Holzprodukte, Mauerwerk, Stahlbauprofile, Dämmsysteme, Trockenbau, Putz &amp; Estrich, Asphalt, Dränbeton, Bohrpfahlbeton
              </div>
            </div>

          </div>

          <div className="p-4 bg-slate-100/50 border border-slate-200/80 border-l-4 border-l-slate-400 rounded-r-xl text-[11px] text-slate-700 leading-relaxed">
            <strong>⚠️ Methodischer Grundsatz für Vergleiche:</strong> Wenn Sie Baustoffe oder Bauteile ökologisch (LCA) oder ökonomisch (LCC) vergleichst, beziehen sich diese Vergleiche im Modul immer auf eine <strong>funktionelle Einheit</strong> mit <strong>identischer technischer Leistungsfähigkeit (funktionale Äquivalenz)</strong>. Ein unreflektierter Masse- oder Volumenvergleich von z.B. 1 m³ Brettschichtholz vs. 1 m³ Normalbeton ist unzulässig, da die Wandaufbauten völlig unterschiedliche tragende Dicken und zusätzliche Dämmschichten benötigen, um denselben U-Wert zu realisieren.
          </div>
        </div>

        {/* Didaktischer Leitfaden & Die 6 Prüfdimensionen der Qualitätssicherung */}
        <div className="bg-slate-50/60 p-6 rounded-2xl border border-slate-200/80 flex flex-col gap-5 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl border border-shiraz/20">
              <GraduationCap size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                Didaktischer Leitfaden &amp; Die 6 Prüfdimensionen der Qualitätssicherung
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Jedes Modul der Wissensplattform unterliegt einem verbindlichen 6-dimensionalen Prüfraster zur Sicherung wissenschaftlicher Exzellenz und didaktischer Konsistenz:
              </p>
            </div>
          </div>

          {/* 6 Prüfdimensionen Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl border border-home-grau/20 bg-white flex flex-col gap-1.5 shadow-2xs">
              <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-shiraz"></span>
                1. Richtigkeit &amp; Normenkonformität
              </span>
              <p className="text-xs text-slate-650 leading-relaxed font-normal">
                Sind alle physikochemischen Gleichungen, Bemessungsverfahren, Grenzwerte und Normenbezüge (DIN, EN, ISO, WTA, DAfStb) fachlich einwandfrei und mit der <strong>aktuellsten Ausgabe (inkl. Jahr und Monat)</strong> versehen?
              </p>
            </div>

            <div className="p-4 rounded-xl border border-home-grau/20 bg-white flex flex-col gap-1.5 shadow-2xs">
              <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-shiraz"></span>
                2. Didaktik &amp; Verständlichkeit
              </span>
              <p className="text-xs text-slate-650 leading-relaxed font-normal">
                Ist die Wissensvermittlung curricular logisch aufbereitet, adressatengerecht für Studierende und Fachkräfte strukturiert und durch prägnante Begriffsauszeichnungen und schrittweise Erklärungen gestützt?
              </p>
            </div>

            <div className="p-4 rounded-xl border border-shiraz/40 bg-rose-50/30 flex flex-col gap-1.5 shadow-2xs">
              <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-shiraz"></span>
                3. Vollständigkeit
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                <strong>Ist das Modul in sich thematisch umfassend und vollständig? (dies ist die einzige Bedingung)</strong> Ein Modul erfüllt diesen Qualitätsmaßstab nur dann, wenn das behandelte Fachthema in seiner gesamten thematischen Tiefe und Breite lückenlos, fundiert und ohne inhaltliche Aussparungen eigenständig vermittelt wird.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-home-grau/20 bg-white flex flex-col gap-1.5 shadow-2xs">
              <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-shiraz"></span>
                4. Praxisrelevanz &amp; Handlungskompetenz
              </span>
              <p className="text-xs text-slate-650 leading-relaxed font-normal">
                Vermittelt das Modul handlungsfähiges Baupraxis- und Prüfwissen für Baustelle, Labor, Tragwerksplanung und Gutachterwesen (inkl. Schadensprävention, Fallstudien und realer Praxisbeispiele)?
              </p>
            </div>

            <div className="p-4 rounded-xl border border-shiraz/30 bg-rose-50/20 flex flex-col gap-1.5 shadow-2xs">
              <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-shiraz"></span>
                5. Konsistenz
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                <strong>Ist das Modul in sich logisch aufgebaut? Sind alle notwendigen Informationen zum Verständnis in anderen Modulen vorhanden?</strong> Greifen die Module nahtlos ineinander, existieren klare Querverweise im Material-Lehrpfad und sind alle referenzierten Grundlagen verlässlich vernetzt?
              </p>
            </div>

            <div className="p-4 rounded-xl border border-home-grau/20 bg-white flex flex-col gap-1.5 shadow-2xs">
              <span className="text-xs font-black text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-shiraz"></span>
                6. Interaktivität &amp; Verifikation
              </span>
              <p className="text-xs text-slate-650 leading-relaxed font-normal">
                Bietet das Modul aktive Lernelemente (Simulatoren, Parameterrechner mit normgerechter deutscher Zahlenformatierung: <strong>Tausendertrennung mit Punkt, Nachkommastellen mit Komma</strong>, Selbsttests) zur unmittelbaren messtechnischen Überprüfung?
              </p>
            </div>
          </div>

          {/* 4 Schritte Leitfaden */}
          <div className="pt-3 border-t border-slate-200/60">
            <span className="text-xs font-bold text-slate-800 block mb-2">Didaktische Umsetzung im Studienalltag (4-Stufen-Lehrpfad):</span>
            <ol className="list-decimal list-inside text-xs text-slate-650 space-y-1.5 leading-relaxed">
              <li>
                <strong>Grundlagen &amp; Werkstoffe pflegen:</strong> Nutzen Sie die Kennwerte-Tabellen und Bauchemie-Module, um die thermodynamischen und chemischen Eigenschaften grundlegend zu verstehen.
              </li>
              <li>
                <strong>Virtuelle Experimente ausprobieren:</strong> Im Labor können Sie z. B. den Ausbreitversuch, die Festbetonprüfung und den Sieblinien-Editor interaktiv simulieren.
              </li>
              <li>
                <strong>Rechnergestützte Bauteilbemessung:</strong> Die Module im <em>Massivbau</em> und in der <em>Mechanik</em> führen Sie Schritt für Schritt durch normative Nachweise nach Eurocode 2 und 3.
              </li>
              <li>
                <strong>Lerneffekte überprüfen:</strong> Verwenden Sie zum Abschluss die themenspezifischen Übungsklausuren mit direktem Feedback.
              </li>
            </ol>
          </div>
        </div>

        <div className="mt-2 p-6 bg-home-grau/10 rounded-xl border border-home-grau/20 text-left">
          <h3 className="text-lg font-bold text-text-main mb-3">Tipps für die Nutzung</h3>
          <ul className="list-disc list-inside space-y-2 text-text-main/80 text-sm">
            <li><strong>Extreme testen:</strong> Stellen Sie die Regler bewusst auf die minimalen und maximalen Werte, um das Systemverhalten an den Rändern zu prüfen.</li>
            <li><strong>PDF-Export:</strong> Nutzen Sie den "PDF Export"-Button oben rechts, um sich interessante Parameterkonstellationen oder Diagramme für Ihre Unterlagen abzuspeichern.</li>
            <li><strong>Hintergrundwissen:</strong> Die Info-Icons (<span className="inline-block w-4 h-4 bg-home-grau/30 rounded-full text-center text-[10px] font-bold leading-4 mx-1">i</span>) neben den Parametern liefern Ihnen wertvolle Kontextinformationen zu typischen Wertebereichen.</li>
          </ul>
        </div>

        <div className="bg-shiraz/5 border border-shiraz/20 p-6 rounded-xl text-left w-full">
          <div className="flex items-start gap-4">
            <Info className="text-shiraz shrink-0 mt-1" size={28} />
            <div>
              <h3 className="text-xl font-bold text-shiraz mb-2">Informationen zu speziellen Themen</h3>
              <p className="text-text-main/80 leading-relaxed text-sm">
                Nicht alle Module sind rein interaktiv. Einige Bausteine dienen bewusst der strukturierten Vermittlung von Übersichtswissen. 
                Sie finden hier unter anderem gebündelte Informationen zu speziellen Unterthemen (wie z. B. Typische Bau-Schadstoffe, Zertifizierungssysteme oder historische Kennwerte). Nutzen Sie diese als stark verdichtetes Nachschlagewerk für Ihr Grundlagenwissen.
              </p>
            </div>
          </div>
        </div>

      </div>

      <ModuleFooter
        wikipedia={[
          { title: 'E-Learning', url: 'https://de.wikipedia.org/wiki/E-Learning' },
          { title: 'Bauingenieurwesen', url: 'https://de.wikipedia.org/wiki/Bauingenieurwesen' },
          { title: 'Sensitivitätsanalyse', url: 'https://de.wikipedia.org/wiki/Sensitivit%C3%A4tsanalyse' }
        ]}
        literatur={[
          'Kerres, M. (2018): Mediendidaktik - Konzeption und Entwicklung digitaler Lernangebote (5. Auflage, De Gruyter Oldenbourg)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Albert, A. (Hrsg.): Schneider – Bautabellen für Ingenieure. 26. Aufl., Köln: Reguvis 2024'
        ]}
        regelwerke={[
          { title: 'Hochschulrektorenkonferenz (HRK): Leitlinien für digital gestütztes Lehren und Lernen in den Ingenieurwissenschaften', url: 'https://www.hrk.de/' },
          { title: 'DIN EN ISO 9241-110:2020-10 (Ergonomie der Mensch-System-Interaktion - Teil 110: Interaktionsprinzipien)' },
          { title: 'DIN EN 1990:2021-10 (Eurocode: Grundlagen der Tragwerksplanung)' }
        ]}
        hideFormeln={true}
      />
    </div>
  );
}
