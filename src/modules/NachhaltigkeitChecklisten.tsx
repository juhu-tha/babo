import React, { useState } from 'react';
import { 
  Building2, 
  Leaf, 
  Zap, 
  RefreshCw, 
  ExternalLink,
  ShieldAlert,
  ClipboardList
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

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
  planning: {
    id: 'planning',
    title: '1. Tragwerksplanung & Vorentwurf',
    description: 'Frühzeitige Weichenstellungen im Vorentwurf und in der Tragsystemoptimierung für ein kreislauffähiges und ressourcenschonendes Gebäude.',
    icon: Building2,
    items: [
      {
        id: 'plan_1',
        task: 'Tragwerks- und Querschnittsoptimierung',
        description: 'Wurde das statische System hinsichtlich minimaler Materialstärken optimiert? Z.B. flache Wandstärken, schlankere Deckenquerschnitte durch höherfeste Baustoffe oder Vorspannung zur Reduzierung des Beton- und Stahlvolumens.',
        ref: 'LNB & BNB',
        status: 'mandatory'
      },
      {
        id: 'plan_2',
        task: 'Klinkerarmut & Zementsubstitution',
        description: 'Erfolgt der Einsatz von CO₂-reduzierten Bindemitteln? Substitution von reinem Portlandzement (CEM I) durch hüttensand- oder puzzolanreiche Zemente (CEM II/B, CEM III/A oder CEM III/B) zur Einsparung von bis zu 60% der Klinkeremissionen.',
        ref: 'DIN EN 197-1/-5, EPD bzw. ÖKOBAUDAT',
        status: 'critical'
      },
      {
        id: 'plan_3',
        task: 'Integration Nachwachsender Rohstoffe (NaWaRo)',
        description: 'Prüfung, ob nicht-tragende Innenwände, Dämmebenen, Deckenbekleidungen oder auch tragende Rahmenbauteile in Holz, Holzwerkstoffen, Stroh-, Lehm- oder Hanfprodukten ausgeführt werden können, um biogenen Kohlenstoff einzulagern.',
        ref: 'QNG-Anforderungen / KfW 40',
        status: 'mandatory'
      },
      {
        id: 'plan_4',
        task: 'Rückbaufreundliche Fügung (Design for Disassembly)',
        description: 'Sind Verbindungspunkte mechanisch lösbar geplant? Vermeidung von vollflächig verklebten Schichten im Ausbau (z.B. geklebte Parkette, Vermeidung vollflächig verklebter Schichten im Ausbau (z. B. geklebtes Parkett). Besser: schwimmend verlegte Beläge, Estriche auf Trennlage, mechanisch montierte Trockenbausysteme statt nasser Putze. anstelle nasser Putze).',
        ref: 'DIN EN ISO 20887',
        status: 'recommended'
      }
    ]
  },
  chemistry: {
    id: 'chemistry',
    title: '2. Bauchemie & Schadstoffvermeidung',
    description: 'Vorgabe emissionsarmer Bauprodukte und konsequenter Ausschluss kritischer Inhaltsstoffe gemäß dem QNG-Steckbrief 313.',
    icon: Leaf,
    items: [
      {
        id: 'ausschreibung_1',
        task: 'Qualitätsstufe 4 für Innenwandbeschichtungen',
        description: 'Werden für Innenwandbeschichtungen (Farben, Lasuren, Grundierungen) ausschließlich Produkte mit extrem niedrigen VOC-Gehalten nach QS4 (z.B. ausschließlich emissionsarme Produkte (z. B. Blauer Engel DE-UZ 102 für Innenwandfarben) gemäß QNG-Anlage 3.1.3 vorgegeben?) vorgegeben?',
        ref: 'QNG Steckbrief 313 Anhang 1',
        status: 'critical'
      },
      {
        id: 'ausschreibung_2',
        task: 'Ausschluss halogenierter Treibmittel in Dämmstoffen',
        description: 'Wird in der Leistungsbeschreibung garantiert, dass Schaumdämmstoffe (XPS, PU-Ortschäume) ohne halogenierte Treibmittel (insbesondere HFKW) hergestellt werden? hergestellt werden? Bevorzugung von CO₂-, luft- oder wassergetriebenen Schäumen.',
        ref: 'QNG Steckbrief 313 Anhang 3',
        status: 'critical'
      },
      {
        id: 'ausschreibung_3',
        task: 'Schadstoffarme Klebstoffe & Dichtstoffe',
        description: 'Einsatz von schadstofffreien, weichmacher- und lösemittelfreien elastischen Dichtstoffen an Fenstern, Fassaden und im Sanitärbereich gemäß den anspruchsvollen Bedingungen von DGNB/QNG Qualitätsstufe 3 oder 4.',
        ref: 'QNG Steckbrief 313',
        status: 'mandatory'
      },
      {
        id: 'ausschreibung_4',
        task: 'Formaldehydklassen im Innenausbau',
        description: 'Wird spezifiziert, dass Holzwerkstoffe (OSB-, Span- und Faserplatten) im Innenbereich die strengen Anforderungen der Halbierten E1-Grenzwerte (≤ 0.05 ppm Luftkonzentration) belegen?',
        ref: 'DIN EN 16516 / ChemVerbotsV',
        status: 'mandatory'
      }
    ]
  },
  operation: {
    id: 'operation',
    title: '3. Energie, Technik & Betrieb',
    description: 'Systemische Optimierung der Bauphysik und Anlagentechnik zur langfristigen CO₂-Emissionsbegrenzung im Betrieb.',
    icon: Zap,
    items: [
      {
        id: 'betrieb_1',
        task: 'Systemische Optimierung der Gebäudehülle',
        description: 'Erzielen alle Außenbauteile hervorragende U-Werte, die die gesetzlichen Standards des Gebäudemodernisierungsgesetzes (GModG, in Kraft seit 29.07.2026, vormals GEG) um mindestens 45% unterbieten? Dies ist der bauphysikalische Kern zur Erlangung des energetischen "KfW Effizienzhaus 40"-Niveaus.',
        ref: 'GModG (vormals GEG) / KfW 40',
        status: 'mandatory'
      },
      {
        id: 'betrieb_2',
        task: 'Fossilfreie, hocheffiziente Wärmeversorgung',
        description: 'Wurden Verbrennungsheizungen (Gas/Öl/Biomasse) komplett ausgeschlossen? Stattdessen Auslegung einer geothermischen oder luftbasierten Wärmepumpe mit hoher Jahresarbeitszahl (JAZ ≥ 4,0) oder Anschluss an kalte Nahwärmenetze.',
        ref: 'GModG (vormals GEG) / BEG-Förderung',
        status: 'critical'
      },
      {
        id: 'betrieb_3',
        task: 'Lüftungsanlage mit hocheffektiver Wärmerückgewinnung',
        description: 'Ist eine kontrollierte mechanische Be- und Entlüftungsanlage mit einem zertifizierten Wärmebereitstellungsgrad von mindestens 85% zur Minimierung der Lüftungswärmeverluste projektiert?',
        ref: 'DIN EN 13141 / Passivhaus',
        status: 'mandatory'
      },
      {
        id: 'betrieb_4',
        task: 'PV-Großanlage & Batteriespeicher-Kombination',
        description: 'Ermittlung des theoretischen Stromertrags zur Deckung des Hilfs- und Betriebsstrombedarfs. Auslegung der PV-Module auf allen geeigneten Dach- und ggf. Fassadenflächen kombiniert mit anforderungsgerechter Batteriespeichergröße.',
        ref: 'DIN V 18599 / QNG',
        status: 'mandatory'
      }
    ]
  },
  circularity: {
    id: 'circularity',
    title: '4. Rückbau & Kreislaufwirtschaft',
    description: 'Konsequente Ausrichtung auf Ressourcenschonung, Sekundärbaustoffe und die spätere Recyclingfähigkeit.',
    icon: RefreshCw,
    items: [
      {
        id: 'kreislauf_1',
        task: 'BIM-basierter Circularity-Materialpass',
        description: 'Wurde im Zuge der Bauplanung ein digitaler Gebäudematerialpass (z. B. Madaster oder vordefinierter BIM-Export) angelegt? Dieser dokumentiert detailliert Schichtaufbauten, Massen, EPD-Referenzen und sortenreine Entsorgungswege.',
        ref: 'Gebäuderessourcenpass / Materialpass (Produktdaten aus dem Digitalen Produktpass, DPP)',
        status: 'recommended'
      },
      {
        id: 'kreislauf_2',
        task: 'Einsatz von Recycling-Beton (R-Beton)',
        description: 'Werden für die Bauteile der Gründungen, Sohlplatten oder Decken qualitätsgesicherte R-Betone (Typ 1 oder Typ 2 nach DAfStb-Richtlinie) mit mindestens 25 M.-% Gesteinskörnung-Substitut durch Rezyklate ausgeschrieben?',
        ref: 'DAfStb-Richtlinie',
        status: 'mandatory'
      },
      {
        id: 'kreislauf_3',
        task: 'Sortenreine Trennbarkeit an WDVS-Fassaden',
        description: 'Befürwortung mechanisch verdübelter Dämmsysteme, hinterlüfteter Fassadenstrukturen oder mineralischer Wärmedämmputze, um die unlösbare Verklebung monolithischer Dämmungen mit der Tragwand zu umgehen.',
        ref: 'VDI 6205 / Rückbaubarkeit',
        status: 'mandatory'
      },
      {
        id: 'kreislauf_4',
        task: 'Mineralische Ersatzbaustoffe & EBV-Konformität',
        description: 'Werden anfallende mineralische Baustoffe oder RC-Baustoffe im Tiefbau, Gründungs- oder Straßenbau gemäß der Ersatzbaustoffverordnung (EBV, seit 01.08.2023) gemäß der Ersatzbaustoffverordnung (EBV, seit 01.08.2023) mit Güteüberwachung und unter Einhaltung der Materialwerte nach Anlage 1 EBV (Materialklassen, z. B. RC-1 bis RC-3) eingesetzt? eingesetzt?',
        ref: 'Ersatzbaustoffverordnung (EBV)',
        status: 'mandatory'
      }
    ]
  }
};

