import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  ExternalLink, 
  Search, 
  Layers, 
  Activity, 
  Leaf, 
  Box, 
  Database, 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  Compass,
  FileCheck,
  CheckCircle2,
  Terminal,
  Cpu,
  Copy,
  Check,
  Code,
  BookOpen,
  Calculator,
  Trees
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';

interface ToolItem {
  id: string;
  name: string;
  category: 'statik' | 'bauphysik' | 'holzbau' | 'lca' | 'bim' | 'geotechnik';
  categoryLabel: string;
  language: 'DT' | 'ENG' | 'DT / ENG';
  accessType: 'Direkt im Web' | 'Kostenlose Cloud' | 'Freeware / Open Source' | 'Offizielle Behörde / API';
  recommendationBadge?: 'Standard im Büro' | 'Didaktisch wertvoll' | 'Forschung & Master' | 'Offizieller Standard';
  url: string;
  shortDesc: string;
  detailedFeatures: string[];
  standards: string;
  institutionOrAuthor: string;
}

const ONLINE_TOOLS: ToolItem[] = [
  // 1. Statik & Strukturmechanik
  {
    id: 'mastan2',
    name: 'Mastan2 / Web-Mastan',
    category: 'statik',
    categoryLabel: 'Statik & Tragwerk',
    language: 'ENG',
    accessType: 'Freeware / Open Source',
    recommendationBadge: 'Didaktisch wertvoll',
    url: 'https://www.mastan2.com/',
    shortDesc: 'Interaktive 1D/2D/3D-Rahmentragwerksanalyse mit geometrischer und materieller Nichtlinearität (Theorie II. Ordnung, Plastizität, Knicken).',
    detailedFeatures: [
      'Lineare und geometrisch nichtlineare Berechnung nach Theorie II. Ordnung',
      'Elasto-plastische Gelenkbildung und Grenzlastspielräume',
      'Modale Eigenwertanalyse und Stabilitätsnachweise (Biegedrillknicken)',
      'Lehrstuhlerprobt durch Prof. McGuire und Prof. Ziemian'
    ],
    standards: 'AISC / Eurocode 3 konform',
    institutionOrAuthor: 'Bucknell University / Prof. R. Ziemian'
  },
  {
    id: 'strian',
    name: 'STRIAN (Structural Analysis Web)',
    category: 'statik',
    categoryLabel: 'Statik & Tragwerk',
    language: 'ENG',
    accessType: 'Direkt im Web',
    recommendationBadge: 'Didaktisch wertvoll',
    url: 'https://strian.designer.io/',
    shortDesc: 'Interaktiver 2D-Stabwerk-Web-Rechner für Fachwerke, Durchlaufträger und Rahmen mit Gelenken, Einflusslinien und Echtzeit-Schnittgrößen.',
    detailedFeatures: [
      'Schnelle grafische Eingabe von Knoten, Stäben, Auflagern und Momentengelenken im Raster',
      'Sofortige Berechnung von Biegemomenten (M), Querkräften (V) und Normalkräften (N)',
      'Interaktive Einflusslinien zur Untersuchung wandernder Radlasten und Achsgruppen',
      'Läuft 100 % im Browser ohne Registrierung, Plug-Ins oder Server-Wartezeiten'
    ],
    standards: 'Allgemeine Statik / Baustatik II',
    institutionOrAuthor: 'Strian Structural Tools'
  },
  {
    id: 'skyciv_beam',
    name: 'SkyCiv Free Beam & Truss Calculator',
    category: 'statik',
    categoryLabel: 'Statik & Tragwerk',
    language: 'DT / ENG',
    accessType: 'Direkt im Web',
    recommendationBadge: 'Standard im Büro',
    url: 'https://skyciv.com/free-beam-calculator/',
    shortDesc: 'Schnelle Einfeld- und Mehrfeldträgerberechnung direkt im Browser mit Schnittgrößenlinien (M, V, N) und Verformungen.',
    detailedFeatures: [
      'Visualisierung von Biegemomenten-, Querkraft- und Durchbiegungslinien in Echtzeit',
      'Punkt-, Dreiecks- und Streckenlasten sowie Momentenbelastungen',
      'Spannungsnachweis für Standard-Stahl- und Holzquerschnitte',
      'Keine Installation nötig, läuft auf jedem Tablet und Desktop'
    ],
    standards: 'Eurocode / AISC / AS',
    institutionOrAuthor: 'SkyCiv Cloud Structural Engineering'
  },
  {
    id: 'dlubal_cross_section',
    name: 'Dlubal Online-Querschnittswerte',
    category: 'statik',
    categoryLabel: 'Statik & Tragwerk',
    language: 'DT / ENG',
    accessType: 'Direkt im Web',
    recommendationBadge: 'Standard im Büro',
    url: 'https://www.dlubal.com/de/querschnittswerte/',
    shortDesc: 'Umfassende normenkonforme Querschnitts- und Profilwertdatenbank für Walzprofile (HEA, HEB, HEM, IPE, UPN, Hohlprofile etc.).',
    detailedFeatures: [
      'Exakte Querschnittswerte: A, Iy, Iz, Wy, Wz, Wpl, IT, Iw',
      'Klassifizierung nach Eurocode 3 (Querschnittsklassen 1 bis 4)',
      'Interaktive Spannungsermittlung bei kombinierter Biegung und Normalkraft',
      'Kostenlose Nutzung ohne Registrierung'
    ],
    standards: 'DIN EN 1993-1-1 (EC3)',
    institutionOrAuthor: 'Dlubal Software GmbH'
  },
  {
    id: 'dlubal_geozones',
    name: 'Dlubal Geo-Zone Tool (Schnee, Wind, Erdbeben)',
    category: 'statik',
    categoryLabel: 'Statik & Tragwerk',
    language: 'DT / ENG',
    accessType: 'Direkt im Web',
    recommendationBadge: 'Standard im Büro',
    url: 'https://www.dlubal.com/de/lastzonen-schnee-wind-erdbeben/',
    shortDesc: 'Standortbezogene digitale Abfrage von Schneelast-, Windlast- und Erdbebenzonen nach Eurocode 1 (DIN EN 1991) via Adress- und Kartensuche.',
    detailedFeatures: [
      'Genaue Ermittlung der charakteristischen Schneelast s_k und Windzonen 1 bis 4 nach DIN EN 1991-1-3 / DIN EN 1991-1-4',
      'Inklusive Geländehöhe über Normalnull (A) und Norddeutsches Tiefland-Kriterium',
      'Erdbebenzonen und Untergrundklassen nach DIN EN 1998-1 / DIN 4149',
      'Direkte Kartenverortung per Postleitzahl oder GPS-Koordinaten'
    ],
    standards: 'DIN EN 1991-1-3, DIN EN 1991-1-4, DIN EN 1998-1',
    institutionOrAuthor: 'Dlubal Software GmbH'
  },
  {
    id: 'calcpad',
    name: 'Calcpad (Parametrische Statik & Math)',
    category: 'statik',
    categoryLabel: 'Statik & Tragwerk',
    language: 'ENG',
    accessType: 'Freeware / Open Source',
    recommendationBadge: 'Standard im Büro',
    url: 'https://calcpad.eu/',
    shortDesc: 'Open-Source-Plattform für prüffähige, parametrische Statikberechnungen nach Eurocode mit automatischer Formeldarstellung und HTML/PDF-Export.',
    detailedFeatures: [
      'Parametrische Eingabe: Mathematischer Text wird während des Tippens in lesbare Gleichungen formatiert',
      'Umfangreiche Modellbibliothek für Eurocode 2 (Beton), Eurocode 3 (Stahl) und Eurocode 5 (Holz)',
      'Erzeugung professioneller, prüffähiger statischer Berechnungsberichte',
      'Desktop-Anwendung sowie kostenlose Web-Cloud-Version verfügbar'
    ],
    standards: 'Eurocodes 0 bis 8 konform',
    institutionOrAuthor: 'Calcpad Community / Open Source'
  },
  {
    id: 'eurocode_applied',
    name: 'EurocodeApplied.com',
    category: 'statik',
    categoryLabel: 'Statik & Tragwerk',
    language: 'ENG',
    accessType: 'Direkt im Web',
    recommendationBadge: 'Didaktisch wertvoll',
    url: 'https://eurocodeapplied.com/',
    shortDesc: 'Kostenlose Web-Applikationen zur schnellen Ermittlung von Lastkombinationen nach EC0/EC1 sowie Vorbemessungen für Beton und Stahl.',
    detailedFeatures: [
      'EC0 Lastkombinationsgenerator für ständige und veränderliche Einwirkungen',
      'EC1 Wind- und Schneelastzonenermittlung mit Geländekategorien',
      'EC2 Biegung mit Längskraft für Rechteck- und Plattenbalkenquerschnitte',
      'Transparente Rechenwege mit Gleichungsreferenzen'
    ],
    standards: 'DIN EN 1990, DIN EN 1991, DIN EN 1992',
    institutionOrAuthor: 'EurocodeApplied Platform'
  },

  // 2. Bauphysik & Feuchteschutz
  {
    id: 'ubakus',
    name: 'Ubakus (ehemals U-Wert.net)',
    category: 'bauphysik',
    categoryLabel: 'Bauphysik & Feuchteschutz',
    language: 'DT / ENG',
    accessType: 'Direkt im Web',
    recommendationBadge: 'Standard im Büro',
    url: 'https://www.ubakus.de/',
    shortDesc: 'Der unangefochtene De-facto-Standard zur Ermittlung von U-Werten, Glaser-Tauwassernachweisen, Hitzeschutz und Trocknungsreserven.',
    detailedFeatures: [
      'Berechnung des Wärmedurchgangskoeffizienten (U-Wert) mehrschichtiger Bauteile',
      'Periodisches Feuchteschutzverfahren nach DIN 4108-3 (Glaser-Diagramm)',
      'Sommerlicher Hitzeschutz: Phasenverschiebung und Dämpfung der Temperaturwelle',
      'Riesige Baustoffdatenbank mit herstellerspezifischen Dämmstoffen'
    ],
    standards: 'DIN EN ISO 6946, DIN 4108-3, GModG (vormals GEG)',
    institutionOrAuthor: 'Ubakus / Ralf Plag'
  },
  {
    id: 'lbnl_therm',
    name: 'LBNL THERM (2D Heat Transfer)',
    category: 'bauphysik',
    categoryLabel: 'Bauphysik & Feuchteschutz',
    language: 'ENG',
    accessType: 'Freeware / Open Source',
    recommendationBadge: 'Forschung & Master',
    url: 'https://windows.lbl.gov/software/therm',
    shortDesc: '2D-Wärmestrom-Finite-Elemente-Programm zur numerischen Bestimmung zweidimensionaler Wärmebrückenverlustkoeffizienten (Psi-Werte).',
    detailedFeatures: [
      'Exakte Finite-Elemente-Simulation thermischer Schwachstellen und Anschlüsse',
      'Berechnung des längenbezogenen Wärmedurchgangskoeffizienten (Psi / ψ)',
      'Ermittlung des minimalen Temperaturfaktors f_Rsi zur Schimmelpilzvermeidung',
      'Wissenschaftlich validiert und weltweit als Referenztool anerkannt'
    ],
    standards: 'DIN EN ISO 10211, DIN 4108 Beiblatt 2',
    institutionOrAuthor: 'Lawrence Berkeley National Laboratory (USA)'
  },
  {
    id: 'onebuilding_weather',
    name: 'Climate.OneBuilding (EPW Weather)',
    category: 'bauphysik',
    categoryLabel: 'Bauphysik & Feuchteschutz',
    language: 'ENG',
    accessType: 'Offizielle Behörde / API',
    recommendationBadge: 'Forschung & Master',
    url: 'https://climate.onebuilding.org/',
    shortDesc: 'Globale stündliche Wetterdatensätze (EPW, TRY) für instationäre thermisch-hygroskopische Gebäudesimulationen (EnergyPlus, IDA ICE).',
    detailedFeatures: [
      'Kostenlose Bereitstellung weltweiter Testreferenzjahre (TRY / TMYx)',
      'Stündliche Werte für Außentemperatur, Globalstrahlung, relative Luftfeuchte und Wind',
      'Essentiell für instationäre GEG-Nachweise und sommerliche Raumklimasimulationen',
      'Open-Source und frei zugänglich ohne Bezahlschranke'
    ],
    standards: 'ASHRAE / ISO 15927-4',
    institutionOrAuthor: 'OneBuilding Consortium'
  },
  {
    id: 'wufi_light',
    name: 'Fraunhofer IBP WUFI (Wärme und Feuchte instationär)',
    category: 'bauphysik',
    categoryLabel: 'Bauphysik & Feuchteschutz',
    language: 'DT / ENG',
    accessType: 'Freeware / Open Source',
    recommendationBadge: 'Forschung & Master',
    url: 'https://wufi.de/',
    shortDesc: 'Weltweit führendes Simulationsprogramm zur realitätsnahen Berechnung des gekoppelten ein- und zweidimensionalen Wärme- und Feuchtetransports in Bauteilen.',
    detailedFeatures: [
      'Berechnung instationärer Feuchteprofile unter natürlichen Klimabedingungen mit Schlagregen und Solarstrahlung',
      'Exakter Nachweis von Trocknungsverhalten und kritischem Feuchtegehalt nach DIN EN 15026 / WTA-Merkblatt 6-2',
      'Umfassende Baustoffdatenbank mit gemessenen Feuchtespeicherfunktionen und Sorptionsisothermen',
      'Kostenlose Einstiegsversionen (WUFI Light) für Lehre, Studium und Weiterbildung'
    ],
    standards: 'DIN EN 15026, WTA-Merkblatt 6-2, DIN 4108-3',
    institutionOrAuthor: 'Fraunhofer-Institut für Bauphysik (IBP)'
  },

  // 3. Holzbau & Holzwerkstoffe
  {
    id: 'best_wood_statics',
    name: 'best wood STATICS (Holzbausoftware)',
    category: 'holzbau',
    categoryLabel: 'Holzbau',
    language: 'DT',
    accessType: 'Freeware / Open Source',
    recommendationBadge: 'Standard im Büro',
    url: 'https://www.schneider-holz.com/service/statiksoftware.html',
    shortDesc: 'Kostenlose vollwertige Holzbau-Statiksoftware für Einfeld-/Mehrfeldträger, Sparren, Pfetten, Stützen und Holzverbindungen nach Eurocode 5.',
    detailedFeatures: [
      'Vollständige Nachweise im Grenzzustand der Tragfähigkeit (GZT) und Gebrauchstauglichkeit (GZG)',
      'Berücksichtigung von Kriechverformungen (k_def) und Lasteinwirkungsdauer (k_mod)',
      'Integrierte Baustoffkennwerte für Brettschichtholz (BSH), KVH, CLT und Stegträger',
      'Prüffähige Ausgabe aller Nachweise mit transparentem Rechengang als PDF'
    ],
    standards: 'DIN EN 1995-1-1 (EC5), DIN EN 1995-1-2 (Brand)',
    institutionOrAuthor: 'best wood SCHNEIDER GmbH'
  },
  {
    id: 'dataholz',
    name: 'dataholz.eu (Geprüfte Holzbauteile)',
    category: 'holzbau',
    categoryLabel: 'Holzbau',
    language: 'DT',
    accessType: 'Offizielle Behörde / API',
    recommendationBadge: 'Offizieller Standard',
    url: 'https://www.dataholz.eu/',
    shortDesc: 'Akkreditierte Online-Bauteildatenbank der Holzforschung Austria für bauphysikalisch und ökologisch geprüfte Holzbaukonstruktionen.',
    detailedFeatures: [
      'Geprüfte Wand-, Decken- und Dachaufbauten mit U-Wert, Brandschutz (REI30–REI90) und Schallschutz',
      'Verifizierte EPD-Ökokennzahlen (GWP-Fossil, GWP-Biogen, PENRT) für jedes Bauteil',
      'Herstellerneutral und unmittelbar für Baugenehmigungen und QNG-Nachweise anerkennbar',
      'Schichtaufbauten direkt als PDF und Datenblatt exportierbar'
    ],
    standards: 'DIN EN 1995-1-2, DIN 4108, DIN 4109, EN 15804',
    institutionOrAuthor: 'Holzforschung Austria (HFA)'
  },

  // 4. LCA & Ökobilanzierung
  {
    id: 'oekobaudat',
    name: 'ÖKOBAUDAT Plattform',
    category: 'lca',
    categoryLabel: 'LCA & Ökobilanz',
    language: 'DT / ENG',
    accessType: 'Offizielle Behörde / API',
    recommendationBadge: 'Offizieller Standard',
    url: 'https://www.oekobaudat.de/',
    shortDesc: 'Offizielle Bundesdatenbank für standardisierte Ökobilanzdaten von Bauprodukten und EPDs gemäß DIN EN 15804.',
    detailedFeatures: [
      'Über 1.500 geprüfte Datensätze mit GWP-Fossil, GWP-Biogen, PENRT und Abfallkategorien',
      'Lebenszyklusphasen A1-A3 (Herstellung), C3-C4 (Entsorgung) und Modul D (Gutschriften)',
      'Öffentliche REST-API für nahtlose Software- und BIM-Anbindung',
      'Verpflichtende Grundlage für QNG-Zertifizierungen und BNB-Nachweise'
    ],
    standards: 'DIN EN 15804+A2, BNB, QNG',
    institutionOrAuthor: 'Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen (BMWSB)'
  },
  {
    id: 'wecobis',
    name: 'WECOBIS (Ökologisches Baustoffportal)',
    category: 'lca',
    categoryLabel: 'LCA & Ökobilanz',
    language: 'DT',
    accessType: 'Offizielle Behörde / API',
    recommendationBadge: 'Offizieller Standard',
    url: 'https://www.wecobis.de/',
    shortDesc: 'Offizielles Baustoffinformationssystem des Bundes zu Umwelt-, Schadstoff- und Gesundheitsaspekten in allen Lebenszyklusphasen.',
    detailedFeatures: [
      'Fundierte Informationen zu Emissionen (VOC, Formaldehyd) und Innenraumhygiene',
      'Baustoffgruppen von Rohbau bis Ausbau mit Umweltproduktdeklarationen und Entsorgungswegen',
      'Verknüpfung mit dem Bewertungssystem Nachhaltiges Bauen (BNB) und DGNB',
      'Fundierte Leitfäden zur Schadstoffvermeidung und zirkulären Baustoffwahl'
    ],
    standards: 'BNB Kriterien, AgBB-Bewertungsschema, REACH',
    institutionOrAuthor: 'BMWSB / Bundesinstitut für Bau-, Stadt- und Raumforschung (BBSR)'
  },
  {
    id: 'ec3_tool',
    name: 'EC3 Tool (Embodied Carbon in Construction)',
    category: 'lca',
    categoryLabel: 'LCA & Ökobilanz',
    language: 'ENG',
    accessType: 'Kostenlose Cloud',
    recommendationBadge: 'Standard im Büro',
    url: 'https://www.buildingtransparency.org/',
    shortDesc: 'Cloud-Plattform zur Quantifizierung und Reduktion grauer CO₂-Emissionen (Embodied Carbon) von Betonrezepturen, Stahl und Holz.',
    detailedFeatures: [
      'Umfangreiche Datenbank digitalisierter EPDs mit Varianzanalysen',
      'Vergleich von alternativen Betonrezepturen hinsichtlich ihrer CO₂-Intensität',
      'Export von Bauteil-Emissionswerten für ESG-Berichterstattungen',
      'Kostenlos für Planer, Bauherren und Studierende nach Registrierung'
    ],
    standards: 'ISO 14025, EN 15804',
    institutionOrAuthor: 'Building Transparency'
  },
  {
    id: 'openlca',
    name: 'openLCA Software & Daten',
    category: 'lca',
    categoryLabel: 'LCA & Ökobilanz',
    language: 'DT / ENG',
    accessType: 'Freeware / Open Source',
    recommendationBadge: 'Forschung & Master',
    url: 'https://www.openlca.org/',
    shortDesc: 'Vollwertiges, professionelles Open-Source-Ökobilanzierungssystem für komplexe Lebenszyklusanalysen von Baustoffen und Prozessen.',
    detailedFeatures: [
      'Vollständige Modellierung von Stoff- und Energieströmen über den Lebenszyklus',
      'Kompatibel mit ecoinvent, GaBi und ÖKOBAUDAT-Datenbanken',
      'Detaillierte Sensitivitätsanalysen und Parameterberechnungen',
      '100 % Open Source ohne Lizenzgebühren'
    ],
    standards: 'ISO 14040 / ISO 14044',
    institutionOrAuthor: 'GreenDelta Berlin'
  },
  {
    id: 'madaster_platform',
    name: 'Madaster Material Passport Platform',
    category: 'lca',
    categoryLabel: 'LCA & Ökobilanz',
    language: 'DT / ENG',
    accessType: 'Kostenlose Cloud',
    recommendationBadge: 'Offizieller Standard',
    url: 'https://madaster.de/',
    shortDesc: 'Zentrales globales Kataster für Materialien, Bauteile und Gebäude mit automatischer Berechnung des Zirkularitäts-Index und CO₂-Bilanz.',
    detailedFeatures: [
      'Automatisierte Generierung digitaler Materialpässe für Neubau und Bestand',
      'Berechnung des Madaster Circularity Indicator (MCI) zur Messung der Kreislauffähigkeit',
      'Toxizitätsbewertung und Nachweis rückbaubarer Konstruktionen',
      'BIM-Integration für IFC-Modelle zur automatischen Mengenerfassung'
    ],
    standards: 'DIN EN 15978, Ellen MacArthur Foundation Circularity Framework',
    institutionOrAuthor: 'Madaster Germany Services GmbH'
  },
  {
    id: 'concular_materials',
    name: 'Concular Zirkulärer Marktplatz & Baustoffpass',
    category: 'lca',
    categoryLabel: 'LCA & Ökobilanz',
    language: 'DT',
    accessType: 'Direkt im Web',
    recommendationBadge: 'Standard im Büro',
    url: 'https://concular.de/',
    shortDesc: 'Deutschlands führendes Ökosystem für zirkuläres Bauen, Materialkataster vor dem Rückbau und Vermittlung wiederverwendeter Baustoffe.',
    detailedFeatures: [
      'Pre-Demolition Audit zur Identifikation wiederverwendbarer Bauteile und Rohstoffe',
      'Marktplatz für Sekundärbaustoffe mit verifizierten Zustands- und Prüfberichten',
      'Einsparungsrechner für CO₂-Emissionen und Rohstoffabbau durch Wiederverwendung',
      'Unterstützung bei der Erfüllung von ESG- und Taxonomie-Kriterien'
    ],
    standards: 'VDI 6210, DIN SPEC 91484 (Zirkuläres Bauen)',
    institutionOrAuthor: 'Concular GmbH'
  },

  // 5. BIM & IFC
  {
    id: 'openbim_viewer',
    name: 'OpenBIM IFC Web Viewer (thatOpen)',
    category: 'bim',
    categoryLabel: 'BIM & Geodaten',
    language: 'ENG',
    accessType: 'Direkt im Web',
    recommendationBadge: 'Standard im Büro',
    url: 'https://thatopen.com/',
    shortDesc: 'Hochperformanter WebGL-basierter OpenBIM-Viewer: IFC-Dateien (IFC2x3, IFC4) direkt im Webbrowser ohne Installation prüfen und messen.',
    detailedFeatures: [
      'Direktes Laden und Rendern großer IFC-Bauwerksmodelle im Browser',
      'Hierarchische Inspektion von IfcProject, IfcBuildingStorey bis IfcWall / IfcBeam',
      'Prüfung von Eigenschaftssätzen (Property Sets, Pset) und Baustoffattributen',
      'Integrierte Messwerkzeuge für Abstände, Raumvolumen und Flächen'
    ],
    standards: 'buildingSMART IFC4 / IFC2x3',
    institutionOrAuthor: 'That Open Company / Open Source'
  },
  {
    id: 'bim_portal_bund',
    name: 'BIM-Portal des Bundes',
    category: 'bim',
    categoryLabel: 'BIM & Geodaten',
    language: 'DT',
    accessType: 'Offizielle Behörde / API',
    recommendationBadge: 'Offizieller Standard',
    url: 'https://www.bim-portal.de/',
    shortDesc: 'Zentrale Plattform der Bundesrepublik Deutschland für standardisierte Bauteil-Merkmalskataloge und AIA/BAP-Leitfäden.',
    detailedFeatures: [
      'Einheitliche Merkmalskataloge zur Attribuierung digitaler Baustoffe und Bauteile',
      'Muster-Auftraggeber-Informationsanforderungen (AIA) und BIM-Abwicklungspläne (BAP)',
      'Schnittstellen für die automatisierte Übernahme in Planungssoftware',
      'Kostenlos bereitgestellt für die gesamte deutsche Bauwirtschaft'
    ],
    standards: 'BIM Deutschland, DIN EN ISO 19650',
    institutionOrAuthor: 'Bundesministerium für Digitales und Verkehr (BMV) / BMWSB'
  },
  {
    id: 'geoportal_bund',
    name: 'Geoportal.de & Open Geodata',
    category: 'bim',
    categoryLabel: 'BIM & Geodaten',
    language: 'DT',
    accessType: 'Offizielle Behörde / API',
    recommendationBadge: 'Standard im Büro',
    url: 'https://www.geoportal.de/',
    shortDesc: 'Offizieller Zugang zu amtlichen Geobasis- und Geofachdaten (Digitale Geländemodelle DGM, Schutzgebiete, Bodenkarten, Flurkarten).',
    detailedFeatures: [
      'Amtliche Luftbilder (Orthofotos) und Höhenmodelle für Trassen- und Lagepläne',
      'Hochwasserrisiko- und Überschwemmungsgebietskarten der Bundesländer',
      'WMS/WFS-Geodienste zur direkten Einbindung in QGIS, Civil 3D und Allplan',
      'Fundamentale Grundlage für Baugrunderkundungen und Baustellenlogistik'
    ],
    standards: 'INSPIRE-Richtlinie, Open Data Bund',
    institutionOrAuthor: 'Bundesamt für Kartographie und Geodäsie (BKG)'
  },

  // 6. Geotechnik & Baustofflabore
  {
    id: 'nist_vcctl',
    name: 'NIST Virtual Cement and Concrete Testing Lab (VCCTL)',
    category: 'geotechnik',
    categoryLabel: 'Geotechnik & Baustofflabore',
    language: 'ENG',
    accessType: 'Offizielle Behörde / API',
    recommendationBadge: 'Forschung & Master',
    url: 'https://www.nist.gov/services-resources/software/vcctl-software',
    shortDesc: 'Numerisches Simulationslabor des US-Nationalinstituts zur Vorhersage der Zementhydratation, Phasenbildung (C-S-H) und Gefügefestigkeit.',
    detailedFeatures: [
      'Simulation der Hydratationskinetik von Klinkerphasen (C₃S, C₂S, C₃A, C₄AF)',
      'Mikrostrukturmodellierung und Porenraumverteilung im Zementstein',
      'Berechnung von Festigkeitsentwicklung und Chloriddiffusionskoeffizienten',
      'Wissenschaftliches Referenzmodell für Bindemitteloptimierung'
    ],
    standards: 'ASTM / ACI Standards',
    institutionOrAuthor: 'National Institute of Standards and Technology (NIST)'
  },
  {
    id: 'issmge_soil_tools',
    name: 'ISSMGE Soil Mechanics Online Tools',
    category: 'geotechnik',
    categoryLabel: 'Geotechnik & Baustofflabore',
    language: 'ENG',
    accessType: 'Direkt im Web',
    recommendationBadge: 'Didaktisch wertvoll',
    url: 'https://www.issmge.org/',
    shortDesc: 'Kostenlose interaktive Werkzeuge der International Society for Soil Mechanics für Bodenklassifikation, Erddruck und Setzungen.',
    detailedFeatures: [
      'Bodenklassifikation nach Sieblinie, Plastizitätszahl und Konsistenzgrenzen',
      'Erddruckberechnung nach Rankine und Coulomb für Stützwände und Baugruben',
      '1D-Konsolidierungsberechnungen (Terzaghi-Theorie) und Setzungsverläufe',
      'Ideal für Studierende zur Klausurvorbereitung und Vorbemessung'
    ],
    standards: 'DIN 18196, Eurocode 7 (DIN EN 1997)',
    institutionOrAuthor: 'International Society for Soil Mechanics (ISSMGE)'
  }
];

