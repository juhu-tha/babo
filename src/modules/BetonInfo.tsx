import React, { useState } from 'react';
import { 
  Info, 
  Layers, 
  Factory, 
  Calculator, 
  Waves, 
  Network, 
  Droplets, 
  Box, 
  ClipboardCheck, 
  BookOpen, 
  HelpCircle,
  FileText,
  UserCheck,
  Compass,
  Globe,
  GraduationCap,
  Search,
  ShieldAlert,
  Activity,
  BarChart3,
  History
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import ModuleHistoryView from '@/src/components/ui/ModuleHistoryView';
import ModuleOverviewView from '@/src/components/ui/ModuleOverviewView';
import { MODULE_HISTORY_DATA } from '@/src/data/moduleHistoryData';

interface SubmoduleCard {
  title: string;
  icon: any;
  purpose: string;
  standards: string;
  useCase: string;
}

export default function BetonInfo() {
  const [activeSection, setActiveSection] = useState<'grundlagen' | 'ueberblick' | 'inhalte' | 'anwendung' | 'weiterfuehrend' | 'historie'>('grundlagen');

  const submodules: SubmoduleCard[] = [
    {
      title: 'Beton A-Z',
      icon: BookOpen,
      purpose: 'Integriertes Nachschlagewerk für Fachbegriffe, Abkürzungen und Definitionen.',
      standards: 'DIN EN 206, Allgemeines Vokabular',
      useCase: 'Schnelles Klären von Begriffsdefinitionen wie "rechnerischer Zementleimgehalt" oder "Mehlkorngehalt".'
    },
    {
      title: 'Grundlagen',
      icon: Layers,
      purpose: 'Tabellarische Übersichten aller normativen Grenzwerte nach DIN EN 206 / DIN 1045-2.',
      standards: 'DIN EN 206, DIN 1045-2',
      useCase: 'Bestimmung der maximal zulässigen w/z-Werte, Mindestdruckfestigkeitsklassen und Mindestzementgehalte für bestimmte Expositionsklassen.'
    },
    {
      title: 'Bindemittel',
      icon: Factory,
      purpose: 'Chemischer Aufbau, Hydratationskinetik und Wirkungsweise von Zementen, latent hydraulischen und pozzolanischen Zusatzstoffen.',
      standards: 'DIN EN 197-1, DIN EN 450-1, DIN EN 13263-1',
      useCase: 'Bewertung der puzzolanischen Reaktion von Silikastaub oder Flugasche und korrekte Anwendung des k-Wert-Konzepts.'
    },
    {
      title: 'Mischungsberechnung',
      icon: Calculator,
      purpose: 'Interaktiver Entwurfs- und Optimierungsrechner für Betonmischungen auf Basis der Stoffraumrechnung (3-Satz).',
      standards: 'Deutsche Bauchemie e.V. Merkblätter, DIN 1045-2',
      useCase: 'Berechnung von Zementbedarf, Wasserverbrauch, Gesteinskörnungssieblinien und Zusatzmittelanteilen.'
    },
    {
      title: 'Herstellung & Einbau',
      icon: Factory,
      purpose: 'Baustellennahes Praxiswissen über die Transportbetonkette, logistische Steuerung, Verdichtungsdauer und das Vermeiden von Fehlstellen.',
      standards: 'DIN EN 206, ZTV-ING',
      useCase: 'Richtige Festlegung der Einbau- und Verdichtungsschritte in Abhängigkeit von Umgebungstemperatur und Bauteilgeometrie.'
    },
    {
      title: 'Frischbeton',
      icon: Waves,
      purpose: 'Prüfverfahren zur Charakterisierung der Frischbetoneigenschaften (Konsistenz, Luftgehalt, Temperatur, Frischbetonrohdichte).',
      standards: 'DIN EN 12350-2 (Setzversuch), DIN EN 12350-5 (Ausbreitversuch)',
      useCase: 'Normgerechte Qualitätskontrolle auf der Baustelle beim Wareneingang zur Einhaltung der Konsistenzklasse.'
    },
    {
      title: 'Hydratation & Folgen',
      icon: Network,
      purpose: 'Visualisierung exothermer Hydratationswärmeentwicklung, Eigenspannungsentstehung (Zwang) und Schwindphasen.',
      standards: 'DAfStb-Richtlinien für massige Bauteile',
      useCase: 'Ermittlung des Rissrisikos infolge von Temperaturgradienten in massigen Fundamenten oder vorgespannten Trägern.'
    },
    {
      title: 'Nachbehandlung',
      icon: Droplets,
      purpose: 'Auswahl der Nachbehandlungsmethoden und Berechnung der Mindestnachbehandlungsdauer basierend auf Festigkeitsentwicklung und Bauteiloberfläche.',
      standards: 'DIN 1045-3 (Bauausführung)',
      useCase: 'Ermittlung der notwendigen Tage für Schalungs- und Nachbehandlungsfristen zum Schutz vor Frühschwinden.'
    },
    {
      title: 'Festbeton',
      icon: Box,
      purpose: 'Physikalisch-mechanische Eigenschaften des erhärteten Gefüges (Druck- und Zugfestigkeiten, Elastizitätsmodul, Kriechen und Schwinden).',
      standards: 'DIN EN 12390-3, DIN EN 12390-6, DIN EN 12504-1',
      useCase: 'Berechnung des zeitlichen Festigkeitszuwachses von Festbeton zur Tragfähigkeitsbewertung nach dem Ausschalungszeitpunkt.'
    },
    {
      title: 'Sonderbetone',
      icon: Layers,
      purpose: 'Kompakte Darstellungen von Spezialbaustoffen wie Leichtbeton, UHPC, Spritzbeton, Sichtbeton, Faserbeton und Recyclingbeton.',
      standards: 'DIN EN 206 (Anhang F), Richtlinien Leichtbeton / Faserbeton',
      useCase: 'Materialauswahl für innovative Tragwerke, Sichtbetonklassen SB 1 bis SB 4 oder nachhaltiges Bauen mit RC-Zuschlägen.'
    },
    {
      title: 'Entwicklungen',
      icon: Network,
      purpose: 'Technologische Meilensteine wie Carbon- und Textilbetone, 3D-Betondruck und neue CO2-arme Klinkerersatzstoffe.',
      standards: 'Allg. bauaufsichtliche Zulassungen (abZ)',
      useCase: 'Einarbeitung in CO2-reduzierten Stahlbetonersatz für schlanke Fassaden- oder Tragstrukturen.'
    },
    {
      title: 'Qualitätssicherung',
      icon: ClipboardCheck,
      purpose: 'Konformitätsbewertungen, Übereinstimmungsnachweise, Annahmekriterien und normgerechte Dokumentation aller Prüfergebnisse.',
      standards: 'DIN EN 206 (Konformitätskontrolle), DIN 1045-2',
      useCase: 'Festlegung von Prüfbeauftragten, Probenanzahlen und Auswertungsergebnissen zur Erfüllung von Konformitätskriterien.'
    },
    {
      title: 'Betonpraxis',
      icon: ClipboardCheck,
      purpose: 'Interaktive Rechentools, Beständigkeiten von Betonen gegenüber chemischen Angreifern und Checklisten für Bauingenieure vor Ort.',
      standards: 'Praxisleitfäden von DBV und DAfStb',
      useCase: 'Schnellcheck der chemischen Beständigkeit (Säureangriff/Sulphatangriff) und anwendungsfertige Checklisten zur Betonage.'
    },
    {
      title: 'Sicherheitskonzept',
      icon: Activity,
      purpose: 'Semiprobabilistisches Sicherheitskonzept, Teilsicherheitsbeiwerte für Einwirkungen und Baustoffeigenschaften nach Eurocode.',
      standards: 'DIN EN 1990 / DIN EN 1992-1-1',
      useCase: 'Bestimmung der Bemessungswerte von Festigkeiten f_cd und Lastkombinationen im GZT.'
    },
    {
      title: 'Schadreaktionen im Beton',
      icon: ShieldAlert,
      purpose: 'Detaillierte Analyse betoninterner Schadensreaktionen: Alkali-Kieselsäure-Reaktion (AKR), Ettringittreiben, Frost-Tausalz-Angriff und Säurekorrosion.',
      standards: 'DAfStb Alkali-Richtlinie / DIN EN 206',
      useCase: 'Vermeidung von AKR-Gefahren durch alkaliarme Zemente (NA) und unbedenkliche Gesteinskörnungen.'
    },
    {
      title: 'Festbeton (Statistik)',
      icon: BarChart3,
      purpose: 'Statistische Qualitäts- und Konformitätsüberwachung von Prüfkörper-Serien, Normalverteilung und Ausreißertests.',
      standards: 'DIN EN 206 / DIN ISO 12491',
      useCase: 'Konformitätsnachweis der charakteristischen Druckfestigkeit f_ck anhand laufender Werksprüfungen.'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HEADER CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="border-b border-home-grau/30 p-6 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-shiraz/10 rounded-xl text-shiraz">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                Modul: Betontechnologie
              </h2>
              <p className="text-sm text-text-main/70">Wissenschaftliche Leitgrundlage, Didaktik und Anwendungsbereiche des Baustoffs der Moderne</p>
            </div>
          </div>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4">
            <p>
              Wissenschaftliche Leitgrundlage, Didaktik und Anwendungsbereiche des Baustoffs der Moderne. Dieses Modul verknüpft Gefügechemie, Bemessungsregeln und praxisnahe Nachweisführungen nach DIN EN 206 und DIN 1045-2.
            </p>
          </div>
        </div>

        {/* SECTION TABS */}
        <div className="border-b border-home-grau/30 bg-slate-50/30 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSection('grundlagen')}
              className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'grundlagen'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white border border-home-grau/30 hover:border-shiraz text-text-main'
              }`}
            >
              <Info size={15} />
              Grundlagen
            </button>
            <button
              onClick={() => setActiveSection('ueberblick')}
              className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'ueberblick'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white border border-home-grau/30 hover:border-shiraz text-text-main'
              }`}
            >
              <Compass size={15} />
              Überblick
            </button>
            <button
              onClick={() => setActiveSection('inhalte')}
              className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'inhalte'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white border border-home-grau/30 hover:border-shiraz text-text-main'
              }`}
            >
              <BookOpen size={15} />
              Inhalte
            </button>
            <button
              onClick={() => setActiveSection('anwendung')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                activeSection === 'anwendung'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white border border-home-grau/30 hover:border-shiraz text-text-main'
              }`}
            >
              <UserCheck size={16} />
              Anwendung
            </button>
            <button
              onClick={() => setActiveSection('weiterfuehrend')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                activeSection === 'weiterfuehrend'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white border border-home-grau/30 hover:border-shiraz text-text-main'
              }`}
            >
              <Compass size={16} />
              Weiterführend
            </button>
            <button
              onClick={() => setActiveSection('historie')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                activeSection === 'historie'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white border border-home-grau/30 hover:border-shiraz text-text-main'
              }`}
            >
              <History size={16} />
              Historie
            </button>
          </div>
        </div>

        {/* CONTENT PANEL */}
        <div className="p-6">
          {activeSection === 'grundlagen' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <FileText className="text-shiraz w-5 h-5" />
                  Wissenschaftliche Grundlagen der Betontechnologie
                </h3>
                <p className="text-sm text-text-main/80 leading-relaxed">
                  Betontechnologie befasst sich mit der materialwissenschaftlichen Erforschung, Zusammensetzung und baupraktischen Herstellung des Drei-Komponenten-Systems aus <strong>Bindemitteln</strong> (hauptsächlich Zement), <strong>Gesteinskörnungen</strong> (Zuschlägen) und <strong>Anmachwasser</strong> unter gezieltem Einsatz von <strong>Betonzusatzmitteln</strong> und <strong>Zusatzstoffen</strong>.
                </p>
                <p className="text-sm text-text-main/80 leading-relaxed">
                  Ziel ist es, den Beton im frischen Zustand für den Einbau optimal einzustellen (Verarbeitbarkeit) und im festen Zustand die geforderten mechanischen Parameter (Festigkeit, Elastizitätsmodul) sowie Schutzfunktionen (Dauerhaftigkeit gegenüber Frost, chemischen Angriffen und Bewehrungskorrosion) nachzuweisen.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 border border-home-grau/20 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-text-main">Hydratations- und Gefügechemie</h4>
                  <p className="text-xs text-text-main/70 leading-relaxed">
                    Erhärtungsreaktionen (C-S-H-Phasensynthese), Steuerung der Hydratationsgeschwindigkeit und Optimierung der Mikroporosität im Zementsteingefüge.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border border-home-grau/20 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-text-main">Normatives Regelwert-Konzept</h4>
                  <p className="text-xs text-text-main/70 leading-relaxed">
                    Expositionsklassen, Grenzwerte für Wasser-Bindemittel-Verhältnisse sowie die rechnerische Absicherung des Betonentwurfs zur Lebensdauerprognose nach DIN EN 206 und DIN 1045-2:2023-08.
                  </p>
                </div>
              </div>

              {/* Normative Aktualisierung Stand 2026: DIN 1045-1000 & BBQ-Systematik */}
              <div className="bg-white border border-shiraz/30 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-home-grau/20 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                      BBQ
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-text-main">
                        Neue Betonbauqualitätsklassen nach DIN 1045-1000:2023-08 &amp; DIN 1045-2/3 (Stand 2026)
                      </h4>
                      <p className="text-[11px] text-text-main/60">
                        Ganzheitliche Qualitätssicherung durch das Zusammenspiel von Planung, Bemessung, Baustoff und Ausführung
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-shiraz text-white">
                    Gültige Normengeneration
                  </span>
                </div>

                <p className="text-xs text-text-main/80 leading-relaxed">
                  Mit der Neuausgabe der Normenreihe DIN 1045 (August 2023) wurde die übergeordnete <strong>DIN 1045-1000</strong> eingeführt. 
                  Sie regelt das Zusammenspiel aller Beteiligten (Planer, Bauherr, Betonhersteller, Bauausführende) über die Festlegung einer 
                  <strong>Betonbauqualitätsklasse (BBQ)</strong> für jedes Bauteil:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-text-main px-2 py-0.5 bg-white rounded border border-home-grau/20">
                        BBQ-N
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Normal</span>
                    </div>
                    <p className="text-xs text-text-main/80 font-medium">Regelbauteile des üblichen Hochbaus</p>
                    <p className="text-[11px] text-text-main/60 leading-relaxed">
                      Keine besonderen Anforderungen über die bewährten Ausführungsregeln nach DIN 1045-3 hinaus (z. B. einfache Decken, Standard-Innenstützen).
                    </p>
                    <div className="text-[10px] text-text-main/70 pt-1 border-t border-home-grau/15 font-mono">
                      Überwachung: ÜK 1 (Eigenüberwachung)
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-amber-900 px-2 py-0.5 bg-white rounded border border-amber-200">
                        BBQ-E
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">Erhöht</span>
                    </div>
                    <p className="text-xs text-amber-950 font-medium">Anspruchsvolle Bauteile / WU-Wannen</p>
                    <p className="text-[11px] text-amber-900/80 leading-relaxed">
                      Erhöhte Ausführungsüberwachung, Betone mit besonderen Eigenschaften (z. B. Weiße Wannen, Sichtbeton SB2/SB3, Industrieböden).
                    </p>
                    <div className="text-[10px] text-amber-800 pt-1 border-t border-amber-200/60 font-mono">
                      Überwachung: ÜK 2 + Konzeptionsgespräch
                    </div>
                  </div>

                  <div className="p-3.5 bg-red-50/50 rounded-xl border border-red-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-red-900 px-2 py-0.5 bg-white rounded border border-red-200">
                        BBQ-S
                      </span>
                      <span className="text-[10px] font-bold text-red-800 bg-red-100/70 px-2 py-0.5 rounded">Speziell</span>
                    </div>
                    <p className="text-xs text-red-950 font-medium">Höchste Anforderungen / Großinfrastruktur</p>
                    <p className="text-[11px] text-red-900/80 leading-relaxed">
                      Brückenüberbauten, Hochleistungsbetone, massige Bauteile mit Temperaturrissrisiko, Sichtbeton SB4. Erfordert obligatorisch einen qualifizierten <strong>BBQ-Ingenieur</strong>.
                    </p>
                    <div className="text-[10px] text-red-800 pt-1 border-t border-red-200/60 font-mono">
                      Überwachung: ÜK 3 + Fremdüberwachung + BBQ-Ing.
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-home-grau/20 text-xs text-text-main/80 space-y-2">
                  <div className="font-bold text-text-main flex items-center gap-1.5">
                    <Layers size={14} className="text-shiraz" />
                    k-Wert-Ansätze &amp; Zusatzstoffregelungen (Typ II) nach DIN 1045-2:2023-08
                  </div>
                  <p className="text-[11px] leading-relaxed text-text-main/70">
                    Zur Dekarbonisierung erlaubt DIN 1045-2:2023-08 in Verbindung mit der DAfStb-Richtlinie für treibhausgasreduzierte Betone 
                    erweiterte Anrechnungen von Typ-II-Zusatzstoffen (Flugasche k = 0,40; Silikastaub k = 1,00 bis 2,00; Gesteinsmehle k = 0,20). 
                    Der äquivalente Wasserzementwert errechnet sich streng nach: 
                    <span className="font-mono font-bold text-shiraz ml-1">(w/z)_eq = w / (z + k · f)</span>. 
                    Mindestzementgehalte dürfen bei nachgewiesener Reaktivität unter Einhaltung des Korrosions- und Karbonatisierungsschutzes klinkereffizient abgesenkt werden.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'inhalte' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <BookOpen className="text-shiraz w-5 h-5" />
                  Inhalte &amp; Untermodule im Überblick
                </h3>
                <p className="text-sm text-text-main/80">
                  Die Betontechnologie in diesem digitalen Baustoffboard gliedert sich in verschiedene Fachmodule, die jeweils spezifische Phasen des Betonlebenszyklus abbilden:
                </p>
              </div>

              {/* ITERATING SUBMODULE DESCRIPTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submodules.map((m, idx) => {
                  const Icon = m.icon;
                  return (
                    <div key={idx} className="p-4 bg-off-white border border-home-grau/30 rounded-xl space-y-2 hover:shadow-sm transition-all">
                      <div className="flex items-center gap-2 border-b border-home-grau/20 pb-1.5">
                        <Icon size={16} className="text-shiraz" />
                        <h4 className="font-bold text-sm text-text-main">{m.title}</h4>
                      </div>
                      <div className="space-y-1 text-xs text-text-main/80">
                        <p><strong>Zweck:</strong> {m.purpose}</p>
                        <p><strong>Normen/Regelwerke:</strong> <span className="text-shiraz font-mono">{m.standards}</span></p>
                        <p className="text-text-main/60 italic"><strong>Praxisbeispiel:</strong> {m.useCase}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === 'ueberblick' && (
            <ModuleOverviewView groupKey="beton" />
          )}

          {activeSection === 'anwendung' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <UserCheck className="text-shiraz w-5 h-5" />
                  Anwendung in Lehre und Berufspraxis
                </h3>
                <p className="text-sm text-text-main/80 leading-relaxed">
                  Das Betonologie-Modul spricht verschiedene Akteure im Bauwesen gleichermaßen an und dient als Brücke zwischen Hochschule und rauer Baustellen- bzw. Fertigteilpraxis:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-white border-l-4 border-l-shiraz border-y border-r border-home-grau/20 rounded-r-xl">
                  <h4 className="font-bold text-sm text-text-main">Akademische Lehre im Bauingenieurwesen</h4>
                  <p className="text-xs text-text-main/70 leading-relaxed mt-1">
                    Ideal als interaktive Ergänzung zur Vorlesung "Baustoffkunde II" und "Betontechnologie". Ermöglicht das spielerische Erfassen komplexer Zusammenhänge, wie z.B. wie Änderungen am w/z-Wert direkt Einfluss auf die Festbeton-Druckfestigkeit nehmen.
                  </p>
                </div>

                <div className="p-4 bg-white border-l-4 border-l-emerald-600 border-y border-r border-home-grau/20 rounded-r-xl">
                  <h4 className="font-bold text-sm text-text-main">Für Bauleiter, Planer und Betonprüfer</h4>
                  <p className="text-xs text-text-main/70 leading-relaxed mt-1">
                    Schnelle, verlässliche Überprüfung der normgerechten Ausführung auf der Baustelle: Ermittlung von Nachbelegfristen, Abschätzung exothermer Bauteilkerntemperaturen oder schneller Sieblinien-Check direkt auf dem Smartphone oder Tablet.
                  </p>
                </div>
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
                      <li className="text-xs">
                        <a href="https://www.beton.org" target="_blank" rel="noopener noreferrer" className="font-bold text-shiraz hover:underline flex items-center gap-1">
                          beton.org <span className="text-[10px]">↗</span>
                        </a>
                        <span className="text-text-main/70 block mt-0.5">Informationsportal der deutschen Zement- und Betonindustrie mit Regelmerkblättern und Richtlinien.</span>
                      </li>
                      <li className="text-xs">
                        <a href="https://www.vdz-online.de" target="_blank" rel="noopener noreferrer" className="font-bold text-shiraz hover:underline flex items-center gap-1">
                          Verein Deutscher Zementwerke e.V. (VDZ) <span className="text-[10px]">↗</span>
                        </a>
                        <span className="text-text-main/70 block mt-0.5">Wissenschaftliche Untersuchungen, Technische Berichte und die vollständig abrufbaren Zement-Taschenbücher.</span>
                      </li>
                      <li className="text-xs">
                        <a href="https://www.dafstb.de" target="_blank" rel="noopener noreferrer" className="font-bold text-shiraz hover:underline flex items-center gap-1">
                          Deutscher Ausschuss für Stahlbeton (DAfStb) <span className="text-[10px]">↗</span>
                        </a>
                        <span className="text-text-main/70 block mt-0.5">Herausgeber wegweisender DAfStb-Richtlinien für Massige Bauteile, selbstverdichtende Betone und Betonbauten.</span>
                      </li>
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
                      In Bibliotheken etablierte Standardwerke zur vertiefenden Einarbeitung in die Betontechnologie.
                    </p>
                    <ul className="space-y-3 text-xs leading-relaxed text-text-main/80">
                      <li>
                        <strong>Beton - Herstellung und Eigenschaften</strong>
                        <span className="block text-[11px] text-text-main/60 mt-0.5">P. Grübl, H. Weigler, S. Karl. Ernst &amp; Sohn Verlag, ISBN 975-3-433-01340-3. Phänomenologisches Grundlagenwerk zum Dreiphasensystem.</span>
                      </li>
                      <li>
                        <strong>Zement - Chemie und Technologie</strong>
                        <span className="block text-[11px] text-text-main/60 mt-0.5">H. F. W. Taylor. Thomas Telford Publishing. Die absolute weltweite Referenz für hydratationschemische Modellierungen im Zementmörtel.</span>
                      </li>
                      <li>
                        <strong>Dauerhaftigkeit von Beton</strong>
                        <span className="block text-[11px] text-text-main/60 mt-0.5">J. Stark, B. Wicht. Springer Vieweg Verlag. Detaillierte Darstellung physikalisch-chemischer Angriffsmechanismen (Alkali-Kieselsäure-Reaktion, Frost, Chloride).</span>
                      </li>
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
                      Internationale wissenschaftliche Publikationen in Journals zur Erforschung von Hydratation und Klinker-Substitutionswirkungen.
                    </p>
                    <ul className="space-y-2.5">
                      <li className="text-xs">
                        <span className="font-bold text-emerald-800 block">Cement and Concrete Research (Elsevier)</span>
                        <span className="text-[11px] leading-relaxed text-text-main/70 mt-0.5">&quot;Hydration kinetics and microstructural development of low-clinker blended cements&quot; (Scrivener, K. L. et al., Vol. 110, 2018). Mechanismus der Klinkerreduktion.</span>
                      </li>
                      <li className="text-xs">
                        <span className="font-bold text-emerald-800 block">Materials and Structures (RILEM)</span>
                        <span className="text-[11px] leading-relaxed text-text-main/70 mt-0.5">&quot;A comprehensive review on the water-to-binder ratio in ultra-high performance concrete&quot; (De Larrard, F., Vol. 52, 2020). Untersuchungen zur Kornpackungs-Optimierung.</span>
                      </li>
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
                      Über deutsche Universitätsbibliotheken offen zugängliche Dissertationen und Berichte mit Fokus auf zukunftsweisende Zementkomplexe.
                    </p>
                    <ul className="space-y-3 text-xs leading-relaxed text-text-main/80">
                      <li>
                        <strong>Untersuchungen zur Gefügeoptimierung ultrahochfester Betone (UHPC)</strong>
                        <span className="block text-[11px] text-text-main/60 mt-0.5">Dissertation, Technische Universität München (TUM), Dr.-Ing. Michael Schmidt. Grundlagen für dichte Silika-Nanopulver-Stoffraumstrukturen.</span>
                      </li>
                      <li>
                        <strong>Zur Hydratationskinetik klinkerreduzierter Zemente mit calzinierten Tonen</strong>
                        <span className="block text-[11px] text-text-main/60 mt-0.5">Dissertation, Karlsruher Institut für Technologie (KIT), Dr.-Ing. Tobias Schuler. Erforschung der LC3-Bindemittelsysteme zur Reduktion von GWP-Werten.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'historie' && (
            <div className="animate-in fade-in duration-300">
              <ModuleHistoryView history={MODULE_HISTORY_DATA.beton} />
            </div>
          )}
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Zement', url: 'https://de.wikipedia.org/wiki/Zement' },
          { title: 'Frischbeton', url: 'https://de.wikipedia.org/wiki/Frischbeton' }
        ]}
        literatur={[
          'Grübl, P.; Weigler, H.; Karl, S. (2001): Beton - Herstellung und Eigenschaften (Ernst & Sohn Verlag)',
          'Zement- und Betonverband: Betontechnische Tabellen (In der Praxis bewährtes Handbuch)',
          'Verein Deutscher Zementwerke e.V. (VDZ): Zement-Taschenbuch (63. Ausgabe)'
        ]}
        regelwerke={[
          { title: 'DIN EN 206:2021-06 (Beton - Festlegung, Eigenschaften, Herstellung und Konformität)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+206' },
          { title: 'DIN 1045-2:2023-08 (Tragwerke aus Beton, Stahlbeton und Spannbeton - Nationale Anwendungsregeln zu DIN EN 206)', url: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2' },
          { title: 'DIN EN 13670:2010-06 / DIN 1045-3:2023-08 (Ausführung von Tragwerken aus Beton)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+13670' },
          { title: 'DIN 1045-1000:2023-08 (Zusammenarbeit bei der Planung, Herstellung und Bauausführung)', url: 'https://www.dinmedia.de/de/suche?q=DIN+1045-1000' }
        ]}
        formeln={[
          {
            formel: 'V = \\frac{m_z}{\\rho_z} + \\frac{m_w}{\\rho_w} + \\sum \\frac{m_{g,i}}{\\rho_{g,i}} + \\frac{m_f}{\\rho_f} + V_l = 1000\\,\\text{dm}^3',
            erklaerung: 'Stoffraumgleichung für 1 m³ (1000 dm³) verdichteten Frischbeton: Summe aller absoluten Feststoff-, Flüssigkeits- und Porenvolumina.',
            quelle: 'DIN EN 206 / DIN 1045-2'
          }
        ]}
      />
    </div>
  );
}
