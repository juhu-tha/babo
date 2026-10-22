import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  History,
  Compass,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

interface ChecklistItem {
  id: string;
  task: string;
  description: string;
  ref: string;
  status: 'critical' | 'mandatory' | 'recommended';
}

interface ChecklistSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  items: ChecklistItem[];
}

const INITIAL_CHECKLISTS: Record<string, ChecklistSection> = {
  recherche: {
    id: 'recherche',
    title: '1. Archivrecherche & Voruntersuchung',
    description: 'Systematische Erhebung historischer Plan- und Berechnungsgrundlagen vor Beginn baulicher Eingriffe.',
    icon: History,
    items: [
      {
        id: 'rec-1',
        task: 'Bauakteneinsicht & Altstatik-Sicherung',
        description: 'Vollständige Sichtung der Bestandsakten beim Bauordnungsamt zur Beschaffung der originalen Tragwerksplanung, Schal- und Bewehrungspläne sowie Baugenehmigungen.',
        ref: 'LBO / VDI 6200',
        status: 'critical'
      },
      {
        id: 'rec-2',
        task: 'Klärung des Denkmalschutzstatus (UDB)',
        description: 'Anfrage bei der Unteren Denkmalschutzbehörde bezüglich Einzeldenkmalstatus, Ensembleschutz oder Erhaltungssatzung, um gesetzliche Auflagen frühzeitig zu erfassen.',
        ref: 'Denkmalschutzgesetz (DSchG)',
        status: 'critical'
      },
      {
        id: 'rec-3',
        task: 'Historische Erkundung des Standorts',
        description: 'Recherche bezüglich früherer industrieller Nutzung, Bombentreffern im Zweiten Weltkrieg (Kampfmittelverdacht: Pflichten nach Landesrecht und Bauherrenverantwortung, Arbeitshilfen Kampfmittelräumung des Bundes) oder nachträglicher Umbauten, die nicht dokumentiert wurden.',
        ref: 'Landesrecht / AH KMR',
        status: 'mandatory'
      },
      {
        id: 'rec-4',
        task: 'Nutzungsgeschichte und Schadstoffverdacht ermitteln',
        description: 'Erfassung früherer Verwendungen (z. B. chemische Reinigung, Werkstatt) zur Eingrenzung des Risikos für Kontaminationen und verdeckte Schadstoffe.',
        ref: 'VDI 6202 Blatt 1',
        status: 'mandatory'
      },
      {
        id: 'rec-5',
        task: 'Schadstofferkundung vor Eingriffen',
        description: 'Bei Gebäuden mit Baubeginn vor dem 31.10.1993 muss der Veranlasser vor Tätigkeiten an der Bausubstanz vorhandene Informationen (Baujahr, Asbestverdacht) ermitteln und den ausführenden Betrieben übergeben; bei Verdacht Probenahme und Analyse.',
        ref: 'GefStoffV § 5a / TRGS 519',
        status: 'mandatory'
      }
    ]
  },
  erfassung: {
    id: 'erfassung',
    title: '2. Bauwerkserfassung & Bauaufnahme',
    description: 'Zustandserfassung und Aufmaß zur Erstellung präziser Verformungspläne und Systemanalysen.',
    icon: Compass,
    items: [
      {
        id: 'erf-1',
        task: 'Bauaufnahme-Genauigkeitsstufe festlegen',
        description: 'Festlegung der Genauigkeitsstufe der Bauaufnahme (Stufe I bis IV nach Eckstein) je nach Planungstiefe.',
        ref: 'VDI/VDE 2634 / Verband Dt. Vermessungsing.',
        status: 'mandatory'
      },
      {
        id: 'erf-2',
        task: '3D-Laserscanning & Verformungsgetreues Aufmaß',
        description: 'Durchführung einer digitalen Bestandserfassung (LiDAR) zur Abbildung von Schiefstellungen, Durchbiegungen und Maßabweichungen im Tragwerk.',
        ref: 'DIN 18710-1 / Verformungsgetreues Aufmaß',
        status: 'recommended'
      },
      {
        id: 'erf-3',
        task: 'Bauteilschichten & Konstruktionsprinzipien klären',
        description: 'Lokalisierung und Zuordnung von Deckenkonstruktionen (z.B. Kappendecke, Holzbalkendecke, Rippendecke) mittels zerstörungsarmer Bauteilöffnungen. Grundlage: Sicherheitskonzept DIN EN 1990/NA; Bewertung bestehender Tragwerke nach ISO 13822 bzw. EN 1990-2:2026 (ersetzt CEN/TS 17440:2020).',
        ref: 'ISO 13822 / EN 1990-2:2026',
        status: 'critical'
      },
      {
        id: 'erf-4',
        task: 'Baugrund- und Gründungsuntersuchung anstoßen',
        description: 'Prüfung der Fundamente durch Suchschlitze sowie Erkundung der Bodenkennwerte bei geplanten Lastaufstockungen.',
        ref: 'DIN 4020 / Eurocode 7',
        status: 'critical'
      }
    ]
  },
  diagnostik: {
    id: 'diagnostik',
    title: '3. Bauwerksdiagnostik & ZfP',
    description: 'Zerstörungsfreie und zerstörungsarme Prüfungen der Bestandsmaterialien zur Ermittlung realer Kennwerte.',
    icon: Search,
    items: [
      {
        id: 'dia-1',
        task: 'Bewehrungsortung & Betondeckungsmessung',
        description: 'Zerstörungsfreie Bestimmung der Lage, des Durchmessers und der konkreten Betondeckungsverhältnisse der Bewehrung mittels elektromagnetischer Verfahren.',
        ref: 'DBV-Merkblatt "Betondeckung und Bewehrung"',
        status: 'mandatory'
      },
      {
        id: 'dia-2',
        task: 'Carbonatisierungstiefe & Chloridprofil ermitteln',
        description: 'Indikatorprüfung mit Phenolphthalein an frischen Bruchflächen und Bohrmehlanalysen im Labor zur Feststellung des Korrosionsrisikos für den Bewehrungsstahl.',
        ref: 'DIN EN 14630 / DIN EN 14629 / TR Instandhaltung',
        status: 'critical'
      },
      {
        id: 'dia-3',
        task: 'Zerstörungsfreie Prüfung der Mauerwerks- und Holzfestigkeit',
        description: 'Zerstörungsfreie bzw. zerstörungsarme Festigkeitsabschätzungen mittels Rückprallhammer (Schmidthammer), Widerstandsbohrung (Resistograph) oder Ultraschallmessungen. Rückprallhammer nur mit Kalibrierung an Bohrkernen; Bohrwiderstandsmessung an Holz ist nicht genormt.',
        ref: 'DIN EN 12504-2/-4, DIN EN 13791',
        status: 'recommended'
      },
      {
        id: 'dia-4',
        task: 'Feuchtemessungen an kritischen Bauteilen',
        description: 'Bestimmung der Materialfeuchte (z. B. CM-Methode oder Darr-Methode) an erdberührten Bauteilen und in Nassbereichen zur Schadensprävention.',
        ref: 'WTA-Merkblatt 4-5 / DIN 18560',
        status: 'mandatory'
      }
    ]
  },
  standsicherheit: {
    id: 'standsicherheit',
    title: '4. Nachrechnung & Tragfähigkeitsnachweis',
    description: 'Bewertung der rechnerischen Standsicherheit und Resttragfähigkeit bestehender Bauteile.',
    icon: Building2,
    items: [
      {
        id: 'st-1',
        task: 'Nachrechnung nach der Nachrechnungsrichtlinie',
        description: 'Rechnerische Überprüfung bestehender Brücken- und Hochbautragwerke im Hinblick auf geänderte Nutzungs- und Verkehrslasten. Straßenbrücken: Nachrechnungsrichtlinie (Ausgabe 05/2011 mit 1. und 2. Ergänzung); Hochbau: DIN EN 1990 ff. mit NA, ergänzend ISO 13822.',
        ref: 'Nachrechnungsrichtlinie / DIN EN 1990 + NA',
        status: 'critical'
      },
      {
        id: 'st-2',
        task: 'Sicherheitskonzept im Bestand anwenden',
        description: 'Nutzung von modifizierten Teilsicherheitsbeiwerten auf Basis messtechnisch abgesicherter Geometrien und Werkstofffestigkeiten.',
        ref: 'ISO 13822 / Eurocode (Bestandskonzept)',
        status: 'critical'
      },
      {
        id: 'st-3',
        task: 'Bestimmung von Ist-Festigkeitsklassen',
        description: 'Rückrechnung der charakteristischen Beton- oder Mauerwerksdruckfestigkeiten anhand von Bohrkernprüfdaten.',
        ref: 'DIN EN 13791 / DIN EN 1996',
        status: 'mandatory'
      },
      {
        id: 'st-4',
        task: 'Abstimmung ergänzender Instandsetzungsmaßnahmen',
        description: 'Konzipierung von Verstärkungsmaßnahmen (z.B. CFK-Lamellen, Spritzbetonverstärkung) bei rechnerischem Defizit.',
        ref: 'TR Instandhaltung / abZ',
        status: 'recommended'
      },
      {
        id: 'st-5',
        task: 'Ankündigungsverhalten bei SpRK-gefährdetem Spannstahl',
        description: 'Bei Spannbeton mit spannungsrisskorrosionsgefährdetem Spannstahl (z. B. Hennigsdorfer, Sigma oval, ölschlussvergütete Stähle bis ca. 1978) Nachweis des Ankündigungsverhaltens (Riss-vor-Bruch) führen bzw. Monitoring vorsehen.',
        ref: 'Handlungsanweisung SpRK (2011)',
        status: 'critical'
      }
    ]
  }
};