interface ApiCodeSnippet {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  prerequisites: string;
  code: string;
  explanation: string;
  benefit: string;
}

const API_SNIPPETS: ApiCodeSnippet[] = [
  {
    id: 'oekobaudat_api',
    title: '1. ÖKOBAUDAT REST-API: EPD-Daten automatisiert abfragen',
    subtitle: 'Direkte Abfrage von GWP- und Primärenergie-Faktoren ohne manuelle Recherche',
    category: 'Ökobilanz & LCA',
    prerequisites: 'pip install requests',
    code: `import requests
import json

# Offizielle REST-Schnittstelle der ÖKOBAUDAT (Bundesministerium BMWSB)
BASE_URL = "https://oekobaudat.de/OEKOBAU.DAT/resource/datastocks/cdb39638-1e16-4100-b086-632f002282e4"

def search_oekobaudat_material(query="Beton"):
    """
    Sucht in der ÖKOBAUDAT nach Baustoffen und listet EPD-Kennwerte (GWP, PENRT) auf.
    """
    url = f"{BASE_URL}/processes?search=true&query={query}&format=json"
    headers = {"Accept": "application/json"}

    print(f"Suchen Sie nach '{query}' in ÖKOBAUDAT...")
    res = requests.get(url, headers=headers, timeout=10)
    
    if res.status_code == 200:
        data = res.json()
        items = data.get("data", [])
        print(f"Gefundene EPD-Datensätze: {len(items)}\\n")
        
        for idx, item in enumerate(items[:5], 1):
            name = item.get("name", {}).get("value", "Ohne Bezeichnung")
            uuid = item.get("uuid")
            category = item.get("classification", {}).get("value", "Allgemein")
            print(f"[{idx}] {name}")
            print(f"    UUID: {uuid}")
            print(f"    Kategorie: {category}\\n")
        return items
    else:
        print(f"Fehler: HTTP {res.status_code}")
        return []

if __name__ == "__main__":
    # Beispiel: Transportbeton C25/30 oder Holz suchen
    search_oekobaudat_material("Transportbeton")`,
    explanation: 'Die offizielle REST-API der ÖKOBAUDAT ermöglicht es Planern, verifizierte EPD-Datensätze direkt in eigene Berechnungs-Skripte, Excel-Vorlagen oder BIM-Pipelines einzubinden, anstatt Werte manuell abzutippen.',
    benefit: 'Verhindert Übertragungsfehler bei QNG-Nachweisen und DGNB-Zertifizierungen und erlaubt die automatisierte Bilanzierung tausender Bauteile in Sekunden.'
  },
  {
    id: 'ifc_quantities',
    title: '2. IFC-Bauteilmengen & Materialextraktion (IfcOpenShell)',
    subtitle: 'Automatisierte Mengenermittlung (Qto) und Massenberechnung aus digitalen Modellen',
    category: 'OpenBIM & Bauinformatik',
    prerequisites: 'pip install ifcopenshell',
    code: `import ifcopenshell
import ifcopenshell.util.element

def extract_concrete_volumes(ifc_filepath):
    """
    Liest ein OpenBIM IFC-Modell (IFC4) ein und summiert das Netto-Volumen aller
    tragenden Wände und Decken für die Ökobilanzierung.
    """
    model = ifcopenshell.open(ifc_filepath)
    walls = model.by_type("IfcWall")
    slabs = model.by_type("IfcSlab")

    total_wall_volume = 0.0
    total_slab_volume = 0.0
    RHO_BETON = 2400.0  # Rohdichte Normalbeton [kg/m³]

    # Wände durchlaufen
    for wall in walls:
        psets = ifcopenshell.util.element.get_psets(wall)
        net_vol = psets.get("Qto_WallBaseQuantities", {}).get("NetVolume")
        if net_vol:
            total_wall_volume += float(net_vol)

    # Decken durchlaufen
    for slab in slabs:
        psets = ifcopenshell.util.element.get_psets(slab)
        net_vol = psets.get("Qto_SlabBaseQuantities", {}).get("NetVolume")
        if net_vol:
            total_slab_volume += float(net_vol)

    total_vol = total_wall_volume + total_slab_volume
    total_mass_t = (total_vol * RHO_BETON) / 1000.0

    print("=== IFC MENGEN-TAKEOFF ERGEBNIS ===")
    print(f"Wand-Volumen (IfcWall):     {total_wall_volume:8.2f} m³")
    print(f"Decken-Volumen (IfcSlab):   {total_slab_volume:8.2f} m³")
    print(f"Gesamtvolumen Beton:        {total_vol:8.2f} m³")
    print(f"Gesamtmasse (ρ=2400 kg/m³): {total_mass_t:8.2f} Tonnen")
    return total_vol, total_mass_t

# Ausführen mit beliebiger IFC-Datei:
# extract_concrete_volumes("MeinGebaeude_Architektur.ifc")`,
    explanation: 'Mit der freien Python-Bibliothek IfcOpenShell können IFC-Gebäudemodelle vollständig zerlegt werden. Das Skript greift auf die genormten BaseQuantities zu und extrahiert exakte Netto-Volumina.',
    benefit: 'Verbindet CAD-CAD-Software (Revit, ArchiCAD, Allplan) über standardisiertes OpenBIM nahtlos mit den CO₂-Berechnungen von BaustoffBoard.'
  },
  {
    id: 'ubakus_calc',
    title: '3. Bauphysik-Algorithmus: U-Wert & Glaser-Schichten berechnen',
    subtitle: 'Algorithmus zur Berechnung mehrschichtiger Bauteile nach DIN EN ISO 6946',
    category: 'Bauphysik & Feuchteschutz',
    prerequisites: 'Standard Python (keine externen Pakete erforderlich)',
    code: `def calculate_u_value(layers, r_si=0.13, r_se=0.04):
    """
    Berechnet den Wärmedurchgangskoeffizienten U [W/(m²K)] eines mehrschichtigen
    Bauteils nach DIN EN ISO 6946 (analog zur Ubakus-Berechnungslogik).
    
    layers: Liste von Dicts mit 'name', Dicke 'd' [m] und Leitfähigkeit 'lambda_val' [W/(mK)]
    r_si: Wärmeübergangswiderstand innen (horizontale Strömung = 0,13 m²K/W)
    r_se: Wärmeübergangswiderstand außen (0,04 m²K/W)
    """
    r_t = r_si + r_se
    print(f"{'Schicht-Bezeichnung':<28} | {'Dicke [m]':<10} | {'λ [W/mK]':<10} | {'R [m²K/W]':<10}")
    print("-" * 68)

    for lyr in layers:
        r_layer = lyr["d"] / lyr["lambda_val"]
        r_t += r_layer
        print(f"{lyr['name']:<28} | {lyr['d']:<10.4f} | {lyr['lambda_val']:<10.3f} | {r_layer:<10.3f}")

    u_value = 1.0 / r_t
    print("-" * 68)
    print(f"R_gesamt (inkl. R_si={r_si}, R_se={r_se}): {r_t:.3f} m²K/W")
    print(f"Resultierender U-Wert:                    {u_value:.3f} W/(m²K)")
    return u_value, r_t

# Beispiel: Gedämmte Holzrahmen-Außenwand
beispiel_aufbau = [
    {"name": "1. Gipskartonplatte", "d": 0.0125, "lambda_val": 0.250},
    {"name": "2. Installationsebene / Luft", "d": 0.0400, "lambda_val": 0.160},
    {"name": "3. OSB-Platte (Dampfbremse)", "d": 0.0180, "lambda_val": 0.130},
    {"name": "4. Holzfaser-Dämmung 038", "d": 0.2000, "lambda_val": 0.038},
    {"name": "5. Holzfaser-Putzträger", "d": 0.0600, "lambda_val": 0.043},
    {"name": "6. Mineralischer Außenputz", "d": 0.0100, "lambda_val": 0.800}
]

if __name__ == "__main__":
    calculate_u_value(beispiel_aufbau)`,
    explanation: 'Dieser Python-Algorithmus setzt die Berechnungslogik von Ubakus nach DIN EN ISO 6946 transparent um. Er iteriert über die Schichten und ermittelt den Gesamtwärmedurchgangskoeffizienten.',
    benefit: 'Ermöglicht automatisierte Parameterstudien und Optimierungsschleifen zur minimalen Dämmstärke für KfW-40- und Passivhausstandards.'
  },
  {
    id: 'statik_beam_calc',
    title: '4. Tragwerks-Vorbemessung: Einfeldträger GZT & GZG (Eurocode 2/3/5)',
    subtitle: 'Automatisierte Biegemomente, Querkräfte und Durchbiegungen nach Eurocode',
    category: 'Statik & Tragwerk',
    prerequisites: 'Standard Python (optional: pip install matplotlib)',
    code: `def vorbemessung_traeger(l_span=6.0, q_gk=4.5, q_qk=3.0, e_modul=33000e6, b=0.25, h=0.45):
    """
    Einfeldträger-Vorbemessung nach DIN EN 1990 / DIN EN 1992-1-1.
    l_span:   Stützweite [m]
    q_gk:     Ständige Gleichlast [kN/m]
    q_qk:     Veränderliche Gleichlast [kN/m]
    e_modul:  Elastizitätsmodul [N/m²] (z.B. C25/30 = 33.000 MPa)
    b, h:     Querschnittsbreite und -höhe [m]
    """
    gamma_g = 1.35
    gamma_q = 1.50

    # 1. Grenzzustand der Tragfähigkeit (GZT)
    q_ed = gamma_g * q_gk + gamma_q * q_qk
    m_ed = (q_ed * (l_span ** 2)) / 8.0  # Biegemoment kNm
    v_ed = (q_ed * l_span) / 2.0         # Querkraft am Auflager kN

    # 2. Grenzzustand der Gebrauchstauglichkeit (GZG)
    # Flächenträgheitsmoment Rechteckquerschnitt I_y = b * h³ / 12
    i_y = (b * (h ** 3)) / 12.0
    
    # Quasi-ständige Lastkombination: q_sls = gk + psi_2 * qk (psi_2 = 0.3 für Wohnbauten)
    q_sls_nm = (q_gk + 0.3 * q_qk) * 1000.0  # N/m
    w_sls_m = (5.0 * q_sls_nm * (l_span ** 4)) / (384.0 * e_modul * i_y)
    w_sls_mm = w_sls_m * 1000.0
    w_zul_mm = (l_span / 250.0) * 1000.0

    print("=== VORBEMESSUNG EINFELDTRÄGER (EUROCODE) ===")
    print(f"Spannweite:             L = {l_span:.2f} m")
    print(f"Bemessungslast GZT:    q_Ed = {q_ed:.2f} kN/m")
    print(f"Max. Biegemoment:      M_Ed = {m_ed:.2f} kNm")
    print(f"Max. Auflagerquerkraft:V_Ed = {v_ed:.2f} kN")
    print(f"Durchbiegung w_SLS:    {w_sls_mm:.2f} mm (Grenzwert L/250 = {w_zul_mm:.2f} mm)")
    print(f"Nachweis GZG erfüllt:  {'JA (Ausnutzung ' + str(round(w_sls_mm/w_zul_mm*100, 1)) + '%)' if w_sls_mm <= w_zul_mm else 'NEIN (Querschnitt vergrößern!)'}")
    return m_ed, v_ed, w_sls_mm

if __name__ == "__main__":
    vorbemessung_traeger(l_span=5.5, q_gk=5.0, q_qk=2.5)`,
    explanation: 'Dieses Skript bildet die mathematischen Grundlagen von Calcpad und SkyCiv ab. Es ermittelt deterministisch Schnittgrößen im GZT sowie die elastische Verformung im GZG unter quasi-ständiger Einwirkungskombination.',
    benefit: 'Schnelle Verifikation von Vorlesungsaufgaben und Plausibilitätsprüfungen vor der FE-Modellierung in großen Statikprogrammen.'
  }
];

