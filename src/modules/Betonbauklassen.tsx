import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Layers, 
  Info, 
  CheckCircle2, 
  RefreshCw, 
  Users, 
  ClipboardList, 
  ChevronRight, 
  Settings, 
  CheckCircle,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

interface BauteilTemplate {
  id: string;
  name: string;
  bbqClass: 'BBQ-N' | 'BBQ-E' | 'BBQ-S' | 'BBQ-U';
  ueberwachungsklasse: 'ÜK 1' | 'ÜK 2' | 'ÜK 3';
  description: string;
  dangerLevel: string;
  phases: {
    planning: {
      action: string;
      responsible: string;
      normDetail: string;
      tip: string;
    };
    concept: {
      action: string;
      responsible: string;
      normDetail: string;
      tip: string;
    };
    kooperation: {
      action: string;
      responsible: string;
      normDetail: string;
      tip: string;
    };
    execution: {
      action: string;
      responsible: string;
      normDetail: string;
      tip: string;
    };
    curing: {
      action: string;
      responsible: string;
      normDetail: string;
      tip: string;
    };
  };
}

const BAUTEIL_TEMPLATES: BauteilTemplate[] = [
  {
    id: 'weisse_wanne',
    name: 'WU-Bodenplatte (Weiße Wanne)',
    bbqClass: 'BBQ-E',
    ueberwachungsklasse: 'ÜK 2',
    description: 'Bodenplatte eines Mehrfamilienhaus-Kellers gegen drückendes Grundwasser nach der WU-Richtlinie. Rissbreitenschränkung steht im Vordergrund.',
    dangerLevel: 'Mittel-Erhöht (Dichtigkeitsrisiko)',
    phases: {
      planning: {
        action: 'Festlegung von BBQ-E im Standsicherheitsnachweis. Vorgabe der Expositionsklassen (XC2, XF1, WF) sowie des rechnerischen Grenzwerts der Rissbreite w_max ≤ 0,2 mm zur Erfüllung der Dichtigkeit.',
        responsible: 'Tragwerksplaner (Statiker)',
        normDetail: 'Nach DIN 1045-1000 muss BBQ-E bei WU-Bauteilen von vornherein im Entwurfsprüfbogen ausgewiesen werden.',
        tip: 'Vermeiden Sie widersprüchliche Angaben im LV bezüglich Festigkeitsklassen und w/z-Wert-Limits.'
      },
      concept: {
        action: 'Formulierung eines detaillierten Betonkonzepts durch das Lieferwerk. Auswahl von Zementen mit langsamer Wärmeentwicklung (NW/LH-Zemente) zur Verringerung thermischer Zwangsspannungen.',
        responsible: 'Hersteller (Technologe des Zement-/Betonwerks)',
        normDetail: 'Eignungsnachweis nach DIN EN 206 für langsame Festigkeitsentwicklung nach 56 oder 90 Tagen (statt 28 Tagen).',
        tip: 'Eine Festigkeitsentwicklung über 56 Tage spart Zementfeinheit, reduziert Hitze und verringert Schwindrisse signifikant!'
      },
      kooperation: {
        action: 'Förmliche Durchführung des BBQ-Kooperationsgesprächs vor Betonierbeginn. Dokumentation der Lieferraten (z.B. 40 m³/h konstant), der Pumpenstandorte und der fugenlosen Taktplanung.',
        responsible: 'BBQ-Koordinator, Bauleiter, Werkstechniker',
        normDetail: 'Das Protokoll des Kooperationsgesprächs ist integraler Bestandteil der Konformitätsdokumentation nach DIN 1045-1000.',
        tip: 'Lade auch den Betonpumpen-Führer zur Abstimmung ein, um ungeplante Unterbrechungen beim Einbautakt zu verhüten.'
      },
      execution: {
        action: 'Kontinuierliche Einbaubegleitung. Überwachung des Ausbreitmaßes bei Eintreffen der Fahrmischer per Erstprüfungs-Messung. Sachkundiger Einsatz von Rüttelflaschen im quadratischen Raster.',
        responsible: 'Ausführender Betrieb (ÜK2-überwachter Betonierpolier)',
        normDetail: 'Fremdüberwachung der Baustelle nach DIN 1045-3 durch eine akkreditierte Überwachungsstelle.',
        tip: 'Zusatzwasser darf vor Ort unter keinen Umständen hinzugefügt werden! Bei Konsistenzmangel Fließmittel nachdosieren (nur durch geschultes Personal).'
      },
      curing: {
        action: 'Sofortiger Beginn der Nachbehandlung nach dem Abziehen der Betonoberfläche. Abdecken mit dampfdichten PE-Folien für mindestens 7 Tage oder bis zum Nachweis von 50 % der Festigkeit.',
        responsible: 'Polier / Betonbauer vor Ort',
        normDetail: 'DIN 1045-3, Tabelle 2 regelt die Mindestnachbehandlungsdauer abhängig von der Außentemperatur und Festigkeitsentwicklung.',
        tip: 'Bei sommerlichen Winden trocknet die Oberfläche im Handumdrehen aus. Sprühen Sie unmittelbar Nebelfilme auf, noch vor dem Folienlegen.'
      }
    }
  },
  {
    id: 'sichtbeton_sb4',
    name: 'Sichtbetonstützen (Klasse SB4)',
    bbqClass: 'BBQ-S',
    ueberwachungsklasse: 'ÜK 3',
    description: 'Raumhohe, hochausgelastete Tragstützen eines repräsentativen Foyers mit höchsten Anforderungen an Farbtonhomogenität und Porenfreiheit.',
    dangerLevel: 'Sehr hoch (Optischer Sachmangel & Tragfähigkeit)',
    phases: {
      planning: {
        action: 'Detailplanung mit exaktem Fugen- und Ankerbild der Schalhaut. Ausschluss von saugenden Schalungsmaterialien zur Unterbindung von unregelmäßigen Verfärbungen.',
        responsible: 'Tragwerksplaner & Architekt',
        normDetail: 'DBV-Merkblatt "Sichtbeton" fordert BBQ-S bei der Klasse SB4, um Prozessfehler an den Einbauschnittstellen auszuschließen.',
        tip: 'Schreiben Sie eine Probe-Betonierfläche zur Genehmigung durch den Bauherrn verbindlich im LV vor.'
      },
      concept: {
        action: 'Rezepturgestaltung mit feinstmaterieller Abstimmung zur Unterdrückung von Wasserabsonderungen (Bluten). Verwendung von farbkonstantem Zement desselben Herstellers und Abbauorts.',
        responsible: 'Hersteller (Qualitätsbeauftragter)',
        normDetail: 'Festlegung des Feinanteils nach DIN 1045-2 zur Erzielung eines absolut geschlossenen und dichten Gefüges.',
        tip: 'Die Verwendung von Flugasche erhöht die Geschmeidigkeit des Frischbetons und füllt Mikrohohlräume wirkungsvoll auf.'
      },
      kooperation: {
        action: 'Absprache über Schalungsvorbereitung, spezifische Schalwachse und Schalspray-Mengen. Abstimmung der maximalen Steiggeschwindigkeit des Frischbetons zur Einhaltung des hydrostatischen Schalungsdrucks.',
        responsible: 'Kooperations-Gremium (Planer, Werkstechniker, Schalungsmeister)',
        normDetail: 'Regelung der zulässigen Konsistenzabweichung auf extrem engem Band zur Verhinderung von Farbton-Fluktuationen.',
        tip: 'Tragen Sie das Trennmittel hauchdünn und gleichmäßig auf. Pfützenbildung führt zu hässlichen dunklen Flecken (Ölflecken) auf der Stütze.'
      },
      execution: {
        action: 'Baustellenseitige Verdichtung mit vibrationsoptimierten Innenrüttlern mit Gummikappen (keine Beschädigung der Schalhaut). Überwachung der maximalen Fallhöhe (Fallrohr nutzen ab > 1.50 m Fallhöhe).',
        responsible: 'Betonier-Profis / Werkspolier',
        normDetail: 'Fremdüberwachung der Baustelle nach DIN 1045-3 Stufe 3 durch Prüfingenieure oder zertifizierte Institute.',
        tip: 'Durch den Einsatz eines Fallschlauchs wird die gravitative Entmischung des Betons beim Einfüllen ins Schalungsrohr zuverlässig gebannt.'
      },
      curing: {
        action: 'Konstantes Belassen in der Schalung für mindestens 72 Stunden (Hydratationsunterstützung). Nach dem Ausschalen sofortiges Einpacken in reißfeste Planen zum Schutz vor direktem Sonnenlicht.',
        responsible: 'Ausbaugewerke / Polier',
        normDetail: 'Sonder-Nachbehandlung nach Sichtbetonspezifikation zur Konservierung der homogenen Oberflächenhydratation.',
        tip: 'Verwenden Sie zum Schutz vor mechanischen Beschädigungen in den Folgewochen robuste Eckschutzwinkel aus Holz.'
      }
    }
  },
  {
    id: 'spannbeton_binder',
    name: 'Spannbeton-Hauptträger (Weitspan)',
    bbqClass: 'BBQ-S',
    ueberwachungsklasse: 'ÜK 3',
    description: 'Vorgespannter Dachbinder im Industriebau mit 42 m Spannweite aus hochfestem Beton (C55/67) unter aggressiver Industrie-Atmosphäre.',
    dangerLevel: 'Kritisch (Versagensrisiko bei fehlerhaftem Verbund)',
    phases: {
      planning: {
        action: 'Exakte Berechnung der Vorspannkräfte und Kriechbeiwerte. Festlegung von statisch hochsensibler Rissbegrenzung und dichter Bewehrungsführung zur Aufnahme der Spaltzugkräfte.',
        responsible: 'Fachingenieur für Tragwerksplanung',
        normDetail: 'Eurocode 2 (DIN EN 1992-1-1) i. V. m. DIN 1045-1000 regelt Spannbetonkonstruktionen als bauordnungsrechtlich überwachungsbedürftige Bauteile (ÜK 3).',
        tip: 'Zeichnen Sie ein dreidimensionales CAD-Modell für den Knotenpunkt über dem Auflager, um Kollisionen der Spannglieder aufzudecken.'
      },
      concept: {
        action: 'Sonderrezeptur für hochfesten Beton mit Mikrosilica und Hochleistungs-Fließmitteln (PCE) zur Realisierung extrem dichter Zementsteinstrukturen. E-Modul-Nachweis erforderlich.',
        responsible: 'Zentrallabor des Herstellers',
        normDetail: 'Prüfung der Gesteinsfestigkeit und der Elastizitätseigenschaften gemäß EN 12390-13 vor Erstlieferung.',
        tip: 'Die Verwendung von lokalem Granit oder Quarzit anstelle von weicherem Kalkstein maximiert den Elastizitätsmodul des Betons.'
      },
      kooperation: {
        action: 'Erarbeitung eines dedizierten logistischen Abwicklungsplans. Abstimmung über die Einblastaktung der Spannkanal-Injektionsmörtel zur Vermeidung von Luftblasen.',
        responsible: 'Tragwerksplaner, Spannbetonspezialist, Werkstechnologe',
        normDetail: 'Es ist ein objektspezifischer Qualitätssicherungsplan nach DIN 1045-1000 verbindlich zu vereinbaren.',
        tip: 'Simulieren Sie den Injektionsprozess an einem transparenten Test-Spanngliedstück, um Luftporennester visuell auszuschließen.'
      },
      execution: {
        action: 'Überwachung aller Pressenwege und Spannkräfte während des hydraulischen Spannens. Lückenlose Führung des Spannprotokolls. ÜK3 Selbstüberwachung vor Ort.',
        responsible: 'Zertifizierter Spann-Techniker',
        normDetail: 'Spannarbeiten unterliegen der bauaufsichtlichen Zulassung der jeweiligen Spannsysteme.',
        tip: 'Kalibrieren Sie die hydraulischen Manometer der Spannpressen unmittelbar vor Baustelleneinsatz.'
      },
      curing: {
        action: 'Kontrollierte Wärme- oder Dampfbehandlung im Fertigteilwerk zur beschleunigten Festigkeitsentwicklung. Vermeidung von Temperaturgradienten > 20 °C über den Trägerquerschnitt.',
        responsible: 'Abschnittsleiter des Fertigteilwerks',
        normDetail: 'DIN EN 13369 regelt die maximal zulässigen Betontemperaturen bei der werkseitigen Wärmebehandlung.',
        tip: 'Zeichnen Sie die Temperaturkurven an mehreren Stellen im Bauteilinneren mittels Thermoelementen kontinuierlich auf.'
      }
    }
  },
  {
    id: 'garagen_fundament',
    name: 'Sauberkeitsschicht / Fundamentstreifen',
    bbqClass: 'BBQ-U',
    ueberwachungsklasse: 'ÜK 1',
    description: 'Unbewehrter Fundamentstreifen für eine einfache Garage oder untergeordnete Sauberkeitsschichten im Erdreich.',
    dangerLevel: 'Sehr gering (Geringfügige Belastungen)',
    phases: {
      planning: {
        action: 'Festlegung von BBQ-U. Mindestbetonfestigkeit C12/15 der Expositionsklasse X0. Reine Flachgründung ohne anspruchsvolle Standsicherheitsvorgaben.',
        responsible: 'Entwurfsverfasser / Bauingenieur',
        normDetail: 'Nach DIN 1045-1000 für statisch nicht relevante oder untergeordnete Bauteile empfohlen.',
        tip: 'Nutzen Sie die BBQ-U Klasse, um die administrative Dokumentation auf der Baustelle wirtschaftlich zu entlasten.'
      },
      concept: {
        action: 'Lieferung einer normkonformen Standard-Rezeptur der Festigkeitsklasse C12/15 oder C20/25. Keine Sonderanforderungen bezüglich Hydratationswärme oder Chemiebestand.',
        responsible: 'Transportbetonwerk',
        normDetail: 'Reguläre werkseigene Produktionskontrolle (WPK) nach DIN EN 206.',
        tip: 'Standardrezepturen des Typs "Sortenverzeichnis" sind hierfür am einfachsten und günstigsten bereitzustellen.'
      },
      kooperation: {
        action: 'Kein separates formelles Abstimmungsgespräch gesetzlich gefordert. Einfacher bilateraler Telefonkontakt zur Disposition der Liefermenge und -zeit reicht aus.',
        responsible: 'Bauleiter, Werkdisponent',
        normDetail: 'DIN 1045-1000 befreit BBQ-U ausdrücklich von den rigiden Kooperationspflichten des modernen Modells.',
        tip: 'Klären Sie dennoch die Befahrbarkeit des Geländes durch die schweren LKW-Mischer im Voraus ab.'
      },
      execution: {
        action: 'Standardmäßiger Einbau durch das Bauunternehmen. Eigenüberwachung durch den Baustellenpolier im Rahmen der normalen täglichen Praxis (Sichtprüfung Konsistenz).',
        responsible: 'Baustellenpolier (ÜK 1)',
        normDetail: 'Überwachungsklasse ÜK 1 nach DIN 1045-3 erfordert keine staatliche Prüfstelle oder externen Güteschutz.',
        tip: 'Achten Sie darauf, dass der Untergrund vorgenässt ist, damit dem frischen Beton kein Wasser entzogen wird.'
      },
      curing: {
        action: 'Einfaches Besprühen mit Wasser am Folgetag oder Abdecken mit Folie bei extrem kühler Luft zur Verhinderung von Frostschäden an den Rändern.',
        responsible: 'Maurer / Betonarbeiter',
        normDetail: 'Grundlegender Wetterschutz nach DIN 1045-3.',
        tip: 'Bei milder Witterung reicht das Abdecken mit leicht benässten Geotextilbahnen völlig aus.'
      }
    }
  }
];

