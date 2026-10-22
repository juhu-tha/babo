import React from 'react';
import { 
  BookOpen, 
  Calculator, 
  Lightbulb, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Database, 
  Check 
} from 'lucide-react';
import { InlineMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

export default function Anleitung() {
  return (
    <div className="flex flex-col gap-8 w-full mt-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-8">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 border-b border-home-grau/20 pb-6">
          <div className="w-16 h-16 bg-shiraz/10 rounded-2xl flex items-center justify-center text-shiraz shrink-0">
            <BookOpen size={32} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-main">Anleitung &amp; Konzept</h2>
            <p className="text-base sm:text-lg text-text-main/70 mt-1">
              Kompakte, aktuelle Informationsquelle und interaktive Anwendung normgerechter Berechnungen
            </p>
          </div>
        </div>

        {/* INTRO-BOX: DIE ZWEI LEITMÖGLICHKEITEN DES BAUSTOFFBOARDS */}
        <div className="bg-shiraz/5 border border-shiraz/20 p-6 rounded-xl text-left w-full space-y-3">
          <div className="flex items-start gap-3.5">
            <Lightbulb className="text-shiraz shrink-0 mt-1" size={26} />
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-shiraz mb-1.5">
                Das Leitkonzept: Fundierte Wissensbasis &amp; reaktive Ingenieurberechnungen
              </h3>
              <p className="text-text-main/80 leading-relaxed text-sm">
                Das <strong>BaustoffBoard</strong> vereint zwei zentrale Aufgabenbereiche für Studium, Labor, Gutachterwesen und Tragwerksplanung: 
                Es fungiert als <strong>kompakte, verlässliche und stets aktuelle Informationsquelle</strong> zu allen baustoffkundlichen und bauchemischen Fragestellungen 
                (unter strikter Einhaltung der aktuellen Normengeneration wie DIN 1045-2:2023-08, DIN EN 197-1/5, Eurocode 2) und bietet gleichzeitig die 
                <strong> unmittelbare interaktive Anwendung dimensionsreiner ingenieurtechnischer Berechnungen</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* DIE 2 SÄULEN DER PLATTFORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Säule 1 */}
          <div className="p-6 rounded-2xl border border-home-grau/30 bg-off-white flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-shiraz font-bold text-base">
                <Database size={20} />
                <span>1. Kompakte &amp; aktuelle Informationsquelle</span>
              </div>
              <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed">
                Schluss mit unübersichtlichen Normenstapeln und veralteten Näherungswerten. Das BaustoffBoard fasst alle relevanten werkstofflichen Kennwerte 
                strukturiert und forensisch verifiziert zusammen:
              </p>
              <ul className="space-y-2 text-xs text-text-main/75 pl-1">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-shiraz shrink-0 mt-0.5" />
                  <span><strong>Neueste Normengeneration:</strong> Expositionsklassen nach DIN 1045-2:2023-08, Zementarten inkl. CEM II/C-M &amp; CEM VI nach DIN EN 197-5, Eurocode 2 &amp; Nachbehandlung DIN EN 13670.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-shiraz shrink-0 mt-0.5" />
                  <span><strong>Ganzheitliche Werkstoffkunde:</strong> Von metallischen Legierungen, Holzarten und Mauerwerksziegeln über Bitumen/Asphalt bis hin zu Polymeren und Rezyklatbaustoffen.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-shiraz shrink-0 mt-0.5" />
                  <span><strong>Bauchemische Präzision:</strong> Kristalline Phasenumwandlungen, Bogue-Klinkerzusammensetzung, Hydratationswärmen, pH-Werte und Porenraumstrukturen mit exakten Reaktionsgleichungen.</span>
                </li>
              </ul>
            </div>
            <div className="p-3 bg-white rounded-xl border border-home-grau/20 text-[11px] text-text-main/70">
              <strong>Einsatz:</strong> Schnelles Nachschlagen von Grenzwerten, Zementanforderungen, Feuchteklassen und Normenzitaten während Entwurf, Planung und Vorlesung.
            </div>
          </div>

          {/* Säule 2 */}
          <div className="p-6 rounded-2xl border border-home-grau/30 bg-off-white flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
                <Calculator size={20} />
                <span>2. Interaktive Anwendung von Berechnungen</span>
              </div>
              <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed">
                Keine statischen PDF-Formulare, sondern live reagierende Rechenkerne. Verändern Sie Bauteilabmessungen, Umweltparameter oder Lasten und verfolgen Sie die Bemessungsergebnisse in Echtzeit:
              </p>
              <ul className="space-y-2 text-xs text-text-main/75 pl-1">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Expositionsklassen-Hüllwerte:</strong> Mehrfachselektion von Umweltbeanspruchungen ermittelt automatisch die strengsten Grenzwerte für <InlineMath math="(w/z)_{\text{eq}}" />, <InlineMath math="f_{ck}" />, Mindestzement und Betondeckung <InlineMath math="c_{\text{nom}}" />.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Betonkennwerte nach EC2:</strong> Zeitabhängige Kriechbeiwerte <InlineMath math="\varphi(t,t_0)" />, Trocknungs- und autogenes Schwinden <InlineMath math="\varepsilon_{cs}" /> sowie Spannungs-Dehnungs-Linien nach DIN EN 1992-1-1.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Labor- &amp; Bauphysiksimulation:</strong> Mischungsberechnung nach Stoffraumrechnung, Bogue-Klinkermineralien, U-Wert-Wandaufbauten und Schadstoffabbau.</span>
                </li>
              </ul>
            </div>
            <div className="p-3 bg-white rounded-xl border border-home-grau/20 text-[11px] text-text-main/70">
              <strong>Zahlenformat:</strong> Alle Rechner nutzen strikte deutsche Formatierung (Tausendertrennung mit Punkt, Dezimalkomma via <code>formatDeZahl</code>).
            </div>
          </div>

        </div>

        {/* 3-SCHRITTE-WORKFLOW */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
            <Activity className="text-shiraz" size={20} />
            Der 3-Schritte-Workflow im Studien- und Planungsalltag
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-home-grau/25 bg-white shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-shiraz/10 text-shiraz font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-bold text-sm text-text-main">Recherchieren &amp; Erkunden</h4>
              <p className="text-xs text-text-main/75 leading-relaxed">
                Wählen Sie im Menü das passende Fachmodul. Verschaffen Sie sich im <strong>Steckbrief</strong> und im <strong>Klassenkatalog</strong> einen kompakten Überblick über Normen, Werkstoffkennwerte und Einsatzgrenzen.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-home-grau/25 bg-white shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-700/10 text-emerald-800 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-bold text-sm text-text-main">Interaktiv Berechnen</h4>
              <p className="text-xs text-text-main/75 leading-relaxed">
                Öffnen Sie den interaktiven Rechner. Passen Sie Umwelteinflüsse, Geometrien oder Rezepturen an. Die dynamischen Vektorskizzen und Diagramme visualisieren das Trag- und Verformungsverhalten sofort.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-home-grau/25 bg-white shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-700/10 text-cyan-800 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-bold text-sm text-text-main">Verifizieren &amp; Anwenden</h4>
              <p className="text-xs text-text-main/75 leading-relaxed">
                Nutzen Sie die Formelsammlung im Footer für Ihre statische Berechnung oder Studienarbeit. Überprüfen Sie Ihr Fachwissen in den interaktiven Wissenstests mit begründetem Richtig-/Falsch-Feedback.
              </p>
            </div>
          </div>
        </div>

        {/* METHODISCHE TRENNUNG: BAUSTOFFE VS. BAUPRODUKTE */}
        <div className="bg-slate-50/50 border border-slate-200/80 p-6 rounded-xl text-left w-full space-y-4">
          <div className="flex items-start gap-4">
            <Layers className="text-slate-500 shrink-0 mt-1" size={24} />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 font-sans">
                Methodische Trennung: Baustoffe (Stoffebene) vs. Bauprodukte (Erzeugnisebene)
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Um Informationsdopplungen zu vermeiden und den roten Faden des Bauingenieurstudiums zu wahren, trennt das BaustoffBoard systematisch zwischen 
                der <strong>Stoffebene (Roh- und Werkstoffkunde)</strong> und der <strong>Erzeugnisebene (Bauprodukte &amp; Bauteile)</strong>:
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
                  Untersucht die atomare, kristalline, metallurgische und chemische Zusammensetzung des Werkstoffs losgelöst vom Bauteil:
                </p>
                <ul className="space-y-2 text-[11px] text-slate-600 pl-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><strong>Hydratation &amp; Phasen:</strong> Bogue-Berechnung von Alit (<InlineMath math="C_3S" />), Belit (<InlineMath math="C_2S" />), C-S-H-Gefügewachstum und Ettringit.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><strong>Anisotropie:</strong> Richtungsabhängige Quell-/Schwindmaße im 3D-Holzkörper, Faserorientierung bei Faserbeton und CFK.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><strong>Werkstoffmechanik:</strong> Spannungs-Dehnungs-Gesetze, Bruchmechanik, E-Modul und Kriechen.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 italic">
                Cluster: Baustoffe &bull; Betontechnologie &bull; Mechanik &bull; Bauchemie
              </div>
            </div>

            {/* Rechte Spalte: Bauprodukte */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 text-[9.5px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-full mb-3 uppercase tracking-wider">
                  Bauprodukt-Ebene (Konstruktion &amp; Recht)
                </span>
                <p className="text-xs text-slate-700 leading-relaxed mb-4">
                  Fokussiert das in Verkehr gebrachte, genormte Erzeugnis, den Verwendungsnachweis und die konstruktive Leistungsfähigkeit im Bauwerk:
                </p>
                <ul className="space-y-2 text-[11px] text-slate-600 pl-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><strong>Bauproduktenverordnung (BauPVO):</strong> CE-Kennzeichnung, Leistungserklärung (DoP), Ü-Zeichen, MVV TB und AVCP-Konformitätssysteme.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><strong>Bauteilgeometrie &amp; Sorten:</strong> CLT-Brettsperrholz, Fertigteilträger, Mauerziegel, Walzasphalt-Deckschichten nach RStO 12/24.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><strong>Funktionale Einheit &amp; Ökobilanz:</strong> Vergleichbare U-Werte, Tragfähigkeiten und EPD-Umweltkennwerte nach EN 15804.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 italic">
                Cluster: Bauprodukte &bull; Massivbau &bull; Holzbau &bull; Bauphysik &bull; Nachhaltigkeit
              </div>
            </div>

          </div>
        </div>

        {/* QUALITÄTSSTANDARD D1-D6 */}
        <div className="bg-slate-50/60 p-6 rounded-2xl border border-slate-200/80 flex flex-col gap-4 text-left">
          <div className="flex items-center gap-3 pb-2 border-b border-home-grau/20">
            <div className="p-2 bg-shiraz/10 text-shiraz rounded-xl">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-text-main">
                Die 6 Qualitätsdimensionen aller Fachmodule (D1–D6)
              </h3>
              <p className="text-xs text-text-main/70">
                Verbindlicher Standard für Richtigkeit, Normenkonformität und didaktische Tiefe
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
              <span className="font-bold text-xs text-shiraz block">D1 – Richtigkeit &amp; Normen</span>
              <p className="text-[11px] text-text-main/75 leading-relaxed">
                Strikte Normengeneration (DIN 1045-2:2023, EC2, DIN EN 197). Vollständige Dimensionsreinheit und verifizierte Quellennachweise.
              </p>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
              <span className="font-bold text-xs text-shiraz block">D2 – Didaktik &amp; 4-Stufen-Lehrpfad</span>
              <p className="text-[11px] text-text-main/75 leading-relaxed">
                Logische Abfolge von theoretischen Grundlagen über Laborversuche und reaktive Berechnungen bis zum Wissenstest mit Feedback.
              </p>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
              <span className="font-bold text-xs text-shiraz block">D3 – Thematische Vollständigkeit</span>
              <p className="text-[11px] text-text-main/75 leading-relaxed">
                Keine fachlichen Lücken oder Auslassungen: Jedes Modul behandelt sein Stoffgebiet in sich geschlossen und umfassend.
              </p>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
              <span className="font-bold text-xs text-shiraz block">D4 – Praxisrelevanz &amp; Forensik</span>
              <p className="text-[11px] text-text-main/75 leading-relaxed">
                Direkte Handlungskompetenz für Baustelle, Prüflabor, Tragwerksplanung und Gutachterwesen inkl. Schadensprävention.
              </p>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
              <span className="font-bold text-xs text-shiraz block">D5 – Konsistenz &amp; Vernetzung</span>
              <p className="text-[11px] text-text-main/75 leading-relaxed">
                Einheitliche Nomenklatur, durchgängiges Shiraz-Farbkonzept, Querverlinkungen und Vermeidung von redundanten Textdopplungen.
              </p>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
              <span className="font-bold text-xs text-shiraz block">D6 – Interaktivität &amp; Verifikation</span>
              <p className="text-[11px] text-text-main/75 leading-relaxed">
                Dynamische Rechner mit deutscher Zahlenformatierung (<code>formatDeZahl</code>), KaTeX-Formeln und Schutz vor Fehleingaben.
              </p>
            </div>
          </div>
        </div>

        {/* PRAXISTIPPS FÜR DIE NUTZUNG */}
        <div className="p-5 bg-off-white rounded-xl border border-home-grau/25 space-y-3 text-left">
          <h4 className="font-bold text-sm text-text-main">Effektive Nutzung im Studien- und Planungsalltag:</h4>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-text-main/80 leading-relaxed">
            <li><strong>Parameter an Grenzen testen:</strong> Variieren Sie Eingaben bis zu den Grenzwerten (z. B. minimaler Zementgehalt oder maximaler w/z-Wert), um bauphysikalische Reaktionen und normative Warnhinweise direkt zu erkennen.</li>
            <li><strong>PDF-Export:</strong> Nutzen Sie die Export-Funktion, um berechnete Kennwerte, Diagramme und Prüfberichte für Übungsblätter oder statische Vorbemessungen abzuspeichern.</li>
            <li><strong>Vektorskizzen nutzen:</strong> Die interaktiven Querschnitte (wie bei den Expositionsklassen oder Betonkennwerten) passen sich live an gewählte Parameter an und veranschaulichen Maßketten direkt am Bauteil.</li>
          </ul>
        </div>

      </div>

      <ModuleFooter
        wikipedia={[
          { title: 'Bauingenieurwesen', url: 'https://de.wikipedia.org/wiki/Bauingenieurwesen' },
          { title: 'Baustoffkunde', url: 'https://de.wikipedia.org/wiki/Baustoff' },
          { title: 'Eurocode', url: 'https://de.wikipedia.org/wiki/Eurocode' }
        ]}
        literatur={[
          'Wendehorst Baustoffkunde: Grundlagen, Baustoffe und Werkstoffprüfung (37. Auflage, Springer Vieweg)',
          'Heidelberg Materials / InformationsZentrum Beton (IZB): Betontechnische Daten (Ausgabe 2022 / Folgeauflagen)',
          'Albert, A. (Hrsg.): Schneider – Bautabellen für Ingenieure (26. Auflage, Reguvis 2024)',
          'Stark, J.; Wicht, B.: Zement und Schnellzemente - Chemie, Hydratation und Anwendung (Springer Vieweg)'
        ]}
        regelwerke={[
          { title: 'DIN 1045-2:2023-08 (Tragwerke aus Beton, Stahlbeton und Spannbeton - Teil 2: Beton - Anwendungsregeln zu DIN EN 206)', url: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2' },
          { title: 'DIN EN 197-1:2011-11 (Zement - Teil 1: Zusammensetzung, Anforderungen und Konformitätskriterien)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+197-1' },
          { title: 'DIN EN 1992-1-1:2011-01 / NA:2013-04 (Eurocode 2: Bemessung und Konstruktion von Stahlbetontragwerken)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1992-1-1' }
        ]}
        formeln={[
          {
            formel: 'c_{\\text{nom}} = c_{\\min} + \\Delta c_{\\text{dev}}',
            erklaerung: 'Nennmaß der Betondeckung nach DIN EN 1992-1-1: Sicherstellung des dauerhaften Bewehrungsschutzes (c_min,dur) zzgl. Vorhaltemaß.',
            quelle: 'DIN EN 1992-1-1 / NA'
          },
          {
            formel: '\\left(\\frac{w}{c}\\right)_{\\text{eq}} = \\frac{w}{c + k_F \\cdot f + k_S \\cdot s}',
            erklaerung: 'Äquivalenter Wasserzementwert nach DIN EN 206 / DIN 1045-2: Verbindliche Höchstgrenzen zum Schutz vor Karbonatisierung, Frost und chemischem Angriff.',
            quelle: 'DIN 1045-2 Tab. F.2.1/F.2.2'
          }
        ]}
      />
    </div>
  );
}
