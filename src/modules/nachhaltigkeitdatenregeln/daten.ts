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