export default function NachhaltigkeitChecklisten() {
  const [activeSubTab, setActiveSubTab] = useState<string>('planning');
  const currentSection = INITIAL_CHECKLISTS[activeSubTab];

  return (
    <div className="space-y-4 container mx-auto px-4 max-w-7xl animate-in fade-in duration-300">
      
      {/* Header Info-Bereich */}
      <div className="bg-white text-text-main rounded-2xl p-6 border border-home-grau/30 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
          <Leaf className="text-shiraz" /> Checklisten: Nachhaltiges Bauen &amp; QNG
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Stufenweise Qualitätssicherung zur Erreichung anspruchsvoller Gebäudeauszeichnungen (z.B. DGNB, QNG Steckbrief 313, LNB) und zur Optimierung der Kreislauffähigkeit und Schadstoffvermeidung.
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
                badgeStyle = 'bg-rose-50/50 text-shiraz border-rose-100/40';
                badgeLabel = 'Kritisch / Veto-Punkt';
              } else if (item.status === 'mandatory') {
                borderStyle = 'border-home-grau/20 border-l-2 border-l-amber-500/80';
                badgeStyle = 'bg-amber-50/50 text-amber-700 border-amber-100/40';
                badgeLabel = 'Hohe Relevanz';
              } else {
                borderStyle = 'border-home-grau/20 border-l-2 border-l-emerald-500/80';
                badgeStyle = 'bg-emerald-50/50 text-emerald-700 border-emerald-100/40';
                badgeLabel = 'Präzisierung / Empfohlen';
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

                  {/* Prüfgrundlage */}
                  <div className="flex sm:flex-col justify-between items-end gap-1 text-xs font-mono tracking-tight sm:border-l sm:border-home-grau/10 sm:pl-3 shrink-0 pt-1.5 sm:pt-0">
                    <div className="text-left sm:text-right font-light">
                      <span className="text-home-grau/65 font-bold block text-xs uppercase tracking-wider">Prüfgrundlage</span>
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
                Diese Checklisten dienen als praxisorientierte Planungshilfe für das Erreichen anspruchsvoller Gebäudeauszeichnungen (z. B. DGNB Gold/Platin oder das staatliche QNG).
              </p>
            </div>
            <div className="flex gap-1">
              <a 
                href="https://www.nachhaltigesbauen.de" 
                target="_blank" 
                rel="no-referrer"
                className="px-1.5 py-0.5 bg-white hover:bg-off-white border border-home-grau/20 text-text-main rounded font-bold flex items-center gap-0.5 transition-all cursor-pointer text-xs"
              >
                LNB Portal <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Module Footer Links */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Nachhaltiges Bauen', url: 'https://de.wikipedia.org/wiki/Nachhaltiges_Bauen' },
          { title: 'Gebäudeenergiegesetz', url: 'https://de.wikipedia.org/wiki/Geb%C3%A4deenergiegesetz' },
          { title: 'Kreislaufwirtschaft', url: 'https://de.wikipedia.org/wiki/Kreislaufwirtschaft' },
          { title: 'Graue Energie', url: 'https://de.wikipedia.org/wiki/Graue_Energie' }
        ]}
        regelwerke={[
          { title: 'QNG Handbuch: Qualitätssiegel Nachhaltiges Gebäude', url: 'https://www.qng.info/' },
          { title: 'Leitfaden Nachhaltiges Bauen (LNB - BMWSB)', url: 'https://www.nachhaltigesbauen.de/' },
          { title: 'Ersatzbaustoffverordnung (EBV 2023)', url: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/' },
          { title: 'Gebäudemodernisierungsgesetz (GModG, in Kraft seit 29.07.2026, vormals GEG)', url: 'https://www.gesetze-im-internet.de/geg/' }
        ]}
        literatur={[
          'BMWSB: Nachhaltiges Bauen – Leitfaden für Bundesbauten',
          'DGNB Handbuch für nachhaltiges Bauen (Deutsche Gesellschaft für Nachhaltiges Bauen e.V.)',
          'Hegger, M. et al.: Baustoff-Atlas (Detail Verlag)'
        ]} 
        formeln={[
          {
            formel: 'MCI = 1 - LFI \\cdot F(X) \\in [0; 1] \\quad (\\text{Material Circularity Index})',
            erklaerung: 'Material-Zirkularitätsindex der Ellen MacArthur Foundation zur quantitativen Bewertung des Rezyklatanteils und der Recyclingfähigkeit eines Bauteils.',
            quelle: 'Ellen MacArthur Foundation / DGNB'
          },
          {
            formel: 'Q_P = \\left(Q_h + Q_{tw}\\right) \\cdot f_p \\le Q_{P,\\text{zul}} \\quad [\\text{kWh/(m}^2\\cdot\\text{a)}]',
            /* TODO: GModG Umnummerierung */ erklaerung: 'Jahres-Primärenergiebedarf eines Gebäudes nach dem Gebäudemodernisierungsgesetz (GModG, in Kraft seit 29.07.2026, vormals GEG § 15) aus Heizwärme- und Warmwasserbedarf mit Primärenergiefaktor fp.',
            /* TODO: GModG Umnummerierung */ quelle: 'GModG (vormals GEG § 15) / DIN V 18599'
          }
        ]}
      />

    </div>
  );
}
