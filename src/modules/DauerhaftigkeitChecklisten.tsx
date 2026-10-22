import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Layers, 
  FileText,
  BookOpen,
  Anchor,
  ExternalLink,
  ClipboardList
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
  expositionsklassen: {
    id: 'expositionsklassen',
    title: '1. Expositionsgruppen & Rezepturvorgaben',
    description: 'Korrekte Ermittlung der Expositionsklassen nach DIN 1045-2 zur Sicherung der Mindestbetondeckung und Zementanpassung.',
    icon: Layers,
    items: [
      {
        id: 'exp-1',
        task: 'Klassifizierung aller Bauteile nach Witterungskontakt',
        description: 'Vollständige Zuordnung zu XC (Carbonatisierung), XD (Chloride außer Meerwasser), XS (Meerwasser), XF (Frost/Tausalz), XM (Verschleiß) und XA (chemischer Angriff).',
        ref: 'DIN 1045-2 / DIN EN 206',
        status: 'critical'
      },
      {
        id: 'exp-2',
        task: 'Abgleich des höchstzulässigen Wasserzementwerts (max. w/z)',
        description: 'Prüfung, ob der maximale w/z-Wert gemäß Expositionsklasse eingehalten wird (z. B. max. 0,45 bei XD3 / XS3, max. 0,50 bei XF4 mit Luftporen), um kapillare Transportporenpfade zu minimieren.',
        ref: 'DIN 1045-2:2023-08, Tab. F.2.1/F.2.2',
        status: 'critical'
      },
      {
        id: 'exp-3',
        task: 'Prüfung des Mindestzementgehalts und Zementsorte',
        description: 'Sicherstellung der Mindestzementmenge im Frischbeton sowie Berücksichtigung von Sulfatwiderstand (SR-Zement) bei chemischem Schadensrisiko (XA).',
        ref: 'DIN 1045-2 Tab. F.2.1',
        status: 'mandatory'
      },
      {
        id: 'exp-4',
        task: 'Anforderung an den Luftporengehalt verifizieren',
        description: 'Bei hochgradiger Frost-/Tausalzbeanspruchung (XF3/XF4) ist ein künstlicher Mikroluftporengehalt im Frischbeton vor Ort messtechnisch nachzuweisen.',
        ref: 'DIN EN 12350-7 (Druckausgleichsverfahren)',
        status: 'mandatory'
      }
    ]
  },
  betondeckung: {
    id: 'betondeckung',
    title: '2. Bewehrungskorrosion & Betondeckung',
    description: 'Qualitätssicherung der Soll-Betondeckung zur dauerhaften Sicherstellung des alkalischen Passivierungsschutzes.',
    icon: ShieldAlert,
    items: [
      {
        id: 'cov-1',
        task: 'Ermittlung des Nennmaßes der Betondeckung (c_nom)',
        description: 'Berechnung aus Mindestbetondeckung c_min plus Vorhaltemaß (Verlegertoleranz) Delta-c_dev (Standard: 10 bis 15 mm).',
        ref: 'DIN EN 1992-1-1 / Nationaler Anhang (NA)',
        status: 'critical'
      },
      {
        id: 'cov-2',
        task: 'Auswahl der Abstandshalter nach DBV-Merkblatt',
        description: 'Festlegung geeigneter, formstabiler Abstandshalter aus Faserbeton oder Kunststoff, um Verkippungen der Bewehrung während des Betonierens zu verhindern.',
        ref: 'DBV-Merkblatt "Abstandshalter"',
        status: 'mandatory'
      },
      {
        id: 'cov-3',
        task: 'Nachbehandlungsdauer des Frischbetons bemessen',
        description: 'Festlegung der Nachbehandlungsfrist (Befeuchtung mit Wasser, Folienabdeckung) in Abhängigkeit von Festigkeitsentwicklung und Umweltbedingungen zur Absicherung der Randzonendichte.',
        ref: 'DIN 1045-3 / DIN EN 13670',
        status: 'critical'
      },
      {
        id: 'cov-4',
        task: 'Betonstahl-Zustand vor dem Einbau auditieren',
        description: 'Sicherstellung, dass der Bewehrungsstahl frei von losen Rostschuppen, Schalölrückständen oder Eisbefall ist, um optimalen Verbund zu sichern.',
        ref: 'DIN EN 10080',
        status: 'recommended'
      }
    ]
  },
  rissbreiten: {
    id: 'rissbreiten',
    title: '3. Rissbreitenbegrenzung & Risssteuerung',
    description: 'Berechnung und konstruktive Maßnahmen zur Einhaltung der zulässigen Rissbreiten (w_max).',
    icon: Search,
    items: [
      {
        id: 'ris-1',
        task: 'Grenzwert w_max festlegen',
        description: 'Definition der maximal zulässigen Rissbreite w_max in Abhängigkeit von der Expositionsklasse (Stahlbeton nach NA Tab. 7.1DE: 0,4 mm bei XC1, 0,3 mm bei XC2–XC4, 0,2 mm bei XD/XS; WU-Bauteile nach WU-Richtlinie).',
        ref: 'DIN EN 1992-1-1 + NA, 7.3 / DAfStb-WU-Richtlinie',
        status: 'critical'
      },
      {
        id: 'ris-2',
        task: 'Zweckmäßige Mindestbewehrung für Zwangskräfte berechnen',
        description: 'Auslegung der Rissbreitenbewehrung zur Aufnahme innerer Zwangskräfte infolge von Hydratationswärmeabfluss im frühen Stadium oder Schwindvorgängen.',
        ref: 'DIN EN 1992-1-1 Abs. 7.3.2',
        status: 'mandatory'
      },
      {
        id: 'ris-3',
        task: 'Einsatz betontechnologischer Maßnahmen zur Wärmeminderung',
        description: 'Verwendung von Zementen mit geringer Hydratationswärmeentwicklung (LH-Zemente) sowie niedrigen Bauteilbetonierungstemperaturen zur Verhinderung von Thermo-Rissen.',
        ref: 'DIN 1045-2 / DAfStb-Richtlinie Massige Bauteile aus Beton',
        status: 'recommended'
      }
    ]
  }
};

