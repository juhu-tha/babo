import React, { useState } from 'react';
import { 
  Scale, 
  BarChart3, 
  Globe, 
  FileText, 
  Award, 
  ShieldCheck, 
  Building2, 
  Trash2, 
  Leaf, 
  Zap, 
  TrendingDown, 
  Layers, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  HelpCircle, 
  Compass, 
  RefreshCw,
  HardHat,
  Info,
  BookOpen,
  Library,
  Target,
  Sparkles,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { useTabContext } from '@/src/contexts/TabContext';

export type DatenRegelnTab = 
  | 'definitionen'
  | 'kennzahlen' 
  | 'klimapolitik' 
  | 'regulatorik' 
  | 'deklarationen' 
  | 'national';

export interface SdgItem {
  num: number;
  title: string;
  fullName: string;
  englishTitle: string;
  badgeBg: string;
  bauRelevant: boolean;
  relevanceLabel?: string;
  baupraxis: string;
  measures: string[];
}

export const ALL_17_SDGS: SdgItem[] = [
  {
    num: 1,
    title: 'SDG 1: Keine Armut',
    fullName: 'SDG 1: Keine Armut',
    englishTitle: 'End poverty in all its forms everywhere',
    badgeBg: 'bg-[#E5243B]',
    bauRelevant: false,
    baupraxis: 'Bezahlbarer und dauerhaft betriebssicherer Wohnraum ist eine fundamentale Existenzgrundlage. Das Bauwesen schafft Schutz vor Witterungs- und Klimaextremen und ermöglicht gesellschaftliche Teilhabe durch bezahlbare, serielle und warmmietenneutrale Bauweisen.',
    measures: [
      'Förderung serieller und modularer Wohnungsbauweisen zur Kostenreduktion',
      'Minimierung von Nebenkosten durch hohe Energieeffizienz (Warmmietenneutralität)',
      'Katastrophenresiliente Notunterkünfte und Sanierung von Siedlungsbauten in prekären Lagen'
    ]
  },
  {
    num: 2,
    title: 'SDG 2: Kein Hunger',
    fullName: 'SDG 2: Kein Hunger',
    englishTitle: 'End hunger, achieve food security and improved nutrition',
    badgeBg: 'bg-[#DDA63A]',
    bauRelevant: false,
    baupraxis: 'Schutz wertvoller landwirtschaftlicher Nutzflächen vor Flächenfraß und Zersiedelung. Gebäudeintegrierte Landwirtschaft (Building-Integrated Agriculture / Rooftop Farming) und effiziente Wasserrückhaltesysteme.',
    measures: [
      'Konsequente Flächenkreislaufwirtschaft: Baulücken- und Innenentwicklung vor Agrarflächenverbrauch',
      'Nutzbare Dach- und Fassadengärten für lokale Nahrungsmittelproduktion in Ballungsräumen',
      'Versickerungs- und Zisternenkonzepte zur Sicherung des lokalen Grundwasserspiegels'
    ]
  },
  {
    num: 3,
    title: 'SDG 3: Gesundheit & Wohlergehen',
    fullName: 'SDG 3: Gesundheit und Wohlergehen',
    englishTitle: 'Ensure healthy lives and promote well-being for all at all ages',
    badgeBg: 'bg-[#4C9F38]',
    bauRelevant: true,
    relevanceLabel: 'Hohe Baupraxis-Relevanz',
    baupraxis: 'Menschen verbringen bis zu 90 % ihrer Lebenszeit in geschlossenen Räumen. Baubiologie, schadstoffgeprüfte emissionsarme Baustoffe (AgBB-Schema), Schallschutz nach DIN 4109, Tageslichtversorgung und thermischer Sommerkomfort sind Kernaufgaben der Bauplanung.',
    measures: [
      'Strikte Begrenzung flüchtiger organischer Verbindungen (VOCs) und Weichmacher (DIN EN 16516)',
      'Radonschutz bei erdberührten Bauteilen nach dem Strahlenschutzgesetz (StrlSchG)',
      'Fachgerechte Asbestsanierung und sichere Schadstoffentfrachtung im Altbau',
      'Effektiver sommerlicher Wärmeschutz nach DIN 4108-2 zur Vermeidung von Hitzestress in Wohn- und Arbeitsräumen'
    ]
  },
  {
    num: 4,
    title: 'SDG 4: Hochwertige Bildung',
    fullName: 'SDG 4: Hochwertige Bildung',
    englishTitle: 'Ensure inclusive and equitable quality education and promote lifelong learning',
    badgeBg: 'bg-[#C5192D]',
    bauRelevant: false,
    baupraxis: 'Planung und Errichtung gesunder, lärmarmer und akustisch optimierter Bildungsbauten (Schulen, Kitas, Hochschulen). Einhaltung der DIN 18041 (Hörsamkeit in Räumen) für nachweisbar bessere Konzentrationsfähigkeit.',
    measures: [
      'Akustische Optimierung von Lernräumen nach DIN 18041 mit kurzen Nachhallzeiten',
      'Flexible, multifunktionale Cluster-Grundrisse für moderne pädagogische Raumkonzepte',
      'Akademische Integration von Ressourceneffizienz und zirkulärem Bauen in die Ingenieurausbildung'
    ]
  },
  {
    num: 5,
    title: 'SDG 5: Geschlechtergerechtigkeit',
    fullName: 'SDG 5: Geschlechtergerechtigkeit',
    englishTitle: 'Achieve gender equality and empower all women and girls',
    badgeBg: 'bg-[#FF3A21]',
    bauRelevant: false,
    baupraxis: 'Chancengleichheit und Diversität in der Bau- und Immobilienwirtschaft. Sicherheitsorientierte, angstfreie Stadt- und Freiraumplanung mit beleuchteten Wegen und einsehbaren Zugängen im öffentlichen Raum.',
    measures: [
      'Angstfreie Freiraum- und Parkhausplanung durch transparente Blickachsen und Beleuchtungskonzepte',
      'Förderung von Ingenieurinnen und Facharbeiterinnen im Bauhandwerk und Planungsbereich',
      'Ergonomische Bauhilfsmittel und Hebewerkzeuge zur physischen Entlastung aller Arbeitskräfte'
    ]
  },
  {
    num: 6,
    title: 'SDG 6: Sauberes Wasser & Sanitär',
    fullName: 'SDG 6: Sauberes Wasser und Sanitäreinrichtungen',
    englishTitle: 'Ensure availability and sustainable management of water and sanitation for all',
    badgeBg: 'bg-[#26BDE2]',
    bauRelevant: true,
    relevanceLabel: 'Kernrelevanz Baupraxis',
    baupraxis: 'Wasserretention nach dem Schwammstadt-Prinzip, Trennung von Grau- und Schwarzwasser, Trinkwasserhygiene nach DIN 1988 / VDI 6023 (Legionellenprävention) sowie lückenloser Gewässerschutz vor alkalischen Baustellenabwässern.',
    measures: [
      'Schwammstadt-Elemente: Gründächer, Retentionszisternen und dezentrale Muldenversickerung',
      'Grauwassernutzungsanlagen zur Substitution von Trinkwasser für Toilettenspülung und Grünflächen',
      'Strikte Einhaltung der Trinkwasserverordnung (Temperaturhaltung Warm-/Kaltwasser)',
      'Neutralisation und Sedimentation alkalischer Zementschlämme auf Baustellen vor der Vorflutereinleitung'
    ]
  },
  {
    num: 7,
    title: 'SDG 7: Bezahlbare & saubere Energie',
    fullName: 'SDG 7: Bezahlbare und saubere Energie',
    englishTitle: 'Ensure access to affordable, reliable, sustainable and modern energy for all',
    badgeBg: 'bg-[#FCC30B]',
    bauRelevant: true,
    relevanceLabel: 'Absolute Kernrelevanz Bauwesen',
    baupraxis: 'Der Gebäudebetrieb (Heizung, Warmwasser, Kälte) verantwortet ca. 28 % der weltweiten energiebedingten CO₂-Emissionen. Nullemissionsgebäude (ZEB nach EPBD 2024/1275), gebäudeintegrierte Photovoltaik (BIPV) und Geothermie machen Gebäude zu regenerativen Kraftwerken.',
    measures: [
      'Heizungserneuerung nach dem Gebäudemodernisierungsgesetz (GModG 2026: 65-%-Vorgabe entfallen, Bio-Treppe für Gas- und Ölheizungen)',
      'Gebäudeintegrierte Photovoltaik (BIPV) auf Dächern und solaraktiven Fassaden',
      'Nutzung von Umweltwärme über Wärmepumpenkaskaden, Erdsonden und Eisspeicher',
      'Passivhaus- und Effizienzhaus-Dämmstandards zur nachhaltigen Senkung des Primärenergiebedarfs'
    ]
  },
  {
    num: 8,
    title: 'SDG 8: Menschenwürdige Arbeit',
    fullName: 'SDG 8: Menschenwürdige Arbeit und Wirtschaftswachstum',
    englishTitle: 'Promote sustained, inclusive and sustainable economic growth, productive employment and decent work',
    badgeBg: 'bg-[#A21942]',
    bauRelevant: true,
    relevanceLabel: 'Hohe Baupraxis-Relevanz',
    baupraxis: 'Arbeitssicherheit auf Baustellen nach Baustellenverordnung (BaustellV) mit SiGe-Koordination. Einhaltung des Lieferkettensorgfaltspflichtengesetzes (LkSG) bei Baustoffimporten (Natursteinbrüche, Metalle, Hölzer) ohne Menschenrechtsverletzungen.',
    measures: [
      'Konsequente Sicherheits- und Gesundheitsschutzkoordination (SiGeKo) nach BaustellV',
      'Zertifizierte Beschaffung von Natursteinen und Fliesen (Fair Stone / XertifiX gegen Kinderarbeit)',
      'Ergonomische Entlastung durch Exoskelette, Krantechnik und Vorfertigung',
      'Tariftreue und faire Nachunternehmerbeauftragung zur Bekämpfung von Scheinselbstständigkeit'
    ]
  },
  {
    num: 9,
    title: 'SDG 9: Industrie, Innovation, Infrastruktur',
    fullName: 'SDG 9: Industrie, Innovation und Infrastruktur',
    englishTitle: 'Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation',
    badgeBg: 'bg-[#FD6925]',
    bauRelevant: true,
    relevanceLabel: 'Absolute Kernrelevanz Bauwesen',
    baupraxis: 'Klimaresiliente Verkehrs- und Versorgungsinfrastruktur. Einsatz radikal ressourceneffizienter Baustoffinnovationen: Carbonbeton, klinkerarme Bindemittel (CEM III/C, LC3-Technologie), 3D-Betondruck und digitalisierte Vorfertigung.',
    measures: [
      'Substanzschonende Brückeninstandsetzung nach Nachrechnungsrichtlinie statt Ressourcenvernichtung durch Neubau',
      'Markteinführung klinkerreduzierter Zemente und calcinierter Tone (LC3) mit bis zu 40 % CO₂-Einsparung',
      'Carbonbeton und Textilbeton für korrosionsfreie, extrem schlanke Leichtbau-Tragstrukturen',
      '3D-Druck und Robotik zur materialminimierten Fertigung von Freiformbauteilen'
    ]
  },
  {
    num: 10,
    title: 'SDG 10: Weniger Ungleichheiten',
    fullName: 'SDG 10: Weniger Ungleichheiten',
    englishTitle: 'Reduce inequality within and among countries',
    badgeBg: 'bg-[#DD1367]',
    bauRelevant: false,
    baupraxis: 'Barrierefreie Architektur und inklusive Quartiersplanung nach DIN 18040. Chancengerechter Zugang zu Gebäuden, Arbeitsstätten und öffentlichem Raum für Menschen mit Mobilitätseinschränkungen.',
    measures: [
      'Konsequente Umsetzung der DIN 18040 (Barrierefreies Bauen Teile 1 bis 3)',
      'Zwei-Sinne-Prinzip bei Orientierungs- und Leitsystemen im öffentlichen Raum',
      'Wohnungsbauförderung für bezahlbaren, generationsübergreifenden Wohnraum'
    ]
  },
  {
    num: 11,
    title: 'SDG 11: Nachhaltige Städte & Quartiere',
    fullName: 'SDG 11: Nachhaltige Städte und Gemeinden',
    englishTitle: 'Make cities and human settlements inclusive, safe, resilient and sustainable',
    badgeBg: 'bg-[#FD9D24]',
    bauRelevant: true,
    relevanceLabel: 'Absolute Kernrelevanz Bauwesen',
    baupraxis: 'Das Leitziel des Bauwesens: Klimaresiliente Stadtquartiere, Schwammstadt-Konzepte, Hitzeinselvermeidung (Albedo-Effekt, Beschattung), Erhalt historischer Bausubstanz und einfaches, suffizientes Bauen nach Gebäudetyp E (§ 650o BGB).',
    measures: [
      'Schwammstadt-Infrastruktur: Entsiegelung, Rigolensysteme und Retentionsmulden gegen Starkregen',
      'Bauen im Bestand als Primärstrategie zur Bewahrung grauer Energie und baukultureller Identität',
      'Dach- und Fassadenbegrünung zur Reduktion des städtischen Wärmeinseleffekts (Urban Heat Island)',
      'Rechtlich belastbares Abweichen von Komfortnormen über den Gebäudetyp E (Gesetz in Vorbereitung)'
    ]
  },
  {
    num: 12,
    title: 'SDG 12: Nachhaltiger Konsum & Kreislauf',
    fullName: 'SDG 12: Nachhaltige Konsum- und Produktionsmuster',
    englishTitle: 'Ensure sustainable consumption and production patterns',
    badgeBg: 'bg-[#BF8B2E]',
    bauRelevant: true,
    relevanceLabel: 'Absolute Kernrelevanz Bauwesen',
    baupraxis: 'Das Bauwesen verbraucht über 50 % aller globalen Rohstoffe und verursacht über 55 % des deutschen Abfallaufkommens. Wandel zur zirkulären Baustoffwirtschaft: Cradle to Cradle, RC-Beton nach EBV, EPD nach DIN EN 15804+A2 und Digitaler Produktpass (DPP).',
    measures: [
      'Einsatz güteüberwachter RC-Gesteinskörnungen nach Ersatzbaustoffverordnung (EBV) und DIN EN 12620',
      'Demontagegerechte Fügetechnik (Design for Disassembly) statt unlösbar verklebter Verbundschichten',
      'Erstellung digitaler Materialpässe (Madaster, Urban Mining Index UMI)',
      'Verpflichtende Vorlage von Umweltproduktdeklarationen (EPDs) für Bauprodukte'
    ]
  },
  {
    num: 13,
    title: 'SDG 13: Maßnahmen zum Klimaschutz',
    fullName: 'SDG 13: Maßnahmen zum Klimaschutz',
    englishTitle: 'Take urgent action to combat climate change and its impacts',
    badgeBg: 'bg-[#3F7E44]',
    bauRelevant: true,
    relevanceLabel: 'Absolute Kernrelevanz Bauwesen',
    baupraxis: 'Das Bauwesen steht für ca. 40 % der energiebedingten CO₂-Emissionen (28 % Betrieb, 11–12 % graue Emissionen). Ganzheitliche Ökobilanzierung (LCA) nach DIN EN 15978 und Einhaltung von Dekarbonisierungspfaden (CRREM 1,5 °C-Ziel) zur Vermeidung von Stranded Assets.',
    measures: [
      'Ganzheitliche Ökobilanzierung (LCA) über alle Phasen A1–A3, B, C und Modul D',
      'Einsatz von nachwachsenden Baustoffen (Holz, Lehm, Stroh) als temporäre CO₂-Senken',
      'Dekarbonisierungspfad nach CRREM zur Werterhaltung von Bestandsimmobilien',
      'Nullemissionsbaustellen mit elektrifizierten Maschinen und lokalem Ökostrom'
    ]
  },
  {
    num: 14,
    title: 'SDG 14: Leben unter Wasser',
    fullName: 'SDG 14: Leben unter Wasser',
    englishTitle: 'Conserve and sustainably use the oceans, seas and marine resources',
    badgeBg: 'bg-[#0A97D9]',
    bauRelevant: false,
    baupraxis: 'Schutz von Gewässern und Ozeanen vor baubedingtem Schadstoffeintrag. Verzicht auf biozidbelastete Fassadenbeschichtungen (WDVS-Auswaschungen) und Vermeidung von Mikroplastikabrieb aus Dämmstoffen und Polymerbeschichtungen.',
    measures: [
      'Verzicht auf auswaschbare Biozide und Fungizide in Fassadenputzen und Anstrichsystemen',
      'Sichere Schlämm- und Spülwasseraufbereitung bei Tunnel- und Spezialtiefbauarbeiten',
      'Schutz mariner Küstenökosysteme bei Hafen- und Offshore-Bauwerken'
    ]
  },
  {
    num: 15,
    title: 'SDG 15: Leben an Land & Ökosysteme',
    fullName: 'SDG 15: Leben an Land',
    englishTitle: 'Protect, restore and promote sustainable use of terrestrial ecosystems',
    badgeBg: 'bg-[#56C02B]',
    bauRelevant: true,
    relevanceLabel: 'Hohe Baupraxis-Relevanz',
    baupraxis: 'Drosselung des Primärsand- und Kiesabbaus in natürlichen Flussauen zur Bewahrung von Biotopen. Nachhaltige Holzwirtschaft mit FSC-/PEFC-Zertifizierung. Reduktion des täglichen Flächenverbrauchs auf das 30-Hektar-Ziel der Bundesregierung.',
    measures: [
      'Einsatz von nachweislich zertifiziertem Holz aus nachhaltiger Forstwirtschaft (FSC / PEFC)',
      'Substitution von Primärkies durch rezyklierte Gesteinskörnungen im Hoch- und Tiefbau',
      'Gebäudeintegrierter Artenschutz (integrierte Nistplätze für Mauersegler und Fledermäuse)',
      'Verzicht auf torfhaltige Substrate und invasive Pflanzen bei Dach- und Fassadenbegrünungen'
    ]
  },
  {
    num: 16,
    title: 'SDG 16: Frieden, Gerechtigkeit & Institutionen',
    fullName: 'SDG 16: Frieden, Gerechtigkeit und starke Institutionen',
    englishTitle: 'Promote peaceful and inclusive societies, provide access to justice for all',
    badgeBg: 'bg-[#00689D]',
    bauRelevant: false,
    baupraxis: 'Transparente, diskriminierungsfreie Vergabeverfahren (VOB/A, VgV) ohne Korruption. Rechtlich belastbare Bauvertragsgestaltung nach BGB und HOAI sowie verlässliche, digitale Genehmigungsverfahren im Baurecht.',
    measures: [
      'Strikte Einhaltung von Compliance- und Antikorruptionsrichtlinien bei öffentlichen Bauvergaben',
      'Digitale, transparente Bauantragsverfahren nach dem Onlinezugangsgesetz (OZG)',
      'Rechtlich belastbare Durchsetzung anerkannter Regeln der Technik zum Schutz der Allgemeinheit'
    ]
  },
  {
    num: 17,
    title: 'SDG 17: Partnerschaften für die Ziele',
    fullName: 'SDG 17: Partnerschaften zur Erreichung der Ziele',
    englishTitle: 'Strengthen the means of implementation and revitalize global partnerships',
    badgeBg: 'bg-[#19486A]',
    bauRelevant: false,
    baupraxis: 'Interdisziplinäre Partnerschaften zwischen Wissenschaft, Planern, Bauwirtschaft und Behörden. Offene Datenstandards (OpenBIM, buildingSMART), frei zugängliche Baustoffdatenbanken (ÖKOBAUDAT, WECOBIS) und Wissenstransfer.',
    measures: [
      'Förderung von Open-Source-Baustoffdaten und interoperablen IFC-Standards (OpenBIM)',
      'Interdisziplinäre Zusammenarbeit zwischen Tragwerksplanern, TGA-Ingenieuren und Ökobilanzierern',
      'Forschungskooperationen zwischen Hochschulen und mittelständischer Baupraxis'
    ]
  }
];

export default function NachhaltigkeitDatenRegeln() {
  const { setActiveTab: setGlobalTab } = useTabContext();
  const [activeTab, setActiveTab] = useState<DatenRegelnTab>('kennzahlen');
  const [selectedSdg, setSelectedSdg] = useState<number>(11);
  const [selectedTaxonomyGoal, setSelectedTaxonomyGoal] = useState<number>(1);
  const [interactiveMasse, setInteractiveMasse] = useState<number>(1000); // Tonnen Bauschutt

  // Calculation for waste recycling potential
  const calculatedRcBeton = formatDeZahl(interactiveMasse * 0.65, 0);
  const calculatedUnterbau = formatDeZahl(interactiveMasse * 0.25, 0);
  const calculatedDeponie = formatDeZahl(interactiveMasse * 0.10, 0);
  const savedCo2Tons = formatDeZahl(interactiveMasse * 0.045, 1);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 font-normal">
      {/* Central Header & Teaser Box */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Scale className="text-shiraz h-6 w-6" />
              Nachhaltigkeit: Daten &amp; Regeln
            </h2>
            <p className="text-xs text-text-main/70 mt-1">
              Globale Umweltkennzahlen, UN-SDGs, EU-Taxonomie, EPBD 2024/1275, EPD, Digitaler Produktpass (DPP) &amp; deutsches Baurecht
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap">
            Stand: 2025 / 2026
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed mb-6">
          <p>
            Das Bau- und Immobilienwesen steht im Zentrum der globalen Umwelt- und Klimapolitik. 
            Dieses Modul bündelt alle relevanten <strong>statistischen Kennzahlen (THG-Emissionen, Ressourcenabbau, Abfallströme)</strong>, 
            internationale Abkommen und Leitlinien (<strong>UN-Klimakonferenzen, SDGs</strong>), 
            europäische Richtlinien (<strong>EU-Taxonomie, EPBD 2024/1275, CSRD</strong>), 
            zirkuläre Deklarationssysteme (<strong>EPD nach DIN EN 15804+A2, Digitaler Produktpass DPP, Madaster</strong>) 
            sowie das geltende nationale Gesetzesgefüge (<strong>GModG (vormals GEG), QNG, EBV, KrWG und das Gebäudetyp-E-Vorhaben</strong>).
          </p>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-1 border-b border-home-grau/20">
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'definitionen'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('definitionen')}
          >
            <BookOpen size={16} /> 1. Definitionen &amp; Leitprinzipien
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'kennzahlen'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('kennzahlen')}
          >
            <BarChart3 size={16} /> 2. Anteile &amp; Stoffströme
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'klimapolitik'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('klimapolitik')}
          >
            <Globe size={16} /> 3. Klimakonferenzen &amp; SDGs
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'regulatorik'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('regulatorik')}
          >
            <Building2 size={16} /> 4. EU-Taxonomie &amp; EPBD
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'deklarationen'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('deklarationen')}
          >
            <QrCode size={16} /> 5. EPD, DPP &amp; Materialpass
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'national'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('national')}
          >
            <ShieldCheck size={16} /> 6. Deutsches Baurecht (GModG, QNG, EBV, Gebäudetyp E)
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DEFINITIONEN: NACHHALTIGKEIT (ALLGEMEIN) & NACHHALTIGES BAUEN      */}
      {/* ========================================================================= */}
      {activeTab === 'definitionen' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Einführung & Leitbild */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-shiraz/10 text-shiraz">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-main">
                  Terminologische &amp; Technische Begriffsbestimmungen
                </h3>
                <p className="text-xs text-text-main/70">
                  Wissenschaftliche Herleitung, völkerrechtliche Meilensteine und ingenieurtechnische Normierung (DIN EN 15643, DIN EN 15978, Leitfaden Nachhaltiges Bauen)
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 text-xs text-text-main/80 leading-relaxed mb-6">
              <p>
                Der Begriff <strong>„Nachhaltigkeit“</strong> entstammt historisch der sächsischen Forstwirtschaft (Hans Carl von Carlowitz, 1713) 
                und wurde über den <strong>Brundtland-Bericht (1987)</strong> und die <strong>Rio-Deklaration (1992)</strong> völkerrechtlich verankert. 
                Im Bauwesen wandelt sich die Definition von einer rein philosophisch-ethischen Leitlinie zu einem 
                <strong> quantifizierbaren, normativ geregelten Ingenieuransatz</strong>: Nachhaltiges Bauen umfasst die integrale Optimierung aller 
                Schutzgüter über den vollständigen Lebenszyklus (Rohstoffgewinnung bis Rezyklierung) auf Basis reproduzierbarer Messgrößen 
                (Ökobilanzierung nach DIN EN 15978, Lebenszykluskosten LCC nach ISO 15686-5 bzw. DIN EN 16627 und soziokulturelle Kriterien nach DIN EN 15643).
              </p>
            </div>

            {/* SEKTION 1: NACHHALTIGKEIT (ALLGEMEIN) */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
                <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                  <Globe className="text-shiraz w-5 h-5" />
                  1. Nachhaltigkeit (Allgemeine Definition)
                </h4>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                  Generelle Definition &amp; Systemtheorie
                </span>
              </div>

              {/* Box: Wortlaut Brundtland */}
              <div className="p-4 rounded-xl border border-shiraz/20 bg-shiraz/5">
                <span className="text-[10px] uppercase font-bold text-shiraz tracking-wider block mb-1">
                  Völkerrechtliche Leitdefinition (WCED 1987 / UN General Assembly)
                </span>
                <blockquote className="text-xs sm:text-sm italic font-medium text-text-main leading-relaxed">
                  „Nachhaltige Entwicklung ist eine Entwicklung, die den Bedürfnissen der heutigen Generation entspricht, 
                  ohne die Möglichkeiten künftiger Generationen zu gefährden, ihre eigenen Bedürfnisse zu befriedigen.“
                </blockquote>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-shiraz/15 text-[11px] text-text-main/70">
                  <span><strong>Quelle:</strong> UN World Commission on Environment and Development (Brundtland-Bericht „Our Common Future“, 1987, Kap. 2)</span>
                  <span className="font-mono">Resolution 42/187 der UN-Generalversammlung</span>
                </div>
              </div>

              {/* Historie & 3-Säulen-Modell */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-home-grau/20 bg-white">
                  <h5 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-700" />
                    Historischer forstwirtschaftlicher Ursprung
                  </h5>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-2">
                    Geprägt von <strong>Hans Carl von Carlowitz (1713)</strong> in seinem Werk <em>„Sylvicultura Oeconomica“</em>: 
                    Es darf in einem Waldgebiet immer nur so viel Holz geschlagen werden, wie durch planmäßige Aufforstung 
                    kontinuierlich nachwachsen kann.
                  </p>
                  <p className="text-[11px] text-text-main/70">
                    <strong>Ingenieurmäßige Übertragung:</strong> Entnahmerate erneuerbarer Ressourcen darf Regenerationsrate nicht übersteigen; 
                    Schadstoffemissionen dürfen Assimilationskapazität der Biosphäre nicht überschreiten (Herman Daly, 1990).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-home-grau/20 bg-white">
                  <h5 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-700" />
                    Das klassische 3-Säulen-Modell &amp; Grenzen des Wachstums
                  </h5>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-2">
                    Gleichrangigkeit von <strong>Ökologie</strong> (Erhalt der natürlichen Lebensgrundlagen), 
                    <strong>Ökonomie</strong> (dauerhafte Tragfähigkeit und Wohlstand) und 
                    <strong>Sozialem</strong> (Verteilungsgerechtigkeit, Gesundheit, Menschenwürde).
                  </p>
                  <p className="text-[11px] text-text-main/70">
                    <strong>Quelle:</strong> Enquete-Kommission des Deutschen Bundestages „Schutz des Menschen und der Umwelt“ (1998); 
                    Meadows et al.: „The Limits to Growth“ (Club of Rome, 1972).
                  </p>
                </div>
              </div>

              {/* Planetare Belastungsgrenzen (Planetary Boundaries) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-off-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <strong className="text-xs font-bold text-text-main flex items-center gap-2">
                    <Target className="w-4 h-4 text-shiraz" />
                    Systemgrenzen: Konzept der planetaren Grenzen (Planetary Boundaries)
                  </strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    Rockström et al. (2009) / Richardson et al. (2023)
                  </span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Nachhaltigkeit bedeutet zwingend das Einhalten des <em>„Safe Operating Space“</em> der Menschheit. 
                  Von den 9 definierten Erdsystemgrenzen sind aktuell 6 überschritten (Klimawandel, Biosphärenintegrität, Landnutzungsänderung, 
                  Süßwassernutzung, biogeochemische Kreisläufe N/P sowie Einbringung neuartiger Stoffe). 
                  Das Bauwesen ist an mindestens 5 dieser Überschreitungen als primärer Verursacher beteiligt.
                </p>
              </div>

              {/* Die drei Umsetzungsstrategien */}
              <div className="p-4 rounded-xl border border-home-grau/20 bg-white">
                <strong className="text-xs font-bold text-text-main block mb-2">
                  Die drei operationellen Grundstrategien nach Huber (1995) &amp; v. Weizsäcker:
                </strong>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-off-white border border-home-grau/20">
                    <strong className="text-shiraz block font-bold mb-1">1. Effizienz</strong>
                    <p className="text-text-main/80 text-[11px] leading-relaxed">
                      Verbesserung des Verhältnisses von Nutzen zu Ressourceneinsatz (z. B. höherfeste Betone mit weniger Zementmasse, Wärmedämmung, LED-Licht).
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-off-white border border-home-grau/20">
                    <strong className="text-shiraz block font-bold mb-1">2. Konsistenz</strong>
                    <p className="text-text-main/80 text-[11px] leading-relaxed">
                      Einklang anthropogener Stoffströme mit biogeochemischen Kreisläufen; abfallfreie Zirkularität (Cradle-to-Cradle, nachwachsende Rohstoffe, 100 % Recycling).
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-off-white border border-home-grau/20">
                    <strong className="text-shiraz block font-bold mb-1">3. Suffizienz</strong>
                    <p className="text-text-main/80 text-[11px] leading-relaxed">
                      Hinterfragen des Bedarfs und Begrenzung des Verbrauchs auf das Notwendige (Reduktion von Wohnfläche pro Kopf, Umbau statt Neubau, Verzicht auf TGA-Überfrachtung).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SEKTION 2: NACHHALTIGES BAUEN */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
                <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                  <Building2 className="text-shiraz w-5 h-5" />
                  2. Nachhaltiges Bauen (Fachspezifische Ingenieurdefinition)
                </h4>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-shiraz/10 text-shiraz font-semibold">
                  Normierte Ingenieurdisziplin
                </span>
              </div>

              {/* Normative Definition nach DIN EN 15643 & BMWSB Leitfaden */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider block mb-1">
                  Normative Begriffsbestimmung (DIN EN 15643 / Leitfaden Nachhaltiges Bauen)
                </span>
                <blockquote className="text-xs sm:text-sm font-medium text-text-main leading-relaxed">
                  „Nachhaltiges Bauen ist die zielgerichtete Konzeption, Planung, Errichtung, Nutzung, Instandhaltung und der Rückbau 
                  von baulichen Anlagen derart, dass über deren gesamten Lebenszyklus hinweg der Verbrauch an Energie und Ressourcen minimiert, 
                  die Umweltwirkungen auf ein zukunftsverträgliches Maß begrenzt, die Lebenszykluskosten optimiert und die gesellschaftlichen 
                  sowie gesundheitlichen Anforderungen an Behaglichkeit, Sicherheit und Funktionalität vollumfänglich erfüllt werden.“
                </blockquote>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-blue-200/60 text-[11px] text-text-main/70">
                  <span><strong>Quellen:</strong> DIN EN 15643 (Nachhaltigkeit von Bauwerken – Allgemeine Grundsätze); BMWSB Leitfaden Nachhaltiges Bauen (2021)</span>
                  <span className="font-mono">DIN EN ISO 15392 (Allgemeine Grundsätze im Hoch- und Tiefbau)</span>
                </div>
              </div>

              {/* Die 3 Schutzziele & Bewertungsdimensionen im Bauwesen */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-home-grau/20 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <strong className="text-xs font-bold text-slate-900 uppercase tracking-wider">1. Ökologische Qualität</strong>
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">LCA</span>
                    </div>
                    <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                      Schutz der globalen und lokalen Umwelt sowie Schonung natürlicher Ressourcen über alle Lebenszyklusphasen.
                    </p>
                    <ul className="text-[11px] text-text-main/70 space-y-1.5 list-disc list-inside">
                      <li><strong>Treibhauspotenzial (GWP)</strong> nach DIN EN 15978 / 15804</li>
                      <li><strong>Graue Energie / Embodied Carbon</strong> (A1–A5)</li>
                      <li><strong>Ressourceninanspruchnahme:</strong> Primärenergie (PENRT/PERE), Süßwasserverbrauch</li>
                      <li><strong>Flächeninanspruchnahme</strong> &amp; Versiegelung</li>
                      <li><strong>Zirkularität &amp; Rückbaubarkeit</strong> (Design for Disassembly)</li>
                    </ul>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono">
                    Referenz: ÖKOBAUDAT / EPD nach DIN EN 15804+A2
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-home-grau/20 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <strong className="text-xs font-bold text-slate-900 uppercase tracking-wider">2. Ökonomische Qualität</strong>
                      <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">LCC</span>
                    </div>
                    <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                      Optimierung der Gesamtwirtschaftlichkeit über den Lebenszyklus; Abkehr von rein investitionskostengetriebener Planung.
                    </p>
                    <ul className="text-[11px] text-text-main/70 space-y-1.5 list-disc list-inside">
                      <li><strong>Lebenszykluskosten (LCC)</strong> nach ISO 15686-5, DIN EN 16627 &amp; DIN 18960</li>
                      <li><strong>Herstellungskosten (KG 300/400)</strong> vs. Betriebs- &amp; Instandhaltungskosten</li>
                      <li><strong>Wertstabilität &amp; Drittverwendungsfähigkeit:</strong> Umnutzungsflexibilität</li>
                      <li><strong>Risikoabsicherung:</strong> Vermeidung von <em>Stranded Assets</em> (CRREM-Pfad)</li>
                      <li><strong>Restwert von Sekundärbaustoffen:</strong> Gebäude als Materialbank</li>
                    </ul>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono">
                    Referenz: DIN 18960 / Barwertmethode (NPV)
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-home-grau/20 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <strong className="text-xs font-bold text-slate-900 uppercase tracking-wider">3. Soziokulturelle &amp; Funktionale Qualität</strong>
                      <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">Komfort</span>
                    </div>
                    <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                      Sicherung von Gesundheit, Behaglichkeit und Leistungsfähigkeit der Nutzer sowie baukulturelle Integration.
                    </p>
                    <ul className="text-[11px] text-text-main/70 space-y-1.5 list-disc list-inside">
                      <li><strong>Gesundheit &amp; Innenraumhygiene:</strong> VOC-Begrenzung (AgBB-Schema), Radon</li>
                      <li><strong>Thermischer Komfort</strong> (Sommerlicher Wärmeschutz DIN 4108-2)</li>
                      <li><strong>Visueller Komfort:</strong> Tageslichtquotient (DIN EN 17037)</li>
                      <li><strong>Akustischer Komfort:</strong> Schallschutz (DIN 4109) &amp; Raumakustik (DIN 18041)</li>
                      <li><strong>Barrierefreiheit</strong> (DIN 18040-1/2) &amp; baukulturelle Gestaltqualität</li>
                    </ul>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono">
                    Referenz: DIN EN 16309 / ASR A3.6 / DIN 18040
                  </div>
                </div>
              </div>

              {/* Querschnittsqualitäten: Technische Qualität & Prozessqualität */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-home-grau/20 bg-white">
                  <strong className="text-xs font-bold text-text-main flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-shiraz" />
                    Technische Qualität (Querschnittskriterium)
                  </strong>
                  <p className="text-xs text-text-main/80 leading-relaxed">
                    Tragsicherheit, Brandschutz (DIN 4102 / DIN EN 13501), Schall- und Feuchteschutz (DIN 4108-3), 
                    Dauerhaftigkeit und Robustheit von Konstruktionen sowie Reinigungs- und Instandhaltungsfreundlichkeit.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-home-grau/20 bg-white">
                  <strong className="text-xs font-bold text-text-main flex items-center gap-2 mb-1">
                    <RefreshCw className="w-4 h-4 text-shiraz" />
                    Prozessqualität (Integrale Planung)
                  </strong>
                  <p className="text-xs text-text-main/80 leading-relaxed">
                    Integrale Planung aller Fachdisziplinen von Leistungsphase 0/1 an, BIM-gestützte Materialnachverfolgung, 
                    strukturierte Baustellenabwicklung, Monitoring und Qualitätssicherung bei Inbetriebnahme (Inbetriebnahmemanagement).
                  </p>
                </div>
              </div>

              {/* Differenzierungs-Matrix: Konventionell vs. Nachhaltig */}
              <div className="overflow-x-auto rounded-xl border border-home-grau/20">
                <table className="w-full text-xs text-left">
                  <thead className="bg-off-white text-text-main border-b border-home-grau/20">
                    <tr>
                      <th className="p-3 font-bold">Kriterium</th>
                      <th className="p-3 font-bold text-slate-600">Konventionelles Bauen</th>
                      <th className="p-3 font-bold text-shiraz">Nachhaltiges Bauen (Stand der Technik)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/10 bg-white text-text-main/80">
                    <tr>
                      <td className="p-3 font-semibold text-text-main">Betrachtungszeitraum</td>
                      <td className="p-3">Errichtung / Übergabe (Investitionskosten KG 300/400)</td>
                      <td className="p-3 font-medium text-text-main">Gesamter Lebenszyklus (50–100 Jahre: Herstellung, Betrieb, Nachnutzung)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-text-main">Klimabilanz</td>
                      <td className="p-3">Fokus nur auf Betriebsenergie (GEG-Primärenergiebedarf)</td>
                      <td className="p-3 font-medium text-text-main">Ganzheitliche Ökobilanz: Embodied Carbon (A1–A5) + Operational Carbon (B1–B7)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-text-main">Baustoffauswahl</td>
                      <td className="p-3">Preis, einfache Verarbeitbarkeit, lineare Entsorgung</td>
                      <td className="p-3 font-medium text-text-main">Zirkularität, Schadstofffreiheit (AgBB), EPD-Deklaration, sortenreine Lösbarkeit</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-text-main">Gebäudebestand</td>
                      <td className="p-3">Abriss und Neubau als Standardreflex</td>
                      <td className="p-3 font-medium text-text-main">Bestandserhalt als Primärstrategie (Erhalt der gebundenen grauen Energie)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-text-main">Lebenszyklusende</td>
                      <td className="p-3">Deponierung oder Downcycling im Straßenunterbau</td>
                      <td className="p-3 font-medium text-text-main">Urban Mining, selektiver Rückbau, Re-Use von Bauteilen, geschlossenes Recycling</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Fundierte Quellenübersicht */}
              <div className="p-4 rounded-xl border border-slate-200 bg-off-white text-xs space-y-2">
                <strong className="text-text-main font-bold flex items-center gap-1.5">
                  <Library className="w-4 h-4 text-shiraz" />
                  Maßgebliche wissenschaftliche &amp; normative Quellenangaben:
                </strong>
                <ul className="text-[11px] text-text-main/70 space-y-1 list-disc list-inside">
                  <li><strong>Brundtland-Bericht:</strong> World Commission on Environment and Development (WCED): <em>Our Common Future</em>, Oxford University Press, 1987.</li>
                  <li><strong>DIN EN 15643:2021-12:</strong> <em>Nachhaltigkeit von Bauwerken – Rahmenbedingungen für die Bewertung von Gebäuden und Ingenieurbauwerken</em>. Beuth Verlag, Berlin.</li>
                  <li><strong>DIN EN 15978:2012-10:</strong> <em>Nachhaltigkeit von Bauwerken – Bewertung der umweltbezogenen Qualität von Gebäuden – Berechnungsverfahren</em>. Beuth Verlag.</li>
                  <li><strong>DIN EN ISO 15392:2020-05:</strong> <em>Nachhaltigkeit im Hoch- und Tiefbau – Allgemeine Grundsätze</em> (ISO 15392:2019).</li>
                  <li><strong>BMWSB (Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen):</strong> <em>Leitfaden Nachhaltiges Bauen – Zukunftsfähiges Planen, Bauen und Betreiben von Gebäuden</em>, Berlin, 2021.</li>
                  <li><strong>Rockström, J. et al. / Richardson, K. et al.:</strong> <em>Earth beyond six of nine planetary boundaries</em>, Science Advances 9 (37), 2023.</li>
                  <li><strong>Carlowitz, H. C. v.:</strong> <em>Sylvicultura Oeconomica, oder haußwirthliche Nachricht und Naturmäßige Anweisung zur Wilden Baum-Zucht</em>, Leipzig, 1713.</li>
                  <li><strong>Daly, H. E.:</strong> <em>Toward some operational principles of sustainable development</em>, Ecological Economics 2 (1), 1990, S. 1–6.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ANTEILE & STOFFSTRÖME DES BAUWESENS                                */}
      {/* ========================================================================= */}
      {activeTab === 'kennzahlen' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Key Metric Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Treibhausgase (THG)</span>
                <strong className="text-3xl font-extrabold text-shiraz block mt-1">~40 %</strong>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">der globalen energiebed. CO₂-Emissionen</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                Davon ca. 28 % aus dem laufenden Gebäudebetrieb (Heizung, Warmwasser, Kühlung) und ca. 11–12 % als <em>graue Emissionen</em> aus der Baustoffherstellung.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Ressourcen &amp; Rohstoffe</span>
                <strong className="text-3xl font-extrabold text-slate-900 block mt-1">&gt; 50 %</strong>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">des weltweiten Rohstoffverbrauchs</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                Massenrohstoffe Sand, Kies, Kalkstein, Tone, Gips und Natursteine übersteigen global das Fördervolumen aller anderen Wirtschaftszweige zusammen.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Abfallaufkommen (Deutschland)</span>
                <strong className="text-3xl font-extrabold text-amber-700 block mt-1">~55 %</strong>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">des gesamten deutschen Abfalls</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                Mit rund <strong>220 bis 230 Millionen Tonnen</strong> jährlich stellen Bau- und Abbruchabfälle den mit Abstand größten nationalen Abfallstrom dar.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Flächeninanspruchnahme</span>
                <strong className="text-3xl font-extrabold text-emerald-700 block mt-1">~52 ha/d</strong>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">täglicher Flächenverbrauch (DE)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                Siedlungs- und Verkehrsfläche wächst täglich. Ziel der Bundes-Nachhaltigkeitsstrategie: Reduktion auf unter <strong>30 ha/Tag</strong> bis 2030 (Netto-Null bis 2050).
              </p>
            </div>
          </div>

          {/* Deep Dive Section: Der Stoffstrom des Bauens */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Zusammensetzung der 220–230 Mio. Tonnen Bauabfälle in Deutschland
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Datenquelle: Umweltbundesamt (UBA) &amp; Bundesverband Baustoffe – Steine und Erden (BBS)
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-bold">
                Kreislaufwirtschafts-Potenzial
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-xs font-bold text-slate-900">1. Bodenaushub</strong>
                    <span className="text-xs font-mono font-bold text-shiraz">~130 Mio. t</span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-relaxed">
                    Größte Einzelfraktion (ca. 58 % der Bauabfälle). Häufig Verfüllung in Tagebauen oder Deponien, statt hochwertiger Wiederaufbereitung im Tiefbau.
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-2">EBV-Klasse: BM-0 bis BM-F3</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-xs font-bold text-slate-900">2. Bauschutt</strong>
                    <span className="text-xs font-mono font-bold text-shiraz">~60 Mio. t</span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-relaxed">
                    Beton, Ziegel, Fliesen, Keramik. Wird heute zu ca. 80 % zu RC-Schotter für ungebundene Tragschichten im Straßenbau „downgecycelt“.
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-2">EBV-Klasse: RC-1 bis RC-3</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-xs font-bold text-slate-900">3. Straßenaufbruch</strong>
                    <span className="text-xs font-mono font-bold text-shiraz">~15–20 Mio. t</span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-relaxed">
                    Asphalt und Schotter. Hohe stoffliche Recyclingquote (oft &gt; 90 % als Heißmischgut), problematisch sind historische teer-/PAK-haltige Schichten.
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-2">EBV-Klasse: RC-Asphalt</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-xs font-bold text-slate-900">4. Baustellenabfälle &amp; Gips</strong>
                    <span className="text-xs font-mono font-bold text-shiraz">~15 Mio. t</span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-relaxed">
                    Gemischte Fraktionen, Dämmstoffe, Holz, Metalle, Gipsplatten. Gipsabfälle müssen sulfatbedingt getrennt werden (Gips-zu-Gips-Recycling).
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-2">GewAbfV Trennpflicht</span>
              </div>
            </div>

            {/* Interactive Recycling Impact Calculator */}
            <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 mt-2 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <RefreshCw size={14} className="text-emerald-700" />
                  Interaktiver Stoffstrom-Rechner: Urban Mining Potenzial
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800">
                  Eingabe: {formatDeWert(interactiveMasse)} Tonnen Bauschutt
                </span>
              </div>

              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={interactiveMasse}
                onChange={(e) => setInteractiveMasse(parseInt(e.target.value))}
                className="w-full h-1 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-3 rounded-lg border border-emerald-150 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">Hochwertiger R-Beton (Typ 1/2):</span>
                  <strong className="text-sm font-mono font-bold text-emerald-900">{calculatedRcBeton} t</strong>
                  <span className="text-[9px] text-slate-400 block mt-0.5">als Gesteinskörnung</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-150 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">Tragschichten / Unterbau:</span>
                  <strong className="text-sm font-mono font-bold text-slate-800">{calculatedUnterbau} t</strong>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Frostschutz / Wege</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-150 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">Restfraktion (Deponie):</span>
                  <strong className="text-sm font-mono font-bold text-amber-700">{calculatedDeponie} t</strong>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Feinanteile / Störstoffe</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-150 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">Eingespartes Primär-CO₂:</span>
                  <strong className="text-sm font-mono font-bold text-emerald-700">~{savedCo2Tons} t CO₂e</strong>
                  <span className="text-[9px] text-slate-400 block mt-0.5">vermiedene Transporte/Abbau</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KLIMAKONFERENZEN & UN-SDGS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'klimapolitik' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Timeline of International Milestones */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Die internationale Klimadiplomatie und ihre Auswirkung auf das Bauen
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Von der UN-Klimarahmenkonvention (UNFCCC) bis zum Pariser 1,5 °C-Ziel.</p>
            </div>

            <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6 py-2">
              {[
                {
                  year: '1987',
                  title: 'Brundtland-Bericht („Our Common Future“)',
                  desc: 'Formulierung des Drei-Säulen-Modells der Nachhaltigkeit (Ökologie, Ökonomie, Soziales). Grundsatz: Bedürfnisse der Gegenwart befriedigen, ohne die Möglichkeiten zukünftiger Generationen zu gefährden.'
                },
                {
                  year: '1992',
                  title: 'UN-Erdgipfel in Rio de Janeiro (Agenda 21)',
                  desc: 'Verabschiedung der Klimarahmenkonvention (UNFCCC) und der Agenda 21. Etablierung des Leitfadens Nachhaltiges Bauen und Startschuss für nationale Nachhaltigkeitsstrategien.'
                },
                {
                  year: '1997',
                  title: 'Kyoto-Protokoll (COP 3)',
                  desc: 'Erstmals völkerrechtlich verbindliche Reduktionsziele für Treibhausgase in Industrieländern. Einführung der Marktmechanismen (Emissionszertifikatehandel).'
                },
                {
                  year: '2015',
                  title: 'Pariser Klimaschutzabkommen (COP 21)',
                  desc: 'Völkerrechtliche Verpflichtung zur Begrenzung der globalen Erwärmung auf deutlich unter 2,0 °C, möglichst 1,5 °C gegenüber vorindustriellen Werten. Grundlage für den CRREM-Dekarbonisierungspfad im Gebäudesektor.'
                },
                {
                  year: '2019',
                  title: 'European Green Deal',
                  desc: 'Fahrplan der EU-Kommission zur Transformation Europas zum ersten klimaneutralen Kontinent bis 2050. Start der „Renovation Wave“ (Renovierungswelle zur Verdopplung der Sanierungsrate).'
                },
                {
                  year: '2023 / 2024',
                  title: 'Dubai COP 28 & Novelle der EPBD (EU 2024/1275)',
                  desc: 'Historischer Konsens zur Abkehr von fossilen Brennstoffen („Transitioning away from fossil fuels“). Gesetzliche Festschreibung von Zero Emission Buildings (ZEB) im EU-Recht.'
                }
              ].map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-shiraz group-hover:bg-shiraz transition-colors" />
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-mono font-bold text-shiraz">{item.year}</span>
                    <strong className="text-xs font-bold text-slate-900">{item.title}</strong>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive UN Sustainable Development Goals (SDGs) for Construction */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Die 17 UN-Nachhaltigkeitsziele (SDGs) im Bauingenieurwesen
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Wählen Sie ein SDG, um die konkreten baupraktischen Handlungsfelder anzuzeigen.</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold">
                UN Agenda 2030
              </span>
            </div>

            {/* Legend for Construction Relevance */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-home-grau/20">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded border border-red-500 bg-red-50 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                </span>
                <span className="text-slate-800">
                  <strong className="text-red-600 font-bold">Dünner roter Rand:</strong> Direkte Kern- &amp; Praxisrelevanz für das Bauwesen, Baustoffe &amp; Planung (9 von 17 SDGs)
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                <span className="w-4 h-4 rounded border border-slate-200 bg-white shrink-0"></span>
                <span>Grauer Rand: Übergreifende globale Entwicklungsziele</span>
              </div>
            </div>

            {/* All 17 SDGs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {ALL_17_SDGS.map((sdg) => {
                const isSelected = selectedSdg === sdg.num;
                return (
                  <button
                    key={sdg.num}
                    type="button"
                    onClick={() => setSelectedSdg(sdg.num)}
                    className={`p-2.5 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      sdg.bauRelevant
                        ? 'border border-red-500 shadow-2xs'
                        : 'border border-slate-200 shadow-2xs'
                    } ${
                      isSelected
                        ? sdg.bauRelevant
                          ? 'bg-shiraz text-white border-red-600 ring-2 ring-red-400/40 shadow-xs'
                          : 'bg-shiraz/80 text-white border-shiraz shadow-xs'
                        : sdg.bauRelevant
                          ? 'bg-white hover:bg-red-50/50 text-slate-800'
                          : 'bg-slate-50/70 hover:bg-slate-100/80 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center w-full">
                      <span className={`w-5 h-5 rounded ${sdg.badgeBg} text-white flex items-center justify-center font-mono font-bold text-[10px]`}>
                        {sdg.num}
                      </span>
                    </div>
                    <span className="font-bold text-[11px] leading-tight line-clamp-2">
                      {sdg.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* SDG Detail Content Card */}
            {(() => {
              const currentSdg = ALL_17_SDGS.find(s => s.num === selectedSdg) || ALL_17_SDGS[10];
              return (
                <div className={`p-5 rounded-xl border text-xs leading-relaxed transition-all ${
                  currentSdg.bauRelevant 
                    ? 'border-red-400 bg-red-50/20' 
                    : 'border-slate-200 bg-slate-50/70'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3 mb-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-md ${currentSdg.badgeBg} text-white flex items-center justify-center font-mono font-bold text-xs`}>
                        {currentSdg.num}
                      </span>
                      <span>{currentSdg.fullName}</span>
                    </h4>
                    {currentSdg.bauRelevant ? (
                      <span className="self-start sm:self-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                        {currentSdg.relevanceLabel || 'Direkte Kernrelevanz für das Bauwesen'}
                      </span>
                    ) : (
                      <span className="self-start sm:self-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200/80 text-slate-600">
                        Sektorübergreifendes Rahmenziel
                      </span>
                    )}
                  </div>

                  <p className="italic text-slate-500 mb-2">
                    UN-Leitsatz: &bdquo;{currentSdg.englishTitle}&ldquo;
                  </p>

                  <p className="text-slate-800 leading-relaxed mb-3">
                    <strong>Baupraxis-Relevanz:</strong> {currentSdg.baupraxis}
                  </p>

                  {currentSdg.measures.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <strong className="text-[11px] text-slate-700 block mb-1">
                        Konkrete Handlungsfelder &amp; Maßnahmen im Bauwesen:
                      </strong>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                        {currentSdg.measures.map((m, idx) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: EU-TAXONOMIE & EPBD                                                */}
      {/* ========================================================================= */}
      {activeTab === 'regulatorik' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Quick jump to comprehensive Rechtsrahmen-Kompendium */}
          <div className="bg-white border border-home-grau/30 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <span className="text-xs font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                <Scale size={15} /> Neu: Vollständiges Rechtsrahmen- &amp; Hierarchie-Kompendium
              </span>
              <p className="text-xs text-text-main/80 leading-relaxed max-w-2xl">
                Hierarchische 5-Ebenen-Systematik aller 21 Rechtsakte (Green Deal, EU-Klimagesetz, Fit for 55, BauPVO 2024, EPBD, ESPR, CBAM, EU-ETS I/II, GEG, Gebäudetyp E u.v.m.) mit interaktiver Zeitleiste, Synopse-Matrix und Stichtags-Filtern.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setGlobalTab('oekobilanz_lca')}
              className="px-4 py-2.5 bg-shiraz text-white rounded-xl text-xs font-bold hover:bg-shiraz/90 transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-sm self-start sm:self-center"
            >
              Zum Rechtsrahmen-Kompendium <ArrowRight size={14} />
            </button>
          </div>

          {/* EU-Taxonomie Overview */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  EU-Taxonomie-Verordnung (EU 2020/852) im Bausektor
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Das EU-Klassifikationssystem für ökologisch nachhaltige Wirtschaftsaktivitäten und Green Finance.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold">
                Taxonomie-Konformität
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Damit ein Bau- oder Immobilienprojekt als „taxonomiekonform“ eingestuft wird, muss es einen 
              <strong> wesentlichen Beitrag (*Substantial Contribution*)</strong> zu mindestens einem der sechs EU-Umweltziele leisten und 
              gleichzeitig das Prinzip <strong>*Do No Significant Harm (DNSH)*</strong> (keine wesentliche Beeinträchtigung der übrigen fünf Ziele) strikt einhalten:
            </p>

            {/* 6 Environmental Goals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 1, title: '1. Klimaschutz (Climate Mitigation)', desc: 'Neubau: Primärenergiebedarf mind. 10 % unter NZEB/GEG. Bei Gebäuden > 5 000 m² zusätzlich Berechnung und Offenlegung des Lebenszyklus-GWP (Delegierte VO (EU) 2021/2139, Anhang I, 7.1).' },
                { id: 2, title: '2. Anpassung an Klimawandel (Adaptation)', desc: 'Klimarisiko- und Vulnerabilitätsanalyse (Hitze, Hochwasser, Sturm) über 30 Jahre; Umsetzung physischer Anpassungsmaßnahmen.' },
                { id: 3, title: '3. Wasser- & Meeresressourcen', desc: 'Wassersparende Armaturen (Durchflussbegrenzer, Grauwassernutzung); Schutz vor Schadstoffeinträgen in Grundwasser.' },
                { id: 4, title: '4. Übergang zur Kreislaufwirtschaft', desc: 'Mindestens 70 % der nicht gefährlichen Bau- und Abbruchabfälle müssen stofflich wiederverwendet oder recycelt werden (Design for Deconstruction).' },
                { id: 5, title: '5. Vermeidung von Umweltverschmutzung', desc: 'Strikter Ausschluss gefährlicher Stoffe (Asbest, FCKW, SVHC nach REACH, schädliche Weichmacher und Biozide in Putzen).' },
                { id: 6, title: '6. Schutz von Biodiversität & Ökosystemen', desc: 'Bauen nur auf vorbelasteten/ausgewiesenen Flächen; Ausschluss von Schutzgebieten, Mooren und wertvollen Agrarflächen.' }
              ].map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => setSelectedTaxonomyGoal(goal.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedTaxonomyGoal === goal.id
                      ? 'border-shiraz bg-shiraz/5 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <strong className={`block text-xs font-bold ${selectedTaxonomyGoal === goal.id ? 'text-shiraz' : 'text-slate-900'}`}>
                    {goal.title}
                  </strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{goal.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
              <span>Bedeutung für Projektentwickler &amp; Banken:</span>
              <strong className="font-bold text-shiraz">Taxonomiequote (CapEx/OpEx) bestimmt Zinssätze und ESG-Fonds-Fähigkeit</strong>
            </div>
          </div>

          {/* EPBD Novelle (EU 2024/1275) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Die neue EU-Gebäuderichtlinie (EPBD 2024/1275): Roadmap bis 2050
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Inkrafttreten im Mai 2024 mit zwingender Transformation im nationalen GEG.</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold">
                EPBD Novelle 2024
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 block uppercase">Stufe 1 (ab 2028)</span>
                  <strong className="text-sm font-bold text-slate-900 block mt-1">Öffentliche Nullemissionsgebäude</strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Alle neuen Gebäude im Eigentum oder in der Nutzung öffentlicher Einrichtungen müssen als <strong>Zero Emission Buildings (ZEB)</strong> errichtet werden.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-blue-900 mt-3 pt-2 border-t border-blue-200">Vorbildfunktion der öffentlichen Hand</span>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 block uppercase">Stufe 2 (ab 2030)</span>
                  <strong className="text-sm font-bold text-slate-900 block mt-1">ZEB &amp; Whole-Life Carbon für alle Neubauten</strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Ausnahmslos alle neuen Gebäude müssen Nullemissionsgebäude sein. Pflicht zur Ermittlung und Ausweisung des <strong>Lebenszyklus-GWP</strong> im Energieausweis!
                  </p>
                </div>
                <span className="text-[10px] font-bold text-blue-900 mt-3 pt-2 border-t border-blue-200">GWP-Grenzen im Bauantrag</span>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 block uppercase">Fossil-Ausstieg (2025–2040)</span>
                  <strong className="text-sm font-bold text-slate-900 block mt-1">Heizungs-Dekarbonisierung</strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Ab <strong>2025</strong> keine staatlichen Subventionen mehr für eigenständige fossile Kessel. 
                    Bis spätestens <strong>2040</strong> vollständiger Ausstieg aus fossilen Brennstoffen zur Gebäudeheizung.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-blue-900 mt-3 pt-2 border-t border-blue-200">Verbot von Gas-/Ölheizungen</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: EPD, DIGITALER PRODUKTPASS & MATERIALPASS                          */}
      {/* ========================================================================= */}
      {activeTab === 'deklarationen' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Umweltproduktdeklarationen (EPD) nach DIN EN 15804+A2
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Typ-III-Umweltdeklarationen nach ISO 14025 als mathematische Datenbasis der Gebäude-Ökobilanz.</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold">
                DIN EN 15804+A2
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2">
                <strong className="text-xs font-bold text-slate-900 block">Die 4 normativen GWP-Kernindikatoren:</strong>
                <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li><strong className="text-slate-800">GWP-total:</strong> Summenwert aller Treibhausgasemissionen und -senken.</li>
                  <li><strong className="text-slate-800">GWP-fossil:</strong> Emissionen aus Verbrennung fossiler Brennstoffe und Klinkerbrennprozessen.</li>
                  <li><strong className="text-slate-800">GWP-biogenic:</strong> CO₂-Aufnahme im Pflanzenwachstum (als negativer Wert verbucht) und thermische Freisetzung in C3/C4.</li>
                  <li><strong className="text-slate-800">GWP-luluc:</strong> Treibhauspotenzial infolge von Landnutzung und Landnutzungsänderung (*Land use &amp; land-use change*).</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2">
                <strong className="text-xs font-bold text-slate-900 block">Generische vs. Spezifische EPDs:</strong>
                <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li><strong className="text-slate-800">Generisch (ÖKOBAUDAT):</strong> Durchschnittswerte für frühe Entwurfsphasen (LPH 1–3). Im QNG/BNB mit +10 % Sicherheitsaufschlag belegt!</li>
                  <li><strong className="text-slate-800">Herstellerspezifisch (z.B. IBU):</strong> Geprüfte Primärdaten eines konkreten Zement- oder Holzwerks ohne Sicherheitsaufschlag; zwingend für Endzertifizierung.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Digitaler Produktpass (DPP) & Madaster */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Digitaler Produktpass (DPP) &amp; Gebäude-Materialpass
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rechtsrahmen: EU-Ökodesign-Verordnung (ESPR 2024) und novellierte Bauprodukteverordnung (CPR 2024).
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-50 text-purple-800 rounded font-bold">
                ESPR &amp; CPR
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-purple-150 bg-purple-50/50 flex flex-col justify-between">
                <div>
                  <QrCode size={20} className="text-purple-700 mb-2" />
                  <strong className="text-xs font-bold text-slate-900 block">Digital Product Passport (DPP)</strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Jedes Bauprodukt erhält einen maschinenlesbaren Datenträger (z.B. QR-Code). Ermöglicht die Rückverfolgbarkeit von Inhaltsstoffen, Rezyklatanteilen, Demontageanleitungen und CO₂-Fußabdruck über die gesamte Lieferkette.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-purple-900 mt-3 pt-2 border-t border-purple-200">Rechtspflicht nach EU-Ökodesign</span>
              </div>

              <div className="p-4 rounded-xl border border-purple-150 bg-purple-50/50 flex flex-col justify-between">
                <div>
                  <Building2 size={20} className="text-purple-700 mb-2" />
                  <strong className="text-xs font-bold text-slate-900 block">Gebäude-Materialpass (Madaster)</strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Dokumentiert Art, Masse, Einbauort und Lösbarkeit aller Bauteile eines Gebäudes. Berechnet den <strong>Circularity Index (CI)</strong> und den monetären Restwert der Materialien am Lebensende.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-purple-900 mt-3 pt-2 border-t border-purple-200">Grundlage für Urban Mining</span>
              </div>

              <div className="p-4 rounded-xl border border-purple-150 bg-purple-50/50 flex flex-col justify-between">
                <div>
                  <RefreshCw size={20} className="text-purple-700 mb-2" />
                  <strong className="text-xs font-bold text-slate-900 block">Design for Disassembly</strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Konstruieren mit trennbaren mechanischen Verbindungen (Verschrauben, Stecken) statt vollflächiger chemischer Verklebung. Ermöglicht sortenreinen Rückbau ohne Downcycling.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-purple-900 mt-3 pt-2 border-t border-purple-200">Zirkularitätsgrad &gt; 80 %</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DEUTSCHES BAURECHT (GModG, QNG, EBV, Gebäudetyp E)                          */}
      {/* ========================================================================= */}
      {activeTab === 'national' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Die fünf Säulen des deutschen Nachhaltigkeits-Baurechts
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vom Gebäudemodernisierungsgesetz (GModG, vormals GEG) über die Ersatzbaustoffverordnung bis zum Gebäudetyp-E-Vorhaben.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold">
                Bundesrecht
              </span>
            </div>

            <div className="space-y-4">
              {/* GEG */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-slate-900">1. Gebäudeenergiegesetz (GEG 2024)</strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">Energie</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Regelt den primärenergetischen Effizienzhausstandard (EH 55 als Neubaustandard) und die <strong>65 %-Erneuerbare-Energien-Vorgabe</strong> für neu eingebaute Heizungsanlagen (Kopplung an die kommunale Wärmeplanung).
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono">Max. Transmissionswärmeverlust</span>
                  <strong className="text-xs font-mono font-bold text-slate-800">H'T-Grenzwerte</strong>
                </div>
              </div>

              {/* QNG */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-slate-900">2. Qualitätssiegel Nachhaltiges Gebäude (QNG)</strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Förderung</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Staatliches Gütesiegel des BMWSB für zinsgünstige KfW-Förderdarlehen (Klimafreundlicher Neubau KFN) und degressive AfA (5 %). 
                    Grenzwerte: <strong>QNG-Plus (<InlineMath math="\le 24\,\text{kg CO}_2\text{e}/(\text{m}^2\cdot\text{a})" />)</strong> und <strong>QNG-Premium (<InlineMath math="\le 20\,\text{kg CO}_2\text{e}/(\text{m}^2_{\text{NRF}}\cdot\text{a})" />)</strong> für Wohngebäude (WG23) über 50 Jahre Betrachtungszeitraum.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono">Nachweis-Zeithorizont</span>
                  <strong className="text-xs font-mono font-bold text-emerald-700">50 Jahre</strong>
                </div>
              </div>

              {/* EBV */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-slate-900">3. Ersatzbaustoffverordnung (EBV seit 01.08.2023)</strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Kreislauf</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Bundesweit harmonisierte Qualitätsanforderungen für mineralische Ersatzbaustoffe (RC-1 bis RC-3, Bodenmaterial BM-0 bis BM-F3, Gleisschotter). 
                    Regelt Grundwasserschutz und Kataster-Anzeigepflicht nach § 25 EBV bei Einbaumengen ab <strong>250 m³</strong>.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono">Schwellenwert Kataster</span>
                  <strong className="text-xs font-mono font-bold text-amber-800">&ge; 250 m³</strong>
                </div>
              </div>

              {/* KrWG */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-slate-900">4. Kreislaufwirtschaftsgesetz (KrWG)</strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">Hierarchie</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Verbindliche 5-stufige Abfallhierarchie: 1. Vermeidung &gt; 2. Vorbereitung zur Wiederverwendung &gt; 3. Recycling &gt; 4. sonstige Verwertung &gt; 5. Beseitigung (Deponierung als Ultima Ratio).
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono">Grundsatz</span>
                  <strong className="text-xs font-mono font-bold text-purple-800">Vermeidung vor Beseitigung</strong>
                </div>
              </div>

              {/* Gebäudetyp E */}
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-slate-900">5. Gebäudetyp E (Gesetzesvorhaben)</strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">Suffizienz</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Soll fachkundigen Baupartnern das rechtlich belastbare Abweichen von reinen Komfort- und Ausstattungsnormen ohne Sachmangelrisiko nach § 633 BGB ermöglichen. Der Entwurf von 2024 (BT-Drs. 20/13959) ist mit der 20. Wahlperiode erledigt; seit November 2025 liegen Eckpunkte für einen neuen Entwurf vor (Stand manuell prüfen). 
                    Grundlegende öffentlich-rechtliche Schutzziele (Standsicherheit, Brandschutz, Gesundheit, Schall- und Wärmeschutz) bleiben gewahrt.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono">Kabinett Nov. 2024</span>
                  <strong className="text-xs font-mono font-bold text-rose-800">Einfaches Bauen</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: EU-Taxonomie – Primärenergie-Kriterium für einen Neubau"
        zielGleichung="Q_{P} \le 0{,}90 \cdot Q_{P,\text{NZEB}}"
        schritte={[
          { titel: 'NZEB-Schwelle', erklaerung: 'In Deutschland entspricht der Niedrigstenergiegebäude-Standard der Neubauanforderung nach GModG § 15 (0,55 · Referenzgebäude). Angenommen: zulässiger Wert 40 kWh/(m²a).', formel: 'Q_{P,\\text{NZEB}} = 40\\,\\text{kWh/(m}^2\\text{a)}' },
          { titel: 'Taxonomie-Schwelle', erklaerung: 'Neubau, Klimaschutz-Kriterium: mindestens 10 % unter NZEB:', formel: 'Q_{P,\\text{Tax}} = 0{,}90 \\cdot 40 = 36\\,\\text{kWh/(m}^2\\text{a)}' },
          { titel: 'Prüfung', erklaerung: 'Planungswert 34 kWh/(m²a):', formel: '34 \\le 36 \\Rightarrow \\text{Kriterium erfüllt}' }
        ]}
        ergebnisHinweis="Für Gebäude über 5 000 m² ist zusätzlich das Lebenszyklus-GWP zu berechnen und offenzulegen; außerdem gelten Luftdichtheits- bzw. Thermografie-Nachweise und die DNSH-Kriterien."
        normQuelle="Delegierte VO (EU) 2021/2139, Anhang I, Abschnitt 7.1 (Stand manuell prüfen)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: CRREM-Pfad – wann wird ein Bürogebäude „stranded“?"
        zielGleichung="I_{\text{Ziel}}(t) = I_{2020} - \frac{I_{2020} - I_{2030}}{10} \cdot (t - 2020)"
        schritte={[
          { titel: 'Pfad (Lehrwerte)', erklaerung: 'Linear zwischen 52 kg CO₂e/(m²a) im Jahr 2020 und 18 kg CO₂e/(m²a) im Jahr 2030:', formel: 'I_{\\text{Ziel}}(2026) = 52 - 3{,}4 \\cdot 6 = 31{,}6\\,\\text{kg CO}_2\\text{e/(m}^2\\text{a)}' },
          { titel: 'Ist-Intensität', erklaerung: 'Betriebsemissionen des Gebäudes:', formel: 'I_{\\text{Ist}} = 32{,}0 > 31{,}6' },
          { titel: 'Misalignment Year', erklaerung: 'Ohne Maßnahmen liegt das Gebäude bereits 2026 über dem Pfad; eine Senkung auf 20 kg CO₂e/(m²a) verschiebt den Schnittpunkt:', formel: '52 - 3{,}4 \\cdot (t - 2020) = 20 \\Rightarrow t \\approx 2029{,}4' }
        ]}
        ergebnisHinweis="CRREM-Pfade sind länder- und nutzungsspezifisch; für Investitionsentscheidungen sind die aktuellen veröffentlichten Pfade zu verwenden, nicht diese Lehrwerte."
        normQuelle="CRREM-Methodik (Lehrbeispiel)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="nachhaltigkeit_daten_regeln" />

      {/* Standardized ModuleFooter according to Styleguide */}
      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 7 Nachhaltigkeit: QNG, EPBD, Taxonomie, ETS II, Gebäudetyp E und GModG auf Rechtsstand Oktober 2026 geprüft; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Ziele für nachhaltige Entwicklung (SDGs)', url: 'https://de.wikipedia.org/wiki/Ziele_f%C3%BCr_nachhaltige_Entwicklung' },
          { title: 'EU-Taxonomie', url: 'https://de.wikipedia.org/wiki/EU-Taxonomie' },
          { title: 'Richtlinie über die Gesamtenergieeffizienz von Gebäuden (EPBD)', url: 'https://de.wikipedia.org/wiki/Richtlinie_%C3%BCber_die_Gesamtenergieeffizienz_von_Geb%C3%A4uden' },
          { title: 'Ersatzbaustoffverordnung (EBV)', url: 'https://de.wikipedia.org/wiki/Ersatzbaustoffverordnung' }
        ]}
        literatur={[
          'Hegger, M.; Auch-Schwelk, V.; Fuchs, M.; Rosenkranz, T.: Baustoff Atlas. München: Edition Detail 2005',
          'Klöpffer, W.; Grahl, B.: Ökobilanz (LCA) – Ein Leitfaden für Ausbildung und Beruf. Weinheim: Wiley-VCH 2009',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Bundesbauministerium (Hrsg.): Leitfaden Nachhaltiges Bauen – Zukunftsfähiges Planen, Bauen und Betreiben von Gebäuden. Berlin (aktuelle Auflage manuell prüfen)',
          'Nagler, F. et al.: Forschungsprojekt „Einfach Bauen“, Forschungshäuser Bad Aibling, TU München (Veröffentlichung manuell prüfen)'
        ]}
        regelwerke={[
          { title: 'DIN EN 15643:2021-12 (Nachhaltigkeit von Bauwerken – Allgemeine Rahmenbedingungen zur Bewertung von Gebäuden und Ingenieurbauwerken)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+15643' },
          { title: 'DIN EN ISO 15392 (Nachhaltigkeit von Bauwerken – Allgemeine Grundsätze; Ausgabe manuell prüfen)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+ISO+15392' },
          { title: 'EPBD – Richtlinie (EU) 2024/1275 (Neufassung; Nullemissionsgebäude ab 2028/2030, Lebenszyklus-GWP Art. 7)', url: 'https://eur-lex.europa.eu/' },
          { title: 'EU-Taxonomie-Verordnung (EU) 2020/852 mit Delegierter VO (EU) 2021/2139 (Klimaschutz-Kriterien)', url: 'https://eur-lex.europa.eu/' },
          { title: 'DIN EN 15804:2022-03 (EN 15804:2012+A2:2019+AC:2021; Umweltproduktdeklarationen)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+15804' },
          { title: 'DIN EN 15978:2026-09 (Bewertung der Umweltqualität von Gebäuden; ersetzt 2012-10)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+15978' },
          { title: 'Gebäudemodernisierungsgesetz (GModG, seit 29.07.2026; vormals GEG)', url: 'https://www.gesetze-im-internet.de/geg/' },
          { title: 'Ersatzbaustoffverordnung (EBV, in Kraft seit 01.08.2023; Novelle in Vorbereitung)', url: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/' }
        ]}
        formeln={[
          {
            formel: 'GWP_{\\text{Gebäude}} = \\sum_{i} m_i \\cdot GWP_{\\text{A1-A3},i} + \\sum_{t=1}^{50} E_t \\cdot f_{\\text{CO2},t} \\quad [\\text{kg CO}_2\\text{-eq}]',
            erklaerung: 'Vereinfachte Lebenszyklus-Treibhausgasbilanz über 50 Jahre (QNG, EPBD) mit Herstellung (A1–A3) und Betrieb (B6); vollständig zusätzlich Austausch (B4) und Lebensende (C3/C4).',
            quelle: 'DIN EN 15978 / QNG'
          },
          {
            formel: '\\text{MCI} = 1 - \\text{LFI} \\cdot \\frac{0{,}9}{X}, \\quad X = \\frac{L}{L_{av}} \\cdot \\frac{U}{U_{av}}',
            erklaerung: 'Material Circularity Indicator: LFI = Linear Flow Index (Anteil linearer Stoffflüsse aus Primärrohstoff und Abfall), X = Nutzungsfaktor aus Lebensdauer L und Nutzungsintensität U relativ zum Branchendurchschnitt. Der Madaster-Zirkularitätsindex baut auf diesem Ansatz auf.',
            quelle: 'Ellen MacArthur Foundation / Granta Design: Material Circularity Indicator'
          },
          {
            formel: '\\text{GHG-Intensität} = \\frac{\\sum_{j} E_j \\cdot f_{\\text{CO2},j}}{\\text{NFA}} \\le \\text{Target}_{\\text{CRREM}}(t) \\quad [\\text{kg CO}_2\\text{e/(m}^2_{\\text{NFA}}\\cdot\\text{a})]',
            erklaerung: 'CRREM-Dekarbonisierungspfad: Zulässige flächenbezogene Treibhausgasemissionen des Gebäudebetriebs pro Jahr im Pariser 1,5°C-Ziel bis zum Zielwert 0 im Jahr 2050.',
            quelle: 'CRREM v2 / EU-Taxonomie'
          }
        ]}
      />
    </div>
  );
}
