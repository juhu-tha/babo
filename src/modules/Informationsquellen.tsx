import React, { useState } from 'react';
import { 
  Search, 
  ExternalLink, 
  Building2, 
  Database, 
  Layers, 
  Info, 
  CheckCircle2, 
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { OerEncyclopedia } from '@/src/components/ui/OerEncyclopedia';
import { NormenLinkMonitor } from '@/src/components/ui/NormenLinkMonitor';

// Robust, comprehensive evaluation data
interface DBRecord {
  id: string;
  name: string;
  category: 'Allgemein' | 'Baustoffe & Produkte' | 'Tragwerk & Holz' | 'Bauphysik & Altbau' | 'Schadstoffe & Praxis' | 'Nachhaltigkeit';
  discipline: string;
  publisher: string;
  accessibility: string;
  url?: string;
  isBeta?: boolean;
  standards: string[];
  evaluation: string;
  benefits: string[];
  relevance: string;
  tip: string;
}

const FREE_DATABASES: DBRecord[] = [
  {
    id: 'lfu_schadstoff',
    name: 'Schadstoffratgeber Gebäuderückbau',
    category: 'Schadstoffe & Praxis',
    discipline: 'LABOR & AUSWERTUNG',
    publisher: 'Bayerisches Landesamt für Umwelt (LfU Bayern)',
    accessibility: '100% Kostenfrei, öffentlich zugänglich',
    url: 'https://www.lfu.bayern.de/',
    standards: ['VDI 6202 Blatt 1', 'TRGS 519', 'LAbgBauVO'],
    evaluation: 'Ein herausragendes fachbezogenes Hilfsmittel für Planende und Abbruchunternehmen. Es leitet systematisch durch die Voruntersuchung, von der Baualtersklassen-Recherche über Probenahme-Muster (Raumluft, Fasern, Stäube) bis zur Interpretation komplexer analytischer Befunde.',
    benefits: [
      'Genaue Handlungsanweisung zur sachgerechten Probenahme',
      'Systematische Führung zur Schadstoffkataster-Erstellung',
      'Praktischer Laborbericht-Übersetzer für Gefahrstoffe'
    ],
    relevance: 'Präventiver Bauschutz und Verhinderung von Kreuzkontaminationen vor dem materiellen Rohbau-Abbruch.',
    tip: 'Unverzichtbar vor Sanierungs- oder Rückbauplanung zur Minimierung von Haftungsrisiken.'
  },
  {
    id: 'wingis',
    name: 'WINGISonline (GISBAU)',
    category: 'Schadstoffe & Praxis',
    discipline: 'PRAXISWISSEN',
    publisher: 'Berufsgenossenschaft der Bauwirtschaft (BG BAU)',
    accessibility: 'Frei zugänglich, anmeldefrei online',
    standards: ['TRGS 500', 'GefStoffV', 'ArbSchG'],
    evaluation: 'Das führende Gefahrstoff-Informationssystem der BG Bau konzentriert sich auf den baustellengerechten Gesundheitsschutz. Es übersetzt gefahrstoffrechtliche Kennzeichnungen in rechtlich belastbare, leicht verständliche Betriebsanweisungen direkt für den Polier und Handwerker.',
    benefits: [
      'Abfrage über standardisierte GISCODEs / Produktgruppen',
      'Exakte Handlungshilfen zu PSA (Atemschutz, Schutzhandschuhe)',
      'Dokumentations-Vorlagen zur gesetzlichen Gefährdungsbeurteilung'
    ],
    relevance: 'Täglicher Arbeitsschutz auf Montage beim Kontakt mit Lacken, Klebern, Zementmörteln.',
    tip: 'Bauleiter können hier sofort einsatzfertige Betriebsanweisungen für Baubeteiligte ausdrucken.'
  },
  {
    id: 'weba',
    name: 'WeBA (Web-Portal Bauphysikalische Altbausanierung)',
    category: 'Bauphysik & Altbau',
    discipline: 'BAUPHYSIK & BAUSCHÄDEN',
    publisher: 'Universität Stuttgart (Lehrstuhl für Bauphysik) / Zukunft Bau',
    accessibility: 'Kostenfreies Forschungsportal',
    url: 'https://www.uni-stuttgart.de/',
    standards: ['DIN 4108', 'WTA-Merkblätter', 'GEG'],
    evaluation: 'Entwickelt von Bauphysik-Forschenden zur Vermeidung kritischer Bauschäden. Das interaktive Portal bietet tiefe physikalische Analysen zu thermischen und hygrischen Wechselwirkungen im Altbau, insbesondere bei historischem Fachwerk, Dachstühlen und Innenwand-Dämmungen.',
    benefits: [
      'Exemplarische Detailzeichnungen sanierungsrelevanter Anschlüsse',
      'Widerstandsfähige Feuchteschutz-Konzepte zur Schadensprophylaxe',
      'Wissenschaftlich abgesicherte Konstruktionsvorschläge'
    ],
    relevance: 'Thermische Ertüchtigung von Altbauten ohne die Gefahr von verdecktem Schimmelpilzwachstum.',
    tip: 'Hervorragend geeignet zum Studium komplexer Wärmebrücken und des hygrothermischen Verhaltens.'
  },
  {
    id: 'wecobis',
    name: 'WECOBIS',
    category: 'Baustoffe & Produkte',
    discipline: 'BAUSTOFFE & DAUERHAFTIGKEIT',
    publisher: 'Bundesinstitut für Bau-, Stadt- und Raumforschung (BBSR) & Bayerische Architektenkammer',
    accessibility: 'Vollständig kostenfrei und produktneutral',
    url: 'https://www.wecobis.de/',
    standards: ['DGNB Kriterien', 'BNB Steckbriefe'],
    evaluation: 'Das staatliche ökologische Baustoffinformationssystem liefert strukturierte Daten zu gesundheitlichen und umweltrelevanten Eigenschaften von Baumaterialien über den gesamten Lebenszyklus. Enthalten ist ein wertvolles Untermodul für "Baustoffe im Bestand", das historische Schadstoffe aufspürt.',
    benefits: [
      'Vollständige Produktneutralität zum Schutz vor Greenwashing',
      'Ausschreibungstexte zur materialökologischen Vergabe',
      'Alterungsschutz- und Emissionsprofile über Jahrzehnte hinweg'
    ],
    relevance: 'Nachhaltige Werkstoffwahl, Vermeidung flüchtiger Schadstoffe (VOC) im Gebäudeinnenraum.',
    tip: 'Nutzen Sie die textlichen Ausschreibungs-Hilfsmittel zur Integration ökologischer Anforderungen.'
  },
  {
    id: 'oekobaudat',
    name: 'ÖKOBAUDAT',
    category: 'Baustoffe & Produkte',
    discipline: 'BAUPRODUKTE (EPD)',
    publisher: 'Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen (BMWSB)',
    accessibility: 'Frei zugängliche XML/CSV-Plattform',
    url: 'https://www.oekobaudat.de/',
    standards: ['DIN EN 15804', 'ISO 14040/44'],
    evaluation: 'Die offizielle, verbindliche Referenzdatenbank für die Gebäudeökobilanzierung in Deutschland. Sie liefert genormte Ökobilanzdatensätze (Module A1-D, GWP, PENRT) sowie Umweltproduktdeklarationen (EPDs) für hunderte Bauprodukte.',
    benefits: [
      'Verbindlich für BNB-Bewertungen und QNG-Zertifikate',
      'Umfangreiche Exportschnittstellen für Planungsanwendungen (XML)',
      'Güteüberwachte Datensätze von Herstellern und Verbänden'
    ],
    relevance: 'Grundlage jeder qualifizierten Gebäude-Ökobilanzierung zur Erreichung von Klimastufen.',
    tip: 'Erleichtert die Berechnung des CO2-Fußabdrucks für Bauteilschichten im Entwurfsprozess.'
  },
  {
    id: 'bmwsb_portal',
    name: 'Informationsportal Nachhaltiges Bauen',
    category: 'Allgemein',
    discipline: 'ALLGEMEIN',
    publisher: 'Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen (BMWSB)',
    accessibility: 'Offizielles Bundesportal, frei zugänglich',
    url: 'https://www.nachhaltigesbauen.de/',
    standards: ['Leitfaden Nachhaltiges Bauen', 'GEG'],
    evaluation: 'Die zentrale, übergeordnete Anlaufstelle für die Transformation der deutschen Baubranche. Bündelt systematisch behördliche Leitfäden, wissenschaftliche Publikationen, Regelwerke, Mindeststandards und politische Zielberichte des Bundes.',
    benefits: [
      'Offizielle staatliche Leitfäden zur ressourcenschonenden Planung',
      'Arbeitshilfen und Werkzeuge für öffentliche Liegenschaften',
      'Zusammenfassung aller gesetzlichen und normativen Baurechte'
    ],
    relevance: 'Strategisches Verständnis für rechtliche und planerische Nachhaltigkeitsvorgaben des Bundes.',
    tip: 'Hervorragender, rechtlich belastbarer Einstiegspunkt für Planer, Bauherren und Studierende.'
  },
  {
    id: 'bnb',
    name: 'Bewertungssystem Nachhaltiges Bauen (BNB)',
    category: 'Allgemein',
    discipline: 'GRUNDLAGEN',
    publisher: 'Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen (BMWSB)',
    accessibility: 'Kostenlose Kriterien-Steckbriefe',
    url: 'https://www.bnb-nachhaltigesbauen.de/',
    standards: ['BNB-Zertifizierungssystem'],
    evaluation: 'Das BNB ist ein ganzheitliches, national zertifiziertes Bewertungssystem für Bundesgebäude. Es übersetzt abstrakte ökologische Prinzipien in konkrete, mess- und überprüfbare Kriteriensteckbriefe über den Lebenszyklus (Ökologie, Ökonomie, Soziales, Technik).',
    benefits: [
      'Vollständig transparente Kriteriensteckbriefe gratis abrufbar',
      'Standardisierte Berechnungsmethoden für Lebensdauern',
      'Konkrete Zielwerte für Treibhausgase und Primärenergiebedarf'
    ],
    relevance: 'Strukturierte ganzheitliche Lebenszyklusanalyse von der Planung bis zum Rückbau.',
    tip: 'Nutzen Sie die Steckbriefe als praxisgerechten Leitfaden zur Qualitätssicherung am eigenen Entwurf.'
  },
  {
    id: 'beton_tech',
    name: 'beton.org (Betontechnologie)',
    category: 'Tragwerk & Holz',
    discipline: 'BETONTECHNOLOGIE',
    publisher: 'InformationsZentrum Beton GmbH',
    accessibility: 'Freies Branchen- und Kompetenzportal',
    url: 'https://www.beton.org/',
    standards: ['DIN EN 206', 'DIN 1045'],
    evaluation: 'Die technologische Enzyklopädie rund um den Massivbau. Vermittelt anspruchsvolles Zement- und Betoniermaterialwissen von Frischbetonprüfungen über Hochleistungs- und Faserbetone (UHPC) bis hin zu Sichtbeton-Kriterien oder wasserundurchlässigen Bauwerken (WU-Beton/Weiße Wannen).',
    benefits: [
      'Kostenfreie, hochkarätige Merkblätter der Betonindustrie',
      'Mischungsrechner und Anleitungen zur Betonauswahl',
      'Hilfsmittel zur Qualitätssicherung auf der Baustelle'
    ],
    relevance: 'Sichere Auslegung und baustellengerechte Mischung dichten Massenbetons.',
    tip: 'Die dortigen Merkblätter der Fachgruppe Beton gelten oft als Stand der Technik vor Ort.'
  },
  {
    id: 'beton_stahl',
    name: 'beton.org (Architekturpreis - Stahlbetonbau)',
    category: 'Tragwerk & Holz',
    discipline: 'STAHLBETONBAU',
    publisher: 'InformationsZentrum Beton GmbH & Bund Deutscher Architektinnen und Architekten (BDA)',
    accessibility: 'Freie Projektdatenbank',
    url: 'https://www.architekturpreis-beton.de/',
    standards: ['Tragwerksentwurf', 'Statische Detailplanung'],
    evaluation: 'Dokumentiert bautechnisch herausragende, mit dem renommierten Architekturpreis ausgezeichnete Massivbauten. Zeigt exzellente Tragwerkslösungen, anspruchsvolle Sichtbetonschalungen, historisch gewachsene Verbund-Fügungen und nachhaltige Tragwerkseinsparungen.',
    benefits: [
      'Umfangreiches Bild- und Schnittarchiv gebauter Bauten',
      'Detaillierte Tragwerkanalysen durch Tragwerksplaner',
      'Inspiration für innovative Betonkonstruktionen (R-Beton, Infraleicht)'
    ],
    relevance: 'Synthese aus Hochbauästhetik, minimiertem Ressourceneinsatz und statischer Effizienz.',
    tip: 'Ideal zur Recherche innovativer Schalungs- und Fügungstechniken auf Architekten-Niveau.'
  },
  {
    id: 'holz_mechanik',
    name: 'Informationsdienst Holz',
    category: 'Tragwerk & Holz',
    discipline: 'MECHANIK & BIOGENE BAUSTOFFE',
    publisher: 'Holzbau Deutschland & Fachverband Holz',
    accessibility: 'Kostenfreies Downloadarchiv aller Holzbauten',
    url: 'https://informationsdienst-holz.de/',
    standards: ['Eurocode 5 (DIN EN 1995)', 'DIN 4102-4'],
    evaluation: 'Die national führende Enzyklopädie für das Entwerfen und Konstruieren im Ingenieurholzbau. Bietet hochdetaillierte bemessene Anschlussdetails, Schriftenreihen zu Massivholzdecken, Brandschutzanforderungen und hybriden Konstruktionen mit Lehm oder Stroh.',
    benefits: [
      'Geprüfte mechanisch-statische Detailkataloge als CAD-Schnitt',
      'Detaillierte Fachinformationen zu biologischen Verbundbaustoffen',
      'Verifizierte Richtlinien zum ökologischen Zirkulärholzbau'
    ],
    relevance: 'CO2-Schonung durch biogene Tragwerke mit lückenlosem Brandschutznachweis.',
    tip: 'Nutzen Sie die Schriftenreihe zur fehlerfreien Werkplanung von Holz-Beton-Verbunddecken.'
  },
  {
    id: 'elca_lca',
    name: 'eLCA & thru.de (Digitales & Emissionen)',
    category: 'Nachhaltigkeit',
    discipline: 'NACHHALTIGKEIT & DIGITALES',
    publisher: 'BMWSB (eLCA) / Umweltbundesamt (PRTR / thru.de)',
    accessibility: 'Kostenlose Webanwendungen der Bundesrepublik',
    url: 'https://www.bauteileditor.de/',
    standards: ['DIN EN 15978', 'PRTR-Verordnung'],
    evaluation: 'Ein aufeinander abgestimmtes digitales Duo. eLCA ermöglicht die interaktive, BIM-nahe Modellierung der Umweltwirkungen von Gebäuden direkt über den Webbrowser auf Basis der ÖKOBAUDAT. thru.de (PRTR-Register des UBA) schafft Transparenz über gewerbliche Emissionen und Schadstoffströme der herstellenden Industrie.',
    benefits: [
      'eLCA: Leicht bedienbarer, kostenloser Bauteil-Ökobilanzierer',
      'thru.de: Offene Recherche industrieller Schadstoffemissionen',
      'Exaktes Tracking von Energieträgern und Global-Warming-Potenzialen'
    ],
    relevance: 'Verknüpfung von Planungswerkzeugen mit realen Verursacherdaten der Umweltbelastung.',
    tip: 'Mit eLCA können Semesterarbeiten und Entwürfe im Handumdrehen bilanziert werden.'
  },
  {
    id: 'bestand_portal',
    name: 'Fachportal Bauen im Bestand (BauNetz Wissen)',
    category: 'Bauphysik & Altbau',
    discipline: 'BAUEN IM BESTAND',
    publisher: 'BauNetz Wissen Editorial Team',
    accessibility: 'Frei zugänglich, werbefinanziert-redaktionell',
    url: 'https://www.baunetzwissen.de/bauen-im-bestand',
    standards: ['Baualtersstufen', 'Denkmalrecht'],
    evaluation: 'Eine der renommiertesten Planungsdatenbanken für Sanierungen und bestandserhaltende Umbauten im deutschsprachigen Raum. Es verwebt theoretisches Baualtersstufen-Kompaktwissen mit exzellent bebilderten Case Studies von Industriekonversionen und Dachsanierungen.',
    benefits: [
      'Detaillierte baugeschichtsanalytische Erklärungen',
      'Dokumentierte konstruktive Knackpunkte moderner Kernsanierungen',
      'Verknüpfung von Tragwerksfragen mit Brandschutz und Denkmalpflege'
    ],
    relevance: 'Architektonische Inspiration zur CO2-Vermeidung durch Erhalt grauer Energie.',
    tip: 'Dient als ideale Argumentationshilfe für den Umbau statt Abbruch gegenüber Bauherren.'
  },
  {
    id: 'uba_publikationen',
    name: 'UBA-Publikationen (Bauschäden & Schadstoffe)',
    category: 'Schadstoffe & Praxis',
    discipline: 'BAUSCHÄDEN & INSTANDSETZUNG',
    publisher: 'Umweltbundesamt (UBA) Deutschland',
    accessibility: 'Kostenlose Forschungsberichte, Merkblätter und Leitfäden',
    url: 'https://www.umweltbundesamt.de/publikationen',
    standards: ['Ausschuss zur gesundheitlichen Bewertung von Bauprodukten (AgBB)'],
    evaluation: 'Die bundesweite wissenschaftliche Instanz für Gesundheits- und Umweltschutz. Bietet hochpräzise Leitfäden zur Bestimmung von Baustoffschadstoffen, Vermeidung von mikrobieller Belastung (Schimmel), Untersuchung flüchtiger Gerüche im Innenraum und Konzepte zur Sanierung belasteter Bausubstanz.',
    benefits: [
      'Wissenschaftlich fundierte Sanierungsschwellen und Prüfwerte',
      'Umfangreiche Leitfäden zum umweltschonenden Baubetrieb',
      'Fachbücher und Studien zum zirkulären Sekundärbaustoffeinsatz'
    ],
    relevance: 'Rechts- und gesundheitssichere Sanierung zur Vermeidung von Bauschäden und Schadstoffemissionen.',
    tip: 'Prüfen Sie vor Sanierungsanlagen den UBA-Schimmelpilz-Leitfaden auf anerkannte Sanierungsmethoden.'
  },
  {
    id: 'madaster_germany',
    name: 'Madaster Deutschland (Materialkataster & Circularity)',
    category: 'Nachhaltigkeit',
    discipline: 'ZIRKULÄRES BAUEN & DIGITALISIERUNG',
    publisher: 'Madaster Services Germany GmbH',
    accessibility: 'Zentrales Online-Kataster für Materialpässe',
    url: 'https://madaster.de/',
    standards: ['DIN EN 15978', 'DGNB Kriterium ENV 1.3', 'QNG Anforderung'],
    evaluation: 'Das globale Kataster für Materialien, Bauteile und Gebäude. Es ermöglicht die Erstellung standardisierter Gebäudepässe und berechnet automatisch den Madaster Circularity Indicator (MCI) zur Messung der Zirkularität.',
    benefits: [
      'Digitaler Gebäuderessourcenpass nach EU-Taxonomie und QNG-Standard',
      'Messung von Zirkularität, CO₂-Bilanz und Toxizität im Bauteilverbund',
      'Automatischer Import von IFC- und BIM-Dateien zur Rohstoffdokumentation'
    ],
    relevance: 'Werterhalt und Urban Mining: Gebäude als zirkuläre Materiallager für die Zukunft.',
    tip: 'Unverzichtbar zur Erfüllung der Vorgaben für den digitalen Gebäuderessourcenpass.'
  },
  {
    id: 'concular_portal',
    name: 'Concular (Zirkuläre Materialvermittlung & Ökobilanz)',
    category: 'Nachhaltigkeit',
    discipline: 'SEKUNDÄRBAUSTOFFE & PRAXIS',
    publisher: 'Concular GmbH',
    accessibility: 'Plattform für zirkuläres Bauen',
    url: 'https://concular.de/',
    standards: ['VDI 6210', 'DIN SPEC 91484'],
    evaluation: 'Führende deutsche Plattform für das zirkuläre Bauen und die Wiederverwendung von Baumaterialien. Verknüpft Pre-Demolition Audits zur Baustoffkartierung mit einem digitalen Marktplatz für geprüfte Sekundärmaterialien.',
    benefits: [
      'Gezielte Identifikation und Prüfung wiederverwendbarer Bauteile vor dem Abbruch',
      'CO₂- und Kosteneinsparungsberechnung im Vergleich zur Neuherstellung',
      'Rechtlich belastbare Begleitung bei Gewährleistung und Schadstoffausschluss'
    ],
    relevance: 'Reduktion von Primärrohstoffen und Abfallmengen durch direkte Wiederverwendung (Re-Use).',
    tip: 'Ideal zur Vorbereitung von selektiven Rückbaukonzepten nach VDI 6210.'
  },
  {
    id: 'dgnb_navigator',
    name: 'DGNB Navigator (Bauprodukte-Plattform)',
    category: 'Baustoffe & Produkte',
    discipline: 'BAUSTOFFE & DAUERHAFTIGKEIT',
    publisher: 'Deutsche Gesellschaft für Nachhaltiges Bauen (DGNB e.V.)',
    accessibility: 'Öffentlich und kostenfrei recherchierbar',
    url: 'https://www.dgnb-navigator.de/',
    standards: ['DGNB Zertifizierungssystem', 'DIN EN 15804'],
    evaluation: 'Die umfassende Baustoff- und Produktdatenbank der DGNB liefert verifizierte Nachhaltigkeitskennwerte (Umwelteigenschaften, Schadstoffe, Rezyklatanteile, EPDs) und verknüpft sie direkt mit den Kriterien des DGNB-Systems.',
    benefits: [
      'Direkte Zuordnung der Bauprodukte zu den DGNB-Qualitätsstufen (QS1 bis QS4)',
      'Vollständige EPDs, Sicherheitsdatenblätter und Prüfzeugnisse gebündelt',
      'Filterung nach regionalen Produkten, Recyclinganteilen und Schadstofffreiheit'
    ],
    relevance: 'Schnelle Auswahl nachweislich nachhaltiger Bauprodukte im Planungsprozess.',
    tip: 'Prüfen Sie hier Baustoffe auf Erfüllung der Qualitätsstufen QS 1 bis QS 4 für die Innenraumluft.'
  },
  {
    id: 'fraunhofer_irb',
    name: 'Fraunhofer IRB Baufachinformation',
    category: 'Allgemein',
    discipline: 'BAUFORSCHUNG & TECHNIK',
    publisher: 'Fraunhofer-Informationszentrum Raum und Bau (IRB)',
    accessibility: 'Zentrale Forschungs- und Literaturdatenbank',
    url: 'https://www.baufachinformation.de/',
    standards: ['Zukunft Bau', 'Bauforschungsberichte'],
    evaluation: 'Die führende Fachdatenbank für Bauforschung im deutschsprachigen Raum. Dokumentiert tausende abgeschlossene und laufende Forschungsprojekte, Schadensfälle, Sanierungsmethoden und bauphysikalische Modellierungen.',
    benefits: [
      'Umfassendes Verzeichnis von Bauforschungsberichten der Bundesinitiative Zukunft Bau',
      'Bauschadensfälle mit detaillierter Fehlerursachenanalyse und Sanierungsleitfäden',
      'Verbindung von Baustoffkunde mit praktischen Ausführungsdetails'
    ],
    relevance: 'Stand der Technik und neueste wissenschaftliche Erkenntnisse für Planung und Gutachten.',
    tip: 'Hervorragend geeignet für Recherchen bei komplexen Bauschadensgutachten und Masterarbeiten.'
  }
];

// Existing categorical associations for the secondary view
const DETAILED_VERBAENDE = [
  {
    kategorie: 'Zement, Beton & Mineralische Baustoffe',
    items: [
      { name: 'VDZ (Verein Deutscher Zementwerke)', url: 'https://www.vdz-online.de', beschreibung: 'Zentraler Verband der deutschen Zementindustrie. Bietet umfangreiche wissenschaftliche Berichte zu Zementmischungen, CO2-mindernder Hydratation und Klinkereinsparung.' },
      { name: 'InformationsZentrum Beton (IZB)', url: 'https://www.beton.org', beschreibung: 'Plattform für Architektur und Technik mit Beton. Liefert praxistaugliche Merkblätter (Sichtbeton, WU-Bauteile), Bemessungsdaten und Schulungen.' },
      { name: 'Bundesverband Baustoffe - Steine und Erden (bbs)', url: 'https://www.baustoffindustrie.de', beschreibung: 'Dachverband der mineralischen Rohstoffindustrie. Bietet Statistiken zur Ressourceneffizienz und Recycling-Bauschuttnutzung.' }
    ]
  },
  {
    kategorie: 'Holz & Biogene Werkstoffe',
    items: [
      { name: 'Informationsdienst Holz e.V.', url: 'https://informationsdienst-holz.de', beschreibung: 'Umfangreiche Fachbibliothek zur Tragfähigkeit, EC 5-Bemessung tragender Holzverbindungen und Konstruktionsdetails für Dächer und Decken.' },
      { name: 'Holzbau Deutschland', url: 'https://www.holzbau-deutschland.de', beschreibung: 'Bund Deutscher Zimmermeister. Richtlinien zum mehrgeschossigen Holzbau, Abbund und handwerklichen Sanierung von Tragwerken.' },
      { name: 'Dachverband Lehm e.V.', url: 'https://www.dachverband-lehm.de', beschreibung: 'Informationen zu ökologischen Lehmbau-Materialien, Trockenbauplatten und Putzen sowie normative Baubestimmungen.' }
    ]
  },
  {
    kategorie: 'Metalle & Tragwerke',
    items: [
      { name: 'bauforumstahl e.V.', url: 'https://bauforumstahl.de', beschreibung: 'Umfassendes Forum für Stahlbau und nachhaltige Verbundkonstruktion. Stellt softwarebasierte Tragfähigkeitsrechner bereit.' },
      { name: 'Informationsstelle Edelstahl Rostfrei (ISER)', url: 'https://www.edelstahl-rostfrei.de', beschreibung: 'Planungshilfen zur Vermeidung von Kontaktkorrosion und Dauerhaftigkeit metallischer Bauteile in aggresivsten Bewitterungsklassen.' }
    ]
  }
];

export default function Informationsquellen() {
  const [activeSubTab, setActiveSubTab] = useState<'evaluation' | 'verbaende' | 'oer_enzyklopaedie' | 'monitor'>('evaluation');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  
  // 1. Dynamic filtering of evaluated repositories
  const filteredDBs = FREE_DATABASES.filter(db => {
    const matchesSearch = db.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          db.publisher.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          db.evaluation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          db.discipline.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Alle' || db.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Alle', 'Allgemein', 'Baustoffe & Produkte', 'Tragwerk & Holz', 'Bauphysik & Altbau', 'Schadstoffe & Praxis', 'Nachhaltigkeit'];

  return (
    <div className="flex flex-col gap-6" id="fachdatenbanken-modul">
      
      {/* Header introduction component */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="text-shiraz" size={28} />
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">Fachdatenbanken & Info-Portale</h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Umfassende Evaluation deutscher, kostenfreier & barrierefreier Wissensplattformen
          </p>
        </div>
        </div>
        <p className="text-text-main/80 text-sm leading-relaxed max-w-4xl">
          Die Bewältigung nachhaltiger Bau- und Sanierungsaufgaben erfordert anerkannte, verlässliche Fakten. 
          Die folgende Zusammenstellung präsentiert eine kuratierte und bewertete Auswahl von Informationssystemen, 
          die durch deutsche Bundesministerien, Länderämter, Forschungsinitiativen (Zukunft Bau) und Fachverbände 
          vollständig kostenfrei bereitgestellt werden.
        </p>

        {/* Level 1 Tabs switcher */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-home-grau/30 pt-4">
          <button
            onClick={() => setActiveSubTab('evaluation')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'evaluation' 
                ? 'bg-shiraz text-white shadow-sm' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <Database size={14} /> 1. Datenbank-Evaluation
          </button>
          <button
            onClick={() => setActiveSubTab('verbaende')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'verbaende' 
                ? 'bg-shiraz text-white shadow-sm' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <Building2 size={14} /> 2. Zusätzliche Fachverbände & Verbände
          </button>
          <button
            onClick={() => setActiveSubTab('oer_enzyklopaedie')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'oer_enzyklopaedie' 
                ? 'bg-shiraz text-white shadow-sm' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <BookOpen size={14} /> 3. OER-Enzyklopädie
          </button>
          <button
            onClick={() => setActiveSubTab('monitor')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'monitor' 
                ? 'bg-shiraz text-white shadow-sm' 
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100/70'
            }`}
          >
            <ShieldCheck size={14} /> 4. Normen- &amp; Link-Aktualitätsmonitor
          </button>
        </div>
      </div>

      {/* VIEW 1: Database Evaluation Directory */}
      {activeSubTab === 'evaluation' && (
        <div className="space-y-6">
          
          {/* Filters card */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-home-grau" size={16} />
              <input
                type="text"
                placeholder="Suchen Sie nach Systemen, Betreibern, Normen..."
                className="w-full pl-9 pr-4 py-2 border border-home-grau/30 rounded-lg focus:outline-none focus:border-shiraz bg-off-white text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Horizontal Categories */}
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md border transition-all ${
                    selectedCategory === cat
                      ? 'bg-shiraz text-white border-shiraz'
                      : 'bg-off-white text-text-main/80 border-home-grau/30 hover:bg-home-grau/10'
                  }`}
                >
                  {cat === 'Alle' ? 'Alle Disziplinen' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Listings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDBs.map((db) => (
              <div 
                key={db.id} 
                className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm hover:border-shiraz/35 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  
                  {/* Title & Metadata row */}
                  <div className="flex items-start justify-between gap-2 pb-3 mb-3 border-b border-home-grau/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-shiraz">
                          {db.name}
                        </h4>
                        {db.isBeta && (
                          <span className="bg-rose-100 text-rose-800 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-xs">
                            BETA
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] font-semibold text-shiraz uppercase tracking-wider block mt-0.5">
                        {db.discipline}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold shrink-0">
                      {db.category}
                    </span>
                  </div>

                  {/* Institution publisher */}
                  <div className="bg-slate-50 border border-home-grau/30 p-2.5 rounded-lg mb-4 flex items-center gap-2 text-[11px] text-slate-600">
                    <Building2 size={14} className="text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider leading-none">Herausgeber / Betreiber</span>
                      <strong className="text-slate-800 font-semibold">{db.publisher}</strong>
                    </div>
                  </div>

                  {/* Core Evaluation statement */}
                  <p className="text-xs text-text-main/80 leading-relaxed font-normal mb-4">
                    {db.evaluation}
                  </p>

                  {/* Bullet Benefits List */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Kernvorteile:</span>
                    {db.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-text-main">
                        <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Standard reference badges */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {db.standards.map((std, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-800 border border-indigo-100 text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {std}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Footer bar with URL trigger and tip */}
                <div className="mt-4 pt-3 border-t border-home-grau/10 flex flex-col gap-2 bg-slate-50/50 -mx-6 -mb-6 p-4 rounded-b-2xl">
                  <div className="text-[10px] text-slate-500 italic flex gap-1 items-start leading-normal">
                    <Info size={12} className="text-shiraz shrink-0 mt-0.5" />
                    <div>
                      <strong>Praxis-Bezug:</strong> {db.relevance}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-200/50 p-1 px-1.5 rounded text-center">
                      {db.accessibility}
                    </span>
                    {db.url ? (
                      <a 
                        href={db.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-white border border-home-grau/30 hover:border-shiraz/50 rounded-lg text-[11px] font-bold text-slate-800 hover:text-shiraz transition-all shadow-sm"
                      >
                        Datenbank öffnen <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-slate-50 border border-home-grau/20 rounded-lg text-[11px] font-medium text-slate-500">
                        Information / Fachliteratur
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
            {filteredDBs.length === 0 && (
              <div className="col-span-1 lg:col-span-2 bg-white p-12 text-center rounded-2xl border border-home-grau/30 text-home-grau text-xs">
                Keine passenden Informationsportale für "{searchQuery}" gefunden in der Evaluation.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: Association list */}
      {activeSubTab === 'verbaende' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
          <div className="border-b border-home-grau/10 pb-4">
            <h3 className="text-lg font-bold text-text-main">Ergänzende deutsche Fachverbände & Portale</h3>
            <p className="text-xs text-text-main/70">
              Neben staatlichen Portalen bieten Branchenvereine und Verbände vertieftes, anwendungsbereites Fachwissen, Schriftenreihen und Musterdetails zum kostenfreien Download.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DETAILED_VERBAENDE.map((cat, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider border-b border-home-grau/25 pb-1 flex items-center gap-1.5">
                  <Layers size={14} /> {cat.kategorie}
                </h4>
                
                <div className="space-y-3">
                  {cat.items.map((item, itemIdx) => (
                    <a
                      key={itemIdx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-4 bg-off-white border border-home-grau/15 hover:border-shiraz/30 hover:bg-white rounded-xl transition-all shadow-xs"
                    >
                      <div className="font-bold text-xs text-slate-800 flex items-center justify-between gap-1 mb-1 group-hover:text-shiraz">
                        <span>{item.name}</span>
                        <ExternalLink size={12} className="text-slate-400 group-hover:text-shiraz" />
                      </div>
                      <p className="text-[11px] text-slate-600 leading-normal font-normal">
                        {item.beschreibung}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'oer_enzyklopaedie' && (
        <OerEncyclopedia />
      )}

      {activeSubTab === 'monitor' && (
        <NormenLinkMonitor />
      )}

      {/* Footer list */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Umweltproduktdeklaration (EPD)' },
          { title: 'Gefahrstoffverordnung (GefStoffV)', url: 'https://de.wikipedia.org/wiki/Gefahrstoffverordnung' },
          { title: 'Urban Mining', url: 'https://de.wikipedia.org/wiki/Urban_Mining' }
        ]}
        normIds={['DIN_EN_15804', 'GEG_2024']}
        regelwerke={[
          { title: 'Leitfaden Nachhaltiges Bauen (BMWSB) - Standard für Bundesbauten', url: 'https://www.nachhaltigesbauen.de/' },
          { title: 'VDI 6202 Blatt 1: Schadstofferkundung von Gebäuden und baulichen Anlagen', url: 'https://www.vdi.de/' },
          { title: 'TRGS 519 / 521 / 524: Technische Regeln für Gefahrstoffe', url: 'https://www.baua.de/' },
          { title: 'DIN SPEC 91484: Verfahren zur Erfassung von Bauprodukten vor Abbruch- und Umbaumaßnahmen' }
        ]}
        literatur={[
          'BMWSB: Bewertungssystem Nachhaltiges Bauen (BNB) Kriteriensteckbriefe',
          'Bayerisches LfU: Schadstoffratgeber Gebäuderückbau',
          'BBSR: WECOBIS ökologisches Baustoffinformationssystem',
          'GISBAU / BG BAU: WINGISonline Datenbank für Baustoff-Gesundheitsschutz'
        ]}
        weblinks={[
          { title: 'ÖKOBAUDAT Plattform – BMWSB EPD-Datenbank', url: 'https://www.oekobaudat.de/' },
          { title: 'WECOBIS – Ökologisches Baustoffinformationssystem', url: 'https://www.wecobis.de/' },
          { title: 'Madaster Germany – Material- und Gebäudekataster', url: 'https://madaster.de/' },
          { title: 'Concular – Zirkulärer Marktplatz für Baustoffe', url: 'https://concular.de/' },
          { title: 'DGNB Navigator – Bauprodukte-Plattform', url: 'https://www.dgnb-navigator.de/' },
          { title: 'WINGISonline – Gefahrstoffsystem der BG BAU' },
          { title: 'Fraunhofer IRB – Baufachinformation', url: 'https://www.baufachinformation.de/' },
          { title: 'ift Rosenheim – Institut für Fenstertechnik & Bauteile', url: 'https://www.ift-rosenheim.de/' },
          { title: 'Bundesverband Flachglas (BF) – Technische Richtlinien', url: 'https://www.bundesverband-flachglas.de/' },
          { title: 'FGSV – Forschungsgesellschaft für Straßen- und Verkehrswesen', url: 'https://www.fgsv.de/' }
        ]}
        formeln={[
          {
            formel: 'c_{\\text{Fasern}} = \\frac{n_{\\text{gezählt}}}{V_{\\text{Luft}}} \\le 500\\,\\frac{\\text{Fasern}}{\\text{m}^3}',
            erklaerung: 'Asbestfaserkonzentration in der Raumluft nach Asbestsanierung gemäß TRGS 519 zur Freigabemessung (VDI 3492).',
            quelle: 'TRGS 519 / VDI 3492'
          },
          {
            formel: '\\text{GWP} = \\sum_{i} m_i \\cdot \\text{GWP}_i \\quad [\\text{kg CO}_2\\text{-Äquiv.}]',
            erklaerung: 'In Informationssystemen wie ÖKOBAUDAT und WECOBIS hinterlegte ökologische Kennwerte nach DIN EN 15804.',
            quelle: 'DIN EN 15804 / WECOBIS'
          }
        ]}
      />
    </div>
  );
}