export default function DauerhaftigkeitChecklisten() {
  const [activeSubTab, setActiveSubTab] = useState<string>('expositionsklassen');
  const currentSection = INITIAL_CHECKLISTS[activeSubTab];

  return (
    <div className="space-y-4 container mx-auto px-4 max-w-7xl animate-in fade-in duration-300">
      
      {/* Header Info-Bereich */}
      <div className="bg-white text-text-main rounded-2xl p-6 border border-home-grau/30 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
          <ShieldAlert className="text-shiraz" /> Checklisten: Dauerhaftigkeit von Betontragwerken
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Sicherung der geforderten 50- oder 100-jährigen Nutzungsdauer von Tragkonstruktionen durch vorausschauende Expositionsklassen-, Betondeckungs- und Rissbreitenplanung nach DIN EN 1992, DIN EN 206 und DAfStb WU-Richtlinie.
          </p>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                badgeLabel = 'Gesetzlich verpflichtend';
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
                <strong>Untertemperatur beim Betonieren?</strong> Bei Bauteiltemperaturen unter +5°C verzögert sich der Festigkeitsaufbau drastisch, was die Nachbehandlungsfristen massiv erhöht.
              </p>
            </div>
            <div className="flex gap-1">
              <a 
                href="https://www.bmdv.bund.de/" 
                target="_blank" 
                rel="no-referrer"
                className="px-1.5 py-0.5 bg-white hover:bg-off-white border border-home-grau/20 text-text-main rounded font-bold flex items-center gap-0.5 transition-all cursor-pointer text-xs"
              >
                Instandsetzungs-Rili <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Module Footer Links */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Maßgebende Betonanforderungen bei mehreren Expositionsklassen"
        zielGleichung="(w/z)_{max} = \min_i (w/z)_i, \quad f_{ck} = \max_i f_{ck,i}, \quad z_{min} = \max_i z_i"
        schritte={[
          { titel: 'Klassen', erklaerung: 'Stützwand an einer gestreuten Straße: XC4, XD1 (Sprühnebel) und XF2 (mit Luftporen).', formel: '\\text{XC4: } 0{,}60 / \\text{C25/30} / 280 \\quad \\text{XD1: } 0{,}55 / \\text{C30/37} / 300' },
          { titel: 'Frostklasse', erklaerung: 'XF2 mit Luftporenbildner nach DIN 1045-2:', formel: '\\text{XF2 (LP): } 0{,}55 / \\text{C25/30} / 300' },
          { titel: 'Maßgebend', erklaerung: 'Jeweils die strengste Anforderung:', formel: 'w/z \\le 0{,}55, \\; \\text{C30/37}, \\; z \\ge 300\\,\\text{kg/m}^3, \\; \\text{LP-Beton}' }
        ]}
        ergebnisHinweis="Die Betondeckung richtet sich nach der Klasse mit der größten Anforderung (hier XD1: c_min,dur = 40 mm, c_nom = 55 mm). Werte nach DIN 1045-2, Tabellen F.2.1/F.2.2 – am Normtext der Ausgabe 2023-08 prüfen."
        normQuelle="DIN 1045-2:2023-08; DIN EN 206:2021-06"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Auswertung einer Betondeckungsmessung"
        zielGleichung="c_{0{,}05} = \bar{c} - 1{,}645 \cdot s"
        schritte={[
          { titel: 'Messung', erklaerung: 'Bewehrungsortung an 60 Messpunkten einer Außenwand (XD1): Mittelwert 47 mm, Standardabweichung 4,5 mm.', formel: '\\bar{c} = 47\\,\\text{mm}, \\quad s = 4{,}5\\,\\text{mm}' },
          { titel: '5-%-Quantil', erklaerung: 'Normalverteilung angenommen:', formel: 'c_{0{,}05} = 47 - 1{,}645 \\cdot 4{,}5 = 39{,}6\\,\\text{mm}' },
          { titel: 'Bewertung', erklaerung: 'Vergleich mit dem Mindestmaß c_min = 40 mm:', formel: '39{,}6 < 40 \\Rightarrow \\text{knapp unterschritten}' }
        ]}
        ergebnisHinweis="Eine knappe Unterschreitung des Mindestmaßes im 5-%-Quantil ist mit dem Tragwerksplaner zu bewerten (z. B. Oberflächenschutz, Instandhaltungsplanung). Das DBV-Merkblatt Betondeckung und Bewehrung beschreibt Mess- und Auswerteverfahren."
        normQuelle="DBV-Merkblatt Betondeckung und Bewehrung; DIN EN 1992-1-1 + NA, 4.4.1"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="dauerhaftigkeit_checklisten" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 10 Dauerhaftigkeit: Expositionsanforderungen, Rissbreiten, WU-Richtlinie und Referenzen geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Betondeckung', url: 'https://de.wikipedia.org/wiki/Betondeckung' },
          { title: 'Expositionsklasse', url: 'https://de.wikipedia.org/wiki/Expositionsklasse' },
          { title: 'Carbonatisierung (Beton)', url: 'https://de.wikipedia.org/wiki/Carbonatisierung_(Beton)' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA (Eurocode 2)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+1992' },
          { title: 'DAfStb-Richtlinie: Wasserundurchlässige Bauwerke aus Beton (WU-Richtlinie), Ausgabe 2017-12 (manuell prüfen)', url: 'https://www.dafstb.de/' },
          { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton – Festlegung und Konformität)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+206' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'DBV-Merkblatt Betondeckung und Bewehrung. Berlin: Deutscher Beton- und Bautechnik-Verein (aktuelle Fassung)'
        ]} 
        formeln={[
          {
            formel: 'c_{\\text{nom}} = \\max\\{c_{\\text{min,b}}; c_{\\text{min,dur}} + \\Delta c_{\\text{dur},\\gamma} - \\Delta c_{\\text{dur,st}} - \\Delta c_{\\text{dur,add}}; 10\\,\\text{mm}\\} + \\Delta c_{\\text{dev}}',
            erklaerung: 'Vollständige Bemessungsformel für das Nennmaß der Betondeckung cnom unter Berücksichtigung von Zusatzmaßnahmen und Vorhaltemaß.',
            quelle: 'DIN EN 1992-1-1 + NA, 4.4.1.2'
          },
          {
            formel: 'w_k \\le w_{k,\\text{zul}}(h_w / h)',
            erklaerung: 'Entwurfsgrundsatz Selbstheilung: Trennrisse sind zulässig, wenn die rechnerische Rissbreite den vom Druckgefälle h_w/h (Wasserdruckhöhe zu Bauteildicke) abhängigen Grenzwert der WU-Richtlinie einhält; Tabellenwerte am Originaltext prüfen.',
            quelle: 'DAfStb WU-Richtlinie'
          }
        ]}
      />

    </div>
  );
}