export default function BestandChecklisten() {
  const [activeSubTab, setActiveSubTab] = useState<string>('recherche');
  const currentSection = INITIAL_CHECKLISTS[activeSubTab];

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-300">
      
      {/* Header Info-Bereich */}
      <div className="bg-white text-text-main rounded-2xl p-6 border border-home-grau/30 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
          <Building2 className="text-shiraz" /> Checklisten: Bauen im Bestand
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Stufenweise Qualitätssicherung und Diagnostik im Bestandsbau zur sicheren Tragfähigkeitsnachrechnung, In-Situ-Befundung und Denkmalsanierung nach VDI 6200 (Standsicherheit), WTA-Merkblättern, Denkmalschutzgesetz und – bei Brücken und Ingenieurbauwerken – DIN 1076.
          </p>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {Object.values(INITIAL_CHECKLISTS).map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSubTab === sec.id;

          return (
            <button
              key={sec.id}
              onClick={() => setActiveSubTab(sec.id)}
              className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all duration-150 cursor-pointer shadow-xs ${
                isActive
                  ? 'bg-shiraz/5 border-shiraz ring-1 ring-shiraz/25'
                  : 'bg-white border-home-grau/20 hover:border-home-grau/40 hover:bg-off-white'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className={`p-1 rounded ${isActive ? 'bg-shiraz/10 text-shiraz' : 'bg-off-white text-home-grau'}`}>
                    <Icon size={12} />
                  </div>
                  <span className={`text-xs font-mono leading-none tracking-wider font-bold ${isActive ? 'text-shiraz' : 'text-home-grau/60'}`}>
                    KATEGORIE
                  </span>
                </div>
                <h3 className={`font-bold text-sm tracking-tight ${isActive ? 'text-text-main' : 'text-home-grau'}`}>
                  {sec.title.split('. ')[1]}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Checklist Card & Controls */}
      <div className="bg-white rounded-xl border border-home-grau/20 shadow-xs overflow-hidden min-h-[350px] flex flex-col justify-between">
        
        {/* Section Title */}
        <div className="p-4 border-b border-home-grau/10 bg-off-white/50">
          <h2 className="text-sm font-bold text-text-main">
            {currentSection.title}
          </h2>
          <p className="text-sm text-home-grau leading-normal max-w-xl font-normal mt-0.5">
            {currentSection.description}
          </p>
        </div>

        {/* Checklist List View */}
        <div className="p-4 space-y-2.5 flex-grow">
          <div className="grid grid-cols-1 gap-2.5">
            {currentSection.items.map((item, index) => {
              let borderStyle = 'border-home-grau/20';
              let badgeStyle = '';
              let badgeLabel = '';
              
              if (item.status === 'critical') {
                borderStyle = 'border-home-grau/20 border-l-2 border-l-rose-500/80';
                badgeStyle = 'bg-rose-50/50 text-rose-700 border-rose-100/40';
                badgeLabel = 'Kritisch / Haftungsrelevant';
              } else if (item.status === 'mandatory') {
                borderStyle = 'border-home-grau/20 border-l-2 border-l-amber-500/80';
                badgeStyle = 'bg-amber-50/50 text-amber-700 border-amber-100/40';
                badgeLabel = 'Pflichtpunkt';
              } else {
                borderStyle = 'border-home-grau/20 border-l-2 border-l-emerald-500/80';
                badgeStyle = 'bg-emerald-50/50 text-emerald-700 border-emerald-100/40';
                badgeLabel = 'Stand der Technik';
              }

              return (
                <div 
                  key={item.id}
                  className={`p-3 rounded-lg border bg-white flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 hover:shadow-xs transition-shadow duration-100 ${borderStyle}`}
                >
                  <div className="space-y-1.5 flex-1 pr-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-home-grau/50">
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      <h4 className="text-sm font-bold text-text-main leading-tight">
                        {item.task}
                      </h4>
                      <span className={`px-1 py-0.5 rounded text-xs font-bold border ${badgeStyle} font-mono tracking-wide shrink-0`}>
                        {badgeLabel}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed font-normal text-home-grau/80">
                      {item.description}
                    </p>
                  </div>

                  {/* Rechtsgrundlage */}
                  <div className="flex sm:flex-col justify-between items-end gap-1 text-xs font-mono tracking-tight sm:border-l sm:border-home-grau/10 sm:pl-3 shrink-0 pt-1.5 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-home-grau/60 font-bold block text-xs uppercase tracking-wider">Rechtsgrundlage</span>
                      <span className="text-text-main font-bold bg-off-white px-1.5 py-0.5 rounded border border-home-grau/10 block max-w-max sm:ml-auto text-xs mt-0.5">
                        {item.ref}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Small Context Assistance Block */}
        <div className="p-3 border-t border-home-grau/10 bg-off-white/40 rounded-b-xl">
          <div className="flex flex-col md:flex-row gap-2.5 justify-between items-center text-xs text-home-grau">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-home-grau/60 shrink-0" />
              <p className="font-normal text-home-grau/80">
                <strong>Fehlende Statik-Unterlagen?</strong> Nehmen Sie rechtzeitig Kontakt mit dem historischen Archiv des örtlichen Bauamts auf, um langwierige Erkundungsoffensiven einzusparen.
              </p>
            </div>
            <div className="flex gap-1">
              <a 
                href="https://www.gesetze-im-internet.de/geg/index.html" 
                target="_blank" 
                rel="no-referrer"
                className="px-1.5 py-0.5 bg-white hover:bg-off-white border border-home-grau/20 text-text-main rounded font-bold flex items-center gap-0.5 transition-all cursor-pointer text-xs"
              > GModG <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Module Footer Links */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Chloridgehalt aus Bohrmehl auf den Zementgehalt umrechnen"
        zielGleichung="Cl_{Z} = Cl_{B} \cdot \frac{\rho_B}{z}"
        schritte={[
          { titel: 'Analyse', erklaerung: 'Bohrmehl aus 20–40 mm Tiefe: 0,08 M.-% Chlorid bezogen auf Beton; Rohdichte 2 350 kg/m³, Zementgehalt laut Bestandsunterlagen 300 kg/m³.', formel: 'Cl_B = 0{,}08\\,\\text{M.-\\%}' },
          { titel: 'Umrechnung', erklaerung: 'Bezug auf Zementmasse:', formel: 'Cl_Z = 0{,}08 \\cdot \\frac{2\\,350}{300} = 0{,}63\\,\\text{M.-\\% v. z}' },
          { titel: 'Bewertung', erklaerung: 'Anhaltswert für korrosionsauslösenden Chloridgehalt ≈ 0,5 M.-% bezogen auf Zement (objektspezifisch festzulegen):', formel: '0{,}63 > 0{,}5 \\Rightarrow \\text{Korrosionsrisiko in Bewehrungstiefe}' }
        ]}
        ergebnisHinweis="Ist der Zementgehalt unbekannt, ist er zu schätzen oder analytisch zu bestimmen – der Fehler geht direkt in das Ergebnis ein."
        normQuelle="DIN EN 14629; TR Instandhaltung (DIBt)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Materialfeuchte nach der Darr-Methode"
        zielGleichung="u = \frac{m_f - m_{tr}}{m_{tr}} \cdot 100\,\%"
        schritte={[
          { titel: 'Wägung', erklaerung: 'Probe aus erdberührtem Ziegelmauerwerk: feucht 520 g, nach Trocknung bei 105 °C bis zur Massekonstanz 495 g.', formel: 'm_f = 520\\,\\text{g},\\; m_{tr} = 495\\,\\text{g}' },
          { titel: 'Feuchtegehalt', erklaerung: 'Massebezogener Wassergehalt:', formel: 'u = \\frac{520 - 495}{495} \\cdot 100 = 5{,}1\\,\\text{M.-\\%}' }
        ]}
        ergebnisHinweis="Für die Bewertung ist der Durchfeuchtungsgrad aussagekräftiger (Bezug auf die maximale Wasseraufnahme); zusätzlich sind Salzgehalt und hygroskopische Feuchte zu bestimmen (WTA-Merkblatt 4-5)."
        normQuelle="WTA-Merkblatt 4-5 (Mauerwerksdiagnostik)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="bestand_checklisten" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 8 Bestand: Regelwerke und Prüfverfahren geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Bauen im Bestand', url: 'https://de.wikipedia.org/wiki/Bauen_im_Bestand' },
          { title: 'Bauaufnahme', url: 'https://de.wikipedia.org/wiki/Bauaufnahme' },
          { title: 'Zerstörungsfreie Prüfung im Bauwesen', url: 'https://de.wikipedia.org/wiki/Zerst%C3%B6rungsfreie_Pr%C3%BCfung_im_Bauwesen' }
        ]}
        regelwerke={[
          { title: 'VDI 6200:2010-02 (Standsicherheit von Bauwerken – Regelmäßige Überprüfung)', url: 'https://www.vdi.de/' },
          { title: 'WTA-Merkblatt 4-5-99/D: Beurteilung von Mauerwerk – Mauerwerksdiagnostik', url: 'https://www.wta-gmbh.de/' },
          { title: 'DIN 1076:2026-01 (Ingenieurbauwerke im Zuge von Straßen und Wegen – Überwachung und Prüfung; ersetzt 1999-11)' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]} 
        formeln={[
          {
            formel: 'v_u = \\frac{s}{t} \\quad [\\text{m/s}] \\implies E_{\\text{dyn}} = \\rho \\cdot v_u^2 \\cdot \\frac{(1+\\nu)(1-2\\nu)}{1-\\nu}',
            erklaerung: 'Zerstörungsfreie Prüfung im Bestand: Dynamischer Elastizitätsmodul E_dyn aus der Ultraschall-Impulsgeschwindigkeit v_u, Rohdichte rho und Querdehnzahl nu.',
            quelle: 'DIN EN 12504-4'
          },
          {
            formel: 'f_{\\text{ck,is}} = \\min\\left(f_{c,m(n),is} - k_n \\cdot s;\\; f_{c,is,\\text{lowest}} + M\\right), \\quad f_{ck} = f_{\\text{ck,is}}/0{,}85',
            erklaerung: 'Charakteristische In-situ-Druckfestigkeit aus n ≥ 8 Bohrkernen (k_n = 2,00 bis 1,64; s mindestens entsprechend V = 8 %; M = 1–4 N/mm² je nach Tiefstwert) und Einstufung in eine Druckfestigkeitsklasse.',
            quelle: 'DIN EN 13791:2020-02'
          }
        ]}
      />

    </div>
  );
}