export default function Betonbauklassen() {
  const [selectedBauteilId, setSelectedBauteilId] = useState<string>('weisse_wanne');
  const [activePhase, setActivePhase] = useState<'planning' | 'concept' | 'kooperation' | 'execution' | 'curing'>('planning');

  const selectedTemplate = BAUTEIL_TEMPLATES.find(t => t.id === selectedBauteilId) || BAUTEIL_TEMPLATES[0];

  return (
    <div className="flex flex-col gap-8 font-normal">
      
      {/* DIN 1045 Standard-Update Info */}
      <div className="bg-gradient-to-r from-shiraz/5 to-shiraz/10 p-6 rounded-2xl border border-shiraz/20 flex flex-col md:flex-row gap-5 items-start">
        <div className="p-3 bg-shiraz text-white rounded-xl shadow-sm shrink-0">
          <ShieldAlert size={24} />
        </div>
        <div>
          <span className="text-xs font-bold text-shiraz tracking-wider uppercase bg-shiraz/10 px-2.5 py-1 rounded-md">
            Wichtiges Normen-Update (DIN 1045:2023-08)
          </span>
          <h3 className="text-xl font-bold text-text-main mt-1 flex items-center gap-2">
            Vom "DBV-Merkblatt" zum gesetzten Standard (DIN 1045-1000)
          </h3>
          <p className="text-xs text-text-main/80 leading-relaxed mt-1">
            Das bisherige freiwillige DBV-Merkblatt "Betonbauqualität (BBQ)" wurde mit der Veröffentlichung der neuen 
            <strong> DIN 1045-Reihe (Ausgabe August 2023)</strong> vollumfänglich harmonisiert und als verbindlicher deutscher 
            Standard eingeführt. Neu geschaffen wurde die Überbau-Norm <strong>DIN 1045-1000 ("Zusammenarbeit bei der Planung, 
            Herstellung und Bauausführung")</strong>, die das sogenannte <strong>Kooperationsmodell</strong> verbindlich regelt.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
          <Layers className="text-shiraz" /> BBQ - Betonbauqualitätsklassen
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-8 leading-relaxed">
          <p>
            Das BBQ-Planungskonzept verknüpft die Anforderungen an den Beton (Tragwerk &amp; Dauerhaftigkeit nach Eurocode 2 / DIN EN 1992-1-1 und DIN 1045-2:2023) 
            bereits in der Entwurfsphase direkt mit den Regelungen der Bauausführung (DIN EN 13670 / DIN 1045-3). Es löst Silodenken auf 
            und erzwingt eine strukturierte Kommunikation zwischen Planer, Betonwerk und Bauunternehmen unter der Koordination der <strong>Betonbauqualitätsklasse (BBQ)</strong>.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/25 hover:border-shiraz/20 transition-colors">
            <h3 className="font-bold text-base mb-2 text-text-main flex items-center justify-between">
              <span>BBQ-N (Normal)</span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Standard</span>
            </h3>
            <p className="text-xs text-text-main/80 leading-relaxed">
              Reguläre Betonbauqualität. Gilt für gewöhnliche Bauteile im Hoch- und Ingenieurbau ohne gehobenes oder komplexes Anforderungsprofil.
            </p>
            <ul className="list-disc list-inside mt-3 text-[11px] text-text-main/70 space-y-1">
              <li>Übliche Überwachung (z.B. ÜK 1 auf der Baustelle)</li>
              <li>Keine gesonderten Abstimmungsrunden zwingend</li>
            </ul>
          </div>
          
          <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/25 hover:border-shiraz/20 transition-colors">
            <h3 className="font-bold text-base mb-2 text-text-main flex items-center justify-between">
              <span>BBQ-E (Erhöht)</span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Qualitätsstufe</span>
            </h3>
            <p className="text-xs text-text-main/80 leading-relaxed">
              Erhöhte Betonbauqualität. Greift bei Bauteilen mit gesteigerten Qualitäts-, Sicht-, oder Dichtigkeitsansprüchen (z.B. standardmäßiger WU-Beton).
            </p>
            <ul className="list-disc list-inside mt-3 text-[11px] text-text-main/70 space-y-1">
              <li>Z.B. Sichtbetonklassen SB3, Standard-WU-Anbauten, Spannbeton</li>
              <li>Erhöhte Dokumentations- und Qualitätssicherungspflicht</li>
            </ul>
          </div>
          
          <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/25 hover:border-shiraz/20 transition-colors">
            <h3 className="font-bold text-base mb-2 text-text-main flex items-center justify-between">
              <span>BBQ-S (Sonder)</span>
              <span className="text-[10px] font-bold text-shiraz bg-shiraz/5 px-2 py-0.5 rounded">Sonderstufe</span>
            </h3>
            <p className="text-xs text-text-main/80 leading-relaxed">
              Sonder-Betonbauqualität. Gilt bei anspruchsvollen Spezialbauweisen, hochfesten Betonen oder extremen Sichtflächenansprüchen (SB4).
            </p>
            <ul className="list-disc list-inside mt-3 text-[11px] text-text-main/70 space-y-1">
              <li>Z.B. C55/67 aufwärts, Sichtbeton SB4, dichte Kappen im Brückenbau</li>
              <li>Objektspezifischer Qualitätssicherungsplan erforderlich</li>
            </ul>
          </div>
          
          <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/25 hover:border-shiraz/20 transition-colors">
            <h3 className="font-bold text-base mb-2 text-text-main flex items-center justify-between">
              <span>BBQ-U (Untergeordnet)</span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">Gering</span>
            </h3>
            <p className="text-xs text-text-main/80 leading-relaxed">
              Untergeordnete Betonbauqualität für Bauteile mit minimalen statischen und nahezu keinen dauerhaftigkeitsrelevanten Ansprüchen.
            </p>
            <ul className="list-disc list-inside mt-3 text-[11px] text-text-main/70 space-y-1">
              <li>Z.B. Sauberkeitsschichten, unbewehrte Ausfüllungen</li>
              <li>Sparsamer, reduzierter Eigenüberwachungsumfang</li>
            </ul>
          </div>
        </div>

        {/* Detailed BBQ consequences & task profiles according to DIN 1045-1000 */}
        <section className="mt-4 mb-8 bg-white p-6 rounded-2xl border border-home-grau/25 shadow-3xs">
          <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
            <ClipboardList className="text-shiraz w-5 h-5" /> 
            Konkrete Aufgaben und administrative Folgen der BBQ-Klassen
          </h3>
          <p className="text-xs text-text-main/75 mb-6 leading-relaxed">
            Die Zuweisung einer Betonbauqualitätsklasse (BBQ) ist kein rein theoretischer Akt, sondern steuert verbindlich
            die Aufgabenprofile der drei Hauptakteure (Planer, Hersteller, Ausführende) und legt fest, welche Nachweise und 
            Kooperationsprozesse rechtlich erbracht werden müssen.
          </p>

          <div className="space-y-6">
            
            {/* BBQ-N normal */}
            <div className="border-l-4 border-slate-400 pl-4 py-1">
              <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-md font-mono">BBQ-N</span>
                Normalanforderung lückenloser Standard-Ablauf
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-[11px] text-text-main/80">
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-text-main text-[11px] mb-1">📐 Tragwerksplaner (Statik)</strong>
                  Normaler Entwurfs- und Prüfbogen. Spezifikation der Standardklassen (C25/30, XC1/XC2). Keine Sonderanforderung im LV.
                </div>
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-text-main text-[11px] mb-1">🏭 Hersteller (Betonwerk)</strong>
                  Standardmäßige Mischungsbemessung aus dem Sortenverzeichnis. Normkonforme werkseigene Produktionskontrolle (WPK).
                </div>
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-text-main text-[11px] mb-1">🏗️ Bauunternehmen (Ausführung)</strong>
                  Reguläre Eigenüberwachung (ÜK 1). Standardmäßiges Verdichten und Standard-Nachbehandlung nach Tabelle. Lieferscheinprüfung reicht aus.
                </div>
              </div>
            </div>

            {/* BBQ-E elevated */}
            <div className="border-l-4 border-amber-500 pl-4 py-1">
              <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                <span className="bg-amber-50 text-amber-800 text-xs px-2 py-0.5 rounded-md font-mono">BBQ-E</span>
                Erhöhtes Aufgabenprofil &amp; Kooperationszwang
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-[11px] text-text-main/80">
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-amber-800 text-[11px] mb-1">📐 Tragwerksplaner (Statik)</strong>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    <li>Rechtliche Einbauverantwortung und frühzeitige Ausweisung der BBQ-E im Bemessungsprüfbogen.</li>
                    <li>Schnittstellenregelung und Terminierung des BBQ-Kooperationsgesprächs vor Gussphase.</li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-amber-800 text-[11px] mb-1">🏭 Hersteller (Betonwerk)</strong>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    <li>Ausarbeitung eines projektspezifischen <strong>Betonkonzepts</strong> (z.B. Optimierung bezgl. Rissneigung, Hydratationswärme).</li>
                    <li>Teilnahmepflicht am Abstimmungsgespräch; genaue Disposition der Lieferleistung (Konstanzbedarf).</li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-amber-800 text-[11px] mb-1">🏗️ Bauunternehmen (Ausführung)</strong>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    <li>Erstellung schriftlicher Pläne für Einbau, Verdichtung und qualifizierte <strong>Nachbehandlung</strong> (z.B. Bestimmung der Reifegrades).</li>
                    <li>Erweitertes Bautagebuch und obligatorische Frischbeton-Erstprüfungen auf der Baustelle.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* BBQ-S special */}
            <div className="border-l-4 border-shiraz pl-4 py-1">
              <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                <span className="bg-shiraz/5 text-shiraz text-xs px-2 py-0.5 rounded-md font-mono">BBQ-S</span>
                Sonderprozess mit Qualitätssicherungsplan &amp; Koordinator
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-[11px] text-text-main/80">
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-shiraz text-[11px] mb-1">📐 Tragwerksplaner (Statik)</strong>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    <li>Gemeinsame Erstellung eines umfassenden <strong>objektspezifischen QS-Plans</strong> mit allen Partnern.</li>
                    <li>Bestellung eines dezidierten <strong>BBQ-Koordinators</strong> (Verbindungsbahn zw. Statiker und Bauleitung).</li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-shiraz text-[11px] mb-1">🏭 Hersteller (Betonwerk)</strong>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    <li>Labortechnische Sonderprüfungen (Scherversuche, Kriechverhalten, Elastizitätsmoduln).</li>
                    <li>Vorschreiben extrem enger Temperatur- und Ausbreitgrenzen für Gussphasen.</li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-shiraz text-[11px] mb-1">🏗️ Bauunternehmen (Ausführung)</strong>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    <li>Umfangreiche <strong>Fremdüberwachung (ÜK3)</strong> mit unangekündigten Kontrollen externer Laboranten.</li>
                    <li>Pflicht zur Durchführung von Vorversuchen (Probebetonagen im Realmaßstab vor Konstruktionsbeginn).</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* BBQ-U underground */}
            <div className="border-l-4 border-stone-300 pl-4 py-1">
              <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                <span className="bg-stone-50 text-stone-500 text-xs px-2 py-0.5 rounded-md font-mono">BBQ-U</span>
                Untergeordnete Vereinfachung ohne Bürokratie
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-[11px] text-text-main/80">
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-stone-500 text-[11px] mb-1">📐 Tragwerksplaner (Statik)</strong>
                  Kein Aufwand. Keine Erwähnung im Entwurfsbogen erforderlich. Einfache Übernahme der Mindestfestigkeit C12/15 im Gründungsentwurf.
                </div>
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-stone-500 text-[11px] mb-1">🏭 Hersteller (Betonwerk)</strong>
                  Lieferung von Standard-Rezepturen ohne jegliche Verpflichtung zur Logistik-Abstimmung oder thermischen Gutachten.
                </div>
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-stone-500 text-[11px] mb-1">🏗️ Bauunternehmen (Ausführung)</strong>
                  Minimaler Dokumentationsaufwand. Einfaches Einbauen und grobe Sichtkontrolle der Standfestigkeit vor Ort.
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Das neue Kooperationsmodell */}
        <div className="bg-emerald-50/40 p-6 rounded-2xl border border-emerald-500/20 mb-8">
          <h3 className="text-base font-bold text-emerald-800 mb-3 flex items-center gap-2">
            <Users size={18} /> Das "Kooperationsmodell" nach DIN 1045-1000
          </h3>
          <p className="text-xs text-emerald-950/80 leading-relaxed mb-4">
            Die elementare Änderung ist, dass die Schnittstellen zwischen den Partnern nun regulatorisch festgeschrieben sind.
            Für Bauteile der Klassen <strong>BBQ-E und BBQ-S</strong> ist ein strukturierter Kooperationsablauf bindend vorgeschrieben:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3.5 rounded-lg border border-emerald-500/10">
              <span className="text-[10px] font-bold text-emerald-600 block mb-1">1. Planung (Part 1)</span>
              <p className="text-[11px] text-emerald-950/90 leading-normal">
                Der Tragwerksplaner legt die BBQ-Klasse fest, definiert die Anforderungen im LV und ernennt bei Bedarf einen BBQ-Koordinator.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-emerald-500/10">
              <span className="text-[10px] font-bold text-emerald-600 block mb-1">2. Herstellung (Part 2)</span>
              <p className="text-[11px] text-emerald-950/90 leading-normal">
                Das Transportbetonwerk entwirft die Rezeptur (das "Betonkonzept") passend zur BBQ-Klasse und stimmt Lieferraten &amp; Logistik ab.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-emerald-500/10">
              <span className="text-[10px] font-bold text-emerald-600 block mb-1">3. Ausführung (Part 3)</span>
              <p className="text-[11px] text-emerald-950/90 leading-normal">
                Das Bauunternehmen setzt die Baustellentechnik (Rüttelenergie, Nachbehandlungsdauer, Schalhautpflege) passgenau um.
              </p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE IMPLEMENTATION LEITFADEN - OHNE ABARBEITUNG */}
        <div className="bg-stone-50 p-6 rounded-2xl border border-home-grau/25 shadow-3xs" id="bbq-leitfaden-section">
          
          <div className="flex justify-between items-center mb-5 flex-wrap gap-2 border-b border-home-grau/20 pb-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="text-shiraz" size={22} />
              <div>
                <h3 className="text-base font-bold text-text-main">
                  Interaktiver BBQ-Umsetzungs-Leitfaden
                </h3>
                <p className="text-[11px] text-text-main/60">
                  Wählen Sie ein Bauteilszenario, um den phasengenauen Prozessablauf ohne manuelle Abarbeitungs-Pflicht zu simulieren.
                </p>
              </div>
            </div>
          </div>

          {/* Bauteil-Tab-Umschalter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {BAUTEIL_TEMPLATES.map(bt => {
              const isSelected = bt.id === selectedBauteilId;
              return (
                <button
                  key={bt.id}
                  onClick={() => {
                    setSelectedBauteilId(bt.id);
                    setActivePhase('planning');
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border shadow-3xs cursor-pointer flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-shiraz text-white border-shiraz shadow-sm' 
                      : 'bg-white text-text-main border-home-grau/20 hover:bg-stone-100'
                  }`}
                >
                  <Settings size={13} className={isSelected ? 'animate-spin' : ''} />
                  {bt.name}
                </button>
              );
            })}
          </div>

          <div className="bg-white p-5 rounded-xl border border-home-grau/20 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-home-grau/15 pb-3">
              <div>
                <span className="text-[10px] font-bold text-shiraz tracking-widest uppercase block mb-0.5">Szenariobezeichnung</span>
                <h4 className="text-base font-bold text-text-main">{selectedTemplate.name}</h4>
                <p className="text-xs text-text-main/70 mt-1">{selectedTemplate.description}</p>
              </div>
              <div className="flex flex-col items-end shrink-0 gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-main/60">Klasse:</span>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 bg-shiraz/5 text-shiraz border border-shiraz/10 rounded-md select-none">
                    {selectedTemplate.bbqClass}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-main/60">Baustelle:</span>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 bg-stone-100 text-stone-700 border border-stone-200 rounded-md select-none">
                    {selectedTemplate.ueberwachungsklasse}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
              
              {/* Left Column: Flow Phases Timeline Selector */}
              <div className="md:col-span-5 space-y-2">
                <span className="text-[10px] font-bold text-text-main/45 uppercase tracking-wide block mb-2">Prozessschritte im Kooperationsmodell:</span>
                
                {[
                  { id: 'planning', num: '1', title: 'Planung & Standsicherheit', desc: 'Sollwertanalyse im Entwurf' },
                  { id: 'concept', num: '2', title: 'Rezeptur & Betonkonzept', desc: 'Lieferwerks-Qualitätsplanung' },
                  { id: 'kooperation', num: '3', title: 'Kooperationsgespräch', desc: 'Förmlicher Abgleich vor Guss' },
                  { id: 'execution', num: '4', title: 'Einbau & Frischprüfung', desc: 'Durchführung auf Baustelle' },
                  { id: 'curing', num: '5', title: 'Nachbehandlung & Abnahme', desc: 'Feuchtigkeits- & Rissverzögerung' },
                ].map(phase => {
                  const isActive = activePhase === phase.id;
                  return (
                    <button
                      key={phase.id}
                      onClick={() => setActivePhase(phase.id as any)}
                      className={`w-full p-3 rounded-lg border text-left flex gap-3.5 transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-shiraz text-white border-shiraz shadow-sm' 
                          : 'bg-stone-50 text-text-main border-home-grau/15 hover:bg-stone-100'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        isActive ? 'bg-white text-shiraz' : 'bg-home-grau/25 text-text-main/80'
                      }`}>
                        {phase.num}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold leading-snug">{phase.title}</h5>
                        <p className={`text-[10px] ${isActive ? 'text-white/70' : 'text-text-main/50'}`}>
                          {phase.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Dynamic Phase Details Detailcard */}
              <div className="md:col-span-7 flex flex-col justify-between">
                <div className="bg-stone-50 p-5 rounded-lg border border-home-grau/20 h-full flex flex-col justify-between gap-5">
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2 border-home-grau/10 flex-wrap gap-2">
                      <span className="text-[10px] font-bold text-shiraz uppercase tracking-wider flex items-center gap-1">
                        <FileCheck size={12} />
                        Phasen-Steckbrief
                      </span>
                      <span className="text-[10px] font-bold text-stone-500 font-mono bg-stone-200/60 px-2 py-0.5 rounded-full">
                        {activePhase === 'planning' ? 'Tragwerksplanung' : activePhase === 'concept' ? 'Herstellerwerk' : activePhase === 'kooperation' ? 'Abstimmungsphase' : activePhase === 'execution' ? 'Gussphase' : 'Festbetonphase'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[9.5px] font-bold text-text-main/40 uppercase block">Was ist konkret zu tun?</label>
                        <p className="text-xs text-text-main leading-relaxed font-semibold mt-1">
                          {selectedTemplate.phases[activePhase].action}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-home-grau/10">
                        <div>
                          <label className="text-[9.5px] font-bold text-text-main/40 uppercase block">Zuständigkeit:</label>
                          <span className="text-xs font-bold text-shiraz block mt-0.5">
                            👤 {selectedTemplate.phases[activePhase].responsible}
                          </span>
                        </div>
                        <div>
                          <label className="text-[9.5px] font-bold text-text-main/40 uppercase block">Normvorgabe (DIN 1045):</label>
                          <span className="text-xs text-text-main/80 block mt-0.5 leading-tight">
                            📕 {selectedTemplate.phases[activePhase].normDetail}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-200/40 p-3 rounded-lg text-xs">
                    <div className="font-bold text-amber-800 flex items-center gap-1">
                      <HelpCircle size={13} />
                      Baupraktischer Insider-Tipp:
                    </div>
                    <p className="text-amber-900/85 text-[11px] mt-1 leading-normal italic">
                      " {selectedTemplate.phases[activePhase].tip} "
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 text-xs text-text-main/70 text-center flex items-center justify-center gap-2">
            <span>💡</span>
            <span><strong>Kooperationsvorteil:</strong> Durch dieses strukturierte, phasenweise Leitfadenmodell werden bis zu <strong>80% aller typischen Rissbildungs- und Prozessfehler</strong> präventiv vor Betonierbeginn vermieden.</span>
          </div>

        </div>

        <div className="bg-shiraz/5 p-6 rounded-xl border border-shiraz/20 mt-8">
          <h3 className="text-base font-bold text-shiraz mb-2">Zusammenhang mit Überwachungsklassen</h3>
          <p className="text-xs text-text-main/80 mb-4 leading-relaxed">
            Die Betonbauqualitätsklassen (BBQ) stehen in enger Verbindung mit den Überwachungsklassen (ÜK) zur Baustellenselbst- und Fremdüberwachung nach DIN 1045-3:
          </p>
          <ul className="list-disc list-inside text-xs text-text-main/80 space-y-2 leading-relaxed">
            <li><strong>ÜK 1 (Überwachungsklasse 1):</strong> Für Festigkeitsklassen ≤ C25/30 und grundlegende Expositionsklassen (z.B. X0, XC1, XC2). Die Überwachung erfolgt rein eigenverantwortlich durch das Bauunternehmen.</li>
            <li><strong>ÜK 2 (Überwachungsklasse 2):</strong> Ab C30/37 oder höhere Expositionsklassen (z.B. Feuchte WA, XD, XS, XF, XM). Erfordert zusätzlich zur werkseigenen Produktionskontrolle eine anerkannte externe Überwachungsstelle (Fremdüberwachung).</li>
            <li><strong>ÜK 3 (Überwachungsklasse 3):</strong> Für hochfeste Betone (ab C55/67) oder komplexe Sonderverfahren. Nochmals verschärfte Fremdüberwachungsstruktur auf der Baustelle.</li>
          </ul>
        </div>
      </div>
    
      <ModuleFooter 
        weblinks={[
          { title: "Beton.wiki: BetonBauQualität", url: "https://beton.wiki/index.php?title=BetonBauQualit%C3%A4t" }, 
          { title: "Zement-Merkblätter Übersicht", url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }, 
          { title: "Beton.wiki: BBQ-Konzept", url: "https://beton.wiki/index.php?title=BBQ-Konzept" }
        ]} 
        wikipedia={[
          { title: 'Betonbauqualität', url: 'https://de.wikipedia.org/wiki/Betonbau' },
          { title: 'WU-Richtlinie', url: 'https://de.wikipedia.org/wiki/Wei%C3%9Fe_Wanne' }
        ]}
        literatur={[
          'DBV-Heft 43: Betonbauqualität (BBQ) – Kriterien und Einstufungshilfen (Deutscher Beton- und Bautechnik-Verein E.V.)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'DAfStb-Heft 600: Erläuterungen zu den Normen DIN EN 1992-1-1 und DIN 1045'
        ]}
        regelwerke={[
          { title: 'DIN 1045-1000:2023-08 (Zusammenarbeit bei der Planung, Herstellung und Bauausführung)', url: 'https://www.dinmedia.de/de/suche?q=DIN+1045-1000' },
          { title: 'DIN 1045-2:2023-08 (Beton - Festlegung, Eigenschaften, Herstellung und Konformität)', url: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2' },
          { title: 'DIN EN 13670 / DIN 1045-3:2023-08 (Ausführung von Tragwerken aus Beton)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+13670' },
          { title: 'DIN EN 1992-1-1: Eurocode 2 (Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1992-1-1' }
        ]}
        formeln={[
          {
            formel: '\\text{BBQ} \\in \\{\\text{BBQ-N (Normal)},\\, \\text{BBQ-E (Erhöht)},\\, \\text{BBQ-S (Speziell)},\\, \\text{BBQ-U (Undefiniert)}\\}',
            erklaerung: 'Klassifizierung der Betonbauqualität nach DIN 1045-1000 zur verbindlichen Festlegung von Kommunikations- und Prüfpflichten zwischen Planer, Transportbetonwerk und Bauausführung.',
            quelle: 'DIN 1045-1000:2023-08'
          },
          {
            formel: '\\text{ÜK} \\in \\{\\text{ÜK 1 (Eigenüberwachung)},\\, \\text{ÜK 2 (Fremdüberwachung)},\\, \\text{ÜK 3 (Verschärfte Fremdüberwachung)}\\}',
            erklaerung: 'Baustellenüberwachungsklassen nach DIN 1045-3 in Abhängigkeit von Druckfestigkeit (ÜK 2 ab C30/37) und Expositionsbeanspruchung.',
            quelle: 'DIN 1045-3'
          }
        ]}
      />
    </div>
  );
}
