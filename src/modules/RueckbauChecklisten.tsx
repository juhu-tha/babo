import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Recycle, 
  Database,
  Building, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

// Define structures for checklists
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
  rueckbau: {
    id: 'rueckbau',
    title: '1. Rückbau, Abbruch & Urban Mining',
    description: 'Systematische Planung und Umsetzung eines selektiven Rückbaus nach VDI 6210 Blatt 1 und VDI 6202 Blatt 1 zur sortenreinen Stoffstromtrennung.',
    icon: Building,
    items: [
      {
        id: 'rb-1',
        task: 'Pre-Demolition-Audit & Schadstofferkundung veranlassen',
        description: 'Beauftragung eines qualifizierten Baugutachters zur historischen Recherche und visuellen/chemischen Schadstofferfassung im gesamten Gebäude vor Planungsbeginn.',
        ref: '§ 5a GefStoffV, TRGS 519/524, VDI 6202 Blatt 1',
        status: 'critical'
      },
      {
        id: 'rb-2',
        task: 'Schadstoff- und Bauteilkataster erstellen',
        description: 'Lückenloses Verzeichnis aller verbauten Materialien, Massenabschätzungen, Gefahrstoffe (Asbest, KMF, PCB etc.) inkl. lokaler Lage und Entsorgungswege.',
        ref: 'VDI 6202 Blatt 1; DIN SPEC 91484',
        status: 'critical'
      },
      {
        id: 'rb-3',
        task: 'Abbruchgenehmigung & statisches Rückbaukonzept prüfen',
        description: 'Statische Voruntersuchungen zur Standsicherheit während des Abbruchs (Sicherung von Nachbargebäuden, Deckenlasten für Kleingeräte). Verfahrensrechtliche Voraussetzungen des Abbruchs klären.',
        ref: 'Landesbauordnung (LBO)',
        status: 'mandatory'
      },
      {
        id: 'rb-4',
        task: 'Entkernungskette definieren (Sortenreiner Ausbau)',
        description: 'Planung des selektiven Rückbaus von innen nach außen: Erst Schadstoffe sanieren, dann nicht-mineralische Störstoffe (Holz, Kunststoffe, Metalle, Gips) vollständig ausbauen, bevor die mineralische Hauptstruktur mechanisch abgebrochen wird.',
        ref: 'Gewerbeabfallverordnung (GewAbfV) § 8',
        status: 'mandatory'
      },
      {
        id: 'rb-5',
        task: 'Erfassung recycelbarer Bauteile für Re-Use (Urban Mining)',
        description: 'Sicherung erhaltenswerter Bauteile (z.B. historische Türen, intakte Balken, Ziegelsteine) für den lokalen Bauteilkreislauf vor Beginn des maschinellen Abbruchs.',
        ref: 'KrWG § 6 (Abfallhierarchie: Vorbereitung zur Wiederverwendung)',
        status: 'recommended'
      },
      {
        id: 'rb-6',
        task: 'Verwertungsbericht & Massenbilanz für Behörden erstellen',
        description: 'Nach Abschluss der Arbeiten: Dokumentation der tatsächlichen Entsorgungs- und Recyclingwege aller Fraktionen mitsamt stofflicher Massenbilanz und Wiegescheinen.',
        ref: 'Landesbauordnung / Untere Abfallbehörde',
        status: 'recommended'
      }
    ]
  },
  aufbereitung: {
    id: 'aufbereitung',
    title: '2. Boden- & Materialaufbereitung',
    description: 'Voraussetzungen für die sichere mechanische Aufbereitung von Bauschutt vor Ort sowie Aufbereitung von kontaminierten Böden.',
    icon: Recycle,
    items: [
      {
        id: 'ap-1',
        task: 'Anzeigepflicht & Genehmigung für mobile Aufbereitungsanlagen (BImSchG)',
        description: 'Abstimmung des Einsatzes der mobilen Brech- und Siebanlage mit der zuständigen Behörde. Wird die Anlage länger als zwölf Monate am selben Ort betrieben, ist sie nach BImSchG genehmigungsbedürftig.',
        ref: 'BImSchG / 4. BImSchV Anhang 1 Nr. 8.11.2.4 (Behandlung nicht gefährlicher Abfälle) bzw. Nr. 2.2 (Brechen von Gestein)',
        status: 'critical'
      },
      {
        id: 'ap-2',
        task: 'Technische Maßnahmen zur Staub- & Lärmminderung umsetzen',
        description: 'Installation von Wasserbedüsungssystemen an den Übergabestellen der Brecher, Kapselung sensibler Anlagenteile, Einrichten von Lärmschutzwänden zu benachbarten Wohngebieten.',
        ref: 'TA Lärm / TA Luft / DGUV-Regel 101-004',
        status: 'mandatory'
      },
      {
        id: 'ap-3',
        task: 'Störstoffauslese vor der mechanischen Bauschuttaufbereitung',
        description: 'Vorschaltung einer Handauslese (Leseband) oder Überbandmagnetabscheider, um Gipsputz, Holzsplitter, Kunststoffe und Bewehrungseisen vor dem Brechen vollständig zu entfernen.',
        ref: 'Ersatzbaustoffverordnung (EBV) / Güteüberwachung',
        status: 'mandatory'
      },
      {
        id: 'ap-4',
        task: 'Güteüberwachung & werkseigene Produktionskontrolle (WPK) absichern',
        description: 'Verpflichtende Erstprüfung und regelmäßige Fremdüberwachung der aufbereiteten Recyclingbaustoffe durch ein anerkanntes Prüfinstitut zur Erlangung des Gütezeichens (z.B. QUBA, QRB).',
        ref: 'Ersatzbaustoffverordnung (EBV), Abschnitt Güteüberwachung',
        status: 'mandatory'
      },
      {
        id: 'ap-5',
        task: 'Bodensanierung auf Eignung zur mikrobiellen oder thermischen Behandlung prüfen',
        description: 'Bei kontaminierten Erdaushubmassen: Bewertung der Schadstoffart (z.B. biologisch abbaubare KW gegen thermisch zu reinigende Schwermetalle) und Festlegung des Sanierungsverfahrens.',
        ref: 'BBodSchG / BBodSchV',
        status: 'mandatory'
      },
      {
        id: 'ap-6',
        task: 'Ersatzbaustoff-Einbauklassen gem. hydrogeologischer Bedingungen prüfen',
        description: 'Abgleich des aufbereiteten Materials (z.B. RC-1 oder BM-0) mit dem lokalen Grundwasserstand (HGW) und Schutzgebieten, um illegale Schadstoffeinträge in den Untergrund zu verhindern.',
        ref: 'ErsatzbaustoffV §§ 19, 20 und Anlage 2',
        status: 'critical'
      }
    ]
  },
  abfallrecht: {
    id: 'abfallrecht',
    title: '3. Abfallwirtschaft, Recht & Deponierung',
    description: 'Gesetzeskonforme Einstufung, Transportüberwachung (eANV) und Zuweisung auf deponietechnische Anlagen.',
    icon: Database,
    items: [
      {
        id: 'ar-1',
        task: 'Erstzuordnung nach AVV-Schlüssel (Kapitel 17)',
        description: 'Einstufung des Abfalls anhand seiner Entstehungsgeschichte. Kennzeichnung gefährlicher Abfälle mit dem Sternchen-Symbol (*) (z. B. 17 05 03* vs 17 05 04).',
        ref: 'Abfallverzeichnis-Verordnung (AVV) Kap. 17',
        status: 'critical'
      },
      {
        id: 'ar-2',
        task: 'Repräsentative Haufwerksbeprobung nach LAGA PN 98',
        description: 'Durchführung der Beprobung durch Gutachter mit Fachkunde nach LAGA PN 98. Festlegung der Anzahl an Einzelproben (EP) und Mischproben (MP) anhand der Haufwerksgröße.',
        ref: 'LAGA PN 98 / DIN 19698-1',
        status: 'critical'
      },
      {
        id: 'ar-3',
        task: 'Gewerbeabfallverordnung-Getrennthaltungspflicht erfüllen',
        description: 'Strikte Trennung von mineralischen Bauabfällen, Holz, Glas, Kunststoffen, Metallen und Gips an der Anfallstelle. Dokumentation bei Abweichungen (technische Unmöglichkeit o.ä.).',
        ref: 'GewAbfV § 8',
        status: 'mandatory'
      },
      {
        id: 'ar-4',
        task: 'Elektronisches Abfallnachweisverfahren (eANV) nutzen',
        description: 'Einholen von behördlichen Erzeugernummern, Abschluss von Entsorgungsnachweisen mitsamt elektronischen Begleit- und Übernahmescheinen vor Abtransport gefährlicher Stoffe.',
        ref: 'Nachweisverordnung (NachwV)',
        status: 'critical'
      },
      {
        id: 'ar-5',
        task: 'Grundlegende Charakterisierung gem. § 8 DepV erstellen',
        description: 'Ausfüllen des Charakterisierungsbogens durch den Erzeuger unter Angabe der Abfallherkunft, Probenahme und Zuordnungsanalytik (TOC, Glühverlust, Eluatwerte).',
        ref: 'Deponieverordnung (DepV) § 8',
        status: 'mandatory'
      },
      {
        id: 'ar-6',
        task: 'Zuordnung zu den Deponieklassen (DK 0 bis DK III) verifizieren',
        description: 'Abgleich des Schadstoffinventars mit den Grenzwerten der DepV Anhang 3 Tabelle 2 (Inertstoffdeponie DK 0 bis hin zur Sonderabfalldeponie DK III).',
        ref: 'DepV Anhang 3 Tabelle 2',
        status: 'mandatory'
      }
    ]
  },
  gefahrstoffe: {
    id: 'gefahrstoffe',
    title: '4. Schadstoffe, Gefahrstoffe & Arbeitsschutz',
    description: 'Sicherheits- und Gesundheitsschutz beim Umgang mit hochtoxischen Substanzen wie Asbest, KMF, PCB und teerhaltigen Massen.',
    icon: AlertTriangle,
    items: [
      {
        id: 'gs-1',
        task: 'Umgang mit Asbest: Sachkunde und Arbeitsanzeige sicherstellen',
        description: 'Arbeiten an Asbest dürfen nur durch Firmen mit Sachkunde nach TRGS 519 durchgeführt werden. Gefährdungsbeurteilung und Anzeige an die zuständige Behörde mindestens eine Woche vor Beginn der Tätigkeiten (§ 11a GefStoffV); Tätigkeiten mit hohem Risiko nur mit behördlicher Zulassung.',
        ref: 'Gefahrstoffverordnung (GefStoffV) / TRGS 519',
        status: 'critical'
      },
      {
        id: 'gs-2',
        task: 'Künstliche Mineralfasern (KMF) bewerten (Staubarmes Arbeiten)',
        description: 'Prüfung, ob alte (vor dem 1. Juni 2000 eingebaute, biopersistente) Mineralwolle vorliegt. Einhaltung der TRGS 521. Befeuchtung, staubdichter Ausbau, Verbot von Reiß- und Schredderverfahren ohne Absaugung.',
        ref: 'TRGS 521 (Neufassung 2026)',
        status: 'mandatory'
      },
      {
        id: 'gs-3',
        task: 'Persönliche Schutzausrüstung (PSA) vorschreiben und kontrollieren',
        description: 'Bereitstellung partikelfiltrierender Halbmasken (FFP3 oder gebläseunterstützt), flüssigkeits- und staubdichter Einwegschutzanzüge (Typ 5/6, z. B. Tyvek), Schutzhandschuhe und dichte Brillen.',
        ref: 'TRGS 519 / 521 / DGUV-Regel 101-004',
        status: 'critical'
      },
      {
        id: 'gs-4',
        task: 'Einrichten von Schwarz-Weiß-Schleusen & Unterdruckbereichen',
        description: 'Bautechnische Kapselung der Sanierungsbereiche. Aufbau von Mehrkammerbegehungsschleusen (Staubkabine - Duschkabine - Sauberkabine) und Installation von Unterdrucklüftungsgeräten (UDA).',
        ref: 'TRGS 519 / TRGS 524',
        status: 'mandatory'
      },
      {
        id: 'gs-5',
        task: 'Fachliche Weisungsbefugnis & SiGeKo bestellen nach BaustellV',
        description: 'Bestellung eines Sicherheits- und Gesundheitsschutzkoordinators (SiGeKo) bei komplexen Schadstoffsanierungsprojekten mit mehreren Gewerken. Erstellung eines schriftlichen SiGe-Plans.',
        ref: 'Baustellenverordnung (BaustellV) § 3',
        status: 'mandatory'
      },
      {
        id: 'gs-6',
        task: 'Staubdichte Verpackung und Kennzeichnung gefährlicher Abfälle',
        description: 'Asbestzementplatten und Faserstäube sind unmittelbar am Entstehungsort in staubdichte Big-Bags oder Platten-Bags mit offiziellem Asbest-Warnhinweis ("a"-Symbol) abzufüllen.',
        ref: 'TRGS 519 (Abfallentsorgung) / GefStoffV',
        status: 'critical'
      }
    ]
  }
};