export default function OnlineTools() {
  const [currentView, setCurrentView] = useState<'matrix' | 'api_lab'>('matrix');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAccess, setSelectedAccess] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTools = useMemo(() => {
    return ONLINE_TOOLS.filter(tool => {
      const matchCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchAccess = selectedAccess === 'all' || tool.accessType === selectedAccess;
      const matchSearch = searchQuery.trim() === '' || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.detailedFeatures.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tool.standards.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.institutionOrAuthor.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchAccess && matchSearch;
    });
  }, [selectedCategory, selectedAccess, searchQuery]);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header & Intro */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
              <Globe size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-main">
                Empfohlene Online-Tools &amp; Webrechner
              </h1>
              <p className="text-sm text-text-main/70">
                Kuratierte, praxiserprobte und kostenlose Weblösungen für Bauingenieure und Architekten (DT &amp; ENG)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-off-white px-3 py-1.5 rounded-xl border border-home-grau/30 text-xs text-text-main/80 font-medium">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>100 % Geprüfte Fachquellen &amp; Normbezug</span>
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          Diese Fachübersicht bündelt unverzichtbare Online-Rechner, numerische Simulationen, behördliche Geoportale und parametrische Skripte.
          Alle aufgeführten Tools sind entweder <strong>vollständig kostenlos im Web nutzbar</strong>, stehen als <strong>geprüfte Open-Source-Software</strong> bereit oder bieten unkomplizierte <strong>Freemium- und Studentenmodelle</strong> für Studium, Masterthesen und den täglichen Ingenieurbüro-Einsatz.
        </div>

        {/* View Switcher: Matrix vs. API Lab */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-home-grau/20">
          <button
            onClick={() => setCurrentView('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              currentView === 'matrix'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-slate-50'
            }`}
          >
            <Layers size={14} />
            <span>Kuratierte Webrechner-Matrix ({ONLINE_TOOLS.length} Tools)</span>
          </button>
          <button
            onClick={() => setCurrentView('api_lab')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              currentView === 'api_lab'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-slate-50'
            }`}
          >
            <Terminal size={14} />
            <span>API- &amp; Schnittstellen-Lab (Python &amp; REST)</span>
            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">NEU</span>
          </button>
        </div>
      </div>

      {currentView === 'matrix' && (
        <>
          {/* Filter & Search Bar */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Nach Tool, Stichwort, Norm oder Herausgeber suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-off-white rounded-xl border border-home-grau/30 text-text-main placeholder:text-text-main/40 focus:outline-none focus:border-shiraz transition-all"
              />
            </div>

            {/* Category selector */}
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-off-white text-text-main/80 border-home-grau/30 hover:bg-slate-100'
                }`}
              >
                Alle ({ONLINE_TOOLS.length})
              </button>
              <button
                onClick={() => setSelectedCategory('statik')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                  selectedCategory === 'statik'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-off-white text-text-main/80 border-home-grau/30 hover:bg-slate-100'
                }`}
              >
                Statik &amp; Tragwerk
              </button>
              <button
                onClick={() => setSelectedCategory('bauphysik')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                  selectedCategory === 'bauphysik'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-off-white text-text-main/80 border-home-grau/30 hover:bg-slate-100'
                }`}
              >
                Bauphysik
              </button>
              <button
                onClick={() => setSelectedCategory('holzbau')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                  selectedCategory === 'holzbau'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-off-white text-text-main/80 border-home-grau/30 hover:bg-slate-100'
                }`}
              >
                Holzbau
              </button>
              <button
                onClick={() => setSelectedCategory('lca')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                  selectedCategory === 'lca'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-off-white text-text-main/80 border-home-grau/30 hover:bg-slate-100'
                }`}
              >
                LCA &amp; Ökobilanz
              </button>
              <button
                onClick={() => setSelectedCategory('bim')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                  selectedCategory === 'bim'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-off-white text-text-main/80 border-home-grau/30 hover:bg-slate-100'
                }`}
              >
                BIM &amp; Geodaten
              </button>
              <button
                onClick={() => setSelectedCategory('geotechnik')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                  selectedCategory === 'geotechnik'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-off-white text-text-main/80 border-home-grau/30 hover:bg-slate-100'
                }`}
              >
                Geotechnik &amp; Labor
              </button>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTools.map((tool) => (
              <div 
                key={tool.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-3">
                  {/* Header inside Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {tool.categoryLabel}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/50">
                          {tool.language}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                          {tool.accessType}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                        {tool.name}
                      </h3>
                    </div>

                    {tool.recommendationBadge && (
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap shadow-2xs ${
                        tool.recommendationBadge === 'Standard im Büro' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        tool.recommendationBadge === 'Offizieller Standard' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                        tool.recommendationBadge === 'Didaktisch wertvoll' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        'bg-cyan-100 text-cyan-900 border border-cyan-300'
                      }`}>
                        ★ {tool.recommendationBadge}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="text-sm text-text-main/85 leading-relaxed">
                    <FormulaText text={tool.shortDesc} />
                  </div>

                  {/* Features List */}
                  <div className="bg-off-white/80 p-3.5 rounded-xl border border-home-grau/25 mt-1">
                    <span className="text-xs font-bold text-slate-700 block mb-2">Kernfunktionen &amp; Stärken:</span>
                    <ul className="space-y-1.5">
                      {tool.detailedFeatures.map((feat, idx) => (
                        <li key={idx} className="text-xs text-text-main/75 flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                          <span><FormulaText text={feat} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Meta & External Button */}
                <div className="mt-5 pt-4 border-t border-home-grau/20 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-text-main/60">
                    <span className="block font-medium text-slate-700">Normen: {tool.standards}</span>
                    <span className="block text-[11px]">Herausgeber: {tool.institutionOrAuthor}</span>
                  </div>

                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-shiraz hover:bg-shiraz/90 text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <span>Tool öffnen</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}

            {filteredTools.length === 0 && (
              <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-home-grau/30 text-text-main/60">
                <Search size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="font-medium">Keine Werkzeuge für die gewählten Filterkriterien gefunden.</p>
                <p className="text-xs mt-1">Setzen Sie den Suchbegriff oder die Kategorie zurück.</p>
              </div>
            )}
          </div>
        </>
      )}

      {currentView === 'api_lab' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Terminal className="text-shiraz" size={20} />
              API- &amp; Schnittstellen-Lab (Python &amp; REST)
            </h2>
            <p className="text-sm text-text-main/75 leading-relaxed">
              Moderne Bauingenieure und Architekten automatisieren Routineabfragen. Hier finden Sie praxisnahe, direkt kopierbare Code-Snippets, mit denen Sie offizielle REST-APIs (wie ÖKOBAUDAT) und BIM-Schnittstellen (IFC) eigenständig anbinden können.
            </p>
          </div>

          <div className="space-y-6">
            {API_SNIPPETS.map((snippet) => (
              <div 
                key={snippet.id} 
                className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-home-grau/20 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-shiraz/10 text-shiraz border border-shiraz/20">
                        {snippet.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {snippet.prerequisites}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-text-main">
                      {snippet.title}
                    </h3>
                    <p className="text-xs text-text-main/70 mt-0.5">
                      {snippet.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyCode(snippet.id, snippet.code)}
                    className="shrink-0 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-home-grau/30 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedId === snippet.id ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span className="text-emerald-700">Code kopiert!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="text-shiraz" />
                        <span>Code kopieren</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Body */}
                <div className="p-6 bg-slate-900 text-slate-100 overflow-x-auto font-mono text-xs leading-relaxed">
                  <pre>{snippet.code}</pre>
                </div>

                {/* Explanations & Benefit */}
                <div className="p-5 bg-off-white border-t border-home-grau/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                      <Code size={13} className="text-shiraz" /> Didaktische Funktionsweise:
                    </span>
                    <p className="text-text-main/80 leading-relaxed">
                      {snippet.explanation}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-800 block mb-1 flex items-center gap-1">
                      <Sparkles size={13} className="text-emerald-600" /> Praxisnutzen für Studium &amp; Büro:
                    </span>
                    <p className="text-text-main/80 leading-relaxed">
                      {snippet.benefit}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Didaktische Tipps für das Studium & Ingenieurbüro */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <Sparkles className="text-shiraz" size={18} />
          Best-Practice-Workflow: Kombination von Online-Tools mit BaustoffBoard
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-text-main/80">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Activity size={14} className="text-shiraz" /> 1. Vorbemessung &amp; Plausibilität
            </h4>
            <p className="leading-relaxed">
              Nutzen Sie Online-Rechner (wie SkyCiv, STRIAN oder Calcpad) für die schnelle Ersteinschätzung von Momenten und Querkräften. Vergleichen Sie die Werte stets mit den Bemessungsmodulen in BaustoffBoard (z. B. Biegebemessung, Querkraft).
            </p>
          </div>

          <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Leaf size={14} className="text-shiraz" /> 2. Ökobilanz &amp; Baustoffwahl
            </h4>
            <p className="leading-relaxed">
              Verknüpfen Sie das BaustoffBoard-Modul <em>LCA Lebenszyklussimulator</em> mit den exakten EPD-Stammdaten aus der ÖKOBAUDAT, WECOBIS und dem EC3-Tool, um Primärenergiebedarfe (PENRT) und GWP-Kennwerte für Förderanträge (QNG, KfW) nachzuweisen.
            </p>
          </div>

          <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Box size={14} className="text-shiraz" /> 3. Bauphysik &amp; Detailausbildung
            </h4>
            <p className="leading-relaxed">
              Schichtaufbauten aus dem BaustoffBoard-Modul <em>Bauphysik / U-Wert</em> können bei komplexen geometrischen Anschlüssen direkt mit THERM auf 2D-Wärmebrücken und mit Ubakus auf Kondensatausfall überprüft werden.
            </p>
          </div>
        </div>
      </div>

      {/* Standardisierter Footer */}
      <ModuleFooter
        wikipedia={[
          { title: 'Bausoftware', url: 'https://de.wikipedia.org/wiki/Bausoftware' },
          { title: 'Building Information Modeling', url: 'https://de.wikipedia.org/wiki/Building_Information_Modeling' },
          { title: 'Ökobilanz', url: 'https://de.wikipedia.org/wiki/%C3%96kobilanz' }
        ]}
        literatur={[
          'Wendehorst Baustoffkunde: Grundlagen, Baustoffe und Werkstoffprüfung (Springer Vieweg)',
          'Borrmann, A. et al.: Handbuch Building Information Modeling (Springer Vieweg)',
          'Barth, C.; Rustler, W.: Praxis der Finite-Elemente-Methode im Bauwesen (Bauwerk Verlag)'
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 19650 (BIM-Informationsmanagement)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+19650' },
          { title: 'DIN EN 15804 (Nachhaltigkeit von Bauwerken - EPDs)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+15804' },
          { title: 'DIN EN ISO 6946 (Wärmedurchlasswiderstand und Wärmedurchgangskoeffizient)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+6946' },
          { title: 'DIN EN 1995-1-1 (Eurocode 5: Bemessung und Konstruktion von Holzbauten)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1995-1-1' },
          { title: 'DIN EN 15026 (Wärme- und feuchtetechnisches Verhalten von Bauteilen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+15026' }
        ]}
        weblinks={[
          { title: 'Ubakus.de – Interaktiver U-Wert- & Glaser-Rechner', url: 'https://www.ubakus.de/' },
          { title: 'Dlubal Geo-Zone Tool – Schnee-, Wind- & Erdbebenzonen', url: 'https://www.dlubal.com/de/lastzonen-schnee-wind-erdbeben/' },
          { title: 'Fraunhofer IBP WUFI – Instationäre Feuchte- und Wärmesimulation', url: 'https://wufi.de/' },
          { title: 'ÖKOBAUDAT Plattform – BMWSB EPD-Datenbank', url: 'https://www.oekobaudat.de/' },
          { title: 'WECOBIS – Ökologisches Baustoffportal des Bundes', url: 'https://www.wecobis.de/' },
          { title: 'Madaster Germany – Material- und Zirkularitätskataster', url: 'https://madaster.de/' },
          { title: 'Concular – Zirkulärer Marktplatz für Sekundärbaustoffe', url: 'https://concular.de/' },
          { title: 'best wood STATICS – Kostenlose Holzbaubemessung nach EC5', url: 'https://www.schneider-holz.com/service/statiksoftware.html' },
          { title: 'STRIAN – Online 2D-Stabwerkberechnung', url: 'https://strian.designer.io/' },
          { title: 'Calcpad – Parametrische Ingenieurberechnungen', url: 'https://calcpad.eu/' },
          { title: 'thatOpen Company – Open-Source WebGL IFC Viewer', url: 'https://thatopen.com/' }
        ]}
        formeln={[
          {
            formel: 'U = \\frac{1}{R_{si} + \\sum_{i=1}^n \\frac{d_i}{\\lambda_i} + R_{se}} \\quad [\\text{W/(m}^2\\cdot\\text{K)}]',
            erklaerung: 'Wärmedurchgangskoeffizient eines mehrschichtigen homogenen Bauteils mit innerem/äußerem Wärmeübergangswiderstand und Schichtdicken d_i sowie Wärmeleitfähigkeiten lambda_i.',
            quelle: 'DIN EN ISO 6946'
          },
          {
            formel: 'M_{Ed} = \\frac{q_{Ed} \\cdot L^2}{8}, \\quad w_{\\text{SLS}} = \\frac{5 \\cdot q_{\\text{quasi}} \\cdot L^4}{384 \\cdot E \\cdot I_y} \\le \\frac{L}{250}',
            erklaerung: 'Klassische Schnittgrößen- und Durchbiegungsformel für Einfeldträger im GZT und GZG unter Gleichstreckenlast.',
            quelle: 'DIN EN 1990 / DIN EN 1992-1-1'
          }
        ]}
      />
    </div>
  );
}