export default function RueckbauChecklisten() {
  const [activeSubTab, setActiveSubTab] = useState<string>('rueckbau');
  const currentSection = INITIAL_CHECKLISTS[activeSubTab];

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-300">
      
      {/* Header Info-Bereich */}
      <div className="bg-white text-text-main rounded-2xl p-6 border border-home-grau/30 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
          <Recycle className="text-shiraz" /> Checklisten: Rückbau &amp; Schadstoffsanierung
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Rechtskonforme Handlungsleitfäden für Ingenieure und Bauleiter nach aktuellen deutschen Regelwerken (<span className="text-text-main font-semibold font-mono">BImSchG, KrWG, GewAbfV, EBV, DepV, TRGS 519/521/524</span>).
          </p>
        </div>
      </div>

      {/* Sub-Tabs Selector (Button wieder highlighted mit shiraz) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {Object.values(INITIAL_CHECKLISTS).map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSubTab === sec.id;

          return (
            <button aria-pressed={isActive}
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
              // Determine subtle layout border styling based on status
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

                  {/* Rechtsgrundlage Link / Text */}
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
                Gefahrstoffe auf Sanierungsbaustellen verlangen die strikte Beachtung der TRGS 519 (Asbest).
              </p>
            </div>
            <div className="flex gap-1">
              <a 
                href="https://www.gesetze-im-internet.de/gefstoffv_2010/index.html" 
                target="_blank" 
                rel="no-referrer"
                className="px-1.5 py-0.5 bg-white hover:bg-off-white border border-home-grau/20 text-text-main rounded font-bold flex items-center gap-0.5 transition-all cursor-pointer text-xs"
              >
                GefStoffV <ExternalLink size={10} />
              </a>
              <a 
                href="https://www.gesetze-im-internet.de/ebv/index.html" 
                target="_blank" 
                rel="no-referrer"
                className="px-1.5 py-0.5 bg-white hover:bg-off-white border border-home-grau/20 text-text-main rounded font-bold flex items-center gap-0.5 transition-all cursor-pointer text-xs"
              >
                EBV <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Module Footer Links */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Probenanzahl für ein Haufwerk von 850 m³ nach LAGA PN 98"
        zielGleichung="n_{MP} = 10 + \left\lceil \frac{V - 600}{100} \right\rceil, \quad n_{EP} = 4 \cdot n_{MP}, \quad n_{LP} = 10 + \left\lceil \frac{V - 600}{300} \right\rceil"
        schritte={[
          { titel: 'Mischproben', erklaerung: 'Oberhalb von 600 m³ je angefangene 100 m³ eine weitere Mischprobe:', formel: 'n_{MP} = 10 + \\lceil 2{,}5 \\rceil = 13' },
          { titel: 'Einzelproben', erklaerung: 'Eine Mischprobe besteht in der Regel aus vier Einzelproben:', formel: 'n_{EP} = 4 \\cdot 13 = 52' },
          { titel: 'Laborproben', erklaerung: 'Je angefangene 300 m³ oberhalb 600 m³ eine weitere Laborprobe:', formel: 'n_{LP} = 10 + \\lceil 0{,}83 \\rceil = 11' }
        ]}
        ergebnisHinweis="Die Werte entsprechen Tabelle 2 der LAGA PN 98 (bis 900 m³: 52 EP, 13 MP, 11 LP). Ab 700 m³ dürfen bei gleichbleibender Beschaffenheit je drei Mischproben zu einer Sammelprobe vereinigt werden."
        normQuelle="LAGA PN 98 (Mitteilung 32), Tabelle 2"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Verpackung von Asbestzement-Wellplatten"
        zielGleichung="n_{Bag} = \left\lceil \frac{A \cdot g}{m_{Bag}} \right\rceil"
        schritte={[
          { titel: 'Masse', erklaerung: 'Dachfläche 450 m², flächenbezogene Masse der Wellplatten ca. 18 kg/m² (Lehrwert):', formel: 'm = 450 \\cdot 18 = 8\\,100\\,\\text{kg}' },
          { titel: 'Verpackung', erklaerung: 'Platten-Bags mit zulässiger Nutzlast 1,5 t:', formel: 'n_{Bag} = \\lceil 8\\,100 / 1\\,500 \\rceil = \\lceil 5{,}4 \\rceil = 6' },
          { titel: 'Entsorgung', erklaerung: 'Abfallschlüssel und Nachweis:', formel: '17\\,06\\,05^{*} \\Rightarrow \\text{gefährlicher Abfall, eANV}' }
        ]}
        ergebnisHinweis="Platten unzerstört aufnehmen, nicht brechen oder werfen, staubdicht verpacken und mit dem Asbest-Kennzeichen versehen. Die Arbeiten sind mindestens eine Woche vorher anzuzeigen."
        normQuelle="GefStoffV § 11a; TRGS 519; AVV"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="rueckbau_checklisten" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 9 Rückbau & Schadstoffe: Checklisten-Referenzen, GefStoffV § 11a, BImSchV und PN 98 geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Abbruch (Bauwesen)', url: 'https://de.wikipedia.org/wiki/Abbruch_(Bauwesen)' },
          { title: 'Asbestsanierung', url: 'https://de.wikipedia.org/wiki/Asbestsanierung' },
          { title: 'Ersatzbaustoffverordnung', url: 'https://de.wikipedia.org/wiki/Ersatzbaustoffverordnung' },
          { title: 'Kreislaufwirtschaftsgesetz', url: 'https://de.wikipedia.org/wiki/Kreislaufwirtschaftsgesetz' }
        ]}
        regelwerke={[
          { title: 'Ersatzbaustoffverordnung (ErsatzbaustoffV 2023)', url: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/' },
          { title: 'Kreislaufwirtschaftsgesetz (KrWG § 14 Quoten)', url: 'https://www.gesetze-im-internet.de/krwg/' },
          { title: 'Gefahrstoffverordnung (GefStoffV)', url: 'https://www.gesetze-im-internet.de/gefstoffv_2010/' },
          { title: 'TRGS 519 (Asbest), zuletzt geändert 28.01.2025', url: 'https://www.baua.de/DE/Angebote/Regelwerk/TRGS/TRGS-519' },
          { title: 'Gewerbeabfallverordnung (GewAbfV), §§ 8, 9', url: 'https://www.gesetze-im-internet.de/gewabfv_2017/' }
        ]}
        literatur={[
          'Deutscher Abbruchverband e.V. (DA): Leitfaden Schadstoffsanierung und selektiver Rückbau',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]} 
        formeln={[
          {
            formel: 'Q_{\\text{Verwertung}} = \\frac{m_{\\text{Recycling}} + m_{\\text{Wiederverwendung}}}{m_{\\text{Abbruch gesamt}}} \\ge 70\\% \\quad (\\text{KrWG-Zielwert})',
            erklaerung: 'Verwertungsquote = (Vorbereitung zur Wiederverwendung + Recycling + sonstige stoffliche Verwertung) / Abfallmasse gesamt. Orientierung: nationales Ziel nach § 14 Abs. 3 KrWG mindestens 70 Gew.-% für nicht gefährliche Bau- und Abbruchabfälle (ohne Boden und Steine), keine projektbezogene Pflichtquote.',
            quelle: 'KrWG § 14 Abs. 3'
          },
          {
            formel: 'c_{\\text{Misch}} = \\frac{\\sum m_i \\cdot c_i}{\\sum m_i} \\le \\text{MEB (Materialwerte ErsatzbaustoffV)}',
            erklaerung: 'Eluat- und Feststoffkonzentration bei der Einstufung von mineralischen Ersatzbaustoffen (RC-1, RC-2, RC-3) in Einbauklassen nach ErsatzbaustoffV.',
            quelle: 'ErsatzbaustoffV Anlage 1'
          }
        ]}
      />

    </div>
  );
}
